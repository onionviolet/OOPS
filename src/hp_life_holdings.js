// Display-only. The HP school and trade lives hold their own units, debt and stock (not the Village hero's purse):
// units and debt are actor resources in the expansion state, the stock is in the native inventory under the life's own
// item ids (capability native-stock). These readers show those live values; the static text is the registry fallback.
import {registerOwnHoldings, lifeHoldings} from './own_holdings.js';
import {readPort} from './ui_ports.js';

const LIVES = [
    {id: 'book.hp.school', units: 'allowance', unit: 'allowance unit', owed: 'owed to the supply fund',
        purse: '8 allowance units, 4 owed to the supply fund', items: 'a wand and paper', labels: {wand: 'wand', paper: 'paper', practice_wand: 'borrowed practice wand', feather: 'feather', glass_shards: 'glass shards', glass_pane: 'glass pane'}},
    {id: 'book.hp.trade', units: 'coins', unit: 'trade unit', owed: 'rent owed',
        purse: '12 trade units, 6 rent owed', items: 'a wand and glass stock', labels: {wand: 'wand', glass_shards: 'glass fragments', glass_pane: 'repaired pane'}},
];
const BODY = 'Your body here is not the Village hero\'s sheet.';

export function hpLifeHoldingsReaders(life) {
    const resource = (state, name) => lifeHoldings(state).resources[`${life.id}.${name}`];
    return {
        purse(state) {
            const units = resource(state, life.units);
            if (typeof units !== 'number') return undefined;
            const debt = resource(state, 'debt') || 0;
            return `${units} ${life.unit}${units === 1 ? '' : 's'}, ${debt > 0 ? `${debt} ${life.owed}` : 'no debt'}`;
        },
        items() {
            const rows = readPort('character')?.getItems?.() ?? {}, prefix = `${life.id}.`, out = [];
            for (const [key, row] of Object.entries(rows)) {
                let id; try { id = JSON.parse(key)?.id; } catch { continue; }
                if (typeof id !== 'string' || !id.startsWith(prefix) || id.length === prefix.length) continue;
                const count = row?.count ?? 1, name = id.slice(prefix.length);
                if (count > 0) out.push(`${life.labels[name] ?? name.replace(/_/g, ' ')}${count > 1 ? ` x${count}` : ''}`);
            }
            return out;
        },
    };
}
export function registerHpLifeHoldings() {
    const offs = LIVES.map(life => registerOwnHoldings(`${life.id}.world`, {purse: life.purse, items: life.items, body: BODY}, hpLifeHoldingsReaders(life)));
    return () => offs.forEach(off => off());
}
