#!/usr/bin/env python3
"""
build_pronunciations.py

Builds a comprehensive pronunciation dictionary (IPA + Audio) for all German vocabulary words
in scripts/words_final.json using:
1. de.wiktionary.org batch API (extracting standard Hochdeutsch IPA and Wikimedia Commons audio).
2. Case-normalization & fallback queries (capitalization variations).
3. Multi-word phrase decomposition into constituent word IPAs.
4. Comprehensive German phonological G2P (Grapheme-to-Phoneme) rule engine for compound/remaining words.
"""

import os
import re
import json
import time
import urllib.request
import urllib.parse

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
WORDS_FILE = os.path.join(SCRIPT_DIR, 'words_final.json')
PRON_FILE = os.path.join(SCRIPT_DIR, 'pronunciations.json')

def clean_lemma(w_str):
    """Extract the base lexical item for dictionary/IPA lookup."""
    w = re.sub(r'\(.*?\)', '', w_str).strip()
    w = re.sub(r',.*', '', w).strip()
    w = re.sub(r'/.*', '', w).strip()
    w = re.sub(r'^(der|die|das)\s+', '', w, flags=re.IGNORECASE).strip()
    w = re.sub(r'^(sich)\s+', '', w, flags=re.IGNORECASE).strip()
    w = re.sub(r'^[–—\-]\s*', '', w).strip()
    w = re.sub(r'\s*\.\.\.$', '', w).strip()
    w = w.strip('.,!?"\'')
    if not w:
        w = re.sub(r'\(.*?\)', '', w_str).strip()
    return w.strip()

def g2p_german(word):
    """
    Standard German Grapheme-to-Phoneme (G2P) rule engine adhering to
    Duden / Siebs standard pronunciation (Hochdeutsch).
    """
    orig = word.strip()
    w = orig.lower()
    
    # Handle digits
    num_map = {
        '0': 'null', '1': 'eins', '2': 'zwei', '3': 'drei', '4': 'vier',
        '5': 'fünf', '6': 'sechs', '7': 'sieben', '8': 'acht', '9': 'neun'
    }
    for digit, name in num_map.items():
        w = w.replace(digit, name)
    
    # Common prefixes with stress behavior
    # Inseparable prefixes (unstressed): be-, ge-, emp-, ent-, er-, ver-, zer-, miss-
    # Separable prefixes (stressed): ab-, an-, auf-, aus-, bei-, ein-, mit-, nach-, vor-, zu-
    prefix_stress = ""
    rest = w
    
    sep_prefixes = ['ab', 'an', 'auf', 'aus', 'bei', 'ein', 'mit', 'nach', 'vor', 'weg', 'zu']
    insep_prefixes = ['be', 'ge', 'emp', 'ent', 'er', 'ver', 'zer', 'miss']
    
    # Check prefixes if length > 5
    for p in sep_prefixes:
        if w.startswith(p) and len(w) > len(p) + 2:
            prefix_stress = "sep"
            break
            
    for p in insep_prefixes:
        if w.startswith(p) and len(w) > len(p) + 2:
            prefix_stress = "insep"
            break
            
    # Step-by-step phonological replacements
    # 1. Multi-letter clusters
    s = w
    s = s.replace('tsch', 't͡ʃ')
    s = s.replace('dsch', 'd͡ʒ')
    s = s.replace('sch', 'ʃ')
    
    # sp- and st- at beginning of word or after prefix
    s = re.sub(r'(^|[-\s])sp', r'\1ʃp', s)
    s = re.sub(r'(^|[-\s])st', r'\1ʃt', s)
    
    # ck -> k, tz -> ts
    s = s.replace('ck', 'k')
    s = s.replace('tz', 't͡s')
    s = s.replace('z', 't͡s')
    s = s.replace('qu', 'kv')
    s = s.replace('ph', 'f')
    s = s.replace('th', 't')
    
    # ng and nk
    s = s.replace('ng', 'ŋ')
    s = s.replace('nk', 'ŋk')
    
    # Diphthongs
    s = s.replace('ei', 'aɪ̯')
    s = s.replace('ey', 'aɪ̯')
    s = s.replace('ai', 'aɪ̯')
    s = s.replace('ay', 'aɪ̯')
    s = s.replace('eu', 'ɔɪ̯')
    s = s.replace('äu', 'ɔɪ̯')
    s = s.replace('au', 'aʊ̯')
    s = s.replace('ie', 'iː')
    
    # Ich-Laut vs Ach-Laut (ch)
    # ch after a, o, u, au -> x, otherwise -> ç
    s = re.sub(r'([aou]|aʊ̯)ch', r'\1x', s)
    s = s.replace('ch', 'ç')
    
    # Long vowels (double vowels or followed by h)
    s = s.replace('aa', 'aː').replace('ah', 'aː')
    s = s.replace('ee', 'eː').replace('eh', 'eː')
    s = s.replace('oo', 'oː').replace('oh', 'oː')
    s = s.replace('uh', 'uː')
    s = s.replace('öh', 'øː')
    s = s.replace('üh', 'yː')
    s = s.replace('äh', 'ɛː')
    
    # Unstressed suffixes: -er -> ɐ, -en -> n̩, -el -> l̩, -e -> ə
    s = re.sub(r'er($|[-\s])', r'ɐ\1', s)
    s = re.sub(r'en($|[-\s])', r'n̩\1', s)
    s = re.sub(r'el($|[-\s])', r'l̩\1', s)
    s = re.sub(r'e($|[-\s])', r'ə\1', s)
    
    # Standard vowels
    s = s.replace('ä', 'ɛ')
    s = s.replace('ö', 'øː')
    s = s.replace('ü', 'yː')
    s = s.replace('ß', 's')
    
    # Intervocalic / initial s -> z
    s = re.sub(r'(^|[-\s])s(?=[aeiouyɛø])', r'\1z', s)
    s = re.sub(r'(?<=[aeiouyɛø])s(?=[aeiouyɛø])', 'z', s)
    
    # r vocalization / consonant
    s = s.replace('r', 'ʁ')
    
    # Auslautverhärtung (final b, d, g -> p, t, k)
    s = re.sub(r'b($|[-\s])', r'p\1', s)
    s = re.sub(r'd($|[-\s])', r't\1', s)
    s = re.sub(r'g($|[-\s])', r'k\1', s)
    
    # -ig at end -> ɪç
    s = re.sub(r'ik($|[-\s])', r'ɪç\1', s)
    s = re.sub(r'ig($|[-\s])', r'ɪç\1', s)
    
    # Stress assignment
    if prefix_stress == "insep":
        # Stress on second syllable
        # find first vowel after prefix
        ipa = re.sub(r'^(bə|ɡə|ʔɛnt|ʔɛmp|ʔɛɐ̯|fɛɐ̯|t͡sɛɐ̯)', r'\1ˈ', s)
        if 'ˈ' not in ipa:
            ipa = 'ˈ' + s
    else:
        ipa = 'ˈ' + s
        
    return ipa

def fetch_wiktionary_batch(lemmas):
    """Fetches IPA and audio for a list of lemmas (up to 50) from de.wiktionary.org."""
    titles = '|'.join(lemmas)
    url = f'https://de.wiktionary.org/w/api.php?action=query&titles={urllib.parse.quote(titles)}&prop=revisions&rvprop=content&format=json'
    req = urllib.request.Request(url, headers={'User-Agent': 'DeutscheLernenBot/1.0 (contact: yathi@example.com)'})
    
    results = {}
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.load(r)
        pages = data.get('query', {}).get('pages', {})
        for pid, pdata in pages.items():
            if pid == '-1':
                continue
            title = pdata.get('title')
            rev = pdata.get('revisions', [{}])[0].get('*', '')
            
            # Extract standard IPA
            m = re.search(r'\{\{Lautschrift\|([^}]+)\}\}', rev)
            audio_m = re.search(r'\{\{Audio\|([^}|]+)', rev)
            
            ipa = m.group(1).strip() if m else None
            audio = audio_m.group(1).strip() if audio_m else None
            
            if ipa:
                # Clean up any inner wiki markup
                ipa = re.sub(r'\[\[|\]\]', '', ipa).strip()
                results[title] = {'ipa': ipa, 'audio': audio}
    except Exception as e:
        print(f"Batch query error: {e}")
        
    return results

def build_all_pronunciations():
    print(f"Loading words from {WORDS_FILE}...")
    with open(WORDS_FILE, 'r', encoding='utf-8') as f:
        words_data = json.load(f)
        
    # Check if existing pronunciations file exists
    existing = {}
    if os.path.exists(PRON_FILE):
        try:
            with open(PRON_FILE, 'r', encoding='utf-8') as f:
                existing = json.load(f)
            print(f"Loaded {len(existing)} existing pronunciations from {PRON_FILE}.")
        except Exception:
            existing = {}
            
    # Extract unique lemmas to query
    lemma_to_orig = {}
    for w in words_data:
        de_str = w['de']
        l = clean_lemma(de_str)
        if l:
            if l not in lemma_to_orig:
                lemma_to_orig[l] = []
            lemma_to_orig[l].append(de_str)
            
    print(f"Total unique lemmas to process: {len(lemma_to_orig)}")
    
    # Filter lemmas needing lookup
    needed = [l for l in lemma_to_orig if l not in existing or not existing[l].get('ipa')]
    print(f"Lemmas needing Wiktionary lookup: {len(needed)}")
    
    # Query in batches of 50
    batch_size = 50
    batches = [needed[i:i + batch_size] for i in range(0, len(needed), batch_size)]
    
    for idx, batch in enumerate(batches, 1):
        batch_results = fetch_wiktionary_batch(batch)
        for lemma, res in batch_results.items():
            existing[lemma] = res
            # Also lowercase / capitalized variant
            if lemma.lower() not in existing:
                existing[lemma.lower()] = res
            if lemma.capitalize() not in existing:
                existing[lemma.capitalize()] = res
                
        if idx % 10 == 0 or idx == len(batches):
            print(f"Processed batch {idx}/{len(batches)} (Resolved total: {len(existing)})")
            # Intermediate save
            with open(PRON_FILE, 'w', encoding='utf-8') as f:
                json.dump(existing, f, ensure_ascii=False, indent=2)
                
        time.sleep(0.05) # Polite delay
        
    # Second pass: retry un-matched single words by toggling capitalization
    still_needed = [l for l in lemma_to_orig if l not in existing or not existing[l].get('ipa')]
    print(f"Remaining unmatched lemmas: {len(still_needed)}. Trying alternate capitalization...")
    
    alt_map = {}
    for l in still_needed:
        if ' ' not in l:
            alt = l.lower() if l[0].isupper() else l.capitalize()
            alt_map[alt] = l
            
    alt_batches = [list(alt_map.keys())[i:i + batch_size] for i in range(0, len(alt_map), batch_size)]
    for batch in alt_batches:
        alt_results = fetch_wiktionary_batch(batch)
        for alt_title, res in alt_results.items():
            orig_lemma = alt_map.get(alt_title)
            if orig_lemma:
                existing[orig_lemma] = res
                
    # Third pass: resolve multi-word expressions by parts or rule-based G2P
    unmatched_count = 0
    g2p_count = 0
    for l in lemma_to_orig:
        if l not in existing or not existing[l].get('ipa'):
            # Multi-word phrase?
            if ' ' in l:
                words = l.split()
                part_ipas = []
                for pw in words:
                    cleaned_pw = pw.strip('.,!?"\'')
                    if cleaned_pw in existing and existing[cleaned_pw].get('ipa'):
                        part_ipas.append(existing[cleaned_pw]['ipa'])
                    elif cleaned_pw.capitalize() in existing and existing[cleaned_pw.capitalize()].get('ipa'):
                        part_ipas.append(existing[cleaned_pw.capitalize()]['ipa'])
                    elif cleaned_pw.lower() in existing and existing[cleaned_pw.lower()].get('ipa'):
                        part_ipas.append(existing[cleaned_pw.lower()]['ipa'])
                    else:
                        part_ipas.append(g2p_german(cleaned_pw))
                combined_ipa = ' '.join(part_ipas)
                existing[l] = {'ipa': combined_ipa, 'audio': None}
                g2p_count += 1
            else:
                # Single word fallback via German G2P engine
                rule_ipa = g2p_german(l)
                existing[l] = {'ipa': rule_ipa, 'audio': None}
                g2p_count += 1
                
    print(f"Total resolved entries: {len(existing)} (G2P generated: {g2p_count})")
    
    with open(PRON_FILE, 'w', encoding='utf-8') as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)
    print(f"Successfully saved all pronunciations to {PRON_FILE}!")

if __name__ == '__main__':
    build_all_pronunciations()
