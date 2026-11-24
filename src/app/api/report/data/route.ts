import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { PRIVATE_HEADERS, SESSION_COOKIE, readSession } from "@/report/auth";
import type { Role } from "@/report/auth";
import {
  buildSiteReport,
  reportPeriodsBack,
  reportWindowWeeks,
} from "@/report/build-report";
import type { SiteReport } from "@/report/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function withoutAgencyOnlyFields(report: SiteReport, role: Role): SiteReport {
  if (role === "agency") return report;
  return {
    ...report,
    upsell: report.upsell.map((signal) => ({ ...signal, prompt: "" })),
    analyticsSource:
      report.analyticsSource.status === "error"
        ? { status: "error", message: null }
        : report.analyticsSource,
    searchSource:
      report.searchSource.status === "error"
        ? { status: "error", message: null }
        : report.searchSource,
  };
}

export async function GET(request: Request): Promise<NextResponse> {
  const session = await readSession(cookies().get(SESSION_COOKIE)?.value);
  if (session === null) {
    return NextResponse.json(
      { error: "Sessione scaduta" },
      { status: 401, headers: PRIVATE_HEADERS }
    );
  }

  const url = new URL(request.url);
  const weeks = reportWindowWeeks(url.searchParams.get("settimane"));
  const periodsBack = reportPeriodsBack(url.searchParams.get("indietro"));

  try {
    const report = await buildSiteReport(weeks, periodsBack);
    return NextResponse.json(
      {
        report: withoutAgencyOnlyFields(report, session.role),
        role: session.role,
        weeks,
        periodsBack,
      },
      { headers: PRIVATE_HEADERS }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message.slice(0, 220)
            : "errore sconosciuto",
      },
      { status: 500, headers: PRIVATE_HEADERS }
    );
  }
}
