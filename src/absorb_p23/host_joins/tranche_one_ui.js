import {createHouseholdScene} from '../../household_scene.js';
// Standard native Local actions; no rewards, timers, effects or owner writes.
export function createHouseholdPanel({host,read,act}) {
    const panel=document.createElement('details');panel.id='p23_household_panel';panel.className='expedition_panel';
    const summary=document.createElement('summary');summary.textContent='A lived home (proposal)';
    const body=document.createElement('div'),notice=document.createElement('p'),scene=createHouseholdScene();panel.append(summary,scene.node,body,notice);host.append(panel);
    const records=document.createElement('div'),controls=document.createElement('div'),recordNodes=[],buttons=new Map();body.append(records,controls);
    const setText=(node,text)=>{if(node.textContent!==text)node.textContent=text;};
    function render(){const frame=read();panel.hidden=!frame.visible;scene.update(frame.scene);
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
                    const current=read(),sameSubject=!wasPressed||pressed===(current.subjectKey??current.scene?.subjectKey);wasPressed=false;
                    if(!sameSubject||!current.visible||current.disabled||!current.actions.some(a=>a.id===action.id&&a.enabled!==false)){render();return;}
                    try{act(action.id);notice.textContent='';}catch(error){notice.textContent=error.message;}render();
                });
            }
            setText(button,action.label);button.disabled=frame.disabled||action.enabled===false;button.title=action.reason||'';
            if(controls.children[index]!==button)controls.insertBefore(button,controls.children[index]||null);
        }}
    render();return {render};
}
