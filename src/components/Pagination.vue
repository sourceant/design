<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { pageSummary, pageWindow, type Paged } from '../lib/pagination'

/** Moving through a list that arrives one page at a time.
 *
 * Renders nothing for a single page, so a caller can place it unconditionally
 * under any list. The numbers thin out with gaps rather than growing without
 * bound, which keeps the control the same width whatever the total.
 */

interface Props {
  page: Paged<unknown>
  /** True while the next page is being fetched, so the control stops taking clicks. */
  busy?: boolean
}

const props = withDefaults(defineProps<Props>(), { busy: false })

const emit = defineEmits<{ (e: 'go', page: number): void }>()

const numbers = computed(() => pageWindow(props.page.page, props.page.pages))
const summary = computed(() => pageSummary(props.page))

function go(to: number) {
  if (props.busy || to === props.page.page || to < 1 || to > props.page.pages) return
  emit('go', to)
}
</script>

<template>
  <div
    v-if="page.pages > 1"
    class="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t bg-card px-3 py-2"
  >
    <p class="text-[11px] tabular-nums text-muted-foreground">{{ summary }}</p>

    <div class="flex items-center gap-1">
      <button
        type="button"
        class="rounded-md border p-1 text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
        :disabled="busy || page.page <= 1"
        aria-label="Previous page"
        @click="go(page.page - 1)"
      >
        <ChevronLeft class="h-4 w-4" />
      </button>

      <template v-for="(n, index) in numbers" :key="`${n}-${index}`">
        <span v-if="n === null" class="px-1 text-[11px] text-muted-foreground">…</span>
        <button
          v-else
          type="button"
          class="min-w-7 rounded-md px-1.5 py-1 text-[11px] tabular-nums transition-colors"
          :class="n === page.page ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'"
          :aria-current="n === page.page ? 'page' : undefined"
          :disabled="busy"
          @click="go(n)"
        >{{ n }}</button>
      </template>

      <button
        type="button"
        class="rounded-md border p-1 text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
        :disabled="busy || page.page >= page.pages"
        aria-label="Next page"
        @click="go(page.page + 1)"
      >
        <ChevronRight class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>
