import {relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {PLAYABLE,PARTIAL,READING,routeEvidence,sourceMapPlaceStatus,
    mechanicPlayStatus,mechanicReadinessRows,WORLD_CONSUMERS} from '../prototypes/world-atlas/play-status.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const nonempty=value=>typeof value==='string'&&value.trim().length>0;

export function checkPlayLabels(rows) {
    const counts={}, mismatches=[], keys=new Set();
    for(const {surface,id,record,expected,receipt} of rows){
        const key=surface+'/'+id;
        const totals=counts[surface]??={checked:0,playable:0,partial:0,readingOnly:0,mismatched:0};
        totals.checked++;
        const status=record.playStatus;
        const field={[PLAYABLE]:'playable',[PARTIAL]:'partial',[READING]:'readingOnly'}[status];
        if(field)totals[field]++;
        const reason=keys.has(key)?'Duplicate status record':
            !field?'Unknown play status':
            status!==expected?'Expected '+expected+', found '+status:
            status===PLAYABLE&&(!receipt||![receipt.id,receipt.life,receipt.action].every(nonempty)||
                !/^[a-f0-9]{64}$/.test(receipt.build||''))?'Playable needs an exercised receipt naming the life, action and build':
            status===PARTIAL&&!nonempty(record.playGap)?'Partial needs a named gap':
            status===READING&&receipt?'Reading-only contradicts an exercised receipt':null;
        if(reason){totals.mismatched++;mismatches.push({surface,id,reason});}
        keys.add(key);
    }
    return {counts,mismatches,checked:rows.length};
}

function collectReadiness(reading){
    const worlds=new Map();
    for(const key of reading.keys){
        const world=worlds.get(key.world)??{id:key.world,consumer:WORLD_CONSUMERS[key.world],aspects:{}};
        for(const [aspect,total] of Object.entries(key.aspects))world.aspects[aspect]=(world.aspects[aspect]||0)+total;
        worlds.set(key.world,world);
    }
    return reading.aspects.flatMap(aspect=>mechanicReadinessRows([...worlds.values()],aspect).map(world=>({
        id:world.id+'/'+aspect,...mechanicPlayStatus(world.id,aspect,world.consumer),
    })));
}

export async function auditAtlas() {
    // Resolve the same snapshot as the normal server. Fail before loading it
    // if the adopted archive has not been installed.
    const {readSnapshot,SNAPSHOT,READERS}=await import('../prototypes/world-atlas/build.mjs');
    const adopted=readSnapshot();
    if(!adopted||!adopted.commit||!adopted.builtAt||process.env.ATLAS_REBUILD)throw Error('Use the existing adopted Atlas snapshot, with ATLAS_REBUILD unset.');
    const [{atlasData,findIndex,findIdeaRows,qualifyCheatRows},{VISION_THEMES},{worldRoster,worldEntryStatus},
        {loadCheatCatalogue},{readCheats},{loadNativePlayEvidence,loadPaidInnEvidence,loadBreakfastEvidence},
        {CAMPAIGN_TRACKS},{campaignSequencing},{loadPlaceActivityEvidence},{upkeepReceiptSpec},
        {readPinnedPlayReceipt},{watchcraftReceiptSpec}]=await Promise.all([
        import('../prototypes/world-atlas/serve.mjs'),import('../prototypes/world-atlas/vision-coverage.mjs'),
        import('../prototypes/world-atlas/world-entry-inventory.mjs'),import('../prototypes/world-atlas/cheat-catalogue.mjs'),
        import('../prototypes/world-atlas/cheats.mjs'),import('../prototypes/world-atlas/atlas-native-evidence.mjs'),
        import('../prototypes/world-atlas/campaign-sequencing-tracks.mjs'),import('../prototypes/world-atlas/campaign-sequencing.mjs'),
        import('../prototypes/world-atlas/place-activity-evidence.mjs'),import('../prototypes/world-atlas/game-making.mjs'),
        import('../prototypes/world-atlas/pinned-play-receipt.mjs'),
        import('../prototypes/world-atlas/implementation.mjs'),
    ]);
    const [data,native,index,paidInn,breakfast]=await Promise.all([atlasData(),loadNativePlayEvidence(root),findIndex(),
        loadPaidInnEvidence(root),loadBreakfastEvidence(root)]);
    if(data.snapshot.commit!==adopted.commit||data.snapshot.builtAt!==adopted.builtAt)throw Error('Atlas switched snapshots during the audit.');
    const rows=[];
    const add=(surface,id,record,{receipt=record.playReceipt,expected=receipt?PLAYABLE:record.playGap?PARTIAL:READING}={})=>{
        rows.push({surface,id,record,receipt,expected});
    };
    const byFindRoute=new Map();
    const remember=(href,record,receipt)=>byFindRoute.set(href,{expected:record.playStatus,receipt});
    for(const entry of native.entries){
        const proof=entry.playReceipt;
        const matched=proof&&(entry.receipts.some(r=>r.id===proof.id&&r.status==='verified'&&r.testedBundleSha256===proof.build)||
            entry.references?.some(r=>r.id===proof.id&&r.status==='verified'));
        add('Native evidence',entry.id,entry,{receipt:matched?proof:null});
        remember('#workbench/play-evidence/'+entry.id,entry,matched?proof:null);
    }
    for(const [id,entry] of [['paid-inn',paidInn],['breakfast',breakfast]])add('Native evidence',id,entry);
    const watchcraft=readPinnedPlayReceipt(root,watchcraftReceiptSpec);
    for(const entry of data.implementation)add('Earned replays',entry.id,entry,{receipt:watchcraft});
    for(const theme of VISION_THEMES){
        const record={...theme,playStatus:theme.status};
        const receipt=theme.status===PLAYABLE?routeEvidence(native,theme.evidenceHref):undefined;
        add('Vision coverage',theme.id,record,{receipt});
        remember('#progress/vision/'+theme.id,record,receipt);
    }
    for(const world of worldRoster(data))add('World entries',world.id,worldEntryStatus(world,native));
    for(const [kind, places] of [['frontier',data.frontier],['registered',data.others]]){
        for(const place of places)add('Native places',kind+'/'+place.id,place,{expected:PARTIAL});
    }
    for(const [world, places] of Object.entries(data.books)){
        const byId=new Map(places.places.map(place=>[place.id,place]));
        for(const place of byId.values())add('Native places','cast/'+world+'/'+place.id,place,{expected:PARTIAL});
    }
    for(const [world,source] of Object.entries(data.sources||{})){
        if(!source)continue;
        const places=[...(source.places||[]),...(source.added||[]).map(place=>({...place,state:'added'}))];
        const byId=new Map(places.map(place=>[place.id,place]));
        for(const place of byId.values()) if(place.state!=='region')add('Source maps',world+'/'+place.id,sourceMapPlaceStatus(place.state));
    }
    for(const [world,actions] of Object.entries(data.placeActivities)){
        const receipt=loadPlaceActivityEvidence(root,world);
        for(const action of actions)add('Native place actions',action.id,action,{receipt});
    }
    for(const [world,places] of Object.entries(data.placeActions)){
        const exercised=new Set((data.placeActivities[world]||[]).map(row=>row.id));
        for(const [id,actions] of Object.entries(places)){
            for(const action of new Map(actions.map(row=>[row.id,row])).values()){
                if(!exercised.has(action.id))add('Native place actions',world+'/'+id+'/'+action.id,action,{expected:PARTIAL});
            }
        }
    }
    for(const track of CAMPAIGN_TRACKS){
        const campaign=campaignSequencing(track,{root,readers:READERS,snapshot:adopted});
        add('Campaigns',track.world+'/indexed',campaign.indexed,{expected:READING});
        for(const claim of [...campaign.connected,...campaign.mechanics])add('Campaigns',track.world+'/'+claim.label,claim);
    }
    for(const row of collectReadiness(data.reading))add('Mechanic readiness',row.id,row);
    const upkeep=readPinnedPlayReceipt(root,upkeepReceiptSpec);
    for(const row of data.gameMaking.rows)add('Making',row.id,row,{receipt:row.id==='lotm.craft.slumber-charm-upkeep'?upkeep:null});
    const sections=await loadCheatCatalogue(root,native);
    for(const section of sections)for(const cheat of section.cheats){
        const receipt=routeEvidence(native,cheat.evidenceHref);
        add('Cheat catalogue',cheat.id,cheat,{receipt});
        remember('#library/cheats/'+cheat.id,cheat,receipt);
    }
    const cheats=readCheats();
    for(const row of qualifyCheatRows([...cheats.rows,...cheats.candidates],native)){
        add('Cheat runtime and candidates',row.id,row,byFindRoute.get('#library/cheats/'+row.id)||{expected:READING});
    }
    for(const article of adopted.systems?.articles??[]){
        add('Systems',article.id,article);
        remember('#systems/'+article.id,article,article.playReceipt);
    }
    for(const row of [...index.rows,...findIdeaRows()]){
        add('Find '+row.type,row.world+'/'+row.id,row,byFindRoute.get(row.href)||{expected:READING});
    }
    return {archive:{commit:adopted.commit,builtAt:adopted.builtAt,file:relative(root,SNAPSHOT).replaceAll('\\','/')},...checkPlayLabels(rows)};
}

if(import.meta.main){
    try{
        const result=await auditAtlas();
        process.stdout.write(JSON.stringify(result,null,2)+'\n');
        if(result.mismatches.length)process.exitCode=1;
    }catch(error){
        console.error('Atlas play label check:',error.message);
        process.exitCode=1;
    }
}
