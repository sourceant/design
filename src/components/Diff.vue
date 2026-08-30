<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../lib/utils'
import DotIndicator from './DotIndicator.vue'
import Markdown from './Markdown.vue'

/** What changed in one file, with room for things said about a line.
 *
 * A unified patch already carries the line numbers on both sides, so they are
 * read out of it rather than counted: a hunk header says where it starts, and
 * every line after it moves one side, the other, or both.
 */

type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

interface Note {
  line?: number | null
  severity?: string
  /** Markdown, because a model writes backticks and lists whether or not
   * anybody asked it to. Rendered as text it shows the punctuation. */
  detail: string
  /** What to put there instead, where whoever said it offered one. */
  code?: string
  /** What it replaces. Without it a suggestion is an addition out of nowhere,
   * and the reader has to find what is going away themselves. */
  replacing?: string
  /** Who said it: a skill's name, or what kind of suggestion it is. */
  from?: string
  /** What kind of thing it is, in colour. */
  tone?: Tone
}

interface Props {
  patch?: string
  /** Anything said about a line, drawn where it was said. */
  notes?: Note[]
  class?: string
}

const props = withDefaults(defineProps<Props>(), { patch: '', notes: () => [] })

const EDGE: Record<string, string> = {
  neutral: 'bg-card',
  info: 'border-primary/30 bg-primary/5',
  success: 'border-success/40 bg-success/5',
  warning: 'border-warning/40 bg-warning/5',
  danger: 'border-destructive/40 bg-destructive/5',
}

const LABEL: Record<string, string> = {
  neutral: 'text-muted-foreground',
  info: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-destructive',
}

function edge(note: Note): string {
  if (note.severity === 'blocking') return EDGE.danger
  return EDGE[note.tone ?? 'neutral'] ?? EDGE.neutral
}

function label(note: Note): string {
  if (note.severity === 'blocking') return LABEL.danger
  return LABEL[note.tone ?? 'neutral'] ?? LABEL.neutral
}

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
        :class="edge(note)"
      >
        <div class="px-3 py-2">
          <DotIndicator
            v-if="note.from"
            :tone="note.severity === 'blocking' ? 'danger' : (note.tone ?? 'neutral')"
            :title="String(note.from)"
            :label="String(note.from).toLowerCase()"
            class="mr-2"
          />
          <Markdown :source="note.detail" class="inline [&>p]:inline" />
        </div>
        <pre
          v-if="note.replacing"
          class="overflow-x-auto border-t bg-destructive/10 px-3 py-2 font-mono text-xs"
        >{{ note.replacing }}</pre>
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
                <div class="rounded border font-sans text-sm" :class="edge(note)">
                  <div class="px-3 py-2">
                    <DotIndicator
                      v-if="note.from"
                      :tone="note.severity === 'blocking' ? 'danger' : (note.tone ?? 'neutral')"
                      :title="String(note.from)"
                      :label="String(note.from).toLowerCase()"
                      class="mr-2"
                    />
                    <Markdown :source="note.detail" class="inline [&>p]:inline" />
                  </div>
                  <pre
                    v-if="note.replacing"
                    class="overflow-x-auto border-t bg-destructive/10 px-3 py-2 font-mono text-xs"
                  >{{ note.replacing }}</pre>
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
