<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../lib/utils'

/** Where something stands, in one line: a verdict, a run, a check.
 *
 * Same tone vocabulary as Notice and Chip, so one meaning is one colour.
 * The label should read as plain speech: "Changes requested", not "not ready".
 */

type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

interface Props {
  tone?: Tone
  label: string
  /** A number the state is about: files, findings, comments. */
  count?: number | null
  /** Pulses the dot, for something still running. */
  busy?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  tone: 'neutral',
  count: null,
  busy: false,
})

const DOTS: Record<Tone, string> = {
  neutral: 'bg-muted-foreground',
  info: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-destructive',
}

const INK: Record<Tone, string> = {
  neutral: 'text-muted-foreground',
  info: 'text-foreground',
  success: 'text-foreground',
  warning: 'text-foreground',
  danger: 'text-foreground',
}

const shown = computed(() =>
  props.count === null || props.count === undefined ? null : props.count,
)
</script>

<template>
  <span
    :class="cn('inline-flex items-center gap-2 text-sm font-medium', INK[tone], props.class)"
    role="status"
  >
    <span class="relative flex h-2 w-2 shrink-0">
      <span
        v-if="busy"
        :class="cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-60', DOTS[tone])"
      />
      <span :class="cn('relative inline-flex h-2 w-2 rounded-full', DOTS[tone])" />
    </span>
    <span>{{ label }}</span>
    <span v-if="shown !== null" class="text-muted-foreground tabular-nums">{{ shown }}</span>
  </span>
</template>
