<script setup lang="ts">
const { tenant, resolved } = useTenant()
const accent = computed(() => tenant.value.branding.primaryColor || '#2563eb')

const gridClass = computed(() => {
  const n      = tenant.value.services.length
  const layout = tenant.value.branding.servicesLayout || 'auto'
  if (layout === '2')   return 'grid-cols-1 md:grid-cols-2'
  if (layout === '3')   return 'grid-cols-1 md:grid-cols-3'
  if (layout === '4')   return 'grid-cols-1 md:grid-cols-4'
  if (layout === '2x2') return 'grid-cols-1 md:grid-cols-2'
  // auto
  if (n <= 2)  return 'grid-cols-1 md:grid-cols-2'
  if (n === 4) return 'grid-cols-1 md:grid-cols-2'
  if (n >= 5)  return 'grid-cols-1 md:grid-cols-3'
  return 'grid-cols-1 md:grid-cols-3'
})
</script>

<template>
  <section id="services" class="w-full px-6 md:px-16 py-24 border-b border-white/5">
    <p class="text-[10px] uppercase tracking-[0.3em] mb-4" :style="{ color: accent }">Leistungen</p>
    <h2 class="text-4xl font-black italic uppercase mb-12">Was wir anbieten</h2>

    <div v-if="tenant.services.length" class="grid border border-white/5" :class="gridClass">
      <div v-for="(svc, i) in tenant.services" :key="svc.id"
           class="p-10 transition-all"
           :style="{ borderRight: i < tenant.services.length - 1 ? '1px solid rgba(255,255,255,.05)' : 'none' }">
        <div class="mb-4" :style="{ color: svc.color || accent }">
          <span v-if="svc.icon" class="text-3xl leading-none">{{ svc.icon }}</span>
          <span v-else class="text-2xl font-black italic">{{ String(i + 1).padStart(2, '0') }}</span>
        </div>
        <h3 class="text-[11px] font-bold uppercase tracking-widest mb-4">{{ svc.title }}</h3>
        <p class="text-slate-500 text-[10px] leading-relaxed mb-6">{{ svc.description }}</p>
        <ul class="space-y-1">
          <li v-for="f in svc.features" :key="f" class="flex items-center gap-2 text-[10px] text-slate-400">
            <span class="w-1 h-1 rounded-full" :style="{ background: accent }"></span>
            {{ f }}
          </li>
        </ul>
      </div>
    </div>

    <div v-else class="border border-white/5 p-10 text-slate-600 text-[11px]">
      {{ resolved ? 'Leistungen werden noch konfiguriert.' : 'Leistungen werden geladen...' }}
    </div>
  </section>
</template>
