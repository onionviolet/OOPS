#!/usr/bin/env python3
"""Summarize a YAIRPG tool registry (read-only) into JSON and Markdown.

Pure standard-library, no network, no execution of any listed tool. Reads a
registry JSON with a top-level "tools" list of row objects and writes a
structured inventory. Does not probe, install, resolve placeholders or
otherwise touch any tool.
"""
import argparse
import json
import sys
from collections import Counter


def _row_id(row, index):
    fid = row.get("id")
    if isinstance(fid, str) and fid:
        return fid
    return f"<row-{index}>"


def _nonempty_list(value):
    """True when value is a list with at least one element."""
    return isinstance(value, list) and len(value) > 0


def summarize(tools):
    """Compute the inventory summary for a list of tool rows.

    Handles an empty list and absent/null/empty optional fields. Only launch
    rows contribute to launch-specific statistics; every kind of row may
    contribute to missing-owner and duplicate-id statistics.
    """
    tools = tools or []
    counts_by_kind = Counter()
    ids_by_kind = {}
    launch_probe_ids = set()
    launch_without_probe_ids = set()
    missing_owner_ids = set()
    seen_ids = set()
    duplicate_ids = set()
    required_path_total = 0
    unique_required_paths = set()

    for index, row in enumerate(tools):
        if not isinstance(row, dict):
            # Skip malformed, non-object entries; they are not valid rows.
            continue

        kind = row.get("kind")
        if kind is None or not isinstance(kind, str):
            kind = "unknown"
        counts_by_kind[kind] += 1

        rid = _row_id(row, index)
        ids_by_kind.setdefault(kind, set()).add(rid)

        owner = row.get("owner")
        if not isinstance(owner, str) or not owner.strip():
            missing_owner_ids.add(rid)

        if rid in seen_ids:
            duplicate_ids.add(rid)
        else:
            seen_ids.add(rid)

        if kind == "launch":
            probe = row.get("probe")
            if _nonempty_list(probe):
                launch_probe_ids.add(rid)
            else:
                launch_without_probe_ids.add(rid)

            required = row.get("required")
            if isinstance(required, list):
                for item in required:
                    required_path_total += 1
                    if isinstance(item, str):
                        unique_required_paths.add(item)

    ids_by_kind = {k: sorted(v) for k, v in sorted(ids_by_kind.items())}

    return {
        "total_tools": len(tools),
        "counts_by_kind": dict(sorted(counts_by_kind.items())),
        "ids_by_kind": ids_by_kind,
        "launch_probe_ids": sorted(launch_probe_ids),
        "launch_without_probe_ids": sorted(launch_without_probe_ids),
        "missing_owner_ids": sorted(missing_owner_ids),
        "duplicate_ids": sorted(duplicate_ids),
        "required_path_references": required_path_total,
        "unique_required_paths": len(unique_required_paths),
    }


def render_markdown(summary):
    lines = []
    lines.append("# Tool Registry Inventory")
    lines.append("")
    lines.append(f"- Total tools: **{summary['total_tools']}**")
    lines.append(f"- Launch rows with a non-empty probe: **{len(summary['launch_probe_ids'])}**")
    lines.append(f"- Launch rows without a probe: **{len(summary['launch_without_probe_ids'])}**")
    lines.append(f"- Rows missing an owner: **{len(summary['missing_owner_ids'])}**")
    lines.append(f"- Duplicate IDs: **{len(summary['duplicate_ids'])}**")
    lines.append(f"- Required path references (launch rows): **{summary['required_path_references']}**")
    lines.append(f"- Unique required path strings (launch rows): **{summary['unique_required_paths']}**")
    lines.append("")
    lines.append("## Counts by kind")
    lines.append("")
    if summary["counts_by_kind"]:
        for kind, count in summary["counts_by_kind"].items():
            lines.append(f"- {kind}: {count}")
    else:
        lines.append("- (none)")
    lines.append("")
    lines.append("## IDs by kind")
    lines.append("")
    if summary["ids_by_kind"]:
        for kind, ids in summary["ids_by_kind"].items():
            lines.append(f"- {kind}: {', '.join(ids)}")
    else:
        lines.append("- (none)")
    lines.append("")
    lines.append("## Notable IDs")
    lines.append("")
    for label, ids in (
        ("Launch with non-empty probe", summary["launch_probe_ids"]),
        ("Launch without a probe", summary["launch_without_probe_ids"]),
        ("Missing owner", summary["missing_owner_ids"]),
        ("Duplicate IDs", summary["duplicate_ids"]),
    ):
        if ids:
            lines.append(f"### {label}: {len(ids)}")
            lines.append("")
            lines.append(", ".join(ids))
            lines.append("")
    lines.append(
        "> Note: This inventory describes the registry metadata only. The "
        "presence or absence of a `probe` field, a non-empty `probe` list, an "
        "`owner`, or `required` paths is configuration, not proof that any tool "
        "is installed, resolvable, or has executed successfully. Probe "
        "configuration is not installation or successful-execution evidence. "
        "No tool was probed, launched, installed or its placeholders resolved."
    )
    lines.append("")
    return "\n".join(lines)


def main(argv=None):
    parser = argparse.ArgumentParser(
        description="Summarize a YAIRPG tool registry into JSON and Markdown."
    )
    parser.add_argument("input", help="Path to the registry JSON file (read-only).")
    parser.add_argument("--json", required=True, help="Output path for the JSON inventory.")
    parser.add_argument("--markdown", required=True, help="Output path for the Markdown inventory.")
    args = parser.parse_args(argv)

    with open(args.input, "r", encoding="utf-8") as fh:
        data = json.load(fh)

    if isinstance(data, dict):
        tools = data.get("tools", [])
    elif isinstance(data, list):
        tools = data
    else:
        tools = []
    if not isinstance(tools, list):
        tools = []

    summary = summarize(tools)

    with open(args.json, "w", encoding="utf-8") as fh:
        json.dump(summary, fh, indent=2, ensure_ascii=False)
        fh.write("\n")

    with open(args.markdown, "w", encoding="utf-8") as fh:
        fh.write(render_markdown(summary))

    # Console report (does not affect output files).
    print(
        "total={0} kinds={1} launch_probe={2} launch_noprobe={3} "
        "missing_owner={4} duplicates={5}".format(
            summary["total_tools"],
            summary["counts_by_kind"],
            len(summary["launch_probe_ids"]),
            len(summary["launch_without_probe_ids"]),
            len(summary["missing_owner_ids"]),
            len(summary["duplicate_ids"]),
        )
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
