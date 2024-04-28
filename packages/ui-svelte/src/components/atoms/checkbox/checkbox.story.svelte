<script lang="ts">
  import { Label } from '../label/index.js'

  import { Checkbox } from './index.js'

  import type { Hst as Histoire } from '@histoire/plugin-svelte'

  export let Hst: Histoire

  let checked: boolean
</script>

<Hst.Story title="Atoms/Checkbox">
  <div class="flex items-center space-x-2">
    <Checkbox id="terms" bind:checked aria-labelledby="terms-label" />
    <Label id="terms-label" for="terms" class="text-sm leading-none">
      Accept terms and conditions
    </Label>
  </div>
</Hst.Story>
