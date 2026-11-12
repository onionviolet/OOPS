// PG2 fixture consumer. The host supplies a world-owned founding row, its
// substrate snapshot and known group records. This proposes terms for an NPC;
// custody, posts and organization settlement still belong to their owners.
import {address} from './gen_kit.js';
import {MARKET_PACK, shelfQuote, stockOf} from './market_substrate.js';
import {assemble, freezeValue, generate, thawValue} from './procedural_grammar.js';
import {readQuantity} from './world_substrate.js';

const ineligible = (reason, why) => ({eligible: false, reason, ...(why ? {why} : {})});

/**
 * row names the site and shelf, a shortage threshold {units, reason}, the
 * founder's required {tag, coin, reason}, a fitted grammar, and optionally
 * a rival {id, reason} with an authored reason for the local conflict.
 */
export function proposeSociety(row, {root, world, founder, groups = []}) {
    const place = world.holders[row.place];
    if (place?.kind !== 'place') return ineligible('missing-place');

    const shelf = world.holders[row.shelf];
    if (shelf?.place !== place.id || !shelf.state?.[MARKET_PACK]) return ineligible('missing-cause', row.shortage.reason);
    const quote = shelfQuote(world, shelf.id);
    if (quote.par - quote.stock < row.shortage.units) return ineligible('missing-cause', row.shortage.reason);

    const person = world.holders[founder];
    if (person?.kind !== 'body' || !person.tags.includes('person')) return ineligible('missing-founder');
    if (person.place !== place.id || !person.tags.includes(row.founder.tag)) {
        return ineligible('ineligible-founder', row.founder.reason);
    }
    const coin = readQuantity(world, person.id, 'coin');
    if (coin === null || coin < row.founder.coin) return ineligible('missing-means', row.founder.reason);

    // The local founder can see the current shelf. The cause pins what was
    // available at this assessment, even if stock changes before a later read.
    const cause = {
        kind: 'pressure',
        id: address(row.world, row.id, place.id, shelf.id, {at: world.clock}),
        place: place.id, shelf: shelf.id, good: quote.good, at: world.clock,
        stock: quote.stock, par: quote.par, requiredShortfall: row.shortage.units,
        reason: row.shortage.reason,
    };
    const generated = generate(row.grammar, {root, address: address('society', cause.id, person.id), cause, maxAttempts: 1});
    if (generated.receipt.fallbackUsed && !assemble(row.grammar, generated.value.parts).ok) {
        return ineligible('invalid-grammar');
    }

    const stock = stockOf(quote.good);
    const holdings = readQuantity(world, person.id, stock) > 0 ? [{holder: person.id, quantity: stock}] : [];
    const rival = row.rival;
    const rivals = rival && groups.some(group => group.id === rival.id && group.world === row.world && group.status === 'active')
        ? [{group: rival.id, reason: rival.reason}] : [];
    return {
        eligible: true,
        proposal: {
            ...generated.value,
            address: generated.receipt.address,
            context: {world: row.world, place: place.id, founder: person.id, holdings, rivals},
        },
        receipt: generated.receipt,
    };
}

// P pins the grammar ref, parts and cause. The proposal adds the address and
// reference bindings to that value. The host owns when or whether to keep it.
export function freezeSociety(proposal) {
    return {...freezeValue(proposal), address: proposal.address, context: structuredClone(proposal.context)};
}

export function thawSociety(frozen, grammars) {
    const {value, receipt} = thawValue(frozen, grammars);
    return {
        proposal: {...value, address: frozen.address, context: structuredClone(frozen.context)},
        receipt,
    };
}
