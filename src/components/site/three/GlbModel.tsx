import { useGLTF } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { Component, Suspense, useLayoutEffect, useMemo, type ReactNode } from "react";
import * as THREE from "three";

export type GlbModelProps = {
  url: string;
  position?: [number, number, number] | undefined;
  rotation?: [number, number, number] | undefined;
  scale?: number | [number, number, number] | undefined;
  /** Case / body tint. Only applied to untextured opaque body materials. */
  tint?: string | undefined;
  tintStrength?: number | undefined;
  /** ARGB colour: drives emissive materials (fans, LED strips) so bloom picks them up. */
  accent?: string | undefined;
  accentIntensity?: number | undefined;
  hideGlass?: boolean | undefined;
  /** Replace a material (matched by name) with a custom one, e.g. a monitor screen. */
  overrides?: { match: RegExp; material: THREE.Material }[] | undefined;
  castShadow?: boolean | undefined;
  onClick?: (() => void) | undefined;
};

const GLASS = /glass|tamperd|vraymtl1/i;
const ARGB = /argb|fan\.blade|vraymtl2|light_blue|rgb/i;

class ModelErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override render() {
    return this.state.failed ? null : this.props.children;
  }
}

function prepareMaterial(src: THREE.Material): THREE.Material {
  const m = src.clone();
  if (m instanceof THREE.MeshStandardMaterial) {
    // Some Sketchfab/FBX exports arrive as metal=1 rough=1 (renders as flat grey/black).
    if (m.metalness >= 0.99 && m.roughness >= 0.99) {
      m.metalness = m.map ? 0.15 : 0.6;
      m.roughness = 0.55;
    }
    m.envMapIntensity = 1;
    if (m.map) m.map.anisotropy = 8;
  }
  return m;
}

function Inner({
  url,
  position,
  rotation,
  scale = 1,
  tint,
  tintStrength = 0.6,
  accent,
  accentIntensity = 2.2,
  hideGlass,
  overrides,
  castShadow = true,
  onClick,
}: GlbModelProps) {
  const { scene } = useGLTF(url);

  // Deep clone with per-instance materials so tint/accent never leak between instances.
  const clone = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = castShadow;
      mesh.receiveShadow = true;
      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map(prepareMaterial)
        : prepareMaterial(mesh.material);
    });
    return c;
  }, [scene, castShadow]);

  useLayoutEffect(() => {
    const base = new Map<THREE.Material, { color: THREE.Color; emissive: THREE.Color }>();
    clone.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((mat, i) => {
        const name = `${mat.name ?? ""} ${mesh.name ?? ""}`;
        const ov = overrides?.find((x) => x.match.test(mat.name ?? ""));
        if (ov) {
          // planar UVs so a full-screen texture maps edge to edge whatever the source UVs were
          if (!mesh.userData["planarUv"]) {
            const g = mesh.geometry.clone();
            g.computeBoundingBox();
            const bb = g.boundingBox!;
            const pos = g.attributes["position"]!;
            const uv = new Float32Array(pos.count * 2);
            const sx = bb.max.x - bb.min.x || 1;
            const sy = bb.max.y - bb.min.y || 1;
            for (let k = 0; k < pos.count; k++) {
              uv[k * 2] = 1 - (pos.getX(k) - bb.min.x) / sx;
              uv[k * 2 + 1] = (pos.getY(k) - bb.min.y) / sy;
            }
            g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
            mesh.geometry = g;
            mesh.userData["planarUv"] = true;
          }
          if (Array.isArray(mesh.material)) mesh.material[i] = ov.material;
          else mesh.material = ov.material;
          return;
        }
        if (!(mat instanceof THREE.MeshStandardMaterial)) return;
        if (!base.has(mat))
          base.set(mat, { color: mat.color.clone(), emissive: mat.emissive.clone() });
        const b = base.get(mat)!;
        if (GLASS.test(name)) {
          mesh.visible = !hideGlass;
          mat.transparent = true;
          mat.color.set("#9fb4c8");
          mat.opacity = 0.09;
          mat.roughness = 0.03;
          mat.metalness = 0;
          mat.depthWrite = false;
          mat.envMapIntensity = 0.7;
          return;
        }
        const glowing = b.emissive.r + b.emissive.g + b.emissive.b > 0.25;
        if (accent && (ARGB.test(mat.name ?? "") || (glowing && !mat.emissiveMap))) {
          mat.emissive.set(accent);
          mat.emissiveIntensity = accentIntensity;
          mat.toneMapped = false;
          return;
        }
        mat.color.copy(b.color);
        if (tint && !mat.map && !mat.transparent)
          mat.color.lerp(new THREE.Color(tint), tintStrength);
      });
    });
  }, [clone, tint, tintStrength, accent, accentIntensity, hideGlass, overrides]);

  return (
    <primitive
      object={clone}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={
        onClick
          ? (e: ThreeEvent<MouseEvent>) => {
              e.stopPropagation();
              onClick();
            }
          : undefined
      }
      onPointerOver={
        onClick
          ? (e: ThreeEvent<PointerEvent>) => {
              e.stopPropagation();
              document.body.style.cursor = "pointer";
            }
          : undefined
      }
      onPointerOut={
        onClick
          ? () => {
              document.body.style.cursor = "";
            }
          : undefined
      }
    />
  );
}

export function GlbModel(props: GlbModelProps) {
  if (!props.url) return null;
  return (
    <ModelErrorBoundary>
      <Suspense fallback={null}>
        <Inner {...props} />
      </Suspense>
    </ModelErrorBoundary>
  );
}

/** Animated, glowing wallpaper for monitor screens. */
export function makeScreenMaterial(accent: string) {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 576;
  const g = c.getContext("2d")!;
  const bg = g.createLinearGradient(0, 0, 1024, 576);
  bg.addColorStop(0, "#05070c");
  bg.addColorStop(0.55, "#0b1220");
  bg.addColorStop(1, "#05070c");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1024, 576);
  const glow = g.createRadialGradient(720, 250, 10, 720, 250, 420);
  glow.addColorStop(0, accent);
  glow.addColorStop(1, "transparent");
  g.globalAlpha = 0.55;
  g.fillStyle = glow;
  g.fillRect(0, 0, 1024, 576);
  g.globalAlpha = 1;
  g.strokeStyle = accent;
  g.lineWidth = 3;
  for (let i = 0; i < 7; i++) {
    g.globalAlpha = 0.12 + i * 0.05;
    g.beginPath();
    g.moveTo(0, 470 - i * 34);
    g.bezierCurveTo(300, 420 - i * 60, 620, 520 - i * 20, 1024, 300 - i * 30);
    g.stroke();
  }
  g.globalAlpha = 1;
  g.fillStyle = "#e8eef8";
  g.font = "bold 64px Inter, system-ui, sans-serif";
  g.fillText("PC BUILDER", 70, 130);
  g.font = "28px Inter, system-ui, sans-serif";
  g.fillStyle = "rgba(232,238,248,0.6)";
  g.fillText("Ready to play", 72, 176);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return new THREE.MeshStandardMaterial({
    map: tex,
    emissiveMap: tex,
    emissive: new THREE.Color("#ffffff"),
    emissiveIntensity: 0.9,
    roughness: 0.18,
    metalness: 0,
    side: THREE.DoubleSide,
    name: "screen.wallpaper",
  });
}

export function preloadModels(urls: string[]) {
  urls.forEach((u) => u && useGLTF.preload(u));
}
