import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {WORKROOM_TABS, workroomTabModel, mountWorkroomTabs} from '../src/book_world_lotm_tabs.js';

class Element {
    constructor(tag) { this.tagName = tag; this.dataset = {}; this.children = []; this.attrs = {}; this.parent = null; this._text = ''; this.hiddenWrites = 0; this._hidden = false; }
    get hidden() { return this._hidden; }
    set hidden(v) { this.hiddenWrites++; this._hidden = v; }
    get textContent() { return this._text + this.children.map(c => c.textContent).join(''); }
    set textContent(v) { this._text = v; this.children = []; }
    get nextSibling() { const s = this.parent?.children; return s ? s[s.indexOf(this) + 1] ?? null : null; }
    setAttribute(k, v) { this.attrs[k] = String(v); }
    getAttribute(k) { return this.attrs[k] ?? null; }
    append(...ns) { for (const n of ns) { n.parent = this; this.children.push(n); } }
    insertBefore(n, ref) { n.parent = this; const i = ref ? this.children.indexOf(ref) : -1; if (i < 0) this.children.push(n); else this.children.splice(i, 0, n); }
    remove() { if (this.parent) this.parent.children = this.parent.children.filter(c => c !== this); this.parent = null; }
    focus() {}
}
const withDoc = fn => { const prev = globalThis.document; globalThis.document = {createElement: t => new Element(t)}; try { return fn(); } finally { globalThis.document = prev; } };
function setup(filled = ['actions', 'walks', 'path', 'work', 'bench', 'notebook']) {
    const panel = new Element('div'), h2 = new Element('h2'), blocks = {};
    panel.append(h2);
    for (const k of ['actions', 'walks', 'path', 'work', 'bench', 'notebook']) { const b = new Element('div'); if (filled.includes(k)) b.append(new Element('p')); blocks[k] = b; panel.append(b); }
    const notice = new Element('p'); panel.append(notice);
    return {panel, h2, blocks, notice, mount: mountWorkroomTabs({panel, after: h2, blocks})};
}
const off = b => 'tabOff' in b.dataset;
const tab = (m, id) => m.wrapper.children[0].children.find(b => b.dataset.tab === id);

test('model badges and show flag', () => {
    assert.equal(workroomTabModel(null).show, false);
    assert.equal(workroomTabModel({enrolled: false}).show, false);
    const m = workroomTabModel({enrolled: true, jobs: [1, 2], path: {ready: true}, records: [1, 2, 3]});
    assert.equal(m.show, true);
    assert.deepEqual(m.tabs.map(t => t.text), ['Here', 'Path · ready', 'Work & merit · 2 running', 'Notebook · 3']);
    const q = workroomTabModel({enrolled: true, jobs: [], path: {ready: true, capped: true}, records: []});
    assert.deepEqual(q.tabs.map(t => t.badge), ['', '', '', '']);
    assert.equal(Object.isFrozen(WORKROOM_TABS), true);
});

test('mount inserts after the anchor; default tab shows here and hides the rest; clicking flips', () => withDoc(() => {
    const {panel, h2, blocks, mount} = setup();
    assert.equal(panel.children[1], mount.wrapper); assert.equal(h2.nextSibling, mount.wrapper);
    assert.equal(mount.wrapper.dataset.workroomTabs, '');
    assert.equal(mount.wrapper.children[0].getAttribute('aria-label'), 'Workroom sections');
    mount.update({enrolled: true});
    assert(!off(blocks.actions) && !off(blocks.walks));
    for (const k of ['path', 'work', 'bench', 'notebook']) assert(off(blocks[k]), k);
    tab(mount, 'path').onclick();
    assert(!off(blocks.path)); assert(off(blocks.actions) && off(blocks.walks));
    assert.equal(mount.active(), 'path');
    mount.select('work'); assert(!off(blocks.work) && !off(blocks.bench) && off(blocks.path));
    for (const b of Object.values(blocks)) assert.equal(b.hiddenWrites, 0);
}));

test('an empty tab is hidden and an active empty tab falls back to the first non-empty', () => withDoc(() => {
    const {blocks, mount} = setup(['path', 'work']);
    mount.update({enrolled: true});
    assert.equal(tab(mount, 'here').hidden, true); assert.equal(tab(mount, 'notebook').hidden, true);
    assert.equal(tab(mount, 'path').hidden, false);
    assert.equal(mount.active(), 'path'); assert(!off(blocks.path)); assert(off(blocks.work));
}));

test('update with enrolled:false hides the wrapper and clears every tabOff', () => withDoc(() => {
    const {blocks, mount} = setup();
    mount.update({enrolled: true}); assert(off(blocks.path));
    mount.update({enrolled: false});
    assert.equal(mount.wrapper.hidden, true);
    for (const b of Object.values(blocks)) assert(!off(b));
    mount.update({enrolled: true, jobs: [1]});
    assert.equal(mount.wrapper.hidden, false); assert.equal(tab(mount, 'work').textContent, 'Work & merit · 1 running');
}));

test('Got it removes the moved notice', () => withDoc(() => {
    const {mount} = setup();
    const moved = mount.wrapper.children[1];
    assert.equal(moved.dataset.workroomMoved, ''); assert.match(moved.textContent, /^Your path, clearance, merit and the brewing bench now sit under their own tabs\. Got it$/);
    moved.children[0].onclick();
    assert.equal(mount.wrapper.children.length, 1);
}));

test('workroom_tabs.css uses tokens only', () => {
    const css = readFileSync(new URL('../styles/workroom_tabs.css', import.meta.url), 'utf8');
    assert.doesNotMatch(css, /#[0-9a-fA-F]{3,8}\b/); assert.doesNotMatch(css, /rgba?\(/); assert.doesNotMatch(css, /\d\s*px\b/);
    assert.match(css, /\[data-tab-off\]\s*\{\s*display:\s*none !important;\s*\}/);
});
