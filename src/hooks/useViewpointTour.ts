import { useState, useEffect, useRef, useCallback } from 'react'
import type { Viewpoint } from '../types'

export type TourPattern = 'horizontal' | 'vertical' | 'snake' | 'spiral'

function spiralPath(rows: number, cols: number): Viewpoint[] {
  const ci = Math.floor(rows / 2)
  const cj = Math.floor(cols / 2)
  const result: Viewpoint[] = [{ i: ci, j: cj }]
  const maxRing = Math.max(rows, cols)

  for (let ring = 1; ring <= maxRing && result.length < rows * cols; ring++) {
    for (let dj = -ring; dj <= ring; dj++) {
      const i = ci - ring, j = cj + dj
      if (i >= 0 && i < rows && j >= 0 && j < cols) result.push({ i, j })
    }
    for (let di = -ring + 1; di <= ring; di++) {
      const i = ci + di, j = cj + ring
      if (i >= 0 && i < rows && j >= 0 && j < cols) result.push({ i, j })
    }
    for (let dj = ring - 1; dj >= -ring; dj--) {
      const i = ci + ring, j = cj + dj
      if (i >= 0 && i < rows && j >= 0 && j < cols) result.push({ i, j })
    }
    for (let di = ring - 1; di >= -ring + 1; di--) {
      const i = ci + di, j = cj - ring
      if (i >= 0 && i < rows && j >= 0 && j < cols) result.push({ i, j })
    }
  }

  return result
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
    pathRef.current = generatePath(pattern, rows, cols, viewpoint)
    stepRef.current = 0
    setTouring(true)
  }, [rows, cols, viewpoint, pattern])

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

  // Restart tour with new pattern when changed mid-tour
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!touring) return
    pathRef.current = generatePath(pattern, rows, cols, viewpoint)
    stepRef.current = 0
  }, [pattern])

  return { touring, toggle, stop, pattern, setPattern, speed, setSpeed }
}
