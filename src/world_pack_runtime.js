// World pack runtime (WAC8, WAC28): installs lint-clean packs and hands their record
// definitions to the content modules that used to build them in code. Pure install
// registry plus one projection-only domain; no tick, save slice or UI (AR2, AR3).
import {registerDomain} from './domain_registry.js';
import {lintWorldPack, worldPackFingerprint, worldPackCoverage} from './world_pack.js';

const installed = new Map();
const freeze = v => {
    if(v && typeof v === 'object' && !Object.isFrozen(v)) {Object.values(v).forEach(freeze); Object.freeze(v);}
    return v;
};

// A pack that fails lint never installs; the error lists every issue by WA code.
export function installWorldPack(pack, options = {}) {
    const {ok, issues} = lintWorldPack(pack, options);
    if(!ok) throw Error(`World pack ${pack?.id} failed lint:\n${issues.map(i => `${i.rule} ${i.path}: ${i.message}`).join('\n')}`);
    if(installed.has(pack.id)) throw Error(`World pack ${pack.id} is already installed.`);
    const frozen = freeze(structuredClone(pack));
    installed.set(pack.id, Object.freeze({pack: frozen, fingerprint: worldPackFingerprint(frozen)}));
    return pack.id;
}
export const installedPackIds = () => [...installed.keys()];
export const installedPack = id => installed.get(id)?.pack;
export function installedPackOrThrow(id) {
    const pack = installedPack(id);
    if(!pack) throw Error(`World pack ${id} is not installed.`);
    return pack;
}
// Fresh mutable copies of each matching record's engine definition, in pack order.
// Copies keep consumers independent of the frozen pack and of each other.
export const packDefinitions = (id, kind) => installedPackOrThrow(id).records
    .filter(r => r.kind === kind && r.data !== undefined).map(r => structuredClone(r.data));
export const worldPackProjection = () => [...installed.values()].map(({pack, fingerprint}) =>
    ({id: pack.id, revision: pack.revision, worldId: pack.worldId, fingerprint, coverage: worldPackCoverage(pack)}));

registerDomain({id: 'world_packs', deps: [], projection: worldPackProjection});
