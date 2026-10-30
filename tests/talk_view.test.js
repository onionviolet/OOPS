import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {rewardQuote, topicsFromLines, topicsFromTopicTalk, rapportOf, rapportFigure, knowsOfYou, witnessLine, talkModel, talkText, RAPPORT_STAGES, NO_TIME} from '../src/read_models/talk_bridge.js';
import {nativeTalkLines} from '../src/talk_dialogue_host.js';
import {renderTalkView} from '../src/ui/talk_view.js';
import {validateFigureSpec, figureText} from '../src/ui/figure.js';
import {quoteTopicTalks} from '../src/cast_topic_talk.js';
import {dialogues} from '../src/data/dialogues.js';

class Element {
    constructor(tag, doc) {this.tagName = tag; this.ownerDocument = doc; this.dataset = {}; this.children = []; this.listeners = {}; this.className = ''; this._text = ''; this.attrs = {};}
    get textContent() {return this._text + this.children.map(c => c.textContent).join('');}
    set textContent(v) {this._text = v; this.children = [];}
    append(...nodes) {this.children.push(...nodes); for (const n of nodes) n.parentElement = this;}
    setAttribute(k, v) {this.attrs[k] = v;}
    addEventListener(type, fn) {this.listeners[type] = fn;}
    find(pred, out = []) {for (const c of this.children) {if (pred(c)) out.push(c); c.find(pred, out);} return out;}
}
const makeDocument = () => {const doc = {createElement: tag => new Element(tag, doc)}; return doc;};

// A fresh life in the Village: the real elder's data, only the first line shown.
const elder = dialogues['village elder'];
const labelOf = key => `label:${key}`;
const fresh = () => nativeTalkLines({dialogue: elder, shownKeys: ['hello'], labelOf, answerOf: l => l.text});

test('fresh life: one new line, the rest hidden, nothing named that the hero has not met', () => {
    const {lines, hiddenMore} = fresh();
    assert.deepEqual(lines.map(l => [l.id, l.state]), [['hello', 'new']]);
    assert.equal(hiddenMore, true);
    const topics = topicsFromLines(lines);
    assert.equal(topics[0].quote.time, NO_TIME);
    assert.deepEqual(topics[0].quote.effects, ['Opens more to ask.']);
});

test('a line that unlocks a place and activities quotes the category, never the name (PIR5)', () => {
    const lines = nativeTalkLines({dialogue: elder, shownKeys: ['need to'], labelOf, answerOf: l => l.text}).lines;
    const quote = topicsFromLines(lines)[0].quote.effects.join(' ');
    assert.match(quote, /somewhere new/);
    assert.match(quote, /something to do/);
    assert.doesNotMatch(quote, /Infested|field|weightlifting|running/i);
    // Names appear only when the hero already knows the target.
    const named = rewardQuote({locations: [{location: 'Orchard'}]}, {known: () => true});
    assert.match(named[0], /Orchard/);
});

test('three looks: used lines become heard or settled-another-way and stay readable', () => {
    const lines = nativeTalkLines({dialogue: elder, shownKeys: [], labelOf, answerOf: l => l.text}).lines;
    assert.deepEqual(lines, []);
    const closed = [{id: 'a', label: 'A', state: 'heard', text: 'Answer A'}, {id: 'b', label: 'B', state: 'closed', text: 'x'}, {id: 'c', label: 'C', state: 'new', rewards: {}}];
    const model = talkModel({person: {id: 'p', name: 'Elder'}, topics: topicsFromLines(closed)});
    assert.deepEqual(model.covered.map(t => [t.id, t.state, t.recall]), [['a', 'heard', 'Answer A'], ['b', 'closed', '']]);
    assert.deepEqual(model.open.map(t => t.id), ['c']);
});

test('real elder data: one of three sibling lines said reads as one heard row, not three (rapport counts it once)', () => {
    const keys = ['hello', 'what happened', 'where am i', 'dont remember'];
    const status = k => elder.textlines[k].getAvailabilityComponent(), saved = keys.map(k => [status(k).is_unlocked, status(k).is_locked]);
    try {
        for (const k of keys) { status(k).is_unlocked = true; status(k).is_locked = true; }
        const {lines} = nativeTalkLines({dialogue: elder, shownKeys: [], labelOf, answerOf: l => l.text});
        const heard = lines.filter(l => l.state === 'heard');
        assert.equal(heard.length, 2, 'hello, plus one grouped row for the three siblings');
        assert.match(heard.find(l => l.group)?.label, /^One of: label:what happened \/ label:where am i \/ label:dont remember$/);
        const model = talkModel({person: {id: 'p', name: 'Elder'}, topics: topicsFromLines(lines)});
        assert.equal(model.knows.rows.filter(r => r.kind === 'told').length, 2);
        assert.equal(model.rapport.stage.id, 'acquainted');
    } finally { keys.forEach((k, i) => { [status(k).is_unlocked, status(k).is_locked] = saved[i]; }); }
});

test('rapport stages count things said and name what the next stage opens', () => {
    assert.equal(rapportOf({heardCount: 0}).stage.id, 'stranger');
    assert.equal(rapportOf({heardCount: 3}).stage.id, 'familiar');
    assert.match(rapportOf({heardCount: 1}).text, /2 more to reach Familiar/);
    assert.equal(rapportOf({heardCount: 99}).next, null);
    const spec = rapportFigure({id: 'p', name: 'Elder'}, rapportOf({heardCount: 1}));
    assert.doesNotThrow(() => validateFigureSpec(spec));
    assert.match(figureText(spec), /Acquainted/);
    assert.equal(spec.tracks[0].steps.length, RAPPORT_STAGES.length);
});

test('what they know of you: empty state in words, then sourced rows from what you said and did', () => {
    const empty = knowsOfYou({person: {name: 'Elder'}, topics: []});
    assert.match(empty.empty, /nothing of you/);
    const rows = knowsOfYou({person: {name: 'Elder'}, topics: [{state: 'heard', label: 'My head hurts'}, {state: 'new', label: 'x'}], deeds: ['you delivered a crate'], manner: 'Warmer toward you.'}).rows;
    assert.deepEqual(rows.map(r => r.kind), ['told', 'deed', 'manner']);
});

test('witness level decides the text and never tells more than was perceived (SUI3, RPT2)', () => {
    const base = {who: 'a tall officer', topic: 'the night shift'};
    assert.match(witnessLine({witness: 'present', ...base, outcome: 'He nods.'}), /talked about the night shift\. He nods/);
    assert.match(witnessLine({witness: 'heard', ...base}), /^Word is that a tall officer/);
    assert.doesNotMatch(witnessLine({witness: 'aftermath', ...base, outcome: 'secret'}), /secret/);
    assert.equal(witnessLine({witness: 'nobody', ...base}), '');
});

test('cast topic talk quotes use the same rows: cost, time and effects before the click', () => {
    const quotes = quoteTopicTalks({}, [{id: 'x.a', label: 'Offer help', targetId: 'p', duration: 3, costs: [{type: 'resource', actor: 'player', key: 'money', amount: -1}],
        effects: [{type: 'relationship', actor: 'p', target: 'player', axis: 'trust', amount: 2}], topicTalk: {personId: 'p', topicId: 't', label: 'A task', choiceId: 'a', receiptKey: 'k'}},
        {id: 'x.b', label: 'Ask', targetId: 'p', duration: 1, costs: [], effects: [], topicTalk: {personId: 'p', topicId: 't2', label: 'A route', choiceId: 'b', receiptKey: 'k2'}}],
        d => d.id === 'x.a' ? {visible: true, eligible: true} : {visible: true, eligible: false, reasons: ['Learn about this topic first.']});
    const rows = topicsFromTopicTalk(quotes, {heard: () => false});
    assert.deepEqual(rows.map(r => r.state), ['new', 'locked']);
    assert.match(rows[0].quote.cost, /-1/);
    assert.match(rows[0].quote.effects.join(' '), /trust \+2/);
    assert.equal(rows[1].reason, 'Learn about this topic first.');
});

test('the view draws card, covered and knows columns through the given document and calls the hook', () => {
    const doc = makeDocument(), host = new Element('div', doc), chosen = [];
    const topics = topicsFromLines([{id: 'h', label: 'Hello', state: 'new', rewards: {textlines: [1]}}, {id: 'd', label: 'Done', state: 'heard', text: 'You said it.'}]);
    const model = talkModel({person: {id: 'p', name: 'Elder'}, place: 'Village', topics, hiddenMore: true});
    const root = renderTalkView(host, model, {onChoose: t => chosen.push(t.id)});
    assert.equal(root.dataset.talkPerson, 'p');
    assert.deepEqual(root.children.map(c => c.className), ['talk-covered', 'talk-card-slot', 'talk-knows', 'talk-text']);
    const button = root.find(n => n.tagName === 'button' && n.dataset.topicId === 'h')[0];
    assert.equal(button.dataset.topicState, 'new');
    button.listeners.click();
    assert.deepEqual(chosen, ['h']);
    const text = root.find(n => n.dataset.talkText !== undefined)[0].textContent;
    assert.equal(text, talkText(model));
    assert.match(text, /takes no time/);
    assert.match(text, /Already covered:\n- Done \(heard\)/);
});

test('styles use tokens only (UR6)', () => {
    const css = readFileSync(new URL('../styles/talk_view.css', import.meta.url), 'utf8');
    assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b|rgba?\(|\d+px\b/i);
});
