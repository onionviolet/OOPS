#!/usr/bin/env python3
"""Summarize a YAIRPG tool registry JSON into inventory.json and inventory.md.

Usage:
    python3 summarize_registry.py INPUT --json JSON_PATH --markdown MD_PATH

Probe configuration is a declaration of *how* a launch tool could be probed;
it is not evidence that the tool is installed or that execution succeeded.
"""
import argparse
import json
import sys
from collections import Counter
from pathlib import Path


def load_registry(path: str) -> tuple:
    """Load a registry file and return (tools_list, meta_dict)."""
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    # Registry may be a bare list or a dict with a "tools" key.
    if isinstance(data, dict):
        tools = data.get("tools", [])
        if not isinstance(tools, list):
            print("error: 'tools' field is not a list", file=sys.stderr)
            sys.exit(1)
        return tools, data
    if isinstance(data, list):
        return data, {}
    print(f"error: unexpected top-level type {type(data).__name__}", file=sys.stderr)
    sys.exit(1)


def is_empty_owner(owner) -> bool:
    """True when owner is absent, null, or empty string."""
    return owner is None or owner == ""


def is_empty_probe(probe) -> bool:
    """True when probe is absent, null, or an empty list."""
    return probe is None or (isinstance(probe, list) and len(probe) == 0)


def summarize(tools: list, meta: dict) -> dict:
    """Produce the inventory JSON structure from a tools list."""
    total = len(tools)

    # ---- counts_by_kind / ids_by_kind ----
    kind_order: dict = {}
    counts_by_kind: dict = {}
    ids_by_kind: dict = {}
    for t in tools:
        kind = t.get("kind", "unknown")
        if kind not in counts_by_kind:
            counts_by_kind[kind] = 0
            ids_by_kind[kind] = []
        counts_by_kind[kind] += 1
        ids_by_kind[kind].append(t.get("id", ""))
    # Sort ID lists and order kinds by first appearance (then alpha)
    for k in ids_by_kind:
        ids_by_kind[k] = sorted(ids_by_kind[k], key=lambda x: str(x))
    # Sort kind keys alphabetically for stable output
    counts_by_kind = {k: counts_by_kind[k] for k in sorted(counts_by_kind)}
    ids_by_kind = {k: ids_by_kind[k] for k in sorted(ids_by_kind)}

    # ---- launch / reference rows ----
    launch_rows = [t for t in tools if t.get("kind") == "launch"]
    ref_rows = [t for t in tools if t.get("kind") == "reference"]

    # ---- probe analysis for launch rows ----
    launch_probe_ids = sorted(
        str(t.get("id", ""))
        for t in launch_rows
        if not is_empty_probe(t.get("probe"))
    )
    launch_without_probe_ids = sorted(
        str(t.get("id", ""))
        for t in launch_rows
        if is_empty_probe(t.get("probe"))
    )

    # ---- missing owner across ALL rows ----
    missing_owner_ids = sorted(
        str(t.get("id", ""))
        for t in tools
        if is_empty_owner(t.get("owner"))
    )

    # ---- duplicate IDs ----
    id_counts = Counter(str(t.get("id", "")) for t in tools)
    duplicate_ids = sorted(k for k, v in id_counts.items() if v > 1)

    # ---- required path references (launch rows only) ----
    required_path_refs = 0
    all_required_strings = set()
    for t in launch_rows:
        req = t.get("required", [])
        if isinstance(req, list):
            for item in req:
                required_path_refs += 1
                all_required_strings.add(str(item))
    unique_required_paths = len(all_required_strings)

    return {
        "total_tools": total,
        "counts_by_kind": counts_by_kind,
        "ids_by_kind": ids_by_kind,
        "launch_probe_ids": launch_probe_ids,
        "launch_without_probe_ids": launch_without_probe_ids,
        "missing_owner_ids": missing_owner_ids,
        "duplicate_ids": duplicate_ids,
        "required_path_references": required_path_refs,
        "unique_required_paths": unique_required_paths,
    }


def write_json(inv: dict, path: str) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(inv, f, indent=2, ensure_ascii=False, sort_keys=False)
        f.write("\n")


def write_markdown(inv: dict, meta: dict, path: str) -> None:
    lines: list = []
    lines.append("# YAIRPG Tool Registry Inventory\n")
    lines.append(f"**Total tools:** {inv['total_tools']}\n")

    # counts by kind
    lines.append("## Counts by Kind\n")
    lines.append("| Kind | Count |")
    lines.append("|------|-------|")
    for kind in sorted(inv["counts_by_kind"]):
        lines.append(f"| {kind} | {inv["counts_by_kind"][kind]} |")
    lines.append("")

    # launch probe status
    lines.append("## Launch Probe Status\n")
    lines.append(f"- **With probe:** {len(inv["launch_probe_ids"])}  "
                 f"({", ".join(inv["launch_probe_ids"])})")
    lines.append(f"- **Without probe:** {len(inv["launch_without_probe_ids"])}  "
                 f"({", ".join(inv["launch_without_probe_ids"])})")
    lines.append("")

    # missing owner
    lines.append("## Missing Owner\n")
    if inv["missing_owner_ids"]:
        lines.append(f"{len(inv["missing_owner_ids"])} tools lack an owner field "
                     f"(absent, null, or empty):\n")
        lines.append(", ".join(inv["missing_owner_ids"]))
    else:
        lines.append("All tools have an owner specified.")
    lines.append("")

    # duplicates
    lines.append("## Duplicate IDs\n")
    if inv["duplicate_ids"]:
        lines.append("Repeated IDs detected: " + ", ".join(inv["duplicate_ids"]))
    else:
        lines.append("No duplicate IDs found.")
    lines.append("")

    # required paths
    lines.append("## Required Path References (Launch Rows)\n")
    lines.append(f"- Total references: **{inv["required_path_references"]}**")
    lines.append(f"- Unique raw strings: **{inv["unique_required_paths"]}**")
    lines.append("")

    # disclaimer
    lines.append("---\n")
    lines.append("> **Important:** Probe configuration is a declarative hint about "
                 "how to invoke a tool's self-check. It is **not evidence that the "
                 "tool is installed or that execution succeeded.** No tools listed "
                 "here were executed or probed during this inventory. Placeholder "
                 "tokens (e.g. `{rea}`, `{ghidra}`) in paths and environment "
                 "variables are unresolved and do not represent actual filesystem "
                 "paths.\n")

    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Summarize a YAIRPG tool registry into JSON and Markdown inventories."
    )
    parser.add_argument("input", help="Path to registry JSON file")
    parser.add_argument("--json", required=True, help="Output path for inventory JSON")
    parser.add_argument("--markdown", required=True, help="Output path for inventory Markdown")
    args = parser.parse_args()

    # Validate input file exists
    inp = Path(args.input)
    if not inp.is_file():
        print(f"error: input file not found: {inp}", file=sys.stderr)
        sys.exit(1)

    tools, meta = load_registry(str(inp))
    inv = summarize(tools, meta)
    write_json(inv, args.json)
    write_markdown(inv, meta, args.markdown)
    print(f"Wrote inventory JSON to {args.json}")
    print(f"Wrote inventory markdown to {args.markdown}")


if __name__ == "__main__":
    main()
