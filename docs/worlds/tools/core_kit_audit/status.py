#!/usr/bin/env python3
"""Lane status for a core kit run. Usage: status.py [run-dir] (default: latest)"""
import glob, os, re, sys
from common import DISPATCH, WORLDS, run_dirs, lane_alive

run_dir = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.join(DISPATCH, run_dirs()[-1])
name = os.path.basename(run_dir)
lanes = sorted({re.match(r"(W\d+)\.md$", os.path.basename(p)).group(1)
                for p in glob.glob(os.path.join(run_dir, "W*.md"))
                if re.match(r"W\d+\.md$", os.path.basename(p))}, key=lambda s: int(s[1:]))
out_dir = os.path.join(WORLDS, name)
for lane in lanes:
    report = os.path.exists(os.path.join(run_dir, f"{lane}_REPORT.md"))
    alive = lane_alive(run_dir, lane)
    launched = os.path.exists(os.path.join(run_dir, "runs", f"{lane}.log"))
    outs = glob.glob(os.path.join(out_dir, f"{lane}_*")) + glob.glob(os.path.join(out_dir, "cards")) * (lane == "W19")
    size = sum(os.path.getsize(p) for p in outs if os.path.isfile(p))
    state = ("running" if alive else "finished" if report else
             "stalled" if launched else "not launched")
    print(f"{lane:5} {state:13} report={'yes' if report else 'no ':3} out={size//1024}KB")
