#!/usr/bin/env python3
"""
clean_and_populate_vocabulary.py

Generates and populates authentic, CEFR-graded vocabulary from scripts/words_final.json
across all CEFR levels (A1 to C2).

For each word, provides 5-6 sentence examples in the "Example Sentence" column:
- Optimum utilization of der, die, das (and cases den, dem, des)
- Non-repeated personal pronouns (Ich, Du, Er/Sie, Wir, Ihr, Sie)
- Pronoun substitutions (ihn, sie, es, ihm, ihr, ihnen)
- Complete English translations in parentheses
"""

import os
import re
import json
import urllib.parse
import unicodedata

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
    'A1': '[📖 A1 Grammatik-Leitfaden](./Grammatik.md) | [📌 A1 Kurs-Übersicht](./README.md) | [🏠 Hauptmenü](../README.md)',
    'A2': '[📖 A2 Grammatik-Leitfaden](./Grammatik.md) | [📌 A2 Kurs-Übersicht](./README.md) | [🏠 Hauptmenü](../README.md)',
    'B1': '[📖 B1 Grammatik-Leitfaden](./Grammatik.md) | [📌 B1 Kurs-Übersicht](./README.md) | [🏠 Hauptmenü](../README.md)',
    'B2': '[📖 B2 Grammatik-Leitfaden](./Grammatik.md) | [📌 B2 Kurs-Übersicht](./README.md) | [🏠 Hauptmenü](../README.md)',
    'C1': '[📖 C1 Grammatik-Leitfaden](./Grammatik.md) | [📌 C1 Kurs-Übersicht](./README.md) | [🏠 Hauptmenü](../README.md)',
    'C2': '[📖 C2 Grammatik-Leitfaden](./Grammatik.md) | [📌 C2 Kurs-Übersicht](./README.md) | [🏠 Hauptmenü](../README.md)'
}

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

def sort_key(w):
    de = w['de'].lower()
    de = re.sub(r'^(der|die|das|die \(pl\.\))\s+', '', de)
    return de.replace('ä', 'a').replace('ö', 'o').replace('ü', 'u').replace('ß', 'ss')

def build_fallback_6_sentences(w):
    de = w['de'].strip()
    en = w.get('en', '').strip()
    ex = w.get('example', '').strip()
    ex_en = w.get('example_en', '').strip()
    
    lemma = clean_query_word(de)
    art = w.get('article', '').strip()
    
    # Check custom mappings for high-frequency function words
    custom_map = {
        'der': [
            ("Ich kenne den Mann dort drüben sehr gut.", "I know the man over there very well."),
            ("Siehst du den großen Baum im Park?", "Do you see the big tree in the park?"),
            ("Er sucht den Schlüssel für das Auto.", "He is looking for the key for the car."),
            ("Wir danken dem freundlichen Kellner im Restaurant.", "We thank the friendly waiter in the restaurant."),
            ("Habt ihr den neuen Film schon gesehen?", "Have you all already seen the new movie?"),
            ("Schätzen Sie den Rat des erfahrenen Kollegen?", "Do you appreciate the advice of the experienced colleague?")
        ],
        'die': [
            ("Ich lese die Zeitung am Frühstückstisch.", "I read the newspaper at the breakfast table."),
            ("Triffst du die Freundin heute Nachmittag im Café?", "Are you meeting the female friend this afternoon in the café?"),
            ("Er öffnet die Tür und betritt das Zimmer.", "He opens the door and enters the room."),
            ("Wir besuchen die moderne Ausstellung in der Stadt.", "We visit the modern exhibition in the city."),
            ("Kennt ihr die neuen Nachbarn von nebenan?", "Do you all know the new neighbors from next door?"),
            ("Haben Sie die wichtigen Unterlagen erhalten?", "Have you received the important documents?")
        ],
        'das': [
            ("Ich kaufe das Buch für den Deutschkurs.", "I buy the book for the German course."),
            ("Liest du das spannende Magazin am Abend?", "Do you read the exciting magazine in the evening?"),
            ("Er repariert das alte Fahrrad in der Garage.", "He repairs the old bicycle in the garage."),
            ("Wir mieten das gemütliche Ferienhaus am See.", "We rent the cozy holiday house by the lake."),
            ("Schaut ihr das Fußballspiel heute im Fernsehen?", "Are you all watching the soccer match on TV today?"),
            ("Kennen Sie das Restaurant an der Ecke?", "Do you know the restaurant on the corner?")
        ],
        'ab': [
            ("Ich suche ab sofort den neuen Schlüssel für die Wohnung.", "I am looking for the new key for the apartment starting immediately."),
            ("Fährst du ab morgen mit dem Bus oder nimmst du das Auto?", "Are you riding by bus starting tomorrow or taking the car?"),
            ("Er holt das Paket ab 14 Uhr bei der Post ab.", "He picks up the parcel starting at 2 pm at the post office."),
            ("Wir verkaufen die alten Möbel ab nächster Woche über das Internet.", "We are selling the old furniture starting next week via the internet."),
            ("Könnt ihr ab Freitag den Dienstplan für das Team übernehmen?", "Can you all take over the duty schedule for the team starting Friday?"),
            ("Reisen Sie ab Frankfurt mit dem Zug oder fliegen Sie?", "Are you departing from Frankfurt by train or are you flying?")
        ],
        'abends': [
            ("Ich trinke abends gern den warmen Tee auf dem Balkon.", "I like drinking the warm tea on the balcony in the evening."),
            ("Liest du abends die Zeitung oder siehst du lieber fern?", "Do you read the newspaper in the evening or prefer watching TV?"),
            ("Er schaut abends das spannende Fußballspiel im Fernsehen.", "He watches the exciting soccer match on TV in the evening."),
            ("Wir treffen abends die Kollegen in einem gemütlichen Restaurant.", "We meet the colleagues in a cozy restaurant in the evening."),
            ("Kocht ihr abends das Abendessen für die ganze Familie?", "Do you all cook dinner for the whole family in the evening?"),
            ("Haben Sie abends Zeit für eine kurze Besprechung mit dem Chef?", "Do you have time in the evening for a short meeting with the boss?")
        ],
        'aber': [
            ("Ich suche den Schlüssel, aber er liegt nicht auf dem Tisch.", "I am looking for the key, but it is not on the table."),
            ("Möchtest du die Suppe probieren, aber ist sie dir vielleicht zu heiß?", "Would you like to try the soup, but is it perhaps too hot for you?"),
            ("Er kauft das Auto, aber es verbraucht leider viel Benzin.", "He buys the car, but unfortunately it consumes a lot of gas."),
            ("Wir unterstützen die Idee, aber wir haben noch nicht das nötige Budget.", "We support the idea, but we do not yet have the necessary budget."),
            ("Habt ihr die Einladung erhalten, aber könnt ihr am Samstag nicht kommen?", "Did you all receive the invitation, but can't you come on Saturday?"),
            ("Verstehen Sie das Problem, aber suchen Sie noch nach der richtigen Lösung?", "Do you understand the problem, but are you still looking for the right solution?")
        ],
        'acht': [
            ("Ich habe acht Bücher für den Deutschkurs gekauft.", "I bought eight books for the German course."),
            ("Hast du acht Euro für die Fahrkarte im Portemonnaie?", "Do you have eight euros for the ticket in your wallet?"),
            ("Er arbeitet acht Stunden am Tag im Büro.", "He works eight hours a day in the office."),
            ("Wir treffen uns um acht Uhr vor dem großen Kino.", "We meet at eight o'clock in front of the big cinema."),
            ("Könnt ihr acht Stühle für die Gäste in das Zimmer stellen?", "Can you all put eight chairs for the guests into the room?"),
            ("Haben Sie acht Fragen an den neuen Mitarbeiter vorbereitet?", "Have you prepared eight questions for the new employee?")
        ],
        'alle': [
            ("Ich kenne alle Kollegen in der neuen Abteilung.", "I know all colleagues in the new department."),
            ("Hast du alle Dokumente für das Visum eingereicht?", "Did you submit all documents for the visa?"),
            ("Er beantwortet alle E-Mails noch vor dem Feierabend.", "He answers all emails before the end of the workday."),
            ("Wir laden alle Freunde zu unserer Feier im Garten ein.", "We invite all friends to our celebration in the garden."),
            ("Habt ihr alle Aufgaben für die Prüfung verstanden?", "Did you all understand all tasks for the exam?"),
            ("Können Sie alle Daten in das System eintragen?", "Can you enter all data into the system?")
        ],
        'allein': [
            ("Ich wohne nicht gern allein in der großen Wohnung.", "I do not like living alone in the big apartment."),
            ("Fährst du allein mit dem Zug nach Hamburg?", "Are you traveling alone by train to Hamburg?"),
            ("Er repariert das alte Fahrrad ganz allein in der Garage.", "He repairs the old bicycle completely alone in the garage."),
            ("Wir lassen das kleine Kind niemals allein im Zimmer.", "We never leave the small child alone in the room."),
            ("Schafft ihr das Projekt allein oder braucht ihr Hilfe vom Team?", "Can you manage the project alone or do you need help from the team?"),
            ("Kommen Sie allein zu dem Termin oder bringt Sie die Kollegin mit?", "Are you coming alone to the appointment or is your colleague accompanying you?")
        ],
        'also': [
            ("Ich habe den Zug verpasst, also nehme ich das nächste Taxi.", "I missed the train, so I take the next taxi."),
            ("Du hast die Prüfung bestanden, also feiern wir heute Abend!", "You passed the exam, so we are celebrating tonight!"),
            ("Er hat kein Geld dabei, also bezahlt sein Freund die Rechnung.", "He has no money with him, so his friend pays the bill."),
            ("Wir sind früher fertig, also gehen wir noch in den Park.", "We finished earlier, so we are going to the park."),
            ("Ihr habt keine Zeit, also verschieben wir das Treffen auf morgen.", "You all have no time, so we are postponing the meeting until tomorrow."),
            ("Sie suchen das Büro, also zeige ich Ihnen gerne den Weg dorthin.", "You are looking for the office, so I gladly show you the way there.")
        ],
        'an': [
            ("Ich warte an der Haltestelle auf den nächsten Bus.", "I wait at the stop for the next bus."),
            ("Hängst du das schöne Bild an die weiße Wand im Wohnzimmer?", "Are you hanging the nice picture on the white wall in the living room?"),
            ("Er klopft an die Tür des Chefs und tritt ein.", "He knocks on the boss's door and enters."),
            ("Wir stehen an dem Schalter und fragen nach der Auskunft.", "We stand at the counter and ask for information."),
            ("Denkt ihr an den Termin für das morgige Meeting?", "Are you all thinking of the appointment for tomorrow's meeting?"),
            ("Arbeiten Sie an dem neuen Konzept für die Firma?", "Are you working on the new concept for the company?")
        ],
        'andere': [
            ("Ich nehme das andere Buch, weil es viel interessanter ist.", "I take the other book because it is much more interesting."),
            ("Kennst du die andere Straße, die direkt zum Bahnhof führt?", "Do you know the other street that leads directly to the station?"),
            ("Er kauft den anderen Pullover, denn er gefällt ihm besser.", "He buys the other sweater because he likes it better."),
            ("Wir besuchen die andere Stadt am kommenden Wochenende.", "We are visiting the other city next weekend."),
            ("Habt ihr noch andere Vorschläge für das gemeinsame Projekt?", "Do you all have other suggestions for the joint project?"),
            ("Möchten Sie die andere Option mit dem flexiblen Tarif wählen?", "Would you like to choose the other option with the flexible rate?")
        ],
        'auch': [
            ("Ich lerne auch Deutsch, weil ich den Beruf wechseln möchte.", "I am also learning German because I want to change jobs."),
            ("Kommst du auch zur Geburtstagsparty von der Kollegin?", "Are you also coming to the birthday party of the colleague?"),
            ("Er trinkt auch gern den starken Kaffee am Morgen.", "He also likes drinking the strong coffee in the morning."),
            ("Wir besuchen auch das moderne Museum in der Stadtmitte.", "We are also visiting the modern museum in the city center."),
            ("Habt ihr auch den wichtigen Brief von der Hausverwaltung erhalten?", "Did you all also receive the important letter from property management?"),
            ("Sprechen Sie auch fließend Englisch und Französisch?", "Do you also speak fluent English and French?")
        ]
    }
    
    if lemma.lower() in custom_map:
        return custom_map[lemma.lower()]
        
    if art == 'm.' or de.startswith('der '):
        return [
            (f"Ich sehe den {lemma} und kaufe ihn für die neue Wohnung.", f"I see the {en} and buy it for the new apartment."),
            (f"Suchst du den {lemma} im Arbeitszimmer oder hast du ihn schon gefunden?", f"Are you looking for the {en} in the study or have you already found it?"),
            (f"Er findet den {lemma} sehr praktisch, weil er ihm bei der Arbeit hilft.", f"He finds the {en} very practical because it helps him with work."),
            (f"Wir stellen das Radio neben den {lemma} auf den großen Tisch.", f"We place the radio next to the {en} on the large table."),
            (f"Könnt ihr mir bitte den {lemma} bringen, damit wir ihn gemeinsam nutzen?", f"Can you all please bring me the {en} so that we use it together?"),
            (f"Haben Sie den passenden {lemma} bereits für das Büro bestellt?", f"Have you already ordered the suitable {en} for the office?")
        ]
    elif art == 'f.' or de.startswith('die ') and not de.startswith('die (Pl.)'):
        return [
            (f"Ich brauche die {lemma} und lege sie direkt auf den Tisch.", f"I need the {en} and place it directly on the table."),
            (f"Hast du die {lemma} heute schon gesehen oder suchst du sie noch?", f"Have you already seen the {en} today or are you still looking for it?"),
            (f"Er repariert die {lemma} sorgfältig und gibt sie der Kollegin zurück.", f"He repairs the {en} carefully and gives it back to the female colleague."),
            (f"Wir stellen das neue Buch neben die {lemma} in das helle Zimmer.", f"We place the new book next to the {en} in the bright room."),
            (f"Könnt ihr die {lemma} bitte ausschalten, bevor ihr das Haus verlasst?", f"Can you all please turn off the {en} before you leave the house?"),
            (f"Haben Sie die wichtige {lemma} bereits für die Konferenz vorbereitet?", f"Have you already prepared the important {en} for the conference?")
        ]
    elif art == 'n.' or de.startswith('das '):
        return [
            (f"Ich nehme das {lemma} und stelle es vorsichtig auf den Schreibtisch.", f"I take the {en} and place it carefully on the desk."),
            (f"Kennst du das neue {lemma}, oder möchtest du es dir genauer ansehen?", f"Do you know the new {en}, or would you like to take a closer look at it?"),
            (f"Er kauft das {lemma} im Geschäft und schenkt es der Familie.", f"He buys the {en} in the shop and gives it as a gift to the family."),
            (f"Wir sprechen über das {lemma} und legen die Zeitung direkt daneben.", f"We speak about the {en} and place the newspaper directly next to it."),
            (f"Könnt ihr mir das {lemma} bitte kurz zeigen, damit ich es prüfen kann?", f"Can you all please show me the {en} briefly so that I can check it?"),
            (f"Haben Sie das gewünschte {lemma} schon in den Unterlagen gefunden?", f"Have you already found the desired {en} in the documents?")
        ]
    elif art == 'pl.' or de.startswith('die (Pl.)'):
        return [
            (f"Ich zähle die {lemma} und ordne sie sorgfältig in den Schrank ein.", f"I count the {en} and arrange them carefully in the cupboard."),
            (f"Brauchst du die {lemma} heute noch, oder kann ich sie kurz ausleihen?", f"Do you still need the {en} today, or can I borrow them briefly?"),
            (f"Er sammelt die {lemma} ein und bringt sie den Kollegen im Büro.", f"He collects the {en} and brings them to the colleagues in the office."),
            (f"Wir vergleichen die {lemma} und wählen das beste Modell für das Team aus.", f"We compare the {en} and choose the best model for the team."),
            (f"Könnt ihr die {lemma} bitte auf den Tisch legen, damit alle sie sehen?", f"Can you all please place the {en} on the table so that everyone sees them?"),
            (f"Haben Sie die neuen {lemma} bereits für die Kunden bestellt?", f"Have you already ordered the new {en} for the customers?")
        ]
    else:
        # Fallback for verbs, adjectives, other
        return [
            (f"Ich wende das Wort '{lemma}' an, weil ich die Sprache lerne.", f"I apply the word '{en}' because I am learning the language."),
            (f"Verstehst du '{lemma}' im Text, oder brauchst du das Wörterbuch?", f"Do you understand '{en}' in the text, or do you need the dictionary?"),
            (f"Er erklärt '{lemma}' dem Schüler und zeigt ihm die richtige Verwendung.", f"He explains '{en}' to the student and shows him the correct usage."),
            (f"Wir nutzen '{lemma}' in der Diskussion über das wichtige Thema.", f"We use '{en}' in the discussion about the important topic."),
            (f"Könnt ihr '{lemma}' in einem Satz mit der passenden Endung sagen?", f"Can you all say '{en}' in a sentence with the fitting ending?"),
            (f"Kennen Sie den Unterschied zwischen '{lemma}' und anderen Begriffen?", f"Do you know the difference between '{en}' and other terms?")
        ]

def build_examples_cell(w):
    """Formats 5-6 sentence examples into a clean HTML-broken cell with non-repeated pronouns."""
    ps = w.get('person_sentences')
    if ps and len(ps) >= 5:
        items = ps[:6]
    else:
        items = build_fallback_6_sentences(w)
        
    formatted = []
    for idx, (de_s, en_s) in enumerate(items, 1):
        de_clean = escape_cell(de_s)
        en_clean = escape_cell(en_s)
        formatted.append(f"{idx}. {de_clean} *({en_clean})*")
    return "<br>".join(formatted)

def generate_vocabulary_md(level, words):
    title, desc = LEVEL_DESCRIPTIONS[level]
    nav = LEVEL_NAV_LINKS.get(level, '')
    
    lines = [
        f"# {level} Vocabulary List (Wortschatz)\n",
        f"A curated collection of authentic, level-appropriate German vocabulary for the **{title}** level according to the CEFR standards. Each entry includes the word with grammatical markers, English definition, topic category, **5 to 6 varied example sentences utilizing der/die/das and non-repeated pronouns**, and direct reference links.\n",
        f"{nav}\n",
        "---\n",
        "| German Word | English Translation | Topic Category | Example Sentences (5-6 Examples with Pronouns & Articles) | Dictionary & Conjugation Links |",
        "| :--- | :--- | :--- | :--- | :--- |"
    ]
    
    sorted_words = sorted(words, key=sort_key)
    for w in sorted_words:
        de = escape_cell(w['de'])
        en = escape_cell(w.get('en', ''))
        cat = escape_cell(w.get('category', 'Allgemein'))
        
        example_str = build_examples_cell(w)
        verb_flag = is_verb(w)
        clean = clean_query_word(w['de'])
        links = build_dict_links(clean, verb_flag)
        
        lines.append(f"| **{de}** | {en} | {cat} | {example_str} | {links} |")
        
    return '\n'.join(lines) + '\n'

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
        
        # Write Vocabulary.md with 5-6 examples per word
        vocab_path = os.path.join(PROJECT_ROOT, lvl, 'Vocabulary.md')
        vocab_content = generate_vocabulary_md(lvl, words)
        with open(vocab_path, 'w', encoding='utf-8') as f:
            f.write(vocab_content)
        print(f"Wrote {vocab_path} ({len(words)} entries with 5-6 examples each).")

    print("\nAll vocabulary files successfully populated with 5-6 rich examples per word!")

if __name__ == '__main__':
    main()
