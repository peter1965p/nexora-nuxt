<script setup lang="ts">
import { marked } from 'marked'

const route  = useRoute()
const { tenant } = useTenant()

const page = computed(() =>
  tenant.value.pages?.find(p => p.slug === route.params.slug)
)

const renderedContent = computed(() => {
  if (!page.value) return ''
  if (page.value.contentType === 'markdown') {
    return marked(page.value.content) as string
  }
  return page.value.content
})

useHead({
  title: computed(() => page.value ? `${page.value.title} · ${tenant.value.companyName}` : tenant.value.companyName),
})
</script>

<template>
  <div style="background:var(--nx-bg);color:var(--nx-text);min-height:100vh;font-family:ui-monospace,SFMono-Regular,'SF Mono',Consolas,monospace">
    <NexoraNavbar />

    <div v-if="page" class="max-w-3xl mx-auto px-6 md:px-12 py-24">
      <NuxtLink to="/" class="inline-flex items-center gap-2 text-xs uppercase tracking-widest mb-10 transition-colors" style="color:var(--nx-muted);text-decoration:none">
        <span>←</span> Zurück
      </NuxtLink>
      <div
        class="prose-content"
        v-html="renderedContent"
      />
    </div>

    <div v-else class="max-w-3xl mx-auto px-6 py-24 text-center" style="color:var(--nx-muted)">
      <p class="text-sm">Seite nicht gefunden.</p>
      <NuxtLink to="/" class="text-xs mt-4 inline-block" style="color:var(--nx-accent)">← Zurück</NuxtLink>
    </div>

    <footer class="w-full px-6 md:px-16 py-8 border-t" style="border-color:var(--nx-border)">
      <div class="flex justify-between items-center">
        <p class="text-[10px] uppercase tracking-[0.4em]" style="color:var(--nx-muted)">
          © {{ new Date().getFullYear() }} {{ tenant.companyName }}
        </p>
        <NuxtLink to="/" class="text-[10px] uppercase tracking-widest" style="color:var(--nx-muted);text-decoration:none">Home</NuxtLink>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.prose-content :deep(h1) { font-size: 2rem; font-weight: 900; margin-bottom: 1.5rem; color: var(--nx-text); }
.prose-content :deep(h2) { font-size: 1.25rem; font-weight: 700; margin: 2rem 0 1rem; color: var(--nx-text); }
.prose-content :deep(h3) { font-size: 1rem; font-weight: 700; margin: 1.5rem 0 .75rem; color: var(--nx-text); }
.prose-content :deep(p)  { font-size: 0.875rem; line-height: 1.75; color: var(--nx-muted); margin-bottom: 1rem; }
.prose-content :deep(a)  { color: var(--nx-accent); text-decoration: none; }
.prose-content :deep(strong) { color: var(--nx-text); font-weight: 700; }
.prose-content :deep(ul) { padding-left: 1.5rem; margin-bottom: 1rem; }
.prose-content :deep(li) { font-size: 0.875rem; color: var(--nx-muted); margin-bottom: .25rem; }
</style>
