"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import type { CategorieGraphisme, ProjetGraphisme } from "@/lib/types";
import { MediaImage } from "@/components/ui/MediaImage";
import { cn } from "@/lib/cn";

/**
 * Les créations présentées comme des œuvres accrochées :
 * numéro d'œuvre, cartel (titre, client, année, catégories).
 */
export function Exposition({
  projets,
  categories,
}: {
  projets: ProjetGraphisme[];
  categories: CategorieGraphisme[];
}) {
  const [filtre, setFiltre] = useState("tout");
  const disponibles = useMemo(
    () => categories.filter((c) => projets.some((p) => p.categories.includes(c.slug))),
    [categories, projets],
  );
  const visibles = filtre === "tout" ? projets : projets.filter((p) => p.categories.includes(filtre));
  const labels = Object.fromEntries(categories.map((c) => [c.slug, c.label]));

  return (
    <>
      <div role="group" aria-label="Filtrer par type de création" className="flex flex-wrap gap-2">
        {[{ slug: "tout", label: "Toutes les créations" }, ...disponibles].map((c) => (
          <button
            key={c.slug}
            type="button"
            aria-pressed={filtre === c.slug}
            onClick={() => setFiltre(c.slug)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-colors duration-300",
              filtre === c.slug
                ? "border-accent bg-accent text-accent-ink"
                : "border-line text-muted hover:border-ink hover:text-ink",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <ul className="mt-14 grid gap-x-8 gap-y-20 md:grid-cols-12">
        <AnimatePresence mode="popLayout">
          {visibles.map((p, i) => (
            <motion.li
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              // Accrochage asymétrique : alternance de grands et moyens formats
              className={cn(
                i % 3 === 0 && "md:col-span-8",
                i % 3 === 1 && "md:col-span-4 md:mt-40",
                i % 3 === 2 && "md:col-span-6 md:col-start-4",
              )}
            >
              <Link href={`/graphisme/${p.slug}`} className="group block">
                <div className="bg-surface p-4 transition-[padding] duration-700 ease-out-expo group-hover:p-2 sm:p-8 sm:group-hover:p-5">
                  <MediaImage
                    media={p.visuelPrincipal}
                    sizes="(min-width: 768px) 60vw, 92vw"
                    className="shadow-[0_24px_60px_-30px_rgb(42_26_18/0.5)]"
                  />
                </div>
                <div className="mt-5 grid grid-cols-[auto_1fr] gap-x-5">
                  <span className="font-display text-sm font-bold text-accent">N°{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-2xl font-bold tracking-tight">
                      {p.titre}
                      {p.exemple && (
                        <span className="ml-3 align-middle font-mono text-[10px] font-normal tracking-widest text-muted uppercase">
                          (exemple)
                        </span>
                      )}
                    </h3>
                    <p className="mt-1 text-sm text-muted">
                      {[p.client, p.annee, ...p.categories.map((c) => labels[c])].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </>
  );
}
