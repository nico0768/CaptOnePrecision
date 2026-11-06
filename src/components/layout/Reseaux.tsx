import { cn } from "@/lib/cn";

const TRACES: Record<string, string> = {
  whatsapp:
    "M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.3-.5 0-1 .3-3.3-.7-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c0 .2.1.4 0 .6l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.6.3 0 .2 0 .8-.2 1.4Z",
  facebook: "M14 8.5V6.7c0-.8.5-1 1-1h1.9V2.4L14.3 2.4C11.3 2.4 10 4.2 10 6.4v2.1H7.5V12H10v9.6h4V12h2.6l.4-3.5H14Z",
  behance:
    "M8.2 11.2c1-.5 1.5-1.2 1.5-2.4C9.7 6.5 8 5.9 6 5.9H0v12.2h6.2c2.3 0 4.5-1.1 4.5-3.7 0-1.6-.8-2.8-2.5-3.2ZM2.7 8h2.6c1 0 1.9.3 1.9 1.4 0 1-.7 1.5-1.7 1.5H2.7V8Zm3 8H2.7v-3.4h3c1.2 0 2 .5 2 1.7 0 1.3-1 1.7-2 1.7ZM21.6 7h-6.2V5.5h6.2V7Zm2.4 6.9c0-2.7-1.6-4.9-4.4-4.9-2.8 0-4.6 2.1-4.6 4.8 0 2.8 1.7 4.7 4.6 4.7 2.2 0 3.6-1 4.3-3.1h-2.2c-.2.8-1.2 1.2-2 1.2-1.5 0-2.3-.9-2.3-2.4h6.6v-.3Zm-6.6-1.1c.1-1.2.9-2 2.2-2 1.4 0 2 .8 2.1 2h-4.3Z",
  tiktok:
    "M16.6 2h-3.2v13.3a2.9 2.9 0 1 1-2-2.8V9.2a6.2 6.2 0 1 0 5.2 6.1V8.7a7.6 7.6 0 0 0 4.4 1.4V6.9a4.5 4.5 0 0 1-4.4-4.9Z",
};

export function IconeReseau({ label, className }: { label: string; className?: string }) {
  const trace = TRACES[label.trim().toLowerCase()];
  if (!trace) return <span aria-hidden className={cn("text-xs font-semibold uppercase", className)}>{label.slice(0, 2)}</span>;
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("size-4", className)} fill="currentColor">
      <path d={trace} />
    </svg>
  );
}

/** Icônes des réseaux. Un réseau sans lien reste visible, mais n'est pas cliquable. */
export function Reseaux({ liens, avecNom, className }: { liens: { label: string; href: string }[]; avecNom?: boolean; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {liens.map((r) => {
        const interieur = (
          <>
            <IconeReseau label={r.label} />
            {avecNom ? <span>{r.label}</span> : <span className="sr-only">{r.label}</span>}
          </>
        );
        const style = cn(
          "inline-flex h-10 items-center justify-center gap-2 border border-line text-sm transition-colors",
          avecNom ? "rounded-full px-4" : "w-10",
        );
        return (
          <li key={r.label}>
            {r.href ? (
              <a href={r.href} target="_blank" rel="noopener noreferrer" className={cn(style, "hover:border-accent hover:bg-accent hover:text-accent-ink")}>
                {interieur}
              </a>
            ) : (
              <span className={cn(style, "text-muted")} title="Lien à renseigner dans le tableau de bord">
                {interieur}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
