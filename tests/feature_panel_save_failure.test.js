import test from 'node:test';
import assert from 'node:assert/strict';

// R15 G3 FA10 durable-failure defect: when the save write failed during a notebook action, the
// game correctly paused, but the panel kept the generic "try again" notice because it only
// re-rendered after a successful command. Retrying could never work; the reload instruction
// must reach the player.
class Element {
    constructor(tag) {Object.assign(this, {tagName: tag.toUpperCase(), children: [], parentElement: null, dataset: {}, attributes: {}, hidden: false, className: '', id: '', textContent: ''});}
    append(...nodes) {for (const n of nodes) {n.remove(); n.parentElement = this; this.children.push(n);}}
    insertBefore(n, ref) {n.remove(); n.parentElement = this; const i = ref ? this.children.indexOf(ref) : -1; i < 0 ? this.children.push(n) : this.children.splice(i, 0, n);}
    remove() {if (this.parentElement) {const c = this.parentElement.children; c.splice(c.indexOf(this), 1); this.parentElement = null;}}
    get isConnected() {return true;}
    setAttribute(k, v) {this.attributes[k] = String(v);} getAttribute(k) {return this.attributes[k] ?? null;} removeAttribute(k) {delete this.attributes[k];}
    addEventListener() {} closest() {return null;}
    contains(n) {for (let a = n; a; a = a.parentElement) if (a === this) return true; return false;}
    focus() {globalThis.document.activeElement = this;}
    *walk() {yield this; for (const c of this.children) yield* c.walk();}
}

test('a failed save during a panel action shows the paused-save instruction, not a retry prompt', async () => {
    const previous = globalThis.document;
    globalThis.document = {createElement: tag => new Element(tag), getElementById: () => null, activeElement: null};
    try {
        const {createFeatureExpansionPanel} = await import('../src/feature_expansion_ui.js');
        const paused = 'Progress paused because saving failed. Free storage and reload before continuing.';
        let error = '', calls = 0;
        const legibility = {id: 'probe.action', label: 'Probe action', status: 'available', control: {visible: true, enabled: true}};
        const panel = createFeatureExpansionPanel({
            read: () => ({state: {sequence: 4, simulation: {sessions: {}}}, error, canWrite: !error}),
            present: () => ({visible: true, sections: [{id: 'probe', label: 'Probe', actions: [{id: 'probe.action', label: 'Probe action', command: {type: 'probe'}, legibility}]}]}),
            command: () => {calls++; error = paused; throw new Error('Injected quota');},
        });
        const button = [...panel.element.walk()].find(n => n.tagName === 'BUTTON' && n.textContent === 'Do this: Probe action');
        assert.ok(button, 'action button rendered');
        button.onclick();
        await new Promise(resolve => setTimeout(resolve, 0));
        assert.equal(calls, 1);
        const texts = [...panel.element.walk()].filter(n => !n.hidden).map(n => n.textContent);
        assert.ok(texts.includes(paused), 'paused-save instruction is shown');
        assert.ok(!texts.some(t => /try again/.test(t)), 'no misleading retry prompt');
    } finally {globalThis.document = previous;}
});
