import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import { createRequire } from 'node:module'
import { bundleStats } from 'rollup-plugin-bundle-stats'
import { visualizer } from 'rollup-plugin-visualizer'
import webpackStatsPlugin from 'rollup-plugin-webpack-stats'
import { defineConfig, mergeConfig } from 'vite'

import vitestSharedConfig from '@toolchain/vitest-config'

const require = createRequire(import.meta.url)
const packageJson = require('./package.json')

export default mergeConfig(
  vitestSharedConfig,
  defineConfig({
    plugins: [
      sveltekit(),
      tailwindcss(),
      // bundleStats({ json: true }),
      // visualizer({
      //   emitFile: true,
      //   filename: 'stats.html',
      // }),
      webpackStatsPlugin(),
    ],
    test: {
      name: packageJson.name,
    },
  }),
)
