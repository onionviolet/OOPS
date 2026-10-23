#!/usr/bin/env python3
"""manga_text: searchable, citable text (and webtoon panel clips) from Source Library CBZ chapters.

    manga_text.py doctor
    manga_text.py run   [--series S] [--chapters 1,10,16] [--hash H] [--all] [--force] [--progress FILE]
    manga_text.py watch [--interval 600]            # one instance; STOP file ends it
    manga_text.py search "literal phrase" [--series S] [--chapter 10 | 10-20] [--kind panel_scenario_card] [--limit 20]
    manga_text.py catalog | reindex | profiles | shape --hash H
    manga_text.py summary [--series S] [--chapter N]            counts and riskiest locators only (for other agents)
    manga_text.py query "term" [--series S] [--snippet 0]       counts per chapter plus locators; text only if --snippet N
    manga_text.py slice --series S --chapter N --loc P          bounded text of one page or strip (--max-chars 1500)
    manga_text.py export --series S [--chapter N]               chapter.md per chapter (private, text only)
    manga_text.py verify --series S [--chapter N]               re-check page hashes against the catalogue
    manga_text.py read-page --series S --chapter N --loc P --model M [--prompt page-json-v1]   explicit local LLM read, cached
    manga_text.py fetch-models                                  download and checksum the pinned detector
    manga_text.py book --path FILE [--title T] [--lang ja,en] [--ocr auto|always|never] [--force]   scanned PDF / fixed-layout EPUB

Run with the venv python (see README.md). Everything is written under the git-ignored private folder."""
import argparse
import fcntl
import json
import os
import sys
import time
import traceback
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import common as C  # noqa: E402

SHAPE_CACHE = C.RUNS / "shape_cache.json"
MAX_TRIES = 3


def hashlib_sha(path):
    import hashlib
    return hashlib.sha256(str(path).encode()).hexdigest()


def now():
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())


def log(msg, fh=None):
    line = f"{now()} {msg}"
    print(line, flush=True)
    if fh:
        fh.write(line + "\n")
        fh.flush()


# ------------------------------------------------------------------ shape cache
def load_shapes():
    try:
        return json.loads(SHAPE_CACHE.read_text())
    except (OSError, ValueError):
        return {}


def save_shapes(d):
    C.RUNS.mkdir(parents=True, exist_ok=True)
    tmp = SHAPE_CACHE.with_suffix(".tmp")
    tmp.write_text(json.dumps(d))
    tmp.replace(SHAPE_CACHE)


def shape_of(h, shapes):
    """Cached {'format', 'continuity', 'slices'} for a chapter; old cache entries (a bare format string) are recomputed."""
    if not isinstance(shapes.get(h), dict):
        sizes = C.member_sizes(h)
        cont = C.continuity_score(h)
        shapes[h] = {"format": C.detect_format(sizes, cont), "continuity": round(cont, 3), "slices": len(sizes)}
    return shapes[h]


def format_of(h, shapes):
    return shape_of(h, shapes)["format"]


# ------------------------------------------------------------------ one chapter
def tools_for(fmt, series, profiles):
    import pages
    import webtoon
    if fmt == "webtoon":
        prof = webtoon.profile_for(series, profiles)
        return webtoon.versions(prof), prof
    return pages.versions(), None


def is_done(h, meta, profiles, shapes):
    series, label, _ = C.parse_title(meta["title"])
    path = C.chapter_file(series, label)
    head = C.read_header(path)
    if not head or head.get("cbz_sha256") != h:
        return False
    fmt = head.get("format", "manga")
    tools, _ = tools_for(fmt, series, profiles)
    return C._without_build(head.get("tools")) == C._without_build(tools)


def process_one(h, meta, profiles, shapes, force=False):
    """Returns ('done'|'skip'|'missing'|'error', detail)."""
    import pages
    import webtoon
    series, label, _ = C.parse_title(meta["title"])
    if not C.cbz_path(h).exists():
        return "missing", "cbz not on disk"
    path = C.chapter_file(series, label)
    if not force and is_done(h, meta, profiles, shapes):
        return "skip", "unchanged"
    fmt = format_of(h, shapes)
    tools, prof = tools_for(fmt, series, profiles)
    if fmt == "webtoon":
        res = webtoon.process_chapter(h, meta, tools, prof)
    else:
        res = pages.process_chapter(h, meta, tools)
    if "error" in res:
        return "error", res["error"]
    res["header"]["shape"] = {k: shapes[h][k] for k in ("continuity", "slices")}
    cdir = path.parent
    cdir.mkdir(parents=True, exist_ok=True)
    part = path.with_suffix(".jsonl.part")
    with part.open("w") as f:
        f.write(json.dumps(res["header"]) + "\n")
        for r in res["records"]:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    if fmt == "webtoon":
        webtoon.write_panels(res, cdir)
    part.replace(path)
    con = C.db()
    with con:
        C.index_records(con, res["header"], res["records"], cdir.relative_to(C.PRIVATE))
    con.close()
    hd = res["header"]
    st = hd["stats"]
    n = hd.get("page_count") or hd.get("slice_count")
    return "done", (f"{fmt} units={n} items={st['items']}" + (f" panels={st['panels']} {st['panel_types']}" if fmt == "webtoon" else "")
                    + f" {hd['run']['seconds']}s rss={hd['run']['peak_rss_mb']}MB")


def select(args, rows):
    out = []
    want = set(args.hash or [])
    chs = set(args.chapters.split(",")) if args.chapters else None
    for h, m in rows:
        series, label, _ = C.parse_title(m["title"])
        if series in C.EXCLUDE_SERIES:
            continue
        if want and h not in want:
            continue
        if args.series and series != args.series:
            continue
        if chs and label not in chs:
            continue
        out.append((h, m))
    out.sort(key=lambda x: (C.parse_title(x[1]["title"])[0], C.parse_title(x[1]["title"])[2] if C.parse_title(x[1]["title"])[2] is not None else 1e9,
                            x[1]["title"]))
    return out


# ------------------------------------------------------------------ control files, caffeinate, workers
PAUSE_FILE = Path(os.environ.get("MANGA_TEXT_PAUSE_FILE", Path.home() / ".local/share/source-platform/governor/PAUSE"))
STOP_FILES = [C.RUNS / "STOP", C.PRIVATE.parent / "STOP"]


def stop_requested():
    return any(f.exists() for f in STOP_FILES)


def default_workers():
    try:
        return max(1, int(os.environ.get("OCR_MAX_WORKERS", "1")))
    except ValueError:
        return 1


def apply_thread_caps():
    """OCR_THREADS (optional) caps CPU threads in this process: torch, OpenCV and BLAS."""
    n = os.environ.get("OCR_THREADS")
    if not n:
        return
    os.environ.setdefault("OMP_NUM_THREADS", n)
    try:
        import cv2
        cv2.setNumThreads(int(n))
    except Exception:  # noqa: BLE001
        pass


class Caffeinate:
    """Holds `caffeinate -i -w <our pid>` only while there is work, so pausing or idling releases the sleep assertion."""

    def __init__(self):
        self.proc = None

    def hold(self):
        import subprocess
        if self.proc is None or self.proc.poll() is not None:
            self.proc = subprocess.Popen(["caffeinate", "-i", "-w", str(os.getpid())], stdin=subprocess.DEVNULL,
                                         stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    def release(self):
        if self.proc is not None and self.proc.poll() is None:
            self.proc.terminate()
        self.proc = None


def worker_run(h, meta, force=False):
    """Runs in a worker process: returns (status, detail, shape entry)."""
    import webtoon
    apply_thread_caps()
    profiles = webtoon.load_profiles()
    shapes = {}
    try:
        status, detail = process_one(h, meta, profiles, shapes, force)
    except Exception as e:  # noqa: BLE001
        status, detail = "error", f"{type(e).__name__}: {e}"
    return status, detail, shapes.get(h)


# ------------------------------------------------------------------ commands
def cmd_run(args):
    os.nice(args.nice)
    import webtoon
    profiles = webtoon.load_profiles()
    shapes = load_shapes()
    if not (args.hash or args.series or args.all):
        sys.exit("choose --hash, --series [--chapters] or --all")
    chosen = select(args, list(C.cat_rows()))
    prog = {"total_chapters": len(chosen), "done": 0, "skipped": 0, "missing": 0, "errors": 0, "pid": os.getpid(), "state": "running",
            "started_utc": now()}
    print(f"{len(chosen)} chapter(s); nice={args.nice}", flush=True)
    for i, (h, m) in enumerate(chosen, 1):
        prog["current"], prog["updated_utc"] = m["title"], now()
        if args.progress:
            Path(args.progress).write_text(json.dumps(prog, indent=1))
        try:
            status, detail = process_one(h, m, profiles, shapes, args.force)
        except Exception as e:  # noqa: BLE001
            status, detail = "error", f"{type(e).__name__}: {e}"
            traceback.print_exc()
        prog[{"done": "done", "skip": "skipped", "missing": "missing", "error": "errors"}[status]] += 1
        print(f"{status:7s}{m['title']} {h[:10]} {detail}", flush=True)
        if i % 25 == 0:
            save_shapes(shapes)
    save_shapes(shapes)
    C.write_catalog()
    prog["state"], prog["current"], prog["updated_utc"] = "finished", None, now()
    if args.progress:
        Path(args.progress).write_text(json.dumps(prog, indent=1))


def cmd_watch(args):
    os.nice(args.nice)
    apply_thread_caps()
    import webtoon
    workers = args.max_workers or default_workers()
    C.RUNS.mkdir(parents=True, exist_ok=True)
    lock = open(C.RUNS / "watch.lock", "a+")
    try:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except OSError:
        sys.exit("another watch instance holds private/runs/watch.lock")
    lock.seek(0)
    lock.truncate()
    lock.write(str(os.getpid()))
    lock.flush()
    (C.RUNS / "watch.pid").write_text(str(os.getpid()))
    logf = open(C.RUNS / "watch.log", "a")
    progf = C.RUNS / "watch_progress.json"
    shapes = load_shapes()
    tries = {}
    caff = Caffeinate()
    pause_file = Path(args.pause_file) if args.pause_file else PAUSE_FILE
    prog = {"pid": os.getpid(), "state": "starting", "started_utc": now(), "cycles": 0, "done": 0, "skipped": 0, "missing": 0,
            "errors": 0, "interval_s": args.interval, "workers": workers, "last_cycle_utc": None, "current": None,
            "pending_last_cycle": None, "pause_file": str(pause_file)}

    def save():
        prog["updated_utc"] = now()
        tmp = progf.with_suffix(".tmp")
        tmp.write_text(json.dumps(prog, indent=1))
        tmp.replace(progf)

    def wait_while_paused():
        """Idle (no work, caffeinate released) until the PAUSE file is gone or a STOP file appears."""
        if not pause_file.exists():
            return
        caff.release()
        prog["state"], prog["current"] = "paused", None
        save()
        log(f"PAUSE file present ({pause_file}); idle, caffeinate released", logf)
        while pause_file.exists() and not stop_requested():
            time.sleep(5)
        log("PAUSE cleared" if not stop_requested() else "STOP while paused", logf)

    def record(status, detail, title, h):
        if status == "error":
            tries[h] = tries.get(h, 0) + 1
        prog[{"done": "done", "skipped": "skipped", "skip": "skipped", "missing": "missing", "error": "errors"}[status]] += 1
        log(f"{status} {title} {h[:10]} {detail}", logf)

    log(f"watch start pid={os.getpid()} interval={args.interval}s nice={args.nice} workers={workers} pause_file={pause_file}", logf)
    for f in STOP_FILES:
        if f.exists():
            log(f"STOP file {f} present at start; removing it", logf)
            f.unlink()
    pool = None
    if workers > 1:
        import multiprocessing
        from concurrent.futures import ProcessPoolExecutor
        pool = ProcessPoolExecutor(max_workers=workers, mp_context=multiprocessing.get_context("spawn"))
    try:
        while True:
            wait_while_paused()
            if stop_requested():
                break
            books_done = 0
            # books first (databooks are the priority): scanned PDFs, fixed-layout EPUBs) from the governor's queue and our local list: one at a time
            try:
                import books
                for e in books.queue_entries():
                    if stop_requested() or pause_file.exists():
                        break
                    if tries.get("book:" + e["path"], 0) >= MAX_TRIES:
                        continue                                # failed three times in this run: leave it until restart
                    prog["current"] = "book: " + Path(e["path"]).name
                    save()
                    caff.hold()
                    try:
                        status, detail = run_book(e)
                    except Exception as ex:  # noqa: BLE001
                        status, detail = "error", f"{type(ex).__name__}: {ex}"
                    key = "book:" + e["path"]
                    if status == "error":
                        tries[key] = tries.get(key, 0) + 1
                    if status != "skip":
                        record(status if status != "skip" else "skipped", detail, Path(e["path"]).name, hashlib_sha(e["path"]))
                    books_done += status == "done"
            except Exception as ex:  # noqa: BLE001
                log(f"book queue check failed: {ex}", logf)
            profiles = webtoon.load_profiles()          # profile edits apply on the next cycle
            rows = [(h, m) for h, m in C.cat_rows() if C.parse_title(m["title"])[0] not in C.EXCLUDE_SERIES]
            rows.sort(key=lambda x: (C.parse_title(x[1]["title"])[0], C.parse_title(x[1]["title"])[2] or 1e9, x[1]["title"]))
            todo = []
            for h, m in rows:
                try:
                    if not C.cbz_path(h).exists() or tries.get(h, 0) >= MAX_TRIES:
                        continue
                    if not is_done(h, m, profiles, shapes):
                        todo.append((h, m))
                except Exception as e:  # noqa: BLE001
                    log(f"check failed {m['title']}: {e}", logf)
            prog["pending_last_cycle"], prog["state"], prog["cycles"] = len(todo), "working", prog["cycles"] + 1
            log(f"cycle {prog['cycles']}: {len(rows)} catalogue chapters, {len(todo)} to process", logf)
            save()
            processed = 0
            if todo:
                caff.hold()
            if pool is None:
                for h, m in todo:
                    if stop_requested() or pause_file.exists():
                        break                                   # finish the current item (done), then stop taking work
                    prog["current"] = m["title"]
                    save()
                    try:
                        status, detail = process_one(h, m, profiles, shapes)
                    except Exception as e:  # noqa: BLE001
                        status, detail = "error", f"{type(e).__name__}: {e}"
                        logf.write(traceback.format_exc())
                    record(status, detail, m["title"], h)
                    processed += status == "done"
                    if processed and processed % 20 == 0:
                        save_shapes(shapes)
                        C.write_catalog()
            else:
                from concurrent.futures import FIRST_COMPLETED, wait
                inflight, queue = {}, list(todo)
                while queue or inflight:
                    while queue and len(inflight) < workers and not stop_requested() and not pause_file.exists():
                        h, m = queue.pop(0)
                        inflight[pool.submit(worker_run, h, m)] = (h, m)
                    if not inflight:
                        break
                    prog["current"] = "; ".join(m["title"] for _, m in inflight.values())
                    save()
                    done, _ = wait(list(inflight), timeout=30, return_when=FIRST_COMPLETED)
                    for fut in done:
                        h, m = inflight.pop(fut)
                        try:
                            status, detail, shp = fut.result()
                            if shp:
                                shapes[h] = shp
                        except Exception as e:  # noqa: BLE001
                            status, detail = "error", f"{type(e).__name__}: {e}"
                        record(status, detail, m["title"], h)
                        processed += status == "done"
                    if stop_requested() or pause_file.exists():
                        queue.clear()                           # let in-flight chapters finish
            save_shapes(shapes)
            if processed or books_done:
                C.write_catalog()
            prog["current"], prog["last_cycle_utc"] = None, now()
            if stop_requested():
                break
            if pause_file.exists():
                continue
            caff.release()
            prog["state"] = "idle"
            save()
            waited = 0
            while waited < args.interval and not stop_requested() and not pause_file.exists():
                time.sleep(5)
                waited += 5
    finally:
        caff.release()
        if pool is not None:
            pool.shutdown(wait=True)
        prog["state"], prog["current"] = "stopped", None
        save()
        log("exiting", logf)


def cmd_search(args):
    rows = C.search(args.query, args.series, args.chapter, args.kind, args.limit, args.loose)
    for series, chapter, loc, loc_kind, half, gid, order, kind, conf, bbox, path in rows:
        print(f"{series} | ch {chapter} | {loc_kind} {loc}{'/' + half if half else ''} | box {bbox} | {kind} | {gid} order={order} "
              f"conf={conf} | {path}")
    print(f"{len(rows)} hit(s)")


def jprint(d):
    print(json.dumps(d, ensure_ascii=False, indent=None, separators=(",", ":")))


def cmd_read_page(args):
    import access
    import llm
    for f, head in access._chapters(args.series, args.chapter):
        text, cached = llm.read_page(head, args.loc, args.model, args.prompt)
        jprint({"series": head["series"], "chapter": head["chapter"], "loc": args.loc, "model": args.model, "prompt": args.prompt,
                "cached": cached, "chars": len(text), **({"text": text[:args.max_chars]} if args.show else {})})
        return
    sys.exit("no such chapter")


def run_book(entry, force=False):
    """Process one queued or explicit book. Returns (status, detail)."""
    import books
    import webtoon
    path = Path(entry["path"])
    langs, mode = books.entry_options(entry)
    if entry.get("mode"):
        mode = entry["mode"]
    profile = webtoon.load_profiles()["databook"]
    series = entry.get("title") or books.book_title(path)
    tools = books.versions(langs, mode, profile)
    if not force and books.book_done(path, series, tools):
        return "skip", "unchanged"
    res = books.process_book(path, series, langs, mode, profile, tools)
    if "error" in res:
        return "error", res["error"]
    books.write_book(res, series)
    st = res["header"]["stats"]
    return "done", (f"book {res['header']['page_count']} pages, ocr {st['ocr_pages']}, text layer {st['text_layer_pages']}, items {st['items']}, "
                    f"regions {st['panels']}, empty {st['empty_pages']}, {res['header']['run']['seconds']}s")


def cmd_book(args):
    os.nice(args.nice)
    status, detail = run_book({"path": args.path, "title": args.title, "lang": args.lang,
                               "mode": None if args.ocr == "auto" else args.ocr}, args.force)
    print(status, detail)
    C.write_catalog()


def cmd_fetch_models(args):
    import models
    models.fetch_and_verify()


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("doctor").set_defaults(fn=lambda a: sys.exit(C.doctor()))
    r = sub.add_parser("run")
    r.add_argument("--hash", action="append")
    r.add_argument("--series")
    r.add_argument("--chapters")
    r.add_argument("--all", action="store_true")
    r.add_argument("--force", action="store_true")
    r.add_argument("--nice", type=int, default=10)
    r.add_argument("--progress")
    r.set_defaults(fn=cmd_run)
    w = sub.add_parser("watch")
    w.add_argument("--interval", type=int, default=600)
    w.add_argument("--nice", type=int, default=10)
    w.add_argument("--max-workers", type=int, default=0, help="parallel chapter workers (default env OCR_MAX_WORKERS, else 1)")
    w.add_argument("--pause-file", help="pause while this file exists (default ~/.local/share/source-platform/governor/PAUSE)")
    w.set_defaults(fn=cmd_watch)
    s = sub.add_parser("search")
    s.add_argument("query")
    s.add_argument("--series")
    s.add_argument("--chapter")
    s.add_argument("--kind")
    s.add_argument("--limit", type=int, default=20)
    s.add_argument("--loose", action="store_true", help="ignore case, accents, spaces and hyphens (finds words split at line breaks)")
    s.set_defaults(fn=cmd_search)
    sm = sub.add_parser("summary")
    sm.add_argument("--series")
    sm.add_argument("--chapter")
    sm.set_defaults(fn=lambda a: jprint(__import__("access").summary(a.series, a.chapter)))
    q = sub.add_parser("query")
    q.add_argument("term")
    q.add_argument("--series")
    q.add_argument("--chapter")
    q.add_argument("--kind")
    q.add_argument("--limit", type=int, default=20)
    q.add_argument("--snippet", type=int, default=0)
    q.set_defaults(fn=lambda a: jprint(__import__("access").query(a.term, a.series, a.chapter, a.kind, a.limit, a.snippet)))
    sl = sub.add_parser("slice")
    sl.add_argument("--series", required=True)
    sl.add_argument("--chapter", required=True)
    sl.add_argument("--loc", required=True, help="page number (manga) or strip index (webtoon)")
    sl.add_argument("--max-chars", type=int, default=1500)
    sl.set_defaults(fn=lambda a: jprint(__import__("access").slice_page(a.series, a.chapter, a.loc, a.max_chars)))
    ex = sub.add_parser("export")
    ex.add_argument("--series", required=True)
    ex.add_argument("--chapter")
    ex.set_defaults(fn=lambda a: jprint({"exported": __import__("access").export_markdown(a.series, a.chapter)}))
    vf = sub.add_parser("verify")
    vf.add_argument("--series", required=True)
    vf.add_argument("--chapter")
    vf.set_defaults(fn=lambda a: jprint(__import__("access").verify(a.series, a.chapter)))
    rp = sub.add_parser("read-page")
    rp.add_argument("--series", required=True)
    rp.add_argument("--chapter", required=True)
    rp.add_argument("--loc", required=True)
    rp.add_argument("--model", required=True)
    rp.add_argument("--prompt", default="page-json-v1")
    rp.add_argument("--show", action="store_true")
    rp.add_argument("--max-chars", type=int, default=1500)
    rp.set_defaults(fn=cmd_read_page)
    sub.add_parser("fetch-models").set_defaults(fn=cmd_fetch_models)
    bk = sub.add_parser("book")
    bk.add_argument("--path", required=True)
    bk.add_argument("--title")
    bk.add_argument("--lang", help="ja, en or ja,en (default ja-JP and en-US)")
    bk.add_argument("--ocr", choices=["auto", "always", "never"], default="auto")
    bk.add_argument("--force", action="store_true")
    bk.add_argument("--nice", type=int, default=10)
    bk.set_defaults(fn=cmd_book)
    sub.add_parser("catalog").set_defaults(fn=lambda a: print(json.dumps(C.write_catalog()["totals"])))
    sub.add_parser("reindex").set_defaults(fn=lambda a: print(C.reindex_all(), "chapters indexed"))

    def profiles_cmd(a):
        import webtoon
        for n, p in webtoon.load_profiles().items():
            print(n, webtoon.profile_hash(p), p.get("series"))
    sub.add_parser("profiles").set_defaults(fn=profiles_cmd)
    sh = sub.add_parser("shape")
    sh.add_argument("--hash", required=True)
    sh.set_defaults(fn=lambda a: print(C.detect_format(C.member_sizes(a.hash), C.continuity_score(a.hash)), round(C.continuity_score(a.hash), 3)))
    a = ap.parse_args()
    a.fn(a)


if __name__ == "__main__":
    main()
