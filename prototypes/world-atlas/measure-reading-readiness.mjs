// One isolated process per world. No startup/background aggregate and no paid work.
import {readFileSync,mkdirSync,writeFileSync,renameSync,existsSync} from 'node:fs';
import {resolve,join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {registeredBooks} from './library-reading.mjs';
import {measureReadingReadiness,readinessPath} from './reading-readiness.mjs';
function main(){
const args=process.argv.slice(2),options={};
for(let i=0;i<args.length;i++){if(!['--world','--snapshot','--out','--keys','--prefixes'].includes(args[i])||!args[i+1])throw Error('Expected --world, --snapshot, --out, --keys or --prefixes with a value.');options[args[i].slice(2)]=args[++i];}
const registry=registeredBooks(),world=options.world;
if(!registry.some(b=>b.world===world)||!/^[a-z0-9_-]+$/.test(world))throw Error('Choose a registered world.');
const snapshot=resolve(options.snapshot||process.env.ATLAS_SNAPSHOT||fileURLToPath(new URL('../../work/atlas-snapshot/snapshot.json',import.meta.url)));
const digestFile=join(dirname(snapshot),'readers',world+'.json');
if(!existsSync(snapshot)||!existsSync(digestFile))throw Error('Snapshot and world digest are required. Build the Atlas first.');
const snapshotBytes=readFileSync(snapshot),digestBytes=readFileSync(digestFile);
const report=measureReadingReadiness({world,registry,digest:JSON.parse(digestBytes),snapshotBytes,digestBytes,keys:options.keys?.split(','),prefixes:options.prefixes?.split(',')});
const out=resolve(options.out||readinessPath(snapshot,world));mkdirSync(dirname(out),{recursive:true});
const temp=out+'.'+process.pid+'.tmp';writeFileSync(temp,JSON.stringify(report,null,2)+'\n');renameSync(temp,out);
console.log(JSON.stringify({world,scope:report.scope,seconds:report.seconds,books:report.books.length,outputs:report.outputs}));
}
try{main();}catch{console.error('Readiness measurement failed. Check the world, options, readable snapshot and world digest. No source details disclosed.');process.exitCode=1;}
