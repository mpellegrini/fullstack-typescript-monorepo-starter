import { Schema } from 'effect'

export const SignUpFormSchema = Schema.Struct({
  confirmPassword: Schema.NonEmptyTrimmedString,
  password: Schema.NonEmptyTrimmedString,
  username: Schema.NonEmptyTrimmedString,
}).pipe(
  Schema.filter(
    (input) =>
      input.password === input.confirmPassword
        ? undefined
        : {
            message: 'Passwords do not match',
            path: ['confirmPassword'],
          },
    { jsonSchema: {} },
  ),
)
