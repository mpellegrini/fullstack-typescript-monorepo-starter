<script lang="ts">
  import SuperDebug, { superForm } from 'sveltekit-superforms'
  import { zodClient } from 'sveltekit-superforms/adapters'

  import { signupSchema } from '$lib/schemas/index.js'

  import type { PageData } from './$types'

  export let data: PageData

  const form = superForm(data.form, {
    validators: zodClient(signupSchema),
    validationMethod: 'auto',
  })
  const { form: formData, allErrors, errors, constraints, message, enhance } = form
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-100">
  <div class="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
    <h2 class="mb-6 text-center text-2xl font-bold">Create Your Account</h2>
    {#if $message}<h3 class="text-lg">{$message}</h3>{/if}

    <form class="space-y-6" method="POST" novalidate use:enhance>
      <div>
        <label class="block" for="email">Email</label>
        <div class="mt-2">
          <input
            type="email"
            name="email"
            aria-invalid={$errors.email ? 'true' : undefined}
            data-invalid={$errors.email ? 'true' : undefined}
            bind:value={$formData.email}
            {...$constraints.email}
            class="block w-full border py-1.5" />

          {#if $errors.email}<span class="text-red-500">{$errors.email}</span>{/if}
        </div>
      </div>
      <div>
        <label class="block" for="password">Password</label>
        <div class="mt-2">
          <input
            type="password"
            name="password"
            aria-invalid={$errors.password ? 'true' : undefined}
            data-invalid={$errors.password ? 'true' : undefined}
            bind:value={$formData.password}
            {...$constraints.password}
            class="block w-full border py-1.5" />
          {#if $errors.password}<span class="text-red-500">{$errors.password}</span>{/if}
        </div>
      </div>
      <div>
        <label for="password_confirm">Confirm Password</label>
        <div class="mt-2">
          <input
            type="password"
            name="password_confirm"
            aria-invalid={$errors.password_confirm ? 'true' : undefined}
            data-invalid={$errors.password_confirm ? 'true' : undefined}
            bind:value={$formData.password_confirm}
            {...$constraints.password_confirm}
            class="block w-full border py-1.5" />
          {#if $errors.password_confirm}<span class="text-red-500">{$errors.password_confirm}</span
            >{/if}
        </div>
      </div>

      <button
        type="submit"
        class="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        disabled={$allErrors.length > 0}>
        Sign Up
      </button>
    </form>
    <div class="pt-10">
      <SuperDebug data={$formData} collapsible={true} />
    </div>
  </div>
</div>
