CREATE TABLE IF NOT EXISTS diagnostic_patterns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_key text NOT NULL UNIQUE,
  pattern_description text NOT NULL,
  likely_causes text NOT NULL,
  suggested_fix_field text NOT NULL,
  suggested_fix_approach text NOT NULL
);

ALTER TABLE diagnostic_patterns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_patterns" ON diagnostic_patterns
  FOR SELECT USING (true);

INSERT INTO diagnostic_patterns (pattern_key, pattern_description, likely_causes, suggested_fix_field, suggested_fix_approach) VALUES

('low_click_through',
 'Ürün çok görüntüleniyor ama az tıklanıyor — ilk izlenimde ilgi çekmiyor',
 'Başlık dikkat çekmiyor olabilir, öne çıkan görsel zayıf olabilir, fiyat rekabetçi görünmüyor olabilir',
 'title',
 'Başlığı daha net, faydayı öne çıkaran bir dille yeniden yaz — ürünün "kim için" olduğunu netleştir'),

('low_cart_add',
 'Ürün tıklanıyor (ürün sayfası açılıyor) ama sepete eklenmiyor — detay sayfasında ikna edemiyor',
 'Açıklama yetersiz/belirsiz kalıyor olabilir, görsel sayısı az olabilir, itirazlar (malzeme, beden, uyumluluk) yanıtlanmıyor olabilir',
 'description',
 'SEO açıklamasını, olası itirazları (malzeme, kullanım, uyumluluk) proaktif yanıtlayacak şekilde zenginleştir'),

('high_cart_abandonment',
 'Ürün sepete ekleniyor ama satın alma tamamlanmıyor — son adımda kayıp yaşanıyor',
 'Bu genelde ürün içeriğinden çok fiyat/kargo/ödeme sürecine bağlı olabilir — SEO açıklamasında fiyat/kargo netliği artırılabilir',
 'description',
 'SEO açıklamasına kargo süresi, iade politikası gibi güven artırıcı net bilgi ekle — bu tam çözüm değil, ek bir katkı sağlar')

ON CONFLICT (pattern_key) DO NOTHING;
