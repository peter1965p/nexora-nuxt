<script setup lang="ts">
const { tenant } = useTenant()
const accent   = computed(() => tenant.value.branding.primaryColor || '#f97316')
const hero     = computed(() => tenant.value.content.hero || {})
const bg       = computed(() => tenant.value.branding.heroBackground || 'grid')

// Code editor vs custom image
const heroMediaType = computed(() => tenant.value.branding.heroMediaType || 'code')
const heroImageUrl  = computed(() => tenant.value.branding.heroImageUrl  || '')

// Headline parsing
const parsed = computed(() => {
  const sub   = (hero.value as any).subheadline || ''
  const words = sub.trim().split(/\s+/)
  const oval  = words[0] || ''
  const rest  = words.slice(1).join(' ')
  return { headline: (hero.value as any).headline || 'Software, die', oval, rest }
})

// Stack items for code editor
const stackItems    = computed(() => tenant.value.stack?.items?.slice(0, 4) || [])
const codeProvider  = computed(() => {
  const items = stackItems.value as any[]
  const cloud = items.find(i => i.color === 'yellow')?.label || 'aws'
  return cloud.toLowerCase().replace(/\s/g, '-')
})

// ── Typewriter animation ────────────────────────────────────────────────────
const CODE_TOKENS = computed(() => [
  { t: 'import',         c: '#7c3aed' },
  { t: ' { defineConfig } ', c: '#e2e8f0' },
  { t: 'from',           c: '#7c3aed' },
  { t: " 'nexora'",      c: '#22c55e' },
  { t: ';\n\n',          c: '#e2e8f0' },
  { t: 'export default', c: '#7c3aed' },
  { t: ' ',              c: '#e2e8f0' },
  { t: 'defineConfig',   c: '#3b82f6' },
  { t: '({',             c: '#e2e8f0' },
  { t: '\n  ',           c: '#e2e8f0' },
  { t: 'cloud',          c: '#64748b' },
  { t: ': {',            c: '#e2e8f0' },
  { t: '\n    ',         c: '#e2e8f0' },
  { t: 'provider',       c: '#64748b' },
  { t: ': ',             c: '#e2e8f0' },
  { t: `'${codeProvider.value}'`, c: '#22c55e' },
  { t: ',',              c: '#e2e8f0' },
  { t: '\n    ',         c: '#e2e8f0' },
  { t: 'region',         c: '#64748b' },
  { t: ':   ',           c: '#e2e8f0' },
  { t: "'eu-central-1'", c: '#22c55e' },
  { t: ',',              c: '#e2e8f0' },
  { t: '\n    ',         c: '#e2e8f0' },
  { t: 'autoscale',      c: '#64748b' },
  { t: ': ',             c: '#e2e8f0' },
  { t: 'true',           c: '#f97316' },
  { t: ',',              c: '#e2e8f0' },
  { t: '\n  },',         c: '#e2e8f0' },
  { t: '\n  ',           c: '#e2e8f0' },
  { t: 'security',       c: '#64748b' },
  { t: ': {',            c: '#e2e8f0' },
  { t: '\n    ',         c: '#e2e8f0' },
  { t: 'dsgvo',          c: '#64748b' },
  { t: ':  ',            c: '#e2e8f0' },
  { t: 'true',           c: '#f97316' },
  { t: ',',              c: '#e2e8f0' },
  { t: '\n    ',         c: '#e2e8f0' },
  { t: 'audit',          c: '#64748b' },
  { t: ': ',             c: '#e2e8f0' },
  { t: "'continuous'",   c: '#22c55e' },
  { t: ',',              c: '#e2e8f0' },
  { t: '\n  },',         c: '#e2e8f0' },
  { t: '\n});',          c: '#e2e8f0' },
])

const totalChars = computed(() => CODE_TOKENS.value.reduce((s, tk) => s + tk.t.length, 0))
const charIdx    = ref(0)
const typing     = ref(true)

const renderedTokens = computed(() => {
  let rem = charIdx.value
  return CODE_TOKENS.value.map(tk => {
    if (rem <= 0) return { c: tk.c, t: '' }
    const shown = tk.t.slice(0, rem)
    rem -= tk.t.length
    return { c: tk.c, t: shown }
  })
})

let timer: ReturnType<typeof setInterval> | null = null

function startTyping() {
  charIdx.value = 0
  typing.value  = true
  timer = setInterval(() => {
    if (charIdx.value < totalChars.value) {
      charIdx.value += 2 // 2 chars per tick = ~90 cps
    } else {
      typing.value = false
      if (timer) clearInterval(timer)
      setTimeout(startTyping, 2800)
    }
  }, 22)
}

onMounted(() => startTyping())
onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<template>
  <section style="position:relative;width:100%;min-height:100vh;display:flex;align-items:center;background:var(--nx-bg);overflow:hidden;font-family:'Inter',system-ui,sans-serif">

    <!-- Background -->
    <div v-if="bg === 'grid'" style="position:absolute;inset:0;pointer-events:none"
      :style="`background-image:linear-gradient(${accent}15 1px,transparent 1px),linear-gradient(90deg,${accent}15 1px,transparent 1px);background-size:52px 52px`"></div>
    <div v-else-if="bg === 'dots'" style="position:absolute;inset:0;pointer-events:none"
      :style="`background-image:radial-gradient(${accent}40 1px,transparent 1px);background-size:32px 32px`"></div>

    <!-- Radial glows -->
    <div style="position:absolute;top:-200px;left:-200px;width:600px;height:600px;border-radius:50%;pointer-events:none;opacity:.12;filter:blur(80px)"
      :style="{ background: accent }"></div>
    <div style="position:absolute;bottom:-200px;right:0;width:500px;height:500px;border-radius:50%;pointer-events:none;opacity:.06;filter:blur(100px)"
      :style="{ background: accent }"></div>

    <!-- Content -->
    <div style="position:relative;z-index:10;width:100%;max-width:1200px;margin:0 auto;padding:100px 24px 60px;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center"
      class="hero-grid">

      <!-- LEFT: Text -->
      <div>
        <!-- Badge -->
        <div style="display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border-radius:9999px;border:1px solid var(--nx-border);background:var(--nx-surface);margin-bottom:32px">
          <span style="width:6px;height:6px;border-radius:50%;flex-shrink:0;animation:pulse 2s infinite"
            :style="{ background: accent }"></span>
          <span style="font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--nx-muted)">
            {{ (hero as any).location || 'Remote · Worldwide' }}
          </span>
        </div>

        <!-- Headline -->
        <h1 style="margin:0 0 24px;line-height:1.08;font-weight:800;letter-spacing:-.03em;font-size:clamp(2.8rem,5.5vw,4.8rem)">
          <span style="color:var(--nx-text);display:block">{{ parsed.headline }}</span>
          <span style="display:block">
            <span v-if="parsed.oval" :style="{ color: accent }">{{ parsed.oval }}</span>
            <span v-if="parsed.rest"
              :style="`background:linear-gradient(135deg,${accent},${accent}99);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text`">
              {{ ' ' + parsed.rest }}
            </span>
          </span>
        </h1>

        <!-- Desc -->
        <p v-if="(hero as any).desc"
          style="font-size:17px;line-height:1.65;color:var(--nx-muted);margin:0 0 36px;max-width:460px;font-weight:400">
          {{ (hero as any).desc }}
        </p>
        <div v-else style="margin-bottom:36px"></div>

        <!-- CTAs -->
        <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
          <NuxtLink to="/kontakt"
            style="display:inline-flex;align-items:center;gap:8px;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;color:#fff;text-decoration:none;transition:all .2s"
            :style="{ background: accent }"
            onmouseover="this.style.opacity='.85';this.style.transform='translateY(-1px)'"
            onmouseout="this.style.opacity='1';this.style.transform='translateY(0)'">
            {{ (hero as any).cta || 'Kontakt aufnehmen' }} →
          </NuxtLink>
          <NuxtLink to="/leistungen"
            style="display:inline-flex;align-items:center;gap:6px;padding:12px 4px;font-size:14px;font-weight:500;text-decoration:none;transition:color .15s"
            :style="{ color: 'var(--nx-muted)' }"
            onmouseover="this.style.color='var(--nx-text)'"
            onmouseout="this.style.color='var(--nx-muted)'">
            Leistungen ansehen
          </NuxtLink>
        </div>
      </div>

      <!-- RIGHT: Code editor OR custom image -->
      <div style="display:flex;align-items:center;justify-content:center;position:relative" class="hero-right">

        <!-- Custom image -->
        <img v-if="heroMediaType === 'image' && heroImageUrl"
          :src="heroImageUrl" alt=""
          style="width:100%;max-width:480px;border-radius:14px;border:1px solid var(--nx-border);box-shadow:0 32px 80px rgba(0,0,0,.5);object-fit:cover" />

        <!-- Code editor (animated) -->
        <template v-else>
          <div style="position:absolute;inset:-40px;border-radius:24px;opacity:.15;filter:blur(60px);pointer-events:none"
            :style="{ background: accent }"></div>
          <div style="position:relative;width:100%;max-width:480px">
            <div style="width:100%;background:#0d1117;border-radius:14px;border:1px solid #1e293b;overflow:hidden;box-shadow:0 32px 80px rgba(0,0,0,.7),0 0 0 1px rgba(255,255,255,.04);transform:perspective(1000px) rotateY(-4deg) rotateX(2deg)">
              <!-- Title bar -->
              <div style="padding:10px 14px;background:#161b22;border-bottom:1px solid #21262d;display:flex;align-items:center;gap:6px">
                <div style="width:10px;height:10px;border-radius:50%;background:#ef4444"></div>
                <div style="width:10px;height:10px;border-radius:50%;background:#f97316"></div>
                <div style="width:10px;height:10px;border-radius:50%;background:#22c55e"></div>
                <span style="margin-left:8px;font-size:11px;color:#64748b;font-family:ui-monospace,monospace">nexora.config.ts</span>
              </div>
              <!-- Animated code -->
              <pre style="margin:0;padding:16px;font-family:ui-monospace,'SF Mono',monospace;font-size:11.5px;line-height:1.7;overflow:hidden;min-height:180px;color:#e2e8f0"><span v-for="(tk, i) in renderedTokens" :key="i" :style="{ color: tk.c || '#6b7280' }">{{ tk.t }}</span><span v-if="typing" style="color:var(--nx-accent);animation:blink .75s step-start infinite;font-weight:300">|</span></pre>
              <!-- Status bar -->
              <div style="padding:7px 14px;background:#161b22;border-top:1px solid #21262d;display:flex;align-items:center;gap:6px">
                <span style="width:6px;height:6px;border-radius:50%;background:#22c55e;box-shadow:0 0 6px #22c55e88"></span>
                <span style="font-size:10px;color:#22c55e;font-family:ui-monospace,monospace">{{ stackItems.length || 4 }} services · running</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Scroll hint -->
    <div style="position:absolute;bottom:32px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:6px;opacity:.35">
      <span style="font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--nx-muted);font-family:'Inter',sans-serif">Scroll</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--nx-muted);animation:bounce 2s infinite"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
  </section>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: .4; }
}
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(4px); }
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}
@media (max-width: 768px) {
  .hero-grid { grid-template-columns: 1fr !important; }
  .hero-right { display: none !important; }
}
</style>
