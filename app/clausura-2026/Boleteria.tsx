"use client";

import { clausura, faseEn, pesos, whatsappLink } from "./config";
import styles from "./page.module.css";
import { useAhora } from "./useAhora";

export default function Boleteria({ compilado }: { compilado: number }) {
  const ahora = useAhora(compilado, 60_000);
  const fase = faseEn(ahora);
  const b = clausura.boleteria;

  if (fase.showEmpezo) return null;

  return (
    <section className={styles.seccion} aria-labelledby="boleteria-titulo">
      <div className={styles.encabezado}>
        <p className={styles.antetitulo}>Asegura tu silla</p>
        <h2 className={styles.titulo} id="boleteria-titulo">
          Boletería
        </h2>
      </div>

      {fase.preventaBoletas ? (
        <div className={`${styles.tarjeta} ${styles.tarjetaDorada}`}>
          <div className={styles.filaEntre}>
            <p className={styles.etiquetaDorada}>Preventa especial</p>
            <p className={styles.textoFuerte}>{b.preventaTexto}</p>
          </div>
          <p className={styles.textoSuave}>
            {b.preventaHorario} · {b.preventaLugar}
          </p>
          <div className={styles.dosColumnas}>
            <div>
              <p className={styles.textoMini}>Estudiantes de formación</p>
              <p className={styles.precio}>{pesos(b.precioFormacion)}</p>
            </div>
            <div>
              <p className={styles.textoMini}>Estudiantes de competencia</p>
              <p className={styles.precio}>{pesos(b.precioCompetencia)}</p>
            </div>
          </div>
          <a className={styles.botonBorde} href="/clausura-2026/preventa-boletas.ics">
            Agregar recordatorio al calendario
          </a>
        </div>
      ) : null}

      <div
        className={`${styles.tarjeta} ${fase.preventaBoletas ? "" : styles.tarjetaDorada}`}
      >
        <div className={styles.filaEntre}>
          <div>
            <p className={styles.textoFuerteEspaciado}>Venta general</p>
            <p className={styles.textoMini}>
              {fase.preventaBoletas
                ? "Después de la preventa, según disponibilidad"
                : "Abierta, según disponibilidad de sillas"}
            </p>
          </div>
          <p className={styles.precioDorado}>{pesos(b.precioGeneral)}</p>
        </div>
        {fase.preventaBoletas ? null : (
          <a
            className={styles.botonDorado}
            href={whatsappLink("¡Hola! Quiero separar boletas para El Legado.")}
          >
            Separar por WhatsApp
          </a>
        )}
      </div>

      <p className={styles.notaCentro}>
        Los niños espectadores pagan boleta a partir de los 4 años.
      </p>
    </section>
  );
}
