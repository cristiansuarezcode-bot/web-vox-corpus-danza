"use client";

import { useEffect, useState } from "react";

/**
 * Hora actual en el navegador, en milisegundos.
 *
 * En el primer render devuelve `inicial` (la hora en que se compiló la
 * página), igual que el HTML estático, para que no haya diferencias al
 * hidratar. Justo después pasa a la hora real del celular y se actualiza
 * cada `cadaMs` milisegundos.
 */
export function useAhora(inicial: number, cadaMs = 1000) {
  const [ahora, setAhora] = useState(inicial);

  useEffect(() => {
    setAhora(Date.now());
    const id = window.setInterval(() => setAhora(Date.now()), cadaMs);
    return () => window.clearInterval(id);
  }, [cadaMs]);

  return ahora;
}
