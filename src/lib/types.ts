/**
 * Types du contenu du portfolio.
 *
 * Tout le contenu (projets, photos, textes) vit dans `src/content/`.
 * Pour ajouter un projet : ajouter un objet dans le fichier correspondant,
 * aucune page n'est à modifier.
 */

export type Univers = "dev" | "photo" | "graphisme";

/**
 * Une image du site.
 * `src: null` = image temporaire : un emplacement identifié s'affiche
 * à la place, avec la mention `alt` et la consigne `todo`.
 */
export type Media = {
  src: string | null;
  alt: string;
  width: number;
  height: number;
  /** Consigne affichée sur l'emplacement temporaire. */
  todo?: string;
};

export type Lien = { label: string; href: string };

/* ---------- Développement ---------- */

export type ProjetDev = {
  slug: string;
  nom: string;
  /** Type affiché sur la carte (ex. « Application web »). */
  type: string;
  annee?: string;
  resume: string;
  presentation: string;
  problematique: string;
  objectifs: string[];
  technologies: string[];
  role: string;
  resultat: string;
  couverture: Media;
  captures: Media[];
  lienDemo?: string;
  lienCode?: string;
  /** Mis en avant sur la page d'accueil. */
  enAvant?: boolean;
};

/* ---------- Photographie ---------- */

export type CategoriePhoto = {
  slug: string;
  label: string;
};

export type Photo = {
  id: string;
  categorie: string;
  image: Media;
  legende?: string;
  /** Série à laquelle la photo appartient (facultatif). */
  serie?: string;
};

export type SeriePhoto = {
  slug: string;
  titre: string;
  categorie: string;
  annee?: string;
  lieu?: string;
  texte: string;
  couverture: Media;
  photos: Media[];
  /** Contenu de démonstration à remplacer avant la mise en ligne. */
  exemple?: boolean;
  enAvant?: boolean;
};

/* ---------- Graphisme ---------- */

export type CategorieGraphisme = {
  slug: string;
  label: string;
};

export type Couleur = { nom: string; hex: string };

export type ProjetGraphisme = {
  slug: string;
  titre: string;
  client?: string;
  annee?: string;
  categories: string[];
  resume: string;
  contexte: string;
  brief: string;
  concept: string;
  choixGraphiques: string;
  couleurs: Couleur[];
  typographies: string[];
  supports: string[];
  visuelPrincipal: Media;
  declinaisons: Media[];
  exemple?: boolean;
  enAvant?: boolean;
};

/* ---------- À propos ---------- */

export type EtapeParcours = {
  periode: string;
  titre: string;
  structure: string;
  description?: string;
};

/* ---------- Contenu modifiable depuis le tableau de bord ---------- */

export type Bouton = { label: string; href: string };
export type Temoignage = { nom: string; role: string; texte: string; photo: Media };
export type TitreDouble = { surtitre: string; fort: string; fin: string };

export type Contenu = {
  identite: {
    nom: string;
    titre: string;
    description: string;
    email: string;
    telephones: string[];
    whatsapp: string;
    localisation: string;
    reseaux: Lien[];
  };
  temoignages: Temoignage[];
  accueil: {
    slides: { fin: string; fort: string; texte: string; image: Media; bouton1: Bouton; bouton2: Bouton }[];
    atouts: { titre: string; texte: string }[];
    apropos: TitreDouble & { texte: string; points: string[]; citation: string; auteur: string; image: Media };
    services: TitreDouble & { liste: { titre: string; texte: string; image: Media; href: string }[] };
    contact: TitreDouble & { image: Media; chiffre: string; chiffreLabel: string };
    bandeau: { surtitre: string; titre: string; bouton: Bouton };
    projets: TitreDouble;
    pourquoi: TitreDouble & { texte: string; image: Media; barres: { label: string; valeur: number }[] };
    equipe: TitreDouble & { membres: { nom: string; role: string; photo: Media }[] };
    partenaires: Media[];
    univers: TitreDouble & { texte: string; liste: { titre: string; texte: string; image: Media; href: string }[] };
  };
  developpement: {
    hero: { titre: string; badge: string; texte: string; image: Media; portrait: Media; bouton1: Bouton; bouton2: Bouton };
    realisationsTitre: string;
    services: { titre: string; liste: { titre: string; texte: string }[] };
    parcours: { titre: string; etapes: { periode: string; structure: string; role: string; points: string[] }[] };
    technologies: { titre: string; liste: string[] };
    process: { titre: string; etapes: { titre: string; texte: string }[] };
    contactTitre: string;
    projets: ProjetDev[];
  };
  photographie: {
    slides: { categorie: string; titre: string; credit: string; image: Media }[];
    citation: { texte: string; signature: string };
    forfaits: { titre: string; liste: { nom: string; image: Media; points: string[]; prix: string }[] };
    bandeau: { titre: string; bouton: Bouton };
    bandeTitre: string;
    photos: Photo[];
    series: SeriePhoto[];
  };
  graphisme: {
    hero: { fenetre: string; commande: string; phrase: string; mots: string[] };
    apropos: { surtitre: string; titre: string; texte: string; image: Media };
    demarche: { titre: string; etapes: { periode: string; titre: string; texte: string }[] };
    savoirFaire: { fort: string; pale: string; cartes: { periode: string; titre: string; sousTitre: string; texte: string }[] };
    creations: { fort: string; accent: string; texte: string };
    realisations: { fort: string; pale: string };
    outils: { fort: string; pale: string; texte: string; groupes: { nom: string; elements: string[] }[] };
    contact: { titre: string; texte: string };
    projets: ProjetGraphisme[];
  };
  aPropos: {
    intro: string;
    formation: EtapeParcours[];
    experiences: EtapeParcours[];
    competences: { developpement: string[]; photographie: string[]; graphisme: string[] };
    engagements: string[];
    photos: Media[];
  };
};
