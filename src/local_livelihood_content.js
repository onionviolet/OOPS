// Original, opt-in district. Uses existing structured origins and native jobs.
import {compileStructuredAbilities} from './structured_ability_runtime.js';
import {compileClaims, claimEffects} from './claim_runtime.js';
import {eq} from './basics.js';
export const LIVELIHOOD_PACK_ID = 'reedbank';
const P = LIVELIHOOD_PACK_ID;
export const livelihoodKey = name => JSON.stringify({id:`${P}.${name}`});
const key = livelihoodKey;
const gte = (fact,value,reason) => ({fact,op:'gte',value,...(reason?{reason}:{})});
const all = (...rows) => ({all:rows});
const flag = (name,value=true,actor='player') => ({type:'fact',scope:'actor',actor,key:`${P}.${name}`,value});
const note = (name,value,actor='player') => ({type:'knowledge',actor,key:`${P}.${name}`,stage:'understood',value});
const item = (name,amount,actor='player') => ({type:'item',actor,key:key(name),amount});
const money = amount => ({type:'resource',key:'money',native:true,amount});
const coins = (actor,amount) => ({type:'resource',actor,key:'coins',amount});
const give = (name,from,to) => ({type:'transfer',key:key(name),from,to,count:1});
const support = () => all(eq('actor.life','alive'),eq('native.ready'),eq('body.mobile'),gte('body.hands',1,'The holding jig needs one usable hand.'));
const bench = () => all(support(),eq('actor.reedbank.access',true,'Buy a repair kit and bench access from Mara.'),gte(`item.${key('kit')}`,1,'Keep your repair kit with you.'));
const method = () => eq('knowledge.reedbank.bracing.understood',true,'Learn braced joinery before working on the rigid crate.');
const readyMara = () => all(eq('target.life','alive'),gte('target.body.hands',1),eq('target.body.mobile'),gte(`target.item.${key('kit')}`,1,'Mara needs her own kit.'),eq('target.knowledge.reedbank.bracing.understood',true,'Mara must know the method herself.'));

export function createLocalLivelihoodContent() {
    const shop='reedbank.stall',lane='reedbank.lane',mara='reedbank.mara',customer='reedbank.sella';
    const command=(name,label,extra={})=>({id:`${P}.${name}`,revision:1,label,group:'structured_local',worldId:'reedbank.district',actorId:'player',location:shop,audience:['$actor'],costs:[],effects:[],...extra});
    const job=(name,label,duration,requires,costs,effects,extra={})=>command(name,label,{
        duration,cancellation:'refund',reservationReturns:1,requires,completionRequires:requires,
        completionCoLocated:true,completionFailure:'refund',costs,effects,...extra});
    const initial=[
        item('coat',1),item('wood',3),item('kit',2,mara),item('wood',1,mara),
        item('basket_worn',1,customer),item('crate_worn',1,customer),
        note('mara.met','Mara owns the stall, two repair kits, one offcut and one spare work period. She knows braced joinery and offers one paid joint repair.'),
        note('sella.met','Sella sells bread. Her split basket and loose-sided crate are here for repair; she has eight coins for those two deliveries and six for later small repairs.'),
        note('bracing','Mara knows how a diagonal brace keeps a loaded crate square.',mara),
        note('opening','You have three offcuts and an ordinary work coat. Buy access to Mara’s bench or take a walk along the lane. The holding jig supports either one or two hands. Work advances only on played time while you remain here; closing the browser pauses it. Travel waits for current work. Your history survives return.'),
        flag('access',false),flag('basket_delivered',false),flag('crate_delivered',false),flag('joint',false),flag('offer',false),flag('left',false),
    ];
    const repaired=(type,joint=false)=>[
        item(`${type}_fixed`,1),...(joint?[flag('joint'),note('joint_work','Mara cut and fitted the brace with her own kit, offcut and spare work period. You assembled the crate together; she is owed one of its four delivery coins.')]:[]),
        note('work',type==='basket'?'You stitched Sella’s basket using your kit and one offcut. Deliver it to put it back into use.':'You used braced joinery to make Sella’s crate carry a load without racking. Deliver the actual crate.'),
    ];
    const finishDelivery=(type,joint=false)=>command(`deliver_${type}${joint?'_joint':''}`,`Deliver Sella’s ${type} · ${joint?'3 coins to you, 1 to Mara':type==='basket'?'4 coins':'4 coins'}`,{
        once:true,targetId:customer,coLocated:true,participants:['$target'],
        requires:all(support(),eq(`actor.reedbank.${type}_delivered`,false),...(type==='crate'?[eq('actor.reedbank.joint',joint)]:[])),
        costs:[give(`${type}_fixed`,'player',customer),coins(customer,-4)],
        effects:[money(joint?3:4),...(joint?[coins(mara,1)]:[]),flag(`${type}_delivered`),
            {type:'relationship',target:customer,axis:'trust',amount:1},
            note(`${type}_receipt`,type==='basket'?'Sella paid four coins and put your repaired basket back into her bread round.':'Sella paid for your braced crate and now uses it for larger bread loads.'),
            note(`${type}_used`,type==='basket'?'My basket is back on the bread round.':'The braced crate holds my bread loads square.',customer)],
        description:'Deliver the actual repaired item. Sella’s own eight-coin repair fund pays each delivery once. Restoring this life never repays it.',
    });
    // A1/A2 native consumers (QR2). Proposal: Mara's joinery is a held method; its
    // brace pegs are finite and refit only once empty, at the bench, and use leaves
    // sore fingers. Two remembered claims name what they depend on.
    const claimDefinition={id:P,world:{id:'reedbank.district'},claims:[
        {id:`${P}.crate_pay`,about:'Sella’s crate pays four coins to me when I deliver it.',means:'report',precision:'exact',dependsOn:[eq('actor.reedbank.joint',false)]},
        {id:`${P}.offer_open_ended`,about:'Sella will keep paying two coins a fitting for as long as I bring them.',means:'report',precision:'gist',dependsOn:[],
            hypothesis:{refutedBy:`world.${P}.offer_is_finite`,test:{label:'Ask Sella how many more fittings her fund covers',requires:eq('actor.reedbank.offer')},
                refuted:'Sella’s standing fund is finite; it covers a few more fittings and she will say when it is spent.',supported:'Sella says the fund has no fixed end.'}}]};
    const claims=compileClaims(claimDefinition);
    const sources=[{id:`${P}.joinery`,revision:1,kind:'technique',label:'Braced joinery',grants:[]}];
    const abilities=[{id:`${P}.joinery_fitting`,commandId:`${P}.routine`,sourceId:`${P}.joinery`,function:'craft',acquisition:'learned',executionKind:'ordinary-technique',control:eq('actor.reedbank.access'),counters:[],carriers:[],
        conditions:[{id:`${P}.brace_pegs`,charges:{max:2,recharge:{when:'empty',label:'Refit the brace pegs with Mara',requires:bench()}},
            price:[flag('pegs_sore'),note('pegs_sore','The brace pegs leave your fingertips sore. Refitting a fresh set with Mara does not undo that.')]}]}];
    const crateRequires=all(bench(),method());
    const commands=[
        command('access','Buy kit and bench access · 2 coins',{
            once:true,targetId:mara,coLocated:true,participants:['$target'],requires:support(),
            costs:[money(-2),give('kit',mara,'player')],effects:[coins(mara,2),flag('access'),note('access','You bought one of Mara’s real kits and permission to use her holding jig. The kit is yours, with no return debt.')],
            description:'Two coins buy a real kit and continuing bench access. No field combat or campaign credit is required.',
        }),
        command('take_basket','Accept Sella’s basket repair · 4 coins on delivery',{
            once:true,targetId:customer,coLocated:true,participants:['$target'],requires:bench(),
            costs:[give('basket_worn',customer,'player')],effects:[note('basket_terms','Sella entrusted you with her worn basket. One offcut and two played minutes repair it; delivery pays four coins. Cancelling repair returns its inputs to you, and you may return the untouched basket.')],
        }),
        job('repair_basket','Repair Sella’s basket · 1 offcut · 2 min',2,bench(),[item('basket_worn',-1),item('wood',-1)],repaired('basket')),
        command('return_basket','Return the untouched basket',{
            targetId:customer,coLocated:true,requires:support(),costs:[give('basket_worn','player',customer)],effects:[note('basket_terms','You returned the untouched basket. Ask Sella to entrust it again when ready.')],
        }),
        command('retake_basket','Resume the returned basket repair',{
            targetId:customer,coLocated:true,requires:all(bench(),eq('knowledge.reedbank.basket_terms.understood'),eq('actor.reedbank.basket_delivered',false)),costs:[give('basket_worn',customer,'player')],
        }),
        finishDelivery('basket'),
        job('learn','Learn braced joinery from Mara · 2 coins · 2 min',2,all(bench(),eq('actor.reedbank.basket_delivered'),readyMara()),[money(-2)],[coins(mara,2),note('bracing','Mara taught you to seat and fasten a diagonal brace. You can now repair rigid crates, using your own kit and the holding jig.'),{type:'source',sourceId:`${P}.joinery`,operation:'grant',origin:'trained',awakened:true,active:true}],{
            once:true,targetId:mara,coLocated:true,participants:['$target'],description:'Practice the arrangement at the jig with Mara. A simple basket repair cannot stabilize a loaded rigid crate. Cancellation refunds the two coins and grants no method.',
        }),
        command('take_crate','Accept Sella’s crate repair · 4 coins on delivery',{
            once:true,targetId:customer,coLocated:true,participants:['$target'],requires:all(bench(),eq('actor.reedbank.basket_delivered')),
            costs:[give('crate_worn',customer,'player')],effects:[note('crate_terms','Sella entrusted you with her loose crate. Braced joinery is required. Repair it personally for four coins, or agree to share one delivery coin with Mara for her own brace work.'),...claimEffects(claims,`${P}.crate_pay`)],
        }),
        job('repair_crate','Brace the crate yourself · 1 offcut · 3 min',3,crateRequires,[item('crate_worn',-1),item('wood',-1)],repaired('crate')),
        job('joint_crate','Agree to repair with Mara · 1 coin of delivery pay · 2 min',2,all(crateRequires,readyMara(),gte('target.resource.attention',1,'Mara has no spare work period left.')),
            [item('crate_worn',-1),item('wood',-1,mara),{type:'resource',actor:mara,key:'attention',amount:-1}],repaired('crate',true),{
                targetId:mara,coLocated:true,participants:['$target'],completionRequires:all(crateRequires,readyMara()),
                description:'Mara offers one joint repair. She supplies her own offcut, kit, method and spare work period. You work together at the jig. Delivery pays three coins to you and one to her; cancellation or lost support refunds the reserved inputs and her period.',
            }),
        finishDelivery('crate'),finishDelivery('crate',true),
        job('leave','Walk to Reedbank lane · 1 min',1,support(),[],[{type:'relocate',location:lane},flag('left'),note('lane','The lane offers a quiet return boundary. No workshop work runs while you are here; closed-browser time does not advance this district.')]),
        job('return','Return to the repair stall · 1 min',1,support(),[],[{type:'relocate',location:shop}],{location:lane}),
        command('remember','Talk to Sella about your earlier repairs',{
            once:true,targetId:customer,coLocated:true,requires:all(support(),eq('actor.reedbank.left'),eq('actor.reedbank.basket_delivered'),eq('actor.reedbank.crate_delivered')),
            effects:[flag('offer'),...claimEffects(claims,`${P}.offer_open_ended`),note('later','Sella’s repaired basket and braced crate are still on her bread round. Because you delivered both, she offers you the next three small fittings at two coins each. This standing offer comes from those deliveries, not a fresh introduction.'),{type:'relationship',target:customer,axis:'trust',amount:1}],
        }),
        job('routine','Make and deliver a bread-basket fitting · 1 offcut · 2 coins · 2 min',2,all(bench(),method(),eq('actor.reedbank.offer')),
            [item('wood',-1),{type:'resource',actor:customer,key:'repeat_fund',amount:-2}],
            [item('fitting',1,customer),money(2),note('routine','You delivered another useful fitting to Sella. Her finite standing repair fund paid two coins; buy offcuts for further work.')],{targetId:customer,coLocated:true,participants:['$target']}),
        command('buy_wood','Buy an offcut from Mara · 1 coin',{
            targetId:mara,coLocated:true,requires:bench(),costs:[money(-1),give('wood',mara,'player')],effects:[coins(mara,1)],description:'Buy only actual remaining stock. Mara’s joint repair also uses this offcut, so buying it first can leave her unable to contribute.',
        }),
    ];
    // Starting charges and hidden truths are explicit initialization, not onEnroll.
    initial.push(...compileStructuredAbilities({id:P,world:claimDefinition.world,sources,abilities,simulation:{commands,powers:[]}}).seeds,
        {type:'fact',scope:'world',key:`${P}.offer_is_finite`,value:1});
    return {schema:2,id:P,revision:1,title:'A livelihood in Reedbank',description:'Optional original local life: repair Sella’s bread carriers at Mara’s stall. Begin selects one of two adult human starts, with one or two usable hands; both can use the holding jig. Your native name, gender, belongings and earlier progress remain in this save. No combat or Frontier campaign is required. This finite district has local walks and continuing repair work; it currently has no route back to Village. Closing the browser pauses its played clock.',compatibility:{legacy:'preserve-dormant',origin:'mandatory'},admission:{forms:['human'],lifeStages:['adult']},capabilities:['native-stock','jobs'],
        world:{id:'reedbank.district',label:'Reedbank district'},
        locations:[{id:shop,label:'Reedbank repair stall',description:'Mara’s covered bench and holding jig face Sella’s bread stand.',underRoof:true},{id:lane,label:'Reedbank lane',description:'A quiet lane beside the bread round. Return when you want to work or speak with Sella.',underRoof:true}],
        items:[{id:'reedbank.coat',label:'Reedbank work coat',description:'Your ordinary work coat, usable with either hand arrangement.',value:1,equipment:{slot:'torso',baseDefense:2,weight:1,layer:1,coverage:{chest:1,back:1},forms:['human']}},
            ...[['kit','Repair kit','A needle, small knife and fastening tools.'],['wood','Repair offcut','One actual offcut for a brace or fitting.'],['basket_worn','Sella’s split basket','A bread basket entrusted for repair.'],['basket_fixed','Sella’s repaired basket','Your repair returns it to Sella’s bread round.'],['crate_worn','Sella’s loose crate','A loaded crate needs braced joinery.'],['crate_fixed','Sella’s braced crate','A rigid crate repaired using a diagonal brace.'],['fitting','Bread-basket fitting','A useful fitting delivered on the standing repair agreement.']].map(([name,label,description])=>({id:`${P}.${name}`,label,description,value:1}))],
        starts:[2,1].map(hands=>({id:`${P}.${hands===2?'paired':'single'}_start`,locationId:shop,description:`You begin an adult local life with ${hands===2?'two usable hands':'one usable hand'}. The holding jig supports your repair work. Buy access or walk along the lane; work is optional.`,body:{id:'reedbank.player.body',ownerId:'player',controllerId:'player',form:'human',lifeStage:'adult',hands,mobile:true},effects:structuredClone(initial)})),
        sources,abilities,claims:claimDefinition.claims,
        simulation:{people:[{id:mara,label:'Mara',resources:{coins:0,attention:1}},{id:customer,label:'Sella',resources:{coins:8,repeat_fund:6}}].map(p=>({...p,revision:1,worldId:'reedbank.district',location:shop,inventory:'simulation',provision:false,body:{form:'human',lifeStage:'adult',hands:2,mobile:true},vitals:{health:10,max_health:10,stamina:10,max_stamina:10}})),commands},
        presentation:{people:{[mara]:{introductionKnowledgeKey:'reedbank.mara.met'},[customer]:{introductionKnowledgeKey:'reedbank.sella.met'}},status:['opening','access','basket_terms','basket_receipt','bracing','crate_terms','joint_work','crate_receipt','lane','later','routine'].map(name=>({id:`${P}.${name}_status`,label:({bracing:'Your method',later:'A later opportunity',joint_work:'Mara’s contribution'})[name]||name.replaceAll('_',' '),knowledgeKey:`${P}.${name}`}))},
    };
}
