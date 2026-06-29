<script setup lang="ts">
const { tenant } = useTenant()
const menuOpen = ref(false)
const accent = computed(() => tenant.value.branding.primaryColor || '#2563eb')
</script>

<template>
  <header class="fixed top-0 left-0 w-full z-[100] px-6 py-4 flex justify-between items-center backdrop-blur-md" style="background:color-mix(in srgb, var(--nx-bg) 80%, transparent);border-bottom:1px solid color-mix(in srgb, var(--nx-border) 50%, transparent)">
    <a href="/" class="flex items-center gap-2 group">
      <img v-if="tenant.branding.logoUrl" :src="tenant.branding.logoUrl" :alt="tenant.companyName"
        style="height:28px;width:auto;object-fit:contain;max-width:140px" />
      <template v-else>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" :stroke="accent" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
        </svg>
        <span class="text-sm font-black italic uppercase tracking-tighter" style="color:var(--nx-text)">
          {{ tenant.companyName }}
        </span>
      </template>
    </a>

    <nav class="hidden md:flex items-center gap-8">
      <NuxtLink to="/about"      class="text-[9px] font-black uppercase tracking-[0.4em] transition-opacity hover:opacity-100" style="color:var(--nx-muted);text-decoration:none;opacity:.7">Über uns</NuxtLink>
      <NuxtLink to="/leistungen" class="text-[9px] font-black uppercase tracking-[0.4em] transition-opacity hover:opacity-100" style="color:var(--nx-muted);text-decoration:none;opacity:.7">Leistungen</NuxtLink>
      <NuxtLink to="/kontakt"    class="text-[9px] font-black uppercase tracking-[0.4em] transition-opacity hover:opacity-100 px-4 py-2 rounded-sm border" :style="{ color: accent, borderColor: accent + '66', opacity: '1' }">Kontakt</NuxtLink>
    </nav>

    <button class="md:hidden p-2 text-white" @click="menuOpen = !menuOpen">
      <svg v-if="menuOpen" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      <svg v-else width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    </button>

    <div class="fixed inset-0 z-[90] flex flex-col transition-transform duration-500"
         :style="{ background: 'var(--nx-bg)', transform: menuOpen ? 'translateX(0)' : 'translateX(100%)' }">
      <div class="flex flex-col h-full p-10 pt-32">
        <div class="flex flex-col gap-2">
          <NuxtLink to="/about"      @click="menuOpen=false" class="text-4xl font-black italic uppercase py-5" style="border-bottom:1px solid var(--nx-border);color:var(--nx-text);text-decoration:none;display:block">Über uns</NuxtLink>
          <NuxtLink to="/leistungen" @click="menuOpen=false" class="text-4xl font-black italic uppercase py-5" style="border-bottom:1px solid var(--nx-border);color:var(--nx-text);text-decoration:none;display:block">Leistungen</NuxtLink>
          <NuxtLink to="/kontakt"    @click="menuOpen=false" class="text-4xl font-black italic uppercase py-5" style="border-bottom:1px solid var(--nx-border);text-decoration:none;display:block" :style="{ color: accent }">Kontakt</NuxtLink>
        </div>
        <div v-if="tenant.pages?.length" class="flex flex-col gap-2 mt-auto">
          <NuxtLink v-for="pg in tenant.pages" :key="pg.slug" :to="`/${pg.slug}`" @click="menuOpen=false"
            class="text-xs uppercase tracking-widest py-3" style="color:var(--nx-muted)">
            {{ pg.title }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>
