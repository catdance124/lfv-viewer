import { useState, useCallback } from 'react'
import type { SceneInfo, Viewpoint } from '../types'

const SUPPORTED_EXTS = ['.png', '.jpg', '.jpeg', '.webp']

function parseViewCoords(name: string): [number, number] | null {
  const nums = [...name.matchAll(/\d+/g)].map((m) => parseInt(m[0], 10))
  if (nums.length < 2) return null
  return [nums[nums.length - 2], nums[nums.length - 1]]
}

function naturalSort(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
}

async function listFrames(viewDir: FileSystemDirectoryHandle): Promise<string[]> {
  const frames: string[] = []
  for await (const [name] of viewDir.entries()) {
    const ext = name.toLowerCase().match(/(\.[^.]+)$/)?.[1]
    if (ext && SUPPORTED_EXTS.includes(ext)) frames.push(name)
  }
  frames.sort(naturalSort)
  return frames
}

async function getScenes(root: FileSystemDirectoryHandle): Promise<SceneInfo[]> {
  const scenes: SceneInfo[] = []

  for await (const [name, handle] of root.entries()) {
    if (handle.kind !== 'directory') continue
    const sceneDir = handle as FileSystemDirectoryHandle

    let maxI = -1
    let maxJ = -1
    const viewMap: Record<string, string> = {}

    for await (const [vname, vhandle] of sceneDir.entries()) {
      if (vhandle.kind !== 'directory') continue
      const coords = parseViewCoords(vname)
      if (!coords) continue
      const [i, j] = coords
      viewMap[`${i}_${j}`] = vname
      if (i > maxI) maxI = i
      if (j > maxJ) maxJ = j
    }

    if (maxI < 0) continue

    const firstViewName = Object.values(viewMap)[0]
    const firstViewDir = await sceneDir.getDirectoryHandle(firstViewName)
    const frames = await listFrames(firstViewDir)
    if (frames.length === 0) continue

    const iVals = [...new Set(Object.keys(viewMap).map((k) => parseInt(k.split('_')[0])))].sort((a, b) => a - b)
    const jVals = [...new Set(Object.keys(viewMap).map((k) => parseInt(k.split('_')[1])))].sort((a, b) => a - b)
    const iRemap = new Map(iVals.map((v, idx) => [v, idx]))
    const jRemap = new Map(jVals.map((v, idx) => [v, idx]))
    const remappedViewMap: Record<string, string> = {}
    for (const [key, folder] of Object.entries(viewMap)) {
      const [oi, oj] = key.split('_').map(Number)
      remappedViewMap[`${iRemap.get(oi)}_${jRemap.get(oj)}`] = folder
    }

    scenes.push({
      name,
      frames,
      rows: iVals.length,
      cols: jVals.length,
      viewMap: remappedViewMap,
      handle: sceneDir,
    })
  }

  scenes.sort((a, b) => naturalSort(a.name, b.name))
  return scenes
}

function centerViewpoint(scene: SceneInfo): Viewpoint {
  return { i: Math.floor(scene.rows / 2), j: Math.floor(scene.cols / 2) }
}

function clampViewpoint(vp: Viewpoint, scene: SceneInfo): Viewpoint {
  return {
    i: Math.min(vp.i, scene.rows - 1),
    j: Math.min(vp.j, scene.cols - 1),
  }
}

export function useFilesystem() {
  const [scenes, setScenes] = useState<SceneInfo[]>([])
  const [selectedScene, setSelectedScene] = useState<SceneInfo | null>(null)
  const [viewpoint, setViewpoint] = useState<Viewpoint>({ i: 0, j: 0 })
  const [frame, setFrame] = useState(0)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadImage = useCallback(async (scene: SceneInfo, vp: Viewpoint, frameIdx: number) => {
    try {
      const folderName = scene.viewMap[`${vp.i}_${vp.j}`]
      if (!folderName) throw new Error(`View ${vp.i}_${vp.j} not found in scene`)
      const viewDir = await scene.handle.getDirectoryHandle(folderName)
      const fileName = scene.frames[frameIdx]
      const fileHandle = await viewDir.getFileHandle(fileName)
      const file = await fileHandle.getFile()
      const url = URL.createObjectURL(file)
      setImageSrc((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return url
      })
      setError(null)
    } catch (e: any) {
      setError(`Failed to load frame: ${String(e)}`)
    }
  }, [])

  const openFolder = useCallback(async () => {
    try {
      const handle = await (window as any).showDirectoryPicker({ mode: 'read' })
      setLoading(true)
      setError(null)
      setImageSrc(null)
      const found = await getScenes(handle)
      setScenes(found)
      if (found.length === 0) {
        setSelectedScene(null)
        setError('No LFV scenes found in this folder.')
        return
      }
      const scene = found[0]
      const vp = centerViewpoint(scene)
      setSelectedScene(scene)
      setViewpoint(vp)
      setFrame(0)
      await loadImage(scene, vp, 0)
    } catch (e: any) {
      if (e.name !== 'AbortError') setError(String(e))
    } finally {
      setLoading(false)
    }
  }, [loadImage])

  const selectScene = useCallback(
    (scene: SceneInfo) => {
      const vp = clampViewpoint(viewpoint, scene)
      setSelectedScene(scene)
      setViewpoint(vp)
      setFrame(0)
      loadImage(scene, vp, 0)
    },
    [viewpoint, loadImage]
  )

  const selectViewpoint = useCallback(
    (vp: Viewpoint) => {
      setViewpoint(vp)
      if (selectedScene) loadImage(selectedScene, vp, frame)
    },
    [selectedScene, frame, loadImage]
  )

  const selectFrame = useCallback(
    (f: number) => {
      setFrame(f)
      if (selectedScene) loadImage(selectedScene, viewpoint, f)
    },
    [selectedScene, viewpoint, loadImage]
  )

  return {
    scenes,
    selectedScene,
    viewpoint,
    frame,
    imageSrc,
    loading,
    error,
    openFolder,
    selectScene,
    selectViewpoint,
    selectFrame,
  }
}
