import type { Metadata } from "next";
import type { EtapeParcours } from "@/lib/types";
import { MediaImage } from "@/components/ui/MediaImage";
import { Container, Eyebrow, PageTransition, Todo } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { site } from "@/content/site";
import { getContenu } from "@/lib/contenu";

export const metadata: Metadata = {
  title: "À propos",
  description: "Parcours, formation, expériences et compétences derrière Capt One PRECISION : développement web, photographie et graphisme.",
  alternates: { canonical: "/a-propos" },
};

function Chronologie({ etapes, vide }: { etapes: EtapeParcours[]; vide: string }) {
  if (etapes.length === 0) return <Todo>{vide}</Todo>;
  return (
    <ol className="divide-y divide-line border-y border-line">
      {etapes.map((e) => (
        <li key={`${e.periode}-${e.titre}`} className="grid gap-2 py-6 sm:grid-cols-[10rem_1fr]">
          <p className="font-mono text-xs text-muted">{e.periode}</p>
          <div>
            <p className="font-serif text-2xl">{e.titre}</p>
            <p className="text-sm text-muted">{e.structure}</p>
            {e.description && <p className="mt-2 max-w-xl text-sm leading-relaxed">{e.description}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

const groupesCompetences = [
  { titre: "Développement", cle: "developpement" },
  { titre: "Photographie", cle: "photographie" },
  { titre: "Graphisme", cle: "graphisme" },
] as const;

export default async function AProposPage() {
  const { aPropos } = await getContenu();
  return (
    <PageTransition>
      <section className="pt-32 pb-20 lg:pt-44 lg:pb-28">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow className="fade-up">À propos</Eyebrow>
            <h1 className="mt-8 font-serif text-[clamp(3rem,9vw,8rem)] leading-[0.9] tracking-tight">
              <SplitText text="Un regard," />
              <br />
              <SplitText text="trois langages." offset={10} className="italic" />
            </h1>
            <p className="fade-up mt-10 max-w-xl text-lg leading-relaxed" style={{ "--i": 4 } as React.CSSProperties}>
              {aPropos.intro}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 self-end lg:col-span-5">
            {aPropos.photos.slice(0, 2).map((photo, i) => (
              <div key={i} className={`relative col-span-2 aspect-[4/5] sm:col-span-1 ${i === 0 ? "sm:mt-24" : ""}`}>
                <MediaImage media={photo} fill preload={i === 0} sizes="(min-width: 1024px) 20vw, 45vw" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Container className="space-y-24 pb-24 lg:space-y-32 lg:pb-36">
        <Reveal className="grid gap-8 lg:grid-cols-12">
          <h2 className="font-serif text-4xl lg:col-span-3">Expériences</h2>
          <div className="lg:col-span-9">
            <Chronologie etapes={aPropos.experiences} vide="Expériences à compléter à partir du CV" />
          </div>
        </Reveal>

        <Reveal className="grid gap-8 lg:grid-cols-12">
          <h2 className="font-serif text-4xl lg:col-span-3">Formation</h2>
          <div className="lg:col-span-9">
            <Chronologie etapes={aPropos.formation} vide="Formation à compléter à partir du CV" />
          </div>
        </Reveal>

        <Reveal className="grid gap-8 lg:grid-cols-12">
          <h2 className="font-serif text-4xl lg:col-span-3">Compétences</h2>
          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-9">
            {groupesCompetences.map((g) => {
              const liste = aPropos.competences[g.cle];
              return (
                <div key={g.cle}>
                  <Eyebrow>{g.titre}</Eyebrow>
                  {liste.length > 0 ? (
                    <ul className="mt-4 space-y-1.5">
                      {liste.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4">
                      <Todo>À compléter</Todo>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </Reveal>

        <Reveal className="grid gap-8 lg:grid-cols-12">
          <h2 className="font-serif text-4xl lg:col-span-3">Engagements</h2>
          <div className="lg:col-span-9">
            {aPropos.engagements.length > 0 ? (
              <ul className="space-y-3 font-serif text-2xl">
                {aPropos.engagements.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            ) : (
              <Todo>Engagements à compléter</Todo>
            )}
          </div>
        </Reveal>

        <Reveal className="flex flex-col items-start justify-between gap-6 border-t border-line pt-10 sm:flex-row sm:items-center">
          <p className="font-serif text-3xl">Le parcours complet, en un document.</p>
          {site.cv.disponible ? (
            <a
              href={site.cv.href}
              download
              className="inline-flex items-center gap-3 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-accent-ink"
            >
              Télécharger mon CV (PDF)
            </a>
          ) : (
            <Todo>CV à déposer dans public/cv/</Todo>
          )}
        </Reveal>
      </Container>
    </PageTransition>
  );
}
