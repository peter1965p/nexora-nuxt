<script setup lang="ts">
const { tenant } = useTenant()
const { clear }  = useCart()
const accent     = computed(() => tenant.value.branding.primaryColor || '#f97316')

onMounted(() => { clear() })

useHead({ title: computed(() => `Bestellung bestätigt · ${tenant.value.companyName}`) })
</script>

<template>
  <div style="background:var(--nx-bg);color:var(--nx-text);min-height:100vh;font-family:'Inter',system-ui,sans-serif">
    <NexoraNavbar />

    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px">
      <div style="text-align:center;max-width:480px">
        <div style="width:80px;height:80px;background:color-mix(in srgb, #10b981 15%, transparent);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 24px">
          <i class="ti ti-circle-check" style="font-size:40px;color:#10b981"></i>
        </div>
        <h1 style="font-size:26px;font-weight:800;margin:0 0 12px;letter-spacing:-.02em">Zahlung erfolgreich!</h1>
        <p style="color:var(--nx-muted);line-height:1.6;margin:0 0 32px;font-size:14px">
          Vielen Dank für deine Bestellung. Du erhältst in Kürze eine Bestätigungs-E-Mail mit weiteren Informationen.
        </p>
        <NuxtLink to="/shop" style="display:inline-block;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;color:#fff;text-decoration:none" :style="{ background: accent }">
          Weiter shoppen
        </NuxtLink>
      </div>
    </div>

    <NexoraFooter />
  </div>
</template>
