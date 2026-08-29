<script setup lang="ts">
import { cn } from '../lib/utils'

/** One line of text. Every screen wrote these classes out by hand. */

interface Props {
  modelValue?: string | number
  class?: string
  invalid?: boolean
}

const props = defineProps<Props>()
defineEmits<{ 'update:modelValue': [string] }>()
</script>

<template>
  <input
    :value="modelValue"
    :class="cn(
      'w-full rounded-md border bg-muted/50 px-3 py-2 text-sm text-foreground outline-none transition-colors',
      'placeholder:text-muted-foreground focus:border-primary/50',
      'disabled:cursor-not-allowed disabled:opacity-50',
      invalid && 'border-destructive/60 focus:border-destructive',
      props.class,
    )"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  >
</template>
