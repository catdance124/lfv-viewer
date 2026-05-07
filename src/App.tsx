import { useFilesystem } from './hooks/useFilesystem'
import { usePlayer } from './hooks/usePlayer'
import { useViewpointTour } from './hooks/useViewpointTour'
import { Header } from './components/Header'
import { ImageViewer } from './components/ImageViewer'
import { FrameControls } from './components/FrameControls'
import { ViewpointTourControls } from './components/ViewpointTourControls'
import './App.css'

export default function App() {
  const fs = useFilesystem()
  const frameCount = fs.selectedScene?.frames.length ?? 0
  const player = usePlayer(frameCount, fs.frame, fs.selectFrame)
  const tour = useViewpointTour(
    fs.selectedScene?.rows ?? 0,
    fs.selectedScene?.cols ?? 0,
    fs.viewpoint,
    fs.selectedScene?.viewMap ?? {},
    fs.selectedScene?.name ?? '',
    fs.selectViewpoint,
  )

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
          viewMap={fs.selectedScene?.viewMap ?? {}}
          onSelectViewpoint={fs.selectViewpoint}
        />
      </main>
      {fs.selectedScene && (
        <ViewpointTourControls
          touring={tour.touring}
          pattern={tour.pattern}
          speed={tour.speed}
          onToggle={tour.toggle}
          onPatternChange={tour.setPattern}
          onSpeedChange={tour.setSpeed}
        />
      )}
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
