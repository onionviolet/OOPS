/** Candidate capture only. Freezing requires a separate human/agent review. */
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve,relative} from 'node:path';
import {goldenBundle,canonicalJSON,hashFile} from '../tests/helpers/invention_qa.mjs';
const args=process.argv.slice(2),arg=k=>args[args.indexOf(k)+1];
const output=resolve(arg('--output')??'docs/gm/dispatch/research-tech-2026-10-14/t9-build/candidates');
const allowed=resolve('docs/gm/dispatch/research-tech-2026-10-14/t9-build/candidates');
if(relative(allowed,output).startsWith('..'))throw Error('Candidate output must remain in t9-build/candidates');
const path='tests/fixtures/invention_qa/v1/input.json',input=JSON.parse(readFileSync(path,'utf8'));
mkdirSync(output,{recursive:true});writeFileSync(resolve(output,'golden.candidate.json'),canonicalJSON(goldenBundle(input))+'\n');
writeFileSync(resolve(output,'capture.json'),canonicalJSON({status:'candidate-unreviewed',inputDigest:hashFile(path),plannerDigest:hashFile('src/invention_planner.js'),candidateDigest:hashFile(resolve(output,'golden.candidate.json'))})+'\n');
console.log('candidate-unreviewed');
