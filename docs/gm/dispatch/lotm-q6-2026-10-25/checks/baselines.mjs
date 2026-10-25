// Rebuild exact committed source inputs into a disposable overlay, never a shared checkout.
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {execFileSync} from 'node:child_process';import * as esbuild from 'esbuild';import crypto from 'node:crypto';
const root=process.cwd(),dir=fs.mkdtempSync(path.join(os.tmpdir(),'lotm-e1-baseline-'));fs.symlinkSync(fs.realpathSync('node_modules'),path.join(dir,'node_modules'));
const inputs=[];
for(const [name,ref] of [['master','3dfc49cf3422c0262d86810df47459f53f3a4a67'],['c1','4f229ab94a7ef6f821334b0be25998cd405fb5d6']]){
 const tar=path.join(dir,'source.tar');fs.writeFileSync(tar,execFileSync('git',['archive',ref,'src','locales','stories','docs/gm/book-world-player-agency/contracts/CONTRACTS.json','docs/gm/feature-wave/ink/voice-cues/VOICE_CUES.json','docs/gm/feature-wave/ink/content'],{maxBuffer:100*1024*1024}));execFileSync('tar',['-xf',tar,'-C',dir]);
 const outfile=path.join(dir,name+'.js');await esbuild.build({entryPoints:[path.join(dir,'src/main.js')],bundle:true,minify:true,outfile,platform:'browser',target:'es2022',format:'esm'});
 inputs.push({name,ref,bundle:outfile,sha256:crypto.createHash('sha256').update(fs.readFileSync(outfile)).digest('hex')});
}
fs.writeFileSync(root+'/docs/gm/dispatch/lotm-q6-2026-10-25/evidence/baseline-inputs.json',JSON.stringify(inputs,null,2)+'\n');console.log(JSON.stringify(inputs));
