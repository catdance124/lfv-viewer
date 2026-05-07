export interface Viewpoint {
  i: number
  j: number
}

export interface SceneInfo {
  name: string
  frames: string[]              // sorted image filenames (e.g. ["000.png", "001.png", ...])
  rows: number                  // grid row count (max_i + 1)
  cols: number                  // grid col count (max_j + 1)
  viewMap: Record<string, string> // key: "${i}_${j}" → actual folder name (e.g. "04_04")
  handle: FileSystemDirectoryHandle
}
