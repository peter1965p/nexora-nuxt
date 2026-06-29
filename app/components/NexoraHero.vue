<script setup lang="ts">
const { tenant } = useTenant()
const accent   = computed(() => tenant.value.branding.primaryColor || '#f97316')
const hero     = computed(() => tenant.value.content.hero || {})
const bg       = computed(() => tenant.value.branding.heroBackground || 'grid')
const gradient = computed(() => tenant.value.branding.heroGradient || { from: '#fb923c', via: '#ea580c', to: '#431407' })

const gradientStyle = computed(() =>
  `background:linear-gradient(to bottom, ${gradient.value.from}, ${gradient.value.via}, ${gradient.value.to});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text`
)

const desc = computed(() => (hero.value as any).desc || '')

// Neural canvas
const canvasRef = ref<HTMLCanvasElement | null>(null)

function startNeural(canvas: HTMLCanvasElement) {
  let initRafId = 0
  let animId    = 0
  let alive     = true

  const onResize = () => {
    canvas.width  = canvas.offsetWidth  || window.innerWidth
    canvas.height = canvas.offsetHeight || window.innerHeight
  }
  window.addEventListener('resize', onResize)

  // Wait one frame so canvas has layout dimensions
  initRafId = requestAnimationFrame(() => {
    onResize()

    const pts = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }))

    const ctx  = canvas.getContext('2d')!
    const hex2 = (n: number) => Math.floor(n * 255).toString(16).padStart(2, '0')

    function draw() {
      if (!alive) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < 140) {
            const a = (1 - d / 140) * 0.35
            ctx.beginPath()
            ctx.strokeStyle = accent.value + hex2(a)
            ctx.lineWidth   = 0.6
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.stroke()
          }
        }
        ctx.beginPath()
        ctx.fillStyle = accent.value + '88'
        ctx.arc(pts[i].x, pts[i].y, 1.5, 0, Math.PI * 2)
        ctx.fill()
      }
      animId = requestAnimationFrame(draw)
    }
    draw()
  })

  return () => {
    alive = false
    cancelAnimationFrame(initRafId)
    cancelAnimationFrame(animId)
    window.removeEventListener('resize', onResize)
  }
}

let stopNeural: (() => void) | null = null

watch([bg, canvasRef], ([newBg, canvas]) => {
  if (stopNeural) { stopNeural(); stopNeural = null }
  if (newBg === 'neural' && canvas) stopNeural = startNeural(canvas as HTMLCanvasElement)
}, { immediate: true, flush: 'post' })

onUnmounted(() => { if (stopNeural) stopNeural() })
</script>

<template>
  <section class="relative w-full min-h-screen flex items-center" style="background:var(--nx-bg)">

    <!-- Background -->
    <!-- Grid -->
    <div v-if="bg === 'grid'" class="absolute inset-0 pointer-events-none"
      :style="`background-image:linear-gradient(${accent}20 1px,transparent 1px),linear-gradient(90deg,${accent}20 1px,transparent 1px);background-size:48px 48px`"></div>

    <!-- Dots -->
    <div v-else-if="bg === 'dots'" class="absolute inset-0 pointer-events-none"
      :style="`background-image:radial-gradient(${accent}50 1px,transparent 1px);background-size:32px 32px`"></div>

    <!-- Neural -->
    <canvas v-else-if="bg === 'neural'" ref="canvasRef"
      class="absolute inset-0 w-full h-full pointer-events-none" />

    <!-- Waves -->
    <div v-else-if="bg === 'waves'" class="absolute inset-0 pointer-events-none overflow-hidden">
      <svg class="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none" style="height:40%">
        <path :fill="accent + '11'" d="M0,192L60,181.3C120,171,240,149,360,154.7C480,160,600,192,720,192C840,192,960,160,1080,149.3C1200,139,1320,149,1380,154.7L1440,160L1440,320L0,320Z"/>
        <path :fill="accent + '08'" d="M0,256L60,240C120,224,240,192,360,186.7C480,181,600,203,720,213.3C840,224,960,213,1080,197.3C1200,181,1320,181,1380,181.3L1440,181L1440,320L0,320Z"/>
      </svg>
    </div>

    <!-- Solid = no bg element -->

    <div class="relative z-10 w-full px-6 md:px-16 pt-32 pb-20 max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row md:items-center gap-12 md:gap-20">

        <!-- Left: company name -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-3 mb-6 text-[10px] uppercase tracking-[0.3em]" :style="{ color: accent }">
            <span class="relative flex h-2 w-2 flex-shrink-0">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" :style="{ background: accent }"></span>
              <span class="relative inline-flex rounded-full h-2 w-2" :style="{ background: accent }"></span>
            </span>
            {{ hero.location || 'Verfügbar für Anfragen' }}
          </div>

          <h1 class="font-black tracking-[-0.06em] select-none uppercase"
              style="font-size:clamp(3.5rem, 10vw, 8rem);line-height:0.9;overflow:visible;padding-top:0.45em">
            <span :style="gradientStyle" style="filter:drop-shadow(0 0 70px rgba(234,88,12,0.45))">
              {{ tenant.companyName }}
            </span>
          </h1>
        </div>

        <!-- Right -->
        <div class="md:w-80 lg:w-96 flex-shrink-0 flex flex-col gap-6">
          <div>
            <p v-if="hero.headline" class="text-xs font-bold uppercase tracking-widest mb-2" style="color:var(--nx-muted)">
              {{ hero.headline }}
            </p>
            <p v-if="hero.subheadline" class="text-2xl font-black italic uppercase mb-3" :style="{ color: accent }">
              {{ hero.subheadline }}
            </p>
            <p v-if="desc" class="text-sm leading-relaxed mt-1" style="color:var(--nx-muted)">
              {{ desc }}
            </p>
          </div>

          <div v-if="tenant.content.stats?.length"
               class="gap-px overflow-hidden rounded-sm border"
               :class="tenant.content.stats.length === 1 ? 'grid grid-cols-1' : 'grid grid-cols-2'"
               style="border-color:var(--nx-border);background:var(--nx-border)">
            <div v-for="stat in tenant.content.stats" :key="stat.label" class="px-4 py-3" style="background:var(--nx-surface)">
              <div class="text-lg font-black" style="color:var(--nx-text)">{{ stat.value }}</div>
              <div class="text-[9px] tracking-widest mt-0.5 uppercase" style="color:var(--nx-muted)">{{ stat.label }}</div>
            </div>
          </div>

          <NuxtLink to="/kontakt"
            class="inline-block text-center text-white text-[11px] font-bold uppercase tracking-widest px-6 py-3 rounded-sm transition-opacity hover:opacity-90"
            :style="{ background: accent }">
            {{ hero.cta || 'Kontakt aufnehmen' }} →
          </NuxtLink>
        </div>

      </div>
    </div>
  </section>
</template>
