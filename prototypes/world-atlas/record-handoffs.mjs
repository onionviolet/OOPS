// Public Workbench statements matched by canonical record route and record family.
import {publicLifeRow} from './texture-life.mjs';
const fingerprint=value=>({path:value.path,resolvedPath:value.resolvedPath,sha256:value.sha256});
const state=value=>({status:value?.status||'unchecked'});
const playtest=proof=>({id:proof.id,proposalId:proof.proposalId,reportId:proof.reportId,testedBundleSha256:proof.testedBundleSha256,
    proof:fingerprint(proof.proof),files:{proof:state(proof.files?.proof)},entry:{route:proof.entry.route,viewport:proof.entry.viewport,
        ...(proof.entry.setup?{setup:proof.entry.setup}:{}),...(proof.entry.fixture?{fixture:proof.entry.fixture}:{})}});
export function recordHandoffQuery({world,view='things',focus,type}) {
    if(typeof world!=='string'||!/^[a-z0-9_-]{1,60}$/.test(world)||!['things','making'].includes(view)||
        !['entity','rule'].includes(type)||typeof focus!=='string'||!focus.trim()||focus.length>300||/[\u0000-\u001f\u007f/#?]/.test(focus))
        throw Error('Choose an exact public Atlas record.');
    return {world,view,focus,type,route:'#world/'+encodeURIComponent(world)+'/'+view+'/'+encodeURIComponent(focus)};
}
export function handoffsForRecord(entries,query) {
    const target=recordHandoffQuery(query);
    return entries.filter(entry=>publicLifeRow(entry)&&publicLifeRow(entry.record)&&publicLifeRow(entry.source)&&
        entry?.source?.world===target.world&&entry?.record?.type===target.type&&entry.record.route===target.route)
        .map(entry=>({id:entry.id,record:{label:entry.record.label,type:entry.record.type,route:entry.record.route},
            source:{book:entry.source.book,prefix:entry.source.prefix,pass:entry.source.pass,kind:entry.source.kind},
            implementationReports:(entry.implementationReports||[]).filter(publicLifeRow).map(report=>({id:report.id,proposalId:report.proposalId,
                consumer:{name:report.consumer.name,path:report.consumer.path},playerRoute:report.playerRoute,receipt:{path:report.receipt.path},
                files:{consumer:state(report.files?.consumer),receipt:state(report.files?.receipt)},playtests:(report.playtests||[]).filter(publicLifeRow).map(playtest)}))}));
}
