import test from 'node:test';
import assert from 'node:assert/strict';
import {createMixtureState,resolveMixture,mixtureKey,productFromKey,validateMixtureState,validateMixtureEnvelope,mixturePresentation,splitComposition,diluteComposition,mixtureExposure,validateExposure,localMixtureSeed} from '../src/mixture_state.js';
import {restoreActiveEffect,effect_templates} from '../src/active_effects.js';
const inputs={'River bellleaf':1,'Spring water':1};
const fixture=()=>{const s=createMixtureState(12345),p=resolveMixture(s,inputs,'steep');s.products[p.id]=p;return {s,p};};
test('family generator is deterministic with correlated axes, accounted fractions, pinned golden draw',()=>{
    assert.equal(localMixtureSeed(12345,'village.mixtures.family@1:River bellleaf'),658011158);
    assert.deepEqual(createMixtureState(12345),createMixtureState(12345));assert.notDeepEqual(createMixtureState(12345).profiles,createMixtureState(54321).profiles);
    for(let seed=0;seed<100;seed++){const s=createMixtureState(seed);validateMixtureState(s);const p=s.profiles['River bellleaf'];assert.equal(p.fractions.restore,100+10*p.axis);assert.equal(p.fractions.trace,10+p.axis);}
});
test('pure preview, input-order invariance, ratios/process distinctions and complete conservation',()=>{
    const s=createMixtureState(42),before=JSON.stringify(s);const a=resolveMixture(s,inputs,'steep');for(let i=0;i<10;i++)assert.deepEqual(resolveMixture(s,{'Spring water':1,'River bellleaf':1},'steep'),a);
    assert.notEqual(a.dose.health,resolveMixture(s,{'River bellleaf':1,'Spring water':2},'steep').dose.health);assert.equal(JSON.stringify(s),before);assert.notEqual(a.id,resolveMixture(s,{...inputs,'River bellleaf':2},'steep').id);assert.notEqual(a.id,resolveMixture(s,inputs,'boil').id);
    assert.equal(Object.values(a.fractions).reduce((a,b)=>a+b),a.mass);
    const diluted=diluteComposition(a,1000);assert.equal(diluted.trace,a.fractions.trace);assert.equal(Object.values(diluted).reduce((a,b)=>a+b),a.mass+1000);
});
test('trace-bearing split retains exact rational portions and recombines every constituent',()=>{
    const {p}=fixture(),parts=splitComposition(p,1,3);for(const [kind,amount]of Object.entries(p.fractions))assert.equal(parts[0].fractions[kind].numerator+parts[1].fractions[kind].numerator,amount*3);
    assert.ok(parts[0].fractions.trace.numerator>0);assert.equal(parts[0].fractions.trace.denominator,3);
});
test('unknown truth operates, unresolved required truth and fractional quantities reject',()=>{
    const {s,p}=fixture();assert.ok(p.dose.health>0);assert.match(mixturePresentation(s,p).description,/untested/);assert.doesNotMatch(mixturePresentation(s,p).description,/health regeneration/);
    delete s.profiles['River bellleaf'].fractions.trace;assert.throws(()=>resolveMixture(s,inputs,'steep'),/Unresolved/);
    assert.throws(()=>resolveMixture(createMixtureState(1),{...inputs,'River bellleaf':0.5},'steep'),/whole/);
});
test('canonical identity decodes and dangling and noncanonical holder references reject',()=>{
    const {s,p}=fixture(),key=mixtureKey(p);assert.deepEqual(productFromKey(s,key),p);validateMixtureEnvelope({mixtures:s,inventories:{trader:{vendor:{[key]:{count:1}}}},player_storage:{inventory:{[key]:{count:1}}}});
    assert.throws(()=>validateMixtureEnvelope({inventories:{person:{[key]:{count:1}}}}),/Missing/);
    assert.throws(()=>productFromKey(s,JSON.stringify({mixture:p.id,id:'Village mixture'})),/Noncanonical/);
    assert.doesNotThrow(()=>validateMixtureEnvelope({character:{inventory:{'{"id":"Stale bread"}':{count:1}}}}));
});
test('hidden recipe and feasibility witness remain stable through retained save/import',()=>{
    const {s}=fixture(),copy=JSON.parse(JSON.stringify(s));validateMixtureState(copy);assert.deepEqual(copy.hiddenMethod,s.hiddenMethod);
    assert.ok(resolveMixture(copy,copy.hiddenMethod.inputs,copy.hiddenMethod.process).dose.health>0);
});
test('consumed exposure restores exact native payload/timing with no generated templates',()=>{
    const {s,p}=fixture(),e=mixtureExposure(p,20);e.duration-=3;const restored=restoreActiveEffect(e.id,JSON.parse(JSON.stringify(e)));
    assert.deepEqual(restored.mixtureExposure,e.mixtureExposure);assert.deepEqual(restored.effects.stats,e.effects.stats);assert.equal(restored.duration,22);assert.equal(effect_templates[e.id],undefined);
    validateMixtureEnvelope({mixtures:s,inventories:{person:{}},active_effects:{[e.id]:restored}});const bad=structuredClone(e);bad.effects.stats.agility.flat=0;assert.throws(()=>validateExposure(bad),/payload/);
});
