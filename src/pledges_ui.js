import {ORDEAL_LOADS,ORDEAL_TERMS} from './pledges_content.js';
import {describeTrialChoice,TRIAL_HISTORY_LIMIT} from './trial_history.js';
import {definePanel} from './panel_kit.js';
import {chip, infoRow, reasonLine} from './ui/panel_sections.js';
// Desktop-first (UI target 1536/1920; mobile deferred). Two reference-dock panels (ST6) that read one projection;
// every button calls a domain command that revalidates and reports its own refusal text in place.
const node = (tag, text = '', className = '') => { const n = document.createElement(tag); if(text) n.textContent = text; if(className) n.className = className; return n; };
const cap = s => s[0].toUpperCase() + s.slice(1);
function shell(id, title, heading, intro, {collapse = false} = {}) {
    const panel = node('section', '', 'expedition_panel'); panel.id = id; panel.dataset.surfaceType = 'records';
    const body = node('div'), notice = node('p'); notice.setAttribute('role', 'status');
    let introNode = node('p', intro, 'expedition_preview');
    // A long intro sits behind a named disclosure so the rows come first (UR75).
    if(collapse) { introNode = node('details'); introNode.append(node('summary', 'How this works'), node('p', intro, 'expedition_preview')); }
    panel.append(node('h2', heading), introNode, body, notice);
    let signature = '';
    const act = (fn, done) => { try { const r = fn(); notice.textContent = typeof done === 'function' ? done(r) : done; } catch(e) { notice.textContent = e.message; } signature = ''; };
    const button = (label, attrs, onclick, disabled = false, title = '') => { const b = node('button', label); b.type = 'button'; b.disabled = disabled; b.title = title; Object.assign(b.dataset, attrs); b.onclick = onclick; return b; };
    return {panel, body, notice, act, button, changed: key => { const next = JSON.stringify([key, notice.textContent]); if(next === signature) return false; signature = next; return true; }};
}

export function createPledgesPanel({read, commands}) {
    const s = shell('pledges_panel', 'Vows and trials', 'Vows and tempering',
        'A vow trades freedom for strength and leaves a scar if broken. Tempering sets the body for good; a failed attempt wakes a heart demon that dulls you until you sit it out.', {collapse: true});
    let rerender = () => {},routineDraft=null,loadDraft=0,gradedOpen=false,routineOpen=false;
    function render() {
        const v = read();
        if(!s.changed([v.state.vows, v.state.trial,v.state.routine,v.routine,v.routineContext,v.sharedLearning, v.ordeal, v.rations, v.trial.ready, v.ready,loadDraft])) return;
        s.body.replaceChildren(node('h3', `Vows (${v.keptCount} of ${v.maxKept} kept)`));
        for(const vow of v.vows) {
            const full = v.keptCount >= v.maxKept;
            const state = vow.kept ? chip('kept', {tone: 'good'}) : vow.broken ? chip(`broken, scar ${vow.broken.scar}`, {tone: 'limit'}) : chip('not sworn');
            const actions = [];
            if(vow.kept) actions.push(s.button('Break vow', {breakVow: vow.id}, () => { s.act(() => commands.breakVow(vow.id), 'The vow is broken.'); render(); }));
            else {
                actions.push(s.button('Swear', {takeVow: vow.id}, () => { s.act(() => commands.takeVow(vow.id), 'You swear the vow.'); render(); }, full, full ? 'Break a kept vow first.' : ''));
                if(full) actions.push(reasonLine('Break a kept vow first.'));
            }
            const row = infoRow({label: cap(vow.id.replace('-', ' ')), chips: [chip(`+${vow.bonus / 10}% ${vow.track}`, {tone: 'accent'}), chip(`scar ${vow.scar} if broken`), state], actions, more: `${vow.text} ${vow.reason}`, moreLabel: 'The vow'});
            row.dataset.vow = vow.id; s.body.append(row);
        }
        const t = v.trial;
        s.body.append(node('h3', `Current body tempering: ${t.name}`));
        const learned = node('details'); learned.dataset.trialLearned = ''; const learnedCount = () => learned.children.length - 1; learned.append(node('summary', 'What this body has learned'));
        if((v.state.trial.bestStage||0)>v.state.trial.stage)learned.append(node('p',`Remembered qualification: stage ${v.state.trial.bestStage}. This embodiment must build its own conditioning; returning to the previously conditioned body restores its own stages.`));
        if(v.sharedLearning)learned.append(node('p',`Shared failure learning ${v.sharedLearning}: up to 10 stability against later quick trials and up to 3 composure saved per measured ordeal step. Fear and learning are separate; calming fear retains what you learned.`));
        if(v.state.trial.routeLessons){const lessons=node('details');lessons.dataset.trialExpertise='';lessons.append(node('summary','Learning from particular trials'));for(const [key,n]of Object.entries(v.state.trial.routeLessons)){const [kind,tier]=key.split('.');lessons.append(node('p',`${cap(kind)} stage ${tier}: ${n} retained task lessons. Up to three steady this particular quick trial or measured ordeal step; another route or stage uses its own experience.`));}learned.append(lessons);}
        if(v.state.trial.quality)learned.append(node('p',`Earned trial quality: ${v.state.trial.quality}. Each grade adds 0.5% strength and maximum health, alongside the stage bonus.`));
        if(learnedCount()) s.body.append(learned);
        const o=v.ordeal;
        if(o) {
            const group=node('div');group.dataset.ordeal='';
            group.append(node('h3',`${cap(o.kind)} ordeal · ${o.loadTerms.label.toLowerCase()} · turn ${o.turn} of ${o.limit}`),node('p',`${o.reason} Composure ${o.integrity}. Acceptable grade ${o.grade}. A collapse ends this attempt without advancing and adds ${o.failurePressure} heart-demon pressure. Rations are already spent.`));
            for(const [choice,label,cost] of [['steady','Take a measured step',o.steadyCost],['press','Press harder',o.pressCost]])group.append(s.button(`${label} · ${cost} composure`,{ordealStep:choice},()=>{s.act(()=>commands.stepOrdeal(choice),'The trial moves on.');render();}));
            group.append(s.button('Accept the current grade and advance',{ordealAccept:''},()=>{s.act(()=>commands.settleOrdeal(),r=>`Accepted grade ${r.grade}; the next stage holds.`);render();},!o.turn,!o.turn?'Take one step first.':''));
            group.append(s.button('Leave the rig · no grade, supplies stay spent',{ordealAbandon:''},()=>{s.act(()=>commands.abandonOrdeal(),'You leave the rig. No stage or grade is granted; laid-in supplies remain spent.');render();}));
            if(o.taskLessons)group.append(node('p',`${o.taskLessons} retained lessons of this ${o.kind} stage save up to ${Math.min(3,o.taskLessons)} measured-step composure, down to the ordinary one-point effort.`));
            s.body.append(group);
        }
        if(t.done) s.body.append(node('p', 'Nothing is left to temper in this slice.'));
        else {
            const line = infoRow({label: `Next: ${t.next}`, chips: [chip(`${t.risk / 10}% chance to fail`, {tone: t.risk >= 400 ? 'limit' : 'warn'}), chip(`vows steady ${t.stability}`), chip(`heart demon ${t.pressure}`, {tone: t.pressure ? 'limit' : ''}), chip(`scar ${t.scar}`)], more: `Vows steady it (${t.stability}); broken vows and the heart demon (${t.pressure}) worsen it (scar ${t.scar}).${t.tribulation ? ' This is a tribulation: a failure wakes the demon harder.' : ''}${t.taskLessons ? ` This quick stage has ${t.taskLessons} retained task lessons, adding ${Math.min(3,t.taskLessons)} stability to the shown chance.` : ''}`, moreLabel: 'What moves it'}); line.dataset.trialRisk = String(t.risk);
            s.body.append(line);
            const q = t.quote;
            s.body.append(infoRow({label: 'Rations', chips: [chip(`carry ${v.rations} stale bread`), chip(`lowest risk ${q.to / 10}% for ${q.cost}`, {tone: 'good'})], more: `Rations laid in cut the risk (up to ${t.maxUnits}, never to zero). The lowest risk, ${q.to / 10}%, costs ${q.cost} ${q.cost === 1 ? 'ration' : 'rations'} of stale bread.`, moreLabel: 'How rations help'}));
            const row = node('div');
            for(const n of [0, q.units].filter((x, i, a) => a.indexOf(x) === i)) {
                row.append(s.button(n ? `Temper, laying in ${n}` : 'Temper without rations', {temper: String(n)}, () => { s.act(() => commands.temper(n), r => r.passed ? 'The tempering holds.' : 'The tempering failed. The heart demon stirs.'); render(); }, !!o || !t.ready || v.rations < n, o?'Finish the active ordeal.':!t.ready ? 'Not ready yet.' : ''));
            }
            if(!t.ready) { const missing = node('details', '', 'ui-row-more'); missing.dataset.trialMissing = ''; missing.append(node('summary', `Not ready: ${t.shown.length} ${t.shown.length === 1 ? 'thing' : 'things'} missing`)); for(const line of t.shown) missing.append(node('p', line, 'expedition_requirements')); row.append(missing); }
            row.append(s.button('Guarded preparation · 5 rations',{guardedTempering:''},()=>{s.act(()=>commands.guarded(),'The guarded sequence holds. Five rations were spent; no performance grade was awarded.');render();},!!o||!t.ready||v.rations<5));
            s.body.append(row);
            if(!o){
                const graded=node('details');graded.dataset.gradedOrdeal='';graded.open=gradedOpen;graded.ontoggle=()=>{gradedOpen=graded.open;};graded.append(node('summary','Graded ordeal (optional)'));
                graded.append(node('p','Or choose a graded ordeal: each turn raises pressure. Accept early for a modest grade or risk a collapse for better conditioning. One laid-in ration gives four more composure; the practice frame closes after twelve turns.'));
                const loadLabel=node('label','Frame load '),loadSelect=node('select');loadSelect.setAttribute('aria-label','Frame load');
                ORDEAL_LOADS.forEach((terms,i)=>{const o=node('option',terms.label);o.value=String(i);loadSelect.append(o);});loadSelect.value=String(loadDraft);loadSelect.onchange=()=>{loadDraft=Number(loadSelect.value);render();};loadLabel.append(loadSelect);graded.append(loadLabel);
                const load=ORDEAL_LOADS[loadDraft];graded.append(node('p',`Tightening this rig adds ${load.pressure} pressure to every turn and ${load.score} performance score to each completed step. A collapse adds ${ORDEAL_TERMS.collapsePressure+load.collapse} fear in total. Only an accepted grade grants conditioning; leaving keeps supplies spent.`));
                const choices=node('div');
                for(const {kind,eligible,reason} of v.ordealKinds)for(const units of [0,1])choices.append(s.button(`${cap(kind)} ordeal${units?' · 1 ration':''}`,{ordealBegin:kind,ordealRations:String(units)},()=>{s.act(()=>commands.beginOrdeal(kind,units,loadDraft),'The staged ordeal begins.');render();},!eligible||!t.ready||v.rations<units,!eligible?reason:!t.ready?'Practice a qualifying skill first.':v.rations<units?'Needs one stale bread.':''));
                graded.append(choices);s.body.append(graded);
            }
        }
        if(v.state.trial.decisions?.length){
            const history=node('details');history.dataset.trialChoices='';history.append(node('summary',`Recent breakthrough choices (${v.state.trial.decisions.length}/${TRIAL_HISTORY_LIMIT})`),node('p','Recorded from your first attempt after this record became available. Earlier attempts are not reconstructed; the most recent 32 resolved choices are kept.'));
            const rows=node('ol');for(const h of [...v.state.trial.decisions].reverse())rows.append(node('li',describeTrialChoice(h)));history.append(rows);s.body.append(history);
        }else for(const h of (v.state.trial.history??[]).slice(-4).reverse())s.body.append(node('p',`${cap(h.kind)}: ${h.passed?`accepted grade ${h.grade}`:'collapsed'}, turn ${h.turn}.`,'expedition_preview'));
        if(t.pressure) {
            const calm = s.button('Sit with the fear (1 ration)', {calm: ''}, () => { s.act(() => commands.calm(), 'The fear eases a little.'); render(); }, v.rations < 1, v.rations < 1 ? 'You need a ration of stale bread.' : '');
            const row = infoRow({label: 'Heart demon', chips: [chip(`pressure ${t.pressure}`, {tone: 'limit'}), chip(`dulls strength and agility ${Math.min(30, t.pressure * 2)}%`, {tone: 'warn'})], actions: v.rations < 1 ? [calm, reasonLine('You need a ration of stale bread.')] : [calm]}); row.dataset.heartDemon = String(t.pressure);
            s.body.append(row);
        }
        if((v.state.trial.quality||0)>0){const r=v.state.routine;routineDraft ||= {maxRisk:r?.maxRisk??50,maxUnits:r?.maxUnits??5,reserve:r?.reserve??1};
            const routineBox=node('details');routineBox.dataset.trialRoutine='';routineBox.open=routineOpen;routineBox.ontoggle=()=>{routineOpen=routineBox.open;};routineBox.append(node('summary','Earned frame routine'));
            routineBox.append(node('p','A graded success teaches a bounded preparation routine. It attempts one ready stage on the next ordinary played tick, within your risk and ration limits, then stops for review. Missing means, travel, work or a waiting choice stop it. A zero-risk limit can use the five-ration guarded sequence if your limits fund it. It never chooses a new life for you.'));
            const status=node('p',r?.enabled?`Armed: maximum ${r.maxRisk/10}% failure risk, at most ${r.maxUnits} rations, keep ${r.reserve} untouched. Draft edits do not change these armed limits.`:'Routine is off. Editing the draft spends nothing and does not arm it.');status.dataset.routineStatus='';routineBox.append(status);
            const preview=node('p');preview.dataset.routinePreview='';preview.setAttribute('role','status');
            const updatePreview=()=>{try{const q=commands.previewRoutine(routineDraft),source=`Source: ${q.stock} carried Stale bread in your bag. Destination: this body's ${q.next||'next'} stage.`;preview.textContent=`Draft preview (not applied). ${source} `+(q.eligible?`${q.guarded?'Guarded preparation, no grade bonus':'Quick trial'}, ${q.risk/10}% failure risk. Spend ${q.cost} Stale bread; ${q.stock-q.cost} remain, keeping the ${routineDraft.reserve}-ration floor. Recheck means and choices on the next ordinary played tick, then stop for review.`:`Blocked: ${q.reason}`);}catch(e){preview.textContent=`Draft preview (not applied). ${e.message}`;}};
            for(const [id,label,scale,max] of [['maxRisk','Maximum failure risk (%)',10,100],['maxUnits','Maximum rations per attempt',1,5],['reserve','Rations to keep untouched',1,1000000]]){const labelNode=node('label',label+' '),input=node('input');input.type='number';input.min='0';input.max=String(max);input.value=String(routineDraft[id]/scale);input.setAttribute('aria-label',label);input.oninput=()=>{routineDraft[id]=Math.floor(Number(input.value)*scale);updatePreview();};labelNode.append(input);routineBox.append(labelNode);}
            updatePreview();routineBox.append(preview);
            routineBox.append(s.button(r?.enabled?'Stop routine':'Arm one bounded attempt',{trialRoutine:''},()=>{s.act(()=>commands.routine({...routineDraft,enabled:!r?.enabled}),r?.enabled?'Routine stopped.':'Limits saved. Review the current routine state above.');render();}));
            if(r?.last)routineBox.append(node('p',`Last stop: ${r.last.reason}`));if(r?.enabled&&v.routine&&!v.routine.eligible)routineBox.append(node('p',`Current block: ${v.routine.reason}`));s.body.append(routineBox);
        }
        s.notice.hidden = !s.notice.textContent;
    }
    rerender = render;
    definePanel({id: 'pledges', title: 'Vows and trials', role: 'records', node: s.panel, home: document.getElementById('main_content'),
        discovered: () => true, eligible: () => true, unavailableReason: () => 'Unavailable'});
    render();
    return {render: () => { render(); }};
}

export function createRuneBenchPanel({read, commands}) {
    const s = shell('rune_bench_panel', 'Rune bench', 'Rune bench',
        'Carve two to four runes on a wood tablet, one log per rune, and wear it. Order matters. An unlearned pairing is not forbidden, only costly: it fizzles and dulls your feet.');
    let strip = [],mode='attack',recipe='';
    function render() {
        const v = read(), r = v.runes;
        if(!s.changed([v.state.runes, v.state.talisman, v.wood, v.state.charged,mode,recipe,v.now >= (v.state.talisman?.until ?? 0), strip, v.ready])) return;
        s.body.replaceChildren(node('h3', `Pairs tried: ${r.coverage.tried} of ${r.total}`));
        for(const p of r.tried) { const row = node('p', `${p.a} then ${p.b}: ${r.effectText[p.effect] ?? p.effect}`); row.dataset.runePair = `${p.a}>${p.b}`; s.body.append(row); }
        if(!r.tried.length) s.body.append(node('p', 'Nothing tried yet. A tablet of just two runes shows what that pair does.', 'expedition_requirements'));
        const picker = node('div');
        for(const rune of r.runes) picker.append(s.button(cap(rune), {rune}, () => { if(strip.length < r.maxLength) strip = [...strip, rune]; s.act(() => 0, ''); render(); }, strip.length >= r.maxLength));
        picker.append(s.button('Clear', {runeClear: ''}, () => { strip = []; s.act(() => 0, ''); render(); }, !strip.length));
        s.body.append(picker);
        const cost = strip.length * r.perRune, pairs = strip.slice(1).map((b, i) => [strip[i], b]);
        const prev = node('p', strip.length ? `Tablet: ${strip.join(' → ')}. ${cost} wood needed (you carry ${v.wood}). ${pairs.map(([a, b]) => { const k = r.knownPair(a, b); return `${a}→${b}: ${k ? r.effectText[k] : 'untried'}`; }).join('; ')}.` : 'Choose runes in the order they will read.');
        prev.dataset.runePreview = ''; s.body.append(prev);
        s.body.append(s.button('Carve and wear', {carve: ''}, () => { s.act(() => commands.carve(strip), read => `Worn: ${Object.entries(read.effects).map(([e, n]) => `${r.effectText[e] ?? e} ${n}`).join(', ')}.`); strip = []; render(); }, strip.length < 2 || v.wood < cost, strip.length < 2 ? 'Choose at least two runes.' : v.wood < cost ? 'Not enough wood.' : ''));
        const choices=node('div');
        for(const id of ['attack','guard','mend','burst','siphon'])choices.append(s.button(`${id===mode?'Next: ':''}${cap(id)} charges`,{chargedMode:id},()=>{mode=id;render();}));
        s.body.append(choices,node('p','Choose the mode for your next carving. Charged strips are bound to that body; misses and full blocks keep their charges. Healing strips also keep their charge at full health.'));
        const help=node('details');help.dataset.chargedHelp='';help.append(node('summary','How the charged modes work'));
        for(const text of ['Attack: one charge adds power% to one landed hit. Guard: one charge cuts an incoming hit by power%, up to half.', 'Mend: one charge recovers up to half the strip’s power in missing health after a landed attack.', 'Burst: all remaining charges add their combined power% to one landed hit.', 'Siphon: one charge recovers power% of actual target health lost, up to 50%, and no more than your missing health.', 'Coherent adjacent rune pairs determine power. Complexity grade separately determines how many charges the same strip holds.'])help.append(node('p',text));s.body.append(help);
        s.body.append(s.button('Carve charged strip',{carveCharged:''},()=>{s.act(()=>commands.carveCharged(strip,mode),'Charged strip worn. Any prior charged strip is replaced.');strip=[];render();},strip.length<2||v.wood<cost));
        const t=v.state.charged;if(t)s.body.append(node('p',`${cap(t.mode)} strip: ${t.runes.join(' → ')}, complexity grade ${t.grade}, power ${t.power}, ${t.charges}/${t.maxCharges} charges; ${t.uses} resolved uses.`));
        const field=node('textarea');field.setAttribute('aria-label','Rune recipe');field.value=recipe;field.oninput=()=>{recipe=field.value;};s.body.append(field);
        s.body.append(s.button('Write current recipe',{runeExport:''},()=>{recipe=JSON.stringify({format:'oops.rune@1',runes:strip,mode});render();},strip.length<2));
        s.body.append(s.button('Read recipe into carving choices',{runeImport:''},()=>{s.act(()=>{const q=JSON.parse(recipe);if(q.format!=='oops.rune@1'||!Array.isArray(q.runes)||q.runes.length<2||q.runes.length>r.maxLength||q.runes.some(id=>!r.runes.includes(id))||!['attack','guard','mend','burst','siphon'].includes(q.mode))throw Error('Unsupported rune recipe.');strip=[...q.runes];mode=q.mode;},'Recipe selected. Carving still spends your owned wood.');render();}));
        if(r.talisman && r.minutesLeft > 0) { const w = node('p', `Wearing ${r.talisman.runes.join(' → ')}: ${Object.entries(r.talisman.effects).map(([e, n]) => `${r.effectText[e]} (${n})`).join(', ')}; ${r.minutesLeft} minutes left.`); w.dataset.worn = ''; s.body.append(w); }
        s.notice.hidden = !s.notice.textContent;
    }
    definePanel({id: 'rune-bench', title: 'Rune bench', role: 'records', node: s.panel, home: document.getElementById('main_content'),
        discovered: () => true, eligible: () => true, unavailableReason: () => 'Unavailable'});
    render();
    return {render};
}
