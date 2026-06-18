<script lang="ts">
  import type { UIMessage } from 'ai'

  const {
    loading,
    messages,
  }: {
    loading: boolean
    messages: UIMessage[]
  } = $props()
</script>

<p>Loading: {loading}</p>
<div class="flex min-w-0 flex-1 flex-col gap-6 overflow-y-scroll pt-4">
  <ul>
    {#each messages as message, messageIndex (messageIndex)}
      <li>
        <div>{message.role}</div>
        <div>
          {#each message.parts as part, partIndex (partIndex)}
            {#if part.type === 'text'}
              <div>{part.text}</div>
            {:else if part.type === 'tool-weather' || part.type === 'tool-convertFahrenheitToCelsius'}
              <pre>{JSON.stringify(part, null, 2)}</pre>
            {/if}
          {/each}
        </div>
      </li>
    {/each}
  </ul>
</div>
