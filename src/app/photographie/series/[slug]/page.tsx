import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SerieGalerie } from "@/components/photo/SerieGalerie";
import { MediaImage } from "@/components/ui/MediaImage";
import { Arrow, BandeauExemple, Container, Eyebrow, PageTransition } from "@/components/ui/primitives";
import { labelCategoriePhoto } from "@/content/photographie";
import { getContenu } from "@/lib/contenu";

async function getSerie(slug: string) {
  return (await getContenu()).photographie.series.find((s) => s.slug === slug);
}

// Les pages créées depuis le tableau de bord sont générées à la première visite.
export const instant = false;

export async function generateStaticParams() {
  const { series } = (await getContenu()).photographie;
  // Next.js exige au moins une page connue à la compilation.
  return series.length ? series.map((s) => ({ slug: s.slug })) : [{ slug: "aucune" }];
}

export async function generateMetadata({ params }: PageProps<"/photographie/series/[slug]">): Promise<Metadata> {
  const serie = await getSerie((await params).slug);
  if (!serie) return {};
  return {
    title: `${serie.titre} — Photographie`,
    description: serie.texte.slice(0, 160),
    alternates: { canonical: `/photographie/series/${serie.slug}` },
  };
}

export default async function SeriePage({ params }: PageProps<"/photographie/series/[slug]">) {
  const serie = await getSerie((await params).slug);
  if (!serie) notFound();

  return (
    <PageTransition>
      <article className="pt-28 lg:pt-36">
        {serie.exemple && <BandeauExemple />}
        <Container className="mt-10">
          <Link href="/photographie" className="inline-flex items-center gap-2 font-mono text-xs text-muted hover:text-ink">
            <Arrow className="rotate-180" /> Photographie
          </Link>

          <header className="mt-10 grid gap-8 lg:grid-cols-12">
            <h1 className="font-serif text-[clamp(3rem,9vw,8rem)] leading-[0.9] tracking-tight italic lg:col-span-8">
              {serie.titre}
            </h1>
            <dl className="grid grid-cols-3 gap-4 self-end font-mono text-[11px] tracking-[0.15em] uppercase lg:col-span-4">
              <div>
                <dt className="text-muted">Catégorie</dt>
                <dd className="mt-1">{labelCategoriePhoto(serie.categorie)}</dd>
              </div>
              {serie.lieu && (
                <div>
                  <dt className="text-muted">Lieu</dt>
                  <dd className="mt-1">{serie.lieu}</dd>
                </div>
              )}
              {serie.annee && (
                <div>
                  <dt className="text-muted">Année</dt>
                  <dd className="mt-1">{serie.annee}</dd>
                </div>
              )}
            </dl>
          </header>
        </Container>

        <div className="mt-14">
          <MediaImage media={serie.couverture} preload quality={90} sizes="100vw" />
        </div>

        <Container className="grid gap-6 py-20 lg:grid-cols-12 lg:py-28">
          <Eyebrow className="lg:col-span-3">La série</Eyebrow>
          <p className="max-w-2xl font-serif text-2xl leading-snug lg:col-span-8 lg:text-3xl">{serie.texte}</p>
        </Container>

        <Container className="pb-24 lg:pb-36">
          <SerieGalerie photos={serie.photos} />
        </Container>
      </article>
    </PageTransition>
  );
}
