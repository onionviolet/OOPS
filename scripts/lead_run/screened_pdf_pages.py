"""Build a private page reading from a matching pdf-screen report and original page renders."""
import hashlib
import json
import os
import pathlib
import subprocess
import sys

import fitz


def prepare(pdf, private_dir, book):
    digest = hashlib.sha256(pdf.read_bytes()).hexdigest()
    report_paths = [pathlib.Path(path).expanduser() for path in book["screenReports"]]
    if os.environ.get("OOPS_READING_SOURCE_DIR"):
        report_paths.insert(0, pathlib.Path(os.environ["OOPS_READING_SOURCE_DIR"]) / (book["key"] + ".json"))
    report = None
    for path in report_paths:
        if path.is_file():
            candidate = json.loads(path.read_bytes())
            if candidate["sha256"] == digest:
                report = candidate
                break
    if report is None:
        # Recreate missing machine-local cache files, including editions first screened on Windows.
        cache = private_dir / ("screen-" + book["key"])
        script = pathlib.Path.home() / ".codex/skills/pdf-screen/scripts/pdf_screen.py"
        subprocess.run([sys.executable, str(script), str(pdf), "--cache-dir", str(cache)], check=True)
        report = next(r for file in cache.glob("*/report.json")
                      if (r := json.loads(file.read_bytes()))["sha256"] == digest)
    with fitz.open(pdf) as doc:
        if len(report["pages"]) != len(doc):
            raise ValueError("Screen report page count differs from source")
        first, last = book.get("pageRange", [1, len(doc)])
        text = []
        images = []
        for number, page in enumerate(report["pages"], 1):
            if page["page"] != number:
                raise ValueError("Screen report pages out of order")
            value = page["readable_text"].replace("\f", " ").strip()
            if first <= number <= last and (page["ocr_needed"] or page["findings"] or len(value) < 40):
                # Keep the visible original available for tables, scans and quarantined layers.
                image = private_dir / (book["key"] + "-page-" + str(number) + ".jpg")
                leaf = doc[number - 1]
                scale = 1550 / max(leaf.rect.width, leaf.rect.height)
                leaf.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False).save(str(image), jpg_quality=68)
                images.append(number)
                value += "\n\n[Rendered PDF page " + str(number) + "]"
            text.append(value)
        (private_dir / (book["key"] + "-images.json")).write_text(json.dumps(images))
        (private_dir / (book["key"] + "-reading.txt")).write_text("\f".join(text), encoding="utf-8")


if __name__ == "__main__":
    prepare(pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2]), json.loads(sys.argv[3]))
