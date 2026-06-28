<script setup lang="ts">
const { tenant } = useTenant()
const menuOpen = ref(false)
const accent = computed(() => tenant.value.branding.primaryColor || '#2563eb')
</script>

<template>
  <header class="fixed top-0 left-0 w-full z-[100] px-6 py-4 flex justify-between items-center backdrop-blur-md border-b border-white/5" style="background:rgba(5,7,10,0.8)">
    <a href="/" class="flex items-center gap-2 group">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" :stroke="accent" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
      </svg>
      <span class="text-sm font-black italic uppercase tracking-tighter text-white">
        {{ tenant.companyName }}
      </span>
    </a>

    <nav class="hidden md:flex items-center gap-8">
      <a href="#about"    class="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-white transition-colors">Über uns</a>
      <a href="#services" class="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-white transition-colors">Leistungen</a>
      <a href="#kontakt"  class="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-white transition-colors">Kontakt</a>
    </nav>

    <button class="md:hidden p-2 text-white" @click="menuOpen = !menuOpen">
      <svg v-if="menuOpen" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      <svg v-else width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    </button>

    <div class="fixed inset-0 z-[90] flex flex-col transition-transform duration-500"
         style="background:#05070a"
         :style="{ transform: menuOpen ? 'translateX(0)' : 'translateX(100%)' }">
      <div class="flex flex-col h-full p-10 pt-32">
        <div class="flex flex-col gap-2">
          <a href="#about"    @click="menuOpen=false" class="text-4xl font-black italic uppercase border-b border-white/5 py-5">Über uns</a>
          <a href="#services" @click="menuOpen=false" class="text-4xl font-black italic uppercase border-b border-white/5 py-5">Leistungen</a>
          <a href="#kontakt"  @click="menuOpen=false" class="text-4xl font-black italic uppercase border-b border-white/5 py-5">Kontakt</a>
        </div>
      </div>
    </div>
  </header>
</template>
