import { useState, useEffect, useRef, useCallback } from 'react'

const DEFAULT_FPS = 24

export function usePlayer(
  frameCount: number,
  currentFrame: number,
  onFrameChange: (f: number) => void
) {
  const [playing, setPlaying] = useState(false)
  const [fps, setFps] = useState(DEFAULT_FPS)
  const intervalRef = useRef<number | null>(null)

  const stop = useCallback(() => {
    setPlaying(false)
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const play = useCallback(() => {
    if (frameCount === 0) return
    setPlaying(true)
  }, [frameCount])

  const toggle = useCallback(() => {
    if (playing) stop()
    else play()
  }, [playing, play, stop])

  useEffect(() => {
    if (!playing) return
    intervalRef.current = window.setInterval(() => {
      onFrameChange((currentFrame + 1) % frameCount)
    }, 1000 / fps)
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current)
    }
  }, [playing, currentFrame, frameCount, fps, onFrameChange])

  useEffect(() => {
    if (frameCount === 0) stop()
  }, [frameCount, stop])

  return { playing, toggle, stop, fps, setFps }
}
