import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { list, put } from "@vercel/blob";

/**
 * Enregistrement du contenu et des images du tableau de bord.
 * - En local : dossier `data/` du projet.
 * - Sur Vercel (disque en lecture seule) : Vercel Blob, activé par BLOB_READ_WRITE_TOKEN.
 */
const DOSSIER = path.join(process.cwd(), "data");
const FICHIER = path.join(DOSSIER, "contenu.json");
const DOSSIER_MEDIAS = path.join(DOSSIER, "medias");
const CLE_BLOB = "contenu.json";

const blobActif = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

async function lireFichier(): Promise<unknown | null> {
  try {
    return JSON.parse(await readFile(FICHIER, "utf8"));
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw e;
  }
}

/** Contenu enregistré, ou null si rien n'a encore été modifié. */
export async function lireContenuEnregistre(): Promise<unknown | null> {
  if (blobActif()) {
    const { blobs } = await list({ prefix: CLE_BLOB, limit: 1 });
    const blob = blobs.find((b) => b.pathname === CLE_BLOB);
    if (blob) {
      const reponse = await fetch(`${blob.url}?v=${new Date(blob.uploadedAt).getTime()}`, { cache: "no-store" });
      if (!reponse.ok) throw new Error(`Lecture du contenu impossible (${reponse.status}).`);
      return reponse.json();
    }
  }
  return lireFichier();
}

export async function ecrireContenu(contenu: unknown) {
  const json = JSON.stringify(contenu, null, 2);
  if (blobActif()) {
    await put(CLE_BLOB, json, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 60,
    });
    return;
  }
  await mkdir(DOSSIER, { recursive: true });
  // Écriture en deux temps : un arrêt brutal ne peut pas corrompre le fichier.
  const temporaire = `${FICHIER}.${randomUUID()}.tmp`;
  await writeFile(temporaire, json, "utf8");
  await rename(temporaire, FICHIER);
}

const TYPES_IMAGE = { "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png" } as const;
type TypeImage = keyof typeof TYPES_IMAGE;

/** Le vrai format est lu dans le fichier : l'extension et le type annoncés ne prouvent rien. */
export function detecterTypeImage(o: Uint8Array): TypeImage | null {
  if (o[0] === 0xff && o[1] === 0xd8 && o[2] === 0xff) return "image/jpeg";
  if (o[0] === 0x89 && o[1] === 0x50 && o[2] === 0x4e && o[3] === 0x47) return "image/png";
  const ascii = (debut: number, fin: number) => String.fromCharCode(...o.subarray(debut, fin));
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "image/webp";
  return null;
}

/** Enregistre une image et renvoie l'adresse à utiliser sur le site. */
export async function enregistrerImage(octets: Uint8Array, type: TypeImage): Promise<string> {
  const nom = `${randomUUID()}.${TYPES_IMAGE[type]}`;
  if (blobActif()) {
    const blob = await put(`medias/${nom}`, Buffer.from(octets), { access: "public", addRandomSuffix: false, contentType: type });
    return blob.url;
  }
  await mkdir(DOSSIER_MEDIAS, { recursive: true });
  await writeFile(path.join(DOSSIER_MEDIAS, nom), octets);
  return `/medias/${nom}`;
}

const NOM_MEDIA = /^[a-f0-9-]{36}\.(webp|jpg|png)$/;
const TYPE_PAR_EXTENSION: Record<string, string> = { webp: "image/webp", jpg: "image/jpeg", png: "image/png" };

export async function lireImageLocale(nom: string) {
  if (!NOM_MEDIA.test(nom)) return null;
  try {
    const octets = await readFile(path.join(DOSSIER_MEDIAS, nom));
    return { octets, type: TYPE_PAR_EXTENSION[nom.split(".").pop()!] };
  } catch {
    return null;
  }
}
