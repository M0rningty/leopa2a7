export default function MetricsPanel({ currentScale, cameraPos }) {
  return (
    <div className="metrics-panel">
      <div className="metric-item">
        <span className="metric-label">SCALE</span>
        <span className="metric-value">{currentScale.toFixed(3)}</span>
      </div>
      <div className="metric-divider"></div>
      <div className="metric-item">
        <span className="metric-label">RADIUS</span>
        <span className="metric-value">{cameraPos.r.toFixed(2)}</span>
      </div>
      <div className="metric-item">
        <span className="metric-label">THETA</span>
        <span className="metric-value">{cameraPos.theta.toFixed(1)}&deg;</span>
      </div>
      <div className="metric-item">
        <span className="metric-label">PHI</span>
        <span className="metric-value">{cameraPos.phi.toFixed(1)}&deg;</span>
      </div>
    </div>
  );
}
