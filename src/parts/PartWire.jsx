import { useEffect, useMemo, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";

export default function PartWire({
  url,
  thresholdAngle = 60,
  xray = false,

  color = "#ffffff",
  opacity = 0.65,

  glow = false,
  glowColor = "#ffffff",
  glowOpacity = 1.0,

  renderOrder = 1,
  onClick,
  onPointerDown,
}) {
  const gltf = useLoader(GLTFLoader, url);

  const lineMatRef = useRef(null);
  const depthMatRef = useRef(null);

  if (!lineMatRef.current) {
    lineMatRef.current = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity,
      depthTest: !xray,
      depthWrite: false,
      linewidth: 2,
    });
  }

  if (!depthMatRef.current) {
    depthMatRef.current = new THREE.MeshBasicMaterial({
      colorWrite: false,
      depthWrite: true,
      depthTest: true,
      side: THREE.FrontSide,
    });
  }

  const { clickableGroup, visualGroup } = useMemo(() => {
    const clickableGroup = new THREE.Group();
    const visualGroup = new THREE.Group();
    gltf.scene.updateWorldMatrix(true, true);

    const clickMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });

    gltf.scene.traverse((obj) => {
      if (!obj.isMesh || !obj.geometry) return;

      const clickMesh = new THREE.Mesh(obj.geometry, clickMaterial);
      clickMesh.matrixAutoUpdate = false;
      clickMesh.applyMatrix4(obj.matrixWorld);
      clickMesh.scale.set(0.5, 0.5, 0.5);
      clickMesh.renderOrder = 0;
      clickableGroup.add(clickMesh);

      if (!xray) {
        const depthMesh = new THREE.Mesh(obj.geometry, depthMatRef.current);
        depthMesh.matrixAutoUpdate = false;
        depthMesh.applyMatrix4(obj.matrixWorld);
        depthMesh.renderOrder = 0;
        visualGroup.add(depthMesh);
      }

      const edges = new THREE.EdgesGeometry(obj.geometry, thresholdAngle);
      const lines = new THREE.LineSegments(edges, lineMatRef.current);
      lines.matrixAutoUpdate = false;
      lines.applyMatrix4(obj.matrixWorld);
      lines.renderOrder = renderOrder;

      visualGroup.add(lines);
    });

    return { clickableGroup, visualGroup };
  }, [gltf, thresholdAngle, xray, renderOrder]);

  useEffect(() => {
    const mat = lineMatRef.current;
    mat.depthTest = !xray;

    if (glow) {
      mat.color.set(glowColor);
      mat.opacity = glowOpacity;
    } else {
      mat.color.set(color);
      mat.opacity = opacity;
    }
    mat.needsUpdate = true;
  }, [glow, glowColor, glowOpacity, color, opacity, xray]);

  return (
    <group>
      <group
        onPointerDown={(e) => {
          e.stopPropagation();
          onPointerDown?.(e);
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(e);
        }}
      >
        <primitive object={clickableGroup} />
      </group>
      <primitive object={visualGroup} />
    </group>
  );
}
