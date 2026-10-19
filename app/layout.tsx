import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://voxcorpusdanza.com"),
  title: "Vox Corpus Danza | La danza como fundamento para la vida",
  description:
    "Formación artística y comunidad de danza para aprender, expresarse y crecer con disciplina, libertad y propósito.",
  icons: {
    icon: [
      {
        url: "/favicon-vox-v2.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    shortcut: "/favicon-vox-v2.png",
    apple: "/favicon-vox-v2.png",
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Vox Corpus Danza",
    title: "Vox Corpus Danza",
    description: "La danza como fundamento para la vida.",
    images: [
      {
        url: "/og.png",
        width: 1738,
        height: 909,
        alt: "Vox Corpus Danza en escena",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vox Corpus Danza",
    description: "La danza como fundamento para la vida.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        {children}
        {/* Estadísticas de visitas (Cloudflare Web Analytics): sin cookies ni datos personales. */}
        <Script
          src="https://static.cloudflareinsights.com/beacon.min.js"
          strategy="afterInteractive"
          data-cf-beacon='{"token": "3edc745e3c6348cba0fbadbd312c9fee"}'
        />
      </body>
    </html>
  );
}
