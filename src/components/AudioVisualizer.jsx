import { useMusicBars, BAR_COUNT } from '../hooks/useMusicBars';

export default function AudioVisualizer({ playing, onToggle }) {
  const { barsRef, glowRef } = useMusicBars(playing);

  return (
    <div className="audio-visualizer">
      <button onClick={onToggle} className="visualizer-button">
        <div className="visualizer-bars-container">
          <div ref={glowRef} className="visualizer-glow"></div>
          {Array.from({ length: BAR_COUNT }).map((_, i) => (
            <div
              key={i}
              ref={(el) => (barsRef.current[i] = el)}
              className="visualizer-bar"
            />
          ))}
        </div>
      </button>
    </div>
  );
}
