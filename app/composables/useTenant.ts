export interface NexoraBranding {
  primaryColor?: string
  companyName?: string
  tagline?: string
  logoUrl?: string
  faviconUrl?: string
  heroBackground?: string
  heroTitleSize?: string
  heroGradient?: { from: string; via: string; to: string }
  servicesLayout?: string
  heroMediaType?: 'code' | 'image'
  heroImageUrl?: string
}

export interface NexoraFooter {
  tagline?: string
  statusLabel?: string
  showStatus?: boolean
  copyrightText?: string
  creditText?: string
  creditIcon?: string
}

export interface NexoraContent {
  hero?: { headline?: string; subheadline?: string; desc?: string; location?: string; cta?: string }
  about?: { text?: string }
  stats?: Array<{ value: string; label: string }>
  footer?: NexoraFooter
}

export interface NexoraService {
  id: string
  icon?: string
  color?: string
  title: string
  description: string
  features: string[]
}

export interface NexoraContact {
  email?: string
  phone?: string
  address?: string
  region?: string
  availability?: string
  legalName?: string
  vatId?: string
}

export interface NexoraPage {
  slug: string
  title: string
  content: string
  contentType: 'html' | 'markdown'
}

export interface NexoraStackItem {
  label: string
  color: string
}

export interface NexoraStackConfig {
  enabled: boolean
  items: NexoraStackItem[]
  title?: string
  legend?: Record<string, string>
}

export interface NexoraClientItem {
  name: string
}

export interface NexoraClientsConfig {
  enabled: boolean
  items: NexoraClientItem[]
  title?: string
}

export interface NexoraGithubRepo {
  name: string
  description: string
  url: string
  homepage: string
  language: string
  stars: number
  forks: number
  topics: string[]
  updatedAt: string
}

export interface NexoraGithubConfig {
  enabled: boolean
  title?: string
  repos: NexoraGithubRepo[]
}

export interface NexoraLayout {
  sectionOrder: string[]
}

export interface NexoraBlogPost {
  postId: string
  title: string
  slug: string
  excerpt: string
  coverImageUrl?: string
  tags?: string[]
  publishedAt?: string
  contentType: string
}

export interface NexoraBlogConfig {
  enabled: boolean
  title?: string
}

export interface NexoraShopConfig {
  enabled: boolean
  title?: string
}

export interface NexoraVehiclesConfig {
  enabled: boolean
  title?: string
}

export interface NexoraMenuConfig {
  enabled: boolean
  title?: string
  orderingEnabled?: boolean
}

export interface TenantData {
  tenantId: string
  companyName: string
  branding: NexoraBranding
  content: NexoraContent
  services: NexoraService[]
  contact: NexoraContact
  pages: NexoraPage[]
  theme: string
  stack: NexoraStackConfig
  clients: NexoraClientsConfig
  github: NexoraGithubConfig
  blog: NexoraBlogConfig
  shop: NexoraShopConfig
  vehicles: NexoraVehiclesConfig
  menu: NexoraMenuConfig
  sectionOrder: string[]
}

const THEMES: Record<string, Record<string, string>> = {
  midnight: {
    '--nx-bg':      '#05070a',
    '--nx-surface': '#0d1117',
    '--nx-border':  '#1e293b',
    '--nx-text':    '#f1f5f9',
    '--nx-muted':   '#64748b',
    '--nx-accent':  '#f97316',
  },
  slate: {
    '--nx-bg':      '#0f172a',
    '--nx-surface': '#1e293b',
    '--nx-border':  '#334155',
    '--nx-text':    '#e2e8f0',
    '--nx-muted':   '#94a3b8',
    '--nx-accent':  '#3b82f6',
  },
  emerald: {
    '--nx-bg':      '#0a0f0a',
    '--nx-surface': '#111811',
    '--nx-border':  '#1a2e1a',
    '--nx-text':    '#f0fdf4',
    '--nx-muted':   '#6b7280',
    '--nx-accent':  '#10b981',
  },
  light: {
    '--nx-bg':      '#ffffff',
    '--nx-surface': '#f8fafc',
    '--nx-border':  '#e2e8f0',
    '--nx-text':    '#1e293b',
    '--nx-muted':   '#64748b',
    '--nx-accent':  '#2563eb',
  },
}

function applyTheme(themeKey: string, accentOverride?: string) {
  if (!import.meta.client) return
  const vars = THEMES[themeKey] || THEMES.midnight
  const root = document.documentElement
  for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v)
  if (accentOverride) root.style.setProperty('--nx-accent', accentOverride)
}

const DEFAULT: TenantData = {
  tenantId: '',
  companyName: 'Mein Unternehmen',
  branding: { primaryColor: '#f97316', heroBackground: 'grid', heroGradient: { from: '#fb923c', via: '#ea580c', to: '#431407' }, servicesLayout: 'auto' },
  content: {
    hero: { headline: 'Willkommen', subheadline: 'Ihr zuverlässiger Partner', cta: 'Kontakt aufnehmen' },
    about: { text: 'Wir sind ein modernes Unternehmen.' },
    stats: [{ value: '10+', label: 'Jahre Erfahrung' }],
    footer: { tagline: '', statusLabel: 'System Online', showStatus: true },
  },
  services: [],
  contact: {},
  pages: [],
  theme: 'midnight',
  stack:        { enabled: false, items: [], title: 'TECH STACK', legend: {} },
  clients:      { enabled: false, items: [], title: 'REFERENZEN' },
  github:       { enabled: false, repos: [], title: 'PROJEKTE' },
  blog:         { enabled: false, title: 'Blog' },
  shop:         { enabled: false, title: 'Shop' },
  vehicles:     { enabled: false, title: 'Fahrzeuge' },
  menu:         { enabled: false, title: 'Speisekarte' },
  sectionOrder: ['stack', 'clients', 'github', 'services', 'contact'],
}

export const useTenant = () => {
  const config = useRuntimeConfig()
  const tenant = useState<TenantData>('tenant', () => ({ ...DEFAULT }))
  const resolved = useState<boolean>('tenantResolved', () => false)

  const resolve = async () => {
    if (resolved.value) return

    const apiUrl = config.public.plexoraApiUrl as string
    let tenantId = ''

    if (import.meta.client) {
      const host = window.location.hostname
      const isLocalhost = host === 'localhost' || host === '127.0.0.1'
      const isPreview   = host.endsWith('.pages.dev')
      if (isLocalhost || isPreview) {
        tenantId = config.public.devTenantId as string
      } else {
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
      const [branding, content, services, contact, pagesRes, stackRes, clientsRes, githubRes, layoutRes] = await Promise.allSettled([
        $fetch<any>(`${apiUrl}/api/public/${tenantId}/branding`),
        $fetch<any>(`${apiUrl}/api/public/${tenantId}/content`),
        $fetch<any>(`${apiUrl}/api/public/${tenantId}/services`),
        $fetch<NexoraContact>(`${apiUrl}/api/public/${tenantId}/contact`),
        $fetch<{ pages: NexoraPage[]; theme: string }>(`${apiUrl}/api/public/${tenantId}/pages`),
        $fetch<NexoraStackConfig>(`${apiUrl}/api/public/${tenantId}/stack`),
        $fetch<NexoraClientsConfig>(`${apiUrl}/api/public/${tenantId}/clients`),
        $fetch<NexoraGithubConfig>(`${apiUrl}/api/public/${tenantId}/github`),
        $fetch<NexoraLayout>(`${apiUrl}/api/public/${tenantId}/layout`),
      ])

      const b  = branding.status  === 'fulfilled' ? branding.value  : {}
      const c  = content.status   === 'fulfilled' ? content.value   : {}
      const s  = services.status  === 'fulfilled' ? services.value  : []
      const k  = contact.status   === 'fulfilled' ? contact.value   : {}
      const pg = pagesRes.status  === 'fulfilled' ? pagesRes.value  : { pages: [], theme: 'midnight' }
      const st = stackRes.status   === 'fulfilled' ? stackRes.value   : null
      const cl = clientsRes.status === 'fulfilled' ? clientsRes.value : null
      const gh = githubRes.status  === 'fulfilled' ? githubRes.value  : null
      const lo = layoutRes.status  === 'fulfilled' ? layoutRes.value  : null

      const theme = pg.theme || 'midnight'

      tenant.value = {
        tenantId,
        companyName: b.companyName || DEFAULT.companyName,
        branding: { ...DEFAULT.branding, ...b, primaryColor: b.config?.primaryColor || b.primaryColor || DEFAULT.branding.primaryColor, heroMediaType: b.heroMediaType || 'code', heroImageUrl: b.heroImageUrl || '' },
        content: {
          hero: {
            headline:    c.hero?.headline    || DEFAULT.content.hero?.headline,
            subheadline: c.hero?.subline     || c.hero?.subheadline || DEFAULT.content.hero?.subheadline,
            desc:        c.hero?.desc        || '',
            location:    c.hero?.location    || '',
            cta:         c.hero?.ctaLabel    || c.hero?.cta         || DEFAULT.content.hero?.cta,
          },
          about: { ...DEFAULT.content.about, ...(c.about || {}) },
          stats: c.about?.stats?.length ? c.about.stats : DEFAULT.content.stats,
          footer: { ...DEFAULT.content.footer, ...(c.footer || {}) },
        },
        services: Array.isArray(s?.services) && s.services.length ? s.services : DEFAULT.services,
        contact: { ...DEFAULT.contact, ...k },
        pages: pg.pages || [],
        theme,
        stack: {
          enabled: st?.enabled ?? false,
          items:   st?.items   || [],
          title:   st?.title   || 'TECH STACK',
          legend:  st?.legend  || {},
        },
        clients: {
          enabled: cl?.enabled ?? false,
          items:   cl?.items   || [],
          title:   cl?.title   || 'REFERENZEN',
        },
        github: {
          enabled: gh?.enabled ?? false,
          repos:   gh?.repos   || [],
          title:   gh?.title   || 'PROJEKTE',
        },
        blog: {
          enabled: b.blogEnabled ?? false,
          title:   b.blogTitle   || 'Blog',
        },
        shop: {
          enabled: b.shopEnabled ?? false,
          title:   b.shopTitle   || 'Shop',
        },
        vehicles: {
          enabled: b.vehiclesEnabled ?? false,
          title:   b.vehiclesTitle   || 'Fahrzeuge',
        },
        menu: {
          enabled: b.menuEnabled ?? false,
          title:   b.menuTitle   || 'Speisekarte',
          orderingEnabled: b.orderingEnabled ?? false,
        },
        sectionOrder: lo?.sectionOrder || ['stack', 'clients', 'github', 'services', 'contact'],
      }

      applyTheme(theme, b.config?.primaryColor || b.primaryColor)
    } catch {}

    resolved.value = true
  }

  return { tenant, resolved, resolve }
}
