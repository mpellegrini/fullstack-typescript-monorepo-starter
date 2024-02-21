<script lang="ts">
  import { greetUser } from '@packages/example-pkg'

  import type { PageData } from './$types'

  export let data: PageData

  $: greeting = greetUser(data.user)
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<p>{greeting}</p>
