import type { Champ } from "@/content/schema";
import type { Media } from "@/lib/types";

/**
 * Nettoie les données reçues du tableau de bord à partir du schéma :
 * seuls les champs connus sont conservés, avec le bon type et une longueur raisonnable.
 */
const LONGUEUR_MAX = 20000;

const texte = (v: unknown) => (typeof v === "string" ? v.trim().slice(0, LONGUEUR_MAX) : "");

/** Seuls les liens sûrs sont acceptés (pas de `javascript:` par exemple). */
export function lienSur(v: unknown) {
  const lien = texte(v);
  if (!lien) return "";
  if (/^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i.test(lien)) return lien;
  // « facebook.com/ma-page » : l'adresse a été collée sans son préfixe.
  if (/^[a-z0-9-]+(\.[a-z0-9-]+)+([/?#].*)?$/i.test(lien)) return `https://${lien}`;
  return "";
}

const srcSure = (v: unknown) => {
  const src = texte(v);
  return /^(\/(?!\/)[\w./-]+|https:\/\/[a-z0-9.-]+\.public\.blob\.vercel-storage\.com\/[\w./-]+)$/i.test(src) ? src : null;
};

function image(v: unknown): Media {
  const o = (v ?? {}) as Partial<Media>;
  const dimension = (d: unknown, secours: number) => {
    const n = Math.round(Number(d));
    return Number.isFinite(n) && n > 0 && n <= 20000 ? n : secours;
  };
  return {
    src: srcSure(o.src),
    alt: texte(o.alt),
    width: dimension(o.width, 1600),
    height: dimension(o.height, 1200),
    ...(o.todo ? { todo: texte(o.todo) } : {}),
  };
}

export function creerIdentifiant(v: string) {
  return v
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function champ(c: Champ, v: unknown, parent: Record<string, unknown>): unknown {
  switch (c.type) {
    case "texte":
    case "zone":
      return texte(v);
    case "cache":
      return texte(v) || crypto.randomUUID();
    case "lien":
      return lienSur(v);
    case "couleur":
      return /^#[0-9a-f]{6}$/i.test(texte(v)) ? texte(v) : "#000000";
    case "identifiant":
      return creerIdentifiant(texte(v) || texte(parent[c.source])) || crypto.randomUUID().slice(0, 8);
    case "nombre": {
      const n = Number(v);
      return Number.isFinite(n) ? Math.min(c.max, Math.max(c.min, n)) : c.min;
    }
    case "case":
      return v === true;
    case "image":
      return image(v);
    case "images":
      return Array.isArray(v) ? v.map(image) : [];
    case "mots":
      return Array.isArray(v) ? v.map(texte).filter(Boolean) : [];
    case "choix":
      return c.options.some((o) => o.slug === v) ? v : (c.options[0]?.slug ?? "");
    case "choixMultiple":
      return Array.isArray(v) ? v.filter((x) => c.options.some((o) => o.slug === x)) : [];
    case "groupe":
      return assainirChamps(c.champs, v);
    case "liste":
      return dedoublonner(c.champs, Array.isArray(v) ? v.map((e) => assainirChamps(c.champs, e)) : []);
  }
}

/** Deux pages ne peuvent pas partager la même adresse. */
function dedoublonner(champs: Champ[], elements: Record<string, unknown>[]) {
  const cle = champs.find((c) => c.type === "identifiant")?.cle;
  if (!cle) return elements;
  const vus = new Set<string>();
  return elements.map((e) => {
    const base = String(e[cle]);
    let valeur = base;
    for (let n = 2; vus.has(valeur); n++) valeur = `${base}-${n}`;
    vus.add(valeur);
    return { ...e, [cle]: valeur };
  });
}

export function assainirChamps(champs: Champ[], valeur: unknown): Record<string, unknown> {
  const source = typeof valeur === "object" && valeur !== null ? (valeur as Record<string, unknown>) : {};
  return Object.fromEntries(champs.map((c) => [c.cle, champ(c, source[c.cle], source)]));
}
