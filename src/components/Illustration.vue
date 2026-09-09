<script setup lang="ts">
/** A named piece of line art, inlined so it can take the theme's colours.
 *
 * Inlined rather than loaded through <img> because the artwork has to be
 * recoloured for the dark theme, which is only reachable when the SVG is part
 * of the document.
 */

interface Props {
  name: string
}

const props = defineProps<Props>()

const modules = import.meta.glob('../assets/illustrations/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
})
const raw = modules[`../assets/illustrations/${props.name}.svg`] as string | undefined
</script>

<template>
  <div
    class="sa-illustration"
    :data-missing="raw ? undefined : name"
    aria-hidden="true"
    v-html="raw || ''"
  />
</template>

<style>
.sa-illustration {
  --primary-svg-color: hsl(var(--brand));
}
.sa-illustration svg {
  width: 100%;
  height: auto;
  display: block;
}

/*
 * unDraw art is drawn for light backgrounds. On the dark theme the structural
 * greys are remapped so the shapes read against the dark surface. Skin tones
 * and small accent dots are intentionally left untouched. Light theme keeps the
 * original artwork.
 */
html.dark .sa-illustration [fill="#2f2e41" i] { fill: #d7d8e2; }
html.dark .sa-illustration [stop-color="#2f2e41" i] { stop-color: #d7d8e2; }
html.dark .sa-illustration [fill="#3f3d56" i] { fill: #c3c5d4; }
html.dark .sa-illustration [stop-color="#3f3d56" i] { stop-color: #c3c5d4; }
html.dark .sa-illustration [fill="#575a89" i] { fill: #b6b8ca; }
html.dark .sa-illustration [fill="#454b69" i],
html.dark .sa-illustration [fill="#444053" i] { fill: #b2b4c6; }

html.dark .sa-illustration [fill="#f2f2f2" i],
html.dark .sa-illustration [fill="#f1f1f1" i],
html.dark .sa-illustration [fill="#f0f0f0" i] { fill: #3a3d4c; }
html.dark .sa-illustration [fill="#e6e6e6" i],
html.dark .sa-illustration [fill="#e5e5e5" i],
html.dark .sa-illustration [fill="#e4e4e4" i] { fill: #454a5a; }
html.dark .sa-illustration [fill="#d0d2d5" i],
html.dark .sa-illustration [fill="#cacaca" i],
html.dark .sa-illustration [fill="#cbcbcb" i],
html.dark .sa-illustration [fill="#ccc" i] { fill: #4a4e5e; }
html.dark .sa-illustration [fill="#fff" i],
html.dark .sa-illustration [fill="#ffffff" i] { fill: #cfd1dc; }
</style>
