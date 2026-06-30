<script setup lang="ts">
const { tenant, resolve } = useTenant()
onMounted(resolve)

const accent  = computed(() => tenant.value.branding.primaryColor || '#f97316')
const company = computed(() => tenant.value.companyName || '')
const contact = computed(() => tenant.value.contact || {})

useHead({ title: computed(() => `Impressum — ${company.value}`) })
</script>

<template>
  <div style="font-family:'Inter',system-ui,sans-serif;min-height:100vh;background:var(--nx-bg)">
    <NexoraNavbar />

    <main style="max-width:780px;margin:0 auto;padding:120px 24px 80px">

      <!-- Header -->
      <div style="margin-bottom:48px">
        <div style="display:inline-flex;align-items:center;gap:8px;padding:5px 14px;border-radius:9999px;border:1px solid var(--nx-border);background:var(--nx-surface);margin-bottom:24px">
          <i class="ti ti-gavel" :style="{ color: accent, fontSize: '11px' }"></i>
          <span style="font-size:10px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:var(--nx-muted)">Rechtliches</span>
        </div>
        <h1 style="font-size:clamp(2rem,4vw,3rem);font-weight:800;letter-spacing:-.03em;margin:0 0 12px;color:var(--nx-text);line-height:1.1">
          Impressum
        </h1>
        <p style="font-size:15px;color:var(--nx-muted);margin:0">
          Angaben gemäß § 5 TMG
        </p>
      </div>

      <!-- Inhalt -->
      <div style="display:flex;flex-direction:column;gap:36px">

        <!-- Anbieter -->
        <section>
          <h2 style="font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--nx-muted);margin:0 0 16px">
            Anbieter
          </h2>
          <div style="background:var(--nx-surface);border:1px solid var(--nx-border);border-radius:10px;padding:24px;display:flex;flex-direction:column;gap:10px">
            <p style="margin:0;font-size:15px;font-weight:700;color:var(--nx-text)">{{ company || '—' }}</p>
            <p v-if="contact.legalName" style="margin:0;font-size:14px;color:var(--nx-muted)">{{ contact.legalName }}</p>
            <div v-if="contact.address" style="font-size:14px;color:var(--nx-muted);white-space:pre-line">{{ contact.address }}</div>
          </div>
        </section>

        <!-- Kontakt -->
        <section>
          <h2 style="font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--nx-muted);margin:0 0 16px">
            Kontakt
          </h2>
          <div style="background:var(--nx-surface);border:1px solid var(--nx-border);border-radius:10px;padding:24px;display:flex;flex-direction:column;gap:12px">
            <div v-if="contact.phone" style="display:flex;align-items:center;gap:12px">
              <i class="ti ti-phone" :style="{ color: accent, fontSize: '15px' }"></i>
              <a :href="`tel:${contact.phone}`"
                style="font-size:14px;text-decoration:none;transition:color .15s"
                :style="{ color: accent }">
                {{ contact.phone }}
              </a>
            </div>
            <div v-if="contact.email" style="display:flex;align-items:center;gap:12px">
              <i class="ti ti-mail" :style="{ color: accent, fontSize: '15px' }"></i>
              <a :href="`mailto:${contact.email}`"
                style="font-size:14px;text-decoration:none;transition:color .15s"
                :style="{ color: accent }">
                {{ contact.email }}
              </a>
            </div>
            <div v-if="!contact.phone && !contact.email"
              style="font-size:14px;color:var(--nx-muted)">Kontaktdaten werden noch konfiguriert.</div>
          </div>
        </section>

        <!-- USt-ID -->
        <section v-if="contact.vatId">
          <h2 style="font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--nx-muted);margin:0 0 16px">
            Umsatzsteuer
          </h2>
          <div style="background:var(--nx-surface);border:1px solid var(--nx-border);border-radius:10px;padding:24px">
            <p style="margin:0;font-size:14px;color:var(--nx-muted)">
              Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
            </p>
            <p style="margin:8px 0 0;font-size:15px;font-weight:600;color:var(--nx-text)">{{ contact.vatId }}</p>
          </div>
        </section>

        <!-- EU-Streitschlichtung -->
        <section>
          <h2 style="font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--nx-muted);margin:0 0 16px">
            EU-Streitschlichtung
          </h2>
          <div style="background:var(--nx-surface);border:1px solid var(--nx-border);border-radius:10px;padding:24px">
            <p style="margin:0;font-size:14px;line-height:1.7;color:var(--nx-muted)">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
              <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener"
                :style="{ color: accent }" style="text-decoration:none">
                https://ec.europa.eu/consumers/odr/
              </a>
              <br>
              Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
          </div>
        </section>

        <!-- Haftungsausschluss -->
        <section>
          <h2 style="font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--nx-muted);margin:0 0 16px">
            Haftungsausschluss
          </h2>
          <div style="background:var(--nx-surface);border:1px solid var(--nx-border);border-radius:10px;padding:24px;display:flex;flex-direction:column;gap:16px">
            <div>
              <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:var(--nx-text)">Haftung für Inhalte</p>
              <p style="margin:0;font-size:13px;line-height:1.7;color:var(--nx-muted)">
                Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen.
              </p>
            </div>
            <div>
              <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:var(--nx-text)">Haftung für Links</p>
              <p style="margin:0;font-size:13px;line-height:1.7;color:var(--nx-muted)">
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
              </p>
            </div>
            <div>
              <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:var(--nx-text)">Urheberrecht</p>
              <p style="margin:0;font-size:13px;line-height:1.7;color:var(--nx-muted)">
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
            </div>
          </div>
        </section>

      </div>
    </main>

    <NexoraFooter />
  </div>
</template>

<style scoped>
@media (max-width: 640px) {
  main { padding: 100px 16px 60px !important; }
}
</style>
