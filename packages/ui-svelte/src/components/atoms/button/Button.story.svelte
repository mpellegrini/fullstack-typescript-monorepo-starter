<script lang="ts">
  import type { Hst as Histoire } from '@histoire/plugin-svelte'
  import { logEvent } from 'histoire/client'
  import { Button, type Variant, type Size } from './index.js'
  import BookOpen from 'lucide-svelte/icons/book-open'

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

<svelte:component this={Hst.Story} title="Atoms/Button">
  <Button {variant} {size} on:click={(event) => logEvent('click', event)}>
    {#if size === 'icon'}
      <BookOpen />
    {:else}
      {text}
    {/if}
  </Button>

  <svelte:fragment slot="controls">
    <svelte:component this={Hst.Text} title="Text" bind:value={text} />
    <svelte:component
      this={Hst.Select}
      bind:value={variant}
      options={variantValues}
      title="Variant" />
    <svelte:component this={Hst.Select} bind:value={size} options={sizeValues} title="Size" />
  </svelte:fragment>
</svelte:component>
