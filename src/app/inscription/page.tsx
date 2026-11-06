import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { CadreCompte, ChargementCompte } from "@/components/compte/Cadre";
import { FormulaireInscription } from "@/components/compte/Formulaires";
import { compteConnecte } from "@/lib/comptes";

export const metadata: Metadata = {
  title: "Inscription",
  description: "Créez votre compte pour réserver une prestation auprès de Capt One PRECISION.",
  alternates: { canonical: "/inscription" },
};

async function Contenu({ searchParams }: { searchParams: PageProps<"/inscription">["searchParams"] }) {
  const { formule } = await searchParams;
  const choix = typeof formule === "string" ? formule : undefined;
  if (await compteConnecte()) redirect(choix ? `/mon-espace?formule=${encodeURIComponent(choix)}` : "/mon-espace");
  return (
    <CadreCompte titre="Inscription" texte="Créez votre compte pour réserver une prestation et suivre vos demandes.">
      <FormulaireInscription formule={choix} />
    </CadreCompte>
  );
}

export default function InscriptionPage({ searchParams }: PageProps<"/inscription">) {
  return (
    <Suspense fallback={<ChargementCompte />}>
      <Contenu searchParams={searchParams} />
    </Suspense>
  );
}
