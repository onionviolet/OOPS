import {natural} from '../basics.js';
import {recurringWindow} from '../world_rhythm.js';

// Original, bounded Village/household texture. All rewards are plans; the host
// persists native diffs and this state together before publishing either.
export const LOCAL_LIFE_BALANCE = Object.freeze({searchMinutes:5,baseChance:.1,missStep:.05,chanceCap:.4,
    perceptionStep:.002,perceptionCap:.1,poisonXpPerMinute:.25,hubMinutes:15,hubBase:.2,hubStep:.1,hubCap:.5,
    helpCost:5,helpXp:2});
export const RUNNER_MEAL_COST = 1;
export const WATCH_SCHEDULE = Object.freeze({period:1440,opens:420,closes:600});
export const MARKET_SCHEDULE = Object.freeze({period:10080,opens:540,closes:1020});
export const PARCEL_STOPS = Object.freeze([
    {location:'Village',npc:'village elder',text:'Collect the elder’s parcel in Village.'},
    {location:'Eastern mill',npc:'millers',text:'Take the parcel to the millers at Eastern mill.'},
    {location:'Village',npc:'old craftsman',text:'Return the millers’ receipt to the old craftsman in Village.'},
]);
export const MEAL_SCHEDULE = Object.freeze({period:1440,opens:720,closes:840});
const places = Object.freeze({Village:{item:'Linen cloth',label:'a dropped scrap of linen'},Shack:{item:'Stale bread',label:'a forgotten heel of bread'}});
const finite = n => Number.isFinite(n) && n>=0;
const count = n => natural(n)?n:0;
const stamp = n => natural(n)?n:null;
export function normalizeLocalLife(raw={}) {
    if(!raw || typeof raw!=='object' || Array.isArray(raw)) throw new Error('Invalid saved local life container.');
    if(raw.schema!=null && raw.schema!==1 && raw.schema!==2 && raw.schema!==3) throw new Error('Unsupported saved local life schema.');
    const searches={};
    for(const id of Object.keys(places)) {
        const old=raw.searches?.[id];
        searches[id]={misses:Math.min(count(old?.misses),100),found:old?.found===true};
    }
    if(raw.schema>=2 && (!natural(raw.runnerMealsIssued)||!natural(raw.runnerMealsUsed)))throw new Error('Invalid saved runner meal accounts.');
    const issued=raw.schema>=2?count(raw.runnerMealsIssued):0;
    const used=raw.schema>=2?count(raw.runnerMealsUsed):0;
    if(used>issued || issued>count(raw.helped))throw new Error('Invalid saved runner meal accounts.');
    if(raw.schema===3) {
        for(const key of ['homeMinutes','itemsBought','watchMinutes','watchShifts','parcelStep'])
            if(!natural(raw[key]))throw new Error('Invalid saved village life account.');
        if(raw.parcelStep>3)throw new Error('Invalid saved parcel step.');
        if(raw.watchDay!=null && !natural(raw.watchDay))throw new Error('Invalid saved watch day.');
    }
    return {schema:3,homeMinutes:count(raw.homeMinutes),itemsBought:count(raw.itemsBought),
        watchDay:stamp(raw.watchDay),watchMinutes:count(raw.watchMinutes),watchShifts:count(raw.watchShifts),
        watching:raw.watching===true,marketClaim:stamp(raw.marketClaim),
        visitorPending:raw.visitorPending===true,visitorMet:raw.visitorMet===true,pamphletRead:raw.pamphletRead===true,parcelStep:Math.min(3,count(raw.parcelStep)),parcelStarted:raw.parcelStarted===true,parcelRuns:count(raw.parcelRuns),
        runnerMealsIssued:issued,runnerMealsUsed:used,searches,looking:raw.looking===true,lookPlace:places[raw.lookPlace]?raw.lookPlace:null,
        searchProgress:Math.min(finite(raw.searchProgress)?raw.searchProgress:0,4.999),lastClock:stamp(raw.lastClock),
        lastLocation:typeof raw.lastLocation==='string'?raw.lastLocation:null,poisonMinutes:finite(raw.poisonMinutes)?raw.poisonMinutes:0,
        lastHubAttempt:stamp(raw.lastHubAttempt),hubMisses:Math.min(count(raw.hubMisses),100),
        hubDay:stamp(raw.hubDay),encounter:raw.encounter==='runner'?'runner':null,
        helped:count(raw.helped),declined:count(raw.declined),mealClaim:stamp(raw.mealClaim),meals:count(raw.meals)};
}
const ready = c => c.worldId==='base.frontier' && c.alive===true && c.idle===true && natural(c.clock) && natural(c.calendarMinute);
const chance = (s,c) => Math.min(LOCAL_LIFE_BALANCE.chanceCap,LOCAL_LIFE_BALANCE.baseChance+
    LOCAL_LIFE_BALANCE.missStep*(s.searches[c.location]?.misses||0)+Math.min(LOCAL_LIFE_BALANCE.perceptionCap,
        LOCAL_LIFE_BALANCE.perceptionStep*(finite(c.perception)?c.perception:0)));
const result = s => ({state:s,native:{money:0,items:[],skillXp:{}},messages:[]});
const addXp = (p,id,n) => {p.native.skillXp[id]=(p.native.skillXp[id]||0)+n;};
const roll = rng => {const n=rng();if(!Number.isFinite(n)||n<0||n>=1)throw new Error('Chance input must be in [0, 1).');return n;};

export function advanceLocalLife(raw,c,rng=()=>{throw new Error("Local life needs a saved random stream.");}) {
    const s=normalizeLocalLife(raw),p=result(s);
    if(!natural(c.clock)) return p;
    const delta=s.lastClock==null?0:Math.max(0,c.clock-s.lastClock);
    s.lastClock=c.clock;
    // Bind the duration at the START of this common-clock step. Loading and
    // rendering never supply exposure, nor does a repeated clock value.
    if(c.worldId==='base.frontier' && c.alive===true && delta>0 && finite(c.foodPoisonRemaining)) {
        const exposed=Math.min(delta,c.foodPoisonRemaining);
        s.poisonMinutes+=exposed;
        if(exposed) addXp(p,'Poison resistance',exposed*LOCAL_LIFE_BALANCE.poisonXpPerMinute);
    }
    if(delta>0 && c.worldId==='base.frontier' && c.alive===true && c.location==='Shack' && s.lastLocation==='Shack')
        s.homeMinutes=Math.min(Number.MAX_SAFE_INTEGER,s.homeMinutes+delta);
    if(c.worldId==='base.frontier' && c.alive===true && delta>0 && finite(c.bleedingRemaining))
        addXp(p,'Iron skin',Math.min(delta,c.bleedingRemaining)*.25);
    const moved=s.lastLocation!==null && s.lastLocation!==c.location;
    const firstVisit=s.lastLocation===null;
    s.lastLocation=c.location;
    // One roll on an observed arrival, never on a view or restore. Once met,
    // the visitor remains reachable rather than making the player reroll.
    if((moved||firstVisit)&&c.location==='Village')s.visitorPending=true;
    if(delta>0 && s.visitorPending && ready(c) && c.location==='Village' && !s.visitorMet) {
        s.visitorPending=false;
        if(roll(rng)<.4) {
        s.visitorMet=true;p.messages.push('A visiting courier offers a Village route pamphlet. Their name now stays in Local life.');
        }
    }
    if(s.watching) {
        const day=Math.floor(c.calendarMinute/1440);
        if(!ready(c)||c.location!=='Village'||day!==s.watchDay) {
            s.watching=false;s.watchMinutes=0;p.messages.push('Village watch interrupted. No pay; you can accept another morning shift.');
        } else if(delta>0) {
            s.watchMinutes=Math.min(1440,s.watchMinutes+delta);
            addXp(p,'Persistence',Math.min(delta,60)*.1);
            if(c.calendarMinute%1440>=1200) {
                s.watching=false;s.watchShifts++;p.native.money+=12;
                addXp(p,'Perception',3);p.messages.push('Village watch complete: 12 coins and 3 Perception XP. Another shift opens next morning.');
            }
        }
    }
    if(moved || !ready(c) || s.lookPlace!==c.location) {s.looking=false;s.searchProgress=0;}
    if(s.looking && delta>0 && places[c.location] && !s.searches[c.location].found) {
        s.searchProgress+=delta;
        if(s.searchProgress>=LOCAL_LIFE_BALANCE.searchMinutes) {
            // One attempt per observed played-clock step: never replay a batch
            // of historical rolls after a load, clock jump or sleeping tick.
            s.searchProgress=0;
            addXp(p,'Perception',.5);
            if(roll(rng)<chance(s,c)) {
                s.searches[c.location].found=true;s.looking=false;
                p.native.items.push({item_id:places[c.location].item,count:1});
                p.messages.push(`You find ${places[c.location].label}. Nothing else catches your eye here.`);
            } else {s.searches[c.location].misses++;p.messages.push('Nothing useful this time. Your next search chance has improved, up to 40%.');}
        }
    }
    // Contact attempts use the same played clock, one per fifteen quiet
    // Village minutes, with a persisted daily cap after an actual contact.
    const day=natural(c.calendarMinute)?Math.floor(c.calendarMinute/1440):null;
    if(ready(c) && c.location==='Village' && !s.encounter && s.hubDay!==day) {
        if(s.lastHubAttempt==null || moved) s.lastHubAttempt=c.clock;
        else if(delta>0 && c.clock-s.lastHubAttempt>=LOCAL_LIFE_BALANCE.hubMinutes) {
            s.lastHubAttempt=c.clock;
            const odds=Math.min(LOCAL_LIFE_BALANCE.hubCap,LOCAL_LIFE_BALANCE.hubBase+s.hubMisses*LOCAL_LIFE_BALANCE.hubStep);
            if(roll(rng)<odds) {s.encounter='runner';s.hubDay=day;s.hubMisses=0;
                p.messages.push('A supply runner pauses by the Village well. You can offer five coins for their meal or let them continue.');}
            else s.hubMisses=Math.min(100,s.hubMisses+1);
        }
    } else s.lastHubAttempt=c.clock;
    return p;
}

export function localLifeAction(raw,c,id) {
    const s=normalizeLocalLife(raw),p=result(s);
    const fail=message=>({...p,ok:false,messages:[message]});
    if(!ready(c)) return fail('Finish your current action in the home world first.');
    if(id==='look') {
        if(!places[c.location]) return fail('There is no local search here.');
        if(s.searches[c.location].found) return fail('You have already found the useful loose item here.');
        s.looking=!s.looking;s.lookPlace=c.location;s.searchProgress=0;
        s.lastClock=c.clock;s.lastLocation=c.location;
        p.messages.push(s.looking?'Looking around: one attempt per five played minutes. Stop or leave at any time.':'You stop looking around.');
    } else if(id==='watch') {
        if(c.location!=='Village')return fail('Watch shifts start in Village.');
        const window=recurringWindow(WATCH_SCHEDULE,c.calendarMinute,s.watchDay);
        if(s.watching||!window.open)return fail(s.watching?'You are already on watch.':`Watch accepts 07:00–10:00; next opening in ${window.nextIn} minutes.`);
        s.watching=true;s.watchDay=window.cycle;s.watchMinutes=0;s.lastClock=c.clock;s.lastLocation=c.location;
        s.looking=false;p.messages.push('Watch accepted. Stay idle in Village until 20:00 for 12 coins and 3 Perception XP. Played watch minutes train Persistence. Other work or leaving interrupts without pay.');
    } else if(id==='stop_watch') {
        if(!s.watching)return fail('No active watch shift.');
        s.watching=false;s.watchMinutes=0;p.messages.push('You leave the watch. No pay; try another morning.');
    } else if(id==='market') {
        if(c.location!=='Village')return fail('Market day is in Village.');
        const window=recurringWindow(MARKET_SCHEDULE,c.calendarMinute,s.marketClaim);
        if(!window.open)return fail(`Weekly market: next opening in ${window.nextIn} minutes.`);
        s.marketClaim=window.cycle;p.native.items.push({item_id:'Stale bread',count:1});
        p.messages.push('The weekly market stall restocks one free Stale bread for you. Missed weeks do not accumulate.');
    } else if(id==='pamphlet') {
        if(c.location!=='Village'||!s.visitorMet||s.pamphletRead)return fail('No unread courier pamphlet here.');
        s.pamphletRead=true;p.messages.push('You read the courier’s route pamphlet: elder → Eastern mill → old craftsman. Parcel relay is now available; the elder can guide your next step. Existing travel permissions still apply.');
    } else if(id==='parcel_again') {
        if(c.location!=='Village'||s.parcelStep!==3)return fail('Finish the current relay before taking another in Village.');
        s.parcelStep=0;s.parcelStarted=false;p.messages.push('Another parcel relay is available. Collect it from the elder, visit the millers and return the receipt.');
    } else if(id==='parcel') {
        if(!s.pamphletRead||s.parcelStep>=3)return fail('Read the courier pamphlet before taking this errand.');
        const stop=PARCEL_STOPS[s.parcelStep];
        if(c.location!==stop.location)return fail(stop.text);
        if(s.parcelStep===0 && c.millUnlocked!==true)return fail('Clear the Cave room and report to the village elder to open the Eastern mill route first.');
        s.parcelStarted=true;s.parcelStep++;
        if(s.parcelStep===3){s.parcelRuns++;p.native.money=8;addXp(p,'Perception',2);p.messages.push('Parcel relay complete: the old craftsman accepts the receipt. 8 coins and 2 Perception XP.');}
        else p.messages.push(`Parcel handoff complete. Next: ${PARCEL_STOPS[s.parcelStep].text}`);
    } else if(id==='mentor') {
        if(c.location!=='Village')return fail('The elder gives route advice in Village.');
        p.messages.push(!s.pamphletRead?'Elder: Look for the visiting courier’s pamphlet in Village. Meet me through Talk to someone for the field and cave tasks. Clear the Cave room, then report back to open the Eastern mill route.':s.parcelStep<3?`Elder: ${PARCEL_STOPS[s.parcelStep].text}${!c.millUnlocked?' Clear the Cave room, then report back to me to open the Eastern mill route.':''}`:'Elder: Your relay is finished. Morning watch, midday bread and weekly market are repeatable local routines.');
    } else if(id==='help' || id==='decline') {
        if(c.location!=='Village' || !s.encounter) return fail('The runner is not waiting here.');
        if(id==='help') {
            if(s.helped===Number.MAX_SAFE_INTEGER)return fail('The runner help account is full.');
            if(!finite(c.money) || c.money<LOCAL_LIFE_BALANCE.helpCost) return fail('You need five coins to offer a meal.');
            p.native.money=-LOCAL_LIFE_BALANCE.helpCost;addXp(p,'Perception',LOCAL_LIFE_BALANCE.helpXp);s.helped++;s.runnerMealsIssued++;
            p.messages.push('You pay five coins for the runner’s meal and listen to their account of the road. Perception +2 XP. The runner leaves one meal ticket: later exchange it in Village with one coin for one Stale bread.');
        } else {s.declined++;p.messages.push('You wish the runner well and let them continue. No cost or penalty.');}
        s.encounter=null;
    } else if(id==='runner_meal') {
        if(c.location!=='Village')return fail('Use the runner meal ticket in Village.');
        if(s.runnerMealsUsed>=s.runnerMealsIssued)return fail('No unused runner meal ticket.');
        if(!finite(c.money)||c.money<RUNNER_MEAL_COST)return fail('The runner meal ticket needs one coin.');
        s.runnerMealsUsed++;p.native.money=-RUNNER_MEAL_COST;
        p.native.items.push({item_id:'Stale bread',count:1});
        p.messages.push('One runner meal ticket and one coin exchanged for one Stale bread. Use it from inventory for its ordinary meal effect.');
    } else if(id==='meal') {
        if(c.location!=='Village') return fail('The midday bread table is in Village.');
        const window=recurringWindow(MEAL_SCHEDULE,c.calendarMinute,s.mealClaim);
        if(!window.open) return fail(window.claimed?'You already took bread today.':`The bread table opens in ${window.nextIn} game minutes.`);
        s.mealClaim=window.cycle;s.meals++;p.native.items.push({item_id:'Stale bread',count:1});
        p.messages.push('The midday table gives you one Stale bread. It returns next game day; missed meals do not accumulate.');
    } else return fail('Unknown local action.');
    return {...p,ok:true};
}

export function localLifeView(raw,c) {
    const s=normalizeLocalLife(raw),visible=c.worldId==='base.frontier' && (!!places[c.location]||c.location==='Eastern mill');
    const available=ready(c),found=!!s.searches[c.location]?.found;
    const watch=natural(c.calendarMinute)?recurringWindow(WATCH_SCHEDULE,c.calendarMinute,s.watchDay):{open:false,nextIn:0};
    const market=natural(c.calendarMinute)?recurringWindow(MARKET_SCHEDULE,c.calendarMinute,s.marketClaim):{open:false,nextIn:0};
    const window=natural(c.calendarMinute)?recurringWindow(MEAL_SCHEDULE,c.calendarMinute,s.mealClaim):{open:false,nextIn:0};
    return {visible,title:'Local life',summary:!places[c.location]?'No loose finds at this stop.':found?'0 finds remain. Nothing of interest left; search stopped.':
        `1 find remains. ${Math.round(chance(s,c)*100)}% find chance, capped at 40%. Five played minutes per attempt; each miss adds 5 percentage points. Perception helps up to 10 points.`,
        exposure:`Raw Potato causes twenty minutes of native food poisoning; Roasted rat meat causes forty-five. Food poisoning retains its native health loss and resistance scaling. Actual exposure adds 0.25 Poison resistance XP per played minute (${s.poisonMinutes} minutes recorded). Cooking or safe food avoids this risk.`,
        readiness:available?'Ready. Search time passes while you remain idle here.': 'Finish combat, travel, dialogue, sleep or other work first.',
        rows:[{id:'look',label:found?'Search complete: nothing remains':s.looking?`Stop looking (${s.searchProgress}/5 minutes; 1 find remains)`:'Look around (1 find remains)',disabled:!available||found||!places[c.location]},
            ...(s.parcelStep===3 && c.location==='Village'?[{id:'parcel_again',label:'Start another Village parcel relay',disabled:!available}]:[]),
            ...(s.pamphletRead && s.parcelStep<3?[{id:'parcel',label:`Parcel relay ${s.parcelStep+1}/3: ${PARCEL_STOPS[s.parcelStep].text}${s.parcelStep===0&&!c.millUnlocked?' Clear the Cave room and report to the village elder to open Eastern mill first.':''}`,disabled:!available||c.location!==PARCEL_STOPS[s.parcelStep].location||(s.parcelStep===0&&!c.millUnlocked)}]:[]),
            ...(c.location==='Village'?[
                {id:'mentor',label:'Ask the village elder what to do next',disabled:!available},
                ...(s.visitorMet?[{id:'pamphlet',label:s.pamphletRead?'Courier: route pamphlet read':'Visiting courier: read route pamphlet (unlocks parcel relay)',disabled:!available||s.pamphletRead}]:[]),
                {id:s.watching?'stop_watch':'watch',label:s.watching?`Leave watch (${s.watchMinutes} minutes served; stay until 20:00)` : watch.open?'Accept Village watch (until 20:00; 12 coins)':`Watch closed: next opening in ${watch.nextIn} minutes (07:00–10:00)`,disabled:!available||(!s.watching&&!watch.open)},
                {id:'market',label:market.open?'Weekly market: take restocked bread':`Weekly market: next opening in ${market.nextIn} minutes (day 1, 09:00–17:00)`,disabled:!available||!market.open},
                {id:'meal',label:window.open?'Take midday bread (free, one per game day)':window.claimed?'Midday bread already claimed today':`Midday bread: opens in ${window.nextIn} minutes (12:00–14:00)`,disabled:!available||!window.open},
                ...(s.runnerMealsIssued>s.runnerMealsUsed?[{id:'runner_meal',label:`Use runner meal ticket (${s.runnerMealsIssued-s.runnerMealsUsed} left; 1 coin → 1 Stale bread)`,disabled:!available||!(c.money>=RUNNER_MEAL_COST)}]:[]),
                ...(s.encounter?[{id:'help',label:'Offer runner a meal (5 coins; Perception +2 XP; one meal ticket)',disabled:!available||!(c.money>=5)},
                    {id:'decline',label:'Let the runner continue (free)',disabled:!available}]:[])]:[])],
        encounter:c.location==='Village'?s.encounter?'A supply runner is waiting.':`A runner may stop by after fifteen quiet played minutes. Contact chance starts at 20%, rises on misses and caps at 50%; at most one contact per game day.`:''};
}

// Trade host supplies settled purchased quantities; failed quotes never call this.
export function recordLocalPurchases(raw,quantity) {
    if(!natural(quantity))throw new Error('Invalid purchased item count.');
    const s=normalizeLocalLife(raw);s.itemsBought=Math.min(Number.MAX_SAFE_INTEGER,s.itemsBought+quantity);return s;
}
export function localLifeQuestView(raw,c={}) {
    const s=normalizeLocalLife(raw);
    return [
        ...(s.watchDay!=null?[{id:'village.watch',name:'Village watch',completed:!s.watching,
            description:'Repeatable morning watch. Stay idle in Village until 20:00. Leaving or other work interrupts without pay.',
            objective:s.watching?`On watch: ${s.watchMinutes} played minutes. Stay until 20:00; 12 coins on completion.`:`${s.watchShifts} shifts completed. Accept another at 07:00–10:00.`}]:[]),
        ...(s.pamphletRead?[{id:'village.parcel',name:'Village parcel relay',completed:s.parcelStep===3,
            description:'The courier pamphlet connects the elder, millers and old craftsman. Use ordinary travel between handoffs.',
            objective:s.parcelStep===3?`${s.parcelRuns} relays delivered. 8 coins and 2 Perception XP paid for the last receipt. Start another in Village.`:`Next stop ${s.parcelStep+1}/3: ${PARCEL_STOPS[s.parcelStep].text}${s.parcelStep===0&&c.millUnlocked!==true?' Before collecting: clear the Cave room and report to the village elder to open Eastern mill.':''}`}]:[])
    ];
}
