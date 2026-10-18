"use client";

import { clausura, faseEn } from "./config";
import styles from "./page.module.css";
import { useAhora } from "./useAhora";

const dosDigitos = (n: number) => String(n).padStart(2, "0");

export default function CuentaRegresiva({ compilado }: { compilado: number }) {
  const ahora = useAhora(compilado, 1000);
  const fase = faseEn(ahora);

  if (fase.showTermino) {
    return (
      <div className={styles.estadoShow}>
        <p className={styles.estadoTitulo}>Gracias por vivir El Legado</p>
        <p className={styles.estadoTexto}>
          Fue una noche para recordar. Gracias por acompañar a nuestros bailarines.
        </p>
        {clausura.encuestaUrl ? (
          <a className={styles.botonDorado} href={clausura.encuestaUrl}>
            Cuéntanos cómo te pareció
          </a>
        ) : null}
      </div>
    );
  }

  if (fase.showEmpezo) {
    return (
      <div className={styles.estadoShow}>
        <p className={styles.estadoTitulo}>¡El show ya comenzó!</p>
        <p className={styles.estadoTexto}>Disfruta El Legado.</p>
      </div>
    );
  }

  let resta = Math.max(0, Date.parse(clausura.fechas.inicioShow) - ahora);
  const dias = Math.floor(resta / 86_400_000);
  resta -= dias * 86_400_000;
  const horas = Math.floor(resta / 3_600_000);
  resta -= horas * 3_600_000;
  const minutos = Math.floor(resta / 60_000);
  resta -= minutos * 60_000;
  const segundos = Math.floor(resta / 1000);

  const unidades = [
    [dias, "Días"],
    [horas, "Horas"],
    [minutos, "Min"],
    [segundos, "Seg"],
  ] as const;

  return (
    <div className={styles.cuenta}>
      <p className={styles.cuentaEtiqueta} id="faltan">
        {dias === 0 ? "¡Es hoy! Faltan" : "Faltan"}
      </p>
      <div className={styles.cuentaGrid} role="timer" aria-labelledby="faltan">
        {unidades.map(([valor, nombre]) => (
          <div className={styles.cuentaUnidad} key={nombre}>
            <span className={styles.cuentaNumero}>{dosDigitos(valor)}</span>
            <span className={styles.cuentaNombre}>{nombre}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
