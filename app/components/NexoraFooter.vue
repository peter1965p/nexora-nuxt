<script setup lang="ts">
const { tenant } = useTenant()
const accent  = computed(() => tenant.value.branding.primaryColor || '#f97316')
const company = computed(() => tenant.value.companyName || 'nexora')
const contact = computed(() => tenant.value.contact || {})
const pages   = computed(() => tenant.value.pages || [])
</script>

<template>
  <footer style="background:var(--nx-bg);border-top:1px solid var(--nx-border);font-family:'Inter',system-ui,sans-serif">
    <div style="max-width:1200px;margin:0 auto;padding:48px 24px 28px">

      <!-- Top row -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:40px;margin-bottom:48px">

        <!-- Brand -->
        <div>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
            <div style="width:30px;height:30px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:14px;color:#fff"
              :style="{ background: accent }">
              {{ company[0].toUpperCase() }}
            </div>
            <span style="font-size:16px;font-weight:700;color:var(--nx-text);letter-spacing:-.02em">{{ company.toLowerCase() }}</span>
          </div>
          <p style="font-size:13px;line-height:1.6;color:var(--nx-muted);margin:0;max-width:220px">
            {{ tenant.content.footer?.tagline || 'Digitale Lösungen für Unternehmen, die wachsen wollen.' }}
          </p>
        </div>

        <!-- Navigation -->
        <div>
          <div style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--nx-muted);margin-bottom:14px">Navigation</div>
          <div style="display:flex;flex-direction:column;gap:10px">
            <a v-for="link in [['/', 'Start'], ['#leistungen', 'Leistungen'], ['#about', 'Über uns'], ['#kontakt', 'Kontakt']]"
              :key="link[0]" :href="link[0]"
              style="font-size:13px;color:var(--nx-muted);text-decoration:none;transition:color .15s"
              onmouseover="this.style.color='var(--nx-text)'"
              onmouseout="this.style.color='var(--nx-muted)'">
              {{ link[1] }}
            </a>
            <NuxtLink v-for="pg in pages" :key="pg.slug" :to="`/${pg.slug}`"
              style="font-size:13px;color:var(--nx-muted);text-decoration:none;transition:color .15s"
              onmouseover="this.style.color='var(--nx-text)'"
              onmouseout="this.style.color='var(--nx-muted)'">
              {{ pg.title }}
            </NuxtLink>
          </div>
        </div>

        <!-- Contact -->
        <div>
          <div style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--nx-muted);margin-bottom:14px">Kontakt</div>
          <div style="display:flex;flex-direction:column;gap:10px">
            <a v-if="contact.email" :href="`mailto:${contact.email}`"
              style="font-size:13px;color:var(--nx-muted);text-decoration:none;transition:color .15s;display:flex;align-items:center;gap:8px"
              onmouseover="this.style.color='var(--nx-text)'"
              onmouseout="this.style.color='var(--nx-muted)'">
              <i class="ti ti-mail" style="font-size:13px;flex-shrink:0"></i>{{ contact.email }}
            </a>
            <a v-if="contact.phone" :href="`tel:${contact.phone}`"
              style="font-size:13px;color:var(--nx-muted);text-decoration:none;transition:color .15s;display:flex;align-items:center;gap:8px"
              onmouseover="this.style.color='var(--nx-text)'"
              onmouseout="this.style.color='var(--nx-muted)'">
              <i class="ti ti-phone" style="font-size:13px;flex-shrink:0"></i>{{ contact.phone }}
            </a>
            <span v-if="contact.address" style="font-size:13px;color:var(--nx-muted);display:flex;align-items:flex-start;gap:8px">
              <i class="ti ti-map-pin" style="font-size:13px;flex-shrink:0;margin-top:2px"></i>{{ contact.address }}
            </span>
          </div>
        </div>

      </div>

      <!-- Bottom bar -->
      <div style="padding-top:24px;border-top:1px solid var(--nx-border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
        <span style="font-size:12px;color:var(--nx-muted)">
          © {{ new Date().getFullYear() }} {{ company }} — Alle Rechte vorbehalten
        </span>
        <div v-if="tenant.content.footer?.showStatus !== false" style="display:flex;align-items:center;gap:6px">
          <span style="width:6px;height:6px;border-radius:50%;background:#22c55e;box-shadow:0 0 6px #22c55e88;animation:pulse 2s infinite"></span>
          <span style="font-size:11px;font-weight:500;color:var(--nx-muted)">{{ tenant.content.footer?.statusLabel || 'System Online' }}</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: .4; }
}
@media (max-width: 640px) {
  footer > div > div:first-child { grid-template-columns: 1fr !important; gap: 28px !important; }
}
</style>
