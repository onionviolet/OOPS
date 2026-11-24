#!/usr/bin/env python3 -I
"""Build WA23 slot observations for a second reader. No passage text is emitted.

Run with python3 -I. CHAPTER_SOURCE_ROOT can point at the private RI sources.
The JS contract test and --self-test do not need the private sources.
"""
import argparse
from collections import Counter, defaultdict
import importlib.util
import json
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[1]
COVERAGE = ROOT / "docs/coverage"
OUTPUT = COVERAGE / "evidence" / "gu_move_slots.jsonl"  # outside the ledger sweep: coverage scripts read docs/coverage/*.jsonl as ledgers


def load_script(name):
    spec = importlib.util.spec_from_file_location(name, ROOT / "scripts" / f"{name}.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


chapter_tools = load_script("chapter_tier_packets")
from_chapters = chapter_tools.load_ri
gu_terms = chapter_tools.gu_terms
alias_names = chapter_tools.alias_names
norm = chapter_tools.norm
clean_left = load_script("gu_fulltext_rank_pass").clean_left


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def ledger(name):
    return {row["id"]: row for row in map(json.loads, (COVERAGE / f"{name}.jsonl").read_text(encoding="utf-8").splitlines())}


def key(name):
    return " ".join(norm(name).casefold().replace("‐", "-").replace("–", "-").split())


class GuNames:
    def __init__(self, identities, aliases):
        self.exact = defaultdict(set)
        self.aliases = defaultdict(set)
        self.display = {}
        for gu, names in identities.items():
            direct = set(names)
            self.display[gu] = names[0]
            for name in direct:
                self.exact[key(name)].add(gu)
            for name in direct | set(aliases.get(gu, ())):
                forms = {name, *gu_terms(name)}
                for form in forms:
                    self.aliases[key(form)].add(gu)
                    bare = re.sub(r"\s+(?:Immortal\s+)?Gu$", "", form, flags=re.I)
                    for suffix in ("", " Gu", " Immortal Gu"):
                        self.aliases[key(bare + suffix)].add(gu)

    def resolve(self, name):
        direct = self.exact.get(key(name), set())
        matches = direct or self.aliases.get(key(name), set())
        if len(matches) == 1:
            return next(iter(matches)), "exact" if direct else "alias"
        return None, "collision" if matches else "unresolved"


def page_title(url):
    return unquote(urlsplit(url).path.rstrip("/").rsplit("/", 1)[-1]).replace("_", " ").strip()


def indexed_names(record):
    return list(dict.fromkeys(record[src]["name"] for src in ("fandom", "saga")
                              if (record.get(src) or {}).get("name")))


def get_gu_names(kinds, index, aliases):
    indexed = {r["id"]: indexed_names(r) for r in index["records"]}
    identities = {}
    for gu, row in kinds.items():
        if row["state"].startswith("not-a-thing"):
            continue
        names = indexed.get(gu) or [page_title(url) for url in row["source"].split("; ")
                                   if "fandom.com/wiki/" in url]
        if names:
            identities[gu] = names
    return GuNames(identities, aliases)


def observation(move, variant, role, name, locator, tier, names, order=None):
    gu, resolution = (None, "unresolved") if role == "unnamed" else names.resolve(name)
    return dict(move=move, variant=variant, role=role, gu=gu, name=name, locator=locator,
                tier=tier, orderStated=order is not None, order=order, resolution=resolution)


NOTE_ROLES = re.compile(r"([\w:.-]+) \((core|support|other)\)")
VARIANT_LABEL = re.compile(
    r"\b(?:v(?:ersion)?\s*\d+|(?:first|second|third|original|modified) version)\b", re.I
)
UNNAMED = re.compile(
    r"^(?:(?:all kinds of|about a thousand|a thousand|several|many|countless|other|"
    r"unnamed|unspecified|main|three|four|two|one)\s+)?(?:[\w-]+ path\s+)*(?:rank \w+\s+)?"
    r"(?:(?:immortal|mortal)\s+)?Gu(?: worms)?$",
    re.I,
)


def wiki_slots(moves, labels, names, indexed):
    for move, entry in labels.items():
        if move not in moves:
            continue
        components = entry.get("components", [])
        for component in components:
            locator = component["locator"]
            # Some wiki labels cite the section without the prefix.
            if ":" not in locator and "#" in locator:
                locator = "wiki:" + locator
            if not locator.startswith("wiki:") or "#" not in locator:
                continue
            role = component["role"]
            if role == "other":
                role = component.get("second")
            if role not in {"core", "support"}:
                continue
            gu = component.get("kind")
            name = component.get("name") or names.display.get(gu) or next(iter(indexed.get(gu, ())), None)
            if not name:
                continue
            if not gu and UNNAMED.fullmatch(name):
                role = "unnamed"
            section = locator.partition("#")[2]
            version = VARIANT_LABEL.search(section)
            variant = None
            if version:
                label = section if version[0].lower() == "modified version" else version[0]
                variant = "wiki-" + re.sub(r"[^a-z0-9]+", "-", label.lower()).strip("-")
            yield observation(move, variant, role, name, locator, "wiki", names)

    # The ledger note mirrors the labels today. Preserve note-only roles if the
    # label drops one, without creating a second observation for the same lead.
    for move, row in moves.items():
        if row["state"] != "blocked:roles-unchecked":
            continue
        labelled = {(c.get("kind"), c["role"]) for c in labels.get(move, {}).get("components", [])
                    if c["locator"].startswith("wiki:")}
        page = next((page_title(url) for url in row["source"].split("; ") if "fandom.com/wiki/" in url), None)
        if not page:
            continue
        note = row["note"].partition("the wiki-tier label names ")[2]
        for gu, role in NOTE_ROLES.findall(note):
            if (gu, role) in labelled or role == "other" or gu not in names.display:
                continue
            yield observation(move, None, role, names.display[gu], f"wiki:{page}#intro", "wiki", names)


# Move IDs and source-page titles are names, but only use multiword forms (or
# one-word names adjacent to "killer move") to avoid matching ordinary nouns.
def move_names(moves):
    by_name = defaultdict(set)
    for move, row in moves.items():
        titles = [page_title(url).replace("-", " ") if "sagaofgu.com" in url else page_title(url)
                  for url in row["source"].split("; ")
                  if "sagaofgu.com/moves/" in url or "fandom.com/wiki/" in url]
        for title in titles or [move.removeprefix("lead:").replace("-", " ")]:
            name = key(re.sub(r"\s*\([^)]*\)$", "", title))
            if name:
                by_name[name].add(move)
    return by_name


def move_pattern(by_name):
    terms = []
    for name in sorted(by_name, key=lambda s: (-len(s), s)):
        term = re.escape(name).replace(r"\ ", r"[\s-]+")
        if " " not in name:
            term = rf"(?<=killer move ){term}|{term}(?= killer move)"
        terms.append(term)
    return re.compile(r"(?<![\w-])(?:" + "|".join(terms) + r")(?![\w-])", re.I)


RANK = r"rank[- ](?:one|two|three|four|five|six|seven|eight|nine|[1-9])"
DESCRIPTOR = re.compile(rf"^(?:(?:the|a|an|and|or|including|legendary|your|this|{RANK})\s+)+", re.I)
NAME_FORM = re.compile(r"[\w]+(?:[’'-][\w]+)*(?:\s+[\w]+(?:[’'-][\w]+)*){0,7}$")
TAIL = re.compile(r"\s+(?:at its core|as (?:the |a |its )?core|were? also|could|would|which|that|"
                  r"to (?:form|create|use|produce|activate)|of this move|in this move)\b.*", re.I)
LIST = re.compile(r",\s*(?:and\s+|as well as\s+)?|\s+(?:and|as well as)\s+", re.I)
ROLE_LIST = re.compile(
    r"\b(?P<role>core|supplementary|supporting)\s+(?:(?:immortal|mortal)\s+)?"
    r"Gu(?: worms)?\s+(?:was|were|is|are|included|consisted of)\s+(?P<names>[^;.!?]+)", re.I,
)
USED_CORE = re.compile(
    rf"\b(?:use[ds]?|using)\s+(?P<names>[\w'’ -]{{1,90}}? Gu)\s+as\s+"
    rf"(?:(?:the|its|a|their|main|sole)\s+)*core\b", re.I,
)
GU_AS_CORE = re.compile(
    r"(?P<names>[\w'’-]+(?:\s+[\w'’-]+){0,6}\s+Gu)\s+as\s+"
    r"(?:(?:the|its|a|their|main|sole)\s+)*core\b", re.I,
)
ORDINAL = re.compile(r"\b(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth)\s*,\s+", re.I)
ORDINALS = "first second third fourth fifth sixth seventh eighth ninth".split()
ROLE_CUE = re.compile(r"\b(?:core|supplementary|supporting)\b", re.I)


def list_slots(raw, role, names, allow_bare=False):
    # A trailing modifier or new clause is separate from the enumerated names.
    raw = TAIL.sub("", raw).strip()
    # Treat "two rank seven Immortal Gu — X and Y" as names, with the
    # generic prefix describing the names rather than adding another slot.
    raw = re.sub(r"^.*?\bGu(?: worms)?\s*[—–:]\s*", "", raw, flags=re.I)
    ordinals = list(ORDINAL.finditer(raw))
    if ordinals and ordinals[0].start() == 0:
        chunks = [(raw[match.end():ordinals[i + 1].start() if i + 1 < len(ordinals) else len(raw)],
                   ORDINALS.index(match[1].lower()) + 1) for i, match in enumerate(ordinals)]
    else:
        chunks = [(raw, None)]
    for chunk, order in chunks:
        # An ordinal in prose supplies a position for a single name only.
        entries = [item.strip() for item in LIST.split(chunk) if item.strip()]
        for item in entries:
            yield from parse_slot_name(item, role, names, allow_bare, order if len(entries) == 1 else None)


def parse_slot_name(item, role, names, allow_bare, order):
    name = DESCRIPTOR.sub("", item.strip())
    if not NAME_FORM.fullmatch(name):
        return
    if UNNAMED.fullmatch(name):
        yield "unnamed", name, order
        return
    if not allow_bare and not re.search(r"\bGu$", name, re.I):
        return
    gu, resolution = names.resolve(name)
    # Unlisted words in a role clause are often descriptions ("of wisdom
    # path") rather than names. Keep an unknown only in the explicit Gu form.
    if not gu and resolution != "collision" and not (
        re.search(r"\S+\s+Gu$", name, re.I) and
        not re.search(r"\b(?:were|was|is|would|could|had|have|has|used|other|its|of|with|to|being)\b", name, re.I)
    ):
        return
    yield role, name, order


def starts_name(text, offset):
    before = text[:offset].rstrip()
    if before and not re.search(r"[\w.,;:!?\"'()\[\]–—-]$", before):
        return True
    return clean_left(text, offset)


# The first refers to an unnamed method of the tower; the second is a
# separate formation derived from the pool's design.
NON_SLOT_CONTEXTS = {("lead:heaven_overseeing_tower", 1960, 15), ("lead:regret_pool", 1912, 50)}


def chapter_slots(chapters, moves, names, curated_locators):
    by_name = move_names(moves)
    match_move = move_pattern(by_name)
    previous_chapter, previous_p, active = None, 0, set()
    candidates = {(ch, p) for ch, p, text in chapters if ROLE_CUE.search(text)}
    for chapter, p, text in chapters:
        if (chapter, p) not in candidates and (chapter, p + 1) not in candidates:
            continue
        if chapter != previous_chapter or p - previous_p != 1:
            active = set()
        previous_chapter, previous_p = chapter, p
        locator = f"ri:ch{chapter}:p{p}"
        has_mention = False
        for sentence in re.split(r"(?<=[.!?])\s+", norm(text)):
            mentions = set()
            matches = list(match_move.finditer(sentence))
            for match in matches:
                name = key(re.sub(r"[\s-]+", " ", match[0]))
                ids = by_name.get(key(match[0])) or by_name.get(name, ())
                after = sentence[match.end():]
                # A shared Gu/move name followed by a Gu suffix names the Gu.
                left = sentence[:match.start()]
                name_boundary = starts_name(sentence, match.start()) or re.search(r"\bkiller move\s+$", left, re.I)
                if ids and name_boundary and not re.match(r"\s+(?:immortal\s+)?Gu\b", after, re.I):
                    mentions.add(frozenset(ids))
            if mentions:
                active = mentions
                has_mention = True
            # Nearby move context is accepted only for explicit role lists.
            # A use statement needs that move in the same sentence.
            if locator in curated_locators or len(active) != 1:
                continue
            hits = [(m["role"], m["names"], True) for m in ROLE_LIST.finditer(sentence)
                    if mentions or re.fullmatch(r"\W*(?:its|the)\s+", sentence[:m.start()], re.I)]
            if len(mentions) == 1:
                direct_hits = [("core", m["names"], False) for m in USED_CORE.finditer(sentence)]
                hits.extend(direct_hits)
                for match in () if direct_hits else GU_AS_CORE.finditer(sentence):
                    # The reverse pattern is used only with a known name at
                    # the end of the clause, not as an unknown-name guess.
                    words = match["names"].split()
                    for start in range(len(words) - 1):
                        name = " ".join(words[start:])
                        pos = sentence.rfind(name, match.start(), match.end())
                        if names.resolve(name)[0] and starts_name(sentence, pos):
                            hits.append(("core", name, False))
                            break
            for role, raw, allow_bare in hits:
                for slot_role, name, order in list_slots(raw, "core" if role.lower() == "core" else "support", names, allow_bare):
                    for move in next(iter(active)):
                        if move == "lead:gu_formation" or (move, chapter, p) in NON_SLOT_CONTEXTS:
                            continue
                        variant = f"modified@ch{chapter}" if re.search(
                            r"\b(?:simplified version|not the original version)\b", sentence, re.I) else None
                        yield observation(move, variant, slot_role, name, locator, "chapter", names, order)
        if not has_mention:
            active = set()


# C1–C5, RI_COMMUNITY_ANSWERS_2026-11-24. Each pin requires the named
# passage (and a context paragraph where necessary) in the local edition.
MYRIAD = ("lead:myriad-self", "lead:myriad_self_(killer_move)")
FAMILIAR_ORIGINAL = ("lead:familiar-face", "familiar-face-original")
FAMILIAR_MODIFIED = ("lead:familiar-face", "familiar-face-mortal-supports")
PINS = [
    (MYRIAD, "myriad-self@ch763", "core", "cleanse soul Immortal Gu", 763, 36, "to form the immortal killer move myriad self", ()),
    (MYRIAD, "myriad-self@ch763", "unnamed", "other mortal Gu", 763, 36, "combined with other mortal Gu", ()),
    (("lead:self-strength-phantom",), "self-strength-phantom@ch777", "core", "Self strength Immortal Gu", 777, 14,
     "most important core in her self strength phantom killer move", ()),
    (("lead:myriad-self-giant-hand",), "giant-hand@ch782", "core", "Self Strength", 782, 85,
     "proudly at the center", ((90, "First Style"),)),
    (("lead:myriad-self-giant-hand",), "giant-hand@ch782", "unnamed", "Countless mortal Gu", 782, 84,
     "circling around one spot", ((85, "Self Strength"), (90, "First Style"))),
    (FAMILIAR_ORIGINAL, "familiar-face-original@ch976", "core", "attitude Gu", 976, 56,
     "only one core of familiar face", ()),
    (FAMILIAR_ORIGINAL, "familiar-face-original@ch976", "support", "change form Immortal Gu", 976, 57,
     "two Immortal Gu, including change form Immortal Gu", ()),
    (FAMILIAR_ORIGINAL, "familiar-face-original@ch976", "unnamed", "second Immortal Gu", 976, 58,
     "recipe of the second Immortal Gu", ((57, "two Immortal Gu"),)),
    (FAMILIAR_MODIFIED, "familiar-face-mortal-supports@ch976", "unnamed", "about a thousand mortal Gu", 976, 62,
     "two supplementary Immortal Gu were removed", ((60, "modifying the immortal killer move familiar face"),)),
    (FAMILIAR_MODIFIED, "familiar-face-mortal-supports@ch976", "core", "attitude Gu", 976, 73,
     "attitude Gu at its core", ((69, "modified familiar face"),)),
    # The scan sees both cores in one sentence; the text gives them separate configurations.
    (("lead:year-beast-summoning",), "year-gu@ch1401", "core", "year Gu", 1401, 33,
     "two versions, year beast summoning using year Gu as the core", ()),
    (("lead:year-beast-summoning",), "years-flow-like-water@ch1401", "core", "years flow like water Immortal Gu", 1401, 33,
     "using years flow like water Immortal Gu as the core", ()),
    (("lead:spring-autumn-success",), None, "core", "Spring Autumn Cicada", 1679, 32,
     "used Spring Autumn Cicada as the core", ()),
    (("lead:spring-autumn-success",), None, "unnamed", "several supplementary Immortal Gu", 1679, 32,
     "spring autumn success killer move, this move used several supplementary Immortal Gu", ()),
]


def community_slots(by_locator, names):
    for moves, variant, role, name, ch, p, cue, context in PINS:
        text = key(by_locator.get((ch, p), ""))
        if key(name) not in text or key(cue) not in text:
            continue
        if not all(key(cue) in key(by_locator.get((ch, paragraph), "")) for paragraph, cue in context):
            continue
        for move in moves:
            yield observation(move, variant, role, name, f"ri:ch{ch}:p{p}", "chapter", names)
    # C1's later configuration is a literal two-list paragraph. C4's Target
    # and C5's summon/sustain passages state no component slot.
    locator = "ri:ch1561:p13"
    if "immortal killer move myriad self" in key(by_locator.get((1561, 11), "")):
        for match in ROLE_LIST.finditer(by_locator.get((1561, 13), "")):
            role = "core" if match["role"].lower() == "core" else "support"
            for slot_role, name, order in list_slots(match["names"], role, names, allow_bare=True):
                for move in MYRIAD:
                    yield observation(move, "myriad-self@ch1561", slot_role, name, locator, "chapter", names, order)


def slot_key(row):
    return tuple(row[field] or "" for field in ("move", "variant", "role", "name", "locator"))


def build():
    chapters = from_chapters()
    if not chapters:
        raise SystemExit("No local Reverend Insanity chapters found; slot evidence was left untouched.")
    index = read_json(Path(chapter_tools.NOV) / "reverend-insanity/private/rule-derivation-2026-11-11/gu-identities.json")
    indexed = {r["id"]: indexed_names(r) for r in index["records"]}
    names = get_gu_names(ledger("gu_kinds"), index, alias_names())
    moves = ledger("gu_moves")
    labels = read_json(COVERAGE / "wiki_tier_labels.json")["gu_moves"]
    curated = list(community_slots({(ch, p): text for ch, p, text in chapters}, names))
    chapter = chapter_slots(chapters, moves, names, {row["locator"] for row in curated})
    rows = {slot_key(row): row for stream in (wiki_slots(moves, labels, names, indexed), chapter, curated)
            for row in stream if row["move"] in moves}
    rows = [rows[k] for k in sorted(rows)]
    OUTPUT.write_text("".join(json.dumps(row, ensure_ascii=False, separators=(",", ":")) + "\n" for row in rows),
                      encoding="utf-8")
    print(f"{len(rows)} rows; {len({r['move'] for r in rows if r['tier'] == 'chapter'})} moves with chapter slots")
    for field in ("tier", "resolution", "move"):
        print(field, Counter(r[field] for r in rows).most_common(10))


def self_test():
    names = GuNames({"strength": ["Self Strength Immortal Gu"], "mountain": ["Pulling Mountain Immortal Gu"],
                     "water": ["Pulling Water Immortal Gu"], "soul": ["Cleanse Soul Immortal Gu"],
                     "effort": ["All-Out Effort Gu"], "earth": ["Earth Strength Gu"],
                     "life-a": ["Life Gu"], "life-b": ["Life Gu"]}, {"soul": ["Purify Soul Gu"]})
    text = ("The core Immortal Gu were Self Strength, Pulling Mountain, Pulling Water, and Cleanse Soul. "
            "The supplementary Gu worms were all-out effort Gu, earth strength Gu, as well as all kinds of soul path mortal Gu.")
    actual = [(role, name, names.resolve(name)[0], order) for match in ROLE_LIST.finditer(text)
              for role, name, order in list_slots(match["names"], "core" if match["role"] == "core" else "support", names, True)]
    assert actual == [
        ("core", "Self Strength", "strength", None), ("core", "Pulling Mountain", "mountain", None),
        ("core", "Pulling Water", "water", None), ("core", "Cleanse Soul", "soul", None),
        ("support", "all-out effort Gu", "effort", None), ("support", "earth strength Gu", "earth", None),
        ("unnamed", "all kinds of soul path mortal Gu", None, None),
    ], actual
    assert names.resolve("Life Gu") == (None, "collision")
    assert names.resolve("Purify Soul Gu") == ("soul", "alias")
    assert names.resolve("Remnant life Gu") == (None, "unresolved")
    assert names.resolve("Cleanse Soul Gu") == ("soul", "alias")
    assert names.resolve("Self Strength Immortal Gu") == ("strength", "exact")
    assert not clean_left("Remnant life Gu", len("Remnant "))
    assert list(list_slots("All-Out Effort Gu", "core", names)) == [("core", "All-Out Effort Gu", None)]
    assert list(list_slots("first, All-Out Effort Gu", "core", names)) == [("core", "All-Out Effort Gu", 1)]
    moves = {"lead:myriad-self": {"source": "https://sagaofgu.com/moves/myriad-self/"}}
    chapters = [(1, 1, "The killer move myriad self was ready."), (1, 2, text),
                (2, 1, "The core Gu was Life Gu."),
                (3, 1, "For the killer move myriad self, he used Life Gu as the core."),
                (3, 2, "The killer move myriad self used Remnant life Gu as the core."),
                (3, 3, "This other killer move is different, the core Gu was All-Out Effort Gu.")]
    rows = list(chapter_slots(chapters, moves, names, set()))
    assert len(rows) == 9, rows
    assert [(row["name"], row["resolution"]) for row in rows[-2:]] == [
        ("Life Gu", "collision"), ("Remnant life Gu", "unresolved")]
    print("WA23 self-test passed")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--self-test", action="store_true")
    if parser.parse_args().self_test:
        self_test()
    else:
        build()
