import {registerDomain} from './domain_registry.js';
import {addPurse} from './economy_domain.js';
import {publishDeathCause} from './defeat_domain.js';
import {advanceVillageLives,stageVillageFamilySave,familyPolicy,villageFamilyView,validateVillageLives} from './npc_lives.js';
import {lifeStage, lifeAge} from './life_experience.js';
import {freshEvents, validateEvents, migrateEvents, isFresh, scan, resolve as resolveEvent, bondAction, eventsView} from './life_events.js';
import {createLifeEventsPanel} from './life_events_ui.js';
// Household life events domain (W3 G26/G25/G03/G06). `npc_lives` stays the authority for who lives, dies and ages and is read
// through a port; this slice keeps only the player's answers, bond overlays, mourning, wards, memories and death lessons.
let state = freshEvents(), ports = null, panel = null, memo = '';
const EMPTY = {schema: 1, startYear: 100, lastYear: 100, seed: 1, people: [], events: [], news: []};
const chronicle = () => ports?.root().chronicle ?? null;
function livesAt(year) {
    const raw = ports?.villageLives?.();
    if(!raw) return {...EMPTY, startYear: year, lastYear: year};
    try {return advanceVillageLives(raw, Math.max(year, raw.lastYear));} catch {return null;}
}
function playerInput() {
    const c = chronicle();
    return c ? {lifeKey: c.enrolledAt, stage: lifeStage(c), playerEnded: c.life.endedAt !== null, playerAge: lifeAge(c)} : {};
}
function sync(notify = true) {
    if(!ports) return;
    const year = ports.year(), lives = livesAt(year);
    if(!lives) return;
    const input = playerInput(), signature = `${year}|${input.stage}|${input.playerEnded}|${ports.villageLives?.()?.lastYear}|${state.lastYear}|${state.events.length}`;
    if(signature === memo) return;
    const result = scan(state, lives, year, input);
    state = result.state;
    for(const d of result.deaths) publishDeathCause({kind: d.kind, place: null, by: []});
    if(notify) for(const n of result.notes) ports.logMessage(n, 'notification');
    memo = `${year}|${input.stage}|${input.playerEnded}|${ports.villageLives?.()?.lastYear}|${state.lastYear}|${state.events.length}`;
}
const view = () => {
    if(!ports) return null;
    const year = ports.year(), lives = livesAt(year);
    return lives ? {...eventsView(state, lives, year), hasLives: !!ports.villageLives?.(), money: ports.actor().money, year,family:villageFamilyView(ports.villageLives?.(),ports.calendar?.()),familyReady:ports.writable?.()&&ports.world?.()==='base.frontier'&&ports.location?.()==='Village'&&ports.idle?.()&&!ports.blocked?.()} : null;
};
function commit(next, cost, line) {
    const before = state, actor = ports.actor();
    state = next;
    try {if(cost) addPurse(actor, -cost, 'life_events');ports.persist(() => {});}
    catch(error) {state = before;if(cost) addPurse(actor, cost, 'life_events.undo');throw error;}
    memo = '';ports.logMessage(line, 'notification');panel?.render();
}
const commands = {
    stageFamily:stageVillageFamilySave,
    familyPolicy(enabled){
        if(ports?.blocked?.())throw Error(ports.blocked());if(!ports?.writable?.()||ports.world?.()!=='base.frontier'||ports.location?.()!=='Village'||!ports.idle?.())throw Error('Discuss household plans while free in the writable Village.');
        const before=ports.villageLives?.();if(!before)throw Error('Meet your actual Village neighbors first.');const next=validateVillageLives(familyPolicy(before,ports.calendar(),enabled));
        ports.setVillageLives(next);try{ports.persist(()=>{});}catch(error){ports.setVillageLives(before);throw error;}memo='';panel?.render();
    },
    resolve(eventId, choiceId) {
        sync();const year = ports.year(), lives = livesAt(year);
        const r = resolveEvent(state, lives, year, eventId, choiceId, ports.actor().money);
        commit(r.state, r.cost, r.line);
    },
    bond(action, a, b) {
        sync();const year = ports.year(), lives = livesAt(year);
        const r = bondAction(state, lives, year, action, a, b, ports.actor().money);
        commit(r.state, r.cost, r.line);
    },
};
export const lifeEventsState = () => state;
export function setLifeEventsDial(dial) {const next = structuredClone(state);next.dial = {...next.dial, ...dial};validateEvents(next);state = next;memo = '';panel?.render();}
export function configureLifeEvents(operations) {ports = operations;memo = '';}
registerDomain({id: 'life_events', deps: ['defeat'], initialState: freshEvents,
    save: () => isFresh(state) ? undefined : structuredClone(validateEvents(state)),
    validate: slice => {if(slice != null) validateEvents(slice);},
    migrate: migrateEvents,
    load: slice => {state = slice ?? freshEvents();memo = '';},
    tick: minutes => {if(ports && minutes > 0) try {sync();} catch {/* retried next tick */}},
    refresh: () => {if(!ports) return;try {sync();} catch {/* retried next refresh */}panel?.render();},
    projection: view, commands,
    panels: [() => {panel = createLifeEventsPanel({read: view, commands});}],
});
