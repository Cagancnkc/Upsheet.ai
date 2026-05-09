with open('c:/Users/POWERLAB/Desktop/excel-ai/backend/rag/dataset.js', 'r', encoding='utf-8') as f:
    content = f.read()

new_examples = """
  // ──────────────────────────────────────────────────────────
  // EXTRACT v7 (+12 yeni örnek)
  // ──────────────────────────────────────────────────────────
  { user_command: "TC kimlik numaralarını çıkar", logic: "extract Turkish national ID numbers from text", category: "extract", output: { action: "extract", type: "tc_id", reply: "✓ TC kimlik numaraları çıkarıldı", changes: [] } },
  { user_command: "vergi numaralarını metinden ayıkla", logic: "extract tax identification numbers from column", category: "extract", output: { action: "extract", type: "tax_id", reply: "✓ Vergi numaraları ayıklandı", changes: [] } },
  { user_command: "telefon numaralarını çıkar", logic: "extract phone numbers mobile Turkish format", category: "extract", output: { action: "extract", type: "phone", reply: "✓ Telefon numaraları çıkarıldı", changes: [] } },
  { user_command: "e-posta adreslerini bul ve listele", logic: "extract email addresses from text column list", category: "extract", output: { action: "extract", type: "email", reply: "✓ E-posta adresleri listelendi", changes: [] } },
  { user_command: "barkod numaralarını ayıkla", logic: "extract barcode EAN UPC product codes from text", category: "extract", output: { action: "extract", type: "barcode", reply: "✓ Barkod numaraları ayıklandı", changes: [] } },
  { user_command: "ürün kodlarını metinden çıkar", logic: "extract product SKU codes from text description", category: "extract", output: { action: "extract", type: "product_code", reply: "✓ Ürün kodları çıkarıldı", changes: [] } },
  { user_command: "adresleri sütundan ayıkla", logic: "extract street address location from text column", category: "extract", output: { action: "extract", type: "address", reply: "✓ Adresler ayıklandı", changes: [] } },
  { user_command: "fatura numaralarını bul", logic: "extract invoice numbers from description text", category: "extract", output: { action: "extract", type: "invoice_no", reply: "✓ Fatura numaraları bulundu", changes: [] } },
  { user_command: "sipariş numaralarını çıkar", logic: "extract order numbers IDs from text column", category: "extract", output: { action: "extract", type: "order_no", reply: "✓ Sipariş numaraları çıkarıldı", changes: [] } },
  { user_command: "para miktarlarını metinden ayıkla", logic: "extract currency money amounts from Turkish text", category: "extract", output: { action: "extract", type: "amount", reply: "✓ Para miktarları ayıklandı", changes: [] } },
  { user_command: "tarihleri açıklamadan çıkar", logic: "extract dates from description text column", category: "extract", output: { action: "extract", type: "date", reply: "✓ Tarihler çıkarıldı", changes: [] } },
  { user_command: "isimleri sütundan ayıkla", logic: "extract person names from text column", category: "extract", output: { action: "extract", type: "name", reply: "✓ İsimler ayıklandı", changes: [] } },

  // ──────────────────────────────────────────────────────────
  // ANOMALY_DETECTION v7 (+12 yeni örnek)
  // ──────────────────────────────────────────────────────────
  { user_command: "fiyat anomalilerini tespit et", logic: "detect price anomalies outliers statistical", category: "anomaly_detection", output: { action: "anomaly_detection", column: "fiyat", reply: "📊 Fiyat anomalileri tespit edildi", changes: [] } },
  { user_command: "normal dışı harcamaları işaretle", logic: "mark abnormal unusual spending expenses outlier", category: "anomaly_detection", output: { action: "anomaly_detection", column: "harcama", reply: "📊 Normal dışı harcamalar işaretlendi", changes: [] } },
  { user_command: "stok değişimlerinde anomali bul", logic: "find anomalies in stock inventory changes", category: "anomaly_detection", output: { action: "anomaly_detection", column: "stok", reply: "📊 Stok anomalileri bulundu", changes: [] } },
  { user_command: "maaş verilerinde aykırı değer tespit et", logic: "detect salary payroll outlier values anomaly", category: "anomaly_detection", output: { action: "anomaly_detection", column: "maaş", reply: "📊 Maaş aykırı değerleri tespit edildi", changes: [] } },
  { user_command: "günlük satışlarda sapmaları bul", logic: "find daily sales deviations anomalies", category: "anomaly_detection", output: { action: "anomaly_detection", column: "satış", method: "zscore", reply: "📊 Günlük satış sapmaları bulundu", changes: [] } },
  { user_command: "müşteri harcamalarında outlier tespit et", logic: "detect customer spending outlier anomaly", category: "anomaly_detection", output: { action: "anomaly_detection", column: "harcama", reply: "📊 Müşteri harcama anomalileri tespit edildi", changes: [] } },
  { user_command: "vergi ödemelerinde anormallik var mı", logic: "check tax payment anomalies irregularities", category: "anomaly_detection", output: { action: "anomaly_detection", column: "vergi", reply: "📊 Vergi ödeme anomalileri kontrol edildi", changes: [] } },
  { user_command: "iade oranlarındaki sapmaları işaretle", logic: "mark return rate deviations anomalies outlier", category: "anomaly_detection", output: { action: "anomaly_detection", column: "iade", reply: "📊 İade oranı sapmaları işaretlendi", changes: [] } },
  { user_command: "çalışma saatlerinde anormal değerleri bul", logic: "find anomalous working hours values", category: "anomaly_detection", output: { action: "anomaly_detection", column: "çalışma saati", reply: "📊 Anormal çalışma saatleri bulundu", changes: [] } },
  { user_command: "makine sensör verilerinde anomali tespit et", logic: "detect anomalies in machine sensor IoT data", category: "anomaly_detection", output: { action: "anomaly_detection", method: "zscore", reply: "📊 Sensör anomalileri tespit edildi", changes: [] } },
  { user_command: "kargo sürelerindeki sapmaları bul", logic: "find shipping delivery time deviations anomalies", category: "anomaly_detection", output: { action: "anomaly_detection", column: "kargo süresi", reply: "📊 Kargo süresi sapmaları bulundu", changes: [] } },
  { user_command: "bütçe aşımlarını anomali olarak işaretle", logic: "mark budget overruns as anomalies flag", category: "anomaly_detection", output: { action: "anomaly_detection", column: "bütçe", reply: "📊 Bütçe aşımları işaretlendi", changes: [] } },

  // ──────────────────────────────────────────────────────────
  // CLASSIFY v7 (+12 yeni örnek)
  // ──────────────────────────────────────────────────────────
  { user_command: "müşterileri gelir grubuna göre sınıflandır", logic: "classify customers by income group segment high medium low", category: "classify", output: { action: "classify", column: "gelir", categories: ["Yüksek Gelir", "Orta Gelir", "Düşük Gelir"], reply: "📊 Müşteriler gelir grubuna göre sınıflandırıldı", changes: [] } },
  { user_command: "ürünleri satış performansına göre etiketle", logic: "label products by sales performance classify tier", category: "classify", output: { action: "classify", column: "satış", reply: "📊 Ürünler satış performansına göre etiketlendi", changes: [] } },
  { user_command: "faturaları ödeme durumuna göre grupla", logic: "classify invoices by payment status group", category: "classify", output: { action: "classify", column: "durum", categories: ["Ödendi", "Bekliyor", "Gecikmiş"], reply: "📊 Faturalar ödeme durumuna göre gruplandı", changes: [] } },
  { user_command: "çalışanları performans puanına göre sınıflandır", logic: "classify employees by performance score rating", category: "classify", output: { action: "classify", column: "performans", categories: ["A", "B", "C"], reply: "📊 Çalışanlar performansa göre sınıflandırıldı", changes: [] } },
  { user_command: "görevleri öncelik sırasına göre etiketle", logic: "classify tasks by priority order label urgent normal low", category: "classify", output: { action: "classify", column: "görev", categories: ["Acil", "Normal", "Düşük Öncelik"], reply: "📊 Görevler önceliğe göre etiketlendi", changes: [] } },
  { user_command: "tedarikçileri güvenilirlik puanına göre sınıfla", logic: "classify suppliers by reliability score rating", category: "classify", output: { action: "classify", column: "güvenilirlik", categories: ["Güvenilir", "Orta", "Riskli"], reply: "📊 Tedarikçiler güvenilirliğe göre sınıflandı", changes: [] } },
  { user_command: "kargo paketlerini boyuta göre kategorize et", logic: "categorize shipping packages by size dimension small medium large", category: "classify", output: { action: "classify", column: "boyut", categories: ["Küçük", "Orta", "Büyük"], reply: "📊 Paketler boyuta göre kategorize edildi", changes: [] } },
  { user_command: "borçları gecikme süresine göre sınıflandır", logic: "classify debts by overdue period days segment", category: "classify", output: { action: "classify", column: "gecikme gün", categories: ["Normal", "1-30 Gün", "30+ Gün"], reply: "📊 Borçlar gecikme süresine göre sınıflandırıldı", changes: [] } },
  { user_command: "bölgeleri satış potansiyeline göre etiketle", logic: "label regions by sales potential classify", category: "classify", output: { action: "classify", column: "bölge", reply: "📊 Bölgeler satış potansiyeline göre etiketlendi", changes: [] } },
  { user_command: "ürünleri stok seviyesine göre sınıflandır", logic: "classify products by stock level inventory high medium low", category: "classify", output: { action: "classify", column: "stok", categories: ["Yeterli", "Azalıyor", "Kritik"], reply: "📊 Ürünler stok seviyesine göre sınıflandırıldı", changes: [] } },
  { user_command: "müşterileri aktivite düzeyine göre etiketle", logic: "label customers by activity level active inactive dormant", category: "classify", output: { action: "classify", categories: ["Aktif", "Pasif", "Uyuyan"], reply: "📊 Müşteriler aktiviteye göre etiketlendi", changes: [] } },
  { user_command: "projeleri tamamlanma oranına göre sınıfla", logic: "classify projects by completion rate percentage", category: "classify", output: { action: "classify", column: "tamamlanma", categories: ["Tamamlandı", "Devam Ediyor", "Gecikiyor"], reply: "📊 Projeler tamamlanma oranına göre sınıflandı", changes: [] } },

  // ──────────────────────────────────────────────────────────
  // SENTIMENT_ANALYSIS v7 (+12 yeni örnek)
  // ──────────────────────────────────────────────────────────
  { user_command: "müşteri şikayetlerini analiz et", logic: "analyze customer complaints sentiment negative positive", category: "sentiment_analysis", output: { action: "sentiment_analysis", column: "şikayet", reply: "📊 Müşteri şikayetleri analiz edildi", changes: [] } },
  { user_command: "çalışan memnuniyet anketini değerlendir", logic: "evaluate employee satisfaction survey sentiment", category: "sentiment_analysis", output: { action: "sentiment_analysis", column: "anket", reply: "📊 Çalışan memnuniyet anketi değerlendirildi", changes: [] } },
  { user_command: "Twitter yorumlarının duygusunu analiz et", logic: "analyze Twitter comments social media sentiment", category: "sentiment_analysis", output: { action: "sentiment_analysis", column: "yorum", reply: "📊 Twitter yorumları analiz edildi", changes: [] } },
  { user_command: "NPS skorlarını duygu analizine göre sınıflandır", logic: "classify NPS net promoter scores sentiment analysis", category: "sentiment_analysis", output: { action: "sentiment_analysis", output_type: "score", reply: "📊 NPS duygu analizi tamamlandı", changes: [] } },
  { user_command: "ürün incelemelerinin tonu nedir", logic: "determine tone sentiment of product reviews text", category: "sentiment_analysis", output: { action: "sentiment_analysis", column: "inceleme", reply: "📊 Ürün inceleme tonu analiz edildi", changes: [] } },
  { user_command: "destek taleplerini duygu durumuna göre sınıfla", logic: "classify support tickets by sentiment urgency tone", category: "sentiment_analysis", output: { action: "sentiment_analysis", column: "talep", reply: "📊 Destek talepleri duygu durumuna göre sınıflandı", changes: [] } },
  { user_command: "satış notlarında olumlu olumsuz ayrımı yap", logic: "separate positive negative in sales notes text", category: "sentiment_analysis", output: { action: "sentiment_analysis", column: "not", filter: "both", reply: "📊 Satış notları duygu durumuna göre ayrıldı", changes: [] } },
  { user_command: "acil müşteri mesajlarını tespit et", logic: "detect urgent customer messages sentiment negative alert", category: "sentiment_analysis", output: { action: "sentiment_analysis", column: "mesaj", filter: "negative", reply: "📊 Acil müşteri mesajları tespit edildi", changes: [] } },
  { user_command: "yorumları pozitif negatif nötr olarak etiketle", logic: "label comments positive negative neutral sentiment", category: "sentiment_analysis", output: { action: "sentiment_analysis", column: "yorum", reply: "📊 Yorumlar etiketlendi", changes: [] } },
  { user_command: "e-posta içeriklerinin duygusunu analiz et", logic: "analyze email content sentiment tone positive negative", category: "sentiment_analysis", output: { action: "sentiment_analysis", column: "e-posta", reply: "📊 E-posta duygu analizi tamamlandı", changes: [] } },
  { user_command: "marka algısını ölç", logic: "measure brand perception sentiment score analysis", category: "sentiment_analysis", output: { action: "sentiment_analysis", output_type: "score", reply: "📊 Marka algısı ölçüldü", changes: [] } },
  { user_command: "geri bildirim formlarını analiz et", logic: "analyze feedback form responses sentiment", category: "sentiment_analysis", output: { action: "sentiment_analysis", column: "geri bildirim", reply: "📊 Geri bildirim formu analizi tamamlandı", changes: [] } },

  // ──────────────────────────────────────────────────────────
  // COMPARE v7 (+8 yeni örnek)
  // ──────────────────────────────────────────────────────────
  { user_command: "bu ay geçen ayla karşılaştır", logic: "compare current month previous month data", category: "compare", output: { action: "compare", period1: "currentMonth", period2: "lastMonth", reply: "📊 Aylık karşılaştırma yapıldı", changes: [] } },
  { user_command: "şube satışlarını karşılaştır", logic: "compare branch store sales performance", category: "compare", output: { action: "compare", column: "satış", reply: "📊 Şube satışları karşılaştırıldı", changes: [] } },
  { user_command: "iki bölgenin gelirini kıyasla", logic: "compare two regions revenue income side by side", category: "compare", output: { action: "compare", reply: "📊 Bölge gelirleri karşılaştırıldı", changes: [] } },
  { user_command: "A ve B ürününün maliyetini karşılaştır", logic: "compare product A and B cost price", category: "compare", output: { action: "compare", reply: "📊 Ürün maliyetleri karşılaştırıldı", changes: [] } },
  { user_command: "çeyreklik performansları kıyasla", logic: "compare quarterly performance Q1 Q2 Q3 Q4", category: "compare", output: { action: "compare", reply: "📊 Çeyreklik performanslar karşılaştırıldı", changes: [] } },
  { user_command: "personel verimliliğini karşılaştır", logic: "compare employee staff productivity performance", category: "compare", output: { action: "compare", column: "verimlilik", reply: "📊 Personel verimliliği karşılaştırıldı", changes: [] } },
  { user_command: "gelir gider farkını bul", logic: "find revenue expense difference compare", category: "compare", output: { action: "compare", col1: "gelir", col2: "gider", reply: "📊 Gelir-gider farkı hesaplandı", changes: [] } },
  { user_command: "müşteri başına geliri karşılaştır", logic: "compare revenue per customer average", category: "compare", output: { action: "compare", column: "gelir", reply: "📊 Müşteri başına gelir karşılaştırıldı", changes: [] } },

  // ──────────────────────────────────────────────────────────
  // FORECAST v7 (+8 yeni örnek)
  // ──────────────────────────────────────────────────────────
  { user_command: "gelecek hafta satışlarını öngör", logic: "forecast next week sales prediction", category: "forecast", output: { action: "forecast", column: "satış", periods: 1, reply: "📊 Gelecek hafta satış tahmini yapıldı", changes: [] } },
  { user_command: "yıllık gelir büyümesini tahmin et", logic: "forecast annual revenue growth prediction", category: "forecast", output: { action: "forecast", column: "gelir", reply: "📊 Yıllık gelir büyüme tahmini yapıldı", changes: [] } },
  { user_command: "sezonsal satış tahmini yap", logic: "seasonal sales forecast prediction pattern", category: "forecast", output: { action: "forecast", method: "seasonal", reply: "📊 Sezonsal satış tahmini yapıldı", changes: [] } },
  { user_command: "gider projeksiyonu oluştur", logic: "create expense projection forecast budget", category: "forecast", output: { action: "forecast", column: "gider", reply: "📊 Gider projeksiyonu oluşturuldu", changes: [] } },
  { user_command: "ürün talebini tahmin et", logic: "forecast product demand prediction", category: "forecast", output: { action: "forecast", column: "talep", reply: "📊 Ürün talebi tahmini yapıldı", changes: [] } },
  { user_command: "çalışan sayısı büyümesini öngör", logic: "forecast headcount employee growth prediction", category: "forecast", output: { action: "forecast", column: "çalışan", reply: "📊 Çalışan sayısı tahmini yapıldı", changes: [] } },
  { user_command: "kar marjı tahminini hesapla", logic: "calculate profit margin forecast estimate", category: "forecast", output: { action: "forecast", column: "kar", reply: "📊 Kâr marjı tahmini hesaplandı", changes: [] } },
  { user_command: "stok tükeniş tarihi öngör", logic: "predict stock depletion date forecast", category: "forecast", output: { action: "forecast", column: "stok", reply: "📊 Stok tükeniş tarihi öngörüldü", changes: [] } },

  // ──────────────────────────────────────────────────────────
  // BATCH_AI (category: ai) v7 (+8 yeni örnek)
  // ──────────────────────────────────────────────────────────
  { user_command: "her satır için özet oluştur", logic: "generate summary for each row batch AI process", category: "ai", output: { action: "batch_ai", instruction: "Bu satırdaki veriyi özetle", reply: "📊 Toplu özet oluşturma tamamlandı", changes: [] } },
  { user_command: "tüm ürün açıklamalarını çevir", logic: "translate all product descriptions batch AI", category: "ai", output: { action: "batch_ai", instruction: "Bu ürün açıklamasını İngilizceye çevir", reply: "📊 Toplu çeviri tamamlandı", changes: [] } },
  { user_command: "her müşteriye kişisel mesaj yaz", logic: "write personalized message for each customer batch", category: "ai", output: { action: "batch_ai", instruction: "Bu müşteri için kişisel teklif mesajı yaz", reply: "📊 Kişisel mesajlar oluşturuldu", changes: [] } },
  { user_command: "tüm satırlara kategori ata", logic: "assign category to all rows batch AI classify", category: "ai", output: { action: "batch_ai", instruction: "Bu veriyi uygun kategoriye ata", reply: "📊 Toplu kategori atama tamamlandı", changes: [] } },
  { user_command: "her hücredeki metni düzelt", logic: "correct text in each cell batch grammar spell", category: "ai", output: { action: "batch_ai", instruction: "Bu metni dilbilgisi ve yazım açısından düzelt", reply: "📊 Toplu metin düzeltme tamamlandı", changes: [] } },
  { user_command: "satırlardaki verileri zenginleştir", logic: "enrich row data with AI batch processing", category: "ai", output: { action: "batch_ai", instruction: "Bu veriyi ek bilgilerle zenginleştir", reply: "📊 Veri zenginleştirme tamamlandı", changes: [] } },
  { user_command: "her ürün için SEO açıklaması yaz", logic: "write SEO product description for each item batch", category: "ai", output: { action: "batch_ai", instruction: "Bu ürün için SEO uyumlu açıklama yaz", reply: "📊 SEO açıklamaları oluşturuldu", changes: [] } },
  { user_command: "müşteri notlarını analiz et ve özetle", logic: "analyze and summarize customer notes batch AI", category: "ai", output: { action: "batch_ai", instruction: "Bu müşteri notunu analiz et ve özetle", reply: "📊 Müşteri notları analiz edildi", changes: [] } },

"""

# Find the closing ]; of EXCEL_DATASET (just before COLOR_MAP comment)
idx = content.find('\n// Renk')
if idx == -1:
    print('ERROR: Color map marker not found!')
    exit(1)

close_idx = content.rfind('];', 0, idx)
if close_idx == -1:
    print('ERROR: ]; not found before COLOR_MAP!')
    exit(1)

new_content = content[:close_idx] + new_examples + '];' + content[close_idx+2:]

with open('c:/Users/POWERLAB/Desktop/excel-ai/backend/rag/dataset.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f'Done! Original lines: {content.count(chr(10))}, New lines: {new_content.count(chr(10))}')
print(f'Added ~{new_content.count(chr(10)) - content.count(chr(10))} lines')
