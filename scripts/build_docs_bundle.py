#!/usr/bin/env python3
"""
build_docs_bundle.py

Clean build script that packages all Markdown files and course materials 
into js/docs_content.js for offline serverless operation in any browser.
Supports both Windows-style (\\) and POSIX-style (/) paths in window.DOCS_CONTENT.
"""

import os
import json
import glob

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, '..'))
OUTPUT_FILE = os.path.join(PROJECT_ROOT, 'js', 'docs_content.js')

def build_bundle():
    print(f"[Build] Scanning project directory: {PROJECT_ROOT}")
    bundle = {}
    file_count = 0
    total_bytes = 0

    # Collect all .md files
    for root, dirs, files in os.walk(PROJECT_ROOT):
        # Exclude hidden folders like .git and IDE directories
        dirs[:] = [d for d in dirs if not d.startswith('.') and d != 'node_modules']
        
        for file in files:
            if file.endswith('.md') or (file.endswith('.txt') and 'Practisches_WerkBuch' in root):
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, PROJECT_ROOT)
                
                # Create normalized path variants
                posix_path = rel_path.replace('\\', '/')
                win_path = rel_path.replace('/', '\\')
                
                try:
                    with open(full_path, 'r', encoding='utf-8', errors='replace') as f:
                        content = f.read()
                    
                    bundle[posix_path] = content
                    bundle[win_path] = content
                    file_count += 1
                    total_bytes += len(content.encode('utf-8'))
                except Exception as e:
                    print(f"  [Warning] Could not read {rel_path}: {e}")

    # Generate js/docs_content.js
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    json_str = json.dumps(bundle, ensure_ascii=False)
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write("// Auto-generated bundle of all learning materials for serverless offline usage\n")
        f.write("window.DOCS_CONTENT = ")
        f.write(json_str)
        f.write(";\n")
        
    out_size_mb = os.path.getsize(OUTPUT_FILE) / (1024 * 1024)
    print(f"[Build] Successfully bundled {file_count} documents ({total_bytes / 1024:.1f} KB raw text).")
    print(f"[Build] Output generated: {OUTPUT_FILE} ({out_size_mb:.2f} MB)")
    return file_count

if __name__ == '__main__':
    build_bundle()
