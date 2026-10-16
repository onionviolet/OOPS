// node workshop.mjs <builtDir> <proofDir>: serve the build on a free port and run the systems workshop check against it.
import {spawn} from 'node:child_process';
const W=new URL('../../../../../',import.meta.url).pathname.replace(/\/$/,''); // repo root
const L=await import(W+'/scripts/perf/lib.mjs');
const [DIR,OUT]=process.argv.slice(2); const srv=await L.serve(DIR); const t0=Date.now();
const code=await new Promise(r=>{const c=spawn(process.execPath,[W+'/scripts/systems_workshop_browser.cjs'],{cwd:DIR,stdio:'inherit',env:{...process.env,YAIRPG_PROOF_URL:srv.url+'?test_hooks=1',YAIRPG_PROOF_DIR:OUT}});c.on('exit',r);});
await srv.close(); console.log(JSON.stringify({exit:code,wallS:((Date.now()-t0)/1000).toFixed(0)})); process.exit(code);
