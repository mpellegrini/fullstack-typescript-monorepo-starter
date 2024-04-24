<script lang="ts">
  import SuperDebug, { superForm } from 'sveltekit-superforms'
  import { zodClient } from 'sveltekit-superforms/adapters'

  import { schema } from '$lib'
  import {
    FormButton,
    FormControl,
    FormField,
    FormFieldErrors,
    FormLabel,
    Input,
  } from '@packages/ui-svelte'

  import type { PageData } from './$types.js'

  export let data: PageData

  const form = superForm(data.form, {
    validators: zodClient(schema),
    validationMethod: 'auto',
  })

  const { form: formData, message, enhance } = form
</script>

{#if $message}<h3>{$message}</h3>{/if}

<form method="POST" novalidate use:enhance>
  <FormField {form} name="email">
    <FormControl let:attrs>
      <FormLabel>Email</FormLabel>
      <Input {...attrs} bind:value={$formData.email} />
    </FormControl>
    <FormFieldErrors />
  </FormField>

  <FormField {form} name="password">
    <FormControl let:attrs>
      <FormLabel>Password</FormLabel>
      <Input type="password" {...attrs} bind:value={$formData.password} />
    </FormControl>
    <FormFieldErrors />
  </FormField>

  <FormField {form} name="password_confirm">
    <FormControl let:attrs>
      <FormLabel>Confirm Password</FormLabel>
      <Input type="password" {...attrs} bind:value={$formData.password_confirm} />
    </FormControl>
    <FormFieldErrors />
  </FormField>
  <div class="p-5">
    <FormButton>Submit</FormButton>
  </div>
</form>

<div class="w-1/2 pt-10">
  <SuperDebug data={$formData} collapsible={true} />
</div>
