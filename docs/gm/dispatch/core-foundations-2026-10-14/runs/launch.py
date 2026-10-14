"""Load-gated detached Codex launcher (setsid double fork).
Usage: launch.py --gate A1 A2 ...   (waits until load and codex count are under limits, then launches one lane at a time)
       launch.py A1 ...             (launch now)
       launch.py --resume A1 SESSION_ID"""
import os,sys,pathlib,time,subprocess
CODEX='/Users/weiwei/MacTransferArchive/Application-staging/ChatGPT.app/Contents/Resources/codex-cli/CodexCLI.app/Contents/MacOS/codex'
REPO='/Users/weiwei/code/yet-another-idle-rpg';HERE=pathlib.Path(__file__).resolve().parent;DISPATCH=HERE.parent
LOGS=HERE
WT={'A2':'core-a2-tags','A3':'core-a3-travel-tests','A4':'core-a4-relationships','A5':'core-a5-determinism'}
MAX_LOAD=float(os.environ.get('MAX_LOAD','140'));MAX_CODEX=int(os.environ.get('MAX_CODEX','45'))
def cwd(lane):return f'{REPO}/.claude/worktrees/{WT[lane]}' if lane in WT else REPO
def detach():
 if os.fork():return False
 os.setsid()
 if os.fork():os._exit(0)
 return True
def spawn(lane,argv):
 log=LOGS/f'{lane}.log'
 if os.fork():return
 os.setsid()
 if os.fork():os._exit(0)
 fd=os.open(log,os.O_WRONLY|os.O_CREAT|os.O_APPEND);os.dup2(fd,1);os.dup2(fd,2)
 os.dup2(os.open(os.devnull,os.O_RDONLY),0)
 os.write(1,f'\n=== {time.ctime()} {lane} {argv[:2]}\n'.encode())
 os.execv(CODEX,[CODEX]+argv)
def args(lane):return ['-C',cwd(lane),'-c','model_reasoning_effort="high"','--dangerously-bypass-approvals-and-sandbox','-o',str(LOGS/f'{lane}.last.md')]
def launch(lane):
 prompt=(DISPATCH/f'{lane.upper()}.md').read_text()+f'\n\nYour working directory is {cwd(lane)}. Begin now.'
 spawn(lane,['exec']+args(lane)+[prompt])
def busy():
 load=os.getloadavg()[0]
 n=int(subprocess.run("ps ax -o command | grep -c '[c]odex exec'",shell=True,capture_output=True,text=True).stdout.strip() or 0)
 return load,n
if __name__=='__main__':
 a=sys.argv[1:]
 if a[0]=='--resume':spawn(a[1],['exec','resume',a[2],'Continue from your CHECKPOINT next pending item, following your prompt and COMMON.md.'])
 elif a[0]=='--gate':
  if not detach():sys.exit(0)
  g=open(LOGS/'gate.log','a',buffering=1)
  for lane in a[1:]:
   while True:
    load,n=busy()
    if load<MAX_LOAD and n<MAX_CODEX:break
    g.write(f'{time.ctime()} waiting {lane}: load {load:.0f} codex {n}\n');time.sleep(300)
   g.write(f'{time.ctime()} launching {lane}: load {load:.0f} codex {n}\n');launch(lane);time.sleep(240)
  g.write(f'{time.ctime()} gate done\n')
 else:
  for lane in a:launch(lane);time.sleep(2)
