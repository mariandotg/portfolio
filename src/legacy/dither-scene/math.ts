/**
 * 3D math utilities for the dither scene.
 * All vectors are [x, y, z] tuples. The coordinate system is:
 *   x → right, y → down, z → into screen (away from camera).
 * The camera sits at z = -FOV looking toward +z.
 */

export type Vec3 = [number, number, number];

/** Rotate a vector around the X axis by `angle` radians. */
export function rotateX(v: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [v[0], v[1] * c - v[2] * s, v[1] * s + v[2] * c];
}

/** Rotate a vector around the Y axis by `angle` radians. */
export function rotateY(v: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [v[0] * c + v[2] * s, v[1], -v[0] * s + v[2] * c];
}

/** Rotate a vector around the Z axis by `angle` radians. */
export function rotateZ(v: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [v[0] * c - v[1] * s, v[0] * s + v[1] * c, v[2]];
}

/**
 * Perspective projection: maps a 3D point to 2D screen coordinates.
 * @param v    – world-space vertex
 * @param fov  – field-of-view distance (larger = less perspective distortion)
 * @param cx   – screen-space X center (projection origin)
 * @param cy   – screen-space Y center (projection origin)
 * @returns [screenX, screenY, depth] – depth is used for sorting
 */
export function project(
  v: Vec3,
  fov: number,
  cx: number,
  cy: number,
): [number, number, number] {
  const z = v[2] + fov;
  const scale = fov / z;
  return [v[0] * scale + cx, v[1] * scale + cy, z];
}

/**
 * Compute the face normal of a triangle (cross product of two edges).
 * Used for backface culling and flat shading.
 */
export function faceNormal(a: Vec3, b: Vec3, c: Vec3): Vec3 {
  const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
  const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
  return [
    uy * vz - uz * vy,
    uz * vx - ux * vz,
    ux * vy - uy * vx,
  ];
}

/** Dot product of two vectors. */
export function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

/** Normalize a vector to unit length. Returns [0,0,0] for zero-length input. */
export function normalize(v: Vec3): Vec3 {
  const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  if (len === 0) return [0, 0, 0];
  return [v[0] / len, v[1] / len, v[2] / len];
}
