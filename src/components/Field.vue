<script setup lang="ts">
import { cn } from '../lib/utils'

/** A label, what it controls, and whatever has to be said about it.
 *
 * Every form in the product had its own spelling of the same three lines, so
 * the label was uppercase in one place and not another. */

interface Props {
  label?: string
  /** Said under the control, for what a person needs to know before typing. */
  hint?: string
  /** Said instead of the hint, when something is wrong. */
  error?: string
  for?: string
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <div :class="cn('w-full', props.class)">
    <label
      v-if="label"
      :for="props.for"
      class="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground"
    >
      {{ label }}
      <slot name="label" />
    </label>
    <slot />
    <p v-if="error" class="mt-1 text-xs text-destructive">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-xs text-muted-foreground">{{ hint }}</p>
  </div>
</template>
