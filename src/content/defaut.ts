import type { Contenu, Media } from "@/lib/types";
import { aPropos } from "./a-propos";
import { competencesDev, projetsDev } from "./developpement";
import { projetsGraphisme } from "./graphisme";
import { photos, seriesPhoto } from "./photographie";

const image = (todo: string, alt: string, width = 1600, height = 1200): Media => ({ src: null, alt, width, height, todo });

/** Image déposée dans public/images/. */
const photo = (chemin: string, alt: string, width: number, height: number): Media => ({ src: `/images/${chemin}`, alt, width, height });

// Photo libre de droits (Unsplash), à remplacer par une image de vos projets web.
const temporaireDev = photo("accueil/temporaire-developpement.jpg", "Ordinateur portable affichant du code sur un bureau", 2400, 1200);
const flyer = photo("graphisme/flyer-aukaz-acheteur.jpg", "Flyer AUKAZ recto verso posé sur un bureau", 2400, 1600);
const affiche = photo("graphisme/affiche-veillee-priere.jpg", "Affiche de la Grande veillée de prière : un scout à genoux dans une lumière bleue et orange", 2137, 2400);

/**
 * Contenu initial du site. Le tableau de bord (/admin) enregistre ses modifications
 * à part : ce fichier sert de valeur de départ et de secours.
 */
export const contenuParDefaut: Contenu = {
  identite: {
    nom: "Capt One PRECISION",
    titre: "Développement web · Photographie · Graphisme",
    description:
      "Capt One PRECISION réunit le développement web, la photographie et le graphisme pour donner à votre image la précision qu'elle mérite.",
    email: "captoneprecision@gmail.com",
    telephones: ["+225 07 68 84 71 69", "+225 07 78 15 74 29", "+225 07 08 49 09 02", "+225 07 99 13 32 87"],
    whatsapp: "2250768847169",
    localisation: "",
    reseaux: [
      { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61559778881079" },
      { label: "TikTok", href: "https://www.tiktok.com/@co.precision" },
      { label: "Behance", href: "https://www.behance.net/gallery/243238585/Mon-Portfolio" },
    ],
  },
  temoignages: [],
  accueil: {
    slides: [
      {
        fin: "Capt One",
        fort: "PRECISION",
        texte: "Sites web, photographies et identités visuelles : un seul interlocuteur pour donner à votre image la précision qu'elle mérite.",
        image: photo("accueil/diapo-marque.jpg", "Vidéaste avec sa caméra sur stabilisateur, sur le site d'un événement en plein air", 2400, 1200),
        bouton1: { label: "Nos services", href: "#services" },
        bouton2: { label: "Nous contacter", href: "/contact" },
      },
      {
        fin: "Des sites web",
        fort: "rapides et accessibles",
        texte: "Des interfaces claires, pensées pour vos visiteurs et faciles à faire évoluer.",
        image: temporaireDev,
        bouton1: { label: "Développement", href: "/developpement" },
        bouton2: { label: "Nous contacter", href: "/contact" },
      },
      {
        fin: "Des photographies",
        fort: "qui racontent l'instant",
        texte: "Portraits, mariages, événements et reportages, avec une attention constante portée à la lumière.",
        image: photo("accueil/diapo-photographie.jpg", "Groupe de femmes riant ensemble devant un mur de briques", 2400, 1200),
        bouton1: { label: "Photographie", href: "/photographie" },
        bouton2: { label: "Nous contacter", href: "/contact" },
      },
      {
        fin: "Une identité",
        fort: "qui vous ressemble",
        texte: "Logos, chartes graphiques, affiches et supports de communication cohérents.",
        image: photo("accueil/diapo-graphisme.jpg", "Flyer AUKAZ recto verso posé sur un bureau", 2400, 1200),
        bouton1: { label: "Graphisme", href: "/graphisme" },
        bouton2: { label: "Nous contacter", href: "/contact" },
      },
    ],
    atouts: [
      { titre: "Le sens du détail", texte: "Chaque pixel, chaque cadrage et chaque couleur sont réfléchis." },
      { titre: "Trois métiers", texte: "Le web, l'image et le graphisme au service d'un même projet." },
      { titre: "Un interlocuteur", texte: "Un seul contact, du premier échange à la livraison." },
      { titre: "Un suivi clair", texte: "Vous savez où en est votre projet à chaque étape." },
    ],
    apropos: {
      surtitre: "À propos",
      fort: "La précision",
      fin: "au service de votre image",
      texte:
        "Capt One PRECISION accompagne les particuliers, les entreprises et les institutions qui veulent une image soignée et cohérente, en ligne comme sur papier.",
      points: [
        "Des sites web clairs, rapides et accessibles",
        "Des photographies pensées pour durer",
        "Des identités visuelles cohérentes sur tous les supports",
        "Un accompagnement du brief à la livraison",
      ],
      citation: "",
      auteur: "",
      image: photo("photographie/cj6a2659.jpg", "Caméra sur stabilisateur filmant une femme en chemise rose", 1600, 2400),
    },
    services: {
      surtitre: "Services",
      fort: "Ce que nous faisons",
      fin: "pour votre projet",
      liste: [
        { titre: "Sites web", texte: "Sites vitrines et applications web modernes.", href: "/developpement", image: temporaireDev },
        { titre: "Mariages & événements", texte: "Les moments importants, racontés en images.", href: "/photographie", image: photo("photographie/cj6a2578.jpg", "Jeunes mariés enlacés en extérieur", 1600, 2400) },
        { titre: "Portraits & corporate", texte: "Des portraits et des images pour votre entreprise.", href: "/photographie", image: photo("photographie/cj6a4361.jpg", "Portrait d'une femme aux tresses rousses, souriante", 1600, 2400) },
        { titre: "Identité visuelle", texte: "Logos, chartes graphiques et branding.", href: "/graphisme", image: image("Image : identité visuelle", "Service d'identité visuelle") },
        { titre: "Supports de communication", texte: "Affiches, flyers et design éditorial.", href: "/graphisme", image: flyer },
        { titre: "Réseaux sociaux", texte: "Des visuels cohérents pour vos publications.", href: "/graphisme", image: affiche },
      ],
    },
    contact: {
      surtitre: "Contact",
      fort: "Parlons de votre projet,",
      fin: "nous vous répondons rapidement",
      image: photo("photographie/cj6a2683.jpg", "Portrait d'une femme souriante en chemise rose", 1600, 2400),
      chiffre: "",
      chiffreLabel: "",
    },
    bandeau: {
      surtitre: "Une idée, un événement, une marque à lancer ?",
      titre: "Donnons-lui l'image qu'elle mérite",
      bouton: { label: "Nous contacter", href: "/contact" },
    },
    projets: { surtitre: "Réalisations", fort: "Nos derniers projets", fin: "web, photo et graphisme" },
    pourquoi: {
      surtitre: "Pourquoi nous choisir",
      fort: "Une seule équipe,",
      fin: "une image cohérente",
      texte:
        "Votre site, vos photographies et vos supports parlent le même langage, car ils sont pensés ensemble dès le départ.",
      image: photo("photographie/cj6a2687.jpg", "Groupe de femmes joyeuses, mains levées", 2400, 1600),
      barres: [],
    },
    equipe: { surtitre: "Équipe", fort: "Notre équipe", fin: "à votre service", membres: [] },
    partenaires: [],
    univers: {
      surtitre: "Nos univers",
      fort: "Explorez",
      fin: "nos trois métiers",
      texte: "Chaque métier a son propre espace, avec ses réalisations et sa manière de travailler.",
      liste: [
        { titre: "Développement", texte: "Des interfaces claires, rapides et accessibles.", href: "/developpement", image: temporaireDev },
        { titre: "Photographie", texte: "L'instant et la lumière, du portrait au reportage.", href: "/photographie", image: photo("photographie/cj6a2667.jpg", "Groupe de femmes posant dans un salon au mur de briques", 2400, 1600) },
        { titre: "Graphisme", texte: "Des identités et des supports qui marquent les esprits.", href: "/graphisme", image: flyer },
      ],
    },
  },
  developpement: {
    hero: {
      titre: "Transformer vos idées en produits numériques",
      badge: "Disponible pour vos projets",
      texte: "Des interfaces claires, rapides et accessibles, conçues pour vos utilisateurs et pour durer.",
      image: image("Capture d'un projet (16:10)", "Aperçu d'un projet de développement", 1600, 1000),
      portrait: image("Photo ronde", "Portrait", 600, 600),
      bouton1: { label: "Voir les projets", href: "#projets" },
      bouton2: { label: "Démarrer un projet", href: "#contact" },
    },
    realisationsTitre: "Derrière les écrans",
    services: {
      titre: "Des solutions adaptées à vos besoins",
      liste: [
        { titre: "Sites vitrines", texte: "Une présence en ligne claire et professionnelle, optimisée pour le référencement et les mobiles." },
        { titre: "Applications web", texte: "Des interfaces riches et fluides en React ou Angular, connectées à vos services." },
        { titre: "Intégration d'interfaces", texte: "Vos maquettes transformées en pages fidèles, rapides et accessibles." },
      ],
    },
    parcours: { titre: "Expériences", etapes: [] },
    technologies: { titre: "Les technologies que nous utilisons", liste: competencesDev },
    process: {
      titre: "De l'idée à la mise en ligne",
      etapes: [
        { titre: "Écoute", texte: "Comprendre votre besoin, vos utilisateurs et vos objectifs." },
        { titre: "Maquette", texte: "Valider ensemble la structure et l'apparence des pages." },
        { titre: "Développement", texte: "Construire un site rapide, accessible et facile à faire évoluer." },
        { titre: "Mise en ligne", texte: "Publier, vérifier et vous remettre les clés du projet." },
      ],
    },
    contactTitre: "Transformons votre idée en réalité",
    projets: projetsDev,
  },
  photographie: {
    slides: [
      { categorie: "Portrait", titre: "L'instant, la lumière", credit: "Capt One PRECISION", image: photo("photographie/diapo-portrait.jpg", "Vidéaste souriant, caméra sur stabilisateur à la main", 2400, 1400) },
      { categorie: "Mariage", titre: "Vos plus beaux jours", credit: "Capt One PRECISION", image: photo("photographie/diapo-mariage.jpg", "Jeunes mariés enlacés en extérieur", 2400, 1400) },
      { categorie: "Séance de groupe", titre: "Des moments qui restent", credit: "Capt One PRECISION", image: photo("photographie/diapo-groupe.jpg", "Groupe de femmes joyeuses, mains levées, devant un mur de briques", 2400, 1400) },
    ],
    citation: {
      texte: "« Des images pensées pour durer, avec une attention constante portée à la lumière et aux émotions. »",
      signature: "Capt One PRECISION",
    },
    forfaits: {
      titre: "Nos formules photo",
      liste: [
        { nom: "Portrait", image: photo("photographie/cj6a4302.jpg", "Portrait d'une femme en blazer bleu marine", 1600, 2400), points: ["Préparation de la séance", "Prise de vue", "Retouche et livraison numérique"], prix: "Sur devis" },
        { nom: "Événement", image: photo("photographie/dsc00418.jpg", "Vidéaste pendant un événement en plein air", 2400, 1600), points: ["Repérage du lieu", "Couverture de l'événement", "Sélection et retouche"], prix: "Sur devis" },
        { nom: "Mariage", image: photo("photographie/cj6a2578.jpg", "Jeunes mariés enlacés en extérieur", 1600, 2400), points: ["Rencontre préalable", "Reportage de la journée", "Galerie privée en ligne"], prix: "Sur devis" },
        { nom: "Entreprise", image: photo("photographie/cj6a4294.jpg", "Femme en blazer bleu marine, bras croisés", 1600, 2400), points: ["Portraits d'équipe", "Images de vos locaux", "Droits d'usage adaptés"], prix: "Sur devis" },
      ],
    },
    bandeau: { titre: "Un projet photo avec Capt One PRECISION ?", bouton: { label: "Nous contacter", href: "/contact" } },
    bandeTitre: "Dernières images",
    photos,
    series: seriesPhoto,
  },
  graphisme: {
    hero: {
      fenetre: "brief.txt",
      commande: "ouvrir brief.txt",
      phrase: "Bienvenue dans l'univers graphique de Capt One PRECISION",
      mots: ["Identité visuelle", "Logo", "Typographie", "Affiche", "Packaging"],
    },
    apropos: {
      surtitre: "À propos",
      titre: "Allier le sens à l'esthétique.",
      texte: "Identités visuelles, logos, affiches, éditions et packagings : chaque création part d'un brief et d'une intention, pour une image qui marque les esprits.",
      image: affiche,
    },
    demarche: {
      titre: "Démarche",
      etapes: [
        { periode: "Étape 1", titre: "Comprendre le brief", texte: "Vos objectifs, votre public et votre univers." },
        { periode: "Étape 2", titre: "Chercher le concept", texte: "Des pistes créatives, puis un choix fait ensemble." },
        { periode: "Étape 3", titre: "Décliner et livrer", texte: "Tous vos supports, prêts à l'emploi." },
      ],
    },
    savoirFaire: {
      fort: "Savoir",
      pale: "faire.",
      cartes: [
        { periode: "Identité", titre: "Identité visuelle", sousTitre: "Logo et charte", texte: "Un logo et des règles claires pour rester reconnaissable partout." },
        { periode: "Marque", titre: "Branding", sousTitre: "Univers de marque", texte: "Un ton, des couleurs et des formes qui vous distinguent." },
        { periode: "Impression", titre: "Affiches & flyers", sousTitre: "Supports imprimés", texte: "Des messages lisibles, qui attirent le regard." },
        { periode: "Édition", titre: "Design éditorial", sousTitre: "Brochures et catalogues", texte: "Une mise en page au service de la lecture." },
        { periode: "Digital", titre: "Réseaux sociaux", sousTitre: "Visuels et gabarits", texte: "Des publications cohérentes, faciles à décliner." },
        { periode: "Produit", titre: "Packaging", sousTitre: "Emballages", texte: "Un produit qui se remarque en rayon." },
      ],
    },
    creations: { fort: "Créations", accent: "visuelles", texte: "Une immersion dans notre univers graphique, là où l'idée rencontre l'esthétique." },
    realisations: { fort: "Nos", pale: "projets." },
    outils: {
      fort: "Domaines",
      pale: "d'expertise.",
      texte: "Tout ce que nous concevons, regroupé par type de support.",
      groupes: [
        { nom: "Identité", elements: ["Identité visuelle", "Logo", "Charte graphique", "Branding"] },
        { nom: "Impression", elements: ["Affiche", "Flyer", "Design éditorial", "Packaging"] },
        { nom: "Digital", elements: ["Réseaux sociaux", "Supports de communication"] },
      ],
    },
    contact: { titre: "Contact", texte: "Pour une création ou une collaboration, écrivez-nous directement." },
    projets: projetsGraphisme,
  },
  aPropos: {
    intro: aPropos.intro,
    formation: aPropos.formation,
    experiences: aPropos.experiences,
    competences: aPropos.competences,
    engagements: aPropos.engagements,
    photos: [
      photo("photographie/dsc00437.jpg", "Vidéaste souriant, caméra sur stabilisateur à la main", 2400, 1600),
      photo("photographie/cj6a2659.jpg", "Caméra sur stabilisateur filmant une femme en chemise rose", 1600, 2400),
    ],
  },
};
