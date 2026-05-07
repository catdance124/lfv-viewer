import type { TourPattern } from '../hooks/useViewpointTour'

const PATTERNS: { value: TourPattern; label: string }[] = [
  { value: 'horizontal', label: 'Horizontal scan' },
  { value: 'vertical',   label: 'Vertical scan' },
  { value: 'snake',      label: 'Snake (all)' },
  { value: 'spiral',     label: 'Spiral (all)' },
]

interface Props {
  touring: boolean
  pattern: TourPattern
  speed: number
  onToggle: () => void
  onPatternChange: (p: TourPattern) => void
  onSpeedChange: (s: number) => void
}

export function ViewpointTourControls({
  touring,
  pattern,
  speed,
  onToggle,
  onPatternChange,
  onSpeedChange,
}: Props) {
  return (
    <div className="tour-controls">
      <span className="tour-label">Viewpoint tour</span>
      <select
        className="scene-select tour-pattern-select"
        value={pattern}
        onChange={(e) => onPatternChange(e.target.value as TourPattern)}
      >
        {PATTERNS.map((p) => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </select>
      <button className="btn-play" onClick={onToggle} title={touring ? 'Stop tour' : 'Start tour'}>
        {touring ? '⏹' : '▶'}
      </button>
      <label className="fps-label">
        <input
          type="number"
          className="fps-input"
          min={1}
          max={30}
          value={speed}
          onChange={(e) => {
            const v = Math.max(1, Math.min(30, Math.round(Number(e.target.value))))
            if (!isNaN(v)) onSpeedChange(v)
          }}
        />
        vp/s
      </label>
    </div>
  )
}
