<script setup lang="ts">
import { computed } from 'vue'
import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-vue-next'
import { cn } from '../lib/utils'

/** Something a page needs to say, in the colour of what it means.
 *
 * The brand colour here is a red, a few degrees from the one that means
 * something went wrong. Every page that wanted to say "this went well" reached
 * for a primary tint and told people their work had failed. Saying what a
 * notice means, rather than picking a tint, is the only way that stops
 * happening.
 */

type Tone = 'info' | 'success' | 'warning' | 'danger'

interface Props {
  tone?: Tone
  /** Off where the sentence already carries its own meaning. */
  icon?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), { tone: 'info', icon: true })

const TONES: Record<Tone, string> = {
  info: 'border-border bg-muted/50 text-foreground',
  success: 'border-success/40 bg-success/10 text-foreground',
  warning: 'border-warning/40 bg-warning/10 text-foreground',
  danger: 'border-destructive/40 bg-destructive/10 text-foreground',
}

const MARKS = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: CircleAlert,
}

const INK: Record<Tone, string> = {
  info: 'text-muted-foreground',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-destructive',
}

const mark = computed(() => MARKS[props.tone])
</script>

<template>
  <div
    :class="cn('flex gap-3 rounded-md border px-4 py-3 text-sm', TONES[tone], props.class)"
    :role="tone === 'danger' ? 'alert' : 'status'"
  >
    <component :is="mark" v-if="icon" :class="cn('mt-0.5 h-4 w-4 shrink-0', INK[tone])" />
    <div class="min-w-0 flex-1"><slot /></div>
    <slot name="actions" />
  </div>
</template>
