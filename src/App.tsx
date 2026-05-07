import { useFilesystem } from './hooks/useFilesystem'
import { usePlayer } from './hooks/usePlayer'
import { Header } from './components/Header'
import { ImageViewer } from './components/ImageViewer'
import { FrameControls } from './components/FrameControls'
import './App.css'

export default function App() {
  const fs = useFilesystem()
  const frameCount = fs.selectedScene?.frames.length ?? 0
  const player = usePlayer(frameCount, fs.frame, fs.selectFrame)

  return (
    <div className="app">
      <Header
        scenes={fs.scenes}
        selectedScene={fs.selectedScene}
        onOpenFolder={fs.openFolder}
        onSelectScene={fs.selectScene}
        loading={fs.loading}
      />
      <main className="main">
        <ImageViewer
          imageSrc={fs.imageSrc}
          loading={fs.loading}
          error={fs.error}
          rows={fs.selectedScene?.rows ?? 0}
          cols={fs.selectedScene?.cols ?? 0}
          viewpoint={fs.viewpoint}
          onSelectViewpoint={fs.selectViewpoint}
        />
      </main>
      <FrameControls
        frame={fs.frame}
        frameCount={frameCount}
        playing={player.playing}
        fps={player.fps}
        onToggle={player.toggle}
        onFrameChange={fs.selectFrame}
        onFpsChange={player.setFps}
      />
    </div>
  )
}
