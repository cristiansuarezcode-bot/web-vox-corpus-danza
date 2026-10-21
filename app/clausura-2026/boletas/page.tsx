import type { Metadata, Viewport } from "next";
import MapaPublico from "./MapaPublico";
import "../fondo.css";
import base from "../page.module.css";
import styles from "./boletas.module.css";

export const metadata: Metadata = {
  title: "Escoge tus sillas · El Legado | Vox Corpus Danza",
  description: "Mapa de sillas disponibles para El Legado, la clausura 2026 de Vox Corpus Danza.",
  alternates: { canonical: "/clausura-2026/boletas/" },
};

export const viewport: Viewport = { themeColor: "#000000" };

export default function BoletasPage() {
  return (
    <main className={`${base.pagina} ${styles.contenedor}`} data-clausura="">
      <header className={styles.cabecera}>
        <a href="/clausura-2026/" aria-label="Volver a la página de la clausura">
          <img src="/clausura-2026/vox-lockup.png" alt="Vox Corpus Danza" width={130} height={29} />
        </a>
        <h1 className={styles.titulo}>El Legado · Clausura 2026</h1>
      </header>

      <MapaPublico />

      <a className={styles.volver} href="/clausura-2026/">
        Ver toda la información de la clausura
      </a>
    </main>
  );
}
