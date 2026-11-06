import type { EtapeParcours } from "@/lib/types";

/**
 * Page À propos — à remplir à partir du CV.
 * Rien n'est inventé : les listes vides affichent un emplacement « à compléter ».
 */

export const aPropos = {
  intro:
    "Présentation personnelle à rédiger ensemble à partir du CV : qui tu es, ce qui relie tes trois métiers, ta façon de travailler.",
  resumeAccueil:
    "Courte présentation du parcours à compléter (2 à 3 phrases), affichée sur la page d'accueil.",
  formation: [] as EtapeParcours[],
  experiences: [] as EtapeParcours[],
  competences: {
    developpement: ["HTML5", "CSS3", "JavaScript", "React", "Angular", "Tailwind CSS"],
    photographie: [] as string[],
    graphisme: [] as string[],
  },
  engagements: [] as string[],
};
