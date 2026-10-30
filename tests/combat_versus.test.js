import test from 'node:test';
import assert from 'node:assert/strict';
import {fightSituation} from '../src/ui/combat_situation.js';
import {renderVersusRow, versusText} from '../src/ui/combat_versus.js';
import {DUEL_BOARD, BRAWL_BOARD} from '../src/ui/preview/fixtures/combat.js';

class Element {
    constructor(tag, doc) {this.tagName = tag; this.ownerDocument = doc; this.dataset = {}; this.children = []; this.attrs = {}; this.className = ''; this._text = ''; this.props = {};
        this.style = {setProperty: (k, v) => { this.props[k] = v; }};}
    get textContent() {return this._text + this.children.map(c => c.textContent).join('');}
    set textContent(v) {this._text = v; this.children = [];}
    setAttribute(k, v) {this.attrs[k] = String(v);}
    getAttribute(k) {return this.attrs[k] ?? null;}
    append(...nodes) {this.children.push(...nodes);}
    replaceChildren(...nodes) {this.children = []; this.append(...nodes);}
    has(cls) {return this.className.split(/\s+/).includes(cls);}
    find(pred, out = []) {for (const c of this.children) {if (pred(c)) out.push(c); c.find(pred, out);} return out;}
}
const makeDocument = () => {const doc = {createElement: tag => new Element(tag, doc)}; return doc;};
const you = (current, extra = {}) => ({name: 'You', health: {current, max: 40}, speed: 0.8, defense: 2, minDamageShare: .05, damageTaken: 1, sideSize: 1, ...extra});
const duel = () => fightSituation(DUEL_BOARD, you(14), {place: 'Reed causeway'}).versus;
const brawl = () => fightSituation(BRAWL_BOARD, you(5), {place: 'Sunken lane'}).versus;
const draw = versus => {const doc = makeDocument(), host = new Element('div', doc); renderVersusRow(host, versus); return host.children[0];};
const cards = root => root.find(n => n.tagName === 'article');
const chips = (card, kind) => card.find(n => n.has(`versus-chip--${kind}`));

test('one card per opponent in slot order, drawn through the host document', () => {
    const doc = makeDocument(), host = new Element('div', doc), versus = brawl();
    const before = globalThis.document;
    renderVersusRow(host, versus);
    assert.equal(globalThis.document, before);
    const root = host.children[0];
    assert.equal(host.children.length, 1);
    assert.equal(root.dataset.opponents, '4');
    assert.deepEqual(cards(root).map(c => c.dataset.combatSubject), versus.opponents.map(o => o.id));
    assert.deepEqual(cards(root).map(c => c.getAttribute('aria-label')), versus.opponents.map((o, i) => cards(root)[i].getAttribute('aria-label')));
    assert(root.find(n => n.has('versus-side--you')).length === 1 && root.find(n => n.has('versus-side--them')).length === 1);
    assert.equal(root.find(n => n.has('versus-sep'))[0].getAttribute('aria-hidden'), 'true');
    // a second render replaces the first
    renderVersusRow(host, duel());
    assert.equal(host.children.length, 1);
    assert.equal(host.children[0].dataset.opponents, '1');
});

test('unknown opponent shows ??? hp with no bar and an unsized threat word', () => {
    const root = draw(brawl()), c = cards(root)[3];
    assert.equal(c.dataset.known, 'unknown');
    assert(c.textContent.includes('??? hp'));
    assert.equal(c.find(n => n.getAttribute('role') === 'meter').length, 0);
    assert(chips(c, 'threat')[0].textContent.includes('Not sized up'));
    assert(cards(root)[1].find(n => n.getAttribute('role') === 'meter').length === 1);
});

test('a down opponent shows Down and no intent chip', () => {
    const c = cards(draw(brawl()))[0];
    assert.equal(c.dataset.down, 'true');
    assert(chips(c, 'threat')[0].textContent.includes('Down'));
    assert.equal(chips(c, 'intent').length, 0);
    assert.equal(chips(c, 'target').length, 0);
    assert.equal(chips(cards(draw(brawl()))[1], 'intent').length, 1);
});

test('odds chip appears only in the duel, in the model words and numbers', () => {
    const d = cards(draw(duel()))[0], o = duel().opponents[0].odds;
    assert.equal(chips(d, 'odds').length, 1);
    assert.equal(chips(d, 'odds')[0].textContent, `You hit ${o.youWord} ${o.you}% · It hits you ${o.themWord} ${o.them}%`);
    for (const c of cards(draw(brawl()))) assert.equal(chips(c, 'odds').length, 0);
});

test('lethal chip carries the pulse class and the words Could down you', () => {
    const lethal = cards(draw(duel())).concat(cards(draw(brawl()))).flatMap(c => chips(c, 'threat')).filter(c => c.textContent.includes('Could down you'));
    assert(lethal.length >= 1);
    for (const c of lethal) assert(c.has('fig-fx--pulse'));
    const others = cards(draw(brawl())).flatMap(c => chips(c, 'threat')).filter(c => !c.textContent.includes('Could down you'));
    for (const c of others) assert(!c.has('fig-fx--pulse'));
});

test('hp bars expose meter values and the fill custom property', () => {
    const root = draw(duel()), bars = root.find(n => n.getAttribute('role') === 'meter');
    assert.equal(bars.length, 2);
    for (const b of bars) {assert.equal(b.getAttribute('aria-valuemin'), '0'); assert.match(b.props['--versus-fill'], /^\d+%$/);}
});

test('versusText names every opponent, and the unknown one leaks no numbers', () => {
    const versus = brawl(), text = versusText(versus), lines = text.split('\n');
    for (const o of versus.opponents) assert(text.includes(o.name));
    assert(lines.length >= 1 + versus.opponents.length);
    const unknown = lines.find(l => l.includes(versus.opponents[3].name));
    assert(unknown.includes('??? hp'));
    assert.doesNotMatch(unknown, /\d/.test(versus.opponents[3].name) ? /^$/ : /\d/);
    assert(!duel().opponents[0].odds || versusText(duel()).includes('%'));
    assert(!text.includes('%'));
    if (versus.together) assert(text.includes(versus.together.text));
});

test('a downed opponent reads "Down" once in the text form', async () => {
    const {versusText} = await import('../src/ui/combat_versus.js');
    const {fightSituation} = await import('../src/ui/combat_situation.js');
    const {BRAWL_BOARD} = await import('../src/ui/preview/fixtures/combat.js');
    const text = versusText(fightSituation(BRAWL_BOARD, {name: 'You', health: {current: 30, max: 40}, speed: .8, defense: 2, sideSize: 1}).versus);
    assert.match(text, /^Mire hound A\. Down\.$/m);
});
