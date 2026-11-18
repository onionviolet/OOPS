// The local LOTM cast pack (gitignored private_packs/) is rebuilt from sources and can be missing the Klein KJ3 layer
// (kj3o cup, kj3p drink, kj3aa Anna session acts, householdActs.requiredPeople). Tests that need those rows check the
// pack's contents here and skip with the named gap instead of failing on a pack that cannot provide them (2026-11-18:
// the pack rebuilt 2026-11-16 held 551 household acts and none of them; every checkout with private_packs failed).
import {existsSync, readFileSync} from 'node:fs';

const file = new URL('../../private_packs/lotm-cast/cast.json', import.meta.url);

export function readCastPack() {
    return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null;
}

/** null when the pack provides every named act id (and, with people, requires them); else the reason to skip. */
export function castPackGap(source, {acts = [], people = []} = {}) {
    if (!source) return 'Requires the local LOTM cast pack';
    const have = new Set((source.householdActs?.acts || []).map(a => a.id));
    const missing = acts.filter(id => !have.has(id));
    const required = source.householdActs?.requiredPeople || [];
    const unrequired = people.filter(id => !required.includes(id));
    if (!missing.length && !unrequired.length) return null;
    return `The local LOTM cast pack lacks the KJ3 layer this test needs (${[...missing, ...unrequired.map(p => `requiredPeople ${p}`)].join(', ')}); rebuild it with the place-act step`;
}
