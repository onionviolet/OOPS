import test from 'node:test';
import assert from 'node:assert/strict';
import {lampFuelMeterSpec,toolsPanelDiscovered,repairWorkPresentation} from '../src/tools_panel.js';
import {normalizeMeter} from '../src/meter_bar.js';

test('lamp fuel uses a one-flask minutes baseline and reports burn only while shining',()=>{
    assert.equal(lampFuelMeterSpec({held:false,oil:20,baseline:240}),null);
    const spec=lampFuelMeterSpec({held:true,oil:90,baseline:240,rate:{value:-1,unit:'lamp min per played min'}});
    assert.equal(normalizeMeter(spec).max,240);assert.deepEqual(normalizeMeter(spec).annotations,['-1 lamp min per played min']);
    const out=lampFuelMeterSpec({held:true,oil:90,baseline:240,rate:null});
    assert.deepEqual(normalizeMeter(out).annotations,[]);
    assert.match(out.note,/one flask load of 240 minutes/);
});
test('Tools panel is discovered for a carried lamp even with no repairable tool rows',()=>{
    assert.equal(toolsPanelDiscovered([],{held:true}),true);
    assert.equal(toolsPanelDiscovered([],{held:false}),false);
    assert.equal(toolsPanelDiscovered([{key:'e2.1'}],{held:false}),true);
});

test('repair text distinguishes a running clock from a paused job',()=>{
    const job={name:'shears',location:'Village',minutesLeft:9,total:20};
    assert.match(repairWorkPresentation(job,{location:'Village',idle:true}).line,/Time passes/);
    const busy=repairWorkPresentation(job,{location:'Village',idle:false});
    assert.match(busy.line,/Repair paused \(busy with another activity\)/);assert.equal(busy.pausedReason,'busy with another activity');
    assert.match(repairWorkPresentation(job,{location:'Forest',idle:true}).line,/away from the Village bench/);
});
