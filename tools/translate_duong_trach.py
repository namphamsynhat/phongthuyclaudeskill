#!/usr/bin/env python3
"""
Manage translation of Duong Trach Thap Thu (02-duong-trach-thap-thu).
"""
import sys, os, json
sys.path.append('tools')
from duong_trach import items, load

SLUG = '02-duong-trach-thap-thu'
VI_FILE = f'tools/duong-trach-vi/{SLUG}.vi.tsv'

def get_chapters():
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
    return chapters

def stats():
    chaps = get_chapters()
    total_p = 0
    total_tr = 0
    print(f"{'#':<3} {'Chapter':<28} {'Total':<7} {'Translated':<12} {'Remaining':<10}")
    print("-" * 65)
    for idx, (h, p_list) in enumerate(chaps):
        tot = len(p_list)
        tr = sum(1 for i, t, done in p_list if done)
        rem = tot - tr
        total_p += tot
        total_tr += tr
        print(f"{idx+1:<3} {h:<28} {tot:<7} {tr:<12} {rem:<10}")
    print("-" * 65)
    print(f"Total paragraphs: {total_p}, Translated: {total_tr}, Remaining: {total_p - total_tr}")

if __name__ == '__main__':
    stats()
