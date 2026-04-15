/**
 * La API persiste siempre posición FDI (11–48 en adultos).
 * Estas funciones convierten a la etiqueta del sistema elegido en ajustes.
 */

export type SistemaDental = 'FDI' | 'Universal' | 'Palmer';

const FDI_A_UNIVERSAL: Record<number, number> = {
  18: 1, 17: 2, 16: 3, 15: 4, 14: 5, 13: 6, 12: 7, 11: 8,
  21: 9, 22: 10, 23: 11, 24: 12, 25: 13, 26: 14, 27: 15, 28: 16,
  38: 17, 37: 18, 36: 19, 35: 20, 34: 21, 33: 22, 32: 23, 31: 24,
  48: 25, 47: 26, 46: 27, 45: 28, 44: 29, 43: 30, 42: 31, 41: 32,
};

/** Símbolos de cuadrante estilo Palmer (1=superior derecho … 4=inferior derecho). */
const PALMER_CUADRANTE = ['', '\u2518', '\u2514', '\u250C', '\u2510'] as const;

export function normalizarSistemaDental(raw: string | undefined | null): SistemaDental {
  const s = (raw || 'FDI').trim();
  if (s === 'Universal' || s === 'Palmer' || s === 'FDI') return s;
  const lower = s.toLowerCase();
  if (lower === 'universal') return 'Universal';
  if (lower === 'palmer') return 'Palmer';
  return 'FDI';
}

/** Etiqueta mostrada sobre cada pieza / en paneles. */
export function etiquetaPieza(fdi: number, sistema: string | undefined | null): string {
  const sys = normalizarSistemaDental(sistema);
  if (sys === 'Universal') {
    const u = FDI_A_UNIVERSAL[fdi];
    return u != null ? String(u) : String(fdi);
  }
  if (sys === 'Palmer') {
    const q = Math.floor(fdi / 10);
    const idx = fdi % 10;
    if (q >= 1 && q <= 4 && idx >= 1 && idx <= 8) {
      return `${PALMER_CUADRANTE[q]}${idx}`;
    }
    return String(fdi);
  }
  return String(fdi);
}

export function tituloSistemaDental(sistema: string | undefined | null): string {
  const sys = normalizarSistemaDental(sistema);
  if (sys === 'Universal') return 'Universal (EE. UU.)';
  if (sys === 'Palmer') return 'Palmer';
  return 'FDI';
}
