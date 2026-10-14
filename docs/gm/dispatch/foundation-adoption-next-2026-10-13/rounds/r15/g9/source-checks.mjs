// Reuse the retained private route contracts against this checkout's source.
// Raw pack/prose and generated envelopes are never written to public evidence.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath,pathToFileURL} from 'node:url';
const out=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(out,'../../../../../../..');
const input='/Users/weiwei/code/yet-another-idle-rpg/docs/research/novels/world1-full-completion-2026-10-11/route/behavior.mjs';
let source=fs.readFileSync(input,'utf8');
source=source.replace(/let root=[^\n]+;/,'const root='+JSON.stringify(root)+';');
const marker="fs.writeFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)),'ENGINE_PROOF.json')";
if(!source.includes(marker))throw Error('Retained proof writer boundary changed');
source=source.slice(0,source.indexOf(marker))+`fs.writeFileSync(${JSON.stringify(path.join(out,'SOURCE.json'))},JSON.stringify({label:'source',status:'PASS',groups:results},null,2)+'\\n');console.log('Source groups passed: '+results.length);`;
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'r15-g9-source-'));
try{const module=path.join(temp,'check.mjs');fs.writeFileSync(module,source);await import(pathToFileURL(module));}finally{fs.rmSync(temp,{recursive:true,force:true});}
