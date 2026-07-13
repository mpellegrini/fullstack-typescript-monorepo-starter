import { defineConfig, mergeConfig } from 'vite'

import vitestSharedConfig from '@toolchain/vitest-config'

import packageJson from './package.json' with { type: 'json' }

export default mergeConfig(
  vitestSharedConfig,
  defineConfig({
    base: '/',
    build: {
      emptyOutDir: true,
      minify: true,
      outDir: 'build',
      rollupOptions: {
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
      // Build target for the SSR server
      // Node.js built-ins will also be externalized by default
      target: 'node',
    },
    test: {
      name: packageJson.name,
    },
  }),
)
