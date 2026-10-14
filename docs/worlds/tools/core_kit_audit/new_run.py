#!/usr/bin/env python3
"""Create a new core kit audit run. Usage: new_run.py <YYYY-MM-DD>"""
import os, shutil, sys
from common import DISPATCH, WORLDS, run_dirs

date = sys.argv[1]
name = f"world-core-kit-{date}"
dst = os.path.join(DISPATCH, name)
if os.path.exists(dst):
    sys.exit(f"{dst} exists; add lanes to it instead")
prev = run_dirs()[-1] if run_dirs() else None
os.makedirs(os.path.join(dst, "runs"))
os.makedirs(os.path.join(WORLDS, name), exist_ok=True)
if prev:
    src = os.path.join(DISPATCH, prev)
    shutil.copy(os.path.join(src, "runs", "launch.py"), os.path.join(dst, "runs", "launch.py"))
    common = open(os.path.join(src, "COMMON.md")).read()
    open(os.path.join(dst, "COMMON.md"), "w").write(
        common.replace(prev, name) + f"\n\nCopied from {prev}; update the request quote and world list.\n")
with open(os.path.join(dst, "runs", "SESSIONS.md"), "w") as f:
    f.write(f"# Codex sessions ({name})\n\n| Run | Session id | Writes |\n| --- | --- | --- |\n")
print(dst)
print("Next: edit COMMON.md request quote, then new_lane.py for each lane.")
