import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {mkdtemp, readFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {title_catalog, grantEarnedTitles, normalizeTitles, titleBonuses, titleView} from '../src/titles.js';
import {installTrainingLink, trainingView} from '../src/absorb_p23/long_life/training.js';
import {validateWornTitle, selectWornTitle, longLifeTitleBonuses, wornTitleView} from '../src/absorb_p23/long_life/worn.js';

test('earned domestic counters cross thresholds without capping repeat progression',()=>{
    const titles={},counters={home_minutes:59,items_bought:24};
    assert.deepEqual(grantEarnedTitles(titles,counters,59),[]);
    counters.home_minutes++; counters.items_bought++;
    assert.deepEqual(grantEarnedTitles(titles,counters,60),['quiet_hour','pantry_keeper']);
    counters.home_minutes+=129540; counters.items_bought++;
    assert.deepEqual(grantEarnedTitles(titles,counters,129600),['home_season']);
    const restored=normalizeTitles(JSON.parse(JSON.stringify(titles)));
    assert.deepEqual(grantEarnedTitles(restored,counters,129601),[]);
    assert.deepEqual(restored,titles);
    assert.equal(counters.items_bought,26);
});

test('missing counters do not invent domestic history or expose unavailable goals',()=>{
    assert.deepEqual(grantEarnedTitles({}, {},0),[]);
    assert.equal(titleView({},{},{knownOnly:true}).some(row=>row.id==='quiet_hour'),false);
    assert.equal(titleView({}, {home_minutes:0},{knownOnly:true}).some(row=>row.id==='quiet_hour'),true);
    assert.equal(titleView({quiet_hour:{at:60}},{},{knownOnly:true}).some(row=>row.id==='quiet_hour'),true);
    for(const value of [NaN,Infinity,-1,'129600']) assert.deepEqual(grantEarnedTitles({}, {home_minutes:value},0),[]);
});

test('odd settled outcome is one recognition, not a restriction on subsequent fights',()=>{
    const titles={};assert.deepEqual(grantEarnedTitles(titles,{weak_enemy_losses:1},12),['small_surprise']);
    assert.deepEqual(grantEarnedTitles(titles,{weak_enemy_losses:10},13),[]);
    assert.deepEqual(titleBonuses(titles),{flats:{},multipliers:{},xp_multipliers:{}});
});

test('every old bonus is preserved verbatim, including worn mode',()=>{
    const old=title_catalog.filter(t=>!['quiet_hour','home_season','pantry_keeper','small_surprise','million_tales'].includes(t.id));
    const held=Object.fromEntries(old.map(t=>[t.id,{at:1}]));
    const expected={flats:{crit_rate:0.005},multipliers:{attack_power:1.02,max_health:1.02*1.03},xp_multipliers:{Combat:1.02*1.03,Perception:1.03,'Iron skin':1.02,Persistence:1.03,hero:1.02,Crafting:1.03,'Crafting mastery':1.03,'Gathering mastery':1.03,Literacy:1.03,all_skill:1.01*1.02,Haggling:1.03}};
    assert.deepEqual(titleBonuses(held),expected);
    assert.deepEqual(longLifeTitleBonuses(held),expected);
    assert.deepEqual(longLifeTitleBonuses(held,{schema:1,enabled:false,worn:'hunter'}),expected);
    assert.deepEqual(longLifeTitleBonuses(held,{schema:1,enabled:true,worn:'hunter'}),expected);
});

test('worn payoff is optional, additive, collection derived and stable through serialization',()=>{
    const titles={quiet_hour:{at:60},hunter:{at:90},reader:{at:100},future:{at:100}};
    const state=selectWornTitle(titles,undefined,'quiet_hour');
    assert.equal(wornTitleView(titles,state).renown,3);
    assert.deepEqual(longLifeTitleBonuses(titles,state).xp_multipliers,{Combat:1.02,Sleeping:1.02});
    assert.deepEqual(longLifeTitleBonuses(titles,JSON.parse(JSON.stringify(state))),longLifeTitleBonuses(titles,state));
    assert.equal(longLifeTitleBonuses(titles,{...state,enabled:false}).xp_multipliers.Sleeping,undefined);
    assert.equal(wornTitleView({quiet_hour:titles.quiet_hour},state).active,false);
});

test('optional state preflight rejects unsupported schema/unheld/invalid selection without mutation',()=>{
    const titles={quiet_hour:{at:60}},before=structuredClone(titles);
    for(const raw of [null,[],{schema:2,enabled:false,worn:null},{schema:1,enabled:1,worn:null},{schema:1,enabled:true,worn:'hunter'},{schema:1,enabled:false,worn:null,renown:99}]) assert.throws(()=>validateWornTitle(raw,titles));
    assert.deepEqual(titles,before);assert.equal(validateWornTitle(undefined,titles),undefined);
});

test('training registration preflights conflicts and preserves unrelated milestone data',()=>{
    const skills={Cooking:{max_level:60,milestones:{3:{stats:{intuition:{flat:1}},xp_multipliers:{Literacy:1.1}}}},Alchemy:{}};
    assert.equal(installTrainingLink(skills),true); assert.equal(installTrainingLink(skills),false);
    assert.deepEqual(skills.Cooking.milestones[3],{stats:{intuition:{flat:1}},xp_multipliers:{Literacy:1.1,Alchemy:1.05}});
    skills.Cooking.milestones[3].xp_multipliers.Alchemy=1.2;
    const before=structuredClone(skills);assert.throws(()=>installTrainingLink(skills));assert.deepEqual(skills,before);
    assert.throws(()=>installTrainingLink({}));
});

test('training projection names only known skills and never settles XP',()=>{
    const known={Cooking:{known:true,level:2},Alchemy:{known:true,level:0}};
    const read=id=>known[id];assert.equal(trainingView(read).multiplier,1);
    known.Cooking.level=3;assert.equal(trainingView(read).multiplier,1.05);
    const before=structuredClone(known);trainingView(read);assert.deepEqual(known,before);
    known.Alchemy.known=false;assert.equal(trainingView(read),null);
});

test('native milestone awards once, repeat training progresses, XP reconstruction restores exact rate',async()=>{
    const dir=await mkdtemp(join(tmpdir(),'p23-long-life-'));
    try {
        const outfile=join(dir,'native.mjs');
        await build({stdin:{contents:`export {character} from './src/data/character.js'; export {skills} from './src/data/skills.js'; export {fill_availability_methods} from './src/component_management.js';`,resolveDir:resolve('.')},bundle:true,format:'esm',platform:'node',outfile,
            plugins:[{name:'presentation-only',setup(b){b.onLoad({filter:/\/src\/(main|display)\.js$/},async a=>{
                const source=await readFile(a.path,'utf8');
                const names=[...source.matchAll(/export\s*\{([^}]+)\}/g)].flatMap(m=>m[1].split(',').map(s=>s.trim().split(/\s+as\s+/).at(-1))).filter(s=>/^[a-zA-Z_$][\w$]*$/.test(s));
                return {contents:names.map(s=>`export const ${s} = ${s==='game_options'?'{}':s==='current_stance'?'({getStats:()=>({})})':s==='current_location'?'null':s==='capitalize_first_letter'?'s=>s[0].toUpperCase()+s.slice(1)':'()=>{}'};`).join('\n')};
            });}}]});
        const {character,skills,fill_availability_methods}=await import(pathToFileURL(outfile));fill_availability_methods();installTrainingLink(skills);
        const xp=id=>character.getSkillXPObject({skill_id:id});
        const grant=(id,n,use_bonus=false)=>{const result=character.addXPToSkill({skill:skills[id],xp_to_add:n,use_bonus,cap_gained_xp:false,add_to_parent:false});character.updateStatsAndDisplay();return result;};
        grant('Alchemy',1,true); const before=xp('Alchemy').total_xp;
        for(let i=0;i<40;i++)grant('Cooking',5);
        assert.equal(xp('Cooking').current_level,3);
        grant('Alchemy',1,true);assert.ok(Math.abs(xp('Alchemy').total_xp-before-1.05)<1e-9);
        const rate=character.getLevelableComponent().xp_bonuses.total_multiplier.Alchemy;
        const saved=JSON.parse(JSON.stringify(xp('Cooking')));
        grant('Cooking',5);assert.equal(xp('Cooking').total_xp,saved.total_xp+5);
        assert.equal(character.getLevelableComponent().xp_bonuses.total_multiplier.Alchemy,rate);
        // Reconstruct from zero XP, as load does, with bonus reset before replay.
        delete character.getLevelableComponent().skill_progress.Cooking;
        character.getLevelableComponent().xp_bonuses.total_multiplier.Alchemy=1;
        character.getLevelableComponent().xp_bonuses.multiplier.skills.Alchemy=1;
        grant('Cooking',saved.total_xp);
        assert.deepEqual(JSON.parse(JSON.stringify(xp('Cooking'))),saved);
        assert.equal(character.getLevelableComponent().xp_bonuses.total_multiplier.Alchemy,rate);
    } finally {await rm(dir,{recursive:true,force:true});}
});
