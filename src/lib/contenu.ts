import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { contenuParDefaut } from "@/content/defaut";
import type { Contenu } from "@/lib/types";
import { lireContenuEnregistre } from "./stockage";

export const TAG_CONTENU = "contenu";

const estObjet = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/** Les nouveaux champs ajoutés au site gardent leur valeur par défaut. Les listes sont remplacées. */
function fusionner<T>(base: T, enregistre: unknown): T {
  if (!estObjet(base) || !estObjet(enregistre)) return (enregistre === undefined ? base : enregistre) as T;
  const resultat: Record<string, unknown> = { ...base };
  for (const [cle, valeur] of Object.entries(enregistre)) resultat[cle] = fusionner(resultat[cle], valeur);
  return resultat as T;
}

/** Lecture sans cache, pour le tableau de bord. */
export async function lireContenu(): Promise<Contenu> {
  return fusionner(contenuParDefaut, (await lireContenuEnregistre()) ?? {});
}

/** Lecture pour les pages publiques : mise en cache jusqu'au prochain enregistrement. */
export async function getContenu(): Promise<Contenu> {
  "use cache";
  cacheTag(TAG_CONTENU);
  cacheLife("max");
  return lireContenu();
}
