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
interface CartLine { itemId: string; name: string; price: number; qty: number }

const items          = ref<MenuItem[]>([])
const loading        = ref(true)
const menuTitle      = computed(() => tenant.value.menu?.title || 'Speisekarte')
const orderingEnabled = computed(() => tenant.value.menu?.orderingEnabled ?? false)
const accent         = computed(() => tenant.value.branding.primaryColor || '#f97316')

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

// ── Warenkorb ─────────────────────────────────────────
const cart = ref<CartLine[]>([])
const cartOpen = ref(false)

const cartCount = computed(() => cart.value.reduce((s, l) => s + l.qty, 0))
const cartTotal = computed(() => cart.value.reduce((s, l) => s + l.price * l.qty, 0))

function qtyInCart(itemId: string) {
  return cart.value.find(l => l.itemId === itemId)?.qty || 0
}

function addToCart(item: MenuItem) {
  const existing = cart.value.find(l => l.itemId === item.itemId)
  if (existing) existing.qty++
  else cart.value.push({ itemId: item.itemId, name: item.name, price: Number(item.price) || 0, qty: 1 })
}

function decrementCart(itemId: string) {
  const existing = cart.value.find(l => l.itemId === itemId)
  if (!existing) return
  existing.qty--
  if (existing.qty <= 0) cart.value = cart.value.filter(l => l.itemId !== itemId)
}

// ── Checkout ──────────────────────────────────────────
const step = ref<'cart' | 'checkout' | 'success'>('cart')
const submitting = ref(false)
const submitError = ref('')
const orderConfirmation = ref<{ orderId: string; total: number } | null>(null)

const checkoutForm = reactive({ customerName: '', phone: '', pickupTime: 'sofort', notes: '' })

function openCart() { cartOpen.value = true; step.value = 'cart' }

function goToCheckout() {
  if (!cart.value.length) return
  step.value = 'checkout'
}

async function submitOrder() {
  if (!checkoutForm.customerName || !checkoutForm.phone) return
  submitting.value = true
  submitError.value = ''
  try {
    const apiUrl   = config.public.plexoraApiUrl as string
    const tenantId = tenant.value.tenantId
    const res = await $fetch<{ orderId: string; total: number }>(`${apiUrl}/api/public/${tenantId}/orders`, {
      method: 'POST',
      body: {
        items: cart.value.map(l => ({ itemId: l.itemId, qty: l.qty })),
        customerName: checkoutForm.customerName,
        phone: checkoutForm.phone,
        pickupTime: checkoutForm.pickupTime,
        notes: checkoutForm.notes,
      },
    })
    orderConfirmation.value = res
    cart.value = []
    step.value = 'success'
  } catch (e: any) {
    submitError.value = e?.data?.message || 'Bestellung konnte nicht gesendet werden. Bitte versuch es nochmal.'
  } finally {
    submitting.value = false
  }
}

function closeCart() {
  cartOpen.value = false
  if (step.value === 'success') {
    step.value = 'cart'
    orderConfirmation.value = null
    checkoutForm.customerName = ''; checkoutForm.phone = ''; checkoutForm.pickupTime = 'sofort'; checkoutForm.notes = ''
  }
}
</script>

<template>
  <div style="background:var(--nx-bg);color:var(--nx-text);min-height:100vh;font-family:'Inter',system-ui,sans-serif">
    <NexoraNavbar />

    <div style="max-width:860px;margin:0 auto;padding:100px 24px 120px">
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
            <div v-for="item in group.items" :key="item.itemId" style="display:flex;justify-content:space-between;align-items:center;gap:16px">
              <div style="flex:1">
                <div style="font-size:16px;font-weight:700;color:var(--nx-text)">{{ item.name }}</div>
                <p v-if="item.description" style="font-size:13px;color:var(--nx-muted);margin:4px 0 0;line-height:1.5">{{ item.description }}</p>
              </div>
              <div style="display:flex;align-items:center;gap:14px;flex-shrink:0">
                <div style="font-size:16px;font-weight:800;letter-spacing:-.02em" :style="{ color: accent }">
                  {{ formatPrice(item.price) }}
                </div>
                <template v-if="orderingEnabled">
                  <button v-if="!qtyInCart(item.itemId)" @click="addToCart(item)"
                    style="width:32px;height:32px;border-radius:50%;border:none;cursor:pointer;color:#fff;display:flex;align-items:center;justify-content:center;transition:opacity .15s"
                    :style="{ background: accent }"
                    onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'">
                    <i class="ti ti-plus" style="font-size:16px"></i>
                  </button>
                  <div v-else style="display:flex;align-items:center;gap:8px;background:var(--nx-surface);border:1px solid var(--nx-border);border-radius:20px;padding:2px">
                    <button @click="decrementCart(item.itemId)" style="width:26px;height:26px;border-radius:50%;border:none;background:transparent;color:var(--nx-text);cursor:pointer;display:flex;align-items:center;justify-content:center">
                      <i class="ti ti-minus" style="font-size:13px"></i>
                    </button>
                    <span style="font-size:13px;font-weight:700;min-width:14px;text-align:center">{{ qtyInCart(item.itemId) }}</span>
                    <button @click="addToCart(item)" style="width:26px;height:26px;border-radius:50%;border:none;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center" :style="{ background: accent }">
                      <i class="ti ti-plus" style="font-size:13px"></i>
                    </button>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Cart Button -->
    <button v-if="orderingEnabled && cartCount && !cartOpen" @click="openCart"
      style="position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:90;display:flex;align-items:center;gap:10px;padding:14px 24px;border-radius:40px;border:none;color:#fff;cursor:pointer;font-size:14px;font-weight:700;box-shadow:0 8px 24px rgba(0,0,0,.35);transition:transform .15s"
      :style="{ background: accent }"
      onmouseover="this.style.transform='translateX(-50%) translateY(-2px)'" onmouseout="this.style.transform='translateX(-50%)'">
      <i class="ti ti-shopping-cart"></i>
      {{ cartCount }} {{ cartCount === 1 ? 'Artikel' : 'Artikel' }} · {{ formatPrice(cartTotal) }}
    </button>

    <!-- Cart Drawer -->
    <div v-if="cartOpen" style="position:fixed;inset:0;z-index:200;display:flex;justify-content:flex-end">
      <div style="position:absolute;inset:0;background:rgba(0,0,0,.5)" @click="closeCart"></div>
      <div style="position:relative;width:100%;max-width:420px;background:var(--nx-bg);border-left:1px solid var(--nx-border);height:100%;overflow-y:auto;display:flex;flex-direction:column">

        <!-- Drawer Header -->
        <div style="padding:20px 24px;border-bottom:1px solid var(--nx-border);display:flex;align-items:center;justify-content:space-between;flex-shrink:0">
          <div style="font-size:16px;font-weight:800">
            {{ step === 'cart' ? 'Dein Warenkorb' : step === 'checkout' ? 'Bestellung abschließen' : 'Bestellt!' }}
          </div>
          <button @click="closeCart" style="background:none;border:none;color:var(--nx-muted);cursor:pointer;font-size:20px;line-height:1;padding:4px">
            <i class="ti ti-x"></i>
          </button>
        </div>

        <!-- STEP: Cart -->
        <div v-if="step === 'cart'" style="flex:1;display:flex;flex-direction:column;padding:20px 24px">
          <div v-if="!cart.length" style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--nx-muted);text-align:center">
            <i class="ti ti-shopping-cart-off" style="font-size:36px;opacity:.3;margin-bottom:10px"></i>
            <p style="font-size:13px">Dein Warenkorb ist leer.</p>
          </div>
          <div v-else style="display:flex;flex-direction:column;gap:14px;flex:1">
            <div v-for="line in cart" :key="line.itemId" style="display:flex;align-items:center;gap:12px">
              <div style="flex:1">
                <div style="font-size:14px;font-weight:700">{{ line.name }}</div>
                <div style="font-size:12px;color:var(--nx-muted)">{{ formatPrice(line.price) }}</div>
              </div>
              <div style="display:flex;align-items:center;gap:8px;background:var(--nx-surface);border:1px solid var(--nx-border);border-radius:20px;padding:2px">
                <button @click="decrementCart(line.itemId)" style="width:24px;height:24px;border-radius:50%;border:none;background:transparent;color:var(--nx-text);cursor:pointer">
                  <i class="ti ti-minus" style="font-size:12px"></i>
                </button>
                <span style="font-size:13px;font-weight:700;min-width:14px;text-align:center">{{ line.qty }}</span>
                <button @click="cart.find(l=>l.itemId===line.itemId)!.qty++" style="width:24px;height:24px;border-radius:50%;border:none;color:#fff;cursor:pointer" :style="{ background: accent }">
                  <i class="ti ti-plus" style="font-size:12px"></i>
                </button>
              </div>
              <div style="font-size:13px;font-weight:800;min-width:60px;text-align:right">{{ formatPrice(line.price * line.qty) }}</div>
            </div>
          </div>

          <div v-if="cart.length" style="border-top:1px solid var(--nx-border);padding-top:16px;margin-top:16px">
            <div style="display:flex;justify-content:space-between;font-size:15px;font-weight:800;margin-bottom:16px">
              <span>Gesamt</span>
              <span :style="{ color: accent }">{{ formatPrice(cartTotal) }}</span>
            </div>
            <button @click="goToCheckout"
              style="width:100%;padding:14px;border-radius:10px;border:none;color:#fff;font-size:14px;font-weight:700;cursor:pointer;transition:opacity .15s"
              :style="{ background: accent }"
              onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'">
              Weiter zur Bestellung →
            </button>
          </div>
        </div>

        <!-- STEP: Checkout -->
        <div v-else-if="step === 'checkout'" style="flex:1;display:flex;flex-direction:column;padding:20px 24px">
          <div style="display:flex;flex-direction:column;gap:14px;flex:1">
            <div>
              <label style="font-size:12px;font-weight:600;color:var(--nx-muted);display:block;margin-bottom:6px">Name *</label>
              <input v-model="checkoutForm.customerName" placeholder="Max Mustermann"
                style="width:100%;padding:11px 14px;border-radius:8px;border:1px solid var(--nx-border);background:var(--nx-surface);color:var(--nx-text);font-size:14px;box-sizing:border-box" />
            </div>
            <div>
              <label style="font-size:12px;font-weight:600;color:var(--nx-muted);display:block;margin-bottom:6px">Telefon *</label>
              <input v-model="checkoutForm.phone" placeholder="+49 123 4567890"
                style="width:100%;padding:11px 14px;border-radius:8px;border:1px solid var(--nx-border);background:var(--nx-surface);color:var(--nx-text);font-size:14px;box-sizing:border-box" />
            </div>
            <div>
              <label style="font-size:12px;font-weight:600;color:var(--nx-muted);display:block;margin-bottom:6px">Abholzeit</label>
              <select v-model="checkoutForm.pickupTime"
                style="width:100%;padding:11px 14px;border-radius:8px;border:1px solid var(--nx-border);background:var(--nx-surface);color:var(--nx-text);font-size:14px;box-sizing:border-box">
                <option value="sofort">So schnell wie möglich</option>
                <option value="in 30 Minuten">in 30 Minuten</option>
                <option value="in 45 Minuten">in 45 Minuten</option>
                <option value="in 1 Stunde">in 1 Stunde</option>
              </select>
            </div>
            <div>
              <label style="font-size:12px;font-weight:600;color:var(--nx-muted);display:block;margin-bottom:6px">Anmerkung (optional)</label>
              <textarea v-model="checkoutForm.notes" placeholder="z.B. ohne Zwiebeln..." rows="2"
                style="width:100%;padding:11px 14px;border-radius:8px;border:1px solid var(--nx-border);background:var(--nx-surface);color:var(--nx-text);font-size:14px;box-sizing:border-box;resize:none;font-family:inherit"></textarea>
            </div>
            <div v-if="submitError" style="font-size:12px;color:#ef4444;background:#ef444414;border:1px solid #ef444444;border-radius:8px;padding:10px 12px">{{ submitError }}</div>
          </div>

          <div style="border-top:1px solid var(--nx-border);padding-top:16px;margin-top:16px">
            <div style="display:flex;justify-content:space-between;font-size:15px;font-weight:800;margin-bottom:16px">
              <span>Gesamt</span>
              <span :style="{ color: accent }">{{ formatPrice(cartTotal) }}</span>
            </div>
            <button @click="submitOrder" :disabled="submitting || !checkoutForm.customerName || !checkoutForm.phone"
              style="width:100%;padding:14px;border-radius:10px;border:none;color:#fff;font-size:14px;font-weight:700;cursor:pointer;transition:opacity .15s"
              :style="{ background: accent, opacity: (submitting || !checkoutForm.customerName || !checkoutForm.phone) ? 0.5 : 1 }">
              <i v-if="submitting" class="ti ti-loader-2 spin"></i>
              <span v-else>Jetzt bestellen</span>
            </button>
            <button @click="step = 'cart'" style="width:100%;background:none;border:none;color:var(--nx-muted);font-size:13px;padding:12px 0 0;cursor:pointer">← Zurück zum Warenkorb</button>
          </div>
        </div>

        <!-- STEP: Success -->
        <div v-else-if="step === 'success'" style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px 24px;text-align:center">
          <div style="width:56px;height:56px;border-radius:50%;background:#22c55e22;display:flex;align-items:center;justify-content:center;margin-bottom:16px">
            <i class="ti ti-check" style="font-size:28px;color:#22c55e"></i>
          </div>
          <div style="font-size:18px;font-weight:800;margin-bottom:8px">Danke für deine Bestellung!</div>
          <p style="font-size:13px;color:var(--nx-muted);margin-bottom:4px">Wir bereiten sie vor und melden uns bei Rückfragen.</p>
          <p v-if="orderConfirmation" style="font-size:13px;color:var(--nx-muted)">
            Bestellnummer: <strong style="color:var(--nx-text)">{{ orderConfirmation.orderId.slice(0,8).toUpperCase() }}</strong>
          </p>
          <button @click="closeCart" style="margin-top:24px;padding:12px 28px;border-radius:10px;border:none;color:#fff;font-size:14px;font-weight:700;cursor:pointer" :style="{ background: accent }">
            Fertig
          </button>
        </div>
      </div>
    </div>

    <NexoraFooter />
  </div>
</template>
