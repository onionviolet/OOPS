import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {loadNative,STANCE_LOCATION_STUBS} from './helpers/native_loader.mjs';
import {automaticSkillTiers,skillTierEvent,offerSkillEvolution,chooseSkillEvolution,evolveSkillPractice,emptySkillEvolution} from '../src/skill_evolution.js';
import {SKILL_EVOLUTIONS,validateSkillEvolutionEnvelope} from '../src/data/skill_evolutions.js';

const [row]=SKILL_EVOLUTIONS;
const [heavy,balance]=row.targets;
const context={...row.requirements};
const path=new URL('./fixtures/skill-evolution-legacy.json',import.meta.url);

test('native skill data keeps the YAIR tier boundaries and upgrade event',async()=>{
    const {skills,character,fill_availability_methods}=await loadNative(`export {skills} from './src/data/skills.js'; export {character} from './src/data/character.js'; export {fill_availability_methods} from './src/component_management.js';`,{stubs:STANCE_LOCATION_STUBS});
    fill_availability_methods();
    const iron=skills['Iron skin'], giant=skills['Giant slayer'];
    for(const [skill,levels,names] of [
        [iron,[0,9,10,19,20,29,30],['Tough skin','Tough skin','Wooden skin','Wooden skin','Stone skin','Stone skin','Iron skin']],
        [giant,[0,14,15],['Giant killer','Giant killer','Giant slayer']],
    ]){
        assert.deepEqual(levels.map(level=>skill.getTierName(level)),names);
        assert.ok(automaticSkillTiers(skill.skill_id,skill.names).every(tier=>tier.automatic&&tier.targets.length===1&&tier.targets[0].id===skill.skill_id));
    }
    assert.deepEqual(skillTierEvent(iron.skill_id,iron.getTierName(29),iron.getTierName(30)),{
        type:'skill-tier-changed',from:'Iron skin',previous:'Stone skin',current:'Iron skin',
    });
    const legacy=JSON.parse(await readFile(path,'utf8')),old=structuredClone(legacy);
    assert.deepEqual(validateSkillEvolutionEnvelope(legacy),emptySkillEvolution());
    for(const [id,total] of Object.entries(legacy.levels.person.main_character.skill_xp)){
        const xp=character.getSkillXPObject({skill_id:id});
        skills[id].add_xp({skillXP:xp,xp_to_add:total,track_dependencies:false});
        assert.equal(xp.total_xp,total);
        assert.equal(skills[id].getName(xp),skills[id].getTierName(xp.current_level));
    }
    assert.deepEqual(legacy,old);
    assert.equal(iron.getName(),'Stone skin');
    assert.equal(skills.Weightlifting.getCurrentLvl(),2);
});

test('only qualifying practice offers a choice, with unchanged XP while waiting',()=>{
    const start=emptySkillEvolution();
    assert.equal(offerSkillEvolution(start,row,2,context),null);
    assert.equal(offerSkillEvolution(start,row,3,{...context,world:'elsewhere'}),null);
    const offered=offerSkillEvolution(start,row,3,context);
    assert.deepEqual(offered.event,{type:'skill-evolution-waiting',from:'Weightlifting',evolution:row.id});
    assert.equal(offerSkillEvolution(offered.state,row,4,context),null);
    assert.deepEqual(evolveSkillPractice(offered.state,row,4,context),{sourceXP:4,extra:[]});
    assert.throws(()=>chooseSkillEvolution(offered.state,row,heavy.id,3,{...context,activity:null}),/Carry grain/);
    assert.throws(()=>chooseSkillEvolution(offered.state,row,'other branch',3,context),/not offered/);
});

test('one durable form has its own identity and distinct earned effects',()=>{
    const waiting=offerSkillEvolution(emptySkillEvolution(),row,3,context).state;
    const stronger=chooseSkillEvolution(waiting,row,heavy.id,3,context);
    assert.deepEqual(stronger.costs,[]);
    assert.deepEqual(evolveSkillPractice(stronger.state,row,2,context),{sourceXP:3,extra:[[heavy.id,1]]});
    assert.deepEqual(evolveSkillPractice(stronger.state,row,2,{...context,location:'Nearby cave'}),{sourceXP:2,extra:[]});
    assert.throws(()=>chooseSkillEvolution(stronger.state,row,balance.id,3,context),/no longer waiting/);
    const control=chooseSkillEvolution(waiting,row,balance.id,3,context).state;
    assert.deepEqual(evolveSkillPractice(control,row,2,context),{sourceXP:2,extra:[[balance.id,1],['Equilibrium',1]]});
    assert.deepEqual(validateSkillEvolutionEnvelope({skill_evolution:JSON.parse(JSON.stringify(control))}),control);
    const trained={skill_evolution:control,levels:{person:{main_character:{skill_xp:{[balance.id]:11}}}}};
    assert.deepEqual(validateSkillEvolutionEnvelope(trained),control);
    assert.throws(()=>validateSkillEvolutionEnvelope({...trained,skill_evolution:waiting}),/chosen skill form/);
    assert.throws(()=>validateSkillEvolutionEnvelope({skill_evolution:{...control,revision:2}}),/revision/);
    assert.throws(()=>validateSkillEvolutionEnvelope({skill_evolution:{...control,choices:{[row.id]:{status:'chosen',target:'forged',level:3}}}}),/Invalid saved/);
});
