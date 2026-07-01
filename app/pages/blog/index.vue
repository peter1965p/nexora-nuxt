<script setup lang="ts">
import type { NexoraBlogPost } from '~/composables/useTenant'

const { tenant } = useTenant()
const config     = useRuntimeConfig()
const posts      = ref<NexoraBlogPost[]>([])
const loading    = ref(true)

const blogTitle = computed(() => tenant.value.blog?.title || 'Blog')

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

      <!-- Loading -->
      <div v-if="loading" style="display:flex;justify-content:center;padding:60px 0;color:var(--nx-muted)">
        <i class="ti ti-loader-2 spin" style="font-size:24px"></i>
      </div>

      <!-- Empty -->
      <div v-else-if="!posts.length" style="text-align:center;padding:80px 0;color:var(--nx-muted)">
        <i class="ti ti-pencil-off" style="font-size:40px;opacity:.3;display:block;margin-bottom:12px"></i>
        <p style="font-size:14px">Noch keine Beiträge veröffentlicht.</p>
      </div>

      <!-- Grid -->
      <div v-else style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px">
        <NuxtLink v-for="p in posts" :key="p.postId" :to="`/blog/${p.slug}`"
          style="text-decoration:none;display:flex;flex-direction:column;background:var(--nx-surface);border:1px solid var(--nx-border);border-radius:12px;overflow:hidden;transition:border-color .2s,transform .15s;cursor:pointer"
          onmouseover="this.style.borderColor='var(--nx-accent)';this.style.transform='translateY(-2px)'"
          onmouseout="this.style.borderColor='var(--nx-border)';this.style.transform='translateY(0)'">
          <div v-if="p.coverImageUrl" style="aspect-ratio:16/9;overflow:hidden;background:var(--nx-bg)">
            <img :src="p.coverImageUrl" :alt="p.title" style="width:100%;height:100%;object-fit:cover" />
          </div>
          <div style="padding:20px;flex:1;display:flex;flex-direction:column;gap:8px">
            <div v-if="p.tags?.length" style="display:flex;flex-wrap:wrap;gap:6px">
              <span v-for="tag in p.tags.slice(0,3)" :key="tag"
                style="font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:3px 8px;border-radius:20px;background:var(--nx-bg);color:var(--nx-muted);border:1px solid var(--nx-border)">
                {{ tag }}
              </span>
            </div>
            <h2 style="font-size:16px;font-weight:700;color:var(--nx-text);line-height:1.3;margin:0">{{ p.title }}</h2>
            <p v-if="p.excerpt" style="font-size:13px;color:var(--nx-muted);line-height:1.5;margin:0;flex:1">{{ p.excerpt }}</p>
            <div style="font-size:11px;color:var(--nx-muted);margin-top:8px">{{ formatDate(p.publishedAt) }}</div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <NexoraFooter />
  </div>
</template>
