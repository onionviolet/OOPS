import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {createKnownRoutesPanel} from '../src/known_routes_ui.js';

test('a newly known native route reveals from the workspace hidden vault', () => {
    const saved = {document:globalThis.document, MutationObserver:globalThis.MutationObserver};
    const dom = createDom(); dom.loadHTML('<body><section id="vault" hidden></section></body>');
    globalThis.document = dom.document;
    globalThis.MutationObserver = class {observe() {} disconnect() {}};
    try {
        const container = document.getElementById('vault');
        container.checkVisibility = () => false;
        let known = false;
        const panel = createKnownRoutesPanel({container, read:()=>({canWrite:true}),
            present:()=>known ? {visible:true,section:{current:'Known native destination',routes:[],commitments:[]}} : {visible:false}, command:()=>{throw Error('Reading must not execute a route.');}});
        assert.equal(panel.element.hidden, true);
        known = true; panel.render();
        assert.equal(panel.element.hidden, false);
        assert.match(panel.element.textContent, /Known native destination/);
        known = false; panel.render();
        assert.equal(panel.element.hidden, true);
    } finally {Object.assign(globalThis,saved);}
});
