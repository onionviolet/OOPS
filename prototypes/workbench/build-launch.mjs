import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
const here=new URL('./',import.meta.url), root=new URL('../../',here), output=new URL('built/launch/',here);
mkdirSync(output,{recursive:true});
const files={
    'beginning.js':new URL('adapters/launch-archived-beginning.js',here),
    'ui_tokens.css':new URL('styles/ui_tokens.css',root),
    'legacy.css':new URL('style.css',root),
    'launch_screen.css':new URL('adapters/launch-archived.css',here),
    'study.css':new URL('adapters/launch.css',here),
    'study.js':new URL('adapters/launch.js',here),
    'index.html':new URL('adapters/launch.html',here),
};
const hashes={};
for(const [name,path] of Object.entries(files)) {
    const data=readFileSync(path);writeFileSync(new URL(name,output),data);
    hashes[name]=createHash('sha256').update(data).digest('hex');
}
writeFileSync(new URL('INPUTS.json',output),JSON.stringify({description:'Real launch choice renderer and current tokens/CSS, fixture-only background choices and review actions. No game startup or save access.',hashes},null,2)+'\n');
console.log('Launch layout study built; no production bundle touched.');
