// Builds post-elder save via UI, then adds the audit's disposable progression.
const L=require('./lib.cjs');const fs=require('fs');const OUT=process.argv[2];
(async()=>{await L.launch();const {p}=await L.open({w:1920,h:1080});
 const lr=L.loc(p);
 async function talkAll(){await lr.getByText('Talk to someone',{exact:false}).first().click();await p.waitForTimeout(400);
  await lr.locator('.location_choice_dropdown_expanded').getByText('village elder',{exact:false}).first().click();await p.waitForTimeout(400);
  const seen=new Set();for(let i=0;i<40;i++){const opts=await p.evaluate(()=>[...document.querySelectorAll('#location_related_div *')].filter(e=>getComputedStyle(e).cursor==='pointer'&&e.offsetParent&&e.children.length<4&&!(e.parentElement&&getComputedStyle(e.parentElement).cursor==='pointer')).map(e=>e.innerText.trim()).filter(Boolean));
   const nxt=opts.find(o=>o.startsWith('"')&&!seen.has(o));if(!nxt){const back=opts.find(o=>/go back/i.test(o));if(back){await lr.getByText(/go back/i).first().click();await p.waitForTimeout(300);}break;}
   seen.add(nxt);await lr.getByText(nxt,{exact:true}).first().click();await p.waitForTimeout(250);}return seen.size;}
 console.log('talked',await talkAll());console.log('talked',await talkAll());
 const raw=await L.getSave(p);fs.writeFileSync(OUT+'/after_elder.json',raw);
 const o=JSON.parse(raw);
 const equip=['Leather vest','Goat leather vest','Snakeskin vest','Batrachian vest','Leather pants','Goat leather pants','Wooden shield','Ash wood shield','Rat pelt cape'];
 const other=['Boar tusk','Rat tail','Rat pelt','High quality wolf fang','Wolf pelt','Boar hide','Boar meat','High quality boar tusk','Bear hide','Stale bread','Fresh bread','Bread kwas','Apple','Carrot','Cooked carrot','Potato','Cooked potato','Cooked clam','ABC for kids','Old combat manual'];
 const inv=o.inventories.person.main_character;
 equip.forEach((x,i)=>inv[JSON.stringify({id:x,quality:[60,80,100,120][i%4]})]={count:1+(i%2)});
 other.forEach((x,i)=>inv[JSON.stringify({id:x})]={count:[3,1,12,5,2][i%5]});
 o.global_flags.is_crafting_unlocked=true;o.global_flags.is_gathering_unlocked=true;o.character.money=5000;
 const SK=['Combat','Evasion','Pest killer','Running','Weightlifting','Swimming','Woodcutting','Fishing','Haggling','Persistence','Fieldwork','Crafting','Cooking','Smelting'];
 const sx=o.levels.person.main_character.skill_xp;let n=0;SK.forEach((s,i)=>{if(s in sx){sx[s]=200*(i+1)**2;n++;}});
 console.log('stacks',Object.keys(inv).length,'skills set',n,'skill keys',Object.keys(sx).length);
 fs.writeFileSync(OUT+'/progressed.json',JSON.stringify(o));console.log('errs',p.errs);await L.browser.close();})();
