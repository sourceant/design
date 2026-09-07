<script setup lang="ts">
import type { Component } from 'vue'
import { cn } from '../lib/utils'

/** One of a few, shown all at once.
 *
 * The same control as a graph's layout switcher and the source switcher beside
 * it, which had been two spellings of one thing.
 *
 * A tab can carry an icon, and can be turned off. Both are here because leaving
 * them out is what kept applications writing the strip by hand: a switcher whose
 * options are not all available has to say so on the option, and a reader
 * scanning a row of five words finds the one they want by its mark first.
 */

interface Tab {
  id: string
  label: string
  /** Drawn before the label. The component itself, not its name. */
  icon?: Component
  /** What it does, or why it cannot be picked. */
  title?: string
  /** How many are behind it. Shown quieter than the label, as Section does. */
  count?: number
  /** Present but not available, rather than absent. */
  disabled?: boolean
}

interface Props {
  modelValue: string
  tabs: Tab[]
  /** A name for whoever is not looking at it. */
  label?: string
  /**
   * How much room the strip is given. `lg` stands beside a page title, `default`
   * sits in a panel header, `sm` is small enough to live inside a caption.
   */
  size?: 'sm' | 'default' | 'lg'
  class?: string
}

const props = withDefaults(defineProps<Props>(), { size: 'default' })
defineEmits<{ 'update:modelValue': [string] }>()

const sizes = {
  sm: 'gap-1 px-1.5 py-0.5 text-[10px]',
  default: 'gap-1.5 px-2.5 py-1 text-xs',
  lg: 'gap-2 px-3 py-1 text-sm',
}
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
      :disabled="tab.disabled"
      :title="tab.title"
      :class="cn(
        'inline-flex shrink-0 items-center rounded font-medium transition-colors disabled:pointer-events-none disabled:opacity-40',
        sizes[size],
        modelValue === tab.id
          ? 'bg-primary/15 text-primary'
          : 'text-muted-foreground hover:text-foreground',
      )"
      @click="$emit('update:modelValue', tab.id)"
    >
      <component :is="tab.icon" v-if="tab.icon" :class="size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'" />
      {{ tab.label }}
      <span v-if="tab.count" class="opacity-60">{{ tab.count }}</span>
    </button>
  </div>
</template>
