import { SitemapDocument } from "@/graphql/generated";
import fetchDato from "@/lib/fetchDato";
import { REPORT } from "@/report/config";
import { missingList, readEnv } from "@/report/env";
import { completePeriod, periodWeekBuckets } from "@/report/period";
import { serviceAccount } from "@/report/google";
import {
  LEAD_EVENTS,
  fetchAnalytics,
  propertyId,
  type AnalyticsPeriod,
  type AnalyticsTotals,
} from "@/report/analytics";
import {
  fetchSearchConsole,
  siteUrl,
  type SearchPeriod,
  type SearchTotals,
} from "@/report/search-console";
import {
  buildHeadline,
  demandGap,
  invisibleQueries,
  isBranded,
  portfolioMatcher,
  strikingDistance,
  upsellSignals,
} from "@/report/insights";
import { buildSupport } from "@/report/support";
import * as sample from "@/report/sample";
import type {
  NamedRow,
  SiteReport,
  SourceState,
  TrendPoint,
} from "@/report/types";

const CACHE_TTL_MS = 5 * 60 * 1000;

interface CacheEntry {
  report: SiteReport;
  storedAt: number;
}

const cache = new Map<string, CacheEntry>();

const GOOGLE_VARS = [
  "GOOGLE_SERVICE_ACCOUNT_JSON",
  "GA4_PROPERTY_ID",
  "SEARCH_CONSOLE_SITE_URL",
];

function sumEvents(events: NamedRow[]): number {
  return events
    .filter((row) => LEAD_EVENTS.includes(row.label))
    .reduce((total, row) => total + row.value, 0);
}

function leadEventRows(events: NamedRow[]): NamedRow[] {
  const rows = events.filter((row) => LEAD_EVENTS.includes(row.label));
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  return rows
    .map((row) => ({
      label: row.label,
      value: row.value,
      share: total > 0 ? row.value / total : 0,
    }))
    .sort((left, right) => right.value - left.value);
}

function demoAnalytics(): {
  current: AnalyticsPeriod;
  previous: AnalyticsTotals;
  previousEvents: NamedRow[];
} {
  const daily = new Map<string, { sessions: number; users: number }>();
  return {
    current: {
      totals: sample.SAMPLE_TOTALS,
      daily,
      channels: [...sample.SAMPLE_CHANNELS],
      devices: [...sample.SAMPLE_DEVICES],
      pages: [...sample.SAMPLE_PAGES],
      events: [...sample.SAMPLE_EVENTS],
      assistants: [...sample.SAMPLE_ASSISTANTS],
    },
    previous: sample.SAMPLE_PREVIOUS_TOTALS,
    previousEvents: [...sample.SAMPLE_PREVIOUS_EVENTS],
  };
}

function demoSearch(): { current: SearchPeriod; previous: SearchTotals } {
  return {
    current: {
      totals: sample.SAMPLE_SEARCH_TOTALS,
      queries: [...sample.SAMPLE_QUERIES],
      pages: [...sample.SAMPLE_SEARCH_PAGES],
      daily: new Map(),
      freshUntil: null,
    },
    previous: sample.SAMPLE_PREVIOUS_SEARCH_TOTALS,
  };
}

async function postTitles(): Promise<string[]> {
  try {
    const data = await fetchDato(SitemapDocument, {}, false);
    const titles: string[] = [];
    for (const post of data?.allPosts || []) {
      for (const slug of post.slugs || []) {
        if (slug?.value) titles.push(slug.value.replace(/-/g, " "));
      }
    }
    return titles.length > 0 ? titles : sample.SAMPLE_POST_TITLES;
  } catch {
    return sample.SAMPLE_POST_TITLES;
  }
}

function trendFromSources(
  weekStarts: { start: string; label: string; days: string[] }[],
  analytics: AnalyticsPeriod,
  search: SearchPeriod,
  demo: boolean
): TrendPoint[] {
  return weekStarts.map((bucket, index) => {
    if (demo) {
      const wave = Math.sin(index / 2) * 18;
      return {
        start: bucket.start,
        label: bucket.label,
        sessions: Math.round(62 + index * 2.4 + wave),
        clicks: Math.round(7 + index * 0.3 + wave / 8),
        impressions: Math.round(92 + index * 4.1 + wave),
      };
    }
    let sessions = 0;
    let clicks = 0;
    let impressions = 0;
    for (const day of bucket.days) {
      sessions += analytics.daily.get(day)?.sessions ?? 0;
      const searchDay = search.daily.get(day);
      clicks += searchDay?.clicks ?? 0;
      impressions += searchDay?.impressions ?? 0;
    }
    return { start: bucket.start, label: bucket.label, sessions, clicks, impressions };
  });
}

export async function buildSiteReport(
  weeks: number,
  periodsBack: number
): Promise<SiteReport> {
  const key = `${weeks}:${periodsBack}`;
  const cached = cache.get(key);
  if (cached !== undefined && Date.now() - cached.storedAt < CACHE_TTL_MS) {
    return cached.report;
  }

  const period = completePeriod(new Date(), weeks, periodsBack);
  const previousPeriod = completePeriod(new Date(), weeks, periodsBack + 1);

  const credentialsReady =
    serviceAccount() !== null && propertyId() !== null && siteUrl() !== null;

  let analyticsSource: SourceState = { status: "live", message: null };
  let searchSource: SourceState = { status: "live", message: null };

  const analyticsPromise = credentialsReady
    ? fetchAnalytics(period, previousPeriod).catch((error: unknown) => {
        analyticsSource = {
          status: "error",
          message:
            error instanceof Error ? error.message.slice(0, 220) : "errore sconosciuto",
        };
        return demoAnalytics();
      })
    : Promise.resolve(demoAnalytics());

  const searchPromise = credentialsReady
    ? fetchSearchConsole(period, previousPeriod).catch((error: unknown) => {
        searchSource = {
          status: "error",
          message:
            error instanceof Error ? error.message.slice(0, 220) : "errore sconosciuto",
        };
        return demoSearch();
      })
    : Promise.resolve(demoSearch());

  const [analytics, search, titles] = await Promise.all([
    analyticsPromise,
    searchPromise,
    postTitles(),
  ]);

  if (!credentialsReady) {
    const message = `Dati di esempio: mancano ${missingList(GOOGLE_VARS)}.`;
    analyticsSource = { status: "demo", message };
    searchSource = { status: "demo", message };
  }

  const demo = analyticsSource.status !== "live" || searchSource.status !== "live";
  const isPortfolioQuery = portfolioMatcher(titles);
  const notPortfolio = (query: string) => !isPortfolioQuery(query);

  const queries = search.current.queries;
  const brandedClicks = queries
    .filter((row) => isBranded(row.query))
    .reduce((sum, row) => sum + row.clicks, 0);

  const gap = demandGap(
    queries,
    (query) =>
      notPortfolio(query) &&
      /catering|banqueting|matrimon|rinfresc|buffet|gala/i.test(query),
    "chi cerca un catering senza conoscervi"
  );

  const leadsCurrent = sumEvents(analytics.current.events);
  const leadsPrevious = sumEvents(analytics.previousEvents);
  const leadsTracked = analytics.current.events.some((row) =>
    LEAD_EVENTS.includes(row.label)
  );

  const report: SiteReport = {
    period,
    previousPeriod,
    generatedAt: new Date().toISOString(),
    leads: {
      total: { current: leadsCurrent, previous: leadsPrevious },
      byEvent: leadEventRows(analytics.current.events),
      tracked: leadsTracked,
    },
    traffic: {
      sessions: {
        current: analytics.current.totals.sessions,
        previous: analytics.previous.sessions,
      },
      users: {
        current: analytics.current.totals.users,
        previous: analytics.previous.users,
      },
      newUsers: {
        current: analytics.current.totals.newUsers,
        previous: analytics.previous.newUsers,
      },
      pageViews: {
        current: analytics.current.totals.pageViews,
        previous: analytics.previous.pageViews,
      },
      engagementRate: {
        current: analytics.current.totals.engagementRate,
        previous: analytics.previous.engagementRate,
      },
      averageSessionSeconds: {
        current: analytics.current.totals.averageSessionSeconds,
        previous: analytics.previous.averageSessionSeconds,
      },
      channels: analytics.current.channels,
      devices: analytics.current.devices,
      assistants: analytics.current.assistants,
      topPages: analytics.current.pages,
    },
    search: {
      clicks: {
        current: search.current.totals.clicks,
        previous: search.previous.clicks,
      },
      impressions: {
        current: search.current.totals.impressions,
        previous: search.previous.impressions,
      },
      ctr: { current: search.current.totals.ctr, previous: search.previous.ctr },
      position: {
        current: search.current.totals.position,
        previous: search.previous.position,
      },
      topQueries: [...queries]
        .sort((left, right) => right.impressions - left.impressions)
        .slice(0, 25),
      topPages: search.current.pages.slice(0, 12),
      brandedClicks,
      nonBrandedClicks: Math.max(
        0,
        search.current.totals.clicks - brandedClicks
      ),
      visibleImpressions: queries.reduce((sum, row) => sum + row.impressions, 0),
      freshUntil: search.current.freshUntil,
    },
    trend: trendFromSources(
      periodWeekBuckets(period),
      analytics.current,
      search.current,
      demo
    ),
    demandGap: gap,
    opportunities: strikingDistance(queries, notPortfolio),
    portfolioOpportunities: strikingDistance(queries, isPortfolioQuery),
    invisible: invisibleQueries(queries, notPortfolio),
    upsell: upsellSignals(queries, period.label, notPortfolio),
    support: buildSupport(period),
    headline: buildHeadline(gap, leadsCurrent, leadsTracked),
    analyticsSource,
    searchSource,
  };

  cache.set(key, { report, storedAt: Date.now() });
  return report;
}

export function reportWindowWeeks(raw: string | null): number {
  if (raw === null) return REPORT.defaultWindowWeeks;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 1 || parsed > 52) {
    return REPORT.defaultWindowWeeks;
  }
  return parsed;
}

export function reportPeriodsBack(raw: string | null): number {
  if (raw === null) return 0;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 12) return 0;
  return parsed;
}

export function missingGoogleVars(): string[] {
  return GOOGLE_VARS.filter((name) => {
    if (name === "GA4_PROPERTY_ID") return propertyId() === null;
    if (name === "SEARCH_CONSOLE_SITE_URL") return siteUrl() === null;
    return readEnv(name) === null;
  });
}
