import test from "node:test";
import assert from "node:assert/strict";
import {askTypedConfirm} from "../src/typed_confirm.js";

// Minimal element model: enough for the dialog's own wiring.
function fakeDocument() {
    const made = [];
    const el = tag => {
        const node = {tag, children: [], listeners: {}, value: "", disabled: false, open: false,
            append(...kids) { this.children.push(...kids); }, remove() { this.removed = true; },
            showModal() { this.open = true; }, close() { this.open = false; }, focus() {},
            addEventListener(type, fn) { this.listeners[type] = fn; }};
        made.push(node); return node;
    };
    return {made, createElement: el, body: el("body")};
}
const parts = doc => ({input: doc.made.find(n => n.tag === "input"), buttons: doc.made.filter(n => n.tag === "button"), dialog: doc.made.find(n => n.tag === "dialog")});

test("typed confirm resolves true only after the exact word and Confirm", async () => {
    const doc = fakeDocument();
    const answer = askTypedConfirm({title: "t", message: "m", word: "reset", doc});
    const {input, buttons: [, confirm], dialog} = parts(doc);
    assert.ok(dialog.open);
    assert.equal(confirm.disabled, true);
    input.value = "rese"; input.oninput();
    assert.equal(confirm.disabled, true);
    input.value = '"reset"'; input.oninput();
    assert.equal(confirm.disabled, false);
    confirm.onclick();
    assert.equal(await answer, true);
    assert.ok(dialog.removed && !dialog.open);
});

test("typed confirm resolves false on Cancel or Escape", async () => {
    for (const close of [p => p.buttons[0].onclick(), p => p.dialog.listeners.cancel()]) {
        const doc = fakeDocument();
        const answer = askTypedConfirm({title: "t", message: "m", word: "reset", doc});
        const p = parts(doc);
        p.input.value = "reset"; p.input.oninput();
        close(p);
        assert.equal(await answer, false);
    }
});
