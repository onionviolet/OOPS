import test from 'node:test';
import assert from 'node:assert/strict';

// R15 G3 FA10 keyboard defect: starting a timed notebook action with Enter re-opened the
// notebook for attention and moved focus to its first tab, away from the action the player
// was operating. Opening a module must keep focus that is already inside it.
class Element {
    constructor(tag) {this.tagName = tag.toUpperCase(); this.children = []; this.parentElement = null; this.dataset = {}; this.focused = 0; this.style = {};}
    append(...nodes) {for (const n of nodes) {n.parentElement = this; this.children.push(n);}}
    get parentNode() {return this.parentElement;}
    contains(n) {for (let a = n; a; a = a.parentElement) if (a === this) return true; return false;}
    querySelector() {return this.children.find(c => c.tagName === 'BUTTON') || null;}
    focus() {this.focused++; globalThis.document.activeElement = this;}
    scrollIntoView() {}
}

test('opening a module keeps focus already inside it and still focuses it from outside', async () => {
    const previous = globalThis.document;
    const outside = new Element('button');
    const documentElement = {dataset: {}, style: {setProperty() {}, removeProperty() {}}};
    globalThis.document = {createElement: tag => new Element(tag), getElementById: () => null, activeElement: outside, createComment: () => new Element('comment'), documentElement, addEventListener() {}, removeEventListener() {}, querySelector: () => null, querySelectorAll: () => []};
    try {
        const {registerWorkspaceModule, openWorkspaceModule} = await import('../src/workspace_layout.js');
        const home = new Element('div'), node = new Element('section'), tab = new Element('button'), panel = new Element('div'), action = new Element('button');
        node.append(tab, panel); panel.append(action); home.append(node);
        registerWorkspaceModule({id: 'focus_probe', title: 'Probe', node, home});
        openWorkspaceModule('focus_probe');
        assert.equal(document.activeElement, tab, 'opening from outside focuses the first control');
        action.focus();
        openWorkspaceModule('focus_probe');
        assert.equal(document.activeElement, action, 'focus inside the module is preserved');
        assert.equal(tab.focused, 1);
    } finally {globalThis.document = previous;}
});
