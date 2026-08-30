<script setup lang="ts">
import { controlVariants, type ControlSize } from '../lib/control'
import { cn } from '../lib/utils'

/** One of a known set. The options are the caller's, the look is not. */

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
  <select
    :value="modelValue"
    :class="cn(controlVariants({ size, invalid }), 'w-auto', props.class)"
    @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
  >
    <slot />
  </select>
</template>
