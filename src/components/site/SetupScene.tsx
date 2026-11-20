import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import { Component, Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

class ModelErrorBoundary extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override render() {
    return this.state.failed ? null : this.props.children;
  }
}

function GlbPreview({ url, spin }: { url: string; spin: boolean }) {
  const { scene } = useGLTF(url);
  const spinner = useRef<THREE.Group>(null);

  const { clone, scale, center } = useMemo(() => {
    const cloned = scene.clone(true);
    const box = new THREE.Box3().setFromObject(cloned);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    return { clone: cloned, scale: 3.1 / maxDim, center: box.getCenter(new THREE.Vector3()) };
  }, [scene]);

  useEffect(() => {
    clone.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
      }
    });
  }, [clone]);

  useFrame((_, dt) => {
    if (spin && spinner.current) spinner.current.rotation.y += dt * 0.25;
  });

  return (
    <group ref={spinner}>
      <group scale={scale}>
        <primitive object={clone} position={[-center.x, -center.y, -center.z]} />
      </group>
    </group>
  );
}

export function SetupScene({ url, spin = true }: { url: string; spin?: boolean }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 1.4, 5.4], fov: 42 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={["#080a0f"]} />
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#dfe6f0", "#0a0c10", 0.6]} />
      <directionalLight position={[6, 8, 5]} intensity={2.2} castShadow />
      <directionalLight position={[-6, 4, -4]} intensity={0.7} color="#e8eef8" />
      <pointLight position={[-4, 3, -2]} intensity={6} color="#22d3ee" distance={16} />
      <Suspense fallback={null}>
        <ModelErrorBoundary>
          <GlbPreview url={url} spin={spin} />
        </ModelErrorBoundary>
      </Suspense>
      <ContactShadows
        position={[0, -1.85, 0]}
        opacity={0.6}
        scale={10}
        blur={2.4}
        far={5}
        resolution={512}
      />
      <Environment>
        <Lightformer intensity={2.4} position={[0, 6, 3]} scale={[10, 8, 1]} />
        <Lightformer
          intensity={0.7}
          color="#22d3ee"
          position={[-6, 3, -3]}
          rotation-y={Math.PI / 2}
          scale={[12, 4, 1]}
        />
        <Lightformer
          intensity={0.9}
          color="#f0f4fa"
          position={[6, 3, 3]}
          rotation-y={-Math.PI / 2}
          scale={[12, 4, 1]}
        />
      </Environment>
      <OrbitControls
        enablePan={false}
        minDistance={2.2}
        maxDistance={11}
        enableDamping
        dampingFactor={0.08}
      />
    </Canvas>
  );
}
