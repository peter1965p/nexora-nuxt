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

// Vollständige HTML-Dokumente (<!DOCTYPE html> oder <html>, mit eigenem <style> für body, :root usw.) werden isoliert in einem Rahmen gezeigt,
// so wie sie gedacht sind: ihr CSS wirkt nur dort (kein Eingriff in die Website) und ihre body-Stile (Hintergrund, Schriftfarbe) greifen.
// Ohne allow-scripts: Skripte im Inhalt laufen nicht. Links öffnen in der Hauptseite, außer sie haben ein eigenes target (z. B. _blank).
const isDocument = computed(() => !!page.value && page.value.contentType !== 'markdown' && /^\s*(<!doctype html|<html[\s>])/i.test(String(page.value.content || '')))
const docHtml = computed(() => {
  const html = String(page.value?.content || '')
  return /<head[^>]*>/i.test(html) ? html.replace(/<head[^>]*>/i, m => m + '<base target="_top">') : '<base target="_top">' + html
})
const frame = ref<HTMLIFrameElement | null>(null)
function measure() {
  const f = frame.value, doc = f?.contentDocument
  if (!f || !doc) return
  f.style.height = '120px'                       // erst klein: ein "min-height: 100vh" im Inhalt soll nicht die alte Höhe festhalten
  f.style.height = Math.ceil(Math.max(doc.documentElement.scrollHeight, doc.body?.scrollHeight || 0)) + 'px'
}
function onFrameLoad() { measure(); setTimeout(measure, 300); setTimeout(measure, 1500) }   // nach Bildern und Schriften noch einmal
let resizeTimer: ReturnType<typeof setTimeout> | undefined
const onResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(measure, 150) }
onMounted(() => window.addEventListener('resize', onResize))
onBeforeUnmount(() => { window.removeEventListener('resize', onResize); clearTimeout(resizeTimer) })

useHead({
  title: computed(() => page.value ? `${page.value.title} · ${tenant.value.companyName}` : tenant.value.companyName),
})
</script>

<template>
  <div style="background:var(--nx-bg);color:var(--nx-text);min-height:100vh;font-family:'Inter',system-ui,sans-serif">
    <NexoraNavbar />

    <div v-if="page && isDocument" style="padding-top:68px">
      <iframe ref="frame" :srcdoc="docHtml" :title="page.title" sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox" scrolling="no"
        style="display:block;width:100%;border:0;min-height:300px" @load="onFrameLoad" />
    </div>

    <div v-else-if="page" style="max-width:768px;margin:0 auto;padding:100px 24px 80px">
      <NuxtLink to="/"
        style="display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--nx-muted);text-decoration:none;margin-bottom:40px;transition:color .15s"
        onmouseover="this.style.color='var(--nx-text)'"
        onmouseout="this.style.color='var(--nx-muted)'">
        ← Zurück
      </NuxtLink>
      <div class="prose-page" v-html="renderedContent" />
    </div>

    <div v-else style="max-width:768px;margin:0 auto;padding:120px 24px;text-align:center;color:var(--nx-muted)">
      <p style="font-size:14px;margin-bottom:16px">Seite nicht gefunden.</p>
      <NuxtLink to="/" style="font-size:12px;color:var(--nx-accent);text-decoration:none">← Zurück zur Startseite</NuxtLink>
    </div>

    <NexoraFooter />
  </div>
</template>

<style>
/* Standard-Formatierung für Seiteninhalte. Mit :where() haben diese Regeln kein Gewicht: eigene Farben, Klassen und Inline-Stile im Inhalt
   (z. B. dunkle Karten mit heller Schrift) gewinnen immer. Vorher überschrieben diese Regeln deren Überschriften- und Textfarben. */
:where(.prose-page) :where(h1) { font-size: 2rem; font-weight: 900; margin-bottom: 1.5rem; color: var(--nx-text); }
:where(.prose-page) :where(h2) { font-size: 1.25rem; font-weight: 700; margin: 2rem 0 1rem; color: var(--nx-text); }
:where(.prose-page) :where(h3) { font-size: 1rem; font-weight: 700; margin: 1.5rem 0 .75rem; color: var(--nx-text); }
:where(.prose-page) :where(p)  { font-size: 0.875rem; line-height: 1.75; color: var(--nx-muted); margin-bottom: 1rem; }
:where(.prose-page) :where(a)  { color: var(--nx-accent); text-decoration: none; }
:where(.prose-page) :where(strong) { color: var(--nx-text); font-weight: 700; }
:where(.prose-page) :where(ul) { padding-left: 1.5rem; margin-bottom: 1rem; }
:where(.prose-page) :where(li) { font-size: 0.875rem; color: var(--nx-muted); margin-bottom: .25rem; }
</style>
