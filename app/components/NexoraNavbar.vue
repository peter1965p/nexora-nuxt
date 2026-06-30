<script setup lang="ts">
const { tenant } = useTenant()
const menuOpen   = ref(false)
const accent     = computed(() => tenant.value.branding.primaryColor || '#f97316')
const pages      = computed(() => tenant.value.pages || [])

const route = useRoute()
watch(() => route.fullPath, () => { menuOpen.value = false })
</script>

<template>
  <header style="position:fixed;top:0;left:0;width:100%;z-index:100;font-family:'Inter',system-ui,sans-serif">
    <div style="max-width:1200px;margin:0 auto;padding:0 24px;height:68px;display:flex;align-items:center;gap:32px">

      <!-- Logo -->
      <NuxtLink to="/" style="display:flex;align-items:center;gap:10px;text-decoration:none;flex-shrink:0">
        <div v-if="tenant.branding.logoUrl">
          <img :src="tenant.branding.logoUrl" :alt="tenant.companyName" style="height:32px;width:auto;object-fit:contain" />
        </div>
        <template v-else>
          <div style="width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:15px;color:#fff;flex-shrink:0"
            :style="{ background: accent }">
            {{ (tenant.companyName || 'N')[0].toUpperCase() }}
          </div>
          <span style="font-size:17px;font-weight:700;color:var(--nx-text);letter-spacing:-.02em">
            {{ tenant.companyName || 'Nexora' }}
          </span>
        </template>
      </NuxtLink>

      <!-- Desktop Nav -->
      <nav style="flex:1;display:flex;align-items:center;gap:4px" class="desktop-nav">
        <NuxtLink to="/"
          style="padding:6px 14px;font-size:13px;font-weight:500;color:var(--nx-muted);text-decoration:none;border-radius:6px;transition:all .15s"
          onmouseover="this.style.color='var(--nx-text)';this.style.background='var(--nx-surface)'"
          onmouseout="this.style.color='var(--nx-muted)';this.style.background='transparent'">
          Start
        </NuxtLink>
        <NuxtLink to="/leistungen"
          style="padding:6px 14px;font-size:13px;font-weight:500;color:var(--nx-muted);text-decoration:none;border-radius:6px;transition:all .15s"
          onmouseover="this.style.color='var(--nx-text)';this.style.background='var(--nx-surface)'"
          onmouseout="this.style.color='var(--nx-muted)';this.style.background='transparent'">
          Leistungen
        </NuxtLink>
        <NuxtLink to="/about"
          style="padding:6px 14px;font-size:13px;font-weight:500;color:var(--nx-muted);text-decoration:none;border-radius:6px;transition:all .15s"
          onmouseover="this.style.color='var(--nx-text)';this.style.background='var(--nx-surface)'"
          onmouseout="this.style.color='var(--nx-muted)';this.style.background='transparent'">
          Über uns
        </NuxtLink>
        <NuxtLink to="/kontakt"
          style="padding:6px 14px;font-size:13px;font-weight:500;color:var(--nx-muted);text-decoration:none;border-radius:6px;transition:all .15s"
          onmouseover="this.style.color='var(--nx-text)';this.style.background='var(--nx-surface)'"
          onmouseout="this.style.color='var(--nx-muted)';this.style.background='transparent'">
          Kontakt
        </NuxtLink>
        <NuxtLink v-for="pg in pages" :key="pg.slug" :to="`/${pg.slug}`"
          style="padding:6px 14px;font-size:13px;font-weight:500;color:var(--nx-muted);text-decoration:none;border-radius:6px;transition:all .15s"
          onmouseover="this.style.color='var(--nx-text)';this.style.background='var(--nx-surface)'"
          onmouseout="this.style.color='var(--nx-muted)';this.style.background='transparent'">
          {{ pg.title }}
        </NuxtLink>
      </nav>

      <!-- CTA -->
      <NuxtLink to="/kontakt"
        style="flex-shrink:0;padding:9px 20px;border-radius:8px;font-size:13px;font-weight:600;color:#fff;text-decoration:none;transition:opacity .15s;white-space:nowrap"
        :style="{ background: accent }"
        onmouseover="this.style.opacity='.85'"
        onmouseout="this.style.opacity='1'"
        class="desktop-nav">
        Projekt starten →
      </NuxtLink>

      <!-- Mobile burger -->
      <button @click="menuOpen = !menuOpen"
        style="margin-left:auto;background:none;border:none;cursor:pointer;color:var(--nx-text);padding:4px;display:none"
        class="mobile-btn">
        <svg v-if="menuOpen" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
    </div>

    <!-- Backdrop blur bar -->
    <div style="position:absolute;inset:0;z-index:-1;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);background:color-mix(in srgb,var(--nx-bg) 85%,transparent);border-bottom:1px solid var(--nx-border)"></div>

    <!-- Mobile menu -->
    <div v-if="menuOpen"
      style="position:fixed;inset:0;top:68px;z-index:99;background:var(--nx-bg);border-top:1px solid var(--nx-border);padding:24px;display:flex;flex-direction:column;gap:4px;font-family:'Inter',system-ui,sans-serif">
      <NuxtLink v-for="link in [['/', 'Start'], ['/leistungen', 'Leistungen'], ['/about', 'Über uns'], ['/kontakt', 'Kontakt']]"
        :key="link[0]" :to="link[0]"
        style="display:block;padding:16px 0;font-size:20px;font-weight:600;color:var(--nx-text);text-decoration:none;border-bottom:1px solid var(--nx-border)">
        {{ link[1] }}
      </NuxtLink>
      <NuxtLink v-for="pg in pages" :key="pg.slug" :to="`/${pg.slug}`"
        style="display:block;padding:16px 0;font-size:20px;font-weight:600;color:var(--nx-text);text-decoration:none;border-bottom:1px solid var(--nx-border)">
        {{ pg.title }}
      </NuxtLink>
      <NuxtLink to="/kontakt"
        style="display:block;margin-top:20px;padding:14px 20px;border-radius:8px;font-size:15px;font-weight:600;color:#fff;text-decoration:none;text-align:center"
        :style="{ background: accent }">
        Projekt starten →
      </NuxtLink>
    </div>
  </header>
</template>

<style scoped>
@media (max-width: 768px) {
  .desktop-nav { display: none !important; }
  .mobile-btn  { display: flex !important; }
}
</style>
