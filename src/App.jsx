import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Html, useProgress } from "@react-three/drei";
import Model from "./Model";
import { parts } from "./parts/parts.config";

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center style={{ color: "white", fontFamily: "sans-serif" }}>
      Loading… {progress.toFixed(0)}%
    </Html>
  );
}

export default function App() {
  const [currentScale, setCurrentScale] = useState(1);
  const [cameraPos, setCameraPos] = useState({ r: 0, theta: 0, phi: 0 });
  const [xray, setXray] = useState(false);
  const [idle, setIdle] = useState(true);
  const [selectedPart, setSelectedPart] = useState(null);

  const handleBackgroundClick = () => {
    if (selectedPart) {
      setSelectedPart(null);
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000000" }}>
      <Canvas
        dpr={[1, 1.5]}
        frameloop="always"
        camera={{ position: [0, 0.2, 4], fov: 50 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onPointerMissed={handleBackgroundClick}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 2]} intensity={1.2} />

        <Environment preset="city" />

        <Suspense fallback={<Loader />}>
          <Model
            color="#ffffff"
            xray={xray}
            position={[0, -0.7, 0]}
            scale={0.4}
            onScaleChange={setCurrentScale}
            onCameraChange={setCameraPos}
            selectedPart={selectedPart}
            setSelectedPart={setSelectedPart}
          />
        </Suspense>

        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          maxDistance={8}
          autoRotate={idle}
          autoRotateSpeed={0.5}
        />
      </Canvas>

      <div style={{ position: "fixed", left: 16, top: 16, color: "white", fontFamily: "monospace", fontSize: 18, fontWeight: 700, background: "rgba(0,0,0,0.7)", padding: "12px 20px", borderRadius: 8, lineHeight: 1.6 }}>
        <div>Scale: {currentScale.toFixed(3)}</div>
        <div>Cam: r={cameraPos.r.toFixed(2)}, θ={cameraPos.theta.toFixed(1)}°, φ={cameraPos.phi.toFixed(1)}°</div>
      </div>

      {selectedPart && (
        <div
          className="hologram-box"
          style={{
            position: "fixed",
            left: 16,
            top: 100,
            color: "#00ffff",
            fontFamily: "monospace",
            fontSize: 16,
            fontWeight: 600,
            background: "rgba(0, 20, 40, 0.85)",
            padding: "16px 24px",
            borderRadius: 8,
            lineHeight: 1.8,
            border: "2px solid rgba(0, 200, 255, 0.6)",
            backdropFilter: "blur(5px)"
          }}
        >
          <div
            className="hologram-text"
            style={{
              fontSize: 18,
              fontWeight: 700,
              marginBottom: 12,
              textTransform: "uppercase",
              letterSpacing: "2px",
              color: "#00ffff"
            }}
          >
            &gt; Selected Object
          </div>
          <div className="hologram-data" style={{ color: "#88ddff" }}>Name: <span style={{ color: "#00ff88" }}>{selectedPart}</span></div>
          <div className="hologram-data" style={{ color: "#88ddff" }}>Threshold Angle: <span style={{ color: "#00ff88" }}>{parts[selectedPart].thresholdAngle}°</span></div>
          <div className="hologram-data" style={{ color: "#88ddff" }}>Opacity: <span style={{ color: "#00ff88" }}>{parts[selectedPart].opacity}</span></div>
        </div>
      )}

      <div style={{ position: "fixed", right: 16, top: 16, display: "flex", gap: 12 }}>
        <button
          onClick={() => setIdle(!idle)}
          style={{
            color: idle ? "#00ff66" : "rgba(255,255,255,0.6)",
            background: "transparent",
            border: "none",
            padding: 8,
            cursor: "pointer",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = idle ? "#00ff88" : "white"}
          onMouseLeave={(e) => e.currentTarget.style.color = idle ? "#00ff66" : "rgba(255,255,255,0.6)"}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
          </svg>
        </button>

        <button
          onClick={() => setXray(!xray)}
          style={{
            color: xray ? "#00bbff" : "rgba(255,255,255,0.6)",
            background: "transparent",
            border: "none",
            padding: 8,
            cursor: "pointer",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = xray ? "#00ddff" : "white"}
          onMouseLeave={(e) => e.currentTarget.style.color = xray ? "#00bbff" : "rgba(255,255,255,0.6)"}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      </div>

      <div style={{ position: "fixed", left: 16, bottom: 16, color: "white", fontFamily: "sans-serif", opacity: 0.85, lineHeight: 1.4 }}>
        <div style={{ fontWeight: 700 }}>Three.js + React</div>
        <div>마우스 드래그: 회전 / 휠: 줌</div>
      </div>
    </div>
  );
}
