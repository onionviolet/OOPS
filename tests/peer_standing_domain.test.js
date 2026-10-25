import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/home_domain.js';
import {validateTrust,trustState,projectTrust,TRUST_RULES} from '../src/peer_standing_domain.js';
import {domainRegistry} from '../src/domain_registry.js';
import {giveGift,createTrustState} from '../src/peer_standing.js';
const d=()=>domainRegistry.list().find(x=>x.id==='social_trust');
test('trust slice: absent loads empty, empty is not saved, unknown members are rejected',()=>{
    d().load(d().migrate(undefined));assert.deepEqual(trustState().trust,{});
    assert.equal(d().save({}),undefined);
    assert.throws(()=>validateTrust({family:'social.trust@1',trust:{ghost:3}}),/unknown/);
    assert.throws(()=>validateTrust({family:'x',trust:{}}),/Unsupported/);
    const s=giveGift(TRUST_RULES,createTrustState(),'home.manor.cook',10).state;validateTrust(s);
    d().load(d().migrate(s));assert.equal(d().save({}).trust['home.manor.cook'],1);
});
test('projection stays hidden until the manor household exists',()=>{assert.equal(projectTrust().visible,false);});

import {quoteGift,executeGift,useHomeCommandsForTest} from '../src/peer_standing_domain.js';
test('gift trust is present in the same durable home publication, and failed payment restores its prior trust',()=>{
 const patch=over=>useHomeCommandsForTest(name=>over[name]);
 try{
  d().load(null);let saved;patch({quote:r=>({eligible:true,request:r})});
  patch({quote:r=>({eligible:true,request:r}),execute:()=>{saved=d().save({});return {message:'paid'};}});executeGift(quoteGift({actor:'home.manor.cook',amount:10}));assert.equal(saved.trust['home.manor.cook'],1);assert.equal(trustState().trust['home.manor.cook'],1);
  patch({quote:r=>({eligible:true,request:r}),execute:()=>{assert.equal(d().save({}).trust['home.manor.cook'],2);throw Error('durable write refused');}});assert.throws(()=>executeGift(quoteGift({actor:'home.manor.cook',amount:10})),/durable write refused/);assert.equal(trustState().trust['home.manor.cook'],1);
 }finally{useHomeCommandsForTest();d().load(null);}
});
