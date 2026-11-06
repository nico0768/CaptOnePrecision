"use client";

import { useState } from "react";
import type { Media } from "@/lib/types";
import { MediaImage } from "@/components/ui/MediaImage";
import { cn } from "@/lib/cn";
import { Lightbox } from "./Lightbox";

/**
 * Mise en page éditoriale d'une série : les photos paysage occupent
 * toute la largeur, les photos portrait vont par deux.
 */
export function SerieGalerie({ photos }: { photos: Media[] }) {
  const [ouverte, setOuverte] = useState<number | null>(null);

  return (
    <>
      <ul className="grid gap-4 md:grid-cols-2 md:gap-6">
        {photos.map((m, i) => {
          const paysage = m.width > m.height;
          return (
            <li key={`${m.alt}-${i}`} className={cn(paysage && "md:col-span-2")}>
              <button
                type="button"
                onClick={() => setOuverte(i)}
                aria-label={`Agrandir : ${m.alt}`}
                className="group block w-full overflow-hidden"
              >
                <div className="transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.02]">
                  <MediaImage media={m} sizes={paysage ? "94vw" : "(min-width: 768px) 46vw, 94vw"} />
                </div>
              </button>
            </li>
          );
        })}
      </ul>
      <Lightbox elements={photos.map((media) => ({ media }))} index={ouverte} onChange={setOuverte} />
    </>
  );
}
