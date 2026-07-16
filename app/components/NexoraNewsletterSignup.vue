<template>
  <div class="nx-newsletter">
    <div v-if="state === 'success'" class="nx-newsletter-msg">
      <i class="ti ti-mail-check" style="font-size:16px;flex-shrink:0;margin-top:1px"></i>
      <span>Fast geschafft! Bitte bestätige die Anmeldung über den Link in deiner E-Mail.</span>
    </div>
    <form v-else class="nx-newsletter-form" @submit.prevent="submit">
      <input
        v-model="email"
        type="email"
        required
        placeholder="deine@email.de"
        class="nx-newsletter-input"
      />
      <!-- Honeypot: für echte Nutzer unsichtbar, nur Bots füllen es aus -->
      <input v-model="website" type="text" name="website" tabindex="-1" autocomplete="off" class="nx-newsletter-honeypot" />
      <button type="submit" class="nx-newsletter-btn" :disabled="state === 'sending'">
        <i v-if="state === 'sending'" class="ti ti-loader-2 spin"></i>
        <span v-else>Anmelden</span>
      </button>
    </form>
    <p v-if="state === 'error'" class="nx-newsletter-error">Das hat leider nicht geklappt. Bitte versuch es erneut.</p>
  </div>
</template>

<script setup lang="ts">
const { tenant } = useTenant()
const config = useRuntimeConfig()

const email   = ref('')
const website = ref('') // Honeypot
const state   = ref<'idle' | 'sending' | 'success' | 'error'>('idle')

async function submit() {
  if (state.value === 'sending') return
  state.value = 'sending'
  try {
    const apiUrl = config.public.plexoraApiUrl as string
    const tenantId = tenant.value.tenantId
    await $fetch(`${apiUrl}/api/public/${tenantId}/newsletter/signup`, {
      method: 'POST',
      body: { email: email.value, website: website.value },
    })
    state.value = 'success'
  } catch {
    state.value = 'error'
  }
}
</script>

<style scoped>
.nx-newsletter { max-width: 280px; }
.nx-newsletter-form { display: flex; flex-direction: column; gap: 8px; }
.nx-newsletter-input {
  height: 36px; padding: 0 12px; border-radius: 6px; width: 100%; box-sizing: border-box;
  border: 1px solid var(--nx-border); background: var(--nx-surface); color: var(--nx-text);
  font-size: 13px; font-family: inherit;
}
.nx-newsletter-input::placeholder { color: var(--nx-muted); }
.nx-newsletter-honeypot { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }
.nx-newsletter-btn {
  height: 36px; padding: 0 16px; border-radius: 6px; border: none; cursor: pointer;
  background: var(--nx-accent); color: #fff; font-weight: 700; font-size: 13px; font-family: inherit;
}
.nx-newsletter-btn:disabled { opacity: .6; cursor: default; }
.nx-newsletter-msg { display: flex; align-items: flex-start; gap: 8px; color: var(--nx-muted); font-size: 13px; line-height: 1.5; }
.nx-newsletter-error { color: #ef4444; font-size: 12px; margin-top: 6px; }
</style>
