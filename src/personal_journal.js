import {validateRegionPostures} from './regional_posture.js';
// Player prose is kept as entered. The atlas reads existing discovery; the
// share card reads current public stats and does not serialize the save.
import {check} from './basics.js';
export const freshJournal=()=>({schema:1,text:''});
export function validateJournal(j){check(j&&Object.keys(j).filter(k=>k!=='regions').sort().join(',')==='schema,text'&&j.schema===1&&typeof j.text==='string'&&j.text.length<=20000,'Invalid personal journal.');validateRegionPostures(j.regions);return j;}
export const writeJournal=(text,prior=freshJournal())=>validateJournal({...prior,schema:1,text});
export function discoveredAtlas(locations={}){
 const known=Object.entries(locations).filter(([,l])=>{try{return !!l.isUnlocked?.();}catch{return false;}}),ids=new Set(known.map(([id])=>id));
 return known.map(([id,l])=>({id,name:l.name||id,routes:[...(l.connected_locations||[]),...(l.parent_location?[{location:l.parent_location}]:[])].map(r=>r.location?.id||r.location||r.id).filter(id=>ids.has(id))})).sort((a,b)=>a.name.localeCompare(b.name));
}
const xml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
export function characterCard({name,world,stats,stage,knownPlaces,palette={background:'Canvas',border:'CanvasText',text:'CanvasText'}}){
 const lines=[name,world,`Health ${Math.round(stats.health)}/${Math.round(stats.max_health)} · Stamina ${Math.round(stats.stamina)}/${Math.round(stats.max_stamina)}`,
 `STR ${stats.strength.toFixed(1)} · AGL ${stats.agility.toFixed(1)} · DEX ${stats.dexterity.toFixed(1)}`,
 `Tempering stage ${stage} · ${knownPlaces} discovered places`];
 return `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="300" viewBox="0 0 720 300"><rect width="720" height="300" fill="${xml(palette.background)}"/><path d="M16 16H704V284H16Z" fill="none" stroke="${xml(palette.border)}" stroke-width="2"/><g fill="${xml(palette.text)}" font-family="monospace" font-size="20">${lines.map((l,i)=>`<text x="32" y="${56+i*46}">${xml(l)}</text>`).join('')}</g></svg>`;
}
