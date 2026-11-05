(()=>{
'use strict';
const root=document.getElementById('lotm-case'),views=[...root.querySelectorAll('[data-mode]')],settings={text:14};
const clone=x=>JSON.parse(JSON.stringify(x));
const points={latch:[3,4],witness:[5,9],residue:[14,4],kit:[3,7],cover:[10,8],exit:[2,10],threat:[16,8]};
const labels={latch:'Damaged latch',witness:'Night porter',residue:'Sealed cabinet',kit:'Field kit',cover:'Crate shelter',exit:'Street exit',threat:'Approaching figure',notebook:'Case notebook'};
const clues={latch:{label:'Fresh tool marks',kind:'OBSERVED · physical',source:'Latch examination',text:'Fresh scoring crosses older rust. Someone worked on the fastening recently.'},witness:{label:'A disputed sound',kind:'REPORTED · unverified',source:'Night porter',text:'The porter recalls a scrape near the cabinet, but could not see its source.'},residue:{label:'An unusual trace',kind:'OBSERVED · Spirit Vision',source:'Your examination',text:'A faint disturbance gathers around the cabinet. This does not identify its cause.'}};
function initial(scenario='investigate'){const combat=scenario==='combat';return {schema:2,scenario,evidence:combat?['latch','witness','residue']:[],hypothesis:combat,focus:combat,spirit:scenario==='low'?2:10,hp:12,ammo:2,turn:0,pressure:combat?3:0,phase:combat?'combat':'investigation',enemy:8,cover:false,selected:'notebook',position:[7,10],moves:0,notice:combat?'A figure is approaching. Choose a response before committing a turn.':'The porter has reported a disturbance. Establish what you know before choosing a response.',reports:[combat?'Prepared confrontation fixture: evidence compared and focus established.':'Case opened: a disturbance in a Tingen storeroom.'],outcome:null};}
let state=initial(),applying=false;
const subjects=()=>['latch','witness','residue','kit','cover','exit',...(state.phase==='combat'?['threat']:[])];
function log(t){state.notice=t;state.reports.unshift(t);state.reports=state.reports.slice(0,9);}
function known(id){return state.evidence.includes(id);}
function near(id){const p=points[id];return !p||Math.abs(state.position[0]-p[0])+Math.abs(state.position[1]-p[1])<=1;}
function objective(){return state.outcome?`Case ended: ${state.outcome}.`:state.phase==='combat'?'An approaching figure is closing in. Evidence, resources and an escape route matter.':state.evidence.length>=2&&!state.hypothesis?'Compare the evidence in your notebook.':'Gather evidence, prepare, and watch the rising disturbance.';}
const ended=()=>state.phase==='ended';
function options(id){
 const closed=ended()?'This case has ended. Reset to try another approach.':'';
 const done=id=>known(id)?'Already recorded. Inspection and notebook reading do not spend a turn.':'';
 let list=[];
 if(id==='latch')list=[{id:'examine',label:'Examine latch',cost:'1 turn',reason:done('latch')}];
 if(id==='witness')list=[{id:'ask',label:'Ask about the disturbance',cost:'1 turn',reason:done('witness')}];
 if(id==='residue')list=[{id:'vision',label:'Examine with Spirit Vision',cost:'3 spirituality · 1 turn',reason:known('residue')?done('residue'):state.spirit<3?'Need 3 spirituality.':''}];
 if(id==='kit')list=[{id:'prepare',label:'Establish focus',cost:'2 spirituality · 1 turn',reason:state.focus?'Focus is already established.':state.spirit<2?'Need 2 spirituality.':''}];
 if(id==='notebook')list=[{id:'compare',label:'Compare the accounts',cost:'No turn cost',reason:state.hypothesis?'Working hypothesis already recorded.':state.evidence.length<2?'Record at least two different sources first.':''}];
 if(id==='cover')list=[{id:'brace',label:'Take shelter behind crates',cost:'1 turn · incoming harm reduced this turn',reason:''}];
 if(id==='exit')list=[{id:'withdraw',label:'Withdraw with your notes',cost:state.phase==='combat'?'1 turn · exposed withdrawal costs 2 health; shelter avoids that hit':'1 turn · ends the case with current evidence',reason:''}];
 if(id==='threat')list=[{id:'contain',label:'Attempt prepared containment',cost:'4 spirituality · 1 turn',reason:!state.hypothesis?'Compare at least two sources in the notebook first.':!state.focus?'Establish focus with the field kit first.':state.spirit<4?'Need 4 spirituality.':''},{id:'fire',label:'Fire a shot',cost:'1 round · 1 turn · 4 harm; surviving threat retaliates for 3',reason:state.ammo<1?'No ammunition remains.':''}];
 return list.map(x=>({...x,reason:closed||x.reason}));
}
const descriptions={latch:'Inspect the fastening for a physical account of what happened.',witness:'Ask what the porter actually heard. A statement is not direct observation.',residue:'Look for an unusual trace. Perception supplies evidence, not an automatic verdict.',kit:'Settle your breathing and arrange the prepared tools. Focus supports a later attempt.',cover:'Shelter changes your exposure. It can help you leave without taking the exposed-withdrawal hit.',exit:'Keep the evidence you have gathered and leave. You can choose an incomplete conclusion.',threat:'The visible figure is about to reach you. In this fixture its next retaliation causes 3 harm.',notebook:'Keep observations, testimony and inference distinct. Comparing sources can support a working response without proving the cause.'};
function commit(action,walk){
 const id=state.selected,offer=options(id).find(x=>x.id===action);if(!offer)return;
 if(offer.reason){state.notice=offer.reason;render();publish();return;}
 if(walk&&!near(id)){state.notice='Move next to the subject before committing. The notebook is available anywhere.';render();return;}
 let spent=action!=='compare',wasCombat=state.phase==='combat',sheltered=action==='brace';
 if(action==='examine'){state.evidence.push('latch');log('Observed: recent scoring crosses older rust on the latch.');}
 if(action==='ask'){state.evidence.push('witness');log('Reported: the porter heard a scrape but did not see its source.');}
 if(action==='vision'){state.spirit-=3;state.evidence.push('residue');log('Observed through Spirit Vision: an unusual trace near the cabinet. Cause remains uncertain.');}
 if(action==='prepare'){state.spirit-=2;state.focus=true;log('Focus established. A prepared containment attempt now has its support.');}
 if(action==='compare'){state.hypothesis=true;log('Working hypothesis recorded: investigate the cabinet as a focus. The cause remains unconfirmed.');}
 if(action==='brace'){state.cover=true;log('You take shelter behind the crates. Your next exposed withdrawal can avoid its hit.');}
 if(action==='withdraw'){if(wasCombat&&!state.cover)state.hp-=2;state.phase='ended';state.outcome=state.hp<=0?'withdrawal failed':'withdrawn';log(`You leave with ${state.evidence.length} recorded sources${wasCombat&&!state.cover?' and lose 2 health during withdrawal':''}. The case remains unresolved.`);}
 if(action==='contain'){state.spirit-=4;state.enemy=0;state.phase='ended';state.outcome='contained';log('The prepared attempt holds in this fixture. The immediate threat is contained; your notes still do not prove its ultimate cause.');}
 if(action==='fire'){state.ammo--;state.enemy=Math.max(0,state.enemy-4);log('You fire. The visible threat takes 4 harm.');if(!state.enemy){state.phase='ended';state.outcome='stopped';log('The immediate threat is stopped. Force has not explained the disturbance.');}}
 if(spent){state.turn++;state.pressure++;}
 if(wasCombat&&!ended()){const damage=sheltered?1:3;state.hp=Math.max(0,state.hp-damage);log(`${state.notice} The figure retaliates: ${damage} harm.${sheltered?' Shelter reduced the hit.':''}`);if(!sheltered)state.cover=false;if(state.hp<=0){state.phase='ended';state.outcome='incapacitated';log('You can no longer continue. Reset the fixture to compare another response.');}}
 if(state.phase==='investigation'&&state.pressure>=3){state.phase='combat';log(`${state.notice} Footsteps resolve into an approaching figure. Your next committed turn can provoke retaliation.`);}
 render();publish();
}
function choose(id){if(id!=='notebook'&&!subjects().includes(id))return;state.selected=id;render();publish();}
function evidence(board=false){return `<div class="${board?'case-board':'evidence-list'}">${Object.keys(clues).map(id=>known(id)?`<div class="evidence-entry"><div class="tag">${clues[id].kind}</div><p>${clues[id].label}</p><p class="hint">${clues[id].text}</p><p class="tagged">Source: ${clues[id].source}</p></div>`:`<div class="evidence-entry"><p class="muted">${id==='witness'?'Testimony not recorded':id==='residue'?'Trace not examined':'Latch not examined'}</p></div>`).join('')}${state.hypothesis?'<div class="link-line">INFERENCE · Cabinet is a working focus, not a confirmed cause.</div>':''}</div>`;}
function detail(mode){const id=state.selected;if(!id)return '<h3>Choose a subject</h3><p>Select a clue, tool, threat or exit.</p>';
 return `<h3>${labels[id]}</h3><p>${descriptions[id]}</p>${id==='notebook'?evidence(mode==='hybrid'):known(id)?`<p class="tagged">${clues[id].kind} · ${clues[id].text}</p>`:''}<div class="case-actions">${options(id).map(x=>{const reason=x.reason||(mode==='walk'&&!near(id)?'Move next to this subject first.':'');return `<div class="action-line"><button type="button" data-act="${x.id}" aria-disabled="${!!reason}">${x.label}</button><span class="hint">${x.cost}</span>${reason?`<span class="hint">${reason}</span>`:''}</div>`;}).join('')}</div><div class="actions"><button type="button" data-back>Back · Esc</button></div>`;
}
function status(){return `<div class="stat"><span>Health</span><span>${state.hp} / 12</span></div><div class="stat"><span>Spirituality</span><span>${state.spirit} / 10</span></div><div class="stat"><span>Rounds</span><span>${state.ammo}</span></div><div class="stat"><span>Turns committed</span><span>${state.turn}</span></div><div class="stat"><span>Focus</span><span>${state.focus?'Established':'Unprepared'}</span></div>${state.phase==='combat'?`<div class="threat-line spaced">Threat: ${state.enemy} / 8<br>Next retaliation: 3 harm</div>`:ended()?`<p class="spaced">${state.outcome}</p>`:`<p class="spaced">Disturbance: ${state.pressure} / 3</p><p class="hint">At 3, the situation escalates. Selecting and reading spend no turn.</p>`}`;}
function list(){return `<div class="subject-list">${[...subjects(),'notebook'].map(id=>`<button type="button" data-subject="${id}" aria-pressed="${state.selected===id}">${labels[id]}${known(id)?'<span>Evidence recorded</span>':''}</button>`).join('')}</div>`;}
function scene(mode){return `<div class="scene-frame"><canvas width="640" height="400" aria-label="Gaslit storeroom cutaway with cabinet, witness, shelter and exit">Storeroom subject positions</canvas><div class="scene-caption">TINGEN · THE LAMPLIGHT CASE</div>${mode==='hybrid'?subjects().map(id=>{const[x,y]=points[id];return `<button type="button" class="hotspot" data-subject="${id}" aria-pressed="${state.selected===id}" style="left:${(x+.5)*5}%;top:${(y+.5)/12.5*100}%">${labels[id]}</button>`;}).join(''):''}</div>`;}
function movement(){return '<div class="movement"><button type="button" data-move="0,-1" aria-label="Walk north">↑</button><button type="button" data-move="-1,0" aria-label="Walk west">←</button><button type="button" data-move="0,1" aria-label="Walk south">↓</button><button type="button" data-move="1,0" aria-label="Walk east">→</button><button type="button" data-interact>Interact · E</button><button type="button" data-subject="notebook">Notebook</button><span class="hint">WASD / arrows · click a subject to route</span></div>';}
function render(){
 const f=document.activeElement,section=f?.closest('[data-mode]'),anchor=section&&{mode:section.dataset.mode,subject:f.dataset.subject,act:f.dataset.act,move:f.dataset.move,interact:f.hasAttribute('data-interact')};
 root.style.setProperty('--text',settings.text+'px');
 for(const v of views){const mode=v.dataset.mode,game=v.querySelector('.game-shell');game.classList.toggle('cutaway',mode==='walk');
 const head=`<div class="game-top"><strong class="case-top">OOPS / NIGHT WATCH CASE FILE</strong><span>${state.phase.toUpperCase()} · Turn ${state.turn}</span></div>`;
 const left=`<aside class="case-sidebar"><section class="region"><h3>Klein Moretti</h3>${status()}</section><section class="region"><h3>Case progress</h3><p>${state.evidence.length} sources recorded</p><p class="hint">${state.hypothesis?'Working hypothesis recorded':'No inference committed'}</p><button type="button" class="spaced" data-subject="notebook">Open notebook</button></section></aside>`;
 const right=`<aside class="case-sidebar"><section class="region"><h3>Subjects</h3>${list()}</section><section class="region reports"><h3>Reports</h3><ol>${state.reports.slice(0,5).map(t=>`<li>${t}</li>`).join('')}</ol></section></aside>`;
 const task=`<section class="region case-task">${detail(mode)}</section>`;
 let middle=mode==='panels'?`<section class="region"><h2>The storeroom after dark</h2><p class="spaced">Gaslight catches on a damaged latch. The porter waits near the stairs. A tall cabinet stands beneath the windows.</p><p class="muted spaced">The situation advances on committed actions. Review notes and costs before choosing.</p></section>${task}`:`<div class="case-visual"><div class="stack">${scene(mode)}${mode==='walk'?movement():''}<p class="hint">${mode==='walk'?'Movement changes position, not turns. Interaction requires proximity.':'Click a subject in the scene. Inspection spends no turn.'}</p></div>${task}</div>`;
 game.innerHTML=`${head}<div class="case-grid">${left}<main class="case-main"><section class="region"><p class="task-title">${objective()}</p></section>${middle}<div class="notice" role="status">${state.notice}</div></main>${right}</div>`;draw(game.querySelector('canvas'),mode);
 }
 if(anchor){const s=views.find(x=>x.dataset.mode===anchor.mode);const q=anchor.subject?`[data-subject="${anchor.subject}"]`:anchor.act?`[data-act="${anchor.act}"]`:anchor.move?`[data-move="${anchor.move}"]`:anchor.interact?'[data-interact]':null;if(q)s.querySelector(q)?.focus({preventScroll:true});}
}
function blocked(x,y){return x<1||x>18||y<3||y>11||Object.entries(points).some(([id,p])=>id!=='threat'&&p[0]===x&&p[1]===y)||(x>=8&&x<=11&&y>=6&&y<=7);}
function move(dx,dy){const[x,y]=state.position;if(blocked(x+dx,y+dy))return;state.position=[x+dx,y+dy];state.moves++;render();publish();}
function route(target){const queue=[[state.position,[]]],seen=new Set([state.position.join(',')]);while(queue.length){const[p,path]=queue.shift();if(Math.abs(p[0]-target[0])+Math.abs(p[1]-target[1])<=1){for(const d of path)move(...d);return true;}for(const d of [[0,-1],[1,0],[0,1],[-1,0]]){const n=[p[0]+d[0],p[1]+d[1]],k=n.join(',');if(!blocked(...n)&&!seen.has(k)){seen.add(k);queue.push([n,[...path,d]]);}}}return false;}
function interact(){const id=subjects().find(near);if(id)choose(id);else{state.notice='Move next to a subject to interact.';render();}}
root.addEventListener('click',e=>{const b=e.target.closest('button'),v=e.target.closest('[data-mode]');if(b?.hasAttribute('data-reset')){state=initial(root.querySelector('[data-setting=scenario]').value);render();publish();}else if(b?.dataset.subject)choose(b.dataset.subject);else if(b?.dataset.act)commit(b.dataset.act,v?.dataset.mode==='walk');else if(b?.dataset.move)move(...b.dataset.move.split(',').map(Number));else if(b?.hasAttribute('data-interact'))interact();else if(b?.hasAttribute('data-back')){state.selected=null;render();publish();}else if(e.target.tagName==='CANVAS'&&v?.dataset.mode==='walk'){const r=e.target.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*20,y=(e.clientY-r.top)/r.height*12.5;const id=subjects().find(k=>Math.abs(points[k][0]+.5-x)<1.5&&Math.abs(points[k][1]+.5-y)<1.5);if(id){route(points[id]);choose(id);}else route([Math.floor(x),Math.floor(y)]);v.querySelector('[data-interact]').focus({preventScroll:true});}});
root.addEventListener('keydown',e=>{if(e.target.closest('select,input'))return;const v=e.target.closest('[data-mode]');if(e.key==='Escape'){state.selected=null;render();v?.querySelector('[data-subject]')?.focus();publish();e.preventDefault();}if(v?.dataset.mode!=='walk')return;const d={ArrowUp:[0,-1],w:[0,-1],ArrowDown:[0,1],s:[0,1],ArrowLeft:[-1,0],a:[-1,0],ArrowRight:[1,0],d:[1,0]}[e.key];if(d){e.preventDefault();move(...d);}if(e.key.toLowerCase()==='e'){e.preventDefault();interact();}});
root.querySelector('[data-setting=scenario]').onchange=e=>{state=initial(e.target.value);render();publish();};root.querySelector('[data-setting=text]').onchange=e=>{settings.text=Number(e.target.value);render();};
function publish(){if(!applying&&parent!==window&&location.protocol!=='about:')parent.postMessage({type:'mockup:state',snapshot:clone(state)},location.origin);}
window.addEventListener('message',e=>{if(e.source!==parent||e.origin!==location.origin||e.data?.type!=='mockup:command')return;const{id,command,value,variant}=e.data;applying=true;try{if(command==='restore'){if(value?.schema!==2)throw Error('Unsupported fixture');state=clone(value);if(variant)views.forEach(v=>v.hidden=v.dataset.mode!==variant);render();}else if(command==='variant')views.forEach(v=>v.hidden=v.dataset.mode!==value);else if(command==='scenario'){state=initial(value);root.querySelector('[data-setting=scenario]').value=value;render();}else if(command==='text'){settings.text=Number(value);render();}else if(command==='step'){state.notice='Time advances through committed actions in this study.';render();}else if(command!=='capture')throw Error('Unknown command');parent.postMessage({type:'mockup:reply',id,snapshot:clone(state)},location.origin);}catch(err){parent.postMessage({type:'mockup:reply',id,error:err.message},location.origin);}finally{applying=false;}});
function draw(canvas,mode){if(!canvas)return;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;
 const rect=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(x,y,w,h);},poly=(pts,color)=>{c.fillStyle=color;c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();};
 rect(0,0,640,400,'#0b1725');
 // Lithographic wall, brass ribs and tall gaslit windows, not a farm-town tileset.
 rect(18,16,604,112,'#263f49');for(let x=24;x<620;x+=25)rect(x,20,1,104,'#46606a');rect(18,120,604,8,'#9c825e');
 for(const x of [65,219,373,527]){rect(x-5,27,58,76,'#0b1e31');rect(x,30,48,65,'#677d8e');rect(x+5,34,37,55,'#a7a8b6');rect(x+22,30,4,66,'#344a58');rect(x,62,48,3,'#344a58');poly([[x+4,98],[x+41,98],[x+76,215],[x-26,215]],'#a7a8b616');}
 poly([[19,129],[621,129],[621,377],[19,377]],'#263c3f');for(let y=136;y<378;y+=22)for(let x=22;x<620;x+=42){rect(x+(y%44?0:20),y,39,19,(x+y)%3?'#344b4b':'#3b5250');rect(x+(y%44?0:20),y+18,39,1,'#62706b');}
 // Long shadows give depth without hiding interactable labels.
 poly([[340,220],[472,215],[546,340],[389,337]],'#0a1629a0');poly([[88,130],[140,128],[196,210],[120,211]],'#111a2ba0');
 rect(70,125,63,57,'#19232c');rect(76,128,51,47,'#896b50');rect(81,134,40,32,'#50666b');rect(115,154,7,4,'#d5bb86');rect(102,161,22,2,'#d7b690');
 // Cabinet and the field desk.
 rect(423,100,74,104,'#141f2b');rect(429,104,64,92,'#5b4d4a');rect(434,110,25,75,'#284a50');rect(464,110,24,75,'#284a50');rect(457,149,8,5,'#b7a176');rect(426,198,72,8,'#9b7e59');
 rect(72,221,70,29,'#9b815b');rect(79,250,5,30,'#4f4b47');rect(130,250,5,30,'#4f4b47');rect(85,224,25,15,'#d4c7a2');rect(115,224,15,13,'#92719d');
 // A substantial blocked crate footprint, shared with movement geometry.
 rect(254,190,136,63,'#14232c');poly([[254,190],[276,175],[408,175],[389,190]],'#a08b68');poly([[389,190],[408,175],[408,234],[389,253]],'#4b514a');rect(258,193,128,54,'#75694f');for(const x of [268,304,342,378])rect(x,195,3,50,'#aa9269');rect(258,207,128,3,'#434c46');rect(258,233,128,3,'#434c46');
 function person(x,y,color,hat=true){poly([[x-9,y+12],[x+10,y+12],[x+28,y+35],[x+3,y+36]],'#08162688');rect(x-5,y-22,11,11,'#b8a98d');if(hat){rect(x-10,y-25,21,4,'#152333');rect(x-6,y-31,13,7,'#253745');}poly([[x-7,y-10],[x+8,y-10],[x+13,y+14],[x-12,y+14]],color);rect(x-6,y+14,4,10,'#172431');rect(x+4,y+14,4,10,'#172431');rect(x-10,y-7,4,13,'#b8a98d');rect(x+9,y-7,4,13,'#b8a98d');}
 person(176,313,'#627373',false);
 // Gas lamps and engraved brass corner trim.
 for(const x of [44,588]){rect(x,92,3,166,'#a28c5f');rect(x-8,90,20,21,'#c2b47c');rect(x-4,93,12,14,'#f1d59c');rect(x-10,87,24,3,'#101f2b');const g=c.createRadialGradient(x+2,100,1,x+2,100,100);g.addColorStop(0,'#f6c87a25');g.addColorStop(1,'#e6b57200');c.fillStyle=g;c.fillRect(x-95,1,200,200);}
 rect(28,327,85,50,'#121e2c');rect(35,333,72,44,'#53656a');rect(41,339,61,35,'#152b37');
 if(state.phase==='combat')person(528,279,'#3f354c');
 if(mode==='walk'){const[x,y]=state.position;person(x*32+16,y*32+16,'#234f60');}
 if(state.evidence.includes('residue')){c.strokeStyle='#9b9bb7';c.lineWidth=2;c.beginPath();c.ellipse(462,146,28,39,0,0,Math.PI*2);c.stroke();}
 if(state.selected&&points[state.selected]){const[x,y]=points[state.selected];c.strokeStyle='#e1c794';c.lineWidth=2;c.strokeRect(x*32+2,y*32+2,28,28);}
 c.strokeStyle='#ac956d';c.lineWidth=1;c.strokeRect(8.5,8.5,623,383);for(const [x,y,dx,dy]of [[12,12,1,1],[628,12,-1,1],[12,388,1,-1],[628,388,-1,-1]]){rect(x,y,dx*24,dy*2,'#b4a078');rect(x,y,dx*2,dy*24,'#b4a078');}
 if(mode==='walk'){c.font='12px Georgia';for(const id of subjects()){const[x,y]=points[id],text=labels[id],tx=Math.max(20,Math.min(493,x*32-20)),ty=Math.min(376,y*32+43);rect(tx-3,ty-12,c.measureText(text).width+6,16,'#102332ec');c.fillStyle='#e8d2a6';c.fillText(text,tx,ty);}}
}
views[1].hidden=true;render();if(parent!==window&&location.protocol!=='about:')parent.postMessage({type:'mockup:ready'},location.origin);
if(globalThis.Tweak){const t=new Tweak({container:root,onChange:render});t.addSlider(settings,'text',{label:'Text size',min:14,max:21,step:1,unit:'px'});}
})();
