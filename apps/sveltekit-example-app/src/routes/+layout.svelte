<script lang="ts">
  import '../app.css'
  import type { LayoutProps } from './$types.js'

  const { children }: LayoutProps = $props()
</script>

{@render children()}
