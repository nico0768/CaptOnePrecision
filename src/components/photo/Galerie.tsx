"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import type { CategoriePhoto, Photo } from "@/lib/types";
import { MediaImage } from "@/components/ui/MediaImage";
import { cn } from "@/lib/cn";
import { Lightbox } from "./Lightbox";

const PAR_PAGE = 16;

/** Galerie en mosaïque : filtres par catégorie, affichage progressif et plein écran. */
export function Galerie({ photos, categories }: { photos: Photo[]; categories: CategoriePhoto[] }) {
  const [filtre, setFiltre] = useState("tout");
  const [limite, setLimite] = useState(PAR_PAGE);
  const [ouverte, setOuverte] = useState<number | null>(null);

  // Seules les catégories qui contiennent des photos sont proposées
  const disponibles = useMemo(
    () => categories.filter((c) => photos.some((p) => p.categorie === c.slug)),
    [categories, photos],
  );
  const filtrees = useMemo(
    () => (filtre === "tout" ? photos : photos.filter((p) => p.categorie === filtre)),
    [filtre, photos],
  );
  const visibles = filtrees.slice(0, limite);
  const labels = useMemo(() => Object.fromEntries(categories.map((c) => [c.slug, c.label])), [categories]);

  return (
    <>
      <div role="group" aria-label="Filtrer par catégorie" className="flex flex-wrap justify-center gap-x-2 gap-y-3">
        {[{ slug: "tout", label: "Toutes les photos" }, ...disponibles].map((c) => {
          const actif = filtre === c.slug;
          return (
            <button
              key={c.slug}
              type="button"
              aria-pressed={actif}
              onClick={() => {
                setFiltre(c.slug);
                setLimite(PAR_PAGE);
              }}
              className={cn(
                "relative px-4 py-3 text-[11px] font-semibold tracking-[0.12em] uppercase transition-colors",
                actif ? "filtre-actif text-ink" : "text-muted hover:text-ink",
              )}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {filtrees.length} photographie{filtrees.length > 1 ? "s" : ""} affichée{filtrees.length > 1 ? "s" : ""}
      </p>

      <ul className="mt-8 columns-2 gap-1 md:columns-3 lg:columns-4 [&>li]:mb-1">
        <AnimatePresence mode="popLayout">
          {visibles.map((photo, i) => (
            <motion.li
              key={photo.id}
              className="break-inside-avoid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                type="button"
                onClick={() => setOuverte(i)}
                className="group relative block w-full overflow-hidden text-left"
                aria-label={`Agrandir : ${photo.image.alt}`}
              >
                <div className="transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.03]">
                  <MediaImage media={photo.image} sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw" />
                </div>
                <span className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-black/55 p-4 text-center text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="font-heading text-2xl">{photo.legende || labels[photo.categorie]}</span>
                  <span className="mt-1 text-[11px] tracking-[0.15em] uppercase">Agrandir</span>
                </span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {filtrees.length > limite && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setLimite((l) => l + PAR_PAGE)}
            className="border-2 border-ink px-6 py-3 text-[11px] font-semibold tracking-[0.2em] uppercase transition-colors hover:bg-ink hover:text-bg"
          >
            Voir plus de photos
          </button>
        </div>
      )}

      <Lightbox
        elements={visibles.map((p) => ({ media: p.image, legende: p.legende }))}
        index={ouverte}
        onChange={setOuverte}
      />
    </>
  );
}
