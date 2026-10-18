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
