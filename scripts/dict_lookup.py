#!/usr/bin/env python3
import sys
import urllib.request
import urllib.parse
import re
import os

# Terminal colors
BLUE = "\033[94m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
BOLD = "\033[1m"
UNDERLINE = "\033[4m"
ENDC = "\033[0m"

def print_banner():
    banner = f"""
{BLUE}{BOLD}=================================================
       DEUTSCH LERNEN - DICTIONARY LOOKUP
================================================={ENDC}
"""
    print(banner)

def get_word_links(word):
    encoded_word = urllib.parse.quote(word)
    links = {
        "LEO": f"https://dict.leo.org/german-english/{encoded_word}",
        "PONS": f"https://de.pons.com/%C3%BCbersetzung/deutsch-englisch/{encoded_word}",
        "Linguee": f"https://www.linguee.de/deutsch-englisch/search?source=auto&query={encoded_word}",
        "Verbformen": f"https://www.verbformen.com/?w={encoded_word}"
    }
    return links

def guess_part_of_speech(word):
    word_lower = word.lower()
    if word_lower.startswith(("der ", "die ", "das ")):
        return "Noun"
    elif word.endswith(("en", "eln", "ern")) and word[0].islower():
        return "Verb"
    elif word[0].isupper():
        return "Noun (or capitalized word)"
    else:
        return "Adjective/Adverb/Preposition"

def fetch_verbformen_data(word):
    """
    Scrapes Verbformen.com to extract conjugation or declension summaries using standard library regex.
    """
    encoded_word = urllib.parse.quote(word)
    url = f"https://www.verbformen.com/?w={encoded_word}"
    
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    req = urllib.request.Request(url, headers=headers)
    
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            html = response.read().decode('utf-8')
            
        # Extract main definition sentence/tagline
        meaning_match = re.search(r'Meaning of.*?<b>(.*?)</b>', html, re.DOTALL | re.IGNORECASE)
        if meaning_match:
            raw_meaning = meaning_match.group(1).strip()
            # Strip HTML tags
            clean_meaning = re.sub(r'<[^>]+>', '', raw_meaning)
            # Replace multiple spaces/newlines
            clean_meaning = re.sub(r'\s+', ' ', clean_meaning).strip()
            # Clean up trailing punctuation or leading bullet points
            clean_meaning = clean_meaning.strip("·• ")
            if clean_meaning.lower() == word.lower():
                meanings = None
            else:
                meanings = clean_meaning
        else:
            meanings = None
        
        # Look for verb forms (Präsens, Präteritum, Perfekt)
        # Verbformen shows them in bullet points or a short grid
        verb_forms = []
        # Find forms like "er/sie/es macht", "machte", "hat gemacht"
        forms_match = re.findall(r'<span class="v3Pr.*?>([^<]+)</span>', html)
        if forms_match:
            verb_forms = [f.strip() for f in forms_match[:4]]
            
        return meanings, verb_forms
    except Exception as e:
        # Gracefully handle connection timeouts or changes in structure
        return None, []

def add_to_vocabulary(word, translation, pos, level, links):
    level = level.upper()
    valid_levels = ["A1", "A2", "B1", "B2", "C1", "C2"]
    if level not in valid_levels:
        print(f"{RED}Error: Invalid level '{level}'. Must be one of {valid_levels}{ENDC}")
        return False
        
    vocab_path = f"{level}/Vocabulary.md"
    if not os.path.exists(vocab_path):
        print(f"{RED}Error: File {vocab_path} does not exist.{ENDC}")
        return False
        
    # Format the link references
    leo_link = f"[LEO]({links['LEO']})"
    pons_link = f"[PONS]({links['PONS']})"
    linguee_link = f"[Linguee]({links['Linguee']})"
    
    if pos == "Verb":
        conj_link = f"[Conjugate](https://www.verbformen.com/conjugation/?w={urllib.parse.quote(word)})"
        link_str = f"{leo_link} \\| {pons_link} \\| {linguee_link} \\| {conj_link}"
    else:
        verbformen_link = f"[Verbformen]({links['Verbformen']})"
        link_str = f"{leo_link} \\| {pons_link} \\| {linguee_link} \\| {verbformen_link}"
        
    new_entry = f"| **{word}** | {translation} | {pos} | {link_str} |\n"
    
    try:
        with open(vocab_path, "a", encoding="utf-8") as f:
            f.write(new_entry)
        print(f"{GREEN}Successfully added '{word}' to {vocab_path}!{ENDC}")
        return True
    except Exception as e:
        print(f"{RED}Failed to write to file: {e}{ENDC}")
        return False

def main():
    print_banner()
    
    args = sys.argv[1:]
    if not args:
        print(f"Usage: python scripts/dict_lookup.py <word> [--add <level>]")
        print(f"Example: python scripts/dict_lookup.py machen")
        print(f"Example: python scripts/dict_lookup.py machen --add A1")
        sys.exit(0)
        
    # Parse args
    word_parts = []
    level_to_add = None
    
    i = 0
    while i < len(args):
        if args[i] == "--add" and i + 1 < len(args):
            level_to_add = args[i+1]
            i += 2
        else:
            word_parts.append(args[i])
            i += 1
            
    word = " ".join(word_parts).strip()
    if not word:
        print(f"{RED}Error: No word specified.{ENDC}")
        sys.exit(1)
        
    links = get_word_links(word)
    guessed_pos = guess_part_of_speech(word)
    
    print(f"{BOLD}Word:{ENDC} {YELLOW}{word}{ENDC}")
    print(f"{BOLD}Guessed Category:{ENDC} {guessed_pos}")
    print("\n" + "-"*40)
    print(f"{BOLD}Direct Dictionary Search Links:{ENDC}")
    for name, url in links.items():
        print(f"  * {BOLD}{name}:{ENDC} {BLUE}{UNDERLINE}{url}{ENDC}")
    print("-"*40 + "\n")
    
    print(f"Fetching data from Verbformen.com...")
    meanings, verb_forms = fetch_verbformen_data(word)
    
    translation = ""
    if meanings:
        translation = meanings
        print(f"{BOLD}Approximate Translation / Meaning:{ENDC} {GREEN}{meanings}{ENDC}")
    else:
        print(f"{YELLOW}Could not fetch translation directly (visit the links above for full dictionaries).{ENDC}")
        
    if verb_forms:
        print(f"{BOLD}Key Grammatical Forms:{ENDC} {', '.join(verb_forms)}")
        
    if level_to_add:
        if not translation:
            # Prompt user or use default placeholder if translation couldn't be fetched
            translation = input(f"Enter English translation for '{word}' to save: ").strip()
            if not translation:
                translation = "Translation pending"
        add_to_vocabulary(word, translation, guessed_pos, level_to_add, links)

if __name__ == "__main__":
    main()
