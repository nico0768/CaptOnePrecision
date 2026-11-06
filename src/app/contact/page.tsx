import type { Metadata } from "next";
import { FormulaireContact } from "@/components/contact/FormulaireContact";
import { Container, Eyebrow, PageTransition, Todo } from "@/components/ui/primitives";
import { SplitText } from "@/components/ui/SplitText";
import { lienWhatsapp, site as reglages } from "@/content/site";
import { getContenu } from "@/lib/contenu";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contacter Capt One PRECISION pour un projet de site web, de photographie ou de graphisme.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const { identite: site } = await getContenu();
  const whatsapp = lienWhatsapp(site);
  const reseaux = site.reseaux.filter((r) => r.href);

  return (
    <PageTransition>
      <section className="pt-32 pb-24 lg:pt-44 lg:pb-36">
        <Container>
          <Eyebrow className="fade-up">Contact</Eyebrow>
          <h1 className="mt-8 font-serif text-[clamp(3rem,10vw,9rem)] leading-[0.88] tracking-tight">
            <SplitText text="Parlons de" />
            <br />
            <SplitText text="votre projet." offset={10} className="italic" />
          </h1>

          <div className="mt-20 grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <FormulaireContact />
            </div>

            <aside className="space-y-10 lg:col-span-4 lg:col-start-9">
              <div>
                <Eyebrow>Directement</Eyebrow>
                <ul className="mt-4 space-y-3 text-lg">
                  <li>
                    {site.email ? (
                      <a href={`mailto:${site.email}`} className="link-underline pb-0.5">
                        {site.email}
                      </a>
                    ) : (
                      <Todo>E-mail à renseigner</Todo>
                    )}
                  </li>
                  {site.telephones.map((n) => (
                    <li key={n}>
                      <a href={`tel:${n.replace(/\s/g, "")}`} className="link-underline pb-0.5">
                        {n}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                {whatsapp ? (
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 rounded-full bg-[#1f8f4e] px-6 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden className="size-4" fill="currentColor">
                      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.3-.5 0-1 .3-3.3-.7-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c0 .2.1.4 0 .6l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.6.3 0 .2 0 .8-.2 1.4Z" />
                    </svg>
                    Écrire sur WhatsApp
                  </a>
                ) : (
                  <Todo>Numéro WhatsApp à renseigner</Todo>
                )}
              </div>

              <div>
                <Eyebrow>Réseaux</Eyebrow>
                {reseaux.length > 0 ? (
                  <ul className="mt-4 space-y-2">
                    {reseaux.map((r) => (
                      <li key={r.label}>
                        <a href={r.href} target="_blank" rel="noopener noreferrer" className="link-underline pb-0.5">
                          {r.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4">
                    <Todo>Liens à renseigner</Todo>
                  </p>
                )}
              </div>

              <div>
                <Eyebrow>CV</Eyebrow>
                <p className="mt-4">
                  {reglages.cv.disponible ? (
                    <a href={reglages.cv.href} download className="link-underline pb-0.5">
                      Télécharger mon CV (PDF)
                    </a>
                  ) : (
                    <Todo>CV à déposer dans public/cv/</Todo>
                  )}
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </PageTransition>
  );
}
