"use server";

import { Resend } from "resend";
import { z } from "zod";
import { getContenu } from "@/lib/contenu";

export type EtatContact = {
  statut: "initial" | "succes" | "erreur";
  message?: string;
  erreurs?: Partial<Record<"nom" | "email" | "sujet" | "message", string>>;
  valeurs?: Record<string, string>;
};

const schema = z.object({
  nom: z.string().trim().min(2, "Indiquez votre nom.").max(100),
  email: z.email("Adresse e-mail invalide."),
  sujet: z.enum(["developpement", "photographie", "graphisme", "autre"], "Choisissez un sujet."),
  message: z.string().trim().min(10, "Votre message est un peu court (10 caractères minimum).").max(5000),
});

const sujets: Record<string, string> = {
  developpement: "Développement web",
  photographie: "Photographie",
  graphisme: "Graphisme",
  autre: "Autre demande",
};

/**
 * Envoi du formulaire de contact via Resend.
 * Variables d'environnement requises (voir .env.example) :
 *   RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL
 */
export async function envoyerMessage(_: EtatContact, formData: FormData): Promise<EtatContact> {
  const valeurs = Object.fromEntries(
    ["nom", "email", "sujet", "message"].map((k) => [k, String(formData.get(k) ?? "")]),
  );

  // Champ piège invisible : rempli uniquement par les robots.
  if (formData.get("site_web")) {
    return { statut: "succes", message: "Merci, votre message a bien été envoyé." };
  }

  const resultat = schema.safeParse(valeurs);
  if (!resultat.success) {
    const erreurs: EtatContact["erreurs"] = {};
    for (const issue of resultat.error.issues) {
      const champ = issue.path[0] as keyof NonNullable<EtatContact["erreurs"]>;
      erreurs[champ] ??= issue.message;
    }
    return { statut: "erreur", message: "Merci de corriger les champs indiqués.", erreurs, valeurs };
  }

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
    console.error("[contact] RESEND_API_KEY ou CONTACT_TO_EMAIL manquant.");
    return {
      statut: "erreur",
      message: "L'envoi n'est pas encore configuré. Vous pouvez me contacter directement par e-mail ou WhatsApp.",
      valeurs,
    };
  }

  const { nom, email, sujet, message } = resultat.data;
  const { identite } = await getContenu();
  const resend = new Resend(RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: CONTACT_FROM_EMAIL || `Site ${identite.nom} <onboarding@resend.dev>`,
    to: CONTACT_TO_EMAIL,
    replyTo: email,
    subject: `[Site] ${sujets[sujet]} — ${nom}`,
    text: `Nom : ${nom}\nE-mail : ${email}\nSujet : ${sujets[sujet]}\n\n${message}`,
  });

  if (error) {
    console.error("[contact] Échec de l'envoi :", error);
    return {
      statut: "erreur",
      message: "Le message n'a pas pu être envoyé. Réessayez dans un instant ou écrivez-moi directement.",
      valeurs,
    };
  }

  return { statut: "succes", message: "Merci, votre message a bien été envoyé. Je vous réponds rapidement." };
}
