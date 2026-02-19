import { useRef, useMemo, useState, useEffect } from "react";
import { parts } from "./parts/parts.config";
import PartWire from "./parts/PartWire";
import Scene from "./Scene";

const chaGroup = ["baqui", "chache", "junjang"];
const poGroup = ["joopo", "noon", "pojang", "potaap", "chong"];

export default function Model({
  color = "#ffffff",
  xray = false,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onScaleChange,
  onCameraChange,
  selectedPart,
  setSelectedPart,
}) {
  const mainGroupRef = useRef();
  const chaGroupRef = useRef();
  const poGroupRef = useRef();
  const partRefs = useRef({});
  const partOpacityRefs = useRef({});
  const lastClickTime = useRef(0);
  const currentSelectedPart = useRef(null);
  const mouseDownTime = useRef(0);

  const [partOpacities, setPartOpacities] = useState({});

  const partKeys = useMemo(() => Object.keys(parts), []);

  useEffect(() => {
    partKeys.forEach((key) => {
      if (!partOpacityRefs.current[key]) {
        partOpacityRefs.current[key] = parts[key].opacity;
      }
    });
  }, [partKeys]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && selectedPart) {
        setSelectedPart(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPart]);

  const handlePartPointerDown = () => {
    mouseDownTime.current = Date.now();
  };

  const handlePartClick = (key) => {
    const now = Date.now();
    const clickDuration = now - mouseDownTime.current;

    if (clickDuration > 200) {
      return;
    }

    if (currentSelectedPart.current === key && now - lastClickTime.current < 500) {
      return;
    }
    lastClickTime.current = now;
    currentSelectedPart.current = key;
    setSelectedPart(key);
  };

  useEffect(() => {
    currentSelectedPart.current = selectedPart;
  }, [selectedPart]);

  return (
    <Scene
      selectedPart={selectedPart}
      partOpacityRefs={partOpacityRefs}
      setPartOpacities={setPartOpacities}
      mainGroupRef={mainGroupRef}
      poGroupRef={poGroupRef}
      onScaleChange={onScaleChange}
      onCameraChange={onCameraChange}
    >
      <group
        position={position}
        rotation={rotation}
        scale={scale}
      >
        <group ref={mainGroupRef}>
          <group ref={chaGroupRef}>
            {chaGroup.map((key) => {
              const part = parts[key];
              const opacity = partOpacities[key] ?? part.opacity;
              const useXray = xray;
              const isSelected = selectedPart === key;
              const useGlow = xray && isSelected;
              return (
                <group
                  key={key}
                  ref={(el) => (partRefs.current[key] = el)}
                >
                  <PartWire
                    url={part.url}
                    thresholdAngle={part.thresholdAngle}
                    opacity={opacity}
                    color={color}
                    xray={useXray}
                    glow={useGlow}
                    glowColor="#00ffff"
                    glowOpacity={1.0}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      handlePartPointerDown();
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePartClick(key);
                    }}
                  />
                </group>
              );
            })}
          </group>

          <group ref={poGroupRef}>
            {poGroup.map((key) => {
              const part = parts[key];
              const opacity = partOpacities[key] ?? part.opacity;
              const useXray = xray;
              const isSelected = selectedPart === key;
              const useGlow = xray && isSelected;
              return (
                <group
                  key={key}
                  ref={(el) => (partRefs.current[key] = el)}
                >
                  <PartWire
                    url={part.url}
                    thresholdAngle={part.thresholdAngle}
                    opacity={opacity}
                    color={color}
                    xray={useXray}
                    glow={useGlow}
                    glowColor="#00ffff"
                    glowOpacity={1.0}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      handlePartPointerDown();
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePartClick(key);
                    }}
                  />
                </group>
              );
            })}
          </group>
        </group>
      </group>
    </Scene>
  );
}