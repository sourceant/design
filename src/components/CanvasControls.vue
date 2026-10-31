<script setup lang="ts">
import { useVueFlow } from '@vue-flow/core'
import { Minus, Plus, RotateCcw, Scan } from 'lucide-vue-next'

/** Zoom and fit, for a reader without a scroll wheel or a pinch. Lives inside a
 *  canvas: it drives whichever one it is placed in. */

defineProps<{ resettable?: boolean }>()
const emit = defineEmits<{ reset: [] }>()

const { zoomIn, zoomOut, fitView } = useVueFlow()

const button =
  'inline-grid h-8 w-8 place-items-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
</script>

<template>
  <div
    class="absolute bottom-4 left-4 z-10 flex flex-col divide-y overflow-hidden rounded-md border bg-card shadow-sm"
    role="toolbar"
    aria-label="Canvas"
  >
    <button type="button" :class="button" title="Zoom in" aria-label="Zoom in" @click="zoomIn()">
      <Plus class="h-4 w-4" />
    </button>
    <button type="button" :class="button" title="Zoom out" aria-label="Zoom out" @click="zoomOut()">
      <Minus class="h-4 w-4" />
    </button>
    <button
      type="button"
      :class="button"
      title="Fit"
      aria-label="Fit to screen"
      @click="fitView({ maxZoom: 1, padding: 0.15 })"
    >
      <Scan class="h-4 w-4" />
    </button>
    <button
      v-if="resettable"
      type="button"
      :class="button"
      title="Reset"
      aria-label="Put every card back where it started"
      @click="emit('reset')"
    >
      <RotateCcw class="h-4 w-4" />
    </button>
  </div>
</template>
