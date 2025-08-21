<script lang="ts">
  import { LinkPreview as HoverCardPrimitive } from 'bits-ui'

  import { cn } from '../../../utils.js'

  let {
    align = 'center',
    class: className,
    portalProps,
    ref = $bindable(null),
    sideOffset = 4,
    ...restProps
  }: HoverCardPrimitive.ContentProps & {
    portalProps?: HoverCardPrimitive.PortalProps
  } = $props()
</script>

<HoverCardPrimitive.Portal {...portalProps}>
  <HoverCardPrimitive.Content
    class={cn(
      'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 outline-hidden z-50 mt-3 w-64 rounded-md border p-4 shadow-md outline-none',
      className,
    )}
    {align}
    data-slot="hover-card-content"
    {sideOffset}
    bind:ref
    {...restProps} />
</HoverCardPrimitive.Portal>
