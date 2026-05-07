interface Props {
  frame: number
  frameCount: number
  playing: boolean
  fps: number
  onToggle: () => void
  onFrameChange: (f: number) => void
  onFpsChange: (fps: number) => void
}

export function FrameControls({
  frame,
  frameCount,
  playing,
  fps,
  onToggle,
  onFrameChange,
  onFpsChange,
}: Props) {
  if (frameCount === 0) return null

  return (
    <div className="frame-controls">
      <button className="btn-play" onClick={onToggle} title={playing ? 'Pause' : 'Play'}>
        {playing ? '⏸' : '▶'}
      </button>
      <input
        type="range"
        className="frame-slider"
        min={0}
        max={frameCount - 1}
        value={frame}
        onChange={(e) => onFrameChange(Number(e.target.value))}
      />
      <span className="frame-counter">
        {frame + 1} / {frameCount}
      </span>
      <label className="fps-label">
        <input
          type="number"
          className="fps-input"
          min={1}
          max={120}
          value={fps}
          onChange={(e) => {
            const v = Math.max(1, Math.min(120, Math.round(Number(e.target.value))))
            if (!isNaN(v)) onFpsChange(v)
          }}
        />
        fps
      </label>
    </div>
  )
}
