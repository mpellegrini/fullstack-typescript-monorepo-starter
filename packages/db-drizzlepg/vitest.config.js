import { defineTestConfig } from '@toolchain/vitest-config'

import packageJson from './package.json' with { type: 'json' }

export default defineTestConfig(packageJson)
