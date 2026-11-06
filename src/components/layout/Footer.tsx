import Link from "next/link";
import { cacheLife } from "next/cache";
import { Container } from "@/components/ui/primitives";
import { navigation, reseauxAffiches } from "@/content/site";
import type { Contenu } from "@/lib/types";
import { Logo } from "./Logo";
import { Reseaux } from "./Reseaux";

/** Année courante, mise en cache pour garder la page statique. */
async function Annee() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

function Titre({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-6 font-heading text-lg font-semibold uppercase">
      {children}
      <span aria-hidden className="mt-3 flex gap-1">
        <span className="h-0.5 w-7 bg-accent" />
        <span className="h-0.5 w-2 bg-accent" />
      </span>
    </h2>
  );
}

export function Footer({ identite }: { identite: Contenu["identite"] }) {
  return (
    <footer data-pied className="pied mt-auto bg-bg text-ink">
      <Container className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-5">
          <Logo />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">{identite.titre}</p>
          {identite.localisation && <p className="mt-2 text-sm text-muted">{identite.localisation}</p>}
        </div>

        <nav aria-label="Pied de page" className="hidden md:block lg:col-span-3">
          <Titre>Navigation</Titre>
          <ul className="space-y-2 text-sm text-muted">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-underline pb-0.5 hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-2 lg:col-span-4">
          <Titre>Contact</Titre>
          <dl className="space-y-2 text-sm">
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-muted">E-mail :</dt>
              <dd>
                <a href={`mailto:${identite.email}`} className="link-underline pb-0.5">
                  {identite.email}
                </a>
              </dd>
            </div>
            {identite.telephones.length > 0 && (
              <div className="flex gap-x-2">
                <dt className="text-muted">Téléphone :</dt>
                <dd>
                  <ul className="space-y-1">
                    {identite.telephones.map((n) => (
                      <li key={n}>
                        <a href={`tel:${n.replace(/\s/g, "")}`} className="link-underline pb-0.5 whitespace-nowrap">
                          {n}
                        </a>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </dl>
          <p className="mt-6 mb-3 text-sm text-muted">Réseaux sociaux</p>
          <Reseaux liens={reseauxAffiches(identite)} avecNom />
        </div>
      </Container>
      <Container className="flex flex-col gap-2 border-t border-line py-6 text-xs text-muted sm:flex-row sm:justify-between">
        <p>
          © <Annee /> {identite.nom}. Tous droits réservés.
        </p>
        <p>Photographies et créations protégées — reproduction interdite sans accord.</p>
      </Container>
    </footer>
  );
}
