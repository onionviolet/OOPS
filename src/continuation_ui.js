import {definePanel} from './panel_kit.js';
import {centerModes} from './center_modes.js';
import {decorateActionComponents} from './ui_components.js';

const node=(tag,text='',className='')=>{const n=document.createElement(tag);n.textContent=text;if(className)n.className=className;return n;};
const date=t=>t?`Y${t.year} · ${t.month}/${t.day} · ${String(t.hour).padStart(2,'0')}:${String(t.minute).padStart(2,'0')}`:'Not established';
export function createContinuationUI({read,command}) {
    const home=node('section');home.id='continuation_panel';
    const status=node('p'),open=node('button','Open your connection','action_button');open.type='button';open.id='continuation_open';home.append(status,open);
    definePanel({id:'continuation',title:'Continuing connection',role:'character',node:home,home:document.getElementById('main_content'),defaultDock:'left',
        discovered:()=>read().created,eligible:()=>read().created});
    const view=node('section');view.id='continuation_view';view.className='center-mode-hidden';
    const title=node('h2','Your continuing connection','expanded-panel-heading');title.tabIndex=-1;
    const summary=node('p'),message=node('p');
    message.id='continuation_message';message.setAttribute('role','status');
    const tabs=node('nav'),body=node('div');tabs.setAttribute('aria-label','Connection topics');body.className='ui-connection-body';view.append(title,tabs,summary,message,body);
    centerModes().registerView('continuation',view,'Continuing connection');
    open.onclick=()=>{render(true);centerModes().open('continuation');};
    let signature='',pending=null,section='research',submitting=false;
    for(const [id,label] of [['return','Return'],['research','Anchors & study'],['memory','Learning']]) {
        const b=node('button',label,'action_button');b.type='button';b.dataset.connectionTab=id;
        b.onclick=()=>{section=id;pending?.remove();pending=null;render(true);};tabs.append(b);
    }
    const run=async action=>{if(submitting)return;submitting=true;view.setAttribute('aria-busy','true');for(const b of view.querySelectorAll('[data-continuation-action]'))b.disabled=true;try {message.textContent='Checking the connection…';await command(action);message.textContent='The connection is recorded.';}catch(e){message.textContent=e.message;}finally{submitting=false;view.removeAttribute('aria-busy');signature='';render(true);}};
    const button=(text,action,disabled=false,reason='')=>{
        const b=node('button',text,'action_button');b.type='button';b.dataset.continuationAction=action;b.disabled=disabled;b.dataset.disabledReason=reason;
        b.onclick=()=>run(action);return b;
    };
    const confirm=(text,action,explanation,disabled=false,reason='')=>{
        const b=button(text,action,disabled,reason);
        b.onclick=()=>{
            pending?.remove();pending=node('div','','panel-info ui-panel-section');body.replaceChildren();pending.setAttribute('role','group');pending.setAttribute('aria-labelledby','connection_review_title');
            const heading=node('h3',text);heading.id='connection_review_title';
            pending.append(heading,node('p',explanation),button('Confirm '+text,action));
            const cancel=node('button','Keep this life unchanged','action_button');cancel.type='button';cancel.onclick=()=>{pending.remove();pending=null;render(true);[...body.querySelectorAll('[data-continuation-action]')].find(n=>n.dataset.continuationAction===action)?.focus({preventScroll:true});};
            pending.append(cancel);body.prepend(pending);
            cancel.focus({preventScroll:true});
        };return b;
    };
    function render(force=false) {
        const s=read();home.hidden=!s.created;status.textContent=s.available?`${s.life} · ${s.research.checkpoint?'later checkpoint learned':'investigating possible return points'}`:'Quiet faculty · establish a baseline';
        const key=JSON.stringify(s);if(!force&&key===signature)return;signature=key;
        // Do not replace a review confirmation while game time advances.
        if(pending?.isConnected&&!force)return;
        const opened=new Set([...body.querySelectorAll('details[open]')].map(n=>n.dataset.connectionDisclosure));
        body.replaceChildren();pending=null;
        for(const b of tabs.children)b.setAttribute('aria-pressed',String(b.dataset.connectionTab===section));
        summary.textContent=s.available?`${s.life} · ${s.arrivalPaused?'arrival paused':'one continuing self'}`:'Your past is preserved. An adoption baseline marks now; it does not invent an earlier arrival.';
        if(!s.available) {body.append(button(s.legacy?'Establish baseline at this moment':'Recognize the initial connection','enroll',!s.canWrite||!!s.reason,s.reason));return;}
        const reason=s.reason||(!s.canWrite?'Use the writable game tab.':'');
        if(s.arrivalPaused)body.append(button('Continue this life from the paused boundary','continue',!!reason,reason));
        const research=node('div','','panel-info ui-panel-section');
        research.append(node('h3','Investigate the connection'),node('p',s.research.checkpoint?'You understand how to mark a later point. This faculty stays with you.':`Study: ${s.research.minutes}/10 min. Observe how the initial return point remains recognizable; practice identifying another moment. Study progresses with ordinary unoccupied time.`));
        if(!s.research.checkpoint)research.append(button(s.research.running?'Pause investigation':'Investigate · 10 min of available time','study',!!reason||s.busy,reason||(s.busy?'Finish current work before investigating.':'')));
        if(s.research.checkpoint)research.append(confirm(s.checkpointDate?'Replace the later checkpoint':'Mark this moment','set',`Mark the current world and body. ${s.checkpointDate?'The previous later point will be replaced. ':''}Your initial fallback remains. A valid point can still be dangerous.`,!!reason,reason));
        if(section==='research')body.append(node('p',`Initial: ${date(s.initialDate)}. Later: ${date(s.checkpointDate)}.`),research);
        const returns=node('div','','panel-info ui-panel-section');returns.append(node('h3','Return or continue'),node('p',`Initial point: ${date(s.initialDate)}. Later checkpoint: ${date(s.checkpointDate)}. Choose a destination, then review what it changes before confirming.`));
        const effect='This world and body rewind. Memories, compatible learned mastery and enduring connection upgrades carry. Physical gains restore to the chosen point. Other retained worlds are outside the currently supported rewind scope.';
        returns.append(confirm('Return to initial point','initial',effect,!!reason,reason));
        returns.append(confirm('Return to later checkpoint','checkpoint',effect,!!reason||!s.checkpointReachable,reason||(!s.checkpointDate?'Set a later checkpoint first.':!s.checkpointReachable?'That point is in an abandoned future. Forward travel needs other means.':'')));
        returns.append(confirm('Begin a fresh life','fresh','A new human embodiment begins in a separate Frontier history at its native opening date. This life pauses intact. Your connection provides a reciprocal route to its paused embodiment. Your possessions do not transfer.',!!reason,reason));
        for(const life of s.paused)returns.append(confirm(`Resume ${life.label} · ${date(life.date)}`,`resume:${life.id}`,'This life pauses. The selected life resumes its departure body and history, with current remembered learning and connection growth. It is not healed or rewound.',!!reason||!life.reachable,reason||(!life.reachable?'No reciprocal route reaches this life.':'')));
        if(section==='return')body.append(returns);
        const loop=node('details');loop.dataset.connectionDisclosure='loop';loop.append(node('summary',`Intentional repeat loop · ${s.loop.enabled?'ON':'off'}`),node('p','Optional: every five played minutes, return to the selected point. This repeats time, not an invented reward. Stop the loop here whenever your means allow. A chosen bad point can trap you; ordinary save/export remains separate.'));
        if(s.loop.enabled)loop.append(node('p',`Selected destination: ${s.loop.target==='initial'?'initial point':'later checkpoint'}. Completed cycles: ${s.loop.cycles}.`),button('Stop deliberate repetition','loop',!!reason,reason));
        else loop.append(button('Repeat every five minutes → initial point','loop:initial',!!reason,reason),button('Repeat every five minutes → later checkpoint','loop:checkpoint',!!reason||!s.checkpointReachable,reason||(!s.checkpointReachable?'No currently reachable later checkpoint.':'')));if(section==='return')body.append(loop);
        const memories=node('details');memories.dataset.connectionDisclosure='memory';memories.append(node('summary',`Remembered learning · ${s.mastery.length} observed skills`),node('p','This connection carries reading, crafting, smelting and forging knowledge. Other training is remembered, but its bodily effects are not transferred to another embodiment by this form of the connection.'));
        for(const m of s.mastery)memories.append(node('p',`${m.skill}: ${Math.round(m.xp)} learned XP · ${m.usable?'compatible knowledge':'remembered; bodily effects not transferred'}`));
        for(const m of s.memories.slice(-12).reverse())memories.append(node('p',`${m.lifeLabel} · remembered: ${m.event.text}`));if(section==='memory'){memories.open=true;body.append(memories);}
        for(const n of body.querySelectorAll('details'))if(opened.has(n.dataset.connectionDisclosure))n.open=true;
    }
    const decorations=decorateActionComponents(view);render();
    return {render,destroy(){decorations.destroy();home.remove();view.remove();}};
}
