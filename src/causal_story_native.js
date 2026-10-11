import {BODY_IDS,validateBodyRecord} from './backlog_expansion_body.js';
import {
    CAUSAL_STORY_SCHEMA, CAUSAL_STORY_ENGINE_SCHEMA, CAUSAL_STORY_DEFINITION_REVISION,
    CAUSAL_STORY_NATIVE_DOMAIN, CAUSAL_STORY_WORLD, CAUSAL_STORY_LOCATION,
    CAUSAL_STORY_PROOFS, CAUSAL_STORY_PROFILES, causalStoryPersonIds, causalStoryId,
} from './causal_story_ids.js';
import {CAUSAL_STORY_NATIVE_PEOPLE, causalStoryDefinitions, causalStoryNativeStats} from './causal_story_content.js';
import {validateCausalStories} from './causal_story_core.js';
import {readNativeFighter} from './native_battle.js';
import {readNativeEquipment} from './native_equipment_transaction.js';
import {validateItemKey, validateGameplaySnapshot} from './gameplay_transactions.js';
import {jsonData, stableId} from './simulation_contracts.js';

const assert = (ok, message) => {if(!ok) throw new Error(message);};
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const copy = value => structuredClone(value);
const natural = value => Number.isSafeInteger(value) && value >= 0;
const finite = value => Number.isFinite(value) && Math.abs(value) <= Number.MAX_SAFE_INTEGER;
const shape = (value, fields, label) => assert(object(value) && Object.keys(value).length === fields.length &&
    fields.every(key => Object.hasOwn(value, key)), `Unsupported ${label} fields.`);
const same = (a, b) => {
    if(a === b) return true;
    if(Array.isArray(a) || Array.isArray(b)) return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => same(v, b[i]));
    return object(a) && object(b) && Object.keys(a).length === Object.keys(b).length && Object.keys(a).every(k => Object.hasOwn(b, k) && same(a[k], b[k]));
};
const people = causalStoryPersonIds;
const places = Object.freeze([CAUSAL_STORY_LOCATION, 'Shack']);
const questIds = Object.freeze(CAUSAL_STORY_PROOFS.map(id => causalStoryId(id, 'quest')));
const vitalityKeys = ['health', 'max_health', 'stamina', 'max_stamina'];
const own = (value, key) => object(value) && Object.hasOwn(value, key);

// Preserve the existing consenting Backlog body visit. This supplies no
// Causal human action: its admission still needs the player's mobile human body.
function validateControlledPlayerBody(state,body=state.simulation?.people?.player?.body){
    const current=state.simulation?.people?.player?.body;
    assert(object(body)&&object(current)&&typeof body.id==='string'&&body.id.length>0&&body.controllerId==='player'&&
        typeof body.form==='string'&&body.form.length>0&&Number.isSafeInteger(body.hands)&&body.hands>=0&&typeof body.mobile==='boolean'&&
        ['id','ownerId','controllerId','form','hands','mobile'].every(key=>current[key]===body[key]),
        'Causal context needs the actual retained controlled body and typed capabilities.');
    if(body.id==='native.player.body'&&body.ownerId==='player')return;
    const visit=state.backlog?.body?.possession;
    assert(visit?.status==='active'&&body.id===BODY_IDS.clayBody&&body.ownerId===BODY_IDS.clay&&visit.hostId===BODY_IDS.clay&&
        visit.bodyId===body.id,'A foreign controlled body needs its actual existing consent and possession owner.');
    validateBodyRecord(state.backlog,state);
}

function enabled(state) {
    if(!own(state, 'causalStories')) return false;
    const d = state.causalStories;
    assert(object(d) && d.schema === CAUSAL_STORY_SCHEMA && d.definitionRevision === CAUSAL_STORY_DEFINITION_REVISION &&
        state.schema === CAUSAL_STORY_ENGINE_SCHEMA, 'Causal stories require explicit expansion11/schema1 admission.');
    return true;
}

function vitals(value, label) {
    shape(value, vitalityKeys, `${label} vitals`);
    assert(vitalityKeys.every(key => finite(value[key]) && value[key] >= 0) && value.max_health > 0 && value.max_stamina > 0 &&
        value.health <= value.max_health && value.stamina <= value.max_stamina, `Invalid ${label} vitals.`);
    return value;
}

function reputation(value, label) {
    assert(object(value), `Missing ${label} reputation owner.`);
    for(const [key, amount] of Object.entries(value)) assert(stableId(key) && finite(amount), `Invalid ${label} reputation.`);
    return value;
}

function savedInventory(value, label) {
    assert(object(value), `Missing ${label} native inventory owner.`);
    const counts = {};
    for(const [key, row] of Object.entries(value)) {
        validateItemKey(key); shape(row, ['count'], `${label} inventory entry`);
        assert(natural(row.count) && row.count > 0, `Invalid ${label} native stock count.`); counts[key] = row.count;
    }
    return counts;
}

function savedXP(value, label) {
    shape(value, ['total_xp', 'skill_xp'], `${label} native XP`);
    assert(finite(value.total_xp) && value.total_xp >= 0 && object(value.skill_xp), `Invalid ${label} native XP owner.`);
    // Native skill IDs include names such as "Night vision". Match the native
    // gameplay snapshot's safe-key contract rather than content-definition IDs.
    for(const [key, xp] of Object.entries(value.skill_xp)) assert(typeof key === 'string' && key.length > 0 &&
        !['__proto__', 'constructor', 'prototype'].includes(key) && finite(xp) && xp >= 0, `Invalid ${label} skill XP.`);
    return value;
}

function equipment(value, label) {
    assert(object(value), `Missing ${label} native equipment owner.`);
    for(const [slot, key] of Object.entries(value)) {assert(stableId(slot), `Invalid ${label} equipment slot.`); validateItemKey(key);}
    return value;
}

function person(state, id) {
    const p = state.simulation?.people?.[id], actor = state.actors?.[id];
    assert(object(p) && object(actor) && actor.worldId === CAUSAL_STORY_WORLD && p.inventory === 'native' &&
        (p.definitionId || id) === id && p.definitionRevision === CAUSAL_STORY_DEFINITION_REVISION &&
        ['alive', 'incapacitated', 'dead', 'departed'].includes(p.life) && places.includes(p.location), `Missing actual causal native person ${id}.`);
    assert(p.body?.id === `native.person.${id}.body` && p.body.ownerId === id && p.body.controllerId === id &&
        p.body.form === 'human' && natural(p.body.hands) && p.body.hands <= 2 && typeof p.body.mobile === 'boolean',
        `Causal person ${id} requires its own native body.`);
    vitals(p.vitals, id);
    assert(p.life !== 'dead' || p.vitals.health === 0, 'A dead causal native body cannot retain positive health.');
    assert(p.life !== 'alive' || p.vitals.health > 0, 'An alive causal native body needs positive health.');
    assert(!own(state.simulation?.owners, id), 'A causal native bag cannot have a second simulation inventory owner.');
    return p;
}

function available(state, id) {
    if(!enabled(state)) return false;
    const p = person(state, id);
    return p.life === 'alive' && p.vitals.health > 0 && p.body.mobile !== false;
}

function personProjection(state, id, rep) {
    const p = person(state, id);
    return {life:p.life, location:p.location, vitals:copy(p.vitals), reputation:copy(reputation(rep, id))};
}

export function causalStoryQuestProjection(state, proofId) {
    assert(CAUSAL_STORY_PROOFS.includes(proofId), 'Unknown causal native proof quest.');
    const proof = enabled(state) ? state.causalStories.proofs?.[proofId] : null;
    const received = state.simulation?.knowledge?.player?.[causalStoryId(proofId, 'closure')];
    const started = proof != null, finished = proof?.phase === 'closed' &&
        ['seen', 'interpreted', 'understood'].includes(received?.stage);
    return {is_active:started && !finished, is_finished:finished,
        task_status:[{is_finished:started}, {is_finished:finished}]};
}

function questFlag(q) {return q.is_active || q.is_finished ? 1 | (q.is_finished ? 2 : 0) : 4;}
function taskFlag(q, task) {return q.is_active || q.is_finished ? (task.is_finished ? 2 : 0) : 4;}

export function validateCausalStoryNativeMetadata(value, state) {
    jsonData(value);
    shape(value, ['schema', 'definitionRevision', 'revision', 'initializedAt', 'personIds', 'questIds'], 'causal native metadata');
    assert(enabled(state), 'Causal native metadata needs its optional owner.');
    const d = state.causalStories;
    assert(value.schema === CAUSAL_STORY_SCHEMA && value.definitionRevision === CAUSAL_STORY_DEFINITION_REVISION &&
        natural(value.revision) && value.revision > 0 && value.revision === d.nativeRevision &&
        natural(value.initializedAt) && value.initializedAt === d.enrolledAt && value.initializedAt <= state.clock &&
        same(value.personIds, people) && same(value.questIds, questIds), 'Causal native owner identity, revision or enrollment disagrees.');
    return true;
}

function assertPlaceholder(envelope, state, id) {
    assert(!own(state.actors, id) && !own(state.simulation?.people, id) && !own(state.simulation?.owners, id) &&
        !own(state.simulation?.equipment, id), 'Absent causal stories cannot retain an enrolled native person.');
    const inventory = envelope.inventories?.person?.[id], xp = envelope.levels?.person?.[id], slots = envelope.npc_equipment?.[id];
    if(inventory !== undefined) assert(Object.keys(savedInventory(inventory, id)).length === 0, 'Absent causal placeholders cannot retain stock.');
    if(xp !== undefined) {savedXP(xp, id); assert(xp.total_xp === 0 && Object.values(xp.skill_xp).every(n => n === 0), 'Absent causal placeholders cannot retain XP.');}
    if(slots !== undefined) assert(Object.keys(equipment(slots, id)).length === 0, 'Absent causal placeholders cannot retain equipment.');
    assert(!own(envelope.npcs?.[id], 'causalStory'), 'Absent causal stories cannot retain a native life/reputation projection.');
    for(const category of ['person', 'dialogue']) {
        const flag = envelope.availabilities?.[category]?.[id];
        assert(flag === undefined || flag === 0 || flag === 4, 'Absent causal people must remain unavailable.');
    }
}

export function validateCausalStoryEnvelope(envelope) {
    assert(object(envelope), 'Missing causal save envelope.');
    const state = envelope.expansion || {}, admitted = enabled(state);
    validateCausalStories(state);
    if(!admitted) {
        assert(!own(envelope, CAUSAL_STORY_NATIVE_DOMAIN), 'An absent causal owner cannot retain native metadata.');
        for(const id of people) assertPlaceholder(envelope, state, id);
        for(const id of questIds) {
            const q = envelope.quests?.[id];
            if(q !== undefined) assert(same(q, {is_active:false, is_finished:false, task_status:[{is_finished:false}, {is_finished:false}]}), 'Absent causal quest cannot retain progress.');
            for(const key of [id, `${id}:task:0`, `${id}:task:1`]) {
                const flag = envelope.availabilities?.quest?.[key]; assert(flag === undefined || flag === 0 || flag === 4, 'Absent causal quest must remain unavailable.');
            }
        }
        return true;
    }
    validateCausalStoryNativeMetadata(envelope[CAUSAL_STORY_NATIVE_DOMAIN], state);
    const player = state.simulation?.people?.player;
    validateControlledPlayerBody(state);
    assert(player?.inventory === 'native' && envelope['current location'] === player.location,
        'Causal stories need the actual saved location of the existing controlled body.');
    for(const location of places) assert(object(envelope.locations?.[location]), 'Causal people need the existing Village/Shack location owners.');
    for(const id of people) {
        const p = person(state, id), projection = envelope.npcs?.[id]?.causalStory;
        shape(projection, ['life', 'location', 'vitals', 'reputation'], `${id} causal native projection`);
        vitals(projection.vitals, id); reputation(projection.reputation, id);
        assert(projection.life === p.life && projection.location === p.location && same(projection.vitals, p.vitals), 'Causal native life/location/vitals disagree with their committed owner.');
        savedInventory(envelope.inventories?.person?.[id], id); savedXP(envelope.levels?.person?.[id], id);
        const slots = equipment(envelope.npc_equipment?.[id], id);
        assert(same(slots, state.simulation.equipment?.[id] || {}), 'Causal native equipment differs from its actual simulation projection.');
        assert(envelope.availabilities?.person?.[id] === (available(state, id) ? 1 : 4) &&
            envelope.availabilities?.dialogue?.[id] === 4, 'Causal life/contact availability disagrees with its actual owner.');
    }
    CAUSAL_STORY_PROOFS.forEach((proof, index) => {
        const id = questIds[index], q = causalStoryQuestProjection(state, proof);
        assert(same(envelope.quests?.[id], q) && envelope.availabilities?.quest?.[id] === questFlag(q), 'Causal native quest differs from its committed proof.');
        q.task_status.forEach((task, i) => assert(envelope.availabilities?.quest?.[`${id}:task:${i}`] === taskFlag(q, task), 'Causal native quest task differs from its committed proof.'));
    });
    return true;
}

// Real native constructors are injected to avoid the quests -> main import cycle.
// Registration creates empty locked owners. Only a staged activation seeds goods
// and XP through the existing gameplay publisher; restore/read never grant them.
export function createCausalStoryNativeBindings({NPC, NPCRegistry, Quest, QuestTask, quests, activeQuests, availabilities,
    locations, getItemFromKey, getNativeBody, getNativeContext, getCurrentLocation, getNativeFighters}) {
    assert([NPC, Quest, QuestTask, getItemFromKey, getNativeBody, getNativeContext, getCurrentLocation, getNativeFighters].every(v => typeof v === 'function'), 'Bind actual causal native constructors/readers.');
    assert(NPCRegistry && ['get', 'getAll', 'add'].every(key => typeof NPCRegistry[key] === 'function') &&
        [quests, activeQuests, locations, availabilities?.person, availabilities?.dialogue, availabilities?.quest].every(object), 'Bind actual causal native registries.');
    let registered = false, metadata = null;
    const nativePeople = {}, localQuests = {}, emptyLevels = {};
    const status = (component, value) => Object.assign(component, value);
    const locked = {is_unlocked:false, is_finished:false, is_locked:true};
    const levelData = level => Object.fromEntries(Object.entries(level).filter(([, value]) => typeof value !== 'function'));
    const replaceLevel = (level, value) => {
        for(const key of Object.keys(levelData(level))) delete level[key]; Object.assign(level, value);
    };

    function fighter(npc) {
        // Native stat helpers lazily create zero-XP skill records. Preserve the
        // reader's actual calculation without retaining that placeholder seed.
        const progress = npc.getLevelableComponent().skill_progress, prior = new Set(Object.keys(progress));
        try {return readNativeFighter(npc);}
        finally {for(const key of Object.keys(progress)) if(!prior.has(key) && progress[key].total_xp === 0) delete progress[key];}
    }
    function liveOwner(id) {
        const npc = nativePeople[id], level = npc.getLevelableComponent(), stats = npc.getFullStats();
        const inventory = {};
        for(const [key, row] of Object.entries(npc.getItems())) {
            validateItemKey(key); assert(object(row) && natural(row.count), 'Malformed actual causal native bag.');
            if(row.count) inventory[key] = row.count;
        }
        return {inventory, total_xp:level.total_xp, skill_xp:Object.fromEntries(Object.entries(level.skill_progress).map(([key, row]) => [key, row.total_xp])),
            equipment:readNativeEquipment({[id]:npc})[id], reputation:copy(npc.reputation),
            vitals:Object.fromEntries(vitalityKeys.map(key => [key, stats[key]]))};
    }
    function assertWrittenOwners(envelope, expected) {
        for(const id of people) {
            const saved = expected[id];
            assert(same(savedInventory(envelope.inventories?.person?.[id], id), saved.inventory) &&
                same(savedXP(envelope.levels?.person?.[id], id).skill_xp, saved.skill_xp) &&
                (saved.total_xp === undefined || envelope.levels.person[id].total_xp === saved.total_xp) &&
                same(equipment(envelope.npc_equipment?.[id], id), saved.equipment), 'Shared gameplay/equipment publication did not write the exact causal native owners.');
        }
    }

    function register() {
        if(registered) return;
        const definitions = causalStoryDefinitions.people;
        assert(Array.isArray(definitions) && same(definitions.map(p => p.id), people) && definitions.every(p =>
            p.worldId === CAUSAL_STORY_WORLD && p.location === CAUSAL_STORY_LOCATION && p.inventory === 'native' && p.provision === false), 'Causal native definitions need the exact five unseeded Village people.');
        assert(people.every(id => object(causalStoryNativeStats[id]) && object(CAUSAL_STORY_NATIVE_PEOPLE[id])), 'Missing exact causal native stats/seed definitions.');
        assert(places.every(id => locations[id] && Array.isArray(locations[id].npcs)) &&
            !people.some(id => own(NPCRegistry.getAll(), id)) && !questIds.some(id => own(quests, id)), 'Causal IDs are owned already or existing local owners are missing.');
        for(const definition of definitions) {
            const base = causalStoryNativeStats[definition.id];
            assert(object(base), 'A causal native person lacks its own authored native stats.');
            const npc = new NPC({id:definition.id, name:definition.label, levelable:copy(base), is_unlocked:false,
                description:definition.description || 'An original local participant. Received evidence and committed outcomes own the account.'});
            assert(Object.keys(npc.getItems()).length === 0 && Object.values(npc.getEquipment()).every(v => !v) &&
                npc.getLevelableComponent().total_xp === 0 && Object.keys(npc.getLevelableComponent().skill_progress).length === 0,
                'Native causal placeholders must be empty before enrollment.');
            npc.reputation = {};
            npc.getDialogueComponent().name = definition.id;
            emptyLevels[definition.id] = copy(levelData(npc.getLevelableComponent()));
            status(npc.getAvailabilityComponent(), locked); status(npc.getDialogueAvailability(), locked);
            NPCRegistry.add(definition.id, npc); nativePeople[definition.id] = npc;
        }
        CAUSAL_STORY_PROOFS.forEach((proof, index) => {
            const id = questIds[index], profile = CAUSAL_STORY_PROFILES[proof];
            // Quest currently uses this.id before assigning quest_id. Preserve
            // its historical undefined entries, then register actual owner IDs.
            const placeholderKeys = ['undefined', 'undefined:task:0', 'undefined:task:1'];
            const prior = placeholderKeys.map(key => ({key, present:own(availabilities.quest, key), value:availabilities.quest[key]}));
            const quest = new Quest({quest_id:id, quest_name:`${profile.name}'s local account`, questline:'Village causal accounts',
                quest_description:'Begin the local agreement, then retain its earned outcome. The account does not grant goods or XP on read or restore.', quest_rewards:{},
                quest_tasks:[new QuestTask({task_description:'Begin this actual local proof.', task_condition:{any:{}}, task_rewards:{}}),
                    new QuestTask({task_description:'Retain its committed closure.', task_condition:{any:{}}, task_rewards:{}})]});
            for(const row of prior) {if(row.present) availabilities.quest[row.key] = row.value; else delete availabilities.quest[row.key];}
            quest.id = id; quest.quest_id = id; quests[id] = quest; localQuests[id] = quest;
            status(quest.getAvailabilityComponent(), locked); availabilities.quest[id] = quest.getAvailabilityComponent();
            quest.quest_tasks.forEach((task, i) => {status(task.getAvailabilityComponent(), locked); availabilities.quest[`${id}:task:${i}`] = task.getAvailabilityComponent();});
        });
        registered = true;
    }

    function requireRegistered() {
        assert(registered, 'Register causal native definitions before using their owners.');
        assert(people.every(id => NPCRegistry.get(id) === nativePeople[id] && nativePeople[id].id === id) &&
            new Set(Object.values(nativePeople)).size === people.length, 'The actual causal native person registry binding changed.');
    }
    function assertLiveRevision(state) {
        assert(enabled(state) ? metadata?.revision === state.causalStories.nativeRevision : metadata === null, 'Restore matching causal native metadata before reading or saving.');
    }
    function assertPlayerBody(state,body=getNativeBody()){validateControlledPlayerBody(state,body);}
    function captureLive() {
        return {metadata:copy(metadata), people:Object.fromEntries(people.map(id => {
            const npc = nativePeople[id];
            return [id, {reputation:copy(npc.reputation), is_alive:npc.is_alive, location:{present:own(npc, 'location'), value:npc.location},
                life:{present:own(npc, 'life'), value:npc.life}, availability:copy(npc.getAvailabilityComponent().getStatus()), dialogue:copy(npc.getDialogueAvailability().getStatus()),
                inventory:{...npc.getItems()}, equipment:{...npc.getEquipment()}, level:levelData(npc.getLevelableComponent())}];
        })), quests:Object.fromEntries(questIds.map(id => [id, {availability:copy(localQuests[id].getAvailabilityComponent().getStatus()),
            tasks:localQuests[id].quest_tasks.map(t => copy(t.getAvailabilityComponent().getStatus())), active:{present:own(activeQuests, id), value:activeQuests[id]}}])),
            positions:Object.values(locations).filter(l => Array.isArray(l.npcs)).map(location => ({location, npcs:location.npcs}))};
    }
    function restoreLive(before) {
        metadata = before.metadata;
        for(const [id, row] of Object.entries(before.people)) {
            const npc = nativePeople[id]; npc.reputation = row.reputation; npc.is_alive = row.is_alive;
            for(const [owner, saved] of [[npc.getItems(), row.inventory], [npc.getEquipment(), row.equipment]]) {
                for(const key of Object.keys(owner)) delete owner[key]; Object.assign(owner, saved);
            }
            replaceLevel(npc.getLevelableComponent(), row.level);
            for(const key of ['location', 'life']) {if(row[key].present) npc[key] = row[key].value; else delete npc[key];}
            status(npc.getAvailabilityComponent(), row.availability); status(npc.getDialogueAvailability(), row.dialogue);
        }
        for(const [id, row] of Object.entries(before.quests)) {
            status(localQuests[id].getAvailabilityComponent(), row.availability);
            row.tasks.forEach((task, i) => status(localQuests[id].quest_tasks[i].getAvailabilityComponent(), task));
            if(row.active.present) activeQuests[id] = row.active.value; else delete activeQuests[id];
        }
        for(const row of before.positions) row.location.npcs = row.npcs;
    }
    function applyProjection(state, projections) {
        const admitted = enabled(state);
        for(const id of people) {
            const npc = nativePeople[id], row = admitted ? projections[id] : null;
            npc.reputation = copy(row?.reputation || {});
            if(row) {npc.location = row.location; npc.life = row.life; npc.is_alive = row.life !== 'dead';}
            else {delete npc.location; delete npc.life; npc.is_alive = true;}
            status(npc.getAvailabilityComponent(), {is_unlocked:admitted && available(state, id), is_finished:false, is_locked:!admitted || !available(state, id)});
            status(npc.getDialogueAvailability(), locked);
        }
        for(const location of Object.values(locations)) if(Array.isArray(location.npcs)) {
            location.npcs = [...location.npcs.filter(id => !people.includes(id)), ...people.filter(id => admitted &&
                available(state, id) && state.simulation.people[id].location === location.id)];
        }
        CAUSAL_STORY_PROOFS.forEach((proof, index) => {
            const id = questIds[index], quest = localQuests[id], q = causalStoryQuestProjection(state, proof);
            status(quest.getAvailabilityComponent(), {is_unlocked:q.is_active || q.is_finished, is_finished:q.is_finished, is_locked:!q.is_active && !q.is_finished});
            quest.quest_tasks.forEach((task, i) => status(task.getAvailabilityComponent(), {is_unlocked:false,
                is_finished:q.task_status[i].is_finished, is_locked:!q.is_active && !q.is_finished}));
            if(q.is_active) activeQuests[id] = quest; else delete activeQuests[id];
        });
    }

    function clearOptionalPlaceholders() {
        // Importing a pre-enrollment save clears these five optional owners only.
        // Constructor defaults are capacities, never stocked goods or earned XP.
        for(const id of people) {
            const npc = nativePeople[id];
            for(const owner of [npc.getItems(), npc.getEquipment()]) for(const key of Object.keys(owner)) delete owner[key];
            replaceLevel(npc.getLevelableComponent(), copy(emptyLevels[id]));
        }
    }
    function writeProjection(envelope, state, projections) {
        assert([envelope.npcs, envelope.quests, envelope.availabilities?.person, envelope.availabilities?.dialogue,
            envelope.availabilities?.quest].every(object), 'Missing actual causal save owner namespaces.');
        for(const id of people) {
            assert(object(envelope.npcs[id]), 'Missing actual causal NPC save owner.');
            if(enabled(state)) envelope.npcs[id].causalStory = copy(projections[id]); else delete envelope.npcs[id].causalStory;
            envelope.availabilities.person[id] = available(state, id) ? 1 : 4;
            envelope.availabilities.dialogue[id] = 4;
        }
        CAUSAL_STORY_PROOFS.forEach((proof, index) => {
            const id = questIds[index], q = causalStoryQuestProjection(state, proof);
            envelope.quests[id] = copy(q); envelope.availabilities.quest[id] = questFlag(q);
            q.task_status.forEach((task, i) => {envelope.availabilities.quest[`${id}:task:${i}`] = taskFlag(q, task);});
        });
    }

    function read(state) {
        requireRegistered(); assertLiveRevision(state);
        const body = copy(getNativeBody()), supplied = getNativeFighters(), context = getNativeContext();
        assert(object(supplied) && object(supplied.player?.stats) && finite(supplied.player.attackPower), 'Read the actual native player fighter through its injected reader.');
        const fighters = {player:copy(supplied.player), ...Object.fromEntries(people.map(id => [id, fighter(nativePeople[id])]))};
        if(enabled(state)) {
            assertPlayerBody(state, body);
            for(const id of people) {
                const p = person(state, id), stats = fighters[id].stats;
                assert(vitalityKeys.every(key => stats[key] === p.vitals[key]), 'Project current native causal vitals before exposing its fighter context.');
            }
        }
        return {bound:true, revision:metadata?.revision || 0, body, fighters, currentLocation:getCurrentLocation(),
            localAvailable:!!locations[CAUSAL_STORY_LOCATION]?.canBeStarted?.(context)};
    }

    function stage(plan) {
        requireRegistered(); assert(object(plan) && object(plan.state), 'Missing staged causal native plan.');
        if(!enabled(plan.state)) {
            assert(metadata === null && plan.causalStoryActivation !== true, 'Ordinary publication cannot drop an active causal native owner.');
            return {write() {}, publish() {}};
        }
        const d = plan.state.causalStories, first = plan.causalStoryActivation === true, quotedRevision = metadata?.revision || 0;
        assertPlayerBody(plan.state,plan.state.simulation.people.player.body);
        assert(!first || getNativeBody().form === 'human', 'Initial causal enrollment needs the supported actual human player body.');
        assert(first ? metadata === null && d.nativeRevision === 0 : metadata !== null && d.nativeRevision === quotedRevision,
            'Causal native owner quote is stale or enrollment was repeated.');
        assert(!own(plan, 'causalStoryActivation') || typeof plan.causalStoryActivation === 'boolean', 'Unsupported causal native activation flag.');
        const ownerQuote = Object.fromEntries(people.map(id => [id, liveOwner(id)]));
        const bodyQuote = copy(getNativeBody()), locationQuote = getCurrentLocation();
        validateGameplaySnapshot(plan.gameplay);
        const projections = {}, expected = {};
        for(const id of people) {
            const saved = plan.gameplay?.[id]; assert(saved, 'A causal publication needs all five actual native gameplay owners.');
            projections[id] = personProjection(plan.state, id, saved.reputation);
            const slots = copy(plan.equipment?.[id] || readNativeEquipment({[id]:nativePeople[id]})[id]); equipment(slots, id);
            for(const [slot, key] of Object.entries(slots)) assert(getItemFromKey(key)?.equip_slot === slot, 'A staged causal item does not fit its actual equipment slot.');
            for(const key of Object.keys(saved.inventory)) assert(getItemFromKey(key), 'A staged causal bag references an unavailable actual item.');
            assert(same(slots, plan.state.simulation.equipment?.[id] || {}), 'Stage the matching causal native equipment projection with its actual owner.');
            if(first) {
                const seed = CAUSAL_STORY_NATIVE_PEOPLE[id], definition = causalStoryDefinitions.people.find(p => p.id === id), p = person(plan.state, id);
                assert(same(saved.inventory, seed.inventory) && same(saved.reputation, seed.reputation) && same(slots, seed.equipment) &&
                    p.life === 'alive' && p.location === CAUSAL_STORY_LOCATION && p.bornAt === d.enrolledAt && same(p.vitals, definition.vitals),
                    'Causal activation must stage the exact authored finite native means once.');
                for(const [key, skill] of Object.entries(seed.skills)) assert(saved.skills[key] && same(saved.skills[key], skill), 'Causal activation lacks its exact authored native skill seed.');
                assert(Object.entries(saved.skills).every(([key, skill]) => seed.skills[key] || skill.xp === 0), 'Causal activation cannot invent native earned XP.');
            }
            expected[id] = {inventory:copy(saved.inventory), skill_xp:Object.fromEntries(Object.entries(saved.skills)
                .filter(([, skill]) => skill.xp > 0 || skill.present).map(([key, skill]) => [key, skill.xp])), equipment:slots};
        }
        const next = {schema:CAUSAL_STORY_SCHEMA, definitionRevision:CAUSAL_STORY_DEFINITION_REVISION,
            revision:quotedRevision + 1, initializedAt:d.enrolledAt, personIds:copy(people), questIds:copy(questIds)};
        assert(natural(next.revision), 'Causal native revision overflow.');
        d.nativeRevision = next.revision;
        try {validateCausalStories(plan.state); validateCausalStoryNativeMetadata(next, plan.state);}
        catch(error) {d.nativeRevision = quotedRevision; throw error;}
        const state = copy(plan.state);
        let published = false;
        function current() {
            assert((metadata?.revision || 0) === quotedRevision && !published, 'Causal native publication quote was superseded.');
            assert(same(plan.state.causalStories, state.causalStories) && people.every(id =>
                same(plan.state.simulation.people[id], state.simulation.people[id])), 'Causal staged ownership changed after native admission.');
        }
        return {
            write(envelope) {
                current();
                assert(people.every(id => same(ownerQuote[id], liveOwner(id))) && same(bodyQuote, getNativeBody()) &&
                    locationQuote === getCurrentLocation(), 'The quoted causal native owners/body/location changed before durability.');
                envelope[CAUSAL_STORY_NATIVE_DOMAIN] = copy(next); writeProjection(envelope, state, projections);
                assertWrittenOwners(envelope, expected);
                validateCausalStoryEnvelope(envelope);
            },
            publish() {
                current(); const before = captureLive();
                try {applyProjection(state, projections); metadata = copy(next); published = true;}
                catch(error) {restoreLive(before); throw error;}
            },
        };
    }

    function snapshot(envelope, state) {
        requireRegistered(); assertLiveRevision(state);
        if(!enabled(state)) {delete envelope[CAUSAL_STORY_NATIVE_DOMAIN]; writeProjection(envelope, state, {}); validateCausalStoryEnvelope(envelope); return envelope;}
        assertPlayerBody(state);
        const projections = Object.fromEntries(people.map(id => [id, personProjection(state, id, nativePeople[id].reputation)]));
        envelope[CAUSAL_STORY_NATIVE_DOMAIN] = copy(metadata); writeProjection(envelope, state, projections);
        assertWrittenOwners(envelope, Object.fromEntries(people.map(id => [id, liveOwner(id)])));
        validateCausalStoryEnvelope(envelope); return envelope;
    }

    function restore(envelope) {
        requireRegistered(); validateCausalStoryEnvelope(envelope);
        const state = envelope.expansion || {}, admitted = enabled(state);
        const projections = admitted ? Object.fromEntries(people.map(id => [id, copy(envelope.npcs[id].causalStory)])) : {};
        if(admitted) for(const id of people) {
            for(const key of Object.keys(savedInventory(envelope.inventories.person[id], id))) assert(getItemFromKey(key), 'A restored causal bag references an unavailable item.');
            for(const [slot, key] of Object.entries(envelope.npc_equipment[id])) assert(getItemFromKey(key)?.equip_slot === slot, 'A restored causal item cannot occupy its saved native slot.');
        }
        const next = admitted ? copy(envelope[CAUSAL_STORY_NATIVE_DOMAIN]) : null;
        const before = captureLive();
        try {if(!admitted) clearOptionalPlaceholders(); applyProjection(state, projections); metadata = next;}
        catch(error) {restoreLive(before); throw error;}
    }

    return {register, read, stage, snapshot, restore, validateEnvelope:validateCausalStoryEnvelope,
        ownsPerson:id => people.includes(id), getPerson:id => {requireRegistered(); assert(people.includes(id), 'Not a causal native person.'); return nativePeople[id];},
        getQuest:id => {requireRegistered(); assert(questIds.includes(id), 'Not a causal native quest.'); return localQuests[id];}};
}
