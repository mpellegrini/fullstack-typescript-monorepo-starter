<script lang="ts">
  import CheckIcon from '@lucide/svelte/icons/check'
  import { Select as SelectPrimitive } from 'bits-ui'

  import { type WithoutChild, cn } from '../../../utils.js'

  let {
    children: childrenProp,
    class: className,
    label,
    ref = $bindable(null),
    value,
    ...restProps
  }: WithoutChild<SelectPrimitive.ItemProps> = $props()
</script>

<SelectPrimitive.Item
  class={cn(
    "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
    className,
  )}
  data-slot="select-item"
  {value}
  bind:ref
  {...restProps}>
  {#snippet children({ highlighted, selected })}
    <span class="absolute right-2 flex size-3.5 items-center justify-center">
      {#if selected}
        <CheckIcon class="size-4" />
      {/if}
    </span>
    {#if childrenProp}
      {@render childrenProp({
        /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- false positive */
        highlighted,
        /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- false positive */
        selected,
      })}
    {:else}
      {label ?? value}
    {/if}
  {/snippet}
</SelectPrimitive.Item>
