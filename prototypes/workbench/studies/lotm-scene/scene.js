(()=>{
'use strict';
const root=document.getElementById('lotm-study');
const sections=[...root.querySelectorAll('[data-mode]')];
const settings={text:14};
const clone=x=>JSON.parse(JSON.stringify(x));
function initial(scenario='ready'){return {schema:1,scenario,place:'home',selected:null,known:false,collected:false,money:0,reserve:scenario==='short'?2:12,bread:0,stock:3,served:false,minutes:0,moves:0,commands:0,inspections:0,positions:{home:[7,8],street:[4,8]},notice:'A quiet morning. Read the note on the desk to begin.',reports:['Morning light falls across the shared room.','There is a note on the desk and a small purse by the shelf.']};}
let state=initial(),applying=false;
const labels={desk:'Shopping note',purse:'Household purse',table:'Breakfast table',door:'Front door',bakery:'Bakery counter',home:'Moretti household'};
const subjects=()=>state.place==='home'?['desk','purse','table','door']:['bakery','home'];
const coords={home:{desk:[4,3],purse:[13,3],table:[12,8],door:[18,9]},street:{bakery:[14,3],home:[3,8]}};
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const time=()=>`${String(8+Math.floor(state.minutes/60)).padStart(2,'0')}:${String(state.minutes%60).padStart(2,'0')}`;
function report(text){state.notice=text;state.reports.unshift(text);state.reports=state.reports.slice(0,12);}
function objective(){if(state.served)return 'Breakfast is served. The errand is complete.';if(!state.known)return 'Read the shopping note.';if(!state.collected)return 'Collect the household purse.';if(!state.bread)return 'Buy one loaf at the bakery.';return 'Return home and serve breakfast.';}
function spec(id){
 if(id==='desk')return {title:'A note in familiar handwriting',text:state.known?'The household needs one loaf of bread for breakfast. The bakery is along the street.':'A folded note rests beside the books. Read it to learn what the household needs.',action:'read',label:state.known?'Read again':'Read note',cost:state.known?'Already read · no cost':'1 minute',reason:''};
 if(id==='purse')return {title:'Money for the morning errand',text:state.collected?'The purse is in your coat. Its remaining coins are shown under Money.':`The small purse contains ${state.reserve} pence. Collecting it moves those coins to your carried money.`,action:'collect',label:'Collect purse',cost:'No time cost',reason:state.collected?'You already collected the purse.':''};
 if(id==='table')return {title:'Breakfast for the household',text:state.served?'The loaf has been shared. The household can begin its morning.':'Bring a loaf home and place it on the table. Serving consumes one loaf.',action:'serve',label:'Serve breakfast',cost:'1 loaf · 1 minute',reason:state.served?'Breakfast is already served.':!state.known?'Read the shopping note first.':!state.bread?'You need one loaf of bread.':''};
 if(id==='bakery')return {title:'Bread from the bakery',text:`A fresh loaf costs 4 pence. ${state.stock} remain on the counter.`,action:'buy',label:'Buy one loaf',cost:'4 pence · 2 minutes',reason:state.scenario==='closed'?'The bakery is closed this morning.':!state.stock?'There are no loaves left.':state.money<4?`You need ${4-state.money} more pence.`:''};
 return {title:id==='door'?'Out onto the street':'Back to the household',text:'A short walk connects the bakery and the household. Leaving changes your location.',action:'travel',label:id==='door'?'Go to the street':'Return home',cost:'5 minutes',reason:''};
}
function near(id){const a=state.positions[state.place],b=coords[state.place][id];return b&&Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])<=1;}
function select(id){if(!subjects().includes(id))return;state.selected=id;state.inspections++;state.notice=`${labels[id]} selected.`;render();publish();}
function act(action,walk=false){
 const id=state.selected;if(!id||!subjects().includes(id))return;
 if(walk&&!near(id)){state.notice='Walk next to the selected subject, then interact.';render();return;}
 const s=spec(id);if(s.action!==action)return;
 if(s.reason){state.notice=s.reason;render();publish();return;}
 state.commands++;
 if(action==='read'){if(!state.known){state.known=true;state.minutes++;report('You read the note: bring one loaf home for breakfast.');}else report('The note still asks for one loaf of bread.');}
 if(action==='collect'){state.collected=true;state.money+=state.reserve;state.reserve=0;report(`You collect the purse. You carry ${state.money} pence.`);}
 if(action==='buy'){state.money-=4;state.bread++;state.stock--;state.minutes+=2;report('You pay 4 pence and put one loaf in your bag.');}
 if(action==='serve'){state.bread--;state.served=true;state.minutes++;report('You share the bread at the table. Breakfast is served.');}
 if(action==='travel'){state.place=state.place==='home'?'street':'home';state.selected=null;state.minutes+=5;report(state.place==='home'?'You return to the Moretti household.':'You step onto the street. The bakery is nearby.');}
 render();publish();
}
function detail(mode){const id=state.selected;if(!id)return '<h3>Choose a person or object</h3><p class="muted">Inspect a subject to see what you can do and what it will cost.</p>';
 const s=spec(id),distance=mode==='walk'&&!near(id)?'Walk next to this subject to act.':'';
 return `<h3>${escape(s.title)}</h3><p>${escape(s.text)}</p><p class="muted spaced">${escape(s.cost)}</p><div class="actions"><button type="button" class="commit" data-act="${s.action}" aria-disabled="${!!(s.reason||distance)}">${escape(s.label)}</button><button type="button" data-back>Back · Esc</button></div><p class="small spaced">${escape(s.reason||distance)}</p>`;
}
function inventory(){return `<div class="stat"><span>Money</span><span data-money>${state.money} pence</span></div><div class="stat"><span>Bread</span><span data-bread>${state.bread} loaf${state.bread===1?'':'s'}</span></div>${state.collected?'':'<p class="muted small spaced">The household purse has not been collected.</p>'}${state.scenario==='crowded'?'<details class="spaced"><summary>Other belongings · 24</summary><p>School books, spare shirts, stationery, household odds and ends, and a carefully wrapped long-handled cleaning brush.</p></details>':''}`;}
function reports(){return `<h3>Reports</h3><ol>${state.reports.map(x=>`<li>${escape(x)}</li>`).join('')}</ol>`;}
function player(){return `<aside class="stack player"><section class="region"><h3>You</h3><div class="player-name">Klein Moretti</div><p class="muted small">An ordinary morning in Tingen</p><div class="vital"></div><div class="stat"><span>Time</span><span data-time>${time()}</span></div><p class="muted small spaced">No work under way.</p></section><section class="region"><h3>Inventory</h3>${inventory()}</section><section class="region"><h3>Morning errand</h3><ul class="steps">${[[state.known,'Read the note'],[state.collected,'Collect the purse'],[state.bread>0||state.served,'Buy a loaf'],[state.served,'Serve breakfast']].map(([done,label])=>`<li class="${done?'done':''}">${done?'✓':'○'} ${label}</li>`).join('')}</ul></section></aside>`;}
function art(mode){return `<div class="scene-frame"><canvas width="640" height="384" aria-label="${mode==='walk'?'Walkable':'Clickable'} ${state.place==='home'?'household room':'Tingen street'} scene">${subjects().map(x=>labels[x]).join(', ')}</canvas><div class="scene-caption">${state.place==='home'?'Moretti household · morning':'Tingen · bakery street'}</div>${mode==='hybrid'?subjects().map(id=>{const [x,y]=coords[state.place][id];return `<button type="button" class="hotspot" data-subject="${id}" style="left:${(x+.5)*5}%;top:${(y+.5)/12*100}%">${labels[id]}</button>`;}).join(''):''}</div>`;}
function render(){
 const active=root.contains(document.activeElement)?{mode:document.activeElement.closest('[data-mode]')?.dataset.mode,subject:document.activeElement.dataset.subject,act:document.activeElement.dataset.act,move:document.activeElement.dataset.move,back:document.activeElement.hasAttribute('data-back'),interact:document.activeElement.hasAttribute('data-interact')}:null;
 root.style.setProperty('--text',`${settings.text}px`);
 for(const section of sections){
 const mode=section.dataset.mode,shell=section.querySelector('.game-shell');
 const top=`<div class="game-top"><strong>OOPS · LORD OF THE MYSTERIES</strong><span>${state.place==='home'?'Moretti household':'Tingen street'} · ${time()}</span></div>`;
 const status=`<div class="notice" role="status">${escape(state.notice)}</div>`;
 const list=`<div class="subject-list">${subjects().map(id=>`<button type="button" data-subject="${id}" aria-pressed="${state.selected===id}">${labels[id]}<span>${id==='bakery'?'Fresh bread · 4 pence':id==='purse'?'Coins for the errand':id==='door'||id==='home'?'Travel · 5 minutes':id==='desk'?'Household request':'Share a loaf'}</span></button>`).join('')}</div>`;
 if(mode==='panels')shell.innerHTML=`${top}<div class="game-grid">${player()}<main class="center"><section class="region"><h2>${state.place==='home'?'A morning at home':'Along the bakery street'}</h2><p class="muted spaced">${state.place==='home'?'Books, a modest table and the little objects of a shared life. A note waits on the desk.':'The smell of warm bread carries along the cobbles. Home is a short walk away.'}</p></section><div class="panel-top"><section class="region"><h3>Nearby</h3>${list}</section><section class="region"><h3>Current focus</h3><p class="task-title">${escape(objective())}</p><p class="muted spaced">Find the subject under Nearby, then inspect its action.</p></section></div><section class="region task">${detail(mode)}</section>${status}</main><aside class="region reports">${reports()}</aside></div>`;
 if(mode==='hybrid')shell.innerHTML=`${top}<div class="game-grid">${player()}<main class="center">${art(mode)}<section class="region"><p class="task-title">${escape(objective())}</p><div class="task">${detail(mode)}</div></section>${status}</main><aside class="region reports">${reports()}</aside></div>`;
 if(mode==='walk')shell.innerHTML=`${top}<div class="game-grid walk-grid"><main class="center">${art(mode)}<div class="walk-toolbar"><div class="dpad" aria-label="Movement controls"><button type="button" data-move="0,-1" aria-label="Walk north">↑</button><button type="button" data-move="-1,0" aria-label="Walk west">←</button><button type="button" data-move="0,1" aria-label="Walk south">↓</button><button type="button" data-move="1,0" aria-label="Walk east">→</button><button type="button" data-interact>Interact · E</button></div><span class="small">Arrows / WASD · click scene to walk</span></div><div class="walk-inventory"><span>Bag: ${state.bread} loaf${state.bread===1?'':'s'}</span><span>Money: ${state.money} pence</span><span>Clock: ${time()}</span></div><section class="region"><p class="task-title">${escape(objective())}</p><div class="task">${detail(mode)}</div></section>${status}<p class="muted small">Movement is presentation time. Travel spends 5 minutes, matching the other views.</p></main><aside class="stack"><section class="region"><h3>Nearby subjects</h3>${list}<p class="small muted spaced">Select a subject, then walk next to it. Click its place in the scene for an automatic route.</p></section><section class="region reports">${reports()}</section></aside></div>`;
 draw(section.querySelector('canvas'),mode);
 }
 if(active?.mode){const section=sections.find(x=>x.dataset.mode===active.mode);const target=active.subject?section.querySelector(`[data-subject="${active.subject}"]`):active.act?section.querySelector(`[data-act="${active.act}"]`):active.move?section.querySelector(`[data-move="${active.move}"]`):active.back?section.querySelector('[data-back]'):active.interact?section.querySelector('[data-interact]'):null;target?.focus({preventScroll:true});}
}
function blocked(x,y){if(x<1||x>18||y<2||y>10)return true;return Object.values(coords[state.place]).some(([a,b])=>a===x&&b===y);}
function move(dx,dy){const a=state.positions[state.place],x=a[0]+dx,y=a[1]+dy;if(blocked(x,y)){state.notice='There is something in the way.';render();return;}state.positions[state.place]=[x,y];state.moves++;state.notice='';render();publish();}
function interact(){const id=subjects().find(near);if(id)select(id);else{state.notice='Move next to an object or person to interact.';render();}}
function routeTo(target){const start=state.positions[state.place],queue=[[start,[]]],seen=new Set([start.join(',')]);while(queue.length){const [p,path]=queue.shift();if(Math.abs(p[0]-target[0])+Math.abs(p[1]-target[1])<=1){for(const [dx,dy]of path)move(dx,dy);return true;}for(const d of [[0,-1],[1,0],[0,1],[-1,0]]){const q=[p[0]+d[0],p[1]+d[1]],key=q.join(',');if(!blocked(...q)&&!seen.has(key)){seen.add(key);queue.push([q,[...path,d]]);}}}return false;}
root.addEventListener('click',event=>{
 const b=event.target.closest('button'),section=event.target.closest('[data-mode]'),mode=section?.dataset.mode;
 if(b?.hasAttribute('data-reset')){state=initial(root.querySelector('[data-setting=scenario]').value);render();publish();}
 else if(b?.dataset.subject)select(b.dataset.subject);
 else if(b?.dataset.act)act(b.dataset.act,mode==='walk');
 else if(b?.hasAttribute('data-back')){state.selected=null;render();publish();}
 else if(b?.dataset.move)move(...b.dataset.move.split(',').map(Number));
 else if(b?.hasAttribute('data-interact'))interact();
 else if(event.target.tagName==='CANVAS'&&mode==='walk'){const r=event.target.getBoundingClientRect(),x=Math.floor((event.clientX-r.left)/r.width*20),y=Math.floor((event.clientY-r.top)/r.height*12);const id=subjects().find(k=>Math.abs(coords[state.place][k][0]-x)<=1&&Math.abs(coords[state.place][k][1]-y)<=1);if(id){routeTo(coords[state.place][id]);select(id);}else if(!blocked(x,y)){routeTo([x,y]);}section.querySelector('[data-interact]').focus({preventScroll:true});}
});
root.addEventListener('keydown',event=>{if(event.target.closest('select,input,textarea'))return;const section=event.target.closest('[data-mode]');if(event.key==='Escape'){state.selected=null;render();section?.querySelector('[data-subject]')?.focus();publish();event.preventDefault();return;}if(section?.dataset.mode!=='walk')return;const map={ArrowUp:[0,-1],w:[0,-1],ArrowDown:[0,1],s:[0,1],ArrowLeft:[-1,0],a:[-1,0],ArrowRight:[1,0],d:[1,0]};if(map[event.key]){event.preventDefault();move(...map[event.key]);}if(event.key.toLowerCase()==='e'){event.preventDefault();interact();}});
root.querySelector('[data-setting=scenario]').addEventListener('change',e=>{state=initial(e.target.value);render();publish();});
root.querySelector('[data-setting=text]').addEventListener('change',e=>{settings.text=Number(e.target.value);render();});
function publish(){if(!applying&&window.parent!==window&&location.protocol!=='about:')parent.postMessage({type:'mockup:state',snapshot:clone(state)},location.origin);}
window.addEventListener('message',e=>{if(e.source!==parent||e.origin!==location.origin||e.data?.type!=='mockup:command')return;const {id,command,value}=e.data;applying=true;try{if(command==='restore'){if(value?.schema!==1)throw Error('Invalid fixture');state=clone(value);if(e.data.variant)sections.forEach(s=>s.hidden=s.dataset.mode!==e.data.variant);render();}else if(command==='variant'){sections.forEach(s=>s.hidden=s.dataset.mode!==value);}else if(command==='scenario'){state=initial(value);root.querySelector('[data-setting=scenario]').value=value;render();}else if(command==='text'){settings.text=Number(value);root.querySelector('[data-setting=text]').value=String(value);render();}else if(command==='step'){state.minutes++;render();}else if(command!=='capture')throw Error('Unknown command');parent.postMessage({type:'mockup:reply',id,snapshot:clone(state)},location.origin);}catch(err){parent.postMessage({type:'mockup:reply',id,error:err.message},location.origin);}finally{applying=false;}});
function draw(canvas,mode){if(!canvas)return;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;const r=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
 function person(x,y,coat='#324963'){r(x-9,y+11,22,7,'#0004');r(x-5,y-20,12,11,'#cfaa87');r(x-6,y-23,14,6,'#342a33');r(x-7,y-8,16,18,coat);r(x-6,y+10,5,9,'#252738');r(x+3,y+10,5,9,'#252738');r(x-10,y-5,4,11,'#cfaa87');r(x+9,y-5,4,11,'#cfaa87');}
 if(state.place==='home'){
 r(0,0,640,384,'#242d40');r(22,38,596,315,'#765b50');for(let y=65;y<352;y+=24){r(24,y,592,2,'#5b4847');for(let x=(y%48===17?25:73);x<616;x+=96)r(x,y,1,24,'#947062');}
 r(18,25,604,42,'#4d5362');r(18,64,604,6,'#c2a278');r(18,25,8,330,'#303442');r(614,25,8,330,'#303442');r(18,350,604,10,'#302c39');
 r(62,28,92,36,'#242f40');r(68,30,80,27,'#9ec4cd');r(105,30,5,28,'#d4bb97');r(67,41,81,4,'#d4bb97');r(64,58,88,6,'#dcc397');r(69,70,7,27,'#d4b17e');r(75,70,8,17,'#d4b17e');
 r(78,88,126,55,'#49363b');r(80,84,120,45,'#ad8060');r(87,93,35,22,'#e8d7b1');r(129,94,23,17,'#516773');r(156,89,19,24,'#675176');r(84,134,8,24,'#49363b');r(188,134,8,24,'#49363b');
 r(394,65,99,65,'#493a40');for(let x=402;x<488;x+=13)r(x,75,8,32,['#916655','#6a7975','#b49b70'][x%3]);r(397,112,95,6,'#c19868');r(427,114,20,16,state.collected?'#6d574b':'#d9ba72');
 r(78,228,128,63,'#514356');r(75,219,135,54,'#83928d');r(78,224,32,45,'#c8c3a8');r(109,224,93,45,'#788a91');r(109,244,92,4,'#b1b2a5');
 r(306,218,144,84,'#493b3c');r(302,212,144,74,'#af8059');r(310,220,128,56,'#ba956b');r(353,229,36,31,'#ddd2b4');r(359,235,24,19,state.served?'#b87844':'#bbc1b1');r(311,290,9,24,'#4f3b3e');r(430,290,9,24,'#4f3b3e');
 r(559,270,55,80,'#312e3c');r(565,272,44,75,'#93735a');r(571,278,31,29,'#5b4c4a');r(597,314,4,5,'#dfc18a');
 r(244,124,46,38,'#503e3e');r(250,128,34,25,'#647d71');person(478,227,'#817168');
 }else{
 r(0,0,640,384,'#53696b');r(0,210,640,174,'#8b8880');for(let y=222;y<380;y+=16)for(let x=(y%32?0:14);x<640;x+=32){r(x,y,29,13,'#9d978b');r(x,y+13,30,2,'#746f6d');}
 r(345,61,230,133,'#d1bb8d');r(332,53,256,25,'#4b4147');r(344,38,229,17,'#67515a');for(let x=351;x<572;x+=32)r(x,40,23,5,'#92747a');
 r(365,90,65,52,'#3e5261');r(374,99,47,34,'#aac3bd');r(395,96,5,40,'#726652');r(365,116,65,4,'#726652');r(478,91,65,61,'#3e5261');r(486,98,48,40,'#aac3bd');
 r(352,151,219,12,'#efe3b9');for(let x=352;x<571;x+=32)r(x,151,16,12,'#a77d69');r(358,164,210,27,'#655449');for(let x=373;x<550;x+=31){r(x,166,23,14,'#bc8a4c');r(x+4,163,14,5,'#d6aa67');}
 r(39,112,143,130,'#a8a296');r(28,93,164,26,'#4c4856');r(50,130,36,49,'#374a5a');r(120,130,38,49,'#374a5a');r(81,196,42,56,'#6c5c54');r(87,201,29,43,'#947b60');r(21,246,174,11,'#555361');
 for(const x of [235,603]){r(x,100,5,125,'#394451');r(x-8,88,21,20,'#d7c894');r(x-11,86,27,4,'#424752');}
 person(453,128,'#b4a483');person(259,268,'#6d657d');r(0,352,640,32,'#566f69');for(let x=0;x<640;x+=19)r(x,349+(x%7),8,5,'#80927b');
 }
 if(mode==='walk'){const [x,y]=state.positions[state.place];person(x*32+16,y*32+15,'#394f75');}
 if(state.selected){const [x,y]=coords[state.place][state.selected];c.strokeStyle='#ffe0a2';c.lineWidth=2;c.strokeRect(x*32+2,y*32+2,28,28);}
 if(mode==='walk'){c.fillStyle='#f4ddb2';c.font='12px monospace';for(const id of subjects()){const[x,y]=coords[state.place][id];c.fillText(labels[id],Math.min(470,Math.max(26,x*32-24)),Math.min(342,y*32+43));}}
}
render();if(window.parent!==window&&location.protocol!=='about:')parent.postMessage({type:'mockup:ready'},location.origin);
if(globalThis.Tweak){const tweak=new Tweak({container:root,onChange:render});tweak.addSlider(settings,'text',{label:'Text size',min:14,max:21,step:.5,unit:'px'});}
})();
