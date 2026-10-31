<script setup lang="ts" generic="T">
import { computed, ref, watch } from 'vue'
import {
  Handle,
  Position,
  VueFlow,
  type Edge,
  type Node,
  type NodeDragEvent,
  type NodeMouseEvent,
  type VueFlowStore,
} from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'
import CanvasControls from './CanvasControls.vue'
import { cn } from '../lib/utils'
import {
  forgetPositions,
  layoutLanes,
  readSavedPositions,
  savePosition,
  type Lane,
  type Point,
} from '../canvas/layout'
import type { CanvasEdge } from '../canvas/edges'

/** Cards in named columns, with lines between the ones that relate.
 *
 * Built for things a reader acts on: every card opens something. Placement is
 * worked out from the lanes and their order, so the same data draws the same
 * picture on every visit, and a card the reader drags is kept where they left
 * it under `storageKey`. An edge may join two cards or two lanes.
 */

export interface CanvasItem<D> {
  id: string
  lane: string
  data: D
}

interface Props {
  lanes: Lane[]
  items: CanvasItem<T>[]
  edges?: CanvasEdge[]
  /** The kinds of line a reader can switch off, shown as a legend. */
  edgeTypes?: { type: string; label: string }[]
  /** Where dragged positions are kept. Without one, nothing is kept. */
  storageKey?: string
  selected?: string | null
  /** Items not matching dim rather than vanish, so the layout holds still. */
  highlight?: Set<string> | null
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  edges: () => [],
  edgeTypes: () => [],
  selected: null,
  highlight: null,
})

const emit = defineEmits<{ select: [id: string | null] }>()

defineSlots<{
  card(props: { item: CanvasItem<T>; selected: boolean; dimmed: boolean }): unknown
  lane?(props: { lane: Lane; count: number }): unknown
  empty?(): unknown
}>()

const saved = ref<Record<string, Point>>(props.storageKey ? readSavedPositions(props.storageKey) : {})
watch(() => props.storageKey, key => (saved.value = key ? readSavedPositions(key) : {}))

const hidden = ref(new Set<string>())

const byId = computed(() => new Map(props.items.map(i => [i.id, i])))
const counts = computed(() => {
  const counted = new Map<string, number>()
  for (const item of props.items) counted.set(item.lane, (counted.get(item.lane) ?? 0) + 1)
  return counted
})

const nodes = computed<Node[]>(() => {
  const placed = layoutLanes(props.lanes, props.items, saved.value)
  return [
    ...placed.lanes.map(lane => ({
      id: `lane:${lane.id}`,
      type: 'lane',
      position: lane.position,
      draggable: false,
      selectable: false,
      focusable: false,
      zIndex: -1,
      style: { width: `${lane.width}px`, height: `${lane.height}px` },
      data: { lane },
    })),
    ...placed.items.map(item => ({
      id: item.id,
      type: 'card',
      position: item.position,
      data: { item: byId.value.get(item.id)! },
    })),
  ]
})

const laneIds = computed(() => new Set(props.lanes.map(l => l.id)))

function nodeOf(id: string) {
  if (byId.value.has(id)) return id
  if (laneIds.value.has(id)) return `lane:${id}`
  return null
}

const edges = computed<Edge[]>(() => {
  const drawn: Edge[] = []
  for (const e of props.edges) {
    const source = nodeOf(e.source)
    const target = nodeOf(e.target)
    if (hidden.value.has(e.type) || !source || !target || source === target) continue
    const active = props.selected && (e.source === props.selected || e.target === props.selected)
    drawn.push({
      id: e.id,
      source,
      target,
      type: 'smoothstep',
      class: cn(`canvas-edge canvas-edge-${e.type}`, active && 'canvas-edge-active'),
      style: { strokeWidth: `${Math.min(1 + Math.log2(e.weight ?? 1), 6)}px` },
      label: e.label,
      data: { label: e.label },
    })
  }
  return drawn
})

function toggle(type: string) {
  const next = new Set(hidden.value)
  if (next.has(type)) next.delete(type)
  else next.add(type)
  hidden.value = next
}

function onDragStop(event: NodeDragEvent) {
  if (!props.storageKey) return
  for (const node of event.nodes) {
    savePosition(props.storageKey, node.id, node.position)
    saved.value = { ...saved.value, [node.id]: { ...node.position } }
  }
}

function reset() {
  if (props.storageKey) forgetPositions(props.storageKey)
  saved.value = {}
}

function onReady(flow: VueFlowStore) {
  flow.fitView({ maxZoom: 1, padding: 0.15 })
}
</script>

<template>
  <div :class="cn('canvas relative h-full min-h-[420px] overflow-hidden rounded-lg border', props.class)">
    <div v-if="!items.length" class="flex h-full items-center justify-center p-6">
      <slot name="empty" />
    </div>
    <VueFlow
      v-else
      :nodes="nodes"
      :edges="edges"
      :min-zoom="0.2"
      :max-zoom="1.6"
      :nodes-connectable="false"
      :elevate-edges-on-select="false"
      class="h-full w-full"
      @pane-ready="onReady"
      @node-click="(e: NodeMouseEvent) => e.node.type === 'card' && emit('select', e.node.id)"
      @pane-click="emit('select', null)"
      @node-drag-stop="onDragStop"
    >
      <template #node-lane="{ data }">
        <Handle type="target" :position="Position.Left" :connectable="false" class="canvas-handle" />
        <Handle type="source" :position="Position.Right" :connectable="false" class="canvas-handle" />
        <div class="h-full w-full rounded-lg border border-dashed bg-muted/20">
          <div class="flex h-10 items-center justify-between gap-2 px-4 text-xs font-medium text-muted-foreground">
            <slot name="lane" :lane="data.lane" :count="counts.get(data.lane.id) ?? 0">
              <span class="truncate font-mono" :title="data.lane.label">{{ data.lane.label }}</span>
              <span>{{ counts.get(data.lane.id) ?? 0 }}</span>
            </slot>
          </div>
        </div>
      </template>
      <template #node-card="{ data }">
        <Handle type="target" :position="Position.Left" :connectable="false" class="canvas-handle" />
        <Handle type="source" :position="Position.Right" :connectable="false" class="canvas-handle" />
        <div
          :class="cn('transition-opacity', highlight && !highlight.has(data.item.id) && 'opacity-30')"
        >
          <slot
            name="card"
            :item="data.item"
            :selected="data.item.id === selected"
            :dimmed="!!highlight && !highlight.has(data.item.id)"
          />
        </div>
      </template>

      <CanvasControls :resettable="!!storageKey" @reset="reset" />
    </VueFlow>

    <div
      v-if="items.length && edgeTypes.length"
      class="absolute right-4 top-4 z-10 flex flex-wrap gap-1 rounded-md border bg-card p-1 text-xs shadow-sm"
      role="group"
      aria-label="Lines"
    >
      <button
        v-for="source in edgeTypes"
        :key="source.type"
        type="button"
        :aria-pressed="!hidden.has(source.type)"
        :class="cn(
          'inline-flex items-center gap-1.5 rounded px-2 py-1 transition-colors',
          hidden.has(source.type) ? 'text-muted-foreground/60 line-through' : 'text-foreground hover:bg-muted',
        )"
        @click="toggle(source.type)"
      >
        <span :class="cn('canvas-legend h-0.5 w-4', `canvas-legend-${source.type}`)" />
        {{ source.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.canvas {
  background-color: hsl(var(--canvas-bg));
  background-image: radial-gradient(hsl(var(--canvas-dot)) 1px, transparent 1px);
  background-size: 18px 18px;
}

.canvas :deep(.vue-flow__node-card),
.canvas :deep(.vue-flow__node-lane) {
  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
}

.canvas :deep(.vue-flow__node-lane) {
  cursor: default;
}

.canvas :deep(.canvas-handle) {
  opacity: 0;
  pointer-events: none;
  min-width: 0;
  min-height: 0;
  width: 1px;
  height: 1px;
  border: 0;
}

.canvas :deep(.canvas-edge path) {
  stroke: hsl(var(--muted-foreground) / 0.45);
}

.canvas :deep(.canvas-edge-active path) {
  stroke: hsl(var(--primary));
}

.canvas :deep(.vue-flow__edge-textbg) {
  fill: hsl(var(--card));
}

.canvas :deep(.vue-flow__edge-text) {
  fill: hsl(var(--muted-foreground));
  font-size: 11px;
}

.canvas-legend {
  background: hsl(var(--muted-foreground) / 0.6);
}
</style>
