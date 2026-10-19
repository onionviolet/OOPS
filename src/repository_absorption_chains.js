// Finite original continuation over the already admitted Miri method/pump
// commands. It is not a copied Wesnoth graph or a separate quest/clock engine.
import {all, eq} from './basics.js';
const MIRI='repositories.miri', METHOD='repositories.wick_control', LANTERN='repositories.lantern';
const key=id=>JSON.stringify({id});
const KIT=key('Prepared survey kit'), RESIN=key('Dry resin pellet'), WAX=key('Wax-sealed survey kit'), SOAKED=key('Soaked survey kit');
const local=eq('repositories.clockSupported',true,'Return to the native Frontier for this local method work.');
const healthy={fact:'vital.health',op:'gte',value:2,reason:'Recover before testing these fittings.'};
const willing=eq('repositories.miriSupported',true,'Miri cannot offer shared work now.');
const hands=eq('repositories.playerHandsUsable',true,'This work needs two usable hands.');
const control=eq(`faculty.${METHOD}.active`,true,'Restore your practiced control before demonstrating it.');
const row=d=>({revision:1,worldId:'base.frontier',group:'repositories',actorId:'player',location:'Village',
    targetId:MIRI,coLocated:true,participants:['$target'],duration:2,cancellation:'refund',completionFailure:'refund',
    completionCoLocated:true,costs:[],effects:[],...d});
const knowledge=(name,value,actor='player')=>({type:'knowledge',actor,key:`repositories.${name}`,stage:'seen',value,
    basis:{kind:'observation',attributedTo:actor,situationId:LANTERN}});

export const REPOSITORY_METHOD_CHAIN_ID='repositories.incomplete_to_practiced';
export const repositoryAbsorptionChainCommands=[
    row({id:'repositories.test_rough_seam',label:'Test the rough sketch in the pump spray · kit + pellet + 1 stamina · 2 min',once:true,
        visibleWhen:all(eq('knowledge.repositories.wick_sketch.seen'),eq(`power.${METHOD}.owned`,false),eq('knowledge.repositories.pump_offer.seen')),
        requires:all(local,healthy,hands,willing,eq('knowledge.repositories.wick_sketch.seen'),eq(`power.${METHOD}.owned`,false),
            eq('knowledge.repositories.pump_offer.seen'),{any:[eq('situation.repositories.pump.phase','offered'),eq('situation.repositories.pump.phase','exposed')]}),
        completionRequires:all(local,healthy,hands,willing),
        description:'The rough notes omit working seam pressure. This disclosed test spends one owned kit, one pellet and one stamina; the incomplete seam leaks into a soaked kit, fixes no pump and teaches no execution source. Taking the actual lesson or leaving remains viable.',
        costs:[{type:'item',key:KIT,amount:-1},{type:'item',key:RESIN,amount:-1},{type:'vital',key:'stamina',amount:-1}],
        effects:[{type:'item',key:SOAKED,amount:1},knowledge('rough_seam_test','Your rough seam leaked in the direct spray. The actual kit is soaked, the resin spent and the pump unchanged. The observation identifies missing pressure control, without granting it.'),
            knowledge('rough_seam_test','I watched the traveler test the incomplete seam. Their effort and materials were real; the failed test did not teach the omitted control.',MIRI)]}),
    row({id:'repositories.show_matched_method',label:'Demonstrate your matched seams to Miri · 2 kits + 1 pellet + 3 stamina · 3 min',once:true,duration:3,
        powerId:METHOD,output:2,visibleWhen:all(eq(`power.${METHOD}.owned`),{fact:`power.${METHOD}.mastery`,op:'gte',value:3}),
        requires:all(local,healthy,hands,willing,control,{fact:`power.${METHOD}.mastery`,op:'gte',value:3}),
        completionRequires:all(local,healthy,hands,willing,control),
        description:'Your practiced matched seam produces two actual protected kits. Miri spends one of her stamina to attend and remembers the demonstrated function. She gains no copied body, fuel, execution source or mastery. The output stays in your native bag.',
        costs:[{type:'item',key:KIT,amount:-2},{type:'item',key:RESIN,amount:-1},{type:'vital',key:'stamina',amount:-3},
            {type:'vital',actor:MIRI,key:'stamina',amount:-1}],
        effects:[{type:'item',key:WAX,amount:2},knowledge('matched_method','Miri attended your matched-seam demonstration. One actual resin charge sealed two kits that remained in your bag; the learned function is yours.'),
            knowledge('matched_method','I watched two real kits sealed with one resin charge. This changes what the traveler can do; watching did not copy their trained control or holdings.',MIRI),
            {type:'relationship',actor:MIRI,target:'player',axis:'esteem',amount:1,text:'Witnessed a completed matched-seam demonstration, while each person retained their own means.'}]}),
];

// Only already received player knowledge is projected. Current private NPC
// facts, unobserved phases and future source-world events are not narrated.
export function repositoryMethodChainView(state) {
    const known=state.simulation?.knowledge.player || {};
    if(!known['repositories.wick_sketch']&&!known['repositories.wick_method'])return null;
    const entries=[
        ['repositories.wick_sketch','Incomplete explanation'],['repositories.rough_seam_test','Observed missing seam control'],
        ['repositories.wick_method','Qualified practiced instruction'],['repositories.sealed_supplies','Useful sealed supplies'],
        ['repositories.matched_method','A function witnessed by Miri'],['repositories.pump_result','Chosen local welfare outcome'],
        ['repositories.later_pump','Attributed retained floodline account'],['repositories.substitute_delivery','Funded material settlement'],
        ['repositories.substitute_return','Attributed later settlement account'],
    ].filter(([id])=>known[id]).map(([id,label])=>({id,label,text:known[id].value}));
    return {id:REPOSITORY_METHOD_CHAIN_ID,label:'Your recorded method & consequences',
        text:'These are your received records across this continuing life. A method, local result and later account stay distinct. Leaving for another destination neither awards an unseen step nor erases the original people or settlement.',rows:entries};
}
