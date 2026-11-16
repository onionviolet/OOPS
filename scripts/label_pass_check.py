#!/usr/bin/env python3
"""Check the Luna label passes (scripts/label_pass.mjs). Prints counts only, no source text.

Per pass: rows returned, fields filled, filled fields whose locator is not one of the packet's own
locators. ri_moves: component names that match a Gu catalogue name, and names that do not (the
non-Gu noise the pilot found). hp_potions: Luna's route against the 17 held-out evidence labels in
docs/coverage/README.md. Run with python3 -I.
"""
import json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = os.path.join(ROOT, 'docs/research/advancement-aspects-2026-11-16/private')


def norm(s):
    return re.sub(r'[^a-z0-9]+', ' ', s.lower().replace('immortal gu', '').replace(' gu', ' ')).strip()


class locs:
    """A locator is valid when, without its outer brackets, it starts one of the packet's evidence lines.
    Claim locators carry their own brackets (b[63, 85]), so a bracket pattern would cut them short."""
    def __init__(self, packet):
        self.lines = [e[1:] for e in packet['evidence'] if e.startswith('[')]

    def __contains__(self, loc):
        loc = loc.strip()
        if loc.startswith('[') and loc.endswith(']'):
            loc = loc[1:-1]
        return bool(loc) and any(line.startswith(loc + ']') for line in self.lines)


def fields(reply):
    return {k: v for k, v in reply.items() if isinstance(v, dict) and 'value' in v}


def route_of(text):
    t = text.lower()
    for key, words in [('spray', ['spray']), ('eaten', ['eaten', 'eat ', 'swallow', 'chew', 'sweet']),
                       ('topical', ['skin', 'hair', 'wound', 'rub', 'appl', 'topical', 'smear', 'massag', 'pour']),
                       ('potion', ['drunk', 'drink', 'oral', 'quaff', 'sip'])]:
        if any(w in t for w in words):
            return key
    return None


report = {}
index = json.load(open(os.path.join(ROOT, 'docs/research/novels/reverend-insanity/private/rule-derivation-2026-11-11/gu-identities.json')))
gu_names = {norm((r.get('saga') or {}).get('name') or (r.get('fandom') or {}).get('name') or r['id']) for r in index['records']}
for name in ['hp_potions', 'gu_kinds', 'ri_moves']:
    path = os.path.join(P, f'{name}_luna.json')
    if not os.path.exists(path):
        continue
    packets = {p['id']: p for p in json.load(open(os.path.join(P, f'{name}_packets.json')))}
    rows = json.load(open(path))
    ok = {k: v['reply'] for k, v in rows.items() if 'reply' in v}
    filled = bad = 0
    per_field = {}
    for pid, reply in ok.items():
        good = locs(packets[pid])
        for k, f in fields(reply).items():
            if f['value']:
                filled += 1
                per_field[k] = per_field.get(k, 0) + 1
                if f['locator'] not in good:
                    bad += 1
    entry = {'rows': len(ok), 'errors': len(rows) - len(ok), 'filled': filled, 'badLocator': bad, 'byField': per_field}
    if name == 'ri_moves':
        comps = [c for r in ok.values() for c in r['components']]
        known = [c for c in comps if norm(c['gu']) in gu_names]
        entry.update(components=len(comps), componentsKnownGu=len(known), movesWithComponent=sum(1 for r in ok.values() if r['components']),
                     movesWithKnownComponent=sum(1 for r in ok.values() if any(norm(c['gu']) in gu_names for c in r['components'])),
                     componentBadLocator=sum(1 for pid, r in ok.items() for c in r['components'] if c['locator'] not in locs(packets[pid])))
    if name == 'hp_potions':
        readme = open(os.path.join(ROOT, 'docs/coverage/README.md')).read()
        held = re.findall(r'^\| ([a-z0-9_]+) \| [a-z-]+ \| [^|]+ \| [^|]+ via ([a-z]+) \|', readme, re.M)
        agree, compared, misses = 0, 0, []
        for row, carrier in held:
            reply = ok.get(f'hp.potion.{row}')
            if not reply:
                continue
            got = route_of(reply['route']['value'])
            if got is None:
                continue
            compared += 1
            if got == carrier:
                agree += 1
            else:
                misses.append((row, carrier, got))
        entry.update(heldOutRows=len(held), heldOutCompared=compared, heldOutRouteAgree=agree, heldOutRouteMisses=misses)
    report[name] = entry
print(json.dumps(report, indent=1))
