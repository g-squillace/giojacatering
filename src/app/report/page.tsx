import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, readSession } from "@/report/auth";
import { REPORT } from "@/report/config";
import Dashboard from "@/components/Report/Dashboard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ReportPage({
  searchParams,
}: {
  searchParams: { settimane?: string; indietro?: string };
}) {
  const session = await readSession(cookies().get(SESSION_COOKIE)?.value);
  if (session === null) redirect("/report/login");

  return (
    <Dashboard
      role={session.role}
      user={session.user}
      initialWeeks={searchParams.settimane ?? String(REPORT.defaultWindowWeeks)}
      initialPeriodsBack={searchParams.indietro ?? "0"}
    />
  );
}
