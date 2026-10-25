export function renderHouseholdBrood({staff,view,el,action}){
 const c=view.context,h=view.homes.find(h=>h.id==='manor');if(!h?.fixtures.qi)return;
 staff.append(el('h3','Cloudseed brood chamber'),el('p','Imported beetles need 60 actual field minutes to hatch, then 120 played minutes to mature. The six-place household chamber keeps each body, parents and inherited qualities. A paid clutch brings eggs, never grown companions.'));
 action(staff,'brood_stock','Place one owned Cloudseed clutch in the chamber',{type:'brood_stock'});
 const v=h.broodPublic;if(!v)return;
 staff.append(el('p',`Allocated grain ${v.food}; ${v.births} actual pairings; ${v.breeding?'automatic pairing permitted':'pairing stopped'}; ${v.stop}. Juveniles grow on the shared clock; adults practice in the actual field. Attending circulation also needs field qi at the bed in the room plan.`));
 action(staff,'brood_feed','Allocate one carried bread ration to a future pairing',{type:'brood_feed'});
 action(staff,'brood_breed',v.breeding?'Stop automatic pairing':'Permit funded automatic pairing',{type:'brood_breed'});
 action(staff,'brood_release','Let the attending creature return to the chamber',{type:'brood_release'});
 for(const r of v.roster){const box=el('details');box.open=v.active===r.id;box.append(el('summary',r.name+(v.active===r.id?' · attending':'')));staff.append(box);box.append(el('p',`${r.name}: ${r.stage}, ${r.sex==='m'?'male':'female'}, rank ${r.rank}, energy ${r.stage==='egg'?'unhatched':r.energy+'/'+r.capacity}, ${r.rest} min rest; ${r.stage==='egg'?r.incubation+'/60 incubation minutes':r.age+' grown minutes'}. ${v.active===r.id?'Attends your circulation.':''}`));
  for(const t of r.traits)box.append(el('small',`${t.label}: ${t.shows}; known alleles ${t.alleles.join(' ')}. `));
  action(box,'brood_attend:'+r.id,'Ask '+r.name+' to attend circulation',{type:'brood_attend',id:r.id});
  action(box,'brood_test:'+r.id,'Examine one hidden quality · 6 coins',{type:'brood_test',id:r.id});
 }
 const adults=v.roster.filter(r=>r.stage==='adult');if(adults.length>1){const row=el('div'),s=document.createElement('select'),d=document.createElement('select');s.setAttribute('aria-label','Brood sire');d.setAttribute('aria-label','Brood dam');for(const [select,sex]of [[s,'m'],[d,'f']])for(const r of adults.filter(r=>r.sex===sex)){const o=el('option',r.name);o.value=r.id;select.append(o);}row.append(s,d);staff.append(row);const choose=()=>action(row,'brood_pair','Choose these actual parents',{type:'brood_pair',sire:s.value,dam:d.value});s.onchange=d.onchange=choose;choose();}
}
