import { useMusicBars, BAR_COUNT } from '../hooks/useMusicBars';

export default function LoadingScreen({ isClosing, loadingProgress }) {
  const { barsRef, glowRef } = useMusicBars(true);

  return (
    <div className="loading-overlay">
      <div className={`loading-half loading-left ${isClosing ? 'split-out' : ''}`}>
        <div className="loading-half-inner">
          <div className="loading-grid"></div>
          <div className="loading-half-grain"></div>
        </div>
      </div>

      <div className={`loading-half loading-right ${isClosing ? 'split-out' : ''}`}>
        <div className="loading-half-inner">
          <div className="loading-grid"></div>
          <div className="loading-half-grain"></div>
        </div>
      </div>

      <div className={`loading-seam ${isClosing ? 'split-out' : ''}`}>
        <div className="loading-seam-glow"></div>
      </div>

      <div className={`loading-center-content ${isClosing ? 'split-out' : ''}`}>
        <div className="loading-rings">
          <div className="loading-ring ring-1"></div>
          <div className="loading-ring ring-2"></div>
          <div className="loading-ring ring-3"></div>
          <div className="loading-ring-dot"></div>
        </div>

        <div className="loading-text-container">
          <div className="loading-title">
            {'INITIALIZING'.split('').map((ch, i) => (
              <span key={i} className="loading-char" style={{ animationDelay: `${i * 0.05}s` }}>{ch}</span>
            ))}
          </div>
          <div className="loading-subtitle">SYSTEM LOADING</div>
        </div>

        <div className="loading-progress-container">
          <div className="loading-progress-track">
            <div className="loading-progress-bar">
              <div
                className="loading-progress-fill"
                style={{ width: `${Math.min(loadingProgress, 100)}%` }}
              ></div>
            </div>
            <div className="loading-progress-glow" style={{ left: `${Math.min(loadingProgress, 100)}%` }}></div>
          </div>
          <div className="loading-progress-info">
            <span className="loading-progress-label">PROGRESS</span>
            <span className="loading-percentage">{Math.floor(loadingProgress)}%</span>
          </div>
        </div>

        <div className="loading-bars" ref={glowRef}>
          {Array.from({ length: BAR_COUNT }).map((_, i) => (
            <div
              key={i}
              ref={(el) => (barsRef.current[i] = el)}
              className="loading-bar-item"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
