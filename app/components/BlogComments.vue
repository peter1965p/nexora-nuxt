<script setup lang="ts">
// Kommentare unter einem Blogbeitrag. Erscheint nur, wenn der Inhaber sie eingeschaltet hat (Server meldet mode "off" sonst).
// Schreiben geht nur mit Konto (E-Mail bestätigt). Kommentartexte werden ausschließlich als Text angezeigt, nie als HTML.
const props = defineProps<{ slug: string }>()
const { tenant } = useTenant()
const v = useVisitor()
const mode = ref<'off' | 'open' | 'moderated'>('off')
const comments = ref<{ commentId: string; name: string; text: string; created: string }[]>([])
const view = ref<'login' | 'register' | 'forgot'>('login')
const form = reactive({ name: '', email: '', password: '', text: '', website: '' })
const busy = ref(false), msg = ref(''), err = ref('')
// Bot-Schutz (Cloudflare Turnstile): Widget nur, wenn der Server die Prüfung auch verlangt (Konto anlegen, Passwort vergessen)
const botProtection = ref<{ siteKey: string; mode: string } | null>(null)
const tsToken = ref(''), tsRef = ref<{ reset: () => void } | null>(null)
watch(view, () => { tsToken.value = '' })
function needToken() { if (botProtection.value && !tsToken.value) throw new Error('Bitte bestätige zuerst die Sicherheitsprüfung („Ich bin kein Roboter“).') }
function resetToken() { tsToken.value = ''; tsRef.value?.reset() }          // ein Token gilt nur einmal

async function loadComments() {
  try {
    const r = await $fetch<{ mode: any; comments: any[]; botProtection?: { siteKey: string; mode: string } | null }>(`${v.base()}/blog/${encodeURIComponent(props.slug)}/comments`)
    mode.value = r.mode; comments.value = r.comments || []; botProtection.value = r.botProtection || null
  } catch { mode.value = 'off' }
}
onMounted(async () => {
  v.load()
  await loadComments()
  if (v.loggedIn.value && mode.value !== 'off') { try { await v.post('visitor/me') } catch { /* v.post meldet eine abgelaufene Sitzung selbst ab */ } }
})

const fmt = (d: string) => new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }) + ', ' + new Date(d).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
async function run(fn: () => Promise<void>) { busy.value = true; err.value = ''; msg.value = ''; try { await fn() } catch (e: any) { err.value = e.message } finally { busy.value = false } }
const doLogin = () => run(async () => { const r = await v.post('visitor/login', { email: form.email, password: form.password }, false); v.save(r.token, r.name); form.password = '' })
const doRegister = () => run(async () => { needToken(); try { const r = await v.post('visitor/register', { name: form.name, email: form.email, password: form.password, turnstileToken: tsToken.value }, false); msg.value = r.message; form.password = '' } finally { resetToken() } })
const doForgot = () => run(async () => { needToken(); try { const r = await v.post('visitor/forgot', { email: form.email, turnstileToken: tsToken.value }, false); msg.value = r.message } finally { resetToken() } })
const doLogout = () => run(async () => { try { await v.post('visitor/logout') } catch { /* auch ohne Server abmelden */ } v.clear() })
const doComment = () => run(async () => {
  const r = await v.post(`blog/${encodeURIComponent(props.slug)}/comments`, { text: form.text, website: form.website })
  msg.value = r.message; form.text = ''
  if (r.comment) comments.value = [...comments.value, r.comment]
})
const doDelete = () => run(async () => {
  if (!window.confirm('Dein Konto und alle deine Kommentare werden gelöscht. Das kann nicht rückgängig gemacht werden. Fortfahren?')) return
  await v.post('visitor/delete-account', { confirm: 'LOESCHEN' }); v.clear(); await loadComments(); msg.value = 'Dein Konto wurde gelöscht.'
})
</script>

<template>
  <section v-if="mode !== 'off'" id="kommentare" style="margin-top:56px;padding-top:32px;border-top:1px solid var(--nx-border)">
    <h2 style="font-size:20px;font-weight:800;margin:0 0 20px">Kommentare <span style="color:var(--nx-muted);font-weight:600">({{ comments.length }})</span></h2>

    <div v-if="!comments.length" style="color:var(--nx-muted);font-size:14px;margin-bottom:24px">Noch keine Kommentare. Schreib den ersten.</div>
    <article v-for="c in comments" :key="c.commentId" style="padding:16px 18px;border:1px solid var(--nx-border);background:var(--nx-surface);border-radius:12px;margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:6px"><strong style="font-size:14px">{{ c.name }}</strong><span style="font-size:12px;color:var(--nx-muted)">{{ fmt(c.created) }}</span></div>
      <p style="margin:0;font-size:14px;line-height:1.6;white-space:pre-line;overflow-wrap:anywhere;color:var(--nx-text)">{{ c.text }}</p>
    </article>

    <div style="margin-top:28px;padding:20px;border:1px solid var(--nx-border);border-radius:12px;background:var(--nx-surface)">
      <!-- angemeldet: schreiben -->
      <template v-if="v.loggedIn.value">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:12px">
          <span style="font-size:13px;color:var(--nx-muted)">Angemeldet als <strong style="color:var(--nx-text)">{{ v.state.value.name }}</strong></span>
          <span style="font-size:12px"><button class="lnk" @click="doLogout">Abmelden</button> · <button class="lnk" style="color:#E05C5C" @click="doDelete">Konto löschen</button></span>
        </div>
        <form @submit.prevent="doComment">
          <textarea v-model="form.text" rows="4" maxlength="2000" required placeholder="Dein Kommentar …" class="inp" style="resize:vertical"></textarea>
          <input v-model="form.website" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0" />
          <div style="display:flex;align-items:center;gap:12px;margin-top:10px;flex-wrap:wrap">
            <button class="btn" :disabled="busy || form.text.trim().length < 2" type="submit">{{ busy ? 'Sende …' : 'Kommentar senden' }}</button>
            <span style="font-size:12px;color:var(--nx-muted)">{{ mode === 'moderated' ? 'Kommentare erscheinen nach einer kurzen Prüfung.' : 'Dein Kommentar erscheint sofort.' }}</span>
          </div>
        </form>
      </template>

      <!-- nicht angemeldet: Konto -->
      <template v-else>
        <div style="font-size:14px;margin-bottom:12px">Zum Kommentieren brauchst du ein kostenloses Konto.</div>
        <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap">
          <button class="tab" :class="{ on: view === 'login' }" @click="view = 'login'; err = ''; msg = ''">Anmelden</button>
          <button class="tab" :class="{ on: view === 'register' }" @click="view = 'register'; err = ''; msg = ''">Konto anlegen</button>
        </div>
        <form v-if="view === 'login'" @submit.prevent="doLogin" style="display:grid;gap:10px;max-width:420px">
          <input v-model="form.email" type="email" required autocomplete="email" placeholder="E-Mail-Adresse" class="inp" />
          <input v-model="form.password" type="password" required autocomplete="current-password" placeholder="Passwort" class="inp" />
          <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap"><button class="btn" :disabled="busy" type="submit">{{ busy ? 'Moment …' : 'Anmelden' }}</button><button type="button" class="lnk" @click="view = 'forgot'; err = ''; msg = ''">Passwort vergessen?</button></div>
        </form>
        <form v-else-if="view === 'register'" @submit.prevent="doRegister" style="display:grid;gap:10px;max-width:420px">
          <input v-model="form.name" type="text" required minlength="2" maxlength="60" autocomplete="name" placeholder="Dein Name (wird bei Kommentaren angezeigt)" class="inp" />
          <input v-model="form.email" type="email" required autocomplete="email" placeholder="E-Mail-Adresse (wird nicht angezeigt)" class="inp" />
          <input v-model="form.password" type="password" required minlength="10" autocomplete="new-password" placeholder="Passwort (mindestens 10 Zeichen)" class="inp" />
          <TurnstileWidget v-if="botProtection" ref="tsRef" v-model="tsToken" :site-key="botProtection.siteKey" :mode="botProtection.mode" />
          <button class="btn" :disabled="busy" type="submit">{{ busy ? 'Moment …' : 'Konto anlegen' }}</button>
          <p style="font-size:11px;color:var(--nx-muted);margin:0;line-height:1.5">Wir speichern deinen Namen und deine E-Mail-Adresse nur, um dein Konto zu führen und Kommentare zuzuordnen. Du kannst dein Konto jederzeit selbst löschen. Mehr in der <NuxtLink to="/datenschutz" style="color:var(--nx-accent)">Datenschutzerklärung</NuxtLink>.</p>
        </form>
        <form v-else @submit.prevent="doForgot" style="display:grid;gap:10px;max-width:420px">
          <input v-model="form.email" type="email" required autocomplete="email" placeholder="E-Mail-Adresse deines Kontos" class="inp" />
          <TurnstileWidget v-if="botProtection" ref="tsRef" v-model="tsToken" :site-key="botProtection.siteKey" :mode="botProtection.mode" />
          <div style="display:flex;align-items:center;gap:14px"><button class="btn" :disabled="busy" type="submit">{{ busy ? 'Moment …' : 'Link senden' }}</button><button type="button" class="lnk" @click="view = 'login'; err = ''; msg = ''">Zurück</button></div>
        </form>
      </template>

      <p v-if="msg" style="margin:14px 0 0;font-size:13px;color:#16a34a" role="status">{{ msg }}</p>
      <p v-if="err" style="margin:14px 0 0;font-size:13px;color:#dc2626" role="alert">{{ err }}</p>
    </div>
  </section>
</template>

<style scoped>
.inp { width: 100%; box-sizing: border-box; font: inherit; font-size: 14px; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--nx-border); background: var(--nx-bg); color: var(--nx-text) }
.btn { font: inherit; font-size: 14px; font-weight: 700; padding: 10px 18px; border-radius: 8px; border: none; background: var(--nx-accent); color: #fff; cursor: pointer } .btn:disabled { opacity: .55; cursor: not-allowed }
.tab { font: inherit; font-size: 13px; font-weight: 700; padding: 6px 14px; border-radius: 20px; border: 1px solid var(--nx-border); background: transparent; color: var(--nx-muted); cursor: pointer } .tab.on { background: var(--nx-accent); border-color: var(--nx-accent); color: #fff }
.lnk { font: inherit; font-size: inherit; background: none; border: none; color: var(--nx-accent); cursor: pointer; padding: 0; text-decoration: underline }
</style>
