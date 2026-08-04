import { defineNodeBuildConfig, mergeConfig } from '@toolchain/vite-config'
import { defineTestConfig } from '@toolchain/vitest-config'

import packageJson from './package.json' with { type: 'json' }

export default mergeConfig(defineTestConfig(packageJson), defineNodeBuildConfig(packageJson))
