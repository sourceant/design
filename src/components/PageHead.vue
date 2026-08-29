<script setup lang="ts">
import { cn } from '../lib/utils'

/** What a page is, and what can be done to all of it.
 *
 * A detail page is the same header with a way back and something true of the
 * thing beside its name, so those are slots here rather than a second header
 * that drifts from this one.
 */

interface Props {
  title: string
  sub?: string
  pillar?: 'memory' | 'graph' | 'review' | 'tokens' | 'brand'
  /** A path, an id, anything that reads better in the typeface for one. */
  mono?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), { pillar: 'graph', mono: false })

const tints: Record<string, string> = {
  memory: 'bg-pillar-memory/15 text-pillar-memory',
  graph: 'bg-pillar-graph/15 text-pillar-graph',
  review: 'bg-pillar-review/15 text-pillar-review',
  tokens: 'bg-pillar-tokens/15 text-pillar-tokens',
  brand: 'bg-primary/15 text-primary',
}
</script>

<template>
  <div :class="cn('mb-6 flex flex-wrap items-start justify-between gap-4', props.class)">
    <div class="flex min-w-0 items-center gap-3">
      <slot name="back" />
      <div
        v-if="$slots.icon"
        :class="cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-lg', tints[pillar])"
      >
        <slot name="icon" />
      </div>
      <div class="min-w-0">
        <div class="flex flex-wrap items-center gap-2">
          <h1 class="text-xl font-semibold">{{ title }}</h1>
          <slot name="badges" />
        </div>
        <p
          v-if="sub"
          :class="cn('text-sm text-muted-foreground', mono && 'break-all font-mono')"
        >
          {{ sub }}
        </p>
      </div>
    </div>
    <div v-if="$slots.actions" class="flex flex-wrap items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
