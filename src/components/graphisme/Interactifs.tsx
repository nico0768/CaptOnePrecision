"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MediaImage } from "@/components/ui/MediaImage";
import { Arrow } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import type { Media } from "@/lib/types";

/** Fenêtre d'ouverture : la phrase de bienvenue s'écrit lettre après lettre. */
export function FenetreEcriture({ fenetre, commande, phrase }: { fenetre: string; commande: string; phrase: string }) {
  const [nombre, setNombre] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const immediat = setTimeout(() => setNombre(phrase.length), 0);
      return () => clearTimeout(immediat);
    }
    const minuteur = setInterval(() => {
      setNombre((n) => {
        if (n >= phrase.length) clearInterval(minuteur);
        return Math.min(n + 1, phrase.length);
      });
    }, 45);
    return () => clearInterval(minuteur);
  }, [phrase]);

  return (
    <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-xl border border-white/10 bg-[#18181b]/90 text-left shadow-2xl backdrop-blur">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span aria-hidden className="size-3 rounded-full bg-[#e5484d]" />
        <span aria-hidden className="size-3 rounded-full bg-[#e5a50a]" />
        <span aria-hidden className="size-3 rounded-full bg-[#30a46c]" />
        <span className="ml-2 font-mono text-xs text-white/60">{fenetre}</span>
      </div>
      <div className="px-6 py-10 font-mono sm:px-10">
        <p className="text-sm text-white/60">
          <span className="text-[#4aa3ea]">$</span> {commande}
        </p>
        <h1 aria-label={phrase} className="mt-5 min-h-[3.5em] text-xl leading-relaxed text-white sm:text-3xl">
          <span aria-hidden>{phrase.slice(0, nombre)}</span>
          <span aria-hidden className="ml-0.5 inline-block h-[1em] w-0.5 translate-y-1 animate-pulse bg-[#4aa3ea]" />
        </h1>
      </div>
    </div>
  );
}

type Carte = { periode: string; titre: string; sousTitre: string; texte: string; image?: Media; href?: string };

/** Contenu d'une carte de l'éventail : un visuel pour les projets, du texte pour les savoir-faire. */
function InterieurCarte({ carte, active }: { carte: Carte; active: boolean }) {
  return (
    <>
      {carte.image && (
        <span className="relative block h-40 shrink-0 overflow-hidden bg-surface">
          <MediaImage media={carte.image} fill sizes="280px" className="object-[center_20%]" />
        </span>
      )}
      <span className={cn("flex min-h-0 flex-1 flex-col", carte.image ? "p-5" : "p-7")}>
        <span className="text-xs text-muted">{carte.periode}</span>
        <span className={cn("font-medium tracking-tight", carte.image ? "mt-2 text-xl" : "mt-4 text-2xl", !active && "opacity-60")}>{carte.titre}</span>
        <span className="mt-1 text-sm text-muted">{carte.sousTitre}</span>
        {carte.href ? (
          <span className={cn("mt-auto inline-flex items-center gap-2 pt-3 text-sm font-medium text-accent transition-opacity", !active && "opacity-0")}>
            Voir le projet <Arrow />
          </span>
        ) : (
          <span className={cn("mt-5 text-sm leading-relaxed text-muted transition-opacity", !active && "opacity-0")}>{carte.texte}</span>
        )}
      </span>
    </>
  );
}

/** Cartes disposées en éventail : celle du centre est lisible, un clic amène les autres. */
export function Eventail({ cartes }: { cartes: Carte[] }) {
  const [actif, setActif] = useState(Math.floor(cartes.length / 2));
  const aller = (i: number) => setActif((i + cartes.length) % cartes.length);

  return (
    <div>
      <div className="relative h-[470px] overflow-hidden">
        {cartes.map((c, i) => {
          const ecart = i - actif;
          const distance = Math.abs(ecart);
          const masquee = distance > 3;
          const active = ecart === 0;
          const style = {
            transform: `translateX(calc(-50% + ${ecart * 110}px)) translateY(${distance * 18}px) rotate(${ecart * 7}deg)`,
            zIndex: 20 - distance,
            opacity: masquee ? 0 : 1,
          };
          const classes = cn(
            "absolute top-2 left-1/2 flex h-[360px] w-[280px] flex-col overflow-hidden rounded-2xl border border-line bg-bg text-left shadow-xl transition-[transform,opacity] duration-500 ease-out-expo",
            masquee && "pointer-events-none",
          );
          // La carte d'un projet, une fois au centre, ouvre la fiche du projet.
          return active && c.href ? (
            <Link key={i} href={c.href} style={style} className={classes}>
              <InterieurCarte carte={c} active />
            </Link>
          ) : (
            <button
              key={i}
              type="button"
              onClick={() => aller(i)}
              aria-label={`Afficher : ${c.titre}`}
              aria-current={active}
              tabIndex={active || masquee ? -1 : 0}
              style={style}
              className={classes}
            >
              <InterieurCarte carte={c} active={active} />
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-center gap-4">
        <Fleche sens={-1} onClick={() => aller(actif - 1)} label="Carte précédente" />
        <p className="text-xs text-muted" aria-live="polite">
          {actif + 1} / {cartes.length}
        </p>
        <Fleche sens={1} onClick={() => aller(actif + 1)} label="Carte suivante" />
      </div>
    </div>
  );
}

function Fleche({ sens, onClick, label, plein }: { sens: 1 | -1; onClick: () => void; label: string; plein?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex size-12 items-center justify-center rounded-full border transition-colors",
        plein ? "border-accent bg-accent text-accent-ink hover:opacity-90" : "border-line hover:border-ink",
      )}
    >
      <svg aria-hidden viewBox="0 0 16 16" className={cn("size-4", sens < 0 && "rotate-180")} fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M1 8h13M9 3l5 5-5 5" />
      </svg>
    </button>
  );
}

/** Projets présentés un par un dans une fenêtre, sur fond sombre. */
export function FenetreCreations({
  titre,
  texte,
  projets,
}: {
  titre: React.ReactNode;
  texte: string;
  projets: { slug: string; titre: string; image: Media }[];
}) {
  const [actif, setActif] = useState(0);
  const projet = projets[actif];
  const aller = (i: number) => setActif((i + projets.length) % projets.length);

  return (
    <div className="grid items-center gap-12 lg:grid-cols-2">
      <div>
        <h2 className="text-[clamp(3rem,6vw,5rem)] leading-[0.98] font-black tracking-tight uppercase">{titre}</h2>
        <p className="mt-6 max-w-md text-muted">{texte}</p>
        {projets.length > 1 && (
          <div className="mt-8 flex gap-3">
            <Fleche sens={-1} onClick={() => aller(actif - 1)} label="Création précédente" />
            <Fleche sens={1} onClick={() => aller(actif + 1)} label="Création suivante" plein />
          </div>
        )}
      </div>
      {projet && (
        <Link href={`/graphisme/${projet.slug}`} className="group block overflow-hidden rounded-xl border border-line bg-surface shadow-2xl">
          <div className="flex items-center gap-2 border-b border-line px-4 py-3">
            <span aria-hidden className="size-2.5 rounded-full bg-[#e5484d]" />
            <span aria-hidden className="size-2.5 rounded-full bg-[#e5a50a]" />
            <span aria-hidden className="size-2.5 rounded-full bg-[#30a46c]" />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden">
            <div className="absolute inset-0 transition-transform duration-700 ease-out-expo group-hover:scale-105">
              <MediaImage key={projet.slug} media={projet.image} fill sizes="(min-width: 1024px) 46vw, 92vw" />
            </div>
            <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5 pt-14 text-lg font-semibold text-white">{projet.titre}</p>
          </div>
        </Link>
      )}
    </div>
  );
}

/** Domaines d'expertise : une liste de groupes à gauche, leur contenu à droite. */
export function OngletsOutils({ groupes }: { groupes: { nom: string; elements: string[] }[] }) {
  const [actif, setActif] = useState(0);
  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div role="tablist" aria-label="Domaines" className="lg:col-span-4">
        {groupes.map((g, i) => (
          <button
            key={g.nom}
            id={`onglet-${i}`}
            role="tab"
            type="button"
            aria-selected={i === actif}
            aria-controls="panneau-outils"
            onClick={() => setActif(i)}
            className={cn(
              "flex w-full items-baseline gap-3 border-b border-line py-4 text-left text-lg font-semibold transition-colors",
              i === actif ? "border-b-accent text-ink" : "text-muted hover:text-ink",
            )}
          >
            <span className="text-xs font-normal">{String(i + 1).padStart(2, "0")}</span>
            {g.nom}
          </button>
        ))}
      </div>
      <ul id="panneau-outils" role="tabpanel" aria-labelledby={`onglet-${actif}`} className="grid content-start gap-4 sm:grid-cols-2 lg:col-span-8">
        {(groupes[actif]?.elements ?? []).map((e) => (
          <li key={e} className="rounded-xl border border-line p-5 font-semibold">
            {e}
          </li>
        ))}
      </ul>
    </div>
  );
}
