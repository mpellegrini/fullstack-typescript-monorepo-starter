import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  /**
   * https://orm.drizzle.team/kit-docs/config-reference#out
   */
  out: './src/migrations',

  /**
   * https://orm.drizzle.team/kit-docs/config-reference#schema
   */
  schema: './src/schema/index.ts',

  /**
   * https://orm.drizzle.team/kit-docs/config-reference#breakpoints
   */
  breakpoints: false,

  /**
   * https://orm.drizzle.team/kit-docs/config-reference#verbose
   */
  verbose: true,

  /**
   * https://orm.drizzle.team/kit-docs/config-reference#strict
   */
  strict: true,

  /**
   * https://orm.drizzle.team/kit-docs/config-reference#schemafilter
   */
  schemaFilter: ['public', 'auth'],

  /**
   * https://orm.drizzle.team/kit-docs/config-reference#dialect
   */
  dialect: 'postgresql',

  /**
   * https://orm.drizzle.team/kit-docs/config-reference#driver
   */
  dbCredentials: {
    url: process.env.DB_CONNECTION_STRING,
  },
})
