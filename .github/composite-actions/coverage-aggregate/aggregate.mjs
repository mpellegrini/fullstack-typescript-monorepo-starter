// Merge every package's Vitest `coverage-summary.json` (the `json-summary`
// reporter output) into a single whole-monorepo total.
//
// Vitest writes one `<pkg>/coverage/coverage-summary.json` per package, each
// with a `.total` block of { lines, statements, functions, branches }, where
// every metric is { total, covered, skipped, pct }. We sum `covered` and
// `total` across all packages and recompute `pct` so the aggregate is a true
// line-weighted repo figure (not an average of per-package percentages).
//
// Output: `coverage-aggregate.json` at the repo root, shape:
//   { total: { lines, statements, functions, branches }, packages: { <name>: <total> } }
// plus GitHub step outputs (lines-pct, statements-pct, functions-pct,
// branches-pct, summary-path) when $GITHUB_OUTPUT is set.

import { appendFileSync, globSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const METRICS = ['lines', 'statements', 'functions', 'branches']
const OUTPUT_FILE = process.env.COVERAGE_AGGREGATE_FILE ?? 'coverage-aggregate.json'

const files = globSync('**/coverage/coverage-summary.json', {
  exclude: (name) => name === 'node_modules' || name.includes(`${path.sep}node_modules${path.sep}`),
}).sort()

/** @param {Record<string, { total: number, covered: number }>} totals */
const emptyTotals = () =>
  Object.fromEntries(METRICS.map((m) => [m, { total: 0, covered: 0, skipped: 0, pct: 0 }]))

const withPct = (totals) => {
  for (const m of METRICS) {
    const t = totals[m]
    t.pct = t.total === 0 ? 100 : Number(((t.covered / t.total) * 100).toFixed(2))
  }
  return totals
}

const aggregate = emptyTotals()
const packages = {}

for (const file of files) {
  let summary
  try {
    summary = JSON.parse(readFileSync(file, 'utf8'))
  } catch (error) {
    console.warn(`Skipping unreadable coverage summary ${file}: ${error.message}`)
    continue
  }
  const total = summary.total
  if (!total) continue

  // Package name = the directory that owns the `coverage/` dir (…/<pkg>/coverage/…).
  const name = path.relative(process.cwd(), path.dirname(path.dirname(file))) || '.'
  packages[name] = withPct(structuredClone(total))

  for (const m of METRICS) {
    if (!total[m]) continue
    aggregate[m].total += total[m].total ?? 0
    aggregate[m].covered += total[m].covered ?? 0
    aggregate[m].skipped += total[m].skipped ?? 0
  }
}

withPct(aggregate)

const result = { total: aggregate, packages }
writeFileSync(OUTPUT_FILE, `${JSON.stringify(result, null, 2)}\n`)

console.log(`Aggregated ${files.length} coverage summary file(s) → ${OUTPUT_FILE}`)
for (const m of METRICS) {
  const t = aggregate[m]
  console.log(`  ${m.padEnd(11)} ${t.pct.toFixed(2).padStart(6)}%  (${t.covered}/${t.total})`)
}

if (process.env.GITHUB_OUTPUT) {
  appendFileSync(
    process.env.GITHUB_OUTPUT,
    [
      `lines-pct=${aggregate.lines.pct}`,
      `statements-pct=${aggregate.statements.pct}`,
      `functions-pct=${aggregate.functions.pct}`,
      `branches-pct=${aggregate.branches.pct}`,
      `summary-path=${path.resolve(OUTPUT_FILE)}`,
      '',
    ].join('\n'),
  )
}

if (files.length === 0) {
  console.warn('No coverage-summary.json files found — did the tests run with coverage enabled?')
}
