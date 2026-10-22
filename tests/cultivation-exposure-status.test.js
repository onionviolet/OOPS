import test from 'node:test';
import assert from 'node:assert/strict';
import {createExposure,setHazardousMode,stageExposure,exposureEffects,gustTerms} from '../src/absorb_p23/exposure/exposure.js';
import {exposureStatus} from '../src/absorb_p23/exposure/panel.js';
import {normalizePacing} from '../src/absorb_e1/pacing.js';
const context={played:true,homeWorld:true,needsFood:false,exposureEligible:true,outdoors:true,sheltered:false,
    pacing:{...normalizePacing(),weatherEnabled:true}};
const hazard=()=>setHazardousMode(createExposure(),true);

test('known gust status agrees with the real debit and temperature for the current body',()=>{
    for(const [coldHardened,coldResistanceLevel,cost,offset] of [[false,0,0.2,-3],[true,0,0.1,-1],[true,20,0.05,-1],[false,20,0.1,-3]]) {
        const ctx={...context,coldHardened,coldResistanceLevel};
        const settled=stageExposure(hazard(),{start:0,end:1},ctx),status=exposureStatus(hazard(),ctx);
        assert.equal(settled.staminaCost,cost);
        assert.equal(exposureEffects(hazard(),ctx).temperatureOffset,offset);
        assert.ok(status.includes(`Current gust: ${offset}°C; ${cost} stamina/minute.`),status);
        assert.equal(status.includes('Weathered skin is active on this body.'),coldHardened);
    }
});

test('shelter, rest, unavailable world and disabled weather describe no current gust charge',()=>{
    for(const [state,ctx] of [[hazard(),{...context,sheltered:true}],
        [{...hazard(),phase:'rest',remaining:12},context],
        [hazard(),{...context,homeWorld:false}],
        [hazard(),{...context,pacing:{...context.pacing,weatherEnabled:false}}]]) {
        assert.equal(stageExposure(state,{start:0,end:1},ctx).staminaCost,0);
        const status=exposureStatus(state,ctx);
        assert.match(status,/No gust cost is applying now/);
        assert.doesNotMatch(status,/Current gust:/);
    }
});

test('unavailable or malformed resistance uses the same ordinary cost in preview and settlement',()=>{
    for(const level of [undefined,NaN,-1,Infinity,10001]) {
        const ctx={...context,coldResistanceLevel:level};
        assert.equal(gustTerms(ctx).staminaPerMinute,stageExposure(hazard(),{start:0,end:1},ctx).staminaCost);
        assert.match(exposureStatus(hazard(),ctx),/Current gust: -3°C; 0.2 stamina\/minute/);
    }
});
