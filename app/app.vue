<script setup lang="ts">
const { resolve, tenant } = useTenant()
const { load: loadCart }  = useCart()

onMounted(async () => {
  await resolve()
  loadCart()
})

useHead({
  title: computed(() => tenant.value.companyName || 'Nexora'),
  htmlAttrs: { lang: 'de' },
  link: computed(() => tenant.value.branding.faviconUrl ? [
    { rel: 'icon', href: tenant.value.branding.faviconUrl }
  ] : []),
  meta: computed(() => tenant.value.metaKeywords ? [
    { name: 'keywords', content: tenant.value.metaKeywords }
  ] : []),
})
</script>

<template>
  <div style="font-family:'Inter',system-ui,-apple-system,sans-serif">
    <NuxtPage />
    <NexoraCookieBanner />
  </div>
</template>
