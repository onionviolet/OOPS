#!/usr/bin/env python3
"""Starts each gated feature-scout lane once Steam reports its app fully installed (StateFlags 4, nonzero SizeOnDisk, files on disk). 5-minute poll, 7-day limit. Each lane starts at most once (state file)."""
import json, os, re, subprocess, time
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
STEAM = os.path.expanduser("~/Library/Application Support/Steam/steamapps")
GATES = {"fs-zomboid": "108600", "fs-potionomics": "1874490"}
SF = os.path.join(HERE, "watch.state.json")
def log(m):
    with open(os.path.join(HERE, "watch.log"), "a") as f: f.write(time.strftime("%Y-%m-%d %H:%M:%S ") + m + "\n")
def ready(app):
    p = os.path.join(STEAM, f"appmanifest_{app}.acf")
    if not os.path.exists(p): return False
    t = open(p, errors="ignore").read()
    flags = re.search(r'"StateFlags"\s+"(\d+)"', t); size = re.search(r'"SizeOnDisk"\s+"(\d+)"', t); d = re.search(r'"installdir"\s+"([^"]+)"', t)
    if not (flags and size and d) or flags.group(1) != "4" or int(size.group(1)) == 0: return False
    root = os.path.join(STEAM, "common", d.group(1))
    return os.path.isdir(root) and any(files for _, _, files in os.walk(root))
state = json.load(open(SF)) if os.path.exists(SF) else {}
end = time.time() + 7 * 86400; log("watch start")
while time.time() < end:
    todo = [k for k in GATES if k not in state]
    if not todo: break
    for k in todo:
        if ready(GATES[k]):
            subprocess.run(["python3", os.path.join(HERE, "launch.py"), k, os.path.join(ROOT, "lanes", f"{k}.prompt.md")])
            state[k] = time.strftime("%Y-%m-%d %H:%M:%S"); json.dump(state, open(SF, "w"), indent=1); log(f"launched {k}")
    time.sleep(300)
log("watch exit")
