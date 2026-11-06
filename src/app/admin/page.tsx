import type { Metadata } from "next";
import { Suspense } from "react";
import { Connexion } from "@/components/admin/Connexion";
import { TableauDeBord } from "@/components/admin/TableauDeBord";
import { toutesLesReservations, type Reservation } from "@/lib/comptes";
import { lireContenu } from "@/lib/contenu";
import { adminConfigure, sessionValide } from "@/lib/session";

export const metadata: Metadata = {
  title: "Tableau de bord",
  robots: { index: false, follow: false },
};

async function Espace() {
  if (!(await sessionValide())) return <Connexion configure={adminConfigure()} />;
  let reservations: Reservation[] = [];
  let indisponible = false;
  try {
    reservations = await toutesLesReservations();
  } catch (e) {
    console.error("[admin] Réservations illisibles :", e);
    indisponible = true;
  }
  return <TableauDeBord contenu={await lireContenu()} reservations={reservations} reservationsIndisponibles={indisponible} />;
}

export default function AdminPage() {
  return (
    <div data-admin className="min-h-dvh bg-[#f4f4f5] font-sans text-[#18181b]">
      <Suspense fallback={<p className="p-10 text-sm text-[#62626b]">Chargement…</p>}>
        <Espace />
      </Suspense>
    </div>
  );
}
