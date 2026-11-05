// Public disposable fixture; no personal saves. Native start, native clock and native panels.
(()=>{if(new URL(location).searchParams.has('import_probe'))return;const url=new URL(location);url.searchParams.set('test_hooks','1');history.replaceState(null,'',url);
const r=new XMLHttpRequest();r.open('GET','fixture.json',false);r.send();if(!sessionStorage.getItem('fh-seeded')){localStorage.setItem('save data',r.responseText);sessionStorage.setItem('fh-seeded','1');}
let started=false,preparing=false;
function prepare(){
 if(preparing)return;preparing=true;
 try{
 window.change_location({location_id:'Village'});
 const shop=document.querySelector('select[aria-label="Furnishing to buy"]');if(!shop)throw Error('Supplier unavailable');
 for(const item of ['Home wooden tableware','Home clay tableware']){shop.value=item;shop.dispatchEvent(new Event('change',{bubbles:true}));const b=document.querySelector('[data-home-action="buy"]');if(!b||b.disabled)throw Error('Purchase unavailable');b.click();}
 window.change_location({location_id:'Hearthside cottage'});
 const key=JSON.stringify({id:'Home wooden tableware'});const b=[...document.querySelectorAll('[data-home-action]')].find(n=>n.dataset.homeAction==='install:cottage:'+key);if(!b||b.disabled)throw Error('Installation unavailable');b.click();
 sessionStorage.setItem('fh-replacement-ready','1');
 }catch(e){window.functionalHomeSetupError=e.message;console.error('Replacement fixture:',e.message);}
}
const timer=setInterval(()=>{if(!window.simulationTestHooks?.saveStatus().ownsSave)return;window.simulationTestHooks.pause();const p=document.getElementById('loading_screen_play_button');if(p?.checkVisibility())p.click();const c=document.getElementById('hero_creation_panel_confirmation');if(c?.checkVisibility())c.click();if(document.getElementById('loading_screen')?.style.visibility!=='hidden')return;
const v=window.simulationTestHooks.project('homes');if(v.here?.id==='cottage'){if(new URL(location).searchParams.has('replacement')&&!sessionStorage.getItem('fh-replacement-ready')){prepare();if(!sessionStorage.getItem('fh-replacement-ready'))return;}clearInterval(timer);window.dispatchEvent(new Event('functional-home-ready'));return;}const select=document.querySelector('#workspace_navigation select');if(select){select.value='homes';select.dispatchEvent(new Event('change',{bubbles:true}));}const b=document.querySelector('[data-home-action="start:homeowner"]');if(b&&!b.disabled&&!started){for(let a=b.parentElement;a;a=a.parentElement)if(a.tagName==='DETAILS')a.open=true;started=true;b.click();}},100);
})();
