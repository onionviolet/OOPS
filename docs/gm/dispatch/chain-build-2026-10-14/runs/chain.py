"""Detached sequential runner: T2, then T3 only if T2's CHECKPOINT starts with DONE.
Usage: chain.py            (run T2 then T3)
       chain.py T3          (run only T3, e.g. after a manual T2 fix)
       chain.py --resume LANE SESSION_ID ["message"]"""
import os,sys,pathlib,subprocess,time
CODEX='/Users/weiwei/MacTransferArchive/Application-staging/ChatGPT.app/Contents/Resources/codex-cli/CodexCLI.app/Contents/MacOS/codex'
REPO='/Users/weiwei/code/yet-another-idle-rpg';HERE=pathlib.Path(__file__).resolve().parent
LOGS=pathlib.Path.home()/'.codex/research/chain-build-2026-10-14'
WT={'T2':'cb-t2-inspector','T3':'cb-t3-rules'}
def wt(l):return f'{REPO}/.claude/worktrees/{WT[l]}'
def log(msg):
 with open(LOGS/'chain.log','a') as f:f.write(f'{time.ctime()} {msg}\n')
def run(lane,argv):
 with open(LOGS/f'{lane}.log','a') as f:
  f.write(f'\n=== {time.ctime()} {lane} {argv[:2]}\n');f.flush()
  return subprocess.run([CODEX]+argv,stdout=f,stderr=f,stdin=subprocess.DEVNULL).returncode
BASE={'T2':'codex/gameplay-foundations','T3':'proc/cb-t2-inspector'}
BR={'T2':'proc/cb-t2-inspector','T3':'proc/cb-t3-rules'}
def ensure(lane):
 w=pathlib.Path(wt(lane))
 if not w.exists():
  subprocess.run(['git','-C',REPO,'worktree','add',str(w),'-b',BR[lane],BASE[lane]],check=True,capture_output=True)
 nm=w/'node_modules'
 if not nm.exists():nm.symlink_to(f'{REPO}/node_modules')
def args(lane):
 return ['-C',wt(lane),'-c','model_reasoning_effort="high"','--dangerously-bypass-approvals-and-sandbox','-o',str(LOGS/f'{lane}.last.md')]
def fresh(lane):
 p=(HERE.parent/f'{lane}.md').read_text()+f'\n\nYour worktree already exists and is your working directory: {wt(lane)}. Work only inside it. Begin now.'
 ensure(lane);rc=run(lane,['exec']+args(lane)+[p]);log(f'{lane} exit {rc}');return rc
def done(lane):
 cp=pathlib.Path(wt(lane))/f'docs/gm/dispatch/chain-build-2026-10-14/{lane.lower()}/CHECKPOINT.md'
 return cp.exists() and cp.read_text().lstrip().startswith('DONE')
def main():
 a=sys.argv[1:]
 if a and a[0]=='--resume':
  lane,sid=a[1],a[2];msg=a[3] if len(a)>3 else 'Continue from your CHECKPOINT next pending item, following your prompt and COMMON.md.'
  rc=run(lane,['exec','resume',sid,msg]);log(f'{lane} resume exit {rc}');return
 lanes=a or ['T2','T3']
 for lane in lanes:
  if lane=='T3' and 'T2' in lanes and not done('T2'):
   log('T3 not started: T2 CHECKPOINT is not DONE');return
  fresh(lane)
if __name__=='__main__':
 LOGS.mkdir(parents=True,exist_ok=True)
 if os.fork():sys.exit(0)
 os.setsid()
 if os.fork():os._exit(0)
 os.dup2(os.open(os.devnull,os.O_RDONLY),0)
 main()
