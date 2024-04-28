<script lang="ts">
  import { AlertDialog as AlertDialogPrimitive } from 'bits-ui'

  import { cn } from '../../../utils/index.js'
  import { buttonVariants } from '../button/index.js'

  type $$Props = AlertDialogPrimitive.ActionProps
  type $$Events = AlertDialogPrimitive.ActionEvents

  let className: $$Props['class'] = undefined
  export { className as class }
</script>

<AlertDialogPrimitive.Action
  class={cn(buttonVariants(), className)}
  {...$$restProps}
  on:click
  on:keydown
  let:builder>
  <slot {builder} />
</AlertDialogPrimitive.Action>
