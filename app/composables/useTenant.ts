export interface NexoraBranding {
  primaryColor?: string
  companyName?: string
  tagline?: string
}

export interface NexoraContent {
  hero?: { headline?: string; subheadline?: string; cta?: string }
  about?: { text?: string }
  stats?: Array<{ value: string; label: string }>
}

export interface NexoraService {
  id: string
  title: string
  description: string
  features: string[]
}

export interface NexoraContact {
  email?: string
  phone?: string
  address?: string
  region?: string
}

export interface TenantData {
  tenantId: string
  companyName: string
  branding: NexoraBranding
  content: NexoraContent
  services: NexoraService[]
  contact: NexoraContact
}

const DEFAULT: TenantData = {
  tenantId: '',
  companyName: 'Mein Unternehmen',
  branding: { primaryColor: '#2563eb' },
  content: {
    hero: { headline: 'Willkommen', subheadline: 'Ihr zuverlässiger Partner', cta: 'Kontakt aufnehmen' },
    about: { text: 'Wir sind ein modernes Unternehmen.' },
    stats: [{ value: '10+', label: 'Jahre Erfahrung' }],
  },
  services: [],
  contact: {},
}

export const useTenant = () => {
  const config = useRuntimeConfig()
  const tenant = useState<TenantData>('tenant', () => ({ ...DEFAULT }))
  const resolved = useState<boolean>('tenantResolved', () => false)

  const resolve = async () => {
    if (resolved.value) return

    const apiUrl = config.public.plexoraApiUrl as string
    let tenantId = config.public.devTenantId as string

    if (import.meta.client) {
      const host = window.location.hostname
      const isLocalhost = host === 'localhost' || host === '127.0.0.1'
      if (!isLocalhost) {
        try {
          const r = await $fetch<{ tenantId: string }>(
            `${apiUrl}/api/public/resolve?host=${host}`
          )
          if (r?.tenantId) tenantId = r.tenantId
        } catch {}
      }
    }

    if (!tenantId) { resolved.value = true; return }

    try {
      const [branding, content, services, contact] = await Promise.allSettled([
        $fetch<NexoraBranding>(`${apiUrl}/api/public/${tenantId}/branding`),
        $fetch<NexoraContent>(`${apiUrl}/api/public/${tenantId}/content`),
        $fetch<NexoraService[]>(`${apiUrl}/api/public/${tenantId}/services`),
        $fetch<NexoraContact>(`${apiUrl}/api/public/${tenantId}/contact`),
      ])

      const b = branding.status === 'fulfilled' ? branding.value : {}
      const c = content.status === 'fulfilled' ? content.value : {}
      const s = services.status === 'fulfilled' ? services.value : []
      const k = contact.status === 'fulfilled' ? contact.value : {}

      tenant.value = {
        tenantId,
        companyName: b.companyName || DEFAULT.companyName,
        branding: { ...DEFAULT.branding, ...b },
        content: {
          hero: { ...DEFAULT.content.hero, ...(c.hero || {}) },
          about: { ...DEFAULT.content.about, ...(c.about || {}) },
          stats: c.stats?.length ? c.stats : DEFAULT.content.stats,
        },
        services: Array.isArray(s) && s.length ? s : DEFAULT.services,
        contact: { ...DEFAULT.contact, ...k },
      }
    } catch {}

    resolved.value = true
  }

  return { tenant, resolved, resolve }
}
