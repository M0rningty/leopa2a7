import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { parts } from "./parts/parts.config";

const lerp = (start, end, t) => start + (end - start) * t;

export default function Scene({
  selectedPart,
  partOpacityRefs,
  setPartOpacities,
  mainGroupRef,
  poGroupRef,
  onScaleChange,
  onCameraChange,
  children,
}) {
  const currentScale = useRef(1);
  const currentPosZ = useRef(0);
  const currentRotY = useRef(0);
  const idleRotationTime = useRef(0);
  const poRotateTimeRef = useRef(0);
  const poRotationCount = useRef(0);
  const poPauseTimer = useRef(0);
  const isPaused = useRef(false);
  const baseDistance = useRef(null);
  const currentCameraDistance = useRef(null);
  const wasSelected = useRef(false);

  const partKeys = Object.keys(parts);

  useFrame((state, delta) => {
    if (!mainGroupRef.current) return;

    const targetScale = selectedPart ? 1.5 : 1;
    const targetPosZ = selectedPart ? 1.5 : 0;

    const smoothDelta = Math.min(delta, 0.1);
    currentScale.current = lerp(currentScale.current, targetScale, smoothDelta * 1.5);
    currentPosZ.current = lerp(currentPosZ.current, targetPosZ, smoothDelta * 1.5);

    const clampedScale = Math.max(1, Math.min(1.5, currentScale.current));
    currentScale.current = clampedScale;

    mainGroupRef.current.scale.set(clampedScale, clampedScale, clampedScale);
    mainGroupRef.current.position.z = currentPosZ.current;

    if (onScaleChange) {
      onScaleChange(clampedScale);
    }

    const cam = state.camera;
    const x = cam.position.x;
    const y = cam.position.y;
    const z = cam.position.z;

    const r = Math.sqrt(x * x + y * y + z * z);

    if (!selectedPart) {
      baseDistance.current = r;
      currentCameraDistance.current = r;
      wasSelected.current = false;
    } else {
      if (!wasSelected.current) {
        currentCameraDistance.current = r;
        wasSelected.current = true;
      }

      const targetDistance = 6;
      currentCameraDistance.current = lerp(currentCameraDistance.current, targetDistance, smoothDelta * 1.5);

      if (r > 0.001) {
        const scale = currentCameraDistance.current / r;
        cam.position.set(x * scale, y * scale, z * scale);
      }
    }

    if (onCameraChange) {
      const theta = Math.atan2(x, z) * (180 / Math.PI);
      const phi = Math.atan2(y, Math.sqrt(x * x + z * z)) * (180 / Math.PI);

      onCameraChange({
        r: selectedPart ? currentCameraDistance.current : r,
        theta: theta,
        phi: phi,
      });
    }

    if (!selectedPart) {
      currentRotY.current = lerp(currentRotY.current, 0, delta * 4);
      mainGroupRef.current.rotation.y = currentRotY.current;
    }

    partKeys.forEach((key) => {
      const isSelected = selectedPart === key;
      const targetOpacity = selectedPart
        ? isSelected
          ? 1.0
          : 0.1
        : parts[key].opacity;

      if (!partOpacityRefs.current[key]) {
        partOpacityRefs.current[key] = parts[key].opacity;
      }

      partOpacityRefs.current[key] = lerp(
        partOpacityRefs.current[key],
        targetOpacity,
        smoothDelta * 1.5
      );
    });

    setPartOpacities({ ...partOpacityRefs.current });

    if (poGroupRef.current) {
      if (!selectedPart) {
        if (isPaused.current) {
          poPauseTimer.current += delta;
          if (poPauseTimer.current >= 3) {
            isPaused.current = false;
            poPauseTimer.current = 0;
            poRotationCount.current = 0;
          }
        } else {
          const prevRotation = poGroupRef.current.rotation.y;
          poRotateTimeRef.current += delta;
          const newRotation = Math.sin(poRotateTimeRef.current * 0.13) * 0.3;
          poGroupRef.current.rotation.y = newRotation;

          if (Math.abs(newRotation) < 0.01 && Math.abs(prevRotation) > 0.01) {
            poRotationCount.current++;
            if (poRotationCount.current >= Math.floor(Math.random() * 3) + 3) {
              isPaused.current = true;
              poPauseTimer.current = 0;
            }
          }
        }
      } else {
        poRotateTimeRef.current += delta;
        const newRotation = Math.sin(poRotateTimeRef.current * 0.13) * 0.3;
        poGroupRef.current.rotation.y = newRotation;
      }
    }
  });

  return <>{children}</>;
}
