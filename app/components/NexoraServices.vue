<script setup lang="ts">
const { tenant, resolved } = useTenant()
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
          <i class="ti ti-briefcase" :style="{ color: accent, fontSize: '11px' }"></i>
          <span style="font-size:10px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:var(--nx-muted)">Leistungen</span>
        </div>
        <h1 style="font-size:clamp(2.4rem,5vw,3.8rem);font-weight:800;letter-spacing:-.03em;margin:0 0 18px;color:var(--nx-text);line-height:1.08">
          Was wir <span :style="{ color: accent }">anbieten</span>
        </h1>
        <p style="font-size:17px;line-height:1.65;color:var(--nx-muted);margin:0;max-width:540px;font-weight:400">
          Maßgeschneiderte Softwarelösungen — von der ersten Idee bis zum laufenden Betrieb.
        </p>
      </div>
    </section>

    <!-- Services grid -->
    <section style="max-width:1200px;margin:0 auto;padding:60px 24px 80px">
      <div v-if="tenant.services.length"
        style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1px;background:var(--nx-border);border:1px solid var(--nx-border);border-radius:12px;overflow:hidden">
        <div v-for="(svc, i) in tenant.services" :key="svc.id"
          style="background:var(--nx-bg);padding:36px;transition:background .2s;cursor:default"
          onmouseover="this.style.background='var(--nx-surface)'"
          onmouseout="this.style.background='var(--nx-bg)'">

          <!-- Icon -->
          <div style="width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:20px"
            :style="{ background: (svc.color || accent) + '18' }">
            <i v-if="svc.icon" :class="svc.icon"
              :style="{ color: svc.color || accent, fontSize: '20px' }"></i>
            <span v-else style="font-size:15px;font-weight:800"
              :style="{ color: svc.color || accent }">{{ String(i + 1).padStart(2, '0') }}</span>
          </div>

          <!-- Title -->
          <h3 style="font-size:16px;font-weight:700;margin:0 0 10px;color:var(--nx-text);letter-spacing:-.01em">
            {{ svc.title }}
          </h3>

          <!-- Description -->
          <p style="font-size:13px;line-height:1.65;color:var(--nx-muted);margin:0 0 20px">
            {{ svc.description }}
          </p>

          <!-- Features -->
          <ul v-if="svc.features?.length"
            style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px">
            <li v-for="f in svc.features" :key="f"
              style="display:flex;align-items:center;gap:10px;font-size:12px;color:var(--nx-muted)">
              <span style="width:4px;height:4px;border-radius:50%;flex-shrink:0"
                :style="{ background: svc.color || accent }"></span>
              {{ f }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else
        style="padding:60px;border:1px solid var(--nx-border);border-radius:12px;text-align:center;color:var(--nx-muted);font-size:14px">
        {{ resolved ? 'Leistungen werden noch konfiguriert.' : 'Leistungen werden geladen…' }}
      </div>
    </section>
  </div>
</template>

<style scoped>
@media (max-width: 768px) {
  section:first-child { padding: 80px 16px 40px !important; }
  section:last-child  { padding: 32px 16px 48px !important; }
}
</style>
