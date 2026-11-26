// The craft rows supply inscription and burning. Prices, durations and
// room-scale exposure are Tingen gameplay dials.
import {BE_SEER_ENERGY_ID} from './book_world_lotm_be_seer.js';
import {LOTM_IDS,LOTM_PENCE} from './book_world_lotm_ids.js';
import {CHARM_UPKEEP_MINUTES,settledCharmCohorts} from './lotm_charm_upkeep.js';
import {charmMaterialItems,CHARM_MATERIAL_PAYER} from './lotm_charm_materials.js';
import {charmLoanItems,CHARM_LOAN_USE} from './lotm_charm_loan.js';
import {responseCharmItems} from './lotm_charm_response.js';

export const SLUMBER_ROW = 'lotm.craft.slumber-charm';
export const SLUMBER_ORDER = SLUMBER_ROW + '-supplies';
export const SLUMBER_USE = SLUMBER_ROW + '-use';
export const SLUMBER_UPKEEP = SLUMBER_ROW + '-upkeep';
export const SLUMBER_SLEEP = 'book.lotm.charm-slumber';
export const SOOTHING_ROW = 'lotm.craft.soothing-charm';
export const SOOTHING_CALM = 'book.lotm.charm-soothing';
export const silverCharmConditions = [
    {id:SLUMBER_SLEEP,revision:1,label:'Asleep from Slumber',stacking:'max',absence:'zero'},
    {id:SOOTHING_CALM,revision:1,label:'Calmed by Soothing',stacking:'max',absence:'zero'}
];
export const awakeForConversation = {
    fact:`target.condition.${SLUMBER_SLEEP}`,op:'eq',value:0,reason:'They fell asleep. Speak to them after they wake.'
};
export const isSlumberAsleep = (state,id) => (state.simulation?.conditions?.[id]?.[SLUMBER_SLEEP]?.expiresAt??0)>state.clock;

const variants = {
    [SLUMBER_ROW]: {slug:'slumber',name:'Slumber',shape:'rectangular',
        itemDescription:'Inscribed silver. Channel spirituality and throw it to release sleep around the burning charm.',
        warning:'Anyone near where it lands may fall asleep.',
        opening:'The charm burns. You feel drowsy at the edge of its reach.',
        response:name=>`${name} falls asleep.`,condition:SLUMBER_SLEEP},
    [SOOTHING_ROW]: {slug:'soothing',name:'Soothing',shape:'triangular',
        itemDescription:'Inscribed silver. Channel spirituality and throw it to calm people near the burning charm.',
        warning:'Calm can spread to anyone near where it lands.',
        opening:'The charm burns blue. You feel calmer as the darkness passes over you.',
        response:name=>`${name} grows calmer.`,condition:SOOTHING_CALM,includeThrower:true}
};
const itemIds = slug => [slug+'_silver',slug+'_supplies',slug+'_charm'];
export const silverCharmItems = [...Object.values(variants).flatMap(({slug,name,shape,itemDescription}) => {
    const [silver,supplies,charm]=itemIds(slug);
    return [
        [silver,`${shape[0].toUpperCase()+shape.slice(1)} silver blank`,`A prepared piece of silver for a ${name} inscription.`],
        [supplies,`${name} ritual supplies`,'The herbs and minerals set aside for the inscription.'],
        [charm,`${name} charm`,itemDescription]
    ];
}),...charmMaterialItems,...charmLoanItems,...responseCharmItems];
const energy = {type:'energy',energyId:BE_SEER_ENERGY_ID,operation:'use',output:1,control:1};
const has = (key,reason) => ({fact:`item.${key}`,op:'gte',value:1,reason});
const stock = key => ({key,qty:1});

export function silverCharmActs(row,workshop) {
    const variant=variants[row.id];
    if(!variant)return null;
    const {slug,name,shape,warning}=variant;
    const [silver,supplies,charm]=itemIds(slug).map(id=>JSON.stringify({id:'book.lotm.'+id}));
    const held=has(charm,`You need a finished ${name} charm.`);
    const noteKey=`lotm.charm.${slug}.notes`;
    const learned={fact:`actor.${noteKey}`,op:'eq',value:true,reason:'Order the supplies and read the workshop notes first.'};
    const [prepare,inscribe,activate]=row.steps;
    const {place,commissioned,support}=workshop;
    const order=row.id+'-supplies', use=row.id+'-use';
    const rows=[
        {...row,id:order,label:`${name} supplies`,steps:[prepare],eligibility:null,inputs:[],effects:[]},
        {...row,steps:[inscribe],eligibility:learned,effects:row.effects.filter(e=>e.owner==='inventory-consumption')},
        {...row,id:use,kind:'item_use',steps:[activate],eligibility:null,inputs:[],effects:[]}
    ];
    const bindings={
        [order]: {place,visibleWhen:commissioned,support,inputs:{},steps:{prepare:{
            label:`Order ${name} supplies`,description:`Send for a ${shape} blank and ritual supplies. Read the workshop’s instructions while you wait.`,
            minutes:35,costs:[{type:'resource',key:'money',amount:-8*LOTM_PENCE.soli,native:true}],costText:'8 soli',
            ...(row.id===SLUMBER_ROW?{reportKey:'book.lotm.history.slumber.personal-materials'}:{}),
            report:`The runner brings the ${shape} silver and the ritual supplies. You read the ${name} instructions.${row.id===SLUMBER_ROW?' You paid for these materials yourself.':''}`,
            effects:[{type:'item',key:silver,amount:1},{type:'item',key:supplies,amount:1},
                {type:'fact',scope:'actor',key:noteKey,value:true},
                ...(row.id===SLUMBER_ROW?[{type:'fact',scope:'actor',key:CHARM_MATERIAL_PAYER,value:'personal'}]:[])]
        }}},
        [row.id]: {place,visibleWhen:commissioned,support,reason:`You need the workshop notes, a prepared desk, ${shape} silver and ritual supplies.`,
            requires:{all:[has(silver,`You need a ${shape} silver blank.`),has(supplies,'You need the ritual supplies.')]},
            // The paid packet contains both herbs and minerals.
            inputs:{[row.inputs[0].name]:stock(silver),[row.inputs[1].name]:stock(supplies),[row.inputs[2].name]:null},
            steps:{inscribe:{label:`Inscribe a ${name} charm`,description:`Engrave the ${shape} silver with ritual assistance. Put the finished charm away for later.`,
                minutes:12,costs:[energy],costText:`One ${shape} blank, one packet of ritual supplies and one point of spirituality`,
                reportKey:`book.lotm.history.${slug}.inscribed`,report:'The silver takes the inscription. You put the finished charm away.'}},
            output:stock(charm),owners:{'inventory-consumption':[]}},
        [use]: {place:null,visibleWhen:{any:[held,{all:[commissioned,{fact:'actor.location',op:'eq',value:place}]}]},
            requires:held,reason:held.reason,inputs:{},
            steps:{activate:{label:`Throw a ${name} charm`,description:`Speak the word, channel spirituality and throw the charm across the room. ${warning}`,
                minutes:1,costs:[{type:'item',key:charm,amount:-1},energy],costText:`One ${name} charm and one point of spirituality`,
                report:'You speak the word and throw the charm across the room.'}}}
    };
    if(row.id===SLUMBER_ROW) {
        const renew={id:'renew',kind:'use',text:'Old Neil checks the unused inscription and helps renew its charge.'};
        rows.push({...row,id:SLUMBER_UPKEEP,label:'Slumber charm upkeep',kind:'item_use',steps:[renew],eligibility:null,inputs:[],effects:[]});
        bindings[SLUMBER_UPKEEP]={place:null,visibleWhen:{any:[held,{all:[commissioned,{fact:'actor.location',op:'eq',value:place}]}]},
            reason:'Bring an unused Slumber charm to an awake Old Neil; a fresh charm needs no upkeep.',
            support:{fact:'charm.slumber.mentorAvailable',op:'eq',value:true,reason:'Old Neil must be here and awake to tend the charm.'},
            requires:{all:[held,{fact:'charm.slumber.needsUpkeep',op:'eq',value:true,reason:'Your held charm still has a fresh charge. Use it or keep it for later.'}]},
            inputs:{},output:stock(charm),steps:{renew:{label:'Ask Old Neil to tend a Slumber charm',
                description:'Let Old Neil check your oldest unused charm and renew its charge. The same silver returns to you; a burned charm leaves nothing to maintain.',
                minutes:CHARM_UPKEEP_MINUTES,costs:[{type:'item',key:charm,amount:-1},energy],
                costText:'10 minutes, one point of spirituality; your unused charm is held during the work and returned',
                reportKey:'book.lotm.history.slumber.renewed',
                report:'Old Neil examines the unused inscription while you steady the silver with spirituality. He returns the same charm, its charge renewed.'}}};
    }
    return {rows,bindings};
}

const thrownCharms=new Map(Object.entries(variants).map(([id,variant])=>[id+'-use.activate',variant]));
thrownCharms.set(CHARM_LOAN_USE+'.activate',variants[SLUMBER_ROW]);

// The throw lands at completion and uses the current cast presence.
export function settledSilverCharmEffects(job,state,registry,presence,stock={}) {
    const cohort=settledCharmCohorts(job,state,stock,{rowId:SLUMBER_ROW,key:JSON.stringify({id:'book.lotm.slumber_charm'}),slug:'slumber'});
    const variant=thrownCharms.get(job.commandId);
    if(!variant)return cohort?.effects||null;
    const {people,knowledge}=state.simulation;
    const at=people[job.actorId].location;
    const placeOf=presence?.(state);
    const observed=[], effects=[...(cohort?.effects||[])];
    const duration=cohort?.strength.minutes??5;
    const apply=id=>effects.push({type:'condition',actor:id,id:variant.condition,operation:'apply',duration});
    if(variant.includeThrower)apply(job.actorId);
    for(const [id,person] of Object.entries(people)) {
        if(id===job.actorId||person.life!=='alive'||state.actors[id]?.worldId!==LOTM_IDS.world||(placeOf?placeOf(id,person):person.location)!==at)continue;
        const known=['known','met'].some(kind=>knowledge[job.actorId]?.[`book.lotm.cast.${kind}.${id}`]);
        const name=(known&&registry.simulation.people.get(person.definitionId)?.label)||'Someone nearby';
        if(person.body?.form!=='human'||isSlumberAsleep(state,id)) {
            observed.push(`${name} does not stir.`);
            continue;
        }
        apply(id);
        observed.push(variant.response(name));
    }
    effects.push({type:'knowledge',actor:job.actorId,key:`book.lotm.history.${variant.slug}.${job.sequence}`,stage:'seen',
        value:`${variant.opening} ${observed.join(' ')||'No one else is in reach.'}`,
        basis:{kind:'observation',attributedTo:job.actorId,situationId:job.effects.find(e=>e.type==='knowledge').basis.situationId}});
    return effects;
}
