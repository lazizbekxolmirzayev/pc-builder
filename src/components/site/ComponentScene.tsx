import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Bloom, EffectComposer, SMAA, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

import type { Category, Part } from "@/data/parts";
import { HDRI, modelFor } from "@/data/models3d";
import { GlbModel } from "@/components/site/three/GlbModel";

type ComponentSceneProps = {
  part: Part;
  accent?: string;
  spin?: boolean;
};

type Step = ["x" | "y" | "z", number];
const H = Math.PI / 2;

// Models are stored in "installed" orientation (see models3d.ts). These steps turn each one
// into a product-shot pose facing the camera. Steps are applied in order.
const DISPLAY: Record<Category, Step[]> = {
  motherboard: [
    ["y", H],
    ["y", -0.35],
    ["x", 0.18],
  ],
  cpu: [
    ["z", -H],
    ["y", 0.5],
    ["x", 0.55],
  ],
  gpu: [
    ["x", -H],
    ["z", H],
    ["z", Math.PI],
    ["y", 0.45],
    ["x", 0.2],
  ],
  ram: [
    ["z", -H],
    ["y", -0.45],
    ["x", 0.2],
  ],
  storage: [
    ["y", H],
    ["z", -H],
    ["y", 0.4],
    ["x", 0.6],
  ],
  psu: [
    ["y", H + 0.6],
    ["x", 0.3],
  ],
  cooler: [
    ["z", -H],
    ["y", -0.55],
    ["x", 0.15],
  ],
  case: [
    ["y", 0.75],
    ["x", 0.08],
  ],
  monitor: [
    ["y", -0.4],
    ["x", 0.05],
  ],
  keyboard: [
    ["y", -0.35],
    ["x", 0.55],
  ],
  mouse: [
    ["y", -0.6],
    ["x", 0.45],
  ],
  desk: [
    ["y", -0.5],
    ["x", 0.2],
  ],
  chair: [["y", 0.6]],
};

const FIT = 2.6;

function Nested({ steps, children }: { steps: Step[]; children: React.ReactNode }) {
  // innermost group = first step
  return steps.reduce<React.ReactNode>(
    (inner, [axis, a]) => (
      <group rotation={[axis === "x" ? a : 0, axis === "y" ? a : 0, axis === "z" ? a : 0]}>
        {inner}
      </group>
    ),
    children,
  );
}

function Product({
  url,
  category,
  accent,
  spin,
}: {
  url: string;
  category: Category;
  accent: string;
  spin: boolean;
}) {
  const { scene } = useGLTF(url);
  const spinner = useRef<THREE.Group>(null);
  const { scale, center } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    return {
      scale: FIT / (Math.max(size.x, size.y, size.z) || 1),
      center: box.getCenter(new THREE.Vector3()),
    };
  }, [scene]);
  useFrame((_, dt) => {
    if (spin && spinner.current) spinner.current.rotation.y += dt * 0.3;
  });
  return (
    <group ref={spinner}>
      <group scale={scale}>
        <Nested steps={DISPLAY[category]}>
          <GlbModel url={url} position={[-center.x, -center.y, -center.z]} accent={accent} />
        </Nested>
      </group>
    </group>
  );
}

export function ComponentScene({ part, accent = "#22d3ee", spin = true }: ComponentSceneProps) {
  return (
    <ModelStage url={modelFor(part).url} category={part.category} accent={accent} spin={spin} />
  );
}

/** Studio product shot of any normalized model. */
export function ModelStage({
  url,
  category,
  accent = "#22d3ee",
  spin = true,
}: {
  url: string;
  category: Category;
  accent?: string;
  spin?: boolean;
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.9, 4.6], fov: 36 }}
      gl={{ antialias: false }}
    >
      <color attach="background" args={["#080a0f"]} />
      <Suspense fallback={null}>
        <Environment files={HDRI.studio} environmentIntensity={0.9} />
        <Product key={url} url={url} category={category} accent={accent} spin={spin} />
      </Suspense>
      <directionalLight
        position={[4, 6, 4]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <spotLight position={[-4, 3, -2]} angle={0.6} penumbra={1} intensity={30} color={accent} />
      <ContactShadows
        position={[0, -1.55, 0]}
        opacity={0.65}
        scale={8}
        blur={2.4}
        far={4}
        resolution={512}
      />
      <OrbitControls
        enablePan={false}
        minDistance={2}
        maxDistance={9}
        enableDamping
        dampingFactor={0.08}
      />
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur intensity={0.7} luminanceThreshold={1} radius={0.6} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <SMAA />
      </EffectComposer>
    </Canvas>
  );
}

export default ComponentScene;
