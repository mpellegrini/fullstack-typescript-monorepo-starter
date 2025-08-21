<script lang="ts">
  import { ScrollArea as ScrollAreaPrimitive } from 'bits-ui'

  import { type WithoutChild, cn } from '../../../utils.js'

  import { Scrollbar } from './index.js'

  let {
    children,
    class: className,
    orientation = 'vertical',
    ref = $bindable(null),
    scrollbarXClasses = '',
    scrollbarYClasses = '',
    ...restProps
  }: WithoutChild<ScrollAreaPrimitive.RootProps> & {
    orientation?: undefined | 'both' | 'horizontal' | 'vertical'
    scrollbarXClasses?: string | undefined
    scrollbarYClasses?: string | undefined
  } = $props()
</script>

<ScrollAreaPrimitive.Root
  class={cn('relative', className)}
  data-slot="scroll-area"
  bind:ref
  {...restProps}>
  <ScrollAreaPrimitive.Viewport
    class="ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] focus-visible:outline-1 focus-visible:ring-4"
    data-slot="scroll-area-viewport">
    {@render children?.()}
  </ScrollAreaPrimitive.Viewport>
  {#if orientation === 'vertical' || orientation === 'both'}
    <Scrollbar class={scrollbarYClasses} orientation="vertical" />
  {/if}
  {#if orientation === 'horizontal' || orientation === 'both'}
    <Scrollbar class={scrollbarXClasses} orientation="horizontal" />
  {/if}
  <ScrollAreaPrimitive.Corner />
</ScrollAreaPrimitive.Root>
