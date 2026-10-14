"""Detached Codex reader launcher (setsid double fork). Usage: launch.py LANE [LANE...] | launch.py --resume LANE SESSION_ID"""
import os,sys,pathlib,time
CODEX='/Users/weiwei/MacTransferArchive/Application-staging/ChatGPT.app/Contents/Resources/codex-cli/CodexCLI.app/Contents/MacOS/codex'
REPO='/Users/weiwei/code/yet-another-idle-rpg';HERE=pathlib.Path(__file__).resolve().parent
LOGS=pathlib.Path.home()/'.codex/research/wiki-lanes-2026-10-13'
ARGS=['-m','gpt-6-luna','-c','model_reasoning_effort="medium"','-C',REPO]
def spawn(lane,argv):
 LOGS.mkdir(parents=True,exist_ok=True);log=LOGS/f'{lane}.log'
 if os.fork():return
 os.setsid()
 if os.fork():os._exit(0)
 fd=os.open(log,os.O_WRONLY|os.O_CREAT|os.O_APPEND);os.dup2(fd,1);os.dup2(fd,2)
 os.dup2(os.open(os.devnull,os.O_RDONLY),0)
 os.write(1,f'\n=== {time.ctime()} {lane} {argv[:3]}\n'.encode())
 os.execv(CODEX,[CODEX]+argv)
if __name__=='__main__':
 if sys.argv[1]=='--resume':
  lane,sid=sys.argv[2],sys.argv[3]
  spawn(lane,['exec','resume',sid,'Continue your lane from your CHECKPOINT next pending input, following COMMON.md.'])
 else:
  for lane in sys.argv[1:]:
   prompt=(HERE/f'{lane.upper()}.md').read_text()+'\n\nRepository root is '+REPO+'. Begin now.'
   spawn(lane,['exec']+ARGS+[prompt]);time.sleep(2)
