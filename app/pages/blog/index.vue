<script setup lang="ts">
import type { NexoraBlogPost } from '~/composables/useTenant'

const { tenant } = useTenant()
const config     = useRuntimeConfig()
const posts      = ref<NexoraBlogPost[]>([])
const loading    = ref(true)

const blogTitle = computed(() => tenant.value.blog?.title || 'Blog')
const route = useRoute()
const authorOf = (p: NexoraBlogPost) => p.authorName || tenant.value.companyName || ''

// Tag-Filter über die Adresse (/blog?tag=ki): Tags sind anklickbar, die Auswahl bleibt teilbar
const norm = (t: string) => t.trim().toLowerCase()
const activeTag = computed(() => (typeof route.query.tag === 'string' ? route.query.tag : ''))
const allTags = computed(() => {
  const m = new Map<string, { tag: string; n: number }>()
  for (const p of posts.value) for (const t of p.tags || []) { const k = norm(t); if (!k) continue; const e = m.get(k); if (e) e.n++; else m.set(k, { tag: t.trim(), n: 1 }) }
  return [...m.values()].sort((a, b) => b.n - a.n || a.tag.localeCompare(b.tag, 'de'))
})
const shownPosts = computed(() => (activeTag.value ? posts.value.filter(p => (p.tags || []).some(t => norm(t) === norm(activeTag.value))) : posts.value))
const goTag = (tag: string) => navigateTo(tag ? { path: '/blog', query: { tag } } : { path: '/blog' })

onMounted(async () => {
  const apiUrl   = config.public.plexoraApiUrl as string
  const tenantId = tenant.value.tenantId
  if (!tenantId) { loading.value = false; return }
  try {
    const res = await $fetch<{ posts: NexoraBlogPost[] }>(`${apiUrl}/api/public/${tenantId}/blog`)
    posts.value = res.posts || []
  } catch {}
  loading.value = false
})

useHead({ title: computed(() => `${blogTitle.value} · ${tenant.value.companyName}`) })

function formatDate(d?: string) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })
}
</script>

<template>
  <div style="background:var(--nx-bg);color:var(--nx-text);min-height:100vh;font-family:'Inter',system-ui,sans-serif">
    <NexoraNavbar />

    <div style="max-width:960px;margin:0 auto;padding:100px 24px 80px">
      <!-- Header -->
      <div style="margin-bottom:48px">
        <div style="font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:var(--nx-muted);margin-bottom:12px">{{ blogTitle }}</div>
        <h1 style="font-size:clamp(28px,5vw,48px);font-weight:800;letter-spacing:-.03em;line-height:1.1;margin:0">
          Neuigkeiten & Einblicke
        </h1>
      </div>

      <!-- Tags: Klick filtert die Beiträge -->
      <div v-if="allTags.length" style="display:flex;flex-wrap:wrap;gap:8px;margin:-24px 0 32px" role="navigation" aria-label="Beiträge nach Tag filtern">
        <button @click="goTag('')" :style="`font:inherit;font-size:12px;font-weight:700;padding:5px 12px;border-radius:20px;cursor:pointer;border:1px solid ${!activeTag ? 'var(--nx-accent)' : 'var(--nx-border)'};background:${!activeTag ? 'var(--nx-accent)' : 'var(--nx-surface)'};color:${!activeTag ? '#fff' : 'var(--nx-muted)'}`">Alle</button>
        <button v-for="t in allTags" :key="t.tag" @click="goTag(t.tag)" :aria-pressed="norm(activeTag) === norm(t.tag)"
          :style="`font:inherit;font-size:12px;font-weight:700;padding:5px 12px;border-radius:20px;cursor:pointer;border:1px solid ${norm(activeTag) === norm(t.tag) ? 'var(--nx-accent)' : 'var(--nx-border)'};background:${norm(activeTag) === norm(t.tag) ? 'var(--nx-accent)' : 'var(--nx-surface)'};color:${norm(activeTag) === norm(t.tag) ? '#fff' : 'var(--nx-muted)'}`">{{ t.tag }} <span style="opacity:.6">{{ t.n }}</span></button>
      </div>
      <div v-if="activeTag && !loading" style="font-size:13px;color:var(--nx-muted);margin:-12px 0 24px">Beiträge mit dem Tag <strong style="color:var(--nx-text)">{{ activeTag }}</strong>: {{ shownPosts.length }}</div>

      <!-- Loading -->
      <div v-if="loading" style="display:flex;justify-content:center;padding:60px 0;color:var(--nx-muted)">
        <i class="ti ti-loader-2 spin" style="font-size:24px"></i>
      </div>

      <!-- Empty -->
      <div v-else-if="!shownPosts.length" style="text-align:center;padding:80px 0;color:var(--nx-muted)">
        <i class="ti ti-pencil-off" style="font-size:40px;opacity:.3;display:block;margin-bottom:12px"></i>
        <p style="font-size:14px">{{ activeTag ? 'Keine Beiträge mit diesem Tag.' : 'Noch keine Beiträge veröffentlicht.' }}</p>
        <button v-if="activeTag" @click="goTag('')" style="font:inherit;font-size:13px;color:var(--nx-accent);background:none;border:none;cursor:pointer;margin-top:8px">Alle Beiträge zeigen</button>
      </div>

      <!-- Grid -->
      <div v-else style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px">
        <NuxtLink v-for="p in shownPosts" :key="p.postId" :to="`/blog/${p.slug}`"
          style="text-decoration:none;display:flex;flex-direction:column;background:var(--nx-surface);border:1px solid var(--nx-border);border-radius:12px;overflow:hidden;transition:border-color .2s,transform .15s;cursor:pointer"
          onmouseover="this.style.borderColor='var(--nx-accent)';this.style.transform='translateY(-2px)'"
          onmouseout="this.style.borderColor='var(--nx-border)';this.style.transform='translateY(0)'">
          <div v-if="p.coverImageUrl" style="aspect-ratio:16/9;overflow:hidden;background:var(--nx-bg)">
            <img :src="p.coverImageUrl" :alt="p.title" style="width:100%;height:100%;object-fit:cover" />
          </div>
          <div style="padding:20px;flex:1;display:flex;flex-direction:column;gap:8px">
            <div v-if="p.tags?.length" style="display:flex;flex-wrap:wrap;gap:6px">
              <span v-for="tag in p.tags.slice(0,3)" :key="tag" role="link" tabindex="0" :title="`Alle Beiträge mit dem Tag ${tag}`" @click.prevent.stop="goTag(tag)" @keydown.enter.prevent.stop="goTag(tag)"
                style="font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:3px 8px;border-radius:20px;background:var(--nx-bg);color:var(--nx-muted);border:1px solid var(--nx-border)">
                {{ tag }}
              </span>
            </div>
            <h2 style="font-size:16px;font-weight:700;color:var(--nx-text);line-height:1.3;margin:0">{{ p.title }}</h2>
            <p v-if="p.excerpt" style="font-size:13px;color:var(--nx-muted);line-height:1.5;margin:0;flex:1">{{ p.excerpt }}</p>
            <div style="font-size:11px;color:var(--nx-muted);margin-top:8px">{{ authorOf(p) ? 'von ' + authorOf(p) + ' · ' : '' }}{{ formatDate(p.publishedAt) }}</div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <NexoraFooter />
  </div>
</template>
