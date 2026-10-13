import {recurringWindow} from '../world_rhythm.js';

// Original, bounded Village/household texture. All rewards are plans; the host
// persists native diffs and this state together before publishing either.
export const LOCAL_LIFE_BALANCE = Object.freeze({searchMinutes:5,baseChance:.1,missStep:.05,chanceCap:.4,
    perceptionStep:.002,perceptionCap:.1,poisonXpPerMinute:.25,hubMinutes:15,hubBase:.2,hubStep:.1,hubCap:.5,
    helpCost:5,helpXp:2});
export const RUNNER_MEAL_COST = 1;
export const MEAL_SCHEDULE = Object.freeze({period:1440,opens:720,closes:840});
const places = Object.freeze({Village:{item:'Linen cloth',label:'a dropped scrap of linen'},Shack:{item:'Stale bread',label:'a forgotten heel of bread'}});
const natural = n => Number.isSafeInteger(n) && n>=0;
const finite = n => Number.isFinite(n) && n>=0;
const count = n => natural(n)?n:0;
const stamp = n => natural(n)?n:null;
export function normalizeLocalLife(raw={}) {
    if(!raw || typeof raw!=='object' || Array.isArray(raw)) throw new Error('Invalid saved local life container.');
    if(raw.schema!=null && raw.schema!==1 && raw.schema!==2) throw new Error('Unsupported saved local life schema.');
    const searches={};
    for(const id of Object.keys(places)) {
        const old=raw.searches?.[id];
        searches[id]={misses:Math.min(count(old?.misses),100),found:old?.found===true};
    }
    if(raw.schema===2 && (!natural(raw.runnerMealsIssued)||!natural(raw.runnerMealsUsed)))throw new Error('Invalid saved runner meal accounts.');
    const issued=raw.schema===2?count(raw.runnerMealsIssued):0;
    const used=raw.schema===2?count(raw.runnerMealsUsed):0;
    if(used>issued || issued>count(raw.helped))throw new Error('Invalid saved runner meal accounts.');
    return {schema:2,runnerMealsIssued:issued,runnerMealsUsed:used,searches,looking:raw.looking===true,lookPlace:places[raw.lookPlace]?raw.lookPlace:null,
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

export function advanceLocalLife(raw,c,rng=Math.random) {
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
    const moved=s.lastLocation!==null && s.lastLocation!==c.location;
    s.lastLocation=c.location;
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
    const s=normalizeLocalLife(raw),visible=c.worldId==='base.frontier' && !!places[c.location];
    const available=ready(c),found=!!s.searches[c.location]?.found;
    const window=natural(c.calendarMinute)?recurringWindow(MEAL_SCHEDULE,c.calendarMinute,s.mealClaim):{open:false,nextIn:0};
    return {visible,title:'Local life',summary:found?'The loose item here has been found.':
        `${Math.round(chance(s,c)*100)}% find chance, capped at 40%. Five played minutes per attempt; each miss adds 5 percentage points. Perception helps up to 10 points.`,
        exposure:`Raw Potato causes twenty minutes of native food poisoning; Roasted rat meat causes forty-five. Food poisoning retains its native health loss and resistance scaling. Actual exposure adds 0.25 Poison resistance XP per played minute (${s.poisonMinutes} minutes recorded). Cooking or safe food avoids this risk.`,
        readiness:available?'Ready. Search time passes while you remain idle here.': 'Finish combat, travel, dialogue, sleep or other work first.',
        rows:[{id:'look',label:s.looking?`Stop looking (${s.searchProgress}/5 minutes)`:'Look around',disabled:!available||found},
            ...(c.location==='Village'?[{id:'meal',label:window.open?'Take midday bread (free, one per game day)':window.claimed?'Midday bread already claimed today':`Midday bread: opens in ${window.nextIn} minutes (12:00–14:00)`,disabled:!available||!window.open},
                ...(s.runnerMealsIssued>s.runnerMealsUsed?[{id:'runner_meal',label:`Use runner meal ticket (${s.runnerMealsIssued-s.runnerMealsUsed} left; 1 coin → 1 Stale bread)`,disabled:!available||!(c.money>=RUNNER_MEAL_COST)}]:[]),
                ...(s.encounter?[{id:'help',label:'Offer runner a meal (5 coins; Perception +2 XP; one meal ticket)',disabled:!available||!(c.money>=5)},
                    {id:'decline',label:'Let the runner continue (free)',disabled:!available}]:[])]:[])],
        encounter:c.location==='Village'?s.encounter?'A supply runner is waiting.':`A runner may stop by after fifteen quiet played minutes. Contact chance starts at 20%, rises on misses and caps at 50%; at most one contact per game day.`:''};
}
