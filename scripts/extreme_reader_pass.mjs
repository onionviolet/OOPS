#!/usr/bin/env node
// Extreme-ability reader pass (jojo-readers lane, 2026-11-18). One batch request per ~12,000-word chunk of a held book (AU16): the
// chunk text is the shared evidence, the question comes last. Luna fills the structured fields (AU17), Haiku recalls names only so
// the two can be compared. Chunk text and replies stay in the private folder (gitignored); nothing here reads or writes the repo.
//   OPENAI_API_KEY="$(security find-generic-password -a "$USER" -s openai-api-yairpg -w)" \
//   ANTHROPIC_API_KEY="$(security find-generic-password -a "$USER" -s anthropic-api-yairpg -w)" \
//   node scripts/extreme_reader_pass.mjs <luna|haiku> <jojo|toaru|railgun|wus|mol|ward>... [--dry|--wait|--sync] [--max-usd N] [--pilot N]
import {readFileSync, readdirSync, existsSync, mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {runPass} from './label_runner.mjs';

const ROOT = '/Users/weiwei/code/yet-another-idle-rpg/docs/research/novels/jojo-collection-2026-11-18/readers/';
const TEXT = `${ROOT}text/`, DIR = `${ROOT}private/`;
export const GROUPS = {
    jojo: {label: 'JoJo light novels', files: f => /^jojo_(jorge|purple|over|the_book)/.test(f)},
    toaru: {label: 'A Certain Magical Index', files: f => /^toaru_index_/.test(f)},
    railgun: {label: 'A Certain Scientific Railgun', files: f => /^railgun_/.test(f)},
    wus: {label: 'Wish Upon the Stars', files: f => /^wish_upon_the_stars_/.test(f)},
    mol: {label: 'Mother of Learning', files: f => /^mother_of_learning/.test(f)},
    ward: {label: 'Ward', files: f => /^ward\.json$/.test(f)}};
export const KINDS = ['stand', 'hamon', 'spin', 'power-interaction', 'power-transfer', 'time-loop', 'wish', 'vow', 'conceptual', 'rule-imposing', 'absorb-or-copy', 'cheat-or-override', 'other'];
export const REVEALS = ['demonstrated', 'narrator-explains', 'character-explains', 'deduced-by-character', 'implied', 'not-shown'];
export const SPEAKERS = ['narrator', 'character_claim', 'demonstration', 'unknown'];
const strict = props => ({type: 'object', additionalProperties: false, required: Object.keys(props), properties: props});
export const SCHEMA = strict({abilities: {type: 'array', items: strict({
    name: {type: 'string'}, kind: {type: 'string', enum: KINDS}, holder: {type: 'string'},
    mechanism: {type: 'string'}, trigger_or_condition: {type: 'string'}, cost_or_limit: {type: 'string'}, interaction_with_other_powers: {type: 'string'},
    reveal: {type: 'string', enum: REVEALS}, locator: {type: 'string'}, speaker: {type: 'string', enum: SPEAKERS}})}});
export const RECALL_SCHEMA = strict({names: {type: 'array', items: strict({name: {type: 'string'}, kind: {type: 'string', enum: KINDS}, locator: {type: 'string'}})}});

export const COMMON = `You read one stretch of a novel and report how its extraordinary abilities work. Use only the lines given; each starts with a locator in square brackets, and "locator" copies one such locator exactly.
Report only abilities whose mechanism of action the lines show or state, of these kinds: stand, hamon, spin (JoJo), power-interaction (one power changing, blocking, copying or being changed by another), power-transfer (a power given, taken or moved), time-loop (time reset, repeat or rewind), wish (a wish or request granted by a system, being or object), vow (a binding oath that powers or costs), conceptual (acts on a concept, rule or category rather than a physical thing), rule-imposing (sets a rule others must obey), absorb-or-copy, cheat-or-override (breaks the usual rules of its world), other. Skip plain strength, speed, weapons and ordinary spells with no mechanism beyond a stated effect.
"mechanism" is one or two sentences in your own words saying what the ability does and how, never a quotation. "trigger_or_condition" is what must hold for it to work, "cost_or_limit" what it costs or cannot do, "interaction_with_other_powers" what it beats, is beaten by or combines with; each may be empty when the lines do not say. "reveal" says how the rule became known in these lines. "speaker": narrator, a character who only asserts it, or a scene that shows it. Name an ability the way the text does. Give at most 10 abilities, the ones with the clearest mechanism first. An empty list is a fine answer.`;
export const RECALL = `You read one stretch of a novel and list every named or clearly distinct extraordinary ability, power, technique, contract, wish or rule-bending effect that appears, even briefly, with its kind. Names only; do not describe them. Use the locator of the first line where it appears. Kinds: ${KINDS.join(', ')}. Use only the lines given.`;

/** Paragraph-numbered chunks of at most `limit` words, on chapter boundaries where possible. */
export function chunksOf(book, chapters, limit = 12000) {
    const out = []; let paras = [], words = 0, head = '', pn = 0;
    const flush = () => { if (paras.length) out.push({id: `${book}:${String(out.length + 1).padStart(3, '0')}`, text: paras.join('\n'), words}); paras = []; words = 0; pn = 0; };
    for (const [h, body] of chapters) {
        const lines = body.split('\n').map(s => s.trim()).filter(Boolean); if (!lines.length) continue;
        const w = lines.reduce((s, l) => s + l.split(/\s+/).length, 0);
        if (words && words + w > limit) flush();
        head = h || head;
        for (const l of lines) {
            const lw = l.split(/\s+/).length;
            if (words && words + lw > limit * 1.15) flush();
            paras.push(`[${book}:${String(out.length + 1).padStart(3, '0')}:p${++pn}] ${l}`); words += lw;
        }
    }
    flush(); return out;
}
export function itemsFor(group, recall) {
    const items = [];
    for (const f of readdirSync(TEXT).filter(f => f.endsWith('.json') && GROUPS[group].files(f)).sort((a, b) => a.localeCompare(b, 'en', {numeric: true}))) {
        const book = f.replace(/\.json$/, '').replace(/^(wish_upon_the_stars_)(\d).*/, 'wus$2').replace(/^jojo_/, 'j_').replace(/^toaru_index_/, 'idx_').replace(/_a_superhero.*|_a_cultivation.*/, '').slice(0, 28);
        const chapters = Object.values(JSON.parse(readFileSync(`${TEXT}${f}`, 'utf8')));
        for (const c of chunksOf(book, chapters)) items.push({id: c.id, shared: `Lines (${GROUPS[group].label}):\n${c.text}`,
            user: recall ? `Question: list every extraordinary ability that appears in these lines.` : `Question: which extraordinary abilities in these lines have a mechanism shown or stated, and how do they work?`, words: c.words});
    }
    return items;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const argv = process.argv.slice(2), model = argv[0], groups = argv.filter(a => GROUPS[a]);
    if (!['luna', 'haiku'].includes(model) || !groups.length) throw Error('usage: extreme_reader_pass.mjs <luna|haiku> <group...> [flags]');
    mkdirSync(DIR, {recursive: true});
    const pilot = argv.includes('--pilot') ? Number(argv[argv.indexOf('--pilot') + 1]) : 0;
    const flags = argv.filter(a => !GROUPS[a] && a !== model && a !== '--pilot' && a !== String(pilot));
    for (const group of groups) {
        let items = itemsFor(group, model === 'haiku');
        if (pilot) items = items.filter((_, i) => i % Math.max(1, Math.floor(items.length / pilot)) === 0).slice(0, pilot);
        await runPass({name: `ext_${group}`, dir: DIR, system: model === 'haiku' ? RECALL : COMMON, schema: model === 'haiku' ? RECALL_SCHEMA : SCHEMA,
            items: items.map(({words, ...i}) => i), model: model === 'haiku' ? 'claude-haiku-5-5' : 'gpt-6-luna', effort: 'low', maxTokens: model === 'haiku' ? 4500 : 3500}, flags);
    }
}
