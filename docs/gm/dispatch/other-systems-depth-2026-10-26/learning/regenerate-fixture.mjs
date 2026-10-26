// Reuse R15 G4's real importer/model/serializer adapter with current location API.
// No private save. Writes solely this lane's supplied-stock QA export/evidence.
import {readFile,writeFile,unlink} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const lane=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(lane,'../../../../..');
const historic=path.join(root,'docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r15/g4/fixture');
const temp=path.join(root,`.learning-fixture-${process.pid}.mjs`);
let text=await readFile(path.join(historic,'generate.mjs'),'utf8');
text=text.replace('const owner = dirname(fileURLToPath(import.meta.url));',`const owner = ${JSON.stringify(path.join(lane,'evidence'))};`).replace("const root = resolve(owner, '../../../../../../../..');",`const root = ${JSON.stringify(root)};`).replace('current_location=locations.Village;',"change_current_location('Village');");
try{await writeFile(temp,text);execFileSync(process.execPath,[temp,path.join(historic,'TEST-FIXTURE-R15-G4-control-pending.txt'),'learning-house',path.join(lane,'generate-steps.js')],{cwd:root,stdio:'inherit'});}finally{await unlink(temp).catch(()=>{});}
