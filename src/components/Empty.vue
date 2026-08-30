<script setup lang="ts">
import { cn } from '../lib/utils'
import Card from './Card.vue'

/** A list with nothing in it, and what to do about that.
 *
 * Title says what is missing, body says why it is worth having, actions are
 * how to get one. One padding and one measure across every page.
 */

interface Props {
  title: string
  /** Quieter, for a state nobody needs to act on. */
  compact?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), { compact: false })
</script>

<template>
  <Card :class="cn('px-6 text-center', props.compact ? 'py-8' : 'py-16', props.class)">
    <div v-if="$slots.icon" class="mb-3 flex justify-center text-muted-foreground">
      <slot name="icon" />
    </div>
    <h2 :class="cn('font-semibold', props.compact ? 'text-base' : 'text-lg')">{{ title }}</h2>
    <p
      v-if="$slots.default"
      class="mx-auto mt-1 max-w-lg text-sm text-muted-foreground"
    >
      <slot />
    </p>
    <div v-if="$slots.actions" class="mt-4 flex flex-wrap items-center justify-center gap-2">
      <slot name="actions" />
    </div>
  </Card>
</template>
