<script lang="ts">
  import ChevronUpIcon from '@lucide/svelte/icons/chevron-up'
  import { Select as SelectPrimitive } from 'bits-ui'

  import { type WithoutChildrenOrChild, cn } from '../../../utils.js'

  let {
    class: className,
    ref = $bindable(null),
    ...restProps
  }: WithoutChildrenOrChild<SelectPrimitive.ScrollUpButtonProps> = $props()
</script>

<SelectPrimitive.ScrollUpButton
  class={cn('flex cursor-default items-center justify-center py-1', className)}
  data-slot="select-scroll-up-button"
  bind:ref
  {...restProps}>
  <ChevronUpIcon class="size-4" />
</SelectPrimitive.ScrollUpButton>
