// ============================================================
// MOCKSHEETS DATASET v5.0 — APPEND ONLY
// Mevcut dataset'e EKLENECEK yeni örnekler
// seed_append.js ile kullanın — mevcut veri SİLİNMEZ
//
// Araştırma kaynakları:
// - Excel 365 dinamik dizi formülleri (FILTER, SORT, UNIQUE, LET)
// - Türkiye 2026 bordro parametreleri (SGK tavan, BES, vergi dilimleri)
// - KOBİ muhasebe ihtiyaçları (çek/senet, Ba-Bs, mizan, e-defter)
// - Advanced Excel functions (XLOOKUP, SUMPRODUCT, INDIRECT, OFFSET)
// - Stok yönetimi, cari hesap, fatura takibi
// ============================================================

const EXCEL_DATASET_V5 = [

  // ════════════════════════════════════════════════════════
  // 1. EXCEL 365 DİNAMİK DİZİ FORMÜLLERI (20 örnek)
  // ════════════════════════════════════════════════════════
  { user_command: "filter formülü yaz", logic: "FILTER dynamic array formula Excel 365", category: "formula", output: { action: "generate_formula", formula_type: "filter", reply: "✓ FILTER formülü oluşturuldu", changes: [] } },
  { user_command: "koşula göre satırları filtrele formül ile", logic: "FILTER rows by condition dynamic array", category: "formula", output: { action: "generate_formula", formula_type: "filter", reply: "✓ FILTER formülü oluşturuldu", changes: [] } },
  { user_command: "sort formülü ile sırala", logic: "SORT dynamic array formula Excel 365", category: "formula", output: { action: "generate_formula", formula_type: "sort_formula", reply: "✓ SORT formülü oluşturuldu", changes: [] } },
  { user_command: "unique formülü ile benzersiz değerleri listele", logic: "UNIQUE distinct values dynamic array Excel", category: "formula", output: { action: "generate_formula", formula_type: "unique", reply: "✓ UNIQUE formülü oluşturuldu", changes: [] } },
  { user_command: "tekrar etmeyen değerleri formül ile bul", logic: "UNIQUE distinct values formula", category: "formula", output: { action: "generate_formula", formula_type: "unique", reply: "✓ UNIQUE formülü oluşturuldu", changes: [] } },
  { user_command: "let formülü yaz", logic: "LET variable naming formula Excel 365", category: "formula", output: { action: "generate_formula", formula_type: "let", reply: "✓ LET formülü oluşturuldu", changes: [] } },
  { user_command: "xlookup formülü yaz", logic: "XLOOKUP modern lookup Excel 365", category: "formula", output: { action: "generate_formula", formula_type: "xlookup", reply: "✓ XLOOKUP formülü oluşturuldu", changes: [] } },
  { user_command: "xlookup ile değer ara", logic: "XLOOKUP search value modern lookup", category: "formula", output: { action: "generate_formula", formula_type: "xlookup", reply: "✓ XLOOKUP arama formülü oluşturuldu", changes: [] } },
  { user_command: "sumproduct formülü yaz", logic: "SUMPRODUCT array multiplication sum formula", category: "formula", output: { action: "generate_formula", formula_type: "sumproduct", reply: "✓ SUMPRODUCT formülü oluşturuldu", changes: [] } },
  { user_command: "ağırlıklı ortalama hesapla", logic: "weighted average SUMPRODUCT formula", category: "formula", output: { action: "generate_formula", formula_type: "sumproduct", reply: "✓ Ağırlıklı ortalama formülü oluşturuldu", changes: [] } },
  { user_command: "indirect formülü ile dinamik referans", logic: "INDIRECT dynamic cell reference formula", category: "formula", output: { action: "generate_formula", formula_type: "indirect", reply: "✓ INDIRECT formülü oluşturuldu", changes: [] } },
  { user_command: "offset formülü yaz", logic: "OFFSET dynamic range formula Excel", category: "formula", output: { action: "generate_formula", formula_type: "offset", reply: "✓ OFFSET formülü oluşturuldu", changes: [] } },
  { user_command: "choose formülü ile seçim yap", logic: "CHOOSE index selection formula", category: "formula", output: { action: "generate_formula", formula_type: "choose", reply: "✓ CHOOSE formülü oluşturuldu", changes: [] } },
  { user_command: "small ile en küçük n değeri bul", logic: "SMALL Nth smallest value formula", category: "formula", output: { action: "generate_formula", formula_type: "small", reply: "✓ SMALL formülü oluşturuldu", changes: [] } },
  { user_command: "large ile en büyük n değeri bul", logic: "LARGE Nth largest value formula", category: "formula", output: { action: "generate_formula", formula_type: "large", reply: "✓ LARGE formülü oluşturuldu", changes: [] } },
  { user_command: "iferror ile hata yakala", logic: "IFERROR error handling formula", category: "formula", output: { action: "generate_formula", formula_type: "iferror", reply: "✓ EĞERHATA formülü oluşturuldu", changes: [] } },
  { user_command: "irr iç verim oranı hesapla", logic: "IRR internal rate of return formula", category: "formula", output: { action: "generate_formula", formula_type: "irr", reply: "✓ IRR formülü oluşturuldu", changes: [] } },
  { user_command: "npv net bugünkü değer hesapla", logic: "NPV net present value formula", category: "formula", output: { action: "generate_formula", formula_type: "npv", reply: "✓ NBD formülü oluşturuldu", changes: [] } },
  { user_command: "datedif ile yaş hesapla", logic: "DATEDIF age years months days formula", category: "formula", output: { action: "generate_formula", formula_type: "datedif", reply: "✓ DATEDIF yaş formülü oluşturuldu", changes: [] } },
  { user_command: "transpose ile satır sütun çevir", logic: "TRANSPOSE rotate rows columns formula", category: "formula", output: { action: "generate_formula", formula_type: "transpose", reply: "✓ DEVRIK formülü oluşturuldu", changes: [] } },

  // ════════════════════════════════════════════════════════
  // 2. 2026 BORDRO PARAMETRELERİ (25 örnek)
  // ════════════════════════════════════════════════════════
  { user_command: "2026 asgari ücrete göre net maaş hesapla", logic: "2026 minimum wage net salary Turkey", category: "hr", output: { action: "update_cells", formula: "net_salary_2026", reply: "✓ 2026 asgari ücrete göre net maaş hesaplandı", changes: [] } },
  { user_command: "sgk tavan kontrolü yap", logic: "SGK ceiling maximum premium check", category: "hr", output: { action: "validate", check: "sgk_tavan", reply: "✓ SGK tavan kontrolü yapıldı", changes: [] } },
  { user_command: "bes kesintisi hesapla", logic: "BES individual pension deduction Turkey", category: "hr", output: { action: "update_cells", formula: "bes_deduction", reply: "✓ BES kesintisi hesaplandı", changes: [] } },
  { user_command: "işsizlik sigortası primi hesapla", logic: "unemployment insurance premium 1 percent", category: "hr", output: { action: "update_cells", formula: "unemployment_premium", reply: "✓ İşsizlik sigortası primi hesaplandı", changes: [] } },
  { user_command: "gelir vergisi dilimini kontrol et", logic: "income tax bracket check Turkey 2026", category: "hr", output: { action: "update_cells", formula: "tax_bracket_check", reply: "✓ Gelir vergisi dilimi kontrol edildi", changes: [] } },
  { user_command: "kümülatif gelir vergisi matrahı hesapla", logic: "cumulative income tax base calculation", category: "hr", output: { action: "update_cells", formula: "cumulative_tax_base", reply: "✓ Kümülatif vergi matrahı hesaplandı", changes: [] } },
  { user_command: "aile yardımı hesapla", logic: "family allowance payment Turkey", category: "hr", output: { action: "update_cells", formula: "family_allowance", reply: "✓ Aile yardımı hesaplandı", changes: [] } },
  { user_command: "çocuk yardımı ekle", logic: "child benefit allowance Turkey", category: "hr", output: { action: "update_cells", formula: "child_allowance", reply: "✓ Çocuk yardımı eklendi", changes: [] } },
  { user_command: "yemek yardımı hesapla", logic: "meal allowance benefit Turkey daily", category: "hr", output: { action: "update_cells", formula: "meal_allowance", reply: "✓ Yemek yardımı hesaplandı", changes: [] } },
  { user_command: "yol yardımı ekle", logic: "transportation allowance travel benefit", category: "hr", output: { action: "update_cells", formula: "travel_allowance", reply: "✓ Yol yardımı eklendi", changes: [] } },
  { user_command: "engelli indirimini uygula", logic: "disability deduction tax reduction Turkey", category: "hr", output: { action: "update_cells", formula: "disability_deduction", reply: "✓ Engelli indirimi uygulandı", changes: [] } },
  { user_command: "puantaj hesapla", logic: "timekeeping attendance calculation Turkey", category: "hr", output: { action: "update_cells", formula: "timekeeping", reply: "✓ Puantaj hesaplandı", changes: [] } },
  { user_command: "eksik gün kesintisi hesapla", logic: "missing day deduction salary", category: "hr", output: { action: "update_cells", formula: "missing_day_deduction", reply: "✓ Eksik gün kesintisi hesaplandı", changes: [] } },
  { user_command: "emekli çalışan sgk hesapla", logic: "retired employee SGK calculation different rate", category: "hr", output: { action: "update_cells", formula: "retired_employee_sgk", reply: "✓ Emekli çalışan SGK hesaplandı", changes: [] } },
  { user_command: "ihbar süresini hesapla", logic: "notice period duration calculation Turkey", category: "hr", output: { action: "update_cells", formula: "notice_period", reply: "✓ İhbar süresi hesaplandı", changes: [] } },
  { user_command: "kıdem tazminatı tavanını kontrol et", logic: "severance pay ceiling check Turkey 2026", category: "hr", output: { action: "validate", check: "severance_ceiling", reply: "✓ Kıdem tazminatı tavanı kontrol edildi", changes: [] } },
  { user_command: "fazla mesai hesapla yüzde elli", logic: "overtime 50 percent rate calculation Turkey", category: "hr", output: { action: "update_cells", formula: "overtime_50", reply: "✓ %50 fazla mesai hesaplandı", changes: [] } },
  { user_command: "gece mesaisi hesapla", logic: "night shift overtime premium calculation", category: "hr", output: { action: "update_cells", formula: "night_shift_pay", reply: "✓ Gece mesaisi hesaplandı", changes: [] } },
  { user_command: "brüt ücretten sgk matrahı bul", logic: "find SGK premium base from gross salary", category: "hr", output: { action: "update_cells", formula: "sgk_base_from_gross", reply: "✓ SGK matrahı hesaplandı", changes: [] } },
  { user_command: "özel sağlık sigortası kesintisi ekle", logic: "private health insurance deduction payroll", category: "hr", output: { action: "update_cells", formula: "health_insurance_deduction", reply: "✓ Özel sağlık sigortası kesintisi eklendi", changes: [] } },
  { user_command: "toplu sözleşme zammı uygula", logic: "collective agreement wage increase", category: "hr", output: { action: "update_cells", formula: "collective_wage_increase", reply: "✓ Toplu sözleşme zammı uygulandı", changes: [] } },
  { user_command: "teşvik prim oranı hesapla", logic: "incentive premium calculation SGK", category: "hr", output: { action: "update_cells", formula: "incentive_premium", reply: "✓ Teşvik prim oranı hesaplandı", changes: [] } },
  { user_command: "bordro icmal tablosu oluştur", logic: "payroll summary table icmal", category: "hr", output: { action: "message", formula: "payroll_summary", reply: "📊 Bordro icmal tablosu oluşturuldu", changes: [] } },
  { user_command: "muhtasar beyanname için veri hazırla", logic: "withholding tax declaration preparation", category: "hr", output: { action: "message", formula: "withholding_declaration", reply: "📊 Muhtasar beyanname verisi hazırlandı", changes: [] } },
  { user_command: "sgk bildirge verisi hazırla", logic: "SGK declaration data preparation", category: "hr", output: { action: "message", formula: "sgk_declaration", reply: "📊 SGK bildirge verisi hazırlandı", changes: [] } },

  // ════════════════════════════════════════════════════════
  // 3. KOBİ MUHASEBE — ÇEK/SENET/CARİ (22 örnek)
  // ════════════════════════════════════════════════════════
  { user_command: "çek vadelerini listele", logic: "list check due dates maturity", category: "accounting", output: { action: "filter", condition: "check_due", reply: "✓ Çek vadeleri listelendi", changes: [] } },
  { user_command: "vadesi gelen çekleri göster", logic: "show upcoming due checks maturity", category: "accounting", output: { action: "filter", condition: "due_today", reply: "✓ Vadesi gelen çekler gösterildi", changes: [] } },
  { user_command: "senet takip tablosu oluştur", logic: "promissory note tracking table", category: "accounting", output: { action: "message", formula: "note_tracking", reply: "📊 Senet takip tablosu oluşturuldu", changes: [] } },
  { user_command: "cari hesap mutabakatı yap", logic: "current account reconciliation", category: "accounting", output: { action: "message", formula: "account_reconciliation", reply: "📊 Cari hesap mutabakatı yapıldı", changes: [] } },
  { user_command: "cari bakiye hesapla", logic: "calculate current account balance", category: "accounting", output: { action: "update_cells", formula: "current_balance", reply: "✓ Cari bakiye hesaplandı", changes: [] } },
  { user_command: "ba bs formu için veri hazırla", logic: "Ba-Bs form data preparation Turkey tax", category: "accounting", output: { action: "message", formula: "ba_bs_form", reply: "📊 Ba-Bs form verisi hazırlandı", changes: [] } },
  { user_command: "mizan tablosu oluştur", logic: "trial balance mizan table Turkey", category: "accounting", output: { action: "message", formula: "trial_balance", reply: "📊 Mizan tablosu oluşturuldu", changes: [] } },
  { user_command: "e-defter için veri formatla", logic: "e-ledger data format preparation Turkey", category: "accounting", output: { action: "message", formula: "e_ledger_format", reply: "📊 E-defter verisi formatlandı", changes: [] } },
  { user_command: "yevmiye kaydı oluştur", logic: "journal entry accounting record", category: "accounting", output: { action: "message", formula: "journal_entry", reply: "📊 Yevmiye kaydı oluşturuldu", changes: [] } },
  { user_command: "gelir tablosu hazırla", logic: "income statement profit loss table", category: "accounting", output: { action: "message", formula: "income_statement", reply: "📊 Gelir tablosu hazırlandı", changes: [] } },
  { user_command: "banka mutabakatı yap", logic: "bank reconciliation statement", category: "accounting", output: { action: "message", formula: "bank_reconciliation", reply: "📊 Banka mutabakatı yapıldı", changes: [] } },
  { user_command: "kasa defteri oluştur", logic: "cash book register ledger", category: "accounting", output: { action: "message", formula: "cash_book", reply: "📊 Kasa defteri oluşturuldu", changes: [] } },
  { user_command: "vadesi geçen alacakları işaretle", logic: "mark overdue receivables past due", category: "accounting", output: { action: "highlight", condition: "overdue", color: "#fecaca", reply: "✓ Vadesi geçen alacaklar işaretlendi", changes: [] } },
  { user_command: "tahsilat tablosu oluştur", logic: "collection payment table tracking", category: "accounting", output: { action: "message", formula: "collection_table", reply: "📊 Tahsilat tablosu oluşturuldu", changes: [] } },
  { user_command: "ödeme planı oluştur", logic: "payment schedule plan table", category: "accounting", output: { action: "message", formula: "payment_schedule", reply: "📊 Ödeme planı oluşturuldu", changes: [] } },
  { user_command: "kdv indirim tutarını hesapla", logic: "VAT deductible input tax calculation", category: "accounting", output: { action: "update_cells", formula: "vat_deductible", reply: "✓ KDV indirim tutarı hesaplandı", changes: [] } },
  { user_command: "kdv ödenecek tutarı hesapla", logic: "VAT payable net amount calculation", category: "accounting", output: { action: "update_cells", formula: "vat_payable", reply: "✓ Ödenecek KDV tutarı hesaplandı", changes: [] } },
  { user_command: "maliyet fiyatını hesapla", logic: "cost price calculation unit cost", category: "accounting", output: { action: "update_cells", formula: "cost_price", reply: "✓ Maliyet fiyatı hesaplandı", changes: [] } },
  { user_command: "satış fiyatı belirle kar marjına göre", logic: "selling price based on profit margin", category: "accounting", output: { action: "update_cells", formula: "selling_price_margin", reply: "✓ Satış fiyatı belirlendi", changes: [] } },
  { user_command: "dönem sonu envanter değeri", logic: "period end inventory valuation", category: "accounting", output: { action: "update_cells", formula: "inventory_valuation", reply: "✓ Dönem sonu envanter değeri hesaplandı", changes: [] } },
  { user_command: "fifo yöntemiyle stok maliyeti", logic: "FIFO first in first out inventory cost", category: "accounting", output: { action: "update_cells", formula: "fifo_cost", reply: "✓ FIFO stok maliyeti hesaplandı", changes: [] } },
  { user_command: "ağırlıklı ortalama maliyet hesapla", logic: "weighted average cost inventory", category: "accounting", output: { action: "update_cells", formula: "average_cost", reply: "✓ Ağırlıklı ortalama maliyet hesaplandı", changes: [] } },

  // ════════════════════════════════════════════════════════
  // 4. STOK VE ENVANTER YÖNETİMİ (18 örnek)
  // ════════════════════════════════════════════════════════
  { user_command: "stok kartı oluştur", logic: "create stock card inventory item", category: "inventory", output: { action: "message", formula: "stock_card", reply: "📊 Stok kartı oluşturuldu", changes: [] } },
  { user_command: "minimum stok seviyesini işaretle", logic: "mark minimum reorder stock level", category: "inventory", output: { action: "highlight", condition: "below_minimum", color: "#fecaca", reply: "✓ Minimum stok seviyesindekiler işaretlendi", changes: [] } },
  { user_command: "stok giriş çıkış takibi yap", logic: "inventory in out movement tracking", category: "inventory", output: { action: "message", formula: "stock_movement", reply: "📊 Stok giriş çıkış takibi yapıldı", changes: [] } },
  { user_command: "yeniden sipariş noktasını hesapla", logic: "reorder point calculation inventory", category: "inventory", output: { action: "update_cells", formula: "reorder_point", reply: "✓ Yeniden sipariş noktası hesaplandı", changes: [] } },
  { user_command: "stok sayım farkını bul", logic: "find stock count difference variance", category: "inventory", output: { action: "update_cells", formula: "stock_variance", reply: "✓ Stok sayım farkı bulundu", changes: [] } },
  { user_command: "ürün bazında kar hesapla", logic: "profit per product calculation", category: "inventory", output: { action: "update_cells", formula: "product_profit", reply: "✓ Ürün bazında kar hesaplandı", changes: [] } },
  { user_command: "raf ömrü dolan ürünleri işaretle", logic: "mark expired shelf life products", category: "inventory", output: { action: "highlight", condition: "expired", color: "#fecaca", reply: "✓ Raf ömrü dolanlar işaretlendi", changes: [] } },
  { user_command: "depo doluluk oranını hesapla", logic: "warehouse capacity utilization rate", category: "inventory", output: { action: "update_cells", formula: "warehouse_utilization", reply: "✓ Depo doluluk oranı hesaplandı", changes: [] } },
  { user_command: "abc analizi yap", logic: "ABC inventory analysis classification", category: "inventory", output: { action: "classify", categories: ["A", "B", "C"], reply: "📊 ABC envanter analizi yapıldı", changes: [] } },
  { user_command: "en çok satan ürünleri listele", logic: "list best selling top products", category: "inventory", output: { action: "top_n", column: "satış", n: 10, reply: "✓ En çok satan ürünler listelendi", changes: [] } },
  { user_command: "hareketsiz stokları bul", logic: "find non-moving dead stock items", category: "inventory", output: { action: "filter", condition: "no_movement", reply: "✓ Hareketsiz stoklar bulundu", changes: [] } },
  { user_command: "tedarikçiye göre stok grupla", logic: "group stock by supplier", category: "inventory", output: { action: "group_by", column: "tedarikçi", reply: "📊 Tedarikçiye göre stok gruplandırıldı", changes: [] } },
  { user_command: "fiyat güncelleme tablosu hazırla", logic: "prepare price update table", category: "inventory", output: { action: "message", formula: "price_update", reply: "📊 Fiyat güncelleme tablosu hazırlandı", changes: [] } },
  { user_command: "barkod listesi oluştur", logic: "create barcode product list", category: "inventory", output: { action: "message", formula: "barcode_list", reply: "📊 Barkod listesi oluşturuldu", changes: [] } },
  { user_command: "satın alma siparişi hazırla", logic: "prepare purchase order", category: "inventory", output: { action: "message", formula: "purchase_order", reply: "📊 Satın alma siparişi hazırlandı", changes: [] } },
  { user_command: "tedarik süresi hesapla", logic: "calculate lead time supply duration", category: "inventory", output: { action: "update_cells", formula: "lead_time", reply: "✓ Tedarik süresi hesaplandı", changes: [] } },
  { user_command: "stok maliyeti topla", logic: "sum total inventory cost value", category: "inventory", output: { action: "sum", column: "maliyet", reply: "✓ Stok maliyeti toplandı", changes: [] } },
  { user_command: "ürün gruplarına göre satış analizi", logic: "sales analysis by product group", category: "inventory", output: { action: "group_by", column: "grup", aggregate: "sum", reply: "📊 Ürün grubu satış analizi yapıldı", changes: [] } },

  // ════════════════════════════════════════════════════════
  // 5. GELİŞMİŞ SÜTUN/METİN/ARAMA (18 örnek)
  // ════════════════════════════════════════════════════════
  { user_command: "substitute ile metin değiştir", logic: "SUBSTITUTE replace text occurrences", category: "text", output: { action: "transform", transform: "substitute", reply: "✓ Metin değiştirildi", changes: [] } },
  { user_command: "mid ile ortadan metin çıkar", logic: "MID extract substring from middle", category: "text", output: { action: "extract", type: "mid", reply: "✓ Metin ortasından çıkarıldı", changes: [] } },
  { user_command: "left ile soldan karakter al", logic: "LEFT extract characters from left", category: "text", output: { action: "extract", type: "left", reply: "✓ Sol taraftan karakterler alındı", changes: [] } },
  { user_command: "right ile sağdan karakter al", logic: "RIGHT extract characters from right", category: "text", output: { action: "extract", type: "right", reply: "✓ Sağ taraftan karakterler alındı", changes: [] } },
  { user_command: "len ile karakter sayısını bul", logic: "LEN count characters text length", category: "text", output: { action: "update_cells", formula: "char_count", reply: "✓ Karakter sayısı hesaplandı", changes: [] } },
  { user_command: "find ile metin içinde ara", logic: "FIND locate text position", category: "text", output: { action: "search", reply: "✓ Metin içinde arama yapıldı", changes: [] } },
  { user_command: "text formülü ile sayıyı metne çevir", logic: "TEXT format number as text string", category: "text", output: { action: "transform", transform: "text_format", reply: "✓ Sayı metne çevrildi", changes: [] } },
  { user_command: "value ile metni sayıya çevir", logic: "VALUE convert text string to number", category: "text", output: { action: "transform", transform: "to_number", reply: "✓ Metin sayıya çevrildi", changes: [] } },
  { user_command: "rept ile metin tekrarla", logic: "REPT repeat text string", category: "text", output: { action: "transform", transform: "repeat_text", reply: "✓ Metin tekrarlandı", changes: [] } },
  { user_command: "ürün kodlarını standartlaştır", logic: "standardize product codes format", category: "text", output: { action: "clean_data", check: "product_codes", reply: "✓ Ürün kodları standartlaştırıldı", changes: [] } },
  { user_command: "iban numaralarını formatla", logic: "format IBAN bank account numbers", category: "text", output: { action: "clean_data", check: "iban", reply: "✓ IBAN numaraları formatlandı", changes: [] } },
  { user_command: "mükerrer e-postaları bul ve sil", logic: "find remove duplicate email addresses", category: "cleaning", output: { action: "remove_duplicates", reply: "✓ Mükerrer e-postalar silindi", changes: [] } },
  { user_command: "boşluk içeren hücreleri işaretle", logic: "mark cells containing spaces whitespace", category: "cleaning", output: { action: "highlight", condition: "has_spaces", color: "#fef08a", reply: "✓ Boşluk içeren hücreler işaretlendi", changes: [] } },
  { user_command: "sayısal olmayan karakterleri temizle", logic: "remove non-numeric characters clean", category: "cleaning", output: { action: "clean_data", check: "non_numeric_chars", reply: "✓ Sayısal olmayan karakterler temizlendi", changes: [] } },
  { user_command: "özel karakterleri kaldır", logic: "remove special characters symbols", category: "cleaning", output: { action: "clean_data", check: "special_chars", reply: "✓ Özel karakterler kaldırıldı", changes: [] } },
  { user_command: "metin uzunluğuna göre filtrele", logic: "filter by text length characters", category: "filtering", output: { action: "filter", condition: "text_length", reply: "✓ Metin uzunluğuna göre filtrelendi", changes: [] } },
  { user_command: "büyük harf küçük harf tutarsızlıklarını düzelt", logic: "fix uppercase lowercase inconsistencies", category: "cleaning", output: { action: "clean_data", check: "case_inconsistency", reply: "✓ Harf tutarsızlıkları düzeltildi", changes: [] } },
  { user_command: "hücreleri boşluksuz birleştir", logic: "concatenate cells without spaces", category: "text", output: { action: "transform", transform: "concat_no_space", reply: "✓ Hücreler boşluksuz birleştirildi", changes: [] } },

  // ════════════════════════════════════════════════════════
  // 6. FİNANSAL ANALİZ VE DASHBOARD (16 örnek)
  // ════════════════════════════════════════════════════════
  { user_command: "likidite oranı hesapla", logic: "liquidity ratio current ratio calculation", category: "analysis", output: { action: "update_cells", formula: "liquidity_ratio", reply: "✓ Likidite oranı hesaplandı", changes: [] } },
  { user_command: "borç özkaynak oranı hesapla", logic: "debt to equity ratio calculation", category: "analysis", output: { action: "update_cells", formula: "debt_equity_ratio", reply: "✓ Borç/Özkaynak oranı hesaplandı", changes: [] } },
  { user_command: "faiz karşılama oranı hesapla", logic: "interest coverage ratio EBIT", category: "analysis", output: { action: "update_cells", formula: "interest_coverage", reply: "✓ Faiz karşılama oranı hesaplandı", changes: [] } },
  { user_command: "ebitda hesapla", logic: "EBITDA earnings before interest tax depreciation", category: "analysis", output: { action: "update_cells", formula: "ebitda", reply: "✓ EBITDA hesaplandı", changes: [] } },
  { user_command: "yatırım geri dönüş süresi hesapla", logic: "payback period investment return", category: "analysis", output: { action: "update_cells", formula: "payback_period", reply: "✓ Yatırım geri dönüş süresi hesaplandı", changes: [] } },
  { user_command: "başa baş noktası hesapla", logic: "break even point analysis calculation", category: "analysis", output: { action: "update_cells", formula: "break_even", reply: "✓ Başa baş noktası hesaplandı", changes: [] } },
  { user_command: "satış büyüme oranı hesapla", logic: "sales growth rate percentage calculation", category: "analysis", output: { action: "update_cells", formula: "sales_growth", reply: "✓ Satış büyüme oranı hesaplandı", changes: [] } },
  { user_command: "müşteri başına gelir hesapla", logic: "revenue per customer ARPU calculation", category: "analysis", output: { action: "update_cells", formula: "revenue_per_customer", reply: "✓ Müşteri başına gelir hesaplandı", changes: [] } },
  { user_command: "churn oranı hesapla", logic: "customer churn attrition rate calculation", category: "analysis", output: { action: "update_cells", formula: "churn_rate", reply: "✓ Müşteri kayıp oranı hesaplandı", changes: [] } },
  { user_command: "aylık tekrarlayan gelir hesapla", logic: "monthly recurring revenue MRR calculation", category: "analysis", output: { action: "sum", column: "mrr", reply: "✓ Aylık tekrarlayan gelir hesaplandı", changes: [] } },
  { user_command: "senaryo analizi yap", logic: "scenario analysis what if modeling", category: "analysis", output: { action: "message", formula: "scenario_analysis", reply: "📊 Senaryo analizi tamamlandı", changes: [] } },
  { user_command: "duyarlılık analizi yap", logic: "sensitivity analysis variable impact", category: "analysis", output: { action: "message", formula: "sensitivity_analysis", reply: "📊 Duyarlılık analizi tamamlandı", changes: [] } },
  { user_command: "kpi dashboard oluştur", logic: "KPI key performance indicator dashboard", category: "analysis", output: { action: "message", formula: "kpi_dashboard", reply: "📊 KPI dashboard oluşturuldu", changes: [] } },
  { user_command: "yönetici özeti hazırla", logic: "executive summary report preparation", category: "analysis", output: { action: "message", formula: "executive_summary", reply: "📊 Yönetici özeti hazırlandı", changes: [] } },
  { user_command: "çeyreklik performans raporu oluştur", logic: "quarterly performance report Q report", category: "analysis", output: { action: "message", formula: "quarterly_report", reply: "📊 Çeyreklik performans raporu oluşturuldu", changes: [] } },
  { user_command: "yıllık karşılaştırma tablosu yap", logic: "year over year comparison table", category: "analysis", output: { action: "compare", type: "yoy", reply: "📊 Yıllık karşılaştırma tablosu hazırlandı", changes: [] } },

  // ════════════════════════════════════════════════════════
  // 7. MÜŞTERİ YÖNETİMİ / CRM (14 örnek)
  // ════════════════════════════════════════════════════════
  { user_command: "müşteri segmentasyonu yap", logic: "customer segmentation analysis RFM", category: "crm", output: { action: "classify", reply: "📊 Müşteri segmentasyonu yapıldı", changes: [] } },
  { user_command: "rfm analizi yap", logic: "RFM recency frequency monetary analysis", category: "crm", output: { action: "message", formula: "rfm_analysis", reply: "📊 RFM analizi tamamlandı", changes: [] } },
  { user_command: "müşteri yaşam boyu değeri hesapla", logic: "customer lifetime value CLV LTV", category: "crm", output: { action: "update_cells", formula: "clv", reply: "✓ Müşteri yaşam boyu değeri hesaplandı", changes: [] } },
  { user_command: "en değerli müşterileri listele", logic: "list most valuable top customers", category: "crm", output: { action: "top_n", column: "gelir", n: 10, reply: "✓ En değerli müşteriler listelendi", changes: [] } },
  { user_command: "inaktif müşterileri bul", logic: "find inactive dormant customers", category: "crm", output: { action: "filter", condition: "inactive", reply: "✓ İnaktif müşteriler bulundu", changes: [] } },
  { user_command: "müşteri şikayet oranı hesapla", logic: "customer complaint rate calculation", category: "crm", output: { action: "update_cells", formula: "complaint_rate", reply: "✓ Müşteri şikayet oranı hesaplandı", changes: [] } },
  { user_command: "satış pipeline analizi yap", logic: "sales pipeline funnel analysis", category: "crm", output: { action: "message", formula: "pipeline_analysis", reply: "📊 Satış pipeline analizi tamamlandı", changes: [] } },
  { user_command: "teklif kabul oranını hesapla", logic: "quote acceptance win rate calculation", category: "crm", output: { action: "update_cells", formula: "win_rate", reply: "✓ Teklif kabul oranı hesaplandı", changes: [] } },
  { user_command: "bölgeye göre müşteri dağılımı", logic: "customer distribution by region", category: "crm", output: { action: "group_by", column: "bölge", reply: "📊 Bölgeye göre müşteri dağılımı gösterildi", changes: [] } },
  { user_command: "müşteri memnuniyeti skorunu hesapla", logic: "customer satisfaction NPS score", category: "crm", output: { action: "average", column: "puan", reply: "✓ Müşteri memnuniyeti skoru hesaplandı", changes: [] } },
  { user_command: "yeniden satın alma oranını hesapla", logic: "repeat purchase retention rate", category: "crm", output: { action: "update_cells", formula: "repeat_rate", reply: "✓ Yeniden satın alma oranı hesaplandı", changes: [] } },
  { user_command: "fırsat değerini topla", logic: "sum opportunity value pipeline", category: "crm", output: { action: "sum", column: "fırsat", reply: "✓ Fırsat değerleri toplandı", changes: [] } },
  { user_command: "müşteri başına ortalama işlem tutarı", logic: "average transaction amount per customer", category: "crm", output: { action: "average", column: "tutar", reply: "✓ Ortalama işlem tutarı hesaplandı", changes: [] } },
  { user_command: "iletişim kanalı performansını analiz et", logic: "communication channel performance analysis", category: "crm", output: { action: "group_by", column: "kanal", aggregate: "count", reply: "📊 Kanal performansı analiz edildi", changes: [] } },

  // ════════════════════════════════════════════════════════
  // 8. PROJE VE GÖREV YÖNETİMİ (12 örnek)
  // ════════════════════════════════════════════════════════
  { user_command: "proje durumunu güncelle", logic: "update project status column", category: "project", output: { action: "update_cells", formula: "project_status", reply: "✓ Proje durumu güncellendi", changes: [] } },
  { user_command: "tamamlanma yüzdesini hesapla", logic: "calculate completion percentage progress", category: "project", output: { action: "update_cells", formula: "completion_percent", reply: "✓ Tamamlanma yüzdesi hesaplandı", changes: [] } },
  { user_command: "geciken görevleri işaretle", logic: "mark overdue late tasks red", category: "project", output: { action: "highlight", condition: "overdue", color: "#fecaca", reply: "✓ Geciken görevler işaretlendi", changes: [] } },
  { user_command: "gantt tablosu için veri hazırla", logic: "Gantt chart data preparation timeline", category: "project", output: { action: "message", formula: "gantt_data", reply: "📊 Gantt tablosu verisi hazırlandı", changes: [] } },
  { user_command: "görev önceliklerine göre sırala", logic: "sort tasks by priority high medium low", category: "project", output: { action: "sort", column: "öncelik", direction: "desc", reply: "✓ Görevler önceliğe göre sıralandı", changes: [] } },
  { user_command: "kişiye göre görev sayısı", logic: "count tasks per person assignee", category: "project", output: { action: "group_by", column: "sorumlu", aggregate: "count", reply: "📊 Kişi başına görev sayısı gösterildi", changes: [] } },
  { user_command: "bütçe vs gerçekleşen karşılaştır", logic: "budget vs actual comparison variance", category: "project", output: { action: "compare", type: "budget_vs_actual", reply: "📊 Bütçe/Gerçekleşen karşılaştırması yapıldı", changes: [] } },
  { user_command: "sprint raporu oluştur", logic: "sprint report agile scrum summary", category: "project", output: { action: "message", formula: "sprint_report", reply: "📊 Sprint raporu oluşturuldu", changes: [] } },
  { user_command: "kaynak kullanımını hesapla", logic: "resource utilization capacity calculation", category: "project", output: { action: "update_cells", formula: "resource_utilization", reply: "✓ Kaynak kullanımı hesaplandı", changes: [] } },
  { user_command: "risk matrisini oluştur", logic: "risk matrix probability impact", category: "project", output: { action: "message", formula: "risk_matrix", reply: "📊 Risk matrisi oluşturuldu", changes: [] } },
  { user_command: "haftalık ilerleme raporunu hazırla", logic: "weekly progress status report", category: "project", output: { action: "message", formula: "weekly_progress", reply: "📊 Haftalık ilerleme raporu hazırlandı", changes: [] } },
  { user_command: "milestone tarihlerini kontrol et", logic: "check milestone dates deadlines", category: "project", output: { action: "filter", condition: "upcoming_milestones", reply: "✓ Milestone tarihleri kontrol edildi", changes: [] } },

  // ════════════════════════════════════════════════════════
  // 9. DOĞAL DİL — KARMAŞIK KOMUTLAR (16 örnek)
  // ════════════════════════════════════════════════════════
  { user_command: "en karlı ürünleri yeşil en zararlıları kırmızı yap", logic: "color most profitable green most loss red", category: "highlighting", output: { action: "highlight", condition: "profit_loss_color", color: "#bbf7d0", reply: "✓ Karlılar yeşil zararlılar kırmızı yapıldı", changes: [] } },
  { user_command: "boş satırları sil ve a dan z ye sırala", logic: "delete empty rows then sort A to Z", category: "cleaning", output: { action: "delete_rows", condition: "empty", next_action: "sort", direction: "asc", reply: "✓ Boş satırlar silindi ve A'dan Z'ye sıralandı", changes: [] } },
  { user_command: "kdv ekle ve en yüksek 5i sarıya boya", logic: "add VAT then highlight top 5 yellow", category: "finance", output: { action: "update_cells", formula: "multiply", factor: 1.20, next_action: "highlight", reply: "✓ KDV eklendi ve en yüksek 5 değer sarıya boyandı", changes: [] } },
  { user_command: "fiyatları büyükten küçüğe sırala ve topla", logic: "sort prices descending then sum", category: "calculation", output: { action: "sort", direction: "desc", next_action: "sum", reply: "✓ Fiyatlar sıralandı ve toplandı", changes: [] } },
  { user_command: "hangi ürün en çok gelir getiriyor", logic: "which product generates most revenue", category: "analysis", output: { action: "max", column: "gelir", reply: "✓ En çok gelir getiren ürün bulundu", changes: [] } },
  { user_command: "bu ay ne kadar sattık", logic: "how much sold this month total", category: "analysis", output: { action: "sum", condition: "currentMonth", reply: "✓ Bu ayki satış toplamı hesaplandı", changes: [] } },
  { user_command: "geçen yıla göre büyüme ne kadar", logic: "growth compared to last year percentage", category: "analysis", output: { action: "compare", type: "yoy", reply: "📊 Geçen yıla göre büyüme hesaplandı", changes: [] } },
  { user_command: "hangi çalışan en çok satış yaptı", logic: "which employee made most sales", category: "analysis", output: { action: "max", column: "satış", reply: "✓ En çok satış yapan çalışan bulundu", changes: [] } },
  { user_command: "hangi şehirden en çok sipariş geliyor", logic: "which city most orders come from", category: "analysis", output: { action: "group_by", column: "şehir", aggregate: "count", reply: "📊 Şehir bazlı sipariş analizi yapıldı", changes: [] } },
  { user_command: "bütçe aşımı var mı kontrol et", logic: "check if budget overrun exceeded", category: "analysis", output: { action: "validate", check: "budget_overrun", reply: "✓ Bütçe aşımı kontrolü yapıldı", changes: [] } },
  { user_command: "son 3 ayın ortalamasını hesapla", logic: "calculate last 3 months average", category: "analysis", output: { action: "average", condition: "last3months", reply: "✓ Son 3 aylık ortalama hesaplandı", changes: [] } },
  { user_command: "hedefin yüzde kaçını tamamladık", logic: "what percentage of target completed", category: "analysis", output: { action: "update_cells", formula: "target_completion", reply: "✓ Hedef tamamlanma yüzdesi hesaplandı", changes: [] } },
  { user_command: "en az stokta kalan ürünler hangileri", logic: "which products have least stock remaining", category: "inventory", output: { action: "top_n", column: "stok", n: 5, direction: "asc", reply: "✓ En az stoklu ürünler listelendi", changes: [] } },
  { user_command: "toplam maliyeti ve geliri karşılaştır", logic: "compare total cost vs total revenue", category: "analysis", output: { action: "compare", type: "cost_vs_revenue", reply: "📊 Maliyet/Gelir karşılaştırması yapıldı", changes: [] } },
  { user_command: "tüm verileri düzenle ve rapor hazırla", logic: "clean all data and prepare report", category: "analysis", output: { action: "message", formula: "clean_and_report", reply: "📊 Veriler düzenlendi ve rapor hazırlandı", changes: [] } },
  { user_command: "pazartesi ile cuma arası satışları göster", logic: "show sales between Monday and Friday", category: "filtering", output: { action: "filter", condition: "weekdays", reply: "✓ Hafta içi satışlar gösterildi", changes: [] } },

];

module.exports = { EXCEL_DATASET_V5 };
