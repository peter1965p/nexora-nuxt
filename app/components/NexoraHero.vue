<script setup lang="ts">
const { tenant } = useTenant()
const accent = computed(() => tenant.value.branding.primaryColor || '#f97316')
const hero   = computed(() => tenant.value.content.hero || {})
</script>

<template>
  <section class="relative w-full min-h-screen flex items-center" style="background:var(--nx-bg)">
    <!-- Grid background -->
    <div class="absolute inset-0 pointer-events-none" style="background-image:linear-gradient(color-mix(in srgb, var(--nx-accent) 3%, transparent) 1px,transparent 1px),linear-gradient(90deg,color-mix(in srgb, var(--nx-accent) 3%, transparent) 1px,transparent 1px);background-size:48px 48px"></div>

    <div class="relative z-10 w-full px-6 md:px-16 pt-32 pb-20 max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row md:items-center gap-12 md:gap-20">

        <!-- Left: company name -->
        <div class="flex-1 min-w-0">
          <!-- Badge -->
          <div class="flex items-center gap-3 mb-6 text-[10px] uppercase tracking-[0.3em]" :style="{ color: accent }">
            <span class="relative flex h-2 w-2 flex-shrink-0">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" :style="{ background: accent }"></span>
              <span class="relative inline-flex rounded-full h-2 w-2" :style="{ background: accent }"></span>
            </span>
            {{ hero.location || 'Verfügbar für Anfragen' }}
          </div>

          <h1 class="font-black tracking-[-0.06em] select-none uppercase"
              style="font-size:clamp(3.5rem, 10vw, 8rem);line-height:0.9;overflow:visible;padding-top:0.15em">
            <span class="bg-gradient-to-b from-orange-200 via-orange-500 to-orange-950 bg-clip-text text-transparent drop-shadow-[0_0_70px_rgba(234,88,12,0.5)]">
              {{ tenant.companyName }}
            </span>
          </h1>
        </div>

        <!-- Right: subheadline + description + CTA + stats -->
        <div class="md:w-80 lg:w-96 flex-shrink-0 flex flex-col gap-6">
          <div>
            <p v-if="hero.subheadline" class="text-xl font-black italic uppercase mb-3" style="color:var(--nx-text)">
              {{ hero.subheadline }}
            </p>
            <p v-if="hero.headline" class="text-sm leading-relaxed" style="color:var(--nx-muted)">
              {{ hero.headline }}
            </p>
          </div>

          <!-- Stats -->
          <div v-if="tenant.content.stats?.length"
               class="gap-px overflow-hidden rounded-sm border"
               :class="tenant.content.stats.length === 1 ? 'grid grid-cols-1' : 'grid grid-cols-2'"
               style="border-color:var(--nx-border);background:var(--nx-border)">
            <div v-for="stat in tenant.content.stats" :key="stat.label" class="px-4 py-3" style="background:var(--nx-surface)">
              <div class="text-lg font-black" style="color:var(--nx-text)">{{ stat.value }}</div>
              <div class="text-[9px] tracking-widest mt-0.5 uppercase" style="color:var(--nx-muted)">{{ stat.label }}</div>
            </div>
          </div>

          <!-- CTA -->
          <NuxtLink to="/kontakt"
            class="inline-block text-center text-white text-[11px] font-bold uppercase tracking-widest px-6 py-3 rounded-sm transition-opacity hover:opacity-90"
            :style="{ background: accent }">
            {{ hero.cta || 'Kontakt aufnehmen' }} →
          </NuxtLink>
        </div>

      </div>
    </div>
  </section>
</template>
