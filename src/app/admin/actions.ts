"use server";

import { updateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { champTemoignages, sections } from "@/content/schema";
import { assainirChamps } from "@/lib/assainir";
import { changerStatut, STATUTS, type Statut } from "@/lib/comptes";
import { lireContenu, TAG_CONTENU } from "@/lib/contenu";
import { adminConfigure, fermerSession, motDePasseCorrect, ouvrirSession, sessionValide } from "@/lib/session";
import { ecrireContenu } from "@/lib/stockage";

export type EtatConnexion = { erreur?: string };
export type ResultatEnregistrement = { ok: boolean; message: string; valeur?: unknown };

const MAX_ECHECS = 10;
const FENETRE_MS = 15 * 60 * 1000;
const echecs = new Map<string, { nombre: number; debut: number }>();

export async function connexion(_: EtatConnexion, formData: FormData): Promise<EtatConnexion> {
  if (!adminConfigure()) return { erreur: "ADMIN_PASSWORD n'est pas défini sur le serveur." };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const suivi = echecs.get(ip);
  if (suivi && Date.now() - suivi.debut > FENETRE_MS) echecs.delete(ip);
  if ((echecs.get(ip)?.nombre ?? 0) >= MAX_ECHECS) {
    return { erreur: "Trop de tentatives. Réessayez dans 15 minutes." };
  }

  if (!motDePasseCorrect(String(formData.get("motDePasse") ?? ""))) {
    const courant = echecs.get(ip) ?? { nombre: 0, debut: Date.now() };
    echecs.set(ip, { ...courant, nombre: courant.nombre + 1 });
    await new Promise((r) => setTimeout(r, 500));
    return { erreur: "Mot de passe incorrect." };
  }

  echecs.delete(ip);
  await ouvrirSession();
  redirect("/admin");
}

export async function deconnexion() {
  await fermerSession();
  redirect("/admin");
}

export async function changerStatutReservation(cle: string, statut: Statut): Promise<ResultatEnregistrement> {
  if (!(await sessionValide())) return { ok: false, message: "Session expirée. Rechargez la page pour vous reconnecter." };
  if (!(statut in STATUTS)) return { ok: false, message: "Statut inconnu." };
  try {
    const resultat = await changerStatut(cle, statut);
    return resultat ? { ok: true, message: "Statut mis à jour." } : { ok: false, message: "Réservation introuvable." };
  } catch (e) {
    console.error("[admin] Statut non modifié :", e);
    return { ok: false, message: "Le statut n'a pas pu être modifié." };
  }
}

export async function enregistrerSection(id: string, valeur: unknown): Promise<ResultatEnregistrement> {
  if (!(await sessionValide())) return { ok: false, message: "Session expirée. Rechargez la page pour vous reconnecter." };

  const section = sections.find((s) => s.id === id);
  if (!section) return { ok: false, message: "Section inconnue." };

  try {
    const contenu = await lireContenu();
    const propre =
      id === "temoignages"
        ? assainirChamps([champTemoignages], { temoignages: valeur }).temoignages
        : { ...(contenu[id as keyof typeof contenu] as object), ...assainirChamps(section.champs, valeur) };

    await ecrireContenu({ ...contenu, [id]: propre });
    updateTag(TAG_CONTENU);
    return { ok: true, message: "Modifications enregistrées et visibles sur le site.", valeur: propre };
  } catch (e) {
    console.error("[admin] Enregistrement impossible :", e);
    return {
      ok: false,
      message:
        process.env.VERCEL && !process.env.BLOB_READ_WRITE_TOKEN
          ? "Enregistrement impossible : activez Vercel Blob sur le projet (BLOB_READ_WRITE_TOKEN)."
          : "Enregistrement impossible. Réessayez dans un instant.",
    };
  }
}
