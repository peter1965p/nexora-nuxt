<script setup lang="ts">
const { tenant } = useTenant()

const SECTION_MAP: Record<string, string> = {
  stack:   'NexoraStack',
  clients: 'NexoraClients',
  github:  'NexoraGitHub',
}

const orderedSections = computed(() =>
  (tenant.value.sectionOrder || ['stack', 'clients', 'github'])
    .filter(key => SECTION_MAP[key])
)
</script>

<template>
  <div class="min-h-screen" style="background:var(--nx-bg);color:var(--nx-text);font-family:ui-monospace,SFMono-Regular,'SF Mono',Consolas,monospace">
    <NexoraNavbar />
    <main>
      <NexoraHero />
      <component
        v-for="section in orderedSections"
        :key="section"
        :is="SECTION_MAP[section]"
      />
    </main>
    <NexoraFooter />
  </div>
</template>
