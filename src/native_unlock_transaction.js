// Stage access before saving. Publication uses validated component assignments,
// so loading a completed unlock does not replay its item or XP reward.
export function prepareNativeUnlocks(effects, {availabilities, flags, quests = {}, questManager}) {
    const stages = [], unique = new Set();
    for(const e of effects || []) {
        const category = e.kind === "skill" ? "skill" : e.kind === "recipe" ? "recipe" : e.category;
        const key = `${e.kind}:${category || ""}:${e.id}`;
        if(unique.has(key)) continue; unique.add(key);
        if(e.kind === "quest") {
            if(!quests[e.id] || !questManager) throw new Error(`Unknown native quest ${e.id}.`);
            stages.push({effect: e, quest: true});
        } else if(e.kind === "flag") {
            if(!Object.hasOwn(flags, e.id)) throw new Error(`Unknown native flag ${e.id}.`);
            stages.push({effect: e, flag: true});
        } else {
            const component = availabilities[category]?.[e.id];
            if(!component) throw new Error(`Unsupported native unlock ${category}:${e.id}.`);
            stages.push({effect: e, category, component});
        }
    }
    return {
        effects: stages.map(s => s.effect),
        write(envelope) {
            for(const s of stages) {
                if(s.quest) {
                    const quest = envelope.quests?.[s.effect.id];
                    if(!quest) throw new Error("Quest has no saved binding.");
                    if(!quest.is_finished) quest.is_active = true;
                } else if(s.flag) envelope.global_flags[s.effect.id] = true;
                else {
                    if(!Object.hasOwn(envelope.availabilities?.[s.category] || {}, s.effect.id)) throw new Error("Native unlock has no saved component binding.");
                    envelope.availabilities[s.category][s.effect.id] |= 1;
                }
            }
        },
        publish() {for(const s of stages) if(s.quest) {
            if(!questManager.isQuestActive(s.effect.id) && !questManager.isQuestFinished(s.effect.id)) questManager.startQuest({quest_id: s.effect.id, should_inform: false});
        } else if(s.flag) flags[s.effect.id] = true; else s.component.setStatus({is_unlocked: true});}
    };
}
