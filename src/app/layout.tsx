import type { Metadata, Viewport } from "next";
import { Inter_Tight, JetBrains_Mono, Michroma } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { site } from "@/content/site";

const display = Michroma({ weight: "400", subsets: ["latin"], variable: "--font-display", display: "swap" });
const sans = Inter_Tight({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap", weight: ["400", "500"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
    images: [{ url: "/brand/banner.jpg", width: 1640, height: 624 }],
  },
  twitter: { card: "summary_large_image", images: ["/brand/banner.jpg"] },
};

export const viewport: Viewport = { themeColor: "#02040c", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-phase="boot" suppressHydrationWarning className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <noscript>
          <style>{`.curtain{display:none!important}.reveal,.split__word{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
