// The pathway card as a world-neutral form (book UI wave Round 10, AD46 card form): a group header, an emblem slot, an art slot, a short summary,
// then the ladder with each rung's requirements as known, partly known or locked lines and the ways the character knows of meeting them.
// Pure: it turns a requirement ladder (pathway_requirements.js) and the world's header data into a card model plus a text form.
// Art and emblem images arrive only through `emblem.src` / `art.src`, which a private build supplies (pathway_card_art.js); with none,
// the same layout draws a generated glyph. Nothing here names a world, a pathway or a lead: the viewer is "the playing character".
import {requirementLadder, FAMILY_WORD} from './pathway_requirements.js';

const glyphOf = name => (String(name).match(/[A-Za-z0-9]/)?.[0] ?? '?').toUpperCase();
const STATE_MARK = {met: '✓', short: '·', partial: '~', unknown: '?'};
const RUNG_WORD = {held: 'where the playing character stands', crossed: 'crossed', next: 'next rung', ahead: 'further up'};
export const CARD_NOTE = 'Shown from what the playing character has learned. Locked lines are requirements that exist but are not yet known.';

/** One line's display state: met/short for a known line, partial or unknown otherwise. */
export const lineState = line => line.knownness === 'known' ? (line.met ? 'met' : 'short') : line.knownness;

function lineText(line) {
    const state = lineState(line), mark = STATE_MARK[state];
    if (state === 'unknown') return `${mark} Locked: ${line.label}`;
    const amount = state === 'partial' ? '' : typeof line.need === 'number' ? ` (${line.have} of ${line.need})` : '';
    const tail = [state === 'partial' ? 'partly known' : null, line.irreversible ? 'irreversible' : null, line.provenance === 'fill' || line.provenance === 'emergent' ? line.provenance : null].filter(Boolean);
    return `${mark} ${FAMILY_WORD[line.family]}: ${line.label}${amount}${tail.length ? ` · ${tail.join(', ')}` : ''}`;
}

/**
 * input: {group?, name, emblem?: {glyph?, src?}, art?: {src?, alt?}, summary?, graph, held, facts, knowledge, actions, defs}
 * Returns {group, name, emblem, art, summary, note, rungs[top rung first], nextSteps[], text}.
 */
export function pathwayCard(input) {
    const ladder = requirementLadder(input.graph, input);
    const rungs = ladder.rungs.map(r => ({...r, stateWord: RUNG_WORD[r.state], lines: r.requirements.map(l => ({...l, state: lineState(l), text: lineText(l)}))})).reverse();
    const card = {group: input.group ?? null, name: input.name ?? ladder.label, emblem: {glyph: input.emblem?.glyph ?? glyphOf(input.name ?? ladder.label), src: input.emblem?.src ?? null},
        art: {src: input.art?.src ?? null, alt: input.art?.alt ?? '', glyph: input.emblem?.glyph ?? glyphOf(input.name ?? ladder.label)}, summary: input.summary ?? '', note: CARD_NOTE,
        held: ladder.held, rungs, nextSteps: ladder.nextSteps};
    return {...card, text: cardText(card)};
}

/** The whole card as plain lines, so no fact lives in the drawing alone (UR37). */
export function cardText(card) {
    const out = [card.group ? `${card.group} · ${card.name}` : card.name];
    if (card.summary) out.push(card.summary);
    out.push(card.note, '');
    for (const r of card.rungs) {
        out.push(`${r.label} (${r.stateWord})${r.blocked ? ` · blocked: ${r.blocked}` : ''}${r.ready ? ' · ready' : ''}`);
        if (r.grants.length && r.state !== 'crossed') out.push(`  Gives: ${r.grants.join('; ')}`);
        for (const l of r.lines) {
            out.push(`  ${l.text}`);
            for (const rt of l.routes) out.push(`    Way: ${rt.label}${rt.available ? '' : rt.reason ? ` (${rt.reason})` : ' (not available now)'}${rt.minutes != null ? ` · ${rt.minutes} min` : ''}`);
            if (l.ifShort) out.push(`    If short: ${l.ifShort.signs}. ${l.ifShort.outcome}.`);
        }
        if (r.ifShort) out.push(`  Risk: ${r.ifShort.signs}. ${r.ifShort.outcome}.`);
    }
    if (card.nextSteps.length) out.push('', 'Next steps:', ...card.nextSteps.map((s, i) => `  ${i + 1}. ${s.text}${s.quote ? ` · ${s.quote.minutes} min` : ''}`));
    return out.join('\n');
}
