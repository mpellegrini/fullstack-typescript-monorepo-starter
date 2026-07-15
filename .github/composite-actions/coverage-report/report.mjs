// Render the whole-monorepo coverage aggregate as Markdown: append it to the
// GitHub job summary and (for PRs) write a sticky-comment body to disk for the
// comment step to upsert.
//
// Inputs (env):
//   COVERAGE_CURRENT   path to this run's coverage-aggregate.json (required)
//   COVERAGE_BASELINE  path to the main baseline coverage-aggregate.json (optional)
//   COVERAGE_MODE      "pr" | "push" — controls the heading / delta wording
//   COVERAGE_COMMENT_FILE  where to write the comment body (default coverage-comment.md)
//
// The delta column compares against `main`: on a PR the baseline is main's tip,
// on a push to main it's the previous push (see _code-quality.yml).

import { readFileSync, writeFileSync } from 'node:fs'

const MARKER = '<!-- coverage-report -->'
const METRICS = ['lines', 'statements', 'functions', 'branches']
const LABELS = {
  lines: 'Lines',
  statements: 'Statements',
  functions: 'Functions',
  branches: 'Branches',
}

const mode = process.env.COVERAGE_MODE === 'pr' ? 'pr' : 'push'
const commentFile = process.env.COVERAGE_COMMENT_FILE ?? 'coverage-comment.md'

const readJson = (file) => {
  if (!file) return null
  try {
    return JSON.parse(readFileSync(file, 'utf8'))
  } catch {
    return null
  }
}

const current = readJson(process.env.COVERAGE_CURRENT)
if (!current) {
  console.error(`No current coverage aggregate found at "${process.env.COVERAGE_CURRENT}".`)
  process.exit(1)
}
const baseline = readJson(process.env.COVERAGE_BASELINE)

const fmtPct = (n) => `${Number(n).toFixed(2)}%`

const deltaCell = (cur, base) => {
  if (base === null || base === undefined) return '—'
  const d = cur - base
  const icon = d > 0.005 ? '⬆️' : d < -0.005 ? '⬇️' : '➖'
  const sign = d > 0 ? '+' : ''
  return `${icon} ${sign}${d.toFixed(2)}%`
}

const baseVs = mode === 'pr' ? 'main' : 'last push'
const heading = mode === 'pr' ? 'Coverage report' : 'Coverage report (push to main)'

const pkgEntries = Object.entries(current.packages ?? {})
const carried = pkgEntries.filter(([, p]) => p.carriedForward)
const fresh = pkgEntries.filter(([, p]) => !p.carriedForward)

const lines = []
lines.push(`## 📊 ${heading}`)
lines.push('')
if (baseline) {
  lines.push(`Whole-monorepo coverage, compared against **${baseVs}**.`)
} else {
  lines.push(`Whole-monorepo coverage. _No ${baseVs} baseline yet — this run seeds it._`)
}
// Only affected packages re-run under `turbo --affected`; the rest carry their
// (unchanged) coverage forward from the baseline. Surface the split so a reader
// knows which packages were actually exercised this run.
if (carried.length > 0) {
  lines.push('')
  lines.push(
    `_${fresh.length} package${fresh.length === 1 ? '' : 's'} re-tested, ` +
      `${carried.length} carried forward from ${baseVs} (↩︎)._`,
  )
}
lines.push('')
lines.push(`| Metric | Coverage | Covered / Total | Δ vs ${baseVs} |`)
lines.push('| --- | --- | --- | --- |')
for (const m of METRICS) {
  const c = current.total[m]
  const b = baseline?.total?.[m]
  lines.push(
    `| ${LABELS[m]} | ${fmtPct(c.pct)} | ${c.covered} / ${c.total} | ${deltaCell(c.pct, b?.pct)} |`,
  )
}
lines.push('')

// Per-package breakdown (line coverage), collapsed by default.
const pkgNames = Object.keys(current.packages ?? {}).sort()
if (pkgNames.length > 0) {
  lines.push('<details>')
  lines.push(`<summary>Per-package line coverage (${pkgNames.length})</summary>`)
  lines.push('')
  lines.push(`| Package | Lines | Covered / Total | Δ vs ${baseVs} |`)
  lines.push('| --- | --- | --- | --- |')
  for (const name of pkgNames) {
    const pkg = current.packages[name]
    const c = pkg.lines
    const b = baseline?.packages?.[name]?.lines
    const label = pkg.carriedForward ? `\`${name}\` ↩︎` : `\`${name}\``
    lines.push(
      `| ${label} | ${fmtPct(c.pct)} | ${c.covered} / ${c.total} | ${deltaCell(c.pct, b?.pct)} |`,
    )
  }
  lines.push('')
  lines.push('</details>')
  lines.push('')
}

const body = lines.join('\n')

// Job summary (always).
if (process.env.GITHUB_STEP_SUMMARY) {
  writeFileSync(process.env.GITHUB_STEP_SUMMARY, `${body}\n`, { flag: 'a' })
}

// Sticky-comment body (marker first so the comment step can find + update it).
writeFileSync(commentFile, `${MARKER}\n${body}\n`)

console.log(body)
