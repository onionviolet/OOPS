#!/usr/bin/env python3
"""Read-only routing for audited plan groups; never treats grouping as semantic review."""
import argparse
import hashlib
import json
from pathlib import Path

CATALOG = "docs/reviews/plan-rule-reconciliation-2026-10-18/SUPERSESSION_GROUPS.json"
INVENTORY = "docs/reviews/plan-rule-reconciliation-2026-10-18/PLAN_INVENTORY.json"


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def local(root, name):
    path = (root / name).resolve()
    if not path.is_relative_to(root.resolve()):
        raise ValueError(f"Path outside repository: {name}")
    return path


def group_state(root, group):
    owner = local(root, group["owner"])
    if not owner.is_file():
        raise ValueError(f"Missing routing owner: {group['owner']}")
    evidence = local(root, group["relationship_evidence"])
    if not evidence.is_file():
        raise ValueError(f"Missing relationship evidence: {group['id']}")
    changed = []
    for member in group["members"]:
        path = local(root, member["path"])
        if not path.is_file():
            raise ValueError(f"Missing retained member: {member['path']}")
        if digest(path) != member["sha256"]:
            changed.append(member["path"])
    if changed:
        return {"state": "changed_members", "reopen_members": changed}
    if not group["skip_unchanged_execution_review"]:
        return {"state": "needs_successor_mapping", "reopen_members": []}
    if digest(owner) != group["owner_sha256"]:
        return {"state": "owner_changed_review_relationship", "reopen_members": []}
    if digest(evidence) != group["evidence_sha256"]:
        return {"state": "evidence_changed_review_relationship", "reopen_members": []}
    return {"state": "unchanged_control_skip", "reopen_members": []}


def collect(root):
    catalog = json.loads(local(root, CATALOG).read_text())
    inventory = json.loads(local(root, INVENTORY).read_text())
    rows = inventory["plan_shaped_records"]
    indexed = {r["path"]: r for r in rows}
    if len(indexed) != len(rows):
        raise ValueError("Duplicate inventory path")
    group_ids, grouped, summaries = set(), set(), []
    for group in catalog["groups"]:
        if group["id"] in group_ids:
            raise ValueError(f"Duplicate group: {group['id']}")
        group_ids.add(group["id"])
        for member in group["members"]:
            name = member["path"]
            if name in grouped or name not in indexed:
                raise ValueError(f"Duplicate or unindexed group member: {name}")
            if indexed[name].get("review_group", {}).get("id") != group["id"]:
                raise ValueError(f"Inventory/group mismatch: {name}")
            grouped.add(name)
        summaries.append({"id": group["id"], "owner": group["owner"],
                          "members": len(group["members"]), **group_state(root, group)})
    pending = [r["path"] for r in rows
               if r["coverage"] == "filename-indexed-only" and r["path"] not in grouped]
    return {"plan_records": len(rows),
            "section_reviewed": sum(r["coverage"] == "section-reviewed" for r in rows),
            "indexed_only": sum(r["coverage"] == "filename-indexed-only" for r in rows),
            "grouped_control_records": len(grouped),
            "unchanged_control_skip": sum(g["members"] for g in summaries
                                           if g["state"] == "unchanged_control_skip"),
            "ungrouped_indexed_only": len(pending), "groups": summaries,
            "ungrouped_queue": pending,
            "limit": "Counts are review routing, not active status, source coverage or gameplay acceptance."}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--json", action="store_true", help="Print full routing data")
    parser.add_argument("--check", action="store_true", help="Validate membership/paths; report drift without editing")
    parser.add_argument("--limit", type=int, default=12, help="Maximum ungrouped paths printed")
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[3]
    try:
        data = collect(root)
    except (ValueError, KeyError, OSError) as exc:
        parser.exit(1, f"FAIL: {exc}\n")
    if args.json:
        print(json.dumps(data, indent=2))
    else:
        print(f"{data['plan_records']} records; {data['section_reviewed']} section-reviewed; "
              f"{data['indexed_only']} indexed-only")
        print(f"{data['unchanged_control_skip']} unchanged control records can skip duplicate execution review; "
              f"{data['ungrouped_indexed_only']} ungrouped indexed-only")
        for group in data["groups"]:
            print(f"{group['id']}: {group['members']} members, {group['state']} -> {group['owner']}")
        if not args.check:
            for path in data["ungrouped_queue"][:max(0, args.limit)]:
                print(path)
        print(data["limit"])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
