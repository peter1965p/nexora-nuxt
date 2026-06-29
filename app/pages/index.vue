<script setup lang="ts">
const { tenant } = useTenant()
</script>

<template>
  <div class="min-h-screen" style="background:var(--nx-bg);color:var(--nx-text);font-family:ui-monospace,SFMono-Regular,'SF Mono',Consolas,monospace">
    <NexoraNavbar />
    <main>
      <NexoraHero />
      <NexoraAbout />
      <NexoraServices />
      <NexoraContact />
    </main>
    <footer class="w-full px-6 md:px-16 py-10 border-t" style="border-color:var(--nx-border)">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <p class="text-[10px] uppercase tracking-[0.4em]" style="color:var(--nx-muted)">
            © {{ new Date().getFullYear() }} {{ tenant.companyName }}
          </p>
          <p v-if="tenant.content.footer?.tagline" class="text-[9px] mt-1" style="color:var(--nx-muted);opacity:.6">
            {{ tenant.content.footer.tagline }}
          </p>
        </div>
        <div v-if="tenant.pages?.length" class="flex items-center gap-4 flex-wrap justify-center">
          <NuxtLink
            v-for="pg in tenant.pages"
            :key="pg.slug"
            :to="`/${pg.slug}`"
            class="text-[10px] uppercase tracking-widest transition-opacity hover:opacity-100"
            style="color:var(--nx-muted);text-decoration:none;opacity:.7"
          >
            {{ pg.title }}
          </NuxtLink>
        </div>
        <div v-if="tenant.content.footer?.showStatus !== false" class="flex items-center gap-2 text-[9px] uppercase tracking-widest" style="color:var(--nx-muted)">
          <span class="w-1.5 h-1.5 rounded-full animate-pulse" style="background:var(--nx-accent)"></span>
          {{ tenant.content.footer?.statusLabel || 'System Online' }}
        </div>
      </div>
    </footer>
  </div>
</template>
