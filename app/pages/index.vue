<script setup lang="ts">
const { tenant } = useTenant()

const orderedSections = computed(() =>
  (tenant.value.sectionOrder || ['stack', 'clients', 'github'])
)
</script>

<template>
  <div style="background:var(--nx-bg);color:var(--nx-text);font-family:'Inter',system-ui,sans-serif;min-height:100vh">
    <NexoraNavbar />
    <main>
      <NexoraHero />
      <template v-for="section in orderedSections" :key="section">
        <NexoraStack   v-if="section === 'stack'" />
        <NexoraClients v-else-if="section === 'clients'" />
        <NexoraGitHub  v-else-if="section === 'github'" />
      </template>
    </main>
    <NexoraFooter />
  </div>
</template>
