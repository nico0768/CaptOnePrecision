"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";

const sAbonner = () => () => {};

/** Vrai quand un client est connecté. Sert uniquement à choisir le libellé du lien. */
export function useClientPresent() {
  return useSyncExternalStore(
    sAbonner,
    () => document.cookie.split("; ").includes("client_present=1"),
    () => false,
  );
}

const icones: Record<string, React.ReactNode> = {
  accueil: <path d="M3 11.5 12 4l9 7.5M6 10v10h4.5v-6h3v6H18V10" />,
  dev: <path d="m8 7-5 5 5 5m8-10 5 5-5 5m-2.5-13-3 16" />,
  photo: (
    <>
      <path d="M4 8h3.5L9 5.5h6L16.5 8H20a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13.5" r="3.5" />
    </>
  ),
  graphisme: <path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-1 2-1.9 0-1.3-1.2-1.7-1.2-2.9 0-1 .8-1.7 1.8-1.7H17a4 4 0 0 0 4-4C21 6 17 3 12 3ZM7.5 12h.01M9.5 8h.01m4.5 0h.01" />,
  compte: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </>
  ),
};

/** Barre d'onglets en bas de l'écran, comme dans une application (téléphones et tablettes). */
export function OngletsMobile() {
  const pathname = usePathname();
  const connecte = useClientPresent();
  const onglets = [
    { href: "/", label: "Accueil", icone: "accueil" },
    { href: "/developpement", label: "Dev", icone: "dev" },
    { href: "/photographie", label: "Photo", icone: "photo" },
    { href: "/graphisme", label: "Graphisme", icone: "graphisme" },
    { href: connecte ? "/mon-espace" : "/connexion", label: connecte ? "Mon espace" : "Compte", icone: "compte" },
  ];
  const estActif = (href: string, icone: string) =>
    icone === "compte" ? ["/connexion", "/inscription", "/mon-espace"].includes(pathname) : href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav aria-label="Onglets" data-onglets className="pied onglets fixed inset-x-0 bottom-0 z-50 border-t border-line bg-bg text-ink lg:hidden">
      <ul className="mx-auto grid max-w-xl grid-cols-5">
        {onglets.map((o) => {
          const actif = estActif(o.href, o.icone);
          return (
            <li key={o.icone}>
              <Link
                href={o.href}
                aria-current={actif ? "page" : undefined}
                className={cn("flex h-16 flex-col items-center justify-center gap-1 text-[10.5px] font-medium transition-colors", actif ? "text-accent" : "text-muted")}
              >
                <svg aria-hidden viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  {icones[o.icone]}
                </svg>
                {o.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
