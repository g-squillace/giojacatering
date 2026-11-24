import { SUPPORT } from "@/report/config";
import type { PeriodRange, SupportSection } from "@/report/types";

export function buildSupport(period: PeriodRange): SupportSection | null {
  if (SUPPORT === null) return null;

  const entries = [...SUPPORT.entries]
    .sort((left, right) => right.date.localeCompare(left.date))
    .map((entry) => ({
      date: entry.date,
      hours: entry.hours,
      description: entry.description,
      inPeriod: entry.date >= period.start && entry.date <= period.end,
    }));

  const usedHours = entries.reduce((sum, entry) => sum + entry.hours, 0);

  return {
    totalHours: SUPPORT.totalHours,
    usedHours,
    remainingHours: Math.max(0, SUPPORT.totalHours - usedHours),
    usedThisPeriod: entries
      .filter((entry) => entry.inPeriod)
      .reduce((sum, entry) => sum + entry.hours, 0),
    startedOn: SUPPORT.startedOn,
    entries,
  };
}
