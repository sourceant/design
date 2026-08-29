<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import { computed } from 'vue'
import { cn } from '../lib/utils'

/** Prose somebody wrote in markdown, drawn as prose.
 *
 * The colours come from the design tokens rather than from the typography
 * plugin's own, so a page reads the same in either theme without a second
 * palette to keep in step.
 *
 * HTML in the source is not rendered. What goes through here is written by
 * whoever is using the product, and a component that runs their markup is a
 * component that runs anybody's.
 */

interface Props {
  source?: string
  class?: string
}

const props = defineProps<Props>()

const markdown = new MarkdownIt({ html: false, linkify: true, breaks: false })

const rendered = computed(() => markdown.render(props.source ?? ''))

const TONE = [
  'prose prose-sm max-w-none',
  'prose-headings:text-foreground prose-headings:font-semibold',
  'prose-p:text-muted-foreground prose-li:text-muted-foreground',
  'prose-strong:text-foreground prose-em:text-foreground',
  'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
  'prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none',
  'prose-code:rounded prose-code:bg-muted/60 prose-code:px-1 prose-code:py-0.5',
  'prose-pre:bg-muted/50 prose-pre:text-foreground prose-pre:border',
  'prose-blockquote:border-border prose-blockquote:text-muted-foreground',
  'prose-hr:border-border prose-th:text-foreground prose-td:text-muted-foreground',
].join(' ')
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -- markdown-it is configured to
       render no HTML, so what reaches here is markup this component made. -->
  <div :class="cn(TONE, props.class)" v-html="rendered" />
</template>
