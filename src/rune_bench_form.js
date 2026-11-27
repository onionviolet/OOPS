// PS250/PS251: the Village Rune bench in the shared bench form (src/ui/bench_form.js). Pure: the bench's own view
// (pledges_domain runes: grammar runes, capacity, release, worn tablet, the pairs this life has tried) and the strip
// being chosen in, the five parts out. A pairing this life has not tried reads "untried", never its effect (MR1, KNW1):
// the grammar acts whether known or not, and only carving shows it.
import {TALISMAN_MINUTES, runeGrammar} from './pledges_content.js';
import {readPair} from './rune_grammar.js';
import {formatDuration} from './number_format.js';
import {nextRows} from './making_next.js';

const cap = s => s[0].toUpperCase() + s.slice(1);

// MKC5: where what this bench made can go now. `charged` is the worn charged strip; `routes` is {found, open} (making_next.js).
// No routes, no Next part: a caller that only previews the strip keeps the five parts.
export function runeBenchNext(r, charged, routes) {
    const worn = r.talisman && r.minutesLeft > 0;
    return nextRows([
        worn && {label: 'Fight while the tablet is worn', fact: `${formatDuration(r.minutesLeft)} left`, panel: 'local-actions'},
        charged?.charges > 0 && {label: 'Fight with the charged strip', fact: `${charged.charges} of ${charged.maxCharges} charges`, panel: 'local-actions'},
        (worn || charged) && {label: 'Work the blade you fight with', fact: 'forge, temper or reforge it at the gear workshop', panel: 'gear-workshop',
            reason: 'Visit a forge to work on gear.'},
    ], routes);
}

export function runeBenchForm(r, strip, wood, {charged = null, routes = null} = {}) {
    const gross = strip.length * r.perRune, covered = Math.min(gross, r.release.talisman || 0), spend = gross - covered;
    const pairs = strip.slice(1).map((b, i) => ({a: strip[i], b, effect: r.knownPair(strip[i], b)}));
    const worn = r.talisman && r.minutesLeft > 0;

    const inputs = strip.map((rune, i) => ({label: `${i + 1}. ${cap(rune)}`, fact: i ? `reads after ${cap(strip[i - 1])}` : 'reads first', data: {benchRune: rune}}));
    if (strip.length) inputs.push({label: 'Wood tablet', fact: `${gross} wood needed, one per rune`, from: `you carry ${wood}`, state: wood < spend ? 'blocked' : ''});

    const clashes = pairs.filter(p => p.effect === 'fizzle').map(p => ({label: `${cap(p.a)} → ${cap(p.b)}`, fact: `pull against each other: ${r.effectText.fizzle}`, state: 'blocked'}));
    if (worn && strip.length) clashes.push({label: 'Your worn tablet', fact: `comes off with ${r.minutesLeft} min left`, from: covered ? `its wood covers ${covered}` : ''});

    const known = pairs.filter(p => p.effect).length;
    const chance = pairs.map(p => ({label: `${cap(p.a)} → ${cap(p.b)}`, fact: p.effect ? r.effectText[p.effect] ?? p.effect : 'untried',
        from: p.effect ? 'you have carved this pairing' : 'an unlearned pairing may fizzle', state: p.effect ? '' : 'unknown', data: {benchPair: `${p.a}>${p.b}`}}));
    if (pairs.length) chance.unshift({label: `${known} of ${pairs.length} ${pairs.length === 1 ? 'pairing' : 'pairings'} known`, fact: known === pairs.length ? 'the result is certain' : 'a two-rune tablet shows what one pairing does'});

    const totals = {};
    for (const p of pairs) if (p.effect) totals[p.effect] = (totals[p.effect] || 0) + readPair(runeGrammar, p.a, p.b).power;
    const after = Object.keys(totals).map(effect => ({label: r.effectText[effect] ?? effect, fact: totals[effect] ? `power ${totals[effect]}` : '', from: `worn for ${formatDuration(TALISMAN_MINUTES)}`,
        state: effect === 'fizzle' ? 'blocked' : ''}));
    if (pairs.length > known) after.push({label: '?', fact: `${pairs.length - known} untried ${pairs.length - known === 1 ? 'pairing' : 'pairings'}`, from: 'shows once carved', state: 'unknown'});

    return {inputs, clashes, chance, after,
        capacity: {used: strip.length, max: r.maxLength, unit: 'runes', reason: `a wood tablet takes ${r.maxLength} runes in a row`},
        ...(routes && {next: runeBenchNext(r, charged, routes)}),
        cost: strip.length ? (covered ? `Replacing the worn tablet covers ${covered}; spend ${spend} wood` : `Spend ${spend} wood`) : ''};
}
