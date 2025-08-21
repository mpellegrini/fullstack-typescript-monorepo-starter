<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  import { type WithElementRef, cn } from '../../../utils.js'

  let {
    children,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {} = $props()
</script>

<div
  bind:this={ref}
  class={cn('text-muted-foreground px-2 py-1.5 text-xs', className)}
  data-slot="select-label"
  {...restProps}>
  {@render children?.()}
</div>
