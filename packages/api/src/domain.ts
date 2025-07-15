import { Schema } from 'effect'

export const TaskId = Schema.UUID.pipe(Schema.brand('TaskId'))
export type TaskId = typeof TaskId.Type

export class Task extends Schema.Class<Task>('Task')({
  id: TaskId,
  done: Schema.Boolean,
  name: Schema.NonEmptyTrimmedString.annotations({
    description: "The task's name",
    examples: ['My First Task'],
  }),
}) {}
