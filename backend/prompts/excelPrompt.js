'use strict';

function buildExcelPrompt(userMessage, sheetData, ragContext) {
  const dataPreview = buildDataPreview(sheetData);
  const contextStr = Array.isArray(ragContext) && ragContext.length > 0
    ? ragContext.map(r => `- ${r.user_command || r.command}: ${JSON.stringify(r.output)}`).join('\n')
    : 'Benzer örnek bulunamadı';

  return `Sen Mocksheet AI asistanısın. Excel verilerini Türkçe komutlarla yönetiyorsun.

## GÖREV
Kullanıcının Türkçe komutunu analiz et ve JSON formatında aksiyon üret.

## VERİ ÖNİZLEMESİ
${dataPreview}

## BENZER ÖRNEKLER
${contextStr}

## KULLANICI KOMUTU
"${userMessage}"

## KOMUT YORUMLAMA KURALLARI

### Sıralama komutları:
- "sırala", "a-z", "küçükten büyüğe" → action: "sort", direction: "asc"
- "z-a", "büyükten küçüğe", "tersine" → action: "sort", direction: "desc"
- Sütun adı varsa (ör: "fiyata göre") → column: "fiyat"

### Toplama komutları:
- "topla", "toplam", "sum" → action: "sum"
- Sütun adı varsa → source_column: "..."
- Sonuç hücresi belirtilmişse → target_cell: "..."

### Silme komutları:
- "boş satırları sil/kaldır/temizle" → action: "delete_rows", condition: "empty"
- "tekrar/mükerrer sil" → action: "remove_duplicates"

### Renklendirme komutları:
- "kırmızı", "kırmızıya boya" → color: "#fecaca"
- "yeşil", "yeşile boya" → color: "#bbf7d0"
- "sarı", "sarıya boya" → color: "#fef08a"
- "mavi", "maviye boya" → color: "#bfdbfe"
- "negatif/eksi" → condition: "value < 0"
- "pozitif/artı" → condition: "value > 0"
- "en büyük N" → condition: "topN"

### Hesaplama komutları:
- "KDV ekle/%20 ekle" → action: "update_cells", formula: "multiply", factor: 1.20
- "KDV hariç bul" → formula: "divide", factor: 1.20
- "ortalama" → action: "average"

### Filtreleme komutları:
- "...olanları göster/filtrele" → action: "filter"

### Rapor komutları:
- "rapor", "özet", "istatistik" → action: "message"

### Biçimlendirme:
- "büyük harfe çevir" → action: "transform", transform: "uppercase"
- "küçük harfe çevir" → action: "transform", transform: "lowercase"

## YANIT FORMATI (SADECE JSON DÖN)

{
  "action": "sort|sum|delete_rows|remove_duplicates|highlight|update_cells|filter|average|transform|message",
  "reply": "✓ Türkçe açıklama mesajı",
  "column": "sütun adı veya harfi (varsa)",
  "direction": "asc|desc (sıralama için)",
  "condition": "koşul (varsa)",
  "color": "#renk (highlight için)",
  "formula": "formül adı (varsa)",
  "factor": null,
  "source_column": "kaynak sütun",
  "target_cell": "hedef hücre",
  "transform": "dönüşüm tipi",
  "changes": []
}

## KURALLAR
1. SADECE geçerli JSON döndür — başka hiçbir şey yazma
2. reply alanı HER ZAMAN Türkçe olsun
3. reply başarılı aksiyonlar için "✓" ile başlasın
4. Belirsiz komutlarda akıllıca tahmin et
5. Sütun adları veriden al (dataPreview'e bak)
6. changes array'i her zaman boş [] olarak döndür (frontend dolduracak)
7. Komut tamamen anlaşılamıyorsa bile en yakın aksiyonu seç`;
}

function buildDataPreview(sheetData) {
  // sheetData array (2D) veya string olabilir
  if (typeof sheetData === 'string') {
    return sheetData ? sheetData.substring(0, 2000) : 'Veri yok';
  }

  if (!sheetData || !sheetData.length) {
    return 'Veri yok';
  }

  const headers = sheetData[0] || [];
  const rows = sheetData.slice(1, 4);
  const totalRows = sheetData.length - 1;

  let preview = `Toplam: ${totalRows} satır, ${headers.length} sütun\n`;
  preview += `Sütunlar: ${headers.filter(Boolean).join(', ')}\n\n`;
  preview += `İlk satırlar:\n`;

  rows.forEach((row, i) => {
    const rowData = headers.map((h, j) =>
      `${h}: ${String(row[j] || '').slice(0, 20)}`
    ).join(' | ');
    preview += `  Satır ${i + 1}: ${rowData}\n`;
  });

  return preview;
}

module.exports = { buildExcelPrompt };
