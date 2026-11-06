import { MediaImage } from "@/components/ui/MediaImage";
import { Container } from "@/components/ui/primitives";
import type { Temoignage } from "@/lib/types";

/** Bandeau sombre de témoignages. Rien n'est affiché tant qu'il n'y en a aucun. */
export function Temoignages({ liste, titre, classeSombre = "sombre-nuit" }: { liste: Temoignage[]; titre: string; classeSombre?: string }) {
  if (liste.length === 0) return null;
  return (
    <section aria-label={titre} className={`${classeSombre} bg-bg py-20 text-ink lg:py-28`}>
      <Container>
        <h2 className="text-center font-heading text-4xl">{titre}</h2>
        <ul className="mx-auto mt-14 grid max-w-6xl gap-10 md:grid-cols-2 lg:grid-cols-3">
          {liste.map((t, i) => (
            <li key={i} className="text-center">
              <div className="relative mx-auto size-20 overflow-hidden rounded-full">
                <MediaImage media={{ ...t.photo, alt: t.photo.alt || t.nom }} fill sizes="80px" />
              </div>
              <p className="mt-4 font-semibold">{t.nom}</p>
              {t.role && <p className="text-sm text-muted">{t.role}</p>}
              <blockquote className="mt-4 leading-relaxed text-muted">« {t.texte} »</blockquote>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
