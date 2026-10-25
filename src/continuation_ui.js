import {CHALLENGE_GOALS} from './continuation_challenges.js';
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
    const tabs=node('nav'),body=node('div');view.append(title,tabs,summary,message,body);
    centerModes().registerView('continuation',view,'Continuing connection');
    open.onclick=()=>{render(true);centerModes().open('continuation');};
    let signature='',pending=null,section='return';
    for(const [id,label] of [['return','Return'],['research','Anchors & study'],['memory','Learning']]) {
        const b=node('button',label,'action_button');b.type='button';b.dataset.connectionTab=id;
        b.onclick=()=>{section=id;pending?.remove();pending=null;render(true);};tabs.append(b);
    }
    const run=async action=>{try {message.textContent='Checking the connection…';await command(action);message.textContent='The connection is recorded.';}catch(e){message.textContent=e.message;}signature='';render(true);};
    const button=(text,action,disabled=false,reason='')=>{
        const b=node('button',text,'action_button');b.type='button';b.dataset.continuationAction=action;b.disabled=disabled;b.dataset.disabledReason=reason;
        b.onclick=()=>run(action);return b;
    };
    const confirm=(text,action,explanation,disabled=false,reason='')=>{
        const b=button(text,action,disabled,reason);
        b.onclick=()=>{
            pending?.remove();pending=node('div','','panel-info');body.replaceChildren();
            pending.append(node('p',explanation),button('Confirm '+text,action));
            const cancel=node('button','Keep this life unchanged','action_button');cancel.type='button';cancel.onclick=()=>{pending.remove();pending=null;render(true);};
            pending.append(cancel);body.prepend(pending);
        };return b;
    };
    function render(force=false) {
        const s=read();home.hidden=!s.created;status.textContent=s.available?`${s.life} · ${s.research.checkpoint?'later checkpoint learned':'investigating possible return points'}`:'Quiet faculty · establish a baseline';
        const key=JSON.stringify(s);if(!force&&key===signature)return;signature=key;
        // Do not replace a review confirmation while game time advances.
        if(pending?.isConnected&&!force)return;
        body.replaceChildren();pending=null;
        for(const b of tabs.children)b.setAttribute('aria-pressed',String(b.dataset.connectionTab===section));
        summary.textContent=s.available?`${s.life} · ${s.arrivalPaused?'arrival paused':'one continuing self'}`:'Your past is preserved. An adoption baseline marks now; it does not invent an earlier arrival.';
        if(!s.available) {body.append(button(s.legacy?'Establish baseline at this moment':'Recognize the initial connection','enroll',!s.canWrite||!!s.reason,s.reason));return;}
        const reason=s.reason||(!s.canWrite?'Use the writable game tab.':'');
        if(s.arrivalPaused)body.append(button('Continue this life from the paused boundary','continue',!s.canWrite,!s.canWrite?'Use the writable game tab.':''));
        if(s.challenge){const c=s.challenge;body.append(node('h3',c.label),node('p',c.description),node('p',`Observed goal: ${c.have}/${c.need}. The original life remains shelved. Other connection operations stay outside this isolated run.`),
            confirm('Complete challenge and return','challenge:return',c.description,c.have<c.need||!s.canWrite,c.have<c.need?'Meet the stated goal or cancel this run.':''),
            confirm('Cancel challenge and return','challenge:cancel','Discard this challenge body, stock and progression. Resume the original body and possessions. Your own journal text stays with the continuing self.',!s.canWrite));return;}
        const travelReason=s.travelReason||(!s.canWrite?'Use the writable game tab.':'');
        const research=node('div','','panel-info');
        research.append(node('h3','Investigate the connection'),node('p',s.research.checkpoint?'You understand how to mark a later point. This faculty stays with you.':`Study: ${s.research.minutes}/10 min. Observe how the initial return point remains recognizable; practice identifying another moment. Study progresses with ordinary unoccupied time.`));
        if(!s.research.checkpoint)research.append(button(s.research.running?'Pause investigation':'Investigate · 10 min of available time','study',!!reason||s.busy,reason||(s.busy?'Finish current work before investigating.':'')));
        if(s.research.checkpoint)research.append(confirm(s.checkpointDate?'Replace the later checkpoint':'Mark this moment','set',`Mark the current world and body. ${s.checkpointDate?'The previous later point will be replaced. ':''}Your initial fallback remains. A valid point can still be dangerous.`,!!reason,reason));
        if(section==='research')body.append(node('p',`Initial: ${date(s.initialDate)}. Later: ${date(s.checkpointDate)}.`),research);
        if(section==='return'&&s.baggage){const b=s.baggage;body.append(node('h3','Connected baggage (optional)'),node('p',`Purchased space ${b.used}/${b.slots}. Each slot carries one loose supported item or 25 coins into a fresh ordinary life. The source and its return points lose those exported goods and coins; rewinding keeps them with their recipient. An older return point that reserves the exported copy in unfinished work waits until that conflict is resolved; other free points remain usable. Unequip gear before packing. Individually tracked equipment keeps its exact identity, wear, repairs, name and living-gear state; those facts leave the source with it. Body-bound effects still need their own compatible body. Processed lineage goods keep their provenance. Crafted products that need a separate product owner remain held here. An identity collision with the new opening leaves this bag held. This bag is inactive in isolated challenges. Plans clear after passage; purchased space remains.`),button(`Open one baggage slot · ${b.nextCost} coins`,'baggage:buy',!!travelReason||b.slots>=4,travelReason),button('Clear selected baggage','baggage:clear',!!travelReason,travelReason));if(b.slots){body.append(node('p',`Selected coins ${b.coins}; selected items ${b.items.length}.`),button('Pack 25 actual coins','baggage:coins',!!travelReason||b.used>=b.slots,travelReason));for(const q of b.candidates)body.append(button(`Pack ${q.label} · ${q.selected}/${q.count} selected`,'baggage:item:'+encodeURIComponent(q.key),!!travelReason||!!q.reason||b.used>=b.slots||q.selected>=q.count,travelReason||q.reason));}}
        const returns=node('div','','panel-info');returns.append(node('h3','Return or continue'));
        const effect='This world and body rewind. Memories, compatible learned mastery and enduring connection upgrades carry. Physical gains restore to the chosen point. Other retained worlds are outside the currently supported rewind scope.';
        returns.append(confirm('Return to initial point','initial',effect,!!reason||!!s.initialBlocked,reason||s.initialBlocked));
        returns.append(confirm('Return to later checkpoint','checkpoint',effect,!!reason||!s.checkpointReachable,reason||s.checkpointBlocked||(!s.checkpointDate?'Set a later checkpoint first.':!s.checkpointReachable?'That point is in an abandoned future. Forward travel needs other means.':'')));
        returns.append(confirm('Begin a fresh life','fresh','A new human embodiment begins in a separate Frontier history at its native opening date. This life pauses intact. Your connection provides a reciprocal route to its paused embodiment. Any explicitly packed connected baggage moves from this life’s own stock into the new life. Other possessions stay here.',!!travelReason,travelReason));
        for(const life of s.paused)returns.append(confirm(`Resume ${life.label} · ${date(life.date)}`,`resume:${life.id}`,'This life pauses. The selected life resumes its departure body and history, with current remembered learning and connection growth. It is not healed or rewound.',!!travelReason||!life.reachable,travelReason||(!life.reachable?'No reciprocal route reaches this life.':'')));
        if(section==='return'){for(const [id,g] of Object.entries(CHALLENGE_GOALS))returns.append(confirm('Isolated challenge: '+g.label,'challenge:begin:'+id,g.description+' Your current life pauses intact; cancellation returns it without the challenge result.',!!travelReason,travelReason));body.append(returns);}
        const loop=node('details');loop.append(node('summary',`Intentional repeat loop · ${s.loop.enabled?'ON':'off'}`),node('p','Optional: every five played minutes, return to the selected point. This repeats time, not an invented reward. Stop the loop here whenever your means allow. A chosen bad point can trap you; ordinary save/export remains separate.'));
        if(s.loop.enabled)loop.append(node('p',`Selected destination: ${s.loop.target==='initial'?'initial point':'later checkpoint'}. Completed cycles: ${s.loop.cycles}.`),button('Stop deliberate repetition','loop',!!reason,reason));
        else loop.append(button('Repeat every five minutes → initial point','loop:initial',!!reason||!!s.initialBlocked,reason||s.initialBlocked),button('Repeat every five minutes → later checkpoint','loop:checkpoint',!!reason||!s.checkpointReachable,reason||s.checkpointBlocked||(!s.checkpointReachable?'No currently reachable later checkpoint.':'')));if(section==='return')body.append(loop);
        if(section==='memory'&&s.retention){const r=s.retention;body.append(node('h3','Anchored learning'),node('p',`Challenge insight ${r.credits}. One completed isolated challenge earns one insight. An anchor costs one insight or the stated native coins. The aptitude factor is 1 + 0.05 × ln(1 + best practiced XP / 100) × √anchors; it changes future native skill XP, not current levels, bodily stats or transferred equipment. Anchors stay with the continuing self and remain inactive inside isolated challenges.`));
            for(const q of r.choices){body.append(node('p',`${q.skill}: ${q.anchors} anchors · native learning ×${q.multiplier.toFixed(5)}. Next coin anchor ${q.cost}.`),button('Anchor '+q.skill+' · 1 insight','retention:insight:'+encodeURIComponent(q.skill),!!travelReason||!r.credits,travelReason||(!r.credits?'Complete a challenge first.':'')),button('Anchor '+q.skill+` · ${q.cost} coins`,'retention:coin:'+encodeURIComponent(q.skill),!!travelReason||!q.affordable,travelReason||(!q.affordable?'Earn the quoted native coins.':'')));}
        }
        if(section==='memory'&&s.intents?.length){body.append(node('h3','Anchored execution habits'),node('p','An earned habit can cross ordinary lives as knowledge. This copies no site, stock, body or active selection. Each life deliberately selects its own application; isolated challenges receive none.'));for(const q of s.intents)body.append(button(q.anchored?q.name+' anchored':`Anchor ${q.name} · ${q.cost} coins`,'intent:'+q.id,!!travelReason||!q.eligible||!q.affordable,travelReason||(!q.eligible?'Already anchored or isolated.':!q.affordable?'Earn the quoted coins.':'')));}
        if(section==='memory'&&s.laws?.some(q=>q.best>0)){body.append(node('h3','Remembered local laws'),node('p','Actual law depth can be anchored for a continuing self. An anchored depth supplies knowledge when shaping a new Mistglass vessel; it grants no nodes, reserve, comprehension minutes or body conditioning. Each local vessel chooses its own active law. Existing vessels keep their own learned depths.'));for(const q of s.laws)if(q.best>0)body.append(node('p',`${q.id}: best understood ${q.best}, anchored ${q.anchored}.`),button(`Anchor ${q.id} depth · ${q.cost} coins`,'law:'+q.id,!!travelReason||!q.eligible||!q.affordable,travelReason||(!q.eligible?'Understand a deeper law first.':!q.affordable?'Earn the quoted coins.':'')));}
        const memories=node('details');memories.append(node('summary',`Remembered learning · ${s.mastery.length} observed skills`),node('p','This connection carries reading, crafting, smelting and forging knowledge. Other training is remembered, but its bodily effects are not transferred to another embodiment by this form of the connection.'));
        for(const m of s.mastery)memories.append(node('p',`${m.skill}: ${Math.round(m.xp)} learned XP · ${m.usable?'compatible knowledge':'remembered; bodily effects not transferred'}`));
        for(const m of s.memories.slice(-12).reverse())memories.append(node('p',`${m.lifeLabel} · remembered: ${m.event.text}`));if(section==='memory'){memories.open=true;body.append(memories);}
    }
    const decorations=decorateActionComponents(view);render();
    return {render,destroy(){decorations.destroy();home.remove();view.remove();}};
}
