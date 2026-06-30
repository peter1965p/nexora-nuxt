<script setup lang="ts">
const { tenant } = useTenant()
const accent   = computed(() => tenant.value.branding.primaryColor || '#f97316')
const privacyPage = computed(() =>
  tenant.value.pages?.find((p: any) => p.slug === 'datenschutz')
    ? '/datenschutz'
    : '/datenschutz'
)

const visible  = ref(false)
const flipping = ref(false)

onMounted(() => {
  if (!localStorage.getItem('nexora_cookie_consent')) {
    setTimeout(() => { visible.value = true }, 900)
  }
})

function accept(type: 'all' | 'essential') {
  flipping.value = true
  setTimeout(() => {
    localStorage.setItem('nexora_cookie_consent', type)
    visible.value  = false
    flipping.value = false
  }, 700)
}
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="ck-stage" :class="{ 'ck-salto': flipping }">
      <div class="ck-banner">
        <div class="ck-glow" :style="{ background: `radial-gradient(circle, ${accent}22, transparent 70%)` }"></div>

        <div class="ck-left">
          <div class="ck-icon">🍪</div>
          <div>
            <div class="ck-title">Cookies & Datenschutz</div>
            <div class="ck-text">
              Wir nutzen Cookies, um dir das beste Erlebnis zu bieten.
              <NuxtLink :to="privacyPage" class="ck-link" :style="{ color: accent }">Datenschutzerklärung</NuxtLink>
            </div>
          </div>
        </div>

        <div class="ck-actions">
          <button class="ck-btn-essential" @click="accept('essential')">Nur notwendige</button>
          <button class="ck-btn-all" @click="accept('all')"
            :style="{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, boxShadow: `0 4px 16px ${accent}55` }">
            Alle akzeptieren ✓
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.ck-stage {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9998;
  width: min(720px, calc(100vw - 32px));
  perspective: 1200px;
  transform-origin: center bottom;
  animation: ck-slide-up 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  font-family: 'Inter', system-ui, sans-serif;
}

.ck-banner {
  position: relative;
  background: rgba(8, 10, 22, 0.90);
  backdrop-filter: blur(24px) saturate(1.5);
  -webkit-backdrop-filter: blur(24px) saturate(1.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,.04);
  overflow: hidden;
  transform-style: preserve-3d;
}

.ck-glow {
  position: absolute;
  top: -40px; left: -40px;
  width: 200px; height: 200px;
  pointer-events: none;
}

.ck-left {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  min-width: 0;
}

.ck-icon {
  font-size: 28px;
  flex-shrink: 0;
  animation: ck-wiggle 3s ease-in-out infinite;
}

.ck-title {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 3px;
}

.ck-text {
  font-size: 12px;
  color: rgba(255,255,255,0.45);
  line-height: 1.5;
}

.ck-link {
  text-decoration: none;
  margin-left: 4px;
  font-weight: 600;
}
.ck-link:hover { text-decoration: underline; }

.ck-actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.ck-btn-essential {
  padding: 9px 16px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255,255,255,0.55);
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  font-family: inherit;
}
.ck-btn-essential:hover { background: rgba(255,255,255,0.1); color: #fff; }

.ck-btn-all {
  padding: 9px 18px;
  border: none;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.15s, transform 0.15s;
  font-family: inherit;
}
.ck-btn-all:hover { opacity: 0.88; transform: translateY(-1px); }

.ck-salto {
  animation: ck-salto 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
}

@keyframes ck-slide-up {
  from { opacity: 0; transform: translateX(-50%) translateY(40px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}

@keyframes ck-salto {
  0%   { transform: translateX(-50%) translateY(0)     rotateX(0deg)   scale(1);    opacity: 1; }
  25%  { transform: translateX(-50%) translateY(-24px) rotateX(90deg)  scale(0.97); opacity: 1; }
  55%  { transform: translateX(-50%) translateY(-12px) rotateX(220deg) scale(0.92); opacity: 0.6; }
  80%  { transform: translateX(-50%) translateY(40px)  rotateX(330deg) scale(0.85); opacity: 0.2; }
  100% { transform: translateX(-50%) translateY(80px)  rotateX(360deg) scale(0.8);  opacity: 0; }
}

@keyframes ck-wiggle {
  0%, 100% { transform: rotate(-5deg); }
  50%       { transform: rotate(8deg); }
}

@media (max-width: 600px) {
  .ck-banner  { flex-direction: column; align-items: flex-start; padding: 16px 18px; }
  .ck-actions { width: 100%; }
  .ck-btn-essential, .ck-btn-all { flex: 1; text-align: center; }
}
</style>
