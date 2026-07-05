#!/usr/bin/env node
// Dependency-free semver 2.0 precedence (https://semver.org/#spec-item-11).
// Exists because `sort -V` and git's `v:refname` both mis-order prereleases
// (they sort 1.0.0-rc.1 AFTER 1.0.0).
//
// Usage:
//   semver-compare.mjs cmp <a> <b>     prints -1 | 0 | 1
//   semver-compare.mjs max <v...>      prints the highest version

const parse = (v) => {
  const m = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/.exec(v)
  if (!m) throw new Error(`'${v}' is not valid semver`)
  return { nums: [Number(m[1]), Number(m[2]), Number(m[3])], pre: m[4]?.split('.') ?? null }
}

// Prerelease identifiers: numeric compare numerically and sort below
// alphanumeric; alphanumeric compare lexically (ASCII).
const cmpId = (a, b) => {
  const na = /^\d+$/.test(a)
  const nb = /^\d+$/.test(b)
  if (na && nb) return Math.sign(Number(a) - Number(b))
  if (na) return -1
  if (nb) return 1
  return a < b ? -1 : a > b ? 1 : 0
}

const cmp = (x, y) => {
  const a = parse(x)
  const b = parse(y)
  for (let i = 0; i < 3; i++) {
    if (a.nums[i] !== b.nums[i]) return Math.sign(a.nums[i] - b.nums[i])
  }
  if (!a.pre && !b.pre) return 0
  if (!a.pre) return 1 // a release outranks any of its prereleases
  if (!b.pre) return -1
  for (let i = 0; i < Math.max(a.pre.length, b.pre.length); i++) {
    if (a.pre[i] === undefined) return -1 // shorter prerelease list sorts lower
    if (b.pre[i] === undefined) return 1
    const c = cmpId(a.pre[i], b.pre[i])
    if (c !== 0) return c
  }
  return 0
}

const [mode, ...args] = process.argv.slice(2)
if (mode === 'cmp' && args.length === 2) {
  console.log(cmp(args[0], args[1]))
} else if (mode === 'max' && args.length > 0) {
  console.log(args.reduce((m, v) => (cmp(v, m) > 0 ? v : m)))
} else {
  console.error('usage: semver-compare.mjs cmp <a> <b> | max <version...>')
  process.exit(2)
}
