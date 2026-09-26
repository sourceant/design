<script setup lang="ts">
import { cn } from '../lib/utils'

/**
 * Rows of the same shape, read down a column.
 *
 * A card says everything about one thing. A table says one thing about
 * everything, which is the question somebody asks of sixty skills or a hundred
 * files: which of these is set to never, which of them nobody has read yet. In
 * cards that answer is scattered down the page; in a column it is one glance.
 *
 * Cells are slots named after their column, so what a value looks like stays
 * with the application that knows what it means.
 */

export interface TableColumn {
  id: string
  label: string
  /** Numbers and controls read better against their own edge. */
  align?: 'left' | 'right'
  /** Held to a width, for a column whose content would otherwise set it. */
  width?: string
  /** Dropped on a narrow screen, where every column cannot fit. */
  narrow?: boolean
}

const props = withDefaults(defineProps<{
  columns: TableColumn[]
  rows: Record<string, unknown>[]
  /** What makes a row itself, so redrawing does not shuffle them. */
  rowKey?: string | ((row: Record<string, unknown>, index: number) => string)
  /** A name for whoever is not looking at it. */
  label?: string
  /** Tighter rows, for a list somebody scans rather than reads. */
  dense?: boolean
  class?: string
}>(), { rowKey: 'id', dense: false })

const keyOf = (row: Record<string, unknown>, index: number) =>
  typeof props.rowKey === 'function' ? props.rowKey(row, index) : String(row[props.rowKey] ?? index)
</script>

<template>
  <div :class="cn('w-full overflow-x-auto rounded-lg border', props.class)">
    <table class="w-full border-collapse text-sm">
      <caption v-if="label" class="sr-only">{{ label }}</caption>
      <thead>
        <tr class="border-b bg-muted/30">
          <th
            v-for="column in columns"
            :key="column.id"
            scope="col"
            :style="column.width ? { width: column.width } : undefined"
            :class="cn(
              'px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground',
              column.align === 'right' ? 'text-right' : 'text-left',
              column.narrow && 'hidden sm:table-cell',
            )"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in rows"
          :key="keyOf(row, index)"
          class="border-b last:border-0 transition-colors hover:bg-muted/40"
        >
          <td
            v-for="column in columns"
            :key="column.id"
            :class="cn(
              'px-2.5 align-middle',
              dense ? 'py-1' : 'py-1.5',
              column.align === 'right' ? 'text-right' : 'text-left',
              column.narrow && 'hidden sm:table-cell',
            )"
          >
            <slot :name="column.id" :row="row" :index="index">{{ row[column.id] }}</slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
