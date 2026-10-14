// Read-only: decode a YAIR-UTF8-1 export or JSON save and print the FA10/FA13-relevant state.
import {readFileSync} from 'node:fs';
export function decode(path) {
    const raw = readFileSync(path, 'utf8').trim();
    if (raw.startsWith('{')) return JSON.parse(raw);
    return JSON.parse(Buffer.from(raw.slice('YAIR-UTF8-1:'.length), 'base64').toString('utf8'));
}
export function summary(d, pattern = /boh|nethack|fieldcraft|assay|feature_objects|absorption/i) {
    const e = d.expansion;
    return {
        name: d.character?.name, money: d.character?.money, location: d['current location'] ?? d.current_location,
        clock: e.clock, sequence: e.sequence,
        inventory: d.inventories?.person?.main_character ?? d.character?.inventory,
        facts: Object.fromEntries(Object.entries(e.actors.player.facts).filter(([k]) => pattern.test(k))),
        completed: Object.fromEntries(Object.entries(e.actors.player.completed || {}).filter(([k]) => pattern.test(k))),
        jobs: e.simulation.jobs.map(j => ({id: j.id, commandId: j.commandId, due: j.due})),
        conditions: e.simulation.conditions?.player,
        playerStamina: d.character?.stats?.stamina ?? d.character?.full_stats?.stamina,
    };
}
if (import.meta.url === `file://${process.argv[1]}`) {
    const d = decode(process.argv[2]);
    if (process.argv[3] === '--keys') console.log(Object.keys(d), Object.keys(d.character || {}));
    else console.log(JSON.stringify(summary(d), null, 1));
}
