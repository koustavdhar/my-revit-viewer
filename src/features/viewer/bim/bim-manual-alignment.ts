import * as THREE from "three";

/**
 * MVP manual placement of the whole IFC root in the Three.js scene (Combined mode).
 * Values are in the viewer’s 3D units — not map lon/lat.
 */
export type BimManualAlignment = {
  offsetX: number;
  offsetY: number;
  offsetZ: number;
  /** Degrees around the scene up axis (Three.js Y). */
  rotationYDeg: number;
  /** 1 = original size; uniform scale on the model root. */
  uniformScale: number;
};

export const DEFAULT_BIM_MANUAL_ALIGNMENT: BimManualAlignment = {
  offsetX: 0,
  offsetY: 0,
  offsetZ: 0,
  rotationYDeg: 0,
  uniformScale: 1,
};

export function applyBimManualAlignment(target: THREE.Object3D, a: BimManualAlignment) {
  target.position.set(a.offsetX, a.offsetY, a.offsetZ);
  target.rotation.set(0, THREE.MathUtils.degToRad(a.rotationYDeg), 0, "XYZ");
  const s = Number.isFinite(a.uniformScale) && a.uniformScale > 0 ? a.uniformScale : 1;
  target.scale.setScalar(Math.max(0.001, s));
}
