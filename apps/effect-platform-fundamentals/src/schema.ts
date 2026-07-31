import * as Schema from 'effect/Schema'
import * as SchemaTransformation from 'effect/SchemaTransformation'
import * as Struct from 'effect/Struct'

export const TodoId = Schema.String.pipe(Schema.brand('TodoId'))

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
export const NonEmptyTrimmedString = Schema.NonEmptyString.pipe(
  Schema.decodeTo(Schema.NonEmptyString.check(Schema.isTrimmed()), SchemaTransformation.trim()),
).annotate({ identifier: 'NonEmptyTrimmedString' })

export class Todo extends Schema.Class<Todo>('Todo')({
  id: TodoId,
  completed: Schema.Boolean,
  title: NonEmptyTrimmedString,
}) {}

export class CreateTodoPayload extends Schema.Class<CreateTodoPayload>('CreateTodoPayload')(
  Struct.pick(Todo.fields, ['title']),
) {}
