import {readFileSync,writeFileSync,mkdirSync,copyFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {relative} from 'node:path';
const output=new URL('built/character/',import.meta.url),root=new URL('../../',import.meta.url),source=new URL('adapters/character/',import.meta.url);mkdirSync(output,{recursive:true});
writeFileSync(new URL('.gitignore',output),'gothic-*.woff2\n');
const sourceHashes={},outputHashes={};
const hashes={};for(const [name,url]of Object.entries({'index.html':new URL('index.html',source),'study.css':new URL('study.css',source),'ui_tokens.css':new URL('styles/ui_tokens.css',root),'crafting_detail.css':new URL('styles/crafting_detail.css',root),'gothic-14.woff2':new URL('resources/fonts/private/gothic-bitmap-14.woff2',root),'gothic-21.woff2':new URL('resources/fonts/private/gothic-bitmap-21.woff2',root)})){const bytes=readFileSync(url);hashes[name]=createHash('sha256').update(bytes).digest('hex');sourceHashes[relative(root.pathname,url.pathname)]=hashes[name];outputHashes[name]=hashes[name];copyFileSync(url,new URL(name,output));}
await build({entryPoints:[new URL('study.js',source).pathname],bundle:true,format:'esm',platform:'browser',target:'es2022',outfile:new URL('study.js',output).pathname,metafile:true}).then(r=>{for(const name of Object.keys(r.metafile.inputs)){hashes[name]=createHash('sha256').update(readFileSync(name)).digest('hex');sourceHashes[name]=hashes[name];}});
// Track surrounding native owners too: a reduced fixture must flag shell drift.
for(const file of ['src/proto23_shell.js','src/main.js','src/display.js','styles/shell_layout.css','styles/shell_chrome.css'])sourceHashes[file]=createHash('sha256').update(readFileSync(new URL(file,root))).digest('hex');
outputHashes['study.js']=createHash('sha256').update(readFileSync(new URL('study.js',output))).digest('hex');
writeFileSync(new URL('INPUTS.json',output),JSON.stringify({schema:2,builtAt:new Date().toISOString(),fidelity:'sketch',sourceHashes,outputHashes,description:'Current native craft/household/atmosphere/effects renderers; original reduced five-region fixture. Scripted commands; no game startup, storage or personal saves. Local font stays local.',hashes},null,2)+'\n');
console.log('Character study built in shared workbench.');
