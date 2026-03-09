import Providers from "@/lib/providers";
import { Outfit } from "next/font/google";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
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
    description: "Read your favorite manga online for free. Powered by MangaDex.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${outfit.variable} antialiased`}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
