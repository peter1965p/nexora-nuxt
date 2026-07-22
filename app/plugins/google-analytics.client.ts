// Bindet Google Analytics (GA4) nur ein, wenn der Tenant eine Measurement-ID hinterlegt
// hat UND der Besucher der Cookie-Nutzung zugestimmt hat (DSGVO) — siehe
// NexoraCookieBanner.vue, das 'nexora-consent-changed' feuert, sobald zugestimmt wird.
export default defineNuxtPlugin(async () => {
  const { resolve, tenant } = useTenant()
  await resolve()

  const gaId = tenant.value.gaMeasurementId
  if (!gaId) return

  let loaded = false
  function loadGa() {
    if (loaded) return
    loaded = true
    useHead({
      script: [
        { src: `https://www.googletagmanager.com/gtag/js?id=${gaId}`, async: true },
        { innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${gaId}');` },
      ],
    })
  }

  if (localStorage.getItem('nexora_cookie_consent') === 'all') {
    loadGa()
  } else {
    window.addEventListener('nexora-consent-changed', (e: Event) => {
      if ((e as CustomEvent).detail === 'all') loadGa()
    })
  }
})
