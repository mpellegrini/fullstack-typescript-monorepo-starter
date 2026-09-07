import { defineNodeBuildConfig, mergeConfig } from '@toolchain/vite'
import { defineTestConfig } from '@toolchain/vitest'

import packageJson from './package.json' with { type: 'json' }

export default mergeConfig(defineTestConfig(packageJson), defineNodeBuildConfig(packageJson))
