function buildExcelPrompt(userCommand, examples, sheetContext) {
  const examplesText = examples.length > 0
    ? examples.map((ex, i) => `
Örnek ${i + 1}:
Komut: "${ex.command}"
Çıktı: ${JSON.stringify(ex.output, null, 2)}`
    ).join('\n')
    : 'Örnek bulunamadı.';

  return `Sen bir Excel AI motorusun. SADECE JSON döndür.

MEVCUT VERİ:
${sheetContext ? sheetContext.substring(0, 2000) : 'Veri yok'}

BENZER KOMUT ÖRNEKLERİ:
${examplesText}

KULLANICI KOMUTU: "${userCommand}"

ZORUNLU KURALLAR:
1. SADECE geçerli JSON döndür
2. Açıklama, yorum, markdown YASAK
3. Şu alanları içermeli: action, changes, reply
4. reply alanı Türkçe olmalı
5. changes boş array olabilir ama bulunmalı

JSON FORMATI:
{
  "action": "update_cells|highlight|sort|filter|message|delete_rows|remove_duplicates",
  "changes": [{"row": number, "col": number, "value": "string"}],
  "highlight": [{"row": number, "col": number, "color": "#hexcode"}],
  "reply": "Türkçe açıklama",
  "formula": "opsiyonel",
  "condition": "opsiyonel"
}`;
}

module.exports = { buildExcelPrompt };
