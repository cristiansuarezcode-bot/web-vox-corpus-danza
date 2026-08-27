import type { Metadata } from "next";
import AppDownloadRedirect from "./AppDownloadRedirect";
import "./download.css";

export const metadata: Metadata = {
  title: "Descarga Vox Danza | Vox Corpus Danza",
  description:
    "Descarga la aplicación oficial de Vox Corpus Danza en App Store o Google Play.",
  openGraph: {
    title: "Descarga Vox Danza",
    description: "Tu proceso en Vox Corpus Danza, siempre cerca de ti.",
    url: "/app/",
  },
};

export default function AppDownloadPage() {
  return (
    <main className="download-page">
      <div className="download-decoration download-decoration-top" aria-hidden="true" />
      <div className="download-decoration download-decoration-bottom" aria-hidden="true" />

      <header className="download-header">
        <a href="/" aria-label="Ir al inicio de Vox Corpus Danza">
          <img src="/vox-corpus-logo.png" alt="Vox Corpus Danza" />
        </a>
      </header>

      <section className="download-card">
        <div className="app-emblem" aria-hidden="true">
          <img src="/vox-danza-app-icon.png" alt="" />
        </div>
        <p className="download-kicker">Aplicación oficial</p>
        <h1>Tu experiencia Vox,<br /><span>siempre contigo.</span></h1>
        <p className="download-copy">
          Lleva contigo la información y las novedades importantes de tu
          proceso.
        </p>

        <AppDownloadRedirect />

        <div className="download-requirement">
          <span aria-hidden="true" />
          Se requiere una cuenta activa de la academia.
        </div>
      </section>

      <footer className="download-footer">
        <a href="/">Conoce Vox Corpus Danza</a>
        <span>·</span>
        <a href="/politica_privacidad_vox_danza/">Privacidad</a>
      </footer>
    </main>
  );
}
