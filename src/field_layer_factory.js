import {beginNativeCraftTransaction} from './native_craft_transaction.js';
import {LEVELS, ventOf, fresh, validateFields, upgradeFields, advance, pour, ignite, douse, sweep, raiseField, dropField, ignitable, readPlace, floorReading, massOf, DIALS} from './field_layer.js';
// Field domain factory (G7 slice). Host-free: every native operation arrives through `ports`.
// The domain owns only the `fields` slice. Items stay native; pouring is one quoted, revalidated
// command inside one native rollback boundary (AR7), and the tick mutates only this slice (AR3).
export const WATER = JSON.stringify({id: 'Spring water'});
export {validateFields};
const SMOKE_THICK = 60;
// Harm dials (AD22 defaults): what a minute on a burning floor, in fumes or under falling boards costs a person.
// The host caps it so a person is scorched and winded, never killed here (AD19 forgiving recovery).
export const HARM = Object.freeze({BURN_HEALTH: 2, FALL_HEALTH: 6, FUME_PER_STAMINA: 8, SMOKE_PER_STAMINA: 12});
export const HATCH = 'hatch';
export const harmOf = e => ({health: HARM.BURN_HEALTH * e.burning + HARM.FALL_HEALTH * e.fell,
    stamina: Math.floor(e.fume / HARM.FUME_PER_STAMINA) + Math.floor(e.smoke / HARM.SMOKE_PER_STAMINA)});
export function createFieldDomain(operations) {
    let state = fresh(), ports = null;
    const setState = v => { state = v ?? fresh(); };
    const here = () => ports.location();
    const placeOf = () => state.places[here()];
    function materials() {
        return ports.heldItems().flatMap(row => { const c = ports.composition(row.key); return c && row.key !== WATER ? [{...row, mass: c.mass}] : []; });
    }
    const q0 = (kind, extra = {}) => ({eligible: false, reason: '', kind, key: null, level: null, ...extra});
    function quote(req) {
        const out = q0(req?.kind, {key: req?.key ?? null, level: req?.level ?? null});
        if (!ports) return {...out, reason: 'The field layer is inactive.'};
        if (!ports.writable()) return {...out, reason: 'Saving is paused, so nothing can change now.'};
        const where = here(), p = placeOf();
        if (!where) return {...out, reason: 'You are not anywhere you can do this.'};
        if (req.kind === 'pour') {
            if (!LEVELS[req.level]) return {...out, reason: 'Choose a level.'};
            const row = ports.heldItems().find(r => r.key === req.key), c = row && ports.composition(req.key);
            if (!c) return {...out, reason: 'You hold nothing like that to spill.'};
            if (massOf(p ?? {levels: []}) + c.mass > DIALS.POUR_CAP) return {...out, reason: 'There is no more room to spill stock here.'};
            return {...out, eligible: true, spend: 1, mass: c.mass};
        }
        if (req.kind === 'light') {
            const open = ignitable(state, where);
            const level = req.level ?? open[0];
            if (!open.includes(level)) return {...out, level, reason: p ? 'Nothing spilled here will catch.' : 'Nothing is spilled here.'};
            if (!ports.ignitionSource()) return {...out, level, reason: 'You need a lit oil lamp in your pack to start a fire.'};
            return {...out, eligible: true, level};
        }
        if (req.kind === 'douse') {
            if (!p || !LEVELS[req.level]) return {...out, reason: p ? 'Choose a level.' : 'Nothing is spilled here.'};
            if (!ports.heldItems().some(r => r.key === WATER)) return {...out, key: WATER, reason: 'You need a pack of Spring water.'};
            if (massOf(p) + 1000 > DIALS.POUR_CAP) return {...out, key: WATER, reason: 'There is no room to add more.'};
            return {...out, eligible: true, key: WATER, spend: 1};
        }
        if (req.kind === 'seal' || req.kind === 'unseal') {
            if (req.level !== 0 && req.level !== 1) return {...out, reason: 'Choose a hatch: floor to shelf, or shelf to rafters.'};
            const e = p?.edges[req.level] ?? {};
            if (req.kind === 'seal') return HATCH in e ? {...out, reason: 'That hatch is already barred.'} : {...out, eligible: true};
            return HATCH in e ? {...out, eligible: true} : {...out, reason: 'That hatch is not barred.'};
        }
        if (req.kind === 'sweep') {
            if (!p) return {...out, reason: 'Nothing is spilled here.'};
            if (p.levels.some(l => l.fire || l.gas.smoke || l.gas.fume)) return {...out, reason: 'Wait until the fire and smoke have cleared.'};
            return {...out, eligible: true};
        }
        return {...out, reason: 'Unknown field action.'};
    }
    function commit(mutate) {
        const tx = beginNativeCraftTransaction({owners: ports.itemOwners(), bindings: [{get: () => state, set: setState}]});
        try { mutate(); ports.persist(() => tx.markDurable()); }
        catch (error) { if (tx.status === 'pending') tx.rollback(); throw error; }
        finally { ports.refresh(); ports.refreshPanel?.(); }
    }
    function execute(quoted) {
        const q = quote(quoted);
        if (!q.eligible) throw Error(q.reason);
        if (q.kind !== quoted.kind || q.key !== quoted.key || q.level !== quoted.level) throw Error('The room changed since you chose. Try again.');
        const where = here();
        if (q.spend) ports.assertSpend(q.key);
        commit(() => {
            if (q.spend) ports.removeKey(q.key, q.spend);
            if (q.kind === 'pour') state = pour(state, where, q.level, ports.composition(q.key), 1, ports.doorways?.() ?? []);
            else if (q.kind === 'douse') state = douse(state, where, q.level, ports.composition(WATER));
            else if (q.kind === 'light') state = ignite(state, where, q.level);
            else if (q.kind === 'seal') state = raiseField(state, where, q.level, HATCH);
            else if (q.kind === 'unseal') state = dropField(state, where, q.level, HATCH);
            else state = sweep(state, where);
        });
        ports.logMessage({pour: `You spill it across the ${LEVELS[q.level]}.`, light: `Your lamp flame catches the stock on the ${LEVELS[q.level]}.`,
            douse: `You soak the ${LEVELS[q.level]} with spring water.`,
            seal: `You bar the hatch above the ${LEVELS[q.level]}.`, unseal: `You lift the bar from the hatch above the ${LEVELS[q.level]}.`, sweep: 'You sweep the ash and spilled stock out.'}[q.kind]);
        return q;
    }
    // Journeys and idle deliver whole minutes through the registry tick (AD15-AD17); there is no
    // second clock. advance() stops at settle, so long absences are cheap and capped.
    function tick(minutes) {
        const n = Math.round(minutes);
        if (!ports || !ports.writable() || !(n > 0) || !Object.keys(state.places).length) return;
        const where = here(), before = readPlace(state.places[where], where);
        const result = advance(state, n, {ventFor: ports.ventilation ?? ventOf, watch: where, rain: ports.raining?.() === true});
        state = result.state;
        const after = readPlace(state.places[where], where);
        if (before?.burning && !after?.burning) ports.logMessage('The fire here burns itself out.');
        else if (!before?.burning && after?.burning) ports.logMessage('Fire has taken hold here.');
        if ((before?.smoke ?? 0) < SMOKE_THICK && (after?.smoke ?? 0) >= SMOKE_THICK) ports.logMessage('Smoke hangs thick under the roof.');
        // The layer reads the person's exposure and hands the host a bounded harm; it owns no body.
        const harm = harmOf(result.exposure);
        if (ports.harm && (harm.health || harm.stamina)) {
            ports.harm(harm);
            ports.logMessage(result.exposure.fell ? 'Burning boards crash down on you.' : result.exposure.burning ? 'The flames scorch you.' : 'The fumes leave you winded.');
        }
        ports.refreshPanel?.();
    }
    function project() {
        const where = ports?.location?.();
        const burningElsewhere = Object.keys(state.places).filter(id => id !== where && state.places[id].levels.some(l => l.fire));
        return {place: where ?? null, here: where ? readPlace(state.places[where], where) : null, floor: floorReading(state.places[where]), burningElsewhere, materials: ports ? materials() : [],
            ignition: !!ports?.ignitionSource?.(), places: Object.keys(state.places)};
    }
    const domain = Object.freeze({id: 'fields', deps: [], initialState: () => null,
        save: () => Object.keys(state.places).length ? structuredClone(state) : undefined,
        validate: slice => validateFields(upgradeFields(slice)),
        // Old saves have no slice: no fields, no invented history (compat decision 2026-10-17).
        migrate: slice => slice == null ? fresh() : structuredClone(upgradeFields(slice)),
        load: setState, tick, commands: {quote, execute}, projection: project,
        configure: p => { ports = p; bindLight(p); }, getState: () => state, setState});
    // Fire is light: a burning place lights its floor through the hero's existing light-source seam.
    const bindLight = p => p.bindLightSource?.(() => floorReading(state.places[p.location?.()]).light);
    const domainConfigure = p => { ports = p; bindLight(p); };
    if (operations) domainConfigure(operations);
    return domain;
}
