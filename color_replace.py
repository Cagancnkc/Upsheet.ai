import sys
with open(sys.argv[1], 'r', encoding='utf-8') as f:
    content = f.read()
replacements = [
    ('#5448E8', '#16a34a'), ('#5B3CFF', '#16a34a'), ('#5b3cff', '#16a34a'),
    ('#6366f1', '#16a34a'), ('#4F46E5', '#16a34a'), ('#4338CA', '#15803d'),
    ('#7C3AED', '#15803d'), ('#7c3aed', '#15803d'), ('#3A22B8', '#15803d'),
    ('#3a22b8', '#15803d'), ('#5B21B6', '#166534'), ('#5b21b6', '#166534'),
    ('#6B35CF', '#16a34a'), ('#3D1F7A', '#166534'), ('#2B80FF', '#15803d'),
    ('#667eea', '#16a34a'), ('#764ba2', '#15803d'), ('#a78bfa', '#86efac'),
    ('#818CF8', '#86efac'), ('#818cf8', '#86efac'), ('#a5b4fc', '#86efac'),
    ('#c4b5fd', '#bbf7d0'), ('#C4B5FD', '#bbf7d0'), ('#f5f3ff', '#f0fdf4'),
    ('#ECE4FF', '#dcfce7'), ('#EDE9FE', '#dcfce7'), ('#EFEAFF', '#dcfce7'),
    ('#C8B8FF', '#bbf7d0'), ('#DBEAFE', '#dcfce7'), ('#F5F3FF', '#f0fdf4'),
    ('rgba(79,70,229,0.1)', 'rgba(22,163,74,0.1)'), ('rgba(79,70,229,0.2)', 'rgba(22,163,74,0.2)'),
    ('rgba(124,92,255,0.1)', 'rgba(22,163,74,0.1)'), ('rgba(124,58,237,.15)', 'rgba(22,163,74,.15)'),
    ('rgba(124,58,237,.3)', 'rgba(22,163,74,.3)'),
]
for old, new in replacements:
    content = content.replace(old, new)
with open(sys.argv[1], 'w', encoding='utf-8') as f:
    f.write(content)
print('done:', sys.argv[1])
