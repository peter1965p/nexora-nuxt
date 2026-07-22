// Cloudflare Pages Function — liefert robots.txt dynamisch pro Tenant-Domain aus.
// nexora-nuxt ist eine reine Static-SPA (ssr:false), ein einzelner Build bedient alle
// Tenant-Domains — robots.txt kann daher nicht als statische Datei pro Tenant variieren
// und muss zur Anfragezeit anhand des Hostnamens aufgelöst werden.
const API_URL = 'https://7hrkm580pb.execute-api.eu-central-1.amazonaws.com'
const DEFAULT_ROBOTS = 'User-Agent: *\nDisallow:\n'

export async function onRequestGet(context) {
  const host = new URL(context.request.url).hostname

  try {
    const resolveRes = await fetch(`${API_URL}/api/public/resolve?host=${host}`)
    if (!resolveRes.ok) return textResponse(DEFAULT_ROBOTS)

    const { tenantId } = await resolveRes.json()
    if (!tenantId) return textResponse(DEFAULT_ROBOTS)

    const robotsRes = await fetch(`${API_URL}/api/public/${tenantId}/robots`)
    const text = robotsRes.ok ? await robotsRes.text() : DEFAULT_ROBOTS
    return textResponse(text)
  } catch {
    return textResponse(DEFAULT_ROBOTS)
  }
}

function textResponse(text) {
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } })
}
