// Disposable fixture origin only. Never accesses a gameplay origin or personal save.
(()=>{const u=new URL(location);u.searchParams.set('test_hooks','1');history.replaceState(null,'',u);
if(!sessionStorage.getItem('equipment-comparison-seeded')){const r=new XMLHttpRequest();r.open('GET','fixture.json',false);r.send();localStorage.setItem('save data',r.responseText);sessionStorage.setItem('equipment-comparison-seeded','1');}
const timer=setInterval(()=>{if(!window.simulationTestHooks?.saveStatus().ownsSave)return;simulationTestHooks.pause();for(const id of['loading_screen_play_button','hero_creation_panel_confirmation']){const b=document.getElementById(id);if(b?.checkVisibility())b.click();}if(document.getElementById('loading_screen')?.style.visibility!=='hidden')return;if(!window.equipmentComparisonPorts?.tools())return;clearInterval(timer);window.dispatchEvent(new Event('equipment-comparison-ready'));},100);
})();
