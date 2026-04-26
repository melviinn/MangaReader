import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import Providers from "@/lib/providers";
import type { Metadata } from "next";
import { Figtree, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "MangaReader",
    template: "MangaReader | %s",
  },
  description: "Read your favorite manga online for free. Powered by MangaDex.",
  keywords: ["manga", "manga reader", "read manga online", "mangadex"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "MangaReader",
    title: "MangaReader",
    description:
      "Read your favorite manga online for free. Powered by MangaDex.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      suppressContentEditableWarning
    >
      <body
        className={`${outfit.variable} ${figtree.variable} antialiased min-h-dvh`}
      >
        <Providers>
          <div className="min-h-dvh flex flex-col">
            <Navbar />
            <main className="flex flex-1 flex-col">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
