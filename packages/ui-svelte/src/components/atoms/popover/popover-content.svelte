<script lang="ts">
  import { Popover as PopoverPrimitive } from 'bits-ui'

  import { type ClassValue, cn, flyAndScale } from '../../../utils/index.js'

  type $$Props = PopoverPrimitive.ContentProps
  let className: ClassValue = undefined
  export let transition: $$Props['transition'] = flyAndScale
  export let transitionConfig: $$Props['transitionConfig'] = undefined
  export { className as class }
</script>

<PopoverPrimitive.Content
  {transition}
  {transitionConfig}
  class={cn(
    'bg-popover text-popover-foreground z-50 w-72 rounded-md border p-4 shadow-md outline-none',
    className,
  )}
  {...$$restProps}>
  <slot />
</PopoverPrimitive.Content>
