import test from 'node:test';
import assert from 'node:assert/strict';
import {createPaletteFeedbackLedger} from '../src/palette_feedback.js';
import {createReceiptGate, installCoinFeedback} from '../src/settled_text_effects.js';

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

// Purse repaints happen every tick. Ineligible changes must not force layout,
// while an eligible spend still gets one receipt for the exact current delta.
test('coin feedback skips layout for non-spends and keeps eligible spend feedback', () => {
    const keys = ['document', 'MutationObserver', 'getComputedStyle', 'setTimeout'];
    const originals = keys.map(key => Object.getOwnPropertyDescriptor(globalThis, key));
    let notify, layouts = 0;
    const listeners = new Map(), floats = [], purse = {textContent: 'Your purse contains: 10C', getBoundingClientRect: () => ({left: 0, right: 100, width: 100, top: 0, height: 20})};
    const rect = () => ({left: 0, right: 50, width: 50, height: 20});
    globalThis.document = {hidden: false, documentElement: {dataset: {}},
        addEventListener: (type, fn) => listeners.set(type, fn), removeEventListener: type => listeners.delete(type),
        createElement: () => ({style: {}, setAttribute() {}, getBoundingClientRect: rect, remove() {}}),
        createRange: () => ({selectNodeContents() {}, getBoundingClientRect: rect}),
        body: {append: node => floats.push(node)}};
    globalThis.MutationObserver = class {constructor(fn) {notify = fn;} observe() {} disconnect() {}};
    globalThis.getComputedStyle = () => {layouts++; return {visibility: 'hidden'};};
    globalThis.setTimeout = () => 0;
    let feedback;
    try {
        feedback = installCoinFeedback({purse, screen: {}});
        notify(); purse.textContent = 'Your purse contains: 12C'; notify();
        purse.textContent = 'Your purse contains: 11C'; notify(); // Automatic charges default to no float.
        assert.equal(layouts, 0); assert.equal(floats.length, 0);
        listeners.get('pointerdown')({isTrusted: true});
        purse.textContent = 'Your purse contains: 8C'; notify();
        assert.equal(floats.length, 1); assert.equal(floats[0].textContent, '−3C');
        notify(); assert.equal(floats.length, 1); assert.equal(layouts, 1);
    } finally {
        feedback?.destroy();
        keys.forEach((key, i) => {if (originals[i]) Object.defineProperty(globalThis, key, originals[i]); else delete globalThis[key];});
    }
});

test('a scene cue shows its sentence once: the kept line carries the words and is outlined, with no card over it, and goes when it stops being true (UR147)', async () => {
    const {createQuietPlaceDetail} = await import('../src/quiet_place_detail.js');
    class El {
        constructor(tag) { this.tagName = tag; this.children = []; this.parent = null; this.dataset = {}; this.textContent = ''; this.hidden = false; this.style = {setProperty() {}};
            this.classList = {add() {}, remove() {}, contains: () => false, toggle() {}}; this.ownerDocument = doc; }
        setAttribute() {} removeAttribute() {}
        append(...nodes) { for (const n of nodes) { n.parent = this; this.children.push(n); } }
        insertBefore(n) { this.append(n); }
        remove() { if (this.parent) this.parent.children = this.parent.children.filter(c => c !== this); }
        replaceChildren(...nodes) { this.children = []; this.append(...nodes); }
        contains(n) { return n === this || this.children.some(c => c.contains(n)); }
        getBoundingClientRect() { return {left: 0, top: 0, width: 0, height: 0}; }
        animate() { return {finished: new Promise(() => {}), cancel() {}}; }
    }
    const doc = {hidden: false, createElement: tag => new El(tag), createElementNS: (_, tag) => new El(tag), addEventListener() {}, removeEventListener() {}};
    const original = Object.getOwnPropertyDescriptor(globalThis, 'document');
    Object.defineProperty(globalThis, 'document', {configurable: true, value: doc});
    try {
        const host = new El('div');
        const view = {knownVillage: true, raining: true, placeId: 'Village', effects: 'full', now: 1000};
        const detail = createQuietPlaceDetail({container: host, read: () => view,
            readSettings: () => ({effects: 'full', presentation: 'inline'})});
        const line = 'Village: Rain reaches the exposed edge.';
        assert.equal(detail.present({type: 'local-scene', subjectId: 'Village', eventId: 'e1', cue: 'rain-exposed', text: line, motif: 'guidance'}), true);
        const all = node => [node, ...node.children.flatMap(all)];
        assert.equal(all(host).filter(node => node.textContent === line).length, 1);
        const card = all(host).find(node => node.className === 'work-ledger-effect');
        assert.equal(card.hidden, true, 'no card floats over the line');
        assert.equal(card.children.length, 0);
        assert.ok(all(host).some(node => node.className === 'work-ledger-target-pulse'), 'the new line is outlined');
        // The kept line ends with what it reports: rain stopping clears a rain line, and any cue ages out.
        view.now = 1010; detail.render();
        assert.equal(all(host).filter(node => node.textContent === line).length, 1, 'still raining, still fresh');
        view.raining = false; detail.render();
        assert.equal(all(host).filter(node => node.textContent === line).length, 0, 'the rain line goes when the rain does');
        const skill = 'Patience improves to 2.';
        detail.present({type: 'competence', subjectId: 'player', eventId: 'e2', text: skill, motif: 'guidance'});
        view.now = 1010 + 59; detail.render();
        assert.equal(all(host).filter(node => node.textContent === skill).length, 1);
        view.now = 1010 + 60; detail.render();
        assert.equal(all(host).filter(node => node.textContent === skill).length, 0, 'a cue ages out after an hour of game time');
    } finally {
        if (original) Object.defineProperty(globalThis, 'document', original);
        else delete globalThis.document;
    }
});
