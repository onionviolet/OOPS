import test from 'node:test';
import assert from 'node:assert/strict';
import {craftBatchProposal,craftReceiptText} from '../src/crafting_detail.js';
import {renderCraftingDetail} from '../src/crafting_detail.js';
import {createDom} from '../scripts/headless/dom.mjs';

test('known effect projection is visible before commitment; refresh retains reference and scroll without crafting',()=>{
    const previous=globalThis.document,dom=createDom();dom.loadHTML('<html><body><div id="detail"></div></body></html>');globalThis.document=dom.document;
    try {
        const root=document.getElementById('detail');let commits=0;
        const model={title:'Balm',description:'Apply to a wound.',requirements:[],effects:[{name:'Healing',duration:'90m',details_html:'<p>Healing · 90m · Hp regen +12.03</p>'}],output:{name:'Balm',count:1},available:true,attempts:1,xp:'1',result_details:'<p>Full result</p>'};
        const handlers={onCommit:()=>commits++};renderCraftingDetail(root,model,handlers);
        assert.match(root.querySelector('[data-craft-effects]').textContent,/\+12.03/);assert.match(root.textContent,/Apply to a wound/);
        root.querySelector('.craft_detail_stock').open=true;root.querySelector('.craft_detail_body').scrollTop=40;
        renderCraftingDetail(root,model,handlers);assert.equal(root.querySelector('.craft_detail_stock').open,true);assert.equal(root.querySelector('.craft_detail_body').scrollTop,40);assert.equal(commits,0);
        renderCraftingDetail(root,{...model,title:'Unknown trial',effects:[],singleAttempt:true,commitLabel:'Try one batch',description:'Effects unobserved'},handlers);
        assert.equal(root.querySelector('[data-craft-amount]'),null);assert.equal(root.querySelector('[data-craft-commit]').textContent,'Try one batch');assert.doesNotMatch(root.textContent,/12.03/);assert.equal(root.querySelector('.craft_detail_body').scrollTop,0);
    } finally {globalThis.document=previous;}
});

test('batch preview quotes maximum native input use without reserving it or promising outputs',()=>{
    const proposal=craftBatchProposal({requirements:[{label:'ore',need:2},{label:'wood',need:1}],available:3,requested:5});
    assert.match(proposal,/up to 3 attempts/);assert.match(proposal,/6 ore, 3 wood/);assert.match(proposal,/skill limits can stop earlier/);assert.match(proposal,/reserves nothing/);
    assert.equal(craftBatchProposal({requirements:[],available:0,requested:Infinity}),'No attempts are available. This preview reserves nothing.');
});

test('receipt reports measured attempt and success totals for immediate batches',()=>{
    const text=craftReceiptText({made:2,result_name:'ingots',used:[{name:'ore',count:3}],xp:0,skill_id:'Forging',skill_level:1,attempted:5,successful:2});
    assert.match(text,/2 of 5 native attempts succeeded/);
    assert.match(craftReceiptText({made:0,result_name:'ingots',used:[{name:'ore',count:1}],xp:0,attempted:1,successful:0}),/0 of 1 native attempts succeeded/);
});

import {craftGlance, chanceWord, glanceText, needChips} from '../src/ui/craft_glance.js';

const base = {title: 'Charm', requirements: [{label: 'Rat tail', need: 2, have: 3}, {label: 'Rat tail', need: 1, have: 3}], output: {name: 'Charm', count: 1},
    chance: 65, station: 'Bench, tier 1', available: true, attempts: 1};

test('glance states time, cost, result, quality and chance in words, with no invented numbers', () => {
    const g = craftGlance({...base, time: 'Instant', spendsOnFailure: true});
    const row = key => g.rows.find(r => r.key === key).value;
    assert.equal(g.status.state, 'ok');
    assert.match(g.status.text, /1 attempt possible now/);
    assert.equal(row('time'), 'Instant');
    assert.match(row('cost'), /spent on every attempt, including failures/);
    assert.equal(g.rows.some(r => r.key === 'quality'), false, 'inapplicable quality is not a fabricated grade');
    assert.equal(row('chance'), '65% · likely');
    const bare = craftGlance({...base, chance: null});
    assert.equal(bare.rows.find(r => r.key === 'time').value, 'Not stated');
    assert.equal(bare.rows.find(r => r.key === 'chance').value, 'Unassessed');
    // PS144: the result row says how many you already hold, and says nothing when the count is not known.
    assert.match(craftGlance({...base, output: {...base.output, owned: 4}}).rows.find(r => r.key === 'result').value, / · you have 4$/);
    assert.doesNotMatch(bare.rows.find(r => r.key === 'result').value, /you have/);
});

test('blocked glance carries the one reason and marks each short input', () => {
    const model = {...base, available: false, blocked_reason: "Can't craft yet: missing 2 Rat tail.", attempts: 0, requirements: [{label: 'Rat tail', need: 2, have: 0}]};
    const g = craftGlance(model);
    assert.equal(g.status.state, 'blocked');
    assert.equal(g.status.text, model.blocked_reason);
    assert.deepEqual(needChips(model.requirements), [{state: 'blocked', text: 'Rat tail 0/2', note: 'short 2'}]);
    assert.match(glanceText(g), /^✕ Can't craft yet/);
});

test('a real quality range is shown as given and chance words follow the default bands', () => {
    const g = craftGlance({...base, quality: {range: [80, 110], note: 'cap 200'}});
    assert.equal(g.rows.find(r => r.key === 'quality').value, 'Quality 80–110 · cap 200');
    assert.deepEqual([95, 60, 59, 10, 9, null].map(chanceWord), ['reliable', 'likely', 'uncertain', 'unlikely', 'very unlikely', 'unassessed']);
});

test('known stock counts the unblocked amount and held-back groups read as reserved', () => {
    const [chip] = needChips([{label: 'Ore', need: 2, have: 5, stockKnown: true, usable: 2, held_back: true}]);
    assert.deepEqual(chip, {state: 'blocked', text: 'Ore 2/2', note: 'reserved'});
});

import {figureText} from '../src/ui/figure.js';
import {CRAFTING_FIXTURES} from '../src/ui/preview/fixtures/crafting.js';

test('crafting flow fixtures validate and keep every fact in the text form', () => {
    for (const spec of CRAFTING_FIXTURES) {
        const text = figureText(spec);
        assert.match(text, /Blade to|Workbench to Blade/);
        assert.match(text, /missing 1 Binding strip/);
    }
});

test('an input blocked only by heat reads blocked, not enough', () => {
    const [chip] = needChips([{label: 'Ore', need: 1, have: 3, heat_reason: 'needs a hotter fire'}]);
    assert.deepEqual(chip, {state: 'blocked', text: 'Ore 3/1', note: 'wrong heat'});
});

test('unchanged empty detail keeps its node, while selecting and clearing a recipe refreshes it',()=>{
    const previous=globalThis.document,dom=createDom();dom.loadHTML('<html><body><div id="detail"></div></body></html>');globalThis.document=dom.document;
    try {
        const root=document.getElementById('detail');
        renderCraftingDetail(root,null,{});const empty=root.firstElementChild;
        renderCraftingDetail(root,null,{});assert.equal(root.firstElementChild,empty);
        renderCraftingDetail(root,{title:'Balm',requirements:[],effects:[],output:{name:'Balm',count:1},available:true,attempts:1},{});
        assert.notEqual(root.firstElementChild,empty);assert.equal(root.dataset.state,'ready');
        renderCraftingDetail(root,null,{});assert.equal(root.dataset.state,'empty');
        assert.match(root.textContent,/Select a recipe/);assert.doesNotMatch(root.textContent,/Balm/);
    } finally {globalThis.document=previous;}
});

test('a blocked commit names its time and says why beside the buttons (UR102, UIC111)',()=>{
    const previous=globalThis.document,dom=createDom();dom.loadHTML('<html><body><div id="detail"></div></body></html>');globalThis.document=dom.document;
    try {
        const root=document.getElementById('detail');let blocked=0;
        renderCraftingDetail(root,{title:'Steep',requirements:[],effects:[],output:{name:'Preparation',count:1},singleAttempt:true,commitLabel:'Try one batch',when:'instant',available:false,attempts:0,blocked_reason:'Select at least one carried material for an experiment.'},{onBlocked:()=>blocked++});
        const commit=root.querySelector('[data-craft-commit]'),why=root.querySelector('[data-craft-commit-reason]');
        assert.equal(commit.textContent,'Try one batch · instant');
        assert.equal(why.textContent,'Select at least one carried material for an experiment.');
        assert.equal(commit.getAttribute('aria-describedby'),why.id);
        assert.equal(why.parentElement,commit.closest('.craft_detail_actions'));
        commit.click();assert.equal(blocked,1);
    } finally {globalThis.document=previous;}
});

test('a short input links to the known recipe that makes it, through the same follow that gives Back (PS144)',()=>{
    const previous=globalThis.document,dom=createDom();dom.loadHTML('<html><body><div id="detail"></div></body></html>');globalThis.document=dom.document;
    try {
        const root=document.getElementById('detail');const followed=[];
        const req={label:'Sinew',need:2,have:0,missing:true,inspect:{id:'Sinew',name:'Sinew'}};
        const model={title:'Bow',description:'',requirements:[req],effects:[],output:{name:'Bow',count:1},available:false,attempts:0,
            related:[{title:'Cure sinew',recipe_id:'cure',via:'Produces an input',outputId:'Sinew',available:true,target:{recipe_id:'cure'}},{title:'Other',recipe_id:'o',via:'Uses this output',outputId:'Bow',available:true}]};
        renderCraftingDetail(root,model,{onRelated:t=>followed.push(t)});
        const make=root.querySelector('.craft_source_make');
        assert.equal(make.textContent,'Make it: Cure sinew');make.click();assert.deepEqual(followed,[{recipe_id:'cure'}]);
        renderCraftingDetail(root,{...model,related:[]},{});assert.equal(root.querySelector('.craft_source_make'),null,'no maker known, no link');
    } finally {globalThis.document=previous;}
});

test('a batch names the material it runs out of before it starts (PS145)',async()=>{
    const {batchBoundary}=await import('../src/crafting_detail.js');
    const reqs=[{label:'Sinew',need:2,have:7},{label:'Sinew',need:1,have:7},{label:'Wood',need:1,have:9}];
    assert.equal(batchBoundary(reqs,2),'Makes 2 attempts, then runs out of Sinew. ');
    assert.match(craftBatchProposal({requirements:reqs,available:2,requested:10}),/^Makes 2 attempts, then runs out of Sinew\. Proposed up to 2/);
    assert.doesNotMatch(craftBatchProposal({requirements:reqs,available:2,requested:1}),/runs out/,'a request inside the stock names no boundary');
    assert.equal(batchBoundary(reqs,1),'','a limit set by something else (skill, station) does not blame a material');
    assert.equal(batchBoundary([{label:'Ore',need:1,stockKnown:true,usable:3,have:8}],3),'Makes 3 attempts, then runs out of Ore. ','reserved stock does not count');
});

test('the success chance opens into its parts: recipe range, your level and station, then charms and ledger (DU1)',async()=>{
    const {craftChanceParts}=await import('../src/ui/craft_glance.js');
    const parts=craftChanceParts({floor:.1,ceiling:.9,range:[1,10],level:3,tier:2,skill:'Tinkering',total:30});
    assert.equal(parts[0],'This recipe: 10% at Tinkering 1, rising to 90% by Tinkering 10.');
    assert.equal(parts[1],'Your Tinkering 3, plus 1 for the tier 2 station: 24%.');
    assert.equal(parts[2],'Worn charms and the work ledger: +6%.');
    assert.equal(parts.at(-1),'Now: 30%.');
    assert.equal(craftChanceParts({floor:.1,ceiling:.9,range:[1,10],level:3,tier:2,skill:'T',total:24}).length,3,'no charm line when nothing adds');
    assert.equal(craftChanceParts({floor:.2,ceiling:1,range:[5,15],level:0,skill:'',total:11})[1],'Your level 0: 11%.','an undiscovered skill stays unnamed');
    const previous=globalThis.document,dom=createDom();dom.loadHTML('<html><body><div id="detail"></div></body></html>');globalThis.document=dom.document;
    try {
        const root=document.getElementById('detail');
        renderCraftingDetail(root,{title:'X',description:'',requirements:[],effects:[],output:{name:'X',count:1},available:true,attempts:1,chance:30,chance_parts:parts},{});
        const why=root.querySelector('[data-craft-chance-why]');
        assert.match(why.textContent,/^Why 30%\?/);assert.match(why.textContent,/plus 1 for the tier 2 station/);
    } finally {globalThis.document=previous;}
});

test('an "Any coal" row names its stand-ins on the row, in the order they are used (PS165)',()=>{
    const previous=globalThis.document,dom=createDom();dom.loadHTML('<html><body><div id="detail"></div></body></html>');globalThis.document=dom.document;
    try {
        const root=document.getElementById('detail');
        const req={label:'Any coal',need:1,have:15,variants:[{name:'Coal',count:12},{name:'Charcoal',count:3}]};
        renderCraftingDetail(root,{title:'X',description:'',requirements:[req],effects:[],output:{name:'X',count:1},available:true,attempts:1},{});
        assert.equal(root.querySelector('.craft_req_variants').textContent,'Coal 12 · Charcoal 3');
        renderCraftingDetail(root,{title:'X',description:'',requirements:[{...req,variants:[{name:'Coal',count:12}]}],effects:[],output:{name:'X',count:1},available:true,attempts:1},{});
        assert.equal(root.querySelector('.craft_req_variants'),null,'one kind needs no list');
    } finally {globalThis.document=previous;}
});
