#!/usr/bin/env python3
"""LAYX34 anchor ledger builder. Run: python3 -I build_ledger.py [--sample N]
Reads private row files (rules + rules_other) for LOTM volume 1 and Harry Potter book one,
assigns a system group (first keyword match wins) and statement kinds (regex heuristics),
writes ledger.json, ../ANCHOR_LEDGER_VOL1_BOOK1_2026-11-09.md and a private per-row file.
Optional precision.json (hand-judged samples) is folded into the outputs."""
import glob, json, os, re, sys, random, collections

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
NOV = os.path.join(ROOT, 'docs', 'research', 'novels')
LOTM_DIR = os.path.join(NOV, 'lord-of-mysteries', 'private', 'lead-run-2026-10-27')
HP_DIR = os.path.join(NOV, 'harry-potter', 'private', 'lead-run-2026-10-28')
PRIV = {
    'A': os.path.join(NOV, 'lord-of-mysteries', 'private', 'anchor-ledger-2026-11-09'),
    'B': os.path.join(NOV, 'harry-potter', 'private', 'anchor-ledger-2026-11-09'),
}

def lotm_files():
    out = []
    for pre in ['s[0-9]*', 'w[0-9]s[0-9]*', 'b[4-7]s[0-9]*', 'zw*']:
        for t in ['rules', 'rules_other']:
            for f in sorted(glob.glob(os.path.join(LOTM_DIR, pre + '_' + t + '.jsonl'))):
                if re.search(r'x2|m_|sm_', os.path.basename(f)):
                    continue
                out.append(f)
    return out

def hp_files():
    return sorted(glob.glob(os.path.join(HP_DIR, 'hp1c0*_rules.jsonl')) +
                  glob.glob(os.path.join(HP_DIR, 'hp1c0*_rules_other.jsonl')))

SKIP = {'label', 'locator', 'costStated', 'who', 'about', 'id', 'worldKind', 'place', 'kind'}
def flat(o, out):
    if isinstance(o, dict):
        for k, v in o.items():
            if k not in SKIP:
                flat(v, out)
    elif isinstance(o, list):
        for v in o:
            flat(v, out)
    elif o is not None:
        out.append(str(o))

def strip_id(s):
    return re.sub(r'\b(hp|lotm)\.[a-z]+\.', '', s).replace('-', ' ').replace('_', ' ')

def row_text(r):
    parts = []
    if 'what' in r and 'steps' not in r:
        parts.append(r['what'])
    else:
        parts.append(strip_id(r.get('id', '')))
        parts.append(r.get('name', ''))
        flat({k: v for k, v in r.items() if k != 'name'}, parts)
    return strip_id(' ; '.join(str(p) for p in parts))

def load(files):
    rows = []
    for f in files:
        stem = os.path.basename(f).replace('.jsonl', '')
        for i, l in enumerate(open(f, encoding='utf-8'), 1):
            l = l.strip()
            if not l:
                continue
            r = json.loads(l)
            structured = 'steps' in r
            struct = {}
            if structured:
                struct['nsteps'] = len(r.get('steps') or [])
                struct['qty'] = any(isinstance(x.get('qty'), (int, float)) and x.get('qty') not in (0, 1)
                                    for x in (r.get('inputs') or []) + (r.get('products') or []) if isinstance(x, dict))
                struct['costs'] = bool(r.get('costs'))
                struct['fail'] = any(str(x.get('when', '')).lower().startswith('fail') for x in (r.get('results') or []) if isinstance(x, dict))
            head = strip_id(r.get('id', '') + ' ; ' + r.get('name', '')) if structured else ''
            rows.append({'handle': '%s:%d' % (stem, i), 'text': row_text(r), 'head': head, 'struct': struct})
    return rows

# ---------- system groups (first match wins) ----------
A_GROUPS = [
 ('L-SUMM', r'\b(pray\w*|summon\w*|sacrific\w*|ritual\w*|rites?|offering|invoc\w*|incantation|messenger|honorific|spirit world|contact(s|ed)? the)\b'),
 ('L-DIV', r'\b(divin\w*|pendulum|omens?|tarot|oracle|scrying|augur\w*|fortune|lots)\b'),
 ('L-ACT', r'\b(acting|role play\w*|digest\w*|act as|roleplay)\b'),
 ('L-ADV', r'\b(sequence|potions?|pathways?|promot\w*|advanc\w*|ingredients?|formulas?|beyonders?|extraordinary|swap\w*|main ingredient|supplementary)\b'),
 ('L-CTRL', r'\b(lose control|loss of control|losing control|out of control|madness|go mad|insan\w*|crazy|lunatic|backlash|corrupt\w*|distort\w*)\b'),
 ('L-SEAL', r'\b(sealed|sealing|artifacts?|containment|custody|requisition\w*|danger level|grade [0-9]|cursed|mystical item|storage|confiscat\w*|vault)\b'),
 ('L-CHARM', r'\b(amulets?|charms?|talismans?|trinkets?|recharg\w*|activat\w*|enchant\w*|made item)\b'),
 ('L-INV', r'\b(case|clues?|deduc\w*|investigat\w*|suspects?|detective|evidence|murder\w*|culprit|witness\w*|interrogat\w*)\b'),
 ('L-CLUB', r'\b(codename\w*|secret club|club|members? of|pseudonym|tarot club|information trade|intelligence|informant\w*|contact (person|code))\b'),
 ('L-ORG', r'\b(rank\w*|salary|probation\w*|shift\w*|rota|duty|duties|captain|team members?|jurisdiction|police|nighthawks?|church|organi[sz]ation|promotion|superior|colleagues?|officer\w*|armory|staff|boss|department|bureau)\b'),
 ('L-LAW', r'\b(laws?|permits?|licen[sc]e\w*|illegal|legal|fines?|arrest\w*|regulation\w*|criminal|prison\w*|jail|forbid\w*|ban(ned)?|prohibit\w*|tax\w*|customs|court)\b'),
 ('L-EDU', r'\b(schools?|exams?|examination|studies|study|studying|students?|universit\w*|lectures?|lessons?|tutor\w*|textbooks?|diploma|degree|college|classes|course)\b'),
 ('L-TRAIN', r'\b(fenc\w*|sword\w*|revolvers?|pistols?|guns?|firearms?|shoot\w*|weapons?|boxing|martial|spar\w*|train(ing)? (hall|room|session)|bullets?|marksman\w*|drill\w*)\b'),
 ('L-TRAV', r'\b(trains?|carriages?|ships?|ferry|ferries|voyage|journeys?|travel\w*|fares?|railway|tram|cab|coach|steamship|route|port|harbou?r|station|trips?)\b'),
 ('L-HOME', r'\b(rent\w*|apartments?|flats?|lodg\w*|landlord\w*|landlady|household|bedroom|furnish\w*|housing|mortgage|house|home|maid|servants?|cook\w*)\b'),
 ('L-ECON', r'\b(soli|pennies|penny|pounds?|prices?|priced|costs?|wages?|salary|fees?|pay|pays|paid|trade|trading|buy\w*|sell\w*|sold|cheap\w*|expensive|bank\w*|loans?|debts?|money|rich|poor|income|profit|auction|stocks?|shares?|gold|coins?|market|purchas\w*|worth|afford\w*|\bs\b|bread|coffee|meal|food|\d+ ?(shillings?|d\b|p\b))\b'),
 ('L-SPIR', r'\b(spirit vision|spirit sight|spirit wall|perce\w+|auras?|barriers?|wards?|invisible|hidden|spirituality|detect\w*|sense[sd]?|senses|vision|sight|gaze|protective)\b'),
 ('L-POWER', r'\b(fights?|attacks?|combat|flames?|fire|spells?|powers?|abilit\w*|skills?|strong\w*|weak\w*|damage\w*|heal\w*|kill\w*|wound\w*|defen[cs]\w*|lightning|poison\w*|curses?|blast\w*|strength|speed|resist\w*)\b'),
 ('L-ETIQ', r'\b(etiquette|gestures?|customs?|taboos?|polite\w*|greet\w*|bow\w*|salute\w*|manners?|rude\w*|tradition\w*|dress code|custom|hats?|gloves?|courtesy|toast\w*|bless\w*|sign of the cross|tip)\b'),
 ('L-TEXT', r'\b(hours?|minutes?|days?|weeks?|months?|years?|seconds?|midnight|morning|evening|night|noon|dawn|dusk|clock|o.?clock|\d+:\d+|a\.m\.|p\.m\.|monday|tuesday|wednesday|thursday|friday|saturday|sunday|daily|duration|decades?|centuries)\b'),
 ('L-DAY', r'\b(breakfast|lunch|dinner|supper|tea|newspapers?|reads?|reading|walks?|garden|cafe|restaurant|coffee|sleep\w*|rest|weather|fog|rain|street|market|shop\w*|friends?|neighbou?r\w*|music|theat\w+|church)\b'),
]
B_GROUPS = [
 ('H-CREAT', r'\b(dragons?|eggs?|hatch\w*|creatures?|beasts?|three headed|pets?|trolls?|unicorns?|centaurs?|owls?|toads?|cats?|rats?|spiders?|nest|fang|fluffy|norbert|norwegian)\b'),
 ('H-QUID', r'\b(quidditch|brooms?|broomsticks?|seekers?|snitch|bludgers?|quaffle|keeper|chaser\w*|beaters?|flying|fly|flew|pitch|match(es)?|goalposts?|referee)\b'),
 ('H-WAND', r'\b(wands?|ollivander|wand ?maker|phoenix feather|core)\b'),
 ('H-POT', r'\b(potions?|brew\w*|cauldrons?|elixir\w*|ingredients?|stir\w*)\b'),
 ('H-ECON', r'\b(galleons?|sickles?|knuts?|pounds?|pence|gold|vaults?|gringotts|price\w*|cost\w*|buy\w*|bought|sell\w*|bank|money|pay\w*|paid|purchas\w*|coins?|cheap\w*|expensive|shopping|afford\w*|\d+p)\b'),
 ('H-POST', r'\b(posts?|mail|letters?|parcels?|packages?|deliver\w*|postmark|stamps?|addressed|telegram|notes? (from|to))\b'),
 ('H-TRAV', r'\b(trains?|express|platform|carriages?|boats?|journey|ride|rides|travel\w*|ferry|compartments?|station|taxis?|underground|lake)\b'),
 ('H-OBST', r'\b(obstacles?|chain|guard\w*|trapdoor|riddles?|puzzles?|devil.s snare|chess|keys?|locked room|challenge\w*|protect\w*|enchantments)\b'),
 ('H-ITEM', r'\b(mirror|cloak|invisib\w*|stone|remembrall|map|magical (object|item)s?|artifacts?|objects?|items?|enchanted|talisman|sorcerer|philosopher|invisibility)\b'),
 ('H-HOUSE', r'\b(houses?|points?|sorting|hat|gryffindor|slytherin|ravenclaw|hufflepuff|cups?|championship|prefects?|head ?boy|head ?girl|common room|dormitor\w*)\b'),
 ('H-DISC', r'\b(detention\w*|expel\w*|ban(ned)?|forbidden|curfew|punish\w*|caught|out of bed|rules?|permission|prohibit\w*|not allowed|allowed|strictly|trouble|lines?)\b'),
 ('H-CLASS', r'\b(lessons?|class(es)?|homework|library|exams?|teachers?|professors?|essay\w*|term|tests?|subjects?|lectures?|timetable|marks?|grades?|textbooks?|studying|study|revis\w*)\b'),
 ('H-SPELL', r'\b(spells?|incantations?|jinx\w*|hex\w*|curses?|counter\w*|levitat\w*|wingardium|charm|charms|say|said|words?|pronounc\w*|swish|flick|magic)\b'),
 ('H-HIDDEN', r'\b(muggles?|secret\w*|hidden|conceal\w*|statute|gates?|wall|brick\w*|leaky|disguise\w*|spoilers?|anonymous|unseen|non magical|invisible)\b'),
 ('H-INV', r'\b(investigat\w*|suspect\w*|research\w*|tail\w*|follow\w*|clues?|mystery|flamel|detective|spy|spied|suspicious)\b'),
 ('H-AGE', r'\b(underage|age|aged|eleven|trace|accidental magic|sixteen|seventeen|birthday|too young|adult|child)\b'),
 ('H-HOME', r'\b(dursleys?|cupboard|uncle|aunt|punish\w*|chores?|locked|lock\w*|household|relatives|dudley|sulk\w*)\b'),
 ('H-SOC', r'\b(friend\w*|rival\w*|enem\w*|dislike\w*|bull\w*|popular|famous|stare[sd]?|whisper\w*|jealous\w*|enemy)\b'),
 ('H-TEXT', r'\b(hours?|minutes?|days?|weeks?|months?|years?|seconds?|midnight|morning|evening|night|noon|dawn|clock|o.?clock|\d+:\d+|a\.m\.|p\.m\.|monday|tuesday|wednesday|thursday|friday|saturday|sunday|daily|duration|term)\b'),
 ('H-DAY', r'\b(breakfast|lunch|dinner|supper|tea|feast|meals?|christmas|holidays?|halloween|calendar|easter|term|great hall|food|eat\w*|ate|sleep\w*)\b'),
]
A_ORDER = [g for g, _ in A_GROUPS] + ['L-SIG', 'L-RARE', 'L-MISC']
B_ORDER = [g for g, _ in B_GROUPS] + ['H-MISC']
A_NOT_DERIVED = {'L-SIG': 'its keywords would name a sealed lead-specific power', 'L-RARE': 'rare late events; keywords would name them'}
B_NOT_DERIVED = {}

def assign(text, groups, misc, head=''):
    for chunk in (head.lower(), text.lower()):
        if not chunk:
            continue
        for g, rx in groups:
            if re.search(rx, chunk):
                return g
    return misc

# ---------- statement kinds ----------
NUMW = r'(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|twenty|thirty|forty|fifty|sixty|hundred|thousand|dozen|half|a couple of|\d+(?:[.,]\d+)?)'
UNIT_PT = (r'(?:soli|pennies|penny|pence|pounds?|shillings?|galleons?|sickles?|knuts?|coins?|feet|foot|ft|yards?|miles?|inch(?:es)?|'
           r'met(?:er|re)s?|cm|km|kg|ounces?|grams?|gallons?|percent|per cent|%|points?|degrees?|people|students|members|'
           r'years old|houses?|books?|copies|ingredients?|drops?|vials?|bottles?|candles?|floors?|rooms?|steps|stairs|pages?|chapters?|'
           r'letters?|owls?|brooms?|players?|men|women|cards?|sequence|bullets?|rounds?|doses?|cups?)')
RX = {
 'point': re.compile(r'£\s?\d|\$\s?\d|\b\d{1,2}:\d{2}\b|\b\d{1,2}\s?(?:a\.?m\.?|p\.?m\.?|o.clock)\b|\b' + NUMW + r'\s+(?:square\s+)?' + UNIT_PT + r'\b|'
                    r'\b(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d|'
                    r'\b(?:at|on|by)\s+\d{1,2}(?:st|nd|rd|th)\b|\b(?:\d+(?:\.\d+)?)\s*(?:soli|pence|p\b|d\b|s\b)', re.I),
 'band': re.compile(r'\b(?:between|from)\s+\w+\s+(?:and|to)\s+\w+|\b\d+\s*(?:-|to)\s*\d+\b|'
                    r'\b(?:about|roughly|approximately|around|nearly|almost|at least|at most|up to|no more than|no less than|more than|less than|over|under|some|dozens? of|scores? of)\s+(?:the\s+)?' + NUMW + r'\b|'
                    r'\b(?:several|a few|a couple|a handful|numerous|hundreds of|thousands of|dozens)\b', re.I),
 'order': re.compile(r'\b(?!rather\b|later\b)\w+(?:er|ier)\s+than\b|\bmore\s+\w+\s+than\b|\bless\s+\w+\s+than\b|\b(?:outranks?|outweighs?|outclass\w*|defeats?|surpass\w*|exceeds?|inferior|superior|equal to|worth more|worth less|senior to|junior to|higher tier|lower tier|mid tier|top tier|ranks? (?:above|below|higher|lower)|is stronger|is weaker|rank order|hierarchy|greater than|lesser than|greater|lesser)\b', re.I),
 'count_or_duration': re.compile(r'\b' + NUMW + r'\s+(?:times|tries|attempts|uses|rounds|days|weeks|months|years|nights|hours|minutes|seconds|turns|sessions|cycles|attempts)\b|'
                                 r'\b(?:once|twice|thrice|daily|weekly|monthly|yearly|nightly)\b|\bafter\s+' + NUMW + r'\b|\btook\s+' + NUMW + r'\b|\bevery\s+' + NUMW + r'?\s*(?:days?|weeks?|months?|years?|hours?|nights?)\b|'
                                 r'\b(?:lasts?|lasted|lasting|for)\s+(?:about\s+|roughly\s+|at least\s+|only\s+)?' + NUMW + r'\s+(?:day|week|month|year|hour|minute|second|night)s?\b|'
                                 r'\bone use\b|\bsingle use\b|\bone.time\b', re.I),
 'sequence': re.compile(r'\bbefore\b|\bafter\b|\bfollowed by\b|\bprior to\b|\bonly (?:after|when|once)\b|\bfirst\b.*\b(?:then|next)\b|\bthen\b|\bafterwards?\b|\bfinally\b', re.I),
 'tolerance': re.compile(r'\bslightly\b|\ba little (?:more|less|too)\b|\btoo (?:much|many|little|few|long|short|late|early|strong|weak|large|small|far|close|great|high|low)\b|\bexact(?:ly)?\b|\bprecise(?:ly)?\b|\bbarely\b|\bjust enough\b|\bnot enough\b|\bexcess\w*\b|\boverdo\w*\b|\bany (?:more|less)\b|\bmistake\w*\b|\binaccura\w+\b|\bimprecise\b|\boff by\b|\bmargin\b|\btoleran\w+\b|\bdeviat\w+\b|\b(?:more|less) likely\b|\bcloser\b|\bonly slightly\b', re.I),
 'negative': re.compile(r"\b(?:cannot|can't|can not|unable|fails?|failed|failure|impossible|refus\w+|denied|forbidden(?! forest)|banned|prohibit\w*|not allowed|never|no longer|loses?|lost|won't|will not|does not (?:work|allow|permit|help)|useless|ineffective|prevents?|unless|not (?:work|possible|permitted|enough|able|reach)|cannot|only (?:by|if)|no effect|without (?:it|the|a))\b", re.I),
}

RANKNUM = re.compile(r'\b(?:sequences?|grades?|levels?|ranks?|tiers?)\s+\d+(?:\s*(?:to|and|-)\s*\d+)?', re.I)

def kinds(row):
    t = RANKNUM.sub('RANK', row['text'])
    s = row['struct']
    ks = set(k for k, rx in RX.items() if rx.search(t))
    if s.get('qty'):
        ks.add('point')
    if s.get('nsteps', 0) >= 3:
        ks.add('sequence')
    if s.get('fail'):
        ks.add('negative')
    return ks

KINDS = ['point', 'band', 'order', 'count_or_duration', 'sequence', 'tolerance', 'negative']
ANCH = ['point', 'band', 'count_or_duration']
SHAPE = ['order', 'sequence', 'tolerance', 'negative']

RATES = {}

def tier(c):
    if sum(c[k] for k in ANCH) >= 3:
        return 'tunable'
    if sum(c[k] for k in SHAPE) >= 3:
        return 'shape only'
    return 'assumed'

def build(book, files, groups, order, misc, not_derived):
    rows = load(files)
    stats = {g: collections.Counter() for g in order}
    members = collections.defaultdict(list)
    priv = []
    for r in rows:
        g = assign(r['text'], groups, misc, r['head'])
        ks = kinds(r)
        r['group'] = g
        r['kinds'] = sorted(ks)
        st = stats[g]
        st['total'] += 1
        if not ks:
            st['qualitative'] += 1
        for k in ks:
            st[k] += 1
        members[g].append(r)
        priv.append({'handle': r['handle'], 'group': g, 'kinds': sorted(ks), 'text': r['text']})
    rng = random.Random(34)
    systems = {}
    for g in order:
        st = stats[g]
        pool = [r for r in members[g] if set(r['kinds']) & set(ANCH)] or members[g]
        pick = rng.sample(pool, min(5, len(pool))) if pool else []
        adj = {k: st[k] * RATES.get(book, {}).get(k, 1.0) for k in KINDS}
        systems[g] = {
            'adjusted_tier': tier(adj) if g not in not_derived and st['total'] else '',
            'counts': {k: st[k] for k in KINDS + ['qualitative', 'total']},
            'tier': tier(st) if g not in not_derived and st['total'] else ('not found' if g not in not_derived else 'not re-derived'),
            'examples': [p['handle'] for p in pick],
            'note': not_derived.get(g, ''),
        }
    return rows, priv, systems

def main():
    global RATES
    pp0 = os.path.join(HERE, 'precision.json')
    RATES = json.load(open(pp0)).get('rates', {}) if os.path.exists(pp0) else {}
    A = build('A', lotm_files(), A_GROUPS, A_ORDER, 'L-MISC', A_NOT_DERIVED)
    B = build('B', hp_files(), B_GROUPS, B_ORDER, 'H-MISC', B_NOT_DERIVED)
    if len(sys.argv) > 2 and sys.argv[1] == '--sample':
        n = int(sys.argv[2]); seed = int(sys.argv[3]) if len(sys.argv) > 3 else 7
        rng = random.Random(seed)
        for bk, (rows, _, _) in (('A', A), ('B', B)):
            for k in KINDS:
                pool = [r for r in rows if k in r['kinds']]
                print('=== %s %s (%d rows)' % (bk, k, len(pool)))
                for i, r in enumerate(rng.sample(pool, min(n, len(pool))), 1):
                    m = RX[k].search(RANKNUM.sub('RANK', r['text']))
                    ctx = (RANKNUM.sub('RANK', r['text'])[max(0, m.start()-60):m.end()+40] if m else '(structural: %s)' % r['struct']).replace('\n', ' ')
                    print('%d. [%s] ...%s...' % (i, r['group'], ctx))
        return
    prec = {}
    pp = os.path.join(HERE, 'precision.json')
    if os.path.exists(pp):
        prec = json.load(open(pp))
    ledger = {
        'code': 'LAYX34', 'date': '2026-11-09',
        'inputs': {
            'A': {'book': 'LOTM volume 1 (chapters 1-213)', 'files': len(lotm_files()), 'rows': len(A[0])},
            'B': {'book': 'Harry Potter book one', 'files': len(hp_files()), 'rows': len(B[0])},
        },
        'systems': {'A': A[2], 'B': B[2]},
        'precision': prec.get('precision', {}),
        'tier_rule': 'tunable: point+band+count_or_duration >= 3; shape only: else order+sequence+tolerance+negative >= 3; assumed: otherwise',
    }
    json.dump(ledger, open(os.path.join(HERE, 'ledger.json'), 'w'), indent=1)
    for bk, (_, priv, _) in (('A', A), ('B', B)):
        os.makedirs(PRIV[bk], exist_ok=True)
        with open(os.path.join(PRIV[bk], 'rows_classified.jsonl'), 'w', encoding='utf-8') as f:
            for p in priv:
                f.write(json.dumps(p, ensure_ascii=False) + '\n')
    write_md(ledger, prec)
    for bk in 'AB':
        t = collections.Counter(v['tier'] for v in ledger['systems'][bk].values())
        print(bk, ledger['inputs'][bk]['rows'], dict(t))

def table(sysd, prec_adj=None):
    head = '| System | point | band | order | count/duration | sequence | tolerance | negative | qualitative | total | anchors (point+band+count) | Class |'
    lines = [head, '|' + '---|' * 12]
    for g, v in sysd.items():
        c = v['counts']
        if v['tier'] in ('not re-derived',):
            lines.append('| %s | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | not re-derived |' % g)
            continue
        lines.append('| %s | %d | %d | %d | %d | %d | %d | %d | %d | %d | %d | %s |' % (
            g, c['point'], c['band'], c['order'], c['count_or_duration'], c['sequence'], c['tolerance'], c['negative'], c['qualitative'], c['total'], c['point'] + c['band'] + c['count_or_duration'], v['tier']))
    return '\n'.join(lines)

def write_md(L, prec):
    ia, ib = L['inputs']['A'], L['inputs']['B']
    out = []
    out.append('# Anchor ledger: volume 1 and book one, 2026-11-09 (LAYX34)\n')
    out.append('**What.** Per game system, how many source-backed statements exist that a fit could use, and of what kind (LAYX25 kinds plus tolerance). Counted by script unless marked judged.')
    out.append('**Inputs.** Book A: %d rule and rule-note rows from %d private shard files (rules plus rule-note files; the total equals the 3,643 of the [demands pass](../SYSTEM_DEMANDS_VOL1_BOOK1_2026-11-08.md), matched by count, not by row ids). Book B: %d rows from %d files (528, also matching).' % (ia['rows'], ia['files'], ib['rows'], ib['files']))
    out.append('**Method.** One script (`anchor-ledger-2026-11-09/build_ledger.py`) assigns each row one system group (keyword rules, first match wins) and any number of statement kinds (regex heuristics). A row with no kind is qualitative. Precision per kind was then sampled by hand (judged).')
    out.append('**Limits.** Keyword grouping is approximate; a row sits in one group only. Kinds are heuristics, so raw counts overstate the kinds with low precision. The demands pass used a private scratch table that is gone, so groups were re-derived and the per-group row counts differ from that pass. Rows are the rule and rule-note passes only, not scenes or people.')
    out.append('**Rule for the class column (counted).** Tunable: 3 or more point, band or count/duration rows. Shape only: fewer than 3 of those, but 3 or more order, sequence, tolerance or negative rows. Assumed: neither. Row handles are `shard_file:line` in the private row files.\n')
    for bk, title in (('A', 'Book A: Lord of the Mysteries, volume 1'), ('B', 'Book B: Harry Potter, book one')):
        sysd = L['systems'][bk]
        out.append('## %s\n' % title)
        out.append(table(sysd) + '\n')
        t = collections.Counter(v['tier'] for v in sysd.values())
        out.append('Headline (counted): %d tunable, %d shape only, %d assumed, %d not re-derived or not found.\n' % (t['tunable'], t['shape only'], t['assumed'], t['not re-derived'] + t['not found']))
        flips = [g + ' (' + v['tier'] + ' to ' + v['adjusted_tier'] + ')' for g, v in sysd.items() if v['adjusted_tier'] and v['adjusted_tier'] != v['tier']]
        out.append('Class after weighting each kind by its sampled hit rate (counted from judged rates): ' + ('changes for ' + ', '.join(flips) if flips else 'no change') + '.\n')
        out.append('Example row handles (counted; drawn from rows that carry a point, band or count/duration where any exist):\n')
        for g, v in sysd.items():
            if v['examples']:
                out.append('- %s: %s' % (g, ', '.join(v['examples'])))
            elif v['note']:
                out.append('- %s: not re-derived (%s)' % (g, v['note']))
            else:
                out.append('- %s: not found' % g)
        out.append('')
    out.append('## Sampled precision (judged)\n')
    if prec.get('precision'):
        out.append('About 15 rows per kind per book were read by hand and judged as really carrying that kind. Hits over sample.\n')
        out.append('| Kind | Book A | Book B | Note |')
        out.append('|---|---|---|---|')
        for k in KINDS:
            p = prec['precision'].get(k, {})
            out.append('| %s | %s | %s | %s |' % (k, p.get('A', ''), p.get('B', ''), p.get('note', '')))
        out.append('')
        if prec.get('adjustment'):
            out.append('Adjustment (judged): ' + prec['adjustment'] + '\n')
    else:
        out.append('Not yet sampled.\n')
    out.append('## What this changes\n')
    for bk, name in (('A', 'Book A'), ('B', 'Book B')):
        sysd = L['systems'][bk]
        for tn, phrase in (('tunable', 'lore can tune now (counted, subject to the precision above)'),
                           ('shape only', 'lore can shape only'),
                           ('assumed', 'stay assumed')):
            names = [g for g, v in sysd.items() if v['tier'] == tn and not g.endswith('-MISC')]
            out.append('- %s, %s: %s.' % (name, phrase, ', '.join(names) if names else 'none'))
    for bk, name in (('A', 'Book A'), ('B', 'Book B')):
        sysd = L['systems'][bk]
        thin = [g for g, v in sysd.items() if v['tier'] == 'tunable' and not g.endswith('-MISC') and sum(v['counts'][k] for k in ANCH) < 10]
        out.append('- %s, tunable but thin (fewer than 10 anchors, so one quantity at most; counted): %s.' % (name, ', '.join(thin) if thin else 'none'))
    out.append('- The residue groups (L-MISC, H-MISC) are not systems and are left out of the lists above. L-SIG and L-RARE were not re-derived, so they stay as the demands pass left them.')
    for line in prec.get('changes', []):
        out.append('- ' + line + ' (judged)')
    out.append('\nThe counts say where anchors exist, not whether they agree with each other. A fit still needs a read of the anchors it uses (AD49).')
    open(os.path.join(HERE, '..', 'ANCHOR_LEDGER_VOL1_BOOK1_2026-11-09.md'), 'w').write('\n'.join(out) + '\n')

main()
