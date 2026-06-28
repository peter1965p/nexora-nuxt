<script setup lang="ts">
const { tenant } = useTenant()
const accent = computed(() => tenant.value.branding.primaryColor || '#2563eb')
const phoneHref = computed(() => {
  const p = tenant.value.contact.phone
  return p ? `tel:${p.replace(/\s/g, '')}` : '#'
})
</script>

<template>
  <section id="kontakt" class="w-full px-6 md:px-16 py-24 flex flex-col md:flex-row gap-16">
    <div class="flex-1">
      <p class="text-[10px] uppercase tracking-[0.3em] mb-4" :style="{ color: accent }">Kontakt</p>
      <h2 class="text-4xl font-black italic uppercase mb-6">Jetzt anfragen.</h2>
      <div class="space-y-4 text-[11px] text-slate-400">
        <div v-if="tenant.contact.address" class="flex items-start gap-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" :stroke="accent" stroke-width="2" class="mt-0.5 shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {{ tenant.contact.address }}
        </div>
        <div v-if="tenant.contact.phone">
          <a :href="phoneHref" class="flex items-center gap-3 hover:text-white transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" :stroke="accent" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.8-1.8a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z"/></svg>
            {{ tenant.contact.phone }}
          </a>
        </div>
        <div v-if="tenant.contact.email">
          <a :href="`mailto:${tenant.contact.email}`" class="flex items-center gap-3 hover:text-white transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" :stroke="accent" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,12 2,6"/></svg>
            {{ tenant.contact.email }}
          </a>
        </div>
        <div v-if="tenant.contact.region" class="flex items-center gap-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" :stroke="accent" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          {{ tenant.contact.region }}
        </div>
      </div>
    </div>

    <div class="flex-1 p-10 rounded border relative overflow-hidden" :style="{ borderColor: accent + '33', background: accent + '0d' }">
      <div class="absolute top-0 right-0 px-3 py-1.5 text-white text-[9px] uppercase tracking-widest font-bold" :style="{ background: accent }">
        Verfügbar
      </div>
      <p class="text-[10px] uppercase tracking-[0.3em] mb-4" :style="{ color: accent }">Direkte Anfrage</p>
      <h3 class="text-2xl font-black italic uppercase mb-4 leading-tight">Wir freuen uns<br>auf Ihre Nachricht.</h3>
      <p class="text-slate-400 text-[11px] leading-relaxed mb-8">
        Schildern Sie uns Ihr Anliegen — wir melden uns schnellstmöglich bei Ihnen.
      </p>
      <a v-if="tenant.contact.email" :href="`mailto:${tenant.contact.email}`"
         class="flex items-center gap-3 text-[11px] text-white uppercase tracking-widest pb-3 border-b hover:opacity-80 transition-all w-fit"
         :style="{ borderColor: accent + '4d' }">
        E-Mail schreiben
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      </a>
    </div>
  </section>
</template>
