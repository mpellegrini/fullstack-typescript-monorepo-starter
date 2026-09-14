import * as Schema from 'effect/Schema'
import * as SchemaTransformation from 'effect/SchemaTransformation'
import * as Struct from 'effect/Struct'

/**
 * Decodes a string by trimming leading/trailing whitespace, then requires at least
 * one character to remain.
 *
 * Note: the check is declared on both sides of the transformation on purpose.
 *       The decoded side ("trimmed and non-empty") is the invariant that matters,
 *       but JSON Schema — and therefore the generated OpenAPI document — is derived
 *       from the encoded side, so repeating the check there is what surfaces
 *       `minLength: 1` to API consumers.
 */
const NonEmptyTrimmedString = Schema.NonEmptyString.pipe(
  Schema.decodeTo(Schema.NonEmptyString.check(Schema.isTrimmed()), SchemaTransformation.trim()),
)

export const TaskId = Schema.String.check(Schema.isUUID()).pipe(Schema.brand('TaskId'))
export type TaskId = typeof TaskId.Type

export class Task extends Schema.Class<Task>('Task')({
  id: TaskId,
  done: Schema.Boolean,
  title: NonEmptyTrimmedString.pipe(
    Schema.annotateEncoded({
      description: "The task's name",
      examples: ['My First Task'],
    }),
  ),
}) {}

export class CreateTaskPayload extends Schema.Class<CreateTaskPayload>('CreateTaskPayload')(
  Struct.pick(Task.fields, ['title']),
) {}

export class BuildInfo extends Schema.Class<BuildInfo>('Info')({
  appName: Schema.String.annotate({
    description: 'Name of the running service',
    examples: ['effect-api-server'],
  }),
  buildDate: Schema.String.annotate({
    description: 'ISO-8601 UTC timestamp of when the service was built',
    examples: ['2025-07-25T12:30:18Z'],
  }),
  vcsRef: Schema.String.annotate({
    description: 'Version control reference (e.g. commit SHA) the service was built from',
    examples: ['a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2'],
  }),
  version: Schema.String.annotate({
    description: 'Version of the running service',
    examples: ['sha-a1b2c3d4e5f6'],
  }),
}) {}
