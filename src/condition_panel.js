import {createBodyExpression} from './body_expression.js';
import {definePanel} from './panel_kit.js';
import {registerPanelSettings,getDisplaySetting,setDisplaySettings} from './display_settings.js';
import {subscribeChange,bridgeLegacyNode} from './ui_change_signal.js';
import {readTemperature} from './condition_facts.js';
import {createTemperatureBand} from './temperature_band.js';
const node=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n;};
// Display-only reader, mounted through the existing shell owner. No timer, save or commands.
export function mountConditionPanel({home,rates,readRows,notice,inspect,isInspecting=()=>false}) {
    const panel=node('section');panel.id='shell_condition';
    const empty=node('p','No active effects'),list=node('div'),body=node('details'),bodyTitle=node('summary'),bodyName=node('span','Body'),bodyText=node('p');
    list.className='condition-effects';list.setAttribute('aria-label','Active status effects');empty.className='condition-summary';
    const temperature=createTemperatureBand(),expression=createBodyExpression();
    bodyTitle.append(bodyName,expression.node);body.append(bodyTitle,bodyText,expression.detail,temperature.node);panel.append(empty,list,body,rates);
    const records=new Map();
    const active=()=>home.dataset.presentation==='proto23-shell'&&home.dataset.parity==='r3';
    definePanel({id:'condition',title:'Condition',role:'character',node:panel,home,after:'shell-character',defaultDock:'left',eligible:active,discovered:active});
    registerPanelSettings({id:'condition',title:'Condition',settings:[{key:'introduced',label:'Condition home reminder',default:'new',options:[['new','Explain on next appearance'],['seen','Already explained']],description:'This browser: effects, body and rates live in Condition below You by default. Weather stays in the place header. Reset display settings to explain again.'}]});
    const write=(n,text)=>{if(n.textContent!==text)n.textContent=text;};
    function render(){
        panel.hidden=!active();if(!active())return;
        const profile=document.getElementById('character_bio_profile');
        const facts=[...profile?.children||[]].map(n=>[...n.childNodes].filter(c=>c.nodeType===3).map(c=>c.textContent).join('').trim()).filter(Boolean);
        const race=facts.find(text=>text.startsWith('Race:'))?.replace('Race:','').trim();
        write(bodyName,'Body'+(race?' · '+race:''));
        write(bodyText,facts.length?facts.join(' · '):'Body details are available in Stats › Biography.');
        temperature.update(readTemperature());
        const native=[...document.querySelectorAll('#effects_tooltip .active_effect_tooltip')],live=new Set();
        for(const source of native){
            const name=source.querySelector('.active_effect_name')?.textContent.replace(/^'|'\s*:\s*$/g,'').trim();if(!name)continue;
            const id=source.dataset.effectId||name;live.add(id);let record=records.get(id);
            if(!record){const button=node('button'),label=node('span'),duration=node('span'),kind=node('small');
                button.type='button';button.className='condition-effect';button.dataset.contextPreview='effect';button.dataset.effectId=id;
                label.className='condition-effect-name';duration.className='condition-effect-duration';kind.className='condition-effect-kind';
                button.append(label,duration,kind);button.onclick=()=>inspect(button);list.append(button);record={button,label,duration,kind};records.set(id,record);
            }
            const kind=source.dataset.effectKind||'condition',duration=source.querySelector('.active_effect_duration')?.textContent.trim()||'';
            write(record.label,name);write(record.duration,duration);write(record.kind,kind==='buff'?'Buff':kind==='debuff'?'Debuff':'Condition');
            record.button.dataset.effectKind=kind;delete record.button.dataset.ended;
            record.button.setAttribute('aria-label',`${name} · ${record.kind.textContent}${duration?' · '+duration:''}`);
            record.button.nativeEffectView={html:source.innerHTML,ended:false};
        }
        for(const[id,record]of records)if(!live.has(id)){
            if(record.button===document.activeElement||isInspecting(record.button)){
                record.button.dataset.ended='true';write(record.duration,'Ended');record.button.setAttribute('aria-label',record.label.textContent+' · Ended');record.button.nativeEffectView={...record.button.nativeEffectView,ended:true};
            }else {record.button.remove();records.delete(id);}
        }
        empty.hidden=records.size>0;panel.dataset.effectCount=String(native.length);panel.dataset.rateCount=String(readRows().length);
        const heading=panel.closest('.workspace-module')?.querySelector('.workspace-module-header > strong');
        if(heading)write(heading,'Condition'+(native.length?' · '+native.length+(native.length===1?' effect':' effects'):''));
        if(getDisplaySetting('panel.condition.introduced')!=='seen'&&document.documentElement.dataset.startScreen==='closed'){
            setDisplaySettings({'panel.condition.introduced':'seen'});
            const route=document.querySelector('[data-route-id="condition"]');if(route){route.dataset.newHome='true';route.title='Effects, body and active rates. Weather and cold exposure are in the place header.';}
        }
    }
    const stops=[subscribeChange({id:'condition',surface:'condition',refresh:render}),
        ...['effects_tooltip','character_bio_profile','weather_div'].map(id=>bridgeLegacyNode(document.getElementById(id),'body'))];
    render();return {render,destroy(){stops.forEach(stop=>stop());expression.destroy();panel.remove();}};
}
