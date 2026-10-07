"""Generate an inspectable patch only. Never write shared files or apply it."""
from pathlib import Path
import datetime
import difflib
import hashlib
import json
import re
import subprocess

ROOT = Path(__file__).resolve().parents[3]
OUT = Path(__file__).resolve().parent
patches, hashes, checks = [], {}, []


def change(path, edit):
    p = ROOT / path
    old = p.read_text()
    new = edit(old)
    assert old != new, f"No changes for {path}"
    hashes[path] = hashlib.sha256(p.read_bytes()).hexdigest()
    checked = subprocess.run(["node", "--check", "--input-type=module"], input=new, text=True, capture_output=True)
    assert checked.returncode == 0, f"Unapplied patch syntax failed for {path}: {checked.stderr}"
    checks.append({"path": path, "check": "unapplied patched source syntax", "status": "passed"})
    patches.extend(difflib.unified_diff(old.splitlines(True), new.splitlines(True), fromfile="a/" + path, tofile="b/" + path))


def replace_once(s, old, new):
    assert s.count(old) == 1, f"Refresh moving integration anchor: {old[:100]}"
    return s.replace(old, new, 1)


def effects(s):
    s = "import {gameAbsorptionAssayFacts} from './game_absorption_assay_facts.js';\n" + s
    return replace_once(s, "const facts = {...context.facts,", "const facts = {...context.facts,...gameAbsorptionAssayFacts(state,context,registry),")


def simulation(s):
    lines = s.splitlines(True)
    found = [i for i, line in enumerate(lines) if "].includes(d.group)" in line and "job.reservationReturns = 1" in line]
    assert len(found) == 1, "Refresh return-accounting whitelist"
    i = found[0]
    lines[i] = replace_once(lines[i], "].includes(d.group)", ",\"game_absorption_assay\"].includes(d.group)")
    s = "".join(lines)
    anchor = "            ...(registry.simulation.commands.get(job.commandId)?.group === 'audit_lesson' ? {auditWorkshopReservation: job} : {}),"
    return replace_once(s, anchor, anchor + "\n            ...(registry.simulation.commands.get(job.commandId)?.group === 'game_absorption_assay' ? {gameAbsorptionReservation: job} : {}),")


def main(s):
    s = ("import {gameAbsorptionAssayContext,commitGameAbsorptionAssayCommand,cancelGameAbsorptionAssayJob} from './game_absorption_assay_host.js';\n"
         "import {validateGameAbsorptionAssay} from './game_absorption_assay_facts.js';\n" + s)
    m = re.search(r"function featureWaveContext\(\)\{(?P<body>.*?)\n\}", s, re.S)
    assert m, "Refresh featureWaveContext"
    returns = re.findall(r"^    return (.*);$", m.group("body"), re.M)
    assert len(returns) == 1
    s = replace_once(s, "    return " + returns[0] + ";", "    return gameAbsorptionAssayContext(expansionState,expeditionRegistry," + returns[0] + ");")
    route = "    else if(command.type==='nethack_fieldcraft')"
    s = replace_once(s, route, "    else if(command.type==='game_absorption_assay')plan=commitGameAbsorptionAssayCommand(expansionState,expeditionRegistry,command,context,sequence);\n" + route)
    s = replace_once(s, "    validateAuditRemainderNative(plan.state,plan.gameplay || gameplaySnapshot());",
                     "    validateAuditRemainderNative(plan.state,plan.gameplay || gameplaySnapshot());\n    validateGameAbsorptionAssay(plan.state,expeditionRegistry,{...plan,gameplay:plan.gameplay || gameplaySnapshot()});")
    # Raw save rows are validated before native reconstruction and any publish.
    load = "            expansionState = initializeExpedition(loadExpansionState(save_data.expansion, expeditionRegistry, expansionState.rng));"
    s = replace_once(s, load, load + "\n            validateGameAbsorptionAssay(expansionState,expeditionRegistry,{gameplay:{player:{inventory:Object.fromEntries(Object.entries(save_data.character.inventory || {}).map(([key,row])=>[key,row.count]))}}});")
    section = re.search(r"function actFeatureExpansion\(command\)\{.*?\n\}", s, re.S)
    assert section
    body = section.group()
    cancel = "        if(!job||!["
    assert body.count(cancel) == 1
    body = replace_once(body, cancel, "        if(job&&expeditionRegistry.simulation.commands.get(job.commandId)?.group==='game_absorption_assay'){\n            persistExpansion(cancelGameAbsorptionAssayJob(expansionState,expeditionRegistry,job.id,context,sequence));return;\n        }\n" + cancel)
    return s[:section.start()] + body + s[section.end():]


change("src/simulation_content.js", lambda s: "import {gameAbsorptionAssayDefinitions} from './game_absorption_assay_content.js';\n" + s + "\nsimulationDefinitions.commands.push(...gameAbsorptionAssayDefinitions.commands);\n")
change("src/simulation_effects.js", effects)
change("src/simulation.js", simulation)
change("src/expansion_engine.js", lambda s: replace_once("import {validateGameAbsorptionAssay} from './game_absorption_assay_facts.js';\n" + s,
       "    validateAuditedWorkshop(state,registry);", "    validateAuditedWorkshop(state,registry);\n    validateGameAbsorptionAssay(state,registry);"))
change("src/data/expedition_items.js", lambda s: "import {registerGameAbsorptionAssayItems} from '../game_absorption_assay_content.js';\n" + s + "\nregisterGameAbsorptionAssayItems({itemTemplates:item_templates,OtherItem});\n")
change("src/feature_expansion_wave_host.js", lambda s: replace_once("import {gameAbsorptionAssayPresentation} from './game_absorption_assay_host.js';\n" + s,
       "    sections.push(...nethackFieldcraftPresentation(state,registry,context).sections);", "    sections.push(...nethackFieldcraftPresentation(state,registry,context).sections);\n    sections.push(...gameAbsorptionAssayPresentation(state,registry,context).sections);"))
change("src/adventure_notebook.js", lambda s: replace_once(s, "'nethack_fieldcraft','audit_fixture'", "'nethack_fieldcraft','game_absorption_assay','audit_fixture'"))
change("src/display.js", lambda s: replace_once("import {projectGameAbsorptionAssayItemView} from './game_absorption_assay_item_view.js';\n" + s,
       "function nativeItemView(item){return projectFieldcraftItemView(item,fieldcraftKnowledgeReader(),{name:item.getName(),description:item.description||''});}",
       "function nativeItemView(item){const state=fieldcraftKnowledgeReader();return projectGameAbsorptionAssayItemView(item,state,projectFieldcraftItemView(item,state,{name:item.getName(),description:item.description||''}));}"))
change("src/main.js", main)

(OUT / "INTEGRATION.patch").write_text("".join(patches))
(OUT / "INTEGRATION_INPUTS.json").write_text(json.dumps({"capturedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    "qualification": "Read-only relevant shared dirty inputs. Patch generated and syntax checked in memory, not applied; no runtime/import/build check of these hypothetical shared changes.",
    "sha256": hashes, "checks": checks}, indent=2) + "\n")
print(json.dumps({"patch": str(OUT / "INTEGRATION.patch"), "sharedFiles": len(hashes), "checks": len(checks),
    "applied": False, "buildRun": False}))
