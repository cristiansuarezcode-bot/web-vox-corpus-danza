"use client";

import { useEffect, useState } from "react";
import { BOLETERIA_API, pedirMapa, type FilaTeatro, type Mapa } from "./boleteria";
import MapaSillas, { Leyenda } from "./MapaSillas";
import styles from "./boletas.module.css";

const CADA_MS = 15000;

/**
 * Forma del Teatro Universidad de Envigado (A junto al escenario, Z al fondo).
 * Se dibuja apagada mientras llegan los datos, así el mapa ocupa su espacio
 * desde el principio y la página no salta cuando termina de cargar.
 */
const FILAS_18 = "ADFHJL";
const TEATRO_INICIAL: FilaTeatro[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((fila) => ({ fila, sillas: FILAS_18.includes(fila) ? 18 : 19 }));
const VACIO = new Set<string>();

export default function MapaPublico() {
  const [mapa, setMapa] = useState<Mapa | null>(null);
  const [error, setError] = useState<string | null>(BOLETERIA_API ? null : "El mapa de sillas estará disponible muy pronto.");

  useEffect(() => {
    if (!BOLETERIA_API) return;
    let vivo = true;
    const cargar = async () => {
      try {
        const r = await pedirMapa();
        if (!vivo) return;
        if (r.ok) {
          setMapa(r);
          setError(null);
        } else setError(r.error);
      } catch {
        if (vivo) setError("No pudimos actualizar el mapa. Revisa tu conexión.");
      }
    };
    cargar();
    const t = window.setInterval(() => {
      if (document.visibilityState === "visible") cargar();
    }, CADA_MS);
    return () => {
      vivo = false;
      window.clearInterval(t);
    };
  }, []);

  if (!mapa) {
    return (
      <div className={styles.bloqueMapa} aria-busy="true">
        <Leyenda />
        <div className={styles.mapaCargando} aria-hidden="true">
          <MapaSillas teatro={TEATRO_INICIAL} ocupadas={VACIO} bloqueadas={VACIO} numeros />
        </div>
        <p className={error ? styles.avisoError : styles.nota} role="status">
          {error ?? "Cargando las sillas disponibles…"}
        </p>
      </div>
    );
  }

  const ocupadas = new Set(mapa.ocupadas);
  const bloqueadas = new Set(mapa.bloqueadas);

  return (
    <div className={styles.bloqueMapa}>
      <Leyenda />
      <MapaSillas teatro={mapa.teatro} ocupadas={ocupadas} bloqueadas={bloqueadas} numeros />
      <p className={styles.nota}>
        Se actualiza solo. {error ? <span className={styles.avisoError}>{error}</span> : null}
      </p>
    </div>
  );
}
