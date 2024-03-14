<script lang="ts">
  import { greetUser } from '@packages/example-pkg'

  import type { PageData } from './$types'

  export let data: PageData

  $: greeting = greetUser(data.user)
</script>

<div class="space-y-1">
  <h1 class="text-4xl">Welcome to SvelteKit</h1>
  <p>
    Visit <a class="text-blue-600 hover:underline" href="https://kit.svelte.dev">kit.svelte.dev</a> to
    read the documentation
  </p>
  <p class="text-2xl">{greeting}</p>
</div>
