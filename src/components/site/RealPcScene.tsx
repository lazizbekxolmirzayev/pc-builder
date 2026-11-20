import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  MeshReflectorMaterial,
  OrbitControls,
} from "@react-three/drei";
import { Bloom, EffectComposer, SMAA, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import type { Selection } from "@/lib/build";
import { getPart, type Category } from "@/data/parts";
import { HDRI, MODELS, modelFor, monitorInches } from "@/data/models3d";
import { GlbModel, makeScreenMaterial, preloadModels } from "@/components/site/three/GlbModel";

export type RealPcSceneProps = {
  selection: Selection;
  accent?: string | undefined;
  customColor?: string | undefined;
  spin?: boolean | undefined;
  exploded?: number | undefined;
  glassOpen?: boolean | undefined;
  focusPart?: Category | "all" | undefined;
  onSelectPart?: ((category: Category) => void) | undefined;
  /** "desk" = full photoreal desk setup, "pc" = just the computer on a studio floor. */
  mode?: "desk" | "pc" | undefined;
  /** Lower-cost rendering for small previews. */
  lite?: boolean | undefined;
};

type V3 = [number, number, number];

/* ---------------------------------------------------------------------------
 * Layout — all models are normalized to meters and "installed" orientation in
 * case-local axes (glass = -X, front = +Z, up = +Y). See scripts/normalize-models.mjs.
 * ------------------------------------------------------------------------- */
const BOARD: V3 = [0.0505, 0.325, -0.085]; // motherboard centre inside the case
const onBoard = (x: number, y: number, z: number): V3 => [BOARD[0] + x, BOARD[1] + y, BOARD[2] + z];

const LAYOUT = {
  motherboard: { pos: BOARD, explode: [0.02, 0.04, 0] as V3 },
  cpu: { pos: onBoard(0.011, 0.041, 0.021), explode: [-0.12, 0.06, 0] as V3 },
  cooler: { pos: onBoard(-0.0705, 0.041, 0.021), explode: [-0.26, 0.1, 0] as V3 },
  ram: {
    pos: (i: number, n: number): V3 => onBoard(-0.008, 0.03, 0.074 + i * (n > 2 ? 0.0085 : 0.012)),
    explode: [-0.16, 0.06, 0.04] as V3,
  },
  gpu: { pos: onBoard(-0.061, -0.067, 0.031), explode: [-0.26, -0.04, 0.06] as V3 },
  nvme: { pos: onBoard(0.016, -0.02, 0.0), explode: [-0.1, 0, 0.12] as V3 },
  sata: { pos: [-0.02, 0.0255, 0.11] as V3, explode: [-0.14, 0.04, 0.12] as V3 },
  psu: { pos: [0, 0.0625, -0.128] as V3, explode: [-0.22, -0.02, -0.08] as V3 },
} as const;

const FANS: { pos: V3; rot: V3; caseOnly?: "case4000d" }[] = [
  { pos: [-0.035, 0.4, -0.198], rot: [0, 0, 0] }, // rear exhaust
  { pos: [-0.02, 0.457, -0.02], rot: [-Math.PI / 2, 0, 0] }, // top
  { pos: [-0.02, 0.457, -0.14], rot: [-Math.PI / 2, 0, 0] }, // top
  { pos: [-0.01, 0.1, 0.19], rot: [0, 0, 0], caseOnly: "case4000d" },
  { pos: [-0.01, 0.225, 0.19], rot: [0, 0, 0], caseOnly: "case4000d" },
  { pos: [-0.01, 0.35, 0.19], rot: [0, 0, 0], caseOnly: "case4000d" },
];

const DESK_TOP = 0.74;
const PC_DESK_POS: V3 = [-0.56, DESK_TOP, -0.07];
const PC_DESK_ROT = Math.PI / 2; // glass panel faces the viewer, front panel faces the monitor

const add = (a: V3, b: V3, k: number): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];

function Computer({ p, onDesk }: { p: RealPcSceneProps; onDesk: boolean }) {
  const s = p.selection;
  const part = (c: Category) => (s[c] ? getPart(s[c]!) : undefined);
  const e = p.exploded ?? 0;
  const accent = p.accent ?? "#22d3ee";
  const select = (c: Category) => () => p.onSelectPart?.(c);

  const caseModel = modelFor(part("case"), "case");
  const ram = part("ram");
  const ramCount =
    ram?.specs?.["Kit"]?.includes("4") || /\(4x/.test(ram?.specs?.["Capacity"] ?? "") ? 4 : 2;
  const gpu = part("gpu");
  const gpuScale = Math.max(0.88, Math.min(1.14, (gpu?.gpuLength ?? 313) / 313));
  const storage = part("storage");
  const storageModel = modelFor(storage, "storage");

  return (
    <group
      position={onDesk ? PC_DESK_POS : [0, 0, 0]}
      rotation={[0, onDesk ? PC_DESK_ROT : Math.PI / 2, 0]}
    >
      {s.case && (
        <GlbModel
          url={caseModel.url}
          tint={p.customColor ?? "#15181f"}
          tintStrength={0.82}
          accent={accent}
          hideGlass={p.glassOpen || e > 0.05}
          onClick={select("case")}
        />
      )}
      {/* ARGB glow inside the case */}
      {s.case && (
        <pointLight
          position={[-0.04, 0.3, 0]}
          intensity={0.12}
          distance={0.6}
          decay={2}
          color={accent}
        />
      )}

      {s.motherboard && (
        <GlbModel
          url={MODELS.motherboard.url}
          position={add(LAYOUT.motherboard.pos, LAYOUT.motherboard.explode, e)}
          onClick={select("motherboard")}
        />
      )}
      {s.cpu && (
        <GlbModel
          url={modelFor(part("cpu")).url}
          position={add(LAYOUT.cpu.pos, LAYOUT.cpu.explode, e)}
          onClick={select("cpu")}
        />
      )}
      {s.ram &&
        Array.from({ length: ramCount }).map((_, i) => (
          <GlbModel
            key={i}
            url={modelFor(ram).url}
            position={add(LAYOUT.ram.pos(i, ramCount), LAYOUT.ram.explode, e)}
            accent={accent}
            onClick={select("ram")}
          />
        ))}
      {s.cooler && (
        <GlbModel
          url={modelFor(part("cooler")).url}
          position={add(LAYOUT.cooler.pos, LAYOUT.cooler.explode, e)}
          onClick={select("cooler")}
        />
      )}
      {s.gpu && (
        <group position={add(LAYOUT.gpu.pos, LAYOUT.gpu.explode, e)} scale={[1, 1, gpuScale]}>
          <GlbModel url={modelFor(gpu).url} accent={accent} onClick={select("gpu")} />
        </group>
      )}
      {s.storage &&
        (storageModel === MODELS.nvme ? (
          <GlbModel
            url={MODELS.nvme.url}
            position={add(LAYOUT.nvme.pos, LAYOUT.nvme.explode, e)}
            onClick={select("storage")}
          />
        ) : (
          <GlbModel
            url={MODELS.sata.url}
            position={add(LAYOUT.sata.pos, LAYOUT.sata.explode, e)}
            onClick={select("storage")}
          />
        ))}
      {s.psu && (
        <GlbModel
          url={MODELS.psu.url}
          position={add(LAYOUT.psu.pos, LAYOUT.psu.explode, e)}
          onClick={select("psu")}
        />
      )}

      {s.case &&
        FANS.filter((f) => !f.caseOnly || f.caseOnly === caseModel.id).map((f, i) => (
          <GlbModel
            key={i}
            url={MODELS.fan.url}
            position={f.pos}
            rotation={f.rot}
            accent={accent}
            accentIntensity={3}
            castShadow={false}
          />
        ))}
    </group>
  );
}

function DeskSetup({ p }: { p: RealPcSceneProps }) {
  const s = p.selection;
  const accent = p.accent ?? "#22d3ee";
  const monitor = s.monitor ? getPart(s.monitor) : undefined;
  const monScale = monitorInches(monitor) / 27;
  const screen = useMemo(() => makeScreenMaterial(accent), [accent]);
  const overrides = useMemo(() => [{ match: /^screen$/i, material: screen }], [screen]);
  const select = (c: Category) => () => p.onSelectPart?.(c);

  return (
    <group>
      <GlbModel url={MODELS.desk.url} onClick={s.desk ? select("desk") : undefined} />
      <GlbModel url={MODELS.deskMat.url} position={[0.14, DESK_TOP, 0.07]} castShadow={false} />
      <GlbModel
        url={MODELS.monitor.url}
        position={[0.14, DESK_TOP + 0.004, -0.2]}
        scale={monScale}
        overrides={overrides}
        onClick={select("monitor")}
      />
      <GlbModel
        url={MODELS.keyboard.url}
        position={[0.06, DESK_TOP + 0.005, 0.13]}
        accent={accent}
        accentIntensity={1.4}
        onClick={select("keyboard")}
      />
      <GlbModel
        url={MODELS.mouse.url}
        position={[0.44, DESK_TOP + 0.005, 0.14]}
        rotation={[0, 0.12, 0]}
        accent={accent}
        onClick={select("mouse")}
      />
      <GlbModel
        url={MODELS.chair.url}
        position={[0.98, 0, 0.5]}
        rotation={[0, -2.25, 0]}
        onClick={s.chair ? select("chair") : undefined}
      />
      <GlbModel url={MODELS.plant.url} position={[-1.22, 0, -0.42]} />
      {/* soft monitor glow on the desk */}
      <pointLight
        position={[0.14, DESK_TOP + 0.22, -0.05]}
        intensity={0.25}
        distance={1.2}
        decay={2}
        color={accent}
      />
    </group>
  );
}

function Floor({ lite }: { lite?: boolean | undefined }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      {lite ? (
        <meshStandardMaterial color="#0b0d12" roughness={0.85} />
      ) : (
        <MeshReflectorMaterial
          resolution={1024}
          blur={[400, 120]}
          mixBlur={1.2}
          mixStrength={1.4}
          roughness={0.9}
          depthScale={0.6}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.3}
          color="#0c0e13"
          metalness={0.4}
          mirror={0.35}
        />
      )}
    </mesh>
  );
}

function Rig({ p }: { p: RealPcSceneProps }) {
  const group = useRef<THREE.Group>(null);
  const desk = (p.mode ?? "desk") === "desk";
  useFrame((_, dt) => {
    if (p.spin && group.current && (p.focusPart ?? "all") === "all")
      group.current.rotation.y += dt * 0.15;
  });
  return (
    <group ref={group}>
      {desk && <DeskSetup p={p} />}
      <Computer p={p} onDesk={desk} />
    </group>
  );
}

const TMP = new THREE.Vector3();
const INTERNAL: Category[] = ["cpu", "cooler", "ram", "motherboard", "storage", "psu", "gpu"];

function Camera({
  p,
  controls,
}: {
  p: RealPcSceneProps;
  controls: React.RefObject<OrbitControlsImpl | null>;
}) {
  const desk = (p.mode ?? "desk") === "desk";
  useFrame(() => {
    const c = controls.current;
    if (!c) return;
    const f = p.focusPart ?? "all";
    const pcY = desk ? DESK_TOP + 0.24 : 0.24;
    const pcX = desk ? PC_DESK_POS[0] : 0;
    if (!desk) TMP.set(0, 0.24, 0);
    else TMP.set(-0.1, 0.92, 0);
    if (f === "case" || INTERNAL.includes(f as Category))
      TMP.set(pcX, pcY + (f === "psu" ? -0.14 : 0.02), desk ? PC_DESK_POS[2] : 0);
    if (desk && f === "monitor") TMP.set(0.14, DESK_TOP + 0.3, -0.2);
    if (desk && (f === "keyboard" || f === "mouse")) TMP.set(0.22, DESK_TOP + 0.03, 0.13);
    if (desk && (f === "desk" || f === "chair")) TMP.set(0, 0.6, 0.3);
    c.target.lerp(TMP, 0.07);
    c.update();
  });
  return null;
}

export function RealPcScene(props: RealPcSceneProps) {
  const controls = useRef<OrbitControlsImpl>(null);
  const desk = (props.mode ?? "desk") === "desk";
  const lite = props.lite ?? false;

  useEffect(() => {
    preloadModels([
      MODELS.desk.url,
      MODELS.monitor.url,
      MODELS.keyboard.url,
      MODELS.mouse.url,
      MODELS.caseGlass.url,
      MODELS.motherboard.url,
    ]);
  }, []);

  return (
    <Canvas
      shadows
      dpr={lite ? [1, 1.25] : [1, 1.75]}
      camera={
        desk
          ? { position: [0.75, 1.3, 1.95], fov: 40, near: 0.02, far: 40 }
          : { position: [0.78, 0.56, 0.98], fov: 32, near: 0.01, far: 20 }
      }
      gl={{ antialias: false, powerPreference: "high-performance", stencil: false }}
    >
      <color attach="background" args={["#07090d"]} />
      <fog attach="fog" args={["#07090d", desk ? 4 : 2.2, desk ? 11 : 6]} />
      <Suspense fallback={null}>
        <Environment files={HDRI.studio} environmentIntensity={desk ? 0.55 : 0.45} />
      </Suspense>
      <hemisphereLight args={["#cfe0ff", "#0a0b0f", 0.25]} />
      <directionalLight
        position={desk ? [2.2, 4, 2.6] : [-1.2, 2.2, 1.4]}
        intensity={desk ? 1.1 : 0.9}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-2}
        shadow-camera-right={2}
        shadow-camera-top={2}
        shadow-camera-bottom={-2}
      />
      <spotLight
        position={desk ? [-1.6, 2.6, 1.8] : [1, 1.4, 1]}
        angle={0.5}
        penumbra={1}
        intensity={desk ? 2.2 : 0.9}
        color="#e9f0ff"
      />

      <Rig p={props} />

      <Floor lite={lite} />
      <ContactShadows
        position={[0, 0.002, 0]}
        opacity={0.55}
        scale={desk ? 5 : 2}
        blur={2.2}
        far={desk ? 2 : 0.8}
        resolution={lite ? 256 : 1024}
        frames={1}
      />

      <Camera p={props} controls={controls} />
      <OrbitControls
        ref={controls}
        makeDefault
        enablePan
        enableDamping
        dampingFactor={0.08}
        minDistance={desk ? 0.45 : 0.3}
        maxDistance={desk ? 6 : 2.5}
        maxPolarAngle={Math.PI / 2.05}
        target={desk ? [-0.1, 0.92, 0] : [0, 0.24, 0]}
      />

      {!lite && (
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom
            mipmapBlur
            intensity={0.9}
            luminanceThreshold={1}
            luminanceSmoothing={0.2}
            radius={0.7}
          />
          <Vignette offset={0.25} darkness={0.55} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          <SMAA />
        </EffectComposer>
      )}
    </Canvas>
  );
}

export default RealPcScene;
