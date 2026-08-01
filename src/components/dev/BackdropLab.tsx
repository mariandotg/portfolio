import { useEffect, useState } from "react";
import { BACKDROP_EFFECTS, ACTIVE_BACKDROP_EFFECT } from "@/lib/effects/backdrop";
import { readShaderToken, TRANSPARENT_BACK } from "@/lib/effects/backdrop/color";
import {
  PAPER_DITHERING_DEFAULTS,
  type PaperDitheringCalibration,
} from "@/components/effects/PaperDithering";

/**
 * Banco de calibración del backdrop. Monta cada estrategia del registry con los
 * valores de los sliders y escupe un bloque pegable en `PaperDithering.tsx`.
 * Es tooling: no persiste nada ni cambia `ACTIVE_BACKDROP_EFFECT`.
 */

const SHAPES: PaperDitheringCalibration["shape"][] = [
  "simplex",
  "warp",
  "dots",
  "wave",
  "ripple",
  "swirl",
  "sphere",
];

const TYPES: PaperDitheringCalibration["type"][] = ["random", "2x2", "4x4", "8x8"];

/** Espejo del gradiente de `src/components/effects/BackdropIsland.astro`. */
const MASK =
  "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 18%, rgba(0,0,0,0.13) 50%, rgba(0,0,0,0.4) 82%, rgba(0,0,0,0.7) 100%)";

/** El del island. El slider arranca acá para que el bloque copiable sea honesto. */
const DEFAULT_OPACITY = 0.85;

const SAMPLE =
  "The backdrop sits behind the page, not in front of it. If this paragraph is " +
  "hard to read, the calibration is wrong — lower the opacity, raise the cell " +
  "size, or leave the centre mask on.";

const FALLBACK_PRIMARY = "hsl(247, 76%, 66%)";

function readPrimary(): string {
  return readShaderToken("--primary", FALLBACK_PRIMARY);
}

function useThemeColor(): string {
  const [color, setColor] = useState(FALLBACK_PRIMARY);

  useEffect(() => {
    setColor(readPrimary());
    const observer = new MutationObserver((records) => {
      if (records.some((r) => r.attributeName === "class")) setColor(readPrimary());
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return color;
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}

function Slider({ label, value, min, max, step, onChange }: SliderProps) {
  return (
    <label className="block">
      <span className="mb-1 flex items-baseline justify-between text-[11px] text-muted-foreground">
        {label}
        <b className="font-medium tabular-nums text-foreground">{value}</b>
      </span>
      <input
        type="range"
        className="w-full accent-primary"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

interface PickerProps<T extends string> {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}

function Picker<T extends string>({ label, value, options, onChange }: PickerProps<T>) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] text-muted-foreground">{label}</span>
      <select
        className="w-full rounded-md border border-border bg-transparent px-2 py-1.5 text-xs text-foreground"
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-background">
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function BackdropLab() {
  const colorFront = useThemeColor();

  const [cal, setCal] = useState<PaperDitheringCalibration>(PAPER_DITHERING_DEFAULTS);
  const [opacity, setOpacity] = useState(DEFAULT_OPACITY);
  const [masked, setMasked] = useState(true);
  const [copied, setCopied] = useState(false);

  const set = <K extends keyof PaperDitheringCalibration>(
    key: K,
    value: PaperDitheringCalibration[K]
  ) => setCal((c) => ({ ...c, [key]: value }));

  const reset = () => {
    setCal(PAPER_DITHERING_DEFAULTS);
    setOpacity(DEFAULT_OPACITY);
    setMasked(true);
  };

  // colorBack SIEMPRE transparente: el canvas es un overlay. Un color opaco pinta
  // un rectángulo sólido y aplasta el contraste del dither hasta dejarlo plano.
  const effectProps = { colorBack: TRANSPARENT_BACK, colorFront, ...cal };

  const snippet = [
    "// src/components/effects/PaperDithering.tsx",
    "export const PAPER_DITHERING_DEFAULTS: PaperDitheringCalibration = {",
    `  shape: "${cal.shape}",`,
    `  type: "${cal.type}",`,
    `  size: ${cal.size},`,
    `  speed: ${cal.speed},`,
    `  scale: ${cal.scale},`,
    "};",
    "",
    "// src/components/effects/BackdropIsland.astro → .backdrop",
    `opacity: ${opacity};`,
  ].join("\n");

  const copy = async () => {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
      <aside className="grid gap-4 rounded-xl border border-border bg-card p-4">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Calibration
        </h3>

        <Picker
          label="shape"
          value={cal.shape}
          options={SHAPES}
          onChange={(v) => set("shape", v)}
        />
        <Picker label="type" value={cal.type} options={TYPES} onChange={(v) => set("type", v)} />
        <Slider
          label="size"
          value={cal.size}
          min={1}
          max={16}
          step={0.5}
          onChange={(v) => set("size", v)}
        />
        <Slider
          label="scale"
          value={cal.scale}
          min={0.05}
          max={3}
          step={0.05}
          onChange={(v) => set("scale", v)}
        />
        <Slider
          label="speed"
          value={cal.speed}
          min={0}
          max={2}
          step={0.05}
          onChange={(v) => set("speed", v)}
        />
        <Slider
          label="container opacity"
          value={opacity}
          min={0}
          max={1}
          step={0.05}
          onChange={setOpacity}
        />

        <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            className="accent-primary"
            checked={masked}
            onChange={(e) => setMasked(e.target.checked)}
          />
          Centre mask
        </label>

        <button
          type="button"
          onClick={reset}
          className="rounded-md border border-border px-3 py-1.5 text-xs text-foreground hover:bg-muted"
        >
          Reset to shipped values
        </button>
      </aside>

      <div className="grid gap-6">
        {Object.entries(BACKDROP_EFFECTS).map(([name, Effect]) => (
          <section key={name} className="grid gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{name}</span>
              {name === ACTIVE_BACKDROP_EFFECT && (
                <span className="rounded border border-primary px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                  active
                </span>
              )}
            </div>

            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-background">
              <div
                className="absolute inset-0"
                style={
                  masked
                    ? { opacity, WebkitMaskImage: MASK, maskImage: MASK }
                    : { opacity }
                }
              >
                <Effect {...effectProps} />
              </div>
              <div className="relative flex h-full items-center justify-center p-8">
                <p className="max-w-md text-center text-sm leading-relaxed text-foreground">
                  {SAMPLE}
                </p>
              </div>
            </div>
          </section>
        ))}

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Paste this
            </h3>
            <button
              type="button"
              onClick={copy}
              className="rounded-md border border-border px-3 py-1 text-xs text-foreground hover:bg-muted"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="overflow-x-auto rounded-xl border border-border bg-card p-4 text-xs leading-relaxed">
            {snippet}
          </pre>
        </div>
      </div>
    </div>
  );
}
