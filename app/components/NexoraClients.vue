<script setup lang="ts">
const { tenant } = useTenant()

const clients  = computed(() => tenant.value.clients)
const items    = computed(() => clients.value?.items  || [])
const enabled  = computed(() => clients.value?.enabled !== false && items.value.length > 0)
const title    = computed(() => clients.value?.title  || 'REFERENZEN')
const accent   = computed(() => tenant.value.branding.primaryColor || '#f97316')
</script>

<template>
  <section v-if="enabled" style="overflow:hidden;border-top:1px solid var(--nx-border)">

    <!-- Title -->
    <div style="padding:16px 24px 14px">
      <span style="font-size:10px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--nx-muted)">
        {{ title }}
      </span>
    </div>

    <!-- Ticker -->
    <div style="border-top:1px solid var(--nx-border);padding:14px 0;overflow:hidden">
      <div class="clients-track" style="display:flex;align-items:center;white-space:nowrap">
        <div v-for="r in 2" :key="r" style="display:flex;align-items:center;flex-shrink:0">
          <template v-for="(item, i) in items" :key="(item as any).name + r + i">
            <span style="font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;padding:0 32px;cursor:default"
              :style="{ color: accent }">
              {{ (item as any).name }}
            </span>
            <span style="font-size:14px;font-weight:300;opacity:.35;color:var(--nx-muted);flex-shrink:0">/</span>
          </template>
        </div>
      </div>
    </div>

  </section>
</template>

<style scoped>
.clients-track { animation: clients 35s linear infinite; }
.clients-track:hover { animation-play-state: paused; }
@keyframes clients {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
</style>
