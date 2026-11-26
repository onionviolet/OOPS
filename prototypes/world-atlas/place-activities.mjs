// Exact native locations and cited source IDs. A binding is not a save-access check.
export function handoffsForActivityReceipt(entries,receipt) {
    return entries.flatMap(entry=>{
        const reports=(entry.implementationReports||[]).filter(report=>report.receipt?.path===receipt);
        if(!reports.length)return [];
        return [{id:entry.id,origin:entry.schema==='atlas-idea-handoff/1'?'Backlog':'Reading',
            label:entry.record.label,consumers:[...new Set(reports.map(report=>report.consumer.name))]}];
    });
}

const reasons=rule=>!rule?[]:[...(typeof rule.reason==='string'?[rule.reason]:[]),...(rule.all||rule.any||[]).flatMap(reasons),...reasons(rule.not)];
export function projectNativeActivities(commands,{worldId,describe}) {
    return commands.flatMap(command=>{
        if(command.worldId!==worldId||typeof command.location!=='string')return [];
        const detail=describe(command);if(!detail)return [];
        return [{id:command.id,label:command.label,location:command.location,worldId,description:command.description,
            minutes:command.duration,conditions:[...new Set([...reasons(command.visibleWhen),...reasons(command.requires)])],
            sources:[],locators:[],...detail}];
    });
}

export function projectOfficeMaterialActivities(commands,rows,{worldId}) {
    const byId=new Map(rows.map(row=>[row.id,row]));
    return projectNativeActivities(commands,{worldId,describe:command=>{
        const row=byId.get(command.lotmAct?.rowId);
        if(!row)return null;
        return {
            locationLabel:'Blackthorn reception · native fixture',
            locationNote:'Native fixture location, not a sourced map placement. Its membership in Blackthorn’s source geography remains unverified.',
            costText:command.lotmAct.costText,
            sources:row.sourceIds||[],locators:row.locators||[],
            boundary:'This extra local requisition and its approval, capacity, contents and timing are authored. It does not reset the monthly allocation.',
            verificationText:'Office materials were agent-verified on a named eligible-maker native fixture. The earned Klein route remains unverified. Your character’s workshop history, available local credit and signed order decide access.',
            related:[{href:'#world/lotm/making/lotm.item.slumber-charm',label:'Open Slumber making and use'}],
            geographyNote:'The material route ends at this reception. Its inscription workshop has a separate native place ID; this map has no verified placement for it.',
            verification:{state:'agent-verified, not human-reviewed',scope:'named eligible-maker native fixture; earned Klein route unverified',
                handoffId:'221e0889c81cd9655cfd425fb1688bd1d853032c8d1e1e4e2ea5a5ba6af05715',
                handoffLabel:'Open office-materials handoff and reports',receiptLabel:'Read the office-materials gameplay receipt',
                receiptHref:'/activity-evidence/lotm-materials',
                receipt:'docs/gm/dispatch/procedural-crafting-2026-11-11/LOTM_CHARM_MATERIAL_HANDOFF_2026-11-25.md',
                proof:'docs/representations/evidence/lotm-charm-materials-2026-11-25/proof.json'}};
    }});
}

export function projectHpLibraryActivities(commands,{worldId}) {
    return projectNativeActivities(commands,{worldId,describe:command=>({
        locationLabel:'Hogwarts, the Great Hall',
        locationNote:'Registered native Hogwarts location. Library work currently uses the school-hall location; no separate library node or source geography is asserted.',
        costText:command.costs?.some(cost=>cost.type==='vital')?'1 stamina per try, including a fizzle.'
            :command.costs?.some(cost=>cost.type==='item')?'One waiting Astronomy assignment; your reference notes are required and retained.'
            :'No item or stamina debit in this command.',
        boundary:'The high shelf, ladder, chart-book, notes and timings are authored working defaults. This is not a newly read novel event.',
        verificationText:'Agent-verified on a prepared school-day fixture after real Charms and wand actions, with the real Astronomy assignment, both retrieval methods, paid fizzle and successful cast, Save/reload/Export/Import. A fully earned opening-to-library journey is not established by that receipt.',
        geographyNote:'Native command location: book.hp.lead.school_hall. Hogwarts admission, Sorting, term access, learned Levitation, a wand and the required work items decide which action is available; this view does not read your save.',
        verification:{state:'agent-verified, not human-reviewed',scope:'prepared school-day fixture; opening-to-library journey unverified',
            receiptLabel:'Read Harry’s chart-book and Levitation gameplay receipt',
            receiptHref:'/activity-evidence/hp-library',receipt:'docs/gm/dispatch/play-surface-2026-11-14/HARRY_LIBRARY_WORK_2026-11-25.md',
            proof:'docs/representations/evidence/harry-library-2026-11-25/result.json'}
    })});
}

export function nativeActivityPlaces(worldId,data,sourcePlaces) {
    const known=new Set(sourcePlaces.map(place=>place.id));
    return [...new Map((data.placeActivities?.[worldId]||[]).filter(action=>!known.has(action.location)).map(action=>[action.location,
        {id:action.location,label:data.others?.find(place=>place.id===action.location)?.label||action.locationLabel,
            col:'places',kind:'native activity location',nativeBindingOnly:true,locationNote:action.locationNote}])).values()];
}

export function nativePlaceDigest(digest,worldId,data) {
    if(digest&&(digest.entities?.length||digest.rules?.length||digest.shards))return digest;
    if(!(data.placeActivities?.[worldId]||[]).length)return digest;
    return {entities:[],rules:[],scenes:[],life:[],notes:[],fills:[],counts:{},shards:0,...digest,nativeOnly:true};
}

export function activitiesForPlace(placeIds,worldId,data) {
    const ids=new Set(placeIds);
    return (data.placeActivities?.[worldId]||[]).filter(action=>ids.has(action.location));
}

export function placeSearchText(place,worldId,data) {
    const ids=[place.id,place.indexId].filter(Boolean),actions=data.placeActions?.[worldId]||{};
    return [place.label,place.id,...ids.flatMap(id=>(actions[id]||[]).map(action=>action.label)),
        ...activitiesForPlace(ids,worldId,data).map(action=>action.label),
        ...(place.affordances||[]).map(action=>action.what)].join(' ').toLocaleLowerCase();
}
