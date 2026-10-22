import {homeBenefits} from '../home_model.js';
// Original balance proposals inspired by Proto23's local furnishing bonuses.
// Read existing ownership only. Never serialize this projection or install it
// into accumulated stat/XP bonuses: rebuilding it is intentionally idempotent.
import {homeFurnishingFacts} from '../home_furnishing_facts.js';
import {PROTO23_IDS as P, PROTO23_LOCATIONS as L, PROTO23_KEYS as K} from '../proto23_world_ids.js';

const positiveCount = value => Number.isSafeInteger(value) && value > 0 ? value : 0;
const completed = (state, id) => positiveCount(state.actors?.player?.completed?.[id]) > 0;
const percent = value => `${Math.round((value - 1) * 10000) / 100}%`;
const bookId = key => {try {return JSON.parse(key).id;} catch {return null;}};

function heldCount(state, inventory, key) {
    const borrowed = Object.values(state.simulation?.custody || {}).filter(row =>
        (row.key === key || row.itemKey === key) && row.holder === 'player' && row.owner !== 'player')
        .reduce((sum, row) => sum + positiveCount(row.count), 0);
    return Math.max(0, positiveCount(inventory[key]) - borrowed);
}

/**
 * Inputs are snapshots of existing native owners, never a new save namespace.
 * nativeInventory/chestInventory use exact inventory keys -> integer counts
 * (readInventoryOwner), bookStats uses native BookData rows. housingAccessible
 * must reflect BOTH location access and housing availability at this location.
 */
export function furnitureProjection({state = {}, locationId, housingAccessible = false,
    nativeInventory = {}, chestInventory = {}, bookStats = {}, context = {}, residences = null, residenceContext = null} = {}) {
    const world = state.actors?.player?.worldId;
    const frontier = world === 'base.frontier';
    const cottage = world === P.world && locationId === L.cottage;
    const nativeHome = frontier && housingAccessible === true;
    const atShack = frontier && locationId === 'Shack';
    const rows = [];
    const add = (id, name, active, bonuses, scope, detail) => rows.push({id, name, active, bonuses, scope, detail});
    if(nativeHome) add('native.bedding', 'Native sleeping place', true,
        {xp: {Sleeping: 1.05}, rest: 1.05}, locationId, 'Available housing improves ordinary rest and sleep recovery.');

    // Books must be both finished and physically owned. Copies do not multiply
    // a learned work, borrowed copies do not supply a permanent home collection.
    const ownedBooks = new Set();
    for(const key of Object.keys(nativeInventory)) if(heldCount(state, nativeInventory, key) > 0) ownedBooks.add(bookId(key));
    for(const [key, count] of Object.entries(nativeHome ? chestInventory : {})) if(positiveCount(count)) ownedBooks.add(bookId(key));
    const readBooks = [...ownedBooks].filter(id => {
        const book = bookStats[id];
        return book && Number.isFinite(book.required_time) && book.required_time > 0 &&
            Number.isFinite(book.accumulated_time) && book.accumulated_time >= book.required_time;
    }).length;
    if(readBooks && (nativeHome || cottage)) add('native.read_books', 'Read-book collection', true,
        {xp: {Literacy: 1 + Math.min(10, readBooks) * 0.01}}, cottage ? L.cottage : locationId,
        `${readBooks} distinct finished, owned ${readBooks === 1 ? 'book' : 'books'}; +1% Literacy XP each, capped at +10%.`);

    const home = homeFurnishingFacts(state, context);
    if(home['homeFurnishings.rackBuilt']) add('shack.drying_rack', 'Workshop drying rack', atShack,
        {xp: {Regeneration: 1.02}}, 'Shack', 'A dry, ventilated workshop supports recovery; existing drying jobs retain their costs and duration.');
    if(home['homeFurnishings.benchBuilt']) add('shack.drafting_bench', 'Fixed-stop drafting bench', atShack,
        {xp: {Literacy: 1.03}}, 'Shack', 'A finished drafting bench supports careful native reading.');

    const facts = state.worlds?.[P.world]?.facts || {};
    const site = state.simulation?.sites?.[P.site];
    const rights = state.proto23Village?.schema === 1 && state.actors?.player?.facts?.['proto23.cottageRight'] === true &&
        completed(state, 'proto23.cottage_agreement') && site?.capacity === 1 &&
        state.simulation?.claims?.['proto23.cottage_right']?.owner === 'player' &&
        state.simulation.claims['proto23.cottage_right'].status === 'settled';
    for(const [fixture, name, bonuses, detail] of [
        ['bed', 'Proto23 plain bed', {rest: 1.08}, 'Improves ordinary rest recovery here. The selected four-minute bed job keeps its disclosed recovery.'],
        ['hearth', 'Proto23 cottage hearth', {xp: {Regeneration: 1.03}}, 'Your sheltered hearth station supports recovery; existing drying still spends actual fuel.'],
        ['bookstand', 'Proto23 bookstand', {xp: {Literacy: 1.03}}, 'Supports native reading here; remembered lessons are not new books.'],
    ]) if(!(fixture==='bed'&&residences?.properties.proto?.fixtures.bed)&&rights && facts[`proto23.${fixture}Installed`] === true && completed(state, `proto23.install_${fixture}`) &&
        state.simulation?.claims?.[`proto23.fixture.${fixture}`]?.owner === 'player' &&
        state.simulation.claims[`proto23.fixture.${fixture}`].status === 'settled')
        add(`proto23.${fixture}`, name, cottage, bonuses, L.cottage, detail);

    if(completed(state, 'proto23.home_kit') && heldCount(state, nativeInventory, K.kit))
        add('proto23.home_kit', 'Prepared home survey kit', frontier, {xp: {'Crafting mastery': 1.02}},
            'the home world while carried', 'Your completed notebook-to-kit adaptation and actual held kit aid related crafting. Spare copies do not stack.');
    if(nativeHome) add('native.storage', 'Home chest', true, {storageAccess: true}, locationId,
        'Existing shared chest access; native storage remains unlimited.');

    if(residenceContext) rows.push(...homeBenefits(residences,residenceContext).rows);
    const total = {xp: {}, rest: 1, storageAccess: false};
    for(const row of rows.filter(row => row.active)) {
        for(const [skill, multiplier] of Object.entries(row.bonuses.xp || {})) total.xp[skill] = (total.xp[skill] || 1) * multiplier;
        total.rest *= row.bonuses.rest || 1;
        total.storageAccess ||= row.bonuses.storageAccess === true;
    }
    return {rows, total, readBooks};
}

export function furnitureSkillMultiplier(projection, skillId) {return projection.total.xp[skillId] || 1;}
export function furnitureRecovery(projection, amount) {
    if(!Number.isFinite(amount) || amount < 0) throw Error('Furniture recovery needs a finite nonnegative amount.');
    return amount * projection.total.rest;
}
export function furnitureBonusText(row) {
    const parts = Object.entries(row.bonuses.xp || {}).map(([skill, multiplier]) => `+${percent(multiplier)} ${skill} XP`);
    if(row.bonuses.rest) parts.push(`+${percent(row.bonuses.rest)} ${row.id === 'native.bedding' ? 'rest/sleep' : 'ordinary rest'} recovery`);
    if(row.bonuses.storageAccess) parts.push('shared chest access');
    return `${parts.join('; ')}. ${row.active ? 'Active here' : `Active at ${row.scope}`}. ${row.detail}`;
}

/** Public Here-panel section; only owned, earned and public fixture labels. */
export function furniturePresentation(input) {
    const projection = furnitureProjection(input);
    return {visible: projection.rows.length > 0, sections: projection.rows.length ? [{id: 'absorb_b.furniture',
        label: 'Furniture and home comforts', description: 'Local passive bonuses · proposed balance', actions: [],
        records: projection.rows.map(row => ({id: row.id, at: input.state.clock, basis: null,
            text: `${row.name}: ${furnitureBonusText(row)}`}))}] : []};
}

/** Append these terms where existing native item descriptions are shown. */
export function furnitureItemBonusText(itemId) {
    return ({
        'Proto23 plain bed': 'Once installed in your cottage: +8% ordinary rest recovery.',
        'Proto23 cottage hearth': 'Once installed in your cottage: +3% Regeneration XP; selected drying still spends fuel.',
        'Proto23 bookstand': 'Once installed in your cottage: +3% Literacy XP.',
        'Prepared survey kit': 'After your completed Proto23 notebook adaptation, carrying an owned kit in the home world gives +2% Crafting mastery XP. Copies do not stack.',
    })[itemId] || '';
}

/** Original comfort description, derived from earned local fixture rows only.
 * No price score, save field, universal stat or construction rule is introduced.
 * P03's sleeping consumer applies this once alongside the existing rest bonus.
 */
export function furnitureComfort(projection) {
    const weights = {'native.bedding': 1, 'shack.drying_rack': 1, 'shack.drafting_bench': 1,
        'proto23.bed': 2, 'proto23.hearth': 2, 'proto23.bookstand': 1};
    const fixtures = [...new Set(projection.rows.filter(row => row.active && (row.comfortWeight||weights[row.id])).map(row => row.id))];
    const score = fixtures.reduce((n, id) => n + (projection.rows.find(row=>row.id===id).comfortWeight||weights[id]), 0);
    return {score, fixtures, label: score >= 4 ? 'Lived-in' : score >= 2 ? 'Settled' : score ? 'Simple shelter' : 'Unfurnished'};
}
