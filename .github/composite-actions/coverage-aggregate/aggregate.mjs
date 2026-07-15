// Compose a single whole-monorepo Vitest coverage total from this run's
// coverage plus a carried-forward baseline.
//
// Why compose: CI runs `turbo run test --affected`, so only changed packages
// (and their dependents) re-run and emit a fresh `<pkg>/coverage/
// coverage-summary.json`. Coverage is strictly per-package (each summary counts
// only that package's own `src`), and `--affected` includes dependents, so an
// unaffected package's coverage is UNCHANGED — reusing its number from the main
// baseline is exact, not stale. The aggregate is therefore:
//   fresh coverage (on disk this run) ∪ carried-forward coverage (from baseline)
// over the authoritative current package set (`turbo ls`), summing covered/total
// and recomputing pct (a true line-weighted figure, not an average of averages).
//
// Env:
//   COVERAGE_BASELINE       path to the baseline coverage-aggregate.json (optional)
//   COVERAGE_AGGREGATE_FILE output path (default coverage-aggregate.json)
// Output file shape (also serves as the next baseline — it is complete):
//   { total: {<metric>}, packages: { <pkgPath>: { <metric>, carriedForward } } }
// Step outputs (when $GITHUB_OUTPUT set): lines/statements/functions/branches-pct,
//   summary-path, fresh-count, carried-count.

import { execFileSync } from 'node:child_process'
import { appendFileSync, globSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const METRICS = ['lines', 'statements', 'functions', 'branches']
const OUTPUT_FILE = process.env.COVERAGE_AGGREGATE_FILE ?? 'coverage-aggregate.json'

// Canonicalize any relative form ("./packages/api", "packages/api") to a single
// repo-root-relative key so turbo/disk/baseline paths compare equal.
const norm = (p) => path.relative(process.cwd(), path.resolve(process.cwd(), p))
const summaryFileFor = (pkgPath) => path.join(pkgPath, 'coverage', 'coverage-summary.json')

const emptyTotals = () =>
  Object.fromEntries(METRICS.map((m) => [m, { total: 0, covered: 0, skipped: 0, pct: 0 }]))

const withPct = (totals) => {
  for (const m of METRICS) {
    const t = totals[m]
    t.pct = t.total === 0 ? 100 : Number(((t.covered / t.total) * 100).toFixed(2))
  }
  return totals
}

const readJson = (file) => {
  try {
    return JSON.parse(readFileSync(file, 'utf8'))
  } catch {
    return null
  }
}

// Packages with fresh coverage on disk this run (the affected set).
const diskPackages = new Set(
  globSync('**/coverage/coverage-summary.json', {
    exclude: (name) =>
      name === 'node_modules' || name.includes(`${path.sep}node_modules${path.sep}`),
  }).map((f) => norm(path.dirname(path.dirname(f)))),
)

const baseline = process.env.COVERAGE_BASELINE ? readJson(process.env.COVERAGE_BASELINE) : null
const baselinePackages = Object.keys(baseline?.packages ?? {}).map(norm)

// Authoritative current package set from turbo (drops deleted dirs like the
// stale packages/flight-shop, includes new packages). Fall back to the union of
// on-disk + baseline packages if `turbo ls` is unavailable.
const packageSet = (() => {
  try {
    const raw = execFileSync('pnpm', ['exec', 'turbo', 'ls', '--output=json'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    })
    const parsed = JSON.parse(raw.slice(raw.indexOf('{')))
    const items = parsed?.packages?.items ?? []
    if (items.length > 0) return items.map((i) => norm(i.path))
  } catch (error) {
    console.warn(`turbo ls unavailable (${error.message}); using disk ∪ baseline package set.`)
  }
  return [...new Set([...diskPackages, ...baselinePackages])]
})()

const aggregate = emptyTotals()
const packages = {}
const skipped = []
let freshCount = 0
let carriedCount = 0

for (const pkg of [...packageSet].sort()) {
  let total
  let carriedForward
  if (diskPackages.has(pkg)) {
    const summary = readJson(summaryFileFor(pkg))
    if (!summary?.total) {
      skipped.push(pkg)
      continue
    }
    total = withPct(structuredClone(summary.total))
    carriedForward = false
    freshCount += 1
  } else if (baseline?.packages?.[pkg]) {
    total = withPct(structuredClone(baseline.packages[pkg]))
    carriedForward = true
    carriedCount += 1
  } else {
    // Untested (e.g. toolchain/*) or data in neither source — nothing to add.
    skipped.push(pkg)
    continue
  }

  packages[pkg] = { ...total, carriedForward }
  for (const m of METRICS) {
    if (!total[m]) continue
    aggregate[m].total += total[m].total ?? 0
    aggregate[m].covered += total[m].covered ?? 0
    aggregate[m].skipped += total[m].skipped ?? 0
  }
}

withPct(aggregate)

// Order the packages map deterministically for a stable, diffable baseline.
const orderedPackages = Object.fromEntries(
  Object.keys(packages)
    .sort()
    .map((k) => [k, packages[k]]),
)
writeFileSync(
  OUTPUT_FILE,
  `${JSON.stringify({ total: aggregate, packages: orderedPackages }, null, 2)}\n`,
)

console.log(
  `Composed coverage: ${freshCount} re-tested, ${carriedCount} carried forward` +
    (baseline ? '' : ' (no baseline)') +
    `${skipped.length ? `, ${skipped.length} without coverage (${skipped.join(', ')})` : ''} → ${OUTPUT_FILE}`,
)
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
      `fresh-count=${freshCount}`,
      `carried-count=${carriedCount}`,
      '',
    ].join('\n'),
  )
}

if (freshCount === 0 && carriedCount === 0) {
  console.warn('No coverage found from disk or baseline — did tests run with coverage enabled?')
}
