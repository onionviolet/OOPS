// D8-A / P14 S1's optional typed outcome owner. Feed and biography remain views.
import {natural as nat} from './basics.js';
import {ensureStreams,rollTable,rollInt} from './seeded_streams.js';
export const HISTORY_LIMIT=96;
const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
const ref=v=>typeof v==='string'&&v.length>0&&v.length<=240;
const check=(ok)=>{if(!ok)throw Error('Invalid retained story outcome.');};
export function queryStoryOutcomes(state,filter={}) {
    return (state.loreHistory?.receipts||[]).filter(r=>Object.entries(filter).every(([key,value])=>r[key]===value)).map(r=>structuredClone(r));
}
export function historyPins(state,extra=[]) {
    const pins=new Set([...extra,...Object.values(state.loreHistory?.consumerPins||{}).flat()]);
    for(const r of state.loreHistory?.receipts||[])for(const id of r.historyCauses)pins.add(id);
    for(const e of Object.values(state.simulation?.events||{}))if(e.status==='open'&&e.historyRef)pins.add(e.historyRef);
    // Request settlement evidence is required for future callback predicates.
    const requests=(state.loreHistory?.receipts||[]).filter(r=>r.action.startsWith('request.'));
    if(state.loreHistory?.consumerPins==null)for(const r of requests)pins.add(r.id);
    else {const latest=new Map(requests.map(r=>[r.targetPerson,r.id]));for(const id of latest.values())pins.add(id);}
    return pins;
}
export function validateLoreHistory(state) {
    const h=state?.loreHistory;if(h==null)return;
    check(object(h)&&h.schema===1&&nat(h.nextId)&&h.nextId>0&&nat(h.enrolledAt)&&h.enrolledAt<=state.clock&&Array.isArray(h.receipts)&&h.receipts.length<=HISTORY_LIMIT&&nat(h.evicted));
    const ids=new Set(),ops=new Set();let last=0;
    for(const r of h.receipts) {
        check(object(r)&&ref(r.id)&&nat(r.ordinal)&&r.ordinal>last&&r.ordinal<h.nextId&&!ids.has(r.id)&&ref(r.operation)&&!ops.has(r.operation));
        const origin=r.action==='world.initialize';
        check((origin?r.worldId==='p23.mistglass'&&r.targetPlace==='p23.mistglass.conservatory':r.worldId==='base.frontier'&&r.targetPlace==='Village')&&ref(r.actor)&&ref(r.issuer)&&[r.targetPerson,r.targetObject].every(v=>v===null||ref(v)));
        if(origin)check(r.producer==='mistglass.origin'&&r.operation==='mistglass.origin:mistglass.main'&&['keeper-built','mill-race'].includes(r.result)&&r.audience.length===0);
        check(['storylet.response','storylet.ambient','storylet.expired','request.deliver','request.decline','aftermath.response','world.initialize'].includes(r.action)&&ref(r.result)&&nat(r.at)&&r.at<=state.clock);
        check(ref(r.producer)&&r.revision===1&&Array.isArray(r.causeRefs)&&r.causeRefs.length>0&&r.causeRefs.length<=8&&r.causeRefs.every(ref)&&Array.isArray(r.historyCauses)&&r.historyCauses.length<=8&&r.historyCauses.every(id=>ids.has(id)));
        check(Array.isArray(r.audience)&&r.audience.length<=4&&r.audience.every(ref)&&object(r.known)&&Object.values(r.known).every(v=>typeof v==='string'&&v.length<=240));
        check(Array.isArray(r.applied)&&r.applied.length<=64&&r.applied.every(d=>object(d)&&ref(d.owner)&&ref(d.key)&&['item','coin','skill'].includes(d.kind)&&Number.isFinite(d.delta)&&d.delta!==0));
        ids.add(r.id);ops.add(r.operation);last=r.ordinal;
    }
    if(h.consumerPins!=null){check(object(h.consumerPins)&&Object.keys(h.consumerPins).length<=32);for(const refs of Object.values(h.consumerPins))check(Array.isArray(refs)&&refs.length<=8&&refs.every(id=>ids.has(id)));}
    for(const e of Object.values(state.simulation?.events||{}))if(e.historyRef)check(ids.has(e.historyRef));
    if(h.worldHistories!=null){check(object(h.worldHistories)&&Object.keys(h.worldHistories).length<=16);for(const [id,w] of Object.entries(h.worldHistories)){check(w!=null&&w.worldId===id);validateWorldHistory(w);}}
    return h;
}
export function appendStoryOutcome(state,record) {
    validateLoreHistory(state);
    const h=state.loreHistory ||= {schema:1,enrolledAt:state.clock,nextId:1,evicted:0,receipts:[]};
    const duplicate=h.receipts.find(r=>r.operation===record.operation);if(duplicate)return duplicate;
    if(h.receipts.length>=HISTORY_LIMIT) {
        const pins=historyPins(state,record.historyCauses||[]),index=h.receipts.findIndex(r=>!pins.has(r.id));
        if(index<0)throw Error('Story history is full of referenced outcomes. Finish current stories before admitting another.');
        h.receipts.splice(index,1);h.evicted++;
    }
    const ordinal=h.nextId++,r={...structuredClone(record),id:`story.outcome:${ordinal}`,ordinal,revision:1};h.receipts.push(r);validateLoreHistory(state);return r;
}
// Observe actual resolved native snapshot deltas, never infer them from prose.
export function appliedStoryDeltas(before,after) {
    const rows=[],put=(kind,owner,key,a=0,b=0)=>{if(b!==a)rows.push({kind,owner,key,delta:b-a});};
    put('coin','player','wood',before.external?.money,after.external?.money);
    for(const owner of new Set([...Object.keys(before.gameplay||{}),...Object.keys(after.gameplay||{})])) {
        const a=before.gameplay?.[owner]||{},b=after.gameplay?.[owner]||{};
        for(const key of new Set([...Object.keys(a.inventory||{}),...Object.keys(b.inventory||{})]))put('item',owner,key,a.inventory?.[key],b.inventory?.[key]);
        for(const key of new Set([...Object.keys(a.skills||{}),...Object.keys(b.skills||{})]))put('skill',owner,key,a.skills?.[key]?.xp,b.skills?.[key]?.xp);
    }
    return rows;
}
export function recordStoryletOutcome(out,event,{result,action,cause,before}) {
    if(!event.storylet)return;
    const applied=appliedStoryDeltas(before,out),item=applied.find(d=>d.kind==='item'),parent=event.historyRef?queryStoryOutcomes(out.state,{id:event.historyRef})[0]:null;
    appendStoryOutcome(out.state,{operation:`${event.id}:${action}`,worldId:'base.frontier',actor:event.actorId,issuer:parent?.issuer||event.targetId||event.definitionId,
        targetPerson:parent?.targetPerson||event.targetId,targetObject:parent?.targetObject||item?.key||null,targetPlace:'Village',action: event.historyRef&&action==='storylet.response'?'aftermath.response':action,result,at:out.state.clock,
        producer:'P3',causeRefs:[event.id,cause],historyCauses:event.historyRef?[event.historyRef]:[],audience:[...event.discoveredBy],
        known:{...(parent?{person:parent.known.person,item:parent.known.item}:{}),label:event.label},applied});
}

// IM24 (itch.io wave; the stored-relations-matrix idea from Azgaar's map generator, no code or tables copied).
// A world keeps standing relations between its factions; wars are derived from them by rule, each logged with its cause.
// Draws are pure keyed decisions on the saved stream root, so a reload or re-derivation reproduces the same history.
export const RELATION_KINDS=Object.freeze(['ally','friendly','neutral','suspicion','rival','enemy']);
const RELATION_WEIGHTS=Object.freeze({neighbor:[2,3,3,3,3,2],distant:[1,2,6,2,1,0]});
const pair=(a,b)=>a<b?`${a}|${b}`:`${b}|${a}`;
export function validateWorldHistory(w) {
    if(w==null)return;
    check(object(w)&&w.schema===1&&ref(w.worldId)&&Array.isArray(w.factions)&&w.factions.length>=2&&w.factions.length<=16&&object(w.relations)&&Array.isArray(w.wars)&&w.wars.length<=64);
    const ids=new Set();
    for(const f of w.factions){check(object(f)&&ref(f.id)&&!ids.has(f.id)&&Number.isFinite(f.area)&&f.area>0&&Number.isFinite(f.expansion)&&f.expansion>0);ids.add(f.id);}
    for(const [k,v] of Object.entries(w.relations)){const [a,b]=k.split('|');check(ids.has(a)&&ids.has(b)&&a<b&&RELATION_KINDS.includes(v));}
    for(const war of w.wars)check(object(war)&&ref(war.id)&&ids.has(war.attacker)&&ids.has(war.defender)&&war.attacker!==war.defender&&nat(war.year)&&object(war.cause)&&ref(war.cause.relation)&&RELATION_KINDS.includes(war.cause.relation)&&
        Array.isArray(war.attackerAllies)&&Array.isArray(war.defenderAllies)&&[...war.attackerAllies,...war.defenderAllies].every(id=>ids.has(id)));
    if(w.events!=null)validateWorldEvents(w.events,ids);
}
// G62 (leftover itch.io wave, 2026-10-23): diplomacy, schism and heresy as dated events on a world history. `relations` stays the
// year-0 matrix the wars were derived from; a pact or breach is an event, and current standing is a fold over them (one authority).
// `events` is optional: a history stored before this existed validates unchanged and gains them through upgradeWorldEvents.
export const EVENT_KINDS=Object.freeze(['pact','breach','schism','heresy']);
// Default, dial, reason: doctrines a faction can split over. Illustrative palette entries, not canon for any named world.
export const DOCTRINES=Object.freeze([
    {id:'tithe',text:'whether the harvest tithe belongs to the hall or to the shrine'},
    {id:'succession',text:'who may inherit the seat when the elder dies'},
    {id:'ancestors',text:'whether the dead are asked for counsel or only remembered'},
    {id:'borders',text:'whether the old boundary stones may be moved'},
    {id:'oaths',text:'whether an oath sworn under duress still binds'}]);
function validateWorldEvents(events,ids) {
    check(Array.isArray(events)&&events.length<=64);
    const seen=new Set();
    for(const e of events) {
        check(object(e)&&ref(e.id)&&!seen.has(e.id)&&EVENT_KINDS.includes(e.kind)&&nat(e.year)&&object(e.cause)&&ref(e.cause.kind)&&(e.cause.ref==null||ref(e.cause.ref)));
        if(e.kind==='pact'||e.kind==='breach')check(ids.has(e.a)&&ids.has(e.b)&&e.a<e.b&&RELATION_KINDS.includes(e.from)&&RELATION_KINDS.includes(e.to)&&e.from!==e.to);
        else check(ids.has(e.faction)&&DOCTRINES.some(d=>d.id===e.doctrine)&&(e.child==null||(ref(e.child)&&!ids.has(e.child)))&&(e.kind!=='schism'||(e.child!=null&&nat(e.share)&&e.share>0)));
        seen.add(e.id);
    }
}
// Standing between two factions after the recorded events up to `year` (default: all). Folds, never stored.
export function standingAt(w,a,b,year=Infinity) {
    let now=w.relations[pair(a,b)];
    for(const e of w.events??[])if((e.kind==='pact'||e.kind==='breach')&&e.year<=year&&pair(e.a,e.b)===pair(a,b))now=e.to;
    return now;
}
// Pure derivation from the stored wars and factions plus keyed draws on the saved stream root. New draw keys only, so the war draws
// above reproduce unchanged. Rules: allies who fought a shared war from the same side pact; a pact that ended up on opposite sides
// breaks; the attacker and defender sink to enmity; a large faction may split over a doctrine, and its parent may call that heresy.
function deriveEvents(state,w) {
    const s=ensureStreams(state),stream=`world.events@${w.worldId}`,out=[],push=e=>out.push(e);
    const draw=(key,lo,hi)=>rollInt(s,stream,key,lo,hi,{dist:'uniform'}).value;
    const cur=(a,b,year)=>{let r=w.relations[pair(a,b)];for(const e of out)if((e.kind==='pact'||e.kind==='breach')&&e.year<=year&&pair(e.a,e.b)===pair(a,b))r=e.to;return r;};
    const move=(kind,a,b,to,year,cause)=>{const [x,y]=a<b?[a,b]:[b,a],from=cur(x,y,year);if(from===to)return;push({kind,a:x,b:y,from,to,year,cause});};
    for(const war of w.wars) {
        const sides=[[war.attacker,...war.attackerAllies],[war.defender,...war.defenderAllies]],year=war.year+draw(`pact:${war.id}`,1,3);
        for(const side of sides)side.forEach((a,i)=>side.slice(i+1).forEach(b=>{if(!['ally','friendly'].includes(cur(a,b,year)))move('pact',a,b,'ally',year,{kind:'common-war',ref:war.id});}));
        for(const a of sides[0])for(const b of sides[1])if(cur(a,b,year)==='ally')move('breach',a,b,'suspicion',year,{kind:'opposed-in-war',ref:war.id});
        if(cur(war.attacker,war.defender,year)!=='enemy')move('breach',war.attacker,war.defender,'enemy',year,{kind:'war-grievance',ref:war.id});
    }
    let splits=0;
    for(const f of [...w.factions].sort((x,y)=>y.area*y.expansion-x.area*x.expansion||(x.id<y.id?-1:1))) {
        if(splits>=2)break;
        if(draw(`schism:${f.id}`,0,99)>=35+Math.round(f.area*f.expansion/4))continue;
        const doctrine=DOCTRINES[draw(`schism:${f.id}:doctrine`,0,DOCTRINES.length-1)],year=draw(`schism:${f.id}:year`,1,50),child=`${f.id}.reformed`,share=Math.max(1,Math.floor(f.area*draw(`schism:${f.id}:share`,20,40)/100));
        push({kind:'schism',faction:f.id,child,share,doctrine:doctrine.id,year,cause:{kind:'doctrine',ref:doctrine.id}});
        push({kind:'heresy',faction:f.id,child,doctrine:doctrine.id,year:year+draw(`heresy:${f.id}`,1,5),cause:{kind:'schism',ref:child}});splits++;
    }
    // One unaccompanied denunciation where no split happened: a doctrine condemned but its holders stayed.
    const quiet=w.factions.find(f=>!out.some(e=>e.faction===f.id)&&draw(`heresy:${f.id}:lone`,0,99)<30);
    if(quiet)push({kind:'heresy',faction:quiet.id,child:null,doctrine:DOCTRINES[draw(`heresy:${quiet.id}:doctrine`,0,DOCTRINES.length-1)].id,year:draw(`heresy:${quiet.id}:year`,1,50),cause:{kind:'doctrine',ref:null}});
    return out.sort((x,y)=>x.year-y.year||(x.kind<y.kind?-1:1)).slice(0,64).map((e,i)=>({id:`event:${i+1}`,...e}));
}
// Idempotent back-fill: a stored history without `events` gains them from its own wars and factions; one with events is untouched.
export function upgradeWorldEvents(state,worldId='base.frontier') {
    validateLoreHistory(state);
    const w=state.loreHistory?.worldHistories?.[worldId];
    if(!w||w.events!=null)return w??null;
    const events=deriveEvents(state,w);validateWorldHistory({...w,events});w.events=events;return w;
}
// factions: [{id,area,expansion}] supplied by the world; omitted fields are drawn. Idempotent per world: a stored history is returned unchanged, and each world keeps its own under `worldHistories`.
export function deriveWorldHistory(state,{worldId='base.frontier',factions=['north','east','south','west','coast'],startYear=0}={}) {
    validateLoreHistory(state);
    const h=state.loreHistory ||= {schema:1,enrolledAt:state.clock,nextId:1,evicted:0,receipts:[]};
    if(h.worldHistories?.[worldId])return h.worldHistories[worldId];
    const s=ensureStreams(state),stream=`world.events@${worldId}`;
    const fs=factions.map((f,i)=>{const id=typeof f==='string'?f:f.id;
        return {id,area:f.area??rollInt(s,stream,`area:${id}`,10,100,{dist:'uniform'}).value,expansion:f.expansion??(rollInt(s,stream,`expansion:${id}`,5,20,{dist:'uniform'}).value/10)};});
    const relations={};
    fs.forEach((a,i)=>fs.slice(i+1).forEach((b,j)=>{
        const ring=j===0||(i===0&&i+j+1===fs.length-1);
        relations[pair(a.id,b.id)]=RELATION_KINDS[rollTable(s,stream,`relation:${pair(a.id,b.id)}`,RELATION_WEIGHTS[ring?'neighbor':'distant']).index];}));
    const by=id=>fs.find(f=>f.id===id),rel=(a,b)=>relations[pair(a,b)],atWar=new Set(),wars=[];
    const power=(f,key)=>f.area*f.expansion*(0.5+rollInt(s,stream,key,0,100,{dist:'uniform'}).value/100);
    for(const a of fs) for(const b of fs) {
        const r=a.id===b.id?null:rel(a.id,b.id);
        if(!['rival','enemy'].includes(r)||atWar.has(a.id)||atWar.has(b.id))continue;
        const key=`war:${a.id}>${b.id}`,pa=power(a,`${key}:att`),pb=power(b,`${key}:def`);
        if(pa<=pb)continue;
        const others=fs.filter(f=>f.id!==a.id&&f.id!==b.id&&!atWar.has(f.id)),
            defenderAllies=others.filter(f=>rel(f.id,b.id)==='ally'&&rel(f.id,a.id)!=='ally'&&pa<power(f,`${key}:join:${f.id}`)*2).map(f=>f.id),
            attackerAllies=others.filter(f=>rel(f.id,a.id)==='ally'&&!defenderAllies.includes(f.id)).map(f=>f.id);
        for(const id of [a.id,b.id,...defenderAllies,...attackerAllies])atWar.add(id);
        wars.push({id:`war:${wars.length+1}`,attacker:a.id,defender:b.id,year:startYear+rollInt(s,stream,`${key}:year`,1,50,{dist:'uniform'}).value,
            cause:{relation:r,attackerPower:Math.round(pa),defenderPower:Math.round(pb)},attackerAllies,defenderAllies});
    }
    wars.sort((x,y)=>x.year-y.year).forEach((w,i)=>w.id=`war:${i+1}`);
    const made={schema:1,worldId,factions:fs,relations,wars};made.events=deriveEvents(state,made);validateWorldHistory(made);
    (h.worldHistories ||= {})[worldId]=made;
    return made;
}
