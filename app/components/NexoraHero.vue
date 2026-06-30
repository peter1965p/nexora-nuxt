<script setup lang="ts">
const { tenant } = useTenant()
const accent   = computed(() => tenant.value.branding.primaryColor || '#f97316')
const hero     = computed(() => tenant.value.content.hero || {})
const bg       = computed(() => tenant.value.branding.heroBackground || 'grid')

// headline = "Wir bauen Software die"  → white
// subheadline = "wirklich skaliert."   → first word gets oval+accent, rest gets gradient
const parsed = computed(() => {
  const sub = (hero.value as any).subheadline || ''
  const words = sub.trim().split(/\s+/)
  const oval = words[0] || ''
  const rest = words.slice(1).join(' ')
  return {
    headline:  (hero.value as any).headline || 'Software, die',
    oval,
    rest,
  }
})

// Stack items for code editor
const stackItems = computed(() => tenant.value.stack?.items?.slice(0, 4) || [])
const codeProvider = computed(() => {
  const items = stackItems.value as any[]
  const cloud = items.find(i => i.color === 'yellow')?.label || 'aws'
  return cloud.toLowerCase().replace(/\s/g, '-')
})
</script>

<template>
  <section style="position:relative;width:100%;min-height:100vh;display:flex;align-items:center;background:var(--nx-bg);overflow:hidden;font-family:'Inter',system-ui,sans-serif">

    <!-- Background -->
    <div v-if="bg === 'grid'" style="position:absolute;inset:0;pointer-events:none"
      :style="`background-image:linear-gradient(${accent}15 1px,transparent 1px),linear-gradient(90deg,${accent}15 1px,transparent 1px);background-size:52px 52px`"></div>
    <div v-else-if="bg === 'dots'" style="position:absolute;inset:0;pointer-events:none"
      :style="`background-image:radial-gradient(${accent}40 1px,transparent 1px);background-size:32px 32px`"></div>

    <!-- Radial glow -->
    <div style="position:absolute;top:-200px;left:-200px;width:600px;height:600px;border-radius:50%;pointer-events:none;opacity:.12;filter:blur(80px)"
      :style="{ background: accent }"></div>
    <div style="position:absolute;bottom:-200px;right:0;width:500px;height:500px;border-radius:50%;pointer-events:none;opacity:.06;filter:blur(100px)" :style="{ background: accent }"></div>

    <!-- Content -->
    <div style="position:relative;z-index:10;width:100%;max-width:1200px;margin:0 auto;padding:100px 24px 60px;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center">

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
          <!-- Headline (white) -->
          <span style="color:var(--nx-text);display:block">{{ parsed.headline }}</span>

          <!-- Subheadline: first word = accent, rest = gradient -->
          <span style="display:block">
            <span v-if="parsed.oval" :style="{ color: accent }">{{ parsed.oval }}</span>
            <span v-if="parsed.rest"
              :style="`background:linear-gradient(135deg,${accent},${accent}99);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text`">
              {{ ' ' + parsed.rest }}
            </span>
          </span>
        </h1>

        <!-- Desc only (subheadline is used in the headline above) -->
        <p v-if="(hero as any).desc" style="font-size:17px;line-height:1.65;color:var(--nx-muted);margin:0 0 36px;max-width:460px;font-weight:400">
          {{ (hero as any).desc }}
        </p>
        <div v-else style="margin-bottom:36px"></div>

        <!-- CTAs -->
        <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
          <a href="#kontakt"
            style="display:inline-flex;align-items:center;gap:8px;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;color:#fff;text-decoration:none;transition:all .2s"
            :style="{ background: accent }"
            onmouseover="this.style.opacity='.85';this.style.transform='translateY(-1px)'"
            onmouseout="this.style.opacity='1';this.style.transform='translateY(0)'">
            {{ (hero as any).cta || 'Kontakt aufnehmen' }} →
          </a>
          <a href="#leistungen"
            style="display:inline-flex;align-items:center;gap:6px;padding:12px 4px;font-size:14px;font-weight:500;text-decoration:none;transition:opacity .15s"
            :style="{ color: 'var(--nx-muted)' }"
            onmouseover="this.style.color='var(--nx-text)'"
            onmouseout="this.style.color='var(--nx-muted)'">
            Leistungen ansehen
          </a>
        </div>
      </div>

      <!-- RIGHT: Code editor floating card -->
      <div style="display:flex;align-items:center;justify-content:center;position:relative">
        <!-- Glow behind card -->
        <div style="position:absolute;inset:-40px;border-radius:24px;opacity:.15;background:var(--nx-accent, #f97316);filter:blur(60px);pointer-events:none" :style="{ background: accent }"></div>

        <div style="position:relative;width:100%;max-width:480px">
          <!-- Code editor card -->
          <div style="width:100%;background:#0d1117;border-radius:14px;border:1px solid #1e293b;overflow:hidden;box-shadow:0 32px 80px rgba(0,0,0,.7),0 0 0 1px rgba(255,255,255,.04);transform:perspective(1000px) rotateY(-4deg) rotateX(2deg)">
            <!-- Title bar -->
            <div style="padding:10px 14px;background:#161b22;border-bottom:1px solid #21262d;display:flex;align-items:center;gap:6px">
              <div style="width:10px;height:10px;border-radius:50%;background:#ef4444"></div>
              <div style="width:10px;height:10px;border-radius:50%;background:#f97316"></div>
              <div style="width:10px;height:10px;border-radius:50%;background:#22c55e"></div>
              <span style="margin-left:8px;font-size:11px;color:#64748b;font-family:ui-monospace,monospace">nexora.config.ts</span>
            </div>
            <!-- Code -->
            <pre style="margin:0;padding:16px;font-family:ui-monospace,'SF Mono',monospace;font-size:11.5px;line-height:1.7;overflow:hidden;color:#e2e8f0"><span style="color:#7c3aed">import</span> <span style="color:#e2e8f0">{ defineConfig }</span> <span style="color:#7c3aed">from</span> <span style="color:#22c55e">'nexora'</span><span style="color:#e2e8f0">;</span>

<span style="color:#7c3aed">export default</span> <span style="color:#3b82f6">defineConfig</span>({
  <span style="color:#64748b">cloud</span>: {
    <span style="color:#64748b">provider</span>: <span style="color:#22c55e">'{{ codeProvider }}'</span>,
    <span style="color:#64748b">region</span>:   <span style="color:#22c55e">'eu-central-1'</span>,
    <span style="color:#64748b">autoscale</span>: <span style="color:#f97316">true</span>,
  },
  <span style="color:#64748b">security</span>: {
    <span style="color:#64748b">dsgvo</span>:  <span style="color:#f97316">true</span>,
    <span style="color:#64748b">audit</span>: <span style="color:#22c55e">'continuous'</span>,
  },
});</pre>
            <!-- Status bar -->
            <div style="padding:7px 14px;background:#161b22;border-top:1px solid #21262d;display:flex;align-items:center;gap:6px">
              <span style="width:6px;height:6px;border-radius:50%;background:#22c55e;box-shadow:0 0 6px #22c55e88"></span>
              <span style="font-size:10px;color:#22c55e;font-family:ui-monospace,monospace">{{ stackItems.length || 4 }} services · running</span>
            </div>
          </div>
        </div>
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
@media (max-width: 768px) {
  section > div > div { grid-template-columns: 1fr !important; }
  section > div > div > div:last-child { display: none !important; }
}
</style>
