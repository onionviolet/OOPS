import {readFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join,relative} from 'node:path';
const color= /#[\da-f]{3,8}\b|rgba?\([^)]*\)/gi;
export function scanUiText(text) {
    const hits=[];
    const add=(rule,snippet)=>hits.push({rule,snippet:snippet.trim()});
    // Exact declarations, including token consumers, stay reviewable in the ledger.
    for(const m of text.matchAll(/(?:border-radius|font-family)\s*:[^;\n}]+/g))add('declaration',m[0]);
    for(const m of text.matchAll(color))add('color',m[0]);
    for(const line of text.split('\n'))if(/\.style\.cssText\s*=/.test(line))add('cssText',line);
    // Detect both direct foreign-host writes and aliases obtained by DOM lookup.
    const hosts=new Set([...text.matchAll(/(?:const|let|var)\s+(\w+)\s*=\s*(?:document|root)\.getElementById\(/g)].map(m=>m[1]));
    for(const line of text.split('\n'))if(/(?:getElementById\([^;]+|(?:document|root)\.querySelector\([^;]+)\??\.(?:prepend|append|appendChild)\(/.test(line)||[...hosts].filter(host=>!new RegExp(`(?:const|let)\\s+${host}\\s*=\\s*projectsHome\\(`).test(line)).some(host=>new RegExp(`\\b${host}\\??\\.(?:prepend|append|appendChild)\\(`).test(line)))add('foreign-host',line);
    return hits;
}
export function uiViolations(root) {
    const walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):[join(dir,e.name)]);
    const files=[join(root,'style.css'),join(root,'index.html'),...walk(join(root,'styles')),...walk(join(root,'src'))].filter(p=>/\.(?:css|js|html)$/.test(p)&&!p.endsWith('/styles/ui_tokens.css'));
    const counts=new Map();
    for(const file of files)for(const hit of scanUiText(readFileSync(file,'utf8'))){
        const path=relative(root,file),key=path+'|'+hit.rule+'|'+createHash('sha256').update(hit.snippet).digest('hex').slice(0,16);
        const old=counts.get(key);if(old)old.count++;else counts.set(key,{key,path,...hit,count:1});
    }
    return [...counts.values()].sort((a,b)=>a.key.localeCompare(b.key));
}
