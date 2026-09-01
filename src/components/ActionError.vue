<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { cn } from '../lib/utils'

/** Something the reader tried that did not work.
 *
 * Takes the message rather than reading it from shared state, so an
 * application keeps whatever it already uses to hold and expire one.
 */

interface Props {
  /** Absent or empty renders nothing, so a caller can place this unconditionally. */
  message?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), { message: '' })

const emit = defineEmits<{ dismiss: [] }>()
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-200 ease-out"
    enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <div
      v-if="message"
      :class="cn(
        'flex items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive',
        props.class,
      )"
      role="alert"
    >
      <span>{{ message }}</span>
      <button type="button" class="shrink-0" aria-label="Dismiss" @click="emit('dismiss')">
        <X class="h-4 w-4" />
      </button>
    </div>
  </Transition>
</template>
