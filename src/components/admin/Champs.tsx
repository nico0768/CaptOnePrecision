"use client";

import Image from "next/image";
import { useState } from "react";
import type { Champ } from "@/content/schema";
import { cn } from "@/lib/cn";
import type { Media } from "@/lib/types";

const COTE_MAX = 2400;
const styleChamp = "mt-1.5 w-full rounded-lg border border-[#d4d4d8] bg-white px-3 py-2 text-sm focus:border-[#18181b] focus:outline-none";
const styleBoutonSecondaire = "rounded-lg border border-[#d4d4d8] bg-white px-3 py-1.5 text-sm hover:bg-[#f4f4f5] disabled:opacity-40";

type Props = {
  champ: Champ;
  valeur: unknown;
  parent: Record<string, unknown>;
  onChange: (valeur: unknown) => void;
  /** Identifiant unique du champ dans la page. */
  chemin: string;
};

function Aide({ texte }: { texte?: string }) {
  return texte ? <p className="mt-1 text-xs text-[#62626b]">{texte}</p> : null;
}

/** Réduit l'image dans le navigateur : envoi plus rapide, et sans les données GPS de la photo. */
async function preparerImage(fichier: File): Promise<{ blob: Blob; width: number; height: number }> {
  const bitmap = await createImageBitmap(fichier).catch(() => {
    throw new Error("Ce fichier n'est pas une image valide (JPEG, PNG ou WebP).");
  });
  const echelle = Math.min(1, COTE_MAX / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * echelle);
  const height = Math.round(bitmap.height * echelle);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, "image/webp", 0.85));
  if (!blob) throw new Error("Cette image n'a pas pu être lue.");
  return { blob, width, height };
}

function ChampImage({ label, aide, valeur, onChange, chemin, onRetirer }: {
  label: string;
  aide?: string;
  valeur: Media;
  onChange: (m: Media) => void;
  chemin: string;
  onRetirer?: () => void;
}) {
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const envoyer = async (fichier: File | undefined) => {
    if (!fichier) return;
    setEnvoi(true);
    setErreur(null);
    try {
      const { blob, width, height } = await preparerImage(fichier);
      const donnees = new FormData();
      donnees.append("image", blob, "image.webp");
      const reponse = await fetch("/api/admin/image", { method: "POST", body: donnees });
      const resultat = await reponse.json();
      if (!reponse.ok) throw new Error(resultat.erreur);
      onChange({ ...valeur, src: resultat.src, width, height });
    } catch (e) {
      setErreur(e instanceof Error && e.message ? e.message : "L'envoi a échoué.");
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div>
      <p className="text-sm font-medium">{label}</p>
      <div className="mt-1.5 flex flex-col gap-3 rounded-lg border border-[#e4e4e7] bg-white p-3 sm:flex-row">
        <div className="relative flex h-24 w-full shrink-0 items-center justify-center overflow-hidden rounded bg-[#f4f4f5] sm:w-32">
          {valeur.src ? (
            <Image src={valeur.src} alt="" fill sizes="128px" className="object-contain" />
          ) : (
            <span className="px-2 text-center text-xs text-[#62626b]">{valeur.todo ?? "Aucune image"}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <label className={cn(styleBoutonSecondaire, "cursor-pointer focus-within:outline-2", envoi && "pointer-events-none opacity-50")}>
              {envoi ? "Envoi…" : valeur.src ? "Remplacer" : "Choisir une image"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                disabled={envoi}
                onChange={(e) => {
                  envoyer(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
            {valeur.src && !onRetirer && (
              <button type="button" className={styleBoutonSecondaire} onClick={() => onChange({ ...valeur, src: null })}>
                Retirer
              </button>
            )}
            {onRetirer && (
              <button type="button" className={styleBoutonSecondaire} onClick={onRetirer}>
                Supprimer
              </button>
            )}
          </div>
          <label htmlFor={`${chemin}-alt`} className="mt-2 block text-xs text-[#62626b]">
            Description de l&apos;image (pour Google et l&apos;accessibilité)
          </label>
          <input id={`${chemin}-alt`} value={valeur.alt} onChange={(e) => onChange({ ...valeur, alt: e.target.value })} className={styleChamp} />
          {erreur && (
            <p role="alert" className="mt-1 text-xs text-red-700">
              {erreur}
            </p>
          )}
        </div>
      </div>
      <Aide texte={aide} />
    </div>
  );
}

function ChampListe({ champ, valeur, onChange, chemin }: Omit<Props, "champ" | "parent"> & { champ: Extract<Champ, { type: "liste" }> }) {
  const elements = (Array.isArray(valeur) ? valeur : []) as Record<string, unknown>[];
  const [ouvert, setOuvert] = useState<number | null>(null);

  const titreElement = (e: Record<string, unknown>, i: number) => {
    const premier = champ.champs.find((c) => (c.type === "texte" || c.type === "zone") && e[c.cle]);
    if (premier) return String(e[premier.cle]);
    const image = champ.champs.find((c) => c.type === "image");
    const alt = image && (e[image.cle] as Media | undefined)?.alt;
    return alt || `Élément ${i + 1}`;
  };

  const deplacer = (i: number, sens: -1 | 1) => {
    const copie = [...elements];
    [copie[i], copie[i + sens]] = [copie[i + sens], copie[i]];
    onChange(copie);
    setOuvert(ouvert === i ? i + sens : ouvert === i + sens ? i : ouvert);
  };

  return (
    <fieldset>
      <legend className="text-sm font-medium">{champ.label}</legend>
      <Aide texte={champ.aide} />
      <ul className="mt-2 space-y-2">
        {elements.map((element, i) => (
          <li key={i} className="rounded-lg border border-[#e4e4e7] bg-white">
            <div className="flex items-center gap-1 p-1.5">
              <button
                type="button"
                aria-expanded={ouvert === i}
                onClick={() => setOuvert(ouvert === i ? null : i)}
                className="min-w-0 flex-1 truncate rounded px-2 py-1.5 text-left text-sm font-medium hover:bg-[#f4f4f5]"
              >
                <span aria-hidden className="mr-2 text-[#62626b]">{ouvert === i ? "▾" : "▸"}</span>
                {titreElement(element, i)}
              </button>
              <button type="button" aria-label="Monter" disabled={i === 0} onClick={() => deplacer(i, -1)} className="rounded px-2 py-1 hover:bg-[#f4f4f5] disabled:opacity-30">↑</button>
              <button type="button" aria-label="Descendre" disabled={i === elements.length - 1} onClick={() => deplacer(i, 1)} className="rounded px-2 py-1 hover:bg-[#f4f4f5] disabled:opacity-30">↓</button>
              <button
                type="button"
                aria-label={`Supprimer : ${titreElement(element, i)}`}
                onClick={() => {
                  if (!window.confirm(`Supprimer « ${titreElement(element, i)} » ?`)) return;
                  onChange(elements.filter((_, j) => j !== i));
                  setOuvert(null);
                }}
                className="rounded px-2 py-1 text-red-700 hover:bg-red-50"
              >
                ✕
              </button>
            </div>
            {ouvert === i && (
              <div className="space-y-4 border-t border-[#e4e4e7] bg-[#fafafa] p-4">
                {champ.champs.map((c) => (
                  <ChampFormulaire
                    key={c.cle}
                    champ={c}
                    valeur={element[c.cle]}
                    parent={element}
                    chemin={`${chemin}-${i}-${c.cle}`}
                    onChange={(v) => onChange(elements.map((e, j) => (j === i ? { ...e, [c.cle]: v } : e)))}
                  />
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
      <button
        type="button"
        className={cn(styleBoutonSecondaire, "mt-2")}
        onClick={() => {
          onChange([...elements, structuredClone(champ.modele)]);
          setOuvert(elements.length);
        }}
      >
        + Ajouter
      </button>
    </fieldset>
  );
}

function ChampImages({ champ, valeur, onChange, chemin }: Omit<Props, "parent">) {
  const images = (Array.isArray(valeur) ? valeur : []) as Media[];
  return (
    <fieldset>
      <legend className="text-sm font-medium">{champ.label}</legend>
      <div className="mt-2 space-y-2">
        {images.map((image, i) => (
          <ChampImage
            key={i}
            label={`Image ${i + 1}`}
            valeur={image}
            chemin={`${chemin}-${i}`}
            onChange={(m) => onChange(images.map((x, j) => (j === i ? m : x)))}
            onRetirer={() => onChange(images.filter((_, j) => j !== i))}
          />
        ))}
      </div>
      <button
        type="button"
        className={cn(styleBoutonSecondaire, "mt-2")}
        onClick={() => onChange([...images, { src: null, alt: "", width: 1600, height: 1200 }])}
      >
        + Ajouter une image
      </button>
    </fieldset>
  );
}

/** Affiche le bon contrôle selon le type décrit dans `src/content/schema.ts`. */
export function ChampFormulaire({ champ, valeur, parent, onChange, chemin }: Props) {
  const id = chemin;
  const titre = (
    <label htmlFor={id} className="text-sm font-medium">
      {champ.label}
    </label>
  );

  switch (champ.type) {
    case "cache":
      return null;
    case "texte":
    case "lien":
      return (
        <div>
          {titre}
          <input id={id} type="text" inputMode={champ.type === "lien" ? "url" : undefined} value={String(valeur ?? "")} onChange={(e) => onChange(e.target.value)} className={styleChamp} />
          <Aide texte={champ.aide} />
        </div>
      );
    case "identifiant":
      return (
        <div>
          {titre}
          <input id={id} type="text" value={String(valeur ?? "")} placeholder={String(parent[champ.source] ?? "")} onChange={(e) => onChange(e.target.value)} className={styleChamp} />
          <Aide texte={champ.aide} />
        </div>
      );
    case "zone":
      return (
        <div>
          {titre}
          <textarea id={id} rows={3} value={String(valeur ?? "")} onChange={(e) => onChange(e.target.value)} className={cn(styleChamp, "resize-y")} />
          <Aide texte={champ.aide} />
        </div>
      );
    case "nombre":
      return (
        <div>
          {titre}
          <input id={id} type="number" min={champ.min} max={champ.max} value={Number(valeur ?? 0)} onChange={(e) => onChange(Number(e.target.value))} className={styleChamp} />
          <Aide texte={champ.aide} />
        </div>
      );
    case "couleur":
      return (
        <div>
          {titre}
          <input id={id} type="color" value={String(valeur ?? "#000000")} onChange={(e) => onChange(e.target.value)} className="mt-1.5 block h-10 w-16 rounded border border-[#d4d4d8]" />
        </div>
      );
    case "case":
      return (
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={valeur === true} onChange={(e) => onChange(e.target.checked)} className="size-4" />
          {champ.label}
        </label>
      );
    case "mots":
      return (
        <div>
          {titre}
          <textarea
            id={id}
            rows={4}
            // Les lignes vides sont conservées pendant la frappe, puis retirées à l'enregistrement.
            value={((valeur as string[]) ?? []).join("\n")}
            onChange={(e) => onChange(e.target.value.split("\n"))}
            className={cn(styleChamp, "resize-y")}
          />
          <Aide texte={champ.aide} />
        </div>
      );
    case "choix":
      return (
        <div>
          {titre}
          <select id={id} value={String(valeur ?? "")} onChange={(e) => onChange(e.target.value)} className={styleChamp}>
            {champ.options.map((o) => (
              <option key={o.slug} value={o.slug}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      );
    case "choixMultiple": {
      const coches = (valeur as string[]) ?? [];
      return (
        <fieldset>
          <legend className="text-sm font-medium">{champ.label}</legend>
          <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {champ.options.map((o) => (
              <label key={o.slug} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={coches.includes(o.slug)}
                  onChange={(e) => onChange(e.target.checked ? [...coches, o.slug] : coches.filter((s) => s !== o.slug))}
                  className="size-4"
                />
                {o.label}
              </label>
            ))}
          </div>
        </fieldset>
      );
    }
    case "image":
      return (
        <ChampImage
          label={champ.label}
          aide={champ.aide}
          valeur={(valeur as Media) ?? { src: null, alt: "", width: 1600, height: 1200 }}
          chemin={chemin}
          onChange={onChange}
        />
      );
    case "images":
      return <ChampImages champ={champ} valeur={valeur} chemin={chemin} onChange={onChange} />;
    case "groupe": {
      const objet = (valeur ?? {}) as Record<string, unknown>;
      return (
        <details open={chemin.split("-").length <= 2} className="group rounded-xl border border-[#e4e4e7] bg-white">
          <summary className="cursor-pointer rounded-xl px-4 py-3 text-sm font-semibold">{champ.label}</summary>
          <div className="space-y-4 border-t border-[#e4e4e7] p-4">
            {champ.champs.map((c) => (
              <ChampFormulaire
                key={c.cle}
                champ={c}
                valeur={objet[c.cle]}
                parent={objet}
                chemin={`${chemin}-${c.cle}`}
                onChange={(v) => onChange({ ...objet, [c.cle]: v })}
              />
            ))}
          </div>
        </details>
      );
    }
    case "liste":
      return <ChampListe champ={champ} valeur={valeur} onChange={onChange} chemin={chemin} />;
  }
}
