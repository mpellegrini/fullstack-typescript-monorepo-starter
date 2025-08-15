<script lang="ts">
  import { Avatar as AvatarPrimitive } from 'bits-ui'

  import { cn } from '../../../utils.js'

  let {
    class: className,
    ref = $bindable(null),
    ...restProps
  }: AvatarPrimitive.ImageProps = $props()
</script>

<AvatarPrimitive.Image
  class={cn('aspect-square size-full', className)}
  data-slot="avatar-image"
  bind:ref
  {...restProps} />
