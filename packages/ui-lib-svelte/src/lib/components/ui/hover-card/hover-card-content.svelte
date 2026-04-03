<script lang="ts">
  import type { ComponentProps } from 'svelte'

  import { LinkPreview as HoverCardPrimitive } from 'bits-ui'

  import { type WithoutChildrenOrChild, cn } from '../../../utils.js'

  import HoverCardPortal from './hover-card-portal.svelte'

  let {
    align = 'center',
    class: className,
    portalProps,
    ref = $bindable(null),
    sideOffset = 4,
    ...restProps
  }: HoverCardPrimitive.ContentProps & {
    portalProps?: WithoutChildrenOrChild<ComponentProps<typeof HoverCardPortal>>
  } = $props()
</script>

<HoverCardPortal {...portalProps}>
  <HoverCardPrimitive.Content
    class={cn(
      'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-end-2 data-[side=right]:slide-in-from-start-2 data-[side=top]:slide-in-from-bottom-2 z-50 mt-3 w-64 rounded-md border p-4 shadow-md outline-hidden outline-none',
      className,
    )}
    {align}
    data-slot="hover-card-content"
    {sideOffset}
    bind:ref
    {...restProps} />
</HoverCardPortal>
