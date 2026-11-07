// macOS background-only shell experiment. Does not touch the installed app or real profiles.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import {spawn, execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {ROOT,prepareTree,build,loadPlaywright} from './lib.mjs';
const require=createRequire(import.meta.url);
const out=path.join(ROOT,'work/shell-comparison-20261106');
const web=path.join(out,'web');
const args=process.argv.slice(2);
if(args.includes('--prepare')) {
  prepareTree('WORKTREE',web);
  fs.copyFileSync(path.join(ROOT,'scripts/stylesheet_manifest.mjs'),path.join(web,'scripts/stylesheet_manifest.mjs'));
  for (const asset of ['resources','assets','private_packs']) if(fs.existsSync(path.join(ROOT,asset))) fs.cpSync(path.join(ROOT,asset),path.join(web,asset),{recursive:true});
  await build(web);
  fs.copyFileSync(path.join(web,'index.html'),path.join(out,'original-index.html'));
  fs.writeFileSync(path.join(out,'input.json'),JSON.stringify({head:execFileSync('git',['rev-parse','HEAD'],{cwd:ROOT}).toString().trim(),
    bundleSha256:createHash('sha256').update(fs.readFileSync(path.join(web,'dist/bundle.js'))).digest('hex'),
    platform:os.platform(),arch:os.arch(),cpus:os.cpus().length,memory:os.totalmem(),date:new Date().toISOString()},null,2));
  console.log('Prepared isolated game build');process.exit(0);
}
const value=(flag, fallback)=>args.includes(flag)?args[args.indexOf(flag)+1]:fallback;
const runs=Number(value('--runs','3'));
const durationMs=Number(value('--seconds','20'))*1000;
const fixtures=value('--fixtures','fresh,crowded').split(',');
const hosts=value('--hosts','electron,tauri').split(',');
const events=[];
let current;
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.ico':'image/x-icon'};
const server=http.createServer((req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Cache-Control','no-store');
  if(req.method==='POST' && req.url==='/report') {
    let data='';req.on('data',d=>data+=d);req.on('end',()=>{
      const e={...JSON.parse(data),receivedMs:performance.now()-current.started};events.push(e);current.events.push(e);
      if(e.type==='ready')console.log(current.host,current.fixture,current.run,'ready',Math.round(e.receivedMs),'ms');
      res.end('ok');
    });return;
  }
  const pathname=decodeURIComponent(new URL(req.url,'http://x').pathname);
  const file=path.resolve(web,'.'+(pathname==='/'?'/index.html':pathname));
  if(!file.startsWith(web+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){if(current?.host==='tauri')current.httpMisses.push(req.url);res.writeHead(404);res.end();return;}
  res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base=`http://127.0.0.1:${server.address().port}`;
const sample=pid=>JSON.parse(execFileSync('python3',[path.join(ROOT,'scripts/perf/shell-processes.py'),String(pid)]).toString());
const results=[];
let stopping=false;
for(const signal of ['SIGINT','SIGTERM']) process.on(signal,()=>{stopping=true;});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
try {
trials: for(let run=1;run<=runs;run++)for(const fixture of fixtures)for(const host of (run%2?hosts:[...hosts].reverse())) {
  current={host,fixture,run,normalizedVisibility:!args.includes('--native-visibility'),httpMisses:[],events:[],samples:[],loadBefore:os.loadavg(),started:performance.now()};
  const cfg={fixture:JSON.parse(fs.readFileSync(path.join(ROOT,'tests/fixtures/perf',fixture+'.json'))),durationMs,normalizeVisibility:!args.includes('--native-visibility'),report:base+'/report'};
  const script='<script>window.__shellConfig='+JSON.stringify(cfg).replaceAll('<','\\u003c')+';'+fs.readFileSync(path.join(ROOT,'scripts/perf/shell-page.js'),'utf8')+'</script>';
  fs.writeFileSync(path.join(web,'index.html'),fs.readFileSync(path.join(out,'original-index.html'),'utf8').replace('<head>','<head>'+script));
  let app, child, pid;
  const log=fs.openSync(path.join(out,`${host}-${fixture}-${run}.log`),'w');
  try {
    current.started=performance.now();
    if(host==='electron') {
      const profile=path.join(out,`profile-electron-${fixture}-${run}-${Date.now()}`);
      app=await loadPlaywright()._electron.launch({executablePath:require(path.join(ROOT,'node_modules/electron')),args:[ROOT],cwd:ROOT,
        env:{...process.env,YAIRPG_HIDDEN:'1',YAIRPG_USER_DATA:profile,YAIRPG_ROOT:web,YAIRPG_THROTTLE:'0',YAIRPG_SERVE_LOG:'1'}});
      pid=app.process().pid;
      await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].setContentSize(1920,1080));
    } else {
      child=spawn(path.join(out,'shell-launch'),[path.join(ROOT,'scripts/perf/tauri-prototype/target/release/oops-shell-prototype')],
        {env:{...process.env,OOPS_BENCH_URL:base+'/'},stdio:['ignore','pipe',log],detached:true});
      pid=await new Promise((resolve,reject)=>{child.stdout.once('data',data=>resolve(Number(data.toString().trim().split('\n')[0])));child.once('error',reject);child.once('exit',()=>reject(Error('launcher exited before PID')));});
      current.launcherPid=child.pid;
    }
    current.pid=pid;
    fs.writeFileSync(path.join(out,'live-run.json'),JSON.stringify({host,fixture,run,pid,launcherPid:current.launcherPid,driverPid:process.pid,started:new Date().toISOString()},null,2));
    while(!current.events.some(e=>e.type==='reloaded'||e.type==='failed')) {
      if(stopping)throw Error('interrupted');
      const elapsed=performance.now()-current.started;
      if(elapsed>130000)throw Error('run timeout');
      const processes=sample(pid);
      current.samples.push({elapsedMs:elapsed,processes});
      if(!processes.some(p=>p.pid===pid))throw Error('host exited');
      await wait(1000);
    }
    if(app){const page=await app.firstWindow();current.missing=await app.evaluate(()=>globalThis.yairpgServeLog?.misses);await page.screenshot({path:path.join(out,`electron-${fixture}-${run}.png`)});}
  } catch(error) {current.failure=String(error);}
  finally {
    if(app)await app.close().catch(()=>{});
    if(child){try{process.kill(-child.pid,'SIGTERM');}catch{} await wait(500);if(child.exitCode===null){try{process.kill(-child.pid,'SIGKILL');}catch{}}}
    fs.closeSync(log);
  }
  if(host==='tauri')current.missing=current.httpMisses;
  current.loadAfter=os.loadavg();
  results.push(current);fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2));
  console.log(host,fixture,run,current.failure||current.events.at(-1)?.type);
  if(stopping)break trials;
}
}finally{fs.writeFileSync(path.join(out,'live-run.json'),JSON.stringify({status:stopping?'interrupted':'finished',driverPid:process.pid,capturedTrials:results.length,finishedUtc:new Date().toISOString()},null,2));server.closeAllConnections();await new Promise(r=>server.close(r));}
