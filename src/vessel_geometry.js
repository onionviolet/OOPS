// Original eight-position circulation ring. Nodes remain in the vessel owner;
// this record says where existing nodes stand, without creating or spending any.
import {check} from './basics.js';
const TYPES=['flow','still','bridge'];
export const freshGeometry=()=>({slots:Array(8).fill(null),preset:null});
const counts=slots=>Object.fromEntries(TYPES.map(id=>[id,slots.filter(v=>v===id).length]));
function validSlots(slots,nodes){return Array.isArray(slots)&&slots.length===8&&slots.every(v=>v===null||TYPES.includes(v))&&Object.entries(counts(slots)).every(([id,n])=>n<=nodes[id]);}
export function validateGeometry(g,nodes){if(g===undefined)return;check(g&&Object.keys(g).sort().join(',')==='preset,slots'&&validSlots(g.slots,nodes)&&(g.preset===null||Array.isArray(g.preset)&&g.preset.length===8&&g.preset.every(v=>v===null||TYPES.includes(v))),'Invalid vessel arrangement.');}
export function geometryView(d){
 const g=d.geometry||freshGeometry();validateGeometry(g,d.nodes);const used=counts(g.slots);
 const resonance=g.slots.reduce((n,a,i)=>{const b=g.slots[(i+1)%8];return n+(a&&b&&a!==b?1:0);},0),flow=Math.max(0,used.flow-used.still),still=Math.max(0,used.still-used.flow);
 return {...structuredClone(g),used,available:Object.fromEntries(TYPES.map(id=>[id,d.nodes[id]-used[id]])),resonance,
  affinity:flow>=2?'flow':still>=2?'still':'balanced',rateBonus:resonance*20+flow*10,oddsBonus:still*10};
}
export function reconcileGeometry(d){
 if(!d.geometry)return;const left={...d.nodes};d.geometry.slots=d.geometry.slots.map(id=>id&&left[id]>0?(left[id]--,id):null);
}
export function arrangeVessel(d,action){
 d.geometry ||= freshGeometry();const g=d.geometry;
 if(action==='clear')g.slots=Array(8).fill(null);
 else if(action==='save')g.preset=[...g.slots];
 else if(action==='apply'){check(g.preset,'Save an arrangement first.');check(validSlots(g.preset,d.nodes),'The saved arrangement needs nodes no longer held by this vessel.');g.slots=[...g.preset];}
 else if(action==='balance'){
  const left={...d.nodes};g.slots=Array(8).fill(null);for(let i=0;i<8;i++){const preferred=i%2?'still':'flow',id=[preferred,'bridge',preferred==='flow'?'still':'flow'].find(t=>left[t]>0);if(id){g.slots[i]=id;left[id]--;}}
 }else{const [slot,index,id]=action.split(':');check(slot==='slot'&&/^[0-7]$/.test(index)&&(id==='empty'||TYPES.includes(id)),'Choose an actual ring position and node.');g.slots[Number(index)]=id==='empty'?null:id;}
 validateGeometry(g,d.nodes);return d;
}
export function fusionPreview(d,all=false){const count=all?Math.min(d.nodes.flow,d.nodes.still):1;return {count,eligible:count>0&&d.nodes.flow>=count&&d.nodes.still>=count,before:{...d.nodes},after:{flow:d.nodes.flow-count,still:d.nodes.still-count,bridge:d.nodes.bridge+count},impurity:d.impurity+count};}
