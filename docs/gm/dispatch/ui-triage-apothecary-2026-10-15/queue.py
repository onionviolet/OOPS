"""Detached queue: wait for the UI foundation lane to finish, then run NAV, TRIAGE, APOTHECARY.
Usage: queue.py  (starts detached)   |  queue.py --resume LANE SESSION_ID"""
import os,sys,pathlib,time,subprocess,json,hashlib
CODEX='/Applications/ChatGPT.app/Contents/Resources/codex-cli/CodexCLI.app/Contents/MacOS/codex'
REPO='/Users/weiwei/code/yet-another-idle-rpg';HERE=pathlib.Path(__file__).resolve().parent;RUNS=HERE/'runs'
FOUND=HERE.parent/'ui-foundation-2026-10-15'
def log(msg):
 with open(RUNS/'queue.log','a') as f:f.write(f'{time.ctime()} {msg}\n')
def foundation_running():
 out=subprocess.run(['ps','-axo','args'],capture_output=True,text=True).stdout
 return any('01a13dba-1433-7232-bd63-674e459f141a' in l or ('ui-foundation-2026-10-15' in l and 'codex' in l and 'exec' in l) for l in out.splitlines())
def foundation_ready():
 # A resumed CLI run need not emit the initial -o file. Delivery owners, not
 # that incidental output, establish completion. C1 also needs root's review.
 if not (FOUND/'REPORT.md').exists() or not (FOUND/'CHECKPOINT.md').exists():return False
 if (FOUND/'C1_ACK.md').exists():
  report=FOUND/'C1_REPORT.md'
  try:review=json.loads((RUNS/'C1_ROOT_REVIEW.json').read_text())
  except (OSError,ValueError):return False
  return report.exists() and review.get('sourceOwnershipReleased') is True and review.get('reportSha256')==hashlib.sha256(report.read_bytes()).hexdigest()
 return 'S3 complete, shared source ownership released' in (FOUND/'CHECKPOINT.md').read_text()
def run_lane(lane,argv):
 with open(RUNS/f'{lane}.log','a') as out:
  out.write(f'\n=== {time.ctime()} {lane}\n');out.flush()
  p=subprocess.Popen([CODEX]+argv,stdout=out,stderr=out,stdin=subprocess.DEVNULL)
  (RUNS/f'{lane}.pid').write_text(str(p.pid));log(f'{lane} started pid {p.pid}');rc=p.wait();log(f'{lane} exited {rc}')
  return rc
def lane_args(lane):
 prompt=(HERE/'COMMON.md').read_text()+'\n\n'+(HERE/f'{lane.upper()}.md').read_text()+f'\n\nYour folder is {HERE}. Working directory {REPO}. Begin now.'
 return ['exec','-C',REPO,'-c','model_reasoning_effort="high"','--dangerously-bypass-approvals-and-sandbox','-o',str(RUNS/f'{lane}.last.md'),prompt]
def main():
 log('queue waiting for ui-foundation lane')
 while foundation_running() or not foundation_ready():time.sleep(60)
 log('foundation lane finished');time.sleep(30)
 for lane in ('nav','triage','apothecary'):
  rc=run_lane(lane,lane_args(lane))
  if rc:log(f'{lane} failed; stopping queue');return
  if (RUNS/f'{lane}.BLOCKED.md').exists():log(f'{lane} blocked; stopping queue');return
 log('queue done')
if __name__=='__main__':
 RUNS.mkdir(exist_ok=True)
 if len(sys.argv)>3 and sys.argv[1]=='--resume':
  lane,sid=sys.argv[2],sys.argv[3]
  if os.fork():sys.exit(0)
  os.setsid()
  if os.fork():os._exit(0)
  run_lane(lane,['exec','resume',sid,'Continue from your report CHECKPOINT, following COMMON.md and your lane brief.']);sys.exit(0)
 if os.fork():sys.exit(0)
 os.setsid()
 if os.fork():os._exit(0)
 fd=os.open(os.devnull,os.O_RDWR);[os.dup2(fd,i) for i in (0,1,2)]
 (RUNS/'queue.pid').write_text(str(os.getpid()));main()
