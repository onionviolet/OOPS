import fs from 'node:fs';import path from 'node:path';import {createRequire} from 'node:module';import {gzipSync} from 'node:zlib';
const lane=path.dirname(new URL(import.meta.url).pathname),data=JSON.parse(fs.readFileSync(path.join(lane,'bundle-data.json'))),scratch=data.scratch;
const esbuild=createRequire(path.join(process.cwd(),'package.json'))('esbuild');
const cases={
'zod-mini-schema':`import * as z from 'zod/mini';const schema=z.strictObject({id:z.string(),amount:z.number()});globalThis.parse=x=>z.safeParse(schema,x);`,
'pure-rand-all':Object.keys(JSON.parse(fs.readFileSync(path.join(scratch,'node_modules/pure-rand/package.json'))).exports).filter(x=>x!=='./package.json').map((x,i)=>`import * as r${i} from 'pure-rand/${x.slice(2)}'; globalThis.r${i}=r${i};`).join('\n'),
'pure-rand-dice':`import {uniformInt} from 'pure-rand/distribution/uniformInt';import {xoroshiro128plus} from 'pure-rand/generator/xoroshiro128plus';globalThis.dice=()=>uniformInt(xoroshiro128plus(42),1,6);`,
'valibot-schema':`import {safeParse,strictObject,string,number} from 'valibot'; const schema=strictObject({id:string(),amount:number()});globalThis.parse=x=>safeParse(schema,x);`,
'zod-schema':`import {z} from 'zod';const schema=z.strictObject({id:z.string(),amount:z.number()});globalThis.parse=x=>schema.safeParse(x);`,
'scoped-typebox-runtime':`import {Type} from '@sinclair/typebox'; import {Value} from '@sinclair/typebox/value';const schema=Type.Object({id:Type.String(),amount:Type.Number()},{additionalProperties:false});globalThis.parse=x=>Value.Check(schema,x);`,
'new-typebox-runtime':`import {Type} from 'typebox'; import {Value} from 'typebox/value';const schema=Type.Object({id:Type.String(),amount:Type.Number()},{additionalProperties:false});globalThis.parse=x=>Value.Check(schema,x);`
};
const results=[];for(const [name,source] of Object.entries(cases)){const entry=path.join(scratch,'selected.js');fs.writeFileSync(entry,source);try{const b=await esbuild.build({entryPoints:[entry],bundle:true,minify:true,platform:'browser',format:'esm',target:'es2022',write:false,logLevel:'silent'});const x=b.outputFiles[0].contents;results.push({name,minified:x.length,gzip:gzipSync(x,{level:9,mtime:0}).length});}catch(e){results.push({name,error:e.message});}}
fs.writeFileSync(path.join(lane,'selected-data.json'),JSON.stringify(results,null,2)+'\n');console.log(results);
fs.copyFileSync(path.join(scratch,'package-lock.json'),path.join(lane,'scratch-package-lock.json'));
