<script setup lang="ts">
import { marked } from 'marked'

const route    = useRoute()
const { tenant } = useTenant()
const config   = useRuntimeConfig()

interface FullPost {
  postId: string; title: string; slug: string; excerpt: string
  content: string; contentType: string; coverImageUrl?: string
  tags?: string[]; authorName?: string; publishedAt?: string
}

const post    = ref<FullPost | null>(null)
const loading = ref(true)

onMounted(async () => {
  const apiUrl   = config.public.plexoraApiUrl as string
  const tenantId = tenant.value.tenantId
  if (!tenantId) { loading.value = false; return }
  try {
    const res = await $fetch<{ post: FullPost }>(`${apiUrl}/api/public/${tenantId}/blog/${route.params.slug}`)
    post.value = res.post
  } catch {}
  loading.value = false
})

const renderedContent = computed(() => {
  if (!post.value) return ''
  if (post.value.contentType === 'markdown') return marked(post.value.content) as string
  return post.value.content
})

useHead({
  title: computed(() => post.value ? `${post.value.title} · ${tenant.value.companyName}` : tenant.value.companyName),
})

function formatDate(d?: string) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })
}
</script>

<template>
  <div style="background:var(--nx-bg);color:var(--nx-text);min-height:100vh;font-family:'Inter',system-ui,sans-serif">
    <NexoraNavbar />

    <div v-if="loading" style="display:flex;justify-content:center;padding:120px 0;color:var(--nx-muted)">
      <i class="ti ti-loader-2 spin" style="font-size:24px"></i>
    </div>

    <div v-else-if="post" style="max-width:768px;margin:0 auto;padding:100px 24px 80px">
      <NuxtLink to="/blog"
        style="display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--nx-muted);text-decoration:none;margin-bottom:40px;transition:color .15s"
        onmouseover="this.style.color='var(--nx-text)'"
        onmouseout="this.style.color='var(--nx-muted)'">
        ← Blog
      </NuxtLink>

      <div v-if="post.tags?.length" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px">
        <NuxtLink v-for="tag in post.tags" :key="tag" :to="{ path: '/blog', query: { tag } }" :title="`Alle Beiträge mit dem Tag ${tag}`"
          style="text-decoration:none;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:3px 8px;border-radius:20px;background:var(--nx-surface);color:var(--nx-muted);border:1px solid var(--nx-border)">
          {{ tag }}
        </NuxtLink>
      </div>

      <h1 style="font-size:clamp(24px,4vw,40px);font-weight:800;letter-spacing:-.03em;line-height:1.15;margin:0 0 12px">{{ post.title }}</h1>
      <div style="font-size:13px;color:var(--nx-muted);margin-bottom:32px">{{ (post.authorName || tenant.companyName) ? 'von ' : '' }}<strong v-if="post.authorName || tenant.companyName" style="color:var(--nx-text);font-weight:600">{{ post.authorName || tenant.companyName }}</strong>{{ (post.authorName || tenant.companyName) ? ' · ' : '' }}{{ formatDate(post.publishedAt) }}</div>

      <div v-if="post.coverImageUrl" style="border-radius:12px;overflow:hidden;margin-bottom:40px;aspect-ratio:16/9;background:var(--nx-surface)">
        <img :src="post.coverImageUrl" :alt="post.title" style="width:100%;height:100%;object-fit:cover" />
      </div>

      <div class="prose-content prose-blog" v-html="renderedContent" />
    </div>

    <div v-else style="max-width:768px;margin:0 auto;padding:120px 24px;text-align:center;color:var(--nx-muted)">
      <p style="font-size:14px;margin-bottom:16px">Beitrag nicht gefunden.</p>
      <NuxtLink to="/blog" style="font-size:12px;color:var(--nx-accent);text-decoration:none">← Zurück zum Blog</NuxtLink>
    </div>

    <NexoraFooter />
  </div>
</template>

<style scoped>
.prose-content { font-size: 15px; line-height: 1.8; color: var(--nx-text); }
/* Clearfix: verhindert, dass der Beitrag optisch "abreißt", wenn ein linksbündiges
   Bild höher ist als der danach folgende Text */
.prose-content::after { content: ''; display: table; clear: both; }
</style>
<style>
/* Beitragsformatierung ohne Gewicht (:where): eigene Farben und Stile im Beitrag gewinnen */
:where(.prose-blog) :where(h1) { font-size: 28px; font-weight: 800; letter-spacing: -.02em; margin: 40px 0 16px; color: var(--nx-text); }
:where(.prose-blog) :where(h2) { font-size: 22px; font-weight: 700; margin: 36px 0 14px; color: var(--nx-text); }
:where(.prose-blog) :where(h3) { font-size: 18px; font-weight: 700; margin: 28px 0 12px; color: var(--nx-text); }
:where(.prose-blog) :where(p) { margin: 0 0 18px; }
:where(.prose-blog) :where(ul), :where(.prose-blog) :where(ol) { margin: 0 0 18px; padding-left: 24px; }
:where(.prose-blog) :where(li) { margin-bottom: 6px; }
:where(.prose-blog) :where(a) { color: var(--nx-accent); }
:where(.prose-blog) :where(strong) { font-weight: 700; color: var(--nx-text); }
:where(.prose-blog) :where(blockquote) { border-left: 3px solid var(--nx-accent); padding-left: 16px; color: var(--nx-muted); margin: 0 0 18px; }
:where(.prose-blog) :where(code) { background: var(--nx-surface); border-radius: 4px; padding: 2px 6px; font-size: 13px; }
:where(.prose-blog) :where(pre) { background: var(--nx-surface); border-radius: 8px; padding: 16px; overflow-x: auto; margin: 0 0 18px; }
:where(.prose-blog) :where(img) { max-width: 100%; height: auto; border-radius: 10px; }
</style>
