// Coverage case module for LOTM derived formulas (PWC21, tier: derived). Case id `lotm.derived.<pathway>_<seq>` brews the
// derived row (src/lotm_derived_formulas.js) through the same brew law and stock path as the brew-pack rows. Kept apart from
// brew_coverage_cases.js so the derived tier never routes through LOTM_BREW_ROWS (PWC20).
import {lotmCase} from './brew_coverage_cases.js';
import {derivedBrewRow, parseDerivedId} from '../lotm_derived_formulas.js';

export function coverageCase(id) {
    const m = /^lotm\.derived\.(.+)$/.exec(id);
    const at = m && parseDerivedId(m[1]);
    if (!at) throw new Error(`Unknown LOTM derived case ${id}.`);
    const row = derivedBrewRow(at.pathway, at.seq);
    return {...lotmCase(row.id, {}, row), basis: 'derived'};
}
