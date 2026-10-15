#!/usr/bin/env python3
"""Multi-world watcher: starts Steam-gated lanes when installed, then the auditor when the other lanes finish (gated lanes still waiting after 24 h count as blocked). 5-minute poll, 7-day limit."""
import json, os, re, glob, subprocess, time
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
lanes = json.load(open(os.path.join(ROOT, "lanes", "lanes.json")))
SF = os.path.join(HERE, "watch.state.json"); STEAM = os.path.expanduser("~/Library/Application Support/Steam/steamapps")
START = time.time()
def log(m):
    with open(os.path.join(HERE, "watch.log"), "a") as f: f.write(time.strftime("%Y-%m-%d %H:%M:%S ") + m + "\n")
def installed():
    out = []
    for a in glob.glob(os.path.join(STEAM, "appmanifest_*.acf")):
        t = open(a, errors="ignore").read()
        n = re.search(r'"name"\s+"([^"]+)"', t); d = re.search(r'"installdir"\s+"([^"]+)"', t)
        if n and d and '"StateFlags"\t\t"4"' in t and os.path.isdir(os.path.join(STEAM, "common", d.group(1))): out.append(n.group(1).lower())
    return out
def running(k): return subprocess.run(["pgrep", "-f", f"runs/{k}.last.md"], capture_output=True).returncode == 0
def done(k):
    p = os.path.join(HERE, f"{k}.last.md"); return os.path.exists(p) and os.path.getsize(p) > 0 and not running(k)
def launch(k):
    subprocess.run(["python3", os.path.join(HERE, "launch.py"), k, os.path.join(ROOT, "lanes", f"{k}.prompt.md")])
    state[k] = time.strftime("%Y-%m-%d %H:%M:%S"); json.dump(state, open(SF, "w"), indent=1); log(f"launched {k}")
state = json.load(open(SF)) if os.path.exists(SF) else {}
log("watch start")
while time.time() < START + 7 * 86400:
    todo = [k for k, v in lanes.items() if v.get("gate") and k not in state]
    if not todo: break
    names = installed()
    for k in todo:
        g = lanes[k]["gate"]
        if g["kind"] == "steam_name" and any(any(s in n for s in g["names"]) for n in names): launch(k)
        elif g["kind"] == "lanes_done":
            late = time.time() - START > g.get("timeout_hours", 24) * 3600
            if all(done(x) or (x not in state and late) for x in g["lanes"]) and not any(running(x) for x in g["lanes"]): launch(k)
    time.sleep(300)
log("watch exit")
