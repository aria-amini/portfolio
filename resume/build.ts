import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import { compileResume, resumeFileName } from './compile.ts'

const outDir = process.argv[2] ?? '.output/resume'

await mkdir(outDir, { recursive: true })

await writeFile(join(outDir, resumeFileName), compileResume())

process.stdout.write(`Wrote ${join(outDir, resumeFileName)}\n`)
