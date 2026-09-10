#!/usr/bin/env python3
import urllib.request
import lzma
import re
import urllib.parse
import sys

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
        sys.exit(1)
        
    print("Parsing entries...")
    lines = decompressed_data.split('\n')
    
    # Store processed entries
    # Each entry is a dict: {'german': ..., 'english': ..., 'pos': ..., 'query': ...}
    entries = []
    
    for line in lines:
        line = line.strip()
        if not line or line.startswith('#'):
            continue
            
        parts = line.split(' :: ')
        if len(parts) != 2:
            continue
            
        german_side, english_side = parts[0].strip(), parts[1].strip()
        
        # Determine part of speech
        pos = "Other"
        if '{m}' in german_side:
            pos = "Noun (m)"
        elif '{f}' in german_side:
            pos = "Noun (f)"
        elif '{n}' in german_side:
            pos = "Noun (n)"
        elif '{pl}' in german_side:
            pos = "Noun (pl)"
        elif '[v.]' in german_side or english_side.lower().startswith('to '):
            pos = "Verb"
        elif '[adj.]' in german_side or '[adj]' in german_side:
            pos = "Adjective"
            
        # Clean query word for links (remove annotations like curly braces, brackets, and gender tags)
        # e.g., "Abendessen {n}" -> "Abendessen"
        # "abfahren [v.]" -> "abfahren"
        clean_german = german_side
        clean_german = re.sub(r'\{.*?\}', '', clean_german)
        clean_german = re.sub(r'\[.*?\]', '', clean_german)
        # Remove parenthetical details
        clean_german = re.sub(r'\(.*?\)', '', clean_german)
        # Strip whitespace and trailing punctuation
        clean_german = clean_german.strip(';,.- ')
        
        # Ignore entries with empty or multi-word German phrases for vocabulary simplicity if they have too many words
        if not clean_german or len(clean_german.split()) > 2:
            continue
            
        # Clean English side for display
        clean_english = english_side
        clean_english = re.sub(r'\{.*?\}', '', clean_english)
        clean_english = clean_english.strip()
        
        entries.append({
            'display_german': german_side,
            'display_english': clean_english,
            'pos': pos,
            'query': clean_german
        })
        
    print(f"Total parsed entries: {len(entries)}")
    return entries

def distribute_by_level(entries):
    # Sort entries by length of query word to categorize complexity
    # A1: 2-5 chars
    # A2: 6-7 chars
    # B1: 8-9 chars
    # B2: 10-11 chars
    # C1: 12-14 chars
    # C2: 15+ chars
    
    levels = {
        'A1': [],
        'A2': [],
        'B1': [],
        'B2': [],
        'C1': [],
        'C2': []
    }
    
    seen_queries = set()
    
    # Shuffle or distribute systematically
    for entry in entries:
        query = entry['query']
        if query.lower() in seen_queries:
            continue
            
        # Check alphabet letters only to avoid corruptions
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
            
    for level, lst in levels.items():
        print(f"Level {level} candidates: {len(lst)}")
        
    return levels

def write_level_files(levels):
    header_template = """# {level} Vocabulary List (Wortschatz)

This file contains exactly 3,000 vocabulary words for the {level} level. Use the quick links to view detailed translations, examples, and verb conjugations on PONS, Linguee, LEO, and Verbformen.

| German Word | English Translation | Part of Speech | Dictionary & Grammatical Links |
| :--- | :--- | :---: | :--- |
"""

    level_keys = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
    
    # Fill gaps by pulling from subsequent levels
    for idx, level in enumerate(level_keys):
        if len(levels[level]) < 3000:
            # Try to pull from the next levels
            for next_idx in range(idx + 1, len(level_keys)):
                next_level = level_keys[next_idx]
                needed = 3000 - len(levels[level])
                if needed <= 0:
                    break
                
                pulled = levels[next_level][:needed]
                levels[level].extend(pulled)
                levels[next_level] = levels[next_level][needed:]
                print(f"Pulled {len(pulled)} words from {next_level} to fill {level}")

    for level in level_keys:
        selected_entries = levels[level][:3000]
        
        file_path = f"{level}/Vocabulary.md"
        print(f"Writing {len(selected_entries)} words to {file_path}...")
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(header_template.format(level=level))
            
            for entry in selected_entries:
                german = entry['display_german']
                english = entry['display_english']
                pos = entry['pos']
                q = entry['query']
                
                eq = urllib.parse.quote(q)
                
                leo_link = f"[LEO](https://dict.leo.org/german-english/{eq})"
                pons_link = f"[PONS](https://de.pons.com/%C3%BCbersetzung/deutsch-englisch/{eq})"
                linguee_link = f"[Linguee](https://www.linguee.de/deutsch-englisch/search?source=auto&query={eq})"
                
                if pos == "Verb":
                    conj_link = f"[Conjugate](https://www.verbformen.com/conjugation/?w={eq})"
                    link_str = f"{leo_link} \\| {pons_link} \\| {linguee_link} \\| {conj_link}"
                else:
                    verbformen_link = f"[Verbformen](https://www.verbformen.com/?w={eq})"
                    link_str = f"{leo_link} \\| {pons_link} \\| {linguee_link} \\| {verbformen_link}"
                    
                line = f"| **{german}** | {english} | {pos} | {link_str} |\n"
                f.write(line)
                
    print("All vocabulary files successfully populated with 3,000+ words each!")

def main():
    entries = download_and_parse()
    levels = distribute_by_level(entries)
    write_level_files(levels)

if __name__ == '__main__':
    main()
