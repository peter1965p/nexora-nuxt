<script setup lang="ts">
const { tenant } = useTenant()
const accent = computed(() => tenant.value.branding.primaryColor || '#2563eb')
const hero   = computed(() => tenant.value.content.hero || {})
</script>

<template>
  <section class="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-20" style="background:black">
    <!-- Grid background -->
    <div class="absolute inset-0 pointer-events-none" style="background-image:linear-gradient(rgba(59,130,246,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.04) 1px,transparent 1px);background-size:48px 48px"></div>

    <div class="relative z-10 w-full px-6 md:px-16 max-w-5xl mx-auto text-center">
      <!-- Badge -->
      <div class="flex items-center justify-center gap-3 mb-8 text-[10px] uppercase tracking-[0.3em]" :style="{ color: accent }">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" :style="{ background: accent }"></span>
          <span class="relative inline-flex rounded-full h-2 w-2" :style="{ background: accent }"></span>
        </span>
        Verfügbar für Anfragen
      </div>

      <!-- Company name -->
      <h1 class="text-[5rem] md:text-[9rem] font-black tracking-[-0.08em] leading-none select-none uppercase mb-6">
        <span class="bg-gradient-to-b from-orange-200 via-orange-500 to-orange-950 bg-clip-text text-transparent drop-shadow-[0_0_70px_rgba(234,88,12,0.5)]">
          {{ tenant.companyName }}
        </span>
      </h1>

      <p v-if="hero.subheadline" class="text-slate-400 text-lg md:text-xl mb-4 italic">
        {{ hero.subheadline }}
      </p>
      <p v-if="hero.headline" class="text-slate-500 text-sm leading-relaxed max-w-2xl mx-auto mb-10">
        {{ hero.headline }}
      </p>

      <!-- Stats -->
      <div v-if="tenant.content.stats?.length" class="grid grid-cols-2 md:grid-cols-4 gap-px mb-10 overflow-hidden border border-white/5 rounded-sm" style="background:rgba(255,255,255,.05)">
        <div v-for="stat in tenant.content.stats" :key="stat.label" class="px-6 py-4" style="background:#05070a">
          <div class="text-xl font-black" :style="{ color: 'white' }">{{ stat.value }}</div>
          <div class="text-[9px] text-slate-600 tracking-widest mt-1 uppercase">{{ stat.label }}</div>
        </div>
      </div>

      <!-- CTA -->
      <NuxtLink to="/kontakt" class="inline-block text-white text-[11px] font-bold uppercase tracking-widest px-8 py-3 rounded-sm transition-colors"
         :style="{ background: accent }">
        {{ hero.cta || 'Kontakt aufnehmen' }} →
      </NuxtLink>
    </div>
  </section>
</template>
