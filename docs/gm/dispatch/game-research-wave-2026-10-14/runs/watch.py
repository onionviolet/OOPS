#!/usr/bin/env python3
"""Payload watcher: launches gated lanes once their gate opens. Polls every 5 min, stops after 7 days or when none remain."""
import json, os, subprocess, time, glob
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
lanes = json.load(open(os.path.join(ROOT, "lanes.json")))
done_file = os.path.join(HERE, "watch.state.json")
def log(m):
    with open(os.path.join(HERE, "watch.log"), "a") as f: f.write(time.strftime("%Y-%m-%d %H:%M:%S ") + m + "\n")
def ready(g):
    if g["kind"] == "file_contains":
        try: return g["text"] in open(g["path"]).read()
        except OSError: return False
    acf = f"/Users/weiwei/Library/Application Support/Steam/steamapps/appmanifest_{g['appid']}.acf"
    try: t = open(acf).read()
    except OSError: return False
    if '"StateFlags"\t\t"4"' not in t: return False
    import re
    m = re.search(r'"installdir"\s+"([^"]+)"', t)
    d = os.path.join(os.path.dirname(acf), "common", m.group(1)) if m else g["dir"]
    exes = glob.glob(os.path.join(glob.escape(d), "**", "*.exe"), recursive=True)
    return any("unins" not in e.lower() and "crash" not in e.lower() for e in exes)
state = json.load(open(done_file)) if os.path.exists(done_file) else {}
end = time.time() + 7 * 86400
log("watcher start")
while time.time() < end:
    pending = [k for k, v in lanes.items() if v.get("gate") and k not in state]
    if not pending: break
    for k in pending:
        if ready(lanes[k]["gate"]):
            env = dict(os.environ, LANE_CWD=lanes[k].get("cwd") or "/Users/weiwei/code/yet-another-idle-rpg")
            subprocess.run(["python3", os.path.join(HERE, "launch.py"), k, os.path.join(ROOT, "lanes", f"{k}.prompt.md")], env=env)
            state[k] = time.strftime("%Y-%m-%d %H:%M:%S"); json.dump(state, open(done_file, "w"), indent=1)
            log(f"launched {k}")
    time.sleep(300)
log("watcher exit")
