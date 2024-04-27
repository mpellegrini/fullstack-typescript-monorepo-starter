<script lang="ts">
  import { logEvent } from 'histoire/client'
  import BookOpen from 'lucide-svelte/icons/book-open'

  import { Button, type Size, type Variant } from './index.js'

  import type { Hst as Histoire } from '@histoire/plugin-svelte'

  export let Hst: Histoire

  const variantValues: Variant[] = [
    'default',
    'outline',
    'ghost',
    'secondary',
    'destructive',
    'link',
  ]

  const sizeValues: Size[] = ['default', 'lg', 'sm', 'icon']

  let size: Size = 'default'
  let variant: Variant = 'default'
  let text = 'Click Me!'
</script>

<Hst.Story title="Atoms/Button">
  <Button {variant} {size} on:click={(event) => logEvent('click', event)}>
    {#if size === 'icon'}
      <BookOpen />
    {:else}
      {text}
    {/if}
  </Button>

  <svelte:fragment slot="controls">
    <Hst.Text title="Text" bind:value={text} />
    <Hst.Select bind:value={variant} options={variantValues} title="Variant" />
    <Hst.Select bind:value={size} options={sizeValues} title="Size" />
  </svelte:fragment>
</Hst.Story>
