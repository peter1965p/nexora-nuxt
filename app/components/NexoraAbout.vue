<script setup lang="ts">
const { tenant } = useTenant()
const accent = computed(() => tenant.value.branding.primaryColor || '#2563eb')
</script>

<template>
  <section id="about" class="w-full px-6 md:px-16 py-24 border-b border-white/5">
    <p class="text-[10px] uppercase tracking-[0.3em] mb-4" :style="{ color: accent }">Über uns</p>
    <div class="flex flex-col lg:flex-row gap-16 items-start">
      <div class="w-full lg:w-1/2">
        <h2 class="text-4xl font-black italic uppercase leading-none mb-6">
          {{ tenant.companyName }}
        </h2>
        <p class="text-slate-400 text-sm leading-relaxed">
          {{ tenant.content.about?.text }}
        </p>
      </div>
      <div v-if="tenant.content.stats?.length" class="flex-1 grid grid-cols-2 gap-4">
        <div v-for="stat in tenant.content.stats" :key="stat.label"
             class="border border-white/5 p-6 rounded-sm" style="background:rgba(39,39,42,.3)">
          <div class="text-2xl font-black mb-1" :style="{ color: accent }">{{ stat.value }}</div>
          <div class="text-[10px] text-slate-500 uppercase tracking-widest">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </section>
</template>
