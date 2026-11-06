import type { Media } from "@/lib/types";
import { categoriesGraphisme } from "./graphisme";
import { categoriesPhoto } from "./photographie";

/**
 * Description des champs du tableau de bord.
 * Le formulaire est généré à partir d'ici, et le serveur s'en sert pour vérifier ce qu'il reçoit :
 * rendre un texte modifiable revient à ajouter une ligne dans ce fichier.
 */
export type Champ =
  | { cle: string; label: string; type: "texte" | "zone" | "lien" | "couleur" | "cache"; aide?: string }
  | { cle: string; label: string; type: "identifiant"; source: string; aide?: string }
  | { cle: string; label: string; type: "nombre"; min: number; max: number; aide?: string }
  | { cle: string; label: string; type: "case" | "image" | "images" | "mots"; aide?: string }
  | { cle: string; label: string; type: "choix" | "choixMultiple"; options: { slug: string; label: string }[]; aide?: string }
  | { cle: string; label: string; type: "groupe"; champs: Champ[]; aide?: string }
  | { cle: string; label: string; type: "liste"; champs: Champ[]; modele: Record<string, unknown>; aide?: string };

export type Section = { id: string; titre: string; description: string; apercu: string; champs: Champ[] };

const t = (cle: string, label: string, aide?: string): Champ => ({ cle, label, type: "texte", aide });
const z = (cle: string, label: string, aide?: string): Champ => ({ cle, label, type: "zone", aide });
const l = (cle: string, label: string, aide?: string): Champ => ({ cle, label, type: "lien", aide });
const img = (cle: string, label: string, aide?: string): Champ => ({ cle, label, type: "image", aide });
const imgs = (cle: string, label: string, aide?: string): Champ => ({ cle, label, type: "images", aide });
const coche = (cle: string, label: string): Champ => ({ cle, label, type: "case" });
const mots = (cle: string, label: string, aide = "Un élément par ligne."): Champ => ({ cle, label, type: "mots", aide });
const groupe = (cle: string, label: string, champs: Champ[]): Champ => ({ cle, label, type: "groupe", champs });
const liste = (cle: string, label: string, champs: Champ[], modele: Record<string, unknown>, aide?: string): Champ => ({
  cle,
  label,
  type: "liste",
  champs,
  modele,
  aide,
});

const imageVide = (width = 1600, height = 1200): Media => ({ src: null, alt: "", width, height });
const bouton = (cle: string, label: string) => groupe(cle, label, [t("label", "Texte du bouton"), l("href", "Lien du bouton")]);
const titres = [t("surtitre", "Petit titre"), t("fort", "Titre (en gras)"), t("fin", "Suite du titre (en fin)")];
const carteLien = [t("titre", "Titre"), z("texte", "Texte"), img("image", "Image"), l("href", "Lien")];
const modeleCarteLien = { titre: "", texte: "", image: imageVide(), href: "" };
const etapeParcours = [t("periode", "Période"), t("titre", "Intitulé"), t("structure", "Structure"), z("description", "Description")];
const modeleEtape = { periode: "", titre: "", structure: "", description: "" };

export const sections: Section[] = [
  {
    id: "identite",
    titre: "Identité & contact",
    description: "Le nom du site, l'e-mail, WhatsApp et les réseaux sociaux affichés dans le pied de page.",
    apercu: "/",
    champs: [
      t("nom", "Nom"),
      t("titre", "Activités", "Affiché sous le nom et dans l'onglet du navigateur."),
      z("description", "Description pour Google"),
      t("email", "E-mail"),
      mots("telephones", "Téléphones", "Un numéro par ligne, exemple : +225 07 00 00 00 00"),
      t("whatsapp", "Numéro WhatsApp", "Celui qui reçoit les messages, avec l'indicatif, exemple : 2250700000000"),
      t("localisation", "Ville / pays"),
      liste(
        "reseaux",
        "Réseaux sociaux",
        [t("label", "Nom du réseau"), l("href", "Adresse de la page")],
        { label: "", href: "" },
        "Un réseau sans adresse reste affiché mais n'est pas cliquable.",
      ),
    ],
  },
  {
    id: "accueil",
    titre: "Accueil",
    description: "Diaporama, atouts, services et sections de la page d'accueil.",
    apercu: "/",
    champs: [
      liste(
        "slides",
        "Diaporama",
        [
          t("fin", "Première ligne"),
          t("fort", "Deuxième ligne (en gras)"),
          z("texte", "Texte"),
          img("image", "Image de fond"),
          bouton("bouton1", "Bouton principal"),
          bouton("bouton2", "Bouton secondaire"),
        ],
        { fin: "", fort: "", texte: "", image: imageVide(2400, 1200), bouton1: { label: "", href: "" }, bouton2: { label: "", href: "" } },
      ),
      liste("atouts", "Atouts", [t("titre", "Titre"), z("texte", "Texte")], { titre: "", texte: "" }),
      groupe("apropos", "À propos", [
        ...titres,
        z("texte", "Texte"),
        mots("points", "Points forts"),
        img("image", "Photo"),
        z("citation", "Citation (facultatif)"),
        t("auteur", "Auteur de la citation"),
      ]),
      groupe("services", "Services", [...titres, liste("liste", "Liste des services", carteLien, modeleCarteLien)]),
      groupe("contact", "Bloc de contact", [
        ...titres,
        img("image", "Photo"),
        t("chiffre", "Chiffre clé (facultatif)", "Exemple : 200+"),
        t("chiffreLabel", "Légende du chiffre"),
      ]),
      groupe("bandeau", "Bandeau d'appel", [t("surtitre", "Petit texte"), t("titre", "Titre"), bouton("bouton", "Bouton")]),
      groupe("projets", "Titre des réalisations", titres),
      groupe("pourquoi", "Pourquoi nous choisir", [
        ...titres,
        z("texte", "Texte"),
        img("image", "Image"),
        liste(
          "barres",
          "Barres de pourcentage (facultatif)",
          [t("label", "Libellé"), { cle: "valeur", label: "Pourcentage", type: "nombre", min: 0, max: 100 }],
          { label: "", valeur: 80 },
        ),
      ]),
      groupe("equipe", "Équipe (masquée tant qu'elle est vide)", [
        ...titres,
        liste("membres", "Membres", [t("nom", "Nom"), t("role", "Fonction"), img("photo", "Photo")], { nom: "", role: "", photo: imageVide(800, 1000) }),
      ]),
      imgs("partenaires", "Logos des partenaires (masqués tant qu'il n'y en a pas)"),
      groupe("univers", "Nos univers", [...titres, z("texte", "Texte"), liste("liste", "Cartes", carteLien, modeleCarteLien)]),
    ],
  },
  {
    id: "developpement",
    titre: "Développement",
    description: "Présentation, projets, services et technologies.",
    apercu: "/developpement",
    champs: [
      groupe("hero", "Haut de page", [
        t("titre", "Titre"),
        t("badge", "Badge"),
        z("texte", "Texte"),
        img("image", "Grande image"),
        img("portrait", "Photo ronde"),
        bouton("bouton1", "Bouton principal"),
        bouton("bouton2", "Bouton secondaire"),
      ]),
      t("realisationsTitre", "Titre de la section projets"),
      liste(
        "projets",
        "Projets",
        [
          t("nom", "Nom"),
          { cle: "slug", label: "Adresse de la page", type: "identifiant", source: "nom", aide: "Créée à partir du nom si elle est vide." },
          t("type", "Type (ex. Application web)"),
          t("annee", "Année"),
          z("resume", "Résumé"),
          z("presentation", "Présentation"),
          z("problematique", "Problématique"),
          mots("objectifs", "Objectifs"),
          mots("technologies", "Technologies"),
          z("role", "Rôle"),
          z("resultat", "Résultat"),
          img("couverture", "Image principale"),
          imgs("captures", "Captures supplémentaires"),
          l("lienDemo", "Lien du site"),
          l("lienCode", "Lien du code"),
          coche("enAvant", "Mettre en avant sur l'accueil"),
        ],
        { nom: "", slug: "", type: "", annee: "", resume: "", presentation: "", problematique: "", objectifs: [], technologies: [], role: "", resultat: "", couverture: imageVide(1600, 1000), captures: [], lienDemo: "", lienCode: "", enAvant: false },
      ),
      groupe("services", "Services", [t("titre", "Titre"), liste("liste", "Services", [t("titre", "Titre"), z("texte", "Texte")], { titre: "", texte: "" })]),
      groupe("parcours", "Expériences (masquées tant qu'il n'y en a pas)", [
        t("titre", "Titre"),
        liste("etapes", "Expériences", [t("periode", "Période"), t("structure", "Structure"), t("role", "Fonction"), mots("points", "Missions")], { periode: "", structure: "", role: "", points: [] }),
      ]),
      groupe("technologies", "Technologies", [t("titre", "Titre"), mots("liste", "Technologies")]),
      groupe("process", "Méthode de travail", [t("titre", "Titre"), liste("etapes", "Étapes", [t("titre", "Titre"), z("texte", "Texte")], { titre: "", texte: "" })]),
      t("contactTitre", "Titre du bloc de contact"),
    ],
  },
  {
    id: "photographie",
    titre: "Photographie",
    description: "Diaporama, galerie, formules et séries.",
    apercu: "/photographie",
    champs: [
      liste("slides", "Diaporama", [t("categorie", "Catégorie"), t("titre", "Titre"), t("credit", "Mention"), img("image", "Image")], { categorie: "", titre: "", credit: "", image: imageVide(2400, 1400) }),
      groupe("citation", "Citation", [z("texte", "Texte"), t("signature", "Signature")]),
      liste(
        "photos",
        "Galerie",
        [
          { cle: "id", label: "", type: "cache" },
          { cle: "categorie", label: "Catégorie", type: "choix", options: categoriesPhoto },
          img("image", "Photo"),
          t("legende", "Légende (facultatif)"),
        ],
        { id: "", categorie: "portrait", image: imageVide(1600, 2000), legende: "" },
      ),
      groupe("forfaits", "Formules", [
        t("titre", "Titre"),
        liste(
          "liste",
          "Formules",
          [t("nom", "Nom"), img("image", "Image"), mots("points", "Contenu"), t("prix", "Prix", "Exemple : Sur devis, ou 50 000 FCFA")],
          { nom: "", image: imageVide(1200, 800), points: [], prix: "Sur devis" },
        ),
      ]),
      groupe("bandeau", "Bandeau d'appel", [t("titre", "Titre"), bouton("bouton", "Bouton")]),
      t("bandeTitre", "Titre de la bande de photos"),
      liste(
        "series",
        "Séries",
        [
          t("titre", "Titre"),
          { cle: "slug", label: "Adresse de la page", type: "identifiant", source: "titre" },
          { cle: "categorie", label: "Catégorie", type: "choix", options: categoriesPhoto },
          t("annee", "Année"),
          t("lieu", "Lieu"),
          z("texte", "Texte"),
          img("couverture", "Couverture"),
          imgs("photos", "Photos"),
          coche("exemple", "Contenu de démonstration (masqué de la page Photographie)"),
          coche("enAvant", "Mettre en avant sur l'accueil"),
        ],
        { titre: "", slug: "", categorie: "portrait", annee: "", lieu: "", texte: "", couverture: imageVide(2400, 1600), photos: [], exemple: false, enAvant: false },
      ),
    ],
  },
  {
    id: "graphisme",
    titre: "Graphisme",
    description: "Présentation, créations, savoir-faire et domaines d'expertise. Les projets s'ajoutent aussi tout seuls à l'éventail.",
    apercu: "/graphisme",
    champs: [
      groupe("hero", "Haut de page", [t("fenetre", "Nom de la fenêtre"), t("commande", "Commande affichée"), t("phrase", "Phrase de bienvenue"), mots("mots", "Mots en arrière-plan")]),
      groupe("apropos", "À propos", [t("surtitre", "Petit titre"), t("titre", "Titre", "Le dernier mot est mis en valeur."), z("texte", "Texte"), img("image", "Image")]),
      groupe("demarche", "Démarche", [
        t("titre", "Titre"),
        liste("etapes", "Étapes", [t("periode", "Repère"), t("titre", "Titre"), z("texte", "Texte")], { periode: "", titre: "", texte: "" }),
      ]),
      groupe("savoirFaire", "Savoir-faire", [
        t("fort", "Titre foncé"),
        t("pale", "Titre clair"),
        liste("cartes", "Cartes", [t("periode", "Repère"), t("titre", "Titre"), t("sousTitre", "Sous-titre"), z("texte", "Texte")], { periode: "", titre: "", sousTitre: "", texte: "" }),
      ]),
      groupe("creations", "Créations visuelles", [t("fort", "Titre"), t("accent", "Titre en couleur"), z("texte", "Texte")]),
      groupe("realisations", "Titre des projets", [t("fort", "Titre foncé"), t("pale", "Titre clair")]),
      liste(
        "projets",
        "Projets",
        [
          t("titre", "Titre"),
          { cle: "slug", label: "Adresse de la page", type: "identifiant", source: "titre" },
          t("client", "Client"),
          t("annee", "Année"),
          { cle: "categories", label: "Catégories", type: "choixMultiple", options: categoriesGraphisme },
          z("resume", "Résumé"),
          z("contexte", "Contexte"),
          z("brief", "Brief"),
          z("concept", "Concept"),
          z("choixGraphiques", "Choix graphiques"),
          liste("couleurs", "Couleurs", [t("nom", "Nom"), { cle: "hex", label: "Couleur", type: "couleur" }], { nom: "", hex: "#000000" }),
          mots("typographies", "Typographies"),
          mots("supports", "Supports"),
          img("visuelPrincipal", "Visuel principal"),
          imgs("declinaisons", "Déclinaisons"),
          coche("exemple", "Contenu de démonstration"),
          coche("enAvant", "Mettre en avant sur l'accueil"),
        ],
        { titre: "", slug: "", client: "", annee: "", categories: [], resume: "", contexte: "", brief: "", concept: "", choixGraphiques: "", couleurs: [], typographies: [], supports: [], visuelPrincipal: imageVide(2000, 1400), declinaisons: [], exemple: false, enAvant: false },
      ),
      groupe("outils", "Domaines d'expertise", [
        t("fort", "Titre foncé"),
        t("pale", "Titre clair"),
        z("texte", "Texte"),
        liste("groupes", "Groupes", [t("nom", "Nom"), mots("elements", "Éléments")], { nom: "", elements: [] }),
      ]),
      groupe("contact", "Bloc de contact", [t("titre", "Titre"), z("texte", "Texte")]),
    ],
  },
  {
    id: "temoignages",
    titre: "Témoignages",
    description: "Affichés sur l'accueil, Développement et Photographie. La section reste masquée tant qu'il n'y en a pas.",
    apercu: "/",
    champs: [],
  },
  {
    id: "aPropos",
    titre: "À propos",
    description: "Présentation, parcours et compétences.",
    apercu: "/a-propos",
    champs: [
      z("intro", "Présentation"),
      liste("experiences", "Expériences", etapeParcours, modeleEtape),
      liste("formation", "Formation", etapeParcours, modeleEtape),
      groupe("competences", "Compétences", [mots("developpement", "Développement"), mots("photographie", "Photographie"), mots("graphisme", "Graphisme")]),
      mots("engagements", "Engagements"),
      imgs("photos", "Photos (les 2 premières sont affichées)"),
    ],
  },
];

/** Les témoignages sont une liste à la racine du contenu, et non un objet. */
export const champTemoignages: Champ = liste(
  "temoignages",
  "Témoignages",
  [t("nom", "Nom"), t("role", "Fonction"), z("texte", "Témoignage"), img("photo", "Photo")],
  { nom: "", role: "", texte: "", photo: imageVide(400, 400) },
);
