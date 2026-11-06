"use client";

import { useEffect, useState, useTransition } from "react";
import { deconnexion, enregistrerSection } from "@/app/admin/actions";
import { LogoSymbole } from "@/components/layout/Logo";
import { champTemoignages, sections } from "@/content/schema";
import { cn } from "@/lib/cn";
import type { Reservation } from "@/lib/comptes";
import type { Contenu } from "@/lib/types";
import { ChampFormulaire } from "./Champs";
import { ListeReservations } from "./Reservations";

type Valeurs = Record<string, unknown>;
type Message = { ok: boolean; texte: string } | null;

export function TableauDeBord({
  contenu,
  reservations,
  reservationsIndisponibles,
}: {
  contenu: Contenu;
  reservations: Reservation[];
  reservationsIndisponibles: boolean;
}) {
  const [valeurs, setValeurs] = useState<Valeurs>(contenu as unknown as Valeurs);
  const [modifiees, setModifiees] = useState<string[]>([]);
  const [idActif, setIdActif] = useState(sections[0].id);
  const [message, setMessage] = useState<Message>(null);
  const [enCours, demarrer] = useTransition();

  const surReservations = idActif === "reservations";
  const enAttente = reservations.filter((r) => r.statut === "en-attente").length;
  const section = sections.find((s) => s.id === idActif) ?? {
    id: "reservations",
    titre: "Réservations",
    description: "Les demandes envoyées par vos clients depuis leur espace.",
    apercu: "/",
    champs: [],
  };
  const nonEnregistre = modifiees.includes(idActif);

  // Prévient avant de quitter la page si des modifications ne sont pas enregistrées.
  useEffect(() => {
    if (modifiees.length === 0) return;
    const prevenir = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", prevenir);
    return () => window.removeEventListener("beforeunload", prevenir);
  }, [modifiees.length]);

  const modifier = (valeur: unknown) => {
    setValeurs((v) => ({ ...v, [idActif]: valeur }));
    setModifiees((m) => (m.includes(idActif) ? m : [...m, idActif]));
    setMessage(null);
  };

  const enregistrer = () =>
    demarrer(async () => {
      const resultat = await enregistrerSection(idActif, valeurs[idActif]);
      setMessage({ ok: resultat.ok, texte: resultat.message });
      if (resultat.ok) {
        // Reprend la version nettoyée par le serveur (liens corrigés, adresses créées…).
        setValeurs((v) => ({ ...v, [idActif]: resultat.valeur }));
        setModifiees((m) => m.filter((id) => id !== idActif));
      }
    });

  return (
    <div className="lg:grid lg:min-h-dvh lg:grid-cols-[260px_1fr]">
      <aside className="flex flex-col bg-[#18181b] p-5 text-white lg:sticky lg:top-0 lg:h-dvh">
        <div className="flex items-center gap-3">
          <LogoSymbole className="h-8" />
          <div className="leading-tight">
            <p className="text-sm font-semibold">Capt One PRECISION</p>
            <p className="text-xs text-white/60">Tableau de bord</p>
          </div>
        </div>
        <nav aria-label="Sections" className="mt-6 -mx-1 flex gap-1 overflow-x-auto lg:mt-8 lg:flex-1 lg:flex-col lg:overflow-visible">
          <button
            type="button"
            aria-current={surReservations ? "page" : undefined}
            onClick={() => {
              setIdActif("reservations");
              setMessage(null);
            }}
            className={cn(
              "flex shrink-0 items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm whitespace-nowrap transition-colors",
              surReservations ? "bg-white text-[#18181b]" : "text-white/75 hover:bg-white/10 hover:text-white",
            )}
          >
            Réservations
            {enAttente > 0 && <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs font-semibold text-white">{enAttente}</span>}
          </button>
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-current={s.id === idActif ? "page" : undefined}
              onClick={() => {
                setIdActif(s.id);
                setMessage(null);
              }}
              className={cn(
                "flex shrink-0 items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm whitespace-nowrap transition-colors",
                s.id === idActif ? "bg-white text-[#18181b]" : "text-white/75 hover:bg-white/10 hover:text-white",
              )}
            >
              {s.titre}
              {modifiees.includes(s.id) && <span title="Modifications non enregistrées" className="size-2 rounded-full bg-amber-500" />}
            </button>
          ))}
        </nav>
        <div className="mt-4 hidden space-y-1 border-t border-white/15 pt-4 text-sm lg:block">
          <a href="/" target="_blank" rel="noopener noreferrer" className="block rounded-lg px-3 py-2 text-white/75 hover:bg-white/10 hover:text-white">
            Voir le site ↗
          </a>
          <form action={deconnexion}>
            <button type="submit" className="w-full rounded-lg px-3 py-2 text-left text-white/75 hover:bg-white/10 hover:text-white">
              Se déconnecter
            </button>
          </form>
        </div>
      </aside>

      <main className="min-w-0">
        <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-[#e4e4e7] bg-white px-5 py-3 lg:px-8">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold tracking-tight">{section.titre}</h1>
            <p aria-live="polite" className={cn("text-sm", message ? (message.ok ? "text-green-700" : "text-red-700") : "text-[#62626b]")}>
              {message?.texte ?? (nonEnregistre ? "Modifications non enregistrées." : section.description)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!surReservations && (
              <>
                <a href={section.apercu} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-[#d4d4d8] px-4 py-2 text-sm font-medium hover:bg-[#f4f4f5]">
                  Aperçu ↗
                </a>
                <button
                  type="button"
                  onClick={enregistrer}
                  disabled={enCours || !nonEnregistre}
                  className="rounded-lg bg-[#18181b] px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-40"
                >
                  {enCours ? "Enregistrement…" : "Enregistrer"}
                </button>
              </>
            )}
          </div>
        </header>

        <div className="mx-auto max-w-3xl space-y-6 p-5 lg:p-8">
          {surReservations ? (
            <ListeReservations reservations={reservations} indisponible={reservationsIndisponibles} />
          ) : section.id === "temoignages" ? (
            <ChampFormulaire champ={champTemoignages} valeur={valeurs.temoignages} parent={{}} onChange={modifier} chemin="temoignages" />
          ) : (
            section.champs.map((champ) => {
              const courant = valeurs[idActif] as Valeurs;
              return (
                <ChampFormulaire
                  key={`${idActif}-${champ.cle}`}
                  champ={champ}
                  valeur={courant[champ.cle]}
                  parent={courant}
                  chemin={`${idActif}-${champ.cle}`}
                  onChange={(v) => modifier({ ...courant, [champ.cle]: v })}
                />
              );
            })
          )}
          <div className="flex gap-2 pt-2 lg:hidden">
            <a href="/" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-[#d4d4d8] px-4 py-2 text-sm">
              Voir le site ↗
            </a>
            <form action={deconnexion}>
              <button type="submit" className="rounded-lg border border-[#d4d4d8] px-4 py-2 text-sm">
                Se déconnecter
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
