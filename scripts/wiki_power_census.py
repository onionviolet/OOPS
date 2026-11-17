#!/usr/bin/env python3
"""PWC9 deterministic wiki power census. No model calls, no network.

Run with `python3 -I scripts/wiki_power_census.py <command>`.

  scan  --cache DIR [--wiki SLUG ...]   stream each local dump once and write
                                        DIR/<slug>.json.gz (title, ns, redirect,
                                        categories of the newest revision).
  report --cache DIR --out FILE.json    count power categories per world.

Archives are streamed through the zstd, 7zz and gzip command line tools; nothing is
unpacked to disk. The cache holds titles and category names only, never page text,
and lives outside the repository.
"""
import argparse, collections, gzip, json, pathlib, re, subprocess, sys
import xml.etree.ElementTree as ET

ROOT = pathlib.Path.home() / ".codex/research/wikis"
# slug -> (host dir, [(kind, file relative to dump/)])
WIKIS = {
    "naruto": ("naruto.fandom.com", "jsonl", "latest-pages.jsonl.gz"),
    "myheroacademia": ("myheroacademia.fandom.com", "zst", "myheroacademia.fandom.com-20231128-history.xml.zst"),
    "onepiece": ("onepiece.fandom.com", "7z", "pages-current.xml.7z"),
    "mistborn": ("mistborn.fandom.com", "zst", "mistborn.fandom.com-20250220-history.xml.zst"),
    "blackclover": ("blackclover.fandom.com", "zst", "blackclover.fandom.com-20231224-history.xml.zst"),
    "bleach": ("bleach.fandom.com", "zst", "bleach.fandom.com-20231226-history.xml.zst"),
    "frieren": ("frieren.fandom.com", "zst", "frieren.fandom.com-20231212-history.xml.zst"),
    "kimetsu-no-yaiba": ("kimetsu-no-yaiba.fandom.com", "zst", "kimetsu-no-yaiba.fandom.com-20231219-history.xml.zst"),
    "towerofgod": ("towerofgod.fandom.com", "zst", "towerofgod.fandom.com-20231204-history.xml.zst"),
    "chainsaw-man": ("chainsaw-man.fandom.com", "zst", "chainsaw-man.fandom.com-20231127-history.xml.zst"),
    "dresdenfiles": ("dresdenfiles.fandom.com", "7z", "dresdenfilesfandomcom-20200216-history.xml.7z"),
    "hunterxhunter": ("hunterxhunter.fandom.com", "7z", "pages-current.xml.7z"),
    "jujutsu-kaisen": ("jujutsu-kaisen.fandom.com", "7z", "pages-current.xml.7z"),
    "lazydungeonmaster": ("lazydungeonmaster.fandom.com", "7z", "lazydungeonmasterfandomcom-20211114-history.xml.7z"),
    "mtg": ("mtg.fandom.com", "7z", "mtgfandomcom-20210627-history.xml.7z"),
    "mysranks": ("mysranks.fandom.com", "7z", "mysranksfandomcom-20220709-history.xml.7z"),
    "typemoon": ("typemoon.fandom.com", "7z", "pages-current.xml.7z"),
    "fma": ("fma.fandom.com", "7z", "pages-current.xml.7z"),
    # Dump folders exist but hold no archive (checked 2026-11-16).
    "mob-psycho-100": ("mob-psycho-100.fandom.com", None, None),
    "worldtrigger": ("worldtrigger.fandom.com", None, None),
}

CAT = re.compile(r"\[\[\s*Category\s*:\s*([^\]|]+)", re.I)
TPL = re.compile(r"\{\{\s*([^|{}\n<]{2,60})")
REDIR = re.compile(r"^\s*#REDIRECT\s*:?\s*\[\[([^\]|#]+)", re.I)


def parse_text(text):
    m = REDIR.match(text or "")
    redirect = m.group(1).strip() if m else None
    cats = sorted({c.strip().replace("_", " ") for c in CAT.findall(text or "")})
    # Lead infobox template: many wikis add categories through it, so it never shows as
    # [[Category:]] in the wikitext. Only the first template within the opening 600 chars.
    m = TPL.search((text or "")[:600])
    tpl = m.group(1).strip().replace("_", " ") if m else None
    return redirect, cats, tpl


def stream_xml(cmd):
    """Yield (title, ns, timestamp, text) per <page> from a decompressor command."""
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    parser = ET.XMLPullParser(events=("start", "end"))
    root = None
    while True:
        buf = proc.stdout.read(1 << 20)
        if not buf:
            break
        parser.feed(buf)
        for ev, e in parser.read_events():
            tag = e.tag.rsplit("}", 1)[-1]
            if ev == "start" and root is None:
                root = e
            if ev != "end" or tag != "page":
                continue
            title = ns = None
            best = ("", "")
            for c in e:
                t = c.tag.rsplit("}", 1)[-1]
                if t == "title":
                    title = c.text or ""
                elif t == "ns":
                    ns = c.text or "0"
                elif t == "revision":
                    ts = text = ""
                    for x in c:
                        xt = x.tag.rsplit("}", 1)[-1]
                        if xt == "timestamp":
                            ts = x.text or ""
                        elif xt == "text":
                            text = x.text or ""
                    if ts >= best[0]:
                        best = (ts, text)
            yield title, ns or "0", best[0], best[1]
            root.remove(e)
            e.clear()
    proc.wait()


def stream_jsonl(path):
    with gzip.open(path, "rt", encoding="utf-8") as f:
        for line in f:
            r = json.loads(line)
            title = r["title"]
            ns = "0"
            if ":" in title and title.split(":", 1)[0] in (
                "User", "Talk", "File", "Category", "Template", "Help", "MediaWiki",
                "Forum", "Blog", "Module", "Thread", "Message Wall", "User blog",
                "Narutopedia", "Project", "Board", "Board Thread", "Special",
            ):
                ns = "x"
            yield title, ns, r.get("timestamp", ""), r.get("text", "")


def scan(slug, cache):
    host, kind, fname = WIKIS[slug]
    out = cache / f"{slug}.json.gz"
    if kind is None:
        out.write_bytes(gzip.compress(json.dumps({"slug": slug, "pages": None}).encode()))
        return 0
    path = ROOT / host / "dump" / fname
    if kind == "zst":
        it = stream_xml(["zstd", "-dc", "--long=31", str(path)])
    elif kind == "7z":
        it = stream_xml(["7zz", "e", "-so", str(path), "*.xml"])
    else:
        it = stream_jsonl(path)
    # WikiTeam history dumps can split one title across several <page> blocks; keep the newest.
    pages = {}
    for title, ns, ts, text in it:
        if title in pages and pages[title][0] > ts:
            continue
        redirect, cats, tpl = parse_text(text)
        pages[title] = (ts, ns, redirect, cats, tpl)
    rows = [[t, v[1], v[2], v[3], v[4]] for t, v in sorted(pages.items())]
    out.write_bytes(gzip.compress(json.dumps({"slug": slug, "pages": rows}, ensure_ascii=False).encode()))
    return len(rows)


# ---------------------------------------------------------------- report

# A category counts as a power category when its name matches POWER and none of EXCLUDE.
POWER = re.compile(
    r"(?i)(technique|jutsu|quirk|devil fruit|zanpak|kid[oō]|bankai|shikai|resurrecci|cero|hierro|"
    r"abilit|power|allomanc|feruchem|hemalurg|metal|magic|spell|grimoire|nen\b|cursed|curse|breathing|"
    r"blood demon|shinsu|devil|fiend|contract|haki|trion|stand\b|shiki|noble phantasm|servant|"
    r"sacred gear|mage|style|sharingan|rinnegan|byakugan|kekkei|bloodline|chakra|nature|"
    r"transformation|release|seal|summon|weapon|sword|arts?\b|skill|talent|rank|class|type|"
    r"fruit|gift|hemo|thrust|stance|form\b|attribute|elemental|innate|binding|ritual|alchemy|"
    r"circuit|origin|element|wizard|witch|warlock|vampire|fae|sorcery|talisman|rune|enchant)"
)
EXCLUDE = re.compile(
    r"(?i)(gallery|image|episode|chapter|volume|character|user|blog|stub|transcript|trivia|"
    r"anime only|filler|manga only|movie|ova|song|music|soundtrack|cover|article|page|"
    r"deleted|delete|template|candidate|needs|cleanup|disambig|redirect|wiki|spoiler|"
    r"merch|game|video|figure|toy|cards?\b|set\b|booster|art \w+ \w+ \w+ \w+)"
)

# Hand-picked per-world spec, read off the candidate category and lead-template listings
# (`report` without a spec prints them) on 2026-11-16. For each world:
#   power:  [(label, [categories], [lead templates])]  one distinct-page union is the
#           denominator, so a page in two lists counts once.
#   Items (Naruto tools, One Piece weapons, Tower of God weapons, JJK cursed tools) and holders
#   are not powers and are left out of the denominator.
#   own:    [(label, [categories])]  the world's own classification, as held-out labels;
#           these are mostly holder pages (users), so they are shown, not added to power.
# Lead templates matter because many wikis add categories through the infobox, which never
# appears as [[Category:]] in the wikitext.
SPEC = {
    "naruto": {
        "power": [("Jutsu", [], ["Infobox/Jutsu"]), ("Bloodlines", [], ["Infobox/Naruto/Genetic"])],
        "own": [("Chakra Natures", ["Chakra Natures"]), ("Jutsu Type", ["Jutsu Type"]),
                ("Kekkei Genkai", ["Kekkei Genkai"]), ("Ninja Ranks", ["Ninja Ranks"])],
    },
    "myheroacademia": {
        "power": [("Quirks", [], ["Quirk Infobox"]), ("Moves", [], ["Move Infobox"])],
        "own": [("Emitters", ["Emitters"]), ("Mutants", ["Mutants"])],
    },
    "onepiece": {
        "power": [("Devil Fruits", [], ["Devil Fruit Box"]), ("Fighting Styles", ["Fighting Styles"], [])],
        "own": [("Paramecia", ["Paramecia"]), ("Zoan", ["Zoan"]), ("Logia", ["Logia"]),
                ("Haki users (Armament, Observation, Supreme King)",
                 ["Armament Haki Users", "Observation Haki Users", "Supreme King Haki Users"])],
    },
    "mistborn": {
        "power": [("Allomancy, metals, magic and Hemalurgy pages",
                   ["Allomancy", "Metal", "Magic", "Hemalurgy"],
                   ["Allomantic Metals"])],
        "own": [("Misting types", ["Misting"]), ("Metals", ["Metal"])],
    },
    "blackclover": {
        "power": [("Spells", [], ["Infobox/Spell"]), ("Magic (attribute pages)", ["Magic Attributes"], ["Infobox/Magic"])],
        "own": [("Magic Attributes", ["Magic Attributes"]), ("Spirit Magic", ["Spirit Magic Spells"]),
                ("Mana Zone and Mana Method", ["Mana Zone Spells", "Mana Method Spells"])],
    },
    "bleach": {
        "power": [("Techniques", ["Techniques", "Zanpakutō techniques", "Arrancar Techniques", "Kidō",
                                  "Quincy Techniques", "Resurrección techniques", "Hollow Techniques",
                                  "Shunpo Techniques", "Dragon Techniques", "Zanpakutō Spirit techniques"], [])],
        "own": [("Kidō", ["Kidō"]), ("Zanpakutō Spirit", ["Zanpakutō Spirit"]), ("Fullbring", ["Fullbring"]),
                ("Quincy", ["Quincy"])],
    },
    "frieren": {"power": [], "own": [("Classes", ["Classes"])]},
    "kimetsu-no-yaiba": {
        "power": [("Breathing Styles and Abilities", ["Breathing Styles", "Abilities"], ["Ability"])],
        "own": [("Breathing Styles", ["Breathing Styles"]), ("Demon", ["Demon"])],
    },
    "towerofgod": {
        "power": [("Shinsu and weapon techniques (technique pages)",
                   ["Shinsu Techniques", "Projectile Techniques", "Fighting Techniques", "Weapon Techniques",
                    "Utility Techniques", "Control Techniques", "Lighthouse Techniques", "Abilities",
                    "Piercing Techniques", "Body Techniques", "Reel Techniques", "Canine Transformations",
                    "Transformations", "Spells", "Shinsu Orb"],
                   ["Shinsu Technique", "Shinsoo Technique", "Canine Transformation"])],
        "own": [("Positions", ["Scouts", "Spear Bearers", "Light Bearers", "Wave Controllers", "Guides"]),
                ("Shinsu Quality", ["Shinsu Quality"])],
    },
    "chainsaw-man": {
        "power": [("Devils and Fiends (power pages are characters)", ["Devils", "Fiends", "Hybrids"], [])],
        "own": [("Devils", ["Devils"]), ("Fiends", ["Fiends"]), ("Hybrids", ["Hybrids"])],
    },
    "dresdenfiles": {
        "power": [("Curses and spell pages", ["Curses"], [])],
        "own": [],
    },
    "hunterxhunter": {
        "power": [("Greed Island cards and spells (Nen abilities live on character pages, not counted)", ["Short Range Spell", "Regular Spell", "Long Range Spell",
                                                    "Attack Spell", "Defensive Spell", "Continuous Effect Spell",
                                                    "Special Spell", "Anti-Attack Spell", "Versus Spell",
                                                    "Nen based items"],
                   ["Greed Island Card", "Greed Island Card Spell", "Greed Island Card Free"])],
        "own": [("Enhancers", ["Enhancers"]), ("Emitters", ["Emitters"]), ("Conjurers", ["Conjurers"]),
                ("Manipulators", ["Manipulators"]), ("Transmuters", ["Transmuters"]), ("Specialists", ["Specialists"]),
                ("Unknown Nen type with Nen abilities", ["Unknown Nen type users with Nen abilities"])],
    },
    "jujutsu-kaisen": {
        "power": [("Techniques", ["Innate Techniques", "Extension Techniques", "Domain Expansion",
                                  "Inherited Techniques"], ["Technique Infobox"])],
        "own": [("Innate Techniques", ["Innate Techniques"]), ("Extension Techniques", ["Extension Techniques"])],
    },
    "lazydungeonmaster": {
        "power": [("Skills", ["Skills", "Active Skills", "Passive Skills", "Ultra Skills", "Special Skills",
                              "Original Skills", "Fighting skills"], ["Skill"])],
        "own": [("Elements", ["Fire Element", "Earth Element", "Light Element", "Darkness Element",
                              "Water Element", "Wind Element", "Space/Time Element"])],
    },
    "mtg": {
        "power": [("Keyword abilities and ability words", [], ["Infobox keyword", "Infobox ability"])],
        "own": [("Classes", ["Classes"])],
    },
    "mysranks": {
        "power": [("Skills", ["Skills", "Active skills", "Attack skills", "Defense skills", "Passive skills",
                              "Resistance skills", "Special skills", "Buff skills", "Support skills",
                              "Debuff skills", "Abilities"], ["Skill"])],
        "own": [("Ranks", ["S-ranks", "A-ranks", "B-ranks", "F-ranks", "Born S-ranks"])],
    },
    "typemoon": {
        "power": [("Noble Phantasms", ["Noble Phantasms"], ["NP"]), ("Skills", ["Skills"], ["Skills"]),
                  ("Magecraft and Reality Marbles", ["Magecraft", "Magecraft terminology", "Reality Marbles",
                                                      "Bounded Fields"], [])],
        "own": [("NP type (anti-unit)", ["Anti-Unit Noble Phantasms"]), ("NP type (anti-army)", ["Anti-Army Noble Phantasms"]),
                ("Servant classes", ["Servant classes"])],
    },
    "fma": {"power": [("Alchemy", ["Alchemy"], [])], "own": []},
    "mob-psycho-100": {"power": [], "own": []},
    "worldtrigger": {"power": [], "own": []},
}


# ---------------------------------------------------------------- inferred, hand-labelled

# INFERENCE, not measurement: engine capabilities (PWC5 slugs) each world's power categories
# probably need. Shared slugs are the four the sibling ledgers use (mind-binding, time-loop,
# area-field, power-interaction); the rest are this census's proposed additions.
CAPS = {
    "naruto": ["area-field", "power-interaction", "form-transformation", "familiar-summon", "mind-binding", "power-transfer", "vow-cost"],
    "myheroacademia": ["power-interaction", "power-transfer", "form-transformation", "mind-binding", "area-field"],
    "onepiece": ["form-transformation", "power-transfer", "item-bound-power", "power-interaction", "mind-binding"],
    "mistborn": ["power-interaction", "mind-binding", "power-transfer"],
    "blackclover": ["item-bound-power", "familiar-summon", "power-interaction", "area-field", "form-transformation", "vow-cost"],
    "bleach": ["item-bound-power", "area-field", "power-interaction", "form-transformation", "mind-binding"],
    "frieren": ["area-field", "mind-binding", "power-interaction"],
    "kimetsu-no-yaiba": ["form-transformation", "item-bound-power", "power-interaction", "mind-binding", "power-transfer"],
    "towerofgod": ["item-bound-power", "power-interaction", "area-field", "form-transformation", "familiar-summon"],
    "chainsaw-man": ["vow-cost", "familiar-summon", "form-transformation", "mind-binding"],
    "dresdenfiles": ["area-field", "mind-binding", "vow-cost", "familiar-summon", "power-interaction", "power-transfer"],
    "hunterxhunter": ["vow-cost", "power-interaction", "mind-binding", "item-bound-power", "area-field", "power-transfer"],
    "jujutsu-kaisen": ["area-field", "vow-cost", "item-bound-power", "familiar-summon", "power-transfer", "mind-binding", "power-interaction"],
    "lazydungeonmaster": ["area-field", "familiar-summon"],
    "mtg": ["power-interaction", "familiar-summon"],
    "mysranks": ["power-interaction", "item-bound-power"],
    "typemoon": ["item-bound-power", "familiar-summon", "area-field", "mind-binding", "vow-cost", "power-transfer", "power-interaction"],
    "fma": ["power-interaction", "area-field", "power-transfer", "vow-cost"],
    "mob-psycho-100": [], "worldtrigger": [],
}
# The three sibling ledgers (shared slugs from the notes folder and PWC5; worm and rezero guessed
# from PWC2 ratings and the README's mechanism list, to be replaced by their ledgers).
SIBLINGS = {
    "worm": ["mind-binding", "area-field", "power-interaction", "form-transformation", "familiar-summon"],
    "rezero": ["time-loop", "mind-binding", "vow-cost", "power-transfer", "area-field", "familiar-summon", "power-interaction"],
    "perfect-run": ["time-loop", "mind-binding", "power-interaction", "area-field"],
}
# Books or reads in docs/research/LIBRARY_INDEX.md, checked 2026-11-16 by grep (partial and dated).
LIBRARY = {
    "naruto": "manga queued (701 ch, ~36% in Nov 3); 5 novels; databook missing",
    "myheroacademia": "no; wiki dump only",
    "onepiece": "no; wiki dump only",
    "mistborn": "boxed set held (contents unchecked, MC13); wiki held, unread",
    "blackclover": "no; wiki dump only",
    "bleach": "manga queued and 214 ch OCR text; wiki dump",
    "frieren": "volumes 1-13 and Prelude 1-2 held; unread",
    "kimetsu-no-yaiba": "manga queued; no novels",
    "towerofgod": "no; wiki held, unread",
    "chainsaw-man": "manga queued; Buddy Stories held",
    "dresdenfiles": "novels 16-18 held (others unchecked); wiki held, unread",
    "hunterxhunter": "manga queued; wiki dump",
    "jujutsu-kaisen": "277 ch OCR text, 2 novels, Modulo 2-6 and 8; wiki dump",
    "lazydungeonmaster": "LN 1-3 held; wiki held, unread",
    "mtg": "no books; wiki held, unread",
    "mysranks": "no; wiki held, unread",
    "typemoon": "Fate/Zero 2-4, Fake 1/4/5, Case Files 1-3 held; wiki dump",
    "fma": "manga queued; wiki dump",
    "mob-psycho-100": "no; no dump (archive not found)",
    "worldtrigger": "no; no dump (IA archive returned HTTP 500 twice)",
}
OWN_CLASS = {
    "naruto": "five chakra natures, Yin/Yang, Kekkei Genkai; jutsu type (Ninjutsu, Genjutsu, Taijutsu)",
    "myheroacademia": "Emitter, Transformation, Mutant (Quirk Infobox type field, not read here)",
    "onepiece": "Paramecia, Zoan (ancient, mythical), Logia; Haki three kinds",
    "mistborn": "metals (16 base, allomantic, feruchemical, hemalurgic), Misting types",
    "blackclover": "Magic Attributes (94 pages), Spirit, Mana Zone, Mana Method",
    "bleach": "Kidō (Hadō, Bakudō), Zanpakutō release, Hollow, Quincy, Fullbring",
    "frieren": "none in categories; spells and classes live in prose",
    "kimetsu-no-yaiba": "Breathing Styles (15 pages), Blood Demon Art",
    "towerofgod": "Positions (Scout, Spear Bearer, Light Bearer, Wave Controller, Guide), Shinsu quality and technique types",
    "chainsaw-man": "devil, fiend, hybrid",
    "dresdenfiles": "none in categories",
    "hunterxhunter": "six Nen types (hexagon): Enhancer, Emitter, Conjurer, Manipulator, Transmuter, Specialist",
    "jujutsu-kaisen": "Innate, Extension, Inherited Techniques; grades",
    "lazydungeonmaster": "skill kinds (active, passive, ultra, special), elements, ranks",
    "mtg": "colours and card types (outside categories); keyword vs ability word",
    "mysranks": "skill kinds (active, passive, attack, defense, buff), ranks S to F",
    "typemoon": "NP type (anti-unit, anti-army, ...), NP rank E to EX, Servant class and attribute",
    "fma": "none in categories",
    "mob-psycho-100": "n/a", "worldtrigger": "n/a",
}


def rank(rows):
    """Proposal: score = log10(pages + 1) x mean over the world's caps of (other worlds that
    also need the cap). Log keeps one huge list (Naruto, Fate) from deciding alone; the mean
    rewards worlds whose blockers many other worlds and the three sibling ledgers share."""
    import math
    need = collections.Counter()
    for caps in list(CAPS.values()) + list(SIBLINGS.values()):
        for c in set(caps):
            need[c] += 1
    out = []
    for slug, pages in rows.items():
        caps = CAPS.get(slug, [])
        share = sum(need[c] - 1 for c in caps) / len(caps) if caps else 0.0
        out.append({"slug": slug, "pages": pages, "caps": len(caps), "mean_share": round(share, 1),
                    "score": round(math.log10(pages + 1) * share, 1)})
    out.sort(key=lambda r: (-r["score"], -r["pages"], r["slug"]))
    return out, dict(need.most_common())


def load(cache, slug):
    d = json.loads(gzip.decompress((cache / f"{slug}.json.gz").read_bytes()))
    return d["pages"]


def census_world(pages, spec):
    """Distinct canonical ns 0 pages (redirects followed, not counted) per spec entry."""
    ns0 = [p for p in pages if p[1] == "0"]
    canon = [p for p in ns0 if not p[2]]
    inbound = collections.Counter(p[2] for p in ns0 if p[2])

    def members(cats, tpls):
        cs, ts = set(cats), set(tpls)
        return {p[0] for p in canon if cs & set(p[3]) or (p[4] in ts if ts else False)}

    out = {"power": [], "own": []}
    union = set()
    for label, cats, tpls in spec.get("power", []):
        m = members(cats, tpls)
        union |= m
        out["power"].append({"label": label, "pages": len(m), "sample": sorted(m)[:5]})
    out["power_pages"] = len(union)
    out["power_aliases"] = sum(inbound[t] for t in union)
    for label, cats in spec.get("own", []):
        m = members(cats, [])
        out["own"].append({"label": label, "pages": len(m)})
    return out, {
        "ns0_total": len(ns0), "ns0_canonical": len(canon),
        "ns0_redirects": len(ns0) - len(canon), "pages_all_ns": len(pages),
    }


def candidates(pages, top=60):
    canon = [p for p in pages if p[1] == "0" and not p[2]]
    c = collections.Counter()
    for p in canon:
        for k in p[3]:
            if POWER.search(k) and not EXCLUDE.search(k):
                c[k] += 1
    return c.most_common(top)


def templates(pages, top=25):
    c = collections.Counter(p[4] for p in pages if p[1] == "0" and not p[2] and p[4])
    return c.most_common(top)


def render_md(report, ranked, need):
    L = ["| World | Dump (ns 0 canonical pages) | Power denominator (distinct pages) | Own classification (held-out label) | Likely blocking capabilities (inferred) | Books or reads in library |",
         "| --- | ---: | --- | --- | --- | --- |"]
    for slug in WIKIS:
        v = report[slug]
        if not v["dump"]:
            L.append(f"| {slug} | none | none | {OWN_CLASS[slug]} | n/a | {LIBRARY[slug]} |")
            continue
        c = v["census"]
        den = "; ".join(f"{x['label']} {x['pages']}" for x in c["power"]) or "none found"
        own = "; ".join(f"{x['label']} {x['pages']}" for x in c["own"])
        own = f"{OWN_CLASS[slug]}. Counts: {own}" if own else OWN_CLASS[slug]
        L.append(f"| {slug} | {v['totals']['ns0_canonical']} | **{c['power_pages']}** ({c['power_aliases']} aliases). {den} | {own} | {', '.join(CAPS[slug])} | {LIBRARY[slug]} |")
    L += ["", "| Rank | World | Power pages | Pages rank | Caps | Mean other worlds sharing each cap | Score |", "| ---: | --- | ---: | ---: | ---: | ---: | ---: |"]
    byp = {r["slug"]: i for i, r in enumerate(sorted(ranked, key=lambda r: (-r["pages"], r["slug"])), 1)}
    for i, r in enumerate(ranked, 1):
        L.append(f"| {i} | {r['slug']} | {r['pages']} | {byp[r['slug']]} | {r['caps']} | {r['mean_share']} | {r['score']} |")
    L += ["", "| Capability | Worlds needing it (dump worlds plus the 3 sibling ledgers) |", "| --- | ---: |"]
    L += [f"| {k} | {n} |" for k, n in need.items()]
    return "\n".join(L) + "\n"


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("scan")
    s.add_argument("--cache", required=True)
    s.add_argument("--wiki", nargs="*")
    r = sub.add_parser("report")
    r.add_argument("--cache", required=True)
    r.add_argument("--out", required=True)
    r.add_argument("--md", help="write the markdown tables here")
    r.add_argument("--proposed", help="write docs/coverage/proposed_ledgers.json here")
    r.add_argument("--wiki", nargs="*")
    a = ap.parse_args()
    cache = pathlib.Path(a.cache)
    cache.mkdir(parents=True, exist_ok=True)
    slugs = a.wiki or list(WIKIS)
    if a.cmd == "scan":
        for slug in slugs:
            n = scan(slug, cache)
            print(slug, n, flush=True)
        return
    report = {}
    for slug in slugs:
        pages = load(cache, slug)
        if pages is None:
            report[slug] = {"dump": False}
            continue
        res, tot = census_world(pages, SPEC.get(slug, {}))
        report[slug] = {"dump": True, "totals": tot, "census": res, "candidates": candidates(pages), "templates": templates(pages)}
    ranked, need = rank({k: v["census"]["power_pages"] for k, v in report.items() if v["dump"]})
    report["_ranking"] = ranked
    report["_capability_need"] = need
    pathlib.Path(a.out).write_text(json.dumps(report, ensure_ascii=False, indent=1) + "\n")
    if a.proposed:
        rows = []
        for i, r in enumerate(ranked, 1):
            v = report[r["slug"]]["census"]
            rows.append({"rank": i, "world": r["slug"], "ledger": f"{r['slug']}_powers", "expected": v["power_pages"],
                         "denominator": "; ".join(f"{x['label']} {x['pages']}" for x in v["power"]) or "none in the wiki",
                         "source": f"{WIKIS[r['slug']][0]} dump, newest revision, ns 0 after redirects",
                         "caps": CAPS[r["slug"]]})
        pathlib.Path(a.proposed).write_text(json.dumps({"census": "docs/research/power-catalogues-2026-11-16/CENSUS.md", "rows": rows}, ensure_ascii=False, indent=1) + "\n")
    if a.md:
        pathlib.Path(a.md).write_text(render_md(report, ranked, need))
    print("wrote", a.out)


if __name__ == "__main__":
    sys.exit(main())
