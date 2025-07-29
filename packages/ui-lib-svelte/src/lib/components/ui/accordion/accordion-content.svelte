<script lang="ts">
  import { Accordion as AccordionPrimitive } from 'bits-ui'

  import { type WithoutChild, cn } from '../../../utils.js'

  let {
    children,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: WithoutChild<AccordionPrimitive.ContentProps> = $props()
</script>

<AccordionPrimitive.Content
  class="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
  data-slot="accordion-content"
  bind:ref
  {...restProps}>
  <div class={cn('pb-4 pt-0', className)}>
    {@render children?.()}
  </div>
</AccordionPrimitive.Content>
