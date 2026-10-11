from pathlib import Path
import datetime,hashlib,json,re
ROOT=Path(__file__).resolve().parent
REPO=ROOT.parents[3]
now=datetime.datetime.now(datetime.timezone.utc).isoformat()
audits=json.loads((ROOT/'AUDITS.json').read_text())['audits']
assert len(audits)==6 and len({a['appid'] for a in audits})==6, 'All six sequential source passes must finish first.'
status=json.loads((ROOT/'STATUS.json').read_text())
steam=Path.home()/'Library/Application Support/Steam'
content=(steam/'logs/content_log.txt').read_text(errors='replace').splitlines()
console=(steam/'logs/console_log.txt').read_text(errors='replace').splitlines()
for audit in audits:
 assert audit['proposals']>=5 and audit['touches']>=20
 assert Path(audit['verification_private']).is_file()
 app=next(a for a in status['apps'] if a['appid']==audit['appid'])
 receipt=json.loads((ROOT/audit['uninstall_receipt']).read_text())
 lines=[l for l in content if f'AppID {audit["appid"]} ' in l]
 exists=(steam/'steamapps'/f'appmanifest_{audit["appid"]}.acf').exists()
 removed=not exists and any('finished uninstall (No Error)' in l for l in lines)
 receipt.update({'last_checked_at_utc':now,'manifest_present':exists,'content_log_entries':lines,'console_uninstall_entries':[l for l in console if f'steam://uninstall/{audit["appid"]}' in l][-4:],'uninstalled':'verified-manifest-absent-and-log-success' if removed else 'not-verified; request sent, dialog confirmation unobserved'})
 (ROOT/audit['uninstall_receipt']).write_text(json.dumps(receipt,indent=2)+'\n')
 audit['uninstall']=receipt['uninstalled']
 app.update({'result':'installed-source-pass-and-uninstall-request-complete','source_audit':audit['scope'],'installed_buildid':audit['buildid'],'audit_proposals':audit['proposals'],'audit_touches':audit['touches'],'final_manifest_present':exists,'content_log_entries':lines,'uninstall':receipt['uninstalled'],'ownership':'installation permitted and completed; no broader entitlement inventory inspected','platform_blocker':'not observed; installation succeeded'})
 directory=REPO/'docs/research'/audit['slug']
 p=directory/'INTAKE.json';d=json.loads(p.read_text());d['steam_installs_final_receipt_2026_10_09']=receipt;p.write_text(json.dumps(d,indent=2,ensure_ascii=False)+'\n')
 for name in ['REPORT.md','CHECKPOINT.md']:
  p=directory/name;s=p.read_text();heading='## Final Steam receipt, 2026-10-09'
  if heading not in s:s+=f'\n{heading}\n\nSource scope: {audit["scope"]}. Parent verified retained-copy gates and requested uninstall through Steam. Final observed removal state: **{receipt["uninstalled"]}**. [Per-app receipt](../../gm/dispatch/steam-installs-2026-10-09/{audit["uninstall_receipt"]}). No dialog clicked or game launched. Parent owns the dossier after reader handback. Earlier acquisition-only queue text is superseded by this pass.\n'
  p.write_text(s)
status.update({'state':'complete-source-passes-uninstall-requests-removal-as-recorded','finalized_at_utc':now,'completion_scope':'All six targets installed; six bounded installed-source passes and verified retention completed; uninstall URIs requested. Remote Eldyn mechanics and runtime remain unavailable/unverified, and actual removal requires observed Steam completion.'})
(ROOT/'STATUS.json').write_text(json.dumps(status,indent=2)+'\n')
(ROOT/'AUDITS.json').write_text(json.dumps({'updated_at_utc':now,'audits':audits},indent=2)+'\n')
rows='\n'.join(f'| {a["appid"]} | [{a["slug"]}](../../../research/{a["slug"]}/REPORT.md) | {a["buildid"]} | {a["proposals"]}/{a["touches"]} | {a["uninstall"]} |' for a in audits)
findings='\n'.join(f'- **F{i} {a["slug"]}:** {a["top_finding"]} Limit: {a["limits"]}' for i,a in enumerate(audits,1))
(ROOT/'REPORT.md').write_text(f'''# Steam installed-source audits, 2026-10-09\n\nAll six targets installed, received bounded source audits with verified private\nretention, and had uninstall URIs requested. Eldyn's installed content is a remote\nweb wrapper, so its actual gameplay mechanics remain unavailable. No game was\nlaunched and no Steam dialog was clicked. Removal status is recorded separately.\n\n## Acquisition and delivery\n\nWatch began {status['monitor_started_at_utc']}. All targets were Fully Installed by\n{status['all_targets_fully_installed_observed_at_utc']}, after {status['poll_count']}\npolls spaced about three minutes apart (one restart preserved the original deadline).\nThe two-hour cap was unnecessary after all targets installed.\n[STATUS.json](STATUS.json) and [timestamped observations](OBSERVATIONS.jsonl).\n\n| AppID | Report | Installed build | Proposals/touches | Removal observed |\n|---|---|---|---|---|\n{rows}\n\nCounts overlap across reports and are not distinct-idea totals. All proposals\nare original adaptations, not accepted decisions or implemented gameplay.\n\n## Findings and limits\n\n{findings}\n\nThe dated [north-star findings](../../../LIFE_SIM_NORTH_STAR.md#steam-install-follow-up-findings-2026-10-09)\nlink the six passes and keep adaptations marked proposals.\n\n## Verification and remaining gates\n\nRaw inputs remain private under `~/.codex/research/<game>/`; exact retention and\nrecovery hashes, tool versions and byte/line anchors stay with each dossier.\n[VALIDATION.json](VALIDATION.json) records static output checks and live shared\nworkspace drift. No YAIR source edits, builds, saves, commits or runtime tests\nwere performed by this task. Runtime, pacing, rendered UI and game persistence\nremain unexercised. Uninstall URI exit0 is a request, not confirmation of removal.\n''')
heading='## Steam install follow-up findings, 2026-10-09'
north=REPO/'docs/LIFE_SIM_NORTH_STAR.md';s=north.read_text()
assert heading not in s, 'Review existing dated subsection before replacing shared-owner content.'
source_rows='\n'.join(f'| [{a["slug"]}](research/{a["slug"]}/REPORT.md) | {a["top_finding"]} | {a["limits"]} |' for a in audits)
proposal_rows='\n'.join(f'| P{i} | {a["recommended_proposal"]} | [{a["slug"]} packets](research/{a["slug"]}/IMPLEMENTATION_PACKETS.md) |' for i,a in enumerate(sorted(audits,key=lambda a:[3848900,4522510,3795920,3606890,2847400,1740540].index(a["appid"])),1))
s+=f'''\n{heading}\n\n*Findings and original adaptation proposals only. No accepted decision or\nimplementation. [Combined audit](gm/dispatch/steam-installs-2026-10-09/REPORT.md)\nand [per-app status](gm/dispatch/steam-installs-2026-10-09/STATUS.json).*\n\n**F1 Acquisition:** All six targets reached Fully Installed during the watch.\nAudits ran one game at a time, with private source copies and matched hashes\nbefore each uninstall URI request. Actual removal remains a separate gate.\n\n**F2 Source scope:** These are bounded static source passes. No game launch,\npacing measurement, rendered UI or save/reload/import test occurred. Eldyn's\nlocal wrapper cannot establish its remotely delivered game mechanics.\n\n| Source | Finding | Limit |\n|---|---|---|\n{source_rows}\n\n**F3 Adaptation:** Each dossier carries five-to-ten ranked original proposals\nand at least twenty small touches mapped to native YAIR. The following are\nreview candidates, not instructions to implement or new accepted rules:\n\n| Code | Carry-forward original proposal | Evidence and future gates |\n|---|---|---|\n{proposal_rows}\n\nPreserve the vanilla opening and center menu. These findings select no additional\nprestige layer, networking/account system, new death policy or save migration.\nExisting playable acceptance work stays with its current owners.\n'''
north.write_text(s)
checks=[];errors=[]
for a in audits:
 directory=REPO/'docs/research'/a['slug']
 for name in ['INTAKE.json','REPORT.md','FINDINGS.json','COVERAGE.json','IMPLEMENTATION_PACKETS.md','CHECKPOINT.md']:
  p=directory/name
  if not p.is_file():errors.append('missing:'+str(p));continue
  if p.suffix=='.json':json.loads(p.read_text())
  checks.append(str(p.relative_to(REPO)))
 for p in directory.glob('*.md'):
  for target in re.findall(r'\]\(([^)]+)\)',p.read_text()):
   target=target.split('#',1)[0]
   if not target or '://' in target or target.startswith('mailto:'):continue
   if not (p.parent/target).exists():errors.append('broken-link:'+str(p.relative_to(REPO))+':'+target)
baseline=json.loads((ROOT/'INPUT_SNAPSHOT.json').read_text())
drift=[p for p,h in baseline['protected_project_files'].items() if not (REPO/p).exists() or hashlib.sha256((REPO/p).read_bytes()).hexdigest()!=h]
protected={}
for appid,h in status['protected_manifest_sha256_baseline'].items():
 p=steam/'steamapps'/f'appmanifest_{appid}.acf';protected[appid]={'present':p.exists(),'hash_matches_baseline':p.is_file() and hashlib.sha256(p.read_bytes()).hexdigest()==h}
validation={'at_utc':now,'dossier_files_checked':len(checks),'json_parse':'passed','local_dossier_links_errors':errors,'raw_copy_gates':'verified before each uninstall request; private receipts linked in AUDITS.json','proposals_touch_minimums':'passed','project_files_checked':len(baseline['protected_project_files']),'project_input_drift':drift,'drift_interpretation':'Live shared-workspace differences only; this task did not edit or revert those files.','protected_game_manifests':protected,'runtime':'not exercised; research only','builds_tests_commits':'none by this task'}
(ROOT/'VALIDATION.json').write_text(json.dumps(validation,indent=2)+'\n')
(ROOT/'CHECKPOINT.md').write_text(f'''# Steam installs final checkpoint\n\nFinalized {now}; parent `/root`. [Assignment](ASSIGNMENT.md).\n**All six acquired, bounded source passes and retention checks completed,\nuninstall URIs requested. Actual removal is recorded separately.**\n[REPORT](REPORT.md), [STATUS](STATUS.json), [audit scopes](AUDITS.json),\n[static validation](VALIDATION.json), [observations](OBSERVATIONS.jsonl).\n\n## Ownership and next gate\n\nAll six bounded readers completed and handed dossiers back; parent owns the\nsix dossiers, dispatch and dated north-star subsection. No active reader,\nmonitor, download or extraction process remains. No YAIR source edits, builds,\nsaves or commits by this task. Preserve live unrelated source/build drift\nreported in VALIDATION; never revert it to the initial snapshot.\n\nUninstall requests passed retained-copy/source-scope gates. Reconcile any still\npresent manifests and Steam uninstall dialogs without clicking them. Never\nlaunch games, accept terms, log in, purchase or inspect private saves. Keep\nYour Chronicle, VTube Studio and100 Space Cats.\n\nEldyn remote gameplay is unavailable locally, with public reachability/DNS failure\nrecorded; no permanent shutdown or game-mechanics conclusion asserted. Other\nsource gaps and all unexercised runtime gates remain with each dossier.\nProposals are unaccepted and unimplemented. No further gameplay scope granted.\n''')
assert not errors, errors
print(json.dumps({'audits':len(audits),'dossier_files':len(checks),'broken_links':len(errors),'project_drift':len(drift),'uninstall_states':{a['slug']:a['uninstall'] for a in audits}},indent=2))
