import {PARTY_HELPER} from './native_battle_contracts.js';

// One reading of who holds what. Pure: it reads the native bag, the open chest and the
// simulation inventories and custody that already exist, and writes nothing (O4, AR2).
const COMPANIONS = {[PARTY_HELPER]: 'Lio'};
export function itemName(key) {
    try {
        const v = JSON.parse(key);
        return `${v.id ?? 'Crafted item'}${v.quality != null ? ` (quality ${v.quality})` : ''}`;
    } catch { return 'Unknown item'; }
}

export function stockOwnerView({state, carried = {}, chest = null, equipment = {}, favorites = {}}) {
    const s = state?.simulation, custody = Object.entries(s?.custody || {});
    const equipped = new Set(Object.values(equipment.player || {}));
    const lent = key => custody.filter(([, c]) => c.owner === 'player' && c.key === key).map(([loanId, c]) => ({loanId, holder: c.holder, count: c.count}));
    const holders = [{id: 'player', kind: 'carried', label: 'Carried by you', transferable: true,
        rows: Object.entries(carried).filter(([, n]) => n > 0).map(([key, count]) => ({key, name: itemName(key), count,
            favorite: !!favorites[key], equipped: equipped.has(key), lentTo: lent(key),
            borrowedFrom: custody.filter(([, c]) => c.holder === 'player' && c.key === key).map(([loanId, c]) => ({loanId, owner: c.owner, count: c.count}))}))}];
    if(chest) holders.push({id: 'chest', kind: 'chest', label: 'This place’s chest', transferable: false,
        rows: Object.entries(chest).filter(([, n]) => n > 0).map(([key, count]) => ({key, name: itemName(key), count, favorite: false, equipped: false, lentTo: [], borrowedFrom: []}))});
    const here = s?.people.player?.location;
    for(const [id, name] of Object.entries(COMPANIONS)) {
        const who = s?.people[id];
        if(!who || who.inventory !== 'simulation' || who.life !== 'alive' || !s.owners[id] || who.location !== here || !state.actors.player.facts['party.met']) continue;
        holders.push({id, kind: 'companion', label: `${name}’s pack`, transferable: true, rows: Object.entries(s.owners[id]).filter(([, n]) => n > 0).map(([key, count]) => ({key, name: itemName(key), count,
            favorite: false, equipped: false, lentTo: [],
            borrowedFrom: custody.filter(([, c]) => c.holder === id && c.key === key).map(([loanId, c]) => ({loanId, owner: c.owner, count: c.count}))}))});
    }
    return {sequence: state?.sequence ?? 0, holders};
}
