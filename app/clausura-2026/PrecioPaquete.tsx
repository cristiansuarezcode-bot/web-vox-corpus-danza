"use client";

import { clausura, faseEn, pesos } from "./config";
import styles from "./page.module.css";
import { useAhora } from "./useAhora";

export function diasRestantesPaquete(ahora: number) {
  return Math.ceil((Date.parse(clausura.fechas.paqueteFinPreventa) - ahora) / 86_400_000);
}

export function textoDiasRestantes(dias: number) {
  if (dias > 1) return `quedan ${dias} días`;
  if (dias === 1) return "último día";
  return "";
}

export default function PrecioPaquete({ compilado }: { compilado: number }) {
  const ahora = useAhora(compilado, 60_000);
  const { preventaPaquete } = faseEn(ahora);
  const p = clausura.paquete;

  if (!preventaPaquete) {
    return (
      <div className={`${styles.tarjeta} ${styles.tarjetaDorada} ${styles.centro}`}>
        <p className={styles.etiquetaDorada}>Paquete completo</p>
        <p className={styles.precioGrande}>{pesos(p.precioNormal)}</p>
      </div>
    );
  }

  const dias = textoDiasRestantes(diasRestantesPaquete(ahora));

  return (
    <div className={`${styles.tarjeta} ${styles.tarjetaDorada} ${styles.centro}`}>
      <p className={styles.etiquetaDorada}>Precio de preventa · Paquete completo</p>
      <div className={styles.precios}>
        <s className={styles.precioTachado}>
          <span className={styles.oculto}>Antes </span>
          {pesos(p.precioNormal)}
        </s>
        <p className={styles.precioGrande}>{pesos(p.precioPreventa)}</p>
      </div>
      <p className={styles.insignia}>
        Ahorras {pesos(p.precioNormal - p.precioPreventa)}
      </p>
      <p className={styles.textoSuave}>
        Hasta el {p.finPreventaTexto}
        {dias ? ` · ${dias}` : ""}
      </p>
      <p className={styles.textoMini}>
        Después de esa fecha, el paquete queda en {pesos(p.precioNormal)}.
      </p>
    </div>
  );
}
