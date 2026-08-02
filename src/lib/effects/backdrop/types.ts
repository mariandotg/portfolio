import type { ComponentType } from "react";

export interface BackdropProps {
  /** Color de fondo, string CSS. */
  colorBack: string;
  /** Color del patrón, string CSS. */
  colorFront: string;
  /**
   * Siembra el campo: mismo seed -> mismo dibujo, siempre. Vacío o ausente = campo por defecto.
   * Cada estrategia decide cómo traducirlo a sus parámetros.
   */
  seed?: string;
}

/** Efecto de backdrop: runtime WebGL, se monta como island React. */
export type BackdropEffect = ComponentType<BackdropProps>;
