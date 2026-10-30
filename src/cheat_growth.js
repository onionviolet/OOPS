// Derived cheat presentation: kind skins, growth track and voice. Nothing here is
// persisted; it reads the validated cheat state, so saves need no migration.
// Costs and tiers are authored defaults (dial: per world), not universal law.
export const CHEAT_KINDS = Object.freeze({
    mark:{label:'Mark',glyph:'◈',frame:'etched',voice:null},
    hologram:{label:'Hologram',glyph:'▦',frame:'scanline',voice:'system'},
    'ring-spirit':{label:'Ring spirit',glyph:'☯',frame:'ink-wash',voice:'elder'},
    ledger:{label:'Ledger',glyph:'▤',frame:'ruled',voice:null},
    plain:{label:'Faculty',glyph:'•',frame:'plain',voice:null},
});
const BY_SOURCE={'personal-faculty':'mark','ai-ring':'hologram','system':'hologram','cultivator-ring':'ring-spirit','ring-spirit':'ring-spirit','ledger':'ledger'};
const BY_FAMILY={'personal-faculty':'mark','system':'hologram'};
export function cheatKind(card) {
    for(const s of card?.sources||[])if(BY_SOURCE[s.kind])return BY_SOURCE[s.kind];
    return BY_FAMILY[card?.family]||'plain';
}
export const kindSkin=kind=>({kind,...(CHEAT_KINDS[kind]||CHEAT_KINDS.plain)});
// A voiced companion in a ring. Unreliable by dial: its boasts run a tier ahead.
export const ringSpiritCard=()=>({id:'ring-spirit',family:'companion',name:'Ring elder',ui:'status-window',terms:'gift',hooks:[],
    state:{awakened:false,points:0,wake:{day:3,victory:true},firstMessage:'A faint voice stirs in the ring. "Ah. A new tenant. Do try to be useful."',unreliable:true},
    stages:[],observers:[],sources:[{kind:'cultivator-ring',id:'ring-elder'}]});

export const TIERS=Object.freeze([
    {at:0,name:'Faint'},{at:2,name:'Steady'},{at:5,name:'Practised'},{at:9,name:'Deep'},{at:14,name:'Far-reaching'}]);
export function growthTrack({earned=0,points=0,spent=0,facets=[],milestones=[]}) {
    let index=0;TIERS.forEach((t,i)=>{if(earned>=t.at)index=i;});
    const next=TIERS[index+1]||null,undiscovered=facets.filter(f=>!f.held).length,ready=milestones.filter(m=>m.met&&!m.claimed).length;
    const step=undiscovered?{label:'Explore the next facet',cost:1,affordable:points>=1,source:ready?`${ready} lived insight${ready>1?'s':''} ready to retain`:'Live more: fights, processing, practice and written methods'}
        :{label:'No further facet is understood yet',cost:0,affordable:false,source:'Reserves can still be restored for 1 insight each'};
    return {tier:{index,name:TIERS[index].name},nextTier:next&&{name:next.name,remaining:next.at-earned,at:next.at},
        progress:next?(earned-TIERS[index].at)/(next.at-TIERS[index].at):1,earned,spent,points,
        facets:facets.map(f=>({id:f.id,name:f.held?f.name:'Undiscovered facet',family:f.held?f.family:'',state:f.held?'unlocked':(f===facets.find(x=>!x.held)?'next':'undiscovered')})),
        next:step,
        // Limits as adjectives; the carrier of each stays with its owner.
        limits:{reach:'this life and heirs',reserves:'small, per body',fuel:'lived insight',recovery:'1 insight per reserve'}};
}
const POOLS={
    system:{ready:['Insight available. Facet unlock is pending.','A development is queued: spend 1 insight to proceed.','Unspent insight detected.'],
        idle:['No action required.','Status nominal. Continue living.','Awaiting further lived experience.'],
        done:['All known facets are active.','Nothing further to unlock at this tier.']},
    elder:{ready:['Hmph. You have scraped together something. Spend it.','Your insight keeps. Do put it to use before it sours.','There is something to spend, child.'],
        idle:['Go and do something worth remembering.','I am resting. Do not mistake it for sleep.','Come back once you have lived a little.'],
        done:['I have taught you all I care to.','Nothing left to show you. For now.']},
};
function hash(text){let h=2166136261;for(const c of text){h^=c.charCodeAt(0);h=Math.imul(h,16777619)>>>0;}return h;}
// Deterministic per state: the line changes when progress changes, never flickers.
export function cheatVoice(kind,track,{unreliable=false,salt=0}={}) {
    const skin=CHEAT_KINDS[kind];if(!skin?.voice)return null;
    const pool=POOLS[skin.voice],situation=!track.facets.some(f=>f.state!=='unlocked')?'done':track.points>0?'ready':'idle';
    const lines=pool[situation],pick=lines[hash(`${kind}|${situation}|${track.earned}|${track.spent}|${salt}`)%lines.length];
    if(!unreliable)return {text:pick,reliable:true,truth:null};
    // A boast claims one tier ahead; the true tier stays printed beside it.
    const claimed=TIERS[Math.min(TIERS.length-1,track.tier.index+1)].name;
    return {text:`${pick} (You are ${claimed.toLowerCase()} already, surely.)`,reliable:false,truth:`Actual tier: ${track.tier.name}`};
}
