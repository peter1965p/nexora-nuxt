<template>
  <div v-if="tenant.plexi.enabled">
    <button class="plexi-fab" :class="{ open }" @click="open = !open" title="Plexi" :style="{ background: open ? undefined : accent }">
      <i class="ti" :class="open ? 'ti-x' : 'ti-sparkles'"></i>
    </button>

    <div v-if="open" class="plexi-panel">
      <div class="plexi-header">
        <i class="ti ti-sparkles" :style="{ color: accent }"></i>
        <span>Plexi</span>
      </div>

      <div class="plexi-body" ref="scrollEl">
        <div v-if="!messages.length" class="plexi-empty">{{ tenant.plexi.welcome }}</div>
        <div v-for="(m, i) in messages" :key="i" class="plexi-msg" :class="m.role">
          <div class="plexi-bubble" :style="m.role === 'user' ? { background: accent } : {}">{{ m.content }}</div>
        </div>
        <div v-if="sending" class="plexi-msg assistant">
          <div class="plexi-bubble"><i class="ti ti-loader-2 spin"></i></div>
        </div>
        <div v-if="errorMsg" class="plexi-error"><i class="ti ti-alert-triangle"></i> {{ errorMsg }}</div>
      </div>

      <div class="plexi-input">
        <input v-model="input" placeholder="Frage stellen..." @keydown.enter="send" :disabled="sending" />
        <button @click="send" :disabled="sending || !input.trim()" :style="{ background: accent }"><i class="ti ti-send"></i></button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Msg { role: 'user' | 'assistant'; content: string }

const { tenant } = useTenant()
const config = useRuntimeConfig()
const accent = computed(() => tenant.value.branding.primaryColor || '#f97316')

const open = ref(false)
const input = ref('')
const sending = ref(false)
const errorMsg = ref('')
const messages = ref<Msg[]>([])
const scrollEl = ref<HTMLElement | null>(null)

async function send() {
  const text = input.value.trim()
  if (!text || sending.value) return
  messages.value.push({ role: 'user', content: text })
  input.value = ''
  errorMsg.value = ''
  sending.value = true
  await nextTick()
  scrollEl.value?.scrollTo({ top: scrollEl.value.scrollHeight })

  try {
    const apiUrl = config.public.plexoraApiUrl as string
    const tenantId = tenant.value.tenantId
    const res = await $fetch<{ text: string }>(`${apiUrl}/api/public/${tenantId}/plexi-chat`, {
      method: 'POST',
      body: { messages: messages.value.map(m => ({ role: m.role, content: m.content })) },
    })
    messages.value.push({ role: 'assistant', content: res.text })
  } catch (e: any) {
    errorMsg.value = e?.data?.message || 'Plexi ist gerade nicht erreichbar.'
  } finally {
    sending.value = false
    await nextTick()
    scrollEl.value?.scrollTo({ top: scrollEl.value.scrollHeight })
  }
}
</script>

<style scoped>
.plexi-fab {
  position: fixed; bottom: 24px; right: 24px; z-index: 1000;
  width: 52px; height: 52px; border-radius: 50%; border: none; cursor: pointer;
  color: #fff; font-size: 22px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 6px 20px rgba(0,0,0,.35);
  transition: transform .15s;
}
.plexi-fab:hover { transform: scale(1.06); }
.plexi-fab.open { background: var(--nx-surface); color: var(--nx-text); }

.plexi-panel {
  position: fixed; bottom: 88px; right: 24px; z-index: 1000;
  width: 340px; max-height: 480px; display: flex; flex-direction: column;
  background: var(--nx-surface); border: 1px solid var(--nx-border); border-radius: 14px;
  box-shadow: 0 16px 48px rgba(0,0,0,.45); overflow: hidden;
}
.plexi-header {
  padding: 14px 16px; font-weight: 700; font-size: 13px; display: flex; align-items: center; gap: 8px;
  border-bottom: 1px solid var(--nx-border); color: var(--nx-text);
}
.plexi-body { flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 10px; min-height: 120px; }
.plexi-empty { font-size: 12px; color: var(--nx-muted); text-align: center; padding: 20px 8px; }
.plexi-msg { display: flex; }
.plexi-msg.user { justify-content: flex-end; }
.plexi-bubble {
  max-width: 85%; padding: 8px 12px; border-radius: 10px; font-size: 13px; line-height: 1.5; white-space: pre-wrap;
  background: var(--nx-bg); color: var(--nx-text); border: 1px solid var(--nx-border);
}
.plexi-msg.user .plexi-bubble { color: #fff; border: none; }
.plexi-error { font-size: 11px; color: #e05c5c; padding: 6px 4px; }
.plexi-input { display: flex; gap: 8px; padding: 12px; border-top: 1px solid var(--nx-border); }
.plexi-input input {
  flex: 1; background: var(--nx-bg); border: 1px solid var(--nx-border); border-radius: 8px;
  padding: 8px 10px; font-size: 13px; color: var(--nx-text); font-family: inherit;
}
.plexi-input button {
  width: 34px; height: 34px; border-radius: 8px; border: none; color: #fff; cursor: pointer;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.plexi-input button:disabled { opacity: .5; cursor: default; }
</style>
