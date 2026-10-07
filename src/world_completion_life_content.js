// Original home-world completion proposals. Registration grants no history,
// stock, person, access, prestige or automatic enrollment.
import {REMAINDER_HOME_IDS as H, REMAINDER_HOME_KEYS as K} from './audit_remainder_home_content.js';
import {worldCompletionStripStamp} from './world_completion_strip.js';

export const WORLD_COMPLETION_LIFE_IDS = Object.freeze({world:'base.frontier', group:'world_completion_life',
    prefix:'world.completion.', begin:'world.completion.begin', situation:'world.completion.return_account',
    public:'world.completion.life.public_account', private:'world.completion.life.private_account',
    revisit:'world.completion.life.changed_return', loadedDrain:'world.completion.life.loaded_drain', measuredLine:'world.completion.life.measured_line', eda:H.eda});
const I=WORLD_COMPLETION_LIFE_IDS;
const eq=(fact,value=true,reason)=>({fact,op:'eq',value,...(reason?{reason}:{})});
const all=(...rules)=>({all:rules});
const af=(key,value=true)=>({type:'fact',scope:'actor',actor:'player',key:I.prefix+key,value});
const know=(key,value,kind='observation',by='player')=>({type:'knowledge',actor:'player',key:I.prefix+key,stage:'seen',value,
    basis:{kind,attributedTo:by,situationId:I.situation}});
const command=d=>({revision:1,group:I.group,worldId:I.world,actorId:'player',location:'Village',costs:[],effects:[],...d});
const supported=all(eq('worldCompletion.enrolled'),eq('worldCompletion.local'),eq('worldCompletion.supportedBody'));
const account=all(supported,eq('worldCompletion.frontierMature'),eq('worldCompletion.localChapterClosed'),
    eq('worldCompletion.obligationsFree',true,'Finish or cancel accepted local work and return the borrowed lens before closing this chapter.'));
const end=mode=>[af('life.closed'),af('life.mode',mode),
    {type:'situation',situationId:I.situation,operation:'advance',expected:['working'],phase:mode}];

export const worldCompletionLifeDefinitions={encounters:[],people:[],sites:[],powers:[],advancements:[],controllers:[],events:[],transitions:[],origins:[],
    situations:[{id:I.situation,revision:1,label:'An accountable home-world return',context:{worldId:I.world,instanceId:'frontier.main',continuityId:'frontier.branch',eraId:'frontier.present',regionId:'frontier.village'},
        participants:['player'],initialPhase:'working',phases:['working','public','private'],privateTruth:{account:'only_received_or_performed'},responseWindow:null}],
    conditions:[],commands:[
        command({id:I.begin,label:'Connect your local work into a home-world chapter · free',once:true,
            visibleWhen:all(eq('auditRemainder.enrolled'),eq('worldCompletion.local'),eq('village.elderMet')),
            requires:all(eq('auditRemainder.enrolled'),eq('worldCompletion.referenceEnrolled'),eq('worldCompletion.local'),eq('worldCompletion.supportedBody'),eq('village.elderMet')),
            effects:[af('enrolled'),{type:'situation',situationId:I.situation,operation:'begin'},
                know('life.entry','You chose to connect the existing field, home and association work. People retain their own property, consent and received knowledge. Repair, measurement, learning, crop work and ordinary work remain separate choices; no supplies or past deeds were granted.')],
            description:'Open the optional connected chapter. This preserves your original opening and progress. It grants no item, method, body, stock or second prestige.'}),
        command({id:I.public,label:'Publish an accountable local report with Eda · 1 coin + 1 stamina + 2 min',once:true,claim:I.prefix+'life.closure',
            targetId:H.eda,coLocated:true,participants:['$target'],siteId:H.bench,duration:2,cancellation:'refund',reservationReturns:1,
            visibleWhen:all(eq('worldCompletion.enrolled'),eq('worldCompletion.frontierMature'),eq('worldCompletion.localChapterClosed')),
            requires:all(account,eq('worldCompletion.accountObserved'),eq('remainderHome.benchRight'),eq('remainderHome.edaSupported')),
            completionRequires:all(account,eq('worldCompletion.accountObserved'),eq('remainderHome.benchRight'),eq('remainderHome.edaSupported')),
            completionCoLocated:true,completionFailure:'refund',
            costs:[{type:'resource',actor:'player',native:true,key:'money',amount:-1},{type:'vital',actor:'player',key:'stamina',amount:-1}],
            effects:[{type:'resource',actor:H.eda,key:'coins',amount:1},{type:'reputation',actor:'player',region:'Village',amount:1},...end('public'),
                know('life.closure','You paid Eda for a present two-minute review of your received and performed local account, then published that bounded record. Village standing rose by one once. Unobserved decisions, missed work and unresolved facts were not certified. Materials, wages, injuries and other people\'s property retain their actual owners.','instruction',H.eda)],
            description:'Review the actual known work, weather, material and instrument records. One paid review and one Village standing change occur once; it certifies no hidden story or universal success.'}),
        command({id:I.private,label:'Keep an honest private working record · 1 min',once:true,claim:I.prefix+'life.closure',duration:1,cancellation:'refund',reservationReturns:1,
            visibleWhen:all(eq('worldCompletion.enrolled'),eq('worldCompletion.frontierMature'),eq('worldCompletion.localChapterClosed')),
            requires:account,completionRequires:account,completionFailure:'refund',effects:[...end('private'),
                know('life.closure','You closed this local chapter as a private working record. Chosen work and received accounts remain; unperformed or unknown outcomes stay unresolved. No fee, standing, supplies, stock replenishment, prestige or forced departure was awarded. Ordinary work, people and travel continue.')],
            description:'Close the chapter without a public fee or standing award. Keep actual changed people, property and outcomes, including late or declined work. The world remains available.'}),
        command({id:I.revisit,label:'Read your changed home-world return · free',
            visibleWhen:all(eq('worldCompletion.enrolled'),eq('actor.world.completion.life.closed')),
            requires:all(supported,eq('actor.world.completion.life.closed')),
            effects:[know('life.return','You returned to the same home world. This record grants no crop, wage, source, repaired object or reset. Your known accounts below describe retained changes; current native locations, access, actor consent and owned stock govern any further work.')],
            description:'A read-only return account committed to your own notebook. It pays nothing and does not replay earlier endings.'}),
        command({id:I.loadedDrain,label:'Apply your tested loaded control at the blocked drain · held kit + 1 stamina + 2 min',once:true,duration:2,cancellation:'refund',reservationReturns:1,
            siteId:'lore.warning.notch',
            visibleWhen:all(eq('worldCompletion.enrolled'),eq('worldCompletion.loadedSurveyKnown'),eq('worldCompletion.notchInspected')),
            requires:all(supported,eq('worldCompletion.loadedSurveyKnown'),eq('remainderHome.loadedSpecialist'),eq('worldCompletion.notchSupported'),eq('worldCompletion.notchRight'),eq('worldCompletion.drainOpen',false)),
            completionRequires:all(supported,eq('worldCompletion.loadedSurveyKnown'),eq('remainderHome.loadedSpecialist'),eq('worldCompletion.notchSupported'),eq('worldCompletion.notchRight'),eq('worldCompletion.drainOpen',false)),
            completionFailure:'refund',
            costs:[{type:'item',actor:'player',key:K.kit,amount:-1},{type:'vital',actor:'player',key:'stamina',amount:-1}],
            effects:[{type:'item',actor:'player',key:K.kit,amount:1,reservationReturn:true},af('life.loadedDrain'),
                know('life.loaded_drain','You used your actual earlier loaded survey, acquired specialization, real held kit and one stamina to clear the inspected notch in two minutes. The exact kit returned. The current drain changes after this supported completion; a rain boundary already completed is never replayed.')],
            description:'A useful downstream consumer for the earlier loaded workshop survey. It changes the same actual optional drain with less effort; ordinary drain work remains available.'}),
        command({id:I.measuredLine,label:'Line the inspected notch with your measured strip · strip + held kit + 1 stamina + 2 min',once:true,duration:2,
            siteId:'lore.warning.notch',cancellation:'refund',reservationReturns:1,
            visibleWhen:all(eq('worldCompletion.enrolled'),eq('worldCompletion.measuredSample'),eq('worldCompletion.notchInspected')),
            requires:all(supported,eq('worldCompletion.measuredStrip'),eq('worldCompletion.measuredSample'),eq('worldCompletion.notchSupported'),eq('worldCompletion.notchRight'),eq('worldCompletion.beforeRain')),
            completionRequires:all(supported,eq('worldCompletionLife.acceptedSample'),eq('worldCompletion.measuredSample'),eq('worldCompletion.notchSupported'),eq('worldCompletion.notchRight'),eq('worldCompletion.beforeRain')),
            completionFailure:'refund',
            costs:[{type:'item',actor:'player',key:JSON.stringify({id:'Measured drain strip'}),amount:-1},{type:'item',actor:'player',key:K.kit,amount:-1},
                {type:'vital',actor:'player',key:'stamina',amount:-1}],
            effects:[{type:'item',actor:'player',key:K.kit,amount:1,reservationReturn:true},af('life.measuredLine'),
                know('life.measured_line','Your actually taught and made measured strip became the inspected notch lining. One stamina and two supported minutes were spent; your held kit returned once. This changed the current drain before the single rain endpoint, without granting Eda\'s body, method or energy to you.')],
            description:'A real smaller-material consumer for the taught procedure. The strip becomes this lining and cannot also cover the crop. Finish before the actual rain boundary; a late or unsupported job returns its inputs and supplies no new outcome.'}),
    ]};

export function worldCompletionLifeFrozenDefinition(definition,stripKey=null){
    if(definition.id!==I.measuredLine)return definition;
    const stamp=worldCompletionStripStamp(stripKey);
    if(!stamp)return definition;
    return {...definition,costs:definition.costs.map(e=>e.type==='item'&&e.key===JSON.stringify({id:'Measured drain strip'})?{...e,key:stripKey}:e)};
}
