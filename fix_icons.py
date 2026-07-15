BS = chr(92)
Q  = chr(39)

onerror_emoji = f'onerror="this.style.display={BS}{Q}none{BS}{Q};this.parentNode.innerHTML={BS}{Q}⚙️{BS}{Q}"'
img_style = 'width="20" height="20" style="object-fit:contain;border-radius:4px;"'

def clearbit_img(domain):
    return f'<img src="https://logo.clearbit.com/{domain}" {img_style} {onerror_emoji}/>'

with open('automations.html', 'r', encoding='utf-8') as f:
    content = f.read()

changes = 0

# Fix 1: pdf_generator — adobe.com img without onerror
old1 = f'<img src="https://logo.clearbit.com/adobe.com" {img_style}/>'
new1 = clearbit_img('adobe.com')
if old1 in content:
    content = content.replace(old1, new1)
    changes += 1
    print('Fix 1 (pdf_generator): OK')
else:
    print('Fix 1 (pdf_generator): NOT FOUND')

# Fix 2: data_transform — n8n.io img without onerror
old2 = f'<img src="https://logo.clearbit.com/n8n.io" {img_style}/>'
new2 = clearbit_img('n8n.io')
if old2 in content:
    content = content.replace(old2, new2)
    changes += 1
    print('Fix 2 (data_transform): OK')
else:
    print('Fix 2 (data_transform): NOT FOUND')

# Fix 3: zapier_webhook — emoji span -> clearbit img (id context to avoid other ⚡ spans)
old3 = "id:'zapier_webhook', name:'Zapier Webhook', cat:'Gelişmiş',\n    icon:'<span style=\"font-size:13px;line-height:1\">⚡</span>',"
new3 = f"id:'zapier_webhook', name:'Zapier Webhook', cat:'Gelişmiş',\n    icon:'{clearbit_img('zapier.com')}',"
if old3 in content:
    content = content.replace(old3, new3)
    changes += 1
    print('Fix 3 (zapier_webhook): OK')
else:
    print('Fix 3 (zapier_webhook): NOT FOUND')

# Fix 4: make_webhook — emoji span -> clearbit img
old4 = "id:'make_webhook', name:'Make (Integromat)', cat:'Gelişmiş',\n    icon:'<span style=\"font-size:13px;line-height:1\">🔄</span>',"
new4 = f"id:'make_webhook', name:'Make (Integromat)', cat:'Gelişmiş',\n    icon:'{clearbit_img('make.com')}',"
if old4 in content:
    content = content.replace(old4, new4)
    changes += 1
    print('Fix 4 (make_webhook): OK')
else:
    print('Fix 4 (make_webhook): NOT FOUND')

with open('automations.html', 'w', encoding='utf-8') as f:
    f.write(content)

print(f'\nToplam {changes}/4 değişiklik uygulandı.')
