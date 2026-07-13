import type { UserConfig } from 'vitest/config'

declare const config: UserConfig
export default config
export { defineConfig, mergeConfig } from 'vitest/config'
