import {calendarMinutes} from './world_rhythm.js';
// Observer records are the inputs. This never consults the specimen's current
// truth, draws fate, refreshes a reading or treats a foreign clock as local.
export function informationFreshness(save){
    if(!save.cheats?.held?.['freshness-sense'])return [];
    const now=calendarMinutes(save['current time']),world=save.expansion?.actors?.player?.worldId;
    return ['true-appraisal','fate-ledger'].flatMap(id=>(save.cheats.held[id]?.card.state.readings??[]).map(r=>{
        const sourceWorld=id==='true-appraisal'?'base.frontier':r.world;
        return {label:id==='true-appraisal'?`${r.species} observation`:r.label??'Loot reading',at:r.at,
            ageMinutes:sourceWorld===world&&now>=r.at?now-r.at:null};
    })).sort((a,b)=>b.at-a.at).slice(0,8);
}
