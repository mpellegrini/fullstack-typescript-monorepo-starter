import * as pg from 'drizzle-orm/pg-core'
import * as DateTime from 'effect/DateTime'
import { constant } from 'effect/Function'

const utcNow = constant(DateTime.toDateUtc(DateTime.unsafeNow()))

export const todosTables = pg.pgTable('todos', {
  id: pg.uuid().primaryKey().defaultRandom(),
  completed: pg.boolean().notNull().default(false),
  createdAt: pg.timestamp({ withTimezone: true }).notNull().defaultNow(),
  title: pg.text().notNull(),
  updatedAt: pg.timestamp({ withTimezone: true }).notNull().defaultNow().$onUpdate(utcNow),
})

export type Todo = typeof todosTables.$inferSelect
