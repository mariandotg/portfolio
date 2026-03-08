import type { Vec3 } from "./math";
import { rotateX, rotateY, rotateZ, project, faceNormal, dot, normalize } from "./math";
import { createCube, createSphere, createCone, type Geometry } from "./shapes";
import { applyHalftone } from "./dither";

// ─── Types ───────────────────────────────────────────────────────────────────

interface SceneObject {
  /** Semantic role used to apply distinct motion behavior per shape. */
  kind: "cube" | "sphere" | "cone";
  geometry: Geometry;
  /** Base world-space anchor position [x, y, z]. */
  anchor: Vec3;
  /** World-space position offset [x, y, z] — moves the shape in the scene.
   *  x: negative = left, positive = right
   *  y: negative = up,   positive = down
   *  z: negative = closer to camera, positive = further away */
  position: Vec3;
  /** Current rotation angles in radians [rx, ry, rz] */
  rotation: Vec3;
  /** Rotation speed per frame [rx, ry, rz] — higher = faster spinning */
  rotationSpeed: Vec3;
  /** Uniform scale multiplier for this shape (1 = geometry's native size) */
  scale: number;
  /** Optional per-object dot spacing multiplier for the halftone pass. */
  dotSpacingMul?: number;
  /** Optional per-object alpha multiplier for the halftone pass. */
  alphaMul?: number;
}

interface ThemeColors {
  r: number;   // 0-255
  g: number;   // 0-255
  b: number;   // 0-255
  alpha: number; // 0-1
}

// ─── Theme colors ────────────────────────────────────────────────────────────
// These define the halftone dot color in each theme.
// r/g/b are the dot color, alpha controls overall visibility over the page.

/** Light mode: purple dots at low opacity (subtle) */
const LIGHT_THEME: ThemeColors = { r: 0x70, g: 0x50, b: 0xD8, alpha: 0.18 };
/** Dark mode: lighter purple dots at higher opacity (more visible on dark bg) */
const DARK_THEME: ThemeColors = { r: 0xA2, g: 0x8D, b: 0xE6, alpha: 0.7 };

// ─── Scene constants ─────────────────────────────────────────────────────────

/**
 * Directional light direction (normalized). Points roughly from upper-right-front.
 * Change this to move the light source and affect which faces appear bright/dark.
 * Components: [x, y, z] where negative-y = light from above.
 */
const BASE_LIGHT_DIR: Vec3 = normalize([0.3, -1.3, -0.5]);

/**
 * Field-of-view distance for perspective projection.
 * Larger = less distortion (more orthographic). Smaller = more dramatic perspective.
 * Typical range: 300 (fisheye-ish) to 800 (flat-ish).
 */
const FOV = 300;

/**
 * Target frames per second for animation.
 * The render loop uses requestAnimationFrame but skips frames to stay at this rate.
 */
const FPS = 60;
const FRAME_MS = 1000 / FPS;
const OUTLINE_WIDTH_CSS_PX = 5;
const OUTLINE_GRAY = 20;
const SECONDARY_OUTLINE_GRAY = 72;
const SECONDARY_OUTLINE_ALPHA = 0.45;
const TRAIL_FADE_ALPHA = 0.24;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getThemeColors(): ThemeColors {
  return document.documentElement.classList.contains("dark") ? DARK_THEME : LIGHT_THEME;
}

function wrapAngle(angle: number): number {
  const tau = Math.PI * 2;
  let wrapped = (angle + Math.PI) % tau;
  if (wrapped < 0) wrapped += tau;
  return wrapped - Math.PI;
}

function getAnimatedLightDir(timeSec: number): Vec3 {
  return normalize([
    BASE_LIGHT_DIR[0] + Math.sin(timeSec * 0.33) * 0.25,
    BASE_LIGHT_DIR[1] + Math.cos(timeSec * 0.27) * 0.18,
    BASE_LIGHT_DIR[2] + Math.sin(timeSec * 0.29 + 1.1) * 0.22,
  ]);
}

/**
 * Responsive breakpoints. Returns:
 *  - scale:      global geometry size multiplier (1 = full size). This multiplies
 *                with each object's individual `scale` and the geometry constructor size.
 *                Final vertex size = geometrySize × objectScale × responsiveScale × dpr.
 *                Increase to make ALL shapes bigger at this breakpoint.
 *  - centerX:    horizontal projection center as fraction of canvas width
 *                (0 = left edge, 0.5 = center). Lower = shapes sit further left.
 *  - dotSpacing: halftone grid spacing in CSS pixels (smaller = denser/finer dots)
 *
 * SIZE CHAIN SUMMARY (all multiply together):
 *   1. Geometry constructor arg (e.g. createCube(100)) — raw shape size
 *   2. Object `scale` property — per-shape multiplier
 *   3. This responsive `scale` — per-breakpoint global multiplier
 *   4. FOV constant — lower = shapes appear larger (more perspective zoom)
 *   5. Object `position[2]` (z) — lower z = closer to camera = appears bigger
 */
function getResponsiveParams(width: number) {
  if (width >= 1024) return { scale: 1, centerX: 0.15, dotSpacing: 5 };      // Desktop
  if (width >= 550)  return { scale: 0.8, centerX: 0.2, dotSpacing: 4.5 };   // Tablet
  return                     { scale: 0.55, centerX: 0.35, dotSpacing: 4 };   // Mobile
}

// ─── Main init ───────────────────────────────────────────────────────────────

/**
 * Initializes the dither scene on the given canvas element.
 * Returns a cleanup function to stop animation and disconnect observers.
 */
export function init(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return () => {};

  // Offscreen canvas: shapes are first rendered here in grayscale,
  // then the halftone post-process reads this and draws dots on the main canvas.
  const offscreen = document.createElement("canvas");
  const offCtx = offscreen.getContext("2d", { willReadFrequently: true })!;
  const maskCanvas = document.createElement("canvas");
  const maskCtx = maskCanvas.getContext("2d")!;
  const outlineCanvas = document.createElement("canvas");
  const outlineCtx = outlineCanvas.getContext("2d")!;

  // ─── Scene objects ───────────────────────────────────────────────────────
  // Each object = geometry + position/rotation/speed/scale.
  // Edit these to change what shapes appear, where they sit, how big/fast they are.

  const objects: SceneObject[] = [
    {
      // CUBE — steady spin anchor
      kind: "cube",
      geometry: createCube(100),
      anchor: [-82, 56, 22],
      position: [-82, 56, 22],
      rotation: [0.3, 0.45, 0.02],
      rotationSpeed: [0.0045, 0.0072, 0.0013],
      scale: 1.3,
      dotSpacingMul: 0.95,
      alphaMul: 1.05,
    },
    {
      // SPHERE — orbital motion anchor
      kind: "sphere",
      geometry: createSphere(70, 28),
      anchor: [72, -34, 78],
      position: [72, -34, 78],
      rotation: [0.08, 0.3, 0],
      rotationSpeed: [0.0018, 0.0054, 0.0022],
      scale: 1.3,
      dotSpacingMul: 1.08,
      alphaMul: 0.9,
    },
    {
      // CONE — counter-rotation anchor (kept behind)
      kind: "cone",
      geometry: createCone(50, 80, 14),
      anchor: [-40, -94, 140],
      position: [-40, -94, 140],
      rotation: [0.28, -0.1, 0.08],
      rotationSpeed: [0.0012, -0.0088, 0.0009],
      scale: 1.3,
      dotSpacingMul: 0.9,
      alphaMul: 1.08,
    },
  ];

  let colors = getThemeColors();
  let animId = 0;
  let lastFrame = 0;
  let running = true;
  let dpr = 1; // device pixel ratio (capped for perf)
  let hasRendered = false;
  let cachedOutlineRadius = -1;
  let cachedOutlineOffsets: [number, number][] = [];

  function getOutlineOffsets(radius: number): [number, number][] {
    if (radius === cachedOutlineRadius) return cachedOutlineOffsets;
    const offsets: [number, number][] = [];
    const r2 = radius * radius;
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (dx * dx + dy * dy <= r2) offsets.push([dx, dy]);
      }
    }
    cachedOutlineRadius = radius;
    cachedOutlineOffsets = offsets;
    return offsets;
  }

  // ─── Resize handler ─────────────────────────────────────────────────────
  // Matches canvas size to its parent container, accounting for device pixel ratio.

  function resize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const pw = Math.round(rect.width * dpr);   // physical pixel width
    const ph = Math.round(rect.height * dpr);  // physical pixel height
    canvas.width = pw;
    canvas.height = ph;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    offscreen.width = pw;
    offscreen.height = ph;
    maskCanvas.width = pw;
    maskCanvas.height = ph;
    outlineCanvas.width = pw;
    outlineCanvas.height = ph;
    hasRendered = false;
  }

  // ─── Render one frame ───────────────────────────────────────────────────

  function renderFrame(timeSec = 0, forceClear = false) {
    const pw = canvas.width;
    const ph = canvas.height;
    if (pw === 0 || ph === 0) return;

    // We draw in physical-pixel space (no CSS scaling transform).
    const w = pw;
    const h = ph;
    const cssW = w / dpr; // CSS width, used for responsive breakpoints

    const { scale: rScale, centerX, dotSpacing } = getResponsiveParams(cssW);
    const scaledDot = dotSpacing * dpr; // dot spacing in physical pixels

    // Projection center: where the "camera looks at" on screen.
    // centerX controls horizontal position, 0.45 pushes shapes slightly above vertical center.
    const cx = w * centerX;
    const cy = h * 0.45;
    const lightDir = getAnimatedLightDir(timeSec);

    type FaceData = {
      projected: [number, number][];
      depth: number;
      brightness: number;
    };
    type ObjectRender = {
      centerDepth: number;
      dotSpacingMul: number;
      alphaMul: number;
      faces: FaceData[];
    };

    /** Compute brightness from a normal vector and clamp to range.
     *  - 0.9: contrast multiplier (higher = more difference between lit/shadow)
     *  - 0.15: ambient base (lower = darker shadows)
     *  - Range 0.08–0.95 for good halftone contrast */
    function calcBrightness(n: Vec3): number {
      const d = -dot(n, lightDir);
      return Math.max(0.08, Math.min(0.95, d * 0.9 + 0.15));
    }

    // Pre-compute each object's transformed vertices and center depth
    const objectRenders: ObjectRender[] = [];

    for (const obj of objects) {
      const { geometry, position, rotation, scale: objScale } = obj;
      // Final scale = object scale × responsive scale × device pixel ratio
      const s = objScale * rScale * dpr;

      // Transform each vertex: scale → rotate → translate to world position
      const transformed: Vec3[] = geometry.vertices.map((v) => {
        let tv: Vec3 = [v[0] * s, v[1] * s, v[2] * s];
        tv = rotateX(tv, rotation[0]);
        tv = rotateY(tv, rotation[1]);
        tv = rotateZ(tv, rotation[2]);
        return [
          tv[0] + position[0] * rScale * dpr,
          tv[1] + position[1] * rScale * dpr,
          tv[2] + position[2] * rScale * dpr,
        ];
      });

      // Object center depth (for inter-object sorting)
      const centerZ = position[2] * rScale * dpr + FOV * dpr;

      const objFaces: FaceData[] = [];
      const capStart = geometry.capStart ?? Infinity;

      for (let fi = 0; fi < geometry.faces.length; fi++) {
        const face = geometry.faces[fi];
        const a = transformed[face[0]];
        const b = transformed[face[1]];
        const c = transformed[face[2]];

        // Backface culling against camera vector (perspective-correct).
        // Geometry winding in this scene is inward-facing, so a negative
        // dot product indicates a face that should be visible.
        const fn = normalize(faceNormal(a, b, c));
        const faceCenter: Vec3 = [
          (a[0] + b[0] + c[0]) / 3,
          (a[1] + b[1] + c[1]) / 3,
          (a[2] + b[2] + c[2]) / 3,
        ];
        const toCamera: Vec3 = [
          -faceCenter[0],
          -faceCenter[1],
          -FOV * dpr - faceCenter[2],
        ];
        if (dot(fn, toCamera) >= 0) continue;

        const brightness = calcBrightness(fn);

        // Project 3D → 2D screen coordinates
        const pa = project(a, FOV * dpr, cx, cy);
        const pb = project(b, FOV * dpr, cx, cy);
        const pc = project(c, FOV * dpr, cx, cy);

        let centroidDepth = (pa[2] + pb[2] + pc[2]) / 3;

        // Cap faces (e.g. cone base) get a depth bias so they sort behind
        // side faces, preventing cap-over-side artifacts.
        if (fi >= capStart) centroidDepth += 50;

        objFaces.push({
          projected: [[pa[0], pa[1]], [pb[0], pb[1]], [pc[0], pc[1]]],
          depth: centroidDepth,
          brightness,
        });
      }

      objectRenders.push({
        centerDepth: centerZ,
        dotSpacingMul: obj.dotSpacingMul ?? 1,
        alphaMul: obj.alphaMul ?? 1,
        faces: objFaces,
      });
    }

    if (forceClear || !hasRendered) {
      ctx.clearRect(0, 0, w, h);
      hasRendered = true;
    } else {
      // Keep a short ghost trail so motion feels richer and more present.
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = `rgba(0,0,0,${TRAIL_FADE_ALPHA})`;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }

    // Sort objects far-to-near (draw distant objects first)
    objectRenders.sort((a, b) => b.centerDepth - a.centerDepth);
    const nearDepth = Math.min(...objectRenders.map((o) => o.centerDepth));
    const farDepth = Math.max(...objectRenders.map((o) => o.centerDepth));
    const depthSpan = Math.max(1, farDepth - nearDepth);

    // Draw each object to a temporary grayscale layer, then halftone it with
    // depth-aware dot spacing/alpha for stronger separation.
    for (const objRender of objectRenders) {
      if (objRender.faces.length === 0) continue;
      offCtx.clearRect(0, 0, w, h);

      objRender.faces.sort((a, b) => b.depth - a.depth);
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      for (const face of objRender.faces) {
        const p0 = face.projected[0];
        const p1 = face.projected[1];
        const p2 = face.projected[2];

        minX = Math.min(minX, p0[0], p1[0], p2[0]);
        minY = Math.min(minY, p0[1], p1[1], p2[1]);
        maxX = Math.max(maxX, p0[0], p1[0], p2[0]);
        maxY = Math.max(maxY, p0[1], p1[1], p2[1]);

        offCtx.beginPath();
        offCtx.moveTo(p0[0], p0[1]);
        offCtx.lineTo(p1[0], p1[1]);
        offCtx.lineTo(p2[0], p2[1]);
        offCtx.closePath();

        // Flat shading: solid gray fill based on face brightness
        const gray = Math.round(face.brightness * 255);
        offCtx.fillStyle = `rgb(${gray},${gray},${gray})`;
        offCtx.fill();
      }

      if (minX === Infinity) continue;

      // Build an object silhouette mask from visible faces, then keep ring
      // bands around it (secondary + primary contours).
      const outlinePx = Math.max(1, Math.round(OUTLINE_WIDTH_CSS_PX * dpr));
      const secondaryOutlinePx = outlinePx + Math.max(1, Math.round(1.5 * dpr));

      const sourceX0 = Math.max(0, Math.floor(minX) - 2);
      const sourceY0 = Math.max(0, Math.floor(minY) - 2);
      const sourceX1 = Math.min(w, Math.ceil(maxX) + 2);
      const sourceY1 = Math.min(h, Math.ceil(maxY) + 2);
      const sourceW = sourceX1 - sourceX0;
      const sourceH = sourceY1 - sourceY0;
      if (sourceW <= 0 || sourceH <= 0) continue;

      maskCtx.clearRect(sourceX0, sourceY0, sourceW, sourceH);
      maskCtx.fillStyle = "#fff";
      for (const face of objRender.faces) {
        maskCtx.beginPath();
        maskCtx.moveTo(face.projected[0][0], face.projected[0][1]);
        maskCtx.lineTo(face.projected[1][0], face.projected[1][1]);
        maskCtx.lineTo(face.projected[2][0], face.projected[2][1]);
        maskCtx.closePath();
        maskCtx.fill();
      }

      function drawContour(radius: number, gray: number, alpha: number) {
        const ringX0 = Math.max(0, sourceX0 - radius);
        const ringY0 = Math.max(0, sourceY0 - radius);
        const ringX1 = Math.min(w, sourceX1 + radius);
        const ringY1 = Math.min(h, sourceY1 + radius);
        const ringW = ringX1 - ringX0;
        const ringH = ringY1 - ringY0;
        if (ringW <= 0 || ringH <= 0) return;

        outlineCtx.clearRect(ringX0, ringY0, ringW, ringH);
        outlineCtx.globalCompositeOperation = "source-over";
        const offsets = getOutlineOffsets(radius);
        for (const [dx, dy] of offsets) {
          outlineCtx.drawImage(
            maskCanvas,
            sourceX0,
            sourceY0,
            sourceW,
            sourceH,
            sourceX0 + dx,
            sourceY0 + dy,
            sourceW,
            sourceH,
          );
        }

        outlineCtx.globalCompositeOperation = "destination-out";
        outlineCtx.drawImage(maskCanvas, sourceX0, sourceY0, sourceW, sourceH, sourceX0, sourceY0, sourceW, sourceH);

        outlineCtx.globalCompositeOperation = "source-in";
        outlineCtx.fillStyle = `rgb(${gray},${gray},${gray})`;
        outlineCtx.fillRect(ringX0, ringY0, ringW, ringH);

        outlineCtx.globalCompositeOperation = "source-over";
        offCtx.save();
        offCtx.globalAlpha = alpha;
        offCtx.drawImage(outlineCanvas, ringX0, ringY0, ringW, ringH, ringX0, ringY0, ringW, ringH);
        offCtx.restore();
      }

      drawContour(secondaryOutlinePx, SECONDARY_OUTLINE_GRAY, SECONDARY_OUTLINE_ALPHA);
      drawContour(outlinePx, OUTLINE_GRAY, 1);

      const samplePad = secondaryOutlinePx + Math.ceil(scaledDot);
      const sampleX0 = Math.max(0, Math.floor(minX) - samplePad);
      const sampleY0 = Math.max(0, Math.floor(minY) - samplePad);
      const sampleX1 = Math.min(w, Math.ceil(maxX) + samplePad);
      const sampleY1 = Math.min(h, Math.ceil(maxY) + samplePad);
      const sampleW = sampleX1 - sampleX0;
      const sampleH = sampleY1 - sampleY0;
      if (sampleW <= 0 || sampleH <= 0) continue;

      const depthT = (objRender.centerDepth - nearDepth) / depthSpan; // 0 near, 1 far
      const objectDotSpacing = scaledDot * (0.82 + depthT * 0.38) * objRender.dotSpacingMul;
      const objectAlpha = Math.max(
        0.05,
        Math.min(1, colors.alpha * (1.12 - depthT * 0.42) * objRender.alphaMul),
      );

      const imageData = offCtx.getImageData(sampleX0, sampleY0, sampleW, sampleH);
      applyHalftone(
        ctx,
        imageData,
        w,
        h,
        objectDotSpacing,
        colors.r,
        colors.g,
        colors.b,
        objectAlpha,
        { clear: false, offsetX: sampleX0, offsetY: sampleY0 },
      );
    }
  }

  // ─── Animation loop ─────────────────────────────────────────────────────

  function updateSceneMotion(timeSec: number) {
    // Pulse occasionally nudges rotations toward a shared heading, creating
    // periodic visual "alignment" moments without locking motion.
    const alignPulse = Math.pow((Math.sin(timeSec * 0.65) + 1) * 0.5, 8);
    const alignTarget = timeSec * 0.9;

    for (const obj of objects) {
      obj.rotation[0] += obj.rotationSpeed[0];
      obj.rotation[1] += obj.rotationSpeed[1];
      obj.rotation[2] += obj.rotationSpeed[2];

      if (obj.kind === "cube") {
        // Steady spin with a subtle hover.
        obj.position[0] = obj.anchor[0] + Math.sin(timeSec * 0.55) * 8;
        obj.position[1] = obj.anchor[1] + Math.sin(timeSec * 0.9 + 0.6) * 6;
        obj.position[2] = obj.anchor[2] + Math.cos(timeSec * 0.4) * 8;
      } else if (obj.kind === "sphere") {
        // Wide orbit to create clear depth/foreground interplay.
        obj.position[0] = obj.anchor[0] + Math.cos(timeSec * 0.5) * 36;
        obj.position[1] = obj.anchor[1] + Math.sin(timeSec * 0.8 + 0.7) * 14;
        obj.position[2] = obj.anchor[2] + Math.sin(timeSec * 0.5) * 30;
      } else {
        // Counter-rotating cone with restrained drift (stays behind).
        obj.position[0] = obj.anchor[0] + Math.cos(timeSec * 0.38 + 1.8) * 14;
        obj.position[1] = obj.anchor[1] + Math.sin(timeSec * 0.72 + 2.1) * 9;
        obj.position[2] = obj.anchor[2] + Math.sin(timeSec * 0.38 + 1.8) * 16;
      }

      const alignStrength = obj.kind === "sphere" ? 0.035 : 0.024;
      obj.rotation[1] += wrapAngle(alignTarget - obj.rotation[1]) * alignStrength * alignPulse;
    }
  }

  function animate(time: number) {
    if (!running) return;
    animId = requestAnimationFrame(animate);

    // Frame-rate limiter: skip frames to maintain target FPS
    if (time - lastFrame < FRAME_MS) return;
    lastFrame = time;

    const timeSec = time * 0.001;
    updateSceneMotion(timeSec);
    renderFrame(timeSec, false);
  }

  // ─── Initialization ─────────────────────────────────────────────────────

  // Accessibility: if user prefers reduced motion, render one static frame only
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  resize();

  if (reducedMotion) {
    renderFrame(0, true);
  } else {
    animId = requestAnimationFrame(animate);
  }

  // ─── Observers & listeners ──────────────────────────────────────────────

  // Re-render on container resize (responsive)
  const resizeObserver = new ResizeObserver(() => {
    resize();
    if (reducedMotion) renderFrame(0, true);
  });
  resizeObserver.observe(canvas.parentElement!);

  // Watch for dark/light theme toggle (class change on <html>)
  const mutationObserver = new MutationObserver(() => {
    colors = getThemeColors();
    if (reducedMotion) renderFrame(0, true);
  });
  mutationObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  // Pause animation when the browser tab is hidden to save CPU
  const onVisibility = () => {
    if (reducedMotion) return;
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(animId);
    } else {
      running = true;
      lastFrame = 0;
      animId = requestAnimationFrame(animate);
    }
  };
  document.addEventListener("visibilitychange", onVisibility);

  // ─── Cleanup ────────────────────────────────────────────────────────────

  return () => {
    running = false;
    cancelAnimationFrame(animId);
    resizeObserver.disconnect();
    mutationObserver.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
