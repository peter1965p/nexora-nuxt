<script setup lang="ts">
const { tenant } = useTenant()
const accent = computed(() => tenant.value.branding.primaryColor || '#f97316')
</script>

<template>
  <div style="font-family:'Inter',system-ui,sans-serif">

    <!-- Page header -->
    <section style="position:relative;padding:100px 24px 60px;border-bottom:1px solid var(--nx-border);overflow:hidden">
      <div style="position:absolute;inset:0;pointer-events:none;opacity:.04"
        :style="`background-image:linear-gradient(${accent} 1px,transparent 1px),linear-gradient(90deg,${accent} 1px,transparent 1px);background-size:52px 52px`"></div>
      <div style="max-width:1200px;margin:0 auto;position:relative;z-index:1">
        <div style="display:inline-flex;align-items:center;gap:8px;padding:5px 14px;border-radius:9999px;border:1px solid var(--nx-border);background:var(--nx-surface);margin-bottom:28px">
          <i class="ti ti-building" :style="{ color: accent, fontSize: '11px' }"></i>
          <span style="font-size:10px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:var(--nx-muted)">Über uns</span>
        </div>
        <h1 style="font-size:clamp(2.4rem,5vw,3.8rem);font-weight:800;letter-spacing:-.03em;margin:0 0 18px;color:var(--nx-text);line-height:1.08">
          {{ tenant.companyName }}
        </h1>
        <p style="font-size:17px;line-height:1.65;color:var(--nx-muted);margin:0;max-width:540px;font-weight:400">
          Wer wir sind, was uns antreibt und warum unsere Kunden uns vertrauen.
        </p>
      </div>
    </section>

    <!-- About content -->
    <section style="max-width:1200px;margin:0 auto;padding:60px 24px 80px">
      <div class="about-grid">

        <!-- About text -->
        <div>
          <p style="font-size:16px;line-height:1.85;color:var(--nx-muted);margin:0;white-space:pre-line">
            {{ tenant.content.about?.text || 'Kein Text hinterlegt.' }}
          </p>

          <!-- CTA -->
          <div style="margin-top:40px">
            <NuxtLink to="/kontakt"
              style="display:inline-flex;align-items:center;gap:8px;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;color:#fff;text-decoration:none;transition:opacity .15s"
              :style="{ background: accent }"
              onmouseover="this.style.opacity='.85'"
              onmouseout="this.style.opacity='1'">
              Kontakt aufnehmen →
            </NuxtLink>
          </div>
        </div>

        <!-- Stats -->
        <div v-if="tenant.content.stats?.length"
          style="display:grid;grid-template-columns:1fr 1fr;gap:16px;align-content:start">
          <div v-for="stat in tenant.content.stats" :key="stat.label"
            style="padding:28px 24px;border:1px solid var(--nx-border);background:var(--nx-surface);border-radius:10px">
            <div style="font-size:2.2rem;font-weight:800;margin-bottom:8px;letter-spacing:-.03em"
              :style="{ color: accent }">
              {{ stat.value }}
            </div>
            <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--nx-muted)">
              {{ stat.label }}
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;
}
@media (max-width: 768px) {
  .about-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
}
</style>
