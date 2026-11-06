import type { MetadataRoute } from "next";

/** Permet d'installer le site sur un téléphone, comme une application. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Capt One PRECISION",
    short_name: "Capt One",
    description: "Développement web, photographie et graphisme.",
    lang: "fr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#020d26",
    theme_color: "#020d26",
    icons: [
      { src: "/icons/icone-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icone-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icone-masquable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
