import { sessionValide } from "@/lib/session";
import { detecterTypeImage, enregistrerImage } from "@/lib/stockage";

const TAILLE_MAX = 8 * 1024 * 1024;

export async function POST(requete: Request) {
  if (!(await sessionValide())) return Response.json({ erreur: "Session expirée. Reconnectez-vous." }, { status: 401 });

  const fichier = (await requete.formData()).get("image");
  if (!(fichier instanceof File)) return Response.json({ erreur: "Aucune image reçue." }, { status: 400 });
  if (fichier.size > TAILLE_MAX) return Response.json({ erreur: "Image trop lourde (8 Mo maximum)." }, { status: 413 });

  const octets = new Uint8Array(await fichier.arrayBuffer());
  const type = detecterTypeImage(octets);
  if (!type) return Response.json({ erreur: "Format non pris en charge (JPEG, PNG ou WebP)." }, { status: 415 });

  try {
    return Response.json({ src: await enregistrerImage(octets, type) });
  } catch (e) {
    console.error("[admin] Envoi d'image impossible :", e);
    return Response.json({ erreur: "L'image n'a pas pu être enregistrée sur le serveur." }, { status: 500 });
  }
}
