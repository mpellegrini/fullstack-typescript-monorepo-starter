<script lang="ts">
  import SuperDebug, { superForm } from 'sveltekit-superforms'
  import { zodClient } from 'sveltekit-superforms/adapters'

  import { schema } from '$lib'
  import { Button } from '@packages/ui-svelte/atoms/button'

  import type { PageData } from './$types.js'

  export let data: PageData

  const { form, message, errors, constraints, enhance } = superForm(data.form, {
    validators: zodClient(schema),
    validationMethod: 'auto',
  })
</script>

{#if $message}<h3>{$message}</h3>{/if}

<form method="POST" novalidate use:enhance>
  <label for="email">Email</label>
  <input
    name="email"
    type="email"
    aria-invalid={$errors.email ? 'true' : undefined}
    bind:value={$form.email}
    {...$constraints.email} />

  {#if $errors.email}<span class="text-destructive">{$errors.email}</span>{/if}

  <label for="password">Password</label>
  <input
    name="password"
    type="password"
    aria-invalid={$errors.password ? 'true' : undefined}
    bind:value={$form.password}
    {...$constraints.password} />
  {#if $errors.password}<span class="text-destructive">{$errors.password}</span>{/if}

  <label for="password-confirm">Password</label>
  <input
    name="password_confirm"
    type="password"
    aria-invalid={$errors.password_confirm ? 'true' : undefined}
    bind:value={$form.password_confirm}
    {...$constraints.password_confirm} />
  {#if $errors.password_confirm}
    <span class="text-destructive">{$errors.password_confirm}</span>
  {/if}
  <div>
    <Button type="submit" variant="default" size="default">Submit</Button>
  </div>
</form>

<div class="w-1/2 pt-10">
  <SuperDebug data={$form} collapsible={true} />
</div>
