#!/usr/bin/env python3
"""Small, standard-library tools for launching and inspecting Codex lanes."""
from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import time


def launch(args: argparse.Namespace) -> int:
    runs = Path(args.runs).resolve()
    prompt = Path(args.prompt).resolve()
    workdir = Path(args.workdir).resolve()
    runs.mkdir(parents=True, exist_ok=True)
    if not prompt.is_file():
        raise SystemExit(f"prompt file does not exist: {prompt}")
    if not workdir.is_dir():
        raise SystemExit(f"workdir does not exist: {workdir}")
    binary = args.binary or os.environ.get("CODEX_BIN") or shutil.which("codex")
    if not binary:
        raise SystemExit("Codex CLI not found; pass --binary, set CODEX_BIN, or add codex to PATH")
    binary = str(Path(binary).expanduser()) if os.path.sep in binary else binary
    name = args.name
    log_path = runs / f"{name}.log"
    last_path = runs / f"{name}.last.md"
    pid_path = runs / f"{name}.pid.json"
    if pid_path.exists():
        old = json.loads(pid_path.read_text())
        if _alive(old.get("pid")):
            raise SystemExit(f"lane {name} appears active (pid {old['pid']}); inspect it before relaunching")

    cmd = [binary, "exec"]
    if args.resume:
        cmd += ["resume", args.resume]
    cmd += ["--skip-git-repo-check", "-m", args.model, "-c", f'model_reasoning_effort="{args.effort}"']
    if args.approve_for_me:
        cmd.append("--approve-for-me")
    for directory in args.add_dir:
        cmd += ["--add-dir", str(Path(directory).expanduser().resolve())]
    cmd += ["-o", str(last_path), prompt.read_text()]
    env = os.environ.copy()
    with log_path.open("ab", buffering=0) as log:
        proc = subprocess.Popen(cmd, cwd=workdir, stdin=subprocess.DEVNULL, stdout=log,
                                stderr=subprocess.STDOUT, start_new_session=True, env=env)
    receipt = {"name": name, "pid": proc.pid, "pgid": proc.pid, "started_at": time.time(),
               "cwd": str(workdir), "prompt": str(prompt), "model": args.model,
               "effort": args.effort, "log": str(log_path), "last_message": str(last_path),
               "command": cmd[:-1] + ["<prompt text>"]}
    pid_path.write_text(json.dumps(receipt, indent=2) + "\n")
    print(json.dumps(receipt, indent=2))
    return 0


def _alive(pid: int | None) -> bool:
    if not isinstance(pid, int):
        return False
    try:
        os.kill(pid, 0)
        return True
    except ProcessLookupError:
        return False
    except PermissionError:
        return True


def status(args: argparse.Namespace) -> int:
    runs = Path(args.runs).resolve()
    receipts = sorted(runs.glob("*.pid.json")) if runs.exists() else []
    if args.name:
        receipts = [p for p in receipts if p.name == f"{args.name}.pid.json"]
    if not receipts:
        print("No lane receipts found." if not args.name else f"No receipt for {args.name}.")
        return 0
    rows = []
    for path in receipts:
        item = json.loads(path.read_text())
        item["status"] = "running" if _alive(item.get("pid")) else "exited"
        item["last_message_exists"] = Path(item["last_message"]).is_file()
        item["log_bytes"] = Path(item["log"]).stat().st_size if Path(item["log"]).exists() else 0
        rows.append(item)
    print(json.dumps(rows, indent=2))
    return 0


def git(root: Path, *args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(["git", *args], cwd=root, text=True, stdout=subprocess.PIPE,
                          stderr=subprocess.PIPE, check=False)


def merge_report(args: argparse.Namespace) -> int:
    root = Path(args.repo).resolve()
    branch = git(root, "branch", "--show-current").stdout.strip()
    head = git(root, "rev-parse", "HEAD")
    base_ref = git(root, "rev-parse", "--verify", args.base)
    report: dict[str, object] = {"repo": str(root), "branch": branch, "base": args.base,
                                 "ready": False, "blockers": [], "checks": {}}
    blockers = report["blockers"]
    assert isinstance(blockers, list)
    if head.returncode or base_ref.returncode:
        blockers.append("branch or base ref cannot be resolved")
        print(json.dumps(report, indent=2))
        return 1
    head_sha, base_sha = head.stdout.strip(), base_ref.stdout.strip()
    report.update(head=head_sha, base_sha=base_sha)
    status = git(root, "status", "--porcelain", "--untracked-files=all").stdout.splitlines()
    report["checks"]["clean_worktree"] = not status  # type: ignore[index]
    if status:
        blockers.append(f"worktree has {len(status)} tracked, staged, or untracked change(s)")
    mb = git(root, "merge-base", args.base, "HEAD")
    if mb.returncode:
        blockers.append("branch and base have no merge base")
    else:
        merge_base = mb.stdout.strip()
        report["merge_base"] = merge_base
        report["checks"]["base_is_ancestor"] = merge_base == base_sha  # type: ignore[index]
        report["checks"]["branch_is_ancestor"] = merge_base == head_sha  # type: ignore[index]
        if merge_base != base_sha:
            blockers.append("branch does not contain the current base; rebase or merge it before integration")
        if merge_base == head_sha:
            blockers.append("branch has no commits beyond the base")
        tree = git(root, "merge-tree", "--write-tree", args.base, "HEAD")
        report["checks"]["merge_tree_clean"] = tree.returncode == 0  # type: ignore[index]
        if tree.returncode:
            blockers.append("git merge-tree reports conflicts (or is unsupported by this Git version)")
        else:
            report["merged_tree"] = tree.stdout.splitlines()[0] if tree.stdout.splitlines() else None
    report["changed_paths"] = git(root, "diff", "--name-status", f"{args.base}...HEAD").stdout.splitlines()
    report["ready"] = not blockers
    print(json.dumps(report, indent=2))
    return 0 if report["ready"] else 1


def parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description=__doc__)
    sub = p.add_subparsers(dest="command", required=True)
    lp = sub.add_parser("launch", help="launch a detached Codex lane")
    lp.add_argument("name")
    lp.add_argument("prompt")
    lp.add_argument("workdir")
    lp.add_argument("--runs", required=True, help="directory for logs and receipts")
    lp.add_argument("--model", default="gpt-6-luna")
    lp.add_argument("--effort", default="low")
    lp.add_argument("--resume")
    lp.add_argument("--binary")
    lp.add_argument("--add-dir", action="append", default=[])
    lp.add_argument("--approve-for-me", action="store_true", help="pass Codex CLI's explicit auto-approval flag")
    lp.set_defaults(func=launch)
    sp = sub.add_parser("status", help="inspect lane receipts and process state")
    sp.add_argument("--runs", required=True)
    sp.add_argument("--name")
    sp.set_defaults(func=status)
    mp = sub.add_parser("merge-report", help="read-only branch merge-readiness report")
    mp.add_argument("--repo", default=".")
    mp.add_argument("--base", default="master")
    mp.set_defaults(func=merge_report)
    return p


def main() -> int:
    args = parser().parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
