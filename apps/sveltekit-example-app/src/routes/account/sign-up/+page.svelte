<script lang="ts">
  import SuperDebug, { superForm } from 'sveltekit-superforms'
  import { zodClient } from 'sveltekit-superforms/adapters'

  import { signupSchema } from '$lib/schemas/index.js'

  const { data } = $props()

  const form = superForm(data.form, {
    validationMethod: 'auto',
    validators: zodClient(signupSchema),
  })
  const { allErrors, constraints, enhance, errors, form: formData, message } = form
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-100">
  <div class="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
    <h2 class="mb-6 text-center text-2xl font-bold">Create Your Account</h2>
    {#if $message}<h3 class="text-lg">{$message}</h3>{/if}

    <form class="space-y-6" method="POST" novalidate use:enhance>
      <div>
        <label class="block" for="username">Email</label>
        <div class="mt-2">
          <input
            name="username"
            aria-invalid={$errors.username ? 'true' : undefined}
            data-invalid={$errors.username ? 'true' : undefined}
            type="email"
            bind:value={$formData.username}
            {...$constraints.username}
            class="block w-full border py-1.5" />

          {#if $errors.username}<span class="text-red-500">{$errors.username}</span>{/if}
        </div>
      </div>
      <div>
        <label class="block" for="password">Password</label>
        <div class="mt-2">
          <input
            name="password"
            aria-invalid={$errors.password ? 'true' : undefined}
            data-invalid={$errors.password ? 'true' : undefined}
            type="password"
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
            name="password_confirm"
            aria-invalid={$errors.password_confirm ? 'true' : undefined}
            data-invalid={$errors.password_confirm ? 'true' : undefined}
            type="password"
            bind:value={$formData.password_confirm}
            {...$constraints.password_confirm}
            class="block w-full border py-1.5" />
          {#if $errors.password_confirm}<span class="text-red-500">{$errors.password_confirm}</span
            >{/if}
        </div>
      </div>

      <button
        class="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        disabled={$allErrors.length > 0}
        type="submit">
        Sign Up
      </button>
    </form>
    <div class="pt-10">
      <SuperDebug collapsible={true} data={$formData} />
    </div>
  </div>
</div>
