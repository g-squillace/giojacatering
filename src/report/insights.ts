import { formatDecimal, formatNumber } from "./format.ts";
import { BRAND_TERMS } from "./config.ts";
import type {
  DemandGap,
  Opportunity,
  QueryRow,
  UpsellSignal,
} from "./types.ts";

const CTR_BY_POSITION = [
  0.27, 0.15, 0.11, 0.08, 0.06, 0.05, 0.04, 0.033, 0.028, 0.025,
];

interface ServiceSignal {
  id: string;
  service: string;
  terms: string[];
  pitch: string;
  solution: string[];
  needed: string[];
  goal: string;
}

export const SERVICE_SIGNALS: ServiceSignal[] = [
  {
    id: "catering-zona",
    service: "Chi cerca un catering in zona",
    terms: [
      "catering siena",
      "catering a siena",
      "catering toscana",
      "catering in toscana",
      "servizio catering",
      "servizi di catering",
      "societa di catering",
      "ditta catering",
      "catering vicino",
      "migliori catering",
    ],
    pitch:
      "È la ricerca di chi deve scegliere un catering e non ha ancora un nome in mente: il bacino più grande e il più contendibile. Oggi risponde la pagina Servizi, che mette matrimoni, aziendale e feste private tutti insieme, quindi non risponde bene a nessuna delle tre.",
    solution: [
      "Una pagina per ciascun servizio, invece di una sola che li elenca tutti: chi cerca «catering matrimonio» deve trovare una pagina che parli solo di quello.",
      "Gli eventi già realizzati collegati a quelle pagine, così la gallery smette di essere un album e diventa la prova del servizio.",
      "La scheda Google dell'attività completa e agganciata al sito: sulle ricerche che contengono «Siena» pesa quanto il sito stesso.",
    ],
    needed: [
      "Mezz'ora di chiacchierata registrata su come lavorate e quali eventi volete fare di più.",
      "Per gli eventi che useremo come prova: location, numero di invitati, anno, e il via libera a nominarli.",
    ],
    goal: "la prima pagina su «catering Siena» e simili. È il punto da riguardare fra tre mesi: se la posizione media non si muove, il contenuto non ha funzionato e si cambia strada.",
  },
  {
    id: "matrimoni",
    service: "Matrimoni",
    terms: [
      "matrimonio",
      "matrimoni",
      "wedding",
      "nozze",
      "sposi",
      "ricevimento",
      "banchetto nuziale",
    ],
    pitch:
      "Chi cerca così ha una data e un budget: è la richiesta con il valore più alto e la decisione più lenta, quindi chi si fa trovare presto entra nella rosa delle tre quotazioni.",
    solution: [
      "Una pagina dedicata ai matrimoni che risponda alle domande vere: quanti invitati gestite, come si svolge una degustazione, quanto prima bisogna prenotare.",
      "I tre matrimoni già pubblicati come casi studio collegati a quella pagina, con location e numero di invitati.",
      "Le pagine territoriali delle location più richieste, dalla Val d'Orcia al Chianti: chi sposa in una villa cerca il catering per quella villa.",
    ],
    needed: [
      "Il via libera degli sposi a usare nome, location e foto degli eventi già fatti.",
      "I numeri che potete dichiarare: invitati minimi e massimi, quanto prima si prenota.",
    ],
    goal: "comparire in prima pagina su «catering matrimonio Siena» e sulle ricerche con il nome delle location. Oggi su questo tema il sito ha contenuto ma nessuna pagina di servizio.",
  },
  {
    id: "aziendale",
    service: "Eventi aziendali, congressi e meeting",
    terms: [
      "aziendale",
      "aziendali",
      "congressi",
      "congresso",
      "meeting",
      "convention",
      "coffee break",
      "business lunch",
      "catering ufficio",
      "inaugurazione",
    ],
    pitch:
      "È il cliente che torna: chi organizza un congresso lo rifà ogni anno. La pagina Servizi lo nomina già, ma in mezzo a tutto il resto, quindi Google non capisce che è un servizio a sé.",
    solution: [
      "Una pagina sul catering aziendale con i formati reali: coffee break, light lunch, cena di gala, e cosa cambia fra loro.",
      "L'elenco di enti e aziende che vi hanno già scelto, che oggi è un logo senza contesto.",
      "Un modo per chiedere un preventivo che non sia solo il form generico: su questo pubblico serve un riferimento diretto.",
    ],
    needed: [
      "Quali clienti aziendali possiamo nominare per nome.",
      "I formati e le fasce di invitati che volete dichiarare.",
    ],
    goal: "intercettare chi cerca un fornitore per il congresso dell'anno prossimo, oggi completamente scoperto.",
  },
  {
    id: "eventi-privati",
    service: "Feste private e chef a domicilio",
    terms: [
      "festa privata",
      "feste private",
      "compleanno",
      "anniversario",
      "battesimo",
      "comunione",
      "laurea",
      "chef a domicilio",
      "cena a domicilio",
      "catering a casa",
      "catering domicilio",
    ],
    pitch:
      "È la richiesta più piccola ma la più frequente, e la più facile da chiudere: chi organizza una festa a casa decide in pochi giorni.",
    solution: [
      "Una pagina sulle feste private con le soglie: da quanti invitati partite, cosa portate, cosa serve avere in casa.",
      "Se il servizio chef a domicilio esiste, una pagina sua: è una ricerca distinta e oggi non la intercetta nessuna pagina.",
    ],
    needed: [
      "Conferma su cosa accettate davvero: numero minimo di invitati, raggio di spostamento.",
    ],
    goal: "farsi trovare da chi cerca un catering per casa, dove oggi il sito non compare affatto.",
  },
  {
    id: "banqueting",
    service: "Banqueting e cene di gala",
    terms: [
      "banqueting",
      "cena di gala",
      "cene di gala",
      "buffet",
      "rinfresco",
      "aperitivo per",
      "catering gala",
    ],
    pitch:
      "È il servizio con il margine migliore e la concorrenza più bassa, perché in pochi lo nominano con le parole che usano i clienti.",
    solution: [
      "Una pagina che parta dal formato («cena di gala», «buffet in piedi») e non dalla parola banqueting, che la usate voi e non chi cerca.",
      "La cena di gala già pubblicata come caso studio collegato a quella pagina.",
    ],
    needed: [
      "Le location in cui avete già lavorato e che possiamo nominare.",
    ],
    goal: "presidiare un tema dove la concorrenza locale è quasi assente.",
  },
];

function normalise(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const GENERIC_TERMS = [
  "siena",
  "firenze",
  "toscana",
  "italia",
  "chianti",
  "radda",
  "montalcino",
  "gimignano",
  "orcia",
  "valdorcia",
  "montepulciano",
  "pienza",
  "arezzo",
  "grosseto",
  "catering",
  "banqueting",
  "ristorante",
  "ristorazione",
  "cucina",
  "chef",
  "menu",
  "buffet",
  "rinfresco",
  "aperitivo",
  "cena",
  "pranzo",
  "gala",
  "evento",
  "eventi",
  "matrimonio",
  "matrimoni",
  "nozze",
  "sposi",
  "ricevimento",
  "festa",
  "feste",
  "congresso",
  "congressi",
  "meeting",
  "azienda",
  "aziendale",
  "aziendali",
  "privato",
  "privati",
  "allestimento",
  "allestimenti",
  "location",
  "villa",
  "castello",
  "relais",
  "agriturismo",
  "hotel",
  "online",
  "prezzi",
  "preventivo",
  "della",
  "delle",
  "dello",
  "degli",
  "nel",
  "nella",
  "con",
  "per",
  "che",
  "del",
  "dei",
  "una",
  "uno",
  "gli",
  "gioja",
  "gioia",
];

function serviceVocabulary(): Set<string> {
  const words = new Set<string>();
  for (const signal of SERVICE_SIGNALS) {
    for (const term of signal.terms) {
      for (const word of normalise(term).split(" ")) {
        if (word.length > 2) words.add(word);
      }
    }
  }
  for (const term of GENERIC_TERMS) words.add(term);
  return words;
}

export function portfolioMatcher(titles: string[]): (query: string) => boolean {
  const vocabulary = serviceVocabulary();
  const phrases = new Set<string>();
  for (const title of titles) {
    const tokens = normalise(title)
      .split(" ")
      .filter((token) => token.length > 2);
    for (let index = 0; index + 1 < tokens.length; index += 1) {
      const left = tokens[index];
      const right = tokens[index + 1];
      if (vocabulary.has(left) && vocabulary.has(right)) continue;
      phrases.add(`${left} ${right}`);
    }
    for (const token of tokens) {
      if (token.length >= 5 && !vocabulary.has(token)) phrases.add(token);
    }
  }
  const needles = Array.from(phrases);
  return (query: string) => {
    const haystack = normalise(query);
    return needles.some(
      (phrase) => haystack === phrase || haystack.includes(phrase)
    );
  };
}

function expectedCtr(position: number): number {
  const index = Math.max(0, Math.round(position) - 1);
  if (index < CTR_BY_POSITION.length) return CTR_BY_POSITION[index];
  if (position <= 20) return 0.012;
  return 0.004;
}

export function isBranded(query: string): boolean {
  const normalised = normalise(query);
  return BRAND_TERMS.some((term) => normalised.includes(normalise(term)));
}

export function strikingDistance(
  queries: QueryRow[],
  accept: (query: string) => boolean = () => true
): Opportunity[] {
  return queries
    .filter(
      (row) =>
        !isBranded(row.query) &&
        accept(row.query) &&
        row.position > 3.5 &&
        row.position <= 20 &&
        row.impressions >= 5
    )
    .map((row) => {
      const target = Math.max(3, Math.floor(row.position) - 3);
      const potential = Math.max(
        0,
        row.impressions * (expectedCtr(target) - row.ctr)
      );
      return {
        query: row.query,
        impressions: row.impressions,
        clicks: row.clicks,
        position: row.position,
        ctr: row.ctr,
        potentialClicks: potential,
        reason: `Siete in posizione ${row.position.toFixed(
          1
        )}: Google vi mostra già, ma quasi nessuno arriva così in basso.`,
        action:
          row.position <= 10
            ? "Siete in prima pagina. Si rinforza la pagina che si posiziona: titolo più vicino a questa ricerca, un paragrafo che risponda esattamente alla domanda."
            : "Siete in seconda pagina. Serve contenuto dedicato: una sezione o una pagina che tratti solo questo argomento.",
      };
    })
    .sort((left, right) => right.potentialClicks - left.potentialClicks)
    .slice(0, 12);
}

export function invisibleQueries(
  queries: QueryRow[],
  accept: (query: string) => boolean = () => true
): Opportunity[] {
  return queries
    .filter(
      (row) =>
        !isBranded(row.query) &&
        accept(row.query) &&
        row.position > 20 &&
        row.impressions >= 3
    )
    .map((row) => ({
      query: row.query,
      impressions: row.impressions,
      clicks: row.clicks,
      position: row.position,
      ctr: row.ctr,
      potentialClicks: row.impressions * expectedCtr(5),
      reason: `Google vi considera pertinenti (posizione ${row.position.toFixed(
        0
      )}), ma nessuno vi vede.`,
      action:
        "Qui non c'è ancora contenuto vero. Se è un servizio che volete vendere, serve una pagina dedicata.",
    }))
    .sort((left, right) => right.impressions - left.impressions)
    .slice(0, 12);
}

function buildUpsellPrompt(
  service: string,
  periodLabel: string,
  matched: QueryRow[]
): string {
  const lines = matched.map(
    (row) =>
      `- "${row.query}" — ${formatNumber(
        row.impressions
      )} viste, ${formatNumber(
        row.clicks
      )} clic, posizione media ${formatDecimal(row.position, 1)}`
  );
  return [
    `Sul sito di GioJa Catering c'è domanda di ricerca su "${service}" che oggi non stiamo intercettando bene.`,
    "",
    `Dati reali del periodo ${periodLabel}, da Google Search Console:`,
    ...lines,
    "",
    "Cosa voglio da te, in quest'ordine:",
    "1. Trova nel repository e su DatoCMS le pagine che oggi parlano di questo tema e dimmi cosa manca rispetto a quello che la gente sta cercando.",
    "2. Decidi se conviene rinforzare una pagina esistente o crearne una dedicata, e motiva la scelta.",
    "3. Proponi title, meta description e struttura dei contenuti usando le parole esatte delle ricerche qui sopra, senza forzarle.",
    "4. Elenca i link interni da aggiungere dalle pagine più visitate del sito.",
    "",
    "Fermati prima di scrivere codice: voglio approvare l'impostazione.",
  ].join("\n");
}

export function upsellSignals(
  queries: QueryRow[],
  periodLabel: string,
  accept: (query: string) => boolean = () => true
): UpsellSignal[] {
  const signals: UpsellSignal[] = [];
  for (const signal of SERVICE_SIGNALS) {
    const matched = queries.filter((row) => {
      if (!accept(row.query)) return false;
      const padded = ` ${row.query.toLowerCase()} `;
      return signal.terms.some((term) => padded.includes(term));
    });
    if (matched.length === 0) continue;
    const impressions = matched.reduce((sum, row) => sum + row.impressions, 0);
    const clicks = matched.reduce((sum, row) => sum + row.clicks, 0);
    if (impressions < 3) continue;
    const top = [...matched]
      .sort((left, right) => right.impressions - left.impressions)
      .slice(0, 5);
    const weighted = matched.reduce(
      (sum, row) => sum + row.position * row.impressions,
      0
    );
    signals.push({
      id: signal.id,
      service: signal.service,
      impressions,
      clicks,
      position: impressions > 0 ? weighted / impressions : 0,
      queries: top,
      pitch: signal.pitch,
      solution: signal.solution,
      needed: signal.needed,
      goal: signal.goal,
      prompt: buildUpsellPrompt(signal.service, periodLabel, top),
    });
  }
  return signals.sort((left, right) => right.impressions - left.impressions);
}

export function demandGap(
  queries: QueryRow[],
  accept: (query: string) => boolean,
  topic: string
): DemandGap | null {
  const rows = queries.filter(
    (row) => !isBranded(row.query) && accept(row.query)
  );
  if (rows.length === 0) return null;
  const impressions = rows.reduce((sum, row) => sum + row.impressions, 0);
  if (impressions === 0) return null;
  const clicks = rows.reduce((sum, row) => sum + row.clicks, 0);
  const weighted = rows.reduce(
    (sum, row) => sum + row.position * row.impressions,
    0
  );
  return {
    impressions,
    clicks,
    position: weighted / impressions,
    topic,
    queries: [...rows]
      .sort((left, right) => right.impressions - left.impressions)
      .slice(0, 6),
  };
}

export function buildHeadline(
  gap: DemandGap | null,
  leads: number,
  leadsTracked: boolean
): string {
  if (gap !== null && gap.impressions >= 40) {
    const shown = formatNumber(gap.impressions);
    const entered =
      gap.clicks === 0
        ? "Non è entrato nessuno."
        : gap.clicks === 1
          ? "È entrata una persona sola."
          : `Sono entrate in ${formatNumber(gap.clicks)}.`;
    return `Google vi ha mostrato ${shown} volte a chi cercava un catering senza conoscervi. ${entered} È qui che si gioca la partita, non nel numero delle visite.`;
  }
  if (leads > 0) {
    return `${formatNumber(leads)} ${
      leads === 1 ? "persona ha" : "persone hanno"
    } provato a contattarvi in questo periodo.`;
  }
  if (!leadsTracked) {
    return "Troppo poco volume da Google per leggerci una direzione in questo periodo.";
  }
  return "Nessun contatto in questo periodo, e nessuna ricerca abbastanza forte da indicare una direzione.";
}
