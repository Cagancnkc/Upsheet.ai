// ============================================================
// MOCKSHEETS DATASET v3.0
// 353 örnek, 20 kategori, 35+ action tipi
// ============================================================

const EXCEL_DATASET = [

  // ════════════════════════════════════════════════════════
  // 1. SIRALAMA — sort (22 örnek)
  // ════════════════════════════════════════════════════════
  { user_command: "a dan z ye sırala", output: { action: "sort", direction: "asc", reply: "✓ A'dan Z'ye sıralandı", changes: [] } },
  { user_command: "z den a ya sırala", output: { action: "sort", direction: "desc", reply: "✓ Z'den A'ya sıralandı", changes: [] } },
  { user_command: "küçükten büyüğe sırala", output: { action: "sort", direction: "asc", reply: "✓ Küçükten büyüğe sıralandı", changes: [] } },
  { user_command: "büyükten küçüğe sırala", output: { action: "sort", direction: "desc", reply: "✓ Büyükten küçüğe sıralandı", changes: [] } },
  { user_command: "alfabetik sırala", output: { action: "sort", direction: "asc", reply: "✓ Alfabetik sıralandı", changes: [] } },
  { user_command: "artan sırayla diz", output: { action: "sort", direction: "asc", reply: "✓ Artan sırayla dizildi", changes: [] } },
  { user_command: "azalan sırayla diz", output: { action: "sort", direction: "desc", reply: "✓ Azalan sırayla dizildi", changes: [] } },
  { user_command: "fiyata göre sırala", output: { action: "sort", column: "fiyat", direction: "asc", reply: "✓ Fiyata göre sıralandı", changes: [] } },
  { user_command: "tarihe göre sırala", output: { action: "sort", column: "tarih", direction: "asc", reply: "✓ Tarihe göre sıralandı", changes: [] } },
  { user_command: "isme göre alfabetik sırala", output: { action: "sort", column: "isim", direction: "asc", reply: "✓ İsime göre sıralandı", changes: [] } },
  { user_command: "miktara göre büyükten küçüğe", output: { action: "sort", column: "miktar", direction: "desc", reply: "✓ Miktara göre sıralandı", changes: [] } },
  { user_command: "b sütununu sırala", output: { action: "sort", column: "B", direction: "asc", reply: "✓ B sütunu sıralandı", changes: [] } },
  { user_command: "satışa göre en yüksekten sırala", output: { action: "sort", column: "satış", direction: "desc", reply: "✓ Satışa göre sıralandı", changes: [] } },
  { user_command: "fiyata göre büyükten küçüğe", output: { action: "sort", column: "fiyat", direction: "desc", reply: "✓ Fiyata göre azalan sıralandı", changes: [] } },
  { user_command: "puana göre en yüksekten", output: { action: "sort", column: "puan", direction: "desc", reply: "✓ Puana göre sıralandı", changes: [] } },
  { user_command: "tarihe göre en yeniden en eskiye", output: { action: "sort", column: "tarih", direction: "desc", reply: "✓ Tarihe göre azalan sıralandı", changes: [] } },
  { user_command: "müşteri adına göre sırala", output: { action: "sort", column: "müşteri", direction: "asc", reply: "✓ Müşteri adına göre sıralandı", changes: [] } },
  { user_command: "stok miktarına göre sırala", output: { action: "sort", column: "stok", direction: "asc", reply: "✓ Stok miktarına göre sıralandı", changes: [] } },
  { user_command: "tutara göre sırala", output: { action: "sort", column: "tutar", direction: "asc", reply: "✓ Tutara göre sıralandı", changes: [] } },
  { user_command: "en pahalıdan sırala", output: { action: "sort", column: "fiyat", direction: "desc", reply: "✓ En pahalıdan sıralandı", changes: [] } },
  { user_command: "en ucuzdan sırala", output: { action: "sort", column: "fiyat", direction: "asc", reply: "✓ En ucuzdan sıralandı", changes: [] } },
  { user_command: "sipariş numarasına göre sırala", output: { action: "sort", column: "sipariş", direction: "asc", reply: "✓ Sipariş numarasına göre sıralandı", changes: [] } },

  // ════════════════════════════════════════════════════════
  // 2. TOPLAMA — sum (18 örnek)
  // ════════════════════════════════════════════════════════
  { user_command: "topla", output: { action: "sum", reply: "✓ Toplam hesaplandı", changes: [] } },
  { user_command: "toplam al", output: { action: "sum", reply: "✓ Toplam alındı", changes: [] } },
  { user_command: "hepsini topla", output: { action: "sum", reply: "✓ Tümü toplandı", changes: [] } },
  { user_command: "toplam kaç", output: { action: "sum", reply: "✓ Toplam hesaplandı", changes: [] } },
  { user_command: "genel toplam", output: { action: "sum", reply: "✓ Genel toplam hesaplandı", changes: [] } },
  { user_command: "b sütununu topla", output: { action: "sum", column: "B", reply: "✓ B sütunu toplandı", changes: [] } },
  { user_command: "c kolonunu topla", output: { action: "sum", column: "C", reply: "✓ C kolonu toplandı", changes: [] } },
  { user_command: "fiyatları topla", output: { action: "sum", column: "fiyat", reply: "✓ Fiyatlar toplandı", changes: [] } },
  { user_command: "satışları topla", output: { action: "sum", column: "satış", reply: "✓ Satışlar toplandı", changes: [] } },
  { user_command: "gelirlerin toplamı ne", output: { action: "sum", column: "gelir", reply: "✓ Gelirler toplandı", changes: [] } },
  { user_command: "tutarları topla", output: { action: "sum", column: "tutar", reply: "✓ Tutarlar toplandı", changes: [] } },
  { user_command: "giderleri topla", output: { action: "sum", column: "gider", reply: "✓ Giderler toplandı", changes: [] } },
  { user_command: "miktarları topla", output: { action: "sum", column: "miktar", reply: "✓ Miktarlar toplandı", changes: [] } },
  { user_command: "tüm satışların toplamını bul", output: { action: "sum", column: "satış", reply: "✓ Satışlar toplandı", changes: [] } },
  { user_command: "ciro toplamı", output: { action: "sum", column: "ciro", reply: "✓ Ciro toplamı hesaplandı", changes: [] } },
  { user_command: "hasılat topla", output: { action: "sum", column: "hasılat", reply: "✓ Hasılat toplandı", changes: [] } },
  { user_command: "kasa bakiyesi topla", output: { action: "sum", column: "kasa", reply: "✓ Kasa bakiyesi toplandı", changes: [] } },
  { user_command: "borç toplamı ne kadar", output: { action: "sum", column: "borç", reply: "✓ Borç toplamı hesaplandı", changes: [] } },

  // ════════════════════════════════════════════════════════
  // 3. ORTALAMA — average (14 örnek)
  // ════════════════════════════════════════════════════════
  { user_command: "ortalama al", output: { action: "average", reply: "✓ Ortalama hesaplandı", changes: [] } },
  { user_command: "ortalamasını hesapla", output: { action: "average", reply: "✓ Ortalama hesaplandı", changes: [] } },
  { user_command: "ortalama ne", output: { action: "average", reply: "✓ Ortalama hesaplandı", changes: [] } },
  { user_command: "b sütununun ortalaması ne", output: { action: "average", column: "B", reply: "✓ B sütununun ortalaması hesaplandı", changes: [] } },
  { user_command: "fiyatların ortalamasını bul", output: { action: "average", column: "fiyat", reply: "✓ Fiyat ortalaması bulundu", changes: [] } },
  { user_command: "satış ortalaması hesapla", output: { action: "average", column: "satış", reply: "✓ Satış ortalaması hesaplandı", changes: [] } },
  { user_command: "aylık ortalama satış", output: { action: "average", column: "satış", reply: "✓ Aylık ortalama hesaplandı", changes: [] } },
  { user_command: "maaş ortalaması ne kadar", output: { action: "average", column: "maaş", reply: "✓ Maaş ortalaması hesaplandı", changes: [] } },
  { user_command: "not ortalaması hesapla", output: { action: "average", column: "not", reply: "✓ Not ortalaması hesaplandı", changes: [] } },
  { user_command: "prim ortalaması bul", output: { action: "average", column: "prim", reply: "✓ Prim ortalaması bulundu", changes: [] } },
  { user_command: "gelir ortalaması ne", output: { action: "average", column: "gelir", reply: "✓ Gelir ortalaması hesaplandı", changes: [] } },
  { user_command: "sipariş tutarı ortalaması", output: { action: "average", column: "tutar", reply: "✓ Sipariş ortalaması hesaplandı", changes: [] } },
  { user_command: "müşteri başına ortalama sipariş", output: { action: "average", column: "tutar", reply: "✓ Müşteri başına ortalama hesaplandı", changes: [] } },
  { user_command: "kâr marjı ortalaması", output: { action: "average", column: "kar", reply: "✓ Kâr marjı ortalaması hesaplandı", changes: [] } },

  // ════════════════════════════════════════════════════════
  // 4. MIN / MAX (14 örnek)
  // ════════════════════════════════════════════════════════
  { user_command: "en büyük değeri bul", output: { action: "max", reply: "✓ En büyük değer bulundu", changes: [] } },
  { user_command: "maksimum değer ne", output: { action: "max", reply: "✓ Maksimum değer gösterildi", changes: [] } },
  { user_command: "en yüksek fiyat ne", output: { action: "max", column: "fiyat", reply: "✓ En yüksek fiyat bulundu", changes: [] } },
  { user_command: "en çok satan ürün hangisi", output: { action: "max", column: "satış", reply: "✓ En çok satan bulundu", changes: [] } },
  { user_command: "en küçük değeri göster", output: { action: "min", reply: "✓ En küçük değer gösterildi", changes: [] } },
  { user_command: "minimum değer kaç", output: { action: "min", reply: "✓ Minimum değer bulundu", changes: [] } },
  { user_command: "en düşük fiyat", output: { action: "min", column: "fiyat", reply: "✓ En düşük fiyat bulundu", changes: [] } },
  { user_command: "en az satan hangisi", output: { action: "min", column: "satış", reply: "✓ En az satan bulundu", changes: [] } },
  { user_command: "en yüksek 5 değeri göster", output: { action: "top_n", n: 5, reply: "✓ En yüksek 5 değer gösterildi", changes: [] } },
  { user_command: "en çok satan 5 ürünü listele", output: { action: "top_n", column: "satış", n: 5, reply: "✓ En çok satan 5 ürün listelendi", changes: [] } },
  { user_command: "ilk 10 kaydı listele", output: { action: "top_n", n: 10, reply: "✓ İlk 10 kayıt listelendi", changes: [] } },
  { user_command: "en yüksek maaş ne kadar", output: { action: "max", column: "maaş", reply: "✓ En yüksek maaş bulundu", changes: [] } },
  { user_command: "en düşük stok hangisi", output: { action: "min", column: "stok", reply: "✓ En düşük stok bulundu", changes: [] } },
  { user_command: "rekor satışı bul", output: { action: "max", column: "satış", reply: "✓ Rekor satış bulundu", changes: [] } },

  // ════════════════════════════════════════════════════════
  // 5. SAYMA — count (10 örnek)
  // ════════════════════════════════════════════════════════
  { user_command: "kaç kayıt var", output: { action: "count", reply: "✓ Kayıt sayısı hesaplandı", changes: [] } },
  { user_command: "satır sayısını say", output: { action: "count", reply: "✓ Satır sayısı sayıldı", changes: [] } },
  { user_command: "kaç tane", output: { action: "count", reply: "✓ Toplam kayıt sayısı bulundu", changes: [] } },
  { user_command: "istanbul kaç tane", output: { action: "count_if", condition: "contains", value: "istanbul", reply: "✓ İstanbul içeren kayıtlar sayıldı", changes: [] } },
  { user_command: "100den büyük kaç satır var", output: { action: "count_if", condition: "value > 100", reply: "✓ 100'den büyük satırlar sayıldı", changes: [] } },
  { user_command: "boş hücre sayısı", output: { action: "count_blank", reply: "✓ Boş hücreler sayıldı", changes: [] } },
  { user_command: "aktif müşteri sayısı", output: { action: "count_if", condition: "contains", value: "aktif", reply: "✓ Aktif müşteriler sayıldı", changes: [] } },
  { user_command: "kaç farklı kategori var", output: { action: "count_unique", reply: "✓ Benzersiz kategoriler sayıldı", changes: [] } },
  { user_command: "negatif değer sayısı", output: { action: "count_if", condition: "value < 0", reply: "✓ Negatif değerler sayıldı", changes: [] } },
  { user_command: "toplam ürün çeşidi", output: { action: "count_unique", column: "ürün", reply: "✓ Ürün çeşidi sayıldı", changes: [] } },

  // ════════════════════════════════════════════════════════
  // 6. BOŞ SATIR / VERİ SİLME (18 örnek)
  // ════════════════════════════════════════════════════════
  { user_command: "boş satırları sil", output: { action: "delete_rows", condition: "empty", reply: "✓ Boş satırlar silindi", changes: [] } },
  { user_command: "boşları temizle", output: { action: "delete_rows", condition: "empty", reply: "✓ Boş satırlar temizlendi", changes: [] } },
  { user_command: "boş olanları kaldır", output: { action: "delete_rows", condition: "empty", reply: "✓ Boş satırlar kaldırıldı", changes: [] } },
  { user_command: "dolu satırları bırak boşları sil", output: { action: "delete_rows", condition: "empty", reply: "✓ Boş satırlar temizlendi", changes: [] } },
  { user_command: "veri olmayan satırları kaldır", output: { action: "delete_rows", condition: "empty", reply: "✓ Veri olmayan satırlar kaldırıldı", changes: [] } },
  { user_command: "sıfır olan satırları sil", output: { action: "delete_rows", condition: "value == 0", reply: "✓ Sıfır değerli satırlar silindi", changes: [] } },
  { user_command: "negatif satırları kaldır", output: { action: "delete_rows", condition: "value < 0", reply: "✓ Negatif satırlar kaldırıldı", changes: [] } },
  { user_command: "0 değerli satırları temizle", output: { action: "delete_rows", condition: "value == 0", reply: "✓ Sıfır değerli satırlar temizlendi", changes: [] } },
  { user_command: "iptal edilen siparişleri sil", output: { action: "delete_rows", condition: "contains_iptal", reply: "✓ İptal edilen siparişler silindi", changes: [] } },
  { user_command: "eski kayıtları temizle", output: { action: "delete_rows", condition: "old_records", reply: "✓ Eski kayıtlar temizlendi", changes: [] } },
  { user_command: "silinmiş olanları kaldır", output: { action: "delete_rows", condition: "contains_silindi", reply: "✓ Silindi işaretli kayıtlar kaldırıldı", changes: [] } },
  { user_command: "pasif kayıtları sil", output: { action: "delete_rows", condition: "contains_pasif", reply: "✓ Pasif kayıtlar silindi", changes: [] } },
  { user_command: "hatalı satırları kaldır", output: { action: "delete_rows", condition: "error", reply: "✓ Hatalı satırlar kaldırıldı", changes: [] } },
  { user_command: "test verilerini sil", output: { action: "delete_rows", condition: "contains_test", reply: "✓ Test verileri silindi", changes: [] } },
  { user_command: "stok sıfır olanları kaldır", output: { action: "delete_rows", condition: "value == 0", reply: "✓ Stok sıfır olan satırlar kaldırıldı", changes: [] } },
  { user_command: "bütçe aşan satırları sil", output: { action: "delete_rows", condition: "over_budget", reply: "✓ Bütçe aşan satırlar silindi", changes: [] } },
  { user_command: "geçmiş tarihli kayıtları kaldır", output: { action: "delete_rows", condition: "past_date", reply: "✓ Geçmiş tarihli kayıtlar kaldırıldı", changes: [] } },
  { user_command: "boş ad soyad olanları sil", output: { action: "delete_rows", condition: "empty_name", reply: "✓ Boş ad soyad olan satırlar silindi", changes: [] } },

  // ════════════════════════════════════════════════════════
  // 7. TEKRAR KALDIRMA (10 örnek)
  // ════════════════════════════════════════════════════════
  { user_command: "tekrar edenleri sil", output: { action: "remove_duplicates", reply: "✓ Tekrarlanan satırlar silindi", changes: [] } },
  { user_command: "mükerrerleri kaldır", output: { action: "remove_duplicates", reply: "✓ Mükerrer kayıtlar kaldırıldı", changes: [] } },
  { user_command: "aynı olanları temizle", output: { action: "remove_duplicates", reply: "✓ Tekrarlar temizlendi", changes: [] } },
  { user_command: "kopya kayıtları sil", output: { action: "remove_duplicates", reply: "✓ Kopya kayıtlar silindi", changes: [] } },
  { user_command: "benzersiz kayıtları bırak", output: { action: "remove_duplicates", reply: "✓ Tekrar eden kayıtlar kaldırıldı", changes: [] } },
  { user_command: "duplicate kaldır", output: { action: "remove_duplicates", reply: "✓ Duplicate kayıtlar kaldırıldı", changes: [] } },
  { user_command: "tekrarlı müşterileri temizle", output: { action: "remove_duplicates", reply: "✓ Tekrarlı müşteriler temizlendi", changes: [] } },
  { user_command: "çift kayıtları sil", output: { action: "remove_duplicates", reply: "✓ Çift kayıtlar silindi", changes: [] } },
  { user_command: "aynı TC kimlikli olanları kaldır", output: { action: "remove_duplicates", reply: "✓ Aynı TC kimlikli kayıtlar kaldırıldı", changes: [] } },
  { user_command: "tekrar eden ürün kodlarını temizle", output: { action: "remove_duplicates", reply: "✓ Tekrar eden ürün kodları temizlendi", changes: [] } },

  // ════════════════════════════════════════════════════════
  // 8. RENKLENDİRME / HIGHLIGHT (25 örnek)
  // ════════════════════════════════════════════════════════
  { user_command: "negatifleri kırmızıya boya", output: { action: "highlight", condition: "value < 0", color: "#fecaca", reply: "✓ Negatif değerler kırmızıya boyandı", changes: [] } },
  { user_command: "eksileri kırmızı yap", output: { action: "highlight", condition: "value < 0", color: "#fecaca", reply: "✓ Eksi değerler kırmızıya boyandı", changes: [] } },
  { user_command: "sıfırdan küçük olanları kırmızıya boya", output: { action: "highlight", condition: "value < 0", color: "#fecaca", reply: "✓ Negatif hücreler boyandı", changes: [] } },
  { user_command: "zararda olanları kırmızı işaretle", output: { action: "highlight", condition: "value < 0", color: "#fecaca", reply: "✓ Zararda olanlar kırmızıya boyandı", changes: [] } },
  { user_command: "eksi bakiye olanları kırmızı yap", output: { action: "highlight", condition: "value < 0", color: "#fecaca", reply: "✓ Eksi bakiyeler kırmızıya boyandı", changes: [] } },
  { user_command: "pozitif değerleri yeşile boya", output: { action: "highlight", condition: "value > 0", color: "#bbf7d0", reply: "✓ Pozitif değerler yeşile boyandı", changes: [] } },
  { user_command: "artıları yeşil yap", output: { action: "highlight", condition: "value > 0", color: "#bbf7d0", reply: "✓ Artı değerler yeşile boyandı", changes: [] } },
  { user_command: "karda olanları yeşil yap", output: { action: "highlight", condition: "value > 0", color: "#bbf7d0", reply: "✓ Karda olanlar yeşile boyandı", changes: [] } },
  { user_command: "hedefi geçenleri yeşile boya", output: { action: "highlight", condition: "value > 0", color: "#bbf7d0", reply: "✓ Hedefi geçenler yeşile boyandı", changes: [] } },
  { user_command: "en büyük 5 değeri sarıya boya", output: { action: "highlight", condition: "top5", color: "#fef08a", reply: "✓ En büyük 5 değer sarıya boyandı", changes: [] } },
  { user_command: "en yüksek 3 değeri vurgula", output: { action: "highlight", condition: "top3", color: "#fef08a", reply: "✓ En yüksek 3 değer vurgulandı", changes: [] } },
  { user_command: "en büyük 10 değeri işaretle", output: { action: "highlight", condition: "top10", color: "#fef08a", reply: "✓ En büyük 10 değer işaretlendi", changes: [] } },
  { user_command: "100den büyükleri maviye boya", output: { action: "highlight", condition: "value > 100", color: "#bfdbfe", reply: "✓ 100'den büyük değerler maviye boyandı", changes: [] } },
  { user_command: "500den az olanları sarıya boya", output: { action: "highlight", condition: "value < 500", color: "#fef08a", reply: "✓ 500'den az değerler sarıya boyandı", changes: [] } },
  { user_command: "hücreleri renklendir", output: { action: "highlight", condition: "numeric", color: "#fef08a", reply: "✓ Sayısal hücreler renklendirildi", changes: [] } },
  { user_command: "renkleri temizle", output: { action: "clear_colors", reply: "✓ Tüm renkler temizlendi", changes: [] } },
  { user_command: "boyaları kaldır", output: { action: "clear_colors", reply: "✓ Hücre renkleri kaldırıldı", changes: [] } },
  { user_command: "kritik stokları kırmızıya boya", output: { action: "highlight", condition: "value < 10", color: "#fecaca", reply: "✓ Kritik stoklar kırmızıya boyandı", changes: [] } },
  { user_command: "gecikmiş ödemeleri vurgula", output: { action: "highlight", condition: "overdue", color: "#fecaca", reply: "✓ Gecikmiş ödemeler vurgulandı", changes: [] } },
  { user_command: "bütçe aşımlarını işaretle", output: { action: "highlight", condition: "over_budget", color: "#fecaca", reply: "✓ Bütçe aşımları işaretlendi", changes: [] } },
  { user_command: "yüksek riskli müşterileri kırmızı yap", output: { action: "highlight", condition: "high_risk", color: "#fecaca", reply: "✓ Yüksek riskli müşteriler işaretlendi", changes: [] } },
  { user_command: "satış hedefini tutturanları yeşil yap", output: { action: "highlight", condition: "target_met", color: "#bbf7d0", reply: "✓ Hedef tutturanlar yeşile boyandı", changes: [] } },
  { user_command: "1000den fazla olanları sarıya boya", output: { action: "highlight", condition: "value > 1000", color: "#fef08a", reply: "✓ 1000'den fazla değerler sarıya boyandı", changes: [] } },
  { user_command: "sıfır stokları kırmızıya boya", output: { action: "highlight", condition: "value == 0", color: "#fecaca", reply: "✓ Sıfır stoklar kırmızıya boyandı", changes: [] } },
  { user_command: "vadeyi geçenleri turuncu yap", output: { action: "highlight", condition: "overdue", color: "#fed7aa", reply: "✓ Vadeyi geçenler turuncuya boyandı", changes: [] } },

  // ════════════════════════════════════════════════════════
  // 9. KDV VE VERGİ HESAPLAMA (22 örnek)
  // ════════════════════════════════════════════════════════
  { user_command: "kdv ekle", output: { action: "update_cells", formula: "multiply", factor: 1.20, reply: "✓ %20 KDV eklendi", changes: [] } },
  { user_command: "kdv hesapla", output: { action: "update_cells", formula: "multiply", factor: 1.20, reply: "✓ KDV hesaplandı", changes: [] } },
  { user_command: "yüzde yirmi kdv ekle", output: { action: "update_cells", formula: "multiply", factor: 1.20, reply: "✓ %20 KDV eklendi", changes: [] } },
  { user_command: "fiyatlara kdv ekle", output: { action: "update_cells", formula: "multiply", column: "fiyat", factor: 1.20, reply: "✓ Fiyatlara KDV eklendi", changes: [] } },
  { user_command: "kdv dahil fiyatları hesapla", output: { action: "update_cells", formula: "multiply", factor: 1.20, reply: "✓ KDV dahil fiyatlar hesaplandı", changes: [] } },
  { user_command: "%20 kdv ekle", output: { action: "update_cells", formula: "multiply", factor: 1.20, reply: "✓ %20 KDV eklendi", changes: [] } },
  { user_command: "kdv hariç fiyat bul", output: { action: "update_cells", formula: "divide", factor: 1.20, reply: "✓ KDV hariç fiyatlar hesaplandı", changes: [] } },
  { user_command: "kdv düş", output: { action: "update_cells", formula: "divide", factor: 1.20, reply: "✓ KDV düşüldü", changes: [] } },
  { user_command: "kdv tutarını hesapla", output: { action: "update_cells", formula: "vat_amount", factor: 0.20, reply: "✓ KDV tutarı hesaplandı", changes: [] } },
  { user_command: "kdv tutarını ayrı göster", output: { action: "update_cells", formula: "vat_amount", factor: 0.20, reply: "✓ KDV tutarları ayrıldı", changes: [] } },
  { user_command: "%10 kdv ekle", output: { action: "update_cells", formula: "multiply", factor: 1.10, reply: "✓ %10 KDV eklendi", changes: [] } },
  { user_command: "%8 kdv hesapla", output: { action: "update_cells", formula: "multiply", factor: 1.08, reply: "✓ %8 KDV hesaplandı", changes: [] } },
  { user_command: "özel tüketim vergisi ekle", output: { action: "update_cells", formula: "otv", reply: "✓ ÖTV eklendi", changes: [] } },
  { user_command: "damga vergisi hesapla", output: { action: "update_cells", formula: "stamp_tax", factor: 0.00948, reply: "✓ Damga vergisi hesaplandı", changes: [] } },
  { user_command: "stopaj hesapla", output: { action: "update_cells", formula: "withholding_tax", reply: "✓ Stopaj hesaplandı", changes: [] } },
  { user_command: "gelir vergisi dilimi hesapla", output: { action: "update_cells", formula: "income_tax_bracket", reply: "✓ Gelir vergisi hesaplandı", changes: [] } },
  { user_command: "kurumlar vergisi hesapla", output: { action: "update_cells", formula: "corporate_tax", factor: 0.20, reply: "✓ Kurumlar vergisi hesaplandı", changes: [] } },
  { user_command: "geçici vergi hesapla", output: { action: "update_cells", formula: "provisional_tax", reply: "✓ Geçici vergi hesaplandı", changes: [] } },
  { user_command: "kümülatif vergi matrahı hesapla", output: { action: "update_cells", formula: "cumulative_tax_base", reply: "✓ Kümülatif vergi matrahı hesaplandı", changes: [] } },
  { user_command: "tevkifatlı kdv hesapla", output: { action: "update_cells", formula: "withholding_vat", reply: "✓ Tevkifatlı KDV hesaplandı", changes: [] } },
  { user_command: "vergi matrahını bul", output: { action: "update_cells", formula: "tax_base", reply: "✓ Vergi matrahı hesaplandı", changes: [] } },
  { user_command: "kdv beyanname tutarı", output: { action: "sum", column: "kdv", reply: "✓ KDV beyanname tutarı hesaplandı", changes: [] } },

  // ════════════════════════════════════════════════════════
  // 10. MAAŞ VE BORDRO (20 örnek)
  // ════════════════════════════════════════════════════════
  { user_command: "net maaş hesapla", output: { action: "update_cells", formula: "net_salary", reply: "✓ Net maaşlar hesaplandı", changes: [] } },
  { user_command: "net ücret hesapla", output: { action: "update_cells", formula: "net_salary", reply: "✓ Net ücretler hesaplandı", changes: [] } },
  { user_command: "sgk kesintisini hesapla", output: { action: "update_cells", formula: "sgk_deduction", reply: "✓ SGK kesintileri hesaplandı", changes: [] } },
  { user_command: "sgk primi düş", output: { action: "update_cells", formula: "sgk_deduction", reply: "✓ SGK primi düşüldü", changes: [] } },
  { user_command: "işveren sgk payı hesapla", output: { action: "update_cells", formula: "employer_sgk", reply: "✓ İşveren SGK payı hesaplandı", changes: [] } },
  { user_command: "gelir vergisi hesapla", output: { action: "update_cells", formula: "income_tax", reply: "✓ Gelir vergisi hesaplandı", changes: [] } },
  { user_command: "kıdem tazminatı hesapla", output: { action: "update_cells", formula: "severance_pay", reply: "✓ Kıdem tazminatı hesaplandı", changes: [] } },
  { user_command: "ihbar tazminatı hesapla", output: { action: "update_cells", formula: "notice_pay", reply: "✓ İhbar tazminatı hesaplandı", changes: [] } },
  { user_command: "ikramiye ekle", output: { action: "update_cells", formula: "add_bonus", reply: "✓ İkramiye eklendi", changes: [] } },
  { user_command: "brütten nete çevir", output: { action: "update_cells", formula: "gross_to_net", reply: "✓ Brütten nete çevrildi", changes: [] } },
  { user_command: "asgari ücret farkı hesapla", output: { action: "update_cells", formula: "min_wage_diff", reply: "✓ Asgari ücret farkı hesaplandı", changes: [] } },
  { user_command: "yıllık izin ücreti hesapla", output: { action: "update_cells", formula: "vacation_pay", reply: "✓ Yıllık izin ücreti hesaplandı", changes: [] } },
  { user_command: "fazla mesai ücreti hesapla", output: { action: "update_cells", formula: "overtime_pay", reply: "✓ Fazla mesai ücreti hesaplandı", changes: [] } },
  { user_command: "prim hesapla", output: { action: "update_cells", formula: "commission", reply: "✓ Prim hesaplandı", changes: [] } },
  { user_command: "brüt maaş hesapla", output: { action: "update_cells", formula: "gross_salary", reply: "✓ Brüt maaş hesaplandı", changes: [] } },
  { user_command: "işsizlik sigortası hesapla", output: { action: "update_cells", formula: "unemployment_insurance", reply: "✓ İşsizlik sigortası hesaplandı", changes: [] } },
  { user_command: "asgari geçim indirimi hesapla", output: { action: "update_cells", formula: "minimum_living_allowance", reply: "✓ AGİ hesaplandı", changes: [] } },
  { user_command: "maaş bordrosu oluştur", output: { action: "message", formula: "payroll_report", reply: "📊 Maaş bordrosu hazırlandı", changes: [] } },
  { user_command: "toplu maaş artışı uygula", output: { action: "update_cells", formula: "multiply", reply: "✓ Toplu maaş artışı uygulandı", changes: [] } },
  { user_command: "net ödeme tutarı hesapla", output: { action: "update_cells", formula: "net_payment", reply: "✓ Net ödeme tutarı hesaplandı", changes: [] } },

  // ════════════════════════════════════════════════════════
  // 11. YÜZDE / ÇARPMA / BÖLME (15 örnek)
  // ════════════════════════════════════════════════════════
  { user_command: "yüzde 10 artır", output: { action: "update_cells", formula: "multiply", factor: 1.10, reply: "✓ Değerler %10 artırıldı", changes: [] } },
  { user_command: "fiyatları yüzde 20 zammla", output: { action: "update_cells", formula: "multiply", column: "fiyat", factor: 1.20, reply: "✓ Fiyatlar %20 artırıldı", changes: [] } },
  { user_command: "%15 indirim uygula", output: { action: "update_cells", formula: "multiply", factor: 0.85, reply: "✓ %15 indirim uygulandı", changes: [] } },
  { user_command: "yüzde 5 düşür", output: { action: "update_cells", formula: "multiply", factor: 0.95, reply: "✓ Değerler %5 düşürüldü", changes: [] } },
  { user_command: "b sütununu 2 ile çarp", output: { action: "update_cells", formula: "multiply", column: "B", factor: 2, reply: "✓ B sütunu 2 ile çarpıldı", changes: [] } },
  { user_command: "fiyatları 1.5 ile çarp", output: { action: "update_cells", formula: "multiply", column: "fiyat", factor: 1.5, reply: "✓ Fiyatlar 1.5 ile çarpıldı", changes: [] } },
  { user_command: "değerleri 100e böl", output: { action: "update_cells", formula: "divide", factor: 100, reply: "✓ Değerler 100'e bölündü", changes: [] } },
  { user_command: "yüzde değişimini hesapla", output: { action: "update_cells", formula: "percent_change", reply: "✓ Yüzde değişim hesaplandı", changes: [] } },
  { user_command: "enflasyon farkı ekle", output: { action: "update_cells", formula: "inflation_adjustment", reply: "✓ Enflasyon farkı eklendi", changes: [] } },
  { user_command: "dolar kuru ile çarp", output: { action: "update_cells", formula: "multiply_exchange", reply: "✓ Dolar kuru uygulandı", changes: [] } },
  { user_command: "euro fiyatına çevir", output: { action: "update_cells", formula: "currency_convert", reply: "✓ Euro fiyatına çevrildi", changes: [] } },
  { user_command: "fiyat listesine %10 zam yap", output: { action: "update_cells", formula: "multiply", factor: 1.10, reply: "✓ %10 zam uygulandı", changes: [] } },
  { user_command: "satış komisyonu hesapla", output: { action: "update_cells", formula: "commission", reply: "✓ Satış komisyonu hesaplandı", changes: [] } },
  { user_command: "iskonto uygula", output: { action: "update_cells", formula: "discount", reply: "✓ İskonto uygulandı", changes: [] } },
  { user_command: "net karlılık hesapla", output: { action: "update_cells", formula: "net_profit", reply: "✓ Net karlılık hesaplandı", changes: [] } },

  // ════════════════════════════════════════════════════════
  // 12. FİLTRELEME (20 örnek)
  // ════════════════════════════════════════════════════════
  { user_command: "istanbul olanları göster", output: { action: "filter", condition: "contains", value: "istanbul", reply: "✓ İstanbul kayıtları filtrelendi", changes: [] } },
  { user_command: "ankara olanları filtrele", output: { action: "filter", condition: "contains", value: "ankara", reply: "✓ Ankara kayıtları filtrelendi", changes: [] } },
  { user_command: "100 den büyük olanları göster", output: { action: "filter", condition: "value > 100", reply: "✓ 100'den büyük değerler filtrelendi", changes: [] } },
  { user_command: "1000den az olanları filtrele", output: { action: "filter", condition: "value < 1000", reply: "✓ 1000'den az değerler filtrelendi", changes: [] } },
  { user_command: "bu ay olanları göster", output: { action: "filter", condition: "currentMonth", reply: "✓ Bu ayın kayıtları gösterildi", changes: [] } },
  { user_command: "son 30 günü göster", output: { action: "filter", condition: "last30days", reply: "✓ Son 30 günün verileri gösterildi", changes: [] } },
  { user_command: "bu hafta olanları filtrele", output: { action: "filter", condition: "thisWeek", reply: "✓ Bu haftanın kayıtları gösterildi", changes: [] } },
  { user_command: "aktif olanları göster", output: { action: "filter", condition: "contains", value: "aktif", reply: "✓ Aktif kayıtlar gösterildi", changes: [] } },
  { user_command: "tamamlananları filtrele", output: { action: "filter", condition: "contains", value: "tamamlandı", reply: "✓ Tamamlanan kayıtlar filtrelendi", changes: [] } },
  { user_command: "bekleyenleri göster", output: { action: "filter", condition: "contains", value: "bekliyor", reply: "✓ Bekleyen kayıtlar gösterildi", changes: [] } },
  { user_command: "filtreyi kaldır", output: { action: "remove_filter", reply: "✓ Filtre kaldırıldı", changes: [] } },
  { user_command: "tüm veriyi göster", output: { action: "remove_filter", reply: "✓ Tüm veriler gösterildi", changes: [] } },
  { user_command: "filtreleri sıfırla", output: { action: "remove_filter", reply: "✓ Filtreler sıfırlandı", changes: [] } },
  { user_command: "bu yıl olanları göster", output: { action: "filter", condition: "currentYear", reply: "✓ Bu yılın kayıtları gösterildi", changes: [] } },
  { user_command: "stok 10dan az olanları göster", output: { action: "filter", condition: "value < 10", reply: "✓ Düşük stoklar gösterildi", changes: [] } },
  { user_command: "pro planlı kullanıcıları göster", output: { action: "filter", condition: "contains", value: "pro", reply: "✓ Pro kullanıcılar filtrelendi", changes: [] } },
  { user_command: "ödenmemiş faturaları göster", output: { action: "filter", condition: "contains", value: "ödenmedi", reply: "✓ Ödenmemiş faturalar gösterildi", changes: [] } },
  { user_command: "iptal edilmeyenleri listele", output: { action: "filter", condition: "not_contains", value: "iptal", reply: "✓ İptal edilmeyenler listelendi", changes: [] } },
  { user_command: "belirli bir tarihten sonrakileri göster", output: { action: "filter", condition: "after_date", reply: "✓ Tarih filtrelendi", changes: [] } },
  { user_command: "boş olmayanları göster", output: { action: "filter", condition: "not_empty", reply: "✓ Dolu kayıtlar gösterildi", changes: [] } },

  // ════════════════════════════════════════════════════════
  // 13. METİN DÖNÜŞÜMÜ (15 örnek)
  // ════════════════════════════════════════════════════════
  { user_command: "büyük harfe çevir", output: { action: "transform", transform: "uppercase", reply: "✓ Büyük harfe çevrildi", changes: [] } },
  { user_command: "hepsini büyük harf yap", output: { action: "transform", transform: "uppercase", reply: "✓ Büyük harf yapıldı", changes: [] } },
  { user_command: "küçük harfe çevir", output: { action: "transform", transform: "lowercase", reply: "✓ Küçük harfe çevrildi", changes: [] } },
  { user_command: "tümünü küçük harf yap", output: { action: "transform", transform: "lowercase", reply: "✓ Küçük harf yapıldı", changes: [] } },
  { user_command: "baş harfleri büyük yap", output: { action: "transform", transform: "capitalize", reply: "✓ Baş harfler büyük yapıldı", changes: [] } },
  { user_command: "kelimelerin ilk harfini büyüt", output: { action: "transform", transform: "capitalize", reply: "✓ İlk harfler büyütüldü", changes: [] } },
  { user_command: "boşlukları temizle", output: { action: "transform", transform: "trim", reply: "✓ Boşluklar temizlendi", changes: [] } },
  { user_command: "fazla boşlukları sil", output: { action: "transform", transform: "trim", reply: "✓ Fazla boşluklar silindi", changes: [] } },
  { user_command: "metinleri birleştir", output: { action: "transform", transform: "concat", reply: "✓ Metinler birleştirildi", changes: [] } },
  { user_command: "ad soyad sütununu ayır", output: { action: "extract", type: "name_split", reply: "✓ Ad ve Soyad ayrıldı", changes: [] } },
  { user_command: "telefon numaralarını formatla", output: { action: "clean_data", check: "phones", reply: "✓ Telefon numaraları formatlandı", changes: [] } },
  { user_command: "e-posta adreslerini çıkar", output: { action: "extract", type: "email", reply: "✓ E-posta adresleri çıkarıldı", changes: [] } },
  { user_command: "tc kimlik numaralarını bul", output: { action: "extract", type: "tc_id", reply: "✓ TC kimlik numaraları bulundu", changes: [] } },
  { user_command: "para birimi sembollerini kaldır", output: { action: "clean_data", check: "currency", reply: "✓ Para birimi sembolleri kaldırıldı", changes: [] } },
  { user_command: "tarihleri standart formata çevir", output: { action: "clean_data", check: "dates", reply: "✓ Tarih formatları standartlaştırıldı", changes: [] } },

  // ════════════════════════════════════════════════════════
  // 14. VERİ TEMİZLEME (15 örnek)
  // ════════════════════════════════════════════════════════
  { user_command: "veriyi temizle", output: { action: "clean_data", check: "all", reply: "✓ Veriler temizlendi", changes: [] } },
  { user_command: "tutarsızlıkları düzelt", output: { action: "clean_data", check: "inconsistencies", reply: "✓ Tutarsızlıklar düzeltildi", changes: [] } },
  { user_command: "hatalı verileri düzelt", output: { action: "clean_data", check: "errors", reply: "✓ Hatalı veriler düzeltildi", changes: [] } },
  { user_command: "büyük küçük harf tutarsızlıklarını gider", output: { action: "clean_data", check: "case", reply: "✓ Harf tutarsızlıkları giderildi", changes: [] } },
  { user_command: "boş değerleri doldur", output: { action: "clean_data", check: "fill_empty", reply: "✓ Boş değerler dolduruldu", changes: [] } },
  { user_command: "veriyi standartlaştır", output: { action: "clean_data", check: "standardize", reply: "✓ Veriler standartlaştırıldı", changes: [] } },
  { user_command: "sayısal olmayan değerleri bul", output: { action: "validate", check: "non_numeric", reply: "✓ Sayısal olmayan veriler bulundu", changes: [] } },
  { user_command: "eksik verileri göster", output: { action: "validate", check: "missing", reply: "✓ Eksik veriler gösterildi", changes: [] } },
  { user_command: "geçersiz verileri işaretle", output: { action: "highlight", condition: "invalid", color: "#fecaca", reply: "✓ Geçersiz veriler işaretlendi", changes: [] } },
  { user_command: "anomali tespit et", output: { action: "anomaly_detection", reply: "📊 Anomaliler tespit edildi", changes: [] } },
  { user_command: "aykırı değerleri bul", output: { action: "anomaly_detection", reply: "📊 Aykırı değerler bulundu", changes: [] } },
  { user_command: "outlier tespit et", output: { action: "anomaly_detection", reply: "📊 Outlier değerler tespit edildi", changes: [] } },
  { user_command: "olağandışı değerleri kırmızıya boya", output: { action: "anomaly_detection", color: "#fecaca", reply: "📊 Anormal değerler işaretlendi", changes: [] } },
  { user_command: "veri kalitesini kontrol et", output: { action: "validate", check: "all", reply: "✓ Veri kalitesi kontrol edildi", changes: [] } },
  { user_command: "format hatalarını düzelt", output: { action: "clean_data", check: "format", reply: "✓ Format hataları düzeltildi", changes: [] } },

  // ════════════════════════════════════════════════════════
  // 15. RAPOR VE ANALİZ (18 örnek)
  // ════════════════════════════════════════════════════════
  { user_command: "rapor oluştur", output: { action: "message", formula: "auto_report", reply: "📊 Rapor hazırlandı", changes: [] } },
  { user_command: "aylık rapor yap", output: { action: "message", formula: "monthly_report", reply: "📊 Aylık rapor hazırlandı", changes: [] } },
  { user_command: "haftalık rapor oluştur", output: { action: "message", formula: "weekly_report", reply: "📊 Haftalık rapor hazırlandı", changes: [] } },
  { user_command: "özet çıkar", output: { action: "message", formula: "summary", reply: "📊 Özet rapor oluşturuldu", changes: [] } },
  { user_command: "istatistikleri göster", output: { action: "message", formula: "statistics", reply: "📊 İstatistikler hesaplandı", changes: [] } },
  { user_command: "veri analizi yap", output: { action: "message", formula: "analysis", reply: "📊 Veri analizi tamamlandı", changes: [] } },
  { user_command: "satış raporu hazırla", output: { action: "message", formula: "sales_report", reply: "📊 Satış raporu hazırlandı", changes: [] } },
  { user_command: "bordro raporu oluştur", output: { action: "message", formula: "payroll_report", reply: "📊 Bordro raporu hazırlandı", changes: [] } },
  { user_command: "özet tablo yap", output: { action: "message", formula: "pivot_summary", reply: "📊 Özet tablo oluşturuldu", changes: [] } },
  { user_command: "karşılaştırmalı analiz yap", output: { action: "message", formula: "comparison", reply: "📊 Karşılaştırmalı analiz tamamlandı", changes: [] } },
  { user_command: "bu ay geçen ayla karşılaştır", output: { action: "compare", period1: "currentMonth", period2: "lastMonth", reply: "📊 Ay karşılaştırması yapıldı", changes: [] } },
  { user_command: "yıllık büyüme oranı", output: { action: "update_cells", formula: "growth_rate", reply: "✓ Büyüme oranı hesaplandı", changes: [] } },
  { user_command: "trend analizi yap", output: { action: "message", formula: "trend_analysis", reply: "📊 Trend analizi tamamlandı", changes: [] } },
  { user_command: "tahmin hesapla", output: { action: "forecast", reply: "📊 Tahmin hesaplandı", changes: [] } },
  { user_command: "gelecek ayı tahmin et", output: { action: "forecast", periods: 1, reply: "📊 Gelecek ay tahmini hesaplandı", changes: [] } },
  { user_command: "önümüzdeki 3 ayı öngör", output: { action: "forecast", periods: 3, reply: "📊 3 aylık tahmin hazırlandı", changes: [] } },
  { user_command: "satış tahmini yap", output: { action: "forecast", column: "satış", reply: "📊 Satış tahmini hesaplandı", changes: [] } },
  { user_command: "muhasebe raporu oluştur", output: { action: "message", formula: "accounting_report", reply: "📊 Muhasebe raporu hazırlandı", changes: [] } },

  // ════════════════════════════════════════════════════════
  // 16. GRUPLANDIRMA VE PİVOT (12 örnek)
  // ════════════════════════════════════════════════════════
  { user_command: "şehre göre grupla", output: { action: "group_by", column: "şehir", reply: "📊 Şehre göre gruplandırıldı", changes: [] } },
  { user_command: "kategoriye göre gruplandır", output: { action: "group_by", column: "kategori", reply: "📊 Kategoriye göre gruplandırıldı", changes: [] } },
  { user_command: "aya göre gruplama yap", output: { action: "group_by", column: "ay", reply: "📊 Aya göre gruplandırıldı", changes: [] } },
  { user_command: "satış ekibine göre grupla", output: { action: "group_by", column: "ekip", reply: "📊 Ekibe göre gruplandırıldı", changes: [] } },
  { user_command: "her bölgenin toplamını göster", output: { action: "group_by", aggregate: "sum", reply: "📊 Bölge toplamları hesaplandı", changes: [] } },
  { user_command: "müşteri başına sipariş sayısı", output: { action: "group_by", aggregate: "count", reply: "📊 Müşteri bazlı sipariş sayıları hesaplandı", changes: [] } },
  { user_command: "ürüne göre grupla topla", output: { action: "group_by", column: "ürün", aggregate: "sum", reply: "📊 Ürüne göre toplamlar hesaplandı", changes: [] } },
  { user_command: "pivot tablo oluştur", output: { action: "message", formula: "pivot_table", reply: "📊 Pivot tablo oluşturuldu", changes: [] } },
  { user_command: "hangi şehirde en çok satış var", output: { action: "group_by", aggregate: "sum", group_column: "şehir", reply: "📊 Şehirlere göre satış analizi yapıldı", changes: [] } },
  { user_command: "departmana göre gider özeti", output: { action: "group_by", column: "departman", aggregate: "sum", reply: "📊 Departman bazlı gider özeti hazırlandı", changes: [] } },
  { user_command: "yıla göre grupla karşılaştır", output: { action: "group_by", column: "yıl", aggregate: "sum", reply: "📊 Yıllık karşılaştırma yapıldı", changes: [] } },
  { user_command: "personel bazında maaş özeti", output: { action: "group_by", column: "personel", aggregate: "sum", reply: "📊 Personel bazlı maaş özeti hazırlandı", changes: [] } },

  // ════════════════════════════════════════════════════════
  // 17. FORMÜL ÜRETİCİ (12 örnek)
  // ════════════════════════════════════════════════════════
  { user_command: "vlookup yap", output: { action: "generate_formula", formula_type: "vlookup", reply: "✓ VLOOKUP formülü oluşturuldu", changes: [] } },
  { user_command: "vlookup formülü oluştur", output: { action: "generate_formula", formula_type: "vlookup", reply: "✓ DÜŞEYARA formülü hazırlandı", changes: [] } },
  { user_command: "eğer formülü uygula", output: { action: "generate_formula", formula_type: "if", reply: "✓ EĞER formülü oluşturuldu", changes: [] } },
  { user_command: "koşullu topla", output: { action: "generate_formula", formula_type: "sumif", reply: "✓ ETOPLA formülü hazırlandı", changes: [] } },
  { user_command: "sumif formülü yaz", output: { action: "generate_formula", formula_type: "sumif", reply: "✓ SUMIF formülü oluşturuldu", changes: [] } },
  { user_command: "koşullu say", output: { action: "count_if", reply: "✓ Koşullu sayım yapıldı", changes: [] } },
  { user_command: "index match yaz", output: { action: "generate_formula", formula_type: "index_match", reply: "✓ INDEX/MATCH formülü oluşturuldu", changes: [] } },
  { user_command: "bu hesaplama için formül yaz", output: { action: "generate_formula", reply: "✓ Formül oluşturuldu", changes: [] } },
  { user_command: "düşeyara formülü hazırla", output: { action: "generate_formula", formula_type: "vlookup", reply: "✓ DÜŞEYARA formülü hazırlandı", changes: [] } },
  { user_command: "çoketopla formülü oluştur", output: { action: "generate_formula", formula_type: "sumifs", reply: "✓ ÇOKETOPLA formülü oluşturuldu", changes: [] } },
  { user_command: "kümülatif toplam hesapla", output: { action: "update_cells", formula: "cumulative_sum", reply: "✓ Kümülatif toplam hesaplandı", changes: [] } },
  { user_command: "hareketli ortalama hesapla", output: { action: "update_cells", formula: "moving_average", reply: "✓ Hareketli ortalama hesaplandı", changes: [] } },

  // ════════════════════════════════════════════════════════
  // 18. DUYGU ANALİZİ VE SINIFLANDIRMA (10 örnek)
  // ════════════════════════════════════════════════════════
  { user_command: "duygu analizi yap", output: { action: "sentiment_analysis", reply: "📊 Duygu analizi yapıldı", changes: [] } },
  { user_command: "yorum duygularını analiz et", output: { action: "sentiment_analysis", reply: "📊 Yorumların duygu analizi tamamlandı", changes: [] } },
  { user_command: "müşteri geri bildirimlerini analiz et", output: { action: "sentiment_analysis", reply: "📊 Müşteri geri bildirimleri analiz edildi", changes: [] } },
  { user_command: "olumlu mu olumsuz mu sınıfla", output: { action: "sentiment_analysis", reply: "📊 Pozitif/Negatif/Nötr sınıflandırması yapıldı", changes: [] } },
  { user_command: "kategorilere ayır", output: { action: "classify", reply: "📊 Veriler kategorilere ayrıldı", changes: [] } },
  { user_command: "giderleri personel kira araç olarak sınıfla", output: { action: "classify", categories: ["Personel", "Kira", "Araç"], reply: "📊 Giderler kategorilendi", changes: [] } },
  { user_command: "müşterileri segmentlere ayır", output: { action: "classify", column: "müşteri", reply: "📊 Müşteri segmentasyonu yapıldı", changes: [] } },
  { user_command: "öncelik düzeyi belirle yüksek orta düşük", output: { action: "classify", categories: ["Yüksek", "Orta", "Düşük"], reply: "📊 Öncelik seviyeleri belirlendi", changes: [] } },
  { user_command: "ürünleri kategoriyle etiketle", output: { action: "classify", reply: "📊 Ürünler kategorilendi", changes: [] } },
  { user_command: "şikayetleri analiz et", output: { action: "sentiment_analysis", reply: "📊 Şikayetler analiz edildi", changes: [] } },

  // ════════════════════════════════════════════════════════
  // 19. MUHASEBE ÖZEL (15 örnek)
  // ════════════════════════════════════════════════════════
  { user_command: "kar zarar hesapla", output: { action: "update_cells", formula: "profit_loss", reply: "✓ Kar/zarar hesaplandı", changes: [] } },
  { user_command: "brüt kar marjı hesapla", output: { action: "update_cells", formula: "gross_margin", reply: "✓ Brüt kar marjı hesaplandı", changes: [] } },
  { user_command: "nakit akışı hesapla", output: { action: "message", formula: "cash_flow", reply: "📊 Nakit akışı hesaplandı", changes: [] } },
  { user_command: "gider toplamı ne kadar", output: { action: "sum", column: "gider", reply: "✓ Gider toplamı hesaplandı", changes: [] } },
  { user_command: "gelir gider dengesi", output: { action: "message", formula: "balance", reply: "📊 Gelir gider dengesi gösterildi", changes: [] } },
  { user_command: "stok değeri hesapla", output: { action: "update_cells", formula: "inventory_value", reply: "✓ Stok değeri hesaplandı", changes: [] } },
  { user_command: "amortisman hesapla", output: { action: "update_cells", formula: "depreciation", reply: "✓ Amortisman hesaplandı", changes: [] } },
  { user_command: "faiz hesapla", output: { action: "update_cells", formula: "interest", reply: "✓ Faiz hesaplandı", changes: [] } },
  { user_command: "bilanço hazırla", output: { action: "message", formula: "balance_sheet", reply: "📊 Bilanço hazırlandı", changes: [] } },
  { user_command: "alacak hesapla", output: { action: "sum", column: "alacak", reply: "✓ Alacak toplamı hesaplandı", changes: [] } },
  { user_command: "borç bakiyesi topla", output: { action: "sum", column: "borç", reply: "✓ Borç bakiyesi toplandı", changes: [] } },
  { user_command: "cari hesap özeti", output: { action: "message", formula: "current_account", reply: "📊 Cari hesap özeti hazırlandı", changes: [] } },
  { user_command: "fatura tutarlarını topla", output: { action: "sum", column: "fatura", reply: "✓ Fatura tutarları toplandı", changes: [] } },
  { user_command: "maliyet analizi yap", output: { action: "message", formula: "cost_analysis", reply: "📊 Maliyet analizi tamamlandı", changes: [] } },
  { user_command: "stok devir hızı hesapla", output: { action: "update_cells", formula: "inventory_turnover", reply: "✓ Stok devir hızı hesaplandı", changes: [] } },

  // ════════════════════════════════════════════════════════
  // 20. YARDIM VE BİLGİ (10 örnek)
  // ════════════════════════════════════════════════════════
  { user_command: "ne yapabilirim", output: { action: "message", reply: "💡 Sıralama, filtreleme, hesaplama, renklendirme, rapor oluşturma yapabilirsiniz!", changes: [] } },
  { user_command: "yardım", output: { action: "message", reply: "💡 Örnek: 'B sütununu topla', 'Boş satırları sil', 'KDV ekle', 'Aylık rapor yap'", changes: [] } },
  { user_command: "nasıl kullanırım", output: { action: "message", reply: "💡 Türkçe olarak ne yapmak istediğinizi yazın. Örn: 'Fiyatları büyükten küçüğe sırala'", changes: [] } },
  { user_command: "ne yaparsın", output: { action: "message", reply: "💡 Excel verilerinizi Türkçe komutlarla yönetebilirsiniz.", changes: [] } },
  { user_command: "komutlar neler", output: { action: "message", reply: "💡 Topla, sırala, filtrele, renklendir, KDV hesapla, maaş hesapla ve çok daha fazlası!", changes: [] } },
  { user_command: "bu formülü açıkla", output: { action: "explain", reply: "💡 Formül açıklandı", changes: [] } },
  { user_command: "vlookup nedir", output: { action: "explain", formula_name: "vlookup", reply: "💡 VLOOKUP formülü açıklandı", changes: [] } },
  { user_command: "kaç sütun var", output: { action: "message", formula: "sheet_info", reply: "📊 Tablo bilgileri gösterildi", changes: [] } },
  { user_command: "veriler hakkında bilgi ver", output: { action: "message", formula: "data_summary", reply: "📊 Veri özeti hazırlandı", changes: [] } },
  { user_command: "bu veriyi analiz et", output: { action: "message", formula: "full_analysis", reply: "📊 Veri analizi tamamlandı", changes: [] } },

];

const COLOR_MAP = {
  "kırmızı": "#fecaca", "red": "#fecaca",
  "yeşil": "#bbf7d0", "green": "#bbf7d0",
  "sarı": "#fef08a", "yellow": "#fef08a",
  "mavi": "#bfdbfe", "blue": "#bfdbfe",
  "turuncu": "#fed7aa", "orange": "#fed7aa",
  "mor": "#e9d5ff", "purple": "#e9d5ff",
  "pembe": "#fbcfe8", "pink": "#fbcfe8",
  "gri": "#e5e7eb", "gray": "#e5e7eb",
};

module.exports = { EXCEL_DATASET, COLOR_MAP };
// Toplam: 353 örnek, 20 kategori, 35+ action tipi
