import { onMounted, ref } from 'vue'

/**
 * The light/dark preference, shared by everything that can change it.
 *
 * The class on the root element is the source of truth rather than the ref: an
 * application sets it before Vue mounts to avoid a flash of the wrong theme, so
 * reading it back on mount is what keeps a toggle from rendering the wrong icon
 * on first paint.
 *
 * The ref lives at module scope so every caller shares one, without depending
 * on a framework's state API. Under server rendering that means it is shared
 * across requests, which is harmless only because its value before mount is a
 * default nobody renders a decision from.
 */
const isDark = ref(true)

const STORAGE_KEY = 'theme'

export function useTheme() {
  function readFromDocument() {
    isDark.value = !document.documentElement.classList.contains('light')
  }

  function setTheme(dark: boolean) {
    isDark.value = dark
    document.documentElement.classList.toggle('dark', dark)
    document.documentElement.classList.toggle('light', !dark)
    try {
      localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
    } catch {
      // A browser refusing storage still gets the theme it asked for.
    }
  }

  function toggleTheme() {
    setTheme(!isDark.value)
  }

  onMounted(readFromDocument)

  return { isDark, toggleTheme, setTheme }
}
