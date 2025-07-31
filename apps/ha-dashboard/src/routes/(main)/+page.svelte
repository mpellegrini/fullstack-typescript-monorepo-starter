<script lang="ts">
  import type { PageProps } from './$types'

  const { data }: PageProps = $props()
</script>

<div class="space-y-1">
  <h1 class="text-4xl">Welcome to HA Dashboard</h1>

  <a href={data.signInUrl} rel="noopener noreferrer" target="_self">Sign In</a>
</div>
