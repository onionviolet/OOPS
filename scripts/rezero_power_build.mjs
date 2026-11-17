// Re:Zero power ledger, last stage: folds the private label passes into docs/coverage/rezero_power_labels.json (normalised
// values, locators and speakers; no paraphrase and no book prose) and writes docs/coverage/rezero_powers.jsonl. Pure
// functions are exported for the shape test; build() reads the private folder and writes both files.
// Fold rule, held-out tables and capability order are frozen in rezero_power_frozen.mjs (written before any grammar output).
import {writeFileSync} from 'node:fs';
import {foldChapterEffect} from './chapter_effect_tier.mjs';
import {PRIV, readJson, readIf, heldOut} from './rezero_power_chunks.mjs';
import {predictAttribute, predictSin, CAPABILITIES, CAPABILITY_ORDER, ROUTE_TO_PLAYER, SIN_RULES, ATTR_RULES} from './rezero_power_frozen.mjs';

const root = new URL('..', import.meta.url).pathname;
export const SIDECAR = `${root}docs/coverage/rezero_power_labels.json`;
export const LEDGER = `${root}docs/coverage/rezero_powers.jsonl`;
export const SPLIT_RULE = 'A row whose sha1(id) first byte is below 0x33 (about a fifth) is held out (GKM429); the ids are fixed by the merge table in scripts/rezero_power_canon.mjs, committed before any grammar pass.';

// Keyword tags for the free-text aspect fields. The paraphrases stay private; only these tags, the locator and the speaker
// are committed. Crude by design and checked by hand on a sample (README section).
export const TAGS = {
    who_may: {bloodline: /blood|descend|inherit|family|lineage|born/, species: /race|species|dragon|demi|oni|werewolf|half|beast/, compatibility: /compatib|qualif|affinity|aptitude|gate/,
        unique: /unique|only one|sole|single/, chosen: /select|chosen|grant|appoint|confer|bestow/, anyone: /anyone|any person|ordinary|most /},
    go_wrong: {'body-harm': /wound|injur|pain|damage|harm|burn|bleed/, 'life-cost': /life|lifespan|\bod\b|die|death|sacrific/, overload: /overload|strain|exhaust|gate|burden|fatigue/,
        'mind-cost': /madness|insan|memory|forget|identity|lose/, attention: /witch|scent|attention|detect|taboo/, recoil: /recoil|backlash|rebound|self-harm/, limited: /only|cannot|limit|range|restrict|unless|fail/},
    mind: {drift: /drift|warp|corrupt|personality|obsess|crave|hunger|madness|change/, compulsion: /compel|control|obey|command|bind|force/},
    left_behind: {transfers: /transfer|pass|success|inherit|select|next holder|new holder/, lost: /lost|vanish|end|disappear|cease|gone/, remains: /remain|stay|persist|left|survive/},
    combines: {stacks: /combine|stack|together|amplif|enhanc|boost|with/, conflicts: /cancel|conflict|oppos|interfere|clash|incompat/},
    counters: {dispel: /dispel|lift|cure|remove|undo/, resist: /resist|immune|block|repel|ward|shield|barrier/, avoid: /avoid|escape|outrun|hide|distance|away/, kill: /kill|destroy|defeat|burn|attack|sever|stop|beat/},
};
export const tagsOf = (field, text) => Object.entries(TAGS[field]).filter(([, re]) => re.test((text ?? '').toLowerCase())).map(([t]) => t);

// A stated label counts only when the evidence line names the label word right beside the power's own name (hand check
// 2026-11-16: the label pass took a scene's incidental "water" as a spell's attribute). "Ice" is not one of the six
// attributes, so an Ice-labelled line is unmapped and stays out of the score.
export const SIX = ['fire', 'water', 'wind', 'earth', 'yin', 'yang'];
export function adjacent(text, aliases, label, radius) {
    const words = [label];
    // A catalogue row that leads with the label ("| Gluttony | ...") states it for everything listed in that row.
    if (new RegExp(`^\\|\\s*${label}\\b`, 'i').test(text) && aliases.some(a => text.toLowerCase().includes(a.replace(/\\s*\\([^)]*\\)/g, '').trim().toLowerCase()))) return true;
    const re = new RegExp(`\\b(?:${words.join('|')})\\b`, 'gi');
    const names = aliases.map(a => a.replace(/\s*\([^)]*\)/g, '').trim()).filter(a => a.length >= 3);
    for (const n of names) {
        for (let i = text.toLowerCase().indexOf(n.toLowerCase()); i >= 0; i = text.toLowerCase().indexOf(n.toLowerCase(), i + 1)) {
            if (re.test(text.slice(Math.max(0, i - radius), i + n.length + radius))) return true;
            re.lastIndex = 0;
        }
    }
    return false;
}
// Hand corrections after reading the rows (2026-11-16), each with its reason and a locator.
export const HAND = {
    'rz.return_by_death.return-by-death': {knowledge: {who: 'holder', locator: 'DD2 l.139', speaker: 'inference', note: 'bystanders learn only uncanny foresight; Roswaal knows a redo exists without keeping memory (round 2 section 3.2)'}},
    'rz.authority.name-eating': {review: 'the evidence lines found name Star Eating, so the effect read is Star Eating\'s; needs its own lines'},
};
const tierOf = name => /^(El|Ul|Al|Ol) /.exec(name)?.[1].toLowerCase() ?? 'bare';

export function capabilityBlockers(row, lab) {
    const g = lab.grammar ?? {};
    const out = new Set();
    if (row.id === 'rz.return_by_death.return-by-death') out.add('death-checkpoint-rewind');
    if (row.id === 'rz.return_by_death.telling-penalty') out.add('speech-penalty');
    if (['bind', 'alter'].includes(g.verb) && g.object === 'mind') out.add('mind-binding');
    if (g.verb === 'remove' && ['memory', 'information', 'soul'].includes(g.object)) out.add('memory-erasure');
    if (['inheritance', 'factor-transfer'].includes(lab.route) || (['witch_factor', 'authority'].includes(row.cls) && lab.left_behind?.tags?.includes('transfers'))) out.add('power-transfer');
    if (['witch_factor', 'authority'].includes(row.cls) && lab.mind?.tags?.length) out.add('holder-mind-drift');
    if (row.cls === 'spirit_contract') out.add('spirit-contract-judgement');
    if (!g.verb || g.verb === 'none' || !lab.effectStated) out.add('effect-unknown');
    return CAPABILITY_ORDER.filter(c => out.has(c));
}

// Compare agreement against the frozen baseline: the most common label's share among the rest, applied to the held-out rows.
export function scoreClass(items, predict) {
    const part = held => items.filter(i => i.heldOut === held);
    const agree = list => list.filter(i => predict(i.grammar) === i.truth).length;
    const rest = part(false), held = part(true);
    const mode = [...rest.reduce((m, i) => m.set(i.truth, (m.get(i.truth) ?? 0) + 1), new Map())].sort((a, b) => b[1] - a[1])[0]?.[0];
    const baseline = held.filter(i => i.truth === mode).length;
    return {held: {n: held.length, agree: agree(held), baseline, mode: mode ?? null}, rest: {n: rest.length, agree: agree(rest)}, beats: held.length > 0 && agree(held) > baseline};
}

export function build({write = true} = {}) {
    const rows = readJson(`${PRIV}rezero_rows.json`), packets = new Map(readJson(`${PRIV}rezero_packets.json`).map(p => [p.id, p]));
    const luna = readIf(`${PRIV}rezero_label_luna.json`, {}), second = readIf(`${PRIV}rezero_second_haiku.json`, {}), held = readIf(`${PRIV}rezero_held_luna.json`, {});
    const labels = {};
    for (const r of rows) {
        if (r.notAThing) { labels[r.id] = {name: r.name, class: r.cls, editions: r.editions, nameSources: r.nameSources, notAThing: r.notAThing}; continue; }
        const p = packets.get(r.id), reply = luna[r.id]?.reply, h2 = second[r.id]?.reply;
        const locs = new Map(p.evidence.map(e => [e.loc, e]));
        // A field keeps its locator only when the locator is one of the packet's own; the speaker follows the evidence line's
        // source tag (SHOWN, STATED, WIKI, INFERRED) when it carries exactly one, else the labeller's.
        const field = (key, f) => {
            if (!f?.value) return null;
            const ev = locs.get(f.locator.replace(/^\[|\]$/g, ''));
            if (!ev) return {tags: [], locator: null, speaker: 'unknown', locatorMissing: true};
            return {locator: ev.loc, speaker: ev.speaker ?? f.speaker};
        };
        const lab = {name: r.name, class: r.cls, editions: r.editions, nameSources: r.nameSources, tier: tierOf(r.name), heldOut: r.heldOut};
        if (r.cls === 'spell') lab.spellTier = tierOf(r.name);
        const book = p.evidence.some(e => e.speaker !== 'wiki');
        lab.sourceTier = p.evidence.length === 0 ? 'none' : book ? 'book' : 'wiki';
        lab.evidence = p.evidence.map(e => e.loc);
        if (reply) {
            const g = reply.grammar;
            lab.effectStated = !!reply.effect.value;
            lab.grammar = {verb: g.verb, object: g.object, target: g.target, time: g.time, ...(field('grammar', {value: g.verb, locator: g.locator, speaker: g.speaker}) ?? {})};
            lab.effect = field('effect', reply.effect);
            lab.secondReader = h2 ? {verb: h2.verb, object: h2.object, target: h2.target, time: h2.time, agrees: h2.verb === g.verb && h2.object === g.object && g.verb !== 'none'} : null;
            for (const k of ['who_may', 'go_wrong', 'mind', 'left_behind', 'combines', 'counters']) {
                const base = field(k, reply[k]);
                lab[k] = base && {...base, tags: tagsOf(k, reply[k].value)};
            }
            lab.route = reply.where_from.value || reply.where_from.route !== 'unknown' ? reply.where_from.route : 'unknown';
            lab.where_from = field('where_from', reply.where_from);
            lab.knowledge = {who: reply.knowledge.who, speaker: 'unknown', ...(field('knowledge', reply.knowledge) ?? {})};
        } else { lab.effectStated = false; lab.route = 'unknown'; }
        lab.routeToPlayer = {route: lab.route, text: ROUTE_TO_PLAYER[lab.route], basis: 'authored proposal (DEEP_DIVE_2026-10-24 l.90-97)'};
        const hl = held[r.id]?.reply;
        if (hl && hl.label !== 'none') lab.stated = {[r.cls === 'spell' ? 'attribute' : 'sin']: hl.label, locator: locs.get(hl.locator.replace(/^\[|\]$/g, ''))?.loc ?? null, speaker: locs.get(hl.locator.replace(/^\[|\]$/g, ''))?.speaker ?? hl.speaker};
        if (lab.stated && r.cls !== 'witch_factor') {
            const key = r.cls === 'spell' ? 'attribute' : 'sin';
            // The cited line first, then any other evidence line that states it beside the name.
            const cited = locs.get(hl.locator.replace(/^\[|\]$/g, ''));
            const names = [r.name, ...r.aliases], radius = r.cls === 'spell' ? 60 : 90;
            const ev = [cited, ...p.evidence].filter(Boolean).find(e => adjacent(e.text, names, lab.stated[key], radius));
            if (ev) { lab.stated.locator = ev.loc; lab.stated.speaker = ev.speaker ?? lab.stated.speaker; }
            if (!ev) { lab.statedRejected = {[key]: lab.stated[key], reason: 'label word not beside the power name in the cited line'}; delete lab.stated; }
        } else if (hl && hl.label === 'ice') lab.statedRejected = {attribute: 'ice', reason: 'ice is not one of the six attributes'};
        if (r.cls === 'witch_factor') lab.stated = {sin: r.id.split('.').pop(), locator: null, speaker: 'row-id'};
        if (HAND[r.id]?.knowledge) lab.knowledge = HAND[r.id].knowledge;
        if (HAND[r.id]?.review) lab.review = HAND[r.id].review;
        lab.blockers = capabilityBlockers(r, lab);
        labels[r.id] = lab;
    }
    // Held-out scores (PWC2): the frozen tables predict the stated label from the masked-evidence grammar.
    const items = (cls, key) => Object.entries(labels).filter(([id, l]) => cls.includes(l.class) && l.stated?.[key] && l.grammar).map(([id, l]) => ({id, heldOut: l.heldOut, grammar: l.grammar, truth: l.stated[key]}));
    const score = {
        attribute: {rule: 'ATTR_RULES (frozen)', ...scoreClass(items(['spell'], 'attribute'), predictAttribute)},
        sin: {rule: 'SIN_RULES (frozen)', ...scoreClass(items(['witch_factor', 'authority'], 'sin'), predictSin)},
    };
    // Fold rule: grammar is `grammar` when two readers agree, and for a held-out class only if its score beats the baseline.
    for (const l of Object.values(labels)) {
        if (!l.grammar) continue;
        const classScore = l.class === 'spell' ? score.attribute : ['witch_factor', 'authority'].includes(l.class) ? score.sin : null;
        const classOk = classScore ? classScore.beats : true;
        l.grammarFold = l.secondReader?.agrees && classOk && !l.review ? 'grammar' : 'grammarGuess';
    }
    const live = Object.entries(labels).filter(([, l]) => !l.notAThing);
    const out = {
        revision: 1, built: '2026-11-16', world: 'Re:Zero', denominator: 'deep dives and reader digests (name pass), WN capture and IF epubs (free scan); see nameSources per row',
        split: {rule: SPLIT_RULE, heldOut: live.filter(([, l]) => l.heldOut).map(([id]) => id).sort()},
        capabilities: CAPABILITIES, score, labels,
    };
    const ledger = Object.entries(labels).map(([id, l]) => {
        const state = l.notAThing ? `not-a-thing:${l.notAThing}` : l.blockers.length ? `blocked:${l.blockers[0]}` : 'catalogued';
        const note = l.notAThing ? `${l.class} name, ${l.notAThing}` : [`${l.editions}`, `${l.sourceTier} tier`, l.grammar ? `${l.grammarFold} ${l.grammar.verb}.${l.grammar.object}.${l.grammar.target}.${l.grammar.time}` : 'no grammar',
            `route ${l.route}`, ...(l.blockers.length > 1 ? [`also ${l.blockers.slice(1).join(', ')}`] : []), l.heldOut ? 'held out' : null].filter(Boolean).join('; ');
        return foldChapterEffect('rezero_powers', {id, source: [...l.nameSources.slice(0, 3), ...(l.evidence ?? []).slice(0, 2)].join('; ') || 'none', state, mechanisms: [l.class === 'spell' ? 'S' : 'W'], note});
    });
    if (write) {
        writeFileSync(SIDECAR, JSON.stringify(out, null, 1) + '\n');
        writeFileSync(LEDGER, ledger.map(r => JSON.stringify(r)).join('\n') + '\n');
    }
    return {out, ledger};
}
