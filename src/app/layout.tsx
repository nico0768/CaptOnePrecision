import type { Metadata, Viewport } from "next";
import {
  Barlow_Condensed,
  Bricolage_Grotesque,
  DM_Serif_Display,
  Geist,
  Geist_Mono,
  Instrument_Serif,
  Open_Sans,
  Poppins,
  Space_Grotesk,
  Work_Sans,
} from "next/font/google";
import { Suspense } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header, HeaderAvecRoute } from "@/components/layout/Header";
import { OngletsMobile } from "@/components/layout/OngletsMobile";
import { themeScript } from "@/components/layout/ThemeToggle";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { site } from "@/content/site";
import { getContenu } from "@/lib/contenu";
import "./globals.css";

// Texte courant et interface (À propos, Contact, Graphisme)
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
// Détails techniques et libellés
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], preload: false });
// Titres éditoriaux
const instrument = Instrument_Serif({ variable: "--font-instrument", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"], preload: false });
// Accueil
const barlow = Barlow_Condensed({ variable: "--font-barlow", subsets: ["latin"], weight: ["400", "600", "700"], preload: false });
const openSans = Open_Sans({ variable: "--font-open-sans", subsets: ["latin"], preload: false });
// Développement
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], preload: false });
const workSans = Work_Sans({ variable: "--font-work-sans", subsets: ["latin"], preload: false });
// Photographie
const dmSerif = DM_Serif_Display({ variable: "--font-dm-serif", subsets: ["latin"], weight: "400", preload: false });
const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["400", "500", "600"], preload: false });

const polices = [geistSans, geistMono, instrument, bricolage, barlow, openSans, spaceGrotesk, workSans, dmSerif, poppins]
  .map((p) => p.variable)
  .join(" ");

export async function generateMetadata(): Promise<Metadata> {
  const { identite } = await getContenu();
  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${identite.nom} — ${identite.titre}`,
      template: `%s — ${identite.nom}`,
    },
    description: identite.description,
    authors: [{ name: identite.nom }],
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: identite.nom,
      title: `${identite.nom} — ${identite.titre}`,
      description: identite.description,
    },
    twitter: { card: "summary_large_image" },
    applicationName: "Capt One",
    appleWebApp: { capable: true, title: "Capt One", statusBarStyle: "black" },
    alternates: { canonical: "/" },
  };
}

export const viewport: Viewport = {
  // La barre du téléphone prend la couleur de l'en-tête.
  themeColor: "#020d26",
  // Utilise tout l'écran, y compris autour de l'encoche ; les marges de sécurité sont dans globals.css.
  viewportFit: "cover",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { identite } = await getContenu();
  return (
    <html lang="fr" data-theme="light" suppressHydrationWarning className={`${polices} antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#contenu"
          className="fixed top-3 left-3 z-[70] -translate-y-20 rounded-full bg-ink px-4 py-2 text-sm text-bg focus:translate-y-0"
        >
          Aller au contenu
        </a>
        <MotionProvider>
          <Suspense fallback={<Header pathname={null} identite={identite} />}>
            <HeaderAvecRoute identite={identite} />
          </Suspense>
          <main id="contenu" className="flex-1">
            {children}
          </main>
          <Footer identite={identite} />
          <Suspense fallback={null}>
            <OngletsMobile />
          </Suspense>
        </MotionProvider>
      </body>
    </html>
  );
}
