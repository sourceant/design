<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { cn } from '../lib/utils'

/** One of several things somebody chose, and can unchoose.
 *
 * A badge says what something is; a chip says what somebody picked. The
 * difference is that the second one comes off. A list of choices with no way
 * back out of them is a list of decisions, which is a worse thing to hand
 * anybody.
 */

type Tone = 'default' | 'success' | 'danger' | 'muted'

interface Props {
  tone?: Tone
  /** Off where the chip reports something rather than holding a choice. */
  removable?: boolean
  /** What it is, for whoever is not looking at it. */
  label?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), { tone: 'default', removable: false })
defineEmits<{ remove: [] }>()

const TONES: Record<Tone, string> = {
  default: 'border-primary/30 bg-primary/10 text-foreground',
  success: 'border-success/40 bg-success/10 text-foreground',
  danger: 'border-destructive/40 bg-destructive/10 text-foreground',
  muted: 'border-border bg-muted/60 text-muted-foreground',
}
</script>

<template>
  <span
    :class="cn(
      'inline-flex max-w-full items-center gap-1 rounded-full border py-0.5 pl-2.5 text-xs',
      removable ? 'pr-1' : 'pr-2.5',
      TONES[tone],
      props.class,
    )"
  >
    <slot name="mark" />
    <span class="min-w-0 truncate"><slot /></span>
    <button
      v-if="removable"
      type="button"
      class="shrink-0 rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-background/60 hover:text-foreground"
      :aria-label="label ? `Remove ${label}` : 'Remove'"
      @click="$emit('remove')"
    >
      <X class="h-3 w-3" />
    </button>
  </span>
</template>
