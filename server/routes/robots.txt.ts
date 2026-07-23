// Liefert robots.txt dynamisch pro Tenant-Domain aus — ein einzelner Nitro-SSR-Build
// bedient alle Tenant-Domains, robots.txt kann daher nicht als statische Datei pro Tenant
// variieren und muss zur Anfragezeit anhand des Host-Headers aufgelöst werden.
// Ersetzt die frühere Cloudflare Pages Function (functions/robots.txt.js) — die wird durch
// den SSR-Preset-Wechsel wirkungslos (_worker.js übernimmt alle Requests, /functions wird
// dann ignoriert), die Logik lebt daher jetzt hier als reguläre Nitro-Server-Route.
const API_URL = 'https://7hrkm580pb.execute-api.eu-central-1.amazonaws.com'
const DEFAULT_ROBOTS = 'User-Agent: *\nDisallow:\n'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setHeader(event, 'Cache-Control', 'no-store')

  const host = getRequestHost(event)

  try {
    const resolveRes = await $fetch<{ tenantId?: string }>(`${API_URL}/api/public/resolve`, { query: { host } })
    const tenantId = resolveRes?.tenantId
    if (!tenantId) return DEFAULT_ROBOTS

    const text = await $fetch<string>(`${API_URL}/api/public/${tenantId}/robots`, { responseType: 'text' }).catch(() => null)
    return text || DEFAULT_ROBOTS
  } catch {
    return DEFAULT_ROBOTS
  }
})
