<script setup lang="ts">
const { resolve, tenant } = useTenant()

onMounted(async () => {
  await resolve()
})

useHead({
  title: computed(() => tenant.value.companyName || 'Nexora'),
  htmlAttrs: { lang: 'de' },
  link: computed(() => tenant.value.branding.faviconUrl ? [
    { rel: 'icon', href: tenant.value.branding.faviconUrl }
  ] : []),
})
</script>

<template>
  <NuxtPage />
</template>
