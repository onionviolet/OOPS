#!/usr/bin/env python3
"""Write a lane prompt in the standard shape.
Usage: new_lane.py <run-dir> <lane> "<title>" <owned-file-name> <task-file>
The task file holds the numbered task list."""
import os, sys
from common import REPO

run_dir, lane, title, owned, task_file = sys.argv[1:6]
run_dir = os.path.abspath(run_dir)
name = os.path.basename(run_dir)
rel_run = os.path.relpath(run_dir, REPO)
rel_out = f"docs/worlds/{name}"
task = open(task_file).read().strip()
text = f"""Lane {lane}: {title}

Read `{rel_run}/COMMON.md` first, then the kit root
`docs/worlds/WORLD_CORE_KIT_2026-10-14.md` (or its successor) and
`docs/worlds/WORLD_CORE_KIT_AUDIT_PLAYBOOK.md`. Other lanes write nearby
files in `{rel_out}/`; read them if useful, do not edit. Design only.

Own exactly:
- `{rel_out}/{owned}` (create)
- `{rel_run}/{lane}_REPORT.md` (create)

Task:
{task}
"""
path = os.path.join(run_dir, f"{lane}.md")
open(path, "w").write(text)
print(path)
print(f"Launch: cd {rel_run} && python3 runs/launch.py {lane} {lane}.md")
