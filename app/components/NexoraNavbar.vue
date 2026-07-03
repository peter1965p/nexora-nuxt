<script setup lang="ts">
const { tenant } = useTenant()
const menuOpen   = ref(false)
const accent     = computed(() => tenant.value.branding.primaryColor || '#f97316')
const pages      = computed(() => tenant.value.pages || [])
const blogEnabled = computed(() => tenant.value.blog?.enabled ?? false)
const blogTitle   = computed(() => tenant.value.blog?.title || 'Blog')
const shopEnabled = computed(() => tenant.value.shop?.enabled ?? false)
const shopTitle   = computed(() => tenant.value.shop?.title || 'Shop')
const vehiclesEnabled = computed(() => tenant.value.vehicles?.enabled ?? false)
const vehiclesTitle   = computed(() => tenant.value.vehicles?.title || 'Fahrzeuge')
const foodMenuEnabled = computed(() => tenant.value.menu?.enabled ?? false)
const foodMenuTitle   = computed(() => tenant.value.menu?.title || 'Speisekarte')
const propertiesEnabled = computed(() => tenant.value.properties?.enabled ?? false)
const propertiesTitle   = computed(() => tenant.value.properties?.title || 'Immobilien')
const termineEnabled = computed(() => tenant.value.termine?.enabled ?? false)
const termineTitle   = computed(() => tenant.value.termine?.title || 'Termine')

const DEFAULT_NAV_ORDER = ['start', 'leistungen', 'about', 'kontakt', 'shop', 'blog', 'vehicles', 'menu', 'properties', 'termine']

const navItems = computed(() => {
  const all: Record<string, { to: string; label: string; enabled: boolean }> = {
    start:      { to: '/',            label: 'Start',                enabled: true },
    leistungen: { to: '/leistungen',  label: 'Leistungen',           enabled: true },
    about:      { to: '/about',       label: 'Über uns',             enabled: true },
    kontakt:    { to: '/kontakt',     label: 'Kontakt',               enabled: true },
    shop:       { to: '/shop',        label: shopTitle.value,        enabled: shopEnabled.value },
    blog:       { to: '/blog',        label: blogTitle.value,        enabled: blogEnabled.value },
    vehicles:   { to: '/fahrzeuge',   label: vehiclesTitle.value,    enabled: vehiclesEnabled.value },
    menu:       { to: '/speisekarte', label: foodMenuTitle.value,    enabled: foodMenuEnabled.value },
    properties: { to: '/immobilien',  label: propertiesTitle.value,  enabled: propertiesEnabled.value },
    termine:    { to: '/termine',     label: termineTitle.value,     enabled: termineEnabled.value },
  }
  const order = tenant.value.navOrder?.length ? tenant.value.navOrder : DEFAULT_NAV_ORDER
  return order.filter(key => all[key]?.enabled).map(key => ({ key, ...all[key] }))
})

const customPages = computed(() => pages.value.filter(p => !['agb', 'datenschutz', 'impressum'].includes(p.slug)))

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
        <NuxtLink v-for="item in navItems" :key="item.key" :to="item.to"
          style="padding:6px 14px;font-size:13px;font-weight:500;color:var(--nx-muted);text-decoration:none;border-radius:6px;transition:all .15s"
          onmouseover="this.style.color='var(--nx-text)';this.style.background='var(--nx-surface)'"
          onmouseout="this.style.color='var(--nx-muted)';this.style.background='transparent'">
          {{ item.label }}
        </NuxtLink>
        <NuxtLink v-for="pg in customPages" :key="pg.slug" :to="`/${pg.slug}`"
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
      <NuxtLink v-for="item in navItems" :key="item.key" :to="item.to"
        style="display:block;padding:16px 0;font-size:20px;font-weight:600;color:var(--nx-text);text-decoration:none;border-bottom:1px solid var(--nx-border)">
        {{ item.label }}
      </NuxtLink>
      <NuxtLink v-for="pg in customPages" :key="pg.slug" :to="`/${pg.slug}`"
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
