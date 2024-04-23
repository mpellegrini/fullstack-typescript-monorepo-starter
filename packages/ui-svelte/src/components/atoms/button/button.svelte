<script lang="ts">
  import { Button as ButtonPrimitive } from 'bits-ui'

  import { type ClassValue, cn } from '../../../utils/index.js'

  import { type Events, type Props, type Size, type Variant, buttonVariants } from './index.js'

  type $$Props = Props
  type $$Events = Events

  let className: ClassValue = undefined

  export let variant: Variant = 'default'
  export let size: Size = 'default'
  export let builders: $$Props['builders'] = []
  export { className as class }
</script>

<ButtonPrimitive.Root
  {builders}
  class={cn(buttonVariants({ variant, size, className }))}
  type="button"
  {...$$restProps}
  on:click
  on:keydown>
  <slot />
</ButtonPrimitive.Root>
