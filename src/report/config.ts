export const REPORT = {
  ga4PropertyId: "548367509",
  ga4MeasurementId: "G-Y1W8GVKBH9",
  searchConsoleSiteUrl: "https://giojacatering.it/",
  siteName: "GioJa Catering",
  siteUrl: "https://giojacatering.it",
  reportUser: "gioja",
  agencyUser: "guido",
  agencyEmail: "info@guidosquillace.it",
  defaultWindowWeeks: 13,
  windowChoices: [4, 13, 26, 52],
} as const;

export const BRAND_TERMS = [
  "gioja",
  "gioia catering",
  "giojacatering",
  "gioja catering",
];

export type SupportConfig = {
  totalHours: number;
  startedOn: string;
  entries: { date: string; hours: number; description: string }[];
};

export const SUPPORT: SupportConfig | null = null;
