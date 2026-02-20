import { Suspense, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import Model from "./Model";
import Terrain from "./Terrain";
import useLoadingProgress from "./hooks/useLoadingProgress";
import LoadingScreen from "./components/LoadingScreen";
import HudOverlay from "./components/HudOverlay";
import MetricsPanel from "./components/MetricsPanel";
import CyberPanel from "./components/CyberPanel";
import AudioVisualizer from "./components/AudioVisualizer";
import ControlsPanel from "./components/ControlsPanel";
import CameraReset from "./components/CameraReset";

export default function App() {
  const [currentScale, setCurrentScale] = useState(1);
  const [cameraPos, setCameraPos] = useState({ r: 0, theta: 0, phi: 0 });
  const [xray, setXray] = useState(false);
  const [idle, setIdle] = useState(true);
  const [selectedPart, setSelectedPart] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const controlsRef = useRef();
  const mainGroupRef = useRef();

  const { isLoading, isClosingLoading, loadingProgress } = useLoadingProgress(modelsLoaded);

  const handleBackgroundClick = () => {
    if (selectedPart) {
      setIsClosing(true);
      setTimeout(() => {
        setSelectedPart(null);
        setIsClosing(false);
      }, 500);
    }
  };

  const handleResetCamera = () => {
    if (selectedPart) {
      setIsClosing(true);
      setTimeout(() => {
        setSelectedPart(null);
        setIsClosing(false);
      }, 500);
    }
    setResetTrigger(prev => prev + 1);
  };

  return (
    <div className="app-container">
      <HudOverlay />

      {isLoading && (
        <LoadingScreen
          isClosing={isClosingLoading}
          loadingProgress={loadingProgress}
        />
      )}

      <Canvas
        dpr={[1.5, 2]}
        frameloop="always"
        camera={{ position: [0, 0.2, 4], fov: 50 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: false,
          stencil: false,
          depth: true
        }}
        onPointerMissed={handleBackgroundClick}
        style={{ background: "transparent" }}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 15, 35]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={2.0} color="#ffffff" castShadow />
        <directionalLight position={[-5, 3, -3]} intensity={1.2} color="#ffffff" />
        <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.8} color="#ffffff" />
        <pointLight position={[0, 2, 2]} intensity={0.5} color="#ffffff" />
        <pointLight position={[3, 1, -3]} intensity={0.4} color="#ffffff" />
        <pointLight position={[-3, 1, 3]} intensity={0.4} color="#ffffff" />

        <Environment preset="night" />
        <Terrain mainGroupRef={mainGroupRef} />

        <Suspense fallback={null}>
          <Model
            color="#ffffff"
            xray={xray}
            position={[0, -0.7, 0]}
            scale={0.4}
            onScaleChange={setCurrentScale}
            onCameraChange={setCameraPos}
            selectedPart={selectedPart}
            setSelectedPart={setSelectedPart}
            mainGroupRef={mainGroupRef}
            onLoad={() => setModelsLoaded(true)}
          />
        </Suspense>

        <CameraReset controlsRef={controlsRef} resetTrigger={resetTrigger} />

        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.08}
          maxDistance={8}
          autoRotate={idle}
          autoRotateSpeed={0.5}
          enableZoom={!selectedPart}
        />
      </Canvas>

      <MetricsPanel currentScale={currentScale} cameraPos={cameraPos} />
      <CyberPanel selectedPart={selectedPart} isClosing={isClosing} />
      <AudioVisualizer playing={musicPlaying} onToggle={() => setMusicPlaying(!musicPlaying)} />
      <ControlsPanel
        onResetCamera={handleResetCamera}
        idle={idle}
        onToggleIdle={() => setIdle(!idle)}
        xray={xray}
        onToggleXray={() => setXray(!xray)}
      />
    </div>
  );
}
