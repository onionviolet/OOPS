import {recordLearning} from './recent_learning.js';
import {validateGameplaySnapshot} from "./gameplay_transactions.js";

export function readGameplayActor(actor, skills, context) {
    const progress = actor.getLevelableComponent().skill_progress;
    return {inventory: Object.fromEntries(Object.entries(actor.getItems()).map(([key, entry]) => [key, entry.count])),
        skills: Object.fromEntries(Object.entries(skills).map(([id, skill]) => [id, {
            xp: progress[id]?.total_xp || 0, parent: skill.parent_skill || null,
            // Upstream conditions return a fuzzy number, not always a boolean.
            enabled: !!(skill.can_level && skill.canGainXP(context)), present: Object.hasOwn(progress, id)}])),
        reputation: {...actor.reputation}};
}

// Stage native item reconstruction and XP calculation BEFORE saving. The
// returned publication only assigns validated values; rendering is a later step.
export function prepareGameplayPublication(snapshot, {actors, skills, getItemFromKey, unlockAdapter}) {
    validateGameplaySnapshot(snapshot);
    const staged = [], unlocks = [];
    for(const [actorId, saved] of Object.entries(snapshot)) {
        const actor = actors[actorId];
        if(!actor) throw new Error(`No live actor binding for ${actorId}.`);
        const items = actor.getItems(), nextItems = {};
        for(const [key, count] of Object.entries(saved.inventory)) {
            nextItems[key] = {item: items[key]?.item || getItemFromKey(key), count};
            if(!nextItems[key].item) throw new Error("Item reconstruction failed.");
        }
        const levelable = actor.getLevelableComponent(), progress = {};
        for(const [id, target] of Object.entries(saved.skills)) {
            const old = levelable.skill_progress[id];
            const delta = Math.round((target.xp - (old?.total_xp || 0)) * 100) / 100;
            if(delta < 0) throw new Error("XP removal requires a separate reset adapter.");
            if(!delta) continue;
            const skill = skills[id];
            const next = structuredClone(old || {current_level: 0, total_xp: 0, current_xp: 0,
                total_xp_to_next_lvl: skill.base_xp_cost, xp_to_next_lvl: skill.base_xp_cost});
            const result = skill.add_xp({skillXP: next, xp_to_add: delta, track_dependencies: false});
            if(next.total_xp !== target.xp) throw new Error(`Skill ${id} rejected the planned XP.`);
            if(Object.values(result.unlocks || {}).some(entries => entries.length)) {
                if(!unlockAdapter) throw new Error(`Skill ${id} crosses a content unlock; that reward needs an unlock transaction adapter.`);
                unlocks.push(...unlockAdapter(result.unlocks));
            }
            progress[id] = {next, gains: result.gains};
        }
        staged.push({actor, levelable, items, nextItems, progress, reputation: {...saved.reputation}});
    }
    return {
        unlocks,
        changes: staged.flatMap(s => Object.keys(s.progress)),
        dependencies: staged.flatMap(s => Object.entries(s.progress).flatMap(([id, value]) =>
            Object.keys(value.gains?.xp_multipliers || {}).map(target => ({id, target})))),
        publish() {
            for(const stage of staged) {
                for(const key of Object.keys(stage.items)) delete stage.items[key];
                Object.assign(stage.items, stage.nextItems);
                for(const [id, value] of Object.entries(stage.progress)) {
                    const awarded = value.next.total_xp - (stage.levelable.skill_progress[id]?.total_xp || 0);
                    stage.levelable.skill_progress[id] = value.next;
                    recordLearning(stage.levelable, id, awarded);
                    if(value.gains) stage.actor.addSkillMilestoneBonus(value.gains);
                }
                if(stage.actor.reputation) stage.actor.reputation = stage.reputation;
            }
        }
    };
}
