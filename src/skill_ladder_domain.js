// SLC121 host: applies the derived ladder perks (skill_ladder.js) to the hero. Nothing is saved here: the perks are recomputed from
// the current skill levels (native level plus rust and other bonus levels) and REPLACE their buckets, so a reload or a rust swing
// can never stack them (SLC112, SLR43). The deed title lives in character.titles.
import {registerDomain} from './domain_registry.js';
import './skill_records_domain.js';
import {LADDER_SKILLS, readLevels, ladderEffects, titleCounters, whyLines} from './skill_ladder.js';
let ports = null, applied = '';
export function configureSkillLadder(operations) {ports = operations; applied = '';}
const lv = () => ports?.actor?.()?.getLevelableComponent?.() ?? null;
export function applyLadder() {
    const l = lv();
    if(!l) return;
    const levels = readLevels(l), fx = ladderEffects(levels), signature = JSON.stringify([levels, fx]);
    if(signature === applied) return;
    const quiet = applied === '' && !Object.keys(fx.flats).length && !Object.keys(fx.xp_multipliers).length;
    applied = signature;
    l.stats.flat.ladder = {...fx.flats};
    l.xp_bonuses.multiplier.ladder = {...fx.xp_multipliers};
    if(quiet) return;
    ports.actor().updateStatsAndDisplay?.();
    for(const id of LADDER_SKILLS) { const s = ports.skills?.()?.[id]; if(s) ports.redrawSkill?.(s); }
}
registerDomain({id: 'skillLadder', deps: ['skillRecords'],
    load: () => {applied = ''; applyLadder();}, tick: () => applyLadder(), refresh: () => applyLadder(),
    commands: {titleCounters: () => titleCounters(readLevels(lv()))},
    projection: () => ({why: whyLines(readLevels(lv()), ports?.actor?.()?.titles)})});
