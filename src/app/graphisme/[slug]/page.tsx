import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { MediaImage } from "@/components/ui/MediaImage";
import { Arrow, BandeauExemple, Container, Eyebrow, PageTransition } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { labelCategorieGraphisme } from "@/content/graphisme";
import { getContenu } from "@/lib/contenu";

async function getProjet(slug: string) {
  return (await getContenu()).graphisme.projets.find((p) => p.slug === slug);
}

// Les pages créées depuis le tableau de bord sont générées à la première visite.
export const instant = false;

export async function generateStaticParams() {
  const { projets } = (await getContenu()).graphisme;
  // Next.js exige au moins une page connue à la compilation.
  return projets.length ? projets.map((p) => ({ slug: p.slug })) : [{ slug: "aucun" }];
}

export async function generateMetadata({ params }: PageProps<"/graphisme/[slug]">): Promise<Metadata> {
  const projet = await getProjet((await params).slug);
  if (!projet) return {};
  return {
    title: `${projet.titre} — Graphisme`,
    description: projet.resume,
    alternates: { canonical: `/graphisme/${projet.slug}` },
  };
}

function Section({ numero, titre, children }: { numero: string; titre: string; children: ReactNode }) {
  return (
    <Reveal className="border-t border-line pt-6">
      <h2 className="flex items-baseline gap-3 font-display text-lg font-bold">
        <span className="text-sm text-accent">{numero}</span>
        {titre}
      </h2>
      <div className="mt-4 leading-relaxed text-muted">{children}</div>
    </Reveal>
  );
}

export default async function ProjetGraphismePage({ params }: PageProps<"/graphisme/[slug]">) {
  const projet = await getProjet((await params).slug);
  if (!projet) notFound();

  const blocs = [
    { titre: "Contexte", texte: projet.contexte },
    { titre: "Brief", texte: projet.brief },
    { titre: "Concept créatif", texte: projet.concept },
    { titre: "Choix graphiques", texte: projet.choixGraphiques },
  ].filter((b) => b.texte);

  return (
    <PageTransition>
      <article className="pt-28 lg:pt-36">
        {projet.exemple && <BandeauExemple />}
        <Container className="mt-10">
          <Link href="/graphisme" className="inline-flex items-center gap-2 font-mono text-xs text-muted hover:text-ink">
            <Arrow className="rotate-180" /> Toutes les créations
          </Link>

          <header className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
            <h1 className="font-display text-[clamp(3rem,10vw,9rem)] leading-[0.85] font-extrabold tracking-[-0.05em] lg:col-span-8">
              {projet.titre}
            </h1>
            {/* Cartel d'exposition */}
            <dl className="space-y-3 border-l-2 border-accent pl-5 text-sm lg:col-span-4">
              {projet.client && (
                <div>
                  <dt className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">Client</dt>
                  <dd>{projet.client}</dd>
                </div>
              )}
              {projet.annee && (
                <div>
                  <dt className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">Année</dt>
                  <dd>{projet.annee}</dd>
                </div>
              )}
              <div>
                <dt className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">Discipline</dt>
                <dd>{projet.categories.map(labelCategorieGraphisme).join(", ")}</dd>
              </div>
            </dl>
          </header>

          <div className="mt-14 bg-surface p-4 sm:p-10 lg:p-16">
            <MediaImage media={projet.visuelPrincipal} preload quality={90} sizes="(min-width: 1440px) 1200px, 90vw" />
          </div>

          <div className="mt-20 grid gap-12 md:grid-cols-2 lg:gap-16">
            {blocs.map((b, i) => (
              <Section key={b.titre} numero={String(i + 1).padStart(2, "0")} titre={b.titre}>
                <p>{b.texte}</p>
              </Section>
            ))}
          </div>

          <div className="mt-20 grid gap-12 lg:grid-cols-12">
            {projet.couleurs.length > 0 && (
            <Reveal className="lg:col-span-7">
              <Eyebrow>Couleurs</Eyebrow>
              <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {projet.couleurs.map((c) => (
                  <li key={c.hex}>
                    <div
                      className="aspect-square rounded-sm border border-line transition-transform duration-500 ease-out-expo hover:-translate-y-1"
                      style={{ background: c.hex }}
                    />
                    <p className="mt-2 text-sm">{c.nom}</p>
                    <p className="font-mono text-xs text-muted uppercase">{c.hex}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
            )}
            <Reveal className={`space-y-10 lg:col-span-4 ${projet.couleurs.length > 0 ? "lg:col-start-9" : ""}`}>
              {projet.typographies.length > 0 && (
                <div>
                  <Eyebrow>Typographies</Eyebrow>
                  <ul className="mt-4 space-y-1 font-display text-2xl font-bold">
                    {projet.typographies.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}
              {projet.supports.length > 0 && (
                <div>
                  <Eyebrow>Supports réalisés</Eyebrow>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {projet.supports.map((s) => (
                      <li key={s} className="rounded-full border border-line px-3 py-1 text-sm">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Reveal>
          </div>

          {projet.declinaisons.length > 0 && (
            <section aria-label="Déclinaisons" className="mt-24">
              <Eyebrow>Déclinaisons</Eyebrow>
              <ul className="mt-8 grid gap-6 md:grid-cols-2">
                {projet.declinaisons.map((d, i) => (
                  <li key={`${d.alt}-${i}`} className={d.width > d.height ? "md:col-span-2" : undefined}>
                    <Reveal>
                      <MediaImage media={d} sizes="(min-width: 768px) 46vw, 92vw" />
                    </Reveal>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <div className="pb-24 lg:pb-36" />
        </Container>
      </article>
    </PageTransition>
  );
}
