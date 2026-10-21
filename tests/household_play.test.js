import test from 'node:test';
import assert from 'node:assert/strict';
import {HOUSEHOLD as H, planHousehold, householdAnimalView, validateHousehold} from '../src/absorb_p23/household/model.js';
import {householdPresentation, preflightHouseholdImport} from '../src/absorb_p23/household/host.js';

const cloth=JSON.stringify({id:'Linen cloth',quality:75});
function rig(){
    let state;
    const context={sequence:0,clock:40,homeId:'base.frontier:Shack',homeOwned:true,atHome:true,alive:true,controlled:true,
        animalKnown:true,hearthOwned:true,ownedInventory:{[cloth]:1},knownGift:false};
    const run=(type,extra={})=>{const result=planHousehold(state,{type,clock:context.clock,sequence:context.sequence+1,...extra},context);state=result.state;context.sequence++;return result;};
    run('meet');
    return {context,run,state:()=>state,tick(n){context.clock+=n;return run('tick',{elapsed:n});}};
}

test('play learns a lasting preference through the real household plan, with no cloth spend or second reward',()=>{
    const r=rig(),before=structuredClone(r.context.ownedInventory);
    assert.equal(householdAnimalView(r.state(),r.context).preference,null);
    assert.throws(()=>r.run('play'),/five played/);
    r.tick(5);const result=r.run('play');
    assert.equal(r.state().animal.playVisits,1);assert.equal(r.state().animal.bond,20);
    assert.equal(result.effects.some(e=>e.type==='item'),false);assert.deepEqual(r.context.ownedInventory,before);
    assert.equal(householdAnimalView(r.state(),r.context).preference,'Likes chasing a trailing cloth.');
    assert.throws(()=>r.run('pet'),/five played/);
    assert.throws(()=>r.run('play'),/five played/);
    assert.equal(r.state().animal.playVisits,1);
});

test('current native custody and presence are rechecked after an eligible play preview',()=>{
    const r=rig();r.tick(5);
    const input={household:r.state(),context:r.context,furnitureInput:{state:{},locationId:'Shack'}};
    assert.equal(householdPresentation(input).sections[0].actions.find(a=>a.command.id==='play').enabled,true);
    delete r.context.ownedInventory[cloth];const before=structuredClone(r.state());
    assert.throws(()=>r.run('play'),/own usable Linen cloth/);assert.deepEqual(r.state(),before);
    r.context.ownedInventory[cloth]=1;
    for(const flag of ['atHome','homeOwned','controlled','alive','animalKnown']){
        r.context[flag]=false;assert.throws(()=>r.run('play'));r.context[flag]=true;
        assert.deepEqual(r.state(),before);
    }
    r.state().hearth.smokeOptIn=true;r.state().hearth.smoke=1;
    assert.throws(()=>r.run('play'),/safely here/);
    assert.equal(householdAnimalView(r.state(),r.context).posture,'Moss waits outside the smoky room.');
});

test('restoration preserves learned play exactly and never invents old preferences',()=>{
    const r=rig();const old=JSON.parse(JSON.stringify(r.state()));
    assert.equal(Object.hasOwn(preflightHouseholdImport(old,40,r.context.sequence).animal,'playVisits'),false);
    r.tick(5);r.run('play');const saved=JSON.parse(JSON.stringify(r.state()));
    assert.deepEqual(preflightHouseholdImport(saved,r.context.clock,r.context.sequence),r.state());
    for(const invalid of [-1,1.5,Infinity,saved.animal.interactions]){
        const forged=structuredClone(saved);forged.animal.playVisits=invalid;assert.throws(()=>validateHousehold(forged),/invalid animal/);
    }
    const unknown=householdAnimalView(saved,{...r.context,animalKnown:false});assert.equal(unknown,null);
    assert.equal(householdAnimalView(saved,{...r.context,homeId:'another-home'}),null);
    const before=JSON.stringify(saved);for(let i=0;i<4;i++)householdPresentation({household:saved,context:r.context,furnitureInput:{state:{},locationId:'Shack'}});
    assert.equal(JSON.stringify(saved),before,'inspection cannot create play history or repeat its reward');
});

test('posture follows known current warmth and smoke without a new mood timer',()=>{
    const r=rig();r.tick(5);r.run('play');r.tick(5);r.run('pet');
    assert.equal(householdAnimalView(r.state(),r.context).posture,'Moss settles near your usual resting place.');
    r.context.ownedInventory[H.fuelKey]=1;r.run('light');
    assert.equal(householdAnimalView(r.state(),r.context).posture,'Moss curls up beside the warm hearth.');
    r.run('close_vent');r.run('smoke_on');r.tick(1);
    assert.equal(householdAnimalView(r.state(),r.context).posture,'Moss waits outside the smoky room.');
    r.run('ventilate');assert.equal(householdAnimalView(r.state(),r.context).posture,'Moss curls up beside the warm hearth.');
});
