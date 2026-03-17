#!/usr/bin/env python
"""
Build script: stitches HTML partials into tools.html
Run manually: python tools/build.py
Run automatically: git pre-commit hook
"""

import os

ROOT   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PARTS  = os.path.join(ROOT, 'tools', 'partials')
OUTPUT = os.path.join(ROOT, 'tools.html')

# Order matters — tools appear in this sequence on the page
TOOLS = [
    'pomodoro',
    'json', 'base64', 'url', 'yaml',
    'jwt', 'hash', 'password',
    'uuid', 'timestamp', 'numbase', 'color',
    'caseconv', 'strutils', 'markdown',
    'regex', 'diff', 'cron',
]

def read(path):
    with open(path, encoding='utf-8') as f:
        return f.read()

def build():
    parts = [read(os.path.join(PARTS, '_shell_top.html'))]

    for tool in TOOLS:
        path = os.path.join(PARTS, f'{tool}.html')
        if not os.path.exists(path):
            print(f'  WARNING: missing partial for "{tool}" — skipping')
            continue
        parts.append(read(path))

    parts.append(read(os.path.join(PARTS, '_shell_bottom.html')))

    output = '\n'.join(parts)

    with open(OUTPUT, 'w', encoding='utf-8') as f:
        f.write(output)

    print(f'Built tools.html ({len(output):,} bytes, {len(TOOLS)} tools)')

if __name__ == '__main__':
    build()
