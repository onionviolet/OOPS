// Three finite original Village cases. Root owns named physical results/closure.
import {all, eq} from './basics.js';
import {CAUSAL_STORY_PEOPLE as P, CAUSAL_STORY_PROFILES as PROFILES, CAUSAL_STORY_PROOFS as PROOFS,
    CAUSAL_STORY_WORLD as WORLD, CAUSAL_STORY_LOCATION as LOCATION, CAUSAL_STORY_ITEMS as K,
    CAUSAL_STORY_SOURCES as SOURCES, causalStoryId} from './causal_story_ids.js';
import {freezeCausalStoryContent as freeze, causalStoryPeople, causalStoryActorFacts} from './causal_story_actors.js';
import {moneyActorKeyNative as money, staminaActorFirst as stamina, itemActorFirst as item} from './content_kit.js';
export {CAUSAL_STORY_NATIVE_PEOPLE, causalStorySeedEffects, causalStoryNativeStats} from './causal_story_actors.js';

export const CAUSAL_STORY_SITES = freeze({delivery:Object.fromEntries(PROOFS.map(p => [p, `causal.story.delivery.${p}`])),
    research:'causal.story.research', care:'causal.story.care', ordinary:'causal.story.ordinary'});
export const CAUSAL_STORY_MEETING_ID = 'causal.story.meeting.situation';
const sites = CAUSAL_STORY_SITES;
const enrolled = all(eq('causal.enrolled'), eq('causal.nativeBound'), eq('causal.local'));
const person = id => eq(`causal.person.${id}.available`, true, 'This person needs their actual free living Village body.');
const player = all(enrolled, eq('causal.playerSupported'));
const at = (proof, key, value=true) => eq(`causal.proof.${proof}.${key}`, value);
const flag = (proof, key, actor, value=true) => ({type:'fact', scope:'actor', actor, key:causalStoryId(proof, key), value});
const resource = (actor, key, amount) => ({type:'resource', actor, key:`causal.story.${key}`, amount});
const know = (proof, key, actor, value, attributedTo, stage='understood', kind='instruction') => ({type:'knowledge', actor,
    key:causalStoryId(proof, key), stage, value, ...(attributedTo ? {basis:{kind, attributedTo, situationId:causalStoryId(proof, 'situation')}} : {})});
const timed = (duration, support, siteId, coLocated=true) => ({duration, cancellation:'refund', completionFailure:'refund',
    completionRequires:support, completionCoLocated:coLocated, siteId});
const command = (proof, action, spec) => ({id:causalStoryId(proof, action), revision:1, worldId:WORLD, location:LOCATION,
    group:'causal_story', actorId:'player', once:true, costs:[], effects:[], ...spec});
const npc = (proof, action, actorId, spec) => command(proof, action, {group:'causal_story_npc', actorId, audience:['$actor'], ...spec});

export const causalStorySources = freeze([
    {id:SOURCES.method, revision:1, label:'Measured source release', kind:'technique', origin:'trained', grants:[],
        bioDetail:'An original learned procedure. Knowledge, a consenting current keeper, a held real kit and paid body effort support its admitted counter operation.'},
    {id:SOURCES.guard, revision:1, label:'Courier load guard', kind:'technique', origin:'trained', grants:[],
        bioDetail:'A local practiced load-bracing procedure. A real witnessed attack, own log, kit, purse and present body are needed for this one preparation.'},
    {id:SOURCES.covenant, revision:1, label:'Original survival covenant', kind:'trait', origin:'acquired', grants:[],
        bioDetail:'An original identity-owned survival source. Its admitted law protects terminal physical survival while supported, without promising other goals.'},
    {id:SOURCES.anchor, revision:1, label:'Original established future connection', kind:'trait', origin:'acquired', grants:[],
        bioDetail:'An original already-established identity-local connection. Its topology is an explicit proof rule; present strength does not create the connection.'},
]);
const methodSupport = all(enrolled, eq('causal.actorMethodSupported'));
const powers = [
    {id:SOURCES.method, revision:1, label:'Measured source release', model:'practice', capacity:1, worlds:[WORLD], execution:methodSupport,
        description:'Use the admitted proof-specific counter only after actual research, instruction and current authorization. Remembering the account grants no target source.'},
    {id:SOURCES.guard, revision:1, label:'Courier load guard', model:'practice', capacity:1, worlds:[WORLD],
        execution:all(enrolled, eq(`faculty.${SOURCES.guard}.active`)), description:'One supported guarded preparation using this courier\'s real body and materials after an actual witnessed attack.'},
];
const sourceAccounts = {
    mortal:'Nell checks Tarin\'s current ordinary body and the independently supplied load. This case supplies no survival or revival source to Tarin. The kit deadline and Tarin\'s personal survival are separate concerns.',
    covenant:'Nell identifies Asha\'s currently supported original survival covenant with Asha present. It prevents terminal physical killing while intact; it does not guarantee delivery, victory, ownership or freedom. This instruction records no attack and transfers no covenant.',
    anchor:'Nell identifies Orin\'s currently supported original established identity-local connection with Orin present. It is a real retained relation under this case\'s limited topology, not a forecast from current level. Delivery and future power remain unpromised. This instruction records no attack and transfers no connection.',
};
const researchAccounts = {
    mortal:'I checked Tarin\'s actual ordinary body and the supplied means using one real log, my counted kit, purse, attention and effort. No revival source exists in this case. My measured-release procedure can be taught, but there is no Tarin protection to sever.',
    covenant:'I studied Asha\'s actual current survival source with Asha present. Measured release can cut this original binding only through the admitted current-source counter with my specific authorization and an actually learned procedure. It removes the binding; it grants no covenant or automatic injury.',
    anchor:'I studied Orin\'s actual already-established identity-local connection with Orin present. The measured procedure can isolate this original limited connection under the admitted topology. It does not retroactively erase committed history, copy future abilities or alter unrepresented worlds.',
};
const methodAccount = proof => `Nell taught me the measured procedure for this ${proof} case through actual supported instruction. I retained the description and practiced with my own real kit, rope and body. The exact current target source, Nell\'s separate authorization and a supported paid counter remain necessary. No target protection, future strength or other identity was acquired.`;

// Original spoken aftermath, received only through a completed conversation
// with the still-present consenting courier. No private outcome is disclosed.
const afterwardAccounts = {
    mortal:'Tarin says, "A kit is useful when someone can use it. Next time, ask me what I need before deciding what would help." I heard him after Nell\'s delivery account; this conversation changes no earlier result.',
    covenant:'Asha says, "Getting through a day and getting the work done are two different things. When you make a plan with me, ask what I want it to accomplish." I heard her after Nell\'s delivery account; she gave me no survival source.',
    anchor:'Orin says, "If we do more work, agree on the work first. Nobody gets to spend my next day for me." I heard him after Nell\'s delivery account; this conversation grants no future ability or ownership of his time.',
};

const commands = PROOFS.flatMap(proof => {
    const lead = P[proof], name = PROFILES[proof].name, open = all(enrolled, at(proof, 'open'));
    const leadDelivery = all(open, at(proof, 'deliveryPending'), at(proof, 'leadSupported'), person(P.keeper));
    const witnessDelivery = all(open, at(proof, 'deliveryPending'), person(P.witness), person(P.keeper),
        at(proof, 'witnessKnows'), at(proof, 'witnessWarned'), at(proof, 'leadInterrupted'));
    const researchSupport = all(enrolled, at(proof, 'researchSupported'), at(proof, 'researchRequested'), at(proof, 'researchDone', false));
    const lessonSupport = all(player, at(proof, 'methodSupported'), at(proof, 'methodTaught', false));
    const ordinaryPlayer = all(player, at(proof, 'ordinarySupported'), person(P.keeper));
    return [
        command(proof, 'keep_watch', {label:`Stay by ${name}'s packing bench · 1 stamina + 4 min`,
            visibleWhen:all(at(proof, 'playerTermsKnown'), at(proof, 'open')),
            requires:all(player, at(proof, 'open'), at(proof, 'playerTermsKnown')),
            // Occupy only the player. Couriers, Nell and Roe retain their own
            // benches and work. Old enrolled saves need no additional site.
            duration:4, cancellation:'refund', completionFailure:'refund',
            completionRequires:all(player, at(proof, 'exists')), completionCoLocated:true,
            costs:[stamina('player', -1)],
            effects:[know(proof, 'watch', 'player', `I stayed at the Village packing bench for four played minutes. The courier work had its own time to proceed if its people and supplies supported it. I still need to ask Nell what she received. Watching supplied no kit or guaranteed delivery.`, 'player', 'seen', 'observation')]}),
        command(proof, 'talk_afterward', {label:`Talk with ${name} after Nell's account · 1 min`,
            targetId:lead, coLocated:true, participants:['$target'],
            claim:causalStoryId(proof, 'afterward_conversation'),
            visibleWhen:all(at(proof, 'closed'), eq(`knowledge.${causalStoryId(proof, 'closure')}.seen`)),
            requires:all(player, at(proof, 'closed'), person(lead), eq(`knowledge.${causalStoryId(proof, 'closure')}.seen`)),
            // A conversation occupies its two people, not Nell's packing site.
            duration:1, cancellation:'refund', completionFailure:'refund',
            completionRequires:all(player, at(proof, 'closed'), person(lead),
                eq(`knowledge.${causalStoryId(proof, 'closure')}.seen`)), completionCoLocated:true,
            costs:[resource(lead, 'attention', -1)],
            effects:[know(proof, 'afterward', 'player', afterwardAccounts[proof], lead, 'seen', 'instruction')]}),
        command(proof, 'cooperate', {label:`Help ${name} pack the actual delivery · 1 log + 1 coin + 2 min`,
            targetId:lead, coLocated:true, participants:['$target'], claim:causalStoryId(proof, 'player_cooperation'),
            visibleWhen:all(at(proof, 'playerTermsKnown'), at(proof, 'open')),
            requires:all(player, at(proof, 'open'), at(proof, 'leadFree'), person(lead)),
            ...timed(2, all(player, at(proof, 'open'), person(lead)), sites.delivery[proof]),
            costs:[item('player', K.log, -1), money(-1), stamina('player', -1)],
            effects:[resource(lead, 'purse', 1), flag(proof, 'accepted', 'player'),
                know(proof, 'cooperation', 'player', `I spent my real log, one native coin and two played minutes helping ${name}'s current load preparation. ${name} received the coin in a separate purse. Their own kit, delivery decision and deadline remain theirs. This aid promises no success.`, lead)]}),
        command(proof, 'refuse_cooperation', {label:`Refuse ${name}'s optional request · keep your supplies`,
            targetId:lead, coLocated:true, participants:['$target'], claim:causalStoryId(proof, 'player_cooperation'),
            visibleWhen:all(at(proof, 'playerTermsKnown'), at(proof, 'open')),
            requires:all(player, at(proof, 'open'), person(lead)),
            effects:[flag(proof, 'accepted', 'player', false),
                know(proof, 'refusal', 'player', `I declined optional aid without signing a delivery promise, losing stock or taking a debt. ${name} retains an independent funded courier plan; refusal does not stop their work or pay me.`, lead)]}),
        npc(proof, 'deliver', lead, {label:`${name} takes the owned kit to Nell · 8 min`, targetId:P.keeper, coLocated:true,
            participants:['$target'], claim:causalStoryId(proof, 'dispatch'), requires:leadDelivery,
            ...timed(8, leadDelivery, sites.delivery[proof]),
            costs:[item(lead, K.kit, -1), item(lead, K.rope, -1), resource(lead, 'purse', -2), resource(lead, 'attention', -1), resource(lead, 'effort', -1), stamina(lead, -2)],
            effects:[item(lead, K.rope, 1, true), item(P.keeper, K.kit, 1), flag(proof, 'delivered', lead), flag(proof, 'delivered', P.keeper),
                know(proof, 'delivery', lead, 'I completed my actual paid delivery before its deadline. My reserved rope returned once; my owned kit is now Nell\'s counted stock.', lead, 'seen', 'observation'),
                know(proof, 'delivery', P.keeper, `${name}'s actual counted kit arrived through their completed current supported job before the deadline. I own that kit now. This receipt claims no outcome for a different person or goal.`, lead, 'seen', 'observation')]}),
        npc(proof, 'request_care', lead, {label:`${name} asks for one supported treatment`,
            requires:all(enrolled, at(proof, 'exists'), eq(`causal.person.${lead}.careSupported`), eq(`causal.person.${lead}.wounded`), eq(`actor.${causalStoryId(proof, 'attacked')}`)),
            effects:[flag(proof, 'careRequested', lead), know(proof, 'care_request', lead, 'I am presently injured and request one ordinary treatment. My request provides no medicine, healing, revival or new protection.', lead, 'seen', 'observation')]}),
        npc(proof, 'prepare_guard', lead, {label:`${name} prepares after the witnessed attack · log + held kit + 3 min`, powerId:SOURCES.guard,
            requires:all(enrolled, at(proof, 'open'), at(proof, 'guardWanted'), at(proof, 'guardSource')),
            ...timed(3, all(enrolled, at(proof, 'open'), person(lead), at(proof, 'guardSource'), at(proof, 'guardWanted')), sites.delivery[proof]),
            costs:[item(lead, K.log, -1), item(lead, K.kit, -1), resource(lead, 'purse', -1), resource(lead, 'attention', -1), resource(lead, 'effort', -1), stamina(lead, -2)],
            effects:[item(lead, K.kit, 1, true), flag(proof, 'guardReady', lead),
                know(proof, 'guard', lead, 'After an actual experienced attack, I used my own log, counted kit, purse and effort for one guarded load preparation. My held kit returned once. I may try my remaining delivery if present body, deadline and cargo still support it; I do not gain an invented attacker identity.', lead, 'seen', 'observation')]}),
        command(proof, 'copy_warning', {label:`Give Roe an actual warning copy · 1 log + 1 coin + 2 min`, targetId:P.witness, coLocated:true,
            participants:['$target'], claim:causalStoryId(proof, 'warning_copy'), visibleWhen:all(at(proof, 'playerTermsKnown'), at(proof, 'open')),
            requires:all(player, at(proof, 'open'), at(proof, 'playerTermsKnown'), person(P.witness)),
            ...timed(2, all(player, at(proof, 'open'), at(proof, 'playerTermsKnown'), person(P.witness)), sites.research),
            costs:[item('player', K.log, -1), money(-1), stamina('player', -1)],
            effects:[resource(P.witness, 'purse', 1), flag(proof, 'copyHeld', P.witness),
                know(proof, 'warning', P.witness, `I received a paid usable copy of the player's actually acquired ${name} delivery terms. One real log supplied its writing surface. I know the limited kit need and deadline; I have no knowledge of an unwitnessed attack.`, 'player'),
                know(proof, 'copy', 'player', 'I spent one real log, one native coin, my body effort and two played minutes to give Roe my earned terms. Roe owns the copy knowledge and received the coin. A copy alone makes no alternative delivery and supplies no kit.', P.witness)]}),
        npc(proof, 'notice_interruption', P.witness, {label:`Roe notices the current on-scene interruption of ${name}'s work`,
            requires:all(enrolled, at(proof, 'open'), at(proof, 'witnessCanObserveInterruption')),
            costs:[resource(P.witness, 'attention', -1)],
            effects:[flag(proof, 'noticed', P.witness), flag(proof, 'warned', P.witness),
                know(proof, 'intervention', P.witness, `I checked the current on-scene interruption of ${name}'s courier work with my own attention. Their current supported delivery cannot proceed now. This observation identifies no unseen attacker and supplies no copy, cargo or extra route.`, P.witness, 'seen', 'observation')]}),
        npc(proof, 'deliver_warning', P.witness, {label:`Roe carries the copied warning and an owned kit · 6 min`, targetId:P.keeper, coLocated:true,
            participants:['$target'], claim:causalStoryId(proof, 'dispatch'), requires:witnessDelivery,
            ...timed(6, witnessDelivery, sites.delivery[proof]),
            costs:[item(P.witness, K.kit, -1), item(P.witness, K.rope, -1), resource(P.witness, 'purse', -2), resource(P.witness, 'attention', -1), resource(P.witness, 'effort', -1), stamina(P.witness, -2)],
            effects:[item(P.witness, K.rope, 1, true), item(P.keeper, K.kit, 1), flag(proof, 'copyDelivered', P.witness), flag(proof, 'delivered', P.keeper),
                know(proof, 'delivery', P.witness, 'I completed the one alternative using my actual copied terms, on-scene knowledge, owned kit, rope, purse and body before the deadline. No replacement person or fresh means appeared.', P.witness, 'seen', 'observation'),
                know(proof, 'delivery', P.keeper, `Roe delivered an actual owned kit and the paid copy of ${name}'s terms before the deadline. I received this real alternative, not ${name}'s personal delivery. Their personal life and unfinished history remain separate.`, P.witness, 'seen', 'observation')]}),
        command(proof, 'hear_source_evidence', {label:`Ask Nell and ${name} to identify the current case · 1 coin + 1 min`, targetId:P.keeper, coLocated:true,
            participants:['$target', lead], visibleWhen:at(proof, 'playerTermsKnown'),
            requires:all(player, at(proof, 'researchSupported'), at(proof, 'playerTermsKnown')),
            ...timed(1, all(player, at(proof, 'researchSupported')), sites.research),
            costs:[money(-1), resource(P.keeper, 'attention', -1)],
            effects:[resource(P.keeper, 'purse', 1), know(proof, 'intervention', 'player', sourceAccounts[proof], P.keeper)]}),
        command(proof, 'request_research', {label:`Fund Nell's actual study · 2 coins`, targetId:P.keeper, coLocated:true,
            participants:['$target', lead], claim:causalStoryId(proof, 'research_request'),
            visibleWhen:all(at(proof, 'playerTermsKnown'), at(proof, 'playerEvidenceKnown')),
            requires:all(player, at(proof, 'researchSupported'), at(proof, 'playerTermsKnown'), at(proof, 'playerEvidenceKnown')),
            costs:[money(-2)], effects:[resource(P.keeper, 'purse', 2), flag(proof, 'noticed', P.keeper),
                know(proof, 'research_request', P.keeper, `The player supplied earned ${name} terms and an actually acquired source or intervention account, plus two coins for one study. I consent to examining the supported current person/source with my own finite means. This receipt is no completed study.`, 'player'),
                know(proof, 'research_funding', 'player', 'Two native coins entered Nell\'s actual separate purse for one accepted current-source study. Nell still has to commit and finish that supported paid work.', P.keeper)]}),
        npc(proof, 'research', P.keeper, {label:`Nell studies ${name}'s actual current case · 4 min`, participants:[lead], powerId:SOURCES.method,
            requires:researchSupport, ...timed(4, researchSupport, sites.research),
            costs:[item(P.keeper, K.log, -1), item(P.keeper, K.kit, -1), resource(P.keeper, 'purse', -1), resource(P.keeper, 'study', -1),
                resource(P.keeper, 'attention', -1), resource(P.keeper, 'effort', -1), stamina(P.keeper, -1)],
            effects:[item(P.keeper, K.kit, 1, true), flag(proof, 'accepted', P.keeper), know(proof, 'research', P.keeper, researchAccounts[proof], P.keeper)]}),
        command(proof, 'hear_research', {label:`Hear Nell's completed ${name} study`, targetId:P.keeper, coLocated:true, participants:['$target'],
            visibleWhen:at(proof, 'researchDone'), requires:all(player, person(P.keeper), at(proof, 'researchDone')),
            effects:[know(proof, 'research', 'player', researchAccounts[proof], P.keeper)]}),
        ...['learn_method','adapt_method'].map(action => command(proof, action, {label:`${action === 'learn_method' ? 'Learn' : 'Adapt your learned'} measured procedure with Nell · 2 coins + held kit/rope + 2 min`,
            targetId:P.keeper, coLocated:true, participants:['$target', lead], claim:action === 'learn_method' ? 'causal.story.method_acquisition' : causalStoryId(proof, 'method_adaptation'),
            visibleWhen:all(at(proof, 'researchDone'), eq(`knowledge.${causalStoryId(proof, 'research')}.understood`)),
            requires:all(lessonSupport, eq(`knowledge.${causalStoryId(proof, 'research')}.understood`), eq('causal.playerMethodOwned', action === 'adapt_method')),
            ...timed(2, all(lessonSupport, eq(`knowledge.${causalStoryId(proof, 'research')}.understood`), ...(action === 'adapt_method' ? [eq('causal.playerMethodSupported')] : [])), sites.research),
            costs:[money(-2), item('player', K.kit, -1), item('player', K.rope, -1), stamina('player', -2), resource(P.keeper, 'teaching', -1), resource(P.keeper, 'attention', -1), stamina(P.keeper, -1)],
            effects:[item('player', K.kit, 1, true), item('player', K.rope, 1, true), resource(P.keeper, 'purse', 2),
                ...(action === 'learn_method' ? [{type:'source', actor:'player', sourceId:SOURCES.method, operation:'grant', origin:'trained', awakened:true, active:true},
                    {type:'power', actor:'player', powerId:SOURCES.method, operation:'learn'}] : []),
                flag(proof, 'methodTaught', P.keeper), flag(proof, 'methodTaught', 'player'), know(proof, 'method', 'player', methodAccount(proof), P.keeper)]})),
        ...(proof === 'mortal' ? [] : [
            command(proof, 'authorize_release', {label:`Ask Nell to authorize this current counter · 1 coin`, targetId:P.keeper, coLocated:true,
                participants:['$target', lead], visibleWhen:at(proof, 'methodTaught'),
                requires:all(player, at(proof, 'methodSupported'), at(proof, 'methodTaught'), eq('causal.playerMethodSupported')),
                costs:[money(-1), resource(P.keeper, 'attention', -1)], effects:[resource(P.keeper, 'purse', 1), flag(proof, 'severAuthorized', P.keeper),
                    know(proof, 'authorization', 'player', 'Nell authorized the learned counter for this present original source after the completed study. Authorization spends no target source and promises no physical victory, delivery or inherited power. Current support still needs a separate actual counter operation.', P.keeper)]}),
            command(proof, 'request_source_release', {label:`Ask ${name} for a consented source release`, targetId:lead, coLocated:true,
                participants:['$target', P.keeper], visibleWhen:at(proof, 'methodTaught'),
                requires:all(player, at(proof, 'methodSupported'), at(proof, 'methodTaught'), at(proof, 'keeperAuthorized'), at(proof, 'consentAvailable')),
                effects:[flag(proof, 'severAuthorized', lead), know(proof, 'release_consent', 'player', `${name} consented with Nell present to one admitted release of this current original source. The source remains active until the separate actual release command succeeds. Consent creates no loot, injury, copied identity or restored delivery.`, lead)]}),
            command(proof, 'sever_job', {label:`Apply the authorized current ${name} counter · held kit + 2 coins + 3 min`, targetId:lead, coLocated:true,
                participants:['$target', P.keeper], powerId:SOURCES.method,
                visibleWhen:eq('causal.hostSeverJob', true), requires:all(player, at(proof, 'canSever')),
                ...timed(3, all(player, at(proof, 'canSever')), sites.research),
                costs:[item('player', K.kit, -1), stamina('player', -2), money(-2)], effects:[],
                description:'Host-only job. Its opted-in completion resolver performs the actual counter and returns the held kit once. Ordinary command dispatch cannot admit this operation.'}),
        ]),
        command(proof, 'care', {label:`Treat consenting injured ${name} · consume 1 kit + held rope + 3 min`, targetId:lead, coLocated:true,
            participants:['$target'], visibleWhen:at(proof, 'playerTermsKnown'),
            requires:all(player, eq(`causal.person.${lead}.careSupported`), eq(`causal.person.${lead}.wounded`),
                eq(`causal.proof.${proof}.careRequested`)),
            ...timed(3, all(player, eq(`causal.person.${lead}.careSupported`), eq(`causal.proof.${proof}.careRequested`)), sites.care),
            costs:[item('player', K.kit, -1), item('player', K.rope, -1), stamina('player', -1)],
            effects:[item('player', K.rope, 1, true), {type:'vital', actor:lead, key:'health', amount:6}, stamina(lead, 2), flag(proof, 'careRequested', lead, false),
                know(proof, 'care', 'player', `I consumed one actual kit and spent three supported played minutes treating ${name}'s consenting current living body. The held rope returned once; ordinary health and stamina recovered within their real maxima. The treatment restores no dead person or removed protection.`, lead, 'seen', 'observation')]}),
        command(proof, 'hear_delivery', {label:'Hear Nell confirm the actual received delivery', targetId:P.keeper, coLocated:true, participants:['$target'],
            visibleWhen:at(proof, 'deliveryKnownToKeeper'), requires:all(player, person(P.keeper), at(proof, 'deliveryKnownToKeeper')),
            effects:[flag(proof, 'delivered', 'player'), know(proof, 'delivery', 'player', 'Nell confirms an actual kit was received for this finite request. The named courier and any copied-warning carrier have their own committed receipts; this received report grants no stock, payment, guarantee or unseen personal outcome.', P.keeper, 'seen')]}),
        command(proof, 'ordinary_followup', {label:'Do paid ordinary packing after this case · log + held kit + 2 coins + 5 min', targetId:P.keeper, coLocated:true,
            participants:['$target'], claim:causalStoryId(proof, 'player_followup'), visibleWhen:at(proof, 'closed'), requires:ordinaryPlayer,
            ...timed(5, ordinaryPlayer, sites.ordinary),
            costs:[item('player', K.log, -1), item('player', K.kit, -1), money(-2), stamina('player', -2), resource(P.keeper, 'attention', -1)],
            effects:[item('player', K.kit, 1, true), item('player', K.kit, 1), resource(P.keeper, 'purse', 2), flag(proof, 'followupDone', 'player'),
                know(proof, 'followup', 'player', 'After this case closed, I paid Nell two native coins and spent my actual log, counted kit, body and five played minutes on ordinary packing. My tool kit returned once and one new useful kit was made from the consumed log. Earlier costs, missed goals and personal outcomes stay committed.', P.keeper, 'seen', 'observation')]}),
        ...[P.witness, P.keeper].map(actorId => npc(proof, actorId === P.witness ? 'witness_followup' : 'keeper_followup', actorId, {
            label:`${actorId === P.witness ? 'Roe' : 'Nell'} continues one funded ordinary packing job · 4 min`,
            requires:all(enrolled, at(proof, 'ordinarySupported'), person(actorId)),
            ...timed(4, all(enrolled, at(proof, 'ordinarySupported'), person(actorId)), sites.ordinary),
            costs:[item(actorId, K.log, -1), item(actorId, K.rope, -1), resource(actorId, 'purse', -1), resource(actorId, 'attention', -1), resource(actorId, 'effort', -1), stamina(actorId, -2)],
            effects:[item(actorId, K.rope, 1, true), item(actorId, K.kit, 1), flag(proof, 'followupDone', actorId),
                know(proof, 'followup', actorId, 'I used my own remaining actual log, held rope, purse, attention, effort and body on one ordinary packing job after the case closed. The rope returned once; the produced kit is my retained property. No vanished person, consumed supply or closed courier goal was restored.', actorId, 'seen', 'observation')]})),
    ];
});

const controllers = [
    ...PROOFS.map(proof => ({id:causalStoryId(proof, 'courier_controller'), revision:1, label:`${PROFILES[proof].name}'s finite current courier choices`, actorId:P[proof], interval:1,
        actions:[{commandId:causalStoryId(proof, 'request_care'), priority:4}, {commandId:causalStoryId(proof, 'prepare_guard'), priority:3}, {commandId:causalStoryId(proof, 'deliver'), priority:1}]})),
    {id:'causal.story.witness_controller', revision:1, label:'Roe\'s copied-knowledge and finite own-means choices', actorId:P.witness, interval:1,
        actions:PROOFS.flatMap(proof => [{commandId:causalStoryId(proof, 'notice_interruption'), priority:6},
            {commandId:causalStoryId(proof, 'deliver_warning'), priority:4}, {commandId:causalStoryId(proof, 'witness_followup'), priority:1}])},
    {id:'causal.story.keeper_controller', revision:1, label:'Nell\'s finite funded study and ordinary work', actorId:P.keeper, interval:1,
        actions:PROOFS.flatMap(proof => [{commandId:causalStoryId(proof, 'research'), priority:4}, {commandId:causalStoryId(proof, 'keeper_followup'), priority:1}])},
];
export const causalStoryDefinitions = freeze({people:causalStoryPeople,
    sites:[...PROOFS.map(proof => ({id:sites.delivery[proof], revision:1, label:`${PROFILES[proof].name}'s one Village dispatch bench`, capacity:1})),
        {id:sites.research, revision:1, label:'Nell\'s current-source study bench', capacity:1},
        {id:sites.care, revision:1, label:'One consenting living-body treatment space', capacity:1},
        {id:sites.ordinary, revision:1, label:'Finite ordinary Village packing bench', capacity:1}],
    powers, commands, controllers:controllers.map(controller=>({...controller,actions:controller.actions.map(action=>{
        const target=commands.find(command=>command.id===action.commandId)?.targetId;
        return target?{...action,targetId:target}:action;
    })})),
    situations:[{id:CAUSAL_STORY_MEETING_ID, revision:1, label:'Meeting the Village couriers',
        context:{worldId:WORLD, instanceId:'frontier.main', continuityId:'base.branch', eraId:'original.causal_story.meeting', regionId:'frontier.village'},
        initialPhase:'met', phases:['met'], participants:['player', ...causalStoryPeople.map(person=>person.id)],
        privateTruth:{meetingOnly:true, provenance:'Original optional meeting; no delivery clock begins here.'}},
        ...PROOFS.map(proof => ({id:causalStoryId(proof, 'situation'), revision:1, label:`${PROFILES[proof].name}'s original observed Village case`,
        context:{worldId:WORLD, instanceId:'frontier.main', continuityId:'base.branch', eraId:`original.causal_story.${proof}`, regionId:'frontier.village'},
        initialPhase:'begun', phases:['begun'], participants:['player', P[proof], P.witness, P.keeper],
        privateTruth:{proofId:proof, courierId:P[proof], keeperId:P.keeper, witnessId:P.witness, playedWindow:36,
            provenance:'Original reversible prototype; no activated source-book world or survival entitlement.'}}))],
});

export function causalStoryFacts(state, context={}) {
    const facts = causalStoryActorFacts(state, context);
    for(const proof of PROOFS) facts[`causal.proof.${proof}.careRequested`] = state.actors?.[P[proof]]?.facts?.[causalStoryId(proof, 'careRequested')] === true;
    return facts;
}
