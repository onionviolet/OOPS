// Bridge: a conversation (native Village textlines, or cast topic-talk quotes) -> the talk view model that
// src/ui/talk_view.js draws (docs/representations/TALK.md). Pure and observer-safe: callers pass only what the
// hero may know; nothing here reads game state, the clock or the save (PIR5, PIR23).
//
// Topic row: {id, label, state, quote, reason?, recall?}
//   state  new     can be said now (small accent, PIR16)
//          heard   said and answered; stays readable, never disabled-looking (PIR16)
//          closed  settled another way (a sibling line locked it)
//          locked  known but not possible yet; `reason` names what is missing (SUI5, PIR9)
//   quote  {time, effects[]}  quoted before the click (SUI6). Effects are observable categories, never the
//          names of places, people or items the hero has not met (PIR5); `rewardQuote` is the one mapper.

// Default rapport stages, counted in things said. A default with a dial: a world passes its own table.
export const RAPPORT_STAGES = Object.freeze([
    {id: 'stranger', label: 'Stranger', from: 0, opens: 'Small talk and direct questions.'},
    {id: 'acquainted', label: 'Acquainted', from: 1, opens: 'Plain questions about the place and its people.'},
    {id: 'familiar', label: 'Familiar', from: 3, opens: 'Favors and personal topics, where this world allows them.'},
    {id: 'confidant', label: 'Confidant', from: 6, opens: 'Secrets they would not tell a stranger, with their own reasons.'},
]);

// Reward kinds -> what the hero can know before saying the line. Names only when `known(kind, value)` says the
// hero already knows the target; otherwise the category stands alone (the elder's second answer does not name
// the field it points to).
const KINDS = [
    ['textlines', 'Opens more to ask.'],
    ['locations', 'May point you somewhere new.'],
    ['activities', 'May show you something to do.'],
    ['npcs', 'May introduce someone.'],
    ['traders', 'May open trade.'],
    ['stances', 'Teaches a way of fighting.'],
    ['items', 'You receive something.'],
    ['quest_progress', 'Moves one of your journal tasks forward.'],
    ['money', 'Gives you coins.'],
    ['xp', 'Teaches you something.'],
    ['skill_xp', 'Teaches you something.'],
];
export function rewardQuote(rewards = {}, {known = () => false, nameOf = v => String(v?.location ?? v?.item ?? v?.name ?? v ?? '')} = {}) {
    const out = [];
    for (const [kind, text] of KINDS) {
        const value = rewards[kind];
        if (!value || (Array.isArray(value) && !value.length) || (typeof value === 'object' && !Array.isArray(value) && !Object.keys(value).length)) continue;
        const first = Array.isArray(value) ? value[0] : value;
        out.push(known(kind, first) && ['locations', 'items', 'npcs'].includes(kind) ? `${text.replace(/\.$/, '')}: ${nameOf(first)}.` : text);
    }
    return [...new Set(out)];
}

export const NO_TIME = 'No time passes.';
const minutesText = m => m > 0 ? `${m} min` : NO_TIME;

/**
 * lines: [{id, label, state, text?, rewards?, closesOthers?}] already filtered to what the hero sees.
 * Rewards are quoted through rewardQuote; `closesOthers` adds the one structural fact the hero can see.
 */
export function topicsFromLines(lines, {known, nameOf, minutes = () => 0} = {}) {
    return lines.map(line => {
        const effects = line.state === 'new' || line.state === 'locked' ? rewardQuote(line.rewards, {known, nameOf}) : [];
        if (line.closesOthers && line.state === 'new') effects.push('Settles the other ways to put this.');
        return {id: line.id, label: line.label, state: line.state, reason: line.reason || '', recall: line.state === 'heard' ? line.text || '' : '',
            quote: {time: minutesText(minutes(line)), effects}};
    });
}

/** Adapter for cast topic talk: the rows quoteTopicTalks (src/cast_topic_talk.js) returns become topic rows. */
export function topicsFromTopicTalk(quotes, {heard = () => false} = {}) {
    return quotes.map(q => {
        const state = heard(q) ? 'heard' : q.eligible ? 'new' : 'locked';
        return {id: q.id, label: q.label.replace(/ · \d+ min$/, ''), state, reason: q.eligible ? '' : (q.reasons || []).join(' '), recall: '',
            topic: q.topicLabel, quote: {time: minutesText(q.duration), cost: q.costText, effects: q.effectText ? q.effectText.split('; ') : []}};
    });
}

export function rapportOf({heardCount = 0, stages = RAPPORT_STAGES} = {}) {
    let index = 0;
    stages.forEach((s, i) => { if (heardCount >= s.from) index = i; });
    const next = stages[index + 1] || null;
    return {stage: stages[index], index, next, toNext: next ? next.from - heardCount : 0,
        text: next ? `${stages[index].label}. ${Math.max(1, next.from - heardCount)} more to reach ${next.label}: ${next.opens}` : `${stages[index].label}. ${stages[index].opens}`};
}
/** The ladder as a figure spec (src/ui/figure.js track), so the same words and glyphs read everywhere. */
export function rapportFigure(person, rapport, stages = RAPPORT_STAGES) {
    return {id: `rapport-${person.id}`, title: `Rapport with ${person.name}`, size: 360,
        tracks: [{id: 'rapport', label: 'Rapport', steps: stages.map((s, i) => ({label: s.label, state: i < rapport.index ? 'done' : i === rapport.index ? 'current' : 'pending'}))}]};
}

/** What this person now knows of you, as a ledger of sourced rows. `told` rows are your own words, taken from the lines you said. */
export function knowsOfYou({person, topics = [], deeds = [], manner = ''}) {
    const rows = [];
    for (const t of topics) if (t.state === 'heard') rows.push({kind: 'told', source: 'You told them', text: t.label});
    for (const d of deeds) rows.push({kind: 'deed', source: 'They saw', text: d});
    if (manner) rows.push({kind: 'manner', source: 'How they act', text: manner});
    return {rows, empty: rows.length ? '' : `${person.name} has not spoken with you yet, so they know nothing of you.`};
}

/**
 * Witness level decides the text (SUI3, RPT2): present gets the exchange, affected the outcome, aftermath what
 * you find, heard a line marked as told. `who` is the display name as the viewer knew it then (RPT4).
 */
export function witnessLine({witness, who, topic, outcome = ''}) {
    if (witness === 'present') return `${who} and you talked about ${topic}.${outcome ? ` ${outcome}` : ''}`;
    if (witness === 'affected') return outcome || `${who} said something about ${topic} that affects you.`;
    if (witness === 'aftermath') return `${who} seems to have talked about ${topic}.`;
    if (witness === 'heard') return `Word is that ${who} talked about ${topic}.`;
    return '';
}

export function talkModel({person, place = '', topics, hiddenMore = false, stages = RAPPORT_STAGES, deeds = [], manner = '', cheat = false}) {
    const heardCount = topics.filter(t => t.state === 'heard').length;
    const rapport = rapportOf({heardCount, stages});
    const open = topics.filter(t => t.state === 'new' || t.state === 'locked');
    // When every open line takes no time, say it once instead of on each row (UR42); a line with a cost still quotes its own.
    const noTime = open.length > 0 && open.every(t => t.quote.time === NO_TIME);
    return {person, place, rapport, open, noTime, covered: topics.filter(t => t.state === 'heard' || t.state === 'closed'), hiddenMore,
        knows: knowsOfYou({person, topics, deeds, manner}), cheat,
        stakes: open.some(t => t.state === 'new') ? `${person.name} is listening. ${noTime ? 'Saying any of these takes no time. ' : ''}Each line shows what it costs before you say it.` : `${person.name} has nothing new for you right now.`};
}

/** Text form of the whole conversation view (UR37): every visual fact in words. */
export function talkText(model) {
    const q = t => [model.noTime ? '' : t.quote?.time, t.quote?.cost, ...(t.quote?.effects || [])].filter(Boolean).join(' · ');
    const lines = [`${model.person.name}${model.place ? ` · ${model.place}` : ''}`, model.stakes, '', 'You could say:'];
    for (const t of model.open) lines.push(`- ${t.label}${t.state === 'locked' ? ` (not yet: ${t.reason})` : ''}${/[.?!]$/.test(t.label) && t.state !== 'locked' ? '' : '.'} ${q(t)}`);
    if (!model.open.length) lines.push('- Nothing right now.');
    if (model.hiddenMore) lines.push('There may be more to ask as you learn more.');
    if (model.covered.length) { lines.push('', 'Already covered:'); for (const t of model.covered) lines.push(`- ${t.label} (${t.state === 'heard' ? 'heard' : 'settled another way'})`); }
    lines.push('', `Rapport: ${model.rapport.text}`, '', `What ${model.person.name} knows of you:`);
    if (model.knows.rows.length) for (const r of model.knows.rows) lines.push(`- ${r.source}: ${r.text}`); else lines.push(`- ${model.knows.empty}`);
    return lines.join('\n');
}
