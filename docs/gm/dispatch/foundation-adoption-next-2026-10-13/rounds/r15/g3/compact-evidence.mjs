// Losslessly compress test exports; move redundant pre-merge screenshots to a local archive.
import {readdir,readFile,writeFile,mkdir,copyFile,unlink} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const dir=join(dirname(fileURLToPath(import.meta.url)),'evidence');
const archive='/private/tmp/r15-g3-unabridged-evidence';
await mkdir(archive,{recursive:true});
let rows=[];
try{rows=JSON.parse(await readFile(join(dir,'COMPACTION.json'),'utf8'));}catch{}
for(const name of await readdir(dir)){
  if(!name.endsWith('-export.txt') && !name.endsWith('.png'))continue;
  const file=join(dir,name),bytes=await readFile(file);
  await copyFile(file,join(archive,name));
  const row={name,sha256:createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length};
  if(name.endsWith('.txt')){
    await writeFile(file+'.gz',gzipSync(bytes,{level:9}));
    row.retainedAs=name+'.gz';
  }else row.disposition='redundant pre-merge screenshot; current merged-build JPEGs retained';
  rows=rows.filter(r=>r.name!==name);rows.push(row);await unlink(file);
}
// Current checkpoints supersede the many partial manual exports. Keep the earlier
// fatigue checkpoint and original fieldcraft final; retain all other originals locally.
for(const name of await readdir(dir))if(/^fa10.*-export\.txt\.gz$/.test(name) && name!=='fa10b-fatigued-export.txt.gz'){
  await copyFile(join(dir,name),join(archive,name));await unlink(join(dir,name));
  const row=rows.find(r=>r.retainedAs===name);if(row){delete row.retainedAs;row.disposition='superseded by current merged-build checkpoint; original retained in local archive';}
}
const fixtures=join(dir,'../fixture');
for(const name of await readdir(fixtures))if(name.endsWith('.txt')){
  const bytes=await readFile(join(fixtures,name));
  await copyFile(join(fixtures,name),join(archive,name));
  await writeFile(join(fixtures,name+'.gz'),gzipSync(bytes,{level:9}));
  await unlink(join(fixtures,name));
  const id='fixture/'+name;
  rows=rows.filter(r=>r.name!==id);
  rows.push({name:id,sha256:createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length,retainedAs:id+'.gz'});
}
await writeFile(join(dir,'COMPACTION.json'),JSON.stringify(rows,null,1)+'\n');
console.log({exportsOrScreenshots:rows.length,localArchive:archive});
