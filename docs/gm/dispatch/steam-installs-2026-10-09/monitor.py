from pathlib import Path
import datetime, hashlib, json, re, time
ROOT=Path(__file__).resolve().parent
STEAM=Path.home()/'Library/Application Support/Steam'
APPS={3848900:'Sucker for Love: Crush Landing',4522510:'Kill the Lich Idle',3795920:'Ani Idle',2847400:'Endless Ascent',3606890:'Upload Labs',1740540:'The Lands of Eldyn'}
previous=json.loads((ROOT/'STATUS.json').read_text()) if (ROOT/'STATUS.json').exists() else {}
start=datetime.datetime.fromisoformat(previous['monitor_started_at_utc']).timestamp() if previous else time.time()
deadline=start+7200
handled={1740540} if previous else set()
stamp=lambda:datetime.datetime.now(datetime.timezone.utc).isoformat()
history=ROOT/'OBSERVATIONS.jsonl'
protected=[1546320,1325860,2854290]
baseline={str(a):hashlib.sha256((STEAM/'steamapps'/f'appmanifest_{a}.acf').read_bytes()).hexdigest() for a in protected if (STEAM/'steamapps'/f'appmanifest_{a}.acf').exists()}
while True:
 now=stamp(); content=(STEAM/'logs/content_log.txt').read_text(errors='replace'); console=(STEAM/'logs/console_log.txt').read_text(errors='replace')
 apps=[]; ready=[]
 for a,name in APPS.items():
  manifest=STEAM/'steamapps'/f'appmanifest_{a}.acf'
  data=manifest.read_text() if manifest.exists() else None
  fields=dict(re.findall(r'"([^"\n]+)"\s+"([^"\n]*)"', data or ''))
  fields.pop('LastOwner',None)
  flags=int(fields.get('StateFlags','0'))
  full=bool(flags & 4) and not bool(flags & (1|2|16|32|128|256|512|1024|2048|4096|8192|16384|32768|65536|131072))
  if full and a not in handled: ready.append(a)
  apps.append({'appid':a,'game':name,'manifest_path':str(manifest),'manifest_present':data is not None,'manifest_fields':fields,'fully_installed':full,'result':'fully-installed-awaiting-audit' if full else 'manifest-present-not-fully-installed' if data else 'no-manifest','observed_reason':'No target manifest or target download entry observed; install dialog confirmation unobserved.' if not data and not any(f'AppID {a} ' in l for l in content.splitlines()) else 'See manifest fields and content-log evidence.','ownership':'unconfirmed','platform_blocker':'unconfirmed','dialog_confirmation':'unobserved','content_log_entries':[l for l in content.splitlines() if f'AppID {a} ' in l],'install_url_entries':[l for l in console.splitlines() if f'steam://install/{a}' in l][-4:],'source_audit':'installed-wrapper-audit-in-progress' if a in handled else 'not-started-no-installed-payload','uninstall':'not-requested-install-and-audit-gates-unmet'})
 finished=time.time()>=deadline
 observation={'observed_at_utc':now,'elapsed_seconds':round(time.time()-start,1),'apps':apps,'content_log_sha256':hashlib.sha256(content.encode()).hexdigest(),'content_log_mtime_utc':datetime.datetime.fromtimestamp((STEAM/'logs/content_log.txt').stat().st_mtime,datetime.timezone.utc).isoformat()}
 with history.open('a') as f:f.write(json.dumps(observation)+'\n')
 status={'task':'steam-installs-2026-10-09','monitor_started_at_utc':datetime.datetime.fromtimestamp(start,datetime.timezone.utc).isoformat(),'deadline_utc':datetime.datetime.fromtimestamp(deadline,datetime.timezone.utc).isoformat(),'last_observed_at_utc':now,'poll_interval_seconds':180,'state':'ready-for-audit' if ready else 'monitoring-complete' if finished else 'monitoring','poll_count':sum(1 for _ in history.open()),'protected_manifest_sha256_baseline':baseline,'apps':apps,'evidence':'OBSERVATIONS.jsonl','limitations':['No Steam dialog inspected or clicked.','No ownership or platform failure inferred from missing manifests.','No source audit possible until a finalized installed payload exists.']}
 (ROOT/'STATUS.json').write_text(json.dumps(status,indent=2)+'\n')
 rows='\n'.join(f'| {x["appid"]} | {x["game"]} | {x["result"]} |' for x in apps)
 (ROOT/'CHECKPOINT.md').write_text(f'''# Steam installs checkpoint\n\nRole: Steam installs research worker `/root`. Updated {now}.\nAssignment: [ASSIGNMENT.md](ASSIGNMENT.md). State: **{status['state']}**.\n\n## Scope and recovery\n\nOwn this dispatch directory; per-game dossiers and a dated findings subsection in\n`docs/LIFE_SIM_NORTH_STAR.md` are authorized. Preserve all pre-existing dirty work.\nNo YAIR source edits, builds, saves or commits. No game launch, login, terms,\npurchase or Steam dialog clicks. Audit one installed game at a time, copy only\nneeded source under `~/.codex/research/<game>/`, verify hashes, then request its\nuninstall URI. Keep Your Chronicle, VTube Studio and 100 Space Cats.\n\n## Observations\n\nStarted {status['monitor_started_at_utc']}; deadline {status['deadline_utc']}.\nPoll every 180 seconds, capped at two hours. Completed {status['poll_count']} polls.\nExact per-app evidence: [STATUS.json](STATUS.json); timestamped poll history:\n[OBSERVATIONS.jsonl](OBSERVATIONS.jsonl). Script: [monitor.py](monitor.py).\n\n| AppID | Game | Observed state |\n|---|---|---|\n{rows}\n\nSteam console acknowledged the install URIs at 15:31:54 through 15:32:09 local.\nA URI acknowledgment proves neither ownership nor a confirmed install dialog.\nMissing manifests alone establish no installed payload, not a specific cause.\nPrior library-game dossiers include a public-web KTL audit; it is not Steam-build\ncoverage and must be preserved as such.\n\n## Next action\n\n{'Inspect the newly installed payload and source-audit it sequentially.' if ready else 'After the deadline, finalize per-game acquisition receipts and proposal findings; if a target installs first, stop monitoring and audit it before requesting uninstall.' if not finished else 'Finalize per-game acquisition receipts, north-star findings and static output validation. No installed payload was observed.'}\n\nEldyn dossier writer: `/root/eldyn_audit`; parent owns dispatch and north-star. Check live worker status before resuming dossier writes. No UI or Steam configuration changed by this task.\n''')
 print(json.dumps({'at':now,'poll':status['poll_count'],'ready':ready,'state':status['state']}),flush=True)
 if ready or finished:break
 time.sleep(min(180,max(0,deadline-time.time())))
