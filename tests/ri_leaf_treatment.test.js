import test from 'node:test';
import assert from 'node:assert/strict';
import {riLeafQuote, RI_LEAF_NOTE, RI_LEAF_TREATMENT as ID, RI_LEAF_ITEM} from '../src/ri_leaf_treatment.js';
import {riLeadDayFacts, RI_LEAD_DAY as DAY, RI_DAY_ITEMS} from '../src/ri_lead_day_facts.js';
import {guLeadLeafTreatment} from '../src/world_packs/book_gu_lead_leaf_treatment.js';
import {guLeadDay} from '../src/world_packs/book_gu_lead_day.js';
import {meets} from '../src/simulation_contracts.js';
import {createHash} from 'node:crypto';
import {createContentRegistry} from '../src/expansion_engine.js';
import {compileStructuredPack, mergeStructuredPack, registerStructuredCommandExtension} from '../src/structured_pack_definitions.js';
import {guLeadLife} from '../src/world_packs/book_gu_lead_life.js';
test('the bundled leaf gate admits the exact patrol repair and refuses a different target or operation', () => {
    const hash = raw => 'sha256:'+createHash('sha256').update(JSON.stringify(raw)).digest('hex');
    function install(change = () => {}) {
        const registry=createContentRegistry({worlds:[{id:'base.frontier',label:'Home'}]});
        const compiled=compileStructuredPack(guLeadLife,registry);mergeStructuredPack(compiled,registry);
        const base={...compiled.definition,contentHash:hash(guLeadLife),extensions:[{id:DAY}]};
        const raw=structuredClone(guLeadLeafTreatment);change(raw);raw.commands=raw.commands.filter(command=>!command.id.endsWith('.buy'));
        return registerStructuredCommandExtension(raw,hash(raw),base,registry,undefined,{bundledInstant:true});
    }
    assert.ok(install());
    assert.throws(()=>install(raw=>raw.commands[1].effects[0].value=true),/cannot provision/);
    assert.throws(()=>install(raw=>raw.commands[1].effects[0].key=`${DAY}.wolf_at_wall`),/cannot provision/);
    assert.throws(()=>install(raw=>raw.commands[1].id=`${ID}.other`),/cannot provision/);
});
test('a healing leaf settles the catalogue treatment and respects the saved one-hour interval', () => {
    const quote = riLeafQuote(100);
    assert.equal(quote.outcome, 'complete');
    assert.ok(quote.effects.some(effect => effect.kind === 'heal' && effect.amount === 2 && effect.consumed === RI_LEAF_ITEM));
    assert.equal(riLeafQuote(159, 100).outcome, 'interrupted');
    assert.equal(riLeafQuote(160, 100).outcome, 'complete');
    const facts = time => riLeadDayFacts({clock: time, actors: {player: {worldId: 'book.ri.lead.world'}},
        simulation: {knowledge: {player: {[RI_LEAF_NOTE]: {at: 100}}}}});
    assert.equal(facts(159)[`${ID}.ready`], false);
    assert.equal(facts(160)[`${ID}.ready`], true);
});
test('paid treatment consumes one leaf and clears the actual injury read by the next patrol', () => {
    const treat = guLeadLeafTreatment.commands.find(row => row.id === `${ID}.treat`);
    assert.deepEqual(treat.costs, [{type: 'item', actor: 'player', key: JSON.stringify({id: RI_LEAF_ITEM}), amount: -1}]);
    assert.ok(treat.effects.some(effect => effect.key === `${DAY}.injured` && effect.value === false));
    const read = text => JSON.stringify(text);
    assert.match(read(treat.requires), /no patrol wound/);
    assert.match(read(guLeadDay.commands.find(row => row.id === `${DAY}.patrol`).requires), /day\.hurt/);
    const buy = guLeadLeafTreatment.commands.find(row => row.id === `${ID}.buy`);
    assert.deepEqual(buy.costs, [{type: 'item', actor: 'player', key: JSON.stringify({id: RI_DAY_ITEMS.stone}), amount: -2}]);
    const leafRule = treat.requires.all.find(row => row.fact?.startsWith('item.'));
    assert.equal(meets(leafRule, {[leafRule.fact]: 0}), false);
});
