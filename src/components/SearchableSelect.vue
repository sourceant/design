<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Check, ChevronDown, Search } from 'lucide-vue-next'
import { controlVariants, type ControlSize } from '../lib/control'
import { cn } from '../lib/utils'

/**
 * One of a known set, found by typing.
 *
 * A native select is fine for a handful of options and useless for a hundred:
 * a provider names its models and nobody remembers the spelling, so the list
 * has to be searchable to be usable at all.
 */

export interface SearchableSelectOption {
  value: string
  label: string
  /** Said beside the label, for anything the label alone leaves ambiguous. */
  hint?: string
  /** The heading this sits under. Options with no group come first, ungrouped. */
  group?: string
}

const props = withDefaults(defineProps<{
  modelValue?: string
  options: SearchableSelectOption[]
  placeholder?: string
  searchPlaceholder?: string
  /** Offered above every option, for "nothing chosen". */
  emptyLabel?: string
  size?: ControlSize
  class?: string
  invalid?: boolean
  disabled?: boolean
}>(), {
  modelValue: '',
  placeholder: 'Choose one',
  searchPlaceholder: 'Search',
  size: 'default',
  invalid: false,
  disabled: false,
})

const emit = defineEmits<{ 'update:modelValue': [string] }>()

const open = ref(false)
const term = ref('')
const active = ref(0)
const root = ref<HTMLElement | null>(null)
const field = ref<HTMLInputElement | null>(null)

const chosen = computed(() => props.options.find(one => one.value === props.modelValue))
const shown = computed(() => {
  const wanted = term.value.trim().toLowerCase()
  if (!wanted) return props.options
  return props.options.filter(one =>
    one.label.toLowerCase().includes(wanted)
    || one.value.toLowerCase().includes(wanted)
    || (one.group ?? '').toLowerCase().includes(wanted)
    || (one.hint ?? '').toLowerCase().includes(wanted),
  )
})

/** What the keyboard walks: the empty row, when offered, and then the options. */
const walkable = computed<(SearchableSelectOption | null)[]>(() =>
  props.emptyLabel ? [null, ...shown.value] : [...shown.value],
)

/**
 * Where each heading falls, rather than a nested list.
 *
 * Grouping by rendering a list per group would make the index the keyboard
 * counts differ from the order on screen, and the two disagreeing is how an
 * arrow key selects the wrong thing.
 */
function headingBefore(option: SearchableSelectOption, index: number): string {
  const previous = shown.value[index - 1]
  return option.group && option.group !== previous?.group ? option.group : ''
}

function choose(value: string) {
  emit('update:modelValue', value)
  close()
}

function close() {
  open.value = false
  term.value = ''
}

async function show() {
  if (props.disabled) return
  open.value = true
  active.value = Math.max(0, walkable.value.findIndex(one => one?.value === props.modelValue))
  await nextTick()
  field.value?.focus()
}

function onKey(event: KeyboardEvent) {
  if (!open.value) {
    if (event.key === 'Enter' || event.key === 'ArrowDown' || event.key === ' ') {
      event.preventDefault()
      show()
    }
    return
  }

  if (event.key === 'Escape') { close(); return }
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    active.value = Math.min(active.value + 1, walkable.value.length - 1)
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    active.value = Math.max(active.value - 1, 0)
  }
  if (event.key === 'Enter') {
    event.preventDefault()
    const one = walkable.value[active.value]
    if (one !== undefined) choose(one?.value ?? '')
  }
}

watch(term, () => { active.value = 0 })

function onOutside(event: MouseEvent) {
  if (open.value && root.value && !root.value.contains(event.target as Node)) close()
}

onMounted(() => document.addEventListener('mousedown', onOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', onOutside))
</script>

<template>
  <div ref="root" class="relative">
    <button
      type="button"
      role="combobox"
      :aria-expanded="open"
      :disabled="disabled"
      :class="cn(controlVariants({ size, invalid }), 'flex items-center gap-2 text-left', props.class)"
      @click="open ? close() : show()"
      @keydown="onKey"
    >
      <span class="min-w-0 flex-1 truncate" :class="chosen ? '' : 'text-muted-foreground'">
        {{ chosen?.label ?? (modelValue || placeholder) }}
      </span>
      <ChevronDown class="h-4 w-4 shrink-0 text-muted-foreground" />
    </button>

    <div
      v-if="open"
      class="absolute z-50 mt-1 w-full overflow-hidden rounded-md border bg-card shadow-lg"
    >
      <div class="relative border-b">
        <Search class="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          ref="field"
          v-model="term"
          class="w-full bg-transparent py-2 pl-8 pr-2 text-sm outline-none placeholder:text-muted-foreground"
          :placeholder="searchPlaceholder"
          @keydown="onKey"
        >
      </div>

      <div class="max-h-64 overflow-y-auto p-1">
        <button
          v-if="emptyLabel"
          type="button"
          class="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm"
          :class="active === 0 ? 'bg-muted' : 'hover:bg-muted/60'"
          @click="choose('')"
          @mousemove="active = 0"
        >
          <Check class="h-3.5 w-3.5 shrink-0" :class="modelValue ? 'opacity-0' : ''" />
          <span class="min-w-0 flex-1 truncate text-muted-foreground">{{ emptyLabel }}</span>
        </button>

        <template v-for="(one, i) in shown" :key="one.value">
          <p
            v-if="headingBefore(one, i)"
            class="px-2 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
          >
            {{ one.group }}
          </p>
          <button
            type="button"
            class="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm"
            :class="active === (emptyLabel ? i + 1 : i) ? 'bg-muted' : 'hover:bg-muted/60'"
            @click="choose(one.value)"
            @mousemove="active = emptyLabel ? i + 1 : i"
          >
            <Check class="h-3.5 w-3.5 shrink-0" :class="one.value === modelValue ? '' : 'opacity-0'" />
            <span class="min-w-0 flex-1 truncate">{{ one.label }}</span>
            <span v-if="one.hint" class="shrink-0 text-[11px] text-muted-foreground">{{ one.hint }}</span>
          </button>
        </template>

        <p v-if="!shown.length" class="px-2 py-6 text-center text-sm text-muted-foreground">
          Nothing matches.
        </p>
      </div>
    </div>
  </div>
</template>
