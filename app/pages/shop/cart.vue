<script setup lang="ts">
const { tenant }   = useTenant()
const config       = useRuntimeConfig()
const { cart, updateQty, removeItem, subtotal } = useCart()

const email    = ref('')
const checking = ref(false)
const error    = ref('')
const accent   = computed(() => tenant.value.branding.primaryColor || '#f97316')

const vat   = computed(() => Math.round(subtotal.value * 0.19 * 100) / 100)
const total = computed(() => subtotal.value + vat.value)

function formatPrice(price: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price)
}

async function checkout() {
  if (!cart.value.length) return
  error.value = ''
  checking.value = true
  try {
    const apiUrl   = config.public.plexoraApiUrl as string
    const tenantId = tenant.value.tenantId
    const res: any = await $fetch(`${apiUrl}/api/public/${tenantId}/shop/checkout`, {
      method: 'POST',
      body: {
        items: cart.value.map(i => ({ productId: i.productId, quantity: i.quantity })),
        email: email.value || undefined,
      },
    })
    if (res?.url) window.location.href = res.url
    else error.value = 'Checkout konnte nicht gestartet werden.'
  } catch (err) {
    error.value = 'Checkout fehlgeschlagen. Bitte versuche es erneut.'
  } finally { checking.value = false }
}

useHead({ title: computed(() => `Warenkorb · ${tenant.value.companyName}`) })
</script>

<template>
  <div style="background:var(--nx-bg);color:var(--nx-text);min-height:100vh;font-family:'Inter',system-ui,sans-serif">
    <NexoraNavbar />

    <div style="max-width:700px;margin:0 auto;padding:120px 24px 80px">
      <NuxtLink to="/shop" style="color:var(--nx-muted);font-size:13px;display:inline-flex;align-items:center;gap:6px;margin-bottom:28px;text-decoration:none">
        <i class="ti ti-arrow-left"></i> Zurück zum Shop
      </NuxtLink>

      <h1 style="font-size:26px;font-weight:800;margin:0 0 28px;letter-spacing:-.02em">
        <i class="ti ti-shopping-cart" :style="{ color: accent }"></i> Warenkorb
      </h1>

      <div v-if="!cart.length" style="text-align:center;padding:60px 0;color:var(--nx-muted)">
        <i class="ti ti-shopping-cart-off" style="font-size:48px;display:block;margin-bottom:12px;opacity:.3"></i>
        Dein Warenkorb ist leer
        <div style="margin-top:20px">
          <NuxtLink to="/shop" style="padding:10px 22px;border-radius:8px;font-size:13px;font-weight:600;color:#fff;text-decoration:none" :style="{ background: accent }">Zum Shop</NuxtLink>
        </div>
      </div>

      <div v-else>
        <div style="background:var(--nx-surface);border:1px solid var(--nx-border);border-radius:12px;overflow:hidden;margin-bottom:20px">
          <div v-for="(item, i) in cart" :key="item.productId"
            :style="`padding:16px 20px;display:flex;align-items:center;gap:16px;${i < cart.length-1 ? 'border-bottom:1px solid var(--nx-border)' : ''}`">
            <div style="width:56px;height:56px;border-radius:10px;overflow:hidden;background:var(--nx-bg);flex-shrink:0;display:flex;align-items:center;justify-content:center">
              <img v-if="item.imageUrl" :src="item.imageUrl" style="width:100%;height:100%;object-fit:cover" />
              <i v-else class="ti ti-package" style="font-size:22px;color:var(--nx-muted)"></i>
            </div>
            <div style="flex:1;min-width:0">
              <div style="font-weight:700;font-size:14px">{{ item.name }}</div>
              <div style="font-size:12px;color:var(--nx-muted)">{{ formatPrice(item.price) }} / Stück</div>
            </div>
            <div style="display:flex;align-items:center;gap:8px">
              <button @click="updateQty(item.productId, -1)" style="background:var(--nx-bg);border:1px solid var(--nx-border);border-radius:6px;width:26px;height:26px;cursor:pointer;color:var(--nx-text);font-size:15px">−</button>
              <span style="font-weight:700;min-width:20px;text-align:center;font-size:14px">{{ item.quantity }}</span>
              <button @click="updateQty(item.productId, 1)" style="background:var(--nx-bg);border:1px solid var(--nx-border);border-radius:6px;width:26px;height:26px;cursor:pointer;color:var(--nx-text);font-size:15px">+</button>
            </div>
            <div style="font-weight:800;min-width:70px;text-align:right;font-size:14px" :style="{ color: accent }">{{ formatPrice(item.price * item.quantity) }}</div>
            <button @click="removeItem(item.productId)" style="background:none;border:none;color:#e05c5c;cursor:pointer;font-size:17px;padding:4px">
              <i class="ti ti-trash"></i>
            </button>
          </div>
        </div>

        <div style="background:var(--nx-surface);border:1px solid var(--nx-border);border-radius:12px;padding:20px;margin-bottom:20px">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:13px;color:var(--nx-muted)">
            <span>Zwischensumme</span><span>{{ formatPrice(subtotal) }}</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:16px;font-size:13px;color:var(--nx-muted)">
            <span>MwSt. (19%)</span><span>{{ formatPrice(vat) }}</span>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:17px;font-weight:800;padding-top:12px;border-top:1px solid var(--nx-border)">
            <span>Gesamt</span><span :style="{ color: accent }">{{ formatPrice(total) }}</span>
          </div>
        </div>

        <div style="margin-bottom:16px">
          <label style="font-size:12px;color:var(--nx-muted);display:block;margin-bottom:6px">E-Mail für Bestellbestätigung (optional)</label>
          <input v-model="email" type="email" placeholder="du@beispiel.de"
            style="width:100%;padding:12px 14px;border-radius:8px;border:1px solid var(--nx-border);background:var(--nx-bg);color:var(--nx-text);font-size:14px;box-sizing:border-box" />
        </div>

        <p v-if="error" style="color:#e05c5c;font-size:13px;margin-bottom:12px">{{ error }}</p>

        <button @click="checkout" :disabled="checking"
          style="width:100%;height:52px;border-radius:10px;border:none;color:#fff;font-size:15px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px"
          :style="{ background: accent, opacity: checking ? 0.7 : 1 }">
          <i v-if="checking" class="ti ti-loader-2 spin"></i>
          <i v-else class="ti ti-lock"></i>
          {{ checking ? 'Weiterleitung…' : `Sicher bezahlen — ${formatPrice(total)}` }}
        </button>
        <p style="text-align:center;font-size:12px;color:var(--nx-muted);margin-top:12px">
          <i class="ti ti-shield-check"></i> Sichere Zahlung via Stripe
        </p>
      </div>
    </div>

    <NexoraFooter />
  </div>
</template>
