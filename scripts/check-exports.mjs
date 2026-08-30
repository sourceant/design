/* Every path this package promises resolves to a file that exists.
 *
 * The package ships source rather than a build, so nothing fails until an
 * application imports it. A renamed component or a missing entry point is a
 * broken install for whoever depends on this, discovered at their build rather
 * than ours.
 */

import { readFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))

const problems = []

for (const [name, target] of Object.entries(manifest.exports ?? {})) {
  // A wildcard promises a directory rather than one file.
  const path = join(root, target.replace('/*', ''))
  if (!existsSync(path)) {
    problems.push(`exports "${name}" points at ${target}, which does not exist`)
  }
}

for (const included of manifest.files ?? []) {
  if (!existsSync(join(root, included))) {
    problems.push(`files lists ${included}, which does not exist`)
  }
}

// Imports here carry no extension, because a bundler adds one. Node does not,
// so resolving them means trying what a bundler would.
const EXTENSIONS = ['', '.js', '.ts', '.vue', '/index.js', '/index.ts']

function resolves(from, target) {
  return EXTENSIONS.some((suffix) => existsSync(join(root, from, target + suffix)))
}

// Everything the entry point names has to be there, since a component removed
// or renamed leaves an export nobody can import.
const index = readFileSync(join(root, 'src/index.js'), 'utf8')
for (const [, target] of index.matchAll(/from '(\.\/[^']+)'/g)) {
  if (!resolves('src', target.slice(2))) {
    problems.push(`src/index.js exports ${target}, which does not exist`)
  }
}

if (problems.length) {
  console.error('This package promises what it does not ship:')
  for (const one of problems) console.error(`  ${one}`)
  process.exit(1)
}

console.log('Every export resolves.')
