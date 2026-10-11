"""Generate honest acquisition-only dossiers for targets without installed source."""
from pathlib import Path
import json,hashlib,datetime
root=Path(__file__).resolve().parents[3]
lane=Path(__file__).parent
private=Path.home()/'.codex/research/library-games-2026-10-09/storefront'
metadata=json.loads((lane/'STEAM_METADATA.json').read_text())
apps={x['appid']:x for x in metadata['apps']}
targets=[
 (3848900,'sucker-for-love-crush-landing','Romance, consequential scene choices and endings','Publisher documentation describes a cosmic-horror romance visual novel with puzzles and multiple endings. No affection formula, route flags or branch settlement has been read.'),
 (3795920,'ani-idle','Idle versus active, rest, crafting and quests','Publisher documentation describes fighting, loot, resting, quests and gear crafting. Prestige, offline policy and action scheduling remain unknown.'),
 (2847400,'endless-ascent','Puzzle progression and readable obstacles','Publisher documentation describes an ascent through robots, magic, puzzles and obstacles. A tower upgrade or prestige loop is not established; do not treat this as an idle climber.'),
 (3606890,'upload-labs','Research, automation and production bottlenecks','Publisher documentation describes configuring connected download, processing and upload nodes. Exact recipes, research trees, bottleneck formulas and reset scope remain unread.'),
 (1740540,'the-lands-of-eldyn','Territory, commandable armies and harsh-world powers','Publisher documentation describes an online hack-and-slash territory-control MMO. It is not evidence of a single-player NPC life, aging or family simulation; useful comparisons may instead involve forts and armies.'),
]
rows=[]
for appid,slug,lens,observation in targets:
 p=root/'docs/research'/slug;p.mkdir(parents=True,exist_ok=True)
 assert not (p/'INTAKE.json').exists(),f'Existing owner: {p}'
 app=apps[appid];raw=private/f'APP_{appid}.json';data=json.loads(raw.read_text())[str(appid)]['data']
 depots=[]
 for depot,d in app['depots'].items():
  if not depot.isdigit():continue
  manifest=d.get('manifests',{}).get('public')
  if manifest:depots.append({'depot':depot,'platform':d.get('config',{}).get('oslist'),'manifest':manifest})
 requested=appid==3848900
 status='install-uri-sent-dialog-unobserved' if requested else 'queued-behind-first-unconfirmed-install'
 intake={'date':'2026-10-09','appid':appid,'name':data['name'],'status':'acquisition-only-not-a-completed-source-audit','lens':lens,'ownership':'unconfirmed; cache presence does not establish ownership','manifest_present':False,'install_request':status,'store_platforms':data.get('platforms'),'cached_depots':depots,'cached_config_installdir':app['config'].get('installdir'),'storefront_url':f'https://store.steampowered.com/app/{appid}/','metadata_api_url':f'https://store.steampowered.com/api/appdetails?appids={appid}&l=english','retained_storefront':{'path':str(raw),'bytes':raw.stat().st_size,'sha256':hashlib.sha256(raw.read_bytes()).hexdigest()},'useful_game_source':'not acquired','uninstall':'not requested; copy/pass gate not met','raw_game_code_committed':False,'dlc_declared':data.get('dlc',[]),'dlc_entitlement_installed_read':'not established'}
 (p/'INTAKE.json').write_text(json.dumps(intake,indent=2)+'\n')
 (p/'REPORT.md').write_text(f'''# {data['name']}: acquisition gate\n\n**Source audit pending.** {observation} This is a storefront qualification, not recovered game logic or a completed comparison. [Official Steam listing](https://store.steampowered.com/app/{appid}/).\n\nLens: {lens}. No source-backed five-to-ten proposal set or twenty-touch set is claimed. Producing those before reading the actual systems would invent evidence.\n\nSteam state: {status}; no installed manifest, account entitlement or finalized build confirmed. Native inspection failed with ScreenCaptureKit error -3811. The remaining games stay queued until the first install is reconciled. Cached public depot sizes are in [INTAKE.json](INTAKE.json); they are metadata estimates, not measured current install size.\n\nNo launch, save access, purchase, install-config change, uninstall or YAIR gameplay edit occurred for this target. Full recovery and per-app queue state: [combined checkpoint](../library-games-2026-10-09/CHECKPOINT.md).\n''')
 (p/'FINDINGS.json').write_text(json.dumps({'status':'storefront-only','documented_observation':observation,'source_url':f'https://store.steampowered.com/app/{appid}/','source_findings':[],'ranked_proposals':[],'small_touches':[],'reason':'Installed-source acquisition blocked, so implementation ideas are not fabricated.'},indent=2)+'\n')
 (p/'COVERAGE.json').write_text(json.dumps({'status':'acquisition-only','reviewed':['public Steam appdetails metadata','target-scoped cached Steam appinfo config/depot metadata'],'not_reviewed':['installed code/data','game mechanics','route/reset/save logic','DLC payload'],'not_exercised':['download completion','runtime','pacing','rendered UI','save/reload/import'],'source_audit_complete':False},indent=2)+'\n')
 (p/'IMPLEMENTATION_PACKETS.md').write_text('# Implementation packets pending\n\nNo source-backed packets released. Acquire a stable finalized payload, copy only needed files with hashes, inspect the assigned lens, and distinguish source findings from original YAIR proposals. Research does not authorize implementation.\n')
 (p/'CHECKPOINT.md').write_text(f'''# Acquisition checkpoint\n\n2026-10-09, revision 1, coordinator /root owns this directory. App {appid}. {status}. No manifest, finalized build, copied game payload or source-audit completion. Storefront snapshot hash retained in INTAKE.json. No active per-game worker, no install/uninstall claim.\n\nResume through [combined checkpoint](../library-games-2026-10-09/CHECKPOINT.md), preserving Steam order and one payload at a time. Reconcile pending app3848900 dialog before sending another install URL. Never buy, launch, touch saves or uninstall protected games. After actual source pass and retained-copy verification only, request Steam uninstall for this target and leave dialog confirmation to Weibao.\n''')
 rows.append({'appid':appid,'slug':slug,'status':status,'depots':depots})
(lane/'ACQUISITION_GATES.json').write_text(json.dumps(rows,indent=2)+'\n')
print('Created',len(rows),'explicitly incomplete acquisition dossiers')
