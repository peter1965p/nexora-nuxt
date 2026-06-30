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
  <div style="background:var(--nx-bg);color:var(--nx-text);min-height:100vh;font-family:'Inter',system-ui,sans-serif">
    <NexoraNavbar />

    <div v-if="page" style="max-width:768px;margin:0 auto;padding:100px 24px 80px">
      <NuxtLink to="/"
        style="display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--nx-muted);text-decoration:none;margin-bottom:40px;transition:color .15s"
        onmouseover="this.style.color='var(--nx-text)'"
        onmouseout="this.style.color='var(--nx-muted)'">
        ← Zurück
      </NuxtLink>
      <div class="prose-content" v-html="renderedContent" />
    </div>

    <div v-else style="max-width:768px;margin:0 auto;padding:120px 24px;text-align:center;color:var(--nx-muted)">
      <p style="font-size:14px;margin-bottom:16px">Seite nicht gefunden.</p>
      <NuxtLink to="/" style="font-size:12px;color:var(--nx-accent);text-decoration:none">← Zurück zur Startseite</NuxtLink>
    </div>

    <NexoraFooter />
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
