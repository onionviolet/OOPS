import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {execFileSync} from 'node:child_process';
import {gzipSync} from 'node:zlib';
import {createRequire} from 'node:module';
const lane=path.dirname(new URL(import.meta.url).pathname);
const rows=JSON.parse(fs.readFileSync(path.join(lane,'package-data.json')));
const scratch=fs.mkdtempSync(path.join(os.tmpdir(),'yairpg-er6-'));
const runtime=rows.filter(r=>!['@playwright/test','vitest'].includes(r.name)&&r.version);
fs.writeFileSync(path.join(scratch,'package.json'),JSON.stringify({private:true,type:'module',dependencies:Object.fromEntries(runtime.map(r=>[r.name,r.version]))}));
console.log('SCRATCH',scratch);
execFileSync('npm',['install','--ignore-scripts','--no-audit','--no-fund','--package-lock=true'],{cwd:scratch,stdio:'inherit'});
const esbuild=createRequire(path.join(process.cwd(),'package.json'))('esbuild');
const results=[];
for(const r of runtime){
 const entry=path.join(scratch,'entry.js');fs.writeFileSync(entry,`import * as lib from ${JSON.stringify(r.name)}; globalThis.__ER6=lib;`);
 try{
  const b=await esbuild.build({entryPoints:[entry],bundle:true,minify:true,format:'esm',platform:'browser',target:'es2022',write:false,metafile:true,logLevel:'silent'});
  const bytes=b.outputFiles[0].contents;
  const pkg=JSON.parse(fs.readFileSync(path.join(scratch,'node_modules',r.name,'package.json')));
  const result={name:r.name,version:r.version,minified:bytes.length,gzip:gzipSync(bytes,{level:9,mtime:0}).length,type:pkg.type,module:pkg.module,exports:pkg.exports,inputs:Object.keys(b.metafile.inputs)};
  if(r.name==='@sqlite.org/sqlite-wasm'){
   function walk(dir){for(const f of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,f.name);if(f.isDirectory())walk(p);else if(f.name.endsWith('.wasm')){const x=fs.readFileSync(p);(result.wasm??=[]).push({file:path.relative(scratch,p),bytes:x.length,gzip:gzipSync(x,{level:9,mtime:0}).length});}}}walk(path.join(scratch,'node_modules',r.name));
  }
  results.push(result);console.log(r.name,bytes.length,result.gzip,result.wasm||'');
 }catch(e){results.push({name:r.name,error:e.message});console.log(r.name,'ERROR',e.message);}
}
fs.writeFileSync(path.join(lane,'bundle-data.json'),JSON.stringify({scratch,esbuild:esbuild.version,recipe:'namespace retained; browser/es2022/esm/minify; gzip level 9; no execution',results},null,2)+'\n');
