<script setup lang="ts">
import { roomyVariants, type ControlSize } from '../lib/control'
import { cn } from '../lib/utils'

/** More than one line of text, and it grows downwards only. */

interface Props {
  modelValue?: string
  rows?: number
  /** The same scale as the other controls, minus the height its rows decide. */
  size?: ControlSize
  class?: string
  invalid?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  rows: 3,
  size: 'default',
  invalid: false,
})
defineEmits<{ 'update:modelValue': [string] }>()
</script>

<template>
  <textarea
    :value="modelValue"
    :rows="rows"
    :class="cn(roomyVariants({ size, invalid }), props.class)"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>
