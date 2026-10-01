import type { Metadata, Viewport } from "next";
import { Shell } from "@/components/chrome";
import { posthogSnippet } from "@/lib/posthog";
import "./globals.css";
import "@/styles/ui.css";
import "@/styles/chrome.css";
import "@/styles/home.css";

// Title and description are the live homepage's own (ionacapital.co.uk, Yoast).
export const metadata: Metadata = {
  title: "Kanadevia Inova Capital | UK Low Carbon Fund Manager",
  description: "Iona Capital is a UK market leader in sustainable investment funds with over 20 different low-carbon energy projects.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = { themeColor: "#ffffff" };

/* `js` (and the preloader's `is-loading`/`is-landing`) is set before first paint, unless reduced motion is requested,
   so reveal targets can start hidden without a flash. Without JavaScript the classes are never added and everything
   renders in place; the <noscript> style also hides the preloader.
   The intro always starts at the top of the page (KAIB also calls scrollTo(0, 0) on load), so the browser's own
   scroll restoration is switched off. */
const boot = "if('scrollRestoration' in history)history.scrollRestoration='manual';if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js','is-loading','is-landing')";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" data-header="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <script dangerouslySetInnerHTML={{ __html: posthogSnippet }} />
        <link rel="preload" href="/fonts/raleway-latin-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/noto-sans-latin-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
        <noscript><style>{".preloader{display:none!important}"}</style></noscript>
      </head>
      <body><Shell>{children}</Shell></body>
    </html>
  );
}
