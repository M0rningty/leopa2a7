import { parts } from '../parts/parts.config';

export default function CyberPanel({ selectedPart, isClosing }) {
  if (!selectedPart) return null;

  const part = parts[selectedPart];

  return (
    <div className={`cyber-panel hologram-box ${isClosing ? 'closing' : ''}`}>
      <div className="cyber-header hologram-text">
        <span className="cyber-bracket">[</span>
        <span className="cyber-title">OBJECT_DATA</span>
        <span className="cyber-bracket">]</span>
        <div className="cyber-line"></div>
      </div>

      <div className="cyber-content">
        <div className="cyber-row hologram-data">
          <span className="cyber-label">&gt; COMPONENT_ID</span>
          <span className="cyber-value">{selectedPart}</span>
        </div>
        <div className="cyber-divider"></div>
        <div className="cyber-row hologram-data">
          <span className="cyber-label">&gt; THRESHOLD_ANGLE</span>
          <span className="cyber-value cyber-highlight">{part.thresholdAngle}&deg;</span>
        </div>
        <div className="cyber-row hologram-data">
          <span className="cyber-label">&gt; OPACITY_LEVEL</span>
          <span className="cyber-value cyber-highlight">{part.opacity}</span>
        </div>
        <div className="cyber-status-bar">
          <div className="cyber-status-fill"></div>
        </div>
      </div>
    </div>
  );
}
