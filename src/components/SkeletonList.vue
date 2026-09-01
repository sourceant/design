<script setup lang="ts">
import { cn } from '../lib/utils'

/** The shape of a list that has not arrived yet.
 *
 * Placeholder rows rather than a spinner, so the page does not jump when the
 * real rows replace them. Widths vary down the list because uniform bars read
 * as a chart rather than as titles.
 */

interface Props {
  /** What is being loaded, e.g. "Fetching pull requests". */
  label: string
  /** Where it comes from, e.g. "GitHub". Rendered as "<label> from <source>". */
  source?: string
  rows?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), { rows: 6 })

const TITLE_WIDTHS = ['88%', '66%', '79%', '57%', '72%', '83%']
const META_WIDTHS = ['45%', '38%', '52%', '33%', '47%', '41%']
</script>

<template>
  <div :class="cn('divide-y', props.class)" role="status" aria-live="polite">
    <p class="flex items-center gap-2 px-3.5 py-3 text-xs text-muted-foreground">
      <span class="h-2 w-2 shrink-0 animate-pulse rounded-full bg-primary" aria-hidden="true" />
      {{ source ? `${label} from ${source}` : label }}
    </p>
    <div v-for="i in rows" :key="i" class="flex items-start gap-2.5 px-3.5 py-3">
      <span class="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-muted" aria-hidden="true" />
      <span class="flex min-w-0 flex-1 flex-col gap-1.5" aria-hidden="true">
        <span
          class="relative block h-2.5 overflow-hidden rounded-sm bg-muted"
          :style="{ width: TITLE_WIDTHS[(i - 1) % TITLE_WIDTHS.length] }"
        >
          <span class="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-foreground/[0.06] to-transparent" />
        </span>
        <span
          class="relative block h-2 overflow-hidden rounded-sm bg-muted"
          :style="{ width: META_WIDTHS[(i - 1) % META_WIDTHS.length] }"
        >
          <span class="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-foreground/[0.06] to-transparent" />
        </span>
      </span>
    </div>
  </div>
</template>
