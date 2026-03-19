const EXCEL_DATASET = [
  {
    user_command: "A sütununu küçükten büyüğe sırala",
    logic: "Sort column A ascending by value",
    category: "sorting",
    output: {
      action: "sort",
      column: 0,
      direction: "asc",
      changes: [],
      reply: "✓ A sütunu küçükten büyüğe sıralandı"
    }
  },
  {
    user_command: "B sütununu büyükten küçüğe sırala",
    logic: "Sort column B descending",
    category: "sorting",
    output: {
      action: "sort",
      column: 1,
      direction: "desc",
      changes: [],
      reply: "✓ B sütunu büyükten küçüğe sıralandı"
    }
  },
  {
    user_command: "Tarihe göre en eskiden yeniye sırala",
    logic: "Sort by date column ascending",
    category: "sorting",
    output: {
      action: "sort",
      column: 0,
      direction: "asc",
      changes: [],
      reply: "✓ Veriler tarihe göre sıralandı (eskiden yeniye)"
    }
  },
  {
    user_command: "Satışı 1000'in altında olanları kırmızıya boya",
    logic: "Highlight cells in sales column where value < 1000",
    category: "highlighting",
    output: {
      action: "highlight",
      condition: "value < 1000",
      color: "#fecaca",
      changes: [],
      reply: "✓ 1000'in altındaki değerler kırmızıya boyandı"
    }
  },
  {
    user_command: "Boş hücreleri sarıya boya",
    logic: "Highlight all empty cells yellow",
    category: "highlighting",
    output: {
      action: "highlight",
      condition: "isEmpty",
      color: "#fef08a",
      changes: [],
      reply: "✓ Boş hücreler sarıya boyandı"
    }
  },
  {
    user_command: "Negatif değerleri kırmızıya boya",
    logic: "Highlight all negative numbers in red",
    category: "highlighting",
    output: {
      action: "highlight",
      condition: "value < 0",
      color: "#fecaca",
      changes: [],
      reply: "✓ Negatif değerler kırmızıya boyandı"
    }
  },
  {
    user_command: "En yüksek 5 değeri göster",
    logic: "Find and highlight top 5 values in green",
    category: "highlighting",
    output: {
      action: "highlight",
      condition: "top5",
      color: "#bbf7d0",
      changes: [],
      reply: "✓ En yüksek 5 değer yeşile boyandı"
    }
  },
  {
    user_command: "B sütununun toplamını C1'e yaz",
    logic: "Sum all values in column B, write result to C1",
    category: "calculation",
    output: {
      action: "update_cells",
      formula: "SUM",
      source_column: 1,
      target: { row: 0, col: 2 },
      changes: [{ row: 0, col: 2, value: "=SUM(B:B)" }],
      reply: "✓ B sütunu toplamı C1'e yazıldı"
    }
  },
  {
    user_command: "A sütununun ortalamasını hesapla",
    logic: "Calculate average of column A",
    category: "calculation",
    output: {
      action: "update_cells",
      formula: "AVERAGE",
      source_column: 0,
      changes: [],
      reply: "✓ A sütunu ortalaması hesaplandı"
    }
  },
  {
    user_command: "Ortalamanın altındakileri işaretle",
    logic: "Highlight cells below average value",
    category: "calculation",
    output: {
      action: "highlight",
      condition: "below_average",
      color: "#fed7aa",
      changes: [],
      reply: "✓ Ortalamanın altındaki değerler turuncu işaretlendi"
    }
  },
  {
    user_command: "Boş satırları sil",
    logic: "Remove all completely empty rows",
    category: "cleaning",
    output: {
      action: "delete_rows",
      condition: "isEmpty",
      changes: [],
      reply: "✓ Boş satırlar silindi"
    }
  },
  {
    user_command: "Tekrar eden satırları kaldır",
    logic: "Remove duplicate rows keeping first occurrence",
    category: "cleaning",
    output: {
      action: "remove_duplicates",
      changes: [],
      reply: "✓ Tekrar eden satırlar kaldırıldı"
    }
  },
  {
    user_command: "Baştaki ve sondaki boşlukları temizle",
    logic: "Trim whitespace from all text cells",
    category: "cleaning",
    output: {
      action: "update_cells",
      transform: "trim",
      changes: [],
      reply: "✓ Gereksiz boşluklar temizlendi"
    }
  },
  {
    user_command: "A sütununu büyük harfe çevir",
    logic: "Convert all text in column A to uppercase",
    category: "formatting",
    output: {
      action: "update_cells",
      transform: "toUpperCase",
      column: 0,
      changes: [],
      reply: "✓ A sütunu büyük harfe çevrildi"
    }
  },
  {
    user_command: "Tarihleri GG.AA.YYYY formatına çevir",
    logic: "Convert date formats to Turkish DD.MM.YYYY",
    category: "formatting",
    output: {
      action: "update_cells",
      transform: "formatDate",
      format: "DD.MM.YYYY",
      changes: [],
      reply: "✓ Tarihler Türkçe formata çevrildi"
    }
  },
  {
    user_command: "Sayıları 2 ondalık basamağa yuvarla",
    logic: "Round all numbers to 2 decimal places",
    category: "formatting",
    output: {
      action: "update_cells",
      transform: "round",
      decimals: 2,
      changes: [],
      reply: "✓ Sayılar 2 ondalık basamağa yuvarlandı"
    }
  },
  {
    user_command: "Verilerin özetini çıkar",
    logic: "Analyze the data and return summary statistics",
    category: "analysis",
    output: {
      action: "message",
      changes: [],
      reply: "📊 Özet analiz tamamlandı"
    }
  },
  {
    user_command: "Bu verinin istatistiklerini göster",
    logic: "Show descriptive statistics: count, mean, min, max",
    category: "analysis",
    output: {
      action: "message",
      changes: [],
      reply: "📊 İstatistikler hesaplandı"
    }
  },
  {
    user_command: "KDV dahil fiyatları hesapla",
    logic: "Multiply price column by 1.20 for 20% VAT",
    category: "finance",
    output: {
      action: "update_cells",
      formula: "multiply",
      factor: 1.20,
      changes: [],
      reply: "✓ KDV (%20) eklenerek fiyatlar güncellendi"
    }
  },
  {
    user_command: "Kâr marjını hesapla",
    logic: "Calculate profit margin: (revenue - cost) / revenue * 100",
    category: "finance",
    output: {
      action: "update_cells",
      formula: "profit_margin",
      changes: [],
      reply: "✓ Kâr marjı hesaplandı"
    }
  },
  {
    user_command: "Net maaşları hesapla",
    logic: "Calculate net salary after SGK and income tax deductions",
    category: "finance",
    output: {
      action: "update_cells",
      formula: "net_salary",
      changes: [],
      reply: "✓ Net maaşlar hesaplandı (SGK ve vergi kesintileri dahil)"
    }
  },
  {
    user_command: "Aylık büyüme oranını hesapla",
    logic: "Calculate month-over-month growth: (current - previous) / previous * 100",
    category: "finance",
    output: {
      action: "update_cells",
      formula: "growth_rate",
      changes: [],
      reply: "✓ Aylık büyüme oranları hesaplandı"
    }
  },
  {
    user_command: "Hücreleri birleştir",
    logic: "Concatenate values from multiple columns into one",
    category: "formatting",
    output: {
      action: "update_cells",
      transform: "concatenate",
      changes: [],
      reply: "✓ Hücreler birleştirildi"
    }
  },
  {
    user_command: "Şunu düzelt",
    logic: "Ambiguous command, ask for clarification",
    category: "analysis",
    output: {
      action: "message",
      changes: [],
      reply: "Hangi sütunu veya satırı düzeltmemi istiyorsunuz? Biraz daha açıklar mısınız?"
    }
  },
  {
    user_command: "Tüm veriyi temizle",
    logic: "Clear all cell values (dangerous, requires confirmation)",
    category: "cleaning",
    output: {
      action: "message",
      changes: [],
      reply: "⚠️ Tüm veriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz. 'Evet, sil' yazarak onaylayın."
    }
  }
];

module.exports = { EXCEL_DATASET };
