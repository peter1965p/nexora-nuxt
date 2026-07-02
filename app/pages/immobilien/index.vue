<script setup lang="ts">
const { tenant } = useTenant()
const config      = useRuntimeConfig()

interface Property {
  propertyId: string
  type: string
  street: string
  zipCity: string
  size: string | number
  rooms: string | number
  priceType: string
  kaufpreis: string | number
  kaltmiete: string | number
  nebenkosten: string | number
  warmmiete: string | number
  imageUrl?: string
  description: string
}

const properties      = ref<Property[]>([])
const loading         = ref(true)
const propertiesTitle = computed(() => tenant.value.properties?.title || 'Immobilien')
const accent          = computed(() => tenant.value.branding.primaryColor || '#f97316')

onMounted(async () => {
  const apiUrl   = config.public.plexoraApiUrl as string
  const tenantId = tenant.value.tenantId
  if (!tenantId) { loading.value = false; return }
  try {
    const res = await $fetch<{ properties: Property[] }>(`${apiUrl}/api/public/${tenantId}/properties`)
    properties.value = res.properties || []
  } catch {}
  loading.value = false
})

useHead({ title: computed(() => `${propertiesTitle.value} · ${tenant.value.companyName}`) })

function formatEuro(n: string | number) {
  const v = Number(n)
  if (!v && v !== 0) return '—'
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(v)
}
</script>

<template>
  <div style="background:var(--nx-bg);color:var(--nx-text);min-height:100vh;font-family:'Inter',system-ui,sans-serif">
    <NexoraNavbar />

    <div style="max-width:1200px;margin:0 auto;padding:100px 24px 80px">
      <!-- Header -->
      <div style="margin-bottom:48px">
        <div style="font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:var(--nx-muted);margin-bottom:12px">{{ propertiesTitle }}</div>
        <h1 style="font-size:clamp(28px,5vw,48px);font-weight:800;letter-spacing:-.03em;line-height:1.1;margin:0">
          Freie Objekte
        </h1>
      </div>

      <!-- Loading -->
      <div v-if="loading" style="display:flex;justify-content:center;padding:60px 0;color:var(--nx-muted)">
        <i class="ti ti-loader-2 spin" style="font-size:24px"></i>
      </div>

      <!-- Empty -->
      <div v-else-if="!properties.length" style="text-align:center;padding:80px 0;color:var(--nx-muted)">
        <i class="ti ti-building-off" style="font-size:40px;opacity:.3;display:block;margin-bottom:12px"></i>
        <p style="font-size:14px">Aktuell keine freien Objekte verfügbar.</p>
      </div>

      <!-- Grid -->
      <div v-else style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:24px">
        <div v-for="p in properties" :key="p.propertyId"
          style="display:flex;flex-direction:column;background:var(--nx-surface);border:1px solid var(--nx-border);border-radius:12px;overflow:hidden;transition:border-color .2s,transform .15s"
          onmouseover="this.style.borderColor='var(--nx-accent)';this.style.transform='translateY(-2px)'"
          onmouseout="this.style.borderColor='var(--nx-border)';this.style.transform='translateY(0)'">
          <div v-if="p.imageUrl" style="aspect-ratio:4/3;overflow:hidden;background:var(--nx-bg)">
            <img :src="p.imageUrl" :alt="p.street" style="width:100%;height:100%;object-fit:cover" />
          </div>
          <div v-else style="aspect-ratio:4/3;background:var(--nx-bg);display:flex;align-items:center;justify-content:center">
            <i class="ti ti-building-estate" style="font-size:48px;opacity:.15;color:var(--nx-muted)"></i>
          </div>
          <div style="padding:20px;flex:1;display:flex;flex-direction:column;gap:10px">
            <div style="font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--nx-muted)">{{ p.type }}</div>
            <h2 style="font-size:16px;font-weight:700;color:var(--nx-text);line-height:1.3;margin:0">{{ p.street }}</h2>
            <div style="font-size:13px;color:var(--nx-muted)">{{ p.zipCity }}</div>
            <div style="display:flex;gap:12px;font-size:12px;color:var(--nx-muted)">
              <span v-if="p.size"><i class="ti ti-ruler-2" style="margin-right:4px"></i>{{ p.size }} m²</span>
              <span v-if="p.rooms"><i class="ti ti-door" style="margin-right:4px"></i>{{ p.rooms }} Zimmer</span>
            </div>
            <p v-if="p.description" style="font-size:13px;color:var(--nx-muted);line-height:1.5;margin:0">{{ p.description }}</p>

            <!-- Preis-Aufschlüsselung -->
            <div v-if="p.priceType === 'miete'" style="background:var(--nx-bg);border:1px solid var(--nx-border);border-radius:10px;padding:14px 16px;margin-top:auto;display:flex;flex-direction:column;gap:6px">
              <div style="display:flex;justify-content:space-between;font-size:13px;color:var(--nx-muted)">
                <span>Kaltmiete</span><span>{{ formatEuro(p.kaltmiete) }}</span>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:13px;color:var(--nx-muted)">
                <span>Nebenkosten</span><span>{{ formatEuro(p.nebenkosten) }}</span>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:16px;font-weight:800;border-top:1px solid var(--nx-border);padding-top:8px;margin-top:2px">
                <span>Warmmiete</span><span :style="{ color: accent }">{{ formatEuro(p.warmmiete) }}</span>
              </div>
            </div>
            <div v-else style="margin-top:auto;padding-top:12px;border-top:1px solid var(--nx-border);display:flex;align-items:center;justify-content:space-between">
              <span style="font-size:12px;color:var(--nx-muted)">Kaufpreis</span>
              <span style="font-size:20px;font-weight:800;letter-spacing:-.02em" :style="{ color: accent }">{{ formatEuro(p.kaufpreis) }}</span>
            </div>

            <a href="/kontakt"
              style="text-align:center;padding:10px 16px;border-radius:8px;font-size:13px;font-weight:600;color:#fff;text-decoration:none;transition:opacity .15s"
              :style="{ background: accent }"
              onmouseover="this.style.opacity='.85'"
              onmouseout="this.style.opacity='1'">
              Anfragen →
            </a>
          </div>
        </div>
      </div>
    </div>

    <NexoraFooter />
  </div>
</template>
