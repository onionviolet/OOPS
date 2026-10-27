import test from 'node:test';
import assert from 'node:assert/strict';
import {beginContinuation,planContinuation,observeContinuation,validateContinuation,continuationView} from '../src/continuation_state.js';
import {createContinuationHost} from '../src/continuation_host.js';
const fresh=()=>({'game version':'v0.0.1','current time':{year:1,month:1,day:1,hour:8,minute:0},character:{name:'A',money:10,bio:{race:'human'},xp:{total_xp:0}},
    levels:{person:{main_character:{total_xp:0,skill_xp:{Literacy:0,Weightlifting:0}}}},inventories:{person:{main_character:{}}},global_flags:{is_hero_created:true},
    expansion:{actors:{player:{worldId:'base.frontier'}},rng:17,worlds:{'base.frontier':{stock:5}}},options:{font:1},quests:{q:{done:false}}});
const enroll=()=>beginContinuation(fresh(),'test-journey');
let token=0;const cmd=(s,k,args={})=>planContinuation(s,k,{expectedSequence:s.continuation.sequence,token:`event-${++token}`,...args});
test('rewind restores world and body, carries compatible understanding but not conditioning',()=>{
    let s=enroll();s.character.money=1;s.quests.q.done=true;s.expansion.worlds['base.frontier'].stock=0;
    s.levels.person.main_character.skill_xp={Literacy:200,Weightlifting:500};s.options.font=2;
    const n=cmd(s,'initial');
    assert.equal(n.character.money,10);assert.equal(n.quests.q.done,false);assert.equal(n.expansion.worlds['base.frontier'].stock,5);
    assert.equal(n.levels.person.main_character.skill_xp.Literacy,200);assert.equal(n.levels.person.main_character.skill_xp.Weightlifting,0);
    assert.equal(n.continuation.mastery.Weightlifting,500);assert.equal(n.options.font,2);assert.equal(s.character.money,1);
});
test('research progresses only available elapsed time; upgrade survives going before research',()=>{
    let s=cmd(enroll(),'study');s['current time'].minute=6;observeContinuation(s,{canStudy:true});assert.equal(s.continuation.research.minutes,6);
    s['current time'].minute=20;observeContinuation(s,{canStudy:false});assert.equal(s.continuation.research.minutes,6);
    s['current time'].minute=24;observeContinuation(s,{canStudy:true});assert.equal(s.continuation.research.checkpoint,true);
    const n=cmd(s,'initial');assert.equal(n.continuation.research.checkpoint,true);assert.equal(n.continuation.research.running,false);
});
test('checkpoint replacement is explicit and does not change initial; rejected plan preserves source',()=>{
    let s=enroll();assert.throws(()=>cmd(s,'set'),/Investigate/);assert.equal(s.continuation.lives['life-1'].checkpoint,null);
    s.continuation.research.checkpoint=true;s['current time'].minute=20;s=cmd(s,'set');
    s.character.money=90;s['current time'].minute=25;s=cmd(s,'set');
    assert.equal(s.continuation.lives['life-1'].initial.character.money,10);assert.equal(cmd(s,'checkpoint').character.money,90);
});
test('fresh history pauses A intact and reciprocal return restores departure, not old journey',()=>{
    let a=enroll();a.character.money=37;a.current_activity={activity_id:'patrolling',earnings:4};
    let b=cmd(a,'fresh',{fresh:fresh()});assert.equal(b.character.money,10);assert.equal(b.continuation.active,'life-2');
    assert.deepEqual(b.continuation.lives['life-1'].paused.current_activity,a.current_activity);
    b.continuation.research.checkpoint=true;b.levels.person.main_character.skill_xp.Literacy=360;b.character.money=19;
    const r=cmd(b,'resume:life-1');assert.equal(r.character.money,37);assert.equal(r.current_activity.earnings,4);
    assert.equal(r.continuation.research.checkpoint,true);assert.equal(r.levels.person.main_character.skill_xp.Literacy,360);
    assert.equal(r.continuation.lives['life-2'].paused.character.money,19);assert.equal(r.continuation.lives['life-1'].paused,null);
    validateContinuation(JSON.parse(JSON.stringify(r.continuation)));
});
test('no nested catalog; duplicate/stale commands and nonexistent routes rejected',()=>{
    let s=enroll();s=cmd(s,'fresh',{fresh:fresh()});
    assert.equal('continuation' in s.continuation.lives['life-1'].paused,false);
    assert.throws(()=>planContinuation(s,'initial',{expectedSequence:0,token:'stale'}),/stale/);
    assert.throws(()=>cmd(s,'resume:missing'),/No reciprocal/);
    const n=cmd(s,'initial');assert.throws(()=>planContinuation(n,'initial',{expectedSequence:n.continuation.sequence,token:n.continuation.lastTransition.token}),/already/);
    n.continuation.lives[n.continuation.active].initial.continuation={};assert.throws(()=>validateContinuation(n.continuation),/recursive/);
});
test('chosen repeat is distinct from duplicate trigger, remains optional and can be stopped',()=>{
    let s=enroll();assert.throws(()=>cmd(s,'cycle'),/Enable/);s=cmd(s,'loop');assert.equal(s.continuation.loop.enabled,true);
    s['current time'].minute=5;s=cmd(s,'cycle');assert.equal(s.continuation.loop.cycles,1);assert.equal(s.continuation.arrivalPaused,false);
    s=cmd(s,'loop');assert.equal(s.continuation.loop.enabled,false);assert.throws(()=>cmd(s,'cycle'),/Enable/);
});
test('quota/preflight failure never publishes and resumes frozen source',async()=>{
    for(const phase of ['preflight','publish']) {
        const source=enroll();let publications=0,frozen=false,reloaded=false;
        const host=createContinuationHost({capture:()=>structuredClone(source),ownsSave:()=>true,revision:()=>1,
            freeze:()=>{frozen=true;},thaw:()=>{frozen=false;},preflight:async()=>{if(phase==='preflight')throw Error('invalid pack');},
            publish:()=>{if(phase==='publish')throw Error('quota');publications++;},reload:()=>{reloaded=true;}});
        await assert.rejects(host.command('initial',{expectedSequence:0,token:'event'}),/invalid pack|quota/);
        assert.equal(publications,0);assert.equal(frozen,false);assert.equal(reloaded,false);assert.equal(source.continuation.sequence,0);
    }
});
test('save ownership changed while isolated loader checks rejects publication',async()=>{
    let rev=1,published=false;const s=enroll();
    const host=createContinuationHost({capture:()=>s,ownsSave:()=>true,revision:()=>rev,freeze(){},thaw(){},preflight:async()=>{rev++;},publish(){published=true;},reload(){}});
    await assert.rejects(host.command('initial',{expectedSequence:0,token:'x'}),/changed/);assert.equal(published,false);
});
test('unsupported world does not destroy data or pretend rewind compatibility',()=>{
    const s=enroll();s.expansion.actors.player.worldId='book.paradise.hub';
    assert.match(continuationView(s).reason,/own temporal means/);assert.throws(()=>cmd(s,'initial'),/own temporal/);
});
test('a retained point in the abandoned future is recorded, not an unearned forward route',()=>{
    let s=enroll();s.continuation.research.checkpoint=true;s['current time'].minute=20;s=cmd(s,'set');s=cmd(s,'initial');
    assert.ok(s.continuation.lives[s.continuation.active].checkpoint);
    assert.equal(continuationView(s).checkpointReachable,false);
    assert.throws(()=>cmd(s,'checkpoint'),/abandoned future/);
});
test('learned child knowledge cannot create missing body-conditioning parent XP',()=>{
    let s=enroll();s.levels.person.main_character.skill_xp.Crafting=300;
    const n=cmd(s,'initial');assert.equal(n.levels.person.main_character.skill_xp.Crafting,300);
    assert.equal(n.levels.person.main_character.skill_xp['Crafting mastery'],0);
});
test('undiscovered names are not listed simply because an internal XP field exists',()=>{
    const s=enroll();s.levels.person.main_character.skill_xp.Secret=12;observeContinuation(s);
    assert.deepEqual(continuationView(s).mastery,[]);
    observeContinuation(s,{knownSkills:['Secret']});assert.equal(continuationView(s).mastery[0].skill,'Secret');
});
test('unsupported infant or nonhuman embodiment cannot silently use adult research/transfer',()=>{
    for(const bio of [{race:'human',age:'child'},{race:'wisp',age:'adult'}]) {
        const s=fresh();s.character.bio=bio;
        assert.throws(()=>beginContinuation(s,'test-body'),/embodiment.*adapter/);
        assert.equal(s.continuation,undefined);
    }
});

test('isolated challenge starts without carried mastery, blocks other crossings, and cancellation restores the exact owned parent',()=>{
 let s=enroll();s.character.money=37;s.levels.person.main_character.skill_xp.Literacy=200;s.personal_journal={schema:1,text:'my original words',regions:[{world:'base.frontier',place:'Village',posture:'quiet'}]};
 const c=cmd(s,'challenge:begin:experiment',{fresh:fresh()});assert.equal(c.character.money,10);assert.equal(c.levels.person.main_character.skill_xp.Literacy,0);assert.equal(c.continuation.challenge.parent,'life-1');
 assert.throws(()=>cmd(c,'initial'),/isolated/);assert.throws(()=>cmd(c,'challenge:return'),/goal/);
 c.character.money=900;c.levels.person.main_character.skill_xp.Literacy=9999;c.personal_journal.text='my words from inside';c.personal_journal.regions[0].posture='curious';c['current time'].minute=15;
 const returned=cmd(c,'challenge:cancel');assert.equal(returned.character.money,37);assert.equal(returned.levels.person.main_character.skill_xp.Literacy,200);assert.equal(returned.personal_journal.text,'my words from inside');assert.equal(returned.personal_journal.regions[0].posture,'curious');assert.equal(returned.continuation.active,'life-1');assert.equal(Object.keys(returned.continuation.lives).length,1);assert.equal(returned.continuation.challengeHistory[0].exported,0);validateContinuation(returned.continuation);
});
test('challenge trial returns learning alone; body stage, owned goods and money remain in the discarded life',async()=>{
 const P=await import('../src/pledges.js');let s=enroll();s.character.money=37;
 let c=cmd(s,'challenge:begin:trial',{fresh:fresh()});c.pledges=P.settleOrdeal(P.stepOrdeal(P.beginOrdeal(P.fresh(),{kind:'precision',units:0,skills:{combat:1},at:0}),'steady',{combat:1},1),1).state;
 c.character.money=900;c.inventories.person.main_character['{"id":"Iron ingot"}']={count:9};
 const r=cmd(c,'challenge:return');assert.equal(r.character.money,37);assert.deepEqual(r.inventories,s.inventories);assert.equal(r.pledges.trial.stage,0);assert.equal(r.pledges.trial.learning,1);assert.equal(P.isFresh(r.pledges),false);assert.ok(P.trialView(r.pledges,{combat:1}).risk<P.trialView(P.fresh(),{combat:1}).risk);assert.equal(r.continuation.challengeHistory[0].exported,1);
 const loaded=JSON.parse(JSON.stringify(r));validateContinuation(loaded.continuation);assert.throws(()=>cmd(loaded,'challenge:return'),/No isolated/);
});
test('fresh connected life can shelve other retained worlds without granting a rewind adapter',()=>{
 let s=enroll();s.expansion.worlds['p23.mistglass']={stock:7};
 assert.throws(()=>cmd(s,'initial'),/retained worlds/);
 const n=cmd(s,'fresh',{fresh:fresh()});assert.deepEqual(n.continuation.lives['life-1'].paused.expansion.worlds['p23.mistglass'],{stock:7});
 const r=cmd(n,'resume:life-1');assert.deepEqual(r.expansion.worlds['p23.mistglass'],{stock:7});assert.throws(()=>cmd(r,'initial'),/retained worlds/);
});

import {aptitudeMultipliers} from '../src/continuation_retention.js';
test('funded learning anchors debit native money, remember practice logarithmically and carry aptitude without copying combat conditioning',()=>{
 let s=enroll();s.character.money=100;s.levels.person.main_character.skill_xp.Combat=300;observeContinuation(s,{knownSkills:['Combat']});
 const a=cmd(s,'retention:coin:Combat');assert.equal(a.character.money,50);assert.equal(a.continuation.retention.anchors.Combat,1);const echo=aptitudeMultipliers(a.continuation).Combat;assert.ok(echo>1);
 assert.throws(()=>cmd(a,'retention:coin:Combat'),/100 native coins/);assert.equal(a.character.money,50);assert.throws(()=>cmd(a,'retention:insight:Combat'),/challenge/);
 const n=cmd(a,'fresh',{fresh:fresh()});assert.equal(n.levels.person.main_character.skill_xp.Combat||0,0);assert.equal(aptitudeMultipliers(n.continuation).Combat,echo);
 const c=cmd(n,'challenge:begin:trial',{fresh:fresh()});assert.deepEqual(aptitudeMultipliers(c.continuation),{});const returned=cmd(c,'challenge:cancel');assert.equal(aptitudeMultipliers(returned.continuation).Combat,echo);
 validateContinuation(JSON.parse(JSON.stringify(returned.continuation)));
});

test('achievement insight funds an anchor once, and resuming a shelved retained-world life can unpause without enabling rewinds',async()=>{
 const P=await import('../src/pledges.js');let s=enroll();s.levels.person.main_character.skill_xp.Combat=300;observeContinuation(s,{knownSkills:['Combat']});
 let c=cmd(s,'challenge:begin:trial',{fresh:fresh()});c.pledges=P.settleOrdeal(P.stepOrdeal(P.beginOrdeal(P.fresh(),{kind:'precision',units:0,skills:{combat:1},at:0}),'steady',{combat:1},1),1).state;
 let r=cmd(c,'challenge:return');assert.equal(r.continuation.retention.credits,1);const money=r.character.money;r=cmd(r,'retention:insight:Combat');assert.equal(r.continuation.retention.credits,0);assert.equal(r.character.money,money);assert.throws(()=>cmd(r,'retention:insight:Combat'),/challenge/);
 r.expansion.worlds['p23.mistglass']={stock:7};const other=cmd(r,'fresh',{fresh:fresh()}),back=cmd(other,'resume:life-1');assert.equal(back.continuation.arrivalPaused,true);const active=cmd(back,'continue');assert.equal(active.continuation.arrivalPaused,false);assert.throws(()=>cmd(active,'initial'),/retained worlds/);
});

import {changeDiscipline,freshDiscipline} from '../src/absorb_p23/world_adaptation/discipline.js';
test('actual local law understanding can be paid, retained and applied to a new vessel without copying a body or reserve',()=>{
 let s=enroll();s.character.money=500;s.expansion.worldAdaptation={techniques:{discipline:{...freshDiscipline(),depth:{flow:2,still:1}}}};
 observeContinuation(s);assert.deepEqual(s.continuation.lawMemory.best,{flow:2,still:1});assert.deepEqual(s.continuation.lawMemory.anchored,{flow:0,still:0});
 s=cmd(s,'law:flow');assert.equal(s.character.money,400);s=cmd(s,'law:flow');assert.equal(s.character.money,200);assert.throws(()=>cmd(s,'law:flow'),/actual practice/);
 const n=cmd(s,'fresh',{fresh:fresh()});assert.deepEqual(n.continuation.lawMemory.anchored,{flow:2,still:0});assert.equal(n.expansion.worldAdaptation,undefined);
 const opened=changeDiscipline({schema:1,selected:'mist',minutes:{breath:0,settling:0}},'open',1000,false,n.continuation.lawMemory.anchored);assert.equal(opened.cost,1000);assert.deepEqual(opened.next.discipline.depth,{flow:2,still:0});assert.deepEqual(opened.next.discipline.nodes,{flow:0,still:0,bridge:0});assert.equal(opened.next.discipline.bodyMinutes,0);assert.equal(opened.next.discipline.comprehension,0);
 validateContinuation(JSON.parse(JSON.stringify(n.continuation)));const bad=structuredClone(n.continuation);bad.lawMemory.anchored.still=2;assert.throws(()=>validateContinuation(bad),/actual prior/);
 const isolated=cmd(s,'challenge:begin:experiment',{fresh:fresh()});assert.throws(()=>cmd(isolated,'law:still'),/isolated challenge/);
});
test('paid selected baggage moves conserved loose goods and coins out of the shelved source, never into isolated challenges',()=>{
 let s=enroll();s.character.money=1000;const key='{"id":"Stale bread"}',bound='{"id":"Borrowed tool"}';s.inventories.person.main_character[key]={count:3};s.inventories.person.main_character[bound]={count:1};s.expansion.simulation={custody:{loan:{holder:'player',key:bound}}};
 s=cmd(s,'baggage:buy');s=cmd(s,'baggage:buy');assert.equal(s.character.money,550);s=cmd(s,'baggage:item:'+encodeURIComponent(key));s=cmd(s,'baggage:coins');assert.throws(()=>cmd(s,'baggage:item:'+encodeURIComponent(key)),/free purchased slot/);
 assert.deepEqual(continuationView(s).baggage.selectedItems,[{key,label:'Stale bread',count:1,available:3}]);
 let cleared=cmd(s,'baggage:clear');assert.throws(()=>cmd(cleared,'baggage:item:'+encodeURIComponent(bound)),/borrowed/);assert.throws(()=>cmd(cleared,'baggage:item:'+encodeURIComponent('{"id":"Unique","e2_instance":"e2.1"}')),/exactly once/);
 const next=cmd(s,'fresh',{fresh:fresh()});assert.equal(next.character.money,35);assert.equal(next.inventories.person.main_character[key].count,1);const parent=next.continuation.lives['life-1'].paused;assert.equal(parent.character.money,525);assert.equal(parent.inventories.person.main_character[key].count,2);assert.deepEqual(next.continuation.baggage,{slots:2,coins:0,items:[]});
 const back=cmd(next,'resume:life-1');assert.equal(back.character.money,525);assert.equal(back.inventories.person.main_character[key].count,2);assert.equal(back.continuation.lives['life-2'].paused.inventories.person.main_character[key].count,1);
 const vanished=structuredClone(s);delete vanished.inventories.person.main_character[key];const frozen=JSON.stringify(vanished);assert.equal(continuationView(vanished).baggage.selectedItems[0].available,0);assert.throws(()=>cmd(vanished,'fresh',{fresh:fresh()}),/no longer present/);assert.equal(JSON.stringify(vanished),frozen);
 const isolated=cmd(s,'challenge:begin:experiment',{fresh:fresh()});assert.equal(isolated.inventories.person.main_character[key],undefined);assert.equal(isolated.continuation.baggage.items.length,1);assert.throws(()=>cmd(isolated,'baggage:clear'),/isolated challenge/);
 validateContinuation(JSON.parse(JSON.stringify(next.continuation)));
});

test('only paid earned execution knowledge crosses ordinary bodies, with no source site or active selection and no challenge leak',()=>{
 let s=enroll();s.character.money=250;s.expansion.actors.player.facts={'cultivation.intent.patient':true,'cultivation.intent.selected':'patient'};
 observeContinuation(s);assert.deepEqual(s.continuation.intentMemory,{known:['patient'],anchored:[]});assert.throws(()=>cmd(s,'intent:committed'),/Learn this actual/);
 s=cmd(s,'intent:patient');assert.equal(s.character.money,150);assert.throws(()=>cmd(s,'intent:patient'),/Learn this actual/);
 const n=cmd(s,'fresh',{fresh:fresh()});assert.equal(n.expansion.actors.player.facts['cultivation.intent.patient'],true);assert.equal(n.expansion.actors.player.facts['cultivation.intent.selected'],undefined);assert.equal(n.expansion.worlds['base.frontier'].facts,undefined);assert.equal(n.character.money,10);
 validateContinuation(JSON.parse(JSON.stringify(n.continuation)));const isolated=cmd(s,'challenge:begin:experiment',{fresh:fresh()});assert.equal(isolated.expansion.actors.player.facts?.['cultivation.intent.patient'],undefined);assert.throws(()=>cmd(isolated,'intent:patient'),/isolated challenge/);
 const bad=structuredClone(n.continuation);bad.intentMemory.anchored.push('committed');assert.throws(()=>validateContinuation(bad),/Invalid anchored/);
});

test('connected equipment baggage moves one physical copy and its wear/name/living facts without source duplication or foreign body power',()=>{
 let s=enroll();s.character.money=500;const key='{"id":"Cinder keeper ring","e2_instance":"e2.4"}';s.inventories.person.main_character[key]={count:1};s.equipment_durability={schema:1,enabled:true,nextId:5,condition:{[key]:67},uses:{[key]:29}};s.tools={schema:1,instances:{[key]:{max:90,repairs:2,failures:1}},job:null};s.naming={schema:1,used:1,named:{'e2.4':{name:'Old ring',vesselThread:{schema:1,body:'["native.player.body",null,"human"]',at:0}}}};s.p23_living_gear={schema:1,lastKill:23,copies:{[key]:{kind:'collector',kills:0,reserve:7}}};
 s=cmd(s,'baggage:buy');s=cmd(s,'baggage:item:'+encodeURIComponent(key));const n=cmd(s,'fresh',{fresh:fresh()}),old=n.continuation.lives['life-1'].paused;
 assert.equal(n.inventories.person.main_character[key].count,1);assert.equal(old.inventories.person.main_character[key],undefined);assert.equal(n.equipment_durability.condition[key],67);assert.equal(n.equipment_durability.uses[key],29);assert.equal(n.equipment_durability.nextId,5);assert.equal(n.equipment_durability.enabled,false);assert.equal(old.equipment_durability.condition[key],undefined);assert.equal(n.tools.instances[key].max,90);assert.equal(old.tools.instances[key],undefined);assert.equal(n.naming.named['e2.4'].name,'Old ring');assert.equal(old.naming.named['e2.4'],undefined);assert.equal(n.p23_living_gear.copies[key].reserve,7);assert.equal(n.p23_living_gear.lastKill,0);assert.equal(old.p23_living_gear.lastKill,23);assert.equal(old.p23_living_gear.copies[key],undefined);
 const returned=cmd(n,'resume:life-1');assert.equal(returned.inventories.person.main_character[key],undefined,'reciprocal passage restores the debited source, not its pre-transfer stock');
});
test('equipment baggage holds at repairs, wearing or destination identity collisions without a partial native transition',()=>{
 let s=enroll();s.character.money=500;const key='{"id":"Cheap leather pants","quality":40,"e2_instance":"e2.1"}';s.inventories.person.main_character[key]={count:1};s=cmd(s,'baggage:buy');s.tools={schema:1,instances:{},job:{key}};assert.throws(()=>cmd(s,'baggage:item:'+encodeURIComponent(key)),/repair/);s.tools.job=null;s.character.equipment={legs:{inventory_key:key}};assert.throws(()=>cmd(s,'baggage:item:'+encodeURIComponent(key)),/Unequip/);s.character.equipment={};s=cmd(s,'baggage:item:'+encodeURIComponent(key));const opening=fresh();opening.inventories.person.main_character[key]={count:1};assert.throws(()=>cmd(s,'fresh',{fresh:opening}),/different equipment copy/);assert.equal(s.inventories.person.main_character[key].count,1);assert.equal(s.continuation.baggage.items.length,1);
});

test('attended memory-blade time crosses with its one real baggage copy and never duplicates into the paused owner',()=>{
 let s=enroll();s.character.money=500;const key='{"components":{"head":"Tempered memory blade","handle":"Simple wooden short handle"},"quality":100,"e2_instance":"e2.4"}';s.inventories.person.main_character[key]={count:1};s.equipment_durability={schema:1,enabled:false,nextId:5,condition:{[key]:100}};s.p23_living_gear={schema:1,lastKill:0,copies:{[key]:{kind:'weapon',kills:0,reserve:0,wornMinutes:120}}};s=cmd(s,'baggage:buy');s=cmd(s,'baggage:item:'+encodeURIComponent(key));const n=cmd(s,'fresh',{fresh:fresh()}),old=n.continuation.lives['life-1'].paused;assert.equal(n.p23_living_gear.copies[key].wornMinutes,120);assert.equal(old.p23_living_gear.copies[key],undefined);assert.equal(n.inventories.person.main_character[key].count,1);assert.equal(old.inventories.person.main_character[key],undefined);
});

test('exported physical copies stay outside every reachable source rewind while ordinary world rewind and reciprocal return remain usable',()=>{
 const base=fresh(),key='{"id":"Cheap leather pants","quality":40,"e2_instance":"e2.4"}';base.character.money=500;base.character.equipment={legs:{inventory_key:key}};base.equipment_durability={schema:1,enabled:false,nextId:5,condition:{[key]:70},uses:{[key]:30}};base.naming={schema:1,used:1,named:{'e2.4':{name:'Travelled cloth'}}};let s=beginContinuation(base,'custody-rewind');s.character.equipment={};s.inventories.person.main_character[key]={count:1};s.continuation.research.checkpoint=true;s['current time'].minute=1;s=cmd(s,'set');s=cmd(s,'baggage:buy');s=cmd(s,'baggage:item:'+encodeURIComponent(key));assert.equal(continuationView(s).baggage.selectedItems[0].label,'Travelled cloth · Cheap leather pants · 40% quality');s=cmd(s,'fresh',{fresh:fresh()});assert.equal(s.inventories.person.main_character[key].count,1);s=cmd(s,'resume:life-1');s.quests.q.done=true;s=cmd(s,'checkpoint');assert.equal(s.inventories.person.main_character[key],undefined,'checkpoint cannot recreate exported custody');assert.equal(s.equipment_durability.condition[key],undefined);assert.equal(s.naming.named['e2.4'],undefined);assert.equal(s.quests.q.done,false,'ordinary world rewind remains');assert.ok(s.equipment_durability.nextId>=5,'rewind cannot reallocate the exported copy identity');s=cmd(s,'initial');assert.equal(s.character.equipment.legs,undefined,'initial worn copy remains exported');assert.equal(s.continuation.lives['life-2'].paused.inventories.person.main_character[key].count,1);s['current time'].minute=2;s=cmd(s,'loop:checkpoint');s['current time'].minute=7;s=cmd(s,'cycle');assert.equal(s.inventories.person.main_character[key],undefined);assert.equal(s.continuation.loop.cycles,1);s=cmd(s,'loop');s=cmd(s,'resume:life-2');assert.equal(s.inventories.person.main_character[key].count,1);assert.equal(s.equipment_durability.condition[key],70);assert.equal(s.naming.named['e2.4'].name,'Travelled cloth');const malformed=structuredClone(s.continuation);malformed.lives['life-1'].initial.continuation={};assert.throws(()=>validateContinuation(malformed),/recursive/);
});


test('an older reserved-copy point alone waits, while export, other points and replacement remain usable',()=>{
 let s=enroll();s.character.money=500;const key='{"id":"Cheap leather pants","quality":40,"e2_instance":"e2.4"}';s.inventories.person.main_character[key]={count:1};s.equipment_durability={schema:1,enabled:false,nextId:5,condition:{[key]:100}};s.continuation.research.checkpoint=true;s=cmd(s,'set');s.continuation.lives['life-1'].checkpoint.tools={job:{key}};s=cmd(s,'baggage:buy');s=cmd(s,'baggage:item:'+encodeURIComponent(key));let n=cmd(s,'fresh',{fresh:fresh()});assert.equal(n.inventories.person.main_character[key].count,1);assert.ok(n.continuation.lives['life-1'].initial.equipment_durability.nextId>=5);n=cmd(n,'resume:life-1');const before=structuredClone(n);assert.throws(()=>cmd(n,'checkpoint'),/reserves a physical copy/);assert.deepEqual(n,before);assert.ok(continuationView(n).checkpointBlocked);assert.equal(continuationView(n).initialBlocked,'');n=cmd(n,'set');n=cmd(n,'checkpoint');assert.equal(n.inventories.person.main_character[key],undefined);assert.equal(n.continuation.lives['life-2'].paused.inventories.person.main_character[key].count,1);const bad=structuredClone(n.continuation);bad.lives['life-1'].externalEquipment=['invalid'];assert.throws(()=>validateContinuation(bad),/external equipment/);
});
test('plain goods and physical coins debit reachable source return points without touching unrelated world state',()=>{
 const base=fresh(),key='{"id":"Rough wood log"}';base.character.money=2000;base.inventories.person.main_character[key]={count:3};let s=beginContinuation(base,'fungible-custody');for(let i=0;i<3;i++)s=cmd(s,'baggage:buy');for(let i=0;i<2;i++)s=cmd(s,'baggage:item:'+encodeURIComponent(key));s=cmd(s,'baggage:coins');s=cmd(s,'fresh',{fresh:fresh()});assert.equal(s.inventories.person.main_character[key].count,2);assert.equal(s.character.money,35);s=cmd(s,'resume:life-1');s=cmd(s,'initial');assert.equal(s.inventories.person.main_character[key].count,1);assert.equal(s.character.money,1975);assert.equal(s.expansion.worlds['base.frontier'].stock,5);assert.equal(s.continuation.lives['life-2'].paused.inventories.person.main_character[key].count,2);
});
test('a branch pauses this life as it is and continues a tethered life; resume works from a Tingen life, rewinds do not (RET3, RET4)',()=>{
    let s=enroll();s.character.money=77;
    s=cmd(s,'branch:'+encodeURIComponent('Tingen · Nighthawk probationer'));
    const c=s.continuation,village=c.lives['life-1'],tingen=c.lives[c.active];
    assert.equal(c.active,'life-2');assert.equal(tingen.tether,'life-1');assert.equal(tingen.label,'Tingen · Nighthawk probationer');
    assert.equal(village.paused.character.money,77,'the paused Village life keeps its money');assert.equal(s.character.money,77,'the running game is unchanged by the branch');
    // The running life then crosses in place (what the LOTM enroll does).
    s.expansion.actors.player.worldId='book.lotm.tingen';s.expansion.worlds['book.lotm.tingen']={};s.character.money=480;
    assert.match(continuationView(s).paused.map(p=>p.label).join(),/First life/);
    assert.throws(()=>cmd(s,'initial'),/temporal means|retained worlds/,'no rewind inside Tingen');
    const back=cmd(s,'resume:life-1');
    assert.equal(back.continuation.active,'life-1');assert.equal(back.character.money,77);assert.equal(back.expansion.actors.player.worldId,'base.frontier');
    assert.equal(back.continuation.lives['life-2'].paused.character.money,480,'the Tingen life is paused with its own purse');
    const again=cmd(back,'resume:life-2');
    assert.equal(again.expansion.actors.player.worldId,'book.lotm.tingen');assert.equal(again.character.money,480);
});
test('a branch is refused from a world that cannot travel',()=>{
    const s=enroll();s.expansion.actors.player.worldId='book.other';
    assert.throws(()=>cmd(s,'branch:x'),/temporal means/);
});
