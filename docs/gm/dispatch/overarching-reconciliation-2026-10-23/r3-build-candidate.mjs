import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {createHash} from 'node:crypto';
import * as esbuild from 'esbuild';
const root=process.cwd(),out='docs/gm/dispatch/overarching-reconciliation-2026-10-23';
const tag=process.env.R3_TAG||'';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'yair-r3-'));
for(const name of ['src','styles','assets','resources','locales','stories'])if(fs.existsSync(name))fs.cpSync(name,path.join(dir,name),{recursive:true});
for(const name of ['docs/gm/book-world-player-agency/contracts','docs/gm/feature-wave/ink']){fs.mkdirSync(path.dirname(path.join(dir,name)),{recursive:true});fs.cpSync(name,path.join(dir,name),{recursive:true});}
for(const name of ['index.html','style.css','package.json'])fs.copyFileSync(name,path.join(dir,name));
fs.mkdirSync(path.join(dir,'dist'),{recursive:true});
const result=await esbuild.build({absWorkingDir:dir,entryPoints:['src/main.js'],bundle:true,sourcemap:true,minify:true,outfile:'dist/bundle.js',platform:'browser',target:'es2022',format:'esm',metafile:true,nodePaths:[path.join(root,'node_modules')]});
const hash=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const inputs=Object.fromEntries(Object.keys(result.metafile.inputs).map(p=>{const file=path.resolve(dir,p);return [p,{snapshot:hash(file),current:fs.existsSync(path.resolve(root,p))?hash(path.resolve(root,p)):null}];}));
const html=fs.readFileSync(path.join(dir,'index.html'),'utf8').replace(/dist\/bundle\.js\?version=[^&"]+/,'dist/bundle.js?version=r3-isolated');fs.writeFileSync(path.join(dir,'index.html'),html);
fs.writeFileSync(path.join(out,`r3-${tag}candidate.json`),JSON.stringify({dir,bundleSHA256:hash(path.join(dir,'dist/bundle.js')),inputs},null,2)+'\n');
console.log(JSON.stringify({dir,inputCount:Object.keys(inputs).length,bundleSHA256:hash(path.join(dir,'dist/bundle.js'))}));
