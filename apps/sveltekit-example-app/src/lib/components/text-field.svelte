<script lang="ts" generics="T extends Record<string, unknown>">
  import { type FormPathLeaves, type SuperForm, formFieldProxy } from 'sveltekit-superforms'

  export let form: SuperForm<T>
  export let field: FormPathLeaves<T>

  const { value, errors, constraints } = formFieldProxy(form, field)
</script>

<label>
  {field}<br />
  <input
    name={field}
    type="email"
    aria-invalid={$errors ? 'true' : undefined}
    bind:value={$value}
    {...$constraints}
    {...$$restProps} />
</label>
{#if $errors}<span class="invalid">{$errors}</span>{/if}
