<script setup lang="ts">
import { cn } from '../lib/utils'

/** More than one line of text, and it grows downwards only. */

interface Props {
  modelValue?: string
  rows?: number
  class?: string
  invalid?: boolean
}

const props = withDefaults(defineProps<Props>(), { rows: 3 })
defineEmits<{ 'update:modelValue': [string] }>()
</script>

<template>
  <textarea
    :value="modelValue"
    :rows="rows"
    :class="cn(
      'w-full resize-y rounded-md border bg-muted/50 px-3 py-2 text-sm text-foreground outline-none transition-colors',
      'placeholder:text-muted-foreground focus:border-primary/50',
      'disabled:cursor-not-allowed disabled:opacity-50',
      invalid && 'border-destructive/60 focus:border-destructive',
      props.class,
    )"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>
