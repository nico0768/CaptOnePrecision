import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Exposition } from "@/components/graphisme/Exposition";
import { Eventail, FenetreCreations, FenetreEcriture, OngletsOutils } from "@/components/graphisme/Interactifs";
import { MediaImage } from "@/components/ui/MediaImage";
import { Container, PageTransition } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { reseauxAffiches } from "@/content/site";
import { categoriesGraphisme, labelCategorieGraphisme } from "@/content/graphisme";
import { getContenu } from "@/lib/contenu";

export const metadata: Metadata = {
  title: "Graphisme",
  description:
    "Créations graphiques de Capt One PRECISION : identités visuelles, logos, chartes graphiques, affiches, supports de communication, design éditorial et packaging.",
  alternates: { canonical: "/graphisme" },
};

/** Grand titre en deux tons : « Savoir » en noir, « faire. » en gris. */
function GrandTitre({ fort, pale }: { fort: string; pale: string }) {
  return (
    <h2 className="text-[clamp(2.75rem,6vw,5rem)] leading-none font-black tracking-tight uppercase">
      {fort} <span className="text-muted/40">{pale}</span>
    </h2>
  );
}

/** Courbes de Bézier avec leurs points d'ancrage, qui se dessinent à l'ouverture. */
function Courbes() {
  const traces = [
    "M-20 90 C 120 10, 180 220, 330 140",
    "M-20 500 C 140 420, 90 640, 300 560",
    "M1460 150 C 1300 40, 1260 280, 1110 190",
    "M1460 560 C 1320 470, 1280 680, 1120 590",
  ];
  const ancres = [[330, 140], [300, 560], [1110, 190], [1120, 590]];
  return (
    <svg aria-hidden viewBox="0 0 1440 720" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full text-[#4aa3ea]/60">
      {traces.map((d, i) => (
        <path key={d} d={d} pathLength={1} fill="none" stroke="currentColor" strokeWidth="1.5" className="trace" style={{ "--i": i } as CSSProperties} />
      ))}
      {ancres.map(([x, y]) => (
        <g key={x}>
          <rect x={x - 5} y={y - 5} width="10" height="10" fill="#09090b" stroke="currentColor" strokeWidth="1.5" />
          <circle cx={x} cy={y} r="26" fill="currentColor" opacity="0.08" />
        </g>
      ))}
    </svg>
  );
}

const placesMots = ["top-[14%] left-[7%]", "top-[9%] left-[42%]", "top-[20%] right-[8%]", "bottom-[16%] left-[10%]", "bottom-[14%] right-[11%]"];

export default async function GraphismePage() {
  const { graphisme: g, identite } = await getContenu();
  const mots = g.apropos.titre.trim().split(" ");
  const dernierMot = mots.pop();

  // Éventail : les projets au centre, encadrés par les savoir-faire.
  const cartesProjets = g.projets
    .filter((p) => !p.exemple)
    .map((p) => ({
      periode: ["Projet", p.annee].filter(Boolean).join(" · "),
      titre: p.titre,
      sousTitre: p.categories.map(labelCategorieGraphisme).join(", "),
      texte: p.resume,
      image: p.visuelPrincipal,
      href: `/graphisme/${p.slug}`,
    }));
  const milieu = Math.ceil(g.savoirFaire.cartes.length / 2);
  const cartesEventail = [...g.savoirFaire.cartes.slice(0, milieu), ...cartesProjets, ...g.savoirFaire.cartes.slice(milieu)];

  return (
    <PageTransition>
      {/* Ouverture sombre */}
      <section className="sombre fond-grille relative flex min-h-dvh items-center overflow-hidden bg-[#09090b] py-28 text-white">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#0c2a4a_0%,transparent_60%)]" />
        <Courbes />
        {g.hero.mots.slice(0, placesMots.length).map((mot, i) => (
          <span
            key={mot}
            aria-hidden
            style={{ "--i": i } as CSSProperties}
            className={`flotte absolute hidden text-2xl font-black text-[#4aa3ea]/25 lg:block ${placesMots[i]}`}
          >
            {mot}
          </span>
        ))}
        <Container className="relative">
          <FenetreEcriture fenetre={g.hero.fenetre} commande={g.hero.commande} phrase={g.hero.phrase} />
        </Container>
      </section>

      {/* À propos */}
      <section className="py-20 lg:py-28">
        <Container className="grid items-center gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="flex items-center gap-4 text-xs font-bold tracking-[0.25em] uppercase">
              {g.apropos.surtitre} <span aria-hidden className="h-px w-12 bg-line" />
            </p>
            <h2 className="mt-6 text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] font-light tracking-tight">
              {mots.join(" ")} <span className="font-serif font-normal italic">{dernierMot}</span>
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-muted">{g.apropos.texte}</p>
            <ul className="mt-8 flex flex-wrap gap-2 text-sm">
              <li>
                <a href={`mailto:${identite.email}`} className="inline-block rounded-full border border-line px-4 py-2 transition-colors hover:border-accent hover:text-accent">
                  {identite.email}
                </a>
              </li>
              {identite.telephones.map((n) => (
                <li key={n}>
                  <a href={`tel:${n.replace(/\s/g, "")}`} className="inline-block rounded-full border border-line px-4 py-2 transition-colors hover:border-accent hover:text-accent">
                    {n}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl lg:col-span-4 lg:col-start-9">
            <MediaImage media={g.apropos.image} fill sizes="(min-width: 1024px) 30vw, 92vw" />
          </Reveal>
        </Container>

        {/* Démarche */}
        <Container className="mt-20">
          <p className="flex items-center gap-4 text-xs font-bold tracking-[0.25em] uppercase">
            {g.demarche.titre} <span aria-hidden className="h-px flex-1 bg-line" />
          </p>
          <ol className="mt-8 grid gap-10 md:grid-cols-3">
            {g.demarche.etapes.map((e, i) => (
              <li key={i}>
                <div aria-hidden className="flex items-center gap-2">
                  <span className="size-4 rounded-full bg-accent" />
                  <span className="h-1 flex-1 rounded-full bg-accent/25" />
                </div>
                <p className="mt-4 text-xs text-muted">{e.periode}</p>
                <h3 className="mt-1 text-lg font-bold">{e.titre}</h3>
                <p className="mt-1 text-sm text-muted">{e.texte}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Savoir-faire */}
      <section className="overflow-hidden bg-surface py-20 lg:py-28">
        <Container>
          <GrandTitre fort={g.savoirFaire.fort} pale={g.savoirFaire.pale} />
          <div className="mt-12">
            <Eventail cartes={cartesEventail} />
          </div>
        </Container>
      </section>

      {/* Créations visuelles */}
      <section className="sombre bg-[#09090b] py-24 text-ink lg:py-32">
        <Container>
          <FenetreCreations
            titre={
              <>
                {g.creations.fort}
                <br />
                <span className="text-[#4aa3ea]">{g.creations.accent}</span>
              </>
            }
            texte={g.creations.texte}
            projets={g.projets.map((p) => ({ slug: p.slug, titre: p.titre, image: p.visuelPrincipal }))}
          />
        </Container>
      </section>

      {/* Projets */}
      <section aria-label="Projets" className="py-20 lg:py-28">
        <Container>
          <GrandTitre fort={g.realisations.fort} pale={g.realisations.pale} />
          <div className="mt-10">
            <Exposition projets={g.projets} categories={categoriesGraphisme} />
          </div>
        </Container>
      </section>

      {/* Domaines d'expertise */}
      <section className="border-t border-line py-20 lg:py-28">
        <Container>
          <div className="grid items-end gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <GrandTitre fort={g.outils.fort} pale={g.outils.pale} />
            </div>
            <p className="text-sm text-muted lg:col-span-4">{g.outils.texte}</p>
          </div>
          <div className="mt-12">
            <OngletsOutils groupes={g.outils.groupes} />
          </div>
        </Container>
      </section>

      {/* Contact */}
      <section className="sombre bg-[#09090b] py-20 text-ink lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-5xl font-bold tracking-tight">{g.contact.titre}</h2>
            <p className="mt-5 max-w-sm text-muted">{g.contact.texte}</p>
            <a href={`mailto:${identite.email}`} className="mt-8 inline-block border-b border-ink pb-1 text-lg font-semibold">
              {identite.email}
            </a>
          </div>
          <div>
            <p className="text-xs text-muted">Réseaux</p>
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {reseauxAffiches(identite).map((r) => (
                <li key={r.label}>
                  {r.href ? (
                    <a href={r.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between py-4 text-2xl font-semibold transition-colors hover:text-[#4aa3ea]">
                      {r.label} <span aria-hidden className="text-base text-muted">↗</span>
                    </a>
                  ) : (
                    <span className="flex items-center justify-between py-4 text-2xl font-semibold text-muted" title="Lien à renseigner dans le tableau de bord">
                      {r.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    </PageTransition>
  );
}
