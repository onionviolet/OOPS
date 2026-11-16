import test from 'node:test';
import assert from 'node:assert/strict';
import {fightSituation, lastLineFor} from '../src/ui/combat_situation.js';
import {renderVersusRow, versusText, sigilPoints} from '../src/ui/combat_versus.js';
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

test('unknown opponent reads Atk ? and ?/? hp inside an empty track (PS130, PS297) with no meter and an unsized threat word', () => {
    const root = draw(brawl()), c = cards(root)[3];
    assert.equal(c.dataset.known, 'unknown');
    assert(c.textContent.includes('Atk ?'), c.textContent);
    const track = c.find(n => n.has('versus-bar--hp'))[0];
    assert.equal(track.dataset.healthKnown, 'false');
    assert.equal(track.find(n => n.has('versus-bar-text'))[0].textContent, '?/? hp');
    const marks = c.find(n => n.has('known-number'));
    assert.deepEqual(marks.map(n => n.dataset.known), ['unknown', 'unknown', 'unknown']);
    assert.match(marks[0].title, /attack: not known yet/);
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

test('the attack timer (DU10) is a meter in words on a standing fighter, and absent on a fallen one', () => {
    const versus = duel(); versus.you.ready = 1; versus.opponents[0].ready = .4;
    const root = draw(versus), timers = root.find(n => n.has('versus-bar--timer'));
    assert.equal(timers.length, 2);
    assert.equal(timers[0].attrs['aria-valuetext'], 'acts next');
    assert.equal(timers[1].attrs['aria-valuetext'], 'winding up');
    assert.equal(timers[1].props['--versus-fill'], '40%');
    versus.opponents[0].down = true;
    assert.equal(draw(versus).find(n => n.has('versus-bar--timer')).length, 1);
});

test('D6: the other side is headed and counted by who stands, allies get their own cards, and each name has a stable sigil', () => {
    const versus = brawl(); versus.opponents[0].down = true;
    versus.you.allies = 2; versus.you.allyCards = [{id: 'a1', name: 'Dunstan', hurt: 'hurt', order: 'Guard me'}, {id: 'a2', name: 'Old Wen', hurt: 'steady', order: null}];
    const root = draw(versus), heads = root.find(n => n.tagName === 'h5');
    assert.deepEqual(heads.map(h => h.textContent), ['Beside you', `Against you · ${versus.opponents.length - 1} of ${versus.opponents.length}`]);
    const allies = root.find(n => n.has('versus-card--ally'));
    assert.deepEqual(allies.map(a => a.dataset.combatSubject), ['a1', 'a2']);
    assert.ok(allies[0].textContent.includes('hurt, told: Guard me'));
    assert.equal(root.find(n => n.has('versus-allies')).length, 0, 'the one-line list gives way to the cards');
    assert.equal(sigilPoints('The knifeman'), sigilPoints('The knifeman'));
    assert.notEqual(sigilPoints('Wolf rat A'), sigilPoints('Wolf rat B'));
});

test('PS236, PS237: a foe reads in words beside its "?", each "?" names a way to learn it, and a learned attack shows as an estimate', () => {
    const versus = brawl(), o = versus.opponents[3];
    o.sense = 'looks stronger than you, faster than you';
    let c = cards(draw(versus))[3];
    assert.ok(c.textContent.includes('It looks stronger than you, faster than you.'));
    const marks = c.find(n => n.has('known-number'));
    assert.match(marks[0].title, /not known yet\. Watch it fight/);
    assert.match(marks[1].title, /Study one, or ask a hunter/);
    o.numbers = {...o.numbers, atk: 6.2, atkEstimated: true};
    c = cards(draw(versus))[3];
    assert.equal(c.find(n => n.has('known-number'))[0].textContent, '~6.2');
});

test('PS238: a rumoured attack reads "~12, from a rumour" and, once corrected, the rumour shows struck beside the learned number', () => {
    const versus = brawl(), o = versus.opponents[3];
    o.numbers = {...o.numbers, atk: 12, atkEstimated: true, heardFrom: 'A lamplighter swears it.'};
    let c = cards(draw(versus))[3];
    assert.ok(c.textContent.includes('Atk ~12, from a rumour'), c.textContent);
    assert.match(c.find(n => n.has('known-number'))[0].title, /from a rumour: A lamplighter swears it\. It may be wrong\./);
    o.numbers = {...o.numbers, atk: 6, heardFrom: undefined, wasHeard: 12};
    c = cards(draw(versus))[3];
    assert.equal(c.find(n => n.has('versus-was'))[0].textContent, '~12');
    assert.ok(c.textContent.includes('Atk ~12 ~6'), c.textContent);
});

test('PS222: with the fight log on each card, every fighter shows its own latest line; off by default', () => {
    const lines = ['You jab the wolf rat for 3.', 'The wolf rat bites you for 4.', 'Your guard holds.', 'A big rat lunges and misses.'];
    assert.equal(lastLineFor(lines, 'You'), 'Your guard holds.');
    assert.equal(lastLineFor(lines, 'The wolf rat'), 'The wolf rat bites you for 4.');
    assert.equal(lastLineFor(lines, 'Nobody'), null);
    const versus = brawl(); versus.you.last = 'Your guard holds.'; versus.opponents[0].last = 'The wolf rat bites you for 4.';
    assert.equal(draw(versus).find(n => n.has('versus-last')).length, 0, 'off unless chosen');
    const shown = draw({...versus, showLast: true}).find(n => n.has('versus-last')).map(n => n.textContent);
    assert.deepEqual(shown, ['Your guard holds.', 'The wolf rat bites you for 4.']);
});
