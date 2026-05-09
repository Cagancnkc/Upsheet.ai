import re

with open('c:/Users/POWERLAB/Desktop/excel-ai/backend/rag/dataset.js', 'r', encoding='utf-8') as f:
    content = f.read()

new_examples = """
  // ──────────────────────────────────────────────────────────
  // HEATMAP (10 yeni örnek)
  // ──────────────────────────────────────────────────────────
  { user_command: "ısıl harita oluştur", logic: "create heatmap color gradient scale", category: "heatmap", output: { action: "heatmap", reply: "📊 Isıl harita oluşturuldu", changes: [] } },
  { user_command: "satış verilerine heatmap uygula", logic: "apply heatmap to sales data column", category: "heatmap", output: { action: "heatmap", column: "satış", reply: "📊 Satış verisine heatmap uygulandı", changes: [] } },
  { user_command: "değerlere göre renk skalası uygula", logic: "apply color scale gradient by numeric value", category: "heatmap", output: { action: "heatmap", reply: "📊 Renk skalası uygulandı", changes: [] } },
  { user_command: "yoğunluk haritası yap", logic: "create density heatmap visualization", category: "heatmap", output: { action: "heatmap", reply: "📊 Yoğunluk haritası oluşturuldu", changes: [] } },
  { user_command: "performans skoru heatmap", logic: "heatmap performance score color scale", category: "heatmap", output: { action: "heatmap", column: "performans", reply: "📊 Performans skoru heatmap uygulandı", changes: [] } },
  { user_command: "fiyat yoğunluğu haritası", logic: "price density heatmap color gradient", category: "heatmap", output: { action: "heatmap", column: "fiyat", reply: "📊 Fiyat yoğunluğu haritası oluşturuldu", changes: [] } },
  { user_command: "korelasyon heatmap uygula", logic: "correlation matrix heatmap apply", category: "heatmap", output: { action: "heatmap", reply: "📊 Korelasyon haritası uygulandı", changes: [] } },
  { user_command: "aylık satış heatmap göster", logic: "monthly sales heatmap color map", category: "heatmap", output: { action: "heatmap", column: "satış", reply: "📊 Aylık satış heatmap gösterildi", changes: [] } },
  { user_command: "düşükten yükseğe renklendirme yap", logic: "color gradient low to high value heatmap", category: "heatmap", output: { action: "heatmap", direction: "asc", reply: "📊 Düşükten yükseğe renklendirme uygulandı", changes: [] } },
  { user_command: "stok yoğunluk haritası oluştur", logic: "stock density heatmap color scale", category: "heatmap", output: { action: "heatmap", column: "stok", reply: "📊 Stok yoğunluk haritası oluşturuldu", changes: [] } },

  // ──────────────────────────────────────────────────────────
  // COMPARE (8 yeni örnek)
  // ──────────────────────────────────────────────────────────
  { user_command: "bu yıl geçen yılla karşılaştır", logic: "compare current year previous year data", category: "compare", output: { action: "compare", period1: "currentYear", period2: "lastYear", reply: "📊 Yıllık karşılaştırma yapıldı", changes: [] } },
  { user_command: "iki sütunu karşılaştır", logic: "compare two columns side by side", category: "compare", output: { action: "compare", reply: "📊 Sütunlar karşılaştırıldı", changes: [] } },
  { user_command: "hedef ile gerçekleşeni karşılaştır", logic: "compare target vs actual values", category: "compare", output: { action: "compare", col1: "hedef", col2: "gerçekleşen", reply: "📊 Hedef-gerçekleşen karşılaştırması yapıldı", changes: [] } },
  { user_command: "bütçe ile harcamayı karşılaştır", logic: "compare budget vs spending expenditure", category: "compare", output: { action: "compare", col1: "bütçe", col2: "harcama", reply: "📊 Bütçe-harcama karşılaştırması yapıldı", changes: [] } },
  { user_command: "geçen haftaya göre değişim", logic: "compare change versus last week", category: "compare", output: { action: "compare", period1: "thisWeek", period2: "lastWeek", reply: "📊 Haftalık değişim hesaplandı", changes: [] } },
  { user_command: "iki ürünü fiyat açısından karşılaştır", logic: "compare two products by price column", category: "compare", output: { action: "compare", column: "fiyat", reply: "📊 Ürün fiyatları karşılaştırıldı", changes: [] } },
  { user_command: "mağaza performanslarını karşılaştır", logic: "compare store branch performance sales", category: "compare", output: { action: "compare", column: "satış", reply: "📊 Mağaza performansları karşılaştırıldı", changes: [] } },
  { user_command: "plan ile fiili karşılaştırma yap", logic: "compare planned vs actual results", category: "compare", output: { action: "compare", col1: "plan", col2: "fiili", reply: "📊 Plan-fiili karşılaştırması yapıldı", changes: [] } },

  // ──────────────────────────────────────────────────────────
  // FORECAST (8 yeni örnek)
  // ──────────────────────────────────────────────────────────
  { user_command: "önümüzdeki 6 ayı tahmin et", logic: "forecast next 6 months prediction", category: "forecast", output: { action: "forecast", periods: 6, reply: "📊 6 aylık tahmin hesaplandı", changes: [] } },
  { user_command: "gelecek çeyreği öngör", logic: "forecast next quarter Q prediction", category: "forecast", output: { action: "forecast", periods: 3, reply: "📊 Gelecek çeyrek tahmini yapıldı", changes: [] } },
  { user_command: "yıl sonu gelirini tahmin et", logic: "forecast end of year revenue prediction", category: "forecast", output: { action: "forecast", column: "gelir", reply: "📊 Yıl sonu gelir tahmini hesaplandı", changes: [] } },
  { user_command: "trend bazlı tahmin yap", logic: "trend based linear forecast prediction", category: "forecast", output: { action: "forecast", method: "trend", reply: "📊 Trend bazlı tahmin yapıldı", changes: [] } },
  { user_command: "hareketli ortalama ile tahmin et", logic: "moving average forecast method prediction", category: "forecast", output: { action: "forecast", method: "moving_average", reply: "📊 Hareketli ortalama tahmini yapıldı", changes: [] } },
  { user_command: "stok tüketim tahmini yap", logic: "stock consumption forecast depletion prediction", category: "forecast", output: { action: "forecast", column: "stok", reply: "📊 Stok tüketim tahmini yapıldı", changes: [] } },
  { user_command: "müşteri büyümesini tahmin et", logic: "forecast customer growth prediction", category: "forecast", output: { action: "forecast", column: "müşteri", reply: "📊 Müşteri büyüme tahmini yapıldı", changes: [] } },
  { user_command: "nakit akışı tahmini oluştur", logic: "cash flow forecast future prediction", category: "forecast", output: { action: "forecast", column: "nakit", reply: "📊 Nakit akışı tahmini oluşturuldu", changes: [] } },

  // ──────────────────────────────────────────────────────────
  // ANOMALY_DETECTION (5 yeni örnek)
  // ──────────────────────────────────────────────────────────
  { user_command: "beklenmedik değerleri işaretle", logic: "mark unexpected anomalous values outlier", category: "anomaly_detection", output: { action: "anomaly_detection", reply: "📊 Beklenmedik değerler işaretlendi", changes: [] } },
  { user_command: "normalden çok sapan verileri bul", logic: "find values deviating from normal range", category: "anomaly_detection", output: { action: "anomaly_detection", reply: "📊 Sapan veriler bulundu", changes: [] } },
  { user_command: "istatistiksel anomali tespiti yap", logic: "statistical anomaly detection z-score method", category: "anomaly_detection", output: { action: "anomaly_detection", method: "zscore", reply: "📊 İstatistiksel anomaliler tespit edildi", changes: [] } },
  { user_command: "şüpheli işlemleri tespit et", logic: "detect suspicious unusual transactions anomaly", category: "anomaly_detection", output: { action: "anomaly_detection", column: "tutar", reply: "📊 Şüpheli işlemler tespit edildi", changes: [] } },
  { user_command: "satış düşüşlerini anomali olarak işaretle", logic: "mark sales drops as anomalies detect", category: "anomaly_detection", output: { action: "anomaly_detection", column: "satış", reply: "📊 Satış anomalileri işaretlendi", changes: [] } },

  // ──────────────────────────────────────────────────────────
  // SENTIMENT_ANALYSIS (5 yeni örnek)
  // ──────────────────────────────────────────────────────────
  { user_command: "ürün yorumlarının duygusunu analiz et", logic: "sentiment analysis product reviews text column", category: "sentiment_analysis", output: { action: "sentiment_analysis", column: "yorum", reply: "📊 Ürün yorum duyguları analiz edildi", changes: [] } },
  { user_command: "memnuniyet anketini analiz et", logic: "satisfaction survey sentiment analysis score", category: "sentiment_analysis", output: { action: "sentiment_analysis", column: "anket", reply: "📊 Memnuniyet anketi analiz edildi", changes: [] } },
  { user_command: "sosyal medya yorumlarını sınıfla", logic: "classify social media comments sentiment positive negative", category: "sentiment_analysis", output: { action: "sentiment_analysis", column: "yorum", reply: "📊 Sosyal medya yorumları analiz edildi", changes: [] } },
  { user_command: "negatif yorumları bul", logic: "find negative sentiment comments reviews filter", category: "sentiment_analysis", output: { action: "sentiment_analysis", filter: "negative", reply: "📊 Negatif yorumlar tespit edildi", changes: [] } },
  { user_command: "müşteri memnuniyeti skoru hesapla", logic: "customer satisfaction sentiment score NPS calculate", category: "sentiment_analysis", output: { action: "sentiment_analysis", output_type: "score", reply: "📊 Müşteri memnuniyet skoru hesaplandı", changes: [] } },

  // ──────────────────────────────────────────────────────────
  // CLASSIFY (5 yeni örnek)
  // ──────────────────────────────────────────────────────────
  { user_command: "fatura türlerine göre sınıflandır", logic: "classify invoices by type category", category: "classify", output: { action: "classify", column: "fatura", reply: "📊 Faturalar türlerine göre sınıflandırıldı", changes: [] } },
  { user_command: "ürünleri ABC analizine göre sınıfla", logic: "ABC analysis classify products inventory pareto", category: "classify", output: { action: "classify", method: "abc", reply: "📊 ABC analizi sınıflandırması yapıldı", changes: [] } },
  { user_command: "risk seviyesine göre sınıflandır", logic: "classify by risk level high medium low", category: "classify", output: { action: "classify", categories: ["Yüksek Risk", "Orta Risk", "Düşük Risk"], reply: "📊 Risk sınıflandırması yapıldı", changes: [] } },
  { user_command: "müşterileri VIP normal pasif olarak etiketle", logic: "label customers VIP normal passive classify segment", category: "classify", output: { action: "classify", categories: ["VIP", "Normal", "Pasif"], reply: "📊 Müşteriler etiketlendi", changes: [] } },
  { user_command: "harcamaları zorunlu isteğe bağlı olarak ayır", logic: "classify expenses mandatory optional separate", category: "classify", output: { action: "classify", categories: ["Zorunlu", "İsteğe Bağlı"], reply: "📊 Harcamalar sınıflandırıldı", changes: [] } },

  // ──────────────────────────────────────────────────────────
  // EXTRACT (4 yeni örnek)
  // ──────────────────────────────────────────────────────────
  { user_command: "IBAN numaralarını çıkar", logic: "extract IBAN bank account numbers from text", category: "extract", output: { action: "extract", type: "iban", reply: "✓ IBAN numaraları çıkarıldı", changes: [] } },
  { user_command: "tarih aralıklarını metinden ayıkla", logic: "extract date ranges from text column", category: "extract", output: { action: "extract", type: "date_range", reply: "✓ Tarih aralıkları ayıklandı", changes: [] } },
  { user_command: "tutarları metinden çıkar", logic: "extract monetary amounts currency values from text", category: "extract", output: { action: "extract", type: "amount", reply: "✓ Tutarlar metinden çıkarıldı", changes: [] } },
  { user_command: "plakaları bul ve listele", logic: "extract Turkish license plate numbers find list", category: "extract", output: { action: "extract", type: "plate", reply: "✓ Plakalar bulundu ve listelendi", changes: [] } },

"""

# Find closing ]; of EXCEL_DATASET (just before COLOR_MAP comment)
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
