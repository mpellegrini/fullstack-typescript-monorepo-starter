<script lang="ts">
  import { Button } from '@packages/ui-lib-svelte/components/ui/button'

  import type { PageProps } from './$types'

  const { data }: PageProps = $props()

  const signIn = (): void => {
    globalThis.location.assign(data.signInUrl)
  }
</script>

<div class="space-y-1">
  <h1 class="text-4xl">Welcome to HA Dashboard</h1>
  <Button onclick={signIn} variant="link">Sign In</Button>
</div>
