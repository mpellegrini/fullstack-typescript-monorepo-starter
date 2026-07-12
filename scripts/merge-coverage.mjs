/**
 * Merges per-workspace vitest coverage output (coverage/coverage-final.json) into a single
 * report set at the repo root: coverage-final.json, coverage-summary.json, lcov.info, and a
 * text report on stdout. CI feeds the merged files to vitest-coverage-report-action.
 *
 * With `turbo run test --affected`, only affected workspaces produce coverage output, so the
 * merged report reflects affected workspaces only.
 */
import { execFileSync } from 'node:child_process'
import { cpSync, globSync, mkdirSync, rmSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const outDir = path.join(root, 'coverage')
const rawDir = path.join(outDir, 'raw')

const files = globSync('{apps,packages}/*/coverage/coverage-final.json', { cwd: root })
if (files.length === 0) {
  console.log('No workspace coverage files found, skipping merged coverage report')
  process.exit(0)
}

rmSync(outDir, { force: true, recursive: true })
mkdirSync(rawDir, { recursive: true })
for (const file of files) {
  const workspace = file.split(path.sep).slice(0, 2).join('__')
  cpSync(path.join(root, file), path.join(rawDir, `${workspace}.json`))
}

const nyc = (...args) => execFileSync('pnpm', ['exec', 'nyc', ...args], { stdio: 'inherit' })
nyc('merge', rawDir, path.join(outDir, 'coverage-final.json'))
nyc(
  'report',
  '--temp-dir',
  rawDir,
  '--report-dir',
  outDir,
  '--reporter=lcovonly',
  '--reporter=json-summary',
  '--reporter=text',
)
