#!/usr/bin/env node
// Interaction oracle (2026-11-18, proposal). Cases are built deterministically here (no model); Luna and Haiku are then asked
// for the expected resolution and the deciding rule, one request per case, behind one shared rule digest (AU16).
//   node scripts/interaction_oracle.mjs cases                      write private/oracle/cases.json, print counts
//   node scripts/interaction_oracle.mjs pass luna|haiku [--pilot] [runner flags]   --pilot = first 20 cases, use --sync
//   node scripts/interaction_oracle.mjs normalise                  write docs/coverage/interaction_oracle.jsonl, fixtures, report
// Raw replies stay in private/oracle (gitignored). Sources: EXTREME_ABILITIES_2026-11-18 (XA1-XA26) and
// MECHANISM_FOUNDATION_2026-11-18 (nine substrates, MF4 resolution, time substrate) on their branches.
import {mkdirSync, writeFileSync, readFileSync, existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {runPass} from './label_runner.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const DIR = path.join(root, 'private/oracle') + '/';
export const OUT = path.join(root, 'docs/coverage/interaction_oracle.jsonl');

// ---- seeded helpers (cases must be byte-stable) ----
function rng(seed) { let s = seed >>> 0; return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296); }
const shuffled = (arr, seed) => { const r = rng(seed), a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const cross = (...lists) => lists.reduce((acc, l) => acc.flatMap(a => l.map(b => [...a, b])), [[]]);

// ---- the 26 extreme abilities, one line of mechanism each (from the XA note) ----
export const XA = {
    XA1: ['Absorb a power', 'powers.move: an intake organ breaks a target power into a kit entry; source loses it if the intake is a move, keeps it if a copy; digest, tithe or echo variants'],
    XA2: ['Copy a power', 'powers.copy: built from workings the copier witnessed, so a half-seen power is a broken copy; one slot or shadow variants'],
    XA3: ['Negate a power', 'rules.block: a field laid over the target that makes one verb on one object fail while it holds; the power row stays intact; end the field and it returns'],
    XA4: ['Steal a power', 'powers.move with terms: the row moves with a lien the old holder can name; the thief takes the backing (item, name, debt, soul thread)'],
    XA5: ['Wish Upon the Stars', 'a router that names a target sentence and pays: checks feasible, charge left today, payment valid, in that order; a refused wish costs nothing'],
    XA6: ['Wish stabilization', 'repeated same-shape wishes past a threshold become a standing cheap technique row'],
    XA7: ['Time loop', 'time.restore: a restore point at the anchor, a carried set (memory, named properties) survives; everything else is restored; dial loopRestores [world, powers, rules]'],
    XA8: ['Rewind a thing or area', 'time.restore with place or holder scope from the caster\'s own pin; other holders and their facts stay'],
    XA9: ['Time skip', 'time.hold: others\' clock rate 0 in scope while the caster acts and spends real time; nothing erased'],
    XA10: ['Luck edit', 'chance.weight: shifts weights of named draws, sum conserved (CR4); personal, local or scheduled debt'],
    XA11: ['Fate edit', 'chance.pin: a pre-written result for one named draw address; a conflicting pin is refused with its reason'],
    XA12: ['Power over distance', 'rules.alter: edits link costs in the place graph (fold = cheaper, stretch = dearer, loop = returns to itself); reach is positions, not forms'],
    XA13: ['Power over sharpness', 'rules.alter on property:sharpness plus the damage law that reads it; stated reach: edges and cuts'],
    XA14: ['Power over ownership', 'rules.alter on the ownership mark rule: changes who the rule says the owner is; possession, not use'],
    XA15: ['Power over being noticed', 'mind.conceal on channel notice: not selected by attention; anything that needs no noticing (spray, sure-hit area) still lands'],
    XA16: ['Binding vow with visible cost', 'relations.oath: stated gain for stated cost, a leash term, typed break consequence'],
    XA17: ['Geas on another person', 'rules field scoped to a person that forbids or demands a verb; must be noticeable; consent or defeat'],
    XA18: ['Domain: sure-hit field', 'rules area field: every verb of the domain\'s payload applies to all within reach; passes nothing unless stated'],
    XA19: ['Domain clash and barrier', 'two area fields overlap: the one whose stated passes lists the other\'s concept wins on that axis; equal reach is a tie'],
    XA20: ['System interface', 'a being (own reactor) that grants power rows by quests and an agenda; its grants are data'],
    XA21: ['Cheat shop', 'powers.create: spend points for a power row; the row is ordinary data once bought'],
    XA22: ['Soul split and anchor', 'beings.split/anchor: part of the soul sits elsewhere; soul-backed powers move with the soul, not the body'],
    XA23: ['Soul seizure and possession', 'beings.possess: control of the host\'s acts moves to the possessor, the host\'s soul stays and contests; noticeable'],
    XA24: ['Rule-imposing Stand', 'rules field on an area or holder: one conditional rule, the condition is the counterplay'],
    XA25: ['Auto-acting Stand', 'beings: a separate reactor holder that acts on standing orders even when the user does not'],
    XA26: ['Stand with a condition, and a holder who is wrong', 'powers: the holder believes a wrong condition for their own power; hidden-rule evidence reconstructs it'],
};

// ---- the shared digest, byte-identical across every request ----
export const SYSTEM = `You are resolving interactions between powers in a life-sim game engine for a design review. Answer ONLY from the rules below; do not appeal to any franchise's canon. If the rules do not decide the case, say so: outcome "undecided" and name the dial or rule that is missing. Be concise.

ENGINE RULES (proposals under review)
Substrates, each with one owner: time (hold, rate, snapshot, restore, skip, branch), space (move, link, portal, enter, contain), body (add, remove, transform, scale), mind (sense, conceal, forecast, believe, remember, compel), chance (weight, pin, draw), powers (run, move, copy, create, suppress, resolve), rules (alter, block, override, scoped law fields), relations (bind, oath, contract, debt, names, ownership), beings (create, copy, split, anchor, possess).
Clock: each holder has an effective clock rate (own field times place field), default 1; 0 = held (does not act, does not age, does not perceive). Stop = rate 0 on everyone in scope except the caster; haste = rate above 1 on the caster. The advance loop gives each holder rate-proportional actions per world tick. A held holder cannot react; rate comparison decides who acts first inside one tick.
Reach (F7): a power's delivery has a stated reach (self, touch, range, area, sure-hit) and a stated list of what it passes (barriers, concepts, powers). An unstated reach is NOT assumed: default is stopped. Same-substrate conflict on one fact: the effect whose passes lists the other's concept wins that axis; equal reach is a tie settled by layer order and flagged as a ruling.
Layer order within one tick (MF4b): 1 rules (fields shape everything after), 2 time (holds and rates decide who acts), 3 space and delivery, 4 powers (suppress, resolve), 5 payloads on body, mind, beings, 6 relations (terms attach to what landed), 7 chance (draws weigh last, against the final state). Within a layer: higher stated reach, then earlier cause id, then holder id.
Powers are data rows: movable, copyable, suppressible. Terms on a moved row (CHT4): gift, loan, lien, leash, burdened loan; backing (CHT5): an item, a name, a debt or a soul thread; a soul-backed power cannot move without the soul. A suppression is a field over the power; the row stays and returns when the field ends.
Time restore: a restore point is a captured world state (not a PSA29 pin; pins are small fate values at draw addresses). A loop restores to the point and a carried set survives (default: the holder's memory; others' recall, powers and rules only if listed). Dial loopRestores: world, powers, rules (default world). Anchor ownership: the holder who took the restore point owns it; restoring needs the anchor, and a restore removes everything made after the point that is not carried.
Precognition: a forecast runs a sandbox copy forward under a budget; read-only by default (the future is a branch the seer can change). visionKind: forecast, fixed (writes a draw pin) or partial. A forecast treats other seers as stochastic sources, depth cap 1 (dial up to 3); mutual forecast hits the cap and reports damped. Unreadable-by is a stated reach on the forecast verb; the reader sees blank there.
Luck: a weight on named draws, sum conserved. A pin at a draw address ignores weights. Fate pins conflict-check and a contradicting pin is refused with its reason.
Chain budget: interactionBudget 64 landings per cause root per advance; overflow is recorded as damped, never a stall. Everything is inspectable: a ruling names the law that settled it.
Default / dial / reason: every rule above is an adjustable per-world default; a dial changes it with an in-world reason. Do not invent a rule outside this list; if a case needs one, outcome "undecided" and name it as the missing dial.

Reply with JSON only.`;

export const SCHEMA = {type: 'object', additionalProperties: false,
    required: ['outcome', 'resolution', 'deciding_kind', 'deciding_rule', 'confidence'],
    properties: {
        outcome: {type: 'string', enum: ['a_prevails', 'b_prevails', 'both_apply', 'neither', 'partial', 'undecided'],
            description: 'a_prevails: the first-named power/actor gets its intended result; b_prevails: the second; both_apply: both land; neither: both fail or cancel; partial: some axes each; undecided: the rules do not decide'},
        resolution: {type: 'string', description: 'The expected resolution in one to three sentences, in engine terms (what lands, what is held, what is restored).'},
        deciding_kind: {type: 'string', enum: ['stated_reach', 'terms', 'carried_set', 'clock_rate', 'dial', 'layer_order', 'backing_anchor', 'budget', 'mechanism_other'],
            description: 'The kind of rule that decided it.'},
        deciding_rule: {type: 'string', description: 'The specific rule or dial that decided it, by name (for example "loopRestores=world", "passes lists time", "rate 0 vs rate 0 tie, layer order").'},
        confidence: {type: 'string', enum: ['low', 'medium', 'high']}}};

// ---- case builders ----
const cases = [];
const add = (family, tag, a, b, setup, question) => cases.push({family, tag, a, b, setup, question});
const xa = k => `${XA[k][0]} (${k}): ${XA[k][1]}`;

// 1. Steal time travel, then rewind to before the theft
function stealRewind() {
    const transference = [['move', 'the row leaves the victim and lands in the thief (a move)'], ['copy', 'the victim keeps their time-travel power; the thief gets a copy']];
    const fidelity = [['full', 'a complete copy of every working'], ['lossy', 'a lossy copy built from the workings the thief witnessed (a half-seen power is a broken copy)']];
    const width = [['self', 'the time travel reaches only the user\'s own body'], ['place', 'the time travel restores the user\'s whole current place'], ['world', 'the time travel restores the whole world']];
    const depth = [['memory', 'the carried set is the user\'s memory only'], ['powers', 'the carried set is memory plus the user\'s power rows'], ['world', 'nothing carries but memory, and the restore also rolls back rules']];
    const comp = [['whole', 'the stolen row covers every use of the time travel (rewind, loop, skip)'], ['rewind-only', 'the stolen row covers the rewind use only']];
    const anchor = [['victim', 'the restore point to before the theft was taken by the victim, who still owns it'], ['thief', 'the thief took a fresh restore point just before the theft, so they own it'], ['shared-world', 'the point sits in a world-owned store with no holder set as owner'], ['none', 'no restore point exists from before the theft; the earliest point is after it']];
    const all = cross(transference, fidelity, width, depth, comp, anchor);
    for (const [t, f, w, d, c, an] of shuffled(all, 11).slice(0, 110)) {
        add('steal-time-travel-rewind', `${t}/${f}/${w}/${d}/${c}/${an[0]}`,
            `Thief: steals the victim's time-travel power (${xa('XA4')}). Transference: ${t[1]}. Fidelity: ${f[1]}.`,
            `Victim's time-travel power (${xa('XA7')}). Width: ${w[1]}. Depth: ${d[1]}. Comprehensiveness: ${c[1]}.`,
            `Order of events: the victim has the time-travel power, and a restore point to the time before the theft exists. The thief steals the power. Then the thief tries to use it to rewind to before the theft. Anchor ownership: ${an[1]}.`,
            'Does the thief rewind to before the theft, and what is true afterwards of the thief, the victim and the power row? Name the rule that decides.');
    }
}

// 2. Two people in one time stop
function twoInOneStop() {
    const second = [
        ['also a stopper', 'a second holder who can also stop time (same field, rate 0 on everyone in scope except themselves)'],
        ['stolen clock', 'a second holder whose own clock rate is 1 but who stole a rate-1 immunity row from the first stopper'],
        ['domain holder', 'a second holder standing inside their own sure-hit domain that passes nothing unless stated'],
        ['precog', 'a second holder with a forecast power'],
        ['speedster', 'a second holder with own clock rate 20'],
        ['reaction only', 'a second holder with a Kerenzikov-style reaction boost: extra reactions per tick, but clock rate 1'],
        ['partial immune', 'a second holder with partial stop immunity: their clock rate is 0.1 inside the stop instead of 0'],
        ['conceptual immune', 'a second holder whose power is stated to pass the concept time (passes: [time])'],
    ];
    const when = [['the stops start in the same tick', 'both start in the same tick'], ['the second stopper starts a tick later, inside the first stop', 'the second starts one tick after the first']];
    const rule = [['default', 'no dial changed'], ['stop-stacks', 'world dial: a later stop overrides an earlier one in scope'], ['reach-states-passes', 'the first stop states passes: [] and the second states passes: [time]']];
    for (const [s, w, r] of shuffled(cross(second, when, rule), 13).slice(0, 36))
        add('two-in-one-time-stop', `${s[0]}/${w[0]}/${r[0]}`,
            `Stopper: ${xa('XA9')}, as a stop: rate 0 on everyone in scope except the caster.`,
            `Second holder: ${s[1]}.`,
            `Both are in one place. ${w[1]}. ${r[1]}.`,
            'Who acts, who is held, in which order, and what does each perceive? Name the rule that decides.');
}

// 3. Speedster / Sandevistan vs time stop, precog, domain
function speedVs() {
    const speed = [
        ['own clock x10', 'own clock rate 10: the world still moves at rate 1 around them'],
        ['own clock x100', 'own clock rate 100'],
        ['sandevistan', 'a cyberware burst: own clock rate 6 for 10 world ticks, then a cooldown and a body cost (a cyberware term)'],
        ['reaction only', 'Kerenzikov-style: extra reactions per tick, clock rate 1, so no extra movement'],
        ['perception only', 'perceives at rate 20 but acts at rate 1'],
        ['speed from stolen time', 'rate 10 by a power row stolen with a lien from a time-stopper'],
    ];
    const foe = [
        ['time stop', `A time stopper (${xa('XA9')}): rate 0 on everyone in scope except the caster, reach stated as area, passes: []`],
        ['time stop passes speed', 'A time stopper whose stop states passes: [speed], i.e. fast clocks are also held'],
        ['precog forecast', `A seer (see forecast rules): a forecast of the next 10 ticks, depth cap 1, visionKind forecast`],
        ['precog fixed', 'A seer whose vision is fixed: it wrote a draw pin that the speedster will be hit at the gate'],
        ['domain sure-hit', `A domain holder (${xa('XA18')}) with a sure-hit payload to everyone within reach, reach area, passes: []`],
        ['domain passes speed', 'A domain holder whose domain states passes: [speed]'],
    ];
    const mode = [['speedster attacks first', 'The speedster starts a strike.'], ['foe acts first', 'The foe acts at the start of the tick, before the speedster']];
    for (const [s, f, m] of shuffled(cross(speed, foe, mode), 17).slice(0, 54))
        add('speed-vs-stop-precog-domain', `${s[0]}/${f[0]}/${m[0]}`,
            `Speedster: ${s[1]}.`, f[1], `${m[1]} Both in one place.`,
            'Who lands what? Name the rule that decides (clock rate, reach, layer order).');
}

// 4. Precog vs luck edit; precog vs precog
function precogLuck() {
    const vision = [['forecast', 'forecast: runs a sandbox branch, read-only'], ['fixed', 'fixed: writes a draw pin at the address'], ['partial', 'partial: the budget ran out so the forecast is cheapest-layers only']];
    const luck = [['personal', 'a personal luck edit on the target (weights of the target\'s named draws shifted)'], ['local', 'a local luck edit on a place (weights of all draws there shifted)'], ['scheduled', 'a scheduled luck debt that repays later against the same holder'], ['pin', 'a fate edit (a pin at the draw address the vision reads)']];
    const seer = [['target is the seer', 'The luck edit lands on the seer.'], ['edit lands after the forecast', 'The luck edit lands after the forecast was run.']];
    for (const [v, l, s] of cross(vision, luck, seer))
        add('precog-vs-luck-edit', `${v[0]}/${l[0]}/${s[0]}`,
            `Seer: ${v[1]}.`, `Luck: ${l[1]}.`, s[1], 'What does the seer see, what actually happens at the draw, and who is right? Name the rule that decides.');
    const kinds = [['forecast', 'forecast'], ['fixed', 'fixed vision'], ['unreadable', 'forecast but the other holder is unreadable-by-forecast (stated reach on the verb)'], ['deep', 'forecast with depth dial raised to 3']];
    for (const [a, b] of cross(kinds, kinds))
        add('precog-vs-precog', `${a[0]}/${b[0]}`, `Seer A: ${a[1]}.`, `Seer B: ${b[1]}.`,
            'Each forecasts the other\'s next action in the same tick, and each can act on what it sees.',
            'What does each see, does the system damp, and what happens in the world? Name the rule that decides.');
}

// 5. Absorb vs negate
function absorbNegate() {
    const absorb = [['digest', 'digest: the target power must be killed or drained first; the kit entry is permanent but lossy; intake is a move'], ['tithe', 'tithe: taken a use at a time from a living source; no move of the row'], ['echo', 'echo: the kit entry decays unless the absorber keeps meeting the source'], ['copy intake', 'a copy intake: the source keeps the power']];
    const negate = [['holder', 'negation over the holder: every power the holder owns stops'], ['working', 'negation over the working: only workings started after contact are cancelled'], ['channel', 'negation of the channel (voice, gesture, item) the power uses, so the power works but its carrier is blocked']];
    const dir = [['absorber targets negater', 'The absorber tries to absorb the negater\'s power while the negation is up.'], ['negater targets absorber', 'The negater lays a negation over the absorber while they absorb a third party\'s power.'], ['negated source', 'The absorber tries to absorb a power that is currently under a negation field laid by a third party.']];
    for (const [a, n, d] of cross(absorb, negate, dir))
        add('absorb-vs-negate', `${a[0]}/${n[0]}/${d[0]}`, `Absorber: ${xa('XA1')} Variant: ${a[1]}.`, `Negater: ${xa('XA3')} Variant: ${n[1]}.`, d[1], 'Does the absorption land, what does the absorber hold afterwards, and what happens to the negation? Name the rule that decides.');
}

// 6. Loop vs lease-term stolen power
function loopLease() {
    const dial = [['world', 'loopRestores=world'], ['powers', 'loopRestores=[powers]'], ['rules', 'loopRestores=[rules]']];
    const carried = [['memory', 'the loop carries the looper\'s memory only'], ['memory+powers', 'the carried set is memory plus the looper\'s power rows (borrowed rows included)']];
    const term = [['loan', 'a loan term (returns to the lender at the end of the term)'], ['lien', 'a lien (the lender holds a claim on the row and may call it)'], ['leash', 'a leash term (the row works only while the lender is within reach)']];
    const looper = [['borrower loops', 'The borrower of the stolen power is the one who loops.'], ['lender loops', 'The lender of the power is the one who loops.']];
    for (const [d, c, t, l] of cross(dial, carried, term, looper))
        add('loop-vs-lease-stolen-power', `${d[0]}/${c[0]}/${t[0]}/${l[0]}`,
            `Looper: ${xa('XA7')} Dial: ${d[1]}. ${c[1]}.`,
            `Stolen power on a lease: ${xa('XA4')} with ${t[1]}; the term has some time left.`,
            `${l[1]} The restore point was taken before the term began. The loop triggers after the term has run for a while.`,
            'After the restore, who holds the power row, what state is its term in, and does the borrower remember the theft? Name the rule that decides.');
}

// 7. Distance power vs portal
function distancePortal() {
    const dist = [['fold', 'fold: links cheap, reach and travel shortened'], ['stretch', 'stretch: links dear, so pursuit and sure-hit slow'], ['loop', 'loop: a link returns to its own place']];
    const portal = [['transient', 'a transient portal: a cost-zero link that exists one tick'], ['standing', 'a standing portal: a permanent link between two places'], ['pocket', 'an entrance to a pocket dimension: a place with its own link table, reached by one link'], ['blind jump', 'a blink with no known destination']];
    const who = [['distance holder is on the portal route', 'The distance holder has set the field over the place where the portal opens.'], ['portal user targets distance holder', 'The portal user opens the portal next to the distance holder\'s field.']];
    for (const [d, p, w] of cross(dist, portal, who))
        add('distance-vs-portal', `${d[0]}/${p[0]}/${w[0]}`, `Distance power: ${xa('XA12')} Variant: ${d[1]}.`, `Portal: space.portal. ${p[1]}.`, w[1], 'Does the portal work, what does it cost, and what does each side perceive? Name the rule that decides (link cost, reach, passes).');
}

// 8. EMP vs cyberware, vs magic
function emp() {
    const emp = [['small pulse', 'an EMP: a rules area field that blocks powered electronics in range for a few ticks, reach area, passes: []'], ['hardened target', 'an EMP against a target whose cyberware is hardened (states passes: [emp])'], ['wide pulse', 'a continent-wide EMP, long duration']];
    const target = [
        ['implant powered', 'cyberware: a powered implant (neural link) with an item backing and a body cost term'],
        ['implant passive', 'cyberware: a passive cybernetic limb (steel and servo) that holds a body property (strength)'],
        ['sandevistan', 'cyberware: a Sandevistan-type clock-rate boost (own rate 6)'],
        ['magic spell', 'an ongoing magic spell on a holder (a working with a sustained duration)'],
        ['enchanted item', 'an enchanted item (item_bound_law: a power bound to an item)'],
        ['ritual', 'a completed ritual whose effect is a lasting mark on a holder (relations)'],
        ['tech delivery of a substrate', 'a gadget that delivers another substrate (a time-stop device) via a power cell'],
        ['mage with tech focus', 'a mage whose spell requires a technological focus as carrier'],
    ];
    for (const [e, t] of cross(emp, target))
        add('emp-vs-cyberware-magic', `${e[0]}/${t[0]}`, `EMP: ${e[1]}.`, `Target: ${t[1]}.`, 'The pulse goes off in range of the target.', 'What stops, what keeps working, what persists after the field ends? Name the rule that decides (reach, passes, carrier, backing).');
}

// 9. Fill to about 500 with seeded XA pairs (actor A, target B)
function xaPairs(target) {
    const keys = Object.keys(XA), pairs = [];
    for (const a of keys) for (const b of keys) if (a !== b) pairs.push([a, b]);
    const need = target - cases.length;
    for (const [a, b] of shuffled(pairs, 23).slice(0, need))
        add('xa-pair', `${a}>${b}`, xa(a), xa(b),
            `Holder A uses ${XA[a][0]} on, or against, holder B's ${XA[b][0]}, in one tick. Both have reasonable reach.`,
            'What is the resolution? Name the rule that decides. If the rules do not decide it, say which dial or rule is missing.');
}

export function buildCases(total = 500) {
    cases.length = 0;
    stealRewind(); twoInOneStop(); speedVs(); precogLuck(); absorbNegate(); loopLease(); distancePortal(); emp(); xaPairs(total);
    cases.forEach((c, i) => { c.id = `io-${c.family}-${String(i + 1).padStart(3, '0')}`; });
    return cases.map(c => ({...c}));
}

export const userText = c => `CASE ${c.id} (${c.family}, ${c.tag})\nFirst-named power A: ${c.a}\nSecond-named power B: ${c.b}\nSetup: ${c.setup}\nQuestion: ${c.question}`;

const MODELS = {luna: {model: 'gpt-6-luna', effort: 'low', maxTokens: 4000}, haiku: {model: 'claude-haiku-5-5', effort: 'low', maxTokens: 2000}};
const argv = process.argv.slice(2);

// How far apart two outcomes are, as a design-rule signal: opposite winners say the rule order is unsettled; decided vs
// undecided says a rule or dial is missing; partial and both are smaller steps.
export function outcomeDistance(x, y) {
    if (x === y) return 0;
    const win = new Set(['a_prevails', 'b_prevails']);
    if (win.has(x) && win.has(y)) return 3;
    if (x === 'undecided' || y === 'undecided') return 2;
    if (win.has(x) || win.has(y)) return 2;
    return 1;
}
const PREFIX = 'docs/research/power-catalogues-2026-11-16/';

// The historical prompt asserted that a pre-theft point exists before adding the anchor variant.
function inputIssue(c) {
    if (c.family === 'steal-time-travel-rewind' && c.tag.endsWith('/none')
        && c.setup.includes('a restore point to the time before the theft exists')) {
        return 'contradictory_restore_point';
    }
    return null;
}

function normalise() {
    const all = buildCases(), luna = JSON.parse(readFileSync(DIR + 'oracle_luna.json', 'utf8')), haiku = JSON.parse(readFileSync(DIR + 'oracle_haiku.json', 'utf8'));
    const rows = [], pick = r => ({outcome: r.outcome, resolution: r.resolution, kind: r.deciding_kind, rule: r.deciding_rule, confidence: r.confidence});
    for (const c of all) {
        const l = luna[c.id]?.reply, h = haiku[c.id]?.reply;
        if (!l || !h) continue;
        const outcomeAgree = l.outcome === h.outcome, agree = outcomeAgree && l.deciding_kind === h.deciding_kind;
        const issue = inputIssue(c);
        rows.push({id: c.id, family: c.family, tag: c.tag, a: c.a, b: c.b, setup: c.setup, question: c.question, luna: pick(l), haiku: pick(h),
            ...(issue ? {input_issue: issue} : {}), agree, outcome_agree: outcomeAgree, deciding_rule: agree ? l.deciding_rule : `luna: ${l.deciding_rule} | haiku: ${h.deciding_rule}`});
    }
    writeFileSync(OUT, rows.map(r => JSON.stringify(r)).join('\n') + '\n');
    const usable = rows.filter(r => !r.input_issue);
    const excluded = rows.length - usable.length;
    // Agreement on a consistent prompt is evidence for review, not an accepted game rule.
    const fx = usable.filter(r => r.agree && r.luna.outcome !== 'undecided').map(r => ({id: r.id, family: r.family, tag: r.tag, a: r.a, b: r.b, setup: r.setup, expect: {outcome: r.luna.outcome, deciding_kind: r.luna.kind}, resolution: [r.luna.resolution, r.haiku.resolution], deciding_rule: [r.luna.rule, r.haiku.rule], status: 'oracle-agreed, not human-reviewed'}));
    writeFileSync(path.join(root, 'docs/coverage/fixtures/interaction_oracle_agreed.json'), JSON.stringify({note: 'Candidate cases from consistent prompts where Luna and Haiku agreed on a decided outcome and rule kind. Check the rule and the state changes before using them in resolver tests. Proposals under review (AD32).', cases: fx}, null, 0).replace(/},{"id"/g, '},\n{"id"'));
    // Disagreements, grouped by family and the pair of deciding kinds; ranked by cases x severity.
    const dis = usable.filter(r => !r.agree).map(r => ({...r, score: outcomeDistance(r.luna.outcome, r.haiku.outcome) + (r.luna.kind !== r.haiku.kind ? 1 : 0) + (r.luna.confidence === 'high' && r.haiku.confidence === 'high' ? 1 : 0)}));
    const groups = new Map();
    for (const r of dis) { const k = `${r.family}|${[r.luna.kind, r.haiku.kind].sort().join(' vs ')}`; (groups.get(k) ?? groups.set(k, []).get(k)).push(r); }
    const ranked = [...groups.entries()].map(([k, rs]) => ({key: k, n: rs.length, mean: rs.reduce((s, r) => s + r.score, 0) / rs.length, top: rs.sort((a, b) => b.score - a.score)[0]}))
        .map(g => ({...g, weight: g.n * g.mean})).sort((a, b) => b.weight - a.weight);
    const pct = (n, d) => d ? `${(100 * n / d).toFixed(1)}%` : 'n/a';
    const fam = {}; for (const r of usable) { const f = fam[r.family] ??= {n: 0, agree: 0, outcome: 0}; f.n++; f.agree += r.agree; f.outcome += r.outcome_agree; }
    const undec = usable.filter(r => r.luna.outcome === 'undecided' && r.haiku.outcome === 'undecided').length;
    const lines = [`# Interaction oracle (2026-11-18, proposals)`, '',
        `Register status: Proposal (AD32, AD56). Agent-generated, not human-reviewed: gpt-6-luna and claude-haiku-5-5 supplied paired replies using the rule digest in \`scripts/interaction_oracle.mjs\`; agreement is a screen, not a ruling. Cases are built by script from XA1-XA26 and the nine substrates; rows in [interaction_oracle.jsonl](../../coverage/interaction_oracle.jsonl), agreed fixtures in [interaction_oracle_agreed.json](../../coverage/fixtures/interaction_oracle_agreed.json).`, '',
        `## Numbers`, '',
        `- Generated ${all.length} prompts and collected ${rows.length} paired replies. Of those, ${excluded} contradictory anchor prompts both grant and deny a pre-theft restore point. The JSONL retains their replies with \`input_issue\`; the fixtures and analysis below exclude them.`,
        `- Of the ${usable.length} remaining pairs, **${usable.filter(r => r.agree).length} (${pct(usable.filter(r => r.agree).length, usable.length)})** agree on outcome and deciding-rule kind. ${usable.filter(r => r.outcome_agree).length} (${pct(usable.filter(r => r.outcome_agree).length, usable.length)}) agree on outcome alone.`,
        `- Both said the rules do not decide the case ("undecided"): ${undec}. These are missing-dial signals, not fixtures.`, `- Candidate fixtures: ${fx.length} agreed, decided cases. Check the actual rule and the expected state changes before promoting a candidate to a resolver test.`, '', '| Family | Cases | Agree (outcome + kind) | Agree (outcome) |', '| --- | ---: | ---: | ---: |',
        ...Object.entries(fam).map(([f, v]) => `| ${f} | ${v.n} | ${pct(v.agree, v.n)} | ${pct(v.outcome, v.n)} |`), '',
        `## Disagreements ranked by design-rule impact`, '',
        `Heuristic, deterministic: cases are grouped by family and the pair of deciding-rule kinds the two models named; a group's weight is its case count times mean severity (opposite winners 3, decided vs undecided or a winner vs both/neither 2, otherwise 1, plus 1 when the kinds differ, plus 1 when both are high confidence). A big group means one unsettled rule decides many cases. Each is a decision for Weibao, not a settled ruling.`, ''];
    ranked.slice(0, 15).forEach((g, i) => {
        const t = g.top;
        lines.push(`### D${i + 1} ${g.key.replace('|', ': ')} (${g.n} cases, mean severity ${g.mean.toFixed(1)})`, `> Example: \`${t.id}\`. ${t.setup}`, '>', `> Luna: ${t.luna.outcome}, ${t.luna.kind}: ${t.luna.rule}. ${t.luna.resolution}`, '>', `> Haiku: ${t.haiku.outcome}, ${t.haiku.kind}: ${t.haiku.rule}. ${t.haiku.resolution}`, '');
    });
    lines.push(`${ranked.length} groups in all; the rest are in the jsonl (\`agree: false\`).`);
    writeFileSync(path.join(root, PREFIX + 'INTERACTION_ORACLE_2026-11-18.md'), lines.join('\n') + '\n');
    console.log(JSON.stringify({cases: rows.length, excluded, agree: usable.filter(r => r.agree).length, outcomeAgree: usable.filter(r => r.outcome_agree).length, undecidedBoth: undec, fixtures: fx.length, groups: ranked.length, top: ranked.slice(0, 10).map(g => [g.key, g.n, +g.mean.toFixed(1)])}));
}

async function main() {
    const [cmd, who] = argv;
    mkdirSync(DIR, {recursive: true});
    if (cmd === 'cases') {
        const all = buildCases();
        writeFileSync(DIR + 'cases.json', JSON.stringify(all));
        const byFamily = {}; for (const c of all) byFamily[c.family] = (byFamily[c.family] ?? 0) + 1;
        console.log(JSON.stringify({total: all.length, byFamily}));
    } else if (cmd === 'pass') {
        const all = buildCases();
        // pilot: 20 cases spread across the named families, not the first 20
        const pilot = argv.includes('--pilot');
        const fam = [...new Set(all.map(c => c.family))];
        const items = (pilot ? fam.flatMap(f => all.filter(c => c.family === f).slice(0, 3)).slice(0, 20) : all).map(c => ({id: c.id, user: userText(c)}));
        const m = MODELS[who];
        if (!m) throw Error('pass luna|haiku');
        await runPass({name: 'oracle', dir: DIR, system: SYSTEM, schema: SCHEMA, items, ...m}, argv.filter(a => a !== '--pilot'));
    } else if (cmd === 'normalise') normalise();
    else console.log('usage: cases | pass luna|haiku [--pilot] | normalise');
}
if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
