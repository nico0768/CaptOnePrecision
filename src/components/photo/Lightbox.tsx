"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef } from "react";
import type { Media } from "@/lib/types";
import { MediaImage } from "@/components/ui/MediaImage";

export type ElementLightbox = { media: Media; legende?: string };

type Props = {
  elements: ElementLightbox[];
  /** Index affiché, ou null si la lightbox est fermée. */
  index: number | null;
  onChange: (index: number | null) => void;
};

/**
 * Affichage plein écran : flèches du clavier, Échap, glisser sur mobile.
 * Le focus est placé dans la lightbox puis restitué à la fermeture.
 */
export function Lightbox({ elements, index, onChange }: Props) {
  const ouvert = index !== null;
  const fermerRef = useRef<HTMLButtonElement>(null);
  const declencheurRef = useRef<Element | null>(null);
  const total = elements.length;

  const aller = useCallback(
    (delta: number) => {
      if (index === null) return;
      onChange((index + delta + total) % total);
    },
    [index, onChange, total],
  );

  useEffect(() => {
    if (!ouvert) return;
    declencheurRef.current = document.activeElement;
    fermerRef.current?.focus();
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      if (e.key === "ArrowRight") aller(1);
      if (e.key === "ArrowLeft") aller(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      (declencheurRef.current as HTMLElement | null)?.focus?.();
    };
  }, [ouvert, aller, onChange]);

  // Précharge l'image suivante pour une navigation instantanée
  const suivante = index !== null && total > 1 ? elements[(index + 1) % total] : null;

  return (
    <AnimatePresence>
      {ouvert && index !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Visionneuse de photographies"
          className="fixed inset-0 z-[80] flex flex-col bg-[#0a0a09]/97 text-[#f2f0ec]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex items-center justify-between px-5 py-4 font-mono text-xs sm:px-8">
            <span aria-live="polite">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <button
              ref={fermerRef}
              type="button"
              onClick={() => onChange(null)}
              className="rounded-full border border-white/20 px-4 py-2 tracking-widest uppercase hover:border-white"
            >
              Fermer
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 sm:px-20">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.figure
                key={index}
                className="flex h-full w-full flex-col items-center justify-center"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                drag={total > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) aller(1);
                  else if (info.offset.x > 80) aller(-1);
                }}
              >
                <div
                  className="relative max-h-[78vh] w-full"
                  style={{
                    aspectRatio: `${elements[index].media.width} / ${elements[index].media.height}`,
                    maxWidth: `calc(78vh * ${elements[index].media.width / elements[index].media.height})`,
                  }}
                >
                  <MediaImage media={elements[index].media} fill quality={90} sizes="100vw" className="object-contain" />
                </div>
                {elements[index].legende && (
                  <figcaption className="mt-4 font-serif text-lg italic text-white/70">{elements[index].legende}</figcaption>
                )}
              </motion.figure>
            </AnimatePresence>

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => aller(-1)}
                  aria-label="Photo précédente"
                  className="absolute top-1/2 left-3 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 hover:border-white sm:flex"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => aller(1)}
                  aria-label="Photo suivante"
                  className="absolute top-1/2 right-3 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 hover:border-white sm:flex"
                >
                  →
                </button>
              </>
            )}
          </div>

          <p className="py-4 text-center font-mono text-[10px] tracking-widest text-white/40 uppercase sm:hidden">
            Glisser pour naviguer
          </p>

          {suivante?.media.src && (
            <div hidden>
              <MediaImage media={suivante.media} fill quality={90} sizes="100vw" />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
