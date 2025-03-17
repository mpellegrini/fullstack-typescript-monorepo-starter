import { defineRelations } from 'drizzle-orm'

import * as schema from './index.js'

export const relations = defineRelations(schema, (r) => ({
  sessionsTable: {
    user: r.one.usersTable({
      from: r.sessionsTable.userId,
      to: r.usersTable.id,
    }),
  },
  usersTable: {
    sessions: r.many.sessionsTable(),
  },
}))
