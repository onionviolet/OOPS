import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {createMeterBar} from '../src/meter_bar.js';

test('resource detail and numeric node remain stable through updates, with truthful roles and states', () => {
    const dom = createDom();dom.loadHTML('<html><body></body></html>');
    const {document} = dom, bar = createMeterBar(document);
    document.body.append(bar.node);
    const spec = {id:'reserve',label:'Spirituality',kind:'pool',value:2,max:3,compact:true,note:'Sleeping restores it.'};
    bar.update(spec);
    const details = bar.node.querySelector('details'), summary = details.querySelector('summary'), meter = bar.node.querySelector('[role="meter"]');
    details.open = true;summary.focus();bar.update({...spec,value:1});
    assert.equal(bar.node.querySelector('details'), details);
    assert.equal(details.open, true);assert.equal(document.activeElement, summary);
    assert.equal(meter.getAttribute('aria-valuenow'), '1');
    assert.match(meter.getAttribute('aria-valuetext'), /low/);
    assert.match(details.textContent, /Sleeping restores it/);
    bar.update({...spec,kind:'track',value:0,max:1});
    assert.match(meter.getAttribute('aria-valuetext'), /not started/);
    assert.equal(meter.getAttribute('role'), 'progressbar');
    bar.update({...spec,kind:'track',value:1,max:1});
    assert.match(bar.node.textContent, /complete/);
    assert.doesNotMatch(meter.getAttribute('aria-valuetext'), /limit/);
});
