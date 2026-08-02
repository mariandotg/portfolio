import { useEffect, useRef, useState } from "react";
import { ImageDithering, imageDitheringPresets } from "@paper-design/shaders-react";
import { readShaderToken } from "@/lib/effects/backdrop/color";
import { VIEW_COLS, VIEW_ROWS } from "@/lib/effects/banner";

/**
 * Banco de previsualización del dither sobre imágenes. Es tooling para decidir si los
 * banners de serie pasan a ser imágenes ditherizadas: no toca `BANNER_EFFECTS` ni persiste
 * nada. La imagen se lee en el cliente con `URL.createObjectURL`; no se sube a ningún lado.
 */

type DitherType = "random" | "2x2" | "4x4" | "8x8";
type Fit = "none" | "contain" | "cover";

interface DitherConfig {
  type: DitherType;
  size: number;
  colorSteps: number;
  originalColors: boolean;
  inverted: boolean;
  fit: Fit;
  scale: number;
}

interface Palette {
  front: string;
  back: string;
  highlight: string;
}

const TYPES: DitherType[] = ["random", "2x2", "4x4", "8x8"];
const FITS: Fit[] = ["none", "contain", "cover"];

/** La única foto del repo: siembra la página para que sirva sin interacción. */
const SEED_IMAGE = "/me.webp";

const DEFAULTS: DitherConfig = {
  type: "4x4",
  size: 2,
  colorSteps: 2,
  originalColors: false,
  inverted: false,
  fit: "cover",
  scale: 1,
};

const RATIOS = [
  { label: `banner ${VIEW_COLS}/${VIEW_ROWS}`, css: `${VIEW_COLS} / ${VIEW_ROWS}` },
  { label: "card 16/9", css: "16 / 9" },
] as const;

const FALLBACK_FRONT = "hsl(247, 76%, 66%)";
const FALLBACK_BACK = "hsl(0, 0%, 4%)";

/**
 * `minPixelRatio` del shader, que es lo que decide el tamaño real del canvas
 * (`max(devicePixelRatio, minPixelRatio)`). Como el shader escala `pxSize` por ese mismo
 * factor, subirlo da más píxeles con el mismo look: es el control de resolución del export.
 * El tope 4 mantiene el canvas por debajo del `maxPixelCount` por defecto de la librería.
 */
const DEFAULT_PIXEL_RATIO = 2;
const MAX_PIXEL_RATIO = 4;

function fileStem(name: string): string {
  const base = name.replace(/^.*[\\/]/, "").replace(/\.[^.]+$/, "");
  return base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "image";
}

/**
 * Los tres colores salen de tokens shadcn, que son tripletas separadas por espacios; el parser
 * de la librería sólo acepta `hsl()` con comas y ante un fallo devuelve gris medio sin lanzar.
 * `readShaderToken` normaliza, así que nunca hay que pasar `var(--token)` crudo al shader.
 */
function readTokenPalette(): Palette {
  const front = readShaderToken("--primary", FALLBACK_FRONT);
  return {
    front,
    back: readShaderToken("--background", FALLBACK_BACK),
    highlight: front,
  };
}

function useTokenPalette(): Palette {
  const [palette, setPalette] = useState<Palette>({
    front: FALLBACK_FRONT,
    back: FALLBACK_BACK,
    highlight: FALLBACK_FRONT,
  });

  useEffect(() => {
    setPalette(readTokenPalette());
    const observer = new MutationObserver((records) => {
      if (records.some((r) => r.attributeName === "class")) setPalette(readTokenPalette());
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return palette;
}

/** `<input type="color">` sólo habla hex; los tokens llegan en hsl. */
function toHex(color: string): string {
  if (color.startsWith("#")) return color.length === 7 ? color : color.slice(0, 7);
  const m = color.match(/hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%/);
  if (!m) return "#000000";
  const h = Number(m[1]);
  const s = Number(m[2]) / 100;
  const l = Number(m[3]) / 100;
  const a = s * Math.min(l, 1 - l);
  const k = (n: number) => (n + h / 30) % 12;
  const channel = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const hex = (v: number) =>
    Math.round(Math.min(1, Math.max(0, v)) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${hex(channel(0))}${hex(channel(8))}${hex(channel(4))}`;
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

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
      <input
        type="checkbox"
        className="accent-primary"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

function ColorField({ label, value, onChange }: ColorFieldProps) {
  return (
    <label className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
      {label}
      <span className="flex items-center gap-2">
        <code className="text-[10px] text-foreground">{toHex(value)}</code>
        <input
          type="color"
          className="h-6 w-8 cursor-pointer rounded border border-border bg-transparent"
          value={toHex(value)}
          onChange={(e) => onChange(e.target.value)}
        />
      </span>
    </label>
  );
}

export default function ImageDitherLab() {
  const tokenPalette = useTokenPalette();

  const [config, setConfig] = useState<DitherConfig>(DEFAULTS);
  const [override, setOverride] = useState<Palette | null>(null);
  const [ratio, setRatio] = useState<string>(RATIOS[0].css);
  const [imageSrc, setImageSrc] = useState(SEED_IMAGE);
  const [imageName, setImageName] = useState(SEED_IMAGE);
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pixelRatio, setPixelRatio] = useState(DEFAULT_PIXEL_RATIO);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [canvasSize, setCanvasSize] = useState<{ w: number; h: number } | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const objectUrl = useRef<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const preview = useRef<HTMLDivElement>(null);

  // Sin esto cada imagen soltada queda retenida por su blob URL hasta recargar.
  useEffect(
    () => () => {
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    },
    []
  );

  // El canvas lo crea `ShaderMount` después de resolver la imagen (async), así que no existe
  // en el primer effect: hay que esperarlo en vez de leerlo una sola vez.
  useEffect(() => {
    let raf = 0;
    const find = () => {
      const found = preview.current?.querySelector("canvas") ?? null;
      if (found) setCanvas(found);
      else raf = requestAnimationFrame(find);
    };
    find();
    return () => cancelAnimationFrame(raf);
  }, []);

  // El shader redimensiona su buffer en su propio observer; leer en el frame siguiente evita
  // publicar el tamaño viejo. `pixelRatio` y `ratio` entran como deps porque cambian el buffer
  // sin cambiar necesariamente el tamaño CSS que observa el ResizeObserver.
  useEffect(() => {
    if (!canvas) return;
    let raf = 0;
    const read = () => {
      raf = requestAnimationFrame(() => setCanvasSize({ w: canvas.width, h: canvas.height }));
    };
    read();
    const observer = new ResizeObserver(read);
    observer.observe(canvas);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [canvas, pixelRatio, ratio]);

  const palette = override ?? tokenPalette;

  const set = <K extends keyof DitherConfig>(key: K, value: DitherConfig[K]) =>
    setConfig((c) => ({ ...c, [key]: value }));

  const setColor = (key: keyof Palette, value: string) =>
    setOverride((p) => ({ ...(p ?? palette), [key]: value }));

  const takeFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = url;
    setImageSrc(url);
    setImageName(file.name);
  };

  const applyPreset = (preset: (typeof imageDitheringPresets)[number]) => {
    const p = preset.params;
    setConfig({
      type: p.type,
      size: p.size,
      colorSteps: p.colorSteps,
      originalColors: p.originalColors,
      inverted: p.inverted,
      fit: p.fit,
      scale: p.scale,
    });
    setOverride({ front: p.colorFront, back: p.colorBack, highlight: p.colorHighlight });
  };

  const reset = () => {
    setConfig(DEFAULTS);
    setOverride(null);
    setPixelRatio(DEFAULT_PIXEL_RATIO);
  };

  /**
   * Baja el canvas tal cual se ve: `preserveDrawingBuffer` ya está activo, así que el buffer
   * sigue leíble después de compositar. Una imagen de otro origen sin CORS tiñe el canvas y
   * `toBlob` tira SecurityError — se reporta en vez de fallar en silencio.
   */
  const exportPng = () => {
    if (!canvas) return;
    setExportError(null);
    const name = [
      fileStem(imageName),
      "dither",
      config.type,
      `${canvas.width}x${canvas.height}`,
    ].join("-");

    try {
      canvas.toBlob((blob) => {
        if (!blob) {
          setExportError("el canvas no devolvió PNG");
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${name}.png`;
        // El ancla va al DOM y la URL se revoca en el próximo turno: revocar en el mismo
        // tick cancela la descarga en Firefox.
        document.body.append(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }, "image/png");
    } catch (error) {
      setExportError(error instanceof Error ? error.message : "export falló");
    }
  };

  const snippet = [
    "<ImageDithering",
    `  image="${imageName}"`,
    `  type="${config.type}"`,
    `  size={${config.size}}`,
    `  colorSteps={${config.colorSteps}}`,
    `  originalColors={${config.originalColors}}`,
    `  inverted={${config.inverted}}`,
    `  fit="${config.fit}"`,
    `  scale={${config.scale}}`,
    `  colorFront="${palette.front}"`,
    `  colorBack="${palette.back}"`,
    `  colorHighlight="${palette.highlight}"`,
    ...(pixelRatio === DEFAULT_PIXEL_RATIO ? [] : [`  minPixelRatio={${pixelRatio}}`]),
    `  style={{ width: "100%", aspectRatio: "${ratio}" }}`,
    "/>",
    override
      ? "// colores manuales — no siguen el tema"
      : "// colores leídos de --primary / --background con readShaderToken()",
  ].join("\n");

  const copy = async () => {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div
      className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start"
      data-image-dither-lab
    >
      <aside className="grid gap-4 rounded-xl border border-border bg-card p-4">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Source
        </h3>

        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => takeFile(e.target.files?.[0])}
        />
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          className="rounded-md border border-border px-3 py-1.5 text-xs text-foreground hover:bg-muted"
        >
          Choose image…
        </button>
        <p className="truncate text-[11px] text-muted-foreground" title={imageName}>
          {imageName}
        </p>

        <h3 className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Dither
        </h3>

        <Picker label="type" value={config.type} options={TYPES} onChange={(v) => set("type", v)} />
        <Slider
          label="size"
          value={config.size}
          min={0.5}
          max={20}
          step={0.5}
          onChange={(v) => set("size", v)}
        />
        <Slider
          label="colorSteps"
          value={config.colorSteps}
          min={1}
          max={7}
          step={1}
          onChange={(v) => set("colorSteps", v)}
        />
        <Picker label="fit" value={config.fit} options={FITS} onChange={(v) => set("fit", v)} />
        <Slider
          label="scale"
          value={config.scale}
          min={0.1}
          max={4}
          step={0.05}
          onChange={(v) => set("scale", v)}
        />
        <Picker
          label="aspect ratio"
          value={ratio}
          options={RATIOS.map((r) => r.css)}
          onChange={setRatio}
        />

        <Slider
          label="export pixel ratio"
          value={pixelRatio}
          min={1}
          max={MAX_PIXEL_RATIO}
          step={1}
          onChange={setPixelRatio}
        />

        <Toggle
          label="originalColors"
          checked={config.originalColors}
          onChange={(v) => set("originalColors", v)}
        />
        <Toggle label="inverted" checked={config.inverted} onChange={(v) => set("inverted", v)} />

        <h3 className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Palette
        </h3>
        <p className="text-[11px] text-muted-foreground">
          {override ? "manual" : "from --primary / --background"}
          {config.originalColors && " · ignored while originalColors is on"}
        </p>
        <ColorField
          label="colorFront"
          value={palette.front}
          onChange={(v) => setColor("front", v)}
        />
        <ColorField label="colorBack" value={palette.back} onChange={(v) => setColor("back", v)} />
        <ColorField
          label="colorHighlight"
          value={palette.highlight}
          onChange={(v) => setColor("highlight", v)}
        />
        {override && (
          <button
            type="button"
            onClick={() => setOverride(null)}
            className="rounded-md border border-border px-3 py-1.5 text-xs text-foreground hover:bg-muted"
          >
            Back to theme tokens
          </button>
        )}

        <button
          type="button"
          onClick={reset}
          className="rounded-md border border-border px-3 py-1.5 text-xs text-foreground hover:bg-muted"
        >
          Reset
        </button>
      </aside>

      <div className="grid gap-6">
        <div className="flex flex-wrap gap-2">
          {imageDitheringPresets.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => applyPreset(preset)}
              className="rounded-md border border-border px-3 py-1.5 text-xs text-foreground hover:bg-muted"
            >
              {preset.name}
            </button>
          ))}
        </div>

        <div
          className={`grid gap-4 rounded-xl border border-dashed p-3 transition-colors ${
            dragging ? "border-primary bg-muted/40" : "border-border"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            takeFile(e.dataTransfer.files?.[0]);
          }}
          data-dither-dropzone
        >
          <p className="text-[11px] text-muted-foreground">
            Drop an image anywhere in this area — it stays in the browser, nothing is uploaded.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <figure className="grid gap-1.5">
              <figcaption className="text-[11px] text-muted-foreground">original</figcaption>
              <div
                className="overflow-hidden rounded-lg border border-border bg-background"
                style={{ aspectRatio: ratio }}
              >
                <img
                  src={imageSrc}
                  alt="source"
                  className="h-full w-full"
                  style={{ objectFit: config.fit === "none" ? "none" : config.fit }}
                />
              </div>
            </figure>

            <figure className="grid gap-1.5">
              <figcaption className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                <span>
                  dithered
                  {canvasSize && (
                    <span className="ml-2 tabular-nums">
                      {canvasSize.w}×{canvasSize.h}
                    </span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={exportPng}
                  disabled={!canvas}
                  className="rounded-md border border-border px-2 py-0.5 text-[11px] text-foreground hover:bg-muted disabled:opacity-50"
                >
                  Export PNG
                </button>
              </figcaption>
              <div
                ref={preview}
                className="overflow-hidden rounded-lg border border-border bg-background"
                style={{ aspectRatio: ratio }}
                data-dither-preview
              >
                <ImageDithering
                  image={imageSrc}
                  type={config.type}
                  size={config.size}
                  colorSteps={config.colorSteps}
                  originalColors={config.originalColors}
                  inverted={config.inverted}
                  fit={config.fit}
                  scale={config.scale}
                  colorFront={palette.front}
                  colorBack={palette.back}
                  colorHighlight={palette.highlight}
                  speed={0}
                  minPixelRatio={pixelRatio}
                  // Sin esto el canvas se lee en negro al muestrear píxeles o sacar captura.
                  webGlContextAttributes={{ preserveDrawingBuffer: true }}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              {exportError && (
                <p className="text-[11px] text-destructive">export: {exportError}</p>
              )}
            </figure>
          </div>
        </div>

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
