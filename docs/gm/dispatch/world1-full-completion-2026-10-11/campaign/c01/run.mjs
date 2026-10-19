import fs from 'node:fs';
for(const file of ['helpers.js','controlled-clock.js','native.js','extra.js']) {
    const r=await fetch('http://127.0.0.1:19301',{method:'POST',body:fs.readFileSync(new URL(file,import.meta.url),'utf8')});
    const result=await r.json();if(result?.error)throw Error(file+': '+result.error);
    console.log(file+': PASS');
}
