#!/usr/bin/env python3
"""Build the private text corpus for the TTRPG rules pass (2026-11-17): one UTF-8 text file per system under
docs/research/tabletop-rules-2026-11-17/private/text/ (gitignored). PDFs go through `pdf-screen` first and only its
readable.txt is used; the screening summary is kept in screen.json. Run: python3 -I scripts/tabletop_corpus.py [slug...]"""
import glob, json, os, re, subprocess, sys
HOME = os.path.expanduser('~')
RB = f'{HOME}/.codex/research/rulebooks'
CAL = f'{HOME}/Calibre Library'
OUT = 'docs/research/tabletop-rules-2026-11-17/private'
PDFS = {}  # slug -> pdf path
def cal(i):
    d = [p for p in glob.glob(f'{CAL}/*/*({i})') if os.path.isdir(p)]
    f = glob.glob(d[0] + '/*.pdf') if d else []
    return f[0] if f else None
SRC = {  # slug -> list of sources (path, kind)
 'dnd-srd-5.2.1': [f'{RB}/dnd-srd-5.2.1/SRD_CC_v5.2.1.pdf'],
 'brp-orc': [f'{RB}/brp-orc/BasicRoleplaying-ORC-Content-Document.pdf'],
 'call-of-cthulhu-7e-qs': [glob.glob(f'{RB}/call-of-cthulhu-7e-quickstart/*.pdf')[0]],
 'eclipse-phase-2e-qs': [glob.glob(f'{RB}/eclipse-phase-2e-quickstart/*.pdf')[0]],
 'ironsworn': [f'{RB}/ironsworn/Ironsworn-Rulebook.pdf', f'{RB}/ironsworn/Ironsworn-Assets-Master-Set.pdf'],
 'blades-in-the-dark-srd': [f'{RB}/blades-in-the-dark-srd/repo/Blades-in-the-Dark-SRD.md'],
 'cypher-rd': [f'{RB}/cypher-reference-document/Cypher-Reference-Document-2026-07-29.docx'],
 'mm3e-srd': sorted(glob.glob(f'{RB}/mutants-masterminds-3e-srd/*.txt')),
 'fate-srd': [p for p in sorted(glob.glob(f'{RB}/fate-srd/repo/docs/markdown/*.md')) if not re.search('Hanz|accessibility', p)],
}
AM = f'{RB}/ars-magica-5e-open/repo/reviewed/Ars Magica '
SRC['ars-magica-core'] = [AM + '- Definitive Edition (Core Rules).md'.replace('Ars Magica ', '', 1)] if False else [f'{RB}/ars-magica-5e-open/repo/reviewed/Ars Magica - Definitive Edition (Core Rules).md']
SRC['ars-magica-realms'] = [AM + f'5e - Realms of Power - {n}.md' for n in ('Magic', 'Faerie', 'The Divine (Revised)', 'The Infernal')]
SRC['ars-magica-magic'] = [AM + f'5e - Magic - {n}.md' for n in ('Ancient Magic', 'Hedge Magic (Revised)', 'Apprentices')] + [AM + '5e - The Mysteries (Revised).md']
SRC['ars-magica-houses'] = [AM + f'5e - Houses of Hermes - {n}.md' for n in ('Societates', 'True Lineages', 'Mystery Cults')] + [AM + '5e - Covenants.md']
# Commercial (design reference only)
for slug, i in {'dnd5e-phb-2014': 164, 'dnd5e-dmg-2014': 128, 'dnd5e-mm-2014': 133, 'dnd5e-xanathar': 190, 'dnd5e-tasha': 191, 'dnd5e-fizban': 226,
                'dnd5e-motm': 228, 'dnd5e-planescape': 217, 'dnd5e-spelljammer': 227, 'gurps-powers': 197, 'gurps-thaumatology': 192,
                'mm3e-heros-handbook': 194, 'blades-core-harper': 213}.items():
    p = cal(i)
    if p: SRC[slug] = [p]
# PWC50: a qpdf rewrite of a damaged library copy (never the library file itself) replaces it when the rewrite exists.
for slug, name in {'dnd5e-tasha': 'tasha-cauldron-of-everything.qpdf.pdf'}.items():
    if os.path.exists(f'{RB}/repaired/{name}'): SRC[slug] = [f'{RB}/repaired/{name}']
def screened(pdf):
    r = subprocess.run(['pdf-screen', pdf], capture_output=True, text=True).stdout
    m = re.search(r'readable\.txt: (\S.*)', r); s = re.search(r'Signals[^:]*: (\{.*\})', r)
    if not m: return None, (s.group(1) if s else r[:200])
    rd = m.group(1).strip(); txt = open(rd, errors='ignore').read(); sig = s.group(1) if s else r[:200]
    # Scanned books carry an invisible OCR layer that pdf-screen quarantines. When that layer is the book (it outweighs the
    # visible text and no instruction-shaped text was flagged), read it as the text; the screening summary keeps the signals.
    q = open(os.path.join(os.path.dirname(rd), 'quarantine.txt'), errors='ignore').read()
    if '"invisible_text"' in sig and len(q.split()) > 2 * len(txt.split()) and '"instruction_hint"' not in sig.replace('"instruction_hint": 1', ''):
        txt += '\n\n##### OCR LAYER (invisible text, screened)\n' + q.split('\n', 1)[1]
        sig += ' ocr-layer-used'
    return txt, sig
def read(p):
    if p.endswith('.pdf'): return screened(p)
    if p.endswith('.docx'):
        return subprocess.run(['textutil', '-convert', 'txt', '-stdout', p], capture_output=True, text=True).stdout, 'docx'
    return open(p, errors='ignore').read(), 'text'
def main():
    want = sys.argv[1:] or list(SRC)
    scr = {}
    for slug in want:
        parts = []
        for p in SRC[slug]:
            t, sig = read(p)
            if not t: print('FAIL', slug, p); continue
            scr.setdefault(slug, {})[os.path.basename(p)] = sig
            parts.append(f'\n\n##### FILE {os.path.basename(p)}\n' + t)
        txt = ''.join(parts); open(f'{OUT}/text/{slug}.txt', 'w').write(txt)
        print(slug, len(txt.split()), 'words', len(parts), 'files', flush=True)
    json.dump(scr, open(f'{OUT}/screen-{want[0] if len(want) == 1 else "all"}.json', 'w'), indent=1)
main()
