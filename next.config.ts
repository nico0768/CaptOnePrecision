import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Contenu et images du tableau de bord, embarqués au déploiement.
  outputFileTracingIncludes: {
    "/**": ["./data/contenu.json", "./data/medias/**"],
  },
  // Les comptes clients ne doivent jamais partir avec le déploiement, même présents sur ce poste.
  outputFileTracingExcludes: {
    "/**": ["./data/prive/**"],
  },
  // Permet d'essayer le site sur un téléphone connecté au même réseau, pendant le développement.
  allowedDevOrigins: ["192.168.*.*"],
  images: {
    // 75 pour les vignettes, 90 pour l'affichage plein écran des photographies.
    qualities: [75, 90],
    formats: ["image/avif", "image/webp"],
    // Images envoyées depuis le tableau de bord lorsque le site est sur Vercel.
    remotePatterns: [new URL("https://*.public.blob.vercel-storage.com/**")],
  },
};

export default nextConfig;
