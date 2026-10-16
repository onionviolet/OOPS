// Rebuild the pinned pre-round source without touching working source or another checkout.
import {build} from 'esbuild';
import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const ref=process.argv[2];if(!ref)throw Error('Provide the pre-round commit.');
await build({entryPoints:['src/main.js'],bundle:true,sourcemap:true,minify:true,outfile:'dist/bundle.js',platform:'browser',target:'es2022',format:'esm',plugins:[{name:'pinned-source',setup(b){b.onLoad({filter:/\/src\/.*\.js$/},args=>({contents:execFileSync('git',['show',`${ref}:${args.path.slice(process.cwd().length+1)}`],{encoding:'utf8'}),loader:'js'}));}}]});
let html=readFileSync('index.html','utf8');html=html.replace(/dist\/bundle\.js\?version=[^&"]+/,`dist/bundle.js?version=baseline-${createHash('sha256').update(readFileSync('dist/bundle.js')).digest('hex').slice(0,12)}`);writeFileSync('index.html',html);
