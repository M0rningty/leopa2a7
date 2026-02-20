export default function HudOverlay() {
  return (
    <>
      <div className="grain-overlay"></div>
      <div className="grid-overlay grid-overlay-large"></div>
      <div className="grid-overlay grid-overlay-small"></div>
      <div className="ambient-glow ambient-glow-left"></div>
      <div className="ambient-glow ambient-glow-right"></div>
      <div className="scan-line"></div>

      <div className="corner-frame top-left"></div>
      <div className="corner-frame top-right"></div>
      <div className="corner-frame bottom-left"></div>
      <div className="corner-frame bottom-right"></div>

      <div className="brand-text">INTERACTIVE VIEWER</div>
      <div className="version-text">v2.0.1</div>

      <div className="status-indicator">
        <div className="status-dot"></div>
        <span className="status-label">LIVE</span>
      </div>
    </>
  );
}
