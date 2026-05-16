// ============================================================
// MOCKSHEETS DATASET v9.0
// ~860 örnek, 26 kategori, 43+ action tipi
// TÃ¼m Excel formÃ¼lleri, muhasebe, bordro, veri analizi
// ============================================================

const EXCEL_DATASET = [

  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // 1. SIRALAMA (28 Ã¶rnek)
  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  { user_command: "a dan z ye sÄ±rala", logic: "sort ascending alphabetical", category: "sorting", output: { action: "sort", direction: "asc", reply: "â A'dan Z'ye sÄ±ralandÄ±", changes: [] } },
  { user_command: "z den a ya sÄ±rala", logic: "sort descending alphabetical", category: "sorting", output: { action: "sort", direction: "desc", reply: "â Z'den A'ya sÄ±ralandÄ±", changes: [] } },
  { user_command: "kÃ¼Ã§Ã¼kten bÃ¼yÃ¼Äe sÄ±rala", logic: "sort ascending numeric", category: "sorting", output: { action: "sort", direction: "asc", reply: "â KÃ¼Ã§Ã¼kten bÃ¼yÃ¼Äe sÄ±ralandÄ±", changes: [] } },
  { user_command: "bÃ¼yÃ¼kten kÃ¼Ã§Ã¼Äe sÄ±rala", logic: "sort descending numeric", category: "sorting", output: { action: "sort", direction: "desc", reply: "â BÃ¼yÃ¼kten kÃ¼Ã§Ã¼Äe sÄ±ralandÄ±", changes: [] } },
  { user_command: "alfabetik sÄ±rala", logic: "alphabetical order sort", category: "sorting", output: { action: "sort", direction: "asc", reply: "â Alfabetik sÄ±ralandÄ±", changes: [] } },
  { user_command: "artan sÄ±rayla diz", logic: "arrange ascending order", category: "sorting", output: { action: "sort", direction: "asc", reply: "â Artan sÄ±rayla dizildi", changes: [] } },
  { user_command: "azalan sÄ±rayla diz", logic: "arrange descending order", category: "sorting", output: { action: "sort", direction: "desc", reply: "â Azalan sÄ±rayla dizildi", changes: [] } },
  { user_command: "fiyata gÃ¶re sÄ±rala", logic: "sort by price column ascending", category: "sorting", output: { action: "sort", column: "fiyat", direction: "asc", reply: "â Fiyata gÃ¶re sÄ±ralandÄ±", changes: [] } },
  { user_command: "tarihe gÃ¶re sÄ±rala", logic: "sort by date column", category: "sorting", output: { action: "sort", column: "tarih", direction: "asc", reply: "â Tarihe gÃ¶re sÄ±ralandÄ±", changes: [] } },
  { user_command: "isme gÃ¶re sÄ±rala", logic: "sort by name alphabetically", category: "sorting", output: { action: "sort", column: "isim", direction: "asc", reply: "â Ä°sime gÃ¶re sÄ±ralandÄ±", changes: [] } },
  { user_command: "satÄ±Åa gÃ¶re en yÃ¼ksekten sÄ±rala", logic: "sort sales descending highest first", category: "sorting", output: { action: "sort", column: "satÄ±Å", direction: "desc", reply: "â SatÄ±Åa gÃ¶re sÄ±ralandÄ±", changes: [] } },
  { user_command: "fiyata gÃ¶re bÃ¼yÃ¼kten kÃ¼Ã§Ã¼Äe", logic: "sort price descending", category: "sorting", output: { action: "sort", column: "fiyat", direction: "desc", reply: "â Fiyata gÃ¶re azalan sÄ±ralandÄ±", changes: [] } },
  { user_command: "b sÃ¼tununu sÄ±rala", logic: "sort column B ascending", category: "sorting", output: { action: "sort", column: "B", direction: "asc", reply: "â B sÃ¼tunu sÄ±ralandÄ±", changes: [] } },
  { user_command: "tarihe gÃ¶re en yeniden en eskiye", logic: "sort date descending newest first", category: "sorting", output: { action: "sort", column: "tarih", direction: "desc", reply: "â Tarihe gÃ¶re azalan sÄ±ralandÄ±", changes: [] } },
  { user_command: "mÃ¼Återi adÄ±na gÃ¶re sÄ±rala", logic: "sort by customer name", category: "sorting", output: { action: "sort", column: "mÃ¼Återi", direction: "asc", reply: "â MÃ¼Återi adÄ±na gÃ¶re sÄ±ralandÄ±", changes: [] } },
  { user_command: "stok miktarÄ±na gÃ¶re sÄ±rala", logic: "sort by stock quantity", category: "sorting", output: { action: "sort", column: "stok", direction: "asc", reply: "â Stok miktarÄ±na gÃ¶re sÄ±ralandÄ±", changes: [] } },
  { user_command: "tutara gÃ¶re sÄ±rala", logic: "sort by amount", category: "sorting", output: { action: "sort", column: "tutar", direction: "asc", reply: "â Tutara gÃ¶re sÄ±ralandÄ±", changes: [] } },
  { user_command: "en pahalÄ±dan sÄ±rala", logic: "sort most expensive first descending price", category: "sorting", output: { action: "sort", column: "fiyat", direction: "desc", reply: "â En pahalÄ±dan sÄ±ralandÄ±", changes: [] } },
  { user_command: "en ucuzdan sÄ±rala", logic: "sort cheapest first ascending price", category: "sorting", output: { action: "sort", column: "fiyat", direction: "asc", reply: "â En ucuzdan sÄ±ralandÄ±", changes: [] } },
  { user_command: "sipariÅ numarasÄ±na gÃ¶re sÄ±rala", logic: "sort by order number", category: "sorting", output: { action: "sort", column: "sipariÅ", direction: "asc", reply: "â SipariÅ numarasÄ±na gÃ¶re sÄ±ralandÄ±", changes: [] } },
  { user_command: "puana gÃ¶re en yÃ¼ksekten", logic: "sort score descending", category: "sorting", output: { action: "sort", column: "puan", direction: "desc", reply: "â Puana gÃ¶re sÄ±ralandÄ±", changes: [] } },
  { user_command: "maaÅa gÃ¶re bÃ¼yÃ¼kten kÃ¼Ã§Ã¼Äe sÄ±rala", logic: "sort salary descending", category: "sorting", output: { action: "sort", column: "maaÅ", direction: "desc", reply: "â MaaÅa gÃ¶re sÄ±ralandÄ±", changes: [] } },
  { user_command: "kodu gÃ¶re sÄ±rala", logic: "sort by code number", category: "sorting", output: { action: "sort", column: "kod", direction: "asc", reply: "â Koda gÃ¶re sÄ±ralandÄ±", changes: [] } },
  { user_command: "sÄ±ra numarasÄ±na gÃ¶re sÄ±rala", logic: "sort by row number order", category: "sorting", output: { action: "sort", column: "sÄ±ra", direction: "asc", reply: "â SÄ±ra numarasÄ±na gÃ¶re sÄ±ralandÄ±", changes: [] } },
  { user_command: "a sÃ¼tununu kÃ¼Ã§Ã¼kten bÃ¼yÃ¼Äe diz", logic: "sort column A ascending", category: "sorting", output: { action: "sort", column: "A", direction: "asc", reply: "â A sÃ¼tunu sÄ±ralandÄ±", changes: [] } },
  { user_command: "Ã¼rÃ¼n adÄ±na gÃ¶re alfabetik sÄ±rala", logic: "sort product name alphabetically", category: "sorting", output: { action: "sort", column: "Ã¼rÃ¼n", direction: "asc", reply: "â ÃrÃ¼n adÄ±na gÃ¶re sÄ±ralandÄ±", changes: [] } },
  { user_command: "Åehre gÃ¶re sÄ±rala", logic: "sort by city name", category: "sorting", output: { action: "sort", column: "Åehir", direction: "asc", reply: "â Åehre gÃ¶re sÄ±ralandÄ±", changes: [] } },
  { user_command: "iÅlem tarihine gÃ¶re sÄ±rala", logic: "sort by transaction date", category: "sorting", output: { action: "sort", column: "iÅlem_tarihi", direction: "asc", reply: "â Ä°Ålem tarihine gÃ¶re sÄ±ralandÄ±", changes: [] } },

  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // 2. TOPLAMA (20 Ã¶rnek)
  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  { user_command: "topla", logic: "calculate sum all values", category: "calculation", output: { action: "sum", reply: "â Toplam hesaplandÄ±", changes: [] } },
  { user_command: "toplam al", logic: "get total sum", category: "calculation", output: { action: "sum", reply: "â Toplam alÄ±ndÄ±", changes: [] } },
  { user_command: "hepsini topla", logic: "sum all cells", category: "calculation", output: { action: "sum", reply: "â TÃ¼mÃ¼ toplandÄ±", changes: [] } },
  { user_command: "toplam kaÃ§", logic: "what is total sum", category: "calculation", output: { action: "sum", reply: "â Toplam hesaplandÄ±", changes: [] } },
  { user_command: "genel toplam", logic: "grand total sum", category: "calculation", output: { action: "sum", reply: "â Genel toplam hesaplandÄ±", changes: [] } },
  { user_command: "b sÃ¼tununu topla", logic: "sum column B values", category: "calculation", output: { action: "sum", column: "B", reply: "â B sÃ¼tunu toplandÄ±", changes: [] } },
  { user_command: "c kolonunu topla", logic: "sum column C values", category: "calculation", output: { action: "sum", column: "C", reply: "â C kolonu toplandÄ±", changes: [] } },
  { user_command: "fiyatlarÄ± topla", logic: "sum price column", category: "calculation", output: { action: "sum", column: "fiyat", reply: "â Fiyatlar toplandÄ±", changes: [] } },
  { user_command: "satÄ±ÅlarÄ± topla", logic: "sum sales column", category: "calculation", output: { action: "sum", column: "satÄ±Å", reply: "â SatÄ±Ålar toplandÄ±", changes: [] } },
  { user_command: "gelirlerin toplamÄ± ne", logic: "total revenue sum", category: "calculation", output: { action: "sum", column: "gelir", reply: "â Gelirler toplandÄ±", changes: [] } },
  { user_command: "tutarlarÄ± topla", logic: "sum amount column", category: "calculation", output: { action: "sum", column: "tutar", reply: "â Tutarlar toplandÄ±", changes: [] } },
  { user_command: "giderleri topla", logic: "sum expenses column", category: "calculation", output: { action: "sum", column: "gider", reply: "â Giderler toplandÄ±", changes: [] } },
  { user_command: "miktarlarÄ± topla", logic: "sum quantity column", category: "calculation", output: { action: "sum", column: "miktar", reply: "â Miktarlar toplandÄ±", changes: [] } },
  { user_command: "ciro toplamÄ±", logic: "total revenue turnover sum", category: "calculation", output: { action: "sum", column: "ciro", reply: "â Ciro toplamÄ± hesaplandÄ±", changes: [] } },
  { user_command: "kasa bakiyesi topla", logic: "sum cash balance", category: "calculation", output: { action: "sum", column: "kasa", reply: "â Kasa bakiyesi toplandÄ±", changes: [] } },
  { user_command: "borÃ§ toplamÄ± ne kadar", logic: "total debt sum", category: "calculation", output: { action: "sum", column: "borÃ§", reply: "â BorÃ§ toplamÄ± hesaplandÄ±", changes: [] } },
  { user_command: "alacak toplamÄ±", logic: "total receivable sum", category: "calculation", output: { action: "sum", column: "alacak", reply: "â Alacak toplamÄ± hesaplandÄ±", changes: [] } },
  { user_command: "fatura tutarlarÄ±nÄ± topla", logic: "sum invoice amounts", category: "calculation", output: { action: "sum", column: "fatura", reply: "â Fatura tutarlarÄ± toplandÄ±", changes: [] } },
  { user_command: "maaÅlarÄ± topla", logic: "sum salary column", category: "calculation", output: { action: "sum", column: "maaÅ", reply: "â MaaÅlar toplandÄ±", changes: [] } },
  { user_command: "aylÄ±k harcama toplamÄ±", logic: "monthly expense total", category: "calculation", output: { action: "sum", column: "harcama", reply: "â AylÄ±k harcama toplamÄ± hesaplandÄ±", changes: [] } },

  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // 3. ORTALAMA (16 Ã¶rnek)
  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  { user_command: "ortalama al", logic: "calculate average mean", category: "calculation", output: { action: "average", reply: "â Ortalama hesaplandÄ±", changes: [] } },
  { user_command: "ortalamasÄ±nÄ± hesapla", logic: "compute average value", category: "calculation", output: { action: "average", reply: "â Ortalama hesaplandÄ±", changes: [] } },
  { user_command: "ortalama ne", logic: "what is average value", category: "calculation", output: { action: "average", reply: "â Ortalama hesaplandÄ±", changes: [] } },
  { user_command: "b sÃ¼tununun ortalamasÄ± ne", logic: "average of column B", category: "calculation", output: { action: "average", column: "B", reply: "â B sÃ¼tununun ortalamasÄ± hesaplandÄ±", changes: [] } },
  { user_command: "fiyatlarÄ±n ortalamasÄ±nÄ± bul", logic: "find price average", category: "calculation", output: { action: "average", column: "fiyat", reply: "â Fiyat ortalamasÄ± bulundu", changes: [] } },
  { user_command: "satÄ±Å ortalamasÄ± hesapla", logic: "calculate sales average", category: "calculation", output: { action: "average", column: "satÄ±Å", reply: "â SatÄ±Å ortalamasÄ± hesaplandÄ±", changes: [] } },
  { user_command: "aylÄ±k ortalama satÄ±Å", logic: "monthly average sales", category: "calculation", output: { action: "average", column: "satÄ±Å", reply: "â AylÄ±k ortalama hesaplandÄ±", changes: [] } },
  { user_command: "maaÅ ortalamasÄ± ne kadar", logic: "average salary amount", category: "calculation", output: { action: "average", column: "maaÅ", reply: "â MaaÅ ortalamasÄ± hesaplandÄ±", changes: [] } },
  { user_command: "not ortalamasÄ± hesapla", logic: "calculate grade average", category: "calculation", output: { action: "average", column: "not", reply: "â Not ortalamasÄ± hesaplandÄ±", changes: [] } },
  { user_command: "gelir ortalamasÄ± ne", logic: "average income", category: "calculation", output: { action: "average", column: "gelir", reply: "â Gelir ortalamasÄ± hesaplandÄ±", changes: [] } },
  { user_command: "sipariÅ tutarÄ± ortalamasÄ±", logic: "average order amount", category: "calculation", output: { action: "average", column: "tutar", reply: "â SipariÅ ortalamasÄ± hesaplandÄ±", changes: [] } },
  { user_command: "mÃ¼Återi baÅÄ±na ortalama sipariÅ", logic: "average order per customer", category: "calculation", output: { action: "average", column: "tutar", reply: "â MÃ¼Återi baÅÄ±na ortalama hesaplandÄ±", changes: [] } },
  { user_command: "kÃ¢r marjÄ± ortalamasÄ±", logic: "average profit margin", category: "calculation", output: { action: "average", column: "kar", reply: "â KÃ¢r marjÄ± ortalamasÄ± hesaplandÄ±", changes: [] } },
  { user_command: "prim ortalamasÄ± bul", logic: "find average bonus premium", category: "calculation", output: { action: "average", column: "prim", reply: "â Prim ortalamasÄ± bulundu", changes: [] } },
  { user_command: "haftalÄ±k ortalama satÄ±Å", logic: "weekly average sales", category: "calculation", output: { action: "average", column: "satÄ±Å", reply: "â HaftalÄ±k ortalama hesaplandÄ±", changes: [] } },
  { user_command: "gider ortalamasÄ±", logic: "average expense cost", category: "calculation", output: { action: "average", column: "gider", reply: "â Gider ortalamasÄ± hesaplandÄ±", changes: [] } },

  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // 4. MIN / MAX / TOP N (16 Ã¶rnek)
  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  { user_command: "en bÃ¼yÃ¼k deÄeri bul", logic: "find maximum largest value", category: "calculation", output: { action: "max", reply: "â En bÃ¼yÃ¼k deÄer bulundu", changes: [] } },
  { user_command: "maksimum deÄer ne", logic: "what is maximum value", category: "calculation", output: { action: "max", reply: "â Maksimum deÄer gÃ¶sterildi", changes: [] } },
  { user_command: "en yÃ¼ksek fiyat ne", logic: "highest maximum price", category: "calculation", output: { action: "max", column: "fiyat", reply: "â En yÃ¼ksek fiyat bulundu", changes: [] } },
  { user_command: "en Ã§ok satan Ã¼rÃ¼n hangisi", logic: "best selling product maximum sales", category: "calculation", output: { action: "max", column: "satÄ±Å", reply: "â En Ã§ok satan bulundu", changes: [] } },
  { user_command: "en kÃ¼Ã§Ã¼k deÄeri gÃ¶ster", logic: "find minimum smallest value", category: "calculation", output: { action: "min", reply: "â En kÃ¼Ã§Ã¼k deÄer gÃ¶sterildi", changes: [] } },
  { user_command: "minimum deÄer kaÃ§", logic: "what is minimum value", category: "calculation", output: { action: "min", reply: "â Minimum deÄer bulundu", changes: [] } },
  { user_command: "en dÃ¼ÅÃ¼k fiyat", logic: "lowest minimum price", category: "calculation", output: { action: "min", column: "fiyat", reply: "â En dÃ¼ÅÃ¼k fiyat bulundu", changes: [] } },
  { user_command: "en az satan hangisi", logic: "worst selling product minimum sales", category: "calculation", output: { action: "min", column: "satÄ±Å", reply: "â En az satan bulundu", changes: [] } },
  { user_command: "en yÃ¼ksek 5 deÄeri gÃ¶ster", logic: "show top 5 highest values", category: "calculation", output: { action: "top_n", n: 5, reply: "â En yÃ¼ksek 5 deÄer gÃ¶sterildi", changes: [] } },
  { user_command: "en Ã§ok satan 5 Ã¼rÃ¼nÃ¼ listele", logic: "list top 5 best selling products", category: "calculation", output: { action: "top_n", column: "satÄ±Å", n: 5, reply: "â En Ã§ok satan 5 Ã¼rÃ¼n listelendi", changes: [] } },
  { user_command: "ilk 10 kaydÄ± listele", logic: "list first top 10 records", category: "calculation", output: { action: "top_n", n: 10, reply: "â Ä°lk 10 kayÄ±t listelendi", changes: [] } },
  { user_command: "en yÃ¼ksek maaÅ ne kadar", logic: "highest maximum salary", category: "calculation", output: { action: "max", column: "maaÅ", reply: "â En yÃ¼ksek maaÅ bulundu", changes: [] } },
  { user_command: "en dÃ¼ÅÃ¼k stok hangisi", logic: "lowest minimum stock", category: "calculation", output: { action: "min", column: "stok", reply: "â En dÃ¼ÅÃ¼k stok bulundu", changes: [] } },
  { user_command: "rekor satÄ±ÅÄ± bul", logic: "find record maximum sales", category: "calculation", output: { action: "max", column: "satÄ±Å", reply: "â Rekor satÄ±Å bulundu", changes: [] } },
  { user_command: "en uzun sÃ¼re bekleyen sipariÅ", logic: "longest waiting oldest order", category: "calculation", output: { action: "min", column: "tarih", reply: "â En uzun bekleyen sipariÅ bulundu", changes: [] } },
  { user_command: "en yÃ¼ksek gider kalemi", logic: "highest expense item", category: "calculation", output: { action: "max", column: "gider", reply: "â En yÃ¼ksek gider bulundu", changes: [] } },

  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // 5. SAYMA (12 Ã¶rnek)
  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  { user_command: "kaÃ§ kayÄ±t var", logic: "count total records rows", category: "calculation", output: { action: "count", reply: "â KayÄ±t sayÄ±sÄ± hesaplandÄ±", changes: [] } },
  { user_command: "satÄ±r sayÄ±sÄ±nÄ± say", logic: "count number of rows", category: "calculation", output: { action: "count", reply: "â SatÄ±r sayÄ±sÄ± sayÄ±ldÄ±", changes: [] } },
  { user_command: "kaÃ§ tane", logic: "how many count items", category: "calculation", output: { action: "count", reply: "â Toplam kayÄ±t sayÄ±sÄ± bulundu", changes: [] } },
  { user_command: "istanbul kaÃ§ tane", logic: "count rows containing istanbul", category: "calculation", output: { action: "count_if", condition: "contains", value: "istanbul", reply: "â Ä°stanbul iÃ§eren kayÄ±tlar sayÄ±ldÄ±", changes: [] } },
  { user_command: "100den bÃ¼yÃ¼k kaÃ§ satÄ±r var", logic: "count rows greater than 100", category: "calculation", output: { action: "count_if", condition: "value > 100", reply: "â 100'den bÃ¼yÃ¼k satÄ±rlar sayÄ±ldÄ±", changes: [] } },
  { user_command: "boÅ hÃ¼cre sayÄ±sÄ±", logic: "count empty blank cells", category: "calculation", output: { action: "count_blank", reply: "â BoÅ hÃ¼creler sayÄ±ldÄ±", changes: [] } },
  { user_command: "aktif mÃ¼Återi sayÄ±sÄ±", logic: "count active customers", category: "calculation", output: { action: "count_if", condition: "contains", value: "aktif", reply: "â Aktif mÃ¼Återiler sayÄ±ldÄ±", changes: [] } },
  { user_command: "kaÃ§ farklÄ± kategori var", logic: "count unique distinct categories", category: "calculation", output: { action: "count_unique", reply: "â Benzersiz kategoriler sayÄ±ldÄ±", changes: [] } },
  { user_command: "negatif deÄer sayÄ±sÄ±", logic: "count negative values", category: "calculation", output: { action: "count_if", condition: "value < 0", reply: "â Negatif deÄerler sayÄ±ldÄ±", changes: [] } },
  { user_command: "toplam Ã¼rÃ¼n Ã§eÅidi", logic: "count distinct product types", category: "calculation", output: { action: "count_unique", column: "Ã¼rÃ¼n", reply: "â ÃrÃ¼n Ã§eÅidi sayÄ±ldÄ±", changes: [] } },
  { user_command: "bu ay kaÃ§ sipariÅ geldi", logic: "count orders this month", category: "calculation", output: { action: "count_if", condition: "currentMonth", reply: "â Bu ayki sipariÅ sayÄ±sÄ± hesaplandÄ±", changes: [] } },
  { user_command: "teslim edilmeyen sipariÅ sayÄ±sÄ±", logic: "count undelivered orders", category: "calculation", output: { action: "count_if", condition: "contains", value: "bekliyor", reply: "â Teslim edilmeyen sipariÅler sayÄ±ldÄ±", changes: [] } },

  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // 6. BOÅ SATIR / SÄ°LME (20 Ã¶rnek)
  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  { user_command: "boÅ satÄ±rlarÄ± sil", logic: "delete empty rows", category: "cleaning", output: { action: "delete_rows", condition: "empty", reply: "â BoÅ satÄ±rlar silindi", changes: [] } },
  { user_command: "boÅlarÄ± temizle", logic: "clean remove blank rows", category: "cleaning", output: { action: "delete_rows", condition: "empty", reply: "â BoÅ satÄ±rlar temizlendi", changes: [] } },
  { user_command: "boÅ olanlarÄ± kaldÄ±r", logic: "remove empty rows", category: "cleaning", output: { action: "delete_rows", condition: "empty", reply: "â BoÅ satÄ±rlar kaldÄ±rÄ±ldÄ±", changes: [] } },
  { user_command: "dolu satÄ±rlarÄ± bÄ±rak boÅlarÄ± sil", logic: "keep non-empty delete empty rows", category: "cleaning", output: { action: "delete_rows", condition: "empty", reply: "â BoÅ satÄ±rlar temizlendi", changes: [] } },
  { user_command: "veri olmayan satÄ±rlarÄ± kaldÄ±r", logic: "remove rows without data", category: "cleaning", output: { action: "delete_rows", condition: "empty", reply: "â Veri olmayan satÄ±rlar kaldÄ±rÄ±ldÄ±", changes: [] } },
  { user_command: "sÄ±fÄ±r olan satÄ±rlarÄ± sil", logic: "delete rows with zero value", category: "cleaning", output: { action: "delete_rows", condition: "value == 0", reply: "â SÄ±fÄ±r deÄerli satÄ±rlar silindi", changes: [] } },
  { user_command: "negatif satÄ±rlarÄ± kaldÄ±r", logic: "remove rows with negative values", category: "cleaning", output: { action: "delete_rows", condition: "value < 0", reply: "â Negatif satÄ±rlar kaldÄ±rÄ±ldÄ±", changes: [] } },
  { user_command: "0 deÄerli satÄ±rlarÄ± temizle", logic: "clean rows with zero value", category: "cleaning", output: { action: "delete_rows", condition: "value == 0", reply: "â SÄ±fÄ±r deÄerli satÄ±rlar temizlendi", changes: [] } },
  { user_command: "iptal edilen sipariÅleri sil", logic: "delete cancelled orders", category: "cleaning", output: { action: "delete_rows", condition: "contains_iptal", reply: "â Ä°ptal edilen sipariÅler silindi", changes: [] } },
  { user_command: "pasif kayÄ±tlarÄ± sil", logic: "delete inactive passive records", category: "cleaning", output: { action: "delete_rows", condition: "contains_pasif", reply: "â Pasif kayÄ±tlar silindi", changes: [] } },
  { user_command: "test verilerini sil", logic: "delete test data rows", category: "cleaning", output: { action: "delete_rows", condition: "contains_test", reply: "â Test verileri silindi", changes: [] } },
  { user_command: "stok sÄ±fÄ±r olanlarÄ± kaldÄ±r", logic: "remove zero stock items", category: "cleaning", output: { action: "delete_rows", condition: "value == 0", reply: "â Stok sÄ±fÄ±r olan satÄ±rlar kaldÄ±rÄ±ldÄ±", changes: [] } },
  { user_command: "geÃ§miÅ tarihli kayÄ±tlarÄ± kaldÄ±r", logic: "remove past date records", category: "cleaning", output: { action: "delete_rows", condition: "past_date", reply: "â GeÃ§miÅ tarihli kayÄ±tlar kaldÄ±rÄ±ldÄ±", changes: [] } },
  { user_command: "hatalÄ± satÄ±rlarÄ± kaldÄ±r", logic: "remove error rows", category: "cleaning", output: { action: "delete_rows", condition: "error", reply: "â HatalÄ± satÄ±rlar kaldÄ±rÄ±ldÄ±", changes: [] } },
  { user_command: "boÅ ad soyad olanlarÄ± sil", logic: "delete rows with empty name", category: "cleaning", output: { action: "delete_rows", condition: "empty_name", reply: "â BoÅ ad soyad olan satÄ±rlar silindi", changes: [] } },
  { user_command: "silinmiÅ olanlarÄ± kaldÄ±r", logic: "remove deleted marked rows", category: "cleaning", output: { action: "delete_rows", condition: "contains_silindi", reply: "â Silindi iÅaretli kayÄ±tlar kaldÄ±rÄ±ldÄ±", changes: [] } },
  { user_command: "seÃ§ili satÄ±rÄ± sil", logic: "delete selected current row", category: "cleaning", output: { action: "delete_rows", condition: "selected", reply: "â SatÄ±r silindi", changes: [] } },
  { user_command: "bÃ¼tÃ§e aÅan satÄ±rlarÄ± sil", logic: "delete over budget rows", category: "cleaning", output: { action: "delete_rows", condition: "over_budget", reply: "â BÃ¼tÃ§e aÅan satÄ±rlar silindi", changes: [] } },
  { user_command: "tarih girilmemiÅ olanlarÄ± sil", logic: "delete rows without date", category: "cleaning", output: { action: "delete_rows", condition: "empty_date", reply: "â Tarih girilmemiÅ satÄ±rlar silindi", changes: [] } },
  { user_command: "fiyatsÄ±z Ã¼rÃ¼nleri kaldÄ±r", logic: "remove products without price", category: "cleaning", output: { action: "delete_rows", condition: "empty_price", reply: "â FiyatsÄ±z Ã¼rÃ¼nler kaldÄ±rÄ±ldÄ±", changes: [] } },

  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // 7. TEKRAR KALDIRMA (12 Ã¶rnek)
  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  { user_command: "tekrar edenleri sil", logic: "remove duplicate rows", category: "cleaning", output: { action: "remove_duplicates", reply: "â Tekrarlanan satÄ±rlar silindi", changes: [] } },
  { user_command: "mÃ¼kerrerleri kaldÄ±r", logic: "remove repeated duplicate records", category: "cleaning", output: { action: "remove_duplicates", reply: "â MÃ¼kerrer kayÄ±tlar kaldÄ±rÄ±ldÄ±", changes: [] } },
  { user_command: "aynÄ± olanlarÄ± temizle", logic: "clean identical duplicate entries", category: "cleaning", output: { action: "remove_duplicates", reply: "â Tekrarlar temizlendi", changes: [] } },
  { user_command: "kopya kayÄ±tlarÄ± sil", logic: "delete copy duplicate records", category: "cleaning", output: { action: "remove_duplicates", reply: "â Kopya kayÄ±tlar silindi", changes: [] } },
  { user_command: "benzersiz kayÄ±tlarÄ± bÄ±rak", logic: "keep only unique distinct records", category: "cleaning", output: { action: "remove_duplicates", reply: "â Tekrar eden kayÄ±tlar kaldÄ±rÄ±ldÄ±", changes: [] } },
  { user_command: "duplicate kaldÄ±r", logic: "remove duplicate entries", category: "cleaning", output: { action: "remove_duplicates", reply: "â Duplicate kayÄ±tlar kaldÄ±rÄ±ldÄ±", changes: [] } },
  { user_command: "tekrarlÄ± mÃ¼Återileri temizle", logic: "clean duplicate customer entries", category: "cleaning", output: { action: "remove_duplicates", reply: "â TekrarlÄ± mÃ¼Återiler temizlendi", changes: [] } },
  { user_command: "Ã§ift kayÄ±tlarÄ± sil", logic: "delete double duplicate records", category: "cleaning", output: { action: "remove_duplicates", reply: "â Ãift kayÄ±tlar silindi", changes: [] } },
  { user_command: "aynÄ± TC kimlikli olanlarÄ± kaldÄ±r", logic: "remove same ID number duplicates", category: "cleaning", output: { action: "remove_duplicates", reply: "â AynÄ± TC kimlikli kayÄ±tlar kaldÄ±rÄ±ldÄ±", changes: [] } },
  { user_command: "tekrar eden Ã¼rÃ¼n kodlarÄ±nÄ± temizle", logic: "clean duplicate product codes", category: "cleaning", output: { action: "remove_duplicates", reply: "â Tekrar eden Ã¼rÃ¼n kodlarÄ± temizlendi", changes: [] } },
  { user_command: "aynÄ± fatura numaralÄ±larÄ± kaldÄ±r", logic: "remove duplicate invoice numbers", category: "cleaning", output: { action: "remove_duplicates", reply: "â AynÄ± fatura numaralÄ±lar kaldÄ±rÄ±ldÄ±", changes: [] } },
  { user_command: "tekrarlÄ± e-postalarÄ± sil", logic: "delete duplicate email addresses", category: "cleaning", output: { action: "remove_duplicates", reply: "â TekrarlÄ± e-postalar silindi", changes: [] } },

  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // 8. RENKLENDÄ°RME (28 Ã¶rnek)
  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  { user_command: "negatifleri kÄ±rmÄ±zÄ±ya boya", logic: "highlight negative values red", category: "highlighting", output: { action: "highlight", condition: "value < 0", color: "#fecaca", reply: "â Negatif deÄerler kÄ±rmÄ±zÄ±ya boyandÄ±", changes: [] } },
  { user_command: "eksileri kÄ±rmÄ±zÄ± yap", logic: "make minus negative values red", category: "highlighting", output: { action: "highlight", condition: "value < 0", color: "#fecaca", reply: "â Eksi deÄerler kÄ±rmÄ±zÄ±ya boyandÄ±", changes: [] } },
  { user_command: "sÄ±fÄ±rdan kÃ¼Ã§Ã¼k olanlarÄ± kÄ±rmÄ±zÄ±ya boya", logic: "color below zero cells red", category: "highlighting", output: { action: "highlight", condition: "value < 0", color: "#fecaca", reply: "â Negatif hÃ¼creler boyandÄ±", changes: [] } },
  { user_command: "zararda olanlarÄ± kÄ±rmÄ±zÄ± iÅaretle", logic: "mark loss negative red", category: "highlighting", output: { action: "highlight", condition: "value < 0", color: "#fecaca", reply: "â Zararda olanlar kÄ±rmÄ±zÄ±ya boyandÄ±", changes: [] } },
  { user_command: "eksi bakiye olanlarÄ± kÄ±rmÄ±zÄ± yap", logic: "negative balance cells red", category: "highlighting", output: { action: "highlight", condition: "value < 0", color: "#fecaca", reply: "â Eksi bakiyeler kÄ±rmÄ±zÄ±ya boyandÄ±", changes: [] } },
  { user_command: "borcunu Ã¶demeyenleri kÄ±rmÄ±zÄ±ya boya", logic: "mark unpaid debt red", category: "highlighting", output: { action: "highlight", condition: "unpaid", color: "#fecaca", reply: "â Ãdenmeyenler kÄ±rmÄ±zÄ±ya boyandÄ±", changes: [] } },
  { user_command: "pozitif deÄerleri yeÅile boya", logic: "highlight positive values green", category: "highlighting", output: { action: "highlight", condition: "value > 0", color: "#bbf7d0", reply: "â Pozitif deÄerler yeÅile boyandÄ±", changes: [] } },
  { user_command: "artÄ±larÄ± yeÅil yap", logic: "make positive plus values green", category: "highlighting", output: { action: "highlight", condition: "value > 0", color: "#bbf7d0", reply: "â ArtÄ± deÄerler yeÅile boyandÄ±", changes: [] } },
  { user_command: "karda olanlarÄ± yeÅil yap", logic: "profit positive green", category: "highlighting", output: { action: "highlight", condition: "value > 0", color: "#bbf7d0", reply: "â Karda olanlar yeÅile boyandÄ±", changes: [] } },
  { user_command: "hedefi geÃ§enleri yeÅile boya", logic: "above target green highlight", category: "highlighting", output: { action: "highlight", condition: "value > 0", color: "#bbf7d0", reply: "â Hedefi geÃ§enler yeÅile boyandÄ±", changes: [] } },
  { user_command: "Ã¶denen faturalarÄ± yeÅil yap", logic: "paid invoices green", category: "highlighting", output: { action: "highlight", condition: "paid", color: "#bbf7d0", reply: "â Ãdenen faturalar yeÅile boyandÄ±", changes: [] } },
  { user_command: "en bÃ¼yÃ¼k 5 deÄeri sarÄ±ya boya", logic: "top 5 highest yellow", category: "highlighting", output: { action: "highlight", condition: "top5", color: "#fef08a", reply: "â En bÃ¼yÃ¼k 5 deÄer sarÄ±ya boyandÄ±", changes: [] } },
  { user_command: "en yÃ¼ksek 3 deÄeri vurgula", logic: "highlight top 3 highest", category: "highlighting", output: { action: "highlight", condition: "top3", color: "#fef08a", reply: "â En yÃ¼ksek 3 deÄer vurgulandÄ±", changes: [] } },
  { user_command: "en bÃ¼yÃ¼k 10 deÄeri iÅaretle", logic: "mark top 10 largest", category: "highlighting", output: { action: "highlight", condition: "top10", color: "#fef08a", reply: "â En bÃ¼yÃ¼k 10 deÄer iÅaretlendi", changes: [] } },
  { user_command: "100den bÃ¼yÃ¼kleri maviye boya", logic: "blue highlight above 100", category: "highlighting", output: { action: "highlight", condition: "value > 100", color: "#bfdbfe", reply: "â 100'den bÃ¼yÃ¼k deÄerler maviye boyandÄ±", changes: [] } },
  { user_command: "500den az olanlarÄ± sarÄ±ya boya", logic: "yellow below 500", category: "highlighting", output: { action: "highlight", condition: "value < 500", color: "#fef08a", reply: "â 500'den az deÄerler sarÄ±ya boyandÄ±", changes: [] } },
  { user_command: "kritik stoklarÄ± kÄ±rmÄ±zÄ±ya boya", logic: "critical low stock red", category: "highlighting", output: { action: "highlight", condition: "value < 10", color: "#fecaca", reply: "â Kritik stoklar kÄ±rmÄ±zÄ±ya boyandÄ±", changes: [] } },
  { user_command: "gecikmiÅ Ã¶demeleri vurgula", logic: "overdue payments highlight", category: "highlighting", output: { action: "highlight", condition: "overdue", color: "#fecaca", reply: "â GecikmiÅ Ã¶demeler vurgulandÄ±", changes: [] } },
  { user_command: "vadeyi geÃ§enleri turuncu yap", logic: "past due orange highlight", category: "highlighting", output: { action: "highlight", condition: "overdue", color: "#fed7aa", reply: "â Vadeyi geÃ§enler turuncuya boyandÄ±", changes: [] } },
  { user_command: "1000den fazla olanlarÄ± sarÄ±ya boya", logic: "yellow above 1000", category: "highlighting", output: { action: "highlight", condition: "value > 1000", color: "#fef08a", reply: "â 1000'den fazla deÄerler sarÄ±ya boyandÄ±", changes: [] } },
  { user_command: "sÄ±fÄ±r stoklarÄ± kÄ±rmÄ±zÄ±ya boya", logic: "zero stock red highlight", category: "highlighting", output: { action: "highlight", condition: "value == 0", color: "#fecaca", reply: "â SÄ±fÄ±r stoklar kÄ±rmÄ±zÄ±ya boyandÄ±", changes: [] } },
  { user_command: "satÄ±Å hedefini tutturanlarÄ± yeÅil yap", logic: "target met green highlight", category: "highlighting", output: { action: "highlight", condition: "target_met", color: "#bbf7d0", reply: "â Hedef tutturanlar yeÅile boyandÄ±", changes: [] } },
  { user_command: "bÃ¼tÃ§e aÅÄ±mlarÄ±nÄ± iÅaretle", logic: "over budget mark highlight", category: "highlighting", output: { action: "highlight", condition: "over_budget", color: "#fecaca", reply: "â BÃ¼tÃ§e aÅÄ±mlarÄ± iÅaretlendi", changes: [] } },
  { user_command: "Ä±sÄ±l harita yap", logic: "heatmap color scale apply", category: "highlighting", output: { action: "heatmap", reply: "ð IsÄ±l harita uygulandÄ±", changes: [] } },
  { user_command: "heatmap uygula", logic: "apply heatmap color gradient", category: "highlighting", output: { action: "heatmap", reply: "ð Heatmap uygulandÄ±", changes: [] } },
  { user_command: "deÄerlere gÃ¶re renk skalasÄ± uygula", logic: "apply color scale by value", category: "highlighting", output: { action: "heatmap", reply: "ð Renk skalasÄ± uygulandÄ±", changes: [] } },
  { user_command: "renkleri temizle", logic: "remove all cell colors", category: "highlighting", output: { action: "clear_colors", reply: "â TÃ¼m renkler temizlendi", changes: [] } },
  { user_command: "boyalarÄ± kaldÄ±r", logic: "remove background colors", category: "highlighting", output: { action: "clear_colors", reply: "â HÃ¼cre renkleri kaldÄ±rÄ±ldÄ±", changes: [] } },

  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // 9. KDV VE VERGÄ° (24 Ã¶rnek)
  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  { user_command: "kdv ekle", logic: "add VAT 20 percent Turkey", category: "finance", output: { action: "update_cells", formula: "multiply", factor: 1.20, reply: "â %20 KDV eklendi", changes: [] } },
  { user_command: "kdv hesapla", logic: "calculate VAT tax", category: "finance", output: { action: "update_cells", formula: "multiply", factor: 1.20, reply: "â KDV hesaplandÄ±", changes: [] } },
  { user_command: "yÃ¼zde yirmi kdv ekle", logic: "add 20 percent VAT", category: "finance", output: { action: "update_cells", formula: "multiply", factor: 1.20, reply: "â %20 KDV eklendi", changes: [] } },
  { user_command: "fiyatlara kdv ekle", logic: "add VAT to price column", category: "finance", output: { action: "update_cells", formula: "multiply", column: "fiyat", factor: 1.20, reply: "â Fiyatlara KDV eklendi", changes: [] } },
  { user_command: "kdv dahil fiyatlarÄ± hesapla", logic: "calculate VAT inclusive prices", category: "finance", output: { action: "update_cells", formula: "multiply", factor: 1.20, reply: "â KDV dahil fiyatlar hesaplandÄ±", changes: [] } },
  { user_command: "%20 kdv ekle", logic: "add 20% VAT", category: "finance", output: { action: "update_cells", formula: "multiply", factor: 1.20, reply: "â %20 KDV eklendi", changes: [] } },
  { user_command: "kdv hariÃ§ fiyat bul", logic: "find price excluding VAT", category: "finance", output: { action: "update_cells", formula: "divide", factor: 1.20, reply: "â KDV hariÃ§ fiyatlar hesaplandÄ±", changes: [] } },
  { user_command: "kdv dÃ¼Å", logic: "subtract remove VAT", category: "finance", output: { action: "update_cells", formula: "divide", factor: 1.20, reply: "â KDV dÃ¼ÅÃ¼ldÃ¼", changes: [] } },
  { user_command: "kdv tutarÄ±nÄ± hesapla", logic: "calculate VAT amount only", category: "finance", output: { action: "update_cells", formula: "vat_amount", factor: 0.20, reply: "â KDV tutarÄ± hesaplandÄ±", changes: [] } },
  { user_command: "kdv tutarÄ±nÄ± ayrÄ± gÃ¶ster", logic: "separate show VAT amount", category: "finance", output: { action: "update_cells", formula: "vat_amount", factor: 0.20, reply: "â KDV tutarlarÄ± ayrÄ±ldÄ±", changes: [] } },
  { user_command: "%10 kdv ekle", logic: "add 10 percent VAT", category: "finance", output: { action: "update_cells", formula: "multiply", factor: 1.10, reply: "â %10 KDV eklendi", changes: [] } },
  { user_command: "%8 kdv hesapla", logic: "calculate 8 percent VAT", category: "finance", output: { action: "update_cells", formula: "multiply", factor: 1.08, reply: "â %8 KDV hesaplandÄ±", changes: [] } },
  { user_command: "damga vergisi hesapla", logic: "calculate stamp tax 0.948 percent", category: "finance", output: { action: "update_cells", formula: "stamp_tax", factor: 0.00948, reply: "â Damga vergisi hesaplandÄ±", changes: [] } },
  { user_command: "stopaj hesapla", logic: "calculate withholding tax", category: "finance", output: { action: "update_cells", formula: "withholding_tax", reply: "â Stopaj hesaplandÄ±", changes: [] } },
  { user_command: "gelir vergisi dilimi hesapla", logic: "calculate income tax bracket Turkey", category: "finance", output: { action: "update_cells", formula: "income_tax_bracket", reply: "â Gelir vergisi hesaplandÄ±", changes: [] } },
  { user_command: "kurumlar vergisi hesapla", logic: "calculate corporate tax 20 percent", category: "finance", output: { action: "update_cells", formula: "corporate_tax", factor: 0.20, reply: "â Kurumlar vergisi hesaplandÄ±", changes: [] } },
  { user_command: "geÃ§ici vergi hesapla", logic: "calculate provisional tax quarterly", category: "finance", output: { action: "update_cells", formula: "provisional_tax", reply: "â GeÃ§ici vergi hesaplandÄ±", changes: [] } },
  { user_command: "tevkifatlÄ± kdv hesapla", logic: "calculate withholding VAT", category: "finance", output: { action: "update_cells", formula: "withholding_vat", reply: "â TevkifatlÄ± KDV hesaplandÄ±", changes: [] } },
  { user_command: "vergi matrahÄ±nÄ± bul", logic: "find tax base amount", category: "finance", output: { action: "update_cells", formula: "tax_base", reply: "â Vergi matrahÄ± hesaplandÄ±", changes: [] } },
  { user_command: "kdv beyanname tutarÄ±", logic: "VAT declaration total amount", category: "finance", output: { action: "sum", column: "kdv", reply: "â KDV beyanname tutarÄ± hesaplandÄ±", changes: [] } },
  { user_command: "Ã¶zel tÃ¼ketim vergisi ekle", logic: "add special consumption tax", category: "finance", output: { action: "update_cells", formula: "otv", reply: "â ÃTV eklendi", changes: [] } },
  { user_command: "kÃ¼mÃ¼latif vergi matrahÄ± hesapla", logic: "cumulative tax base calculation", category: "finance", output: { action: "update_cells", formula: "cumulative_tax_base", reply: "â KÃ¼mÃ¼latif vergi matrahÄ± hesaplandÄ±", changes: [] } },
  { user_command: "indirimli kdv hesapla", logic: "calculate reduced VAT rate", category: "finance", output: { action: "update_cells", formula: "reduced_vat", reply: "â Ä°ndirimli KDV hesaplandÄ±", changes: [] } },
  { user_command: "yÄ±llÄ±k vergi hesapla", logic: "annual tax calculation", category: "finance", output: { action: "update_cells", formula: "annual_tax", reply: "â YÄ±llÄ±k vergi hesaplandÄ±", changes: [] } },

  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // 10. MAAÅ VE BORDRO (22 Ã¶rnek)
  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  { user_command: "net maaÅ hesapla", logic: "calculate net salary after deductions", category: "hr", output: { action: "update_cells", formula: "net_salary", reply: "â Net maaÅlar hesaplandÄ±", changes: [] } },
  { user_command: "net Ã¼cret hesapla", logic: "calculate net wage", category: "hr", output: { action: "update_cells", formula: "net_salary", reply: "â Net Ã¼cretler hesaplandÄ±", changes: [] } },
  { user_command: "sgk kesintisini hesapla", logic: "calculate SGK social security deduction Turkey", category: "hr", output: { action: "update_cells", formula: "sgk_deduction", reply: "â SGK kesintileri hesaplandÄ±", changes: [] } },
  { user_command: "sgk primi dÃ¼Å", logic: "subtract SGK premium", category: "hr", output: { action: "update_cells", formula: "sgk_deduction", reply: "â SGK primi dÃ¼ÅÃ¼ldÃ¼", changes: [] } },
  { user_command: "iÅveren sgk payÄ± hesapla", logic: "employer SGK contribution", category: "hr", output: { action: "update_cells", formula: "employer_sgk", reply: "â Ä°Åveren SGK payÄ± hesaplandÄ±", changes: [] } },
  { user_command: "gelir vergisi hesapla", logic: "calculate income tax withholding", category: "hr", output: { action: "update_cells", formula: "income_tax", reply: "â Gelir vergisi hesaplandÄ±", changes: [] } },
  { user_command: "kÄ±dem tazminatÄ± hesapla", logic: "calculate severance pay Turkey", category: "hr", output: { action: "update_cells", formula: "severance_pay", reply: "â KÄ±dem tazminatÄ± hesaplandÄ±", changes: [] } },
  { user_command: "ihbar tazminatÄ± hesapla", logic: "calculate notice pay Turkey", category: "hr", output: { action: "update_cells", formula: "notice_pay", reply: "â Ä°hbar tazminatÄ± hesaplandÄ±", changes: [] } },
  { user_command: "ikramiye ekle", logic: "add bonus payment", category: "hr", output: { action: "update_cells", formula: "add_bonus", reply: "â Ä°kramiye eklendi", changes: [] } },
  { user_command: "brÃ¼tten nete Ã§evir", logic: "convert gross to net salary", category: "hr", output: { action: "update_cells", formula: "gross_to_net", reply: "â BrÃ¼tten nete Ã§evrildi", changes: [] } },
  { user_command: "asgari Ã¼cret farkÄ± hesapla", logic: "minimum wage difference calculation", category: "hr", output: { action: "update_cells", formula: "min_wage_diff", reply: "â Asgari Ã¼cret farkÄ± hesaplandÄ±", changes: [] } },
  { user_command: "yÄ±llÄ±k izin Ã¼creti hesapla", logic: "annual leave pay calculation", category: "hr", output: { action: "update_cells", formula: "vacation_pay", reply: "â YÄ±llÄ±k izin Ã¼creti hesaplandÄ±", changes: [] } },
  { user_command: "fazla mesai Ã¼creti hesapla", logic: "overtime pay calculation", category: "hr", output: { action: "update_cells", formula: "overtime_pay", reply: "â Fazla mesai Ã¼creti hesaplandÄ±", changes: [] } },
  { user_command: "prim hesapla", logic: "calculate commission bonus premium", category: "hr", output: { action: "update_cells", formula: "commission", reply: "â Prim hesaplandÄ±", changes: [] } },
  { user_command: "brÃ¼t maaÅ hesapla", logic: "calculate gross salary", category: "hr", output: { action: "update_cells", formula: "gross_salary", reply: "â BrÃ¼t maaÅ hesaplandÄ±", changes: [] } },
  { user_command: "iÅsizlik sigortasÄ± hesapla", logic: "unemployment insurance Turkey", category: "hr", output: { action: "update_cells", formula: "unemployment_insurance", reply: "â Ä°Åsizlik sigortasÄ± hesaplandÄ±", changes: [] } },
  { user_command: "asgari geÃ§im indirimi hesapla", logic: "minimum living allowance AGI Turkey", category: "hr", output: { action: "update_cells", formula: "minimum_living_allowance", reply: "â AGÄ° hesaplandÄ±", changes: [] } },
  { user_command: "maaÅ bordrosu oluÅtur", logic: "create payroll report", category: "hr", output: { action: "message", formula: "payroll_report", reply: "ð MaaÅ bordrosu hazÄ±rlandÄ±", changes: [] } },
  { user_command: "toplu maaÅ artÄ±ÅÄ± uygula", logic: "apply bulk salary increase", category: "hr", output: { action: "update_cells", formula: "multiply", reply: "â Toplu maaÅ artÄ±ÅÄ± uygulandÄ±", changes: [] } },
  { user_command: "net Ã¶deme tutarÄ± hesapla", logic: "calculate net payment amount", category: "hr", output: { action: "update_cells", formula: "net_payment", reply: "â Net Ã¶deme tutarÄ± hesaplandÄ±", changes: [] } },
  { user_command: "Ã§alÄ±Åan baÅÄ±na maliyet hesapla", logic: "cost per employee calculation", category: "hr", output: { action: "update_cells", formula: "employee_cost", reply: "â ÃalÄ±Åan baÅÄ±na maliyet hesaplandÄ±", changes: [] } },
  { user_command: "baÄ kur hesapla", logic: "Bag-Kur self employed insurance Turkey", category: "hr", output: { action: "update_cells", formula: "bagkur", reply: "â BaÄ-kur hesaplandÄ±", changes: [] } },

  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // 11. YÃZDE / ÃARPMA / BÃLME (18 Ã¶rnek)
  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  { user_command: "yÃ¼zde 10 artÄ±r", logic: "increase by 10 percent", category: "calculation", output: { action: "update_cells", formula: "multiply", factor: 1.10, reply: "â DeÄerler %10 artÄ±rÄ±ldÄ±", changes: [] } },
  { user_command: "fiyatlarÄ± yÃ¼zde 20 zammla", logic: "raise price by 20 percent", category: "calculation", output: { action: "update_cells", formula: "multiply", column: "fiyat", factor: 1.20, reply: "â Fiyatlar %20 artÄ±rÄ±ldÄ±", changes: [] } },
  { user_command: "%15 indirim uygula", logic: "apply 15 percent discount", category: "calculation", output: { action: "update_cells", formula: "multiply", factor: 0.85, reply: "â %15 indirim uygulandÄ±", changes: [] } },
  { user_command: "yÃ¼zde 5 dÃ¼ÅÃ¼r", logic: "decrease by 5 percent", category: "calculation", output: { action: "update_cells", formula: "multiply", factor: 0.95, reply: "â DeÄerler %5 dÃ¼ÅÃ¼rÃ¼ldÃ¼", changes: [] } },
  { user_command: "b sÃ¼tununu 2 ile Ã§arp", logic: "multiply column B by 2", category: "calculation", output: { action: "update_cells", formula: "multiply", column: "B", factor: 2, reply: "â B sÃ¼tunu 2 ile Ã§arpÄ±ldÄ±", changes: [] } },
  { user_command: "fiyatlarÄ± 1.5 ile Ã§arp", logic: "multiply prices by 1.5", category: "calculation", output: { action: "update_cells", formula: "multiply", column: "fiyat", factor: 1.5, reply: "â Fiyatlar 1.5 ile Ã§arpÄ±ldÄ±", changes: [] } },
  { user_command: "deÄerleri 100e bÃ¶l", logic: "divide values by 100", category: "calculation", output: { action: "update_cells", formula: "divide", factor: 100, reply: "â DeÄerler 100'e bÃ¶lÃ¼ndÃ¼", changes: [] } },
  { user_command: "yÃ¼zde deÄiÅimini hesapla", logic: "calculate percent change", category: "calculation", output: { action: "update_cells", formula: "percent_change", reply: "â YÃ¼zde deÄiÅim hesaplandÄ±", changes: [] } },
  { user_command: "enflasyon farkÄ± ekle", logic: "add inflation adjustment", category: "calculation", output: { action: "update_cells", formula: "inflation_adjustment", reply: "â Enflasyon farkÄ± eklendi", changes: [] } },
  { user_command: "dolar kuru ile Ã§arp", logic: "multiply by dollar exchange rate", category: "calculation", output: { action: "update_cells", formula: "multiply_exchange", reply: "â Dolar kuru uygulandÄ±", changes: [] } },
  { user_command: "euro fiyatÄ±na Ã§evir", logic: "convert to euro price", category: "calculation", output: { action: "update_cells", formula: "currency_convert", reply: "â Euro fiyatÄ±na Ã§evrildi", changes: [] } },
  { user_command: "fiyat listesine %10 zam yap", logic: "apply 10 percent price increase", category: "calculation", output: { action: "update_cells", formula: "multiply", factor: 1.10, reply: "â %10 zam uygulandÄ±", changes: [] } },
  { user_command: "satÄ±Å komisyonu hesapla", logic: "calculate sales commission", category: "calculation", output: { action: "update_cells", formula: "commission", reply: "â SatÄ±Å komisyonu hesaplandÄ±", changes: [] } },
  { user_command: "iskonto uygula", logic: "apply trade discount", category: "calculation", output: { action: "update_cells", formula: "discount", reply: "â Ä°skonto uygulandÄ±", changes: [] } },
  { user_command: "net karlÄ±lÄ±k hesapla", logic: "calculate net profitability", category: "calculation", output: { action: "update_cells", formula: "net_profit", reply: "â Net karlÄ±lÄ±k hesaplandÄ±", changes: [] } },
  { user_command: "dÃ¶viz kuru farkÄ±nÄ± hesapla", logic: "calculate exchange rate difference", category: "calculation", output: { action: "update_cells", formula: "exchange_rate_diff", reply: "â DÃ¶viz kuru farkÄ± hesaplandÄ±", changes: [] } },
  { user_command: "30 gÃ¼n vadeli fiyat hesapla", logic: "calculate 30 day deferred price", category: "calculation", output: { action: "update_cells", formula: "deferred_price", reply: "â 30 gÃ¼nlÃ¼k vadeli fiyat hesaplandÄ±", changes: [] } },
  { user_command: "aylÄ±k taksit hesapla", logic: "calculate monthly installment", category: "calculation", output: { action: "update_cells", formula: "installment", reply: "â AylÄ±k taksit hesaplandÄ±", changes: [] } },

  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // 12. FÄ°LTRELEME (22 Ã¶rnek)
  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  { user_command: "istanbul olanlarÄ± gÃ¶ster", logic: "filter show istanbul rows", category: "filtering", output: { action: "filter", condition: "contains", value: "istanbul", reply: "â Ä°stanbul kayÄ±tlarÄ± filtrelendi", changes: [] } },
  { user_command: "ankara olanlarÄ± filtrele", logic: "filter ankara rows", category: "filtering", output: { action: "filter", condition: "contains", value: "ankara", reply: "â Ankara kayÄ±tlarÄ± filtrelendi", changes: [] } },
  { user_command: "100 den bÃ¼yÃ¼k olanlarÄ± gÃ¶ster", logic: "filter show greater than 100", category: "filtering", output: { action: "filter", condition: "value > 100", reply: "â 100'den bÃ¼yÃ¼k deÄerler filtrelendi", changes: [] } },
  { user_command: "1000den az olanlarÄ± filtrele", logic: "filter less than 1000", category: "filtering", output: { action: "filter", condition: "value < 1000", reply: "â 1000'den az deÄerler filtrelendi", changes: [] } },
  { user_command: "bu ay olanlarÄ± gÃ¶ster", logic: "filter current month records", category: "filtering", output: { action: "filter", condition: "currentMonth", reply: "â Bu ayÄ±n kayÄ±tlarÄ± gÃ¶sterildi", changes: [] } },
  { user_command: "son 30 gÃ¼nÃ¼ gÃ¶ster", logic: "filter last 30 days", category: "filtering", output: { action: "filter", condition: "last30days", reply: "â Son 30 gÃ¼nÃ¼n verileri gÃ¶sterildi", changes: [] } },
  { user_command: "bu hafta olanlarÄ± filtrele", logic: "filter this week records", category: "filtering", output: { action: "filter", condition: "thisWeek", reply: "â Bu haftanÄ±n kayÄ±tlarÄ± gÃ¶sterildi", changes: [] } },
  { user_command: "aktif olanlarÄ± gÃ¶ster", logic: "filter active status rows", category: "filtering", output: { action: "filter", condition: "contains", value: "aktif", reply: "â Aktif kayÄ±tlar gÃ¶sterildi", changes: [] } },
  { user_command: "tamamlananlarÄ± filtrele", logic: "filter completed done rows", category: "filtering", output: { action: "filter", condition: "contains", value: "tamamlandÄ±", reply: "â Tamamlanan kayÄ±tlar filtrelendi", changes: [] } },
  { user_command: "bekleyenleri gÃ¶ster", logic: "filter waiting pending rows", category: "filtering", output: { action: "filter", condition: "contains", value: "bekliyor", reply: "â Bekleyen kayÄ±tlar gÃ¶sterildi", changes: [] } },
  { user_command: "filtreyi kaldÄ±r", logic: "remove clear filters", category: "filtering", output: { action: "remove_filter", reply: "â Filtre kaldÄ±rÄ±ldÄ±", changes: [] } },
  { user_command: "tÃ¼m veriyi gÃ¶ster", logic: "show all data remove filter", category: "filtering", output: { action: "remove_filter", reply: "â TÃ¼m veriler gÃ¶sterildi", changes: [] } },
  { user_command: "filtreleri sÄ±fÄ±rla", logic: "reset all filters", category: "filtering", output: { action: "remove_filter", reply: "â Filtreler sÄ±fÄ±rlandÄ±", changes: [] } },
  { user_command: "bu yÄ±l olanlarÄ± gÃ¶ster", logic: "filter current year records", category: "filtering", output: { action: "filter", condition: "currentYear", reply: "â Bu yÄ±lÄ±n kayÄ±tlarÄ± gÃ¶sterildi", changes: [] } },
  { user_command: "stok 10dan az olanlarÄ± gÃ¶ster", logic: "filter low stock below 10", category: "filtering", output: { action: "filter", condition: "value < 10", reply: "â DÃ¼ÅÃ¼k stoklar gÃ¶sterildi", changes: [] } },
  { user_command: "Ã¶denmemiÅ faturalarÄ± gÃ¶ster", logic: "filter unpaid invoices", category: "filtering", output: { action: "filter", condition: "contains", value: "Ã¶denmedi", reply: "â ÃdenmemiÅ faturalar gÃ¶sterildi", changes: [] } },
  { user_command: "iptal edilmeyenleri listele", logic: "list non-cancelled records", category: "filtering", output: { action: "filter", condition: "not_contains", value: "iptal", reply: "â Ä°ptal edilmeyenler listelendi", changes: [] } },
  { user_command: "boÅ olmayanlarÄ± gÃ¶ster", logic: "show non-empty records", category: "filtering", output: { action: "filter", condition: "not_empty", reply: "â Dolu kayÄ±tlar gÃ¶sterildi", changes: [] } },
  { user_command: "pro planlÄ± kullanÄ±cÄ±larÄ± gÃ¶ster", logic: "filter pro plan users", category: "filtering", output: { action: "filter", condition: "contains", value: "pro", reply: "â Pro kullanÄ±cÄ±lar filtrelendi", changes: [] } },
  { user_command: "son 7 gÃ¼nÃ¼ filtrele", logic: "filter last 7 days", category: "filtering", output: { action: "filter", condition: "last7days", reply: "â Son 7 gÃ¼nÃ¼n verileri gÃ¶sterildi", changes: [] } },
  { user_command: "a Åehrindeki mÃ¼Återileri gÃ¶ster", logic: "filter customers by city", category: "filtering", output: { action: "filter", condition: "contains_city", reply: "â Åehir bazlÄ± mÃ¼Återiler filtrelendi", changes: [] } },
  { user_command: "kadÄ±n Ã§alÄ±ÅanlarÄ± filtrele", logic: "filter female employees", category: "filtering", output: { action: "filter", condition: "contains", value: "kadÄ±n", reply: "â KadÄ±n Ã§alÄ±Åanlar filtrelendi", changes: [] } },

  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // 13. METÄ°N DÃNÃÅÃMÃ VE ÃIKARIM (18 Ã¶rnek)
  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  { user_command: "bÃ¼yÃ¼k harfe Ã§evir", logic: "convert text uppercase", category: "text", output: { action: "transform", transform: "uppercase", reply: "â BÃ¼yÃ¼k harfe Ã§evrildi", changes: [] } },
  { user_command: "hepsini bÃ¼yÃ¼k harf yap", logic: "all text uppercase capitals", category: "text", output: { action: "transform", transform: "uppercase", reply: "â BÃ¼yÃ¼k harf yapÄ±ldÄ±", changes: [] } },
  { user_command: "kÃ¼Ã§Ã¼k harfe Ã§evir", logic: "convert text lowercase", category: "text", output: { action: "transform", transform: "lowercase", reply: "â KÃ¼Ã§Ã¼k harfe Ã§evrildi", changes: [] } },
  { user_command: "tÃ¼mÃ¼nÃ¼ kÃ¼Ã§Ã¼k harf yap", logic: "all text lowercase", category: "text", output: { action: "transform", transform: "lowercase", reply: "â KÃ¼Ã§Ã¼k harf yapÄ±ldÄ±", changes: [] } },
  { user_command: "baÅ harfleri bÃ¼yÃ¼k yap", logic: "capitalize first letter title case", category: "text", output: { action: "transform", transform: "capitalize", reply: "â BaÅ harfler bÃ¼yÃ¼k yapÄ±ldÄ±", changes: [] } },
  { user_command: "kelimelerin ilk harfini bÃ¼yÃ¼t", logic: "capitalize each word first letter", category: "text", output: { action: "transform", transform: "capitalize", reply: "â Ä°lk harfler bÃ¼yÃ¼tÃ¼ldÃ¼", changes: [] } },
  { user_command: "boÅluklarÄ± temizle", logic: "trim remove whitespace", category: "text", output: { action: "transform", transform: "trim", reply: "â BoÅluklar temizlendi", changes: [] } },
  { user_command: "fazla boÅluklarÄ± sil", logic: "remove extra spaces", category: "text", output: { action: "transform", transform: "trim", reply: "â Fazla boÅluklar silindi", changes: [] } },
  { user_command: "metinleri birleÅtir", logic: "concatenate join text values", category: "text", output: { action: "transform", transform: "concat", reply: "â Metinler birleÅtirildi", changes: [] } },
  { user_command: "ad soyad sÃ¼tununu ayÄ±r", logic: "split name surname columns", category: "text", output: { action: "extract", type: "name_split", reply: "â Ad ve Soyad ayrÄ±ldÄ±", changes: [] } },
  { user_command: "telefon numaralarÄ±nÄ± formatla", logic: "format phone numbers", category: "text", output: { action: "clean_data", check: "phones", reply: "â Telefon numaralarÄ± formatlandÄ±", changes: [] } },
  { user_command: "e-posta adreslerini Ã§Ä±kar", logic: "extract email addresses", category: "text", output: { action: "extract", type: "email", reply: "â E-posta adresleri Ã§Ä±karÄ±ldÄ±", changes: [] } },
  { user_command: "tc kimlik numaralarÄ±nÄ± bul", logic: "find Turkish ID numbers", category: "text", output: { action: "extract", type: "tc_id", reply: "â TC kimlik numaralarÄ± bulundu", changes: [] } },
  { user_command: "para birimi sembollerini kaldÄ±r", logic: "remove currency symbols", category: "text", output: { action: "clean_data", check: "currency", reply: "â Para birimi sembolleri kaldÄ±rÄ±ldÄ±", changes: [] } },
  { user_command: "tarihleri standart formata Ã§evir", logic: "convert dates standard format", category: "text", output: { action: "clean_data", check: "dates", reply: "â Tarih formatlarÄ± standartlaÅtÄ±rÄ±ldÄ±", changes: [] } },
  { user_command: "sayÄ±larÄ± metinden ayÄ±r", logic: "extract numbers from text", category: "text", output: { action: "extract", type: "number", reply: "â SayÄ±lar metinden ayrÄ±ldÄ±", changes: [] } },
  { user_command: "vergi numaralarÄ±nÄ± Ã§Ä±kar", logic: "extract tax ID numbers", category: "text", output: { action: "extract", type: "tax_id", reply: "â Vergi numaralarÄ± Ã§Ä±karÄ±ldÄ±", changes: [] } },
  { user_command: "adreslerden Åehri Ã§Ä±kar", logic: "extract city from address", category: "text", output: { action: "extract", type: "city", reply: "â Åehirler Ã§Ä±karÄ±ldÄ±", changes: [] } },

  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // 14. EXCEL FORMÃLLERI (25 Ã¶rnek)
  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  { user_command: "vlookup yap", logic: "VLOOKUP lookup reference formula Excel", category: "formula", output: { action: "generate_formula", formula_type: "vlookup", reply: "â VLOOKUP formÃ¼lÃ¼ oluÅturuldu", changes: [] } },
  { user_command: "vlookup formÃ¼lÃ¼ oluÅtur", logic: "create VLOOKUP DÃÅEYARA formula", category: "formula", output: { action: "generate_formula", formula_type: "vlookup", reply: "â DÃÅEYARA formÃ¼lÃ¼ hazÄ±rlandÄ±", changes: [] } },
  { user_command: "dÃ¼Åeyara formÃ¼lÃ¼ hazÄ±rla", logic: "prepare DÃÅEYARA VLOOKUP formula Turkish", category: "formula", output: { action: "generate_formula", formula_type: "vlookup", reply: "â DÃÅEYARA formÃ¼lÃ¼ hazÄ±rlandÄ±", changes: [] } },
  { user_command: "eÄer formÃ¼lÃ¼ uygula", logic: "IF EÄER conditional formula Excel", category: "formula", output: { action: "generate_formula", formula_type: "if", reply: "â EÄER formÃ¼lÃ¼ oluÅturuldu", changes: [] } },
  { user_command: "koÅullu topla", logic: "SUMIF conditional sum formula", category: "formula", output: { action: "generate_formula", formula_type: "sumif", reply: "â ETOPLA formÃ¼lÃ¼ hazÄ±rlandÄ±", changes: [] } },
  { user_command: "sumif formÃ¼lÃ¼ yaz", logic: "write SUMIF ETOPLA formula", category: "formula", output: { action: "generate_formula", formula_type: "sumif", reply: "â SUMIF formÃ¼lÃ¼ oluÅturuldu", changes: [] } },
  { user_command: "Ã§oketopla formÃ¼lÃ¼ oluÅtur", logic: "SUMIFS multiple criteria sum formula", category: "formula", output: { action: "generate_formula", formula_type: "sumifs", reply: "â ÃOKETOPLA formÃ¼lÃ¼ oluÅturuldu", changes: [] } },
  { user_command: "koÅullu say", logic: "COUNTIF conditional count formula", category: "formula", output: { action: "count_if", reply: "â KoÅullu sayÄ±m yapÄ±ldÄ±", changes: [] } },
  { user_command: "index match yaz", logic: "INDEX MATCH lookup formula Excel", category: "formula", output: { action: "generate_formula", formula_type: "index_match", reply: "â INDEX/MATCH formÃ¼lÃ¼ oluÅturuldu", changes: [] } },
  { user_command: "bu hesaplama iÃ§in formÃ¼l yaz", logic: "create formula for calculation", category: "formula", output: { action: "generate_formula", reply: "â FormÃ¼l oluÅturuldu", changes: [] } },
  { user_command: "kÃ¼mÃ¼latif toplam hesapla", logic: "cumulative running total sum", category: "formula", output: { action: "update_cells", formula: "cumulative_sum", reply: "â KÃ¼mÃ¼latif toplam hesaplandÄ±", changes: [] } },
  { user_command: "hareketli ortalama hesapla", logic: "moving average calculation", category: "formula", output: { action: "update_cells", formula: "moving_average", reply: "â Hareketli ortalama hesaplandÄ±", changes: [] } },
  { user_command: "standart sapma hesapla", logic: "standard deviation calculation", category: "formula", output: { action: "message", formula: "std_dev", reply: "ð Standart sapma hesaplandÄ±", changes: [] } },
  { user_command: "medyan bul", logic: "find median middle value", category: "formula", output: { action: "message", formula: "median", reply: "ð Medyan deÄer bulundu", changes: [] } },
  { user_command: "yÃ¼zdelik dilim hesapla", logic: "percentile rank calculation", category: "formula", output: { action: "message", formula: "percentile", reply: "ð YÃ¼zde dilim hesaplandÄ±", changes: [] } },
  { user_command: "korelasyon hesapla", logic: "correlation coefficient calculation", category: "formula", output: { action: "message", formula: "correlation", reply: "ð Korelasyon hesaplandÄ±", changes: [] } },
  { user_command: "eÄer hata formÃ¼lÃ¼", logic: "IFERROR formula handle errors", category: "formula", output: { action: "generate_formula", formula_type: "iferror", reply: "â EÄERHATA formÃ¼lÃ¼ oluÅturuldu", changes: [] } },
  { user_command: "iÃ§ iÃ§e eÄer formÃ¼lÃ¼", logic: "nested IF formula multiple conditions", category: "formula", output: { action: "generate_formula", formula_type: "nested_if", reply: "â Ä°Ã§ iÃ§e EÄER formÃ¼lÃ¼ oluÅturuldu", changes: [] } },
  { user_command: "metin birleÅtir formÃ¼lÃ¼", logic: "CONCATENATE text join formula", category: "formula", output: { action: "generate_formula", formula_type: "concatenate", reply: "â METÄ°N BÄ°RLEÅTÄ°R formÃ¼lÃ¼ oluÅturuldu", changes: [] } },
  { user_command: "rank sÄ±ralama formÃ¼lÃ¼", logic: "RANK formula ranking", category: "formula", output: { action: "generate_formula", formula_type: "rank", reply: "â RANK formÃ¼lÃ¼ oluÅturuldu", changes: [] } },
  { user_command: "xlookup formÃ¼lÃ¼ yaz", logic: "XLOOKUP modern lookup formula", category: "formula", output: { action: "generate_formula", formula_type: "xlookup", reply: "â XLOOKUP formÃ¼lÃ¼ oluÅturuldu", changes: [] } },
  { user_command: "dinamik dizi formÃ¼lÃ¼", logic: "dynamic array spill formula", category: "formula", output: { action: "generate_formula", formula_type: "dynamic_array", reply: "â Dinamik dizi formÃ¼lÃ¼ oluÅturuldu", changes: [] } },
  { user_command: "lambda formÃ¼lÃ¼ oluÅtur", logic: "LAMBDA custom function formula", category: "formula", output: { action: "generate_formula", formula_type: "lambda", reply: "â LAMBDA formÃ¼lÃ¼ oluÅturuldu", changes: [] } },
  { user_command: "let formÃ¼lÃ¼ yaz", logic: "LET variable formula Excel", category: "formula", output: { action: "generate_formula", formula_type: "let", reply: "â LET formÃ¼lÃ¼ oluÅturuldu", changes: [] } },
  { user_command: "unique benzersiz deÄerleri listele", logic: "UNIQUE distinct values list formula", category: "formula", output: { action: "generate_formula", formula_type: "unique", reply: "â UNIQUE formÃ¼lÃ¼ oluÅturuldu", changes: [] } },

  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // 15. VERÄ° ANALÄ°ZÄ° VE RAPOR (20 Ã¶rnek)
  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  { user_command: "rapor oluÅtur", logic: "generate data report", category: "analysis", output: { action: "message", formula: "auto_report", reply: "ð Rapor hazÄ±rlandÄ±", changes: [] } },
  { user_command: "aylÄ±k rapor yap", logic: "create monthly report", category: "analysis", output: { action: "message", formula: "monthly_report", reply: "ð AylÄ±k rapor hazÄ±rlandÄ±", changes: [] } },
  { user_command: "haftalÄ±k rapor oluÅtur", logic: "create weekly report", category: "analysis", output: { action: "message", formula: "weekly_report", reply: "ð HaftalÄ±k rapor hazÄ±rlandÄ±", changes: [] } },
  { user_command: "Ã¶zet Ã§Ä±kar", logic: "create summary overview", category: "analysis", output: { action: "message", formula: "summary", reply: "ð Ãzet rapor oluÅturuldu", changes: [] } },
  { user_command: "istatistikleri gÃ¶ster", logic: "show statistics metrics", category: "analysis", output: { action: "message", formula: "statistics", reply: "ð Ä°statistikler hesaplandÄ±", changes: [] } },
  { user_command: "veri analizi yap", logic: "perform data analysis", category: "analysis", output: { action: "message", formula: "analysis", reply: "ð Veri analizi tamamlandÄ±", changes: [] } },
  { user_command: "satÄ±Å raporu hazÄ±rla", logic: "prepare sales report", category: "analysis", output: { action: "message", formula: "sales_report", reply: "ð SatÄ±Å raporu hazÄ±rlandÄ±", changes: [] } },
  { user_command: "bordro raporu oluÅtur", logic: "create payroll report", category: "analysis", output: { action: "message", formula: "payroll_report", reply: "ð Bordro raporu hazÄ±rlandÄ±", changes: [] } },
  { user_command: "Ã¶zet tablo yap", logic: "create pivot summary table", category: "analysis", output: { action: "message", formula: "pivot_summary", reply: "ð Ãzet tablo oluÅturuldu", changes: [] } },
  { user_command: "karÅÄ±laÅtÄ±rmalÄ± analiz yap", logic: "comparative analysis report", category: "analysis", output: { action: "message", formula: "comparison", reply: "ð KarÅÄ±laÅtÄ±rmalÄ± analiz tamamlandÄ±", changes: [] } },
  { user_command: "bu ay geÃ§en ayla karÅÄ±laÅtÄ±r", logic: "compare current month previous month", category: "analysis", output: { action: "compare", period1: "currentMonth", period2: "lastMonth", reply: "ð Ay karÅÄ±laÅtÄ±rmasÄ± yapÄ±ldÄ±", changes: [] } },
  { user_command: "yÄ±llÄ±k bÃ¼yÃ¼me oranÄ±", logic: "annual growth rate calculation", category: "analysis", output: { action: "update_cells", formula: "growth_rate", reply: "â BÃ¼yÃ¼me oranÄ± hesaplandÄ±", changes: [] } },
  { user_command: "trend analizi yap", logic: "trend analysis time series", category: "analysis", output: { action: "message", formula: "trend_analysis", reply: "ð Trend analizi tamamlandÄ±", changes: [] } },
  { user_command: "tahmin hesapla", logic: "forecast prediction calculation", category: "analysis", output: { action: "forecast", reply: "ð Tahmin hesaplandÄ±", changes: [] } },
  { user_command: "gelecek ayÄ± tahmin et", logic: "forecast next month prediction", category: "analysis", output: { action: "forecast", periods: 1, reply: "ð Gelecek ay tahmini hesaplandÄ±", changes: [] } },
  { user_command: "Ã¶nÃ¼mÃ¼zdeki 3 ayÄ± Ã¶ngÃ¶r", logic: "forecast next 3 months", category: "analysis", output: { action: "forecast", periods: 3, reply: "ð 3 aylÄ±k tahmin hazÄ±rlandÄ±", changes: [] } },
  { user_command: "satÄ±Å tahmini yap", logic: "sales forecast prediction", category: "analysis", output: { action: "forecast", column: "satÄ±Å", reply: "ð SatÄ±Å tahmini hesaplandÄ±", changes: [] } },
  { user_command: "muhasebe raporu oluÅtur", logic: "accounting financial report", category: "analysis", output: { action: "message", formula: "accounting_report", reply: "ð Muhasebe raporu hazÄ±rlandÄ±", changes: [] } },
  { user_command: "pivot tablo oluÅtur", logic: "create pivot table", category: "analysis", output: { action: "message", formula: "pivot_table", reply: "ð Pivot tablo oluÅturuldu", changes: [] } },
  { user_command: "anomali tespit et", logic: "anomaly outlier detection", category: "analysis", output: { action: "anomaly_detection", reply: "ð Anomaliler tespit edildi", changes: [] } },

  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // 16. GRUPLANDIRMA (14 Ã¶rnek)
  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  { user_command: "Åehre gÃ¶re grupla", logic: "group by city column", category: "analysis", output: { action: "group_by", column: "Åehir", reply: "ð Åehre gÃ¶re gruplandÄ±rÄ±ldÄ±", changes: [] } },
  { user_command: "kategoriye gÃ¶re gruplandÄ±r", logic: "group by category", category: "analysis", output: { action: "group_by", column: "kategori", reply: "ð Kategoriye gÃ¶re gruplandÄ±rÄ±ldÄ±", changes: [] } },
  { user_command: "aya gÃ¶re gruplama yap", logic: "group by month", category: "analysis", output: { action: "group_by", column: "ay", reply: "ð Aya gÃ¶re gruplandÄ±rÄ±ldÄ±", changes: [] } },
  { user_command: "satÄ±Å ekibine gÃ¶re grupla", logic: "group by sales team", category: "analysis", output: { action: "group_by", column: "ekip", reply: "ð Ekibe gÃ¶re gruplandÄ±rÄ±ldÄ±", changes: [] } },
  { user_command: "her bÃ¶lgenin toplamÄ±nÄ± gÃ¶ster", logic: "sum by region group", category: "analysis", output: { action: "group_by", aggregate: "sum", reply: "ð BÃ¶lge toplamlarÄ± hesaplandÄ±", changes: [] } },
  { user_command: "mÃ¼Återi baÅÄ±na sipariÅ sayÄ±sÄ±", logic: "count orders per customer", category: "analysis", output: { action: "group_by", aggregate: "count", reply: "ð MÃ¼Återi bazlÄ± sipariÅ sayÄ±larÄ± hesaplandÄ±", changes: [] } },
  { user_command: "Ã¼rÃ¼ne gÃ¶re grupla topla", logic: "group sum by product", category: "analysis", output: { action: "group_by", column: "Ã¼rÃ¼n", aggregate: "sum", reply: "ð ÃrÃ¼ne gÃ¶re toplamlar hesaplandÄ±", changes: [] } },
  { user_command: "hangi Åehirde en Ã§ok satÄ±Å var", logic: "most sales by city group", category: "analysis", output: { action: "group_by", aggregate: "sum", group_column: "Åehir", reply: "ð Åehirlere gÃ¶re satÄ±Å analizi yapÄ±ldÄ±", changes: [] } },
  { user_command: "departmana gÃ¶re gider Ã¶zeti", logic: "expense summary by department", category: "analysis", output: { action: "group_by", column: "departman", aggregate: "sum", reply: "ð Departman bazlÄ± gider Ã¶zeti hazÄ±rlandÄ±", changes: [] } },
  { user_command: "yÄ±la gÃ¶re grupla karÅÄ±laÅtÄ±r", logic: "group compare by year", category: "analysis", output: { action: "group_by", column: "yÄ±l", aggregate: "sum", reply: "ð YÄ±llÄ±k karÅÄ±laÅtÄ±rma yapÄ±ldÄ±", changes: [] } },
  { user_command: "personel bazÄ±nda maaÅ Ã¶zeti", logic: "salary summary per employee", category: "analysis", output: { action: "group_by", column: "personel", aggregate: "sum", reply: "ð Personel bazlÄ± maaÅ Ã¶zeti hazÄ±rlandÄ±", changes: [] } },
  { user_command: "Ã¼rÃ¼n kategorisine gÃ¶re ciro", logic: "revenue by product category", category: "analysis", output: { action: "group_by", column: "kategori", aggregate: "sum", reply: "ð Kategoriye gÃ¶re ciro hesaplandÄ±", changes: [] } },
  { user_command: "mÃ¼Återi segmentine gÃ¶re analiz", logic: "analysis by customer segment", category: "analysis", output: { action: "group_by", column: "segment", reply: "ð MÃ¼Återi segmenti analizi yapÄ±ldÄ±", changes: [] } },
  { user_command: "bÃ¶lge bazlÄ± satÄ±Å karÅÄ±laÅtÄ±rmasÄ±", logic: "regional sales comparison", category: "analysis", output: { action: "group_by", column: "bÃ¶lge", aggregate: "sum", reply: "ð BÃ¶lge bazlÄ± satÄ±Å karÅÄ±laÅtÄ±rmasÄ± yapÄ±ldÄ±", changes: [] } },

  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // 17. MUHASEBE ÃZEL (18 Ã¶rnek)
  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  { user_command: "kar zarar hesapla", logic: "profit loss calculation", category: "accounting", output: { action: "update_cells", formula: "profit_loss", reply: "â Kar/zarar hesaplandÄ±", changes: [] } },
  { user_command: "brÃ¼t kar marjÄ± hesapla", logic: "gross profit margin calculation", category: "accounting", output: { action: "update_cells", formula: "gross_margin", reply: "â BrÃ¼t kar marjÄ± hesaplandÄ±", changes: [] } },
  { user_command: "nakit akÄ±ÅÄ± hesapla", logic: "cash flow calculation", category: "accounting", output: { action: "message", formula: "cash_flow", reply: "ð Nakit akÄ±ÅÄ± hesaplandÄ±", changes: [] } },
  { user_command: "gider toplamÄ± ne kadar", logic: "total expenses sum", category: "accounting", output: { action: "sum", column: "gider", reply: "â Gider toplamÄ± hesaplandÄ±", changes: [] } },
  { user_command: "gelir gider dengesi", logic: "income expense balance", category: "accounting", output: { action: "message", formula: "balance", reply: "ð Gelir gider dengesi gÃ¶sterildi", changes: [] } },
  { user_command: "stok deÄeri hesapla", logic: "inventory value calculation", category: "accounting", output: { action: "update_cells", formula: "inventory_value", reply: "â Stok deÄeri hesaplandÄ±", changes: [] } },
  { user_command: "amortisman hesapla", logic: "depreciation amortization calculation", category: "accounting", output: { action: "update_cells", formula: "depreciation", reply: "â Amortisman hesaplandÄ±", changes: [] } },
  { user_command: "faiz hesapla", logic: "interest calculation", category: "accounting", output: { action: "update_cells", formula: "interest", reply: "â Faiz hesaplandÄ±", changes: [] } },
  { user_command: "bilanÃ§o hazÄ±rla", logic: "prepare balance sheet", category: "accounting", output: { action: "message", formula: "balance_sheet", reply: "ð BilanÃ§o hazÄ±rlandÄ±", changes: [] } },
  { user_command: "alacak hesapla", logic: "receivables sum calculation", category: "accounting", output: { action: "sum", column: "alacak", reply: "â Alacak toplamÄ± hesaplandÄ±", changes: [] } },
  { user_command: "borÃ§ bakiyesi topla", logic: "total debt balance", category: "accounting", output: { action: "sum", column: "borÃ§", reply: "â BorÃ§ bakiyesi toplandÄ±", changes: [] } },
  { user_command: "cari hesap Ã¶zeti", logic: "current account summary", category: "accounting", output: { action: "message", formula: "current_account", reply: "ð Cari hesap Ã¶zeti hazÄ±rlandÄ±", changes: [] } },
  { user_command: "maliyet analizi yap", logic: "cost analysis calculation", category: "accounting", output: { action: "message", formula: "cost_analysis", reply: "ð Maliyet analizi tamamlandÄ±", changes: [] } },
  { user_command: "stok devir hÄ±zÄ± hesapla", logic: "inventory turnover rate", category: "accounting", output: { action: "update_cells", formula: "inventory_turnover", reply: "â Stok devir hÄ±zÄ± hesaplandÄ±", changes: [] } },
  { user_command: "net iÅletme sermayesi hesapla", logic: "net working capital calculation", category: "accounting", output: { action: "update_cells", formula: "working_capital", reply: "â Net iÅletme sermayesi hesaplandÄ±", changes: [] } },
  { user_command: "Ã¶zkaynak karlÄ±lÄ±ÄÄ± hesapla", logic: "return on equity ROE calculation", category: "accounting", output: { action: "update_cells", formula: "roe", reply: "â Ãzkaynak karlÄ±lÄ±ÄÄ± hesaplandÄ±", changes: [] } },
  { user_command: "varlÄ±k karlÄ±lÄ±ÄÄ± hesapla", logic: "return on assets ROA calculation", category: "accounting", output: { action: "update_cells", formula: "roa", reply: "â VarlÄ±k karlÄ±lÄ±ÄÄ± hesaplandÄ±", changes: [] } },
  { user_command: "borÃ§ Ã¶deme gÃ¼cÃ¼ analizi", logic: "debt coverage solvency analysis", category: "accounting", output: { action: "message", formula: "solvency_analysis", reply: "ð BorÃ§ Ã¶deme gÃ¼cÃ¼ analizi tamamlandÄ±", changes: [] } },

  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // 18. VERÄ° TEMÄ°ZLEME GELÄ°ÅMÄ°Å (16 Ã¶rnek)
  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  { user_command: "veriyi temizle", logic: "clean all data", category: "cleaning", output: { action: "clean_data", check: "all", reply: "â Veriler temizlendi", changes: [] } },
  { user_command: "tutarsÄ±zlÄ±klarÄ± dÃ¼zelt", logic: "fix data inconsistencies", category: "cleaning", output: { action: "clean_data", check: "inconsistencies", reply: "â TutarsÄ±zlÄ±klar dÃ¼zeltildi", changes: [] } },
  { user_command: "hatalÄ± verileri dÃ¼zelt", logic: "fix error data", category: "cleaning", output: { action: "clean_data", check: "errors", reply: "â HatalÄ± veriler dÃ¼zeltildi", changes: [] } },
  { user_command: "bÃ¼yÃ¼k kÃ¼Ã§Ã¼k harf tutarsÄ±zlÄ±klarÄ±nÄ± gider", logic: "fix case inconsistencies", category: "cleaning", output: { action: "clean_data", check: "case", reply: "â Harf tutarsÄ±zlÄ±klarÄ± giderildi", changes: [] } },
  { user_command: "boÅ deÄerleri doldur", logic: "fill empty null values", category: "cleaning", output: { action: "clean_data", check: "fill_empty", reply: "â BoÅ deÄerler dolduruldu", changes: [] } },
  { user_command: "veriyi standartlaÅtÄ±r", logic: "standardize normalize data", category: "cleaning", output: { action: "clean_data", check: "standardize", reply: "â Veriler standartlaÅtÄ±rÄ±ldÄ±", changes: [] } },
  { user_command: "sayÄ±sal olmayan deÄerleri bul", logic: "find non-numeric values", category: "cleaning", output: { action: "validate", check: "non_numeric", reply: "â SayÄ±sal olmayan veriler bulundu", changes: [] } },
  { user_command: "eksik verileri gÃ¶ster", logic: "show missing null data", category: "cleaning", output: { action: "validate", check: "missing", reply: "â Eksik veriler gÃ¶sterildi", changes: [] } },
  { user_command: "geÃ§ersiz verileri iÅaretle", logic: "mark invalid data cells", category: "cleaning", output: { action: "highlight", condition: "invalid", color: "#fecaca", reply: "â GeÃ§ersiz veriler iÅaretlendi", changes: [] } },
  { user_command: "aykÄ±rÄ± deÄerleri bul", logic: "find outlier anomaly values", category: "cleaning", output: { action: "anomaly_detection", reply: "ð AykÄ±rÄ± deÄerler bulundu", changes: [] } },
  { user_command: "outlier tespit et", logic: "detect statistical outliers", category: "cleaning", output: { action: "anomaly_detection", reply: "ð Outlier deÄerler tespit edildi", changes: [] } },
  { user_command: "veri kalitesini kontrol et", logic: "check data quality validation", category: "cleaning", output: { action: "validate", check: "all", reply: "â Veri kalitesi kontrol edildi", changes: [] } },
  { user_command: "format hatalarÄ±nÄ± dÃ¼zelt", logic: "fix formatting errors", category: "cleaning", output: { action: "clean_data", check: "format", reply: "â Format hatalarÄ± dÃ¼zeltildi", changes: [] } },
  { user_command: "gereksiz karakterleri kaldÄ±r", logic: "remove unnecessary special characters", category: "cleaning", output: { action: "clean_data", check: "special_chars", reply: "â Gereksiz karakterler kaldÄ±rÄ±ldÄ±", changes: [] } },
  { user_command: "yinelenen baÅlÄ±klarÄ± dÃ¼zelt", logic: "fix duplicate column headers", category: "cleaning", output: { action: "clean_data", check: "headers", reply: "â BaÅlÄ±k tutarsÄ±zlÄ±klarÄ± dÃ¼zeltildi", changes: [] } },
  { user_command: "negatif deÄer kontrolÃ¼ yap", logic: "validate check negative values", category: "cleaning", output: { action: "validate", check: "negative", reply: "â Negatif deÄerler kontrol edildi", changes: [] } },

  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // 19. DUYGU ANALÄ°ZÄ° VE SINIFLANDIRMA (12 Ã¶rnek)
  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  { user_command: "duygu analizi yap", logic: "sentiment analysis text", category: "ai", output: { action: "sentiment_analysis", reply: "ð Duygu analizi yapÄ±ldÄ±", changes: [] } },
  { user_command: "yorum duygularÄ±nÄ± analiz et", logic: "analyze comment sentiments", category: "ai", output: { action: "sentiment_analysis", reply: "ð YorumlarÄ±n duygu analizi tamamlandÄ±", changes: [] } },
  { user_command: "mÃ¼Återi geri bildirimlerini analiz et", logic: "analyze customer feedback sentiment", category: "ai", output: { action: "sentiment_analysis", reply: "ð MÃ¼Återi geri bildirimleri analiz edildi", changes: [] } },
  { user_command: "olumlu mu olumsuz mu sÄ±nÄ±fla", logic: "classify positive negative neutral", category: "ai", output: { action: "sentiment_analysis", reply: "ð Pozitif/Negatif/NÃ¶tr sÄ±nÄ±flandÄ±rmasÄ± yapÄ±ldÄ±", changes: [] } },
  { user_command: "Åikayetleri analiz et", logic: "analyze complaints feedback", category: "ai", output: { action: "sentiment_analysis", reply: "ð Åikayetler analiz edildi", changes: [] } },
  { user_command: "kategorilere ayÄ±r", logic: "classify categorize data", category: "ai", output: { action: "classify", reply: "ð Veriler kategorilere ayrÄ±ldÄ±", changes: [] } },
  { user_command: "giderleri personel kira araÃ§ olarak sÄ±nÄ±fla", logic: "classify expenses personnel rent vehicle", category: "ai", output: { action: "classify", categories: ["Personel", "Kira", "AraÃ§"], reply: "ð Giderler kategorilendi", changes: [] } },
  { user_command: "mÃ¼Återileri segmentlere ayÄ±r", logic: "segment customers groups", category: "ai", output: { action: "classify", column: "mÃ¼Återi", reply: "ð MÃ¼Återi segmentasyonu yapÄ±ldÄ±", changes: [] } },
  { user_command: "Ã¶ncelik dÃ¼zeyi belirle yÃ¼ksek orta dÃ¼ÅÃ¼k", logic: "classify priority high medium low", category: "ai", output: { action: "classify", categories: ["YÃ¼ksek", "Orta", "DÃ¼ÅÃ¼k"], reply: "ð Ãncelik seviyeleri belirlendi", changes: [] } },
  { user_command: "her satÄ±r iÃ§in Ã¶zet yaz", logic: "write summary for each row", category: "ai", output: { action: "batch_ai", task: "summarize", reply: "ð Her satÄ±r iÃ§in Ã¶zet oluÅturuldu", changes: [] } },
  { user_command: "Ã¼rÃ¼n aÃ§Ä±klamalarÄ± yaz", logic: "generate product descriptions", category: "ai", output: { action: "batch_ai", task: "generate_description", reply: "â ÃrÃ¼n aÃ§Ä±klamalarÄ± oluÅturuldu", changes: [] } },
  { user_command: "anahtar kelimeleri Ã§Ä±kar", logic: "extract keywords from text", category: "ai", output: { action: "batch_ai", task: "extract_keywords", reply: "â Anahtar kelimeler Ã§Ä±karÄ±ldÄ±", changes: [] } },

  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // 20. DIÅA AKTARIM (10 Ã¶rnek)
  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  { user_command: "excel olarak indir", logic: "download export as Excel xlsx", category: "export", output: { action: "export", format: "xlsx", reply: "â Excel dosyasÄ± hazÄ±rlandÄ±", changes: [] } },
  { user_command: "csv indir", logic: "download export as CSV", category: "export", output: { action: "export", format: "csv", reply: "â CSV dosyasÄ± indiriliyor", changes: [] } },
  { user_command: "google sheets'e aktar", logic: "export to Google Sheets", category: "export", output: { action: "export", target: "google_sheets", reply: "â Google Sheets'e aktarÄ±ldÄ±", changes: [] } },
  { user_command: "notion'a gÃ¶nder", logic: "send export to Notion", category: "export", output: { action: "export", target: "notion", reply: "â Notion'a gÃ¶nderildi", changes: [] } },
  { user_command: "dosyayÄ± kaydet", logic: "save file export", category: "export", output: { action: "export", format: "xlsx", reply: "â Dosya kaydedildi", changes: [] } },
  { user_command: "slack'e gÃ¶nder", logic: "send to Slack channel", category: "export", output: { action: "export", target: "slack", reply: "â Slack'e gÃ¶nderildi", changes: [] } },
  { user_command: "pdf olarak aktar", logic: "export as PDF", category: "export", output: { action: "export", format: "pdf", reply: "â PDF hazÄ±rlandÄ±", changes: [] } },
  { user_command: "zapier webhook tetikle", logic: "trigger Zapier webhook", category: "export", output: { action: "export", target: "webhook", reply: "â Webhook tetiklendi", changes: [] } },
  { user_command: "tabloyu kopyala", logic: "copy table clipboard", category: "export", output: { action: "export", format: "clipboard", reply: "â Tablo kopyalandÄ±", changes: [] } },
  { user_command: "veriyi paylaÅ", logic: "share data export", category: "export", output: { action: "export", reply: "â Veri paylaÅÄ±ldÄ±", changes: [] } },

  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // 21. SÃTUN VE SATIR Ä°ÅLEMLERÄ° (12 Ã¶rnek)
  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  { user_command: "sÃ¼tun ekle", logic: "add new column", category: "structure", output: { action: "add_column", reply: "â Yeni sÃ¼tun eklendi", changes: [] } },
  { user_command: "yeni kolon ekle", logic: "insert new column", category: "structure", output: { action: "add_column", reply: "â Yeni kolon eklendi", changes: [] } },
  { user_command: "b sÃ¼tununu sil", logic: "delete remove column B", category: "structure", output: { action: "delete_column", column: "B", reply: "â B sÃ¼tunu silindi", changes: [] } },
  { user_command: "fiyat sÃ¼tununu kaldÄ±r", logic: "remove price column", category: "structure", output: { action: "delete_column", column: "fiyat", reply: "â Fiyat sÃ¼tunu kaldÄ±rÄ±ldÄ±", changes: [] } },
  { user_command: "boÅ sÃ¼tunlarÄ± kaldÄ±r", logic: "remove empty columns", category: "structure", output: { action: "delete_empty_columns", reply: "â BoÅ sÃ¼tunlar kaldÄ±rÄ±ldÄ±", changes: [] } },
  { user_command: "sÃ¼tunlarÄ± yeniden adlandÄ±r", logic: "rename columns headers", category: "structure", output: { action: "rename_columns", reply: "â SÃ¼tunlar yeniden adlandÄ±rÄ±ldÄ±", changes: [] } },
  { user_command: "satÄ±r ekle", logic: "add insert new row", category: "structure", output: { action: "add_row", reply: "â Yeni satÄ±r eklendi", changes: [] } },
  { user_command: "son satÄ±ra veri ekle", logic: "add data to last row", category: "structure", output: { action: "add_row", reply: "â Son satÄ±ra veri eklendi", changes: [] } },
  { user_command: "sÃ¼tunlarÄ± yer deÄiÅtir", logic: "swap reorder columns", category: "structure", output: { action: "message", formula: "swap_columns", reply: "â SÃ¼tunlar yer deÄiÅtirdi", changes: [] } },
  { user_command: "tabloyu dÃ¶ndÃ¼r", logic: "transpose rotate table", category: "structure", output: { action: "message", formula: "transpose", reply: "â Tablo dÃ¶ndÃ¼rÃ¼ldÃ¼", changes: [] } },
  { user_command: "geri al", logic: "undo last action", category: "structure", output: { action: "undo", reply: "â Son iÅlem geri alÄ±ndÄ±", changes: [] } },
  { user_command: "tÃ¼m veriyi temizle", logic: "clear all data", category: "structure", output: { action: "clear_all", reply: "â TÃ¼m veri temizlendi", changes: [] } },

  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // 22. ARAMA VE BULMA (10 Ã¶rnek)
  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  { user_command: "ayÅe yi bul", logic: "find search for AyÅe name", category: "search", output: { action: "search", value: "ayÅe", reply: "â 'AyÅe' arama sonuÃ§larÄ± gÃ¶sterildi", changes: [] } },
  { user_command: "istanbul iÃ§eren satÄ±rlarÄ± bul", logic: "find rows containing istanbul", category: "search", output: { action: "filter", condition: "contains", value: "istanbul", reply: "â 'Ä°stanbul' iÃ§eren satÄ±rlar bulundu", changes: [] } },
  { user_command: "100 deÄerini ara", logic: "search for value 100", category: "search", output: { action: "search", value: "100", reply: "â 100 deÄeri arandÄ±", changes: [] } },
  { user_command: "bul ve deÄiÅtir", logic: "find and replace values", category: "search", output: { action: "find_replace", reply: "â Bul ve deÄiÅtir hazÄ±r", changes: [] } },
  { user_command: "tÃ¼m hÃ¼crelerde ara", logic: "search all cells", category: "search", output: { action: "search", scope: "all", reply: "â TÃ¼m hÃ¼crelerde arama yapÄ±ldÄ±", changes: [] } },
  { user_command: "xyz Ã¼rÃ¼nÃ¼nÃ¼ bul", logic: "find product named xyz", category: "search", output: { action: "search", column: "Ã¼rÃ¼n", reply: "â ÃrÃ¼n arama sonuÃ§larÄ± gÃ¶sterildi", changes: [] } },
  { user_command: "mÃ¼Återi no 1234 bul", logic: "find customer number 1234", category: "search", output: { action: "search", value: "1234", reply: "â MÃ¼Återi bulundu", changes: [] } },
  { user_command: "hata iÃ§eren hÃ¼creleri bul", logic: "find cells with errors", category: "search", output: { action: "validate", check: "errors", reply: "â HatalÄ± hÃ¼creler bulundu", changes: [] } },
  { user_command: "formÃ¼l iÃ§eren hÃ¼creleri iÅaretle", logic: "mark cells with formulas", category: "search", output: { action: "highlight", condition: "has_formula", color: "#bfdbfe", reply: "â FormÃ¼llÃ¼ hÃ¼creler iÅaretlendi", changes: [] } },
  { user_command: "boÅ hÃ¼creleri bul ve sarÄ±ya boya", logic: "find empty cells highlight yellow", category: "search", output: { action: "highlight", condition: "empty", color: "#fef08a", reply: "â BoÅ hÃ¼creler sarÄ±ya boyandÄ±", changes: [] } },

  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // 23. GRAFÄ°K VE GÃRSELLEÅTÄ°RME (10 Ã¶rnek)
  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  { user_command: "grafik Ã¶ner", logic: "suggest chart visualization type", category: "chart", output: { action: "message", formula: "chart_suggestion", reply: "ð Verilerinize uygun grafik tÃ¼rleri Ã¶nerildi", changes: [] } },
  { user_command: "Ã§ubuk grafik iÃ§in veri hazÄ±rla", logic: "prepare data for bar chart", category: "chart", output: { action: "message", formula: "chart_bar_data", reply: "ð Ãubuk grafik verisi hazÄ±rlandÄ±", changes: [] } },
  { user_command: "pasta grafik yap", logic: "create pie chart data", category: "chart", output: { action: "message", formula: "chart_pie_data", reply: "ð Pasta grafik verisi hazÄ±rlandÄ±", changes: [] } },
  { user_command: "trend grafiÄi iÃ§in veriyi dÃ¼zenle", logic: "organize data for trend line chart", category: "chart", output: { action: "message", formula: "chart_line_data", reply: "ð Trend grafiÄi verisi dÃ¼zenlendi", changes: [] } },
  { user_command: "hangi grafik tÃ¼rÃ¼ uygun", logic: "which chart type is best", category: "chart", output: { action: "message", formula: "chart_suggestion", reply: "ð Grafik tÃ¼rÃ¼ Ã¶nerisi hazÄ±rlandÄ±", changes: [] } },
  { user_command: "dashboard iÃ§in veri hazÄ±rla", logic: "prepare dashboard data", category: "chart", output: { action: "message", formula: "dashboard_data", reply: "ð Dashboard verisi hazÄ±rlandÄ±", changes: [] } },
  { user_command: "satÄ±Å grafiÄi iÃ§in dÃ¼zenle", logic: "organize for sales chart", category: "chart", output: { action: "message", formula: "sales_chart", reply: "ð SatÄ±Å grafiÄi verisi dÃ¼zenlendi", changes: [] } },
  { user_command: "aylÄ±k trend gÃ¶ster", logic: "show monthly trend", category: "chart", output: { action: "message", formula: "monthly_trend", reply: "ð AylÄ±k trend hazÄ±rlandÄ±", changes: [] } },
  { user_command: "karÅÄ±laÅtÄ±rma grafiÄi hazÄ±rla", logic: "prepare comparison chart", category: "chart", output: { action: "message", formula: "comparison_chart", reply: "ð KarÅÄ±laÅtÄ±rma grafiÄi hazÄ±rlandÄ±", changes: [] } },
  { user_command: "sparkline ekle", logic: "add sparkline mini chart", category: "chart", output: { action: "message", formula: "sparkline", reply: "ð Sparkline eklendi", changes: [] } },

  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // 24. TARÄ°H Ä°ÅLEMLERÄ° (12 Ã¶rnek)
  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  { user_command: "tarihleri formatla", logic: "format date values", category: "date", output: { action: "transform", transform: "date_format", reply: "â Tarihler formatlandÄ±", changes: [] } },
  { user_command: "tarihleri gg.aa.yyyy yap", logic: "convert dates DD.MM.YYYY format", category: "date", output: { action: "transform", transform: "date_dmY", reply: "â Tarihler GG.AA.YYYY formatÄ±na Ã§evrildi", changes: [] } },
  { user_command: "yÄ±lÄ± Ã§Ä±kar", logic: "extract year from date", category: "date", output: { action: "transform", transform: "extract_year", reply: "â YÄ±llar Ã§Ä±karÄ±ldÄ±", changes: [] } },
  { user_command: "ayÄ± gÃ¶ster", logic: "extract show month from date", category: "date", output: { action: "transform", transform: "extract_month", reply: "â Aylar gÃ¶sterildi", changes: [] } },
  { user_command: "gÃ¼n bilgisini al", logic: "extract day from date", category: "date", output: { action: "transform", transform: "extract_day", reply: "â GÃ¼n bilgileri alÄ±ndÄ±", changes: [] } },
  { user_command: "en eski tarihi bul", logic: "find minimum oldest date", category: "date", output: { action: "min", column: "tarih", reply: "â En eski tarih bulundu", changes: [] } },
  { user_command: "en yeni tarihi bul", logic: "find maximum newest date", category: "date", output: { action: "max", column: "tarih", reply: "â En yeni tarih bulundu", changes: [] } },
  { user_command: "tarihe gÃ¶re gruplayarak say", logic: "count group by date", category: "date", output: { action: "group_by", column: "tarih", aggregate: "count", reply: "â Tarih bazlÄ± sayÄ±m yapÄ±ldÄ±", changes: [] } },
  { user_command: "iki tarih arasÄ± gÃ¼n hesapla", logic: "calculate days between two dates", category: "date", output: { action: "update_cells", formula: "date_diff", reply: "â GÃ¼n farkÄ± hesaplandÄ±", changes: [] } },
  { user_command: "iÅ gÃ¼nÃ¼ sayÄ±sÄ±nÄ± hesapla", logic: "count working business days", category: "date", output: { action: "update_cells", formula: "workdays", reply: "â Ä°Å gÃ¼nleri hesaplandÄ±", changes: [] } },
  { user_command: "vade tarihi hesapla", logic: "calculate due date maturity", category: "date", output: { action: "update_cells", formula: "due_date", reply: "â Vade tarihi hesaplandÄ±", changes: [] } },
  { user_command: "ay sonu tarihi bul", logic: "find end of month date", category: "date", output: { action: "update_cells", formula: "month_end", reply: "â Ay sonu tarihi bulundu", changes: [] } },

  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // 25. YARDIM VE BÄ°LGÄ° (12 Ã¶rnek)
  // ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  { user_command: "ne yapabilirim", logic: "help what commands available", category: "help", output: { action: "message", reply: "ð¡ SÄ±ralama, filtreleme, hesaplama, renklendirme, rapor oluÅturma yapabilirsiniz!", changes: [] } },
  { user_command: "yardÄ±m", logic: "help assistance support", category: "help", output: { action: "message", reply: "ð¡ Ãrnek: 'B sÃ¼tununu topla', 'BoÅ satÄ±rlarÄ± sil', 'KDV ekle', 'AylÄ±k rapor yap'", changes: [] } },
  { user_command: "nasÄ±l kullanÄ±rÄ±m", logic: "how to use guide instructions", category: "help", output: { action: "message", reply: "ð¡ TÃ¼rkÃ§e olarak ne yapmak istediÄinizi yazÄ±n. Ãrn: 'FiyatlarÄ± bÃ¼yÃ¼kten kÃ¼Ã§Ã¼Äe sÄ±rala'", changes: [] } },
  { user_command: "ne yaparsÄ±n", logic: "what can you do capabilities", category: "help", output: { action: "message", reply: "ð¡ Excel verilerinizi TÃ¼rkÃ§e komutlarla yÃ¶netebilirsiniz.", changes: [] } },
  { user_command: "komutlar neler", logic: "list available commands", category: "help", output: { action: "message", reply: "ð¡ Topla, sÄ±rala, filtrele, renklendir, KDV hesapla, maaÅ hesapla ve Ã§ok daha fazlasÄ±!", changes: [] } },
  { user_command: "bu formÃ¼lÃ¼ aÃ§Ä±kla", logic: "explain this formula", category: "help", output: { action: "explain", reply: "ð¡ FormÃ¼l aÃ§Ä±klandÄ±", changes: [] } },
  { user_command: "vlookup nedir", logic: "what is VLOOKUP explain", category: "help", output: { action: "explain", formula_name: "vlookup", reply: "ð¡ VLOOKUP formÃ¼lÃ¼ aÃ§Ä±klandÄ±", changes: [] } },
  { user_command: "sumif nasÄ±l kullanÄ±lÄ±r", logic: "how to use SUMIF formula", category: "help", output: { action: "explain", formula_name: "sumif", reply: "ð¡ SUMIF kullanÄ±mÄ± aÃ§Ä±klandÄ±", changes: [] } },
  { user_command: "kaÃ§ sÃ¼tun var", logic: "how many columns sheet info", category: "help", output: { action: "message", formula: "sheet_info", reply: "ð Tablo bilgileri gÃ¶sterildi", changes: [] } },
  { user_command: "veriler hakkÄ±nda bilgi ver", logic: "data summary information", category: "help", output: { action: "message", formula: "data_summary", reply: "ð Veri Ã¶zeti hazÄ±rlandÄ±", changes: [] } },
  { user_command: "bu veriyi analiz et", logic: "analyze this data full", category: "help", output: { action: "message", formula: "full_analysis", reply: "ð Veri analizi tamamlandÄ±", changes: [] } },
  { user_command: "hÄ±zlÄ± Ã¶zet gÃ¶ster", logic: "show quick summary overview", category: "help", output: { action: "message", formula: "quick_summary", reply: "ð HÄ±zlÄ± Ã¶zet hazÄ±rlandÄ±", changes: [] } },


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


  // ──────────────────────────────────────────────────────────
  // VALIDATE (+10 yeni örnek — toplam 15)
  // ──────────────────────────────────────────────────────────
  { user_command: "e-posta adreslerinin formatını doğrula", logic: "validate email address format in column", category: "cleaning", output: { action: "validate", type: "email", reply: "✓ E-posta formatları doğrulandı", changes: [] } },
  { user_command: "telefon numaralarını kontrol et", logic: "validate phone number format digits", category: "cleaning", output: { action: "validate", type: "phone", reply: "✓ Telefon numaraları kontrol edildi", changes: [] } },
  { user_command: "tarih formatı geçerli mi kontrol et", logic: "validate date format correctness", category: "cleaning", output: { action: "validate", type: "date", reply: "✓ Tarih formatları doğrulandı", changes: [] } },
  { user_command: "TC kimlik numaralarını doğrula", logic: "validate Turkish national ID number format", category: "cleaning", output: { action: "validate", type: "tc_kimlik", reply: "✓ TC kimlik numaraları doğrulandı", changes: [] } },
  { user_command: "IBAN numaralarının doğruluğunu kontrol et", logic: "validate IBAN bank account number format", category: "cleaning", output: { action: "validate", type: "IBAN", reply: "✓ IBAN numaraları doğrulandı", changes: [] } },
  { user_command: "negatif değer var mı kontrol et", logic: "validate no negative values exist in column", category: "cleaning", output: { action: "validate", type: "positive_only", reply: "✓ Negatif değer kontrolü yapıldı", changes: [] } },
  { user_command: "boş hücre var mı bak", logic: "validate check for empty blank cells", category: "cleaning", output: { action: "validate", type: "not_empty", reply: "✓ Boş hücre kontrolü yapıldı", changes: [] } },
  { user_command: "vergi numarası formatını doğrula", logic: "validate tax number VKN format Turkey", category: "cleaning", output: { action: "validate", type: "vergi_no", reply: "✓ Vergi numaraları doğrulandı", changes: [] } },
  { user_command: "sayısal sütunda metin var mı kontrol et", logic: "validate numeric column has no text strings", category: "cleaning", output: { action: "validate", type: "numeric", reply: "✓ Sayısal doğrulama tamamlandı", changes: [] } },
  { user_command: "değerler belirli aralıkta mı kontrol et", logic: "validate values within acceptable range bounds", category: "cleaning", output: { action: "validate", type: "range", reply: "✓ Değer aralığı doğrulandı", changes: [] } },

  // ──────────────────────────────────────────────────────────
  // SEARCH (+10 yeni örnek — toplam 15)
  // ──────────────────────────────────────────────────────────
  { user_command: "ahmet'i ara", logic: "search for name Ahmet in all cells", category: "search", output: { action: "search", query: "ahmet", reply: "✓ 'Ahmet' arandı", changes: [] } },
  { user_command: "istanbul'u bul", logic: "search find istanbul city text", category: "search", output: { action: "search", query: "istanbul", reply: "✓ 'İstanbul' arandı", changes: [] } },
  { user_command: "fatura numarasını ara", logic: "search for invoice number text", category: "search", output: { action: "search", column: "fatura", reply: "✓ Fatura numarası arandı", changes: [] } },
  { user_command: "iptal olan siparişleri ara", logic: "search for cancelled orders status text", category: "search", output: { action: "search", query: "iptal", reply: "✓ İptal siparişler arandı", changes: [] } },
  { user_command: "e-postada gmail olanları bul", logic: "search gmail in email column contains", category: "search", output: { action: "search", query: "gmail", column: "email", reply: "✓ Gmail adresleri bulundu", changes: [] } },
  { user_command: "ürün kodunda ABC içerenleri bul", logic: "search contains ABC in product code column", category: "search", output: { action: "search", query: "ABC", column: "ürün_kodu", reply: "✓ ABC içeren kayıtlar bulundu", changes: [] } },
  { user_command: "notlarda önemli geçenleri ara", logic: "search important keyword in notes column", category: "search", output: { action: "search", query: "önemli", column: "not", reply: "✓ 'Önemli' içeren notlar arandı", changes: [] } },
  { user_command: "müşteri adında şirketi ara", logic: "search company keyword in customer name field", category: "search", output: { action: "search", query: "şirket", column: "müşteri", reply: "✓ Şirket içeren müşteriler arandı", changes: [] } },
  { user_command: "2024 yılına ait kayıtları bul", logic: "search find year 2024 in date column", category: "search", output: { action: "search", query: "2024", column: "tarih", reply: "✓ 2024 kayıtları bulundu", changes: [] } },
  { user_command: "eksik veri içeren satırları bul", logic: "search find rows with missing incomplete data", category: "search", output: { action: "search", type: "empty", reply: "✓ Eksik veri satırları bulundu", changes: [] } },

  // ──────────────────────────────────────────────────────────
  // REMOVE_FILTER (+6 yeni örnek — toplam 10)
  // ──────────────────────────────────────────────────────────
  { user_command: "filtreyi kaldır", logic: "remove clear active filter", category: "filtering", output: { action: "remove_filter", reply: "✓ Filtre kaldırıldı", changes: [] } },
  { user_command: "filtrelemeyi iptal et", logic: "cancel disable current filter", category: "filtering", output: { action: "remove_filter", reply: "✓ Filtreleme iptal edildi", changes: [] } },
  { user_command: "tüm verileri göster", logic: "show all data remove filter", category: "filtering", output: { action: "remove_filter", reply: "✓ Tüm veriler gösterildi", changes: [] } },
  { user_command: "filtreyi temizle", logic: "clear remove applied filter", category: "filtering", output: { action: "remove_filter", reply: "✓ Filtre temizlendi", changes: [] } },
  { user_command: "hepsini göster filtreyi kaldır", logic: "show all records clear filter reset", category: "filtering", output: { action: "remove_filter", reply: "✓ Tüm kayıtlar gösterildi", changes: [] } },
  { user_command: "normal görünüme dön", logic: "return normal view remove filter", category: "filtering", output: { action: "remove_filter", reply: "✓ Normal görünüme dönüldü", changes: [] } },

  // ──────────────────────────────────────────────────────────
  // COUNT (+6 yeni örnek — toplam 10)
  // ──────────────────────────────────────────────────────────
  { user_command: "kaç kayıt var", logic: "count total number of records rows", category: "calculation", output: { action: "count", reply: "✓ Toplam kayıt sayısı hesaplandı", changes: [] } },
  { user_command: "satır sayısını say", logic: "count total rows in spreadsheet", category: "calculation", output: { action: "count", reply: "✓ Satır sayısı hesaplandı", changes: [] } },
  { user_command: "müşteri sayısı kaç", logic: "count number of customers total", category: "calculation", output: { action: "count", column: "müşteri", reply: "✓ Müşteri sayısı hesaplandı", changes: [] } },
  { user_command: "ürün adedi kaç", logic: "count number of products quantity", category: "calculation", output: { action: "count", column: "ürün", reply: "✓ Ürün adedi sayıldı", changes: [] } },
  { user_command: "toplam fatura sayısı", logic: "count total number of invoices", category: "calculation", output: { action: "count", column: "fatura", reply: "✓ Fatura sayısı hesaplandı", changes: [] } },
  { user_command: "kaç farklı şehir var", logic: "count number of entries by city", category: "calculation", output: { action: "count", column: "şehir", reply: "✓ Şehir sayısı hesaplandı", changes: [] } },

  // ──────────────────────────────────────────────────────────
  // TOP_N (+7 yeni örnek — toplam 10)
  // ──────────────────────────────────────────────────────────
  { user_command: "en yüksek satışlı 10 ürünü göster", logic: "show top 10 products by sales descending", category: "analysis", output: { action: "top_n", column: "satış", n: 10, direction: "desc", reply: "✓ En yüksek 10 satış gösterildi", changes: [] } },
  { user_command: "en pahalı 5 ürünü listele", logic: "list top 5 most expensive products by price", category: "analysis", output: { action: "top_n", column: "fiyat", n: 5, direction: "desc", reply: "✓ En pahalı 5 ürün listelendi", changes: [] } },
  { user_command: "en yüksek maaşlı 3 çalışanı göster", logic: "show top 3 employees highest salary", category: "analysis", output: { action: "top_n", column: "maaş", n: 3, direction: "desc", reply: "✓ En yüksek maaşlı 3 çalışan gösterildi", changes: [] } },
  { user_command: "en büyük 10 siparişi göster", logic: "show top 10 largest orders by amount", category: "analysis", output: { action: "top_n", column: "tutar", n: 10, direction: "desc", reply: "✓ En büyük 10 sipariş gösterildi", changes: [] } },
  { user_command: "en fazla alışveriş yapan 5 müşteriyi listele", logic: "list top 5 customers most purchases", category: "analysis", output: { action: "top_n", column: "alışveriş", n: 5, direction: "desc", reply: "✓ En fazla alışveriş yapan 5 müşteri listelendi", changes: [] } },
  { user_command: "en düşük performanslı 5 ürünü göster", logic: "show bottom 5 worst performing products", category: "analysis", output: { action: "top_n", column: "satış", n: 5, direction: "asc", reply: "✓ En düşük performanslı 5 ürün gösterildi", changes: [] } },
  { user_command: "kâr oranı en yüksek 10 kaydı getir", logic: "get top 10 records highest profit margin", category: "analysis", output: { action: "top_n", column: "kar", n: 10, direction: "desc", reply: "✓ Kâr oranı en yüksek 10 kayıt getirildi", changes: [] } },

  // ──────────────────────────────────────────────────────────
  // EXPLAIN (+7 yeni örnek — toplam 10)
  // ──────────────────────────────────────────────────────────
  { user_command: "bu veriyi açıkla", logic: "explain summarize the current data insight", category: "help", output: { action: "explain", reply: "📊 Veri analizi ve açıklama yapıldı", changes: [] } },
  { user_command: "satış trendini açıkla", logic: "explain sales trend pattern insight", category: "help", output: { action: "explain", column: "satış", reply: "📊 Satış trendi açıklandı", changes: [] } },
  { user_command: "bu tabloyu özetle", logic: "summarize explain table data overview", category: "help", output: { action: "explain", reply: "📊 Tablo özeti oluşturuldu", changes: [] } },
  { user_command: "anomalileri açıkla", logic: "explain detected anomalies outliers meaning", category: "help", output: { action: "explain", reply: "📊 Anomaliler açıklandı", changes: [] } },
  { user_command: "neden bu sonuç çıktı", logic: "explain why this result outcome reason", category: "help", output: { action: "explain", reply: "📊 Sonucun nedeni açıklandı", changes: [] } },
  { user_command: "gelir düşüşünü açıkla", logic: "explain revenue decline drop reason insight", category: "help", output: { action: "explain", column: "gelir", reply: "📊 Gelir düşüşü açıklandı", changes: [] } },
  { user_command: "bu verileri yorumla", logic: "interpret analyze and explain data meaning", category: "help", output: { action: "explain", reply: "📊 Veriler yorumlandı", changes: [] } },

  // ──────────────────────────────────────────────────────────
  // COUNT_UNIQUE (+8 yeni örnek — toplam 10)
  // ──────────────────────────────────────────────────────────
  { user_command: "kaç farklı müşteri var", logic: "count unique distinct customers", category: "calculation", output: { action: "count_unique", column: "müşteri", reply: "✓ Benzersiz müşteri sayısı hesaplandı", changes: [] } },
  { user_command: "benzersiz ürün sayısı kaç", logic: "count unique distinct product names", category: "calculation", output: { action: "count_unique", column: "ürün", reply: "✓ Benzersiz ürün sayısı hesaplandı", changes: [] } },
  { user_command: "kaç farklı kategori var", logic: "count unique distinct categories", category: "calculation", output: { action: "count_unique", column: "kategori", reply: "✓ Benzersiz kategori sayısı hesaplandı", changes: [] } },
  { user_command: "farklı şehir sayısını göster", logic: "show count unique distinct cities", category: "calculation", output: { action: "count_unique", column: "şehir", reply: "✓ Benzersiz şehir sayısı gösterildi", changes: [] } },
  { user_command: "kaç farklı tedarikçi var", logic: "count unique distinct suppliers vendors", category: "calculation", output: { action: "count_unique", column: "tedarikçi", reply: "✓ Benzersiz tedarikçi sayısı hesaplandı", changes: [] } },
  { user_command: "benzersiz sipariş durumu kaç tür", logic: "count unique distinct order status types", category: "calculation", output: { action: "count_unique", column: "durum", reply: "✓ Benzersiz sipariş durumu sayıldı", changes: [] } },
  { user_command: "kaç farklı departman var", logic: "count unique distinct departments HR", category: "calculation", output: { action: "count_unique", column: "departman", reply: "✓ Benzersiz departman sayısı hesaplandı", changes: [] } },
  { user_command: "farklı para birimi kaç tane", logic: "count unique distinct currency types", category: "calculation", output: { action: "count_unique", column: "para_birimi", reply: "✓ Benzersiz para birimi sayıldı", changes: [] } },

  // ──────────────────────────────────────────────────────────
  // DELETE_COLUMN (+6 yeni örnek — toplam 8)
  // ──────────────────────────────────────────────────────────
  { user_command: "notlar sütununu sil", logic: "delete remove notes column", category: "structure", output: { action: "delete_column", column: "notlar", reply: "✓ Notlar sütunu silindi", changes: [] } },
  { user_command: "açıklama kolonunu kaldır", logic: "remove delete description column", category: "structure", output: { action: "delete_column", column: "açıklama", reply: "✓ Açıklama kolonu kaldırıldı", changes: [] } },
  { user_command: "bu sütunu sil", logic: "delete selected current column", category: "structure", output: { action: "delete_column", reply: "✓ Sütun silindi", changes: [] } },
  { user_command: "gereksiz sütunları kaldır", logic: "remove delete unnecessary extra columns", category: "structure", output: { action: "delete_column", reply: "✓ Gereksiz sütunlar kaldırıldı", changes: [] } },
  { user_command: "eski fiyat sütununu sil", logic: "delete old price column remove", category: "structure", output: { action: "delete_column", column: "eski_fiyat", reply: "✓ Eski fiyat sütunu silindi", changes: [] } },
  { user_command: "e sütununu kaldır", logic: "delete remove column E", category: "structure", output: { action: "delete_column", column: "E", reply: "✓ E sütunu kaldırıldı", changes: [] } },

  // ──────────────────────────────────────────────────────────
  // CLEAR_COLORS (+6 yeni örnek — toplam 8)
  // ──────────────────────────────────────────────────────────
  { user_command: "renkleri temizle", logic: "clear remove all cell colors highlights", category: "highlighting", output: { action: "clear_colors", reply: "✓ Renkler temizlendi", changes: [] } },
  { user_command: "tüm vurgulamaları kaldır", logic: "remove clear all highlights colors formatting", category: "highlighting", output: { action: "clear_colors", reply: "✓ Tüm vurgulamalar kaldırıldı", changes: [] } },
  { user_command: "renklendirmeyi iptal et", logic: "cancel undo color formatting highlights", category: "highlighting", output: { action: "clear_colors", reply: "✓ Renklendirme iptal edildi", changes: [] } },
  { user_command: "arka plan renklerini sil", logic: "delete remove background fill colors cells", category: "highlighting", output: { action: "clear_colors", reply: "✓ Arka plan renkleri silindi", changes: [] } },
  { user_command: "boyayı kaldır", logic: "remove paint color fill all cells", category: "highlighting", output: { action: "clear_colors", reply: "✓ Boya kaldırıldı", changes: [] } },
  { user_command: "sütun renklerini temizle", logic: "clear column colors remove highlights", category: "highlighting", output: { action: "clear_colors", reply: "✓ Sütun renkleri temizlendi", changes: [] } },

  // ──────────────────────────────────────────────────────────
  // UNDO (+4 yeni örnek — toplam 5)
  // ──────────────────────────────────────────────────────────
  { user_command: "geri al", logic: "undo last action revert", category: "structure", output: { action: "undo", reply: "✓ Son işlem geri alındı", changes: [] } },
  { user_command: "bir önceki adıma dön", logic: "go back previous step undo", category: "structure", output: { action: "undo", reply: "✓ Önceki adıma dönüldü", changes: [] } },
  { user_command: "yaptığımı geri al", logic: "undo what I just did revert", category: "structure", output: { action: "undo", reply: "✓ İşlem geri alındı", changes: [] } },
  { user_command: "ctrl z", logic: "undo keyboard shortcut last action", category: "structure", output: { action: "undo", reply: "✓ Geri alındı", changes: [] } },

  // ──────────────────────────────────────────────────────────
  // RENAME_COLUMNS (+5 yeni örnek — toplam 6)
  // ──────────────────────────────────────────────────────────
  { user_command: "sütun adlarını değiştir", logic: "rename column headers names", category: "structure", output: { action: "rename_columns", mapping: {}, reply: "✓ Sütun adları değiştirildi", changes: [] } },
  { user_command: "başlıkları yeniden adlandır", logic: "rename column headers titles", category: "structure", output: { action: "rename_columns", mapping: {}, reply: "✓ Başlıklar yeniden adlandırıldı", changes: [] } },
  { user_command: "a sütununu isim olarak adlandır", logic: "rename column A to isim name", category: "structure", output: { action: "rename_columns", mapping: { A: "isim" }, reply: "✓ Sütun adlandırıldı", changes: [] } },
  { user_command: "sütun başlıklarını türkçeleştir", logic: "rename column headers to Turkish names", category: "structure", output: { action: "rename_columns", mapping: {}, reply: "✓ Sütun başlıkları Türkçeleştirildi", changes: [] } },
  { user_command: "fiyat sütununun adını tutar olarak değiştir", logic: "rename column fiyat price to tutar amount", category: "structure", output: { action: "rename_columns", mapping: { fiyat: "tutar" }, reply: "✓ Sütun adı değiştirildi", changes: [] } },

  // ──────────────────────────────────────────────────────────
  // FIND_REPLACE (+5 yeni örnek — toplam 6)
  // ──────────────────────────────────────────────────────────
  { user_command: "tüm evet değerlerini yes ile değiştir", logic: "find replace evet with yes all cells", category: "cleaning", output: { action: "find_replace", find: "evet", replace: "yes", reply: "✓ Evet → Yes değiştirildi", changes: [] } },
  { user_command: "istanbul yazısını İstanbul olarak düzelt", logic: "find replace istanbul with correct Istanbul capitalization", category: "cleaning", output: { action: "find_replace", find: "istanbul", replace: "İstanbul", reply: "✓ istanbul → İstanbul düzeltildi", changes: [] } },
  { user_command: "türk lirasını tl ile değiştir", logic: "find replace Turkish lira text with TL abbreviation", category: "cleaning", output: { action: "find_replace", find: "türk lirası", replace: "TL", reply: "✓ Türk Lirası → TL değiştirildi", changes: [] } },
  { user_command: "null değerleri boş bırak", logic: "find replace null text with empty blank", category: "cleaning", output: { action: "find_replace", find: "null", replace: "", reply: "✓ Null değerler temizlendi", changes: [] } },
  { user_command: "iptal olanları reddedildi olarak güncelle", logic: "find replace iptal cancelled with reddedildi rejected", category: "cleaning", output: { action: "find_replace", find: "iptal", replace: "reddedildi", reply: "✓ İptal → Reddedildi güncellendi", changes: [] } },

  // ──────────────────────────────────────────────────────────
  // DELETE_EMPTY_COLUMNS (+4 yeni örnek — toplam 5)
  // ──────────────────────────────────────────────────────────
  { user_command: "boş sütunları sil", logic: "delete remove empty blank columns", category: "cleaning", output: { action: "delete_empty_columns", reply: "✓ Boş sütunlar silindi", changes: [] } },
  { user_command: "içi boş kolonları kaldır", logic: "remove empty columns no data", category: "cleaning", output: { action: "delete_empty_columns", reply: "✓ Boş kolonlar kaldırıldı", changes: [] } },
  { user_command: "gereksiz boş sütunları temizle", logic: "clean up unnecessary empty columns", category: "cleaning", output: { action: "delete_empty_columns", reply: "✓ Gereksiz boş sütunlar temizlendi", changes: [] } },
  { user_command: "veri olmayan sütunları kaldır", logic: "remove columns with no data empty", category: "cleaning", output: { action: "delete_empty_columns", reply: "✓ Veri olmayan sütunlar kaldırıldı", changes: [] } },

  // ──────────────────────────────────────────────────────────
  // COUNT_BLANK (+4 yeni örnek — toplam 5)
  // ──────────────────────────────────────────────────────────
  { user_command: "boş hücre sayısını göster", logic: "count number of blank empty cells", category: "calculation", output: { action: "count_blank", reply: "✓ Boş hücre sayısı gösterildi", changes: [] } },
  { user_command: "kaç hücre boş", logic: "how many cells are empty blank", category: "calculation", output: { action: "count_blank", reply: "✓ Boş hücre sayısı hesaplandı", changes: [] } },
  { user_command: "eksik veri sayısı kaç", logic: "count missing data blank cells number", category: "calculation", output: { action: "count_blank", reply: "✓ Eksik veri sayısı hesaplandı", changes: [] } },
  { user_command: "doldurulmamış alan sayısını göster", logic: "show count unfilled empty fields", category: "calculation", output: { action: "count_blank", reply: "✓ Doldurulmamış alan sayısı gösterildi", changes: [] } },

  // ──────────────────────────────────────────────────────────
  // CLEAR_ALL (+3 yeni örnek — toplam 4)
  // ──────────────────────────────────────────────────────────
  { user_command: "her şeyi temizle", logic: "clear all data formatting filters reset everything", category: "cleaning", output: { action: "clear_all", reply: "✓ Her şey temizlendi", changes: [] } },
  { user_command: "tabloyu sıfırla", logic: "reset table clear all content formatting", category: "cleaning", output: { action: "clear_all", reply: "✓ Tablo sıfırlandı", changes: [] } },
  { user_command: "tüm içeriği sil ve baştan başla", logic: "delete all content start fresh clear everything", category: "cleaning", output: { action: "clear_all", reply: "✓ Tüm içerik silindi", changes: [] } },

  // ──────────────────────────────────────────────────────────
  // ADD_ROW (+4 yeni örnek — toplam 5)
  // ──────────────────────────────────────────────────────────
  { user_command: "yeni satır ekle", logic: "add new empty row to spreadsheet", category: "structure", output: { action: "add_row", reply: "✓ Yeni satır eklendi", changes: [] } },
  { user_command: "alta yeni kayıt ekle", logic: "add new record row at bottom", category: "structure", output: { action: "add_row", position: "bottom", reply: "✓ Alta yeni kayıt eklendi", changes: [] } },
  { user_command: "en üste boş satır ekle", logic: "add empty row at top first position", category: "structure", output: { action: "add_row", position: "top", reply: "✓ En üste boş satır eklendi", changes: [] } },
  { user_command: "satır araya ekle", logic: "insert row between existing rows", category: "structure", output: { action: "add_row", position: "insert", reply: "✓ Satır araya eklendi", changes: [] } },

  // ──────────────────────────────────────────────────────────
  // ADD_COLUMN (+4 yeni örnek — toplam 5)
  // ──────────────────────────────────────────────────────────
  { user_command: "yeni sütun ekle", logic: "add new empty column to spreadsheet", category: "structure", output: { action: "add_column", reply: "✓ Yeni sütun eklendi", changes: [] } },
  { user_command: "sağa yeni kolon ekle", logic: "add new column to the right side", category: "structure", output: { action: "add_column", position: "right", reply: "✓ Sağa yeni kolon eklendi", changes: [] } },
  { user_command: "kâr marjı sütunu ekle", logic: "add new profit margin column to sheet", category: "structure", output: { action: "add_column", name: "kâr_marjı", reply: "✓ Kâr marjı sütunu eklendi", changes: [] } },
  { user_command: "toplam sütunu oluştur", logic: "create new total sum column", category: "structure", output: { action: "add_column", name: "toplam", reply: "✓ Toplam sütunu oluşturuldu", changes: [] } },
// clear_all (+6)
{ user_command: "tabloyu komple temizle", logic: "clear all data completely", category: "structure", output: { action: "clear_all", reply: "✓ Tablo tamamen temizlendi", changes: [] } },
{ user_command: "tüm verileri sıfırla", logic: "reset all data in table", category: "structure", output: { action: "clear_all", reply: "✓ Tüm veriler sıfırlandı", changes: [] } },
{ user_command: "sayfayı tamamen temizle", logic: "clear entire sheet", category: "structure", output: { action: "clear_all", reply: "✓ Sayfa tamamen temizlendi", changes: [] } },
{ user_command: "bütün içeriği kaldır", logic: "remove all cell content", category: "structure", output: { action: "clear_all", reply: "✓ Tüm içerik kaldırıldı", changes: [] } },
{ user_command: "tabloyu boşalt", logic: "empty the entire table", category: "structure", output: { action: "clear_all", reply: "✓ Tablo boşaltıldı", changes: [] } },
{ user_command: "her şeyi temizleyip baştan başla", logic: "clear everything and start fresh", category: "structure", output: { action: "clear_all", reply: "✓ Tablo temizlendi, baştan başlayabilirsiniz", changes: [] } },
// count_blank (+5)
{ user_command: "kaç tane boş alan var", logic: "count number of blank cells", category: "calculation", output: { action: "count_blank", reply: "✓ Boş hücre sayısı hesaplandı", changes: [] } },
{ user_command: "eksik kayıt sayısını söyle", logic: "count missing records", category: "calculation", output: { action: "count_blank", reply: "✓ Eksik kayıt sayısı hesaplandı", changes: [] } },
{ user_command: "boş satır sayısı kaç", logic: "count rows with blank cells", category: "calculation", output: { action: "count_blank", reply: "✓ Boş satır sayısı hesaplandı", changes: [] } },
{ user_command: "doldurulmamış hücre sayısı nedir", logic: "count unfilled cells in sheet", category: "calculation", output: { action: "count_blank", reply: "✓ Doldurulmamış hücre sayısı hesaplandı", changes: [] } },
{ user_command: "ad sütununda kaç boşluk var", logic: "count blank cells in name column", category: "calculation", output: { action: "count_blank", column: "ad", reply: "✓ Ad sütunundaki boş hücreler sayıldı", changes: [] } },
// delete_empty_columns (+5)
{ user_command: "hiç veri olmayan sütunları kaldır", logic: "delete columns with no data at all", category: "structure", output: { action: "delete_empty_columns", reply: "✓ Boş sütunlar silindi", changes: [] } },
{ user_command: "dolu olmayan kolonları temizle", logic: "remove columns that are not filled", category: "structure", output: { action: "delete_empty_columns", reply: "✓ Dolu olmayan kolonlar kaldırıldı", changes: [] } },
{ user_command: "sadece başlığı olan sütunları sil", logic: "delete columns that only have a header row", category: "structure", output: { action: "delete_empty_columns", reply: "✓ Sadece başlığı olan sütunlar silindi", changes: [] } },
{ user_command: "içeriksiz kolonları kaldır", logic: "remove columns without any content", category: "structure", output: { action: "delete_empty_columns", reply: "✓ İçeriksiz kolonlar kaldırıldı", changes: [] } },
{ user_command: "boş kolonları temizle", logic: "clean up empty columns", category: "structure", output: { action: "delete_empty_columns", reply: "✓ Boş kolonlar temizlendi", changes: [] } },
// undo (+5)
{ user_command: "son işlemi geri al", logic: "undo the last action", category: "structure", output: { action: "undo", reply: "✓ Son işlem geri alındı", changes: [] } },
{ user_command: "önceki adıma dön", logic: "go back to previous step", category: "structure", output: { action: "undo", reply: "✓ Önceki adıma dönüldü", changes: [] } },
{ user_command: "değişikliği iptal et", logic: "cancel the last change made", category: "structure", output: { action: "undo", reply: "✓ Değişiklik iptal edildi", changes: [] } },
{ user_command: "yaptığım değişikliği geri al", logic: "revert the change I just made", category: "structure", output: { action: "undo", reply: "✓ Değişiklik geri alındı", changes: [] } },
{ user_command: "sil geri dön", logic: "undo delete action", category: "structure", output: { action: "undo", reply: "✓ İşlem geri alındı", changes: [] } },
// add_column (+4)
{ user_command: "sona yeni sütun ekle", logic: "add new column at the end", category: "structure", output: { action: "add_column", position: "end", reply: "✓ Yeni sütun eklendi", changes: [] } },
{ user_command: "vergi sütunu ekle", logic: "add a tax column", category: "structure", output: { action: "add_column", name: "Vergi", position: "end", reply: "✓ Vergi sütunu eklendi", changes: [] } },
{ user_command: "C sütunundan önce yeni kolon ekle", logic: "insert new column before column C", category: "structure", output: { action: "add_column", position: "before_C", reply: "✓ C sütunundan önce yeni kolon eklendi", changes: [] } },
{ user_command: "durum sütunu oluştur", logic: "create a status column", category: "structure", output: { action: "add_column", name: "Durum", position: "end", reply: "✓ Durum sütunu oluşturuldu", changes: [] } },
// add_row (+4)
{ user_command: "en sona yeni satır ekle", logic: "add new row at the bottom", category: "structure", output: { action: "add_row", position: "end", reply: "✓ Sona yeni satır eklendi", changes: [] } },
{ user_command: "başa boş satır ekle", logic: "insert blank row at the top", category: "structure", output: { action: "add_row", position: "top", reply: "✓ Başa boş satır eklendi", changes: [] } },
{ user_command: "5. satırdan önce boş satır ekle", logic: "insert blank row before row 5", category: "structure", output: { action: "add_row", position: 5, reply: "✓ 5. satırdan önce boş satır eklendi", changes: [] } },
{ user_command: "yeni bir veri satırı ekle", logic: "add a new data row", category: "structure", output: { action: "add_row", position: "end", reply: "✓ Yeni veri satırı eklendi", changes: [] } },
// rename_columns (+4)
{ user_command: "A sütununu tarih olarak adlandır", logic: "rename column A to date", category: "structure", output: { action: "rename_columns", mapping: { "A": "Tarih" }, reply: "✓ A sütunu Tarih olarak adlandırıldı", changes: [] } },
{ user_command: "b sütununu tutar olarak değiştir", logic: "rename column B to amount", category: "structure", output: { action: "rename_columns", mapping: { "B": "Tutar" }, reply: "✓ B sütunu Tutar olarak değiştirildi", changes: [] } },
{ user_command: "salary sütununu maaş olarak yeniden adlandır", logic: "rename salary column to Turkish equivalent", category: "structure", output: { action: "rename_columns", mapping: { "salary": "Maaş" }, reply: "✓ Salary sütunu Maaş olarak yeniden adlandırıldı", changes: [] } },
{ user_command: "name sütununu ad soyad olarak değiştir", logic: "rename name column to full name in Turkish", category: "structure", output: { action: "rename_columns", mapping: { "name": "Ad Soyad" }, reply: "✓ Name sütunu Ad Soyad olarak değiştirildi", changes: [] } },
// find_replace (+4)
{ user_command: "0 değerlerini boş bırak", logic: "replace zero values with empty string", category: "cleaning", output: { action: "find_replace", find: "0", replace: "", reply: "✓ 0 değerleri boş bırakıldı", changes: [] } },
{ user_command: "erkek yazan yerleri E yap", logic: "replace erkek with E abbreviation", category: "cleaning", output: { action: "find_replace", find: "Erkek", replace: "E", reply: "✓ Erkek değerleri E olarak güncellendi", changes: [] } },
{ user_command: "tüm TR ifadelerini Türkiye ile değiştir", logic: "replace TR abbreviation with full country name", category: "cleaning", output: { action: "find_replace", find: "TR", replace: "Türkiye", reply: "✓ TR ifadeleri Türkiye ile değiştirildi", changes: [] } },
{ user_command: "ondalık noktaları virgüle çevir", logic: "replace decimal points with commas for Turkish format", category: "cleaning", output: { action: "find_replace", find: ".", replace: ",", reply: "✓ Ondalık noktalar virgüle çevrildi", changes: [] } },
// min (+3)
{ user_command: "en küçük satış miktarı kaç", logic: "find minimum sales amount", category: "calculation", output: { action: "min", column: "satış", reply: "✓ En küçük satış miktarı hesaplandı", changes: [] } },
{ user_command: "en düşük not hangisi", logic: "find minimum grade value", category: "calculation", output: { action: "min", column: "not", reply: "✓ En düşük not bulundu", changes: [] } },
{ user_command: "minimum sipariş tutarı nedir", logic: "find minimum order amount", category: "calculation", output: { action: "min", column: "tutar", reply: "✓ Minimum sipariş tutarı hesaplandı", changes: [] } },
// count_if (+3)
{ user_command: "kaç müşteri ankara'da", logic: "count customers located in Ankara", category: "calculation", output: { action: "count_if", column: "şehir", condition: "==", value: "Ankara", reply: "✓ Ankara'daki müşteri sayısı hesaplandı", changes: [] } },
{ user_command: "50 altında kaç kayıt var", logic: "count records where value is below 50", category: "calculation", output: { action: "count_if", condition: "<", value: 50, reply: "✓ 50 altındaki kayıt sayısı hesaplandı", changes: [] } },
{ user_command: "tamamlanmış sipariş sayısı kaç", logic: "count orders with status completed", category: "calculation", output: { action: "count_if", column: "durum", condition: "==", value: "Tamamlandı", reply: "✓ Tamamlanmış sipariş sayısı hesaplandı", changes: [] } },
// max (+3)
{ user_command: "en yüksek not kaç", logic: "find maximum grade value", category: "calculation", output: { action: "max", column: "not", reply: "✓ En yüksek not bulundu", changes: [] } },
{ user_command: "en büyük sipariş tutarı nedir", logic: "find maximum order amount", category: "calculation", output: { action: "max", column: "tutar", reply: "✓ En büyük sipariş tutarı hesaplandı", changes: [] } },
{ user_command: "hangi ürünün fiyatı en yüksek", logic: "find product with highest price", category: "calculation", output: { action: "max", column: "fiyat", reply: "✓ En yüksek fiyatlı ürün bulundu", changes: [] } },
// clear_colors (+3)
{ user_command: "tüm hücre boyalarını temizle", logic: "clear all cell background colors", category: "highlighting", output: { action: "clear_colors", reply: "✓ Tüm hücre boyaları temizlendi", changes: [] } },
{ user_command: "vurgulamaları kaldır", logic: "remove all highlights from cells", category: "highlighting", output: { action: "clear_colors", reply: "✓ Vurgulamalar kaldırıldı", changes: [] } },
{ user_command: "renk formatlamalarını sıfırla", logic: "reset all color formatting", category: "highlighting", output: { action: "clear_colors", reply: "✓ Renk formatlamaları sıfırlandı", changes: [] } },
// delete_column (+3)
{ user_command: "id sütununu kaldır", logic: "delete the ID column", category: "structure", output: { action: "delete_column", column: "id", reply: "✓ ID sütunu kaldırıldı", changes: [] } },
{ user_command: "son sütunu sil", logic: "delete the last column", category: "structure", output: { action: "delete_column", column: "last", reply: "✓ Son sütun silindi", changes: [] } },
{ user_command: "puan kolonunu kaldır", logic: "remove the score column", category: "structure", output: { action: "delete_column", column: "puan", reply: "✓ Puan kolonu kaldırıldı", changes: [] } }
,
{ user_command: "toplam kaç veri var", logic: "count total number of records in dataset", category: "calculation", output: { action: "count", reply: "✓ Toplam veri sayısı hesaplandı", changes: [] } },
  { user_command: "kaç tane müşteri kaydı var", logic: "count number of customer records", category: "calculation", output: { action: "count", reply: "✓ Müşteri kayıt sayısı hesaplandı", changes: [] } },
  { user_command: "veri sayısını göster", logic: "show count of data entries", category: "calculation", output: { action: "count", reply: "✓ Veri sayısı gösterildi", changes: [] } },
  { user_command: "filtreyi temizle", logic: "clear remove active filter", category: "filtering", output: { action: "remove_filter", reply: "✓ Filtre temizlendi", changes: [] } },
  { user_command: "filtrelemeyi iptal et", logic: "cancel undo filter", category: "filtering", output: { action: "remove_filter", reply: "✓ Filtreleme iptal edildi", changes: [] } },
  { user_command: "bütün satırları göster", logic: "show all rows remove filter", category: "filtering", output: { action: "remove_filter", reply: "✓ Tüm satırlar gösterildi", changes: [] } }
,
// --- GRUP 1: Muhasebe / Türk Vergi Sistemi (25 örnek) ---
  { user_command: "tevkifatlı kdv tutarını hesapla", logic: "calculate withholding VAT deduction tevkifat 2/10 rate Turkey KDV stopaj", category: "accounting", output: { action: "update_cells", formula: "tevkifat_kdv", factor: 0.18, reply: "✓ Tevkifatlı KDV hesaplandı", changes: [] } },
  { user_command: "stopaj vergisi kesintilerini listele", logic: "list withholding tax deductions muhtasar Turkey stopaj", category: "accounting", output: { action: "filter", condition: "contains", value: "stopaj", reply: "✓ Stopaj kesintileri listelendi", changes: [] } },
  { user_command: "250 bin üzeri alımları göster", logic: "filter purchases over 250000 TL BA BS form Turkey threshold", category: "accounting", output: { action: "filter", condition: "value > 250000", reply: "✓ 250.000 TL üzeri alımlar filtrelendi", changes: [] } },
  { user_command: "özel tüketim vergisi ekle", logic: "add special consumption tax ÖTV Turkey", category: "accounting", output: { action: "update_cells", formula: "otv", reply: "✓ Özel tüketim vergisi eklendi", changes: [] } },
  { user_command: "banka sigorta muameleleri vergisi hesapla", logic: "calculate banking insurance transactions tax BSMV Turkey 5 percent", category: "accounting", output: { action: "update_cells", formula: "bsmv", factor: 0.05, reply: "✓ BSMV hesaplandı", changes: [] } },
  { user_command: "yeniden değerleme katsayısı uygula", logic: "apply revaluation coefficient yeniden değerleme Turkey inflation adjustment fixed assets", category: "accounting", output: { action: "update_cells", formula: "revaluation", reply: "✓ Yeniden değerleme katsayısı uygulandı", changes: [] } },
  { user_command: "çeyrek dönem geçici vergi hesapla", logic: "calculate quarterly provisional tax gecici vergi Turkey", category: "accounting", output: { action: "update_cells", formula: "gecici_vergi", rate: 0.20, reply: "✓ Geçici vergi hesaplandı", changes: [] } },
  { user_command: "iade alınacak kdv tutarını hesapla", logic: "calculate VAT refund amount to be received Turkey kdv iadesi", category: "accounting", output: { action: "sum", column: "kdv_iadesi", reply: "✓ İade alınacak KDV tutarı hesaplandı", changes: [] } },
  { user_command: "gecikme zammı hesapla", logic: "calculate late payment surcharge gecikme zammi Turkey tax penalty", category: "accounting", output: { action: "update_cells", formula: "gecikme_zammi", reply: "✓ Gecikme zammı hesaplandı", changes: [] } },
  { user_command: "kurumlar vergisi matrahı hesapla", logic: "calculate corporate tax base kurumlar vergisi matrah Turkey 20 percent", category: "accounting", output: { action: "update_cells", formula: "kurumlar_vergisi", rate: 0.20, reply: "✓ Kurumlar vergisi matrahı hesaplandı", changes: [] } },
  { user_command: "gıda ürünlerine yüzde 1 kdv uygula", logic: "apply reduced VAT 1 percent food products Turkey indirimli kdv", category: "accounting", output: { action: "update_cells", formula: "multiply", factor: 1.01, reply: "✓ %1 KDV uygulandı", changes: [] } },
  { user_command: "sağlık hizmetlerine yüzde 8 kdv uygula", logic: "apply 8 percent VAT health services indirimli kdv Turkey", category: "accounting", output: { action: "update_cells", formula: "multiply", factor: 1.08, reply: "✓ %8 KDV uygulandı", changes: [] } },
  { user_command: "cari hesap bakiyelerini hesapla", logic: "calculate current account balances cari hesap Turkey", category: "accounting", output: { action: "sum", column: "bakiye", reply: "✓ Cari hesap bakiyeleri hesaplandı", changes: [] } },
  { user_command: "borç alacak farkını bul", logic: "find difference between debit and credit borc alacak Turkey accounting", category: "accounting", output: { action: "update_cells", formula: "borc_alacak_fark", reply: "✓ Borç-alacak farkı hesaplandı", changes: [] } },
  { user_command: "tahakkuk eden faizi hesapla", logic: "calculate accrued interest tahakkuk Turkey", category: "accounting", output: { action: "update_cells", formula: "tahakkuk_faiz", reply: "✓ Tahakkuk eden faiz hesaplandı", changes: [] } },
  { user_command: "kasa sayım fazlasını bul", logic: "find cash count surplus kasa sayim fazlasi Turkey", category: "accounting", output: { action: "filter", condition: "value > 0", column: "kasa_fark", reply: "✓ Kasa sayım fazlaları listelendi", changes: [] } },
  { user_command: "muhtasar beyan için stopajları topla", logic: "sum withholding taxes for muhtasar declaration Turkey", category: "accounting", output: { action: "sum", column: "stopaj", reply: "✓ Muhtasar stopaj toplamı hesaplandı", changes: [] } },
  { user_command: "vadesi geçmiş tahsilatları göster", logic: "show overdue collections past due date Turkey", category: "accounting", output: { action: "filter", condition: "past_due", reply: "✓ Vadesi geçmiş tahsilatlar filtrelendi", changes: [] } },
  { user_command: "dönem net karını hesapla", logic: "calculate period net profit dönem net kari Turkey", category: "accounting", output: { action: "update_cells", formula: "net_profit", reply: "✓ Dönem net kârı hesaplandı", changes: [] } },
  { user_command: "amortisman payını hesapla", logic: "calculate depreciation amount amortisman Turkey fixed assets", category: "accounting", output: { action: "update_cells", formula: "amortisman", reply: "✓ Amortisman payı hesaplandı", changes: [] } },
  { user_command: "şüpheli alacak karşılığı ayır", logic: "set aside doubtful receivables provision supheli alacak Turkey", category: "accounting", output: { action: "update_cells", formula: "supheli_alacak", rate: 0.20, reply: "✓ Şüpheli alacak karşılığı ayrıldı", changes: [] } },
  { user_command: "reeskont faizini hesapla", logic: "calculate rediscount interest reeskont Turkey TCMB rate", category: "accounting", output: { action: "update_cells", formula: "reeskont_faiz", reply: "✓ Reeskont faizi hesaplandı", changes: [] } },
  { user_command: "sayım noksanlarını listele", logic: "list inventory shortage sayim noksani Turkey", category: "accounting", output: { action: "filter", condition: "value < 0", column: "envanter_fark", reply: "✓ Sayım noksanları listelendi", changes: [] } },
  { user_command: "kdv beyanname toplamını hesapla", logic: "calculate VAT tax return total KDV beyanname Turkey", category: "accounting", output: { action: "sum", column: "kdv_tutari", reply: "✓ KDV beyanname toplamı hesaplandı", changes: [] } },
  { user_command: "stopaj oranını uygula", logic: "apply withholding tax stopaj rate Turkey", category: "accounting", output: { action: "update_cells", formula: "stopaj", rate: 0.20, reply: "✓ Stopaj oranı uygulandı", changes: [] } },

  // --- GRUP 2: İK / Bordro Edge Case'leri (25 örnek) ---
  { user_command: "fazla mesai ücretini hesapla", logic: "calculate overtime pay 1.5x rate fazla mesai Turkey labor law", category: "hr", output: { action: "update_cells", formula: "fazla_mesai", factor: 1.5, reply: "✓ Fazla mesai ücreti hesaplandı", changes: [] } },
  { user_command: "gece vardiyası zammı ekle", logic: "add night shift premium 25 percent gece zammi Turkey", category: "hr", output: { action: "update_cells", formula: "gece_zammi", factor: 1.25, reply: "✓ Gece vardiyası zammı eklendi", changes: [] } },
  { user_command: "hafta tatili çalışma ücretini hesapla", logic: "calculate weekend work pay 2x rate hafta tatili Turkey", category: "hr", output: { action: "update_cells", formula: "hafta_tatili", factor: 2.0, reply: "✓ Hafta tatili çalışma ücreti hesaplandı", changes: [] } },
  { user_command: "ulusal bayram çalışması tazminatını ekle", logic: "add national holiday work compensation Turkey ulusal bayram resmi tatil", category: "hr", output: { action: "update_cells", formula: "bayram_tazminat", factor: 2.0, reply: "✓ Ulusal bayram tazminatı eklendi", changes: [] } },
  { user_command: "ücretsiz izin günlerini maaştan düş", logic: "deduct unpaid leave days from salary ucretsiz izin Turkey", category: "hr", output: { action: "update_cells", formula: "ucretsiz_izin_kesinti", reply: "✓ Ücretsiz izin kesintisi yapıldı", changes: [] } },
  { user_command: "maaş haczini hesapla", logic: "calculate wage garnishment 1/4 limit ucret haczi Turkey", category: "hr", output: { action: "update_cells", formula: "maas_haciz", factor: 0.25, reply: "✓ Maaş haczi hesaplandı", changes: [] } },
  { user_command: "ihbar süresi ücretini hesapla", logic: "calculate notice period pay ihbar suresi Turkey labor law", category: "hr", output: { action: "update_cells", formula: "ihbar_ucret", reply: "✓ İhbar süresi ücreti hesaplandı", changes: [] } },
  { user_command: "5 yılı dolduranları işaretle", logic: "highlight employees completing 5 years kidem yili Turkey seniority", category: "hr", output: { action: "highlight", condition: "kidem_yil >= 5", color: "#bbf7d0", reply: "✓ 5 yıl kıdemi dolduranlar işaretlendi", changes: [] } },
  { user_command: "part-time çalışan maaşını hesapla", logic: "calculate part-time employee salary kismi sureli Turkey", category: "hr", output: { action: "update_cells", formula: "parttime_maas", reply: "✓ Part-time maaş hesaplandı", changes: [] } },
  { user_command: "yıllık izin ücretini hesapla", logic: "calculate annual leave pay yillik izin ucret Turkey", category: "hr", output: { action: "update_cells", formula: "yillik_izin_ucret", reply: "✓ Yıllık izin ücreti hesaplandı", changes: [] } },
  { user_command: "asgari ücret altında kalanları bul", logic: "find employees below minimum wage asgari ucret Turkey", category: "hr", output: { action: "filter", condition: "below_min_wage", reply: "✓ Asgari ücret altındakiler filtrelendi", changes: [] } },
  { user_command: "satış hedefi tutturanların primini hesapla", logic: "calculate sales commission bonus for target achievers Turkey", category: "hr", output: { action: "update_cells", formula: "satis_prim", reply: "✓ Satış primleri hesaplandı", changes: [] } },
  { user_command: "brüt maaştan net maaşa çevir", logic: "convert gross salary to net salary brut net Turkey SGK", category: "hr", output: { action: "update_cells", formula: "brut_net", reply: "✓ Brütten nete dönüştürüldü", changes: [] } },
  { user_command: "agi dahil net maaşı hesapla", logic: "calculate net salary including minimum living allowance AGI asgari gecim indirimi Turkey", category: "hr", output: { action: "update_cells", formula: "net_maas_agi", reply: "✓ AGİ dahil net maaş hesaplandı", changes: [] } },
  { user_command: "toplam işveren maliyetini hesapla", logic: "calculate total employer cost isveren maliyeti SGK Turkey", category: "hr", output: { action: "sum", column: "isveren_maliyet", reply: "✓ Toplam işveren maliyeti hesaplandı", changes: [] } },
  { user_command: "iş kazası tazminatını hesapla", logic: "calculate work accident compensation is kazasi Turkey SGK", category: "hr", output: { action: "update_cells", formula: "is_kazasi_tazminat", reply: "✓ İş kazası tazminatı hesaplandı", changes: [] } },
  { user_command: "kıdem tazminatı tavanını uygula", logic: "apply severance pay ceiling limit kidem tazminati tavan Turkey", category: "hr", output: { action: "update_cells", formula: "kidem_tavan", reply: "✓ Kıdem tazminatı tavanı uygulandı", changes: [] } },
  { user_command: "doğum izni ücretini hesapla", logic: "calculate maternity leave pay dogum izni Turkey SGK", category: "hr", output: { action: "update_cells", formula: "dogum_izni_ucret", reply: "✓ Doğum izni ücreti hesaplandı", changes: [] } },
  { user_command: "hastalık raporu günlerini maaştan düş", logic: "deduct sick leave days salary hastalik raporu Turkey", category: "hr", output: { action: "update_cells", formula: "rapor_kesinti", reply: "✓ Rapor günleri maaştan düşüldü", changes: [] } },
  { user_command: "yemek yardımını maaşa ekle", logic: "add meal allowance to salary yemek yardimi Turkey", category: "hr", output: { action: "update_cells", formula: "yemek_yardim", reply: "✓ Yemek yardımı eklendi", changes: [] } },
  { user_command: "ulaşım yardımını hesaba kat", logic: "include transportation allowance ulasim yardimi Turkey", category: "hr", output: { action: "update_cells", formula: "ulasim_yardim", reply: "✓ Ulaşım yardımı eklendi", changes: [] } },
  { user_command: "6 aylık ikramiyeyi hesapla", logic: "calculate 6-month bonus ikramiye Turkey", category: "hr", output: { action: "update_cells", formula: "ikramiye", months: 6, reply: "✓ 6 aylık ikramiye hesaplandı", changes: [] } },
  { user_command: "en yüksek performans primine göre sırala", logic: "sort by highest performance bonus prim descending", category: "hr", output: { action: "sort", column: "prim", direction: "desc", reply: "✓ Performans primine göre sıralandı", changes: [] } },
  { user_command: "işten çıkarma tazminatı matrahını hesapla", logic: "calculate termination compensation base Turkey isten cikma tazminat", category: "hr", output: { action: "update_cells", formula: "isten_cikma_tazminat", reply: "✓ İşten çıkarma tazminatı matrahı hesaplandı", changes: [] } },
  { user_command: "deneme süresindeki çalışanları işaretle", logic: "highlight probationary period employees deneme suresi Turkey", category: "hr", output: { action: "highlight", condition: "deneme_suresi", color: "#fef08a", reply: "✓ Deneme süresindekiler işaretlendi", changes: [] } },

  // --- GRUP 3: Filtre Edge Case'leri — Çok Koşullu / Karmaşık (20 örnek) ---
  { user_command: "100 ile 500 arasındaki siparişleri göster", logic: "filter orders between 100 and 500 between condition range", category: "filtering", output: { action: "filter", condition: "between", min: 100, max: 500, reply: "✓ 100-500 arası siparişler filtrelendi", changes: [] } },
  { user_command: "aktif ve istanbul olanları göster", logic: "filter active AND istanbul rows multi-condition AND compound", category: "filtering", output: { action: "filter", condition: "AND", conditions: [{"field": "durum", "value": "aktif"}, {"field": "sehir", "value": "istanbul"}], reply: "✓ Aktif İstanbul kayıtları filtrelendi", changes: [] } },
  { user_command: "ankara veya izmir müşterilerini göster", logic: "filter ankara OR izmir customers multi-condition OR", category: "filtering", output: { action: "filter", condition: "OR", conditions: [{"value": "ankara"}, {"value": "izmir"}], reply: "✓ Ankara veya İzmir müşterileri filtrelendi", changes: [] } },
  { user_command: "istanbul dışındakileri göster", logic: "filter NOT istanbul exclude not_contains rows", category: "filtering", output: { action: "filter", condition: "not_contains", value: "istanbul", reply: "✓ İstanbul dışındakiler filtrelendi", changes: [] } },
  { user_command: "ocak ile mart arası satışları filtrele", logic: "filter sales between January and March date range date_between", category: "filtering", output: { action: "filter", condition: "date_between", start: "01-01", end: "03-31", reply: "✓ Ocak-Mart arası satışlar filtrelendi", changes: [] } },
  { user_command: "son 30 günün siparişlerini göster", logic: "show orders from last 30 days last_n_days recent", category: "filtering", output: { action: "filter", condition: "last_n_days", days: 30, reply: "✓ Son 30 günün siparişleri filtrelendi", changes: [] } },
  { user_command: "A ile başlayan müşterileri göster", logic: "filter customers starting with letter A starts_with", category: "filtering", output: { action: "filter", condition: "starts_with", value: "A", reply: "✓ A ile başlayan müşteriler filtrelendi", changes: [] } },
  { user_command: "ltd ile biten şirketleri bul", logic: "find companies ending with ltd ends_with suffix", category: "filtering", output: { action: "filter", condition: "ends_with", value: "ltd", reply: "✓ LTD ile biten şirketler filtrelendi", changes: [] } },
  { user_command: "telefon numarası girilmiş olanları göster", logic: "show rows with phone number filled not_empty column", category: "filtering", output: { action: "filter", condition: "not_empty", column: "telefon", reply: "✓ Telefon numarası girilmiş kayıtlar filtrelendi", changes: [] } },
  { user_command: "tekrarlayan müşteri kodlarını göster", logic: "show duplicate customer codes duplicate_values", category: "filtering", output: { action: "filter", condition: "duplicate_values", column: "musteri_kodu", reply: "✓ Tekrarlayan müşteri kodları filtrelendi", changes: [] } },
  { user_command: "en son eklenen 10 kaydı göster", logic: "show last 10 added records last_n_rows recent", category: "filtering", output: { action: "filter", condition: "last_n_rows", count: 10, reply: "✓ Son 10 kayıt gösterildi", changes: [] } },
  { user_command: "bu ay 1000 üzeri faturaları göster", logic: "show current month invoices over 1000 compound date value filter", category: "filtering", output: { action: "filter", condition: "compound", filters: [{"type": "currentMonth"}, {"type": "value > 1000"}], reply: "✓ Bu ayki 1000 TL üzeri faturalar filtrelendi", changes: [] } },
  { user_command: "hedefin yüzde sekseni altında olanları göster", logic: "filter below 80 percent of target threshold percentage written words", category: "filtering", output: { action: "filter", condition: "below_target_percent", percent: 80, reply: "✓ Hedefin %80 altındakiler filtrelendi", changes: [] } },
  { user_command: "bu haftaki siparişleri göster", logic: "show orders from this week current week filter", category: "filtering", output: { action: "filter", condition: "this_week", reply: "✓ Bu haftaki siparişler filtrelendi", changes: [] } },
  { user_command: "sabah 9 ile 17 arası kayıtları göster", logic: "show records between 9am and 5pm time range filter saat", category: "filtering", output: { action: "filter", condition: "time_between", start: "09:00", end: "17:00", reply: "✓ 09:00-17:00 arası kayıtlar filtrelendi", changes: [] } },
  { user_command: "faturası kesilmemiş siparişleri bul", logic: "find uninvoiced orders not yet billed not contains", category: "filtering", output: { action: "filter", condition: "not_contains", value: "faturalı", reply: "✓ Faturası kesilmemiş siparişler filtrelendi", changes: [] } },
  { user_command: "son 3 ayda kazanılan müşterileri göster", logic: "show new customers acquired in last 3 months 90 days", category: "filtering", output: { action: "filter", condition: "last_n_days", days: 90, reply: "✓ Son 3 ayın yeni müşterileri filtrelendi", changes: [] } },
  { user_command: "stoku sıfır veya eksik olan ürünleri göster", logic: "filter products with zero or negative stock OR condition", category: "filtering", output: { action: "filter", condition: "OR", conditions: [{"type": "value == 0"}, {"type": "value < 0"}], column: "stok", reply: "✓ Stok sıfır veya eksik ürünler filtrelendi", changes: [] } },
  { user_command: "2024 yılındaki faturaları göster", logic: "show invoices from year 2024 date range filter annual", category: "filtering", output: { action: "filter", condition: "date_between", start: "2024-01-01", end: "2024-12-31", reply: "✓ 2024 yılı faturaları filtrelendi", changes: [] } },
  { user_command: "değer girilmemiş satırları bul", logic: "find rows with empty values not entered is_empty null", category: "filtering", output: { action: "filter", condition: "is_empty", reply: "✓ Değer girilmemiş satırlar filtrelendi", changes: [] } },

  // --- GRUP 4: Dilbilimsel Çeşitlilik (20 örnek) ---
  { user_command: "hangi ürünlerin stoğu bitti?", logic: "question form which products are out of stock soru kipi", category: "filtering", output: { action: "filter", condition: "value == 0", column: "stok", reply: "✓ Stoğu biten ürünler filtrelendi", changes: [] } },
  { user_command: "sıfır olanlar filtrelensin", logic: "passive voice filter zero values edilgen kip Turkish grammar", category: "filtering", output: { action: "filter", condition: "value == 0", reply: "✓ Sıfır değerler filtrelendi", changes: [] } },
  { user_command: "fyt'a göre sırala", logic: "sort by price abbreviation fiyat fyt Turkish informal short", category: "sorting", output: { action: "sort", column: "fiyat", direction: "asc", reply: "✓ Fiyata göre sıralandı", changes: [] } },
  { user_command: "lütfen tarihe göre sırala", logic: "sort by date polite form please Turkish lütfen", category: "sorting", output: { action: "sort", column: "tarih", direction: "asc", reply: "✓ Tarihe göre sıralandı", changes: [] } },
  { user_command: "acaba kaç tane boş hücre var", logic: "how many empty cells wondering form acaba count blank Turkish", category: "calculation", output: { action: "count_blank", reply: "✓ Boş hücre sayısı hesaplandı", changes: [] } },
  { user_command: "sort by tarih", logic: "sort by date mixed English Turkish sort tarih code-switching", category: "sorting", output: { action: "sort", column: "tarih", direction: "asc", reply: "✓ Tarihe göre sıralandı", changes: [] } },
  { user_command: "filter aktif olanlar", logic: "filter active records mixed English Turkish code-switching", category: "filtering", output: { action: "filter", condition: "contains", value: "aktif", reply: "✓ Aktif kayıtlar filtrelendi", changes: [] } },
  { user_command: "lütfen maaş sütunundaki tüm değerlerin ortalamasını alıp bana gösterir misin", logic: "calculate average salary very long polite sentence formal request", category: "calculation", output: { action: "average", column: "maaş", reply: "✓ Maaş ortalaması hesaplandı", changes: [] } },
  { user_command: "sırala", logic: "short ambiguous sort command single word minimal", category: "sorting", output: { action: "sort", direction: "asc", reply: "✓ Veriler sıralandı", changes: [] } },
  { user_command: "🔴 negatifleri işaretle", logic: "highlight negatives emoji red circle informal visual", category: "highlighting", output: { action: "highlight", condition: "value < 0", color: "#fecaca", reply: "✓ Negatif değerler işaretlendi", changes: [] } },
  { user_command: "tarihe göre sıraliyor musun", logic: "sort by date typo informal question yazım hatası Turkish", category: "sorting", output: { action: "sort", column: "tarih", direction: "asc", reply: "✓ Tarihe göre sıralandı", changes: [] } },
  { user_command: "(istanbul) veya (ankara) müşteriler", logic: "filter istanbul or ankara customers parentheses format", category: "filtering", output: { action: "filter", condition: "OR", conditions: [{"value": "istanbul"}, {"value": "ankara"}], reply: "✓ İstanbul veya Ankara müşterileri filtrelendi", changes: [] } },
  { user_command: "peki en büyük değer nerede?", logic: "find maximum value question form peki ne informal Turkish", category: "calculation", output: { action: "max", reply: "✓ En büyük değer bulundu", changes: [] } },
  { user_command: "stoku biten ürünleri listeliyorum", logic: "list out of stock products first person continuous haber kipi", category: "filtering", output: { action: "filter", condition: "value == 0", column: "stok", reply: "✓ Stoğu biten ürünler listelendi", changes: [] } },
  { user_command: "şu an en yüksek maaş alan kim", logic: "find who has maximum salary current tense informal question", category: "calculation", output: { action: "max", column: "maaş", reply: "✓ En yüksek maaş bulundu", changes: [] } },
  { user_command: "highlight negatif values kırmızı", logic: "highlight negative values red mixed Turkish English code-switching", category: "highlighting", output: { action: "highlight", condition: "value < 0", color: "#fecaca", reply: "✓ Negatif değerler kırmızıya boyandı", changes: [] } },
  { user_command: "on ile yirmi arasındaki değerler", logic: "filter between 10 and 20 numbers written as words Turkish sayısal yazı", category: "filtering", output: { action: "filter", condition: "between", min: 10, max: 20, reply: "✓ 10-20 arası değerler filtrelendi", changes: [] } },
  { user_command: "hmm en çok satanı bulsam iyi olur", logic: "find best seller thinking aloud informal hmm yüksek sesle düşünme", category: "sorting", output: { action: "sort", column: "satış", direction: "desc", reply: "✓ En çok satanlar sıralandı", changes: [] } },
  { user_command: "tarihe göre sıralayabilir misin", logic: "sort by date polite request can you form Turkish", category: "sorting", output: { action: "sort", column: "tarih", direction: "asc", reply: "✓ Tarihe göre sıralandı", changes: [] } },
  { user_command: "satışların ortalaması ne kadar", logic: "calculate average of sales informal question çoğul Turkish", category: "calculation", output: { action: "average", column: "satış", reply: "✓ Satış ortalaması hesaplandı", changes: [] } },

  // --- GRUP 5: Excel Formülleri — Türkçe Fonksiyon Adları (10 örnek) ---
  { user_command: "EĞER formülü yaz", logic: "write IF conditional formula EGER Turkish Excel function name", category: "formula", output: { action: "generate_formula", formula_type: "if", reply: "✓ EĞER (IF) formülü oluşturuldu", changes: [] } },
  { user_command: "DÜŞEYARA formülü oluştur", logic: "create VLOOKUP DÜŞEYARA Turkish Excel lookup function name", category: "formula", output: { action: "generate_formula", formula_type: "vlookup", reply: "✓ DÜŞEYARA (VLOOKUP) formülü oluşturuldu", changes: [] } },
  { user_command: "ETOPLA formülü yaz", logic: "write SUMIF conditional sum ETOPLA Turkish Excel function name", category: "formula", output: { action: "generate_formula", formula_type: "sumif", reply: "✓ ETOPLA (SUMIF) formülü oluşturuldu", changes: [] } },
  { user_command: "EĞERSAY formülü oluştur", logic: "create COUNTIF conditional count EĞERSAY Turkish Excel function name", category: "formula", output: { action: "generate_formula", formula_type: "countif", reply: "✓ EĞERSAY (COUNTIF) formülü oluşturuldu", changes: [] } },
  { user_command: "ORTALAMAEĞER formülü yaz", logic: "write AVERAGEIF conditional average ORTALAMAEĞER Turkish Excel function name", category: "formula", output: { action: "generate_formula", formula_type: "averageif", reply: "✓ ORTALAMAEĞER (AVERAGEIF) formülü oluşturuldu", changes: [] } },
  { user_command: "ÇOKEĞER formülü yaz", logic: "write IFS multiple conditions ÇOKEĞER Turkish Excel function name", category: "formula", output: { action: "generate_formula", formula_type: "ifs", reply: "✓ ÇOKEĞER (IFS) formülü oluşturuldu", changes: [] } },
  { user_command: "EĞERHATA ile hata yakalamak istiyorum", logic: "catch errors with IFERROR EĞERHATA Turkish Excel function name", category: "formula", output: { action: "generate_formula", formula_type: "iferror", reply: "✓ EĞERHATA (IFERROR) formülü oluşturuldu", changes: [] } },
  { user_command: "İNDİS KAÇINCI kombinasyonu oluştur", logic: "create INDEX MATCH combination İNDİS KAÇINCI Turkish Excel lookup", category: "formula", output: { action: "generate_formula", formula_type: "index_match", reply: "✓ İNDİS-KAÇINCI formülü oluşturuldu", changes: [] } },
  { user_command: "tarih farkını gün olarak hesapla", logic: "calculate date difference in days DATEDIF formula Turkish", category: "formula", output: { action: "generate_formula", formula_type: "datedif", reply: "✓ Tarih farkı formülü oluşturuldu", changes: [] } },
  { user_command: "kümülatif toplam formülü yaz", logic: "write running total cumulative sum formula kümülatif Turkish", category: "formula", output: { action: "generate_formula", formula_type: "running_total", reply: "✓ Kümülatif toplam formülü oluşturuldu", changes: [] } },

  // --- GRUP 6: AI Kategorileri v9.0 (+58 örnek) ---

  // extract (+10)
  { user_command: "telefon numaralarını çıkar", logic: "extract phone numbers from text column", category: "extract", output: { action: "extract", type: "phone", reply: "✓ Telefon numaraları çıkarıldı", changes: [] } },
  { user_command: "tarih bilgilerini metinden al", logic: "extract date values from text cells", category: "extract", output: { action: "extract", type: "date", reply: "✓ Tarih bilgileri alındı", changes: [] } },
  { user_command: "fiyatları metinden çıkar", logic: "extract price amounts from text strings", category: "extract", output: { action: "extract", type: "price", reply: "✓ Fiyatlar metinden çıkarıldı", changes: [] } },
  { user_command: "posta kodlarını bul", logic: "extract postal zip codes from address text", category: "extract", output: { action: "extract", type: "postal_code", reply: "✓ Posta kodları bulundu", changes: [] } },
  { user_command: "sözleşme numaralarını çıkar", logic: "extract contract reference numbers from text", category: "extract", output: { action: "extract", type: "contract_number", reply: "✓ Sözleşme numaraları çıkarıldı", changes: [] } },
  { user_command: "banka hesap numaralarını al", logic: "extract bank account numbers from text column", category: "extract", output: { action: "extract", type: "account_number", reply: "✓ Hesap numaraları alındı", changes: [] } },
  { user_command: "web adreslerini çıkar", logic: "extract URLs web addresses from text", category: "extract", output: { action: "extract", type: "url", reply: "✓ Web adresleri çıkarıldı", changes: [] } },
  { user_command: "parantez içindeki bilgileri al", logic: "extract text inside parentheses brackets", category: "extract", output: { action: "extract", type: "parenthesis", reply: "✓ Parantez içi bilgiler alındı", changes: [] } },
  { user_command: "ürün kodu ile ürün adını birbirinden ayır", logic: "split product code and product name into separate columns", category: "extract", output: { action: "extract", type: "code_name_split", reply: "✓ Ürün kodu ve adı ayrıldı", changes: [] } },
  { user_command: "kategori kodunu metinden çıkar", logic: "extract category code prefix from text string", category: "extract", output: { action: "extract", type: "category_code", reply: "✓ Kategori kodu çıkarıldı", changes: [] } },

  // anomaly_detection (+10)
  { user_command: "olağandışı giderleri işaretle", logic: "flag unusual expense anomaly outlier detection", category: "anomaly_detection", output: { action: "anomaly_detection", column: "gider", reply: "📊 Olağandışı giderler işaretlendi", changes: [] } },
  { user_command: "maaş aykırı değerlerini tespit et", logic: "detect salary outlier anomaly payroll unusual", category: "anomaly_detection", output: { action: "anomaly_detection", column: "maaş", reply: "📊 Maaş aykırı değerleri tespit edildi", changes: [] } },
  { user_command: "ani artış gösteren kalemleri bul", logic: "detect sudden spike increase anomaly data", category: "anomaly_detection", output: { action: "anomaly_detection", type: "spike", reply: "📊 Ani artış gösteren kalemler bulundu", changes: [] } },
  { user_command: "stok negatif olan ürünleri işaretle", logic: "find negative stock inventory anomaly flag", category: "anomaly_detection", output: { action: "anomaly_detection", column: "stok", reply: "📊 Negatif stok kalemleri işaretlendi", changes: [] } },
  { user_command: "bütçe aşımlarını tespit et", logic: "detect budget overrun exceed anomaly flag", category: "anomaly_detection", output: { action: "anomaly_detection", column: "bütçe", reply: "📊 Bütçe aşımları tespit edildi", changes: [] } },
  { user_command: "normalin üç katından fazla değerleri bul", logic: "find values exceeding 3x threshold anomaly detection", category: "anomaly_detection", output: { action: "anomaly_detection", threshold: 3, reply: "📊 Eşik aşan değerler bulundu", changes: [] } },
  { user_command: "tekrarlayan şüpheli işlemleri tespit et", logic: "detect repeated suspicious duplicate transactions anomaly", category: "anomaly_detection", output: { action: "anomaly_detection", type: "duplicate_suspicious", reply: "📊 Şüpheli işlemler tespit edildi", changes: [] } },
  { user_command: "geç ödemeleri işaretle", logic: "flag late overdue delayed payments anomaly", category: "anomaly_detection", output: { action: "anomaly_detection", column: "ödeme_tarihi", reply: "📊 Geç ödemeler işaretlendi", changes: [] } },
  { user_command: "sıfırdan küçük değerleri anomali olarak göster", logic: "show negative below zero values as anomaly outlier", category: "anomaly_detection", output: { action: "anomaly_detection", condition: "below_zero", reply: "📊 Negatif değerler anomali olarak gösterildi", changes: [] } },
  { user_command: "beklenmedik satış düşüşlerini bul", logic: "find unexpected sudden sales drop decrease anomaly", category: "anomaly_detection", output: { action: "anomaly_detection", column: "satış", type: "drop", reply: "📊 Beklenmedik satış düşüşleri bulundu", changes: [] } },

  // compare (+10)
  { user_command: "ocak şubat mart aylarını karşılaştır", logic: "compare January February March monthly data side by side", category: "compare", output: { action: "compare", periods: ["Ocak", "Şubat", "Mart"], reply: "📊 Aylık karşılaştırma yapıldı", changes: [] } },
  { user_command: "şubelerin satışlarını karşılaştır", logic: "compare branch store sales performance", category: "compare", output: { action: "compare", column: "satış", groupBy: "şube", reply: "📊 Şube satışları karşılaştırıldı", changes: [] } },
  { user_command: "çalışan verimlilik karşılaştırması", logic: "compare employee productivity efficiency performance", category: "compare", output: { action: "compare", column: "verimlilik", reply: "📊 Çalışan verimliliği karşılaştırıldı", changes: [] } },
  { user_command: "birinci çeyrek ile ikinci çeyreği karşılaştır", logic: "compare Q1 first quarter vs Q2 second quarter results", category: "compare", output: { action: "compare", period1: "Q1", period2: "Q2", reply: "📊 Çeyrek karşılaştırması yapıldı", changes: [] } },
  { user_command: "yıllık büyüme oranını hesapla", logic: "calculate year over year growth rate comparison percentage", category: "compare", output: { action: "compare", type: "yoy_growth", reply: "📊 Yıllık büyüme oranı hesaplandı", changes: [] } },
  { user_command: "maliyetleri ve gelirleri yan yana göster", logic: "show cost and revenue side by side comparison columns", category: "compare", output: { action: "compare", col1: "maliyet", col2: "gelir", reply: "📊 Maliyet-gelir karşılaştırması yapıldı", changes: [] } },
  { user_command: "online ve offline satışları karşılaştır", logic: "compare online offline channel sales figures", category: "compare", output: { action: "compare", col1: "online", col2: "offline", reply: "📊 Online-offline karşılaştırması yapıldı", changes: [] } },
  { user_command: "en iyi ve en kötü performansı karşılaştır", logic: "compare best worst performing items employees products", category: "compare", output: { action: "compare", type: "best_worst", reply: "📊 En iyi ve en kötü karşılaştırması yapıldı", changes: [] } },
  { user_command: "ürün kategorilerini gelire göre karşılaştır", logic: "compare product categories by revenue income", category: "compare", output: { action: "compare", column: "gelir", groupBy: "kategori", reply: "📊 Kategori karşılaştırması yapıldı", changes: [] } },
  { user_command: "tatil dönemi ile normal dönemi karşılaştır", logic: "compare holiday seasonal period vs normal period sales", category: "compare", output: { action: "compare", period1: "tatil", period2: "normal", reply: "📊 Dönem karşılaştırması yapıldı", changes: [] } },

  // forecast (+8)
  { user_command: "talep tahmini yap", logic: "demand forecast prediction calculation future", category: "forecast", output: { action: "forecast", column: "talep", reply: "📊 Talep tahmini yapıldı", changes: [] } },
  { user_command: "bütçe projeksiyonu hazırla", logic: "budget projection forecast planning future", category: "forecast", output: { action: "forecast", column: "bütçe", type: "projection", reply: "📊 Bütçe projeksiyonu hazırlandı", changes: [] } },
  { user_command: "stok yenileme zamanını tahmin et", logic: "forecast stock replenishment timing reorder point", category: "forecast", output: { action: "forecast", column: "stok", type: "reorder", reply: "📊 Stok yenileme tahmini yapıldı", changes: [] } },
  { user_command: "sezonsal satış tahmini yap", logic: "seasonal sales forecast prediction pattern", category: "forecast", output: { action: "forecast", method: "seasonal", column: "satış", reply: "📊 Sezonsal satış tahmini yapıldı", changes: [] } },
  { user_command: "yıllık satış hedefine ulaşma tahmini", logic: "forecast whether annual sales target will be met projection", category: "forecast", output: { action: "forecast", target: "hedef", column: "satış", reply: "📊 Hedef ulaşım tahmini yapıldı", changes: [] } },
  { user_command: "gelecek dönem kar tahmini", logic: "forecast next period profit earnings prediction", category: "forecast", output: { action: "forecast", column: "kar", reply: "📊 Gelecek dönem kâr tahmini yapıldı", changes: [] } },
  { user_command: "personel ihtiyacını tahmin et", logic: "forecast headcount staffing needs future workforce", category: "forecast", output: { action: "forecast", column: "personel", reply: "📊 Personel ihtiyacı tahmini yapıldı", changes: [] } },
  { user_command: "aylık büyüme tahmini", logic: "monthly growth rate forecast trend projection", category: "forecast", output: { action: "forecast", type: "growth", period: "monthly", reply: "📊 Aylık büyüme tahmini yapıldı", changes: [] } },

  // sentiment_analysis (+10)
  { user_command: "çalışan geri bildirimlerini analiz et", logic: "analyze employee feedback satisfaction sentiment text", category: "sentiment_analysis", output: { action: "sentiment_analysis", column: "geri_bildirim", reply: "📊 Çalışan geri bildirimleri analiz edildi", changes: [] } },
  { user_command: "teslimat yorumlarını değerlendir", logic: "evaluate delivery reviews sentiment analysis positive negative", category: "sentiment_analysis", output: { action: "sentiment_analysis", column: "yorum", reply: "📊 Teslimat yorumları değerlendirildi", changes: [] } },
  { user_command: "net promoter score hesapla", logic: "calculate NPS net promoter score sentiment loyalty", category: "sentiment_analysis", output: { action: "sentiment_analysis", output_type: "nps", reply: "📊 NPS skoru hesaplandı", changes: [] } },
  { user_command: "olumlu geri bildirimleri listele", logic: "list filter positive feedback comments sentiment analysis", category: "sentiment_analysis", output: { action: "sentiment_analysis", filter: "positive", reply: "📊 Olumlu geri bildirimler listelendi", changes: [] } },
  { user_command: "tedarikçi değerlendirmelerini analiz et", logic: "analyze supplier vendor evaluation ratings sentiment", category: "sentiment_analysis", output: { action: "sentiment_analysis", column: "değerlendirme", reply: "📊 Tedarikçi değerlendirmeleri analiz edildi", changes: [] } },
  { user_command: "yorumları pozitif negatif nötr olarak etiketle", logic: "label tag reviews positive negative neutral sentiment classification", category: "sentiment_analysis", output: { action: "sentiment_analysis", output_type: "labels", reply: "📊 Yorumlar etiketlendi", changes: [] } },
  { user_command: "memnuniyet trendini göster", logic: "show satisfaction trend over time sentiment trend", category: "sentiment_analysis", output: { action: "sentiment_analysis", output_type: "trend", reply: "📊 Memnuniyet trendi gösterildi", changes: [] } },
  { user_command: "en çok şikayet edilen konuları çıkar", logic: "extract most complained topics themes from negative reviews", category: "sentiment_analysis", output: { action: "sentiment_analysis", output_type: "topics", reply: "📊 En çok şikayet edilen konular çıkarıldı", changes: [] } },
  { user_command: "yıldız puanı düşük yorumları analiz et", logic: "analyze low star rating reviews sentiment negative", category: "sentiment_analysis", output: { action: "sentiment_analysis", filter: "low_rating", reply: "📊 Düşük puanlı yorumlar analiz edildi", changes: [] } },
  { user_command: "hizmet kalitesi yorumlarını değerlendir", logic: "evaluate service quality feedback sentiment customer experience", category: "sentiment_analysis", output: { action: "sentiment_analysis", column: "hizmet_yorumu", reply: "📊 Hizmet kalitesi yorumları değerlendirildi", changes: [] } },

  // classify (+10)
  { user_command: "ödeme yöntemine göre kategorile", logic: "categorize classify by payment method type", category: "classify", output: { action: "classify", column: "ödeme_yöntemi", reply: "📊 Ödeme yöntemine göre kategorilendi", changes: [] } },
  { user_command: "bölgeye göre sınıflandır", logic: "classify categorize by region geographic area", category: "classify", output: { action: "classify", column: "bölge", reply: "📊 Bölgeye göre sınıflandırıldı", changes: [] } },
  { user_command: "fatura ödeme durumunu ödendi bekliyor gecikti olarak etiketle", logic: "label invoice payment status paid pending overdue", category: "classify", output: { action: "classify", categories: ["Ödendi", "Bekliyor", "Gecikti"], reply: "📊 Fatura durumları etiketlendi", changes: [] } },
  { user_command: "performans puanına göre A B C D derecelendir", logic: "grade classify by performance score A B C D rating", category: "classify", output: { action: "classify", categories: ["A", "B", "C", "D"], reply: "📊 Performans derecelendirmesi yapıldı", changes: [] } },
  { user_command: "sipariş durumuna göre grupla", logic: "group classify orders by status processing shipped delivered", category: "classify", output: { action: "classify", column: "durum", reply: "📊 Sipariş durumuna göre gruplandı", changes: [] } },
  { user_command: "departmana göre sınıflandır", logic: "classify categorize by department team division", category: "classify", output: { action: "classify", column: "departman", reply: "📊 Departmana göre sınıflandırıldı", changes: [] } },
  { user_command: "gelir seviyesine göre yüksek orta düşük derecelendir", logic: "classify by income revenue level high medium low tier", category: "classify", output: { action: "classify", categories: ["Yüksek", "Orta", "Düşük"], reply: "📊 Gelir seviyesine göre derecelendirildi", changes: [] } },
  { user_command: "satışları mevsimsel kategorilere ayır", logic: "classify sales by seasonal category spring summer autumn winter", category: "classify", output: { action: "classify", categories: ["İlkbahar", "Yaz", "Sonbahar", "Kış"], reply: "📊 Satışlar mevsimsel kategorilere ayrıldı", changes: [] } },
  { user_command: "müşterileri bronz gümüş altın platin olarak etiketle", logic: "label customers bronze silver gold platinum loyalty tier", category: "classify", output: { action: "classify", categories: ["Bronz", "Gümüş", "Altın", "Platin"], reply: "📊 Müşteri sadakat seviyeleri etiketlendi", changes: [] } },
  { user_command: "ürün kategorisini otomatik belirle", logic: "automatically determine assign product category classification AI", category: "classify", output: { action: "classify", column: "ürün", auto: true, reply: "📊 Ürün kategorileri otomatik belirlendi", changes: [] } },

  // === GRUP 7: Finans & Kredi (15 örnek) ===
  { user_command: "aylık faiz hesapla", logic: "calculate monthly interest rate loan finance", category: "generate_formula", output: { action: "generate_formula", formula_type: "interest", reply: "📐 Aylık faiz formülü eklendi", changes: [] } },
  { user_command: "yıllık faiz oranını aylığa çevir", logic: "convert annual interest rate to monthly rate APR", category: "generate_formula", output: { action: "generate_formula", formula_type: "annual_to_monthly_rate", reply: "📐 Yıllık faiz aylık faize çevrildi", changes: [] } },
  { user_command: "kredi taksitini hesapla", logic: "calculate loan installment monthly payment PMT", category: "generate_formula", output: { action: "generate_formula", formula_type: "pmt", reply: "📐 Kredi taksit tutarı hesaplandı", changes: [] } },
  { user_command: "ROI hesapla", logic: "calculate return on investment ROI profit ratio", category: "generate_formula", output: { action: "generate_formula", formula_type: "roi", reply: "📐 ROI (Yatırım Getirisi) hesaplandı", changes: [] } },
  { user_command: "yatırım getirisini hesapla", logic: "calculate investment return profit yield percentage", category: "generate_formula", output: { action: "generate_formula", formula_type: "roi", reply: "📐 Yatırım getirisi hesaplandı", changes: [] } },
  { user_command: "net bugünkü değeri hesapla", logic: "calculate net present value NPV discounted cash flow", category: "generate_formula", output: { action: "generate_formula", formula_type: "npv", reply: "📐 Net bugünkü değer (NBD) hesaplandı", changes: [] } },
  { user_command: "NBD hesapla", logic: "calculate NPV net present value finance investment", category: "generate_formula", output: { action: "generate_formula", formula_type: "npv", reply: "📐 NBD hesaplandı", changes: [] } },
  { user_command: "iç verim oranını hesapla", logic: "calculate internal rate of return IRR investment", category: "generate_formula", output: { action: "generate_formula", formula_type: "irr", reply: "📐 İç Verim Oranı (İVO) hesaplandı", changes: [] } },
  { user_command: "bileşik faiz hesapla", logic: "calculate compound interest compounding period rate", category: "generate_formula", output: { action: "generate_formula", formula_type: "compound_interest", reply: "📐 Bileşik faiz hesaplandı", changes: [] } },
  { user_command: "amortisman hesapla", logic: "calculate depreciation amortization asset straight line", category: "generate_formula", output: { action: "generate_formula", formula_type: "depreciation", reply: "📐 Amortisman tutarı hesaplandı", changes: [] } },
  { user_command: "brüt kar marjını hesapla", logic: "calculate gross profit margin percentage revenue cost", category: "generate_formula", output: { action: "generate_formula", formula_type: "gross_margin", reply: "📐 Brüt kar marjı hesaplandı", changes: [] } },
  { user_command: "EBITDA hesapla", logic: "calculate EBITDA earnings before interest tax depreciation amortization", category: "generate_formula", output: { action: "generate_formula", formula_type: "ebitda", reply: "📐 EBITDA hesaplandı", changes: [] } },
  { user_command: "başabaş noktasını hesapla", logic: "calculate break even point fixed variable cost revenue", category: "generate_formula", output: { action: "generate_formula", formula_type: "break_even", reply: "📐 Başabaş noktası hesaplandı", changes: [] } },
  { user_command: "borç/özkaynak oranını hesapla", logic: "calculate debt to equity ratio leverage financial", category: "generate_formula", output: { action: "generate_formula", formula_type: "debt_equity_ratio", reply: "📐 Borç/Özkaynak oranı hesaplandı", changes: [] } },
  { user_command: "nakit akış tahminini hesapla", logic: "calculate cash flow forecast projection revenue expense", category: "forecast", output: { action: "forecast", target: "nakit_akış", reply: "📈 Nakit akış tahmini oluşturuldu", changes: [] } },

  // === GRUP 8: E-ticaret & Lojistik (15 örnek) ===
  { user_command: "iade oranını hesapla", logic: "calculate return rate refund ratio ecommerce", category: "generate_formula", output: { action: "generate_formula", formula_type: "return_rate", reply: "📐 İade oranı hesaplandı", changes: [] } },
  { user_command: "ortalama sepet tutarını bul", logic: "calculate average order value AOV basket size ecommerce", category: "average", output: { action: "average", column: "sepet_tutarı", reply: "🧮 Ortalama sepet tutarı hesaplandı", changes: [] } },
  { user_command: "sepet ortalaması nedir", logic: "average basket order value ecommerce shopping cart", category: "average", output: { action: "average", column: "sipariş_tutarı", reply: "🧮 Ortalama sepet değeri hesaplandı", changes: [] } },
  { user_command: "dönüşüm oranını hesapla", logic: "calculate conversion rate visitor purchase ecommerce funnel", category: "generate_formula", output: { action: "generate_formula", formula_type: "conversion_rate", reply: "📐 Dönüşüm oranı hesaplandı", changes: [] } },
  { user_command: "stok devir hızını hesapla", logic: "calculate inventory turnover rate stock rotation", category: "generate_formula", output: { action: "generate_formula", formula_type: "inventory_turnover", reply: "📐 Stok devir hızı hesaplandı", changes: [] } },
  { user_command: "stok seviyesi kritik olanları işaretle", logic: "flag low stock critical inventory level threshold highlight", category: "highlight", output: { action: "highlight", column: "stok", condition: "less_than", threshold: 10, color: "red", reply: "🎨 Kritik stok seviyeleri işaretlendi", changes: [] } },
  { user_command: "kargo maliyeti en yüksek siparişleri göster", logic: "show orders with highest shipping cost freight delivery", category: "top_n", output: { action: "top_n", column: "kargo_maliyeti", n: 10, order: "desc", reply: "🏆 En yüksek kargolu siparişler listelendi", changes: [] } },
  { user_command: "ürün bazında iade sayısını göster", logic: "count returns refunds per product group by product", category: "group_by", output: { action: "group_by", group_column: "ürün", agg_column: "iade_sayısı", agg_func: "sum", reply: "📊 Ürün bazında iade sayıları gösterildi", changes: [] } },
  { user_command: "en çok satan ürünleri listele", logic: "list top selling best products sales quantity rank", category: "top_n", output: { action: "top_n", column: "satış_adedi", n: 10, order: "desc", reply: "🏆 En çok satan ürünler listelendi", changes: [] } },
  { user_command: "müşteri yaşam boyu değerini hesapla", logic: "calculate customer lifetime value CLV LTV average purchase frequency", category: "generate_formula", output: { action: "generate_formula", formula_type: "clv", reply: "📐 Müşteri yaşam boyu değeri (CLV) hesaplandı", changes: [] } },
  { user_command: "kargo süresi ortalamasını hesapla", logic: "calculate average shipping delivery time duration days", category: "average", output: { action: "average", column: "kargo_süresi", reply: "🧮 Ortalama kargo süresi hesaplandı", changes: [] } },
  { user_command: "gecikmeli teslimatları filtrele", logic: "filter delayed late deliveries shipments overdue", category: "filter", output: { action: "filter", column: "teslimat_durumu", operator: "equals", value: "Gecikmiş", reply: "🔍 Gecikmeli teslimatlar filtrelendi", changes: [] } },
  { user_command: "ülkeye göre satışları grupla", logic: "group sales by country region geographic breakdown", category: "group_by", output: { action: "group_by", group_column: "ülke", agg_column: "satış", agg_func: "sum", reply: "📊 Ülke bazında satışlar gruplandı", changes: [] } },
  { user_command: "indirim oranı en yüksek ürünleri göster", logic: "show products with highest discount percentage promotional", category: "top_n", output: { action: "top_n", column: "indirim_oranı", n: 10, order: "desc", reply: "🏆 En yüksek indirimli ürünler listelendi", changes: [] } },
  { user_command: "satılmayan ürünleri işaretle", logic: "mark flag products with zero sales no movement dead stock", category: "highlight", output: { action: "highlight", column: "satış_adedi", condition: "equals", value: 0, color: "red", reply: "🎨 Satılmayan ürünler işaretlendi", changes: [] } },

  // === GRUP 9: İstatistik (10 örnek) ===
  { user_command: "standart sapmayı hesapla", logic: "calculate standard deviation spread variability statistics", category: "generate_formula", output: { action: "generate_formula", formula_type: "std_dev", reply: "📐 Standart sapma hesaplandı", changes: [] } },
  { user_command: "satışların standart sapması nedir", logic: "sales standard deviation statistics variability", category: "generate_formula", output: { action: "generate_formula", column: "satış", formula_type: "std_dev", reply: "📐 Satış standart sapması hesaplandı", changes: [] } },
  { user_command: "varyansı hesapla", logic: "calculate variance statistical spread data distribution", category: "generate_formula", output: { action: "generate_formula", formula_type: "variance", reply: "📐 Varyans hesaplandı", changes: [] } },
  { user_command: "medyanı bul", logic: "find median middle value statistics dataset", category: "generate_formula", output: { action: "generate_formula", formula_type: "median", reply: "📐 Medyan değeri bulundu", changes: [] } },
  { user_command: "satışların medyanı nedir", logic: "sales median middle value 50th percentile statistics", category: "generate_formula", output: { action: "generate_formula", column: "satış", formula_type: "median", reply: "📐 Satış medyanı hesaplandı", changes: [] } },
  { user_command: "yüzde 90'lık dilimi hesapla", logic: "calculate 90th percentile quantile distribution statistics", category: "generate_formula", output: { action: "generate_formula", formula_type: "percentile", percentile: 90, reply: "📐 90. yüzdelik dilim hesaplandı", changes: [] } },
  { user_command: "çeyrekler açıklığını hesapla", logic: "calculate interquartile range IQR Q1 Q3 statistics", category: "generate_formula", output: { action: "generate_formula", formula_type: "iqr", reply: "📐 Çeyrekler açıklığı (IQR) hesaplandı", changes: [] } },
  { user_command: "korelasyon katsayısını hesapla", logic: "calculate correlation coefficient pearson relationship two columns", category: "generate_formula", output: { action: "generate_formula", formula_type: "correlation", reply: "📐 Korelasyon katsayısı hesaplandı", changes: [] } },
  { user_command: "aykırı değerleri tespit et", logic: "detect outliers anomalies statistical z-score IQR", category: "anomaly_detection", output: { action: "anomaly_detection", method: "iqr", reply: "🔍 Aykırı değerler tespit edildi", changes: [] } },
  { user_command: "veri dağılımını analiz et", logic: "analyze data distribution histogram skewness statistics", category: "explain", output: { action: "explain", analysis_type: "distribution", reply: "📊 Veri dağılımı analiz edildi", changes: [] } },

  // === GRUP 10: Gelişmiş Renklendirme (10 örnek) ===
  { user_command: "en iyi yüzde 10'u vurgula", logic: "highlight top 10 percent best performers values percentile", category: "highlight", output: { action: "highlight", condition: "top_percent", percent: 10, color: "green", reply: "🎨 En iyi %10 vurgulandı", changes: [] } },
  { user_command: "en kötü yüzde 20'yi kırmızı yap", logic: "highlight bottom 20 percent worst performers red", category: "highlight", output: { action: "highlight", condition: "bottom_percent", percent: 20, color: "red", reply: "🎨 En kötü %20 kırmızıya boyandı", changes: [] } },
  { user_command: "1000 ile 5000 arasındaki değerleri sarı yap", logic: "highlight values between range 1000 5000 yellow conditional", category: "highlight", output: { action: "highlight", condition: "between", min: 1000, max: 5000, color: "yellow", reply: "🎨 1000-5000 arası değerler sarıya boyandı", changes: [] } },
  { user_command: "negatif değerleri kırmızıya boya", logic: "color negative values red below zero loss", category: "highlight", output: { action: "highlight", condition: "less_than", value: 0, color: "red", reply: "🎨 Negatif değerler kırmızıya boyandı", changes: [] } },
  { user_command: "hedefi aşan satışları yeşil yap", logic: "highlight sales exceeding target goal green achievement", category: "highlight", output: { action: "highlight", column: "satış", condition: "greater_than", reference_column: "hedef", color: "green", reply: "🎨 Hedefi aşan satışlar yeşile boyandı", changes: [] } },
  { user_command: "bu haftanın verilerini mavi renkle işaretle", logic: "highlight this week current week data blue mark", category: "highlight", output: { action: "highlight", condition: "this_week", color: "blue", reply: "🎨 Bu haftanın verileri maviye boyandı", changes: [] } },
  { user_command: "tekrar eden değerleri turuncu yap", logic: "highlight duplicate repeated values orange mark", category: "highlight", output: { action: "highlight", condition: "duplicate", color: "orange", reply: "🎨 Tekrar eden değerler turuncuya boyandı", changes: [] } },
  { user_command: "boş hücreleri gri renge boya", logic: "highlight empty blank null cells grey gray color", category: "highlight", output: { action: "highlight", condition: "is_blank", color: "gray", reply: "🎨 Boş hücreler griye boyandı", changes: [] } },
  { user_command: "ortalama üzerindeki değerleri vurgula", logic: "highlight values above average mean threshold green", category: "highlight", output: { action: "highlight", condition: "above_average", color: "green", reply: "🎨 Ortalama üzerindeki değerler vurgulandı", changes: [] } },
  { user_command: "renkleri temizle", logic: "clear remove all colors highlights formatting reset", category: "clear_colors", output: { action: "clear_colors", reply: "🎨 Tüm renkler temizlendi", changes: [] } },

  // === GRUP 11: Çok Boyutlu Gruplama (12 örnek) ===
  { user_command: "bölge ve ürüne göre satışları grupla", logic: "group by region and product two dimensional pivot aggregation", category: "group_by", output: { action: "group_by", group_columns: ["bölge", "ürün"], agg_column: "satış", agg_func: "sum", reply: "📊 Bölge ve ürün bazında satışlar gruplandı", changes: [] } },
  { user_command: "departman ve ay bazında giderleri göster", logic: "group expenses by department and month two dimension", category: "group_by", output: { action: "group_by", group_columns: ["departman", "ay"], agg_column: "gider", agg_func: "sum", reply: "📊 Departman ve ay bazında giderler gruplandı", changes: [] } },
  { user_command: "müşteri segmenti ve ürün kategorisine göre gelir grupla", logic: "group revenue by customer segment and product category", category: "group_by", output: { action: "group_by", group_columns: ["segment", "kategori"], agg_column: "gelir", agg_func: "sum", reply: "📊 Segment ve kategori bazında gelir gruplandı", changes: [] } },
  { user_command: "şehir bazında ortalama sipariş değeri", logic: "average order value grouped by city geographic region", category: "group_by", output: { action: "group_by", group_column: "şehir", agg_column: "sipariş_değeri", agg_func: "avg", reply: "📊 Şehir bazında ortalama sipariş değeri hesaplandı", changes: [] } },
  { user_command: "satış temsilcisi başına toplam satış", logic: "total sales per sales representative agent group sum", category: "group_by", output: { action: "group_by", group_column: "satış_temsilcisi", agg_column: "satış", agg_func: "sum", reply: "📊 Temsilci bazında toplam satışlar hesaplandı", changes: [] } },
  { user_command: "yıl ve çeyrek bazında geliri grupla", logic: "group revenue by year and quarter fiscal period", category: "group_by", output: { action: "group_by", group_columns: ["yıl", "çeyrek"], agg_column: "gelir", agg_func: "sum", reply: "📊 Yıl ve çeyrek bazında gelir gruplandı", changes: [] } },
  { user_command: "tedarikçi ve ürün grubuna göre maliyeti grupla", logic: "group cost by supplier and product group category procurement", category: "group_by", output: { action: "group_by", group_columns: ["tedarikçi", "ürün_grubu"], agg_column: "maliyet", agg_func: "sum", reply: "📊 Tedarikçi ve ürün bazında maliyetler gruplandı", changes: [] } },
  { user_command: "kanal ve ülkeye göre satış adedini say", logic: "count sales by channel and country distribution", category: "group_by", output: { action: "group_by", group_columns: ["kanal", "ülke"], agg_column: "satış_adedi", agg_func: "count", reply: "📊 Kanal ve ülke bazında satış adetleri sayıldı", changes: [] } },
  { user_command: "mağaza ve kategori bazında ciroyu özetle", logic: "summarize revenue turnover by store and category", category: "group_by", output: { action: "group_by", group_columns: ["mağaza", "kategori"], agg_column: "ciro", agg_func: "sum", reply: "📊 Mağaza ve kategori bazında ciro özetlendi", changes: [] } },
  { user_command: "proje ve ekip üyesi başına saatleri topla", logic: "sum hours by project and team member resource tracking", category: "group_by", output: { action: "group_by", group_columns: ["proje", "ekip_üyesi"], agg_column: "saat", agg_func: "sum", reply: "📊 Proje ve ekip üyesi bazında saatler toplandı", changes: [] } },
  { user_command: "ödeme yöntemine göre işlem sayısını göster", logic: "count transactions by payment method credit card cash wire", category: "group_by", output: { action: "group_by", group_column: "ödeme_yöntemi", agg_column: "işlem", agg_func: "count", reply: "📊 Ödeme yöntemine göre işlem sayıları gösterildi", changes: [] } },
  { user_command: "çalışan ve proje bazında toplam maliyeti hesapla", logic: "calculate total cost by employee and project assignment", category: "group_by", output: { action: "group_by", group_columns: ["çalışan", "proje"], agg_column: "maliyet", agg_func: "sum", reply: "📊 Çalışan ve proje bazında toplam maliyet hesaplandı", changes: [] } },

  // === GRUP 12: Proje Yönetimi (8 örnek) ===
  { user_command: "son teslim tarihi geçmiş görevleri listele", logic: "list tasks past due date overdue deadline project management", category: "filter", output: { action: "filter", column: "son_tarih", operator: "less_than", value: "today", reply: "🔍 Son tarihi geçmiş görevler listelendi", changes: [] } },
  { user_command: "gecikmiş görevleri kırmızıyla işaretle", logic: "highlight overdue late tasks red deadline passed", category: "highlight", output: { action: "highlight", column: "son_tarih", condition: "overdue", color: "red", reply: "🎨 Gecikmiş görevler kırmızıyla işaretlendi", changes: [] } },
  { user_command: "tamamlanma oranını hesapla", logic: "calculate completion rate percentage done tasks project progress", category: "generate_formula", output: { action: "generate_formula", formula_type: "completion_rate", reply: "📐 Tamamlanma oranı hesaplandı", changes: [] } },
  { user_command: "tamamlanan görev sayısını bul", logic: "count completed done finished tasks project", category: "count", output: { action: "count", column: "durum", value: "Tamamlandı", reply: "🔢 Tamamlanan görev sayısı bulundu", changes: [] } },
  { user_command: "bu hafta teslim edilecek görevleri göster", logic: "show tasks due this week upcoming deadline filter", category: "filter", output: { action: "filter", column: "son_tarih", operator: "this_week", reply: "🔍 Bu hafta teslim edilecek görevler gösterildi", changes: [] } },
  { user_command: "görevleri önceliğe göre sırala", logic: "sort tasks by priority high medium low project management", category: "sort", output: { action: "sort", column: "öncelik", order: "desc", reply: "↕️ Görevler önceliğe göre sıralandı", changes: [] } },
  { user_command: "atanmamış görevleri filtrele", logic: "filter unassigned tasks no assignee empty owner project", category: "filter", output: { action: "filter", column: "atanan", operator: "is_blank", reply: "🔍 Atanmamış görevler filtrelendi", changes: [] } },
  { user_command: "kişi başına görev sayısını göster", logic: "count tasks per person assignee workload distribution", category: "group_by", output: { action: "group_by", group_column: "atanan", agg_column: "görev", agg_func: "count", reply: "📊 Kişi başına görev sayıları gösterildi", changes: [] } },

  // === GRUP 13: Güncelleme & Düzenleme (10 örnek) ===
  { user_command: "seçili hücreyi güncelle", logic: "update edit specific selected cell value", category: "update_cells", output: { action: "update_cells", reply: "✏️ Hücre güncellendi", changes: [] } },
  { user_command: "boş hücrelere sıfır yaz", logic: "fill empty blank cells with zero value replace null", category: "update_cells", output: { action: "update_cells", condition: "is_blank", value: 0, reply: "✏️ Boş hücreler sıfır ile dolduruldu", changes: [] } },
  { user_command: "fiyatları yüzde 10 artır", logic: "increase prices by 10 percent update multiply values", category: "transform", output: { action: "transform", column: "fiyat", operation: "multiply", value: 1.1, reply: "✏️ Fiyatlar %10 artırıldı", changes: [] } },
  { user_command: "tüm fiyatları yüzde 5 indir", logic: "decrease reduce all prices by 5 percent discount", category: "transform", output: { action: "transform", column: "fiyat", operation: "multiply", value: 0.95, reply: "✏️ Fiyatlar %5 indirildi", changes: [] } },
  { user_command: "KDV tutarını hesaplayıp sütuna ekle", logic: "calculate add VAT KDV tax amount column new values", category: "add_column", output: { action: "add_column", column_name: "KDV", formula: "=fiyat*0.18", reply: "➕ KDV tutarı sütunu eklendi", changes: [] } },
  { user_command: "sütun adını değiştir", logic: "rename column header title change name", category: "rename_columns", output: { action: "rename_columns", reply: "✏️ Sütun adı değiştirildi", changes: [] } },
  { user_command: "satır ekle", logic: "add insert new empty row bottom end table", category: "add_row", output: { action: "add_row", reply: "➕ Yeni satır eklendi", changes: [] } },
  { user_command: "son satırı sil", logic: "delete remove last bottom row table", category: "delete_rows", output: { action: "delete_rows", target: "last", reply: "🗑️ Son satır silindi", changes: [] } },
  { user_command: "sütun sil", logic: "delete remove column from table", category: "delete_column", output: { action: "delete_column", reply: "🗑️ Sütun silindi", changes: [] } },
  { user_command: "tüm verileri temizle", logic: "clear all data reset empty table wipe", category: "clear_all", output: { action: "clear_all", reply: "🗑️ Tüm veriler temizlendi", changes: [] } }

];

// Renk eÅleÅtirme tablosu (TÃ¼rkÃ§e â hex)
const COLOR_MAP = {
  "kÄ±rmÄ±zÄ±": "#fecaca", "red": "#fecaca",
  "yeÅil": "#bbf7d0", "green": "#bbf7d0",
  "sarÄ±": "#fef08a", "yellow": "#fef08a",
  "mavi": "#bfdbfe", "blue": "#bfdbfe",
  "turuncu": "#fed7aa", "orange": "#fed7aa",
  "mor": "#e9d5ff", "purple": "#e9d5ff",
  "pembe": "#fbcfe8", "pink": "#fbcfe8",
  "gri": "#e5e7eb", "gray": "#e5e7eb",
  "beyaz": "#ffffff", "white": "#ffffff",
  "siyah": "#1f2937", "black": "#1f2937",
};

// Intent â Action eÅleÅtirme haritasÄ±
const INTENT_MAP = {
  sort_asc: { action: "sort", direction: "asc" },
  sort_desc: { action: "sort", direction: "desc" },
  sum: { action: "sum" },
  average: { action: "average" },
  max: { action: "max" },
  min: { action: "min" },
  count: { action: "count" },
  delete_empty: { action: "delete_rows", condition: "empty" },
  deduplicate: { action: "remove_duplicates" },
  highlight_negative: { action: "highlight", condition: "value < 0", color: "#fecaca" },
  highlight_positive: { action: "highlight", condition: "value > 0", color: "#bbf7d0" },
  highlight_top: { action: "highlight", condition: "top5", color: "#fef08a" },
  add_vat: { action: "update_cells", formula: "multiply", factor: 1.20 },
  remove_vat: { action: "update_cells", formula: "divide", factor: 1.20 },
  net_salary: { action: "update_cells", formula: "net_salary" },
  sgk: { action: "update_cells", formula: "sgk_deduction" },
  filter: { action: "filter" },
  remove_filter: { action: "remove_filter" },
  uppercase: { action: "transform", transform: "uppercase" },
  lowercase: { action: "transform", transform: "lowercase" },
  trim: { action: "transform", transform: "trim" },
  report: { action: "message" },
  help: { action: "message" },
};

module.exports = { EXCEL_DATASET, COLOR_MAP, INTENT_MAP };
// Toplam: ~860 örnek, 26 kategori, 43+ action tipi
