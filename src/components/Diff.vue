<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../lib/utils'

/** What changed in one file, with room for things said about a line.
 *
 * A unified patch already carries the line numbers on both sides, so they are
 * read out of it rather than counted: a hunk header says where it starts, and
 * every line after it moves one side, the other, or both.
 */

interface Note {
  line?: number | null
  severity?: string
  detail: string
  /** What to put there instead, where whoever said it offered one. */
  code?: string
  /** Who said it: a skill's name, or what kind of suggestion it is. */
  from?: string
}

interface Props {
  patch?: string
  /** Anything said about a line, drawn where it was said. */
  notes?: Note[]
  class?: string
}

const props = withDefaults(defineProps<Props>(), { patch: '', notes: () => [] })

const HUNK = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/

interface Row {
  kind: 'hunk' | 'added' | 'removed' | 'kept' | 'meta'
  text: string
  before: number | null
  after: number | null
}

const rows = computed<Row[]>(() => {
  const out: Row[] = []
  let before = 0
  let after = 0
  let started = false

  for (const line of (props.patch ?? '').split('\n')) {
    const hunk = HUNK.exec(line)
    if (hunk) {
      before = Number(hunk[1])
      after = Number(hunk[2])
      started = true
      out.push({ kind: 'hunk', text: line, before: null, after: null })
      continue
    }
    // Everything before the first hunk is git telling you which file this is,
    // which the page has already said.
    if (!started) continue

    if (line.startsWith('+')) {
      out.push({ kind: 'added', text: line.slice(1), before: null, after: after++ })
    } else if (line.startsWith('-')) {
      out.push({ kind: 'removed', text: line.slice(1), before: before++, after: null })
    } else if (line.startsWith('\\')) {
      out.push({ kind: 'meta', text: line, before: null, after: null })
    } else {
      out.push({ kind: 'kept', text: line.slice(1), before: before++, after: after++ })
    }
  }
  return out
})

const TONE: Record<string, string> = {
  added: 'bg-success/10',
  removed: 'bg-destructive/10',
  hunk: 'bg-muted/60 text-muted-foreground',
  meta: 'text-muted-foreground',
  kept: '',
}

const MARK: Record<string, string> = { added: '+', removed: '-', kept: ' ', hunk: '', meta: '' }

// Said about a line, so it can be drawn under it.
const said = computed(() => {
  const by = new Map<number, Note[]>()
  for (const note of props.notes ?? []) {
    if (!note.line) continue
    by.set(note.line, [...(by.get(note.line) ?? []), note])
  }
  return by
})

// Anything said about the file rather than about a line in it.
const overall = computed(() => (props.notes ?? []).filter((note) => !note.line))
</script>

<template>
  <div :class="cn('overflow-hidden rounded-md border', props.class)">
    <div v-if="overall.length" class="space-y-2 border-b bg-muted/30 p-3">
      <div
        v-for="(note, index) in overall"
        :key="index"
        class="rounded border text-sm"
        :class="note.severity === 'blocking' ? 'border-destructive/40 bg-destructive/5' : 'bg-card'"
      >
        <div class="px-3 py-2">
          <span v-if="note.from" class="mr-2 text-xs uppercase tracking-wide text-muted-foreground">
            {{ note.from }}
          </span>
          {{ note.detail }}
        </div>
        <pre
          v-if="note.code"
          class="overflow-x-auto border-t bg-success/10 px-3 py-2 font-mono text-xs"
        >{{ note.code }}</pre>
      </div>
    </div>

    <div v-if="!rows.length" class="p-4 text-sm text-muted-foreground">
      Nothing to show for this one. It may be a file git stores whole rather than as lines.
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full border-collapse font-mono text-xs leading-relaxed">
        <tbody>
          <template v-for="(row, index) in rows" :key="index">
            <tr :class="TONE[row.kind]">
              <td class="w-12 select-none border-r px-2 text-right align-top text-muted-foreground">
                {{ row.before ?? '' }}
              </td>
              <td class="w-12 select-none border-r px-2 text-right align-top text-muted-foreground">
                {{ row.after ?? '' }}
              </td>
              <td class="w-4 select-none pl-2 align-top text-muted-foreground">{{ MARK[row.kind] }}</td>
              <td class="whitespace-pre-wrap break-all py-0.5 pr-3 align-top">{{ row.text }}</td>
            </tr>

            <tr v-for="(note, at) in said.get(row.after ?? -1) ?? []" :key="`${index}-${at}`">
              <td colspan="4" class="px-3 py-2">
                <div
                  class="rounded border font-sans text-sm"
                  :class="note.severity === 'blocking' ? 'border-destructive/40 bg-destructive/5' : 'bg-muted/40'"
                >
                  <div class="px-3 py-2">
                    <span v-if="note.from" class="mr-2 text-xs uppercase tracking-wide text-muted-foreground">
                      {{ note.from }}
                    </span>
                    {{ note.detail }}
                  </div>
                  <pre
                    v-if="note.code"
                    class="overflow-x-auto border-t bg-success/10 px-3 py-2 font-mono text-xs"
                  >{{ note.code }}</pre>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
