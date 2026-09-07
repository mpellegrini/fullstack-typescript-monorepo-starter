import { Schema } from 'effect'

const NonEmptyTrimmedString = Schema.String.check(Schema.isNonEmpty(), Schema.isTrimmed())

export const SignUpFormSchema = Schema.Struct({
  confirmPassword: NonEmptyTrimmedString,
  password: NonEmptyTrimmedString,
  username: NonEmptyTrimmedString,
}).check(
  Schema.makeFilter((input) =>
    input.password === input.confirmPassword
      ? undefined
      : {
          issue: 'Passwords do not match',
          path: ['confirmPassword'],
        },
  ),
)
