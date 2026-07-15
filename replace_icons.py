import re

ICON_MAP = {
    'google_sheets':    ('googlesheets',       'invert(35%) sepia(98%) saturate(400%) hue-rotate(95deg)'),
    'google_drive':     ('googledrive',         'none'),
    'slack':            ('slack',               'none'),
    'gmail':            ('gmail',               'invert(27%) sepia(89%) saturate(1000%) hue-rotate(340deg)'),
    'shopify':          ('shopify',             'invert(62%) sepia(60%) saturate(400%) hue-rotate(60deg)'),
    'hubspot':          ('hubspot',             'invert(55%) sepia(60%) saturate(700%) hue-rotate(340deg)'),
    'microsoft_teams':  ('microsoftteams',      'invert(38%) sepia(80%) saturate(700%) hue-rotate(230deg)'),
    'whatsapp':         ('whatsapp',            'invert(48%) sepia(98%) saturate(400%) hue-rotate(90deg)'),
    'telegram':         ('telegram',            'invert(38%) sepia(80%) saturate(700%) hue-rotate(190deg)'),
    'discord':          ('discord',             'invert(38%) sepia(60%) saturate(700%) hue-rotate(250deg)'),
    'notion':           ('notion',              'brightness(0)'),
    'airtable':         ('airtable',            'invert(38%) sepia(60%) saturate(700%) hue-rotate(250deg)'),
    'trello':           ('trello',              'invert(38%) sepia(80%) saturate(700%) hue-rotate(190deg)'),
    'asana':            ('asana',               'invert(55%) sepia(80%) saturate(700%) hue-rotate(340deg)'),
    'monday':           ('mondaydotcom',        'none'),
    'jira':             ('jira',                'invert(38%) sepia(80%) saturate(700%) hue-rotate(190deg)'),
    'linear':           ('linear',              'invert(38%) sepia(60%) saturate(700%) hue-rotate(250deg)'),
    'clickup':          ('clickup',             'invert(38%) sepia(60%) saturate(700%) hue-rotate(250deg)'),
    'stripe':           ('stripe',              'invert(38%) sepia(80%) saturate(700%) hue-rotate(230deg)'),
    'iyzico':           ('iyzico',              'invert(38%) sepia(80%) saturate(700%) hue-rotate(190deg)'),
    'paypal':           ('paypal',              'invert(38%) sepia(80%) saturate(700%) hue-rotate(190deg)'),
    'github':           ('github',              'brightness(0)'),
    'gitlab':           ('gitlab',              'invert(55%) sepia(80%) saturate(700%) hue-rotate(340deg)'),
    'dropbox':          ('dropbox',             'invert(38%) sepia(80%) saturate(700%) hue-rotate(190deg)'),
    'google_analytics': ('googleanalytics',     'invert(55%) sepia(80%) saturate(700%) hue-rotate(340deg)'),
    'salesforce':       ('salesforce',          'invert(38%) sepia(80%) saturate(700%) hue-rotate(190deg)'),
    'pipedrive':        ('pipedrive',           'invert(55%) sepia(80%) saturate(700%) hue-rotate(340deg)'),
    'zendesk':          ('zendesk',             'invert(48%) sepia(98%) saturate(400%) hue-rotate(90deg)'),
    'intercom':         ('intercom',            'invert(38%) sepia(80%) saturate(700%) hue-rotate(250deg)'),
    'freshdesk':        ('freshdesk',           'invert(48%) sepia(98%) saturate(400%) hue-rotate(90deg)'),
    'mailchimp':        ('mailchimp',           'invert(65%) sepia(80%) saturate(500%) hue-rotate(10deg)'),
    'klaviyo':          ('klaviyo',             'brightness(0)'),
    'activecampaign':   ('activecampaign',      'invert(38%) sepia(60%) saturate(500%) hue-rotate(120deg)'),
    'miro':             ('miro',                'invert(65%) sepia(80%) saturate(500%) hue-rotate(10deg)'),
    'confluence':       ('confluence',          'invert(38%) sepia(80%) saturate(700%) hue-rotate(190deg)'),
    'figma':            ('figma',               'none'),
    'canva':            ('canva',               'invert(38%) sepia(80%) saturate(700%) hue-rotate(250deg)'),
    'wordpress':        ('wordpress',           'invert(38%) sepia(80%) saturate(700%) hue-rotate(190deg)'),
    'webflow':          ('webflow',             'invert(38%) sepia(80%) saturate(700%) hue-rotate(190deg)'),
    'openai':           ('openai',              'brightness(0)'),
    'anthropic':        ('anthropic',           'brightness(0)'),
    'twilio':           ('twilio',              'invert(27%) sepia(89%) saturate(1000%) hue-rotate(340deg)'),
    'sendgrid':         ('sendgrid',            'invert(38%) sepia(80%) saturate(700%) hue-rotate(190deg)'),
    'aws_s3':           ('amazons3',            'invert(55%) sepia(80%) saturate(700%) hue-rotate(340deg)'),
    'google_cloud':     ('googlecloud',         'invert(38%) sepia(80%) saturate(700%) hue-rotate(190deg)'),
    'vercel':           ('vercel',              'brightness(0)'),
    'supabase_db':      ('supabase',            'invert(48%) sepia(98%) saturate(400%) hue-rotate(90deg)'),
    'mysql':            ('mysql',               'invert(38%) sepia(80%) saturate(700%) hue-rotate(190deg)'),
    'mongodb':          ('mongodb',             'invert(48%) sepia(98%) saturate(400%) hue-rotate(90deg)'),
    'postgresql':       ('postgresql',          'invert(38%) sepia(80%) saturate(700%) hue-rotate(190deg)'),
    'redis':            ('redis',               'invert(27%) sepia(89%) saturate(1000%) hue-rotate(340deg)'),
    'docusign':         ('docusign',            'invert(38%) sepia(80%) saturate(700%) hue-rotate(190deg)'),
    'zoom':             ('zoom',                'invert(38%) sepia(80%) saturate(700%) hue-rotate(190deg)'),
    'calendly':         ('calendly',            'invert(38%) sepia(80%) saturate(700%) hue-rotate(190deg)'),
    'typeform':         ('typeform',            'brightness(0)'),
    'jotform':          ('jotform',             'invert(55%) sepia(80%) saturate(700%) hue-rotate(340deg)'),
    'woocommerce':      ('woocommerce',         'invert(38%) sepia(60%) saturate(500%) hue-rotate(250deg)'),
    'etsy':             ('etsy',                'invert(55%) sepia(80%) saturate(700%) hue-rotate(340deg)'),
    'amazon':           ('amazon',              'invert(65%) sepia(80%) saturate(500%) hue-rotate(10deg)'),
    'hootsuite':        ('hootsuite',           'invert(70%) sepia(80%) saturate(500%) hue-rotate(10deg)'),
    'buffer':           ('buffer',              'brightness(0)'),
    'instagram':        ('instagram',           'invert(38%) sepia(80%) saturate(700%) hue-rotate(250deg)'),
    'youtube':          ('youtube',             'invert(27%) sepia(89%) saturate(1000%) hue-rotate(340deg)'),
    'twitter_x':        ('x',                   'brightness(0)'),
    'pinterest':        ('pinterest',           'invert(27%) sepia(89%) saturate(1000%) hue-rotate(340deg)'),
    'tableau':          ('tableau',             'invert(55%) sepia(80%) saturate(700%) hue-rotate(340deg)'),
    'amplitude':        ('amplitude',           'invert(38%) sepia(80%) saturate(700%) hue-rotate(190deg)'),
    'semrush':          ('semrush',             'invert(55%) sepia(80%) saturate(700%) hue-rotate(340deg)'),
    'auth0':            ('auth0',               'invert(38%) sepia(60%) saturate(700%) hue-rotate(250deg)'),
    'okta':             ('okta',                'invert(38%) sepia(80%) saturate(700%) hue-rotate(190deg)'),
    'cloudflare':       ('cloudflare',          'invert(55%) sepia(80%) saturate(700%) hue-rotate(340deg)'),
    'bamboohr':         ('bamboohr',            'invert(48%) sepia(98%) saturate(400%) hue-rotate(90deg)'),
    'xero':             ('xero',                'invert(38%) sepia(80%) saturate(700%) hue-rotate(190deg)'),
    'sage':             ('sage',                'invert(48%) sepia(98%) saturate(400%) hue-rotate(90deg)'),
    'odoo':             ('odoo',                'invert(38%) sepia(60%) saturate(700%) hue-rotate(250deg)'),
    'eventbrite':       ('eventbrite',          'invert(55%) sepia(80%) saturate(700%) hue-rotate(340deg)'),
    'binance':          ('binance',             'invert(65%) sepia(80%) saturate(500%) hue-rotate(10deg)'),
    'wix':              ('wix',                 'brightness(0)'),
    'retool':           ('retool',              'brightness(0)'),
    'attio':            ('attio',               'brightness(0)'),
    'render':           ('render',              'invert(38%) sepia(80%) saturate(700%) hue-rotate(250deg)'),
    'smartsheet':       ('smartsheet',          'invert(38%) sepia(80%) saturate(700%) hue-rotate(190deg)'),
    'coda':             ('coda',                'brightness(0)'),
    'google_calendar':  ('googlecalendar',      'invert(38%) sepia(80%) saturate(700%) hue-rotate(190deg)'),
    'loom':             ('loom',                'invert(38%) sepia(60%) saturate(700%) hue-rotate(250deg)'),
    'hotjar':           ('hotjar',              'invert(55%) sepia(80%) saturate(700%) hue-rotate(340deg)'),
    'surveymonkey':     ('surveymonkey',        'invert(48%) sepia(98%) saturate(400%) hue-rotate(90deg)'),
    'helpscout':        ('helpscout',           'invert(38%) sepia(80%) saturate(700%) hue-rotate(190deg)'),
    'gorgias':          ('gorgias',             'invert(38%) sepia(60%) saturate(700%) hue-rotate(250deg)'),
    'mixpanel':         ('mixpanel',            'brightness(0)'),
    'ms_power_automate':('powerautomate',       'invert(38%) sepia(80%) saturate(700%) hue-rotate(190deg)'),
    'ms_excel_online':  ('microsoftexcel',      'invert(48%) sepia(98%) saturate(400%) hue-rotate(90deg)'),
    'ms_outlook':       ('microsoftoutlook',    'invert(38%) sepia(80%) saturate(700%) hue-rotate(190deg)'),
    'ms_sharepoint':    ('microsoftsharepoint', 'invert(38%) sepia(80%) saturate(700%) hue-rotate(190deg)'),
    'google_bigquery':  ('googlebigquery',      'invert(38%) sepia(80%) saturate(700%) hue-rotate(190deg)'),
    'snowflake':        ('snowflake',           'invert(38%) sepia(80%) saturate(700%) hue-rotate(190deg)'),
    'vimeo':            ('vimeo',               'invert(38%) sepia(80%) saturate(700%) hue-rotate(190deg)'),
    'cloudinary':       ('cloudinary',          'invert(38%) sepia(80%) saturate(700%) hue-rotate(190deg)'),
    'ghost':            ('ghost',               'brightness(0)'),
    'contentful':       ('contentful',          'invert(38%) sepia(80%) saturate(700%) hue-rotate(190deg)'),
    'railway':          ('railway',             'brightness(0)'),
    'coingecko':        ('coingecko',           'invert(48%) sepia(98%) saturate(400%) hue-rotate(90deg)'),
    'brevo':            ('brevo',               'invert(48%) sepia(98%) saturate(400%) hue-rotate(90deg)'),
    'convertkit':       ('convertkit',          'invert(27%) sepia(89%) saturate(1000%) hue-rotate(340deg)'),
    'omnisend':         ('omnisend',            'invert(38%) sepia(60%) saturate(700%) hue-rotate(250deg)'),
    'ahrefs':           ('ahrefs',              'invert(38%) sepia(80%) saturate(700%) hue-rotate(190deg)'),
    'google_ads':       ('googleads',           'invert(55%) sepia(80%) saturate(700%) hue-rotate(190deg)'),
    'meta_ads':         ('meta',                'invert(38%) sepia(80%) saturate(700%) hue-rotate(190deg)'),
    'tiktok_ads':       ('tiktok',              'brightness(0)'),
    'linkedin_ads':     ('linkedin',            'invert(38%) sepia(80%) saturate(700%) hue-rotate(190deg)'),
}

def make_img_tag(icon_file, filt):
    src = f"https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/{icon_file}.svg"
    style = f"filter:{filt}; object-fit:contain;"
    onerror = "this.style.display='none';this.parentNode.innerHTML='⚙️'"
    return f'<img src="{src}" width="20" height="20" style="{style}" onerror="{onerror}"/>'

with open('automations.html', 'r', encoding='utf-8') as f:
    content = f.read()

replaced = 0
not_found = []

# Pattern: inside a JS object/block that has id:'<integration_id>', find the next clearbit img tag
# We process each integration id in the map
for integ_id, (icon_file, filt) in ICON_MAP.items():
    # Find all occurrences of this id in the file and replace the clearbit img after it
    # The id appears as: id:'google_sheets' or id: 'google_sheets'
    id_pattern = re.compile(
        r"(id\s*:\s*['\"]" + re.escape(integ_id) + r"['\"].*?)"
        r'(<img\s[^>]*logo\.clearbit\.com[^>]*/?>)',
        re.DOTALL
    )
    new_img = make_img_tag(icon_file, filt)
    new_content, count = id_pattern.subn(lambda m: m.group(1) + new_img, content)
    if count > 0:
        content = new_content
        replaced += count
        print(f"  OK {integ_id}: {count} replaced")
    else:
        not_found.append(integ_id)

# Also do a blanket replacement for any remaining clearbit img tags
remaining = len(re.findall(r'logo\.clearbit\.com', content))

with open('automations.html', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\nToplam degistirilen: {replaced}")
print(f"Kalan clearbit referanslari: {remaining}")
if not_found:
    print(f"Bulunamayan idler: {not_found}")
