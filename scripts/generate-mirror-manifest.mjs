import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const mirrorDir = path.join(rootDir, 'public/assets/mirror')
const outFile = path.join(rootDir, 'src/lib/mirrorSlideImages.ts')

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp'])
const SKIP_FILES = new Set(['readme.txt'])

function titleFromFilename(filename) {
  const base = path.basename(filename, path.extname(filename))
  return base
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function collectMirrorImages(dir, relativeDir = '') {
  if (!fs.existsSync(dir)) return []

  const slides = []

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue

    const relativePath = relativeDir ? `${relativeDir}/${entry.name}` : entry.name
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      slides.push(...collectMirrorImages(fullPath, relativePath))
      continue
    }

    const ext = path.extname(entry.name).toLowerCase()
    if (!IMAGE_EXTENSIONS.has(ext)) continue
    if (SKIP_FILES.has(entry.name.toLowerCase())) continue

    const id = path.basename(entry.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    slides.push({
      id: relativeDir ? `${relativeDir.replace(/[/\\]+/g, '-')}-${id}` : id,
      title: titleFromFilename(entry.name),
      image: `/assets/mirror/${relativePath.replace(/\\/g, '/')}`,
    })
  }

  return slides
}

function buildSlides() {
  if (!fs.existsSync(mirrorDir)) {
    fs.mkdirSync(mirrorDir, { recursive: true })
    return []
  }

  return collectMirrorImages(mirrorDir).sort((a, b) =>
    a.image.localeCompare(b.image, undefined, { numeric: true, sensitivity: 'base' })
  )
}

const slides = buildSlides()

const contents = `/** Auto-generated from public/assets/mirror — run \`npm run mirror:manifest\` after adding PNGs */
export interface MirrorSlide {
  id: string
  title: string
  image: string
}

export const MIRROR_SLIDES: MirrorSlide[] = ${JSON.stringify(slides, null, 2)}
`

fs.writeFileSync(outFile, contents)
console.log(`Generated ${slides.length} mirror slide(s) -> src/lib/mirrorSlideImages.ts`)
