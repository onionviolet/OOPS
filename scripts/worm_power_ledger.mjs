#!/usr/bin/env node
// Worm power ledger (PWC1-PWC7, docs/research/power-catalogues-2026-11-16/README.md#worm-power-ledger-2026-11-16).
// Builds docs/coverage/worm_powers.jsonl from the committed sidecar docs/coverage/worm_power_labels.json alone, so a clean checkout
// and the test need no private inputs. The sidecar is written by scripts/worm_power_labels.mjs (reader claims, Luna and Haiku passes).
// Usage: node scripts/worm_power_ledger.mjs [--check]
import {readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {foldChapterEffect} from './chapter_effect_tier.mjs';

const dir = new URL('../docs/coverage/', import.meta.url);
export const readSidecar = () => JSON.parse(readFileSync(new URL('worm_power_labels.json', dir), 'utf8'));
// Derived PRT class and number (derive-worm lane): read from the committed worm_prt_derived.json, never recomputed here.
const readPrt = () => { try { return JSON.parse(readFileSync(new URL('worm_prt_derived.json', dir), 'utf8')).derived ?? {}; } catch { return {}; } };
const FIELD_WORDS = {who_may: 'held by', where_from: 'from', go_wrong: 'cost', mind: 'mind', left_behind: 'after death', route_to_player: 'route', knowledge: 'known to'};
const speakerMark = at => (at?.speaker && at.speaker !== 'unknown' ? ` [${at.speaker}${at.locator ? ` ${at.locator.split(' ')[0]}` : ''}]` : '');
// Owner letters from effect_grammar's OBJECT_OWNER, W for the quantity substrate.
const OWNER = {working: 'K', information: 'N', memory: 'N', mind: 'A', force: 'L', lifespan: 'L', luck: 'P', soul: 'L'};

export function buildWormLedger(sidecar = readSidecar(), prt = readPrt()) {
    return Object.entries(sidecar.rows).map(([id, r]) => {
        const g = r.grammar;
        const runs = r.blocked === 'runs-now';
        const state = runs ? 'catalogued' : `blocked:${r.blocked}`;
        const owners = ['P', ...(g && g.valid ? [OWNER[g.object] ?? 'W'] : [])];
        const parts = [`${r.name}${r.aliases.length ? ` (also ${r.aliases.slice(0, 4).join(', ')})` : ''}.`];
        if (r.effect) parts.push(`${r.effect.replace(/[.\s]+$/, '')}.`);
        if (g && g.verb !== 'none') parts.push(`Grammar ${g.verb} ${g.object} ${g.target} ${g.time}${g.valid ? '' : ' (fit invalid)'}${speakerMark(g.at)} (Luna, ${g.checked ? 'checked against PRT class' : 'unchecked'}).`);
        if (r.rating) parts.push(`PRT class ${r.rating.primary} at ${r.rating.source} (held-out label${r.heldOut ? ', held out' : ''}).`);
        if (r.fields) {
            const f = r.fields, say = [];
            for (const k of Object.keys(FIELD_WORDS)) if (!/^(unknown|none-stated|not-stated)$/.test(f[k].value)) say.push(`${FIELD_WORDS[k]} ${f[k].value}${speakerMark(f[k].at)}${f[k].second === 'agree' ? '' : f[k].second === 'differ' ? ' (readers differ)' : ''}`);
            if (say.length) parts.push(`${say.join('; ')}.`);
            for (const k of ['combines', 'counters']) if (r[k]?.value) parts.push(`${k} ${r[k].value}${speakerMark(r[k].at)}.`);
        }
        if (!runs) parts.push(`Missing: ${r.blocked}${r.blockedSecond === 'differ' ? ' (readers differ)' : ''}.`);
        else parts.push('Grammar sentence names a runnable effect; no case yet.');
        const dv = prt[id];
        if (dv) parts.push(`Derived PRT class ${dv.class}${dv.classSet.length > 1 ? ` (set ${dv.classSet.join('/')})` : ''}${dv.rating != null ? `, number ${dv.rating}` : ''} from what the effect does (worm.prt.class-from-effect; not a stated rating).`);
        const source = [...r.sources, ...(r.claimCount > 6 ? [`+${r.claimCount - 6} claims`] : [])].join('; ') || 'denominator:merge-reply';
        const out = {id, source, state, mechanisms: owners, test: null, note: parts.join(' ').replace(/\s*\u2014\s*/g, ', ')};
        if (dv) out.derived = {rule: 'worm.prt.class-from-effect', inputs: ['effect grammar verb, object, target, time', 'effect sentence keywords'], class: dv.class, classSet: dv.classSet, ...(dv.rating != null ? {rating: dv.rating, ratingRule: 'worm.prt.rating-from-reach-and-output'} : {})};
        return foldChapterEffect('worm_powers', out);
    });
}
export const toLedgerText = rows => rows.map(r => JSON.stringify(r)).join('\n') + '\n';
export function summarize(rows) {
    const c = {rows: rows.length, runs: 0, catalogued: 0, blocked: 0, unclassified: 0, slugs: {}};
    for (const r of rows) {
        if (r.state === 'catalogued') c.catalogued++;
        else if (r.state.startsWith('blocked:')) { c.blocked++; c.slugs[r.state.slice(8)] = (c.slugs[r.state.slice(8)] ?? 0) + 1; }
        else if (r.state === 'unclassified') c.unclassified++;
    }
    return c;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const rows = buildWormLedger(), text = toLedgerText(rows);
    if (process.argv.includes('--check')) {
        if (readFileSync(new URL('worm_powers.jsonl', dir), 'utf8') !== text) { console.error('worm_powers.jsonl differs from a fresh build'); process.exit(1); }
    } else writeFileSync(new URL('worm_powers.jsonl', dir), text);
    console.log(JSON.stringify(summarize(rows)));
}
