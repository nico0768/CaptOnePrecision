import { LogoSymbole } from "@/components/layout/Logo";

/** Carte centrée des pages Connexion et Inscription. */
export function CadreCompte({ titre, texte, children }: { titre: string; texte: string; children: React.ReactNode }) {
  return (
    <div data-univers="accueil" className="px-5 pt-24 pb-16 lg:pt-36 lg:pb-24">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-line bg-surface p-6 sm:p-8">
        <LogoSymbole className="h-9 text-accent" />
        <h1 className="mt-5 font-heading text-4xl font-bold">{titre}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">{texte}</p>
        <div className="mt-7">{children}</div>
      </div>
    </div>
  );
}

export const ChargementCompte = () => <p className="px-5 pt-32 pb-20 text-center text-sm text-muted">Chargement…</p>;
