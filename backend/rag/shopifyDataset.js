'use strict';

// Shopify mağaza yönetimi için Türkçe soru-cevap örnekleri.
// Chat retrieval'ı bu dataset üzerinden BM25 ile arama yapar.
// Shape: { user_command, category, response_hint }

module.exports = [
  // === PRODUCT ===
  { user_command: 'ürünlerimin başlıklarını toplu nasıl güncellerim?', category: 'product', response_hint: 'Shopify admin → Products → Select all → Actions → Bulk edit. Title kolonunu ekle, hücreleri düzenle, otomatik kaydeder.' },
  { user_command: 'yeni ürün nasıl eklerim', category: 'product', response_hint: 'Products → Add product. Title, description, media, price, inventory (SKU/stok), shipping (weight) alanlarını doldur. Status: Active → Save.' },
  { user_command: 'ürün varyantı nasıl oluşturulur', category: 'product', response_hint: 'Ürün sayfasında Variants → Add options (Beden, Renk vs). Her kombinasyon için ayrı fiyat, SKU, stok girilebilir.' },
  { user_command: 'ürün fotoğraflarını toplu nasıl yüklerim', category: 'product', response_hint: 'Bulk edit destekli değil — CSV import + hosted image URL kullan, veya Matrixify/Excelify gibi app ile toplu yükle.' },
  { user_command: 'ürünlerin SKU kodlarını nasıl değiştiririm', category: 'product', response_hint: 'Products → Export CSV → SKU kolonunu düzenle → Import (Overwrite). Alternatif: Bulk edit ekranında SKU kolonunu göster.' },
  { user_command: 'ürünleri koleksiyona nasıl eklerim', category: 'product', response_hint: 'Automated collection: Products → Collections → Create → Condition (tag/type/price). Manual: ürün sayfası → Collections → seç.' },
  { user_command: 'ürünü nasıl silerim', category: 'product', response_hint: 'Products listesi → ürün seç → More actions → Delete. Toplu: birden fazla seç → Delete selected. Geri alınamaz — arşivle yerine.' },
  { user_command: 'ürünü nasıl arşivlerim', category: 'product', response_hint: 'Product sayfası → sağ üst More actions → Archive product. Storefront\'ta gözükmez ama veri korunur, sonra unarchive yapılır.' },
  { user_command: 'ürün açıklaması nasıl SEO uyumlu yazılır', category: 'product', response_hint: 'İlk 155 karakterde ana kelime + fayda. HTML başlık yapısı (H2/H3). Marka + model + özellik. Tekrar eden içerikten kaçın (duplicate content).' },
  { user_command: 'toplu ürün import CSV formatı nedir', category: 'product', response_hint: 'Shopify CSV template: Handle, Title, Body(HTML), Vendor, Product Category, Type, Tags, Published, Option1 Name/Value, Variant SKU/Price/Inventory Qty, Image Src...' },

  // === PRICING ===
  { user_command: 'ürünlerin fiyatını toplu nasıl güncellerim', category: 'pricing', response_hint: 'Products → Select all → Bulk edit → Price kolonu. Veya CSV export/import. %20 zam için: Matrixify app veya Shopify Bulk Editor formülleri.' },
  { user_command: 'compare at price nedir nasıl kullanılır', category: 'pricing', response_hint: 'Compare at price = eski fiyat (üstü çizili gösterilir). Price < Compare at price ise indirim rozeti çıkar. İndirimli kampanyalarda etkili.' },
  { user_command: 'para birimini nasıl değiştiririm', category: 'pricing', response_hint: 'Settings → General → Store currency. Uyarı: değişiklikten sonra tüm fiyatlar yeni birim olarak yorumlanır — otomatik dönüşüm YOK.' },
  { user_command: 'çoklu para birimi nasıl açarım', category: 'pricing', response_hint: 'Shopify Payments zorunlu → Settings → Payments → Manage → Countries/regions. Markets ile ülke bazlı fiyat & FX ayarı.' },
  { user_command: 'ürüne yüzde 15 zam nasıl yapılır', category: 'pricing', response_hint: 'Bulk edit ekranında Price alanına formül girilmez — Matrixify/Bulk Price Editor app kullan. Alternatif: CSV export → Excel\'de =B2*1.15 → import.' },
  { user_command: 'maliyet cost per item nasıl girilir', category: 'pricing', response_hint: 'Ürün sayfası → Pricing bölümü → Cost per item. Kâr marjını raporlarda görmek için gerekli (Reports → Product cost).' },
  { user_command: 'kar marjı raporunu nerede görebilirim', category: 'pricing', response_hint: 'Analytics → Reports → Finances → Profit by product. Cost per item dolu olmalı. Basic plan ve üzeri.' },

  // === INVENTORY ===
  { user_command: 'stok takibini nasıl açarım', category: 'inventory', response_hint: 'Product → Inventory → "Track quantity" işaretle. Continue selling when out of stock kapalıysa stok 0\'a inince satış durur.' },
  { user_command: 'stok miktarını toplu nasıl güncellerim', category: 'inventory', response_hint: 'Products → Inventory tab → Bulk update. Veya CSV: Variant Inventory Qty kolonu. Multi-location ise Location adı da CSV\'de olmalı.' },
  { user_command: 'birden fazla depo lokasyon nasıl eklerim', category: 'inventory', response_hint: 'Settings → Locations → Add location. Ürün başına lokasyona stok dağıt. Order routing kurallarını ayarla (nearest, priority).' },
  { user_command: 'stok bittiğinde nasıl bildirim alırım', category: 'inventory', response_hint: 'Native: Products → Inventory → filtre "Low stock". Uyarı e-postası için app: Stocky (Shopify), Back in Stock, Alerty.' },
  { user_command: 'stokta olmayan ürünleri nasıl gizlerim', category: 'inventory', response_hint: 'Manual: ürün → Status → Draft. Otomasyon: Shopify Flow ile "when inventory quantity < 1 → set status draft". Veya theme filter.' },
  { user_command: 'stok transferi nasıl yapılır', category: 'inventory', response_hint: 'Products → Transfers → Create transfer. Kaynak & hedef lokasyon, ürünler, expected arrival. Received olduğunda stok güncellenir.' },

  // === ORDERS ===
  { user_command: 'siparişi nasıl kargoya veririm', category: 'orders', response_hint: 'Order detay → Fulfill items → kargo firması + takip no gir → Fulfill items. Müşteriye otomatik shipping confirmation e-postası gider.' },
  { user_command: 'sipariş iade nasıl yapılır', category: 'orders', response_hint: 'Order → Return → ürünleri seç → Return reason → Create return. İade kargo etiketi opsiyonel. Ürün geldikten sonra Refund işlemi başlat.' },
  { user_command: 'iade parayı nasıl geri veririm', category: 'orders', response_hint: 'Order → Refund → tutar + restock seçeneği. Shopify Payments ise otomatik kart iadesi. Manuel ödeme yönteminde manuel iade işaretle.' },
  { user_command: 'siparişi nasıl iptal ederim', category: 'orders', response_hint: 'Order → More actions → Cancel order → refund seçeneği + stock restock + iptal nedeni. Fulfilled sipariş iptal edilemez, önce refund yap.' },
  { user_command: 'siparişleri excel e nasıl aktarırım', category: 'orders', response_hint: 'Orders → Export → date range + Current page/All orders → Plain CSV. Excel\'de aç. Line items detayı için "Orders and their line items" seç.' },
  { user_command: 'kısmi sipariş kargolama nasıl', category: 'orders', response_hint: 'Order → Fulfill items ekranında sadece hazır olan ürünleri seç → Fulfill selected. Kalan ürünler "unfulfilled" kalır, sonra ayrı fulfill edilir.' },
  { user_command: 'çift sipariş algılama nasıl yapılır', category: 'orders', response_hint: 'Native değil. App: Fraud Filter (Shopify), NoFraud, Beacon. Kural: aynı e-posta + kart + 10 dk içinde tekrar → uyarı.' },

  // === SEO ===
  { user_command: 'ürünlerimin seo başlıklarını nasıl toplu güncellerim', category: 'seo', response_hint: 'Products → Bulk edit → SEO title kolonunu ekle. Formül: {Ürün adı} - {Marka} | {Ana Kelime}. 60 karakter altı tut.' },
  { user_command: 'meta açıklama nasıl yazılır', category: 'seo', response_hint: 'Ürün/Sayfa alt kısmı → Search engine listing → Edit. 150-160 karakter, ana keyword + fayda + CTA. Her sayfa için unique olmalı.' },
  { user_command: 'url handle nasıl değiştiririm', category: 'seo', response_hint: 'Ürün sayfası → Search engine listing → URL and handle. Değiştirince Shopify otomatik 301 redirect oluşturur (opt-in). Kısa, kelime-tireli tut.' },
  { user_command: 'sitemap nerede', category: 'seo', response_hint: 'Otomatik: yourstore.com/sitemap.xml. Google Search Console\'a submit et. Draft/hidden ürünler sitemap\'te yer almaz.' },
  { user_command: 'robots txt nasıl düzenlenir', category: 'seo', response_hint: 'Online Store → Themes → Edit code → templates/robots.txt.liquid oluştur. Custom directives ekle. Yanlış edit crawl bloklar — dikkat.' },
  { user_command: 'alt text ürün fotoğrafına nasıl eklenir', category: 'seo', response_hint: 'Product → Media → resim üstüne tıkla → Alt text alanı. SEO + erişilebilirlik için kritik. Ürün adı + özellik + bağlam yaz.' },
  { user_command: 'google shopping için ürün nasıl hazırlanır', category: 'seo', response_hint: 'Google & YouTube app kur → Product feed sync. GTIN, brand, product category (Google taxonomy), condition (new) alanları dolu olmalı.' },
  { user_command: 'blog yazıları seo nasıl optimize edilir', category: 'seo', response_hint: 'Blog post → Search engine listing → title (60 char) + meta (155). H1 = başlık, H2/H3 alt başlıklar. İç link (ürün sayfası), alt text, kısa URL handle.' },

  // === MARKETING ===
  { user_command: 'email kampanya nasıl gönderirim', category: 'marketing', response_hint: 'Shopify Email app (ücretsiz 10K/ay). Marketing → Campaigns → Create → Email → template seç, subscriber segment seç, gönder/schedule.' },
  { user_command: 'terk edilmiş sepet e-postası nasıl açılır', category: 'marketing', response_hint: 'Settings → Checkout → Abandoned checkouts → "Automatically send abandoned checkout emails" aç. Zaman aralığı (1h, 10h, 24h) seç.' },
  { user_command: 'facebook ads shopify entegrasyonu', category: 'marketing', response_hint: 'Facebook & Instagram app kur. Meta Business Manager bağla. Pixel & Conversions API otomatik. Product feed → Meta Commerce Manager.' },
  { user_command: 'tiktok pixel nasıl kurulur', category: 'marketing', response_hint: 'TikTok app (Shopify) kur → TikTok Business bağla. Pixel + Events API otomatik entegre. Product catalog senkronizasyonu opsiyonel.' },
  { user_command: 'popup nasıl eklerim', category: 'marketing', response_hint: 'App: Privy, Poptin, Justuno. Newsletter/email capture, exit intent, spin-to-win. Shopify Email\'in signup form widget\'ı da temel iş görür.' },
  { user_command: 'sadakat programı nasıl kurarım', category: 'marketing', response_hint: 'App: Smile.io, LoyaltyLion, Yotpo Loyalty. Points per satın alma, referral, tier, redemption discount. Shopify checkout\'a native entegre.' },

  // === ANALYTICS ===
  { user_command: 'satış raporlarını nerede görebilirim', category: 'analytics', response_hint: 'Analytics → Dashboards → Total sales, Sessions, Conversion rate. Detay: Reports → Sales → by product/channel/traffic source.' },
  { user_command: 'en çok satan ürün hangisi', category: 'analytics', response_hint: 'Analytics → Reports → Sales → Sales by product. Date range + sort by "Net items sold". CSV export ile filtrelenebilir.' },
  { user_command: 'dönüşüm oranı nasıl artırılır', category: 'analytics', response_hint: 'Ürün sayfası: net foto + video + review, hızlı sayfa (Speed report), trust badge, checkout basitleştir (accelerated checkout: Shop Pay, Apple Pay).' },
  { user_command: 'google analytics 4 nasıl bağlanır', category: 'analytics', response_hint: 'Google & YouTube app → Google Analytics connect. GA4 Measurement ID gir. Enhanced ecommerce eventleri otomatik gönderilir.' },
  { user_command: 'trafik kaynaklarını nasıl analiz ederim', category: 'analytics', response_hint: 'Analytics → Reports → Acquisition → Sessions by referrer/marketing/social. UTM parametrelerini kampanyalarında kullan.' },
  { user_command: 'müşteri yaşam boyu değeri clv nasıl hesaplarım', category: 'analytics', response_hint: 'Analytics → Customers → Customer lifetime value predictions (Shopify AI). Manuel: (avg order value) × (satın alma frekansı) × (müşteri ömrü).' },

  // === KDV / TAX ===
  { user_command: 'kdv oranını nasıl ayarlarım', category: 'kdv', response_hint: 'Settings → Taxes and duties → Türkiye → Basic tax setup. Ürün başına farklı KDV: Products → Pricing → Charge tax on this product + Tax override.' },
  { user_command: 'kdv dahil fiyat mı hariç fiyat mı göstermeli', category: 'kdv', response_hint: 'TR B2C standart: KDV dahil göster. Settings → Taxes → "All prices include tax" işaretle. B2B için VAT-exempt customer tag ile ayrım.' },
  { user_command: 'e-fatura entegrasyonu var mı', category: 'kdv', response_hint: 'Yerli app: Paraşüt Shopify, Logo İşbaşı, Uyumsoft, Mikro Yazılım. Sipariş → e-Fatura/e-Arşiv otomatik. GİB entegrasyonu app üstünden.' },
  { user_command: 'kdv beyannamesi için satış raporu nasıl çıkarılır', category: 'kdv', response_hint: 'Reports → Finances → Taxes. Date range → export CSV. Order ID, tax name, tax rate, amount. Muhasebeciye ay bazlı gönder.' },
  { user_command: 'yurtdışı satışta kdv nasıl ayarlanır', category: 'kdv', response_hint: 'İhracat → KDV yok. Shopify Markets → country-based tax rules. AB için VAT OSS gerekli (limit üstü). ABD için sales tax nexus\'a göre eyalet ayarı.' },

  // === CUSTOMER ===
  { user_command: 'müşteri listesini nasıl indiririm', category: 'customer', response_hint: 'Customers → Export → CSV. Tüm profiller: name, email, spent, orders, tags. KVKK: sadece aktif marketing consent verenleri e-postala.' },
  { user_command: 'müşteri segmentleri nasıl oluşturulur', category: 'customer', response_hint: 'Customers → Segments → Create segment. Filter: total_spent > X, orders_count > Y, tag = "VIP", last_order_date > Z. Email\'de hedefleme için kullan.' },
  { user_command: 'müşteri hesabı zorunlu mu yapmalıyım', category: 'customer', response_hint: 'Settings → Checkout → Customer accounts → Optional (default, tavsiye). Required = conversion düşürür. Guest checkout aç.' },
  { user_command: 'toptan müşteri fiyatlandırması nasıl yapılır', category: 'customer', response_hint: 'Shopify B2B (Plus): Customer group + catalog. Basic plan: app (Wholesale Club, Bold B2B) veya price rule + customer tag + discount code.' },
  { user_command: 'müşteriye özel indirim nasıl tanımlarım', category: 'customer', response_hint: 'Discounts → Create → Discount code → Customer eligibility → Specific customer segments. Kod gönder veya otomatik apply (Automatic discount).' },

  // === DISCOUNT ===
  { user_command: 'indirim kodu nasıl oluşturulur', category: 'discount', response_hint: 'Discounts → Create discount → Amount off products/order, Free shipping, BOGO. Kod: manuel gir, kullanım limiti, tarih aralığı, min satın alma.' },
  { user_command: 'otomatik indirim nasıl açarım', category: 'discount', response_hint: 'Discounts → Create → Automatic discount. Müşteri kod girmez, sepette otomatik uygulanır. "3 al 2 öde" tipi kampanyalar.' },
  { user_command: 'kupon kullanım limiti nasıl konur', category: 'discount', response_hint: 'Kod oluştururken: "Maximum discount uses" → toplam limit. "One use per customer" → müşteri başı 1. Kombinasyon: Combinations sekmesinden diğer indirimlerle çakışma kuralı.' },
  { user_command: 'hediye kartı nasıl oluşturulur', category: 'discount', response_hint: 'Products → Add product → "This is a gift card" işaretle → denominations (500, 1000). Müşteri satın alır → e-posta ile kod → checkout\'ta apply.' },
  { user_command: 'kargo bedava kampanyası nasıl açılır', category: 'discount', response_hint: 'Discounts → Create → Free shipping. Min satın alma tutarı, ülke, ürün/koleksiyon filtresi. Automatic yap ki müşteri kod girmesin.' },

  // === SHIPPING ===
  { user_command: 'kargo ücretlerini nasıl ayarlarım', category: 'shipping', response_hint: 'Settings → Shipping and delivery → Shipping zones → Add rate. Price-based (0-100 TL = 30 TL, 100+ = free) veya weight-based (0-1kg vs).' },
  { user_command: 'yurtiçi kargo firmalarını nasıl bağlarım', category: 'shipping', response_hint: 'TR native carrier calculated: sınırlı. App: Yurtiçi/MNG/Aras/PTT entegrasyon app\'leri (Shopilink, Kolaysoft). Etiket + tracking otomatik.' },
  { user_command: 'kargo takip numarası nasıl eklenir', category: 'shipping', response_hint: 'Order → Fulfill items ekranında "Tracking number" alanı + carrier seç. Müşteriye shipping confirmation e-postasında link olarak gider.' },
  { user_command: 'aynı gün kargo ayarı nasıl', category: 'shipping', response_hint: 'Shipping zone içinde express rate ekle (min tutar, saat cutoff). "Order by X" mesajını ürün sayfasında Liquid ile göster.' },
  { user_command: 'kargo ücretini müşteriye nasıl gizlerim', category: 'shipping', response_hint: 'Free shipping rate ekle veya fiyata dahil et (kargo maliyetini ürün fiyatına yay). Shipping zones → Rate name "Standart Teslimat" + 0 TL.' },

  // === INTEGRATION ===
  { user_command: 'shopify api key nereden alınır', category: 'integration', response_hint: 'Apps → App and sales channel settings → Develop apps → Create app → API credentials. Admin API access token + scopes seç.' },
  { user_command: 'webhook nasıl eklenir', category: 'integration', response_hint: 'Settings → Notifications → Webhooks → Create → Event (orders/create, products/update) + URL + format. Veya custom app içinde subscribe et.' },
  { user_command: 'zapier ile shopify nasıl entegre olur', category: 'integration', response_hint: 'Zapier → Shopify app → Connect (store URL + admin). Trigger: New order/customer. Action: Google Sheets, Slack, Mailchimp\'e push.' },
  { user_command: 'muhasebe programına siparişleri nasıl aktarırım', category: 'integration', response_hint: 'App: Paraşüt, Logo İşbaşı, Bizim Hesap Shopify konektörü. Sipariş → otomatik e-Fatura + muhasebe kaydı. Stok senkron opsiyonel.' },
  { user_command: 'shopify flow ne işe yarar', category: 'integration', response_hint: 'Shopify Flow (ücretsiz, Basic+): if-this-then-that otomasyonu. Örn: "Order tag VIP → send Slack notif" veya "Low inventory → email supplier".' },
  { user_command: 'excel den ürün import nasıl yapılır', category: 'integration', response_hint: 'Products → Import → CSV (Shopify template). Excel → Save As CSV UTF-8. Kolon isimleri Shopify formatında olmalı. Matrixify app daha esnek.' },
  { user_command: 'trendyol shopify entegrasyonu var mı', category: 'integration', response_hint: 'Yerli app: Sentos, Boostcommerce, Ideasoft köprüsü, Akinsoft. Ürün + stok + sipariş 2-yönlü sync. Fiyat farkı ayarı önemli.' },
  { user_command: 'hepsiburada shopify entegrasyonu', category: 'integration', response_hint: 'Sentos, Boostcommerce, N11-Trendyol-Hepsiburada multi-channel app\'leri. Ürün push + stok senkron + sipariş çek → Shopify order olarak oluştur.' },

  // === STORE MANAGEMENT ===
  { user_command: 'tema nasıl değiştirilir', category: 'store', response_hint: 'Online Store → Themes → Theme library → Add theme (free/paid). Customize → preview. Publish ile canlıya al. Eski tema arşivde kalır.' },
  { user_command: 'domain nasıl bağlanır', category: 'store', response_hint: 'Settings → Domains → Connect existing domain. DNS: A record = 23.227.38.65, CNAME www = shops.myshopify.com. Primary domain seç.' },
  { user_command: 'ödeme yöntemleri nasıl eklenir', category: 'store', response_hint: 'Settings → Payments. Shopify Payments (TR henüz yok), iyzico, PayTR, Stripe (kart), COD (kapıda). Havale için manual payment.' },
  { user_command: 'kapıda ödeme nasıl açılır', category: 'store', response_hint: 'Settings → Payments → Add manual payment method → "Cash on Delivery (COD)". Ek talimat yaz. Bazı kargo firmaları COD tahsilatı destekler.' },
  { user_command: 'iyzico shopify kurulumu', category: 'store', response_hint: 'Settings → Payments → Alternative payment methods → Search "iyzico" → aktivasyon. iyzico merchant panel API keys al → Shopify\'a gir → aktif et.' },
  { user_command: 'sayfa nasıl eklerim hakkımızda iletişim', category: 'store', response_hint: 'Online Store → Pages → Add page. Title, content (rich text/HTML). Template: page/page.contact. Menu\'ye ekle: Navigation → Main menu.' },
  { user_command: 'menü navigation nasıl düzenlenir', category: 'store', response_hint: 'Online Store → Navigation → Main menu / Footer menu → Add menu item → Link (collection, page, product, URL). Nested (drop-down) desteklenir.' },
  { user_command: 'kvkk metni nereye koyulur', category: 'store', response_hint: 'Settings → Policies → Privacy policy. Template default var, KVKK\'ya uyarla. Checkout ve footer\'da otomatik link. Cookie banner için app (Consentmo).' },
];
