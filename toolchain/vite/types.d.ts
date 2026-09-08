import type { UserConfig } from 'vite'

export declare const defineNodeBuildConfig: (
  packageJson: { dependencies?: Record<string, string> },
  overrides?: UserConfig,
) => UserConfig

export { defineConfig, mergeConfig } from 'vite'
