<script setup lang="ts">
const { tenant } = useTenant()
const config      = useRuntimeConfig()

interface MenuItem {
  itemId: string
  category: string
  name: string
  description: string
  price: string | number
}

const items      = ref<MenuItem[]>([])
const loading    = ref(true)
const menuTitle  = computed(() => tenant.value.menu?.title || 'Speisekarte')
const accent     = computed(() => tenant.value.branding.primaryColor || '#f97316')

const groupedItems = computed(() => {
  const groups: Record<string, MenuItem[]> = {}
  for (const item of items.value) {
    if (!groups[item.category]) groups[item.category] = []
    groups[item.category].push(item)
  }
  return Object.entries(groups).map(([category, list]) => ({ category, items: list }))
})

onMounted(async () => {
  const apiUrl   = config.public.plexoraApiUrl as string
  const tenantId = tenant.value.tenantId
  if (!tenantId) { loading.value = false; return }
  try {
    const res = await $fetch<{ items: MenuItem[] }>(`${apiUrl}/api/public/${tenantId}/menu`)
    items.value = res.items || []
  } catch {}
  loading.value = false
})

useHead({ title: computed(() => `${menuTitle.value} · ${tenant.value.companyName}`) })

function formatPrice(price: string | number) {
  const n = Number(price)
  if (!n && n !== 0) return price
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(n)
}
</script>

<template>
  <div style="background:var(--nx-bg);color:var(--nx-text);min-height:100vh;font-family:'Inter',system-ui,sans-serif">
    <NexoraNavbar />

    <div style="max-width:860px;margin:0 auto;padding:100px 24px 80px">
      <!-- Header -->
      <div style="margin-bottom:48px;text-align:center">
        <div style="font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:var(--nx-muted);margin-bottom:12px">{{ menuTitle }}</div>
        <h1 style="font-size:clamp(28px,5vw,44px);font-weight:800;letter-spacing:-.03em;line-height:1.1;margin:0">
          Unsere Speisekarte
        </h1>
      </div>

      <!-- Loading -->
      <div v-if="loading" style="display:flex;justify-content:center;padding:60px 0;color:var(--nx-muted)">
        <i class="ti ti-loader-2 spin" style="font-size:24px"></i>
      </div>

      <!-- Empty -->
      <div v-else-if="!items.length" style="text-align:center;padding:80px 0;color:var(--nx-muted)">
        <i class="ti ti-tools-kitchen-off" style="font-size:40px;opacity:.3;display:block;margin-bottom:12px"></i>
        <p style="font-size:14px">Speisekarte ist gerade nicht verfügbar.</p>
      </div>

      <!-- Menu -->
      <div v-else style="display:flex;flex-direction:column;gap:40px">
        <div v-for="group in groupedItems" :key="group.category">
          <h2 style="font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin:0 0 20px" :style="{ color: accent }">
            {{ group.category }}
          </h2>
          <div style="display:flex;flex-direction:column;gap:20px">
            <div v-for="item in group.items" :key="item.itemId" style="display:flex;justify-content:space-between;align-items:baseline;gap:16px">
              <div style="flex:1">
                <div style="font-size:16px;font-weight:700;color:var(--nx-text)">{{ item.name }}</div>
                <p v-if="item.description" style="font-size:13px;color:var(--nx-muted);margin:4px 0 0;line-height:1.5">{{ item.description }}</p>
              </div>
              <div style="font-size:16px;font-weight:800;letter-spacing:-.02em;flex-shrink:0" :style="{ color: accent }">
                {{ formatPrice(item.price) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <NexoraFooter />
  </div>
</template>
