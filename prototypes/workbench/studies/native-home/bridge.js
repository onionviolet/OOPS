// Disposable native study bootstrap. This file is absent from the production bundle.
(()=>{
 const url=new URL(location);if(url.searchParams.has('import_probe'))return;
 url.searchParams.set('test_hooks','1');history.replaceState(null,'',url);
 const request=new XMLHttpRequest();request.open('GET','fixture.json',false);request.send();
 // This build is hosted on its own fresh loopback origin. Seed a PUBLIC fixture, never a player save.
 if(!sessionStorage.getItem('home-study-seeded')){localStorage.setItem('save data',request.responseText);sessionStorage.setItem('home-study-seeded','1');}
 let ready=false,homeStarted=false,selected=null,room=null,notice=null;
 const q=s=>document.querySelector(s);
 const visible=n=>!!n&&n.checkVisibility();
 function homes(){const select=q('#workspace_navigation select');if(select&&[...select.options].some(x=>x.value==='homes')){select.value='homes';select.dispatchEvent(new Event('change',{bubbles:true}));return true;}return false;}
 function reveal(n){for(let a=n;a;a=a.parentElement)if(a.tagName==='DETAILS')a.open=true;}
 function view(){return window.simulationTestHooks?.project('homes');}
 function openRoom(){homes();q('[data-home-visual-target]')?.removeAttribute('data-home-visual-target');room?.scrollIntoView({block:'start'});room?.querySelector('[data-room-link]')?.focus({preventScroll:true});}
 function openTarget(kind){
  q('[data-home-visual-target]')?.removeAttribute('data-home-visual-target');selected=kind;let target;
  if(kind==='rest'){
   const here=[...document.querySelectorAll('[data-panel-path="local-actions"]')].find(visible);here?.click();
   target=[...document.querySelectorAll('#location_choices_div button,#location_choices_div [class*="choice"],#location_choices_div [onclick]')].find(n=>/sleep|rest/i.test(n.textContent)&&!n.textContent.includes('Store'));
   if(!target)target=[...document.querySelectorAll('.choice_sleep,#start_sleeping_button,[onclick*="start_sleeping"]')].find(n=>n.textContent);
   if(target){reveal(target);target.setAttribute('data-home-visual-target','rest');target.scrollIntoView({block:'center'});target.focus({preventScroll:true});}
  }else{
   homes();const prefix=kind==='storage'?'Residence storage':'Homeowner repairs';
   target=[...q('#home_panel').querySelectorAll('details')].find(n=>n.firstElementChild?.textContent.startsWith(prefix));
   if(target){target.open=true;target.setAttribute('data-home-visual-target',kind);target.scrollIntoView({block:'start'});(target.querySelector('select,button')||target.firstElementChild).focus({preventScroll:true});}
  }
  notice.textContent=target?`${kind==='storage'?'Residence storage':kind==='rest'?'Native rest controls':'Home repair/work controls'} opened. Opening spends nothing; use the native action to commit.`:'The current native route is unavailable. Return to this home and check the existing controls.';
  if(!target)openRoom();publish();
 }
 function mount(){
  const panel=q('#home_panel');if(!panel)return;
  if(!room){room=document.createElement('section');room.id='native_home_scene';room.setAttribute('aria-label','Prototype clickable cottage');
   room.innerHTML='<div class="room-heading"><strong>Your cottage · pictured home prototype</strong><button type="button" data-room-show>Show native controls</button></div><div class="room-picture"><canvas width="660" height="340" aria-label="Cottage illustration with bed, residence chest and repairs table">Bed opens native rest controls. Chest opens residence storage. Table opens home repairs.</canvas><button type="button" class="room-object" data-room-link="rest" style="left:20%;top:65%">Bed · rest</button><button type="button" class="room-object" data-room-link="storage" style="left:73%;top:70%">Chest · storage</button><button type="button" class="room-object" data-room-link="work" style="left:73%;top:34%">Table · repairs & work</button></div><p class="room-note">Navigation links to current native panels. Authored illustration; no walking or placement rules. The work table is an illustrative shortcut, not a newly installed crafting station.</p><p role="status">Select furniture to open its existing controls.</p>';
   notice=room.querySelector('[role=status]');room.addEventListener('click',e=>{const b=e.target.closest('button');if(b?.dataset.roomLink)openTarget(b.dataset.roomLink);if(b?.hasAttribute('data-room-show')){const summary=[...panel.querySelectorAll('h3')].find(n=>!room.contains(n));summary?.scrollIntoView({block:'start'});}});
   const b=document.createElement('button');b.id='native_home_return';b.type='button';b.textContent='Pictured home';b.onclick=openRoom;q('#workspace_navigation')?.append(b);draw(room.querySelector('canvas'));
  }
  if(!room.isConnected)panel.querySelector('h2')?.after(room);
 }
 function snapshot(){return{schema:1,save:window.simulationTestHooks.snapshot(),scene:selected,route:'native-home'};}
 const tell=(type,more={})=>parent.postMessage({type,...more},location.origin);
 function publish(){if(parent!==window&&ready)tell('mockup:state',{snapshot:snapshot()});}
 window.addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==parent||e.data?.type!=='mockup:command'||!ready)return;const{id,command,value}=e.data;try{if(command==='text'){document.documentElement.style.setProperty('--ui-type-body',Number(value)+'px');document.documentElement.style.setProperty('--shell-context-size',Number(value)+'px');document.body.style.fontSize=Number(value)+'px';}if(command==='step')window.advanceTicks(1);if(command==='scenario'){openRoom();}if(command==='variant'&&value==='room')openRoom();if(command==='variant'&&value==='native')q('[data-room-show]')?.click();if(command==='restore')throw Error('Native study uses one running instance; mirrored mutations are not supported.');tell('mockup:reply',{id,snapshot:snapshot()});}catch(error){tell('mockup:reply',{id,error:error.message});}});
 const timer=setInterval(()=>{
  if(!window.simulationTestHooks?.saveStatus().ownsSave)return;
  window.simulationTestHooks.pause();const play=q('#loading_screen_play_button');if(visible(play))play.click();const confirm=q('#hero_creation_panel_confirmation');if(visible(confirm))confirm.click();if(q('#loading_screen')?.style.visibility!=='hidden')return;
  if(!homeStarted){homes();const start=q('[data-home-action="start:homeowner"]');if(start){reveal(start);if(!start.disabled){homeStarted=true;start.click();}}return;}
  const projection=view();if(projection?.here?.id!=='cottage')return;
  mount();if(!ready){ready=true;homes();tell('mockup:ready');}clearInterval(timer);
 },100);
 function draw(canvas){const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;const r=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  r(0,0,660,340,'#172d38');r(20,22,620,292,'#725d50');for(let y=100;y<310;y+=24){r(20,y,620,2,'#4b4945');for(let x=25+(y%48?0:45);x<638;x+=90)r(x,y,1,24,'#93816a');}
  r(17,20,626,77,'#3a5356');r(19,94,622,6,'#b49c76');for(const x of[92,285]){r(x-5,26,66,58,'#172a36');r(x,30,56,49,'#9ab6b5');r(x+26,30,4,49,'#3a5054');r(x,53,56,4,'#3a5054');r(x-6,81,68,7,'#ccb789');}
  r(492,33,95,62,'#24353b');for(let i=0;i<7;i++)r(500+i*11,40,8,41,['#84775e','#71827e','#9b846b'][i%3]);r(494,84,91,5,'#bc9971');
  r(65,170,171,83,'#39444c');r(67,163,168,73,'#758a87');r(73,170,43,55,'#d0c8ab');r(118,170,109,55,'#71899c');r(119,200,108,5,'#aaafb0');r(68,235,8,24,'#3d403e');r(222,235,8,24,'#3d403e');
  r(403,107,165,48,'#54483f');r(398,101,168,43,'#b29467');r(414,144,9,37,'#54483f');r(550,144,9,37,'#54483f');r(417,107,41,25,'#d8d0b1');r(473,109,35,19,'#526d73');r(526,105,17,23,'#7d657e');
  r(427,225,119,49,'#403f3c');r(422,213,124,46,'#8e7651');r(428,218,112,8,'#b89d68');r(428,241,112,5,'#4a5553');r(478,223,14,28,'#c1b180');r(481,235,7,8,'#3a4447');
  r(286,214,71,98,'#39413c');r(293,220,57,63,'#42504c');r(305,242,31,37,'#152f37');r(312,257,20,19,'#c1a776');r(318,254,9,25,'#e3c88c');r(287,283,69,13,'#96846b');
  r(17,312,627,8,'#243a40');r(16,19,628,3,'#b39d78');r(17,20,4,300,'#b39d78');r(640,20,4,300,'#b39d78');
 }
})();
