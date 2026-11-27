// Refresh this small live-definition leaf without rebuilding the reading snapshot.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {dirname,join,resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {boot} from '../../scripts/headless/runner.mjs';
import {nativeTravelReport} from './registered-travel.mjs';
const snapshot=resolve(process.env.ATLAS_SNAPSHOT||'work/atlas-snapshot/snapshot.json'),bytes=readFileSync(snapshot),data=JSON.parse(bytes);
const measuredAt=new Date().toISOString();let report;
const game=await boot(null,{seed:1});
try{
 const locations=game.internals.locations;
 const places=[...data.frontier.map(p=>({...p,group:'Village'})),...data.others];
 const commands=[...game.internals.expeditionRegistry.simulation.commands.values()];
 report={...nativeTravelReport(places,locations,commands,measuredAt),snapshotSha256:createHash('sha256').update(bytes).digest('hex')};
 const out=join(dirname(snapshot),'registered-travel.json');mkdirSync(dirname(out),{recursive:true});writeFileSync(out,JSON.stringify(report,null,2)+'\n');
}finally{game.close();}
process.stdout.write(JSON.stringify(report)+'\n');
