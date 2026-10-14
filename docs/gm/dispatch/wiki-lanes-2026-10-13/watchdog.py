"""Lane watchdog (launchd, every 5 min). Starts lanes whose deps are done, resumes
stopped unfinished lanes by session id, and unloads itself when every lane is done.
Registry: lanes.json. State and logs: ~/.codex/research/wiki-lanes-2026-10-13/.
A lane is done when its `done` file exists and no process for it is alive."""
import json,os,pathlib,re,subprocess,sys,time
HERE=pathlib.Path(__file__).resolve().parent
CODEX='/Users/weiwei/MacTransferArchive/Application-staging/ChatGPT.app/Contents/Resources/codex-cli/CodexCLI.app/Contents/MacOS/codex'
LOGS=pathlib.Path.home()/'.codex/research/wiki-lanes-2026-10-13';STATE=LOGS/'watchdog-state.json'
PLIST=pathlib.Path.home()/'Library/LaunchAgents/com.weibao.yair-lane-watchdog.plist'
def now():return time.strftime('%Y-%m-%d %H:%M:%S')
def say(msg):
 with (LOGS/'watchdog.log').open('a') as f:f.write(f'{now()} {msg}\n')
def alive(pid):
 try:os.kill(pid,0);return True
 except OSError:return False
def procs():
 out=subprocess.run(['ps','-axww','-o','pid=,command='],capture_output=True,text=True).stdout
 return [(int(l.split(None,1)[0]),l.split(None,1)[1]) for l in out.splitlines() if 'MacOS/codex exec' in l]
def running(lane,state,ps):
 pid=state.get('pid')
 if pid and alive(pid) and any(p==pid for p,_ in ps):return True
 marker=pathlib.Path(lane['prompt']).read_text().splitlines()[0]
 sid=state.get('session')
 for p,cmd in ps:
  if marker in cmd or (sid and sid in cmd):state['pid']=p;return True
 return False
def session(lane):
 log=LOGS/f"{lane['name']}.log"
 if not log.exists():return None
 ids=re.findall(r'session id: ([0-9a-f-]{36})',log.read_text(errors='replace'))
 return ids[0] if ids else None
def spawn(lane,argv,state):
 log=LOGS/f"{lane['name']}.log";r,w=os.pipe()
 if os.fork():
  os.close(w);pid=int(os.read(r,32) or b'0');os.close(r);os.wait();state['pid']=pid;return
 os.close(r);os.setsid()
 if os.fork():os._exit(0)
 os.write(w,str(os.getpid()).encode());os.close(w)
 fd=os.open(log,os.O_WRONLY|os.O_CREAT|os.O_APPEND);os.dup2(fd,1);os.dup2(fd,2);os.dup2(os.open(os.devnull,os.O_RDONLY),0)
 os.write(1,f"\n=== {time.ctime()} {lane['name']} {argv[:2]}\n".encode());os.chdir(lane['cwd'])
 os.execv(CODEX,[CODEX]+argv)
def main():
 LOGS.mkdir(parents=True,exist_ok=True)
 import fcntl;lock=(LOGS/'watchdog.lock').open('a')
 try:fcntl.flock(lock,fcntl.LOCK_EX|fcntl.LOCK_NB)
 except OSError:return
 reg=json.loads((HERE/'lanes.json').read_text())
 st=json.loads(STATE.read_text()) if STATE.exists() else {}
 ps=procs();lanes={l['name']:l for l in reg['lanes']};status={}
 for l in reg['lanes']:
  s=st.setdefault(l['name'],{'resumes':0});s['session']=s.get('session') or session(l)
  run=running(l,s,ps);done=pathlib.Path(l['done']).exists()
  status[l['name']]='running' if run else ('done' if done else ('waiting' if not all(status.get(d)=='done' for d in l['deps']) else 'stopped'))
 count=sum(v=='running' for v in status.values())
 for l in reg['lanes']:
  n=l['name'];s=st[n]
  if status[n]!='stopped' or count>=reg['max_running']:continue
  if s.get('session'):
   prog=pathlib.Path(l['progress']) if l.get('progress') else None
   rows=sum(1 for _ in prog.open()) if prog and prog.exists() else -1
   # No new ledger rows since the last resume (for example a usage limit): back off, never give up.
   s['stall']=s.get('stall',0)+1 if rows!=-1 and rows==s.get('rows') else 0;s['rows']=rows
   gap=min(reg['resume_gap']*2**s['stall'],4*3600)
   if time.time()-s.get('last',0)<gap:s['stall']=max(0,s['stall']-1);continue
   spawn(l,['exec','resume',s['session'],'Continue from your CHECKPOINT (or report) next pending item, following your prompt and its COMMON rules. Your ledger is the authority on progress.'],s)
   s['resumes']+=1;say(f'resume {n} #{s["resumes"]}')
  else:
   prompt=pathlib.Path(l['prompt']).read_text()+f"\n\nWorking root: {l['cwd']}. Begin now."
   spawn(l,['exec','-m',l.get('model',reg['model']),'-c',f'model_reasoning_effort="{l.get("effort",reg["effort"])}"','-C',l['cwd'],prompt],s);say(f'start {n}')
  s['last']=time.time();status[n]='running';count+=1
 STATE.write_text(json.dumps(st,indent=1))
 lines=[f'# Lane status ({now()})','','| Lane | Status | Resumes | Ledger rows | Stall | Session |','|---|---|---|---|---|---|']+[f"| {n} | {status[n]} | {st[n]['resumes']} | {st[n].get('rows','')} | {st[n].get('stall',0)} | {st[n].get('session') or ''} |" for n in lanes]
 (HERE/'STATUS.md').write_text('\n'.join(lines)+'\n')
 if all(v=='done' for v in status.values()):
  say('all lanes finished; unloading');subprocess.run(['launchctl','bootout',f'gui/{os.getuid()}',str(PLIST)])
if __name__=='__main__':main()
