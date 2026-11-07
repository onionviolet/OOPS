// LOTM source for the groups projection (lane F step 1). Read-only. Two kinds of record, both authored proposals:
//  - the church team the lead's entry profile belongs to (same mapping as book_world_lotm_positions.js; the member entry
//    points at the FD15 position row, which keeps the term), and
//  - each loaded city pack's hidden gathering, marked hidden until a knowing owner exists. Seats are counted, never named:
//    personas stay behind their seats and the pack's label is not copied (sealed-secret rule).
import {LOTM_IDS as I} from './book_world_lotm_ids.js';
import {LOTM_PROFILES} from './book_world_lotm_lives.js';
import {districtById} from './book_world_lotm_districts.js';
import {lotmPositions} from './book_world_lotm_positions.js';
import {getCities} from './book_world_lotm_cities.js';
import {registerGroupSource} from './organizations.js';

const teamOf = home => (home === 'evernight' ? 'Nighthawks' : districtById(home)?.team || home);

export function lotmGroups(state) {
    if (state?.actors?.player?.worldId !== I.world || !state.lotm) return [];
    const out = [], profile = Object.values(LOTM_PROFILES).find(p => p.id === state.lotm.entryProfile);
    if (profile?.home) {
        const mine = lotmPositions(state), team = teamOf(profile.home);
        out.push({id: `${I.world}.group.team.${profile.home}`, world: I.world, kind: 'church_cell', name: team, status: 'active', authored: true, revision: 1,
            members: mine.map(r => ({actor: 'player', positionId: r.id, rank: r.rank, status: 'active'})),
            sources: [{module: 'book_world_lotm_lives.js', locator: `LOTM_PROFILES.${profile.key}`}]});
    }
    for (const c of getCities()) {
        const g = c.gathering;
        if (!g) continue;
        out.push({id: `${I.world}.group.gathering.${g.id}`, world: I.world, kind: 'secret_society', status: 'active', authored: true, revision: 1, hidden: true,
            members: g.seats.map(s => ({seatId: s.id})),
            meeting: {everyDays: g.schedule.everyDays, offset: g.schedule.offset, hour: g.schedule.hour, secrecy: g.dial.secrecy},
            sources: [{module: 'gatherings.js', locator: `private_packs city ${c.region.id}`}]});
    }
    return out;
}
registerGroupSource(I.world, lotmGroups);
