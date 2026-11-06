"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import { z } from "zod";
import {
  changerStatut,
  compteConnecte,
  creerCompte,
  creerReservation,
  fermerSessionClient,
  lireReservation,
  ouvrirSessionClient,
  StockageIndisponible,
  supprimerCompte,
  verifierIdentifiants,
} from "@/lib/comptes";

type Erreurs = Record<string, string | undefined>;
export type EtatFormulaire = { erreur?: string; erreurs?: Erreurs; succes?: string; valeurs?: Record<string, string> };

const MESSAGE_PANNE = "Le service est momentanément indisponible. Réessayez un peu plus tard ou contactez-nous.";

function messagePanne(e: unknown) {
  console.error("[comptes]", e instanceof StockageIndisponible ? e.message : e);
  return { erreur: MESSAGE_PANNE };
}

/** Le retour après connexion se limite à l'espace client : pas de redirection vers un autre site. */
function versEspace(formule: FormDataEntryValue | null): never {
  const f = String(formule ?? "").slice(0, 100);
  redirect(f ? `/mon-espace?formule=${encodeURIComponent(f)}` : "/mon-espace");
}

/* ---------- Limite de tentatives (par serveur) ---------- */

const MAX_TENTATIVES = 10;
const FENETRE_MS = 15 * 60 * 1000;
const tentatives = new Map<string, { nombre: number; debut: number }>();

async function cleTentative(motif: string) {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  return `${motif}:${ip}`;
}
function tropDeTentatives(cle: string) {
  const suivi = tentatives.get(cle);
  if (suivi && Date.now() - suivi.debut > FENETRE_MS) tentatives.delete(cle);
  return (tentatives.get(cle)?.nombre ?? 0) >= MAX_TENTATIVES;
}
function compterTentative(cle: string) {
  const courant = tentatives.get(cle) ?? { nombre: 0, debut: Date.now() };
  tentatives.set(cle, { ...courant, nombre: courant.nombre + 1 });
}

/* ---------- Inscription et connexion ---------- */

const schemaInscription = z.object({
  nom: z.string().trim().min(2, "Indiquez votre nom.").max(100).regex(/^[^\r\n<>]+$/, "Nom invalide."),
  email: z.email("Adresse e-mail invalide.").max(200),
  telephone: z.string().trim().regex(/^\+?[\d\s().-]{8,20}$/, "Numéro de téléphone invalide."),
  motDePasse: z.string().min(8, "8 caractères minimum.").max(200, "Mot de passe trop long."),
  consentement: z.literal("oui", "Votre accord est nécessaire pour créer un compte."),
});

function erreursDe(error: z.ZodError) {
  const erreurs: Erreurs = {};
  for (const issue of error.issues) erreurs[String(issue.path[0])] ??= issue.message;
  return erreurs;
}

export async function inscription(_: EtatFormulaire, formData: FormData): Promise<EtatFormulaire> {
  const valeurs = { nom: String(formData.get("nom") ?? ""), email: String(formData.get("email") ?? ""), telephone: String(formData.get("telephone") ?? "") };
  const resultat = schemaInscription.safeParse({ ...valeurs, motDePasse: formData.get("motDePasse"), consentement: formData.get("consentement") ?? undefined });
  if (!resultat.success) return { erreurs: erreursDe(resultat.error), valeurs };

  const cle = await cleTentative("inscription");
  if (tropDeTentatives(cle)) return { erreur: "Trop de tentatives. Réessayez dans 15 minutes.", valeurs };
  compterTentative(cle);

  let id: string | null;
  try {
    id = await creerCompte(resultat.data);
    if (id) await ouvrirSessionClient(id);
  } catch (e) {
    return { ...messagePanne(e), valeurs };
  }
  if (!id) return { erreurs: { email: "Un compte existe déjà avec cette adresse. Connectez-vous." }, valeurs };
  versEspace(formData.get("formule"));
}

export async function connexionClient(_: EtatFormulaire, formData: FormData): Promise<EtatFormulaire> {
  const email = String(formData.get("email") ?? "").slice(0, 200);
  const motDePasse = String(formData.get("motDePasse") ?? "").slice(0, 200);
  const valeurs = { email };

  const cle = await cleTentative("connexion");
  if (tropDeTentatives(cle)) return { erreur: "Trop de tentatives. Réessayez dans 15 minutes.", valeurs };

  let id: string | null;
  try {
    id = await verifierIdentifiants(email, motDePasse);
    if (id) await ouvrirSessionClient(id);
  } catch (e) {
    return { ...messagePanne(e), valeurs };
  }
  if (!id) {
    compterTentative(cle);
    return { erreur: "E-mail ou mot de passe incorrect.", valeurs };
  }
  tentatives.delete(cle);
  versEspace(formData.get("formule"));
}

export async function deconnexionClient() {
  await fermerSessionClient();
  redirect("/connexion");
}

export async function supprimerMonCompte() {
  const compte = await compteConnecte();
  if (compte) {
    await supprimerCompte(compte.id);
    await fermerSessionClient();
  }
  redirect("/");
}

/* ---------- Réservations ---------- */

/** Prévient l'équipe par e-mail si l'envoi est configuré. Une panne ne bloque pas la réservation. */
async function prevenirEquipe(texte: string) {
  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) return;
  try {
    await new Resend(RESEND_API_KEY).emails.send({
      from: CONTACT_FROM_EMAIL || "Capt One PRECISION <onboarding@resend.dev>",
      to: CONTACT_TO_EMAIL,
      subject: "[Site] Nouvelle réservation",
      text: texte,
    });
  } catch (e) {
    console.error("[reservation] E-mail non envoyé :", e);
  }
}

const aujourdhui = () => new Date().toISOString().slice(0, 10);

const schemaReservation = z.object({
  prestation: z.string().trim().min(1, "Choisissez une prestation.").max(100),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Choisissez une date.")
    .refine((d) => d >= aujourdhui(), "Choisissez une date à venir."),
  lieu: z.string().trim().max(200),
  telephone: z.string().trim().regex(/^\+?[\d\s().-]{8,20}$/, "Numéro de téléphone invalide."),
  message: z.string().trim().max(2000),
});

export async function reserver(_: EtatFormulaire, formData: FormData): Promise<EtatFormulaire> {
  const valeurs = Object.fromEntries(["prestation", "date", "lieu", "telephone", "message"].map((k) => [k, String(formData.get(k) ?? "")]));
  const resultat = schemaReservation.safeParse(valeurs);
  if (!resultat.success) return { erreurs: erreursDe(resultat.error), valeurs };

  try {
    const compte = await compteConnecte();
    if (!compte) redirect("/connexion");
    const r = await creerReservation(compte, resultat.data);
    await prevenirEquipe(
      `Client : ${r.nom}\nE-mail : ${r.email}\nTéléphone : ${r.telephone}\nPrestation : ${r.prestation}\nDate souhaitée : ${r.date}\nLieu : ${r.lieu || "—"}\n\n${r.message}`,
    );
  } catch (e) {
    // redirect() fonctionne en levant une exception : elle doit continuer son chemin.
    if (e instanceof Error && "digest" in e && String(e.digest).startsWith("NEXT_REDIRECT")) throw e;
    return { ...messagePanne(e), valeurs };
  }
  revalidatePath("/mon-espace");
  return { succes: "Votre demande est enregistrée. Nous revenons vers vous pour la confirmer." };
}

export async function annulerMaReservation(formData: FormData) {
  const compte = await compteConnecte();
  const cle = String(formData.get("cle") ?? "");
  // Un client ne peut annuler que ses propres réservations encore en attente.
  if (!compte || !cle.startsWith(`reservations/${compte.id}/`)) return;
  const reservation = await lireReservation(cle);
  if (reservation?.statut !== "en-attente") return;
  await changerStatut(cle, "annulee");
  revalidatePath("/mon-espace");
}
