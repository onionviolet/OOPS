// Original Frontier detail, not a novel adaptation or universal replacement
// rule. RB-INT-01/02 and RB-LIV-02 provide the qualified mechanism evidence.
// Existing stock/custody, frozen job, knowledge and source owners do the work.
const MIRI='repositories.miri', LANTERN='repositories.lantern';
const protectedKit=JSON.stringify({id:'Wax-sealed survey kit'});
const eq=(fact,value=true,reason)=>({fact,op:'eq',value,...(reason?{reason}:{})});
const all=(...rules)=>({all:rules});
const local=eq('repositories.clockSupported',true,'Return to the native Frontier for this courier work.');
const present=eq('repositories.miriSupported',true,'Miri cannot offer that shared work now.');
const repaired=eq(`situation.${LANTERN}.phase`,'repaired');
const ready=all(local,present,repaired,{fact:'vital.health',op:'gte',value:2,reason:'Recover before meeting Miri for this work.'});
const know=(key,value,stage='seen',actor='player')=>({type:'knowledge',actor,key:`repositories.${key}`,stage,value,
    basis:{kind:'observation',attributedTo:MIRI,situationId:LANTERN}});
const row=d=>({revision:1,worldId:'base.frontier',group:'repositories',actorId:'player',location:'Village',
    targetId:MIRI,coLocated:true,participants:['$target'],costs:[],effects:[],...d});

export const REPOSITORY_SUBSTITUTION_IDS=Object.freeze({
    sketch:'repositories.ask_wick_sketch',inspect:'repositories.inspect_substitute',
    deliver:'repositories.deliver_substitute',return:'repositories.hear_substitution',claim:'repositories.substitute_delivery',
});
export const repositoryAbsorptionSubstitutionCommands=[
    row({id:REPOSITORY_SUBSTITUTION_IDS.sketch,label:'Ask for Miri’s rough wick sketch',once:true,visibleWhen:repaired,requires:ready,
        description:'She unfolds resin-marked paper and explains the rough outline. The incomplete notes grant no practiced source, mastery, fuel or stock.',
        effects:[know('wick_sketch','Miri’s sketch marks wick pressure and resin placement, but leaves the working seam unmeasured. You have an incomplete explanation. Only her actual correction lesson teaches the executable control.','interpreted')]}),
    row({id:REPOSITORY_SUBSTITUTION_IDS.inspect,label:'Show Miri an owned protected kit as a substitute',once:true,visibleWhen:repaired,
        duration:1,cancellation:'refund',completionFailure:'refund',completionCoLocated:true,
        requires:all(ready,eq('repositories.miriMethodSupported',true,'Miri cannot demonstrate this inspection method now.'),
            {fact:`item.${protectedKit}`,op:'gte',value:1,reason:'Carry one actual protected kit for the offered inspection.'}),
        completionRequires:all(ready,eq('repositories.miriMethodSupported'),{fact:`item.${protectedKit}`,op:'gte',value:1}),
        description:'One played minute reserves your attention together, with no item or money cost. The kit stays in your bag. Miri uses her actual trained control to check its sealed fittings, then offers one funded parcel job. A label alone grants no title, standing or payment.',
        effects:[know('substitute_offer','Miri inspected your protected fittings and offered to accept one sealed kit in place of ordinary parcel supports, paying two of her coins for the completed delivery. The kit remains yours until you explicitly accept.'),
            know('substitute_seen','I checked the traveler’s offered sealed fittings and can accept one counted kit for this parcel duty. Their method, body, other stock and rights remain their own.','seen',MIRI)]}),
    row({id:REPOSITORY_SUBSTITUTION_IDS.deliver,label:'Deliver the inspected substitute · 1 protected kit · earn 2 coins · 2 min',
        duration:2,cancellation:'refund',completionFailure:'refund',completionCoLocated:true,
        claim:REPOSITORY_SUBSTITUTION_IDS.claim,visibleWhen:eq('knowledge.repositories.substitute_offer.seen'),
        requires:all(ready,eq('knowledge.repositories.substitute_offer.seen')),
        completionRequires:all(ready,{fact:'vital.health',op:'gte',value:2,reason:'Recover before finishing this parcel delivery.'}),
        description:'Only the actual kit transfers to Miri. Two of her coins reserve this one job, then credit your native purse. Cancellation returns each owner’s held inputs. No remembered method, source, person, office or obligation transfers with the kit.',
        costs:[{type:'transfer',from:'player',to:MIRI,key:protectedKit,count:1},{type:'resource',actor:MIRI,key:'coins',amount:-2}],
        effects:[{type:'resource',native:true,key:'money',amount:2},
            {type:'fact',scope:'actor',actor:MIRI,key:'repositories.substituteDelivered',value:true},
            know('substitute_delivery','You delivered one inspected protected kit instead of ordinary parcel supports. Miri retained that actual kit and paid two coins; you kept your learned control and other holdings.'),
            know('substitute_delivery','I accepted and paid for the inspected substitute. It is my parcel kit now; no method, body, identity or outside right changed hands.','seen',MIRI),
            {type:'relationship',actor:MIRI,target:'player',axis:'familiarity',amount:1,text:'Completed the one inspected substitute delivery and paid its agreed wage.'}]}),
    row({id:REPOSITORY_SUBSTITUTION_IDS.return,label:'Ask how the substitute parcel kit held up',once:true,
        visibleWhen:eq('knowledge.repositories.substitute_delivery.seen'),
        requires:all(ready,eq('knowledge.repositories.substitute_delivery.seen')),
        effects:[{type:'knowledge',key:'repositories.substitute_return',stage:'seen',
            value:'Miri reports: "I accepted the sealed kit we agreed on for the parcel duty. Your work was paid then; this visit adds no fee, gift or new agreement."',
            basis:{kind:'recollection',attributedTo:MIRI,situationId:LANTERN}}]}),
];
