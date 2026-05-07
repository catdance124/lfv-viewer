import type { Viewpoint } from '../types'

interface Props {
  rows: number
  cols: number
  viewpoint: Viewpoint
  viewMap: Record<string, string>
  onSelect: (vp: Viewpoint) => void
}

export function ViewpointGrid({ rows, cols, viewpoint, viewMap, onSelect }: Props) {
  return (
    <div className="vp-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {Array.from({ length: rows }).flatMap((_, i) =>
        Array.from({ length: cols }, (_, j) => {
          const exists = `${i}_${j}` in viewMap
          return (
            <button
              key={`${i}-${j}`}
              className={`vp-dot ${viewpoint.i === i && viewpoint.j === j ? 'active' : ''} ${!exists ? 'missing' : ''}`}
              title={exists ? `view (${i}, ${j})` : `view (${i}, ${j}) — not available`}
              onClick={() => exists && onSelect({ i, j })}
              disabled={!exists}
            />
          )
        })
      )}
    </div>
  )
}
