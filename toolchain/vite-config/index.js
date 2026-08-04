// @ts-check
import { defineConfig, mergeConfig } from 'vite'

/**
 * Shared vite build config for node server apps: bundles src/index.ts to build/index.js
 * for node24, keeping the workspace's declared dependencies external.
 *
 * @param {{ dependencies?: Record<string, string> }} packageJson the workspace's package.json
 * @param {import('vite').UserConfig} [overrides] merged last, so it wins over the shared settings
 * @returns {import('vite').UserConfig}
 */
export const defineNodeBuildConfig = (packageJson, overrides = {}) =>
  mergeConfig(
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
    overrides,
  )

export { defineConfig, mergeConfig } from 'vite'
