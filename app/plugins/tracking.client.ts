// Sendet Pageviews an die Plexora-API, damit der Tenant seinen eigenen Website-Traffic
// im Dashboard sehen kann (Tab "Traffic" unter Website-Einstellungen). Läuft nur im
// Browser (ssr:false, .client.ts-Suffix), stiller Fail — Tracking darf die Seite nie stören.
export default defineNuxtPlugin(async () => {
  const { resolve, tenant } = useTenant()
  const config = useRuntimeConfig()
  const apiUrl = config.public.plexoraApiUrl as string

  await resolve()
  if (!tenant.value.tenantId) return

  function sendPageview(path: string, referrer: string) {
    $fetch(`${apiUrl}/api/public/${tenant.value.tenantId}/track`, {
      method: 'POST',
      body: { path, referrer },
    }).catch(() => {})
  }

  sendPageview(window.location.pathname, document.referrer || '')

  const router = useRouter()
  router.afterEach((to, from) => {
    sendPageview(to.fullPath, from?.fullPath ? `${window.location.origin}${from.fullPath}` : '')
  })
})
