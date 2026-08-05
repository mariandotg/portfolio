import { useEffect, useState } from "react";
import { BACKDROP_EFFECTS, ACTIVE_BACKDROP_EFFECT } from "@/lib/effects/backdrop";
import {
  LIGHT_FRONT_FALLBACK,
  LIGHT_PAPER_BACK,
  readBackdropColors,
  TRANSPARENT_BACK,
} from "@/lib/effects/backdrop/color";
import type { BackdropProps } from "@/lib/effects/backdrop/types";
import {
  PAPER_DITHERING_DEFAULTS,
  seedVariation,
  type PaperDitheringCalibration,
} from "@/components/effects/PaperDithering";
import { SITE_BACKDROP_SEED } from "@/lib/effects/backdrop/seed";

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

/** El slider arranca acá para que el bloque copiable sea honesto. El island usa 0.3 en light y 0.22 en dark. */
const DEFAULT_OPACITY = 0.3;

/** El seed que usa el sitio. Es uno solo: el backdrop persiste entre navegaciones. */
const ROUTE_SEEDS = [SITE_BACKDROP_SEED];

const SAMPLE =
  "The backdrop sits behind the page, not in front of it. If this paragraph is " +
  "hard to read, the calibration is wrong — lower the opacity, raise the cell " +
  "size, or leave the centre mask on.";

const SSR_COLORS: BackdropProps = {
  colorBack: LIGHT_PAPER_BACK,
  colorFront: LIGHT_FRONT_FALLBACK,
};

function useThemeColors(): BackdropProps {
  const [colors, setColors] = useState<BackdropProps>(SSR_COLORS);

  useEffect(() => {
    setColors(readBackdropColors());
    const observer = new MutationObserver((records) => {
      if (records.some((r) => r.attributeName === "class")) setColors(readBackdropColors());
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return colors;
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
  const colors = useThemeColors();

  const [cal, setCal] = useState<PaperDitheringCalibration>(PAPER_DITHERING_DEFAULTS);
  const [opacity, setOpacity] = useState(DEFAULT_OPACITY);
  const [masked, setMasked] = useState(true);
  const [duotone, setDuotone] = useState(true);
  const [seed, setSeed] = useState(ROUTE_SEEDS[0]);
  const [copied, setCopied] = useState(false);

  const set = <K extends keyof PaperDitheringCalibration>(
    key: K,
    value: PaperDitheringCalibration[K]
  ) => setCal((c) => ({ ...c, [key]: value }));

  const reset = () => {
    setCal(PAPER_DITHERING_DEFAULTS);
    setOpacity(DEFAULT_OPACITY);
    setMasked(true);
    setDuotone(true);
    setSeed(ROUTE_SEEDS[0]);
  };

  // El toggle compara el duotono vigente contra la tinta sola. `colorBack` nunca puede ser
  // opaco: el canvas es un overlay y un rectángulo sólido aplasta el contraste del dither.
  const effectProps = {
    ...colors,
    colorBack: duotone ? colors.colorBack : TRANSPARENT_BACK,
    seed,
    ...cal,
  };

  const varied = seed ? seedVariation(seed, cal.scale) : null;

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

        <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            className="accent-primary"
            checked={duotone}
            onChange={(e) => setDuotone(e.target.checked)}
          />
          Duotone back
        </label>

        <p className="text-[11px] leading-relaxed text-muted-foreground">
          back <code className="text-foreground">{effectProps.colorBack}</code>
          <br />
          front <code className="text-foreground">{effectProps.colorFront}</code>
        </p>

        <div className="grid gap-2 border-t border-border pt-4">
          <span className="text-[11px] block text-muted-foreground">
            seed <span className="text-muted-foreground/70">— mismo seed, mismo campo</span>
          </span>
          <input
            type="text"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            placeholder="(sin seed → campo por defecto)"
            className="w-full rounded-md border border-border bg-transparent px-2 py-1.5 font-mono text-xs text-foreground"
          />
          <div className="flex flex-wrap gap-1.5">
            {ROUTE_SEEDS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSeed(s)}
                className="rounded border border-border px-2 py-1 font-mono text-[10px] text-foreground hover:bg-muted"
              >
                {s}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setSeed(Math.random().toString(36).slice(2, 9))}
              className="rounded border border-border px-2 py-1 text-[10px] text-foreground hover:bg-muted"
            >
              random
            </button>
            <button
              type="button"
              onClick={() => setSeed("")}
              className="rounded border border-border px-2 py-1 text-[10px] text-foreground hover:bg-muted"
            >
              sin seed
            </button>
          </div>
          {varied && (
            <p className="font-mono text-[10px] leading-relaxed text-muted-foreground">
              frame {varied.frame} · offset {varied.offsetX.toFixed(2)},{" "}
              {varied.offsetY.toFixed(2)} · rot {varied.rotation}° · scale{" "}
              {varied.scale.toFixed(3)}
            </p>
          )}
        </div>

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
