import type { Metadata, Viewport } from "next";
import Taquilla from "../boletas/Taquilla";
import "../fondo.css";
import base from "../page.module.css";
import styles from "../boletas/boletas.module.css";

// Panel de venta para el equipo de recepción. No se enlaza desde ninguna página
// y le pide a los buscadores que no lo muestren; la seguridad real es la clave
// de cada vendedor, que revisa el programa de Google.
export const metadata: Metadata = {
  title: "Taquilla · El Legado",
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = { themeColor: "#000000" };

export default function TaquillaPage() {
  return (
    <main className={`${base.pagina} ${styles.contenedor} ${styles.contenedorAncho}`} data-clausura="">
      <header className={styles.cabecera}>
        <p className={styles.antetitulo}>El Legado · Clausura 2026</p>
        <h1 className={styles.titulo}>Taquilla</h1>
      </header>
      <Taquilla />
    </main>
  );
}
