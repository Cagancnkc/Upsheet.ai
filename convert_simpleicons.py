import re

with open('automations.html', 'r', encoding='utf-8') as f:
    content = f.read()

before = len(re.findall(r'cdn\.simpleicons\.org', content))

# https://cdn.simpleicons.org/{name}/{color} -> https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/{name}.svg
content, count = re.subn(
    r'https://cdn\.simpleicons\.org/([^/\s"\']+)/[^/\s"\']+',
    r'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/\1.svg',
    content
)

after = len(re.findall(r'cdn\.simpleicons\.org', content))

with open('automations.html', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Degistirilen: {count}")
print(f"Oncesi: {before}, Sonrasi: {after}")
