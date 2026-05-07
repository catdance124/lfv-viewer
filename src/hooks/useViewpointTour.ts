import { useState, useEffect, useRef, useCallback } from 'react'
import type { Viewpoint } from '../types'

export type TourPattern = 'horizontal' | 'vertical' | 'snake' | 'spiral'

function spiralPath(rows: number, cols: number): Viewpoint[] {
  const ci = Math.floor(rows / 2)
  const cj = Math.floor(cols / 2)
  const path: Viewpoint[] = [{ i: ci, j: cj }]

  // clockwise: right, down, left, up
  const di = [0, 1, 0, -1]
  const dj = [1, 0, -1, 0]

  let i = ci, j = cj
  let dir = 0
  let steps = 1
  let stepsTaken = 0
  let dirChanges = 0

  while (path.length < rows * cols && steps <= rows + cols) {
    i += di[dir]
    j += dj[dir]
    stepsTaken++
    if (i >= 0 && i < rows && j >= 0 && j < cols) path.push({ i, j })
    if (stepsTaken === steps) {
      stepsTaken = 0
      dir = (dir + 1) % 4
      dirChanges++
      if (dirChanges % 2 === 0) steps++
    }
  }

  return path
}

function generatePath(
  pattern: TourPattern,
  rows: number,
  cols: number,
  anchor: Viewpoint,
): Viewpoint[] {
  switch (pattern) {
    case 'horizontal':
      return Array.from({ length: cols }, (_, j) => ({ i: anchor.i, j }))
    case 'vertical':
      return Array.from({ length: rows }, (_, i) => ({ i, j: anchor.j }))
    case 'snake': {
      const path: Viewpoint[] = []
      for (let i = 0; i < rows; i++) {
        if (i % 2 === 0) {
          for (let j = 0; j < cols; j++) path.push({ i, j })
        } else {
          for (let j = cols - 1; j >= 0; j--) path.push({ i, j })
        }
      }
      return path
    }
    case 'spiral':
      return spiralPath(rows, cols)
  }
}

const DEFAULT_SPEED = 4

export function useViewpointTour(
  rows: number,
  cols: number,
  viewpoint: Viewpoint,
  viewMap: Record<string, string>,
  sceneName: string,
  onViewpointChange: (vp: Viewpoint) => void,
) {
  const [touring, setTouring] = useState(false)
  const [pattern, setPattern] = useState<TourPattern>('horizontal')
  const [speed, setSpeed] = useState(DEFAULT_SPEED)

  const pathRef = useRef<Viewpoint[]>([])
  const stepRef = useRef(0)
  const callbackRef = useRef(onViewpointChange)
  useEffect(() => { callbackRef.current = onViewpointChange }, [onViewpointChange])

  const stop = useCallback(() => setTouring(false), [])

  const play = useCallback(() => {
    if (rows === 0 || cols === 0) return
    const full = generatePath(pattern, rows, cols, viewpoint)
    pathRef.current = full.filter((vp) => `${vp.i}_${vp.j}` in viewMap)
    if (pathRef.current.length === 0) return
    stepRef.current = 0
    setTouring(true)
  }, [rows, cols, viewpoint, pattern, viewMap])

  const toggle = useCallback(() => {
    if (touring) stop()
    else play()
  }, [touring, play, stop])

  useEffect(() => {
    if (!touring || pathRef.current.length === 0) return
    const id = window.setInterval(() => {
      stepRef.current = (stepRef.current + 1) % pathRef.current.length
      callbackRef.current(pathRef.current[stepRef.current])
    }, 1000 / speed)
    return () => clearInterval(id)
  }, [touring, speed])

  useEffect(() => {
    if (rows === 0 || cols === 0) stop()
  }, [rows, cols, stop])

  useEffect(() => {
    stop()
  }, [sceneName, stop])

  // Restart tour with new pattern when changed mid-tour
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!touring) return
    const full = generatePath(pattern, rows, cols, viewpoint)
    pathRef.current = full.filter((vp) => `${vp.i}_${vp.j}` in viewMap)
    stepRef.current = 0
  }, [pattern])

  return { touring, toggle, stop, pattern, setPattern, speed, setSpeed }
}
