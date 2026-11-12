// LP4 original proposal. The native calendar and inventory remain authoritative.
// Time is projected lazily, so rendering/reloading never grants native stock.
import {check, natural} from './basics.js';
import {rationMinutes, readNeed} from './needs.js';
import {planMeadowCourier, validateMeadowCourier} from './meadow_courier.js';
import {planMeadowShell, projectMeadowShell, SHELL_ACTIONS, validateMeadowShell} from './meadow_shell_state.js';
import {planMeadowFleece} from './meadow_fleece.js';
import {discoverMeadowWildlife, huntMeadowRabbit, meadowWildlife, validateMeadowWildlife} from './meadow_wildlife.js';
import {acquireCreature, creatureDevelopment, creatureHealth, injureCreature, practiceWithCreature, restoreCreatureLifecycle,
    settleCohortStock, settleCreatureBirth, settleCreatureCare, startCreatureBrood, startCreatureCare, transferCreature} from './creature_lifecycle.js';
// The sheep's hunger is the shared food need (needs.js, RCL12/LVR13): one hay ration holds careMinutes at the sheep's body rate.
export const HABITAT_BODY='sheep';
export const HABITAT = Object.freeze({site:'village.meadow_pen',animal:'meadow.fleece_sheep',
    location:'Village',world:'base.frontier',buildCost:18,adoptCost:12,feedCost:2,
    rescueCost:8, extensionCost:10, breedingCost:6, lambPrice:12, gestationMinutes:12, growthMinutes:18,
    careMinutes:rationMinutes(HABITAT_BODY,'food'),batchMinutes:6,yield:5});
export const HAY_KEY=JSON.stringify({id:'Meadow hay'});
export const WOOL_KEY=JSON.stringify({id:'Wool'});
const pen = {id: HABITAT.site, capacity: 1, supportedSpecies: [HABITAT_BODY]};
const ramYard = {id: 'village.ram_yard', capacity: 1, supportedSpecies: [HABITAT_BODY]};
const buyerYard = {...ramYard, id: 'village.buyer_yard', capacity: Number.MAX_SAFE_INTEGER};
const supplier = {id: 'village.livestock_yard', capacity: 1, supportedSpecies: [HABITAT_BODY]};

function enrollSheep(state, clock) {
    const stock = settleCohortStock(restoreCreatureLifecycle(), {revision: 0, id: HABITAT.animal,
        species: HABITAT_BODY, habitat: supplier, delta: 1});
    const sheep = acquireCreature(stock, {revision: stock.revision, cohortId: HABITAT.animal,
        destination: pen, keeper: state.site.owner, clock, traits: {coat: 'cream'}});
    state.lifecycle = sheep.state;
    state.sheepId = sheep.id;
}

function breedSheep(state, clock) {
    check(state.site.capacity === 2, 'Extend the pen to make room for a lamb.');
    check(!state.broodId && !state.lambId, 'The ewe is expecting or the spare stall is occupied.');
    check(!creatureHealth(state.lifecycle, state.sheepId, clock).injury?.remaining,
        'Let the ewe recover before breeding.');
    const stall = {...pen, capacity: 2};
    let lifecycle = state.lifecycle;
    if (!state.ramId) {
        lifecycle = settleCohortStock(lifecycle, {revision: lifecycle.revision, id: 'meadow.ram',
            species: HABITAT_BODY, habitat: ramYard, delta: 1});
        const ram = acquireCreature(lifecycle, {revision: lifecycle.revision, cohortId: 'meadow.ram',
            destination: ramYard, keeper: 'shepherd', clock, traits: {coat: 'brown', fleece: 'fine'}});
        lifecycle = ram.state;
        state.ramId = ram.id;
    }
    lifecycle = transferCreature(lifecycle, {revision: lifecycle.revision, id: state.ramId,
        fromKeeper: 'shepherd', toKeeper: 'player', destination: stall, clock});
    const brood = startCreatureBrood(lifecycle, {revision: lifecycle.revision, parents: [state.sheepId, state.ramId],
        keeper: 'player', clock, gestationMinutes: HABITAT.gestationMinutes, growthMinutes: HABITAT.growthMinutes,
        root: `meadow:${state.builtAt}`});
    state.lifecycle = transferCreature(brood.state, {revision: brood.state.revision, id: state.ramId,
        fromKeeper: 'player', toKeeper: 'shepherd', destination: ramYard, clock});
    state.broodId = brood.id;
}

function refreshCare(state, clock) {
    if (state.fedAt === null || state.attendedAt === null) return;
    const until = Math.min(state.fedAt, state.attendedAt) + HABITAT.careMinutes;
    if (until <= clock) return;
    state.lifecycle = startCreatureCare(state.lifecycle, {revision: state.lifecycle.revision,
        id: state.sheepId, clock, keeper: state.site.owner, duration: until - clock});
}

const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
export function validateHabitat(s,clock=Number.MAX_SAFE_INTEGER){
    if(s==null)return null;
    check(object(s)&&s.schema===1&&s.policy==='played_care_v1'&&s.site?.id===HABITAT.site&&
        s.site.owner==='player'&&s.site.sheltered===true&&[1,2].includes(s.site.capacity)&&
        natural(s.builtAt)&&natural(s.lastMinute)&&s.builtAt<=s.lastMinute&&s.lastMinute<=clock,
    'Invalid or unsupported meadow pen.');
    for(const k of ['feeds','attentions','collected'])check(natural(s[k]),'Invalid care history.');
    check(natural(s.progress)&&s.progress<=HABITAT.batchMinutes,'Invalid harvest progress.');
    if(s.animal==null)check(s.feeds===0&&s.attentions===0&&s.collected===0&&s.progress===0&&s.fedAt===null&&s.attendedAt===null,'Care requires an owned animal.');
    else check(s.animal.id===HABITAT.animal&&s.animal.owner==='player'&&s.animal.site===s.site.id&&s.animal.welfare==='sheltered_safe'&&
        natural(s.animal.adoptedAt)&&s.animal.adoptedAt>=s.builtAt&&s.animal.adoptedAt<=s.lastMinute,'Animal needs its suitable owned pen.');
    for(const [k,n] of [['fedAt','feeds'],['attendedAt','attentions']])check(s[k]===null||
        natural(s[k])&&s[k]>=s.animal?.adoptedAt&&s[k]<=s.lastMinute&&s[n]>s.collected,'Invalid saved care receipt.');
    check(s.collected<=s.feeds&&s.collected<=s.attentions,'Harvest requires finite feed and attention.');
    check(s.progress===0||s.fedAt!==null&&s.attendedAt!==null,'Production requires both care facts.');
    if(s.progress>0)check(s.progress<=s.lastMinute-s.animal.adoptedAt,'Production exceeds played time.');
    if (s.lifecycle !== undefined || s.sheepId !== undefined) {
        const lifecycle = restoreCreatureLifecycle(s.lifecycle);
        const sheep = Object.hasOwn(lifecycle.individuals, s.sheepId) && lifecycle.individuals[s.sheepId];
        check(s.animal && sheep &&
            sheep.species === HABITAT_BODY && sheep.origin === HABITAT.animal &&
            sheep.habitat === s.site.id && sheep.keeper === s.site.owner && sheep.bornAt === s.animal.adoptedAt &&
            sheep.health.lastAt <= s.lastMinute && Object.values(sheep.experience).every(x => x.lastAt <= s.lastMinute),
        'Invalid meadow sheep lifecycle.');
        const ram = lifecycle.individuals[s.ramId];
        const lamb = lifecycle.individuals[s.lambId];
        const brood = lifecycle.broods[s.broodId];
        check((s.ramId === undefined || ram?.keeper === 'shepherd' && ram.origin === 'meadow.ram' &&
                ram.habitat === ramYard.id && ram.species === HABITAT_BODY) &&
            (s.lambId === undefined || s.site.capacity === 2 && lamb?.keeper === s.site.owner &&
                lamb.habitat === s.site.id && lamb.species === HABITAT_BODY && lamb.origin === HABITAT.animal) &&
            (s.broodId === undefined || s.site.capacity === 2 && !s.lambId && s.ramId && brood &&
                brood.parents[0] === s.sheepId && brood.parents[1] === s.ramId) &&
            Object.keys(lifecycle.broods).length === Number(!!s.broodId) &&
            Object.entries(lifecycle.individuals).every(([id, animal]) => animal.bornAt <= s.lastMinute &&
                (id === s.sheepId || id === s.ramId || id === s.lambId ||
                    animal.keeper === 'shepherd' && animal.habitat === buyerYard.id && animal.origin === HABITAT.animal)),
        'Invalid meadow flock.');
    } else {
        check(s.ramId === undefined && s.lambId === undefined && s.broodId === undefined, 'Invalid meadow flock.');
    }
    if (s.lambTendedAt !== undefined || s.lambNextClipAt !== undefined) {
        const lamb = s.lifecycle?.individuals[s.lambId];
        check(lamb && (s.lambTendedAt === undefined || natural(s.lambTendedAt) &&
            s.lambTendedAt >= lamb.matureAt && s.lambTendedAt <= s.lastMinute) &&
            (s.lambNextClipAt === undefined || natural(s.lambNextClipAt) && s.lambNextClipAt >= lamb.matureAt),
        'Invalid lamb care.');
    }
    if (s.shellAnimal !== undefined) validateMeadowShell(s.shellAnimal, s.lastMinute);
    if (s.courier !== undefined) validateMeadowCourier(s.courier, s.lastMinute);
    if (s.wildlife !== undefined) validateMeadowWildlife(s.wildlife, s.lastMinute);
    return s;
}

export function migrateHabitat(owner, clock) {
    const state = structuredClone(validateHabitat(owner, clock));
    if (!state?.animal) return state;
    if (state.lifecycle) {
        state.lifecycle = restoreCreatureLifecycle(state.lifecycle);
        // This previously unrecorded trait belongs to the shepherd's ram.
        // Pending broods keep the inheritance already settled in their record.
        const ram = state.lifecycle.individuals[state.ramId];
        if (ram && ram.traits.fleece === undefined) ram.traits.fleece = 'fine';
    } else {
        enrollSheep(state, state.animal.adoptedAt);
        if (state.fedAt !== null && state.attendedAt !== null) {
            refreshCare(state, Math.max(state.fedAt, state.attendedAt));
        }
    }
    return state;
}

export function projectHabitat(owner,clock){
    const s = migrateHabitat(owner, clock);
    if (!s) return null;
    check(natural(clock)&&clock>=s.lastMinute,'The meadow clock cannot run backward.');
    if (s.broodId) {
        const brood = s.lifecycle.broods[s.broodId];
        if (clock >= brood.dueAt) {
            const birth = settleCreatureBirth(s.lifecycle, {revision: s.lifecycle.revision, broodId: s.broodId,
                clock: brood.dueAt, destination: {...pen, capacity: 2}});
            s.lifecycle = birth.state;
            s.lambId = birth.id;
            delete s.broodId;
        }
    }
    if (s.animal && s.fedAt !== null && s.attendedAt !== null &&
        creatureDevelopment(s.lifecycle, s.sheepId, clock).mature) {
        const health = creatureHealth(s.lifecycle, s.sheepId, clock);
        const start=Math.max(s.lastMinute,s.fedAt,s.attendedAt,s.lifecycle.individuals[s.sheepId].matureAt,
            health.injury?.remaining ? clock : (health.injury?.healedAt ?? 0)),
            end=Math.min(clock,s.fedAt+HABITAT.careMinutes,s.attendedAt+HABITAT.careMinutes);
        s.progress=Math.min(HABITAT.batchMinutes,s.progress+Math.max(0,end-start));
    }
    s.lastMinute=clock;return s;
}
export function habitatFacts(owner,clock){
    const s=projectHabitat(owner,clock),
        need=readNeed({body:HABITAT_BODY,sinceMeal:s?.fedAt==null?null:clock-s.fedAt}),fed=s?.fedAt!=null&&need.level>0,
        attended=s?.attendedAt!=null&&clock<s.attendedAt+HABITAT.careMinutes;
    const wound = s?.sheepId ? creatureHealth(s.lifecycle, s.sheepId, clock).injury : null;
    const lamb = s?.lambId ? s.lifecycle.individuals[s.lambId] : null;
    return {state:s,wound,lamb,shellAnimal:projectMeadowShell(s?.shellAnimal, clock),wildlife:meadowWildlife(s?.wildlife, clock),need,fed:!!fed,attended:!!attended,ready:s?.progress===HABITAT.batchMinutes,
        welfare:!s?.animal?'No animal':'Safe in suitable shelter with clean water'};
}
export function planHabitatAction(owner,action,{clock,money,inventory,location,world,ready}){
    check(ready&&location===HABITAT.location&&world===HABITAT.world,'Return free and alive to your Village meadow pen.');
    check(natural(clock)&&Number.isFinite(money)&&money>=0&&object(inventory),'Invalid native care context.');
    let s=projectHabitat(owner,clock),cost=0,items=[];
    if(action==='build'){
        check(!s,'You already own the meadow pen.');cost=HABITAT.buildCost;
        s={schema:1,policy:'played_care_v1',site:{id:HABITAT.site,owner:'player',sheltered:true,capacity:1},
            builtAt:clock,lastMinute:clock,animal:null,fedAt:null,attendedAt:null,progress:0,feeds:0,attentions:0,collected:0};
    }else{
        check(s?.site.owner==='player','Obtain your suitable sheltered pen first.');
        if (SHELL_ACTIONS.includes(action)) {
            const chamber = planMeadowShell(s.shellAnimal, action, {clock, inventory});
            s.shellAnimal = chamber.state;
            cost = chamber.cost;
            items = chamber.items;
        } else if (['hire_courier', 'fit_courier', 'dispatch_courier', 'recall_courier', 'receive_courier'].includes(action)) {
            const courier = planMeadowCourier(s.courier, action, {clock, inventory});
            s.courier = courier.state;
            cost = courier.cost;
            items = courier.items;
        } else if (action === 'survey_copse') {
            const wildlife = meadowWildlife(s.wildlife, clock);
            check(!wildlife || wildlife.pending, 'You have already checked the copse.');
            s.wildlife = wildlife?.state ?? discoverMeadowWildlife(clock);
        } else if (action === 'hunt_rabbit') {
            const hunt = huntMeadowRabbit(meadowWildlife(s.wildlife, clock), inventory);
            s.wildlife = hunt.state;
            items = hunt.items;
        } else if (action === 'extend_pen') {
            check(s.site.capacity === 1, 'The pen already has a second stall.');
            cost = HABITAT.extensionCost;
            s.site.capacity = 2;
        } else if (action === 'breed_sheep') {
            check(s.sheepId, 'Adopt a ewe before hiring a ram.');
            cost = HABITAT.breedingCost;
            breedSheep(s, clock);
        } else if (action === 'tend_lamb' || action === 'shear_lamb') {
            check(s.lambId && creatureDevelopment(s.lifecycle, s.lambId, clock).mature,
                'Let the lamb grow before you shear it.');
            if (action === 'tend_lamb') {
                check(s.lambTendedAt === undefined && clock >= (s.lambNextClipAt ?? 0),
                    'Finish the current clip or let the fleece grow back.');
                check((inventory[HAY_KEY] ?? 0) > 0, 'Bring one Meadow hay to feed the lamb.');
                s.lifecycle = startCreatureCare(s.lifecycle, {revision: s.lifecycle.revision, id: s.lambId,
                    clock, keeper: s.site.owner, duration: HABITAT.careMinutes});
                s.lambTendedAt = clock;
                items = [{key: HAY_KEY, amount: -1}];
            } else {
                check(s.lambTendedAt !== undefined && clock - s.lambTendedAt >= HABITAT.batchMinutes,
                    'Feed and brush the lamb, then give it six minutes before shearing.');
                items = planMeadowFleece(s.lambId, s.lifecycle.individuals[s.lambId], HABITAT.yield).effects;
                s.lifecycle = settleCreatureCare(s.lifecycle, {revision: s.lifecycle.revision, id: s.lambId,
                    clock, interrupted: true});
                delete s.lambTendedAt;
                s.lambNextClipAt = clock + HABITAT.careMinutes;
            }
        } else if (action === 'sell_lamb') {
            check(s.lambId, 'There is no lamb to sell.');
            check(creatureDevelopment(s.lifecycle, s.lambId, clock).mature, 'The lamb still needs time to grow.');
            s.lifecycle = transferCreature(s.lifecycle, {revision: s.lifecycle.revision, id: s.lambId,
                fromKeeper: s.site.owner, toKeeper: 'shepherd', destination: buyerYard, clock});
            delete s.lambId;
            delete s.lambTendedAt;
            delete s.lambNextClipAt;
            cost = -HABITAT.lambPrice;
        } else if(action==='adopt' || action === 'rescue_ewe'){
            check(!s.animal,'The pen already has its ewe.');
            cost=action==='rescue_ewe' ? HABITAT.rescueCost : HABITAT.adoptCost;
            s.animal={id:HABITAT.animal,owner:'player',site:s.site.id,adoptedAt:clock,welfare:'sheltered_safe'};
            enrollSheep(s, clock);
            if (action === 'rescue_ewe') {
                s.lifecycle = injureCreature(s.lifecycle, {revision: s.lifecycle.revision, id: s.sheepId,
                    clock, kind: 'cut', recoveryMinutes: 6});
            }
        }else if(action==='buy_feed'){
            cost=HABITAT.feedCost;items=[{key:HAY_KEY,amount:1}];
        }else{
            check(s.animal?.owner==='player'&&s.animal.site===s.site.id,'Care needs your own sheep in your own pen.');
            if(action==='feed'){
                check(s.progress<HABITAT.batchMinutes,'Collect the ready wool before another care cycle.');
                check(s.fedAt===null||clock>=s.fedAt+HABITAT.careMinutes,'The current hay ration still supports care.');
                check((inventory[HAY_KEY]||0)>=1,'Carry one actual Meadow hay bundle to feed your sheep.');
                // Begin a fresh supported interval while retaining earned progress.
                s.fedAt=clock;s.feeds++;items=[{key:HAY_KEY,amount:-1}];
                refreshCare(s, clock);
            }else if(action==='attend'){
                check(s.progress<HABITAT.batchMinutes,'Collect the ready wool before another care cycle.');
                check(s.attendedAt===null||clock>=s.attendedAt+HABITAT.careMinutes,'Your sheep has already been brushed for this care interval.');
                s.attendedAt=clock;s.attentions++;
                s.lifecycle = practiceWithCreature(s.lifecycle, {revision: s.lifecycle.revision,
                    id: s.sheepId, actor: s.site.owner, clock, minimumGap: 1, bondGain: 1});
                refreshCare(s, clock);
            }else if(action==='collect'){
                check(s.progress===HABITAT.batchMinutes,'The wool is not ready. Feed and brush, then allow six supported played minutes.');
                items=planMeadowFleece(s.sheepId, s.lifecycle.individuals[s.sheepId], HABITAT.yield).effects;s.progress=0;s.collected++;s.fedAt=null;s.attendedAt=null;
                s.lifecycle = settleCreatureCare(s.lifecycle, {revision: s.lifecycle.revision,
                    id: s.sheepId, clock, interrupted: true});
            }else throw Error('Unknown meadow pen action.');
        }
    }
    check(money>=cost,`You need ${cost} coins for this meadow pen action.`);
    // Historical progress can span multiple paid care intervals. Do not infer it
    // solely from the most recent timestamps when refreshing a partial batch.
    return {state:s,money:money-cost,items};
}
