import {createExpansionState,advanceSimulation,loadExpansionState} from "../src/expansion_engine.js";
import {initializeExpedition,expeditionRegistry} from "../src/expedition_content.js";
import {beginFieldWorkshop} from "../src/field_workshop.js";
import {commitSimulationCommand} from "../src/simulation.js";
import {everydayFacts} from "../src/everyday_life.js";
export const wood=JSON.stringify({id:"Rough wood log"}),kit=JSON.stringify({id:"Prepared survey kit"});
export const vitals={health:30,max_health:30,stamina:30,max_stamina:30};
export function fieldContext(p,location="Village",extra={}) {
    return {actorId:"player",external:p.external,gameplay:p.gameplay,vitals:{player:{...vitals,stamina:30-(p.native?.staminaToFull || 0)}},
        facts:{location,"village.craftsmanMet":true,"village.elderMet":true,"village.shackUnlocked":true,...everydayFacts(p.state,{hour:8})},...extra};
}
export function createFieldFixture() {
    const state=initializeExpedition(createExpansionState(71));
    const p={state,external:{money:100},gameplay:{player:{inventory:{[wood]:20},skills:{},reputation:{Village:0}},oldCraftsman:{inventory:{},skills:{},reputation:{}}}};
    return beginFieldWorkshop(state,expeditionRegistry,fieldContext(p));
}
export const fieldCommand=(p,id,location="Village",extra={})=>commitSimulationCommand(p.state,expeditionRegistry,{id},fieldContext(p,location,extra));
export const fieldAdvance=(p,n)=>advanceSimulation(p.state,expeditionRegistry,n,p.external,p.gameplay,{player:{facts:fieldContext(p).facts,vitals:fieldContext(p).vitals.player}});
export const fieldReload=p=>({...structuredClone(p),state:initializeExpedition(loadExpansionState(JSON.parse(JSON.stringify(p.state)),expeditionRegistry))});
export function joinField(p=createFieldFixture(),route="survey") {
    if(route === "survey")p.state.campaign.facts.anchor=true;
    return fieldAdvance(fieldCommand(p,`field.join_${route}`),route === "survey" ? 2 : 3);
}
export function completeFieldProject(p) {
    p=fieldCommand(p,"field.project_start","Village",{targetId:"oldCraftsman"});p=fieldAdvance(p,7);p=fieldCommand(p,"field.inspect");
    return fieldAdvance(fieldCommand(p,"field.workshop.assembly","Shack"),3);
}
// Named scenario (GN5): a carried poison condition to bind. DEV SEEDED: the venom is injected into a save, not earned in play.
// Pairs with the frontier binder journey (harvest salt, brew, drink); content frontier.brew@2, no user save touched.
export const BINDER_FIXTURE=Object.freeze({label:"DEV SEEDED binder scenario",content:"frontier.brew@2",poison:"Mild necrotizing venom",minutes:50});
export async function seedBinderPoison(save,{minutes=BINDER_FIXTURE.minutes}={}) {
    const {effect_templates}=await import("../src/active_effects.js");
    const template=effect_templates[BINDER_FIXTURE.poison];
    return {...structuredClone(save),active_effects:{...save.active_effects,[template.id]:JSON.parse(JSON.stringify({...template,duration:minutes}))}};
}
