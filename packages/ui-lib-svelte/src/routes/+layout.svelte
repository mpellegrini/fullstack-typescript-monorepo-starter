<script lang="ts">
  import '../app.css'
  import type { Snippet } from 'svelte'

  import favicon from '$lib/assets/favicon.svg'

  const { children }: { children: Snippet } = $props()
</script>

<svelte:head><link href={favicon} rel="icon" /></svelte:head>

{@render children()}
