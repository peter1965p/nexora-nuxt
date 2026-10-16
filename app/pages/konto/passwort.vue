<script setup lang="ts">
// Ziel des Links aus der Mail "Passwort zurücksetzen": neues Passwort festlegen.
const route = useRoute()
const v = useVisitor()
const password = ref(''), busy = ref(false), done = ref(false), err = ref('')
const token = computed(() => (typeof route.query.token === 'string' ? route.query.token : ''))
async function submit() {
  busy.value = true; err.value = ''
  try { await v.post('visitor/reset', { token: token.value, password: password.value }, false); done.value = true; v.clear() }
  catch (e: any) { err.value = e.message } finally { busy.value = false }
}
useHead({ title: 'Neues Passwort', meta: [{ name: 'robots', content: 'noindex' }] })
</script>
<template>
  <div style="background:var(--nx-bg);color:var(--nx-text);min-height:100vh;font-family:'Inter',system-ui,sans-serif">
    <NexoraNavbar />
    <div style="max-width:420px;margin:0 auto;padding:140px 24px 80px">
      <h1 style="font-size:26px;font-weight:800;margin:0 0 14px;text-align:center">Neues Passwort</h1>
      <div v-if="done" style="text-align:center"><p style="color:#16a34a;line-height:1.6">Dein Passwort wurde geändert. Du kannst dich jetzt unter einem Beitrag anmelden.</p><NuxtLink to="/blog" style="color:var(--nx-accent);font-weight:600">Zum Blog →</NuxtLink></div>
      <form v-else @submit.prevent="submit" style="display:grid;gap:12px">
        <p v-if="!token" style="color:#dc2626">Der Link ist unvollständig.</p>
        <input v-model="password" type="password" required minlength="10" autocomplete="new-password" placeholder="Neues Passwort (mindestens 10 Zeichen)" style="font:inherit;padding:10px 12px;border-radius:8px;border:1px solid var(--nx-border);background:var(--nx-surface);color:var(--nx-text)" />
        <button :disabled="busy || !token || password.length < 10" style="font:inherit;font-weight:700;padding:11px;border-radius:8px;border:none;background:var(--nx-accent);color:#fff;cursor:pointer">{{ busy ? 'Moment …' : 'Passwort speichern' }}</button>
        <p v-if="err" style="color:#dc2626;font-size:13px;margin:0" role="alert">{{ err }}</p>
      </form>
    </div>
    <NexoraFooter />
  </div>
</template>
