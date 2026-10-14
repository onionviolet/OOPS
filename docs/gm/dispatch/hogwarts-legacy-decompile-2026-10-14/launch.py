"""Detached Codex launcher (setsid double fork). Usage: launch.py hl | launch.py --resume hl SESSION_ID [ADDENDUM.md]"""
import os,sys,pathlib,time
CODEX='/Users/weiwei/MacTransferArchive/Application-staging/ChatGPT.app/Contents/Resources/codex-cli/CodexCLI.app/Contents/MacOS/codex'
REPO='/Users/weiwei/code/yet-another-idle-rpg';HERE=pathlib.Path(__file__).resolve().parent
LOGS=HERE/'runs'
def spawn(lane,argv):
 LOGS.mkdir(parents=True,exist_ok=True);log=LOGS/f'{lane}.log'
 if os.fork():return
 os.setsid();os.chdir(REPO)
 if os.fork():os._exit(0)
 fd=os.open(log,os.O_WRONLY|os.O_CREAT|os.O_APPEND);os.dup2(fd,1);os.dup2(fd,2)
 os.dup2(os.open(os.devnull,os.O_RDONLY),0)
 os.write(1,f'\n=== {time.ctime()} {lane} {argv[:2]}\n'.encode())
 os.execv(CODEX,[CODEX]+argv)
def args(lane):return ['-C',REPO,'-c','model_reasoning_effort="high"','--dangerously-bypass-approvals-and-sandbox','-o',str(LOGS/f'{lane}.last.md')]
if __name__=='__main__':
 if sys.argv[1]=='--resume':
  lane,sid=sys.argv[2],sys.argv[3]
  if len(sys.argv)>4:spawn(lane,['exec','resume',sid,(HERE/sys.argv[4]).read_text()+'\n\nApply this now, then continue from your CHECKPOINT next pending item.']);sys.exit()
  spawn(lane,['exec','resume',sid,'Continue from docs/research/hogwarts-legacy/CHECKPOINT.md next pending item, following docs/gm/dispatch/hogwarts-legacy-decompile-2026-10-14/ASSIGNMENT.md.'])
 else:
  for lane in sys.argv[1:]:
   prompt=(HERE/'ASSIGNMENT.md').read_text()+f'\n\nYour working directory is {REPO}. Read AGENTS.md first. Begin now.'
   spawn(lane,['exec']+args(lane)+[prompt]);time.sleep(2)
