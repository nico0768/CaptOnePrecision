import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ViewTransition } from "react";
import { cn } from "@/lib/cn";

export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12", className)} {...props} />;
}

/** Enveloppe de page : active la transition d'entrée / sortie entre les pages. */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}

/** Petit libellé au-dessus des titres, ex. « 01 — Projets ». */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("font-mono text-[11px] tracking-[0.22em] text-muted uppercase", className)}>{children}</p>
  );
}

export function SectionTitle({
  index,
  label,
  title,
  className,
}: {
  index?: string;
  label: string;
  title: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-12", className)}>
      <Eyebrow className="md:col-span-3 md:pt-3">
        {index ? `${index} — ` : ""}
        {label}
      </Eyebrow>
      <h2 className="font-heading text-4xl leading-[1.02] tracking-tight text-balance md:col-span-9 md:text-6xl">
        {title}
      </h2>
    </div>
  );
}

/** Titre en deux tons, avec un trait en dessous (accueil). */
export function TitreSection({
  surtitre,
  fort,
  fin,
  centre,
  className,
}: {
  surtitre: string;
  fort: string;
  fin: string;
  centre?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(centre && "text-center", className)}>
      <p className="text-xs font-semibold tracking-[0.25em] text-accent uppercase">{surtitre}</p>
      <h2 className="mt-3 font-heading text-4xl leading-[1.1] lg:text-5xl">
        <span className="block font-bold">{fort}</span>
        <span className="block font-normal">{fin}</span>
      </h2>
      <span aria-hidden className={cn("mt-5 flex gap-1", centre && "justify-center")}>
        <span className="h-0.5 w-10 bg-accent" />
        <span className="h-0.5 w-3 bg-accent" />
      </span>
    </div>
  );
}

type ArrowLinkProps = ComponentProps<typeof Link> & { variant?: "solid" | "outline" | "text" };

export function ArrowLink({ variant = "text", className, children, ...props }: ArrowLinkProps) {
  return (
    <Link
      className={cn(
        "group inline-flex items-center gap-3 text-sm font-medium transition-colors duration-300",
        variant === "solid" &&
          "rounded-full bg-accent px-6 py-3.5 text-accent-ink hover:opacity-90",
        variant === "outline" &&
          "rounded-full border border-ink/25 px-6 py-3.5 hover:border-ink",
        variant === "text" && "link-underline pb-0.5",
        className,
      )}
      {...props}
    >
      {children}
      <Arrow />
    </Link>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className={cn("size-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M1 8h13M9 3l5 5-5 5" />
    </svg>
  );
}

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-line px-3 py-1 text-xs text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Signale un contenu manquant à compléter (visible pendant le développement). */
export function Todo({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 border border-dashed border-current px-2.5 py-1 font-mono text-[11px] tracking-wide text-muted">
      <span aria-hidden>✎</span>
      {children}
    </span>
  );
}

/** Bandeau signalant un contenu de démonstration. */
export function BandeauExemple() {
  return (
    <div className="border-y border-dashed border-current py-3 text-center font-mono text-xs tracking-wide text-muted">
      Contenu de démonstration — à remplacer par une vraie réalisation depuis le tableau de bord
    </div>
  );
}
