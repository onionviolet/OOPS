// Original finite local proposals. Registration creates no actor or offer.
export const REMAINDER_OFFERS_GROUP = 'remainder_offers';
export const REMAINDER_OFFERS_WORLD = 'base.frontier';
export const REMAINDER_OFFERS_KEYS = Object.freeze({log:JSON.stringify({id:'Rough wood log'}),kit:JSON.stringify({id:'Prepared survey kit'})});
export const REMAINDER_SUPPLY = Object.freeze({client:'remainder.offers.ressa',situation:'remainder.offers.supply',price:4,window:20,
    purseSource:'association.one_local_supply_purse',needSource:'ressa.one_loaded_bank_job'});
const P = 'remainder_offers', W = REMAINDER_OFFERS_WORLD, K = REMAINDER_OFFERS_KEYS, S = REMAINDER_SUPPLY;
const eq = (fact,value=true,reason) => ({fact,op:'eq',value,...(reason?{reason}:{})});
const all = (...rules) => ({all:rules});
const yes = eq('auditRemainder.enrolled');
const local = all(yes,eq('remainder.offers.clockSupported',true,'This local offer needs supported home-realm played time.'));
const hands = eq('remainder.offers.handsUsable',true,'Use your recovered hands for this material work.');
const resource = (key,amount,actor) => ({type:'resource',key,amount,...(actor?{actor}:{})});
const money = amount => ({type:'resource',key:'money',native:true,amount});
const vital = (key,amount) => ({type:'vital',key,amount});
const af = (key,value=true,actor) => ({type:'fact',scope:'actor',key:`remainder.offers.${key}`,value,...(actor?{actor}:{})});
const know = (key,value,actor='player') => ({type:'knowledge',actor,key:`remainder.offers.${key}`,stage:'understood',value});
const command = d => {const value={revision:1,worldId:W,group:P,actorId:'player',location:'Village',costs:[],effects:[],...d};if(value.actorId===undefined)delete value.actorId;return value;};
const phase = value => eq(`situation.${S.situation}.phase`,value);
const change = (expected,value) => ({type:'situation',situationId:S.situation,operation:'advance',expected:[expected],phase:value});
const person = (id,label,resources,stamina,location='Village road') => ({id,revision:1,label,provision:false,inventory:'simulation',worldId:W,location,
    resources,vitals:{health:12,max_health:12,stamina,max_stamina:stamina},body:{hands:2,mobile:true}});

export const REMAINDER_PATHFINDER_PROFILES = Object.freeze([
    {profile:'sable',id:'remainder.offers.sable',label:'Sable, careful observer',focus:4,stamina:7,routeMinutes:3,routeStamina:1,routeFocus:2,packMinutes:2,packStamina:1,
        route:'A measured dry-bank route',terms:'Careful observation spends two focus and one stamina over three minutes; ordinary packing takes two minutes and one stamina.',
        useful:'After collection, the measured route supports a four-minute, one-stamina kit job from one log and one coin.'},
    {profile:'tovan',id:'remainder.offers.tovan',label:'Tovan, strong carrier',focus:1,stamina:10,routeMinutes:2,routeStamina:3,routeFocus:0,packMinutes:3,packStamina:1,
        route:'A shorter loaded crossing',terms:'The loaded route spends three stamina over two minutes; ordinary packing takes three minutes and one stamina.',
        useful:'After collection, the loaded route supports a two-minute kit job from one log, one coin and three stamina.'},
    {profile:'fen',id:'remainder.offers.fen',label:'Fen, practiced packer',focus:2,stamina:6,routeMinutes:2,routeStamina:1,routeFocus:1,packMinutes:1,packStamina:1,
        route:'A counted lashing layout',terms:'A route check spends one focus and one stamina over two minutes; the one owned packing-method unit makes a one-minute kit.',
        useful:'After collection, Fen’s demonstrated layout supports a one-minute kit job from one log, two coins and two stamina. Hiring first requires the delivered association supply commission.'},
]);

const profiles = REMAINDER_PATHFINDER_PROFILES;
export const remainderOffersItemSpecifications = [];
export const remainderOffersDefinitions = {
    people:[person(S.client,'Ressa, local supply client',{money:S.price,kit_need:1,detour_effort:1},4,'Village'),
        ...profiles.map(p=>person(p.id,p.label,{focus:p.focus,money:0,...(p.profile==='fen'?{pack_method:1}:{})},p.stamina))],
    situations:[{id:S.situation,revision:1,label:'Ressa’s finite local kit request',context:{worldId:W,instanceId:'base.frontier.current',continuityId:'expanded.frontier',eraId:'current',regionId:'village'},
        initialPhase:'posted',phases:['posted','accepted','delivered','declined','expired'],participants:['player',S.client],responseWindow:S.window,
        privateTruth:{clientId:S.client,itemKey:K.kit,count:1,price:S.price,purseSource:S.purseSource,needSource:S.needSource}}],
    commands:[
        command({id:`${P}.solicit`,label:'Ask for three pathfinder offers · 1 min',duration:1,cancellation:'refund',claim:'remainder.offers.solicitation',
            visibleWhen:all(yes,eq('knowledge.workbench.understood'),eq('remainder.offers.unsolicited')),
            requires:all(local,eq('village.craftsmanMet'),eq('knowledge.workbench.understood'),eq('remainder.offers.unsolicited')),
            description:'One finite solicitation. The three named profiles and their terms freeze now; reopening or cancelling creates no replacement roster.',
            effects:[know('solicitation','The association retained three named offers. Only your chosen person will receive three coins and one real log and start independent paid work.')]}),
        command({id:`${P}.decline_all`,label:'Decline all retained pathfinder offers',visibleWhen:all(yes,eq('remainder.offers.rosterOpen')),
            requires:all(local,eq('remainder.offers.rosterOpen')),claim:'remainder.offers.selection',effects:[know('declined','You declined this one roster. No candidate was created, paid, supplied or promised another solicitation.')]}),
        ...profiles.flatMap(p=>[
            command({id:`${P}.hire_${p.profile}`,label:`Commission ${p.label.split(',')[0]} · 3 coins + 1 log`,claim:'remainder.offers.selection',
                visibleWhen:all(yes,eq('remainder.offers.rosterOpen')),requires:all(local,eq('remainder.offers.rosterOpen'),eq(`remainder.offers.candidate.${p.profile}.eligible`,true,'This retained candidate lacks the disclosed current qualification.')),
                costs:[money(-3)],description:`${p.terms} ${p.useful} The three coins become this person’s own wage; one actual log becomes their work stock. This supplied commission is final.`,
                effects:[{type:'spawn',personId:p.id,definitionId:p.id},{type:'transfer',from:'player',to:p.id,key:K.log,count:1},resource('money',3,p.id),af('funded',true,p.id),af('willing',true,p.id),af('routeDone',false,p.id),af('ready',false,p.id),
                    know('contract',`You funded ${p.label} with three coins and one real log. Their own paid effort and method determine the route and packing time; other offers are closed.`),
                    know('funding','Received the agreed three-coin wage and one actual log for my one local commission.',p.id)]}),
            command({id:`${P}.route_${p.profile}`,actorDefinitionId:p.id,actorId:undefined,location:'Village road',label:`${p.label.split(',')[0]} checks ${p.route.toLowerCase()}`,
                once:true,duration:p.routeMinutes,cancellation:'refund',audience:['$actor'],requires:all(local,eq('remainder.offers.workerSupported'),eq('actor.remainder.offers.funded'),eq('actor.remainder.offers.routeDone',false)),
                completionRequires:all(yes,eq('remainder.offers.workerSupported')),completionFailure:'refund',
                costs:[vital('stamina',-p.routeStamina),...(p.routeFocus?[resource('focus',-p.routeFocus)]:[])],
                effects:[af('routeDone'),know('route',`${p.route}: completed through my own paid local effort.`, '$actor')]}),
            command({id:`${P}.pack_${p.profile}`,actorDefinitionId:p.id,actorId:undefined,location:'Village road',label:`${p.label.split(',')[0]} packs the supplied log and returns`,
                once:true,duration:p.packMinutes,cancellation:'refund',audience:['$actor'],requires:all(local,eq('remainder.offers.workerSupported'),eq('actor.remainder.offers.routeDone')),
                completionRequires:all(yes,eq('remainder.offers.workerSupported')),completionFailure:'refund',
                costs:[{type:'item',key:K.log,amount:-1},vital('stamina',-p.packStamina),...(p.profile==='fen'?[resource('pack_method',-1)]:[])],
                effects:[{type:'item',key:K.kit,amount:1},{type:'relocate',location:'Village'},af('ready'),know('work','My supplied log became one actual Prepared survey kit; I returned to hand it over.', '$actor')]}),
            command({id:`${P}.collect_${p.profile}`,targetId:p.id,coLocated:true,participants:['$target'],once:true,label:`Collect ${p.label.split(',')[0]}’s actual kit and route notes`,
                visibleWhen:all(yes,eq(`remainder.offers.candidate.${p.profile}.collectKnown`)),requires:all(local,eq(`remainder.offers.candidate.${p.profile}.ready`)),
                costs:[{type:'transfer',from:p.id,to:'player',key:K.kit,count:1}],effects:[af(`route.${p.profile}`),
                    know(`route.${p.profile}`,`${p.label.split(',')[0]} handed over the actual kit and explained ${p.route.toLowerCase()}. ${p.useful}`),
                    {type:'life',actor:p.id,status:'departed',reason:'Finite paid local commission delivered; left with the agreed wage.'}]}),
            command({id:`${P}.use_${p.profile}`,location:'Shack',label:`Use ${p.label.split(',')[0]}’s retained ${p.profile==='fen'?'packing layout':'route'} · make 1 kit`,duration:p.profile==='sable'?4:p.profile==='tovan'?2:1,cancellation:'refund',
                visibleWhen:all(yes,eq(`actor.remainder.offers.route.${p.profile}`)),requires:all(local,hands,eq('village.shackUnlocked'),eq(`actor.remainder.offers.route.${p.profile}`)),
                completionRequires:all(local,hands,eq('village.shackUnlocked')),completionFailure:'refund',
                description:p.useful,costs:[{type:'item',key:K.log,amount:-1},money(p.profile==='fen'?-2:-1),vital('stamina',p.profile==='sable'?-1:p.profile==='tovan'?-3:-2)],
                effects:[{type:'item',key:K.kit,amount:1},know(`use.${p.profile}`,'Applied the retained paid route or packing layout using my own real log, native coins and stamina; produced one useful native survey kit.')]}),
        ]),
        command({id:`${P}.hear_supply`,label:'Hear Ressa’s funded shortage report',once:true,claim:'remainder.offers.supply_occurrence',
            visibleWhen:all(yes,eq('village.craftsmanMet'),eq('remainder.offers.supplyAbsent')),requires:all(local,eq('village.craftsmanMet'),eq('remainder.offers.supplyAbsent')),
            description:'Ressa brings the association’s one allocated four-coin purse and owns one kit need. Hearing her creates this finite twenty-local-minute request; it accepts no promise.',
            effects:[{type:'spawn',personId:S.client,definitionId:S.client},af('detourDone',false,S.client),{type:'situation',situationId:S.situation,operation:'begin'},
                know('supply.report','Ressa owns one loaded-bank job that needs a Prepared survey kit and the association’s one four-coin supply purse. Accept and deliver before her displayed local deadline, or decline freely. No report refresh creates another purse.'),
                know('supply.source','The association allocated its one finite four-coin local-supply purse to my one loaded-bank job.',S.client)]}),
        command({id:`${P}.accept_supply`,targetId:S.client,coLocated:true,participants:['$target'],label:'Accept Ressa’s kit deadline · reserve her 4 coins',claim:'remainder.offers.supply_acceptance',
            visibleWhen:all(yes,phase('posted')),requires:all(local,phase('posted'),eq('remainder.offers.supplyOpen'),eq('remainder.offers.supplyFunded')),
            costs:[resource('money',-S.price,S.client)],effects:[resource('supply_escrow',S.price,S.client),change('posted','accepted'),
                know('supply.accepted','Accepted Ressa’s one-kit deadline. Her four coins left her purse and are reserved as the actual delivery escrow. No kit has moved yet.')]}),
        command({id:`${P}.deliver_supply`,targetId:S.client,coLocated:true,participants:['$target'],label:'Deliver 1 real kit to Ressa · receive 4 coins',
            visibleWhen:all(yes,phase('accepted')),requires:all(local,phase('accepted'),eq('remainder.offers.supplyOpen'),eq('remainder.offers.supplyEscrow')),
            costs:[{type:'transfer',from:'player',to:S.client,key:K.kit,count:1},resource('supply_escrow',-S.price,S.client),resource('kit_need',-1,S.client)],
            effects:[money(S.price),change('accepted','delivered'),know('supply.delivered','One actual kit entered Ressa’s stock and fulfilled her owned need before the deadline. Her four reserved coins paid you once.'),
                know('supply.delivered','Received the actual kit and paid my four reserved coins; the loaded-bank need is fulfilled.',S.client)]}),
        ...['posted','accepted'].map(status=>command({id:`${P}.decline_supply_${status}`,targetId:S.client,coLocated:true,participants:['$target'],label:status==='posted'?'Decline Ressa’s invitation freely':'Cancel accepted delivery · return Ressa’s 4-coin escrow',
            visibleWhen:all(yes,phase(status)),requires:all(local,phase(status),eq('remainder.offers.supplyOpen'),...(status==='accepted'?[eq('remainder.offers.supplyEscrow')]:[])),
            costs:status==='accepted'?[resource('supply_escrow',-S.price,S.client)]:[],effects:[...(status==='accepted'?[resource('money',S.price,S.client)]:[]),change(status,'declined'),
                know('supply.declined','Closed this finite local request without transferring a kit or payment. Any reserved four coins returned to Ressa. Ordinary relations and world reputation do not change.')]})),
        ...['posted','accepted'].map(status=>command({id:`${P}.expire_supply_${status}`,actorId:S.client,location:'Village',once:true,label:'Ressa closes her expired supply request',audience:['$actor'],
            requires:all(local,phase(status),eq('remainder.offers.supplyExpired'),...(status==='accepted'?[eq('remainder.offers.supplyEscrow')]:[])),
            costs:status==='accepted'?[resource('supply_escrow',-S.price)]:[],effects:[...(status==='accepted'?[resource('money',S.price)]:[]),change(status,'expired'),
                know('supply.expiry','The local deadline passed. I recovered any reserved four coins and kept the unmet need; I will spend my one detour effort on the longer route. No unpaid traveler promise is invented.',S.client)]})),
        command({id:`${P}.detour`,actorId:S.client,location:'Village',once:true,duration:2,cancellation:'refund',label:'Ressa checks her longer detour',audience:['$actor'],
            requires:all(local,eq('remainder.offers.supplyClosed'),eq('actor.remainder.offers.detourDone',false)),completionRequires:yes,completionFailure:'refund',
            costs:[resource('detour_effort',-1),vital('stamina',-1)],effects:[af('detourDone'),know('supply.detour','Spent my one detour-effort provision and one stamina over two minutes to check the longer route. The kit need remains unmet; no new payout or stock appeared.',S.client)]}),
        command({id:`${P}.supply_account`,targetId:S.client,coLocated:true,label:'Hear Ressa’s actual later detour account',once:true,
            visibleWhen:all(yes,eq('remainder.offers.supplyClosed')),requires:all(local,eq('remainder.offers.detourReported')),
            effects:[know('supply.aftermath','Ressa spent her own finite detour provision and stamina to check the longer route. Her kit need remains unmet and her unused four coins remain hers. Her lead points to the existing paid measured-packing method; no reward, debt or global reputation change is owed.')]}),
    ],
    controllers:[...profiles.map(p=>({id:`remainder.offers.controller.${p.profile}`,revision:1,label:`${p.label.split(',')[0]}’s finite funded plan`,actorId:p.id,interval:1,
        actions:[{commandId:`${P}.pack_${p.profile}`,priority:2},{commandId:`${P}.route_${p.profile}`,priority:1}]})),
        {id:'remainder.offers.controller.ressa',revision:1,label:'Ressa’s finite deadline and detour',actorId:S.client,interval:1,
            actions:[{commandId:`${P}.expire_supply_accepted`,priority:4},{commandId:`${P}.expire_supply_posted`,priority:3},{commandId:`${P}.detour`,priority:1}]}],
};

// A supported old template is immutable; UI refresh never constructs a roster.
export function remainderOffersTemplate(id) {
    const value = remainderOffersDefinitions.people.find(p=>p.id===id);
    return value ? JSON.parse(JSON.stringify(value)) : null;
}
