// GL4 context case for the emergence harness (chat E with P). Each dusk, two
// places each generate Gu kinds through P's proof grammar with cause `place`,
// and each kind is placed there as a thing. contextFit then asks whether a
// place's aspect raises the share of matching paths above the corpus rate.
// Lives in tests because the grammar is P's test fixture; it moves to
// scripts/emergence_cases.mjs once G owns a Gu kind grammar in src.
//
// Expectation (authored, adjustable): the plan's default that "a place's
// quantities favor what can arise there" (PROCEDURAL_FOUNDATION_PLAN, where
// generation happens). The source shows this case by case (starlight fireflies
// emerge under habitat care, catalogue starlight-firefly; a wild light Gu picks
// a carrier with familiar light-path dao marks, catalogue light); quantified
// rates per place wait on G's habitat rows.
import {readFileSync} from 'node:fs';
import {composeSubstrate, createWorld} from '../../../src/world_substrate.js';
import {createSkyPack, skyQuantities} from '../../../src/world_sky.js';
import {fitGrammar, generate, overlayGrammar} from '../../../src/procedural_grammar.js';
import {guKindGrammarV2, labelGuRow} from '../procedural_grammar/gu_kind_grammar.mjs';

const DAY = 1440, DUSK = 1200, PER_DUSK = 6;
const slice = JSON.parse(readFileSync(new URL('../procedural_grammar/gu_kind_slice.json', import.meta.url), 'utf8')).rows;
const labelled = slice.map(r => ({id: r.id, ...labelGuRow(r)})).filter(r => r.parts);
const fitted = fitGrammar(guKindGrammarV2, labelled);
export const PLACES = Object.freeze({tidepool: 'water', shrine: 'soul'});
// Share of labelled corpus kinds that carry a path (path is a set slot, so shares can sum past 1).
export const corpusShare = value => labelled.filter(r => r.parts.path.includes(value)).length / labelled.length;

/**
 * `placeOverlay`: test-only positive control. When true the generator weights
 * the place's aspect path up (an overlay with an in-world reason), standing in
 * for P's PGB5 place-driven weights so the metric is shown to detect a lift.
 */
export function contextCase({placeOverlay = false} = {}) {
    const grammarFor = aspect => !placeOverlay ? fitted : overlayGrammar(fitted, {id: `place-${aspect}`,
        reason: `the place is rich in ${aspect}, so ${aspect}-path kinds arise more readily`,
        reweight: {path: {[aspect]: fitted.weights.path.marginal[aspect].weight * 6}}});
    return {
        id: placeOverlay ? 'gl4-context-overlay' : 'gl4-context', days: 4, known: [],
        budget: {searchTrialsPerDay: 400, searchMsPerDay: 2000},
        build({days, seed}) {
            const rules = composeSubstrate({packs: [createSkyPack()]});
            const holders = Object.entries(PLACES).map(([id, aspect]) => ({id, kind: 'place', tags: ['sky', `aspect:${aspect}`], quantities: skyQuantities(0)}));
            const world = createWorld(rules, {clock: 0, holders});
            const schedule = [];
            for (let d = 0; d < days; d++) for (const place of Object.keys(PLACES)) schedule.push({at: d * DAY + DUSK, cause: 'w.place-arising', ops: (w, ctx) => {
                // The generator reads the place as it stands (its aspect tag), never a domain's state.
                const aspect = w.holders[place].tags.find(t => t.startsWith('aspect:')).slice(7);
                const grammar = grammarFor(aspect);
                return Array.from({length: PER_DUSK}, (_, i) => {
                    const made = ctx.search('p.generate', () => {
                        const out = generate(grammar, {root: seed, address: `gl4:${place}:${d}:${i}`, cause: {kind: 'place', id: place}});
                        return {value: out, trials: out.receipt.draws};
                    });
                    ctx.generated({place, cause: made.value.cause, grammar: made.receipt.grammar, parts: made.value.parts, name: made.value.derived.name});
                    return {op: 'holder_add', value: {id: `gu-${place}-${d}-${i}`, kind: 'thing', place, tags: ['gu.kind', ...made.value.parts.path.map(p => `path:${p}`)]}};
                });
            }});
            return {rules, world, schedule};
        },
    };
}
