// HP lead life people source (FD10 second consumer, G8 fame as knowledge asymmetry).
// Observer safe (AD6-AD8, AR3): rows come only from the PLAYER's own knowledge entries. A cast person appears once the
// player holds that person's introduction entry (or an entry attributed to them); other holders' stores are never read.
// The fame line is shown only when the player's own store holds the observation that the person already knew his name.
import {registerPeopleSource} from './people_sources.js';
import {getHpLeadCast} from './book_world_hp_lead_pack.js';
const P='book.hp.lead',WORLD=`${P}.world`;
// Player-store key whose observation records that this person knew his name before being told (written by the W4 pub act).
// A person with no such observed entry (told, not seen) gets no fame line. Authored proposal, no canon text here.
const FAME_OBSERVED=Object.freeze({[`${P}.tom`]:`${P}.w4.pub.known`,[`${P}.doris`]:`${P}.w4.pub.known`,[`${P}.dedalus`]:`${P}.w4.pub.known`});
const NOT_A_PERSON=new Set([`${P}.potter_vault`]); // a cast entry that holds money, not a person to meet
const newestFirst=(a,b)=>(b.at??0)-(a.at??0);
export function hpPeopleRows(state,{knowledge,personAccounts},cast=getHpLeadCast()){
    if(state?.actors?.player?.worldId!==WORLD||!cast?.people||!knowledge)return [];
    const placeOf=new Map(),places=new Map((cast.locations||[]).map(l=>[l.id,l.label]));
    for(const act of cast.householdActs?.acts||[])for(const e of act.effects||[])if(e.type==='knowledge'&&e.actor==='player'&&act.place)placeOf.set(e.key,act.place);
    return cast.people.flatMap(person=>{
        if(NOT_A_PERSON.has(person.id))return [];
        const own=Object.entries(knowledge).filter(([key,r])=>key.startsWith(`${P}.`)&&(key===person.introductionKnowledgeKey||r.basis?.attributedTo===person.id));
        if(!own.length)return [];
        const ordered=[...own].reverse().sort(([,a],[,b])=>newestFirst(a,b));
        const details=own.filter(([,r])=>r.basis?.kind==='observation').map(([,r])=>r.value);
        const fame=knowledge[FAME_OBSERVED[person.id]];
        if(fame?.basis?.kind==='observation')details.push('They already knew your name when you met.');
        const place=places.get(placeOf.get(ordered.find(([key])=>placeOf.has(key))?.[0]));
        return [{id:person.id,name:person.label,location:place?`Last seen: ${place}`:'Met in this life',details,accounts:personAccounts(ordered),
            memories:ordered.map(([id,r])=>({id,at:r.at,text:r.value}))}];
    });
}
export const registerHpPeopleSource=()=>registerPeopleSource(P,60,hpPeopleRows);
