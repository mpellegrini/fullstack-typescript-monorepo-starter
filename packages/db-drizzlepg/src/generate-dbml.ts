/**
 * Generate DBML from Drizzle Schema
 *
 * see https://github.com/L-Mario564/drizzle-dbml-generator
 */
import { pgGenerate } from 'drizzle-dbml-generator'

import * as schema from './schema/index.js'

pgGenerate({
  out: './schema.dbml',
  relational: false,
  schema,
})
