<script setup lang="ts">
// Ziel des Links aus der Bestätigungsmail: bestätigt die Adresse, meldet an und führt zurück zum Blog.
const route = useRoute()
const v = useVisitor()
const state = ref<'work' | 'ok' | 'error'>('work'), message = ref('')
onMounted(async () => {
  const token = typeof route.query.token === 'string' ? route.query.token : ''
  if (!token) { state.value = 'error'; message.value = 'Der Link ist unvollständig.'; return }
  try { const r = await v.post('visitor/verify', { token }, false); v.save(r.token, r.name); state.value = 'ok'; message.value = `Willkommen, ${r.name}! Dein Konto ist bestätigt, du bist angemeldet.` }
  catch (e: any) { state.value = 'error'; message.value = e.message }
})
useHead({ title: 'Konto bestätigen', meta: [{ name: 'robots', content: 'noindex' }] })
</script>
<template>
  <div style="background:var(--nx-bg);color:var(--nx-text);min-height:100vh;font-family:'Inter',system-ui,sans-serif">
    <NexoraNavbar />
    <div style="max-width:520px;margin:0 auto;padding:140px 24px 80px;text-align:center">
      <h1 style="font-size:26px;font-weight:800;margin:0 0 14px">Konto bestätigen</h1>
      <p v-if="state === 'work'" style="color:var(--nx-muted)">Einen Moment …</p>
      <p v-else :style="{ color: state === 'ok' ? '#16a34a' : '#dc2626' }" style="font-size:15px;line-height:1.6">{{ message }}</p>
      <NuxtLink v-if="state !== 'work'" to="/blog" style="display:inline-block;margin-top:20px;color:var(--nx-accent);font-weight:600">Zum Blog →</NuxtLink>
    </div>
    <NexoraFooter />
  </div>
</template>
