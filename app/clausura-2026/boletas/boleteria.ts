// Conexión con la boletería (Apps Script de Google sobre la hoja de cálculo).
// La dirección termina en /exec y la da Google al implementar la aplicación web.
// Implementación "Boletería clausura 2026 v1" del proyecto de Apps Script en voxcorpusdanza@gmail.com.
export const BOLETERIA_API: string | null =
  process.env.NEXT_PUBLIC_BOLETERIA_API ||
  "https://script.google.com/macros/s/AKfycbzRW5oCHFoXrlnm92pMxRzQdVSca-ajd2iPQHQrwlvea0H4QXoeiSJVS7BEVLOnAH8Tdg/exec";

export type FilaTeatro = { fila: string; sillas: number };
export type Bloqueo = { id: string; motivo: string };

export type Mapa = {
  ok: true;
  teatro: FilaTeatro[];
  ocupadas: string[];
  bloqueadas: string[];
  actualizado: string;
};

export type Paquete = {
  precio: number;
  enPreventa: boolean;
  precioPreventa: number;
  precioNormal: number;
  finPreventa: string;
};

export type Entrada = {
  ok: true;
  vendedor: string;
  precios: Record<string, number>;
  pagos: string[];
  /** Cuentas a las que puede llegar una transferencia. */
  cuentas?: string[];
  /** Nombres completos de la pestaña "Estudiantes" de la hoja. */
  estudiantes?: string[];
  /** Paquete audiovisual: el precio ya viene según la fecha (preventa o normal). */
  paquete?: Paquete | null;
  /** Solo los directores (columna "Ve resumen" de Vendedores). */
  verResumen?: boolean;
  teatro: FilaTeatro[];
  bloqueos: Bloqueo[];
};

export type FilaResumen = { concepto: string; valor: number; dinero: boolean };

export type PagoVenta = { forma: string; cuenta: string; valor: number; estado: string; nota?: string };
export type PaqueteVenta = { cantidad: number; precio: number; total: number; estado: string };

export type SillaVenta = { id: string; tipo: string; precio: number; boleta: string; estado: string };
export type Venta = {
  idVenta: string;
  fecha: string;
  vendedor: string;
  estudiante: string;
  pago: string;
  cuenta?: string;
  nota: string;
  sillas: SillaVenta[];
  paquetes?: PaqueteVenta | null;
  pagos?: PagoVenta[];
  total: number;
};

export type Respuesta<T> = (T & { ok: true }) | { ok: false; error: string; clave?: false; ocupadas?: string[] };

export async function pedirMapa(): Promise<Respuesta<Mapa>> {
  if (!BOLETERIA_API) return { ok: false, error: "La boletería aún no está conectada." };
  const r = await fetch(`${BOLETERIA_API}?accion=mapa&t=${Date.now()}`, { cache: "no-store" });
  return r.json();
}

// Sin encabezado Content-Type: así el navegador lo manda como texto y Google lo acepta sin pasos extra.
export async function enviar<T>(datos: Record<string, unknown>): Promise<Respuesta<T>> {
  if (!BOLETERIA_API) return { ok: false, error: "La boletería aún no está conectada." };
  const r = await fetch(BOLETERIA_API, { method: "POST", body: JSON.stringify(datos), cache: "no-store" });
  return r.json();
}

export const idSilla = (fila: string, silla: number) => `${fila}-${silla}`;

/** Ordena ids "F-8" por fila (orden del teatro) y número. */
export function ordenarSillas(ids: string[], teatro: FilaTeatro[]) {
  const pos = new Map(teatro.map((t, i) => [t.fila, i]));
  return [...ids].sort((a, b) => {
    const [fa, sa] = a.split("-");
    const [fb, sb] = b.split("-");
    return (pos.get(fa) ?? 0) - (pos.get(fb) ?? 0) || Number(sa) - Number(sb);
  });
}
