// Original frontier proposals. One material profile, native item carrier and
// native professional practice source. No foreign names, balance or save store.
export const QUARTZ_SETTING = 'Cloudy quartz setting';
export function registerGearMaterials({templates,ItemComponent}) {
    const item = new ItemComponent({id:QUARTZ_SETTING,name:QUARTZ_SETTING,value:40,component_tier:1,
        description:'A cloudy quartz insert fitted in a small iron mount. Its rigid contact spreads minor impacts; it needs a rigid setting on the item.',tags:{'setting component':true}});
    Object.assign(item,{component_type:'rigid-setting',socket_kind:'rigid-setting',material_label:'cloudy quartz',
        material_family:'mineral',material_strength:125,material_toughness:45,material_weight:25,material_warmth:0});
    templates[QUARTZ_SETTING]=item;
}
export function setCraftsmanPractice(npc) {
    // Authored professional practice supplies a native skill-level bonus. Saved
    // earned XP remains distinct and is never seeded, reapplied or doubled.
    const levels=npc.getLevelableComponent();
    levels.bonus_skill_levels.flat.skills.Forging=15;
    levels.bonus_skill_levels.full.Forging=15;
}
