// LTU7 / RPX16 fight situation card: fight state in, figure spec and scene in. Leaf module: no DOM,
// no game state. It reads only the observer-safe opponent board (opponent_board.js) and the
// controlled actor's own exact numbers (AD8), so nothing here can show a fact the board hides.
// What it will not claim, by design (docs/representations/COMBAT.md):
//   - chances only one on one; with several opponents the native view gives ratings, not chances (UR40)
//   - intent is unassessed until an appraisal source exists (CBR14, LSD294); never guessed from speed
//   - the lethal line is a stated bound: hardest ordinary blow after your defense, crits excluded (LSD384)
//   - the ring is who is in the fight, not distance; native combat has no range data
import {letterFor, factShown, knowledgeOf} from '../opponent_board.js';
import {mitigateCombatDamage} from '../combat_math.js';

// The native roll is power x (0.8..1.2), rounded to a tenth, per strike (combat_math.rollBaseCombatDamage).
const HARDEST_ROLL = 1.2;
export function chanceWord(pct) {
    if (pct >= 95) return 'almost always';
    if (pct >= 75) return 'usually';
    if (pct >= 55) return 'more often than not';
    if (pct >= 45) return 'about half the time';
    if (pct >= 25) return 'sometimes';
    if (pct >= 6) return 'rarely';
    return 'almost never';
}
const factOf = (opp, label) => (opp.facts || []).find(f => f.label === label && factShown(f)) || null;
const pctOf = fact => fact ? Number(/(\d+(?:\.\d+)?)%/.exec(String(fact.value))?.[1]) : NaN;
const perSecond = fact => fact ? Number(/(\d+(?:\.\d+)?)/.exec(String(fact.value))?.[1]) : NaN;
// "12 dmg x2" -> {power: 12, count: 2}; null when the attack is not a shown fact.
export function attackOf(opp) {
    const fact = factOf(opp, 'Attack'), m = fact && /(\d+(?:\.\d+)?)\s*dmg(?:\s*x(\d+))?/.exec(String(fact.value));
    return m ? {power: Number(m[1]), count: m[2] ? Number(m[2]) : 1} : null;
}
// Hardest ordinary blow after your own defense layers. Crits are excluded and said so in the text.
export function hardestBlow(attack, you = {}) {
    if (!attack) return null;
    const one = Math.round(10 * HARDEST_ROLL * attack.power) / 10;
    return mitigateCombatDamage(Array(attack.count).fill(one), you.defense || 0, {floorShare: you.minDamageShare ?? .05, taken: you.damageTaken ?? 1});
}
const fmt = n => Number.isInteger(n) ? String(n) : n.toFixed(1);
const nameOf = (opp, kin) => kin > 1 ? `${opp.name} ${opp.letter}` : opp.name;

/**
 * board: fromCombatOpponentsProjection(...) or projectNativeOpponents(...) shape.
 * you:   {name, health: {current, max}, speed, defense, minDamageShare, damageTaken, sideSize}
 *        own exact numbers; sideSize is how many fighters stand on your side (allies change targeting).
 * place: words for the header.
 * Returns {active, spec, odds, lethal, tempo, summary}; spec is a figure spec (src/ui/figure.js).
 */
export function fightSituation(board, you = {}, {place = ''} = {}) {
    const opponents = board?.opponents || [];
    if (!opponents.length) return {active: false, spec: null, odds: null, lethal: [], tempo: null, summary: 'No fight right now.'};
    const kin = new Map(); for (const o of opponents) kin.set(o.name, (kin.get(o.name) || 0) + 1);
    const label = o => nameOf({...o, letter: o.letter || letterFor(o.slot ?? 0)}, kin.get(o.name));
    const standing = opponents.filter(o => !o.defeated), hp = you.health || {}, alone = (you.sideSize ?? 1) <= 1;

    // Odds in words, one on one only.
    let odds;
    if (standing.length === 1 && opponents.length === 1) {
        const o = standing[0], yours = pctOf(factOf(o, 'You hit them')), theirs = pctOf(factOf(o, 'Hit you')), evade = pctOf(factOf(o, 'Evade you'));
        const parts = [];
        if (Number.isFinite(yours)) parts.push(`you hit ${chanceWord(yours)} (${fmt(yours)}%)`);
        if (Number.isFinite(theirs)) parts.push(`${label(o)} hits you ${chanceWord(theirs)} (${fmt(theirs)}%)`);
        else if (Number.isFinite(evade)) parts.push(`${label(o)} evades you ${chanceWord(evade)} (${fmt(evade)}%)`);
        odds = parts.length ? {shown: true, text: `Odds: ${parts.join('; ')}.`} : {shown: false, text: 'Odds: not assessed for this opponent yet.'};
    } else {
        odds = {shown: false, text: `Odds: not shown as chances with ${opponents.length} opponents; the attack and evasion ratings are not chances.`};
    }

    // Lethal telegraph: a stated bound from shown attack and your exact health and defense.
    const lethal = [];
    let combined = 0, combinedKnown = true;
    for (const o of standing) {
        const blow = hardestBlow(attackOf(o), you);
        if (blow === null) { combinedKnown = false; continue; }
        combined += blow;
        if (Number.isFinite(hp.current) && blow >= hp.current) lethal.push({id: o.id, level: 'lethal', text: `Lethal: ${label(o)}'s hardest ordinary blow could take ${fmt(blow)} hp after your defense, and you have ${fmt(hp.current)}.`});
        else if (Number.isFinite(hp.current) && blow * 2 >= hp.current) lethal.push({id: o.id, level: 'heavy', text: `Heavy: ${label(o)}'s hardest ordinary blow could take ${fmt(blow)} of your ${fmt(hp.current)} hp.`});
    }
    // Together: only shown attacks count; an unassessed opponent makes it a lower bound.
    if (standing.length > 1 && combined > 0 && Number.isFinite(hp.current) && combined >= hp.current && !lethal.some(l => l.level === 'lethal'))
        lethal.push({id: null, level: 'lethal', text: `Lethal together: if ${combinedKnown ? `all ${standing.length}` : 'the assessed ones'} land their hardest ordinary blows before you recover, that is ${combinedKnown ? '' : 'at least '}${fmt(combined)} hp against your ${fmt(hp.current)}.`});

    // Text-first tempo: shown speeds against yours.
    const speeds = standing.map(o => ({o, s: perSecond(factOf(o, 'Speed'))})).filter(x => Number.isFinite(x.s) && x.s > 0);
    let tempo;
    if (Number.isFinite(you.speed) && you.speed > 0 && speeds.length) {
        const fastest = speeds.reduce((a, b) => b.s > a.s ? b : a), ratio = fastest.s / you.speed;
        tempo = ratio >= 1.15 ? `Tempo: ${label(fastest.o)} strikes about ${fmt(Math.round(ratio * 10) / 10)} times for each of your blows.`
            : ratio <= 1 / 1.15 ? `Tempo: you strike about ${fmt(Math.round(10 / ratio) / 10)} times for each of ${label(fastest.o)}'s blows.`
            : `Tempo: you and ${label(fastest.o)} strike at about the same pace.`;
    } else tempo = 'Tempo: not assessed yet.';
    const intent = 'Intent: no windups read yet; what each opponent plans next is unassessed.';

    const lethalIds = new Set(lethal.filter(l => l.level === 'lethal').map(l => l.id));
    const ring = {id: 'fight', label: 'In this fight (no range data)', radius: .82, count: opponents.length};
    const nodes = [{id: 'you', label: `${you.name || 'You'} ${Number.isFinite(hp.current) ? `${fmt(hp.current)}/${fmt(hp.max)} hp` : ''}`.trim(), glyph: 'Y', at: 'center', state: 'active'}];
    const edges = [];
    opponents.forEach((o, i) => {
        const known = knowledgeOf(o), state = o.defeated ? 'broken' : known === 'unknown' ? 'unknown' : lethalIds.has(o.id) ? 'strained' : undefined;
        const health = o.defeated ? 'down' : o.health && factShown({knowledge: o.health.knowledge, value: o.health.text}) ? o.health.text : '??? hp';
        nodes.push({id: `opp-${i}`, label: `${label(o)} · ${health}`, glyph: o.letter || letterFor(o.slot ?? i), ring: 'fight', index: i, ...(state ? {state} : {}), ...(state === 'strained' ? {effect: 'pulse'} : {})});
        if (!o.defeated) edges.push(alone ? {from: `opp-${i}`, to: 'you', kind: 'strikes'} : {from: `opp-${i}`, to: 'you', kind: 'strikes', label: 'target unread', state: 'unknown'});
    });
    const summary = `${place ? `${place}: ` : ''}${standing.length} of ${opponents.length} opponent${opponents.length === 1 ? '' : 's'} standing${Number.isFinite(hp.current) ? `; you have ${fmt(hp.current)} of ${fmt(hp.max)} hp` : ''}.`;
    const spec = {
        id: 'fight-situation', size: opponents.length > 2 ? 560 : 380, title: 'Fight situation', summary,
        rings: [ring], nodes, edges,
        notes: [
            ...lethal.map(l => ({state: 'strained', text: l.text})),
            {state: odds.shown ? 'active' : 'unknown', text: odds.text},
            {text: tempo},
            {state: 'unknown', text: intent},
        ],
        legend: [
            {state: 'active', label: 'you'}, {state: 'strained', label: 'could down you'}, {state: 'broken', label: 'down'},
            {state: 'unknown', label: 'not assessed'}, {kind: 'strikes', label: 'who strikes whom'},
        ],
    };
    return {active: true, spec, odds, lethal, tempo, intent, summary};
}

// Chase as stages (pursuit.js pursuitView). The pursuit model has stages, not distance, so the
// track has steps; a distance track waits for a world that models range (COMBAT.md, dial D2).
const CHASE_STAGES = [['following', 'Following you'], ['contact', 'Makes contact'], ['encounter', 'Face to face'], ['closed', 'Over']];
export function chaseSituation(view) {
    if (!view) return null;
    const at = CHASE_STAGES.findIndex(([status]) => status === view.status);
    return {
        id: `chase-${view.definitionId}`, size: 460, title: view.label, summary: view.text,
        tracks: [{id: 'stages', label: 'Pursuit', steps: CHASE_STAGES.map(([, label], i) => ({label, state: i < at ? 'done' : i === at ? (view.status === 'closed' ? 'done' : 'current') : 'pending'}))}],
        notes: [{state: 'unknown', text: 'Distance: not modelled here; stages only.'}, ...(view.expiresAt != null ? [{text: `The meeting request lapses at minute ${view.expiresAt}.`}] : [])],
    };
}
