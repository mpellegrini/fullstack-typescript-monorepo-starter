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

export class BuildInfo extends Schema.Class<BuildInfo>('Info')({
  appName: Schema.String.annotations({
    description: 'Name of the running service',
    examples: ['effect-api-server'],
  }),
  buildDate: Schema.String.annotations({
    description: 'ISO-8601 UTC timestamp of when the service was built',
    examples: ['2025-07-25T12:30:18Z'],
  }),
  vcsRef: Schema.String.annotations({
    description: 'Version control reference (e.g. commit SHA) the service was built from',
    examples: ['a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2'],
  }),
  version: Schema.String.annotations({
    description: 'Version of the running service',
    examples: ['sha-a1b2c3d4e5f6'],
  }),
}) {}
