import test from 'node:test';
import assert from 'node:assert/strict';
import {defineSeparationLaw,validateProcessBatch,validateProcessVessel,normalizeConstituents,
    quoteSeparation,separateProcessBatch,contactProcessVessel,exposeProcessVessel,
    cleanProcessVessel,transferProcessBatch,processConstituentMass,processHeadspace} from '../src/craft_process_separation.js';

const row = (id,phase,amount) => ({id,phase,amount});
const law = (extra={}) => defineSeparationLaw({id:'original.partition',revision:1,
    constituents:{water:{volatilePerVolume:8},restore:{materialEffects:{copper:{to:'harm',permille:500}}},
        harm:{particleSize:10},grit:{particleSize:20},seed:{},active:{},ash:{}},
    costs:Object.fromEntries(['strain','decant','skim','distill','divide'].map(op=>[op,{secondsPerVolume:2,workPerVolume:3,fuelPerVolume:op==='distill'?2:0}])),
    filmRetainPermille:0,filmReleasePerVolume:1,cleanWaterPerAmount:2,cleanWorkPerAmount:3,...extra});
const vessel = (extra={}) => ({id:'pot-a',material:'glass',capacity:100,closure:'open',condenserPermille:0,
    meshSize:5,thermalMass:10,heatTransfer:3,films:[],...extra});
const batch = (extra={}) => ({volume:10,constituents:[row('water','dissolved',80),row('restore','dissolved',20),
    row('harm','dissolved',3),row('harm','suspended',7),row('grit','settled',11)],...extra});
const sum = packets => packets.reduce((n,p)=>n+processConstituentMass(p),0);
const exits = r => [r.product,r.residue,r.vaporCapture,r.exit,r.waste,...r.doses];
const totals = packets => normalizeConstituents(packets.flatMap(p=>p.constituents));

test('straining keeps usable restorative product and dissolved harm while accounting filter cake',()=>{
    const b=batch(),v=vessel(),before=structuredClone({b,v});
    const r=separateProcessBatch(law(),b,{op:'strain'},v);
    assert.deepEqual(r.product.constituents,[row('harm','dissolved',3),row('restore','dissolved',20),row('water','dissolved',80)]);
    assert.deepEqual(r.residue.constituents,[row('grit','settled',11),row('harm','suspended',7)]);
    assert.equal(sum(exits(r)),processConstituentMass(b));
    assert.deepEqual(totals(exits(r)),normalizeConstituents(b.constituents));
    assert.deepEqual({b,v},before);
    assert.deepEqual(r.costs,{seconds:20,work:30,fuel:0});
});

test('decanting leaves settled material, skimming withdraws surface rather than dissolved material',()=>{
    const b=batch({constituents:[...batch().constituents,row('ash','surface',9)]});
    const decant=separateProcessBatch(law(),b,{op:'decant',volume:4},vessel());
    assert.equal(decant.residue.volume,6);
    assert.ok(!decant.product.constituents.some(r=>r.phase==='settled'));
    assert.equal(decant.product.constituents.find(r=>r.id==='restore').amount,8);
    const skim=separateProcessBatch(law(),b,{op:'skim',volume:1},vessel());
    assert.deepEqual(skim.product.constituents,[row('ash','surface',9)]);
    assert.deepEqual(totals(exits(skim)),normalizeConstituents(b.constituents));
});

test('a finer filter upgrade changes actual particle capture without changing dissolved harm',()=>{
    const fine=separateProcessBatch(law(),batch(),{op:'strain'},vessel({meshSize:5}));
    const coarse=separateProcessBatch(law(),batch(),{op:'strain'},vessel({meshSize:30}));
    assert.equal(fine.product.constituents.find(r=>r.id==='harm' && r.phase==='dissolved').amount,3);
    assert.ok(coarse.product.constituents.some(r=>r.id==='grit'));
    assert.ok(!fine.product.constituents.some(r=>r.id==='grit'));
});

test('divide preserves exact integer remainders and sediment makes uneven doses, never a reroll',()=>{
    const b=batch({volume:7,constituents:[row('restore','dissolved',17),row('harm','settled',5)]});
    const r=separateProcessBatch(law(),b,{op:'divide',doses:3},vessel());
    assert.deepEqual(r.doses.map(p=>p.volume),[3,2,2]);
    assert.deepEqual(r.doses.map(p=>p.constituents.find(r=>r.id==='restore').amount),[7,5,5]);
    assert.deepEqual(r.doses.map(p=>p.constituents.find(r=>r.id==='harm')?.amount??0),[0,0,5]);
    assert.equal(processConstituentMass(r.product),0);
    assert.deepEqual(totals(exits(r)),normalizeConstituents(b.constituents));
    assert.deepEqual(r,separateProcessBatch(law(),structuredClone(b),{op:'divide',doses:3},vessel()));
});

test('split then repeat separation cannot duplicate trace remainders across varied batch sizes',()=>{
    for(let volume=1;volume<=31;volume++) for(let amount=1;amount<=17;amount++) {
        const b={volume,constituents:[row('restore','dissolved',amount),row('harm','settled',3)]};
        const r=separateProcessBatch(law({filmRetainPermille:137}),b,{op:'divide',doses:Math.min(volume,5)},vessel());
        assert.equal(sum(exits(r))+processConstituentMass({constituents:r.vessel.films}),amount+3);
        assert.equal(exits(r).reduce((n,p)=>n+p.volume,0),volume);
    }
});

test('distillation captures only volatile components; better condenser changes yield, exits remain accounted',()=>{
    const b=batch();
    const r=separateProcessBatch(law(),b,{op:'distill',volume:5},vessel({closure:'reflux',condenserPermille:600}));
    assert.deepEqual(r.product,{volume:3,constituents:[row('water','dissolved',24)]});
    assert.deepEqual(r.exit,{volume:2,constituents:[row('water','vapor',16)]});
    assert.ok(r.residue.constituents.some(r=>r.id==='restore' && r.amount===20));
    assert.equal(sum(exits(r)),processConstituentMass(b));
    const upgraded=separateProcessBatch(law(),b,{op:'distill',volume:5},vessel({closure:'reflux',condenserPermille:1000}));
    assert.equal(upgraded.product.volume,5);
    assert.equal(processConstituentMass(upgraded.product),40);
    assert.equal(r.costs.fuel,10);
});

test('closure prevents evaporation, open vessel exits vapor and reflux captures condensate',()=>{
    const b=batch();
    const sealed=exposeProcessVessel(law(),b,vessel({closure:'sealed'}),{evaporateVolume:5,airUnits:10});
    assert.deepEqual(sealed.batch,validateProcessBatch(b));
    assert.equal(sealed.exit.volume,0);
    const open=exposeProcessVessel(law(),b,vessel(),{evaporateVolume:2});
    assert.equal(open.exit.volume,2); assert.equal(open.vaporCapture.volume,0);
    assert.equal(sum([open.batch,open.exit,open.vaporCapture]),processConstituentMass(b));
});

test('condensation integer carry makes interval partition and JSON roundtrip equivalent',()=>{
    const b=batch({volume:20}),v=vessel({closure:'reflux',condenserPermille:333});
    const whole=exposeProcessVessel(law(),b,v,{evaporateVolume:11});
    let state={batch:b,vessel:v}; const captures=[],escaped=[];
    for(const n of [1,2,1,3,4]) {
        state=exposeProcessVessel(law(),state.batch,state.vessel,{evaporateVolume:n});
        captures.push(state.vaporCapture); escaped.push(state.exit);
        state=JSON.parse(JSON.stringify(state));
    }
    assert.deepEqual(state.batch,whole.batch);
    assert.deepEqual(state.vessel,whole.vessel);
    assert.deepEqual(totals(captures),whole.vaporCapture.constituents);
    assert.deepEqual(totals(escaped),whole.exit.constituents);
    assert.equal(captures.reduce((n,p)=>n+p.volume,0),whole.vaporCapture.volume);
});

test('headspace and received air have an actual selected conversion reader',()=>{
    const l=law({airReaction:{from:'restore',to:'ash',amountPerAirUnit:2}}),b=batch();
    const exposed=exposeProcessVessel(l,b,vessel(),{airUnits:3});
    assert.equal(exposed.batch.constituents.find(r=>r.id==='restore').amount,14);
    assert.equal(exposed.batch.constituents.find(r=>r.id==='ash').amount,6);
    assert.equal(processHeadspace(b,vessel()),90);
    for(const v of [vessel({capacity:10}),vessel({closure:'sealed'})]) {
        assert.deepEqual(exposeProcessVessel(l,b,v,{airUnits:3}).batch,validateProcessBatch(b));
    }
    const first=exposeProcessVessel(l,b,vessel(),{airUnits:1});
    const second=exposeProcessVessel(l,first.batch,first.vessel,{airUnits:2});
    assert.deepEqual(second.batch,exposed.batch);
    assert.throws(()=>exposeProcessVessel(l,b,vessel(),{airUnits:1,evaporateVolume:1}),/separate exposure boundaries/);
});

test('material compatibility refuses without mutation or converts existing matter under selected law',()=>{
    const b=batch(),v=vessel({material:'copper'});
    const r=contactProcessVessel(law(),b,v);
    assert.equal(r.batch.constituents.find(r=>r.id==='restore').amount,10);
    assert.equal(r.batch.constituents.find(r=>r.id==='harm' && r.phase==='dissolved').amount,13);
    assert.equal(processConstituentMass(r.batch),processConstituentMass(b));
    const l=law(); l.constituents.harm.materialEffects={copper:'refuse'};
    const before=structuredClone({b,v});
    assert.throws(()=>quoteSeparation(l,b,{op:'decant'},v),/incompatible/);
    assert.deepEqual({b,v},before);
});

test('shared retained film seeds a useful reaction or harms the next batch with actual quantity',()=>{
    const l=law({filmRetainPermille:100,contactReactions:[{reactants:{seed:1,restore:2},products:{active:3},maxExtent:100}]});
    const first=separateProcessBatch(l,{volume:10,constituents:[row('seed','dissolved',20),row('harm','dissolved',10)]},{op:'decant'},vessel());
    assert.deepEqual(first.vessel.films,[row('harm','dissolved',1),row('seed','dissolved',2)]);
    const second=contactProcessVessel(l,{volume:10,constituents:[row('restore','dissolved',20)]},first.vessel);
    assert.deepEqual(second.batch.constituents,[row('active','dissolved',6),row('harm','dissolved',1),row('restore','dissolved',16)]);
    assert.equal(second.vessel.films.length,0);
    assert.equal(sum([first.product,first.residue,second.batch])+processConstituentMass({constituents:second.vessel.films}),50);
    assert.deepEqual(second.costs,{seconds:10,work:10});
});

test('cleaning pays scaled water/work and sends retained mass to waste, denying an unpaid reset',()=>{
    const v=vessel({films:[row('harm','dissolved',3),row('seed','settled',2)]}),before=structuredClone(v);
    assert.throws(()=>cleanProcessVessel(law(),v,{water:9,work:15}),/water/);
    assert.throws(()=>cleanProcessVessel(law(),v,{water:10,work:14}),/work/);
    assert.deepEqual(v,before);
    const r=cleanProcessVessel(law(),v,{water:10,work:15});
    assert.equal(processConstituentMass(r.waste),5); assert.equal(r.waste.volume,10);
    assert.deepEqual(r.costs,{water:10,work:15}); assert.deepEqual(r.vessel.films,[]);
    const next=contactProcessVessel(law(),batch(),r.vessel);
    assert.deepEqual(next.batch,validateProcessBatch(batch()));
});

test('partial transfer conserves both vessels and refuses overflow, self-transfer and incompatible destination',()=>{
    const l=law({filmRetainPermille:100}),source=batch(),dest={volume:1,constituents:[row('water','dissolved',8)]};
    const va=vessel(),vb=vessel({id:'pot-b',films:[row('seed','settled',2)]});
    const r=transferProcessBatch(l,source,dest,4,va,vb);
    assert.equal(r.source.volume,6); assert.equal(r.destination.volume,5);
    assert.equal(sum([r.source,r.destination,{constituents:r.sourceVessel.films},{constituents:r.destinationVessel.films}]),131);
    assert.throws(()=>transferProcessBatch(l,source,dest,4,va,{...vb,capacity:4}),/capacity/);
    assert.throws(()=>transferProcessBatch(l,source,dest,4,va,va),/distinct/);
    assert.equal(r.source.constituents.find(r=>r.id==='grit').amount,11);
    const incompatible=law({constituents:{...law().constituents,harm:{materialEffects:{copper:'refuse'}}}});
    assert.throws(()=>transferProcessBatch(incompatible,source,dest,4,va,{...vb,material:'copper'}),/incompatible/);
});

test('pouring does not collect trapped vapor and contact with dry residue still costs work',()=>{
    const b=batch({constituents:[...batch().constituents,row('water','vapor',4)]});
    const r=separateProcessBatch(law(),b,{op:'decant'},vessel());
    assert.ok(!r.product.constituents.some(r=>r.phase==='vapor'));
    assert.equal(r.residue.constituents.find(r=>r.phase==='vapor').amount,4);
    const dry=contactProcessVessel(law(),{volume:0,constituents:[row('restore','settled',10)]},vessel({material:'copper'}));
    assert.deepEqual(dry.costs,{seconds:1,work:1});
});

test('capacity upgrades and operation costs read real load; quote does not change state or take a draw',()=>{
    const b=batch({volume:20}),v=vessel({capacity:10});
    assert.throws(()=>quoteSeparation(law(),b,{op:'strain'},v),/capacity/);
    const big=quoteSeparation(law(),b,{op:'strain'},vessel({capacity:20}));
    const small=quoteSeparation(law(),batch(),{op:'strain'},vessel());
    assert.equal(big.costs.work,small.costs.work*2);
    const before=JSON.stringify({b,v});
    assert.deepEqual(quoteSeparation(law(),b,{op:'strain'},vessel()),quoteSeparation(law(),b,{op:'strain'},vessel()));
    assert.equal(JSON.stringify({b,v}),before);
});

test('invalid amounts, phases, transfer sizes and unsupported distillation reject explicitly',()=>{
    for(const amount of [-1,NaN,Infinity,0.5,Number.MAX_SAFE_INTEGER+1]) assert.throws(()=>validateProcessBatch({volume:1,constituents:[row('water','dissolved',amount)]}),/integer/);
    assert.throws(()=>validateProcessBatch({volume:1,constituents:[row('water','magical',1)]}),/phase/);
    assert.throws(()=>validateProcessVessel(vessel({remainders:{water:1000}})),/remainder/);
    assert.throws(()=>quoteSeparation(law(),batch(),{op:'distill'},vessel()),/capture/);
    assert.throws(()=>quoteSeparation(law(),batch(),{op:'divide',doses:11},vessel()),/Dose/);
    assert.throws(()=>quoteSeparation(law(),batch(),{op:'decant',volume:11},vessel()),/exceeds/);
    assert.throws(()=>defineSeparationLaw({...law(),airReaction:{from:'restore',to:'restore',amountPerAirUnit:1}}),/distinct/);
});
