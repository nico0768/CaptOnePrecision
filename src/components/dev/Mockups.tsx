import type { Media } from "@/lib/types";
import { MediaImage } from "@/components/ui/MediaImage";
import { cn } from "@/lib/cn";

/** Cadre de navigateur autour d'une capture d'écran. */
export function BrowserMockup({
  media,
  url,
  sizes,
  preload,
  className,
}: {
  media: Media;
  url?: string;
  sizes: string;
  preload?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-line bg-surface shadow-[0_30px_80px_-40px_rgb(11_26_58/0.45)]", className)}>
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <div aria-hidden className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-line" />
          <span className="size-2.5 rounded-full bg-line" />
          <span className="size-2.5 rounded-full bg-line" />
        </div>
        <div className="flex-1 truncate rounded-md bg-bg px-3 py-1 text-center font-mono text-[11px] text-muted">
          {url ? url.replace(/^https?:\/\//, "") : "aperçu"}
        </div>
      </div>
      <div className="relative aspect-[16/10]">
        <MediaImage media={media} fill sizes={sizes} preload={preload} className="object-top" />
      </div>
    </div>
  );
}

/** Cadre de smartphone pour les aperçus responsives. */
export function PhoneMockup({ media, className }: { media: Media; className?: string }) {
  return (
    <div className={cn("rounded-[2rem] border border-line bg-surface p-2 shadow-[0_30px_80px_-40px_rgb(11_26_58/0.5)]", className)}>
      <div className="relative aspect-[9/19] overflow-hidden rounded-[1.6rem]">
        <MediaImage media={media} fill sizes="240px" className="object-top" />
      </div>
    </div>
  );
}
