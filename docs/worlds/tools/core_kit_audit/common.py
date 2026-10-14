"""Shared paths for the world core kit audit tools."""
import os, subprocess

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
DISPATCH = os.path.join(REPO, "docs", "gm", "dispatch")
WORLDS = os.path.join(REPO, "docs", "worlds")


def run_dirs():
    return sorted(d for d in os.listdir(DISPATCH) if d.startswith("world-core-kit-"))


def lane_alive(run_dir, lane):
    """True if a codex process is writing this lane's .last.md file."""
    out = subprocess.run(["ps", "-eo", "args"], capture_output=True, text=True).stdout
    needle = os.path.join(run_dir, "runs", f"{lane}.last.md")
    return any(needle in line and "codex" in line for line in out.splitlines())
