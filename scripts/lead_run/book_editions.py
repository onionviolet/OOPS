#!/usr/bin/env python3
"""Normalize supplied EPUB editions to private paragraph JSONL.

Usage: python3 -I scripts/lead_run/book_editions.py SOURCE.epub OUTPUT.jsonl --edition ID --language LANG --source ROUTE [--translator NAME] [--date YYYY-MM-DD]
The source EPUB is opened read-only. Output contains a metadata header followed by
one row per paragraph. No source prose is written to tracked files.
"""
from __future__ import annotations

import argparse
import hashlib
import html
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import zipfile


class Blocks(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.current = None
        self.blocks = []

    def handle_starttag(self, tag, attrs):
        if tag.lower() in {"p", "h1", "h2", "h3", "h4", "blockquote"}:
            self.current = [tag.lower(), []]

    def handle_endtag(self, tag):
        if self.current and tag.lower() == self.current[0]:
            kind, pieces = self.current
            text = re.sub(r"\s+", " ", "".join(pieces).replace("\xa0", " ")).strip()
            if text:
                self.blocks.append((kind, text))
            self.current = None

    def handle_data(self, data):
        if self.current:
            self.current[1].append(data)


def parse_blocks(data: bytes):
    parser = Blocks()
    parser.feed(data.decode("utf-8-sig", errors="replace"))
    return parser.blocks


def import_epub(source: Path, edition: str, language: str, route: str, translator: str, date: str, chapter_numbering: str):
    digest = hashlib.sha256(source.read_bytes()).hexdigest()
    rows = [{"_type": "edition", "edition": edition, "language": language,
             "translator_or_source": translator or route, "route": route,
             "date": date, "source_sha256": digest}]
    with zipfile.ZipFile(source) as epub:
        names = set(epub.namelist())
        # The supplied exports use a simple numbered XHTML sequence. Iterate spine
        # entries so order follows the reading route rather than archive ordering.
        container = epub.read("META-INF/container.xml").decode("utf-8", errors="replace")
        opf_path = re.search(r'full-path="([^"]+)"', container).group(1)
        opf = epub.read(opf_path).decode("utf-8", errors="replace")
        base = Path(opf_path).parent
        items = {m.group(1): m.group(2) for m in re.finditer(
            r'<item\b[^>]*\bid="([^"]+)"[^>]*\bhref="([^"]+)"', opf)}
        # Attribute order in OPF is not guaranteed.
        for item in re.findall(r'<item\b[^>]*>', opf):
            ident = re.search(r'\bid="([^"]+)"', item)
            href = re.search(r'\bhref="([^"]+)"', item)
            if ident and href:
                items[ident.group(1)] = href.group(1)
        paths = []
        for ident in re.findall(r'<itemref\b[^>]*\bidref="([^"]+)"', opf):
            if ident in items:
                path = (base / items[ident]).as_posix()
                while path.startswith("./"):
                    path = path[2:]
                if path in names:
                    paths.append(path)
        volume = None
        side_mode = False
        chapter_counts = {}
        paragraph_numbers = {}
        extra_counter = 0
        current = None
        for path in paths:
            for kind, text in parse_blocks(epub.read(path)):
                if kind.startswith("h"):
                    vm = re.match(r"Volume\s+(\d+)\b", text, re.I)
                    cm = re.match(r"Chapter\s+(\d+)\s*[:.\-–—]?\s*(.*)$", text, re.I)
                    if vm:
                        volume = int(vm.group(1))
                        side_mode = False
                        current = None
                        continue
                    if re.match(r"Side stor(?:y|ies)\b", text, re.I):
                        volume, side_mode = "side", True
                        extra_counter += 1
                        current = ("side", f"extra-{extra_counter:02d}", text)
                        continue
                    if side_mode and re.match(r"Bonus Chapter\b", text, re.I):
                        extra_counter += 1
                        current = ("side", f"extra-{extra_counter:02d}", text)
                        continue
                    if side_mode and re.match(r"(?:Multi-Character Audio Drama|Pathways Guide|Image Gallery|Artworks|Locations|Afterword)\b", text, re.I):
                        current = None
                        continue
                    if cm:
                        number = int(cm.group(1))
                        title = cm.group(2).strip() or "Untitled"
                        if number >= 1395 or side_mode:
                            volume = "side"
                        if volume is None:
                            # A sole-volume book may have no explicit volume heading.
                            volume = 1
                        chapter_counts[volume] = chapter_counts.get(volume, 0) + 1
                        local_number = number if volume == "side" or chapter_numbering == "source" else chapter_counts[volume]
                        current = (volume, local_number, title)
                        paragraph_numbers[(volume, local_number)] = 0
                        continue
                    continue
                if not text or not text.strip():
                    continue
                if current is None:
                    continue
                vol, ch, title = current
                # Chapter page counters reset within each chapter.
                key = (vol, ch)
                pnum = paragraph_numbers.get(key, 0) + 1
                paragraph_numbers[key] = pnum
                rows.append({"edition": edition, "volume": vol, "chapter": ch,
                             "p": pnum, "title": title, "text": text})
    return rows


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("source", type=Path)
    ap.add_argument("output", type=Path)
    ap.add_argument("--edition", required=True)
    ap.add_argument("--language", required=True)
    ap.add_argument("--source-route", dest="route", required=True)
    ap.add_argument("--translator", default="")
    ap.add_argument("--date", default="2026-10-30")
    ap.add_argument("--chapter-numbering", choices=("local", "source"), default="local")
    args = ap.parse_args()
    rows = import_epub(args.source, args.edition, args.language, args.route, args.translator, args.date, args.chapter_numbering)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with args.output.open("w", encoding="utf-8", newline="\n") as out:
        for row in rows:
            out.write(json.dumps(row, ensure_ascii=False, separators=(",", ":")) + "\n")
    chapters = {(r["volume"], r["chapter"]) for r in rows[1:]}
    print(f"{args.edition}: {len(chapters)} chapters, {len(rows)-1} paragraphs, sha256={rows[0]['source_sha256']}")


if __name__ == "__main__":
    main()
