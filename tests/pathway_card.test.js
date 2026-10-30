import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {pathwayCard} from '../src/pathway_card.js';
import {requirementLadder, CROSSING_FAMILY, FAMILIES} from '../src/pathway_requirements.js';
import {crossingTypes} from '../src/ascension_paths.js';
import {REALM_CARD_INPUT} from '../src/ui/preview/fixtures/card_paths.js';
import {setCardArt, cardArtFor} from '../src/pathway_card_art.js';
import {lotmPathwayCard} from '../src/book_world_lotm_card.js';
import {seerPathway, advancementRungs} from '../src/book_world_lotm_path.js';
import {hostOver, fresh, run, at} from './lotm_helpers.js';
import {LOTM_LOCATIONS as L} from '../src/book_world_lotm_ids.js';

// Ratchet (Round 5 P5): the neutral card modules name no world, pathway or lead. Fixtures and adapters are where such words live.
const NEUTRAL = ['src/pathway_requirements.js', 'src/pathway_card.js', 'src/pathway_card_art.js', 'src/ui/pathway_card_view.js'];
const FORBIDDEN = /\b(lotm|seer|clown|mistglass|tingen|nighthawk|evernight|sequence \d|book\.[a-z]+\.[a-z]+|cultivation|hogwarts|reverend|klein|fool)\b/i;
test('card modules name no world, pathway or lead, and the card speaks of the playing character', () => {
    for (const file of NEUTRAL) {
        const hit = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8').split('\n').map((l, i) => [i + 1, l]).find(([, l]) => FORBIDDEN.test(l));
        assert.equal(hit, undefined, `${file}:${hit?.[0]} names a world: ${hit?.[1]?.trim()}`);
    }
    assert.match(pathwayCard(REALM_CARD_INPUT).text, /the playing character/);
});

test('every existing crossing type maps to a family, and the families are the seven of Round 13', () => {
    assert.deepEqual(Object.keys(CROSSING_FAMILY).sort(), [...crossingTypes].sort());
    assert.equal(FAMILIES.length, 7);
    assert.ok(Object.values(CROSSING_FAMILY).every(f => FAMILIES.includes(f)));
});

test('known, partly known and unknown lines show differently and nothing unknown leaks (second world, same card)', () => {
    const card = pathwayCard(REALM_CARD_INPUT), text = card.text;
    const rooted = card.rungs.find(r => r.id === 'rooted'), line = id => rooted.lines.find(l => l.id === id);
    assert.equal(line('breath_hours').state, 'short');
    assert.match(line('breath_hours').text, /Readiness: Hours of seated breathing \(17 of 40\)/);
    assert.equal(line('elder_nod').state, 'partial');
    assert.match(line('elder_nod').text, /Standing: .*partly known/);
    assert.equal(line('elder_nod').routes.length, 0, 'a partly known line shows no ways');
    assert.equal(line('omen').state, 'unknown');
    assert.match(line('omen').text, /^\? Locked: A requirement you do not know yet$/);
    assert.ok(!text.includes('A sign at the river bend'), 'an unknown requirement\'s own words never reach the text');
    // known routes are links to the actions the character can see; a closed action says why
    const tea = pathwayCard({...REALM_CARD_INPUT, held: ['mortal']}).rungs.find(r => r.id === 'gathering').lines.find(l => l.id === 'reed_tea');
    assert.deepEqual(tea.routes.map(r => [r.action, r.available]), [['gather_reed', true]], 'a route whose action the character cannot see is not listed');
    assert.equal(card.rungs.find(r => r.id === 'lantern').lines[0].state, 'partial');
    assert.equal(rooted.lines.find(l => l.family === 'token'), undefined);
    assert.equal(card.rungs.find(r => r.id === 'lantern').lines.find(l => l.family === 'token').state, 'partial', 'a scarce token past the next rung is a name only');
    assert.ok(card.nextSteps.length > 0 && card.nextSteps[0].requirement === 'breath_hours', 'next steps start with the first unmet known requirement');
    assert.match(card.nextSteps[0].text, /Sit in breathing/);
    assert.deepEqual(card.nextSteps[0].quote, {minutes: 60}, 'the quote is the action\'s own duration, nothing invented');
});

test('failure outcomes and the lock way-through come from existing owners', () => {
    const lad = requirementLadder(REALM_CARD_INPUT.graph, REALM_CARD_INPUT);
    const rooted = lad.rungs.find(r => r.id === 'rooted');
    assert.match(rooted.ifShort.outcome, /bottleneck/);
    assert.equal(rooted.requirements.find(r => r.id === 'root_trial').ifShort.outcome, 'A bottleneck injury');
});

test('the art hook is empty without a private pack and resolves under private_packs with one', () => {
    setCardArt(null);
    assert.equal(cardArtFor('x'), null);
    setCardArt({pathways: {x: {emblem: 'pathway-card/e.png', art: 'pathway-card/a.webp', group: 'G'}}});
    assert.deepEqual(cardArtFor('x'), {emblem: {src: 'private_packs/pathway-card/e.png'}, art: {src: 'private_packs/pathway-card/a.webp', alt: ''}, group: 'G'});
    setCardArt(null);
});

// The Seer card over the real host view and the real path, at three discovery states (Round 12 gates 1-3).
function seerCard(p) { return lotmPathwayCard(hostOver(p).host.view(), seerPathway); }
test('the Seer card reads the real host view: dose stage, then allocation, then digestion', () => {
    if (advancementRungs()) return; // the private advancement pack changes the ladder above Sequence 8; this slice checks the public one
    let p = at(fresh(), L.workroom);
    const card0 = seerCard(p);
    assert.ok(card0, 'a Beyonder-track life has a card');
    assert.match(card0.text, /the playing character/);
    const seq9 = card0.rungs.find(r => r.id === 'seq9');
    assert.equal(seq9.state, 'next');
    assert.ok(seq9.lines.some(l => l.family === 'materials' && l.state === 'short'), 'the dose is a short materials line');
    assert.ok(seq9.lines.some(l => l.family === 'condition'), 'a condition line sits beside the dose');
    const seq8 = card0.rungs.find(r => r.id === 'seq8');
    assert.deepEqual(seq8.lines.map(l => l.state), ['unknown'], 'a rung past the next shows one locked line, not the shape of its needs');
    assert.ok(!card0.text.includes('examines the candidate'), 'the examination\'s terms stay hidden before they are learned');
});

test('the Seer card after the first dose: digestion counted, assessment named, examination and dose still partial', () => {
    if (advancementRungs()) return;
    let p = at(fresh(), L.workroom);
    p = run(p, 'report_in'); p = run(p, 'accept_allocation'); p = run(p, 'ingest');
    const card = seerCard(p), seq8 = card.rungs.find(r => r.id === 'seq8');
    assert.equal(card.held, 'Sequence 9 · Seer');
    const acting = seq8.lines.find(l => l.id === 'acting');
    assert.equal(acting.state, 'short');
    assert.match(acting.text, /Readiness: .* \(0 of \d+\)/);
    assert.equal(seq8.lines.find(l => l.id === 'assessment').state, 'short');
    const exam = seq8.lines.find(l => l.id === 'exam');
    assert.equal(exam.state, 'partial');
    assert.match(exam.label, /procedure requirement; its terms are not known yet/);
    assert.ok(seq8.ifShort && /Loss of control/.test(seq8.ifShort.outcome), 'the rung names what going wrong costs');
    assert.ok(!card.rungs.some(r => r.id === 'seq9' && r.lines.length), 'a crossed rung lists no requirements');
    assert.equal(card.nextSteps[0].requirement, 'acting');
    assert.deepEqual(acting.routes.map(r => r.action), ['book.lotm.lesson'], 'the only way the character can see now is the lesson, a real host action');
    assert.match(JSON.stringify(card.rungs.find(r => r.id === 'seq7').lines), /^\[\]$|not known yet|do not know/, 'the stub rung past the ceiling shows nothing real');
});
