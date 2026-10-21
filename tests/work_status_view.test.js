import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {createWorkStatusView,normalizeWorkStatus} from '../src/work_status_view.js';

test('native work shows completed portion, named stage and truthful paused reason without moving',()=>{
    const dom=createDom();dom.loadHTML('<html><body></body></html>');
    const view=createWorkStatusView(dom.document);
    view.update({subject:'repair:e2.9',label:'Repairing shears',total:20,remaining:8,unit:'minutes',stage:{index:1,count:1,label:'hand repair'}});
    assert.match(view.node.textContent,/12 of 20 minutes complete · 8 remain · Stage 1 of 1: hand repair/);
    view.update({subject:'repair:e2.9',label:'Repairing shears',total:20,remaining:8,unit:'minutes',pausedReason:'busy with another activity'});
    assert.match(view.node.textContent,/Paused: busy with another activity/);
    assert.equal(view.node.querySelector('[role="progressbar"]').getAttribute('aria-valuenow'),'12');
    view.update({subject:'repair:e2.9',label:'Repairing shears',total:20,remaining:0,unit:'minutes',completionText:'Repair completed'});
    assert.match(view.node.textContent,/Repair completed/);assert.doesNotMatch(view.node.textContent,/Ready to collect/);
});

test('work does not claim readiness or exact boundaries without a native work total',()=>{
    assert.throws(()=>normalizeWorkStatus({subject:'job',label:'Job',remaining:4}),/Invalid work status/);
});
