// RNG determinista compartido por las dos familias de efectos: string -> hash -> secuencia
// reproducible. Puro e isomórfico (build + browser).
//
// Los dos registries siguen siendo independientes; esto es sólo la primitiva de sembrado, y la
// comparten para que "mismo seed -> mismo dibujo" signifique lo mismo en banners y en backdrop.

export function fnv1a(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Atajo: siembra directamente desde el string. */
export function seededRng(seed: string): () => number {
  return mulberry32(fnv1a(seed));
}
