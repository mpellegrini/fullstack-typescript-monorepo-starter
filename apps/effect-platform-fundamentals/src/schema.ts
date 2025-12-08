import * as Schema from 'effect/Schema'
import * as Struct from 'effect/Struct'

export const TodoId = Schema.String.pipe(Schema.brand('TodoId'))

export class Todo extends Schema.Class<Todo>('Todo')({
  id: TodoId,
  completed: Schema.Boolean,
  title: Schema.Trim.pipe(Schema.nonEmptyString()),
}) {}

export class CreateTodoPayload extends Schema.Class<CreateTodoPayload>('CreateTodoPayload')(
  Struct.pick(Todo.fields, 'title'),
) {}
