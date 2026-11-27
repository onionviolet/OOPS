// Diagnose subsequent archive worlds without rerunning the complete build.
import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url));
const out=join(root,'work/atlas-archive-scale-20261125/diagnostic-readers');mkdirSync(out,{recursive:true});
const worlds=[...new Set(JSON.parse(readFileSync(join(root,'docs/gm/dispatch/batch-reading-2026-10-27/plans/books.json'),'utf8')).books.map(b=>b.world))];
const results=[];
for(const world of worlds.slice(worlds.indexOf(process.argv[2]||'ttks5'))){
 const start=performance.now();let result;
 try{
  const matrix=JSON.parse(execFileSync(process.execPath,[join(root,'prototypes/world-atlas/reader-findings.mjs'),'--world',world,'--out-dir',out],
   {cwd:root,encoding:'utf8',maxBuffer:16*1024*1024,windowsHide:true,stdio:['ignore','pipe','pipe']}));
  result={world,exit:0,ms:performance.now()-start,rssKiB:matrix.buildStats.maxRssKiB,observedSlices:matrix.worlds[0]?.read||0};
 }catch(e){result={world,exit:e.status||1,ms:performance.now()-start,error:String(e.stderr||e.message)};}
 results.push(result);writeFileSync(join(out,'results.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(result));
}
process.exitCode=results.some(r=>r.exit)?1:0;
