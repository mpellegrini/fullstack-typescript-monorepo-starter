<script lang="ts">
  import { mode } from 'mode-watcher'
  import { type ToasterProps as SonnerProps, Toaster as Sonner } from 'svelte-sonner'

  const { ...restProps }: SonnerProps = $props()
</script>

<Sonner
  style="--normal-bg: var(--color-popover); --normal-text: var(--color-popover-foreground); --normal-border: var(--color-border);"
  class="toaster group"
  theme={mode.current}
  {...restProps} />
