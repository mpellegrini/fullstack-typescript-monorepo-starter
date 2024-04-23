<script lang="ts" generics="T extends Record<string, unknown>">
  import * as FormPrimitive from 'formsnap'

  import { cn } from '../../../utils/index.js'

  import type { FormPath, SuperForm } from 'sveltekit-superforms'

  type U = FormPath<T>

  type $$Props = FormPrimitive.FieldsetProps<T, U>

  export let form: SuperForm<T>
  export let name: U

  let className: $$Props['class'] = undefined
  export { className as class }
</script>

<FormPrimitive.Fieldset
  {form}
  {name}
  let:constraints
  let:errors
  let:tainted
  let:value
  class={cn('space-y-2', className)}>
  <slot {constraints} {errors} {tainted} {value} />
</FormPrimitive.Fieldset>
