"""Detached Codex launcher (setsid double fork). Usage: launch.py B1 [B2...] | launch.py --resume B1 SESSION_ID"""
import os,sys,pathlib,time
CODEX='/Users/weiwei/MacTransferArchive/Application-staging/ChatGPT.app/Contents/Resources/codex-cli/CodexCLI.app/Contents/MacOS/codex'
REPO='/Users/weiwei/code/yet-another-idle-rpg';HERE=pathlib.Path(__file__).resolve().parent.parent
LOGS=pathlib.Path.home()/'.codex/research/body-lineage-2026-10-14'
def spawn(lane,argv):
 LOGS.mkdir(parents=True,exist_ok=True);log=LOGS/f'{lane}.log'
 if os.fork():return
 os.setsid()
 if os.fork():os._exit(0)
 fd=os.open(log,os.O_WRONLY|os.O_CREAT|os.O_APPEND);os.dup2(fd,1);os.dup2(fd,2)
 os.dup2(os.open(os.devnull,os.O_RDONLY),0)
 os.write(1,f'\n=== {time.ctime()} {lane} {argv[:2]}\n'.encode())
 os.execv(CODEX,[CODEX]+argv)
def args(lane):return ['-C',REPO,'-c','model_reasoning_effort="high"','--dangerously-bypass-approvals-and-sandbox','-o',str(LOGS/f'{lane}.last.md')]
if __name__=='__main__':
 if sys.argv[1]=='--resume':
  lane,sid=sys.argv[2],sys.argv[3]
  spawn(lane,['exec','resume',sid,'Continue from your CHECKPOINT next pending item, following your prompt and COMMON.md.'])
 else:
  for lane in sys.argv[1:]:
   prompt=(HERE/f'{lane.upper()}.md').read_text()+f'\n\nYour working directory is {REPO}. Begin now.'
   spawn(lane,['exec']+args(lane)+[prompt]);time.sleep(2)
