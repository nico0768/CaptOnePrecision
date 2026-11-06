"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { changerStatutReservation } from "@/app/admin/actions";
import type { Reservation, Statut } from "@/lib/comptes";

// Copie locale : `@/lib/comptes` n'est utilisable que côté serveur (seuls ses types sont importés).
const STATUTS: Record<Statut, string> = { "en-attente": "En attente", confirmee: "Confirmée", annulee: "Annulée" };
const formaterDate = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString("fr-FR", { dateStyle: "long" });

function Ligne({ initiale }: { initiale: Reservation }) {
  const [reservation, setReservation] = useState(initiale);
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, demarrer] = useTransition();
  const router = useRouter();
  const numero = reservation.telephone.replace(/\D/g, "");

  const changer = (statut: Statut) =>
    demarrer(async () => {
      setErreur(null);
      const resultat = await changerStatutReservation(reservation.cle, statut);
      if (resultat.ok) {
        setReservation({ ...reservation, statut });
        // Met à jour le compteur de demandes en attente.
        router.refresh();
      } else setErreur(resultat.message);
    });

  return (
    <li className="rounded-xl border border-[#e4e4e7] bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold">{reservation.prestation}</p>
          <p className="text-sm text-[#62626b]">
            {formaterDate(reservation.date)}
            {reservation.lieu && ` · ${reservation.lieu}`}
          </p>
        </div>
        <label className="text-sm">
          <span className="sr-only">Statut de la réservation</span>
          <select
            value={reservation.statut}
            disabled={enCours}
            onChange={(e) => changer(e.target.value as Statut)}
            className="rounded-lg border border-[#d4d4d8] bg-white px-3 py-2 disabled:opacity-50"
          >
            {Object.entries(STATUTS).map(([valeur, label]) => (
              <option key={valeur} value={valeur}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="mt-3 text-sm font-medium">{reservation.nom}</p>
      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <a href={`mailto:${reservation.email}`} className="underline">
          {reservation.email}
        </a>
        <a href={`tel:${reservation.telephone.replace(/\s/g, "")}`} className="underline">
          {reservation.telephone}
        </a>
        <a href={`https://wa.me/${numero}`} target="_blank" rel="noopener noreferrer" className="underline">
          WhatsApp
        </a>
      </div>
      {reservation.message && <p className="mt-2 text-sm whitespace-pre-line text-[#62626b]">{reservation.message}</p>}
      {erreur && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {erreur}
        </p>
      )}
    </li>
  );
}

export function ListeReservations({ reservations, indisponible }: { reservations: Reservation[]; indisponible: boolean }) {
  if (indisponible) {
    return (
      <p role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">
        Les réservations ne peuvent pas être lues. En ligne, vérifiez que le stockage privé est relié au projet (BLOB_PRIVE_READ_WRITE_TOKEN).
      </p>
    );
  }
  if (reservations.length === 0) return <p className="text-sm text-[#62626b]">Aucune réservation pour le moment.</p>;
  return (
    <ul className="space-y-3">
      {reservations.map((r) => (
        <Ligne key={r.cle} initiale={r} />
      ))}
    </ul>
  );
}
