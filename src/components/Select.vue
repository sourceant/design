<script setup lang="ts">
import { cn } from '../lib/utils'

/** One of a known set. The options are the caller's, the look is not. */

interface Props {
  modelValue?: string | number
  class?: string
}

const props = defineProps<Props>()
defineEmits<{ 'update:modelValue': [string] }>()
</script>

<template>
  <select
    :value="modelValue"
    :class="cn(
      'rounded-md border bg-card px-3 py-1.5 text-sm text-foreground outline-none transition-colors',
      'focus:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50',
      props.class,
    )"
    @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
  >
    <slot />
  </select>
</template>
