<script lang="ts">
  import Chat from '$lib/components/chat.svelte'
</script>

<Chat initialMessages={[]} />

<!--
<main>
  <ul>
    {#each chat.messages as message, messageIndex (messageIndex)}
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
  <form onsubmit={handleSubmit}>
    <input bind:value={input} />
    <button type="submit">Send</button>
  </form>
</main>
-->
