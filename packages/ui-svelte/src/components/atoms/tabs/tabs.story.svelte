<script lang="ts">
  import Airplane from 'lucide-svelte/icons/plane'

  import * as Tabs from './index.js'

  import type { Hst as Histoire } from '@histoire/plugin-svelte'

  export let Hst: Histoire
</script>

<Hst.Story title="Atoms/Tabs">
  <div class="pt-6">
    <Tabs.Root value="outbound" class="w-[400px]">
      <Tabs.List class="grid w-full grid-cols-2">
        <Tabs.Trigger value="outbound">Outbound</Tabs.Trigger>
        <Tabs.Trigger value="inbound">Inbound</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="outbound">
        <div class="grid grid-cols-3 grid-rows-2 gap-0 p-4 pb-1">
          <div class="text-left">
            <h4 class="mb-2 text-[20px] font-semibold leading-none tracking-[-0.01em]">Milan</h4>
            <p class="text-muted-foreground text-sm font-medium">06:05</p>
          </div>
          <div class="self-end text-center">
            <p class="text-muted-foreground text-sm font-medium">3h 30m</p>
          </div>
          <div class="text-right">
            <h4 class="mb-2 text-[20px] font-semibold leading-none tracking-[-0.01em]">New York</h4>
            <p class="text-muted-foreground text-sm font-medium">06:05</p>
          </div>
          <div class="relative col-span-3">
            <hr class="border-1 border-border-input relative top-4 h-px border-dashed" />

            <div class="bg-background-alt absolute left-1/2 -translate-x-1/2 p-1">
              <Airplane class="text-muted-foreground size-6 rotate-45" />
            </div>
          </div>
        </div>
      </Tabs.Content>
      <Tabs.Content value="inbound">
        <div class="grid grid-cols-3 grid-rows-2 gap-0 p-4 pb-1">
          <div class="text-left">
            <h4 class="mb-2 text-[20px] font-semibold leading-none tracking-[-0.01em]">New York</h4>
            <p class="text-muted-foreground text-sm font-medium">07:25</p>
          </div>
          <div class="self-end text-center">
            <p class="text-muted-foreground text-sm font-medium">3h 20m</p>
          </div>
          <div class="text-right">
            <h4 class="mb-2 text-[20px] font-semibold leading-none tracking-[-0.01em]">Milan</h4>
            <p class="text-muted-foreground text-sm font-medium">10:45</p>
          </div>
          <div class="relative col-span-3">
            <hr class="border-1 border-border-input relative top-4 h-px border-dashed" />

            <div class="bg-background-alt absolute left-1/2 -translate-x-1/2 p-1">
              <Airplane class="text-muted-foreground size-6 rotate-45" />
            </div>
          </div>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  </div>
</Hst.Story>
