import { defineFlatConfig } from 'eslint-define-config'

import base from '../configs/base.js'
import globalIgnores from '../configs/global-ignores.js'
import plusJavascript from '../configs/javascript.js'
import plusPrettier from '../configs/prettier.js'
import plusTypescript from '../configs/typescript.js'
import plusVitest from '../configs/vitest.js'

export default defineFlatConfig([
  ...base,
  ...plusJavascript,
  ...plusTypescript,
  ...plusVitest,
  ...plusPrettier,
  ...globalIgnores,
])
