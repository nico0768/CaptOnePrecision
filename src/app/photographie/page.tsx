import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Galerie } from "@/components/photo/Galerie";
import { LogoSymbole } from "@/components/layout/Logo";
import { Diaporama } from "@/components/ui/Diaporama";
import { MediaImage } from "@/components/ui/MediaImage";
import { Arrow, Container, PageTransition } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { Temoignages } from "@/components/ui/Temoignages";
import { categoriesPhoto, labelCategoriePhoto } from "@/content/photographie";
import { getContenu } from "@/lib/contenu";

export const metadata: Metadata = {
  title: "Photographie",
  description:
    "Portfolio photographique de Capt One PRECISION : mariage, portrait, événementiel, mode, corporate, institutionnel, reportage et photographie artistique.",
  alternates: { canonical: "/photographie" },
};

const boutonNoir = "inline-flex items-center gap-3 bg-accent px-8 py-3.5 text-[11px] font-semibold tracking-[0.2em] text-accent-ink uppercase transition-opacity hover:opacity-85";

export default async function PhotographiePage() {
  const { photographie: photo, temoignages } = await getContenu();
  const series = photo.series.filter((s) => !s.exemple);

  return (
    <PageTransition>
      {/* Diaporama plein écran, sous l'en-tête */}
      <div className="mt-16 lg:mt-20">
        <Diaporama label="Photographies à la une" className="h-[88vh] min-h-[560px]">
          {photo.slides.map((slide, i) => (
            <div key={i} className="sombre relative flex h-full items-center justify-center bg-bg text-center text-white">
              {slide.image.src ? (
                <>
                  <Image src={slide.image.src} alt={slide.image.alt} fill sizes="100vw" quality={90} preload={i === 0} className="object-cover" />
                  {/* Voile sombre : garde le texte lisible, même sur une photo chargée */}
                  <div aria-hidden className="absolute inset-0 bg-black/55" />
                </>
              ) : (
                <>
                  <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#34343a_0%,#0d0d0d_70%)]" />
                  <LogoSymbole className="absolute top-1/2 left-1/2 h-[70%] -translate-x-1/2 -translate-y-1/2 text-white/[0.04]" />
                </>
              )}
              <div className="relative px-6">
                <p className="text-[11px] font-semibold tracking-[0.5em] uppercase">{slide.categorie}</p>
                {i === 0 ? (
                  <h1 className="mt-4 font-heading text-[clamp(3rem,8vw,6.5rem)] leading-none">{slide.titre}</h1>
                ) : (
                  <h2 className="mt-4 font-heading text-[clamp(3rem,8vw,6.5rem)] leading-none">{slide.titre}</h2>
                )}
                <p className="mt-5 text-xs font-medium">{slide.credit}</p>
              </div>
            </div>
          ))}
        </Diaporama>
      </div>

      {/* Citation */}
      <section className="py-20 text-center lg:py-24">
        <Container className="max-w-3xl">
          <Reveal>
            <p className="font-heading text-3xl leading-snug">{photo.citation.texte}</p>
            <p className="mt-6 font-serif text-3xl italic">{photo.citation.signature}</p>
          </Reveal>
        </Container>
      </section>

      {/* Galerie */}
      <section aria-label="Galerie" className="px-1 pb-20 lg:pb-24">
        <Galerie photos={photo.photos} categories={categoriesPhoto} />
      </section>

      {/* Séries (si renseignées) */}
      {series.length > 0 && (
        <section className="pb-20 lg:pb-24">
          <Container>
            <h2 className="text-center font-heading text-4xl">Séries</h2>
            <ul className="defile-mobile mt-12 grid gap-6 md:grid-cols-2">
              {series.map((s) => (
                <li key={s.slug}>
                  <Reveal>
                    <Link href={`/photographie/series/${s.slug}`} className="group block">
                      <div className="relative aspect-[3/2] overflow-hidden">
                        <div className="absolute inset-0 transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.04]">
                          <MediaImage media={s.couverture} fill sizes="(min-width: 768px) 46vw, 92vw" className="object-[center_15%]" />
                        </div>
                      </div>
                      <div className="mt-4 flex items-baseline justify-between gap-4">
                        <h3 className="font-heading text-2xl">{s.titre}</h3>
                        <span className="flex items-center gap-3 text-xs text-muted">
                          {labelCategoriePhoto(s.categorie)}
                          <Arrow />
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <Temoignages liste={temoignages} titre="Ce que disent nos clients" classeSombre="sombre" />

      {/* Formules */}
      <section className="py-20 lg:py-24">
        <Container>
          <h2 className="text-center font-heading text-4xl">{photo.forfaits.titre}</h2>
          <ul className="defile-mobile mx-auto mt-12 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {photo.forfaits.liste.map((f, i) => (
              <li key={i} className="flex flex-col text-center shadow-[0_8px_30px_-18px_rgb(0_0_0/0.4)]">
                <div className="sombre relative flex aspect-[3/2] items-center justify-center overflow-hidden bg-bg">
                  {f.image.src ? <MediaImage media={f.image} fill sizes="(min-width: 1024px) 22vw, (min-width: 640px) 46vw, 92vw" className="object-[center_20%]" /> : null}
                  {f.image.src && <div aria-hidden className="absolute inset-0 bg-black/30" />}
                  <h3 className="relative font-heading text-3xl text-white">{f.nom}</h3>
                </div>
                <ul className="flex-1 space-y-2 px-4 py-6 text-xs font-medium text-muted">
                  {f.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <p className="px-4 pb-6 font-heading text-4xl">{f.prix}</p>
                <Link href={`/mon-espace?formule=${encodeURIComponent(f.nom)}`} className="bg-accent py-3.5 text-[11px] font-semibold tracking-[0.2em] text-accent-ink uppercase transition-opacity hover:opacity-85">
                  Réserver
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Appel à l'action */}
      <Container className="pb-20 lg:pb-24">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 border border-line p-8 sm:flex-row sm:items-center lg:p-12">
          <h2 className="font-heading text-3xl">{photo.bandeau.titre}</h2>
          <Link href={photo.bandeau.bouton.href || "/contact"} className={`${boutonNoir} shrink-0`}>
            {photo.bandeau.bouton.label}
          </Link>
        </div>
      </Container>

      {/* Bande de photos */}
      <section className="pb-20 lg:pb-24">
        <Container>
          <h2 className="text-center font-heading text-4xl">{photo.bandeTitre}</h2>
          <ul className="mx-auto mt-10 grid max-w-6xl grid-cols-4 gap-3 lg:grid-cols-8">
            {photo.photos.slice(0, 8).map((p) => (
              <li key={p.id} className="relative aspect-square overflow-hidden">
                <MediaImage media={{ ...p.image, todo: "Photo" }} fill sizes="(min-width: 1024px) 11vw, 23vw" />
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </PageTransition>
  );
}
