// Smallest fake DOM that still exercises a real panel lifecycle: tree edits, removal of focused nodes,
// disabled controls, moving an existing panel back into a cleared host, and a captured interval timer.
// Use scripts/headless/dom.mjs (createDom) when a test needs selectors, events or HTML parsing.
// Tests with a deliberately different surface (style, listeners, tag upper-casing, walk()) keep their own class.

/**
 * Build the fake document, run `run(env)` and restore the globals it replaced (document, setInterval, clearInterval).
 * env: {document, host, tick(), isCleared(), replaceHost(), text(node)}. `host` has id `location_actions_div`
 * and is the only child of `document.root`.
 * clearInterval asserts that the id it receives is the one setInterval handed out (1).
 */
export function withPanelDom(run) {
    const previous = {document: globalThis.document, setInterval: globalThis.setInterval, clearInterval: globalThis.clearInterval};
    let tick, cleared = false;
    const document = {activeElement: null};
    class Element {
        constructor(tag) {this.tagName = tag; this.children = []; this.parentElement = null; this.dataset = {}; this.attributes = {}; this.textContent = ''; this.disabled = false;}
        setAttribute(name, value) {this.attributes[name] = String(value);}
        getAttribute(name) {return this.attributes[name] ?? null;}
        contains(node) {return node === this || this.children.some(child => child.contains(node));}
        get isConnected() {return this === document.root || !!this.parentElement?.isConnected;}
        remove() {
            if(this.contains(document.activeElement)) document.activeElement = null;
            if(this.parentElement) this.parentElement.children.splice(this.parentElement.children.indexOf(this), 1);
            this.parentElement = null;
        }
        append(...nodes) {for(const node of nodes) {node.remove(); node.parentElement = this; this.children.push(node);}}
        prepend(node) {node.remove(); node.parentElement = this; this.children.unshift(node);}
        replaceChildren(...nodes) {for(const node of [...this.children]) node.remove(); this.append(...nodes);}
        focus() {if(this.isConnected && !this.disabled) document.activeElement = this;}
        click() {if(!this.disabled) this.onclick?.();}
    }
    document.createElement = tag => new Element(tag);
    document.root = new Element('main');
    const host = new Element('div'); host.id = 'location_actions_div'; document.root.append(host);
    document.getElementById = id => document.root.children.find(node => node.id === id) || null;
    globalThis.document = document;
    globalThis.setInterval = fn => {tick = fn; return 1;};
    globalThis.clearInterval = id => {if(id !== 1) throw new Error(`clearInterval got ${id}, expected the id from setInterval (1)`); cleared = true;};
    const text = node => [node.textContent, ...node.children.map(text)].join(' ');
    try {
        run({document, host, text, tick: () => tick(), isCleared: () => cleared, replaceHost: () => {
            host.remove(); const replacement = new Element('div'); replacement.id = host.id; document.root.append(replacement); return replacement;
        }});
    } finally {
        for(const [key, value] of Object.entries(previous)) {if(value === undefined) delete globalThis[key]; else globalThis[key] = value;}
    }
}
