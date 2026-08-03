import { defineConfig, mergeConfig } from 'vite'

import { defineTestConfig } from '@toolchain/vitest-config'

import packageJson from './package.json' with { type: 'json' }

export default mergeConfig(
  defineTestConfig(packageJson),
  defineConfig({
    build: {
      emptyOutDir: true,
      minify: false,
      outDir: 'build',
      reportCompressedSize: false,
      rolldownOptions: {
        input: './src/index.ts',
        output: {
          entryFileNames: 'index.js',
          format: 'esm',
        },
      },
      sourcemap: true,
      ssr: true,
      target: 'node24',
    },
    ssr: {
      // Externalize the given dependencies and their transitive dependencies for SSR.
      external: Object.keys(packageJson?.dependencies ?? {}),
      // No dependencies are externalized. However, dependencies explicitly listed in
      // ssr.external can take priority and still be externalized.
      noExternal: true,
    },
  }),
)
