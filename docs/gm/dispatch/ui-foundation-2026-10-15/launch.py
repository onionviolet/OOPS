"""Detached Codex launcher (setsid double fork). Usage: launch.py | launch.py --resume SESSION_ID"""
import os,sys,pathlib,time
CODEX='/Applications/ChatGPT.app/Contents/Resources/codex-cli/CodexCLI.app/Contents/MacOS/codex'
REPO='/Users/weiwei/code/yet-another-idle-rpg';HERE=pathlib.Path(__file__).resolve().parent;RUNS=HERE/'runs'
def spawn(argv):
 RUNS.mkdir(exist_ok=True);log=RUNS/'ui.log'
 if os.fork():return
 os.setsid()
 if os.fork():os._exit(0)
 fd=os.open(log,os.O_WRONLY|os.O_CREAT|os.O_APPEND);os.dup2(fd,1);os.dup2(fd,2);os.dup2(os.open(os.devnull,os.O_RDONLY),0)
 (RUNS/'ui.pid').write_text(str(os.getpid()))
 os.write(1,f'\n=== {time.ctime()} ui {argv[:2]}\n'.encode())
 os.execv(CODEX,[CODEX]+argv)
if __name__=='__main__':
 if len(sys.argv)>2 and sys.argv[1]=='--resume':
  spawn(['exec','resume',sys.argv[2],'You were stopped by the coordinator mid-check (check-browser.cjs and its server may need restarting; check ports before reuse). Re-read COMMON.md: a new section "Correction from Weibao, 2026-10-15" at its end supersedes S1 step 1. Apply it, then continue S1 from where you stopped, following COMMON.md.'])
 else:
  prompt=(HERE/'COMMON.md').read_text()+f'\n\nYour folder is {HERE}. Your working directory is {REPO}. Begin now with S1.'
  spawn(['exec','-C',REPO,'-c','model_reasoning_effort="high"','--dangerously-bypass-approvals-and-sandbox','-o',str(RUNS/'ui.last.md'),prompt])
