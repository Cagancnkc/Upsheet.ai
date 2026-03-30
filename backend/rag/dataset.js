const EXCEL_DATASET = [

  {
    user_command: "A sütununu küçükten büyüğe sırala",
    logic: "sort column A ascending by numeric or text value",
    category: "sorting",
    output: { action: "sort", column: 0, direction: "asc", changes: [], reply: "✓ A sütunu küçükten büyüğe sıralandı" }
  },
  {
    user_command: "A sütununu büyükten küçüğe sırala",
    logic: "sort column A descending",
    category: "sorting",
    output: { action: "sort", column: 0, direction: "desc", changes: [], reply: "✓ A sütunu büyükten küçüğe sıralandı" }
  },
  {
    user_command: "B sütununu büyükten küçüğe sırala",
    logic: "sort column B descending",
    category: "sorting",
    output: { action: "sort", column: 1, direction: "desc", changes: [], reply: "✓ B sütunu büyükten küçüğe sıralandı" }
  },
  {
    user_command: "Müşteri listesini alfabetik sırala",
    logic: "sort customer name column alphabetically A to Z",
    category: "sorting",
    output: { action: "sort", column: 0, direction: "asc", type: "text", changes: [], reply: "✓ Müşteri listesi alfabetik sıralandı" }
  },
  {
    user_command: "Tarihe göre en eskiden yeniye sırala",
    logic: "sort date column ascending from oldest to newest",
    category: "sorting",
    output: { action: "sort", column: "date", direction: "asc", changes: [], reply: "✓ Tarihler eskiden yeniye sıralandı" }
  },
  {
    user_command: "Tarihe göre en yeniden eskiye sırala",
    logic: "sort date column descending from newest to oldest",
    category: "sorting",
    output: { action: "sort", column: "date", direction: "desc", changes: [], reply: "✓ Tarihler yeniden eskiye sıralandı" }
  },
  {
    user_command: "Fiyata göre büyükten küçüğe sırala",
    logic: "sort price column descending",
    category: "sorting",
    output: { action: "sort", column: "price", direction: "desc", changes: [], reply: "✓ Fiyata göre büyükten küçüğe sıralandı" }
  },
  {
    user_command: "Siparişleri teslim tarihine göre sırala",
    logic: "sort orders by delivery date ascending",
    category: "sorting",
    output: { action: "sort", column: "delivery_date", direction: "asc", changes: [], reply: "✓ Siparişler teslim tarihine göre sıralandı" }
  },
  {
    user_command: "Satışları büyükten küçüğe sırala",
    logic: "sort sales column descending",
    category: "sorting",
    output: { action: "sort", column: "sales", direction: "desc", changes: [], reply: "✓ Satışlar büyükten küçüğe sıralandı" }
  },
  {
    user_command: "Ürünleri stok miktarına göre sırala",
    logic: "sort products by stock quantity ascending",
    category: "sorting",
    output: { action: "sort", column: "stock", direction: "asc", changes: [], reply: "✓ Ürünler stok miktarına göre sıralandı" }
  },

  // ══════════════════════════════════════
  // FİLTRELEME (FILTERING)
  // ══════════════════════════════════════
  {
    user_command: "Sıfırdan büyük olanları göster",
    logic: "filter rows where value is greater than 0",
    category: "filtering",
    output: { action: "filter", condition: "value > 0", changes: [], reply: "✓ Sıfırdan büyük değerler filtrelendi" }
  },
  {
    user_command: "1000 liradan büyük tutarları göster",
    logic: "filter rows where amount is greater than 1000",
    category: "filtering",
    output: { action: "filter", condition: "value > 1000", changes: [], reply: "✓ 1.000 TL üzeri tutarlar filtrelendi" }
  },
  {
    user_command: "Bu ayın kayıtlarını filtrele",
    logic: "filter records from current month",
    category: "filtering",
    output: { action: "filter", condition: "currentMonth", changes: [], reply: "✓ Bu ayın kayıtları filtrelendi" }
  },
  {
    user_command: "Son 30 günün verilerini göster",
    logic: "filter rows where date is within last 30 days",
    category: "filtering",
    output: { action: "filter", condition: "date >= today-30", changes: [], reply: "✓ Son 30 günün verileri filtrelendi" }
  },
  {
    user_command: "İstanbul'daki müşterileri filtrele",
    logic: "filter rows where city column equals Istanbul",
    category: "filtering",
    output: { action: "filter", condition: "city == 'İstanbul'", changes: [], reply: "✓ İstanbul müşterileri filtrelendi" }
  },
  {
    user_command: "Negatif değerleri filtrele",
    logic: "filter rows where numeric value is less than 0",
    category: "filtering",
    output: { action: "filter", condition: "value < 0", changes: [], reply: "✓ Negatif değerler filtrelendi" }
  },
  {
    user_command: "Tamamlanmış siparişleri göster",
    logic: "filter rows where status column equals completed",
    category: "filtering",
    output: { action: "filter", condition: "status == 'Tamamlandı'", changes: [], reply: "✓ Tamamlanmış siparişler filtrelendi" }
  },
  {
    user_command: "Bekleyen siparişleri göster",
    logic: "filter rows where status is pending",
    category: "filtering",
    output: { action: "filter", condition: "status == 'Bekliyor'", changes: [], reply: "✓ Bekleyen siparişler filtrelendi" }
  },
  {
    user_command: "Stok miktarı 0 olanları göster",
    logic: "filter rows where stock quantity equals zero",
    category: "filtering",
    output: { action: "filter", condition: "value == 0", changes: [], reply: "✓ Stok miktarı sıfır olan ürünler filtrelendi" }
  },
  {
    user_command: "5000 TL üzeri faturaları filtrele",
    logic: "filter invoice rows where total amount exceeds 5000",
    category: "filtering",
    output: { action: "filter", condition: "value > 5000", changes: [], reply: "✓ 5.000 TL üzeri faturalar filtrelendi" }
  },

  // ══════════════════════════════════════
  // HESAPLAMA (CALCULATION)
  // ══════════════════════════════════════
  {
    user_command: "B sütununun toplamını hesapla",
    logic: "calculate sum of all values in column B",
    category: "calculation",
    output: { action: "update_cells", formula: "SUM", source_column: 1, changes: [], reply: "✓ B sütunu toplamı hesaplandı" }
  },
  {
    user_command: "B sütununun toplamını C1'e yaz",
    logic: "sum column B and write result to cell C1",
    category: "calculation",
    output: { action: "update_cells", formula: "SUM", source_column: 1, target: { row: 0, col: 2 }, changes: [{ row: 0, col: 2, value: "=SUM(B:B)" }], reply: "✓ B sütunu toplamı C1'e yazıldı" }
  },
  {
    user_command: "A sütununun ortalamasını hesapla",
    logic: "calculate average of column A",
    category: "calculation",
    output: { action: "update_cells", formula: "AVERAGE", source_column: 0, changes: [], reply: "✓ A sütunu ortalaması hesaplandı" }
  },
  {
    user_command: "En büyük değeri bul",
    logic: "find maximum value in the dataset",
    category: "calculation",
    output: { action: "highlight", condition: "maxValue", color: "#bbf7d0", changes: [], reply: "✓ En büyük değer yeşile işaretlendi" }
  },
  {
    user_command: "En küçük değeri bul",
    logic: "find minimum value in the dataset",
    category: "calculation",
    output: { action: "highlight", condition: "minValue", color: "#bfdbfe", changes: [], reply: "✓ En küçük değer maviye işaretlendi" }
  },
  {
    user_command: "En yüksek 5 değeri göster",
    logic: "find and highlight top 5 values",
    category: "calculation",
    output: { action: "highlight", condition: "top5", color: "#bbf7d0", changes: [], reply: "✓ En yüksek 5 değer yeşile boyandı" }
  },
  {
    user_command: "En düşük 5 değeri göster",
    logic: "find and highlight bottom 5 values",
    category: "calculation",
    output: { action: "highlight", condition: "bottom5", color: "#fecaca", changes: [], reply: "✓ En düşük 5 değer kırmızıya boyandı" }
  },
  {
    user_command: "Satır sayısını söyle",
    logic: "count total number of data rows",
    category: "calculation",
    output: { action: "message", changes: [], reply: "📊 Toplam satır sayısı hesaplandı" }
  },
  {
    user_command: "Ortalamanın üzerindeki değerleri işaretle",
    logic: "highlight cells where value is above average",
    category: "calculation",
    output: { action: "highlight", condition: "aboveAverage", color: "#bbf7d0", changes: [], reply: "✓ Ortalama üzeri değerler yeşile işaretlendi" }
  },
  {
    user_command: "Ortalamanın altındaki değerleri işaretle",
    logic: "highlight cells where value is below average",
    category: "calculation",
    output: { action: "highlight", condition: "belowAverage", color: "#fecaca", changes: [], reply: "✓ Ortalama altı değerler kırmızıya işaretlendi" }
  },
  {
    user_command: "Kar marjını hesapla",
    logic: "calculate profit margin: (revenue - cost) / revenue * 100",
    category: "calculation",
    output: { action: "update_cells", formula: "profit_margin", changes: [], reply: "✓ Kâr marjları hesaplandı" }
  },
  {
    user_command: "Kümülatif toplam hesapla",
    logic: "calculate running cumulative sum column",
    category: "calculation",
    output: { action: "update_cells", formula: "cumulative_sum", changes: [], reply: "✓ Kümülatif toplam hesaplandı" }
  },
  {
    user_command: "Yüzde değişimi hesapla",
    logic: "calculate percentage change between two consecutive values",
    category: "calculation",
    output: { action: "update_cells", formula: "percentage_change", changes: [], reply: "✓ Yüzde değişimleri hesaplandı" }
  },
  {
    user_command: "C sütununun karesini al",
    logic: "square all values in column C",
    category: "calculation",
    output: { action: "update_cells", formula: "POWER", exponent: 2, column: 2, changes: [], reply: "✓ C sütunu değerlerinin kareleri hesaplandı" }
  },
  {
    user_command: "Standart sapmayı hesapla",
    logic: "calculate standard deviation of numeric column",
    category: "calculation",
    output: { action: "message", formula: "STDEV", changes: [], reply: "📊 Standart sapma hesaplandı" }
  },

  // ══════════════════════════════════════
  // MUHASEBE (FINANCE / ACCOUNTING)
  // ══════════════════════════════════════
  {
    user_command: "KDV dahil fiyatları hesapla",
    logic: "add 20% VAT to all prices: price * 1.20",
    category: "finance",
    output: { action: "update_cells", formula: "multiply", factor: 1.20, changes: [], reply: "✓ KDV (%20) eklenerek fiyatlar güncellendi" }
  },
  {
    user_command: "KDV hariç fiyatları bul",
    logic: "remove 20% VAT: price / 1.20",
    category: "finance",
    output: { action: "update_cells", formula: "divide", factor: 1.20, changes: [], reply: "✓ KDV (%20) düşülerek net fiyatlar hesaplandı" }
  },
  {
    user_command: "KDV tutarını ayrı sütuna yaz",
    logic: "calculate VAT amount separately: price * 0.20",
    category: "finance",
    output: { action: "update_cells", formula: "multiply", factor: 0.20, newColumn: "KDV Tutarı", changes: [], reply: "✓ KDV tutarları ayrı sütuna yazıldı" }
  },
  {
    user_command: "İndirimli KDV hesapla yüzde 10",
    logic: "apply reduced VAT rate of 10%: price * 1.10",
    category: "finance",
    output: { action: "update_cells", formula: "multiply", factor: 1.10, changes: [], reply: "✓ İndirimli KDV (%10) eklendi" }
  },
  {
    user_command: "Net maaşları hesapla",
    logic: "calculate net salary after SGK 14% and income tax 15% deductions",
    category: "finance",
    output: { action: "update_cells", formula: "net_salary", changes: [], reply: "✓ Net maaşlar hesaplandı (SGK+vergi sonrası)" }
  },
  {
    user_command: "SGK işçi payını hesapla",
    logic: "calculate employee SGK: gross * 0.14",
    category: "finance",
    output: { action: "update_cells", formula: "multiply", factor: 0.14, changes: [], reply: "✓ SGK işçi payı (%14) hesaplandı" }
  },
  {
    user_command: "SGK işveren payını hesapla",
    logic: "calculate employer SGK contribution: gross * 0.205",
    category: "finance",
    output: { action: "update_cells", formula: "multiply", factor: 0.205, changes: [], reply: "✓ SGK işveren payı (%20.5) hesaplandı" }
  },
  {
    user_command: "Gelir vergisi hesapla",
    logic: "calculate Turkish income tax with progressive brackets 15/20/27/35/40%",
    category: "finance",
    output: { action: "update_cells", formula: "income_tax_tr", changes: [], reply: "✓ Gelir vergisi Türk dilimlerine göre hesaplandı" }
  },
  {
    user_command: "Fatura toplamını hesapla",
    logic: "calculate invoice total: quantity * unit_price + VAT",
    category: "finance",
    output: { action: "update_cells", formula: "invoice_total", changes: [], reply: "✓ Fatura toplamları hesaplandı" }
  },
  {
    user_command: "Kasa dengesini hesapla",
    logic: "calculate cash balance: opening + income - expenses",
    category: "finance",
    output: { action: "update_cells", formula: "cash_balance", changes: [], reply: "✓ Kasa dengesi hesaplandı" }
  },
  {
    user_command: "Aylık gelir gider tablosu çıkar",
    logic: "create monthly income expense summary report",
    category: "finance",
    output: { action: "message", changes: [], reply: "📊 Aylık gelir-gider tablosu hazırlandı" }
  },
  {
    user_command: "Kıdem tazminatını hesapla",
    logic: "calculate severance pay: years_of_service * monthly_gross",
    category: "finance",
    output: { action: "update_cells", formula: "severance_pay", changes: [], reply: "✓ Kıdem tazminatı hesaplandı" }
  },
  {
    user_command: "Stok değerini hesapla",
    logic: "calculate stock value: quantity * unit_cost",
    category: "finance",
    output: { action: "update_cells", formula: "multiply", changes: [], reply: "✓ Stok değerleri hesaplandı" }
  },
  {
    user_command: "Borç alacak bakiyesini hesapla",
    logic: "calculate debit credit balance for accounting ledger",
    category: "finance",
    output: { action: "update_cells", formula: "debit_credit_balance", changes: [], reply: "✓ Borç-Alacak bakiyesi hesaplandı" }
  },
  {
    user_command: "İskonto uygula yüzde 15",
    logic: "apply 15% discount: price * 0.85",
    category: "finance",
    output: { action: "update_cells", formula: "multiply", factor: 0.85, changes: [], reply: "✓ %15 iskonto uygulandı" }
  },

  // ══════════════════════════════════════
  // TEMİZLEME (CLEANING)
  // ══════════════════════════════════════
  {
    user_command: "Boş satırları sil",
    logic: "delete all completely empty rows",
    category: "cleaning",
    output: { action: "delete_rows", condition: "isEmpty", changes: [], reply: "✓ Boş satırlar silindi" }
  },
  {
    user_command: "Tekrar eden satırları kaldır",
    logic: "remove duplicate rows keeping first occurrence",
    category: "cleaning",
    output: { action: "remove_duplicates", changes: [], reply: "✓ Tekrar eden satırlar kaldırıldı" }
  },
  {
    user_command: "Baştaki ve sondaki boşlukları temizle",
    logic: "trim leading and trailing whitespace from all text cells",
    category: "cleaning",
    output: { action: "update_cells", transform: "trim", changes: [], reply: "✓ Fazla boşluklar temizlendi" }
  },
  {
    user_command: "Boş hücreleri sıfır ile doldur",
    logic: "fill empty numeric cells with 0",
    category: "cleaning",
    output: { action: "update_cells", condition: "isEmpty", value: "0", changes: [], reply: "✓ Boş hücreler sıfır ile dolduruldu" }
  },
  {
    user_command: "Boş hücreleri çizgi ile doldur",
    logic: "fill empty cells with dash character",
    category: "cleaning",
    output: { action: "update_cells", condition: "isEmpty", value: "-", changes: [], reply: "✓ Boş hücreler çizgi ile dolduruldu" }
  },
  {
    user_command: "Sayı olarak saklanan metinleri düzelt",
    logic: "convert text-formatted numbers to actual numeric values",
    category: "cleaning",
    output: { action: "update_cells", transform: "textToNumber", changes: [], reply: "✓ Metin formatındaki sayılar düzeltildi" }
  },
  {
    user_command: "Tarihleri standart formata çevir",
    logic: "convert all dates to DD.MM.YYYY Turkish standard format",
    category: "cleaning",
    output: { action: "update_cells", transform: "formatDate", format: "DD.MM.YYYY", changes: [], reply: "✓ Tarihler GG.AA.YYYY formatına çevrildi" }
  },
  {
    user_command: "Telefon numaralarını formatla",
    logic: "format phone numbers to +90 XXX XXX XX XX",
    category: "cleaning",
    output: { action: "update_cells", transform: "formatPhone", changes: [], reply: "✓ Telefon numaraları formatlandı" }
  },
  {
    user_command: "E-posta adreslerini küçük harfe çevir",
    logic: "convert all email addresses to lowercase",
    category: "cleaning",
    output: { action: "update_cells", transform: "toLowerCase", condition: "isEmail", changes: [], reply: "✓ E-posta adresleri küçük harfe çevrildi" }
  },
  {
    user_command: "Stok miktarı 0 olan ürünleri sil",
    logic: "delete rows where stock quantity equals 0",
    category: "cleaning",
    output: { action: "delete_rows", condition: "value == 0", changes: [], reply: "✓ Stok miktarı sıfır olan satırlar silindi" }
  },
  {
    user_command: "Yazdırılamayan karakterleri temizle",
    logic: "remove non-printable and invisible characters from cells",
    category: "cleaning",
    output: { action: "update_cells", transform: "cleanChars", changes: [], reply: "✓ Yazdırılamayan karakterler temizlendi" }
  },
  {
    user_command: "Tüm formülleri değerlere dönüştür",
    logic: "replace all formulas with their calculated static values",
    category: "cleaning",
    output: { action: "update_cells", transform: "formulaToValue", changes: [], reply: "✓ Formüller değerlere dönüştürüldü" }
  },

  // ══════════════════════════════════════
  // RENKLENDİRME (HIGHLIGHTING)
  // ══════════════════════════════════════
  {
    user_command: "Negatif değerleri kırmızıya boya",
    logic: "highlight all negative numbers red",
    category: "highlighting",
    output: { action: "highlight", condition: "value < 0", color: "#fecaca", changes: [], reply: "✓ Negatif değerler kırmızıya boyandı" }
  },
  {
    user_command: "Pozitif değerleri yeşile boya",
    logic: "highlight all positive numbers green",
    category: "highlighting",
    output: { action: "highlight", condition: "value > 0", color: "#bbf7d0", changes: [], reply: "✓ Pozitif değerler yeşile boyandı" }
  },
  {
    user_command: "1000'in altındakileri kırmızıya boya",
    logic: "highlight cells where value is less than 1000 in red",
    category: "highlighting",
    output: { action: "highlight", condition: "value < 1000", color: "#fecaca", changes: [], reply: "✓ 1.000 altındaki değerler kırmızıya boyandı" }
  },
  {
    user_command: "Boş hücreleri sarıya boya",
    logic: "highlight all empty cells yellow",
    category: "highlighting",
    output: { action: "highlight", condition: "isEmpty", color: "#fef08a", changes: [], reply: "✓ Boş hücreler sarıya boyandı" }
  },
  {
    user_command: "Hata içeren hücreleri işaretle",
    logic: "highlight cells containing formula errors",
    category: "highlighting",
    output: { action: "highlight", condition: "hasError", color: "#fecaca", changes: [], reply: "✓ Hatalı hücreler kırmızıya işaretlendi" }
  },
  {
    user_command: "Renkleri temizle",
    logic: "remove all cell background highlights and colors",
    category: "highlighting",
    output: { action: "clear_highlights", changes: [], reply: "✓ Tüm renkler temizlendi" }
  },
  {
    user_command: "Süresi geçmiş faturaları kırmızıya boya",
    logic: "highlight invoice rows where due date is past today",
    category: "highlighting",
    output: { action: "highlight", condition: "pastDue", color: "#fecaca", changes: [], reply: "✓ Süresi geçmiş faturalar kırmızıya boyandı" }
  },
  {
    user_command: "Bu haftaki kayıtları sarıya boya",
    logic: "highlight rows where date falls in current week",
    category: "highlighting",
    output: { action: "highlight", condition: "thisWeek", color: "#fef08a", changes: [], reply: "✓ Bu haftaki kayıtlar sarıya boyandı" }
  },
  {
    user_command: "Stok miktarı 10'un altındakileri işaretle",
    logic: "highlight rows where stock quantity is below 10",
    category: "highlighting",
    output: { action: "highlight", condition: "value < 10", color: "#fecaca", changes: [], reply: "✓ Düşük stoklu ürünler kırmızıya işaretlendi" }
  },
  {
    user_command: "Çift girişleri sarıya boya",
    logic: "highlight duplicate entries yellow",
    category: "highlighting",
    output: { action: "highlight", condition: "isDuplicate", color: "#fef08a", changes: [], reply: "✓ Çift girişler sarıya boyandı" }
  },
  {
    user_command: "Satış hedefine ulaşanları yeşile boya",
    logic: "highlight rows where actual sales meets or exceeds target",
    category: "highlighting",
    output: { action: "highlight", condition: "meetsTarget", color: "#bbf7d0", changes: [], reply: "✓ Hedefe ulaşanlar yeşile boyandı" }
  },
  {
    user_command: "Geciken siparişleri kırmızıya boya",
    logic: "highlight orders where delivery date has passed without completion",
    category: "highlighting",
    output: { action: "highlight", condition: "pastDelivery", color: "#fecaca", changes: [], reply: "✓ Geciken siparişler kırmızıya boyandı" }
  },

  // ══════════════════════════════════════
  // BİÇİMLENDİRME (FORMATTING)
  // ══════════════════════════════════════
  {
    user_command: "A sütununu büyük harfe çevir",
    logic: "convert all text in column A to uppercase",
    category: "formatting",
    output: { action: "update_cells", transform: "toUpperCase", column: 0, changes: [], reply: "✓ A sütunu büyük harfe çevrildi" }
  },
  {
    user_command: "A sütununu küçük harfe çevir",
    logic: "convert all text in column A to lowercase",
    category: "formatting",
    output: { action: "update_cells", transform: "toLowerCase", column: 0, changes: [], reply: "✓ A sütunu küçük harfe çevrildi" }
  },
  {
    user_command: "İlk harfleri büyük yap",
    logic: "capitalize first letter of each word - title case",
    category: "formatting",
    output: { action: "update_cells", transform: "toTitleCase", changes: [], reply: "✓ İlk harfler büyük yapıldı" }
  },
  {
    user_command: "Sayıları para birimi formatına çevir",
    logic: "format numbers as Turkish currency with TL symbol",
    category: "formatting",
    output: { action: "update_cells", transform: "formatCurrency", symbol: "₺", changes: [], reply: "✓ Sayılar ₺ formatına çevrildi" }
  },
  {
    user_command: "Sayıları yüzde formatına çevir",
    logic: "format decimal numbers as percentage values",
    category: "formatting",
    output: { action: "update_cells", transform: "formatPercent", changes: [], reply: "✓ Sayılar yüzde formatına çevrildi" }
  },
  {
    user_command: "Ondalık basamakları 2 ile sınırla",
    logic: "round all numbers to 2 decimal places",
    category: "formatting",
    output: { action: "update_cells", transform: "round", decimals: 2, changes: [], reply: "✓ Sayılar 2 ondalık basamağa yuvarlandı" }
  },
  {
    user_command: "Sayıları binlik ayraçla formatla",
    logic: "format numbers with thousand separator: 1.000.000",
    category: "formatting",
    output: { action: "update_cells", transform: "formatThousands", changes: [], reply: "✓ Sayılar binlik ayraçla formatlandı" }
  },

  // ══════════════════════════════════════
  // METİN İŞLEMLERİ (TEXT)
  // ══════════════════════════════════════
  {
    user_command: "Ad ve soyad sütunlarını birleştir",
    logic: "merge first name and last name columns into full name",
    category: "text",
    output: { action: "merge_columns", separator: " ", changes: [], reply: "✓ Ad ve soyad birleştirildi" }
  },
  {
    user_command: "Sütunu virgüle göre böl",
    logic: "split column by comma delimiter into multiple columns",
    category: "text",
    output: { action: "split_column", delimiter: ",", changes: [], reply: "✓ Sütun virgüle göre bölündü" }
  },
  {
    user_command: "Sütunu ad ve soyad olarak böl",
    logic: "split full name column into first and last name by space",
    category: "text",
    output: { action: "split_column", delimiter: " ", into: ["Ad", "Soyad"], changes: [], reply: "✓ Ad ve soyad ayrı sütunlara ayrıldı" }
  },
  {
    user_command: "Metinden sayıları çıkar",
    logic: "extract only numeric values from text cells",
    category: "text",
    output: { action: "update_cells", transform: "extractNumbers", changes: [], reply: "✓ Metinden sayılar çıkarıldı" }
  },
  {
    user_command: "E-posta adresinden domain çıkar",
    logic: "extract domain name from email after @ symbol",
    category: "text",
    output: { action: "update_cells", transform: "extractDomain", changes: [], reply: "✓ E-posta domain'leri çıkarıldı" }
  },
  {
    user_command: "Belirli bir metni bul ve değiştir",
    logic: "find and replace specific text string across all cells",
    category: "text",
    output: { action: "find_replace", changes: [], reply: "✓ Metin arandı ve değiştirildi" }
  },
  {
    user_command: "Ürün kodlarını büyük harfe çevir",
    logic: "convert product codes to uppercase for standardization",
    category: "text",
    output: { action: "update_cells", transform: "toUpperCase", changes: [], reply: "✓ Ürün kodları büyük harfe çevrildi" }
  },

  // ══════════════════════════════════════
  // ANALİZ VE RAPOR (ANALYSIS)
  // ══════════════════════════════════════
  {
    user_command: "Verilerin özetini çıkar",
    logic: "generate summary statistics: count, sum, average, min, max",
    category: "analysis",
    output: { action: "message", changes: [], reply: "📊 Veri özeti: toplam, ortalama, min, max hesaplandı" }
  },
  {
    user_command: "Aylık satış raporu hazırla",
    logic: "group sales data by month and calculate monthly totals",
    category: "analysis",
    output: { action: "message", changes: [], reply: "📊 Aylık satış raporu hazırlandı" }
  },
  {
    user_command: "Bu ayın en çok satan ürününü bul",
    logic: "find product with highest sales this month",
    category: "analysis",
    output: { action: "highlight", condition: "maxValue", color: "#bbf7d0", changes: [], reply: "✓ En çok satan ürün işaretlendi" }
  },
  {
    user_command: "Kategori bazında grupla",
    logic: "group and summarize data by category column",
    category: "analysis",
    output: { action: "message", changes: [], reply: "📊 Veriler kategori bazında gruplandı" }
  },
  {
    user_command: "Anomali tespit et",
    logic: "detect statistical outliers using IQR method",
    category: "analysis",
    output: { action: "highlight", condition: "isOutlier", color: "#fecaca", changes: [], reply: "✓ Anomaliler kırmızıya işaretlendi" }
  },
  {
    user_command: "Geçen aya göre karşılaştır",
    logic: "compare current month totals vs previous month",
    category: "analysis",
    output: { action: "message", changes: [], reply: "📊 Aylık karşılaştırma tamamlandı" }
  },
  {
    user_command: "Pivot tablo oluştur",
    logic: "create pivot table summary from raw data",
    category: "analysis",
    output: { action: "message", changes: [], reply: "📊 Özet (pivot) tablo oluşturuldu" }
  },
  {
    user_command: "Müşteri segmentasyonu yap",
    logic: "segment customers into High/Medium/Low by purchase amount",
    category: "analysis",
    output: { action: "update_cells", transform: "segment", bins: ["Düşük", "Orta", "Yüksek"], changes: [], reply: "✓ Müşteriler 3 segmente ayrıldı" }
  },
  {
    user_command: "En karlı ürünü bul",
    logic: "rank products by profit margin descending",
    category: "analysis",
    output: { action: "sort", column: "profit", direction: "desc", changes: [], reply: "✓ Ürünler kâr marjına göre sıralandı" }
  },
  {
    user_command: "Trend analizi yap",
    logic: "analyze data trends over time and identify patterns",
    category: "analysis",
    output: { action: "message", changes: [], reply: "📊 Trend analizi tamamlandı" }
  },

  // ══════════════════════════════════════
  // GELİŞMİŞ FORMÜLLER (FORMULAS)
  // ══════════════════════════════════════
  {
    user_command: "DÜŞEY ARA formülü oluştur",
    logic: "create VLOOKUP formula to match data between tables",
    category: "formula",
    output: { action: "update_cells", formula: "VLOOKUP", changes: [], reply: "✓ DÜŞEY ARA (VLOOKUP) formülü oluşturuldu" }
  },
  {
    user_command: "Koşullu toplam hesapla ETOPLA",
    logic: "calculate conditional sum using SUMIF",
    category: "formula",
    output: { action: "update_cells", formula: "SUMIF", changes: [], reply: "✓ Koşullu toplam (ETOPLA) hesaplandı" }
  },
  {
    user_command: "Koşullu sayım yap EĞERSAY",
    logic: "count cells meeting specific criteria using COUNTIF",
    category: "formula",
    output: { action: "update_cells", formula: "COUNTIF", changes: [], reply: "✓ Koşullu sayım (EĞERSAY) yapıldı" }
  },
  {
    user_command: "Eğer formülü ekle",
    logic: "add IF formula for conditional value assignment",
    category: "formula",
    output: { action: "update_cells", formula: "IF", changes: [], reply: "✓ EĞER formülü eklendi" }
  },
  {
    user_command: "İki tabloyu birleştir",
    logic: "merge two data tables based on common key column",
    category: "formula",
    output: { action: "merge_tables", changes: [], reply: "✓ İki tablo birleştirildi" }
  },
  {
    user_command: "Metni sayıya çevir",
    logic: "convert text strings to numeric values using VALUE formula",
    category: "formula",
    output: { action: "update_cells", formula: "VALUE", transform: "textToNumber", changes: [], reply: "✓ Metin sayıya çevrildi" }
  },
  {
    user_command: "Sayıyı metne çevir",
    logic: "convert numeric values to text using TEXT formula",
    category: "formula",
    output: { action: "update_cells", formula: "TEXT", transform: "numberToText", changes: [], reply: "✓ Sayı metne çevrildi" }
  },
  {
    user_command: "Karakter sayısını hesapla",
    logic: "count characters in each cell using LEN function",
    category: "formula",
    output: { action: "update_cells", formula: "LEN", changes: [], reply: "✓ Karakter sayıları hesaplandı" }
  },
  {
    user_command: "İlk 5 karakteri al",
    logic: "extract first 5 characters from text cells using LEFT",
    category: "formula",
    output: { action: "update_cells", formula: "LEFT", count: 5, changes: [], reply: "✓ İlk 5 karakter alındı" }
  },
  {
    user_command: "Bugünün tarihini ekle",
    logic: "insert today's date using TODAY() function",
    category: "formula",
    output: { action: "update_cells", formula: "TODAY", changes: [{ row: 0, col: 0, value: "=TODAY()" }], reply: "✓ Bugünün tarihi eklendi" }
  },

  // ══════════════════════════════════════
  // GRAFİK VE GÖRSELLEŞTİRME (CHARTS)
  // ══════════════════════════════════════
  {
    user_command: "Çubuk grafik oluştur",
    logic: "create bar chart from selected data range",
    category: "chart",
    output: { action: "create_chart", type: "bar", changes: [], reply: "✓ Çubuk grafik oluşturuldu" }
  },
  {
    user_command: "Çizgi grafik oluştur",
    logic: "create line chart to show trends over time",
    category: "chart",
    output: { action: "create_chart", type: "line", changes: [], reply: "✓ Çizgi grafik oluşturuldu" }
  },
  {
    user_command: "Pasta grafik oluştur",
    logic: "create pie chart to show proportions",
    category: "chart",
    output: { action: "create_chart", type: "pie", changes: [], reply: "✓ Pasta grafik oluşturuldu" }
  },
  {
    user_command: "Aylık satışların grafiğini çiz",
    logic: "create monthly sales bar chart with months on x-axis",
    category: "chart",
    output: { action: "create_chart", type: "bar", title: "Aylık Satışlar", changes: [], reply: "✓ Aylık satış grafiği oluşturuldu" }
  },
  {
    user_command: "Gelir gider grafiği yap",
    logic: "create grouped bar chart comparing income and expenses",
    category: "chart",
    output: { action: "create_chart", type: "grouped_bar", title: "Gelir-Gider Karşılaştırması", changes: [], reply: "✓ Gelir-Gider grafiği oluşturuldu" }
  },
  {
    user_command: "Dağılım grafiği oluştur",
    logic: "create scatter plot to show correlation between two variables",
    category: "chart",
    output: { action: "create_chart", type: "scatter", changes: [], reply: "✓ Dağılım grafiği oluşturuldu" }
  },
  {
    user_command: "Alan grafiği oluştur",
    logic: "create area chart to show volume over time",
    category: "chart",
    output: { action: "create_chart", type: "area", changes: [], reply: "✓ Alan grafiği oluşturuldu" }
  },

  // ══════════════════════════════════════
  // STOK VE LOJİSTİK (INVENTORY)
  // ══════════════════════════════════════
  {
    user_command: "Kritik stok seviyesindeki ürünleri işaretle",
    logic: "highlight products below minimum stock threshold",
    category: "inventory",
    output: { action: "highlight", condition: "belowMinStock", color: "#fecaca", changes: [], reply: "✓ Kritik stok seviyeleri kırmızıya işaretlendi" }
  },
  {
    user_command: "Ürün bazında toplam satış hesapla",
    logic: "sum sales quantity grouped by product",
    category: "inventory",
    output: { action: "message", changes: [], reply: "📊 Ürün bazında toplam satışlar hesaplandı" }
  },
  {
    user_command: "Fazla stoğu olan ürünleri göster",
    logic: "filter products where stock exceeds maximum threshold",
    category: "inventory",
    output: { action: "filter", condition: "aboveMaxStock", changes: [], reply: "✓ Fazla stoklu ürünler filtrelendi" }
  },
  {
    user_command: "Tedarikçiye göre grupla",
    logic: "group products by supplier name",
    category: "inventory",
    output: { action: "message", changes: [], reply: "📊 Ürünler tedarikçiye göre gruplandı" }
  },

  // ══════════════════════════════════════
  // GELİŞMİŞ İŞLEMLER (ADVANCED)
  // ══════════════════════════════════════
  {
    user_command: "Veri doğrulama kuralı ekle",
    logic: "add data validation to prevent invalid entries",
    category: "advanced",
    output: { action: "add_validation", changes: [], reply: "✓ Veri doğrulama kuralı eklendi" }
  },
  {
    user_command: "Veriyi transpoze et",
    logic: "transpose data: rows become columns and columns become rows",
    category: "advanced",
    output: { action: "transpose", changes: [], reply: "✓ Veri transpoze edildi" }
  },
  {
    user_command: "Sütun ekle",
    logic: "insert a new empty column",
    category: "advanced",
    output: { action: "insert_column", changes: [], reply: "✓ Yeni sütun eklendi" }
  },
  {
    user_command: "Satır ekle",
    logic: "insert a new empty row",
    category: "advanced",
    output: { action: "insert_row", changes: [], reply: "✓ Yeni satır eklendi" }
  },
  {
    user_command: "İlk satırı dondur",
    logic: "freeze first row as sticky header",
    category: "advanced",
    output: { action: "freeze_row", row: 0, changes: [], reply: "✓ İlk satır donduruldu" }
  },
  {
    user_command: "Seçili hücreye yorum ekle",
    logic: "add a comment or note to selected cell",
    category: "advanced",
    output: { action: "add_comment", changes: [], reply: "✓ Yorum eklendi" }
  },
  {
    user_command: "Sayfayı koru",
    logic: "protect sheet to prevent editing",
    category: "advanced",
    output: { action: "protect_sheet", changes: [], reply: "✓ Sayfa koruması aktifleştirildi" }
  },

  // ══════════════════════════════════════
  // BELİRSİZ KOMUTLAR (FALLBACK)
  // ══════════════════════════════════════
  {
    user_command: "Şunu düzelt",
    logic: "vague command - needs clarification on what to fix",
    category: "unclear",
    output: { action: "message", changes: [], reply: "Hangi sütunu veya satırı düzeltmemi istiyorsunuz? Lütfen açıklar mısınız?" }
  },
  {
    user_command: "Analiz et",
    logic: "vague analysis request - provide basic summary statistics",
    category: "unclear",
    output: { action: "message", changes: [], reply: "📊 Veriyi analiz ediyorum: satır sayısı, ortalama, min ve max hesaplanıyor..." }
  },
  {
    user_command: "Temizle",
    logic: "vague clean request - ask which cleaning operation",
    category: "unclear",
    output: { action: "message", changes: [], reply: "Hangi temizleme işlemini yapmamı istersiniz? Boş satırları silmek mi, tekrarları kaldırmak mı, yoksa boşlukları temizlemek mi?" }
  },
  {
    user_command: "Düzenle",
    logic: "vague edit request - needs more specific information",
    category: "unclear",
    output: { action: "message", changes: [], reply: "Ne yapmamı istediğinizi biraz daha açıklar mısınız? Hangi sütun veya işlemi kastediyorsunuz?" }
  },

  // ══════════════════════════════════════
  // SIRALAMA EK KOMUTLAR (SORTING EXTRA)
  // ══════════════════════════════════════
  {
    user_command: "C sütununu küçükten büyüğe sırala",
    logic: "sort column C ascending",
    category: "sorting",
    output: { action: "sort", column: 2, direction: "asc", changes: [], reply: "✓ C sütunu küçükten büyüğe sıralandı" }
  },
  {
    user_command: "D sütununu büyükten küçüğe sırala",
    logic: "sort column D descending",
    category: "sorting",
    output: { action: "sort", column: 3, direction: "desc", changes: [], reply: "✓ D sütunu büyükten küçüğe sıralandı" }
  },
  {
    user_command: "Çalışanları maaşa göre sırala",
    logic: "sort employees by salary column descending",
    category: "sorting",
    output: { action: "sort", column: "salary", direction: "desc", changes: [], reply: "✓ Çalışanlar maaşa göre sıralandı" }
  },
  {
    user_command: "Notları yüksekten düşüğe sırala",
    logic: "sort grades descending from highest to lowest",
    category: "sorting",
    output: { action: "sort", column: "grade", direction: "desc", changes: [], reply: "✓ Notlar yüksekten düşüğe sıralandı" }
  },
  {
    user_command: "Şehirleri alfabetik sırala",
    logic: "sort city column alphabetically ascending",
    category: "sorting",
    output: { action: "sort", column: "city", direction: "asc", type: "text", changes: [], reply: "✓ Şehirler alfabetik sıralandı" }
  },
  {
    user_command: "Çoklu sütuna göre sırala ad ve soyada göre",
    logic: "multi-column sort by first name then last name",
    category: "sorting",
    output: { action: "sort", columns: ["firstname", "lastname"], directions: ["asc", "asc"], changes: [], reply: "✓ Ad ve soyada göre çoklu sıralama yapıldı" }
  },
  {
    user_command: "E sütununu küçükten büyüğe sırala",
    logic: "sort column E ascending",
    category: "sorting",
    output: { action: "sort", column: 4, direction: "asc", changes: [], reply: "✓ E sütunu küçükten büyüğe sıralandı" }
  },
  {
    user_command: "Ürünleri ada göre alfabetik sırala",
    logic: "sort product name column alphabetically",
    category: "sorting",
    output: { action: "sort", column: "product_name", direction: "asc", type: "text", changes: [], reply: "✓ Ürünler ada göre sıralandı" }
  },

  // ══════════════════════════════════════
  // FİLTRELEME EK KOMUTLAR (FILTERING EXTRA)
  // ══════════════════════════════════════
  {
    user_command: "Sadece aktif kayıtları göster",
    logic: "filter rows where status is active",
    category: "filtering",
    output: { action: "filter", condition: "status == 'Aktif'", changes: [], reply: "✓ Aktif kayıtlar filtrelendi" }
  },
  {
    user_command: "Pasif müşterileri filtrele",
    logic: "filter rows where customer status is inactive",
    category: "filtering",
    output: { action: "filter", condition: "status == 'Pasif'", changes: [], reply: "✓ Pasif müşteriler filtrelendi" }
  },
  {
    user_command: "2024 yılına ait verileri göster",
    logic: "filter rows where year equals 2024",
    category: "filtering",
    output: { action: "filter", condition: "year == 2024", changes: [], reply: "✓ 2024 yılı verileri filtrelendi" }
  },
  {
    user_command: "500 ile 1000 arasındaki değerleri göster",
    logic: "filter rows where value is between 500 and 1000",
    category: "filtering",
    output: { action: "filter", condition: "value >= 500 && value <= 1000", changes: [], reply: "✓ 500-1000 arasındaki değerler filtrelendi" }
  },
  {
    user_command: "Ankara'daki çalışanları göster",
    logic: "filter rows where city equals Ankara",
    category: "filtering",
    output: { action: "filter", condition: "city == 'Ankara'", changes: [], reply: "✓ Ankara'daki çalışanlar filtrelendi" }
  },
  {
    user_command: "İptal edilen siparişleri göster",
    logic: "filter rows where order status is cancelled",
    category: "filtering",
    output: { action: "filter", condition: "status == 'İptal'", changes: [], reply: "✓ İptal edilen siparişler filtrelendi" }
  },
  {
    user_command: "Fiyatı 100 TL altındaki ürünleri göster",
    logic: "filter products where price is less than 100",
    category: "filtering",
    output: { action: "filter", condition: "price < 100", changes: [], reply: "✓ 100 TL altındaki ürünler filtrelendi" }
  },
  {
    user_command: "Boş hücre içeren satırları göster",
    logic: "filter rows that contain at least one empty cell",
    category: "filtering",
    output: { action: "filter", condition: "hasEmptyCell", changes: [], reply: "✓ Boş hücre içeren satırlar filtrelendi" }
  },
  {
    user_command: "Bugünkü siparişleri göster",
    logic: "filter rows where date equals today",
    category: "filtering",
    output: { action: "filter", condition: "date == today", changes: [], reply: "✓ Bugünkü siparişler filtrelendi" }
  },
  {
    user_command: "Geçen hafta eklenen kayıtları göster",
    logic: "filter records added in the previous week",
    category: "filtering",
    output: { action: "filter", condition: "lastWeek", changes: [], reply: "✓ Geçen hafta eklenen kayıtlar filtrelendi" }
  },
  {
    user_command: "Kategorisi elektronik olan ürünleri göster",
    logic: "filter rows where category column equals elektronik",
    category: "filtering",
    output: { action: "filter", condition: "category == 'Elektronik'", changes: [], reply: "✓ Elektronik kategorisi ürünler filtrelendi" }
  },
  {
    user_command: "50'den az stok olan ürünleri göster",
    logic: "filter products where stock is below 50",
    category: "filtering",
    output: { action: "filter", condition: "stock < 50", changes: [], reply: "✓ 50 altı stoklu ürünler filtrelendi" }
  },
  {
    user_command: "Teslim edilmemiş siparişleri göster",
    logic: "filter orders not yet delivered",
    category: "filtering",
    output: { action: "filter", condition: "status != 'Teslim Edildi'", changes: [], reply: "✓ Teslim edilmemiş siparişler filtrelendi" }
  },

  // ══════════════════════════════════════
  // HESAPLAMA EK KOMUTLAR (CALCULATION EXTRA)
  // ══════════════════════════════════════
  {
    user_command: "C sütununun toplamını hesapla",
    logic: "calculate sum of all values in column C",
    category: "calculation",
    output: { action: "update_cells", formula: "SUM", source_column: 2, changes: [], reply: "✓ C sütunu toplamı hesaplandı" }
  },
  {
    user_command: "Satışların ortalamasını hesapla",
    logic: "calculate average of sales column",
    category: "calculation",
    output: { action: "update_cells", formula: "AVERAGE", source_column: "sales", changes: [], reply: "✓ Satış ortalaması hesaplandı" }
  },
  {
    user_command: "Toplam satır sayısını göster",
    logic: "count total number of rows in dataset",
    category: "calculation",
    output: { action: "message", formula: "COUNT", changes: [], reply: "📊 Toplam satır sayısı gösterildi" }
  },
  {
    user_command: "Fiyatları yüzde 10 artır",
    logic: "increase all prices by 10%: price * 1.10",
    category: "calculation",
    output: { action: "update_cells", formula: "multiply", factor: 1.10, changes: [], reply: "✓ Fiyatlar %10 artırıldı" }
  },
  {
    user_command: "Fiyatları yüzde 20 düşür",
    logic: "decrease all prices by 20%: price * 0.80",
    category: "calculation",
    output: { action: "update_cells", formula: "multiply", factor: 0.80, changes: [], reply: "✓ Fiyatlar %20 düşürüldü" }
  },
  {
    user_command: "Toplam geliri hesapla",
    logic: "sum all values in revenue/income column",
    category: "calculation",
    output: { action: "update_cells", formula: "SUM", source_column: "revenue", changes: [], reply: "✓ Toplam gelir hesaplandı" }
  },
  {
    user_command: "Toplam gideri hesapla",
    logic: "sum all values in expense column",
    category: "calculation",
    output: { action: "update_cells", formula: "SUM", source_column: "expense", changes: [], reply: "✓ Toplam gider hesaplandı" }
  },
  {
    user_command: "Net kârı hesapla",
    logic: "calculate net profit: total revenue minus total expenses",
    category: "calculation",
    output: { action: "update_cells", formula: "net_profit", changes: [], reply: "✓ Net kâr hesaplandı" }
  },
  {
    user_command: "Adet ile fiyatı çarp",
    logic: "multiply quantity by unit price to get total",
    category: "calculation",
    output: { action: "update_cells", formula: "multiply_columns", col1: "quantity", col2: "price", changes: [], reply: "✓ Adet × Fiyat = Toplam hesaplandı" }
  },
  {
    user_command: "Ortalama fiyatı hesapla",
    logic: "calculate average price of all products",
    category: "calculation",
    output: { action: "update_cells", formula: "AVERAGE", source_column: "price", changes: [], reply: "✓ Ortalama fiyat hesaplandı" }
  },
  {
    user_command: "Sıralama numarası ekle",
    logic: "add sequential row numbers 1,2,3... in a new column",
    category: "calculation",
    output: { action: "update_cells", formula: "ROW_NUMBER", newColumn: "Sıra No", changes: [], reply: "✓ Sıralama numaraları eklendi" }
  },

  // ══════════════════════════════════════
  // MUHASEBE EK KOMUTLAR (FINANCE EXTRA)
  // ══════════════════════════════════════
  {
    user_command: "Maaş zammı uygula yüzde 25",
    logic: "increase all salaries by 25%: salary * 1.25",
    category: "finance",
    output: { action: "update_cells", formula: "multiply", factor: 1.25, changes: [], reply: "✓ Maaşlara %25 zam uygulandı" }
  },
  {
    user_command: "İşten ayrılma tazminatını hesapla",
    logic: "calculate termination compensation based on years and salary",
    category: "finance",
    output: { action: "update_cells", formula: "termination_pay", changes: [], reply: "✓ Tazminat tutarları hesaplandı" }
  },
  {
    user_command: "Yıllık izin ücreti hesapla",
    logic: "calculate annual leave pay: daily_salary * leave_days",
    category: "finance",
    output: { action: "update_cells", formula: "leave_pay", changes: [], reply: "✓ Yıllık izin ücretleri hesaplandı" }
  },
  {
    user_command: "Brüt ücretten net ücreti hesapla",
    logic: "calculate net from gross: deduct SGK 14% + income tax",
    category: "finance",
    output: { action: "update_cells", formula: "gross_to_net", changes: [], reply: "✓ Brütten nete dönüşüm yapıldı" }
  },
  {
    user_command: "Döviz kuruna göre TL'ye çevir",
    logic: "convert foreign currency to Turkish lira using exchange rate",
    category: "finance",
    output: { action: "update_cells", formula: "currency_convert", to: "TRY", changes: [], reply: "✓ Değerler TL'ye çevrildi" }
  },
  {
    user_command: "USD cinsinden fiyatları TL'ye çevir",
    logic: "convert USD prices to TRY using current exchange rate",
    category: "finance",
    output: { action: "update_cells", formula: "currency_convert", from: "USD", to: "TRY", changes: [], reply: "✓ USD fiyatlar TL'ye çevrildi" }
  },
  {
    user_command: "Euro cinsinden fiyatları TL'ye çevir",
    logic: "convert EUR prices to TRY using current exchange rate",
    category: "finance",
    output: { action: "update_cells", formula: "currency_convert", from: "EUR", to: "TRY", changes: [], reply: "✓ EUR fiyatlar TL'ye çevrildi" }
  },
  {
    user_command: "Amortisman hesapla",
    logic: "calculate straight-line depreciation for fixed assets",
    category: "finance",
    output: { action: "update_cells", formula: "depreciation", method: "straight_line", changes: [], reply: "✓ Amortisman tutarları hesaplandı" }
  },
  {
    user_command: "Faiz hesapla",
    logic: "calculate simple interest: principal * rate * time",
    category: "finance",
    output: { action: "update_cells", formula: "simple_interest", changes: [], reply: "✓ Faiz tutarları hesaplandı" }
  },
  {
    user_command: "Bileşik faiz hesapla",
    logic: "calculate compound interest",
    category: "finance",
    output: { action: "update_cells", formula: "compound_interest", changes: [], reply: "✓ Bileşik faiz hesaplandı" }
  },

  // ══════════════════════════════════════
  // TEMİZLEME EK KOMUTLAR (CLEANING EXTRA)
  // ══════════════════════════════════════
  {
    user_command: "Yinelenen e-posta adreslerini kaldır",
    logic: "remove duplicate email address entries",
    category: "cleaning",
    output: { action: "remove_duplicates", column: "email", changes: [], reply: "✓ Yinelenen e-posta adresleri kaldırıldı" }
  },
  {
    user_command: "Hatalı TC kimlik numaralarını işaretle",
    logic: "highlight invalid Turkish ID numbers that fail checksum",
    category: "cleaning",
    output: { action: "highlight", condition: "invalidTCKN", color: "#fecaca", changes: [], reply: "✓ Hatalı TC kimlik numaraları işaretlendi" }
  },
  {
    user_command: "Fazla satır sonlarını temizle",
    logic: "remove extra newline characters from cells",
    category: "cleaning",
    output: { action: "update_cells", transform: "removeNewlines", changes: [], reply: "✓ Fazla satır sonları temizlendi" }
  },
  {
    user_command: "Özel karakterleri temizle",
    logic: "remove special characters keeping only letters and numbers",
    category: "cleaning",
    output: { action: "update_cells", transform: "removeSpecialChars", changes: [], reply: "✓ Özel karakterler temizlendi" }
  },
  {
    user_command: "Boş olmayan ilk değerle doldur",
    logic: "fill empty cells with the last non-empty value above (forward fill)",
    category: "cleaning",
    output: { action: "update_cells", transform: "forwardFill", changes: [], reply: "✓ Boş hücreler önceki değerle dolduruldu" }
  },
  {
    user_command: "NA değerlerini temizle",
    logic: "remove or replace N/A and NA text values",
    category: "cleaning",
    output: { action: "update_cells", condition: "isNA", value: "", changes: [], reply: "✓ NA değerleri temizlendi" }
  },
  {
    user_command: "Başındaki sıfırları temizle",
    logic: "remove leading zeros from text numbers",
    category: "cleaning",
    output: { action: "update_cells", transform: "removeLeadingZeros", changes: [], reply: "✓ Başındaki sıfırlar temizlendi" }
  },
  {
    user_command: "Tüm hücrelerdeki fazla boşlukları temizle",
    logic: "trim all extra whitespace from every cell",
    category: "cleaning",
    output: { action: "update_cells", transform: "trimAll", changes: [], reply: "✓ Tüm fazla boşluklar temizlendi" }
  },
  {
    user_command: "Bozuk tarih formatlarını düzelt",
    logic: "fix inconsistent date formats and normalize them",
    category: "cleaning",
    output: { action: "update_cells", transform: "fixDates", changes: [], reply: "✓ Tarih formatları düzeltildi" }
  },

  // ══════════════════════════════════════
  // RENKLENDİRME EK KOMUTLAR (HIGHLIGHTING EXTRA)
  // ══════════════════════════════════════
  {
    user_command: "Sıfır değerli hücreleri gri yap",
    logic: "highlight cells with value exactly zero in grey",
    category: "highlighting",
    output: { action: "highlight", condition: "value == 0", color: "#d1d5db", changes: [], reply: "✓ Sıfır değerli hücreler griye boyandı" }
  },
  {
    user_command: "100'ün üzerindeki değerleri maviye boya",
    logic: "highlight cells where value is greater than 100 in blue",
    category: "highlighting",
    output: { action: "highlight", condition: "value > 100", color: "#bfdbfe", changes: [], reply: "✓ 100 üzeri değerler maviye boyandı" }
  },
  {
    user_command: "Bu yıla ait kayıtları yeşile boya",
    logic: "highlight rows where date year equals current year",
    category: "highlighting",
    output: { action: "highlight", condition: "currentYear", color: "#bbf7d0", changes: [], reply: "✓ Bu yılın kayıtları yeşile boyandı" }
  },
  {
    user_command: "Hedefin yüzde 50 altında olanları kırmızıya boya",
    logic: "highlight rows where actual is less than 50% of target",
    category: "highlighting",
    output: { action: "highlight", condition: "below50pctTarget", color: "#fecaca", changes: [], reply: "✓ Hedefin yarısına ulaşamayanlar kırmızıya boyandı" }
  },
  {
    user_command: "Seçili satırı sarıya boya",
    logic: "highlight currently selected row with yellow background",
    category: "highlighting",
    output: { action: "highlight", target: "selectedRow", color: "#fef08a", changes: [], reply: "✓ Seçili satır sarıya boyandı" }
  },
  {
    user_command: "Değeri değişen hücreleri turuncu yap",
    logic: "highlight cells that have been modified",
    category: "highlighting",
    output: { action: "highlight", condition: "isModified", color: "#fed7aa", changes: [], reply: "✓ Değişen hücreler turuncuya boyandı" }
  },
  {
    user_command: "Hafta sonu tarihlerini mavi işaretle",
    logic: "highlight cells where date falls on Saturday or Sunday",
    category: "highlighting",
    output: { action: "highlight", condition: "isWeekend", color: "#bfdbfe", changes: [], reply: "✓ Hafta sonu tarihleri maviye işaretlendi" }
  },

  // ══════════════════════════════════════
  // BİÇİMLENDİRME EK KOMUTLAR (FORMATTING EXTRA)
  // ══════════════════════════════════════
  {
    user_command: "Tarihleri ay gün yıl formatına çevir",
    logic: "format dates as MM/DD/YYYY",
    category: "formatting",
    output: { action: "update_cells", transform: "formatDate", format: "MM/DD/YYYY", changes: [], reply: "✓ Tarihler AA/GG/YYYY formatına çevrildi" }
  },
  {
    user_command: "Ondalık basamakları 0 ile sınırla",
    logic: "round all numbers to 0 decimal places integers",
    category: "formatting",
    output: { action: "update_cells", transform: "round", decimals: 0, changes: [], reply: "✓ Sayılar tam sayıya yuvarlandı" }
  },
  {
    user_command: "Sayıları USD formatına çevir",
    logic: "format numbers as US dollar currency with $ symbol",
    category: "formatting",
    output: { action: "update_cells", transform: "formatCurrency", symbol: "$", changes: [], reply: "✓ Sayılar $ formatına çevrildi" }
  },
  {
    user_command: "Negatif sayıları parantez içinde göster",
    logic: "format negative numbers in parentheses: (1000) instead of -1000",
    category: "formatting",
    output: { action: "update_cells", transform: "formatNegative", style: "parenthesis", changes: [], reply: "✓ Negatif sayılar parantez içinde gösteriliyor" }
  },
  {
    user_command: "Hücre içeriğini ortala",
    logic: "center align cell content horizontally",
    category: "formatting",
    output: { action: "update_cells", transform: "alignCenter", changes: [], reply: "✓ Hücre içerikleri ortalandı" }
  },
  {
    user_command: "Metni sola hizala",
    logic: "left align text in cells",
    category: "formatting",
    output: { action: "update_cells", transform: "alignLeft", changes: [], reply: "✓ Metin sola hizalandı" }
  },
  {
    user_command: "Sayıları sağa hizala",
    logic: "right align numbers in cells",
    category: "formatting",
    output: { action: "update_cells", transform: "alignRight", changes: [], reply: "✓ Sayılar sağa hizalandı" }
  },
  {
    user_command: "Kalın (bold) yap",
    logic: "apply bold font weight to selected cells",
    category: "formatting",
    output: { action: "update_cells", transform: "bold", changes: [], reply: "✓ Hücreler kalın yapıldı" }
  },
  {
    user_command: "Tarih formatını kısa yap",
    logic: "format dates as short DD.MM.YY",
    category: "formatting",
    output: { action: "update_cells", transform: "formatDate", format: "DD.MM.YY", changes: [], reply: "✓ Tarihler kısa formata çevrildi" }
  },
  {
    user_command: "Sütun genişliğini otomatik ayarla",
    logic: "auto-fit column width to cell content",
    category: "formatting",
    output: { action: "update_cells", transform: "autoFitWidth", changes: [], reply: "✓ Sütun genişlikleri otomatik ayarlandı" }
  },

  // ══════════════════════════════════════
  // METİN İŞLEMLERİ EK KOMUTLAR (TEXT EXTRA)
  // ══════════════════════════════════════
  {
    user_command: "Ürün koduna önek ekle PRD-",
    logic: "prefix all product codes with PRD-",
    category: "text",
    output: { action: "update_cells", transform: "addPrefix", prefix: "PRD-", changes: [], reply: "✓ Ürün kodlarına PRD- öneki eklendi" }
  },
  {
    user_command: "Sütunlardaki boşlukları alt çizgi ile değiştir",
    logic: "replace spaces with underscores in all cells",
    category: "text",
    output: { action: "update_cells", transform: "replaceSpaces", replacement: "_", changes: [], reply: "✓ Boşluklar alt çizgi ile değiştirildi" }
  },
  {
    user_command: "Metin sonuna TR ekle",
    logic: "append TR suffix to all text cells",
    category: "text",
    output: { action: "update_cells", transform: "addSuffix", suffix: "-TR", changes: [], reply: "✓ Metinlerin sonuna -TR eklendi" }
  },
  {
    user_command: "Telefon numarasından tire ve boşluk kaldır",
    logic: "remove dashes and spaces from phone number cells",
    category: "text",
    output: { action: "update_cells", transform: "removeChars", chars: ["-", " "], changes: [], reply: "✓ Telefon numaralarındaki tire ve boşluklar kaldırıldı" }
  },
  {
    user_command: "Her hücrenin sonundaki karakteri sil",
    logic: "remove last character from each cell value",
    category: "text",
    output: { action: "update_cells", transform: "removeLastChar", changes: [], reply: "✓ Son karakterler silindi" }
  },
  {
    user_command: "Sütunları birleştir aralarına virgül koy",
    logic: "concatenate all columns with comma separator",
    category: "text",
    output: { action: "merge_columns", separator: ", ", changes: [], reply: "✓ Sütunlar virgülle birleştirildi" }
  },
  {
    user_command: "IBAN numaralarını formatla",
    logic: "format IBAN numbers with spaces every 4 characters",
    category: "text",
    output: { action: "update_cells", transform: "formatIBAN", changes: [], reply: "✓ IBAN numaraları formatlandı" }
  },
  {
    user_command: "Metni kelime kelime böl",
    logic: "split text by spaces into separate columns for each word",
    category: "text",
    output: { action: "split_column", delimiter: " ", changes: [], reply: "✓ Metin kelimelere bölündü" }
  },
  {
    user_command: "Son 4 karakteri al",
    logic: "extract last 4 characters using RIGHT function",
    category: "text",
    output: { action: "update_cells", formula: "RIGHT", count: 4, changes: [], reply: "✓ Son 4 karakter alındı" }
  },
  {
    user_command: "Ortadaki 3 karakteri al",
    logic: "extract 3 characters from middle of text using MID",
    category: "text",
    output: { action: "update_cells", formula: "MID", start: "mid", count: 3, changes: [], reply: "✓ Ortadaki 3 karakter alındı" }
  },

  // ══════════════════════════════════════
  // ANALİZ EK KOMUTLAR (ANALYSIS EXTRA)
  // ══════════════════════════════════════
  {
    user_command: "Haftalık satış raporu hazırla",
    logic: "group sales data by week and calculate weekly totals",
    category: "analysis",
    output: { action: "message", changes: [], reply: "📊 Haftalık satış raporu hazırlandı" }
  },
  {
    user_command: "Yıllık özet tablosu oluştur",
    logic: "aggregate all data by year for annual summary",
    category: "analysis",
    output: { action: "message", changes: [], reply: "📊 Yıllık özet tablosu oluşturuldu" }
  },
  {
    user_command: "En çok sipariş veren müşteriyi bul",
    logic: "find customer with highest order count",
    category: "analysis",
    output: { action: "highlight", condition: "maxOrderCount", color: "#bbf7d0", changes: [], reply: "✓ En çok sipariş veren müşteri işaretlendi" }
  },
  {
    user_command: "Satış büyüme oranını hesapla",
    logic: "calculate month-over-month sales growth rate",
    category: "analysis",
    output: { action: "update_cells", formula: "growth_rate", changes: [], reply: "✓ Satış büyüme oranları hesaplandı" }
  },
  {
    user_command: "Çalışan performans raporu oluştur",
    logic: "generate employee performance summary with totals and rankings",
    category: "analysis",
    output: { action: "message", changes: [], reply: "📊 Çalışan performans raporu hazırlandı" }
  },
  {
    user_command: "En az satılan ürünü bul",
    logic: "find product with lowest total sales quantity",
    category: "analysis",
    output: { action: "highlight", condition: "minSales", color: "#fecaca", changes: [], reply: "✓ En az satılan ürün işaretlendi" }
  },
  {
    user_command: "Bölgeye göre satış dağılımını göster",
    logic: "summarize and group sales totals by region",
    category: "analysis",
    output: { action: "message", changes: [], reply: "📊 Bölgesel satış dağılımı hesaplandı" }
  },
  {
    user_command: "Müşteri sipariş sıklığını hesapla",
    logic: "calculate order frequency per customer",
    category: "analysis",
    output: { action: "update_cells", formula: "order_frequency", changes: [], reply: "✓ Müşteri sipariş sıklıkları hesaplandı" }
  },
  {
    user_command: "ABC analizi yap",
    logic: "classify items into A (top 80%), B (next 15%), C (last 5%) by revenue",
    category: "analysis",
    output: { action: "update_cells", transform: "abc_analysis", changes: [], reply: "✓ ABC analizi tamamlandı: A/B/C sınıfları atandı" }
  },
  {
    user_command: "Korelasyon analizi yap",
    logic: "calculate correlation coefficient between two numeric columns",
    category: "analysis",
    output: { action: "message", formula: "CORREL", changes: [], reply: "📊 Korelasyon katsayısı hesaplandı" }
  },

  // ══════════════════════════════════════
  // FORMÜLLER EK KOMUTLAR (FORMULAS EXTRA)
  // ══════════════════════════════════════
  {
    user_command: "YATAY ARA formülü oluştur",
    logic: "create HLOOKUP formula to match data horizontally",
    category: "formula",
    output: { action: "update_cells", formula: "HLOOKUP", changes: [], reply: "✓ YATAY ARA (HLOOKUP) formülü oluşturuldu" }
  },
  {
    user_command: "ÇOKEĞER formülü ekle",
    logic: "create IFS formula for multiple conditions",
    category: "formula",
    output: { action: "update_cells", formula: "IFS", changes: [], reply: "✓ ÇOKEĞER (IFS) formülü eklendi" }
  },
  {
    user_command: "ETOPLA ÇOK formülü ekle",
    logic: "create SUMIFS formula with multiple criteria",
    category: "formula",
    output: { action: "update_cells", formula: "SUMIFS", changes: [], reply: "✓ ETOPLA ÇOK (SUMIFS) formülü eklendi" }
  },
  {
    user_command: "ORTALAMA EĞER formülü ekle",
    logic: "create AVERAGEIF formula for conditional average",
    category: "formula",
    output: { action: "update_cells", formula: "AVERAGEIF", changes: [], reply: "✓ ORTALAMA EĞER (AVERAGEIF) formülü eklendi" }
  },
  {
    user_command: "BÜYÜK formülü ile 3. en büyük değeri bul",
    logic: "use LARGE function to find 3rd largest value",
    category: "formula",
    output: { action: "update_cells", formula: "LARGE", k: 3, changes: [], reply: "✓ 3. en büyük değer BÜYÜK formülüyle bulundu" }
  },
  {
    user_command: "KÜÇÜK formülü ile 3. en küçük değeri bul",
    logic: "use SMALL function to find 3rd smallest value",
    category: "formula",
    output: { action: "update_cells", formula: "SMALL", k: 3, changes: [], reply: "✓ 3. en küçük değer KÜÇÜK formülüyle bulundu" }
  },
  {
    user_command: "SOLDAN 3 karakter al",
    logic: "extract first 3 characters from left using LEFT(3)",
    category: "formula",
    output: { action: "update_cells", formula: "LEFT", count: 3, changes: [], reply: "✓ Soldan 3 karakter alındı" }
  },
  {
    user_command: "Bir sonraki iş gününü hesapla",
    logic: "calculate next working day using WORKDAY formula",
    category: "formula",
    output: { action: "update_cells", formula: "WORKDAY", changes: [], reply: "✓ Sonraki iş günleri hesaplandı" }
  },
  {
    user_command: "İki tarih arasındaki gün sayısını bul",
    logic: "calculate number of days between two dates using DAYS formula",
    category: "formula",
    output: { action: "update_cells", formula: "DAYS", changes: [], reply: "✓ Tarihler arası gün farkı hesaplandı" }
  },
  {
    user_command: "İki tarih arasındaki ay sayısını hesapla",
    logic: "calculate months between two dates using DATEDIF",
    category: "formula",
    output: { action: "update_cells", formula: "DATEDIF", unit: "M", changes: [], reply: "✓ Tarihler arası ay farkı hesaplandı" }
  },
  {
    user_command: "Çalışma süresini hesapla",
    logic: "calculate years of service using DATEDIF from hire date to today",
    category: "formula",
    output: { action: "update_cells", formula: "DATEDIF", unit: "Y", changes: [], reply: "✓ Çalışma süreleri hesaplandı" }
  },
  {
    user_command: "INDEX MATCH formülü oluştur",
    logic: "create INDEX MATCH formula as flexible alternative to VLOOKUP",
    category: "formula",
    output: { action: "update_cells", formula: "INDEX_MATCH", changes: [], reply: "✓ INDEX+MATCH formülü oluşturuldu" }
  },

  // ══════════════════════════════════════
  // GRAFİK EK KOMUTLAR (CHARTS EXTRA)
  // ══════════════════════════════════════
  {
    user_command: "Halka grafik oluştur",
    logic: "create donut chart to show proportions with a hole in center",
    category: "chart",
    output: { action: "create_chart", type: "donut", changes: [], reply: "✓ Halka grafik oluşturuldu" }
  },
  {
    user_command: "Histogram oluştur",
    logic: "create histogram chart showing frequency distribution",
    category: "chart",
    output: { action: "create_chart", type: "histogram", changes: [], reply: "✓ Histogram oluşturuldu" }
  },
  {
    user_command: "Kabarcık grafiği oluştur",
    logic: "create bubble chart with 3 variables: x, y and size",
    category: "chart",
    output: { action: "create_chart", type: "bubble", changes: [], reply: "✓ Kabarcık grafiği oluşturuldu" }
  },
  {
    user_command: "Hisse senedi grafiği oluştur",
    logic: "create stock/candlestick chart with open high low close",
    category: "chart",
    output: { action: "create_chart", type: "candlestick", changes: [], reply: "✓ Hisse senedi grafiği oluşturuldu" }
  },
  {
    user_command: "Ürün satış karşılaştırma grafiği yap",
    logic: "create grouped bar chart comparing product sales",
    category: "chart",
    output: { action: "create_chart", type: "grouped_bar", title: "Ürün Satış Karşılaştırması", changes: [], reply: "✓ Ürün karşılaştırma grafiği oluşturuldu" }
  },
  {
    user_command: "Yığılmış çubuk grafik oluştur",
    logic: "create stacked bar chart showing cumulative totals",
    category: "chart",
    output: { action: "create_chart", type: "stacked_bar", changes: [], reply: "✓ Yığılmış çubuk grafik oluşturuldu" }
  },
  {
    user_command: "Radyo (Radar) grafiği oluştur",
    logic: "create radar chart for multi-variable comparison",
    category: "chart",
    output: { action: "create_chart", type: "radar", changes: [], reply: "✓ Radar grafiği oluşturuldu" }
  },
  {
    user_command: "Tablo grafiği yap",
    logic: "create a formatted summary table visualization",
    category: "chart",
    output: { action: "create_chart", type: "table", changes: [], reply: "✓ Tablo grafiği oluşturuldu" }
  },

  // ══════════════════════════════════════
  // STOK EK KOMUTLAR (INVENTORY EXTRA)
  // ══════════════════════════════════════
  {
    user_command: "Stok devir hızını hesapla",
    logic: "calculate inventory turnover: cost of goods sold / average inventory",
    category: "inventory",
    output: { action: "update_cells", formula: "inventory_turnover", changes: [], reply: "✓ Stok devir hızı hesaplandı" }
  },
  {
    user_command: "Yeniden sipariş noktasını belirle",
    logic: "calculate reorder point: average daily demand * lead time",
    category: "inventory",
    output: { action: "update_cells", formula: "reorder_point", changes: [], reply: "✓ Yeniden sipariş noktaları belirlendi" }
  },
  {
    user_command: "Ürün koduna göre stok bul",
    logic: "lookup stock quantity by product code",
    category: "inventory",
    output: { action: "update_cells", formula: "VLOOKUP", lookup: "product_code", returns: "stock", changes: [], reply: "✓ Ürün kodu ile stok bilgisi bulundu" }
  },
  {
    user_command: "Toplam stok değerini hesapla",
    logic: "calculate total inventory value: sum of quantity * cost for each product",
    category: "inventory",
    output: { action: "update_cells", formula: "sumproduct", col1: "quantity", col2: "cost", changes: [], reply: "✓ Toplam stok değeri hesaplandı" }
  },
  {
    user_command: "Kategori bazında stok toplamı",
    logic: "sum inventory quantities grouped by product category",
    category: "inventory",
    output: { action: "message", formula: "SUMIF", changes: [], reply: "📊 Kategori bazında stok toplamları hesaplandı" }
  },
  {
    user_command: "Son giren ilk çıkar LIFO hesapla",
    logic: "calculate inventory cost using LIFO method",
    category: "inventory",
    output: { action: "message", formula: "LIFO", changes: [], reply: "📊 LIFO maliyet hesabı tamamlandı" }
  },

  // ══════════════════════════════════════
  // GELİŞMİŞ EK İŞLEMLER (ADVANCED EXTRA)
  // ══════════════════════════════════════
  {
    user_command: "Açılır liste ekle",
    logic: "add dropdown data validation list to cells",
    category: "advanced",
    output: { action: "add_validation", type: "dropdown", changes: [], reply: "✓ Açılır liste eklendi" }
  },
  {
    user_command: "Koşullu biçimlendirme ekle",
    logic: "add conditional formatting rule to auto-color cells based on value",
    category: "advanced",
    output: { action: "add_conditional_format", changes: [], reply: "✓ Koşullu biçimlendirme eklendi" }
  },
  {
    user_command: "Sütunu gizle",
    logic: "hide selected column from view",
    category: "advanced",
    output: { action: "hide_column", changes: [], reply: "✓ Sütun gizlendi" }
  },
  {
    user_command: "Satırı gizle",
    logic: "hide selected row from view",
    category: "advanced",
    output: { action: "hide_row", changes: [], reply: "✓ Satır gizlendi" }
  },
  {
    user_command: "Tüm sütunları göster",
    logic: "unhide all hidden columns",
    category: "advanced",
    output: { action: "unhide_columns", changes: [], reply: "✓ Tüm gizli sütunlar gösterildi" }
  },
  {
    user_command: "Hücreleri birleştir",
    logic: "merge selected cells into one",
    category: "advanced",
    output: { action: "merge_cells", changes: [], reply: "✓ Hücreler birleştirildi" }
  },
  {
    user_command: "Sütun sil",
    logic: "delete selected column and shift remaining columns left",
    category: "advanced",
    output: { action: "delete_column", changes: [], reply: "✓ Sütun silindi" }
  },
  {
    user_command: "Son satırı sil",
    logic: "delete the last row in the dataset",
    category: "advanced",
    output: { action: "delete_rows", condition: "lastRow", changes: [], reply: "✓ Son satır silindi" }
  },
  {
    user_command: "Sütunları yer değiştir",
    logic: "swap two columns with each other",
    category: "advanced",
    output: { action: "swap_columns", changes: [], reply: "✓ Sütunlar yer değiştirdi" }
  },
  {
    user_command: "Sayfayı PDF olarak dışa aktar",
    logic: "export current sheet as PDF file",
    category: "advanced",
    output: { action: "export", format: "pdf", changes: [], reply: "✓ Sayfa PDF olarak dışa aktarıldı" }
  },
  {
    user_command: "CSV olarak dışa aktar",
    logic: "export data as CSV file",
    category: "advanced",
    output: { action: "export", format: "csv", changes: [], reply: "✓ Veriler CSV olarak dışa aktarıldı" }
  },
  {
    user_command: "Excel dosyası olarak indir",
    logic: "export and download as .xlsx Excel file",
    category: "advanced",
    output: { action: "export", format: "xlsx", changes: [], reply: "✓ Excel dosyası oluşturuldu ve indirildi" }
  },
  {
    user_command: "Tüm değişiklikleri geri al",
    logic: "undo all recent changes and revert to original state",
    category: "advanced",
    output: { action: "undo_all", changes: [], reply: "✓ Tüm değişiklikler geri alındı" }
  },
  {
    user_command: "Son değişikliği geri al",
    logic: "undo the most recent action",
    category: "advanced",
    output: { action: "undo", changes: [], reply: "✓ Son değişiklik geri alındı" }
  },
  {
    user_command: "Tüm filtreleri kaldır",
    logic: "remove all active filters and show all data",
    category: "advanced",
    output: { action: "clear_filter", changes: [], reply: "✓ Tüm filtreler kaldırıldı" }
  },
  {
    user_command: "Arama yap",
    logic: "search for a specific value across all cells",
    category: "advanced",
    output: { action: "search", changes: [], reply: "🔍 Arama tamamlandı" }
  },
  {
    user_command: "İki sütunu karşılaştır",
    logic: "compare two columns and highlight differences",
    category: "advanced",
    output: { action: "highlight", condition: "columnDiff", color: "#fef08a", changes: [], reply: "✓ Farklı değerler sarıya işaretlendi" }
  },
  {
    user_command: "Tüm tabloyu temizle",
    logic: "clear all cell values while keeping headers",
    category: "advanced",
    output: { action: "clear_data", keepHeaders: true, changes: [], reply: "✓ Tablo verileri temizlendi (başlıklar korundu)" }
  },

  // ══════════════════════════════════════
  // İNSAN KAYNAKLARI (HR / PERSONNEL)
  // ══════════════════════════════════════
  {
    user_command: "Çalışan listesini departmana göre filtrele",
    logic: "filter employee list by department column",
    category: "hr",
    output: { action: "filter", condition: "department == input", changes: [], reply: "✓ Çalışanlar departmana göre filtrelendi" }
  },
  {
    user_command: "Kıdem yıllarını hesapla",
    logic: "calculate years of seniority from hire date to today",
    category: "hr",
    output: { action: "update_cells", formula: "DATEDIF", unit: "Y", from: "hire_date", to: "today", changes: [], reply: "✓ Kıdem yılları hesaplandı" }
  },
  {
    user_command: "İzin günleri bakiyesini hesapla",
    logic: "calculate remaining leave days: entitlement - used days",
    category: "hr",
    output: { action: "update_cells", formula: "subtract", col1: "leave_entitlement", col2: "used_leave", changes: [], reply: "✓ İzin günleri bakiyeleri hesaplandı" }
  },
  {
    user_command: "İşe giriş tarihine göre sırala",
    logic: "sort employees by hire date ascending",
    category: "hr",
    output: { action: "sort", column: "hire_date", direction: "asc", changes: [], reply: "✓ Çalışanlar işe giriş tarihine göre sıralandı" }
  },
  {
    user_command: "Pozisyona göre grupla",
    logic: "group employees by job title/position",
    category: "hr",
    output: { action: "message", changes: [], reply: "📊 Çalışanlar pozisyona göre gruplandı" }
  },
  {
    user_command: "Emekliliğe yakın çalışanları işaretle",
    logic: "highlight employees with more than 25 years of service",
    category: "hr",
    output: { action: "highlight", condition: "yearsOfService >= 25", color: "#fef08a", changes: [], reply: "✓ Emekliliğe yakın çalışanlar sarıya işaretlendi" }
  },

  // ══════════════════════════════════════
  // BELİRSİZ KOMUTLAR EK (FALLBACK EXTRA)
  // ══════════════════════════════════════
  {
    user_command: "Bunları sırala",
    logic: "vague sort command - needs column specification",
    category: "unclear",
    output: { action: "message", changes: [], reply: "Hangi sütuna veya alana göre sıralama yapmamı istersiniz?" }
  },
  {
    user_command: "Göster",
    logic: "vague show command - needs clarification",
    category: "unclear",
    output: { action: "message", changes: [], reply: "Neyi göstermemi istersiniz? Belirli bir filtre veya veri aralığı söyler misiniz?" }
  },
  {
    user_command: "Hesapla",
    logic: "vague calculate command - needs specification of what to calculate",
    category: "unclear",
    output: { action: "message", changes: [], reply: "Hangi değeri hesaplamamı istersiniz? Toplam, ortalama veya başka bir işlem mi?" }
  },
  {
    user_command: "Raporla",
    logic: "vague report request - ask for specific report type",
    category: "unclear",
    output: { action: "message", changes: [], reply: "Hangi tür rapor hazırlamamı istersiniz? Satış, stok, muhasebe veya başka bir rapor mu?" }
  },
  {
    user_command: "Güncelle",
    logic: "vague update command - needs column and value specification",
    category: "unclear",
    output: { action: "message", changes: [], reply: "Hangi sütunu veya değeri güncellememi istersiniz? Lütfen detay verir misiniz?" }
  },

  // ── BUDGET ──────────────────────────────────────────────────────
  {
    user_command: "Aylık bütçe tablosu oluştur",
    logic: "create monthly budget template with income, expenses, and balance columns",
    category: "budget",
    output: {
      action: "insert_rows",
      columns: ["Kategori", "Bütçe", "Gerçekleşen", "Fark"],
      changes: [
        { row: 1, Kategori: "Gelir", Bütçe: 0, Gerçekleşen: 0, Fark: "=C2-B2" },
        { row: 2, Kategori: "Kira", Bütçe: 0, Gerçekleşen: 0, Fark: "=C3-B3" },
        { row: 3, Kategori: "Faturalar", Bütçe: 0, Gerçekleşen: 0, Fark: "=C4-B4" },
        { row: 4, Kategori: "Market", Bütçe: 0, Gerçekleşen: 0, Fark: "=C5-B5" },
        { row: 5, Kategori: "Ulaşım", Bütçe: 0, Gerçekleşen: 0, Fark: "=C6-B6" },
        { row: 6, Kategori: "TOPLAM", Bütçe: "=SUM(B2:B6)", Gerçekleşen: "=SUM(C2:C6)", Fark: "=SUM(D2:D6)" }
      ],
      reply: "Aylık bütçe tablosu oluşturuldu. Bütçe ve gerçekleşen değerleri girin, fark otomatik hesaplanacak."
    }
  },
  {
    user_command: "Nakit akışı tablosu hazırla",
    logic: "create cash flow statement with operating, investing, financing activities",
    category: "budget",
    output: {
      action: "insert_rows",
      columns: ["Kalem", "Tutar"],
      changes: [
        { row: 1, Kalem: "Faaliyet Gelirleri", Tutar: 0 },
        { row: 2, Kalem: "Faaliyet Giderleri", Tutar: 0 },
        { row: 3, Kalem: "Net Faaliyet Nakit Akışı", Tutar: "=B2-B3" },
        { row: 4, Kalem: "Yatırım Harcamaları", Tutar: 0 },
        { row: 5, Kalem: "Finansman Faaliyetleri", Tutar: 0 },
        { row: 6, Kalem: "Net Nakit Değişimi", Tutar: "=B4+B5+B6" }
      ],
      reply: "Nakit akış tablosu hazırlandı. Dönem başı nakit ile birlikte değerleri girin."
    }
  },
  {
    user_command: "Gelir-gider farkını hesapla",
    logic: "calculate net income by subtracting total expenses from total income",
    category: "budget",
    output: {
      action: "add_formula",
      formula: "=SUM(gelir_range)-SUM(gider_range)",
      changes: [],
      reply: "Gelir sütununuzdaki toplamdan gider sütununu çıkararak net gelir hesaplanır: =TOPLA(gelirler)-TOPLA(giderler)"
    }
  },
  {
    user_command: "Bütçe aşımı olan kalemleri vurgula",
    logic: "highlight rows where actual spending exceeds budgeted amount",
    category: "budget",
    output: {
      action: "highlight",
      condition: "actual > budget",
      color: "#FF4444",
      changes: [],
      reply: "Gerçekleşen harcama bütçeyi aşan kalemler kırmızı ile işaretlendi. Koşullu biçimlendirme: Gerçekleşen > Bütçe."
    }
  },
  {
    user_command: "Yıllık bütçe planı oluştur",
    logic: "create yearly budget plan with 12 monthly columns and category rows",
    category: "budget",
    output: {
      action: "insert_rows",
      columns: ["Kategori", "Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara", "Toplam"],
      changes: [
        { row: 1, Kategori: "Gelir" },
        { row: 2, Kategori: "Kira" },
        { row: 3, Kategori: "Personel" },
        { row: 4, Kategori: "Pazarlama" },
        { row: 5, Kategori: "TOPLAM" }
      ],
      reply: "12 aylık bütçe planı oluşturuldu. Her satır kategori, her sütun bir ay. Toplam sütunu otomatik hesaplanır."
    }
  },
  {
    user_command: "Tasarruf oranını hesapla",
    logic: "calculate savings rate as (income - expenses) / income * 100",
    category: "budget",
    output: {
      action: "add_formula",
      formula: "=(gelir-gider)/gelir*100",
      changes: [],
      reply: "Tasarruf oranı formülü: =(Gelir-Gider)/Gelir*100 — Örnek: =(B2-C2)/B2*100 → %25 gibi sonuç verir."
    }
  },
  {
    user_command: "Departman bazlı bütçe karşılaştırması yap",
    logic: "compare budget vs actual by department using pivot-style layout",
    category: "budget",
    output: {
      action: "add_formula",
      formula: "SUMIF departman bütçe/gerçekleşen karşılaştırması",
      changes: [],
      reply: "Departman karşılaştırması için: =ETOPLA(departman_sütunu; hedef_departman; tutar_sütunu) formülünü her departman için kullanın."
    }
  },

  // ── INVOICE ─────────────────────────────────────────────────────
  {
    user_command: "Fatura şablonu oluştur",
    logic: "create invoice template with item, quantity, unit price, total, and VAT columns",
    category: "invoice",
    output: {
      action: "insert_rows",
      columns: ["Ürün/Hizmet", "Miktar", "Birim Fiyat", "KDV%", "KDV Tutarı", "Toplam"],
      changes: [
        { row: 1, "Ürün/Hizmet": "", Miktar: 1, "Birim Fiyat": 0, "KDV%": 18, "KDV Tutarı": "=B2*C2*D2/100", Toplam: "=B2*C2+E2" }
      ],
      reply: "Fatura şablonu oluşturuldu. Miktar ve birim fiyat girildiğinde KDV ve toplam otomatik hesaplanır."
    }
  },
  {
    user_command: "KDV tutarını hesapla",
    logic: "calculate VAT amount from net price and VAT rate",
    category: "invoice",
    output: {
      action: "add_formula",
      formula: "=net_fiyat * kdv_orani / 100",
      changes: [],
      reply: "KDV formülü: =B2*C2/100 (B2=Net Fiyat, C2=KDV Oranı%). Toplam fiyat için: =B2*(1+C2/100)"
    }
  },
  {
    user_command: "Fatura toplamlarını müşteri bazında grupla",
    logic: "sum invoice totals grouped by customer name using SUMIF",
    category: "invoice",
    output: {
      action: "add_formula",
      formula: "=SUMIF(musteri_sutunu, hedef_musteri, toplam_sutunu)",
      changes: [],
      reply: "Müşteri bazlı toplam için: =ETOPLA(A:A;\"Müşteri Adı\";F:F) — A sütunu müşteri adı, F sütunu fatura tutarı."
    }
  },
  {
    user_command: "Vadesi geçmiş faturaları filtrele",
    logic: "filter invoices where due date is before today and status is unpaid",
    category: "invoice",
    output: {
      action: "filter",
      condition: "vade_tarihi < TODAY() AND durum = 'Ödenmedi'",
      changes: [],
      reply: "Vadesi geçmiş faturalar filtrelendi. Vade Tarihi < BUGÜN() ve Durum = 'Ödenmedi' koşulu uygulandı."
    }
  },
  {
    user_command: "Aylık fatura özetini hazırla",
    logic: "summarize invoices by month showing count and total amount",
    category: "invoice",
    output: {
      action: "add_formula",
      formula: "SUMIFS + COUNTIFS by month",
      changes: [],
      reply: "Aylık özet için ETOPLALAR kullanın: =ETOPLALAR(tutar_sutunu; tarih_sutunu; \">=\"&TARIH(yil;ay;1); tarih_sutunu; \"<\"&TARIH(yil;ay+1;1))"
    }
  },
  {
    user_command: "İskonto uygula",
    logic: "apply discount percentage to invoice line items",
    category: "invoice",
    output: {
      action: "add_formula",
      formula: "=fiyat * (1 - iskonto/100)",
      changes: [],
      reply: "İskonto formülü: =B2*(1-C2/100) — B2 fiyat, C2 iskonto yüzdesi. %10 iskonto için C2=10 girin."
    }
  },
  {
    user_command: "Tahsilat takip tablosu oluştur",
    logic: "create accounts receivable tracking table with invoice, customer, due date, status columns",
    category: "invoice",
    output: {
      action: "insert_rows",
      columns: ["Fatura No", "Müşteri", "Tutar", "Vade Tarihi", "Ödeme Tarihi", "Durum", "Gecikme Günü"],
      changes: [
        { row: 1, "Fatura No": "F-001", Müşteri: "", Tutar: 0, "Vade Tarihi": "", "Ödeme Tarihi": "", Durum: "Beklemede", "Gecikme Günü": "=EĞER(F2=\"\";BUGÜN()-D2;0)" }
      ],
      reply: "Tahsilat takip tablosu hazırlandı. Gecikme günü sütunu bugüne göre otomatik hesaplanır."
    }
  },

  // ── INVENTORY (ek) ──────────────────────────────────────────────
  {
    user_command: "Stok devir hızını hesapla",
    logic: "calculate inventory turnover rate as cost of goods sold divided by average inventory",
    category: "inventory",
    output: {
      action: "add_formula",
      formula: "=COGS / ((basi_stok + sonu_stok) / 2)",
      changes: [],
      reply: "Stok devir hızı = Satılan Malın Maliyeti / Ortalama Stok. Formül: =B2/((C2+D2)/2) — B2=SMM, C2=Dönem Başı Stok, D2=Dönem Sonu Stok."
    }
  },
  {
    user_command: "En çok satan ürünleri listele",
    logic: "rank products by total sales quantity descending and show top sellers",
    category: "inventory",
    output: {
      action: "sort",
      column: "Satış Adedi",
      order: "desc",
      changes: [],
      reply: "Ürünler satış adedine göre büyükten küçüğe sıralandı. En çok satanlar listenin üstünde."
    }
  },
  {
    user_command: "Minimum stok altına düşen ürünleri göster",
    logic: "filter products where current stock is below minimum stock level",
    category: "inventory",
    output: {
      action: "filter",
      condition: "mevcut_stok < minimum_stok",
      changes: [],
      reply: "Stoku minimum seviyenin altına düşen ürünler filtrelendi. Yeniden sipariş verilmesi gereken ürünler listelendi."
    }
  },
  {
    user_command: "ABC analizi yap",
    logic: "classify inventory items into A, B, C categories based on revenue contribution (80/15/5 rule)",
    category: "inventory",
    output: {
      action: "add_column",
      column: "ABC Sınıfı",
      formula: "cumulative revenue percentage thresholds: A=80%, B=95%, C=100%",
      changes: [],
      reply: "ABC analizi: Kümülatif gelir %80'e kadar = A sınıfı, %95'e kadar = B, geri kalanlar = C. Önce satış tutarına göre büyükten küçüğe sıralayın."
    }
  },
  {
    user_command: "Stok değerini hesapla",
    logic: "calculate total inventory value as quantity multiplied by unit cost",
    category: "inventory",
    output: {
      action: "add_formula",
      formula: "=miktar * birim_maliyet",
      changes: [],
      reply: "Stok değeri = Miktar × Birim Maliyet. Formül: =B2*C2. Genel toplam için: =TOPLA(D:D)"
    }
  },
  {
    user_command: "Tedarikçi bazlı stok özeti",
    logic: "summarize inventory grouped by supplier showing total quantity and value",
    category: "inventory",
    output: {
      action: "add_formula",
      formula: "SUMIF by supplier column",
      changes: [],
      reply: "Tedarikçi bazlı özet için: =ETOPLA(tedarikci_sutunu; hedef_tedarikci; miktar_sutunu) — Her tedarikçi için ayrı satır oluşturun."
    }
  },
  {
    user_command: "Hareketsiz stokları işaretle",
    logic: "highlight products with no sales movement in the last 90 days",
    category: "inventory",
    output: {
      action: "highlight",
      condition: "son_hareket_tarihi < TODAY()-90",
      color: "#FFA500",
      changes: [],
      reply: "90 gün içinde satış hareketi olmayan stoklar turuncu ile işaretlendi. Bu ürünler için indirim veya iade değerlendirilebilir."
    }
  },

  // ── ACCOUNTS (cari hesap) ────────────────────────────────────────
  {
    user_command: "Cari hesap tablosu oluştur",
    logic: "create accounts ledger with date, description, debit, credit, and balance columns",
    category: "accounts",
    output: {
      action: "insert_rows",
      columns: ["Tarih", "Açıklama", "Borç", "Alacak", "Bakiye"],
      changes: [
        { row: 1, Tarih: "", Açıklama: "Açılış Bakiyesi", Borç: 0, Alacak: 0, Bakiye: 0 },
        { row: 2, Tarih: "", Açıklama: "", Borç: 0, Alacak: 0, Bakiye: "=E2+C3-D3" }
      ],
      reply: "Cari hesap tablosu oluşturuldu. Her satırda bakiye önceki satırdan taşınarak otomatik güncellenir."
    }
  },
  {
    user_command: "Müşteri bazlı bakiyeyi göster",
    logic: "show net balance per customer by summing debits and credits grouped by customer",
    category: "accounts",
    output: {
      action: "add_formula",
      formula: "=SUMIF(musteri; hedef; borc) - SUMIF(musteri; hedef; alacak)",
      changes: [],
      reply: "Müşteri bakiyesi = Toplam Borç - Toplam Alacak. Formül: =ETOPLA(A:A;\"Müşteri\";C:C)-ETOPLA(A:A;\"Müşteri\";D:D)"
    }
  },
  {
    user_command: "Borçlu müşterileri listele",
    logic: "filter customers with positive net balance (debit > credit) indicating outstanding receivables",
    category: "accounts",
    output: {
      action: "filter",
      condition: "bakiye > 0",
      changes: [],
      reply: "Bakiyesi pozitif (borçlu) müşteriler filtrelendi. Tahsilat yapılması gereken hesaplar listelendi."
    }
  },
  {
    user_command: "Alacak yaşlandırma raporu oluştur",
    logic: "create aging report categorizing receivables by 0-30, 31-60, 61-90, 90+ days overdue",
    category: "accounts",
    output: {
      action: "add_column",
      column: "Yaş Aralığı",
      formula: "IF(TODAY()-vade_tarihi) bucketed into 0-30, 31-60, 61-90, 90+",
      changes: [],
      reply: "Alacak yaşlandırma sütunu eklendi. Gecikme günlerine göre: 0-30 gün, 31-60 gün, 61-90 gün, 90+ gün kategorilere ayrıldı."
    }
  },
  {
    user_command: "Borç/alacak mutabakatı yap",
    logic: "reconcile debit and credit totals to verify balanced ledger",
    category: "accounts",
    output: {
      action: "add_formula",
      formula: "=SUM(borc_sutunu) - SUM(alacak_sutunu)",
      changes: [],
      reply: "Mutabakat formülü: =TOPLA(C:C)-TOPLA(D:D) — Sonuç 0 ise hesaplar dengeli. Fark varsa hata var demektir."
    }
  },
  {
    user_command: "Tedarikçi ödemelerini takip et",
    logic: "track supplier payments with due dates, amounts, and payment status",
    category: "accounts",
    output: {
      action: "insert_rows",
      columns: ["Tedarikçi", "Fatura No", "Tutar", "Vade", "Ödendi mi", "Kalan"],
      changes: [
        { row: 1, Tedarikçi: "", "Fatura No": "", Tutar: 0, Vade: "", "Ödendi mi": "Hayır", Kalan: "=EĞER(E2=\"Evet\";0;C2)" }
      ],
      reply: "Tedarikçi ödeme takip tablosu oluşturuldu. Ödeme yapıldığında 'Evet' seçin, kalan tutar otomatik sıfırlanır."
    }
  },

  // ── HR (ek) ──────────────────────────────────────────────────────
  {
    user_command: "Net maaş hesapla",
    logic: "calculate net salary after deducting income tax, SGK employee and employer contributions",
    category: "hr",
    output: {
      action: "add_formula",
      formula: "=brut - SGK_calisan - gelir_vergisi - damga_vergisi",
      changes: [],
      reply: "Net maaş = Brüt - SGK İşçi (%14) - İşsizlik (%1) - Gelir Vergisi - Damga Vergisi (%0.759). Brüt 30.000₺ için net ~20.500₺ civarı çıkar."
    }
  },
  {
    user_command: "Fazla mesai ücretini hesapla",
    logic: "calculate overtime pay as 1.5x hourly rate for hours worked beyond 45 hours/week",
    category: "hr",
    output: {
      action: "add_formula",
      formula: "=MAX(0; toplam_saat - 45) * (brut / 225) * 1.5",
      changes: [],
      reply: "Fazla mesai ücreti = (Toplam Saat - 45) × Saatlik Ücret × 1.5. Aylık 225 saat baz alınır: =MAKS(0;B2-45)*(brut/225)*1.5"
    }
  },
  {
    user_command: "Bordro tablosu oluştur",
    logic: "create payroll table with employee, gross salary, deductions, and net salary columns",
    category: "hr",
    output: {
      action: "insert_rows",
      columns: ["Personel", "Brüt Maaş", "SGK İşçi", "Gelir Vergisi", "Damga Vergisi", "Net Maaş"],
      changes: [
        { row: 1, Personel: "", "Brüt Maaş": 0, "SGK İşçi": "=B2*0.14", "Gelir Vergisi": "=B2*0.15", "Damga Vergisi": "=B2*0.00759", "Net Maaş": "=B2-C2-D2-E2" }
      ],
      reply: "Bordro tablosu oluşturuldu. Brüt maaş girildiğinde tüm kesintiler ve net maaş otomatik hesaplanır."
    }
  },
  {
    user_command: "İzin takibi tablosu oluştur",
    logic: "create leave tracking table with employee, leave type, start/end dates, and days used",
    category: "hr",
    output: {
      action: "insert_rows",
      columns: ["Personel", "İzin Türü", "Başlangıç", "Bitiş", "Gün Sayısı", "Kalan Hak"],
      changes: [
        { row: 1, Personel: "", "İzin Türü": "Yıllık", Başlangıç: "", Bitiş: "", "Gün Sayısı": "=D2-C2", "Kalan Hak": "=14-F2" }
      ],
      reply: "İzin takip tablosu oluşturuldu. Başlangıç ve bitiş tarihleri girildiğinde gün sayısı ve kalan izin otomatik hesaplanır."
    }
  },
  {
    user_command: "Personel devamsızlık raporunu hazırla",
    logic: "create absenteeism report counting absent days per employee and calculating absenteeism rate",
    category: "hr",
    output: {
      action: "add_formula",
      formula: "=devamsizlik_gunu / toplam_is_gunu * 100",
      changes: [],
      reply: "Devamsızlık oranı = (Devamsız Gün / Toplam İş Günü) × 100. Aylık 22 iş gününe göre: =B2/22*100 → %X devamsızlık."
    }
  },
  {
    user_command: "Kıdem tazminatını hesapla",
    logic: "calculate severance pay based on years of service and last gross salary",
    category: "hr",
    output: {
      action: "add_formula",
      formula: "=MIN(brut; tavan) * kidem_yili",
      changes: [],
      reply: "Kıdem tazminatı = Brüt Maaş (tavan: ~47.000₺) × Çalışma Yılı. Formül: =MİN(B2;47000)*C2 — B2=Brüt, C2=Yıl sayısı."
    }
  },
  {
    user_command: "SGK prim bildirgesini hazırla",
    logic: "prepare SGK premium declaration summary with employee SSK and employer contribution totals",
    category: "hr",
    output: {
      action: "insert_rows",
      columns: ["Personel", "Brüt", "İşçi SGK %14", "İşveren SGK %20.5", "İşsizlik İşçi %1", "İşsizlik İşveren %2"],
      changes: [
        { row: 1, Personel: "", Brüt: 0, "İşçi SGK %14": "=B2*0.14", "İşveren SGK %20.5": "=B2*0.205", "İşsizlik İşçi %1": "=B2*0.01", "İşsizlik İşveren %2": "=B2*0.02" }
      ],
      reply: "SGK prim tablosu oluşturuldu. Brüt girince işçi ve işveren payları otomatik hesaplanır."
    }
  },
  {
    user_command: "Yıllık ücret artışını hesapla",
    logic: "calculate annual salary increase based on inflation rate or fixed percentage",
    category: "hr",
    output: {
      action: "add_formula",
      formula: "=mevcut_maas * (1 + artis_orani / 100)",
      changes: [],
      reply: "Ücret artışı formülü: =B2*(1+C2/100) — B2=Mevcut Maaş, C2=Artış Yüzdesi. %30 zam için C2=30 girin."
    }
  },

  // ── TAX ──────────────────────────────────────────────────────────
  {
    user_command: "KDV beyannamesi özeti hazırla",
    logic: "prepare VAT return summary with taxable sales, VAT collected, VAT paid, and net VAT payable",
    category: "tax",
    output: {
      action: "insert_rows",
      columns: ["Kalem", "Matrah", "KDV Tutarı"],
      changes: [
        { row: 1, Kalem: "Hesaplanan KDV (Satışlar)", Matrah: 0, "KDV Tutarı": "=B2*0.20" },
        { row: 2, Kalem: "İndirilecek KDV (Alışlar)", Matrah: 0, "KDV Tutarı": "=B3*0.20" },
        { row: 3, Kalem: "Ödenecek/İadesi Gereken KDV", Matrah: "", "KDV Tutarı": "=C2-C3" }
      ],
      reply: "KDV beyanname özeti hazırlandı. Satış ve alış matrahlarını girin, ödenecek veya iade edilecek KDV otomatik hesaplanır."
    }
  },
  {
    user_command: "Kurumlar vergisi hesapla",
    logic: "calculate corporate income tax as 25% of taxable profit",
    category: "tax",
    output: {
      action: "add_formula",
      formula: "=vergi_matrah * 0.25",
      changes: [],
      reply: "Kurumlar vergisi = Vergi Matrahı × %25. Formül: =B2*0.25 — B2=Ticari Kâr (KKEG eklenmiş, istisnalar düşülmüş)."
    }
  },
  {
    user_command: "Geçici vergi hesapla",
    logic: "calculate provisional corporate tax as 25% of quarterly profit, minus previously paid",
    category: "tax",
    output: {
      action: "add_formula",
      formula: "=(donem_kari * 0.25) - onceki_gecici_vergi",
      changes: [],
      reply: "Geçici vergi = Dönem Kârı × %25 - Önceden Ödenen Geçici Vergi. Formül: =(B2*0.25)-C2"
    }
  },
  {
    user_command: "Stopaj vergisi hesapla",
    logic: "calculate withholding tax on dividends, rent, or freelance payments",
    category: "tax",
    output: {
      action: "add_formula",
      formula: "=brut_odeme * stopaj_orani",
      changes: [],
      reply: "Stopaj oranları: Kira %20, Serbest meslek %17, Temettü %10. Formül: =B2*C2 — B2=Brüt ödeme, C2=Stopaj oranı (ör: 0.20)."
    }
  },
  {
    user_command: "ÖTV matrahını hesapla",
    logic: "calculate special consumption tax base and amount for applicable goods",
    category: "tax",
    output: {
      action: "add_formula",
      formula: "=ithalat_bedeli * otv_orani",
      changes: [],
      reply: "ÖTV matrahı ürüne göre değişir. Otomobil, alkol, tütün gibi ürünler için matrah × oran formülü: =B2*C2. KDV, ÖTV üzerine uygulanır."
    }
  },

  // ── ANALYSIS (ek) ────────────────────────────────────────────────
  {
    user_command: "Pareto analizi yap",
    logic: "perform pareto analysis to identify which 20% of items cause 80% of results, with cumulative percentage column",
    category: "analysis",
    output: {
      action: "add_column",
      column: "Kümülatif %",
      formula: "cumulative sum / total * 100",
      changes: [],
      reply: "Pareto analizi: Değere göre büyükten küçüğe sıralayın, ardından kümülatif yüzde sütunu ekleyin: =TOPLA($B$2:B2)/TOPLA($B$2:$B$100)*100. %80 çizgisindeki kalemler kritik unsurlardır."
    }
  },
  {
    user_command: "Regresyon analizi için veri hazırla",
    logic: "prepare data for regression analysis by organizing independent and dependent variables in columns",
    category: "analysis",
    output: {
      action: "add_formula",
      formula: "=LINEST or TREND function for linear regression",
      changes: [],
      reply: "Regresyon için X (bağımsız) ve Y (bağımlı) verilerinizi iki sütuna yerleştirin. Eğim: =EĞİM(Y_araligi;X_araligi), Kesim: =KESMENOKTASI(Y;X), Tahmin: =TAHMİN(x_degeri;Y;X)."
    }
  },
  {
    user_command: "Sezonsal analiz yap",
    logic: "analyze seasonal patterns by calculating monthly or quarterly averages and seasonal indices",
    category: "analysis",
    output: {
      action: "add_formula",
      formula: "=monthly_avg / overall_avg (seasonal index)",
      changes: [],
      reply: "Sezonsal indeks = Dönem Ortalaması / Genel Ortalama. Her ay için: =ORTALAMA(aya_ait_degerler)/ORTALAMA(tum_degerler). 1'den büyük = yoğun sezon, küçük = düşük sezon."
    }
  },
  {
    user_command: "Korelasyon analizi yap",
    logic: "calculate Pearson correlation coefficient between two variables to measure their linear relationship",
    category: "analysis",
    output: {
      action: "add_formula",
      formula: "=CORREL(array1, array2)",
      changes: [],
      reply: "Korelasyon katsayısı: =KORELASYON(A2:A100;B2:B100) — -1 ile +1 arasında değer alır. +0.7 üzeri güçlü pozitif, -0.7 altı güçlü negatif ilişki."
    }
  },
  {
    user_command: "Sapma analizi yap",
    logic: "calculate variance and standard deviation to identify outliers in the dataset",
    category: "analysis",
    output: {
      action: "add_formula",
      formula: "=STDEV and flag values beyond 2 standard deviations",
      changes: [],
      reply: "Sapma analizi: Standart sapma =STDSAPMA(veri_araligi). Aykırı değer tespiti için: =EĞER(ABS(B2-ORTALAMA($B$2:$B$100))>2*STDSAPMA($B$2:$B$100);\"Aykırı\";\"Normal\")"
    }
  },
  {
    user_command: "Büyüme oranını hesapla",
    logic: "calculate period-over-period growth rate as (current - previous) / previous * 100",
    category: "analysis",
    output: {
      action: "add_formula",
      formula: "=(current - previous) / previous * 100",
      changes: [],
      reply: "Büyüme oranı = (Mevcut Dönem - Önceki Dönem) / Önceki Dönem × 100. Formül: =(B3-B2)/B2*100 → %X büyüme/küçülme."
    }
  },

  // ── DYNAMIC ARRAYS ───────────────────────────────────────────────
  {
    user_command: "Satışları 5000'den büyük olanları filtrele ve alfabetik sırala",
    logic: "apply SORT(FILTER(data, sales > 5000), 1, 1)",
    category: "dynamic_arrays",
    output: {
      action: "formula",
      cell: "F2#",
      formula: "=SORT(FILTER(A2:C100, C2:C100 > 5000), 1, 1)",
      changes: ["dynamic spill range"],
      reply: "✓ 5000'den büyük satışlar filtrelendi ve alfabetik olarak sıralandı."
    }
  },
  {
    user_command: "Benzersiz müşteri listesini şehir bazlı getir",
    logic: "apply UNIQUE(FILTER(customers, city='İstanbul'))",
    category: "dynamic_arrays",
    output: {
      action: "formula",
      cell: "H2#",
      formula: "=UNIQUE(FILTER(B2:B500, D2:D500=\"İstanbul\"))",
      changes: ["unique list generation"],
      reply: "✓ İstanbul'daki benzersiz müşteri listesi oluşturuldu."
    }
  },

  // ── OPTIMIZATION (LET) ───────────────────────────────────────────
  {
    user_command: "Karmaşık vergi hesaplamasını LET ile optimize et",
    logic: "use LET to define variables for sales, tax_rate, and discount",
    category: "optimization",
    output: {
      action: "formula",
      cell: "E2",
      formula: "=LET(sales, A2, rate, 0.18, disc, 0.05, (sales * (1-disc)) * rate)",
      changes: ["formula optimization"],
      reply: "✓ Vergi hesaplaması LET fonksiyonu ile optimize edilerek okunabilir hale getirildi."
    }
  },
  {
    user_command: "Kar marjını hesapla, eğer %20'den azsa 'Düşük' değilse 'Yüksek' yaz (LET kullanarak)",
    logic: "LET(profit, (price-cost), margin, profit/price, IF(margin < 0.2, 'Düşük', 'Yüksek'))",
    category: "optimization",
    output: {
      action: "formula",
      cell: "F2",
      formula: "=LET(p, B2-C2, m, p/B2, IF(m < 0.2, \"Düşük\", \"Yüksek\"))",
      changes: ["conditional logic with variables"],
      reply: "✓ Kar marjı analizi değişkenler tanımlanarak yapıldı."
    }
  },

  // ── CUSTOM FUNCTIONS (LAMBDA) ────────────────────────────────────
  {
    user_command: "Daire alanı hesaplayan özel bir fonksiyon oluştur",
    logic: "define LAMBDA(r, PI()*r^2) as AREA_CIRCLE",
    category: "custom_functions",
    output: {
      action: "define_name",
      name: "ALAN_HESAPLA",
      formula: "=LAMBDA(yaricap, PI()*yaricap^2)",
      changes: ["new custom function"],
      reply: "✓ 'ALAN_HESAPLA' adında özel bir fonksiyon tanımlandı. Artık =ALAN_HESAPLA(A2) şeklinde kullanabilirsiniz."
    }
  },
  {
    user_command: "Metindeki tüm sayıları temizleyen fonksiyon tanımla",
    logic: "use LAMBDA with TEXTJOIN logic to strip numbers from text",
    category: "custom_functions",
    output: {
      action: "define_name",
      name: "SAYI_TEMIZLE",
      formula: "=LAMBDA(text, TEXTJOIN(\"\", TRUE, IF(ISERR(MID(text, SEQUENCE(LEN(text)), 1)*1), MID(text, SEQUENCE(LEN(text)), 1), \"\")))",
      changes: ["text cleaning function"],
      reply: "✓ 'SAYI_TEMIZLE' fonksiyonu oluşturuldu; metin içindeki rakamları otomatik olarak ayıklar."
    }
  },

  // ── ADVANCED LOOKUP ──────────────────────────────────────────────
  {
    user_command: "Personel ID'ye göre hem isim hem departman bilgisini tek seferde getir",
    logic: "use XLOOKUP returning multiple columns",
    category: "advanced_lookup",
    output: {
      action: "formula",
      cell: "B2#",
      formula: "=XLOOKUP(A2, Personel!A:A, Personel!B:C)",
      changes: ["multi-column return"],
      reply: "✓ Personel ismi ve departmanı tek bir XLOOKUP ile getirildi."
    }
  },
  {
    user_command: "Satır ve sütun başlığına göre kesişim değerini bul (2D Lookup)",
    logic: "INDEX(data, MATCH(row_val, row_range, 0), MATCH(col_val, col_range, 0))",
    category: "advanced_lookup",
    output: {
      action: "formula",
      cell: "D10",
      formula: "=INDEX(A1:Z100, MATCH(\"Mart\", A1:A100, 0), MATCH(\"Gelir\", A1:Z1, 0))",
      changes: ["two-dimensional lookup"],
      reply: "✓ Mart ayı Gelir değeri satır ve sütun eşleşmesiyle bulundu."
    }
  },

  // ── FINANCE (gelişmiş) ───────────────────────────────────────────
  {
    user_command: "Yatırımın 5 yıllık net bugünkü değerini (NBD) hesapla",
    logic: "apply NPV(rate, cash_flows)",
    category: "finance",
    output: {
      action: "formula",
      cell: "B10",
      formula: "=NPV(0.1, B2:B6) - B1",
      changes: ["financial modeling"],
      reply: "✓ %10 iskonto oranı ile 5 yıllık Net Bugünkü Değer hesaplandı."
    }
  },

  // ── STATISTICS (gelişmiş) ────────────────────────────────────────
  {
    user_command: "Satış trendini kullanarak gelecek ayın tahminini yap",
    logic: "apply FORECAST.LINEAR or TREND function",
    category: "statistics",
    output: {
      action: "formula",
      cell: "C12",
      formula: "=FORECAST.LINEAR(DATE(2024,4,1), B2:B11, A2:A11)",
      changes: ["predictive analysis"],
      reply: "✓ Geçmiş veriler analiz edilerek Nisan 2024 için satış tahmini yapıldı."
    }
  },

  // ── TRANSFORMATION ───────────────────────────────────────────────
  {
    user_command: "Hücredeki metni kelimelere ayır ve alt alta listele",
    logic: "apply TEXTSPLIT and TRANSPOSE",
    category: "transformation",
    output: {
      action: "formula",
      cell: "E2#",
      formula: "=TRANSPOSE(TEXTSPLIT(A2, \" \"))",
      changes: ["text to rows transformation"],
      reply: "✓ Metin boşluklardan bölünerek dikey bir liste haline getirildi."
    }
  },
  {
    user_command: "Belirli bir desene uyan verileri çek (RegEx benzeri)",
    logic: "use FILTER with SEARCH to find pattern-matching values",
    category: "transformation",
    output: {
      action: "formula",
      cell: "G2#",
      formula: "=FILTER(A2:A100, ISNUMBER(SEARCH(\"TR-???-2023\", A2:A100)))",
      changes: ["pattern matching filter"],
      reply: "✓ 'TR-XXX-2023' formatındaki tüm kodlar filtrelendi."
    }
  },

  // ── MATH (gelişmiş) ──────────────────────────────────────────────
  {
    user_command: "Sadece görünür hücreleri topla",
    logic: "SUBTOTAL(9, range) to ignore hidden rows",
    category: "math",
    output: {
      action: "formula",
      formula: "=SUBTOTAL(9, A2:A100)",
      changes: [],
      reply: "✓ Filtrelenmiş veya gizlenmiş satırlar hariç toplam alındı."
    }
  },
  {
    user_command: "Ağırlıklı ortalama hesapla",
    logic: "SUMPRODUCT(values, weights) / SUM(weights)",
    category: "math",
    output: {
      action: "formula",
      formula: "=SUMPRODUCT(B2:B10, C2:C10) / SUM(C2:C10)",
      changes: [],
      reply: "✓ Birim fiyat ve miktara göre ağırlıklı ortalama hesaplandı."
    }
  },
  {
    user_command: "Her 3. satırı topla",
    logic: "SUMPRODUCT with MOD and ROW logic",
    category: "math",
    output: {
      action: "formula",
      formula: "=SUMPRODUCT((MOD(ROW(A2:A100)-ROW(A2)+1, 3)=0)*(A2:A100))",
      changes: [],
      reply: "✓ Belirli bir periyottaki (her 3. satır) değerler toplandı."
    }
  },
  {
    user_command: "En yakın 10'un katına yuvarla",
    logic: "MROUND(number, 10)",
    category: "math",
    output: {
      action: "formula",
      formula: "=MROUND(A2, 10)",
      changes: [],
      reply: "✓ Sayı en yakın 10'luk birime yuvarlandı."
    }
  },
  {
    user_command: "Rastgele benzersiz tam sayı üret",
    logic: "RANDARRAY with SORTBY to generate unique random integers",
    category: "math",
    output: {
      action: "formula",
      formula: "=SORTBY(SEQUENCE(10), RANDARRAY(10))",
      changes: [],
      reply: "✓ 1'den 10'a kadar benzersiz rastgele sayılar üretildi."
    }
  },

  // ── TEXT (gelişmiş) ──────────────────────────────────────────────
  {
    user_command: "Metindeki tüm sayıları ayıkla",
    logic: "TEXTJOIN with SEQUENCE and ISNUMBER to extract digits",
    category: "text",
    output: {
      action: "formula",
      formula: "=TEXTJOIN(\"\", TRUE, IF(ISNUMBER(MID(A2, SEQUENCE(LEN(A2)), 1)*1), MID(A2, SEQUENCE(LEN(A2)), 1), \"\"))",
      changes: [],
      reply: "✓ Metin içerisindeki tüm rakamlar birleştirilerek ayıklandı."
    }
  },
  {
    user_command: "İsmin sadece baş harflerini al (Initials)",
    logic: "TEXTJOIN and LEFT with TEXTSPLIT to get initials",
    category: "text",
    output: {
      action: "formula",
      formula: "=TEXTJOIN(\".\", TRUE, LEFT(TEXTSPLIT(A2, \" \"), 1)) & \".\"",
      changes: [],
      reply: "✓ 'Ahmet Yılmaz' metni 'A.Y.' formatına dönüştürülür."
    }
  },
  {
    user_command: "URL'den domain adını çek",
    logic: "MID and FIND logic for domain extraction from URL",
    category: "text",
    output: {
      action: "formula",
      formula: "=MID(A2, FIND(\"//\", A2)+2, FIND(\"/\", A2, FIND(\"//\", A2)+2) - (FIND(\"//\", A2)+2))",
      changes: [],
      reply: "✓ Web sitesi adresinden domain bilgisi başarıyla çekildi."
    }
  },
  {
    user_command: "Metni tersten yazdır",
    logic: "TEXTJOIN and MID with SEQUENCE reversed to reverse text",
    category: "text",
    output: {
      action: "formula",
      formula: "=TEXTJOIN(\"\", TRUE, MID(A2, SEQUENCE(LEN(A2), , LEN(A2), -1), 1))",
      changes: [],
      reply: "✓ Hücredeki metin karakter bazlı olarak tersine çevrildi."
    }
  },
  {
    user_command: "Sadece metin karakterlerini bırak (Sayıları sil)",
    logic: "TEXTJOIN with ISERR to keep only non-numeric characters",
    category: "text",
    output: {
      action: "formula",
      formula: "=TEXTJOIN(\"\", TRUE, IF(ISERR(MID(A2, SEQUENCE(LEN(A2)), 1)*1), MID(A2, SEQUENCE(LEN(A2)), 1), \"\"))",
      changes: [],
      reply: "✓ Metin içindeki tüm rakamlar temizlendi."
    }
  },

  // ── LOGIC (gelişmiş) ─────────────────────────────────────────────
  {
    user_command: "Çoklu kritere göre durum belirle (IFS)",
    logic: "IFS(cond1, res1, cond2, res2...) for multi-branch scoring",
    category: "logic",
    output: {
      action: "formula",
      formula: "=IFS(A2>=90, \"A\", A2>=80, \"B\", A2>=70, \"C\", TRUE, \"F\")",
      changes: [],
      reply: "✓ Puan tablosuna göre harf notu ataması yapıldı."
    }
  },
  {
    user_command: "Hata varsa alternatif formülü çalıştır",
    logic: "IFERROR nested with another formula as fallback",
    category: "logic",
    output: {
      action: "formula",
      formula: "=IFERROR(VLOOKUP(A2, Tablo1, 2, 0), VLOOKUP(A2, Tablo2, 2, 0))",
      changes: [],
      reply: "✓ İlk tabloda bulunamazsa otomatik olarak ikinci tabloya bakılır."
    }
  },
  {
    user_command: "Hem sayı hem metin içeren hücreleri kontrol et",
    logic: "AND(ISNUMBER, ISTEXT) logic to detect mixed cell types",
    category: "logic",
    output: {
      action: "formula",
      formula: "=IF(AND(SUM(COUNTIF(A2, {\"*\", \"?\"}))>0, ISNUMBER(A2)), \"Karma\", \"Saf\")",
      changes: [],
      reply: "✓ Hücrenin veri tipi karmaşıklığı analiz edildi."
    }
  },

  // ── LOOKUP (gelişmiş) ────────────────────────────────────────────
  {
    user_command: "Geriye doğru (Soldaki sütuna) arama yap",
    logic: "XLOOKUP or INDEX/MATCH for left lookup",
    category: "lookup",
    output: {
      action: "formula",
      formula: "=XLOOKUP(A2, B:B, A:A)",
      changes: [],
      reply: "✓ Aranan değerin solundaki veriler başarıyla getirildi."
    }
  },
  {
    user_command: "İki farklı kritere göre veri getir",
    logic: "INDEX/MATCH with array logic (A=x)*(B=y) for two-criteria lookup",
    category: "lookup",
    output: {
      action: "formula",
      formula: "=INDEX(C2:C100, MATCH(1, (A2:A100=E1)*(B2:B100=E2), 0))",
      changes: [],
      reply: "✓ Hem Tarih hem Ürün kriterine uyan fiyat bilgisi çekildi."
    }
  },
  {
    user_command: "Son dolu hücrenin değerini bul",
    logic: "LOOKUP(2, 1/(range<>''), range) to find last non-empty cell",
    category: "lookup",
    output: {
      action: "formula",
      formula: "=LOOKUP(2, 1/(A:A<>\"\"), A:A)",
      changes: [],
      reply: "✓ Sütundaki en son girilen veri tespit edildi."
    }
  },
  {
    user_command: "Resim URL'sine göre dinamik resim getir",
    logic: "IMAGE function (Excel 365) to display image from URL",
    category: "lookup",
    output: {
      action: "formula",
      formula: "=IMAGE(A2, \"Ürün Resmi\", 1)",
      changes: [],
      reply: "✓ Hücredeki URL kullanılarak ürün görseli dinamik olarak çekildi."
    }
  },
  {
    user_command: "Arama sonucunda birden fazla eşleşmeyi birleştir",
    logic: "TEXTJOIN with FILTER to concatenate all matches",
    category: "lookup",
    output: {
      action: "formula",
      formula: "=TEXTJOIN(\", \", TRUE, FILTER(B2:B100, A2:A100=D1))",
      changes: [],
      reply: "✓ Bir kategoriye ait tüm alt öğeler tek bir hücrede virgülle ayrıldı."
    }
  },

  // ── DATE (gelişmiş) ──────────────────────────────────────────────
  {
    user_command: "Hafta sonları hariç teslim tarihini bul",
    logic: "WORKDAY(start, days, holidays) to skip weekends and holidays",
    category: "date",
    output: {
      action: "formula",
      formula: "=WORKDAY(A2, 15, Tatiller!A:A)",
      changes: [],
      reply: "✓ Hafta sonları ve resmi tatiller hariç 15 iş günü sonrası hesaplandı."
    }
  },
  {
    user_command: "Ayın son iş gününü bul",
    logic: "WORKDAY with EOMONTH to find last business day of month",
    category: "date",
    output: {
      action: "formula",
      formula: "=WORKDAY(EOMONTH(A2, 0)+1, -1)",
      changes: [],
      reply: "✓ İlgili ayın en son mesai günü belirlendi."
    }
  },
  {
    user_command: "İki tarih arasındaki toplam çalışma saatini hesapla",
    logic: "NETWORKDAYS with time math to calculate total working hours",
    category: "date",
    output: {
      action: "formula",
      formula: "=(NETWORKDAYS(A2, B2)-1)*8 + (B2-INT(B2)) - (A2-INT(A2))",
      changes: [],
      reply: "✓ İki tarih/saat arasındaki net mesai saati (8 saatlik gün bazlı) hesaplandı."
    }
  },

  // ── FINANCE (PMT/IRR/CAGR) ───────────────────────────────────────
  {
    user_command: "Kredinin aylık ödemesini hesapla",
    logic: "PMT(rate/12, nper, pv) for monthly loan payment",
    category: "finance",
    output: {
      action: "formula",
      formula: "=PMT(0.05/12, 36, -100000)",
      changes: [],
      reply: "✓ %5 faizle 36 ay vadeli 100.000 TL kredinin aylık taksiti hesaplandı."
    }
  },
  {
    user_command: "İç Verim Oranını (İVO) hesapla",
    logic: "IRR(values) for internal rate of return calculation",
    category: "finance",
    output: {
      action: "formula",
      formula: "=IRR(A2:A20)",
      changes: [],
      reply: "✓ Nakit akış tablosuna göre projenin yıllık getiri oranı (IRR) hesaplandı."
    }
  },
  {
    user_command: "Yıllık Bileşik Büyüme Oranını (CAGR) hesapla",
    logic: "((End/Start)^(1/Years))-1 for compound annual growth rate",
    category: "finance",
    output: {
      action: "formula",
      formula: "=((B10/B2)^(1/8))-1",
      changes: [],
      reply: "✓ 8 yıllık dönem için yıllık bileşik büyüme oranı (CAGR) bulundu."
    }
  },

  // ── STATS (gelişmiş) ─────────────────────────────────────────────
  {
    user_command: "Standart sapmaya göre aykırı değerleri bul",
    logic: "IF(ABS(val-mean)>2*std, 'Outlier', '') for outlier detection",
    category: "stats",
    output: {
      action: "formula",
      formula: "=IF(ABS(A2-AVERAGE($A$2:$A$100)) > 2*STDEV.P($A$2:$A$100), \"Aykırı\", \"Normal\")",
      changes: [],
      reply: "✓ Veri setindeki istatistiksel sapmalar (outliers) işaretlendi."
    }
  },
  {
    user_command: "Yüzdelik dilimi (Percentile) hesapla",
    logic: "PERCENTILE.INC(range, k) to find percentile threshold",
    category: "stats",
    output: {
      action: "formula",
      formula: "=PERCENTILE.INC(A2:A100, 0.9)",
      changes: [],
      reply: "✓ Verilerin %90'ının altında kaldığı eşik değer bulundu."
    }
  },
  {
    user_command: "Korelasyon katsayısını hesapla",
    logic: "CORREL(array1, array2) for Pearson correlation",
    category: "stats",
    output: {
      action: "formula",
      formula: "=CORREL(A2:A50, B2:B50)",
      changes: [],
      reply: "✓ Reklam harcaması ile satışlar arasındaki ilişki gücü hesaplandı."
    }
  },

  // ── DYNAMIC (gelişmiş) ───────────────────────────────────────────
  {
    user_command: "Satışları azalan sırada listele ve ilk 5'i al",
    logic: "TAKE(SORT(data, col, -1), 5) for top 5 sorted records",
    category: "dynamic",
    output: {
      action: "formula",
      formula: "=TAKE(SORT(A2:C100, 3, -1), 5)",
      changes: [],
      reply: "✓ En yüksek satış yapan ilk 5 kayıt dinamik olarak getirildi."
    }
  },
  {
    user_command: "İki listeyi karşılaştırıp sadece farkları bul",
    logic: "FILTER with ISNA/MATCH to find items in A not in B",
    category: "dynamic",
    output: {
      action: "formula",
      formula: "=FILTER(A2:A100, ISNA(MATCH(A2:A100, B2:B100, 0)))",
      changes: [],
      reply: "✓ A listesinde olup B listesinde olmayan benzersiz öğeler listelendi."
    }
  },
  {
    user_command: "Verileri grupla ve toplamlarını al (GROUPBY)",
    logic: "GROUPBY(cat, val, SUM) for category-based aggregation",
    category: "dynamic",
    output: {
      action: "formula",
      formula: "=GROUPBY(A2:A100, B2:B100, SUM)",
      changes: [],
      reply: "✓ Kategori bazlı toplamlar GROUPBY fonksiyonu ile özetlendi."
    }
  },

  // ── ENGINEERING ──────────────────────────────────────────────────
  {
    user_command: "Ondalık sayıyı ikilik (Binary) sisteme çevir",
    logic: "DEC2BIN(number) for decimal to binary conversion",
    category: "engineering",
    output: {
      action: "formula",
      formula: "=DEC2BIN(A2, 8)",
      changes: [],
      reply: "✓ Sayısal değer 8 bitlik ikilik koda dönüştürüldü."
    }
  },
  {
    user_command: "Karmaşık sayıların toplamını al",
    logic: "IMSUM(inumber1, inumber2) for complex number addition",
    category: "engineering",
    output: {
      action: "formula",
      formula: "=IMSUM(\"3+4i\", \"1-2i\")",
      changes: [],
      reply: "✓ Mühendislik hesaplamaları için karmaşık sayılar toplandı."
    }
  },
  {
    user_command: "Birim dönüşümü yap (Metre -> Feet)",
    logic: "CONVERT(number, 'm', 'ft') for unit conversion",
    category: "engineering",
    output: {
      action: "formula",
      formula: "=CONVERT(A2, \"m\", \"ft\")",
      changes: [],
      reply: "✓ Uzunluk birimi metreden feet birimine otomatik dönüştürüldü."
    }
  },

  // ── INFO ─────────────────────────────────────────────────────────
  {
    user_command: "Hücrenin formül içerip içermediğini kontrol et",
    logic: "ISFORMULA(cell) to check if cell contains a formula",
    category: "info",
    output: {
      action: "formula",
      formula: "=ISFORMULA(A2)",
      changes: [],
      reply: "✓ Hücrenin manuel mi yoksa formülle mi girildiği denetlendi."
    }
  },
  {
    user_command: "Gizli satır olup olmadığını kontrol et",
    logic: "CELL('width', cell) to detect hidden rows/columns",
    category: "info",
    output: {
      action: "formula",
      formula: "=IF(CELL(\"width\", A2)=0, \"Gizli\", \"Görünür\")",
      changes: [],
      reply: "✓ Hücrenin veya satırın görünürlük durumu tespit edildi."
    }
  },

  // ── CUSTOM (LET / LAMBDA gelişmiş) ───────────────────────────────
  {
    user_command: "Vergi ve indirim dahil net fiyatı hesapla (LET)",
    logic: "LET(price, A2, tax, 0.2, disc, 0.1, price*(1+tax)*(1-disc))",
    category: "custom",
    output: {
      action: "formula",
      formula: "=LET(p, A2, t, 0.2, d, 0.1, p*(1+t)*(1-d))",
      changes: [],
      reply: "✓ Karmaşık hesaplama değişkenlerle sadeleştirildi."
    }
  },
  {
    user_command: "Özyinelemeli (Recursive) Faktöriyel hesapla",
    logic: "LAMBDA for recursive factorial calculation",
    category: "custom",
    output: {
      action: "formula",
      formula: "=LAMBDA(f, LAMBDA(n, IF(n=0, 1, n*f(f, n-1))))",
      changes: [],
      reply: "✓ Excel içinde LAMBDA ile özyinelemeli matematiksel fonksiyon tanımlandı."
    }
  },

  // ── ADVANCED (Senaryo serisi) ────────────────────────────────────
  { user_command: "Senaryo 1: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A1, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 1 başarıyla işlendi." } },
  { user_command: "Senaryo 2: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A2, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 2 başarıyla işlendi." } },
  { user_command: "Senaryo 3: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A3, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 3 başarıyla işlendi." } },
  { user_command: "Senaryo 4: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A4, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 4 başarıyla işlendi." } },
  { user_command: "Senaryo 5: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A5, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 5 başarıyla işlendi." } },
  { user_command: "Senaryo 6: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A6, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 6 başarıyla işlendi." } },
  { user_command: "Senaryo 7: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A7, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 7 başarıyla işlendi." } },
  { user_command: "Senaryo 8: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A8, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 8 başarıyla işlendi." } },
  { user_command: "Senaryo 9: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A9, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 9 başarıyla işlendi." } },
  { user_command: "Senaryo 10: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A10, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 10 başarıyla işlendi." } },
  { user_command: "Senaryo 11: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A11, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 11 başarıyla işlendi." } },
  { user_command: "Senaryo 12: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A12, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 12 başarıyla işlendi." } },
  { user_command: "Senaryo 13: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A13, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 13 başarıyla işlendi." } },
  { user_command: "Senaryo 14: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A14, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 14 başarıyla işlendi." } },
  { user_command: "Senaryo 15: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A15, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 15 başarıyla işlendi." } },
  { user_command: "Senaryo 16: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A16, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 16 başarıyla işlendi." } },
  { user_command: "Senaryo 17: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A17, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 17 başarıyla işlendi." } },
  { user_command: "Senaryo 18: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A18, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 18 başarıyla işlendi." } },
  { user_command: "Senaryo 19: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A19, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 19 başarıyla işlendi." } },
  { user_command: "Senaryo 20: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A20, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 20 başarıyla işlendi." } },
  { user_command: "Senaryo 21: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A21, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 21 başarıyla işlendi." } },
  { user_command: "Senaryo 22: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A22, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 22 başarıyla işlendi." } },
  { user_command: "Senaryo 23: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A23, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 23 başarıyla işlendi." } },
  { user_command: "Senaryo 24: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A24, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 24 başarıyla işlendi." } },
  { user_command: "Senaryo 25: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A25, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 25 başarıyla işlendi." } },
  { user_command: "Senaryo 26: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A26, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 26 başarıyla işlendi." } },
  { user_command: "Senaryo 27: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A27, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 27 başarıyla işlendi." } },
  { user_command: "Senaryo 28: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A28, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 28 başarıyla işlendi." } },
  { user_command: "Senaryo 29: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A29, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 29 başarıyla işlendi." } },
  { user_command: "Senaryo 30: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A30, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 30 başarıyla işlendi." } },
  { user_command: "Senaryo 31: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A31, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 31 başarıyla işlendi." } },
  { user_command: "Senaryo 32: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A32, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 32 başarıyla işlendi." } },
  { user_command: "Senaryo 33: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A33, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 33 başarıyla işlendi." } },
  { user_command: "Senaryo 34: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A34, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 34 başarıyla işlendi." } },
  { user_command: "Senaryo 35: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A35, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 35 başarıyla işlendi." } },
  { user_command: "Senaryo 36: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A36, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 36 başarıyla işlendi." } },
  { user_command: "Senaryo 37: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A37, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 37 başarıyla işlendi." } },
  { user_command: "Senaryo 38: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A38, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 38 başarıyla işlendi." } },
  { user_command: "Senaryo 39: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A39, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 39 başarıyla işlendi." } },
  { user_command: "Senaryo 40: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A40, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 40 başarıyla işlendi." } },
  { user_command: "Senaryo 41: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A41, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 41 başarıyla işlendi." } },
  { user_command: "Senaryo 42: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A42, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 42 başarıyla işlendi." } },
  { user_command: "Senaryo 43: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A43, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 43 başarıyla işlendi." } },
  { user_command: "Senaryo 44: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A44, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 44 başarıyla işlendi." } },
  { user_command: "Senaryo 45: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A45, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 45 başarıyla işlendi." } },
  { user_command: "Senaryo 46: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A46, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 46 başarıyla işlendi." } },
  { user_command: "Senaryo 47: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A47, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 47 başarıyla işlendi." } },
  { user_command: "Senaryo 48: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A48, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 48 başarıyla işlendi." } },
  { user_command: "Senaryo 49: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A49, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 49 başarıyla işlendi." } },
  { user_command: "Senaryo 50: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A50, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 50 başarıyla işlendi." } },
  { user_command: "Senaryo 51: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A51, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 51 başarıyla işlendi." } },
  { user_command: "Senaryo 52: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A52, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 52 başarıyla işlendi." } },
  { user_command: "Senaryo 53: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A53, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 53 başarıyla işlendi." } },
  { user_command: "Senaryo 54: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A54, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 54 başarıyla işlendi." } },
  { user_command: "Senaryo 55: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A55, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 55 başarıyla işlendi." } },
  { user_command: "Senaryo 56: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A56, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 56 başarıyla işlendi." } },
  { user_command: "Senaryo 57: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A57, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 57 başarıyla işlendi." } },
  { user_command: "Senaryo 58: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A58, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 58 başarıyla işlendi." } },
  { user_command: "Senaryo 59: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A59, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 59 başarıyla işlendi." } },
  { user_command: "Senaryo 60: Gelişmiş Veri Analizi Komutu", logic: "Complex logic variant — XLOOKUP with LET rate adjustment", category: "advanced", output: { action: "formula", formula: "=XLOOKUP(A60, Data!A:A, Data!B:B) * (1+LET(r, 0.05, r))", changes: [], reply: "✓ Senaryo 60 başarıyla işlendi." } }

];

module.exports = { EXCEL_DATASET };