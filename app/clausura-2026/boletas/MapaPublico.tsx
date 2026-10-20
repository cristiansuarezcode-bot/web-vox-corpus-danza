"use client";

import { useEffect, useState } from "react";
import { BOLETERIA_API, pedirMapa, type Mapa } from "./boleteria";
import MapaSillas, { Leyenda } from "./MapaSillas";
import styles from "./boletas.module.css";

const CADA_MS = 15000;

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
    return <p className={styles.estado}>{error ?? "Cargando el mapa del teatro…"}</p>;
  }

  const ocupadas = new Set(mapa.ocupadas);
  const bloqueadas = new Set(mapa.bloqueadas);
  const total = mapa.teatro.reduce((a, t) => a + t.sillas, 0);
  const libres = total - ocupadas.size - bloqueadas.size;

  return (
    <div className={styles.bloqueMapa}>
      <p className={styles.disponibles}>
        <strong>{libres}</strong> sillas disponibles
      </p>
      <Leyenda />
      <MapaSillas teatro={mapa.teatro} ocupadas={ocupadas} bloqueadas={bloqueadas} />
      <p className={styles.nota}>
        Se actualiza solo. {error ? <span className={styles.avisoError}>{error}</span> : null}
      </p>
    </div>
  );
}
