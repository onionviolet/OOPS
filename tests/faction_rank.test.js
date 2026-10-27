import test from 'node:test';
import assert from 'node:assert/strict';
import {rankOf, rankFacts, rankAllows, lessonFee, quoteStandingLesson, rankRows} from '../src/faction_rank.js';
import {title_by_id, titleBonuses} from '../src/titles.js';
import {SKILL_CATALOGUE} from '../src/skill_expansion_content.js';
import {restoreSavedReputation} from '../src/reputation_state.js';

test('rank is a derived band over signed reputation, with per-region names', () => {
    assert.equal(rankOf('Village', -5).id, 'distrusted');
    assert.equal(rankOf('Village', 0).id, 'stranger');
    assert.equal(rankOf('Village', 49).id, 'known_face');
    assert.equal(rankOf('Village', 50).name, 'Neighbour');
    assert.equal(rankOf('Town', 30).name, 'Regular');
    assert.equal(rankOf('Slums', 50).name, 'Kin');
    assert.equal(rankOf('Village', 5000).next, null);
    assert.equal(rankOf('Nowhere', 10).id, 'known_face');
    // WD2 proposal dial: Village names a Known Face after two watch shifts; other regions keep 10.
    assert.equal(rankOf('Village', 4).id, 'known_face');assert.equal(rankOf('Village', 3).id, 'stranger');assert.equal(rankOf('Town', 4).id, 'stranger');
    assert.equal(rankOf('Village', 'x').id, 'stranger');
});

test('rank gates a service with a reason, and facts expose rank to commands', () => {
    assert.equal(rankAllows('Village', 10, 'trusted').ok, false);
    assert.match(rankAllows('Village', 10, 'trusted').reason, /Trusted/);
    assert.equal(rankAllows('Village', 200, 'trusted').ok, true);
    assert.equal(rankAllows('Village', 0, 'bogus').ok, false);
    const f = rankFacts({Village: 60, Slums: -1});
    assert.equal(f['rank.Village'], 3);
    assert.equal(f['rank.Village.discount'], 1);
    assert.equal(f['rank.Slums.discount'], 0);
});

test('standing prices a lesson and rechecks affordability at quote time', () => {
    assert.equal(lessonFee(2, 'Village', 0), 2);
    assert.equal(lessonFee(2, 'Village', 60), 1);
    assert.equal(lessonFee(1, 'Village', 1000), 0);
    assert.equal(quoteStandingLesson({base: 2, region: 'Village', reputation: 60, money: 1}).affordable, true);
    const stale = quoteStandingLesson({base: 2, region: 'Village', reputation: 60, money: 0});
    assert.equal(stale.affordable, false);
    assert.match(stale.reason, /Neighbour/);
});

test('the inquiry lesson swaps to the neighbour price only at discount rank', () => {
    const inquiry = SKILL_CATALOGUE.find(s => s.id === 'frontier.shared_inquiry');
    assert.deepEqual(inquiry.learnAltIds, ['skills.inquiry.learn_standing']);
});

test('the rank title recognizes standing and grants nothing without a world saying so', () => {
    const t = title_by_id.village_neighbour;
    assert.equal(t.counter, 'rep_village');
    assert.equal(t.at, rankOf('Village', 50).at);
    assert.deepEqual(titleBonuses({village_neighbour: {at: 1}}), {flats: {}, multipliers: {}, xp_multipliers: {}});
});

test('rank rows need no save change: rank derives from the saved integer', () => {
    const saved = restoreSavedReputation({Village: 0}, {Village: 55});
    const [row] = rankRows(saved);
    assert.equal(row.rank, 'Neighbour');
    assert.equal(row.next, 'Trusted at 200');
    assert.deepEqual(rankRows({Village: 0}), []);
});

// Engine path: the lesson command pair, coin spend and gating through the real registry.
import {createExpansionState, advanceSimulation} from '../src/expansion_engine.js';
import {initializeExpedition, expeditionRegistry as registry} from '../src/expedition_content.js';
import {enrollSimulation, commitSimulationCommand} from '../src/simulation.js';
import {skillExpansionContext, skillExpansionPresentation} from '../src/skill_expansion_host.js';

const facts = {location: 'Village', 'village.craftsmanMet': true, 'village.craftsmanPresent': true, 'village.teacherHours': true,
    'village.craftsmanBusy': false, 'village.craftsmanIrritated': false, 'body.handsTender': false, 'campaign.anchor': true};
const fresh = (money, rep) => {
    const p = {state: initializeExpedition(createExpansionState(23)), external: {money},
        gameplay: {player: {inventory: {}, skills: {}, reputation: {Village: rep}}}};
    return enrollSimulation(p.state, registry, mk(p, rep));
};
const mk = (p, rep) => ({actorId: 'player', external: p.external, gameplay: p.gameplay,
    vitals: {player: {health: 30, max_health: 30, stamina: 30, max_stamina: 30}}, facts: {...facts, ...rankFacts({Village: rep})}});
const view = (p, rep) => skillExpansionPresentation(p.state, registry, skillExpansionContext(p.state, mk(p, rep)))
    .families.flatMap(f => f.actions).map(a => ({id: a.id, enabled: a.row.control.enabled, reasons: a.row.reasons.join(' ')}));
const ids = v => v.map(a => a.id).filter(id => id.startsWith('skills.inquiry.learn'));

const adv = (p, rep, n) => {const c = skillExpansionContext(p.state, mk(p, rep));
    const out = advanceSimulation(p.state, registry, n, p.external, p.gameplay, {player: {...c, vitals: c.vitals.player}});
    return {...p, ...out, external: p.external, gameplay: p.gameplay};};
const run = (p, rep, id, minutes) => adv(commitSimulationCommand(p.state, registry, {id}, {...skillExpansionContext(p.state, mk(p, rep)), targetId: 'oldCraftsman'}), rep, minutes);

test('engine: rank swaps the lesson, rechecks coins, and spends the discounted fee', () => {
    let p = run(fresh(1, 0), 0, 'skills.inquiry.observe', 2);
    // Stranger: only the 2-coin lesson shows, and 1 coin cannot pay it.
    let rows = view(p, 0);
    assert.deepEqual(ids(rows), ['skills.inquiry.learn']);
    assert.equal(rows.find(a => a.id === 'skills.inquiry.learn').enabled, false);
    // Neighbour: only the 1-coin lesson shows; it is enabled with 1 coin.
    rows = view(p, 60);
    assert.deepEqual(ids(rows), ['skills.inquiry.learn_standing']);
    assert.equal(rows.find(a => a.id === 'skills.inquiry.learn_standing').enabled, true);
    // Coins gone: the same standing lesson rechecks and disables.
    p.external.money = 0;
    assert.equal(view(p, 60).find(a => a.id === 'skills.inquiry.learn_standing').enabled, false);
    p.external.money = 1;
    p = run(p, 60, 'skills.inquiry.learn_standing', 4);
    assert.equal(p.external.money, 0, 'one coin spent, not two');
    assert.deepEqual(ids(view(p, 60)), [], 'learned: no lesson offered at either price');
    assert.ok(view(p, 60).some(a => a.id === 'skills.inquiry.practice'), 'practice unlocked by the discounted lesson');
});

import {rankChange, promotionText} from '../src/faction_rank.js';

test('a change that crosses a rung reports the promotion; one that does not reports nothing', () => {
    assert.equal(rankChange('Village', 40, 45), null);
    const change = rankChange('Village', 45, 55);
    assert.equal(change.to.name, 'Neighbour');
    assert.match(promotionText('Village', change), /Standing rises in Village: Neighbour/);
    assert.match(promotionText('Village', rankChange('Village', 55, 45)), /Standing falls/);
});
