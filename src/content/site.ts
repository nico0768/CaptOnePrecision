import type { Contenu } from "@/lib/types";

/**
 * Réglages techniques fixes du site.
 * Le nom, les coordonnées et les textes se modifient depuis le tableau de bord (/admin) :
 * leurs valeurs initiales sont dans `src/content/defaut.ts`.
 */
export const site = {
  // URL du site en production. Sur Vercel, définir NEXT_PUBLIC_SITE_URL.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),

  // Déposer le fichier dans public/cv/ puis passer `disponible` à true.
  cv: {
    href: "/cv/cv-yao-nicodeme.pdf",
    disponible: false,
  },
};

export const navigation = [
  { label: "Accueil", href: "/" },
  { label: "Développement", href: "/developpement", univers: "dev" },
  { label: "Photographie", href: "/photographie", univers: "photo" },
  { label: "Graphisme", href: "/graphisme", univers: "graphisme" },
  { label: "À propos", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
] as const;

type Identite = Contenu["identite"];

export function lienWhatsapp(identite: Identite, message = `Bonjour ${identite.nom}, je vous contacte depuis votre site.`) {
  const numero = identite.whatsapp.replace(/\D/g, "");
  if (!numero) return null;
  return `https://wa.me/${numero}?text=${encodeURIComponent(message)}`;
}

/** WhatsApp puis les autres réseaux. Un réseau sans lien reste affiché, sans être cliquable. */
export function reseauxAffiches(identite: Identite): { label: string; href: string }[] {
  return [{ label: "WhatsApp", href: lienWhatsapp(identite) ?? "" }, ...identite.reseaux];
}
