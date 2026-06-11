// Cleaned: 2026-06-06 — 1312 corrupted entries removed (was 2689, now 1377)

const EXCEL_DATASET = [
  {
    "user_command": "a dan z ye sırala",
    "logic": "sort ascending alphabetical",
    "category": "sorting",
    "output": {
      "action": "sort",
      "direction": "asc",
      "reply": "✓ A'dan Z'ye sıralandı",
      "changes": []
    }
  },
  {
    "user_command": "z den a ya sırala",
    "logic": "sort descending alphabetical",
    "category": "sorting",
    "output": {
      "action": "sort",
      "direction": "desc",
      "reply": "✓ Z'den A'ya sıralandı",
      "changes": []
    }
  },
  {
    "user_command": "küçükten büyüğe sırala",
    "logic": "sort ascending numeric",
    "category": "sorting",
    "output": {
      "action": "sort",
      "direction": "asc",
      "reply": "✓ Küçükten büyüğe sıralandı",
      "changes": []
    }
  },
  {
    "user_command": "büyükten küçüğe sırala",
    "logic": "sort descending numeric",
    "category": "sorting",
    "output": {
      "action": "sort",
      "direction": "desc",
      "reply": "✓ Büyükten küçüğe sıralandı",
      "changes": []
    }
  },
  {
    "user_command": "alfabetik sırala",
    "logic": "alphabetical order sort",
    "category": "sorting",
    "output": {
      "action": "sort",
      "direction": "asc",
      "reply": "✓ Alfabetik sıralandı",
      "changes": []
    }
  },
  {
    "user_command": "artan sırayla diz",
    "logic": "arrange ascending order",
    "category": "sorting",
    "output": {
      "action": "sort",
      "direction": "asc",
      "reply": "✓ Artan sırayla dizildi",
      "changes": []
    }
  },
  {
    "user_command": "azalan sırayla diz",
    "logic": "arrange descending order",
    "category": "sorting",
    "output": {
      "action": "sort",
      "direction": "desc",
      "reply": "✓ Azalan sırayla dizildi",
      "changes": []
    }
  },
  {
    "user_command": "fiyata göre sırala",
    "logic": "sort by price column ascending",
    "category": "sorting",
    "output": {
      "action": "sort",
      "column": "fiyat",
      "direction": "asc",
      "reply": "✓ Fiyata göre sıralandı",
      "changes": []
    }
  },
  {
    "user_command": "tarihe göre sırala",
    "logic": "sort by date column",
    "category": "sorting",
    "output": {
      "action": "sort",
      "column": "tarih",
      "direction": "asc",
      "reply": "✓ Tarihe göre sıralandı",
      "changes": []
    }
  },
  {
    "user_command": "isme göre sırala",
    "logic": "sort by name alphabetically",
    "category": "sorting",
    "output": {
      "action": "sort",
      "column": "isim",
      "direction": "asc",
      "reply": "✓ İsime göre sıralandı",
      "changes": []
    }
  },
  {
    "user_command": "satışa göre en yüksekten sırala",
    "logic": "sort sales descending highest first",
    "category": "sorting",
    "output": {
      "action": "sort",
      "column": "satış",
      "direction": "desc",
      "reply": "✓ Satışa göre sıralandı",
      "changes": []
    }
  },
  {
    "user_command": "fiyata göre büyükten küçüğe",
    "logic": "sort price descending",
    "category": "sorting",
    "output": {
      "action": "sort",
      "column": "fiyat",
      "direction": "desc",
      "reply": "✓ Fiyata göre azalan sıralandı",
      "changes": []
    }
  },
  {
    "user_command": "b sütununu sırala",
    "logic": "sort column B ascending",
    "category": "sorting",
    "output": {
      "action": "sort",
      "column": "B",
      "direction": "asc",
      "reply": "✓ B sütunu sıralandı",
      "changes": []
    }
  },
  {
    "user_command": "tarihe göre en yeniden en eskiye",
    "logic": "sort date descending newest first",
    "category": "sorting",
    "output": {
      "action": "sort",
      "column": "tarih",
      "direction": "desc",
      "reply": "✓ Tarihe göre azalan sıralandı",
      "changes": []
    }
  },
  {
    "user_command": "müşteri adına göre sırala",
    "logic": "sort by customer name",
    "category": "sorting",
    "output": {
      "action": "sort",
      "column": "müşteri",
      "direction": "asc",
      "reply": "✓ Müşteri adına göre sıralandı",
      "changes": []
    }
  },
  {
    "user_command": "stok miktarına göre sırala",
    "logic": "sort by stock quantity",
    "category": "sorting",
    "output": {
      "action": "sort",
      "column": "stok",
      "direction": "asc",
      "reply": "✓ Stok miktarına göre sıralandı",
      "changes": []
    }
  },
  {
    "user_command": "tutara göre sırala",
    "logic": "sort by amount",
    "category": "sorting",
    "output": {
      "action": "sort",
      "column": "tutar",
      "direction": "asc",
      "reply": "✓ Tutara göre sıralandı",
      "changes": []
    }
  },
  {
    "user_command": "en pahalıdan sırala",
    "logic": "sort most expensive first descending price",
    "category": "sorting",
    "output": {
      "action": "sort",
      "column": "fiyat",
      "direction": "desc",
      "reply": "✓ En pahalıdan sıralandı",
      "changes": []
    }
  },
  {
    "user_command": "en ucuzdan sırala",
    "logic": "sort cheapest first ascending price",
    "category": "sorting",
    "output": {
      "action": "sort",
      "column": "fiyat",
      "direction": "asc",
      "reply": "✓ En ucuzdan sıralandı",
      "changes": []
    }
  },
  {
    "user_command": "sipariş numarasına göre sırala",
    "logic": "sort by order number",
    "category": "sorting",
    "output": {
      "action": "sort",
      "column": "sipariş",
      "direction": "asc",
      "reply": "✓ Sipariş numarasına göre sıralandı",
      "changes": []
    }
  },
  {
    "user_command": "puana göre en yüksekten",
    "logic": "sort score descending",
    "category": "sorting",
    "output": {
      "action": "sort",
      "column": "puan",
      "direction": "desc",
      "reply": "✓ Puana göre sıralandı",
      "changes": []
    }
  },
  {
    "user_command": "maaşa göre büyükten küçüğe sırala",
    "logic": "sort salary descending",
    "category": "sorting",
    "output": {
      "action": "sort",
      "column": "maaş",
      "direction": "desc",
      "reply": "✓ Maaşa göre sıralandı",
      "changes": []
    }
  },
  {
    "user_command": "kodu göre sırala",
    "logic": "sort by code number",
    "category": "sorting",
    "output": {
      "action": "sort",
      "column": "kod",
      "direction": "asc",
      "reply": "✓ Koda göre sıralandı",
      "changes": []
    }
  },
  {
    "user_command": "sıra numarasına göre sırala",
    "logic": "sort by row number order",
    "category": "sorting",
    "output": {
      "action": "sort",
      "column": "sıra",
      "direction": "asc",
      "reply": "✓ Sıra numarasına göre sıralandı",
      "changes": []
    }
  },
  {
    "user_command": "a sütununu küçükten büyüğe diz",
    "logic": "sort column A ascending",
    "category": "sorting",
    "output": {
      "action": "sort",
      "column": "A",
      "direction": "asc",
      "reply": "✓ A sütunu sıralandı",
      "changes": []
    }
  },
  {
    "user_command": "ürün adına göre alfabetik sırala",
    "logic": "sort product name alphabetically",
    "category": "sorting",
    "output": {
      "action": "sort",
      "column": "ürün",
      "direction": "asc",
      "reply": "✓ Ürün adına göre sıralandı",
      "changes": []
    }
  },
  {
    "user_command": "şehre göre sırala",
    "logic": "sort by city name",
    "category": "sorting",
    "output": {
      "action": "sort",
      "column": "şehir",
      "direction": "asc",
      "reply": "✓ Şehre göre sıralandı",
      "changes": []
    }
  },
  {
    "user_command": "işlem tarihine göre sırala",
    "logic": "sort by transaction date",
    "category": "sorting",
    "output": {
      "action": "sort",
      "column": "işlem_tarihi",
      "direction": "asc",
      "reply": "✓ İşlem tarihine göre sıralandı",
      "changes": []
    }
  },
  {
    "user_command": "topla",
    "logic": "calculate sum all values",
    "category": "calculation",
    "output": {
      "action": "sum",
      "reply": "✓ Toplam hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "toplam al",
    "logic": "get total sum",
    "category": "calculation",
    "output": {
      "action": "sum",
      "reply": "✓ Toplam alındı",
      "changes": []
    }
  },
  {
    "user_command": "hepsini topla",
    "logic": "sum all cells",
    "category": "calculation",
    "output": {
      "action": "sum",
      "reply": "✓ Tümü toplandı",
      "changes": []
    }
  },
  {
    "user_command": "toplam kaç",
    "logic": "what is total sum",
    "category": "calculation",
    "output": {
      "action": "sum",
      "reply": "✓ Toplam hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "genel toplam",
    "logic": "grand total sum",
    "category": "calculation",
    "output": {
      "action": "sum",
      "reply": "✓ Genel toplam hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "b sütununu topla",
    "logic": "sum column B values",
    "category": "calculation",
    "output": {
      "action": "sum",
      "column": "B",
      "reply": "✓ B sütunu toplandı",
      "changes": []
    }
  },
  {
    "user_command": "c kolonunu topla",
    "logic": "sum column C values",
    "category": "calculation",
    "output": {
      "action": "sum",
      "column": "C",
      "reply": "✓ C kolonu toplandı",
      "changes": []
    }
  },
  {
    "user_command": "fiyatları topla",
    "logic": "sum price column",
    "category": "calculation",
    "output": {
      "action": "sum",
      "column": "fiyat",
      "reply": "✓ Fiyatlar toplandı",
      "changes": []
    }
  },
  {
    "user_command": "satışları topla",
    "logic": "sum sales column",
    "category": "calculation",
    "output": {
      "action": "sum",
      "column": "satış",
      "reply": "✓ Satışlar toplandı",
      "changes": []
    }
  },
  {
    "user_command": "gelirlerin toplamı ne",
    "logic": "total revenue sum",
    "category": "calculation",
    "output": {
      "action": "sum",
      "column": "gelir",
      "reply": "✓ Gelirler toplandı",
      "changes": []
    }
  },
  {
    "user_command": "tutarları topla",
    "logic": "sum amount column",
    "category": "calculation",
    "output": {
      "action": "sum",
      "column": "tutar",
      "reply": "✓ Tutarlar toplandı",
      "changes": []
    }
  },
  {
    "user_command": "giderleri topla",
    "logic": "sum expenses column",
    "category": "calculation",
    "output": {
      "action": "sum",
      "column": "gider",
      "reply": "✓ Giderler toplandı",
      "changes": []
    }
  },
  {
    "user_command": "miktarları topla",
    "logic": "sum quantity column",
    "category": "calculation",
    "output": {
      "action": "sum",
      "column": "miktar",
      "reply": "✓ Miktarlar toplandı",
      "changes": []
    }
  },
  {
    "user_command": "ciro toplamı",
    "logic": "total revenue turnover sum",
    "category": "calculation",
    "output": {
      "action": "sum",
      "column": "ciro",
      "reply": "✓ Ciro toplamı hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "kasa bakiyesi topla",
    "logic": "sum cash balance",
    "category": "calculation",
    "output": {
      "action": "sum",
      "column": "kasa",
      "reply": "✓ Kasa bakiyesi toplandı",
      "changes": []
    }
  },
  {
    "user_command": "borç toplamı ne kadar",
    "logic": "total debt sum",
    "category": "calculation",
    "output": {
      "action": "sum",
      "column": "borç",
      "reply": "✓ Borç toplamı hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "alacak toplamı",
    "logic": "total receivable sum",
    "category": "calculation",
    "output": {
      "action": "sum",
      "column": "alacak",
      "reply": "✓ Alacak toplamı hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "fatura tutarlarını topla",
    "logic": "sum invoice amounts",
    "category": "calculation",
    "output": {
      "action": "sum",
      "column": "fatura",
      "reply": "✓ Fatura tutarları toplandı",
      "changes": []
    }
  },
  {
    "user_command": "maaşları topla",
    "logic": "sum salary column",
    "category": "calculation",
    "output": {
      "action": "sum",
      "column": "maaş",
      "reply": "✓ Maaşlar toplandı",
      "changes": []
    }
  },
  {
    "user_command": "aylık harcama toplamı",
    "logic": "monthly expense total",
    "category": "calculation",
    "output": {
      "action": "sum",
      "column": "harcama",
      "reply": "✓ Aylık harcama toplamı hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "ortalama al",
    "logic": "calculate average mean",
    "category": "calculation",
    "output": {
      "action": "average",
      "reply": "✓ Ortalama hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "ortalamasını hesapla",
    "logic": "compute average value",
    "category": "calculation",
    "output": {
      "action": "average",
      "reply": "✓ Ortalama hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "ortalama ne",
    "logic": "what is average value",
    "category": "calculation",
    "output": {
      "action": "average",
      "reply": "✓ Ortalama hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "b sütununun ortalaması ne",
    "logic": "average of column B",
    "category": "calculation",
    "output": {
      "action": "average",
      "column": "B",
      "reply": "✓ B sütununun ortalaması hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "fiyatların ortalamasını bul",
    "logic": "find price average",
    "category": "calculation",
    "output": {
      "action": "average",
      "column": "fiyat",
      "reply": "✓ Fiyat ortalaması bulundu",
      "changes": []
    }
  },
  {
    "user_command": "satış ortalaması hesapla",
    "logic": "calculate sales average",
    "category": "calculation",
    "output": {
      "action": "average",
      "column": "satış",
      "reply": "✓ Satış ortalaması hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "aylık ortalama satış",
    "logic": "monthly average sales",
    "category": "calculation",
    "output": {
      "action": "average",
      "column": "satış",
      "reply": "✓ Aylık ortalama hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "maaş ortalaması ne kadar",
    "logic": "average salary amount",
    "category": "calculation",
    "output": {
      "action": "average",
      "column": "maaş",
      "reply": "✓ Maaş ortalaması hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "not ortalaması hesapla",
    "logic": "calculate grade average",
    "category": "calculation",
    "output": {
      "action": "average",
      "column": "not",
      "reply": "✓ Not ortalaması hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "gelir ortalaması ne",
    "logic": "average income",
    "category": "calculation",
    "output": {
      "action": "average",
      "column": "gelir",
      "reply": "✓ Gelir ortalaması hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "sipariş tutarı ortalaması",
    "logic": "average order amount",
    "category": "calculation",
    "output": {
      "action": "average",
      "column": "tutar",
      "reply": "✓ Sipariş ortalaması hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "müşteri başına ortalama sipariş",
    "logic": "average order per customer",
    "category": "calculation",
    "output": {
      "action": "average",
      "column": "tutar",
      "reply": "✓ Müşteri başına ortalama hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "kâr marjı ortalaması",
    "logic": "average profit margin",
    "category": "calculation",
    "output": {
      "action": "average",
      "column": "kar",
      "reply": "✓ Kâr marjı ortalaması hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "prim ortalaması bul",
    "logic": "find average bonus premium",
    "category": "calculation",
    "output": {
      "action": "average",
      "column": "prim",
      "reply": "✓ Prim ortalaması bulundu",
      "changes": []
    }
  },
  {
    "user_command": "haftalık ortalama satış",
    "logic": "weekly average sales",
    "category": "calculation",
    "output": {
      "action": "average",
      "column": "satış",
      "reply": "✓ Haftalık ortalama hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "gider ortalaması",
    "logic": "average expense cost",
    "category": "calculation",
    "output": {
      "action": "average",
      "column": "gider",
      "reply": "✓ Gider ortalaması hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "en büyük değeri bul",
    "logic": "find maximum largest value",
    "category": "calculation",
    "output": {
      "action": "max",
      "reply": "✓ En büyük değer bulundu",
      "changes": []
    }
  },
  {
    "user_command": "maksimum değer ne",
    "logic": "what is maximum value",
    "category": "calculation",
    "output": {
      "action": "max",
      "reply": "✓ Maksimum değer gösterildi",
      "changes": []
    }
  },
  {
    "user_command": "en yüksek fiyat ne",
    "logic": "highest maximum price",
    "category": "calculation",
    "output": {
      "action": "max",
      "column": "fiyat",
      "reply": "✓ En yüksek fiyat bulundu",
      "changes": []
    }
  },
  {
    "user_command": "en çok satan ürün hangisi",
    "logic": "best selling product maximum sales",
    "category": "calculation",
    "output": {
      "action": "max",
      "column": "satış",
      "reply": "✓ En çok satan bulundu",
      "changes": []
    }
  },
  {
    "user_command": "en küçük değeri göster",
    "logic": "find minimum smallest value",
    "category": "calculation",
    "output": {
      "action": "min",
      "reply": "✓ En küçük değer gösterildi",
      "changes": []
    }
  },
  {
    "user_command": "minimum değer kaç",
    "logic": "what is minimum value",
    "category": "calculation",
    "output": {
      "action": "min",
      "reply": "✓ Minimum değer bulundu",
      "changes": []
    }
  },
  {
    "user_command": "en düşük fiyat",
    "logic": "lowest minimum price",
    "category": "calculation",
    "output": {
      "action": "min",
      "column": "fiyat",
      "reply": "✓ En düşük fiyat bulundu",
      "changes": []
    }
  },
  {
    "user_command": "en az satan hangisi",
    "logic": "worst selling product minimum sales",
    "category": "calculation",
    "output": {
      "action": "min",
      "column": "satış",
      "reply": "✓ En az satan bulundu",
      "changes": []
    }
  },
  {
    "user_command": "en yüksek 5 değeri göster",
    "logic": "show top 5 highest values",
    "category": "calculation",
    "output": {
      "action": "top_n",
      "n": 5,
      "reply": "✓ En yüksek 5 değer gösterildi",
      "changes": []
    }
  },
  {
    "user_command": "en çok satan 5 ürünü listele",
    "logic": "list top 5 best selling products",
    "category": "calculation",
    "output": {
      "action": "top_n",
      "column": "satış",
      "n": 5,
      "reply": "✓ En çok satan 5 ürün listelendi",
      "changes": []
    }
  },
  {
    "user_command": "ilk 10 kaydı listele",
    "logic": "list first top 10 records",
    "category": "calculation",
    "output": {
      "action": "top_n",
      "n": 10,
      "reply": "✓ İlk 10 kayıt listelendi",
      "changes": []
    }
  },
  {
    "user_command": "en yüksek maaş ne kadar",
    "logic": "highest maximum salary",
    "category": "calculation",
    "output": {
      "action": "max",
      "column": "maaş",
      "reply": "✓ En yüksek maaş bulundu",
      "changes": []
    }
  },
  {
    "user_command": "en düşük stok hangisi",
    "logic": "lowest minimum stock",
    "category": "calculation",
    "output": {
      "action": "min",
      "column": "stok",
      "reply": "✓ En düşük stok bulundu",
      "changes": []
    }
  },
  {
    "user_command": "rekor satışı bul",
    "logic": "find record maximum sales",
    "category": "calculation",
    "output": {
      "action": "max",
      "column": "satış",
      "reply": "✓ Rekor satış bulundu",
      "changes": []
    }
  },
  {
    "user_command": "en uzun süre bekleyen sipariş",
    "logic": "longest waiting oldest order",
    "category": "calculation",
    "output": {
      "action": "min",
      "column": "tarih",
      "reply": "✓ En uzun bekleyen sipariş bulundu",
      "changes": []
    }
  },
  {
    "user_command": "en yüksek gider kalemi",
    "logic": "highest expense item",
    "category": "calculation",
    "output": {
      "action": "max",
      "column": "gider",
      "reply": "✓ En yüksek gider bulundu",
      "changes": []
    }
  },
  {
    "user_command": "kaç kayıt var",
    "logic": "count total records rows",
    "category": "calculation",
    "output": {
      "action": "count",
      "reply": "✓ Kayıt sayısı hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "satır sayısını say",
    "logic": "count number of rows",
    "category": "calculation",
    "output": {
      "action": "count",
      "reply": "✓ Satır sayısı sayıldı",
      "changes": []
    }
  },
  {
    "user_command": "kaç tane",
    "logic": "how many count items",
    "category": "calculation",
    "output": {
      "action": "count",
      "reply": "✓ Toplam kayıt sayısı bulundu",
      "changes": []
    }
  },
  {
    "user_command": "istanbul kaç tane",
    "logic": "count rows containing istanbul",
    "category": "calculation",
    "output": {
      "action": "count_if",
      "condition": "contains",
      "value": "istanbul",
      "reply": "✓ İstanbul içeren kayıtlar sayıldı",
      "changes": []
    }
  },
  {
    "user_command": "100den büyük kaç satır var",
    "logic": "count rows greater than 100",
    "category": "calculation",
    "output": {
      "action": "count_if",
      "condition": "value > 100",
      "reply": "✓ 100'den büyük satırlar sayıldı",
      "changes": []
    }
  },
  {
    "user_command": "boş hücre sayısı",
    "logic": "count empty blank cells",
    "category": "calculation",
    "output": {
      "action": "count_blank",
      "reply": "✓ Boş hücreler sayıldı",
      "changes": []
    }
  },
  {
    "user_command": "aktif müşteri sayısı",
    "logic": "count active customers",
    "category": "calculation",
    "output": {
      "action": "count_if",
      "condition": "contains",
      "value": "aktif",
      "reply": "✓ Aktif müşteriler sayıldı",
      "changes": []
    }
  },
  {
    "user_command": "kaç farklı kategori var",
    "logic": "count unique distinct categories",
    "category": "calculation",
    "output": {
      "action": "count_unique",
      "reply": "✓ Benzersiz kategoriler sayıldı",
      "changes": []
    }
  },
  {
    "user_command": "negatif değer sayısı",
    "logic": "count negative values",
    "category": "calculation",
    "output": {
      "action": "count_if",
      "condition": "value < 0",
      "reply": "✓ Negatif değerler sayıldı",
      "changes": []
    }
  },
  {
    "user_command": "toplam ürün çeşidi",
    "logic": "count distinct product types",
    "category": "calculation",
    "output": {
      "action": "count_unique",
      "column": "ürün",
      "reply": "✓ Ürün çeşidi sayıldı",
      "changes": []
    }
  },
  {
    "user_command": "bu ay kaç sipariş geldi",
    "logic": "count orders this month",
    "category": "calculation",
    "output": {
      "action": "count_if",
      "condition": "currentMonth",
      "reply": "✓ Bu ayki sipariş sayısı hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "teslim edilmeyen sipariş sayısı",
    "logic": "count undelivered orders",
    "category": "calculation",
    "output": {
      "action": "count_if",
      "condition": "contains",
      "value": "bekliyor",
      "reply": "✓ Teslim edilmeyen siparişler sayıldı",
      "changes": []
    }
  },
  {
    "user_command": "boş satırları sil",
    "logic": "delete empty rows",
    "category": "cleaning",
    "output": {
      "action": "delete_rows",
      "condition": "empty",
      "reply": "✓ Boş satırlar silindi",
      "changes": []
    }
  },
  {
    "user_command": "boşları temizle",
    "logic": "clean remove blank rows",
    "category": "cleaning",
    "output": {
      "action": "delete_rows",
      "condition": "empty",
      "reply": "✓ Boş satırlar temizlendi",
      "changes": []
    }
  },
  {
    "user_command": "boş olanları kaldır",
    "logic": "remove empty rows",
    "category": "cleaning",
    "output": {
      "action": "delete_rows",
      "condition": "empty",
      "reply": "✓ Boş satırlar kaldırıldı",
      "changes": []
    }
  },
  {
    "user_command": "dolu satırları bırak boşları sil",
    "logic": "keep non-empty delete empty rows",
    "category": "cleaning",
    "output": {
      "action": "delete_rows",
      "condition": "empty",
      "reply": "✓ Boş satırlar temizlendi",
      "changes": []
    }
  },
  {
    "user_command": "veri olmayan satırları kaldır",
    "logic": "remove rows without data",
    "category": "cleaning",
    "output": {
      "action": "delete_rows",
      "condition": "empty",
      "reply": "✓ Veri olmayan satırlar kaldırıldı",
      "changes": []
    }
  },
  {
    "user_command": "sıfır olan satırları sil",
    "logic": "delete rows with zero value",
    "category": "cleaning",
    "output": {
      "action": "delete_rows",
      "condition": "value == 0",
      "reply": "✓ Sıfır değerli satırlar silindi",
      "changes": []
    }
  },
  {
    "user_command": "negatif satırları kaldır",
    "logic": "remove rows with negative values",
    "category": "cleaning",
    "output": {
      "action": "delete_rows",
      "condition": "value < 0",
      "reply": "✓ Negatif satırlar kaldırıldı",
      "changes": []
    }
  },
  {
    "user_command": "0 değerli satırları temizle",
    "logic": "clean rows with zero value",
    "category": "cleaning",
    "output": {
      "action": "delete_rows",
      "condition": "value == 0",
      "reply": "✓ Sıfır değerli satırlar temizlendi",
      "changes": []
    }
  },
  {
    "user_command": "iptal edilen siparişleri sil",
    "logic": "delete cancelled orders",
    "category": "cleaning",
    "output": {
      "action": "delete_rows",
      "condition": "contains_iptal",
      "reply": "✓ İptal edilen siparişler silindi",
      "changes": []
    }
  },
  {
    "user_command": "pasif kayıtları sil",
    "logic": "delete inactive passive records",
    "category": "cleaning",
    "output": {
      "action": "delete_rows",
      "condition": "contains_pasif",
      "reply": "✓ Pasif kayıtlar silindi",
      "changes": []
    }
  },
  {
    "user_command": "test verilerini sil",
    "logic": "delete test data rows",
    "category": "cleaning",
    "output": {
      "action": "delete_rows",
      "condition": "contains_test",
      "reply": "✓ Test verileri silindi",
      "changes": []
    }
  },
  {
    "user_command": "stok sıfır olanları kaldır",
    "logic": "remove zero stock items",
    "category": "cleaning",
    "output": {
      "action": "delete_rows",
      "condition": "value == 0",
      "reply": "✓ Stok sıfır olan satırlar kaldırıldı",
      "changes": []
    }
  },
  {
    "user_command": "geçmiş tarihli kayıtları kaldır",
    "logic": "remove past date records",
    "category": "cleaning",
    "output": {
      "action": "delete_rows",
      "condition": "past_date",
      "reply": "✓ Geçmiş tarihli kayıtlar kaldırıldı",
      "changes": []
    }
  },
  {
    "user_command": "hatalı satırları kaldır",
    "logic": "remove error rows",
    "category": "cleaning",
    "output": {
      "action": "delete_rows",
      "condition": "error",
      "reply": "✓ Hatalı satırlar kaldırıldı",
      "changes": []
    }
  },
  {
    "user_command": "boş ad soyad olanları sil",
    "logic": "delete rows with empty name",
    "category": "cleaning",
    "output": {
      "action": "delete_rows",
      "condition": "empty_name",
      "reply": "✓ Boş ad soyad olan satırlar silindi",
      "changes": []
    }
  },
  {
    "user_command": "silinmiş olanları kaldır",
    "logic": "remove deleted marked rows",
    "category": "cleaning",
    "output": {
      "action": "delete_rows",
      "condition": "contains_silindi",
      "reply": "✓ Silindi işaretli kayıtlar kaldırıldı",
      "changes": []
    }
  },
  {
    "user_command": "seçili satırı sil",
    "logic": "delete selected current row",
    "category": "cleaning",
    "output": {
      "action": "delete_rows",
      "condition": "selected",
      "reply": "✓ Satır silindi",
      "changes": []
    }
  },
  {
    "user_command": "bütçe aşan satırları sil",
    "logic": "delete over budget rows",
    "category": "cleaning",
    "output": {
      "action": "delete_rows",
      "condition": "over_budget",
      "reply": "✓ Bütçe aşan satırlar silindi",
      "changes": []
    }
  },
  {
    "user_command": "tarih girilmemiş olanları sil",
    "logic": "delete rows without date",
    "category": "cleaning",
    "output": {
      "action": "delete_rows",
      "condition": "empty_date",
      "reply": "✓ Tarih girilmemiş satırlar silindi",
      "changes": []
    }
  },
  {
    "user_command": "fiyatsız ürünleri kaldır",
    "logic": "remove products without price",
    "category": "cleaning",
    "output": {
      "action": "delete_rows",
      "condition": "empty_price",
      "reply": "✓ Fiyatsız ürünler kaldırıldı",
      "changes": []
    }
  },
  {
    "user_command": "tekrar edenleri sil",
    "logic": "remove duplicate rows",
    "category": "cleaning",
    "output": {
      "action": "remove_duplicates",
      "reply": "✓ Tekrarlanan satırlar silindi",
      "changes": []
    }
  },
  {
    "user_command": "mükerrerleri kaldır",
    "logic": "remove repeated duplicate records",
    "category": "cleaning",
    "output": {
      "action": "remove_duplicates",
      "reply": "✓ Mükerrer kayıtlar kaldırıldı",
      "changes": []
    }
  },
  {
    "user_command": "aynı olanları temizle",
    "logic": "clean identical duplicate entries",
    "category": "cleaning",
    "output": {
      "action": "remove_duplicates",
      "reply": "✓ Tekrarlar temizlendi",
      "changes": []
    }
  },
  {
    "user_command": "kopya kayıtları sil",
    "logic": "delete copy duplicate records",
    "category": "cleaning",
    "output": {
      "action": "remove_duplicates",
      "reply": "✓ Kopya kayıtlar silindi",
      "changes": []
    }
  },
  {
    "user_command": "benzersiz kayıtları bırak",
    "logic": "keep only unique distinct records",
    "category": "cleaning",
    "output": {
      "action": "remove_duplicates",
      "reply": "✓ Tekrar eden kayıtlar kaldırıldı",
      "changes": []
    }
  },
  {
    "user_command": "duplicate kaldır",
    "logic": "remove duplicate entries",
    "category": "cleaning",
    "output": {
      "action": "remove_duplicates",
      "reply": "✓ Duplicate kayıtlar kaldırıldı",
      "changes": []
    }
  },
  {
    "user_command": "tekrarlı müşterileri temizle",
    "logic": "clean duplicate customer entries",
    "category": "cleaning",
    "output": {
      "action": "remove_duplicates",
      "reply": "✓ Tekrarlı müşteriler temizlendi",
      "changes": []
    }
  },
  {
    "user_command": "çift kayıtları sil",
    "logic": "delete double duplicate records",
    "category": "cleaning",
    "output": {
      "action": "remove_duplicates",
      "reply": "✓ Çift kayıtlar silindi",
      "changes": []
    }
  },
  {
    "user_command": "aynı TC kimlikli olanları kaldır",
    "logic": "remove same ID number duplicates",
    "category": "cleaning",
    "output": {
      "action": "remove_duplicates",
      "reply": "✓ Aynı TC kimlikli kayıtlar kaldırıldı",
      "changes": []
    }
  },
  {
    "user_command": "tekrar eden ürün kodlarını temizle",
    "logic": "clean duplicate product codes",
    "category": "cleaning",
    "output": {
      "action": "remove_duplicates",
      "reply": "✓ Tekrar eden ürün kodları temizlendi",
      "changes": []
    }
  },
  {
    "user_command": "aynı fatura numaralıları kaldır",
    "logic": "remove duplicate invoice numbers",
    "category": "cleaning",
    "output": {
      "action": "remove_duplicates",
      "reply": "✓ Aynı fatura numaralılar kaldırıldı",
      "changes": []
    }
  },
  {
    "user_command": "tekrarlı e-postaları sil",
    "logic": "delete duplicate email addresses",
    "category": "cleaning",
    "output": {
      "action": "remove_duplicates",
      "reply": "✓ Tekrarlı e-postalar silindi",
      "changes": []
    }
  },
  {
    "user_command": "negatifleri kırmızıya boya",
    "logic": "highlight negative values red",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "value < 0",
      "color": "#fecaca",
      "reply": "✓ Negatif değerler kırmızıya boyandı",
      "changes": []
    }
  },
  {
    "user_command": "eksileri kırmızı yap",
    "logic": "make minus negative values red",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "value < 0",
      "color": "#fecaca",
      "reply": "✓ Eksi değerler kırmızıya boyandı",
      "changes": []
    }
  },
  {
    "user_command": "sıfırdan küçük olanları kırmızıya boya",
    "logic": "color below zero cells red",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "value < 0",
      "color": "#fecaca",
      "reply": "✓ Negatif hücreler boyandı",
      "changes": []
    }
  },
  {
    "user_command": "zararda olanları kırmızı işaretle",
    "logic": "mark loss negative red",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "value < 0",
      "color": "#fecaca",
      "reply": "✓ Zararda olanlar kırmızıya boyandı",
      "changes": []
    }
  },
  {
    "user_command": "eksi bakiye olanları kırmızı yap",
    "logic": "negative balance cells red",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "value < 0",
      "color": "#fecaca",
      "reply": "✓ Eksi bakiyeler kırmızıya boyandı",
      "changes": []
    }
  },
  {
    "user_command": "borcunu ödemeyenleri kırmızıya boya",
    "logic": "mark unpaid debt red",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "unpaid",
      "color": "#fecaca",
      "reply": "✓ Ödenmeyenler kırmızıya boyandı",
      "changes": []
    }
  },
  {
    "user_command": "pozitif değerleri yeşile boya",
    "logic": "highlight positive values green",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "value > 0",
      "color": "#bbf7d0",
      "reply": "✓ Pozitif değerler yeşile boyandı",
      "changes": []
    }
  },
  {
    "user_command": "artıları yeşil yap",
    "logic": "make positive plus values green",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "value > 0",
      "color": "#bbf7d0",
      "reply": "✓ Artı değerler yeşile boyandı",
      "changes": []
    }
  },
  {
    "user_command": "karda olanları yeşil yap",
    "logic": "profit positive green",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "value > 0",
      "color": "#bbf7d0",
      "reply": "✓ Karda olanlar yeşile boyandı",
      "changes": []
    }
  },
  {
    "user_command": "hedefi geçenleri yeşile boya",
    "logic": "above target green highlight",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "value > 0",
      "color": "#bbf7d0",
      "reply": "✓ Hedefi geçenler yeşile boyandı",
      "changes": []
    }
  },
  {
    "user_command": "ödenen faturaları yeşil yap",
    "logic": "paid invoices green",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "paid",
      "color": "#bbf7d0",
      "reply": "✓ Ödenen faturalar yeşile boyandı",
      "changes": []
    }
  },
  {
    "user_command": "en büyük 5 değeri sarıya boya",
    "logic": "top 5 highest yellow",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "top5",
      "color": "#fef08a",
      "reply": "✓ En büyük 5 değer sarıya boyandı",
      "changes": []
    }
  },
  {
    "user_command": "en yüksek 3 değeri vurgula",
    "logic": "highlight top 3 highest",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "top3",
      "color": "#fef08a",
      "reply": "✓ En yüksek 3 değer vurgulandı",
      "changes": []
    }
  },
  {
    "user_command": "en büyük 10 değeri işaretle",
    "logic": "mark top 10 largest",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "top10",
      "color": "#fef08a",
      "reply": "✓ En büyük 10 değer işaretlendi",
      "changes": []
    }
  },
  {
    "user_command": "100den büyükleri maviye boya",
    "logic": "blue highlight above 100",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "value > 100",
      "color": "#bfdbfe",
      "reply": "✓ 100'den büyük değerler maviye boyandı",
      "changes": []
    }
  },
  {
    "user_command": "500den az olanları sarıya boya",
    "logic": "yellow below 500",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "value < 500",
      "color": "#fef08a",
      "reply": "✓ 500'den az değerler sarıya boyandı",
      "changes": []
    }
  },
  {
    "user_command": "kritik stokları kırmızıya boya",
    "logic": "critical low stock red",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "value < 10",
      "color": "#fecaca",
      "reply": "✓ Kritik stoklar kırmızıya boyandı",
      "changes": []
    }
  },
  {
    "user_command": "gecikmiş ödemeleri vurgula",
    "logic": "overdue payments highlight",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "overdue",
      "color": "#fecaca",
      "reply": "✓ Gecikmiş ödemeler vurgulandı",
      "changes": []
    }
  },
  {
    "user_command": "vadeyi geçenleri turuncu yap",
    "logic": "past due orange highlight",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "overdue",
      "color": "#fed7aa",
      "reply": "✓ Vadeyi geçenler turuncuya boyandı",
      "changes": []
    }
  },
  {
    "user_command": "1000den fazla olanları sarıya boya",
    "logic": "yellow above 1000",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "value > 1000",
      "color": "#fef08a",
      "reply": "✓ 1000'den fazla değerler sarıya boyandı",
      "changes": []
    }
  },
  {
    "user_command": "sıfır stokları kırmızıya boya",
    "logic": "zero stock red highlight",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "value == 0",
      "color": "#fecaca",
      "reply": "✓ Sıfır stoklar kırmızıya boyandı",
      "changes": []
    }
  },
  {
    "user_command": "satış hedefini tutturanları yeşil yap",
    "logic": "target met green highlight",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "target_met",
      "color": "#bbf7d0",
      "reply": "✓ Hedef tutturanlar yeşile boyandı",
      "changes": []
    }
  },
  {
    "user_command": "bütçe aşımlarını işaretle",
    "logic": "over budget mark highlight",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "over_budget",
      "color": "#fecaca",
      "reply": "✓ Bütçe aşımları işaretlendi",
      "changes": []
    }
  },
  {
    "user_command": "ısıl harita yap",
    "logic": "heatmap color scale apply",
    "category": "highlighting",
    "output": {
      "action": "heatmap",
      "reply": "📊 Isıl harita uygulandı",
      "changes": []
    }
  },
  {
    "user_command": "heatmap uygula",
    "logic": "apply heatmap color gradient",
    "category": "highlighting",
    "output": {
      "action": "heatmap",
      "reply": "📊 Heatmap uygulandı",
      "changes": []
    }
  },
  {
    "user_command": "değerlere göre renk skalası uygula",
    "logic": "apply color scale by value",
    "category": "highlighting",
    "output": {
      "action": "heatmap",
      "reply": "📊 Renk skalası uygulandı",
      "changes": []
    }
  },
  {
    "user_command": "renkleri temizle",
    "logic": "remove all cell colors",
    "category": "highlighting",
    "output": {
      "action": "clear_colors",
      "reply": "✓ Tüm renkler temizlendi",
      "changes": []
    }
  },
  {
    "user_command": "boyaları kaldır",
    "logic": "remove background colors",
    "category": "highlighting",
    "output": {
      "action": "clear_colors",
      "reply": "✓ Hücre renkleri kaldırıldı",
      "changes": []
    }
  },
  {
    "user_command": "kdv ekle",
    "logic": "add VAT 20 percent Turkey",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "multiply",
      "factor": 1.2,
      "reply": "✓ %20 KDV eklendi",
      "changes": []
    }
  },
  {
    "user_command": "kdv hesapla",
    "logic": "calculate VAT tax",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "multiply",
      "factor": 1.2,
      "reply": "✓ KDV hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "yüzde yirmi kdv ekle",
    "logic": "add 20 percent VAT",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "multiply",
      "factor": 1.2,
      "reply": "✓ %20 KDV eklendi",
      "changes": []
    }
  },
  {
    "user_command": "fiyatlara kdv ekle",
    "logic": "add VAT to price column",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "multiply",
      "column": "fiyat",
      "factor": 1.2,
      "reply": "✓ Fiyatlara KDV eklendi",
      "changes": []
    }
  },
  {
    "user_command": "kdv dahil fiyatları hesapla",
    "logic": "calculate VAT inclusive prices",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "multiply",
      "factor": 1.2,
      "reply": "✓ KDV dahil fiyatlar hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "%20 kdv ekle",
    "logic": "add 20% VAT",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "multiply",
      "factor": 1.2,
      "reply": "✓ %20 KDV eklendi",
      "changes": []
    }
  },
  {
    "user_command": "kdv hariç fiyat bul",
    "logic": "find price excluding VAT",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "divide",
      "factor": 1.2,
      "reply": "✓ KDV hariç fiyatlar hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "kdv düş",
    "logic": "subtract remove VAT",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "divide",
      "factor": 1.2,
      "reply": "✓ KDV düşüldü",
      "changes": []
    }
  },
  {
    "user_command": "kdv tutarını hesapla",
    "logic": "calculate VAT amount only",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "vat_amount",
      "factor": 0.2,
      "reply": "✓ KDV tutarı hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "kdv tutarını ayrı göster",
    "logic": "separate show VAT amount",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "vat_amount",
      "factor": 0.2,
      "reply": "✓ KDV tutarları ayrıldı",
      "changes": []
    }
  },
  {
    "user_command": "%10 kdv ekle",
    "logic": "add 10 percent VAT",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "multiply",
      "factor": 1.1,
      "reply": "✓ %10 KDV eklendi",
      "changes": []
    }
  },
  {
    "user_command": "%8 kdv hesapla",
    "logic": "calculate 8 percent VAT",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "multiply",
      "factor": 1.08,
      "reply": "✓ %8 KDV hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "damga vergisi hesapla",
    "logic": "calculate stamp tax 0.948 percent",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "stamp_tax",
      "factor": 0.00948,
      "reply": "✓ Damga vergisi hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "stopaj hesapla",
    "logic": "calculate withholding tax",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "withholding_tax",
      "reply": "✓ Stopaj hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "gelir vergisi dilimi hesapla",
    "logic": "calculate income tax bracket Turkey",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "income_tax_bracket",
      "reply": "✓ Gelir vergisi hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "kurumlar vergisi hesapla",
    "logic": "calculate corporate tax 20 percent",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "corporate_tax",
      "factor": 0.2,
      "reply": "✓ Kurumlar vergisi hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "geçici vergi hesapla",
    "logic": "calculate provisional tax quarterly",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "provisional_tax",
      "reply": "✓ Geçici vergi hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "tevkifatlı kdv hesapla",
    "logic": "calculate withholding VAT",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "withholding_vat",
      "reply": "✓ Tevkifatlı KDV hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "vergi matrahını bul",
    "logic": "find tax base amount",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "tax_base",
      "reply": "✓ Vergi matrahı hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "kdv beyanname tutarı",
    "logic": "VAT declaration total amount",
    "category": "finance",
    "output": {
      "action": "sum",
      "column": "kdv",
      "reply": "✓ KDV beyanname tutarı hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "özel tüketim vergisi ekle",
    "logic": "add special consumption tax",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "otv",
      "reply": "✓ ÖTV eklendi",
      "changes": []
    }
  },
  {
    "user_command": "kümülatif vergi matrahı hesapla",
    "logic": "cumulative tax base calculation",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "cumulative_tax_base",
      "reply": "✓ Kümülatif vergi matrahı hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "indirimli kdv hesapla",
    "logic": "calculate reduced VAT rate",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "reduced_vat",
      "reply": "✓ İndirimli KDV hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "yıllık vergi hesapla",
    "logic": "annual tax calculation",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "annual_tax",
      "reply": "✓ Yıllık vergi hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "net maaş hesapla",
    "logic": "calculate net salary after deductions",
    "category": "hr",
    "output": {
      "action": "update_cells",
      "formula": "net_salary",
      "reply": "✓ Net maaşlar hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "net ücret hesapla",
    "logic": "calculate net wage",
    "category": "hr",
    "output": {
      "action": "update_cells",
      "formula": "net_salary",
      "reply": "✓ Net ücretler hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "sgk kesintisini hesapla",
    "logic": "calculate SGK social security deduction Turkey",
    "category": "hr",
    "output": {
      "action": "update_cells",
      "formula": "sgk_deduction",
      "reply": "✓ SGK kesintileri hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "sgk primi düş",
    "logic": "subtract SGK premium",
    "category": "hr",
    "output": {
      "action": "update_cells",
      "formula": "sgk_deduction",
      "reply": "✓ SGK primi düşüldü",
      "changes": []
    }
  },
  {
    "user_command": "işveren sgk payı hesapla",
    "logic": "employer SGK contribution",
    "category": "hr",
    "output": {
      "action": "update_cells",
      "formula": "employer_sgk",
      "reply": "✓ İşveren SGK payı hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "gelir vergisi hesapla",
    "logic": "calculate income tax withholding",
    "category": "hr",
    "output": {
      "action": "update_cells",
      "formula": "income_tax",
      "reply": "✓ Gelir vergisi hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "kıdem tazminatı hesapla",
    "logic": "calculate severance pay Turkey",
    "category": "hr",
    "output": {
      "action": "update_cells",
      "formula": "severance_pay",
      "reply": "✓ Kıdem tazminatı hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "ihbar tazminatı hesapla",
    "logic": "calculate notice pay Turkey",
    "category": "hr",
    "output": {
      "action": "update_cells",
      "formula": "notice_pay",
      "reply": "✓ İhbar tazminatı hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "ikramiye ekle",
    "logic": "add bonus payment",
    "category": "hr",
    "output": {
      "action": "update_cells",
      "formula": "add_bonus",
      "reply": "✓ İkramiye eklendi",
      "changes": []
    }
  },
  {
    "user_command": "brütten nete çevir",
    "logic": "convert gross to net salary",
    "category": "hr",
    "output": {
      "action": "update_cells",
      "formula": "gross_to_net",
      "reply": "✓ Brütten nete çevrildi",
      "changes": []
    }
  },
  {
    "user_command": "asgari ücret farkı hesapla",
    "logic": "minimum wage difference calculation",
    "category": "hr",
    "output": {
      "action": "update_cells",
      "formula": "min_wage_diff",
      "reply": "✓ Asgari ücret farkı hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "yıllık izin ücreti hesapla",
    "logic": "annual leave pay calculation",
    "category": "hr",
    "output": {
      "action": "update_cells",
      "formula": "vacation_pay",
      "reply": "✓ Yıllık izin ücreti hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "fazla mesai ücreti hesapla",
    "logic": "overtime pay calculation",
    "category": "hr",
    "output": {
      "action": "update_cells",
      "formula": "overtime_pay",
      "reply": "✓ Fazla mesai ücreti hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "prim hesapla",
    "logic": "calculate commission bonus premium",
    "category": "hr",
    "output": {
      "action": "update_cells",
      "formula": "commission",
      "reply": "✓ Prim hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "brüt maaş hesapla",
    "logic": "calculate gross salary",
    "category": "hr",
    "output": {
      "action": "update_cells",
      "formula": "gross_salary",
      "reply": "✓ Brüt maaş hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "işsizlik sigortası hesapla",
    "logic": "unemployment insurance Turkey",
    "category": "hr",
    "output": {
      "action": "update_cells",
      "formula": "unemployment_insurance",
      "reply": "✓ İşsizlik sigortası hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "asgari geçim indirimi hesapla",
    "logic": "minimum living allowance AGI Turkey",
    "category": "hr",
    "output": {
      "action": "update_cells",
      "formula": "minimum_living_allowance",
      "reply": "✓ AGİ hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "maaş bordrosu oluştur",
    "logic": "create payroll report",
    "category": "hr",
    "output": {
      "action": "message",
      "formula": "payroll_report",
      "reply": "📊 Maaş bordrosu hazırlandı",
      "changes": []
    }
  },
  {
    "user_command": "toplu maaş artışı uygula",
    "logic": "apply bulk salary increase",
    "category": "hr",
    "output": {
      "action": "update_cells",
      "formula": "multiply",
      "reply": "✓ Toplu maaş artışı uygulandı",
      "changes": []
    }
  },
  {
    "user_command": "net ödeme tutarı hesapla",
    "logic": "calculate net payment amount",
    "category": "hr",
    "output": {
      "action": "update_cells",
      "formula": "net_payment",
      "reply": "✓ Net ödeme tutarı hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "çalışan başına maliyet hesapla",
    "logic": "cost per employee calculation",
    "category": "hr",
    "output": {
      "action": "update_cells",
      "formula": "employee_cost",
      "reply": "✓ Çalışan başına maliyet hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "bağ kur hesapla",
    "logic": "Bag-Kur self employed insurance Turkey",
    "category": "hr",
    "output": {
      "action": "update_cells",
      "formula": "bagkur",
      "reply": "✓ Bağ-kur hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "yüzde 10 artır",
    "logic": "increase by 10 percent",
    "category": "calculation",
    "output": {
      "action": "update_cells",
      "formula": "multiply",
      "factor": 1.1,
      "reply": "✓ Değerler %10 artırıldı",
      "changes": []
    }
  },
  {
    "user_command": "fiyatları yüzde 20 zammla",
    "logic": "raise price by 20 percent",
    "category": "calculation",
    "output": {
      "action": "update_cells",
      "formula": "multiply",
      "column": "fiyat",
      "factor": 1.2,
      "reply": "✓ Fiyatlar %20 artırıldı",
      "changes": []
    }
  },
  {
    "user_command": "%15 indirim uygula",
    "logic": "apply 15 percent discount",
    "category": "calculation",
    "output": {
      "action": "update_cells",
      "formula": "multiply",
      "factor": 0.85,
      "reply": "✓ %15 indirim uygulandı",
      "changes": []
    }
  },
  {
    "user_command": "yüzde 5 düşür",
    "logic": "decrease by 5 percent",
    "category": "calculation",
    "output": {
      "action": "update_cells",
      "formula": "multiply",
      "factor": 0.95,
      "reply": "✓ Değerler %5 düşürüldü",
      "changes": []
    }
  },
  {
    "user_command": "b sütununu 2 ile çarp",
    "logic": "multiply column B by 2",
    "category": "calculation",
    "output": {
      "action": "update_cells",
      "formula": "multiply",
      "column": "B",
      "factor": 2,
      "reply": "✓ B sütunu 2 ile çarpıldı",
      "changes": []
    }
  },
  {
    "user_command": "fiyatları 1.5 ile çarp",
    "logic": "multiply prices by 1.5",
    "category": "calculation",
    "output": {
      "action": "update_cells",
      "formula": "multiply",
      "column": "fiyat",
      "factor": 1.5,
      "reply": "✓ Fiyatlar 1.5 ile çarpıldı",
      "changes": []
    }
  },
  {
    "user_command": "değerleri 100e böl",
    "logic": "divide values by 100",
    "category": "calculation",
    "output": {
      "action": "update_cells",
      "formula": "divide",
      "factor": 100,
      "reply": "✓ Değerler 100'e bölündü",
      "changes": []
    }
  },
  {
    "user_command": "yüzde değişimini hesapla",
    "logic": "calculate percent change",
    "category": "calculation",
    "output": {
      "action": "update_cells",
      "formula": "percent_change",
      "reply": "✓ Yüzde değişim hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "enflasyon farkı ekle",
    "logic": "add inflation adjustment",
    "category": "calculation",
    "output": {
      "action": "update_cells",
      "formula": "inflation_adjustment",
      "reply": "✓ Enflasyon farkı eklendi",
      "changes": []
    }
  },
  {
    "user_command": "dolar kuru ile çarp",
    "logic": "multiply by dollar exchange rate",
    "category": "calculation",
    "output": {
      "action": "update_cells",
      "formula": "multiply_exchange",
      "reply": "✓ Dolar kuru uygulandı",
      "changes": []
    }
  },
  {
    "user_command": "euro fiyatına çevir",
    "logic": "convert to euro price",
    "category": "calculation",
    "output": {
      "action": "update_cells",
      "formula": "currency_convert",
      "reply": "✓ Euro fiyatına çevrildi",
      "changes": []
    }
  },
  {
    "user_command": "fiyat listesine %10 zam yap",
    "logic": "apply 10 percent price increase",
    "category": "calculation",
    "output": {
      "action": "update_cells",
      "formula": "multiply",
      "factor": 1.1,
      "reply": "✓ %10 zam uygulandı",
      "changes": []
    }
  },
  {
    "user_command": "satış komisyonu hesapla",
    "logic": "calculate sales commission",
    "category": "calculation",
    "output": {
      "action": "update_cells",
      "formula": "commission",
      "reply": "✓ Satış komisyonu hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "iskonto uygula",
    "logic": "apply trade discount",
    "category": "calculation",
    "output": {
      "action": "update_cells",
      "formula": "discount",
      "reply": "✓ İskonto uygulandı",
      "changes": []
    }
  },
  {
    "user_command": "net karlılık hesapla",
    "logic": "calculate net profitability",
    "category": "calculation",
    "output": {
      "action": "update_cells",
      "formula": "net_profit",
      "reply": "✓ Net karlılık hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "döviz kuru farkını hesapla",
    "logic": "calculate exchange rate difference",
    "category": "calculation",
    "output": {
      "action": "update_cells",
      "formula": "exchange_rate_diff",
      "reply": "✓ Döviz kuru farkı hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "30 gün vadeli fiyat hesapla",
    "logic": "calculate 30 day deferred price",
    "category": "calculation",
    "output": {
      "action": "update_cells",
      "formula": "deferred_price",
      "reply": "✓ 30 günlük vadeli fiyat hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "aylık taksit hesapla",
    "logic": "calculate monthly installment",
    "category": "calculation",
    "output": {
      "action": "update_cells",
      "formula": "installment",
      "reply": "✓ Aylık taksit hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "istanbul olanları göster",
    "logic": "filter show istanbul rows",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "contains",
      "value": "istanbul",
      "reply": "✓ İstanbul kayıtları filtrelendi",
      "changes": []
    }
  },
  {
    "user_command": "ankara olanları filtrele",
    "logic": "filter ankara rows",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "contains",
      "value": "ankara",
      "reply": "✓ Ankara kayıtları filtrelendi",
      "changes": []
    }
  },
  {
    "user_command": "100 den büyük olanları göster",
    "logic": "filter show greater than 100",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "value > 100",
      "reply": "✓ 100'den büyük değerler filtrelendi",
      "changes": []
    }
  },
  {
    "user_command": "1000den az olanları filtrele",
    "logic": "filter less than 1000",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "value < 1000",
      "reply": "✓ 1000'den az değerler filtrelendi",
      "changes": []
    }
  },
  {
    "user_command": "bu ay olanları göster",
    "logic": "filter current month records",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "currentMonth",
      "reply": "✓ Bu ayın kayıtları gösterildi",
      "changes": []
    }
  },
  {
    "user_command": "son 30 günü göster",
    "logic": "filter last 30 days",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "last30days",
      "reply": "✓ Son 30 günün verileri gösterildi",
      "changes": []
    }
  },
  {
    "user_command": "bu hafta olanları filtrele",
    "logic": "filter this week records",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "thisWeek",
      "reply": "✓ Bu haftanın kayıtları gösterildi",
      "changes": []
    }
  },
  {
    "user_command": "aktif olanları göster",
    "logic": "filter active status rows",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "contains",
      "value": "aktif",
      "reply": "✓ Aktif kayıtlar gösterildi",
      "changes": []
    }
  },
  {
    "user_command": "tamamlananları filtrele",
    "logic": "filter completed done rows",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "contains",
      "value": "tamamlandı",
      "reply": "✓ Tamamlanan kayıtlar filtrelendi",
      "changes": []
    }
  },
  {
    "user_command": "bekleyenleri göster",
    "logic": "filter waiting pending rows",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "contains",
      "value": "bekliyor",
      "reply": "✓ Bekleyen kayıtlar gösterildi",
      "changes": []
    }
  },
  {
    "user_command": "filtreyi kaldır",
    "logic": "remove clear filters",
    "category": "filtering",
    "output": {
      "action": "remove_filter",
      "reply": "✓ Filtre kaldırıldı",
      "changes": []
    }
  },
  {
    "user_command": "tüm veriyi göster",
    "logic": "show all data remove filter",
    "category": "filtering",
    "output": {
      "action": "remove_filter",
      "reply": "✓ Tüm veriler gösterildi",
      "changes": []
    }
  },
  {
    "user_command": "filtreleri sıfırla",
    "logic": "reset all filters",
    "category": "filtering",
    "output": {
      "action": "remove_filter",
      "reply": "✓ Filtreler sıfırlandı",
      "changes": []
    }
  },
  {
    "user_command": "bu yıl olanları göster",
    "logic": "filter current year records",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "currentYear",
      "reply": "✓ Bu yılın kayıtları gösterildi",
      "changes": []
    }
  },
  {
    "user_command": "stok 10dan az olanları göster",
    "logic": "filter low stock below 10",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "value < 10",
      "reply": "✓ Düşük stoklar gösterildi",
      "changes": []
    }
  },
  {
    "user_command": "ödenmemiş faturaları göster",
    "logic": "filter unpaid invoices",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "contains",
      "value": "ödenmedi",
      "reply": "✓ Ödenmemiş faturalar gösterildi",
      "changes": []
    }
  },
  {
    "user_command": "iptal edilmeyenleri listele",
    "logic": "list non-cancelled records",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "not_contains",
      "value": "iptal",
      "reply": "✓ İptal edilmeyenler listelendi",
      "changes": []
    }
  },
  {
    "user_command": "boş olmayanları göster",
    "logic": "show non-empty records",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "not_empty",
      "reply": "✓ Dolu kayıtlar gösterildi",
      "changes": []
    }
  },
  {
    "user_command": "pro planlı kullanıcıları göster",
    "logic": "filter pro plan users",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "contains",
      "value": "pro",
      "reply": "✓ Pro kullanıcılar filtrelendi",
      "changes": []
    }
  },
  {
    "user_command": "son 7 günü filtrele",
    "logic": "filter last 7 days",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "last7days",
      "reply": "✓ Son 7 günün verileri gösterildi",
      "changes": []
    }
  },
  {
    "user_command": "a şehrindeki müşterileri göster",
    "logic": "filter customers by city",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "contains_city",
      "reply": "✓ Şehir bazlı müşteriler filtrelendi",
      "changes": []
    }
  },
  {
    "user_command": "kadın çalışanları filtrele",
    "logic": "filter female employees",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "contains",
      "value": "kadın",
      "reply": "✓ Kadın çalışanlar filtrelendi",
      "changes": []
    }
  },
  {
    "user_command": "büyük harfe çevir",
    "logic": "convert text uppercase",
    "category": "text",
    "output": {
      "action": "transform",
      "transform": "uppercase",
      "reply": "✓ Büyük harfe çevrildi",
      "changes": []
    }
  },
  {
    "user_command": "hepsini büyük harf yap",
    "logic": "all text uppercase capitals",
    "category": "text",
    "output": {
      "action": "transform",
      "transform": "uppercase",
      "reply": "✓ Büyük harf yapıldı",
      "changes": []
    }
  },
  {
    "user_command": "küçük harfe çevir",
    "logic": "convert text lowercase",
    "category": "text",
    "output": {
      "action": "transform",
      "transform": "lowercase",
      "reply": "✓ Küçük harfe çevrildi",
      "changes": []
    }
  },
  {
    "user_command": "tümünü küçük harf yap",
    "logic": "all text lowercase",
    "category": "text",
    "output": {
      "action": "transform",
      "transform": "lowercase",
      "reply": "✓ Küçük harf yapıldı",
      "changes": []
    }
  },
  {
    "user_command": "baş harfleri büyük yap",
    "logic": "capitalize first letter title case",
    "category": "text",
    "output": {
      "action": "transform",
      "transform": "capitalize",
      "reply": "✓ Baş harfler büyük yapıldı",
      "changes": []
    }
  },
  {
    "user_command": "kelimelerin ilk harfini büyüt",
    "logic": "capitalize each word first letter",
    "category": "text",
    "output": {
      "action": "transform",
      "transform": "capitalize",
      "reply": "✓ İlk harfler büyütüldü",
      "changes": []
    }
  },
  {
    "user_command": "boşlukları temizle",
    "logic": "trim remove whitespace",
    "category": "text",
    "output": {
      "action": "transform",
      "transform": "trim",
      "reply": "✓ Boşluklar temizlendi",
      "changes": []
    }
  },
  {
    "user_command": "fazla boşlukları sil",
    "logic": "remove extra spaces",
    "category": "text",
    "output": {
      "action": "transform",
      "transform": "trim",
      "reply": "✓ Fazla boşluklar silindi",
      "changes": []
    }
  },
  {
    "user_command": "metinleri birleştir",
    "logic": "concatenate join text values",
    "category": "text",
    "output": {
      "action": "transform",
      "transform": "concat",
      "reply": "✓ Metinler birleştirildi",
      "changes": []
    }
  },
  {
    "user_command": "ad soyad sütununu ayır",
    "logic": "split name surname columns",
    "category": "text",
    "output": {
      "action": "extract",
      "type": "name_split",
      "reply": "✓ Ad ve Soyad ayrıldı",
      "changes": []
    }
  },
  {
    "user_command": "telefon numaralarını formatla",
    "logic": "format phone numbers",
    "category": "text",
    "output": {
      "action": "clean_data",
      "check": "phones",
      "reply": "✓ Telefon numaraları formatlandı",
      "changes": []
    }
  },
  {
    "user_command": "e-posta adreslerini çıkar",
    "logic": "extract email addresses",
    "category": "text",
    "output": {
      "action": "extract",
      "type": "email",
      "reply": "✓ E-posta adresleri çıkarıldı",
      "changes": []
    }
  },
  {
    "user_command": "tc kimlik numaralarını bul",
    "logic": "find Turkish ID numbers",
    "category": "text",
    "output": {
      "action": "extract",
      "type": "tc_id",
      "reply": "✓ TC kimlik numaraları bulundu",
      "changes": []
    }
  },
  {
    "user_command": "para birimi sembollerini kaldır",
    "logic": "remove currency symbols",
    "category": "text",
    "output": {
      "action": "clean_data",
      "check": "currency",
      "reply": "✓ Para birimi sembolleri kaldırıldı",
      "changes": []
    }
  },
  {
    "user_command": "tarihleri standart formata çevir",
    "logic": "convert dates standard format",
    "category": "text",
    "output": {
      "action": "clean_data",
      "check": "dates",
      "reply": "✓ Tarih formatları standartlaştırıldı",
      "changes": []
    }
  },
  {
    "user_command": "sayıları metinden ayır",
    "logic": "extract numbers from text",
    "category": "text",
    "output": {
      "action": "extract",
      "type": "number",
      "reply": "✓ Sayılar metinden ayrıldı",
      "changes": []
    }
  },
  {
    "user_command": "vergi numaralarını çıkar",
    "logic": "extract tax ID numbers",
    "category": "text",
    "output": {
      "action": "extract",
      "type": "tax_id",
      "reply": "✓ Vergi numaraları çıkarıldı",
      "changes": []
    }
  },
  {
    "user_command": "adreslerden şehri çıkar",
    "logic": "extract city from address",
    "category": "text",
    "output": {
      "action": "extract",
      "type": "city",
      "reply": "✓ Şehirler çıkarıldı",
      "changes": []
    }
  },
  {
    "user_command": "vlookup yap",
    "logic": "VLOOKUP lookup reference formula Excel",
    "category": "formula",
    "output": {
      "action": "generate_formula",
      "formula_type": "vlookup",
      "reply": "✓ VLOOKUP formülü oluşturuldu",
      "changes": []
    }
  },
  {
    "user_command": "vlookup formülü oluştur",
    "logic": "create VLOOKUP DÜŞEYARA formula",
    "category": "formula",
    "output": {
      "action": "generate_formula",
      "formula_type": "vlookup",
      "reply": "✓ DÜŞEYARA formülü hazırlandı",
      "changes": []
    }
  },
  {
    "user_command": "düşeyara formülü hazırla",
    "logic": "prepare DÜŞEYARA VLOOKUP formula Turkish",
    "category": "formula",
    "output": {
      "action": "generate_formula",
      "formula_type": "vlookup",
      "reply": "✓ DÜŞEYARA formülü hazırlandı",
      "changes": []
    }
  },
  {
    "user_command": "eğer formülü uygula",
    "logic": "IF EĞER conditional formula Excel",
    "category": "formula",
    "output": {
      "action": "generate_formula",
      "formula_type": "if",
      "reply": "✓ EĞER formülü oluşturuldu",
      "changes": []
    }
  },
  {
    "user_command": "koşullu topla",
    "logic": "SUMIF conditional sum formula",
    "category": "formula",
    "output": {
      "action": "generate_formula",
      "formula_type": "sumif",
      "reply": "✓ ETOPLA formülü hazırlandı",
      "changes": []
    }
  },
  {
    "user_command": "sumif formülü yaz",
    "logic": "write SUMIF ETOPLA formula",
    "category": "formula",
    "output": {
      "action": "generate_formula",
      "formula_type": "sumif",
      "reply": "✓ SUMIF formülü oluşturuldu",
      "changes": []
    }
  },
  {
    "user_command": "çoketopla formülü oluştur",
    "logic": "SUMIFS multiple criteria sum formula",
    "category": "formula",
    "output": {
      "action": "generate_formula",
      "formula_type": "sumifs",
      "reply": "✓ ÇOKETOPLA formülü oluşturuldu",
      "changes": []
    }
  },
  {
    "user_command": "koşullu say",
    "logic": "COUNTIF conditional count formula",
    "category": "formula",
    "output": {
      "action": "count_if",
      "reply": "✓ Koşullu sayım yapıldı",
      "changes": []
    }
  },
  {
    "user_command": "index match yaz",
    "logic": "INDEX MATCH lookup formula Excel",
    "category": "formula",
    "output": {
      "action": "generate_formula",
      "formula_type": "index_match",
      "reply": "✓ INDEX/MATCH formülü oluşturuldu",
      "changes": []
    }
  },
  {
    "user_command": "bu hesaplama için formül yaz",
    "logic": "create formula for calculation",
    "category": "formula",
    "output": {
      "action": "generate_formula",
      "reply": "✓ Formül oluşturuldu",
      "changes": []
    }
  },
  {
    "user_command": "kümülatif toplam hesapla",
    "logic": "cumulative running total sum",
    "category": "formula",
    "output": {
      "action": "update_cells",
      "formula": "cumulative_sum",
      "reply": "✓ Kümülatif toplam hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "hareketli ortalama hesapla",
    "logic": "moving average calculation",
    "category": "formula",
    "output": {
      "action": "update_cells",
      "formula": "moving_average",
      "reply": "✓ Hareketli ortalama hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "standart sapma hesapla",
    "logic": "standard deviation calculation",
    "category": "formula",
    "output": {
      "action": "message",
      "formula": "std_dev",
      "reply": "📊 Standart sapma hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "medyan bul",
    "logic": "find median middle value",
    "category": "formula",
    "output": {
      "action": "message",
      "formula": "median",
      "reply": "📊 Medyan değer bulundu",
      "changes": []
    }
  },
  {
    "user_command": "yüzdelik dilim hesapla",
    "logic": "percentile rank calculation",
    "category": "formula",
    "output": {
      "action": "message",
      "formula": "percentile",
      "reply": "📊 Yüzde dilim hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "korelasyon hesapla",
    "logic": "correlation coefficient calculation",
    "category": "formula",
    "output": {
      "action": "message",
      "formula": "correlation",
      "reply": "📊 Korelasyon hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "eğer hata formülü",
    "logic": "IFERROR formula handle errors",
    "category": "formula",
    "output": {
      "action": "generate_formula",
      "formula_type": "iferror",
      "reply": "✓ EĞERHATA formülü oluşturuldu",
      "changes": []
    }
  },
  {
    "user_command": "iç içe eğer formülü",
    "logic": "nested IF formula multiple conditions",
    "category": "formula",
    "output": {
      "action": "generate_formula",
      "formula_type": "nested_if",
      "reply": "✓ İç içe EĞER formülü oluşturuldu",
      "changes": []
    }
  },
  {
    "user_command": "metin birleştir formülü",
    "logic": "CONCATENATE text join formula",
    "category": "formula",
    "output": {
      "action": "generate_formula",
      "formula_type": "concatenate",
      "reply": "✓ METİN BİRLEŞTİR formülü oluşturuldu",
      "changes": []
    }
  },
  {
    "user_command": "rank sıralama formülü",
    "logic": "RANK formula ranking",
    "category": "formula",
    "output": {
      "action": "generate_formula",
      "formula_type": "rank",
      "reply": "✓ RANK formülü oluşturuldu",
      "changes": []
    }
  },
  {
    "user_command": "xlookup formülü yaz",
    "logic": "XLOOKUP modern lookup formula",
    "category": "formula",
    "output": {
      "action": "generate_formula",
      "formula_type": "xlookup",
      "reply": "✓ XLOOKUP formülü oluşturuldu",
      "changes": []
    }
  },
  {
    "user_command": "dinamik dizi formülü",
    "logic": "dynamic array spill formula",
    "category": "formula",
    "output": {
      "action": "generate_formula",
      "formula_type": "dynamic_array",
      "reply": "✓ Dinamik dizi formülü oluşturuldu",
      "changes": []
    }
  },
  {
    "user_command": "lambda formülü oluştur",
    "logic": "LAMBDA custom function formula",
    "category": "formula",
    "output": {
      "action": "generate_formula",
      "formula_type": "lambda",
      "reply": "✓ LAMBDA formülü oluşturuldu",
      "changes": []
    }
  },
  {
    "user_command": "let formülü yaz",
    "logic": "LET variable formula Excel",
    "category": "formula",
    "output": {
      "action": "generate_formula",
      "formula_type": "let",
      "reply": "✓ LET formülü oluşturuldu",
      "changes": []
    }
  },
  {
    "user_command": "unique benzersiz değerleri listele",
    "logic": "UNIQUE distinct values list formula",
    "category": "formula",
    "output": {
      "action": "generate_formula",
      "formula_type": "unique",
      "reply": "✓ UNIQUE formülü oluşturuldu",
      "changes": []
    }
  },
  {
    "user_command": "rapor oluştur",
    "logic": "generate data report",
    "category": "analysis",
    "output": {
      "action": "message",
      "formula": "auto_report",
      "reply": "📊 Rapor hazırlandı",
      "changes": []
    }
  },
  {
    "user_command": "aylık rapor yap",
    "logic": "create monthly report",
    "category": "analysis",
    "output": {
      "action": "message",
      "formula": "monthly_report",
      "reply": "📊 Aylık rapor hazırlandı",
      "changes": []
    }
  },
  {
    "user_command": "haftalık rapor oluştur",
    "logic": "create weekly report",
    "category": "analysis",
    "output": {
      "action": "message",
      "formula": "weekly_report",
      "reply": "📊 Haftalık rapor hazırlandı",
      "changes": []
    }
  },
  {
    "user_command": "özet çıkar",
    "logic": "create summary overview",
    "category": "analysis",
    "output": {
      "action": "message",
      "formula": "summary",
      "reply": "📊 Özet rapor oluşturuldu",
      "changes": []
    }
  },
  {
    "user_command": "istatistikleri göster",
    "logic": "show statistics metrics",
    "category": "analysis",
    "output": {
      "action": "message",
      "formula": "statistics",
      "reply": "📊 İstatistikler hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "veri analizi yap",
    "logic": "perform data analysis",
    "category": "analysis",
    "output": {
      "action": "message",
      "formula": "analysis",
      "reply": "📊 Veri analizi tamamlandı",
      "changes": []
    }
  },
  {
    "user_command": "satış raporu hazırla",
    "logic": "prepare sales report",
    "category": "analysis",
    "output": {
      "action": "message",
      "formula": "sales_report",
      "reply": "📊 Satış raporu hazırlandı",
      "changes": []
    }
  },
  {
    "user_command": "bordro raporu oluştur",
    "logic": "create payroll report",
    "category": "analysis",
    "output": {
      "action": "message",
      "formula": "payroll_report",
      "reply": "📊 Bordro raporu hazırlandı",
      "changes": []
    }
  },
  {
    "user_command": "özet tablo yap",
    "logic": "create pivot summary table",
    "category": "analysis",
    "output": {
      "action": "message",
      "formula": "pivot_summary",
      "reply": "📊 Özet tablo oluşturuldu",
      "changes": []
    }
  },
  {
    "user_command": "karşılaştırmalı analiz yap",
    "logic": "comparative analysis report",
    "category": "analysis",
    "output": {
      "action": "message",
      "formula": "comparison",
      "reply": "📊 Karşılaştırmalı analiz tamamlandı",
      "changes": []
    }
  },
  {
    "user_command": "bu ay geçen ayla karşılaştır",
    "logic": "compare current month previous month",
    "category": "analysis",
    "output": {
      "action": "compare",
      "period1": "currentMonth",
      "period2": "lastMonth",
      "reply": "📊 Ay karşılaştırması yapıldı",
      "changes": []
    }
  },
  {
    "user_command": "yıllık büyüme oranı",
    "logic": "annual growth rate calculation",
    "category": "analysis",
    "output": {
      "action": "update_cells",
      "formula": "growth_rate",
      "reply": "✓ Büyüme oranı hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "trend analizi yap",
    "logic": "trend analysis time series",
    "category": "analysis",
    "output": {
      "action": "message",
      "formula": "trend_analysis",
      "reply": "📊 Trend analizi tamamlandı",
      "changes": []
    }
  },
  {
    "user_command": "tahmin hesapla",
    "logic": "forecast prediction calculation",
    "category": "analysis",
    "output": {
      "action": "forecast",
      "reply": "📊 Tahmin hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "gelecek ayı tahmin et",
    "logic": "forecast next month prediction",
    "category": "analysis",
    "output": {
      "action": "forecast",
      "periods": 1,
      "reply": "📊 Gelecek ay tahmini hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "önümüzdeki 3 ayı öngör",
    "logic": "forecast next 3 months",
    "category": "analysis",
    "output": {
      "action": "forecast",
      "periods": 3,
      "reply": "📊 3 aylık tahmin hazırlandı",
      "changes": []
    }
  },
  {
    "user_command": "satış tahmini yap",
    "logic": "sales forecast prediction",
    "category": "analysis",
    "output": {
      "action": "forecast",
      "column": "satış",
      "reply": "📊 Satış tahmini hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "muhasebe raporu oluştur",
    "logic": "accounting financial report",
    "category": "analysis",
    "output": {
      "action": "message",
      "formula": "accounting_report",
      "reply": "📊 Muhasebe raporu hazırlandı",
      "changes": []
    }
  },
  {
    "user_command": "pivot tablo oluştur",
    "logic": "create pivot table",
    "category": "analysis",
    "output": {
      "action": "message",
      "formula": "pivot_table",
      "reply": "📊 Pivot tablo oluşturuldu",
      "changes": []
    }
  },
  {
    "user_command": "anomali tespit et",
    "logic": "anomaly outlier detection",
    "category": "analysis",
    "output": {
      "action": "anomaly_detection",
      "reply": "📊 Anomaliler tespit edildi",
      "changes": []
    }
  },
  {
    "user_command": "şehre göre grupla",
    "logic": "group by city column",
    "category": "analysis",
    "output": {
      "action": "group_by",
      "column": "şehir",
      "reply": "📊 Şehre göre gruplandırıldı",
      "changes": []
    }
  },
  {
    "user_command": "kategoriye göre gruplandır",
    "logic": "group by category",
    "category": "analysis",
    "output": {
      "action": "group_by",
      "column": "kategori",
      "reply": "📊 Kategoriye göre gruplandırıldı",
      "changes": []
    }
  },
  {
    "user_command": "aya göre gruplama yap",
    "logic": "group by month",
    "category": "analysis",
    "output": {
      "action": "group_by",
      "column": "ay",
      "reply": "📊 Aya göre gruplandırıldı",
      "changes": []
    }
  },
  {
    "user_command": "satış ekibine göre grupla",
    "logic": "group by sales team",
    "category": "analysis",
    "output": {
      "action": "group_by",
      "column": "ekip",
      "reply": "📊 Ekibe göre gruplandırıldı",
      "changes": []
    }
  },
  {
    "user_command": "her bölgenin toplamını göster",
    "logic": "sum by region group",
    "category": "analysis",
    "output": {
      "action": "group_by",
      "aggregate": "sum",
      "reply": "📊 Bölge toplamları hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "müşteri başına sipariş sayısı",
    "logic": "count orders per customer",
    "category": "analysis",
    "output": {
      "action": "group_by",
      "aggregate": "count",
      "reply": "📊 Müşteri bazlı sipariş sayıları hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "ürüne göre grupla topla",
    "logic": "group sum by product",
    "category": "analysis",
    "output": {
      "action": "group_by",
      "column": "ürün",
      "aggregate": "sum",
      "reply": "📊 Ürüne göre toplamlar hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "hangi şehirde en çok satış var",
    "logic": "most sales by city group",
    "category": "analysis",
    "output": {
      "action": "group_by",
      "aggregate": "sum",
      "group_column": "şehir",
      "reply": "📊 Şehirlere göre satış analizi yapıldı",
      "changes": []
    }
  },
  {
    "user_command": "departmana göre gider özeti",
    "logic": "expense summary by department",
    "category": "analysis",
    "output": {
      "action": "group_by",
      "column": "departman",
      "aggregate": "sum",
      "reply": "📊 Departman bazlı gider özeti hazırlandı",
      "changes": []
    }
  },
  {
    "user_command": "yıla göre grupla karşılaştır",
    "logic": "group compare by year",
    "category": "analysis",
    "output": {
      "action": "group_by",
      "column": "yıl",
      "aggregate": "sum",
      "reply": "📊 Yıllık karşılaştırma yapıldı",
      "changes": []
    }
  },
  {
    "user_command": "personel bazında maaş özeti",
    "logic": "salary summary per employee",
    "category": "analysis",
    "output": {
      "action": "group_by",
      "column": "personel",
      "aggregate": "sum",
      "reply": "📊 Personel bazlı maaş özeti hazırlandı",
      "changes": []
    }
  },
  {
    "user_command": "ürün kategorisine göre ciro",
    "logic": "revenue by product category",
    "category": "analysis",
    "output": {
      "action": "group_by",
      "column": "kategori",
      "aggregate": "sum",
      "reply": "📊 Kategoriye göre ciro hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "müşteri segmentine göre analiz",
    "logic": "analysis by customer segment",
    "category": "analysis",
    "output": {
      "action": "group_by",
      "column": "segment",
      "reply": "📊 Müşteri segmenti analizi yapıldı",
      "changes": []
    }
  },
  {
    "user_command": "bölge bazlı satış karşılaştırması",
    "logic": "regional sales comparison",
    "category": "analysis",
    "output": {
      "action": "group_by",
      "column": "bölge",
      "aggregate": "sum",
      "reply": "📊 Bölge bazlı satış karşılaştırması yapıldı",
      "changes": []
    }
  },
  {
    "user_command": "kar zarar hesapla",
    "logic": "profit loss calculation",
    "category": "accounting",
    "output": {
      "action": "update_cells",
      "formula": "profit_loss",
      "reply": "✓ Kar/zarar hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "brüt kar marjı hesapla",
    "logic": "gross profit margin calculation",
    "category": "accounting",
    "output": {
      "action": "update_cells",
      "formula": "gross_margin",
      "reply": "✓ Brüt kar marjı hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "nakit akışı hesapla",
    "logic": "cash flow calculation",
    "category": "accounting",
    "output": {
      "action": "message",
      "formula": "cash_flow",
      "reply": "📊 Nakit akışı hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "gider toplamı ne kadar",
    "logic": "total expenses sum",
    "category": "accounting",
    "output": {
      "action": "sum",
      "column": "gider",
      "reply": "✓ Gider toplamı hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "gelir gider dengesi",
    "logic": "income expense balance",
    "category": "accounting",
    "output": {
      "action": "message",
      "formula": "balance",
      "reply": "📊 Gelir gider dengesi gösterildi",
      "changes": []
    }
  },
  {
    "user_command": "stok değeri hesapla",
    "logic": "inventory value calculation",
    "category": "accounting",
    "output": {
      "action": "update_cells",
      "formula": "inventory_value",
      "reply": "✓ Stok değeri hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "amortisman hesapla",
    "logic": "depreciation amortization calculation",
    "category": "accounting",
    "output": {
      "action": "update_cells",
      "formula": "depreciation",
      "reply": "✓ Amortisman hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "faiz hesapla",
    "logic": "interest calculation",
    "category": "accounting",
    "output": {
      "action": "update_cells",
      "formula": "interest",
      "reply": "✓ Faiz hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "bilanço hazırla",
    "logic": "prepare balance sheet",
    "category": "accounting",
    "output": {
      "action": "message",
      "formula": "balance_sheet",
      "reply": "📊 Bilanço hazırlandı",
      "changes": []
    }
  },
  {
    "user_command": "alacak hesapla",
    "logic": "receivables sum calculation",
    "category": "accounting",
    "output": {
      "action": "sum",
      "column": "alacak",
      "reply": "✓ Alacak toplamı hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "borç bakiyesi topla",
    "logic": "total debt balance",
    "category": "accounting",
    "output": {
      "action": "sum",
      "column": "borç",
      "reply": "✓ Borç bakiyesi toplandı",
      "changes": []
    }
  },
  {
    "user_command": "cari hesap özeti",
    "logic": "current account summary",
    "category": "accounting",
    "output": {
      "action": "message",
      "formula": "current_account",
      "reply": "📊 Cari hesap özeti hazırlandı",
      "changes": []
    }
  },
  {
    "user_command": "maliyet analizi yap",
    "logic": "cost analysis calculation",
    "category": "accounting",
    "output": {
      "action": "message",
      "formula": "cost_analysis",
      "reply": "📊 Maliyet analizi tamamlandı",
      "changes": []
    }
  },
  {
    "user_command": "stok devir hızı hesapla",
    "logic": "inventory turnover rate",
    "category": "accounting",
    "output": {
      "action": "update_cells",
      "formula": "inventory_turnover",
      "reply": "✓ Stok devir hızı hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "net işletme sermayesi hesapla",
    "logic": "net working capital calculation",
    "category": "accounting",
    "output": {
      "action": "update_cells",
      "formula": "working_capital",
      "reply": "✓ Net işletme sermayesi hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "özkaynak karlılığı hesapla",
    "logic": "return on equity ROE calculation",
    "category": "accounting",
    "output": {
      "action": "update_cells",
      "formula": "roe",
      "reply": "✓ Özkaynak karlılığı hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "varlık karlılığı hesapla",
    "logic": "return on assets ROA calculation",
    "category": "accounting",
    "output": {
      "action": "update_cells",
      "formula": "roa",
      "reply": "✓ Varlık karlılığı hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "borç ödeme gücü analizi",
    "logic": "debt coverage solvency analysis",
    "category": "accounting",
    "output": {
      "action": "message",
      "formula": "solvency_analysis",
      "reply": "📊 Borç ödeme gücü analizi tamamlandı",
      "changes": []
    }
  },
  {
    "user_command": "veriyi temizle",
    "logic": "clean all data",
    "category": "cleaning",
    "output": {
      "action": "clean_data",
      "check": "all",
      "reply": "✓ Veriler temizlendi",
      "changes": []
    }
  },
  {
    "user_command": "tutarsızlıkları düzelt",
    "logic": "fix data inconsistencies",
    "category": "cleaning",
    "output": {
      "action": "clean_data",
      "check": "inconsistencies",
      "reply": "✓ Tutarsızlıklar düzeltildi",
      "changes": []
    }
  },
  {
    "user_command": "hatalı verileri düzelt",
    "logic": "fix error data",
    "category": "cleaning",
    "output": {
      "action": "clean_data",
      "check": "errors",
      "reply": "✓ Hatalı veriler düzeltildi",
      "changes": []
    }
  },
  {
    "user_command": "büyük küçük harf tutarsızlıklarını gider",
    "logic": "fix case inconsistencies",
    "category": "cleaning",
    "output": {
      "action": "clean_data",
      "check": "case",
      "reply": "✓ Harf tutarsızlıkları giderildi",
      "changes": []
    }
  },
  {
    "user_command": "boş değerleri doldur",
    "logic": "fill empty null values",
    "category": "cleaning",
    "output": {
      "action": "clean_data",
      "check": "fill_empty",
      "reply": "✓ Boş değerler dolduruldu",
      "changes": []
    }
  },
  {
    "user_command": "veriyi standartlaştır",
    "logic": "standardize normalize data",
    "category": "cleaning",
    "output": {
      "action": "clean_data",
      "check": "standardize",
      "reply": "✓ Veriler standartlaştırıldı",
      "changes": []
    }
  },
  {
    "user_command": "sayısal olmayan değerleri bul",
    "logic": "find non-numeric values",
    "category": "cleaning",
    "output": {
      "action": "validate",
      "check": "non_numeric",
      "reply": "✓ Sayısal olmayan veriler bulundu",
      "changes": []
    }
  },
  {
    "user_command": "eksik verileri göster",
    "logic": "show missing null data",
    "category": "cleaning",
    "output": {
      "action": "validate",
      "check": "missing",
      "reply": "✓ Eksik veriler gösterildi",
      "changes": []
    }
  },
  {
    "user_command": "geçersiz verileri işaretle",
    "logic": "mark invalid data cells",
    "category": "cleaning",
    "output": {
      "action": "highlight",
      "condition": "invalid",
      "color": "#fecaca",
      "reply": "✓ Geçersiz veriler işaretlendi",
      "changes": []
    }
  },
  {
    "user_command": "aykırı değerleri bul",
    "logic": "find outlier anomaly values",
    "category": "cleaning",
    "output": {
      "action": "anomaly_detection",
      "reply": "📊 Aykırı değerler bulundu",
      "changes": []
    }
  },
  {
    "user_command": "outlier tespit et",
    "logic": "detect statistical outliers",
    "category": "cleaning",
    "output": {
      "action": "anomaly_detection",
      "reply": "📊 Outlier değerler tespit edildi",
      "changes": []
    }
  },
  {
    "user_command": "veri kalitesini kontrol et",
    "logic": "check data quality validation",
    "category": "cleaning",
    "output": {
      "action": "validate",
      "check": "all",
      "reply": "✓ Veri kalitesi kontrol edildi",
      "changes": []
    }
  },
  {
    "user_command": "format hatalarını düzelt",
    "logic": "fix formatting errors",
    "category": "cleaning",
    "output": {
      "action": "clean_data",
      "check": "format",
      "reply": "✓ Format hataları düzeltildi",
      "changes": []
    }
  },
  {
    "user_command": "gereksiz karakterleri kaldır",
    "logic": "remove unnecessary special characters",
    "category": "cleaning",
    "output": {
      "action": "clean_data",
      "check": "special_chars",
      "reply": "✓ Gereksiz karakterler kaldırıldı",
      "changes": []
    }
  },
  {
    "user_command": "yinelenen başlıkları düzelt",
    "logic": "fix duplicate column headers",
    "category": "cleaning",
    "output": {
      "action": "clean_data",
      "check": "headers",
      "reply": "✓ Başlık tutarsızlıkları düzeltildi",
      "changes": []
    }
  },
  {
    "user_command": "negatif değer kontrolü yap",
    "logic": "validate check negative values",
    "category": "cleaning",
    "output": {
      "action": "validate",
      "check": "negative",
      "reply": "✓ Negatif değerler kontrol edildi",
      "changes": []
    }
  },
  {
    "user_command": "duygu analizi yap",
    "logic": "sentiment analysis text",
    "category": "ai",
    "output": {
      "action": "sentiment_analysis",
      "reply": "📊 Duygu analizi yapıldı",
      "changes": []
    }
  },
  {
    "user_command": "yorum duygularını analiz et",
    "logic": "analyze comment sentiments",
    "category": "ai",
    "output": {
      "action": "sentiment_analysis",
      "reply": "📊 Yorumların duygu analizi tamamlandı",
      "changes": []
    }
  },
  {
    "user_command": "müşteri geri bildirimlerini analiz et",
    "logic": "analyze customer feedback sentiment",
    "category": "ai",
    "output": {
      "action": "sentiment_analysis",
      "reply": "📊 Müşteri geri bildirimleri analiz edildi",
      "changes": []
    }
  },
  {
    "user_command": "olumlu mu olumsuz mu sınıfla",
    "logic": "classify positive negative neutral",
    "category": "ai",
    "output": {
      "action": "sentiment_analysis",
      "reply": "📊 Pozitif/Negatif/Nötr sınıflandırması yapıldı",
      "changes": []
    }
  },
  {
    "user_command": "şikayetleri analiz et",
    "logic": "analyze complaints feedback",
    "category": "ai",
    "output": {
      "action": "sentiment_analysis",
      "reply": "📊 Şikayetler analiz edildi",
      "changes": []
    }
  },
  {
    "user_command": "kategorilere ayır",
    "logic": "classify categorize data",
    "category": "ai",
    "output": {
      "action": "classify",
      "reply": "📊 Veriler kategorilere ayrıldı",
      "changes": []
    }
  },
  {
    "user_command": "giderleri personel kira araç olarak sınıfla",
    "logic": "classify expenses personnel rent vehicle",
    "category": "ai",
    "output": {
      "action": "classify",
      "categories": [
        "Personel",
        "Kira",
        "Araç"
      ],
      "reply": "📊 Giderler kategorilendi",
      "changes": []
    }
  },
  {
    "user_command": "müşterileri segmentlere ayır",
    "logic": "segment customers groups",
    "category": "ai",
    "output": {
      "action": "classify",
      "column": "müşteri",
      "reply": "📊 Müşteri segmentasyonu yapıldı",
      "changes": []
    }
  },
  {
    "user_command": "öncelik düzeyi belirle yüksek orta düşük",
    "logic": "classify priority high medium low",
    "category": "ai",
    "output": {
      "action": "classify",
      "categories": [
        "Yüksek",
        "Orta",
        "Düşük"
      ],
      "reply": "📊 Öncelik seviyeleri belirlendi",
      "changes": []
    }
  },
  {
    "user_command": "her satır için özet yaz",
    "logic": "write summary for each row",
    "category": "ai",
    "output": {
      "action": "batch_ai",
      "task": "summarize",
      "reply": "📊 Her satır için özet oluşturuldu",
      "changes": []
    }
  },
  {
    "user_command": "ürün açıklamaları yaz",
    "logic": "generate product descriptions",
    "category": "ai",
    "output": {
      "action": "batch_ai",
      "task": "generate_description",
      "reply": "✓ Ürün açıklamaları oluşturuldu",
      "changes": []
    }
  },
  {
    "user_command": "anahtar kelimeleri çıkar",
    "logic": "extract keywords from text",
    "category": "ai",
    "output": {
      "action": "batch_ai",
      "task": "extract_keywords",
      "reply": "✓ Anahtar kelimeler çıkarıldı",
      "changes": []
    }
  },
  {
    "user_command": "excel olarak indir",
    "logic": "download export as Excel xlsx",
    "category": "export",
    "output": {
      "action": "export",
      "format": "xlsx",
      "reply": "✓ Excel dosyası hazırlandı",
      "changes": []
    }
  },
  {
    "user_command": "csv indir",
    "logic": "download export as CSV",
    "category": "export",
    "output": {
      "action": "export",
      "format": "csv",
      "reply": "✓ CSV dosyası indiriliyor",
      "changes": []
    }
  },
  {
    "user_command": "google sheets'e aktar",
    "logic": "export to Google Sheets",
    "category": "export",
    "output": {
      "action": "export",
      "target": "google_sheets",
      "reply": "✓ Google Sheets'e aktarıldı",
      "changes": []
    }
  },
  {
    "user_command": "notion'a gönder",
    "logic": "send export to Notion",
    "category": "export",
    "output": {
      "action": "export",
      "target": "notion",
      "reply": "✓ Notion'a gönderildi",
      "changes": []
    }
  },
  {
    "user_command": "dosyayı kaydet",
    "logic": "save file export",
    "category": "export",
    "output": {
      "action": "export",
      "format": "xlsx",
      "reply": "✓ Dosya kaydedildi",
      "changes": []
    }
  },
  {
    "user_command": "slack'e gönder",
    "logic": "send to Slack channel",
    "category": "export",
    "output": {
      "action": "export",
      "target": "slack",
      "reply": "✓ Slack'e gönderildi",
      "changes": []
    }
  },
  {
    "user_command": "pdf olarak aktar",
    "logic": "export as PDF",
    "category": "export",
    "output": {
      "action": "export",
      "format": "pdf",
      "reply": "✓ PDF hazırlandı",
      "changes": []
    }
  },
  {
    "user_command": "zapier webhook tetikle",
    "logic": "trigger Zapier webhook",
    "category": "export",
    "output": {
      "action": "export",
      "target": "webhook",
      "reply": "✓ Webhook tetiklendi",
      "changes": []
    }
  },
  {
    "user_command": "tabloyu kopyala",
    "logic": "copy table clipboard",
    "category": "export",
    "output": {
      "action": "export",
      "format": "clipboard",
      "reply": "✓ Tablo kopyalandı",
      "changes": []
    }
  },
  {
    "user_command": "veriyi paylaş",
    "logic": "share data export",
    "category": "export",
    "output": {
      "action": "export",
      "reply": "✓ Veri paylaşıldı",
      "changes": []
    }
  },
  {
    "user_command": "sütun ekle",
    "logic": "add new column",
    "category": "structure",
    "output": {
      "action": "add_column",
      "reply": "✓ Yeni sütun eklendi",
      "changes": []
    }
  },
  {
    "user_command": "yeni kolon ekle",
    "logic": "insert new column",
    "category": "structure",
    "output": {
      "action": "add_column",
      "reply": "✓ Yeni kolon eklendi",
      "changes": []
    }
  },
  {
    "user_command": "b sütununu sil",
    "logic": "delete remove column B",
    "category": "structure",
    "output": {
      "action": "delete_column",
      "column": "B",
      "reply": "✓ B sütunu silindi",
      "changes": []
    }
  },
  {
    "user_command": "fiyat sütununu kaldır",
    "logic": "remove price column",
    "category": "structure",
    "output": {
      "action": "delete_column",
      "column": "fiyat",
      "reply": "✓ Fiyat sütunu kaldırıldı",
      "changes": []
    }
  },
  {
    "user_command": "boş sütunları kaldır",
    "logic": "remove empty columns",
    "category": "structure",
    "output": {
      "action": "delete_empty_columns",
      "reply": "✓ Boş sütunlar kaldırıldı",
      "changes": []
    }
  },
  {
    "user_command": "sütunları yeniden adlandır",
    "logic": "rename columns headers",
    "category": "structure",
    "output": {
      "action": "rename_columns",
      "reply": "✓ Sütunlar yeniden adlandırıldı",
      "changes": []
    }
  },
  {
    "user_command": "satır ekle",
    "logic": "add insert new row",
    "category": "structure",
    "output": {
      "action": "add_row",
      "reply": "✓ Yeni satır eklendi",
      "changes": []
    }
  },
  {
    "user_command": "son satıra veri ekle",
    "logic": "add data to last row",
    "category": "structure",
    "output": {
      "action": "add_row",
      "reply": "✓ Son satıra veri eklendi",
      "changes": []
    }
  },
  {
    "user_command": "sütunları yer değiştir",
    "logic": "swap reorder columns",
    "category": "structure",
    "output": {
      "action": "message",
      "formula": "swap_columns",
      "reply": "✓ Sütunlar yer değiştirdi",
      "changes": []
    }
  },
  {
    "user_command": "tabloyu döndür",
    "logic": "transpose rotate table",
    "category": "structure",
    "output": {
      "action": "message",
      "formula": "transpose",
      "reply": "✓ Tablo döndürüldü",
      "changes": []
    }
  },
  {
    "user_command": "geri al",
    "logic": "undo last action",
    "category": "structure",
    "output": {
      "action": "undo",
      "reply": "✓ Son işlem geri alındı",
      "changes": []
    }
  },
  {
    "user_command": "tüm veriyi temizle",
    "logic": "clear all data",
    "category": "structure",
    "output": {
      "action": "clear_all",
      "reply": "✓ Tüm veri temizlendi",
      "changes": []
    }
  },
  {
    "user_command": "ayşe yi bul",
    "logic": "find search for Ayşe name",
    "category": "search",
    "output": {
      "action": "search",
      "value": "ayşe",
      "reply": "✓ 'Ayşe' arama sonuçları gösterildi",
      "changes": []
    }
  },
  {
    "user_command": "istanbul içeren satırları bul",
    "logic": "find rows containing istanbul",
    "category": "search",
    "output": {
      "action": "filter",
      "condition": "contains",
      "value": "istanbul",
      "reply": "✓ 'İstanbul' içeren satırlar bulundu",
      "changes": []
    }
  },
  {
    "user_command": "100 değerini ara",
    "logic": "search for value 100",
    "category": "search",
    "output": {
      "action": "search",
      "value": "100",
      "reply": "✓ 100 değeri arandı",
      "changes": []
    }
  },
  {
    "user_command": "bul ve değiştir",
    "logic": "find and replace values",
    "category": "search",
    "output": {
      "action": "find_replace",
      "reply": "✓ Bul ve değiştir hazır",
      "changes": []
    }
  },
  {
    "user_command": "tüm hücrelerde ara",
    "logic": "search all cells",
    "category": "search",
    "output": {
      "action": "search",
      "scope": "all",
      "reply": "✓ Tüm hücrelerde arama yapıldı",
      "changes": []
    }
  },
  {
    "user_command": "xyz ürününü bul",
    "logic": "find product named xyz",
    "category": "search",
    "output": {
      "action": "search",
      "column": "ürün",
      "reply": "✓ Ürün arama sonuçları gösterildi",
      "changes": []
    }
  },
  {
    "user_command": "müşteri no 1234 bul",
    "logic": "find customer number 1234",
    "category": "search",
    "output": {
      "action": "search",
      "value": "1234",
      "reply": "✓ Müşteri bulundu",
      "changes": []
    }
  },
  {
    "user_command": "hata içeren hücreleri bul",
    "logic": "find cells with errors",
    "category": "search",
    "output": {
      "action": "validate",
      "check": "errors",
      "reply": "✓ Hatalı hücreler bulundu",
      "changes": []
    }
  },
  {
    "user_command": "formül içeren hücreleri işaretle",
    "logic": "mark cells with formulas",
    "category": "search",
    "output": {
      "action": "highlight",
      "condition": "has_formula",
      "color": "#bfdbfe",
      "reply": "✓ Formüllü hücreler işaretlendi",
      "changes": []
    }
  },
  {
    "user_command": "boş hücreleri bul ve sarıya boya",
    "logic": "find empty cells highlight yellow",
    "category": "search",
    "output": {
      "action": "highlight",
      "condition": "empty",
      "color": "#fef08a",
      "reply": "✓ Boş hücreler sarıya boyandı",
      "changes": []
    }
  },
  {
    "user_command": "grafik öner",
    "logic": "suggest chart visualization type",
    "category": "chart",
    "output": {
      "action": "message",
      "formula": "chart_suggestion",
      "reply": "📊 Verilerinize uygun grafik türleri önerildi",
      "changes": []
    }
  },
  {
    "user_command": "çubuk grafik için veri hazırla",
    "logic": "prepare data for bar chart",
    "category": "chart",
    "output": {
      "action": "message",
      "formula": "chart_bar_data",
      "reply": "📊 Çubuk grafik verisi hazırlandı",
      "changes": []
    }
  },
  {
    "user_command": "pasta grafik yap",
    "logic": "create pie chart data",
    "category": "chart",
    "output": {
      "action": "message",
      "formula": "chart_pie_data",
      "reply": "📊 Pasta grafik verisi hazırlandı",
      "changes": []
    }
  },
  {
    "user_command": "trend grafiği için veriyi düzenle",
    "logic": "organize data for trend line chart",
    "category": "chart",
    "output": {
      "action": "message",
      "formula": "chart_line_data",
      "reply": "📊 Trend grafiği verisi düzenlendi",
      "changes": []
    }
  },
  {
    "user_command": "hangi grafik türü uygun",
    "logic": "which chart type is best",
    "category": "chart",
    "output": {
      "action": "message",
      "formula": "chart_suggestion",
      "reply": "📊 Grafik türü önerisi hazırlandı",
      "changes": []
    }
  },
  {
    "user_command": "dashboard için veri hazırla",
    "logic": "prepare dashboard data",
    "category": "chart",
    "output": {
      "action": "message",
      "formula": "dashboard_data",
      "reply": "📊 Dashboard verisi hazırlandı",
      "changes": []
    }
  },
  {
    "user_command": "satış grafiği için düzenle",
    "logic": "organize for sales chart",
    "category": "chart",
    "output": {
      "action": "message",
      "formula": "sales_chart",
      "reply": "📊 Satış grafiği verisi düzenlendi",
      "changes": []
    }
  },
  {
    "user_command": "aylık trend göster",
    "logic": "show monthly trend",
    "category": "chart",
    "output": {
      "action": "message",
      "formula": "monthly_trend",
      "reply": "📊 Aylık trend hazırlandı",
      "changes": []
    }
  },
  {
    "user_command": "karşılaştırma grafiği hazırla",
    "logic": "prepare comparison chart",
    "category": "chart",
    "output": {
      "action": "message",
      "formula": "comparison_chart",
      "reply": "📊 Karşılaştırma grafiği hazırlandı",
      "changes": []
    }
  },
  {
    "user_command": "sparkline ekle",
    "logic": "add sparkline mini chart",
    "category": "chart",
    "output": {
      "action": "message",
      "formula": "sparkline",
      "reply": "📊 Sparkline eklendi",
      "changes": []
    }
  },
  {
    "user_command": "tarihleri formatla",
    "logic": "format date values",
    "category": "date",
    "output": {
      "action": "transform",
      "transform": "date_format",
      "reply": "✓ Tarihler formatlandı",
      "changes": []
    }
  },
  {
    "user_command": "tarihleri gg.aa.yyyy yap",
    "logic": "convert dates DD.MM.YYYY format",
    "category": "date",
    "output": {
      "action": "transform",
      "transform": "date_dmY",
      "reply": "✓ Tarihler GG.AA.YYYY formatına çevrildi",
      "changes": []
    }
  },
  {
    "user_command": "yılı çıkar",
    "logic": "extract year from date",
    "category": "date",
    "output": {
      "action": "transform",
      "transform": "extract_year",
      "reply": "✓ Yıllar çıkarıldı",
      "changes": []
    }
  },
  {
    "user_command": "ayı göster",
    "logic": "extract show month from date",
    "category": "date",
    "output": {
      "action": "transform",
      "transform": "extract_month",
      "reply": "✓ Aylar gösterildi",
      "changes": []
    }
  },
  {
    "user_command": "gün bilgisini al",
    "logic": "extract day from date",
    "category": "date",
    "output": {
      "action": "transform",
      "transform": "extract_day",
      "reply": "✓ Gün bilgileri alındı",
      "changes": []
    }
  },
  {
    "user_command": "en eski tarihi bul",
    "logic": "find minimum oldest date",
    "category": "date",
    "output": {
      "action": "min",
      "column": "tarih",
      "reply": "✓ En eski tarih bulundu",
      "changes": []
    }
  },
  {
    "user_command": "en yeni tarihi bul",
    "logic": "find maximum newest date",
    "category": "date",
    "output": {
      "action": "max",
      "column": "tarih",
      "reply": "✓ En yeni tarih bulundu",
      "changes": []
    }
  },
  {
    "user_command": "tarihe göre gruplayarak say",
    "logic": "count group by date",
    "category": "date",
    "output": {
      "action": "group_by",
      "column": "tarih",
      "aggregate": "count",
      "reply": "✓ Tarih bazlı sayım yapıldı",
      "changes": []
    }
  },
  {
    "user_command": "iki tarih arası gün hesapla",
    "logic": "calculate days between two dates",
    "category": "date",
    "output": {
      "action": "update_cells",
      "formula": "date_diff",
      "reply": "✓ Gün farkı hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "iş günü sayısını hesapla",
    "logic": "count working business days",
    "category": "date",
    "output": {
      "action": "update_cells",
      "formula": "workdays",
      "reply": "✓ İş günleri hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "vade tarihi hesapla",
    "logic": "calculate due date maturity",
    "category": "date",
    "output": {
      "action": "update_cells",
      "formula": "due_date",
      "reply": "✓ Vade tarihi hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "ay sonu tarihi bul",
    "logic": "find end of month date",
    "category": "date",
    "output": {
      "action": "update_cells",
      "formula": "month_end",
      "reply": "✓ Ay sonu tarihi bulundu",
      "changes": []
    }
  },
  {
    "user_command": "ne yapabilirim",
    "logic": "help what commands available",
    "category": "help",
    "output": {
      "action": "message",
      "reply": "💡 Sıralama, filtreleme, hesaplama, renklendirme, rapor oluşturma yapabilirsiniz!",
      "changes": []
    }
  },
  {
    "user_command": "yardım",
    "logic": "help assistance support",
    "category": "help",
    "output": {
      "action": "message",
      "reply": "💡 Örnek: 'B sütununu topla', 'Boş satırları sil', 'KDV ekle', 'Aylık rapor yap'",
      "changes": []
    }
  },
  {
    "user_command": "nasıl kullanırım",
    "logic": "how to use guide instructions",
    "category": "help",
    "output": {
      "action": "message",
      "reply": "💡 Türkçe olarak ne yapmak istediğinizi yazın. Örn: 'Fiyatları büyükten küçüğe sırala'",
      "changes": []
    }
  },
  {
    "user_command": "ne yaparsın",
    "logic": "what can you do capabilities",
    "category": "help",
    "output": {
      "action": "message",
      "reply": "💡 Excel verilerinizi Türkçe komutlarla yönetebilirsiniz.",
      "changes": []
    }
  },
  {
    "user_command": "komutlar neler",
    "logic": "list available commands",
    "category": "help",
    "output": {
      "action": "message",
      "reply": "💡 Topla, sırala, filtrele, renklendir, KDV hesapla, maaş hesapla ve çok daha fazlası!",
      "changes": []
    }
  },
  {
    "user_command": "bu formülü açıkla",
    "logic": "explain this formula",
    "category": "help",
    "output": {
      "action": "explain",
      "reply": "💡 Formül açıklandı",
      "changes": []
    }
  },
  {
    "user_command": "vlookup nedir",
    "logic": "what is VLOOKUP explain",
    "category": "help",
    "output": {
      "action": "explain",
      "formula_name": "vlookup",
      "reply": "💡 VLOOKUP formülü açıklandı",
      "changes": []
    }
  },
  {
    "user_command": "sumif nasıl kullanılır",
    "logic": "how to use SUMIF formula",
    "category": "help",
    "output": {
      "action": "explain",
      "formula_name": "sumif",
      "reply": "💡 SUMIF kullanımı açıklandı",
      "changes": []
    }
  },
  {
    "user_command": "kaç sütun var",
    "logic": "how many columns sheet info",
    "category": "help",
    "output": {
      "action": "message",
      "formula": "sheet_info",
      "reply": "📊 Tablo bilgileri gösterildi",
      "changes": []
    }
  },
  {
    "user_command": "veriler hakkında bilgi ver",
    "logic": "data summary information",
    "category": "help",
    "output": {
      "action": "message",
      "formula": "data_summary",
      "reply": "📊 Veri özeti hazırlandı",
      "changes": []
    }
  },
  {
    "user_command": "bu veriyi analiz et",
    "logic": "analyze this data full",
    "category": "help",
    "output": {
      "action": "message",
      "formula": "full_analysis",
      "reply": "📊 Veri analizi tamamlandı",
      "changes": []
    }
  },
  {
    "user_command": "hızlı özet göster",
    "logic": "show quick summary overview",
    "category": "help",
    "output": {
      "action": "message",
      "formula": "quick_summary",
      "reply": "📊 Hızlı özet hazırlandı",
      "changes": []
    }
  },
  {
    "user_command": "younluk haritas1 yap",
    "logic": "create density heatmap visualization",
    "category": "heatmap",
    "output": {
      "action": "heatmap",
      "reply": "=� Younluk haritas1 olu_turuldu",
      "changes": []
    }
  },
  {
    "user_command": "performans skoru heatmap",
    "logic": "heatmap performance score color scale",
    "category": "heatmap",
    "output": {
      "action": "heatmap",
      "column": "performans",
      "reply": "=� Performans skoru heatmap uyguland1",
      "changes": []
    }
  },
  {
    "user_command": "fiyat younluu haritas1",
    "logic": "price density heatmap color gradient",
    "category": "heatmap",
    "output": {
      "action": "heatmap",
      "column": "fiyat",
      "reply": "=� Fiyat younluu haritas1 olu_turuldu",
      "changes": []
    }
  },
  {
    "user_command": "korelasyon heatmap uygula",
    "logic": "correlation matrix heatmap apply",
    "category": "heatmap",
    "output": {
      "action": "heatmap",
      "reply": "=� Korelasyon haritas1 uyguland1",
      "changes": []
    }
  },
  {
    "user_command": "y1l sonu gelirini tahmin et",
    "logic": "forecast end of year revenue prediction",
    "category": "forecast",
    "output": {
      "action": "forecast",
      "column": "gelir",
      "reply": "=� Y1l sonu gelir tahmini hesapland1",
      "changes": []
    }
  },
  {
    "user_command": "trend bazl1 tahmin yap",
    "logic": "trend based linear forecast prediction",
    "category": "forecast",
    "output": {
      "action": "forecast",
      "method": "trend",
      "reply": "=� Trend bazl1 tahmin yap1ld1",
      "changes": []
    }
  },
  {
    "user_command": "hareketli ortalama ile tahmin et",
    "logic": "moving average forecast method prediction",
    "category": "forecast",
    "output": {
      "action": "forecast",
      "method": "moving_average",
      "reply": "=� Hareketli ortalama tahmini yap1ld1",
      "changes": []
    }
  },
  {
    "user_command": "istatistiksel anomali tespiti yap",
    "logic": "statistical anomaly detection z-score method",
    "category": "anomaly_detection",
    "output": {
      "action": "anomaly_detection",
      "method": "zscore",
      "reply": "=� 0statistiksel anomaliler tespit edildi",
      "changes": []
    }
  },
  {
    "user_command": "memnuniyet anketini analiz et",
    "logic": "satisfaction survey sentiment analysis score",
    "category": "sentiment_analysis",
    "output": {
      "action": "sentiment_analysis",
      "column": "anket",
      "reply": "=� Memnuniyet anketi analiz edildi",
      "changes": []
    }
  },
  {
    "user_command": "sosyal medya yorumlar1n1 s1n1fla",
    "logic": "classify social media comments sentiment positive negative",
    "category": "sentiment_analysis",
    "output": {
      "action": "sentiment_analysis",
      "column": "yorum",
      "reply": "=� Sosyal medya yorumlar1 analiz edildi",
      "changes": []
    }
  },
  {
    "user_command": "negatif yorumlar1 bul",
    "logic": "find negative sentiment comments reviews filter",
    "category": "sentiment_analysis",
    "output": {
      "action": "sentiment_analysis",
      "filter": "negative",
      "reply": "=� Negatif yorumlar tespit edildi",
      "changes": []
    }
  },
  {
    "user_command": "harcamalar1 zorunlu istee bal1 olarak ay1r",
    "logic": "classify expenses mandatory optional separate",
    "category": "classify",
    "output": {
      "action": "classify",
      "categories": [
        "Zorunlu",
        "0stee Bal1"
      ],
      "reply": "=� Harcamalar s1n1fland1r1ld1",
      "changes": []
    }
  },
  {
    "user_command": "tarih aral1klar1n1 metinden ay1kla",
    "logic": "extract date ranges from text column",
    "category": "extract",
    "output": {
      "action": "extract",
      "type": "date_range",
      "reply": " Tarih aral1klar1 ay1kland1",
      "changes": []
    }
  },
  {
    "user_command": "plakalar1 bul ve listele",
    "logic": "extract Turkish license plate numbers find list",
    "category": "extract",
    "output": {
      "action": "extract",
      "type": "plate",
      "reply": " Plakalar bulundu ve listelendi",
      "changes": []
    }
  },
  {
    "user_command": "vergi numaralar1n1 metinden ay1kla",
    "logic": "extract tax identification numbers from column",
    "category": "extract",
    "output": {
      "action": "extract",
      "type": "tax_id",
      "reply": " Vergi numaralar1 ay1kland1",
      "changes": []
    }
  },
  {
    "user_command": "e-posta adreslerini bul ve listele",
    "logic": "extract email addresses from text column list",
    "category": "extract",
    "output": {
      "action": "extract",
      "type": "email",
      "reply": " E-posta adresleri listelendi",
      "changes": []
    }
  },
  {
    "user_command": "barkod numaralar1n1 ay1kla",
    "logic": "extract barcode EAN UPC product codes from text",
    "category": "extract",
    "output": {
      "action": "extract",
      "type": "barcode",
      "reply": " Barkod numaralar1 ay1kland1",
      "changes": []
    }
  },
  {
    "user_command": "fatura numaralar1n1 bul",
    "logic": "extract invoice numbers from description text",
    "category": "extract",
    "output": {
      "action": "extract",
      "type": "invoice_no",
      "reply": " Fatura numaralar1 bulundu",
      "changes": []
    }
  },
  {
    "user_command": "para miktarlar1n1 metinden ay1kla",
    "logic": "extract currency money amounts from Turkish text",
    "category": "extract",
    "output": {
      "action": "extract",
      "type": "amount",
      "reply": " Para miktarlar1 ay1kland1",
      "changes": []
    }
  },
  {
    "user_command": "fiyat anomalilerini tespit et",
    "logic": "detect price anomalies outliers statistical",
    "category": "anomaly_detection",
    "output": {
      "action": "anomaly_detection",
      "column": "fiyat",
      "reply": "=� Fiyat anomalileri tespit edildi",
      "changes": []
    }
  },
  {
    "user_command": "Twitter yorumlar1n1n duygusunu analiz et",
    "logic": "analyze Twitter comments social media sentiment",
    "category": "sentiment_analysis",
    "output": {
      "action": "sentiment_analysis",
      "column": "yorum",
      "reply": "=� Twitter yorumlar1 analiz edildi",
      "changes": []
    }
  },
  {
    "user_command": "geri bildirim formlar1n1 analiz et",
    "logic": "analyze feedback form responses sentiment",
    "category": "sentiment_analysis",
    "output": {
      "action": "sentiment_analysis",
      "column": "geri bildirim",
      "reply": "=� Geri bildirim formu analizi tamamland1",
      "changes": []
    }
  },
  {
    "user_command": "gelir gider fark1n1 bul",
    "logic": "find revenue expense difference compare",
    "category": "compare",
    "output": {
      "action": "compare",
      "col1": "gelir",
      "col2": "gider",
      "reply": "=� Gelir-gider fark1 hesapland1",
      "changes": []
    }
  },
  {
    "user_command": "kar marj1 tahminini hesapla",
    "logic": "calculate profit margin forecast estimate",
    "category": "forecast",
    "output": {
      "action": "forecast",
      "column": "kar",
      "reply": "=� K�r marj1 tahmini hesapland1",
      "changes": []
    }
  },
  {
    "user_command": "e-posta adreslerinin format1n1 dorula",
    "logic": "validate email address format in column",
    "category": "cleaning",
    "output": {
      "action": "validate",
      "type": "email",
      "reply": " E-posta formatlar1 doruland1",
      "changes": []
    }
  },
  {
    "user_command": "telefon numaralar1n1 kontrol et",
    "logic": "validate phone number format digits",
    "category": "cleaning",
    "output": {
      "action": "validate",
      "type": "phone",
      "reply": " Telefon numaralar1 kontrol edildi",
      "changes": []
    }
  },
  {
    "user_command": "TC kimlik numaralar1n1 dorula",
    "logic": "validate Turkish national ID number format",
    "category": "cleaning",
    "output": {
      "action": "validate",
      "type": "tc_kimlik",
      "reply": " TC kimlik numaralar1 doruland1",
      "changes": []
    }
  },
  {
    "user_command": "IBAN numaralar1n1n doruluunu kontrol et",
    "logic": "validate IBAN bank account number format",
    "category": "cleaning",
    "output": {
      "action": "validate",
      "type": "IBAN",
      "reply": " IBAN numaralar1 doruland1",
      "changes": []
    }
  },
  {
    "user_command": "negatif deer var m1 kontrol et",
    "logic": "validate no negative values exist in column",
    "category": "cleaning",
    "output": {
      "action": "validate",
      "type": "positive_only",
      "reply": " Negatif deer kontrol� yap1ld1",
      "changes": []
    }
  },
  {
    "user_command": "vergi numaras1 format1n1 dorula",
    "logic": "validate tax number VKN format Turkey",
    "category": "cleaning",
    "output": {
      "action": "validate",
      "type": "vergi_no",
      "reply": " Vergi numaralar1 doruland1",
      "changes": []
    }
  },
  {
    "user_command": "deerler belirli aral1kta m1 kontrol et",
    "logic": "validate values within acceptable range bounds",
    "category": "cleaning",
    "output": {
      "action": "validate",
      "type": "range",
      "reply": " Deer aral11 doruland1",
      "changes": []
    }
  },
  {
    "user_command": "ahmet'i ara",
    "logic": "search for name Ahmet in all cells",
    "category": "search",
    "output": {
      "action": "search",
      "query": "ahmet",
      "reply": " 'Ahmet' arand1",
      "changes": []
    }
  },
  {
    "user_command": "istanbul'u bul",
    "logic": "search find istanbul city text",
    "category": "search",
    "output": {
      "action": "search",
      "query": "istanbul",
      "reply": " '0stanbul' arand1",
      "changes": []
    }
  },
  {
    "user_command": "fatura numaras1n1 ara",
    "logic": "search for invoice number text",
    "category": "search",
    "output": {
      "action": "search",
      "column": "fatura",
      "reply": " Fatura numaras1 arand1",
      "changes": []
    }
  },
  {
    "user_command": "e-postada gmail olanlar1 bul",
    "logic": "search gmail in email column contains",
    "category": "search",
    "output": {
      "action": "search",
      "query": "gmail",
      "column": "email",
      "reply": " Gmail adresleri bulundu",
      "changes": []
    }
  },
  {
    "user_command": "2024 y1l1na ait kay1tlar1 bul",
    "logic": "search find year 2024 in date column",
    "category": "search",
    "output": {
      "action": "search",
      "query": "2024",
      "column": "tarih",
      "reply": " 2024 kay1tlar1 bulundu",
      "changes": []
    }
  },
  {
    "user_command": "filtreyi kald1r",
    "logic": "remove clear active filter",
    "category": "filtering",
    "output": {
      "action": "remove_filter",
      "reply": " Filtre kald1r1ld1",
      "changes": []
    }
  },
  {
    "user_command": "filtrelemeyi iptal et",
    "logic": "cancel disable current filter",
    "category": "filtering",
    "output": {
      "action": "remove_filter",
      "reply": " Filtreleme iptal edildi",
      "changes": []
    }
  },
  {
    "user_command": "filtreyi temizle",
    "logic": "clear remove applied filter",
    "category": "filtering",
    "output": {
      "action": "remove_filter",
      "reply": " Filtre temizlendi",
      "changes": []
    }
  },
  {
    "user_command": "sat1r say1s1n1 say",
    "logic": "count total rows in spreadsheet",
    "category": "calculation",
    "output": {
      "action": "count",
      "reply": " Sat1r say1s1 hesapland1",
      "changes": []
    }
  },
  {
    "user_command": "toplam fatura say1s1",
    "logic": "count total number of invoices",
    "category": "calculation",
    "output": {
      "action": "count",
      "column": "fatura",
      "reply": " Fatura say1s1 hesapland1",
      "changes": []
    }
  },
  {
    "user_command": "bu verileri yorumla",
    "logic": "interpret analyze and explain data meaning",
    "category": "help",
    "output": {
      "action": "explain",
      "reply": "=� Veriler yorumland1",
      "changes": []
    }
  },
  {
    "user_command": "renkleri temizle",
    "logic": "clear remove all cell colors highlights",
    "category": "highlighting",
    "output": {
      "action": "clear_colors",
      "reply": " Renkler temizlendi",
      "changes": []
    }
  },
  {
    "user_command": "renklendirmeyi iptal et",
    "logic": "cancel undo color formatting highlights",
    "category": "highlighting",
    "output": {
      "action": "clear_colors",
      "reply": " Renklendirme iptal edildi",
      "changes": []
    }
  },
  {
    "user_command": "arka plan renklerini sil",
    "logic": "delete remove background fill colors cells",
    "category": "highlighting",
    "output": {
      "action": "clear_colors",
      "reply": " Arka plan renkleri silindi",
      "changes": []
    }
  },
  {
    "user_command": "boyay1 kald1r",
    "logic": "remove paint color fill all cells",
    "category": "highlighting",
    "output": {
      "action": "clear_colors",
      "reply": " Boya kald1r1ld1",
      "changes": []
    }
  },
  {
    "user_command": "geri al",
    "logic": "undo last action revert",
    "category": "structure",
    "output": {
      "action": "undo",
      "reply": " Son i_lem geri al1nd1",
      "changes": []
    }
  },
  {
    "user_command": "yapt11m1 geri al",
    "logic": "undo what I just did revert",
    "category": "structure",
    "output": {
      "action": "undo",
      "reply": " 0_lem geri al1nd1",
      "changes": []
    }
  },
  {
    "user_command": "ctrl z",
    "logic": "undo keyboard shortcut last action",
    "category": "structure",
    "output": {
      "action": "undo",
      "reply": " Geri al1nd1",
      "changes": []
    }
  },
  {
    "user_command": "tabloyu s1f1rla",
    "logic": "reset table clear all content formatting",
    "category": "cleaning",
    "output": {
      "action": "clear_all",
      "reply": " Tablo s1f1rland1",
      "changes": []
    }
  },
  {
    "user_command": "yeni sat1r ekle",
    "logic": "add new empty row to spreadsheet",
    "category": "structure",
    "output": {
      "action": "add_row",
      "reply": " Yeni sat1r eklendi",
      "changes": []
    }
  },
  {
    "user_command": "alta yeni kay1t ekle",
    "logic": "add new record row at bottom",
    "category": "structure",
    "output": {
      "action": "add_row",
      "position": "bottom",
      "reply": " Alta yeni kay1t eklendi",
      "changes": []
    }
  },
  {
    "user_command": "sat1r araya ekle",
    "logic": "insert row between existing rows",
    "category": "structure",
    "output": {
      "action": "add_row",
      "position": "insert",
      "reply": " Sat1r araya eklendi",
      "changes": []
    }
  },
  {
    "user_command": "saa yeni kolon ekle",
    "logic": "add new column to the right side",
    "category": "structure",
    "output": {
      "action": "add_column",
      "position": "right",
      "reply": " Saa yeni kolon eklendi",
      "changes": []
    }
  },
  {
    "user_command": "tabloyu komple temizle",
    "logic": "clear all data completely",
    "category": "structure",
    "output": {
      "action": "clear_all",
      "reply": " Tablo tamamen temizlendi",
      "changes": []
    }
  },
  {
    "user_command": "sayfay1 tamamen temizle",
    "logic": "clear entire sheet",
    "category": "structure",
    "output": {
      "action": "clear_all",
      "reply": " Sayfa tamamen temizlendi",
      "changes": []
    }
  },
  {
    "user_command": "dolu olmayan kolonlar1 temizle",
    "logic": "remove columns that are not filled",
    "category": "structure",
    "output": {
      "action": "delete_empty_columns",
      "reply": " Dolu olmayan kolonlar kald1r1ld1",
      "changes": []
    }
  },
  {
    "user_command": "en sona yeni sat1r ekle",
    "logic": "add new row at the bottom",
    "category": "structure",
    "output": {
      "action": "add_row",
      "position": "end",
      "reply": " Sona yeni sat1r eklendi",
      "changes": []
    }
  },
  {
    "user_command": "yeni bir veri sat1r1 ekle",
    "logic": "add a new data row",
    "category": "structure",
    "output": {
      "action": "add_row",
      "position": "end",
      "reply": " Yeni veri sat1r1 eklendi",
      "changes": []
    }
  },
  {
    "user_command": "erkek yazan yerleri E yap",
    "logic": "replace erkek with E abbreviation",
    "category": "cleaning",
    "output": {
      "action": "find_replace",
      "find": "Erkek",
      "replace": "E",
      "reply": " Erkek deerleri E olarak g�ncellendi",
      "changes": []
    }
  },
  {
    "user_command": "vurgulamalar1 kald1r",
    "logic": "remove all highlights from cells",
    "category": "highlighting",
    "output": {
      "action": "clear_colors",
      "reply": " Vurgulamalar kald1r1ld1",
      "changes": []
    }
  },
  {
    "user_command": "renk formatlamalar1n1 s1f1rla",
    "logic": "reset all color formatting",
    "category": "highlighting",
    "output": {
      "action": "clear_colors",
      "reply": " Renk formatlamalar1 s1f1rland1",
      "changes": []
    }
  },
  {
    "user_command": "puan kolonunu kald1r",
    "logic": "remove the score column",
    "category": "structure",
    "output": {
      "action": "delete_column",
      "column": "puan",
      "reply": " Puan kolonu kald1r1ld1",
      "changes": []
    }
  },
  {
    "user_command": "filtreyi temizle",
    "logic": "clear remove active filter",
    "category": "filtering",
    "output": {
      "action": "remove_filter",
      "reply": " Filtre temizlendi",
      "changes": []
    }
  },
  {
    "user_command": "filtrelemeyi iptal et",
    "logic": "cancel undo filter",
    "category": "filtering",
    "output": {
      "action": "remove_filter",
      "reply": " Filtreleme iptal edildi",
      "changes": []
    }
  },
  {
    "user_command": "tevkifatl1 kdv tutar1n1 hesapla",
    "logic": "calculate withholding VAT deduction tevkifat 2/10 rate Turkey KDV stopaj",
    "category": "accounting",
    "output": {
      "action": "update_cells",
      "formula": "tevkifat_kdv",
      "factor": 0.18,
      "reply": " Tevkifatl1 KDV hesapland1",
      "changes": []
    }
  },
  {
    "user_command": "stopaj vergisi kesintilerini listele",
    "logic": "list withholding tax deductions muhtasar Turkey stopaj",
    "category": "accounting",
    "output": {
      "action": "filter",
      "condition": "contains",
      "value": "stopaj",
      "reply": " Stopaj kesintileri listelendi",
      "changes": []
    }
  },
  {
    "user_command": "banka sigorta muameleleri vergisi hesapla",
    "logic": "calculate banking insurance transactions tax BSMV Turkey 5 percent",
    "category": "accounting",
    "output": {
      "action": "update_cells",
      "formula": "bsmv",
      "factor": 0.05,
      "reply": " BSMV hesapland1",
      "changes": []
    }
  },
  {
    "user_command": "yeniden deerleme katsay1s1 uygula",
    "logic": "apply revaluation coefficient yeniden deerleme Turkey inflation adjustment fixed assets",
    "category": "accounting",
    "output": {
      "action": "update_cells",
      "formula": "revaluation",
      "reply": " Yeniden deerleme katsay1s1 uyguland1",
      "changes": []
    }
  },
  {
    "user_command": "iade al1nacak kdv tutar1n1 hesapla",
    "logic": "calculate VAT refund amount to be received Turkey kdv iadesi",
    "category": "accounting",
    "output": {
      "action": "sum",
      "column": "kdv_iadesi",
      "reply": " 0ade al1nacak KDV tutar1 hesapland1",
      "changes": []
    }
  },
  {
    "user_command": "gecikme zamm1 hesapla",
    "logic": "calculate late payment surcharge gecikme zammi Turkey tax penalty",
    "category": "accounting",
    "output": {
      "action": "update_cells",
      "formula": "gecikme_zammi",
      "reply": " Gecikme zamm1 hesapland1",
      "changes": []
    }
  },
  {
    "user_command": "kurumlar vergisi matrah1 hesapla",
    "logic": "calculate corporate tax base kurumlar vergisi matrah Turkey 20 percent",
    "category": "accounting",
    "output": {
      "action": "update_cells",
      "formula": "kurumlar_vergisi",
      "rate": 0.2,
      "reply": " Kurumlar vergisi matrah1 hesapland1",
      "changes": []
    }
  },
  {
    "user_command": "cari hesap bakiyelerini hesapla",
    "logic": "calculate current account balances cari hesap Turkey",
    "category": "accounting",
    "output": {
      "action": "sum",
      "column": "bakiye",
      "reply": " Cari hesap bakiyeleri hesapland1",
      "changes": []
    }
  },
  {
    "user_command": "tahakkuk eden faizi hesapla",
    "logic": "calculate accrued interest tahakkuk Turkey",
    "category": "accounting",
    "output": {
      "action": "update_cells",
      "formula": "tahakkuk_faiz",
      "reply": " Tahakkuk eden faiz hesapland1",
      "changes": []
    }
  },
  {
    "user_command": "kasa say1m fazlas1n1 bul",
    "logic": "find cash count surplus kasa sayim fazlasi Turkey",
    "category": "accounting",
    "output": {
      "action": "filter",
      "condition": "value > 0",
      "column": "kasa_fark",
      "reply": " Kasa say1m fazlalar1 listelendi",
      "changes": []
    }
  },
  {
    "user_command": "amortisman pay1n1 hesapla",
    "logic": "calculate depreciation amount amortisman Turkey fixed assets",
    "category": "accounting",
    "output": {
      "action": "update_cells",
      "formula": "amortisman",
      "reply": " Amortisman pay1 hesapland1",
      "changes": []
    }
  },
  {
    "user_command": "reeskont faizini hesapla",
    "logic": "calculate rediscount interest reeskont Turkey TCMB rate",
    "category": "accounting",
    "output": {
      "action": "update_cells",
      "formula": "reeskont_faiz",
      "reply": " Reeskont faizi hesapland1",
      "changes": []
    }
  },
  {
    "user_command": "say1m noksanlar1n1 listele",
    "logic": "list inventory shortage sayim noksani Turkey",
    "category": "accounting",
    "output": {
      "action": "filter",
      "condition": "value < 0",
      "column": "envanter_fark",
      "reply": " Say1m noksanlar1 listelendi",
      "changes": []
    }
  },
  {
    "user_command": "kdv beyanname toplam1n1 hesapla",
    "logic": "calculate VAT tax return total KDV beyanname Turkey",
    "category": "accounting",
    "output": {
      "action": "sum",
      "column": "kdv_tutari",
      "reply": " KDV beyanname toplam1 hesapland1",
      "changes": []
    }
  },
  {
    "user_command": "stopaj oran1n1 uygula",
    "logic": "apply withholding tax stopaj rate Turkey",
    "category": "accounting",
    "output": {
      "action": "update_cells",
      "formula": "stopaj",
      "rate": 0.2,
      "reply": " Stopaj oran1 uyguland1",
      "changes": []
    }
  },
  {
    "user_command": "gece vardiyas1 zamm1 ekle",
    "logic": "add night shift premium 25 percent gece zammi Turkey",
    "category": "hr",
    "output": {
      "action": "update_cells",
      "formula": "gece_zammi",
      "factor": 1.25,
      "reply": " Gece vardiyas1 zamm1 eklendi",
      "changes": []
    }
  },
  {
    "user_command": "k1dem tazminat1 tavan1n1 uygula",
    "logic": "apply severance pay ceiling limit kidem tazminati tavan Turkey",
    "category": "hr",
    "output": {
      "action": "update_cells",
      "formula": "kidem_tavan",
      "reply": " K1dem tazminat1 tavan1 uyguland1",
      "changes": []
    }
  },
  {
    "user_command": "6 ayl1k ikramiyeyi hesapla",
    "logic": "calculate 6-month bonus ikramiye Turkey",
    "category": "hr",
    "output": {
      "action": "update_cells",
      "formula": "ikramiye",
      "months": 6,
      "reply": " 6 ayl1k ikramiye hesapland1",
      "changes": []
    }
  },
  {
    "user_command": "s1f1r olanlar filtrelensin",
    "logic": "passive voice filter zero values edilgen kip Turkish grammar",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "value == 0",
      "reply": " S1f1r deerler filtrelendi",
      "changes": []
    }
  },
  {
    "user_command": "sort by tarih",
    "logic": "sort by date mixed English Turkish sort tarih code-switching",
    "category": "sorting",
    "output": {
      "action": "sort",
      "column": "tarih",
      "direction": "asc",
      "reply": " Tarihe g�re s1raland1",
      "changes": []
    }
  },
  {
    "user_command": "filter aktif olanlar",
    "logic": "filter active records mixed English Turkish code-switching",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "contains",
      "value": "aktif",
      "reply": " Aktif kay1tlar filtrelendi",
      "changes": []
    }
  },
  {
    "user_command": "s1rala",
    "logic": "short ambiguous sort command single word minimal",
    "category": "sorting",
    "output": {
      "action": "sort",
      "direction": "asc",
      "reply": " Veriler s1raland1",
      "changes": []
    }
  },
  {
    "user_command": "highlight negatif values k1rm1z1",
    "logic": "highlight negative values red mixed Turkish English code-switching",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "value < 0",
      "color": "#fecaca",
      "reply": " Negatif deerler k1rm1z1ya boyand1",
      "changes": []
    }
  },
  {
    "user_command": "on ile yirmi aras1ndaki deerler",
    "logic": "filter between 10 and 20 numbers written as words Turkish say1sal yaz1",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "between",
      "min": 10,
      "max": 20,
      "reply": " 10-20 aras1 deerler filtrelendi",
      "changes": []
    }
  },
  {
    "user_command": "EERHATA ile hata yakalamak istiyorum",
    "logic": "catch errors with IFERROR EERHATA Turkish Excel function name",
    "category": "formula",
    "output": {
      "action": "generate_formula",
      "formula_type": "iferror",
      "reply": " EERHATA (IFERROR) form�l� olu_turuldu",
      "changes": []
    }
  },
  {
    "user_command": "tarih bilgilerini metinden al",
    "logic": "extract date values from text cells",
    "category": "extract",
    "output": {
      "action": "extract",
      "type": "date",
      "reply": " Tarih bilgileri al1nd1",
      "changes": []
    }
  },
  {
    "user_command": "posta kodlar1n1 bul",
    "logic": "extract postal zip codes from address text",
    "category": "extract",
    "output": {
      "action": "extract",
      "type": "postal_code",
      "reply": " Posta kodlar1 bulundu",
      "changes": []
    }
  },
  {
    "user_command": "banka hesap numaralar1n1 al",
    "logic": "extract bank account numbers from text column",
    "category": "extract",
    "output": {
      "action": "extract",
      "type": "account_number",
      "reply": " Hesap numaralar1 al1nd1",
      "changes": []
    }
  },
  {
    "user_command": "talep tahmini yap",
    "logic": "demand forecast prediction calculation future",
    "category": "forecast",
    "output": {
      "action": "forecast",
      "column": "talep",
      "reply": "=� Talep tahmini yap1ld1",
      "changes": []
    }
  },
  {
    "user_command": "stok yenileme zaman1n1 tahmin et",
    "logic": "forecast stock replenishment timing reorder point",
    "category": "forecast",
    "output": {
      "action": "forecast",
      "column": "stok",
      "type": "reorder",
      "reply": "=� Stok yenileme tahmini yap1ld1",
      "changes": []
    }
  },
  {
    "user_command": "personel ihtiyac1n1 tahmin et",
    "logic": "forecast headcount staffing needs future workforce",
    "category": "forecast",
    "output": {
      "action": "forecast",
      "column": "personel",
      "reply": "=� Personel ihtiyac1 tahmini yap1ld1",
      "changes": []
    }
  },
  {
    "user_command": "teslimat yorumlar1n1 deerlendir",
    "logic": "evaluate delivery reviews sentiment analysis positive negative",
    "category": "sentiment_analysis",
    "output": {
      "action": "sentiment_analysis",
      "column": "yorum",
      "reply": "=� Teslimat yorumlar1 deerlendirildi",
      "changes": []
    }
  },
  {
    "user_command": "net promoter score hesapla",
    "logic": "calculate NPS net promoter score sentiment loyalty",
    "category": "sentiment_analysis",
    "output": {
      "action": "sentiment_analysis",
      "output_type": "nps",
      "reply": "=� NPS skoru hesapland1",
      "changes": []
    }
  },
  {
    "user_command": "olumlu geri bildirimleri listele",
    "logic": "list filter positive feedback comments sentiment analysis",
    "category": "sentiment_analysis",
    "output": {
      "action": "sentiment_analysis",
      "filter": "positive",
      "reply": "=� Olumlu geri bildirimler listelendi",
      "changes": []
    }
  },
  {
    "user_command": "hizmet kalitesi yorumlar1n1 deerlendir",
    "logic": "evaluate service quality feedback sentiment customer experience",
    "category": "sentiment_analysis",
    "output": {
      "action": "sentiment_analysis",
      "column": "hizmet_yorumu",
      "reply": "=� Hizmet kalitesi yorumlar1 deerlendirildi",
      "changes": []
    }
  },
  {
    "user_command": "ayl1k faiz hesapla",
    "logic": "calculate monthly interest rate loan finance",
    "category": "generate_formula",
    "output": {
      "action": "generate_formula",
      "formula_type": "interest",
      "reply": "=� Ayl1k faiz form�l� eklendi",
      "changes": []
    }
  },
  {
    "user_command": "kredi taksitini hesapla",
    "logic": "calculate loan installment monthly payment PMT",
    "category": "generate_formula",
    "output": {
      "action": "generate_formula",
      "formula_type": "pmt",
      "reply": "=� Kredi taksit tutar1 hesapland1",
      "changes": []
    }
  },
  {
    "user_command": "ROI hesapla",
    "logic": "calculate return on investment ROI profit ratio",
    "category": "generate_formula",
    "output": {
      "action": "generate_formula",
      "formula_type": "roi",
      "reply": "=� ROI (Yat1r1m Getirisi) hesapland1",
      "changes": []
    }
  },
  {
    "user_command": "yat1r1m getirisini hesapla",
    "logic": "calculate investment return profit yield percentage",
    "category": "generate_formula",
    "output": {
      "action": "generate_formula",
      "formula_type": "roi",
      "reply": "=� Yat1r1m getirisi hesapland1",
      "changes": []
    }
  },
  {
    "user_command": "NBD hesapla",
    "logic": "calculate NPV net present value finance investment",
    "category": "generate_formula",
    "output": {
      "action": "generate_formula",
      "formula_type": "npv",
      "reply": "=� NBD hesapland1",
      "changes": []
    }
  },
  {
    "user_command": "amortisman hesapla",
    "logic": "calculate depreciation amortization asset straight line",
    "category": "generate_formula",
    "output": {
      "action": "generate_formula",
      "formula_type": "depreciation",
      "reply": "=� Amortisman tutar1 hesapland1",
      "changes": []
    }
  },
  {
    "user_command": "EBITDA hesapla",
    "logic": "calculate EBITDA earnings before interest tax depreciation amortization",
    "category": "generate_formula",
    "output": {
      "action": "generate_formula",
      "formula_type": "ebitda",
      "reply": "=� EBITDA hesapland1",
      "changes": []
    }
  },
  {
    "user_command": "iade oran1n1 hesapla",
    "logic": "calculate return rate refund ratio ecommerce",
    "category": "generate_formula",
    "output": {
      "action": "generate_formula",
      "formula_type": "return_rate",
      "reply": "=� 0ade oran1 hesapland1",
      "changes": []
    }
  },
  {
    "user_command": "ortalama sepet tutar1n1 bul",
    "logic": "calculate average order value AOV basket size ecommerce",
    "category": "average",
    "output": {
      "action": "average",
      "column": "sepet_tutar1",
      "reply": ">� Ortalama sepet tutar1 hesapland1",
      "changes": []
    }
  },
  {
    "user_command": "sepet ortalamas1 nedir",
    "logic": "average basket order value ecommerce shopping cart",
    "category": "average",
    "output": {
      "action": "average",
      "column": "sipari__tutar1",
      "reply": ">� Ortalama sepet deeri hesapland1",
      "changes": []
    }
  },
  {
    "user_command": "stok devir h1z1n1 hesapla",
    "logic": "calculate inventory turnover rate stock rotation",
    "category": "generate_formula",
    "output": {
      "action": "generate_formula",
      "formula_type": "inventory_turnover",
      "reply": "=� Stok devir h1z1 hesapland1",
      "changes": []
    }
  },
  {
    "user_command": "gecikmeli teslimatlar1 filtrele",
    "logic": "filter delayed late deliveries shipments overdue",
    "category": "filter",
    "output": {
      "action": "filter",
      "column": "teslimat_durumu",
      "operator": "equals",
      "value": "Gecikmi_",
      "reply": "= Gecikmeli teslimatlar filtrelendi",
      "changes": []
    }
  },
  {
    "user_command": "standart sapmay1 hesapla",
    "logic": "calculate standard deviation spread variability statistics",
    "category": "generate_formula",
    "output": {
      "action": "generate_formula",
      "formula_type": "std_dev",
      "reply": "=� Standart sapma hesapland1",
      "changes": []
    }
  },
  {
    "user_command": "varyans1 hesapla",
    "logic": "calculate variance statistical spread data distribution",
    "category": "generate_formula",
    "output": {
      "action": "generate_formula",
      "formula_type": "variance",
      "reply": "=� Varyans hesapland1",
      "changes": []
    }
  },
  {
    "user_command": "medyan1 bul",
    "logic": "find median middle value statistics dataset",
    "category": "generate_formula",
    "output": {
      "action": "generate_formula",
      "formula_type": "median",
      "reply": "=� Medyan deeri bulundu",
      "changes": []
    }
  },
  {
    "user_command": "korelasyon katsay1s1n1 hesapla",
    "logic": "calculate correlation coefficient pearson relationship two columns",
    "category": "generate_formula",
    "output": {
      "action": "generate_formula",
      "formula_type": "correlation",
      "reply": "=� Korelasyon katsay1s1 hesapland1",
      "changes": []
    }
  },
  {
    "user_command": "ayk1r1 deerleri tespit et",
    "logic": "detect outliers anomalies statistical z-score IQR",
    "category": "anomaly_detection",
    "output": {
      "action": "anomaly_detection",
      "method": "iqr",
      "reply": "= Ayk1r1 deerler tespit edildi",
      "changes": []
    }
  },
  {
    "user_command": "veri da1l1m1n1 analiz et",
    "logic": "analyze data distribution histogram skewness statistics",
    "category": "explain",
    "output": {
      "action": "explain",
      "analysis_type": "distribution",
      "reply": "=� Veri da1l1m1 analiz edildi",
      "changes": []
    }
  },
  {
    "user_command": "1000 ile 5000 aras1ndaki deerleri sar1 yap",
    "logic": "highlight values between range 1000 5000 yellow conditional",
    "category": "highlight",
    "output": {
      "action": "highlight",
      "condition": "between",
      "min": 1000,
      "max": 5000,
      "color": "yellow",
      "reply": "<� 1000-5000 aras1 deerler sar1ya boyand1",
      "changes": []
    }
  },
  {
    "user_command": "negatif deerleri k1rm1z1ya boya",
    "logic": "color negative values red below zero loss",
    "category": "highlight",
    "output": {
      "action": "highlight",
      "condition": "less_than",
      "value": 0,
      "color": "red",
      "reply": "<� Negatif deerler k1rm1z1ya boyand1",
      "changes": []
    }
  },
  {
    "user_command": "tekrar eden deerleri turuncu yap",
    "logic": "highlight duplicate repeated values orange mark",
    "category": "highlight",
    "output": {
      "action": "highlight",
      "condition": "duplicate",
      "color": "orange",
      "reply": "<� Tekrar eden deerler turuncuya boyand1",
      "changes": []
    }
  },
  {
    "user_command": "renkleri temizle",
    "logic": "clear remove all colors highlights formatting reset",
    "category": "clear_colors",
    "output": {
      "action": "clear_colors",
      "reply": "<� T�m renkler temizlendi",
      "changes": []
    }
  },
  {
    "user_command": "tamamlanma oran1n1 hesapla",
    "logic": "calculate completion rate percentage done tasks project progress",
    "category": "generate_formula",
    "output": {
      "action": "generate_formula",
      "formula_type": "completion_rate",
      "reply": "=� Tamamlanma oran1 hesapland1",
      "changes": []
    }
  },
  {
    "user_command": "sat1r ekle",
    "logic": "add insert new empty row bottom end table",
    "category": "add_row",
    "output": {
      "action": "add_row",
      "reply": "� Yeni sat1r eklendi",
      "changes": []
    }
  },
  {
    "user_command": "son sat1r1 sil",
    "logic": "delete remove last bottom row table",
    "category": "delete_rows",
    "output": {
      "action": "delete_rows",
      "target": "last",
      "reply": "=� Son sat1r silindi",
      "changes": []
    }
  },
  {
    "user_command": "kdv hesapla",
    "logic": "calculate VAT 18% on price column",
    "category": "muhasebe",
    "output": {
      "action": "update_cells",
      "formula": "=B2*1.18",
      "reply": " KDV dahil tutarlar hesapland1 (%18 KDV uyguland1).",
      "changes": []
    }
  },
  {
    "user_command": "net tutar1 bul",
    "logic": "calculate net amount by removing VAT",
    "category": "muhasebe",
    "output": {
      "action": "update_cells",
      "formula": "=B2/1.18",
      "reply": " KDV hari� net tutarlar hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "sgk primlerini topla",
    "logic": "sum SGK premium column",
    "category": "bordro",
    "output": {
      "action": "sum",
      "column": "SGK Primi",
      "reply": " Toplam SGK primi hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "gelir vergisi kesintilerini topla",
    "logic": "sum income tax deduction column",
    "category": "bordro",
    "output": {
      "action": "sum",
      "column": "Gelir Vergisi",
      "reply": " Toplam gelir vergisi kesintileri hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "stok deerini hesapla",
    "logic": "calculate total stock value by multiplying quantity and unit price",
    "category": "stok",
    "output": {
      "action": "update_cells",
      "formula": "=B2*C2",
      "reply": " Stok deerleri hesapland1 (Miktar � Birim Fiyat).",
      "changes": []
    }
  },
  {
    "user_command": "toplam stok deeri ne kadar",
    "logic": "sum total inventory value column",
    "category": "stok",
    "output": {
      "action": "sum",
      "column": "Stok Deeri",
      "reply": " Toplam stok deeri hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "kritik stok alt1ndakileri filtrele",
    "logic": "filter rows where stock quantity is less than minimum stock level",
    "category": "stok",
    "output": {
      "action": "filter",
      "condition": "less_than",
      "column": "Stok Miktar1",
      "value": "Minimum Stok",
      "reply": " Kritik stok seviyesinin alt1ndaki �r�nler filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "toplam alacak hesapla",
    "logic": "sum total receivables column",
    "category": "muhasebe",
    "output": {
      "action": "sum",
      "column": "Alacak",
      "reply": " Toplam alacak miktar1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "iskonto uygula",
    "logic": "apply 10% discount to price column",
    "category": "sat1_",
    "output": {
      "action": "update_cells",
      "formula": "=B2*0.90",
      "reply": " %10 iskonto uyguland1.",
      "changes": []
    }
  },
  {
    "user_command": "indirimli fiyatlar1 hesapla",
    "logic": "calculate discounted prices from original price and discount rate",
    "category": "sat1_",
    "output": {
      "action": "update_cells",
      "formula": "=B2*(1-C2)",
      "reply": " 0ndirimli fiyatlar hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "geciken teslimatlar1 listele",
    "logic": "filter rows where actual delivery date is after expected delivery date",
    "category": "tedarik",
    "output": {
      "action": "filter",
      "condition": "greater_than",
      "column": "Ger�ek Teslim",
      "value": "Planlanan Teslim",
      "reply": " Geciken teslimatlar listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "depo doluluk oran1n1 hesapla",
    "logic": "calculate warehouse occupancy rate",
    "category": "depo",
    "output": {
      "action": "update_cells",
      "formula": "=B2/C2*100",
      "reply": " Depo doluluk oranlar1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "e-fatura olanlar1 filtrele",
    "logic": "filter rows where invoice type is e-invoice",
    "category": "muhasebe",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "Fatura Tipi",
      "value": "E-Fatura",
      "reply": " E-fatura kay1tlar1 filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "yeni sat1r ekle",
    "logic": "add a new empty row at the end of data",
    "category": "veri",
    "output": {
      "action": "add_row",
      "reply": "� Yeni bir bo_ sat1r eklendi.",
      "changes": []
    }
  },
  {
    "user_command": "filtreyi kald1r",
    "logic": "remove all active filters from dataset",
    "category": "filtre",
    "output": {
      "action": "remove_filter",
      "reply": " T�m filtreler kald1r1ld1, t�m veriler g�steriliyor.",
      "changes": []
    }
  },
  {
    "user_command": "1000 alt1 tutarlar1 filtrele",
    "logic": "filter rows where amount is less than 1000",
    "category": "muhasebe",
    "output": {
      "action": "filter",
      "condition": "less_than",
      "column": "Tutar",
      "value": "1000",
      "reply": " 1000'in alt1ndaki tutarlar filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "2024 y1l1 kay1tlar1n1 filtrele",
    "logic": "filter rows where year is 2024",
    "category": "muhasebe",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "Y1l",
      "value": "2024",
      "reply": " 2024 y1l1na ait kay1tlar filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "kargo bekleyenleri filtrele",
    "logic": "filter rows where shipment status is awaiting shipment",
    "category": "depo",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "Kargo Durumu",
      "value": "Kargoda",
      "reply": " Kargo bekleyen sipari_ler filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "toplam gider nedir",
    "logic": "sum total expenses column",
    "category": "muhasebe",
    "output": {
      "action": "sum",
      "column": "Gider",
      "reply": " Toplam gider tutar1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "toplam gelir ne kadar",
    "logic": "sum total revenue column",
    "category": "muhasebe",
    "output": {
      "action": "sum",
      "column": "Gelir",
      "reply": " Toplam gelir tutar1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "maksimum stok seviyesi ne",
    "logic": "find maximum stock level",
    "category": "stok",
    "output": {
      "action": "max",
      "column": "Stok Seviyesi",
      "reply": " En y�ksek stok seviyesi bulundu.",
      "changes": []
    }
  },
  {
    "user_command": "toplam iade tutar1",
    "logic": "sum total return amount column",
    "category": "sat1_",
    "output": {
      "action": "sum",
      "column": "0ade Tutar1",
      "reply": " Toplam iade tutar1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "zarar eden sat1rlar1 k1rm1z1ya boya",
    "logic": "highlight rows with negative profit in red",
    "category": "g�rsel",
    "output": {
      "action": "highlight",
      "condition": "less_than_zero",
      "color": "#FF0000",
      "reply": " Zarar eden sat1rlar k1rm1z1ya boyand1.",
      "changes": []
    }
  },
  {
    "user_command": "negatif bakiyeleri vurgula",
    "logic": "highlight cells with negative balance values",
    "category": "muhasebe",
    "output": {
      "action": "highlight",
      "condition": "less_than_zero",
      "color": "#FF0000",
      "reply": " Negatif bakiyeli sat1rlar vurguland1.",
      "changes": []
    }
  },
  {
    "user_command": "kdv 20 olan faturalar1 listele",
    "logic": "filter rows where VAT rate is 20%",
    "category": "muhasebe",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "KDV Oran1",
      "value": "20",
      "reply": " %20 KDV oran1na sahip faturalar listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "stopaj kesintilerini hesapla",
    "logic": "calculate withholding tax deductions",
    "category": "muhasebe",
    "output": {
      "action": "update_cells",
      "formula": "=B2*0.20",
      "reply": " Stopaj kesintileri hesapland1 (%20).",
      "changes": []
    }
  },
  {
    "user_command": "amortisman tutarlar1n1 topla",
    "logic": "sum depreciation amounts column",
    "category": "muhasebe",
    "output": {
      "action": "sum",
      "column": "Amortisman",
      "reply": " Toplam amortisman tutarlar1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "fire oran1n1 hesapla",
    "logic": "calculate waste rate as percentage of production",
    "category": "depo",
    "output": {
      "action": "update_cells",
      "formula": "=B2/C2*100",
      "reply": " Fire oranlar1 y�zde olarak hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "telefon numaras1 olmayanlar1 listele",
    "logic": "filter rows where phone number is empty",
    "category": "veri",
    "output": {
      "action": "filter",
      "condition": "is_empty",
      "column": "Telefon",
      "value": "",
      "reply": " Telefon numaras1 girilmemi_ kay1tlar listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "toplam geliri hesapla",
    "logic": "sum total revenue column",
    "category": "e-ticaret",
    "output": {
      "action": "sum",
      "column": "Gelir",
      "reply": " Toplam gelir hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "toplam iade say1s1n1 bul",
    "logic": "count total returned orders",
    "category": "e-ticaret",
    "output": {
      "action": "count",
      "column": "0ade",
      "reply": " Toplam iade say1s1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "kargo takip numaras1 olmayanlar1 filtrele",
    "logic": "filter rows where tracking number is empty",
    "category": "e-ticaret",
    "output": {
      "action": "filter",
      "condition": "is_empty",
      "column": "Kargo Takip No",
      "value": "",
      "reply": " Kargo takip numaras1 girilmemi_ sipari_ler listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "beklenen maliyeti hesapla",
    "logic": "calculate expected cost per task",
    "category": "proje",
    "output": {
      "action": "update_cells",
      "formula": "=B2*C2",
      "reply": " Beklenen maliyet hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "gecikmeli teslimatlar1 k1rm1z1ya boya",
    "logic": "highlight late deliveries in red",
    "category": "lojistik",
    "output": {
      "action": "highlight",
      "condition": "equals",
      "column": "Gecikme",
      "value": "Evet",
      "color": "#fecaca",
      "reply": " Gecikmeli teslimatlar k1rm1z1yla i_aretlendi.",
      "changes": []
    }
  },
  {
    "user_command": "toplam kargo maliyetini hesapla",
    "logic": "sum total shipping cost",
    "category": "lojistik",
    "output": {
      "action": "sum",
      "column": "Kargo Maliyeti",
      "reply": " Toplam kargo maliyeti hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "en uzun teslimat1 bul",
    "logic": "find shipment with maximum delivery days",
    "category": "lojistik",
    "output": {
      "action": "max",
      "column": "Teslimat G�n�",
      "reply": " En uzun teslimat s�resi bulundu.",
      "changes": []
    }
  },
  {
    "user_command": "iade edilen paketleri listele",
    "logic": "filter returned packages",
    "category": "lojistik",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "Durum",
      "value": "0ade",
      "reply": " 0ade edilen paketler listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "teslimat maliyeti en az olan rotay1 bul",
    "logic": "find route with minimum delivery cost",
    "category": "lojistik",
    "output": {
      "action": "min",
      "column": "Maliyet",
      "reply": " En d�_�k maliyetli rota bulundu.",
      "changes": []
    }
  },
  {
    "user_command": "tekrarlayan takip numaralar1n1 temizle",
    "logic": "remove duplicate tracking numbers",
    "category": "lojistik",
    "output": {
      "action": "remove_duplicates",
      "column": "Takip Numaras1",
      "reply": " Yinelenen takip numaralar1 kald1r1ld1.",
      "changes": []
    }
  },
  {
    "user_command": "toplam paket a1rl11n1 hesapla",
    "logic": "sum total package weight",
    "category": "lojistik",
    "output": {
      "action": "sum",
      "column": "A1rl1k",
      "reply": " Toplam paket a1rl11 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "en h1zl1 teslimat1 bul",
    "logic": "find shipment with minimum delivery time",
    "category": "lojistik",
    "output": {
      "action": "min",
      "column": "Teslimat S�resi",
      "reply": " En h1zl1 teslimat bulundu.",
      "changes": []
    }
  },
  {
    "user_command": "depo doluluk oran1n1 hesapla",
    "logic": "calculate warehouse occupancy rate",
    "category": "lojistik",
    "output": {
      "action": "update_cells",
      "formula": "=B2/C2*100",
      "reply": " Depo doluluk oranlar1 y�zde olarak hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "ortalama kargo maliyetini hesapla",
    "logic": "calculate average shipping cost",
    "category": "lojistik",
    "output": {
      "action": "average",
      "column": "Kargo Maliyeti",
      "reply": " Ortalama kargo maliyeti hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "en pahal1 kargo rotas1n1 bul",
    "logic": "find route with maximum shipping cost",
    "category": "lojistik",
    "output": {
      "action": "max",
      "column": "Kargo Maliyeti",
      "reply": " En pahal1 kargo rotas1 bulundu.",
      "changes": []
    }
  },
  {
    "user_command": "teslimat say1s1n1 say",
    "logic": "count number of deliveries",
    "category": "lojistik",
    "output": {
      "action": "count",
      "column": "Teslimat No",
      "reply": " Toplam teslimat say1s1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "kargo filtrelerini kald1r",
    "logic": "remove all shipment filters",
    "category": "lojistik",
    "output": {
      "action": "remove_filter",
      "reply": " Kargo filtreleri kald1r1ld1.",
      "changes": []
    }
  },
  {
    "user_command": "toplam ders saatini hesapla",
    "logic": "sum total class hours",
    "category": "eitim",
    "output": {
      "action": "sum",
      "column": "Ders Saati",
      "reply": " Toplam ders saati hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "ortalama devams1zl11 hesapla",
    "logic": "calculate average absences",
    "category": "eitim",
    "output": {
      "action": "average",
      "column": "Devams1zl1k",
      "reply": " Ortalama devams1zl1k hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "ara s1nav notu 50 alt1ndakileri vurgula",
    "logic": "highlight midterm grades below 50",
    "category": "eitim",
    "output": {
      "action": "highlight",
      "condition": "less_than",
      "column": "Ara S1nav",
      "value": "50",
      "color": "#fecaca",
      "reply": " D�_�k ara s1nav notlar1 k1rm1z1ya boyand1.",
      "changes": []
    }
  },
  {
    "user_command": "toplam burs miktar1n1 hesapla",
    "logic": "sum total scholarship amounts",
    "category": "eitim",
    "output": {
      "action": "sum",
      "column": "Burs Miktar1",
      "reply": " Toplam burs miktar1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "eitim filtrelerini kald1r",
    "logic": "remove all education filters",
    "category": "eitim",
    "output": {
      "action": "remove_filter",
      "reply": " Eitim filtreleri kald1r1ld1.",
      "changes": []
    }
  },
  {
    "user_command": "aktif kampanyalar1 filtrele",
    "logic": "filter active marketing campaigns",
    "category": "pazarlama",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "Durum",
      "value": "Aktif",
      "reply": " Aktif kampanyalar listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "toplam reklam harcamas1n1 hesapla",
    "logic": "sum total advertising spend",
    "category": "pazarlama",
    "output": {
      "action": "sum",
      "column": "Reklam Harcamas1",
      "reply": " Toplam reklam harcamas1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "en iyi performansl1 kanal1 bul",
    "logic": "find channel with maximum conversions",
    "category": "pazarlama",
    "output": {
      "action": "max",
      "column": "D�n�_�m",
      "reply": " En iyi performansl1 kanal bulundu.",
      "changes": []
    }
  },
  {
    "user_command": "sosyal medya kampanyalar1n1 filtrele",
    "logic": "filter social media campaigns",
    "category": "pazarlama",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "Kanal",
      "value": "Sosyal Medya",
      "reply": " Sosyal medya kampanyalar1 listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "iptal edilen kampanyalar1 sil",
    "logic": "delete cancelled campaigns",
    "category": "pazarlama",
    "output": {
      "action": "delete_rows",
      "condition": "equals",
      "column": "Durum",
      "value": "0ptal",
      "reply": " 0ptal edilen kampanyalar silindi.",
      "changes": []
    }
  },
  {
    "user_command": "tekrarlayan kampanya isimlerini kald1r",
    "logic": "remove duplicate campaign names",
    "category": "pazarlama",
    "output": {
      "action": "remove_duplicates",
      "column": "Kampanya Ad1",
      "reply": " Yinelenen kampanya isimleri kald1r1ld1.",
      "changes": []
    }
  },
  {
    "user_command": "google reklam kampanyalar1n1 listele",
    "logic": "filter Google Ads campaigns",
    "category": "pazarlama",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "Platform",
      "value": "Google Ads",
      "reply": " Google Ads kampanyalar1 listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "instagram kampanyalar1n1 filtrele",
    "logic": "filter Instagram campaigns",
    "category": "pazarlama",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "Platform",
      "value": "Instagram",
      "reply": " Instagram kampanyalar1 listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "kampanya say1s1n1 hesapla",
    "logic": "count total number of campaigns",
    "category": "pazarlama",
    "output": {
      "action": "count",
      "column": "Kampanya No",
      "reply": " Toplam kampanya say1s1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "pazarlama filtrelerini kald1r",
    "logic": "remove all marketing filters",
    "category": "pazarlama",
    "output": {
      "action": "remove_filter",
      "reply": " Pazarlama filtreleri kald1r1ld1.",
      "changes": []
    }
  },
  {
    "user_command": "sezonluk kampanyalar1 filtrele",
    "logic": "filter seasonal campaigns",
    "category": "pazarlama",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "T�r",
      "value": "Sezonluk",
      "reply": " Sezonluk kampanyalar listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "en az t1klanma alan kampanyay1 bul",
    "logic": "find campaign with minimum clicks",
    "category": "pazarlama",
    "output": {
      "action": "min",
      "column": "T1klanma",
      "reply": " En az t1klanan kampanya bulundu.",
      "changes": []
    }
  },
  {
    "user_command": "sona eren kampanyalar1 listele",
    "logic": "filter expired campaigns",
    "category": "pazarlama",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "Durum",
      "value": "Sona Erdi",
      "reply": " Sona eren kampanyalar listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "twitter kampanyalar1n1 filtrele",
    "logic": "filter Twitter/X campaigns",
    "category": "pazarlama",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "Platform",
      "value": "Twitter",
      "reply": " Twitter kampanyalar1 listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "kapat1lan talepleri sil",
    "logic": "delete closed requests",
    "category": "m�_teri",
    "output": {
      "action": "delete_rows",
      "condition": "equals",
      "column": "Durum",
      "value": "Kapat1ld1",
      "reply": " Kapat1lan talepler silindi.",
      "changes": []
    }
  },
  {
    "user_command": "teknik destek taleplerini filtrele",
    "logic": "filter technical support requests",
    "category": "m�_teri",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "Kategori",
      "value": "Teknik Destek",
      "reply": " Teknik destek talepleri listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "canl1 destek taleplerini listele",
    "logic": "filter live chat support requests",
    "category": "m�_teri",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "Kanal",
      "value": "Canl1 Destek",
      "reply": " Canl1 destek talepleri listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "memnuniyet puan1 3 alt1ndakileri vurgula",
    "logic": "highlight satisfaction scores below 3",
    "category": "m�_teri",
    "output": {
      "action": "highlight",
      "condition": "less_than",
      "column": "Memnuniyet Puan1",
      "value": "3",
      "color": "#fecaca",
      "reply": " D�_�k memnuniyet puanl1 talepler k1rm1z1ya boyand1.",
      "changes": []
    }
  },
  {
    "user_command": "ortalama memnuniyet puan1n1 hesapla",
    "logic": "calculate average customer satisfaction score",
    "category": "m�_teri",
    "output": {
      "action": "average",
      "column": "Memnuniyet Puan1",
      "reply": " Ortalama memnuniyet puan1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "geciken yan1tlar1 vurgula",
    "logic": "highlight late responses in orange",
    "category": "m�_teri",
    "output": {
      "action": "highlight",
      "condition": "equals",
      "column": "Yan1t Durumu",
      "value": "Gecikmeli",
      "color": "#fed7aa",
      "reply": " Gecikmeli yan1tlar turuncu ile i_aretlendi.",
      "changes": []
    }
  },
  {
    "user_command": "iptal edilen randevular1 listele",
    "logic": "filter cancelled appointments",
    "category": "sal1k",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "Durum",
      "value": "0ptal",
      "reply": " 0ptal edilen randevular listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "toplam hasta say1s1n1 hesapla",
    "logic": "count total number of patients",
    "category": "sal1k",
    "output": {
      "action": "count",
      "column": "Hasta No",
      "reply": " Toplam hasta say1s1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "kritik hastalar1 k1rm1z1ya boya",
    "logic": "highlight critical patients in red",
    "category": "sal1k",
    "output": {
      "action": "highlight",
      "condition": "equals",
      "column": "Durum",
      "value": "Kritik",
      "reply": " Kritik hastalar k1rm1z1ya boyand1.",
      "changes": []
    }
  },
  {
    "user_command": "yatan hastalar1 filtrele",
    "logic": "filter hospitalized patients",
    "category": "sal1k",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "Tip",
      "value": "Yatan",
      "reply": " Yatan hastalar listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "tekrarlayan hasta numaralar1n1 kald1r",
    "logic": "remove duplicate patient IDs",
    "category": "sal1k",
    "output": {
      "action": "remove_duplicates",
      "column": "Hasta No",
      "reply": " Yinelenen hasta numaralar1 kald1r1ld1.",
      "changes": []
    }
  },
  {
    "user_command": "toplam tedavi maliyetini hesapla",
    "logic": "sum total treatment cost",
    "category": "sal1k",
    "output": {
      "action": "sum",
      "column": "Tedavi Maliyeti",
      "reply": " Toplam tedavi maliyeti hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "ameliyathane kay1tlar1n1 filtrele",
    "logic": "filter operating room records",
    "category": "sal1k",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "B�l�m",
      "value": "Ameliyathane",
      "reply": " Ameliyathane kay1tlar1 listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "kronik hastalar1 vurgula",
    "logic": "highlight chronic disease patients",
    "category": "sal1k",
    "output": {
      "action": "highlight",
      "condition": "equals",
      "column": "Hastal1k Tipi",
      "value": "Kronik",
      "color": "#fed7aa",
      "reply": " Kronik hastalar turuncu ile i_aretlendi.",
      "changes": []
    }
  },
  {
    "user_command": "sal1k filtrelerini kald1r",
    "logic": "remove all health filters",
    "category": "sal1k",
    "output": {
      "action": "remove_filter",
      "reply": " Sal1k filtreleri kald1r1ld1.",
      "changes": []
    }
  },
  {
    "user_command": "en pahal1 tedaviyi bul",
    "logic": "find treatment with maximum cost",
    "category": "sal1k",
    "output": {
      "action": "max",
      "column": "Tedavi Maliyeti",
      "reply": " En pahal1 tedavi bulundu.",
      "changes": []
    }
  },
  {
    "user_command": "ortalama kira bedelini hesapla",
    "logic": "calculate average rental price",
    "category": "gayrimenkul",
    "output": {
      "action": "average",
      "column": "Kira",
      "reply": " Ortalama kira bedeli hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "3+1 daireleri filtrele",
    "logic": "filter 3+1 bedroom apartments",
    "category": "gayrimenkul",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "Oda Say1s1",
      "value": "3+1",
      "reply": " 3+1 daireler listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "2+1 daireleri listele",
    "logic": "filter 2+1 bedroom apartments",
    "category": "gayrimenkul",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "Oda Say1s1",
      "value": "2+1",
      "reply": " 2+1 daireler listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "tekrarlayan ilan numaralar1n1 kald1r",
    "logic": "remove duplicate listing numbers",
    "category": "gayrimenkul",
    "output": {
      "action": "remove_duplicates",
      "column": "0lan No",
      "reply": " Yinelenen ilan numaralar1 kald1r1ld1.",
      "changes": []
    }
  },
  {
    "user_command": "eski ilanlar1 sil",
    "logic": "delete expired property listings",
    "category": "gayrimenkul",
    "output": {
      "action": "delete_rows",
      "condition": "equals",
      "column": "Durum",
      "value": "S�resi Dolmu_",
      "reply": " S�resi dolmu_ ilanlar silindi.",
      "changes": []
    }
  },
  {
    "user_command": "villa ilanlar1n1 filtrele",
    "logic": "filter villa listings",
    "category": "gayrimenkul",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "M�lk Tipi",
      "value": "Villa",
      "reply": " Villa ilanlar1 listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "ortalama metrekareyi hesapla",
    "logic": "calculate average square meters",
    "category": "gayrimenkul",
    "output": {
      "action": "average",
      "column": "m�",
      "reply": " Ortalama metrekare hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "gayrimenkul filtrelerini kald1r",
    "logic": "remove all real estate filters",
    "category": "gayrimenkul",
    "output": {
      "action": "remove_filter",
      "reply": " Gayrimenkul filtreleri kald1r1ld1.",
      "changes": []
    }
  },
  {
    "user_command": "ilan say1s1n1 say",
    "logic": "count total property listings",
    "category": "gayrimenkul",
    "output": {
      "action": "count",
      "column": "0lan No",
      "reply": " Toplam ilan say1s1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "toplam hasat miktar1n1 hesapla",
    "logic": "sum total harvest quantity",
    "category": "tar1m",
    "output": {
      "action": "sum",
      "column": "Hasat Miktar1",
      "reply": " Toplam hasat miktar1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "ortalama tarla alan1n1 hesapla",
    "logic": "calculate average field area",
    "category": "tar1m",
    "output": {
      "action": "average",
      "column": "Alan (D�n�m)",
      "reply": " Ortalama tarla alan1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "hastal1kl1 alanlar1 k1rm1z1ya boya",
    "logic": "highlight diseased crop areas in red",
    "category": "tar1m",
    "output": {
      "action": "highlight",
      "condition": "equals",
      "column": "Sal1k",
      "value": "Hastal1kl1",
      "color": "#fecaca",
      "reply": " Hastal1kl1 alanlar k1rm1z1ya boyand1.",
      "changes": []
    }
  },
  {
    "user_command": "sulama yap1lan alanlar1 filtrele",
    "logic": "filter irrigated fields",
    "category": "tar1m",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "Sulama",
      "value": "Var",
      "reply": " Sulama yap1lan alanlar listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "tarla say1s1n1 say",
    "logic": "count total number of fields",
    "category": "tar1m",
    "output": {
      "action": "count",
      "column": "Tarla No",
      "reply": " Toplam tarla say1s1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "tekrarlayan tarla numaralar1n1 kald1r",
    "logic": "remove duplicate field numbers",
    "category": "tar1m",
    "output": {
      "action": "remove_duplicates",
      "column": "Tarla No",
      "reply": " Yinelenen tarla numaralar1 kald1r1ld1.",
      "changes": []
    }
  },
  {
    "user_command": "tar1m filtrelerini kald1r",
    "logic": "remove all agriculture filters",
    "category": "tar1m",
    "output": {
      "action": "remove_filter",
      "reply": " Tar1m filtreleri kald1r1ld1.",
      "changes": []
    }
  },
  {
    "user_command": "toplam tarla alan1n1 hesapla",
    "logic": "sum total field area",
    "category": "tar1m",
    "output": {
      "action": "sum",
      "column": "Alan",
      "reply": " Toplam tarla alan1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "sulama maliyetini hesapla",
    "logic": "calculate irrigation cost per field",
    "category": "tar1m",
    "output": {
      "action": "update_cells",
      "formula": "=B2*C2",
      "reply": " Sulama maliyetleri hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "ekim yap1lmayan tarlalara filtrele",
    "logic": "filter unplanted fields",
    "category": "tar1m",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "Durum",
      "value": "Bo_",
      "reply": " Ekim yap1lmayan tarlalar listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "izin kullananlar1 listele",
    "logic": "filter employees on leave",
    "category": "ik",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "Durum",
      "value": "0zinde",
      "reply": " 0zindeki �al1_anlar listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "tekrarlayan sicil numaralar1n1 kald1r",
    "logic": "remove duplicate employee ID numbers",
    "category": "ik",
    "output": {
      "action": "remove_duplicates",
      "column": "Sicil No",
      "reply": " Yinelenen sicil numaralar1 kald1r1ld1.",
      "changes": []
    }
  },
  {
    "user_command": "insan kaynaklar1 filtrelerini kald1r",
    "logic": "remove all HR filters",
    "category": "ik",
    "output": {
      "action": "remove_filter",
      "reply": " 0K filtreleri kald1r1ld1.",
      "changes": []
    }
  },
  {
    "user_command": "ortalama performans puan1n1 hesapla",
    "logic": "calculate average performance score",
    "category": "ik",
    "output": {
      "action": "average",
      "column": "Performans Puan1",
      "reply": " Ortalama performans puan1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "toplam geliri hesapla",
    "logic": "sum total income",
    "category": "finans",
    "output": {
      "action": "sum",
      "column": "Gelir",
      "reply": " Toplam gelir hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "toplam gideri hesapla",
    "logic": "sum total expenses",
    "category": "finans",
    "output": {
      "action": "sum",
      "column": "Gider",
      "reply": " Toplam gider hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "ortalama ayl1k gideri hesapla",
    "logic": "calculate average monthly expense",
    "category": "finans",
    "output": {
      "action": "average",
      "column": "Ayl1k Gider",
      "reply": " Ortalama ayl1k gider hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "tekrarlayan fatura numaralar1n1 kald1r",
    "logic": "remove duplicate invoice numbers",
    "category": "finans",
    "output": {
      "action": "remove_duplicates",
      "column": "Fatura No",
      "reply": " Yinelenen fatura numaralar1 kald1r1ld1.",
      "changes": []
    }
  },
  {
    "user_command": "finans filtrelerini kald1r",
    "logic": "remove all financial filters",
    "category": "finans",
    "output": {
      "action": "remove_filter",
      "reply": " Finans filtreleri kald1r1ld1.",
      "changes": []
    }
  },
  {
    "user_command": "toplam fatura miktar1n1 hesapla",
    "logic": "sum total invoice amount",
    "category": "finans",
    "output": {
      "action": "sum",
      "column": "Fatura Tutar1",
      "reply": " Toplam fatura tutar1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "fatura say1s1n1 say",
    "logic": "count total number of invoices",
    "category": "finans",
    "output": {
      "action": "count",
      "column": "Fatura No",
      "reply": " Toplam fatura say1s1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "ortalama fatura tutar1n1 hesapla",
    "logic": "calculate average invoice amount",
    "category": "finans",
    "output": {
      "action": "average",
      "column": "Fatura Tutar1",
      "reply": " Ortalama fatura tutar1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "uzun vadeli giderleri filtrele",
    "logic": "filter long-term expense items",
    "category": "finans",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "Vade",
      "value": "Uzun Vadeli",
      "reply": " Uzun vadeli giderler listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "gelir gider fark1n1 hesapla",
    "logic": "calculate net difference between income and expense",
    "category": "finans",
    "output": {
      "action": "update_cells",
      "formula": "=B2-C2",
      "reply": " Gelir-gider fark1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "ortalama deeri hesapla",
    "logic": "calculate average of value column",
    "category": "veri",
    "output": {
      "action": "average",
      "column": "Deer",
      "reply": " Ortalama deer hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "toplam deeri hesapla",
    "logic": "sum value column",
    "category": "veri",
    "output": {
      "action": "sum",
      "column": "Deer",
      "reply": " Toplam deer hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "s1f1r olan deerleri filtrele",
    "logic": "filter rows where value is zero",
    "category": "veri",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "Deer",
      "value": "0",
      "reply": " Deeri s1f1r olan sat1rlar listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "negatif deerleri vurgula",
    "logic": "highlight negative values in red",
    "category": "veri",
    "output": {
      "action": "highlight",
      "condition": "less_than",
      "column": "Deer",
      "value": "0",
      "color": "#fecaca",
      "reply": " Negatif deerler k1rm1z1ya boyand1.",
      "changes": []
    }
  },
  {
    "user_command": "veriyi yenile",
    "logic": "display data refresh message",
    "category": "veri",
    "output": {
      "action": "message",
      "reply": "= Veriler yenilendi. G�ncel tablo g�sterilmektedir.",
      "changes": []
    }
  },
  {
    "user_command": "ondal1kl1 deerleri yuvarlat",
    "logic": "round decimal values to nearest integer",
    "category": "veri",
    "output": {
      "action": "update_cells",
      "formula": "=ROUND(B2,0)",
      "reply": " Deerler tam say1ya yuvarland1.",
      "changes": []
    }
  },
  {
    "user_command": "ilk 10 sat1r1 mavi yap",
    "logic": "highlight first 10 rows in blue",
    "category": "g�rsel",
    "output": {
      "action": "highlight",
      "condition": "top_5",
      "column": "S1ra",
      "color": "#bfdbfe",
      "reply": " 0lk sat1rlar mavi ile i_aretlendi.",
      "changes": []
    }
  },
  {
    "user_command": "hedef alt1ndakileri k1rm1z1ya boya",
    "logic": "highlight rows below target in red",
    "category": "g�rsel",
    "output": {
      "action": "highlight",
      "condition": "less_than",
      "column": "Hedef",
      "value": "100",
      "color": "#fecaca",
      "reply": " Hedef alt1ndaki sat1rlar k1rm1z1ya boyand1.",
      "changes": []
    }
  },
  {
    "user_command": "vurgulama renklerini kald1r",
    "logic": "remove all highlight colors",
    "category": "g�rsel",
    "output": {
      "action": "remove_filter",
      "reply": " T�m vurgulama renkleri kald1r1ld1.",
      "changes": []
    }
  },
  {
    "user_command": "orta risk sat1rlar1n1 sar1ya boya",
    "logic": "highlight medium risk rows in yellow",
    "category": "g�rsel",
    "output": {
      "action": "highlight",
      "condition": "equals",
      "column": "Risk",
      "value": "Orta",
      "color": "#fef08a",
      "reply": " Orta riskli sat1rlar sar1ya boyand1.",
      "changes": []
    }
  },
  {
    "user_command": "pasif kay1tlar1 gri yap",
    "logic": "highlight inactive records in gray",
    "category": "g�rsel",
    "output": {
      "action": "highlight",
      "condition": "equals",
      "column": "Durum",
      "value": "Pasif",
      "color": "#e5e7eb",
      "reply": " Pasif kay1tlar gri ile i_aretlendi.",
      "changes": []
    }
  },
  {
    "user_command": "beklemedeki sat1rlar1 sar1ya boya",
    "logic": "highlight pending rows in yellow",
    "category": "g�rsel",
    "output": {
      "action": "highlight",
      "condition": "equals",
      "column": "Durum",
      "value": "Bekliyor",
      "color": "#fef08a",
      "reply": " Beklemedeki sat1rlar sar1ya boyand1.",
      "changes": []
    }
  },
  {
    "user_command": "yeni kay1tlar1 mavi vurgula",
    "logic": "highlight new records in blue",
    "category": "g�rsel",
    "output": {
      "action": "highlight",
      "condition": "equals",
      "column": "T�r",
      "value": "Yeni",
      "color": "#bfdbfe",
      "reply": " Yeni kay1tlar mavi ile vurguland1.",
      "changes": []
    }
  },
  {
    "user_command": "silinen kay1tlar1 gri yap",
    "logic": "highlight deleted records in gray",
    "category": "g�rsel",
    "output": {
      "action": "highlight",
      "condition": "equals",
      "column": "T�r",
      "value": "Silindi",
      "color": "#e5e7eb",
      "reply": " Silinen kay1tlar gri ile i_aretlendi.",
      "changes": []
    }
  },
  {
    "user_command": "tabloyu s1f1rla",
    "logic": "reset table to original state",
    "category": "veri",
    "output": {
      "action": "remove_filter",
      "reply": " Tablo s1f1rland1, t�m kay1tlar g�sterildi.",
      "changes": []
    }
  },
  {
    "user_command": "bu haftan1n verilerini filtrele",
    "logic": "filter data from this week",
    "category": "veri",
    "output": {
      "action": "filter",
      "condition": "greater_than",
      "column": "Tarih",
      "value": "2026-05-11",
      "reply": " Bu haftan1n verileri listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "veriyi alfabetik s1rala",
    "logic": "sort data alphabetically ascending",
    "category": "veri",
    "output": {
      "action": "sort",
      "column": "Ad",
      "direction": "asc",
      "reply": " Veriler alfabetik s1raland1.",
      "changes": []
    }
  },
  {
    "user_command": "tablodaki say1sal toplam1 hesapla",
    "logic": "sum all numeric values in column",
    "category": "veri",
    "output": {
      "action": "sum",
      "column": "Toplam",
      "reply": " Tablodaki say1sal toplam hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "artan s1rada listele",
    "logic": "sort data in ascending order",
    "category": "veri",
    "output": {
      "action": "sort",
      "column": "Deer",
      "direction": "asc",
      "reply": " Veriler artan s1rada listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "azalan s1rada listele",
    "logic": "sort data in descending order",
    "category": "veri",
    "output": {
      "action": "sort",
      "column": "Deer",
      "direction": "desc",
      "reply": " Veriler azalan s1rada listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "sadece aktif kay1tlar1 listele",
    "logic": "filter only active records",
    "category": "veri",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "Durum",
      "value": "Aktif",
      "reply": " Yaln1zca aktif kay1tlar listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "pasif kay1tlar1 gizle",
    "logic": "filter out inactive records",
    "category": "veri",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "Durum",
      "value": "Aktif",
      "reply": " Pasif kay1tlar gizlendi, yaln1zca aktifler g�sterildi.",
      "changes": []
    }
  },
  {
    "user_command": "son 3 ay1n verilerini filtrele",
    "logic": "filter data from last 3 months",
    "category": "veri",
    "output": {
      "action": "filter",
      "condition": "greater_than",
      "column": "Tarih",
      "value": "2026-02-17",
      "reply": " Son 3 ay1n verileri listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "bu y1l1n kay1tlar1n1 filtrele",
    "logic": "filter this year's records",
    "category": "date",
    "output": {
      "action": "filter",
      "column": "Tarih",
      "condition": "this_year",
      "value": "",
      "reply": " Bu y1l1n kay1tlar1 filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "tarihleri yeni olanlardan eskiye s1rala",
    "logic": "sort dates descending newest first",
    "category": "date",
    "output": {
      "action": "sort",
      "column": "Tarih",
      "direction": "desc",
      "reply": " Tarihler yeniden eskiye s1raland1.",
      "changes": []
    }
  },
  {
    "user_command": "tarihleri eskiden yeniye s1rala",
    "logic": "sort dates ascending oldest first",
    "category": "date",
    "output": {
      "action": "sort",
      "column": "Tarih",
      "direction": "asc",
      "reply": " Tarihler eskiden yeniye s1raland1.",
      "changes": []
    }
  },
  {
    "user_command": "ocak ay1 kay1tlar1n1 getir",
    "logic": "get January records",
    "category": "date",
    "output": {
      "action": "filter",
      "column": "Tarih",
      "condition": "month_equals",
      "value": "1",
      "reply": " Ocak ay1 kay1tlar1 listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "tarihe ay ekle",
    "logic": "add months to a date using formula",
    "category": "date",
    "output": {
      "action": "generate_formula",
      "formula": "=EDATE(A2,3)",
      "targetCell": "B2",
      "reply": " Tarihe ay ekleme form�l� olu_turuldu.",
      "changes": []
    }
  },
  {
    "user_command": "kategori bazl1 pasta grafii yap",
    "logic": "create pie chart by category",
    "category": "chart",
    "output": {
      "action": "message",
      "reply": "=� Kategori bazl1 pasta grafii olu_turuldu.",
      "changes": []
    }
  },
  {
    "user_command": "Excel olarak kaydet",
    "logic": "save data as Excel file",
    "category": "export",
    "output": {
      "action": "message",
      "reply": " Dosya Excel format1nda kaydedildi.",
      "changes": []
    }
  },
  {
    "user_command": "verileri yazd1r",
    "logic": "print the data sheet",
    "category": "export",
    "output": {
      "action": "message",
      "reply": " Yazd1rma i_lemi ba_lat1ld1.",
      "changes": []
    }
  },
  {
    "user_command": "Airtable'a aktar",
    "logic": "export data to Airtable",
    "category": "export",
    "output": {
      "action": "message",
      "reply": " Veriler Airtable'a aktar1ld1.",
      "changes": []
    }
  },
  {
    "user_command": "tablo olarak kopyala",
    "logic": "copy data as formatted table",
    "category": "export",
    "output": {
      "action": "message",
      "reply": " Tablo kopyaland1.",
      "changes": []
    }
  },
  {
    "user_command": "sayfay1 yazd1r",
    "logic": "print current page",
    "category": "export",
    "output": {
      "action": "message",
      "reply": " Sayfa yazd1r1ld1.",
      "changes": []
    }
  },
  {
    "user_command": "verileri yedekle",
    "logic": "backup all data",
    "category": "export",
    "output": {
      "action": "message",
      "reply": " Veriler yedeklendi.",
      "changes": []
    }
  },
  {
    "user_command": "txt format1nda kaydet",
    "logic": "save data in plain text format",
    "category": "export",
    "output": {
      "action": "message",
      "reply": " Veriler TXT format1nda kaydedildi.",
      "changes": []
    }
  },
  {
    "user_command": "verileri Notion'a aktar",
    "logic": "export data to Notion",
    "category": "export",
    "output": {
      "action": "message",
      "reply": " Veriler Notion'a aktar1ld1.",
      "changes": []
    }
  },
  {
    "user_command": "verileri indir",
    "logic": "download data file",
    "category": "export",
    "output": {
      "action": "message",
      "reply": " Veriler indirildi.",
      "changes": []
    }
  },
  {
    "user_command": "xlsx format1nda indir",
    "logic": "download as xlsx file",
    "category": "export",
    "output": {
      "action": "message",
      "reply": " XLSX dosyas1 indirildi.",
      "changes": []
    }
  },
  {
    "user_command": "renk skalas1 ekle",
    "logic": "add color scale to column",
    "category": "heatmap",
    "output": {
      "action": "message",
      "reply": "<� Renk skalas1 eklendi.",
      "changes": []
    }
  },
  {
    "user_command": "ayl1k veri 1s1 haritas1",
    "logic": "monthly data heatmap calendar view",
    "category": "heatmap",
    "output": {
      "action": "message",
      "reply": "<� Ayl1k 1s1 haritas1 olu_turuldu.",
      "changes": []
    }
  },
  {
    "user_command": "haftal1k performans 1s1 haritas1",
    "logic": "weekly performance heatmap",
    "category": "heatmap",
    "output": {
      "action": "message",
      "reply": "<� Haftal1k performans 1s1 haritas1 olu_turuldu.",
      "changes": []
    }
  },
  {
    "user_command": "3 renkli gradient uygula",
    "logic": "apply 3-color gradient scale",
    "category": "heatmap",
    "output": {
      "action": "message",
      "reply": "<� 3 renkli gradient uyguland1.",
      "changes": []
    }
  },
  {
    "user_command": "performans skorlar1 1s1 haritas1",
    "logic": "performance scores heatmap",
    "category": "heatmap",
    "output": {
      "action": "message",
      "reply": "<� Performans skorlar1 1s1 haritas1 olu_turuldu.",
      "changes": []
    }
  },
  {
    "user_command": "mavi beyaz k1rm1z1 gradyan uygula",
    "logic": "apply blue-white-red color scale gradient",
    "category": "heatmap",
    "output": {
      "action": "message",
      "reply": "<� Mavi-beyaz-k1rm1z1 gradyan uyguland1.",
      "changes": []
    }
  },
  {
    "user_command": "sat1c1 baz1nda grupla",
    "logic": "group by salesperson",
    "category": "group_by",
    "output": {
      "action": "message",
      "reply": "=� Sat1c1ya g�re grupland1.",
      "changes": []
    }
  },
  {
    "user_command": "haftal1k gruplama yap",
    "logic": "group data by week",
    "category": "group_by",
    "output": {
      "action": "message",
      "reply": "=� Haftal1k gruplama yap1ld1.",
      "changes": []
    }
  },
  {
    "user_command": "her kategorinin ortalama fiyat1n1 hesapla",
    "logic": "calculate average price per category",
    "category": "group_by",
    "output": {
      "action": "message",
      "reply": "=� Her kategorinin ortalama fiyat1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "marka baz1nda grupla",
    "logic": "group data by brand",
    "category": "group_by",
    "output": {
      "action": "message",
      "reply": "=� Marka baz1nda grupland1.",
      "changes": []
    }
  },
  {
    "user_command": "metin uzunluklar1n1 hesapla",
    "logic": "calculate length of each text cell",
    "category": "text",
    "output": {
      "action": "generate_formula",
      "formula": "=LEN(A2)",
      "targetCell": "B2",
      "reply": " Metin uzunluklar1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "en uzun metni bul",
    "logic": "find the longest text entry",
    "category": "text",
    "output": {
      "action": "message",
      "reply": " En uzun metin bulundu.",
      "changes": []
    }
  },
  {
    "user_command": "en k1sa metni bul",
    "logic": "find the shortest text entry",
    "category": "text",
    "output": {
      "action": "message",
      "reply": " En k1sa metin bulundu.",
      "changes": []
    }
  },
  {
    "user_command": "ad ve soyad1 ay1r",
    "logic": "separate full name into first and last name",
    "category": "text",
    "output": {
      "action": "transform",
      "column": "AdSoyad",
      "transform": "split_name",
      "reply": " Ad ve soyad ayr1ld1.",
      "changes": []
    }
  },
  {
    "user_command": "telefon numaralar1n1 formatla",
    "logic": "format phone numbers to standard format",
    "category": "text",
    "output": {
      "action": "transform",
      "column": "Telefon",
      "transform": "format_phone",
      "reply": " Telefon numaralar1 formatland1.",
      "changes": []
    }
  },
  {
    "user_command": "IBAN numaralar1n1 formatla",
    "logic": "format IBAN numbers with spaces",
    "category": "text",
    "output": {
      "action": "transform",
      "column": "IBAN",
      "transform": "format_iban",
      "reply": " IBAN numaralar1 formatland1.",
      "changes": []
    }
  },
  {
    "user_command": "metindeki rakamlar1 bul",
    "logic": "find and extract numbers from text",
    "category": "text",
    "output": {
      "action": "message",
      "reply": " Metindeki rakamlar bulundu.",
      "changes": []
    }
  },
  {
    "user_command": "tire ve noktalar1 kald1r",
    "logic": "remove dashes and dots from text",
    "category": "text",
    "output": {
      "action": "transform",
      "column": "Metin",
      "transform": "remove_punctuation",
      "reply": " Tire ve noktalar kald1r1ld1.",
      "changes": []
    }
  },
  {
    "user_command": "isim ara",
    "logic": "search for a specific name",
    "category": "search",
    "output": {
      "action": "filter",
      "column": "0sim",
      "condition": "contains",
      "value": "",
      "reply": " 0sim aramas1 yap1ld1.",
      "changes": []
    }
  },
  {
    "user_command": "negatif deerleri bul",
    "logic": "find all negative values",
    "category": "search",
    "output": {
      "action": "filter",
      "column": "Tutar",
      "condition": "less_than",
      "value": "0",
      "reply": " Negatif deerler bulundu.",
      "changes": []
    }
  },
  {
    "user_command": "s1f1r deerleri bul",
    "logic": "find all zero values",
    "category": "search",
    "output": {
      "action": "filter",
      "column": "Deer",
      "condition": "equals",
      "value": "0",
      "reply": " S1f1r deerler bulundu.",
      "changes": []
    }
  },
  {
    "user_command": "e-posta adresi ara",
    "logic": "search for specific email address",
    "category": "search",
    "output": {
      "action": "filter",
      "column": "Eposta",
      "condition": "contains",
      "value": "",
      "reply": " E-posta adresi arand1.",
      "changes": []
    }
  },
  {
    "user_command": "telefon numaras1 ara",
    "logic": "search for phone number",
    "category": "search",
    "output": {
      "action": "filter",
      "column": "Telefon",
      "condition": "contains",
      "value": "",
      "reply": " Telefon numaras1 arand1.",
      "changes": []
    }
  },
  {
    "user_command": "deer aral11nda ara",
    "logic": "search within value range",
    "category": "search",
    "output": {
      "action": "filter",
      "column": "Deer",
      "condition": "between",
      "value": "",
      "reply": " Deer aral11nda arama yap1ld1.",
      "changes": []
    }
  },
  {
    "user_command": "fatura numaras1 ara",
    "logic": "search for invoice number",
    "category": "search",
    "output": {
      "action": "filter",
      "column": "FaturaNo",
      "condition": "contains",
      "value": "",
      "reply": " Fatura numaras1 arand1.",
      "changes": []
    }
  },
  {
    "user_command": "anahtar kelimeyle ara",
    "logic": "search by keyword across all columns",
    "category": "search",
    "output": {
      "action": "filter",
      "column": "",
      "condition": "contains_any",
      "value": "",
      "reply": " Anahtar kelime aramas1 yap1ld1.",
      "changes": []
    }
  },
  {
    "user_command": "null deerleri bul",
    "logic": "find all null or empty values",
    "category": "search",
    "output": {
      "action": "filter",
      "column": "",
      "condition": "is_empty",
      "value": "",
      "reply": " Null deerler bulundu.",
      "changes": []
    }
  },
  {
    "user_command": "belirli bir tarihte olanlar1 bul",
    "logic": "find records on a specific date",
    "category": "search",
    "output": {
      "action": "filter",
      "column": "Tarih",
      "condition": "equals",
      "value": "",
      "reply": " Belirtilen tarihteki kay1tlar bulundu.",
      "changes": []
    }
  },
  {
    "user_command": "banka hareketlerini s1rala",
    "logic": "sort bank transactions by date",
    "category": "banka",
    "output": {
      "action": "sort",
      "column": "Tarih",
      "direction": "desc",
      "reply": " Banka hareketleri tarihe g�re s1raland1.",
      "changes": []
    }
  },
  {
    "user_command": "gelir gider bakiyesini hesapla",
    "logic": "calculate net balance from income and expenses",
    "category": "banka",
    "output": {
      "action": "sum",
      "column": "Tutar",
      "reply": " Gelir-gider bakiyesi hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "negatif bakiyeleri vurgula",
    "logic": "highlight rows with negative balance",
    "category": "banka",
    "output": {
      "action": "highlight",
      "column": "Bakiye",
      "condition": "less_than",
      "value": "0",
      "color": "#fca5a5",
      "reply": " Negatif bakiyeler k1rm1z1yla vurguland1.",
      "changes": []
    }
  },
  {
    "user_command": "hesap bakiyesini hesapla",
    "logic": "calculate total account balance",
    "category": "banka",
    "output": {
      "action": "sum",
      "column": "Tutar",
      "reply": " Hesap bakiyesi hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "kredi kart1 harcamalar1n1 topla",
    "logic": "sum all credit card expenses",
    "category": "banka",
    "output": {
      "action": "sum",
      "column": "Tutar",
      "condition": "equals",
      "conditionColumn": "Kaynak",
      "conditionValue": "KrediKart1",
      "reply": " Kredi kart1 harcamalar1 topland1.",
      "changes": []
    }
  },
  {
    "user_command": "banka masraflar1n1 topla",
    "logic": "sum all bank charges and fees",
    "category": "banka",
    "output": {
      "action": "sum",
      "column": "Masraf",
      "reply": " Banka masraflar1 topland1.",
      "changes": []
    }
  },
  {
    "user_command": "faiz gelirlerini listele",
    "logic": "list all interest income entries",
    "category": "banka",
    "output": {
      "action": "filter",
      "column": "0_lemT�r�",
      "condition": "equals",
      "value": "Faiz",
      "reply": " Faiz gelirleri listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "kur fark1 kay1plar1n1 hesapla",
    "logic": "calculate foreign exchange losses",
    "category": "banka",
    "output": {
      "action": "message",
      "reply": " Kur fark1 kay1plar1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "aktif hesaplar1 listele",
    "logic": "list all active bank accounts",
    "category": "banka",
    "output": {
      "action": "filter",
      "column": "Durum",
      "condition": "equals",
      "value": "Aktif",
      "reply": " Aktif hesaplar listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "gelen havaleleri listele",
    "logic": "list all incoming wire transfers",
    "category": "banka",
    "output": {
      "action": "filter",
      "column": "Y�nT�r",
      "condition": "equals",
      "value": "Gelen",
      "reply": " Gelen havaleler listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "giden havaleleri listele",
    "logic": "list all outgoing wire transfers",
    "category": "banka",
    "output": {
      "action": "filter",
      "column": "Y�nT�r",
      "condition": "equals",
      "value": "Giden",
      "reply": " Giden havaleler listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "toplam prim gelirini hesapla",
    "logic": "calculate total premium income",
    "category": "sigorta",
    "output": {
      "action": "sum",
      "column": "Prim",
      "reply": " Toplam prim geliri hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "trafik sigortalar1n1 filtrele",
    "logic": "filter mandatory traffic insurance policies",
    "category": "sigorta",
    "output": {
      "action": "filter",
      "column": "Poli�eT�r�",
      "condition": "equals",
      "value": "Trafik",
      "reply": " Trafik sigortalar1 filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "hasar oran1n1 hesapla",
    "logic": "calculate loss ratio for policies",
    "category": "sigorta",
    "output": {
      "action": "message",
      "reply": "=� Hasar oran1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "bekleyen hasarlar1 listele",
    "logic": "list pending damage claims",
    "category": "sigorta",
    "output": {
      "action": "filter",
      "column": "HasarDurumu",
      "condition": "equals",
      "value": "Beklemede",
      "reply": " Bekleyen hasarlar listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "onaylanan hasarlar1 listele",
    "logic": "list approved damage claims",
    "category": "sigorta",
    "output": {
      "action": "filter",
      "column": "HasarDurumu",
      "condition": "equals",
      "value": "Onayland1",
      "reply": " Onaylanan hasarlar listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "y1ll1k prim gelirini hesapla",
    "logic": "calculate annual premium income",
    "category": "sigorta",
    "output": {
      "action": "sum",
      "column": "Prim",
      "reply": " Y1ll1k prim geliri hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "ayl1k prim tahsilat1n1 hesapla",
    "logic": "calculate monthly premium collection total",
    "category": "sigorta",
    "output": {
      "action": "sum",
      "column": "Prim",
      "reply": " Ayl1k prim tahsilat1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "ticaret hukuku davalar1n1 listele",
    "logic": "list commercial law cases",
    "category": "hukuk",
    "output": {
      "action": "filter",
      "column": "DavaT�r�",
      "condition": "equals",
      "value": "TicaretHukuku",
      "reply": " Ticaret hukuku davalar1 listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "icra takiplerini listele",
    "logic": "list all enforcement proceedings",
    "category": "hukuk",
    "output": {
      "action": "filter",
      "column": "DavaT�r�",
      "condition": "equals",
      "value": "0cra",
      "reply": " 0cra takipleri listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "dava maliyetlerini hesapla",
    "logic": "calculate total case costs",
    "category": "hukuk",
    "output": {
      "action": "sum",
      "column": "MaliyetTutar",
      "reply": " Dava maliyetleri hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "tazminat miktarlar1n1 topla",
    "logic": "sum all compensation amounts",
    "category": "hukuk",
    "output": {
      "action": "sum",
      "column": "Tazminat",
      "reply": " Tazminat miktarlar1 topland1.",
      "changes": []
    }
  },
  {
    "user_command": "kazan1lan davalar1 listele",
    "logic": "list won cases",
    "category": "hukuk",
    "output": {
      "action": "filter",
      "column": "Sonu�",
      "condition": "equals",
      "value": "Kazan1ld1",
      "reply": " Kazan1lan davalar listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "bekleyen kararlar1 vurgula",
    "logic": "highlight cases with pending decisions",
    "category": "hukuk",
    "output": {
      "action": "highlight",
      "column": "KararDurumu",
      "condition": "equals",
      "value": "Beklemede",
      "color": "#fde68a",
      "reply": " Bekleyen kararlar vurguland1.",
      "changes": []
    }
  },
  {
    "user_command": "stokta az kalan malzemeleri vurgula",
    "logic": "highlight low stock ingredients",
    "category": "restoran",
    "output": {
      "action": "highlight",
      "column": "StokAdet",
      "condition": "less_than",
      "value": "10",
      "color": "#fca5a5",
      "reply": " Az kalan malzemeler vurguland1.",
      "changes": []
    }
  },
  {
    "user_command": "mutfak maliyetlerini topla",
    "logic": "sum total kitchen ingredient costs",
    "category": "restoran",
    "output": {
      "action": "sum",
      "column": "Maliyet",
      "reply": " Mutfak maliyetleri topland1.",
      "changes": []
    }
  },
  {
    "user_command": "ayl1k personel giderlerini hesapla",
    "logic": "calculate monthly staff expense total",
    "category": "restoran",
    "output": {
      "action": "sum",
      "column": "PersonelGider",
      "reply": " Ayl1k personel giderleri hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "masa rezervasyonlar1n1 s1rala",
    "logic": "sort table reservations by time",
    "category": "restoran",
    "output": {
      "action": "sort",
      "column": "RezervasyonSaati",
      "direction": "asc",
      "reply": " Masa rezervasyonlar1 s1raland1.",
      "changes": []
    }
  },
  {
    "user_command": "ortalama adisyon tutar1n1 hesapla",
    "logic": "calculate average check/bill amount",
    "category": "restoran",
    "output": {
      "action": "average",
      "column": "Tutar",
      "reply": " Ortalama adisyon tutar1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "fire ve kay1plar1 hesapla",
    "logic": "calculate food waste and losses",
    "category": "restoran",
    "output": {
      "action": "sum",
      "column": "Fire",
      "reply": " Fire ve kay1plar hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "malzeme maliyeti oran1n1 hesapla",
    "logic": "calculate food cost percentage ratio",
    "category": "restoran",
    "output": {
      "action": "message",
      "reply": "=� Malzeme maliyeti oran1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "stok hareketlerini takip et",
    "logic": "track inventory movements",
    "category": "restoran",
    "output": {
      "action": "message",
      "reply": "=� Stok hareketleri takip edildi.",
      "changes": []
    }
  },
  {
    "user_command": "promosyon etkisini analiz et",
    "logic": "analyze promotion impact on sales",
    "category": "restoran",
    "output": {
      "action": "message",
      "reply": "=� Promosyon etkisi analiz edildi.",
      "changes": []
    }
  },
  {
    "user_command": "geciken teslimatlar1 vurgula",
    "logic": "highlight delayed delivery shipments",
    "category": "kargo",
    "output": {
      "action": "highlight",
      "column": "Durum",
      "condition": "equals",
      "value": "Gecikti",
      "color": "#fca5a5",
      "reply": " Geciken teslimatlar vurguland1.",
      "changes": []
    }
  },
  {
    "user_command": "hafta sonu teslimatlar1n1 listele",
    "logic": "list weekend delivery shipments",
    "category": "kargo",
    "output": {
      "action": "filter",
      "column": "TeslimatG�n�",
      "condition": "weekend",
      "value": "",
      "reply": " Hafta sonu teslimatlar1 listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "tekrarlayan rotalar1 grupla",
    "logic": "group recurring delivery routes",
    "category": "kargo",
    "output": {
      "action": "message",
      "reply": "=� Tekrarlayan rotalar grupland1.",
      "changes": []
    }
  },
  {
    "user_command": "aktif aboneleri listele",
    "logic": "list all active subscribers",
    "category": "abonelik",
    "output": {
      "action": "filter",
      "column": "Durum",
      "condition": "equals",
      "value": "Aktif",
      "reply": " Aktif aboneler listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "ayl1k yinelenen geliri hesapla",
    "logic": "calculate monthly recurring revenue MRR",
    "category": "abonelik",
    "output": {
      "action": "sum",
      "column": "Ayl1kGelir",
      "reply": " Ayl1k yinelenen gelir (MRR) hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "y1ll1k yinelenen geliri hesapla",
    "logic": "calculate annual recurring revenue ARR",
    "category": "abonelik",
    "output": {
      "action": "sum",
      "column": "Y1ll1kGelir",
      "reply": " Y1ll1k yinelenen gelir (ARR) hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "churn oran1n1 hesapla",
    "logic": "calculate subscription churn rate",
    "category": "abonelik",
    "output": {
      "action": "message",
      "reply": "=� Churn oran1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "bu ay yenilenen abonelikleri listele",
    "logic": "list subscriptions renewed this month",
    "category": "abonelik",
    "output": {
      "action": "filter",
      "column": "YenilemeTarihi",
      "condition": "this_month",
      "value": "",
      "reply": " Bu ay yenilenen abonelikler listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "bu ay sona eren abonelikleri vurgula",
    "logic": "highlight subscriptions expiring this month",
    "category": "abonelik",
    "output": {
      "action": "highlight",
      "column": "Biti_Tarihi",
      "condition": "this_month",
      "value": "",
      "color": "#fde68a",
      "reply": " Bu ay sona eren abonelikler vurguland1.",
      "changes": []
    }
  },
  {
    "user_command": "otomatik yenileme kapal1 abonelikleri listele",
    "logic": "list subscriptions with auto-renewal disabled",
    "category": "abonelik",
    "output": {
      "action": "filter",
      "column": "OtomatikYenileme",
      "condition": "equals",
      "value": "Kapal1",
      "reply": " Otomatik yenileme kapal1 abonelikler listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "enerji maliyetlerini topla",
    "logic": "sum total energy costs",
    "category": "enerji",
    "output": {
      "action": "sum",
      "column": "Maliyet",
      "reply": " Enerji maliyetleri topland1.",
      "changes": []
    }
  },
  {
    "user_command": "enerji tasarrufu hedeflerini takip et",
    "logic": "track energy saving targets vs actuals",
    "category": "enerji",
    "output": {
      "action": "message",
      "reply": "=� Enerji tasarrufu hedefleri takip edildi.",
      "changes": []
    }
  },
  {
    "user_command": "CO2 emisyonlar1n1 hesapla",
    "logic": "calculate CO2 emissions from energy use",
    "category": "enerji",
    "output": {
      "action": "message",
      "reply": "=� CO2 emisyonlar1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "enerji tasarruf oran1n1 hesapla",
    "logic": "calculate energy savings percentage rate",
    "category": "enerji",
    "output": {
      "action": "message",
      "reply": "=� Enerji tasarruf oran1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "enerji sayac1 okumalar1n1 kaydet",
    "logic": "record energy meter reading values",
    "category": "enerji",
    "output": {
      "action": "update_cells",
      "formula": "meter_reading",
      "reply": " Enerji sayac1 okumalar1 kaydedildi.",
      "changes": []
    }
  },
  {
    "user_command": "enerji verimlilii raporunu haz1rla",
    "logic": "prepare energy efficiency report",
    "category": "enerji",
    "output": {
      "action": "message",
      "reply": "=� Enerji verimlilii raporu haz1rland1.",
      "changes": []
    }
  },
  {
    "user_command": "s1n1f ortalamas1n1 hesapla",
    "logic": "calculate class average grade",
    "category": "okul",
    "output": {
      "action": "average",
      "column": "Not",
      "reply": " S1n1f ortalamas1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "kitap teslim etmeyenleri listele",
    "logic": "list students who have not returned library books",
    "category": "okul",
    "output": {
      "action": "filter",
      "column": "KitapTeslim",
      "condition": "equals",
      "value": "Hay1r",
      "reply": " Kitap teslim etmeyenler listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "s1n1f kapasitesi kullan1m1n1 hesapla",
    "logic": "calculate classroom capacity utilization",
    "category": "okul",
    "output": {
      "action": "message",
      "reply": "=� S1n1f kapasitesi kullan1m1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "proje teslim tarihlerini listele",
    "logic": "list project submission deadlines",
    "category": "okul",
    "output": {
      "action": "filter",
      "column": "TeslimTarihi",
      "condition": "not_empty",
      "value": "",
      "reply": " Proje teslim tarihleri listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "haftal1k ders program1n1 listele",
    "logic": "list weekly class timetable schedule",
    "category": "okul",
    "output": {
      "action": "filter",
      "column": "G�n",
      "condition": "this_week",
      "value": "",
      "reply": " Haftal1k ders program1 listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "ders materyallerini listele",
    "logic": "list all course materials and resources",
    "category": "okul",
    "output": {
      "action": "filter",
      "column": "MateryalT�r�",
      "condition": "not_empty",
      "value": "",
      "reply": " Ders materyalleri listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "zararda olan varl1klar1 vurgula",
    "logic": "highlight assets currently at a loss",
    "category": "crypto",
    "output": {
      "action": "highlight",
      "column": "KarZarar",
      "condition": "less_than",
      "value": "0",
      "color": "#fca5a5",
      "reply": " Zararda olan varl1klar k1rm1z1yla vurguland1.",
      "changes": []
    }
  },
  {
    "user_command": "kar zarar hesapla",
    "logic": "calculate profit and loss for each crypto asset",
    "category": "crypto",
    "output": {
      "action": "message",
      "reply": "=� Kar/zarar hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "volatil coinleri vurgula",
    "logic": "highlight highly volatile cryptocurrencies",
    "category": "crypto",
    "output": {
      "action": "highlight",
      "column": "Volatilite",
      "condition": "greater_than",
      "value": "5",
      "color": "#fde68a",
      "reply": " Volatil coinler vurguland1.",
      "changes": []
    }
  },
  {
    "user_command": "stake ettiim coinleri listele",
    "logic": "list staked cryptocurrency holdings",
    "category": "crypto",
    "output": {
      "action": "filter",
      "column": "Stake",
      "condition": "equals",
      "value": "Evet",
      "reply": " Stake edilen coinler listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "airdrop gelirlerini topla",
    "logic": "sum all airdrop income received",
    "category": "crypto",
    "output": {
      "action": "sum",
      "column": "AirdropGelir",
      "reply": " Airdrop gelirleri topland1.",
      "changes": []
    }
  },
  {
    "user_command": "DeFi protokol getirilerini listele",
    "logic": "list DeFi protocol yield returns",
    "category": "crypto",
    "output": {
      "action": "filter",
      "column": "Protokol",
      "condition": "not_empty",
      "value": "",
      "reply": " DeFi protokol getirileri listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "departman baz1nda harcama pivot tablosu",
    "logic": "department-based expense pivot table",
    "category": "pivot",
    "output": {
      "action": "message",
      "reply": "=� Departman baz1nda harcama pivot tablosu olu_turuldu.",
      "changes": []
    }
  },
  {
    "user_command": "pivot tabloyu s1rala",
    "logic": "sort pivot table values",
    "category": "pivot",
    "output": {
      "action": "message",
      "reply": "=� Pivot tablo s1raland1.",
      "changes": []
    }
  },
  {
    "user_command": "pivot tabloya alan ekle",
    "logic": "add new field to pivot table",
    "category": "pivot",
    "output": {
      "action": "message",
      "reply": "=� Pivot tabloya alan eklendi.",
      "changes": []
    }
  },
  {
    "user_command": "pivot tablodan alan kald1r",
    "logic": "remove field from pivot table",
    "category": "pivot",
    "output": {
      "action": "message",
      "reply": "=� Pivot tablodan alan kald1r1ld1.",
      "changes": []
    }
  },
  {
    "user_command": "pivot tabloyu yenile",
    "logic": "refresh pivot table with latest data",
    "category": "pivot",
    "output": {
      "action": "message",
      "reply": "=� Pivot tablo yenilendi.",
      "changes": []
    }
  },
  {
    "user_command": "pivot tabloda gruplama yap",
    "logic": "apply grouping in pivot table",
    "category": "pivot",
    "output": {
      "action": "message",
      "reply": "=� Pivot tabloda gruplama yap1ld1.",
      "changes": []
    }
  },
  {
    "user_command": "pivot tabloyu filtrele",
    "logic": "apply filter to pivot table data",
    "category": "pivot",
    "output": {
      "action": "message",
      "reply": "=� Pivot tablo filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "pivot tabloyu PDF'e aktar",
    "logic": "export pivot table to PDF format",
    "category": "pivot",
    "output": {
      "action": "message",
      "reply": "=� Pivot tablo PDF'e aktar1ld1.",
      "changes": []
    }
  },
  {
    "user_command": "kdv dahil fiyatlar1 hesapla",
    "logic": "calculate prices including VAT at 18%",
    "category": "muhasebe",
    "output": {
      "action": "update_cells",
      "formula": "=B2*1.18",
      "reply": " KDV dahil fiyatlar %18 oran1yla hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "sgk primlerini hesapla",
    "logic": "calculate SGK social security premiums",
    "category": "bordro",
    "output": {
      "action": "update_cells",
      "formula": "=B2*0.14",
      "reply": " SGK primleri %14 oran1yla hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "gelir vergisi hesapla",
    "logic": "calculate income tax from salary",
    "category": "bordro",
    "output": {
      "action": "update_cells",
      "formula": "=B2*0.15",
      "reply": " Gelir vergisi hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "damga vergisi tutar1n1 hesapla",
    "logic": "calculate stamp duty tax on salary",
    "category": "bordro",
    "output": {
      "action": "update_cells",
      "formula": "=B2*0.00759",
      "reply": " Damga vergisi tutarlar1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "stok deerini hesapla",
    "logic": "calculate total stock value by multiplying quantity and price",
    "category": "stok",
    "output": {
      "action": "update_cells",
      "formula": "=B2*C2",
      "reply": " Stok deerleri (adet � birim fiyat) hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "kritik stok alt1ndakileri filtrele",
    "logic": "filter products below minimum stock level",
    "category": "stok",
    "output": {
      "action": "filter",
      "condition": "less_than",
      "column": "stok",
      "value": "10",
      "reply": " Kritik stok seviyesinin alt1ndaki �r�nler filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "iptal edilen faturalar1 filtrele",
    "logic": "filter cancelled invoices",
    "category": "muhasebe",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "durum",
      "value": "0ptal",
      "reply": " 0ptal edilen faturalar filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "iskonto oran1n1 hesapla",
    "logic": "calculate discount rate on sales",
    "category": "sat1_",
    "output": {
      "action": "update_cells",
      "formula": "=(B2-C2)/B2*100",
      "reply": " 0skonto oranlar1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "filtreyi temizle",
    "logic": "clear all active filters",
    "category": "genel",
    "output": {
      "action": "remove_filter",
      "reply": " Filtre temizlendi, t�m veriler g�steriliyor.",
      "changes": []
    }
  },
  {
    "user_command": "yeni sat1r ekle",
    "logic": "add a new empty row to the dataset",
    "category": "genel",
    "output": {
      "action": "add_row",
      "reply": "� Yeni bir bo_ sat1r eklendi.",
      "changes": []
    }
  },
  {
    "user_command": "en alt sat1ra yeni kay1t ekle",
    "logic": "add new record at the bottom of the data",
    "category": "genel",
    "output": {
      "action": "add_row",
      "reply": "� Tablonun en alt1na yeni kay1t sat1r1 eklendi.",
      "changes": []
    }
  },
  {
    "user_command": "prim ortalamas1 ne kadar",
    "logic": "calculate average bonus amount",
    "category": "bordro",
    "output": {
      "action": "average",
      "column": "prim",
      "reply": " Prim ortalamas1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "hedefi tutturamayan sat1c1lar1 k1rm1z1ya boya",
    "logic": "highlight salespeople who missed their target in red",
    "category": "sat1_",
    "output": {
      "action": "highlight",
      "condition": "less_than_target",
      "color": "#FF0000",
      "reply": " Hedefi tutturamayan sat1c1lar k1rm1z1yla i_aretlendi.",
      "changes": []
    }
  },
  {
    "user_command": "toplam kdv tutar1n1 hesapla",
    "logic": "calculate total VAT amount",
    "category": "muhasebe",
    "output": {
      "action": "sum",
      "column": "kdv_tutar1",
      "reply": " Toplam KDV tutar1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "kdv beyanname toplam1n1 bul",
    "logic": "calculate VAT declaration total",
    "category": "muhasebe",
    "output": {
      "action": "sum",
      "column": "kdv",
      "reply": " KDV beyanname toplam tutar1 bulundu.",
      "changes": []
    }
  },
  {
    "user_command": "toplam stok adedini say",
    "logic": "sum total stock quantity",
    "category": "stok",
    "output": {
      "action": "sum",
      "column": "stok_adedi",
      "reply": " Toplam stok adedi hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "birim fiyat ortalamas1n1 hesapla",
    "logic": "calculate average unit price",
    "category": "stok",
    "output": {
      "action": "average",
      "column": "birim_fiyat",
      "reply": " Birim fiyat ortalamas1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "toplam gider nedir",
    "logic": "calculate total expenses",
    "category": "muhasebe",
    "output": {
      "action": "sum",
      "column": "gider",
      "reply": " Toplam gider tutar1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "toplam gelir nedir",
    "logic": "calculate total revenue",
    "category": "muhasebe",
    "output": {
      "action": "sum",
      "column": "gelir",
      "reply": " Toplam gelir tutar1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "k1dem y1l1n1 hesapla",
    "logic": "calculate years of service from hire date",
    "category": "bordro",
    "output": {
      "action": "update_cells",
      "formula": "=DATEDIF(B2,TODAY(),\"Y\")",
      "reply": " K1dem y1llar1 hesapland1.",
      "changes": []
    }
  },
  {
    "user_command": "bu y1l1n verilerini filtrele",
    "logic": "filter data for current year",
    "category": "genel",
    "output": {
      "action": "filter",
      "condition": "this_year",
      "column": "tarih",
      "value": "",
      "reply": " Bu y1la ait kay1tlar filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "veriler hakk1nda bilgi ver",
    "logic": "show general information about the dataset",
    "category": "genel",
    "output": {
      "action": "message",
      "reply": "9 Veri setinde toplam sat1r ve s�tun bilgileri: L�tfen veri aral11n1 kontrol ediniz.",
      "changes": []
    }
  },
  {
    "user_command": "bu ayın verilerini göster",
    "logic": "filter data for current month",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "current_month",
      "column": "tarih",
      "value": "",
      "reply": "✓ Bu aya ait kayıtlar gösterildi.",
      "changes": []
    }
  },
  {
    "user_command": "son 30 günü filtrele",
    "logic": "filter data for last 30 days",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "last_30_days",
      "column": "tarih",
      "value": "",
      "reply": "✓ Son 30 günün verileri filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "geçen haftaki kayıtları göster",
    "logic": "filter records from last week",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "last_week",
      "column": "tarih",
      "value": "",
      "reply": "✓ Geçen haftaki kayıtlar gösterildi.",
      "changes": []
    }
  },
  {
    "user_command": "ocak ayı siparişlerini getir",
    "logic": "filter orders for January",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "month_equals",
      "column": "tarih",
      "value": "Ocak",
      "reply": "✓ Ocak ayı siparişleri filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "2024 yılı satışlarını filtrele",
    "logic": "filter sales for year 2024",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "year_equals",
      "column": "tarih",
      "value": "2024",
      "reply": "✓ 2024 yılına ait satışlar gösterildi.",
      "changes": []
    }
  },
  {
    "user_command": "bugünkü kayıtları listele",
    "logic": "filter records for today",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "today",
      "column": "tarih",
      "value": "",
      "reply": "✓ Bugüne ait kayıtlar listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "bu haftanın verilerini göster",
    "logic": "filter data for current week",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "current_week",
      "column": "tarih",
      "value": "",
      "reply": "✓ Bu haftanın verileri filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "son 7 günün siparişleri",
    "logic": "filter orders from last 7 days",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "last_7_days",
      "column": "tarih",
      "value": "",
      "reply": "✓ Son 7 günün siparişleri gösterildi.",
      "changes": []
    }
  },
  {
    "user_command": "bu çeyreğin verilerini filtrele",
    "logic": "filter data for current quarter",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "current_quarter",
      "column": "tarih",
      "value": "",
      "reply": "✓ Bu çeyreğe ait veriler filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "geçen ayki kayıtları göster",
    "logic": "filter records from last month",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "last_month",
      "column": "tarih",
      "value": "",
      "reply": "✓ Geçen aya ait kayıtlar gösterildi.",
      "changes": []
    }
  },
  {
    "user_command": "mart ayına ait verileri listele",
    "logic": "filter data for March",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "month_equals",
      "column": "tarih",
      "value": "Mart",
      "reply": "✓ Mart ayına ait veriler listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "2023 yılı verilerini getir",
    "logic": "filter data for year 2023",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "year_equals",
      "column": "tarih",
      "value": "2023",
      "reply": "✓ 2023 yılına ait veriler getirildi.",
      "changes": []
    }
  },
  {
    "user_command": "son 3 aylık verileri göster",
    "logic": "filter data for last 3 months",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "last_3_months",
      "column": "tarih",
      "value": "",
      "reply": "✓ Son 3 aylık veriler gösterildi.",
      "changes": []
    }
  },
  {
    "user_command": "ikinci çeyrek satışları",
    "logic": "filter sales for Q2",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "quarter_equals",
      "column": "tarih",
      "value": "Q2",
      "reply": "✓ İkinci çeyrek satışları filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "yıl başından bu yana verileri filtrele",
    "logic": "filter data from year start to now",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "year_to_date",
      "column": "tarih",
      "value": "",
      "reply": "✓ Yıl başından bu yana veriler filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "kasım ayı faturalarını göster",
    "logic": "filter invoices for November",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "month_equals",
      "column": "tarih",
      "value": "Kasım",
      "reply": "✓ Kasım ayı faturaları gösterildi.",
      "changes": []
    }
  },
  {
    "user_command": "dün girilmiş kayıtları bul",
    "logic": "filter records entered yesterday",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "yesterday",
      "column": "tarih",
      "value": "",
      "reply": "✓ Dün girilmiş kayıtlar bulundu.",
      "changes": []
    }
  },
  {
    "user_command": "son bir yıllık verileri göster",
    "logic": "filter data for last one year",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "last_year_period",
      "column": "tarih",
      "value": "",
      "reply": "✓ Son bir yıllık veriler gösterildi.",
      "changes": []
    }
  },
  {
    "user_command": "bu yılın ilk yarısını filtrele",
    "logic": "filter data for first half of current year",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "first_half",
      "column": "tarih",
      "value": "",
      "reply": "✓ Bu yılın ilk 6 ayı filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "temmuz ağustos eylül verilerini getir",
    "logic": "filter data for Q3 months",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "month_in",
      "column": "tarih",
      "value": "Temmuz,Ağustos,Eylül",
      "reply": "✓ Q3 dönemi verileri getirildi.",
      "changes": []
    }
  },
  {
    "user_command": "kaç yüzde artış var",
    "logic": "calculate percentage increase between columns",
    "category": "muhasebe",
    "output": {
      "action": "update_cells",
      "formula": "percentage_change",
      "reply": "📊 Yüzde artış oranı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "büyüme oranını hesapla",
    "logic": "calculate growth rate",
    "category": "muhasebe",
    "output": {
      "action": "update_cells",
      "formula": "=(B2-A2)/A2*100",
      "reply": "✓ Büyüme oranları hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "geçen aya göre yüzde değişim",
    "logic": "calculate percentage change vs previous month",
    "category": "muhasebe",
    "output": {
      "action": "update_cells",
      "formula": "=(current-previous)/previous*100",
      "reply": "✓ Geçen aya göre yüzde değişim hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "hedefin yüzde kaçına ulaşıldı",
    "logic": "calculate percentage of target achieved",
    "category": "muhasebe",
    "output": {
      "action": "update_cells",
      "formula": "=B2/C2*100",
      "reply": "✓ Hedefe ulaşma oranları hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "yüzde marjını hesapla",
    "logic": "calculate profit margin percentage",
    "category": "muhasebe",
    "output": {
      "action": "update_cells",
      "formula": "=(gelir-maliyet)/gelir*100",
      "reply": "✓ Yüzde marj değerleri hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "fiyatlara yüzde 10 zam yap",
    "logic": "increase prices by 10 percent",
    "category": "muhasebe",
    "output": {
      "action": "update_cells",
      "formula": "multiply",
      "factor": 1.1,
      "reply": "✓ Fiyatlara %10 zam yapıldı.",
      "changes": []
    }
  },
  {
    "user_command": "yüzde 15 indirim uygula",
    "logic": "apply 15 percent discount",
    "category": "muhasebe",
    "output": {
      "action": "update_cells",
      "formula": "multiply",
      "factor": 0.85,
      "reply": "✓ %15 indirim uygulandı.",
      "changes": []
    }
  },
  {
    "user_command": "aylık büyüme yüzdesini bul",
    "logic": "find monthly growth percentage",
    "category": "muhasebe",
    "output": {
      "action": "update_cells",
      "formula": "monthly_growth_rate",
      "reply": "📊 Aylık büyüme yüzdeleri hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "toplam içindeki payı hesapla",
    "logic": "calculate share of total as percentage",
    "category": "muhasebe",
    "output": {
      "action": "update_cells",
      "formula": "=B2/SUM(B:B)*100",
      "reply": "✓ Toplam içindeki pay yüzdeleri hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "yıllık büyüme oranı ne kadar",
    "logic": "calculate year over year growth rate",
    "category": "muhasebe",
    "output": {
      "action": "update_cells",
      "formula": "year_over_year_growth",
      "reply": "📊 Yıllık büyüme oranları hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "kâr marjını hesapla",
    "logic": "calculate profit margin",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "=(satis-maliyet)/satis*100",
      "reply": "✓ Kâr marjı yüzdeleri hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "geçen yıla göre değişim oranı",
    "logic": "calculate change rate compared to previous year",
    "category": "muhasebe",
    "output": {
      "action": "update_cells",
      "formula": "=(B2-C2)/C2*100",
      "reply": "✓ Geçen yıla göre değişim oranları hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "satışların yüzde kaçı hedefi aştı",
    "logic": "percentage of sales that exceeded target",
    "category": "muhasebe",
    "output": {
      "action": "count_if",
      "condition": ">hedef",
      "column": "satış",
      "reply": "📊 Hedefi aşan satışların oranı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "yüzde 5 faiz ekle",
    "logic": "add 5 percent interest",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "multiply",
      "factor": 1.05,
      "reply": "✓ %5 faiz eklendi.",
      "changes": []
    }
  },
  {
    "user_command": "brüt kâr yüzdesini hesapla",
    "logic": "calculate gross profit percentage",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "gross_profit_margin",
      "reply": "✓ Brüt kâr yüzdeleri hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "döviz kuru farkını yüzde olarak göster",
    "logic": "show currency rate difference as percentage",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "exchange_rate_change_pct",
      "reply": "📊 Döviz kuru yüzde farkları gösterildi.",
      "changes": []
    }
  },
  {
    "user_command": "satış artış yüzdesini hesapla",
    "logic": "calculate sales increase percentage",
    "category": "muhasebe",
    "output": {
      "action": "update_cells",
      "formula": "sales_growth_pct",
      "reply": "✓ Satış artış yüzdeleri hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "gider oranını bul",
    "logic": "calculate expense ratio",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "=gider/gelir*100",
      "reply": "✓ Gider oranları hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "net büyüme yüzdesi nedir",
    "logic": "calculate net growth percentage",
    "category": "muhasebe",
    "output": {
      "action": "update_cells",
      "formula": "net_growth_percentage",
      "reply": "📊 Net büyüme yüzdeleri hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "ay ay büyüme oranlarını hesapla",
    "logic": "calculate month by month growth rates",
    "category": "muhasebe",
    "output": {
      "action": "update_cells",
      "formula": "mom_growth_rate",
      "reply": "📊 Ay ay büyüme oranları hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "500'den fazla olan satışları 500 yap",
    "logic": "cap sales values at 500",
    "category": "genel",
    "output": {
      "action": "update_cells",
      "condition": ">500",
      "value": "500",
      "formula": "cap",
      "reply": "✓ 500 üzeri satışlar 500 olarak güncellendi.",
      "changes": []
    }
  },
  {
    "user_command": "boş hücreleri 0 ile doldur",
    "logic": "fill empty cells with 0",
    "category": "genel",
    "output": {
      "action": "update_cells",
      "condition": "empty",
      "value": "0",
      "formula": "fill_empty",
      "reply": "✓ Boş hücreler 0 ile dolduruldu.",
      "changes": []
    }
  },
  {
    "user_command": "beklemede olanları tamamlandı yap",
    "logic": "update pending status to completed",
    "category": "genel",
    "output": {
      "action": "update_cells",
      "condition": "equals",
      "value": "Beklemede",
      "newValue": "Tamamlandı",
      "formula": "replace_if",
      "reply": "✓ Beklemede olanlar tamamlandı olarak güncellendi.",
      "changes": []
    }
  },
  {
    "user_command": "negatif değerleri 0 yap",
    "logic": "replace negative values with 0",
    "category": "genel",
    "output": {
      "action": "update_cells",
      "condition": "<0",
      "value": "0",
      "formula": "replace_negative",
      "reply": "✓ Negatif değerler 0 ile değiştirildi.",
      "changes": []
    }
  },
  {
    "user_command": "1000'in altındaki fiyatları 1000 yap",
    "logic": "set minimum price to 1000",
    "category": "muhasebe",
    "output": {
      "action": "update_cells",
      "condition": "<1000",
      "column": "fiyat",
      "value": "1000",
      "formula": "floor",
      "reply": "✓ 1000 altı fiyatlar 1000 olarak güncellendi.",
      "changes": []
    }
  },
  {
    "user_command": "aktif olmayanları pasif yap",
    "logic": "change non-active status to passive",
    "category": "genel",
    "output": {
      "action": "update_cells",
      "condition": "not_equals",
      "value": "Aktif",
      "newValue": "Pasif",
      "formula": "replace_if",
      "reply": "✓ Aktif olmayan kayıtlar pasif olarak işaretlendi.",
      "changes": []
    }
  },
  {
    "user_command": "iptal edilen siparişlerin tutarını sıfırla",
    "logic": "zero out cancelled order amounts",
    "category": "genel",
    "output": {
      "action": "update_cells",
      "condition": "equals",
      "column": "durum",
      "value": "İptal",
      "targetColumn": "tutar",
      "newValue": "0",
      "formula": "conditional_zero",
      "reply": "✓ İptal edilen siparişlerin tutarları sıfırlandı.",
      "changes": []
    }
  },
  {
    "user_command": "maksimum değeri 9999 ile sınırla",
    "logic": "cap maximum value at 9999",
    "category": "genel",
    "output": {
      "action": "update_cells",
      "condition": ">9999",
      "value": "9999",
      "formula": "cap",
      "reply": "✓ 9999 üzeri değerler 9999 olarak güncellendi.",
      "changes": []
    }
  },
  {
    "user_command": "boş olan tarih sütununa bugünü yaz",
    "logic": "fill empty date column with today date",
    "category": "genel",
    "output": {
      "action": "update_cells",
      "condition": "empty",
      "column": "tarih",
      "formula": "fill_today",
      "reply": "✓ Boş tarih hücreleri bugünün tarihiyle dolduruldu.",
      "changes": []
    }
  },
  {
    "user_command": "teslim edilenlerin durumunu kapat",
    "logic": "close status for delivered items",
    "category": "genel",
    "output": {
      "action": "update_cells",
      "condition": "equals",
      "column": "durum",
      "value": "Teslim Edildi",
      "newValue": "Kapalı",
      "formula": "replace_if",
      "reply": "✓ Teslim edilen siparişlerin durumu kapatıldı.",
      "changes": []
    }
  },
  {
    "user_command": "100'den küçük stokları kritik işaretle",
    "logic": "mark stocks below 100 as critical",
    "category": "genel",
    "output": {
      "action": "update_cells",
      "condition": "<100",
      "column": "stok",
      "newValue": "Kritik",
      "formula": "conditional_label",
      "reply": "✓ 100 altı stoklar kritik olarak işaretlendi.",
      "changes": []
    }
  },
  {
    "user_command": "fiyat boşsa varsayılan değer ata",
    "logic": "assign default value if price is empty",
    "category": "muhasebe",
    "output": {
      "action": "update_cells",
      "condition": "empty",
      "column": "fiyat",
      "value": "0",
      "formula": "fill_empty",
      "reply": "✓ Boş fiyat hücrelerine varsayılan değer atandı.",
      "changes": []
    }
  },
  {
    "user_command": "süresi geçmiş kayıtları arşivle",
    "logic": "mark expired records as archived",
    "category": "genel",
    "output": {
      "action": "update_cells",
      "condition": "date_past",
      "column": "son_tarih",
      "newValue": "Arşiv",
      "formula": "archive_expired",
      "reply": "✓ Süresi geçmiş kayıtlar arşivlendi.",
      "changes": []
    }
  },
  {
    "user_command": "eksik telefon numaralarına bilinmiyor yaz",
    "logic": "fill missing phone numbers with unknown",
    "category": "genel",
    "output": {
      "action": "update_cells",
      "condition": "empty",
      "column": "telefon",
      "value": "Bilinmiyor",
      "formula": "fill_empty",
      "reply": "✓ Eksik telefon numaraları bilinmiyor olarak işaretlendi.",
      "changes": []
    }
  },
  {
    "user_command": "tüm pasif müşterileri sil",
    "logic": "delete all passive customer rows",
    "category": "genel",
    "output": {
      "action": "delete_rows",
      "condition": "equals",
      "column": "durum",
      "value": "Pasif",
      "reply": "✓ Pasif müşteri kayıtları silindi.",
      "changes": []
    }
  },
  {
    "user_command": "onaylanmış faturaları kilitli yap",
    "logic": "lock approved invoices",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "condition": "equals",
      "column": "durum",
      "value": "Onaylandı",
      "newValue": "Kilitli",
      "formula": "replace_if",
      "reply": "✓ Onaylanmış faturalar kilitlendi.",
      "changes": []
    }
  },
  {
    "user_command": "hata içeren satırları düzelt",
    "logic": "fix rows containing errors",
    "category": "genel",
    "output": {
      "action": "clean_data",
      "condition": "has_error",
      "reply": "✓ Hata içeren satırlar düzeltildi.",
      "changes": []
    }
  },
  {
    "user_command": "eski kategorileri yeni isimle değiştir",
    "logic": "replace old category names with new ones",
    "category": "genel",
    "output": {
      "action": "update_cells",
      "formula": "batch_replace",
      "reply": "✓ Eski kategori isimleri güncellendi.",
      "changes": []
    }
  },
  {
    "user_command": "çift kayıtların ikincisini pasife al",
    "logic": "deactivate second occurrence of duplicate records",
    "category": "genel",
    "output": {
      "action": "update_cells",
      "condition": "duplicate_second",
      "newValue": "Pasif",
      "formula": "dedup_soft",
      "reply": "✓ Tekrarlı kayıtların ikincisi pasife alındı.",
      "changes": []
    }
  },
  {
    "user_command": "0 olan stokları stok dışı olarak işaretle",
    "logic": "mark zero stock items as out of stock",
    "category": "genel",
    "output": {
      "action": "update_cells",
      "condition": "equals",
      "column": "stok",
      "value": "0",
      "newValue": "Stok Dışı",
      "formula": "replace_if",
      "reply": "✓ Sıfır stoklu ürünler stok dışı olarak işaretlendi.",
      "changes": []
    }
  },
  {
    "user_command": "tüm metinleri büyük harfe çevir",
    "logic": "convert all text to uppercase",
    "category": "text",
    "output": {
      "action": "transform",
      "transform": "uppercase",
      "reply": "✓ Tüm metinler büyük harfe çevrildi.",
      "changes": []
    }
  },
  {
    "user_command": "isimleri küçük harfe çevir",
    "logic": "convert names to lowercase",
    "category": "text",
    "output": {
      "action": "transform",
      "transform": "lowercase",
      "column": "isim",
      "reply": "✓ İsimler küçük harfe çevrildi.",
      "changes": []
    }
  },
  {
    "user_command": "başındaki ve sonundaki boşlukları temizle",
    "logic": "trim leading and trailing spaces",
    "category": "text",
    "output": {
      "action": "transform",
      "transform": "trim",
      "reply": "✓ Baş ve son boşluklar temizlendi.",
      "changes": []
    }
  },
  {
    "user_command": "telefon numaralarını formatla",
    "logic": "format phone numbers consistently",
    "category": "text",
    "output": {
      "action": "transform",
      "transform": "phone_format",
      "column": "telefon",
      "reply": "✓ Telefon numaraları formatlandı.",
      "changes": []
    }
  },
  {
    "user_command": "tc kimlik numaralarını maskele",
    "logic": "mask ID numbers for privacy",
    "category": "text",
    "output": {
      "action": "transform",
      "transform": "mask",
      "column": "tc_kimlik",
      "reply": "✓ TC kimlik numaraları maskelendi.",
      "changes": []
    }
  },
  {
    "user_command": "e-posta adreslerini küçük harfe çevir",
    "logic": "convert email addresses to lowercase",
    "category": "text",
    "output": {
      "action": "transform",
      "transform": "lowercase",
      "column": "email",
      "reply": "✓ E-posta adresleri küçük harfe çevrildi.",
      "changes": []
    }
  },
  {
    "user_command": "ürün kodlarını büyük harfe çevir",
    "logic": "convert product codes to uppercase",
    "category": "text",
    "output": {
      "action": "transform",
      "transform": "uppercase",
      "column": "urun_kodu",
      "reply": "✓ Ürün kodları büyük harfe çevrildi.",
      "changes": []
    }
  },
  {
    "user_command": "metindeki fazla boşlukları sil",
    "logic": "remove extra spaces from text",
    "category": "text",
    "output": {
      "action": "transform",
      "transform": "trim",
      "reply": "✓ Fazla boşluklar temizlendi.",
      "changes": []
    }
  },
  {
    "user_command": "tarihleri gün ay yıl formatına çevir",
    "logic": "convert dates to dd/mm/yyyy format",
    "category": "text",
    "output": {
      "action": "transform",
      "transform": "date_format",
      "format": "dd/mm/yyyy",
      "column": "tarih",
      "reply": "✓ Tarihler gün/ay/yıl formatına çevrildi.",
      "changes": []
    }
  },
  {
    "user_command": "iban numaralarını formatla",
    "logic": "format IBAN numbers with spaces",
    "category": "text",
    "output": {
      "action": "transform",
      "transform": "iban_format",
      "column": "iban",
      "reply": "✓ IBAN numaraları formatlandı.",
      "changes": []
    }
  },
  {
    "user_command": "ilk harfi büyük yap",
    "logic": "capitalize first letter of each cell",
    "category": "text",
    "output": {
      "action": "transform",
      "transform": "capitalize",
      "reply": "✓ İlk harfler büyük yapıldı.",
      "changes": []
    }
  },
  {
    "user_command": "özel karakterleri temizle",
    "logic": "remove special characters from text",
    "category": "text",
    "output": {
      "action": "transform",
      "transform": "remove_special_chars",
      "reply": "✓ Özel karakterler temizlendi.",
      "changes": []
    }
  },
  {
    "user_command": "rakamları virgüllü formata çevir",
    "logic": "format numbers with comma separators",
    "category": "text",
    "output": {
      "action": "transform",
      "transform": "number_format",
      "format": "comma",
      "reply": "✓ Sayılar virgüllü formata çevrildi.",
      "changes": []
    }
  },
  {
    "user_command": "boşlukları alt çizgiyle değiştir",
    "logic": "replace spaces with underscores",
    "category": "text",
    "output": {
      "action": "transform",
      "transform": "replace_space_underscore",
      "reply": "✓ Boşluklar alt çizgiyle değiştirildi.",
      "changes": []
    }
  },
  {
    "user_command": "para birimini TL olarak formatla",
    "logic": "format values as Turkish Lira currency",
    "category": "text",
    "output": {
      "action": "transform",
      "transform": "currency_format",
      "currency": "TL",
      "reply": "✓ Değerler TL formatına çevrildi.",
      "changes": []
    }
  },
  {
    "user_command": "cümle başı büyük harf yap",
    "logic": "apply sentence case to text",
    "category": "text",
    "output": {
      "action": "transform",
      "transform": "sentence_case",
      "reply": "✓ Cümle başları büyük harfe çevrildi.",
      "changes": []
    }
  },
  {
    "user_command": "metinden rakamları çıkar",
    "logic": "extract only numbers from text",
    "category": "text",
    "output": {
      "action": "extract",
      "type": "number",
      "reply": "✓ Metinlerden rakamlar çıkarıldı.",
      "changes": []
    }
  },
  {
    "user_command": "baştaki sıfırları kaldır",
    "logic": "remove leading zeros from codes",
    "category": "text",
    "output": {
      "action": "transform",
      "transform": "remove_leading_zeros",
      "reply": "✓ Başındaki sıfırlar kaldırıldı.",
      "changes": []
    }
  },
  {
    "user_command": "tutarların başına TL işareti ekle",
    "logic": "add TL symbol before amounts",
    "category": "text",
    "output": {
      "action": "transform",
      "transform": "prepend",
      "value": "TL ",
      "column": "tutar",
      "reply": "✓ Tutarların başına TL işareti eklendi.",
      "changes": []
    }
  },
  {
    "user_command": "sütundaki tüm metinleri birleştir",
    "logic": "concatenate all text values in column",
    "category": "text",
    "output": {
      "action": "update_cells",
      "formula": "=TEXTJOIN(\", \",TRUE,A:A)",
      "reply": "✓ Sütundaki metinler birleştirildi.",
      "changes": []
    }
  },
  {
    "user_command": "excel tarih formatına çevir",
    "logic": "convert text to Excel date format",
    "category": "text",
    "output": {
      "action": "transform",
      "transform": "to_excel_date",
      "column": "tarih",
      "reply": "✓ Tarihler Excel formatına çevrildi.",
      "changes": []
    }
  },
  {
    "user_command": "büyük küçük harf tutarsızlıklarını düzelt",
    "logic": "normalize inconsistent letter casing",
    "category": "text",
    "output": {
      "action": "transform",
      "transform": "normalize_case",
      "reply": "✓ Harf tutarsızlıkları düzeltildi.",
      "changes": []
    }
  },
  {
    "user_command": "sayıları metin formatına çevir",
    "logic": "convert numbers to text format",
    "category": "text",
    "output": {
      "action": "transform",
      "transform": "number_to_text",
      "reply": "✓ Sayılar metin formatına çevrildi.",
      "changes": []
    }
  },
  {
    "user_command": "kodu temizle baştaki sıfırları kaldır",
    "logic": "strip leading zeros from code fields",
    "category": "text",
    "output": {
      "action": "transform",
      "transform": "remove_leading_zeros",
      "column": "kod",
      "reply": "✓ Kod alanlarındaki başındaki sıfırlar kaldırıldı.",
      "changes": []
    }
  },
  {
    "user_command": "sütun değerlerini noktalı virgülle ayır",
    "logic": "join column values with semicolon",
    "category": "text",
    "output": {
      "action": "update_cells",
      "formula": "=TEXTJOIN(\";\",TRUE,A:A)",
      "reply": "✓ Değerler noktalı virgülle birleştirildi.",
      "changes": []
    }
  },
  {
    "user_command": "önce tarihe, sonra isme göre sırala",
    "logic": "sort by date first then by name",
    "category": "sorting",
    "output": {
      "action": "sort",
      "columns": [
        {
          "column": "tarih",
          "direction": "asc"
        },
        {
          "column": "isim",
          "direction": "asc"
        }
      ],
      "reply": "✓ Önce tarihe, sonra isme göre sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "şehre göre sırala, eşit olanlarda fiyata göre",
    "logic": "sort by city then by price for ties",
    "category": "sorting",
    "output": {
      "action": "sort",
      "columns": [
        {
          "column": "şehir",
          "direction": "asc"
        },
        {
          "column": "fiyat",
          "direction": "asc"
        }
      ],
      "reply": "✓ Şehre, ardından fiyata göre sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "kategoriye ve tarihe göre sırala",
    "logic": "sort by category then date",
    "category": "sorting",
    "output": {
      "action": "sort",
      "columns": [
        {
          "column": "kategori",
          "direction": "asc"
        },
        {
          "column": "tarih",
          "direction": "asc"
        }
      ],
      "reply": "✓ Kategori ve tarihe göre sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "bölüme göre, sonra maaşa göre sırala",
    "logic": "sort by department then salary descending",
    "category": "hr",
    "output": {
      "action": "sort",
      "columns": [
        {
          "column": "bölüm",
          "direction": "asc"
        },
        {
          "column": "maaş",
          "direction": "desc"
        }
      ],
      "reply": "✓ Bölüme göre ardından maaşa göre sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "müşteri adına sonra tutara göre sırala",
    "logic": "sort by customer name then amount descending",
    "category": "sorting",
    "output": {
      "action": "sort",
      "columns": [
        {
          "column": "müşteri",
          "direction": "asc"
        },
        {
          "column": "tutar",
          "direction": "desc"
        }
      ],
      "reply": "✓ Müşteri adı ve tutara göre sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "önce duruma göre, sonra tarihe göre listele",
    "logic": "list by status first then by date",
    "category": "sorting",
    "output": {
      "action": "sort",
      "columns": [
        {
          "column": "durum",
          "direction": "asc"
        },
        {
          "column": "tarih",
          "direction": "asc"
        }
      ],
      "reply": "✓ Durum ve tarihe göre sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "ürün grubuna sonra stok miktarına göre sırala",
    "logic": "sort by product group then stock quantity",
    "category": "sorting",
    "output": {
      "action": "sort",
      "columns": [
        {
          "column": "ürün_grubu",
          "direction": "asc"
        },
        {
          "column": "stok",
          "direction": "asc"
        }
      ],
      "reply": "✓ Ürün grubu ve stok miktarına göre sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "önce yıl sonra ay sonra gün sırala",
    "logic": "sort chronologically by year month day",
    "category": "sorting",
    "output": {
      "action": "sort",
      "columns": [
        {
          "column": "yıl",
          "direction": "asc"
        },
        {
          "column": "ay",
          "direction": "asc"
        },
        {
          "column": "gün",
          "direction": "asc"
        }
      ],
      "reply": "✓ Yıl, ay ve güne göre sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "ada göre, eşit olursa yaşa göre sırala",
    "logic": "sort by name then by age",
    "category": "hr",
    "output": {
      "action": "sort",
      "columns": [
        {
          "column": "ad",
          "direction": "asc"
        },
        {
          "column": "yaş",
          "direction": "asc"
        }
      ],
      "reply": "✓ Ad ve yaşa göre sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "önce önceliğe göre, sonra oluşturma tarihine göre sırala",
    "logic": "sort by priority descending then creation date ascending",
    "category": "sorting",
    "output": {
      "action": "sort",
      "columns": [
        {
          "column": "öncelik",
          "direction": "desc"
        },
        {
          "column": "oluşturma_tarihi",
          "direction": "asc"
        }
      ],
      "reply": "✓ Öncelik ve tarihe göre sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "sınıfa sonra nota göre sırala",
    "logic": "sort by class then grade descending",
    "category": "hr",
    "output": {
      "action": "sort",
      "columns": [
        {
          "column": "sınıf",
          "direction": "asc"
        },
        {
          "column": "not",
          "direction": "desc"
        }
      ],
      "reply": "✓ Sınıf ve nota göre sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "bölgeye göre büyüyen satışa göre azalan sırala",
    "logic": "sort by region ascending and sales descending",
    "category": "sorting",
    "output": {
      "action": "sort",
      "columns": [
        {
          "column": "bölge",
          "direction": "asc"
        },
        {
          "column": "satış",
          "direction": "desc"
        }
      ],
      "reply": "✓ Bölge ve satışa göre sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "cinsiyet ve maaş sıralaması yap",
    "logic": "sort by gender then salary descending",
    "category": "hr",
    "output": {
      "action": "sort",
      "columns": [
        {
          "column": "cinsiyet",
          "direction": "asc"
        },
        {
          "column": "maaş",
          "direction": "desc"
        }
      ],
      "reply": "✓ Cinsiyet ve maaşa göre sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "projeye, sonra atanan kişiye göre sırala",
    "logic": "sort by project then assignee",
    "category": "sorting",
    "output": {
      "action": "sort",
      "columns": [
        {
          "column": "proje",
          "direction": "asc"
        },
        {
          "column": "atanan",
          "direction": "asc"
        }
      ],
      "reply": "✓ Proje ve atanan kişiye göre sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "segmente göre, ardından satış temsilcisine göre sırala",
    "logic": "sort by segment then sales representative",
    "category": "sorting",
    "output": {
      "action": "sort",
      "columns": [
        {
          "column": "segment",
          "direction": "asc"
        },
        {
          "column": "satış_temsilcisi",
          "direction": "asc"
        }
      ],
      "reply": "✓ Segment ve satış temsilcisine göre sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "düşük performansı mora boya",
    "logic": "highlight below average values in purple",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "below_average",
      "color": "#e9d5ff",
      "reply": "✓ Ortalamanın altındaki değerler mora boyandı.",
      "changes": []
    }
  },
  {
    "user_command": "5000den büyükleri mora boya",
    "logic": "highlight values greater than 5000 in purple",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "value > 5000",
      "color": "#e9d5ff",
      "reply": "✓ 5000'den büyük değerler mora boyandı.",
      "changes": []
    }
  },
  {
    "user_command": "VIP müşterileri mora boya",
    "logic": "highlight VIP customers in purple",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "contains",
      "value": "VIP",
      "color": "#e9d5ff",
      "reply": "✓ VIP müşteriler mora boyandı.",
      "changes": []
    }
  },
  {
    "user_command": "fiyatı 1000 üzeri olanları mora boya",
    "logic": "highlight rows where price > 1000 in purple",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "value > 1000",
      "column": "fiyat",
      "color": "#e9d5ff",
      "reply": "✓ Fiyatı 1000'in üzerindeki satırlar mora boyandı.",
      "changes": []
    }
  },
  {
    "user_command": "yeni kayıtları pembeleştir",
    "logic": "highlight new entries in pink",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "contains",
      "value": "yeni",
      "color": "#fbcfe8",
      "reply": "✓ 'Yeni' içeren kayıtlar pembeye boyandı.",
      "changes": []
    }
  },
  {
    "user_command": "henüz işlenmeyenleri pembeye boya",
    "logic": "highlight unprocessed rows in pink",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "contains",
      "value": "işlenmedi",
      "color": "#fbcfe8",
      "reply": "✓ İşlenmemiş kayıtlar pembeye boyandı.",
      "changes": []
    }
  },
  {
    "user_command": "taslak olanları pembeye boya",
    "logic": "highlight draft entries in pink",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "contains",
      "value": "taslak",
      "color": "#fbcfe8",
      "reply": "✓ Taslak kayıtlar pembeye boyandı.",
      "changes": []
    }
  },
  {
    "user_command": "iptal edilenleri griye boya",
    "logic": "highlight cancelled rows in grey",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "contains",
      "value": "iptal",
      "color": "#e5e7eb",
      "reply": "✓ İptal edilenler griye boyandı.",
      "changes": []
    }
  },
  {
    "user_command": "pasif kayıtları gri yap",
    "logic": "highlight passive/inactive records in grey",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "contains",
      "value": "pasif",
      "color": "#e5e7eb",
      "reply": "✓ Pasif kayıtlar griye boyandı.",
      "changes": []
    }
  },
  {
    "user_command": "boş hücreleri griye boya",
    "logic": "highlight empty cells in grey",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "empty",
      "color": "#e5e7eb",
      "reply": "✓ Boş hücreler griye boyandı.",
      "changes": []
    }
  },
  {
    "user_command": "kapatılan görevleri griye boya",
    "logic": "highlight closed tasks in grey",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "contains",
      "value": "kapatıldı",
      "color": "#e5e7eb",
      "reply": "✓ Kapatılan görevler griye boyandı.",
      "changes": []
    }
  },
  {
    "user_command": "onaylanmışları turkuaza boya",
    "logic": "highlight approved entries in teal/cyan",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "contains",
      "value": "onaylandı",
      "color": "#a5f3fc",
      "reply": "✓ Onaylanan kayıtlar turkuaza boyandı.",
      "changes": []
    }
  },
  {
    "user_command": "tamamlananları açık maviye boya",
    "logic": "highlight completed entries in cyan",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "contains",
      "value": "tamamlandı",
      "color": "#a5f3fc",
      "reply": "✓ Tamamlanan kayıtlar açık maviye boyandı.",
      "changes": []
    }
  },
  {
    "user_command": "ortalamanın altındakileri kırmızıya boya",
    "logic": "highlight below average values in red",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "below_average",
      "color": "#fecaca",
      "reply": "✓ Ortalamanın altındaki değerler kırmızıya boyandı.",
      "changes": []
    }
  },
  {
    "user_command": "ortalamanın üstündakileri yeşile boya",
    "logic": "highlight above average values in green",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "above_average",
      "color": "#bbf7d0",
      "reply": "✓ Ortalamanın üstündeki değerler yeşile boyandı.",
      "changes": []
    }
  },
  {
    "user_command": "ortalama üzerindeki satışları vurgula",
    "logic": "highlight sales above average in yellow",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "above_average",
      "color": "#fef08a",
      "reply": "✓ Ortalama üzerindeki satışlar vurgulandı.",
      "changes": []
    }
  },
  {
    "user_command": "en küçük 5 değeri maviye boya",
    "logic": "highlight bottom 5 values in blue",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "bottom5",
      "color": "#bfdbfe",
      "reply": "✓ En küçük 5 değer maviye boyandı.",
      "changes": []
    }
  },
  {
    "user_command": "en düşük 3 satırı kırmızıyla işaretle",
    "logic": "highlight bottom 3 rows in red",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "bottom3",
      "color": "#fecaca",
      "reply": "✓ En düşük 3 satır kırmızıyla işaretlendi.",
      "changes": []
    }
  },
  {
    "user_command": "en kötü 10 performansı kırmızıya boya",
    "logic": "highlight bottom 10 values in red",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "bottom10",
      "color": "#fecaca",
      "reply": "✓ En düşük 10 değer kırmızıya boyandı.",
      "changes": []
    }
  },
  {
    "user_command": "boş hücreleri sarıya boya",
    "logic": "highlight empty cells in yellow",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "empty",
      "color": "#fef08a",
      "reply": "✓ Boş hücreler sarıya boyandı.",
      "changes": []
    }
  },
  {
    "user_command": "dolu hücreleri yeşile boya",
    "logic": "highlight non-empty cells in green",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "non_empty",
      "color": "#bbf7d0",
      "reply": "✓ Dolu hücreler yeşile boyandı.",
      "changes": []
    }
  },
  {
    "user_command": "tekrar eden değerleri turuncuya boya",
    "logic": "highlight duplicate values in orange",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "duplicate",
      "color": "#fed7aa",
      "reply": "✓ Tekrar eden değerler turuncuya boyandı.",
      "changes": []
    }
  },
  {
    "user_command": "mükerrer kayıtları sarıyla işaretle",
    "logic": "highlight duplicate records in yellow",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "duplicate",
      "color": "#fef08a",
      "reply": "✓ Mükerrer kayıtlar sarıyla işaretlendi.",
      "changes": []
    }
  },
  {
    "user_command": "bu ayki kayıtları sarıya vurgula",
    "logic": "highlight records from current month in yellow",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "currentMonth",
      "color": "#fef08a",
      "reply": "✓ Bu ayki kayıtlar sarıya vurgulandı.",
      "changes": []
    }
  },
  {
    "user_command": "süresi dolan ürünleri kırmızıya boya",
    "logic": "highlight expired products in red",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "expired",
      "color": "#fecaca",
      "reply": "✓ Süresi dolan ürünler kırmızıya boyandı.",
      "changes": []
    }
  },
  {
    "user_command": "son haftanın verilerini maviye boya",
    "logic": "highlight last week's data in blue",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "lastWeek",
      "color": "#bfdbfe",
      "reply": "✓ Son haftanın verileri maviye boyandı.",
      "changes": []
    }
  },
  {
    "user_command": "stok 5'in altındakileri kırmızıya boya",
    "logic": "highlight rows where stock < 5 in red",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "value < 5",
      "column": "stok",
      "color": "#fecaca",
      "reply": "✓ Stoğu 5'in altındaki satırlar kırmızıya boyandı.",
      "changes": []
    }
  },
  {
    "user_command": "sıfıra eşit olanları griye boya",
    "logic": "highlight zero values in grey",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "value == 0",
      "color": "#e5e7eb",
      "reply": "✓ Sıfıra eşit değerler griye boyandı.",
      "changes": []
    }
  },
  {
    "user_command": "satırları alternatif renkle boya",
    "logic": "highlight rows alternating colors",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "alternating",
      "color": "#bfdbfe",
      "reply": "✓ Satırlar dönüşümlü renkle boyandı.",
      "changes": []
    }
  },
  {
    "user_command": "tek satırları mavi, çift satırları beyaz yap",
    "logic": "highlight odd rows blue and even rows white",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "odd_rows",
      "color": "#bfdbfe",
      "reply": "✓ Tek satırlar mavi, çift satırlar beyaz yapıldı.",
      "changes": []
    }
  },
  {
    "user_command": "negatif karları kırmızıya, pozitif karları yeşile boya",
    "logic": "dual color highlight: negative profit red, positive profit green",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "dual",
      "colorNegative": "#fecaca",
      "colorPositive": "#bbf7d0",
      "reply": "✓ Negatif karlar kırmızı, pozitif karlar yeşil boyandı.",
      "changes": []
    }
  },
  {
    "user_command": "A sütununun renklerini kaldır",
    "logic": "clear colors from column A",
    "category": "highlighting",
    "output": {
      "action": "clear_colors",
      "column": "A",
      "reply": "✓ A sütununun renkleri temizlendi.",
      "changes": []
    }
  },
  {
    "user_command": "sadece kırmızıları temizle",
    "logic": "clear only red highlights",
    "category": "highlighting",
    "output": {
      "action": "clear_colors",
      "color": "#fecaca",
      "reply": "✓ Kırmızı renkler temizlendi.",
      "changes": []
    }
  },
  {
    "user_command": "tüm renkleri temizle",
    "logic": "clear all highlights from sheet",
    "category": "highlighting",
    "output": {
      "action": "clear_colors",
      "reply": "✓ Tüm renkler temizlendi.",
      "changes": []
    }
  },
  {
    "user_command": "durumu beklemede olanları göster",
    "logic": "filter rows where status contains beklemede",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "contains",
      "value": "beklemede",
      "reply": "✓ Durumu 'beklemede' olan kayıtlar listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "onaylanmamış kayıtları filtrele",
    "logic": "filter rows where status is not approved",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "contains",
      "value": "onaylanmamış",
      "reply": "✓ Onaylanmamış kayıtlar filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "reddedilenleri listele",
    "logic": "filter rows where status is rejected",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "contains",
      "value": "reddedildi",
      "reply": "✓ Reddedilen kayıtlar listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "askıya alınanları göster",
    "logic": "filter rows with suspended status",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "contains",
      "value": "askıya alındı",
      "reply": "✓ Askıya alınan kayıtlar gösterildi.",
      "changes": []
    }
  },
  {
    "user_command": "teslim edilmeyenleri filtrele",
    "logic": "filter rows where delivery status is not done",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "contains",
      "value": "teslim edilmedi",
      "reply": "✓ Teslim edilmemiş kayıtlar filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "işlemdeki siparişleri göster",
    "logic": "filter orders with in-progress status",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "contains",
      "value": "işlemde",
      "reply": "✓ İşlemdeki siparişler gösterildi.",
      "changes": []
    }
  },
  {
    "user_command": "durumu bekliyor olanları sarıya boya",
    "logic": "highlight rows with waiting status in yellow",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "contains",
      "value": "bekliyor",
      "color": "#fef08a",
      "reply": "✓ 'Bekliyor' durumundaki satırlar sarıya boyandı.",
      "changes": []
    }
  },
  {
    "user_command": "durumu iptal olanları griye boya",
    "logic": "highlight cancelled status rows in grey",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "contains",
      "value": "iptal",
      "color": "#e5e7eb",
      "reply": "✓ İptal durumdaki satırlar griye boyandı.",
      "changes": []
    }
  },
  {
    "user_command": "durumu onaylandı olanları yeşile boya",
    "logic": "highlight approved status rows in green",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "contains",
      "value": "onaylandı",
      "color": "#bbf7d0",
      "reply": "✓ Onaylanan satırlar yeşile boyandı.",
      "changes": []
    }
  },
  {
    "user_command": "durumu reddedildi olanları kırmızıya boya",
    "logic": "highlight rejected status rows in red",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "contains",
      "value": "reddedildi",
      "color": "#fecaca",
      "reply": "✓ Reddedilen satırlar kırmızıya boyandı.",
      "changes": []
    }
  },
  {
    "user_command": "durumu devam ediyor olanları maviye boya",
    "logic": "highlight in-progress status rows in blue",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "contains",
      "value": "devam ediyor",
      "color": "#bfdbfe",
      "reply": "✓ 'Devam ediyor' durumundaki satırlar maviye boyandı.",
      "changes": []
    }
  },
  {
    "user_command": "durumu iptal olan satırları sil",
    "logic": "delete rows where status is cancelled",
    "category": "delete_rows",
    "output": {
      "action": "delete_rows",
      "condition": "contains",
      "value": "iptal",
      "reply": "✓ İptal durumundaki satırlar silindi.",
      "changes": []
    }
  },
  {
    "user_command": "kapatılan görevleri sil",
    "logic": "delete rows with closed task status",
    "category": "delete_rows",
    "output": {
      "action": "delete_rows",
      "condition": "contains",
      "value": "kapatıldı",
      "reply": "✓ Kapatılan görevler silindi.",
      "changes": []
    }
  },
  {
    "user_command": "tamamlanan ve eski kayıtları temizle",
    "logic": "delete rows with completed status",
    "category": "delete_rows",
    "output": {
      "action": "delete_rows",
      "condition": "contains",
      "value": "tamamlandı",
      "reply": "✓ Tamamlanan eski kayıtlar silindi.",
      "changes": []
    }
  },
  {
    "user_command": "seçili satırın durumunu tamamlandı yap",
    "logic": "update selected row status to completed",
    "category": "update_cells",
    "output": {
      "action": "update_cells",
      "formula": "set_value",
      "column": "durum",
      "value": "Tamamlandı",
      "condition": "selected",
      "reply": "✓ Seçili satırın durumu 'Tamamlandı' yapıldı.",
      "changes": []
    }
  },
  {
    "user_command": "tüm bekleyenlerin durumunu aktif yap",
    "logic": "update all waiting status to active",
    "category": "update_cells",
    "output": {
      "action": "update_cells",
      "formula": "set_value",
      "column": "durum",
      "value": "Aktif",
      "condition": "contains:bekliyor",
      "reply": "✓ Bekleyenlerin durumu 'Aktif' olarak güncellendi.",
      "changes": []
    }
  },
  {
    "user_command": "iptal olanları pasif olarak güncelle",
    "logic": "update cancelled status to passive",
    "category": "update_cells",
    "output": {
      "action": "update_cells",
      "formula": "set_value",
      "column": "durum",
      "value": "Pasif",
      "condition": "contains:iptal",
      "reply": "✓ İptal olanlar 'Pasif' olarak güncellendi.",
      "changes": []
    }
  },
  {
    "user_command": "ödeme yapılanların durumunu ödendi yap",
    "logic": "update payment status to paid for completed payments",
    "category": "update_cells",
    "output": {
      "action": "update_cells",
      "formula": "set_value",
      "column": "durum",
      "value": "Ödendi",
      "condition": "contains:ödeme yapıldı",
      "reply": "✓ Ödeme yapılanların durumu 'Ödendi' olarak güncellendi.",
      "changes": []
    }
  },
  {
    "user_command": "durumu aktif olanları say",
    "logic": "count rows with active status",
    "category": "count",
    "output": {
      "action": "count_if",
      "condition": "contains",
      "value": "aktif",
      "reply": "✓ Aktif durumdaki kayıt sayısı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "beklemede kaç kayıt var",
    "logic": "count rows with waiting status",
    "category": "count",
    "output": {
      "action": "count_if",
      "condition": "contains",
      "value": "beklemede",
      "reply": "✓ Beklemedeki kayıt sayısı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "tamamlanan görevleri say",
    "logic": "count rows with completed status",
    "category": "count",
    "output": {
      "action": "count_if",
      "condition": "contains",
      "value": "tamamlandı",
      "reply": "✓ Tamamlanan görev sayısı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "iptal edilen sipariş sayısı",
    "logic": "count cancelled orders",
    "category": "count",
    "output": {
      "action": "count_if",
      "condition": "contains",
      "value": "iptal",
      "reply": "✓ İptal edilen sipariş sayısı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "onay bekleyen kayıt adedi",
    "logic": "count records pending approval",
    "category": "count",
    "output": {
      "action": "count_if",
      "condition": "contains",
      "value": "onay bekliyor",
      "reply": "✓ Onay bekleyen kayıt adedi hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "öncelik sırasına göre listele",
    "logic": "sort by priority descending",
    "category": "sorting",
    "output": {
      "action": "sort",
      "column": "öncelik",
      "order": "desc",
      "reply": "✓ Öncelik sırasına göre listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "bölgeye göre alfabetik sırala",
    "logic": "sort by region alphabetically",
    "category": "sorting",
    "output": {
      "action": "sort",
      "column": "bölge",
      "order": "asc",
      "reply": "✓ Bölgeye göre alfabetik sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "en son güncellenen en üstte olsun",
    "logic": "sort by update date descending",
    "category": "sorting",
    "output": {
      "action": "sort",
      "column": "güncelleme_tarihi",
      "order": "desc",
      "reply": "✓ En son güncellenenler en üste alındı.",
      "changes": []
    }
  },
  {
    "user_command": "fatura tarihine göre en eskiden en yeniye sırala",
    "logic": "sort by invoice date ascending",
    "category": "sorting",
    "output": {
      "action": "sort",
      "column": "fatura_tarihi",
      "order": "asc",
      "reply": "✓ Fatura tarihi en eskiden yeniye sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "puana göre büyükten küçüğe sırala",
    "logic": "sort by score descending",
    "category": "sorting",
    "output": {
      "action": "sort",
      "column": "puan",
      "order": "desc",
      "reply": "✓ Puana göre büyükten küçüğe sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "ağırlığa göre artan sırala",
    "logic": "sort by weight ascending",
    "category": "sorting",
    "output": {
      "action": "sort",
      "column": "ağırlık",
      "order": "asc",
      "reply": "✓ Ağırlığa göre artan sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "kodu büyükten küçüğe sırala",
    "logic": "sort by code descending",
    "category": "sorting",
    "output": {
      "action": "sort",
      "column": "kod",
      "order": "desc",
      "reply": "✓ Kod büyükten küçüğe sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "ülkeye göre sırala sonra şehre göre",
    "logic": "sort by country then city",
    "category": "sorting",
    "output": {
      "action": "sort",
      "columns": [
        {
          "column": "ülke",
          "direction": "asc"
        },
        {
          "column": "şehir",
          "direction": "asc"
        }
      ],
      "reply": "✓ Ülke ve şehre göre sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "kategori ve alt kategori sıralaması yap",
    "logic": "sort by category then subcategory",
    "category": "sorting",
    "output": {
      "action": "sort",
      "columns": [
        {
          "column": "kategori",
          "direction": "asc"
        },
        {
          "column": "alt_kategori",
          "direction": "asc"
        }
      ],
      "reply": "✓ Kategori ve alt kategoriye göre sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "en düşük puanlılar öne gelsin",
    "logic": "sort by score ascending",
    "category": "sorting",
    "output": {
      "action": "sort",
      "column": "puan",
      "order": "asc",
      "reply": "✓ En düşük puanlılar öne alındı.",
      "changes": []
    }
  },
  {
    "user_command": "teslim tarihine göre en yakın önde olsun",
    "logic": "sort by delivery date ascending",
    "category": "sorting",
    "output": {
      "action": "sort",
      "column": "teslim_tarihi",
      "order": "asc",
      "reply": "✓ En yakın teslim tarihliler önde sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "indirim oranına göre büyükten küçüğe sırala",
    "logic": "sort by discount rate descending",
    "category": "sorting",
    "output": {
      "action": "sort",
      "column": "indirim_oranı",
      "order": "desc",
      "reply": "✓ İndirim oranına göre büyükten küçüğe sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "2023 yılına ait kayıtları göster",
    "logic": "filter records from year 2023",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "year_equals",
      "value": "2023",
      "reply": "✓ 2023 yılına ait kayıtlar filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "2024 yılındaki satışları listele",
    "logic": "filter sales from 2024",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "year_equals",
      "value": "2024",
      "reply": "✓ 2024 yılındaki satışlar listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "tutar 500 ile 1500 arasındakileri göster",
    "logic": "filter rows where amount is between 500 and 1500",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "between",
      "column": "tutar",
      "min": 500,
      "max": 1500,
      "reply": "✓ Tutarı 500-1500 arasındaki kayıtlar gösterildi.",
      "changes": []
    }
  },
  {
    "user_command": "yaşı 25 ile 40 arasında olanları filtrele",
    "logic": "filter rows where age is between 25 and 40",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "between",
      "column": "yaş",
      "min": 25,
      "max": 40,
      "reply": "✓ Yaşı 25-40 arasındaki kayıtlar filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "hem A hem B koşulunu sağlayanları göster",
    "logic": "filter rows matching both condition A and B",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "multi_and",
      "reply": "✓ Her iki koşulu sağlayan kayıtlar gösterildi.",
      "changes": []
    }
  },
  {
    "user_command": "adı Ali veya Ayşe olanları listele",
    "logic": "filter rows where name is Ali or Ayse",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "multi_or",
      "column": "ad",
      "values": [
        "Ali",
        "Ayşe"
      ],
      "reply": "✓ Adı Ali veya Ayşe olanlar listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "soyadı Yılmaz ile başlayanları göster",
    "logic": "filter rows where surname starts with Yilmaz",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "starts_with",
      "column": "soyad",
      "value": "Yılmaz",
      "reply": "✓ Soyadı 'Yılmaz' ile başlayanlar gösterildi.",
      "changes": []
    }
  },
  {
    "user_command": "e-postası .com ile bitenleri listele",
    "logic": "filter rows where email ends with .com",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "ends_with",
      "column": "eposta",
      "value": ".com",
      "reply": "✓ E-postası .com ile bitenler listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "telefon numarası boş olanları filtrele",
    "logic": "filter rows with empty phone numbers",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "is_empty",
      "column": "telefon",
      "reply": "✓ Telefon numarası boş kayıtlar filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "notu 90 ve üzeri olanları göster",
    "logic": "filter rows where grade >= 90",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "greater_equal",
      "column": "not",
      "value": 90,
      "reply": "✓ Notu 90 ve üzeri olanlar gösterildi.",
      "changes": []
    }
  },
  {
    "user_command": "maaşı 10000'in altında olanları listele",
    "logic": "filter rows where salary < 10000",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "less_than",
      "column": "maaş",
      "value": 10000,
      "reply": "✓ Maaşı 10.000'in altındakiler listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "indirimli ürünleri filtrele",
    "logic": "filter rows where discount > 0",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "greater_than",
      "column": "indirim",
      "value": 0,
      "reply": "✓ İndirimli ürünler filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "stok sıfır olan ürünleri göster",
    "logic": "filter rows where stock equals 0",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "stok",
      "value": 0,
      "reply": "✓ Stok sıfır olan ürünler gösterildi.",
      "changes": []
    }
  },
  {
    "user_command": "bugün teslim edilecek siparişleri göster",
    "logic": "filter orders with today's delivery date",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "date_today",
      "column": "teslim_tarihi",
      "reply": "✓ Bugün teslim edilecek siparişler gösterildi.",
      "changes": []
    }
  },
  {
    "user_command": "bu hafta oluşturulan kayıtları filtrele",
    "logic": "filter records created this week",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "this_week",
      "column": "tarih",
      "reply": "✓ Bu hafta oluşturulan kayıtlar filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "geçen ay yapılan işlemleri listele",
    "logic": "filter transactions from last month",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "last_month",
      "column": "tarih",
      "reply": "✓ Geçen ay yapılan işlemler listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "kategori Elektronik olanları göster",
    "logic": "filter rows where category is Electronics",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "kategori",
      "value": "Elektronik",
      "reply": "✓ Elektronik kategorisi filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "açıklama alanı dolu olanları göster",
    "logic": "filter rows with non-empty description",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "is_not_empty",
      "column": "açıklama",
      "reply": "✓ Açıklama alanı dolu kayıtlar gösterildi.",
      "changes": []
    }
  },
  {
    "user_command": "faturası kesilen ama ödenmeyenleri bul",
    "logic": "filter invoiced but unpaid rows",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "multi_and",
      "conditions": [
        {
          "column": "fatura",
          "value": "kesildi"
        },
        {
          "column": "ödeme",
          "value": "ödenmedi"
        }
      ],
      "reply": "✓ Faturası kesilip ödenmeyenler bulundu.",
      "changes": []
    }
  },
  {
    "user_command": "Ankara'daki müşterileri filtrele",
    "logic": "filter customers in Ankara",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "şehir",
      "value": "Ankara",
      "reply": "✓ Ankara'daki müşteriler filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "aktif müşterilerin toplam cirosunu hesapla",
    "logic": "sum revenue of active customers only",
    "category": "calculation",
    "output": {
      "action": "sum",
      "condition": "contains:aktif",
      "column": "ciro",
      "reply": "✓ Aktif müşterilerin toplam cirosu hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "İstanbul şubesinin satış toplamı",
    "logic": "sum sales for Istanbul branch",
    "category": "calculation",
    "output": {
      "action": "sum",
      "condition": "equals:İstanbul",
      "column": "satış",
      "reply": "✓ İstanbul şubesinin toplam satışı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "Ocak ayı gelirlerini topla",
    "logic": "sum revenue for January",
    "category": "calculation",
    "output": {
      "action": "sum",
      "condition": "month_equals:1",
      "column": "gelir",
      "reply": "✓ Ocak ayı gelirleri toplandı.",
      "changes": []
    }
  },
  {
    "user_command": "A ürününün toplam maliyeti nedir",
    "logic": "sum cost for product A",
    "category": "calculation",
    "output": {
      "action": "sum",
      "condition": "equals:A",
      "column": "maliyet",
      "reply": "✓ A ürününün toplam maliyeti hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "kargo ücretleri ne kadar tuttu",
    "logic": "sum all shipping costs",
    "category": "calculation",
    "output": {
      "action": "sum",
      "column": "kargo_ücreti",
      "reply": "✓ Toplam kargo ücreti hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "vergi dahil toplam tutarı bul",
    "logic": "sum total amount including tax",
    "category": "calculation",
    "output": {
      "action": "sum",
      "column": "kdv_dahil_tutar",
      "reply": "✓ KDV dahil toplam tutar hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "onaylanan siparişlerin tutarını topla",
    "logic": "sum amounts of approved orders",
    "category": "calculation",
    "output": {
      "action": "sum",
      "condition": "contains:onaylandı",
      "column": "tutar",
      "reply": "✓ Onaylanan siparişlerin toplam tutarı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "iade edilen ürünlerin maliyeti",
    "logic": "sum cost of returned products",
    "category": "calculation",
    "output": {
      "action": "sum",
      "condition": "contains:iade",
      "column": "maliyet",
      "reply": "✓ İade edilen ürünlerin toplam maliyeti hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "tüm harcamaların ortalaması nedir",
    "logic": "average of all expenses",
    "category": "calculation",
    "output": {
      "action": "average",
      "column": "harcama",
      "reply": "✓ Ortalama harcama tutarı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "departman bazlı ortalama maaş",
    "logic": "average salary per department",
    "category": "calculation",
    "output": {
      "action": "average",
      "column": "maaş",
      "groupBy": "departman",
      "reply": "✓ Departman bazlı ortalama maaş hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "en yüksek satış rakamı nedir",
    "logic": "find maximum sales value",
    "category": "calculation",
    "output": {
      "action": "max",
      "column": "satış",
      "reply": "✓ En yüksek satış rakamı bulundu.",
      "changes": []
    }
  },
  {
    "user_command": "en düşük sipariş tutarı kaç",
    "logic": "find minimum order amount",
    "category": "calculation",
    "output": {
      "action": "min",
      "column": "sipariş_tutarı",
      "reply": "✓ En düşük sipariş tutarı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "genel ortalama satışı hesapla",
    "logic": "calculate overall average sales",
    "category": "calculation",
    "output": {
      "action": "average",
      "column": "satış",
      "reply": "✓ Genel ortalama satış hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "brüt karı hesapla",
    "logic": "calculate gross profit as revenue minus cost",
    "category": "calculation",
    "output": {
      "action": "update_cells",
      "formula": "=gelir-maliyet",
      "column": "brüt_kar",
      "reply": "✓ Brüt kar hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "net satış tutarını göster",
    "logic": "calculate net sales total",
    "category": "calculation",
    "output": {
      "action": "sum",
      "column": "net_satış",
      "reply": "✓ Net satış tutarı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "benzersiz müşteri sayısını bul",
    "logic": "count unique customers",
    "category": "count",
    "output": {
      "action": "count_unique",
      "column": "müşteri",
      "reply": "✓ Benzersiz müşteri sayısı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "kaç farklı ürün var",
    "logic": "count distinct products",
    "category": "count",
    "output": {
      "action": "count_unique",
      "column": "ürün",
      "reply": "✓ Farklı ürün sayısı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "eksik veri içeren hücreleri say",
    "logic": "count cells with missing data",
    "category": "count",
    "output": {
      "action": "count_blank",
      "reply": "✓ Boş hücre sayısı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "dolu hücre sayısı nedir",
    "logic": "count non-empty cells",
    "category": "count",
    "output": {
      "action": "count",
      "condition": "non_empty",
      "reply": "✓ Dolu hücre sayısı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "100'ün üzerinde kaç satır var",
    "logic": "count rows where value exceeds 100",
    "category": "count",
    "output": {
      "action": "count_if",
      "condition": "greater_than",
      "value": 100,
      "reply": "✓ 100'ün üzerindeki satır sayısı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "toplam satır sayısını göster",
    "logic": "count total number of rows",
    "category": "count",
    "output": {
      "action": "count",
      "reply": "✓ Toplam satır sayısı gösterildi.",
      "changes": []
    }
  },
  {
    "user_command": "negatif değer kaç tane",
    "logic": "count negative values",
    "category": "count",
    "output": {
      "action": "count_if",
      "condition": "less_than",
      "value": 0,
      "reply": "✓ Negatif değer sayısı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "kadın çalışan sayısı",
    "logic": "count female employees",
    "category": "count",
    "output": {
      "action": "count_if",
      "condition": "contains",
      "value": "kadın",
      "reply": "✓ Kadın çalışan sayısı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "erkek çalışan sayısı",
    "logic": "count male employees",
    "category": "count",
    "output": {
      "action": "count_if",
      "condition": "contains",
      "value": "erkek",
      "reply": "✓ Erkek çalışan sayısı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "kaç farklı şehir var",
    "logic": "count distinct cities",
    "category": "count",
    "output": {
      "action": "count_unique",
      "column": "şehir",
      "reply": "✓ Farklı şehir sayısı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "bu yıl kaç sipariş girildi",
    "logic": "count orders entered this year",
    "category": "count",
    "output": {
      "action": "count_if",
      "condition": "year_equals",
      "value": "current_year",
      "reply": "✓ Bu yılki sipariş sayısı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "sıfır olan hücre adedi",
    "logic": "count cells with value zero",
    "category": "count",
    "output": {
      "action": "count_if",
      "condition": "equals",
      "value": 0,
      "reply": "✓ Değeri sıfır olan hücre sayısı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "iki tarih arasındaki gün farkını hesapla",
    "logic": "calculate difference in days between two dates",
    "category": "date",
    "output": {
      "action": "update_cells",
      "formula": "=DATEDIF(başlangıç,bitiş,\"D\")",
      "column": "gün_farkı",
      "reply": "✓ Tarihler arası gün farkı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "vade tarihine kaç gün kaldı",
    "logic": "calculate days remaining until due date",
    "category": "date",
    "output": {
      "action": "update_cells",
      "formula": "=vade_tarihi-BUGÜN()",
      "column": "kalan_gün",
      "reply": "✓ Vade tarihine kalan gün hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "tarihin ay bilgisini çıkar",
    "logic": "extract month from date column",
    "category": "date",
    "output": {
      "action": "transform",
      "formula": "=AY(tarih)",
      "column": "ay",
      "reply": "✓ Tarih kolonundan ay bilgisi çıkarıldı.",
      "changes": []
    }
  },
  {
    "user_command": "tarihin yıl bilgisini al",
    "logic": "extract year from date column",
    "category": "date",
    "output": {
      "action": "transform",
      "formula": "=YIL(tarih)",
      "column": "yıl",
      "reply": "✓ Tarih kolonundan yıl bilgisi alındı.",
      "changes": []
    }
  },
  {
    "user_command": "hangi çeyreğe ait olduğunu belirle",
    "logic": "calculate quarter from date",
    "category": "date",
    "output": {
      "action": "update_cells",
      "formula": "=ROUNDUP(AY(tarih)/3,0)",
      "column": "çeyrek",
      "reply": "✓ Tarihin ait olduğu çeyrek belirlendi.",
      "changes": []
    }
  },
  {
    "user_command": "tarihe 30 gün ekle",
    "logic": "add 30 days to date column",
    "category": "date",
    "output": {
      "action": "update_cells",
      "formula": "=tarih+30",
      "column": "yeni_tarih",
      "reply": "✓ Tarihlere 30 gün eklendi.",
      "changes": []
    }
  },
  {
    "user_command": "iş günü sayısını hesapla",
    "logic": "count working days between dates",
    "category": "date",
    "output": {
      "action": "update_cells",
      "formula": "=NETWORKDAYS(başlangıç,bitiş)",
      "column": "iş_günü",
      "reply": "✓ İş günü sayısı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "haftanın gününü göster",
    "logic": "show day of week for each date",
    "category": "date",
    "output": {
      "action": "transform",
      "formula": "=METNEÇEVİR(tarih,\"GGGG\")",
      "column": "gün_adı",
      "reply": "✓ Haftanın günleri gösterildi.",
      "changes": []
    }
  },
  {
    "user_command": "ayın son günü ne olduğunu bul",
    "logic": "find last day of month for each date",
    "category": "date",
    "output": {
      "action": "update_cells",
      "formula": "=SONAY(tarih,0)",
      "column": "ay_sonu",
      "reply": "✓ Ayın son günü hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "tarihi metin formatına çevir",
    "logic": "convert date to text format",
    "category": "date",
    "output": {
      "action": "transform",
      "formula": "=METNEÇEVİR(tarih,\"GG.AA.YYYY\")",
      "column": "tarih_metin",
      "reply": "✓ Tarihler metin formatına çevrildi.",
      "changes": []
    }
  },
  {
    "user_command": "doğum tarihinden yaş hesapla",
    "logic": "calculate age from birth date",
    "category": "date",
    "output": {
      "action": "update_cells",
      "formula": "=DATEDIF(doğum_tarihi,BUGÜN(),\"Y\")",
      "column": "yaş",
      "reply": "✓ Doğum tarihinden yaş hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "sözleşme bitiş tarihine 1 yıl ekle",
    "logic": "extend contract end date by 1 year",
    "category": "date",
    "output": {
      "action": "update_cells",
      "formula": "=TARİH(YIL(bitiş_tarihi)+1,AY(bitiş_tarihi),GÜN(bitiş_tarihi))",
      "column": "yeni_bitiş",
      "reply": "✓ Sözleşme bitiş tarihine 1 yıl eklendi.",
      "changes": []
    }
  },
  {
    "user_command": "tarihi gün ay yıl olarak göster",
    "logic": "format date as day month year",
    "category": "date",
    "output": {
      "action": "transform",
      "formula": "=METNEÇEVİR(tarih,\"GG MMMM YYYY\")",
      "column": "tarih_format",
      "reply": "✓ Tarihler gün/ay/yıl formatında gösterildi.",
      "changes": []
    }
  },
  {
    "user_command": "son 90 günün kayıtlarını bul",
    "logic": "find records from last 90 days",
    "category": "date",
    "output": {
      "action": "filter",
      "condition": "greater_equal",
      "column": "tarih",
      "value": "TODAY()-90",
      "reply": "✓ Son 90 günün kayıtları bulundu.",
      "changes": []
    }
  },
  {
    "user_command": "tarihin sadece ay ve yıl kısmını al",
    "logic": "extract month and year from date",
    "category": "date",
    "output": {
      "action": "transform",
      "formula": "=METNEÇEVİR(tarih,\"AA/YYYY\")",
      "column": "ay_yıl",
      "reply": "✓ Tarihten ay/yıl bilgisi alındı.",
      "changes": []
    }
  },
  {
    "user_command": "ad ve soyadı birleştir",
    "logic": "concatenate first name and last name columns",
    "category": "text",
    "output": {
      "action": "update_cells",
      "formula": "=ad&\" \"&soyad",
      "column": "tam_ad",
      "reply": "✓ Ad ve soyad birleştirildi.",
      "changes": []
    }
  },
  {
    "user_command": "metni büyük harfe çevir",
    "logic": "convert text column to uppercase",
    "category": "text",
    "output": {
      "action": "transform",
      "formula": "=BÜYÜKHARF(metin)",
      "column": "büyük_metin",
      "reply": "✓ Metin büyük harfe çevrildi.",
      "changes": []
    }
  },
  {
    "user_command": "metni küçük harfe çevir",
    "logic": "convert text column to lowercase",
    "category": "text",
    "output": {
      "action": "transform",
      "formula": "=KÜÇÜKHARF(metin)",
      "column": "küçük_metin",
      "reply": "✓ Metin küçük harfe çevrildi.",
      "changes": []
    }
  },
  {
    "user_command": "baş harfleri büyük yap",
    "logic": "capitalize first letter of each word",
    "category": "text",
    "output": {
      "action": "transform",
      "formula": "=YAZIM.DÜZENİ(metin)",
      "column": "düzenli_metin",
      "reply": "✓ Baş harfler büyük yapıldı.",
      "changes": []
    }
  },
  {
    "user_command": "metnin uzunluğunu hesapla",
    "logic": "calculate length of text in each cell",
    "category": "text",
    "output": {
      "action": "update_cells",
      "formula": "=UZUNLUK(metin)",
      "column": "uzunluk",
      "reply": "✓ Metin uzunlukları hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "başındaki ve sonundaki boşlukları sil",
    "logic": "trim leading and trailing spaces",
    "category": "text",
    "output": {
      "action": "transform",
      "formula": "=KIRP(metin)",
      "column": "temiz_metin",
      "reply": "✓ Baş ve son boşluklar silindi.",
      "changes": []
    }
  },
  {
    "user_command": "metinde geçen virgülleri noktalı virgülle değiştir",
    "logic": "replace commas with semicolons in text",
    "category": "text",
    "output": {
      "action": "transform",
      "formula": "=YERİNEKOY(metin,\",\",\";\")",
      "column": "yeni_metin",
      "reply": "✓ Virgüller noktalı virgülle değiştirildi.",
      "changes": []
    }
  },
  {
    "user_command": "telefon numarasının ilk 3 hanesini al",
    "logic": "extract first 3 digits from phone number",
    "category": "text",
    "output": {
      "action": "transform",
      "formula": "=SOLDAN(telefon,3)",
      "column": "alan_kodu",
      "reply": "✓ Telefon numarasının ilk 3 hanesi alındı.",
      "changes": []
    }
  },
  {
    "user_command": "e-posta adresinden domain kısmını çıkar",
    "logic": "extract domain from email address",
    "category": "text",
    "output": {
      "action": "transform",
      "formula": "=PARÇAAL(eposta,BUL(\"@\",eposta)+1,100)",
      "column": "domain",
      "reply": "✓ E-posta adreslerinden domain çıkarıldı.",
      "changes": []
    }
  },
  {
    "user_command": "metni @ işaretinden böl",
    "logic": "split text at @ symbol",
    "category": "text",
    "output": {
      "action": "transform",
      "formula": "=SOLDAN(eposta,BUL(\"@\",eposta)-1)",
      "column": "kullanıcı_adı",
      "reply": "✓ Metin @ işaretinden bölündü.",
      "changes": []
    }
  },
  {
    "user_command": "ürün kodunun son 4 karakterini al",
    "logic": "extract last 4 characters of product code",
    "category": "text",
    "output": {
      "action": "transform",
      "formula": "=SAĞDAN(ürün_kodu,4)",
      "column": "son_4",
      "reply": "✓ Ürün kodunun son 4 karakteri alındı.",
      "changes": []
    }
  },
  {
    "user_command": "açıklama alanındaki fazla boşlukları temizle",
    "logic": "remove extra spaces from description",
    "category": "text",
    "output": {
      "action": "transform",
      "formula": "=KIRP(açıklama)",
      "column": "temiz_açıklama",
      "reply": "✓ Açıklama alanındaki fazla boşluklar temizlendi.",
      "changes": []
    }
  },
  {
    "user_command": "isme 'Bay/Bayan' öneki ekle",
    "logic": "add Bay/Bayan prefix based on gender",
    "category": "text",
    "output": {
      "action": "update_cells",
      "formula": "=EĞER(cinsiyet=\"E\",\"Bay \",\"Bayan \")&ad",
      "column": "unvanlı_ad",
      "reply": "✓ İsimlere Bay/Bayan öneki eklendi.",
      "changes": []
    }
  },
  {
    "user_command": "TC kimlik numarasının ilk 3 hanesini gizle",
    "logic": "mask first 3 digits of ID number",
    "category": "text",
    "output": {
      "action": "transform",
      "formula": "=YERİNEKOY(tc_no,1,3,\"***\")",
      "column": "gizli_tc",
      "reply": "✓ TC kimlik numarasının ilk 3 hanesi gizlendi.",
      "changes": []
    }
  },
  {
    "user_command": "ürün adını büyük harfle yaz",
    "logic": "convert product name to uppercase",
    "category": "text",
    "output": {
      "action": "transform",
      "formula": "=BÜYÜKHARF(ürün_adı)",
      "column": "büyük_ürün",
      "reply": "✓ Ürün adları büyük harfe çevrildi.",
      "changes": []
    }
  },
  {
    "user_command": "COUNTIF formülü yaz belirtilen koşul için",
    "logic": "generate COUNTIF formula",
    "category": "formula",
    "output": {
      "action": "generate_formula",
      "formula": "=EĞERSAY(A:A,\"koşul\")",
      "reply": "✓ COUNTIF formülü oluşturuldu.",
      "changes": []
    }
  },
  {
    "user_command": "VLOOKUP ile müşteri bilgisi getir",
    "logic": "generate VLOOKUP formula to fetch customer data",
    "category": "formula",
    "output": {
      "action": "generate_formula",
      "formula": "=DÜŞEYARA(A2,müşteri_tablosu,2,0)",
      "reply": "✓ VLOOKUP formülü oluşturuldu.",
      "changes": []
    }
  },
  {
    "user_command": "INDEX MATCH formülü oluştur",
    "logic": "generate INDEX MATCH formula",
    "category": "formula",
    "output": {
      "action": "generate_formula",
      "formula": "=İNDİS(B:B,KAÇINCI(A2,A:A,0))",
      "reply": "✓ INDEX/MATCH formülü oluşturuldu.",
      "changes": []
    }
  },
  {
    "user_command": "IFERROR ile hataları gizle",
    "logic": "wrap formula in IFERROR to hide errors",
    "category": "formula",
    "output": {
      "action": "generate_formula",
      "formula": "=EĞERHATA(formül,\"\")",
      "reply": "✓ IFERROR formülü oluşturuldu.",
      "changes": []
    }
  },
  {
    "user_command": "RANK formülü ile sıralama numarası ekle",
    "logic": "add RANK formula for ranking",
    "category": "formula",
    "output": {
      "action": "update_cells",
      "formula": "=SIRALA(A2,A:A,0)",
      "column": "sıra",
      "reply": "✓ RANK formülü eklendi.",
      "changes": []
    }
  },
  {
    "user_command": "AVERAGEIF formülü yaz",
    "logic": "generate AVERAGEIF formula",
    "category": "formula",
    "output": {
      "action": "generate_formula",
      "formula": "=ORTALAMAEĞER(A:A,\"koşul\",B:B)",
      "reply": "✓ AVERAGEIF formülü oluşturuldu.",
      "changes": []
    }
  },
  {
    "user_command": "koşullu toplam için SUMIF yaz",
    "logic": "generate SUMIF formula",
    "category": "formula",
    "output": {
      "action": "generate_formula",
      "formula": "=ETOPLA(A:A,\"koşul\",B:B)",
      "reply": "✓ SUMIF formülü oluşturuldu.",
      "changes": []
    }
  },
  {
    "user_command": "SUMIFS ile çok koşullu toplam",
    "logic": "generate SUMIFS formula with multiple conditions",
    "category": "formula",
    "output": {
      "action": "generate_formula",
      "formula": "=ÇOKETOPLA(C:C,A:A,\"koşul1\",B:B,\"koşul2\")",
      "reply": "✓ SUMIFS formülü oluşturuldu.",
      "changes": []
    }
  },
  {
    "user_command": "IF formülü ile koşullu değer ata",
    "logic": "generate IF formula for conditional value",
    "category": "formula",
    "output": {
      "action": "generate_formula",
      "formula": "=EĞER(koşul,doğru_değer,yanlış_değer)",
      "reply": "✓ IF formülü oluşturuldu.",
      "changes": []
    }
  },
  {
    "user_command": "çoklu EĞER formülü oluştur",
    "logic": "generate nested IF formula",
    "category": "formula",
    "output": {
      "action": "generate_formula",
      "formula": "=EĞER(A2>100,\"Yüksek\",EĞER(A2>50,\"Orta\",\"Düşük\"))",
      "reply": "✓ Çoklu EĞER formülü oluşturuldu.",
      "changes": []
    }
  },
  {
    "user_command": "XLOOKUP formülü yaz",
    "logic": "generate XLOOKUP formula",
    "category": "formula",
    "output": {
      "action": "generate_formula",
      "formula": "=XARA(A2,aranan_sütun,döndürülen_sütun)",
      "reply": "✓ XLOOKUP formülü oluşturuldu.",
      "changes": []
    }
  },
  {
    "user_command": "metni birleştiren formül yaz",
    "logic": "generate CONCAT or ampersand formula",
    "category": "formula",
    "output": {
      "action": "generate_formula",
      "formula": "=BİRLEŞTİR(A2,\" \",B2)",
      "reply": "✓ Metin birleştirme formülü oluşturuldu.",
      "changes": []
    }
  },
  {
    "user_command": "yüzde hesaplama formülü ekle",
    "logic": "add percentage calculation formula",
    "category": "formula",
    "output": {
      "action": "update_cells",
      "formula": "=A2/TOPLA(A:A)",
      "column": "yüzde",
      "reply": "✓ Yüzde hesaplama formülü eklendi.",
      "changes": []
    }
  },
  {
    "user_command": "kümülatif toplam formülü yaz",
    "logic": "generate cumulative sum formula",
    "category": "formula",
    "output": {
      "action": "update_cells",
      "formula": "=TOPLA($A$2:A2)",
      "column": "kümülatif",
      "reply": "✓ Kümülatif toplam formülü oluşturuldu.",
      "changes": []
    }
  },
  {
    "user_command": "koşullu ortalama hesapla AVERAGEIFS ile",
    "logic": "generate AVERAGEIFS formula",
    "category": "formula",
    "output": {
      "action": "generate_formula",
      "formula": "=ÇOKORTALAMA(C:C,A:A,\"koşul1\",B:B,\"koşul2\")",
      "reply": "✓ AVERAGEIFS formülü oluşturuldu.",
      "changes": []
    }
  },
  {
    "user_command": "telefon numaralarını standart formata getir",
    "logic": "format phone numbers to standard format",
    "category": "clean_data",
    "output": {
      "action": "clean_data",
      "type": "phone_format",
      "reply": "✓ Telefon numaraları standart formata getirildi.",
      "changes": []
    }
  },
  {
    "user_command": "fazladan boşlukları temizle",
    "logic": "remove extra spaces from all cells",
    "category": "clean_data",
    "output": {
      "action": "clean_data",
      "type": "trim_spaces",
      "reply": "✓ Fazladan boşluklar temizlendi.",
      "changes": []
    }
  },
  {
    "user_command": "Türkçe karakterleri düzelt",
    "logic": "fix Turkish characters encoding issues",
    "category": "clean_data",
    "output": {
      "action": "clean_data",
      "type": "fix_turkish_chars",
      "reply": "✓ Türkçe karakterler düzeltildi.",
      "changes": []
    }
  },
  {
    "user_command": "hücre başındaki sıfırları kaldır",
    "logic": "remove leading zeros from cells",
    "category": "clean_data",
    "output": {
      "action": "clean_data",
      "type": "remove_leading_zeros",
      "reply": "✓ Baştaki sıfırlar kaldırıldı.",
      "changes": []
    }
  },
  {
    "user_command": "sayısal olmayan karakterleri temizle",
    "logic": "remove non-numeric characters from number columns",
    "category": "clean_data",
    "output": {
      "action": "clean_data",
      "type": "remove_non_numeric",
      "reply": "✓ Sayısal olmayan karakterler temizlendi.",
      "changes": []
    }
  },
  {
    "user_command": "tarih formatlarını düzelt",
    "logic": "standardize date formats across column",
    "category": "clean_data",
    "output": {
      "action": "clean_data",
      "type": "fix_date_format",
      "reply": "✓ Tarih formatları düzeltildi.",
      "changes": []
    }
  },
  {
    "user_command": "e-posta adreslerini küçük harfe çevir",
    "logic": "convert email addresses to lowercase",
    "category": "clean_data",
    "output": {
      "action": "transform",
      "formula": "=KÜÇÜKHARF(eposta)",
      "column": "eposta",
      "reply": "✓ E-posta adresleri küçük harfe çevrildi.",
      "changes": []
    }
  },
  {
    "user_command": "tire ve boşlukları telefon numarasından çıkar",
    "logic": "remove hyphens and spaces from phone numbers",
    "category": "clean_data",
    "output": {
      "action": "clean_data",
      "type": "remove_special_chars",
      "column": "telefon",
      "reply": "✓ Telefon numaralarından tire ve boşluklar kaldırıldı.",
      "changes": []
    }
  },
  {
    "user_command": "sayıları düzgün formata çevir",
    "logic": "convert text numbers to numeric format",
    "category": "clean_data",
    "output": {
      "action": "clean_data",
      "type": "text_to_number",
      "reply": "✓ Metin sayılar sayısal formata çevrildi.",
      "changes": []
    }
  },
  {
    "user_command": "HTML etiketlerini metinden temizle",
    "logic": "strip HTML tags from text cells",
    "category": "clean_data",
    "output": {
      "action": "clean_data",
      "type": "strip_html",
      "reply": "✓ HTML etiketleri temizlendi.",
      "changes": []
    }
  },
  {
    "user_command": "boş satırları sil",
    "logic": "delete completely empty rows",
    "category": "clean_data",
    "output": {
      "action": "delete_rows",
      "condition": "all_empty",
      "reply": "✓ Boş satırlar silindi.",
      "changes": []
    }
  },
  {
    "user_command": "hücrelerdeki gizli karakterleri temizle",
    "logic": "remove hidden/invisible characters from cells",
    "category": "clean_data",
    "output": {
      "action": "clean_data",
      "type": "remove_hidden_chars",
      "reply": "✓ Gizli karakterler temizlendi.",
      "changes": []
    }
  },
  {
    "user_command": "tamamen boş olan satırları kaldır",
    "logic": "delete rows with all empty cells",
    "category": "delete_rows",
    "output": {
      "action": "delete_rows",
      "condition": "all_empty",
      "reply": "✓ Tamamen boş satırlar kaldırıldı.",
      "changes": []
    }
  },
  {
    "user_command": "2022 öncesi kayıtları sil",
    "logic": "delete rows with dates before 2022",
    "category": "delete_rows",
    "output": {
      "action": "delete_rows",
      "condition": "year_before",
      "value": 2022,
      "reply": "✓ 2022 öncesi kayıtlar silindi.",
      "changes": []
    }
  },
  {
    "user_command": "ilk 5 satırı sil",
    "logic": "delete first 5 rows",
    "category": "delete_rows",
    "output": {
      "action": "delete_rows",
      "condition": "first_n",
      "value": 5,
      "reply": "✓ İlk 5 satır silindi.",
      "changes": []
    }
  },
  {
    "user_command": "son 3 satırı kaldır",
    "logic": "delete last 3 rows",
    "category": "delete_rows",
    "output": {
      "action": "delete_rows",
      "condition": "last_n",
      "value": 3,
      "reply": "✓ Son 3 satır kaldırıldı.",
      "changes": []
    }
  },
  {
    "user_command": "test verilerini sil",
    "logic": "delete rows with 'test' in any column",
    "category": "delete_rows",
    "output": {
      "action": "delete_rows",
      "condition": "contains",
      "value": "test",
      "reply": "✓ Test verileri silindi.",
      "changes": []
    }
  },
  {
    "user_command": "değeri sıfır olan satırları kaldır",
    "logic": "delete rows where value equals zero",
    "category": "delete_rows",
    "output": {
      "action": "delete_rows",
      "condition": "equals",
      "value": 0,
      "reply": "✓ Değeri sıfır olan satırlar kaldırıldı.",
      "changes": []
    }
  },
  {
    "user_command": "eski arşiv kayıtlarını temizle",
    "logic": "delete rows marked as archive",
    "category": "delete_rows",
    "output": {
      "action": "delete_rows",
      "condition": "contains",
      "value": "arşiv",
      "reply": "✓ Arşiv kayıtları temizlendi.",
      "changes": []
    }
  },
  {
    "user_command": "silinmiş olarak işaretli satırları kaldır",
    "logic": "delete rows marked as deleted",
    "category": "delete_rows",
    "output": {
      "action": "delete_rows",
      "condition": "contains",
      "value": "silinmiş",
      "reply": "✓ Silinmiş olarak işaretli satırlar kaldırıldı.",
      "changes": []
    }
  },
  {
    "user_command": "geçersiz kayıtları temizle",
    "logic": "delete rows marked as invalid",
    "category": "delete_rows",
    "output": {
      "action": "delete_rows",
      "condition": "contains",
      "value": "geçersiz",
      "reply": "✓ Geçersiz kayıtlar temizlendi.",
      "changes": []
    }
  },
  {
    "user_command": "negatif miktarlı satırları sil",
    "logic": "delete rows with negative quantity values",
    "category": "delete_rows",
    "output": {
      "action": "delete_rows",
      "condition": "less_than",
      "column": "miktar",
      "value": 0,
      "reply": "✓ Negatif miktarlı satırlar silindi.",
      "changes": []
    }
  },
  {
    "user_command": "tüm fiyatlara yüzde 10 zam yap",
    "logic": "increase all prices by 10 percent",
    "category": "update_cells",
    "output": {
      "action": "update_cells",
      "formula": "=fiyat*1.1",
      "column": "fiyat",
      "reply": "✓ Tüm fiyatlara %10 zam yapıldı.",
      "changes": []
    }
  },
  {
    "user_command": "indirimli fiyatı hesapla",
    "logic": "calculate discounted price",
    "category": "update_cells",
    "output": {
      "action": "update_cells",
      "formula": "=fiyat*(1-indirim_oranı)",
      "column": "indirimli_fiyat",
      "reply": "✓ İndirimli fiyatlar hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "tüm ürünlere TR ön eki ekle",
    "logic": "add TR prefix to all product codes",
    "category": "update_cells",
    "output": {
      "action": "update_cells",
      "formula": "=\"TR-\"&ürün_kodu",
      "column": "ürün_kodu",
      "reply": "✓ Ürün kodlarına 'TR-' öneki eklendi.",
      "changes": []
    }
  },
  {
    "user_command": "sonuna TL birimi ekle",
    "logic": "append TL unit suffix to values",
    "category": "update_cells",
    "output": {
      "action": "update_cells",
      "formula": "=tutar&\" TL\"",
      "column": "tutar_metin",
      "reply": "✓ Tutarların sonuna 'TL' eklendi.",
      "changes": []
    }
  },
  {
    "user_command": "negatif değerleri sıfırla",
    "logic": "set negative values to zero",
    "category": "update_cells",
    "output": {
      "action": "update_cells",
      "formula": "=MAKS(değer,0)",
      "column": "değer",
      "reply": "✓ Negatif değerler sıfırlandı.",
      "changes": []
    }
  },
  {
    "user_command": "sayıları en yakın 5'e yuvarla",
    "logic": "round numbers to nearest 5",
    "category": "update_cells",
    "output": {
      "action": "update_cells",
      "formula": "=YUVARLA(değer/5,0)*5",
      "column": "yuvarlanmış",
      "reply": "✓ Sayılar en yakın 5'e yuvarlandı.",
      "changes": []
    }
  },
  {
    "user_command": "mutlak değer al",
    "logic": "take absolute value of all numbers",
    "category": "update_cells",
    "output": {
      "action": "update_cells",
      "formula": "=MUTLAK(değer)",
      "column": "mutlak_değer",
      "reply": "✓ Mutlak değerler alındı.",
      "changes": []
    }
  },
  {
    "user_command": "KDV oranını hesapla",
    "logic": "calculate VAT amount at 18 percent",
    "category": "update_cells",
    "output": {
      "action": "update_cells",
      "formula": "=tutar*0.18",
      "column": "kdv",
      "reply": "✓ KDV tutarları hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "KDV dahil fiyatı hesapla",
    "logic": "calculate price including VAT",
    "category": "update_cells",
    "output": {
      "action": "update_cells",
      "formula": "=tutar*1.18",
      "column": "kdv_dahil",
      "reply": "✓ KDV dahil fiyatlar hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "tüm maaşları 500 TL artır",
    "logic": "increase all salaries by 500 TL",
    "category": "update_cells",
    "output": {
      "action": "update_cells",
      "formula": "=maaş+500",
      "column": "maaş",
      "reply": "✓ Tüm maaşlar 500 TL artırıldı.",
      "changes": []
    }
  },
  {
    "user_command": "stok miktarını 1 azalt",
    "logic": "decrease stock quantity by 1",
    "category": "update_cells",
    "output": {
      "action": "update_cells",
      "formula": "=stok-1",
      "column": "stok",
      "reply": "✓ Stok miktarı 1 azaltıldı.",
      "changes": []
    }
  },
  {
    "user_command": "boş açıklama alanlarını Yok ile doldur",
    "logic": "fill empty description cells with Yok",
    "category": "update_cells",
    "output": {
      "action": "update_cells",
      "formula": "=EĞER(EĞERBOS(açıklama),\"Yok\",açıklama)",
      "column": "açıklama",
      "reply": "✓ Boş açıklama alanları 'Yok' ile dolduruldu.",
      "changes": []
    }
  },
  {
    "user_command": "koşullu olarak B sütununu güncelle",
    "logic": "conditionally update column B",
    "category": "update_cells",
    "output": {
      "action": "update_cells",
      "formula": "=EĞER(A2>100,\"Yüksek\",\"Normal\")",
      "column": "B",
      "reply": "✓ B sütunu koşullu güncellendi.",
      "changes": []
    }
  },
  {
    "user_command": "puanları 100 üzerinden normalize et",
    "logic": "normalize scores to 100 scale",
    "category": "update_cells",
    "output": {
      "action": "update_cells",
      "formula": "=(puan/MAKS(puan:puan))*100",
      "column": "normalize_puan",
      "reply": "✓ Puanlar 100 üzerinden normalize edildi.",
      "changes": []
    }
  },
  {
    "user_command": "negatif karları sıfıra eşitle",
    "logic": "set negative profits to zero",
    "category": "update_cells",
    "output": {
      "action": "update_cells",
      "formula": "=MAKS(kar,0)",
      "column": "kar",
      "reply": "✓ Negatif karlar sıfıra eşitlendi.",
      "changes": []
    }
  },
  {
    "user_command": "amortisman hesapla doğrusal yöntemle",
    "logic": "calculate straight-line depreciation",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "=(maliyet-kalıntı_değer)/faydalı_ömür",
      "column": "amortisman",
      "reply": "✓ Doğrusal amortisman hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "basit faiz hesapla",
    "logic": "calculate simple interest",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "=anapara*faiz_oranı*süre",
      "column": "faiz",
      "reply": "✓ Basit faiz hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "bileşik faiz hesapla",
    "logic": "calculate compound interest",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "=anapara*(1+faiz_oranı)^süre-anapara",
      "column": "bileşik_faiz",
      "reply": "✓ Bileşik faiz hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "kâr marjını hesapla",
    "logic": "calculate profit margin percentage",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "=(gelir-maliyet)/gelir*100",
      "column": "kar_marjı",
      "reply": "✓ Kâr marjı yüzdesi hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "brüt kar oranını bul",
    "logic": "calculate gross profit ratio",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "=(net_satış-satılan_malın_maliyeti)/net_satış",
      "column": "brüt_kar_oranı",
      "reply": "✓ Brüt kar oranı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "EBITDA hesapla",
    "logic": "calculate EBITDA",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "=faaliyet_karı+amortisman+itfa",
      "column": "ebitda",
      "reply": "✓ EBITDA değeri hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "NPV hesapla",
    "logic": "calculate net present value",
    "category": "finance",
    "output": {
      "action": "generate_formula",
      "formula": "=NBD(iskonto_oranı,nakit_akışları)",
      "reply": "✓ NBD (Net Bugünkü Değer) formülü oluşturuldu.",
      "changes": []
    }
  },
  {
    "user_command": "ROI hesapla",
    "logic": "calculate return on investment",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "=(kazanç-maliyet)/maliyet*100",
      "column": "roi",
      "reply": "✓ ROI (Yatırım Getirisi) hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "bilanço dengesiyle kontrol et",
    "logic": "verify balance sheet equation",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "=EĞER(aktif=pasif+özkaynaklar,\"Dengeli\",\"Hatalı\")",
      "column": "bilanço_kontrol",
      "reply": "✓ Bilanço dengesi kontrol edildi.",
      "changes": []
    }
  },
  {
    "user_command": "nakit akış tablosu hazırla",
    "logic": "prepare cash flow calculation",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "=nakit_girişleri-nakit_çıkışları",
      "column": "net_nakit_akışı",
      "reply": "✓ Net nakit akışı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "cari oran hesapla",
    "logic": "calculate current ratio",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "=dönen_varlıklar/kısa_vadeli_borçlar",
      "column": "cari_oran",
      "reply": "✓ Cari oran hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "borç özkaynak oranını hesapla",
    "logic": "calculate debt to equity ratio",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "=toplam_borç/özkaynaklar",
      "column": "borç_özkaynak",
      "reply": "✓ Borç/Özkaynak oranı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "aylık taksit miktarını hesapla",
    "logic": "calculate monthly installment amount",
    "category": "finance",
    "output": {
      "action": "generate_formula",
      "formula": "=DEVRESEL_ÖDEME(faiz_oranı/12,vade,anapara)",
      "reply": "✓ Aylık taksit miktarı formülü oluşturuldu.",
      "changes": []
    }
  },
  {
    "user_command": "KDV tutarını ayrıştır",
    "logic": "extract VAT amount from total price",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "=kdv_dahil_fiyat-kdv_dahil_fiyat/1.18",
      "column": "kdv_tutarı",
      "reply": "✓ KDV tutarı ayrıştırıldı.",
      "changes": []
    }
  },
  {
    "user_command": "yıllık gelir büyüme oranını hesapla",
    "logic": "calculate year over year revenue growth rate",
    "category": "finance",
    "output": {
      "action": "update_cells",
      "formula": "=(bu_yıl_gelir-geçen_yıl_gelir)/geçen_yıl_gelir*100",
      "column": "büyüme_oranı",
      "reply": "✓ Yıllık gelir büyüme oranı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "performans primine göre ek ücret hesapla",
    "logic": "calculate performance bonus based on rating",
    "category": "hr",
    "output": {
      "action": "update_cells",
      "formula": "=EĞER(performans>=90,maaş*0.2,EĞER(performans>=70,maaş*0.1,0))",
      "column": "prim",
      "reply": "✓ Performans primi hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "yol harcırahını hesapla",
    "logic": "calculate travel allowance",
    "category": "hr",
    "output": {
      "action": "update_cells",
      "formula": "=mesafe*harcırah_katsayısı",
      "column": "harcırah",
      "reply": "✓ Yol harcırahı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "yemek bedelini ekle",
    "logic": "add meal allowance to salary",
    "category": "hr",
    "output": {
      "action": "update_cells",
      "formula": "=çalışma_günü*günlük_yemek",
      "column": "yemek_bedeli",
      "reply": "✓ Yemek bedeli hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "SGK işveren payını hesapla",
    "logic": "calculate employer SGK contribution",
    "category": "hr",
    "output": {
      "action": "update_cells",
      "formula": "=brüt_maaş*0.2075",
      "column": "sgk_işveren",
      "reply": "✓ SGK işveren payı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "işçi SGK kesintisini bul",
    "logic": "calculate employee SGK deduction",
    "category": "hr",
    "output": {
      "action": "update_cells",
      "formula": "=brüt_maaş*0.14",
      "column": "sgk_işçi",
      "reply": "✓ İşçi SGK kesintisi hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "gelir vergisi hesapla",
    "logic": "calculate income tax on salary",
    "category": "hr",
    "output": {
      "action": "update_cells",
      "formula": "=brüt_maaş*0.15",
      "column": "gelir_vergisi",
      "reply": "✓ Gelir vergisi hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "net maaşı hesapla",
    "logic": "calculate net salary after deductions",
    "category": "hr",
    "output": {
      "action": "update_cells",
      "formula": "=brüt_maaş-sgk_işçi-gelir_vergisi",
      "column": "net_maaş",
      "reply": "✓ Net maaş hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "fazla mesai ücretini hesapla",
    "logic": "calculate overtime pay",
    "category": "hr",
    "output": {
      "action": "update_cells",
      "formula": "=fazla_mesai_saati*(saatlik_ücret*1.5)",
      "column": "fazla_mesai_ücreti",
      "reply": "✓ Fazla mesai ücreti hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "kıdem tazminatını hesapla",
    "logic": "calculate severance pay based on seniority",
    "category": "hr",
    "output": {
      "action": "update_cells",
      "formula": "=kıdem_yılı*30*(brüt_maaş/30)",
      "column": "kıdem_tazminatı",
      "reply": "✓ Kıdem tazminatı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "yıllık izin hakkını hesapla",
    "logic": "calculate annual leave entitlement",
    "category": "hr",
    "output": {
      "action": "update_cells",
      "formula": "=EĞER(kıdem_yılı>=10,26,EĞER(kıdem_yılı>=5,20,14))",
      "column": "yıllık_izin",
      "reply": "✓ Yıllık izin hakkı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "medyan değeri bul",
    "logic": "find median value in column",
    "category": "statistics",
    "output": {
      "action": "update_cells",
      "formula": "=ORTANCA(değerler)",
      "column": "medyan",
      "reply": "✓ Medyan değeri hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "en sık tekrar eden değeri bul",
    "logic": "find modal value (most frequent)",
    "category": "statistics",
    "output": {
      "action": "update_cells",
      "formula": "=MOD(değerler)",
      "column": "mod",
      "reply": "✓ En sık tekrar eden değer bulundu.",
      "changes": []
    }
  },
  {
    "user_command": "standart sapmayı hesapla",
    "logic": "calculate standard deviation",
    "category": "statistics",
    "output": {
      "action": "update_cells",
      "formula": "=STDSAPMA(değerler)",
      "column": "std_sapma",
      "reply": "✓ Standart sapma hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "varyansı hesapla",
    "logic": "calculate variance",
    "category": "statistics",
    "output": {
      "action": "update_cells",
      "formula": "=VAR(değerler)",
      "column": "varyans",
      "reply": "✓ Varyans hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "büyüme oranını hesapla",
    "logic": "calculate growth rate year over year",
    "category": "statistics",
    "output": {
      "action": "update_cells",
      "formula": "=(yeni_değer-eski_değer)/eski_değer*100",
      "column": "büyüme_oranı",
      "reply": "✓ Büyüme oranı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "yüzdelik dilimi bul",
    "logic": "calculate percentile rank",
    "category": "statistics",
    "output": {
      "action": "update_cells",
      "formula": "=YÜZDEBİRLİK(dizi,yüzde)",
      "column": "yüzdelik",
      "reply": "✓ Yüzdelik dilim hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "korelasyon katsayısını hesapla",
    "logic": "calculate correlation coefficient",
    "category": "statistics",
    "output": {
      "action": "update_cells",
      "formula": "=KORELASYON(X_dizisi,Y_dizisi)",
      "column": "korelasyon",
      "reply": "✓ Korelasyon katsayısı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "aralık değerini hesapla (max-min)",
    "logic": "calculate range as max minus min",
    "category": "statistics",
    "output": {
      "action": "update_cells",
      "formula": "=MAKS(değerler)-MİN(değerler)",
      "column": "aralık",
      "reply": "✓ Aralık değeri (maks-min) hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "hareketli ortalama hesapla",
    "logic": "calculate moving average over 3 periods",
    "category": "statistics",
    "output": {
      "action": "update_cells",
      "formula": "=ORTALAMA(KAYDIR(B2,-2,0,3,1))",
      "column": "hareketli_ort",
      "reply": "✓ 3 dönemlik hareketli ortalama hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "değerlerin yüzde kaçı hedefin üstünde",
    "logic": "calculate percentage of values above target",
    "category": "statistics",
    "output": {
      "action": "update_cells",
      "formula": "=EĞERSAY(değerler,\">\",hedef)/BAĞ_DEĞ_DOLU_SAY(değerler)*100",
      "column": "hedef_üstü_yüzde",
      "reply": "✓ Hedefin üstündeki değerlerin yüzdesi hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "e-posta adreslerini ayıkla",
    "logic": "extract email addresses from text",
    "category": "extract",
    "output": {
      "action": "extract",
      "type": "email",
      "column": "metin",
      "reply": "✓ E-posta adresleri ayıklandı.",
      "changes": []
    }
  },
  {
    "user_command": "telefon numaralarını çıkar",
    "logic": "extract phone numbers from text",
    "category": "extract",
    "output": {
      "action": "extract",
      "type": "phone",
      "column": "metin",
      "reply": "✓ Telefon numaraları çıkarıldı.",
      "changes": []
    }
  },
  {
    "user_command": "URL adreslerini ayıkla",
    "logic": "extract URL addresses from text",
    "category": "extract",
    "output": {
      "action": "extract",
      "type": "url",
      "column": "metin",
      "reply": "✓ URL adresleri ayıklandı.",
      "changes": []
    }
  },
  {
    "user_command": "TC kimlik numaralarını çıkar",
    "logic": "extract Turkish national ID numbers from text",
    "category": "extract",
    "output": {
      "action": "extract",
      "type": "tc_id",
      "column": "metin",
      "reply": "✓ TC kimlik numaraları çıkarıldı.",
      "changes": []
    }
  },
  {
    "user_command": "parantez içindeki değerleri al",
    "logic": "extract values inside parentheses",
    "category": "extract",
    "output": {
      "action": "transform",
      "formula": "=PARÇAAL(metin,BUL(\"(\",metin)+1,BUL(\")\",metin)-BUL(\"(\",metin)-1)",
      "column": "parantez_içi",
      "reply": "✓ Parantez içindeki değerler alındı.",
      "changes": []
    }
  },
  {
    "user_command": "fatura numaralarını çıkar",
    "logic": "extract invoice numbers from text",
    "category": "extract",
    "output": {
      "action": "extract",
      "type": "invoice_number",
      "column": "açıklama",
      "reply": "✓ Fatura numaraları çıkarıldı.",
      "changes": []
    }
  },
  {
    "user_command": "ürün kodunu metinden çıkar",
    "logic": "extract product code from description text",
    "category": "extract",
    "output": {
      "action": "extract",
      "type": "product_code",
      "column": "açıklama",
      "reply": "✓ Ürün kodu metinden çıkarıldı.",
      "changes": []
    }
  },
  {
    "user_command": "IBAN numaralarını ayıkla",
    "logic": "extract IBAN numbers from text",
    "category": "extract",
    "output": {
      "action": "extract",
      "type": "iban",
      "column": "metin",
      "reply": "✓ IBAN numaraları ayıklandı.",
      "changes": []
    }
  },
  {
    "user_command": "posta kodlarını çıkar",
    "logic": "extract postal codes from address text",
    "category": "extract",
    "output": {
      "action": "extract",
      "type": "postal_code",
      "column": "adres",
      "reply": "✓ Posta kodları çıkarıldı.",
      "changes": []
    }
  },
  {
    "user_command": "para tutarlarını metinden ayıkla",
    "logic": "extract monetary amounts from text",
    "category": "extract",
    "output": {
      "action": "extract",
      "type": "currency_amount",
      "column": "metin",
      "reply": "✓ Para tutarları ayıklandı.",
      "changes": []
    }
  },
  {
    "user_command": "A sütunundaki tekrarları kaldır",
    "logic": "remove duplicates based on column A",
    "category": "deduplicate",
    "output": {
      "action": "remove_duplicates",
      "column": "A",
      "keep": "first",
      "reply": "✓ A sütunundaki tekrar eden değerler kaldırıldı.",
      "changes": []
    }
  },
  {
    "user_command": "e-posta bazında mükerrer kayıtları sil",
    "logic": "remove duplicate records based on email",
    "category": "deduplicate",
    "output": {
      "action": "remove_duplicates",
      "column": "eposta",
      "keep": "first",
      "reply": "✓ E-posta bazında mükerrer kayıtlar silindi.",
      "changes": []
    }
  },
  {
    "user_command": "son girişi tut tekrarları sil",
    "logic": "remove duplicates keeping the last occurrence",
    "category": "deduplicate",
    "output": {
      "action": "remove_duplicates",
      "keep": "last",
      "reply": "✓ Tekrar eden kayıtlar silindi, son girişler tutuldu.",
      "changes": []
    }
  },
  {
    "user_command": "isim bazında tekrar eden satırları kaldır",
    "logic": "remove duplicate rows based on name column",
    "category": "deduplicate",
    "output": {
      "action": "remove_duplicates",
      "column": "isim",
      "keep": "first",
      "reply": "✓ İsim bazında tekrar eden satırlar kaldırıldı.",
      "changes": []
    }
  },
  {
    "user_command": "benzersiz kayıtları listele",
    "logic": "show only unique records",
    "category": "deduplicate",
    "output": {
      "action": "remove_duplicates",
      "keep": "first",
      "reply": "✓ Yalnızca benzersiz kayıtlar listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "verideki anomalileri raporla",
    "logic": "generate a report summarizing data anomalies",
    "category": "message",
    "output": {
      "action": "message",
      "reply": "Veri analizi tamamlandı. Anomali raporu: Boş hücreler, aşırı değerler ve tutarsız formatlar tespit edildi.",
      "changes": []
    }
  },
  {
    "user_command": "sütun istatistiklerini göster",
    "logic": "display statistics for each column",
    "category": "message",
    "output": {
      "action": "message",
      "reply": "Sütun istatistikleri: Ortalama, min, max, standart sapma ve boş hücre sayısı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "veri kalitesi raporu oluştur",
    "logic": "create a data quality report",
    "category": "message",
    "output": {
      "action": "message",
      "reply": "Veri kalitesi raporu: Eksik değerler, format hataları ve mükerrer kayıtlar analiz edildi.",
      "changes": []
    }
  },
  {
    "user_command": "hangi sütunlarda boş veri var",
    "logic": "identify columns with missing data",
    "category": "message",
    "output": {
      "action": "message",
      "reply": "Boş veri analizi tamamlandı. Eksik değer içeren sütunlar belirlendi.",
      "changes": []
    }
  },
  {
    "user_command": "özet rapor oluştur",
    "logic": "generate a summary report of the dataset",
    "category": "message",
    "output": {
      "action": "message",
      "reply": "Özet rapor oluşturuldu. Toplam kayıt sayısı, kategoriler ve temel istatistikler hazırlandı.",
      "changes": []
    }
  },
  {
    "user_command": "veri dağılımını analiz et",
    "logic": "analyze the distribution of data values",
    "category": "message",
    "output": {
      "action": "message",
      "reply": "Veri dağılımı analizi tamamlandı. Min, max, medyan ve yüzdelik dilimler hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "bu tabloda ne var açıkla",
    "logic": "explain the contents of the current table",
    "category": "message",
    "output": {
      "action": "message",
      "reply": "Tablo analizi: Sütun yapısı, veri tipleri ve içerik özeti hazırlandı.",
      "changes": []
    }
  },
  {
    "user_command": "veriye bakarak öneri sun",
    "logic": "provide recommendations based on data analysis",
    "category": "message",
    "output": {
      "action": "message",
      "reply": "Veri analizi tamamlandı. Temizleme, optimizasyon ve format düzenleme önerileri hazırlandı.",
      "changes": []
    }
  },
  {
    "user_command": "tablo yapısını özetle",
    "logic": "summarize the table structure and columns",
    "category": "message",
    "output": {
      "action": "message",
      "reply": "Tablo yapısı özetlendi. Sütun adları, veri tipleri ve satır sayısı belirlendi.",
      "changes": []
    }
  },
  {
    "user_command": "bekleyen siparişleri göster",
    "logic": "filter pending orders awaiting processing",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "contains",
      "value": "bekliyor",
      "reply": "✓ Bekleyen siparişler filtrelendi",
      "changes": []
    }
  },
  {
    "user_command": "teslim edilen siparişleri filtrele",
    "logic": "filter delivered completed orders",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "contains",
      "value": "teslim",
      "reply": "✓ Teslim edilen siparişler filtrelendi",
      "changes": []
    }
  },
  {
    "user_command": "iptal oranını hesapla",
    "logic": "calculate cancellation rate percentage",
    "category": "calculation",
    "output": {
      "action": "message",
      "formula": "cancellation_rate",
      "reply": "📊 İptal oranı hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "iade edilen ürünleri listele",
    "logic": "list returned refunded products",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "contains",
      "value": "iade",
      "reply": "✓ İade edilen ürünler listelendi",
      "changes": []
    }
  },
  {
    "user_command": "ortalama sipariş değeri ne kadar",
    "logic": "calculate average order value AOV",
    "category": "calculation",
    "output": {
      "action": "average",
      "column": "tutar",
      "reply": "✓ Ortalama sipariş değeri hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "en çok sipariş veren müşteriyi bul",
    "logic": "find customer with most orders highest frequency",
    "category": "calculation",
    "output": {
      "action": "max",
      "column": "sipariş_sayısı",
      "reply": "✓ En çok sipariş veren müşteri bulundu",
      "changes": []
    }
  },
  {
    "user_command": "bu hafta gelen siparişleri filtrele",
    "logic": "filter orders received this week current week",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "thisWeek",
      "column": "tarih",
      "reply": "✓ Bu haftanın siparişleri filtrelendi",
      "changes": []
    }
  },
  {
    "user_command": "kargo bekleyen siparişleri göster",
    "logic": "show orders waiting for shipment cargo",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "contains",
      "value": "kargo",
      "reply": "✓ Kargo bekleyen siparişler gösterildi",
      "changes": []
    }
  },
  {
    "user_command": "500 tl üzeri siparişleri filtrele",
    "logic": "filter orders above 500 TL value",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "value > 500",
      "column": "tutar",
      "reply": "✓ 500 TL üzeri siparişler filtrelendi",
      "changes": []
    }
  },
  {
    "user_command": "tekrar sipariş veren müşterileri bul",
    "logic": "find repeat returning customers orders",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "value > 1",
      "column": "sipariş_sayısı",
      "reply": "✓ Tekrar sipariş veren müşteriler bulundu",
      "changes": []
    }
  },
  {
    "user_command": "izin günlerini topla",
    "logic": "sum total leave days vacation",
    "category": "calculation",
    "output": {
      "action": "sum",
      "column": "izin",
      "reply": "✓ Toplam izin günleri hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "fazla mesai saatlerini hesapla",
    "logic": "calculate total overtime hours",
    "category": "calculation",
    "output": {
      "action": "sum",
      "column": "fazla_mesai",
      "reply": "✓ Fazla mesai saatleri hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "performans puanı ortalaması ne",
    "logic": "average performance score rating",
    "category": "calculation",
    "output": {
      "action": "average",
      "column": "performans",
      "reply": "✓ Performans puanı ortalaması hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "deneme süresindeki çalışanları listele",
    "logic": "list employees on probation trial period",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "contains",
      "value": "deneme",
      "column": "durum",
      "reply": "✓ Deneme süresindeki çalışanlar listelendi",
      "changes": []
    }
  },
  {
    "user_command": "işten ayrılanları filtrele",
    "logic": "filter resigned terminated employees",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "contains",
      "value": "ayrıldı",
      "column": "durum",
      "reply": "✓ İşten ayrılanlar filtrelendi",
      "changes": []
    }
  },
  {
    "user_command": "departman bazında maaş ortalaması",
    "logic": "average salary by department group",
    "category": "analysis",
    "output": {
      "action": "group_by",
      "column": "departman",
      "aggregate": "average",
      "reply": "📊 Departman bazında maaş ortalaması hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "en yüksek performanslı çalışanları göster",
    "logic": "show highest performance employees top rated",
    "category": "analysis",
    "output": {
      "action": "top_n",
      "column": "performans",
      "n": 5,
      "direction": "desc",
      "reply": "✓ En yüksek performanslı çalışanlar gösterildi",
      "changes": []
    }
  },
  {
    "user_command": "bu ay doğum günü olan çalışanları bul",
    "logic": "find employees with birthday this month",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "currentMonth",
      "column": "doğum_tarihi",
      "reply": "✓ Bu ay doğum günü olan çalışanlar bulundu",
      "changes": []
    }
  },
  {
    "user_command": "kıdeme göre sırala",
    "logic": "sort employees by seniority years of service",
    "category": "sorting",
    "output": {
      "action": "sort",
      "column": "kıdem",
      "direction": "desc",
      "reply": "✓ Kıdeme göre sıralandı",
      "changes": []
    }
  },
  {
    "user_command": "net maaş hesapla",
    "logic": "calculate net salary after deductions",
    "category": "payroll",
    "output": {
      "action": "update_cells",
      "formula": "net_salary",
      "reply": "✓ Net maaşlar hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "dolar karşılığını hesapla",
    "logic": "calculate USD dollar equivalent currency conversion",
    "category": "calculation",
    "output": {
      "action": "update_cells",
      "formula": "currency_usd",
      "reply": "✓ Dolar karşılıkları hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "euro'ya çevir",
    "logic": "convert values to EUR euro currency",
    "category": "calculation",
    "output": {
      "action": "update_cells",
      "formula": "currency_eur",
      "reply": "✓ Euro karşılıkları hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "ROI hesapla",
    "logic": "calculate return on investment ROI percentage",
    "category": "accounting",
    "output": {
      "action": "update_cells",
      "formula": "roi",
      "reply": "✓ ROI hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "yatırım getirisi ne kadar",
    "logic": "calculate investment return rate profit",
    "category": "accounting",
    "output": {
      "action": "update_cells",
      "formula": "investment_return",
      "reply": "✓ Yatırım getirisi hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "başabaş noktasını hesapla",
    "logic": "calculate break-even point analysis",
    "category": "accounting",
    "output": {
      "action": "message",
      "formula": "break_even",
      "reply": "📊 Başabaş noktası hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "bütçe sapmasını göster",
    "logic": "show budget variance actual vs planned",
    "category": "accounting",
    "output": {
      "action": "update_cells",
      "formula": "budget_variance",
      "reply": "✓ Bütçe sapması hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "maliyete göre satış fiyatı belirle",
    "logic": "set sales price based on cost markup",
    "category": "calculation",
    "output": {
      "action": "update_cells",
      "formula": "cost_plus_markup",
      "reply": "✓ Satış fiyatları hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "net kar hesapla",
    "logic": "calculate net profit after all expenses",
    "category": "accounting",
    "output": {
      "action": "update_cells",
      "formula": "net_profit",
      "reply": "✓ Net kar hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "işletme gideri toplamı",
    "logic": "total operating expenses sum",
    "category": "calculation",
    "output": {
      "action": "sum",
      "column": "işletme_gideri",
      "reply": "✓ İşletme giderleri toplandı",
      "changes": []
    }
  },
  {
    "user_command": "karlılık oranı hesapla",
    "logic": "calculate profitability ratio percentage",
    "category": "accounting",
    "output": {
      "action": "update_cells",
      "formula": "profitability_ratio",
      "reply": "✓ Karlılık oranı hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "stok altına düşenleri göster",
    "logic": "show items below minimum stock level",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "below_min_stock",
      "reply": "✓ Minimum stok altındaki ürünler gösterildi",
      "changes": []
    }
  },
  {
    "user_command": "stok seviyesi kritik olanları vurgula",
    "logic": "highlight critical low stock items",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "critical_stock",
      "color": "#fecaca",
      "reply": "✓ Kritik stok seviyeleri vurgulandı",
      "changes": []
    }
  },
  {
    "user_command": "ortalama teslimat süresi ne kadar",
    "logic": "calculate average delivery time days",
    "category": "calculation",
    "output": {
      "action": "average",
      "column": "teslimat_süresi",
      "reply": "✓ Ortalama teslimat süresi hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "depoda biten ürünleri listele",
    "logic": "list out of stock products zero inventory",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "value == 0",
      "column": "stok",
      "reply": "✓ Depoda biten ürünler listelendi",
      "changes": []
    }
  },
  {
    "user_command": "en çok tüketilen 10 ürünü göster",
    "logic": "show top 10 most consumed products by usage",
    "category": "analysis",
    "output": {
      "action": "top_n",
      "column": "tüketim",
      "n": 10,
      "direction": "desc",
      "reply": "✓ En çok tüketilen 10 ürün gösterildi",
      "changes": []
    }
  },
  {
    "user_command": "stok devir hızını hesapla",
    "logic": "calculate inventory turnover rate ratio",
    "category": "accounting",
    "output": {
      "action": "update_cells",
      "formula": "inventory_turnover",
      "reply": "✓ Stok devir hızı hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "tedarikçiye göre grupla",
    "logic": "group items by supplier vendor",
    "category": "analysis",
    "output": {
      "action": "group_by",
      "column": "tedarikçi",
      "aggregate": "sum",
      "reply": "📊 Tedarikçiye göre gruplandırıldı",
      "changes": []
    }
  },
  {
    "user_command": "son 30 günde gelen malları listele",
    "logic": "list goods received in last 30 days",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "last30days",
      "column": "giriş_tarihi",
      "reply": "✓ Son 30 günde gelen mallar listelendi",
      "changes": []
    }
  },
  {
    "user_command": "gecikmiş teslimatları işaretle",
    "logic": "mark overdue delayed shipments deliveries",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "overdue",
      "color": "#fecaca",
      "reply": "✓ Gecikmiş teslimatlar işaretlendi",
      "changes": []
    }
  },
  {
    "user_command": "toplam stok değerini hesapla",
    "logic": "calculate total inventory value stock worth",
    "category": "calculation",
    "output": {
      "action": "update_cells",
      "formula": "inventory_value",
      "reply": "✓ Toplam stok değeri hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "tamamlanan görevleri göster",
    "logic": "show completed done tasks",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "contains",
      "value": "tamamlandı",
      "column": "durum",
      "reply": "✓ Tamamlanan görevler gösterildi",
      "changes": []
    }
  },
  {
    "user_command": "gecikmiş görevleri filtrele",
    "logic": "filter overdue delayed tasks past deadline",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "overdue",
      "column": "son_tarih",
      "reply": "✓ Gecikmiş görevler filtrelendi",
      "changes": []
    }
  },
  {
    "user_command": "tamamlanma yüzdesini hesapla",
    "logic": "calculate completion percentage progress rate",
    "category": "calculation",
    "output": {
      "action": "message",
      "formula": "completion_rate",
      "reply": "📊 Tamamlanma yüzdesi hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "yüksek öncelikli görevleri listele",
    "logic": "list high priority tasks urgent items",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "contains",
      "value": "yüksek",
      "column": "öncelik",
      "reply": "✓ Yüksek öncelikli görevler listelendi",
      "changes": []
    }
  },
  {
    "user_command": "bu hafta bitmesi gereken görevleri göster",
    "logic": "show tasks due this week deadline",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "thisWeek",
      "column": "son_tarih",
      "reply": "✓ Bu hafta bitirilmesi gereken görevler gösterildi",
      "changes": []
    }
  },
  {
    "user_command": "kişiye atanan görev sayısı",
    "logic": "count tasks assigned per person employee",
    "category": "analysis",
    "output": {
      "action": "group_by",
      "column": "atanan",
      "aggregate": "count",
      "reply": "📊 Kişi başına görev sayıları hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "açık görevleri say",
    "logic": "count open unfinished pending tasks",
    "category": "calculation",
    "output": {
      "action": "count_if",
      "condition": "contains",
      "value": "açık",
      "reply": "✓ Açık görev sayısı hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "teslim tarihi geçenleri kırmızıya boya",
    "logic": "highlight overdue past deadline tasks red",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "overdue",
      "color": "#fecaca",
      "reply": "✓ Teslim tarihi geçenler kırmızıya boyandı",
      "changes": []
    }
  },
  {
    "user_command": "tahmini iş günü toplamı",
    "logic": "sum total estimated working days effort",
    "category": "calculation",
    "output": {
      "action": "sum",
      "column": "iş_günü",
      "reply": "✓ Toplam tahmini iş günü hesaplandı",
      "changes": []
    }
  },
  {
    "user_command": "projeye göre grupla maliyeti göster",
    "logic": "group by project show cost analysis",
    "category": "analysis",
    "output": {
      "action": "group_by",
      "column": "proje",
      "aggregate": "sum",
      "reply": "📊 Projeye göre maliyetler gösterildi",
      "changes": []
    }
  },
  {
    "user_command": "boş hücrelere 0 yaz",
    "logic": "fill empty blank cells with zero value",
    "category": "cleaning",
    "output": {
      "action": "update_cells",
      "condition": "empty",
      "value": "0",
      "reply": "✓ Boş hücreler 0 ile dolduruldu",
      "changes": []
    }
  },
  {
    "user_command": "boşlukları bilinmiyor ile doldur",
    "logic": "fill empty cells with unknown text placeholder",
    "category": "cleaning",
    "output": {
      "action": "update_cells",
      "condition": "empty",
      "value": "bilinmiyor",
      "reply": "✓ Boş hücreler 'bilinmiyor' ile dolduruldu",
      "changes": []
    }
  },
  {
    "user_command": "fiyatlara 10 TL ekle",
    "logic": "add 10 TL to all price values increment",
    "category": "calculation",
    "output": {
      "action": "update_cells",
      "formula": "add",
      "column": "fiyat",
      "value": 10,
      "reply": "✓ Fiyatlara 10 TL eklendi",
      "changes": []
    }
  },
  {
    "user_command": "tüm değerleri 2 ile çarp",
    "logic": "multiply all values by factor 2",
    "category": "calculation",
    "output": {
      "action": "update_cells",
      "formula": "multiply",
      "factor": 2,
      "reply": "✓ Değerler 2 ile çarpıldı",
      "changes": []
    }
  },
  {
    "user_command": "negatif değerleri 0 yap",
    "logic": "set all negative values to zero replace",
    "category": "cleaning",
    "output": {
      "action": "update_cells",
      "condition": "value < 0",
      "value": "0",
      "reply": "✓ Negatif değerler 0 yapıldı",
      "changes": []
    }
  },
  {
    "user_command": "durum sütununa aktif yaz",
    "logic": "write active status text to status column cells",
    "category": "cleaning",
    "output": {
      "action": "update_cells",
      "column": "durum",
      "value": "aktif",
      "reply": "✓ Durum sütununa 'aktif' yazıldı",
      "changes": []
    }
  },
  {
    "user_command": "fiyatları yuvarla",
    "logic": "round price values to nearest integer",
    "category": "calculation",
    "output": {
      "action": "update_cells",
      "formula": "round",
      "column": "fiyat",
      "reply": "✓ Fiyatlar yuvarlandı",
      "changes": []
    }
  },
  {
    "user_command": "stokları 1 azalt",
    "logic": "decrement reduce stock quantities by 1",
    "category": "calculation",
    "output": {
      "action": "update_cells",
      "formula": "subtract",
      "column": "stok",
      "value": 1,
      "reply": "✓ Stok miktarları 1 azaltıldı",
      "changes": []
    }
  },
  {
    "user_command": "tüm adresleri büyük harfe çevir",
    "logic": "convert all address cells to uppercase",
    "category": "cleaning",
    "output": {
      "action": "transform",
      "transform": "uppercase",
      "column": "adres",
      "reply": "✓ Adresler büyük harfe çevrildi",
      "changes": []
    }
  },
  {
    "user_command": "kategori boş olanları diğer yap",
    "logic": "set empty category cells to other default",
    "category": "cleaning",
    "output": {
      "action": "update_cells",
      "condition": "empty",
      "column": "kategori",
      "value": "diğer",
      "reply": "✓ Boş kategoriler 'diğer' yapıldı",
      "changes": []
    }
  },
  {
    "user_command": "ocak ayındaki kayıtları filtrele",
    "logic": "filter records from January month",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "month == 1",
      "column": "tarih",
      "reply": "✓ Ocak ayı kayıtları filtrelendi",
      "changes": []
    }
  },
  {
    "user_command": "2024 yılındaki kayıtları göster",
    "logic": "show records from year 2024",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "year == 2024",
      "column": "tarih",
      "reply": "✓ 2024 yılı kayıtları gösterildi",
      "changes": []
    }
  },
  {
    "user_command": "son 7 günün verilerini getir",
    "logic": "get data from last 7 days recent",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "last7days",
      "column": "tarih",
      "reply": "✓ Son 7 günün verileri getirildi",
      "changes": []
    }
  },
  {
    "user_command": "istanbul veya ankara olanları filtrele",
    "logic": "filter rows containing Istanbul or Ankara city",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "contains_any",
      "values": [
        "istanbul",
        "ankara"
      ],
      "reply": "✓ İstanbul ve Ankara kayıtları filtrelendi",
      "changes": []
    }
  },
  {
    "user_command": "100 ile 500 arasındaki değerleri göster",
    "logic": "filter values between 100 and 500 range",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "between",
      "min": 100,
      "max": 500,
      "reply": "✓ 100-500 arasındaki değerler gösterildi",
      "changes": []
    }
  },
  {
    "user_command": "boş olmayan kayıtları göster",
    "logic": "filter show only non-empty filled records",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "not_empty",
      "reply": "✓ Dolu kayıtlar gösterildi",
      "changes": []
    }
  },
  {
    "user_command": "bu çeyreğin verilerini filtrele",
    "logic": "filter data from current quarter Q",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "currentQuarter",
      "column": "tarih",
      "reply": "✓ Bu çeyreğin verileri filtrelendi",
      "changes": []
    }
  },
  {
    "user_command": "pro planlı müşterileri filtrele",
    "logic": "filter customers on pro subscription plan",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "contains",
      "value": "pro",
      "column": "plan",
      "reply": "✓ Pro planlı müşteriler filtrelendi",
      "changes": []
    }
  },
  {
    "user_command": "1000 tl üzerindeki faturaları göster",
    "logic": "show invoices exceeding 1000 TL amount",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "value > 1000",
      "column": "fatura_tutarı",
      "reply": "✓ 1000 TL üzeri faturalar gösterildi",
      "changes": []
    }
  },
  {
    "user_command": "onaylanmış kayıtları filtrele",
    "logic": "filter approved confirmed status records",
    "category": "filtering",
    "output": {
      "action": "filter",
      "condition": "contains",
      "value": "onaylandı",
      "column": "durum",
      "reply": "✓ Onaylanan kayıtlar filtrelendi",
      "changes": []
    }
  },
  {
    "user_command": "yeni sütun ekle",
    "logic": "add insert new empty column to spreadsheet",
    "category": "structure",
    "output": {
      "action": "add_column",
      "reply": "✓ Yeni sütun eklendi",
      "changes": []
    }
  },
  {
    "user_command": "toplam sütunu ekle",
    "logic": "add total sum column new column",
    "category": "structure",
    "output": {
      "action": "add_column",
      "column_name": "toplam",
      "formula": "sum",
      "reply": "✓ Toplam sütunu eklendi",
      "changes": []
    }
  },
  {
    "user_command": "kdv sütunu ekle",
    "logic": "add VAT KDV calculated column",
    "category": "structure",
    "output": {
      "action": "add_column",
      "column_name": "kdv",
      "formula": "vat",
      "reply": "✓ KDV sütunu eklendi",
      "changes": []
    }
  },
  {
    "user_command": "sıra numarası sütunu ekle",
    "logic": "add sequential row number ID column",
    "category": "structure",
    "output": {
      "action": "add_column",
      "column_name": "sıra_no",
      "formula": "row_number",
      "reply": "✓ Sıra numarası sütunu eklendi",
      "changes": []
    }
  },
  {
    "user_command": "b sütununu yeniden adlandır",
    "logic": "rename column B to new name",
    "category": "structure",
    "output": {
      "action": "rename_column",
      "column": "B",
      "reply": "✓ Sütun adı güncellendi",
      "changes": []
    }
  },
  {
    "user_command": "sütun başlıklarını büyük harfe çevir",
    "logic": "convert column headers to uppercase",
    "category": "structure",
    "output": {
      "action": "transform",
      "transform": "uppercase",
      "target": "headers",
      "reply": "✓ Sütun başlıkları büyük harfe çevrildi",
      "changes": []
    }
  },
  {
    "user_command": "kar marjı sütunu hesapla ekle",
    "logic": "calculate and add profit margin column",
    "category": "structure",
    "output": {
      "action": "add_column",
      "column_name": "kar_marjı",
      "formula": "profit_margin",
      "reply": "✓ Kar marjı sütunu eklendi",
      "changes": []
    }
  },
  {
    "user_command": "yüzde değişim sütunu ekle",
    "logic": "add percentage change growth column",
    "category": "structure",
    "output": {
      "action": "add_column",
      "column_name": "değişim_yüzdesi",
      "formula": "pct_change",
      "reply": "✓ Yüzde değişim sütunu eklendi",
      "changes": []
    }
  },
  {
    "user_command": "tarih sütununu böl gün ay yıl yap",
    "logic": "split date column into day month year columns",
    "category": "structure",
    "output": {
      "action": "split_column",
      "column": "tarih",
      "parts": [
        "gün",
        "ay",
        "yıl"
      ],
      "reply": "✓ Tarih sütunu bölündü",
      "changes": []
    }
  },
  {
    "user_command": "ad soyad sütunlarını birleştir",
    "logic": "merge combine first last name columns",
    "category": "structure",
    "output": {
      "action": "merge_columns",
      "columns": [
        "ad",
        "soyad"
      ],
      "separator": " ",
      "reply": "✓ Ad ve soyad sütunları birleştirildi",
      "changes": []
    }
  },
  {
    "user_command": "baş ve son boşlukları temizle",
    "logic": "trim remove leading trailing whitespace spaces",
    "category": "cleaning",
    "output": {
      "action": "transform",
      "transform": "trim",
      "reply": "✓ Baş ve son boşluklar temizlendi",
      "changes": []
    }
  },
  {
    "user_command": "özel karakterleri kaldır",
    "logic": "remove special characters symbols from text",
    "category": "cleaning",
    "output": {
      "action": "transform",
      "transform": "remove_special_chars",
      "reply": "✓ Özel karakterler kaldırıldı",
      "changes": []
    }
  },
  {
    "user_command": "telefon numaralarındaki tireleri sil",
    "logic": "remove dashes hyphens from phone numbers",
    "category": "cleaning",
    "output": {
      "action": "transform",
      "transform": "remove_dashes",
      "column": "telefon",
      "reply": "✓ Telefon numaralarındaki tireler silindi",
      "changes": []
    }
  },
  {
    "user_command": "virgülleri nokta ile değiştir",
    "logic": "replace commas with dots decimal separator",
    "category": "cleaning",
    "output": {
      "action": "transform",
      "transform": "replace",
      "find": ",",
      "replace_with": ".",
      "reply": "✓ Virgüller nokta ile değiştirildi",
      "changes": []
    }
  },
  {
    "user_command": "her kelimenin baş harfini büyüt",
    "logic": "capitalize first letter each word title case",
    "category": "cleaning",
    "output": {
      "action": "transform",
      "transform": "title_case",
      "reply": "✓ Her kelimenin baş harfi büyütüldü",
      "changes": []
    }
  },
  {
    "user_command": "e-posta adreslerini küçük harfe çevir",
    "logic": "convert email addresses to lowercase",
    "category": "cleaning",
    "output": {
      "action": "transform",
      "transform": "lowercase",
      "column": "email",
      "reply": "✓ E-posta adresleri küçük harfe çevrildi",
      "changes": []
    }
  },
  {
    "user_command": "ürün kodlarındaki boşlukları sil",
    "logic": "remove spaces from product codes",
    "category": "cleaning",
    "output": {
      "action": "transform",
      "transform": "remove_spaces",
      "column": "ürün_kodu",
      "reply": "✓ Ürün kodlarındaki boşluklar silindi",
      "changes": []
    }
  },
  {
    "user_command": "açıklama metnini 100 karaktere kısalt",
    "logic": "truncate description text to 100 characters limit",
    "category": "cleaning",
    "output": {
      "action": "transform",
      "transform": "truncate",
      "length": 100,
      "column": "açıklama",
      "reply": "✓ Açıklama metinleri 100 karaktere kısaltıldı",
      "changes": []
    }
  },
  {
    "user_command": "sütundaki fazla boşlukları temizle",
    "logic": "clean extra multiple whitespace spaces in column",
    "category": "cleaning",
    "output": {
      "action": "transform",
      "transform": "trim",
      "reply": "✓ Fazla boşluklar temizlendi",
      "changes": []
    }
  },
  {
    "user_command": "tr değerlerini türkiye olarak değiştir",
    "logic": "replace abbreviation TR with full text Türkiye",
    "category": "cleaning",
    "output": {
      "action": "transform",
      "transform": "replace",
      "find": "TR",
      "replace_with": "Türkiye",
      "reply": "✓ TR değerleri 'Türkiye' olarak güncellendi",
      "changes": []
    }
  },
  {
    "user_command": "bu satırı vurgula",
    "logic": "highlight current selected row color",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "target": "row",
      "color": "#fef08a",
      "reply": "✓ Satır vurgulandı",
      "changes": []
    }
  },
  {
    "user_command": "tüm sütunu renklendir",
    "logic": "color highlight entire selected column",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "target": "column",
      "color": "#bfdbfe",
      "reply": "✓ Sütun renklendirildi",
      "changes": []
    }
  },
  {
    "user_command": "500 ile 1000 arasındakileri sarıya boya",
    "logic": "highlight values between 500 and 1000 yellow",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "between",
      "min": 500,
      "max": 1000,
      "color": "#fef08a",
      "reply": "✓ 500-1000 arası değerler sarıya boyandı",
      "changes": []
    }
  },
  {
    "user_command": "hedefin altındakileri turuncu yap",
    "logic": "color below target values orange",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "below_target",
      "color": "#fed7aa",
      "reply": "✓ Hedef altındakiler turuncu yapıldı",
      "changes": []
    }
  },
  {
    "user_command": "tekrar eden değerleri vurgula",
    "logic": "highlight duplicate repeated cell values",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "duplicate",
      "color": "#e9d5ff",
      "reply": "✓ Tekrar eden değerler vurgulandı",
      "changes": []
    }
  },
  {
    "user_command": "en düşük 3 değeri kırmızıya boya",
    "logic": "highlight bottom 3 lowest values red",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "bottom3",
      "color": "#fecaca",
      "reply": "✓ En düşük 3 değer kırmızıya boyandı",
      "changes": []
    }
  },
  {
    "user_command": "ortalamanın üzerindeki değerleri yeşile boya",
    "logic": "highlight values above average green",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "above_average",
      "color": "#bbf7d0",
      "reply": "✓ Ortalamanın üzerindekiler yeşile boyandı",
      "changes": []
    }
  },
  {
    "user_command": "ortalamanın altındakiler kırmızı",
    "logic": "highlight values below average red warning",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "below_average",
      "color": "#fecaca",
      "reply": "✓ Ortalamanın altındakiler kırmızıya boyandı",
      "changes": []
    }
  },
  {
    "user_command": "bugünün tarihini taşıyan hücreleri vurgula",
    "logic": "highlight cells containing today's date",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "condition": "today",
      "color": "#fef08a",
      "reply": "✓ Bugünün tarihleri vurgulandı",
      "changes": []
    }
  },
  {
    "user_command": "son satırı maviye boya",
    "logic": "color last row blue highlight",
    "category": "highlighting",
    "output": {
      "action": "highlight",
      "target": "last_row",
      "color": "#bfdbfe",
      "reply": "✓ Son satır maviye boyandı",
      "changes": []
    }
  },
  {
    "user_command": "KDV tutarlarını hesapla",
    "logic": "calculate VAT amounts at 18% rate on price column",
    "category": "muhasebe",
    "output": {
      "action": "update_cells",
      "formula": "=B2*0.18",
      "reply": "✅ KDV tutarları %18 oranında hesaplanarak ilgili sütuna yazıldı.",
      "changes": []
    }
  },
  {
    "user_command": "net maaşları göster",
    "logic": "calculate net salary after deductions",
    "category": "bordro",
    "output": {
      "action": "update_cells",
      "formula": "=B2-C2-D2",
      "reply": "✅ Net maaşlar hesaplanarak gösterildi.",
      "changes": []
    }
  },
  {
    "user_command": "stok kritik seviyedekileri filtrele",
    "logic": "filter rows where stock quantity is below critical level",
    "category": "stok",
    "output": {
      "action": "filter",
      "condition": "less_than",
      "column": "Stok",
      "value": "10",
      "reply": "✅ Kritik stok seviyesindeki ürünler filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "SGK primlerini topla",
    "logic": "sum all SGK premium amounts in the column",
    "category": "bordro",
    "output": {
      "action": "sum",
      "column": "SGK Primi",
      "reply": "✅ SGK primlerinin toplamı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "e-fatura kesilenleri listele",
    "logic": "filter rows where invoice type is e-invoice",
    "category": "muhasebe",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "Fatura Tipi",
      "value": "e-Fatura",
      "reply": "✅ E-fatura kesilen kayıtlar listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "depo giriş miktarlarını topla",
    "logic": "sum all warehouse entry quantities",
    "category": "depo",
    "output": {
      "action": "sum",
      "column": "Giriş Miktarı",
      "reply": "✅ Depo giriş miktarlarının toplamı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "tedarikçi adlarını büyük harfe çevir",
    "logic": "convert supplier names to uppercase",
    "category": "tedarik",
    "output": {
      "action": "transform",
      "transform": "uppercase",
      "reply": "✅ Tedarikçi adları büyük harfe dönüştürüldü.",
      "changes": []
    }
  },
  {
    "user_command": "ödenmiş faturaları filtrele",
    "logic": "filter rows where payment status is paid",
    "category": "muhasebe",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "Ödeme Durumu",
      "value": "Ödendi",
      "reply": "✅ Ödenmiş faturalar filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "brüt maaş ortalaması ne kadar",
    "logic": "calculate average gross salary",
    "category": "bordro",
    "output": {
      "action": "average",
      "column": "Brüt Maaş",
      "reply": "✅ Brüt maaş ortalaması hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "en yüksek KDV tutarı kaç",
    "logic": "find maximum VAT amount in the column",
    "category": "muhasebe",
    "output": {
      "action": "max",
      "column": "KDV Tutarı",
      "reply": "✅ En yüksek KDV tutarı bulundu.",
      "changes": []
    }
  },
  {
    "user_command": "vadesi geçmiş faturaları göster",
    "logic": "filter invoices where due date is past today",
    "category": "muhasebe",
    "output": {
      "action": "filter",
      "condition": "less_than",
      "column": "Vade Tarihi",
      "value": "TODAY()",
      "reply": "✅ Vadesi geçmiş faturalar gösterildi.",
      "changes": []
    }
  },
  {
    "user_command": "ürün kodlarını küçük harfe çevir",
    "logic": "convert product codes to lowercase",
    "category": "stok",
    "output": {
      "action": "transform",
      "transform": "lowercase",
      "reply": "✅ Ürün kodları küçük harfe dönüştürüldü.",
      "changes": []
    }
  },
  {
    "user_command": "toplam KDV ne kadar",
    "logic": "sum all VAT amounts in the dataset",
    "category": "muhasebe",
    "output": {
      "action": "sum",
      "column": "KDV",
      "reply": "✅ Toplam KDV tutarı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "siparişleri teslim durumuna göre filtrele",
    "logic": "filter orders by delivery status",
    "category": "satış",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "Teslim Durumu",
      "value": "Teslim Edildi",
      "reply": "✅ Teslim edilen siparişler filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "çalışan sayısını göster",
    "logic": "count number of employees in the dataset",
    "category": "bordro",
    "output": {
      "action": "count",
      "column": "Çalışan Adı",
      "reply": "✅ Toplam çalışan sayısı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "depo çıkış miktarlarını topla",
    "logic": "sum all warehouse exit quantities",
    "category": "depo",
    "output": {
      "action": "sum",
      "column": "Çıkış Miktarı",
      "reply": "✅ Depo çıkış miktarlarının toplamı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "KDV hariç fiyatları göster",
    "logic": "calculate prices excluding VAT",
    "category": "muhasebe",
    "output": {
      "action": "update_cells",
      "formula": "=B2/1.18",
      "reply": "✅ KDV hariç fiyatlar hesaplanarak gösterildi.",
      "changes": []
    }
  },
  {
    "user_command": "en düşük SGK primi kaç",
    "logic": "find minimum SGK premium amount",
    "category": "bordro",
    "output": {
      "action": "min",
      "column": "SGK Primi",
      "reply": "✅ En düşük SGK primi bulundu.",
      "changes": []
    }
  },
  {
    "user_command": "stok miktarı sıfır olanları filtrele",
    "logic": "filter rows where stock quantity equals zero",
    "category": "stok",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "Stok Miktarı",
      "value": "0",
      "reply": "✅ Stok miktarı sıfır olan ürünler filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "tedarikçiye göre grupla",
    "logic": "sort and group data by supplier name",
    "category": "tedarik",
    "output": {
      "action": "sort",
      "direction": "asc",
      "column": "Tedarikçi",
      "reply": "✅ Veriler tedarikçi adına göre sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "aylık ciro toplamı ne kadar",
    "logic": "sum monthly revenue totals",
    "category": "satış",
    "output": {
      "action": "sum",
      "column": "Aylık Ciro",
      "reply": "✅ Aylık ciro toplamı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "eksik stok olanları kırmızıya boya",
    "logic": "highlight rows where stock is below minimum level in red",
    "category": "stok",
    "output": {
      "action": "highlight",
      "condition": "less_than",
      "color": "#FF0000",
      "reply": "✅ Eksik stok seviyesindeki ürünler kırmızıya boyandı.",
      "changes": []
    }
  },
  {
    "user_command": "ödenmemiş faturaları sarıya boya",
    "logic": "highlight unpaid invoices in yellow",
    "category": "muhasebe",
    "output": {
      "action": "highlight",
      "condition": "equals",
      "color": "#FFFF00",
      "reply": "✅ Ödenmemiş faturalar sarıya boyandı.",
      "changes": []
    }
  },
  {
    "user_command": "en çok sipariş veren tedarikçi hangisi",
    "logic": "find supplier with maximum order count",
    "category": "tedarik",
    "output": {
      "action": "max",
      "column": "Sipariş Sayısı",
      "reply": "✅ En çok sipariş veren tedarikçi bulundu.",
      "changes": []
    }
  },
  {
    "user_command": "gelir vergisi tutarlarını hesapla",
    "logic": "calculate income tax amounts based on salary",
    "category": "bordro",
    "output": {
      "action": "update_cells",
      "formula": "=B2*0.15",
      "reply": "✅ Gelir vergisi tutarları hesaplanarak yazıldı.",
      "changes": []
    }
  },
  {
    "user_command": "bekleme süresi 30 günden fazla olanları filtrele",
    "logic": "filter rows where waiting period exceeds 30 days",
    "category": "depo",
    "output": {
      "action": "filter",
      "condition": "greater_than",
      "column": "Bekleme Süresi",
      "value": "30",
      "reply": "✅ 30 günden fazla bekleme süresi olan kayıtlar filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "yeni satır ekle",
    "logic": "add a new empty row to the dataset",
    "category": "genel",
    "output": {
      "action": "add_row",
      "reply": "➕ Yeni boş satır eklendi.",
      "changes": []
    }
  },
  {
    "user_command": "filtreleri kaldır",
    "logic": "remove all active filters from the dataset",
    "category": "genel",
    "output": {
      "action": "remove_filter",
      "reply": "✅ Tüm filtreler kaldırıldı.",
      "changes": []
    }
  },
  {
    "user_command": "aktif tedarikçileri listele",
    "logic": "filter rows where supplier status is active",
    "category": "tedarik",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "Durum",
      "value": "Aktif",
      "reply": "✅ Aktif tedarikçiler listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "iskonto oranına göre sırala",
    "logic": "sort data by discount rate in ascending order",
    "category": "satış",
    "output": {
      "action": "sort",
      "direction": "asc",
      "column": "İskonto Oranı",
      "reply": "✅ Veriler iskonto oranına göre küçükten büyüğe sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "KDV dahil toplamı hesapla",
    "logic": "calculate total price including VAT",
    "category": "muhasebe",
    "output": {
      "action": "update_cells",
      "formula": "=B2*1.18",
      "reply": "✅ KDV dahil toplam tutarlar hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "kargo bekleyenleri turuncu yap",
    "logic": "highlight rows awaiting shipment in orange",
    "category": "depo",
    "output": {
      "action": "highlight",
      "condition": "equals",
      "color": "#FFA500",
      "reply": "✅ Kargo bekleyen satırlar turuncu rengiyle işaretlendi.",
      "changes": []
    }
  },
  {
    "user_command": "toplam indirim tutarı ne kadar",
    "logic": "sum all discount amounts in the dataset",
    "category": "satış",
    "output": {
      "action": "sum",
      "column": "İndirim Tutarı",
      "reply": "✅ Toplam indirim tutarı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "çalışanları departmana göre sırala",
    "logic": "sort employees by department name alphabetically",
    "category": "bordro",
    "output": {
      "action": "sort",
      "direction": "asc",
      "column": "Departman",
      "reply": "✅ Çalışanlar departman adına göre sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "bu çeyrek satış toplamı",
    "logic": "sum sales amounts for the current quarter",
    "category": "satış",
    "output": {
      "action": "sum",
      "column": "Çeyrek Satış",
      "reply": "✅ Bu çeyreğe ait satış toplamı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "en düşük fiyatlı ürünü bul",
    "logic": "find product with minimum price",
    "category": "stok",
    "output": {
      "action": "min",
      "column": "Fiyat",
      "reply": "✅ En düşük fiyatlı ürün bulundu.",
      "changes": []
    }
  },
  {
    "user_command": "iptal edilen teslimatları filtrele",
    "logic": "filter rows where delivery status is cancelled",
    "category": "depo",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "Teslimat Durumu",
      "value": "İptal",
      "reply": "✅ İptal edilen teslimatlar filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "müşteri sayısını bul",
    "logic": "count distinct customers in the dataset",
    "category": "satış",
    "output": {
      "action": "count",
      "column": "Müşteri Adı",
      "reply": "✅ Toplam müşteri sayısı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "vergi numarasına göre sırala",
    "logic": "sort data by tax number in ascending order",
    "category": "muhasebe",
    "output": {
      "action": "sort",
      "direction": "asc",
      "column": "Vergi No",
      "reply": "✅ Veriler vergi numarasına göre sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "mağaza bazında satış ortalaması",
    "logic": "calculate average sales per store",
    "category": "satış",
    "output": {
      "action": "average",
      "column": "Mağaza Satışı",
      "reply": "✅ Mağaza bazında satış ortalaması hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "ödenecek SGK primlerini göster",
    "logic": "filter rows where SGK payment status is pending",
    "category": "bordro",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "SGK Durumu",
      "value": "Bekliyor",
      "reply": "✅ Ödenecek SGK primleri gösterildi.",
      "changes": []
    }
  },
  {
    "user_command": "raftan silinen ürünleri kaldır",
    "logic": "delete rows where product status is removed from shelf",
    "category": "stok",
    "output": {
      "action": "delete_rows",
      "condition": "Durum equals Raftan Kalktı",
      "reply": "🗑️ Raftan kaldırılan ürün satırları silindi.",
      "changes": []
    }
  },
  {
    "user_command": "birim fiyatı en yüksek 3 ürünü vurgula",
    "logic": "highlight top 3 products with highest unit price",
    "category": "stok",
    "output": {
      "action": "highlight",
      "condition": "top3",
      "color": "#FFD700",
      "reply": "✅ Birim fiyatı en yüksek 3 ürün vurgulandı.",
      "changes": []
    }
  },
  {
    "user_command": "kâr tutarını hesapla",
    "logic": "calculate profit amount as revenue minus cost",
    "category": "muhasebe",
    "output": {
      "action": "update_cells",
      "formula": "=B2-C2",
      "reply": "✅ Kâr tutarları hesaplanarak ilgili sütuna yazıldı.",
      "changes": []
    }
  },
  {
    "user_command": "teslim tarihi geçenleri listele",
    "logic": "filter rows where delivery date has passed",
    "category": "satış",
    "output": {
      "action": "filter",
      "condition": "less_than",
      "column": "Teslim Tarihi",
      "value": "TODAY()",
      "reply": "✅ Teslim tarihi geçmiş siparişler listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "toplam gider nedir",
    "logic": "sum all expense amounts in the column",
    "category": "muhasebe",
    "output": {
      "action": "sum",
      "column": "Gider",
      "reply": "✅ Toplam gider tutarı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "indirimli ürünleri yeşile boya",
    "logic": "highlight discounted products in green",
    "category": "satış",
    "output": {
      "action": "highlight",
      "condition": "greater_than",
      "color": "#00FF00",
      "reply": "✅ İndirimli ürünler yeşil rengiyle işaretlendi.",
      "changes": []
    }
  },
  {
    "user_command": "fatura numarasına göre büyükten küçüğe sırala",
    "logic": "sort invoice numbers in descending order",
    "category": "muhasebe",
    "output": {
      "action": "sort",
      "direction": "desc",
      "column": "Fatura No",
      "reply": "✅ Fatura numaraları büyükten küçüğe sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "toplam üretim miktarı nedir",
    "logic": "sum total production quantities",
    "category": "depo",
    "output": {
      "action": "sum",
      "column": "Üretim Miktarı",
      "reply": "✅ Toplam üretim miktarı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "iade edilen ürünleri filtrele",
    "logic": "filter rows where return status is true",
    "category": "stok",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "İade Durumu",
      "value": "İade Edildi",
      "reply": "✅ İade edilen ürünler filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "çalışan adlarını büyük harfe çevir",
    "logic": "convert employee names to uppercase format",
    "category": "bordro",
    "output": {
      "action": "transform",
      "transform": "uppercase",
      "reply": "✅ Çalışan adları büyük harfe dönüştürüldü.",
      "changes": []
    }
  },
  {
    "user_command": "en yüksek kâr marjını bul",
    "logic": "find maximum profit margin in the dataset",
    "category": "muhasebe",
    "output": {
      "action": "max",
      "column": "Kâr Marjı",
      "reply": "✅ En yüksek kâr marjı bulundu.",
      "changes": []
    }
  },
  {
    "user_command": "satın alma tarihi en yakın olanları sırala",
    "logic": "sort purchase dates from newest to oldest",
    "category": "tedarik",
    "output": {
      "action": "sort",
      "direction": "desc",
      "column": "Satın Alma Tarihi",
      "reply": "✅ Satın alma tarihleri en yeniden en eskiye sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "ortalama teslimat süresi ne kadar",
    "logic": "calculate average delivery time in days",
    "category": "depo",
    "output": {
      "action": "average",
      "column": "Teslimat Süresi",
      "reply": "✅ Ortalama teslimat süresi hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "bölgeye göre sırala",
    "logic": "sort data by region name alphabetically",
    "category": "satış",
    "output": {
      "action": "sort",
      "direction": "asc",
      "column": "Bölge",
      "reply": "✅ Veriler bölge adına göre sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "KDV oranı %20 olanları filtrele",
    "logic": "filter rows where VAT rate equals 20 percent",
    "category": "muhasebe",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "KDV Oranı",
      "value": "20",
      "reply": "✅ KDV oranı %20 olan kayıtlar filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "prim miktarlarını topla",
    "logic": "sum all bonus and premium amounts",
    "category": "bordro",
    "output": {
      "action": "sum",
      "column": "Prim",
      "reply": "✅ Toplam prim miktarı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "stok devir hızını hesapla",
    "logic": "calculate inventory turnover rate",
    "category": "stok",
    "output": {
      "action": "update_cells",
      "formula": "=B2/C2",
      "reply": "✅ Stok devir hızı hesaplanarak yazıldı.",
      "changes": []
    }
  },
  {
    "user_command": "geçersiz vergi numaralı satırları sil",
    "logic": "delete rows with invalid or missing tax numbers",
    "category": "muhasebe",
    "output": {
      "action": "delete_rows",
      "condition": "Vergi No is blank or invalid",
      "reply": "🗑️ Geçersiz vergi numaralı satırlar silindi.",
      "changes": []
    }
  },
  {
    "user_command": "satış temsilcisine göre sırala",
    "logic": "sort data by sales representative name",
    "category": "satış",
    "output": {
      "action": "sort",
      "direction": "asc",
      "column": "Satış Temsilcisi",
      "reply": "✅ Veriler satış temsilcisine göre sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "en yüksek prim alan çalışan kim",
    "logic": "find employee with maximum bonus amount",
    "category": "bordro",
    "output": {
      "action": "max",
      "column": "Prim",
      "reply": "✅ En yüksek prim alan çalışan bulundu.",
      "changes": []
    }
  },
  {
    "user_command": "toplam borç miktarı nedir",
    "logic": "sum all outstanding debt amounts",
    "category": "muhasebe",
    "output": {
      "action": "sum",
      "column": "Borç",
      "reply": "✅ Toplam borç miktarı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "depo kapasitesini aşanları vurgula",
    "logic": "highlight rows where stock exceeds warehouse capacity",
    "category": "depo",
    "output": {
      "action": "highlight",
      "condition": "greater_than",
      "color": "#FF4500",
      "reply": "✅ Depo kapasitesini aşan satırlar vurgulandı.",
      "changes": []
    }
  },
  {
    "user_command": "ürün kategorisine göre sırala",
    "logic": "sort products by category name alphabetically",
    "category": "stok",
    "output": {
      "action": "sort",
      "direction": "asc",
      "column": "Kategori",
      "reply": "✅ Ürünler kategoriye göre sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "son 1 ayın siparişlerini filtrele",
    "logic": "filter orders placed within the last 30 days",
    "category": "satış",
    "output": {
      "action": "filter",
      "condition": "greater_than",
      "column": "Sipariş Tarihi",
      "value": "LAST30DAYS",
      "reply": "✅ Son 1 ayın siparişleri filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "toplam alacak tutarı ne kadar",
    "logic": "sum all receivable amounts in the dataset",
    "category": "muhasebe",
    "output": {
      "action": "sum",
      "column": "Alacak",
      "reply": "✅ Toplam alacak tutarı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "minimum sipariş adedi kaç",
    "logic": "find minimum order quantity in the dataset",
    "category": "tedarik",
    "output": {
      "action": "min",
      "column": "Sipariş Adedi",
      "reply": "✅ Minimum sipariş adedi bulundu.",
      "changes": []
    }
  },
  {
    "user_command": "bekleyen siparişleri filtrele",
    "logic": "filter orders where status is pending",
    "category": "satış",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "Sipariş Durumu",
      "value": "Beklemede",
      "reply": "✅ Bekleyen siparişler filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "hatalı e-posta olanları sil",
    "logic": "delete rows with invalid email format",
    "category": "genel",
    "output": {
      "action": "delete_rows",
      "condition": "Email format is invalid",
      "reply": "🗑️ Hatalı e-posta içeren satırlar silindi.",
      "changes": []
    }
  },
  {
    "user_command": "maliyet sütununu topla",
    "logic": "sum all cost values in the cost column",
    "category": "muhasebe",
    "output": {
      "action": "sum",
      "column": "Maliyet",
      "reply": "✅ Toplam maliyet hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "ürün açıklamalarını büyük harfe çevir",
    "logic": "convert product descriptions to uppercase text",
    "category": "stok",
    "output": {
      "action": "transform",
      "transform": "uppercase",
      "reply": "✅ Ürün açıklamaları büyük harfe dönüştürüldü.",
      "changes": []
    }
  },
  {
    "user_command": "ortalama sipariş tutarı nedir",
    "logic": "calculate average order amount across all orders",
    "category": "satış",
    "output": {
      "action": "average",
      "column": "Sipariş Tutarı",
      "reply": "✅ Ortalama sipariş tutarı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "kaç farklı tedarikçi var",
    "logic": "count distinct suppliers in the dataset",
    "category": "tedarik",
    "output": {
      "action": "count",
      "column": "Tedarikçi",
      "reply": "✅ Toplam farklı tedarikçi sayısı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "net kâr sütununu oluştur",
    "logic": "create net profit column by subtracting expenses from revenue",
    "category": "muhasebe",
    "output": {
      "action": "update_cells",
      "formula": "=B2-C2-D2",
      "reply": "✅ Net kâr sütunu oluşturuldu.",
      "changes": []
    }
  },
  {
    "user_command": "işten ayrılanları sil",
    "logic": "delete rows where employee status is terminated",
    "category": "bordro",
    "output": {
      "action": "delete_rows",
      "condition": "Durum equals İşten Ayrıldı",
      "reply": "🗑️ İşten ayrılan çalışanların satırları silindi.",
      "changes": []
    }
  },
  {
    "user_command": "en düşük maliyet hangisi",
    "logic": "find item with minimum cost value",
    "category": "muhasebe",
    "output": {
      "action": "min",
      "column": "Maliyet",
      "reply": "✅ En düşük maliyet değeri bulundu.",
      "changes": []
    }
  },
  {
    "user_command": "tahsilat tutarlarını topla",
    "logic": "sum all collected payment amounts",
    "category": "muhasebe",
    "output": {
      "action": "sum",
      "column": "Tahsilat",
      "reply": "✅ Toplam tahsilat tutarı hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "hedef altı satışları kırmızıya boya",
    "logic": "highlight rows where sales are below target in red",
    "category": "satış",
    "output": {
      "action": "highlight",
      "condition": "less_than",
      "color": "#FF0000",
      "reply": "✅ Hedef altındaki satış satırları kırmızıya boyandı.",
      "changes": []
    }
  },
  {
    "user_command": "yıllık izin günlerini topla",
    "logic": "sum total annual leave days for all employees",
    "category": "bordro",
    "output": {
      "action": "sum",
      "column": "Yıllık İzin",
      "reply": "✅ Toplam yıllık izin günleri hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "raf ömrü dolmuş olanları sil",
    "logic": "delete rows where shelf life has expired",
    "category": "depo",
    "output": {
      "action": "delete_rows",
      "condition": "Son Kullanma Tarihi less than TODAY",
      "reply": "🗑️ Raf ömrü dolmuş ürünlerin satırları silindi.",
      "changes": []
    }
  },
  {
    "user_command": "sipariş miktarlarının ortalaması ne",
    "logic": "calculate average of all order quantities",
    "category": "satış",
    "output": {
      "action": "average",
      "column": "Sipariş Miktarı",
      "reply": "✅ Sipariş miktarlarının ortalaması hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "kargo firmasına göre sırala",
    "logic": "sort data by shipping company name alphabetically",
    "category": "depo",
    "output": {
      "action": "sort",
      "direction": "asc",
      "column": "Kargo Firması",
      "reply": "✅ Veriler kargo firmasına göre sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "yüksek riskli müşterileri vurgula",
    "logic": "highlight high-risk customers based on overdue payments",
    "category": "muhasebe",
    "output": {
      "action": "highlight",
      "condition": "greater_than",
      "color": "#FF0000",
      "reply": "✅ Yüksek riskli müşteriler kırmızıyla vurgulandı.",
      "changes": []
    }
  },
  {
    "user_command": "toplam üretim maliyeti nedir",
    "logic": "sum all manufacturing cost amounts",
    "category": "depo",
    "output": {
      "action": "sum",
      "column": "Üretim Maliyeti",
      "reply": "✅ Toplam üretim maliyeti hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "çalışma yılına göre sırala",
    "logic": "sort employees by years of service in descending order",
    "category": "bordro",
    "output": {
      "action": "sort",
      "direction": "desc",
      "column": "Çalışma Yılı",
      "reply": "✅ Çalışanlar çalışma yılına göre en çoktan aza sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "bu veride kaç sütun var",
    "logic": "count number of columns in the dataset",
    "category": "genel",
    "output": {
      "action": "message",
      "reply": "ℹ️ Veri setindeki sütun sayısı bilgisi gösterildi.",
      "changes": []
    }
  },
  {
    "user_command": "fatura tarihi en eskiden en yeniye sırala",
    "logic": "sort invoice dates from oldest to newest ascending",
    "category": "muhasebe",
    "output": {
      "action": "sort",
      "direction": "asc",
      "column": "Fatura Tarihi",
      "reply": "✅ Fatura tarihleri en eskiden en yeniye sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "iade oranını hesapla",
    "logic": "calculate return rate as returned divided by total orders",
    "category": "satış",
    "output": {
      "action": "update_cells",
      "formula": "=C2/B2*100",
      "reply": "✅ İade oranı hesaplanarak yüzde olarak yazıldı.",
      "changes": []
    }
  },
  {
    "user_command": "minimum kargo ücreti kaç",
    "logic": "find minimum shipping cost in the dataset",
    "category": "depo",
    "output": {
      "action": "min",
      "column": "Kargo Ücreti",
      "reply": "✅ Minimum kargo ücreti bulundu.",
      "changes": []
    }
  },
  {
    "user_command": "depo lokasyonuna göre sırala",
    "logic": "sort data by warehouse location alphabetically",
    "category": "depo",
    "output": {
      "action": "sort",
      "direction": "asc",
      "column": "Lokasyon",
      "reply": "✅ Veriler depo lokasyonuna göre sıralandı.",
      "changes": []
    }
  },
  {
    "user_command": "tüm filtreleri temizle",
    "logic": "clear and remove all filters applied to dataset",
    "category": "genel",
    "output": {
      "action": "remove_filter",
      "reply": "✅ Tüm filtreler temizlendi, tüm veriler görüntüleniyor.",
      "changes": []
    }
  },
  {
    "user_command": "satış kanalına göre filtrele",
    "logic": "filter data by specific sales channel",
    "category": "satış",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "Satış Kanalı",
      "value": "Online",
      "reply": "✅ Veriler satış kanalına göre filtrelendi.",
      "changes": []
    }
  },
  {
    "user_command": "gelecek haftaki teslimatları listele",
    "logic": "filter deliveries scheduled for next week",
    "category": "depo",
    "output": {
      "action": "filter",
      "condition": "equals",
      "column": "Teslimat Haftası",
      "value": "NEXT_WEEK",
      "reply": "✅ Gelecek haftaki teslimatlar listelendi.",
      "changes": []
    }
  },
  {
    "user_command": "ortalama kargo süresi ne kadar",
    "logic": "calculate average shipping duration in days",
    "category": "depo",
    "output": {
      "action": "average",
      "column": "Kargo Süresi",
      "reply": "✅ Ortalama kargo süresi hesaplandı.",
      "changes": []
    }
  },
  {
    "user_command": "boş telefon numaralı satırları sil",
    "logic": "delete rows where phone number is empty",
    "category": "genel",
    "output": {
      "action": "delete_rows",
      "condition": "Telefon is blank",
      "reply": "🗑️ Telefon numarası boş olan satırlar silindi.",
      "changes": []
    }
  },
  {
    "user_command": "döviz kuruna göre TL karşılığını hesapla",
    "logic": "calculate Turkish Lira equivalent using exchange rate",
    "category": "muhasebe",
    "output": {
      "action": "update_cells",
      "formula": "=B2*C2",
      "reply": "✅ Döviz tutarlarının TL karşılığı hesaplandı.",
      "changes": []
    }
  },
  // ──────────────────────────────────────────────────────────
  // AUTO-GENERATED 2026-06-06
  // ──────────────────────────────────────────────────────────
  { user_command: "Maaş sütununu büyükten küçüğe sırala", logic: "Sort salary column in descending order", category: "bordro", output: {"action":"sort","direction":"desc","column":"Maaş","reply":"✅ Maaş sütunu büyükten küçüğe sıralandı.","changes":[]} },
  { user_command: "Stok miktarı sıfır olan ürünleri göster", logic: "Filter products where stock quantity is zero", category: "stok", output: {"action":"filter","condition":"equals","column":"Stok Miktarı","value":"0","reply":"✅ Stok miktarı sıfır olan ürünler filtrelendi.","changes":[]} },
  { user_command: "Toplam satış tutarını hesapla", logic: "Calculate total sales amount", category: "satış", output: {"action":"sum","column":"Satış Tutarı","reply":"✅ Toplam satış tutarı hesaplandı.","changes":[]} },
  { user_command: "KDV oranı %18 olan faturaları filtrele", logic: "Filter invoices with 18% VAT rate", category: "e-fatura", output: {"action":"filter","condition":"equals","column":"KDV Oranı","value":"18","reply":"✅ KDV oranı %18 olan faturalar filtrelendi.","changes":[]} },
  { user_command: "Tedarikçi adlarını büyük harfe çevir", logic: "Convert supplier names to uppercase", category: "tedarik", output: {"action":"transform","transform":"uppercase","reply":"✅ Tedarikçi adları büyük harfe dönüştürüldü.","changes":[]} },
  { user_command: "SGK primlerinin ortalamasını bul", logic: "Find average of SGK premiums", category: "bordro", output: {"action":"average","column":"SGK Primi","reply":"✅ SGK primlerinin ortalaması hesaplandı.","changes":[]} },
  { user_command: "Depo kodu sütununa göre artan sırala", logic: "Sort by warehouse code in ascending order", category: "depo", output: {"action":"sort","direction":"asc","column":"Depo Kodu","reply":"✅ Depo kodu sütunu artan şekilde sıralandı.","changes":[]} },
  { user_command: "Satış tutarı 10000 üzerindeki kayıtları vurgula", logic: "Highlight records where sales amount exceeds 10000", category: "satış", output: {"action":"highlight","condition":"greater_than","color":"#FFFF00","reply":"✅ Satış tutarı 10.000 üzerindeki kayıtlar sarı ile vurgulandı.","changes":[]} },
  { user_command: "Mükerrer fatura kayıtlarını kaldır", logic: "Remove duplicate invoice records", category: "e-fatura", output: {"action":"remove_duplicates","reply":"✅ Mükerrer fatura kayıtları kaldırıldı.","changes":[]} },
  { user_command: "Ürün adı boş olan satırları sil", logic: "Delete rows where product name is empty", category: "stok", output: {"action":"delete_rows","condition":"is_empty","reply":"🗑️ Ürün adı boş olan satırlar silindi.","changes":[]} },
  { user_command: "En yüksek KDV tutarını göster", logic: "Show maximum VAT amount", category: "muhasebe", output: {"action":"max","column":"KDV Tutarı","reply":"✅ En yüksek KDV tutarı bulundu.","changes":[]} },
  { user_command: "Aktif çalışan sayısını say", logic: "Count number of active employees", category: "bordro", output: {"action":"count","column":"Çalışan Durumu","reply":"✅ Aktif çalışan sayısı hesaplandı.","changes":[]} },
  { user_command: "Fatura tarihi sütununu artan sıraya koy", logic: "Sort invoice date column in ascending order", category: "e-fatura", output: {"action":"sort","direction":"asc","column":"Fatura Tarihi","reply":"✅ Fatura tarihi artan şekilde sıralandı.","changes":[]} },
  { user_command: "Minimum sipariş miktarını bul", logic: "Find minimum order quantity", category: "tedarik", output: {"action":"min","column":"Sipariş Miktarı","reply":"✅ Minimum sipariş miktarı bulundu.","changes":[]} },
  { user_command: "Negatif bakiyeli hesapları kırmızı ile işaretle", logic: "Highlight accounts with negative balance in red", category: "muhasebe", output: {"action":"highlight","condition":"less_than","color":"#FF0000","reply":"✅ Negatif bakiyeli hesaplar kırmızı ile işaretlendi.","changes":[]} },
  { user_command: "Tüm filtreleri kaldır", logic: "Remove all active filters", category: "genel", output: {"action":"remove_filter","reply":"✅ Tüm filtreler kaldırıldı.","changes":[]} },
  { user_command: "Yeni bir ürün satırı ekle", logic: "Add a new product row", category: "stok", output: {"action":"add_row","reply":"➕ Yeni ürün satırı eklendi.","changes":[]} },
  { user_command: "Brüt maaş sütununun toplamını hesapla", logic: "Calculate total gross salary", category: "bordro", output: {"action":"sum","column":"Brüt Maaş","reply":"✅ Brüt maaş toplamı hesaplandı.","changes":[]} },
  { user_command: "Depo stok durumu kritik olanları filtrele", logic: "Filter items with critical warehouse stock status", category: "depo", output: {"action":"filter","condition":"equals","column":"Stok Durumu","value":"Kritik","reply":"✅ Kritik stok durumundaki depo kalemleri filtrelendi.","changes":[]} },
  { user_command: "Vergi dairesi sütununu A'dan Z'ye sırala", logic: "Sort tax office column alphabetically A to Z", category: "muhasebe", output: {"action":"sort","direction":"asc","column":"Vergi Dairesi","reply":"✅ Vergi dairesi sütunu A'dan Z'ye sıralandı.","changes":[]} },
  { user_command: "KDV %20 uygulanan satırları vurgula", logic: "Highlight rows with 20% VAT applied", category: "e-fatura", output: {"action":"highlight","condition":"equals","color":"#FFA500","reply":"✅ KDV %20 uygulanan satırlar turuncu ile vurgulandı.","changes":[]} },
  { user_command: "Ortalama sipariş değerini hesapla", logic: "Calculate average order value", category: "satış", output: {"action":"average","column":"Sipariş Değeri","reply":"✅ Ortalama sipariş değeri hesaplandı.","changes":[]} },
  { user_command: "İptal edilen siparişleri sil", logic: "Delete cancelled orders", category: "satış", output: {"action":"delete_rows","condition":"equals_cancelled","reply":"🗑️ İptal edilen siparişler silindi.","changes":[]} },
  { user_command: "Tedarikçi kodu sütununu küçükten büyüğe sırala", logic: "Sort supplier code column in ascending order", category: "tedarik", output: {"action":"sort","direction":"asc","column":"Tedarikçi Kodu","reply":"✅ Tedarikçi kodu sütunu küçükten büyüğe sıralandı.","changes":[]} },
  { user_command: "Net maaş ortalamasını hesapla", logic: "Calculate average net salary", category: "bordro", output: {"action":"average","column":"Net Maaş","reply":"✅ Net maaş ortalaması hesaplandı.","changes":[]} },
  { user_command: "Ürün kategorisi 'Elektronik' olanları filtrele", logic: "Filter products in Electronics category", category: "stok", output: {"action":"filter","condition":"equals","column":"Kategori","value":"Elektronik","reply":"✅ Elektronik kategorisindeki ürünler filtrelendi.","changes":[]} },
  { user_command: "Toplam vergi tutarını bul", logic: "Find total tax amount", category: "muhasebe", output: {"action":"sum","column":"Vergi Tutarı","reply":"✅ Toplam vergi tutarı hesaplandı.","changes":[]} },
  { user_command: "Fatura numarası tekrarlananları temizle", logic: "Remove duplicate invoice numbers", category: "e-fatura", output: {"action":"remove_duplicates","reply":"✅ Tekrarlanan fatura numaraları temizlendi.","changes":[]} },
  { user_command: "Yeni bir tedarikçi satırı ekle", logic: "Add a new supplier row", category: "tedarik", output: {"action":"add_row","reply":"➕ Yeni tedarikçi satırı eklendi.","changes":[]} },
  { user_command: "Stok değeri en yüksek ürünü göster", logic: "Show product with highest stock value", category: "stok", output: {"action":"max","column":"Stok Değeri","reply":"✅ Stok değeri en yüksek ürün bulundu.","changes":[]} },
  { user_command: "Aylık prim teşvik tutarlarının toplamını hesapla", logic: "Calculate total monthly incentive premium amounts", category: "bordro", output: {"action":"sum","column":"Prim Teşvik","reply":"✅ Aylık prim teşvik tutarları toplamı hesaplandı.","changes":[]} },
  { user_command: "Sevkiyat tarihi geçmiş olanları kırmızı renkle işaretle", logic: "Highlight overdue shipment dates in red", category: "depo", output: {"action":"highlight","condition":"less_than_today","color":"#FF0000","reply":"✅ Geçmiş sevkiyat tarihli kayıtlar kırmızı ile işaretlendi.","changes":[]} },
  { user_command: "Satıcı adlarını küçük harfe çevir", logic: "Convert salesperson names to lowercase", category: "satış", output: {"action":"transform","transform":"lowercase","reply":"✅ Satıcı adları küçük harfe dönüştürüldü.","changes":[]} },
  { user_command: "Toplam KDV tutarını hesapla", logic: "Calculate total VAT amount", category: "muhasebe", output: {"action":"sum","column":"KDV Tutarı","reply":"✅ Toplam KDV tutarı hesaplandı.","changes":[]} },
  { user_command: "En düşük satış fiyatını bul", logic: "Find minimum selling price", category: "satış", output: {"action":"min","column":"Satış Fiyatı","reply":"✅ En düşük satış fiyatı bulundu.","changes":[]} },
  { user_command: "Departman sütununa göre sırala", logic: "Sort by department column", category: "bordro", output: {"action":"sort","direction":"asc","column":"Departman","reply":"✅ Departman sütununa göre sıralama yapıldı.","changes":[]} },
  { user_command: "İade edilen ürün satırlarını sil", logic: "Delete rows of returned products", category: "stok", output: {"action":"delete_rows","condition":"equals_returned","reply":"🗑️ İade edilen ürün satırları silindi.","changes":[]} },
  { user_command: "Fatura toplam tutarının ortalamasını hesapla", logic: "Calculate average total invoice amount", category: "e-fatura", output: {"action":"average","column":"Fatura Tutarı","reply":"✅ Fatura toplam tutarlarının ortalaması hesaplandı.","changes":[]} },
  { user_command: "Depo adı sütununu alfabetik sırala", logic: "Sort warehouse name column alphabetically", category: "depo", output: {"action":"sort","direction":"asc","column":"Depo Adı","reply":"✅ Depo adı sütunu alfabetik olarak sıralandı.","changes":[]} },
  { user_command: "Birim fiyatı 500'den az ürünleri filtrele", logic: "Filter products with unit price less than 500", category: "stok", output: {"action":"filter","condition":"less_than","column":"Birim Fiyat","value":"500","reply":"✅ Birim fiyatı 500'den az olan ürünler filtrelendi.","changes":[]} },
  { user_command: "SGK işveren payı toplamını hesapla", logic: "Calculate total employer SGK contribution", category: "bordro", output: {"action":"sum","column":"SGK İşveren Payı","reply":"✅ SGK işveren payı toplamı hesaplandı.","changes":[]} },
  { user_command: "Müşteri adı sütununu büyük harfe çevir", logic: "Convert customer name column to uppercase", category: "satış", output: {"action":"transform","transform":"uppercase","reply":"✅ Müşteri adları büyük harfe dönüştürüldü.","changes":[]} },
  { user_command: "Vadesi geçmiş faturaları filtrele", logic: "Filter overdue invoices", category: "muhasebe", output: {"action":"filter","condition":"less_than_today","column":"Vade Tarihi","value":"today","reply":"✅ Vadesi geçmiş faturalar filtrelendi.","changes":[]} },
  { user_command: "Toplam gider tutarını hesapla", logic: "Calculate total expense amount", category: "muhasebe", output: {"action":"sum","column":"Gider Tutarı","reply":"✅ Toplam gider tutarı hesaplandı.","changes":[]} },
  { user_command: "Boş hücreli satırları sil", logic: "Delete rows with empty cells", category: "genel", output: {"action":"delete_rows","condition":"has_empty_cells","reply":"🗑️ Boş hücreli satırlar silindi.","changes":[]} },
  { user_command: "Kargo durumu 'Teslim Edildi' olanları filtrele", logic: "Filter shipments with delivered status", category: "depo", output: {"action":"filter","condition":"equals","column":"Kargo Durumu","value":"Teslim Edildi","reply":"✅ Teslim edilmiş kargo kayıtları filtrelendi.","changes":[]} },
  { user_command: "Çalışan sayısını hesapla", logic: "Count total number of employees", category: "bordro", output: {"action":"count","column":"Çalışan Adı","reply":"✅ Toplam çalışan sayısı hesaplandı.","changes":[]} },
  { user_command: "Yeni bir muhasebe satırı ekle", logic: "Add a new accounting entry row", category: "muhasebe", output: {"action":"add_row","reply":"➕ Yeni muhasebe satırı eklendi.","changes":[]} },
  { user_command: "Satış adedi en fazla olan ürünü bul", logic: "Find product with maximum sales quantity", category: "satış", output: {"action":"max","column":"Satış Adedi","reply":"✅ Satış adedi en fazla olan ürün bulundu.","changes":[]} },
  { user_command: "Ürün kodu sütununu büyük harfe çevir", logic: "Convert product code column to uppercase", category: "stok", output: {"action":"transform","transform":"uppercase","reply":"✅ Ürün kodları büyük harfe dönüştürüldü.","changes":[]} },
  { user_command: "Sipariş no sütununa göre azalan sırala", logic: "Sort order number column in descending order", category: "satış", output: {"action":"sort","direction":"desc","column":"Sipariş No","reply":"✅ Sipariş no sütunu azalan şekilde sıralandı.","changes":[]} },
  { user_command: "Kesinti tutarlarının ortalamasını hesapla", logic: "Calculate average deduction amounts", category: "bordro", output: {"action":"average","column":"Kesinti Tutarı","reply":"✅ Kesinti tutarlarının ortalaması hesaplandı.","changes":[]} },
  { user_command: "Tedarikçisi olmayan ürün satırlarını vurgula", logic: "Highlight product rows without supplier", category: "tedarik", output: {"action":"highlight","condition":"is_empty","color":"#FFB6C1","reply":"✅ Tedarikçisi olmayan ürün satırları pembe ile vurgulandı.","changes":[]} },
  { user_command: "Fatura durumu 'Ödendi' olanları filtrele", logic: "Filter invoices with paid status", category: "e-fatura", output: {"action":"filter","condition":"equals","column":"Fatura Durumu","value":"Ödendi","reply":"✅ Ödenmiş faturalar filtrelendi.","changes":[]} },
  { user_command: "En düşük stok miktarını bul", logic: "Find minimum stock quantity", category: "stok", output: {"action":"min","column":"Stok Miktarı","reply":"✅ En düşük stok miktarı bulundu.","changes":[]} },
  { user_command: "Yeni bir stok satırı ekle", logic: "Add a new stock entry row", category: "stok", output: {"action":"add_row","reply":"➕ Yeni stok satırı eklendi.","changes":[]} },
  { user_command: "Gelir tablosunu büyükten küçüğe sırala", logic: "Sort income statement in descending order", category: "muhasebe", output: {"action":"sort","direction":"desc","column":"Gelir","reply":"✅ Gelir tablosu büyükten küçüğe sıralandı.","changes":[]} },
  { user_command: "Yıllık izin günleri toplamını hesapla", logic: "Calculate total annual leave days", category: "bordro", output: {"action":"sum","column":"Yıllık İzin","reply":"✅ Yıllık izin günleri toplamı hesaplandı.","changes":[]} },
  { user_command: "Raf numarası sütununa göre sırala", logic: "Sort by shelf number column", category: "depo", output: {"action":"sort","direction":"asc","column":"Raf Numarası","reply":"✅ Raf numarası sütununa göre sıralama yapıldı.","changes":[]} },
  { user_command: "Sipariş tutarı 5000 üzerinde olanları vurgula", logic: "Highlight orders with amount above 5000", category: "satış", output: {"action":"highlight","condition":"greater_than","color":"#90EE90","reply":"✅ 5.000 üzerindeki sipariş tutarları yeşil ile vurgulandı.","changes":[]} },
  { user_command: "Fatura kesilme tarihi sütununu sırala", logic: "Sort invoice issue date column", category: "e-fatura", output: {"action":"sort","direction":"desc","column":"Kesilme Tarihi","reply":"✅ Fatura kesilme tarihi sütunu azalan şekilde sıralandı.","changes":[]} },
  { user_command: "Toplam alacak tutarını hesapla", logic: "Calculate total receivable amount", category: "muhasebe", output: {"action":"sum","column":"Alacak Tutarı","reply":"✅ Toplam alacak tutarı hesaplandı.","changes":[]} },
  { user_command: "Müşteri segmenti 'Kurumsal' olanları filtrele", logic: "Filter customers in Corporate segment", category: "satış", output: {"action":"filter","condition":"equals","column":"Müşteri Segmenti","value":"Kurumsal","reply":"✅ Kurumsal segment müşterileri filtrelendi.","changes":[]} },
  { user_command: "Tekrarlanan müşteri kayıtlarını kaldır", logic: "Remove duplicate customer records", category: "satış", output: {"action":"remove_duplicates","reply":"✅ Tekrarlanan müşteri kayıtları kaldırıldı.","changes":[]} },
  { user_command: "SGK işçi payının ortalamasını bul", logic: "Find average employee SGK contribution", category: "bordro", output: {"action":"average","column":"SGK İşçi Payı","reply":"✅ SGK işçi payının ortalaması hesaplandı.","changes":[]} },
  { user_command: "Stok eşiği altındaki ürünleri kırmızı ile işaretle", logic: "Highlight products below stock threshold in red", category: "stok", output: {"action":"highlight","condition":"less_than","color":"#FF0000","reply":"✅ Stok eşiği altındaki ürünler kırmızı ile işaretlendi.","changes":[]} },
  { user_command: "Teslim tarihi geçen siparişleri filtrele", logic: "Filter orders with past delivery dates", category: "tedarik", output: {"action":"filter","condition":"less_than_today","column":"Teslim Tarihi","value":"today","reply":"✅ Teslim tarihi geçmiş siparişler filtrelendi.","changes":[]} },
  { user_command: "Toplam borç tutarını hesapla", logic: "Calculate total debt amount", category: "muhasebe", output: {"action":"sum","column":"Borç Tutarı","reply":"✅ Toplam borç tutarı hesaplandı.","changes":[]} },
  { user_command: "Çalışan soyadlarını büyük harfe çevir", logic: "Convert employee surnames to uppercase", category: "bordro", output: {"action":"transform","transform":"uppercase","reply":"✅ Çalışan soyadları büyük harfe dönüştürüldü.","changes":[]} },
  { user_command: "Yeni bir fatura satırı ekle", logic: "Add a new invoice row", category: "e-fatura", output: {"action":"add_row","reply":"➕ Yeni fatura satırı eklendi.","changes":[]} },
  { user_command: "Ürün adı sütununu alfabetik sırala", logic: "Sort product name column alphabetically", category: "stok", output: {"action":"sort","direction":"asc","column":"Ürün Adı","reply":"✅ Ürün adı sütunu alfabetik olarak sıralandı.","changes":[]} },
  { user_command: "En yüksek fatura tutarını bul", logic: "Find maximum invoice amount", category: "e-fatura", output: {"action":"max","column":"Fatura Tutarı","reply":"✅ En yüksek fatura tutarı bulundu.","changes":[]} },
  { user_command: "Gelir vergisi stopajının toplamını hesapla", logic: "Calculate total income tax withholding", category: "bordro", output: {"action":"sum","column":"Gelir Vergisi Stopajı","reply":"✅ Gelir vergisi stopajı toplamı hesaplandı.","changes":[]} },
  { user_command: "Depo kapasitesi dolmuş olanları filtrele", logic: "Filter warehouses at full capacity", category: "depo", output: {"action":"filter","condition":"equals","column":"Kapasite Durumu","value":"Dolu","reply":"✅ Kapasitesi dolu depolar filtrelendi.","changes":[]} },
  { user_command: "Satış bölgesi sütununu sırala", logic: "Sort sales region column", category: "satış", output: {"action":"sort","direction":"asc","column":"Satış Bölgesi","reply":"✅ Satış bölgesi sütunu sıralandı.","changes":[]} },
  { user_command: "Tedarik maliyetinin ortalamasını hesapla", logic: "Calculate average procurement cost", category: "tedarik", output: {"action":"average","column":"Tedarik Maliyeti","reply":"✅ Tedarik maliyetinin ortalaması hesaplandı.","changes":[]} },
  { user_command: "Pasif çalışanları sil", logic: "Delete inactive employee rows", category: "bordro", output: {"action":"delete_rows","condition":"equals_inactive","reply":"🗑️ Pasif çalışan kayıtları silindi.","changes":[]} },
  { user_command: "Hesap kodu sütununu küçükten büyüğe sırala", logic: "Sort account code column in ascending order", category: "muhasebe", output: {"action":"sort","direction":"asc","column":"Hesap Kodu","reply":"✅ Hesap kodu sütunu küçükten büyüğe sıralandı.","changes":[]} },
  { user_command: "Birim maliyet ortalamasını hesapla", logic: "Calculate average unit cost", category: "stok", output: {"action":"average","column":"Birim Maliyet","reply":"✅ Birim maliyet ortalaması hesaplandı.","changes":[]} },
  { user_command: "KDV dahil fatura tutarlarının toplamını hesapla", logic: "Calculate total invoice amounts including VAT", category: "e-fatura", output: {"action":"sum","column":"KDV Dahil Tutar","reply":"✅ KDV dahil fatura tutarları toplamı hesaplandı.","changes":[]} },
  { user_command: "Bölge adlarını büyük harfe çevir", logic: "Convert region names to uppercase", category: "satış", output: {"action":"transform","transform":"uppercase","reply":"✅ Bölge adları büyük harfe dönüştürüldü.","changes":[]} },
  { user_command: "Stok miktarı 100'den fazla olanları filtrele", logic: "Filter items with stock quantity greater than 100", category: "stok", output: {"action":"filter","condition":"greater_than","column":"Stok Miktarı","value":"100","reply":"✅ Stok miktarı 100'den fazla olan ürünler filtrelendi.","changes":[]} },
  { user_command: "Excel'de KDV nasıl hesaplanır?", logic: "How to calculate VAT in Excel", category: "muhasebe", output: {"action":"message","reply":"ℹ️ KDV hesaplamak için =Tutar*0,18 formülünü kullanabilirsiniz. Örneğin A2 hücresindeki tutar için =A2*0,18 yazabilirsiniz.","changes":[]} },
  { user_command: "Kâr marjı ortalamasını hesapla", logic: "Calculate average profit margin", category: "muhasebe", output: {"action":"average","column":"Kâr Marjı","reply":"✅ Kâr marjı ortalaması hesaplandı.","changes":[]} },
  { user_command: "Yeni bir personel satırı ekle", logic: "Add a new employee row", category: "bordro", output: {"action":"add_row","reply":"➕ Yeni personel satırı eklendi.","changes":[]} },
  { user_command: "Toplam üretim maliyetini hesapla", logic: "Calculate total production cost", category: "muhasebe", output: {"action":"sum","column":"Üretim Maliyeti","reply":"✅ Toplam üretim maliyeti hesaplandı.","changes":[]} },
  { user_command: "İşe giriş tarihi sütununu sırala", logic: "Sort by hire date column", category: "bordro", output: {"action":"sort","direction":"asc","column":"İşe Giriş Tarihi","reply":"✅ İşe giriş tarihi sütunu artan şekilde sıralandı.","changes":[]} },
  { user_command: "Satın alma fiyatı en düşük ürünü bul", logic: "Find product with minimum purchase price", category: "tedarik", output: {"action":"min","column":"Satın Alma Fiyatı","reply":"✅ Satın alma fiyatı en düşük ürün bulundu.","changes":[]} },
  { user_command: "Depo çıkış miktarlarının toplamını hesapla", logic: "Calculate total warehouse exit quantities", category: "depo", output: {"action":"sum","column":"Çıkış Miktarı","reply":"✅ Depo çıkış miktarları toplamı hesaplandı.","changes":[]} },
  { user_command: "Stok fazlası olan ürünleri yeşil renkle işaretle", logic: "Highlight surplus stock products in green", category: "stok", output: {"action":"highlight","condition":"greater_than","color":"#008000","reply":"✅ Stok fazlası olan ürünler yeşil ile işaretlendi.","changes":[]} },
  { user_command: "Cari hesap numarası tekrarlananları temizle", logic: "Remove duplicate current account numbers", category: "muhasebe", output: {"action":"remove_duplicates","reply":"✅ Tekrarlanan cari hesap numaraları temizlendi.","changes":[]} },
  { user_command: "Tedarikçi teslim süresi en kısasını bul", logic: "Find supplier with minimum delivery time", category: "tedarik", output: {"action":"min","column":"Teslim Süresi","reply":"✅ En kısa teslim süresi olan tedarikçi bulundu.","changes":[]} },
  { user_command: "Satış temsilcisi adlarını küçük harfe çevir", logic: "Convert sales representative names to lowercase", category: "satış", output: {"action":"transform","transform":"lowercase","reply":"✅ Satış temsilcisi adları küçük harfe dönüştürüldü.","changes":[]} },

  // ──────────────────────────────────────────────────────────
  // AUTO-GENERATED 2026-06-06
  // ──────────────────────────────────────────────────────────
  { user_command: "Brüt maaş ile net maaş farkını hesapla", logic: "Calculate the difference between gross salary and net salary", category: "bordro", output: {"action":"update_cells","formula":"=BrütMaaş-NetMaaş","reply":"✅ Brüt maaş ile net maaş arasındaki fark hesaplandı.","changes":[]} },
  { user_command: "Vergi matrahı sütununu küçükten büyüğe sırala", logic: "Sort tax base column in ascending order", category: "muhasebe", output: {"action":"sort","direction":"asc","column":"Vergi Matrahı","reply":"✅ Vergi matrahı sütunu küçükten büyüğe sıralandı.","changes":[]} },
  { user_command: "Sipariş durumu 'Beklemede' olanları filtrele", logic: "Filter rows where order status is Pending", category: "satış", output: {"action":"filter","condition":"equals","column":"Sipariş Durumu","value":"Beklemede","reply":"✅ Sipariş durumu 'Beklemede' olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "Toplam iskonto tutarını hesapla", logic: "Calculate total discount amount", category: "satış", output: {"action":"sum","column":"İskonto Tutarı","reply":"✅ Toplam iskonto tutarı hesaplandı.","changes":[]} },
  { user_command: "Fatura no sütununu küçükten büyüğe sırala", logic: "Sort invoice number column in ascending order", category: "muhasebe", output: {"action":"sort","direction":"asc","column":"Fatura No","reply":"✅ Fatura no sütunu küçükten büyüğe sıralandı.","changes":[]} },
  { user_command: "Kargo firması 'Aras' olanları filtrele", logic: "Filter rows where cargo company is Aras", category: "depo", output: {"action":"filter","condition":"equals","column":"Kargo Firması","value":"Aras","reply":"✅ Kargo firması 'Aras' olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "Çalışan adlarını büyük harfe çevir", logic: "Convert employee names to uppercase", category: "bordro", output: {"action":"transform","transform":"uppercase","reply":"✅ Çalışan adları büyük harfe dönüştürüldü.","changes":[]} },
  { user_command: "En yüksek birim maliyeti bul", logic: "Find the maximum unit cost", category: "stok", output: {"action":"max","column":"Birim Maliyet","reply":"✅ En yüksek birim maliyet değeri bulundu.","changes":[]} },
  { user_command: "Ödeme tarihi geçmiş faturaları kırmızıyla işaretle", logic: "Highlight invoices with past due payment dates in red", category: "muhasebe", output: {"action":"highlight","condition":"past_due","color":"#FF0000","reply":"✅ Ödeme tarihi geçmiş faturalar kırmızı ile işaretlendi.","changes":[]} },
  { user_command: "Tekrarlanan ürün kodlarını kaldır", logic: "Remove duplicate product codes", category: "stok", output: {"action":"remove_duplicates","reply":"✅ Tekrarlanan ürün kodları temizlendi.","changes":[]} },
  { user_command: "Minimum brüt maaşı bul", logic: "Find the minimum gross salary", category: "bordro", output: {"action":"min","column":"Brüt Maaş","reply":"✅ Minimum brüt maaş değeri bulundu.","changes":[]} },
  { user_command: "Stok girişi sıfır olan ürünleri sil", logic: "Delete rows where stock entry is zero", category: "stok", output: {"action":"delete_rows","condition":"Stok Girişi = 0","reply":"🗑️ Stok girişi sıfır olan ürün satırları silindi.","changes":[]} },
  { user_command: "Depo bölgesi sütununu alfabetik sırala", logic: "Sort warehouse region column alphabetically", category: "depo", output: {"action":"sort","direction":"asc","column":"Depo Bölgesi","reply":"✅ Depo bölgesi sütunu alfabetik olarak sıralandı.","changes":[]} },
  { user_command: "Toplam nakliye maliyetini hesapla", logic: "Calculate total shipping cost", category: "tedarik", output: {"action":"sum","column":"Nakliye Maliyeti","reply":"✅ Toplam nakliye maliyeti hesaplandı.","changes":[]} },
  { user_command: "Yeni bir satış satırı ekle", logic: "Add a new sales row", category: "satış", output: {"action":"add_row","reply":"➕ Yeni bir satış satırı eklendi.","changes":[]} },
  { user_command: "Stopaj vergisi sütununu büyükten küçüğe sırala", logic: "Sort withholding tax column in descending order", category: "muhasebe", output: {"action":"sort","direction":"desc","column":"Stopaj Vergisi","reply":"✅ Stopaj vergisi sütunu büyükten küçüğe sıralandı.","changes":[]} },
  { user_command: "Ürün grubu 'Gıda' olanları filtrele", logic: "Filter rows where product group is Food", category: "stok", output: {"action":"filter","condition":"equals","column":"Ürün Grubu","value":"Gıda","reply":"✅ Ürün grubu 'Gıda' olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "Ortalama nakliye süresini hesapla", logic: "Calculate average shipping duration", category: "tedarik", output: {"action":"average","column":"Nakliye Süresi","reply":"✅ Ortalama nakliye süresi hesaplandı.","changes":[]} },
  { user_command: "İptal edilen faturaları filtrele", logic: "Filter cancelled invoices", category: "muhasebe", output: {"action":"filter","condition":"equals","column":"Fatura Durumu","value":"İptal","reply":"✅ İptal edilen faturalar filtrelendi.","changes":[]} },
  { user_command: "Satış hedefi tutmayan bölgeleri kırmızıyla vurgula", logic: "Highlight regions that did not meet sales targets in red", category: "satış", output: {"action":"highlight","condition":"below_target","color":"#FF0000","reply":"✅ Satış hedefini tutturamayan bölgeler kırmızı ile vurgulandı.","changes":[]} },
  { user_command: "Tedarikçi kod sütununu büyük harfe çevir", logic: "Convert supplier code column to uppercase", category: "tedarik", output: {"action":"transform","transform":"uppercase","reply":"✅ Tedarikçi kodları büyük harfe dönüştürüldü.","changes":[]} },
  { user_command: "Yıllık ciro toplamını hesapla", logic: "Calculate total annual turnover", category: "muhasebe", output: {"action":"sum","column":"Yıllık Ciro","reply":"✅ Yıllık ciro toplamı hesaplandı.","changes":[]} },
  { user_command: "KDV oranı %20 olan ürünlerin toplamını hesapla", logic: "Calculate total for products with 20 percent VAT rate", category: "kdv", output: {"action":"sum","column":"KDV Tutarı","reply":"✅ KDV oranı %20 olan ürünlerin toplam KDV tutarı hesaplandı.","changes":[]} },
  { user_command: "Personel sicil numarasına göre sırala", logic: "Sort by employee registration number", category: "bordro", output: {"action":"sort","direction":"asc","column":"Sicil No","reply":"✅ Personel sicil numarasına göre sıralama yapıldı.","changes":[]} },
  { user_command: "Boş tedarikçi hücrelerini vurgula", logic: "Highlight empty supplier cells", category: "tedarik", output: {"action":"highlight","condition":"is_empty","color":"#FFFF00","reply":"✅ Boş tedarikçi hücreleri sarı ile vurgulandı.","changes":[]} },
  { user_command: "En düşük vergi matrahını bul", logic: "Find the minimum tax base", category: "muhasebe", output: {"action":"min","column":"Vergi Matrahı","reply":"✅ En düşük vergi matrahı değeri bulundu.","changes":[]} },
  { user_command: "Aktif tedarikçi sayısını say", logic: "Count active suppliers", category: "tedarik", output: {"action":"count","column":"Tedarikçi Durumu","reply":"✅ Aktif tedarikçi sayısı hesaplandı.","changes":[]} },
  { user_command: "Müşteri vergi no sütununu sırala", logic: "Sort customer tax number column", category: "muhasebe", output: {"action":"sort","direction":"asc","column":"Müşteri Vergi No","reply":"✅ Müşteri vergi no sütunu sıralandı.","changes":[]} },
  { user_command: "Günlük satış ortalamasını hesapla", logic: "Calculate daily sales average", category: "satış", output: {"action":"average","column":"Günlük Satış","reply":"✅ Günlük satış ortalaması hesaplandı.","changes":[]} },
  { user_command: "Fatura tutarı 50000 üzerindeki kayıtları vurgula", logic: "Highlight invoice records above 50000", category: "muhasebe", output: {"action":"highlight","condition":"greater_than","color":"#FFA500","reply":"✅ Fatura tutarı 50.000 üzerindeki kayıtlar vurgulandı.","changes":[]} },
  { user_command: "Çalışan departmanı 'Muhasebe' olanları filtrele", logic: "Filter employees in the Accounting department", category: "bordro", output: {"action":"filter","condition":"equals","column":"Departman","value":"Muhasebe","reply":"✅ Muhasebe departmanındaki çalışanlar filtrelendi.","changes":[]} },
  { user_command: "Toplam amortisman tutarını hesapla", logic: "Calculate total depreciation amount", category: "muhasebe", output: {"action":"sum","column":"Amortisman","reply":"✅ Toplam amortisman tutarı hesaplandı.","changes":[]} },
  { user_command: "Stok devir hızı en yüksek ürünü göster", logic: "Find the product with the highest inventory turnover rate", category: "stok", output: {"action":"max","column":"Stok Devir Hızı","reply":"✅ Stok devir hızı en yüksek ürün gösterildi.","changes":[]} },
  { user_command: "E-fatura durumu 'Gönderildi' olanları filtrele", logic: "Filter e-invoices with status Sent", category: "e-fatura", output: {"action":"filter","condition":"equals","column":"E-Fatura Durumu","value":"Gönderildi","reply":"✅ E-fatura durumu 'Gönderildi' olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "Yeni bir tedarik satırı ekle", logic: "Add a new supply row", category: "tedarik", output: {"action":"add_row","reply":"➕ Yeni bir tedarik satırı eklendi.","changes":[]} },
  { user_command: "Ürün ağırlığı sütununu büyükten küçüğe sırala", logic: "Sort product weight column in descending order", category: "stok", output: {"action":"sort","direction":"desc","column":"Ürün Ağırlığı","reply":"✅ Ürün ağırlığı sütunu büyükten küçüğe sıralandı.","changes":[]} },
  { user_command: "SGK prim günü toplamını hesapla", logic: "Calculate total SGK premium days", category: "sgk", output: {"action":"sum","column":"SGK Prim Günü","reply":"✅ SGK prim günü toplamı hesaplandı.","changes":[]} },
  { user_command: "Satış kanalı 'Online' olanları filtrele", logic: "Filter sales through online channel", category: "satış", output: {"action":"filter","condition":"equals","column":"Satış Kanalı","value":"Online","reply":"✅ Satış kanalı 'Online' olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "Muhasebe hesap kodlarını küçük harfe çevir", logic: "Convert accounting account codes to lowercase", category: "muhasebe", output: {"action":"transform","transform":"lowercase","reply":"✅ Muhasebe hesap kodları küçük harfe dönüştürüldü.","changes":[]} },
  { user_command: "Depo giriş tarihi sütununu sırala", logic: "Sort warehouse entry date column", category: "depo", output: {"action":"sort","direction":"asc","column":"Depo Giriş Tarihi","reply":"✅ Depo giriş tarihi sütunu sıralandı.","changes":[]} },
  { user_command: "Ortalama KDV matrahını hesapla", logic: "Calculate average VAT base", category: "kdv", output: {"action":"average","column":"KDV Matrahı","reply":"✅ Ortalama KDV matrahı hesaplandı.","changes":[]} },
  { user_command: "İşten ayrılan çalışan satırlarını sil", logic: "Delete rows of employees who have left", category: "bordro", output: {"action":"delete_rows","condition":"Çalışma Durumu = İşten Ayrıldı","reply":"🗑️ İşten ayrılan çalışan satırları silindi.","changes":[]} },
  { user_command: "Tedarikçi ülkesi 'Almanya' olanları filtrele", logic: "Filter suppliers from Germany", category: "tedarik", output: {"action":"filter","condition":"equals","column":"Tedarikçi Ülkesi","value":"Almanya","reply":"✅ Tedarikçi ülkesi 'Almanya' olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "Toplam prim tutarını hesapla", logic: "Calculate total premium amount", category: "bordro", output: {"action":"sum","column":"Prim Tutarı","reply":"✅ Toplam prim tutarı hesaplandı.","changes":[]} },
  { user_command: "Kritik stok seviyesindeki ürünleri sarıyla işaretle", logic: "Highlight products at critical stock level in yellow", category: "stok", output: {"action":"highlight","condition":"critical_stock","color":"#FFFF00","reply":"✅ Kritik stok seviyesindeki ürünler sarı ile işaretlendi.","changes":[]} },
  { user_command: "Banka hesap numarası tekrarlananları temizle", logic: "Remove duplicate bank account numbers", category: "muhasebe", output: {"action":"remove_duplicates","reply":"✅ Tekrarlanan banka hesap numaraları temizlendi.","changes":[]} },
  { user_command: "Yeni bir depo satırı ekle", logic: "Add a new warehouse row", category: "depo", output: {"action":"add_row","reply":"➕ Yeni bir depo satırı eklendi.","changes":[]} },
  { user_command: "Satış miktarının ortalamasını hesapla", logic: "Calculate average sales quantity", category: "satış", output: {"action":"average","column":"Satış Miktarı","reply":"✅ Satış miktarının ortalaması hesaplandı.","changes":[]} },
  { user_command: "E-fatura UUID sütununu sırala", logic: "Sort e-invoice UUID column", category: "e-fatura", output: {"action":"sort","direction":"asc","column":"E-Fatura UUID","reply":"✅ E-fatura UUID sütunu sıralandı.","changes":[]} },
  { user_command: "Excel'de DÜŞEYARA nasıl kullanılır?", logic: "How to use VLOOKUP in Excel", category: "genel", output: {"action":"message","reply":"ℹ️ DÜŞEYARA fonksiyonu =DÜŞEYARA(aranan_değer; tablo_dizisi; sütun_indis_sayısı; [aralık_bak]) şeklinde kullanılır.","changes":[]} },
  { user_command: "Sipariş adet sütununa göre azalan sırala", logic: "Sort order quantity column in descending order", category: "satış", output: {"action":"sort","direction":"desc","column":"Sipariş Adedi","reply":"✅ Sipariş adet sütunu azalan şekilde sıralandı.","changes":[]} },
  { user_command: "Vergi kimlik numarası boş olanları sil", logic: "Delete rows with empty tax ID numbers", category: "muhasebe", output: {"action":"delete_rows","condition":"Vergi Kimlik No boş","reply":"🗑️ Vergi kimlik numarası boş olan satırlar silindi.","changes":[]} },
  { user_command: "En yüksek SGK primini bul", logic: "Find the highest SGK premium", category: "sgk", output: {"action":"max","column":"SGK Primi","reply":"✅ En yüksek SGK primi değeri bulundu.","changes":[]} },
  { user_command: "Ürün rengi sütununu alfabetik sırala", logic: "Sort product color column alphabetically", category: "stok", output: {"action":"sort","direction":"asc","column":"Ürün Rengi","reply":"✅ Ürün rengi sütunu alfabetik olarak sıralandı.","changes":[]} },
  { user_command: "Gelir vergisi dilimi 3. olanları filtrele", logic: "Filter records in income tax bracket 3", category: "muhasebe", output: {"action":"filter","condition":"equals","column":"Vergi Dilimi","value":"3","reply":"✅ Gelir vergisi dilimi 3 olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "Toplam ihracat tutarını hesapla", logic: "Calculate total export amount", category: "muhasebe", output: {"action":"sum","column":"İhracat Tutarı","reply":"✅ Toplam ihracat tutarı hesaplandı.","changes":[]} },
  { user_command: "Çalışan unvan sütununu büyük harfe çevir", logic: "Convert employee title column to uppercase", category: "bordro", output: {"action":"transform","transform":"uppercase","reply":"✅ Çalışan unvanları büyük harfe dönüştürüldü.","changes":[]} },
  { user_command: "Satın alma tarihi sütununu büyükten küçüğe sırala", logic: "Sort purchase date column in descending order", category: "tedarik", output: {"action":"sort","direction":"desc","column":"Satın Alma Tarihi","reply":"✅ Satın alma tarihi sütunu büyükten küçüğe sıralandı.","changes":[]} },
  { user_command: "Stok miktarı 50'nin altındaki ürünleri vurgula", logic: "Highlight products with stock quantity below 50", category: "stok", output: {"action":"highlight","condition":"less_than","color":"#FFA500","reply":"✅ Stok miktarı 50'nin altındaki ürünler vurgulandı.","changes":[]} },
  { user_command: "Yeni bir muhasebe hesabı satırı ekle", logic: "Add a new accounting account row", category: "muhasebe", output: {"action":"add_row","reply":"➕ Yeni bir muhasebe hesabı satırı eklendi.","changes":[]} },
  { user_command: "Ortalama işçi SGK primini hesapla", logic: "Calculate average employee SGK premium", category: "sgk", output: {"action":"average","column":"İşçi SGK Primi","reply":"✅ Ortalama işçi SGK primi hesaplandı.","changes":[]} },
  { user_command: "Müşteri tipi 'Bireysel' olanları filtrele", logic: "Filter individual customer type records", category: "satış", output: {"action":"filter","condition":"equals","column":"Müşteri Tipi","value":"Bireysel","reply":"✅ Müşteri tipi 'Bireysel' olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "Tekrarlanan sipariş numaralarını temizle", logic: "Remove duplicate order numbers", category: "satış", output: {"action":"remove_duplicates","reply":"✅ Tekrarlanan sipariş numaraları temizlendi.","changes":[]} },
  { user_command: "En düşük nakliye maliyetini bul", logic: "Find the minimum shipping cost", category: "tedarik", output: {"action":"min","column":"Nakliye Maliyeti","reply":"✅ En düşük nakliye maliyeti bulundu.","changes":[]} },
  { user_command: "Çalışma saati 45 üzerindeki satırları vurgula", logic: "Highlight rows where working hours exceed 45", category: "bordro", output: {"action":"highlight","condition":"greater_than","color":"#FF6600","reply":"✅ Çalışma saati 45 üzerindeki satırlar vurgulandı.","changes":[]} },
  { user_command: "E-fatura senaryosu GES olanları filtrele", logic: "Filter e-invoices with GES scenario", category: "e-fatura", output: {"action":"filter","condition":"equals","column":"E-Fatura Senaryosu","value":"GES","reply":"✅ E-fatura senaryosu GES olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "Toplam üretim adedini hesapla", logic: "Calculate total production quantity", category: "stok", output: {"action":"sum","column":"Üretim Adedi","reply":"✅ Toplam üretim adedi hesaplandı.","changes":[]} },
  { user_command: "Hesap adı sütununu küçük harfe çevir", logic: "Convert account name column to lowercase", category: "muhasebe", output: {"action":"transform","transform":"lowercase","reply":"✅ Hesap adı sütunu küçük harfe dönüştürüldü.","changes":[]} },
  { user_command: "Stok çıkış miktarlarının ortalamasını hesapla", logic: "Calculate average stock exit quantity", category: "depo", output: {"action":"average","column":"Stok Çıkış Miktarı","reply":"✅ Stok çıkış miktarlarının ortalaması hesaplandı.","changes":[]} },
  { user_command: "Ödeme yöntemi 'Nakit' olanları filtrele", logic: "Filter records with cash payment method", category: "muhasebe", output: {"action":"filter","condition":"equals","column":"Ödeme Yöntemi","value":"Nakit","reply":"✅ Ödeme yöntemi 'Nakit' olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "Geçersiz IBAN içeren satırları sil", logic: "Delete rows with invalid IBAN", category: "muhasebe", output: {"action":"delete_rows","condition":"IBAN geçersiz","reply":"🗑️ Geçersiz IBAN içeren satırlar silindi.","changes":[]} },
  { user_command: "Toplam ithalat tutarını hesapla", logic: "Calculate total import amount", category: "muhasebe", output: {"action":"sum","column":"İthalat Tutarı","reply":"✅ Toplam ithalat tutarı hesaplandı.","changes":[]} },
  { user_command: "Yeni bir KDV satırı ekle", logic: "Add a new VAT row", category: "kdv", output: {"action":"add_row","reply":"➕ Yeni bir KDV satırı eklendi.","changes":[]} },
  { user_command: "Kâr zarar durumu 'Zarar' olanları kırmızıyla işaretle", logic: "Highlight loss records in red", category: "muhasebe", output: {"action":"highlight","condition":"equals_loss","color":"#FF0000","reply":"✅ Zarar durumundaki kayıtlar kırmızı ile işaretlendi.","changes":[]} },
  { user_command: "Çalışan TC kimlik numarası tekrarlananları kaldır", logic: "Remove duplicate employee TC identity numbers", category: "bordro", output: {"action":"remove_duplicates","reply":"✅ Tekrarlanan TC kimlik numaraları kaldırıldı.","changes":[]} },
  { user_command: "Ürün birimi sütununu alfabetik sırala", logic: "Sort product unit column alphabetically", category: "stok", output: {"action":"sort","direction":"asc","column":"Ürün Birimi","reply":"✅ Ürün birimi sütunu alfabetik olarak sıralandı.","changes":[]} },
  { user_command: "Tedarikçi teklif tutarının ortalamasını hesapla", logic: "Calculate average supplier offer amount", category: "tedarik", output: {"action":"average","column":"Teklif Tutarı","reply":"✅ Tedarikçi teklif tutarının ortalaması hesaplandı.","changes":[]} },
  { user_command: "E-arşiv fatura olanları filtrele", logic: "Filter e-archive invoices", category: "e-fatura", output: {"action":"filter","condition":"equals","column":"Fatura Tipi","value":"E-Arşiv","reply":"✅ E-arşiv faturalar filtrelendi.","changes":[]} },
  { user_command: "Satış komisyonu toplamını hesapla", logic: "Calculate total sales commission", category: "satış", output: {"action":"sum","column":"Satış Komisyonu","reply":"✅ Toplam satış komisyonu hesaplandı.","changes":[]} },
  { user_command: "Şehir adı sütununu büyük harfe çevir", logic: "Convert city name column to uppercase", category: "genel", output: {"action":"transform","transform":"uppercase","reply":"✅ Şehir adları büyük harfe dönüştürüldü.","changes":[]} },
  { user_command: "En yüksek satış komisyonunu bul", logic: "Find the highest sales commission", category: "satış", output: {"action":"max","column":"Satış Komisyonu","reply":"✅ En yüksek satış komisyonu değeri bulundu.","changes":[]} },
  { user_command: "Üretim tarihi sütununu artan sırayla sırala", logic: "Sort production date column in ascending order", category: "stok", output: {"action":"sort","direction":"asc","column":"Üretim Tarihi","reply":"✅ Üretim tarihi sütunu artan sırayla sıralandı.","changes":[]} },
  { user_command: "Depo doluluk oranı %90 üzeri olanları vurgula", logic: "Highlight warehouses with over 90 percent capacity utilization", category: "depo", output: {"action":"highlight","condition":"greater_than_90_percent","color":"#FF4500","reply":"✅ Doluluk oranı %90 üzerindeki depolar vurgulandı.","changes":[]} },
  { user_command: "Çalışan izin bakiyesi negatif olanları filtrele", logic: "Filter employees with negative leave balance", category: "bordro", output: {"action":"filter","condition":"less_than","column":"İzin Bakiyesi","value":"0","reply":"✅ İzin bakiyesi negatif olan çalışanlar filtrelendi.","changes":[]} },
  { user_command: "Toplam stopaj vergisi tutarını hesapla", logic: "Calculate total withholding tax amount", category: "muhasebe", output: {"action":"sum","column":"Stopaj Vergisi","reply":"✅ Toplam stopaj vergisi tutarı hesaplandı.","changes":[]} },
  { user_command: "Yeni bir SGK satırı ekle", logic: "Add a new SGK row", category: "sgk", output: {"action":"add_row","reply":"➕ Yeni bir SGK satırı eklendi.","changes":[]} },
  { user_command: "Temin süresi 30 günü aşan ürünleri vurgula", logic: "Highlight products with procurement time exceeding 30 days", category: "tedarik", output: {"action":"highlight","condition":"greater_than_30","color":"#FF8C00","reply":"✅ Temin süresi 30 günü aşan ürünler vurgulandı.","changes":[]} },
  { user_command: "SGK eksik gün nedenlerini sırala", logic: "Sort SGK missing day reasons", category: "sgk", output: {"action":"sort","direction":"asc","column":"Eksik Gün Nedeni","reply":"✅ SGK eksik gün nedenleri sıralandı.","changes":[]} },
  { user_command: "Müşteri bakiyesi en yüksek olanı göster", logic: "Find the customer with the highest balance", category: "muhasebe", output: {"action":"max","column":"Müşteri Bakiyesi","reply":"✅ En yüksek müşteri bakiyesi değeri gösterildi.","changes":[]} },

  // ──────────────────────────────────────────────────────────
  // AUTO-GENERATED 2026-06-06
  // ──────────────────────────────────────────────────────────
  { user_command: "en yüksek ciro değerini bul", logic: "Find maximum revenue value in ciro column", category: "statistics", output: {"action":"max","column":"Ciro","reply":"✅ En yüksek ciro değeri bulundu.","changes":[]} },
  { user_command: "tedarikçi adlarını alfabetik sırala", logic: "Sort supplier names alphabetically ascending", category: "sort", output: {"action":"sort","direction":"asc","column":"Tedarikçi Adı","reply":"✅ Tedarikçi adları A'dan Z'ye sıralandı.","changes":[]} },
  { user_command: "brüt kâr sütununu topla", logic: "Sum all values in gross profit column", category: "sum", output: {"action":"sum","column":"Brüt Kâr","reply":"✅ Brüt kâr sütununun toplamı hesaplandı.","changes":[]} },
  { user_command: "stok miktarı 20'nin altındakileri filtrele", logic: "Filter rows where stock quantity is less than 20", category: "filter", output: {"action":"filter","condition":"less_than","column":"Stok Miktarı","value":"20","reply":"✅ Stok miktarı 20'nin altındaki ürünler filtrelendi.","changes":[]} },
  { user_command: "KDV matrahı sütununun ortalamasını hesapla", logic: "Calculate average of KDV base amount column", category: "statistics", output: {"action":"average","column":"KDV Matrahı","reply":"✅ KDV matrahı ortalaması hesaplandı.","changes":[]} },
  { user_command: "sipariş tarihi en eskiden en yeniye sırala", logic: "Sort order date column ascending from oldest to newest", category: "sort", output: {"action":"sort","direction":"asc","column":"Sipariş Tarihi","reply":"✅ Sipariş tarihleri en eskiden en yeniye sıralandı.","changes":[]} },
  { user_command: "SGK eksik gün sütununu küçükten büyüğe sırala", logic: "Sort SGK missing days column ascending", category: "sort", output: {"action":"sort","direction":"asc","column":"SGK Eksik Gün","reply":"✅ SGK eksik gün sütunu küçükten büyüğe sıralandı.","changes":[]} },
  { user_command: "e-fatura durumu iptal olanları filtrele", logic: "Filter rows where e-invoice status is cancelled", category: "filter", output: {"action":"filter","condition":"equals","column":"E-Fatura Durumu","value":"İptal","reply":"✅ E-fatura durumu iptal olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "ödeme vadesi geçmiş faturaları turuncu yap", logic: "Highlight rows where payment due date has passed in orange", category: "highlight", output: {"action":"highlight","condition":"due_date_passed","color":"#FFA500","reply":"✅ Vadesi geçmiş faturalar turuncu renk ile işaretlendi.","changes":[]} },
  { user_command: "mükerrer e-posta kayıtlarını kaldır", logic: "Remove duplicate records based on email column", category: "remove_duplicates", output: {"action":"remove_duplicates","reply":"✅ Mükerrer e-posta kayıtları kaldırıldı.","changes":[]} },
  { user_command: "net satış tutarı sütununu büyükten küçüğe sırala", logic: "Sort net sales amount column descending", category: "sort", output: {"action":"sort","direction":"desc","column":"Net Satış Tutarı","reply":"✅ Net satış tutarı büyükten küçüğe sıralandı.","changes":[]} },
  { user_command: "depo giriş tarihi en yeni olandan sırala", logic: "Sort warehouse entry date descending from newest", category: "sort", output: {"action":"sort","direction":"desc","column":"Depo Giriş Tarihi","reply":"✅ Depo giriş tarihleri en yeniden en eskiye sıralandı.","changes":[]} },
  { user_command: "ürün ağırlığı sıfır olanları sil", logic: "Delete rows where product weight is zero", category: "delete_rows", output: {"action":"delete_rows","condition":"weight equals 0","reply":"🗑️ Ürün ağırlığı sıfır olan satırlar silindi.","changes":[]} },
  { user_command: "çalışan departmanı sütununu büyük harfe çevir", logic: "Transform employee department column to uppercase", category: "transform", output: {"action":"transform","transform":"uppercase","reply":"✅ Çalışan departmanı sütunu büyük harfe dönüştürüldü.","changes":[]} },
  { user_command: "toplam nakliye ücreti nedir", logic: "Sum all values in shipping cost column", category: "sum", output: {"action":"sum","column":"Nakliye Ücreti","reply":"✅ Toplam nakliye ücreti hesaplandı.","changes":[]} },
  { user_command: "stok eşiği altındaki ürünleri kırmızıya boya", logic: "Highlight rows where stock is below threshold in red", category: "highlight", output: {"action":"highlight","condition":"below_threshold","color":"#FF0000","reply":"✅ Stok eşiği altındaki ürünler kırmızı ile işaretlendi.","changes":[]} },
  { user_command: "KDV oranı %18 olan satırları filtrele", logic: "Filter rows where KDV rate equals 18 percent", category: "filter", output: {"action":"filter","condition":"equals","column":"KDV Oranı","value":"%18","reply":"✅ KDV oranı %18 olan faturalar filtrelendi.","changes":[]} },
  { user_command: "yeni bir tedarik kalemi satırı ekle", logic: "Add a new empty row for supply item entry", category: "add_row", output: {"action":"add_row","reply":"➕ Yeni bir tedarik kalemi satırı eklendi.","changes":[]} },
  { user_command: "ortalama teslimat gününü hesapla", logic: "Calculate average delivery day count", category: "statistics", output: {"action":"average","column":"Teslimat Günü","reply":"✅ Ortalama teslimat günü hesaplandı.","changes":[]} },
  { user_command: "fatura tutarı 100000 üzerindeki kayıtları sarıya boya", logic: "Highlight rows where invoice amount exceeds 100000 in yellow", category: "highlight", output: {"action":"highlight","condition":"greater_than","color":"#FFFF00","reply":"✅ Fatura tutarı 100.000 üzerindeki kayıtlar sarıya boyandı.","changes":[]} },
  { user_command: "gelir vergisi stopaj toplamını göster", logic: "Sum total income tax withholding column", category: "sum", output: {"action":"sum","column":"Gelir Vergisi Stopajı","reply":"✅ Gelir vergisi stopaj toplamı hesaplandı.","changes":[]} },
  { user_command: "kargo durumu teslimatta olanları filtrele", logic: "Filter rows where cargo status is in delivery", category: "filter", output: {"action":"filter","condition":"equals","column":"Kargo Durumu","value":"Teslimatta","reply":"✅ Kargo durumu 'Teslimatta' olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "en düşük birim maliyet nedir", logic: "Find minimum value in unit cost column", category: "statistics", output: {"action":"min","column":"Birim Maliyet","reply":"✅ En düşük birim maliyet değeri bulundu.","changes":[]} },
  { user_command: "çalışan izin bakiyesi sütununu sırala", logic: "Sort employee leave balance column ascending", category: "sort", output: {"action":"sort","direction":"asc","column":"İzin Bakiyesi","reply":"✅ Çalışan izin bakiyesi küçükten büyüğe sıralandı.","changes":[]} },
  { user_command: "iade edilen ürün satırlarını vurgula", logic: "Highlight rows where product is returned", category: "highlight", output: {"action":"highlight","condition":"equals","color":"#FFD700","reply":"✅ İade edilen ürün satırları vurgulandı.","changes":[]} },
  { user_command: "tedarikçi teslim süresi 15 günü aşanları filtrele", logic: "Filter rows where supplier delivery time exceeds 15 days", category: "filter", output: {"action":"filter","condition":"greater_than","column":"Teslim Süresi","value":"15","reply":"✅ Teslim süresi 15 günü aşan tedarikçiler filtrelendi.","changes":[]} },
  { user_command: "toplam işçi SGK prim tutarını hesapla", logic: "Sum total employee SGK premium amount", category: "sum", output: {"action":"sum","column":"İşçi SGK Primi","reply":"✅ Toplam işçi SGK prim tutarı hesaplandı.","changes":[]} },
  { user_command: "stok fazlası olan ürünleri yeşile boya", logic: "Highlight rows with excess stock in green", category: "highlight", output: {"action":"highlight","condition":"excess_stock","color":"#00FF00","reply":"✅ Stok fazlası olan ürünler yeşile boyandı.","changes":[]} },
  { user_command: "müşteri bakiyesi negatif olanları listele", logic: "Filter rows where customer balance is negative", category: "filter", output: {"action":"filter","condition":"less_than","column":"Müşteri Bakiyesi","value":"0","reply":"✅ Müşteri bakiyesi negatif olan kayıtlar listelendi.","changes":[]} },
  { user_command: "en yüksek stopaj vergisini göster", logic: "Find maximum withholding tax value", category: "statistics", output: {"action":"max","column":"Stopaj Vergisi","reply":"✅ En yüksek stopaj vergisi değeri bulundu.","changes":[]} },
  { user_command: "ürün kodlarını küçük harfe çevir", logic: "Transform product codes to lowercase", category: "transform", output: {"action":"transform","transform":"lowercase","reply":"✅ Ürün kodları küçük harfe dönüştürüldü.","changes":[]} },
  { user_command: "onay bekleyen e-faturaları filtrele", logic: "Filter rows where e-invoice approval status is pending", category: "filter", output: {"action":"filter","condition":"equals","column":"Onay Durumu","value":"Beklemede","reply":"✅ Onay bekleyen e-faturalar filtrelendi.","changes":[]} },
  { user_command: "ortalama işveren SGK payını bul", logic: "Calculate average employer SGK contribution", category: "statistics", output: {"action":"average","column":"İşveren SGK Payı","reply":"✅ Ortalama işveren SGK payı hesaplandı.","changes":[]} },
  { user_command: "geçersiz vergi numaralı satırları vurgula", logic: "Highlight rows with invalid tax identification numbers in red", category: "highlight", output: {"action":"highlight","condition":"invalid_tax_number","color":"#FF0000","reply":"✅ Geçersiz vergi numarası içeren satırlar kırmızıyla işaretlendi.","changes":[]} },
  { user_command: "yeni bir e-fatura satırı ekle", logic: "Add a new empty row for e-invoice entry", category: "add_row", output: {"action":"add_row","reply":"➕ Yeni bir e-fatura satırı eklendi.","changes":[]} },
  { user_command: "depo çıkış miktarı sıfır olanları sil", logic: "Delete rows where warehouse exit quantity is zero", category: "delete_rows", output: {"action":"delete_rows","condition":"exit_quantity equals 0","reply":"🗑️ Depo çıkış miktarı sıfır olan satırlar silindi.","changes":[]} },
  { user_command: "satış hedefine ulaşanları yeşile boya", logic: "Highlight rows where sales target is achieved in green", category: "highlight", output: {"action":"highlight","condition":"target_achieved","color":"#00CC00","reply":"✅ Satış hedefine ulaşan kayıtlar yeşile boyandı.","changes":[]} },
  { user_command: "fatura türü e-arşiv olanları filtrele", logic: "Filter rows where invoice type is e-archive", category: "filter", output: {"action":"filter","condition":"equals","column":"Fatura Türü","value":"E-Arşiv","reply":"✅ Fatura türü e-arşiv olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "toplam damga vergisi tutarını hesapla", logic: "Sum total stamp duty tax amount", category: "sum", output: {"action":"sum","column":"Damga Vergisi","reply":"✅ Toplam damga vergisi tutarı hesaplandı.","changes":[]} },
  { user_command: "sipariş adedi en fazla olan müşteriyi bul", logic: "Find customer with maximum order quantity", category: "statistics", output: {"action":"max","column":"Sipariş Adedi","reply":"✅ En fazla sipariş adedi olan müşteri bulundu.","changes":[]} },
  { user_command: "çalışan soyadları sütununu büyük harfe çevir", logic: "Transform employee surname column to uppercase", category: "transform", output: {"action":"transform","transform":"uppercase","reply":"✅ Çalışan soyadları büyük harfe dönüştürüldü.","changes":[]} },
  { user_command: "stok miktarı 100 ile 500 arasındakileri filtrele", logic: "Filter rows where stock quantity is between 100 and 500", category: "filter", output: {"action":"filter","condition":"between","column":"Stok Miktarı","value":"100-500","reply":"✅ Stok miktarı 100 ile 500 arasındaki ürünler filtrelendi.","changes":[]} },
  { user_command: "yeni bir bordro satırı ekle", logic: "Add a new empty row for payroll entry", category: "add_row", output: {"action":"add_row","reply":"➕ Yeni bir bordro satırı eklendi.","changes":[]} },
  { user_command: "amortisman tutarı en yüksek varlığı göster", logic: "Find asset with maximum depreciation amount", category: "statistics", output: {"action":"max","column":"Amortisman Tutarı","reply":"✅ Amortisman tutarı en yüksek varlık bulundu.","changes":[]} },
  { user_command: "ödeme yöntemi kredi kartı olanları filtrele", logic: "Filter rows where payment method is credit card", category: "filter", output: {"action":"filter","condition":"equals","column":"Ödeme Yöntemi","value":"Kredi Kartı","reply":"✅ Ödeme yöntemi kredi kartı olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "birim fiyat sütununu küçükten büyüğe sırala", logic: "Sort unit price column ascending", category: "sort", output: {"action":"sort","direction":"asc","column":"Birim Fiyat","reply":"✅ Birim fiyat sütunu küçükten büyüğe sıralandı.","changes":[]} },
  { user_command: "toplam işveren SGK payını hesapla", logic: "Sum total employer SGK contribution amount", category: "sum", output: {"action":"sum","column":"İşveren SGK Payı","reply":"✅ Toplam işveren SGK payı hesaplandı.","changes":[]} },
  { user_command: "müşteri tipi kurumsal olanları vurgula", logic: "Highlight rows where customer type is corporate in blue", category: "highlight", output: {"action":"highlight","condition":"equals","color":"#0000FF","reply":"✅ Müşteri tipi kurumsal olan kayıtlar mavi ile vurgulandı.","changes":[]} },
  { user_command: "aktif tedarikçi sayısını say", logic: "Count rows where supplier status is active", category: "count", output: {"action":"count","column":"Tedarikçi Durumu","reply":"✅ Aktif tedarikçi sayısı hesaplandı.","changes":[]} },
  { user_command: "vergi kimlik numarası boş olanları sil", logic: "Delete rows where tax identification number is empty", category: "delete_rows", output: {"action":"delete_rows","condition":"tax_id is empty","reply":"🗑️ Vergi kimlik numarası boş olan satırlar silindi.","changes":[]} },
  { user_command: "ürün grubu gıda olanları filtrele", logic: "Filter rows where product group is food", category: "filter", output: {"action":"filter","condition":"equals","column":"Ürün Grubu","value":"Gıda","reply":"✅ Ürün grubu 'Gıda' olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "KDV dahil toplam fatura tutarını hesapla", logic: "Sum total invoice amount including KDV", category: "sum", output: {"action":"sum","column":"KDV Dahil Tutar","reply":"✅ KDV dahil toplam fatura tutarı hesaplandı.","changes":[]} },
  { user_command: "en düşük amortisman tutarını bul", logic: "Find minimum depreciation amount value", category: "statistics", output: {"action":"min","column":"Amortisman Tutarı","reply":"✅ En düşük amortisman tutarı bulundu.","changes":[]} },
  { user_command: "satış kanalı mağaza olanları filtrele", logic: "Filter rows where sales channel is store", category: "filter", output: {"action":"filter","condition":"equals","column":"Satış Kanalı","value":"Mağaza","reply":"✅ Satış kanalı mağaza olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "depo bölgesi adlarını büyük harfe çevir", logic: "Transform warehouse region names to uppercase", category: "transform", output: {"action":"transform","transform":"uppercase","reply":"✅ Depo bölgesi adları büyük harfe dönüştürüldü.","changes":[]} },
  { user_command: "ortalama KDV matrahını hesapla", logic: "Calculate average KDV base amount", category: "statistics", output: {"action":"average","column":"KDV Matrahı","reply":"✅ Ortalama KDV matrahı hesaplandı.","changes":[]} },
  { user_command: "yeni bir stok hareketi satırı ekle", logic: "Add a new empty row for stock movement entry", category: "add_row", output: {"action":"add_row","reply":"➕ Yeni bir stok hareketi satırı eklendi.","changes":[]} },
  { user_command: "fatura tutarı en küçük kaydı bul", logic: "Find minimum invoice amount value", category: "statistics", output: {"action":"min","column":"Fatura Tutarı","reply":"✅ En küçük fatura tutarı bulundu.","changes":[]} },
  { user_command: "tedarikçi ülkesi Çin olanları filtrele", logic: "Filter rows where supplier country is China", category: "filter", output: {"action":"filter","condition":"equals","column":"Tedarikçi Ülkesi","value":"Çin","reply":"✅ Tedarikçi ülkesi Çin olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "tüm hücrelerdeki baştaki boşlukları temizle", logic: "Trim leading and trailing spaces from all cells", category: "transform", output: {"action":"transform","transform":"trim","reply":"✅ Tüm hücrelerdeki baş ve son boşluklar temizlendi.","changes":[]} },
  { user_command: "kargo ücreti en yüksek rotayı bul", logic: "Find maximum shipping cost route", category: "statistics", output: {"action":"max","column":"Kargo Ücreti","reply":"✅ Kargo ücreti en yüksek rota bulundu.","changes":[]} },
  { user_command: "satış miktarı ortalamasını hesapla", logic: "Calculate average sales quantity", category: "statistics", output: {"action":"average","column":"Satış Miktarı","reply":"✅ Satış miktarı ortalaması hesaplandı.","changes":[]} },
  { user_command: "depo kapasitesi dolmuş olanları kırmızıya boya", logic: "Highlight rows where warehouse capacity is full in red", category: "highlight", output: {"action":"highlight","condition":"capacity_full","color":"#FF0000","reply":"✅ Depo kapasitesi dolmuş kayıtlar kırmızıya boyandı.","changes":[]} },
  { user_command: "çalışan işe giriş tarihine göre sırala", logic: "Sort employee hire date column ascending", category: "sort", output: {"action":"sort","direction":"asc","column":"İşe Giriş Tarihi","reply":"✅ Çalışanlar işe giriş tarihine göre sıralandı.","changes":[]} },
  { user_command: "toplam amortisman giderini topla", logic: "Sum total depreciation expense column", category: "sum", output: {"action":"sum","column":"Amortisman Gideri","reply":"✅ Toplam amortisman gideri hesaplandı.","changes":[]} },
  { user_command: "SGK prim günü 30'dan az olanları filtrele", logic: "Filter rows where SGK premium days are less than 30", category: "filter", output: {"action":"filter","condition":"less_than","column":"SGK Prim Günü","value":"30","reply":"✅ SGK prim günü 30'dan az olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "ortalama birim fiyatı hesapla", logic: "Calculate average unit price", category: "statistics", output: {"action":"average","column":"Birim Fiyat","reply":"✅ Ortalama birim fiyat hesaplandı.","changes":[]} },
  { user_command: "müşteri segmenti VIP olanları maviye boya", logic: "Highlight rows where customer segment is VIP in blue", category: "highlight", output: {"action":"highlight","condition":"equals","color":"#0000FF","reply":"✅ VIP müşteri segmentindeki kayıtlar maviye boyandı.","changes":[]} },
  { user_command: "silinmiş olarak işaretli fatura satırlarını kaldır", logic: "Delete rows marked as deleted in invoice table", category: "delete_rows", output: {"action":"delete_rows","condition":"status equals deleted","reply":"🗑️ Silinmiş olarak işaretli fatura satırları kaldırıldı.","changes":[]} },
  { user_command: "ürün açıklama sütununu baş harfleri büyük yap", logic: "Transform product description column to title case", category: "transform", output: {"action":"transform","transform":"titlecase","reply":"✅ Ürün açıklama sütunu baş harfleri büyük olacak şekilde düzenlendi.","changes":[]} },
  { user_command: "toplam ihracat fatura tutarını hesapla", logic: "Sum total export invoice amount column", category: "sum", output: {"action":"sum","column":"İhracat Fatura Tutarı","reply":"✅ Toplam ihracat fatura tutarı hesaplandı.","changes":[]} },
  { user_command: "bekleyen talep sayısını say", logic: "Count rows where request status is pending", category: "count", output: {"action":"count","column":"Talep Durumu","reply":"✅ Bekleyen talep sayısı hesaplandı.","changes":[]} },
  { user_command: "satış temsilcisi adını sırala", logic: "Sort sales representative name column alphabetically ascending", category: "sort", output: {"action":"sort","direction":"asc","column":"Satış Temsilcisi","reply":"✅ Satış temsilcisi adları alfabetik sıralandı.","changes":[]} },
  { user_command: "teslim edilmeyen siparişleri turuncu yap", logic: "Highlight undelivered order rows in orange", category: "highlight", output: {"action":"highlight","condition":"not_delivered","color":"#FFA500","reply":"✅ Teslim edilmeyen siparişler turuncu ile işaretlendi.","changes":[]} },
  { user_command: "minimum KDV tutarını bul", logic: "Find minimum KDV amount value", category: "statistics", output: {"action":"min","column":"KDV Tutarı","reply":"✅ Minimum KDV tutarı bulundu.","changes":[]} },
  { user_command: "çalışma saati 40'ın üzerindeki satırları filtrele", logic: "Filter rows where working hours exceed 40", category: "filter", output: {"action":"filter","condition":"greater_than","column":"Çalışma Saati","value":"40","reply":"✅ Çalışma saati 40'ın üzerindeki kayıtlar filtrelendi.","changes":[]} },
  { user_command: "yeni bir cari hesap satırı ekle", logic: "Add a new empty row for current account entry", category: "add_row", output: {"action":"add_row","reply":"➕ Yeni bir cari hesap satırı eklendi.","changes":[]} },
  { user_command: "toplam iade tutarını hesapla", logic: "Sum total return amount column", category: "sum", output: {"action":"sum","column":"İade Tutarı","reply":"✅ Toplam iade tutarı hesaplandı.","changes":[]} },
  { user_command: "raf ömrü 30 günden az kalan ürünleri kırmızıya boya", logic: "Highlight products with shelf life less than 30 days in red", category: "highlight", output: {"action":"highlight","condition":"shelf_life_less_than_30","color":"#FF0000","reply":"✅ Raf ömrü 30 günden az kalan ürünler kırmızıya boyandı.","changes":[]} },
  { user_command: "hesap kodu sütununu büyükten küçüğe sırala", logic: "Sort account code column descending", category: "sort", output: {"action":"sort","direction":"desc","column":"Hesap Kodu","reply":"✅ Hesap kodu sütunu büyükten küçüğe sıralandı.","changes":[]} },
  { user_command: "borç bakiyesi 5000 üzeri olanları vurgula", logic: "Highlight rows where debit balance exceeds 5000", category: "highlight", output: {"action":"highlight","condition":"greater_than","color":"#FF4444","reply":"✅ Borç bakiyesi 5000 üzeri olan kayıtlar vurgulandı.","changes":[]} },
  { user_command: "tekrarlanan cari hesap numaralarını temizle", logic: "Remove duplicate current account numbers", category: "remove_duplicates", output: {"action":"remove_duplicates","reply":"✅ Tekrarlanan cari hesap numaraları temizlendi.","changes":[]} },
  { user_command: "tüm filtreleri kaldır", logic: "Remove all active filters from the table", category: "remove_filter", output: {"action":"remove_filter","reply":"✅ Tüm filtreler kaldırıldı, veriler tam görünüm olarak gösteriliyor.","changes":[]} },
  { user_command: "kaç farklı tedarikçi var", logic: "Count unique supplier names in supplier column", category: "count", output: {"action":"count","column":"Tedarikçi Adı","reply":"✅ Farklı tedarikçi sayısı hesaplandı.","changes":[]} },
  { user_command: "teslim adresi boş olanları sarıya boya", logic: "Highlight rows where delivery address is empty in yellow", category: "highlight", output: {"action":"highlight","condition":"is_empty","color":"#FFFF00","reply":"✅ Teslim adresi boş olan satırlar sarıya boyandı.","changes":[]} },
  { user_command: "toplam komisyon tutarını hesapla", logic: "Sum total commission amount column", category: "sum", output: {"action":"sum","column":"Komisyon Tutarı","reply":"✅ Toplam komisyon tutarı hesaplandı.","changes":[]} },
  { user_command: "ürün ağırlığı sütununu küçükten büyüğe sırala", logic: "Sort product weight column ascending", category: "sort", output: {"action":"sort","direction":"asc","column":"Ürün Ağırlığı","reply":"✅ Ürün ağırlığı sütunu küçükten büyüğe sıralandı.","changes":[]} },
  { user_command: "satış bölgesi ege olanları filtrele", logic: "Filter rows where sales region is Aegean", category: "filter", output: {"action":"filter","condition":"equals","column":"Satış Bölgesi","value":"Ege","reply":"✅ Satış bölgesi Ege olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "fiyat boş olan satırları sil", logic: "Delete rows where price column is empty", category: "delete_rows", output: {"action":"delete_rows","condition":"price is empty","reply":"🗑️ Fiyat bilgisi boş olan satırlar silindi.","changes":[]} },

  // ──────────────────────────────────────────────────────────
  // AUTO-GENERATED 2026-06-06
  // ──────────────────────────────────────────────────────────
  { user_command: "bölge müdürü olanları filtrele", logic: "Filter rows where position/title column equals 'Bölge Müdürü'", category: "filter", output: {"action":"filter","condition":"equals","column":"Unvan","value":"Bölge Müdürü","reply":"✅ Unvan sütununda 'Bölge Müdürü' olanlar filtrelendi.","changes":[]} },
  { user_command: "net kâr sütununu topla", logic: "Sum all values in the net profit column", category: "sum", output: {"action":"sum","column":"Net Kâr","reply":"✅ Net Kâr sütununun toplamı hesaplandı.","changes":[]} },
  { user_command: "fatura kesim saatine göre sırala", logic: "Sort rows by invoice creation time column ascending", category: "sort", output: {"action":"sort","direction":"asc","column":"Fatura Kesim Saati","reply":"✅ Fatura Kesim Saati sütunu artan sıraya göre sıralandı.","changes":[]} },
  { user_command: "depo giriş miktarı en yüksek ürünü bul", logic: "Find the row with the maximum value in the warehouse entry quantity column", category: "max", output: {"action":"max","column":"Depo Giriş Miktarı","reply":"✅ Depo giriş miktarı en yüksek ürün bulundu.","changes":[]} },
  { user_command: "SGK matrahı sütununun ortalamasını hesapla", logic: "Calculate the average of the SGK base amount column", category: "average", output: {"action":"average","column":"SGK Matrahı","reply":"✅ SGK Matrahı sütununun ortalaması hesaplandı.","changes":[]} },
  { user_command: "e-fatura iptal olanları griye boya", logic: "Highlight rows where e-invoice status is 'İptal' with grey color", category: "highlight", output: {"action":"highlight","condition":"equals","color":"#808080","reply":"✅ E-fatura durumu 'İptal' olan satırlar griye boyandı.","changes":[]} },
  { user_command: "stok giriş tarihi sütununu en yeniden en eskiye sırala", logic: "Sort stock entry date column from newest to oldest (descending)", category: "sort", output: {"action":"sort","direction":"desc","column":"Stok Giriş Tarihi","reply":"✅ Stok Giriş Tarihi sütunu en yeniden en eskiye sıralandı.","changes":[]} },
  { user_command: "tedarikçi fiyat teklifi boş olanları sarıya boya", logic: "Highlight rows where supplier price offer column is empty with yellow color", category: "highlight", output: {"action":"highlight","condition":"is_empty","color":"#FFD700","reply":"✅ Tedarikçi fiyat teklifi boş olan satırlar sarıya boyandı.","changes":[]} },
  { user_command: "çalışan kıdem yılı 5 ve üzeri olanları filtrele", logic: "Filter rows where employee seniority year is greater than or equal to 5", category: "filter", output: {"action":"filter","condition":"greater_than_or_equal","column":"Kıdem Yılı","value":"5","reply":"✅ Kıdem yılı 5 ve üzeri olan çalışanlar filtrelendi.","changes":[]} },
  { user_command: "tüm ürün adlarının baş harflerini büyüt", logic: "Transform product name column to title case (capitalize first letter of each word)", category: "transform", output: {"action":"transform","transform":"titlecase","reply":"✅ Tüm ürün adlarının baş harfleri büyütüldü.","changes":[]} },
  { user_command: "damga vergisi sütununu topla", logic: "Sum all values in the stamp tax column", category: "sum", output: {"action":"sum","column":"Damga Vergisi","reply":"✅ Damga Vergisi sütununun toplamı hesaplandı.","changes":[]} },
  { user_command: "satış kanalı toptan olanları filtrele", logic: "Filter rows where sales channel column equals 'Toptan'", category: "filter", output: {"action":"filter","condition":"equals","column":"Satış Kanalı","value":"Toptan","reply":"✅ Satış kanalı 'Toptan' olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "brüt kâr oranı ortalamasını hesapla", logic: "Calculate the average of the gross profit margin column", category: "average", output: {"action":"average","column":"Brüt Kâr Oranı","reply":"✅ Brüt Kâr Oranı sütununun ortalaması hesaplandı.","changes":[]} },
  { user_command: "KDV matrahı 50000 üzerindeki faturaları vurgula", logic: "Highlight rows where KDV base amount column is greater than 50000 with orange color", category: "highlight", output: {"action":"highlight","condition":"greater_than","color":"#FFA500","reply":"✅ KDV matrahı 50.000'den fazla olan faturalar vurgulandı.","changes":[]} },
  { user_command: "yeni bir tedarikçi ödeme satırı ekle", logic: "Add a new empty row for a supplier payment record", category: "add_row", output: {"action":"add_row","reply":"➕ Yeni bir tedarikçi ödeme satırı eklendi.","changes":[]} },
  { user_command: "sipariş durumu iptal olanları sil", logic: "Delete rows where order status column equals 'İptal'", category: "delete_rows", output: {"action":"delete_rows","condition":"equals 'İptal' in Sipariş Durumu column","reply":"🗑️ Sipariş durumu 'İptal' olan satırlar silindi.","changes":[]} },
  { user_command: "ürün birim fiyatının ortalamasını hesapla", logic: "Calculate the average unit price from the unit price column", category: "average", output: {"action":"average","column":"Birim Fiyat","reply":"✅ Birim Fiyat sütununun ortalaması hesaplandı.","changes":[]} },
  { user_command: "çalışma günü 20'den az olanları kırmızıya boya", logic: "Highlight rows where working days column is less than 20 with red color", category: "highlight", output: {"action":"highlight","condition":"less_than","color":"#FF0000","reply":"✅ Çalışma günü 20'den az olan satırlar kırmızıya boyandı.","changes":[]} },
  { user_command: "müşteri bakiyesi sütununu büyükten küçüğe sırala", logic: "Sort customer balance column in descending order", category: "sort", output: {"action":"sort","direction":"desc","column":"Müşteri Bakiyesi","reply":"✅ Müşteri Bakiyesi sütunu büyükten küçüğe sıralandı.","changes":[]} },
  { user_command: "tekrarlanan tedarikçi vergi numaralarını kaldır", logic: "Remove duplicate rows based on supplier tax number column", category: "remove_duplicates", output: {"action":"remove_duplicates","reply":"✅ Tekrarlanan tedarikçi vergi numaraları kaldırıldı.","changes":[]} },
  { user_command: "stopaj oranı sütununu küçükten büyüğe sırala", logic: "Sort withholding tax rate column in ascending order", category: "sort", output: {"action":"sort","direction":"asc","column":"Stopaj Oranı","reply":"✅ Stopaj Oranı sütunu küçükten büyüğe sıralandı.","changes":[]} },
  { user_command: "kargo ücreti sütununu topla", logic: "Sum all values in the shipping fee column", category: "sum", output: {"action":"sum","column":"Kargo Ücreti","reply":"✅ Kargo Ücreti sütununun toplamı hesaplandı.","changes":[]} },
  { user_command: "teslim durumu tamamlandı olanları yeşile boya", logic: "Highlight rows where delivery status column equals 'Tamamlandı' with green color", category: "highlight", output: {"action":"highlight","condition":"equals","color":"#00FF00","reply":"✅ Teslim durumu 'Tamamlandı' olan satırlar yeşile boyandı.","changes":[]} },
  { user_command: "bölge sütununu büyük harfe çevir", logic: "Transform region column to uppercase", category: "transform", output: {"action":"transform","transform":"uppercase","reply":"✅ Bölge sütunundaki tüm değerler büyük harfe çevrildi.","changes":[]} },
  { user_command: "minimum KDV matrahını göster", logic: "Find the minimum value in the KDV base amount column", category: "min", output: {"action":"min","column":"KDV Matrahı","reply":"✅ KDV Matrahı sütununun en küçük değeri bulundu.","changes":[]} },
  { user_command: "fatura türü e-fatura olanların toplamını hesapla", logic: "Sum invoice amounts where invoice type column equals 'e-Fatura'", category: "sum", output: {"action":"sum","column":"Fatura Tutarı","reply":"✅ Fatura türü 'e-Fatura' olan kayıtların toplam tutarı hesaplandı.","changes":[]} },
  { user_command: "vergi dairesi sütununu küçük harfe çevir", logic: "Transform tax office column to lowercase", category: "transform", output: {"action":"transform","transform":"lowercase","reply":"✅ Vergi Dairesi sütunundaki tüm değerler küçük harfe çevrildi.","changes":[]} },
  { user_command: "sipariş miktarı en az olan ürünü göster", logic: "Find the row with the minimum value in the order quantity column", category: "min", output: {"action":"min","column":"Sipariş Miktarı","reply":"✅ Sipariş miktarı en az olan ürün bulundu.","changes":[]} },
  { user_command: "yeni bir cari hesap hareketi satırı ekle", logic: "Add a new empty row for a current account transaction", category: "add_row", output: {"action":"add_row","reply":"➕ Yeni bir cari hesap hareketi satırı eklendi.","changes":[]} },
  { user_command: "SGK prim tutarı sütununun toplamını hesapla", logic: "Sum all values in the SGK premium amount column", category: "sum", output: {"action":"sum","column":"SGK Prim Tutarı","reply":"✅ SGK Prim Tutarı sütununun toplamı hesaplandı.","changes":[]} },
  { user_command: "çalışan unvanı müdür olanları filtrele", logic: "Filter rows where employee title column contains 'Müdür'", category: "filter", output: {"action":"filter","condition":"contains","column":"Unvan","value":"Müdür","reply":"✅ Unvanı 'Müdür' olan çalışanlar filtrelendi.","changes":[]} },
  { user_command: "iskonto tutarı sütununu büyükten küçüğe sırala", logic: "Sort discount amount column in descending order", category: "sort", output: {"action":"sort","direction":"desc","column":"İskonto Tutarı","reply":"✅ İskonto Tutarı sütunu büyükten küçüğe sıralandı.","changes":[]} },
  { user_command: "boş vergi numaralı satırları sarıya boya", logic: "Highlight rows where tax number column is empty with yellow color", category: "highlight", output: {"action":"highlight","condition":"is_empty","color":"#FFD700","reply":"✅ Vergi numarası boş olan satırlar sarıya boyandı.","changes":[]} },
  { user_command: "amortisman oranı sütununun ortalamasını hesapla", logic: "Calculate the average of the depreciation rate column", category: "average", output: {"action":"average","column":"Amortisman Oranı","reply":"✅ Amortisman Oranı sütununun ortalaması hesaplandı.","changes":[]} },
  { user_command: "tekrarlanan banka hesap numaralarını temizle", logic: "Remove duplicate rows based on bank account number column", category: "remove_duplicates", output: {"action":"remove_duplicates","reply":"✅ Tekrarlanan banka hesap numaraları temizlendi.","changes":[]} },
  { user_command: "ödeme vadesi geçmiş satırları turuncu yap", logic: "Highlight rows where payment due date has passed (is before today) with orange color", category: "highlight", output: {"action":"highlight","condition":"date_past","color":"#FFA500","reply":"✅ Ödeme vadesi geçmiş satırlar turuncu yapıldı.","changes":[]} },
  { user_command: "depo kodu sütununu büyük harfe çevir", logic: "Transform warehouse code column to uppercase", category: "transform", output: {"action":"transform","transform":"uppercase","reply":"✅ Depo Kodu sütunundaki tüm değerler büyük harfe çevrildi.","changes":[]} },
  { user_command: "net satış tutarı en yüksek müşteriyi göster", logic: "Find the row with the maximum value in the net sales amount column", category: "max", output: {"action":"max","column":"Net Satış Tutarı","reply":"✅ Net satış tutarı en yüksek müşteri bulundu.","changes":[]} },
  { user_command: "yeni bir ambar hareketi satırı ekle", logic: "Add a new empty row for a warehouse movement record", category: "add_row", output: {"action":"add_row","reply":"➕ Yeni bir ambar hareketi satırı eklendi.","changes":[]} },
  { user_command: "kâr marjı negatif olanları kırmızıya boya", logic: "Highlight rows where profit margin column is less than 0 with red color", category: "highlight", output: {"action":"highlight","condition":"less_than","color":"#FF0000","reply":"✅ Kâr marjı negatif olan satırlar kırmızıya boyandı.","changes":[]} },
  { user_command: "gelir vergisi stopajı sütununun ortalamasını bul", logic: "Calculate the average of the income tax withholding column", category: "average", output: {"action":"average","column":"Gelir Vergisi Stopajı","reply":"✅ Gelir Vergisi Stopajı sütununun ortalaması hesaplandı.","changes":[]} },
  { user_command: "müşteri türü perakende olanları filtrele", logic: "Filter rows where customer type column equals 'Perakende'", category: "filter", output: {"action":"filter","condition":"equals","column":"Müşteri Türü","value":"Perakende","reply":"✅ Müşteri türü 'Perakende' olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "toplam komisyon gelirini hesapla", logic: "Sum all values in the commission income column", category: "sum", output: {"action":"sum","column":"Komisyon Geliri","reply":"✅ Toplam komisyon geliri hesaplandı.","changes":[]} },
  { user_command: "stok çıkış tarihi sütununu artan sıraya göre sırala", logic: "Sort stock exit date column in ascending order", category: "sort", output: {"action":"sort","direction":"asc","column":"Stok Çıkış Tarihi","reply":"✅ Stok Çıkış Tarihi sütunu artan sırayla sıralandı.","changes":[]} },
  { user_command: "sipariş numarası boş olanları sil", logic: "Delete rows where order number column is empty", category: "delete_rows", output: {"action":"delete_rows","condition":"is_empty in Sipariş Numarası column","reply":"🗑️ Sipariş numarası boş olan satırlar silindi.","changes":[]} },
  { user_command: "bitiş tarihi geçmiş sözleşmeleri filtrele", logic: "Filter rows where contract end date has already passed", category: "filter", output: {"action":"filter","condition":"date_past","column":"Sözleşme Bitiş Tarihi","value":"today","reply":"✅ Bitiş tarihi geçmiş sözleşmeler filtrelendi.","changes":[]} },
  { user_command: "tahsilat tutarı sütununu büyükten küçüğe sırala", logic: "Sort collection amount column in descending order", category: "sort", output: {"action":"sort","direction":"desc","column":"Tahsilat Tutarı","reply":"✅ Tahsilat Tutarı sütunu büyükten küçüğe sıralandı.","changes":[]} },
  { user_command: "hatalı IBAN içeren satırları sil", logic: "Delete rows where IBAN column contains invalid/malformed IBAN values", category: "delete_rows", output: {"action":"delete_rows","condition":"invalid IBAN format in IBAN column","reply":"🗑️ Hatalı IBAN içeren satırlar silindi.","changes":[]} },
  { user_command: "yeni bir iade faturası satırı ekle", logic: "Add a new empty row for a return invoice record", category: "add_row", output: {"action":"add_row","reply":"➕ Yeni bir iade faturası satırı eklendi.","changes":[]} },
  { user_command: "brüt ücret sütununu küçükten büyüğe sırala", logic: "Sort gross salary column in ascending order", category: "sort", output: {"action":"sort","direction":"asc","column":"Brüt Ücret","reply":"✅ Brüt Ücret sütunu küçükten büyüğe sıralandı.","changes":[]} },
  { user_command: "ürün açıklaması boş olan satırları vurgula", logic: "Highlight rows where product description column is empty with yellow color", category: "highlight", output: {"action":"highlight","condition":"is_empty","color":"#FFD700","reply":"✅ Ürün açıklaması boş olan satırlar sarıyla vurgulandı.","changes":[]} },
  { user_command: "toplam ihracat gelirini hesapla", logic: "Sum all values in the export revenue column", category: "sum", output: {"action":"sum","column":"İhracat Geliri","reply":"✅ Toplam ihracat geliri hesaplandı.","changes":[]} },
  { user_command: "depo kapasitesi doluluk oranı ortalamasını hesapla", logic: "Calculate the average of the warehouse capacity utilization rate column", category: "average", output: {"action":"average","column":"Doluluk Oranı","reply":"✅ Depo doluluk oranı sütununun ortalaması hesaplandı.","changes":[]} },
  { user_command: "satış temsilcisi adı sütununu alfabetik sırala", logic: "Sort sales representative name column alphabetically (A to Z)", category: "sort", output: {"action":"sort","direction":"asc","column":"Satış Temsilcisi","reply":"✅ Satış Temsilcisi sütunu alfabetik olarak sıralandı.","changes":[]} },
  { user_command: "izin bakiyesi 0 olanları sarıya boya", logic: "Highlight rows where leave balance column equals 0 with yellow color", category: "highlight", output: {"action":"highlight","condition":"equals","color":"#FFD700","reply":"✅ İzin bakiyesi 0 olan çalışanlar sarıya boyandı.","changes":[]} },
  { user_command: "borç sütununda en yüksek değeri bul", logic: "Find the maximum value in the debt column", category: "max", output: {"action":"max","column":"Borç","reply":"✅ Borç sütununun en yüksek değeri bulundu.","changes":[]} },
  { user_command: "tekrarlanan sipariş numaralarını temizle", logic: "Remove duplicate rows based on order number column", category: "remove_duplicates", output: {"action":"remove_duplicates","reply":"✅ Tekrarlanan sipariş numaraları temizlendi.","changes":[]} },
  { user_command: "tüm tutarları KDV hariç olarak güncelle", logic: "Update all price cells by dividing by 1.18 or 1.20 to get KDV-exclusive amounts", category: "update_cells", output: {"action":"update_cells","formula":"=Tutar/1.18","reply":"✅ Tüm tutarlar KDV hariç değerlere güncellendi.","changes":[]} },
  { user_command: "müşteri ili sütununu büyük harfe çevir", logic: "Transform customer city/province column to uppercase", category: "transform", output: {"action":"transform","transform":"uppercase","reply":"✅ Müşteri ili sütunundaki tüm değerler büyük harfe çevrildi.","changes":[]} },
  { user_command: "iade miktarı sütununu topla", logic: "Sum all values in the return quantity column", category: "sum", output: {"action":"sum","column":"İade Miktarı","reply":"✅ İade Miktarı sütununun toplamı hesaplandı.","changes":[]} },
  { user_command: "fatura tipi proforma olanları filtrele", logic: "Filter rows where invoice type column equals 'Proforma'", category: "filter", output: {"action":"filter","condition":"equals","column":"Fatura Tipi","value":"Proforma","reply":"✅ Fatura tipi 'Proforma' olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "stok rezerve miktarı sütununun ortalamasını bul", logic: "Calculate the average of the reserved stock quantity column", category: "average", output: {"action":"average","column":"Rezerve Miktar","reply":"✅ Rezerve Miktar sütununun ortalaması hesaplandı.","changes":[]} },
  { user_command: "yeni bir vergi kaydı satırı ekle", logic: "Add a new empty row for a tax record", category: "add_row", output: {"action":"add_row","reply":"➕ Yeni bir vergi kaydı satırı eklendi.","changes":[]} },
  { user_command: "aktif tedarikçi sözleşmelerini listele", logic: "Filter rows where supplier contract status column is active", category: "filter", output: {"action":"filter","condition":"equals","column":"Sözleşme Durumu","value":"Aktif","reply":"✅ Aktif tedarikçi sözleşmeleri listelendi.","changes":[]} },
  { user_command: "gider kategorisi personel olanların toplamını hesapla", logic: "Sum expense amounts where expense category column equals 'Personel'", category: "sum", output: {"action":"sum","column":"Gider Tutarı","reply":"✅ Personel gider kategorisinin toplam tutarı hesaplandı.","changes":[]} },
  { user_command: "işveren SGK prim tutarını topla", logic: "Sum all values in the employer SGK premium column", category: "sum", output: {"action":"sum","column":"İşveren SGK Primi","reply":"✅ İşveren SGK Prim Tutarı sütununun toplamı hesaplandı.","changes":[]} },
  { user_command: "stok değeri en düşük ürünü göster", logic: "Find the row with the minimum value in the stock value column", category: "min", output: {"action":"min","column":"Stok Değeri","reply":"✅ Stok değeri en düşük ürün bulundu.","changes":[]} },
  { user_command: "ürün kategorisi giyim olanları filtrele", logic: "Filter rows where product category column equals 'Giyim'", category: "filter", output: {"action":"filter","condition":"equals","column":"Ürün Kategorisi","value":"Giyim","reply":"✅ Ürün kategorisi 'Giyim' olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "tüm fiyat sütunlarındaki boş değerleri 0 ile doldur", logic: "Update all empty cells in price columns with value 0", category: "update_cells", output: {"action":"update_cells","formula":"IF(ISBLANK(cell),0,cell)","reply":"✅ Fiyat sütunundaki tüm boş değerler 0 ile dolduruldu.","changes":[]} },
  { user_command: "gelir tablosu net kâr sütununu topla", logic: "Sum all values in the income statement net profit column", category: "sum", output: {"action":"sum","column":"Net Kâr","reply":"✅ Gelir tablosu Net Kâr sütununun toplamı hesaplandı.","changes":[]} },
  { user_command: "son 6 aydaki kayıtları filtrele", logic: "Filter rows where date column is within the last 6 months", category: "filter", output: {"action":"filter","condition":"last_n_months","column":"Tarih","value":"6","reply":"✅ Son 6 aya ait kayıtlar filtrelendi.","changes":[]} },
  { user_command: "maliyet merkezi sütununu büyük harfe çevir", logic: "Transform cost center column to uppercase", category: "transform", output: {"action":"transform","transform":"uppercase","reply":"✅ Maliyet Merkezi sütunundaki tüm değerler büyük harfe çevrildi.","changes":[]} },
  { user_command: "tekrarlanan hesap kodu satırlarını kaldır", logic: "Remove duplicate rows based on account code column", category: "remove_duplicates", output: {"action":"remove_duplicates","reply":"✅ Tekrarlanan hesap kodu satırları kaldırıldı.","changes":[]} },
  { user_command: "en yüksek amortisman tutarını göster", logic: "Find the maximum value in the depreciation amount column", category: "max", output: {"action":"max","column":"Amortisman Tutarı","reply":"✅ Amortisman Tutarı sütununun en yüksek değeri bulundu.","changes":[]} },
  { user_command: "çalışan işten çıkış tarihi boş olanları filtrele", logic: "Filter rows where employee exit date column is empty (currently employed)", category: "filter", output: {"action":"filter","condition":"is_empty","column":"İşten Çıkış Tarihi","value":"","reply":"✅ İşten çıkış tarihi boş (halen çalışan) kayıtlar filtrelendi.","changes":[]} },
  { user_command: "yeni bir maliyet kalemi satırı ekle", logic: "Add a new empty row for a cost item", category: "add_row", output: {"action":"add_row","reply":"➕ Yeni bir maliyet kalemi satırı eklendi.","changes":[]} },
  { user_command: "nakliye firması sütununu alfabetik sırala", logic: "Sort shipping company column alphabetically in ascending order", category: "sort", output: {"action":"sort","direction":"asc","column":"Nakliye Firması","reply":"✅ Nakliye Firması sütunu alfabetik olarak sıralandı.","changes":[]} },
  { user_command: "KDV %18 olan ürünlerin toplamını hesapla", logic: "Sum product amounts where KDV rate column equals 18", category: "sum", output: {"action":"sum","column":"Tutar","reply":"✅ KDV oranı %18 olan ürünlerin toplam tutarı hesaplandı.","changes":[]} },
  { user_command: "çalışan maaş zammı oranı ortalamasını bul", logic: "Calculate the average of the salary raise rate column", category: "average", output: {"action":"average","column":"Zam Oranı","reply":"✅ Zam Oranı sütununun ortalaması hesaplandı.","changes":[]} },
  { user_command: "onay bekleyen talepleri sarıya boya", logic: "Highlight rows where request status column equals 'Onay Bekliyor' with yellow color", category: "highlight", output: {"action":"highlight","condition":"equals","color":"#FFD700","reply":"✅ Onay bekleyen talepler sarıya boyandı.","changes":[]} },
  { user_command: "ürün raf kodu sütununu büyük harfe çevir", logic: "Transform product shelf code column to uppercase", category: "transform", output: {"action":"transform","transform":"uppercase","reply":"✅ Ürün Raf Kodu sütunundaki tüm değerler büyük harfe çevrildi.","changes":[]} },
  { user_command: "ihracat faturalarının tutarını topla", logic: "Sum all values in export invoice amount column", category: "sum", output: {"action":"sum","column":"İhracat Fatura Tutarı","reply":"✅ İhracat faturalarının toplam tutarı hesaplandı.","changes":[]} },
  { user_command: "vergi iadesi sütununu büyükten küçüğe sırala", logic: "Sort tax refund column in descending order", category: "sort", output: {"action":"sort","direction":"desc","column":"Vergi İadesi","reply":"✅ Vergi İadesi sütunu büyükten küçüğe sıralandı.","changes":[]} },
  { user_command: "stok sayım noksanlığı olanları kırmızıya boya", logic: "Highlight rows where inventory shortage column is greater than 0 with red color", category: "highlight", output: {"action":"highlight","condition":"greater_than","color":"#FF0000","reply":"✅ Stok sayım noksanlığı olan satırlar kırmızıya boyandı.","changes":[]} },

  // ──────────────────────────────────────────────────────────
  // AUTO-GENERATED 2026-06-06
  // ──────────────────────────────────────────────────────────
  { user_command: "net kâr sütununu hesapla", logic: "Calculate net profit column by subtracting total costs from total revenue", category: "muhasebe", output: {"action":"update_cells","formula":"=gelir-gider","reply":"✅ Net kâr sütunu hesaplandı ve güncellendi.","changes":[]} },
  { user_command: "tedarikçi fiyat tekliflerinin ortalamasını bul", logic: "Calculate average of supplier price quotes column", category: "tedarik", output: {"action":"average","column":"Teklif Tutarı","reply":"✅ Tedarikçi fiyat tekliflerinin ortalaması hesaplandı.","changes":[]} },
  { user_command: "e-fatura gönderildi olanları yeşile boya", logic: "Highlight rows where e-invoice status is 'Gönderildi' with green color", category: "e-fatura", output: {"action":"highlight","condition":"equals","color":"#00FF00","reply":"✅ E-fatura durumu 'Gönderildi' olan satırlar yeşile boyandı.","changes":[]} },
  { user_command: "stok rezerve miktarı sıfır olanları sil", logic: "Delete rows where reserved stock quantity equals zero", category: "stok", output: {"action":"delete_rows","condition":"equals_zero","reply":"🗑️ Stok rezerve miktarı sıfır olan satırlar silindi.","changes":[]} },
  { user_command: "çalışan kıdem yılı sütununu küçükten büyüğe sırala", logic: "Sort employee seniority years column in ascending order", category: "bordro", output: {"action":"sort","direction":"asc","column":"Kıdem Yılı","reply":"✅ Çalışan kıdem yılı sütunu küçükten büyüğe sıralandı.","changes":[]} },
  { user_command: "KDV matrahı boş olan satırları sarıya boya", logic: "Highlight rows where VAT base amount is empty with yellow color", category: "muhasebe", output: {"action":"highlight","condition":"is_empty","color":"#FFFF00","reply":"✅ KDV matrahı boş olan satırlar sarıya boyandı.","changes":[]} },
  { user_command: "toplam damga vergisi tutarını göster", logic: "Calculate and display total stamp tax amount", category: "muhasebe", output: {"action":"sum","column":"Damga Vergisi","reply":"✅ Toplam damga vergisi tutarı hesaplandı.","changes":[]} },
  { user_command: "depo giriş miktarı en yüksek ürünü bul", logic: "Find the product with the highest warehouse entry quantity", category: "depo", output: {"action":"max","column":"Giriş Miktarı","reply":"✅ Depo giriş miktarı en yüksek ürün bulundu.","changes":[]} },
  { user_command: "satış kanalı e-ticaret olanları filtrele", logic: "Filter rows where sales channel equals 'E-Ticaret'", category: "satış", output: {"action":"filter","condition":"equals","column":"Satış Kanalı","value":"E-Ticaret","reply":"✅ Satış kanalı 'E-Ticaret' olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "müşteri bakiyesi sıfırdan büyük olanları listele", logic: "Filter rows where customer balance is greater than zero", category: "muhasebe", output: {"action":"filter","condition":"greater_than","column":"Müşteri Bakiyesi","value":"0","reply":"✅ Müşteri bakiyesi sıfırdan büyük olan kayıtlar listelendi.","changes":[]} },
  { user_command: "fatura numarası sütununu artan sıraya koy", logic: "Sort invoice number column in ascending order", category: "muhasebe", output: {"action":"sort","direction":"asc","column":"Fatura Numarası","reply":"✅ Fatura numarası sütunu artan sıraya konuldu.","changes":[]} },
  { user_command: "işten ayrılma tarihi boş olan çalışanları göster", logic: "Filter rows where employee termination date is empty", category: "bordro", output: {"action":"filter","condition":"is_empty","column":"İşten Ayrılma Tarihi","value":"","reply":"✅ İşten ayrılma tarihi girilmemiş çalışanlar gösterildi.","changes":[]} },
  { user_command: "toplam nakliye maliyetini hesapla", logic: "Calculate total shipping cost from the nakliye maliyeti column", category: "tedarik", output: {"action":"sum","column":"Nakliye Maliyeti","reply":"✅ Toplam nakliye maliyeti hesaplandı.","changes":[]} },
  { user_command: "stok sayım fazlası olanları yeşile boya", logic: "Highlight rows where stock count surplus is positive with green", category: "stok", output: {"action":"highlight","condition":"greater_than_zero","color":"#00FF00","reply":"✅ Stok sayım fazlası olan satırlar yeşile boyandı.","changes":[]} },
  { user_command: "ürün raf ömrü 90 günden az olanları filtrele", logic: "Filter rows where product shelf life is less than 90 days", category: "stok", output: {"action":"filter","condition":"less_than","column":"Raf Ömrü","value":"90","reply":"✅ Raf ömrü 90 günden az olan ürünler filtrelendi.","changes":[]} },
  { user_command: "yeni bir tahsilat satırı ekle", logic: "Add a new empty row for collection entry", category: "muhasebe", output: {"action":"add_row","reply":"➕ Yeni bir tahsilat satırı eklendi.","changes":[]} },
  { user_command: "ortalama sipariş karşılama süresini hesapla", logic: "Calculate the average order fulfillment time", category: "satış", output: {"action":"average","column":"Karşılama Süresi","reply":"✅ Ortalama sipariş karşılama süresi hesaplandı.","changes":[]} },
  { user_command: "gelir vergisi stopajı negatif olanları kırmızıya boya", logic: "Highlight rows where income tax withholding is negative with red", category: "bordro", output: {"action":"highlight","condition":"less_than_zero","color":"#FF0000","reply":"✅ Gelir vergisi stopajı negatif olan satırlar kırmızıya boyandı.","changes":[]} },
  { user_command: "tedarikçi sözleşme bitiş tarihi geçmiş olanları filtrele", logic: "Filter rows where supplier contract end date has passed", category: "tedarik", output: {"action":"filter","condition":"less_than_today","column":"Sözleşme Bitiş Tarihi","value":"today","reply":"✅ Sözleşme bitiş tarihi geçmiş tedarikçiler filtrelendi.","changes":[]} },
  { user_command: "SGK matrahı sütununu büyükten küçüğe sırala", logic: "Sort SGK base amount column in descending order", category: "bordro", output: {"action":"sort","direction":"desc","column":"SGK Matrahı","reply":"✅ SGK matrahı sütunu büyükten küçüğe sıralandı.","changes":[]} },
  { user_command: "e-fatura UUID sütunundaki tekrarları kaldır", logic: "Remove duplicate rows based on e-invoice UUID column", category: "e-fatura", output: {"action":"remove_duplicates","reply":"✅ E-fatura UUID sütunundaki tekrar eden kayıtlar kaldırıldı.","changes":[]} },
  { user_command: "sipariş miktarı 1000 üzerindeki satırları maviye boya", logic: "Highlight rows where order quantity exceeds 1000 with blue color", category: "satış", output: {"action":"highlight","condition":"greater_than","color":"#0000FF","reply":"✅ Sipariş miktarı 1000'in üzerindeki satırlar maviye boyandı.","changes":[]} },
  { user_command: "çalışan adlarının baş harflerini büyüt", logic: "Transform employee name column to title case", category: "bordro", output: {"action":"transform","transform":"titlecase","reply":"✅ Çalışan adlarının baş harfleri büyütüldü.","changes":[]} },
  { user_command: "depo çıkış tarihi sütununu en yeniden en eskiye sırala", logic: "Sort warehouse exit date column in descending order", category: "depo", output: {"action":"sort","direction":"desc","column":"Çıkış Tarihi","reply":"✅ Depo çıkış tarihi sütunu en yeniden en eskiye sıralandı.","changes":[]} },
  { user_command: "toplam işveren SGK prim tutarını bul", logic: "Calculate total employer SGK premium amount", category: "bordro", output: {"action":"sum","column":"İşveren SGK Primi","reply":"✅ Toplam işveren SGK prim tutarı hesaplandı.","changes":[]} },
  { user_command: "ürün kodu boş olan satırları sil", logic: "Delete rows where product code is empty", category: "stok", output: {"action":"delete_rows","condition":"is_empty","reply":"🗑️ Ürün kodu boş olan satırlar silindi.","changes":[]} },
  { user_command: "KDV oranı %18 olan ürünlerin ortalama fiyatını hesapla", logic: "Calculate average price of products with 18% VAT rate", category: "muhasebe", output: {"action":"average","column":"Birim Fiyat","reply":"✅ KDV oranı %18 olan ürünlerin ortalama fiyatı hesaplandı.","changes":[]} },
  { user_command: "fatura durumu iptal olanları griye boya", logic: "Highlight rows where invoice status is 'İptal' with grey color", category: "e-fatura", output: {"action":"highlight","condition":"equals","color":"#808080","reply":"✅ Fatura durumu 'İptal' olan satırlar griye boyandı.","changes":[]} },
  { user_command: "stok giriş ve çıkış farkını hesapla", logic: "Calculate the difference between stock entry and exit quantities", category: "stok", output: {"action":"update_cells","formula":"=giriş_miktarı - çıkış_miktarı","reply":"✅ Stok giriş ve çıkış farkı hesaplanarak sütuna eklendi.","changes":[]} },
  { user_command: "tedarikçi vergi numarası sütununu küçük harfe çevir", logic: "Transform supplier tax number column to lowercase", category: "tedarik", output: {"action":"transform","transform":"lowercase","reply":"✅ Tedarikçi vergi numarası sütunu küçük harfe çevrildi.","changes":[]} },
  { user_command: "son 6 ayda oluşturulan faturaları filtrele", logic: "Filter invoices created in the last 6 months", category: "muhasebe", output: {"action":"filter","condition":"last_6_months","column":"Fatura Tarihi","value":"last_6_months","reply":"✅ Son 6 ayda oluşturulan faturalar filtrelendi.","changes":[]} },
  { user_command: "çalışma saati ortalamasını hesapla", logic: "Calculate average working hours from the column", category: "bordro", output: {"action":"average","column":"Çalışma Saati","reply":"✅ Çalışma saati ortalaması hesaplandı.","changes":[]} },
  { user_command: "sipariş durumu onaylandı olanları yeşile boya", logic: "Highlight rows where order status is 'Onaylandı' with green color", category: "satış", output: {"action":"highlight","condition":"equals","color":"#00FF00","reply":"✅ Sipariş durumu 'Onaylandı' olan satırlar yeşile boyandı.","changes":[]} },
  { user_command: "yeni bir e-arşiv fatura satırı ekle", logic: "Add a new empty row for e-archive invoice entry", category: "e-fatura", output: {"action":"add_row","reply":"➕ Yeni bir e-arşiv fatura satırı eklendi.","changes":[]} },
  { user_command: "maliyet merkezi sütunundaki tekrarları kaldır", logic: "Remove duplicate rows based on cost center column", category: "muhasebe", output: {"action":"remove_duplicates","reply":"✅ Maliyet merkezi sütunundaki tekrar eden kayıtlar kaldırıldı.","changes":[]} },
  { user_command: "depo doluluk oranı sütununu büyükten küçüğe sırala", logic: "Sort warehouse occupancy rate column in descending order", category: "depo", output: {"action":"sort","direction":"desc","column":"Doluluk Oranı","reply":"✅ Depo doluluk oranı sütunu büyükten küçüğe sıralandı.","changes":[]} },
  { user_command: "ürün kategorisi kozmetik olanları filtrele", logic: "Filter rows where product category equals 'Kozmetik'", category: "stok", output: {"action":"filter","condition":"equals","column":"Kategori","value":"Kozmetik","reply":"✅ Ürün kategorisi 'Kozmetik' olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "toplam stopaj kesintilerini göster", logic: "Calculate and show total withholding tax deductions", category: "muhasebe", output: {"action":"sum","column":"Stopaj Kesintisi","reply":"✅ Toplam stopaj kesintileri hesaplandı.","changes":[]} },
  { user_command: "çalışan unvanı direktör olanları maviye boya", logic: "Highlight rows where employee title is 'Direktör' with blue color", category: "bordro", output: {"action":"highlight","condition":"equals","color":"#0000FF","reply":"✅ Çalışan unvanı 'Direktör' olan satırlar maviye boyandı.","changes":[]} },
  { user_command: "bitiş tarihi bu ay olanları turuncu yap", logic: "Highlight rows where end date falls in the current month with orange", category: "muhasebe", output: {"action":"highlight","condition":"current_month","color":"#FFA500","reply":"✅ Bitiş tarihi bu ay olan satırlar turuncu yapıldı.","changes":[]} },
  { user_command: "ürün net ağırlığı sütununu küçükten büyüğe sırala", logic: "Sort product net weight column in ascending order", category: "stok", output: {"action":"sort","direction":"asc","column":"Net Ağırlık","reply":"✅ Ürün net ağırlığı sütunu küçükten büyüğe sıralandı.","changes":[]} },
  { user_command: "yeni bir gider kalemi satırı ekle", logic: "Add a new empty row for expense item entry", category: "muhasebe", output: {"action":"add_row","reply":"➕ Yeni bir gider kalemi satırı eklendi.","changes":[]} },
  { user_command: "kargo ücreti 50 TL üzerindeki satırları filtrele", logic: "Filter rows where shipping fee is greater than 50 TL", category: "tedarik", output: {"action":"filter","condition":"greater_than","column":"Kargo Ücreti","value":"50","reply":"✅ Kargo ücreti 50 TL'nin üzerindeki kayıtlar filtrelendi.","changes":[]} },
  { user_command: "toplam ihracat fatura tutarını hesapla", logic: "Calculate total export invoice amount", category: "muhasebe", output: {"action":"sum","column":"İhracat Fatura Tutarı","reply":"✅ Toplam ihracat fatura tutarı hesaplandı.","changes":[]} },
  { user_command: "personel sicil numarası sütununu küçükten büyüğe sırala", logic: "Sort personnel registration number column in ascending order", category: "bordro", output: {"action":"sort","direction":"asc","column":"Sicil Numarası","reply":"✅ Personel sicil numarası sütunu küçükten büyüğe sıralandı.","changes":[]} },
  { user_command: "boş açıklama sütunlarını 'Belirtilmemiş' ile doldur", logic: "Fill empty description cells with 'Belirtilmemiş'", category: "veri temizleme", output: {"action":"update_cells","formula":"Belirtilmemiş","reply":"✅ Boş açıklama hücreleri 'Belirtilmemiş' ile dolduruldu.","changes":[]} },
  { user_command: "tedarikçi adı sütununu alfabetik sırala", logic: "Sort supplier name column in alphabetical order", category: "tedarik", output: {"action":"sort","direction":"asc","column":"Tedarikçi Adı","reply":"✅ Tedarikçi adı sütunu alfabetik olarak sıralandı.","changes":[]} },
  { user_command: "satış adedi sıfır olan ürünleri sil", logic: "Delete rows where sales quantity equals zero", category: "satış", output: {"action":"delete_rows","condition":"equals_zero","reply":"🗑️ Satış adedi sıfır olan ürün satırları silindi.","changes":[]} },
  { user_command: "çalışan doğum tarihi sütununu artan sıraya göre sırala", logic: "Sort employee birth date column in ascending order", category: "bordro", output: {"action":"sort","direction":"asc","column":"Doğum Tarihi","reply":"✅ Çalışan doğum tarihi sütunu artan sıraya göre sıralandı.","changes":[]} },
  { user_command: "stok miktarı 200'ün üzerindeki ürünleri yeşile boya", logic: "Highlight rows where stock quantity exceeds 200 with green color", category: "stok", output: {"action":"highlight","condition":"greater_than","color":"#00FF00","reply":"✅ Stok miktarı 200'ün üzerindeki ürünler yeşile boyandı.","changes":[]} },
  { user_command: "ödeme yöntemi havale olanları filtrele", logic: "Filter rows where payment method equals 'Havale'", category: "muhasebe", output: {"action":"filter","condition":"equals","column":"Ödeme Yöntemi","value":"Havale","reply":"✅ Ödeme yöntemi 'Havale' olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "ortalama brüt maaşı hesapla", logic: "Calculate average gross salary from the column", category: "bordro", output: {"action":"average","column":"Brüt Maaş","reply":"✅ Ortalama brüt maaş hesaplandı.","changes":[]} },
  { user_command: "fatura seri numarasını büyük harfe çevir", logic: "Transform invoice serial number column to uppercase", category: "e-fatura", output: {"action":"transform","transform":"uppercase","reply":"✅ Fatura seri numarası sütunu büyük harfe çevrildi.","changes":[]} },
  { user_command: "depo bölgesi marmara olanları filtrele", logic: "Filter rows where warehouse region equals 'Marmara'", category: "depo", output: {"action":"filter","condition":"equals","column":"Depo Bölgesi","value":"Marmara","reply":"✅ Depo bölgesi 'Marmara' olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "yeni bir ürün iade satırı ekle", logic: "Add a new empty row for product return entry", category: "stok", output: {"action":"add_row","reply":"➕ Yeni bir ürün iade satırı eklendi.","changes":[]} },
  { user_command: "asgari ücret altında kalan maaşları kırmızıya boya", logic: "Highlight rows where salary is below minimum wage with red color", category: "bordro", output: {"action":"highlight","condition":"less_than_minimum_wage","color":"#FF0000","reply":"✅ Asgari ücretin altında kalan maaşlar kırmızıya boyandı.","changes":[]} },
  { user_command: "müşteri şehri sütununu büyük harfe çevir", logic: "Transform customer city column to uppercase", category: "satış", output: {"action":"transform","transform":"uppercase","reply":"✅ Müşteri şehri sütunu büyük harfe çevrildi.","changes":[]} },
  { user_command: "en düşük nakliye süresi kaç gün", logic: "Find the minimum delivery duration in days", category: "tedarik", output: {"action":"min","column":"Nakliye Süresi","reply":"✅ En düşük nakliye süresi bulundu.","changes":[]} },
  { user_command: "SGK prim oranı sütununu küçükten büyüğe sırala", logic: "Sort SGK premium rate column in ascending order", category: "bordro", output: {"action":"sort","direction":"asc","column":"SGK Prim Oranı","reply":"✅ SGK prim oranı sütunu küçükten büyüğe sıralandı.","changes":[]} },
  { user_command: "ödeme vadesi 30 günden fazla olan faturaları filtrele", logic: "Filter invoices where payment due date exceeds 30 days", category: "muhasebe", output: {"action":"filter","condition":"greater_than","column":"Vade Günü","value":"30","reply":"✅ Ödeme vadesi 30 günden fazla olan faturalar filtrelendi.","changes":[]} },
  { user_command: "depo kodu tekrarlananları temizle", logic: "Remove duplicate rows based on warehouse code", category: "depo", output: {"action":"remove_duplicates","reply":"✅ Depo kodu tekrar eden kayıtlar temizlendi.","changes":[]} },
  { user_command: "toplam kira giderini hesapla", logic: "Calculate total rent expense from the column", category: "muhasebe", output: {"action":"sum","column":"Kira Gideri","reply":"✅ Toplam kira gideri hesaplandı.","changes":[]} },
  { user_command: "çalışan lokasyonu izmir olanları filtrele", logic: "Filter rows where employee location equals 'İzmir'", category: "bordro", output: {"action":"filter","condition":"equals","column":"Lokasyon","value":"İzmir","reply":"✅ Lokasyonu 'İzmir' olan çalışanlar filtrelendi.","changes":[]} },
  { user_command: "satış tutarı ortalamasının üzerindeki satırları vurgula", logic: "Highlight rows where sales amount is above the column average", category: "satış", output: {"action":"highlight","condition":"above_average","color":"#FFFF00","reply":"✅ Satış tutarı ortalamanın üzerindeki satırlar vurgulandı.","changes":[]} },
  { user_command: "yeni bir satın alma talebi satırı ekle", logic: "Add a new empty row for purchase request entry", category: "tedarik", output: {"action":"add_row","reply":"➕ Yeni bir satın alma talebi satırı eklendi.","changes":[]} },
  { user_command: "ürün barkod sütunundaki tekrarları kaldır", logic: "Remove duplicate rows based on product barcode column", category: "stok", output: {"action":"remove_duplicates","reply":"✅ Ürün barkod sütunundaki tekrar eden kayıtlar kaldırıldı.","changes":[]} },
  { user_command: "fatura kesilme tarihi bu yıl olanları listele", logic: "Filter rows where invoice issue date is in the current year", category: "e-fatura", output: {"action":"filter","condition":"current_year","column":"Kesilme Tarihi","value":"current_year","reply":"✅ Fatura kesilme tarihi bu yıl olan kayıtlar listelendi.","changes":[]} },
  { user_command: "çalışma günü sütununun toplamını hesapla", logic: "Calculate total working days from the column", category: "bordro", output: {"action":"sum","column":"Çalışma Günü","reply":"✅ Toplam çalışma günü sayısı hesaplandı.","changes":[]} },
  { user_command: "stok miktarı 10 ile 50 arasındakileri sarıya boya", logic: "Highlight rows where stock quantity is between 10 and 50 with yellow", category: "stok", output: {"action":"highlight","condition":"between","color":"#FFFF00","reply":"✅ Stok miktarı 10 ile 50 arasındaki ürünler sarıya boyandı.","changes":[]} },
  { user_command: "vergi iadesi tutarı en yüksek kaydı göster", logic: "Find the record with the highest tax refund amount", category: "muhasebe", output: {"action":"max","column":"Vergi İadesi","reply":"✅ Vergi iadesi tutarı en yüksek kayıt gösterildi.","changes":[]} },
  { user_command: "tedarikçi ülkesi Hindistan olanları filtrele", logic: "Filter rows where supplier country equals 'Hindistan'", category: "tedarik", output: {"action":"filter","condition":"equals","column":"Ülke","value":"Hindistan","reply":"✅ Tedarikçi ülkesi 'Hindistan' olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "yeni bir kargo hareketi satırı ekle", logic: "Add a new empty row for cargo movement entry", category: "depo", output: {"action":"add_row","reply":"➕ Yeni bir kargo hareketi satırı eklendi.","changes":[]} },
  { user_command: "brüt kâr oranı negatif olanları kırmızıya boya", logic: "Highlight rows where gross profit margin is negative with red color", category: "muhasebe", output: {"action":"highlight","condition":"less_than_zero","color":"#FF0000","reply":"✅ Brüt kâr oranı negatif olan satırlar kırmızıya boyandı.","changes":[]} },
  { user_command: "ürün açıklama sütunundaki HTML etiketlerini temizle", logic: "Remove HTML tags from the product description column", category: "veri temizleme", output: {"action":"transform","transform":"remove_html","reply":"✅ Ürün açıklama sütunundaki HTML etiketleri temizlendi.","changes":[]} },
  { user_command: "satış temsilcisi hedef tutarı sütununu büyükten küçüğe sırala", logic: "Sort sales representative target amount column in descending order", category: "satış", output: {"action":"sort","direction":"desc","column":"Hedef Tutarı","reply":"✅ Satış temsilcisi hedef tutarı sütunu büyükten küçüğe sıralandı.","changes":[]} },
  { user_command: "SGK eksik gün sayısı 5'ten fazla olanları filtrele", logic: "Filter rows where SGK missing days count exceeds 5", category: "bordro", output: {"action":"filter","condition":"greater_than","column":"Eksik Gün","value":"5","reply":"✅ SGK eksik gün sayısı 5'ten fazla olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "tüm ürün fiyatlarını yüzde 12 artır", logic: "Increase all product prices by 12 percent", category: "stok", output: {"action":"update_cells","formula":"=fiyat*1.12","reply":"✅ Tüm ürün fiyatları %12 artırıldı.","changes":[]} },
  { user_command: "yeni bir maaş bordrosu satırı ekle", logic: "Add a new empty row for payroll entry", category: "bordro", output: {"action":"add_row","reply":"➕ Yeni bir maaş bordrosu satırı eklendi.","changes":[]} },
  { user_command: "kargo firması MNG olanları filtrele", logic: "Filter rows where cargo company equals 'MNG'", category: "depo", output: {"action":"filter","condition":"equals","column":"Kargo Firması","value":"MNG","reply":"✅ Kargo firması 'MNG' olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "ortalama KDV oranını hesapla", logic: "Calculate the average VAT rate across all rows", category: "muhasebe", output: {"action":"average","column":"KDV Oranı","reply":"✅ Ortalama KDV oranı hesaplandı.","changes":[]} },
  { user_command: "müşteri posta kodu sütununu küçükten büyüğe sırala", logic: "Sort customer postal code column in ascending order", category: "satış", output: {"action":"sort","direction":"asc","column":"Posta Kodu","reply":"✅ Müşteri posta kodu sütunu küçükten büyüğe sıralandı.","changes":[]} },

  // ──────────────────────────────────────────────────────────
  // AUTO-GENERATED 2026-06-06
  // ──────────────────────────────────────────────────────────
  { user_command: "en yüksek ciro değerini bul", logic: "Find the maximum value in the revenue/turnover column", category: "analysis", output: {"action":"max","column":"Ciro","reply":"✅ En yüksek ciro değeri bulundu.","changes":[]} },
  { user_command: "tedarikçi adlarını alfabetik sırala", logic: "Sort supplier names alphabetically ascending", category: "sort", output: {"action":"sort","direction":"asc","column":"Tedarikçi Adı","reply":"✅ Tedarikçi adları A'dan Z'ye sıralandı.","changes":[]} },
  { user_command: "brüt kâr sütununu topla", logic: "Sum all values in the gross profit column", category: "calculation", output: {"action":"sum","column":"Brüt Kâr","reply":"✅ Brüt kâr sütununun toplamı hesaplandı.","changes":[]} },
  { user_command: "stok miktarı 20'nin altındakileri filtrele", logic: "Filter rows where stock quantity is less than 20", category: "filter", output: {"action":"filter","condition":"less_than","column":"Stok Miktarı","value":"20","reply":"✅ Stok miktarı 20'nin altındaki ürünler filtrelendi.","changes":[]} },
  { user_command: "KDV matrahı sütununun ortalamasını hesapla", logic: "Calculate the average of the VAT base column", category: "calculation", output: {"action":"average","column":"KDV Matrahı","reply":"✅ KDV matrahı ortalaması hesaplandı.","changes":[]} },
  { user_command: "sipariş tarihi en eskiden en yeniye sırala", logic: "Sort order date column from oldest to newest ascending", category: "sort", output: {"action":"sort","direction":"asc","column":"Sipariş Tarihi","reply":"✅ Sipariş tarihi en eskiden en yeniye sıralandı.","changes":[]} },
  { user_command: "SGK eksik gün sütununu küçükten büyüğe sırala", logic: "Sort SGK missing days column in ascending order", category: "sort", output: {"action":"sort","direction":"asc","column":"SGK Eksik Gün","reply":"✅ SGK eksik gün sütunu küçükten büyüğe sıralandı.","changes":[]} },
  { user_command: "e-fatura durumu iptal olanları filtrele", logic: "Filter rows where e-invoice status is cancelled", category: "filter", output: {"action":"filter","condition":"equals","column":"E-Fatura Durumu","value":"İptal","reply":"✅ E-fatura durumu iptal olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "ödeme vadesi geçmiş faturaları turuncu yap", logic: "Highlight rows where payment due date has passed in orange", category: "highlight", output: {"action":"highlight","condition":"due_date_passed","color":"#FFA500","reply":"✅ Ödeme vadesi geçmiş faturalar turuncu ile işaretlendi.","changes":[]} },
  { user_command: "mükerrer e-posta kayıtlarını kaldır", logic: "Remove duplicate records based on email address column", category: "data_quality", output: {"action":"remove_duplicates","reply":"✅ Mükerrer e-posta kayıtları temizlendi.","changes":[]} },
  { user_command: "net satış tutarı sütununu büyükten küçüğe sırala", logic: "Sort net sales amount column in descending order", category: "sort", output: {"action":"sort","direction":"desc","column":"Net Satış Tutarı","reply":"✅ Net satış tutarı büyükten küçüğe sıralandı.","changes":[]} },
  { user_command: "depo giriş tarihi en yeni olandan sırala", logic: "Sort warehouse entry date from newest to oldest descending", category: "sort", output: {"action":"sort","direction":"desc","column":"Depo Giriş Tarihi","reply":"✅ Depo giriş tarihi en yeniden en eskiye sıralandı.","changes":[]} },
  { user_command: "ürün ağırlığı sıfır olanları sil", logic: "Delete rows where product weight value is zero", category: "delete", output: {"action":"delete_rows","condition":"product_weight_equals_zero","reply":"🗑️ Ürün ağırlığı sıfır olan satırlar silindi.","changes":[]} },
  { user_command: "çalışan departmanı sütununu büyük harfe çevir", logic: "Convert all values in employee department column to uppercase", category: "transform", output: {"action":"transform","transform":"uppercase","reply":"✅ Çalışan departmanı sütunu büyük harfe çevrildi.","changes":[]} },
  { user_command: "toplam nakliye ücreti nedir", logic: "Calculate the total sum of shipping cost column", category: "calculation", output: {"action":"sum","column":"Nakliye Ücreti","reply":"✅ Toplam nakliye ücreti hesaplandı.","changes":[]} },
  { user_command: "stok eşiği altındaki ürünleri kırmızıya boya", logic: "Highlight rows where stock is below threshold level in red", category: "highlight", output: {"action":"highlight","condition":"below_threshold","color":"#FF0000","reply":"✅ Stok eşiği altındaki ürünler kırmızıya boyandı.","changes":[]} },
  { user_command: "KDV oranı %18 olan satırları filtrele", logic: "Filter rows where VAT rate equals 18 percent", category: "filter", output: {"action":"filter","condition":"equals","column":"KDV Oranı","value":"%18","reply":"✅ KDV oranı %18 olan satırlar filtrelendi.","changes":[]} },
  { user_command: "yeni bir tedarik kalemi satırı ekle", logic: "Add a new empty row for a supply item entry", category: "row_operations", output: {"action":"add_row","reply":"➕ Yeni bir tedarik kalemi satırı eklendi.","changes":[]} },
  { user_command: "ortalama teslimat gününü hesapla", logic: "Calculate the average delivery time in days", category: "calculation", output: {"action":"average","column":"Teslimat Günü","reply":"✅ Ortalama teslimat günü hesaplandı.","changes":[]} },
  { user_command: "fatura tutarı 100000 üzerindeki kayıtları sarıya boya", logic: "Highlight rows where invoice amount exceeds 100000 in yellow", category: "highlight", output: {"action":"highlight","condition":"greater_than","color":"#FFFF00","reply":"✅ Fatura tutarı 100.000 üzerindeki kayıtlar sarıya boyandı.","changes":[]} },
  { user_command: "gelir vergisi stopaj toplamını göster", logic: "Sum the income tax withholding column and display result", category: "calculation", output: {"action":"sum","column":"Gelir Vergisi Stopajı","reply":"✅ Gelir vergisi stopaj toplamı hesaplandı.","changes":[]} },
  { user_command: "kargo durumu teslimatta olanları filtrele", logic: "Filter rows where cargo status is in delivery", category: "filter", output: {"action":"filter","condition":"equals","column":"Kargo Durumu","value":"Teslimatta","reply":"✅ Kargo durumu 'Teslimatta' olan satırlar filtrelendi.","changes":[]} },
  { user_command: "en düşük birim maliyet nedir", logic: "Find the minimum value in the unit cost column", category: "analysis", output: {"action":"min","column":"Birim Maliyet","reply":"✅ En düşük birim maliyet değeri bulundu.","changes":[]} },
  { user_command: "çalışan izin bakiyesi sütununu sırala", logic: "Sort employee leave balance column in ascending order", category: "sort", output: {"action":"sort","direction":"asc","column":"İzin Bakiyesi","reply":"✅ Çalışan izin bakiyesi sütunu sıralandı.","changes":[]} },
  { user_command: "iade edilen ürün satırlarını vurgula", logic: "Highlight rows where product is marked as returned", category: "highlight", output: {"action":"highlight","condition":"is_returned","color":"#FF6600","reply":"✅ İade edilen ürün satırları vurgulandı.","changes":[]} },
  { user_command: "tedarikçi teslim süresi 15 günü aşanları filtrele", logic: "Filter rows where supplier delivery time exceeds 15 days", category: "filter", output: {"action":"filter","condition":"greater_than","column":"Tedarikçi Teslim Süresi","value":"15","reply":"✅ Tedarikçi teslim süresi 15 günü aşan satırlar filtrelendi.","changes":[]} },
  { user_command: "toplam işçi SGK prim tutarını hesapla", logic: "Calculate the total employee SGK premium amount", category: "calculation", output: {"action":"sum","column":"İşçi SGK Primi","reply":"✅ Toplam işçi SGK prim tutarı hesaplandı.","changes":[]} },
  { user_command: "stok fazlası olan ürünleri yeşile boya", logic: "Highlight rows where stock quantity exceeds maximum level in green", category: "highlight", output: {"action":"highlight","condition":"stock_excess","color":"#00FF00","reply":"✅ Stok fazlası olan ürünler yeşile boyandı.","changes":[]} },
  { user_command: "müşteri bakiyesi negatif olanları listele", logic: "Filter and display rows where customer balance is negative", category: "filter", output: {"action":"filter","condition":"less_than","column":"Müşteri Bakiyesi","value":"0","reply":"✅ Müşteri bakiyesi negatif olan kayıtlar listelendi.","changes":[]} },
  { user_command: "en yüksek stopaj vergisini göster", logic: "Find the maximum withholding tax value in the column", category: "analysis", output: {"action":"max","column":"Stopaj Vergisi","reply":"✅ En yüksek stopaj vergisi değeri bulundu.","changes":[]} },
  { user_command: "ürün kodlarını küçük harfe çevir", logic: "Convert all product code values to lowercase", category: "transform", output: {"action":"transform","transform":"lowercase","reply":"✅ Ürün kodları küçük harfe çevrildi.","changes":[]} },
  { user_command: "onay bekleyen e-faturaları filtrele", logic: "Filter rows where e-invoice status is pending approval", category: "filter", output: {"action":"filter","condition":"equals","column":"E-Fatura Durumu","value":"Onay Bekliyor","reply":"✅ Onay bekleyen e-faturalar filtrelendi.","changes":[]} },
  { user_command: "ortalama işveren SGK payını bul", logic: "Calculate the average employer SGK contribution amount", category: "calculation", output: {"action":"average","column":"İşveren SGK Payı","reply":"✅ Ortalama işveren SGK payı hesaplandı.","changes":[]} },
  { user_command: "geçersiz vergi numaralı satırları vurgula", logic: "Highlight rows containing invalid tax identification numbers", category: "highlight", output: {"action":"highlight","condition":"invalid_tax_number","color":"#FF0000","reply":"✅ Geçersiz vergi numaralı satırlar kırmızıyla vurgulandı.","changes":[]} },
  { user_command: "yeni bir e-fatura satırı ekle", logic: "Add a new empty row for an e-invoice entry", category: "row_operations", output: {"action":"add_row","reply":"➕ Yeni bir e-fatura satırı eklendi.","changes":[]} },
  { user_command: "depo çıkış miktarı sıfır olanları sil", logic: "Delete rows where warehouse exit quantity is zero", category: "delete", output: {"action":"delete_rows","condition":"warehouse_exit_quantity_zero","reply":"🗑️ Depo çıkış miktarı sıfır olan satırlar silindi.","changes":[]} },
  { user_command: "satış hedefine ulaşanları yeşile boya", logic: "Highlight rows where sales target has been achieved in green", category: "highlight", output: {"action":"highlight","condition":"target_achieved","color":"#00CC00","reply":"✅ Satış hedefine ulaşan satırlar yeşile boyandı.","changes":[]} },
  { user_command: "fatura türü e-arşiv olanları filtrele", logic: "Filter rows where invoice type is e-archive", category: "filter", output: {"action":"filter","condition":"equals","column":"Fatura Türü","value":"E-Arşiv","reply":"✅ Fatura türü e-arşiv olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "toplam damga vergisi tutarını hesapla", logic: "Calculate the total stamp duty tax amount", category: "calculation", output: {"action":"sum","column":"Damga Vergisi","reply":"✅ Toplam damga vergisi tutarı hesaplandı.","changes":[]} },
  { user_command: "sipariş adedi en fazla olan müşteriyi bul", logic: "Find the customer with the maximum total order count", category: "analysis", output: {"action":"max","column":"Sipariş Adedi","reply":"✅ Sipariş adedi en fazla olan müşteri bulundu.","changes":[]} },
  { user_command: "çalışan soyadları sütununu büyük harfe çevir", logic: "Convert all employee surname values to uppercase", category: "transform", output: {"action":"transform","transform":"uppercase","reply":"✅ Çalışan soyadları büyük harfe çevrildi.","changes":[]} },
  { user_command: "stok miktarı 100 ile 500 arasındakileri filtrele", logic: "Filter rows where stock quantity is between 100 and 500", category: "filter", output: {"action":"filter","condition":"between","column":"Stok Miktarı","value":"100-500","reply":"✅ Stok miktarı 100 ile 500 arasındaki ürünler filtrelendi.","changes":[]} },
  { user_command: "yeni bir bordro satırı ekle", logic: "Add a new empty row for a payroll entry", category: "row_operations", output: {"action":"add_row","reply":"➕ Yeni bir bordro satırı eklendi.","changes":[]} },
  { user_command: "amortisman tutarı en yüksek varlığı göster", logic: "Find the asset with the highest depreciation amount", category: "analysis", output: {"action":"max","column":"Amortisman Tutarı","reply":"✅ Amortisman tutarı en yüksek varlık bulundu.","changes":[]} },
  { user_command: "ödeme yöntemi kredi kartı olanları filtrele", logic: "Filter rows where payment method is credit card", category: "filter", output: {"action":"filter","condition":"equals","column":"Ödeme Yöntemi","value":"Kredi Kartı","reply":"✅ Ödeme yöntemi kredi kartı olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "birim fiyat sütununu küçükten büyüğe sırala", logic: "Sort unit price column in ascending order", category: "sort", output: {"action":"sort","direction":"asc","column":"Birim Fiyat","reply":"✅ Birim fiyat sütunu küçükten büyüğe sıralandı.","changes":[]} },
  { user_command: "toplam işveren SGK payını hesapla", logic: "Calculate the total employer SGK contribution", category: "calculation", output: {"action":"sum","column":"İşveren SGK Payı","reply":"✅ Toplam işveren SGK payı hesaplandı.","changes":[]} },
  { user_command: "müşteri tipi kurumsal olanları vurgula", logic: "Highlight rows where customer type is corporate", category: "highlight", output: {"action":"highlight","condition":"equals","color":"#0000FF","reply":"✅ Müşteri tipi kurumsal olan kayıtlar vurgulandı.","changes":[]} },
  { user_command: "aktif tedarikçi sayısını say", logic: "Count the number of rows where supplier status is active", category: "calculation", output: {"action":"count","column":"Tedarikçi Durumu","reply":"✅ Aktif tedarikçi sayısı hesaplandı.","changes":[]} },
  { user_command: "vergi kimlik numarası boş olanları sil", logic: "Delete rows where tax identification number is empty", category: "delete", output: {"action":"delete_rows","condition":"tax_id_empty","reply":"🗑️ Vergi kimlik numarası boş olan satırlar silindi.","changes":[]} },
  { user_command: "ürün grubu gıda olanları filtrele", logic: "Filter rows where product group is food", category: "filter", output: {"action":"filter","condition":"equals","column":"Ürün Grubu","value":"Gıda","reply":"✅ Ürün grubu gıda olan satırlar filtrelendi.","changes":[]} },
  { user_command: "KDV dahil toplam fatura tutarını hesapla", logic: "Calculate the total invoice amount including VAT", category: "calculation", output: {"action":"sum","column":"KDV Dahil Tutar","reply":"✅ KDV dahil toplam fatura tutarı hesaplandı.","changes":[]} },
  { user_command: "en düşük amortisman tutarını bul", logic: "Find the minimum depreciation amount in the column", category: "analysis", output: {"action":"min","column":"Amortisman Tutarı","reply":"✅ En düşük amortisman tutarı bulundu.","changes":[]} },
  { user_command: "satış kanalı mağaza olanları filtrele", logic: "Filter rows where sales channel is store", category: "filter", output: {"action":"filter","condition":"equals","column":"Satış Kanalı","value":"Mağaza","reply":"✅ Satış kanalı mağaza olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "depo bölgesi adlarını büyük harfe çevir", logic: "Convert all warehouse region name values to uppercase", category: "transform", output: {"action":"transform","transform":"uppercase","reply":"✅ Depo bölgesi adları büyük harfe çevrildi.","changes":[]} },
  { user_command: "ortalama KDV matrahını hesapla", logic: "Calculate the average VAT base amount", category: "calculation", output: {"action":"average","column":"KDV Matrahı","reply":"✅ Ortalama KDV matrahı hesaplandı.","changes":[]} },
  { user_command: "yeni bir stok hareketi satırı ekle", logic: "Add a new empty row for a stock movement entry", category: "row_operations", output: {"action":"add_row","reply":"➕ Yeni bir stok hareketi satırı eklendi.","changes":[]} },
  { user_command: "fatura tutarı en küçük kaydı bul", logic: "Find the record with the minimum invoice amount", category: "analysis", output: {"action":"min","column":"Fatura Tutarı","reply":"✅ Fatura tutarı en küçük kayıt bulundu.","changes":[]} },
  { user_command: "tedarikçi ülkesi Çin olanları filtrele", logic: "Filter rows where supplier country is China", category: "filter", output: {"action":"filter","condition":"equals","column":"Tedarikçi Ülkesi","value":"Çin","reply":"✅ Tedarikçi ülkesi Çin olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "tüm hücrelerdeki baştaki boşlukları temizle", logic: "Remove leading whitespace from all cell values in the table", category: "transform", output: {"action":"transform","transform":"trim","reply":"✅ Tüm hücrelerdeki baştaki boşluklar temizlendi.","changes":[]} },
  { user_command: "kargo ücreti en yüksek rotayı bul", logic: "Find the route with the highest shipping cost", category: "analysis", output: {"action":"max","column":"Kargo Ücreti","reply":"✅ Kargo ücreti en yüksek rota bulundu.","changes":[]} },
  { user_command: "satış miktarı ortalamasını hesapla", logic: "Calculate the average sales quantity", category: "calculation", output: {"action":"average","column":"Satış Miktarı","reply":"✅ Satış miktarı ortalaması hesaplandı.","changes":[]} },
  { user_command: "depo kapasitesi dolmuş olanları kırmızıya boya", logic: "Highlight rows where warehouse capacity is full in red", category: "highlight", output: {"action":"highlight","condition":"capacity_full","color":"#FF0000","reply":"✅ Depo kapasitesi dolmuş olanlar kırmızıya boyandı.","changes":[]} },
  { user_command: "çalışan işe giriş tarihine göre sırala", logic: "Sort employees by their start date in ascending order", category: "sort", output: {"action":"sort","direction":"asc","column":"İşe Giriş Tarihi","reply":"✅ Çalışanlar işe giriş tarihine göre sıralandı.","changes":[]} },
  { user_command: "toplam amortisman giderini topla", logic: "Sum all values in the depreciation expense column", category: "calculation", output: {"action":"sum","column":"Amortisman Gideri","reply":"✅ Toplam amortisman gideri hesaplandı.","changes":[]} },
  { user_command: "SGK prim günü 30'dan az olanları filtrele", logic: "Filter rows where SGK premium days are less than 30", category: "filter", output: {"action":"filter","condition":"less_than","column":"SGK Prim Günü","value":"30","reply":"✅ SGK prim günü 30'dan az olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "ortalama birim fiyatı hesapla", logic: "Calculate the average unit price across all rows", category: "calculation", output: {"action":"average","column":"Birim Fiyat","reply":"✅ Ortalama birim fiyat hesaplandı.","changes":[]} },
  { user_command: "müşteri segmenti VIP olanları maviye boya", logic: "Highlight rows where customer segment is VIP in blue", category: "highlight", output: {"action":"highlight","condition":"equals","color":"#0000FF","reply":"✅ Müşteri segmenti VIP olan kayıtlar maviye boyandı.","changes":[]} },
  { user_command: "silinmiş olarak işaretli fatura satırlarını kaldır", logic: "Delete rows where invoice is marked as deleted", category: "delete", output: {"action":"delete_rows","condition":"marked_as_deleted","reply":"🗑️ Silinmiş olarak işaretli fatura satırları kaldırıldı.","changes":[]} },
  { user_command: "ürün açıklama sütununu baş harfleri büyük yap", logic: "Convert product description column values to title case", category: "transform", output: {"action":"transform","transform":"titlecase","reply":"✅ Ürün açıklama sütununun baş harfleri büyütüldü.","changes":[]} },
  { user_command: "toplam ihracat fatura tutarını hesapla", logic: "Calculate the total export invoice amount", category: "calculation", output: {"action":"sum","column":"İhracat Fatura Tutarı","reply":"✅ Toplam ihracat fatura tutarı hesaplandı.","changes":[]} },
  { user_command: "bekleyen talep sayısını say", logic: "Count the number of rows where request status is pending", category: "calculation", output: {"action":"count","column":"Talep Durumu","reply":"✅ Bekleyen talep sayısı hesaplandı.","changes":[]} },
  { user_command: "satış temsilcisi adını sırala", logic: "Sort sales representative name column alphabetically ascending", category: "sort", output: {"action":"sort","direction":"asc","column":"Satış Temsilcisi","reply":"✅ Satış temsilcisi adı alfabetik olarak sıralandı.","changes":[]} },
  { user_command: "teslim edilmeyen siparişleri turuncu yap", logic: "Highlight rows where order has not been delivered in orange", category: "highlight", output: {"action":"highlight","condition":"not_delivered","color":"#FFA500","reply":"✅ Teslim edilmeyen siparişler turuncu ile işaretlendi.","changes":[]} },
  { user_command: "minimum KDV tutarını bul", logic: "Find the minimum VAT amount in the column", category: "analysis", output: {"action":"min","column":"KDV Tutarı","reply":"✅ Minimum KDV tutarı bulundu.","changes":[]} },
  { user_command: "çalışma saati 40'ın üzerindeki satırları filtrele", logic: "Filter rows where working hours exceed 40", category: "filter", output: {"action":"filter","condition":"greater_than","column":"Çalışma Saati","value":"40","reply":"✅ Çalışma saati 40'ın üzerindeki satırlar filtrelendi.","changes":[]} },
  { user_command: "yeni bir cari hesap satırı ekle", logic: "Add a new empty row for a current account entry", category: "row_operations", output: {"action":"add_row","reply":"➕ Yeni bir cari hesap satırı eklendi.","changes":[]} },
  { user_command: "toplam iade tutarını hesapla", logic: "Calculate the total return/refund amount", category: "calculation", output: {"action":"sum","column":"İade Tutarı","reply":"✅ Toplam iade tutarı hesaplandı.","changes":[]} },
  { user_command: "raf ömrü 30 günden az kalan ürünleri kırmızıya boya", logic: "Highlight rows where product shelf life is less than 30 days remaining in red", category: "highlight", output: {"action":"highlight","condition":"shelf_life_critical","color":"#FF0000","reply":"✅ Raf ömrü 30 günden az kalan ürünler kırmızıya boyandı.","changes":[]} },
  { user_command: "hesap kodu sütununu büyükten küçüğe sırala", logic: "Sort account code column in descending order", category: "sort", output: {"action":"sort","direction":"desc","column":"Hesap Kodu","reply":"✅ Hesap kodu sütunu büyükten küçüğe sıralandı.","changes":[]} },
  { user_command: "borç bakiyesi 5000 üzeri olanları vurgula", logic: "Highlight rows where debt balance exceeds 5000", category: "highlight", output: {"action":"highlight","condition":"greater_than","color":"#FF6600","reply":"✅ Borç bakiyesi 5000 üzeri olan kayıtlar vurgulandı.","changes":[]} },
  { user_command: "tekrarlanan cari hesap numaralarını temizle", logic: "Remove duplicate current account numbers from the dataset", category: "data_quality", output: {"action":"remove_duplicates","reply":"✅ Tekrarlanan cari hesap numaraları temizlendi.","changes":[]} },
  { user_command: "tüm filtreleri kaldır", logic: "Remove all active filters and show complete dataset", category: "filter", output: {"action":"remove_filter","reply":"✅ Tüm filtreler kaldırıldı, veriler tamamen gösteriliyor.","changes":[]} },
  { user_command: "kaç farklı tedarikçi var", logic: "Count the number of unique supplier names in the column", category: "calculation", output: {"action":"count","column":"Tedarikçi Adı","reply":"✅ Farklı tedarikçi sayısı hesaplandı.","changes":[]} },
  { user_command: "teslim adresi boş olanları sarıya boya", logic: "Highlight rows where delivery address is empty in yellow", category: "highlight", output: {"action":"highlight","condition":"empty","color":"#FFFF00","reply":"✅ Teslim adresi boş olan satırlar sarıya boyandı.","changes":[]} },
  { user_command: "toplam komisyon tutarını hesapla", logic: "Calculate the total commission amount across all rows", category: "calculation", output: {"action":"sum","column":"Komisyon Tutarı","reply":"✅ Toplam komisyon tutarı hesaplandı.","changes":[]} },
  { user_command: "ürün ağırlığı sütununu küçükten büyüğe sırala", logic: "Sort product weight column in ascending order", category: "sort", output: {"action":"sort","direction":"asc","column":"Ürün Ağırlığı","reply":"✅ Ürün ağırlığı sütunu küçükten büyüğe sıralandı.","changes":[]} },
  { user_command: "satış bölgesi ege olanları filtrele", logic: "Filter rows where sales region is Aegean", category: "filter", output: {"action":"filter","condition":"equals","column":"Satış Bölgesi","value":"Ege","reply":"✅ Satış bölgesi Ege olan kayıtlar filtrelendi.","changes":[]} },

  // ──────────────────────────────────────────────────────────
  // AUTO-GENERATED 2026-06-06
  // ──────────────────────────────────────────────────────────
  { user_command: "kâr merkezi sütununu büyük harfe çevir", logic: "Transform profit center column values to uppercase", category: "transform", output: {"action":"transform","transform":"uppercase","reply":"✅ Kâr merkezi sütunundaki tüm değerler büyük harfe çevrildi.","changes":[]} },
  { user_command: "e-fatura gönderim tarihi en yeniden en eskiye sırala", logic: "Sort e-invoice send date column descending", category: "sort", output: {"action":"sort","direction":"desc","column":"E-Fatura Gönderim Tarihi","reply":"✅ E-fatura gönderim tarihi en yeniden en eskiye sıralandı.","changes":[]} },
  { user_command: "toplam vergi iadesi tutarını hesapla", logic: "Calculate sum of tax refund amounts", category: "sum", output: {"action":"sum","column":"Vergi İadesi Tutarı","reply":"✅ Toplam vergi iadesi tutarı hesaplandı.","changes":[]} },
  { user_command: "sipariş karşılama süresi 7 günü aşanları filtrele", logic: "Filter rows where order fulfillment time exceeds 7 days", category: "filter", output: {"action":"filter","condition":"greater_than","column":"Sipariş Karşılama Süresi","value":"7","reply":"✅ Sipariş karşılama süresi 7 günü aşan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "borç bakiyesi sütununun ortalamasını bul", logic: "Calculate average of debt balance column", category: "average", output: {"action":"average","column":"Borç Bakiyesi","reply":"✅ Borç bakiyesi sütununun ortalaması hesaplandı.","changes":[]} },
  { user_command: "stok sayım fazlası olan satırları yeşile boya", logic: "Highlight rows where stock count surplus exists with green color", category: "highlight", output: {"action":"highlight","condition":"greater_than","color":"#00FF00","reply":"✅ Stok sayım fazlası olan satırlar yeşil renkle işaretlendi.","changes":[]} },
  { user_command: "e-arşiv fatura seri numaralarının tekrarlarını kaldır", logic: "Remove duplicate e-archive invoice serial numbers", category: "remove_duplicates", output: {"action":"remove_duplicates","reply":"✅ Tekrarlanan e-arşiv fatura seri numaraları temizlendi.","changes":[]} },
  { user_command: "yeni bir satın alma siparişi satırı ekle", logic: "Add a new purchase order row", category: "add_row", output: {"action":"add_row","reply":"➕ Yeni bir satın alma siparişi satırı eklendi.","changes":[]} },
  { user_command: "gider türü elektrik olanların toplamını göster", logic: "Calculate total of electricity expense type rows", category: "sum", output: {"action":"sum","column":"Gider Tutarı","reply":"✅ Elektrik gideri türündeki satırların toplamı hesaplandı.","changes":[]} },
  { user_command: "çalışan maaşlarına yüzde 8 zam uygula", logic: "Increase all employee salaries by 8 percent", category: "update_cells", output: {"action":"update_cells","formula":"=B2*1.08","reply":"✅ Tüm çalışan maaşlarına %8 zam uygulandı.","changes":[]} },
  { user_command: "kargo teslim süresi sütununu küçükten büyüğe sırala", logic: "Sort cargo delivery time column ascending", category: "sort", output: {"action":"sort","direction":"asc","column":"Kargo Teslim Süresi","reply":"✅ Kargo teslim süresi sütunu küçükten büyüğe sıralandı.","changes":[]} },
  { user_command: "ödenmemiş faturaların toplam tutarını bul", logic: "Sum total amount of unpaid invoices", category: "sum", output: {"action":"sum","column":"Fatura Tutarı","reply":"✅ Ödenmemiş faturaların toplam tutarı hesaplandı.","changes":[]} },
  { user_command: "müşteri puanı 4 üzerinde olanları filtrele", logic: "Filter customers with rating above 4", category: "filter", output: {"action":"filter","condition":"greater_than","column":"Müşteri Puanı","value":"4","reply":"✅ Müşteri puanı 4'ün üzerinde olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "stok giriş miktarı sütununu topla", logic: "Sum stock entry quantity column", category: "sum", output: {"action":"sum","column":"Stok Giriş Miktarı","reply":"✅ Stok giriş miktarı sütununun toplamı hesaplandı.","changes":[]} },
  { user_command: "tedarikçi ödeme vadesi sütununu artan sıraya koy", logic: "Sort supplier payment due date column ascending", category: "sort", output: {"action":"sort","direction":"asc","column":"Tedarikçi Ödeme Vadesi","reply":"✅ Tedarikçi ödeme vadesi sütunu artan sıraya göre sıralandı.","changes":[]} },
  { user_command: "SGK bildirgesi verilmemiş çalışanları vurgula", logic: "Highlight employees without SGK declaration with yellow", category: "highlight", output: {"action":"highlight","condition":"is_empty","color":"#FFFF00","reply":"✅ SGK bildirgesi verilmemiş çalışanlar sarı renkle işaretlendi.","changes":[]} },
  { user_command: "geçersiz barkod içeren satırları sil", logic: "Delete rows containing invalid barcodes", category: "delete_rows", output: {"action":"delete_rows","condition":"invalid_barcode","reply":"🗑️ Geçersiz barkod içeren satırlar silindi.","changes":[]} },
  { user_command: "fatura döviz kuru sütununun ortalamasını hesapla", logic: "Calculate average of invoice exchange rate column", category: "average", output: {"action":"average","column":"Fatura Döviz Kuru","reply":"✅ Fatura döviz kuru sütununun ortalaması hesaplandı.","changes":[]} },
  { user_command: "depo lokasyon kodu sütununu alfabetik sırala", logic: "Sort warehouse location code column alphabetically", category: "sort", output: {"action":"sort","direction":"asc","column":"Depo Lokasyon Kodu","reply":"✅ Depo lokasyon kodu sütunu alfabetik olarak sıralandı.","changes":[]} },
  { user_command: "negatif stok değeri olan satırları kırmızıya boya", logic: "Highlight rows with negative stock value in red", category: "highlight", output: {"action":"highlight","condition":"less_than","color":"#FF0000","reply":"✅ Negatif stok değeri olan satırlar kırmızı renkle işaretlendi.","changes":[]} },
  { user_command: "yeni bir irsaliye satırı ekle", logic: "Add a new delivery note row", category: "add_row", output: {"action":"add_row","reply":"➕ Yeni bir irsaliye satırı eklendi.","changes":[]} },
  { user_command: "muhasebe hesap adlarını küçük harfe çevir", logic: "Convert accounting account names to lowercase", category: "transform", output: {"action":"transform","transform":"lowercase","reply":"✅ Muhasebe hesap adları küçük harfe çevrildi.","changes":[]} },
  { user_command: "KDV matrahı sıfır olan faturaları filtrele", logic: "Filter invoices where KDV base amount is zero", category: "filter", output: {"action":"filter","condition":"equals","column":"KDV Matrahı","value":"0","reply":"✅ KDV matrahı sıfır olan faturalar filtrelendi.","changes":[]} },
  { user_command: "toplam ihracat gümrük vergisini hesapla", logic: "Calculate total export customs duty", category: "sum", output: {"action":"sum","column":"Gümrük Vergisi","reply":"✅ Toplam ihracat gümrük vergisi hesaplandı.","changes":[]} },
  { user_command: "çalışan pozisyon sütununu büyük harfe çevir", logic: "Convert employee position column to uppercase", category: "transform", output: {"action":"transform","transform":"uppercase","reply":"✅ Çalışan pozisyon sütunundaki değerler büyük harfe çevrildi.","changes":[]} },
  { user_command: "net ücret sütununu büyükten küçüğe sırala", logic: "Sort net salary column descending", category: "sort", output: {"action":"sort","direction":"desc","column":"Net Ücret","reply":"✅ Net ücret sütunu büyükten küçüğe sıralandı.","changes":[]} },
  { user_command: "stok rezervasyon miktarı boş olanları sil", logic: "Delete rows where stock reservation quantity is empty", category: "delete_rows", output: {"action":"delete_rows","condition":"is_empty","reply":"🗑️ Stok rezervasyon miktarı boş olan satırlar silindi.","changes":[]} },
  { user_command: "satış faturalarının KDV tutarları toplamını göster", logic: "Sum KDV amounts from sales invoices", category: "sum", output: {"action":"sum","column":"KDV Tutarı","reply":"✅ Satış faturalarının toplam KDV tutarı hesaplandı.","changes":[]} },
  { user_command: "ürün son kullanma tarihi sütununu artan sıraya göre sırala", logic: "Sort product expiry date column ascending", category: "sort", output: {"action":"sort","direction":"asc","column":"Son Kullanma Tarihi","reply":"✅ Ürün son kullanma tarihi sütunu artan sıraya göre sıralandı.","changes":[]} },
  { user_command: "fazla mesai saati 20 üzeri olanları vurgula", logic: "Highlight rows where overtime hours exceed 20 with orange", category: "highlight", output: {"action":"highlight","condition":"greater_than","color":"#FFA500","reply":"✅ Fazla mesai saati 20'yi aşan satırlar turuncu renkle işaretlendi.","changes":[]} },
  { user_command: "yeni bir tahakkuk fişi satırı ekle", logic: "Add a new accrual voucher row", category: "add_row", output: {"action":"add_row","reply":"➕ Yeni bir tahakkuk fişi satırı eklendi.","changes":[]} },
  { user_command: "tedarikçi fatura numarası tekrarlananları temizle", logic: "Remove duplicate supplier invoice numbers", category: "remove_duplicates", output: {"action":"remove_duplicates","reply":"✅ Tekrarlanan tedarikçi fatura numaraları temizlendi.","changes":[]} },
  { user_command: "alacak bakiyesi sütununun ortalamasını bul", logic: "Calculate average of receivable balance column", category: "average", output: {"action":"average","column":"Alacak Bakiyesi","reply":"✅ Alacak bakiyesi sütununun ortalaması hesaplandı.","changes":[]} },
  { user_command: "ödeme yöntemi çek olanları filtrele", logic: "Filter rows where payment method is check", category: "filter", output: {"action":"filter","condition":"equals","column":"Ödeme Yöntemi","value":"Çek","reply":"✅ Ödeme yöntemi çek olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "çalışan işe giriş yılına göre sırala", logic: "Sort employees by year of hire ascending", category: "sort", output: {"action":"sort","direction":"asc","column":"İşe Giriş Yılı","reply":"✅ Çalışanlar işe giriş yılına göre sıralandı.","changes":[]} },
  { user_command: "toplam ambar çıkış maliyetini hesapla", logic: "Calculate total warehouse exit cost", category: "sum", output: {"action":"sum","column":"Ambar Çıkış Maliyeti","reply":"✅ Toplam ambar çıkış maliyeti hesaplandı.","changes":[]} },
  { user_command: "sözleşme tutarı 50000 TL üzeri olanları maviye boya", logic: "Highlight rows where contract amount exceeds 50000 TL in blue", category: "highlight", output: {"action":"highlight","condition":"greater_than","color":"#0000FF","reply":"✅ Sözleşme tutarı 50.000 TL'nin üzerindeki satırlar mavi renkle işaretlendi.","changes":[]} },
  { user_command: "ürün lot numarası sütununu büyük harfe çevir", logic: "Convert product lot number column to uppercase", category: "transform", output: {"action":"transform","transform":"uppercase","reply":"✅ Ürün lot numarası sütunundaki değerler büyük harfe çevrildi.","changes":[]} },
  { user_command: "tekrarlanan vergi levhası numaralarını kaldır", logic: "Remove duplicate tax plate numbers", category: "remove_duplicates", output: {"action":"remove_duplicates","reply":"✅ Tekrarlanan vergi levhası numaraları kaldırıldı.","changes":[]} },
  { user_command: "gelir vergisi matrahı en yüksek çalışanı bul", logic: "Find employee with highest income tax base", category: "max", output: {"action":"max","column":"Gelir Vergisi Matrahı","reply":"✅ Gelir vergisi matrahı en yüksek çalışan bulundu.","changes":[]} },
  { user_command: "kargo ağırlığı sütununu küçükten büyüğe sırala", logic: "Sort cargo weight column ascending", category: "sort", output: {"action":"sort","direction":"asc","column":"Kargo Ağırlığı","reply":"✅ Kargo ağırlığı sütunu küçükten büyüğe sıralandı.","changes":[]} },
  { user_command: "yeni bir ödeme emri satırı ekle", logic: "Add a new payment order row", category: "add_row", output: {"action":"add_row","reply":"➕ Yeni bir ödeme emri satırı eklendi.","changes":[]} },
  { user_command: "stok sayım tarihi boş olanları sarıya boya", logic: "Highlight rows where stock count date is empty in yellow", category: "highlight", output: {"action":"highlight","condition":"is_empty","color":"#FFFF00","reply":"✅ Stok sayım tarihi boş olan satırlar sarı renkle işaretlendi.","changes":[]} },
  { user_command: "ürün satış fiyatı ile maliyet fiyatı farkını hesapla", logic: "Calculate difference between product sale price and cost price", category: "update_cells", output: {"action":"update_cells","formula":"=SatisFiyati-MaliyetFiyati","reply":"✅ Ürün satış fiyatı ile maliyet fiyatı arasındaki fark hesaplandı.","changes":[]} },
  { user_command: "çalışan sözleşme türü sütununu büyük harfe çevir", logic: "Convert employee contract type column to uppercase", category: "transform", output: {"action":"transform","transform":"uppercase","reply":"✅ Çalışan sözleşme türü sütunundaki değerler büyük harfe çevrildi.","changes":[]} },
  { user_command: "sipariş iptali nedeni boş olanları filtrele", logic: "Filter rows where order cancellation reason is empty", category: "filter", output: {"action":"filter","condition":"is_empty","column":"İptal Nedeni","value":"","reply":"✅ Sipariş iptali nedeni boş olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "toplam kıdem tazminatı yükümlülüğünü hesapla", logic: "Calculate total severance pay liability", category: "sum", output: {"action":"sum","column":"Kıdem Tazminatı","reply":"✅ Toplam kıdem tazminatı yükümlülüğü hesaplandı.","changes":[]} },
  { user_command: "en düşük KDV oranını bul", logic: "Find minimum KDV rate in the column", category: "min", output: {"action":"min","column":"KDV Oranı","reply":"✅ En düşük KDV oranı bulundu.","changes":[]} },
  { user_command: "yeni bir masraf beyanı satırı ekle", logic: "Add a new expense declaration row", category: "add_row", output: {"action":"add_row","reply":"➕ Yeni bir masraf beyanı satırı eklendi.","changes":[]} },
  { user_command: "gecikme faizi tutarı sütununu büyükten küçüğe sırala", logic: "Sort late payment interest column descending", category: "sort", output: {"action":"sort","direction":"desc","column":"Gecikme Faizi Tutarı","reply":"✅ Gecikme faizi tutarı sütunu büyükten küçüğe sıralandı.","changes":[]} },
  { user_command: "stok minimum seviye altında olanları turuncu yap", logic: "Highlight rows where stock is below minimum level in orange", category: "highlight", output: {"action":"highlight","condition":"less_than","color":"#FFA500","reply":"✅ Stok minimum seviyesinin altındaki satırlar turuncu renkle işaretlendi.","changes":[]} },
  { user_command: "satın alma talebi durumu onaylı olanları filtrele", logic: "Filter purchase requests with approved status", category: "filter", output: {"action":"filter","condition":"equals","column":"Talep Durumu","value":"Onaylı","reply":"✅ Durumu onaylı olan satın alma talepleri filtrelendi.","changes":[]} },
  { user_command: "müşteri kredi limiti sütununun ortalamasını hesapla", logic: "Calculate average of customer credit limit column", category: "average", output: {"action":"average","column":"Kredi Limiti","reply":"✅ Müşteri kredi limiti sütununun ortalaması hesaplandı.","changes":[]} },
  { user_command: "tüm ürün barkodlarının baş harflerini büyüt", logic: "Capitalize first letter of all product barcodes", category: "transform", output: {"action":"transform","transform":"capitalize","reply":"✅ Ürün barkodlarının baş harfleri büyütüldü.","changes":[]} },
  { user_command: "sigorta poliçe numarası tekrarlananları kaldır", logic: "Remove duplicate insurance policy numbers", category: "remove_duplicates", output: {"action":"remove_duplicates","reply":"✅ Tekrarlanan sigorta poliçe numaraları kaldırıldı.","changes":[]} },
  { user_command: "depo transfer fişi tarihine göre sırala", logic: "Sort warehouse transfer voucher by date ascending", category: "sort", output: {"action":"sort","direction":"asc","column":"Transfer Fişi Tarihi","reply":"✅ Depo transfer fişi tarihe göre sıralandı.","changes":[]} },
  { user_command: "çalışan net maaşı 15000 TL altındakileri kırmızıya boya", logic: "Highlight employees with net salary below 15000 TL in red", category: "highlight", output: {"action":"highlight","condition":"less_than","color":"#FF0000","reply":"✅ Net maaşı 15.000 TL'nin altındaki çalışanlar kırmızı renkle işaretlendi.","changes":[]} },
  { user_command: "yeni bir teklif formu satırı ekle", logic: "Add a new quotation form row", category: "add_row", output: {"action":"add_row","reply":"➕ Yeni bir teklif formu satırı eklendi.","changes":[]} },
  { user_command: "toplam sigorta prim tutarını hesapla", logic: "Calculate total insurance premium amount", category: "sum", output: {"action":"sum","column":"Sigorta Primi","reply":"✅ Toplam sigorta prim tutarı hesaplandı.","changes":[]} },
  { user_command: "fatura ödeme tarihi geçmişleri filtrele", logic: "Filter overdue invoice payment dates", category: "filter", output: {"action":"filter","condition":"less_than","column":"Ödeme Tarihi","value":"TODAY","reply":"✅ Ödeme tarihi geçmiş faturalar filtrelendi.","changes":[]} },
  { user_command: "birim maliyet en düşük ürünü bul", logic: "Find product with lowest unit cost", category: "min", output: {"action":"min","column":"Birim Maliyet","reply":"✅ Birim maliyeti en düşük ürün bulundu.","changes":[]} },
  { user_command: "proje adı sütununu büyük harfe çevir", logic: "Convert project name column to uppercase", category: "transform", output: {"action":"transform","transform":"uppercase","reply":"✅ Proje adı sütunundaki değerler büyük harfe çevrildi.","changes":[]} },
  { user_command: "iade faturalarını filtrele", logic: "Filter rows marked as return invoices", category: "filter", output: {"action":"filter","condition":"equals","column":"Fatura Türü","value":"İade","reply":"✅ İade faturaları filtrelendi.","changes":[]} },
  { user_command: "toplam personel yol giderini hesapla", logic: "Calculate total employee travel expense", category: "sum", output: {"action":"sum","column":"Yol Gideri","reply":"✅ Toplam personel yol gideri hesaplandı.","changes":[]} },
  { user_command: "stok hareket kodu sütununu küçük harfe çevir", logic: "Convert stock movement code column to lowercase", category: "transform", output: {"action":"transform","transform":"lowercase","reply":"✅ Stok hareket kodu sütunundaki değerler küçük harfe çevrildi.","changes":[]} },
  { user_command: "depo sayım farkı sıfır olmayanları kırmızıya boya", logic: "Highlight rows where warehouse count difference is not zero in red", category: "highlight", output: {"action":"highlight","condition":"not_equals","color":"#FF0000","reply":"✅ Depo sayım farkı sıfır olmayan satırlar kırmızı renkle işaretlendi.","changes":[]} },
  { user_command: "yeni bir kredi notu satırı ekle", logic: "Add a new credit note row", category: "add_row", output: {"action":"add_row","reply":"➕ Yeni bir kredi notu satırı eklendi.","changes":[]} },
  { user_command: "tekrarlanan depo transfer numaralarını temizle", logic: "Remove duplicate warehouse transfer numbers", category: "remove_duplicates", output: {"action":"remove_duplicates","reply":"✅ Tekrarlanan depo transfer numaraları temizlendi.","changes":[]} },
  { user_command: "satış bölgesi karadeniz olanları filtrele", logic: "Filter rows where sales region is Karadeniz", category: "filter", output: {"action":"filter","condition":"equals","column":"Satış Bölgesi","value":"Karadeniz","reply":"✅ Satış bölgesi Karadeniz olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "çalışan yıllık izin hakkı sütununun toplamını hesapla", logic: "Calculate total annual leave entitlement of employees", category: "sum", output: {"action":"sum","column":"Yıllık İzin Hakkı","reply":"✅ Çalışanların toplam yıllık izin hakkı hesaplandı.","changes":[]} },
  { user_command: "ürün minimum sipariş adedi sütununu küçükten büyüğe sırala", logic: "Sort product minimum order quantity column ascending", category: "sort", output: {"action":"sort","direction":"asc","column":"Minimum Sipariş Adedi","reply":"✅ Ürün minimum sipariş adedi sütunu küçükten büyüğe sıralandı.","changes":[]} },
  { user_command: "kasa açığı olan satırları kırmızıya boya", logic: "Highlight rows with cash register shortage in red", category: "highlight", output: {"action":"highlight","condition":"less_than","color":"#FF0000","reply":"✅ Kasa açığı olan satırlar kırmızı renkle işaretlendi.","changes":[]} },
  { user_command: "yeni bir stok sayım satırı ekle", logic: "Add a new stock count row", category: "add_row", output: {"action":"add_row","reply":"➕ Yeni bir stok sayım satırı eklendi.","changes":[]} },
  { user_command: "toplam personel yemek giderini bul", logic: "Calculate total employee meal expense", category: "sum", output: {"action":"sum","column":"Yemek Gideri","reply":"✅ Toplam personel yemek gideri hesaplandı.","changes":[]} },
  { user_command: "müşteri sektörü sütununu büyük harfe çevir", logic: "Convert customer sector column to uppercase", category: "transform", output: {"action":"transform","transform":"uppercase","reply":"✅ Müşteri sektörü sütunundaki değerler büyük harfe çevrildi.","changes":[]} },
  { user_command: "tedarikçi ülkesi İtalya olanları filtrele", logic: "Filter rows where supplier country is Italy", category: "filter", output: {"action":"filter","condition":"equals","column":"Tedarikçi Ülkesi","value":"İtalya","reply":"✅ Tedarikçi ülkesi İtalya olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "tekrarlanan müşteri vergi numaralarını kaldır", logic: "Remove duplicate customer tax identification numbers", category: "remove_duplicates", output: {"action":"remove_duplicates","reply":"✅ Tekrarlanan müşteri vergi numaraları kaldırıldı.","changes":[]} },
  { user_command: "en yüksek kümülatif satış değerini göster", logic: "Find maximum cumulative sales value", category: "max", output: {"action":"max","column":"Kümülatif Satış","reply":"✅ En yüksek kümülatif satış değeri gösterildi.","changes":[]} },
  { user_command: "ürün fiyat sütununa otomatik KDV ekle", logic: "Add KDV automatically to product price column using formula", category: "update_cells", output: {"action":"update_cells","formula":"=B2*1.20","reply":"✅ Ürün fiyat sütununa %20 KDV otomatik olarak eklendi.","changes":[]} },
  { user_command: "çalışan departman kodu sütununu küçükten büyüğe sırala", logic: "Sort employee department code column ascending", category: "sort", output: {"action":"sort","direction":"asc","column":"Departman Kodu","reply":"✅ Çalışan departman kodu sütunu küçükten büyüğe sıralandı.","changes":[]} },
  { user_command: "yeni bir gümrük beyannamesi satırı ekle", logic: "Add a new customs declaration row", category: "add_row", output: {"action":"add_row","reply":"➕ Yeni bir gümrük beyannamesi satırı eklendi.","changes":[]} },
  { user_command: "toplam ihracat KDV iadesini hesapla", logic: "Calculate total export KDV refund", category: "sum", output: {"action":"sum","column":"İhracat KDV İadesi","reply":"✅ Toplam ihracat KDV iadesi hesaplandı.","changes":[]} },
  { user_command: "depo bölgesi anadolu olanları filtrele", logic: "Filter rows where warehouse region is Anadolu", category: "filter", output: {"action":"filter","condition":"equals","column":"Depo Bölgesi","value":"Anadolu","reply":"✅ Depo bölgesi Anadolu olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "nakit akış durumu negatif olanları kırmızıya boya", logic: "Highlight rows with negative cash flow in red", category: "highlight", output: {"action":"highlight","condition":"less_than","color":"#FF0000","reply":"✅ Nakit akış durumu negatif olan satırlar kırmızı renkle işaretlendi.","changes":[]} },
  { user_command: "çalışan şehir sütununu büyük harfe çevir", logic: "Convert employee city column to uppercase", category: "transform", output: {"action":"transform","transform":"uppercase","reply":"✅ Çalışan şehir sütunundaki değerler büyük harfe çevrildi.","changes":[]} },
  { user_command: "tekrarlanan ürün seri numaralarını temizle", logic: "Remove duplicate product serial numbers", category: "remove_duplicates", output: {"action":"remove_duplicates","reply":"✅ Tekrarlanan ürün seri numaraları temizlendi.","changes":[]} },

  // ──────────────────────────────────────────────────────────
  // AUTO-GENERATED 2026-06-06
  // ──────────────────────────────────────────────────────────
  { user_command: "net kâr sütununu hesapla ve ekle", logic: "Calculate net profit column by subtracting costs from revenue and add it", category: "muhasebe", output: {"action":"update_cells","formula":"=GelirSütunu-MaliyetSütunu","reply":"✅ Net kâr sütunu hesaplanarak tabloya eklendi.","changes":[]} },
  { user_command: "stok devir hızı kaç gün", logic: "Calculate inventory turnover rate in days", category: "stok", output: {"action":"message","reply":"ℹ️ Stok devir hızı: Ortalama Stok / Satılan Malın Maliyeti × Gün sayısı formülüyle hesaplandı.","changes":[]} },
  { user_command: "SGK matrahı sıfır olan çalışanları vurgula", logic: "Highlight employees where SGK base is zero", category: "bordro", output: {"action":"highlight","condition":"equals_zero","color":"#FF0000","reply":"✅ SGK matrahı sıfır olan çalışanlar kırmızıyla vurgulandı.","changes":[]} },
  { user_command: "e-fatura gönderim durumu boş olanları sarıya boya", logic: "Highlight rows where e-invoice sending status is empty with yellow", category: "e-fatura", output: {"action":"highlight","condition":"is_empty","color":"#FFFF00","reply":"✅ E-fatura gönderim durumu boş olan satırlar sarıya boyandı.","changes":[]} },
  { user_command: "tedarikçi ödeme vadesi 60 günden fazla olanları listele", logic: "Filter suppliers where payment term exceeds 60 days", category: "tedarik", output: {"action":"filter","condition":"greater_than","column":"Ödeme Vadesi","value":"60","reply":"✅ Ödeme vadesi 60 günden fazla olan tedarikçiler listelendi.","changes":[]} },
  { user_command: "brüt maaş ile net maaş arasındaki farkın ortalamasını bul", logic: "Calculate the average difference between gross and net salary", category: "bordro", output: {"action":"average","column":"BrütNetFark","reply":"✅ Brüt ve net maaş arasındaki farkın ortalaması hesaplandı.","changes":[]} },
  { user_command: "depo transfer tarihi bu ay olanları filtrele", logic: "Filter warehouse transfer records where transfer date is current month", category: "depo", output: {"action":"filter","condition":"current_month","column":"Transfer Tarihi","value":"bu_ay","reply":"✅ Bu ay gerçekleştirilen depo transferleri filtrelendi.","changes":[]} },
  { user_command: "satış faturası toplam adedini say", logic: "Count total number of sales invoices", category: "muhasebe", output: {"action":"count","column":"Fatura No","reply":"✅ Toplam satış faturası adedi hesaplandı.","changes":[]} },
  { user_command: "KDV matrahı en yüksek faturayı göster", logic: "Find the invoice with the highest VAT base amount", category: "e-fatura", output: {"action":"max","column":"KDV Matrahı","reply":"✅ KDV matrahı en yüksek fatura bulundu.","changes":[]} },
  { user_command: "çalışan izin bakiyesi 5 günden az olanları turuncu yap", logic: "Highlight employees with fewer than 5 days of leave balance in orange", category: "bordro", output: {"action":"highlight","condition":"less_than","color":"#FFA500","reply":"✅ İzin bakiyesi 5 günden az olan çalışanlar turuncuya boyandı.","changes":[]} },
  { user_command: "sipariş karşılama oranını hesapla", logic: "Calculate order fulfillment rate as percentage of completed orders", category: "satış", output: {"action":"update_cells","formula":"=TamamlananSipariş/ToplamSipariş*100","reply":"✅ Sipariş karşılama oranı yüzde olarak hesaplandı.","changes":[]} },
  { user_command: "ürün lot numaraları tekrarlananları kaldır", logic: "Remove duplicate product lot numbers from the table", category: "stok", output: {"action":"remove_duplicates","reply":"✅ Tekrarlanan ürün lot numaraları tablodan kaldırıldı.","changes":[]} },
  { user_command: "gelir vergisi stopajı en yüksek çalışanı bul", logic: "Find the employee with the highest income tax withholding amount", category: "bordro", output: {"action":"max","column":"Gelir Vergisi Stopajı","reply":"✅ Gelir vergisi stopajı en yüksek olan çalışan bulundu.","changes":[]} },
  { user_command: "depo çıkış fişi tarihi geçen haftaki kayıtları göster", logic: "Filter warehouse exit records from last week", category: "depo", output: {"action":"filter","condition":"last_week","column":"Çıkış Tarihi","value":"geçen_hafta","reply":"✅ Geçen haftaki depo çıkış fişleri gösterildi.","changes":[]} },
  { user_command: "tüm ürün satış fiyatlarına yüzde 7 zam uygula", logic: "Increase all product sale prices by 7 percent", category: "satış", output: {"action":"update_cells","formula":"=SatisFiyati*1.07","reply":"✅ Tüm ürün satış fiyatlarına %7 zam uygulandı.","changes":[]} },
  { user_command: "fatura seri numarası boş olan satırları sil", logic: "Delete rows where invoice serial number is empty", category: "e-fatura", output: {"action":"delete_rows","condition":"is_empty_serial_number","reply":"🗑️ Fatura seri numarası boş olan satırlar silindi.","changes":[]} },
  { user_command: "satış kanalı bayi olanları filtrele", logic: "Filter records where sales channel is dealer", category: "satış", output: {"action":"filter","condition":"equals","column":"Satış Kanalı","value":"Bayi","reply":"✅ Satış kanalı 'Bayi' olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "toplam ihracat fatura adedini say", logic: "Count the total number of export invoices", category: "muhasebe", output: {"action":"count","column":"İhracat Fatura No","reply":"✅ Toplam ihracat faturası adedi sayıldı.","changes":[]} },
  { user_command: "çalışan kıdem yılı 10 ve üzeri olanları maviye boya", logic: "Highlight employees with 10 or more years of seniority in blue", category: "bordro", output: {"action":"highlight","condition":"greater_than_or_equal","color":"#0000FF","reply":"✅ Kıdem yılı 10 ve üzeri olan çalışanlar maviye boyandı.","changes":[]} },
  { user_command: "stok giriş miktarı en yüksek ürünü bul", logic: "Find the product with the highest stock entry quantity", category: "stok", output: {"action":"max","column":"Stok Giriş Miktarı","reply":"✅ Stok giriş miktarı en yüksek ürün bulundu.","changes":[]} },
  { user_command: "KDV oranı %18 olan ürünlerin KDV tutarını topla", logic: "Sum the VAT amounts for products with 18 percent VAT rate", category: "muhasebe", output: {"action":"sum","column":"KDV Tutarı","reply":"✅ KDV oranı %18 olan ürünlerin toplam KDV tutarı hesaplandı.","changes":[]} },
  { user_command: "tedarikçi fatura tarihi en eskiden en yeniye sırala", logic: "Sort supplier invoice dates from oldest to newest", category: "tedarik", output: {"action":"sort","direction":"asc","column":"Tedarikçi Fatura Tarihi","reply":"✅ Tedarikçi fatura tarihleri eskiden yeniye sıralandı.","changes":[]} },
  { user_command: "depo minimum stok seviyesi altında olanları kırmızıya boya", logic: "Highlight warehouse items below minimum stock level in red", category: "depo", output: {"action":"highlight","condition":"below_minimum","color":"#FF0000","reply":"✅ Minimum stok seviyesinin altındaki ürünler kırmızıya boyandı.","changes":[]} },
  { user_command: "yeni bir satın alma faturası satırı ekle", logic: "Add a new row for a purchase invoice entry", category: "muhasebe", output: {"action":"add_row","reply":"➕ Yeni bir satın alma faturası satırı eklendi.","changes":[]} },
  { user_command: "çalışan pozisyonu uzman olanları filtrele", logic: "Filter employees whose position is specialist", category: "bordro", output: {"action":"filter","condition":"equals","column":"Pozisyon","value":"Uzman","reply":"✅ Pozisyonu 'Uzman' olan çalışanlar filtrelendi.","changes":[]} },
  { user_command: "aylık satış büyüme oranını hesapla", logic: "Calculate month-over-month sales growth rate", category: "satış", output: {"action":"update_cells","formula":"=(BuAySatış-GeçenAySatış)/GeçenAySatış*100","reply":"✅ Aylık satış büyüme oranı hesaplandı.","changes":[]} },
  { user_command: "ürün son kullanma tarihi 30 günden az kalanları vurgula", logic: "Highlight products with less than 30 days until expiry", category: "stok", output: {"action":"highlight","condition":"expiry_less_than_30_days","color":"#FF6600","reply":"✅ Son kullanma tarihi 30 günden az kalan ürünler vurgulandı.","changes":[]} },
  { user_command: "SGK işveren prim tutarının toplamını bul", logic: "Calculate the total employer SGK premium amount", category: "bordro", output: {"action":"sum","column":"İşveren SGK Primi","reply":"✅ SGK işveren prim tutarlarının toplamı hesaplandı.","changes":[]} },
  { user_command: "e-fatura iptal nedeni boş olanları sarıya boya", logic: "Highlight e-invoices with empty cancellation reason in yellow", category: "e-fatura", output: {"action":"highlight","condition":"is_empty","color":"#FFFF00","reply":"✅ İptal nedeni boş olan e-fatura satırları sarıya boyandı.","changes":[]} },
  { user_command: "kargo firması Yurtiçi olanları filtrele", logic: "Filter shipments where cargo company is Yurtiçi", category: "satış", output: {"action":"filter","condition":"equals","column":"Kargo Firması","value":"Yurtiçi","reply":"✅ Kargo firması 'Yurtiçi' olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "toplam personel eğitim giderini hesapla", logic: "Calculate total employee training expenses", category: "bordro", output: {"action":"sum","column":"Eğitim Gideri","reply":"✅ Toplam personel eğitim gideri hesaplandı.","changes":[]} },
  { user_command: "depo sayım tarihi geçmiş olanları filtrele", logic: "Filter warehouse inventory records with past count dates", category: "depo", output: {"action":"filter","condition":"past_date","column":"Sayım Tarihi","value":"geçmiş","reply":"✅ Sayım tarihi geçmiş depo kayıtları filtrelendi.","changes":[]} },
  { user_command: "fatura döviz kuru TRY olmayanlara filtrele", logic: "Filter invoices where currency is not TRY", category: "muhasebe", output: {"action":"filter","condition":"not_equals","column":"Döviz Kuru","value":"TRY","reply":"✅ Döviz kuru TRY olmayan faturalar filtrelendi.","changes":[]} },
  { user_command: "satış hedefi gerçekleşme oranı sütununu ekle", logic: "Add a column showing sales target achievement percentage", category: "satış", output: {"action":"update_cells","formula":"=GerçekleşenSatış/HedefSatış*100","reply":"✅ Satış hedefi gerçekleşme oranı sütunu eklendi.","changes":[]} },
  { user_command: "ürün kategori adlarını büyük harfe çevir", logic: "Convert all product category names to uppercase", category: "stok", output: {"action":"transform","transform":"uppercase","reply":"✅ Ürün kategori adları büyük harfe çevrildi.","changes":[]} },
  { user_command: "çalışan işe giriş tarihi 2020 öncesi olanları listele", logic: "Filter employees who joined before 2020", category: "bordro", output: {"action":"filter","condition":"before_year","column":"İşe Giriş Tarihi","value":"2020","reply":"✅ 2020 öncesi işe giren çalışanlar listelendi.","changes":[]} },
  { user_command: "KDV dahil fatura toplamını hesapla", logic: "Calculate total invoice amount including VAT", category: "e-fatura", output: {"action":"sum","column":"KDV Dahil Tutar","reply":"✅ KDV dahil toplam fatura tutarı hesaplandı.","changes":[]} },
  { user_command: "tedarikçi teslim süresi ortalamasını hesapla", logic: "Calculate average supplier delivery time", category: "tedarik", output: {"action":"average","column":"Teslim Süresi","reply":"✅ Tedarikçi ortalama teslim süresi hesaplandı.","changes":[]} },
  { user_command: "satış miktarı sıfır olan ürün satırlarını sil", logic: "Delete product rows where sales quantity is zero", category: "satış", output: {"action":"delete_rows","condition":"sales_quantity_zero","reply":"🗑️ Satış miktarı sıfır olan ürün satırları silindi.","changes":[]} },
  { user_command: "depo doluluk yüzdesi 80 üzeri olanları turuncu yap", logic: "Highlight warehouse records with more than 80 percent capacity usage in orange", category: "depo", output: {"action":"highlight","condition":"greater_than","color":"#FFA500","reply":"✅ Depo doluluk yüzdesi %80 üzeri olan kayıtlar turuncuya boyandı.","changes":[]} },
  { user_command: "stok çıkış miktarları toplamını hesapla", logic: "Calculate total stock exit quantity", category: "stok", output: {"action":"sum","column":"Stok Çıkış Miktarı","reply":"✅ Toplam stok çıkış miktarı hesaplandı.","changes":[]} },
  { user_command: "ödeme vadesi bugün olan faturaları vurgula", logic: "Highlight invoices whose payment due date is today", category: "muhasebe", output: {"action":"highlight","condition":"equals_today","color":"#FF9900","reply":"✅ Ödeme vadesi bugün olan faturalar vurgulandı.","changes":[]} },
  { user_command: "SGK prim günü eksik olanları filtrele", logic: "Filter records where SGK premium days are incomplete", category: "bordro", output: {"action":"filter","condition":"less_than_30","column":"SGK Prim Günü","value":"30","reply":"✅ SGK prim günü eksik olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "fatura tutarı ortalamasının iki katından fazla olanları vurgula", logic: "Highlight invoices where amount is more than twice the average", category: "muhasebe", output: {"action":"highlight","condition":"greater_than_twice_average","color":"#FF0000","reply":"✅ Ortalama fatura tutarının iki katından fazla olan satırlar vurgulandı.","changes":[]} },
  { user_command: "ürün temin süresi sütununa göre artan sırala", logic: "Sort products by procurement lead time in ascending order", category: "tedarik", output: {"action":"sort","direction":"asc","column":"Temin Süresi","reply":"✅ Ürünler temin süresine göre artan sıraya dizildi.","changes":[]} },
  { user_command: "çalışan net maaş ortalamasını hesapla", logic: "Calculate average net salary of employees", category: "bordro", output: {"action":"average","column":"Net Maaş","reply":"✅ Çalışanların net maaş ortalaması hesaplandı.","changes":[]} },
  { user_command: "yeni bir gümrük gideri satırı ekle", logic: "Add a new row for a customs expense entry", category: "muhasebe", output: {"action":"add_row","reply":"➕ Yeni bir gümrük gideri satırı eklendi.","changes":[]} },
  { user_command: "e-fatura UUID boş olanları filtrele", logic: "Filter e-invoices where UUID field is empty", category: "e-fatura", output: {"action":"filter","condition":"is_empty","column":"UUID","value":"","reply":"✅ UUID alanı boş olan e-fatura kayıtları filtrelendi.","changes":[]} },
  { user_command: "stok rezervasyon miktarı en yüksek ürünü göster", logic: "Find the product with the highest reserved stock quantity", category: "stok", output: {"action":"max","column":"Rezervasyon Miktarı","reply":"✅ Stok rezervasyon miktarı en yüksek ürün gösterildi.","changes":[]} },
  { user_command: "satış temsilcisi komisyon oranı sütununu küçükten büyüğe sırala", logic: "Sort sales representative commission rates in ascending order", category: "satış", output: {"action":"sort","direction":"asc","column":"Komisyon Oranı","reply":"✅ Komisyon oranı sütunu küçükten büyüğe sıralandı.","changes":[]} },
  { user_command: "depo raf numarası boş olanları sarıya boya", logic: "Highlight warehouse records with empty shelf number in yellow", category: "depo", output: {"action":"highlight","condition":"is_empty","color":"#FFFF00","reply":"✅ Raf numarası boş olan depo kayıtları sarıya boyandı.","changes":[]} },
  { user_command: "toplam personel seyahat giderini bul", logic: "Calculate total employee travel expenses", category: "bordro", output: {"action":"sum","column":"Seyahat Gideri","reply":"✅ Toplam personel seyahat gideri hesaplandı.","changes":[]} },
  { user_command: "KDV oranı %20 olan ürünleri filtrele", logic: "Filter products with 20 percent VAT rate", category: "e-fatura", output: {"action":"filter","condition":"equals","column":"KDV Oranı","value":"%20","reply":"✅ KDV oranı %20 olan ürünler filtrelendi.","changes":[]} },
  { user_command: "müşteri kredi limiti aşanları kırmızıya boya", logic: "Highlight customers who have exceeded their credit limit in red", category: "muhasebe", output: {"action":"highlight","condition":"exceeds_credit_limit","color":"#FF0000","reply":"✅ Kredi limitini aşan müşteriler kırmızıya boyandı.","changes":[]} },
  { user_command: "tedarikçi vergi numarası 10 haneden az olanları vurgula", logic: "Highlight suppliers whose tax number has fewer than 10 digits", category: "tedarik", output: {"action":"highlight","condition":"length_less_than","color":"#FF6600","reply":"✅ Vergi numarası 10 haneden az olan tedarikçiler vurgulandı.","changes":[]} },
  { user_command: "fatura kesim saati sütununu ekle", logic: "Add a column for invoice creation time", category: "e-fatura", output: {"action":"update_cells","formula":"=ŞİMDİ()","reply":"✅ Fatura kesim saati sütunu eklendi.","changes":[]} },
  { user_command: "stok giriş ve çıkış bakiyesini hesapla", logic: "Calculate net stock balance by subtracting outgoing from incoming stock", category: "stok", output: {"action":"update_cells","formula":"=StokGiriş-StokÇıkış","reply":"✅ Stok giriş ve çıkış bakiyesi hesaplandı.","changes":[]} },
  { user_command: "çalışan doğum ayı Ocak olanları listele", logic: "Filter employees born in January", category: "bordro", output: {"action":"filter","condition":"birth_month_equals","column":"Doğum Tarihi","value":"Ocak","reply":"✅ Doğum ayı Ocak olan çalışanlar listelendi.","changes":[]} },
  { user_command: "toplam iade edilen mal tutarını hesapla", logic: "Calculate total value of returned goods", category: "satış", output: {"action":"sum","column":"İade Tutarı","reply":"✅ Toplam iade edilen mal tutarı hesaplandı.","changes":[]} },
  { user_command: "depo bölgesi Akdeniz olanları filtrele", logic: "Filter warehouse records where region is Akdeniz", category: "depo", output: {"action":"filter","condition":"equals","column":"Depo Bölgesi","value":"Akdeniz","reply":"✅ Depo bölgesi 'Akdeniz' olan kayıtlar filtrelendi.","changes":[]} },
  { user_command: "ürün fiyat sütunundaki boş hücreleri varsayılan fiyatla doldur", logic: "Fill empty price cells with a default price value", category: "stok", output: {"action":"update_cells","formula":"=EĞER(BOŞSA(B2),0,B2)","reply":"✅ Boş fiyat hücreleri varsayılan değerle dolduruldu.","changes":[]} },
  { user_command: "en düşük KDV matrahını bul", logic: "Find the minimum VAT base amount", category: "muhasebe", output: {"action":"min","column":"KDV Matrahı","reply":"✅ En düşük KDV matrahı bulundu.","changes":[]} },
  { user_command: "SGK bildirgesi tarihi geçmiş olanları kırmızıya boya", logic: "Highlight SGK declaration records with past deadlines in red", category: "bordro", output: {"action":"highlight","condition":"past_date","color":"#FF0000","reply":"✅ SGK bildirgesi tarihi geçmiş kayıtlar kırmızıya boyandı.","changes":[]} },
  { user_command: "yeni bir amortiman gideri satırı ekle", logic: "Add a new row for a depreciation expense entry", category: "muhasebe", output: {"action":"add_row","reply":"➕ Yeni bir amortisman gideri satırı eklendi.","changes":[]} },
  { user_command: "sipariş onay tarihi sütununu büyükten küçüğe sırala", logic: "Sort order approval dates from newest to oldest", category: "satış", output: {"action":"sort","direction":"desc","column":"Onay Tarihi","reply":"✅ Sipariş onay tarihleri büyükten küçüğe sıralandı.","changes":[]} },
  { user_command: "stok sayım noksanlığı tutarını topla", logic: "Calculate total inventory count shortage amount", category: "stok", output: {"action":"sum","column":"Sayım Noksanlığı","reply":"✅ Toplam stok sayım noksanlığı tutarı hesaplandı.","changes":[]} },
  { user_command: "e-fatura senaryosu TEMELFATURA olanları filtrele", logic: "Filter e-invoices with scenario TEMELFATURA", category: "e-fatura", output: {"action":"filter","condition":"equals","column":"Senaryo","value":"TEMELFATURA","reply":"✅ Senaryo 'TEMELFATURA' olan e-faturalar filtrelendi.","changes":[]} },
  { user_command: "çalışan haftalık çalışma saati 45 üzeri olanları vurgula", logic: "Highlight employees who work more than 45 hours per week", category: "bordro", output: {"action":"highlight","condition":"greater_than","color":"#FF9900","reply":"✅ Haftalık çalışma saati 45 üzeri olan çalışanlar vurgulandı.","changes":[]} },
  { user_command: "depo giriş miktarı ortalamasını hesapla", logic: "Calculate average warehouse entry quantity", category: "depo", output: {"action":"average","column":"Giriş Miktarı","reply":"✅ Depo giriş miktarı ortalaması hesaplandı.","changes":[]} },
  { user_command: "satış bölgesi Marmara olanların toplam cirosunu hesapla", logic: "Calculate total revenue for sales region Marmara", category: "satış", output: {"action":"sum","column":"Ciro","reply":"✅ Marmara bölgesinin toplam cirosu hesaplandı.","changes":[]} },
  { user_command: "fatura tutarı en küçük 5 kaydı listele", logic: "List the 5 invoices with the smallest amounts", category: "muhasebe", output: {"action":"filter","condition":"bottom_5","column":"Fatura Tutarı","value":"5","reply":"✅ Fatura tutarı en küçük 5 kayıt listelendi.","changes":[]} },
  { user_command: "ürün barkod uzunluğu 13 olmayanlara filtrele", logic: "Filter products where barcode length is not 13 digits", category: "stok", output: {"action":"filter","condition":"length_not_equals","column":"Barkod","value":"13","reply":"✅ Barkod uzunluğu 13 olmayan ürünler filtrelendi.","changes":[]} },
  { user_command: "tedarikçi adı sütununda boş olanları sil", logic: "Delete rows where supplier name column is empty", category: "tedarik", output: {"action":"delete_rows","condition":"supplier_name_empty","reply":"🗑️ Tedarikçi adı boş olan satırlar silindi.","changes":[]} },
  { user_command: "çalışan maaş skalasının dışında kalan kayıtları vurgula", logic: "Highlight employee records where salary falls outside defined salary scale", category: "bordro", output: {"action":"highlight","condition":"outside_salary_range","color":"#FF6600","reply":"✅ Maaş skalasının dışında kalan çalışan kayıtları vurgulandı.","changes":[]} },
  { user_command: "yeni bir kur farkı gideri satırı ekle", logic: "Add a new row for a foreign exchange loss expense", category: "muhasebe", output: {"action":"add_row","reply":"➕ Yeni bir kur farkı gideri satırı eklendi.","changes":[]} },
  { user_command: "e-fatura iptal tarihi geçen ay olanları filtrele", logic: "Filter cancelled e-invoices from last month", category: "e-fatura", output: {"action":"filter","condition":"last_month","column":"İptal Tarihi","value":"geçen_ay","reply":"✅ Geçen ay iptal edilen e-faturalar filtrelendi.","changes":[]} },
  { user_command: "stok miktarı 500 üzeri olanları yeşile boya", logic: "Highlight products with stock quantity above 500 in green", category: "stok", output: {"action":"highlight","condition":"greater_than","color":"#00FF00","reply":"✅ Stok miktarı 500 üzeri olan ürünler yeşile boyandı.","changes":[]} },
  { user_command: "satış faturası kesilen ama sevkiyatı yapılmayanları vurgula", logic: "Highlight invoiced but not yet shipped orders", category: "satış", output: {"action":"highlight","condition":"invoiced_not_shipped","color":"#FF9900","reply":"✅ Faturası kesilip sevkiyatı yapılmayan siparişler vurgulandı.","changes":[]} },
  { user_command: "depo sorumlusu adlarını büyük harfe çevir", logic: "Convert all warehouse manager names to uppercase", category: "depo", output: {"action":"transform","transform":"uppercase","reply":"✅ Depo sorumlusu adları büyük harfe çevrildi.","changes":[]} },
  { user_command: "toplam işçi maaliyetini hesapla", logic: "Calculate total labor cost including all deductions and benefits", category: "bordro", output: {"action":"sum","column":"İşçi Maliyeti","reply":"✅ Toplam işçi maliyeti hesaplandı.","changes":[]} },

  // --- merge_columns ---
  { user_command: "ad ve soyadı birleştir", logic: "merge first name and last name columns", category: "structure", output: {"action":"merge_columns","columns":["Ad","Soyad"],"separator":" ","target_column":"Tam Ad","reply":"✓ Ad ve soyad birleştirildi","changes":[]} },
  { user_command: "iki sütunu tek sütunda birleştir", logic: "merge two columns into one", category: "structure", output: {"action":"merge_columns","columns":["A","B"],"separator":" ","target_column":"C","reply":"✓ Sütunlar birleştirildi","changes":[]} },
  { user_command: "isim sütunlarını birleştir", logic: "combine name columns", category: "structure", output: {"action":"merge_columns","columns":["Ad","Soyad"],"separator":" ","target_column":"Tam Ad","reply":"✓ İsim sütunları birleştirildi","changes":[]} },
  { user_command: "şehir ve ilçeyi birleştir", logic: "merge city and district into one field", category: "structure", output: {"action":"merge_columns","columns":["Şehir","İlçe"],"separator":"/","target_column":"Konum","reply":"✓ Şehir ve ilçe birleştirildi","changes":[]} },
  { user_command: "ürün kodu ve adını birleştir", logic: "concatenate product code and name", category: "structure", output: {"action":"merge_columns","columns":["Ürün Kodu","Ürün Adı"],"separator":" - ","target_column":"Ürün","reply":"✓ Ürün kodu ve adı birleştirildi","changes":[]} },
  { user_command: "A ve B sütununu birleştir", logic: "merge column A and column B", category: "structure", output: {"action":"merge_columns","columns":["A","B"],"separator":" ","target_column":"C","reply":"✓ A ve B sütunları birleştirildi","changes":[]} },
  { user_command: "ad soyad tek sütun yap", logic: "combine first and last name into single column", category: "structure", output: {"action":"merge_columns","columns":["Ad","Soyad"],"separator":" ","target_column":"Ad Soyad","reply":"✓ Ad soyad tek sütuna alındı","changes":[]} },
  { user_command: "sokak ve mahalle sütunlarını birleştir", logic: "merge street and neighborhood columns", category: "structure", output: {"action":"merge_columns","columns":["Sokak","Mahalle"],"separator":", ","target_column":"Adres","reply":"✓ Adres sütunları birleştirildi","changes":[]} },
  { user_command: "telefon kodunu telefon numarasıyla birleştir", logic: "combine phone country code with phone number", category: "structure", output: {"action":"merge_columns","columns":["Alan Kodu","Telefon"],"separator":"-","target_column":"Telefon Numarası","reply":"✓ Telefon sütunları birleştirildi","changes":[]} },
  { user_command: "iki kolonu birleştir aralarına virgül koy", logic: "merge two columns with comma separator", category: "structure", output: {"action":"merge_columns","columns":["A","B"],"separator":", ","target_column":"C","reply":"✓ Sütunlar virgülle birleştirildi","changes":[]} },
  { user_command: "sütunları birleştir", logic: "merge columns together", category: "structure", output: {"action":"merge_columns","columns":["A","B"],"separator":" ","target_column":"C","reply":"✓ Sütunlar birleştirildi","changes":[]} },
  { user_command: "kategori ve alt kategoriyi birleştir", logic: "merge category and subcategory columns", category: "structure", output: {"action":"merge_columns","columns":["Kategori","Alt Kategori"],"separator":" > ","target_column":"Tam Kategori","reply":"✓ Kategori sütunları birleştirildi","changes":[]} },
  { user_command: "tarih ve saat sütunlarını birleştir", logic: "merge date and time into single datetime column", category: "structure", output: {"action":"merge_columns","columns":["Tarih","Saat"],"separator":" ","target_column":"Tarih Saat","reply":"✓ Tarih ve saat birleştirildi","changes":[]} },
  { user_command: "bölge ve şehri tek hücrede göster", logic: "show region and city in one cell", category: "structure", output: {"action":"merge_columns","columns":["Bölge","Şehir"],"separator":" - ","target_column":"Konum","reply":"✓ Bölge ve şehir birleştirildi","changes":[]} },
  { user_command: "fatura no ve tarih birleştir", logic: "concatenate invoice number and date", category: "muhasebe", output: {"action":"merge_columns","columns":["Fatura No","Tarih"],"separator":" / ","target_column":"Fatura Bilgisi","reply":"✓ Fatura no ve tarih birleştirildi","changes":[]} },

  // --- split_column ---
  { user_command: "ad soyad sütununu ikiye ayır", logic: "split full name column into first and last name", category: "structure", output: {"action":"split_column","column":"Ad Soyad","separator":" ","new_columns":["Ad","Soyad"],"reply":"✓ Ad soyad sütunu ayrıldı","changes":[]} },
  { user_command: "tam adı ad ve soyad olarak böl", logic: "divide full name into first name and last name", category: "structure", output: {"action":"split_column","column":"Tam Ad","separator":" ","new_columns":["Ad","Soyad"],"reply":"✓ Ad ve soyad sütunlarına ayrıldı","changes":[]} },
  { user_command: "tarih sütununu gün ay yıl olarak ayır", logic: "split date column into day, month, year parts", category: "structure", output: {"action":"split_column","column":"Tarih","separator":"/","new_columns":["Gün","Ay","Yıl"],"reply":"✓ Tarih sütunu ayrıldı","changes":[]} },
  { user_command: "virgülle ayrılmış değerleri farklı sütunlara böl", logic: "split comma-separated values into separate columns", category: "structure", output: {"action":"split_column","column":"A","separator":",","new_columns":["B","C"],"reply":"✓ Değerler ayrı sütunlara bölündü","changes":[]} },
  { user_command: "adres sütununu ayır", logic: "split address column into parts", category: "structure", output: {"action":"split_column","column":"Adres","separator":",","new_columns":["Sokak","Mahalle","Şehir"],"reply":"✓ Adres sütunu ayrıldı","changes":[]} },
  { user_command: "sütunu böl", logic: "split column into multiple columns", category: "structure", output: {"action":"split_column","column":"A","separator":" ","new_columns":["B","C"],"reply":"✓ Sütun bölündü","changes":[]} },
  { user_command: "A sütununu iki parçaya ayır", logic: "split column A into two parts", category: "structure", output: {"action":"split_column","column":"A","separator":" ","new_columns":["B","C"],"reply":"✓ A sütunu iki parçaya ayrıldı","changes":[]} },
  { user_command: "telefon numarasını alan kodu ve numara olarak ayır", logic: "split phone number into area code and number", category: "structure", output: {"action":"split_column","column":"Telefon","separator":"-","new_columns":["Alan Kodu","Numara"],"reply":"✓ Telefon sütunu ayrıldı","changes":[]} },
  { user_command: "ürün kodu ve adını ayır", logic: "separate product code from product name", category: "structure", output: {"action":"split_column","column":"Ürün","separator":" - ","new_columns":["Ürün Kodu","Ürün Adı"],"reply":"✓ Ürün sütunu ayrıldı","changes":[]} },
  { user_command: "ismi soyaddan ayır", logic: "separate first name from last name", category: "structure", output: {"action":"split_column","column":"Ad Soyad","separator":" ","new_columns":["Ad","Soyad"],"reply":"✓ Ad ve soyad ayrıldı","changes":[]} },
  { user_command: "tire ile ayrılmış sütunu böl", logic: "split hyphen-separated column", category: "structure", output: {"action":"split_column","column":"A","separator":"-","new_columns":["B","C"],"reply":"✓ Sütun tire ile bölündü","changes":[]} },
  { user_command: "tarih sütununu parçalara ayır", logic: "split date column into components", category: "date", output: {"action":"split_column","column":"Tarih","separator":"-","new_columns":["Yıl","Ay","Gün"],"reply":"✓ Tarih sütunu ayrıldı","changes":[]} },
  { user_command: "il ve ilçeyi ayır", logic: "split city and district column", category: "structure", output: {"action":"split_column","column":"İl/İlçe","separator":"/","new_columns":["İl","İlçe"],"reply":"✓ İl ve ilçe ayrıldı","changes":[]} },
  { user_command: "e-posta adresinden domain kısmını ayır", logic: "extract domain part from email address column", category: "structure", output: {"action":"split_column","column":"E-posta","separator":"@","new_columns":["Kullanıcı Adı","Domain"],"reply":"✓ E-posta sütunu ayrıldı","changes":[]} },
  { user_command: "tam ismi parçalara böl", logic: "split full name into components", category: "structure", output: {"action":"split_column","column":"Tam İsim","separator":" ","new_columns":["Ad","Soyad"],"reply":"✓ İsim parçalara bölündü","changes":[]} },

  // --- rename_column ---
  { user_command: "sütun adını değiştir", logic: "rename a column header", category: "structure", output: {"action":"rename_column","old_name":"A","new_name":"Yeni Ad","reply":"✓ Sütun adı değiştirildi","changes":[]} },
  { user_command: "A sütununun başlığını değiştir", logic: "change column A header name", category: "structure", output: {"action":"rename_column","old_name":"A","new_name":"Ürün Adı","reply":"✓ Sütun başlığı değiştirildi","changes":[]} },
  { user_command: "sütun başlığını yeniden adlandır", logic: "rename column heading", category: "structure", output: {"action":"rename_column","old_name":"A","new_name":"Yeni Başlık","reply":"✓ Sütun yeniden adlandırıldı","changes":[]} },
  { user_command: "Tutar sütununu Fiyat olarak değiştir", logic: "rename Tutar column to Fiyat", category: "structure", output: {"action":"rename_column","old_name":"Tutar","new_name":"Fiyat","reply":"✓ Tutar sütunu Fiyat olarak değiştirildi","changes":[]} },
  { user_command: "isim sütununu Ad Soyad yap", logic: "rename name column to Ad Soyad", category: "structure", output: {"action":"rename_column","old_name":"İsim","new_name":"Ad Soyad","reply":"✓ Sütun adı güncellendi","changes":[]} },
  { user_command: "başlık adını değiştir", logic: "change column header name", category: "structure", output: {"action":"rename_column","old_name":"A","new_name":"Yeni Başlık","reply":"✓ Başlık adı değiştirildi","changes":[]} },
  { user_command: "B sütununu Maaş olarak adlandır", logic: "name column B as Maaş", category: "hr", output: {"action":"rename_column","old_name":"B","new_name":"Maaş","reply":"✓ B sütunu Maaş olarak adlandırıldı","changes":[]} },
  { user_command: "kolon ismini değiştir", logic: "change column name", category: "structure", output: {"action":"rename_column","old_name":"A","new_name":"Yeni İsim","reply":"✓ Kolon ismi değiştirildi","changes":[]} },
  { user_command: "Tarih sütununu Sipariş Tarihi yap", logic: "rename Tarih column to Sipariş Tarihi", category: "satış", output: {"action":"rename_column","old_name":"Tarih","new_name":"Sipariş Tarihi","reply":"✓ Sütun adı güncellendi","changes":[]} },
  { user_command: "sütun başlığını düzenle", logic: "edit column header", category: "structure", output: {"action":"rename_column","old_name":"A","new_name":"Düzenlendi","reply":"✓ Sütun başlığı düzenlendi","changes":[]} },
  { user_command: "C kolonunu Adet olarak değiştir", logic: "rename column C to Adet", category: "structure", output: {"action":"rename_column","old_name":"C","new_name":"Adet","reply":"✓ C kolonu Adet olarak değiştirildi","changes":[]} },
  { user_command: "sütun yeniden adlandır", logic: "rename column", category: "structure", output: {"action":"rename_column","old_name":"A","new_name":"Yeni","reply":"✓ Sütun adlandırıldı","changes":[]} },
  { user_command: "Miktar sütununu Stok Miktarı olarak güncelle", logic: "update Miktar column name to Stok Miktarı", category: "stok", output: {"action":"rename_column","old_name":"Miktar","new_name":"Stok Miktarı","reply":"✓ Sütun adı güncellendi","changes":[]} },
  { user_command: "başlığı yenile", logic: "refresh column header", category: "structure", output: {"action":"rename_column","old_name":"A","new_name":"Yeni Başlık","reply":"✓ Başlık yenilendi","changes":[]} },
  { user_command: "Müşteri sütununu Müşteri Adı yap", logic: "rename Müşteri column to Müşteri Adı", category: "satış", output: {"action":"rename_column","old_name":"Müşteri","new_name":"Müşteri Adı","reply":"✓ Müşteri sütunu yeniden adlandırıldı","changes":[]} },

  // --- find_replace ---
  { user_command: "bul ve değiştir", logic: "find and replace text in column", category: "text", output: {"action":"find_replace","column":"A","find":"eski","replace":"yeni","reply":"✓ Değerler değiştirildi","changes":[]} },
  { user_command: "şunu bununla değiştir", logic: "replace one value with another", category: "text", output: {"action":"find_replace","column":"A","find":"eski değer","replace":"yeni değer","reply":"✓ Değerler güncellendi","changes":[]} },
  { user_command: "X yerine Y yaz", logic: "replace X with Y in column", category: "text", output: {"action":"find_replace","column":"A","find":"X","replace":"Y","reply":"✓ X yerine Y yazıldı","changes":[]} },
  { user_command: "hatalı yazılmış kelimeleri düzelt", logic: "correct misspelled words in column", category: "cleaning", output: {"action":"find_replace","column":"A","find":"hatalı","replace":"doğru","reply":"✓ Kelimeler düzeltildi","changes":[]} },
  { user_command: "evet yazan yerleri 1 ile değiştir", logic: "replace yes text with 1", category: "text", output: {"action":"find_replace","column":"A","find":"evet","replace":"1","reply":"✓ Evet değerleri 1 ile değiştirildi","changes":[]} },
  { user_command: "hayır yazan yerleri 0 ile değiştir", logic: "replace no text with 0", category: "text", output: {"action":"find_replace","column":"A","find":"hayır","replace":"0","reply":"✓ Hayır değerleri 0 ile değiştirildi","changes":[]} },
  { user_command: "boşlukları tire ile değiştir", logic: "replace spaces with hyphens", category: "text", output: {"action":"find_replace","column":"A","find":" ","replace":"-","reply":"✓ Boşluklar tire ile değiştirildi","changes":[]} },
  { user_command: "İstanbul yerine IST yaz", logic: "replace İstanbul with abbreviation IST", category: "text", output: {"action":"find_replace","column":"Şehir","find":"İstanbul","replace":"IST","reply":"✓ İstanbul kısaltması uygulandı","changes":[]} },
  { user_command: "tüm A değerlerini B ile değiştir", logic: "replace all A values with B", category: "text", output: {"action":"find_replace","column":"A","find":"A","replace":"B","reply":"✓ Tüm değerler değiştirildi","changes":[]} },
  { user_command: "aktif yazan yerleri Aktif yap", logic: "normalize Active text capitalization", category: "cleaning", output: {"action":"find_replace","column":"Durum","find":"aktif","replace":"Aktif","reply":"✓ Aktif değerleri düzenlendi","changes":[]} },
  { user_command: "pasif olan kayıtları iptal ile değiştir", logic: "replace passive status with cancelled", category: "text", output: {"action":"find_replace","column":"Durum","find":"pasif","replace":"İptal","reply":"✓ Pasif kayıtlar güncellendi","changes":[]} },
  { user_command: "belirli bir değeri bul ve değiştir", logic: "find specific value and replace it", category: "text", output: {"action":"find_replace","column":"A","find":"hedef değer","replace":"yeni değer","reply":"✓ Değer bulunup değiştirildi","changes":[]} },
  { user_command: "TR yerine Türkiye yaz", logic: "expand TR abbreviation to full country name", category: "text", output: {"action":"find_replace","column":"Ülke","find":"TR","replace":"Türkiye","reply":"✓ TR değerleri Türkiye olarak güncellendi","changes":[]} },

  // --- multi-condition filter ---
  { user_command: "hem elektronik hem de fiyatı 1000 üzeri olanları göster", logic: "filter items that are electronic AND price above 1000", category: "filtering", output: {"action":"filter","conditions":[{"column":"Kategori","operator":"equals","value":"Elektronik"},{"column":"Fiyat","operator":"greater_than","value":1000}],"logic":"AND","reply":"✓ Elektronik ve 1000+ fiyatlı ürünler filtrelendi","changes":[]} },
  { user_command: "İstanbul veya Ankara'daki müşterileri filtrele", logic: "filter customers from Istanbul OR Ankara", category: "filtering", output: {"action":"filter","conditions":[{"column":"Şehir","operator":"equals","value":"İstanbul"},{"column":"Şehir","operator":"equals","value":"Ankara"}],"logic":"OR","reply":"✓ İstanbul ve Ankara müşterileri filtrelendi","changes":[]} },
  { user_command: "aktif ve maaşı 10000 üzeri çalışanları göster", logic: "filter active employees with salary above 10000", category: "hr", output: {"action":"filter","conditions":[{"column":"Durum","operator":"equals","value":"Aktif"},{"column":"Maaş","operator":"greater_than","value":10000}],"logic":"AND","reply":"✓ Aktif ve yüksek maaşlı çalışanlar filtrelendi","changes":[]} },
  { user_command: "hem A kategorisi hem de B bölgesindekiler", logic: "filter records matching category A AND region B", category: "filtering", output: {"action":"filter","conditions":[{"column":"Kategori","operator":"equals","value":"A"},{"column":"Bölge","operator":"equals","value":"B"}],"logic":"AND","reply":"✓ A kategorisi ve B bölgesi filtrelendi","changes":[]} },
  { user_command: "2023 yılında satışı 5000 üzerinde olan ürünler", logic: "filter products with sales above 5000 in year 2023", category: "satış", output: {"action":"filter","conditions":[{"column":"Yıl","operator":"equals","value":2023},{"column":"Satış","operator":"greater_than","value":5000}],"logic":"AND","reply":"✓ 2023 yılı yüksek satışlı ürünler filtrelendi","changes":[]} },
  { user_command: "teslim edilmemiş ve gecikmiş siparişleri göster", logic: "filter orders that are not delivered AND delayed", category: "satış", output: {"action":"filter","conditions":[{"column":"Durum","operator":"not_equals","value":"Teslim Edildi"},{"column":"Gecikme","operator":"equals","value":"Evet"}],"logic":"AND","reply":"✓ Teslim edilmemiş ve gecikmiş siparişler filtrelendi","changes":[]} },
  { user_command: "erkek ve yaşı 30 üzeri çalışanlar", logic: "filter male employees aged above 30", category: "hr", output: {"action":"filter","conditions":[{"column":"Cinsiyet","operator":"equals","value":"Erkek"},{"column":"Yaş","operator":"greater_than","value":30}],"logic":"AND","reply":"✓ Erkek ve 30+ yaş çalışanlar filtrelendi","changes":[]} },
  { user_command: "stok miktarı 0 ve sipariş bekleyen ürünler", logic: "filter products with zero stock AND pending order", category: "stok", output: {"action":"filter","conditions":[{"column":"Stok","operator":"equals","value":0},{"column":"Sipariş Durumu","operator":"equals","value":"Bekliyor"}],"logic":"AND","reply":"✓ Stoksuz ve sipariş bekleyen ürünler filtrelendi","changes":[]} },
  { user_command: "toplam tutarı 500 ile 5000 arasında olanları göster", logic: "filter records with total amount between 500 and 5000", category: "filtering", output: {"action":"filter","conditions":[{"column":"Toplam","operator":"greater_than","value":500},{"column":"Toplam","operator":"less_than","value":5000}],"logic":"AND","reply":"✓ 500-5000 arası tutarlar filtrelendi","changes":[]} },
  { user_command: "hem yeni hem de onaysız kayıtları göster", logic: "filter records that are new AND unapproved", category: "filtering", output: {"action":"filter","conditions":[{"column":"Durum","operator":"equals","value":"Yeni"},{"column":"Onay","operator":"equals","value":"Hayır"}],"logic":"AND","reply":"✓ Yeni ve onaysız kayıtlar filtrelendi","changes":[]} },
  { user_command: "A veya B departmanındaki çalışanlar", logic: "filter employees in department A OR B", category: "hr", output: {"action":"filter","conditions":[{"column":"Departman","operator":"equals","value":"A"},{"column":"Departman","operator":"equals","value":"B"}],"logic":"OR","reply":"✓ A veya B departmanı çalışanları filtrelendi","changes":[]} },
  { user_command: "fiyatı 100'den az olan ve stokta olan ürünler", logic: "filter products with price under 100 AND in stock", category: "stok", output: {"action":"filter","conditions":[{"column":"Fiyat","operator":"less_than","value":100},{"column":"Stok","operator":"greater_than","value":0}],"logic":"AND","reply":"✓ Ucuz ve stokta olan ürünler filtrelendi","changes":[]} },
  { user_command: "geçen ay ve iade edilen işlemler", logic: "filter transactions from last month AND returned", category: "satış", output: {"action":"filter","conditions":[{"column":"Tarih","operator":"last_month","value":null},{"column":"Durum","operator":"equals","value":"İade"}],"logic":"AND","reply":"✓ Geçen ay iade edilen işlemler filtrelendi","changes":[]} },
  { user_command: "marka A veya marka B ürünleri göster", logic: "filter products of brand A OR brand B", category: "filtering", output: {"action":"filter","conditions":[{"column":"Marka","operator":"equals","value":"A"},{"column":"Marka","operator":"equals","value":"B"}],"logic":"OR","reply":"✓ A veya B marka ürünler filtrelendi","changes":[]} },
  { user_command: "ödenmemiş ve 30 günden eski faturalar", logic: "filter unpaid invoices older than 30 days", category: "muhasebe", output: {"action":"filter","conditions":[{"column":"Ödeme Durumu","operator":"equals","value":"Ödenmemiş"},{"column":"Vade Günü","operator":"greater_than","value":30}],"logic":"AND","reply":"✓ Vadesi geçmiş ödenmemiş faturalar filtrelendi","changes":[]} },
  { user_command: "hem müdür hem de İstanbul'da çalışanlar", logic: "filter employees who are managers AND in Istanbul", category: "hr", output: {"action":"filter","conditions":[{"column":"Pozisyon","operator":"equals","value":"Müdür"},{"column":"Şehir","operator":"equals","value":"İstanbul"}],"logic":"AND","reply":"✓ İstanbul'daki müdürler filtrelendi","changes":[]} },
  { user_command: "satışları 0 olan ve aktif olmayan ürünler", logic: "filter products with zero sales AND not active", category: "satış", output: {"action":"filter","conditions":[{"column":"Satış","operator":"equals","value":0},{"column":"Aktif","operator":"equals","value":"Hayır"}],"logic":"AND","reply":"✓ Satışsız ve aktif olmayan ürünler filtrelendi","changes":[]} },
  { user_command: "çift koşulla filtrele", logic: "apply two-condition AND filter", category: "filtering", output: {"action":"filter","conditions":[{"column":"A","operator":"equals","value":"x"},{"column":"B","operator":"greater_than","value":0}],"logic":"AND","reply":"✓ Çift koşul uygulandı","changes":[]} },
  { user_command: "şu veya bu koşulu sağlayanları göster", logic: "filter records matching either condition using OR logic", category: "filtering", output: {"action":"filter","conditions":[{"column":"A","operator":"equals","value":"x"},{"column":"B","operator":"equals","value":"y"}],"logic":"OR","reply":"✓ Koşullardan birini sağlayanlar gösterildi","changes":[]} },
  { user_command: "İzmir veya İstanbul'daki aktif müşteriler", logic: "filter active customers from Izmir OR Istanbul", category: "filtering", output: {"action":"filter","conditions":[{"column":"Durum","operator":"equals","value":"Aktif"},{"column":"Şehir","operator":"in","value":["İzmir","İstanbul"]}],"logic":"AND","reply":"✓ İzmir veya İstanbul aktif müşteriler filtrelendi","changes":[]} },
  { user_command: "kategori ve tarihe göre filtrele", logic: "filter by category AND date range", category: "filtering", output: {"action":"filter","conditions":[{"column":"Kategori","operator":"equals","value":"A"},{"column":"Tarih","operator":"between","value":["2024-01-01","2024-12-31"]}],"logic":"AND","reply":"✓ Kategori ve tarih filtrelendi","changes":[]} },
  { user_command: "fiyatı 500 ile 2000 arasında ve stokta olan ürünler", logic: "filter products priced 500-2000 AND in stock", category: "stok", output: {"action":"filter","conditions":[{"column":"Fiyat","operator":"between","value":[500,2000]},{"column":"Stok","operator":"greater_than","value":0}],"logic":"AND","reply":"✓ Fiyat aralığı ve stok filtresi uygulandı","changes":[]} },

  // --- group_by ---
  { user_command: "kategoriye göre grupla", logic: "group data by category", category: "analysis", output: {"action":"group_by","column":"Kategori","aggregate":"count","reply":"✓ Kategoriye göre gruplandı","changes":[]} },
  { user_command: "şehre göre grupla ve topla", logic: "group by city and sum values", category: "analysis", output: {"action":"group_by","column":"Şehir","aggregate":"sum","value_column":"Tutar","reply":"✓ Şehre göre gruplandı ve toplandı","changes":[]} },
  { user_command: "departmana göre çalışan sayısını bul", logic: "count employees grouped by department", category: "hr", output: {"action":"group_by","column":"Departman","aggregate":"count","reply":"✓ Departman bazında çalışan sayısı hesaplandı","changes":[]} },
  { user_command: "ürün kategorisine göre satışları grupla", logic: "group sales by product category", category: "satış", output: {"action":"group_by","column":"Kategori","aggregate":"sum","value_column":"Satış","reply":"✓ Kategori bazında satışlar gruplandı","changes":[]} },
  { user_command: "müşteri bazında toplam harcama", logic: "total spending grouped by customer", category: "satış", output: {"action":"group_by","column":"Müşteri","aggregate":"sum","value_column":"Tutar","reply":"✓ Müşteri bazında toplam harcama hesaplandı","changes":[]} },
  { user_command: "aya göre grupla ve ortalamasını al", logic: "group by month and calculate average", category: "analysis", output: {"action":"group_by","column":"Ay","aggregate":"average","value_column":"Tutar","reply":"✓ Aya göre ortalama hesaplandı","changes":[]} },
  { user_command: "bölgeye göre satışları özetle", logic: "summarize sales by region", category: "satış", output: {"action":"group_by","column":"Bölge","aggregate":"sum","value_column":"Satış","reply":"✓ Bölge bazında satışlar özetlendi","changes":[]} },
  { user_command: "ürün başına ortalama fiyatı hesapla", logic: "calculate average price per product", category: "analysis", output: {"action":"group_by","column":"Ürün","aggregate":"average","value_column":"Fiyat","reply":"✓ Ürün başına ortalama fiyat hesaplandı","changes":[]} },
  { user_command: "yıla göre gruplanmış gelir toplamı", logic: "total revenue grouped by year", category: "finance", output: {"action":"group_by","column":"Yıl","aggregate":"sum","value_column":"Gelir","reply":"✓ Yıl bazında gelir toplamı hesaplandı","changes":[]} },
  { user_command: "tedarikçiye göre sipariş sayısını bul", logic: "count orders grouped by supplier", category: "stok", output: {"action":"group_by","column":"Tedarikçi","aggregate":"count","reply":"✓ Tedarikçi bazında sipariş sayısı bulundu","changes":[]} },
  { user_command: "marka bazında toplam satış", logic: "total sales by brand", category: "satış", output: {"action":"group_by","column":"Marka","aggregate":"sum","value_column":"Satış","reply":"✓ Marka bazında toplam satış hesaplandı","changes":[]} },
  { user_command: "durum bazında kayıt sayısı", logic: "count records grouped by status", category: "analysis", output: {"action":"group_by","column":"Durum","aggregate":"count","reply":"✓ Durum bazında kayıt sayısı hesaplandı","changes":[]} },
  { user_command: "haftalık sipariş toplamlarını göster", logic: "show total orders grouped by week", category: "satış", output: {"action":"group_by","column":"Hafta","aggregate":"sum","value_column":"Sipariş","reply":"✓ Haftalık sipariş toplamları gösterildi","changes":[]} },
  { user_command: "çalışan başına ortalama maaş", logic: "average salary per position group", category: "hr", output: {"action":"group_by","column":"Pozisyon","aggregate":"average","value_column":"Maaş","reply":"✓ Pozisyon bazında ortalama maaş hesaplandı","changes":[]} },
  { user_command: "kategorilere göre özet tablo oluştur", logic: "create summary table grouped by category", category: "analysis", output: {"action":"group_by","column":"Kategori","aggregate":"sum","reply":"✓ Kategori özet tablosu oluşturuldu","changes":[]} },
  { user_command: "her bölge için en yüksek satış", logic: "find maximum sales for each region", category: "satış", output: {"action":"group_by","column":"Bölge","aggregate":"max","value_column":"Satış","reply":"✓ Bölge bazında en yüksek satışlar bulundu","changes":[]} },

  // --- delete_empty_columns ---
  { user_command: "boş sütunları sil", logic: "delete all empty columns", category: "cleaning", output: {"action":"delete_empty_columns","reply":"✓ Boş sütunlar silindi","changes":[]} },
  { user_command: "içi boş olan kolonları kaldır", logic: "remove columns with no data", category: "cleaning", output: {"action":"delete_empty_columns","reply":"✓ Boş kolonlar kaldırıldı","changes":[]} },
  { user_command: "değer içermeyen sütunları temizle", logic: "clean up columns without values", category: "cleaning", output: {"action":"delete_empty_columns","reply":"✓ Değersiz sütunlar temizlendi","changes":[]} },
  { user_command: "dolu olmayan sütunları at", logic: "drop columns that are not populated", category: "cleaning", output: {"action":"delete_empty_columns","reply":"✓ Dolu olmayan sütunlar silindi","changes":[]} },
  { user_command: "gereksiz boş kolonları sil", logic: "delete unnecessary empty columns", category: "cleaning", output: {"action":"delete_empty_columns","reply":"✓ Gereksiz boş kolonlar silindi","changes":[]} },
  { user_command: "hiç veri olmayan sütunları temizle", logic: "remove columns that have no data at all", category: "cleaning", output: {"action":"delete_empty_columns","reply":"✓ Veri içermeyen sütunlar temizlendi","changes":[]} },
  { user_command: "boş kolonları otomatik sil", logic: "automatically delete all empty columns", category: "cleaning", output: {"action":"delete_empty_columns","reply":"✓ Boş kolonlar otomatik olarak silindi","changes":[]} },
  { user_command: "tablodaki boş sütunları kaldır", logic: "remove empty columns from the table", category: "cleaning", output: {"action":"delete_empty_columns","reply":"✓ Tablodaki boş sütunlar kaldırıldı","changes":[]} },

  // --- count_blank ---
  { user_command: "boş hücre sayısını bul", logic: "count blank cells in column", category: "analysis", output: {"action":"count_blank","column":"A","reply":"✓ Boş hücre sayısı hesaplandı","changes":[]} },
  { user_command: "kaç tane boş hücre var", logic: "how many empty cells are there", category: "analysis", output: {"action":"count_blank","column":"A","reply":"✓ Boş hücre sayısı bulundu","changes":[]} },
  { user_command: "eksik veri sayısı", logic: "count missing data entries", category: "analysis", output: {"action":"count_blank","column":"A","reply":"✓ Eksik veri sayısı hesaplandı","changes":[]} },
  { user_command: "A sütununda kaç boşluk var", logic: "count blank cells in column A", category: "analysis", output: {"action":"count_blank","column":"A","reply":"✓ A sütunundaki boş hücre sayısı bulundu","changes":[]} },
  { user_command: "doldurulmamış hücre sayısı", logic: "count unfilled cells", category: "analysis", output: {"action":"count_blank","column":"A","reply":"✓ Doldurulmamış hücre sayısı hesaplandı","changes":[]} },
  { user_command: "null değer sayısı", logic: "count null values in column", category: "analysis", output: {"action":"count_blank","column":"A","reply":"✓ Null değer sayısı hesaplandı","changes":[]} },
  { user_command: "boş olan hücreleri say", logic: "count cells that are empty", category: "analysis", output: {"action":"count_blank","column":"A","reply":"✓ Boş hücreler sayıldı","changes":[]} },
  { user_command: "veri eksik olanları say", logic: "count records with missing data", category: "cleaning", output: {"action":"count_blank","column":"A","reply":"✓ Veri eksik kayıtlar sayıldı","changes":[]} },

  // --- compare ---
  { user_command: "iki sütunu karşılaştır", logic: "compare two columns for differences", category: "analysis", output: {"action":"compare","columns":["A","B"],"reply":"✓ İki sütun karşılaştırıldı","changes":[]} },
  { user_command: "A ve B sütunları aynı mı", logic: "check if columns A and B are identical", category: "analysis", output: {"action":"compare","columns":["A","B"],"reply":"✓ A ve B sütunları karşılaştırıldı","changes":[]} },
  { user_command: "geçen ay ile bu ayı karşılaştır", logic: "compare last month data with current month", category: "analysis", output: {"action":"compare","columns":["Geçen Ay","Bu Ay"],"reply":"✓ Aylık karşılaştırma yapıldı","changes":[]} },
  { user_command: "iki listeyi karşılaştır farkları bul", logic: "compare two lists and find differences", category: "analysis", output: {"action":"compare","columns":["Liste 1","Liste 2"],"reply":"✓ İki liste karşılaştırıldı, farklar bulundu","changes":[]} },
  { user_command: "bütçe ile gerçekleşeni karşılaştır", logic: "compare budget column with actual values", category: "finance", output: {"action":"compare","columns":["Bütçe","Gerçekleşen"],"reply":"✓ Bütçe ve gerçekleşen karşılaştırıldı","changes":[]} },
  { user_command: "hedef ve sonucu kıyasla", logic: "compare target and result columns", category: "analysis", output: {"action":"compare","columns":["Hedef","Sonuç"],"reply":"✓ Hedef ve sonuç karşılaştırıldı","changes":[]} },
  { user_command: "hangi değerler farklı bul", logic: "find values that differ between two columns", category: "analysis", output: {"action":"compare","columns":["A","B"],"reply":"✓ Farklı değerler tespit edildi","changes":[]} },
  { user_command: "bu yıl ve geçen yılı kıyasla", logic: "compare current year with previous year data", category: "analysis", output: {"action":"compare","columns":["Bu Yıl","Geçen Yıl"],"reply":"✓ Yıllık karşılaştırma yapıldı","changes":[]} },

];

module.exports = { EXCEL_DATASET };
