import type { SceneInfo } from '../types'

interface Props {
  scenes: SceneInfo[]
  selectedScene: SceneInfo | null
  onOpenFolder: () => void
  onSelectScene: (scene: SceneInfo) => void
  loading: boolean
}

export function Header({ scenes, selectedScene, onOpenFolder, onSelectScene, loading }: Props) {
  return (
    <header className="header">
      <span className="header-title">LFV Viewer</span>
      <button className="btn-open" onClick={onOpenFolder} disabled={loading}>
        Open Folder
      </button>
      {scenes.length > 0 && (
        <select
          className="scene-select"
          value={selectedScene?.name ?? ''}
          onChange={(e) => {
            const s = scenes.find((sc) => sc.name === e.target.value)
            if (s) onSelectScene(s)
          }}
        >
          {scenes.map((sc) => (
            <option key={sc.name} value={sc.name}>
              {sc.name}
            </option>
          ))}
        </select>
      )}
      <a
        className="header-credit"
        href="https://github.com/catdance124/lfv-viewer"
        target="_blank"
        rel="noopener noreferrer"
      >
        catdance124
      </a>
    </header>
  )
}
