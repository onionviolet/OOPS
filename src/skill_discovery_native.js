import {projectNativeSkillDiscovery} from './skill_discovery.js';
// Read existing progress only. Native getters that create an XP record are not
// needed to decide whether a name, category, tooltip or bar can be disclosed.
export function nativeSkillDiscovery(skill,actor){
 const progress=actor.getLevelableComponent().skill_progress[skill.skill_id];
 const level=progress?.current_level||0;
 const name=Object.entries(skill.names).filter(([at])=>Number(at)<=level).sort(([a],[b])=>Number(b)-Number(a))[0]?.[1]||skill.skill_id;
 return projectNativeSkillDiscovery({id:skill.skill_id,label:name,description:skill.description,
  totalXP:progress?.total_xp||0,visibilityThreshold:skill.visibility_treshold,unlocked:skill.isUnlocked(),eligible:true});
}
