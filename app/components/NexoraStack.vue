<script setup lang="ts">
const { tenant } = useTenant()

const stack   = computed(() => tenant.value.stack)
const items   = computed(() => stack.value?.items   || [])
const enabled = computed(() => stack.value?.enabled !== false && items.value.length > 0)
const title   = computed(() => stack.value?.title   || 'TECH STACK')

const DEFAULT_LEGEND: Record<string, string> = {
  blue:   'Frontend',
  green:  'Backend',
  red:    'Database',
  orange: 'Systems',
  yellow: 'Cloud',
  violet: 'Microsoft Stack',
}

const COLOR: Record<string, { bg: string; text: string; bd: string }> = {
  blue:   { bg: '#3b82f618', text: '#93c5fd', bd: '#3b82f640' },
  green:  { bg: '#10b98118', text: '#6ee7b7', bd: '#10b98140' },
  red:    { bg: '#ef444418', text: '#fca5a5', bd: '#ef444440' },
  orange: { bg: '#f9731618', text: '#fdba74', bd: '#f9731640' },
  yellow: { bg: '#eab30818', text: '#fde047', bd: '#eab30840' },
  violet: { bg: '#8b5cf618', text: '#c4b5fd', bd: '#8b5cf640' },
}

const COLOR_ORDER = ['blue', 'green', 'red', 'orange', 'yellow', 'violet']

function legendLabel(color: string): string {
  return stack.value?.legend?.[color] || DEFAULT_LEGEND[color] || color
}

function chipStyle(color: string): string {
  const c = COLOR[color] || COLOR.blue
  return `background:${c.bg};color:${c.text};border:1px solid ${c.bd};padding:5px 16px;border-radius:9999px;font-size:10px;font-weight:700;font-family:ui-monospace,monospace;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap;cursor:default`
}

function legendChipStyle(color: string): string {
  const c = COLOR[color] || COLOR.blue
  return `background:${c.bg};color:${c.text};border:1px solid ${c.bd};padding:3px 12px;border-radius:9999px;font-size:10px;font-weight:700;font-family:ui-monospace,monospace;letter-spacing:.05em;white-space:nowrap`
}

function groupLabelStyle(color: string): string {
  const c = COLOR[color] || COLOR.blue
  return `color:${c.text};opacity:.5;font-size:9px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;font-family:ui-monospace,monospace;white-space:nowrap;padding:0 6px`
}

const usedColors = computed(() => {
  const used = new Set(items.value.map((i: any) => i.color))
  return COLOR_ORDER.filter(c => used.has(c))
})

// Group items by color, preserving COLOR_ORDER
const groupedItems = computed(() => {
  const groups: Record<string, any[]> = {}
  for (const item of items.value) {
    const c = (item as any).color || 'blue'
    if (!groups[c]) groups[c] = []
    groups[c].push(item)
  }
  return COLOR_ORDER
    .filter(c => groups[c]?.length)
    .map(color => ({ color, label: legendLabel(color), items: groups[color] }))
})
</script>

<template>
  <section v-if="enabled" style="overflow:hidden;border-top:1px solid var(--nx-border)">

    <!-- Header: title left · legend right -->
    <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 24px 14px;flex-wrap:wrap;gap:10px">
      <span style="font-size:10px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--nx-muted)">
        {{ title }}
      </span>
      <div v-if="usedColors.length" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <span style="font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--nx-muted)">
          Legende:
        </span>
        <span v-for="color in usedColors" :key="color" :style="legendChipStyle(color)">
          {{ legendLabel(color) }}
        </span>
      </div>
    </div>

    <!-- Ticker (grouped) -->
    <div style="border-top:1px solid var(--nx-border);padding:14px 0;overflow:hidden">
      <div class="ticker-track" style="display:flex;gap:0;white-space:nowrap;align-items:center">
        <div v-for="r in 2" :key="r" style="display:flex;gap:0;flex-shrink:0;align-items:center">
          <template v-for="(group, gi) in groupedItems" :key="`${r}-${gi}`">
            <!-- Group label -->
            <span :style="groupLabelStyle(group.color)">{{ group.label }}</span>
            <!-- Items in group -->
            <span v-for="item in group.items" :key="(item as any).label + r"
              :style="chipStyle((item as any).color)"
              style="margin:0 5px">
              {{ (item as any).label }}
            </span>
            <!-- Separator between groups -->
            <span style="font-size:14px;font-weight:300;opacity:.2;color:var(--nx-muted);padding:0 10px;flex-shrink:0">/</span>
          </template>
        </div>
      </div>
    </div>

  </section>
</template>

<style scoped>
.ticker-track { animation: ticker 50s linear infinite; }
.ticker-track:hover { animation-play-state: paused; }
@keyframes ticker {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
@media (max-width: 600px) {
  section > div:first-child { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; padding: 12px 16px 10px !important; }
}
</style>
