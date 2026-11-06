import type { CategorieGraphisme, ProjetGraphisme } from "@/lib/types";

/**
 * Graphisme.
 * Les images vont dans public/images/graphisme/
 * Les projets se modifient aussi depuis le tableau de bord (/admin).
 * Les champs vides (concept, couleurs…) ne sont pas affichés sur la fiche du projet.
 */

export const categoriesGraphisme: CategorieGraphisme[] = [
  { slug: "identite-visuelle", label: "Identité visuelle" },
  { slug: "logo", label: "Logo" },
  { slug: "charte-graphique", label: "Charte graphique" },
  { slug: "affiche", label: "Affiche" },
  { slug: "flyer", label: "Flyer" },
  { slug: "supports", label: "Supports de communication" },
  { slug: "branding", label: "Branding" },
  { slug: "editorial", label: "Design éditorial" },
  { slug: "reseaux-sociaux", label: "Réseaux sociaux" },
  { slug: "packaging", label: "Packaging" },
];

export const projetsGraphisme: ProjetGraphisme[] = [
  {
    slug: "veillee-de-priere",
    titre: "Veillée de prière",
    client: "AEECI — Région Abidjan-Est",
    annee: "2026",
    categories: ["affiche"],
    resume: "Affiche de la Grande veillée de prière et de combat spirituel de l'Association des Éclaireurs et Éclaireuses Évangéliques de Côte d'Ivoire.",
    contexte:
      "Veillée organisée le 23 octobre 2026 par le commissariat régional en charge de la spiritualité, sur le thème « Scout de la RAE, sois un témoignage pour la gloire du Seigneur ».",
    brief: "",
    concept: "",
    choixGraphiques: "",
    couleurs: [],
    typographies: [],
    supports: ["Affiche"],
    visuelPrincipal: {
      src: "/images/graphisme/affiche-veillee-priere.jpg",
      alt: "Affiche de la Grande veillée de prière et de combat spirituel : un scout à genoux, en prière, dans une lumière bleue et orange",
      width: 2137,
      height: 2400,
    },
    declinaisons: [],
    enAvant: true,
  },
  {
    slug: "formation-sur-les-odd",
    titre: "Formation sur les ODD",
    client: "AEECI — Région Abidjan-Est",
    annee: "2026",
    categories: ["affiche", "reseaux-sociaux"],
    resume: "Affiche d'une journée de formation scoute sur les objectifs de développement durable.",
    contexte:
      "Formation organisée le 25 avril 2026 par le commissariat régional en charge des ODD, autour de trois modules et de leurs intervenants.",
    brief: "",
    concept: "",
    choixGraphiques: "",
    couleurs: [],
    typographies: [],
    supports: ["Affiche"],
    visuelPrincipal: {
      src: "/images/graphisme/formation-sur-les-odd.jpg",
      alt: "Affiche « Formation sur les ODD » présentant le programme et les trois intervenants en tenue scoute",
      width: 1400,
      height: 1400,
    },
    declinaisons: [],
    enAvant: true,
  },
  {
    slug: "flyer-aukaz-acheteur",
    titre: "Flyer AUKAZ",
    client: "AUKAZ",
    categories: ["flyer", "supports"],
    resume: "Flyer recto verso destiné aux acheteurs de voitures d'occasion à Abidjan.",
    contexte: "Un support qui présente le parcours AUKAZ à l'acheteur, autour d'un message simple : ne plus jamais verser d'acompte à un inconnu.",
    brief: "",
    concept: "",
    choixGraphiques: "",
    couleurs: [],
    typographies: [],
    supports: ["Flyer recto verso"],
    visuelPrincipal: {
      src: "/images/graphisme/flyer-aukaz-acheteur.jpg",
      alt: "Flyer AUKAZ recto verso posé sur un bureau, avec le message « Ne versez plus jamais d'acompte à un inconnu »",
      width: 2400,
      height: 1600,
    },
    declinaisons: [],
    enAvant: true,
  },
  {
    slug: "baloo-t-appelle",
    titre: "Baloo t'appelle",
    client: "AEECI — Région Abidjan-Est",
    annee: "2026",
    categories: ["affiche"],
    resume: "Affiche d'un rassemblement de la branche jaune, construite autour du personnage de Baloo.",
    contexte: "Une affiche conçue pour inviter louveteaux et chefs de meute à un rassemblement, du 30 avril au 2 mai 2026.",
    brief: "",
    concept: "",
    choixGraphiques: "",
    couleurs: [],
    typographies: [],
    supports: ["Affiche"],
    visuelPrincipal: {
      src: "/images/graphisme/projet-scout-baloo.jpg",
      alt: "Affiche « Baloo t'appelle… es-tu prêt à répondre ? » avec un ours souriant dans une forêt lumineuse",
      width: 1400,
      height: 1400,
    },
    declinaisons: [],
    enAvant: true,
  },
  {
    slug: "gilet-staff-media",
    titre: "Gilet Staff Média",
    annee: "2026",
    categories: ["supports"],
    resume: "Gilet d'identification pour une équipe média, présenté en maquette recto verso.",
    contexte: "",
    brief: "",
    concept: "",
    choixGraphiques: "",
    couleurs: [],
    typographies: [],
    supports: ["Gilet"],
    visuelPrincipal: {
      src: "/images/graphisme/gilet-staff-media.jpg",
      alt: "Maquette d'un gilet bleu marine à bandes réfléchissantes : le dos porte l'inscription « Staff Media », le devant deux logos",
      width: 2000,
      height: 1400,
    },
    declinaisons: [],
  },
];

export function labelCategorieGraphisme(slug: string) {
  return categoriesGraphisme.find((c) => c.slug === slug)?.label ?? slug;
}
