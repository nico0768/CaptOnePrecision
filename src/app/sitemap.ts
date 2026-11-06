import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { getContenu } from "@/lib/contenu";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { developpement, photographie, graphisme } = await getContenu();
  const pages = ["", "/developpement", "/photographie", "/graphisme", "/a-propos", "/contact"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, priority: p === "" ? 1 : 0.8 })),
    ...developpement.projets.map((p) => ({ url: `${site.url}/developpement/${p.slug}`, priority: 0.6 })),
    ...photographie.series.filter((s) => !s.exemple).map((s) => ({ url: `${site.url}/photographie/series/${s.slug}`, priority: 0.6 })),
    ...graphisme.projets.filter((p) => !p.exemple).map((p) => ({ url: `${site.url}/graphisme/${p.slug}`, priority: 0.6 })),
  ];
}
