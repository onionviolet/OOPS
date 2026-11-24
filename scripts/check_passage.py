#!/usr/bin/env python3 -I
"""Find local RI passages for a Gu gap card. Output can contain private novel text."""
import argparse
import importlib.util
import json
import os
from pathlib import Path
import re
import sys
import tempfile
from urllib.parse import unquote

# Isolated Python does not put this script's directory on sys.path.
sys.dont_write_bytecode = True
os.environ.setdefault('CHAPTER_SOURCE_ROOT', str(Path(__file__).resolve().parents[1]))
spec = importlib.util.spec_from_file_location(
    'rank_pass', Path(__file__).with_name('gu_fulltext_rank_pass.py')
)
rank_pass = importlib.util.module_from_spec(spec)
spec.loader.exec_module(rank_pass)
ctp = rank_pass.ctp

COVERAGE = Path(ctp.ROOT) / 'docs/coverage'
PRIVATE = Path(ctp.SRC) / 'docs/research/advancement-aspects-2026-11-16/private'
CACHE = PRIVATE / 'check_passage_ri_v1.json'
SOURCE = Path(ctp.NOV) / 'reverend-insanity/private/source'
LEDGERS = ('gu_kinds', 'gu_moves')
TAGS = ('fact', 'mention', 'collision', 'hypothesis')
HEDGE = re.compile(r'\b(?:perhaps|maybe|might|could it be|I guess)\b', re.I)
SENTENCE = re.compile(r'[^.!?]+[.!?]*')
EFFECT = re.compile(
    r"^(?:['’]s\s+(?:ability|effect)\s+(?:is|was)\b"
    r'|[, ]+(?:(?:which|it)\s+)?(?:also\s+)?'
    r'(?:can|could|allows?|is used to|was used to|is able to|was able to)\s+\w'
    r'|[^;]{0,100},\s+(?:it\s+(?:can|could|allows?)|its\s+(?:ability|effect)\s+(?:is|was))\s+\w)',
    re.I,
)
TYPE = re.compile(
    r'^\s*,?\s*(?:(?:is|was|are|were)\s+)?(?:an?|the)\s+'
    r'((?:[a-z-]+\s+){0,2}(?:path|storage|healing|attack|defensive|movement|'
    r'investigative|support|expendable|consumable|mortal|immortal))\s+Gu\b', re.I,
)
RECIPE_BEFORE = re.compile(
    r'\b(?:core|component|ingredient|material|support)\b[^,;:]{0,25}'
    r'\b(?:of|for|in)\s+(?:(?:the|a)\s+)?$', re.I,
)
RECIPE_AFTER = re.compile(
    r"^(?:\s+killer move\b)?\s+(?:(?:already|also)\s+)?"
    r"(?:requires?|required|needs?|needed|uses?|used|consists? of|consisted of|"
    r"comprises?|comprised|combines?|combined|is made up of)\b[^;]*?\bGu\b", re.I,
)
RECIPE_ROLE = re.compile(
    r'^\s+(?:(?:is|was|were|served as|acts? as|was used as)\s+)?(?:an?|the)\s+'
    r'(?:(?:main|core|supporting|supplementary)\s+)?'
    r'(?:core|component|ingredient|material|support)\s+(?:of|for|in)\b', re.I,
)


def read_json(path):
    with path.open(encoding='utf-8') as source:
        return json.load(source)


def optional_json(path):
    try:
        return read_json(path)
    except FileNotFoundError:
        return {}


def load_text():
    files = sorted(p for p in SOURCE.glob('ri*.html') if re.fullmatch(r'ri\d+\.html', p.name))
    if not files:
        raise FileNotFoundError(f'Private Reverend Insanity text is absent at {SOURCE}')
    signature = []
    for path in files:
        stat = path.stat()
        signature.append([path.name, stat.st_size, stat.st_mtime_ns])
    try:
        cached = read_json(CACHE)
        if cached['sources'] == signature and cached['paragraphs']:
            return cached['paragraphs']
    except (OSError, ValueError, KeyError, TypeError):
        pass

    paragraphs = ctp.load_ri()
    if not paragraphs:
        raise ValueError(f'No numbered paragraphs could be read from {SOURCE}')
    PRIVATE.mkdir(parents=True, exist_ok=True)
    target = tempfile.NamedTemporaryFile(mode='w', encoding='utf-8', dir=PRIVATE,
                                         prefix='.check_passage_ri_', delete=False)
    temporary = Path(target.name)
    try:
        with target:
            json.dump({'sources': signature, 'paragraphs': paragraphs}, target,
                      ensure_ascii=False, separators=(',', ':'))
        temporary.replace(CACHE)
    finally:
        temporary.unlink(missing_ok=True)
    return paragraphs


def read_ledger(ledger):
    with (COVERAGE / f'{ledger}.jsonl').open(encoding='utf-8') as source:
        return {row['id']: row for row in (json.loads(line) for line in source if line.strip())}


def display_name(row):
    if row.get('name'):
        return row['name']
    # Wiki page names preserve more detail than normalized IDs. Saga slugs are
    # the fallback for rows with no Fandom page or explicit name.
    wiki = re.search(r'/wiki/([^?;\s]+)', row['source'])
    if wiki:
        return re.sub(r'\s+\(Killer Move\)$', '', unquote(wiki[1]).replace('_', ' '), flags=re.I)
    slug = re.search(r'sagaofgu\.com/(?:gu|moves)/([^/;\s]+)', row['source'])
    return (slug[1] if slug else row['id'].split(':', 1)[-1]).replace('-', ' ').replace('_', ' ').title()


def search_terms(names, kinds):
    terms = {}
    for name in names:
        name = ctp.norm(name).strip()
        variants = sorted(ctp.gu_terms(name)) if kinds else []
        for term in (name, *variants):
            if term:
                terms.setdefault(term.lower(), term)
    return sorted(terms.values(), key=lambda term: (-len(term), term.lower()))


def term_pattern(term):
    return rf'(?<!\w){re.escape(term)}(?:s)?(?!\w)'


def query_patterns(terms, ledgers, aliases):
    # Only longer names containing a query term can collide. Resolve whole
    # occurrences against those names, so a genuine mention elsewhere survives.
    query = re.compile('|'.join(map(term_pattern, terms)), re.I)
    wanted = {term.lower() for term in terms}
    longer = set()
    for ledger, rows in ledgers.items():
        for row_id, row in rows.items():
            names = [display_name(row), *aliases.get(row_id, ())]
            for name in search_terms(names, ledger == 'gu_kinds'):
                if name.lower() not in wanted and query.search(name):
                    longer.add(name.lower())
    collisions = re.compile('|'.join(map(term_pattern, sorted(longer, key=lambda t: (-len(t), t)))), re.I) if longer else None
    return query, collisions


def same_name_prefix(text, start):
    """Use clean_left for an unlisted, adjacent capitalized name fragment."""
    left_word = re.search(r"([\w'’]+)\s+$", text[:start])
    if not left_word or not left_word[1][0].isupper():
        return False
    # Sentence-start words may be ordinary subjects or appositives.
    if not text[:left_word.start()].strip():
        return False
    return not rank_pass.clean_left(text, start) and not re.search(
        rf'\brank[- ]{rank_pass.NUM}\s+(?:(?:im)?mortal\s+)?$', text[:start], re.I
    )


def sentence_hits(sentence, quoted, terms, query, collisions):
    longer_names = list(collisions.finditer(sentence)) if collisions else []
    hypothesis = quoted and (sentence.rstrip().endswith('?') or HEDGE.search(sentence))
    hits = list(query.finditer(sentence))
    for hit in hits:
        term = hit.group()
        covered = any(other.start() <= hit.start() and hit.end() <= other.end()
                      for other in longer_names)
        if covered or same_name_prefix(sentence, hit.start()):
            yield (0, term, 'collision', {})
            continue
        if hypothesis:
            yield (2, term, 'hypothesis', {})
            continue

        before, after = sentence[:hit.start()], sentence[hit.end():]
        # The rank helper scores all appearances of a term in its input.
        # Mask the other appearances so only this occurrence can earn a rank.
        rank_text = sentence
        for other in reversed(hits):
            if other != hit and other.group().lower() == term.lower():
                rank_text = rank_text[:other.start()] + ('_' * len(term)) + rank_text[other.end():]
        bound = rank_pass.ranks_in(rank_text, term)
        ranks = sorted({item[0] for item in bound})
        types = {item[2] for item in bound if len(item) > 2 and item[2]}
        type_hit = TYPE.match(after)
        if type_hit:
            types.add(type_hit[1])
        signals = []
        score = 1
        if ranks:
            signals.append('rank')
            score += 6
        if types:
            signals.append('type')
            score += 2
        if EFFECT.match(after):
            signals.append('effect')
            score += 3
        if RECIPE_BEFORE.search(before) or RECIPE_AFTER.match(after) or RECIPE_ROLE.match(after):
            signals.append('recipe')
            score += 4
            # Prefer an actual list over a statement that the recipe uses Gu.
            score += min(3, len(re.findall(r'\bGu\s*,', after, re.I)))
        details = {'signals': signals, 'ranks': ranks, 'types': sorted(types)}
        yield (score, term, 'fact' if signals else 'mention', details)

    if rank_pass.LIST.match(sentence):
        for term in terms:
            ranks = rank_pass.list_ranks(sentence, term)
            if ranks:
                details = {'signals': ['rank'], 'ranks': [ranks[0][0]], 'types': []}
                yield (2, term, 'hypothesis', {}) if hypothesis else (7, term, 'fact', details)


def classify(paragraph, terms, lower_terms, query, collisions):
    normalized = ctp.norm(paragraph)
    lower = normalized.lower()
    if not any(term in lower for term in lower_terms) and not rank_pass.LIST.match(paragraph.lstrip(' "“')):
        return None
    text = normalized.replace('“', '"').replace('”', '"')

    def candidates():
        for index, segment in enumerate(text.split('"')):
            for match in SENTENCE.finditer(segment):
                yield from sentence_hits(match.group(), index % 2, terms, query, collisions)

    # One tag per paragraph. A clean hit beats a collision, and an explicit
    # claim beats a guess. A rank or a recipe with several named parts sorts first.
    return max(candidates(), key=lambda hit: (hit[0], len(hit[1])), default=None)


def existing_evidence(ledger, row_id):
    evidence = dict(chapterTier=None, wikiTier=None, fulltextRanks=None)
    if row_id is None:
        return evidence
    chapter = optional_json(COVERAGE / 'chapter_tier_labels.json')
    evidence['chapterTier'] = chapter.get(ledger, {}).get(row_id)
    if ledger == 'gu_kinds' and row_id in chapter.get('effect_unknown', {}):
        evidence['chapterTier'] = {
            **(evidence['chapterTier'] or {}),
            'effectUnknown': chapter['effect_unknown'][row_id],
        }
    evidence['wikiTier'] = optional_json(COVERAGE / 'wiki_tier_labels.json').get(ledger, {}).get(row_id)
    if ledger == 'gu_kinds':
        evidence['fulltextRanks'] = optional_json(Path(ctp.PRIV) / 'fulltext_gu_ranks.json').get('rows', {}).get(row_id)
    return evidence


def check(args, chapter_range):
    ledgers = {ledger: read_ledger(ledger) for ledger in LEDGERS}
    aliases = ctp.alias_names()
    row = None
    if args.id:
        row = ledgers[args.ledger].get(args.id)
        if row is None:
            raise ValueError(f'Unknown row {args.id!r} in {args.ledger}')
        name = display_name(row)
        names = [name, *sorted(aliases.get(args.id, ()))]
    else:
        name, names = args.name, [args.name, *args.alias]

    terms = search_terms(names, args.ledger != 'gu_moves')
    if not terms:
        raise ValueError('Supply a nonempty name or alias')
    query, collisions = query_patterns(terms, ledgers, aliases)
    lower_terms = [term.lower() for term in terms]
    matches = []
    counts = dict.fromkeys(TAGS, 0)
    top_fact, top_score = None, -1
    for chapter, paragraph, text in load_text():
        if chapter_range and not chapter_range[0] <= chapter <= chapter_range[1]:
            continue
        result = classify(text, terms, lower_terms, query, collisions)
        if result is None:
            continue
        score, term, tag, details = result
        match = {
            'locator': f'ri:ch{chapter}:p{paragraph}', 'chapter': chapter, 'paragraph': paragraph,
            'term': term, 'tag': tag, 'text': text, **details,
        }
        matches.append(match)
        counts[tag] += 1
        if tag == 'fact' and score > top_score:
            top_fact, top_score = match, score
    return {
        'schemaVersion': 1, 'ledger': args.ledger if row else None, 'id': args.id, 'name': name,
        'state': row['state'] if row else None, 'terms': terms, 'chapterRange': chapter_range,
        'counts': counts, 'topFact': top_fact, 'matches': matches,
        'evidence': existing_evidence(args.ledger, args.id),
    }


def self_test():
    ledgers = {
        'gu_kinds': {'remnant': {'name': 'Remnant Life Gu'}, 'great': {'name': 'Great Thief Immortal Gu'}},
        'gu_moves': {},
    }
    cases = [
        ('A rank two Plunder Gu appeared.', 'Plunder Gu', 'fact', 'rank'),
        ('Plunder Gu, a rank two storage Gu.', 'Plunder Gu', 'fact', 'type'),
        ('Plunder Gu can steal a worm.', 'Plunder Gu', 'fact', 'effect'),
        ('He looked at Plunder Gu.', 'Plunder Gu', 'mention', None),
        ('Remnant life Gu was a rank five expendable Gu.', 'Life Gu', 'collision', None),
        ('"Rank seven great thief Gu?" he asked.', 'Thief Gu', 'collision', None),
        ('He brought the Forgotten Life Gu.', 'Life Gu', 'collision', None),
        ('"Perhaps Plunder Gu can steal a worm," he said.', 'Plunder Gu', 'hypothesis', None),
        ('"Is Plunder Gu rank two?" he asked.', 'Plunder Gu', 'hypothesis', None),
        ('"Maybe he fled." Plunder Gu was rank two.', 'Plunder Gu', 'fact', 'rank'),
        ('Remnant life Gu was rare, but Life Gu was rank one.', 'Life Gu', 'fact', 'rank'),
        ('He used Life Gu. Another Gu can steal a worm.', 'Life Gu', 'mention', None),
        ('Rank six Immortal Gu: Unravel Mystery, Blood Asset, Bone Spike.', 'Blood Asset Gu', 'fact', 'rank'),
        ('Rank six Immortal Gu: Blood Asset Gu, Bone Spike.', 'Blood Asset Gu', 'fact', 'rank'),
        ('"Rank six Immortal Gu: Unravel Mystery, Blood Asset, Bone Spike."', 'Blood Asset Gu', 'fact', 'rank'),
        ('Using Myriad Self needed Self Strength Gu and Pulling Water Gu.', 'Myriad Self', 'fact', 'recipe'),
        ('Cleanse Soul Immortal Gu was a core of Myriad Self.', 'Myriad Self', 'fact', 'recipe'),
        ('Cleanse Soul Immortal Gu was used as a core for the move.', 'Cleanse Soul Immortal Gu', 'fact', 'recipe'),
    ]
    for sentence, term, expected, signal in cases:
        query, collisions = query_patterns([term], ledgers, {})
        result = classify(sentence, [term], [term.lower()], query, collisions)
        assert result and result[2] == expected, (sentence, expected, result)
        if signal:
            assert signal in result[3]['signals'], (sentence, signal, result)
    print(f'self-test ok ({len(cases)} cases)')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    identity = parser.add_mutually_exclusive_group(required=True)
    identity.add_argument('--id', help='Ledger row ID')
    identity.add_argument('--name', help='Name to find in the novel')
    identity.add_argument('--self-test', action='store_true')
    parser.add_argument('--ledger', choices=LEDGERS, default=None, help='Default for --id: gu_kinds')
    parser.add_argument('--alias', action='append', default=[], help='Additional name, repeatable with --name')
    chapters = parser.add_mutually_exclusive_group()
    chapters.add_argument('--chapter', type=int, metavar='N')
    chapters.add_argument('--chapters', metavar='A-B')
    parser.add_argument('--json', action='store_true', help='Local atlas JSON, including private passage text')
    args = parser.parse_args()
    if args.self_test:
        self_test()
        return 0
    if (args.alias and not args.name) or (args.ledger and not args.id):
        parser.error('--alias requires --name and --ledger requires --id')
    args.ledger = args.ledger or 'gu_kinds'
    chapter_range = None
    if args.chapters is not None:
        interval = re.fullmatch(r'([0-9]+)-([0-9]+)', args.chapters)
        if not interval or not 1 <= int(interval[1]) <= int(interval[2]):
            parser.error('--chapters requires a positive inclusive range A-B')
        chapter_range = [int(part) for part in interval.groups()]
    if args.chapter is not None:
        if args.chapter < 1:
            parser.error('--chapter must be positive')
        chapter_range = [args.chapter, args.chapter]
    try:
        result = check(args, chapter_range)
    except (OSError, ValueError) as error:
        print(f'check_passage: {error}', file=sys.stderr)
        return 1
    if args.json:
        print(json.dumps(result, ensure_ascii=False))
    else:
        print(result['name'], '|', ', '.join(f'{tag}={n}' for tag, n in result['counts'].items()))
        if result['id']:
            print('Ledger:', result['ledger'], result['id'], result['state'])
            for tier, record in result['evidence'].items():
                print(f'{tier}:', json.dumps(record, ensure_ascii=False) if record is not None else 'no record')
        if result['topFact']:
            print('Top fact:', result['topFact']['locator'])
        for match in result['matches']:
            print(f"[{match['locator']}] {match['tag']} ({match['term']}) {match['text']}")
    return 0


if __name__ == '__main__':
    sys.exit(main())
