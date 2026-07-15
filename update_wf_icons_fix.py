import re

# Only the entries that were missed because script found wrong array occurrence
ICON_MAP_FIX = {
    'slack':     ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/slack.svg', '#4A154B', '#F4EDE4'),
    'gmail':     ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/gmail.svg', '#EA4335', '#FEE8E6'),
    'hubspot':   ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/hubspot.svg', '#FF7A59', '#FFF0EC'),
    'mailchimp': ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/mailchimp.svg', '#FFE01B', '#FFFDE6'),
    'notion':    ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/notion.svg', '#000000', '#F5F5F5'),
    'airtable':  ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/airtable.svg', '#18BFFF', '#E6F9FF'),
    'trello':    ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/trello.svg', '#0052CC', '#E6EEFF'),
    'asana':     ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/asana.svg', '#F06A6A', '#FEF0F0'),
    'monday':    ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/mondaydotcom.svg', '#FF3D57', '#FFE8EB'),
    'jira':      ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/jira.svg', '#0052CC', '#E6EEFF'),
    'linear':    ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/linear.svg', '#5E6AD2', '#EEEFFE'),
    'clickup':   ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/clickup.svg', '#7B68EE', '#F2F0FE'),
    'telegram':  ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/telegram.svg', '#26A5E4', '#E8F5FD'),
    'discord':   ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/discord.svg', '#5865F2', '#EEEFFE'),
    'github':    ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg', '#181717', '#F0F0F0'),
    'brevo':     ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/brevo.svg', '#0B996E', '#E6F5F1'),
    'twilio':    ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/twilio.svg', '#F22F46', '#FEEBEE'),
    'sendgrid':  ('https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/sendgrid.svg', '#1A82E2', '#E7F1FD'),
}

with open('automations.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find WF_INTEGRATIONS boundaries
wf_start = content.find('const WF_INTEGRATIONS = [')
end_match = re.search(r'\];', content[wf_start:])
wf_end = wf_start + end_match.end()
print(f'WF_INTEGRATIONS: {wf_start} to {wf_end}')

replacements = []
not_found = []

for integ_id, (url, color, bg) in ICON_MAP_FIX.items():
    # Search ONLY within WF_INTEGRATIONS section
    wf_section = content[wf_start:wf_end]
    id_match = re.search(r"id\s*:\s*'" + re.escape(integ_id) + r"'", wf_section)
    if not id_match:
        not_found.append(f'{integ_id} (id not found in WF)')
        continue

    # From id position in wf_section, find the next icon: line
    search_start_rel = id_match.start()
    search_area = wf_section[search_start_rel:search_start_rel + 600]

    icon_match = re.search(r'\n(\s*)icon\s*:[^\n]*\n', search_area)
    if not icon_match:
        not_found.append(f'{integ_id} (no icon line in 600 chars)')
        continue

    # Compute absolute positions
    abs_start = wf_start + search_start_rel + icon_match.start()
    abs_end   = wf_start + search_start_rel + icon_match.end()
    indent    = icon_match.group(1)

    new_lines = (
        f"\n{indent}iconUrl:'{url}',\n"
        f"{indent}iconColor:'{color}',\n"
        f"{indent}iconBg:'{bg}',\n"
    )

    replacements.append((abs_start, abs_end, new_lines))
    print(f'OK: {integ_id}')

# Apply in reverse order
replacements.sort(key=lambda x: x[0], reverse=True)
for start, end, new_text in replacements:
    content = content[:start] + new_text + content[end:]

print(f'\nReplaced: {len(replacements)}')
if not_found:
    print(f'Not found: {not_found}')

with open('automations.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done.')
