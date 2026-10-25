// Earned knowledge of the local training construct, not another Insight currency.
import {check,natural} from './basics.js';
import {AREA_ID,WORLD_ID} from './absorb_p23/encounter_profiles/profile.js';
export const TOWER_INSIGHTS=Object.freeze({
 timing:{label:'Read the opening',floor:1,stat:'attack_points',reason:'Recognize openings in this reed construct’s repeated forms.'},
 footing:{label:'Keep the inside step',floor:3,stat:'agility',reason:'Place the body inside the familiar sweep’s widest arc.'},
 economy:{label:'Spend the short breath',floor:6,stat:'stamina_efficiency',reason:'Avoid unnecessary effort between this construct’s known movements.'},
});
export function validateTowerInsight(v){
 if(v===undefined)return;
 check(v&&Object.keys(v).sort().join(',')==='active,learned'&&Array.isArray(v.learned)&&v.learned.length<=3&&new Set(v.learned).size===v.learned.length&&v.learned.every(id=>Object.hasOwn(TOWER_INSIGHTS,id))&&(v.active===null||v.learned.includes(v.active)),'Invalid earned tower insight.');
}
export function towerInsightEffect(t,c){
 validateTowerInsight(t?.insight);const id=t?.insight?.active,d=TOWER_INSIGHTS[id],b=c.body;
 if(!d||!natural(t.best)||t.best<d.floor||c.world!==WORLD_ID||c.location!==AREA_ID||!b||b.ownerId!=='player'||b.controllerId!=='player'||!(b.hands>=1)||b.mobile===false)return {};
 return {[d.stat]:1+.02*t.best};
}
