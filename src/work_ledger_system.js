// Original P02 proposal. Native crafting owns materials, output, XP and time.
import {check as assert} from './basics.js';
const SCHEMA = 2;
const COMMISSIONS = Object.freeze({
    meal: Object.freeze({category:'cooking',subcategory:'items',recipeId:'Roasted rat meat',title:'A cooked meal',requirement:'Create roasted rat meat after accepting this commission.'}),
    hilt: Object.freeze({category:'woodworking',subcategory:'components',recipeId:'Short hilt',title:'A wooden hilt',requirement:'Create a short hilt after accepting this commission.'})
});
const SUPPORTED_RECIPES = Object.freeze([{"category": "woodworking", "subcategory": "components", "recipeId": "Short hilt"}, {"category": "woodworking", "subcategory": "components", "recipeId": "Medium handle"}, {"category": "woodworking", "subcategory": "components", "recipeId": "Long shaft"}, {"category": "woodworking", "subcategory": "components", "recipeId": "Shield base"}, {"category": "woodworking", "subcategory": "components", "recipeId": "Shield handle"}, {"category": "cooking", "subcategory": "items", "recipeId": "Animal fat"}, {"category": "cooking", "subcategory": "items", "recipeId": "Roasted rat meat"}, {"category": "cooking", "subcategory": "items", "recipeId": "Roasted purified rat meat"}, {"category": "cooking", "subcategory": "items", "recipeId": "Fried pork"}, {"category": "cooking", "subcategory": "items", "recipeId": "Fried goat meat"}, {"category": "cooking", "subcategory": "items", "recipeId": "Pork roast"}, {"category": "cooking", "subcategory": "items", "recipeId": "Goat stew"}, {"category": "cooking", "subcategory": "items", "recipeId": "Bread"}, {"category": "cooking", "subcategory": "items", "recipeId": "Apple pie"}, {"category": "cooking", "subcategory": "items", "recipeId": "Bread kwas"}, {"category": "cooking", "subcategory": "items", "recipeId": "Cider"}, {"category": "cooking", "subcategory": "items", "recipeId": "Fish skewer"}, {"category": "cooking", "subcategory": "items", "recipeId": "Fried fish"}, {"category": "cooking", "subcategory": "items", "recipeId": "Fish steak"}, {"category": "cooking", "subcategory": "items", "recipeId": "Fried frog meat"}, {"category": "cooking", "subcategory": "items", "recipeId": "Kingsized frog legs"}, {"category": "cooking", "subcategory": "items", "recipeId": "Alligator jerky"}, {"category": "cooking", "subcategory": "items", "recipeId": "Snake jerky"}, {"category": "cooking", "subcategory": "items", "recipeId": "Turtle jerky"}, {"category": "cooking", "subcategory": "items", "recipeId": "Swampland skewer"}, {"category": "cooking", "subcategory": "items", "recipeId": "Crab bisque"}, {"category": "cooking", "subcategory": "items", "recipeId": "Clam broth"}, {"category": "cooking", "subcategory": "items", "recipeId": "Turtle soup"}, {"category": "cooking", "subcategory": "items", "recipeId": "Basin gumbo"}].map(Object.freeze));
export function supportedWorkLedgerRecipes() {return clone(SUPPORTED_RECIPES);}
const DEFAULT_RULES = Object.freeze({revision:1,precisionBonus:0.15,assistQualityBonus:10,commissions:COMMISSIONS});
function rulesValid(r) {
    assert(r&&integer(r.revision)&&r.revision>0&&number(r.precisionBonus,0,1)&&number(r.assistQualityBonus,0,200),'Invalid original Work Ledger bonus or revision.');
    assert(r.commissions&&Object.keys(r.commissions).length===2&&Object.keys(r.commissions).every(id=>Object.hasOwn(COMMISSIONS,id)),'Invalid original commission definitions.');
    for(const [id,c] of Object.entries(r.commissions)) {
        assert(c&&c.category===COMMISSIONS[id].category&&c.subcategory===COMMISSIONS[id].subcategory&&typeof c.recipeId==='string'&&c.recipeId.length>0&&c.recipeId.length<=200,'Invalid original craft binding.');
        assert(SUPPORTED_RECIPES.some(r=>r.category===c.category&&r.subcategory===c.subcategory&&r.recipeId===c.recipeId),'Unsupported original craft binding.');
        assert(typeof c.title==='string'&&c.title.length>0&&c.title.length<=100&&typeof c.requirement==='string'&&c.requirement.length>0&&c.requirement.length<=500,'Invalid original commission text.');
    }
    return true;
}
function termsFor(state,id) {return state.commissions[id].terms??{...state.rules.commissions[id],revision:state.rules.revision,reward:2};}
function precisionBonus(state) {return state.rules.precisionBonus;}
function assistBonus(state) {return state.rules.assistQualityBonus;}
export function createWorkLedgerRulesDraft(state) {validateWorkLedger(state);return clone(state.rules);}
export function defaultWorkLedgerRules() {return clone(DEFAULT_RULES);}
export function validateWorkLedgerRulesDraft(draft,supportedRecipes=SUPPORTED_RECIPES) {
    rulesValid(draft);
    assert(Array.isArray(supportedRecipes),'Native recipe allowlist is required.');
    for(const c of Object.values(draft.commissions)) assert(supportedRecipes.some(r=>r.category===c.category&&r.subcategory===c.subcategory&&r.recipeId===c.recipeId),'This native craft binding is unsupported.');
    return true;
}
export function applyWorkLedgerRulesDraft(state,draft,context,{sequence,supportedRecipes}={}) {
    const next=begin(state,sequence,context);
    assert(draft?.revision===state.rules.revision,'This original rules draft is stale.');
    validateWorkLedgerRulesDraft(draft,supportedRecipes);
    next.rules=clone(draft);next.rules.revision++;
    return finish(next,[receipt('rules-applied',next.actorId,next.sequence,'Original Work Ledger rules applied. Active original power bonuses updated. Accepted commission terms and acquired eligibility remain frozen.')]);
}
export function resetWorkLedgerRules(state,context,{sequence}={}) {
    const draft=defaultWorkLedgerRules();draft.revision=state.rules.revision;
    return applyWorkLedgerRulesDraft(state,draft,context,{sequence});
}
const DEFAULT_SETTINGS = Object.freeze({effects:'reduced',sound:false,presentation:'inline'});
function integer(value) {return Number.isSafeInteger(value)&&value>=0;}
function number(value,min,max) {return typeof value==='number'&&Number.isFinite(value)&&value>=min&&value<=max;}
function clone(value) {return JSON.parse(JSON.stringify(value));}
function settingsValid(value) {return value&&['full','reduced','off'].includes(value.effects)&&typeof value.sound==='boolean'&&['inline','margin'].includes(value.presentation);}
function receipt(type,actorId,sequence,text,extra={}) {return {id:`work-ledger:${sequence}:${type}`,type,motif:type==='disconnect'?'closing':type.startsWith('applied')?'guidance':'seal',actorId,sequence,text,...extra};}
export function createWorkLedger(actorId='player') {
    assert(typeof actorId==='string'&&actorId.length>0,'Work Ledger needs an actor.');
    return {schema:SCHEMA,actorId,sequence:0,connection:'offered',points:0,precisionKnown:false,assistUnlocked:false,commissions:{meal:{status:'available',acceptedSequence:null},hilt:{status:'available',acceptedSequence:null}},rules:clone(DEFAULT_RULES),acquired:{precision:null,assist:null},settings:{...DEFAULT_SETTINGS},receipts:[]};
}
export function validateWorkLedger(state) {
    assert(state&&state.schema===SCHEMA,'Unsupported Work Ledger schema.');
    assert(typeof state.actorId==='string'&&state.actorId.length>0&&integer(state.sequence),'Invalid Work Ledger identity or sequence.');
    assert(['offered','refused','connected','disconnected'].includes(state.connection),'Invalid Work Ledger connection.');
    assert(integer(state.points)&&[0,2,4].includes(state.points)&&typeof state.precisionKnown==='boolean'&&typeof state.assistUnlocked==='boolean','Invalid Work Ledger rewards.');
    rulesValid(state.rules);
    assert(state.acquired&&Object.keys(state.acquired).length===2&&Object.hasOwn(state.acquired,'precision')&&Object.hasOwn(state.acquired,'assist'),'Invalid acquired Work Ledger terms.');
    for(const [id,known] of [['precision',state.precisionKnown],['assist',state.assistUnlocked]]) {const a=state.acquired[id];assert(known? a&&integer(a.revision)&&a.revision>0&&a.revision<=state.rules.revision&&a.cost===2&&number(a.bonus,0,id==='precision'?1:200):a===null,'Invalid acquired Work Ledger benefit.');}
    assert(settingsValid(state.settings),'Invalid Work Ledger settings.');
    assert(state.commissions&&Object.keys(state.commissions).length===2&&Object.keys(state.commissions).every(id=>Object.hasOwn(COMMISSIONS,id)),'Unknown Work Ledger commission.');
    for(const id of Object.keys(COMMISSIONS)) {
        const c=state.commissions?.[id];
        assert(c&&['available','accepted','completed','claimed'].includes(c.status),'Invalid Work Ledger commission.');
        assert(c.status==='available'?c.acceptedSequence===null:integer(c.acceptedSequence)&&c.acceptedSequence>0&&c.acceptedSequence<=state.sequence,'Invalid Work Ledger acceptance.');
    }
    for(const id of Object.keys(COMMISSIONS)) {const c=state.commissions[id];assert(c.status==='available'?c.terms==null:c.terms&&integer(c.terms.revision)&&c.terms.revision>0&&c.terms.revision<=state.rules.revision&&c.terms.reward===2,'Invalid frozen commission terms.');if(c.terms) rulesValid({revision:c.terms.revision,precisionBonus:0.15,assistQualityBonus:10,commissions:{...COMMISSIONS,[id]:c.terms}});}
    const earned=Object.keys(COMMISSIONS).map(id=>state.commissions[id]).filter(c=>c.status==='claimed').length*2;
    assert(state.points===earned-2*Number(state.precisionKnown)-2*Number(state.assistUnlocked),'Work Ledger point accounting changed.');
    assert(!state.assistUnlocked||state.commissions.hilt.status==='claimed','Assist lease needs its commission.');
    assert(!state.precisionKnown||state.commissions.meal.status==='claimed','Precision method needs its commission.');
    assert(Array.isArray(state.receipts)&&state.receipts.length<=40,'Invalid Work Ledger receipt history.');
    for(const r of state.receipts) assert(r&&typeof r.id==='string'&&typeof r.type==='string'&&typeof r.text==='string'&&['seal','guidance','closing'].includes(r.motif)&&r.actorId===state.actorId&&integer(r.sequence)&&r.sequence<=state.sequence,'Invalid Work Ledger receipt.');
    return true;
}
export function migrateWorkLedger(raw,actorId='player') {
    if(raw==null) return createWorkLedger(actorId);
    const next=clone(raw); // Legacy schema 1 receives its original frozen terms. Future data is rejected.
    if(next.schema===1) {next.schema=SCHEMA;next.rules=clone(DEFAULT_RULES);next.acquired={precision:next.precisionKnown?{revision:1,cost:2,bonus:0.15}:null,assist:next.assistUnlocked?{revision:1,cost:2,bonus:10}:null};for(const id of Object.keys(COMMISSIONS)) {const c=next.commissions?.[id];if(c&&c.status!=='available') c.terms={...COMMISSIONS[id],revision:1,reward:2};}}
    if(raw.schema===1) {next.settings??={...DEFAULT_SETTINGS};next.receipts??=[];}
    validateWorkLedger(next); assert(next.actorId===actorId,'Work Ledger actor mismatch.'); return next;
}
function eligible(state,context,village=true) {
    return context?.actorId===state.actorId&&context.alive===true&&context.busy===false&&typeof context.locationId==='string'&&(!village||context.locationId==='Village');
}
function begin(state,sequence,context,village=true) {
    validateWorkLedger(state);
    assert(eligible(state,context,village),'The Work Ledger needs its living, available holder at a valid location.');
    assert(integer(sequence)&&sequence===state.sequence+1,'This Work Ledger choice is stale.');
    const next=clone(state);next.sequence=sequence;return next;
}
function finish(next,events) {
    // Application receipts replace their prior application, without limiting use of either benefit.
    for(const event of events) {if(event.type.startsWith('applied')) next.receipts=next.receipts.filter(r=>r.type!==event.type); next.receipts.push(clone(event));}
    next.receipts=next.receipts.slice(-40);validateWorkLedger(next);return {state:next,events:clone(events)};
}
export function transitionWorkLedger(state,command,context) {
    const next=begin(state,command?.sequence,context);const action=command?.action;
    let text;
    if(action==='settings') {const settings=command.settings??command.payload;assert(settingsValid(settings),'Choose valid presentation settings.');next.settings={effects:settings.effects,sound:settings.sound,presentation:settings.presentation};text='Work Ledger presentation settings saved.';}
    else if(action==='accept') {assert(['offered','refused'].includes(next.connection),'The Work Ledger has already been answered.');next.connection='connected';text='You connect to the Work Ledger. Commissions require your own native crafting.';}
    else if(action==='refuse') {assert(next.connection==='offered','This offer has already been answered.');next.connection='refused';text='You refuse the Work Ledger. You may return to its offer.';}
    else if(action==='disconnect') {assert(next.connection==='connected','The Work Ledger is already disconnected.');next.connection='disconnected';text='You disconnect. The leased assist stops; your taught precision method remains.';}
    else if(action==='reconnect') {assert(next.connection==='disconnected','There is no disconnected Work Ledger to reconnect.');next.connection='connected';text='You reconnect. Your unlocked leased assist is usable again.';}
    else {
        assert(next.connection==='connected','Connect to the Work Ledger first.');
        const match=/^(accept|claim)-(meal|hilt)$/.exec(action||'');
        if(match) {
            const [,verb,id]=match,c=next.commissions[id];
            if(verb==='accept') {assert(c.status==='available','This commission has already been accepted.');c.status='accepted';c.acceptedSequence=next.sequence;c.terms=clone(termsFor(next,id));text=`Commission accepted: ${c.terms.title}. Only a new native result counts.`;}
            else {assert(c.status==='completed','Complete this commission before claiming it.');c.status='claimed';next.points+=c.terms.reward;text=`Commission reward claimed: ${c.terms.title}, ${c.terms.reward} Work Ledger points.`;}
        } else if(action==='learn-precision') {assert(!next.precisionKnown&&next.commissions.meal.status==='claimed'&&next.points>=2,'Claim the meal reward and keep 2 points for this method.');next.points-=2;next.precisionKnown=true;next.acquired.precision={revision:next.rules.revision,cost:2,bonus:next.rules.precisionBonus};text=`Precision method taught permanently. Native item recipes gain ${precisionBonus(next)*100} percentage points of success chance, up to certainty.`;}
        else if(action==='unlock-assist') {assert(!next.assistUnlocked&&next.commissions.hilt.status==='claimed'&&next.points>=2,'Claim the hilt reward and keep 2 points for this lease.');next.points-=2;next.assistUnlocked=true;next.acquired.assist={revision:next.rules.revision,cost:2,bonus:next.rules.assistQualityBonus};text=`Woodworking assist leased. While connected, native woodworking components gain ${assistBonus(next)} quality points within their recipe limit.`;}
        else throw new Error('Unknown Work Ledger action.');
    }
    return finish(next,[receipt(action,next.actorId,next.sequence,text)]);
}
export function observeWorkLedgerCraft(state,evidence,context) {
    const next=begin(state,evidence?.sequence,context,false);
    assert(typeof evidence.category==='string'&&typeof evidence.subcategory==='string'&&typeof evidence.recipeId==='string','Native crafting must identify its exact recipe.');
    assert(integer(evidence.attempts)&&evidence.attempts>0&&integer(evidence.successes)&&evidence.successes<=evidence.attempts&&integer(evidence.outputs),'Invalid native crafting receipt.');
    const events=[];
    if(context.locationId==='Village'&&next.connection==='connected'&&evidence.successes>0&&evidence.outputs>0) for(const id of Object.keys(COMMISSIONS)) {
        const def=termsFor(next,id);
        const c=next.commissions[id];
        if(c.status==='accepted'&&c.acceptedSequence<evidence.sequence&&def.category===evidence.category&&def.subcategory===evidence.subcategory&&def.recipeId===evidence.recipeId) {
            c.status='completed';events.push(receipt(`completed-${id}`,next.actorId,next.sequence,`Native crafting completed ${def.title}. Its ${def.reward}-point reward is ready to claim.`));
        }
    }
    if(evidence.outputs>0&&evidence.successes>0&&next.precisionKnown&&evidence.subcategory==='items'&&number(evidence.chanceBefore,0,1)&&number(evidence.chanceAfter,0,1)&&evidence.chanceAfter===Math.min(1,evidence.chanceBefore+precisionBonus(next))&&evidence.chanceAfter>evidence.chanceBefore) events.push(receipt('applied-precision',next.actorId,next.sequence,`Your taught precision method aided this native ${evidence.recipeId} craft.`,{before:evidence.chanceBefore,after:evidence.chanceAfter}));
    if(evidence.outputs>0&&evidence.successes>0&&next.connection==='connected'&&next.assistUnlocked&&evidence.category==='woodworking'&&evidence.subcategory==='components'&&number(evidence.qualityCap,10,200)&&number(evidence.qualityBefore,10,evidence.qualityCap)&&evidence.qualityAfter===Math.min(evidence.qualityCap,evidence.qualityBefore+assistBonus(next))&&evidence.qualityAfter>evidence.qualityBefore) events.push(receipt('applied-assist',next.actorId,next.sequence,`Your leased assist improved the quality of this native ${evidence.recipeId}.`,{before:evidence.qualityBefore,after:evidence.qualityAfter}));
    // The native caller supplies its already-applied output, not a promised reward.
    // Existing schema2 receipts accept arbitrary types and retain plain history.
    const output=evidence.outputLabel||evidence.recipeId;
    // Output decides the receipt: partial-result recipes can produce output with 0 whole successes.
    const succeeded=evidence.outputs>0;
    const text=succeeded
        ? `Craft settled: ${output} ×${evidence.outputs} from ${evidence.attempts} attempt${evidence.attempts===1?'':'s'}.`
        : `Craft settled: no output from ${output}. 0/${evidence.attempts} attempts succeeded.`;
    events.push(receipt(succeeded?'native-craft':'native-craft-failed',next.actorId,next.sequence,text,succeeded?{}:{motif:'closing'}));
    return finish(next,events);
}
export function modifyWorkLedgerChance(state,baseChance,context) {
    validateWorkLedger(state);assert(number(baseChance,0,1),'Native crafting chance must be a probability.');
    const value=state.precisionKnown&&eligible(state,context,false)&&context.subcategory==='items'?Math.min(1,baseChance+precisionBonus(state)):baseChance;
    return {value,event:null}; // Only observe committed native output to publish an application event.
}
export function modifyWorkLedgerQuality(state,baseQuality,context) {
    validateWorkLedger(state);assert(number(baseQuality,10,250),'Invalid native crafting quality.');
    if(!state.assistUnlocked||state.connection!=='connected'||!eligible(state,context,false)||context.category!=='woodworking'||context.subcategory!=='components') return {value:baseQuality,event:null};
    assert(number(context.qualityCap,10,200)&&baseQuality<=context.qualityCap,'The assist needs the native component recipe quality limit.');
    return {value:Math.min(context.qualityCap,baseQuality+assistBonus(state)),event:null};
}
export function workLedgerPresentation(state,context) {
    validateWorkLedger(state);const canWrite=eligible(state,context);const connected=state.connection==='connected';
    const actions=[['accept','Connect', ['offered','refused'].includes(state.connection)],['refuse','Refuse',state.connection==='offered'],['disconnect','Disconnect',connected],['reconnect','Reconnect',state.connection==='disconnected']];
    for(const id of Object.keys(COMMISSIONS)) {actions.push([`accept-${id}`,`Accept ${termsFor(state,id).title}`,connected&&state.commissions[id].status==='available']);actions.push([`claim-${id}`,`Claim ${termsFor(state,id).title} reward`,connected&&state.commissions[id].status==='completed']);}
    actions.push(['learn-precision','Learn precision method (2 points)',connected&&!state.precisionKnown&&state.points>=2&&state.commissions.meal.status==='claimed'],['unlock-assist','Lease woodworking assist (2 points)',connected&&!state.assistUnlocked&&state.points>=2&&state.commissions.hilt.status==='claimed']);
    return {state:clone(state),available:context?.actorId===state.actorId&&context?.locationId==='Village',canWrite,reason:canWrite?'':'Requires the living, available holder at the Village.',commissions:Object.keys(COMMISSIONS).map(id=>{const c=termsFor(state,id);return ({id,title:c.title,recipe:`${c.category}/${c.subcategory}/${c.recipeId}`,requirement:c.requirement,status:state.commissions[id].status,revision:c.revision,reward:c.reward})}),benefits:{precision:state.precisionKnown?`Permanently taught: +${precisionBonus(state)*100} percentage points to native item success chance.`:'Not taught.',assist:state.assistUnlocked?(connected?`Leased and connected: +${assistBonus(state)} woodworking component quality within its native recipe limit.`:'Lease disconnected; reconnect to use it.'):'No assist leased.'},actions:actions.map(([action,label,enabled])=>({action,label,enabled:canWrite&&enabled})),settings:{...state.settings}};
}
