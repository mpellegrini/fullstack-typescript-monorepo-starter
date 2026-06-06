<script lang="ts">
  import type { UIMessage } from 'ai'

  import { Chat } from '@ai-sdk/svelte'
  import { toast } from 'svelte-sonner'

  import ChatHeader from '$lib/components/chat-header.svelte'
  import Messages from '$lib/components/messages.svelte'

  const {
    initialMessages,
  }: {
    initialMessages: UIMessage[]
  } = $props()

  const chatClient = new Chat({
    id: undefined,
    messages: initialMessages,
    onError: (error) => {
      console.log(error.message)
      try {
        // If there's an API error, its message will be JSON-formatted
        const jsonError = JSON.parse(error.message) as unknown
        if (
          typeof jsonError === 'object' &&
          jsonError !== null &&
          'message' in jsonError &&
          typeof jsonError.message === 'string'
        ) {
          toast.error(jsonError.message)
        } else {
          toast.error(error.message)
        }
      } catch {
        toast.error(error.message)
      }
    },
    onFinish: ({ message }) => {
      console.log(message)
    },
  })

  let input = $state('')

  const handleSubmit = (event: SubmitEvent): void => {
    event.preventDefault()
    void chatClient.sendMessage({ text: input })
    input = ''
  }
</script>

<div class="bg-background flex h-dvh min-w-0 flex-col">
  <ChatHeader />
  <Messages
    loading={chatClient.status === 'streaming' || chatClient.status === 'submitted'}
    messages={chatClient.messages} />

  <!-- todo: need to replace with component -->
  <form onsubmit={handleSubmit}>
    <input bind:value={input} />
    <button type="submit">Send</button>
  </form>
</div>
