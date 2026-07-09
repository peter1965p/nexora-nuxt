<script setup lang="ts">
const { tenant } = useTenant()
const config     = useRuntimeConfig()
const { add: addToCart, count: cartCount } = useCart()

interface ShopProduct {
  productId: string
  name: string
  description: string
  price: number
  currency: string
  imageUrl?: string
  category?: string
  available: boolean
}

const products   = ref<ShopProduct[]>([])
const loading    = ref(true)
const shopTitle  = computed(() => tenant.value.shop?.title || 'Shop')
const accent     = computed(() => tenant.value.branding.primaryColor || '#f97316')

onMounted(async () => {
  const apiUrl   = config.public.plexoraApiUrl as string
  const tenantId = tenant.value.tenantId
  if (!tenantId) { loading.value = false; return }
  try {
    const res = await $fetch<{ products: ShopProduct[] }>(`${apiUrl}/api/public/${tenantId}/shop`)
    products.value = res.products || []
  } catch {}
  loading.value = false
})

useHead({ title: computed(() => `${shopTitle.value} · ${tenant.value.companyName}`) })

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: currency || 'EUR' }).format(price)
}

const addedId = ref('')
function handleAdd(p: ShopProduct) {
  addToCart({ productId: p.productId, name: p.name, price: p.price, imageUrl: p.imageUrl })
  addedId.value = p.productId
  setTimeout(() => { if (addedId.value === p.productId) addedId.value = '' }, 1200)
}
</script>

<template>
  <div style="background:var(--nx-bg);color:var(--nx-text);min-height:100vh;font-family:'Inter',system-ui,sans-serif">
    <NexoraNavbar />

    <div style="max-width:1200px;margin:0 auto;padding:100px 24px 80px">
      <!-- Header -->
      <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:24px;margin-bottom:48px;flex-wrap:wrap">
        <div>
          <div style="font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:var(--nx-muted);margin-bottom:12px">{{ shopTitle }}</div>
          <h1 style="font-size:clamp(28px,5vw,48px);font-weight:800;letter-spacing:-.03em;line-height:1.1;margin:0">
            Produkte & Angebote
          </h1>
        </div>
        <NuxtLink to="/shop/cart"
          style="display:flex;align-items:center;gap:8px;padding:10px 18px;border-radius:8px;border:1px solid var(--nx-border);background:var(--nx-surface);color:var(--nx-text);text-decoration:none;font-size:13px;font-weight:600">
          <i class="ti ti-shopping-cart"></i> Warenkorb
          <span v-if="cartCount" style="background:var(--nx-accent);color:#fff;border-radius:999px;min-width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;padding:0 5px" :style="{ background: accent }">{{ cartCount }}</span>
        </NuxtLink>
      </div>

      <!-- Loading -->
      <div v-if="loading" style="display:flex;justify-content:center;padding:60px 0;color:var(--nx-muted)">
        <i class="ti ti-loader-2 spin" style="font-size:24px"></i>
      </div>

      <!-- Empty -->
      <div v-else-if="!products.length" style="text-align:center;padding:80px 0;color:var(--nx-muted)">
        <i class="ti ti-shopping-cart-off" style="font-size:40px;opacity:.3;display:block;margin-bottom:12px"></i>
        <p style="font-size:14px">Noch keine Produkte verfügbar.</p>
      </div>

      <!-- Grid -->
      <div v-else style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px">
        <div v-for="p in products" :key="p.productId"
          style="display:flex;flex-direction:column;background:var(--nx-surface);border:1px solid var(--nx-border);border-radius:12px;overflow:hidden;transition:border-color .2s,transform .15s"
          onmouseover="this.style.borderColor='var(--nx-accent)';this.style.transform='translateY(-2px)'"
          onmouseout="this.style.borderColor='var(--nx-border)';this.style.transform='translateY(0)'">
          <div v-if="p.imageUrl" style="aspect-ratio:4/3;overflow:hidden;background:var(--nx-bg)">
            <img :src="p.imageUrl" :alt="p.name" style="width:100%;height:100%;object-fit:cover" />
          </div>
          <div v-else style="aspect-ratio:4/3;background:var(--nx-bg);display:flex;align-items:center;justify-content:center">
            <i class="ti ti-package" style="font-size:48px;opacity:.15;color:var(--nx-muted)"></i>
          </div>
          <div style="padding:20px;flex:1;display:flex;flex-direction:column;gap:8px">
            <div v-if="p.category" style="font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--nx-muted)">
              {{ p.category }}
            </div>
            <h2 style="font-size:16px;font-weight:700;color:var(--nx-text);line-height:1.3;margin:0">{{ p.name }}</h2>
            <p v-if="p.description" style="font-size:13px;color:var(--nx-muted);line-height:1.5;margin:0;flex:1">{{ p.description }}</p>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-top:12px">
              <span style="font-size:20px;font-weight:800;letter-spacing:-.02em" :style="{ color: accent }">
                {{ formatPrice(p.price, p.currency) }}
              </span>
              <button v-if="p.available" @click="handleAdd(p)"
                style="padding:8px 16px;border-radius:8px;border:none;font-size:12px;font-weight:600;color:#fff;cursor:pointer;transition:opacity .15s"
                :style="{ background: accent }"
                onmouseover="this.style.opacity='.85'"
                onmouseout="this.style.opacity='1'">
                {{ addedId === p.productId ? 'Hinzugefügt ✓' : 'In den Warenkorb' }}
              </button>
              <span v-else style="font-size:12px;color:var(--nx-muted)">Nicht verfügbar</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <NexoraFooter />
  </div>
</template>
