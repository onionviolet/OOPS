"""Build a reviewable Gu index from the held two-wiki snapshot and checked identities."""

import argparse
import json
import re
import unicodedata
from collections import defaultdict
from hashlib import sha256
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit


def normalize(name):
    name = unicodedata.normalize("NFKC", name).casefold()
    return " ".join(re.findall(r"\w+", name))


def keyed(rows, field):
    result = {row[field]: row for row in rows}
    if len(result) != len(rows):
        raise ValueError(f"Duplicate {field} in source rows")
    return result


def source_name_groups(rows, name_key):
    groups = defaultdict(list)
    for row in rows:
        groups[name_key(row["name"])].append(row)
    return groups


def pair_candidates(saga, fandom, name_key):
    left = source_name_groups(saga.values(), name_key)
    right = source_name_groups(fandom.values(), name_key)
    for name in sorted(left.keys() & right.keys()):
        if name and len(left[name]) == len(right[name]) == 1:
            yield left[name][0], right[name][0]


def metadata(saga, fandom):
    saga_rank = saga["rank"] if saga else None
    fandom_ranks = sorted({
        int(match.group(1))
        for category in (fandom["categories"] if fandom else [])
        if (match := re.fullmatch(r"Rank (\d+) Gu", category))
    })
    return {
        "saga_rank": int(saga_rank) if saga_rank and saga_rank.isdigit() else None,
        "fandom_category_ranks": fandom_ranks,
        "saga_path": saga["path"] if saga and saga["path"] != "unrecorded" else None,
        "rank_review": bool(saga_rank and saga_rank.isdigit() and fandom_ranks and
                            fandom_ranks != [int(saga_rank)]),
    }


def checked_moves(evidence, kinds):
    moves = evidence.get("moves", [])
    keyed(moves, "id")
    for move in moves:
        if (move["status"] not in {"demonstrated", "described", "proposed"}
                or not move["chapters"] or not move["source"] or not move["openFields"]):
            raise ValueError(f"Incomplete source evidence for move: {move['id']}")
        for role in keyed(move["roles"], "id").values():
            if "kind" not in role:
                continue
            kind = kinds.get(role["kind"])
            if kind is None or not set(kind["chapters"]).intersection(move["chapters"]):
                raise ValueError(f"Unchecked Gu role {role['id']} in move: {move['id']}")
    return moves


class SagaMoveCards(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.rows = []
        self.card = None
        self.name = None

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        classes = (attrs.get("class") or "").split()
        href = attrs.get("href") or ""
        if tag == "a" and "entity-card" in classes and re.fullmatch(r"/moves/[^/#]+/", href):
            self.card = {"url": "https://sagaofgu.com" + href, "tier": attrs.get("data-tier"),
                         "path": attrs.get("data-path"), "chapter_hint": attrs.get("data-first")}
        elif self.card is not None and tag == "p" and "entity-card-name" in classes:
            self.name = []

    def handle_data(self, data):
        if self.name is not None:
            self.name.append(data)

    def handle_endtag(self, tag):
        if tag == "p" and self.name is not None:
            self.card["name"] = "".join(self.name).strip()
            self.name = None
        elif tag == "a" and self.card is not None:
            self.rows.append(self.card)
            self.card = None


def move_candidates(saga_html, fandom_index):
    parser = SagaMoveCards()
    parser.feed(saga_html.decode("utf-8"))
    saga = keyed(parser.rows, "url")
    if not saga or any(not row.get("name") for row in saga.values()):
        raise ValueError("The Saga move snapshot has missing cards or names.")
    fandom_dump = json.loads(fandom_index)
    move_categories = {"killer move", "killer moves", "immortal killer moves", "mortal killer moves"}
    fandom = {}
    for page in fandom_dump["pages"]:
        name = page["title"]
        if page["namespace"] != "0" or page["redirect"] or "/" in name or normalize(name) in move_categories:
            continue
        categories = sorted({category for category in page["categories"] if normalize(category) in move_categories})
        infoboxes = sorted({template for template in page["templates"]
                            if normalize(template.replace("_", " ")) in
                            {"infobox killer move", "infobox gu formation", "infobox gu house"}})
        if infoboxes or categories:
            url = page["revision_url"]
            if url in fandom:
                raise ValueError(f"Duplicate Fandom move locator: {url}")
            fandom[url] = {"name": name, "url": url, "revision_id": page["revision_id"],
                           "categories": categories, "infoboxes": infoboxes}
    records = []
    for left, right in list(pair_candidates(saga, fandom, normalize)):
        records.append({"status": "candidate-exact", "saga": left, "fandom": right})
        del saga[left["url"]]
        del fandom[right["url"]]
    records.extend({"status": "saga-only", "saga": row, "fandom": None} for row in saga.values())
    records.extend({"status": "fandom-only", "saga": None, "fandom": row} for row in fandom.values())
    return {"saga_sha256": sha256(saga_html).hexdigest(), "fandom_index_sha256": sha256(fandom_index).hexdigest(),
            "fandom_archive_sha256": fandom_dump["archive_sha256"], "records": records}


def build(snapshot, evidence):
    saga = keyed(snapshot["saga_candidates"], "name")
    fandom = keyed(snapshot["fandom_candidates"], "name")
    kinds = keyed(evidence["kinds"], "id")
    moves = checked_moves(evidence, kinds)
    records = []

    def record(identity, status, left, right, observation=None):
        row = {"id": identity, "status": status, "saga": left, "fandom": right,
               "metadata": metadata(left, right), "observation": observation}
        records.append(row)
        if left:
            del saga[left["name"]]
        if right:
            del fandom[right["name"]]

    for kind in evidence["kinds"]:
        left = saga[kind["saga"]] if kind.get("saga") else None
        right = fandom[kind["fandom"]] if kind.get("fandom") else None
        if left is None and right is None and not (kind.get("source") and kind.get("chapters")):
            raise ValueError(f"A checked index record needs a catalogue row or direct source locator: {kind['id']}")
        record(kind["id"], "novel-checked", left, right,
               {field: kind[field] for field in ("ranks", "chapters", "note", "openFields", "source") if field in kind})
    for name in evidence["fandom_reference_pages"]:
        right = fandom[name]
        record("fandom:" + urlsplit(right["revision_url"]).path.removeprefix("/wiki/"), "reference-page", None, right)
    for status, name_key in [
        ("candidate-exact", normalize),
        ("candidate-suffix", lambda name: normalize(name).removesuffix(" gu")),
    ]:
        for left, right in pair_candidates(saga, fandom, name_key):
            record("candidate:" + urlsplit(left["url"]).path.rsplit("/", 2)[-2], status, left, right)
    for left in list(saga.values()):
        record("saga:" + urlsplit(left["url"]).path.rsplit("/", 2)[-2], "saga-only", left, None)
    for right in list(fandom.values()):
        record("fandom:" + urlsplit(right["revision_url"]).path.removeprefix("/wiki/"), "fandom-only", None, right)
    keyed(records, "id")
    counts = {status: sum(row["status"] == status for row in records)
              for status in sorted({row["status"] for row in records})}
    return {"edition": evidence["edition"], "source_index": {key: snapshot[key] for key in ("saga_index", "fandom_index")},
            "counts": counts, "rank_review_ids": [row["id"] for row in records if row["metadata"]["rank_review"]],
            "interpretations": evidence["interpretations"], "moves": moves, "records": records}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("snapshot", type=Path)
    parser.add_argument("evidence", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--saga-moves", type=Path)
    parser.add_argument("--fandom-index", type=Path)
    args = parser.parse_args()
    if (args.saga_moves is None) != (args.fandom_index is None):
        parser.error("Supply both move candidate sources together.")
    index = build(json.loads(args.snapshot.read_text()), json.loads(args.evidence.read_text()))
    if args.saga_moves is not None:
        index["move_candidates"] = move_candidates(args.saga_moves.read_bytes(), args.fandom_index.read_bytes())
    args.output.write_text(json.dumps(index, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps(index["counts"], sort_keys=True))


if __name__ == "__main__":
    main()
