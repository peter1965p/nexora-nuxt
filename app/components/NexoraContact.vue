<script setup lang="ts">
const { tenant } = useTenant()
const config     = useRuntimeConfig()

const accent    = computed(() => tenant.value.branding.primaryColor || '#f97316')
const phoneHref = computed(() => {
  const p = tenant.value.contact.phone
  return p ? `tel:${p.replace(/\s/g, '')}` : '#'
})

const form    = reactive({ name: '', email: '', subject: '', message: '' })
const sending = ref(false)
const sent    = ref(false)
const error   = ref('')

async function submit() {
  if (!form.name || !form.email || !form.message) {
    error.value = 'Bitte Name, E-Mail und Nachricht ausfüllen.'
    return
  }
  sending.value = true
  error.value   = ''
  try {
    const apiUrl   = config.public.plexoraApiUrl as string
    const tenantId = tenant.value.tenantId
    await $fetch(`${apiUrl}/api/public/${tenantId}/contact`, {
      method: 'POST',
      body: { name: form.name, email: form.email, subject: form.subject, message: form.message },
    })
    sent.value = true
    form.name = form.email = form.subject = form.message = ''
  } catch {
    error.value = 'Senden fehlgeschlagen — bitte direkt per E-Mail melden.'
  }
  sending.value = false
}
</script>

<template>
  <div style="font-family:'Inter',system-ui,sans-serif">

    <!-- Page header -->
    <section style="position:relative;padding:100px 24px 60px;border-bottom:1px solid var(--nx-border);overflow:hidden">
      <div style="position:absolute;inset:0;pointer-events:none;opacity:.04"
        :style="`background-image:linear-gradient(${accent} 1px,transparent 1px),linear-gradient(90deg,${accent} 1px,transparent 1px);background-size:52px 52px`"></div>
      <div style="max-width:1200px;margin:0 auto;position:relative;z-index:1">
        <div style="display:inline-flex;align-items:center;gap:8px;padding:5px 14px;border-radius:9999px;border:1px solid var(--nx-border);background:var(--nx-surface);margin-bottom:28px">
          <i class="ti ti-mail" :style="{ color: accent, fontSize: '11px' }"></i>
          <span style="font-size:10px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:var(--nx-muted)">Kontakt</span>
        </div>
        <h1 style="font-size:clamp(2.4rem,5vw,3.8rem);font-weight:800;letter-spacing:-.03em;margin:0 0 18px;color:var(--nx-text);line-height:1.08">
          Jetzt <span :style="{ color: accent }">anfragen.</span>
        </h1>
        <p style="font-size:17px;line-height:1.65;color:var(--nx-muted);margin:0;max-width:540px;font-weight:400">
          Wir freuen uns auf Ihre Anfrage und melden uns schnellstmöglich.
        </p>
      </div>
    </section>

    <!-- Contact layout -->
    <section style="max-width:1200px;margin:0 auto;padding:60px 24px 80px">
      <div class="contact-grid">

        <!-- Left: contact info -->
        <div style="display:flex;flex-direction:column;gap:28px">
          <h2 style="font-size:20px;font-weight:700;color:var(--nx-text);margin:0 0 4px;letter-spacing:-.01em">
            Kontaktdaten
          </h2>

          <a v-if="tenant.contact.email" :href="`mailto:${tenant.contact.email}`"
            style="display:flex;align-items:center;gap:14px;text-decoration:none;padding:18px;border:1px solid var(--nx-border);border-radius:10px;background:var(--nx-surface);transition:border-color .15s;color:var(--nx-text)"
            onmouseover="this.style.borderColor='var(--nx-accent)'"
            onmouseout="this.style.borderColor='var(--nx-border)'">
            <div style="width:38px;height:38px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0"
              :style="{ background: accent + '18' }">
              <i class="ti ti-mail" :style="{ color: accent }"></i>
            </div>
            <div>
              <div style="font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--nx-muted);margin-bottom:3px">E-Mail</div>
              <div style="font-size:14px;font-weight:500">{{ tenant.contact.email }}</div>
            </div>
          </a>

          <a v-if="tenant.contact.phone" :href="phoneHref"
            style="display:flex;align-items:center;gap:14px;text-decoration:none;padding:18px;border:1px solid var(--nx-border);border-radius:10px;background:var(--nx-surface);transition:border-color .15s;color:var(--nx-text)"
            onmouseover="this.style.borderColor='var(--nx-accent)'"
            onmouseout="this.style.borderColor='var(--nx-border)'">
            <div style="width:38px;height:38px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0"
              :style="{ background: accent + '18' }">
              <i class="ti ti-phone" :style="{ color: accent }"></i>
            </div>
            <div>
              <div style="font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--nx-muted);margin-bottom:3px">Telefon</div>
              <div style="font-size:14px;font-weight:500">{{ tenant.contact.phone }}</div>
            </div>
          </a>

          <div v-if="tenant.contact.address"
            style="display:flex;align-items:flex-start;gap:14px;padding:18px;border:1px solid var(--nx-border);border-radius:10px;background:var(--nx-surface)">
            <div style="width:38px;height:38px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0"
              :style="{ background: accent + '18' }">
              <i class="ti ti-map-pin" :style="{ color: accent }"></i>
            </div>
            <div>
              <div style="font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--nx-muted);margin-bottom:3px">Adresse</div>
              <div style="font-size:14px;font-weight:500;color:var(--nx-text);white-space:pre-line;line-height:1.5">{{ tenant.contact.address }}</div>
            </div>
          </div>

          <!-- Response time notice -->
          <div style="display:flex;align-items:center;gap:10px;padding:14px 16px;border:1px solid var(--nx-border);border-radius:8px;background:var(--nx-surface)">
            <span style="width:6px;height:6px;border-radius:50%;background:#22c55e;flex-shrink:0;animation:pulse 2s infinite"></span>
            <span style="font-size:12px;color:var(--nx-muted)">Wir antworten in der Regel innerhalb von 24h.</span>
          </div>
        </div>

        <!-- Right: form -->
        <div>
          <!-- Success -->
          <div v-if="sent"
            style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:60px 24px;text-align:center;border:1px solid var(--nx-border);border-radius:12px;background:var(--nx-surface)">
            <div style="width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center"
              :style="{ background: accent + '22' }">
              <i class="ti ti-check" :style="{ color: accent, fontSize: '24px' }"></i>
            </div>
            <div>
              <h3 style="font-size:20px;font-weight:700;color:var(--nx-text);margin:0 0 8px">Nachricht gesendet!</h3>
              <p style="font-size:14px;color:var(--nx-muted);margin:0">Wir melden uns schnellstmöglich bei Ihnen.</p>
            </div>
            <button style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;background:none;border:none;cursor:pointer;text-decoration:underline;font-family:inherit"
              :style="{ color: accent }"
              @click="sent = false">
              Weitere Anfrage senden
            </button>
          </div>

          <!-- Form -->
          <form v-else @submit.prevent="submit"
            style="display:flex;flex-direction:column;gap:16px">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px" class="form-row">
              <div>
                <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--nx-muted);margin-bottom:8px">Name *</label>
                <input v-model="form.name" type="text" placeholder="Max Mustermann" required
                  style="width:100%;padding:12px 14px;border:1px solid var(--nx-border);border-radius:8px;background:var(--nx-surface);color:var(--nx-text);font-size:14px;font-family:inherit;outline:none;box-sizing:border-box;transition:border-color .15s"
                  @focus="($event.target as HTMLInputElement).style.borderColor = accent"
                  @blur="($event.target as HTMLInputElement).style.borderColor = 'var(--nx-border)'" />
              </div>
              <div>
                <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--nx-muted);margin-bottom:8px">E-Mail *</label>
                <input v-model="form.email" type="email" placeholder="max@firma.de" required
                  style="width:100%;padding:12px 14px;border:1px solid var(--nx-border);border-radius:8px;background:var(--nx-surface);color:var(--nx-text);font-size:14px;font-family:inherit;outline:none;box-sizing:border-box;transition:border-color .15s"
                  @focus="($event.target as HTMLInputElement).style.borderColor = accent"
                  @blur="($event.target as HTMLInputElement).style.borderColor = 'var(--nx-border)'" />
              </div>
            </div>
            <div>
              <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--nx-muted);margin-bottom:8px">Betreff</label>
              <input v-model="form.subject" type="text" placeholder="Worum geht es?"
                style="width:100%;padding:12px 14px;border:1px solid var(--nx-border);border-radius:8px;background:var(--nx-surface);color:var(--nx-text);font-size:14px;font-family:inherit;outline:none;box-sizing:border-box;transition:border-color .15s"
                @focus="($event.target as HTMLInputElement).style.borderColor = accent"
                @blur="($event.target as HTMLInputElement).style.borderColor = 'var(--nx-border)'" />
            </div>
            <div>
              <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--nx-muted);margin-bottom:8px">Nachricht *</label>
              <textarea v-model="form.message" rows="6" placeholder="Schildern Sie uns Ihr Anliegen…" required
                style="width:100%;padding:12px 14px;border:1px solid var(--nx-border);border-radius:8px;background:var(--nx-surface);color:var(--nx-text);font-size:14px;font-family:inherit;outline:none;box-sizing:border-box;resize:vertical;line-height:1.6;transition:border-color .15s"
                @focus="($event.target as HTMLTextAreaElement).style.borderColor = accent"
                @blur="($event.target as HTMLTextAreaElement).style.borderColor = 'var(--nx-border)'">
              </textarea>
            </div>
            <div v-if="error"
              style="font-size:13px;padding:12px 16px;border-radius:8px;color:#f87171;background:#f8717111;border:1px solid #f8717133">
              {{ error }}
            </div>
            <div style="display:flex;align-items:center;gap:16px">
              <button type="submit" :disabled="sending"
                style="display:inline-flex;align-items:center;gap:8px;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;color:#fff;border:none;cursor:pointer;transition:opacity .15s;font-family:inherit"
                :style="{ background: accent, opacity: sending ? '.5' : '1' }">
                <span v-if="sending">Wird gesendet…</span>
                <span v-else>Anfrage senden →</span>
              </button>
              <p style="font-size:12px;color:var(--nx-muted);margin:0">Ihre Anfrage wird als Lead im CRM gespeichert.</p>
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.contact-grid {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 60px;
  align-items: start;
}
@media (max-width: 900px) {
  .contact-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
  .form-row     { grid-template-columns: 1fr !important; }
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: .4; }
}
</style>
