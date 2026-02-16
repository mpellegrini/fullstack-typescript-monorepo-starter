<script lang="ts">
  import { callService } from '$lib/client/ha-services'
  import { destroyEntityState, getEntityState, initEntityState } from '$lib/client/ha-state.svelte'
  import type { HassEntity } from '$lib/types/ha'

  import type { PageProps } from './$types'

  const { data }: PageProps = $props()

  const state = getEntityState()

  $effect(() => {
    initEntityState(data.entities)
    return destroyEntityState
  })

  const lights = $derived(
    Object.values(state.entities).filter((e: HassEntity) => e.entity_id.startsWith('light.')),
  )

  const sensors = $derived(
    Object.values(state.entities).filter((e: HassEntity) => e.entity_id.startsWith('sensor.')),
  )

  const switches = $derived(
    Object.values(state.entities).filter((e: HassEntity) => e.entity_id.startsWith('switch.')),
  )

  const toggleEntity = async (entity: HassEntity): Promise<void> => {
    const domain = entity.entity_id.split('.')[0] ?? ''
    await callService({
      domain,
      service: 'toggle',
      target: { entity_id: entity.entity_id },
    })
  }

  const friendlyName = (entity: HassEntity): string =>
    entity.attributes['friendly_name'] ?? entity.entity_id
</script>

<div class="space-y-6 p-4">
  <div class="flex items-center gap-2">
    <h1 class="text-3xl font-bold">Dashboard</h1>
    <span
      class="inline-block h-3 w-3 rounded-full {state.connected ? 'bg-green-500' : 'bg-red-500'}"
      title={state.connected ? 'Connected' : 'Disconnected'}></span>
  </div>

  {#if Object.keys(state.entities).length === 0}
    <p class="text-muted-foreground">
      No entities available. Check your Home Assistant connection.
    </p>
  {:else}
    {#if lights.length > 0}
      <section>
        <h2 class="mb-3 text-xl font-semibold">Lights</h2>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {#each lights as light (light.entity_id)}
            <button
              class="hover:bg-accent rounded-lg border p-4 text-left transition-colors"
              onclick={() => toggleEntity(light)}>
              <div class="font-medium">{friendlyName(light)}</div>
              <div class="text-muted-foreground text-sm capitalize">{light.state}</div>
            </button>
          {/each}
        </div>
      </section>
    {/if}

    {#if sensors.length > 0}
      <section>
        <h2 class="mb-3 text-xl font-semibold">Sensors</h2>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {#each sensors as sensor (sensor.entity_id)}
            <div class="rounded-lg border p-4">
              <div class="font-medium">{friendlyName(sensor)}</div>
              <div class="text-muted-foreground text-sm">
                {sensor.state}{sensor.attributes['unit_of_measurement']
                  ? ` ${sensor.attributes['unit_of_measurement']}`
                  : ''}
              </div>
            </div>
          {/each}
        </div>
      </section>
    {/if}

    {#if switches.length > 0}
      <section>
        <h2 class="mb-3 text-xl font-semibold">Switches</h2>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {#each switches as sw (sw.entity_id)}
            <button
              class="hover:bg-accent rounded-lg border p-4 text-left transition-colors"
              onclick={() => toggleEntity(sw)}>
              <div class="font-medium">{friendlyName(sw)}</div>
              <div class="text-muted-foreground text-sm capitalize">{sw.state}</div>
            </button>
          {/each}
        </div>
      </section>
    {/if}
  {/if}
</div>
