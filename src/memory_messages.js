import {REGIONAL_POSTURES,regionPosture,postureMemory} from './regional_posture.js';
// Semantic facts survive language changes; old literal memories stay literal.
import {check,natural} from './basics.js';
import {bodyKey} from './craft_body_treatment.js';
export function validateMemoryMessage(e){
 if(e.key===undefined)return;
 const p=e.payload;check(['life.beginning','life.journey','life.reflection','life.root-retuning'].includes(e.key)&&p&&typeof p==='object'&&!Array.isArray(p),'Invalid memory message.');
 if(e.key==='life.root-retuning'){check(Object.keys(p).sort().join(',')==='afterFlow,afterStill,beforeFlow,beforeStill,direction'&&['flow','still'].includes(p.direction)&&['beforeFlow','beforeStill','afterFlow','afterStill'].every(k=>natural(p[k])&&p[k]<=4)&&p.afterFlow-p.beforeFlow===(p.direction==='flow'?1:-1)&&p.afterStill-p.beforeStill===(p.direction==='still'?1:-1),'Invalid remembered root retuning.');return;}
 if(e.key==='life.journey')check(Object.keys(p).join(',')==='world'&&typeof p.world==='string'&&p.world.length<=96,'Invalid remembered world.');
 else if(e.key==='life.beginning')check(Object.keys(p).length===0,'Invalid beginning memory.');
 else check(Object.keys(p).filter(k=>k!=='posture').sort().join(',')==='build,measure,place,variant'&&(p.posture===undefined||Object.hasOwn(REGIONAL_POSTURES,p.posture))&&typeof p.place==='string'&&p.place.length<=160&&['ordinary','trial','medicine'].includes(p.build)&&natural(p.measure)&&natural(p.variant)&&p.variant<3,'Invalid reflection facts.');
}
export function renderMemory(e,locale='english'){
 if(!e.key)return e.text;validateMemoryMessage(e);const p=e.payload,zh=locale==='chinese';
 if(e.key==='life.root-retuning')return zh?`你花费十五分钟、一份药剂和一点凝露，调节了这个身体的灵根：流动 ${p.beforeFlow} → ${p.afterFlow}，静定 ${p.beforeStill} → ${p.afterStill}；药物残留增加两点。`:`You spent fifteen minutes, one dose and one condensate retuning this body: flow ${p.beforeFlow} → ${p.afterFlow}, stillness ${p.beforeStill} → ${p.afterStill}; medicinal residue increased by two.`;
 if(e.key==='life.beginning')return zh?'你记得的人生从这里开始。':'Your remembered life begins here.';
 if(e.key==='life.journey')return zh?`你在 ${p.world} 的天空下安下了新家。`:`You made a new home beneath the skies of ${p.world}.`;
 const lines=zh?{
 ordinary:[`你在${p.place}停下脚步，把今天留在记忆中。`,`在${p.place}，你回想这一天走过的路。`,`你记下${p.place}平常的一天。`],
 trial:[`在${p.place}，你回想训练架上挣得的${p.measure}点试炼品质。`,`你在${p.place}想起那些有分寸的动作，留下了${p.measure}点试炼品质。`,`你记下${p.place}这一天，也记下训练积累的${p.measure}点试炼品质。`],
 medicine:[`在${p.place}，你注意到药片带来的${p.measure}%耐力上限提升。`,`你在${p.place}记下药物调理：耐力上限提升${p.measure}%。`,`你记下${p.place}的这一天；药物调理仍为这个身体提供${p.measure}%耐力上限提升。`]
 }:{
 ordinary:[`You paused in ${p.place} and held this day in memory.`,`In ${p.place}, you traced the paths this day had taken.`,`You recorded an ordinary day in ${p.place}.`],
 trial:[`In ${p.place}, you remembered earning ${p.measure} trial quality at the practice frame.`,`Measured work stayed in your thoughts in ${p.place}: ${p.measure} earned trial quality.`,`You recorded the day in ${p.place}, alongside ${p.measure} trial quality earned through practice.`],
 medicine:[`In ${p.place}, you noticed the tablet conditioning: +${p.measure}% maximum stamina.`,`You recorded your medicinal conditioning in ${p.place}: +${p.measure}% maximum stamina.`,`You held this day in ${p.place} in memory; conditioning still supplied this body with +${p.measure}% maximum stamina.`]
 };
 const text=lines[p.build][p.variant],posture=postureMemory(p.posture,locale);return posture?`${text} ${posture}`:text;
}
export function reflectionMessage(save,place){
 const body=save.expansion?.simulation?.people?.player?.body||{form:save.character?.bio?.race||'human'},medicine=save.craftDepth?.body,quality=save.pledges?.trial?.quality||0;
 const build=quality?'trial':medicine?.binding===bodyKey({body})&&medicine.conditioning?'medicine':'ordinary',measure=build==='trial'?quality:build==='medicine'?medicine.conditioning:0;
 const recent=(save.life_record?.recent||[]).filter(e=>e.key==='life.reflection'&&e.payload.build===build).slice(-2).map(e=>e.payload.variant),variant=[0,1,2].find(n=>!recent.includes(n))??0;
 const posture=regionPosture(save.personal_journal,save.expansion?.actors?.player?.worldId||'base.frontier',save['current location']),message={key:'life.reflection',payload:{place,build,measure,variant,...(posture?{posture}:{})}};return {...message,text:renderMemory(message).slice(0,240).replace(/[\uD800-\uDBFF]$/,'')};
}
