import { defineTestConfig } from '@toolchain/vitest'

import packageJson from './package.json' with { type: 'json' }

export default defineTestConfig(packageJson)
