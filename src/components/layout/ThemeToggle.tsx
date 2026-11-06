"use client";

import { useLayoutEffect, useState } from "react";
import { cn } from "@/lib/cn";

type Theme = "light" | "dark";
const STORAGE_KEY = "theme";

/** Script exécuté avant l'affichage : applique le thème sans flash. */
export const themeScript = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

function currentTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("light");

  // Synchronise l'état avec l'attribut posé par le script (et le réapplique
  // après le double montage de React en développement).
  useLayoutEffect(() => {
    let t: Theme;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      t = stored === "dark" || stored === "light" ? stored : currentTheme();
    } catch {
      t = currentTheme();
    }
    document.documentElement.setAttribute("data-theme", t);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lecture d'une valeur disponible uniquement côté navigateur
    setTheme(t);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
    setTheme(next);
  }

  const label = theme === "dark" ? "Activer le mode clair" : "Activer le mode sombre";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cn(
        "relative inline-flex size-9 items-center justify-center rounded-full border border-line transition-colors hover:border-ink",
        className,
      )}
    >
      <svg viewBox="0 0 20 20" className="size-4" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="10" cy="10" r="6.5" />
        <path d="M10 3.5a6.5 6.5 0 0 1 0 13z" fill="currentColor" />
      </svg>
    </button>
  );
}
