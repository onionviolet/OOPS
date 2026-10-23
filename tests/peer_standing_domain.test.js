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
