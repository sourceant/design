<script setup lang="ts">
import { cn } from '../lib/utils'

/** One thing's state, in the smallest mark that can carry it.
 *
 * Small enough to sit inside a line of code without moving it, which is what a
 * badge cannot do: a word in a box next to a diff line pushes the line and
 * reads louder than the code it is about.
 *
 * Bright rather than tinted, because at this size a wash of colour is grey.
 * Always give it a title: colour alone is not readable to everyone, and this
 * has no text of its own unless one is passed.
 */

type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

interface Props {
  tone?: Tone
  /** Said out loud, and shown on hover. Colour alone is not a label. */
  title: string
  /** Shown beside the dot, for a list where there is room for one. */
  label?: string
  /** For something still happening. */
  pulse?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), { tone: 'neutral', pulse: false })

const FILL: Record<Tone, string> = {
  neutral: 'bg-muted-foreground',
  info: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-destructive',
}

const INK: Record<Tone, string> = {
  neutral: 'text-muted-foreground',
  info: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-destructive',
}
</script>

<template>
  <span
    :class="cn('inline-flex items-center gap-1.5 align-middle', props.class)"
    :title="title"
  >
    <span class="relative flex h-2 w-2 shrink-0">
      <span
        v-if="pulse"
        :class="cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-60', FILL[tone])"
      />
      <span :class="cn('relative inline-flex h-2 w-2 rounded-full', FILL[tone])" />
    </span>
    <span v-if="label" :class="cn('text-xs font-medium', INK[tone])">{{ label }}</span>
    <span v-else class="sr-only">{{ title }}</span>
  </span>
</template>
