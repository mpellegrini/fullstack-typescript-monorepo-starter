// import { type Static, Type } from '@sinclair/typebox'
// import { TypeCompiler } from '@sinclair/typebox/compiler'

export const regExpToString = (pattern: RegExp): string => String(pattern).slice(1, -1)

export const AwsRegionPattern = /(us(-gov)?|ap|ca|cn|eu|sa)-(central|(north|south)?(east|west)?)-\d/
export const AWSAccountIdPattern = /d{12}/

/*
const ContextPropsSchema = Type.Object({
  environment: Type.String(),
  name: Type.String(),
  region: Type.String({
    examples: 'us-east-1',
    pattern: regExpToString(AwsRegionPattern),
  }),
  account: Type.String({
    examples: '123456789012',
    minLength: 12,
    maxLength: 12,
    pattern: regExpToString(AWSAccountIdPattern),
  }),
})

export type ContextProps = Static<typeof ContextPropsSchema>
export const contextPropsValidator = TypeCompiler.Compile(ContextPropsSchema)
*/
