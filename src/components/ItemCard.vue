<script setup lang="ts">
import Card from './Card.vue'
import { cn } from '../lib/utils'

/** One thing in a list of things.
 *
 * A tinted tile, a name with whatever is true of it beside it, a line of
 * detail, and what can be done to it on the right. Repositories, knowledge and
 * the overview were each spelling this out, which is why their corners and
 * their tiles had drifted apart.
 */

interface Props {
  title: string
  /** Under the title, in the typeface a path deserves. */
  subtitle?: string
  /** Which of the product's pillars this belongs to, for the tile behind the icon. */
  pillar?: 'memory' | 'graph' | 'review' | 'tokens' | 'brand'
  hover?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), { pillar: 'graph', hover: false })

const tints: Record<string, string> = {
  memory: 'bg-pillar-memory/15 text-pillar-memory',
  graph: 'bg-pillar-graph/15 text-pillar-graph',
  review: 'bg-pillar-review/15 text-pillar-review',
  tokens: 'bg-pillar-tokens/15 text-pillar-tokens',
  brand: 'bg-primary/15 text-primary',
}
</script>

<template>
  <Card :hover="hover" :class="cn('p-5', props.class)">
    <div class="flex items-start gap-4">
      <div
        v-if="$slots.icon"
        :class="cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-lg', tints[pillar])"
      >
        <slot name="icon" />
      </div>

      <div class="min-w-0 flex-1">
        <div class="mb-1 flex flex-wrap items-center gap-2">
          <h3 class="break-all font-semibold">{{ title }}</h3>
          <slot name="badges" />
        </div>
        <p v-if="subtitle" class="break-all font-mono text-sm text-muted-foreground">
          {{ subtitle }}
        </p>
        <slot />
        <div v-if="$slots.meta" class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <slot name="meta" />
        </div>
      </div>

      <div v-if="$slots.actions" class="flex shrink-0 items-center gap-1">
        <slot name="actions" />
      </div>
    </div>
  </Card>
</template>
