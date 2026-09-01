<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../lib/utils'

/** Not here yet, as Empty is nothing here.
 *
 * Centred in whatever it fills, because a small spinner in a corner reads as a
 * page that has finished and gone wrong. The note underneath is for work that
 * outlives the page: say so there, or people close the tab.
 */

interface Props {
  label?: string
  /** Where it comes from, e.g. "GitHub". Rendered as "<label> from <source>". */
  source?: string
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

const RING: Record<string, string> = {
  sm: 'h-10 w-10',
  md: 'h-14 w-14',
  lg: 'h-16 w-16',
}

const GLOW: Record<string, string> = {
  sm: 'h-14 w-14',
  md: 'h-20 w-20',
  lg: 'h-24 w-24',
}

const DOT: Record<string, string> = {
  sm: 'h-1.5 w-1.5',
  md: 'h-2 w-2',
  lg: 'h-2.5 w-2.5',
}

const TEXT: Record<string, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

const NOTE: Record<string, string> = {
  sm: 'text-[11px]',
  md: 'text-xs',
  lg: 'text-sm',
}

const pad = computed(() => (props.size === 'sm' ? 'py-8' : 'py-16'))
const message = computed(() => (props.source ? `${props.label} from ${props.source}` : props.label))
</script>

<template>
  <div
    :class="cn(
      'flex flex-col items-center justify-center gap-5 px-6 text-center',
      fill ? 'min-h-0 flex-1' : pad,
      props.class,
    )"
    role="status"
    aria-live="polite"
  >
    <div class="relative flex items-center justify-center">
      <span
        :class="cn('absolute animate-pulse rounded-full bg-primary/25 blur-2xl', GLOW[size])"
        aria-hidden="true"
      />
      <span :class="cn('rounded-full border-2 border-border/70', RING[size])" aria-hidden="true" />
      <span
        :class="cn(
          'absolute animate-spin rounded-full border-2 border-transparent border-t-primary border-r-primary/50',
          RING[size],
        )"
        aria-hidden="true"
      />
      <span
        :class="cn('absolute animate-pulse rounded-full bg-primary', DOT[size])"
        aria-hidden="true"
      />
    </div>

    <div class="animate-fade-in space-y-1.5">
      <p :class="cn('font-medium text-foreground', TEXT[size])">{{ message }}</p>
      <p
        v-if="note || $slots.default"
        :class="cn('mx-auto max-w-md text-muted-foreground', NOTE[size])"
      >
        <slot>{{ note }}</slot>
      </p>
    </div>
  </div>
</template>
