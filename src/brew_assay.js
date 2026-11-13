// Read a real serving by instrument or by scent. The knowledge pack owns
// who can use the resulting observation.
import {natural, positive} from './basics.js';
import {brewDoseContents, brewDoseQuantity, brewFlaskStamp, brewLotRevision, brewMeasureQuantity} from './engine_brew_stock.js';
import {storedBrewDose} from './brew_law.js';
import {followsServingVolume, isProcessPhase, matchesFraction} from './craft_process_separation.js';
import {defineWorkingLaw} from './kernel_working.js';
import {KNOWLEDGE_KINDS} from './knowledge_record.js';

const roles = {flask: 'flask', instrument: 'instrument', observer: 'body'};
const lotRoles = {lot: 'lot', instrument: 'instrument', observer: 'body'};
const scentRoles = {flask: 'flask', observer: 'body'};
export const brewStripQuantity = 'stock:brew-assay-strip';

function assess(sample, instrument, observer, {part, resolution}) {
    if (!observer.holder || !observer.place || [sample, instrument].some(h => !h.holder || h.place !== observer.place))
        return {ok: false, reason: 'assay-out-of-reach'};
    if (!positive(instrument.quantities[brewStripQuantity])) return {ok: false, reason: 'assay-strip-unavailable'};
    if (!positive(resolution) || !instrument.properties.assay_parts?.includes(part))
        return {ok: false, reason: 'instrument-cannot-read-constituent'};
    return {ok: true, cost: {op: 'add', holder: instrument.holder, quantity: brewStripQuantity, amount: -1}};
}

export const BREW_ASSAY_LAW = defineWorkingLaw({id: 'b.assay', revision: 1, operations: {
    smell: {roles: scentRoles, minutes: 1, settle({bound: {flask, observer}, options, at}) {
        if (!observer.holder || !observer.place || !flask.holder || flask.place !== observer.place)
            return {ok: false, reason: 'aroma-out-of-reach'};
        const {id, part, minimum} = options;
        if (!positive(minimum) || typeof part !== 'string' || !part)
            return {ok: false, reason: 'aroma-profile-unavailable'};
        if (observer.properties.mind_awake === false || !observer.properties.senses?.includes('smell') ||
            flask.properties.brew_sealed === true) return {ok: true, observed: {detected: false}};
        const {dose: {contents}} = storedBrewDose(brewDoseContents(flask), flask.brewStorage, at);
        if (!Object.hasOwn(contents, part) || contents[part] < minimum) return {ok: true, observed: {detected: false}};
        const note = (observer.properties.brew_aroma_associations ?? []).filter(name => flask.quantities[`scent:${name}`] > 0)
            .sort((a, b) => flask.quantities[`scent:${b}`] - flask.quantities[`scent:${a}`] ||
                (a < b ? -1 : a > b ? 1 : 0))[0];
        if (!note) return {ok: true, observed: {detected: false}};
        return {ok: true, effects: [
            {op: 'publish', kind: KNOWLEDGE_KINDS.learn, place: observer.place, by: flask.holder, detail: {knowledge: {
                to: observer.holder, record: {id, subject: {kind: 'fact', id}, true: {holder: flask.holder, quantity: `scent:${note}`},
                    believed: {value: note}, source: {kind: 'observation', by: observer.holder, from: flask.holder, at}},
            }}},
        ], observed: {detected: true, note}};
    }},
    measure: {roles, minutes: 2, settle({bound: {flask, instrument, observer}, options, at}) {
        const access = assess(flask, instrument, observer, options);
        if (!access.ok) return access;
        const {id, part, resolution, phase} = options;
        const quantity = brewDoseQuantity(part);
        const stock = brewDoseContents(flask);
        const packet = flask.brewFraction;
        if (phase !== undefined && (!packet || !isProcessPhase(phase) || !instrument.properties.assay_phases?.includes(phase)))
            return {ok: false, reason: 'assay-phase-unavailable'};
        const usablePacket = packet && matchesFraction(packet, stock) ? packet : null;
        if (phase !== undefined && !usablePacket) return {ok: false, reason: 'assay-phase-stock-changed'};
        const phases = usablePacket?.constituents.filter(row => row.id === part && row.amount > 0);
        const {dose: {contents}} = storedBrewDose(stock, flask.brewStorage, at);
        // Phase assays read physical stock before ageing is applied to a draw.
        const measured = phase === undefined ? (Object.hasOwn(contents, part) ? contents[part] : 0) :
            phases.reduce((amount, row) => amount + (row.phase === phase ? row.amount : 0), 0);
        const value = Math.floor(measured / resolution) * resolution;
        return {ok: true, effects: [
            access.cost,
            ...(phase === undefined ? [{op: 'publish', kind: KNOWLEDGE_KINDS.learn, place: observer.place, by: instrument.holder, detail: {knowledge: {
                to: observer.holder, record: {id, subject: {kind: 'fact', id}, true: {holder: flask.holder, quantity}, believed: {value},
                    source: {kind: 'observation', by: observer.holder, from: instrument.holder, at}},
            }}}] : []),
        ], observed: {part, atLeast: value, below: value + resolution,
            flask: flask.holder, observer: observer.holder,
            ...(!packet || usablePacket ? {stamp: brewFlaskStamp(stock, packet, flask.brewOrigins, flask.brewStorage)} : {}),
            total: Object.values(stock).reduce((sum, amount) => sum + amount, 0),
            ...(phase !== undefined ? {phase} : {}),
            ...(usablePacket ? {volume: usablePacket.volume, followsVolume: phases.length === 1 && followsServingVolume(phases[0].phase)} : {})}};
    }},
    'measure-panel': {roles, minutes: 2, settle({bound: {flask, instrument, observer}, options, at}) {
        const {id, resolution, parts} = options;
        if (typeof id !== 'string' || !id || !Array.isArray(parts) || !parts.length ||
            !parts.every(part => typeof part === 'string' && part) || new Set(parts).size !== parts.length)
            return {ok: false, reason: 'assay-panel-unavailable'};
        for (const part of parts) {
            const access = assess(flask, instrument, observer, {part, resolution});
            if (!access.ok) return access;
        }
        if (instrument.quantities[brewStripQuantity] < parts.length)
            return {ok: false, reason: 'assay-strip-unavailable'};
        const stock = brewDoseContents(flask);
        const {dose: {contents}} = storedBrewDose(stock, flask.brewStorage, at);
        const quantitativeOnly = instrument.properties.assay_quantitative_only === true;
        const bounds = Object.fromEntries(parts.map(part => {
            const measured = Object.hasOwn(contents, part) ? contents[part] : 0;
            const atLeast = Math.floor(measured / resolution) * resolution;
            const upper = Math.min(Number.MAX_SAFE_INTEGER, atLeast + resolution - 1);
            if (quantitativeOnly) return [part, [atLeast, upper]];
            return [part, measured ? [Math.max(1, atLeast), upper] : [0, 0]];
        }));
        return {ok: true, effects: [
            {op: 'add', holder: instrument.holder, quantity: brewStripQuantity, amount: -parts.length},
            ...Object.entries(bounds).map(([part, range]) => {
                const quantity = brewDoseQuantity(part);
                const recordId = `${id}:${quantity}`;
                return {op: 'publish', kind: KNOWLEDGE_KINDS.learn, place: observer.place, by: instrument.holder, detail: {knowledge: {
                    to: observer.holder, record: {id: recordId, subject: {kind: 'fact', id: recordId}, true: {holder: flask.holder, quantity},
                    believed: {value: range[0]}, source: {kind: 'observation', by: observer.holder, from: instrument.holder, at}},
                }}};
            }),
        ], observed: {id, observer: observer.holder, flask: flask.holder, bounds,
                ...(!quantitativeOnly ? {complete: Object.keys(contents).every(part => Object.hasOwn(bounds, part)),
                    constituentCount: Object.keys(contents).length} : {}),
                total: Object.values(stock).reduce((sum, amount) => sum + amount, 0),
                stamp: brewFlaskStamp(stock, flask.brewFraction, flask.brewOrigins, flask.brewStorage),
                reading: brewFlaskStamp(contents)}};
    }},
    'measure-lot': {roles: lotRoles, minutes: 2, settle({bound: {lot, instrument, observer}, options}) {
        const access = assess(lot, instrument, observer, options);
        if (!access.ok) return access;
        const {part, resolution} = options;
        if (!positive(lot.quantities[brewMeasureQuantity])) return {ok: false, reason: 'assay-lot-empty'};
        if (!positive(instrument.properties.assay_resolution) || resolution < instrument.properties.assay_resolution || resolution > 1000)
            return {ok: false, reason: 'assay-resolution-unavailable'};
        const constituents = lot.properties.constituents ?? {};
        const fraction = Object.hasOwn(constituents, part) ? constituents[part] : 0;
        if (!natural(fraction) || fraction > 1000) return {ok: false, reason: 'assay-constituent-invalid'};
        const atLeast = Math.floor(fraction / resolution) * resolution;
        return {ok: true, effects: [access.cost], observed: {lot: lot.holder, observer: observer.holder, part,
            atLeast, below: atLeast + resolution, compositionRevision: lot.properties[brewLotRevision] ?? null,
            ...(typeof lot.origin === 'string' && lot.origin ? {origin: lot.origin} : {})}};
    }},
}});

export function brewAssayMethod(options) {
    return {id: options.id, revision: 1, law: BREW_ASSAY_LAW.ref, roles,
        steps: [{op: 'measure', bindings: {flask: 'flask', instrument: 'instrument', observer: 'observer'}, options}]};
}

export function brewPanelAssayMethod(options) {
    return {id: options.id, revision: 1, law: BREW_ASSAY_LAW.ref, roles,
        steps: [{op: 'measure-panel', bindings: {flask: 'flask', instrument: 'instrument', observer: 'observer'}, options}]};
}

export function brewLotAssayMethod(options) {
    return {id: options.id, revision: 1, law: BREW_ASSAY_LAW.ref, roles: lotRoles,
        steps: [{op: 'measure-lot', bindings: {lot: 'lot', instrument: 'instrument', observer: 'observer'}, options}]};
}

export function brewScentMethod(options) {
    return {id: options.id, revision: 1, law: BREW_ASSAY_LAW.ref, roles: scentRoles,
        steps: [{op: 'smell', bindings: {flask: 'flask', observer: 'observer'}, options}]};
}
