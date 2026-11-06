"use client";

import { Children, useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

const DUREE_MS = 6500;

function Fleche({ sens, onClick }: { sens: "precedente" | "suivante"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={sens === "precedente" ? "Diapositive précédente" : "Diapositive suivante"}
      className={cn(
        "absolute top-1/2 z-20 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/40 md:flex",
        sens === "precedente" ? "left-6" : "right-6",
      )}
    >
      <svg aria-hidden viewBox="0 0 16 16" className={cn("size-4", sens === "precedente" && "rotate-180")} fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M1 8h13M9 3l5 5-5 5" />
      </svg>
    </button>
  );
}

/**
 * Diaporama en fondu. Il défile seul, sauf au survol, au clavier, ou si le
 * système demande de réduire les animations.
 */
export function Diaporama({ children, label, className }: { children: ReactNode; label: string; className?: string }) {
  const diapos = Children.toArray(children);
  const [actif, setActif] = useState(0);
  const [pause, setPause] = useState(false);
  const nombre = diapos.length;

  useEffect(() => {
    if (pause || nombre < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const minuteur = setInterval(() => setActif((a) => (a + 1) % nombre), DUREE_MS);
    return () => clearInterval(minuteur);
  }, [pause, nombre]);

  return (
    <section
      aria-roledescription="carrousel"
      aria-label={label}
      className={cn("relative overflow-hidden bg-[#020d26]", className)}
      onMouseEnter={() => setPause(true)}
      onMouseLeave={() => setPause(false)}
      onFocusCapture={() => setPause(true)}
      onBlurCapture={() => setPause(false)}
    >
      {diapos.map((diapo, i) => (
        <div
          key={i}
          aria-roledescription="diapositive"
          aria-label={`${i + 1} sur ${nombre}`}
          aria-hidden={i !== actif}
          inert={i !== actif}
          // L'ancienne diapositive s'efface avant que la suivante apparaisse : les textes ne se chevauchent pas.
          className={cn("absolute inset-0 transition-opacity", i === actif ? "z-10 opacity-100 delay-300 duration-700" : "opacity-0 duration-300")}
        >
          {diapo}
        </div>
      ))}

      {nombre > 1 && (
        <>
          <Fleche sens="precedente" onClick={() => setActif((actif - 1 + nombre) % nombre)} />
          <Fleche sens="suivante" onClick={() => setActif((actif + 1) % nombre)} />
          <div className="absolute inset-x-0 bottom-6 z-20 flex justify-center gap-2">
            {diapos.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActif(i)}
                aria-label={`Aller à la diapositive ${i + 1}`}
                aria-current={i === actif}
                className={cn("size-2.5 rounded-full transition-colors", i === actif ? "bg-white" : "bg-white/40 hover:bg-white/70")}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
