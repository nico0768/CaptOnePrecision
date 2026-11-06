import "server-only";
import { createHash, createHmac, randomBytes, randomUUID, scrypt, timingSafeEqual } from "node:crypto";
import { mkdir, readdir, readFile, rm, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { del, get, list, put } from "@vercel/blob";
import { cookies } from "next/headers";
import { connection } from "next/server";

/**
 * Comptes clients et réservations.
 * Ces données personnelles ne vont jamais dans le stockage public du site :
 * - en local : dossier `data/prive/`, exclu de git et du déploiement ;
 * - sur Vercel : un stockage Blob PRIVÉ, relié par BLOB_PRIVE_READ_WRITE_TOKEN.
 */

export type Statut = "en-attente" | "confirmee" | "annulee";
export const STATUTS: Record<Statut, string> = { "en-attente": "En attente", confirmee: "Confirmée", annulee: "Annulée" };

export type Compte = { id: string; nom: string; email: string; telephone: string; motDePasse: string; creeLe: string };
export type CompteSansSecret = Omit<Compte, "motDePasse">;
export type Reservation = {
  cle: string;
  compteId: string;
  nom: string;
  email: string;
  telephone: string;
  prestation: string;
  date: string;
  lieu: string;
  message: string;
  statut: Statut;
  creeLe: string;
};

/* ---------- Stockage privé ---------- */

const DOSSIER = path.join(process.cwd(), "data", "prive");
const CLE_VALIDE = /^(comptes|reservations)(\/[a-f0-9-]+)+\.json$/;
const jeton = () => process.env.BLOB_PRIVE_READ_WRITE_TOKEN;

export class StockageIndisponible extends Error {}

function verifier(cle: string) {
  if (!CLE_VALIDE.test(cle)) throw new Error("Clé de stockage invalide.");
  // Sur Vercel, le disque est temporaire : mieux vaut refuser que perdre des comptes.
  if (process.env.VERCEL && !jeton()) throw new StockageIndisponible("BLOB_PRIVE_READ_WRITE_TOKEN manquant.");
}

async function lire<T>(cle: string): Promise<T | null> {
  verifier(cle);
  const token = jeton();
  if (token) {
    const resultat = await get(cle, { access: "private", token, useCache: false });
    if (!resultat || resultat.statusCode !== 200) return null;
    return (await new Response(resultat.stream).json()) as T;
  }
  try {
    return JSON.parse(await readFile(path.join(DOSSIER, cle), "utf8")) as T;
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw e;
  }
}

async function ecrire(cle: string, valeur: unknown) {
  verifier(cle);
  const json = JSON.stringify(valeur, null, 2);
  const token = jeton();
  if (token) {
    await put(cle, json, { access: "private", token, addRandomSuffix: false, allowOverwrite: true, contentType: "application/json" });
    return;
  }
  const fichier = path.join(DOSSIER, cle);
  await mkdir(path.dirname(fichier), { recursive: true });
  const temporaire = `${fichier}.${randomUUID()}.tmp`;
  await writeFile(temporaire, json, "utf8");
  await rename(temporaire, fichier);
}

/** Crée un élément. Renvoie false s'il existe déjà, y compris lors de deux envois simultanés. */
async function creer(cle: string, valeur: unknown): Promise<boolean> {
  verifier(cle);
  const json = JSON.stringify(valeur, null, 2);
  const token = jeton();
  try {
    if (token) {
      await put(cle, json, { access: "private", token, addRandomSuffix: false, allowOverwrite: false, contentType: "application/json" });
    } else {
      const fichier = path.join(DOSSIER, cle);
      await mkdir(path.dirname(fichier), { recursive: true });
      await writeFile(fichier, json, { encoding: "utf8", flag: "wx" });
    }
    return true;
  } catch (e) {
    if ((await lire(cle)) !== null) return false;
    throw e;
  }
}

async function cles(prefixe: string): Promise<string[]> {
  verifier(`${prefixe}/0.json`);
  const token = jeton();
  if (token) {
    const resultat: string[] = [];
    let cursor: string | undefined;
    do {
      const page = await list({ prefix: `${prefixe}/`, token, cursor });
      resultat.push(...page.blobs.map((b) => b.pathname));
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    return resultat;
  }
  try {
    const fichiers = await readdir(path.join(DOSSIER, prefixe), { recursive: true });
    return fichiers.filter((f) => f.endsWith(".json")).map((f) => `${prefixe}/${f.split(path.sep).join("/")}`);
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw e;
  }
}

async function supprimer(cle: string) {
  verifier(cle);
  const token = jeton();
  if (token) await del(cle, { token });
  else await rm(path.join(DOSSIER, cle), { force: true });
}

/* ---------- Mots de passe ---------- */

const scryptAsync = promisify(scrypt) as (mdp: string, sel: Buffer, taille: number, options: object) => Promise<Buffer>;
const COUT = 32768;
const OPTIONS = { N: COUT, r: 8, p: 1, maxmem: 128 * COUT * 8 * 2 };

async function hacher(motDePasse: string) {
  const sel = randomBytes(16);
  const empreinte = await scryptAsync(motDePasse, sel, 64, OPTIONS);
  return `scrypt$${COUT}$${sel.toString("base64url")}$${empreinte.toString("base64url")}`;
}

async function motDePasseValide(motDePasse: string, enregistre: string) {
  const [, , sel, attendu] = enregistre.split("$");
  const calcule = await scryptAsync(motDePasse, Buffer.from(sel, "base64url"), 64, OPTIONS);
  return timingSafeEqual(calcule, Buffer.from(attendu, "base64url"));
}

// Calcul effectué même si le compte n'existe pas : le temps de réponse ne révèle pas les adresses inscrites.
const empreinteLeurre = hacher(randomBytes(16).toString("hex"));

/* ---------- Comptes ---------- */

const idDepuisEmail = (email: string) => createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
const cleCompte = (id: string) => `comptes/${id}.json`;

export async function creerCompte(donnees: { nom: string; email: string; telephone: string; motDePasse: string }) {
  const id = idDepuisEmail(donnees.email);
  const compte: Compte = {
    id,
    nom: donnees.nom,
    email: donnees.email.trim().toLowerCase(),
    telephone: donnees.telephone,
    motDePasse: await hacher(donnees.motDePasse),
    creeLe: new Date().toISOString(),
  };
  return (await creer(cleCompte(id), compte)) ? id : null;
}

/** Renvoie l'identifiant du compte si l'e-mail et le mot de passe correspondent. */
export async function verifierIdentifiants(email: string, motDePasse: string) {
  const compte = await lire<Compte>(cleCompte(idDepuisEmail(email)));
  const valide = await motDePasseValide(motDePasse, compte?.motDePasse ?? (await empreinteLeurre));
  return compte && valide ? compte.id : null;
}

/* ---------- Session ---------- */

const COOKIE = "client_session";
// Sans valeur sensible : indique seulement au menu d'afficher « Mon espace » au lieu de « Connexion ».
const COOKIE_PRESENCE = "client_present";
const DUREE_S = 60 * 60 * 24 * 30;

// Clé distincte de celle du tableau de bord : une session client ne peut pas ouvrir /admin.
function signer(contenu: string) {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) throw new StockageIndisponible("ADMIN_PASSWORD manquant.");
  const cle = createHash("sha256").update(`client:${secret}`).digest();
  return createHmac("sha256", cle).update(contenu).digest("base64url");
}

export async function ouvrirSessionClient(id: string) {
  const contenu = `${id}.${Date.now() + DUREE_S * 1000}`;
  const options = { sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: DUREE_S } as const;
  const magasin = await cookies();
  magasin.set(COOKIE, `${contenu}.${signer(contenu)}`, { ...options, httpOnly: true });
  magasin.set(COOKIE_PRESENCE, "1", options);
}

export async function fermerSessionClient() {
  const magasin = await cookies();
  magasin.delete(COOKIE);
  magasin.delete(COOKIE_PRESENCE);
}

/** Compte connecté, relu à chaque demande : un compte supprimé perd aussitôt l'accès. */
export async function compteConnecte(): Promise<CompteSansSecret | null> {
  // L'expiration se compare à l'heure de la requête, jamais à celle de la compilation.
  await connection();
  const valeur = (await cookies()).get(COOKIE)?.value;
  if (!valeur) return null;
  const [id, expiration, signature] = valeur.split(".");
  if (!id || !expiration || !signature || !/^[a-f0-9]{64}$/.test(id) || Number(expiration) < Date.now()) return null;
  const attendu = Buffer.from(signer(`${id}.${expiration}`));
  const recu = Buffer.from(signature);
  if (attendu.length !== recu.length || !timingSafeEqual(attendu, recu)) return null;
  const compte = await lire<Compte>(cleCompte(id));
  if (!compte) return null;
  return { id: compte.id, nom: compte.nom, email: compte.email, telephone: compte.telephone, creeLe: compte.creeLe };
}

/* ---------- Réservations ---------- */

const parDateDeCreation = (a: Reservation, b: Reservation) => b.creeLe.localeCompare(a.creeLe);

async function lireToutes(prefixe: string) {
  const liste = await Promise.all((await cles(prefixe)).map((cle) => lire<Reservation>(cle)));
  return liste.filter((r): r is Reservation => r !== null).sort(parDateDeCreation);
}

export async function creerReservation(compte: CompteSansSecret, donnees: { prestation: string; date: string; lieu: string; message: string; telephone: string }) {
  const cle = `reservations/${compte.id}/${randomUUID()}.json`;
  const reservation: Reservation = {
    cle,
    compteId: compte.id,
    nom: compte.nom,
    email: compte.email,
    ...donnees,
    statut: "en-attente",
    creeLe: new Date().toISOString(),
  };
  await ecrire(cle, reservation);
  return reservation;
}

export const reservationsDuCompte = (id: string) => lireToutes(`reservations/${id}`);
export const toutesLesReservations = () => lireToutes("reservations");

export async function changerStatut(cle: string, statut: Statut) {
  if (!cle.startsWith("reservations/")) throw new Error("Réservation invalide.");
  const reservation = await lire<Reservation>(cle);
  if (!reservation) return null;
  const miseAJour = { ...reservation, statut };
  await ecrire(cle, miseAJour);
  return miseAJour;
}

export async function lireReservation(cle: string) {
  return cle.startsWith("reservations/") ? lire<Reservation>(cle) : null;
}

/** Efface le compte et toutes ses réservations. */
export async function supprimerCompte(id: string) {
  await Promise.all((await cles(`reservations/${id}`)).map(supprimer));
  await supprimer(cleCompte(id));
}
