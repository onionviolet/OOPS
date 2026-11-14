// Display-only. The Gu and Shadow Slave lives hold their own stock (and, for two, an essence reserve), not the native
// Village hero's purse: stock is native-inventory items under the life's own item ids (capability native-stock), essence
// is the life's energy in the simulation. Readers show those live values; the static text is the registry fallback.
// Nothing here is a price or spend path and nothing is saved.
import {registerOwnHoldings} from './own_holdings.js';
import {readPort} from './ui_ports.js';
import {keeperDiets} from './world_packs/book_gu_keeper.js';
import {KEEPER_DAY, KEEPER_PREFIX} from './world_packs/book_gu_keeper_ids.js';

const BODY = 'Your body here is not the Village hero\'s sheet.';
const LIVES = [
    {id: 'book.ss.apprentice', essence: 'essence', noun: 'essence', purse: '12 essence, no coin', items: 'a keepsake, a coat, gloves and two shards',
        labels: {donor: 'lattice keepsake', shard: 'soul shard', coat: 'coat', gloves: 'gloves'}},
    {id: 'book.ss.trial', purse: 'no coin; trial supplies only', items: 'trial supplies and one healing salve',
        labels: {supplies: 'trial supplies', salve: 'healing salve', fragment: 'trial fragment'}},
    {id: 'book.ss.company', purse: 'no coin; a survey stipend of badges', items: 'two gems, rations, rope, brace and bandages', stock: 'badge', stockNoun: 'stipend badge',
        labels: {gem: 'soul gem', ration: 'ration', rope: 'rope', brace: 'brace', bandage: 'bandage', badge: 'stipend badge'}},
    {id: 'book.ri.academy', essence: 'primeval', noun: 'primeval essence', purse: '6 primeval essence, no coin', items: 'petals and a bamboo practice piece',
        labels: {gu: 'Moonlight Gu', petals: 'petals', bamboo: 'bamboo piece', cut_bamboo: 'cut bamboo'}},
    {id: 'book.ri.keeper', essence: 'primeval', noun: 'primeval essence', purse: '3 primeval stones, 8 primeval essence', items: 'petals and a few Gu carriers', stock: 'stone', stockNoun: 'primeval stone',
        labels: {stone: 'primeval stone', petals: 'petals', dried: 'dried petals', lees: 'spirit lees', jade: 'raw jade shard'}},
];

// What the last ownRows() read about each thing: its own name and description, from the item itself.
const details = {};
function ownRows(life) {
    const rows = readPort('character')?.getItems?.() ?? {}, prefix = `${life.id}.`, out = {};
    for (const k of Object.keys(details)) delete details[k];
    for (const [key, row] of Object.entries(rows)) {
        let id; try { id = JSON.parse(key)?.id; } catch { continue; }
        if (typeof id !== 'string' || !id.startsWith(prefix) || id.length === prefix.length) continue;
        const count = row?.count ?? 1;
        if (count > 0) out[id.slice(prefix.length)] = (out[id.slice(prefix.length)] ?? 0) + count;
        if (count > 0 && row?.item) details[id.slice(prefix.length)] = {name: text(row.item.getName?.() ?? row.item.name), description: text(row.item.getDescription?.() ?? row.item.description)};
    }
    return out;
}
const text = value => typeof value === 'string' ? value.trim() : '';

export function bookLifeHoldingsReaders(life) {
    return {
        purse(state) {
            const energy = life.essence ? state?.simulation?.energies?.player?.[`${life.id}.${life.essence}`] : null;
            const e = typeof energy?.reserve === 'number' ? `${energy.reserve}${energy.policy?.capacity ? `/${energy.policy.capacity}` : ''} ${life.noun}` : null;
            const held = life.stock && readPort('character')?.getItems ? ownRows(life)[life.stock] ?? 0 : null;
            const stock = held === null ? null : `${held} ${life.stockNoun}${held === 1 ? '' : 's'}`;
            if (!e && !stock) return undefined;
            return [stock, e, life.stock === 'stone' ? null : 'no coin'].filter(Boolean).join(', ');
        },
        items() {
            // G7: one row per owned thing, named as the item names itself, with what it is for and, for a Gu, what it eats.
            return Object.entries(ownRows(life)).filter(([name]) => name !== life.stock).map(([name, n]) => {
                const known = details[name] ?? {}, label = (known.name || life.labels[name] || name.replace(/_/g, ' ')).replace(/ · carrier$/, '');
                const diet = keeperDiets.find(d => life.id === KEEPER_PREFIX && known.name === `${d.label} · carrier`);
                const eats = diet ? `Food: ${diet.foodLabel}, ${diet.perMeal} ${diet.interval / KEEPER_DAY === 1 ? 'a day' : `every ${diet.interval / KEEPER_DAY} days`}.` : '';
                return {label: `${label}${n > 1 ? ` x${n}` : ''}`, detail: eats || known.description || ''};
            });
        },
    };
}
export function registerBookLifeHoldings() {
    const offs = LIVES.map(life => registerOwnHoldings(`${life.id}.world`, {purse: life.purse, items: life.items, body: BODY}, bookLifeHoldingsReaders(life)));
    return () => offs.forEach(off => off());
}
