const TRANSLATIONS = {
  tr: {
    'nav.features': 'Özellikler',
    'nav.automations': 'Otomasyonlar',
    'nav.pricing': 'Fiyatlar',
    'nav.login': 'Giriş Yap',
    'nav.start': 'Ücretsiz Başla →',

    'hero.badge': 'AI Operasyon Asistanı',
    'hero.title': 'Excel Verilerinizi<br><em><span class="accent">Tek Bir Cümleyle Düzenleyin.</span></em>',
    'hero.desc': 'Mocksheets, operasyon yöneticileri için tasarlandı. Formül yok, teknik bilgi yok — sadece ne yapmak istediğinizi yazın, gerisini Mocksheets halleder. <b style="color:var(--ink)">Haftada 7+ saat geri kazanın.</b>',
    'hero.price.unit': '/ay',
    'hero.cta1': 'Ücretsiz Başla →',
    'hero.cta2': 'Canlı Gör →',

    'steps.title': 'Veriden karara.<br>Üç adımda.',
    'steps.sub': 'Formül yok. Teknik bilgi yok. Sadece ne istediğinizi yazın — Mocksheets gerisini halleder.',
    'steps.1.label': '01 · BAĞLA',
    'steps.1.title': 'Veriniz neredeyse<br>oradan çekin.',
    'steps.1.desc': '200\'den fazla kaynakla bağlantı kurun. Veriyi içe aktarın, birleştirin, hazırlayın.',
    'steps.2.label': '02 · YAZ',
    'steps.2.title': 'Türkçe sorun.<br>Mocksheets anlasın.',
    'steps.2.desc': 'Formül değil, cümle yazın. Zincirleme komutlar verin — bağlam hafızada kalır.',
    'steps.3.label': '03 · ANALİZ ET',
    'steps.3.title': 'Sonuç saniyeler içinde.<br>Paylaşıma hazır.',
    'steps.3.desc': 'Tablo, özet, grafik. Slack, Gmail veya Drive\'a tek tıkla gönderin.',

    'integrations.title': 'Operasyon altyapınızın',
    'integrations.desc': 'Mocksheets, ekibinizin zaten kullandığı araçlarla bağlantı kurar. Veri içe aktar, otomasyonları tetikle, tablolarını senkronize et.',
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

    'cta.title': 'AI desteğiyle operasyon yönetmenin <em>en iyi yolu.</em>',
    'cta.btn1': 'Google ile Ücretsiz Başla',
    'cta.btn2': 'Satışla Konuş',

    'footer.product': 'Ürün',
    'footer.resources': 'Kaynaklar',
    'footer.company': 'Şirket',
    'footer.tools': 'Araçlar',
    'footer.desc': 'Operasyon ve e-ticaret ekipleri için tarayıcı tabanlı AI tablo asistanı.',
    'footer.features': 'Özellikler',
    'footer.pricing': 'Fiyatlar',
    'footer.automations': 'Otomasyonlar',
    'footer.blog': 'Blog',
    'footer.about': 'Hakkımızda',
    'footer.contact': 'İletişim',
    'footer.kvkk': 'KVKK',
    'footer.privacy': 'Gizlilik',
    'footer.terms': 'Kullanım Koşulları',
    'footer.tool1': 'Örnek Veri Üretici',
    'footer.tool2': 'Excel Veri Oluşturucu',
    'footer.tool3': 'CSV Dosyası Oluştur',
    'footer.tool4': 'Test Verisi Hazırla',
    'footer.tool5': 'Excel Şablon Verisi',
    'steps.2.badge': 'En güçlü adım',
    'pricing.free.period': 'Sonsuza kadar ücretsiz',
    'pricing.free.feat1': 'Günde 5 AI komutu',
    'pricing.free.feat2': 'Google Sheets senkronizasyonu',
    'pricing.free.feat3': 'TR arayüz',
    'gdpr.text': '<b>GDPR uyumlu</b> · veriniz sizin',
    'cancel.text': '<b>İstediğin zaman iptal</b> · tek tıkla',

    'built.with': 'Bu teknolojilerle inşa edildi',
    'sectors.title': 'Her sektörde, her veri türünde çalışır',
    'sectors.ecom.name': 'E-ticaret',
    'sectors.ecom.desc': 'Sipariş, stok, müşteri',
    'sectors.ops.name': 'Operasyon',
    'sectors.ops.desc': 'Süreç, ekip, görev',
    'sectors.finance.name': 'Finans',
    'sectors.finance.desc': 'Gelir, gider, bütçe',
    'sectors.hr.name': 'İnsan Kaynakları',
    'sectors.hr.desc': 'Personel, izin, performans',
    'integrations.pill': '200 entegrasyon',
    'pricing.promo.label': 'Bu hafta katılan ekipler için —',
    'pricing.promo.campaign': "HAZİRAN'26 KAMPANYASI",
    'pricing.free.note': "Mocksheets'i keşfetmek isteyenler için. Kart gerekmez.",
    'pricing.yearly.note': 'Kampanya yıllık planlarda geçerli değildir.',
    'cta.eyebrow': '— hadi başlayalım',
    'footer.copyright': '© 2026 Mocksheets · Her yerdeki operasyon ekipleri için',

    'integrations.eyebrow': '— entegrasyonlar',
    'integrations.title.italic': 'içinde yaşar.',
    'integrations.pill2': "Shopify → Mocksheets → Slack · Haftalık sipariş raporu otomatik Slack'e gelir",
    'demo.ai.title': 'Mocksheets AI',
    'demo.ai.command': "HubSpot'taki tüm leads'leri Slack'e bildir",
    'demo.ai.result.title': 'Otomasyon hazırlandı:',
    'demo.ai.result.1': '✓ HubSpot trigger ayarlandı',
    'demo.ai.result.2': '✓ Slack kanal bağlandı',
    'demo.ai.result.3': '✓ Anlık bildirim aktif',
    'demo.ai.placeholder': 'Başka bir komut gir…',
    'demo.setup.tab.setup': 'Kur',
    'demo.setup.tab.config': 'Yapılandır',
    'demo.setup.tab.test': 'Test',
    'demo.setup.app': 'UYGULAMA',
    'demo.setup.change': 'Değiştir',
    'demo.setup.action': 'AKSIYON',
    'demo.setup.contact': 'Contact Oluştur',
    'demo.setup.source': 'KAYNAK KOLON',
    'demo.setup.email.col': 'Email (B sütunu)',
    'demo.setup.continue': 'Devam Et →',
    'demo.cmd.1': 'Bu çeyrekte en yüksek maliyetli 5 kalemi bul',
    'demo.cmd.2': 'Bunları geçen çeyrekte karşılaştır',
    'demo.cmd.3': "Slack'e rapor olarak gönder",
    'demo.result.1': '5 satır · sıralandı',
    'demo.result.2': 'Çeyrek karşılaştırması',
    'demo.result.3': "Slack'e gönderildi",
    'pricing.trial.desc': 'İlk 1 ay boyunca',
    'pricing.trial.after': '· Sonrasında normal fiyatlandırma',
    'source.excel': 'Excel',
    'source.csv': 'CSV',
    'source.pdf': 'PDF',
    'source.shopify': 'Shopify',
    'source.hubspot': 'HubSpot',
    'source.more': '+195 daha',

    'pricing.pro.desc1': 'İlk 1 ay $1/ay · Kampanya bitmeden yakala.',
    'pricing.pro.desc2': 'Düzenli Excel kullanan operasyon yöneticileri için.',
    'pricing.pro.feat1': 'Ayda 500 AI komutu',
    'pricing.pro.feat2': 'PDF → tablo dönüştürme',
    'pricing.pro.feat3': '10 aktif otomasyon',
    'pricing.pro.feat4': '60 günlük sürüm geçmişi',
    'pricing.pro.feat5': 'E-posta desteği',
    'pricing.pro.period': 'İlk 1 ay · sonra $15/ay',

    'pricing.promax.badge': '⭐ En İyi Değer',
    'pricing.promax.desc': 'Operasyonunu tam otomatize etmek isteyen yöneticiler için.',
    'pricing.promax.feat1': 'AI Agents (sınırsız)',
    'pricing.promax.feat2': '1500 komut/ay',
    'pricing.promax.feat3': 'Sınırsız otomasyon',
    'pricing.promax.feat4': 'PDF → tablo dönüştürme',
    'pricing.promax.feat5': '90 günlük sürüm geçmişi',
    'pricing.promax.feat6': 'Tüm entegrasyonlar',
    'pricing.promax.feat7': 'API erişimi',
    'pricing.promax.period': 'İlk 1 ay · sonra $21/ay',

    'pricing.team.desc': 'İlk 1 ay $1/ay · 5+ kişilik operasyon ekipleri için. Tek fatura.',
    'pricing.team.feat1': 'Sınırsız AI komutu',
    'pricing.team.feat2': '5 koltuk dahil',
    'pricing.team.feat3': 'Sınırsız otomasyon',
    'pricing.team.feat4': 'Canlı işbirliği + yorumlar',
    'pricing.team.feat5': 'SSO + denetim günlüğü',
    'pricing.team.feat6': 'Özel hesap yöneticisi',
    'pricing.team.period': '/ay · 5 koltuk',
    'pricing.team.badge': '⭐ En İyi Değer',
    'pricing.free.cta': 'Google ile Kayıt Ol',
    'pricing.pro.cta': "Pro'ya Geç",
    'pricing.promax.cta': "Pro Max'a Geç",
    'pricing.team.cta': 'Takım Kur',

    'faq.q1': 'Verilerim güvende mi?',
    'faq.a1': 'Tüm veriler Supabase (PostgreSQL) üzerinde şifreli saklanır. GDPR ve KVKK uyumlu altyapı. Verileriniz üçüncü taraflarla paylaşılmaz. Dilediğiniz zaman hesabınızı ve tüm verilerinizi silebilirsiniz.',
    'faq.q2': 'Excel dosyam silinir mi?',
    'faq.a2': 'Hayır. Mocksheets işlem yapar ama orijinal dosyanızı korur. Her işlem geri alınabilir. Pro planda 90 günlük versiyon geçmişi saklanır.',
    'faq.q3': 'İnternet olmadan çalışır mı?',
    'faq.a3': 'Mocksheets tarayıcı tabanlıdır, internet bağlantısı gerekir. Tüm AI komutları bulutta işlenir, bu sayede bilgisayarınıza hiç yük olmaz.',
    'faq.q4': 'Hangi dosya formatları destekleniyor?',
    'faq.a4': '.xlsx, .xls, .csv ve PDF (OCR ile tablo çıkarma) formatları desteklenir. Dışa aktarma için Excel, CSV ve JSON formatları mevcuttur.',
    'faq.q5': 'Türkçe dışında dil var mı?',
    'faq.a5': 'Evet. Komutlar Türkçe ve İngilizce çalışır. Arayüz dil seçeneği mevcuttur.',
    'faq.q6': 'Kaç kişi aynı anda kullanabilir?',
    'faq.a6': 'Mocksheets bireysel kullanım için tasarlanmıştır. Pro Max planında sınırsız komut ve otomasyon ile tüm özelliklere erişebilirsiniz.',
    'faq.q7': 'Kredi kartı olmadan başlayabilir miyim?',
    'faq.a7': 'Evet. Ücretsiz plan için kart gerekmez. Google hesabınızla 30 saniyede başlayın, günde 5 AI komutu ücretsiz kullanın.',
    'faq.q8': 'İptal etmek zorlaştı mı?',
    'faq.a8': 'Hayır. Tek tıkla iptal. Sözleşme yok, gizli ücret yok. İptal anında geçerlidir, bir sonraki fatura kesilmez.',
    'faq.q9': 'E-ticaret mağazam için kullanabilir miyim?',
    'faq.a9': 'Evet. Shopify, WooCommerce, Trendyol, Hepsiburada ve diğer platformlardan aldığınız CSV dosyalarını yükleyip analiz edebilirsiniz.',
    'faq.q10': 'Shopify verimi nasıl bağlarım?',
    'faq.a10': "Shopify entegrasyonu ile mağazanızı doğrudan bağlayabilirsiniz. Sipariş, ürün ve müşteri verileriniz otomatik olarak Mocksheets'e aktarılır. Bağlantı kurmak 2 dakika sürer.",
  },

  en: {
    'nav.features': 'Features',
    'nav.automations': 'Automations',
    'nav.pricing': 'Pricing',
    'nav.login': 'Sign In',
    'nav.start': 'Start Free →',

    'hero.badge': 'AI Operations Assistant',
    'hero.title': 'Organize Your Excel Data<br><em><span class="accent">With a Single Sentence.</span></em>',
    'hero.desc': 'Mocksheets is designed for operations managers. No formulas, no technical knowledge — just write what you want to do, and Mocksheets handles the rest. <b style="color:var(--ink)">Save 7+ hours per week.</b>',
    'hero.price.unit': '/mo',
    'hero.cta1': 'Start Free →',
    'hero.cta2': 'See Live →',

    'steps.title': 'From data to decision.<br>In three steps.',
    'steps.sub': 'No formulas. No technical knowledge. Just write what you want — Mocksheets handles the rest.',
    'steps.1.label': '01 · CONNECT',
    'steps.1.title': 'Pull from wherever<br>your data lives.',
    'steps.1.desc': 'Connect to 200+ sources. Import, merge, and prepare your data.',
    'steps.2.label': '02 · WRITE',
    'steps.2.title': 'Ask in plain English.<br>Mocksheets understands.',
    'steps.2.desc': 'Write sentences, not formulas. Chain commands — context stays in memory.',
    'steps.3.label': '03 · ANALYZE',
    'steps.3.title': 'Results in seconds.<br>Ready to share.',
    'steps.3.desc': 'Tables, summaries, charts. Send to Slack, Gmail, or Drive in one click.',

    'integrations.title': 'Lives inside',
    'integrations.desc': 'Mocksheets connects with the tools your team already uses. Import data, trigger automations, sync your spreadsheets.',
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

    'cta.title': 'The best way to manage operations <em>with AI support.</em>',
    'cta.btn1': 'Start Free with Google',
    'cta.btn2': 'Talk to Sales',

    'footer.product': 'Product',
    'footer.resources': 'Resources',
    'footer.company': 'Company',
    'footer.tools': 'Tools',
    'footer.desc': 'Browser-based AI spreadsheet assistant for operations and e-commerce teams.',
    'footer.features': 'Features',
    'footer.pricing': 'Pricing',
    'footer.automations': 'Automations',
    'footer.blog': 'Blog',
    'footer.about': 'About',
    'footer.contact': 'Contact',
    'footer.kvkk': 'GDPR',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms of Use',
    'footer.tool1': 'Sample Data Generator',
    'footer.tool2': 'Excel Data Creator',
    'footer.tool3': 'Create CSV File',
    'footer.tool4': 'Prepare Test Data',
    'footer.tool5': 'Excel Template Data',
    'steps.2.badge': 'Most powerful step',
    'pricing.free.period': 'Free forever',
    'pricing.free.feat1': '5 AI commands per day',
    'pricing.free.feat2': 'Google Sheets sync',
    'pricing.free.feat3': 'TR interface',
    'gdpr.text': '<b>GDPR compliant</b> · your data is yours',
    'cancel.text': '<b>Cancel anytime</b> · one click',

    'built.with': 'Built with these technologies',
    'sectors.title': 'Works across every industry, every data type',
    'sectors.ecom.name': 'Ecommerce',
    'sectors.ecom.desc': 'Orders, inventory, customers',
    'sectors.ops.name': 'Operations',
    'sectors.ops.desc': 'Processes, teams, tasks',
    'sectors.finance.name': 'Finance',
    'sectors.finance.desc': 'Revenue, expenses, budget',
    'sectors.hr.name': 'Human Resources',
    'sectors.hr.desc': 'Personnel, leave, performance',
    'integrations.pill': '200 integrations',
    'pricing.promo.label': 'For teams joining this week —',
    'pricing.promo.campaign': "JUNE '26 CAMPAIGN",
    'pricing.free.note': 'For those who want to explore Mocksheets. No card required.',
    'pricing.yearly.note': 'Promo not valid on annual plans.',
    'cta.eyebrow': "— let's get started",
    'footer.copyright': '© 2026 Mocksheets · For operations teams everywhere',

    'integrations.eyebrow': '— integrations',
    'integrations.title.italic': 'your operations stack.',
    'integrations.pill2': 'Shopify → Mocksheets → Slack · Weekly order report delivered to Slack automatically',
    'demo.ai.title': 'Mocksheets AI',
    'demo.ai.command': 'Notify Slack of all leads in HubSpot',
    'demo.ai.result.title': 'Automation ready:',
    'demo.ai.result.1': '✓ HubSpot trigger set',
    'demo.ai.result.2': '✓ Slack channel connected',
    'demo.ai.result.3': '✓ Real-time notifications on',
    'demo.ai.placeholder': 'Enter another command…',
    'demo.setup.tab.setup': 'Setup',
    'demo.setup.tab.config': 'Configure',
    'demo.setup.tab.test': 'Test',
    'demo.setup.app': 'APP',
    'demo.setup.change': 'Change',
    'demo.setup.action': 'ACTION',
    'demo.setup.contact': 'Create Contact',
    'demo.setup.source': 'SOURCE COLUMN',
    'demo.setup.email.col': 'Email (Column B)',
    'demo.setup.continue': 'Continue →',
    'demo.cmd.1': 'Find the 5 highest-cost items this quarter',
    'demo.cmd.2': 'Compare them to last quarter',
    'demo.cmd.3': 'Send as report to Slack',
    'demo.result.1': '5 rows · sorted',
    'demo.result.2': 'Quarter comparison',
    'demo.result.3': 'Sent to Slack',
    'pricing.trial.desc': 'First month for $1',
    'pricing.trial.after': '· then standard pricing',
    'source.excel': 'Excel',
    'source.csv': 'CSV',
    'source.pdf': 'PDF',
    'source.shopify': 'Shopify',
    'source.hubspot': 'HubSpot',
    'source.more': '+195 more',

    'pricing.pro.desc1': 'First month $1/mo · Grab before promo ends.',
    'pricing.pro.desc2': 'For operations managers who use Excel regularly.',
    'pricing.pro.feat1': '500 AI commands per month',
    'pricing.pro.feat2': 'PDF → table conversion',
    'pricing.pro.feat3': '10 active automations',
    'pricing.pro.feat4': '60-day version history',
    'pricing.pro.feat5': 'Email support',
    'pricing.pro.period': 'First month · then $15/mo',

    'pricing.promax.badge': '⭐ Best Value',
    'pricing.promax.desc': 'For managers who want to fully automate operations.',
    'pricing.promax.feat1': 'AI Agents (unlimited)',
    'pricing.promax.feat2': '1500 commands/mo',
    'pricing.promax.feat3': 'Unlimited automations',
    'pricing.promax.feat4': 'PDF → table conversion',
    'pricing.promax.feat5': '90-day version history',
    'pricing.promax.feat6': 'All integrations',
    'pricing.promax.feat7': 'API access',
    'pricing.promax.period': 'First month · then $21/mo',

    'pricing.team.desc': 'First month $1/mo · For 5+ member ops teams. Single invoice.',
    'pricing.team.feat1': 'Unlimited AI commands',
    'pricing.team.feat2': '5 seats included',
    'pricing.team.feat3': 'Unlimited automations',
    'pricing.team.feat4': 'Live collaboration + comments',
    'pricing.team.feat5': 'SSO + audit log',
    'pricing.team.feat6': 'Dedicated account manager',
    'pricing.team.period': '/mo · 5 seats',
    'pricing.team.badge': '⭐ Best Value',
    'pricing.free.cta': 'Sign up with Google',
    'pricing.pro.cta': 'Get Pro',
    'pricing.promax.cta': 'Get Pro Max',
    'pricing.team.cta': 'Start Team',

    'faq.q1': 'Is my data safe?',
    'faq.a1': 'All data is encrypted and stored on Supabase (PostgreSQL). GDPR and KVKK compliant infrastructure. Your data is never shared with third parties. You can delete your account and all data anytime.',
    'faq.q2': 'Will my Excel file be deleted?',
    'faq.a2': 'No. Mocksheets processes but preserves your original file. Every operation is reversible. Pro plan keeps 90-day version history.',
    'faq.q3': 'Does it work offline?',
    'faq.a3': 'Mocksheets is browser-based and requires internet connection. All AI commands are processed in the cloud, so your computer bears no load.',
    'faq.q4': 'What file formats are supported?',
    'faq.a4': '.xlsx, .xls, .csv and PDF (OCR-based table extraction) are supported. Export formats include Excel, CSV, and JSON.',
    'faq.q5': 'Are languages other than Turkish available?',
    'faq.a5': 'Yes. Commands work in Turkish and English. Interface language option is available.',
    'faq.q6': 'How many people can use it simultaneously?',
    'faq.a6': 'Mocksheets is designed for individual use. Pro Max plan offers unlimited commands and automations with full feature access.',
    'faq.q7': 'Can I start without a credit card?',
    'faq.a7': 'Yes. Free plan requires no card. Start in 30 seconds with your Google account, use 5 AI commands per day for free.',
    'faq.q8': 'Is it hard to cancel?',
    'faq.a8': 'No. One-click cancel. No contracts, no hidden fees. Cancellation is immediate, next invoice will not be charged.',
    'faq.q9': 'Can I use it for my e-commerce store?',
    'faq.a9': 'Yes. You can upload and analyze CSV files from Shopify, WooCommerce, Trendyol, Hepsiburada, and other platforms.',
    'faq.q10': 'How do I connect my Shopify store?',
    'faq.a10': "You can directly connect your store with the Shopify integration. Your order, product, and customer data is automatically imported to Mocksheets. Connection takes 2 minutes.",
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
    document.documentElement.lang = this.lang;
  },

  toggle() {
    this.setLang(this.lang === 'tr' ? 'en' : 'tr');
  },

  init() {
    const apply = () => {
      this.applyAll();
      this.updateToggle();
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', apply);
    } else {
      apply();
    }
    setTimeout(() => { this.applyAll(); }, 500);
  }
};

i18n.init();
window.i18n = i18n;

// Debug: konsola yüklendi mesajı yaz
console.log('[i18n] Yüklendi. Dil:', i18n.lang, '| Key sayısı:', Object.keys(TRANSLATIONS.tr).length);
