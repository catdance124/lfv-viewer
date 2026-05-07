# LFV Viewer

A browser-based viewer for light field video datasets.
Designed for the [Sintel 4D Light Field Video Dataset](https://ieee-dataport.org/open-access/sintel-4d-light-field-video-dataset), but works with any dataset that follows a similar folder structure.

**Live demo:** https://catdance124.github.io/lfv-viewer/

---

## Features

- Open a local dataset folder directly in the browser — no server required
- Auto-detects scenes, grid layout, image format, and frame count from the folder structure
- Switch viewpoints via an interactive grid overlay (top-right corner)
- Scrub or play back frames with a slider; adjustable FPS (1–120)
- Scene selection from a dropdown
- Works on any OS — Chrome or Edge required (File System Access API)

## Requirements

| Item | Requirement |
|------|-------------|
| Browser | Chrome 86+ or Edge 86+ |
| Dataset | Any light field video dataset following the structure below |

## Supported Dataset Structure

```
<dataset-root>/
  <scene-name>/
    <view-i-j>/          ← any folder whose name contains two integers (e.g. 00_00, cam_0_0, r0c0)
      <frame>.<ext>      ← PNG / JPG / JPEG / WEBP, any frame numbering
      ...
    ...
  <scene-name>/
  ...
```

The viewer auto-detects:

| Item | How |
|------|-----|
| **View folders** | Any subfolder whose name contains ≥ 2 integers — the last two are used as (row, col) |
| **Grid size** | Derived from the maximum (row, col) values found |
| **Image format** | First supported extension found in the view folder (PNG / JPG / JPEG / WEBP) |
| **Frame order** | Natural sort (e.g. `1.png → 2.png → 10.png` sorts correctly) |

### Example — Sintel 4D LFV Dataset

```
Sintel_LFV_9x9/
  ambushfight_1/
    00_00/
      000.png
      001.png
      ...
    04_04/
    ...
    08_08/
  ambushfight_2/
  ...
```

## Usage

1. Open https://catdance124.github.io/lfv-viewer/ in Chrome or Edge.
2. Click **Open Folder** and select the dataset root directory.
3. Select a scene from the dropdown in the header.
4. Click dots in the viewpoint grid (top-right) to switch viewpoints.
5. Drag the slider or press ▶ to play frames. Adjust **fps** as needed.

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:5173/lfv-viewer/ in Chrome.

```bash
npm run build   # production build → dist/
npm run preview # preview the built output
```

## Deployment

Pushing to the `main` branch automatically deploys to GitHub Pages via GitHub Actions.

Before the first deployment, enable GitHub Pages in the repository settings:
**Settings → Pages → Source → GitHub Actions**

## Tech Stack

| Item | Choice |
|------|--------|
| Language | TypeScript |
| Framework | React 19 |
| Build tool | Vite 8 |
| File access | File System Access API |
| Hosting | GitHub Pages |

## License

MIT
