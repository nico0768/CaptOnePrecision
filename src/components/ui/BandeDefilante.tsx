"use client";

import { useRef, type ReactNode } from "react";

/** Rangée à faire défiler à la main, au doigt ou avec les deux flèches. */
export function BandeDefilante({ children, label }: { children: ReactNode; label: string }) {
  const rangee = useRef<HTMLUListElement>(null);
  const defiler = (sens: 1 | -1) => {
    const el = rangee.current;
    if (el) el.scrollBy({ left: sens * el.clientWidth * 0.6, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <ul ref={rangee} aria-label={label} tabIndex={0} className="sans-barre flex snap-x snap-mandatory justify-center-safe overflow-x-auto">
        {children}
      </ul>
      <div className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 gap-3">
        {([-1, 1] as const).map((sens) => (
          <button
            key={sens}
            type="button"
            onClick={() => defiler(sens)}
            aria-label={sens < 0 ? "Projets précédents" : "Projets suivants"}
            className="flex size-12 items-center justify-center bg-bg text-ink shadow-lg transition-colors hover:bg-accent hover:text-accent-ink"
          >
            <svg aria-hidden viewBox="0 0 16 16" className={`size-4 ${sens < 0 ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 8h13M9 3l5 5-5 5" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
