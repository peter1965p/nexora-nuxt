<script setup lang="ts">
const { tenant } = useTenant()
const accent   = computed(() => tenant.value.branding.primaryColor || '#f97316')
const hero     = computed(() => tenant.value.content.hero || {})
const bg       = computed(() => tenant.value.branding.heroBackground || 'grid')

// Parse headline: "Wir bauen **wirklich** gute Software." → before / highlight / after
const parsed = computed(() => {
  const h = (hero.value as any).headline || 'Software, die **wirklich** skaliert.'
  const m = h.match(/^([\s\S]*?)\*\*([\s\S]*?)\*\*([\s\S]*)$/)
  if (m) return { before: m[1].trimEnd(), highlight: m[2], after: m[3].trimStart() }
  return { before: h, highlight: '', after: '' }
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
    <div style="position:absolute;bottom:-200px;right:0;width:500px;height:500px;border-radius:50%;pointer-events:none;opacity:.08;filter:blur(100px);background:#22c55e"></div>

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
          <!-- Before highlight -->
          <span v-if="parsed.before" style="color:var(--nx-text);display:block">{{ parsed.before }}</span>

          <!-- Highlight word with red oval -->
          <span v-if="parsed.highlight" style="position:relative;display:inline-block;color:var(--nx-text)" :style="{ color: accent }">
            {{ parsed.highlight }}
            <!-- Red oval SVG -->
            <svg style="position:absolute;left:-10%;top:-15%;width:120%;height:130%;pointer-events:none" viewBox="0 0 120 50" preserveAspectRatio="none">
              <ellipse cx="60" cy="25" rx="57" ry="22" fill="none" stroke="#ef4444" stroke-width="1.8" stroke-dasharray="0" transform="rotate(-3 60 25)" opacity=".9"/>
            </svg>
          </span>

          <!-- After highlight -->
          <span v-if="parsed.after" style="display:block"
            :style="`background:linear-gradient(135deg,${accent},${accent}aa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text`">
            {{ parsed.after }}
          </span>
        </h1>

        <!-- Subline -->
        <p style="font-size:17px;line-height:1.65;color:var(--nx-muted);margin:0 0 36px;max-width:460px;font-weight:400">
          {{ (hero as any).subheadline || (hero as any).desc || 'Digitale Lösungen für Unternehmen, die wachsen wollen.' }}
        </p>

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

      <!-- RIGHT: Code editor in green circle -->
      <div style="display:flex;align-items:center;justify-content:center;position:relative">
        <!-- Green circle -->
        <div style="position:relative;width:min(420px,90vw);aspect-ratio:1;border-radius:50%;border:1.5px solid #22c55e;display:flex;align-items:center;justify-content:center;padding:36px;box-sizing:border-box">

          <!-- Subtle green glow on circle -->
          <div style="position:absolute;inset:0;border-radius:50%;opacity:.06;background:#22c55e;filter:blur(20px);pointer-events:none"></div>

          <!-- Code editor card -->
          <div style="width:100%;background:#0d1117;border-radius:12px;border:1px solid #1e293b;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.6)">
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
