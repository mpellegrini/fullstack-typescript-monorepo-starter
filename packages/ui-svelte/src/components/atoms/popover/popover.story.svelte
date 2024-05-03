<script lang="ts">
  import { Button } from '../button/index.js'
  import { Input } from '../input/index.js'
  import { Label } from '../label/index.js'

  import { Popover, PopoverContent, PopoverTrigger } from './index.js'

  import type { Hst as Histoire } from '@histoire/plugin-svelte'

  export let Hst: Histoire
</script>

<Hst.Story title="Atoms/Popover">
  <Popover portal="null">
    <PopoverTrigger asChild let:builder>
      <Button builders={[builder]} variant="outline">Open</Button>
    </PopoverTrigger>
    <PopoverContent class="w-80">
      <div class="grid gap-4">
        <div class="space-y-2">
          <h4 class="font-medium leading-none">Dimensions</h4>
          <p class="text-muted-foreground text-sm">Set the dimensions for the layer.</p>
        </div>
        <div class="grid gap-2">
          <div class="grid grid-cols-3 items-center gap-4">
            <Label for="width">Width</Label>
            <Input id="width" value="100%" class="col-span-2 h-8" />
          </div>
          <div class="grid grid-cols-3 items-center gap-4">
            <Label for="height">Height</Label>
            <Input id="height" value="25px" class="col-span-2 h-8" />
          </div>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</Hst.Story>
