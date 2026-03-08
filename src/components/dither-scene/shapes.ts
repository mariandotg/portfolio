import type { Vec3 } from "./math";

export interface Geometry {
  vertices: Vec3[];
  faces: [number, number, number][];
  /** Index into faces[] where cap/closing faces start (used for depth bias).
   *  Faces from this index onward get pushed back in depth sorting so they
   *  don't z-fight with side faces. Undefined = no cap faces. */
  capStart?: number;
}

/**
 * Creates a cube centered at origin.
 * @param size – edge length of the cube (e.g. 100 → extends from -50 to +50)
 */
export function createCube(size: number): Geometry {
  const s = size / 2;
  const vertices: Vec3[] = [
    [-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s], // front face (z = -s)
    [-s, -s, s], [s, -s, s], [s, s, s], [-s, s, s],     // back face  (z = +s)
  ];
  const faces: [number, number, number][] = [
    [0, 1, 2], [0, 2, 3],   // front
    [5, 4, 7], [5, 7, 6],   // back
    [3, 2, 6], [3, 6, 7],   // top
    [4, 5, 1], [4, 1, 0],   // bottom
    [1, 5, 6], [1, 6, 2],   // right
    [4, 0, 3], [4, 3, 7],   // left
  ];
  return { vertices, faces };
}

/**
 * Creates a UV sphere centered at origin.
 * @param radius   – sphere radius (e.g. 80 → 160px diameter before projection)
 * @param segments – lat/lon subdivisions. Higher = smoother brightness gradient.
 *                   Use 24+ for a smooth halftone look.
 */
export function createSphere(radius: number, segments: number): Geometry {
  const vertices: Vec3[] = [];
  const faces: [number, number, number][] = [];

  for (let lat = 0; lat <= segments; lat++) {
    const theta = (lat * Math.PI) / segments;
    const sinT = Math.sin(theta);
    const cosT = Math.cos(theta);
    for (let lon = 0; lon <= segments; lon++) {
      const phi = (lon * 2 * Math.PI) / segments;
      vertices.push([
        radius * sinT * Math.cos(phi),
        radius * cosT,
        radius * sinT * Math.sin(phi),
      ]);
    }
  }

  for (let lat = 0; lat < segments; lat++) {
    for (let lon = 0; lon < segments; lon++) {
      const a = lat * (segments + 1) + lon;
      const b = a + segments + 1;
      faces.push([a, b, a + 1]);
      faces.push([b, b + 1, a + 1]);
    }
  }

  return { vertices, faces };
}

/**
 * Creates a cone centered at origin, pointing upward (tip at -y).
 * @param radius   – base circle radius (e.g. 55)
 * @param height   – total height from base to tip (e.g. 120)
 * @param segments – number of slices around the base. 12-16 is typical.
 */
export function createCone(radius: number, height: number, segments: number): Geometry {
  const vertices: Vec3[] = [];
  const faces: [number, number, number][] = [];

  // Pivot is at the base (y=0). Tip extends upward (negative y).
  // This makes the cone rotate around its base/cap.
  // Index 0: tip (top of cone)
  vertices.push([0, -height, 0]);
  // Index 1: base center (for base cap triangles)
  vertices.push([0, 0, 0]);

  // Indices 2..segments+1: base ring vertices
  for (let i = 0; i < segments; i++) {
    const angle = (i * 2 * Math.PI) / segments;
    vertices.push([radius * Math.cos(angle), 0, radius * Math.sin(angle)]);
  }

  // Side faces
  for (let i = 0; i < segments; i++) {
    const next = ((i + 1) % segments) + 2;
    // Keep winding consistent with cube/sphere (inward-facing normals).
    faces.push([0, next, i + 2]);
  }

  const capStart = faces.length;

  // Base cap
  for (let i = 0; i < segments; i++) {
    const next = ((i + 1) % segments) + 2;
    // Inward winding for consistency with the renderer's culling/shading convention.
    faces.push([1, i + 2, next]);
  }

  return { vertices, faces, capStart };
}
