// ACS-P03's one optional schedule preference composes into the existing
// feature_society actors, world facts and controller. It creates no new owner.
import {SOCIETY_IDS as S} from './feature_expansion_society.js';
import {agreedDutyContinuationDefinitions} from './agreed_duty_continuation.js';

const P = S.prefix, W = S.world, H = S.household, O = S.craftsperson, V = S.apprentice;
const worldFact = (key, value) => ({type: 'world', worldId: W, key: `${P}.${key}`, value});
const knowledge = (key, value, attributedTo) => ({type: 'knowledge', actor: 'player', key: `${P}.duty.${key}`,
    stage: 'seen', value, basis: {kind: 'observation', attributedTo, situationId: `${P}.home_agreement`}});
const assent = (actor,key,value) => ({type:'knowledge',actor:'player',key:`${P}.duty.assent.${key}`,stage:'seen',value,
    basis:{kind:'observation',attributedTo:actor,situationId:`${P}.home_agreement`}});
const coin = (actor, amount) => ({type:'resource',actor,key:'coins',amount});
const money = amount => ({type:'resource',actor:'player',key:'money',native:true,amount});
const permission = (operation,key,actor,target) => ({type:'claim',operation,key,actor,...(target?{target}:{})});
const fact = (key, value) => ({type: 'fact', scope: 'world', key: `${P}.${key}`, value});
const actorFact = (key,value,actor='player') => ({type:'fact',scope:'actor',actor,key:`${P}.${key}`,value});
const eq = (name, value = true, reason) => ({fact: name, op: 'eq', value, ...(reason ? {reason} : {})});
const all = (...rules) => ({all: rules});

export const AGREED_DUTY_IDS = Object.freeze({
    repair: `${P}.orr_repair`, lesson: `${P}.orr_teach`, controller: `${P}.orr_controller`,
    agreementKey: `${P}.duty.agreement`, resultKey: `${P}.duty.result`, followupKey: `${P}.duty.followup`,
    preferenceFact: `world.${P}.dutyPreference`, repairFirst: `${P}.duty.repair_first`,
    lessonFirst: `${P}.duty.lesson_first`, ordinary: `${P}.duty.ordinary_order`,
    followupRepair: `${P}.duty.followup_repair`, followupLesson: `${P}.duty.followup_lesson`,
    followupUsed: `${P}.duty.followupUsed`, prebookedFact: `${P}.dutyPrebooked`,
    terminalCommandFact: `${P}.dutyTerminalCommand`,
    assentKeys: Object.freeze({household:`${P}.duty.assent.hessa`,craftsperson:`${P}.duty.assent.orr`,apprentice:`${P}.duty.assent.vale`}),
});

export const AGREED_DUTY_POLICY = Object.freeze({
    negotiationMinutes: 1,
    values: Object.freeze({repairFirst: 'repair_first', lessonFirst: 'lesson_first', ordinary: 'ordinary_order'}),
    followupValues:Object.freeze({repair:'At a later joint meeting, asked once to revisit repair-first scheduling after the retained duty account. This request assigned no work and reserved no means.',
        lesson:'At a later joint meeting, asked once to revisit lesson-first scheduling after the retained duty account. This request assigned no work and reserved no means.'}),
    currentReceipts: Object.freeze({
        repair: Object.freeze({
            agreement: 'Hessa, Orr and Vale agreed that the funded home repair will come before Vale’s one funded lesson.',
            assent: Object.freeze({
                hessa:'I agree that Orr may use my two supplied logs and three available coins for the home repair first; my household repair need remains bounded to this one job.',
                orr:'I agree to complete the already funded repair before Vale’s already funded lesson, using my own kit, attention, stamina and ordinary join. Either job still waits for legal support.',
                vale:'I agree to let Orr finish Hessa’s already funded repair before my one bounded lesson. This changes no future rights or wages.',
            }),
            kept: 'Kept the agreed repair-first order: Orr completed Hessa’s funded home repair with the reserved logs, kit, wage and body time. Vale’s separately funded lesson remained deferred; no added material, wage or result was created.',
            cancelled: 'The agreed repair-first request ended when its exact funded repair was cancelled. Its actual reservation was returned under the repair’s existing rule; Vale’s lesson and every settled term remained separate.',
            stopped: 'The agreed repair-first job stopped when its existing completion support was lost. Its actual reservation followed the repair’s existing refund rule; Vale’s funded lesson and all settled terms remain separate.',
            refused: 'Hessa or Orr refused the agreed repair-first request before work settled. No repair output or wage was granted; the existing offer and its actual means remain authoritative.',
        }),
        lesson: Object.freeze({
            agreement: 'Hessa, Orr and Vale agreed that Vale’s one funded lesson will come before Hessa’s funded home repair.',
            assent: Object.freeze({
                hessa:'I agree that my already funded home repair may wait for Vale’s one bounded lesson; my household repair need remains bounded to this one job.',
                orr:'I agree to teach Vale their one bounded lesson before the already funded home repair, using our own attention, stamina and ordinary join. Either job still waits for legal support.',
                vale:'I agree that Orr may teach my one bounded lesson before Hessa’s already funded repair. I keep my right to stop future offers and keep my own wages.',
            }),
            kept: 'Kept the agreed lesson-first order: Orr completed Vale’s funded lesson with the participants’ own attention and body time. Hessa’s separately funded repair remained deferred; no copied mastery or added output was created.',
            cancelled: 'The agreed lesson-first request ended when its exact lesson was cancelled. Its actual reservation was returned under the lesson’s existing rule; Hessa’s repair and every settled term remained separate.',
            stopped: 'The agreed lesson-first job stopped when its existing completion support was lost. Its actual reservation followed the lesson’s existing refund rule; Hessa’s funded repair and all settled terms remain separate.',
            refused: 'Hessa, Orr or Vale refused the agreed lesson-first request before work settled. No lesson or repair output was granted; existing means and consent remain authoritative.',
        }),
        ordinary: Object.freeze({
            agreement: 'Hessa, Orr and Vale agreed to keep the existing repair-first controller order for the funded home repair and Vale’s one funded lesson.',
            assent: Object.freeze({
                hessa:'I agree to the existing repair-first order for my one funded home repair and Vale’s separate bounded lesson.',
                orr:'I agree to keep the existing repair-first order for the two funded duties, using my own kit, attention and stamina.',
                vale:'I agree to keep the existing repair-first order before my one bounded lesson. This changes no future rights or wages.',
            }),
            kept: 'The ordinary order kept its existing repair-first result: Orr completed Hessa’s funded home repair first; Vale’s separately funded lesson remained deferred. No added material, wage or result was created.',
            cancelled: 'The ordinary-order repair was cancelled under its existing reservation rule and will not relaunch. Vale’s separately funded lesson remains pending under the unchanged controller.',
            stopped: 'The ordinary-order repair stopped under its existing completion-support rule and will not relaunch. Its actual reservation was returned; Vale’s independently funded lesson remains pending.',
            refused: 'A participant refused the ordinary-order request. No duty was reordered, cancelled, refunded or paid by this request.',
        }),
    }),
});

const introduced = eq(`actor.${P}.introduced`);
const local = eq('society.clockSupported');
const termsAndSupply = all(eq(`actor.${P}.termsHeard`),eq(`actor.${P}.supplied`),eq(`world.${P}.supplied`));
const noActiveRequest = eq('society.agreedDutyAvailable');
const command = (choice, route, label, value, attributedTo) => ({
    id: choice, revision: 1, group: 'feature_society', worldId: W, actorId: 'player', location: 'Village',
    label, description: 'After Hessa’s actual log purchase, make one bounded one-minute joint booking. It pays Orr the existing one-coin lesson fee, transfers Hessa’s existing limited home-work right to Orr, and records Hessa, Orr and Vale’s assent to this exact order. No work starts during the meeting; the existing controller still checks every real cost, support, site and availability gate.',
    targetId: H, coLocated: true, participants: [H, O, V], siteId:S.bench, duration: AGREED_DUTY_POLICY.negotiationMinutes, once: true,
    visibleWhen: all(introduced, local,termsAndSupply,{not:eq(`world.${P}.dutyPrebooked`)}), requires: all(introduced, local,termsAndSupply,noActiveRequest), costs: [money(-1)], cancellation:'refund',
    completionRequires: all(local,eq('society.agreedDutySupport')),completionCoLocated:true,completionFailure:'refund',
    effects: [coin(O,1),permission('transfer',S.homeRight,H,O),worldFact('repairConsent',true),worldFact('apprenticeConsent',true),
        worldFact('lessonFunded',true),worldFact('dutyPrebooked',true),actorFact('homeAuthorized',true),actorFact('lessonFunded',true),
        {type:'fact',scope:'actor',actor:O,key:`${P}.repairOffered`,value:true},
        {type:'fact',scope:'actor',actor:O,key:`${P}.teachOffered`,value:true},
        {type:'fact',scope:'actor',actor:V,key:`${P}.agreed`,value:true},worldFact('dutyPreference',value),
        assent(H,'hessa',AGREED_DUTY_POLICY.currentReceipts[route].assent.hessa),
        assent(O,'orr',AGREED_DUTY_POLICY.currentReceipts[route].assent.orr),
        assent(V,'vale',AGREED_DUTY_POLICY.currentReceipts[route].assent.vale),
        knowledge('agreement',AGREED_DUTY_POLICY.currentReceipts[route].agreement,attributedTo)],
});

export const agreedDutyDefinitions = Object.freeze({commands: Object.freeze([
    command(AGREED_DUTY_IDS.repairFirst,'repair','Agree on repair first · 1 coin · 1 minute', AGREED_DUTY_POLICY.values.repairFirst,H),
    command(AGREED_DUTY_IDS.lessonFirst,'lesson','Agree on lesson first · 1 coin · 1 minute', AGREED_DUTY_POLICY.values.lessonFirst,V),
    command(AGREED_DUTY_IDS.ordinary,'ordinary','Keep the ordinary duty order · 1 coin · 1 minute', AGREED_DUTY_POLICY.values.ordinary,H),
])});

// Apply only to the existing revision-1 Orr controller. The no-preference
// branch preserves its source-authored priority and candidate ordering.
export function agreedDutyController(controller) {
    if(controller?.id !== AGREED_DUTY_IDS.controller || controller.revision !== 1) return controller;
    const repairPreference = {fact: AGREED_DUTY_IDS.preferenceFact, op: 'eq', value: AGREED_DUTY_POLICY.values.repairFirst};
    const lessonPreference = {fact: AGREED_DUTY_IDS.preferenceFact, op: 'eq', value: AGREED_DUTY_POLICY.values.lessonFirst};
    const terminalFact=`world.${P}.dutyTerminalCommand`;
    const cancelledRepair = {fact:terminalFact,op:'eq',value:AGREED_DUTY_IDS.repair};
    const cancelledLesson = {fact:terminalFact,op:'eq',value:AGREED_DUTY_IDS.lesson};
    return {...controller, actions: controller.actions.map(action => action.commandId === AGREED_DUTY_IDS.repair
        ? {...action, when: all(action.when, {not: lessonPreference},{not:cancelledRepair})}
        : action.commandId === AGREED_DUTY_IDS.lesson
            ? {...action, when: all(action.when, {not: repairPreference},{not:cancelledLesson})}
            : action)};
}

// One optional later request must be causally after the kept/deferred/refused
// account. It asks for future discussion only; it never creates a duty.
export const agreedDutyFollowupDefinitions = Object.freeze({commands: Object.freeze([
    ...agreedDutyContinuationDefinitions.commands,
    {id: AGREED_DUTY_IDS.followupRepair, revision: 1, group: 'feature_society', worldId: W, actorId: 'player', location: 'Village',
        label: 'Ask once about another repair-first discussion · 1 minute', targetId: H, coLocated: true, participants: [H,O,V], duration: 1, once: true,
        visibleWhen: all(introduced, local), requires: all(eq(`knowledge.${AGREED_DUTY_IDS.resultKey}.seen`), eq('society.agreedDutyFollowupUnused')), costs: [],
        effects: [fact('duty.followupUsed', true), knowledge('followup', AGREED_DUTY_POLICY.followupValues.repair, H)]},
    {id: AGREED_DUTY_IDS.followupLesson, revision: 1, group: 'feature_society', worldId: W, actorId: 'player', location: 'Village',
        label: 'Ask once about another lesson-first discussion · 1 minute', targetId: H, coLocated: true, participants: [H,O,V], duration: 1, once: true,
        visibleWhen: all(introduced, local), requires: all(eq(`knowledge.${AGREED_DUTY_IDS.resultKey}.seen`), eq('society.agreedDutyFollowupUnused')), costs: [],
        effects: [fact('duty.followupUsed', true), knowledge('followup', AGREED_DUTY_POLICY.followupValues.lesson, H)]},
])});
