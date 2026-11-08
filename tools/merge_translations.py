#!/usr/bin/env python3
"""
Merge translated chapter TSVs from tools/translation_batches/ into tools/duong-trach-vi/02-duong-trach-thap-thu.vi.tsv
and build references/vi/duong-trach/*.md.
"""
import os, glob, sys

TSV_TARGET = 'tools/duong-trach-vi/02-duong-trach-thap-thu.vi.tsv'
BATCH_DIR = 'tools/translation_batches'

def main():
    existing = {}
    if os.path.exists(TSV_TARGET):
        for line in open(TSV_TARGET, 'r', encoding='utf-8'):
            if '\t' in line:
                pid, trans = line.rstrip('\n').split('\t', 1)
                existing[pid] = trans

    added = 0
    tsv_files = sorted(glob.glob(os.path.join(BATCH_DIR, "chapter_*_vi.tsv")))
    for tf in tsv_files:
        for line in open(tf, 'r', encoding='utf-8'):
            if '\t' in line:
                pid, trans = line.rstrip('\n').split('\t', 1)
                trans = trans.strip()
                if trans and (pid not in existing or existing[pid] != trans):
                    existing[pid] = trans
                    added += 1

    # Also check json files if any had inline translations
    json_files = sorted(glob.glob(os.path.join(BATCH_DIR, "chapter_*_vi.json")))
    for jf in json_files:
        import json
        with open(jf, 'r', encoding='utf-8') as f:
            data = json.load(f)
            for item in data.get('items', []):
                pid = item.get('id')
                trans = item.get('vi', '').strip()
                if pid and trans:
                    if pid not in existing or existing[pid] != trans:
                        existing[pid] = trans
                        added += 1

    with open(TSV_TARGET, 'w', encoding='utf-8') as f:
        for pid, trans in existing.items():
            f.write(f"{pid}\t{trans}\n")

    print(f"Merged translations. Total entries in TSV: {len(existing)} (newly added/updated: {added})")

    # Run build
    os.system('python3 tools/duong_trach.py build')

if __name__ == '__main__':
    main()
