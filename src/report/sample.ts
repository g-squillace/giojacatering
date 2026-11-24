import type { NamedRow, PageRow, QueryRow } from "@/report/types";

export const SAMPLE_DAILY_SESSIONS = 11;

export const SAMPLE_TOTALS = {
  sessions: 1004,
  users: 842,
  newUsers: 731,
  pageViews: 2410,
  engagementRate: 0.57,
  averageSessionSeconds: 71,
};

export const SAMPLE_PREVIOUS_TOTALS = {
  sessions: 884,
  users: 742,
  newUsers: 651,
  pageViews: 2104,
  engagementRate: 0.54,
  averageSessionSeconds: 66,
};

export const SAMPLE_CHANNELS: NamedRow[] = [
  { label: "Organic Search", value: 512, share: 0.51 },
  { label: "Direct", value: 268, share: 0.267 },
  { label: "Organic Social", value: 171, share: 0.17 },
  { label: "Referral", value: 38, share: 0.038 },
  { label: "AI Assistant", value: 15, share: 0.015 },
];

export const SAMPLE_DEVICES: NamedRow[] = [
  { label: "mobile", value: 702, share: 0.699 },
  { label: "desktop", value: 271, share: 0.27 },
  { label: "tablet", value: 31, share: 0.031 },
];

export const SAMPLE_ASSISTANTS: NamedRow[] = [
  { label: "ChatGPT", value: 9, share: 0.6 },
  { label: "Perplexity", value: 4, share: 0.267 },
  { label: "Gemini", value: 2, share: 0.133 },
  { label: "Claude", value: 0, share: 0 },
  { label: "Copilot", value: 0, share: 0 },
];

export const SAMPLE_PAGES: PageRow[] = [
  { path: "/", views: 940, sessions: 612 },
  { path: "/servizi", views: 461, sessions: 188 },
  { path: "/gallery", views: 388, sessions: 121 },
  { path: "/chi-siamo", views: 312, sessions: 94 },
  { path: "/contatti", views: 203, sessions: 77 },
  { path: "/eventi/matrimonio-di-eva-e-marco", views: 106, sessions: 41 },
];

export const SAMPLE_EVENTS: NamedRow[] = [
  { label: "page_view", value: 2410, share: 0.74 },
  { label: "session_start", value: 1004, share: 0.21 },
  { label: "contact_whatsapp_click", value: 19, share: 0.03 },
  { label: "contact_email_click", value: 11, share: 0.015 },
  { label: "contact_phone_click", value: 7, share: 0.005 },
];

export const SAMPLE_PREVIOUS_EVENTS: NamedRow[] = [
  { label: "contact_whatsapp_click", value: 14, share: 0.5 },
  { label: "contact_email_click", value: 8, share: 0.3 },
  { label: "contact_phone_click", value: 5, share: 0.2 },
];

export const SAMPLE_QUERIES: QueryRow[] = [
  { query: "gioja catering", clicks: 71, impressions: 184, ctr: 0.386, position: 1.3 },
  { query: "gioja catering siena", clicks: 28, impressions: 62, ctr: 0.451, position: 1.1 },
  { query: "catering siena", clicks: 6, impressions: 318, ctr: 0.019, position: 11.4 },
  { query: "catering matrimonio siena", clicks: 3, impressions: 241, ctr: 0.012, position: 13.8 },
  { query: "catering matrimonio toscana", clicks: 1, impressions: 173, ctr: 0.006, position: 18.2 },
  { query: "servizio catering siena", clicks: 2, impressions: 96, ctr: 0.021, position: 9.7 },
  { query: "catering aziendale siena", clicks: 0, impressions: 88, ctr: 0, position: 16.1 },
  { query: "catering eventi aziendali toscana", clicks: 0, impressions: 64, ctr: 0, position: 22.5 },
  { query: "banqueting siena", clicks: 1, impressions: 57, ctr: 0.018, position: 12.9 },
  { query: "cena di gala catering", clicks: 0, impressions: 44, ctr: 0, position: 24.1 },
  { query: "catering compleanno siena", clicks: 0, impressions: 39, ctr: 0, position: 26.7 },
  { query: "chef a domicilio siena", clicks: 0, impressions: 31, ctr: 0, position: 31.2 },
  { query: "catering val d'orcia", clicks: 0, impressions: 27, ctr: 0, position: 19.4 },
  { query: "catering matrimonio chianti", clicks: 0, impressions: 23, ctr: 0, position: 21.8 },
  { query: "matrimonio di eva e marco", clicks: 4, impressions: 18, ctr: 0.222, position: 2.1 },
  { query: "coffee break congressi siena", clicks: 0, impressions: 14, ctr: 0, position: 28.3 },
];

export const SAMPLE_SEARCH_PAGES: QueryRow[] = [
  { query: "https://giojacatering.it/", clicks: 84, impressions: 701, ctr: 0.12, position: 6.2 },
  { query: "https://giojacatering.it/servizi", clicks: 18, impressions: 402, ctr: 0.045, position: 12.8 },
  { query: "https://giojacatering.it/gallery", clicks: 9, impressions: 188, ctr: 0.048, position: 14.1 },
  { query: "https://giojacatering.it/chi-siamo", clicks: 6, impressions: 121, ctr: 0.05, position: 11.3 },
  { query: "https://giojacatering.it/contatti", clicks: 4, impressions: 73, ctr: 0.055, position: 9.4 },
];

export const SAMPLE_SEARCH_TOTALS = {
  clicks: 121,
  impressions: 1489,
  ctr: 0.081,
  position: 12.4,
};

export const SAMPLE_PREVIOUS_SEARCH_TOTALS = {
  clicks: 98,
  impressions: 1204,
  ctr: 0.081,
  position: 13.9,
};

export const SAMPLE_POST_TITLES = [
  "matrimonio di eva e marco",
  "matrimonio di carlo e federica",
  "matrimonio di anna e mirko",
  "cena di gala al castello",
];
