import os, re

icons_dir = r'c:\Users\POWERLAB\Desktop\excel-ai\icons\integrations'

BRAND_COLORS = {
    'google_sheets.svg': '#34A853', 'gmail.svg': '#EA4335',
    'shopify.svg': '#96BF48', 'hubspot.svg': '#FF7A59',
    'google_drive.svg': '#4285F4', 'woocommerce.svg': '#96588A',
    'etsy.svg': '#F1641E', 'amazon.svg': '#FF9900',
    'bigcommerce.svg': '#34313F', 'mailchimp.svg': '#FFE01B',
    'salesforce.svg': '#00A1E0', 'zoho_crm.svg': '#E42527',
    'notion.svg': '#000000', 'airtable.svg': '#2D7FF9',
    'trello.svg': '#0052CC', 'asana.svg': '#F06A6A',
    'jira.svg': '#0052CC', 'linear.svg': '#5E6AD2',
    'clickup.svg': '#7B68EE', 'whatsapp.svg': '#25D366',
    'telegram.svg': '#26A5E4', 'discord.svg': '#5865F2',
    'stripe.svg': '#635BFF', 'paypal.svg': '#003087',
    'google_analytics.svg': '#E37400', 'mixpanel.svg': '#7856FF',
    'dropbox.svg': '#0061FF', 'onedrive.svg': '#0078D4',
    'github.svg': '#181717', 'gitlab.svg': '#FC6D26',
    'google_ads.svg': '#4285F4', 'meta_ads.svg': '#0082FB',
    'tiktok_ads.svg': '#000000', 'zendesk.svg': '#03363D',
    'intercom.svg': '#1F8DED', 'zapier_webhook.svg': '#FF4A00',
    'quickbooks.svg': '#2CA01C', 'make_webhook.svg': '#00B1A2',
}

count = 0
for filename, color in BRAND_COLORS.items():
    path = os.path.join(icons_dir, filename)
    if not os.path.exists(path):
        print(f"NOT FOUND: {filename}")
        continue
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    if 'role="img"' not in content:
        continue  # gilbarbara or letter-circle, already colored
    new_content = re.sub(r'(<svg\b[^>]*?)(>)', rf'\1 fill="{color}"\2', content, count=1)
    if new_content != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Colored: {filename} -> {color}")
        count += 1

print(f"\nDone! {count} icons colorized.")
