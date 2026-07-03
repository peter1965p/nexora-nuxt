<script setup lang="ts">
const { tenant, resolve } = useTenant()
const config      = useRuntimeConfig()

interface AppointmentType { typeId: string; name: string; durationMinutes: number }

const termineTitle = computed(() => tenant.value.termine?.title || 'Termine')
const accent       = computed(() => tenant.value.branding.primaryColor || '#f97316')

const loading = ref(true)
const types   = ref<AppointmentType[]>([])
const today   = new Date().toISOString().slice(0, 10)

const step         = ref(1)
const selectedType = ref<AppointmentType | null>(null)
const selectedDate = ref(today)
const selectedSlot = ref('')
const slots         = ref<string[]>([])
const loadingSlots  = ref(false)
const slotsLoaded   = ref(false)

const form     = reactive({ name: '', email: '', phone: '', notes: '' })
const booking  = ref<{ typeName: string; date: string; startTime: string; endTime: string; customerName: string; meetLink: string | null } | null>(null)
const booking_error = ref('')
const submitting = ref(false)

function apiUrl() { return config.public.plexoraApiUrl as string }
function tenantId() { return tenant.value.tenantId }

onMounted(async () => {
  await resolve()
  if (!tenantId()) { loading.value = false; return }
  try {
    const res = await $fetch<{ title: string; types: AppointmentType[] }>(`${apiUrl()}/api/public/${tenantId()}/termine`)
    types.value = res.types || []
  } catch {}
  loading.value = false
})

useHead({ title: computed(() => `${termineTitle.value} · ${tenant.value.companyName}`) })

function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long' })
}

function selectType(t: AppointmentType) {
  selectedType.value = t
  step.value = 2
}

async function loadSlots() {
  if (!selectedType.value) return
  loadingSlots.value = true
  slotsLoaded.value = false
  slots.value = []
  selectedSlot.value = ''
  try {
    const res = await $fetch<{ slots: string[] }>(
      `${apiUrl()}/api/public/${tenantId()}/termine/availability`,
      { query: { date: selectedDate.value, typeId: selectedType.value.typeId } }
    )
    slots.value = res.slots || []
  } catch {}
  loadingSlots.value = false
  slotsLoaded.value = true
}

watch(selectedDate, () => { if (step.value === 2) loadSlots() })
watch(step, (v) => { if (v === 2 && !slotsLoaded.value) loadSlots() })

function selectSlot(s: string) {
  selectedSlot.value = s
  step.value = 3
}

async function submitBooking() {
  if (!form.name || !form.email || !selectedType.value || !selectedSlot.value) return
  submitting.value = true
  booking_error.value = ''
  try {
    const res = await $fetch<{ booking: typeof booking.value }>(`${apiUrl()}/api/public/${tenantId()}/termine/book`, {
      method: 'POST',
      body: {
        typeId: selectedType.value.typeId,
        date: selectedDate.value,
        startTime: selectedSlot.value,
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone,
        notes: form.notes,
      },
    })
    booking.value = res.booking
  } catch (e: any) {
    booking_error.value = e?.data?.message || 'Dieser Termin ist leider nicht mehr verfügbar. Bitte wähle einen anderen Zeitpunkt.'
    step.value = 2
    loadSlots()
  }
  submitting.value = false
}

function backTo(s: number) { step.value = s }
</script>

<template>
  <div style="background:var(--nx-bg);color:var(--nx-text);min-height:100vh;font-family:'Inter',system-ui,sans-serif">
    <NexoraNavbar />

    <div style="max-width:720px;margin:0 auto;padding:100px 24px 80px">

      <!-- Header -->
      <div style="margin-bottom:40px">
        <div style="font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:var(--nx-muted);margin-bottom:12px">{{ termineTitle }}</div>
        <h1 style="font-size:clamp(28px,5vw,44px);font-weight:800;letter-spacing:-.03em;line-height:1.1;margin:0">
          Termin buchen
        </h1>
      </div>

      <!-- Loading -->
      <div v-if="loading" style="display:flex;justify-content:center;padding:60px 0;color:var(--nx-muted)">
        <i class="ti ti-loader-2 spin" style="font-size:24px"></i>
      </div>

      <!-- Empty -->
      <div v-else-if="!types.length" style="text-align:center;padding:80px 0;color:var(--nx-muted)">
        <i class="ti ti-calendar-off" style="font-size:40px;opacity:.3;display:block;margin-bottom:12px"></i>
        <p style="font-size:14px">Aktuell keine Terminbuchung verfügbar.</p>
      </div>

      <!-- Success -->
      <div v-else-if="booking" style="text-align:center;padding:40px 0">
        <div style="width:64px;height:64px;border-radius:50%;background:#22c55e18;border:1px solid #22c55e44;display:flex;align-items:center;justify-content:center;margin:0 auto 20px">
          <i class="ti ti-check" style="font-size:28px;color:#22c55e"></i>
        </div>
        <h2 style="font-size:22px;font-weight:800;margin:0 0 8px">Termin bestätigt</h2>
        <p style="color:var(--nx-muted);font-size:14px;margin:0 0 28px">Eine Bestätigung wurde an {{ form.email }} gesendet.</p>
        <div style="display:inline-flex;flex-direction:column;gap:10px;text-align:left;padding:20px 24px;border:1px solid var(--nx-border);border-radius:12px;background:var(--nx-surface);min-width:280px">
          <div style="display:flex;justify-content:space-between;gap:16px"><span style="color:var(--nx-muted);font-size:13px">Termin</span><strong style="font-size:13px">{{ booking.typeName }}</strong></div>
          <div style="display:flex;justify-content:space-between;gap:16px"><span style="color:var(--nx-muted);font-size:13px">Datum</span><strong style="font-size:13px">{{ formatDate(booking.date) }}</strong></div>
          <div style="display:flex;justify-content:space-between;gap:16px"><span style="color:var(--nx-muted);font-size:13px">Uhrzeit</span><strong style="font-size:13px">{{ booking.startTime }}–{{ booking.endTime }}</strong></div>
        </div>
        <div v-if="booking.meetLink" style="margin-top:20px">
          <a :href="booking.meetLink" target="_blank"
            style="display:inline-flex;align-items:center;gap:8px;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;color:#fff;text-decoration:none"
            :style="{ background: accent }">
            <i class="ti ti-video"></i> Meeting beitreten
          </a>
        </div>
      </div>

      <!-- Booking flow -->
      <div v-else>

        <!-- Step indicator -->
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:28px;font-size:12px;color:var(--nx-muted)">
          <span :style="step >= 1 ? { color: accent, fontWeight: 700 } : {}">1. Terminart</span>
          <i class="ti ti-chevron-right" style="font-size:12px;opacity:.5"></i>
          <span :style="step >= 2 ? { color: accent, fontWeight: 700 } : {}">2. Datum &amp; Uhrzeit</span>
          <i class="ti ti-chevron-right" style="font-size:12px;opacity:.5"></i>
          <span :style="step >= 3 ? { color: accent, fontWeight: 700 } : {}">3. Kontaktdaten</span>
        </div>

        <!-- Step 1: Terminart -->
        <div v-if="step === 1" style="display:flex;flex-direction:column;gap:12px">
          <button v-for="t in types" :key="t.typeId" @click="selectType(t)"
            style="display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px 20px;border:1px solid var(--nx-border);border-radius:12px;background:var(--nx-surface);cursor:pointer;text-align:left;transition:border-color .15s;font-family:inherit"
            onmouseover="this.style.borderColor='var(--nx-accent)'"
            onmouseout="this.style.borderColor='var(--nx-border)'">
            <span style="font-size:15px;font-weight:600">{{ t.name }}</span>
            <span style="font-size:12px;color:var(--nx-muted);white-space:nowrap"><i class="ti ti-clock" style="margin-right:4px"></i>{{ t.durationMinutes }} Min.</span>
          </button>
        </div>

        <!-- Step 2: Datum & Uhrzeit -->
        <div v-else-if="step === 2">
          <button @click="backTo(1)" style="background:none;border:none;color:var(--nx-muted);font-size:12px;cursor:pointer;padding:0;margin-bottom:16px;font-family:inherit">
            <i class="ti ti-arrow-left" style="margin-right:4px"></i>Zurück
          </button>
          <div style="margin-bottom:20px">
            <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--nx-muted);margin-bottom:8px">Datum</label>
            <input v-model="selectedDate" type="date" :min="today"
              style="padding:12px 14px;border:1px solid var(--nx-border);border-radius:8px;background:var(--nx-surface);color:var(--nx-text);font-size:14px;font-family:inherit;outline:none" />
          </div>
          <div style="font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--nx-muted);margin-bottom:10px">
            {{ formatDate(selectedDate) }}
          </div>
          <div v-if="loadingSlots" style="display:flex;justify-content:center;padding:40px 0;color:var(--nx-muted)">
            <i class="ti ti-loader-2 spin" style="font-size:22px"></i>
          </div>
          <div v-else-if="!slots.length" style="padding:24px;text-align:center;color:var(--nx-muted);border:1px solid var(--nx-border);border-radius:10px;background:var(--nx-surface)">
            <p style="font-size:13px;margin:0">Keine freien Termine an diesem Tag. Bitte anderes Datum wählen.</p>
          </div>
          <div v-else style="display:grid;grid-template-columns:repeat(auto-fill,minmax(90px,1fr));gap:8px">
            <button v-for="s in slots" :key="s" @click="selectSlot(s)"
              style="padding:10px;border:1px solid var(--nx-border);border-radius:8px;background:var(--nx-surface);color:var(--nx-text);font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;font-family:inherit"
              onmouseover="this.style.borderColor='var(--nx-accent)'"
              onmouseout="this.style.borderColor='var(--nx-border)'">
              {{ s }}
            </button>
          </div>
        </div>

        <!-- Step 3: Kontaktdaten -->
        <div v-else-if="step === 3">
          <button @click="backTo(2)" style="background:none;border:none;color:var(--nx-muted);font-size:12px;cursor:pointer;padding:0;margin-bottom:16px;font-family:inherit">
            <i class="ti ti-arrow-left" style="margin-right:4px"></i>Zurück
          </button>
          <div style="padding:14px 16px;border:1px solid var(--nx-border);border-radius:10px;background:var(--nx-surface);margin-bottom:20px;font-size:13px">
            <strong>{{ selectedType?.name }}</strong> · {{ formatDate(selectedDate) }} · {{ selectedSlot }} Uhr
          </div>
          <form @submit.prevent="submitBooking" style="display:flex;flex-direction:column;gap:16px">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px" class="form-row">
              <div>
                <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--nx-muted);margin-bottom:8px">Name *</label>
                <input v-model="form.name" type="text" placeholder="Max Mustermann" required
                  style="width:100%;padding:12px 14px;border:1px solid var(--nx-border);border-radius:8px;background:var(--nx-surface);color:var(--nx-text);font-size:14px;font-family:inherit;outline:none;box-sizing:border-box" />
              </div>
              <div>
                <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--nx-muted);margin-bottom:8px">E-Mail *</label>
                <input v-model="form.email" type="email" placeholder="max@firma.de" required
                  style="width:100%;padding:12px 14px;border:1px solid var(--nx-border);border-radius:8px;background:var(--nx-surface);color:var(--nx-text);font-size:14px;font-family:inherit;outline:none;box-sizing:border-box" />
              </div>
            </div>
            <div>
              <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--nx-muted);margin-bottom:8px">Telefon</label>
              <input v-model="form.phone" type="text" placeholder="+49 123 456789"
                style="width:100%;padding:12px 14px;border:1px solid var(--nx-border);border-radius:8px;background:var(--nx-surface);color:var(--nx-text);font-size:14px;font-family:inherit;outline:none;box-sizing:border-box" />
            </div>
            <div>
              <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--nx-muted);margin-bottom:8px">Notiz</label>
              <textarea v-model="form.notes" rows="3" placeholder="Worum geht es?"
                style="width:100%;padding:12px 14px;border:1px solid var(--nx-border);border-radius:8px;background:var(--nx-surface);color:var(--nx-text);font-size:14px;font-family:inherit;outline:none;box-sizing:border-box;resize:vertical"></textarea>
            </div>
            <div v-if="booking_error" style="font-size:13px;padding:12px 16px;border-radius:8px;color:#f87171;background:#f8717111;border:1px solid #f8717133">
              {{ booking_error }}
            </div>
            <button type="submit" :disabled="submitting"
              style="display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:13px 28px;border-radius:8px;font-size:14px;font-weight:600;color:#fff;border:none;cursor:pointer;transition:opacity .15s;font-family:inherit"
              :style="{ background: accent, opacity: submitting ? '.5' : '1' }">
              <span v-if="submitting">Wird gebucht…</span>
              <span v-else>Termin verbindlich buchen →</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 640px) {
  .form-row { grid-template-columns: 1fr !important; }
}
</style>
