import test from 'node:test';
import assert from 'node:assert/strict';
import {deriveSnapshot,deriveIncremental,diffSnapshots,lintWorld,explainFact} from '../src/anchor_snapshots.js';
const world=()=>({id:'test.harbor',revision:2,base:{facts:{dock:true,crates:0,permit:null}},
    events:[
        {id:'unload',at:10,requires:[{fact:'dock',eq:true}],effects:[{add:{crates:4}}],evidence:{label:'SHOWN',locator:'harbor:1'}},
        {id:'license',at:20,requires:[{fact:'dock',eq:true},{fact:'permit',exists:true}],effects:[{set:{licensed:true}}],evidence:{label:'STATED',locator:'harbor:2'}},
        {id:'ship',at:30,requires:[{fact:'licensed',eq:true}],effects:[{add:{crates:-2}},{set:{sailed:true}}],evidence:{label:'INFERRED',locator:'harbor:3'}},
        {id:'close',at:30,effects:[{unset:'permit'}]},
        {id:'market',at:40,effects:[{set:{market:true}}]}
    ],anchors:[{id:'empty',at:0},{id:'loaded',at:15},{id:'departed',at:30},{id:'end',at:50}]});
const branch={divergeAt:15,overrides:{dock:false}};
test('anchors and numeric times derive deterministic canon with revision and applied evidence',()=>{
    const w=world(),r=deriveSnapshot(w,'end');
    assert.deepEqual(r,deriveSnapshot(w,50));assert.deepEqual(r,deriveSnapshot(w,'end'));
    assert.deepEqual(r.snapshot.facts,{dock:true,crates:2,licensed:true,sailed:true,market:true});
    assert.deepEqual(r.applied,['unload','license','ship','close','market']);assert.deepEqual(r.skipped,[]);
    assert.deepEqual(r.evidence,[{id:'unload',label:'SHOWN',locator:'harbor:1'},{id:'license',label:'STATED',locator:'harbor:2'},{id:'ship',label:'INFERRED',locator:'harbor:3'}]);
    assert.equal(r.at,50);assert.equal(r.revision,2);assert.deepEqual(deriveSnapshot(w,'empty').snapshot,w.base);
});
test('events sort by time and equal-time events retain authored order',()=>{
    const w=world();w.events.reverse();
    assert.deepEqual(deriveSnapshot(w,50).snapshot,deriveSnapshot(world(),50).snapshot);
    w.events=[{id:'first',at:1,effects:[{set:{x:1}}]},{id:'second',at:1,requires:[{fact:'x',eq:1}],effects:[{set:{x:2}}]}];
    assert.equal(deriveSnapshot(w,1).snapshot.facts.x,2);
    w.events.reverse();assert.equal(deriveSnapshot(w,1).snapshot.facts.x,1);assert.equal(deriveSnapshot(w,1).skipped[0].id,'second');
});
test('branch skips cascade with named reasons while independent events and evidence survive',()=>{
    const r=deriveSnapshot(world(),'end',{branch});
    assert.deepEqual(r.snapshot.facts,{dock:false,crates:4,market:true});
    assert.deepEqual(r.applied,['unload','close','market']);assert.deepEqual(r.evidence,[{id:'unload',label:'SHOWN',locator:'harbor:1'}]);
    assert.deepEqual(r.skipped.map(s=>s.id),['license','ship']);assert.match(r.skipped[0].reason,/dock/);assert.match(r.skipped[1].reason,/licensed/);
});
test('overrides apply after every event at divergence, including an empty event interval',()=>{
    const w=world(),b={divergeAt:30,overrides:{crates:9,permit:'new'}};
    assert.deepEqual(deriveSnapshot(w,29,{branch:b}).snapshot,deriveSnapshot(w,29).snapshot);
    assert.equal(deriveSnapshot(w,30,{branch:b}).snapshot.facts.crates,9);
    assert.equal(deriveSnapshot(w,30,{branch:b}).snapshot.facts.permit,'new');
    assert.equal(deriveSnapshot(w,15,{branch}).snapshot.facts.dock,false);
    assert.equal(deriveSnapshot(w,-1,{branch:{divergeAt:-2,overrides:{crates:7}}}).snapshot.facts.crates,7);
});
test('incremental canon and branches equal full results at every boundary without duplicate history',()=>{
    for(const b of [undefined,branch,{divergeAt:30,overrides:{crates:9}}]) {
        const w=world();let r=deriveSnapshot(w,-5,{branch:b});
        for(const at of [0,10,15,20,29,30,30,40,50]) {
            const before=structuredClone(r);r=deriveIncremental(w,r,at);
            assert.deepEqual(r,deriveSnapshot(w,at,{branch:b}));assert.deepEqual(before,deriveSnapshot(w,before.at,{branch:b}));
        }
        assert.deepEqual(deriveIncremental(w,r,'loaded'),deriveSnapshot(w,'loaded',{branch:b}));
    }
});
test('incremental invalidates edited author data and refuses another world or revision',()=>{
    const w=world(),r=deriveSnapshot(w,'loaded');w.base.facts.crates=10;
    assert.deepEqual(deriveIncremental(w,r,'end'),deriveSnapshot(w,'end'));
    w.events[0].effects[0].add.crates=8;
    assert.deepEqual(deriveIncremental(w,r,'end'),deriveSnapshot(w,'end'));
    w.revision++;assert.throws(()=>deriveIncremental(w,r,50),/revision mismatch/);
    w.revision=r.revision;w.id='other';assert.throws(()=>deriveIncremental(w,r,50),/world or revision mismatch/);
});
test('requirements distinguish absent facts from false, null and zero, and compare structured values',()=>{
    const w=world();w.base.facts={zero:0,no:false,nil:null,details:{a:1,b:[2]}};
    w.events=[{id:'present',at:1,requires:['zero','no','nil'].map(fact=>({fact,exists:true})),effects:[{set:{ok:true}}]},
        {id:'equal',at:2,requires:[{fact:'details',eq:{b:[2],a:1}}],effects:[{add:{newCount:3}}]},
        {id:'absent',at:3,requires:[{fact:'missing',eq:undefined}],effects:[{set:{bad:true}}]}];
    const r=deriveSnapshot(w,3);assert.equal(r.snapshot.facts.ok,true);assert.equal(r.snapshot.facts.newCount,3);
    assert.deepEqual(r.applied,['present','equal']);assert.match(r.skipped[0].reason,/missing/);
});
test('diff includes additions and removals sorted by key and excludes equal structured facts',()=>{
    const a={facts:{z:1,same:{a:1,b:2},gone:true}},b={facts:{a:null,z:2,same:{b:2,a:1}}};
    assert.deepEqual(diffSnapshots(a,b),[{key:'a',from:undefined,to:null},{key:'gone',from:true,to:undefined},{key:'z',from:1,to:2}]);
    assert.deepEqual(diffSnapshots(a,a),[]);
    assert.deepEqual(diffSnapshots({facts:{}},{facts:{x:undefined}}),[{key:'x',from:undefined,to:undefined}]);
});
test('lint flags missing producers and conflicting same-time writes without flagging clean canon',()=>{
    const w=world();assert.deepEqual(lintWorld(w),[]);
    w.events.push({id:'orphan',at:25,requires:[{fact:'beacon',exists:true}],effects:[{set:{rescued:true}}]},
        {id:'revoke',at:20,effects:[{set:{licensed:false}}]});
    assert.deepEqual(lintWorld(w),[{kind:'never-fires',ids:['orphan']},{kind:'same-time-conflict',ids:['license','revoke']}]);
});
test('lint accepts add producers and equal values, flags unset conflicts and ignores sequential writes',()=>{
    const w=world();w.events=[{id:'a',at:1,effects:[{add:{stock:1}},{set:{record:{a:1,b:2}}}]},
        {id:'b',at:1,requires:[{fact:'stock',exists:true}],effects:[{set:{record:{b:2,a:1}}}]},
        {id:'c',at:2,effects:[{unset:'record'}]}];
    assert.deepEqual(lintWorld(w),[]);w.events[2].at=1;
    assert.deepEqual(lintWorld(w),[{kind:'same-time-conflict',ids:['a','c']},{kind:'same-time-conflict',ids:['b','c']}]);
});
test('inputs and returned nested values are independent across derivation, diff and lint',()=>{
    const w=world(),b={divergeAt:15,overrides:{details:{notes:['branch']}}};w.base.facts.details={notes:['base']};
    const before=structuredClone({w,b}),r=deriveSnapshot(w,15,{branch:b}),saved=structuredClone(r);
    const next=deriveIncremental(w,r,50),d=diffSnapshots({facts:{}},r.snapshot);lintWorld(w);
    assert.deepEqual({w,b},before);assert.deepEqual(r,saved);
    next.snapshot.facts.details.notes.push('next');d.find(v=>v.key==='details').to.notes.push('diff');r.branch.overrides.details.notes.push('metadata');
    assert.deepEqual({w,b},before);assert.deepEqual(r.snapshot.facts.details.notes,['branch']);
});
test('unknown anchors and nonfinite times fail clearly',()=>{
    for(const at of ['missing',NaN,Infinity])assert.throws(()=>deriveSnapshot(world(),at),/Unknown anchor or invalid time/);
    assert.throws(()=>deriveSnapshot(world(),0,{branch:{divergeAt:NaN,overrides:{}}}),/Invalid branch/);
});

const alteredHarbor=()=>{
    const w=world();
    w.events[1].alternatives=[
        {id:'denied',requires:[{fact:'sponsor',eq:false}],effects:[{set:{licensed:false}}]},
        {id:'sponsored',requires:[{fact:'sponsor',eq:true}],effects:[{set:{licensed:true,alternate:true}}],evidence:{label:'STATED',locator:'harbor:sponsor'}},
        {id:'fallback',effects:[{set:{licensed:false}}]}
    ];
    w.events.push({id:'fair',at:45,fixed:true,requires:[{fact:'dock',eq:true},{fact:'sailed',eq:true}],effects:[{set:{fair:true}}]});
    return w;
};
const timedChanges=()=>[
    {at:15,set:{dock:false,sponsor:true},cause:'life:storm'},
    {at:25,cancel:'market',cause:'life:closure'},
    {at:35,insert:{id:'repair',at:38,effects:[{set:{dock:true}},{add:{crates:3}}]},cause:'life:repair'},
    {at:42,set:{dock:false},cause:'life:storm2'}
];
test('timed set, cancellation and delayed insertion interleave without affecting earlier canon',()=>{
    const w=alteredHarbor(),branch={changes:timedChanges()};
    assert.equal(deriveSnapshot(w,14,{branch}).snapshot.facts.dock,true);
    const r=deriveSnapshot(w,50,{branch});
    assert.deepEqual(r.snapshot.facts,{dock:false,crates:5,sponsor:true,licensed:true,alternate:true,sailed:true,fair:true});
    assert.deepEqual(r.applied,['unload','license','ship','close','repair','fair']);
    assert.deepEqual(r.skipped,[{id:'market',reason:'Event cancelled by branch change.'}]);
    assert.deepEqual(r.substituted,[{id:'license',alt:'sponsored'}]);
    assert.deepEqual(r.resisted,[{id:'fair',reason:'Unmet requirement: dock.'}]);
    assert.deepEqual(r.evidence.map(e=>e.id),['unload','sponsored','ship']);
});
test('alternatives choose the first eligible candidate only when original requirements fail',()=>{
    const w=alteredHarbor();
    const canon=deriveSnapshot(w,20);
    assert.deepEqual(canon.substituted,[]);assert.equal(canon.snapshot.facts.alternate,undefined);
    const branch={changes:[{at:15,set:{dock:false}}]};
    let r=deriveSnapshot(w,50,{branch});
    assert.deepEqual(r.substituted,[{id:'license',alt:'fallback'}]);
    assert.equal(r.snapshot.facts.licensed,false);assert.match(r.skipped.find(s=>s.id==='ship').reason,/licensed/);
    w.events[1].alternatives.pop();r=deriveSnapshot(w,50,{branch});
    assert.deepEqual(r.substituted,[]);assert.equal(r.snapshot.facts.licensed,undefined);
    assert.deepEqual(r.skipped.map(s=>s.id),['license','ship']);
    assert.equal(explainFact(r,'licensed'),undefined);
    assert.deepEqual(r.evidence.map(e=>e.id),['unload']);
});
test('fixed events retain their effects and original evidence rather than substituting',()=>{
    const w=alteredHarbor();w.events[1].fixed=true;
    const r=deriveSnapshot(w,50,{branch:{changes:[{at:15,set:{dock:false,sponsor:true}}]}});
    assert.equal(r.snapshot.facts.licensed,true);assert.equal(r.snapshot.facts.alternate,undefined);
    assert.deepEqual(r.substituted,[]);
    assert.deepEqual(r.resisted.map(x=>x.id),['license','fair']);
    assert.deepEqual(r.evidence.map(e=>e.id),['unload','license','ship']);
    assert.deepEqual(explainFact(r,'licensed'),{by:'event',id:'license',at:20});
});
test('provenance identifies base, last writer, substitutes, insertion, and removal without aliasing',()=>{
    const w=alteredHarbor();w.base.facts.untouched={notes:['base']};
    const cause={life:2,action:'repair'},changes=timedChanges();changes[2].cause=cause;
    const r=deriveSnapshot(w,50,{branch:{changes}});
    assert.deepEqual(explainFact(r,'untouched'),{by:'base'});
    assert.deepEqual(explainFact(r,'dock'),{by:'change',at:42,cause:'life:storm2'});
    assert.deepEqual(explainFact(r,'licensed'),{by:'event',id:'sponsored',at:20});
    assert.deepEqual(explainFact(r,'crates'),{by:'change',id:'repair',at:38,cause});
    assert.deepEqual(explainFact(r,'permit'),{by:'event',id:'close',at:30});
    assert.equal(explainFact(r,'neverWritten'),undefined);
    const explanation=explainFact(r,'crates');explanation.cause.life=99;
    assert.equal(explainFact(r,'crates').cause.life,2);assert.equal(cause.life,2);
});
test('same-time canon precedes changes, changes retain authored ties, then insertions run',()=>{
    const w=world();w.events=[
        {id:'first',at:10,effects:[{set:{count:1}}]},
        {id:'second',at:10,requires:[{fact:'count',eq:1}],effects:[{set:{canon:true}}]}
    ];
    const branch={changes:[
        {at:10,set:{count:2},cancel:'second',insert:{id:'new',effects:[{add:{count:3}}]}},
        {at:10,set:{count:7}}
    ]};
    const r=deriveSnapshot(w,10,{branch});
    assert.equal(r.snapshot.facts.canon,true);assert.equal(r.snapshot.facts.count,10);
    assert.deepEqual(r.applied,['first','second','new']);assert.deepEqual(r.skipped,[]);
    assert.deepEqual(explainFact(r,'count'),{by:'change',id:'new',at:10});
});
test('cancellations persist, do not reverse past events, and also cancel fixed and inserted events',()=>{
    const w=alteredHarbor(),branch={changes:[
        {at:20,cancel:'unload'},
        {at:21,cancel:'fair'},
        {at:22,cancel:'new'},
        {at:25,insert:{id:'new',at:30,effects:[{set:{bad:true}}]}}
    ]};
    const prefix=deriveSnapshot(w,24,{branch});
    const r=deriveIncremental(w,prefix,50);
    assert.equal(r.snapshot.facts.crates,2);assert.equal(r.snapshot.facts.bad,undefined);
    assert.equal(r.snapshot.facts.fair,undefined);
    assert.deepEqual(r.skipped.map(s=>s.id),['new','fair']);assert.deepEqual(r.resisted,[]);
    assert.deepEqual(r,deriveSnapshot(w,50,{branch}));
});
test('incremental results preserve pending inserts, changes and histories across every boundary',()=>{
    const w=alteredHarbor(),branch={changes:timedChanges()},before=structuredClone({w,branch});
    let r=deriveSnapshot(w,0,{branch});
    for(const at of [10,15,20,25,30,35,35,37,38,40,42,45,50]) {
        const saved=structuredClone(r);r=deriveIncremental(w,r,at);
        assert.deepEqual(r,deriveSnapshot(w,at,{branch}));assert.deepEqual(saved,deriveSnapshot(w,saved.at,{branch}));
    }
    assert.deepEqual(deriveIncremental(w,r,20),deriveSnapshot(w,20,{branch}));
    const shuffled={changes:[branch.changes[3],branch.changes[1],branch.changes[0],branch.changes[2]]};
    const other=deriveSnapshot(w,50,{branch:shuffled});
    for(const key of ['snapshot','applied','skipped','substituted','resisted','evidence','provenance'])assert.deepEqual(other[key],r[key]);
    r.branch.changes[0].set.sponsor=false;r.snapshot.facts.untouched='own';
    assert.deepEqual({w,branch},before);
});
test('legacy and timed overrides derive equivalent behavior and can coexist',()=>{
    const w=alteredHarbor(),legacy={divergeAt:15,overrides:{dock:false,sponsor:true}};
    const timed={changes:[{at:15,set:legacy.overrides}]};
    const a=deriveSnapshot(w,50,{branch:legacy}),b=deriveSnapshot(w,50,{branch:timed});
    for(const key of ['snapshot','applied','skipped','substituted','resisted','evidence','provenance'])assert.deepEqual(a[key],b[key]);
    assert.equal(deriveSnapshot(w,50,{branch:{...legacy,changes:[{at:35,set:{dock:true}}]}}).snapshot.facts.dock,true);
});
test('invalid change and insertion times fail clearly, and old cached results rebuild metadata',()=>{
    for(const at of [NaN,Infinity,undefined])assert.throws(()=>deriveSnapshot(world(),50,{branch:{changes:[{at}]}}),/Invalid branch change time/);
    for(const at of [14,Infinity])assert.throws(()=>deriveSnapshot(world(),50,{branch:{changes:[{at:15,insert:{id:'bad',at,effects:[]}}]}}),/Inserted event/);
    const w=world(),r=deriveSnapshot(w,15);delete r.provenance;
    assert.deepEqual(deriveIncremental(w,r,50),deriveSnapshot(w,50));
});

const loopWorld=()=>({id:'test.loop',revision:1,base:{facts:{open:true,count:0},knowledge:{clerk:{schedule:{value:'daily',channel:'base',at:0}}}},anchors:[{id:'start',at:0},{id:'busy',at:12}],events:[
    {id:'learn',at:5,loop:true,reveal_at:40,effects:[{tell:{to:'hero',facts:{warning:{storm:true}},channel:'witness'}}]},
    {id:'work',at:10,loop:true,effects:[{add:{count:1}}]},
    {id:'close',at:15,loop:true,requires:[{knows:'clerk',fact:'warning',eq:true}],effects:[{set:{open:false}}]},
    {id:'market',window:{from:20,to:25},effects:[{set:{market:true}}]}
]});
test('knowledge gates facts and alternatives, retaining channel, time and structured false values',()=>{
    const w=loopWorld();w.events.push({id:'respond',at:16,requires:[{knows:'absent',fact:'warning',eq:true}],alternatives:[{id:'heroResponds',requires:[{knows:'hero',fact:'warning',eq:{storm:true}}],effects:[{set:{response:true}}]}]});
    const branch={changes:[{at:12,tell:{to:'clerk',facts:{warning:true,denied:false},channel:'letter'}}]};
    const r=deriveSnapshot(w,16,{branch});
    assert.equal(r.snapshot.facts.open,false);assert.equal(r.snapshot.facts.warning,undefined);
    assert.deepEqual(r.snapshot.knowledge.clerk.denied,{value:false,channel:'letter',at:12});
    assert.deepEqual(r.substituted,[{id:'respond',alt:'heroResponds'}]);
    assert.deepEqual(lintWorld(loopWorld()),[{kind:'never-fires',ids:['close']}]);
});
test('reveals update incrementally without reapplying effects and exclude skipped events',()=>{
    const w=loopWorld(),first=deriveSnapshot(w,16);
    assert.deepEqual(first.revealed,['work']);
    const next=deriveIncremental(w,first,50);
    assert.deepEqual(next,deriveSnapshot(w,50));assert(next.revealed.includes('learn'));assert(!next.revealed.includes('close'));
    assert.equal(next.snapshot.facts.count,1);
});
test('windows are inclusive, seeded, stable across prefixes and preserve seed on invalidation',()=>{
    const w=loopWorld(),seed='seeded',r=deriveSnapshot(w,0,{seed}),at=r.resolvedAt.market;
    assert(Number.isInteger(at) && at>=20 && at<=25);
    assert.equal(deriveSnapshot(w,at-1,{seed}).snapshot.facts.market,undefined);
    assert.equal(deriveSnapshot(w,at,{seed}).snapshot.facts.market,true);
    assert.deepEqual(deriveIncremental(w,r,30),deriveSnapshot(w,30,{seed}));
    w.base.facts.count=4;
    assert.deepEqual(deriveIncremental(w,r,30),deriveSnapshot(w,30,{seed}));
    assert.deepEqual(deriveIncremental(w,deriveSnapshot(w,30,{seed}),0),deriveSnapshot(w,0,{seed}));
    w.events.at(-1).window={from:2,to:2};assert.equal(deriveSnapshot(w,30).resolvedAt.market,2);
    w.events.at(-1).window={from:5,to:2};assert.throws(()=>deriveSnapshot(w,30),/Invalid event window/);
});
test('reset restores anchor canon, clears cancellations and pending inserts, and retains named knowledge',()=>{
    const w=loopWorld(),branch={changes:[
        {at:11,set:{count:99},cancel:'work',tell:{to:'clerk',facts:{warning:true},channel:'letter'},insert:{id:'pending',at:45,effects:[{set:{leak:true}}]}},
        {at:30,reset:{to:'start',keepKnowledge:['hero']}}
    ]};
    const before=structuredClone({w,branch}),r=deriveSnapshot(w,30,{branch});
    assert.deepEqual(r.snapshot.facts,w.base.facts);assert.deepEqual(r.snapshot.knowledge.clerk,w.base.knowledge.clerk);
    assert.deepEqual(r.snapshot.knowledge.hero.warning,{value:{storm:true},channel:'witness',at:5});
    assert.equal(r.localAt,0);assert.deepEqual(explainFact(r,'count'),{by:'base'});
    const next=deriveIncremental(w,r,46);
    assert.equal(next.snapshot.facts.count,1);assert.equal(next.snapshot.facts.leak,undefined);assert.equal(next.localAt,16);
    assert.deepEqual(next,deriveSnapshot(w,46,{branch}));assert.deepEqual({w,branch},before);
});
test('successive resets to nonzero anchors replay only later loop events and allow later changes',()=>{
    const w=loopWorld(),branch={changes:[{at:30,reset:{to:'busy',keepKnowledge:[]}},{at:32,set:{count:9}},{at:40,reset:{to:'start',keepKnowledge:[]}},{at:46,tell:{to:'clerk',facts:{warning:true},channel:'new'}}]};
    let r=deriveSnapshot(w,0,{branch,seed:'x'});
    for(const at of [12,30,32,33,40,45,46,50,55,70]) {
        r=deriveIncremental(w,r,at);assert.deepEqual(r,deriveSnapshot(w,at,{branch,seed:'x'}));
    }
    assert.equal(r.snapshot.facts.count,1);assert.equal(r.snapshot.facts.open,false);assert.equal(r.localAt,30);
    assert.equal(r.applied.filter(id=>id==='work').length,2);
});
test('reset anchor edits invalidate caches and unknown reset anchors fail clearly',()=>{
    const w=loopWorld(),branch={changes:[{at:30,reset:{to:'busy'}}]},r=deriveSnapshot(w,30,{branch});
    w.anchors[1].at=4;assert.deepEqual(deriveIncremental(w,r,35),deriveSnapshot(w,35,{branch}));
    assert.throws(()=>deriveSnapshot(w,40,{branch:{changes:[{at:30,reset:{to:'unknown'}}]}}),/Unknown anchor/);
});
