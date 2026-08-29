const TRANSLATIONS = {
  tr: {
    'nav.features': 'Özellikler',
    'nav.pricing': 'Fiyatlar',
    'nav.login': 'Giriş Yap',
    'nav.start': 'Ücretsiz Kayıt Ol',

    'hero.badge': 'Shopify için AI Ürün Asistanı',
    'hero.title': 'Mağazanızın verilerini izleyin,<br>müşterilerin kaçış noktasını görün,<br><em>tek adımla <span class="accent">optimize edin.</span></em>',
    'hero.desc': 'Hangi ürünün neden satmadığını tahmin etmeyin. Mocksheets ziyaretçi davranışınızı ve satış verilerinizi analiz ederek her ürün için somut öneriler üretir. Kullanıcı verinize göre mağazanızın her detayını — başlık, açıklama, SEO, fiyat, görsel ve kategori — <b style="color:var(--ink)">toplu şekilde düzenleyin</b>; onayladığınız değişiklikler saniyeler içinde Shopify mağazanıza otomatik yansısın.',
    'hero.cta1': 'Ücretsiz Kayıt Ol',
    'hero.cta2': 'Canlı Gör →',
    'hero.badge_v2': 'Yeni: Ziyaretçi Davranışına Dayalı AI Öneriler',
    'hero.cta1_v2': 'Ücretsiz Başlayın →',
    'hero.cta2_v2': 'Fiyatları Gör',
    'hero.trust_v2': 'Kredi kartı gerekmez · 30 saniyede bağlanır',
    'hero.float_catalog': 'Katalog Sağlığı',
    'hero.float_ai': 'AI Önerileri',
    'hero.float_shopify': 'Shopify Senkron',

    'steps.title': 'Gerçek veriyle büyüyen<br><em style="font-family:\'Instrument Serif\',serif;font-style:italic;font-weight:400;">üç adım.</em>',
    'steps.sub': 'Shopify\'ı bağla, AI davranış ve satış verini okusun, önerileri onayla — mağazana otomatik yazılsın.',
    'steps.1.label': '01 · BAĞLA',
    'steps.1.title': 'Shopify + Analitik Verini Bağla',
    'steps.1.desc': 'OAuth ile 2 dakikada bağlan. Ürün kataloğun, ziyaretçi sayıları ve satış verilerin otomatik çekilmeye başlar — elle veri girişi yok.',
    'steps.2.label': '02 · ANALİZ ET',
    'steps.2.title': 'AI Davranış &amp; Satış Verine Baksın',
    'steps.2.desc': 'Hangi ürün çok görüntülenip satmıyor — AI bunu gerçek ziyaretçi ve satış verisinden çıkarır, hazır öneri sunar.',
    'steps.3.label': '03 · ONAYLA',
    'steps.3.title': 'Veri Destekli Öneriyi Onayla, Mağaza Güncellenir',
    'steps.3.desc': 'Her öneri neden yapıldığını açıklayan gerçek veriyle birlikte gelir. Onayladıklarınız Shopify\'a otomatik yazılır.',

    'integrations.title': 'Operasyon altyapınızın içinde yaşar.',
    'integrations.desc': 'Google Sheets, Shopify, CRM\'iniz — Mocksheets nereden gelirse gelsin veriyi anlar ve sizin için işler.',
    'integrations.desc2': 'Ücretsiz planla başla, ihtiyacın olduğunda yükselt. Sözleşme yok, gizli ücret yok. İstediğin zaman iptal et.',

    'pricing.title': 'Bir öğle yemeği fiyatına,<br><span class="ms-title-italic">bir operasyon uzmanı verimi.</span>',
    'pricing.desc': 'Ücretsiz planla başla, ihtiyacın olduğunda yükselt. Sözleşme yok, gizli ücret yok. İstediğin zaman iptal et.',
    'pricing.monthly': 'Aylık',
    'pricing.yearly': 'Yıllık <span class="ms-save-tag">-20%</span>',
    'pricing.free.name': 'Başlangıç',
    'pricing.pro.name': 'Pro',
    'pricing.promax.name': 'Pro Max',
    'pricing.team.name': 'Takım',

    'faq.title': 'Sık Sorulan Sorular',
    'faq.sub': 'Aklınızdaki soruların yanıtı burada.',

    'cta.title': 'Shopify kataloğunuzu bugün <em>AI ile optimize edin.</em>',
    'cta.btn1': 'Ücretsiz Kayıt Ol',
    'cta.btn2': 'Satışla Konuş',

    'footer.product': 'Ürün',
    'footer.resources': 'Kaynaklar',
    'footer.company': 'Şirket',
    'footer.tools': 'Araçlar',
    'footer.desc': 'Shopify satıcıları için AI destekli katalog yönetim platformu. Optimize et, onayla, senkronize et.',

    'onboarding.welcome_title': 'Mocksheets\'e hoş geldin',
    'onboarding.welcome_sub': 'Üç kısa adımda ilk değerini al.',
    'onboarding.step_1': 'Shopify mağazanı bağla',
    'onboarding.step_2': 'İlk katalog taramanı çalıştır',
    'onboarding.step_3': 'İlk 3 AI önerisini uygula',
    'onboarding.cta_connect': 'Shopify\'ı Bağla',
    'onboarding.cta_demo': 'Önce Demo Görünümü',
    'onboarding.scan_cta': 'İlk Taramayı Başlat',
    'onboarding.scan_running': 'Kataloğun taranıyor...',
    'onboarding.first_value': 'İlk değer sağlandı! 🎉',
    'onboarding.demo_badge': 'Demo verisi',
    'onboarding.trial_badge_days': 'Pro Deneme • {n} gün kaldı',
    'onboarding.trial_expired': 'Deneme sona erdi',

    'upgrade.trial_cta': '7 Gün Pro\'yu Ücretsiz Dene',
    'upgrade.compare_cta': 'Planları Karşılaştır',
    'upgrade.footer_note': 'Deneme sonunda otomatik ücretlendirme. İstediğin an iptal edebilirsin.',
    'upgrade.bulk_scan.title': 'Tüm kataloğu taramak üzeresin',
    'upgrade.bulk_scan.body': 'Ücretsiz planda ilk 25 ürününü tarayabilirsin. Pro ile tüm kataloğunu analiz edebilir, önerileri toplu uygulayabilir ve otomatik senkronu açabilirsin.',
    'upgrade.bulk_scan.f1': 'Sınırsız katalog taraması',
    'upgrade.bulk_scan.f2': 'Toplu düzenleme',
    'upgrade.bulk_scan.f3': 'Otomatik senkron',
    'upgrade.bulk_scan.f4': 'Gelişmiş AI Chat',
    'upgrade.recommendations_limit.title': 'İlk 3 öneriyi gördün',
    'upgrade.recommendations_limit.body': 'Ücretsiz planda ilk 3 öneriyi inceleyebilirsin. Pro ile tüm önerileri gör, toplu uygula ve haftalık raporlar al.',
    'upgrade.recommendations_limit.f1': 'Sınırsız AI önerisi',
    'upgrade.recommendations_limit.f2': 'Toplu uygulama',
    'upgrade.recommendations_limit.f3': 'Haftalık rapor',
    'upgrade.recommendations_limit.f4': 'Rekabet analizi',
    'upgrade.bulk_edit.title': 'Toplu düzenleme başlatmak istiyorsun',
    'upgrade.bulk_edit.body': 'Ücretsiz plan toplu düzenlemeyi desteklemez. Pro ile birden fazla ürünü tek seferde güncelle.',
    'upgrade.bulk_edit.f1': 'Toplu düzenleme',
    'upgrade.bulk_edit.f2': 'Undo geçmişi',
    'upgrade.bulk_edit.f3': 'Şablonlar',
    'upgrade.bulk_edit.f4': 'CSV toplu içe aktarma',
    'upgrade.auto_sync.title': 'Otomatik senkronu açmak istiyorsun',
    'upgrade.auto_sync.body': 'Otomatik senkron Pro planda mevcut. Katalogun her değişiklikte otomatik güncellensin.',
    'upgrade.auto_sync.f1': 'Saatlik otomatik senkron',
    'upgrade.auto_sync.f2': 'Webhook tetikleyicileri',
    'upgrade.auto_sync.f3': 'Değişiklik geçmişi',
    'upgrade.scan_limit.title': 'İlk 25 ürününü taradın',
    'upgrade.scan_limit.body': 'Kataloğunda daha fazla ürün var. Pro ile tüm kataloğunu tara ve tüm iyileştirme fırsatlarını gör.',
    'upgrade.scan_limit.f1': 'Sınırsız katalog taraması',
    'upgrade.scan_limit.f2': 'Tüm ürünler için öneriler',
    'upgrade.scan_limit.f3': 'PDF/XLSX raporlar',
  },

  en: {
    'nav.features': 'Features',
    'nav.pricing': 'Pricing',
    'nav.login': 'Sign In',
    'nav.start': 'Sign Up Free',

    'hero.badge': 'AI Catalog Platform for Shopify',
    'hero.title': 'Manage & Optimize Your<br><em><span class="accent">Shopify Catalog with AI.</span></em>',
    'hero.desc': 'Stop guessing why products don\'t sell. Mocksheets analyzes visitor behavior and sales data to generate concrete recommendations for every product. Based on your real user data, <b style="color:var(--ink)">bulk-edit every detail</b> of your store — titles, descriptions, SEO, prices, images and categories — and every change you approve syncs to your Shopify store automatically in seconds.',
    'hero.cta1': 'Sign Up Free',
    'hero.cta2': 'See Live →',
    'hero.badge_v2': 'New: AI Suggestions Based on Visitor Behavior',
    'hero.cta1_v2': 'Start Free →',
    'hero.cta2_v2': 'See Pricing',
    'hero.trust_v2': 'No credit card required · Connects in 30 seconds',
    'hero.float_catalog': 'Catalog Health',
    'hero.float_ai': 'AI Suggestions',
    'hero.float_shopify': 'Shopify Sync',

    'steps.title': 'From catalog to result.<br>In three steps.',
    'steps.sub': 'Connect Shopify, let AI analyze, approve suggestions — Mocksheets syncs it back.',
    'steps.1.label': '01 · CONNECT',
    'steps.1.title': 'Connect your Shopify<br>in one click.',
    'steps.1.desc': 'Secure OAuth connection. Products, variants and SEO fields land in Mocksheets instantly.',
    'steps.2.label': '02 · ANALYZE',
    'steps.2.title': 'AI scores your<br>catalog health.',
    'steps.2.desc': 'Missing SEO, weak titles, thin descriptions — a per-product issue list with suggestions.',
    'steps.3.label': '03 · APPROVE & SYNC',
    'steps.3.title': 'Approve suggestions,<br>sync to Shopify.',
    'steps.3.desc': 'Every change needs your approval. Bulk accept, single reject — the live store only changes when you say so.',

    'integrations.title': 'Lives inside your operations stack.',
    'integrations.desc': 'Google Sheets, Shopify, your CRM — Mocksheets understands data from any source and processes it for you.',
    'integrations.desc2': 'Start with the free plan, upgrade when you need to. No contracts, no hidden fees. Cancel anytime.',

    'pricing.title': 'The price of a lunch,<br><span class="ms-title-italic">the output of an ops expert.</span>',
    'pricing.desc': 'Start with the free plan, upgrade when you need to. No contracts, no hidden fees. Cancel anytime.',
    'pricing.monthly': 'Monthly',
    'pricing.yearly': 'Yearly <span class="ms-save-tag">-20%</span>',
    'pricing.free.name': 'Starter',
    'pricing.pro.name': 'Pro',
    'pricing.promax.name': 'Pro Max',
    'pricing.team.name': 'Team',

    'faq.title': 'Frequently Asked Questions',
    'faq.sub': 'Find answers to your questions here.',

    'cta.title': 'Optimize your Shopify catalog <em>with AI today.</em>',
    'cta.btn1': 'Sign Up Free',
    'cta.btn2': 'Talk to Sales',

    'footer.product': 'Product',
    'footer.resources': 'Resources',
    'footer.company': 'Company',
    'footer.tools': 'Tools',
    'footer.desc': 'AI-powered catalog management platform for Shopify sellers. Optimize, approve, sync.',

    'onboarding.welcome_title': 'Welcome to Mocksheets',
    'onboarding.welcome_sub': 'Get your first value in three short steps.',
    'onboarding.step_1': 'Connect your Shopify store',
    'onboarding.step_2': 'Run your first catalog scan',
    'onboarding.step_3': 'Apply the first 3 AI suggestions',
    'onboarding.cta_connect': 'Connect Shopify',
    'onboarding.cta_demo': 'Try Demo View First',
    'onboarding.scan_cta': 'Start First Scan',
    'onboarding.scan_running': 'Scanning your catalog...',
    'onboarding.first_value': 'First value delivered! 🎉',
    'onboarding.demo_badge': 'Demo data',
    'onboarding.trial_badge_days': 'Pro Trial • {n} days left',
    'onboarding.trial_expired': 'Trial ended',

    'upgrade.trial_cta': 'Try Pro Free for 7 Days',
    'upgrade.compare_cta': 'Compare Plans',
    'upgrade.footer_note': 'Auto-billed after trial. Cancel any time.',
    'upgrade.bulk_scan.title': 'About to scan your whole catalog',
    'upgrade.bulk_scan.body': 'The Free plan scans your first 25 products. Upgrade to Pro to analyze your entire catalog, apply suggestions in bulk, and turn on auto-sync.',
    'upgrade.bulk_scan.f1': 'Unlimited catalog scans',
    'upgrade.bulk_scan.f2': 'Bulk editing',
    'upgrade.bulk_scan.f3': 'Auto sync',
    'upgrade.bulk_scan.f4': 'Advanced AI Chat',
    'upgrade.recommendations_limit.title': 'You\'ve seen the first 3 suggestions',
    'upgrade.recommendations_limit.body': 'The Free plan shows the first 3 suggestions. Upgrade to Pro to see all suggestions, apply in bulk, and receive weekly reports.',
    'upgrade.recommendations_limit.f1': 'Unlimited AI suggestions',
    'upgrade.recommendations_limit.f2': 'Bulk apply',
    'upgrade.recommendations_limit.f3': 'Weekly report',
    'upgrade.recommendations_limit.f4': 'Competitor analysis',
    'upgrade.bulk_edit.title': 'You\'re starting a bulk edit',
    'upgrade.bulk_edit.body': 'Bulk editing isn\'t available on Free. Upgrade to Pro to update multiple products at once.',
    'upgrade.bulk_edit.f1': 'Bulk editing',
    'upgrade.bulk_edit.f2': 'Undo history',
    'upgrade.bulk_edit.f3': 'Templates',
    'upgrade.bulk_edit.f4': 'CSV bulk import',
    'upgrade.auto_sync.title': 'You\'re turning on auto-sync',
    'upgrade.auto_sync.body': 'Auto-sync is a Pro feature. Keep your catalog updated automatically on every change.',
    'upgrade.auto_sync.f1': 'Hourly auto-sync',
    'upgrade.auto_sync.f2': 'Webhook triggers',
    'upgrade.auto_sync.f3': 'Change history',
    'upgrade.scan_limit.title': 'You\'ve scanned your first 25 products',
    'upgrade.scan_limit.body': 'Your catalog has more products. Upgrade to Pro to scan everything and unlock every improvement opportunity.',
    'upgrade.scan_limit.f1': 'Unlimited catalog scans',
    'upgrade.scan_limit.f2': 'Suggestions for all products',
    'upgrade.scan_limit.f3': 'PDF/XLSX reports',
  }
};

const i18n = {
  lang: localStorage.getItem('ms_lang') || 'tr',

  t(key) {
    return TRANSLATIONS[this.lang]?.[key] || TRANSLATIONS['tr']?.[key] || key;
  },

  setLang(lang) {
    this.lang = lang;
    localStorage.setItem('ms_lang', lang);
    document.documentElement.lang = lang;
    this.applyAll();
    this.updateToggle();
  },

  applyAll() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = this.t(key);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = val;
      } else if (el.tagName === 'META') {
        el.content = val;
      } else {
        el.textContent = val;
      }
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      el.innerHTML = this.t(key);
    });
  },

  updateToggle() {
    const btn = document.getElementById('lang-toggle');
    if (btn) btn.textContent = this.lang === 'tr' ? 'EN' : 'TR';
  },

  toggle() {
    this.setLang(this.lang === 'tr' ? 'en' : 'tr');
  },

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.applyAll();
      this.updateToggle();
    });
    if (document.readyState !== 'loading') {
      this.applyAll();
      this.updateToggle();
    }
  }
};

i18n.init();
window.i18n = i18n;
