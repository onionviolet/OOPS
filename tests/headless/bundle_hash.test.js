import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readdir,stat,utimes,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {hashTree} from '../../scripts/headless/runner.mjs';

test('native bundle metadata hash preserves serial depth-first identity and invalidation',async t=>{
 const root=await mkdtemp(join(tmpdir(),'yairpg-hash-'));
 t.after(()=>rm(root,{recursive:true,force:true}));
 await mkdir(join(root,'a'));
 await Promise.all(Array.from({length:35},(_,i)=>writeFile(join(root,i%2?'a':'',`f${i}.js`),'sample')));
 await writeFile(join(root,'ignore.txt'),'ignored');
 const filter=p=>p.endsWith('.js');
 async function serial(dir,h){for(const e of (await readdir(dir,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))){const p=join(dir,e.name);if(e.isDirectory())await serial(p,h);else if(filter(p)){const s=await stat(p);h.update(`${p}:${s.size}:${s.mtimeMs}\n`);}}}
 const digest=async fn=>{const h=createHash('sha256');await fn(root,h,filter);return h.digest('hex');};
 const before=await digest(hashTree);
 assert.equal(before,await digest(serial));
 await writeFile(join(root,'ignore.txt'),'different ignored size');
 assert.equal(await digest(hashTree),before);
 await writeFile(join(root,'a','f1.js'),'changed source size');
 const after=await digest(hashTree);
 assert.notEqual(after,before);assert.equal(after,await digest(serial));
 const included=join(root,'a','f1.js'),metadata=await stat(included);
 await utimes(included,metadata.atime,new Date(metadata.mtimeMs+2000));
 assert.notEqual(await digest(hashTree),after,'mtime remains an invalidation input even at the same size');
 assert.equal(await digest(hashTree),await digest(serial));
 await assert.rejects(hashTree(join(root,'missing'),createHash('sha256'),filter),{code:'ENOENT'});
});
