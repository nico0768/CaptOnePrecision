import Image from "next/image";
import type { Media } from "@/lib/types";
import { cn } from "@/lib/cn";

type Props = {
  media: Media;
  /** Attribut `sizes` de next/image, indispensable pour charger la bonne taille. */
  sizes: string;
  className?: string;
  /** Remplit le parent (qui doit être en position relative). */
  fill?: boolean;
  /** Image au-dessus de la ligne de flottaison (hero). */
  preload?: boolean;
  quality?: 75 | 90;
};

/**
 * Affiche une image optimisée, ou un emplacement temporaire
 * clairement identifié lorsque `media.src` vaut null.
 */
export function MediaImage({ media, sizes, className, fill, preload, quality = 75 }: Props) {
  if (!media.src) {
    return (
      <div
        role="img"
        aria-label={`Image temporaire : ${media.alt}`}
        data-placeholder
        className={cn(
          "flex items-center justify-center overflow-hidden bg-surface text-muted",
          fill ? "absolute inset-0" : "relative w-full",
          className,
        )}
        style={fill ? undefined : { aspectRatio: `${media.width} / ${media.height}` }}
      >
        <svg aria-hidden className="absolute inset-0 h-full w-full opacity-40" preserveAspectRatio="none">
          <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeWidth="0.5" />
          <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" strokeWidth="0.5" />
        </svg>
        <div className="relative m-4 max-w-[80%] border border-dashed border-current bg-surface px-3 py-2 text-center">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase">Image temporaire</p>
          <p className="mt-1 text-xs leading-snug">{media.todo ?? media.alt}</p>
        </div>
      </div>
    );
  }

  return fill ? (
    <Image
      src={media.src}
      alt={media.alt}
      fill
      sizes={sizes}
      quality={quality}
      preload={preload}
      className={cn("object-cover", className)}
    />
  ) : (
    <Image
      src={media.src}
      alt={media.alt}
      width={media.width}
      height={media.height}
      sizes={sizes}
      quality={quality}
      preload={preload}
      className={cn("h-auto w-full", className)}
    />
  );
}
