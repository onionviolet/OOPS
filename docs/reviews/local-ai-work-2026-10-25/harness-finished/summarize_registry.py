#!/usr/bin/env python3
"""summarize_registry.py - summarize a YAIRPG tool registry without running any tool.

Standard-library only. Reads a registry JSON, writes a JSON inventory and a Markdown
summary. It never executes, probes, resolves placeholders, or claims that any listed
tool is installed. The registry input file is read only and left unchanged.

Usage:
    python3 summarize_registry.py INPUT --json JSON_PATH --markdown MD_PATH
"""
import argparse
import collections
import json


def _rows_from_registry(data):
    """Return the tools list, tolerating a bare list or a dict with a 'tools' key.

    An absent or non-list tools field yields an empty list so empty inputs work.
    """
    if isinstance(data, list):
        return data
    if isinstance(data, dict):
        rows = data.get("tools")
        return rows if isinstance(rows, list) else []
    return []


def compute_inventory(rows):
    """Compute the inventory fields purely from the row data.

    'present' for probe/owner means a non-absent, non-null, non-empty value.
    """
    groups = {}
    for row in rows:
        kind = row.get("kind")
        groups.setdefault(kind, []).append(row.get("id"))

    launches = [row for row in rows if row.get("kind") == "launch"]
    refs = [x for row in launches for x in (row.get("required") or [])]

    counts_by_kind = dict(collections.Counter(row.get("kind") for row in rows))
    ids_by_kind = {k: sorted(v, key=lambda s: str(s)) for k, v in groups.items()}
    launch_probe_ids = sorted(
        str(r.get("id")) for r in launches if r.get("probe")
    )
    launch_without_probe_ids = sorted(
        str(r.get("id")) for r in launches if not r.get("probe")
    )
    missing_owner_ids = sorted(
        str(r.get("id")) for r in rows if not r.get("owner")
    )
    dup = collections.Counter(str(r.get("id")) for r in rows)
    duplicate_ids = sorted(k for k, v in dup.items() if v > 1)

    return {
        "total_tools": len(rows),
        "counts_by_kind": counts_by_kind,
        "ids_by_kind": ids_by_kind,
        "launch_probe_ids": launch_probe_ids,
        "launch_without_probe_ids": launch_without_probe_ids,
        "missing_owner_ids": missing_owner_ids,
        "duplicate_ids": duplicate_ids,
        "required_path_references": len(refs),
        "unique_required_paths": len(set(str(x) for x in refs)),
    }


def _fmt_list(ids):
    if not ids:
        return "(none)"
    return ", ".join(ids)


def build_markdown(rows, inventory):
    """Build a concise human-readable summary with the required evidence caveat."""
    lines = []
    lines.append("# Tool Registry Inventory")
    lines.append("")
    lines.append(f"- Total tools: **{inventory['total_tools']}**")
    counts = inventory["counts_by_kind"]
    if counts:
        counts_str = ", ".join(f"{k}: {v}" for k, v in sorted(counts.items()))
    else:
        counts_str = "(no tools)"
    lines.append(f"- Count by kind: {counts_str}")
    lines.append("")
    lines.append("## Probe configuration")
    lines.append(
        "- Launch rows with a non-empty probe list: "
        f"{len(inventory['launch_probe_ids'])} ({_fmt_list(inventory['launch_probe_ids'])})"
    )
    lines.append(
        "- Launch rows with an absent/null/empty probe: "
        f"{len(inventory['launch_without_probe_ids'])} "
        f"({_fmt_list(inventory['launch_without_probe_ids'])})"
    )
    lines.append("")
    lines.append("## Ownership & duplicates")
    lines.append(
        f"- Rows missing an owner: {len(inventory['missing_owner_ids'])} "
        f"({_fmt_list(inventory['missing_owner_ids'])})"
    )
    lines.append(
        f"- Duplicate IDs: {len(inventory['duplicate_ids'])} "
        f"({_fmt_list(inventory['duplicate_ids'])})"
    )
    lines.append("")
    lines.append("## Launch path references")
    lines.append(
        f"- Required path references (launch rows): "
        f"{inventory['required_path_references']} "
        f"({inventory['unique_required_paths']} distinct raw values)"
    )
    lines.append("")
    lines.append(
        "## Evidence note\n"
        "Probe configuration describes only what a check command looks like. It is "
        "not installation evidence, not proof that any listed tool is installed or "
        "available, and does not imply that any probe executed successfully. No tool "
        "was executed, probed, or launched while generating this inventory; placeholder "
        "tokens such as `{...}` are left raw and were not resolved."
    )
    lines.append("")
    return "\n".join(lines)


def main(argv=None):
    parser = argparse.ArgumentParser(
        description="Summarize a YAIRPG tool registry into JSON and Markdown without "
        "running any listed tool."
    )
    parser.add_argument("input", help="Path to the registry JSON file.")
    parser.add_argument("--json", dest="json_path", required=True,
                        help="Path to write the JSON inventory.")
    parser.add_argument("--markdown", dest="md_path", required=True,
                        help="Path to write the Markdown summary.")
    args = parser.parse_args(argv)

    with open(args.input, "r", encoding="utf-8") as fh:
        data = json.load(fh)

    rows = _rows_from_registry(data)
    inventory = compute_inventory(rows)
    markdown = build_markdown(rows, inventory)

    with open(args.json_path, "w", encoding="utf-8") as fh:
        json.dump(inventory, fh, indent=2, sort_keys=False)
        fh.write("\n")
    with open(args.md_path, "w", encoding="utf-8") as fh:
        fh.write(markdown)

    summary = {
        "total_tools": inventory["total_tools"],
        "counts_by_kind": inventory["counts_by_kind"],
        "launch_probe_ids": len(inventory["launch_probe_ids"]),
        "launch_without_probe_ids": len(inventory["launch_without_probe_ids"]),
        "missing_owner_ids": len(inventory["missing_owner_ids"]),
        "duplicate_ids": len(inventory["duplicate_ids"]),
        "required_path_references": inventory["required_path_references"],
        "unique_required_paths": inventory["unique_required_paths"],
    }
    print(json.dumps(summary, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
