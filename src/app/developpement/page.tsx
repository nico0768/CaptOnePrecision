import type { Metadata } from "next";
import Link from "next/link";
import { FormulaireContact } from "@/components/contact/FormulaireContact";
import { MediaImage } from "@/components/ui/MediaImage";
import { Arrow, Container, PageTransition } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { Temoignages } from "@/components/ui/Temoignages";
import { getContenu } from "@/lib/contenu";

export const metadata: Metadata = {
  title: "Développement web",
  description:
    "Sites vitrines et applications web de Capt One PRECISION, en React, Angular, JavaScript et Tailwind CSS.",
  alternates: { canonical: "/developpement" },
};

/** Titre de section : très grand, en capitales. */
function Titre({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`font-heading text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] font-semibold tracking-tight uppercase ${className ?? ""}`}>
      {children}
    </h2>
  );
}

export default async function DeveloppementPage() {
  const { developpement: dev, temoignages } = await getContenu();

  return (
    <PageTransition>
      {/* Haut de page */}
      <section className="relative overflow-hidden pt-28 pb-20 lg:pt-32">
        {/* Forme en dégradé derrière le portrait */}
        <div
          aria-hidden
          className="absolute -top-24 -right-20 size-[340px] rounded-[42%_58%_55%_45%/48%_40%_60%_52%] bg-gradient-to-br from-lime to-[#21b36b] lg:size-[520px]"
        />
        <Container className="relative">
          <div className="grid items-start gap-8 lg:grid-cols-12">
            <h1 className="fade-up font-heading text-[clamp(2.75rem,6.2vw,5.25rem)] leading-[1.02] font-semibold tracking-tight uppercase lg:col-span-8">
              {dev.hero.titre}
            </h1>
            <div className="relative mx-auto size-44 overflow-hidden rounded-full border-4 border-bg lg:col-span-3 lg:col-start-10 lg:size-60">
              <MediaImage media={dev.hero.portrait} fill preload sizes="240px" />
            </div>
          </div>

          <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg border-t-4 border-lime">
              <MediaImage media={dev.hero.image} fill preload sizes="(min-width: 1024px) 46vw, 92vw" />
            </div>
            <div>
              <p className="flex items-center gap-3 text-sm tracking-wide uppercase">
                <span aria-hidden className="size-2.5 animate-pulse rounded-full bg-lime" />
                {dev.hero.badge}
              </p>
              <p className="mt-4 max-w-xl text-xl leading-snug text-muted">{dev.hero.texte}</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <Link
                  href={dev.hero.bouton1.href || "#projets"}
                  className="flex h-14 items-center justify-center rounded-full bg-lime px-6 text-sm font-medium text-[#0d0d0d] uppercase transition-transform hover:-translate-y-0.5"
                >
                  {dev.hero.bouton1.label}
                </Link>
                <Link
                  href={dev.hero.bouton2.href || "#contact"}
                  className="flex h-14 items-center justify-center rounded-full bg-ink px-6 text-sm font-medium text-bg uppercase transition-transform hover:-translate-y-0.5"
                >
                  {dev.hero.bouton2.label}
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Projets */}
      <section id="projets" className="scroll-mt-24 pb-20 lg:pb-28">
        <Container>
          <Titre>{dev.realisationsTitre}</Titre>
          <ol className="mt-12 space-y-16 lg:space-y-20">
            {dev.projets.map((p, i) => (
              <li key={p.slug}>
                <Reveal>
                  <Link href={`/developpement/${p.slug}`} className="group grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
                    <div className={`relative aspect-[16/10] overflow-hidden rounded-lg ${i % 2 ? "lg:order-2" : ""}`}>
                      <div className="absolute inset-0 transition-transform duration-700 ease-out-expo group-hover:scale-105">
                        <MediaImage media={p.couverture} fill sizes="(min-width: 1024px) 46vw, 92vw" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-heading text-3xl font-semibold tracking-tight lg:text-5xl">{p.nom}</h3>
                      <dl className="mt-8 divide-y divide-line border-y border-line text-sm">
                        <div className="grid grid-cols-[7rem_1fr] gap-4 py-3">
                          <dt className="text-muted">Type</dt>
                          <dd>
                            {p.type}
                            {p.annee && ` · ${p.annee}`}
                          </dd>
                        </div>
                        <div className="grid grid-cols-[7rem_1fr] gap-4 py-3">
                          <dt className="text-muted">Objectif</dt>
                          <dd>{p.resume}</dd>
                        </div>
                        <div className="grid grid-cols-[7rem_1fr] gap-4 py-3">
                          <dt className="text-muted">Résultat</dt>
                          <dd>{p.resultat}</dd>
                        </div>
                      </dl>
                      <span className="mt-6 inline-flex items-center gap-3 text-sm font-medium text-accent uppercase">
                        Voir l&apos;étude de cas <Arrow />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Services */}
      <section className="sombre bg-bg py-20 text-ink lg:py-28">
        <Container>
          <Titre className="max-w-4xl">{dev.services.titre}</Titre>
          <ul className="defile-mobile mt-14 grid gap-5 md:grid-cols-3">
            {dev.services.liste.map((s, i) => (
              <li key={i}>
                <Reveal delay={i * 0.08} className="group h-full rounded-2xl border border-line p-8 transition-colors hover:border-lime">
                  <p className="font-heading text-lg text-lime">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-10 font-heading text-2xl font-semibold">{s.titre}</h3>
                  <p className="mt-4 leading-relaxed text-muted">{s.texte}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Expériences (si renseignées) */}
      {dev.parcours.etapes.length > 0 && (
        <section className="py-20 lg:py-28">
          <Container>
            <Titre>{dev.parcours.titre}</Titre>
            <ol className="mt-12 divide-y divide-line border-y border-line">
              {dev.parcours.etapes.map((e, i) => (
                <li key={i} className="grid gap-4 py-8 lg:grid-cols-12">
                  <p className="text-sm text-muted lg:col-span-3">{e.periode}</p>
                  <div className="lg:col-span-4">
                    <h3 className="font-heading text-2xl font-semibold">{e.structure}</h3>
                    <p className="text-muted">{e.role}</p>
                  </div>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-muted lg:col-span-5">
                    {e.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </Container>
        </section>
      )}

      {/* Technologies */}
      <section className="sombre overflow-hidden bg-bg py-20 text-ink">
        <Container>
          <Titre>{dev.technologies.titre}</Titre>
        </Container>
        {/* La liste est doublée pour que la bande boucle sans à-coup. */}
        <div className="mt-12 bande-defilante flex w-max">
          {[0, 1].map((copie) => (
            <ul key={copie} aria-hidden={copie === 1} className="flex shrink-0">
              {dev.technologies.liste.map((tech) => (
                <li key={tech} className="mx-2 rounded-full border border-line px-8 py-4 font-heading text-2xl font-semibold whitespace-nowrap lg:text-4xl">
                  {tech}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>

      {/* Méthode */}
      <section className="py-20 lg:py-28">
        <Container>
          <Titre className="max-w-3xl">{dev.process.titre}</Titre>
          <ol className="defile-mobile mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {dev.process.etapes.map((e, i) => (
              <li key={i}>
                <Reveal delay={i * 0.08} className="border-t-2 border-accent pt-6">
                  <p className="font-heading text-5xl font-semibold text-accent">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-5 font-heading text-2xl font-semibold">{e.titre}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{e.texte}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <Temoignages liste={temoignages} titre="Ce que disent nos clients" classeSombre="sombre" />

      {/* Contact */}
      <section id="contact" className="scroll-mt-24 bg-surface py-20 lg:py-28">
        <Container className="grid gap-12 lg:grid-cols-12">
          <Titre className="lg:col-span-5">{dev.contactTitre}</Titre>
          <div className="lg:col-span-6 lg:col-start-7">
            <FormulaireContact sujetInitial="developpement" />
          </div>
        </Container>
      </section>
    </PageTransition>
  );
}
