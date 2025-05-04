<script lang="ts">
  import '../app.css'

  import { ModeWatcher } from 'mode-watcher'

  import type { LayoutProps } from './$types.js'

  const { children }: LayoutProps = $props()
</script>

<ModeWatcher />
{@render children()}
