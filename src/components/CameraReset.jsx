import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const DEFAULT_POS = new THREE.Vector3(0, 0.2, 4);
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);

export default function CameraReset({ controlsRef, resetTrigger }) {
  const { camera } = useThree();
  const animatingRef = useRef(false);
  const startPos = useRef(new THREE.Vector3());
  const startTarget = useRef(new THREE.Vector3());
  const progressRef = useRef(0);

  useEffect(() => {
    if (resetTrigger > 0 && controlsRef.current) {
      animatingRef.current = true;
      startPos.current.copy(camera.position);
      startTarget.current.copy(controlsRef.current.target);
      progressRef.current = 0;
    }
  }, [resetTrigger, camera, controlsRef]);

  useFrame(() => {
    if (!animatingRef.current) return;

    progressRef.current += 0.03;

    if (progressRef.current >= 1) {
      camera.position.copy(DEFAULT_POS);
      if (controlsRef.current) {
        controlsRef.current.target.copy(DEFAULT_TARGET);
      }
      animatingRef.current = false;
      progressRef.current = 1;
    } else {
      const t = progressRef.current;
      const eased = t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;

      camera.position.lerpVectors(startPos.current, DEFAULT_POS, eased);

      if (controlsRef.current) {
        controlsRef.current.target.lerpVectors(startTarget.current, DEFAULT_TARGET, eased);
      }
    }

    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });

  return null;
}
