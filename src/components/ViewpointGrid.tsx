import type { Viewpoint } from '../types'

interface Props {
  rows: number
  cols: number
  viewpoint: Viewpoint
  onSelect: (vp: Viewpoint) => void
}

export function ViewpointGrid({ rows, cols, viewpoint, onSelect }: Props) {
  return (
    <div className="vp-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {Array.from({ length: rows }).flatMap((_, i) =>
        Array.from({ length: cols }, (_, j) => (
          <button
            key={`${i}-${j}`}
            className={`vp-dot ${viewpoint.i === i && viewpoint.j === j ? 'active' : ''}`}
            title={`view (${i}, ${j})`}
            onClick={() => onSelect({ i, j })}
          />
        ))
      )}
    </div>
  )
}
