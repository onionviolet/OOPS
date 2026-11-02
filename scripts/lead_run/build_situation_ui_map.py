#!/usr/bin/env python3
"""Join existing reader situations to proposed UI contracts without claiming play proof.

Source prose, actor/persona IDs, candidate controls and per-step residue stay private.
No model calls, source acquisition, runtime mutation or library writes.
"""
import argparse
from collections import Counter, defaultdict
import csv
import hashlib
import json
from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[2]
BASE = ROOT / "docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27"
DOCS = ROOT / "docs/gm/dispatch/refinement-audits-2026-10-31"


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def jsonl(path):
    return [json.loads(line) for line in path.read_text().splitlines() if line.strip()]


def unique_index(rows, key, label):
    result = {}
    for row in rows:
        ident = row[key]
        if ident in result:
            raise ValueError(f"Duplicate {label} ID; inspect private input")
        result[ident] = row
    return result


def locator_volume(evidence):
    values = set()
    for record in evidence:
        # Several later-volume readers omitted bN. Bare chapter numbers cannot
        # establish volume 1, even when an old pack happens to call it an opening.
        match = re.match(r"^zh b(\d+) 第\d+章 p\d+(?:-p?\d+)?$", record.get("locator", ""))
        if match:
            values.add(int(match[1]))
    return str(next(iter(values))) if len(values) == 1 else "unresolved"


def apply_qualifications(rows, overrides):
    """Overlay reviewed situations without promoting templates or export proof.

    Historical reader rows remain intact; each replacement carries independent
    evidence and independent actor/UI/engine review states. New source situations
    stay separate from the historical denominator.
    """
    indexed = unique_index(rows, "id", "situations")
    reviewed = unique_index(overrides, "id", "qualified overrides")
    required = {"source", "roles", "operation", "engine", "ui", "result",
                "lifecycle", "later_pressure", "alternatives", "review"}
    for ident, override in reviewed.items():
        if ident not in indexed:
            raise ValueError("Orphan qualified situation; new source situations use their own ledger")
        if required - override.keys():
            raise ValueError("Incomplete situation qualification")
        source = override["source"]
        if not re.fullmatch(r"[0-9a-f]{64}", source.get("edition_sha256", "")):
            raise ValueError("Qualification needs an exact edition hash")
        spans = source.get("spans", [])
        if not spans or any(not all(isinstance(s.get(k), int) and s[k] > 0
                                   for k in ("volume", "chapter", "p_start", "p_end"))
                            or s["p_start"] > s["p_end"] for s in spans):
            raise ValueError("Qualification needs exact volume/chapter/paragraph spans")
        if override["review"].get("journey_verified"):
            raise ValueError("Offline qualification cannot establish journey proof")
        row = indexed[ident]
        row["qualified_override"] = override
        # Remove only independently reviewed gaps. Unknown actor/controller is
        # a valid source disposition, but does not become a resolved actor ID.
        row["source_qualification_status"] = override["review"].get("source_status", "pending")
        row["actor_status"] = override["review"].get("actor_status", row["actor_status"])
        row["contract_status"] = override["review"].get("ui_status", row["contract_status"])
        row["engine_connection_status"] = override["review"].get("engine_status", "unverified")
        row["missing"] = list(row["missing"])
        if row["source_qualification_status"] == "source_qualified":
            row["missing"] = [x for x in row["missing"] if x != "source_locator_unresolved"]
            row["source_volume"] = str(spans[0]["volume"]) if len({s["volume"] for s in spans}) == 1 else "unresolved"
        if row["actor_status"] == "source_qualified_roles":
            row["missing"] = [x for x in row["missing"] if x != "step_actor_unresolved"]
        if row["contract_status"] == "situation_specific_ui_proposal":
            row["missing"] = [x for x in row["missing"] if x != "scene_specific_ui_contract_not_qualified"]
    return {"overrides": len(reviewed),
            "source_qualified": sum(r.get("source_qualification_status") == "source_qualified" for r in rows),
            "actor_qualified": sum(r["actor_status"] == "source_qualified_roles" for r in rows),
            "ui_specified": sum(r["contract_status"] == "situation_specific_ui_proposal" for r in rows),
            "engine_connected": sum(r.get("engine_connection_status") == "current_engine_connected" for r in rows),
            "journey_verified": 0}


def build(scenes, tags, crosswalk, baselines, contracts):
    tags_by_id = unique_index(tags, "id", "tag")
    baseline_by_id = unique_index(baselines, "id", "baseline")
    unique_index(contracts, "id", "contract")
    contract_by_id = {contract["id"]: contract for contract in contracts}
    family_contract = {}
    for contract in contracts:
        required = ["operation", "engine", "controls", "result_consumer", "screen_flow",
                    "missing", "failure_check", "later_pressure", "future_freedom"]
        if any(key not in contract for key in required):
            raise ValueError("Incomplete contract")
        for family in contract["families"]:
            if family in family_contract:
                raise ValueError("A family has competing contract owners")
            family_contract[family] = contract["id"]
    persona_candidates = set(crosswalk.get("leadPovIds", [])) - {"lead"}
    rows = []
    seen = set()
    population = Counter()
    population_steps = Counter()
    family_counts = Counter()
    actor_basis = Counter()
    baseline_status = Counter()
    volume = defaultdict(Counter)
    gaps = Counter()
    for scene in scenes:
        pov = scene.get("pov")
        bucket = ("literal_lead_pov" if pov == "lead" else
                  "candidate_persona_pov_needs_review" if pov in persona_candidates else
                  "other_observer_pov")
        population[bucket] += 1
        vol = locator_volume(scene.get("evidence", []))
        for offset, step in enumerate(scene.get("steps", []), 1):
            ident = f"{scene['beat']}#{offset}"
            if ident in seen:
                raise ValueError("Duplicate situation ID; inspect private input")
            seen.add(ident)
            tag = tags_by_id.get(ident)
            if tag is None:
                raise ValueError("A source step lacks its existing tag; no silent omission")
            family = tag.get("family")
            contract = family_contract.get(family)
            if contract is None:
                raise ValueError("Unassigned family; add an explicit residue contract")
            baseline = baseline_by_id.get(ident)
            explicit_actor = step.get("actor")
            if isinstance(explicit_actor, dict):
                explicit_actor = explicit_actor.get("id")
            actor_state = "reader_explicit_unverified" if explicit_actor else "unresolved_no_step_actor"
            missing = ["scene_specific_ui_contract_not_qualified", "current_journey_proof_not_run"]
            if not explicit_actor:
                missing.append("step_actor_unresolved")
            if vol == "unresolved":
                missing.append("source_locator_unresolved")
            if family.startswith("needs mechanism review:"):
                missing.append("operation_needs_semantic_review")
            if contract == "LS22":
                missing.append("no_safe_mechanism_assignment")
            baseline_control = baseline.get("canonicalControl") if baseline else None
            if not baseline_control:
                missing.append("no_inherited_candidate_control")
            if baseline and baseline.get("status") != "clean_fold":
                missing.append("inherited_mapping_gap")
            # Non-action tags are lexical proposals. They do not prove a source step
            # is automatic or that its observer has actually received the event.
            presentation = ("readout_or_event_candidate" if tag.get("kind") in
                            {"think", "perceive", "report", "narration"} else
                            "action_candidate")
            definition = contract_by_id[contract]
            row = {
                "id": ident, "scene": scene["beat"], "population": bucket,
                "source_volume": vol, "source_evidence": scene.get("evidence", []),
                "actor": explicit_actor, "actor_status": actor_state,
                "inferred_actor": {key: tag.get(key) for key in ["actor", "actorBasis", "actorWeak"]},
                "reader_step": step, "scene_place": scene.get("place"),
                "scene_time": {key: scene.get(key) for key in ["date", "timeOfDay"]},
                "family": family, "tag_kind": tag.get("kind"),
                "tag_basis": {key: tag.get(key) for key in ["source", "kindBasis", "kindWeak"]},
                "presentation_role": presentation, "primary_contract": contract,
                "contract_status": "family_triage_proposal_not_scene_qualified",
                "engine_ui_spec": {"contract": contract, "definition_file":
                    "docs/gm/dispatch/refinement-audits-2026-10-31/LOTM_SITUATION_UI_CONTRACTS.json"},
                "situation_contract": {
                    "intent": step.get("verb"), "subject": step.get("object") or step.get("label"),
                    "reader_inputs": step.get("inputs"), "reader_requirements": step.get("requires"),
                    "reader_expected_outputs": step.get("outputs"), "reader_gains": step.get("gains"),
                    "engine_candidates": definition["engine"],
                    "historical_candidate_control": baseline_control if baseline and baseline.get("status") == "clean_fold" else None,
                    "proposed_ui_controls": definition["controls"],
                    "proposed_screen_flow": definition["screen_flow"],
                    "proposed_result_consumer": definition["result_consumer"],
                    "return_identity": {"world": "lotm", "scene": scene["beat"],
                                        "situation": ident, "actor": explicit_actor,
                                        "subject": step.get("object") or step.get("label")},
                    "scene_qualification": "pending; preserve source actor, actual target, timing and mechanism gaps",
                },
                "inherited_mapping": None if baseline is None else {
                    key: baseline.get(key) for key in ["status", "canonicalControl", "route", "reason",
                        "actorRole", "actorBasis", "packPlaceId", "availableControls", "lockedOptions"]},
                "missing": missing,
            }
            rows.append(row)
            population_steps[bucket] += 1
            actor_basis[actor_state] += 1
            family_counts[family] += 1
            baseline_status["not_in_selected_baseline" if baseline is None else baseline.get("status", "unknown")] += 1
            volume[vol][bucket] += 1
            volume[vol]["steps"] += 1
            if baseline_control:
                volume[vol]["inherited_control_references"] += 1
            if baseline and baseline.get("status") == "clean_fold" and baseline_control:
                volume[vol]["inherited_candidate_assignments"] += 1
            gaps.update(missing)
    orphan_tags = set(tags_by_id) - seen
    orphan_baselines = set(baseline_by_id) - seen
    if orphan_tags or orphan_baselines:
        raise ValueError("Tag or baseline IDs do not join the selected scenes; inspect input revisions")
    summary = {
        "schema": "lotm-situation-ui-map/1", "source_scenes": len(scenes), "source_steps": len(rows),
        "scenes_by_population": dict(population), "steps_by_population": dict(population_steps),
        "families": dict(sorted(family_counts.items())), "family_contracts": len(family_contract),
        "contracts": len(contracts), "actor_status": dict(actor_basis),
        "inherited_mapping_rows": len(baselines), "inherited_mapping_status": dict(baseline_status),
        "inherited_control_references": sum(bool(r.get("canonicalControl")) for r in baselines),
        "inherited_candidate_assignments": sum(r.get("status") == "clean_fold" and bool(r.get("canonicalControl")) for r in baselines),
        "inherited_gaps_with_control_references": sum(r.get("status") == "gap" and bool(r.get("canonicalControl")) for r in baselines),
        "by_volume": {key: dict(value) for key, value in sorted(volume.items())},
        "missing_counts": dict(gaps), "scene_qualified_ui_contracts_established_by_this_run": 0,
        "new_current_journeys_verified": 0, "unassigned_steps": 0,
        "not_measured": ["all-publications completeness", "all main-character actor attribution",
                         "current runnable coverage", "all future player combinations"],
    }
    return rows, summary


def write_table(path, rows, contracts):
    definitions = {row["id"]: row for row in contracts}
    fields = ["situation", "population", "source", "actor_status", "intent", "inputs",
              "source_expected_result", "contract", "engine_candidates", "historical_candidate_control",
              "proposed_controls", "proposed_screen_flow", "result_consumer", "missing", "later_pressure", "future_freedom",
              "reviewed_source", "reviewed_roles", "reviewed_operation", "reviewed_engine",
              "reviewed_ui", "reviewed_result", "reviewed_lifecycle", "review_states"]
    with path.open("w", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, dialect="excel-tab")
        writer.writeheader()
        for row in rows:
            contract = definitions[row["primary_contract"]]
            spec = row["situation_contract"]
            qualified = row.get("qualified_override", {})
            writer.writerow({
                **{f"reviewed_{key}": json.dumps(qualified.get(key), ensure_ascii=False)
                   for key in ["source", "roles", "operation", "engine", "ui", "result", "lifecycle"]},
                "review_states": json.dumps(qualified.get("review"), ensure_ascii=False),
                "situation": row["id"], "population": row["population"],
                "source": json.dumps(row["source_evidence"], ensure_ascii=False),
                "actor_status": row["actor_status"], "intent": spec["intent"],
                "inputs": json.dumps([spec["reader_inputs"], spec["reader_requirements"]], ensure_ascii=False),
                "source_expected_result": json.dumps([spec["reader_expected_outputs"], spec["reader_gains"]], ensure_ascii=False),
                "contract": row["primary_contract"], "engine_candidates": " | ".join(contract["engine"]),
                "historical_candidate_control": spec["historical_candidate_control"] or "unqualified/missing",
                "proposed_controls": " | ".join(contract["controls"]),
                "proposed_screen_flow": " > ".join(contract["screen_flow"]),
                "result_consumer": contract["result_consumer"], "missing": " | ".join(row["missing"]),
                "later_pressure": contract["later_pressure"], "future_freedom": contract["future_freedom"],
            })


def opening_row(row):
    qualified = row.get("qualified_override", {})
    if row.get("source_qualification_status") == "source_qualified":
        return (row["population"] != "other_observer_pov" and
                all(s["volume"] == 1 and s["chapter"] <= 24
                    for s in qualified["source"]["spans"]))
    for evidence in row["source_evidence"]:
        match = re.match(r"^zh b(\d+) 第(\d+)章 p\d+(?:-p?\d+)?$", evidence.get("locator", ""))
        if match and int(match[1]) == 1 and int(match[2]) <= 24:
            return row["population"] != "other_observer_pov"
    return False


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--scenes", type=Path, default=BASE / "m4-whole-book-2026-10-29/merged/scenes.jsonl")
    parser.add_argument("--tags", type=Path, default=BASE / "step-tags-2026-10-29/step-tags.jsonl")
    parser.add_argument("--crosswalk", type=Path, default=BASE / "m4-whole-book-2026-10-29/merged/crosswalk.json")
    parser.add_argument("--mappings", type=Path, default=BASE / "x4-whole-book-mapping-2026-10-29/resume-3-partial")
    parser.add_argument("--contracts", type=Path, default=DOCS / "LOTM_SITUATION_UI_CONTRACTS.json")
    parser.add_argument("--out", type=Path, default=BASE / "situation-ui-reconciliation-2026-10-31")
    parser.add_argument("--overrides", type=Path, help="Reviewed private JSON list; historical inputs stay unchanged")
    args = parser.parse_args()
    if args.overrides:
        args.overrides = args.overrides.resolve()
    # Reject accidental public output of copyrighted/sealed reader material.
    private_root = ROOT / "docs/research/novels/lord-of-mysteries/private"
    if not args.out.resolve().is_relative_to(private_root.resolve()):
        raise ValueError("Per-situation output must remain in the existing LOTM private evidence root")
    mapping_files = sorted(args.mappings.glob("v[1-8]-ch*.json"))
    if not mapping_files:
        raise ValueError("No explicitly selected mapping ranges")
    files = [args.scenes, args.tags, args.crosswalk, args.contracts, *mapping_files, Path(__file__).resolve()]
    if args.overrides:
        if not args.overrides.resolve().is_relative_to(private_root.resolve()):
            raise ValueError("Qualified overrides must stay private")
        files.append(args.overrides)
    before = {str(p.relative_to(ROOT)): digest(p) for p in files}
    baselines = [row for p in mapping_files for row in json.loads(p.read_text())["rows"]]
    contracts = json.loads(args.contracts.read_text())["contracts"]
    rows, summary = build(jsonl(args.scenes), jsonl(args.tags), json.loads(args.crosswalk.read_text()),
                          baselines, contracts)
    if args.overrides:
        summary["individual_qualification"] = apply_qualifications(rows, json.loads(args.overrides.read_text()))
        summary["actor_status"] = dict(Counter(r["actor_status"] for r in rows))
        summary["missing_counts"] = dict(Counter(x for r in rows for x in r["missing"]))
        summary["scene_qualified_ui_contracts_established_by_this_run"] = summary["individual_qualification"]["ui_specified"]
        summary["by_volume_after_qualification"] = dict(Counter(r["source_volume"] for r in rows))
    summary["opening_v1_ch1_24_candidate_steps"] = sum(opening_row(row) for row in rows)
    if before != {str(p.relative_to(ROOT)): digest(p) for p in files}:
        raise ValueError("Selected input changed during mapping; output was not written")
    args.out.mkdir(parents=True, exist_ok=True)
    output_files = [args.out / "situations.jsonl", args.out / "residue.jsonl", args.out / "summary.json"]
    for p, data in [(output_files[0], rows), (output_files[1], [r for r in rows if r["missing"]])]:
        p.write_text("".join(json.dumps(row, ensure_ascii=False, sort_keys=True) + "\n" for row in data))
    output_files[2].write_text(json.dumps(summary, ensure_ascii=False, indent=2, sort_keys=True) + "\n")
    lead_rows = [row for row in rows if row["population"] != "other_observer_pov"]
    for name, selected in [("lead-and-persona-situations.tsv", lead_rows),
                           ("opening-v1-ch1-24.tsv", [row for row in lead_rows if opening_row(row)])]:
        table = args.out / name
        write_table(table, selected, contracts)
        output_files.append(table)
    manifest = {"schema": "lotm-situation-ui-inputs/1", "inputs": before,
                "outputs": {p.name: digest(p) for p in output_files},
                "evidence": "Offline join only; a current byte hash does not backdate gameplay proof."}
    (args.out / "manifest.json").write_text(json.dumps(manifest, indent=2, sort_keys=True) + "\n")
    print(json.dumps({key: summary[key] for key in ["source_scenes", "source_steps", "steps_by_population",
          "inherited_mapping_rows", "inherited_candidate_assignments", "inherited_gaps_with_control_references", "unassigned_steps"]}, sort_keys=True))


if __name__ == "__main__":
    main()
