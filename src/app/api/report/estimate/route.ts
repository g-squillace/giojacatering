import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { PRIVATE_HEADERS, SESSION_COOKIE, readSession } from "@/report/auth";
import { REPORT } from "@/report/config";
import { readEnv } from "@/report/env";
import {
  buildSiteReport,
  reportPeriodsBack,
  reportWindowWeeks,
} from "@/report/build-report";
import { formatDecimal, formatNumber } from "@/report/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<NextResponse> {
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

  const body: unknown = await request.json().catch(() => null);
  const signalId: unknown =
    typeof body === "object" && body !== null ? Reflect.get(body, "id") : null;
  if (typeof signalId !== "string") {
    return NextResponse.json(
      { error: "Tema non indicato" },
      { status: 400, headers: PRIVATE_HEADERS }
    );
  }

  const report = await buildSiteReport(weeks, periodsBack);
  const signal = report.upsell.find((item) => item.id === signalId);
  if (signal === undefined) {
    return NextResponse.json(
      { error: "Tema non trovato nel periodo" },
      { status: 404, headers: PRIVATE_HEADERS }
    );
  }

  const lines = signal.queries.map(
    (row) =>
      `- "${row.query}": ${formatNumber(row.impressions)} viste, ${formatNumber(
        row.clicks
      )} clic, posizione media ${formatDecimal(row.position, 1)}`
  );

  const message = [
    `Richiesta di stima da ${REPORT.siteName} tramite il cruscotto del sito.`,
    "",
    `Tema: ${signal.service}`,
    `Periodo osservato: ${report.period.label} (${weeks} settimane)`,
    `Totale su questo tema: ${formatNumber(
      signal.impressions
    )} viste e ${formatNumber(
      signal.clicks
    )} clic, posizione media ${formatDecimal(signal.position, 1)}`,
    "",
    "Ricerche:",
    ...lines,
    "",
    "Cosa si propone:",
    ...signal.solution.map((step) => `- ${step}`),
    "",
    "Cosa serve dal cliente:",
    ...signal.needed.map((step) => `- ${step}`),
    "",
    `Obiettivo: ${signal.goal}`,
    "",
    `Richiesta inviata da: ${session.user}`,
  ].join("\n");

  const subject = `Stima ${REPORT.siteName}: ${signal.service}`;
  const accessKey = readEnv("REPORT_ESTIMATE_ACCESS_KEY");

  return NextResponse.json(
    {
      subject,
      message,
      accessKey,
      to: REPORT.agencyEmail,
      mailto: `mailto:${REPORT.agencyEmail}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(message)}`,
    },
    { headers: PRIVATE_HEADERS }
  );
}
