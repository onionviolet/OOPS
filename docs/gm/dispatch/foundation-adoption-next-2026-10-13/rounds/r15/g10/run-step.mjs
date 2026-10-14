import fs from 'node:fs';import path from 'node:path';
const here=path.dirname(new URL(import.meta.url).pathname);
for(const name of process.argv.slice(2)){
const file=name.startsWith('/')?name:path.join(here,'steps',name+'.js');
const r=await(await fetch('http://127.0.0.1:19201/',{method:'POST',body:fs.readFileSync(file,'utf8')})).json();
fs.writeFileSync(path.join(here,'evidence','run-'+path.basename(name)+'.json'),JSON.stringify(r,null,1));
console.log(JSON.stringify({ok:r.ok,error:r.error,cases:r.value?.cases?.map(c=>c.id)||r.value?.length}));if(!r.ok){process.exitCode=1;break;}
}
