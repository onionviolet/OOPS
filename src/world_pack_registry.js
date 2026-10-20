// P2 (WAC8, WAC28): bundled world packs installed through the pure loader.
// One registry list, shared by the runtime and by the lint in `npm test`, so a
// pack cannot be installed without being linted. Installs definitions only: no
// state, save slice, tick or UI (AR3). Imports no world module (AR2, no cycles).
import molPack from './world_packs/book_mol_pack.js';
import {loadWorldPacks} from './world_pack_loader.js';
import {registerDomain} from './domain_registry.js';

export const BUNDLED_WORLD_PACKS=Object.freeze([molPack]);
export function loadBundledWorldPacks(raw=BUNDLED_WORLD_PACKS){return loadWorldPacks(raw);}
const registry=loadBundledWorldPacks();
export const worldPackRegistry=registry;
// A dormant or missing bundled pack is a loud failure: an empty world must never install silently.
export function installedWorldPack(id,from=registry){
    const loaded=from.packs.get(id);
    if(!loaded)throw Error(`World pack ${id} did not load (${from.dormantPacks.get(id)??'missing'}).`);
    const errors=from.diagnostics.filter(d=>d.packId===id&&d.severity==='error');
    if(errors.length)throw Error(`World pack ${id} has errors: ${errors.map(d=>d.code).join(', ')}.`);
    return loaded;
}
// Deep copy for definitions that were mutable before packs; callers re-freeze what they froze.
export const packNative=(id,from)=>structuredClone(installedWorldPack(id,from).pack.native);
registerDomain({id:'world_packs',deps:[],projection:()=>[...registry.packs.values()].map(p=>({id:p.id,revision:p.revision,fingerprint:p.fingerprint}))});
