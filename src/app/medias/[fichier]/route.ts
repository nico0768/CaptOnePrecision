import { lireImageLocale } from "@/lib/stockage";

/** Sert les images envoyées depuis le tableau de bord (stockage local). */
export async function GET(_: Request, { params }: RouteContext<"/medias/[fichier]">) {
  const image = await lireImageLocale((await params).fichier);
  if (!image) return new Response("Image introuvable", { status: 404 });
  return new Response(new Uint8Array(image.octets), {
    headers: {
      "Content-Type": image.type,
      // Nom de fichier unique : le contenu d'une adresse ne change jamais.
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
