<script lang="ts">
  import { Tooltip as TooltipPrimitive } from 'bits-ui'

  const { ...restProps }: TooltipPrimitive.ProviderProps = $props()
</script>

<TooltipPrimitive.Provider {...restProps} />
