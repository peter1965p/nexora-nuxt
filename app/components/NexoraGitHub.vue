<script setup lang="ts">
import { useTenant } from '~/composables/useTenant'

const { tenant } = useTenant()

const github = computed(() => tenant.value.github)
const accent = computed(() => tenant.value.branding.primaryColor || '#f97316')

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f7df1e', Vue: '#42b883',
  Python: '#3572a5', Go: '#00add8', Rust: '#dea584',
  Java: '#b07219', CSS: '#563d7c', HTML: '#e34c26',
  Shell: '#89e051', Dart: '#00b4ab', Swift: '#f05138',
}

function langColor(lang: string) {
  return LANG_COLORS[lang] || '#64748b'
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days < 1) return 'heute'
  if (days < 7) return `vor ${days}d`
  if (days < 30) return `vor ${Math.floor(days / 7)}w`
  if (days < 365) return `vor ${Math.floor(days / 30)}mo`
  return `vor ${Math.floor(days / 365)}j`
}
</script>

<template>
  <section v-if="github?.enabled && github.repos?.length"
    style="padding:48px 0;border-top:1px solid var(--nx-border)">
    <div style="max-width:1100px;margin:0 auto;padding:0 24px">

      <!-- Header -->
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:32px">
        <span style="font-size:10px;font-weight:700;letter-spacing:.2em;color:var(--nx-muted)">
          {{ github.title || 'PROJEKTE' }}
        </span>
        <div style="flex:1;height:1px;background:var(--nx-border)"></div>
        <i class="ti ti-brand-github" style="font-size:16px;color:var(--nx-muted)"></i>
      </div>

      <!-- Grid -->
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px">
        <a v-for="repo in github.repos" :key="repo.name"
          :href="repo.url" target="_blank" rel="noopener noreferrer"
          style="display:block;text-decoration:none;padding:20px;border:1px solid var(--nx-border);border-radius:12px;background:var(--nx-surface);transition:all .2s;cursor:pointer"
          onmouseover="this.style.borderColor='var(--nx-accent)';this.style.transform='translateY(-2px)'"
          onmouseout="this.style.borderColor='var(--nx-border)';this.style.transform='translateY(0)'">

          <!-- Repo name + external link -->
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:8px">
            <div style="display:flex;align-items:center;gap:8px">
              <i class="ti ti-code" style="font-size:14px;flex-shrink:0" :style="`color:${accent}`"></i>
              <span style="font-size:13px;font-weight:700;font-family:ui-monospace,monospace;color:var(--nx-text)"
                :style="`color:${accent}`">{{ repo.name }}</span>
            </div>
            <i class="ti ti-external-link" style="font-size:12px;color:var(--nx-muted);flex-shrink:0;margin-top:2px"></i>
          </div>

          <!-- Description -->
          <p v-if="repo.description"
            style="font-size:12px;color:var(--nx-muted);line-height:1.5;margin:0 0 14px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">
            {{ repo.description }}
          </p>

          <!-- Topics -->
          <div v-if="repo.topics?.length" style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:12px">
            <span v-for="topic in repo.topics.slice(0, 4)" :key="topic"
              style="font-size:10px;padding:2px 8px;border-radius:9999px;font-family:monospace;font-weight:600;letter-spacing:.04em"
              :style="`background:${accent}18;color:${accent};border:1px solid ${accent}40`">
              {{ topic }}
            </span>
          </div>

          <!-- Footer: language + stars + updated -->
          <div style="display:flex;align-items:center;gap:12px;margin-top:auto">
            <div v-if="repo.language" style="display:flex;align-items:center;gap:5px">
              <span style="width:10px;height:10px;border-radius:50%;flex-shrink:0"
                :style="`background:${langColor(repo.language)}`"></span>
              <span style="font-size:11px;color:var(--nx-muted);font-family:monospace">{{ repo.language }}</span>
            </div>
            <div v-if="repo.stars" style="display:flex;align-items:center;gap:4px">
              <i class="ti ti-star" style="font-size:11px;color:var(--nx-muted)"></i>
              <span style="font-size:11px;color:var(--nx-muted)">{{ repo.stars }}</span>
            </div>
            <div v-if="repo.forks" style="display:flex;align-items:center;gap:4px">
              <i class="ti ti-git-fork" style="font-size:11px;color:var(--nx-muted)"></i>
              <span style="font-size:11px;color:var(--nx-muted)">{{ repo.forks }}</span>
            </div>
            <span style="font-size:11px;color:var(--nx-muted);margin-left:auto">{{ timeAgo(repo.updatedAt) }}</span>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>
