import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {homeOverviewModel, homeFigureSpec, timeWords} from '../src/home_overview_model.js';
import {renderHomeView} from '../src/ui/home_view.js';
import {figureText} from '../src/ui/figure.js';
import {HOME_COTTAGE_VIEW, HOME_NEST_VIEW, HOME_RENTAL_VIEW, HOME_MANOR_FULL_VIEW, HOME_MANOR_LIMITED_VIEW} from '../src/ui/preview/fixtures/homes.js';

const host = () => { const dom = createDom(); dom.loadHTML('<html><body><div id="host"></div></body></html>'); return dom.document.getElementById('host'); };
const all = (n, f) => [n, ...[...n.children].flatMap(c => all(c, f))].filter(f);
const step = (m, id) => m.fittings.find(f => f.id === id);

test('cottage: fittings name what stands there, rooms show what is built, upkeep is in words', () => {
    const m = homeOverviewModel(HOME_COTTAGE_VIEW);
    assert.equal(step(m, 'sleep').state, 'done');
    assert.match(step(m, 'sleep').note, /Plain bed, Ragwork blanket/);
    assert.equal(step(m, 'study').state, 'empty');
    assert.equal(step(m, 'storage').note.startsWith('12 of '), true);
    assert.deepEqual(m.rooms.map(r => [r.id, r.state]), [['restore', 'done'], ['study', 'empty'], ['guestroom', 'empty'], ['catroom', 'empty']]);
    assert.match(m.upkeep.find(u => u.id === 'soundness').words, /92 of 100 · sound/);
    assert.match(m.weather.words, /sound roof/);
    assert.equal(m.next.length, 0);
});

test('nest in rain: a worn open shelter says it cannot be rested in, with the next step', () => {
    const m = homeOverviewModel(HOME_NEST_VIEW);
    assert.equal(step(m, 'sleep').state, 'broken');
    assert.match(step(m, 'sleep').note, /too worn to rest in/);
    assert.equal(m.upkeep.find(u => u.id === 'soundness').warn, true);
    assert.match(m.weather.words, /^Raining now\. Open to the weather/);
    assert.ok(m.next.some(n => n.id === 'repair'));
    assert.equal(m.fittings.some(f => f.id === 'hearth'), false, 'a bird home offers no hearth row');
    assert.equal(m.rooms.length, 0);
    assert.deepEqual(homeFigureSpec(m).notes.map(n => n.state), ['broken', 'strained'], 'worn roof and full storage are both said');
});

test('rental: lodging time left is stated and warns near the end; a project at a wild site is named', () => {
    const m = homeOverviewModel(HOME_RENTAL_VIEW);
    const lodging = m.upkeep.find(u => u.id === 'lodging');
    assert.match(lodging.words, /^3 hours left · 12 coins a day/);
    assert.equal(lodging.warn, true);
    assert.ok(m.next.some(n => n.id === 'renew'));
    assert.equal(m.sites.length, 1);
    assert.equal(timeWords(0), 'none left');
});

test('the observer decides whether the field chamber is read (UR80)', () => {
    const full = homeOverviewModel(HOME_MANOR_FULL_VIEW), limited = homeOverviewModel(HOME_MANOR_LIMITED_VIEW);
    assert.ok(step(full, 'field'));
    assert.equal(step(limited, 'field'), undefined);
    assert.ok(figureText(homeFigureSpec(limited)).length < figureText(homeFigureSpec(full)).length);
});

test('empty and hidden states explain themselves', () => {
    assert.match(homeOverviewModel({visible: true, homes: []}).empty, /No home yet/);
    assert.equal(homeOverviewModel({visible: false, homes: []}).empty, 'Your known homes are elsewhere.');
    const node = host();
    renderHomeView(node, homeOverviewModel({visible: true, homes: []}));
    assert.match(node.textContent, /No home yet/);
});

test('the view draws the strip, meters with words, household and a hand-off that changes nothing', () => {
    let opened = 0;
    const node = host(), m = homeOverviewModel(HOME_NEST_VIEW);
    renderHomeView(node, m, {onOpenHomes: () => { opened++; }});
    assert.ok(node.classList.contains('home-view'));
    assert.ok(all(node, e => e.getAttribute('data-home-strip') !== null)[0].querySelector('svg'), 'room strip is a figure');
    const meters = all(node, e => e.tagName.toLowerCase() === 'meter');
    assert.ok(meters.length >= 3);
    for (const meter of meters) assert.match(meter.getAttribute('aria-label'), /\d/);
    assert.match(node.textContent, /! 18 of 100 · unfit to sleep in/);
    assert.match(all(node, e => e.getAttribute('data-home-glance') !== null)[0].textContent, /Canopy nest|owned/);
    all(node, e => e.getAttribute('data-open-homes') !== null)[0].click();
    assert.equal(opened, 1);
    assert.equal(all(node, e => e.tagName.toLowerCase() === 'button').length, 1, 'no action buttons here; Homes owns them (UIV4)');
});

test('several homes show a switcher and report the choice', () => {
    const view = {...HOME_COTTAGE_VIEW, homes: [...HOME_COTTAGE_VIEW.homes, ...HOME_RENTAL_VIEW.homes]};
    const m = homeOverviewModel(view, {homeId: 'rental'});
    assert.equal(m.id, 'rental');
    const picked = [], node = host();
    renderHomeView(node, m, {onSelect: id => picked.push(id)});
    const buttons = all(node, e => e.getAttribute('data-home-id'));
    assert.equal(buttons.length, 2);
    assert.equal(buttons.find(b => b.getAttribute('aria-pressed') === 'true').getAttribute('data-home-id'), 'rental');
    buttons[0].click();
    assert.deepEqual(picked, ['cottage']);
});
