<script setup lang="ts">
const { tenant } = useTenant()
const accent = computed(() => tenant.value.branding.primaryColor || '#f97316')
const pricing = computed(() => tenant.value.pricing)
</script>

<template>
  <section v-if="pricing.enabled && pricing.packages.length" style="max-width:1200px;margin:0 auto;padding:60px 24px 100px;font-family:'Inter',system-ui,sans-serif">
    <div style="text-align:center;margin-bottom:48px">
      <h2 style="font-size:clamp(1.8rem,3.5vw,2.6rem);font-weight:800;letter-spacing:-.02em;margin:0 0 12px;color:var(--nx-text)">
        {{ pricing.title }}
      </h2>
      <p style="font-size:15px;color:var(--nx-muted);margin:0">{{ pricing.subtitle }}</p>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px;align-items:start">
      <div v-for="(pkg, i) in pricing.packages" :key="i"
        style="position:relative;padding:32px 28px;border-radius:16px;background:var(--nx-surface);transition:transform .2s"
        :style="pkg.highlighted
          ? `border:2px solid ${accent};box-shadow:0 12px 32px ${accent}22`
          : 'border:1px solid var(--nx-border)'">

        <div v-if="pkg.highlighted"
          style="position:absolute;top:-14px;left:50%;transform:translateX(-50%);padding:5px 16px;border-radius:9999px;font-size:11px;font-weight:700;color:#fff;white-space:nowrap"
          :style="{ background: accent }">
          Beliebteste Wahl
        </div>

        <h3 style="font-size:19px;font-weight:700;margin:0 0 14px;color:var(--nx-text)">{{ pkg.name }}</h3>

        <div style="margin-bottom:6px">
          <span style="font-size:32px;font-weight:800;letter-spacing:-.02em" :style="{ color: pkg.highlighted ? accent : 'var(--nx-text)' }">{{ pkg.price }}</span>
        </div>
        <div style="font-size:13px;color:var(--nx-muted);margin-bottom:20px">{{ pkg.period }}</div>

        <div style="height:1px;background:var(--nx-border);margin-bottom:20px"></div>

        <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px">
          <li v-for="(f, j) in pkg.features" :key="j" style="display:flex;align-items:flex-start;gap:10px;font-size:14px;color:var(--nx-text)">
            <i class="ti ti-check" :style="{ color: accent, fontSize: '16px', marginTop: '2px', flexShrink: 0 }"></i>
            <span>{{ f }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
