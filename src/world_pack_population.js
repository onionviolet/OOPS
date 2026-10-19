// Proposal (WPL5): layered people from a loaded world pack (P9Q2-P9Q4).
// Institution -> cohort -> named person -> generated member. Generated members
// are addresses until asked for; nothing here ticks or writes a save (CX4).
import {address, drawU32, pickWeighted, compareCodePoints} from './gen_kit.js';
import {EXCEPTION_PRIORITY} from './world_pack_manifest.js';
import {isActive} from './world_pack_loader.js';

const byId = (a, b) => compareCodePoints(a, b);
const DAY = 1440;

// WP10, GR2: hash(root, pack, instance, scope, slot). Adding a cohort, another
// pack or another instance never moves an existing draw.
export const slotKey = (packId, instanceId, scope, slot) => address('world-pack', {pack: packId, instance: instanceId, scope, slot});
export const edgeKey = (a, b) => [a, b].sort(byId).join('|');

// CX5: counts draws per entity and in total; exceeding a declared budget throws.
export function createDrawLedger({maxDrawsPerEntity, maxEntities}) {
    const perEntity = new Map(); let total = 0;
    return {
        draw(root, entityId, key) {
            const n = (perEntity.get(entityId) || 0) + 1;
            if (n > maxDrawsPerEntity) throw RangeError(`Draw budget exceeded for ${entityId}.`);
            if (!perEntity.has(entityId) && perEntity.size >= maxEntities) throw RangeError('Entity budget exceeded.');
            perEntity.set(entityId, n); total++;
            return drawU32(root, key);
        },
        stats: () => ({entities: perEntity.size, draws: total, maxPerEntity: Math.max(0, ...perEntity.values())}),
    };
}

export function createPopulation(loaded, {root, instanceId}) {
    if (typeof instanceId !== 'string' || !instanceId) throw TypeError('A population is scoped to one instance.');
    const records = loaded.records, active = id => isActive(loaded, id);
    const family = f => [...records].filter(([id, x]) => x.family === f && active(id)).map(([id, x]) => [id, x.record]).sort(([a], [b]) => byId(a, b));
    const cohorts = new Map(family('cohorts')), institutions = new Map(family('institutions'));
    const named = new Map(family('people'));
    const namedByCohort = new Map();
    for (const [id, p] of named) if (p.cohort && cohorts.has(p.cohort)) (namedByCohort.get(p.cohort) || namedByCohort.set(p.cohort, []).get(p.cohort)).push(id);
    const ledger = createDrawLedger({maxDrawsPerEntity: loaded.pack.budgets.drawsPerEntity, maxEntities: loaded.pack.budgets.entities});
    const memo = new Map();

    // Exceptions index (P9Q3/P9Q44): sorted once by priority then ID, so the
    // answer for one minute never depends on input order (P9Q43).
    const rank = (a, b) => EXCEPTION_PRIORITY[b.kind] - EXCEPTION_PRIORITY[a.kind] || byId(a.id, b.id);
    const index = list => {
        const byPerson = new Map(), byCohort = new Map();
        for (const e of [...list].sort(rank)) {
            const map = e.personId ? byPerson : byCohort, key = e.personId || e.cohortId;
            (map.get(key) || map.set(key, []).get(key)).push(e);
        }
        return {byPerson, byCohort};
    };
    const packExceptions = index(family('exceptions').map(([, e]) => e));

    function generated(id) {
        const m = /^(.*)\.m(\d+)$/.exec(id), cohort = m && cohorts.get(m[1]), n = m && Number(m[2]);
        if (!cohort || !(n < cohort.count)) return null;
        const slot = records.get(cohort.slot).record, table = slot.table, inst = institutions.get(cohort.institution);
        // GR10: the table revision is part of the scope; seen values are frozen in the save.
        const scope = `${cohort.id}@${table.revision}`;
        const pick = (rows, part) => pickWeighted(rows, r => r.weight, ledger.draw(root, id, slotKey(loaded.id, instanceId, scope, `${n}:${part}`)));
        const given = pick(table.given, 'given'), fam = pick(table.family, 'family'), trait = pick(table.traits, 'trait');
        const clubs = [{id: 'none', weight: table.noClubWeight}, ...(inst.clubs || []).map(c => ({id: c.id, weight: table.clubWeight}))];
        const club = pick(clubs, 'club');
        return {id, layer: 'generated', name: `${given.value.id} ${fam.value.id}`, cohort: cohort.id, house: cohort.house, institution: cohort.institution,
            entryYear: cohort.entryYear, club: club.value.id === 'none' ? null : club.value.id, tags: [trait.value.id], tableRevision: table.revision,
            receipt: {given: given.receipt.selected, family: fam.receipt.selected, trait: trait.receipt.selected, club: club.receipt.selected}};
    }
    function person(id) {
        if (memo.has(id)) return memo.get(id);
        let p = null;
        if (named.has(id)) {const r = named.get(id), c = cohorts.get(r.cohort);
            p = {id, layer: 'named', name: r.name, cohort: r.cohort ?? null, house: c?.house ?? null, institution: c?.institution ?? null,
                entryYear: c?.entryYear ?? null, club: r.club ?? null, tags: [...(r.tags || [])], canonWeight: r.canonWeight ?? null};}
        else p = generated(id);
        if (p) memo.set(id, Object.freeze(p));
        return p;
    }
    const members = cohortId => {const c = cohorts.get(cohortId); if (!c) return [];
        return [...(namedByCohort.get(cohortId) || []), ...Array.from({length: c.count}, (_, i) => `${cohortId}.m${i}`)];};
    const everyone = () => [...cohorts.keys()].flatMap(members).concat([...named.keys()].filter(id => !named.get(id).cohort || !cohorts.has(named.get(id).cohort)));

    // Presence by query (P9Q3): calendar, timetable, house dorm or commons,
    // then the highest-priority active exception. Pure in (id, minute, extra).
    function presenceAt(id, minute, {extra = null} = {}) {
        const p = person(id);
        if (!p || !Number.isSafeInteger(minute) || minute < 0) return null;
        const cohort = cohorts.get(p.cohort), inst = institutions.get(p.institution);
        let result = {placeId: null, source: 'unplaced', ruleId: null};
        if (cohort && inst) {
            const day = Math.floor(minute / DAY), mod = minute % DAY, weekday = day % inst.calendar.weekLength;
            const block = inst.blocks.find(b => b.start <= mod && mod < b.end);
            const wake = inst.calendar.wake ?? 420, curfew = inst.calendar.curfew ?? 1320;
            const inTerm = inst.calendar.terms.some(([s, e]) => s <= day && day < e);
            const dorm = inst.houses.find(h => h.id === cohort.house).dorm;
            if (!inTerm) result = {placeId: null, source: 'off_term', ruleId: null};
            else if (block && cohort.timetable[String(weekday)]?.[block.id]) result = {placeId: cohort.timetable[String(weekday)][block.id], source: 'timetable', ruleId: block.id};
            else result = mod < wake || mod >= curfew ? {placeId: dorm, source: 'dorm', ruleId: cohort.house} : {placeId: inst.commons, source: 'commons', ruleId: inst.id};
            const candidates = [...(packExceptions.byPerson.get(id) || []), ...(packExceptions.byCohort.get(p.cohort) || []),
                ...(extra ? [...(extra.byPerson.get(id) || []), ...(extra.byCohort.get(p.cohort) || [])] : [])];
            if (inTerm && p.club && block) {const club = inst.clubs.find(c => c.id === p.club);
                if (club && club.weekday === weekday && club.block === block.id) candidates.push({id: club.id, kind: 'club', placeId: club.place, start: minute, end: minute + 1});}
            const winner = candidates.filter(e => e.start <= minute && minute < e.end).sort(rank)[0];
            if (winner) result = {placeId: winner.placeId, source: winner.kind, ruleId: winner.id};
        }
        return result;
    }
    // P9Q4: explicit edges first (pack canon, then save), then derived edges.
    const explicit = new Map(family('relationships').map(([, r]) => [edgeKey(r.a, r.b), r]));
    function relation(a, b, saved = {}) {
        const key = edgeKey(a, b), e = explicit.get(key) || saved[key];
        if (e) return {kind: e.kind, source: e.source};
        const x = person(a), y = person(b);
        if (!x || !y || a === b) return null;
        if (x.cohort && x.cohort === y.cohort) return {kind: 'classmate', source: 'derived'};
        if (x.club && x.club === y.club) return {kind: 'clubmate', source: 'derived'};
        if (x.house && x.house === y.house && x.institution === y.institution) return {kind: 'housemate', source: 'derived'};
        return null;
    }
    return {packId: loaded.id, instanceId, pin: loaded.pin, person, members, everyone, presenceAt, relation, indexExceptions: index, stats: () => ({...ledger.stats(), materialized: memo.size})};
}
