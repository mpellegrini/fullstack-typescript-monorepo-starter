<script lang="ts">
  import SuperDebug, { superForm } from 'sveltekit-superforms'
  import { zodClient } from 'sveltekit-superforms/adapters'

  import { signupSchema } from '$lib'

  import type { PageData } from './$types.js'

  export let data: PageData

  const form = superForm(data.form, {
    validators: zodClient(signupSchema),
    validationMethod: 'auto',
  })

  const { form: formData, message, enhance } = form
</script>

{#if $message}<h3>{$message}</h3>{/if}

<form method="POST" novalidate use:enhance>
  <label for="email">Email</label>
  <input type="email" name="email" bind:value={$formData.email} />

  <label for="password">Password</label>
  <input type="password" name="password" bind:value={$formData.password} />

  <label for="password_confirm">Confirm Password</label>
  <input type="password" name="password_confirm" bind:value={$formData.password_confirm} />

  <div class="p-5">
    <button type="submit">Submit</button>
  </div>
</form>

<div class="w-1/2 pt-10">
  <SuperDebug data={$formData} collapsible={true} />
</div>
