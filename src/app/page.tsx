import Image from "next/image";
import Link from "next/link";
import { FormulaireContact } from "@/components/contact/FormulaireContact";
import { LogoSymbole } from "@/components/layout/Logo";
import { BandeDefilante } from "@/components/ui/BandeDefilante";
import { Diaporama } from "@/components/ui/Diaporama";
import { MediaImage } from "@/components/ui/MediaImage";
import { Arrow, ArrowLink, Container, PageTransition, TitreSection } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { Temoignages } from "@/components/ui/Temoignages";
import { site } from "@/content/site";
import { getContenu } from "@/lib/contenu";
import type { Contenu, Media } from "@/lib/types";

/** Numéros des atouts : « 01. », « 02. »… */
const numero = (i: number) => `${String(i + 1).padStart(2, "0")}.`;

function Diapo({ slide, principale }: { slide: Contenu["accueil"]["slides"][number]; principale: boolean }) {
  const Titre = principale ? "h1" : "h2";
  return (
    <div className="sombre-nuit relative h-full bg-bg text-white">
      {slide.image.src ? (
        <>
          <Image src={slide.image.src} alt={slide.image.alt} fill sizes="100vw" preload={principale} className="object-cover" />
          {/* Voile sombre : garde le texte lisible, même sur une photo claire */}
          <div aria-hidden className="absolute inset-0 bg-[#020d26]/65 md:bg-transparent md:bg-gradient-to-r md:from-[#020d26]/90 md:via-[#020d26]/65 md:to-[#020d26]/10" />
        </>
      ) : (
        <>
          {/* Sans image : fond bleu nuit, avec le logo en filigrane */}
          <div aria-hidden className="fond-grille absolute inset-0" />
          <LogoSymbole className="absolute top-1/2 right-[6%] hidden h-[85%] -translate-y-1/2 text-white/[0.06] md:block" />
          <div aria-hidden className="absolute -top-1/3 -left-1/4 size-[80%] rounded-full bg-[#ff7a3d]/10 blur-3xl" />
        </>
      )}
      <Container className="relative flex h-full flex-col justify-center lg:px-24">
        <Titre className="font-heading text-[clamp(3rem,7vw,5.75rem)] leading-[1.02]">
          <span className="block font-normal">{slide.fin}</span>
          <span className="block font-bold">{slide.fort}</span>
        </Titre>
        <p className="mt-6 max-w-xl text-white/90 lg:text-lg">{slide.texte}</p>
        <div className="mt-9 flex flex-wrap gap-3">
          {slide.bouton1.label && (
            <ArrowLink href={slide.bouton1.href || "/"} variant="solid">
              {slide.bouton1.label}
            </ArrowLink>
          )}
          {slide.bouton2.label && (
            <ArrowLink href={slide.bouton2.href || "/"} variant="outline" className="border-white bg-white text-[#020d26] hover:bg-white/90">
              {slide.bouton2.label}
            </ArrowLink>
          )}
        </div>
      </Container>
    </div>
  );
}

export default async function Accueil() {
  const contenu = await getContenu();
  const { accueil, identite, temoignages, developpement, photographie, graphisme } = contenu;

  // Réalisations : les éléments mis en avant, hors contenus de démonstration.
  const realisations: { titre: string; href: string; image: Media; categorie: string }[] = [
    ...developpement.projets.filter((p) => p.enAvant).map((p) => ({ titre: p.nom, href: `/developpement/${p.slug}`, image: p.couverture, categorie: "Développement" })),
    ...graphisme.projets.filter((p) => p.enAvant && !p.exemple).map((p) => ({ titre: p.titre, href: `/graphisme/${p.slug}`, image: p.visuelPrincipal, categorie: "Graphisme" })),
    ...photographie.series.filter((s) => s.enAvant && !s.exemple).map((s) => ({ titre: s.titre, href: `/photographie/series/${s.slug}`, image: s.couverture, categorie: "Photographie" })),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: identite.nom,
    description: identite.description,
    url: site.url,
    email: identite.email,
    sameAs: identite.reseaux.map((r) => r.href).filter(Boolean),
  };

  return (
    <PageTransition>
      <div data-univers="accueil">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        {/* Diaporama, sous l'en-tête */}
        <div className="mt-16 md:mt-[104px] lg:mt-[120px]">
          <Diaporama label="Présentation" className="h-[78vh] min-h-[520px]">
            {accueil.slides.map((slide, i) => (
              <Diapo key={i} slide={slide} principale={i === 0} />
            ))}
          </Diaporama>
        </div>

        {/* Atouts */}
        <Container className="py-16 lg:py-24">
          <ul className="defile-mobile grid border-line sm:grid-cols-2 sm:border-t sm:border-l lg:grid-cols-4">
            {accueil.atouts.map((a, i) => (
              <li key={i} className="border border-line p-7 sm:border-t-0 sm:border-l-0">
                <LogoSymbole className="h-8 text-accent" />
                <h2 className="mt-5 font-heading text-2xl font-semibold">
                  {numero(i)} {a.titre}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">{a.texte}</p>
              </li>
            ))}
          </ul>
        </Container>

        {/* À propos */}
        <Container className="grid items-center gap-12 pb-20 lg:grid-cols-12 lg:pb-28">
          <Reveal className="relative aspect-[4/5] lg:col-span-5">
            <MediaImage media={accueil.apropos.image} fill sizes="(min-width: 1024px) 38vw, 92vw" />
          </Reveal>
          <Reveal className="lg:col-span-6 lg:col-start-7">
            <TitreSection surtitre={accueil.apropos.surtitre} fort={accueil.apropos.fort} fin={accueil.apropos.fin} />
            <p className="mt-8 leading-relaxed text-muted">{accueil.apropos.texte}</p>
            <ul className="mt-6 space-y-3 text-sm text-muted">
              {accueil.apropos.points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <Arrow className="mt-0.5 shrink-0 text-accent" />
                  {point}
                </li>
              ))}
            </ul>
            {accueil.apropos.citation && (
              <blockquote className="mt-8 border-l-2 border-accent bg-surface p-6 text-sm leading-relaxed text-muted">
                <p>{accueil.apropos.citation}</p>
                {accueil.apropos.auteur && <footer className="mt-3 text-xs">— {accueil.apropos.auteur}</footer>}
              </blockquote>
            )}
          </Reveal>
        </Container>

        {/* Services */}
        <section id="services" className="scroll-mt-24 bg-surface py-20 lg:py-28">
          <Container>
            <TitreSection centre surtitre={accueil.services.surtitre} fort={accueil.services.fort} fin={accueil.services.fin} />
            <ul className="defile-mobile mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {accueil.services.liste.map((s, i) => (
                <li key={i}>
                  <Reveal delay={(i % 3) * 0.08}>
                    <Link href={s.href || "/"} className="group block">
                      <div className="relative aspect-[3/2] overflow-hidden">
                        <div className="absolute inset-0 transition-transform duration-700 ease-out-expo group-hover:scale-105">
                          <MediaImage media={s.image} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw" className="object-[center_20%]" />
                        </div>
                      </div>
                      <h3 className="mt-5 flex items-center justify-between gap-3 font-heading text-2xl font-semibold transition-colors group-hover:text-accent">
                        {s.titre} <Arrow />
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{s.texte}</p>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* Contact */}
        <Container className="grid items-center gap-12 py-20 lg:grid-cols-12 lg:py-28">
          <Reveal className="relative lg:col-span-5">
            <div className="relative aspect-[4/5]">
              <MediaImage media={accueil.contact.image} fill sizes="(min-width: 1024px) 38vw, 92vw" />
            </div>
            {accueil.contact.chiffre && (
              <p className="absolute bottom-8 left-0 flex items-center gap-3 bg-bg px-6 py-5 shadow-xl">
                <span className="font-heading text-5xl font-bold text-accent">{accueil.contact.chiffre}</span>
                <span className="max-w-20 text-xs text-muted">{accueil.contact.chiffreLabel}</span>
              </p>
            )}
          </Reveal>
          <Reveal className="lg:col-span-6 lg:col-start-7">
            <TitreSection surtitre={accueil.contact.surtitre} fort={accueil.contact.fort} fin={accueil.contact.fin} className="mb-10" />
            <FormulaireContact />
          </Reveal>
        </Container>

        {/* Bandeau d'appel */}
        <section className="sombre-nuit relative overflow-hidden bg-bg py-20 text-center text-ink lg:py-28">
          <div aria-hidden className="fond-grille absolute inset-0" />
          <Container className="relative">
            <p className="text-lg text-muted">{accueil.bandeau.surtitre}</p>
            <h2 className="mx-auto mt-3 max-w-3xl font-heading text-5xl leading-[1.05] font-bold lg:text-6xl">{accueil.bandeau.titre}</h2>
            <ArrowLink href={accueil.bandeau.bouton.href || "/contact"} variant="solid" className="mt-9">
              {accueil.bandeau.bouton.label}
            </ArrowLink>
          </Container>
        </section>

        {/* Réalisations */}
        {realisations.length > 0 && (
          <section className="pt-20 pb-16 lg:pt-28 lg:pb-20">
            <TitreSection centre surtitre={accueil.projets.surtitre} fort={accueil.projets.fort} fin={accueil.projets.fin} className="px-5" />
            <div className="mt-14">
              <BandeDefilante label="Réalisations">
                {realisations.map((r) => (
                  <li key={r.href} className="w-[80vw] shrink-0 snap-start sm:w-[45vw] lg:w-[25vw]">
                    <Link href={r.href} className="group relative block aspect-[5/6] overflow-hidden">
                      <div className="absolute inset-0 transition-transform duration-700 ease-out-expo group-hover:scale-105">
                        <MediaImage media={r.image} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 80vw" className="object-[center_20%]" />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5 pt-16 text-white">
                        <p className="text-xs tracking-[0.2em] uppercase">{r.categorie}</p>
                        <p className="mt-1 font-heading text-2xl font-semibold">{r.titre}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </BandeDefilante>
            </div>
          </section>
        )}

        {/* Pourquoi nous choisir */}
        <Container className="grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-24">
          <Reveal>
            <TitreSection surtitre={accueil.pourquoi.surtitre} fort={accueil.pourquoi.fort} fin={accueil.pourquoi.fin} />
            <p className="mt-8 leading-relaxed text-muted">{accueil.pourquoi.texte}</p>
            {accueil.pourquoi.barres.length > 0 && (
              <ul className="mt-10 space-y-6">
                {accueil.pourquoi.barres.map((b) => (
                  <li key={b.label}>
                    <div className="flex justify-between text-sm font-semibold uppercase">
                      <span className="font-heading tracking-wide">{b.label}</span>
                      <span className="text-xs font-normal text-muted">{b.valeur}%</span>
                    </div>
                    <div className="mt-2 h-1 bg-line">
                      <div className="h-full bg-accent" style={{ width: `${b.valeur}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
          <Reveal className="relative aspect-square">
            <MediaImage media={accueil.pourquoi.image} fill sizes="(min-width: 1024px) 46vw, 92vw" />
          </Reveal>
        </Container>

        {/* Équipe (si renseignée) */}
        {accueil.equipe.membres.length > 0 && (
          <Container className="pb-20 lg:pb-24">
            <TitreSection centre surtitre={accueil.equipe.surtitre} fort={accueil.equipe.fort} fin={accueil.equipe.fin} />
            <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {accueil.equipe.membres.map((m, i) => (
                <li key={i} className="text-center">
                  <div className="relative aspect-[4/5]">
                    <MediaImage media={{ ...m.photo, alt: m.photo.alt || m.nom }} fill sizes="(min-width: 1024px) 23vw, 46vw" />
                  </div>
                  <p className="mt-4 font-heading text-xl font-semibold">{m.nom}</p>
                  <p className="text-sm text-accent">{m.role}</p>
                </li>
              ))}
            </ul>
          </Container>
        )}

        {/* Partenaires (si renseignés) */}
        {accueil.partenaires.length > 0 && (
          <Container className="pb-20">
            <ul className="flex flex-wrap items-center justify-around gap-10 border-t border-line pt-12">
              {accueil.partenaires.map((p, i) => (
                <li key={i} className="relative h-12 w-32">
                  <MediaImage media={p} fill sizes="128px" className="object-contain" />
                </li>
              ))}
            </ul>
          </Container>
        )}

        <Temoignages liste={temoignages} titre="Ce que disent nos clients" />

        {/* Nos univers */}
        <Container className="py-20 lg:py-28">
          <div className="grid items-end gap-6 lg:grid-cols-12">
            <TitreSection surtitre={accueil.univers.surtitre} fort={accueil.univers.fort} fin={accueil.univers.fin} className="lg:col-span-5" />
            <p className="max-w-md text-muted lg:col-span-7">{accueil.univers.texte}</p>
          </div>
          <ul className="defile-mobile mt-12 grid gap-8 md:grid-cols-3">
            {accueil.univers.liste.map((u, i) => (
              <li key={i}>
                <Reveal delay={i * 0.08}>
                  <Link href={u.href || "/"} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <div className="absolute inset-0 transition-transform duration-700 ease-out-expo group-hover:scale-105">
                        <MediaImage media={u.image} fill sizes="(min-width: 768px) 30vw, 92vw" className="object-[center_20%]" />
                      </div>
                    </div>
                    <h3 className="mt-5 font-heading text-2xl font-semibold">{u.titre}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{u.texte}</p>
                    <span className="mt-4 inline-flex items-center gap-2 font-heading text-sm font-semibold uppercase">
                      Découvrir <Arrow />
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </PageTransition>
  );
}
