import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://voxcorpusdanza.com"),
  title: "Vox Corpus Danza | El cuerpo encuentra su voz",
  description:
    "Academia y comunidad de danza. Formación, creación y experiencias escénicas para descubrir el movimiento y encontrar una voz propia.",
  icons: {
    icon: "/vox-corpus-logo.png",
    shortcut: "/vox-corpus-logo.png",
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Vox Corpus Danza",
    title: "Vox Corpus Danza",
    description: "Donde el cuerpo encuentra su voz.",
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
    description: "Donde el cuerpo encuentra su voz.",
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
      <body>{children}</body>
    </html>
  );
}
