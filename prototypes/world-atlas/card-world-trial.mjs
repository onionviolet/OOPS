// Hypothetical developer encounter. Pure resolution is also used by tests and orders.
export const MOVES = [
    ['survey','Raise a camp plot'], ['search','Search the roadside cache'],
    ['gate','Use the key at the side gate'], ['trade','Trade the key for two land'],
    ['spillway','Turn the spillway wheel'], ['guard','Dislodge the road guard'],
    ['keeper','Dislodge the gate keeper'], ['warden','Dislodge the Warden'], ['road','Take the cleared road'],
];
const names = Object.fromEntries(MOVES);
export function newTrial(bonus = 0,bonusKind = 'land') {
    return {bonus:bonus===1?1:0,bonusKind,turn:1,land:bonus===1&&bonusKind==='land'?2:1,energy:bonus===1?2:1,
        progress:0,status:'playing',warden:true,guard:true,keeper:true,key:'unfound',spent:0,log:[]};
}
export const targetWard = (state,target) => target==='warden' ? 999 : state.warden ? 3 : 0;
export function moveQuote(state,move) {
    const cost = ['guard','keeper','warden'].includes(move) ? 1+targetWard(state,move)
        : ['gate','spillway'].includes(move) ? 2 : ['survey','search'].includes(move) ? 1 : 0;
    let reason = state.status!=='playing' ? (state.status==='won'?'The caravan has crossed.':'Nightfall has closed the crossing.')
        : !names[move] ? 'Unknown move.'
        : ['guard','keeper','warden'].includes(move)&&!state[move] ? 'That opponent has already left.'
        : move==='search'&&state.key!=='unfound' ? 'The cache is empty; the key was already found.'
        : ['gate','trade'].includes(move)&&state.key!=='carried' ? 'You need the carried copper key.'
        : move==='road'&&(state.guard||state.keeper) ? 'Both road posts must be cleared first.'
        : cost>state.energy ? `${names[move]} needs ${cost} energy; ${state.energy} ready. Nothing spent.` : null;
    return {cost,ok:!reason,reason};
}
export function takeMove(state,move) {
    const quote=moveQuote(state,move);
    if(!quote.ok)return {state,ok:false,reason:quote.reason,cost:quote.cost};
    const next=structuredClone(state),ward=['guard','keeper','warden'].includes(move)?targetWard(state,move):0;
    next.energy-=quote.cost;next.spent+=quote.cost;
    let effect,dialogue;
    switch(move) {
    case 'survey': next.land++;effect='One land added for the next refresh.';dialogue='Keeper: “Another camp plot. Our posts stay here.”';break;
    case 'search': next.key='carried';effect='Found: copper key. Carry it, use it, or trade it.';dialogue='You: “A copper key under the cache lid.”';break;
    case 'gate': next.key='used';next.progress+=2;effect='Key consumed; side route advanced two steps.';dialogue='Warden: “That door opens beside my road. My seal still stands.”';break;
    case 'trade': next.key='traded';next.land+=2;effect='Key traded away; two land added for the next refresh.';dialogue='Roadside buyer: “The key for two camp plots. Agreed.”';break;
    case 'spillway': next.progress++;effect='The waterwheel carries the caravan one step. No opponent targeted.';dialogue='Guard: “The wheel can turn while we hold the road.”';break;
    case 'warden': next.warden=false;effect=`Paid base 1 + ward ${ward}; Warden removed. Its maintained ally wards end.`;dialogue='You: “The seal is out. The two posts are still occupied.”';break;
    case 'guard':case 'keeper':next[move]=false;effect=`Paid base 1 + ward ${ward}; ${move==='guard'?'road guard':'gate keeper'} removed.`;dialogue=next.warden?'Warden: “That payment covered one ally. My own ward remains.”':'You: “No maintained ward remains on that post.”';break;
    case 'road':next.progress=3;effect='Both posts are empty; the caravan takes the road.';dialogue='You: “The posts are clear. Bring the cart.”';break;
    }
    // A speaker must still be here to witness the move.
    if(move==='gate'&&!next.warden)dialogue='You: “The key opens a side route.”';
    if(move==='spillway'&&!next.guard)dialogue='You: “The turning wheel carries the cart onward.”';
    if(move==='survey'&&!next.keeper)dialogue='You: “Another camp plot is ready for the next refresh.”';
    next.log.push({turn:state.turn,move,cost:quote.cost,ward,effect,dialogue});
    if(next.progress>=3)next.status='won';
    else if(state.turn>=8)next.status='lost';
    else {next.turn++;next.energy=next.land;}
    return {state:next,ok:true,cost:quote.cost,reason:next.status==='won'?'Caravan crossed. Order complete.':next.status==='lost'?'Nightfall closed the crossing after eight moves.':null};
}
export function newOrder({mode='key',move='spillway',repeats=3,budget=12}={}) {
    if(!['key','trade','repeat'].includes(mode)||!names[move]||!Number.isInteger(repeats)||repeats<1||repeats>8||!Number.isInteger(budget)||budget<0||budget>1000)throw Error('Invalid order terms');
    return {mode,move,repeats,budget,spent:0,completed:0,running:true,reason:null};
}
export function stopOrder(order,reason='Stopped by you. Settled moves and spending are kept.') {return {...order,running:false,reason};}
function nextOrderedMove(state,order) {
    if(order.mode==='repeat')return {move:order.move};
    if(order.mode==='key') {
        if(state.key==='traded')return {reason:'The key was traded. This key-route order will not choose a different method.'};
        return {move:state.key==='unfound'?'search':state.key==='carried'?(state.land<2?'survey':'gate'):state.land<2?'survey':'spillway'};
    }
    if(!state.guard&&!state.keeper)return {move:'road'};
    if(state.key==='used')return {reason:'The key was used. This trade-and-clear order will not choose a different method.'};
    if(state.key==='unfound')return {move:'search'};
    if(state.key==='carried')return {move:'trade'};
    const target=state.guard?'guard':'keeper';
    return {move:state.land<1+targetWard(state,target)?'survey':target};
}
export function stepOrder(state,order) {
    if(!order.running)return {state,order};
    const halt=reason=>({state,order:stopOrder(order,reason)});
    if(state.status!=='playing')return halt(state.status==='won'?'Caravan crossed. Order complete.':'Nightfall closed the crossing.');
    if(order.mode==='repeat'&&order.completed>=order.repeats)return halt(`Completed ${order.repeats} selected repeats.`);
    const next=nextOrderedMove(state,order);if(next.reason)return halt(next.reason);
    const quote=moveQuote(state,next.move);if(!quote.ok)return halt(quote.reason);
    if(order.spent+quote.cost>order.budget)return halt(`Energy ceiling ${order.budget} would be exceeded; ${order.spent} spent. Next move not taken.`);
    const result=takeMove(state,next.move),advanced={...order,spent:order.spent+result.cost,completed:order.completed+1};
    return {state:result.state,order:result.reason?stopOrder(advanced,result.reason)
        :order.mode==='repeat'&&advanced.completed>=order.repeats?stopOrder(advanced,`Completed ${order.repeats} selected repeats.`):advanced};
}

// No imports or DOM access at module load: the same model runs in Node and the view.
export function cardWorldTrial({main}) {
    const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;if(cls)n.className=cls;return n;};
    const root=el('section',null,'sheet');root.dataset.cardTrial='';
    root.append(el('h2','Canal crossing · card-world trial'),el('p','Hypothetical balance prototype. Separate from the native Quiet Faculty slice. Each move settles one turn; land refreshes energy afterward. Get the caravan to 3 route steps before nightfall ends turn 8.'));
    const rules=el('details');rules.append(el('summary','Same opponents and rules in both starts'),el('p','Warden: own printed ward 999. While present, it gives each teammate ward 3, without adding that aura to itself. Dislodge costs base 1 plus the actual target’s ward: Warden 1000, each ally 4. Removing the source ends its maintained grants. No enemy scaling.'),el('p','Spillway and side-gate actions move the caravan without targeting a card; they do not remove wards. A found copper key can be used for two route steps or traded for two land. One action per turn; no opponent attacks are simulated. These are authored rules for this short comparison.'));
    root.append(rules);
    const columns=el('div',null,'view');columns.style.gridTemplateColumns='repeat(2,minmax(0,1fr))';
    for(const bonus of [0,1]) {
        const panel=el('section',null,'sheet');panel.dataset.trialStart=bonus?'plus':'ordinary';
        const title=el('h3',bonus?'+1 start · extra land':'Ordinary start · 1 land / 1 energy');panel.append(title);
        let state=newTrial(bonus),order=null,timer=null,last='Choose a move or give an order. Nothing runs until you choose.';
        const bonusType=el('select');
        if(bonus){const label=el('label','Extra start resource ');bonusType.setAttribute('aria-label','Extra start resource');for(const [value,text]of [['land','+1 land: extra energy every refresh'],['energy','+1 opening energy: no extra land']]){const option=el('option',text);option.value=value;bonusType.append(option);}label.append(bonusType);panel.append(label);}
        const stats=el('p'),cards=el('p'),collection=el('p'),ready=el('p'),feedback=el('p');feedback.setAttribute('role','status');
        const manual=el('details');manual.append(el('summary','Choose one move'));manual.open=true;const moves=el('div',null,'actions');moves.style.display='grid';moves.style.gridTemplateColumns='repeat(2,minmax(0,1fr))';moves.style.gap='.3rem';
        const blocked=el('details'),blockedList=el('ul');blocked.append(el('summary','Why some moves are unavailable'),blockedList);manual.append(moves,blocked);
        const controls=el('details');controls.append(el('summary','Give an idle order · review terms'));controls.open=true;
        const form=el('div',null,'actions');
        function pick(label,options){const lab=el('label',label+' '),select=el('select');select.setAttribute('aria-label',label);for(const [value,text]of options){const o=el('option',text);o.value=value;select.append(o);}lab.append(select);form.append(lab);return select;}
        const mode=pick('Order method',[['key','Key route'],['trade','Trade key, clear both posts'],['repeat','Repeat selected move']]);
        const repeated=pick('Repeated move',MOVES),count=pick('Repeat count',Array.from({length:8},(_,i)=>[String(i+1),String(i+1)]));count.value='3';
        const ceiling=pick('Energy ceiling',[['0','0'],['3','3'],['6','6'],['9','9'],['12','12']]);ceiling.value='12';
        const terms=el('p');const run=el('button','Run selected order'),stop=el('button','Stop'),reset=el('button','Reset this start');run.type=stop.type=reset.type='button';
        form.append(run,stop,reset);controls.append(form,terms);
        const journal=el('details');journal.open=true;journal.append(el('summary','Observed moves and dialogue'));const log=el('ol');journal.append(log);
        panel.append(stats,cards,collection,ready,manual,controls,feedback,journal);columns.append(panel);
        function paint(){
            stats.textContent=`Turn ${state.turn}/8 · Land ${state.land} · Energy ${state.energy} · Route ${Math.min(3,state.progress)}/3 · Total spent ${state.spent} · ${state.status==='playing'?'Crossing open':state.status==='won'?'Caravan crossed':'Nightfall'}`;
            stats.dataset.trialStats='';cards.textContent=`Warden: ${state.warden?'present, ward 999':'removed'} · Guard: ${state.guard?'present, ward '+targetWard(state,'guard'):'removed'} · Keeper: ${state.keeper?'present, ward '+targetWard(state,'keeper'):'removed'}`;
            collection.textContent='Copper key: '+({unfound:'not found; search the cache to earn it',carried:'carried; use it or trade it',used:'consumed at the side gate',traded:'traded for two land'}[state.key]);
            ready.textContent='Ready now: '+(MOVES.filter(([move])=>moveQuote(state,move).ok).map(([,name])=>name).join('; ')||'no further moves');
            blockedList.replaceChildren();moves.replaceChildren();for(const [move,name]of MOVES){const quote=moveQuote(state,move),b=el('button',`${name} · ${quote.cost} energy`);b.type='button';b.dataset.trialMove=move;b.disabled=!quote.ok||!!order?.running;b.style.opacity=b.disabled?'.55':'1';b.title=quote.reason||'Settles one turn';if(!quote.ok)blockedList.append(el('li',name+': '+quote.reason));b.onclick=()=>{order=null;const result=takeMove(state,move);state=result.state;last=result.reason||state.log.at(-1)?.effect;paint();};moves.append(b);}
            terms.textContent=mode.value==='key'?'Authorized sequence: find the key; raise one plot if needed; use side gate; turn spillway. Consumes key. Stops at crossing, unavailable step, nightfall or energy ceiling.':mode.value==='trade'?'Authorized sequence: find and trade key; raise plots until the actual ward cost is affordable; dislodge both allies; take cleared road. Consumes key. Stops at crossing, unavailable step, nightfall or energy ceiling.':`Repeat ${names[repeated.value]}, up to ${count.value} times. Stops if the next move is unavailable, the ceiling would be exceeded, or the encounter ends.`;
            for(const select of [mode,repeated,count,ceiling,bonusType])select.disabled=!!order?.running;
            repeated.disabled||=mode.value!=='repeat';count.disabled||=mode.value!=='repeat';
            run.disabled=!!order?.running||state.status!=='playing';stop.disabled=!order?.running;
            feedback.textContent=order?`${order.running?'Order running':order.reason} · ${order.completed} moves settled · ${order.spent}/${order.budget} order energy spent.`:last;
            log.replaceChildren();for(const entry of state.log.slice(-6)){const li=el('li',`Turn ${entry.turn}: ${names[entry.move]} paid ${entry.cost}. ${entry.effect} ${entry.dialogue}`);log.append(li);}
        }
        function tick(){if(!root.isConnected){clearTimeout(timer);return;}const result=stepOrder(state,order);state=result.state;order=result.order;paint();if(order.running)timer=setTimeout(tick,600);}
        run.onclick=()=>{order=newOrder({mode:mode.value,move:repeated.value,repeats:Number(count.value),budget:Number(ceiling.value)});paint();timer=setTimeout(tick,600);};
        stop.onclick=()=>{clearTimeout(timer);order=stopOrder(order);paint();};
        reset.onclick=()=>{clearTimeout(timer);state=newTrial(bonus,bonusType.value||'land');order=null;last='Reset against the same three opponents.';paint();};
        bonusType.onchange=()=>{clearTimeout(timer);state=newTrial(bonus,bonusType.value);order=null;title.textContent=bonusType.value==='land'?'+1 start · extra land':'+1 start · opening energy only';last='Reset with the selected start, against the same opponents.';paint();};
        for(const select of [mode,repeated,count,ceiling])select.onchange=()=>paint();paint();
    }
    root.append(columns);main.append(root);
}
