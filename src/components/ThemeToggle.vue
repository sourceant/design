<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'
import { cn } from '../lib/utils'
import { useTheme } from '../composables/useTheme'

/** Switching between the light and dark theme. */

interface Props {
  class?: string
}

const props = defineProps<Props>()

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <button
    type="button"
    :class="cn('rounded-lg p-2 transition-colors hover:bg-accent', props.class)"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="toggleTheme"
  >
    <Sun v-if="isDark" class="h-5 w-5 text-muted-foreground" />
    <Moon v-else class="h-5 w-5 text-muted-foreground" />
  </button>
</template>
