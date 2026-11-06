import type { ProjetDev } from "@/lib/types";

/**
 * Projets de développement.
 *
 * Règle : ne renseigner que des informations réelles.
 * Les textes « À compléter » sont des emplacements à remplacer.
 * Les liens vides ne sont pas affichés.
 *
 * Les images vont dans public/images/developpement/<slug>/
 */

export const competencesDev = [
  "HTML5",
  "CSS3",
  "JavaScript",
  "React",
  "Angular",
  "Tailwind CSS",
];

export const projetsDev: ProjetDev[] = [
  {
    slug: "aukaz",
    nom: "AUKAZ",
    type: "À compléter",
    resume: "Résumé du projet à compléter.",
    presentation: "Présentation du projet à compléter.",
    problematique: "Problématique à compléter.",
    objectifs: [],
    technologies: [],
    role: "Rôle à compléter.",
    resultat: "Résultat à compléter.",
    couverture: {
      src: null,
      alt: "Aperçu d'AUKAZ",
      width: 1600,
      height: 1000,
      todo: "Capture principale d'AUKAZ (16:10)",
    },
    captures: [
      {
        src: null,
        alt: "AUKAZ — version mobile",
        width: 750,
        height: 1500,
        todo: "Capture mobile",
      },
    ],
    lienDemo: "",
    lienCode: "",
  },
];
