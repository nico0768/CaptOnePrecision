import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { BrowserMockup, PhoneMockup } from "@/components/dev/Mockups";
import { Arrow, Container, Eyebrow, PageTransition, Tag, Todo } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { getContenu } from "@/lib/contenu";

async function getProjets() {
  return (await getContenu()).developpement.projets;
}

// Les pages créées depuis le tableau de bord sont générées à la première visite.
export const instant = false;

export async function generateStaticParams() {
  const projets = await getProjets();
  // Next.js exige au moins une page connue à la compilation.
  return projets.length ? projets.map((p) => ({ slug: p.slug })) : [{ slug: "aucun" }];
}

export async function generateMetadata({ params }: PageProps<"/developpement/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const projet = (await getProjets()).find((p) => p.slug === slug);
  if (!projet) return {};
  return {
    title: `${projet.nom} — Développement`,
    description: projet.resume,
    alternates: { canonical: `/developpement/${projet.slug}` },
  };
}

function Bloc({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <Reveal className="grid gap-4 border-t border-line py-10 md:grid-cols-12">
      <h2 className="font-mono text-xs tracking-[0.22em] text-accent uppercase md:col-span-3">{titre}</h2>
      <div className="max-w-2xl leading-relaxed md:col-span-9">{children}</div>
    </Reveal>
  );
}

export default async function ProjetDevPage({ params }: PageProps<"/developpement/[slug]">) {
  const { slug } = await params;
  const projetsDev = await getProjets();
  const projet = projetsDev.find((p) => p.slug === slug);
  if (!projet) notFound();

  const index = projetsDev.findIndex((p) => p.slug === slug);
  const suivant = projetsDev[(index + 1) % projetsDev.length];
  const mobiles = projet.captures.filter((c) => c.height > c.width);
  const bureaux = projet.captures.filter((c) => c.height <= c.width);

  return (
    <PageTransition>
      <article className="pt-32 lg:pt-40">
        <Container>
          <Link
            href="/developpement"
            className="group inline-flex items-center gap-2 font-mono text-xs text-muted hover:text-ink"
          >
            <Arrow className="rotate-180" /> Tous les projets
          </Link>

          <header className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <Eyebrow className="text-accent">
                {projet.type}
                {projet.annee && ` · ${projet.annee}`}
              </Eyebrow>
              <h1 className="mt-4 text-[clamp(3rem,9vw,8rem)] leading-[0.9] font-semibold tracking-[-0.045em]">
                {projet.nom}
              </h1>
            </div>
            <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
              {projet.lienDemo && (
                <a
                  href={projet.lienDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-accent-ink"
                >
                  Voir le projet <Arrow />
                </a>
              )}
              {projet.lienCode && (
                <a
                  href={projet.lienCode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 rounded-full border border-line px-6 py-3.5 text-sm font-medium hover:border-ink"
                >
                  Code source <Arrow />
                </a>
              )}
            </div>
          </header>

          <BrowserMockup
            media={projet.couverture}
            url={projet.lienDemo}
            preload
            sizes="(min-width: 1440px) 1340px, 94vw"
            className="mt-14"
          />

          <div className="mt-20">
            <Bloc titre="Présentation">
              <p>{projet.presentation}</p>
            </Bloc>
            <Bloc titre="Problématique">
              <p>{projet.problematique}</p>
            </Bloc>
            <Bloc titre="Objectifs">
              {projet.objectifs.length > 0 ? (
                <ul className="list-[square] space-y-2 pl-5 marker:text-accent">
                  {projet.objectifs.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              ) : (
                <Todo>Objectifs à compléter</Todo>
              )}
            </Bloc>
            <Bloc titre="Technologies">
              {projet.technologies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {projet.technologies.map((t) => (
                    <Tag key={t} className="font-mono">
                      {t}
                    </Tag>
                  ))}
                </div>
              ) : (
                <Todo>Technologies à préciser</Todo>
              )}
            </Bloc>
            <Bloc titre="Rôle">
              <p>{projet.role}</p>
            </Bloc>
          </div>

          {(mobiles.length > 0 || bureaux.length > 0) && (
            <section aria-label="Captures d'écran" className="mt-10 border-t border-line pt-16">
              <h2 className="font-mono text-xs tracking-[0.22em] text-accent uppercase">Aperçus</h2>
              <div className="mt-10 grid gap-6 md:grid-cols-12">
                {bureaux.map((c) => (
                  <div key={c.alt} className="md:col-span-8">
                    <BrowserMockup media={c} sizes="(min-width: 768px) 60vw, 92vw" />
                  </div>
                ))}
                {mobiles.length > 0 && (
                  <div className="flex gap-6 md:col-span-4">
                    {mobiles.map((c) => (
                      <PhoneMockup key={c.alt} media={c} className="w-1/2 md:w-full md:max-w-60" />
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          <div className="mt-16">
            <Bloc titre="Résultat">
              <p>{projet.resultat}</p>
            </Bloc>
          </div>
        </Container>

        {suivant && suivant.slug !== projet.slug && (
          <Link href={`/developpement/${suivant.slug}`} className="group mt-16 block border-t border-line bg-surface">
            <Container className="flex items-center justify-between gap-6 py-14 lg:py-20">
              <div>
                <Eyebrow>Projet suivant</Eyebrow>
                <p className="mt-3 text-4xl font-semibold tracking-tight lg:text-6xl">{suivant.nom}</p>
              </div>
              <span className="inline-flex size-14 items-center justify-center rounded-full bg-accent text-accent-ink lg:size-20">
                <Arrow className="size-5" />
              </span>
            </Container>
          </Link>
        )}
      </article>
    </PageTransition>
  );
}
