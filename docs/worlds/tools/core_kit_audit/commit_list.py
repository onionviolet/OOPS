#!/usr/bin/env python3
"""Print kit paths safe to commit (finished lanes only).
Usage: commit_list.py [run-dir] > list.txt; git commit --pathspec-from-file=list.txt"""
import glob, os, re, sys
from common import REPO, DISPATCH, WORLDS, run_dirs, lane_alive

run_dir = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.join(DISPATCH, run_dirs()[-1])
name = os.path.basename(run_dir)
rel = lambda p: os.path.relpath(p, REPO)
paths = []
for p in ["docs/worlds/WORLD_CORE_KIT_2026-10-14.md", "docs/worlds/WORLD_CORE_KIT_AUDIT_PLAYBOOK.md",
          "docs/worlds/templates/WORLD_CORE_KIT_TEMPLATE.md"]:
    if os.path.exists(os.path.join(REPO, p)):
        paths.append(p)
paths += glob.glob(os.path.join(REPO, "docs/worlds/tools/core_kit_audit/*.py"))
paths += [os.path.join(run_dir, f) for f in ("COMMON.md", "runs/SESSIONS.md", "runs/launch.py")]
for prompt in glob.glob(os.path.join(run_dir, "W*.md")):
    m = re.match(r"(W\d+)\.md$", os.path.basename(prompt))
    if not m:
        continue
    lane = m.group(1)
    paths.append(prompt)
    report = os.path.join(run_dir, f"{lane}_REPORT.md")
    if os.path.exists(report) and not lane_alive(run_dir, lane):
        paths.append(report)
        paths += glob.glob(os.path.join(WORLDS, name, f"{lane}_*"))
        if lane == "W19":
            paths += glob.glob(os.path.join(WORLDS, name, "cards", "*.md"))
for p in sorted({rel(p) if os.path.isabs(p) else p for p in paths}):
    if os.path.exists(os.path.join(REPO, p)):
        print(p)
