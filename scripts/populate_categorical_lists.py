#!/usr/bin/env python3
import urllib.request
import lzma
import re
import urllib.parse
import os

def download_and_parse():
    url = 'https://raw.githubusercontent.com/SavSanta/ding-de/master/de-en.txt.2026-04-01.xz'
    print("Downloading German-English dictionary dataset (approx. 9MB)...")
    headers = {'User-Agent': 'Mozilla/5.0'}
    req = urllib.request.Request(url, headers=headers)
    
    try:
        with urllib.request.urlopen(req) as response:
            compressed_data = response.read()
        print("Decompressing dataset...")
        decompressed_data = lzma.decompress(compressed_data).decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error downloading or decompressing: {e}")
        return None
        
    print("Parsing entries...")
    lines = decompressed_data.split('\n')
    
    # Categories
    nouns = []
    verbs = []
    adjectives = []
    
    for line in lines:
        line = line.strip()
        if not line or line.startswith('#'):
            continue
            
        parts = line.split(' :: ')
        if len(parts) != 2:
            continue
            
        german_side, english_side = parts[0].strip(), parts[1].strip()
        
        # Extract the main German entry before any pipeline details
        german_main = german_side.split('|')[0].strip()
        
        # Part of speech tagging
        pos = None
        if any(tag in german_side for tag in ['{m}', '{f}', '{n}', '{pl}']):
            pos = "Noun"
        elif '[v.]' in german_side or '{vi}' in german_side or '{vt}' in german_side or '{vr}' in german_side or english_side.lower().startswith('to '):
            pos = "Verb"
        elif '{adj}' in german_side:
            pos = "Adjective"
            
        if not pos:
            continue
            
        # Clean query word
        clean_german = german_main
        clean_german = re.sub(r'\{.*?\}', '', clean_german)
        clean_german = re.sub(r'\[.*?\]', '', clean_german)
        clean_german = re.sub(r'\(.*?\)', '', clean_german)
        clean_german = clean_german.strip(';,.- ')
        
        if not clean_german or len(clean_german.split()) > 2:
            continue
            
        clean_english = english_side
        clean_english = re.sub(r'\{.*?\}', '', clean_english)
        clean_english = clean_english.strip()
        
        entry = {
            'display_german': german_side,
            'display_english': clean_english,
            'pos': pos,
            'query': clean_german
        }
        
        if pos == "Noun":
            nouns.append(entry)
        elif pos == "Verb":
            verbs.append(entry)
        elif pos == "Adjective":
            adjectives.append(entry)
            
    print(f"Total parsed Nouns: {len(nouns)}")
    print(f"Total parsed Verbs: {len(verbs)}")
    print(f"Total parsed Adjectives: {len(adjectives)}")
    
    return nouns, verbs, adjectives

def distribute_by_level(entries):
    levels = {
        'A1': [], 'A2': [], 'B1': [], 'B2': [], 'C1': [], 'C2': []
    }
    seen_queries = set()
    
    for entry in entries:
        query = entry['query']
        if query.lower() in seen_queries:
            continue
        if not re.match(r'^[a-zA-ZäöüÄÖÜß\s\-]+$', query):
            continue
            
        seen_queries.add(query.lower())
        length = len(query)
        
        if 2 <= length <= 5:
            levels['A1'].append(entry)
        elif 6 <= length <= 7:
            levels['A2'].append(entry)
        elif 8 <= length <= 9:
            levels['B1'].append(entry)
        elif 10 <= length <= 11:
            levels['B2'].append(entry)
        elif 12 <= length <= 14:
            levels['C1'].append(entry)
        elif length >= 15:
            levels['C2'].append(entry)
            
    return levels

def get_entries_for_level(level, category_levels, total_needed=3000):
    level_keys = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
    current_idx = level_keys.index(level)
    
    selected = []
    seen = set()
    
    # 1. Add current level candidates
    for entry in category_levels[level]:
        q = entry['query'].lower()
        if q not in seen:
            seen.add(q)
            selected.append(entry)
            
    # 2. Add from other levels in order of index proximity
    other_levels = sorted(level_keys, key=lambda k: abs(level_keys.index(k) - current_idx))
    for ol in other_levels:
        if len(selected) >= total_needed:
            break
        for entry in category_levels[ol]:
            q = entry['query'].lower()
            if q not in seen:
                seen.add(q)
                selected.append(entry)
                if len(selected) >= total_needed:
                    break
                    
    return selected[:total_needed]

def clean_file_from_table(file_path):
    if not os.path.exists(file_path):
        return ""
        
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    split_pos = re.search(r'## (Vocabulary List|Core Vocabulary|Wortschatz)', content, re.IGNORECASE)
    if split_pos:
        return content[:split_pos.start()].strip()
    return content.strip()

def append_table(file_path, intro, level, category, entries):
    header = f"""

## Vocabulary List (Wortschatz)

> [!TIP]
> Use the links to lookup definitions, examples, and conjugations on LEO, PONS, Linguee, and Verbformen.

| German Word | English Translation | Part of Speech | Dictionary & Grammatical Links |
| :--- | :--- | :---: | :--- |
"""
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(intro + header)
        for entry in entries:
            german = entry['display_german']
            english = entry['display_english']
            pos = entry['pos']
            q = entry['query']
            
            eq = urllib.parse.quote(q)
            leo_link = f"[LEO](https://dict.leo.org/german-english/{eq})"
            pons_link = f"[PONS](https://de.pons.com/%C3%BCbersetzung/deutsch-englisch/{eq})"
            linguee_link = f"[Linguee](https://www.linguee.de/deutsch-englisch/search?source=auto&query={eq})"
            
            if category == "Verbs":
                conj_link = f"[Conjugate](https://www.verbformen.com/conjugation/?w={eq})"
                link_str = f"{leo_link} \\| {pons_link} \\| {linguee_link} \\| {conj_link}"
            else:
                verbformen_link = f"[Verbformen](https://www.verbformen.com/?w={eq})"
                link_str = f"{leo_link} \\| {pons_link} \\| {linguee_link} \\| {verbformen_link}"
                
            f.write(f"| **{german}** | {english} | {pos} | {link_str} |\n")

def append_closed_class(file_path, intro, category):
    note = f"""

## Vocabulary List (Wortschatz)

> [!NOTE]
> {category} are a closed grammatical class in the German language (there are only ~50 pronouns and ~100 prepositions in the entire language). Below is a complete list of all of them for reference.
"""
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(intro + note)

def main():
    res = download_and_parse()
    if not res:
        return
    nouns, verbs, adjectives = res
    
    noun_levels = distribute_by_level(nouns)
    verb_levels = distribute_by_level(verbs)
    adj_levels = distribute_by_level(adjectives)
    
    targets = [
        # A1
        ('A1/Nouns.md', 'A1', 'Nouns', noun_levels),
        ('A1/Verbs.md', 'A1', 'Verbs', verb_levels),
        ('A1/Adjectives.md', 'A1', 'Adjectives', adj_levels),
        # A2
        ('A2/Verbs.md', 'A2', 'Verbs', verb_levels),
        ('A2/Adjectives.md', 'A2', 'Adjectives', adj_levels),
        # B1
        ('B1/Verbs.md', 'B1', 'Verbs', verb_levels),
        ('B1/Adjectives.md', 'B1', 'Adjectives', adj_levels),
        # B2
        ('B2/Nouns.md', 'B2', 'Nouns', noun_levels),
        ('B2/Verbs.md', 'B2', 'Verbs', verb_levels),
        ('B2/Adjectives.md', 'B2', 'Adjectives', adj_levels),
        # C1
        ('C1/Verbs.md', 'C1', 'Verbs', verb_levels),
        ('C1/Adjectives.md', 'C1', 'Adjectives', adj_levels),
    ]
    
    for path, level, category, level_dict in targets:
        if os.path.exists(path):
            data = get_entries_for_level(level, level_dict, 3000)
            print(f"Populating {path} with {len(data)} words...")
            intro = clean_file_from_table(path)
            append_table(path, intro, level, category, data)
            
    # Closed classes
    closed_classes = [
        ('A1/Pronouns.md', 'Pronouns'),
        ('A1/Prepositions.md', 'Prepositions'),
        ('A2/Pronouns.md', 'Pronouns'),
        ('A2/Prepositions.md', 'Prepositions'),
        ('B1/Pronouns.md', 'Pronouns'),
        ('B1/Prepositions.md', 'Prepositions'),
    ]
    for path, category in closed_classes:
        if os.path.exists(path):
            print(f"Finalizing closed class file {path}...")
            intro = clean_file_from_table(path)
            append_closed_class(path, intro, category)
            
    print("Done populating all categorical files!")

if __name__ == '__main__':
    main()
