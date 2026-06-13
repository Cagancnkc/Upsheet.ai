'use strict';
// ── Şablon Veritabanı ──────────────────────────────────────────────────────
var SHEET_TEMPLATES = [
  {
    category: 'Muhasebe & Finans',
    icon: '💰',
    templates: [
      {
        id: 'invoice-tracker',
        name: 'Fatura Takip Tablosu',
        icon: '🧾',
        description: 'Fatura, vade ve ödeme durumlarını takip et',
        columns: ['Fatura No','Müşteri','Tarih','Vade Tarihi','Tutar','KDV','Toplam','Durum','Ödeme Tarihi','Gecikme (gün)'],
        rows: [
          ['F-2026-001','Acme Ticaret','2026-05-01','2026-05-31','12500','2500','15000','Ödendi','2026-05-28','0'],
          ['F-2026-002','Bloom Ajans','2026-05-05','2026-06-04','8750','1750','10500','Gecikmiş','','12'],
          ['F-2026-003','Steel Co.','2026-05-10','2026-06-09','6300','1260','7560','Bekliyor','',''],
          ['F-2026-004','Vertex Ltd','2026-05-12','2026-06-11','22100','4420','26520','Ödendi','2026-06-05','0'],
          ['F-2026-005','Nova Dijital','2026-05-15','2026-06-14','1500','300','1800','Gecikmiş','','5'],
          ['F-2026-006','Mavi Tepe A.Ş.','2026-05-20','2026-06-19','45200','9040','54240','Bekliyor','',''],
          ['F-2026-007','Demir İnşaat','2026-05-22','2026-06-21','9800','1960','11760','Ödendi','2026-06-15','0'],
          ['F-2026-008','Yıldız Market','2026-05-25','2026-06-24','3200','640','3840','Bekliyor','','']
        ]
      },
      {
        id: 'budget-tracker',
        name: 'Bütçe / Gider Takip Tablosu',
        icon: '📊',
        description: 'Aylık bütçe ve gerçekleşen giderleri karşılaştır',
        columns: ['Kategori','Ocak Plan','Ocak Gerçek','Şubat Plan','Şubat Gerçek','Mart Plan','Mart Gerçek','Fark (₺)'],
        rows: [
          ['Kira','15000','15000','15000','15000','15000','15000','0'],
          ['Maaşlar','85000','87500','85000','85000','85000','86200','-3700'],
          ['Yazılım/Abonelik','3500','4100','3500','3200','3500','3800','-1100'],
          ['Pazarlama','10000','8750','10000','11200','10000','9500','700'],
          ['Ofis Giderleri','4500','5200','4500','4100','4500','4800','-1100'],
          ['Vergi/SGK','22000','22000','22000','22000','22000','22000','0']
        ]
      },
      {
        id: 'profit-loss',
        name: 'Gelir-Gider Özeti (Aylık)',
        icon: '📈',
        description: 'Aylık kâr/zarar ve marj takibi',
        columns: ['Ay','Toplam Gelir','Toplam Gider','Brüt Kâr','Kâr Marjı (%)','Önceki Aya Göre Değişim'],
        rows: [
          ['Ocak','185000','142000','43000','23.2','-'],
          ['Şubat','198000','148000','50000','25.3','+16.3%'],
          ['Mart','210000','155000','55000','26.2','+10.0%'],
          ['Nisan','205000','151000','54000','26.3','-1.8%'],
          ['Mayıs','225000','160000','65000','28.9','+20.4%']
        ]
      }
    ]
  },
  {
    category: 'Stok & Envanter',
    icon: '📦',
    templates: [
      {
        id: 'inventory-tracker',
        name: 'Stok Takip Tablosu',
        icon: '📦',
        description: 'Ürün stok seviyelerini ve değerlerini izle',
        columns: ['Ürün Adı','SKU','Kategori','Mevcut Stok','Minimum Stok','Birim Fiyat','Toplam Değer','Tedarikçi'],
        rows: [
          ['A4 Kağıt (Koli)','SKU-1001','Kırtasiye','45','20','180','8100','Kırtasiye AŞ'],
          ['Toner HP 26A','SKU-1002','Sarf Malzeme','8','10','650','5200','Ofis Plus'],
          ['Klasör (Plastik)','SKU-1003','Kırtasiye','120','50','15','1800','Kırtasiye AŞ'],
          ['Laptop Çantası','SKU-1004','Aksesuar','6','5','220','1320','Tekno Tedarik'],
          ['USB Bellek 64GB','SKU-1005','Elektronik','3','15','95','285','Tekno Tedarik'],
          ['Yazıcı Kağıdı A3','SKU-1006','Kırtasiye','22','10','340','7480','Kırtasiye AŞ'],
          ['Mouse Kablosuz','SKU-1007','Elektronik','14','8','180','2520','Tekno Tedarik'],
          ['Kartuş Renkli','SKU-1008','Sarf Malzeme','2','5','310','620','Ofis Plus']
        ]
      },
      {
        id: 'purchase-orders',
        name: 'Sipariş & Tedarikçi Takip Tablosu',
        icon: '🚚',
        description: 'Tedarikçi siparişlerini ve teslimat durumunu takip et',
        columns: ['Sipariş No','Tedarikçi','Ürün','Miktar','Sipariş Tarihi','Tahmini Teslim','Durum','Birim Fiyat','Toplam'],
        rows: [
          ['PO-101','Kırtasiye AŞ','A4 Kağıt (Koli)','30','2026-06-01','2026-06-08','Yolda','180','5400'],
          ['PO-102','Tekno Tedarik','USB Bellek 64GB','40','2026-06-03','2026-06-10','Beklemede','95','3800'],
          ['PO-103','Ofis Plus','Toner HP 26A','15','2026-06-05','2026-06-12','Beklemede','650','9750'],
          ['PO-104','Kırtasiye AŞ','Klasör (Plastik)','100','2026-05-28','2026-06-04','Teslim Alındı','15','1500']
        ]
      }
    ]
  },
  {
    category: 'Satış & Müşteri',
    icon: '🤝',
    templates: [
      {
        id: 'crm-lead-tracker',
        name: 'Müşteri / Lead Takip Tablosu',
        icon: '👥',
        description: 'Potansiyel müşterileri ve satış aşamalarını yönet',
        columns: ['Müşteri Adı','İletişim','Şirket','Aşama','Son Görüşme','Sonraki Adım','Not'],
        rows: [
          ['Ayşe Kılıç','ayse@firma.com','Kılıç Ticaret','Teklif','2026-06-08','Teklif takibi yap','Fiyat hassas'],
          ['Mehmet Yıldız','mehmet@ymarket.com','Y Market','İletişimde','2026-06-10','Demo planla','İlgili görünüyor'],
          ['Zeynep Demir','zeynep@demirinsaat.com','Demir İnşaat','Yeni Lead','2026-06-11','İlk görüşme','LinkedIn üzerinden geldi'],
          ['Can Aydın','can@novadijital.com','Nova Dijital','Kazanıldı','2026-05-20','Onboarding','Pro plana geçti'],
          ['Selin Bora','selin@blueagency.com','Blue Agency','Kaybedildi','2026-05-15','-','Bütçe yetersiz dedi']
        ]
      },
      {
        id: 'sales-report',
        name: 'Aylık Satış Raporu',
        icon: '📈',
        description: 'Satış performansını hedeflerle karşılaştır',
        columns: ['Tarih','Müşteri','Ürün/Hizmet','Tutar','Satış Temsilcisi','Bölge','Hedef','Gerçekleşen','Hedef Farkı (%)'],
        rows: [
          ['2026-06-01','Acme Corp','Pro Plan (Yıllık)','2800','Ahmet K.','Marmara','2500','2800','+12.0'],
          ['2026-06-03','Bloom Ajans','Takım Plan','4200','Zeynep D.','Ege','4000','4200','+5.0'],
          ['2026-06-05','Steel Co.','Pro Plan','1400','Ahmet K.','İç Anadolu','1500','1400','-6.7'],
          ['2026-06-08','Vertex Ltd','Takım Plan','4200','Mert Ç.','Marmara','4000','4200','+5.0'],
          ['2026-06-10','Nova Dijital','Pro Plan','1400','Zeynep D.','Ege','1500','1400','-6.7']
        ]
      }
    ]
  },
  {
    category: 'İnsan Kaynakları & Zaman',
    icon: '👤',
    templates: [
      {
        id: 'payroll',
        name: 'Bordro / Maaş Hesaplama Tablosu',
        icon: '💵',
        description: '2026 SGK ve vergi oranlarıyla net maaş hesabı',
        columns: ['Çalışan','Departman','Brüt Maaş','SGK Kesintisi (%14)','Gelir Vergisi','Net Maaş'],
        rows: [
          ['Ahmet Korkmaz','Satış','45000','6300','5850','32850'],
          ['Zeynep Demir','Pazarlama','38000','5320','4940','27740'],
          ['Mert Çelik','Operasyon','42000','5880','5460','30660'],
          ['Selin Bora','İK','35000','4900','4550','25550'],
          ['Can Aydın','Yazılım','55000','7700','7150','40150'],
          ['Ayşe Kılıç','Muhasebe','40000','5600','5200','29200']
        ]
      },
      {
        id: 'timesheet',
        name: 'Zaman Çizelgesi / Mesai Takip',
        icon: '⏱️',
        description: 'Çalışan mesai saatlerini ve proje sürelerini izle',
        columns: ['Çalışan','Tarih','Giriş','Çıkış','Toplam Saat','Proje/Görev','Fazla Mesai'],
        rows: [
          ['Ahmet Korkmaz','2026-06-09','09:00','18:00','8','Müşteri Görüşmeleri','0'],
          ['Zeynep Demir','2026-06-09','09:30','19:00','8.5','Kampanya Tasarımı','0.5'],
          ['Mert Çelik','2026-06-09','08:45','17:45','8','Stok Kontrolü','0'],
          ['Can Aydın','2026-06-09','10:00','20:00','9','Bug Düzeltmeleri','1']
        ]
      }
    ]
  },
  {
    category: 'Proje Yönetimi',
    icon: '📋',
    templates: [
      {
        id: 'project-gantt',
        name: 'Proje Takip / Gantt Tablosu',
        icon: '🗂️',
        description: 'Görevleri, sorumluları ve ilerlemeyi takip et',
        columns: ['Görev','Sorumlu','Başlangıç','Bitiş','Süre (gün)','Durum','İlerleme (%)','Bağımlılık'],
        rows: [
          ['İhtiyaç Analizi','Ahmet K.','2026-06-01','2026-06-05','5','Tamamlandı','100','-'],
          ['Tasarım','Zeynep D.','2026-06-06','2026-06-12','7','Devam Ediyor','60','İhtiyaç Analizi'],
          ['Geliştirme','Can A.','2026-06-10','2026-06-25','16','Devam Ediyor','35','Tasarım'],
          ['Test','Mert Ç.','2026-06-26','2026-06-30','5','Yapılacak','0','Geliştirme'],
          ['Yayın','Selin B.','2026-07-01','2026-07-02','2','Yapılacak','0','Test']
        ]
      }
    ]
  }
];
