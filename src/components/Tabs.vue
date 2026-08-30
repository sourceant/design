<script setup lang="ts">
import { cn } from '../lib/utils'

/** One of a few, shown all at once.
 *
 * The same control as a graph's layout switcher and the source switcher beside
 * it, which had been two spellings of one thing.
 */

interface Tab {
  id: string
  label: string
}

interface Props {
  modelValue: string
  tabs: Tab[]
  /** A name for whoever is not looking at it. */
  label?: string
  class?: string
}

const props = defineProps<Props>()
defineEmits<{ 'update:modelValue': [string] }>()
</script>

<template>
  <div
    role="group"
    :aria-label="label"
    :class="cn('inline-flex rounded-md border bg-card p-0.5', props.class)"
  >
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      :aria-pressed="modelValue === tab.id"
      :class="cn(
        'rounded px-3 py-1 text-xs font-medium transition-colors',
        modelValue === tab.id
          ? 'bg-primary/15 text-primary'
          : 'text-muted-foreground hover:text-foreground',
      )"
      @click="$emit('update:modelValue', tab.id)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>
