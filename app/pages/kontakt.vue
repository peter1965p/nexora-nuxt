<script setup lang="ts">
const { tenant } = useTenant()
useHead({ title: computed(() => `Kontakt · ${tenant.value.companyName || 'Nexora'}`) })
</script>

<template>
  <div style="background:var(--nx-bg);color:var(--nx-text);min-height:100vh;font-family:'Inter',system-ui,sans-serif">
    <NexoraNavbar />
    <main>
      <NexoraContact />
    </main>
    <NexoraFooter />
  </div>
</template>
