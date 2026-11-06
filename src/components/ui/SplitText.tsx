import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/**
 * Animation typographique : chaque lettre monte depuis un masque.
 * Le texte complet reste lisible par les lecteurs d'écran.
 */
export function SplitText({ text, className, offset = 0 }: { text: string; className?: string; offset?: number }) {
  return (
    <span className={cn("inline-block", className)}>
      <span className="sr-only">{text}</span>
      {Array.from(text).map((char, i) => (
        <span key={i} aria-hidden className="rise-mask">
          <span className="rise" style={{ "--i": i + offset } as CSSProperties}>
            {char === " " ? " " : char}
          </span>
        </span>
      ))}
    </span>
  );
}
