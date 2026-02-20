import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Terrain({ mainGroupRef }) {
  const meshRef = useRef();

  const geometry = useMemo(() => {
    const size = 80;
    const segments = 150;
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);
    return geo;
  }, []);

  useFrame(() => {
    if (meshRef.current && mainGroupRef?.current) {
      const targetScale = mainGroupRef.current.scale.x;
      meshRef.current.scale.set(targetScale, targetScale, targetScale);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, -0.7, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      geometry={geometry}
    >
      <meshStandardMaterial
        color="#ffffff"
        wireframe={true}
        wireframeLinewidth={1.5}
        opacity={0.7}
        transparent
        emissive="#ffffff"
        emissiveIntensity={0.05}
      />
    </mesh>
  );
}
