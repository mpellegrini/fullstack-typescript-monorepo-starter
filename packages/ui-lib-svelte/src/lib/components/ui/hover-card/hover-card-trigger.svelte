<script lang="ts">
  import { LinkPreview as HoverCardPrimitive } from 'bits-ui'

  let { ref = $bindable(null), ...restProps }: HoverCardPrimitive.TriggerProps = $props()
</script>

<HoverCardPrimitive.Trigger data-slot="hover-card-trigger" bind:ref {...restProps} />
