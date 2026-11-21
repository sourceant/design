<script setup lang="ts">
import { cn } from '../lib/utils'

/** One thing on a canvas.
 *
 * A fixed size, because the layout places cards on a grid and a card that grew
 * with its text would overlap the one under it. Text that does not fit is cut
 * to its first lines; the whole of it belongs in whatever opens on click.
 */

interface Props {
  title: string
  subtitle?: string
  selected?: boolean
  /** A thing that no longer applies reads quieter than one that does. */
  muted?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), { selected: false, muted: false })
</script>

<template>
  <div
    :class="cn(
      'flex h-[144px] w-[280px] cursor-pointer flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-colors hover:border-foreground/30',
      selected && 'border-primary ring-1 ring-primary hover:border-primary',
      muted && 'opacity-60',
      props.class,
    )"
  >
    <div class="flex min-h-0 flex-1 flex-col gap-1.5 p-3">
      <div v-if="$slots.badges" class="flex items-center gap-1.5">
        <slot name="badges" />
      </div>
      <p class="line-clamp-2 text-sm font-medium leading-snug" :title="title">{{ title }}</p>
      <p v-if="subtitle" class="truncate font-mono text-xs text-muted-foreground" :title="subtitle">
        {{ subtitle }}
      </p>
    </div>
    <div
      v-if="$slots.footer"
      class="flex h-8 shrink-0 items-center gap-3 border-t bg-muted/40 px-3 text-xs text-muted-foreground"
    >
      <slot name="footer" />
    </div>
  </div>
</template>
