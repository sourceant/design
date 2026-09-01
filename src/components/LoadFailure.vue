<script setup lang="ts">
import { AlertTriangle, RotateCw } from 'lucide-vue-next'
import { cn } from '../lib/utils'

/** A read that did not come back, and the one thing worth trying.
 *
 * Names what could not be read rather than what went wrong, because the reader
 * knows what they asked for and not what a request is. The reported reason sits
 * underneath for whoever does.
 */

interface Props {
  /** What could not be read, e.g. "your repositories". */
  what: string
  /** Why, as the read reported it. */
  message?: string
  /** Tighter spacing for detail panels and inline regions. */
  compact?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), { message: '', compact: false })

const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div
    :class="cn(
      'flex flex-col items-center justify-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-6 text-center',
      props.compact ? 'py-8' : 'py-14',
      props.class,
    )"
    role="alert"
  >
    <AlertTriangle class="h-6 w-6 text-destructive" />
    <div class="space-y-1">
      <p class="text-sm font-medium text-foreground">Could not load {{ what }}</p>
      <p v-if="message" class="text-xs text-muted-foreground">{{ message }}</p>
    </div>
    <button
      type="button"
      class="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
      @click="emit('retry')"
    >
      <RotateCw class="h-3.5 w-3.5" />
      Try again
    </button>
  </div>
</template>
