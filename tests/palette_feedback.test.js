import test from 'node:test';
import assert from 'node:assert/strict';
import {createPaletteFeedbackLedger} from '../src/palette_feedback.js';
import {createReceiptGate} from '../src/settled_text_effects.js';

test('tool condition changes stay attached to the observed tool copy', () => {
    const ledger = createPaletteFeedbackLedger();
    assert.equal(ledger.observeTool({subjectId: 'tool-a', label: 'Pick', condition: 100, maxCondition: 100, eventId: 'load'}), null);
    const worn = ledger.observeTool({subjectId: 'tool-a', label: 'Pick', condition: 92, maxCondition: 100, eventId: 'wear-1'});
    assert.match(worn.text, /92\/100/);
    assert.equal(ledger.observeTool({subjectId: 'tool-b', label: 'Pick', condition: 92, maxCondition: 100, eventId: 'wear-1'}), null);
});

test('a reset or first observation cannot fabricate prior state', () => {
    const ledger = createPaletteFeedbackLedger();
    ledger.observeTool({subjectId: 'tool-a', condition: 100, maxCondition: 100, eventId: 'initial'});
    ledger.reset();
    assert.equal(ledger.observeTool({subjectId: 'tool-a', label: 'Pick', condition: 40, maxCondition: 100, eventId: 'after-load'}), null);
    assert.equal(ledger.observeReturn({boundaryId: 'first-return-after-reset', subjectId: 'Village', entries: [{id: 'coin', label: 'Coins', value: 3}]}), null);
});

test('return digest needs a real prior baseline and preserves new versus changed entries', () => {
    const ledger = createPaletteFeedbackLedger();
    assert.equal(ledger.observeReturn({boundaryId: 'first-arrival', subjectId: 'village', entries: [{id: 'coin', label: 'Coins', value: 2}]}), null);
    ledger.captureReturnBaseline('village', [{id: 'coin', label: 'Coins', value: 2}, {id: 'pick', label: 'Pick condition', value: '90/100'}]);
    const digest = ledger.observeReturn({boundaryId: 'second-arrival', subjectId: 'village', entries: [
        {id: 'coin', label: 'Coins', value: 3}, {id: 'new', label: 'Rat pelt', value: 1}
    ]});
    assert.match(digest.text, /Coins: 3/);
    assert.match(digest.text, /New Rat pelt: 1/);
    assert.match(digest.text, /No longer present: Pick condition/);
    assert.equal(ledger.observeReturn({boundaryId: 'second-arrival', subjectId: 'village', entries: []}), null);
});

test('activity summaries require and deduplicate a committed boundary', () => {
    const ledger = createPaletteFeedbackLedger();
    assert.equal(ledger.observeActivityBoundary({boundaryId: 'batch-1', activityId: 'harvest', outcome: ''}), null);
    const result = ledger.observeActivityBoundary({boundaryId: 'batch-1', activityId: 'harvest', outcome: 'Processed pelt', destination: 'carried', summary: ['2 Rat pelt']});
    assert.match(result.text, /Output: carried/);
    assert.match(result.text, /2 Rat pelt/);
    assert.equal(ledger.observeActivityBoundary({boundaryId: 'batch-1', activityId: 'harvest', outcome: 'Processed pelt'}), null);
});

test('competence cues need a later increase for the same capability', () => {
    const ledger = createPaletteFeedbackLedger();
    assert.equal(ledger.observeCompetence({subjectId: 'player', capabilityId: 'Fishing', label: 'Fishing', level: 2, causeId: 'level-2'}), null);
    assert.equal(ledger.observeCompetence({subjectId: 'player', capabilityId: 'Fishing', label: 'Fishing', level: 2, causeId: 'level-2'}), null);
    assert.match(ledger.observeCompetence({subjectId: 'player', capabilityId: 'Fishing', label: 'Fishing', level: 3, causeId: 'level-3'}).text, /improves to 3/);
});

test('a hidden-tab receipt is consumed and cannot replay after visibility returns', () => {
    const original = Object.getOwnPropertyDescriptor(globalThis, 'document');
    let hidden = true;
    Object.defineProperty(globalThis, 'document', {configurable: true, value: {get hidden() { return hidden; }}});
    try {
        const gate = createReceiptGate();
        const receipt = {actorId: 'player', subjectId: 'place-a', eventId: 'event-1', type: 'local-scene', text: 'The lamp steadies.'};
        assert.equal(gate(receipt), false);
        hidden = false;
        assert.equal(gate(receipt), false);
        assert.equal(gate({...receipt, eventId: 'event-2'}), true);
    } finally {
        if (original) Object.defineProperty(globalThis, 'document', original);
        else delete globalThis.document;
    }
});

test('body recovery requires an observed amount gain at unchanged capacity; competence has a caused authored pose',()=>{
 const l=createPaletteFeedbackLedger(),body={subjectId:'player',health:10,maxHealth:20,stamina:5,maxStamina:10};
 assert.equal(l.observeBody(body),null);assert.equal(l.observeBody({...body,health:15,maxHealth:25}),null,'capacity growth is not healing');
 const healed=l.observeBody({...body,health:17,maxHealth:25});assert.equal(healed.pose,'recovery');assert.match(healed.text,/Health recovered by 2/);
 assert.equal(l.observeCompetence({subjectId:'player',capabilityId:'Butchering',label:'Butchering',level:1,causeId:'first'}),null);
 const learned=l.observeCompetence({subjectId:'player',capabilityId:'Butchering',label:'Butchering',level:2,causeId:'native-level:2'});assert.equal(learned.pose,'steady-hands');assert.match(learned.text,/next cut/);
 l.reset();assert.equal(l.observeBody(body),null);
});
