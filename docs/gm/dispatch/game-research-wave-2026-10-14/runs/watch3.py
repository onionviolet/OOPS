#!/usr/bin/env python3
"""Backfill watcher: starts each install-gated aspect lane once Steam reports a matching game fully installed. Max 6 backfill lanes at once, 5-minute poll, 7-day limit."""
import json, os, re, glob, subprocess, time
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
LJ = os.path.join(ROOT, "lanes", "backfill", "lanes.json"); lanes = json.load(open(LJ))
SF = os.path.join(HERE, "watch3.state.json"); STEAM = os.path.expanduser("~/Library/Application Support/Steam/steamapps")
def log(m):
    with open(os.path.join(HERE, "watch3.log"), "a") as f: f.write(time.strftime("%Y-%m-%d %H:%M:%S ") + m + "\n")
def installed():
    out = []
    for a in glob.glob(os.path.join(STEAM, "appmanifest_*.acf")):
        t = open(a, errors="ignore").read()
        n = re.search(r'"name"\s+"([^"]+)"', t); d = re.search(r'"installdir"\s+"([^"]+)"', t)
        if n and d and '"StateFlags"\t\t"4"' in t:
            p = os.path.join(STEAM, "common", d.group(1))
            if os.path.isdir(p) and any(files for _, _, files in os.walk(p)): out.append(n.group(1).lower())
    return out
def running_bf():
    r = subprocess.run(["pgrep", "-fl", "runs/bf-"], capture_output=True, text=True).stdout
    return len([l for l in r.splitlines() if "codex" in l])
state = json.load(open(SF)) if os.path.exists(SF) else {}
end = time.time() + 7 * 86400; log("watch3 start")
while time.time() < end:
    todo = [k for k, v in lanes.items() if v.get("gate") and k not in state]
    if not todo: break
    names = installed()
    for k in todo:
        if running_bf() >= 6: break
        if any(any(s in n for s in lanes[k]["gate"]["names"]) and not ("2" in n and not any("2" in s for s in lanes[k]["gate"]["names"])) for n in names):
            subprocess.run(["python3", os.path.join(HERE, "launch.py"), k, os.path.join(ROOT, "lanes", "backfill", f"{k}.prompt.md")])
            state[k] = time.strftime("%Y-%m-%d %H:%M:%S"); json.dump(state, open(SF, "w"), indent=1); log(f"launched {k}")
            time.sleep(5)
    time.sleep(300)
log("watch3 exit")
