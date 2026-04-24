const EXCEL_DATASET = [

  // ── SIRALAMA ──────────────────────────────────────────
  { user_command: "a dan z ye sırala", logic: "sort ascending alphabetical order", category: "sorting", output: { action: "sort", direction: "asc", column: "0", reply: "✓ A'dan Z'ye sıralandı", changes: [] } },
  { user_command: "küçükten büyüğe sırala", logic: "sort ascending numeric order", category: "sorting", output: { action: "sort", direction: "asc", reply: "✓ Küçükten büyüğe sıralandı", changes: [] } },
  { user_command: "z den a ya sırala", logic: "sort descending alphabetical order", category: "sorting", output: { action: "sort", direction: "desc", reply: "✓ Z'den A'ya sıralandı", changes: [] } },
  { user_command: "büyükten küçüğe sırala", logic: "sort descending numeric order", category: "sorting", output: { action: "sort", direction: "desc", reply: "✓ Büyükten küçüğe sıralandı", changes: [] } },
  { user_command: "fiyata göre sırala", logic: "sort by price column ascending", category: "sorting", output: { action: "sort", column: "fiyat", direction: "asc", reply: "✓ Fiyata göre sıralandı", changes: [] } },
  { user_command: "tarihe göre sırala", logic: "sort by date column ascending", category: "sorting", output: { action: "sort", column: "tarih", direction: "asc", reply: "✓ Tarihe göre sıralandı", changes: [] } },
  { user_command: "isme göre sırala", logic: "sort by name column alphabetically", category: "sorting", output: { action: "sort", column: "isim", direction: "asc", reply: "✓ İsime göre sıralandı", changes: [] } },
  { user_command: "fiyata göre büyükten küçüğe sırala", logic: "sort price column descending", category: "sorting", output: { action: "sort", column: "fiyat", direction: "desc", reply: "✓ Fiyata göre azalan sıralandı", changes: [] } },
  { user_command: "satışa göre en yüksekten sırala", logic: "sort sales column descending highest first", category: "sorting", output: { action: "sort", column: "satış", direction: "desc", reply: "✓ Satışa göre sıralandı", changes: [] } },
  { user_command: "b sütununu sırala", logic: "sort column B ascending", category: "sorting", output: { action: "sort", column: "B", direction: "asc", reply: "✓ B sütunu sıralandı", changes: [] } },
  { user_command: "artan sırayla diz", logic: "arrange in ascending order", category: "sorting", output: { action: "sort", direction: "asc", reply: "✓ Artan sırayla dizildi", changes: [] } },
  { user_command: "alfabetik sırala", logic: "sort alphabetically ascending", category: "sorting", output: { action: "sort", direction: "asc", reply: "✓ Alfabetik sıralandı", changes: [] } },

  // ── TOPLAMA ──────────────────────────────────────────
  { user_command: "topla", logic: "calculate sum of all values", category: "calculation", output: { action: "sum", reply: "✓ Toplam hesaplandı", changes: [] } },
  { user_command: "toplam al", logic: "calculate total sum", category: "calculation", output: { action: "sum", reply: "✓ Toplam alındı", changes: [] } },
  { user_command: "hepsini topla", logic: "sum all cells together", category: "calculation", output: { action: "sum", reply: "✓ Tümü toplandı", changes: [] } },
  { user_command: "b sütununu topla", logic: "sum column B values", category: "calculation", output: { action: "sum", column: "B", reply: "✓ B sütunu toplandı", changes: [] } },
  { user_command: "fiyatları topla", logic: "sum price column values", category: "calculation", output: { action: "sum", column: "fiyat", reply: "✓ Fiyatlar toplandı", changes: [] } },
  { user_command: "satışları topla", logic: "sum sales column values", category: "calculation", output: { action: "sum", column: "satış", reply: "✓ Satışlar toplandı", changes: [] } },
  { user_command: "gelirlerin toplamı ne", logic: "calculate total revenue sum", category: "calculation", output: { action: "sum", column: "gelir", reply: "✓ Gelirler toplandı", changes: [] } },
  { user_command: "tutarları topla", logic: "sum amount column values", category: "calculation", output: { action: "sum", column: "tutar", reply: "✓ Tutarlar toplandı", changes: [] } },

  // ── ORTALAMA ─────────────────────────────────────────
  { user_command: "ortalama al", logic: "calculate average of all values", category: "calculation", output: { action: "average", reply: "✓ Ortalama hesaplandı", changes: [] } },
  { user_command: "ortalamasını hesapla", logic: "compute mean average value", category: "calculation", output: { action: "average", reply: "✓ Ortalama hesaplandı", changes: [] } },
  { user_command: "b sütununun ortalaması ne", logic: "calculate average of column B", category: "calculation", output: { action: "average", column: "B", reply: "✓ B sütununun ortalaması hesaplandı", changes: [] } },
  { user_command: "fiyatların ortalamasını bul", logic: "find average of price column", category: "calculation", output: { action: "average", column: "fiyat", reply: "✓ Fiyat ortalaması bulundu", changes: [] } },
  { user_command: "satış ortalaması hesapla", logic: "calculate average of sales column", category: "calculation", output: { action: "average", column: "satış", reply: "✓ Satış ortalaması hesaplandı", changes: [] } },

  // ── BOŞ SATIR SİLME ──────────────────────────────────
  { user_command: "boş satırları sil", logic: "delete rows with empty cells", category: "cleaning", output: { action: "delete_rows", condition: "empty", reply: "✓ Boş satırlar silindi", changes: [] } },
  { user_command: "boşları temizle", logic: "remove empty blank rows", category: "cleaning", output: { action: "delete_rows", condition: "empty", reply: "✓ Boş satırlar temizlendi", changes: [] } },
  { user_command: "boş olanları kaldır", logic: "remove rows that are empty", category: "cleaning", output: { action: "delete_rows", condition: "empty", reply: "✓ Boş satırlar kaldırıldı", changes: [] } },
  { user_command: "dolu satırları bırak boşları sil", logic: "keep filled rows delete empty rows", category: "cleaning", output: { action: "delete_rows", condition: "empty", reply: "✓ Boş satırlar temizlendi", changes: [] } },
  { user_command: "veri olmayan satırları kaldır", logic: "remove rows without data", category: "cleaning", output: { action: "delete_rows", condition: "empty", reply: "✓ Veri olmayan satırlar kaldırıldı", changes: [] } },
  { user_command: "sıfır olan satırları sil", logic: "delete rows where value is zero", category: "cleaning", output: { action: "delete_rows", condition: "value == 0", reply: "✓ Sıfır değerli satırlar silindi", changes: [] } },
  { user_command: "negatif satırları kaldır", logic: "remove rows with negative values", category: "cleaning", output: { action: "delete_rows", condition: "value < 0", reply: "✓ Negatif satırlar kaldırıldı", changes: [] } },

  // ── TEKRAR KALDIRMA ──────────────────────────────────
  { user_command: "tekrar edenleri sil", logic: "remove duplicate rows", category: "cleaning", output: { action: "remove_duplicates", reply: "✓ Tekrarlanan satırlar silindi", changes: [] } },
  { user_command: "mükerrerleri kaldır", logic: "remove repeated duplicate records", category: "cleaning", output: { action: "remove_duplicates", reply: "✓ Mükerrer kayıtlar kaldırıldı", changes: [] } },
  { user_command: "aynı olanları temizle", logic: "clean identical duplicate entries", category: "cleaning", output: { action: "remove_duplicates", reply: "✓ Tekrarlar temizlendi", changes: [] } },
  { user_command: "kopya kayıtları sil", logic: "delete copy duplicate records", category: "cleaning", output: { action: "remove_duplicates", reply: "✓ Kopya kayıtlar silindi", changes: [] } },
  { user_command: "duplicate kaldır", logic: "remove duplicate entries", category: "cleaning", output: { action: "remove_duplicates", reply: "✓ Duplicate kayıtlar kaldırıldı", changes: [] } },

  // ── RENKLENDİRME ─────────────────────────────────────
  { user_command: "negatifleri kırmızıya boya", logic: "highlight negative values red color", category: "highlighting", output: { action: "highlight", condition: "value < 0", color: "#fecaca", reply: "✓ Negatif değerler kırmızıya boyandı", changes: [] } },
  { user_command: "eksileri kırmızı yap", logic: "make negative minus values red", category: "highlighting", output: { action: "highlight", condition: "value < 0", color: "#fecaca", reply: "✓ Eksi değerler kırmızıya boyandı", changes: [] } },
  { user_command: "sıfırdan küçük olanları kırmızıya boya", logic: "color cells less than zero red", category: "highlighting", output: { action: "highlight", condition: "value < 0", color: "#fecaca", reply: "✓ Negatif hücreler boyandı", changes: [] } },
  { user_command: "zararda olanları kırmızı işaretle", logic: "mark loss negative cells red", category: "highlighting", output: { action: "highlight", condition: "value < 0", color: "#fecaca", reply: "✓ Zararda olanlar kırmızıya boyandı", changes: [] } },
  { user_command: "pozitif değerleri yeşile boya", logic: "highlight positive values green color", category: "highlighting", output: { action: "highlight", condition: "value > 0", color: "#bbf7d0", reply: "✓ Pozitif değerler yeşile boyandı", changes: [] } },
  { user_command: "artıları yeşil yap", logic: "make positive plus values green", category: "highlighting", output: { action: "highlight", condition: "value > 0", color: "#bbf7d0", reply: "✓ Artı değerler yeşile boyandı", changes: [] } },
  { user_command: "en büyük 5 değeri sarıya boya", logic: "highlight top 5 largest values yellow", category: "highlighting", output: { action: "highlight", condition: "top5", color: "#fef08a", reply: "✓ En büyük 5 değer sarıya boyandı", changes: [] } },
  { user_command: "en yüksek 3 değeri vurgula", logic: "highlight top 3 highest values", category: "highlighting", output: { action: "highlight", condition: "top3", color: "#fef08a", reply: "✓ En yüksek 3 değer vurgulandı", changes: [] } },
  { user_command: "100den büyükleri maviye boya", logic: "color cells greater than 100 blue", category: "highlighting", output: { action: "highlight", condition: "value > 100", color: "#bfdbfe", reply: "✓ 100'den büyük değerler maviye boyandı", changes: [] } },
  { user_command: "500den az olanları sarıya boya", logic: "color cells less than 500 yellow", category: "highlighting", output: { action: "highlight", condition: "value < 500", color: "#fef08a", reply: "✓ 500'den az değerler sarıya boyandı", changes: [] } },
  { user_command: "renkleri temizle", logic: "remove all cell colors formatting", category: "highlighting", output: { action: "clear_colors", reply: "✓ Tüm renkler temizlendi", changes: [] } },
  { user_command: "boyaları kaldır", logic: "remove cell background colors", category: "highlighting", output: { action: "clear_colors", reply: "✓ Hücre renkleri kaldırıldı", changes: [] } },

  // ── KDV HESAPLAMA ─────────────────────────────────────
  { user_command: "kdv ekle", logic: "add VAT tax 20 percent", category: "finance", output: { action: "update_cells", formula: "multiply", factor: 1.20, reply: "✓ %20 KDV eklendi", changes: [] } },
  { user_command: "kdv hesapla", logic: "calculate VAT tax amount", category: "finance", output: { action: "update_cells", formula: "multiply", factor: 1.20, reply: "✓ KDV hesaplandı", changes: [] } },
  { user_command: "yüzde yirmi kdv ekle", logic: "add 20 percent VAT to prices", category: "finance", output: { action: "update_cells", formula: "multiply", factor: 1.20, reply: "✓ %20 KDV eklendi", changes: [] } },
  { user_command: "fiyatlara kdv ekle", logic: "add VAT tax to price column", category: "finance", output: { action: "update_cells", formula: "multiply", column: "fiyat", factor: 1.20, reply: "✓ Fiyatlara KDV eklendi", changes: [] } },
  { user_command: "%20 kdv ekle", logic: "add 20 percent VAT", category: "finance", output: { action: "update_cells", formula: "multiply", factor: 1.20, reply: "✓ %20 KDV eklendi", changes: [] } },
  { user_command: "kdv hariç fiyat bul", logic: "calculate price excluding VAT tax", category: "finance", output: { action: "update_cells", formula: "divide", factor: 1.20, reply: "✓ KDV hariç fiyatlar hesaplandı", changes: [] } },
  { user_command: "kdv düş", logic: "remove subtract VAT from price", category: "finance", output: { action: "update_cells", formula: "divide", factor: 1.20, reply: "✓ KDV düşüldü", changes: [] } },
  { user_command: "kdv tutarını hesapla", logic: "calculate VAT amount only", category: "finance", output: { action: "update_cells", formula: "vat_amount", factor: 0.20, reply: "✓ KDV tutarı hesaplandı", changes: [] } },

  // ── YÜZDE İŞLEMLERİ ──────────────────────────────────
  { user_command: "yüzde 10 artır", logic: "increase values by 10 percent", category: "finance", output: { action: "update_cells", formula: "multiply", factor: 1.10, reply: "✓ Değerler %10 artırıldı", changes: [] } },
  { user_command: "fiyatları yüzde 20 zammla", logic: "raise price by 20 percent increase", category: "finance", output: { action: "update_cells", formula: "multiply", column: "fiyat", factor: 1.20, reply: "✓ Fiyatlar %20 artırıldı", changes: [] } },
  { user_command: "%15 indirim uygula", logic: "apply 15 percent discount reduction", category: "finance", output: { action: "update_cells", formula: "multiply", factor: 0.85, reply: "✓ %15 indirim uygulandı", changes: [] } },
  { user_command: "yüzde 5 düşür", logic: "decrease values by 5 percent", category: "finance", output: { action: "update_cells", formula: "multiply", factor: 0.95, reply: "✓ Değerler %5 düşürüldü", changes: [] } },
  { user_command: "b sütununu 2 ile çarp", logic: "multiply column B by 2", category: "calculation", output: { action: "update_cells", formula: "multiply", column: "B", factor: 2, reply: "✓ B sütunu 2 ile çarpıldı", changes: [] } },
  { user_command: "değerleri 100e böl", logic: "divide all values by 100", category: "calculation", output: { action: "update_cells", formula: "divide", factor: 100, reply: "✓ Değerler 100'e bölündü", changes: [] } },

  // ── MAAŞ & BORDRO ─────────────────────────────────────
  { user_command: "net maaş hesapla", logic: "calculate net salary after deductions", category: "hr", output: { action: "update_cells", formula: "net_salary", reply: "✓ Net maaşlar hesaplandı", changes: [] } },
  { user_command: "sgk kesintisini hesapla", logic: "calculate SGK social security deduction", category: "hr", output: { action: "update_cells", formula: "sgk_deduction", reply: "✓ SGK kesintileri hesaplandı", changes: [] } },
  { user_command: "gelir vergisi hesapla", logic: "calculate income tax withholding", category: "hr", output: { action: "update_cells", formula: "income_tax", reply: "✓ Gelir vergisi hesaplandı", changes: [] } },
  { user_command: "kıdem tazminatı hesapla", logic: "calculate severance pay compensation", category: "hr", output: { action: "update_cells", formula: "severance_pay", reply: "✓ Kıdem tazminatı hesaplandı", changes: [] } },
  { user_command: "brütten nete çevir", logic: "convert gross salary to net salary", category: "hr", output: { action: "update_cells", formula: "gross_to_net", reply: "✓ Brütten nete çevrildi", changes: [] } },

  // ── FİLTRELEME ───────────────────────────────────────
  { user_command: "istanbul olanları göster", logic: "filter rows containing istanbul city", category: "filtering", output: { action: "filter", condition: "contains", value: "istanbul", reply: "✓ İstanbul kayıtları filtrelendi", changes: [] } },
  { user_command: "ankara olanları filtrele", logic: "filter rows containing ankara city", category: "filtering", output: { action: "filter", condition: "contains", value: "ankara", reply: "✓ Ankara kayıtları filtrelendi", changes: [] } },
  { user_command: "100 den büyük olanları göster", logic: "filter show rows greater than 100", category: "filtering", output: { action: "filter", condition: "value > 100", reply: "✓ 100'den büyük değerler filtrelendi", changes: [] } },
  { user_command: "bu ay olanları göster", logic: "filter rows from current month", category: "filtering", output: { action: "filter", condition: "currentMonth", reply: "✓ Bu ayın kayıtları gösterildi", changes: [] } },
  { user_command: "aktif olanları göster", logic: "filter show active status rows", category: "filtering", output: { action: "filter", condition: "contains", value: "aktif", reply: "✓ Aktif kayıtlar gösterildi", changes: [] } },
  { user_command: "filtreyi kaldır", logic: "remove clear all filters", category: "filtering", output: { action: "remove_filter", reply: "✓ Filtre kaldırıldı", changes: [] } },
  { user_command: "tüm veriyi göster", logic: "show all data remove filter", category: "filtering", output: { action: "remove_filter", reply: "✓ Tüm veriler gösterildi", changes: [] } },

  // ── METİN DÖNÜŞÜMÜ ──────────────────────────────────
  { user_command: "büyük harfe çevir", logic: "convert text to uppercase", category: "text", output: { action: "transform", transform: "uppercase", reply: "✓ Büyük harfe çevrildi", changes: [] } },
  { user_command: "hepsini büyük harf yap", logic: "make all text uppercase capitals", category: "text", output: { action: "transform", transform: "uppercase", reply: "✓ Büyük harf yapıldı", changes: [] } },
  { user_command: "küçük harfe çevir", logic: "convert text to lowercase", category: "text", output: { action: "transform", transform: "lowercase", reply: "✓ Küçük harfe çevrildi", changes: [] } },
  { user_command: "baş harfleri büyük yap", logic: "capitalize first letter of each word title case", category: "text", output: { action: "transform", transform: "capitalize", reply: "✓ Baş harfler büyük yapıldı", changes: [] } },
  { user_command: "boşlukları temizle", logic: "trim remove extra whitespace spaces", category: "text", output: { action: "transform", transform: "trim", reply: "✓ Boşluklar temizlendi", changes: [] } },
  { user_command: "fazla boşlukları sil", logic: "remove extra trailing leading spaces", category: "text", output: { action: "transform", transform: "trim", reply: "✓ Fazla boşluklar silindi", changes: [] } },

  // ── RAPOR & ANALİZ ──────────────────────────────────
  { user_command: "rapor oluştur", logic: "generate automatic data report", category: "analysis", output: { action: "message", formula: "auto_report", reply: "📊 Rapor hazırlandı", changes: [] } },
  { user_command: "aylık rapor yap", logic: "create monthly report summary", category: "analysis", output: { action: "message", formula: "monthly_report", reply: "📊 Aylık rapor hazırlandı", changes: [] } },
  { user_command: "özet çıkar", logic: "create summary overview report", category: "analysis", output: { action: "message", formula: "summary", reply: "📊 Özet rapor oluşturuldu", changes: [] } },
  { user_command: "istatistikleri göster", logic: "show statistics metrics data", category: "analysis", output: { action: "message", formula: "statistics", reply: "📊 İstatistikler hesaplandı", changes: [] } },
  { user_command: "veri analizi yap", logic: "perform data analysis insights", category: "analysis", output: { action: "message", formula: "analysis", reply: "📊 Veri analizi tamamlandı", changes: [] } },
  { user_command: "satış raporu hazırla", logic: "prepare sales performance report", category: "analysis", output: { action: "message", formula: "sales_report", reply: "📊 Satış raporu hazırlandı", changes: [] } },

  // ── YARDIM ────────────────────────────────────────────
  { user_command: "ne yapabilirim", logic: "help what can I do commands list", category: "help", output: { action: "message", reply: "💡 Sıralama, filtreleme, hesaplama, renklendirme, rapor oluşturma yapabilirsiniz!", changes: [] } },
  { user_command: "yardım", logic: "help assistance support", category: "help", output: { action: "message", reply: "💡 Örnek: 'B sütununu topla', 'Boş satırları sil', 'KDV ekle', 'Aylık rapor yap'", changes: [] } },
  { user_command: "nasıl kullanırım", logic: "how to use instructions guide", category: "help", output: { action: "message", reply: "💡 Türkçe olarak ne yapmak istediğinizi yazın. Örn: 'Fiyatları büyükten küçüğe sırala'", changes: [] } },
  { user_command: "ne yaparsın", logic: "what can you do capabilities", category: "help", output: { action: "message", reply: "💡 Excel verilerinizi Türkçe komutlarla yönetebilirsiniz.", changes: [] } },
];

module.exports = { EXCEL_DATASET };
