<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { onMounted, onUnmounted, watch } from 'vue'
import { cn } from '../lib/utils'

/** A panel that comes in from the side, over what you were looking at.
 *
 * Takes the full height of the window, so a long piece of work stays readable
 * against a list that is still on screen behind it.
 */

interface Props {
  open: boolean
  /** Which edge it comes from. The right, unless something argues otherwise. */
  side?: 'left' | 'right'
  /**
   * How much of the window it takes.
   *
   * Below the small breakpoint every size is the whole width: a two-fifths
   * panel on a phone is a column too narrow to write in.
   */
  size?: 'sm' | 'md' | 'lg'
  /** A name for whoever is not looking at it. */
  label?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), { side: 'right', size: 'md' })

const emit = defineEmits<{ close: [] }>()

const sizes = {
  sm: 'w-full sm:w-[32%] sm:min-w-[22rem]',
  md: 'w-full sm:w-[40%] sm:min-w-[26rem]',
  lg: 'w-full sm:w-[55%] sm:min-w-[32rem]',
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

/**
 * The page behind does not scroll while this is open.
 *
 * Two scrolling regions under one wheel is the reason a drawer feels broken:
 * the panel reaches its end and the page carries on moving underneath it.
 */
watch(() => props.open, (open) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  if (typeof document !== 'undefined') document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="open" class="fixed inset-0 z-50">
        <div
          class="absolute inset-0 bg-background/80 backdrop-blur-sm"
          @click="emit('close')"
        />

        <Transition
          :enter-active-class="'transition-transform duration-200 ease-out'"
          :enter-from-class="side === 'left' ? '-translate-x-full' : 'translate-x-full'"
          enter-to-class="translate-x-0"
          :leave-active-class="'transition-transform duration-150 ease-in'"
          leave-from-class="translate-x-0"
          :leave-to-class="side === 'left' ? '-translate-x-full' : 'translate-x-full'"
          appear
        >
          <aside
            v-if="open"
            role="dialog"
            aria-modal="true"
            :aria-label="label"
            :class="cn(
              'absolute inset-y-0 flex max-w-full flex-col border-border bg-card shadow-lg',
              side === 'left' ? 'left-0 border-r' : 'right-0 border-l',
              sizes[size],
              props.class,
            )"
          >
            <button
              type="button"
              class="absolute right-3 top-3 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title="Close"
              @click="emit('close')"
            >
              <X class="h-4 w-4" />
            </button>

            <!-- The panel scrolls, not the page. Its own header stays where a
                 long form would otherwise carry it out of reach. -->
            <div class="min-h-0 flex-1 overflow-y-auto p-6">
              <slot />
            </div>

            <div v-if="$slots.footer" class="border-t p-4">
              <slot name="footer" />
            </div>
          </aside>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
