<script lang="ts">
  import type { HTMLTextareaAttributes } from 'svelte/elements'

  import { type WithElementRef, type WithoutChildren, cn } from '../../../utils.js'

  let {
    class: className,
    ref = $bindable(null),
    value = $bindable(),
    ...restProps
  }: WithoutChildren<WithElementRef<HTMLTextareaAttributes>> = $props()
</script>

<textarea
  bind:this={ref}
  class={cn(
    'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 field-sizing-content shadow-xs flex min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
    className,
  )}
  data-slot="textarea"
  bind:value
  {...restProps}>
</textarea>
