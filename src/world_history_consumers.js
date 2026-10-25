// G5 consumers of the derived world history (lore_history_state.deriveWorldHistory). Read-only views over the
// stored factions, relations and wars: nothing here draws or writes, so reload and re-derivation agree.
// Other owners (story requests, faction behavior) read through worldHistoryFacts; they never touch loreHistory.
import {deriveWorldHistory,validateWorldHistory} from './lore_history_state.js';
const cap=s=>s[0].toUpperCase()+s.slice(1);
const place=id=>`the ${id} reach`;
const CAUSE_TEXT={rival:'an old rivalry',enemy:'a standing enmity'};
// Stored history for a world, or null. Never derives.
export function storedWorldHistory(state,worldId='base.frontier'){return state?.loreHistory?.worldHistories?.[worldId]??null;}
// Idempotent: derives on first call (needs seeded streams) and returns the stored history afterwards.
export function ensureWorldHistory(state,opts={}){return state?.streams?deriveWorldHistory(state,opts):null;}
export function factionStanding(history,id){
    const wars=history.wars.filter(w=>[w.attacker,w.defender,...w.attackerAllies,...w.defenderAllies].includes(id));
    const side=w=>w.attacker===id||w.attackerAllies.includes(id)?'attacker':'defender';
    const foes=new Set(),allies=new Set();
    for(const w of wars){const mine=side(w)==='attacker';for(const f of [w.attacker,...w.attackerAllies])(mine?allies:foes).add(f);for(const f of [w.defender,...w.defenderAllies])(mine?foes:allies).add(f);}
    allies.delete(id);foes.delete(id);
    const lost=wars.some(w=>side(w)==='defender'&&w.defender===id);
    const pairs=Object.entries(history.relations).filter(([k])=>k.split('|').includes(id));
    const wary=pairs.some(([,v])=>['suspicion','rival','enemy'].includes(v));
    return {id,wars:wars.map(w=>w.id),foes:[...foes].sort(),allies:[...allies].sort(),
        posture:lost?'embattled':wars.length?'at_war':wary?'wary':'at_peace'};
}
// Quest-source facts, by interface only: story_requests can turn each row into an issuer need.
function questSources(history,home){
    return history.wars.flatMap(w=>[
        {kind:'refugee_aid',faction:w.defender,warId:w.id,year:w.year,needTags:['food','repair']},
        {kind:'war_supply',faction:w.attacker,warId:w.id,year:w.year,needTags:['fuel','parcel']},
        ...(w.defenderAllies.length||w.attackerAllies.length?[{kind:'envoy_errand',faction:(w.defenderAllies[0]??w.attackerAllies[0]),warId:w.id,year:w.year,needTags:['parcel','cord']}]:[])
    ]).filter(s=>s.faction!==home||s.kind!=='war_supply');
}
function homeFaction(history){
    const count=id=>history.wars.filter(w=>w.attacker===id||w.defender===id).length;
    return [...history.factions].sort((a,b)=>count(a.id)-count(b.id)||b.area-a.area||(a.id<b.id?-1:1))[0].id;
}
export function worldHistoryFacts(state,worldId='base.frontier'){
    const h=storedWorldHistory(state,worldId);if(!h)return null;validateWorldHistory(h);
    const home=homeFaction(h),latest=[...h.wars].sort((a,b)=>b.year-a.year||(a.id<b.id?-1:1))[0]??null;
    return structuredClone({worldId,home,region:place(home),factions:h.factions.map(f=>factionStanding(h,f.id)),relations:h.relations,wars:h.wars,
        sacred:latest&&{warId:latest.id,label:`the field of the year-${latest.year} reckoning`,faction:latest.defender,cause:latest.cause.relation},
        questSources:questSources(h,home)});
}
// Per-person origin for the village's generated people. 3 base travelers always; the road adds up to two more
// when the history holds wars: refugees from the loser of each of the first two wars.
export function villageHistoryContext(state,worldId='base.frontier'){
    const f=worldHistoryFacts(state,worldId);if(!f)return null;
    const others=f.factions.map(x=>x.id).filter(id=>id!==f.home);
    const base=[0,1,2].map(i=>({faction:others[i%others.length],kind:'wayfarer',war:null}));
    const extra=f.wars.slice(0,2).map(w=>({faction:w.defender===f.home?w.attacker:w.defender,kind:'refugee',war:w.id}));
    return {worldId,home:f.home,region:f.region,sacred:f.sacred,origins:[...base,...extra]};
}
export function originLine(o,ctx){
    if(!o)return '';
    return o.kind==='refugee'?`Fled the war that broke over ${place(o.faction)}; now walking toward ${ctx?.region??'a quieter reach'}.`:`Comes from ${place(o.faction)}.`;
}
// A mural/gospel-style line that cites one real war. Pure and index-stable; null when the history holds no war.
export function historyMural(state,worldId='base.frontier',index=0){
    const h=storedWorldHistory(state,worldId);if(!h?.wars.length)return null;
    const w=h.wars[((index%h.wars.length)+h.wars.length)%h.wars.length];
    const sides=(ids)=>ids.length?` with ${ids.map(place).join(' and ')} beside them`:'';
    const text=`The wall shows year ${w.year}: ${cap(place(w.attacker))} rose${sides(w.attackerAllies)} against ${place(w.defender)}${sides(w.defenderAllies)}, from ${CAUSE_TEXT[w.cause.relation]??'a grudge'}. The painted ground is kept holy.`;
    return {warId:w.id,year:w.year,text};
}
// All mural lines keyed by war id (capped to the first MURAL_LIMIT wars), for the chronicle command context.
export const MURAL_LIMIT=8;
export function historyMurals(state,worldId='base.frontier'){
    const h=storedWorldHistory(state,worldId),out={};
    for(let i=0;i<Math.min(MURAL_LIMIT,h?.wars.length??0);i++){const m=historyMural(state,worldId,i);out[m.warId]=m;}
    return out;
}
// One line for the village panel: where the village sits and how the standing wars color the road.
export function historyBrief(state,worldId='base.frontier'){
    const f=worldHistoryFacts(state,worldId);if(!f)return '';
    const me=f.factions.find(x=>x.id===f.home),w=f.wars[0];
    const road=w?`The war of year ${w.year} between ${place(w.attacker)} and ${place(w.defender)} sends refugees down the road.`:'No war has marked the roads yet.';
    return `Village stands in ${f.region} (${me.posture.replace('_',' ')}). ${road}`;
}
