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

export interface NexoraPricingPackage {
  name: string
  price: string
  period: string
  features: string[]
  highlighted?: boolean
}

export interface NexoraPricingConfig {
  enabled: boolean
  title: string
  subtitle: string
  packages: NexoraPricingPackage[]
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
  logoStyle?: 'accent' | 'grayscale' | 'original'
  showText?: boolean
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
  imageUrl?: string
}

export interface NexoraGithubConfig {
  enabled: boolean
  title?: string
  repos: NexoraGithubRepo[]
  cardShadow?: boolean
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

export interface NexoraNewsletterConfig {
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

export interface NexoraPropertiesConfig {
  enabled: boolean
  title?: string
}

export interface NexoraTermineConfig {
  enabled: boolean
  title?: string
}

export interface NexoraPlexiConfig {
  enabled: boolean
  welcome: string
}

export interface TenantData {
  tenantId: string
  companyName: string
  metaKeywords: string
  gaMeasurementId: string
  pageTitles: Record<string, string>
  branding: NexoraBranding
  content: NexoraContent
  services: NexoraService[]
  pricing: NexoraPricingConfig
  contact: NexoraContact
  pages: NexoraPage[]
  theme: string
  stack: NexoraStackConfig
  clients: NexoraClientsConfig
  github: NexoraGithubConfig
  blog: NexoraBlogConfig
  shop: NexoraShopConfig
  newsletter: NexoraNewsletterConfig
  vehicles: NexoraVehiclesConfig
  menu: NexoraMenuConfig
  properties: NexoraPropertiesConfig
  termine: NexoraTermineConfig
  plexi: NexoraPlexiConfig
  sectionOrder: string[]
  navOrder: string[]
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
  dusk: {
    '--nx-bg':      '#242230',
    '--nx-surface': '#2f2c3d',
    '--nx-border':  '#453f57',
    '--nx-text':    '#f5f2fa',
    '--nx-muted':   '#a79fc0',
    '--nx-accent':  '#fb923c',
  },
}

function applyTheme(themeKey: string, accentOverride?: string) {
  if (!import.meta.client) return
  const vars = THEMES[themeKey] || THEMES.midnight
  const root = document.documentElement
  for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v)
  if (accentOverride) root.style.setProperty('--nx-accent', accentOverride)
}

// Zweite, von JS unabhängige Absicherung: baut die gleichen CSS-Variablen als Text für
// ein <style>-Tag, das schon im server-gerenderten HTML steckt — damit stimmt das Theme
// vom allerersten Paint an, auch bevor applyTheme() im Browser überhaupt laufen konnte.
export function themeStyleTag(themeKey: string, accentOverride?: string): string {
  const vars = { ...(THEMES[themeKey] || THEMES.midnight) }
  if (accentOverride) vars['--nx-accent'] = accentOverride
  const decls = Object.entries(vars).map(([k, v]) => `${k}:${v}`).join(';')
  return `:root{${decls}}`
}

const DEFAULT: TenantData = {
  tenantId: '',
  companyName: 'Mein Unternehmen',
  metaKeywords: '',
  gaMeasurementId: '',
  pageTitles: {},
  branding: { primaryColor: '#f97316', heroBackground: 'grid', heroGradient: { from: '#fb923c', via: '#ea580c', to: '#431407' }, servicesLayout: 'auto' },
  content: {
    hero: { headline: 'Willkommen', subheadline: 'Ihr zuverlässiger Partner', cta: 'Kontakt aufnehmen' },
    about: { text: 'Wir sind ein modernes Unternehmen.' },
    stats: [{ value: '10+', label: 'Jahre Erfahrung' }],
    footer: { tagline: '', statusLabel: 'System Online', showStatus: true },
  },
  services: [],
  pricing: { enabled: false, title: 'Leistungen & Preise', subtitle: 'Transparente Pakete für dein Projekt', packages: [] },
  contact: {},
  pages: [],
  theme: 'midnight',
  stack:        { enabled: false, items: [], title: 'TECH STACK', legend: {} },
  clients:      { enabled: false, items: [], title: 'REFERENZEN', logoStyle: 'accent', showText: false },
  github:       { enabled: false, repos: [], title: 'PROJEKTE' },
  blog:         { enabled: false, title: 'Blog' },
  shop:         { enabled: false, title: 'Shop' },
  newsletter:   { enabled: false, title: 'Newsletter' },
  vehicles:     { enabled: false, title: 'Fahrzeuge' },
  menu:         { enabled: false, title: 'Speisekarte' },
  properties:   { enabled: false, title: 'Immobilien' },
  termine:      { enabled: false, title: 'Termine' },
  plexi:        { enabled: false, welcome: 'Hallo! Wie kann ich dir helfen?' },
  sectionOrder: ['stack', 'clients', 'github', 'services', 'contact'],
  navOrder:     ['start', 'leistungen', 'about', 'kontakt', 'shop', 'blog', 'vehicles', 'menu', 'properties', 'termine'],
}

// Baut das komplette TenantData-Objekt aus den 9 parallelen Public-API-Fetches. Läuft
// bei SSR serverseitig, bei reiner Client-Navigation im Browser — Rückgabewert (nicht
// direktes tenant.value = ...) ist wichtig, damit useAsyncData() das Ergebnis korrekt
// in den Payload serialisieren und beim Hydration-Client wiederverwenden kann.
async function fetchTenantData(apiUrl: string, tenantId: string): Promise<TenantData | null> {
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

  return {
    tenantId,
    companyName: b.companyName || DEFAULT.companyName,
    metaKeywords:    b.metaKeywords    || '',
    gaMeasurementId: b.gaMeasurementId || '',
    pageTitles:      b.pageTitles      || {},
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
    pricing: {
      enabled:  s?.pricingEnabled  ?? DEFAULT.pricing.enabled,
      title:    s?.pricingTitle    || DEFAULT.pricing.title,
      subtitle: s?.pricingSubtitle || DEFAULT.pricing.subtitle,
      packages: Array.isArray(s?.pricingPackages) ? s.pricingPackages : DEFAULT.pricing.packages,
    },
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
      logoStyle: cl?.logoStyle || 'accent',
      showText: cl?.showText ?? false,
    },
    github: {
      enabled:    gh?.enabled ?? false,
      repos:      gh?.repos   || [],
      title:      gh?.title   || 'PROJEKTE',
      cardShadow: gh?.cardShadow ?? true,
    },
    blog: {
      enabled: b.blogEnabled ?? false,
      title:   b.blogTitle   || 'Blog',
    },
    newsletter: {
      enabled: b.newsletterEnabled ?? false,
      title:   b.newsletterTitle   || 'Newsletter',
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
    properties: {
      enabled: b.propertiesEnabled ?? false,
      title:   b.propertiesTitle   || 'Immobilien',
    },
    termine: {
      enabled: b.termineEnabled ?? false,
      title:   b.termineTitle   || 'Termine',
    },
    plexi: {
      enabled: b.plexiEnabled ?? false,
      welcome: b.plexiWelcome || 'Hallo! Wie kann ich dir helfen?',
    },
    sectionOrder: lo?.sectionOrder || ['stack', 'clients', 'github', 'services', 'contact'],
    navOrder: b.navOrder || ['start', 'leistungen', 'about', 'kontakt', 'shop', 'blog', 'vehicles', 'menu', 'properties', 'termine'],
  }
}

export const useTenant = () => {
  const config = useRuntimeConfig()
  const tenant = useState<TenantData>('tenant', () => ({ ...DEFAULT }))
  const resolved = useState<boolean>('tenantResolved', () => false)

  const resolve = async () => {
    // SSR setzt resolved bereits auf true, bevor der Client das Theme je angewendet hat
    // (applyTheme() ist dort ein bewusster No-Op) — ohne diesen Zweig würde der
    // Theme-Wechsel beim Hydration-Aufruf im Browser sonst komplett übersprungen.
    if (resolved.value) {
      if (import.meta.client) applyTheme(tenant.value.theme, tenant.value.branding.primaryColor)
      return
    }

    // useAsyncData() statt freiem await-Code: Nuxt awaited jeden useAsyncData()-Aufruf,
    // der synchron während des Component-Setups initiiert wird, automatisch bei SSR
    // (bevor die Antwort ausgeliefert wird) — deshalb liegt HIER die gesamte Host- und
    // Content-Auflösung innerhalb des Handlers, nicht davor. Der Key 'tenant-data' sorgt
    // dafür, dass alle Aufrufstellen (app.vue, einzelne Seiten, Plugins) sich einen
    // einzigen, gecachten Fetch teilen statt mehrfach zu laden — ersetzt den früheren,
    // nicht nebenläufigkeitssicheren `resolved`-Boolean-Handschlag.
    const { data } = await useAsyncData('tenant-data', async () => {
      const apiUrl = config.public.plexoraApiUrl as string
      // useRequestURL() ist universell (server: aus dem Request, client: aus
      // window.location) — ersetzt den früheren import.meta.client-Gate, der auf dem
      // Server sonst IMMER eine leere tenantId liefern würde.
      const host = useRequestURL().hostname
      const isLocalhost = host === 'localhost' || host === '127.0.0.1'
      const isPreview   = host.endsWith('.pages.dev')
      let tenantId = ''
      if (isLocalhost || isPreview) {
        tenantId = config.public.devTenantId as string
      } else {
        try {
          const r = await $fetch<{ tenantId: string }>(`${apiUrl}/api/public/resolve?host=${host}`)
          if (r?.tenantId) tenantId = r.tenantId
        } catch {}
      }
      if (!tenantId) return null

      try {
        return await fetchTenantData(apiUrl, tenantId)
      } catch {
        return null
      }
    })

    if (data.value) {
      tenant.value = data.value
      applyTheme(data.value.theme, data.value.branding.primaryColor)
    }
    resolved.value = true
  }

  return { tenant, resolved, resolve }
}
