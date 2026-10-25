// One preference owner. Native merchant inventories remain the sole stock.
import {check} from './basics.js';
let state={schema:1,owners:{}};
export const shopLockState=()=>state;
export function validateShopLocks(s){if(s==null)return;check(s.schema===1&&s.owners&&typeof s.owners==='object'&&!Array.isArray(s.owners)&&Object.keys(s.owners).length<=64,'Invalid shop lock preferences.');for(const [id,keys]of Object.entries(s.owners)){check(typeof id==='string'&&id.length>0&&id.length<=160&&!['__proto__','constructor','prototype'].includes(id)&&Array.isArray(keys)&&keys.length<=16&&new Set(keys).size===keys.length,'Invalid kept shop slots.');for(const key of keys){check(typeof key==='string'&&key.length<=12000,'Invalid kept stock key.');const d=JSON.parse(key);check(d&&typeof d==='object'&&!Array.isArray(d)&&(typeof d.id==='string'||d.components&&typeof d.components==='object'),'Invalid kept item identity.');}}}
export function setShopLocks(s){validateShopLocks(s);state=s?structuredClone(s):{schema:1,owners:{}};}
export const keptShopKeys=id=>state.owners[id]||[];
export function changeShopLock(id,key){const next=structuredClone(state),keys=next.owners[id]||[];if(keys.includes(key))next.owners[id]=keys.filter(k=>k!==key);else{check(keys.length<16,'This merchant’s current keep plan has sixteen slots. Release one before adding another.');next.owners[id]=[...keys,key];}if(!next.owners[id].length)delete next.owners[id];validateShopLocks(next);return next;}
export function retainShopStock(id,previous,next){const out={...next};for(const key of keptShopKeys(id)){const row=previous[key],n=typeof row==='number'?row:row?.count;if(n>0)out[key]=row;else delete out[key];}return out;}
