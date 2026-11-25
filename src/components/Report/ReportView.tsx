import { useEffect, useState } from "react";
import { REPORT } from "@/report/config";
import {
  delta,
  formatDate,
  formatDecimal,
  formatDuration,
  formatNumber,
  formatPercent,
} from "@/report/format";
import type {
  MetricPair,
  Opportunity,
  QueryRow,
  SiteReport,
  UpsellSignal,
} from "@/report/types";
import type { Role } from "@/report/auth";

const CARD = "bg-white p-5 lg:p-6";
const SECTION_TITLE = "font-serif text-lg";
const PREFIX =
  "text-xs font-semibold uppercase tracking-widest text-primary-content";
const TABLE_CELL = "border-b border-primary-content/15 py-2 pr-4 text-left";
const NUM_CELL = `${TABLE_CELL} tabular-nums lining-nums`;

function agencySourceNote(report: SiteReport): string | null {
  const raw =
    report.analyticsSource.message ?? report.searchSource.message ?? null;
  if (raw === null) return null;
  return raw.replace(/^Dati di esempio:\s*/i, "");
}

function Delta({
  pair,
  lowerIsBetter = false,
}: {
  pair: MetricPair;
  lowerIsBetter?: boolean;
}) {
  const change = delta(pair.current, pair.previous, lowerIsBetter);
  const arrow =
    change.direction === "new" ? "★" : change.ratio === null ? "→" : "";
  const sign = change.ratio === null ? "" : change.ratio > 0 ? "↑" : "↓";
  const tone =
    change.direction === "up"
      ? "text-success"
      : change.direction === "down"
        ? "text-error"
        : "text-primary-content";
  return (
    <span className={`text-sm font-semibold ${tone}`}>
      <span aria-hidden="true">{sign || arrow} </span>
      {change.label}
      <span className="sr-only">
        {change.direction === "up"
          ? " in miglioramento"
          : change.direction === "down"
            ? " in peggioramento"
            : change.direction === "new"
              ? " primo periodo con questo dato"
              : " stabile"}
      </span>
    </span>
  );
}

function Tile({
  label,
  value,
  pair,
  note,
  lowerIsBetter = false,
}: {
  label: string;
  value: string;
  pair?: MetricPair;
  note?: string;
  lowerIsBetter?: boolean;
}) {
  return (
    <div className={`${CARD} flex flex-col`}>
      <dt className={PREFIX}>{label}</dt>
      <dd className="mt-3 flex flex-1 flex-col">
        <span className="flex flex-wrap items-baseline gap-x-3">
          <span className="font-serif text-2xl leading-none tabular-nums lining-nums">
            {value}
          </span>
          {pair !== undefined && (
            <Delta pair={pair} lowerIsBetter={lowerIsBetter} />
          )}
        </span>
        {note !== undefined && (
          <span className="mt-auto pt-3 text-xs leading-relaxed">{note}</span>
        )}
      </dd>
    </div>
  );
}

function WeeklyChart({ report }: { report: SiteReport }) {
  const max = Math.max(1, ...report.trend.map((point) => point.impressions));
  return (
    <section className="mt-10" aria-labelledby="andamento">
      <h2 id="andamento" className={SECTION_TITLE}>
        Settimana per settimana
      </h2>
      <div
        className="mt-5 flex items-end gap-1 overflow-x-auto bg-white p-5"
        aria-hidden="true"
      >
        {report.trend.map((point) => (
          <span
            key={point.start}
            className="flex min-w-[1.25rem] flex-1 flex-col items-center gap-1"
          >
            <span
              className="w-full bg-accent"
              style={{
                height: `${Math.max(2, (point.impressions / max) * 140)}px`,
              }}
            />
            <span className="text-[0.625rem]">{point.label}</span>
          </span>
        ))}
      </div>
      <details className="mt-3">
        <summary className="cursor-pointer text-sm font-semibold underline underline-offset-4">
          I numeri del grafico
        </summary>
        <table className="mt-3 w-full text-sm">
          <caption className="sr-only">
            Viste su Google, clic e visite per settimana
          </caption>
          <thead>
            <tr>
              <th scope="col" className={TABLE_CELL}>
                Settimana
              </th>
              <th scope="col" className={TABLE_CELL}>
                Viste su Google
              </th>
              <th scope="col" className={TABLE_CELL}>
                Clic
              </th>
              <th scope="col" className={TABLE_CELL}>
                Visite
              </th>
            </tr>
          </thead>
          <tbody>
            {report.trend.map((point) => (
              <tr key={point.start}>
                <th scope="row" className={`${TABLE_CELL} font-normal`}>
                  {point.label}
                </th>
                <td className={NUM_CELL}>{formatNumber(point.impressions)}</td>
                <td className={NUM_CELL}>{formatNumber(point.clicks)}</td>
                <td className={NUM_CELL}>{formatNumber(point.sessions)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </section>
  );
}

function QueryTable({
  rows,
  caption,
}: {
  rows: QueryRow[];
  caption: string;
}) {
  return (
    <table className="w-full text-sm">
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr>
          <th scope="col" className={TABLE_CELL}>
            Ricerca
          </th>
          <th scope="col" className={TABLE_CELL}>
            Viste
          </th>
          <th scope="col" className={TABLE_CELL}>
            Clic
          </th>
          <th scope="col" className={TABLE_CELL}>
            Posizione
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.query}>
            <th scope="row" className={`${TABLE_CELL} font-normal`}>
              {row.query}
            </th>
            <td className={NUM_CELL}>{formatNumber(row.impressions)}</td>
            <td className={NUM_CELL}>{formatNumber(row.clicks)}</td>
            <td className={NUM_CELL}>{formatDecimal(row.position, 1)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function OpportunityList({
  items,
  title,
  intro,
  id,
}: {
  items: Opportunity[];
  title: string;
  intro: string;
  id: string;
}) {
  if (items.length === 0) return null;
  const shown = items.slice(0, 6);
  const rest = items.length - shown.length;
  return (
    <section className="mt-14" aria-labelledby={id}>
      <h2 id={id} className={SECTION_TITLE}>
        {title}
      </h2>
      <p className="mt-3 max-w-prose text-sm leading-relaxed">{intro}</p>
      <ul className="mt-6 bg-white px-5 lg:px-6">
        {shown.map((item) => (
          <li
            key={item.query}
            className="border-b border-primary-content/15 py-5 last:border-b-0"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <p className="font-semibold">{item.query}</p>
              <p className="text-sm tabular-nums lining-nums">
                {formatNumber(item.impressions)} viste ·{" "}
                {formatNumber(item.clicks)} clic · posizione{" "}
                {formatDecimal(item.position, 1)}
              </p>
            </div>
          </li>
        ))}
      </ul>
      {rest > 0 && (
        <p className="mt-3 text-xs lining-nums">
          Altre {formatNumber(rest)} ricerche nella stessa condizione: le trovate
          in fondo, nella tabella di tutte le ricerche.
        </p>
      )}
    </section>
  );
}

function EstimateButton({
  signal,
  weeks,
  periodsBack,
}: {
  signal: UpsellSignal;
  weeks: number;
  periodsBack: number;
}) {
  const [state, setState] = useState<
    "idle" | "sending" | "sent" | "fallback" | "failed"
  >("idle");
  const [mailto, setMailto] = useState<string | null>(null);

  async function send() {
    setState("sending");
    try {
      const response = await fetch(
        `/api/report/estimate?settimane=${weeks}&indietro=${periodsBack}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: signal.id }),
        }
      );
      if (!response.ok) throw new Error("richiesta rifiutata");
      const payload: unknown = await response.json();
      const accessKey: unknown = Reflect.get(payload as object, "accessKey");
      const subject: unknown = Reflect.get(payload as object, "subject");
      const message: unknown = Reflect.get(payload as object, "message");
      const fallbackHref: unknown = Reflect.get(payload as object, "mailto");
      if (typeof fallbackHref === "string") setMailto(fallbackHref);

      if (
        typeof accessKey !== "string" ||
        typeof subject !== "string" ||
        typeof message !== "string"
      ) {
        setState("fallback");
        return;
      }

      const body = new FormData();
      body.append("access_key", accessKey);
      body.append("subject", subject);
      body.append("message", message);
      body.append("from_name", REPORT.siteName);

      const sent = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body,
      });
      setState(sent.ok ? "sent" : "fallback");
    } catch {
      setState("failed");
    }
  }

  if (state === "sent") {
    return (
      <p role="status" className="mt-5 text-sm font-semibold text-success">
        Richiesta inviata a {REPORT.agencyEmail}. Ti rispondo io.
      </p>
    );
  }

  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={send}
        disabled={state === "sending"}
        className="min-h-[44px] bg-accent px-5 text-sm font-semibold uppercase tracking-widest text-accent-content transition-colors hover:bg-primary-content focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary-content disabled:cursor-wait"
      >
        {state === "sending" ? "Invio in corso…" : "Chiedimi una stima"}
      </button>
      {(state === "fallback" || state === "failed") && (
        <p role="alert" className="mt-3 text-sm leading-relaxed">
          {state === "failed"
            ? "Non sono riuscito a inviare la richiesta da qui."
            : "L'invio automatico non è configurato su questo sito."}{" "}
          Scrivimi a{" "}
          <a
            href={mailto ?? `mailto:${REPORT.agencyEmail}`}
            className="font-semibold underline underline-offset-4"
          >
            {REPORT.agencyEmail}
          </a>
          , il testo è già pronto nel messaggio.
        </p>
      )}
    </div>
  );
}

function UpsellCard({
  signal,
  role,
  weeks,
  periodsBack,
}: {
  signal: UpsellSignal;
  role: Role;
  weeks: number;
  periodsBack: number;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <li id={`tema-${signal.id}`} className={`${CARD} scroll-mt-8`}>
      <h3 className={PREFIX}>{signal.service}</h3>
      <p className="mt-2 text-sm tabular-nums lining-nums">
        {formatNumber(signal.impressions)} viste e{" "}
        {formatNumber(signal.clicks)} clic su questo tema, posizione media{" "}
        {formatDecimal(signal.position, 1)}
      </p>
      <p className="mt-3 max-w-prose text-sm leading-relaxed">{signal.pitch}</p>

      <h4 className="mt-5 text-sm font-semibold">Cosa propongo</h4>
      <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 text-sm leading-relaxed">
        {signal.solution.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ul>

      <h4 className="mt-4 text-sm font-semibold">Cosa serve da voi</h4>
      <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 text-sm leading-relaxed">
        {signal.needed.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ul>

      <h4 className="mt-4 text-sm font-semibold">
        Come capiamo se ha funzionato
      </h4>
      <p className="mt-2 max-w-prose text-sm leading-relaxed">{signal.goal}</p>

      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-semibold underline underline-offset-4">
          Le ricerche dietro questo tema
        </summary>
        <div className="mt-3">
          <QueryTable
            rows={signal.queries}
            caption={`Ricerche che alimentano il tema ${signal.service}`}
          />
        </div>
      </details>

      <EstimateButton
        signal={signal}
        weeks={weeks}
        periodsBack={periodsBack}
      />

      {role === "agency" && signal.prompt !== "" && (
        <details className="mt-6 border-t border-primary-content/20 pt-4">
          <summary className="cursor-pointer text-sm font-semibold underline underline-offset-4">
            Prompt da lanciare nel repository
          </summary>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard
                .writeText(signal.prompt)
                .then(() => setCopied(true))
                .catch(() => setCopied(false));
            }}
            className="mt-3 min-h-[44px] border border-primary-content px-4 text-sm font-semibold focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {copied ? "Copiato" : "Copia il prompt"}
          </button>
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap bg-secondary p-4 text-xs leading-relaxed">
            {signal.prompt}
          </pre>
        </details>
      )}
    </li>
  );
}

export default function ReportView({
  report,
  role,
  weeks,
  periodsBack,
  onWindowChange,
}: {
  report: SiteReport;
  role: Role;
  weeks: number;
  periodsBack: number;
  onWindowChange: (weeks: number, periodsBack: number) => void;
}) {
  const demo =
    report.analyticsSource.status !== "live" ||
    report.searchSource.status !== "live";

  const comparableTraffic = (pair: MetricPair): MetricPair | undefined =>
    report.traffic.comparable ? pair : undefined;

  useEffect(() => {
    const anchor = window.location.hash.slice(1);
    if (anchor === "") return;
    document.getElementById(anchor)?.scrollIntoView({ block: "start" });
  }, []);

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10 lg:py-16 3xl:max-w-[88rem]">
      <header className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="font-serif text-xl">
            {REPORT.siteName}, andamento del sito
          </h1>
          <p className="mt-2 text-sm tabular-nums lining-nums">
            {report.period.label} · {report.period.weeks} settimane complete
          </p>
        </div>
        <form method="post" action="/api/report/logout">
          <button
            type="submit"
            className="min-h-[44px] border border-primary-content px-4 text-sm font-semibold focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Esci
          </button>
        </form>
      </header>

      <nav aria-label="Periodo" className="mt-6 flex flex-wrap items-center gap-2">
        {REPORT.windowChoices.map((choice) => (
          <button
            key={choice}
            type="button"
            onClick={() => onWindowChange(choice, 0)}
            aria-current={choice === weeks ? "true" : undefined}
            className={`min-h-[44px] px-4 text-sm font-semibold focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-accent ${
              choice === weeks
                ? "bg-primary-content text-primary"
                : "border border-primary-content"
            }`}
          >
            {choice} settimane
          </button>
        ))}
        <button
          type="button"
          onClick={() => onWindowChange(weeks, periodsBack + 1)}
          className="min-h-[44px] border border-primary-content px-4 text-sm font-semibold focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Periodo precedente
        </button>
        {periodsBack > 0 && (
          <button
            type="button"
            onClick={() => onWindowChange(weeks, 0)}
            className="min-h-[44px] border border-primary-content px-4 text-sm font-semibold focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Torna all&apos;ultimo periodo
          </button>
        )}
      </nav>

      {demo && (
        <p
          role="status"
          className="mt-6 border border-primary-content bg-white px-4 py-3 text-sm leading-relaxed"
        >
          <strong className="font-semibold">Dati di esempio.</strong>{" "}
          {role === "agency"
            ? (agencySourceNote(report) ??
              "Il collegamento con Google non è ancora attivo.")
            : "Il collegamento con Google non è ancora attivo, quindi questi numeri non sono i vostri."}
        </p>
      )}

      <p className="mt-8 max-w-prose font-serif text-md leading-snug lining-nums">
        {report.headline}
      </p>

      <dl className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {report.leads.tracked && (
          <Tile
            label="Richieste di contatto"
            value={formatNumber(report.leads.total.current)}
            pair={comparableTraffic(report.leads.total)}
            note="Clic su email, telefono e WhatsApp, più i form inviati."
          />
        )}
        <Tile
          label="Visite"
          value={formatNumber(report.traffic.sessions.current)}
          pair={comparableTraffic(report.traffic.sessions)}
        />
        <Tile
          label="Viste su Google"
          value={formatNumber(report.search.impressions.current)}
          pair={report.search.impressions}
        />
        <Tile
          label="Clic da Google"
          value={formatNumber(report.search.clicks.current)}
          pair={report.search.clicks}
        />
        <Tile
          label="Posizione media"
          value={formatDecimal(report.search.position.current, 1)}
          pair={report.search.position}
          lowerIsBetter
          note="Più basso è meglio: 1 vuol dire primo risultato."
        />
        <Tile
          label="Pagine viste"
          value={formatNumber(report.traffic.pageViews.current)}
          pair={comparableTraffic(report.traffic.pageViews)}
        />
        <Tile
          label="Tempo medio sul sito"
          value={formatDuration(report.traffic.averageSessionSeconds.current)}
          pair={comparableTraffic(report.traffic.averageSessionSeconds)}
        />
        <Tile
          label="Clic sul vostro nome"
          value={formatNumber(report.search.brandedClicks)}
          note={`Gli altri ${formatNumber(
            report.search.nonBrandedClicks
          )} clic arrivano da chi non vi cercava per nome.`}
        />
      </dl>

      {!report.traffic.comparable && report.traffic.measurementStart !== null && (
        <p className="mt-3 max-w-prose text-xs leading-relaxed">
          Le visite sono misurate da Google Analytics a partire dal{" "}
          {formatDate(report.traffic.measurementStart)}: prima di quella data
          non esistono numeri, quindi le visite, le pagine viste e il tempo sul
          sito non hanno ancora un periodo precedente da confrontare. Le viste e
          i clic su Google vengono invece da Search Console e si confrontano
          appena c&apos;è un periodo intero alle spalle.
        </p>
      )}

      {!report.leads.tracked && (
        <section className="mt-10" aria-labelledby="contatti-non-tracciati">
          <h2 id="contatti-non-tracciati" className={SECTION_TITLE}>
            Le richieste di contatto non sono ancora misurate
          </h2>
          <p className="mt-2 max-w-prose text-sm leading-relaxed">
            Google Analytics non conta da solo i clic su email, telefono e
            WhatsApp: senza un aggancio apposta quel numero resterebbe zero
            anche con dieci richieste al giorno. L&apos;aggancio è stato appena
            messo, quindi qui comparirà un numero vero dalle prossime
            settimane.
          </p>
        </section>
      )}

      <WeeklyChart report={report} />

      {report.demandGap !== null && (
        <section className="mt-10" aria-labelledby="domanda">
          <h2 id="domanda" className={SECTION_TITLE}>
            La domanda che non state intercettando
          </h2>
          <p className="mt-2 max-w-prose text-sm leading-relaxed lining-nums">
            Sommando tutte le ricerche di chi cerca un catering senza conoscervi:{" "}
            {formatNumber(report.demandGap.impressions)} viste e{" "}
            {formatNumber(report.demandGap.clicks)} clic, posizione media{" "}
            {formatDecimal(report.demandGap.position, 1)}.
          </p>
          <div className="mt-5 bg-white p-5">
            <QueryTable
              rows={report.demandGap.queries}
              caption="Ricerche generiche di catering"
            />
          </div>
        </section>
      )}

      {report.upsell.length > 0 && (
        <section className="mt-12" aria-labelledby="proposte">
          <h2 id="proposte" className={SECTION_TITLE}>
            Cosa conviene fare adesso
          </h2>
          <p className="mt-2 max-w-prose text-sm leading-relaxed">
            Ogni tema qui sotto nasce da ricerche vere di questo periodo. Per
            ciascuno trovate cosa propongo, cosa serve da voi e come si capisce
            se ha funzionato.
          </p>
          <ul className="mt-5 flex flex-col gap-4">
            {report.upsell.map((signal) => (
              <UpsellCard
                key={signal.id}
                signal={signal}
                role={role}
                weeks={weeks}
                periodsBack={periodsBack}
              />
            ))}
          </ul>
        </section>
      )}

      <OpportunityList
        id="a-un-passo"
        items={report.opportunities}
        title="Dove siete a un passo"
        intro="Ricerche in cui Google vi mostra già ma troppo in basso perché qualcuno clicchi. Sono le più economiche da recuperare: si rinforza la pagina che già si posiziona, con un titolo più vicino alla ricerca e un paragrafo che risponda esattamente a quella domanda."
      />

      <OpportunityList
        id="oltre-seconda-pagina"
        items={report.invisible}
        title="Oltre la seconda pagina"
        intro="Google vi considera pertinenti ma nessuno vi vede. Qui serve contenuto nuovo, non una limatura: una pagina che tratti solo quell'argomento."
      />

      {report.portfolioOpportunities.length > 0 && (
        <section className="mt-10" aria-labelledby="nomi-propri">
          <h2 id="nomi-propri" className={SECTION_TITLE}>
            Ricerche sui vostri eventi
          </h2>
          <p className="mt-2 max-w-prose text-sm leading-relaxed">
            Chi cerca il nome di un evento che avete fatto: porta visite alle
            schede, non lavoro nuovo. Sono tenute a parte per non falsare le
            opportunità qui sopra.
          </p>
          <div className="mt-5 bg-white p-5">
            <QueryTable
              rows={report.portfolioOpportunities.map((item) => ({
                query: item.query,
                clicks: item.clicks,
                impressions: item.impressions,
                ctr: item.ctr,
                position: item.position,
              }))}
              caption="Ricerche sui nomi dei vostri eventi"
            />
          </div>
        </section>
      )}

      <section className="mt-12 grid gap-4 lg:grid-cols-2" aria-labelledby="provenienza">
        <h2 id="provenienza" className="sr-only">
          Da dove arrivano le visite
        </h2>
        <div className={CARD}>
          <h3 className={PREFIX}>Da dove arrivano</h3>
          <table className="mt-3 w-full text-sm">
            <caption className="sr-only">Visite per canale</caption>
            <thead>
              <tr>
                <th scope="col" className={TABLE_CELL}>
                  Canale
                </th>
                <th scope="col" className={TABLE_CELL}>
                  Visite
                </th>
                <th scope="col" className={TABLE_CELL}>
                  Quota
                </th>
              </tr>
            </thead>
            <tbody>
              {report.traffic.channels.map((row) => (
                <tr key={row.label}>
                  <th scope="row" className={`${TABLE_CELL} font-normal`}>
                    {row.label}
                  </th>
                  <td className={NUM_CELL}>{formatNumber(row.value)}</td>
                  <td className={NUM_CELL}>{formatPercent(row.share, 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={CARD}>
          <h3 className={PREFIX}>Assistenti AI</h3>
          <p className="mt-2 text-sm leading-relaxed">
            Quante visite arrivano da ChatGPT e simili. Sono numeri piccoli per
            tutti: conta se crescono di mese in mese, non quanti sono oggi.
          </p>
          <table className="mt-3 w-full text-sm">
            <caption className="sr-only">Visite per assistente AI</caption>
            <thead>
              <tr>
                <th scope="col" className={TABLE_CELL}>
                  Assistente
                </th>
                <th scope="col" className={TABLE_CELL}>
                  Visite
                </th>
              </tr>
            </thead>
            <tbody>
              {report.traffic.assistants.map((row) => (
                <tr key={row.label}>
                  <th scope="row" className={`${TABLE_CELL} font-normal`}>
                    {row.label}
                  </th>
                  <td className={NUM_CELL}>{formatNumber(row.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="pagine">
        <h2 id="pagine" className={SECTION_TITLE}>
          Le pagine più viste
        </h2>
        <div className="mt-5 bg-white p-5">
          <table className="w-full text-sm">
            <caption className="sr-only">Pagine più viste del sito</caption>
            <thead>
              <tr>
                <th scope="col" className={TABLE_CELL}>
                  Pagina
                </th>
                <th scope="col" className={TABLE_CELL}>
                  Visualizzazioni
                </th>
                <th scope="col" className={TABLE_CELL}>
                  Visite
                </th>
              </tr>
            </thead>
            <tbody>
              {report.traffic.topPages.map((row) => (
                <tr key={row.path}>
                  <th scope="row" className={`${TABLE_CELL} font-normal`}>
                    {row.path}
                  </th>
                  <td className={NUM_CELL}>{formatNumber(row.views)}</td>
                  <td className={NUM_CELL}>{formatNumber(row.sessions)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="ricerche">
        <h2 id="ricerche" className={SECTION_TITLE}>
          Tutte le ricerche
        </h2>
        <div className="mt-5 overflow-x-auto bg-white p-5">
          <QueryTable
            rows={report.search.topQueries}
            caption="Ricerche con cui il sito è comparso su Google"
          />
        </div>
        <p className="mt-3 max-w-prose text-xs leading-relaxed lining-nums">
          La somma di questa tabella è sempre minore dei totali in cima: Google
          nasconde le ricerche fatte da poche persone per non renderle
          identificabili. Qui sono visibili{" "}
          {formatNumber(report.search.visibleImpressions)} viste su{" "}
          {formatNumber(report.search.impressions.current)}.
        </p>
      </section>

      {report.support !== null && (
        <section className="mt-10" aria-labelledby="ore">
          <h2 id="ore" className={SECTION_TITLE}>
            Ore di assistenza
          </h2>
          <p className="mt-2 text-sm lining-nums">
            {formatDecimal(report.support.remainingHours, 1)} ore residue su{" "}
            {formatDecimal(report.support.totalHours, 1)}, pacchetto aperto il{" "}
            {formatDate(report.support.startedOn)}.
          </p>
        </section>
      )}

      <footer className="mt-14 border-t border-primary-content/20 pt-6 text-xs leading-relaxed">
        <p>
          I dati arrivano da Google Analytics e Google Search Console e si
          fermano all&apos;ultima settimana conclusa: non è tempo reale. Search
          Console consolida con due o tre giorni di ritardo
          {report.search.freshUntil !== null
            ? `, qui l'ultimo giorno disponibile è il ${formatDate(
                report.search.freshUntil
              )}`
            : ""}
          .
        </p>
        <p className="mt-2">
          Google non dice con quale ricerca è arrivata la singola visita: le due
          tabelle delle ricerche e delle pagine vanno lette affiancate, non
          incrociate.
        </p>
      </footer>
    </main>
  );
}
