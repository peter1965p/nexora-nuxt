<script setup lang="ts">
const { tenant } = useTenant()

const orderedSections = computed(() =>
  (tenant.value.sectionOrder || ['stack', 'clients', 'github'])
)

useHead({ title: computed(() => tenant.value.pageTitles?.start || tenant.value.companyName || 'Nexora') })
</script>

<template>
  <div style="background:var(--nx-bg);color:var(--nx-text);font-family:'Inter',system-ui,sans-serif;min-height:100vh">
    <NexoraNavbar />
    <main>
      <NexoraHero />
      <!-- "clients" (Referenzen) läuft jetzt kompakt im Hero-Bereich, nicht mehr als eigene Sektion -->
      <template v-for="section in orderedSections" :key="section">
        <NexoraStack  v-if="section === 'stack'" />
        <NexoraGitHub v-else-if="section === 'github'" />
      </template>
    </main>
    <NexoraFooter />
  </div>
</template>
