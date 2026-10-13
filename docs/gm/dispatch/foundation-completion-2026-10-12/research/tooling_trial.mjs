// Disposable in-memory compiler audition. Writes temporary inputs only in this lane.
import {readFile,writeFile,unlink} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {compileFeatureInk} from '../../../../../scripts/compile_feature_ink.mjs';
const source=await readFile(new URL('../../../../../stories/feature_wave.ink',import.meta.url),'utf8');
const original=await readFile(new URL('../../../../../stories/feature_wave.json',import.meta.url),'utf8');
const baseline=await compileFeatureInk();
const temporary=fileURLToPath(new URL('tooling_trial_input.ink',import.meta.url));
const results={node:process.version,baseline:{...baseline.metadata,outputSha256:baseline.outputSha256,bytes:baseline.bytes.length,diagnostics:baseline.diagnostics,exactCurrentArtifact:baseline.bytes===original},trials:[]};
for(const [name,modified] of [
 ['unknown-response',source.replace('response:ask_terms','response:research_unknown')],
 ['include-boundary',`INCLUDE research_trial.ink\n${source}`],
 ['source-line-error',`${source}\n-> research_missing_knot\n`],
]){
 await writeFile(temporary,modified);
 try{const result=await compileFeatureInk({sourcePath:temporary});results.trials.push({name,unexpectedSuccess:true,hash:result.outputSha256});}
 catch(error){results.trials.push({name,rejected:true,message:error.message});}
 finally{await unlink(temporary);}
}
results.inputSha256=createHash('sha256').update(source).digest('hex');
console.log(JSON.stringify(results,null,2));
