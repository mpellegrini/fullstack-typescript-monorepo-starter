import { defineRelations } from 'drizzle-orm'

import * as schema from './index.js'

export const relations = defineRelations(schema, (r) => ({
  userAccountsTable: {
    userSessions: r.many.userSessionsTable(),
  },
  userSessionsTable: {
    userAccount: r.one.userAccountsTable({
      from: r.userSessionsTable.userId,
      to: r.userAccountsTable.id,
    }),
  },
}))
