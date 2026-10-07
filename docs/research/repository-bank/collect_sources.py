#!/usr/bin/env python3
"""Collect public source references without executing upstream code."""
import argparse
import concurrent.futures
import datetime
import hashlib
import json
import os
from pathlib import Path
import subprocess


def run_git(args, timeout=120):
    env = dict(os.environ, GIT_TERMINAL_PROMPT="0", GCM_INTERACTIVE="Never")
    command = ["git", "-c", "core.hooksPath=/dev/null", "-c", "protocol.file.allow=never", *args]
    return subprocess.run(command, env=env, capture_output=True, text=True, timeout=timeout)


def collect(row, cache_root):
    row = dict(row)
    destination = cache_root / (row["id"] + ".git")
    try:
        if not destination.exists():
            result = run_git(["clone", "--bare", "--depth=1", "--filter=blob:none", row["url"] + ".git", str(destination)])
            if result.returncode:
                raise RuntimeError(result.stderr.strip()[-1200:])
        else:
            result = run_git(["--git-dir=" + str(destination), "remote", "get-url", "origin"])
            if result.returncode or result.stdout.strip() != row["url"] + ".git":
                raise RuntimeError("Existing cache has a different or unreadable origin; left untouched.")
        head = run_git(["--git-dir=" + str(destination), "rev-parse", "HEAD"])
        if head.returncode:
            raise RuntimeError(head.stderr.strip()[-1200:])
        row["source_commit"] = head.stdout.strip()
        branch = run_git(["--git-dir=" + str(destination), "symbolic-ref", "--short", "HEAD"])
        row["source_branch"] = branch.stdout.strip() if branch.returncode == 0 else None
        row["cache_key"] = destination.name
        row["collection_status"] = "pinned_partial_mirror"
        row["cache_limit"] = "Shallow default-head Git objects and selected source blobs; not a complete offline copy or all-branch review."
        seeds = []
        for path in row.get("seed_paths", []):
            blob = run_git(["--git-dir=" + str(destination), "show", row["source_commit"] + ":" + path], timeout=45)
            if blob.returncode == 0:
                seeds.append({"path": path, "status": "readable", "sha256": hashlib.sha256(blob.stdout.encode()).hexdigest()})
            else:
                seeds.append({"path": path, "status": "unavailable_at_default_head"})
        row["seed_evidence"] = seeds
    except (RuntimeError, subprocess.TimeoutExpired, OSError) as error:
        row["collection_status"] = "collection_failed"
        row["collection_error"] = str(error)[-1200:]
    print(row["id"] + ": " + row["collection_status"], flush=True)
    return row


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--cache-root", type=Path, default=Path.home() / ".cache" / "yairpg-repository-bank" / "2026-10-05")
    parser.add_argument("--workers", type=int, default=4)
    args = parser.parse_args()
    manifest_path = Path(__file__).with_name("SOURCES.json")
    manifest = json.loads(manifest_path.read_text())
    args.cache_root.mkdir(parents=True, exist_ok=True)
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
        manifest["repositories"] = list(pool.map(lambda row: collect(row, args.cache_root), manifest["repositories"]))
    manifest["collected_at_utc"] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    manifest["collection_summary"] = {
        "repositories": len(manifest["repositories"]),
        "pinned_partial_mirrors": sum(row["collection_status"] == "pinned_partial_mirror" for row in manifest["repositories"]),
        "failed": sum(row["collection_status"] == "collection_failed" for row in manifest["repositories"]),
        "reference_works": len(manifest["reference_works"]),
        "executed_upstream_code": False,
    }
    temporary = manifest_path.with_suffix(".json.tmp")
    temporary.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    temporary.replace(manifest_path)
    (args.cache_root / "LOCAL_CACHE.json").write_text(json.dumps({"root": str(args.cache_root), "manifest": str(manifest_path), "collected_at_utc": manifest["collected_at_utc"]}, indent=2) + "\n")
    print(json.dumps(manifest["collection_summary"]), flush=True)


if __name__ == "__main__":
    main()
