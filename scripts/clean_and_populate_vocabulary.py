#!/usr/bin/env python3
"""
clean_and_populate_vocabulary.py

Replaces the mechanical 3,000-word dictionary dumps with authentic, CEFR-graded
vocabulary from scripts/words_final.json across all CEFR levels (A1 to C2).

Updates:
1. Level master Vocabulary files:
   - A1/Vocabulary.md
   - A2/Vocabulary.md
   - B1/Vocabulary.md
   - B2/Vocabulary.md
   - C1/Vocabulary.md
   - C2/Vocabulary.md

2. Categorical files (strictly preserving the grammar explanation above the list):
   - A1/Verbs.md, A1/Nouns.md, A1/Adjectives.md
   - A2/Verbs.md, A2/Adjectives.md
   - B1/Verbs.md, B1/Adjectives.md
   - B2/Verbs.md, B2/Nouns.md, B2/Adjectives.md
   - C1/Verbs.md, C1/Adjectives.md
"""

import os
import re
import json
import urllib.parse

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, '..'))
WORDS_FILE = os.path.join(SCRIPT_DIR, 'words_final.json')

STOP_WORDS = {
    'ab', 'an', 'auf', 'aus', 'außer', 'bei', 'bis', 'durch', 'für', 'gegen', 'hinter', 'in', 'mit', 'nach', 'neben',
    'ohne', 'über', 'unter', 'von', 'vor', 'zu', 'zwischen', 'um', 'seit', 'trotz', 'während', 'wegen', 'entlang',
    'gegenüber', 'statt', 'anstatt',
    'aber', 'denn', 'und', 'sondern', 'oder', 'da', 'weil', 'obwohl', 'dass', 'daß', 'wenn', 'als', 'ob', 'damit',
    'sodass', 'bevor', 'nachdem',
    'wer', 'was', 'wo', 'wann', 'wie', 'warum', 'wohin', 'woher', 'welcher', 'welche', 'welches', 'wen', 'wem', 'wessen',
    'ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'mich', 'dich', 'ihn', 'uns', 'euch', 'mir', 'dir', 'ihm', 'ihnen',
    'mein', 'dein', 'sein', 'unser', 'euer', 'kein', 'keine', 'keiner', 'keines', 'jemand', 'niemand', 'etwas', 'nichts',
    'man', 'einander', 'selbst', 'selber', 'ihre', 'ihrer', 'ihren', 'ihrem', 'seine', 'seiner', 'seinen', 'seinem',
    'meine', 'meiner', 'meinen', 'meinem', 'deine', 'deiner', 'deinen', 'deinem', 'unsere', 'unserer', 'unseren',
    'unserem', 'eure', 'eurer', 'euren', 'eurem',
    'null', 'eins', 'ein', 'eine', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf',
    'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn', 'zwanzig', 'dreißig',
    'vierzig', 'fünfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig', 'hundert', 'tausend', 'erste', 'zweite', 'dritte'
}

LEVEL_DESCRIPTIONS = {
    'A1': ('A1 (Beginner / Anfänger)',
           'Foundational vocabulary for everyday situations, basic greetings, asking directions, shopping, and introducing oneself.'),
    'A2': ('A2 (Elementary / Grundlegende Kenntnisse)',
           'Practical vocabulary for routine conversations, family, hobbies, appointments, travel, and personal experiences.'),
    'B1': ('B1 (Intermediate / Mittelstufe)',
           'Independent communication vocabulary for work, travel, emotions, opinions, news, and complex daily interactions.'),
    'B2': ('B2 (Upper Intermediate / Gute Mittelstufe)',
           'Advanced professional, academic, and argumentative vocabulary for nuanced discussions, abstract topics, and formal writing.'),
    'C1': ('C1 (Advanced / Fortgeschritten)',
           'Sophisticated academic, literary, and professional vocabulary for flexible, precise, and complex expression.'),
    'C2': ('C2 (Mastery / Exzellente Kenntnisse)',
           'Mastery-level idioms, stylistic nuances, proverbs, and rare/formal expressions reflecting near-native eloquence.')
}

LEVEL_NAV_LINKS = {
    'A1': '[A1 Grammatik](./Grammatik.md) | [Verbs](./Verbs.md) | [Nouns](./Nouns.md) | [Adjectives](./Adjectives.md) | [Cases](./Cases.md) | [Prepositions](./Prepositions.md) | [Pronouns](./Pronouns.md)',
    'A2': '[A2 Grammatik](./Grammatik.md) | [Verbs](./Verbs.md) | [Adjectives](./Adjectives.md) | [Cases](./Cases.md) | [Prepositions](./Prepositions.md) | [Pronouns](./Pronouns.md)',
    'B1': '[B1 Grammatik](./Grammatik.md) | [Verbs](./Verbs.md) | [Adjectives](./Adjectives.md) | [Cases](./Cases.md) | [Prepositions](./Prepositions.md) | [Pronouns](./Pronouns.md)',
    'B2': '[B2 Grammatik](./Grammatik.md) | [Verbs](./Verbs.md) | [Nouns](./Nouns.md) | [Adjectives](./Adjectives.md)',
    'C1': '[C1 Grammatik](./Grammatik.md) | [Verbs](./Verbs.md) | [Adjectives](./Adjectives.md)',
    'C2': '[C2 Grammatik](./Grammatik.md) | [Style Guide](./Style.md)'
}

import unicodedata

def clean_query_word(de):
    """Extracts a clean search term suitable for dictionary query parameters."""
    de = unicodedata.normalize('NFC', de)
    base = re.sub(r'\(.*?\)', '', de).strip(' ;,.-')
    if base.lower() in ('der', 'die', 'das'):
        return base.lower()
    clean = re.sub(r'^(der/die|der/das|die/der|der|die|das|die \(Pl\.\))\s+', '', de).strip()
    clean = re.sub(r',\s*-[^\s,]+.*$', '', clean).strip()
    clean = re.sub(r',\s*-\s*$', '', clean).strip()
    clean = re.sub(r'\(.*?\)', '', clean).strip()
    clean = clean.strip(' ;,.-')
    if not clean:
        clean = re.sub(r'\(.*?\)', '', de).strip(' ;,.-')
    return clean if clean else de.strip()

def escape_cell(text):
    """Escapes pipes and cleans text for Markdown tables."""
    if not text:
        return ''
    cleaned = str(text).replace('|', r'\|').replace('\n', ' ').strip()
    return cleaned

def build_dict_links(clean_word, is_verb):
    """Generates standard dictionary links."""
    quoted = urllib.parse.quote(clean_word)
    leo = f"[LEO](https://dict.leo.org/german-english/{quoted})"
    pons = f"[PONS](https://de.pons.com/%C3%BCbersetzung/deutsch-englisch/{quoted})"
    linguee = f"[Linguee](https://www.linguee.de/deutsch-englisch/search?source=auto&query={quoted})"
    if is_verb:
        verbform = f"[Conjugate](https://www.verbformen.com/conjugation/?w={quoted})"
    else:
        verbform = f"[Verbformen](https://www.verbformen.com/?w={quoted})"
    return f"{leo} \\| {pons} \\| {linguee} \\| {verbform}"

def is_noun(w):
    art = w.get('article', '').strip()
    de = w['de'].strip()
    return art in ['m.', 'f.', 'n.', 'pl.', 'm./f.', 'die', 'm./n.', 'der'] or de.startswith(('der ', 'die ', 'das ', 'die (Pl.)', 'der/die ', 'der/das ', 'die/der '))

def is_verb(w):
    if is_noun(w):
        return False
    en = w.get('en', '').lower().strip()
    de = w['de'].strip()
    return en.startswith('to ') or en.startswith('(to) ') or (de.endswith(('en', 'eln', 'ern')) and ' ' not in de and de[0].islower())

def is_adjective(w):
    if is_noun(w) or is_verb(w):
        return False
    de = w['de'].strip()
    lower_de = de.lower()
    if lower_de in STOP_WORDS or any(p in de for p in ['.', '!', '?', ':']):
        return False
    cat = w.get('category', '')
    adj_suffixes = ('ig', 'lich', 'bar', 'haft', 'sam', 'los', 'isch', 'arm', 'reich', 'voll', 'wert', 'fähig', 'gemäß', 'iv', 'ell', 'ant', 'ent')
    if cat == 'Eigenschaften' or any(lower_de.endswith(s) for s in adj_suffixes) or (de[0].islower() and ' ' not in de):
        return True
    return False

def format_gender(w):
    art = w.get('article', '').strip()
    de = w['de'].strip()
    if art == 'm.' or de.startswith('der '):
        return 'Masculine (der)'
    elif art == 'f.' or de.startswith('die '):
        return 'Feminine (die)'
    elif art == 'n.' or de.startswith('das '):
        return 'Neuter (das)'
    elif art == 'pl.' or de.startswith('die (Pl.)'):
        return 'Plural (die)'
    elif art == 'm./f.' or de.startswith(('der/die ', 'die/der ')):
        return 'Masc. / Fem.'
    elif art == 'm./n.' or de.startswith('der/das '):
        return 'Masc. / Neut.'
    return 'Noun'

def format_verb_conjugation(w):
    conj = w.get('conjugation')
    if not conj:
        return '-'
    info = []
    praes_stamm = conj.get('praesens_stamm')
    praet = conj.get('praeteritum_stamm')
    p2 = conj.get('partizip2')
    hilfs = conj.get('hilfsverb', 'haben')
    prefix = conj.get('trennbares_praefix')
    
    if praes_stamm:
        info.append(f"er/sie {praes_stamm}t")
    if praet:
        if prefix and prefix != 'none' and not praet.endswith(prefix):
            info.append(f"er/sie {praet} ... {prefix}")
        else:
            info.append(f"er/sie {praet}")
    if p2:
        aux = f"*{hilfs}*" if hilfs else ''
        info.append(f"{aux} {p2}".strip())
    return ' \\| '.join(info) if info else '-'

def sort_key(w):
    de = w['de'].lower()
    de = re.sub(r'^(der|die|das|die \(pl\.\))\s+', '', de)
    return de.replace('ä', 'a').replace('ö', 'o').replace('ü', 'u').replace('ß', 'ss')

def generate_vocabulary_md(level, words):
    title, desc = LEVEL_DESCRIPTIONS[level]
    nav = LEVEL_NAV_LINKS.get(level, '')
    
    lines = [
        f"# {level} Vocabulary List (Wortschatz)\n",
        f"A curated collection of authentic, level-appropriate German vocabulary for the **{title}** level according to the CEFR standards. Each entry includes the word with grammatical markers, English definition, topic category, a contextual example sentence with English translation, and direct reference links.\n",
        f"{nav}\n",
        "---\n",
        "| German Word | English Translation | Topic Category | Example Sentence | Dictionary & Conjugation Links |",
        "| :--- | :--- | :--- | :--- | :--- |"
    ]
    
    sorted_words = sorted(words, key=sort_key)
    for w in sorted_words:
        de = escape_cell(w['de'])
        en = escape_cell(w.get('en', ''))
        cat = escape_cell(w.get('category', 'Allgemein'))
        
        ex = w.get('example', '').strip()
        ex_en = w.get('example_en', '').strip()
        if ex and ex_en:
            example_str = f"{escape_cell(ex)} *({escape_cell(ex_en)})*"
        elif ex:
            example_str = escape_cell(ex)
        else:
            example_str = "-"
            
        verb_flag = is_verb(w)
        clean = clean_query_word(w['de'])
        links = build_dict_links(clean, verb_flag)
        
        lines.append(f"| **{de}** | {en} | {cat} | {example_str} | {links} |")
        
    return '\n'.join(lines) + '\n'

def update_verbs_md(filepath, level, words):
    if not os.path.exists(filepath):
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    m = re.search(r'^(## (?:Vocabulary List|Core Vocabulary|Wortschatz).*)', content, re.MULTILINE | re.IGNORECASE)
    if m:
        preamble = content[:m.start()].rstrip()
    else:
        preamble = content.rstrip()
        
    level_verbs = [w for w in words if is_verb(w)]
    sorted_verbs = sorted(level_verbs, key=sort_key)
    
    new_section = [
        "## Vocabulary List (Wortschatz)\n",
        "> [!TIP]",
        "> Below are authentic, level-appropriate German verbs for this proficiency level. Use the links to view full conjugation paradigms, tenses, and usage examples.\n",
        "| Verb (Infinitive) | English Translation | Principal Parts (Präsens / Präteritum / Perfekt) | Example Sentence | Dictionary & Conjugation Links |",
        "| :--- | :--- | :--- | :--- | :--- |"
    ]
    
    for w in sorted_verbs:
        de = escape_cell(w['de'])
        en = escape_cell(w.get('en', ''))
        conj_str = format_verb_conjugation(w)
        
        ex = w.get('example', '').strip()
        ex_en = w.get('example_en', '').strip()
        if ex and ex_en:
            example_str = f"{escape_cell(ex)} *({escape_cell(ex_en)})*"
        elif ex:
            example_str = escape_cell(ex)
        else:
            example_str = "-"
            
        clean = clean_query_word(w['de'])
        links = build_dict_links(clean, is_verb=True)
        new_section.append(f"| **{de}** | {en} | {conj_str} | {example_str} | {links} |")
        
    full_content = preamble + "\n\n" + '\n'.join(new_section) + "\n"
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(full_content)
    print(f"Updated {filepath} with {len(sorted_verbs)} verbs.")

def update_nouns_md(filepath, level, words):
    if not os.path.exists(filepath):
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    m = re.search(r'^(## (?:Vocabulary List|Core Vocabulary|Wortschatz).*)', content, re.MULTILINE | re.IGNORECASE)
    if m:
        preamble = content[:m.start()].rstrip()
    else:
        preamble = content.rstrip()
        
    level_nouns = [w for w in words if is_noun(w)]
    sorted_nouns = sorted(level_nouns, key=sort_key)
    
    new_section = [
        "## Vocabulary List (Wortschatz)\n",
        "> [!TIP]",
        "> Below are authentic, level-appropriate German nouns for this proficiency level, complete with gender articles and plural forms.\n",
        "| Noun (with Article & Plural) | Gender | English Translation | Example Sentence | Dictionary & Reference Links |",
        "| :--- | :--- | :--- | :--- | :--- |"
    ]
    
    for w in sorted_nouns:
        de = escape_cell(w['de'])
        en = escape_cell(w.get('en', ''))
        gender = format_gender(w)
        
        ex = w.get('example', '').strip()
        ex_en = w.get('example_en', '').strip()
        if ex and ex_en:
            example_str = f"{escape_cell(ex)} *({escape_cell(ex_en)})*"
        elif ex:
            example_str = escape_cell(ex)
        else:
            example_str = "-"
            
        clean = clean_query_word(w['de'])
        links = build_dict_links(clean, is_verb=False)
        new_section.append(f"| **{de}** | {gender} | {en} | {example_str} | {links} |")
        
    full_content = preamble + "\n\n" + '\n'.join(new_section) + "\n"
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(full_content)
    print(f"Updated {filepath} with {len(sorted_nouns)} nouns.")

def update_adjectives_md(filepath, level, words):
    if not os.path.exists(filepath):
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    m = re.search(r'^(## (?:Vocabulary List|Core Vocabulary|Wortschatz).*)', content, re.MULTILINE | re.IGNORECASE)
    if m:
        preamble = content[:m.start()].rstrip()
    else:
        preamble = content.rstrip()
        
    level_adjs = [w for w in words if is_adjective(w)]
    sorted_adjs = sorted(level_adjs, key=sort_key)
    
    new_section = [
        "## Vocabulary List (Wortschatz)\n",
        "> [!TIP]",
        "> Below are authentic, level-appropriate German adjectives and descriptive terms for this proficiency level.\n",
        "| Adjective / Descriptor | English Translation | Topic Category | Example Sentence | Dictionary & Reference Links |",
        "| :--- | :--- | :--- | :--- | :--- |"
    ]
    
    for w in sorted_adjs:
        de = escape_cell(w['de'])
        en = escape_cell(w.get('en', ''))
        cat = escape_cell(w.get('category', 'Eigenschaften'))
        
        ex = w.get('example', '').strip()
        ex_en = w.get('example_en', '').strip()
        if ex and ex_en:
            example_str = f"{escape_cell(ex)} *({escape_cell(ex_en)})*"
        elif ex:
            example_str = escape_cell(ex)
        else:
            example_str = "-"
            
        clean = clean_query_word(w['de'])
        links = build_dict_links(clean, is_verb=False)
        new_section.append(f"| **{de}** | {en} | {cat} | {example_str} | {links} |")
        
    full_content = preamble + "\n\n" + '\n'.join(new_section) + "\n"
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(full_content)
    print(f"Updated {filepath} with {len(sorted_adjs)} adjectives.")

def main():
    print(f"Loading words from {WORDS_FILE}...")
    with open(WORDS_FILE, 'r', encoding='utf-8') as f:
        words_data = json.load(f)
        
    words_by_level = {lvl: [] for lvl in ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']}
    for w in words_data:
        lvl = w.get('level')
        if lvl in words_by_level:
            words_by_level[lvl].append(w)
            
    print("Dataset distribution:")
    for lvl, lst in words_by_level.items():
        print(f"  {lvl}: {len(lst)} words")
        
    for lvl in ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']:
        words = words_by_level[lvl]
        
        # 1. Write Vocabulary.md
        vocab_path = os.path.join(PROJECT_ROOT, lvl, 'Vocabulary.md')
        vocab_content = generate_vocabulary_md(lvl, words)
        with open(vocab_path, 'w', encoding='utf-8') as f:
            f.write(vocab_content)
        print(f"Wrote {vocab_path} ({len(words)} entries).")
        
        # 2. Update Verbs.md
        verbs_path = os.path.join(PROJECT_ROOT, lvl, 'Verbs.md')
        update_verbs_md(verbs_path, lvl, words)
        
        # 3. Update Nouns.md
        nouns_path = os.path.join(PROJECT_ROOT, lvl, 'Nouns.md')
        update_nouns_md(nouns_path, lvl, words)
        
        # 4. Update Adjectives.md
        adjs_path = os.path.join(PROJECT_ROOT, lvl, 'Adjectives.md')
        update_adjectives_md(adjs_path, lvl, words)

    print("\nAll vocabulary and categorical files successfully cleaned and populated!")

if __name__ == '__main__':
    main()
