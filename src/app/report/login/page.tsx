import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { REPORT } from "@/report/config";
import {
  SESSION_COOKIE,
  missingCredentialVars,
  readSession,
} from "@/report/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  credenziali: "Nome utente o password non corretti.",
  "troppi-tentativi":
    "Troppi tentativi ravvicinati. Riprova fra qualche minuto.",
  configurazione:
    "L'accesso non è ancora configurato su questo sito. Scrivimi e lo attivo.",
};

const FIELD_CLASS =
  "min-h-[44px] border border-primary-content/40 bg-white px-3 text-base focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-accent";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { errore?: string };
}) {
  const session = await readSession(cookies().get(SESSION_COOKIE)?.value);
  if (session !== null) redirect("/report");

  const errorKey = searchParams.errore ?? "";
  const error = ERRORS[errorKey] ?? null;
  const missing = missingCredentialVars();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-16">
      <h1 className="font-serif text-xl">Andamento del sito</h1>
      <p className="mt-3 text-sm leading-relaxed">
        I numeri di {REPORT.siteName} presi da Google. Pagina privata: serve
        l&apos;accesso che ti ho mandato.
      </p>

      {error !== null && (
        <p
          role="alert"
          className="mt-6 border-l-4 border-error bg-white px-4 py-3 text-sm"
        >
          {error}
        </p>
      )}

      {errorKey === "configurazione" && missing.length > 0 && (
        <p className="mt-3 text-xs">Variabili mancanti: {missing.join(", ")}.</p>
      )}

      <form
        method="post"
        action="/api/report/login"
        className="mt-8 flex flex-col gap-5"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="utente" className="text-sm font-semibold">
            Nome utente
          </label>
          <input
            id="utente"
            name="utente"
            type="text"
            autoComplete="username"
            required
            className={FIELD_CLASS}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-semibold">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className={FIELD_CLASS}
          />
        </div>
        <button
          type="submit"
          className="min-h-[44px] bg-accent px-6 text-sm font-semibold uppercase tracking-widest text-accent-content transition-colors hover:bg-primary-content focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary-content"
        >
          Entra
        </button>
      </form>
    </main>
  );
}
