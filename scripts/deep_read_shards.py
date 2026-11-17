#!/usr/bin/env python3 -I
"""Freeze the three PWC42 pilot shards (2026-11-17) before any model call. About 8,000 words each, from three world types:
Reverend Insanity (Chinese cultivation novel, chapter text), Mother of Learning (English progression book, epub) and Eberron
(tabletop setting book, the existing shard eberron:rftlw:004). For the two novels the window is the run of consecutive
paragraphs (about 8,000 words) holding the most distinct names the existing ledgers already carry, so a miss means something and
the comparison has a baseline. Writes the shard text to the gitignored private folder and a values-only manifest to
docs/coverage/deep_read_pilot_shards.json. Refuses to overwrite a manifest. Env: CHAPTER_SOURCE_ROOT, BOOKS_DIR.
  python3 -I scripts/deep_read_shards.py
"""
import importlib.util, json, os, re, hashlib, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
spec = importlib.util.spec_from_file_location('cep', os.path.join(ROOT, 'scripts/chapter_effect_packets.py'))
cep = importlib.util.module_from_spec(spec); spec.loader.exec_module(cep)
SRC = os.environ.get('CHAPTER_SOURCE_ROOT', '/Users/weiwei/code/yet-another-idle-rpg').rstrip('/')
PRIV = f'{SRC}/docs/research/power-catalogues-2026-11-16/private/'
MAN = f'{ROOT}/docs/coverage/deep_read_pilot_shards.json'
WORDS = 8000
if os.path.exists(MAN):
    sys.exit(f'{MAN} exists: the shards are frozen.')


def names_of(*ledgers):
    out = set()
    for led in ledgers:
        p = f'{ROOT}/docs/coverage/{led}.jsonl'
        if not os.path.exists(p):
            continue
        for line in open(p):
            r = json.loads(line)
            n = (r.get('note') or '').split('. ')[0].strip().lower()
            if 4 <= len(n) <= 60:
                out.add(n)
    return out


def window(pairs, names):
    """Best run of consecutive paragraphs of about WORDS words by distinct ledger names present."""
    low = [t.lower() for _, t in pairs]
    wc = [len(t.split()) for _, t in pairs]
    best = (-1, 0, 0)
    start, words = 0, 0
    end = 0
    # slide a start index over paragraph boundaries every 20 paragraphs
    for s in range(0, len(pairs), 20):
        words, e = 0, s
        while e < len(pairs) and words < WORDS:
            words += wc[e]; e += 1
        if words < WORDS * 0.9:
            break
        text = '\n'.join(low[s:e])
        hits = sum(1 for n in names if n in text)
        if hits > best[0]:
            best = (hits, s, e)
    return best


shards = {}
ri = cep.ri_pairs()
hits, s, e = window(ri, names_of('gu_kinds', 'gu_moves', 'ri_treasures', 'creatures'))
shards['reverend-insanity'] = dict(type='Chinese cultivation novel', source='Reverend Insanity, English chapters', pairs=ri[s:e], baselineNames=hits)
epub = cep.find_book(r'Mother of Learning')[0]
mol = cep.epub(epub, 'mol')
hits, s, e = window(mol, names_of('mother_of_learning_powers', 'mother_of_learning_artifacts'))
shards['mother-of-learning'] = dict(type='English LitRPG / progression book', source='Mother of Learning, epub', pairs=mol[s:e], baselineNames=hits)
out = {}
for wid, sh in shards.items():
    text = '\n'.join(f'[{loc}] {t}' for loc, t in sh['pairs'])
    open(f'{PRIV}{wid}_shard.txt', 'w').write(text)
    out[wid] = dict(type=sh['type'], source=sh['source'], first=sh['pairs'][0][0], last=sh['pairs'][-1][0], words=len(text.split()), paragraphs=len(sh['pairs']),
                    sha1=hashlib.sha1(text.encode()).hexdigest(), distinctBaselineNamesPresent=sh['baselineNames'])
eb = open(f'{SRC}/docs/research/tabletop-settings-2026-11-17/private/eberron/eberron_rftlw_004.txt').read()
open(f'{PRIV}eberron_shard.txt', 'w').write(eb)
out['eberron'] = dict(type='Tabletop setting book', source='Eberron: Rising from the Last War, epub, existing shard eberron:rftlw:004', first='eberron:rftlw:004', last='eberron:rftlw:004',
                      words=len(eb.split()), sha1=hashlib.sha1(eb.encode()).hexdigest(), baseline='existing gpt-6-luna six-cell reply for the same shard')
json.dump({'date': '2026-11-17', 'pass': 'PWC42', 'rule': 'Window: the run of about 8,000 words starting at a multiple of 20 paragraphs with the most distinct names the existing ledgers carry (novels); Eberron: shard 004 (7,664 words, one of eight shards of 7,600 to 8,200 words). Frozen before any model call. Values only.', 'shards': out}, open(MAN, 'w'), indent=1)
print(json.dumps(out, indent=1))
