"use client";

import { useCallback, useEffect, useState } from "react";
import ReportLoading from "@/components/Report/ReportLoading";
import ReportView from "@/components/Report/ReportView";
import { REPORT } from "@/report/config";
import type { SiteReport } from "@/report/types";
import type { Role } from "@/report/auth";

function parseWeeks(raw: string): number {
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 1 || parsed > 52) {
    return REPORT.defaultWindowWeeks;
  }
  return parsed;
}

function parsePeriodsBack(raw: string): number {
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 12) return 0;
  return parsed;
}

function isReport(value: unknown): value is SiteReport {
  if (typeof value !== "object" || value === null) return false;
  const period: unknown = Reflect.get(value, "period");
  const search: unknown = Reflect.get(value, "search");
  return typeof period === "object" && period !== null && search !== null;
}

export default function Dashboard({
  role,
  user,
  initialWeeks,
  initialPeriodsBack,
}: {
  role: Role;
  user: string;
  initialWeeks: string;
  initialPeriodsBack: string;
}) {
  const [weeks, setWeeks] = useState(() => parseWeeks(initialWeeks));
  const [periodsBack, setPeriodsBack] = useState(() =>
    parsePeriodsBack(initialPeriodsBack)
  );
  const [report, setReport] = useState<SiteReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setReport(null);
    setError(null);

    async function load() {
      try {
        const response = await fetch(
          `/api/report/data?settimane=${weeks}&indietro=${periodsBack}`,
          { cache: "no-store" }
        );
        if (response.status === 401) {
          window.location.href = "/report/login";
          return;
        }
        const payload: unknown = await response.json();
        if (cancelled) return;
        if (!response.ok) {
          const message: unknown = Reflect.get(payload as object, "error");
          setError(
            typeof message === "string" ? message : "Lettura non riuscita."
          );
          return;
        }
        const next: unknown = Reflect.get(payload as object, "report");
        if (isReport(next)) {
          setReport(next);
        } else {
          setError("La risposta non conteneva un report leggibile.");
        }
      } catch {
        if (!cancelled) setError("Non sono riuscito a contattare il server.");
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [weeks, periodsBack, reloadToken]);

  const changeWindow = useCallback(
    (nextWeeks: number, nextPeriodsBack: number) => {
      setWeeks(nextWeeks);
      setPeriodsBack(nextPeriodsBack);
      const url = new URL(window.location.href);
      url.searchParams.set("settimane", String(nextWeeks));
      url.searchParams.set("indietro", String(nextPeriodsBack));
      window.history.replaceState(null, "", url.toString());
    },
    []
  );

  if (error !== null) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
        <h1 className="font-serif text-lg">Non sono riuscito a leggere i dati</h1>
        <p role="alert" className="mt-3 text-sm leading-relaxed">
          {error}
        </p>
        <button
          type="button"
          onClick={() => setReloadToken((token) => token + 1)}
          className="mt-6 min-h-[44px] bg-accent px-6 text-sm font-semibold uppercase tracking-widest text-accent-content focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary-content"
        >
          Riprova
        </button>
      </main>
    );
  }

  if (report === null) return <ReportLoading weeks={weeks} />;

  return (
    <>
      <span className="sr-only">Sei entrato come {user}.</span>
      <ReportView
        report={report}
        role={role}
        weeks={weeks}
        periodsBack={periodsBack}
        onWindowChange={changeWindow}
      />
    </>
  );
}
