<script setup lang="ts">
import { computed, ref } from 'vue'
import { Plus, X } from 'lucide-vue-next'
import { controlVariants } from '../lib/control'
import { cn } from '../lib/utils'

/**
 * Named things, each on or off, added and removed by name.
 *
 * Not a fixed set of switches: the names are the data. Somewhere that holds a
 * map of name to yes-or-no had been drawn as a row of hand-written checkboxes,
 * which meant a name nobody thought of in advance could not be said at all.
 *
 * A name that is present and off is not the same as a name nobody mentioned.
 * The first is a decision, the second is silence, and anything that collapses
 * them loses the difference.
 */

const props = withDefaults(defineProps<{
  modelValue: Record<string, boolean>
  /** Offered for one click, for the names most people want. */
  suggestions?: string[]
  /** What one of them is, for the empty state and the field. */
  noun?: string
  max?: number
  /** Longest a name may be, matching what the store will take. */
  maxLength?: number
  disabled?: boolean
  /** Said where nothing may be added, such as a file somebody else owns. */
  refusal?: string
  class?: string
}>(), {
  suggestions: () => [],
  noun: 'a name',
  max: 50,
  maxLength: 64,
  disabled: false,
})

const emit = defineEmits<{ 'update:modelValue': [Record<string, boolean>] }>()

const adding = ref('')

const named = computed(() => Object.keys(props.modelValue))
const spare = computed(() => props.suggestions.filter(one => !(one in props.modelValue)))
const full = computed(() => named.value.length >= props.max)

function set(name: string, on: boolean) {
  emit('update:modelValue', { ...props.modelValue, [name]: on })
}

function drop(name: string) {
  const left = { ...props.modelValue }
  delete left[name]
  emit('update:modelValue', left)
}

function add(name: string) {
  const wanted = name.trim().slice(0, props.maxLength)
  adding.value = ''
  if (!wanted || wanted in props.modelValue || full.value) return
  set(wanted, true)
}
</script>

<template>
  <div :class="cn('space-y-2', props.class)">
    <div v-if="named.length" class="flex flex-wrap gap-1.5">
      <span
        v-for="name in named"
        :key="name"
        :class="cn(
          'inline-flex items-center gap-1.5 rounded-full border py-0.5 pl-2.5 pr-1 text-xs',
          modelValue[name]
            ? 'border-primary/30 bg-primary/10 text-foreground'
            : 'border-border bg-muted/40 text-muted-foreground line-through',
        )"
      >
        <button
          type="button"
          class="font-medium"
          :disabled="disabled"
          :aria-pressed="modelValue[name]"
          :title="modelValue[name] ? `Turn ${name} off` : `Turn ${name} on`"
          @click="set(name, !modelValue[name])"
        >
          {{ name }}
        </button>
        <button
          type="button"
          class="rounded-full p-0.5 text-muted-foreground hover:text-foreground"
          :disabled="disabled"
          :aria-label="`Say nothing about ${name}`"
          @click="drop(name)"
        >
          <X class="h-3 w-3" />
        </button>
      </span>
    </div>
    <p v-else class="text-xs text-muted-foreground">Nothing said yet.</p>

    <div v-if="!disabled" class="flex flex-wrap items-center gap-1.5">
      <button
        v-for="one in spare"
        :key="one"
        type="button"
        class="inline-flex items-center gap-1 rounded-full border border-dashed px-2 py-0.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground"
        @click="add(one)"
      >
        <Plus class="h-3 w-3" />
        {{ one }}
      </button>
      <input
        v-model="adding"
        :disabled="full"
        :maxlength="maxLength"
        :placeholder="full ? `That is ${max}, which is the most` : `Add ${noun}`"
        :class="cn(controlVariants({ size: 'sm' }), 'w-40')"
        @keydown.enter.prevent="add(adding)"
      >
    </div>
    <p v-else-if="refusal" class="text-xs text-muted-foreground">{{ refusal }}</p>
  </div>
</template>
