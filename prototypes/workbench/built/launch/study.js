import {mountNewGameBeginning} from './beginning.js';
const $=s=>document.querySelector(s), screen=$('#loading_screen');
const native=mountNewGameBeginning({screen,panel:$('#fixture_panel')});
const backgrounds=[
    {id:'ordinary',name:'A familiar beginning',pitch:'Wake in the Village. Find your footing and follow the elder’s lead.',status:'Existing playable base start'},
    {id:'farmhand',name:'Farmhand',pitch:'A working past, a little spare money, and something practical to do first.',status:'Layered prototype: text and 3 extra coins'},
    {id:'scholar',name:'Scholar’s child',pitch:'An ink-stained past, a few coins, and a reason to seek books or a teacher.',status:'Layered prototype: text and 4 extra coins'},
    {id:'runaway',name:'Runaway',pitch:'One tucked-away coin and a past you may choose to leave behind.',status:'Layered prototype: text and 1 extra coin'},
    {id:'artisan',name:'Apprentice artisan',pitch:'A borrowed bench, basic materials, and a first useful thing to make.',status:'Proposal: needs a paid/native making opening'},
    {id:'traveler',name:'Stranded traveler',pitch:'Reach an unfamiliar settlement. Find shelter, supplies and a route onward.',status:'Proposal: needs an admitted place and first lead'},
];
const state={schema:1,systemOpen:false,background:'ordinary',system:'none',previewed:false,scenario:'default',steps:0};
let applying=false;
const chooser=document.createElement('fieldset');chooser.className='beginning-background';
const legend=document.createElement('legend');legend.textContent='Where your life begins';
const grid=document.createElement('div');grid.className='background-options';chooser.append(legend,grid);
for(const item of backgrounds){
    const row=document.createElement('label');row.className='background-option';
    const input=document.createElement('input');input.type='radio';input.name='background';input.value=item.id;
    const heading=document.createElement('strong');heading.textContent=item.name;
    const pitch=document.createElement('span');pitch.textContent=item.pitch;
    const status=document.createElement('small');status.textContent=item.status;
    row.append(input,heading,pitch,status);grid.append(row);
    input.addEventListener('change',()=>{state.background=item.id;state.previewed=false;render();publish();});
}
native.section.querySelector('.cheat_start_choice').before(chooser);
const systemDisclosure=document.createElement('details');systemDisclosure.dataset.systemDisclosure='';
const systemSummary=document.createElement('summary');systemSummary.textContent='System · No system';
const systemChoice=native.section.querySelector('.cheat_start_choice');
systemChoice.before(systemDisclosure);systemDisclosure.append(systemSummary,systemChoice);
systemDisclosure.addEventListener('toggle',()=>{if(applying)return;state.systemOpen=systemDisclosure.open;publish();});
const systemSelect=$('[data-cheat-start]');
systemSelect.addEventListener('change',()=>{if(applying)return;state.system=systemSelect.value;state.previewed=false;render();publish();});
function render(){
    const selected=backgrounds.find(x=>x.id===state.background);
    for(const input of document.querySelectorAll('input[name="background"]'))input.checked=input.value===state.background;
    for(const row of grid.children){const item=backgrounds.find(x=>x.id===row.querySelector('input').value);row.querySelector('strong').textContent=state.scenario==='long'?`${item.name} · from the far side of a long and winding road`:item.name;}
    systemSelect.value=state.system;
    // Real renderer synchronizes the authoritative system value and its visible radios.
    const previous=applying;applying=true;systemSelect.dispatchEvent(new Event('change',{bubbles:true}));applying=previous;
    $('[data-summary-text]').textContent=`${selected.name}. ${selected.pitch} ${selected.status}.`;
    systemDisclosure.open=state.systemOpen;
    $('[data-summary-system]').textContent=state.system==='none'?'No system':state.system==='surprise'?'Surprise system · one currently available':'Dormant system';
    systemSummary.textContent='System · '+$('[data-summary-system]').textContent;
    $('[data-preview-result]').textContent=state.previewed?'Preview recorded in this disposable fixture. Nothing was granted and no game was started.':'';
    $('[data-return]').hidden=!state.previewed;
}
function capture(){return {...structuredClone(state),scroll:native.section.scrollTop,screenScroll:screen.scrollTop,focus:document.activeElement?.value||null};}
function publish(){if(!applying)parent.postMessage({type:'mockup:state',snapshot:capture()},location.origin);}
function restore(snapshot,variant){
    if(snapshot?.schema!==1||!backgrounds.some(x=>x.id===snapshot.background)||!['none','system-quests','surprise'].includes(snapshot.system))throw Error('Unsupported beginning study state');
    Object.assign(state,structuredClone(snapshot));screen.dataset.layout=variant;render();
    native.section.scrollTop=snapshot.scroll||0;screen.scrollTop=snapshot.screenScroll||0;
}
$('#loading_screen_play_button').addEventListener('click',()=>{state.previewed=true;render();publish();});
$('[data-return]').addEventListener('click',()=>{state.previewed=false;render();document.querySelector(`input[name="background"][value="${state.background}"]`).focus();publish();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&state.previewed){event.preventDefault();$('[data-return]').click();}});
window.addEventListener('message',event=>{
    if(event.source!==parent||event.origin!==location.origin||event.data?.type!=='mockup:command')return;
    const {id,command,value,variant}=event.data;applying=true;
    try {
        if(command==='restore')restore(value,variant);
        else if(command==='variant'){const focus=document.activeElement;screen.dataset.layout=value;focus?.focus({preventScroll:true});}
        else if(command==='scenario'){Object.assign(state,{background:'ordinary',system:'none',previewed:false,scenario:value,steps:0});render();}
        else if(command==='text'){document.documentElement.style.setProperty('--ui-type-body',`${value}px`);document.documentElement.style.setProperty('--ui-type-title',`${Number(value)+2}px`);document.documentElement.style.setProperty('--ui-type-small',`${Math.max(12,Number(value)-2)}px`);}
        else if(command==='step'){state.steps++;render();}
        else if(command!=='capture')throw Error('Unknown fixture command');
        requestAnimationFrame(()=>{applying=false;parent.postMessage({type:'mockup:reply',id,snapshot:capture()},location.origin);});
    }catch(error){applying=false;parent.postMessage({type:'mockup:reply',id,error:error.message},location.origin);}
});
document.addEventListener('scroll',()=>{if(!applying)publish();},true);
render();parent.postMessage({type:'mockup:ready'},location.origin);
