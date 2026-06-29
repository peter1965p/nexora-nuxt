<script setup lang="ts">
const { tenant } = useTenant()
useHead({ title: computed(() => `Kontakt · ${tenant.value.companyName}`) })
</script>

<template>
  <div style="background:var(--nx-bg);color:var(--nx-text);min-height:100vh;font-family:ui-monospace,SFMono-Regular,'SF Mono',Consolas,monospace">
    <NexoraNavbar />
    <main class="pt-20">
      <NexoraContact />
    </main>
    <NexoraFooter />
  </div>
</template>
