<script lang="ts">
  import type { Separator as SeparatorPrimitive } from 'bits-ui'

  import { Separator } from '$lib/components/ui/separator/index.js'

  import { cn } from '../../../utils.js'

  let {
    class: className,
    ref = $bindable(null),
    ...restProps
  }: SeparatorPrimitive.RootProps = $props()
</script>

<Separator
  class={cn('bg-border pointer-events-none -mx-1 my-1 h-px', className)}
  data-slot="select-separator"
  bind:ref
  {...restProps} />
