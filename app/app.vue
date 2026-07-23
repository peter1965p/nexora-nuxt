<script setup lang="ts">
const { resolve, tenant } = useTenant()
const { load: loadCart }  = useCart()

// Top-Level statt onMounted: onMounted läuft bei SSR nie server-seitig. Bewusst OHNE
// "await" hier — Nuxt awaited den internen useAsyncData()-Aufruf in resolve() automatisch
// während SSR (sobald er synchron im Setup ausgelöst wurde), ein "await" direkt hier würde
// app.vue als async-Setup-Komponente markieren, was einen Suspense-Vorfahren voraussetzt —
// für die echte Root-Komponente ist nicht eindeutig dokumentiert, dass Nuxt das automatisch
// bereitstellt, daher hier defensiv vermieden.
resolve()

// Warenkorb ist bewusst rein client-seitig (localStorage, kein SEO-relevanter Inhalt).
onMounted(loadCart)

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
