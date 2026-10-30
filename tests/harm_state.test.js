import test from 'node:test';
import assert from 'node:assert/strict';
import {HARM_RUNGS,HARM_WORLDS,harmRung,rungHealth,addBacklash,restBacklash,backlashStage,
    actionGate,resolveDeath,harmView,harmState,setHarmState,validateHarm} from '../src/harm_state.js';
import {domainRegistry} from '../src/domain_registry.js';
import {beginContinuation,planContinuation,validateContinuation,continuationView,nativeMoment,COMPATIBLE_MASTERY} from '../src/continuation_state.js';
import {defaultCheatState,seedBeginningCheats} from '../src/cheat_cards.js';

const rules=HARM_WORLDS['book.lotm.tingen'];
const clean=()=>({schema:1,backlash:{}});
const classes=['appraise','care','craft','explore','fight','other','practice','research','rest','ritual','socialize','study','trade','travel','work'];
const harmDomain=domainRegistry.list().find(d=>d.id==='harm');

test('health rung representatives round-trip, including unhurt and zero health',()=>{
    assert.equal(harmRung(1),null);assert.equal(rungHealth(null),1);assert.equal(harmRung(0),'dying');
    for(const id of HARM_RUNGS)assert.equal(harmRung(rungHealth(id)),id);
    for(let i=0;i<=100;i++)assert.equal(harmRung(rungHealth(harmRung(i/100))),harmRung(i/100));
    for(const value of [-1,1.1,NaN,Infinity])assert.throws(()=>harmRung(value),/fraction/);
    assert.throws(()=>rungHealth('missing'),/rung/);
});

test('accrual crosses world stages and action classes use the stage gate',()=>{
    let state=clean();assert.equal(backlashStage(rules,'power',0).id,'steady');
    for(const id of ['strained','slipping','lost']){
        const before=structuredClone(state),result=addBacklash(state,rules,'power',{source:'practice',weight:3});
        assert.deepEqual(state,before);assert.equal(result.record.source,'practice');
        assert.equal('source' in result.state,false);state=result.state;
        const stage=backlashStage(rules,'power',state.backlash.power);assert.equal(stage.id,id);
        assert.deepEqual(actionGate(stage,'ritual'),{allowed:id==='strained',reason:stage.label});
        if(id==='strained')assert.ok(stage.warn);
        if(id==='slipping')assert.equal(actionGate(stage,'research').allowed,false);
        if(id==='lost')for(const action of classes)assert.equal(actionGate(stage,action).allowed,['rest','care','travel'].includes(action));
    }
    const scaled={...rules,carriers:{power:{...rules.carriers.power,riseScale:2}}};
    assert.equal(addBacklash(clean(),scaled,'power',{source:'power',weight:2}).state.backlash.power,4);
    assert.ok(Object.isFrozen(rules.carriers.power.stages[3].blocks));
});

test('rest recovers slowly, treatment faster, and a world floor persists without mutating inputs',()=>{
    const state={schema:1,backlash:{power:6}},before=structuredClone(state);
    const rest=restBacklash(state,rules,'power',{minutes:60}).state;
    const treated=restBacklash(state,rules,'power',{minutes:60,treated:true}).state;
    assert.ok(rest.backlash.power<6);assert.ok(treated.backlash.power<rest.backlash.power);
    assert.equal(backlashStage(rules,'power',rest.backlash.power).id,'strained');assert.deepEqual(state,before);
    assert.equal(restBacklash(state,rules,'power',{minutes:1e6}).state.backlash.power,0);
    const partial={...rules,carriers:{power:{...rules.carriers.power,floor:2}}};
    assert.equal(restBacklash(state,partial,'power',{minutes:1e6,treated:true}).state.backlash.power,2);
    for(const weight of [-1,NaN,Infinity,1e7])assert.throws(()=>addBacklash(state,rules,'power',{source:'power',weight}));
    assert.throws(()=>restBacklash(state,rules,'power',{minutes:-1}),/recovery/);
    assert.throws(()=>addBacklash(state,rules,'missing',{source:'power',weight:1}),/carrier/);
});

test('world death resolution distinguishes rescuer facts, connection enrollment and native defeat',()=>{
    assert.deepEqual(resolveDeath(rules,'loss_of_control'),{default:'final',alternatives:[],restartOffered:false});
    assert.deepEqual(resolveDeath(rules,'loss_of_control',{facts:{'harm.rescuer.present':true},continuationEnrolled:true}),
        {default:'final',alternatives:[{kind:'rescued',cost:'a debt the rescuer names'}],restartOffered:true});
    for(const value of [false,1,'yes'])assert.deepEqual(resolveDeath(rules,'harm',{facts:{'harm.rescuer.present':value}}).alternatives,[]);
    const frontier=HARM_WORLDS['base.frontier'];
    for(const cause of ['combat','mishap','harm','loss_of_control'])assert.equal(resolveDeath(frontier,cause).default,'unconscious');
    for(const cause of ['age','illness'])assert.equal(resolveDeath(frontier,cause).default,'final');
    assert.equal(resolveDeath(HARM_WORLDS.default,'harm').default,'final');
    assert.throws(()=>resolveDeath(rules,'unknown'),/cause/);
});

test('harm domain omits clean state, migrates absent slices and round-trips JSON without source records',()=>{
    setHarmState(null);assert.equal(harmDomain.save(),undefined);
    setHarmState({schema:1,backlash:{power:0}});assert.equal(harmDomain.save(),undefined);
    const accrued=addBacklash(clean(),rules,'power',{source:'rite',weight:6});setHarmState(accrued.state);
    const saved=JSON.parse(JSON.stringify(harmDomain.save()));assert.deepEqual(saved,{schema:1,backlash:{power:6}});
    harmDomain.validate(saved);setHarmState(null);harmDomain.load(harmDomain.migrate(saved));assert.deepEqual(harmState(),saved);
    const projected=harmDomain.projection();projected.backlash.power=99;assert.equal(harmState().backlash.power,6);
    const oldSave={character:{name:'old'}};harmDomain.validate(oldSave.harm);harmDomain.load(harmDomain.migrate(oldSave.harm));
    assert.deepEqual(harmState(),clean());assert.equal(harmDomain.save(),undefined);
});

test('harm slice refuses hostile keys, invalid counts, oversized records and non-plain objects',()=>{
    for(const key of ['__proto__','constructor','prototype','bad key']){
        const bad=JSON.parse(`{"schema":1,"backlash":{"${key}":1}}`);
        assert.throws(()=>validateHarm(bad),/counter/);assert.throws(()=>setHarmState(bad),/counter/);
    }
    for(const count of [-1,NaN,Infinity,1_000_001,'1'])assert.throws(()=>validateHarm({schema:1,backlash:{power:count}}));
    for(const bad of [{schema:2,backlash:{}},{schema:1,backlash:[]},{schema:1,backlash:{},source:'not saved'},
        {schema:1,backlash:Object.fromEntries(Array.from({length:33},(_,i)=>['c'+i,0]))},
        {schema:1,backlash:Object.create({power:3})}])assert.throws(()=>validateHarm(bad));
});

const fresh=(world='book.lotm.tingen')=>({'game version':'v0.0.1',
    'current time':{year:1,month:1,day:1,hour:8,minute:0},saved_at:10,
    character:{name:'A',money:10,bio:{race:'human'},xp:{total_xp:0},health:100},
    levels:{person:{main_character:{total_xp:0,skill_xp:{...Object.fromEntries(COMPATIBLE_MASTERY.map(id=>[id,0])),Weightlifting:0}}}},
    inventories:{person:{main_character:{bread:{count:1}}}},global_flags:{is_hero_created:true},
    expansion:{actors:{player:{worldId:world}},rng:17,worlds:{[world]:{stock:5}}},
    options:{font:1},quests:{q:{done:false}},harm:clean()});
const enroll=()=>beginContinuation(fresh(),'harm-journey');
let serial=0;
const cmd=(s,command)=>planContinuation(s,command,{expectedSequence:s.continuation.sequence,token:`harm-event-${++serial}`});

test('death ends a travel-world life once and exposes an independent read model',()=>{
    const original=enroll(),before=structuredClone(original),ended=cmd(original,'die:loss_of_control');
    assert.deepEqual(original,before);
    const death={cause:'loss_of_control',outcome:'final',at:nativeMoment(original)};
    assert.deepEqual(ended.continuation.lives['life-1'].ended,death);
    assert.deepEqual(ended.continuation.deaths,[{lifeId:'life-1',...death,token:ended.continuation.lastTransition.token}]);
    assert.throws(()=>cmd(ended,'die:harm'),/already ended/);
    const view=continuationView(ended);assert.deepEqual(view.ended,death);assert.equal(view.deaths[0].lifeLabel,'First life');
    view.ended.cause='age';view.deaths[0].outcome='changed';assert.equal(ended.continuation.deaths[0].outcome,'final');
    const harm=harmView({...ended,harm:{schema:1,backlash:{power:6}}});
    assert.deepEqual(harm.lastDeath,{cause:'loss_of_control',outcome:'final'});assert.equal(harm.rung,null);
    assert.deepEqual(harm.carriers,[{id:'power',label:'Power strain',count:6,stage:'slipping',stageLabel:'Slipping',
        blocked:['ritual','research'],recovers:{rest:0.25,treated:1}}]);
    harm.carriers[0].blocked.push('rest');assert.equal(rules.carriers.power.stages[2].blocks.length,2);
    assert.deepEqual(harmView(fresh('unbound.world')),{carriers:[],rung:null,parts:[],lastDeath:null});
});

test('initial restart enforces the restore keep/reset table and survives JSON save/reload/import',()=>{
    let s=enroll();const anchor=structuredClone(s.continuation.lives['life-1'].initial);
    s['current time'].day=3;s.character.money=1;s.character.health=5;s.inventories.person.main_character={};
    s.quests.q.done=true;s.expansion.worlds['book.lotm.tingen'].stock=0;s.expansion.rng=99;
    s.harm={schema:1,backlash:{power:9}};s.options.font=2;s.saved_at=20;
    for(const skill of COMPATIBLE_MASTERY)s.levels.person.main_character.skill_xp[skill]=200;
    s.levels.person.main_character.skill_xp.Weightlifting=500;
    s.cheats=seedBeginningCheats(defaultCheatState(),{at:1});
    s.continuation.retention={schema:1,credits:1,anchors:{Literacy:2}};
    s.continuation.lawMemory={best:{flow:2,still:1},anchored:{flow:1,still:0}};
    s.continuation.intentMemory={known:['patient'],anchored:['patient']};
    s.continuation.memories=[{lifeId:'life-1',event:{text:'Remembered practice',at:nativeMoment(s)}}];
    s.continuation.challengeHistory=[{kind:'trial',completed:true,exported:1,minutes:5}];
    s.continuation.loop.cycles=7;
    const retained=structuredClone(s.continuation),cheats=structuredClone(s.cheats);
    s=cmd(s,'die:loss_of_control');const death=structuredClone(s.continuation.deaths[0]),deathAt=nativeMoment(s);
    s=JSON.parse(JSON.stringify(s));validateContinuation(s.continuation);
    const restarted=cmd(s,'restart:initial');assert.equal(restarted.continuation.lives['life-1'].ended,undefined);
    assert.equal(restarted.continuation.arrivalPaused,false);assert.equal(restarted.continuation.loop.cycles,7);
    assert.deepEqual(restarted.cheats,cheats);assert.deepEqual(restarted.options,{font:2});assert.equal(restarted.saved_at,20);
    for(const skill of COMPATIBLE_MASTERY)assert.equal(restarted.levels.person.main_character.skill_xp[skill],200);
    assert.equal(restarted.levels.person.main_character.skill_xp.Weightlifting,0);
    for(const key of ['retention','lawMemory','intentMemory','memories','challengeHistory'])assert.deepEqual(restarted.continuation[key],retained[key]);
    assert.equal(restarted.expansion.actors.player.facts['cultivation.intent.patient'],true);
    assert.deepEqual(restarted.continuation.deaths,[death,{lifeId:'life-1',kind:'restart',anchor:'initial',at:deathAt,token:restarted.continuation.lastTransition.token}]);
    assert.deepEqual(harmView(restarted).lastDeath,{cause:'loss_of_control',outcome:'final'});
    for(const key of ['character','inventories','quests','current time','harm'])assert.deepEqual(restarted[key],anchor[key]);
    assert.deepEqual(restarted.expansion.worlds,anchor.expansion.worlds);assert.equal(restarted.expansion.rng,anchor.expansion.rng);
    const imported=JSON.parse(JSON.stringify(restarted));validateContinuation(imported.continuation);harmDomain.validate(imported.harm);
    harmDomain.load(harmDomain.migrate(imported.harm));assert.deepEqual(harmState(),anchor.harm);
    assert.deepEqual(imported,restarted);assert.equal(continuationView(imported).ended,null);
    assert.throws(()=>planContinuation(imported,'die:harm',{expectedSequence:imported.continuation.sequence,
        token:imported.continuation.lastTransition.token}),/already been applied/);
});

test('restart checks death, anchor availability and time, and uses a checkpoint without advancing cycles',()=>{
    let s=enroll();assert.throws(()=>cmd(s,'restart:initial'),/has not ended/);
    s.continuation.lives['life-1'].checkpoint=structuredClone(s.continuation.lives['life-1'].initial);
    const checkpoint=s.continuation.lives['life-1'].checkpoint;
    checkpoint['current time'].minute=10;checkpoint.character.money=30;checkpoint.harm.backlash.power=3;
    s=cmd(s,'die:harm');assert.throws(()=>cmd(s,'restart:checkpoint'),/abandoned future/);
    s['current time'].minute=20;const next=cmd(s,'restart:checkpoint');
    assert.equal(next.character.money,30);assert.equal(next.harm.backlash.power,3);assert.equal(next['current time'].minute,10);
    assert.equal(next.continuation.loop.cycles,0);assert.equal(next.continuation.deaths.at(-1).anchor,'checkpoint');
    const noCheckpoint=cmd(enroll(),'die:age');assert.throws(()=>cmd(noCheckpoint,'restart:checkpoint'),/no later checkpoint/);
    assert.throws(()=>cmd(noCheckpoint,'restart:other'),/initial or checkpoint/);
});

test('native defeat and isolated challenges cannot be recorded as final deaths',()=>{
    const frontier=beginContinuation(fresh('base.frontier'),'frontier-journey');
    assert.throws(()=>cmd(frontier,'die:combat'),/outcome is not a death/);assert.equal(frontier.continuation.deaths,undefined);
    assert.equal(cmd(frontier,'die:illness').continuation.lives['life-1'].ended.cause,'illness');
    assert.throws(()=>cmd(enroll(),'die:unknown'),/cause/);
    const challenged=planContinuation(frontier,'challenge:begin:experiment',{
        expectedSequence:0,token:'challenge-event',fresh:fresh('base.frontier')});
    for(const command of ['die:harm','restart:initial'])assert.throws(()=>cmd(challenged,command),/isolated challenge/);
});

test('legacy continuation JSON stays additive, while malformed death and ended records fail validation',()=>{
    const old=enroll().continuation;assert.equal(Object.hasOwn(old,'deaths'),false);assert.equal(Object.hasOwn(old.lives['life-1'],'ended'),false);
    assert.deepEqual(validateContinuation(JSON.parse(JSON.stringify(old))),old);
    const valid=cmd(enroll(),'die:mishap').continuation;
    for(const patch of [c=>c.deaths[0].lifeId='__proto__',c=>c.deaths[0].at=Infinity,c=>c.deaths[0].cause='unknown',
        c=>c.lives['life-1'].ended.outcome='unconscious',c=>c.lives['life-1'].ended.at=NaN,
        c=>c.deaths=Array(65).fill(c.deaths[0]),c=>c.deaths[0]={lifeId:'life-1',kind:'restart',anchor:'future',at:0}]){
        const bad=structuredClone(valid);patch(bad);assert.throws(()=>validateContinuation(bad));
    }
    let s=enroll();for(let i=0;i<34;i++){s=cmd(s,'die:harm');s=cmd(s,'restart:initial');}
    assert.equal(s.continuation.deaths.length,64);assert.equal(s.continuation.deaths[0].cause,'harm');
});

// Slice 1's empty schema remains a valid input after optional parts were added.
test('explicit slice-1 harm save still migrates and round-trips unchanged',()=>{
    const old={schema:1,backlash:{}};
    harmDomain.load(harmDomain.migrate(JSON.parse(JSON.stringify(old))));
    assert.deepEqual(harmState(),old);assert.equal(harmDomain.save(),undefined);
    assert.throws(()=>harmDomain.migrate({schema:1,backlash:{},parts:{hands:{rung:'missing'}}}));
});


test('an ended life cannot continue acting or restart research through the connection',()=>{
    const s=cmd(enroll(),'die:harm'),before=structuredClone(s);
    for(const command of ['continue','study','branch:Escape'])assert.throws(()=>cmd(s,command),/ended/);
    assert.deepEqual(s,before);
});


test('death and restart tokens remain idempotent across intervening transitions',()=>{
    let s=cmd(enroll(),'die:harm');const deathToken=s.continuation.lastTransition.token;
    s=cmd(s,'restart:initial');const restartToken=s.continuation.lastTransition.token;
    const before=structuredClone(s);
    assert.throws(()=>planContinuation(s,'die:harm',{expectedSequence:s.continuation.sequence,token:deathToken}),/already been applied/);
    assert.deepEqual(s,before);
    s=cmd(s,'die:age');const ended=structuredClone(s);
    assert.throws(()=>planContinuation(s,'restart:initial',{expectedSequence:s.continuation.sequence,token:restartToken}),/already been applied/);
    assert.deepEqual(s,ended);
});
