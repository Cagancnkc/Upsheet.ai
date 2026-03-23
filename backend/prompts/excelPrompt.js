function buildExcelPrompt(userCommand, examples, sheetContext) {
  const examplesText = examples.length > 0
    ? examples.map((ex, i) => `
Örnek ${i + 1}:
Komut: "${ex.command}"
Çıktı: ${JSON.stringify(ex.output, null, 2)}`
    ).join('\n')
    : 'Örnek bulunamadı.';

  return `Sen bir Excel AI motorusun. SADECE JSON döndür.

MEVCUT VERİ (satır,sütun bazlı — 0 indeksli):
${sheetContext ? sheetContext.substring(0, 2000) : 'Veri yok'}

BENZER KOMUT ÖRNEKLERİ:
${examplesText}

KULLANICI KOMUTU: "${userCommand}"

ZORUNLU KURALLAR:
1. SADECE geçerli JSON döndür — açıklama/yorum/markdown YASAK
2. Şu alanları içermeli: action, changes, reply
3. reply Türkçe olmalı
4. row ve col DEĞERLERİ 0'dan başlar (0-indexed)
5. changes HİÇBİR ZAMAN boş bırakma — gerçek hücre değerlerini hesapla ve yaz

AKSİYONA GÖRE KURALLAR:
- update_cells: mevcut veriyi kullanarak hesapla, tüm sonuçları changes:[{row,col,value}] olarak yaz
- sort: sıralanmış her satırı changes'e yaz (row:0 başlık satırı, row:1'den itibaren sıralı veriler)
- highlight: renklendirilecek hücreleri highlight:[{row,col,color}] olarak yaz, geçerli hex renk kullan
- delete_rows/remove_duplicates: silinecek satırları changes'de value:"__DELETE__" ile işaretle
- filter: koşula uymayan satırları changes'de value:"__HIDE__" ile işaretle
- message: hesaplama yok, sadece reply döndür

JSON FORMATI:
{
  "action": "update_cells|highlight|sort|filter|message|delete_rows|remove_duplicates",
  "changes": [{"row": 0, "col": 0, "value": "hesaplanmış değer"}],
  "highlight": [{"row": 0, "col": 0, "color": "#fecaca"}],
  "reply": "Türkçe açıklama"
}`;
}

module.exports = { buildExcelPrompt };
