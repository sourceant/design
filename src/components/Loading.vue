<script setup lang="ts">
import { computed } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { cn } from '../lib/utils'

/** Not here yet, as Empty is nothing here.
 *
 * Centred in whatever it fills, because a small spinner in a corner reads as a
 * page that has finished and gone wrong. The note underneath is for work that
 * outlives the page: say so there, or people close the tab.
 */

interface Props {
  label?: string
  /** A second line, for work that keeps going whether or not anyone watches. */
  note?: string
  size?: 'sm' | 'md' | 'lg'
  /** Fills its parent and centres in it, rather than sitting in the flow. */
  fill?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Working',
  size: 'md',
  fill: true,
})

const SPINNER: Record<string, string> = {
  sm: 'h-5 w-5',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
}

const TEXT: Record<string, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
}

const pad = computed(() => (props.size === 'sm' ? 'py-8' : 'py-16'))
</script>

<template>
  <div
    :class="cn(
      'flex flex-col items-center justify-center gap-3 text-center',
      fill ? 'min-h-0 flex-1' : pad,
      props.class,
    )"
    role="status"
    aria-live="polite"
  >
    <span class="relative flex items-center justify-center">
      <span
        :class="cn('absolute inline-flex animate-ping rounded-full bg-primary/20', SPINNER[size])"
      />
      <Loader2 :class="cn('relative animate-spin text-muted-foreground', SPINNER[size])" />
    </span>
    <p :class="cn('font-medium', TEXT[size])">{{ label }}</p>
    <p v-if="note || $slots.default" class="max-w-md text-sm text-muted-foreground">
      <slot>{{ note }}</slot>
    </p>
  </div>
</template>
