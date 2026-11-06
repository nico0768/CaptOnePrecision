import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { connection } from "next/server";

/**
 * Session du tableau de bord : un cookie signé, sans base de données.
 * La signature dépend du mot de passe : le changer déconnecte toutes les sessions.
 */
const COOKIE = "admin_session";
const DUREE_S = 60 * 60 * 24 * 7;

const motDePasse = () => process.env.ADMIN_PASSWORD ?? "";
export const adminConfigure = () => motDePasse().length > 0;

const empreinte = (texte: string) => createHash("sha256").update(texte).digest();
const signer = (expiration: string) => createHmac("sha256", empreinte(motDePasse())).update(expiration).digest("base64url");

export function motDePasseCorrect(saisie: string) {
  return adminConfigure() && timingSafeEqual(empreinte(saisie), empreinte(motDePasse()));
}

export async function ouvrirSession() {
  const expiration = String(Date.now() + DUREE_S * 1000);
  (await cookies()).set(COOKIE, `${expiration}.${signer(expiration)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DUREE_S,
  });
}

export async function fermerSession() {
  (await cookies()).delete(COOKIE);
}

export async function sessionValide() {
  // L'expiration se compare à l'heure de la requête, jamais à celle de la compilation.
  await connection();
  if (!adminConfigure()) return false;
  const [expiration, signature] = ((await cookies()).get(COOKIE)?.value ?? "").split(".");
  if (!expiration || !signature || Number(expiration) < Date.now()) return false;
  const attendu = Buffer.from(signer(expiration));
  const recu = Buffer.from(signature);
  return attendu.length === recu.length && timingSafeEqual(attendu, recu);
}
