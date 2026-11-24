import {createHouseholdScene} from '../../household_scene.js';
import {createSettledTextEffects} from '../../settled_text_effects.js';
import {formatDuration} from '../../number_format.js';
import {effectsCap} from '../../display_settings.js';

// Compare public projections only, after a native command returns. Unchanged
// state, refusals and a home rebound cannot earn a positive reaction.
export function householdReaction(before, after, action) {
    if (!after?.visible || (before.subjectKey??before.scene?.subjectKey)!==(after.subjectKey??after.scene?.subjectKey)) return null;
    const b=before.scene, a=after.scene;
    if (!a) return null;
    const animal=a.animal;
    if(action==='meet' && animal && !b?.animal) return {subject:'animal',symbol:'?',text:`${animal.name} watches you from the doorway.`};
    if(['pet','play'].includes(action) && animal && b?.animal && animal.interactions>b.animal.interactions) return {
        subject:'animal',symbol:action==='play'?'♪':'♡',reaction:action,
        text:action==='play'?`${animal.name} pounces. ${animal.preference||''}`:`${animal.name} settles under your hand. Bond ${animal.bond}/100.`};
    if(action==='light' && a.hearth?.fuel>0 && !b?.hearth?.fuel) return {subject:'hearth',symbol:'♨',text:`Hearth lit · fuel for ${formatDuration(a.hearth.fuel)}.`};
    if(action==='ventilate' && b?.hearth?.smoke>0 && a.hearth?.smoke===0) return {subject:'hearth',symbol:'≋',text:'Vent open. The smoke clears.'};
    if(action.startsWith('stock_firewood') && a.hearth?.stocked>(b?.hearth?.stocked||0)) return {subject:'hearth',symbol:'+1',text:`Firewood · ${a.hearth.stocked}/${a.hearth.stockCapacity} stocked logs.`};
    if(action==='extinguish' && b?.hearth?.fuel>0 && a.hearth?.fuel===0) return {subject:'hearth',symbol:'▱',text:'The hearth goes out. Unburned stock stays in the pile.'};
    return null;
}
// Standard native Local actions; no rewards, timers, effects or owner writes.
export function createHouseholdPanel({host,read,act}) {
    const panel=document.createElement('details');panel.id='p23_household_panel';panel.className='expedition_panel';
    const summary=document.createElement('summary');summary.textContent='A lived home (proposal)';
    const body=document.createElement('div'),notice=document.createElement('p'),scene=createHouseholdScene();panel.append(summary,scene.node,notice,body);host.append(panel);
    panel.classList.add('settled-effects-host');notice.className='household-action-result';notice.setAttribute('role','status');
    const effects=createSettledTextEffects({container:panel,readSettings:()=>({effects:effectsCap()})});
    let sequence=0,lastSubject;
    const clear=()=>effects.cancel();panel.addEventListener('toggle',()=>{if(!panel.open)clear();});
    const records=document.createElement('div'),controls=document.createElement('div'),recordNodes=[],buttons=new Map();body.append(records,controls);
    const setText=(node,text)=>{if(node.textContent!==text)node.textContent=text;};
    function render(){const frame=read(),subject=frame.subjectKey??frame.scene?.subjectKey;
        if(!frame.visible||subject!==lastSubject){clear();notice.textContent='';}lastSubject=subject;
        panel.hidden=!frame.visible;scene.update(frame.scene);
        if(panel.parentElement!==host)host.append(panel);
        for(let i=0;i<frame.records.length;i++){if(!recordNodes[i]){recordNodes[i]=document.createElement('p');records.append(recordNodes[i]);}setText(recordNodes[i],frame.records[i]);}
        while(recordNodes.length>frame.records.length)recordNodes.pop().remove();
        const live=new Set(frame.actions.map(a=>a.id));
        for(const [id,button] of buttons)if(!live.has(id)){if(document.activeElement===button)summary.focus();button.remove();buttons.delete(id);}
        for(const [index,action] of frame.actions.entries()){
            let button=buttons.get(action.id);
            if(!button){button=document.createElement('button');button.type='button';button.dataset.householdAction=action.id;buttons.set(action.id,button);
                let pressed,wasPressed=false;
                button.addEventListener('pointerdown',()=>{const current=read();pressed=current.subjectKey??current.scene?.subjectKey;wasPressed=true;});
                button.addEventListener('pointercancel',()=>{wasPressed=false;});
                button.addEventListener('click',()=>{
                    clear();
                    const current=read(),sameSubject=!wasPressed||pressed===(current.subjectKey??current.scene?.subjectKey);wasPressed=false;
                    if(!sameSubject||!current.visible||current.disabled||!current.actions.some(a=>a.id===action.id&&a.enabled!==false)){render();return;}
                    try{
                        act(action.id);render();
                        const reaction=householdReaction(current,read(),action.id);
                        notice.textContent=reaction?.text||'';
                        if(reaction){const anchor=scene.targets[reaction.subject],subject=scene.targets[reaction.subject==='animal'?'cat':'flame'];
                            effects.present({type:'household-action',actorId:'player',subjectId:lastSubject,eventId:++sequence,text:reaction.text},
                                {anchor,subject,symbol:reaction.symbol,reaction:reaction.reaction,caption:false});}
                    }catch(error){notice.textContent=error.message;render();}
                });
            }
            setText(button,action.label);button.disabled=frame.disabled||action.enabled===false;button.title=action.reason||'';
            // The shared accessibility sweep inserts disabled-reason siblings.
            // Compare action order, not all children, or every tick moves the
            // focused button even when the action order did not change.
            const actionNodes=[...controls.children].filter(node=>node.tagName==='BUTTON');
            if(actionNodes[index]!==button)controls.insertBefore(button,actionNodes[index]||null);
        }}
    render();return {render,destroy(){effects.destroy();panel.remove();}};
}
