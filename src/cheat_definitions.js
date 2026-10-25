// Authored defaults. Costs describe these faculties, not universal world law.
export const CHEAT_MODULES = Object.freeze([
    {id:'true-appraisal',name:'True Appraisal',family:'perception',ui:'appraisal-lens',hook:'harvest.observe',description:'Read a selected carcass more closely. Readings keep their original time.',state:{revision:1,charges:3,used:0,recharged:0,readings:[]}},
    {id:'loaded-dice',name:'Loaded Dice',family:'fortune',ui:'quiet',hook:'stream.call',description:'Commit a low next loot roll. One charge is spent now; the call remains until a loot decision uses it.',state:{revision:1,charges:2,used:0,recharged:0}},
    {id:'fate-ledger',name:'Fate Ledger',family:'foresight',ui:'simulator-foresight',hook:'stream.peek',description:'Read one named loot decision without advancing or drawing it. A call already committed by Loaded Dice is included.',state:{revision:1,charges:3,used:0,recharged:0,readings:[]}},
    {id:'earned-habit',name:'Earned Habit',family:'practice',ui:'quiet',hook:'harvest.routine',description:'Set a finite carcass routine after processing one by hand. Existing tools, time, body and interruption rules still apply.',state:{revision:1,charges:3,used:0,recharged:0}},
]);
export function moduleCard(id) {
    const d=CHEAT_MODULES.find(x=>x.id===id);if(!d)throw Error('Unknown faculty development.');
    return {id:d.id,name:d.name,family:d.family,ui:d.ui,terms:'matured',hooks:[d.hook],
        state:structuredClone(d.state),stages:[],observers:[],sources:[{kind:'personal-faculty',id:'quiet-faculty'}]};
}
const natural=x=>Number.isSafeInteger(x)&&x>=0;
export function validateModuleState(card) {
    if(card.id==='quiet-faculty'){
        const s=card.state,ids=new Set(),milestones=new Set(['recognition','first-victory','first-processing','practised-craft','practised-perception']);
        if(!natural(s.points)||!natural(s.earned)||!natural(s.spent)||s.points!==s.earned-s.spent||!Array.isArray(s.claimed)||s.claimed.some(id=>!milestones.has(id))||new Set(s.claimed).size!==s.claimed.length)
            throw Error('Invalid cheat faculty accounting.');
        if(!Array.isArray(card.stages))throw Error('Invalid cheat faculty stages.');
        for(const stage of card.stages){
            if(!stage||!CHEAT_MODULES.some(d=>d.id===stage.id)||ids.has(stage.id)||stage.at==null||typeof stage.via!=='string'||typeof stage.carried!=='boolean')throw Error('Invalid cheat faculty stage.');
            ids.add(stage.id);
        }
        return;
    }
    const d=CHEAT_MODULES.find(x=>x.id===card.id);if(!d)return;
    const s=card.state,keys=Object.keys(d.state);
    if(Object.keys(s).length!==keys.length||keys.some(k=>!Object.hasOwn(s,k))||s.revision!==1||!natural(s.charges)||!natural(s.used)||!natural(s.recharged)||s.charges+s.used!==d.state.charges+s.recharged||s.charges>d.state.charges)
        throw Error('Invalid cheat module state.');
    if(s.readings!==undefined&&(!Array.isArray(s.readings)||s.readings.length>s.used||s.readings.some(r=>!r||typeof r!=='object'||!Number.isFinite(r.at))))
        throw Error('Invalid cheat retained reading.');
    for(const r of s.readings||[]){
        if(card.id==='true-appraisal'&&(!r.ageEstimate||!natural(r.ageEstimate.min)||!natural(r.ageEstimate.max)||r.ageEstimate.min>r.ageEstimate.max||
            !Number.isFinite(r.skill)||r.skill<0||typeof r.species!=='string'||typeof r.key!=='string'||r.source!=='true-appraisal'||
            !['fresh','aging','spent'].includes(r.freshness)||!['intact','damaged','heavily damaged'].includes(r.integrity)))throw Error('Invalid cheat appraisal reading.');
        if(card.id==='fate-ledger'&&(!natural(r.ordinal)||typeof r.key!=='string'||!r.key||!Number.isFinite(r.value)||r.value<0||r.value>=1||r.source!=='fate-ledger'||
            ![null,'loaded-dice'].includes(r.via)||(r.label!==undefined&&typeof r.label!=='string')))throw Error('Invalid cheat fate reading.');
    }
}
