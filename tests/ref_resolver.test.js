import test from 'node:test';
import assert from 'node:assert/strict';
import {refOf,renderRefs} from '../src/ref_resolver.js';
import {createChronicle,commandChronicle,advanceChronicle,validateChronicle} from '../src/chronicle.js';

const ctx={names:{'person:maia':'Maia'}};
test('text without a token is byte-identical',()=>{
    for(const t of ['','plain ‘quoted’ {braces} {ref} {ref:} ref:x',"I was Ada's apprentice."]) assert.equal(renderRefs(t,ctx),t);
    assert.equal(renderRefs(undefined,ctx),undefined);
});
test('a token renders the name',()=>assert.equal(renderRefs('I met {ref:person:maia} today.',ctx),'I met Maia today.'));
test('unknown id renders fallback and never throws',()=>{
    assert.equal(renderRefs('{ref:person:zed}',ctx),'unknown');
    assert.equal(renderRefs('{ref:person:zed|a stranger}',ctx),'a stranger');
    assert.equal(renderRefs('{ref:x}',null),'unknown');
    assert.equal(refOf('x',{names:()=>{throw new Error('boom')}}).label,'unknown');
    assert.equal(refOf('__proto__',ctx).known,false);
});
test('masked id renders residue',()=>{
    const m={...ctx,masked:{'person:maia':true}};
    assert.deepEqual(refOf('person:maia',m),{id:'person:maia',label:'someone',known:false,residue:true});
    assert.equal(renderRefs('{ref:person:maia}',{...m,masked:{'person:maia':'a name you cannot hold'}}),'a name you cannot hold');
});
test('chronicle notes: old-save-like text unchanged, new token note resolves',()=>{
    const cal={year:999,month:4,day:1,hour:8,minute:0,day_count:1};
    const c=createChronicle(0,cal,true);
    validateChronicle(c,0);
    assert.ok(c.log.every(m=>!m.text.includes('{ref:')));
    assert.equal(c.log[0].text,'A new chronicle begins. Local invitations have game-time deadlines; rumors can reach you later.');
});
