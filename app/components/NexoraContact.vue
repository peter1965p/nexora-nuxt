<script setup lang="ts">
const { tenant } = useTenant()
const config = useRuntimeConfig()

const accent     = computed(() => tenant.value.branding.primaryColor || '#f97316')
const phoneHref  = computed(() => {
  const p = tenant.value.contact.phone
  return p ? `tel:${p.replace(/\s/g, '')}` : '#'
})

const form = reactive({ name: '', email: '', subject: '', message: '' })
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
      body: {
        name:    form.name,
        email:   form.email,
        subject: form.subject,
        message: form.message,
      },
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
  <section class="w-full px-6 md:px-16 py-24 flex flex-col md:flex-row gap-16 max-w-6xl mx-auto">

    <!-- Left: contact info -->
    <div class="md:w-80 flex-shrink-0">
      <p class="text-[10px] uppercase tracking-[0.3em] mb-4" :style="{ color: accent }">Kontakt</p>
      <h2 class="text-4xl font-black italic uppercase mb-8" style="color:var(--nx-text)">Jetzt anfragen.</h2>
      <div class="space-y-5 text-[11px]" style="color:var(--nx-muted)">
        <div v-if="tenant.contact.address" class="flex items-start gap-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" :stroke="accent" stroke-width="2" class="mt-0.5 shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span style="white-space:pre-line">{{ tenant.contact.address }}</span>
        </div>
        <div v-if="tenant.contact.phone">
          <a :href="phoneHref" class="flex items-center gap-3 hover:opacity-100 transition-opacity" style="opacity:.8;color:inherit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" :stroke="accent" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.8-1.8a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z"/></svg>
            {{ tenant.contact.phone }}
          </a>
        </div>
        <div v-if="tenant.contact.email">
          <a :href="`mailto:${tenant.contact.email}`" class="flex items-center gap-3 hover:opacity-100 transition-opacity" style="opacity:.8;color:inherit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" :stroke="accent" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,12 2,6"/></svg>
            {{ tenant.contact.email }}
          </a>
        </div>
        <div v-if="tenant.contact.availability" class="flex items-start gap-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" :stroke="accent" stroke-width="2" class="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          {{ tenant.contact.availability }}
        </div>
      </div>
    </div>

    <!-- Right: form -->
    <div class="flex-1">
      <!-- Success -->
      <div v-if="sent" class="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div class="w-14 h-14 rounded-full flex items-center justify-center" :style="{ background: accent + '22' }">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" :stroke="accent" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h3 class="text-xl font-black italic uppercase" style="color:var(--nx-text)">Nachricht gesendet.</h3>
        <p class="text-[11px]" style="color:var(--nx-muted)">Wir melden uns schnellstmöglich bei Ihnen.</p>
        <button class="text-[10px] uppercase tracking-widest mt-4 underline" :style="{ color: accent }" @click="sent = false">
          Weitere Anfrage
        </button>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="submit" class="flex flex-col gap-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[9px] uppercase tracking-widest mb-2" style="color:var(--nx-muted)">Name *</label>
            <input v-model="form.name" type="text" placeholder="Max Mustermann" required
              class="w-full px-4 py-3 text-[12px] outline-none transition-all"
              style="background:var(--nx-surface);border:1px solid var(--nx-border);color:var(--nx-text);font-family:inherit;border-radius:4px"
              @focus="($event.target as HTMLInputElement).style.borderColor = accent"
              @blur="($event.target as HTMLInputElement).style.borderColor = 'var(--nx-border)'" />
          </div>
          <div>
            <label class="block text-[9px] uppercase tracking-widest mb-2" style="color:var(--nx-muted)">E-Mail *</label>
            <input v-model="form.email" type="email" placeholder="max@firma.de" required
              class="w-full px-4 py-3 text-[12px] outline-none transition-all"
              style="background:var(--nx-surface);border:1px solid var(--nx-border);color:var(--nx-text);font-family:inherit;border-radius:4px"
              @focus="($event.target as HTMLInputElement).style.borderColor = accent"
              @blur="($event.target as HTMLInputElement).style.borderColor = 'var(--nx-border)'" />
          </div>
        </div>
        <div>
          <label class="block text-[9px] uppercase tracking-widest mb-2" style="color:var(--nx-muted)">Betreff</label>
          <input v-model="form.subject" type="text" placeholder="Worum geht es?"
            class="w-full px-4 py-3 text-[12px] outline-none transition-all"
            style="background:var(--nx-surface);border:1px solid var(--nx-border);color:var(--nx-text);font-family:inherit;border-radius:4px"
            @focus="($event.target as HTMLInputElement).style.borderColor = accent"
            @blur="($event.target as HTMLInputElement).style.borderColor = 'var(--nx-border)'" />
        </div>
        <div>
          <label class="block text-[9px] uppercase tracking-widest mb-2" style="color:var(--nx-muted)">Nachricht *</label>
          <textarea v-model="form.message" rows="6" placeholder="Schildern Sie uns Ihr Anliegen..." required
            class="w-full px-4 py-3 text-[12px] outline-none transition-all resize-y"
            style="background:var(--nx-surface);border:1px solid var(--nx-border);color:var(--nx-text);font-family:inherit;border-radius:4px;line-height:1.6"
            @focus="($event.target as HTMLTextAreaElement).style.borderColor = accent"
            @blur="($event.target as HTMLTextAreaElement).style.borderColor = 'var(--nx-border)'">
          </textarea>
        </div>
        <div v-if="error" class="text-[11px] px-3 py-2 rounded" style="color:#f87171;background:#f8717111;border:1px solid #f8717133">
          {{ error }}
        </div>
        <div class="flex items-center gap-4">
          <button type="submit" :disabled="sending"
            class="px-8 py-3 text-[11px] font-bold uppercase tracking-widest text-white transition-opacity disabled:opacity-50"
            style="background:var(--nx-accent);border:none;cursor:pointer;border-radius:4px;font-family:inherit">
            <span v-if="sending">Wird gesendet…</span>
            <span v-else>Anfrage senden →</span>
          </button>
          <p class="text-[9px]" style="color:var(--nx-muted)">Wird als Lead in Plexora CRM gespeichert.</p>
        </div>
      </form>
    </div>
  </section>
</template>
