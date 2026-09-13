<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next'
import UiButton from './Button.vue'
import UiModal from './Modal.vue'

/**
 * Asking before something cannot be undone.
 *
 * What is about to go is named, because the decision is which thing rather
 * than whether.
 */
withDefaults(defineProps<{
  open: boolean
  /** What is being decided, in a few words. */
  title: string
  /** What will happen, where the title does not already say it. */
  detail?: string
  /** The word on the button that goes through with it. */
  confirmLabel?: string
  cancelLabel?: string
  /** Whether going through with it destroys something. */
  destructive?: boolean
  busy?: boolean
}>(), {
  detail: '',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  destructive: true,
  busy: false,
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <UiModal :open="open" max-width="sm" @close="emit('cancel')">
    <div class="flex items-start gap-3">
      <span
        v-if="destructive"
        class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/10"
      >
        <AlertTriangle class="h-4 w-4 text-destructive" />
      </span>
      <div class="min-w-0">
        <h2 class="text-base font-semibold">{{ title }}</h2>
        <p v-if="detail" class="mt-1 text-sm text-muted-foreground">{{ detail }}</p>
      </div>
    </div>

    <div class="mt-5 flex justify-end gap-2">
      <UiButton variant="outline" size="sm" :disabled="busy" @click="emit('cancel')">
        {{ cancelLabel }}
      </UiButton>
      <UiButton
        :variant="destructive ? 'destructive' : 'default'"
        size="sm"
        :disabled="busy"
        @click="emit('confirm')"
      >
        {{ confirmLabel }}
      </UiButton>
    </div>
  </UiModal>
</template>
