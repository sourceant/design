<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { ArrowUpRight, Loader2, Search, X } from 'lucide-vue-next'
import { cn } from '../lib/utils'

/**
 * One field that finds anything, opened from the keyboard.
 *
 * Navigation answers "where is that screen". This answers "where is that
 * thing", which is the question somebody actually has, and the answer is
 * usually not on the screen they are looking at.
 *
 * What the results are is the application's business: it is handed groups of
 * them, already narrowed, so it can ask a server or filter what it holds. This
 * owns the field, the keys and the list, because those were written out by hand
 * in every product that had a search.
 */

export interface CommandSearchItem {
  id: string
  label: string
  /** A second line, for what the label alone leaves ambiguous. */
  detail?: string
}

export interface CommandSearchGroup {
  id: string
  label: string
  items: CommandSearchItem[]
}

const props = withDefaults(defineProps<{
  /** The query, so the application can narrow or ask for results itself. */
  modelValue?: string
  groups?: CommandSearchGroup[]
  open?: boolean
  /** Said above the results, for where the search is looking. */
  context?: string
  placeholder?: string
  /** Waiting on somebody else's answer. */
  loading?: boolean
  emptyLabel?: string
  label?: string
  class?: string
}>(), {
  modelValue: '',
  groups: () => [],
  open: false,
  placeholder: 'Search',
  loading: false,
  emptyLabel: 'No matches. Try another name or phrase.',
  label: 'Search',
})

const emit = defineEmits<{
  'update:modelValue': [string]
  'update:open': [boolean]
  select: [CommandSearchItem, string]
}>()

const active = ref(0)
const root = ref<HTMLElement>()
const field = ref<HTMLInputElement>()
const trigger = ref<HTMLButtonElement>()

// One list under the headings, because the keys move through what is drawn
// rather than through the shape it is drawn in.
const flat = computed(() =>
  props.groups.flatMap(group => group.items.map(item => ({ item, group: group.id }))),
)

watch(() => props.modelValue, () => { active.value = 0 })
watch(flat, () => { active.value = Math.min(active.value, Math.max(0, flat.value.length - 1)) })
watch(() => props.open, async (open) => {
  if (open) {
    await nextTick()
    field.value?.focus()
  } else {
    await nextTick()
    trigger.value?.focus()
  }
})

function move(delta: number) {
  if (flat.value.length) active.value = (active.value + delta + flat.value.length) % flat.value.length
}

function choose(index = active.value) {
  const chosen = flat.value[index]
  if (!chosen) return
  emit('select', chosen.item, chosen.group)
  emit('update:open', false)
}

function indexOf(group: CommandSearchGroup, item: CommandSearchItem) {
  return flat.value.findIndex(one => one.group === group.id && one.item.id === item.id)
}

function shortcut(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    emit('update:open', !props.open)
  }
}

function outside(event: MouseEvent) {
  if (props.open && root.value && !event.composedPath().includes(root.value)) {
    emit('update:open', false)
  }
}

onMounted(() => {
  document.addEventListener('keydown', shortcut)
  document.addEventListener('click', outside, true)
})
onUnmounted(() => {
  document.removeEventListener('keydown', shortcut)
  document.removeEventListener('click', outside, true)
})
</script>

<template>
  <div
    ref="root"
    :class="cn(
      'z-50',
      open
        ? 'absolute left-1/2 top-1/2 w-[calc(100%-1rem)] max-w-xl -translate-x-1/2 -translate-y-1/2'
        : 'shrink-0',
      props.class,
    )"
  >
    <button
      v-if="!open"
      ref="trigger"
      type="button"
      class="relative rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/40"
      :aria-label="label"
      title="Search (Ctrl / ⌘ K)"
      aria-haspopup="listbox"
      :aria-expanded="open"
      @click.stop="$emit('update:open', true)"
    >
      <Search class="h-4 w-4" />
      <span v-if="modelValue" class="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-primary" />
    </button>

    <div v-else class="rounded-lg border bg-card shadow-lg">
      <div class="flex items-center gap-2 px-3">
        <Loader2 v-if="loading" class="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
        <Search v-else class="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          ref="field"
          :value="modelValue"
          role="combobox"
          aria-autocomplete="list"
          aria-controls="command-search-results"
          :aria-expanded="open"
          :aria-activedescendant="flat.length ? `command-search-${active}` : undefined"
          :aria-label="label"
          :placeholder="placeholder"
          class="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none"
          @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          @keydown.down.prevent="move(1)"
          @keydown.up.prevent="move(-1)"
          @keydown.enter.prevent="choose()"
          @keydown.esc.stop.prevent="$emit('update:open', false)"
        >
        <button
          type="button"
          aria-label="Close search"
          class="rounded p-1 text-muted-foreground hover:bg-muted"
          @click="$emit('update:open', false)"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <div class="absolute left-0 right-0 top-full mt-1 overflow-hidden rounded-lg border bg-card shadow-lg">
        <p v-if="context" class="border-b px-3 py-2 text-xs text-muted-foreground">{{ context }}</p>
        <ul
          id="command-search-results"
          role="listbox"
          :aria-label="label"
          class="max-h-[60vh] overflow-y-auto py-1"
        >
          <template v-for="group in groups" :key="group.id">
            <li
              v-if="group.items.length"
              role="presentation"
              class="px-3 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
            >
              {{ group.label }}
            </li>
            <li
              v-for="item in group.items"
              :id="`command-search-${indexOf(group, item)}`"
              :key="`${group.id}:${item.id}`"
              role="option"
              :aria-selected="indexOf(group, item) === active"
            >
              <button
                type="button"
                tabindex="-1"
                class="flex w-full items-center gap-3 px-3 py-2 text-left text-sm"
                :class="indexOf(group, item) === active ? 'bg-muted' : 'hover:bg-muted/50'"
                @mouseenter="active = indexOf(group, item)"
                @mousedown.prevent
                @click="choose(indexOf(group, item))"
              >
                <span class="min-w-0 flex-1">
                  <span class="block truncate">{{ item.label }}</span>
                  <span v-if="item.detail" class="block truncate text-xs text-muted-foreground">
                    {{ item.detail }}
                  </span>
                </span>
                <ArrowUpRight class="h-3 w-3 shrink-0 text-muted-foreground" />
              </button>
            </li>
          </template>
        </ul>
        <p v-if="!flat.length && !loading" role="status" class="px-3 py-5 text-sm text-muted-foreground">
          {{ emptyLabel }}
        </p>
      </div>
    </div>
  </div>
</template>
