<script setup lang="ts">
import { cn } from '../lib/utils'

/** Which thing an item belongs to, for a list that holds several things'.
 *
 * Only worth showing where the list is mixed. In a view already narrowed to
 * one repository this repeats the same words on every row, and a label that is
 * always the same is read once and then not at all, which is worse than no
 * label because it costs the room.
 *
 * Quiet on purpose: it says where something came from, not what it is.
 */

interface Props {
  name: string
  /** Reads better in the typeface for a path or an owner/name pair. */
  mono?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), { mono: true })
</script>

<template>
  <span
    :class="cn(
      'inline-flex max-w-full items-center gap-1 rounded border border-border/60 bg-muted/40 px-1.5 py-0.5 text-[11px] text-muted-foreground',
      props.mono && 'font-mono',
      props.class,
    )"
  >
    <span v-if="$slots.icon" class="shrink-0"><slot name="icon" /></span>
    <span class="truncate">{{ name }}</span>
  </span>
</template>
