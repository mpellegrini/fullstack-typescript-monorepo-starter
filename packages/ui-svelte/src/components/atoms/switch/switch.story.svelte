<script lang="ts">
  import { logEvent } from 'histoire/client.js'

  import { Label } from '../label/index.js'

  import { Switch } from './index.js'

  import type { Hst as Histoire } from '@histoire/plugin-svelte'

  export let Hst: Histoire
</script>

<Hst.Story title="Atoms/Switch">
  <div class="flex items-center space-x-2">
    <Switch
      includeInput={true}
      name="airplane-mode"
      id="airplane-mode"
      on:click={(event) => logEvent('click', event)}></Switch>
    <Label for="airplane-mode">Airplane Mode</Label>
  </div>
</Hst.Story>
