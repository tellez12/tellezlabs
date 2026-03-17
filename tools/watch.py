#!/usr/bin/env python
"""
Watch tools/ for changes and rebuild tools.html automatically.
Run: python tools/watch.py
"""

import os, sys, time, subprocess

WATCH_DIR = os.path.dirname(os.path.abspath(__file__))

def get_mtimes():
    mtimes = {}
    for root, _, files in os.walk(WATCH_DIR):
        for f in files:
            if f.endswith(('.html', '.js', '.py')) and f != 'watch.py':
                path = os.path.join(root, f)
                mtimes[path] = os.path.getmtime(path)
    return mtimes

def build():
    result = subprocess.run(
        [sys.executable, os.path.join(WATCH_DIR, 'build.py')],
        capture_output=True, text=True
    )
    if result.returncode == 0:
        print(f'  ✓ {result.stdout.strip()}')
    else:
        print(f'  ✗ Build failed: {result.stderr.strip()}')

print('Watching tools/ for changes... (Ctrl+C to stop)')
build()
prev = get_mtimes()

try:
    while True:
        time.sleep(0.5)
        curr = get_mtimes()
        changed = [f for f in curr if curr[f] != prev.get(f)]
        if changed:
            for f in changed:
                print(f'  Changed: {os.path.relpath(f, WATCH_DIR)}')
            build()
            prev = curr
except KeyboardInterrupt:
    print('\nStopped.')
