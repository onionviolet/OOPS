import {beginNativeCraftTransaction} from './native_craft_transaction.js';
import {aptitudeMultipliers} from './continuation_retention.js';
// Skill floor, near-miss and paths-not-taken records (G27) as a registered domain with the namespaced `skillRecords` save slice.
// Rules live in skill_records.js. The domain reads native skill progress, never writes it: rust is a negative bonus level in the
// hero's own `flat.rust` bucket, which person.js sums with the other skill bonuses, so total_xp and every XP diff stay untouched.
import {registerDomain} from './domain_registry.js';
import {nativeSkillDiscovery} from './skill_discovery_native.js';
import {freshSkillRecords,validateSkillRecords,migrateSkillRecords,observeSkills,rustBonuses,lifeSummary,dialFor} from './skill_records.js';
import {queryStoryOutcomes} from './lore_history_state.js';
let records=freshSkillRecords(),ports=null,applied='',panel=null;
export function configureSkillRecords(operations){ports=operations;}
export const bindSkillRecordsPanel=p=>{panel=p;};
const catalog=()=>ports?.skills?.()??{};
const levelable=()=>ports?.actor?.()?.getLevelableComponent?.()??null;
const rowsOf=lv=>Object.entries(lv.skill_progress).filter(([id,p])=>catalog()[id]&&p.total_xp>0).map(([id,p])=>({id,level:p.current_level,totalXp:p.total_xp,xp:p.current_xp,toNext:p.xp_to_next_lvl}));
function apply() {
    const lv=levelable();if(!lv)return;
    const bonuses=rustBonuses(records),aptitude=Object.fromEntries(Object.entries(aptitudeMultipliers(ports?.continuation?.())).filter(([id])=>catalog()[id])),signature=JSON.stringify([bonuses,aptitude]);
    if(signature===applied)return;
    const quiet=applied===''&&signature==='[{},{}]';
    lv.bonus_skill_levels.flat.rust=bonuses;lv.xp_bonuses.multiplier.aptitude=aptitude;applied=signature;
    if(!quiet)ports.actor().updateStatsAndDisplay?.();
}
function observe(minutes) {
    const lv=levelable();if(!lv||!ports.world)return;
    const before=JSON.stringify(records);
    records=observeSkills(records,rowsOf(lv),minutes,{worldId:ports.world(),clock:ports.root().clock});
    if(JSON.stringify(records)!==before||applied==='')apply();
}
export function skillSummary() {
    const lv=levelable(),worldId=ports?.world?.(),skills=catalog();if(!lv)return null;
    const discovered=Object.keys(skills).filter(id=>nativeSkillDiscovery(skills[id],ports.actor())).map(id=>({id,label:skills[id].getName?.()??id,category:skills[id].category,totalXp:lv.skill_progress[id]?.total_xp||0}));
    const declined=queryStoryOutcomes(ports.root(),{action:'request.decline'}).filter(r=>r.audience.includes('player')&&r.known.item).map(r=>`${r.known.item} for ${r.known.person??'a neighbour'}`);
    const name=id=>skills[id]?.getName?.()??id;
    const s=lifeSummary(records,{discovered,declined,worldId});
    return {...s,rusty:s.rusty.map(r=>({...r,name:name(r.id)})),nearMisses:s.nearMisses.map(n=>({...n,name:name(n.skill)}))};
}
export function setRust(on) {
    const worldId=ports.world();if(!dialFor(worldId))throw Error('This world has no rust dial.');
    const lv=levelable(),tx=beginNativeCraftTransaction({owners:[lv?.bonus_skill_levels,lv?.xp_bonuses,lv?.stats],bindings:[{get:()=>records,set:v=>{records=v;}},{get:()=>applied,set:v=>{applied=v;}}],onRollback:()=>{ports.actor().updateStatsAndDisplay?.();panel?.render();}});
    try{records={...records,rustOn:{...records.rustOn,[worldId]:!!on}};observe(0);apply();ports.persist(()=>tx.markDurable());if(tx.status==='pending')tx.markDurable();}
    catch(error){if(tx.status==='pending')tx.rollback();throw error;}
    panel?.render();
}
registerDomain({id:'skillRecords',initialState:()=>null,
 save:()=>JSON.stringify(records)===JSON.stringify(freshSkillRecords())?undefined:structuredClone(records),
 validate:slice=>{if(slice!=null)validateSkillRecords(slice);},
 migrate:migrateSkillRecords,
 load:slice=>{records=slice??freshSkillRecords();applied='';apply();},
 tick:minutes=>observe(minutes),refresh:()=>{observe(0);panel?.render();},
 projection:()=>({...structuredClone(records),learning:[...new Set([...(ports?.continuation?.()?.knownMastery||[]),...Object.keys(records.tracked)])].filter(id=>catalog()[id]&&((ports?.continuation?.()?.knownMastery||[]).includes(id)||nativeSkillDiscovery(catalog()[id],ports.actor()))).map(skill=>({skill,echo:aptitudeMultipliers(ports?.continuation?.())[skill]||1,nativeRate:ports.actor().getSkillXPGain(skill)}))}),commands:{setRust,summary:skillSummary}});
