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
  <NuxtPage />
</template>
