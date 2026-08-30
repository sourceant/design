<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { cn } from '../lib/utils'

/** One part of a longer document, not a card.
 *
 * A card is a thing you could pick up and put somewhere else. These are the
 * parts of one continuous read, so they are divided by a rule and a heading,
 * the way any document is. Boxing each one draws a border between paragraphs
 * of the same argument, and a page of stacked boxes reads as a list of
 * unrelated objects.
 *
 * Tone tints the icon and the count. It is not a border and not a fill: at
 * this size a wash of colour behind a paragraph makes the paragraph harder to
 * read and the colour easier to ignore.
 */

type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

interface Props {
  title: string
  tone?: Tone
  /** A number the section is about: findings, files, suggestions. */
  count?: number | null
  collapsible?: boolean
  /** Starts closed. Only meaningful when collapsible. */
  closed?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  tone: 'neutral',
  count: null,
  collapsible: false,
  closed: false,
})

const open = ref(!props.closed)

const INK: Record<Tone, string> = {
  neutral: 'text-muted-foreground',
  info: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-destructive',
}

const COUNT: Record<Tone, string> = {
  neutral: 'bg-muted text-muted-foreground',
  info: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-destructive/10 text-destructive',
}

const shown = computed(() => (props.collapsible ? open.value : true))
</script>

<template>
  <section :class="cn('py-4 first:pt-0 last:pb-0', props.class)">
    <component
      :is="collapsible ? 'button' : 'div'"
      :type="collapsible ? 'button' : undefined"
      :aria-expanded="collapsible ? String(open) : undefined"
      :class="cn('flex w-full items-center gap-2 text-left', collapsible && 'cursor-pointer')"
      @click="collapsible && (open = !open)"
    >
      <span v-if="$slots.icon" :class="cn('shrink-0', INK[tone])"><slot name="icon" /></span>
      <h2 class="font-semibold">{{ title }}</h2>
      <span
        v-if="count !== null"
        :class="cn('rounded-full px-2 py-0.5 text-xs font-medium tabular-nums', COUNT[tone])"
      >
        {{ count }}
      </span>
      <ChevronDown
        v-if="collapsible"
        :class="cn('ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')"
      />
    </component>
    <div v-show="shown" class="mt-3">
      <slot />
    </div>
  </section>
</template>
