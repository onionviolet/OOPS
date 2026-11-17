#!/usr/bin/env python3
"""Private evidence packets for the next-cells lane (PWC28, power-catalogues-2026-11-16): Harry Potter creatures and
Lord of the Mysteries Beyonder abilities. Denominators come from wiki data (PWC3): every page with a Creature infobox, and
every New Abilities / Authorities / Mythical Creature Form entry on a pathway's Abilities page. The world's own class
(the Ministry of Magic X rating; the pathway) is hidden from the evidence and written beside it (PWC2). Wiki text stays private.
  HP_DUMP_XML=<unpacked xml> LABEL_PRIVATE=<dir> python3 -I scripts/next_cells_packets.py [hp_creatures lotm_powers]
"""
import gzip, importlib.util, json, os, re, sys
import xml.etree.ElementTree as ET

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.environ.get('LABEL_PRIVATE') or os.path.join(ROOT, 'docs/research/power-catalogues-2026-11-16/private')
WIKIS = os.path.expanduser('~/.codex/research/wikis')
spec = importlib.util.spec_from_file_location('lpp', os.path.join(ROOT, 'scripts/label_pass_packets.py'))
lpp = importlib.util.module_from_spec(spec); spec.loader.exec_module(lpp)
LOTM = os.path.join(WIKIS, 'lordofthemysteries.fandom.com/dump/lotm-wiki-current-pages-2026-11-03.jsonl.gz')


def slug(t):
    return re.sub(r'[^a-z0-9]+', '_', t.lower()).strip('_')


def hp_creatures():
    xml = os.environ.get('HP_DUMP_XML') or os.path.join(WIKIS, 'harrypotter.fandom.com/dump/harrypotter_pages_current.xml')
    out = []
    for _, el in ET.iterparse(xml, events=('end',)):
        if not el.tag.endswith('}page'):
            continue
        if el.findtext('{*}ns') == '0':
            text = el.findtext('{*}revision/{*}text') or ''
            title = el.findtext('{*}title') or ''
            if re.search(r'(?i)\{\{\s*Creature[ _]infobox', text) and not re.match(r'(?i)\s*#redirect', text):
                rev = el.findtext('{*}revision/{*}id') or ''
                m = re.search(r'(?im)^\|\s*class\s*=(.*?)(?=^\|\s*\w+\s*=|^\}\})', text, re.S | re.M)
                raw = re.sub(r'<ref[^>]*/>|<ref[^>]*>.*?</ref>', '', m.group(1) if m else '', flags=re.S)
                xs = re.findall(r'\[\[(X{1,5})\]\]', raw) or re.findall(r'\b(X{1,5})\b', raw)
                label = str(len(xs[0])) if xs else 'unrated'
                world = [w for w in ('Beast', 'Being', 'Spirit') if re.search(r'\[\[%s\]\]' % w, raw)]
                # Hide the world's own classification: the class field, X-rating links and any sentence that states a rating.
                t = re.sub(r'(?im)^\|\s*class\s*=.*?(?=^\|\s*\w+\s*=|^\}\})', '', text, flags=re.S | re.M)
                t = re.sub(r'\[\[X{1,5}\]\]', '[rating hidden]', t)
                t = re.sub(r'(?i)\[\[(?:Ministry of Magic|Department for the Regulation and Control of Magical Creatures)[^\]]*\]\]\s*(?:classification|classified)[^.\n]*\.', '', t)
                t = re.sub(r'(?i)[^.\n]*\b(?:classified|classification|rated|rating)\b[^.\n]*\bX{1,5}\b[^.\n]*\.', '', t)
                t = re.sub(r'(?i)[^.\n]*\bX{2,5}\b[^.\n]*\.', '', t)
                t = re.sub(r'(?im)^\|\s*Ministry[ _]classification\s*=.*$', '', t)
                t = re.sub(r'\{\{\s*Creatures by classification\s*\}\}', '', t)
                ev = []
                for line in lpp.sections(title, t):
                    tag, _, body = line.partition('] ')
                    keep = [x for x in re.split(r'(?<=[.!?])\s+', body) if not re.search(r'(?i)classif|\bX{1,5}\b|"X"', x)]
                    if keep:
                        ev.append(tag + '] ' + ' '.join(keep))
                out.append({'id': 'hp.creature.' + slug(title), 'name': title, 'label': label, 'world_class': world,
                            'locator': f'harrypotter pages_current oldid {rev}', 'evidence': ev})
        el.clear()
    out.sort(key=lambda p: p['id'])
    return out


def lotm_powers():
    potions = [json.loads(l) for l in open(os.path.join(ROOT, 'docs/coverage/lotm_potions.jsonl'))]
    have, names = set(), {}
    for r in potions:
        m = re.match(r'lotm\.potion\.([a-z_]+)_(\d)$', r['id'])
        if m:
            have.add(r['id'])
        n = re.match(r'^(.*?) Sequence (\d) ([^.]+)\.', r.get('note', ''))
        if m and n:
            names.setdefault(m.group(1), {'pathway': n.group(1), 'seq': {}})['seq'][n.group(2)] = n.group(3).strip()
    keymap = {v['pathway']: k for k, v in names.items()}
    out = []
    for line in gzip.open(LOTM, 'rt'):
        d = json.loads(line)
        if not d['title'].endswith(' Pathway/Abilities'):
            continue
        pname = d['title'].replace(' Pathway/Abilities', '')
        key = keymap.get(pname) or slug(pname)
        parts = re.split(r'(?m)^\s*==\s*([^=\n]+?)\s*==\s*$', d['text'])
        for i in range(1, len(parts), 2):
            h, body = parts[i], parts[i + 1]
            hm = re.match(r'Sequence (\d+)\s*:?\s*(.*)', h)
            if not hm:
                continue
            seq, sname = hm.group(1), hm.group(2).strip()
            rows = []
            blocks = re.split(r"(?m)^\s*;\s*'''([^']+?)'''[^\n]*\n", body)
            for j in range(1, len(blocks), 2):
                bname = re.sub(r'<[^>]*>', '', blocks[j]).strip()
                kind = {'New Abilities': 'ability', 'Authorities': 'authority', 'Mythical Creature Form': 'creature-form'}.get(bname)
                if not kind:
                    continue
                if kind == 'creature-form':
                    rows.append({'name': f'Sequence {seq} mythical creature form', 'kind': kind})
                    continue
                for nm in re.findall(r"(?m)^\*\s*'''([^']+?)'''", blocks[j + 1]):
                    lang = re.match(r'\{\{\s*Language\s*\|([^|}]+)', nm)
                    rows.append({'name': re.sub(r'\s+', ' ', lang.group(1) if lang else nm).strip(' :'), 'kind': kind})
            if not rows:
                continue
            seen, uniq = set(), []
            for r in rows:
                if (r['name'], r['kind']) not in seen:
                    seen.add((r['name'], r['kind'])); uniq.append(r)
            pid = f'{key}_{seq}'
            for r in uniq:
                r['id'] = f'lotm.ability.{pid}.{slug(r["name"])}'
            # Blind the section: the page and the Sequence names say which pathway this is (PWC2); strip them from the evidence.
            blind = body
            hidden = [pname] + [v for v in names.get(key, {'seq': {}})['seq'].values()] + ([sname] if sname else [])
            for w in sorted({h2 for h2 in hidden if len(h2) > 2}, key=len, reverse=True):
                blind = re.sub(r'(?i)\b%s(?:\'s|s)?(?: pathway)?\b' % re.escape(w), '[name hidden]', blind)
            for r in uniq:
                shown = r['name']
                for w in sorted({h2 for h2 in hidden if len(h2) > 2}, key=len, reverse=True):
                    shown = re.sub(r'(?i)\b%s(?:\'s|s)?(?: pathway)?\b' % re.escape(w), '[name hidden]', shown)
                r['shown'] = shown
            ev = lpp.sections(f'{pname} Pathway/Abilities seq {seq}', blind)
            out.append({'id': f'lotm.section.{pid}', 'pathway': key, 'pathway_name': pname, 'seq': int(seq), 'seq_name': sname,
                        'potion': f'lotm.potion.{pid}' if f'lotm.potion.{pid}' in have else None, 'rows': uniq,
                        'locator': f'lotm-wiki-current-pages-2026-11-03 rev {d["revision_id"]}', 'evidence': ev})
    out.sort(key=lambda p: p['id'])
    return out


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    for name in sys.argv[1:] or ['hp_creatures', 'lotm_powers']:
        packets = globals()[name]()
        json.dump(packets, open(os.path.join(OUT, f'nc_{name}_packets.json'), 'w'))
        if name == 'hp_creatures':
            lab = {}
            for p in packets:
                lab[p['label']] = lab.get(p['label'], 0) + 1
            print(json.dumps({'cell': name, 'packets': len(packets), 'labels': lab, 'evidenceChars': sum(len(' '.join(p['evidence'])) for p in packets)}))
        else:
            kinds = {}
            for p in packets:
                for r in p['rows']:
                    kinds[r['kind']] = kinds.get(r['kind'], 0) + 1
            print(json.dumps({'cell': name, 'sections': len(packets), 'rows': sum(len(p['rows']) for p in packets), 'kinds': kinds,
                              'linked': sum(1 for p in packets if p['potion']), 'evidenceChars': sum(len(' '.join(p['evidence'])) for p in packets)}))
