<script setup lang="ts">
import { controlVariants, type ControlSize } from '../lib/control'
import { cn } from '../lib/utils'

/** One line of text. Every screen wrote these classes out by hand. */

interface Props {
  modelValue?: string | number
  /** The button's scale, so a row of controls comes out one height. */
  size?: ControlSize
  class?: string
  invalid?: boolean
}

const props = withDefaults(defineProps<Props>(), { size: 'default', invalid: false })
defineEmits<{ 'update:modelValue': [string] }>()
</script>

<template>
  <input
    :value="modelValue"
    :class="cn(controlVariants({ size, invalid }), props.class)"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  >
</template>
