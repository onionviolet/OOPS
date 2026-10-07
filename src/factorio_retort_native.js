// Pure full-envelope conservation. Native bags, chest, shops and accepted jobs
// remain the owners; this reader never creates stock or publishes a plan.
import {FACTORIO_RETORT_IDS as I, FACTORIO_RETORT_KEYS as K, FACTORIO_RETORT_TERMS as T,
    factorioRetortDefinitions} from './factorio_retort_content.js';
import {validateFactorioRetortState, validateFactorioRetortAcceptedJob} from './factorio_retort_host.js';

const check = (ok, text) => {if(!ok) throw new Error(text);};
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const natural = value => Number.isSafeInteger(value) && value >= 0;
const names = ['resinEmpty', 'resinFull', 'residueEmpty', 'residueFull', 'residue'];
const byKey = new Map(names.map(name => [K[name], name]));
const byId = new Map(names.map(name => [JSON.parse(K[name]).id, name]));
const commandIds = new Set([I.install, I.batch, I.collectResin, I.collectResidue, I.disposeFilled, I.disposeLoose]);

function mentionsRetort(value, seen = new Set(), depth = 0) {
    if(depth > 32) return false;
    if(typeof value === 'string') {
        if(byId.has(value) || byKey.has(value)) return true;
        try {return mentionsRetort(JSON.parse(value), seen, depth + 1);} catch {return false;}
    }
    if(!value || typeof value !== 'object' || seen.has(value)) return false;
    seen.add(value);
    return Object.entries(value).some(([key, child]) => byId.has(key) || byKey.has(key) || mentionsRetort(child, seen, depth + 1));
}

// Only the five authored plain keys are admitted. A component, quality, alias,
// extra property or noncanonical encoding is not a second tray identity.
function retortName(key) {
    if(typeof key !== 'string') return null;
    let value;
    try {value = JSON.parse(key);} catch {
        check(![...byId.keys()].some(id => key.includes(id)), 'Malformed retort inventory key.');
        return null;
    }
    if(!mentionsRetort(value)) return null;
    check(record(value) && Object.keys(value).length === 1 && Object.hasOwn(value, 'id') &&
        byId.has(value.id) && byKey.has(key), 'Retort stock must use its exact plain native item key.');
    return byKey.get(key);
}

const zero = () => Object.fromEntries(names.map(name => [name, 0]));
function add(counts, name, amount) {
    check(natural(amount) && amount > 0 && natural(counts[name] + amount), 'Invalid or overflowing retort stock count.');
    counts[name] += amount;
}
function bagCounts(bag, label, numeric = false) {
    check(record(bag), `Missing retort inventory container: ${label}.`);
    const counts = zero();
    for(const [key, entry] of Object.entries(bag)) {
        const name = retortName(key);
        if(!name) continue;
        check(numeric ? natural(entry) && entry > 0 : record(entry) &&
            Object.keys(entry).length === 1 && Object.hasOwn(entry, 'count') && natural(entry.count) && entry.count > 0,
        `Malformed retort count in ${label}.`);
        add(counts, name, numeric ? entry : entry.count);
    }
    return counts;
}
const sameCounts = (left, right) => names.every(name => left[name] === right[name]);
const nonempty = counts => names.some(name => counts[name] > 0);

function actualStock(save, simulation) {
    const total = zero(), containers = new Map(), seen = new Map();
    const include = (bag, label, numeric = false) => {
        const counts = bagCounts(bag, label, numeric);
        check(!seen.has(bag) || !nonempty(counts), 'Retort stock cannot alias two different inventory owners.');
        seen.set(bag, label); containers.set(label, counts);
        for(const name of names) if(counts[name]) add(total, name, counts[name]);
    };
    if(save.inventories != null) {
        check(record(save.inventories), 'Malformed native inventory owner table.');
        for(const [category, owners] of Object.entries(save.inventories)) {
            check(record(owners), 'Malformed native inventory category.');
            for(const [owner, bag] of Object.entries(owners)) include(bag, `${category}/${owner}`);
        }
    }
    // Component saves own these containers. Legacy fields name the same actual
    // player/chest/shop, so validate their retort projection and count once.
    const alias = (bag, canonical, label) => {
        if(bag == null) return;
        const counts = bagCounts(bag, label), prior = containers.get(canonical);
        if(prior) check(sameCounts(prior, counts), `Legacy ${label} disagrees with its canonical retort stock.`);
        else include(bag, label);
    };
    alias(save.character?.inventory, 'person/main_character', 'character.inventory');
    alias(save.player_storage?.inventory, 'storage/player', 'player_storage.inventory');
    if(save.traders != null) {
        check(record(save.traders), 'Malformed legacy trader table.');
        for(const [id, trader] of Object.entries(save.traders)) alias(trader?.inventory, `trader/${id}`, `traders.${id}.inventory`);
    }
    if(simulation?.owners != null) {
        check(record(simulation.owners), 'Malformed simulation inventory owner table.');
        for(const [owner, bag] of Object.entries(simulation.owners)) {
            const counts = bagCounts(bag, `simulation/${owner}`, true);
            check(!nonempty(counts) || simulation.people?.[owner]?.inventory === 'simulation',
                'Retort stock cannot create a second native or orphan simulation inventory owner.');
            include(bag, `simulation/${owner}`, true);
        }
    }
    return total;
}

function acceptedStock(state, total) {
    const simulation = state?.simulation, jobs = simulation?.jobs || [];
    check(Array.isArray(jobs), 'Malformed accepted retort job table.');
    const ids = new Set();
    for(const job of jobs) {
        check(record(job) && !ids.has(job.id), 'Duplicate or malformed accepted job identity.');
        ids.add(job.id);
        let retortTerms = false;
        for(const family of ['costs', 'effects']) for(const effect of job[family] || []) {
            const name = retortName(effect?.key);
            if(!name) continue;
            retortTerms = true;
            check(commandIds.has(job.commandId), 'An unrelated job cannot reserve or create retort stock.');
            if(family === 'costs') {
                check(effect.type === 'item' && Number.isSafeInteger(effect.amount) && effect.amount < 0,
                    'Retort reservation must hold an actual negative item cost.');
                add(total, name, -effect.amount);
            }
            // Future positive effects are not physical stock yet. The content
            // reader pins their pair, variant return flags and exact terms.
        }
        if(commandIds.has(job.commandId) || retortTerms || job.siteId === I.site) {
            check(commandIds.has(job.commandId), 'The retort site has an unsupported accepted job.');
            validateFactorioRetortAcceptedJob(job, state);
        }
    }
    const site = simulation?.sites?.[I.site];
    if(site) {
        check(record(site.reservations), 'Malformed retort site reservations.');
        for(const [id, actor] of Object.entries(site.reservations)) check(actor === 'player' &&
            jobs.some(job => job.id === id && job.actorId === actor && job.siteId === I.site && commandIds.has(job.commandId)),
        'Orphan or foreign retort receiver reservation.');
    }
    return total;
}

export function validateFactorioRetortNativeEnvelope(save) {
    check(record(save), 'Retort validation needs the actual full save envelope.');
    const state = save.expansion, simulation = state?.simulation;
    if(state != null) validateFactorioRetortState(state);
    for(const [label, equipment] of [['player', save.character?.equipment], ['native people', save.npc_equipment],
        ['simulation people', simulation?.equipment], ['borrowed custody', simulation?.custody]]) {
        check(!mentionsRetort(equipment), `Retort receivers and residue are physical stock, never ${label} equipment or borrowed custody.`);
    }
    const totals = acceptedStock(state, actualStock(save, simulation)), receipt = state?.referenceGameplay?.retort;
    if(receipt == null) {
        check(!nonempty(totals) && simulation?.sites?.[I.site] == null,
            'Retort stock and rack require their explicit funded installation receipt.');
        return true;
    }
    const definition = factorioRetortDefinitions.sites.find(site => site.id === I.site), site = simulation?.sites?.[I.site];
    check(definition?.worldId === I.world && definition.location === 'Village' && definition.capacity === T.siteCapacity &&
        definition.revision === T.revision && definition.provision === false && site?.owner === 'player' && site.capacity === T.siteCapacity,
    'Retort stock needs its actual retained player-owned Village rack.');
    for(const [actor, record] of Object.entries(state.actors || {})) if(actor !== 'player') {
        check(!Object.entries(record.completed || {}).some(([id, count]) => commandIds.has(id) && count !== 0),
            'Retort production counters belong only to the actual player worker.');
    }
    const completed = state.actors?.player?.completed || {};
    const count = id => {
        const value = completed[id] ?? 0;
        check(natural(value) && value <= state.sequence, 'Malformed retained retort completion count.');
        return value;
    };
    const B = count(I.batch), R = count(I.collectResin), C = count(I.collectResidue), D = count(I.disposeFilled), L = count(I.disposeLoose);
    check(natural(C + D) && B >= R && B >= C + D && C >= L, 'Retort collections or disposal exceed actual completed production.');
    check(totals.resinEmpty + totals.resinFull === T.trayCapacity &&
        totals.residueEmpty + totals.residueFull === T.trayCapacity,
    'Retort must conserve exactly one actual empty/filled/reserved receiver in each family.');
    check(totals.resinFull === B - R && totals.residueFull === B - C - D && totals.residue === C - L,
        'Retort contents do not match actual completed batch, collection and disposal receipts.');
    return true;
}
