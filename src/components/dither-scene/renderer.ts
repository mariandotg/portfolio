import type { Vec3 } from "./math";
import { rotateX, rotateY, rotateZ, project, faceNormal, dot, normalize } from "./math";
import { createCube, createSphere, createCone, type Geometry } from "./shapes";
import { applyHalftone } from "./dither";

// ─── Types ───────────────────────────────────────────────────────────────────

interface SceneObject {
  geometry: Geometry;
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
const LIGHT_DIR: Vec3 = normalize([0.3, -1.3, -0.5]);

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
const FPS = 120;
const FRAME_MS = 1000 / FPS;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getThemeColors(): ThemeColors {
  return document.documentElement.classList.contains("dark") ? DARK_THEME : LIGHT_THEME;
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

  // ─── Scene objects ───────────────────────────────────────────────────────
  // Each object = geometry + position/rotation/speed/scale.
  // Edit these to change what shapes appear, where they sit, how big/fast they are.

  const objects: SceneObject[] = [
    {
      // CUBE — sits left and slightly below center
      geometry: createCube(100),          // 100 = edge length in world units
      position: [-80, 60, 20],            // [left, below-center, slightly back]
      rotation: [0.3, 0.5, 0],            // initial rotation angles (radians)
      rotationSpeed: [0.008, 0.012, 0.004], // spin speed per frame [x, y, z]
      scale: 1.3,                            // 1 = native size
    },
    {
      // SPHERE — sits right-of-center, further back (depth overlap with cube)
      geometry: createSphere(80, 28),     // radius=80, 28 segments (smooth gradient)
      position: [60, -30, 60],           // [right, above-center, far back]
      rotation: [0, 0.3, 0],
      rotationSpeed: [0.005, 0.007, 0.003],
      scale: 1.3,
    },
    {
      // CONE — sits upper-left, closest to camera
      geometry: createCone(50, 80, 14),  // radius=55, height=120, 14 slices
      position: [-60, -90, -70],          // [left, well above center, in front]
      rotation: [0.5, 0, 0.3],
      rotationSpeed: [0.007, 0.009, 0.005],
      scale: 1.3,
    },
  ];

  let colors = getThemeColors();
  let animId = 0;
  let lastFrame = 0;
  let running = true;
  let dpr = 1; // device pixel ratio (capped at 2 for perf)

  // ─── Resize handler ─────────────────────────────────────────────────────
  // Matches canvas size to its parent container, accounting for device pixel ratio.

  function resize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pw = Math.round(rect.width * dpr);   // physical pixel width
    const ph = Math.round(rect.height * dpr);  // physical pixel height
    canvas.width = pw;
    canvas.height = ph;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    offscreen.width = pw;
    offscreen.height = ph;
  }

  // ─── Render one frame ───────────────────────────────────────────────────

  function renderFrame() {
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

    // ── Phase 1: Render grayscale geometry to offscreen canvas ───────────
    // Each object is rendered independently to avoid cross-object face interleaving.
    // Objects are sorted by center depth (far → near), then faces within each
    // object are sorted by centroid depth. This prevents artifacts where long
    // triangles (like cone sides) interleave with faces from other shapes.

    offCtx.clearRect(0, 0, w, h);

    type FaceData = {
      projected: [number, number][];
      depth: number;
      brightness: number;
    };

    /** Compute brightness from a normal vector and clamp to range.
     *  - 0.9: contrast multiplier (higher = more difference between lit/shadow)
     *  - 0.15: ambient base (lower = darker shadows)
     *  - Range 0.08–0.95 for good halftone contrast */
    function calcBrightness(n: Vec3): number {
      const d = -dot(n, LIGHT_DIR);
      return Math.max(0.08, Math.min(0.95, d * 0.9 + 0.15));
    }

    // Pre-compute each object's transformed vertices and center depth
    const objectRenders: { centerDepth: number; faces: FaceData[] }[] = [];

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

        // Backface culling: skip faces pointing away from camera.
        // This prevents back-face triangles from z-fighting with front-faces.
        const fn = normalize(faceNormal(a, b, c));
        if (fn[2] < 0) continue;

        const brightness = calcBrightness(fn);

        // Project 3D → 2D screen coordinates
        const pa = project(a, FOV * dpr, cx, cy);
        const pb = project(b, FOV * dpr, cx, cy);
        const pc = project(c, FOV * dpr, cx, cy);

        let centroidDepth = (pa[2] + pb[2] + pc[2]) / 3;

        // Cap faces (e.g. cone base) get a depth bias so they sort behind
        // side faces, preventing cap-over-side artifacts.
        if (fi >= capStart) {
          centroidDepth += 50;
        }

        objFaces.push({
          projected: [[pa[0], pa[1]], [pb[0], pb[1]], [pc[0], pc[1]]],
          depth: centroidDepth,
          brightness,
        });
      }

      objectRenders.push({ centerDepth: centerZ, faces: objFaces });
    }

    // Sort objects far-to-near (draw distant objects first)
    objectRenders.sort((a, b) => b.centerDepth - a.centerDepth);

    // Draw each object: sort its own faces far-to-near, then fill
    for (const objRender of objectRenders) {
      objRender.faces.sort((a, b) => b.depth - a.depth);

      for (const face of objRender.faces) {
        offCtx.beginPath();
        offCtx.moveTo(face.projected[0][0], face.projected[0][1]);
        offCtx.lineTo(face.projected[1][0], face.projected[1][1]);
        offCtx.lineTo(face.projected[2][0], face.projected[2][1]);
        offCtx.closePath();

        // Flat shading: solid gray fill based on face brightness
        const gray = Math.round(face.brightness * 255);
        offCtx.fillStyle = `rgb(${gray},${gray},${gray})`;
        offCtx.fill();
      }
    }

    // ── Phase 2: Halftone post-process ──────────────────────────────────
    // Read the grayscale offscreen buffer, then draw halftone dots on the main canvas.
    // The dot size at each grid point is proportional to the darkness of the source pixel.
    const imageData = offCtx.getImageData(0, 0, w, h);
    applyHalftone(
      ctx!,
      imageData,
      w,
      h,
      scaledDot,
      colors.r,
      colors.g,
      colors.b,
      colors.alpha,
    );
  }

  // ─── Animation loop ─────────────────────────────────────────────────────

  function animate(time: number) {
    if (!running) return;
    animId = requestAnimationFrame(animate);

    // Frame-rate limiter: skip frames to maintain target FPS
    if (time - lastFrame < FRAME_MS) return;
    lastFrame = time;

    // Update rotations for each shape
    for (const obj of objects) {
      obj.rotation[0] += obj.rotationSpeed[0];
      obj.rotation[1] += obj.rotationSpeed[1];
      obj.rotation[2] += obj.rotationSpeed[2];
    }

    renderFrame();
  }

  // ─── Initialization ─────────────────────────────────────────────────────

  // Accessibility: if user prefers reduced motion, render one static frame only
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  resize();

  if (reducedMotion) {
    renderFrame();
  } else {
    animId = requestAnimationFrame(animate);
  }

  // ─── Observers & listeners ──────────────────────────────────────────────

  // Re-render on container resize (responsive)
  const resizeObserver = new ResizeObserver(() => {
    resize();
    if (reducedMotion) renderFrame();
  });
  resizeObserver.observe(canvas.parentElement!);

  // Watch for dark/light theme toggle (class change on <html>)
  const mutationObserver = new MutationObserver(() => {
    colors = getThemeColors();
    if (reducedMotion) renderFrame();
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
