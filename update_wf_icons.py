import re

ICON_MAP = {
    'trigger_schedule':       ('', '#6366f1', '#eef2ff'),
    'trigger_webhook':        ('', '#16a34a', '#f0fdf4'),
    'google_sheets':          ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/googlesheets.svg', '#0F9D58', '#E8F5E9'),
    'slack':                  ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/slack.svg', '#4A154B', '#F4EDE4'),
    'gmail':                  ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/gmail.svg', '#EA4335', '#FEE8E6'),
    'shopify':                ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/shopify.svg', '#96BF48', '#F0F7E6'),
    'hubspot':                ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/hubspot.svg', '#FF7A59', '#FFF0EC'),
    'mocksheets_ai':          ('', '#6366f1', '#eef2ff'),
    'google_drive':           ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/googledrive.svg', '#4285F4', '#EAF1FF'),
    'http_request':           ('', '#374151', '#F3F4F6'),
    'if_condition':           ('', '#D97706', '#FEF3C7'),
    'woocommerce':            ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/woocommerce.svg', '#7F54B3', '#F5F0FB'),
    'trendyol':               ('', '#F27A1A', '#FEF0E0'),
    'hepsiburada':            ('', '#FF6000', '#FFF0E6'),
    'etsy':                   ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/etsy.svg', '#F1641E', '#FEF0EA'),
    'amazon':                 ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/amazon.svg', '#FF9900', '#FFF5E6'),
    'bigcommerce':            ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/bigcommerce.svg', '#34313F', '#F0F0F2'),
    'klaviyo':                ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/klaviyo.svg', '#000000', '#F5F5F5'),
    'mailchimp':              ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/mailchimp.svg', '#FFE01B', '#FFFDE6'),
    'omnisend':               ('', '#6366f1', '#eef2ff'),
    'activecampaign':         ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/activecampaign.svg', '#356AE6', '#EBF0FD'),
    'salesforce':             ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/salesforce.svg', '#00A1E0', '#E6F6FC'),
    'pipedrive':              ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/pipedrive.svg', '#0D7230', '#E6F4EC'),
    'zoho_crm':               ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/zoho.svg', '#E42527', '#FDEAEA'),
    'notion':                 ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/notion.svg', '#000000', '#F5F5F5'),
    'airtable':               ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/airtable.svg', '#18BFFF', '#E6F9FF'),
    'trello':                 ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/trello.svg', '#0052CC', '#E6EEFF'),
    'asana':                  ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/asana.svg', '#F06A6A', '#FEF0F0'),
    'monday':                 ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/mondaydotcom.svg', '#FF3D57', '#FFE8EB'),
    'jira':                   ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/jira.svg', '#0052CC', '#E6EEFF'),
    'linear':                 ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/linear.svg', '#5E6AD2', '#EEEFFE'),
    'clickup':                ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/clickup.svg', '#7B68EE', '#F2F0FE'),
    'microsoft_teams':        ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/microsoftteams.svg', '#6264A7', '#EEEFFE'),
    'whatsapp':               ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/whatsapp.svg', '#25D366', '#E8FBF0'),
    'telegram':               ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/telegram.svg', '#26A5E4', '#E8F5FD'),
    'discord':                ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/discord.svg', '#5865F2', '#EEEFFE'),
    'stripe':                 ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/stripe.svg', '#635BFF', '#F0EFFE'),
    'iyzico':                 ('', '#01A0E2', '#E6F5FB'),
    'paypal':                 ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/paypal.svg', '#003087', '#E6EAEF'),
    'quickbooks':             ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/quickbooks.svg', '#2CA01C', '#E8F5E9'),
    'google_analytics':       ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/googleanalytics.svg', '#E37400', '#FEF4E6'),
    'mixpanel':               ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/mixpanel.svg', '#7856FF', '#F2EFFE'),
    'dropbox':                ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/dropbox.svg', '#0061FF', '#E6EFFE'),
    'onedrive':               ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/microsoftonedrive.svg', '#0078D4', '#E6F0FB'),
    'github':                 ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg', '#181717', '#F0F0F0'),
    'gitlab':                 ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/gitlab.svg', '#FC6D26', '#FEF1EA'),
    'shipstation':            ('', '#1B4F8A', '#E6ECF4'),
    'google_ads':             ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/googleads.svg', '#4285F4', '#EAF1FF'),
    'meta_ads':               ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/meta.svg', '#0081FB', '#E6F1FF'),
    'tiktok_ads':             ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/tiktok.svg', '#000000', '#F5F5F5'),
    'zendesk':                ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/zendesk.svg', '#03363D', '#E6ECED'),
    'intercom':               ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/intercom.svg', '#1F8DED', '#E7F2FD'),
    'freshdesk':              ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/freshdesk.svg', '#25C16F', '#E8FAF1'),
    'zapier_webhook':         ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/zapier.svg', '#FF4A00', '#FFE9E6'),
    'make_webhook':           ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/make.svg', '#6D00CC', '#F2E6FF'),
    'pdf_generator':          ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/adobeacrobatreader.svg', '#EC1C24', '#FDE8E9'),
    'bamboohr':               ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/bamboohr.svg', '#73C41D', '#EEF9E6'),
    'workday':                ('', '#CC3300', '#FAE8E6'),
    'personio':               ('', '#FF645A', '#FFEDEC'),
    'deel':                   ('', '#16325B', '#E6EBF1'),
    'gusto':                  ('', '#F45D48', '#FEEEEC'),
    'rippling':               ('', '#F9C846', '#FEFAEC'),
    'sap_hr':                 ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/sap.svg', '#0070F2', '#E6F0FE'),
    'xero':                   ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/xero.svg', '#13B5EA', '#E7F6FD'),
    'freshbooks':             ('', '#0075DD', '#E6F2FF'),
    'netsuite':               ('', '#CC0000', '#FAE6E6'),
    'parasut':                ('', '#5B3DE8', '#EEEAFD'),
    'sage':                   ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/sage.svg', '#00DC06', '#E6FFE6'),
    'odoo':                   ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/odoo.svg', '#714B67', '#F1ECF0'),
    'hootsuite':              ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/hootsuite.svg', '#143059', '#E6EBF1'),
    'buffer':                 ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/buffer.svg', '#231F20', '#EBEBEB'),
    'sprout_social':          ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/sproutsocial.svg', '#59CB59', '#EDFAED'),
    'later':                  ('', '#FF5F6D', '#FFEDEE'),
    'publer':                 ('', '#1877F2', '#E7F1FE'),
    'zoom':                   ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/zoom.svg', '#2D8CFF', '#EAF3FF'),
    'google_calendar':        ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/googlecalendar.svg', '#4285F4', '#EAF1FF'),
    'calendly':               ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/calendly.svg', '#006BFF', '#E6EFFE'),
    'loom':                   ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/loom.svg', '#625DF5', '#EEEDFE'),
    'typeform':               ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/typeform.svg', '#262627', '#EBEBEB'),
    'jotform':                ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/jotform.svg', '#FF6100', '#FFF0E6'),
    'surveymonkey':           ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/surveymonkey.svg', '#00BF6F', '#E6FAF2'),
    'tally':                  ('', '#000000', '#F5F5F5'),
    'google_forms':           ('', '#7248B9', '#F0ECFA'),
    'gorgias':                ('', '#3B1EFA', '#ECEAFE'),
    'tidio':                  ('', '#1C3F94', '#E7EBF4'),
    'helpscout':              ('', '#1292EE', '#E7F4FD'),
    'crisp':                  ('', '#1972F5', '#E7EFFE'),
    'tableau':                ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/tableau.svg', '#E97627', '#FEF3EA'),
    'power_bi':               ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/powerbi.svg', '#F2C811', '#FEFAE6'),
    'looker':                 ('', '#34A853', '#E8F5EC'),
    'amplitude':              ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/amplitude.svg', '#1A1A2E', '#EBEBF0'),
    'semrush':                ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/semrush.svg', '#FF6B2B', '#FFF0EA'),
    'miro':                   ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/miro.svg', '#FFD02F', '#FEFAE6'),
    'basecamp':               ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/basecamp.svg', '#1D2D35', '#EAECED'),
    'lark':                   ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/lark.svg', '#1664FF', '#E7EFFE'),
    'confluence':             ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/confluence.svg', '#0052CC', '#E6EEFF'),
    'box':                    ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/box.svg', '#0061D5', '#E6EFFE'),
    'convertkit':             ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/convertkit.svg', '#FB6970', '#FFEDEE'),
    'brevo':                  ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/brevo.svg', '#0B996E', '#E6F5F1'),
    'hubspot_marketing':      ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/hubspot.svg', '#FF7A59', '#FFF0EC'),
    'pabbly':                 ('', '#6E4BEC', '#EEEAFD'),
    'workato':                ('', '#1A73E8', '#E7F0FD'),
    'google_search_console':  ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/googlesearchconsole.svg', '#4285F4', '#EAF1FF'),
    'openai':                 ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/openai.svg', '#412991', '#EEEAFD'),
    'anthropic':              ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/anthropic.svg', '#D97706', '#FEF3E6'),
    'google_gemini':          ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/googlegemini.svg', '#4285F4', '#EAF1FF'),
    'mistral':                ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/mistral.svg', '#FF7000', '#FFF0E6'),
    'docusign':               ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/docusign.svg', '#FFB900', '#FEF9E6'),
    'wordpress':              ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/wordpress.svg', '#21759B', '#E7F3F9'),
    'webflow':                ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/webflow.svg', '#4353FF', '#EAEBFF'),
    'figma':                  ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/figma.svg', '#F24E1E', '#FEEEEA'),
    'canva':                  ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/canva.svg', '#00C4CC', '#E6FAFB'),
    'contentful':             ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/contentful.svg', '#2478CC', '#E8F1FB'),
    'ghost':                  ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/ghost.svg', '#15171A', '#EBEBEB'),
    'aws_s3':                 ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/amazons3.svg', '#FF9900', '#FFF5E6'),
    'google_cloud':           ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/googlecloud.svg', '#4285F4', '#EAF1FF'),
    'vercel':                 ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/vercel.svg', '#000000', '#F5F5F5'),
    'supabase_db':            ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/supabase.svg', '#3ECF8E', '#EAF9F3'),
    'twilio':                 ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/twilio.svg', '#F22F46', '#FEEBEE'),
    'sendgrid':               ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/sendgrid.svg', '#1A82E2', '#E7F1FD'),
    'mysql':                  ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/mysql.svg', '#4479A1', '#EAF0F6'),
    'postgresql':             ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/postgresql.svg', '#4169E1', '#EAEDFC'),
    'mongodb':                ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/mongodb.svg', '#47A248', '#EAEFE9'),
    'redis':                  ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/redis.svg', '#FF4438', '#FFEBEA'),
    'ms_power_automate':      ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/powerautomate.svg', '#0066FF', '#E6EFFE'),
    'ms_excel_online':        ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/microsoftexcel.svg', '#217346', '#E8F2EC'),
    'ms_outlook':             ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/microsoftoutlook.svg', '#0078D4', '#E6F0FB'),
    'ms_sharepoint':          ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/microsoftsharepoint.svg', '#038387', '#E6F2F3'),
    'instagram':              ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/instagram.svg', '#E4405F', '#FDEAEE'),
    'youtube':                ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/youtube.svg', '#FF0000', '#FFE6E6'),
    'twitter_x':              ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/x.svg', '#000000', '#F5F5F5'),
    'pinterest':              ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/pinterest.svg', '#E60023', '#FDE6E9'),
    'vimeo':                  ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/vimeo.svg', '#1AB7EA', '#E7F7FD'),
    'cloudinary':             ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/cloudinary.svg', '#3448C5', '#EAEDFA'),
    'eventbrite':             ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/eventbrite.svg', '#F05537', '#FEEEEB'),
    'auth0':                  ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/auth0.svg', '#EB5424', '#FEEDEA'),
    'okta':                   ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/okta.svg', '#007DC1', '#E6F2FA'),
    'cloudflare':             ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/cloudflare.svg', '#F48120', '#FEF3EA'),
    'binance':                ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/binance.svg', '#F0B90B', '#FEFAE6'),
    'google_bigquery':        ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/googlebigquery.svg', '#4285F4', '#EAF1FF'),
    'snowflake':              ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/snowflake.svg', '#29B5E8', '#E8F7FD'),
    'wix':                    ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/wix.svg', '#000000', '#F5F5F5'),
    'attio':                  ('', '#1A1A1A', '#F0F0F0'),
    'render':                 ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/render.svg', '#46E3B7', '#EAFAF6'),
    'railway':                ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/railway.svg', '#0B0D0E', '#EBEBEB'),
    'retool':                 ('', '#3D3D3D', '#EBEBEB'),
    'ifttt':                  ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/ifttt.svg', '#000000', '#F5F5F5'),
    'stability_ai':           ('', '#4B0082', '#F0E6FF'),
    'elevenlabs':             ('', '#000000', '#F5F5F5'),
    'replicate':              ('', '#000000', '#F5F5F5'),
    'magento':                ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/magento.svg', '#EE672F', '#FEF0EA'),
    'prestashop':             ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/prestashop.svg', '#DF0067', '#FCE6EF'),
    'squarespace':            ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/squarespace.svg', '#000000', '#F5F5F5'),
    'ahrefs':                 ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/ahrefs.svg', '#1B68F5', '#E7EFFE'),
    'linkedin_ads':           ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/linkedin.svg', '#0A66C2', '#E6EFF9'),
    'ms_dynamics':            ('', '#002050', '#E6E9EF'),
    'hotjar':                 ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/hotjar.svg', '#FF3C00', '#FFE8E6'),
    'canny':                  ('', '#1877F2', '#E7F1FE'),
    'productboard':           ('', '#CC4700', '#FAF0E6'),
    'healthie':               ('', '#00A878', '#E6F5F2'),
    'simplepractice':         ('', '#00A878', '#E6F5F2'),
    'clio':                   ('', '#00A0DC', '#E6F4FB'),
    'follow_up_boss':         ('', '#1565C0', '#E7EEF9'),
    'ms_teams_forms':         ('', '#6264A7', '#EEEFFE'),
    'google_workspace':       ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/google.svg', '#4285F4', '#EAF1FF'),
    'notion_forms':           ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/notion.svg', '#000000', '#F5F5F5'),
    'klaviyo_sms':            ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/klaviyo.svg', '#000000', '#F5F5F5'),
    'outscraper':             ('', '#1565C0', '#E7EEF9'),
    'coingecko':              ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/coingecko.svg', '#8DC63F', '#F2F8E6'),
    'data_transform':         ('', '#374151', '#F3F4F6'),
    'n8n':                    ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/n8n.svg', '#EA4B71', '#FEEBEF'),
}

with open('automations.html', 'r', encoding='utf-8') as f:
    content = f.read()

# ── STEP 1: Replace icon: fields in WF_INTEGRATIONS ──────────────────────────

# Collect all replacement positions (to apply in reverse order → no index drift)
replacements = []
not_found = []

for integ_id, (url, color, bg) in ICON_MAP.items():
    # Find the id:'integ_id' occurrence
    id_match = re.search(r"id\s*:\s*'" + re.escape(integ_id) + r"'", content)
    if not id_match:
        not_found.append(integ_id)
        continue

    # From id position, find the next `icon:` line (within 600 chars to stay in same block)
    search_start = id_match.start()
    search_area = content[search_start:search_start + 600]

    # Match icon: 'value' line — value may contain escaped single quotes \'
    icon_match = re.search(r'\n(\s*)icon\s*:[^\n]*\n', search_area)
    if not icon_match:
        not_found.append(f'{integ_id} (no icon line)')
        continue

    abs_start = search_start + icon_match.start()
    abs_end   = search_start + icon_match.end()
    indent    = icon_match.group(1)

    new_lines = (
        f"\n{indent}iconUrl:'{url}',\n"
        f"{indent}iconColor:'{color}',\n"
        f"{indent}iconBg:'{bg}',\n"
    )

    replacements.append((abs_start, abs_end, new_lines))
    print(f'OK: {integ_id}')

# Apply replacements in reverse order so positions stay valid
replacements.sort(key=lambda x: x[0], reverse=True)
for start, end, new_text in replacements:
    content = content[:start] + new_text + content[end:]

print(f'\nReplaced: {len(replacements)}')
if not_found:
    print(f'Not found: {not_found}')

# ── STEP 2: Update wfRenderSidebar ───────────────────────────────────────────

old_sidebar = (
    "'<div class=\"wf-node-ico\" style=\"background:'+(i.color||'#f4f4f5')+'\">'"
    "+(i.icon&&(i.icon.startsWith('<img')||i.icon.startsWith('<svg'))?i.icon:'<span style=\"font-size:15px\">'+(i.icon||'⚙️')+'</span>')"
    "+'</div>'+"
)

new_sidebar = (
    "'<div class=\"wf-node-ico\" style=\"background:'+(i.iconBg||i.color||'#f4f4f5')+';border-radius:8px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;flex-shrink:0;\">'"
    "+(i.iconUrl"
    "?'<img src=\"'+i.iconUrl+'\" width=\"18\" height=\"18\" style=\"object-fit:contain;\" />'"
    ":'<span style=\"font-size:14px;font-weight:600;color:'+(i.iconColor||'#374151')+'\">'+(i.name||'?')[0]+'</span>')"
    "+'</div>'+"
)

if old_sidebar in content:
    content = content.replace(old_sidebar, new_sidebar, 1)
    print('wfRenderSidebar: OK')
else:
    print('wfRenderSidebar: NOT FOUND — manual check needed')

# ── STEP 3: Update WFNode component ──────────────────────────────────────────

old_wfnode = (
    "<div className=\"wf-fc-icon\" style={{background: integ.color || '#f4f4f5'}}>"
    "{integ.icon ? <span dangerouslySetInnerHTML={{__html: integ.icon}}/> : "
    "<span style={{fontSize:'14px'}}>⚙️</span>}</div>"
)

new_wfnode = (
    "<div className=\"wf-fc-icon\" style={{background: integ.iconBg || integ.color || '#f4f4f5', "
    "borderRadius:'7px', width:'28px', height:'28px', display:'flex', alignItems:'center', "
    "justifyContent:'center', flexShrink:0}}>"
    "{integ.iconUrl "
    "? <img src={integ.iconUrl} width=\"16\" height=\"16\" style={{objectFit:'contain'}} /> "
    ": <span style={{fontSize:'13px', fontWeight:'600', color: integ.iconColor || '#374151'}}>"
    "{(integ.name || '?')[0]}</span>}</div>"
)

if old_wfnode in content:
    content = content.replace(old_wfnode, new_wfnode, 1)
    print('WFNode: OK')
else:
    print('WFNode: NOT FOUND — manual check needed')

with open('automations.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('\nDone. automations.html written.')
