// Generic host for a Gu essence line (chat G phase 2b, PFP1). A row names a converter kind, its feeding
// window, the convert operation and a cast. Conversion numbers and the cast's ability come from the
// catalogue; the cast settles through the Gu working law on the kernel. Stock is the balance of the
// conversion and cast receipts, as the replaced scene module kept it (one authority: the counters).
import {quoteWorking} from './kernel_working.js';
import {guCatalogue} from './gu_catalogue.js';
import {asBoundGu, guMethods, guRef, guWorkingLaw} from './gu_working_law.js';

const conversionOf = row => guCatalogue[row.converter].conversion.value;
const abilityOf = row => guCatalogue[row.cast.kind].ability.value;
const spendOf = row => abilityOf(row).cost * (abilityOf(row).stageFuel?.[conversionOf(row).stage]?.costFactor ?? 1);
const strikeOf = row => abilityOf(row).effect.magnitude * (abilityOf(row).stageFuel?.[conversionOf(row).stage]?.magnitudeFactor ?? 1);

export const lineOperations = row => [row.feed.op, row.convert.op, row.cast.op];

export function lineView(state, row) {
    const facts = state.worlds[row.world]?.facts;
    const fedAt = facts?.[row.feed.key], lastCut = facts?.[row.cast.key];
    const done = op => state.actors.player.completed[`${row.id}.${op}`] ?? 0;
    const feeds = done(row.feed.op), conversions = done(row.convert.op), casts = done(row.cast.op);
    const stock = conversions * conversionOf(row).yield - casts * spendOf(row);
    if ((fedAt !== undefined) !== (feeds > 0) ||
        (fedAt !== undefined && (!Number.isSafeInteger(fedAt) || fedAt < 0 || fedAt > state.clock)) ||
        ((lastCut !== undefined) !== (casts > 0)) || (lastCut !== undefined && lastCut !== strikeOf(row)) ||
        !Number.isSafeInteger(stock) || stock < 0 || (conversions > 0 && feeds === 0)) {
        throw Error('The feeding and essence receipts disagree.');
    }
    return {fedAt, lastCut, stock, fed: fedAt !== undefined && state.clock - fedAt < row.feed.minutes};
}

export function lineActions(state, row, product, view) {
    const sound = state.actors.player.facts[row.cast.requiresFact] === true;
    return {[row.feed.op]: !!product && !view.fed, [row.convert.op]: !!product && view.fed,
        [row.cast.op]: sound && view.stock >= spendOf(row)};
}

export function applyLine(state, row, product, operation, nativeInventory) {
    const view = lineView(state, row);
    if (!lineActions(state, row, product, view)[operation]) throw Error('The Gu or its essence is no longer ready.');
    const facts = state.worlds[row.world].facts;
    if (operation === row.feed.op) facts[row.feed.key] = state.clock;
    if (operation === row.cast.op) {
        if (!(nativeInventory?.[row.cast.loanItem] > 0)) throw Error('Borrow the Gu before casting.');
        const {rank, stage} = conversionOf(row);
        const method = structuredClone(guMethods(row.cast.kind).activate);
        method.steps[0].options = {pool: row.cast.pool, rank, stage, source: row.cast.source};
        const specimen = {...row.cast.gu, kind: row.cast.kind, fedThrough: state.clock};
        const quote = quoteWorking(guWorkingLaw, method, {id: `${row.id}.cast`, at: state.clock,
            bindings: {gu: guRef(specimen.id), operator: {kind: 'operator', id: 'player'}},
            facts: {reserves: {player: {[row.cast.pool]: view.stock}}},
            ports: {read: ref => ref.kind === 'operator' ? ref : ref.id === specimen.id ? asBoundGu(specimen) : null}});
        if (!quote.ok || view.stock - quote.facts.reserves.player[row.cast.pool] !== spendOf(row)) {
            throw Error('The cast failed to form.');
        }
        facts[row.cast.key] = quote.effects[0].magnitude;
    }
    // The native conversion command spends the sealed input. Conversion and cast receipts are the balance.
}
