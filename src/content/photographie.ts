import type { CategoriePhoto, Media, Photo, SeriePhoto } from "@/lib/types";

/**
 * Photographie.
 * Les images vont dans public/images/photographie/
 * Les copies font 2400 px sur le grand côté : Next.js génère ensuite les tailles adaptées.
 * Galerie et séries se modifient aussi depuis le tableau de bord (/admin).
 */

export const categoriesPhoto: CategoriePhoto[] = [
  { slug: "mariage", label: "Mariage" },
  { slug: "portrait", label: "Portrait" },
  { slug: "evenementiel", label: "Événementiel" },
  { slug: "mode-lifestyle", label: "Mode & lifestyle" },
  { slug: "corporate", label: "Corporate" },
  { slug: "institutionnel", label: "Institutionnel" },
  { slug: "reportage", label: "Reportage" },
  { slug: "artistique", label: "Artistique" },
];

const verticale = (fichier: string, alt: string): Media => ({ src: `/images/photographie/${fichier}.jpg`, alt, width: 1600, height: 2400 });
const horizontale = (fichier: string, alt: string): Media => ({ src: `/images/photographie/${fichier}.jpg`, alt, width: 2400, height: 1600 });

const images = {
  couple: verticale("cj6a2578", "Jeunes mariés enlacés en extérieur, elle en robe blanche, lui en costume bordeaux"),
  baiser: verticale("cj6a3715", "Couple s'embrassant à table lors d'une réception"),
  roseAssise: verticale("cj6a2658", "Femme en chemise rose assise, souriante, pendant une séance en intérieur"),
  coulisses: verticale("cj6a2659", "Caméra sur stabilisateur filmant une femme en chemise rose"),
  groupeDebout: verticale("cj6a2664", "Groupe de femmes en chemises blanches et lunettes de soleil autour d'une femme en rose"),
  groupeLarge: horizontale("cj6a2667", "Groupe de femmes posant dans un salon au mur de briques"),
  groupeComplice: horizontale("cj6a2672", "Groupe de femmes complices autour d'une femme assise en chemise rose"),
  groupeNoirBlanc: verticale("cj6a2675", "Séance de groupe en noir et blanc, avec une caméra au premier plan"),
  rosePortrait: verticale("cj6a2683", "Portrait d'une femme souriante en chemise rose"),
  roseLunettes: verticale("cj6a2684", "Femme en chemise rose ajustant ses lunettes de soleil"),
  groupeRires: horizontale("cj6a2686", "Groupe de femmes riant ensemble devant un mur de briques"),
  groupeJoie: horizontale("cj6a2687", "Groupe de femmes joyeuses, mains levées, autour d'une femme en rose"),
  robeJean: verticale("cj6a4239", "Femme aux longues tresses rousses en robe en jean, de nuit sur une allée"),
  robeJeanSourire: verticale("cj6a4246", "Femme aux tresses rousses et en robe en jean, souriante, les mains dans les poches"),
  blazer: verticale("cj6a4294", "Femme en blazer bleu marine, bras croisés, sur fond de lumières de nuit"),
  blazerPortrait: verticale("cj6a4302", "Portrait souriant d'une femme en blazer bleu marine"),
  blazerProfil: verticale("cj6a4347", "Femme en blazer bleu marine posant de trois quarts, main près du visage"),
  blazerPied: verticale("cj6a4351", "Femme en blazer et pantalon clair, en pied, sur une allée pavée"),
  blazerPose: verticale("cj6a4361", "Femme aux tresses rousses, une main derrière la tête, souriante"),
  duo: verticale("cj6a4367", "Une femme en blazer et un homme en t-shirt beige posant côte à côte"),
  tshirtDebout: verticale("cj6a4370", "Homme en t-shirt bordeaux souriant, de nuit, une main sur la poitrine"),
  tshirtBras: verticale("cj6a4371", "Homme en t-shirt bordeaux, bras croisés, sur fond de lumières de nuit"),
  tshirtPortrait: verticale("cj6a4374", "Portrait d'un homme en t-shirt bordeaux, bras croisés"),
  videaste: horizontale("dsc00418", "Vidéaste marchant avec sa caméra sur stabilisateur pendant un événement en plein air"),
  videasteProfil: horizontale("dsc00431", "Vidéaste tenant sa caméra sur stabilisateur, regard au loin"),
  videasteSourire: horizontale("dsc00437", "Vidéaste souriant, caméra sur stabilisateur à la main"),
  videasteScene: horizontale("dsc00444", "Vidéaste devant une scène équipée d'une batterie"),
  videasteLarge: horizontale("dsc00453", "Vidéaste sur le site d'un événement, scène et musiciens en arrière-plan"),
};

const photo = (id: string, categorie: string, image: Media): Photo => ({ id, categorie, image });

export const photos: Photo[] = [
  photo("couple", "mariage", images.couple),
  photo("groupe-joie", "mode-lifestyle", images.groupeJoie),
  photo("blazer-pose", "portrait", images.blazerPose),
  photo("videaste-sourire", "reportage", images.videasteSourire),
  photo("rose-lunettes", "mode-lifestyle", images.roseLunettes),
  photo("robe-jean-sourire", "portrait", images.robeJeanSourire),
  photo("groupe-noir-blanc", "mode-lifestyle", images.groupeNoirBlanc),
  photo("tshirt-portrait", "portrait", images.tshirtPortrait),
  photo("baiser", "mariage", images.baiser),
  photo("groupe-rires", "mode-lifestyle", images.groupeRires),
  photo("blazer-portrait", "portrait", images.blazerPortrait),
  photo("coulisses", "reportage", images.coulisses),
  photo("videaste-scene", "reportage", images.videasteScene),
  photo("rose-portrait", "portrait", images.rosePortrait),
  photo("duo", "mode-lifestyle", images.duo),
  photo("tshirt-bras", "portrait", images.tshirtBras),
  photo("groupe-complice", "mode-lifestyle", images.groupeComplice),
  photo("robe-jean", "portrait", images.robeJean),
  photo("blazer-pied", "mode-lifestyle", images.blazerPied),
  photo("videaste", "reportage", images.videaste),
  photo("rose-assise", "portrait", images.roseAssise),
  photo("blazer", "portrait", images.blazer),
  photo("groupe-debout", "mode-lifestyle", images.groupeDebout),
  photo("blazer-profil", "portrait", images.blazerProfil),
  photo("videaste-profil", "reportage", images.videasteProfil),
  photo("groupe-large", "mode-lifestyle", images.groupeLarge),
  photo("tshirt-debout", "portrait", images.tshirtDebout),
  photo("videaste-large", "reportage", images.videasteLarge),
];

export const seriesPhoto: SeriePhoto[] = [
  {
    slug: "seance-de-groupe",
    titre: "Séance de groupe",
    categorie: "mode-lifestyle",
    texte: "Une séance en intérieur, entre complicité et éclats de rire, autour d'une même palette : le blanc, le jean et une touche de rose.",
    couverture: images.groupeRires,
    photos: [images.groupeJoie, images.roseLunettes, images.groupeComplice, images.groupeNoirBlanc, images.rosePortrait, images.groupeLarge, images.groupeDebout, images.roseAssise],
    enAvant: true,
  },
  {
    slug: "portraits-de-nuit",
    titre: "Portraits de nuit",
    categorie: "portrait",
    texte: "Des portraits en extérieur à la tombée de la nuit, où les sujets se détachent d'un fond sombre piqué de lumières.",
    couverture: images.blazerPose,
    photos: [images.blazerPortrait, images.robeJeanSourire, images.tshirtPortrait, images.blazerPied, images.robeJean, images.tshirtBras, images.blazer, images.duo],
    enAvant: true,
  },
];

export function labelCategoriePhoto(slug: string) {
  return categoriesPhoto.find((c) => c.slug === slug)?.label ?? slug;
}
