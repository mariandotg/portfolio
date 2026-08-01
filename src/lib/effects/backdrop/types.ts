import type { ComponentType } from "react";

export interface BackdropProps {
  /** Color de fondo, string CSS. */
  colorBack: string;
  /** Color del patrón, string CSS. */
  colorFront: string;
}

/** Efecto de backdrop: runtime WebGL, se monta como island React. */
export type BackdropEffect = ComponentType<BackdropProps>;
