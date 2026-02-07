<script lang="ts">
  import { Select as SelectPrimitive } from 'bits-ui'

  // eslint-disable-next-line no-useless-assignment -- keep conistent with shadcn
  let { ref = $bindable(null), ...restProps }: SelectPrimitive.GroupProps = $props()
</script>

<SelectPrimitive.Group data-slot="select-group" {...restProps} />
