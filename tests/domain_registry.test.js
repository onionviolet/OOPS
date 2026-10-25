import test from 'node:test';
import assert from 'node:assert/strict';
import {createDomainRegistry} from '../src/domain_registry.js';
test('domain dependencies order optional lifecycle hooks without another clock or save',()=>{
 const registry=createDomainRegistry(),calls=[];let value;
 registry.registerDomain({id:'child',deps:['parent'],initialState:()=>({n:0}),load:v=>value=v,
  migrate:v=>({...v,n:v.n+1}),save:()=>value,validate:(v,e)=>calls.push(['child',v,e.parent]),
  tick:n=>calls.push(['tick',n]),commands:{quote:()=>7},projection:()=>value.n,panels:[()=>calls.push(['panel'])]});
 registry.registerDomain({id:'parent',validate:()=>calls.push(['parent'])});
 registry.initialize();assert.deepEqual(value,{n:0});
 const legacy={parent:1};registry.load(legacy);assert.deepEqual(legacy,{parent:1});assert.deepEqual(value,{n:1});
 assert.deepEqual(registry.save({parent:1}),{parent:1,child:{n:1}});
 registry.validate({parent:1,child:{n:3}});assert.deepEqual(calls,[['parent'],['child',{n:3},1]]);
 registry.tick(4);registry.mountPanels();assert.deepEqual(calls.slice(2),[['tick',4],['panel']]);
 assert.equal(registry.command('child','quote')(),7);assert.equal(registry.project('child'),1);
});
test('domain registration rejects duplicate ids, bad hooks, missing dependencies and cycles',()=>{
 const r=createDomainRegistry();r.registerDomain({id:'a',deps:['b']});
 assert.throws(()=>r.list(),/Missing domain/);assert.throws(()=>r.registerDomain({id:'a'}),/unique/);
 r.registerDomain({id:'b',deps:['a']});assert.throws(()=>r.list(),/cycle/);
 assert.throws(()=>createDomainRegistry().registerDomain({id:'bad',tick:1}),/hook/);
});

test('registration snapshots routing metadata while closure-owned state stays live',()=>{
 const r=createDomainRegistry(),calls=[];let n=0;
 const useItem={accepts:()=>true,quote:()=>({eligible:true}),execute:()=>calls.push('item')};
 const child={id:'child',deps:['parent'],panels:[()=>calls.push('panel')],commands:{useItem},tick:()=>calls.push(++n)};
 r.registerDomain(child);r.registerDomain({id:'parent',tick:()=>calls.push('parent')});
 assert.deepEqual(r.list().map(d=>d.id),['parent','child']);
 child.deps.push('missing');child.panels.length=0;child.commands.useItem=null;useItem.execute=()=>calls.push('wrong');
 const listed=r.list();listed.reverse();
 assert.throws(()=>listed[0].deps.push('missing'),TypeError);
 assert.throws(()=>{r.command('child','useItem').execute=()=>{};},TypeError);
 r.tick(1);r.mountPanels();assert.equal(r.useItem('key'),true);
 assert.deepEqual(calls,['parent',1,'panel','item']);
 // A late registration invalidates the cached order, including prior failures.
 r.registerDomain({id:'late',deps:['child'],tick:()=>calls.push('late')});
 r.tick(1);assert.deepEqual(calls.slice(-3),['parent',2,'late']);
});
