import {planHome,homeBenefits,homeCapacity,homeComfort} from '../../../../src/home_model.js';
import {DOMICILE_FURNITURE as F,homeKey} from '../../../../src/home_content.js';
// Home-specific adapter. Stages use the existing model and native commands; no atomic swap invented.
export function furnitureReplacementPorts({view,slot,execute}) {
 const identity=v=>JSON.stringify([v.state,v.context]);
 const definition=key=>F[JSON.parse(key).id];
 function apply(v,request){const r=planHome(v.state,request,v.context),c={...v.context,inventory:{...v.context.inventory},money:r.money,clock:v.context.clock+r.minutes};for(const item of r.items){c.inventory[item.key]=(c.inventory[item.key]||0)+item.amount;if(!c.inventory[item.key])delete c.inventory[item.key];}return {state:r.state,context:c,here:r.state.properties[v.here.id]};}
 function metrics(v){const b=homeBenefits(v.state,v.context);return {rest:b.rest,capacity:homeCapacity(v.here),comfort:homeComfort(v.here).score,xp:b.xp};}
 function read(){const v=view(),s=slot();if(!v.here||!s)return null;const current=v.here.fixtures[s];return {identity:identity(v),title:'Compare & replace · '+s,current:current?'Installed: '+definition(current.key).name:'This slot is empty.',options:Object.entries(F).filter(([id,f])=>f.slot===s&&f.forms.includes(v.context.body.form)&&homeKey(id)!==current?.key).map(([id,f])=>({id,label:`${f.name} · ${v.context.inventory[homeKey(id)]||0} carried`,available:(v.context.inventory[homeKey(id)]||0)>0,reason:(v.context.inventory[homeKey(id)]||0)>0?`Owned and carried. Supplier list price: ${f.price} coins for reference. No purchase charge for this carried item.`:`Not carried. Village supplier list price: ${f.price} coins. Purchase and travel are separate native actions; no home delivery is included.`})),help:'Reviewing spends nothing. Pack first, then review and install. You can stop between steps; the packed item stays in your inventory.'};}
 function preview(id){const v=view(),s=slot(),f=F[id],old=v.here.fixtures[s],q={identity:identity(v),eligible:false,effects:[],summary:'',cost:'',disposition:'',action:'Unavailable'};
 try{if(!f||f.slot!==s||!f.forms.includes(v.context.body.form))throw Error('This furnishing does not fit the selected slot and body.');
 if((v.context.inventory[homeKey(id)]||0)<1)throw Error(`Carry one ${f.name} from the Village supplier first (${f.price} coins list price).`);
 let next=v;if(old)next=apply(next,{type:'remove',home:v.here.id,slot:s});next=apply(next,{type:'install',home:v.here.id,key:homeKey(id)});
 const a=metrics(v),b=metrics(next),skills=[...new Set([...Object.keys(a.xp),...Object.keys(b.xp)])];
 q.effects=[{label:'Home rest recovery',before:'×'+a.rest.toFixed(3),after:'×'+b.rest.toFixed(3)},{label:'Storage capacity',before:a.capacity,after:b.capacity},{label:'Comfort',before:a.comfort,after:b.comfort},...skills.map(k=>({label:k+' learning here',before:'×'+(a.xp[k]||1).toFixed(3),after:'×'+(b.xp[k]||1).toFixed(3)}))];
 q.effects=q.effects.map(r=>({...r,changed:r.before!==r.after}));
 q.eligible=true;q.summary=`${old?definition(old.key).name:'Empty slot'} → ${f.name}. Effects shown after installation, under current conditions.`;
 q.cost=`Installation: ${v.context.money-next.context.money} coins · ${next.context.clock-v.context.clock} played minutes · 1 carried ${f.name}. No purchase is included.`;
 q.disposition=old?`${definition(old.key).name} returns to your pack. This step packs it; the slot is temporarily empty until you review and install.`:'The carried item leaves your pack and becomes installed. Other slots and stored goods stay in place.';
 q.request=old?{type:'remove',home:v.here.id,slot:s}:{type:'install',home:v.here.id,key:homeKey(id)};q.action=old?'1 · Pack current furnishing':'2 · Install selected furnishing';
 }catch(e){q.reason=e.message;q.summary=f?f.name:'Unavailable option';q.cost='No commitment is available.';}
 return q;}
 function commit(q){if(q.identity!==identity(view()))throw Error('Home, inventory or terms changed. Review again.');execute(q.request);return q.request.type==='remove'?'Packed safely. Your old item is in your inventory. Review the selected replacement to install it.':'Installed through the native home command. The current effects above now include this furnishing.';}
 return {read,preview,commit};
}
