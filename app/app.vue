<script setup lang="ts">
const { resolve, tenant } = useTenant()

onMounted(async () => {
  await resolve()
})

useHead({
  title: computed(() => tenant.value.companyName || 'Nexora'),
  htmlAttrs: { lang: 'de' },
})
</script>

<template>
  <div class="min-h-screen" style="background:#05070a;color:white;font-family:ui-monospace,SFMono-Regular,'SF Mono',Consolas,monospace">
    <NexoraNavbar />
    <main>
      <NexoraHero />
      <NexoraAbout />
      <NexoraServices />
      <NexoraContact />
    </main>
    <footer class="w-full px-6 md:px-16 py-10 flex justify-between items-center border-t border-white/5">
      <p class="text-[10px] text-slate-600 uppercase tracking-[0.4em]">
        © {{ new Date().getFullYear() }} {{ tenant.companyName }}
      </p>
      <div class="flex items-center gap-2 text-[9px] text-slate-700 uppercase tracking-widest">
        <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
        System Online
      </div>
    </footer>
  </div>
</template>
