import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ChargementCompte } from "@/components/compte/Cadre";
import { BoutonSupprimerCompte, FormulaireReservation } from "@/components/compte/Formulaires";
import { Container } from "@/components/ui/primitives";
import { compteConnecte, reservationsDuCompte, STATUTS, type Statut } from "@/lib/comptes";
import { getContenu } from "@/lib/contenu";
import { annulerMaReservation, deconnexionClient } from "./actions";

export const metadata: Metadata = {
  title: "Mon espace",
  robots: { index: false, follow: false },
};

const COULEURS: Record<Statut, string> = {
  "en-attente": "bg-amber-500/15 text-amber-800 dark:text-amber-300",
  confirmee: "bg-green-600/15 text-green-800 dark:text-green-300",
  annulee: "bg-red-600/10 text-red-800 dark:text-red-300",
};

const formaterDate = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString("fr-FR", { dateStyle: "long" });

async function Espace({ searchParams }: { searchParams: PageProps<"/mon-espace">["searchParams"] }) {
  const { formule } = await searchParams;
  const choix = typeof formule === "string" ? formule : undefined;
  const compte = await compteConnecte();
  if (!compte) redirect(choix ? `/connexion?formule=${encodeURIComponent(choix)}` : "/connexion");

  const [reservations, { photographie }] = await Promise.all([reservationsDuCompte(compte.id), getContenu()]);
  const prestations = [...photographie.forfaits.liste.map((f) => `Photographie — ${f.nom}`), "Développement web", "Graphisme", "Autre demande"];
  const initiale = prestations.find((p) => p === choix || p === `Photographie — ${choix}`);

  return (
    <Container className="max-w-5xl pt-24 pb-16 lg:pt-36 lg:pb-24">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted">Mon espace</p>
          <h1 className="font-heading text-4xl font-bold">Bonjour {compte.nom.split(" ")[0]}</h1>
        </div>
        <form action={deconnexionClient}>
          <button type="submit" className="rounded-full border border-line px-5 py-2.5 text-sm hover:border-ink">
            Se déconnecter
          </button>
        </form>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="titre-reserver" className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
          <h2 id="titre-reserver" className="font-heading text-2xl font-bold">
            Nouvelle réservation
          </h2>
          <div className="mt-6">
            <FormulaireReservation prestations={prestations} prestationInitiale={initiale} telephone={compte.telephone} dateMin={new Date().toISOString().slice(0, 10)} />
          </div>
        </section>

        <section aria-labelledby="titre-liste">
          <h2 id="titre-liste" className="font-heading text-2xl font-bold">
            Mes réservations
          </h2>
          {reservations.length === 0 ? (
            <p className="mt-4 text-sm text-muted">Vous n&apos;avez encore aucune réservation.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {reservations.map((r) => (
                <li key={r.cle} className="rounded-2xl border border-line p-5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold">{r.prestation}</p>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${COULEURS[r.statut]}`}>{STATUTS[r.statut]}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {formaterDate(r.date)}
                    {r.lieu && ` · ${r.lieu}`}
                  </p>
                  {r.message && <p className="mt-2 text-sm text-muted">{r.message}</p>}
                  {r.statut === "en-attente" && (
                    <form action={annulerMaReservation} className="mt-3">
                      <input type="hidden" name="cle" value={r.cle} />
                      <button type="submit" className="text-sm underline hover:text-red-700">
                        Annuler cette demande
                      </button>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-10 border-t border-line pt-5">
            <p className="mb-2 text-sm text-muted">{compte.email}</p>
            <BoutonSupprimerCompte />
          </div>
        </section>
      </div>
    </Container>
  );
}

export default function MonEspacePage({ searchParams }: PageProps<"/mon-espace">) {
  return (
    <div data-univers="accueil">
      <Suspense fallback={<ChargementCompte />}>
        <Espace searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
