<script lang="ts">
  const { data } = $props()
</script>

<div class="space-y-1">
  <h1 class="text-4xl">Welcome to SvelteKit</h1>
  <p>
    Visit <a class="text-blue-600 hover:underline" href="https://kit.svelte.dev">kit.svelte.dev</a> to
    read the documentation
  </p>
  <p>Your are logged in as <span class="text-blue-600">{data.authedUser?.username}</span></p>
</div>
