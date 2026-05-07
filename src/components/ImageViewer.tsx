import { ViewpointGrid } from './ViewpointGrid'
import type { Viewpoint } from '../types'

interface Props {
  imageSrc: string | null
  loading: boolean
  error: string | null
  rows: number
  cols: number
  viewpoint: Viewpoint
  onSelectViewpoint: (vp: Viewpoint) => void
}

export function ImageViewer({
  imageSrc,
  loading,
  error,
  rows,
  cols,
  viewpoint,
  onSelectViewpoint,
}: Props) {
  return (
    <div className="image-viewer">
      {loading && <div className="overlay-msg">Loading…</div>}
      {error && !loading && <div className="overlay-msg error">{error}</div>}
      {!imageSrc && !loading && !error && (
        <div className="overlay-msg hint">Open a dataset folder to start.</div>
      )}
      {imageSrc && <img src={imageSrc} alt="Light field frame" className="main-image" />}
      {rows > 0 && cols > 0 && (
        <div className="vp-overlay">
          <ViewpointGrid rows={rows} cols={cols} viewpoint={viewpoint} onSelect={onSelectViewpoint} />
        </div>
      )}
    </div>
  )
}
