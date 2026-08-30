<script setup lang="ts">
import { ref } from 'vue'
import { Plus, X } from 'lucide-vue-next'
import Button from './Button.vue'
import Input from './Input.vue'
import { type ControlSize } from '../lib/control'
import { cn } from '../lib/utils'

/** Several of something, added one at a time and removed one at a time.
 *
 * A box of lines is a text editor pretending to be a list: nothing tells you
 * an entry is malformed, nothing stops two of the same, and removing one means
 * selecting exactly the right characters. Directories, globs and tags are all
 * lists, and all of them were being typed into a box.
 */

interface Props {
  modelValue?: string[]
  placeholder?: string
  /** What one entry is called, for the button and for whoever is not looking. */
  noun?: string
  /** Drawn in the typeface a path deserves. */
  mono?: boolean
  size?: ControlSize
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  noun: 'entry',
  mono: false,
  size: 'default',
})

const emit = defineEmits<{ 'update:modelValue': [string[]] }>()

const draft = ref('')

function add() {
  const one = draft.value.trim()
  // Adding the same thing twice is a person telling you it is already there.
  if (!one || props.modelValue.includes(one)) {
    draft.value = ''
    return
  }
  emit('update:modelValue', [...props.modelValue, one])
  draft.value = ''
}

function drop(one: string) {
  emit('update:modelValue', props.modelValue.filter((kept) => kept !== one))
}
</script>

<template>
  <div :class="cn('space-y-2', props.class)">
    <ul v-if="modelValue.length" class="space-y-1.5">
      <li
        v-for="one in modelValue"
        :key="one"
        class="flex items-center gap-2 rounded-md border bg-muted/40 py-1 pl-3 pr-1 text-sm"
      >
        <span :class="cn('min-w-0 flex-1 break-all', mono && 'font-mono text-xs')">{{ one }}</span>
        <Button variant="ghost" size="icon" class="h-6 w-6 shrink-0" :aria-label="`Remove ${one}`" @click="drop(one)">
          <X class="h-3.5 w-3.5" />
        </Button>
      </li>
    </ul>

    <div class="flex gap-2">
      <Input
        v-model="draft"
        :size="size"
        :placeholder="placeholder"
        :class="mono ? 'font-mono' : undefined"
        :aria-label="`Add ${noun}`"
        @keydown.enter.prevent="add"
      />
      <Button :size="size" variant="outline" class="shrink-0" :disabled="!draft.trim()" @click="add">
        <Plus class="mr-1.5 h-3.5 w-3.5" />
        Add
      </Button>
    </div>
  </div>
</template>
