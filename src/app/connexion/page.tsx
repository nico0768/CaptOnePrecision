import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { CadreCompte, ChargementCompte } from "@/components/compte/Cadre";
import { FormulaireConnexion } from "@/components/compte/Formulaires";
import { compteConnecte } from "@/lib/comptes";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous pour réserver une prestation et suivre vos demandes.",
  alternates: { canonical: "/connexion" },
};

async function Contenu({ searchParams }: { searchParams: PageProps<"/connexion">["searchParams"] }) {
  const { formule } = await searchParams;
  const choix = typeof formule === "string" ? formule : undefined;
  if (await compteConnecte()) redirect(choix ? `/mon-espace?formule=${encodeURIComponent(choix)}` : "/mon-espace");
  return (
    <CadreCompte titre="Connexion" texte="Retrouvez vos réservations et faites une nouvelle demande.">
      <FormulaireConnexion formule={choix} />
    </CadreCompte>
  );
}

export default function ConnexionPage({ searchParams }: PageProps<"/connexion">) {
  return (
    <Suspense fallback={<ChargementCompte />}>
      <Contenu searchParams={searchParams} />
    </Suspense>
  );
}
