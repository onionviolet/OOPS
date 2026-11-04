// P2 (WAC8, WAC28): bundled world packs installed through the pure loader.
// One registry list, shared by the runtime and by the lint in `npm test`, so a
// pack cannot be installed without being linted. Installs definitions only: no
// state, save slice, tick or UI (AR3). Imports no world module (AR2, no cycles).
import molPack from './world_packs/book_mol_pack.js';
import hpPack from './world_packs/book_hp_pack.js';
import hpLeadPack from './world_packs/book_hp_lead_life.js';
import {loadWorldPacks} from './world_pack_loader.js';
import {registerDomain} from './domain_registry.js';
import {emptyWorldPackSaves,reconcileWorldPackSaves,createSection,validateSection,revealPerson} from './world_pack_save.js';
import {createPopulation} from './world_pack_population.js';

export const BUNDLED_WORLD_PACKS=Object.freeze([molPack,hpPack]);
export function loadBundledWorldPacks(raw=BUNDLED_WORLD_PACKS){return loadWorldPacks(raw);}
const registry=loadBundledWorldPacks();
export const worldPackRegistry=registry;
// Lead lives load as their own list: pack ids may not nest and `book.hp.lead` sits under the `book.hp` pack.
export const BUNDLED_LEAD_LIFE_PACKS=Object.freeze([hpLeadPack]);
export const leadLifePackRegistry=loadBundledWorldPacks(BUNDLED_LEAD_LIFE_PACKS);
// A dormant or missing bundled pack is a loud failure: an empty world must never install silently.
export function installedWorldPack(id,from=registry){
    if(from===registry&&!from.packs.has(id)&&leadLifePackRegistry.packs.has(id))from=leadLifePackRegistry;
    const loaded=from.packs.get(id);
    if(!loaded)throw Error(`World pack ${id} did not load (${from.dormantPacks.get(id)??'missing'}).`);
    const errors=from.diagnostics.filter(d=>d.packId===id&&d.severity==='error');
    if(errors.length)throw Error(`World pack ${id} has errors: ${errors.map(d=>d.code).join(', ')}.`);
    return loaded;
}
// Deep copy for definitions that were mutable before packs; callers re-freeze what they froze.
export const packNative=(id,from)=>structuredClone(installedWorldPack(id,from).pack.native);
// Per-life world-pack state (SAVES 2026-11-04): the `world_packs` slice holds the sections of
// world_pack_save.js. Absent means no state and writes no key, so every older save is byte-identical.
// Definitions stay in the packs; the slice stores only what play changed or revealed.
const allPacks=()=>({packs:new Map([...registry.packs,...leadLifePackRegistry.packs]),dormantPacks:new Map([...registry.dormantPacks,...leadLifePackRegistry.dormantPacks])});
let saves=null,dormant=[];
const hasState=s=>s&&(Object.keys(s.sections).length>0||Object.keys(s.clusters||{}).length>0);
// Throws only what reconcile itself refuses (an unsupported slice schema); a bad or unloadable
// section is carried verbatim as dormant, never dropped and never a reason to refuse the save.
const reconcileSlice=slice=>slice==null?{saves:null,dormant:[]}:reconcileWorldPackSaves(structuredClone(slice),allPacks());
// Reveal a person in one instance of one pack. The instance id is the caller's stable key (one per played world).
export function revealWorldPackPerson(packId,instanceId,personId,rung='met'){
    const loaded=allPacks().packs.get(packId);
    if(!loaded)throw Error(`World pack ${packId} is not loaded.`);
    const population=createPopulation(loaded,{root:0,instanceId});
    const base=saves??emptyWorldPackSaves();
    const section=revealPerson(base.sections[packId]??createSection(loaded),population,personId,{rung});
    saves={...base,sections:{...base.sections,[packId]:validateSection(section,loaded)}};
    return structuredClone(saves.sections[packId]);
}
registerDomain({id:'world_packs',deps:[],initialState:()=>null,
    save:()=>hasState(saves)?structuredClone(saves):undefined,
    validate:slice=>{reconcileSlice(slice);},
    load:slice=>{({saves,dormant}=reconcileSlice(slice));if(!hasState(saves))saves=null;},
    projection:()=>[...registry.packs.values(),...leadLifePackRegistry.packs.values()].map(p=>({id:p.id,revision:p.revision,fingerprint:p.fingerprint})),
    commands:{reveal:revealWorldPackPerson,view:()=>({saves:structuredClone(saves),dormant:structuredClone(dormant)})}});
