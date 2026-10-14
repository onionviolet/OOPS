#!/usr/bin/env python3
"""Round-4 watcher: resumes a lane's session once the lanes it waits on have finished. 5-minute poll, 2-day limit."""
import json, os, subprocess, time
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
lanes = json.load(open(os.path.join(ROOT, "lanes.json")))
SF = os.path.join(HERE, "watch2.state.json")
def log(m):
    with open(os.path.join(HERE, "watch2.log"), "a") as f: f.write(time.strftime("%Y-%m-%d %H:%M:%S ") + m + "\n")
def running(name):
    return subprocess.run(["pgrep", "-f", f"runs/{name}.last.md"], capture_output=True).returncode == 0
def done(name):
    p = os.path.join(HERE, f"{name}.last.md")
    return os.path.exists(p) and os.path.getsize(p) > 0 and not running(name)
state = json.load(open(SF)) if os.path.exists(SF) else {}
end = time.time() + 2 * 86400
log("watch2 start")
while time.time() < end:
    todo = [k for k, v in lanes.items() if (v.get("gate") or {}).get("kind") == "lane_done" and k not in state]
    if not todo: break
    for k in todo:
        g = lanes[k]["gate"]
        if all(done(x) and x not in [t for t in todo if t != k] for x in g["lanes"]):
            args = ["python3", os.path.join(HERE, "launch.py"), k, os.path.join(ROOT, "lanes", f"{k}.prompt.md")]
            if lanes[k].get("resume"): args.append(lanes[k]["resume"])
            subprocess.run(args, env=dict(os.environ, LANE_CWD=lanes[k].get("cwd") or "/Users/weiwei/code/yet-another-idle-rpg"))
            state[k] = time.strftime("%Y-%m-%d %H:%M:%S"); json.dump(state, open(SF, "w"), indent=1); log(f"launched {k}")
    time.sleep(300)
log("watch2 exit")
