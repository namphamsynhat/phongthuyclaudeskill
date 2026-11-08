#!/usr/bin/env python3
"""
Dump untranslated paragraphs of Duong Trach Thap Thu into chapter batch JSON files.
"""
import sys, os, json
sys.path.append('tools')
from duong_trach import items, load

SLUG = '02-duong-trach-thap-thu'
BATCH_DIR = 'tools/translation_batches'
os.makedirs(BATCH_DIR, exist_ok=True)

its = items(SLUG)
vi = load(SLUG)

chapters = []
curr_h = "Intro"
curr_items = []
for k, i, t in its:
    if k == 'h':
        if curr_items:
            chapters.append((curr_h, curr_items))
        curr_h = t
        curr_items = []
    elif k == 'p':
        curr_items.append((i, t, i in vi))
if curr_items:
    chapters.append((curr_h, curr_items))

print(f"Total chapters: {len(chapters)}")
for idx, (h, p_list) in enumerate(chapters):
    untr = [{"id": i, "text": t} for i, t, done in p_list if not done]
    batch_file = os.path.join(BATCH_DIR, f"chapter_{idx+1:02d}.json")
    with open(batch_file, "w", encoding="utf-8") as f:
        json.dump({"chapter_index": idx + 1, "title": h, "count": len(untr), "items": untr}, f, ensure_ascii=False, indent=2)
    print(f"Chapter {idx+1}: {h} -> {len(untr)} items written to {batch_file}")
