import {registerDomain,domainRegistry} from './domain_registry.js';
import {STEWARD,COOK,KEEPER} from './home_work_content.js';
import {TUTOR} from './home_household_content.js';
import {TRUST_FAMILY,defineTrustRules,createTrustState,tierOf,giveGift,rankPeers,validateTrustState} from './peer_standing.js';
import {createPeerStandingPanel} from './peer_standing_panel.js';
// Live path for trust tiers and gift gating (G52) and the peer ranking (G53, AD33: four household members).
// A gift is the existing home transaction (`gift_staff`: coins leave your purse for theirs); trust is the
// only thing kept here. The ranking reads actual purses and is observable-only.
export const TRUST_STAFF=[{id:STEWARD,name:'Rowan'},{id:COOK,name:'Iven'},{id:KEEPER,name:'Toma'},{id:TUTOR,name:'Sera'}];
export const TRUST_RULES=defineTrustRules({id:'manor.trust',suspicionPerExcess:1,tiers:[
    {id:'stranger',at:0,giftCeiling:10,reason:'A stranger wonders what a large gift is meant to buy.'},
    {id:'acquaintance',at:3,giftCeiling:30,reason:'They know you a little; a gift this size reads as an attempt to be liked.'},
    {id:'trusted',at:8,giftCeiling:80,reason:'They trust you, and still count what is given.'},
    {id:'close',at:15,giftCeiling:200,reason:'Even close friends wince at a gift that makes them owe.'}]});
export const GIFT_AMOUNTS=[5,10,30,100];
let state=null,panel=null;
const ids=TRUST_STAFF.map(s=>s.id);
const homes=()=>domainRegistry.project('homes')||{};
export const trustState=()=>state||createTrustState();
export function validateTrust(slice){
    if(slice==null)return;validateTrustState(slice);
    for(const id of Object.keys(slice.trust))if(!ids.includes(id))throw Error('Trust: unknown household member.');
}
export function quoteGift({actor,amount}){
    const staff=TRUST_STAFF.find(s=>s.id===actor);if(!staff)return {eligible:false,reason:'Choose a household member.'};
    const home=domainRegistry.command('homes','quote')({type:'gift_staff',actor,amount});
    if(!home.eligible)return {eligible:false,reason:home.reason,actor,amount};
    const g=giveGift(TRUST_RULES,trustState(),actor,amount);
    return {eligible:true,actor,amount,home,change:g.change,tier:g.tier,tooBig:g.tooBig,reason:g.reason,
        summary:`${staff.name} (${g.tier}): ${g.tooBig?`too large for how well they know you, ${g.change} trust. ${g.reason}`:`${g.change>=0?'+':''}${g.change} trust.`}`};
}
export function executeGift(quote){
    if(!quote?.eligible)throw Error(quote?.reason||'Review the gift first.');
    const fresh=quoteGift({actor:quote.actor,amount:quote.amount});
    if(!fresh.eligible)throw Error(fresh.reason);
    const previous=state;state=giveGift(TRUST_RULES,trustState(),quote.actor,quote.amount).state;
    let result;try{result=domainRegistry.command('homes','execute')(fresh.home);}catch(error){state=previous;throw error;}
    panel?.render();return {...fresh,message:result.message};
}
export function projectTrust(){
    const h=homes(),c=h.context||{};
    if(!h.homes?.some(x=>x.id==='manor'))return {visible:false,rows:[],ranking:null,amounts:GIFT_AMOUNTS};
    const rows=TRUST_STAFF.map(s=>{const points=trustState().trust[s.id]??0,tier=tierOf(TRUST_RULES,points);
        return {id:s.id,name:s.name,points,tier:tier.id,ceiling:tier.giftCeiling,alive:c.people?.[s.id]?.life==='alive',wages:c.staffResources?.[s.id]?.['home.wages']||0};});
    const peers=[...rows.filter(r=>r.alive).map(r=>({id:r.id,score:r.wages})),{id:'player',score:c.money||0}];
    const ranking=rankPeers(peers,'player');
    return {visible:true,rows,amounts:GIFT_AMOUNTS,ranking:{rank:ranking.rank,of:ranking.of,next:ranking.next&&{name:TRUST_STAFF.find(s=>s.id===ranking.next.id)?.name,gap:ranking.next.gap},
        order:ranking.order.map(o=>({name:o.id==='player'?'You':TRUST_STAFF.find(s=>s.id===o.id).name,score:o.score,rank:o.rank}))}};
}
registerDomain({id:'social_trust',deps:['homes'],initialState:()=>null,
    save:()=>state&&Object.keys(state.trust).length?state:undefined,
    migrate:slice=>slice&&slice.family===TRUST_FAMILY?{...createTrustState(),...slice}:null,
    validate:slice=>validateTrust(slice),
    load:slice=>{state=slice?structuredClone(slice):null;},
    commands:{knownStanding:()=>({...trustState().trust}),quote:quoteGift,execute:executeGift},refresh:()=>panel?.render(),projection:projectTrust,
    panels:[()=>{panel=createPeerStandingPanel({read:projectTrust,quote:quoteGift,execute:executeGift});}]});
