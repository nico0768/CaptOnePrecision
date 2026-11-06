"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { navigation, reseauxAffiches } from "@/content/site";
import { cn } from "@/lib/cn";
import type { Contenu } from "@/lib/types";
import { Logo } from "./Logo";
import { useClientPresent } from "./OngletsMobile";
import { IconeReseau } from "./Reseaux";
import { ThemeToggle } from "./ThemeToggle";

function estActif(pathname: string | null, href: string) {
  if (!pathname) return false;
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

type Identite = Contenu["identite"];

/** Header lié à l'URL courante (lien actif, fermeture du menu mobile). */
export function HeaderAvecRoute({ identite }: { identite: Identite }) {
  const pathname = usePathname();
  return <Header key={pathname} pathname={pathname} identite={identite} />;
}

export function Header({ pathname, identite }: { pathname: string | null; identite: Identite }) {
  const [ouvert, setOuvert] = useState(false);
  const [defile, setDefile] = useState(false);
  const connecte = useClientPresent();
  const liensCompte = connecte
    ? [{ label: "Mon espace", href: "/mon-espace" }]
    : [
        { label: "Connexion", href: "/connexion" },
        { label: "Inscription", href: "/inscription" },
      ];

  useEffect(() => {
    const onScroll = () => setDefile(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!ouvert) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOuvert(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [ouvert]);

  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      data-defile={defile}
      data-ouvert={ouvert}
      data-entete
      className={cn(
        "site-header fixed inset-x-0 top-0 z-50 text-ink transition-[background-color,border-color,backdrop-filter] duration-500",
        // Pas de backdrop-filter quand le menu est ouvert : il ferait du header
        // le repère du menu en position fixed (qui ne couvrirait plus l'écran).
        ouvert
          ? "border-b border-line bg-bg"
          : defile
            ? "border-b border-line bg-bg/85 backdrop-blur-md"
            : "border-b border-transparent",
      )}
    >
      {/* Bandeau de coordonnées : affiché seulement sur l'accueil (voir globals.css) */}
      <div className={cn("barre-haute border-b border-line text-white", (defile || ouvert) && "!hidden")}>
        <div className="mx-auto flex h-10 max-w-[1440px] items-center justify-between gap-6 px-5 text-xs sm:px-8 lg:px-12">
          <div className="flex items-center gap-6">
            <a href={`mailto:${identite.email}`} className="hover:underline">
              {identite.email}
            </a>
            {identite.telephones.slice(0, 2).map((n) => (
              <a key={n} href={`tel:${n.replace(/\s/g, "")}`} className="hover:underline">
                {n}
              </a>
            ))}
          </div>
          <ul className="flex items-center divide-x divide-white/20 border-x border-white/20">
            {reseauxAffiches(identite).map((r) => (
              <li key={r.label}>
                {r.href ? (
                  <a href={r.href} target="_blank" rel="noopener noreferrer" className="flex size-10 items-center justify-center hover:bg-white/10">
                    <IconeReseau label={r.label} className="size-3.5" />
                    <span className="sr-only">{r.label}</span>
                  </a>
                ) : (
                  <span className="flex size-10 items-center justify-center text-white/60" title={r.label}>
                    <IconeReseau label={r.label} className="size-3.5" />
                    <span className="sr-only">{r.label}</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8 lg:h-20 lg:px-12">
        <Link href="/" className="relative z-10" aria-label={`${identite.nom} — accueil`}>
          <Logo />
        </Link>

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="nav-liens flex items-center gap-4 text-[13px] xl:gap-8">
            {navigation.map((item) => {
              const actif = estActif(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={actif ? "page" : undefined}
                    className={cn(
                      "nav-lien link-underline inline-flex items-center gap-2 pb-0.5 whitespace-nowrap transition-colors",
                      actif ? "text-ink" : "text-muted hover:text-ink",
                    )}
                  >
                    {"univers" in item && (
                      <span aria-hidden className="hidden size-1.5 rounded-full bg-accent xl:block" />
                    )}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="relative z-10 flex items-center gap-3">
          <ul className="hidden items-center gap-2 lg:flex">
            {liensCompte.map((l, i) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={pathname === l.href ? "page" : undefined}
                  className={cn(
                    "inline-flex h-9 items-center rounded-full px-4 text-[13px] font-medium whitespace-nowrap transition-opacity hover:opacity-85",
                    i === liensCompte.length - 1 ? "bg-accent text-accent-ink" : "border border-line",
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-full border border-line px-4 text-[13px] lg:hidden"
            aria-expanded={ouvert}
            aria-controls="menu-mobile"
            onClick={() => setOuvert((o) => !o)}
          >
            {ouvert ? "Fermer" : "Menu"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {ouvert && (
          <motion.nav
            id="menu-mobile"
            aria-label="Navigation mobile"
            className="fixed inset-0 top-16 z-40 flex flex-col justify-between overflow-y-auto bg-bg px-5 pt-8 pb-28 sm:px-8 lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <ul className="space-y-1">
              {[...navigation, ...liensCompte].map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOuvert(false)}
                    aria-current={estActif(pathname, item.href) ? "page" : undefined}
                    className="flex items-baseline gap-4 py-1 font-heading text-4xl leading-tight aria-[current=page]:text-accent"
                  >
                    <span className="font-mono text-xs text-muted">0{i + 1}</span>
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <p className="mt-10 font-mono text-xs tracking-widest text-muted uppercase">{identite.titre}</p>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
