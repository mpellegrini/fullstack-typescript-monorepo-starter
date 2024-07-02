<script lang="ts">
  import SuperDebug, { superForm } from 'sveltekit-superforms'
  import { zodClient } from 'sveltekit-superforms/adapters'

  import { signupSchema } from '$lib/schemas'

  import type { PageData } from './$types.js'

  export let data: PageData

  const form = superForm(data.form, {
    validators: zodClient(signupSchema),
    validationMethod: 'auto',
  })
  const { form: formData, allErrors, errors, constraints, message, enhance } = form
</script>

{#if $message}<h3>{$message}</h3>{/if}

<form method="POST" novalidate use:enhance>
  <label for="email">Email</label>
  <input
    type="email"
    name="email"
    aria-invalid={$errors.email ? 'true' : undefined}
    data-invalid={$errors.email ? 'true' : undefined}
    bind:value={$formData.email}
    {...$constraints.email} />
  {#if $errors.email}<span class="text-red-500">{$errors.email}</span>{/if}

  <label for="password">Password</label>
  <input
    type="password"
    name="password"
    aria-invalid={$errors.password ? 'true' : undefined}
    data-invalid={$errors.password ? 'true' : undefined}
    bind:value={$formData.password}
    {...$constraints.password} />
  {#if $errors.password}<span class="text-red-500">{$errors.password}</span>{/if}

  <label for="password_confirm">Confirm Password</label>
  <input
    type="password"
    name="password_confirm"
    aria-invalid={$errors.password_confirm ? 'true' : undefined}
    data-invalid={$errors.password_confirm ? 'true' : undefined}
    bind:value={$formData.password_confirm}
    {...$constraints.password_confirm} />
  {#if $errors.password_confirm}<span class="text-red-500">{$errors.password_confirm}</span>{/if}

  <div class="p-5">
    <button type="submit" disabled={$allErrors.length > 0}>Submit</button>
  </div>
</form>
<div class="w-1/2 pt-10">
  <SuperDebug data={$formData} collapsible={true} />
</div>
