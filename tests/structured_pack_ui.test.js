import test from 'node:test';
import assert from 'node:assert/strict';
import {createStructuredPackPanel} from '../src/structured_pack_ui.js';
import {withPanelDom} from './helpers/mini_dom.mjs';
import {collectReady} from '../src/ready_rows.js';

const withDom=run=>withPanelDom(env=>run({...env,cleared:env.isCleared,
    find:function find(node,key,id){return node.dataset[key]===id?node:node.children.map(c=>find(c,key,id)).find(Boolean);}}));
const view=()=>({available:true,active:true,title:'A local beginning',place:'Workroom',description:'A modest room.',people:[{name:'Keeper',details:['You met today.']}],status:[{label:'Held',value:2}],actions:[{id:'work',label:'Prepare supplies',description:'Use your actual supplies.',eligible:true,reasons:[]}],jobs:[{id:'job.1',label:'Sorting',remaining:3,cancellable:true}],canWrite:true});

test('unchanged projection retains focus and remounts the same controls',()=>withDom(({document,host,find,text,tick,cleared})=>{
    const v=view(),calls=[];const panel=createStructuredPackPanel({read:()=>v,command:r=>calls.push(r)});
    const element=host.children[0],action=find(element,'structuredAction','work');action.focus();tick();
    assert.equal(document.activeElement,action);assert.equal(find(element,'structuredAction','work'),action);
    host.replaceChildren();tick();assert.equal(host.children[0],element);assert.equal(find(element,'structuredAction','work'),action);
    action.click();assert.deepEqual(calls,[{type:'action',id:'work'}]);assert.match(text(element),/Started: Prepare supplies\.|Done: Prepare supplies\.|Chosen: Prepare supplies\./);
    find(element,'structuredCancel','job.1').click();assert.deepEqual(calls[1],{type:'cancel',jobId:'job.1'});
    v.canWrite=false;tick();assert.equal(find(element,'structuredAction','work').disabled,true);assert.equal(find(element,'structuredCancel','job.1').disabled,true);
    find(element,'structuredAction','work').click();assert.equal(calls.length,2);
    v.canWrite=true;v.actions[0].eligible=false;tick();assert.equal(find(element,'structuredAction','work').disabled,true);
    panel.destroy();assert.equal(host.children.length,0);assert.equal(cleared(),true);
}));

test('only projected rows render and raw extras do not change the controls',()=>withDom(({host,find,text,tick})=>{
    const v=view();v.secret='RAW_SECRET';v.people[0].truth='RAW_PERSON';v.actions[0].source='RAW_SOURCE';
    const panel=createStructuredPackPanel({read:()=>v,command:()=>{}}),element=host.children[0],action=find(element,'structuredAction','work');
    assert.match(text(element),/Keeper.*You met today.*Held: 2.*3 played minutes/s);assert.doesNotMatch(text(element),/RAW_/);
    v.secret='CHANGED_SECRET';v.actions[0].source='CHANGED_SOURCE';tick();assert.equal(find(element,'structuredAction','work'),action);
    panel.destroy();
}));

test('inactive begin is neutral and rejection shows safe host error without success text',()=>withDom(({host,find,text,tick})=>{
    const v=view();v.active=false;const calls=[];
    const panel=createStructuredPackPanel({read:()=>v,command:r=>{calls.push(r);v.error='Supplies are no longer available.';throw Error('RAW_INTERNAL_SECRET');}});
    const element=host.children[0];assert.equal(find(element,'structuredAction','work'),undefined);assert.equal(find(element,'structuredCancel','job.1'),undefined);
    find(element,'structuredBegin','begin').click();assert.deepEqual(calls,[{type:'begin'}]);assert.match(text(element),/Supplies are no longer available\./);assert.doesNotMatch(text(element),/Saved\.|RAW_INTERNAL_SECRET/);
    v.canWrite=false;tick();assert.equal(find(element,'structuredBegin','begin').disabled,true);
    v.available=false;tick();assert.equal(element.hidden,true);assert.equal(find(element,'structuredBegin','begin'),undefined);
    panel.destroy();
}));


test('countdown preserves keyboard focus and host errors outrank old saved notice',()=>withDom(({document,host,find,text,tick})=>{
    const v=view(),panel=createStructuredPackPanel({read:()=>v,command:()=>{}}),element=host.children[0];
    find(element,'structuredAction','work').click();
    find(element,'structuredCancel','job.1').focus();
    v.jobs[0].remaining=2;tick();
    assert.equal(document.activeElement,find(element,'structuredCancel','job.1'));
    v.error='Saving is unavailable.';tick();
    assert.match(text(element),/Saving is unavailable/);assert.doesNotMatch(text(element),/Saved\./);panel.destroy();
}));

test('repeated work rechecks completion and eligibility, including host reentrant render',()=>withDom(({host,find,text,tick})=>{
    const v=view();v.jobs=[];Object.assign(v.actions[0],{duration:3,completed:0,repeatable:true,costs:['1 stamina']});
    let panel,calls=0;
    panel=createStructuredPackPanel({read:()=>v,command:r=>{assert.equal(r.type,'action');calls++;v.jobs=[{id:'job.'+calls,commandId:'work',label:'Work',remaining:3,duration:3,cancellable:true}];panel.render(true);}});
    const element=host.children[0];find(element,'structuredRepeat','work').click();assert.equal(calls,1);assert.match(text(element),/2 further repetitions/);
    v.jobs=[];v.actions[0].completed=1;tick();assert.equal(calls,2);assert.match(text(element),/1 further repetitions/);
    v.jobs=[];v.actions[0].completed=2;v.actions[0].eligible=false;v.actions[0].reasons=['No stock remains.'];tick();
    assert.equal(calls,2);assert.match(text(element),/Repeated work stopped.*No stock remains/);panel.destroy();
}));

test('stopping repeats leaves current job intact; cancelled jobs never trigger another order',()=>withDom(({host,find,text,tick})=>{
    const v=view();v.jobs=[];Object.assign(v.actions[0],{duration:3,completed:0,repeatable:true});let calls=0;
    const panel=createStructuredPackPanel({read:()=>v,command:()=>{calls++;v.jobs=[{id:'job.1',commandId:'work',label:'Work',remaining:3,cancellable:true}];}}),element=host.children[0];
    find(element,'structuredRepeat','work').click();find(element,'structuredRepeat','stop').click();
    assert.equal(v.jobs.length,1);v.jobs=[];v.actions[0].completed=1;tick();assert.equal(calls,1);
    find(element,'structuredRepeat','work').click();v.jobs=[];tick();assert.equal(calls,2);assert.match(text(element),/Repeated work stopped/);panel.destroy();
}));


test('loss of write ownership stops a plan while current job is still pending',()=>withDom(({host,find,text,tick})=>{
    const v=view();v.jobs=[];Object.assign(v.actions[0],{duration:3,completed:0,repeatable:true});let calls=0;
    const panel=createStructuredPackPanel({read:()=>v,command:()=>{calls++;v.jobs=[{id:'job.1',commandId:'work',label:'Work',remaining:3,cancellable:true}];}}),element=host.children[0];
    find(element,'structuredRepeat','work').click();v.canWrite=false;tick();assert.equal(find(element,'structuredRepeat','stop'),undefined);
    assert.equal(v.jobs.length,1);v.canWrite=true;v.jobs=[];v.actions[0].completed=1;tick();assert.equal(calls,1);panel.destroy();
}));

test('renewal preview shows current and after-renewal mastery and reserve',()=>withDom(({host,text})=>{
    const v=view();v.renewal={visible:true,eligible:true,label:'Renewal',description:'Start over wiser.',lost:[],retain:[],reward:'A legacy.',reasons:[],mastery:4,reserve:7,masteryThreshold:3,next:{mastery:1,reserve:0},raw:'RAW_RENEWAL'};
    const panel=createStructuredPackPanel({read:()=>v,command:()=>{}});
    assert.match(text(host.children[0]),/Method mastery: 4 now \(needs 3\), 1 after renewal.*Training reserve: 7 now, 0 after renewal/s);assert.doesNotMatch(text(host.children[0]),/RAW_RENEWAL/);
    panel.destroy();
}));

// G10 (Fang Yuan's first screen): a life whose only move is the next story step opens with that step first, above the account of how it began.
test('an active life with only an open next step leads with that step',()=>withDom(({host,find,text,tick})=>{
    const v=view();v.actions=[];v.jobs=[];v.extensions=[{id:'ext.hearing',label:'Fang Yuan at the clan hearing',description:'Answer the elder’s summons.',eligible:true,reasons:[],revision:1,contentHash:'h'}];
    const panel=createStructuredPackPanel({read:()=>v,command:()=>{}}),element=host.children[0];
    const body=element.children[1],step=find(element,'structuredExtension','ext.hearing');
    assert.ok(step);assert.equal(step.disabled,false);
    const stepAt=text(body).indexOf('Choose Fang Yuan'),historyAt=text(body).indexOf('Keeper');
    assert.ok(stepAt>=0&&historyAt>=0&&stepAt<historyAt,'the step comes before the opening account');
    panel.destroy();
}));

test('open actions still come before the next step',()=>withDom(({host,text})=>{
    const v=view();v.extensions=[{id:'ext.hearing',label:'Fang Yuan at the clan hearing',description:'Answer the summons.',eligible:true,reasons:[],revision:1,contentHash:'h'}];
    const panel=createStructuredPackPanel({read:()=>v,command:()=>{}}),body=host.children[0].children[1];
    assert.ok(text(body).indexOf('Prepare supplies')<text(body).indexOf('Choose Fang Yuan'));panel.destroy();
}));

test('a next step that is still shut is not lifted above the opening account',()=>withDom(({host,text})=>{
    const v=view();v.actions=[];v.jobs=[];v.extensions=[{id:'ext.hearing',label:'Fang Yuan at the clan hearing',description:'Answer the summons.',eligible:false,reasons:['Not yet.'],revision:1,contentHash:'h'}];
    const panel=createStructuredPackPanel({read:()=>v,command:()=>{}}),body=host.children[0].children[1];
    assert.ok(text(body).indexOf('Keeper')<text(body).indexOf('Choose Fang Yuan'));panel.destroy();
}));

// PS304 (proposal): acts that cannot run yet fold into one "Not yet (n)" line with each reason; ready acts lead. The fold is the
// Display > Look "Not yet acts" dial (folded default, open, hidden); only story steps are capped at three.
test('acts that cannot run yet fold into one Not yet line with their reasons, behind a dial', () => withDom(({host, find, text, tick}) => {
    const v = view(), base = v.actions[0];
    v.actions = [{...base, id: 'ready', label: 'Do it now', eligible: true, reasons: []},
        ...['s1', 's2', 's3', 's4'].map(id => ({...base, id, label: `Story ${id}`, eligible: false, repeatable: false, completed: 0, reasons: ['Later.']})),
        {...base, id: 'patrol', label: 'Patrol', eligible: false, repeatable: true, completed: 1, reasons: ['Your Moonglow Gu is hungry and will not cut. Feed it first.']}];
    const panel = createStructuredPackPanel({read: () => v, command: () => {}}); tick();
    const inFold = id => { const card = find(host.children[0], 'structuredAction', id).parentElement; for(let n = card; n && n !== host; n = n.parentElement) if(n.className === 'action-legibility__not-yet') return n; return null; };
    assert.equal(inFold('ready'), null, 'a ready act leads, outside the fold');
    const fold = inFold('patrol'); assert.ok(fold, 'a blocked repeatable act folds');
    assert.match(text(fold), /hungry and will not cut/, 'its reason is kept');
    assert.match(text(fold.children[0]), /^Not yet \(\d\)$/);
    assert.equal(fold.open, false, 'folded by default');
    assert.equal(find(host.children[0], 'structuredAction', 's4').parentElement.hidden, true, 'story steps past the next three stay shut');
    panel.destroy();
}));

test('an instant act shows the outcome note it wrote, not only "Done"', () => withDom(({host, find, text}) => {
    const v = view(); v.jobs = []; v.actions = [{...v.actions[0], id: 'report', label: 'Report the watch', duration: 0, completed: 0, eligible: true, reasons: []}];
    v.status = [{label: 'Held', value: 2}, {label: 'Last watch', value: 'Quiet night.', note: true}];
    const panel = createStructuredPackPanel({read: () => v, command: () => {
        v.actions[0] = {...v.actions[0], completed: 1};
        v.status = [{label: 'Held', value: 3}, {label: 'Last watch', value: 'A pack came at the wall; 100 merit on the board.', note: true}];
    }});
    find(host.children[0], 'structuredAction', 'report').click();
    assert.match(text(host.children[0]), /Done: Report the watch\. A pack came at the wall; 100 merit on the board\./);
    assert.doesNotMatch(text(host.children[0]), /Done: Report the watch\. 3/, 'a changed count is not an outcome');
    panel.destroy();
}));

test('a timed act says what came of it when the work settles, not only "to go"', () => withDom(({host, find, text, tick}) => {
    const v = view(); v.jobs = []; v.actions = [{...v.actions[0], id: 'refine', label: 'Refine the wild Gu', duration: 60, completed: 0, repeatable: true, runs: 1}];
    v.status = [{label: 'Refining', value: 'Not yet.', note: true}];
    const panel = createStructuredPackPanel({read: () => v, command: () => { v.jobs = [{id: 'job.r', commandId: 'refine', label: 'Refine', remaining: 60, duration: 60}]; }});
    const element = host.children[0];
    assert.equal(find(element, 'structuredRepeat', 'refine').hidden, true, 'one wild Gu in hand: nothing to repeat');
    find(element, 'structuredAction', 'refine').click(); assert.match(text(element), /Started: Refine the wild Gu\. 1 h to go\./);
    v.jobs = []; v.actions[0] = {...v.actions[0], completed: 1}; v.status = [{label: 'Refining', value: 'It came out a Moonlight Gu.', note: true}]; tick();
    assert.match(text(element), /Done: Refine the wild Gu\. It came out a Moonlight Gu\./); assert.doesNotMatch(text(element), /to go/);
    v.actions[0] = {...v.actions[0], runs: 2}; tick(); const repeat = find(element, 'structuredRepeat', 'refine');
    assert.equal(repeat.hidden, false); assert.equal(text(repeat).trim(), 'Repeat ×2'); assert.equal(repeat.title, 'Repeat Refine the wild Gu 2 times');
    panel.destroy();
}));

test('PS57/PS55: a life\'s day acts are hub rows that run like the button, and the result line names what uses its gain', () => withDom(({host, find, text}) => {
    const v = view(); v.jobs = [];
    v.actions = [{id: 'buy', label: 'Buy a bag of Moon Orchid petals', duration: 0, completed: 0, eligible: true, reasons: [], costs: ['1 × Primeval stone'], repeatable: false},
        {id: 'feed', label: 'Feed the Moonglow Gu', duration: 5, completed: 1, eligible: false, reasons: ['Needs 2 Moon Orchid petals; you have 0.'], costs: ['2 × Moon Orchid petals'], repeatable: true}];
    const calls = [];
    const panel = createStructuredPackPanel({read: () => v, command: r => { calls.push(r); v.actions[0] = {...v.actions[0], completed: 1}; v.actions[1] = {...v.actions[1], eligible: true, reasons: []}; }});
    try {
        const mine = () => collectReady().filter(r => r.source === 'life-day');
        assert.deepEqual(mine().map(r => [r.label, r.state]), [['Buy a bag of Moon Orchid petals', 'ready'], ['Feed the Moonglow Gu', 'near']]);
        assert.equal(mine()[1].gap, 'Needs 2 Moon Orchid petals; you have 0.'); assert.deepEqual(mine()[1].uses, ['Moon Orchid petals']);
        assert.deepEqual(mine().map(r => r.verb), ['trade', 'feed'], 'PS120: each row names the verb it belongs to');
        mine()[0].act(); assert.deepEqual(calls, [{type: 'action', id: 'buy'}]);
        assert.match(text(host.children[0]), /Done: Buy a bag of Moon Orchid petals\.\s+Next:\s+Feed the Moonglow Gu/);
    } finally { panel.destroy(); }
    assert.equal(collectReady().some(r => r.source === 'life-day'), false, 'destroy unregisters the source');
}));

test('UIC278: the story block is one marked node that stays where another owner puts it', () => withDom(({host, find, text, tick}) => {
    const v = view(); v.actions = []; v.jobs = []; v.extensions = [{id: 'ext.hearing', label: 'Fang Yuan at the clan hearing', description: 'Answer the summons.', eligible: true, reasons: [], revision: 1, contentHash: 'h'}];
    const panel = createStructuredPackPanel({read: () => v, command: () => {}}), body = host.children[0].children[1];
    const story = body.children.find(n => n.dataset.hereStory !== undefined);
    assert.ok(story, 'marked data-here-story'); assert.match(text(story), /Choose Fang Yuan at the clan hearing/);
    const elsewhere = host; elsewhere.append(story); v.extensions[0] = {...v.extensions[0], label: 'Fang Yuan before the elder'}; panel.render(true); tick();
    assert.equal(story.parentElement, elsewhere, 'the panel does not pull it back'); assert.match(text(story), /Fang Yuan before the elder/, 'and still renders into it');
    panel.destroy();
}));
