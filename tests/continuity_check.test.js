import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {srcRecords, emitClaims, emitWhere, emitIdMap, emitDistinct, compareClaims, applyIdMaps, calendarFindings, scanTree, namesAgree, DIALS} from '../scripts/check_continuity.mjs';

// Pull claims out of source strings the way the scanner does for src/*.js.
function claimsFrom(...files) {
  const claims = [];
  for (const [file, source] of files) for (const r of srcRecords(source)) emitClaims(r, {file, sealed: false}, claims);
  return claims;
}
const codes = fs => fs.map(f => f.code);

test('CTR1: one id with two different names in two files fails; short forms and case do not', () => {
  const bad = compareClaims(claimsFrom(
    ['src/a.js', `export const P = [{id: 'w.person.ann', name: 'Marta Voss'}];`],
    ['src/b.js', `export const P = [{id: 'w.person.ann', name: 'Edith Crane'}];`]));
  assert.deepEqual(codes(bad), ['CTR1']);
  assert.match(bad[0].why, /w\.person\.ann.*Marta Voss.*Edith Crane/);
  const ok = compareClaims(claimsFrom(
    ['src/a.js', `const a = {id: 'w.person.ann', name: 'Zorian Kazinski'}, b = {id: 'w.item.air', name: 'Air Bullet'};`],
    ['src/b.js', `const a = {id: 'w.person.ann', name: 'Zorian'}, b = {id: 'w.item.air', name: 'Air bullet'};`]));
  assert.deepEqual(ok, []);
  assert.ok(namesAgree('Aunt Marge', 'Marge'));
});

test('CTR2: one multi-word name under two ids fails; an indexId link or a one-word name does not', () => {
  const two = claimsFrom(['src/a.js', `const a = {id: 'w.place.privet-drive', name: 'Privet Drive'}, b = {id: 'w.place.cast-1', name: 'Privet Drive'};`]);
  assert.deepEqual(codes(compareClaims(two)), ['CTR2']);
  const linked = claimsFrom(['src/a.js', `const a = {id: 'w.place.privet-drive', name: 'Privet Drive'}, b = {id: 'w.place.cast-1', indexId: 'w.place.privet-drive', name: 'Privet Drive'};`]);
  assert.deepEqual(compareClaims(applyIdMaps(linked)), []);
  const short = claimsFrom(['src/a.js', `const a = {id: 'w.person.t1', name: 'Tom'}, b = {id: 'w.person.t2', name: 'Tom'};`]);
  assert.deepEqual(compareClaims(short), []);
});

test('CTR3: two travel times for one pair fail; direction, tolerance, means and season do not', () => {
  const j = (m, extra = '') => `const r = {id: 'x', from: 'w.place.a', to: 'w.place.b', means: 'walk', minutes: ${m}${extra}};`;
  const jr = m => `const r = {id: 'x', from: 'w.place.b', to: 'w.place.a', means: 'walk', minutes: ${m}};`;
  assert.deepEqual(codes(compareClaims(claimsFrom(['src/a.js', j(25)], ['src/b.js', jr(60)]))), ['CTR3']);
  assert.deepEqual(compareClaims(claimsFrom(['src/a.js', j(25)], ['src/b.js', jr(28)])), []);
  assert.deepEqual(compareClaims(claimsFrom(['src/a.js', j(25)], ['src/b.js', j(60).replace('walk', 'cab')])), []);
  assert.deepEqual(compareClaims(claimsFrom(['src/a.js', j(25, ", season: 'winter'")], ['src/b.js', j(60, ", season: 'summer'")])), []);
});

test('CTR4: one item, two prices, no merchant fails; another merchant or a small gap does not', () => {
  const p = (v, extra = '') => `const i = {id: 'w.item.rope', price: ${v}${extra}};`;
  assert.deepEqual(codes(compareClaims(claimsFrom(['src/a.js', p(5)], ['src/b.js', p(9)]))), ['CTR4']);
  assert.deepEqual(compareClaims(claimsFrom(['src/a.js', p(5, ", merchant: 'iona'")], ['src/b.js', p(9, ", merchant: 'eda'")])), []);
  assert.deepEqual(compareClaims(claimsFrom(['src/a.js', p(100)], ['src/b.js', p(105)])), []);
});

test('CTR5: a label price that is not the charge fails; a matching charge and an income label do not', () => {
  const row = (label, cost) => `const r = {id: 'w.buy', label: '${label}', costs: [{type: 'resource', actor: 'player', key: 'w.coins', amount: -${cost}}]};`;
  const bad = compareClaims(claimsFrom(['src/a.js', row('Buy a log from Iona · 3 coins', 2)]));
  assert.deepEqual(codes(bad), ['CTR5']);
  assert.match(bad[0].why, /label says 3 .*charges 2/);
  assert.deepEqual(compareClaims(claimsFrom(['src/a.js', row('Buy a log · 2 coins', 2)])), []);
  assert.deepEqual(compareClaims(claimsFrom(['src/a.js', row('Deliver a kit · receive 4 coins', 1)])), []);
  const lotm = `const r = {id: 'w.fare', label: 'Hire a cab · 2 soli', costs: [{type: 'resource', actor: 'player', key: 'lotm.pence', amount: -24}]};`;
  assert.deepEqual(compareClaims(claimsFrom(['src/a.js', lotm])), []);
});

test('CTR6: one person, two ages in the same context fail; a different year does not', () => {
  const a = (age, extra = '') => `const p = {id: 'w.person.ann', age: ${age}${extra}};`;
  assert.deepEqual(codes(compareClaims(claimsFrom(['src/a.js', a(34)], ['src/b.js', a(41)]))), ['CTR6']);
  assert.deepEqual(compareClaims(claimsFrom(['src/a.js', a(34, ', year: 1349')], ['src/b.js', a(41, ', year: 1356')])), []);
});

test('CTR7: a calendar row whose day does not follow its date fails', () => {
  const rows = d => srcRecords(`const Y = [{id: 'a', date: '1 September', day: 32}, {id: 'b', date: '18 December', day: ${d}}, {id: 'c', date: '5 January', day: 158}];`);
  assert.deepEqual(calendarFindings('src/cal.js', rows(140)), []);
  const bad = calendarFindings('src/cal.js', rows(150));
  assert.equal(bad.length, 1);
  assert.match(bad[0].why, /18 December but day 150/);
});

test('CTR8: two asserted places at the same hour fail; a rumour, an alias or a later hour does not', () => {
  const row = (place, from, to, label = 'S') => ({actor: 'w.a', place, day: 1, from, to, recurrence: 'once', contentLabel: label, label: 'fill'});
  const run = rows => { const c = []; emitWhere({placeAliases: [{id: 'p.alias', place: 'p.one'}], schedule: rows}, {file: 'f.json', sealed: true}, c); return compareClaims(c); };
  assert.deepEqual(codes(run([row('p.one', 480, 540), row('p.two', 500, 560)])), ['CTR8']);
  assert.deepEqual(run([row('p.one', 480, 540), row('p.two', 540, 600)]), []);
  assert.deepEqual(run([row('p.one', 480, 540), row('p.alias', 500, 560)]), []);
  assert.deepEqual(run([row('p.one', 480, 540), row('p.two', 500, 560, 'U')]), []);
});

test('volume records are history; an ability idMap link merges re-keyed ids; placeholder names are skipped', () => {
  const mk = (file, volume, id, name) => ({kind: 'name', world: 'w', entity: id, attr: 'name', value: name, cls: 'ability', file, where: '.rows[0]', sealed: true, volume});
  assert.deepEqual(compareClaims([mk('a.json', 2, 'w.ability.x', 'Flame jump'), mk('b.json', 3, 'w.ability.x', 'Hearth burst')]), []);
  assert.deepEqual(codes(compareClaims([mk('a.json', null, 'w.ability.x', 'Flame jump'), mk('b.json', null, 'w.ability.x', 'Hearth burst')])), ['CTR1']);
  const two = [mk('a.json', 2, 'w.ability.one', 'Spirit sight'), mk('b.json', 3, 'w.ability.two', 'Spirit sight')];
  assert.deepEqual(codes(compareClaims(two)), ['CTR2']);
  const links = []; emitIdMap({idMap: {'w.ability.two': 'w.ability.one (same ability)'}}, {file: 'l.json', sealed: true}, links);
  assert.deepEqual(compareClaims(applyIdMaps([...two, ...links])), []);
  assert.deepEqual(compareClaims([mk('a.json', null, 'w.anchor.place.1', 'Unresolved forward address'), mk('a.json', null, 'w.anchor.place.2', 'Unresolved forward address')]), []);
});

test('private-pack findings never carry names or text', () => {
  const claims = [];
  for (const [f, name] of [['a.json', 'Secret Person'], ['b.json', 'Other Person']]) emitClaims({props: {id: 'w.person.x', name}, kids: [], where: 'people[0]', listKey: 'people'}, {file: `private_packs/${f}`, sealed: true}, claims);
  const out = compareClaims(claims);
  assert.equal(out.length, 1);
  assert.doesNotMatch(out[0].why, /Secret Person|Other Person/);
  assert.match(out[0].why, /text withheld/);
  assert.doesNotMatch(out[0].key, /w\.person\.x/);
});

test('dials exist for every allowance', () => {
  for (const k of ['priceTolerance', 'travelTolerance', 'nameOverlap', 'contextKeys', 'notFacts', 'assertedLabels', 'duplicateNameMinWords']) assert.ok(k in DIALS, k);
});

test('the current tree passes against the baseline', () => {
  const baseline = JSON.parse(readFileSync(new URL('../scripts/continuity_baseline.json', import.meta.url), 'utf8'));
  const t = Date.now();
  const {findings} = scanTree({withPrivate: existsSync(new URL('../private_packs', import.meta.url))});
  const fresh = findings.filter(f => !(f.key in baseline.findings));
  assert.deepEqual(fresh.map(f => `${f.ref} ${f.code}`), []);
  assert.ok(Date.now() - t < 5000, 'scan stays under 5 seconds');
});

test('CTR2 allow: a distinct list silences a pair of ids, but not a third id', () => {
  const mk = (id, name) => ({kind: 'name', world: 'w', entity: id, attr: 'name', value: name, cls: 'person', file: 'a.json', where: '.p', sealed: true});
  const two = [mk('w.person.a', 'First mate'), mk('w.person.b', 'First mate')];
  const d = []; emitDistinct({distinct: [{ids: ['w.person.a', 'w.person.b'], why: 'different ships'}]}, {file: 'l.json', sealed: true}, d);
  assert.deepEqual(compareClaims(applyIdMaps([...two, ...d])), []);
  assert.deepEqual(codes(compareClaims(applyIdMaps([...two, mk('w.person.c', 'First mate'), ...d]))), ['CTR2']);
});
