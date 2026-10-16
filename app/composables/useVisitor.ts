// Besucher-Konto der Webseite (nur für Kommentare). Das Token liegt im Browser dieser Webseite (localStorage) und gilt 30 Tage;
// der Server prüft es bei jeder Anfrage. Alle Aufrufe gehen an die öffentliche Plexora-Schnittstelle des Mandanten.
export function useVisitor() {
  const config = useRuntimeConfig()
  const { tenant } = useTenant()
  const state = useState('nx-visitor', () => ({ token: '', name: '', ready: false }))
  const tenantId = () => tenant.value.tenantId
  const storeKey = () => `nx_visitor_${tenantId()}`
  const base = () => `${config.public.plexoraApiUrl as string}/api/public/${tenantId()}`

  function load() {
    if (state.value.ready || typeof localStorage === 'undefined') return
    try { const v = JSON.parse(localStorage.getItem(storeKey()) || 'null'); if (v?.token) state.value = { token: v.token, name: v.name || '', ready: true } } catch { /* ohne gespeicherte Anmeldung */ }
    state.value.ready = true
  }
  function save(token: string, name: string) {
    state.value = { token, name, ready: true }
    try { localStorage.setItem(storeKey(), JSON.stringify({ token, name })) } catch { /* privater Modus: gilt nur für diese Seite */ }
  }
  function clear() { state.value = { token: '', name: '', ready: true }; try { localStorage.removeItem(storeKey()) } catch { /* nichts zu tun */ } }

  /** POST an eine Besucher-Route; der Token wird mitgeschickt, Fehlermeldungen des Servers kommen als Text zurück */
  async function post<T = any>(path: string, body: Record<string, any> = {}, withToken = true): Promise<T> {
    try {
      return await $fetch<T>(`${base()}/${path}`, { method: 'POST', body: { ...body, ...(withToken && state.value.token ? { token: state.value.token } : {}) } })
    } catch (e: any) {
      const status = e?.statusCode || e?.status
      if (status === 401 && withToken && state.value.token && !path.startsWith('visitor/login')) clear()      // abgelaufene Sitzung
      throw new Error(e?.data?.message || e?.data?.statusMessage || 'Das hat gerade nicht geklappt. Bitte versuche es später noch einmal.')
    }
  }
  return { state, load, save, clear, post, base, loggedIn: computed(() => !!state.value.token) }
}
